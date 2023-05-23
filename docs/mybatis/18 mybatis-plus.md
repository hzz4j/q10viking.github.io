---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /mybatis/
typora-root-url: ..\.vuepress\public
---



## 依赖

```xml
<!--        <dependency>-->
<!--            <groupId>org.mybatis.spring.boot</groupId>-->
<!--            <artifactId>mybatis-spring-boot-starter</artifactId>-->
<!--            <version>2.1.1</version>-->
<!--        </dependency>-->

        <dependency>
            <groupId>com.baomidou</groupId>
            <artifactId>mybatis-plus-boot-starter</artifactId>
            <version>3.3.1</version>
        </dependency>
```



![image-20230524000555126](C:\Users\11930\AppData\Roaming\Typora\typora-user-images\image-20230524000555126.png)



## 分页

> 需要配置一个bean,`PaginationInterceptor`,否则分页不生效

```java
@Configuration
public class MybatisPlusConfig {
    // 分页配置
    @Bean
    public PaginationInterceptor paginationInterceptor() {
        PaginationInterceptor paginationInterceptor =
                new PaginationInterceptor();

        // 数据库类型配置
        paginationInterceptor.setDbType(DbType.MYSQL);

        return paginationInterceptor;
    }
}
```

```java
@Override
    public PageResult<List<UserDTO>> query(PageQuery<UserQueryDTO> pageQuery) {
        Page<UserDO> page = new Page<>(pageQuery.getPageNo(),pageQuery.getPageSize());
        UserDO userDO = new UserDO();
        BeanUtils.copyProperties(pageQuery.getQuery(),userDO);
        QueryWrapper<UserDO> queryWrapper = new QueryWrapper<>(userDO);

        Page<UserDO> userDOPage = userMapper.selectPage(page, queryWrapper);

        // 结果解析
        final PageResult<List<UserDTO>> userDTOPageResult = new PageResult<>();
        userDTOPageResult.setPageNo((int)userDOPage.getCurrent());
        userDTOPageResult.setPageSize((int)userDOPage.getSize());
        userDTOPageResult.setTotal(userDOPage.getTotal());
        userDTOPageResult.setPageNum(userDOPage.getPages());

        List<UserDTO> userDTOList = Optional.ofNullable(userDOPage.getRecords())
                .orElse(Collections.emptyList())
                .stream()
                .map(userDO1 -> {
                    UserDTO userDTO = new UserDTO();
                    BeanUtils.copyProperties(userDO1, userDTO);
                    return userDTO;
                })
                .collect(Collectors.toList());
        userDTOPageResult.setData(userDTOList);
        return userDTOPageResult;
    }
```



```sh
==>  Preparing: SELECT COUNT(1) FROM user 
==> Parameters: 
<==    Columns: COUNT(1)
<==        Row: 5
==>  Preparing: SELECT id,username,password,email,age,phone,created,modified,creator,operator,status,version FROM user LIMIT ?,? 
==> Parameters: 0(Long), 2(Long)
```

```sh
==>  Preparing: SELECT COUNT(1) FROM user WHERE username = ? AND email = ? AND age = ? 
==> Parameters: Q10Viking(String), 1193094618@qq.com(String), 18(Integer)
<==    Columns: COUNT(1)
<==        Row: 1
==>  Preparing: SELECT id,username,password,email,age,phone,created,modified,creator,operator,status,version FROM user WHERE username=? AND email=? AND age=? LIMIT ?,? 
==> Parameters: Q10Viking(String), 1193094618@qq.com(String), 18(Integer), 0(Long), 2(Long)
<==    Columns: id, username, password, email, age, phone, created, modified, creator, operator, status, version
<==        Row: 1220708537638920195, Q10Viking, 123456, 1193094618@qq.com, 18, 17801054400, 2023-05-23 15:23:37, 2020-01-24 08:05:50, TODO 从上下文获取当前人, TODO 从上下文获取当前人, 1, 1
<==      Total: 1

```

