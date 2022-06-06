---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /networkDevelopByJava/
---



## Protocol

::: tip

the protocol—the language that **the client and server have agreed to use to communicate.**

本demo模仿官网的[KnockKnockProtocol) (oracle.com)](https://docs.oracle.com/javase/tutorial/networking/sockets/clientServer.html)

:::

客户端与服务端基于knockknock协议**有效沟通**的场景

```
server: Knock! Knock!
client: Who's there?
server: Turnip
client: Turnip who?
server: Turnip the heat, it's cold in here! Want another? (y/n)
client: y
server: Knock! Knock!
client: Who's there?
server: Little Old Lady
client: input some meanless msg
server: You're supposed to say "Little Old Lady who?"! Try again. Knock! Knock!
client: Who's there?
server: Little Old Lady
client: Little Old Lady who?
server: I didn't know you could yodel! Want another? (y/n)
client: n
server: Bye.
```



## KnockKnockProtocol

::: tip

该协议根据客户端的状态流转，来处理信息

:::

::: details 点击查看代码

```java {4-7,11}
package org.hzz.knockknock.protocol;

public class KnockKnockProtocol {
    private static final int WAITING = 0;
    private static final int SENTKNOCKKNOCK = 1;
    private static final int SENTCLUE = 2;
    private static final int ANOTHER = 3;

    private static final int NUMJOKES = 5;

    private int state = WAITING;
    private int currentJoke = 0;

    private String[] clues = { "Turnip", "Little Old Lady", "Atch", "Who", "Who" };
    private String[] answers = {
            "Turnip the heat, it's cold in here!",
            "I didn't know you could yodel!",
            "Bless you!",
            "Is there an owl in here?",
            "Is there an echo in here?" };

    public String processInput(String theInput) {
        String theOutput = null;

        if (state == WAITING) {
            theOutput = "Knock! Knock!";
            state = SENTKNOCKKNOCK;
        } else if (state == SENTKNOCKKNOCK) {
            if (theInput.equalsIgnoreCase("Who's there?")) {
                theOutput = clues[currentJoke];
                state = SENTCLUE;
            } else {
                theOutput = "You're supposed to say \"Who's there?\"! " +
                        "Try again. Knock! Knock!";
            }
        } else if (state == SENTCLUE) {
            if (theInput.equalsIgnoreCase(clues[currentJoke] + " who?")) {
                theOutput = answers[currentJoke] + " Want another? (y/n)";
                state = ANOTHER;
            } else {
                theOutput = "You're supposed to say \"" +
                        clues[currentJoke] +
                        " who?\"" +
                        "! Try again. Knock! Knock!";
                state = SENTKNOCKKNOCK;
            }
        } else if (state == ANOTHER) {
            if (theInput.equalsIgnoreCase("y")) {
                theOutput = "Knock! Knock!";
                if (currentJoke == (NUMJOKES - 1))
                    currentJoke = 0;
                else
                    currentJoke++;
                state = SENTKNOCKKNOCK;
            } else {
                theOutput = "Bye.";
                state = WAITING;
            }
        }
        return theOutput;
    }
}
```

:::



## Server

::: tip 注意

:one: 服务端与客户端结束会话的方式

:two: 结束会话后释放资源的方式

:::

:::: code-group
::: code-group-item KKMultiServerThread

```java {12-16,22,24-26,28}
public class KKMultiServerThread extends Thread {
    private final Socket socket;
    private final KnockKnockProtocol protocol;

    public KKMultiServerThread(Socket socket) {
        this.socket = socket;
        this.protocol = new KnockKnockProtocol();
    }

    @Override
    public void run() {
        try (
                PrintWriter out = new PrintWriter(socket.getOutputStream(), true);
                BufferedReader in = new BufferedReader(
                        new InputStreamReader(socket.getInputStream()))
        ) {
            String inMsg, outMsg;
            outMsg = protocol.processInput(null);
            out.println(outMsg);

            while ((inMsg = in.readLine()) != null) {
                outMsg = protocol.processInput(inMsg);
                out.println(outMsg);
                if (outMsg.equals("Byte.")) {
                    break;
                }
            }
            socket.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

:::
::: code-group-item KKMultiServer

```java {5,6-8}
public class KKMultiServer {
    public static void main(String[] args) {
        boolean listening = true;
        int portNumber = 8381;
        try (ServerSocket serverSocket = new ServerSocket(portNumber)) {
            while (listening) {
                new KKMultiServerThread(serverSocket.accept()).start();
            }
        } catch (IOException e) {
            System.err.println("Could not listen on port " + portNumber);
            System.exit(-1);
        }
    }
}
```

:::
::::

## KnockKnockClient

::: details 点击查看代码

```java {11-21}
public class KnockKnockClient {
    public static void main(String[] args) {
        try (
                Socket socket = new Socket(Inet4Address.getLocalHost(), 8381);
                PrintWriter out = new PrintWriter(socket.getOutputStream(), true);
                BufferedReader in = new BufferedReader(
                        new InputStreamReader(socket.getInputStream()));
                BufferedReader stdIn = new BufferedReader(
                        new InputStreamReader(System.in));
        ) {
            String fromServer, fromUser;
            while ((fromServer = in.readLine()) != null) {
                System.out.println("server: " + fromServer);
                if (fromServer.equals("Bye.")) {
                    break;
                }
                System.out.print("client: ");
                fromUser = stdIn.readLine();
                if (fromUser != null) {
                    out.println(fromUser);
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

::: 



## 结束通话的方式

1. 客户端根据该协议，执行到ANOTHER流转时，不输入y，代表不继续会话，服务器发送**Bye**给客户端，
   1. 客户端结束循环，释放资源。
   2. 服务端处理客户端的线程跳出循环，关闭socket,释放inStream,outStream资源
2. 客户端强制关闭。服务端通过**readLine() == null** 的显示来监听到客户端断开了连接



## Reference

[Writing the Server Side of a Socket (The Java™ Tutorials > Custom Networking > All About Sockets) (oracle.com)](https://docs.oracle.com/javase/tutorial/networking/sockets/clientServer.html)

