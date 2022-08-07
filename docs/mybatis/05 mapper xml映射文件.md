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

