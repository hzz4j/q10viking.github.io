---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /springmvc/
typora-root-url: ..\.vuepress\public
---



> get方法,属性参数分装为对象



```java
@Operation(summary = "分页查询", description = "分页查询用户信息")
@ApiResponse(responseCode = "200", description = "分页查询成功")
@GetMapping("/query")
default Result<PageResult<List<UserVO>>> query(
    @Parameter(description = "当前页(默认为1)",example = "1")
    @RequestParam(name = "pageNum",defaultValue = "1",required = false)
    Integer pageNum,
    @Parameter(description = "每页显示条数(默认为20)",example = "20")
    @RequestParam(name = "pageSize",defaultValue = "20",required = false)
    Integer pageSize,
    @Parameter(description = "用户查询条件")
    @Valid UserQueryDTO userQueryDTO) {
    throw new NotImplementedException("接口未实现");
}


@Data
public class UserQueryDTO {
    @Schema(description = "用户名",example = "Q10Viking")
    private String username;

    @Schema(description = "年龄",example = "18")
    private Integer age;

    @Schema(description = "邮箱",example = "1193094618@qq.com")
    @Email
    private String email;
}
```

![image-20230524002307753](/images/springboot/image-20230524002307753.png)



```http
http://localhost:8080/api/user/query?pageNum=1&pageSize=2&username=Q10Viking&age=18&email=1193094618%40qq.com
```

