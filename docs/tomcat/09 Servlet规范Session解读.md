![image (15)](https://gitee.com/q10viking/PictureRepos/raw/master/images//202112061605044.jpg)



## session ID

on the client’s first request, the Container generates a unique session ID and gives it back to the client with the response. The client sends back the session ID with each subsequent request. The Container sees the ID, finds the matching session, and associates the session with the request.

![image (16)](https://gitee.com/q10viking/PictureRepos/raw/master/images//202112061608848.jpg)

![image (17)](https://gitee.com/q10viking/PictureRepos/raw/master/images//202112061609586.jpg)



## Client and Container exchange sessionID

![image (18)](https://gitee.com/q10viking/PictureRepos/raw/master/images//202112061611750.jpg)



## Container create and get Session

:one: You do have to tell the Container that you want to create or use a session, but the Container takes care of generating the session ID, creating a new Cookie object, stuffing the session ID into the cookie, and setting the cookie as part of the response

:two: And on subsequent requests, the Container gets the session ID from a cookie in the request, matches the session ID with an existing session, and associates that session with the current request.

```java
// That’s it. Somewhere in your service method you ask for a session, and everything else happens automatically.
HttpSession session = request.getSession();
/**
1. You don’t make the new HttpSession object yourself.
2. You don’t generate the unique session ID.
3. You don’t make the new Cookie object.
4. You don’t associate the session ID with the cookie.
5. You don’t set the Cookie into the response(under the Set-Cookie header).
All the cookie work happens behind the scenes.
*/
```

```java
IF (the request includes a session ID cookie)
	find the session matching that ID
ELSE IF (there’s no session ID cookie OR there’s no current session matching the session ID)
	create a new session.
    
All the cookie work happens behind the scenes.
```

如果判断session是之前创建的还是刚刚创建的

```java
session.isNew()
```



## Session存活时间

![image (19)](https://gitee.com/q10viking/PictureRepos/raw/master/images//202112061627210.jpg)

## Setting session timeout

### Configuring session timeout in the DD

```xml {6}
<web-app ...>
    <servlet>
        ...
    </servlet> 
    <session-config>
    	<session-timeout>15</session-timeout>
    </session-config>
</web-app>
```

### Setting session timeout for a specifi c session

```java
// The argument to the method is in seconds,
//so this says if the client doesn’t make any
//requests on the session for 20 minutes, kill it.*
session.setMaxInactiveInterval(20*60);
```

