---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /concurrency/
typora-root-url: ..\.vuepress\public
---



## 原子更新基本类型类

- AtomicBoolean：原子更新布尔类型。
- AtomicInteger：原子更新整型。
- AtomicLong：原子更新长整型。

AtomicInteger的常用方法如下：

- int addAndGet(int delta) ：以原子方式将输入的数值与实例中的值（AtomicInteger里的value）相加，并返回结果
- boolean compareAndSet(int expect, int update) ：如果输入的数值等于预期值，则以原子方式将该值设置为输入的值。
- int getAndIncrement()：以原子方式将当前值加1，注意：这里返回的是自增前的值。
- void lazySet(int newValue)：最终会设置成newValue，使用lazySet设置值后，可能导致其他线程在之后的一小段时间内还是可以读到旧的值。
- int getAndSet(int newValue)：以原子方式设置为newValue的值，并返回旧值。

Atomic包提供了三种基本类型的原子更新，但是Java的基本类型里还有char，float和double等。那么问题来了，如何原子的更新其他的基本类型呢？Atomic包里的类基本都是使用Unsafe实现的，Unsafe只提供了三种CAS方法，compareAndSwapObject，compareAndSwapInt和compareAndSwapLong，再看**AtomicBoolean源码，发现其是先把Boolean转换成整型**，再使用compareAndSwapInt进行CAS，所以原子更新double也可以用类似的思路来实现。



## 原子更新数组类

通过原子的方式更新数组里的某个元素，Atomic包提供了以下三个类：


- AtomicIntegerArray：原子更新整型数组里的元素。
- AtomicLongArray：原子更新长整型数组里的元素。
- AtomicReferenceArray：原子更新引用类型数组里的元素。

AtomicIntegerArray类主要是提供原子的方式更新数组里的整型，其常用方法如下

- int addAndGet(int i, int delta)：以原子方式将输入值与数组中索引i的元素相加。
- boolean compareAndSet(int i, int expect, int update)：如果当前值等于预期值，则以原子方式将数组位置i的元素设置成update值。

### AtomicIntegerArray

```java
//	原数组并没有修改
public class AtomicIntegerArrayRunner {

    static int[] value = new int[]{1,2};
    static AtomicIntegerArray aiArray = new AtomicIntegerArray(value);

    public static void main(String[] args) {
        //todo 原子修改数组下标0的数值
        aiArray.getAndSet(0,3);
        System.out.println(aiArray.get(0));
        System.out.println(value[0]);
}
}
/**
 3
 1
 */
```

### AtomicReferenceArray

```java
public class AtomicReferenceArrayRunner {

    static Float[] ovalue = new Float[]{1.0f,2.0f};
    static AtomicReferenceArray<Float> objarray = new AtomicReferenceArray(ovalue);

    public static void main(String[] args) {
        System.out.println(objarray.get(0));
        objarray.set(0,3.0f);
        System.out.println(objarray.get(0));
    }
}
/**
 1.0
 3.0
 */
```

## 原子更新引用类型

- AtomicReference：原子更新引用类型。
- AtomicReferenceFieldUpdater：原子更新引用类型里的字段。
- AtomicMarkableReference：原子更新带有标记位的引用类型。可以原子的更新一个布尔类型的标记位和引用类型。构造方法是AtomicMarkableReference(V initialRef, boolean initialMark)

### AtomicReferenceFieldUpdater

```java
public class AtomicReferenceFieldUpdaterRunner {

    static AtomicReferenceFieldUpdater atomic = AtomicReferenceFieldUpdater.newUpdater(Document.class,String.class,"name");

    public static void main(String[] args) {
        Document document = new Document("hzz",1);

        System.out.println(atomic.get(document));

        atomic.getAndSet(document,"xiaolongnv");

        System.out.println(atomic.get(document));
        System.out.println(document.getName());

        //另一种方式修改
        UnaryOperator<String> uo = s->{
            System.out.println("UnaryOperator:-->"+s);
            return "小龙女";
        };
        System.out.println(atomic.getAndUpdate(document, uo));
        System.out.println(atomic.get(document));

    }

    @Data   //  lombok
    static class Document{
        public volatile String name;
        private int version;

        Document(String obj,int v){
            name = obj;
            version = v;
        }

    }
}
/**
hzz
xiaolongnv
xiaolongnv
UnaryOperator:-->xiaolongnv
xiaolongnv
小龙女
*/
```

