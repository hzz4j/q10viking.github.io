---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /FileSystem/
typora-root-url: ..\.vuepress\public
---

## 1. File类理解

### 1.1 File抽象表示

1. 它是**文件和目录路径名的抽象表示**
2. 文件和目录是可以**通过File封装成对象的**
3. 对于File而言，其封装的**并不是一个真正存在的文件，仅仅是一个路径名而已**。

```java
//  路径名的抽象表示
File file1 = new File("D:\\develop\\tmp\\file\\hello.txt");

//  在末尾多添加一个斜杠也没事
//  File parentFile = new File("D:\\develop\\tmp\\file\\");
File parentFile = new File("D:\\develop\\tmp\\file");
File file2 = new File(parentFile,"hello.txt");
```

### 1.2 File的构造方法

<img src="/images/filesystem/image-20201008234459052.png" alt="image-20201008234459052"  />

### 1.3 File的创建功能

<img src="/images/filesystem/image-20201008235026103.png" alt="image-20201008235026103" />

```java
//  路径名的抽象表示
File file = new File("D:\\develop\\tmp\\file\\world.txt");
//  创建一个文件，成功返回true,如果文件已经存在则返回false
System.out.println(file.createNewFile());
```

```java
//  路径名的抽象表示
File file = new File("D:\\develop\\tmp\\file\\java\\test");
//  创建一个多级文件夹
System.out.println(file.mkdirs());
```



### 1.4 File删除

该方法不支持多级删除

<img src="/images/filesystem/image-20201009000134530.png" alt="image-20201009000134530"  />



### 1.5 File的判断

<img src="/images/filesystem/image-20201009001031331.png" alt="image-20201009001031331"/>

### 1.6 File的获取

<img src="/images/filesystem/image-20201009000948556.png" alt="image-20201009000948556" />

```java
//  路径名的抽象表示
File file = new File(".\\Hello.java");
//  D:\develop\spring\.\Hello.java
System.out.println(file.getAbsolutePath());
//  .\Hello.java
System.out.println(file.getPath());
// Hello.java
System.out.println(file.getName());
```

### 1.7 玩法:递归遍历目录

> 通过递归完成遍历目录下所有内容，并把所有文件的绝对路径输出在控制台

```java
public class Main {
    public static void main(String[] args) throws IOException {
        File file = new File("D:\\develop\\tmp\\file");
        printAbsolutePath(file);
    }

    //  遍历该目录下的所有文件的绝对路径
    public static void printAbsolutePath(File file){
        if(file.isFile()){
            System.out.println(file.getAbsolutePath());
        }else{
            //  文件
            File[] files = file.listFiles();
            for(File anotherFile: files){
                printAbsolutePath(anotherFile);
            }
        }
    }
}
/**output
 * D:\develop\tmp\file\hello.txt
 * D:\develop\tmp\file\java\world.txt
 */
```

------



## 2. IO流

流的本质是数据传输

### 2.1 IO流的分类

#### 2.1.1 数据流向

1. 输入流：读数据
2. 输出流：写数据

#### 2.2.2 数据类型

1. 字节流
   1. 字节输入流
   2. 字节输出流
2. 字符流
   1. 字符输入流
   2. 字符输出流

#### 2.2.3 使用场景

1. 如果操作的是纯文本文件，优先使用字符流
2. 如果操作的是图片、视频、音频等二进制文件。优先使用字节流
3. 如果不确定文件类型，优先使用字节流。字节流是万能的流



### 2.2 字节流对象

####  2.2.1 字节流抽象基类

1. `InputStream`：这个抽象类是表示字节输入流的所有类的超类
2. `OutputStream`：这个抽象类是表示字节输出流的所有类的超类
3. 子类名特点：子类名称都是**以其父类名作为子类名的后缀**

### 2.3 字节流输出对象FileOutputStream

#### 2.3.1 写数据的步骤

1. 创建字节输出流对象
   1. **调用系统功能创建了文件**
   2. 创建字节输出流对象
   3. 让字节输出流对象指向文件
2. 调用字节输出流对象的写数据方法
3. 释放资源(关闭此文件输出流并释放与此流相关联的任何系统资源)

```java
/**
 * 1. 调用系统功能创建了文件
 * 2. 创建字节输出流对象
 * 3. 让字节输出流对象指向文件
 */
OutputStream out = new FileOutputStream(".\\world.txt");;

//  写入一个字节
int val = 97;   //  'a'的ascii码
out.write(97);

//  换行
out.write("\r\n".getBytes());

//  写入一个字节数组
byte[] sentence = "Hello World".getBytes();
out.write(sentence);

out.close();
```

#### 2.3.2 写数据的三种方式

<img src="/images/filesystem/image-20201009075906099.png" alt="image-20201009075906099" />

#### 2.3.3 换行

```shell
windows:\r\n
linux:\n
mac:\r
```

#### 2.3.4 追加

```java
// 如果第二个参数为true ，则字节将写入文件的末尾而不是开头
public FileOutputStream(String name,boolean append)
```



### 2.4 玩法: 复制文件

> 将文件进行复制可以是图片，文本，视频等

```java
    //  根据目的地，创建字节输出流对象
    OutputStream target = new FileOutputStream("D:\\develop\\tmp\\file\\video_copy.mp4");
    //  根据数据源，创建字节输入流对象
    InputStream src = new FileInputStream("D:\\develop\\tmp\\file\\video.mp4");

    //  复制数据
    byte[] content = new byte[1024];
    int len;
    while((len = src.read(content))!=-1){
        target.write(content,0,len);
    }

    //  关闭资源
    target.close();
    src.close();

```



## 3 File转流

```java
//  读取一个文件
File file = new File(path);
//  转化为流
InputStream inputStream = new FileInputStream(file);
//	InputStream inputStream = new FileInputStream(path)
//  指定文件
Reader reader =  new InputStreamReader(inputStream,"utf-8");
```

