---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /concurrency/
typora-root-url: ..\.vuepress\public
---

## Data Race

<img src="/images/concurrency/image-20210630001802371.png" alt="image-20210630001802371"  />

### Accessing a shared variable

```java
// shared variable
int x = 0;

Runnable task1 = () -> x = 3 ;
Runnable task2 = () -> x = 7 ;

new Thread(task1).start();
new Thread(task2).start();
```

![image-20210630001503288](/../../../../saas-yong/fullstack/Java架构师之路/Java并发编程/imgs/image-20210630001503288.png)

### long vs double

会出现数据紊乱

![image-20210630001740929](/images/concurrency/image-20210630001740929.png)

------------



## Race Condition

### Check and update

```java
//  share variable
Map<String,String> loanedBooks = new HashMap<>();

// thread-1 
if(!loanedBooks.containskey("book1")){
    loanedBooks.put("book1","user3")
}

// thread-2
if(!loanedBooks.containskey("book1")){
    loanedBooks.put("book1","user7")
}
```

<img src="/images/concurrency/image-20210630002115645.png" alt="image-20210630002115645"/>

#### Fixing race condition using lock

```java
//  share variable
Map<String,String> loanedBooks = new HashMap<>();
// lock
ReentrantLock lock = new ReentrantLock();

// thread-1 
lock.lock();
if(!loanedBooks.containskey("book1")){
    loanedBooks.put("book1","user3")
}
lock.unlock();

// thread-2
lock.lock();
if(!loanedBooks.containskey("book1")){
    loanedBooks.put("book1","user7")
}
lock.unlock();
```

<img src="/images/concurrency/image-20210630002150288.png" alt="image-20210630002150288" />

#### Fixing race conditioni using  ConcurrentHashMap atomic operation

```java
//  share variable
Map<String,String> loanedBooks = new ConcurrentHashMap <>();

//thread-1
loanedBooks.putIfAbsent("book1","user3");

//thread-2
loanedBooks.putIfAbsent("book1","user7");
```

-------------

### Read and update

```java
//  share variable
int count = 0;

// thread-1
count++;

// thread-2 
count++;
```

<img src="/images/concurrency/image-20210630002729979.png" alt="image-20210630002729979" />

#### Fixing

```java
//  share variable
AtomicInteger count = new AtomicInteger(0);

// thread-1
count.incrementAndGet();

// thread-2 
count.incrementAndGet();
```

<img src="/images/concurrency/image-20210630002753901.png" alt="image-20210630002753901"  />

## 小结

![image-20210630003021838](/images/concurrency/image-20210630003021838.png)

![image-20210630003042224](/images/concurrency/image-20210630003042224.png)

