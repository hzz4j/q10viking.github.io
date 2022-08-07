---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /mybatis/
typora-root-url: ..\.vuepress\public
---



::: tip

[Source Code 03 mybatis mapper](https://github.com/Q10Viking/learncode/tree/main/mybatis/03_mybatis_mapper)

:::

## mapper根节点

[XML映射器官网](https://mybatis.org/mybatis-3/zh/sqlmap-xml.html)

```xml
<!--
<mapper 根节点
    namespace 命名空间，一般 情况下一个mapper映射文件对应一个不同的命名空间，利于管理和维护
        书写：默认情况下可以随意输入，但是如果使用接口绑定的方式就必须要输入对应的接口的完整限定名
-->
<mapper namespace="org.hzz.mapper.EmpMapper">
```



## insert

```xml
<!--插入
    id  同一个命名空间只能有一个唯一的id，除非有不同的databaseId，可以被用来引用这条语句。如果是接口绑定的是否一定要保证接口和方法名相同
    parameterType  用来设置该SQL的参数类型， 可以当它不存在，因为mybatis会根据接口方法的参数能够自动读取参数的类型
    statementType 设置当前的statement,
        STATEMENT  代表jdbc的statement     不支持参数解析，不会设置
        PREPARED   代表jdbc的PreparedStatement  支持参数解析， 默认的。
        CALLABLE   代表jdbc的CallableStatement   执行存储过程
    useGeneratedKeys 获取插入后的自动增长的主键（mysql 和 SQL Server ）
    keyProperty  将自动增长的主键赋值到哪个属性中
    要获取自动增长的注解（数据库支持自动增长的功能）：  useGeneratedKeys="true" keyProperty="id"
    keyColumn 因为有可能存在组合主键的情况，指定获取其中哪一个字段
    databaseId 用于配合databaseIdProvider 数据库厂商id 指定不同数据库下调用不同SQL，
    -->
```



### 获取这条新的数据列

插入一条数据之后，如何获取这条新的数据列(获取到插入数据后的自增主键)

![image-20210804104704226](/images/mybatis/image-20210804104509230.png)

```xml
<!--
     useGeneratedKeys 获取插入后的自动增长的主键（mysql 和 SQL Server ）
     keyProperty  将自动增长的主键赋值到哪个属性中
    -->
<insert id="insertEmp" useGeneratedKeys="true" keyProperty="id">
    insert
    into emp(username) values( #{username} )
</insert>
```

对应的Java代码

```java
@Test
    public void insert(){
        try(SqlSession sqlSession = sqlSessionFactory.openSession()){
            EmpMapper mapper = sqlSession.getMapper(EmpMapper.class);
            Emp emp = new Emp();
            emp.setUsername("静默");
            mapper.insertEmp(emp);
            sqlSession.commit(); // 默认时手动提交
            // 会赋值到emp.id中
            System.out.println(emp); // Emp{id=4, username='静默'}
        }
    }
```

### selectkey

如果数据库不支持主键递增，可以使用selectKey标签

```xml
<insert id="insertEmpHasSelectKey" useGeneratedKeys="true" keyProperty="id">
        <!--
            如果数据库不支持自动增长列可以使用下面方法：
            selectKey 可以在增删改之前或之后运行
            order BEFORE|AFTER 设置在增删改之前或之后运行
            keyProperty 将当前查询结果放到哪个pojo属性中
            resultType 返回的数据类型
        -->
        <selectKey order="BEFORE" keyProperty="id" resultType="int">
            SELECT MAX(id)+2  FROM emp
        </selectKey>
        insert
        into emp(id,username) values(
                                     #{id},
                                     #{username}
                                 )
    </insert>
```

---------



## 参数的取值方式⭐

在xml文件中编写sql语句的时候有两种取值方式**${}和#{}** 

1. **${}**注重拼接，替换，如动态的内容时，不需要转义。但是有SQL注入的风险

```xml
    <!--获取参数的方式：
        1.#{} ==> jdbc String sql=" SELECT id,user_name FROM EMP WHERE id=?"
            1.会经过JDBC当中PreparedStatement的预编译，会根据不同的数据类型来编译成对应数据库所对应的数据。
            2.能够有效的防止SQL注入。 推荐使用！！
            特殊用法：
            自带很多内置参数的属性：通常不会使用。了解
            javaType、jdbcType、mode、numericScale、resultMap、typeHandler.
            比如 需要改变默认的NULL===>OTHER:#{id,javaType=NULL}
                 想保留小数点后两位：#{id,numericScale=2}

        2.${} ==> jdbc String sql=" SELECT id,user_name FROM EMP WHERE id="+id
            1.不会进行预编译，会直接将输入进来的数据拼接在SQL中。
            2.存在SQL注入的风险。不推荐使用。
            特殊用法：
                1.调试情况下,可以临时使用。
                2.实现一些特殊功能:前提一定要保证数据的安全性。
                 比如：动态表、动态列. 动态SQL.
    -->
```

## 参数传递的处理

::: tip

养成习惯在参数面前添加@Param

:::

### 单个参数❤️

```xml
1.单个参数:SelectEmp(Integer id);
        mybatis 不会做任何特殊要求
        获取方式：
            #{输入任何字符获取参数}
```

### 多个参数❤️

```xml
    2.多个参数:Emp SelectEmp(Integer id,String username);
        mybatis 会进行封装
        会将传进来的参数封装成map:
        1个值就会对应2个map项 ：  id ===>  {key:arg0 ,value:id的值},{key:param1 ,value:id的值}
                                username ===>  {key:arg1 ,value:id的值},{key:param2 ,value:id的值}
        获取方式：
             没使用了@Param：
                       id=====>  #{arg0} 或者 #{param1}
                 username=====>  #{arg1} 或者 #{param2}
             除了使用这种方式还有别的方式，因为这种方式参数名没有意义:
             设置参数的别名：@Param("")：SelectEmp(@Param("id") Integer id,@Param("username") String username);
             当使用了@Param: 
                       id=====>  #{id} 或者 #{param1}
                 username=====>  #{username} 或者 #{param2}
```

```xml
<select id="selectEmp" resultType="org.hzz.pojo.Emp">
    select *
    from emp
    where id = #{id} and username=#{username}
    <!--        where id = #{param1} and username=#{param2} -->
    <!--        where id = #{arg0} and username=#{arg1} -->
</select>
```

### JavaBean❤️

```xml
3. javaBean的参数:
        单个参数：Emp SelectEmp(Emp emp);
        获取方式：可以直接使用属性名
            emp.id=====>#{id}
            emp.username=====>#{username}
        多个参数：Emp SelectEmp(Integer num,Emp emp);
            num===>    #{param1} 或者 @Param
            emp===> 必须加上对象别名： emp.id===> #{param2.id} 或者  @Param("emp")Emp emp    ====>#{emp.id}
                                    emp.username===> #{param2.username} 或者  @Param("emp")Emp emp    ====>#{emp.username}
```

```xml
<select id="selectEmpByJavaBean" resultType="org.hzz.pojo.Emp">
    select *
    from emp
    where id = #{id} and username=#{emp.username}
</select>
```

```java
    Emp selectEmpByJavaBean(@Param("id") Integer id, @Param("emp") Emp e);
```

### 集合或者数组参数❤️

```xml
集合或者数组参数：
            Emp SelectEmp(List<String> usernames);
        如果是list,MyBatis会自动封装为map:
            {key:"list":value:usernames}
              没用@Param("")要获得:usernames.get(0)  =====>  #{list[0]}
                                  :usernames.get(0)  =====>  #{agr0[0]}
              有@Param("usernames")要获得:usernames.get(0)  =====>  #{usernames[0]}
                                         :usernames.get(0)  =====>  #{param1[0]}
        如果是数组,MyBatis会自动封装为map:
            {key:"array":value:usernames}
              没用@Param("")要获得:usernames.get(0)  =====>  #{array[0]}
                                :usernames.get(0)  =====>  #{agr0[0]}
              有@Param("usernames")要获得:usernames.get(0)  =====>  #{usernames[0]}
                                         :usernames.get(0)  =====>  #{param1[0]}
```

### map❤️

```xml
5.map参数
        和javaBean的参数传递是一样。
        一般情况下：
            请求进来的参数 和pojo对应，就用pojo
            请求进来的参数 没有和pojo对应，就用map
            请求进来的参数 没有和pojo对应上，但是使用频率很高，就用TO、DTO（就是单独为这些参数创建一个对应的javaBean出来,使参数传递更规范、更重用）
```

```xml
<select id="selectEmpByMap" resultType="org.hzz.pojo.Emp">
    select *
    from emp
    where id = #{id} and username=#{username}
</select>
```

```java
Emp selectEmpByMap(Map<String,Object> map);
```

