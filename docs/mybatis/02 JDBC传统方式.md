---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /mybatis/
typora-root-url: ..\.vuepress\public
---



## JDBC核心API

1. DriverManager  连接数据库
2. Connection  连接数据库的抽象
3. Statment  执行SQL
4. ResultSet  数据结果集

[Source Code](https://github.com/Q10Viking/learncode/blob/main/mybatis/01_mybatis_start/src/test/java/org/hzz/JDBCTest.java)

```java
package org.hzz;

import org.hzz.pojo.Emp;
import org.junit.Test;

import java.sql.*;

public class JDBCTest {

    @Test
    public void testjdbc() throws ClassNotFoundException, SQLException {
        //============================SqlSessionFactory======================================
        // 1.注册驱动
        Class class1 = Class.forName("com.mysql.cj.jdbc.Driver");
        // 2.创建数据连接 DriverManager.getConnection()方法：获取数据库连接
        String url = "jdbc:mysql://192.168.187.135:3306/learn_mybatis";
        String user = "root";
        String password = "Root.123456";
        //3.获取连接
        Connection connection = DriverManager.getConnection(url, user, password);
        String sql = "SELECT * FROM emp WHERE id=?";

        //============================SqlSession======================================
        //4.使用PreparedStatement 预解析sql语句，
        PreparedStatement ps = connection.prepareStatement(sql);
        ps.setInt(1,1);
        ResultSet rs = ps.executeQuery();
        if (rs.next()) {
            Emp emp = new Emp();
            emp.setId(rs.getInt("id"));
            emp.setUsername(rs.getString("username"));
            System.out.println(emp);
        }
    }
}

```

