---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /springsecurity/
typora-root-url: ..\.vuepress\public
---



## jwt(Json web token)

- OAuth 2.0是当前业界标准的授权协议，它的核心是若干个针对不同场景的令牌颁发和管理流程；
- JWT是一种轻量级、自包含的令牌，可用于在微服务间安全地传递用户信息。

### payload

标准中注册的声明（建议但不强制使用）  

- **iss**: jwt签发者
- **sub**: jwt所面向的用户
- **aud**: 接收jwt的一方
- **exp**: jwt的过期时间，这个过期时间必须要大于签发时间
- **nbf**: 定义在什么时间之前，该jwt都是不可用的.
- **iat**: jwt的签发时间
- **jti**: jwt的唯一身份标识，主要用来作为一次性token,从而回避重放攻击。



## JJWT

JJWT是一个提供端到端的JWT创建和验证的Java库

```xml
<!--JWT依赖-->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt</artifactId>
    <version>0.9.1</version>
</dependency>
```

### 生成token

```java
public class JwtdemoApplicationTests {
    private static final String SECRETKEY = "123123";

    @Test
    public void test(){
        JwtBuilder jwtBuilder = Jwts.builder()
                //声明的标识{"jti":"666"}
                .setId("666")
                //主体，用户{"sub":"hzz"}
                .setSubject("hzz")
                //创建日期{"ita":"xxxxxx"}
                .setIssuedAt(new Date())
                //设置过期时间   1分钟
                .setExpiration(new Date(System.currentTimeMillis() + 60 * 1000))
                //直接传入map
                // .addClaims(map)
                .claim("roles", "admin")
                .claim("logo", "xxx.jpg")
                //签名手段，参数1：算法，参数2：盐
                .signWith(SignatureAlgorithm.HS256, SECRETKEY);

        String token = jwtBuilder.compact();
        System.out.println(token);

        //三部分的base64解密
        System.out.println("=========");
        String[] split = token.split("\\.");
        System.out.println(Base64Codec.BASE64.decodeToString(split[0]));
        System.out.println(Base64Codec.BASE64.decodeToString(split[1]));
        //无法解密
//        System.out.println(Base64Codec.BASE64.decodeToString(split[2]));
    }
}
/**
 * eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI2NjYiLCJzdWIiOiJoenoiLCJpYXQiOjE2Nzg4NTI0MzYsImV4cCI6MTY3ODg1MjQ5Niwicm9sZXMiOiJhZG1pbiIsImxvZ28iOiJ4eHguanBnIn0.LmGgOqi71YyhekY9pgbN1S3xCoeTNAI5jX3J0lwfXG8
 * =========
 * {"alg":"HS256"}
 * {"jti":"666","sub":"hzz","iat":1678852436,"exp":1678852496,"roles":"admin","logo":"xxx.jpg
 */
```

