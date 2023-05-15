---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /java/
typora-root-url: ..\.vuepress\public
---



## 1 Java 文本格式化

![image-20210205090832325](/images/java/image-20210205090832325.png)



### 1.1 测试用例

```java
public class MessageFormatDemo {
    public static void main(String[] args) {
        int planet = 7;
        String event = "a disturbance in the Force";
        
		//	internally creates a MessageFormat for one-time use:
        String result1 = MessageFormat.format(
                "At {1,time,full} on {1,date,full}, there was {2} on planet {0,number,integer}.",
                planet, new Date(), event);

        System.out.println(result1);
        
		//	creates a MessageFormat instance that can be used repeatedly
        MessageFormat messageFormat = new MessageFormat("At {1,time,full} on {1,date,full}, there was {2} on planet {0,number,integer}.");
        String result2 = messageFormat.format(new Object[]{planet, new Date(), event});
        System.out.println(result2);

    }
}
/**
 At 上午09时22分33秒 GMT+08:00 on 2021年2月5日 星期五, there was a disturbance in the Force on planet 7.
 At 上午09时22分33秒 GMT+08:00 on 2021年2月5日 星期五, there was a disturbance in the Force on planet 7.
 */
```

----------



## 2 高级特性

<img src="/images/java/image-20210205091936617.png" alt="image-20210205091936617"  />



### 2.1 重置为ChoiceFormat的使用

```java
public class MessageFormatDemo {
    public static void main(String[] args) {
        int planet = 7;
        String event = "a disturbance in the Force";

        MessageFormat messageFormat = new MessageFormat("At {1,time,full} on {1,date,full}, there was {2} on planet {0,number,integer}.");
        String result1 = messageFormat.format(new Object[]{planet, new Date(), event});
        System.out.println(result1);

        //  重置模式
        messageFormat.applyPattern("本次语文考试 {1} {0}分 {2}");

        //  重置format
        messageFormat.setFormatByArgumentIndex(2,getChoiceFormat());
        Map<String, Double> students = getStudents();
        for (Map.Entry<String,Double> entry: students.entrySet()){
            Double grade = entry.getValue();
            String name = entry.getKey();
            String result = messageFormat.format(new Object[]{grade,name,grade});
            System.out.println(result);
        }
    }

    private static Map<String,Double> getStudents(){
        Map<String,Double> students = new LinkedHashMap<>();
        students.put("张山",37d);
        students.put("蔡文姬",68d);
        students.put("李四",76d);
        students.put("王五",87d);
        students.put("鲁班",99d);

        return students;
    }

    private static ChoiceFormat getChoiceFormat(){
        //  X matches j if and only if limit[j] ≤ X < limit[j+1]
        double[] limits = {0,60,70,80,90};;
        String[] gradesFormat = {"不及格","及格","中等","良好","优秀"};
        ChoiceFormat form = new ChoiceFormat(limits, gradesFormat);
        return form;
    }
}
/**
 At 上午10时15分53秒 GMT+08:00 on 2021年2月5日 星期五, there was a disturbance in the Force on planet 7.
 本次语文考试 张山 37分 不及格
 本次语文考试 蔡文姬 68分 及格
 本次语文考试 李四 76分 中等
 本次语文考试 王五 87分 良好
 本次语文考试 鲁班 99分 优秀
 */
```





### 2.2 ChoiceFormat

```java
public class MessageFormatDemo2 {

    public static void main(String[] args) {
        //  X matches j if and only if limit[j] ≤ X < limit[j+1]
        double[] limits = {0,60,70,80,90};;
        String[] gradesFormat = {"不及格","及格","中等","良好","优秀"};
        ChoiceFormat form = new ChoiceFormat(limits, gradesFormat);

        Map<String,Double> students = new LinkedHashMap<>();
        students.put("张山",37d);
        students.put("蔡文姬",68d);
        students.put("李四",76d);
        students.put("王五",87d);
        students.put("鲁班",99d);


        for (Map.Entry<String,Double> entry: students.entrySet()){
            String format = form.format(entry.getValue());
            System.out.println(entry.getKey() + " " + format);
        }

    }
}
/**
 张山 不及格
 蔡文姬 及格
 李四 中等
 王五 良好
 鲁班 优秀
 */
```

