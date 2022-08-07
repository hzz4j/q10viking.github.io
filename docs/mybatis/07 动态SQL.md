---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /mybatis/
typora-root-url: ..\.vuepress\public
---



使用了OGNL表达式

## if

```xml
 <if test="id!=null and id!='' ">
     id=#{id}
 </if>
```

## where

解决 where and 形式的sql生成

```xml
<!-- <where 一般会加载动态条件中配合使用， 在有条件的情况下它会自动在所有条件的前面加上WHERE关键字， 还会去掉所有条件前面的AND/OR -->
<where>
    <if test="id!=null and id!='' ">
        and  id=#{id}
    </if>
    <if test="username!=null and username!='' ">
        and user_name=#{username}
    </if>
    <if test="beginDate!=null and beginDate!='' ">
        and create_date >=#{beginDate}
    </if>
    <if test="endDate!=null and endDate!='' ">
        and create_date <![CDATA[<=]]> #{endDate}
    </if>
    <if test="deptId!=null and deptId!='' ">
        and dept_id=#{deptId}
    </if>
</where>
```

## trim

```xml
  <!--
  <trim  它的功能比较灵活、广泛。 它可以用来实现<where节点的功能
        prefix 在所有包含的SQL前面加上指定的字符串
       prefixOverrides  在所有包含的SQL前面加上去除指定的字符串
       suffix 在所有包含的SQL后面加上指定的字符串
       prefixOverrides  在所有包含的SQL后面加上去除指定的字符串
    -->
<trim prefix="WHERE" prefixOverrides="and|or"  >
    <if test="id!=null and id>0 ">
        and  id=#{id}
    </if>
    <!--OGNL调用对象的方法-->
    <if test="username!=null and username.indexOf('徐')>-1 ">
        and user_name=#{username}
    </if>
    <if test="beginDate!=null">
        and create_date >=#{beginDate}
    </if>
    <if test="endDate!=null">
        and create_date <![CDATA[<=]]> #{endDate}
    </if>
    <!--OGNL: gt 是大于
                调用静态方法 -->
    <if test="deptId!=null and deptId gt @cn.tulingxueyuan.pojo.Emp@getNum() ">
        and dept_id=#{deptId}
    </if>
</trim>
```

## choose when otherwise

```xml
<!--
    <choose when otherwise
    多条件取其中一个
    -->
    <select id="QueryEmp2" resultType="Emp">
        <include refid="SelectEmp">
            <property name="columns" value="id,dept_id"/>
        </include>
        <where>
            <choose>
                <when test="deptName=='经理'">
                    dept_id=1
                </when>
                <when test="deptName=='普通员工'">
                    dept_id=2
                </when>
                <otherwise>
                    dept_id=#{id}
                </otherwise>
            </choose>
        </where>
    </select>
```

## foreach

```xml
<!--
    <foreach  循环
        实现in 范围查询  使用$可以实现但是有sql注入风险
        collection 需要循环的集合的参数名字
        item  每次循环使用的接收变量
        separator 分割符设置（每次循环在结尾添加什么分隔符，会自动去除最后一个结尾的分隔符）
        open 循环开始添加的字符串
        close 循环结束添加的字符串
        index 循环的下标的变量
-->
select * from emp
<where>
    <foreach collection="usernames" item="username" separator="," open=" user_name in (" close=")" index="i" >
        #{username}
    </foreach>
</where>
```

## set

```xml
<update id="update">
        update emp
        <!--<trim prefix="set" suffixOverrides=",">
            <if test="username!=null and username!='' ">
            user_name=#{username},
            </if>
            <if test="createDate!=null and createDate!='' ">
            create_date=#{createDate},
            </if>
            <if test="deptId!=null and deptId!='' ">
            dept_id=#{deptId}
            </if>
        </trim>-->
        <set>
            <if test="username!=null and username!='' ">
                user_name=#{username},
            </if>
            <if test="createDate!=null">
                create_date=#{createDate},
            </if>
            <if test="deptId!=null and deptId!='' ">
                dept_id=#{deptId},
            </if>
        </set>
        where  id=#{id}
    </update>
```

## bind

```sql
-- 空格拼接
select * from emp where user_name like '%' #{username} '%'  
-- concat拼接
select * from emp where user_name like concat('%',#{username},'%')  
                                                                                      
```

```xml
<!--
 <bind> 在Mapper映射文件上下文声明一个变量
    name 变量名称
    value 值（支持OGNL表达式）
-->

<select id="QueryEmp4" resultType="Emp">
    <bind name="_username" value="'%'+username+'%' "/>
    select * from emp where user_name like  #{_username}
</select>      
```

## sql

```xml
<!--
sql片段  解决SQL中重复的代码冗余，可以提取出来放在sql片段中
    1.  <sql 定义sql片段
            id 唯一标识
    2.   <include 在SQL中引用SQL片段片段
            refid 需要引用的SQL片段的id
            <property 声明变量， 就可以在SQL片段中动态调用，让不同的SQL调用同一个SQL片段达到不同的功能
                name 变量名
                value 变量值
                一般情况使用${}在sql片段中引用.一单引用了，一定保证每个include都声明了该变量
-->


<sql id="selectEmp">
    select ${columns} from emp
</sql>

<select id="QueryEmp4" resultType="Emp">
    <bind name="_username" value="'%'+username+'%' "/>
    <include refid="selectEmp">
        <property name="columns" value="*"></property>
    </include>
    where user_name like  #{_username}
</select> 
```



## OGNL表达式

```xml
e1 or e2
e1 and e2
e1 == e2,e1 eq e2
e1 != e2,e1 neq e2
e1 lt e2：小于
e1 lte e2：小于等于，其他gt（大于）,gte（大于等于） 7 e1 in e2
e1 in e2
e1 not in e2
e1 + e2,e1 * e2,e1/e2,e1 - e2,e1%e2
!e,not e：非，求反
e.method(args)调用对象方法
e.property对象属性值
e1[ e2 ]按索引取值，List,数组和Map
@class@method(args)调用类的静态方法
@class@field调用类的静态字段值
```

