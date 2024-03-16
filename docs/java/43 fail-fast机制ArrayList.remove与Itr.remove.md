---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /java/
typora-root-url: ..\.vuepress\public
---



## foreach删除fail-fast原因

```java
public class Main {
    public static void main(String[] args) {
        List<Integer> list = new ArrayList<>();
        list.add(1);
        list.add(2);
        list.add(3);
        list.add(4);

        for (Integer integer : list) {
            list.remove(integer);
        }

    }
}
/**
 Exception in thread "main" java.util.ConcurrentModificationException
 at java.util.ArrayList$Itr.checkForComodification(ArrayList.java:911)
 at java.util.ArrayList$Itr.next(ArrayList.java:861)
 at org.hzz.Main.main(Main.java:14)
 */
```

### ConcurrentModificationException抛出原因

```java
final void checkForComodification() {
    if (modCount != expectedModCount)
        throw new ConcurrentModificationException();
}
```

1. modCount:  记录结构上被修改的次数，用于fast-fail

   1. add(E)操作中有，modCount++;
   2. remove(Object)操作中有，modCount++;

2. expectedModCount再Itr的属性中，ArrayLIst.iterator会创建一个新的Itr对象

   1. ```java
      public Iterator<E> iterator() {
           return new Itr();
      }
      ```

   2. Itr对象创建时，expectedModCount的值被赋值为modCount

3. 在forEach语法糖中，会默认创建一个Itr对象，并且调用Itr.next()方法,来获取到下一个元素，在这里用于remove(obj)

   1. 并且在next()方法中就有调用checkForComodification方法进行检查

4. 回到代码里面，list前面4次add操作，后此时的modCount=4,通过forEach语法糖创建了Itr对象,此时expectedModCount被赋值等于modCount 4

   1. 第一获取元素Itr.next时,此时不会抛出异常
   2. 此时进入到循环体中,执行remove(integer),执行完后，modCount++,变成了5
   3. 当下一次循环时继续调用Itr.next()，就会进行判断，发现此时modCount(5) !== expectedModCount(4) 则抛出异常

需要而外注意的是：在迭代器删除的过程中，**list.size是动态变化的**，如下面的判断，如果list只有一个元素，第一个元素删除后，cursor=1(往前移准备删除下一个)，size=0，同样会返回true.

```java
public boolean hasNext() {
	return cursor != size;
}
```



## fail-fast机制简介

它只能被用来检测错误，因为JDK并不保证fail-fast机制一定会发生。当多个线程对同一个集合的内容进行操作时，就可能会产生fail-fast事件。例如：**当某一个线程A通过iterator去遍历某集合的过程中，若该集合的内容被其他线程所改变了**；那么线程A访问集合时，就会抛出ConcurrentModificationException异常，产生fail-fast事件。



## ArrayList正确remove的方式

### Itr.remove

```java
public class Main {
    public static void main(String[] args) {
        List<Integer> list = new ArrayList<>();
        list.add(1);
        list.add(2);
        list.add(3);
        list.add(4);

        Iterator<Integer> iterator = list.iterator();
        while (iterator.hasNext()){
            iterator.next();
            iterator.remove();
        }
    }
}
```

原因：Itr每次执行remove操作之后，都会重新赋值给expectCount

```java
// Itr.remove()
expectedModCount = modCount;
```

### 不用迭代器，倒着删除

```java
public class Main {
    public static void main(String[] args) {
        List<Integer> list = new ArrayList<>();
        list.add(1);
        list.add(2);
        list.add(3);
        list.add(4);
        //  应对size动态变化
        for(int i=list.size()-1;i>=0;i--){
            list.remove(i);
        }
    }
}
```

正着删除会有什么问题？会发现删除不干净

```java
public class Main {
    public static void main(String[] args) {
        List<Integer> list = new ArrayList<>();
        list.add(1);
        list.add(2);
        list.add(3);
        list.add(4);
        //  应对size动态变化
        for(int i=0;i<list.size();i++){
            list.remove(i);
        }
        System.out.println(list);
    }
}
// [2, 4]
```



## for与for-each

在Java中，for-each循环（也称为增强型for循环）和常规for循环有一些差异，包括它们在执行效率上的区别。下面是它们之间的一些比较：

1. **执行效率：**在大多数情况下，常规for循环的执行效率比for-each循环高。这是因为for-each循环需要额外的步骤来获取集合或数组中的元素，而常规for循环可以直接通过索引访问元素，避免了额外的开销。
2. **可变性：**常规for循环具有更大的灵活性，可以在循环过程中修改计数器，从而控制循环的行为。而for-each循环是只读的，不能在循环过程中修改集合或数组的元素。
3. **代码简洁性：**for-each循环通常比常规for循环更加简洁易读，尤其在遍历集合或数组时。使用for-each循环可以减少迭代器或索引变量的声明和管理，使代码更加清晰。

尽管常规for循环在执行效率上可能更高，但在大多数实际情况下，两者之间的性能差异不会对程序性能产生显著影响。因此，根据具体的使用场景和代码可读性的需求，可以选择使用for-each循环或常规for循环。在只需要遍历集合或数组而不修改其中元素的情况下，for-each循环是一个方便且简洁的选择。
