---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /designpattern/
typora-root-url: ..\.vuepress\public
---



## 改造前

```java
public class LemonadeChange{
//leetcode submit region begin(Prohibit modification and deletion)
class Solution {
    private int five = 0;
    private int ten = 0;
    private int twenty = 0;
    public boolean lemonadeChange(int[] bills) {
        for(int bill: bills){
            if(bill == 5){
                five++;
            }

            if(bill == 10){
                if(five > 0){
                    five--;
                    ten++;
                }else{
                    return false;
                }
            }

            if(bill == 20){
                if(ten>0 && five>0){
                    ten--;
                    five--;
                    twenty++;
                }else if(five>=3){
                    five -= 3;
                    twenty--;
                }else{
                    return false;
                }
            }
        }
        return true;
    }
}
//leetcode submit region end(Prohibit modification and deletion)

  public static void main(String[] args) {
       Solution solution = new LemonadeChange().new Solution();
       int[] bills = {5,5,5,10,20};
      boolean b = solution.lemonadeChange(bills);
      System.out.println(b);
  }
}
```



## 用设计模式改造一下

```java
public class LemonadeChange{
//leetcode submit region begin(Prohibit modification and deletion)
class Solution {
    public int five = 0;
    public int ten = 0;
    public int twenty = 0;

    public boolean lemonadeChange(int[] bills) {
        for(int bill: bills){
            boolean result = BillTask.getByPrice(bill).dealWithBill(this);
            if(!result) return false;
        }
        return true;
    }


    public enum BillTask{
        FIVE(5){
            @Override
            public  boolean dealWithBill(Solution solution){
                solution.five++;
                return true;
            }
        },
        TEN(10){
            @Override
            public  boolean dealWithBill(Solution solution){
                if(solution.five > 0){
                    solution.five--;
                    solution.ten++;
                }else{
                    return false;
                }
                return true;
            }
        },
        TWENTY(20){
            @Override
            public  boolean dealWithBill(Solution solution){
                if(solution.ten>0 && solution.five>0){
                    solution.ten--;
                    solution.five--;
                    solution.twenty++;
                }else if(solution.five>=3){
                    solution.five -= 3;
                    solution.twenty--;
                }else{
                    return false;
                }
                return true;
            }
        };

        private int bill;
        private BillTask(int bill){ this.bill = bill;}
        private int getBill(){return bill;}

        public abstract boolean dealWithBill(Solution solution);

        public static BillTask getByPrice(int bill){
            for(BillTask billTask: BillTask.values()){
                if(billTask.getBill() == bill){
                    return billTask;
                }
            }
            throw new IllegalArgumentException(bill+" is not support!");
        }
    }

}
//leetcode submit region end(Prohibit modification and deletion)

  public static void main(String[] args) {
       Solution solution = new LemonadeChange().new Solution();
       int[] bills = {5,5,5,10,20};
      boolean b = solution.lemonadeChange(bills);
      System.out.println(b);
  }
}
```





## 参考

[java - How to use design Pattern in place of switch case - Stack Overflow](https://stackoverflow.com/questions/32003932/how-to-use-design-pattern-in-place-of-switch-case)

```java
public enum TaskName {
     LOGIN {
         @Override
         public void doIt(TaskController taskController) {
              taskController.getUserDao().create(/*something*/);
              //...
         }
     },
     REGISTER {
         @Override
         public void doIt(TaskController taskController) {
              //Implementation
         }
     },
     MESSAGE {
         @Override
         public void doIt(TaskController taskController) {
              taskController.getMessageDao().create(/*something*/);
              //...
         }
     };

     private TaskName() {
     }

     public abstract void doIt(TaskController taskController);

     public static TaskName getByTaskName(String taskName) {
         for(TaskName taskEnum : TaskName.values()) {
             if(taskEnum.name().equalsIgnoreCase(taskName)) {
                 return taskEnum;
             }
         }
         throw new IllegalArgumentException("The Task Name [" + taskName + "] is not a valid task name!");
     }
}

public class TaskController {


    private UserDao userDaoJpaImpl;
    private FriendDao friendDaoJpaImpl;
    private GroupDao groupDaoJpaImpl;
    private MessageDao messageDaoJpaImpl;

    public TaskController() {
        EntityManagerFactory emfactory = Persistence.createEntityManagerFactory("Eclipselink_JPA");
        userDaoJpaImpl = new UserDaoJpaImpl(emfactory);
        friendDaoJpaImpl = new FriendDaoJpaImpl(emfactory);
        groupDaoJpaImpl = new GroupDaoJpaImpl(emfactory);
        messageDaoJpaImpl = new MessageDaoJpaImpl(emfactory);
    }

    public void doIt(String taskName) {
        TaskName.getByTaskName(taskName).doIt(this);
    }
}
```

