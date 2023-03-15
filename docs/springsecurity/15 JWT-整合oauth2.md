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

### 测试

> 能够生成token,并能解析token

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

## token解析

在web应用中由服务端创建了token然后发给客户端，客户端在下次向服务端发送请求时需要携带这个token（这就好像是拿着一张门票一样），那服务端接到这个token应该解析出token中的信息（例如用户id）,根据这些信息查询数据库返回相应的结果。

```java
@Test
    public void testParseToken(){
        String token = "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI2NjYiLCJzdWIiOiJoenoiLCJpYXQiOjE2Nzg4NjMxNzQsImV4cCI6MTY3ODg2MzIzNCwicm9sZXMiOiJhZG1pbiIsImxvZ28iOiJ4eHguanBnIn0.vgpt0JT9R3cioTCH5bjRrhJgOff28kKooChZrRKLGOo";
        Claims claims = Jwts.parser()
                .setSigningKey(SECRETKEY)
                .parseClaimsJws(token)
                .getBody();
        System.out.println("id:"+claims.getId());
        System.out.println("subject:"+claims.getSubject());
        System.out.println("issuedAt:"+claims.getIssuedAt());

        DateFormat sf =new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        System.out.println("签发时间:"+sf.format(claims.getIssuedAt()));
        System.out.println("过期时间:"+sf.format(claims.getExpiration()));
        System.out.println("当前时间:"+sf.format(new Date()));

        System.out.println("roles:"+claims.get("roles"));
        System.out.println("logo:"+claims.get("logo"));
    }
    /**
     * id:666
     * subject:hzz
     * issuedAt:Wed Mar 15 14:52:54 GMT+08:00 2023
     * 签发时间:2023-03-15 14:52:54
     * 过期时间:2023-03-15 14:53:54
     * 当前时间:2023-03-15 14:53:37
     * roles:admin
     * logo:xxx.jpg
     */
```

## token过期校验

不希望签发的token是永久生效的，所以我们可以为token添加一个过期时间。原因：从服务器发出的token，服务器自己并不做记录，就存在一个弊端：服务端无法主动控制某个token的立刻失效。  

当未过期时可以正常读取，当过期时会引发io.jsonwebtoken.ExpiredJwtException异常

![image-20230315145914569](/images/springsecurity/image-20230315145914569.png)

```sh
io.jsonwebtoken.ExpiredJwtException: JWT expired at 2023-03-15T14:53:54Z. Current time: 2023-03-15T14:57:21Z, a difference of 207417 milliseconds.  Allowed clock skew: 0 milliseconds.
```



## Spring security oauth2整合jwt

[Source Code](https://github.com/Q10Viking/springcloudalibaba/tree/main/jwt/jwt-basic)

### 依赖

```xml
<dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-jwt</artifactId>
    <version>1.0.9.RELEASE</version>
</dependency>
```

## 添加配置文件JwtTokenEnhancerConfig.java

```java
@Configuration
public class JwtTokenEnhancerConfig {
    @Bean
    public TokenStore jwtTokenStore(){
        return new JwtTokenStore(jwtAccessTokenConverter());
    }

    @Bean
    public JwtAccessTokenConverter jwtAccessTokenConverter(){
        JwtAccessTokenConverter accessTokenConverter = new
                JwtAccessTokenConverter();
        //配置JWT使用的秘钥
        accessTokenConverter.setSigningKey("123123");
        return accessTokenConverter;
    }
}
```

在授权服务器配置中指定令牌的存储策略为JWT  

![https://note.youdao.com/yws/public/resource/91c79470710860cce7e3c8dcf444d0e3/xmlnote/84FA56CB45DB41F39C0A0537C041D7B7/56876](/images/springsecurity/56876)

## 测试

使用密码模式获取授权token

[localhost:8080/oauth/token?username=hzz&password=Root.123456&grant_type=password&client_id=client&client_secret=123123&scope=all](http://localhost:8080/oauth/token?username=hzz&password=Root.123456&grant_type=password&client_id=client&client_secret=123123&scope=all)

![image-20230315161615974](/images/springsecurity/image-20230315161615974.png)

发现获取到的令牌已经变成了JWT令牌，将access_token拿到https://jwt.io/ 网站上去解析下可以获得其中内容

![image-20230315161710643](/images/springsecurity/image-20230315161710643.png)

**扩展JWT中的存储内容**

有时候我们需要扩展JWT中存储的内容，这里我们在JWT中扩展一个 key为enhance，value为enhance info 的数据。 继承TokenEnhancer实现一个JWT内容增强器

```java
public class JwtTokenEnhancer implements TokenEnhancer {
    @Override
    public OAuth2AccessToken enhance(OAuth2AccessToken accessToken, OAuth2Authentication authentication) {
        Map<String, Object> info = new HashMap<>();
        info.put("enhancer","enhancer-info");
        ((DefaultOAuth2AccessToken)accessToken).setAdditionalInformation(info);
        return accessToken;
    }
}
```

向资源服务器请求资源

![image-20230315162005375](/images/springsecurity/image-20230315162005375.png)

![image-20230315162031737](/images/springsecurity/image-20230315162031737.png)

```json
{
	"enhancer": "enhancer-info",
	"user_name": "hzz",
	"scope": [
		"all"
	],
	"exp": 1678871304,
	"authorities": [
		"admin"
	],
	"jti": "34cac767-4e3b-474e-a19a-bf7cfc9b82d7",
	"client_id": "client"
}
```

