---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /FileSystem/
typora-root-url: ..\.vuepress\public
---



## Path

[Path Operations (The Java™ Tutorials > Essential Java Classes > Basic I/O) (oracle.com)](https://docs.oracle.com/javase/tutorial/essential/io/pathOps.html)

### create path

::: tip

代表一个文件或者文件夹的路径

[Source Code PathsMain.java](https://github.com/Q10Viking/learncode/blob/main/filesystem/src/org/hzz/chapter02/PathsMain.java)

:::

```java
public class PathsMain {
    public static void main(String[] args) {
        String currentPathStr = System.getProperty("user.dir");
        System.out.println(currentPathStr);
        // create path  尽管这个路劲不存在，但是也不会报错
        Path logsPath = Paths.get(currentPathStr, "logs","foo.log");
        System.out.format("toString: %s%n", logsPath.toString());
        System.out.format("getFileName: %s%n", logsPath.getFileName());
        System.out.format("getName(0): %s%n", logsPath.getName(0));
        System.out.format("getNameCount: %d%n", logsPath.getNameCount());
        System.out.format("subpath(0,2): %s%n", logsPath.subpath(0,2));
        System.out.format("getParent: %s%n", logsPath.getParent());
        System.out.format("getRoot: %s%n", logsPath.getRoot());
        System.out.format("toUri: %s%n", logsPath.toUri());
    }
}
/**
 * D:\learncode\filesystem
 * toString: D:\learncode\filesystem\logs\foo.log
 * getFileName: foo.log
 * getName(0): learncode
 * getNameCount: 4
 * subpath(0,2): learncode\filesystem
 * getParent: D:\learncode\filesystem\logs
 * getRoot: D:\
 * toUri: file:///D:/learncode/filesystem/logs/foo.log
 */
```

### convert path

[Source Code ConvertPath.java](https://github.com/Q10Viking/learncode/blob/main/filesystem/src/org/hzz/chapter02/ConvertPath.java)

- 可以很方便将相对路径转换为绝对路径

```java
public class ConvertPath {
    public static void main(String[] args) throws IOException {

        // 设置相对路径，等价于 Paths.get("logs\\foo.log")
        Path logsPath = Paths.get("logs","foo.log");
        System.out.println(logsPath);
        System.out.println(logsPath.toAbsolutePath());
        System.out.println(logsPath.toUri());

        // 与toAbsolutePath不同的是，如果该路径不存在则会报错NoSuchFileException
        System.out.println(logsPath.toRealPath());
    }
}
/**
 * logs\foo.log
 * D:\learncode\filesystem\logs\foo.log
 * file:///D:/learncode/filesystem/logs/foo.log
 * Exception in thread "main" java.nio.file.NoSuchFileException: D:\learncode\filesystem\logs\foo.log
 */
```



### Join Two Path

::: tip

可以很方便将绝对路径拼接相对路径

[Source Code JoinTwoPath.java](https://github.com/Q10Viking/learncode/blob/main/filesystem/src/org/hzz/chapter02/JoinTwoPath.java)

:::

```java
public class JoinTwoPath {
    public static void main(String[] args) {
        Path path = Paths.get("D:\\learncode\\filesystem");
        // D:\learncode\filesystem\logs\foo.log
        System.out.format("%s %n",path.resolve("logs/foo.log"));
    }
}
```



### Creating a Path Between Two Paths

::: tip

两个路径之间的相对路径

[Source Code BetweenTwoPath.java](https://github.com/Q10Viking/learncode/blob/main/filesystem/src/org/hzz/chapter02/BetweenTwoPath.java)

:::

```java
public class BetweenTwoPath {
    public static void main(String[] args) {
        Path p1 = Paths.get("home");
        Path p3 = Paths.get("home/sally/bar");

        // 相对路径
        Path p1_to_p3 = p1.relativize(p3);  // sally\bar
        Path p3_to_p1 = p3.relativize(p1);  // ..\..
        Path p3_to_p3 = p3.relativize(p3);  // 为空

        System.out.format("%s%n %s%n %s%n",p1_to_p3,p3_to_p1,p3_to_p3);
    }
}
```



### Comparing Two Path

[Source Code ComparingTwoPath.java](https://github.com/Q10Viking/learncode/blob/main/filesystem/src/org/hzz/chapter02/ComparingTwoPath.java)

```java
public class ComparingTwoPath {
    public static void main(String[] args) {
        Path path = Paths.get("D:\\");
        Path otherPath = Paths.get("D:\\learncode\\filesystem\\logs\\foo.log");
        Path beginPath = Paths.get("C:\\");
        Path endPath = Paths.get("foo.log");

        if(path.equals(otherPath)){
            // equality logic here
            System.out.println("equal");
        }

        if(otherPath.startsWith(beginPath)){
            // path begins with "C:\"
            System.out.println("starts with " + beginPath);
        }

        if(otherPath.endsWith(endPath)){
            // path ends with "foo.log"
            System.out.println("end with " + endPath);
        }
    }
}
```



### iterator path name

::: tip

不包含root directory

[Source Code IteratorPathName.java](https://github.com/Q10Viking/learncode/blob/main/filesystem/src/org/hzz/chapter02/IteratorPathName.java)

:::

```java
public class IteratorPathName {
    public static void main(String[] args) {
        Path path = Paths.get("D:\\learncode\\filesystem\\logs\\foo.log");
        // The first element returned is that closest to the root in the directory tree.
        for (Path name: path){
            System.out.println(name);
        }
    }
}
/**
 * learncode
 * filesystem
 * logs
 * foo.log
 */
```





## File

在java nio中提供了Files工具类结合使用Path，对文件和文件夹进行操作。

### checking file

- 检查文件是否存在 [Source Code CheckingFile.java](https://github.com/Q10Viking/learncode/blob/main/filesystem/src/org/hzz/chapter03/CheckingFile.java)

```java
public class CheckingFile {
    public static void main(String[] args) throws IOException {
        Path path = Paths.get("imgs/avatar.jpg");
        Path path2 = Paths.get("imgs/avatar.jpg");
        System.out.format("file is exist? %s%n",Files.exists(path, LinkOption.NOFOLLOW_LINKS));
        System.out.format("Is the same file? %s%n",Files.isSameFile(path,path2));
    }
}
```



### delete file

- 在删除文件夹的时候，如果该文件夹不为空，则不会进行删除

  [Source Code DeleteFile.java](https://github.com/Q10Viking/learncode/blob/main/filesystem/src/org/hzz/chapter03/DeleteFile.java)

```java
public class DeleteFile {
    public static void main(String[] args) {
        Path dir = Paths.get("tmp\\chapter03");
        Path fileA = dir.resolve("a.txt");

        try {
            // 如果文件不为空，会报错 DirectoryNotEmptyException
            Files.delete(dir);
//            Files.delete(fileA);
        }  catch (NoSuchFileException x) {
            System.err.format("%s: no such" + " file or directory%n", dir);
        } catch (DirectoryNotEmptyException x) {
            System.err.format("%s not empty%n", dir);
        } catch (IOException x) {
            // File permission problems are caught here.
            System.err.println(x);
        }
    }
}
```



### copy file

- 注意如果copy的是文件夹，那么文件夹下面的文件不会copy过去。

  [Source Code CopyFile.java](https://github.com/Q10Viking/learncode/blob/main/filesystem/src/org/hzz/chapter03/CopyFile.java)

```java
public class CopyFile {
    public static void main(String[] args) throws IOException {
        Path source = Paths.get("tmp\\chapter03\\b.txt");
        Path target = Paths.get("tmp\\chapter03\\b-copy.txt");
        // CopyOption see: https://docs.oracle.com/javase/tutorial/essential/io/copy.html
        Files.copy(source,target, StandardCopyOption.REPLACE_EXISTING);
    }
}
```



### move file

- 注意，在移动文件夹的时候，不像copy文件夹那样，move会把文件夹下面的文件一起移动

  [Source Code MoveDir.java](https://github.com/Q10Viking/learncode/blob/main/filesystem/src/org/hzz/chapter03/CopyDir.java)

```java
public class MoveDir {
    public static void main(String[] args) throws IOException {
        Path source = Paths.get("tmp\\chapter03");
        Path target = Paths.get("tmp\\chapter03-2\\chapter03");

        Files.move(source,target);
    }
}
```



### file basic attributes

[Source Code BasicAttrFile.java](https://github.com/Q10Viking/learncode/blob/main/filesystem/src/org/hzz/chapter03/BasicAttrFile.java)

```java
public class BasicAttrFile {
    public static void main(String[] args) throws IOException {
        Path path = Paths.get("imgs\\avatar.jpg");
        BasicFileAttributes attr = Files.readAttributes(path, BasicFileAttributes.class);
        System.out.println("creationTime: " + attr.creationTime());
        System.out.println("lastAccessTime: " + attr.lastAccessTime());
        System.out.println("lastModifiedTime: " + attr.lastModifiedTime());

        System.out.println("isDirectory: " + attr.isDirectory());
        System.out.println("isOther: " + attr.isOther());
        System.out.println("isRegularFile: " + attr.isRegularFile());
        System.out.println("isSymbolicLink: " + attr.isSymbolicLink());
        System.out.println("size: " + attr.size());
    }
}
/**
 * creationTime: 2022-10-09T07:29:07.22373Z
 * lastAccessTime: 2022-10-09T07:29:07.22373Z
 * lastModifiedTime: 2022-09-21T17:23:44.518Z
 * isDirectory: false
 * isOther: false
 * isRegularFile: true
 * isSymbolicLink: false
 * size: 39364
 */
```



### file store

- 打印该文件所在磁盘的使用情况

  [Source Code FileStoreAttr.java](https://github.com/Q10Viking/learncode/blob/main/filesystem/src/org/hzz/chapter03/FileStoreAttr.java)



```java
public class FileStoreAttr {
    public static void main(String[] args) throws IOException {
        Path path = Paths.get("imgs\\avatar.jpg");
        FileStore store = Files.getFileStore(path);
        long total = store.getTotalSpace() / 1024 / 1024 / 1024;
        long used = (store.getTotalSpace() -
                store.getUnallocatedSpace()) / 1024 / 1024 / 1024;
        long avail = store.getUsableSpace() / 1024 / 1024 / 1024;

        // D:\learncode\filesystem\imgs\avatar.jpg
        // 实际上打印的是这个文件所在的磁盘的空间
        // total = 789G ; used = 781G ; avail = 8G
        System.out.printf("total = %dG ; used = %dG ; avail = %dG%n",total,used,avail);
    }
}
```



## 读写文件⭐

![img](/images/filesystem/io-fileiomethods.gif)



### 读取小文件

一次性读取[Source Code ReadSmallFile.java](https://github.com/Q10Viking/learncode/blob/main/filesystem/src/org/hzz/chapter04/ReadSmallFile.java)

```java
public class ReadSmallFile {
    public static void main(String[] args) throws IOException {
        Path path = Paths.get("tmp\\chapter04\\small.txt");

        byte[] bytes = Files.readAllBytes(path);
        System.out.println(new String(bytes));
        System.out.println("-------------------------------");
        List<String> lines = Files.readAllLines(path);
        lines.forEach(line -> System.out.println(line));
    }
}
/**output
 * 静默 Learning Java NIO File
 * 与超过 800 万 开发者一起发现、参与优秀开源项目，私有仓库也完全免费 ：）
 * -------------------------------
 * 静默 Learning Java NIO File
 * 与超过 800 万 开发者一起发现、参与优秀开源项目，私有仓库也完全免费 ：）
 */
```



### 写小文件

一次性写小文件[Source Code WriteSmallFile.java](https://github.com/Q10Viking/learncode/blob/main/filesystem/src/org/hzz/chapter04/WriteSmallFile.java)

```java
public class WriteSmallFile {
    private static final String MSG = String.join("\n",
            "静默 Learning Java NIO File",
            "与超过 800 万 开发者一起发现、参与优秀开源项目，私有仓库也完全免费 ：）");
    public static void main(String[] args) throws IOException {
        Path path = Paths.get("tmp\\chapter04\\small.txt");
        Files.write(path,MSG.getBytes(StandardCharsets.UTF_8));

        String[] lines = MSG.split("\\n");
        Files.write(path,Arrays.asList(lines), StandardOpenOption.APPEND);
    }
}
```



### Buffered I/O Methods for Text Files

处理字符文字的IO

#### read  text file

[Source Code ReadTextFile.java](https://github.com/Q10Viking/learncode/blob/main/filesystem/src/org/hzz/chapter04/ReadTextFile.java)

```java
public class ReadTextFile {
    public static void main(String[] args) throws IOException {
        Path path = Paths.get("tmp\\chapter04\\small.txt");
        try(BufferedReader reader = Files.newBufferedReader(path)){
            String line = null;
            while((line = reader.readLine()) != null){
                System.out.println(line);
            }
        }
    }
}
```



#### write text file

[Source Code WriteTextFile.java](https://github.com/Q10Viking/learncode/blob/main/filesystem/src/org/hzz/chapter04/WriteTextFile.java)

```java
public class WriteTextFile {
    private static final String MSG = String.join("\n",
            "静默 Learning Java NIO File",
            "与超过 800 万 开发者一起发现、参与优秀开源项目，私有仓库也完全免费 ：）");

    public static void main(String[] args) throws IOException {
        Path path = Paths.get("tmp\\chapter04\\small.txt");
        try(BufferedWriter writer = Files.newBufferedWriter(path)){
            writer.write(MSG);
        }
    }
}
```



### Stream IO

#### read file & write file

> To flush a stream manually, invoke its flush method.  The flush method is valid on any output stream, but has no effect unless the stream is buffered.

[Source Code ReadAndWriteStreamFile.java](https://github.com/Q10Viking/learncode/blob/main/filesystem/src/org/hzz/chapter04/ReadAndWriteStreamFile.java)

```java
/**
 * Methods for Unbuffered Streams and Interoperable with java.io APIs
 * https://docs.oracle.com/javase/tutorial/essential/io/file.html#streams
 */
public class ReadAndWriteStreamFile {
    public static void main(String[] args) {
        Path readPath = Paths.get("tmp\\chapter04\\avatar.jpg");
        Path writePath = Paths.get("tmp\\chapter04\\avatar-copy.jpg");

        try(InputStream in = Files.newInputStream(readPath);
            OutputStream out = Files.newOutputStream(writePath)){

            BufferedInputStream bin = new BufferedInputStream(in);
            BufferedOutputStream bout = new BufferedOutputStream(out);
            byte[] contents = new byte[1024];
            int length = 0;
            while((length = bin.read(contents)) != -1){
                bout.write(contents,0,length);
            }
            // To flush a stream manually, invoke its flush method.
            // The flush method is valid on any output stream, but has no effect unless the stream is buffered.
            bout.flush();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```



### Channel IO

> Specifying `READ` opens the channel for reading. Specifying `WRITE` or `APPEND` opens the channel for writing. If none of these options are specified, then the channel is opened for reading.

[Source Code ReadAndWriteByteChannel.java](https://github.com/Q10Viking/learncode/blob/main/filesystem/src/org/hzz/chapter04/ReadAndWriteByteChannel.java)

```java
public class ReadAndWriteByteChannel {
    public static void main(String[] args) throws IOException {
        Path readPath = Paths.get("tmp\\chapter04\\small.txt");
        Path writePath = Paths.get("tmp\\chapter04\\small-channel.txt");

        try(SeekableByteChannel inChannel = Files.newByteChannel(readPath);
            SeekableByteChannel outChannel = Files.newByteChannel(writePath, StandardOpenOption.CREATE,StandardOpenOption.WRITE)){
            final int BUFFER_CAPACITY = 10;
            ByteBuffer byteBuffer = ByteBuffer.allocate(BUFFER_CAPACITY);

            while(inChannel.read(byteBuffer) > 0){
                // change to read model
                byteBuffer.flip();
                outChannel.write(byteBuffer);
                byteBuffer.clear();
            }
        }
    }
}
```



### create temp file ⭐

[The Java SecureRandom Class | Baeldung](https://www.baeldung.com/java-secure-random)

底层的随机数是通过java.security.SecureRandom.nextLong生成的

[Source Code CreateTempFile.java](https://github.com/Q10Viking/learncode/blob/main/filesystem/src/org/hzz/chapter04/CreateTempFile.java)

```java
public class CreateTempFile {
    public static void main(String[] args) throws IOException {
        // 前缀，后缀
        Path tempFile = Files.createTempFile(null, ".myapp");
        System.out.format("The temporary file" +
                " has been created: %s%n", tempFile);

        Path path = Paths.get("tmp\\chapter04");
        Path tempFile2 = Files.createTempFile(path,"test", ".myapp");
        System.out.format("The temporary file" +
                " has been created: %s%n", tempFile2);
    }
}
/**
 * The temporary file has been created: C:\Users\11930\AppData\Local\Temp\2585945490360134177.myapp
 * The temporary file has been created: tmp\chapter04\test831222729464056259.myapp
 */
```



## Random Access File

通过设置position来改变

[Source Code RandomAccessFilesDemo.java](https://github.com/Q10Viking/learncode/blob/main/filesystem/src/org/hzz/chapter06/RandomAccessFilesDemo.java)

```java
public class RandomAccessFilesDemo {
    public static void main(String[] args) throws IOException {
        Path path = Paths.get("tmp\\chapter06\\data.txt");
        String msg = "I was here!\n";

        ByteBuffer out = ByteBuffer.wrap(msg.getBytes(StandardCharsets.UTF_8));
        ByteBuffer copy = ByteBuffer.allocate(12);

        //RandomAccessFile file = new RandomAccessFile("tmp\\chapter06\\data.txt", "rw");
        //FileChannel channel = file.getChannel();

        try(FileChannel channel = FileChannel.open(path, StandardOpenOption.READ,
                                StandardOpenOption.WRITE)){
            // read the first 12 byte of the file
            int nread = 0;
            do {
                nread = channel.read(copy);
            }while (nread != -1 && copy.hasRemaining());


            // write "I was here\n" at the beginning of file
            channel.position(0);
            while(out.hasRemaining())
                channel.write(out);

            out.rewind();
            // move to the end of the file .Copy 12 bytes to
            // the end of the file.then write "I was here!\n" again

            channel.position(channel.size()-1);
            copy.flip();
            while(copy.hasRemaining())
                channel.write(copy);
            while(out.hasRemaining())
                channel.write(out);
        }
    }
}
```

原来的文件

```txt
I want to become fullstack developer.
Today,I master Javascript and Java programming language.
```

程序执行的结果

```txt
I was here!
come fullstack developer.
Today,I master Javascript and Java programming languageI want to beI was here!

```



::: tip

java7之前的RandomAccessFile在java8中的nio中可以直接使用FileChannel

:::

```java
RandomAccessFile file = new RandomAccessFile("tmp\\chapter06\\data.txt", "rw");
FileChannel channel = file.getChannel();

// 等价与
Path path = Paths.get("tmp\\chapter06\\data.txt");
FileChannel.open(path, StandardOpenOption.READ, StandardOpenOption.WRITE)
```





## 文件系统

::: tip

Microsoft Windows supports multiple root nodes.

[Source Code](https://github.com/Q10Viking/learncode/blob/main/filesystem/src/org/hzz/chapter01/FileSystemDemo.java)

:::

```java
import java.io.IOException;
import java.nio.file.FileStore;
import java.nio.file.FileSystem;
import java.nio.file.FileSystems;

public class FileSystemDemo {
    public static void main(String[] args) throws IOException {
        FileSystem fileSystem = FileSystems.getDefault();

        fileSystem.getRootDirectories().forEach(System.out::println);

        for (FileStore store: fileSystem.getFileStores()) {
            long total = store.getTotalSpace() / 1024;
            long used = (store.getTotalSpace() - store.getUnallocatedSpace()) / 1024;
            long avail = store.getUsableSpace() / 1024;
            System.out.format("%-20s %12d %12d %12d%n", store, total, used, avail);
        }
    }
}
/**
 * C:\
 * D:\
 * E:\
 * F:\
 * G:\
 * H:\
 * Windows (C:)            123018236     99776024     23242212
 * DATA (D:)               828327932    819870516      8457416
 * Software (E:)           133943292     97342816     36600476
 * RECOVERY (F:)            14488572     12825860      1662712
 * GRMCULXFRER (G:)        976762452    803494568    173267884
 */
```

![image-20221009001834310](/images/filesystem/image-20221009001834310.png)