### AtomicReference使用场景

https://dzone.com/articles/java-concurrency-atomicreference

```java
//  detect if an object was called from multiple threads. I use the following immutable class for this:
public class State {
	private final Thread thread;
	private final boolean accessedByMultipleThreads;
	public State(Thread thread, boolean accessedByMultipleThreads) {
		super();
		this.thread = thread;
		this.accessedByMultipleThreads = accessedByMultipleThreads;
	}
	public State() {
		super();
		this.thread = null;
		this.accessedByMultipleThreads = false;
	}
	public State update() {
		if(accessedByMultipleThreads) 	{
			return this;
		}
		if( thread == null  ) {
			return new  State(Thread.currentThread() , accessedByMultipleThreads);
		} 
		if(thread != Thread.currentThread()) {
			return new  State(null,true);
		}	
		return this;
	}
	public boolean isAccessedByMultipleThreads() {
		return accessedByMultipleThreads;
	}
}
```

##### 有并发问题的代码

```java
public class UpdateStateNotThreadSafe {
	private volatile  State state = new State();
	public void update() {
		state = state.update();
	}
	public State getState() {
		return state;
	}	
}
```

##### 没有并发问题的代码

```java
public class UpdateStateWithCompareAndSet {
	private final AtomicReference<State> state = new AtomicReference<State>(new State());
	public  void update() {
		State current = state.get();
		State newValue = current.update();
		while( ! state.compareAndSet( current , newValue ) ) {
			current = state.get();
			newValue = current.update();
		}
        
        // 更简单的写法
        state.updateAndGet(State::update);
	}
	public State getState() {
		return state.get();
	}	
}
```



## 原子更新字段类

如果我们只需要某个类里的某个字段，那么就需要使用原子更新字段类，Atomic包提供了以下三个类

- AtomicIntegerFieldUpdater：原子更新整型的字段的更新器。
- AtomicLongFieldUpdater：原子更新长整型字段的更新器。
- AtomicStampedReference：原子更新带有版本号的引用类型。该类将整数值与引用关联起来，可用于原子的更数据和数据的版本号，可以解决使用CAS进行原子更新时，可能出现的ABA问题。

原子更新字段类都是抽象类，每次使用都时候必须使用静态方法newUpdater创建一个更新器。原子更新类的字段的必须使用**public volatile**修饰符。

### AtomicIntegerFieldUpdater❤️



#### 使用

```java
public class AtomicIntegerFieldUpdateRunner {

    static AtomicIntegerFieldUpdater aifu = AtomicIntegerFieldUpdater.newUpdater(Student.class,"old");

    public static void main(String[] args) {
        Student stu = new Student("hzz",18);
        System.out.println(aifu.getAndIncrement(stu));
        System.out.println(aifu.getAndIncrement(stu));
        System.out.println(aifu.get(stu));
        System.out.println(stu.getOld());
    }

    static class Student{
        private String name;
        //  必须使用volatile修饰
        public volatile int old;

        public Student(String name ,int old){
            this.name = name;
            this.old = old;
        }

        public String getName() {
            return name;
        }

        public int getOld() {
            return old;
        }
    }
}
/**
 18
 19
 20
 20
 */
```

#### 案例

> 在netty中关闭线程的时候`eventLoopGroup.shutdownGracefully().sync();`中改变状态

```java
// SingleThreadEventExecutor
private static final AtomicIntegerFieldUpdater<SingleThreadEventExecutor> STATE_UPDATER =
    AtomicIntegerFieldUpdater.newUpdater(SingleThreadEventExecutor.class, "state");


private static final int ST_NOT_STARTED = 1;
private static final int ST_STARTED = 2;
private static final int ST_SHUTTING_DOWN = 3;
private static final int ST_SHUTDOWN = 4;
private static final int ST_TERMINATED = 5;


private volatile int state = ST_NOT_STARTED;



STATE_UPDATER.compareAndSet(this, oldState, newState)
```

