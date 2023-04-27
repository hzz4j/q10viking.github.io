---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /java/
typora-root-url: ..\.vuepress\public
---



> `Collectors.partitioningBy`

```java
public class ListToTwoList {
    public static void main(String[] args) {
        List<String> resources = Arrays.asList(
                "read-0000000000", "read-0000000001", "read-0000000002",
                "write-0000000003", "write-0000000004", "read-0000000005",
                "write-0000000006", "read-0000000007", "write-0000000008",
                "write-0000000009", "write-0000000010", "write-0000000011", "read-0000000012"
        );

        Map<Boolean, List<String>> results = resources.stream()
                .collect(Collectors.partitioningBy(s -> s.startsWith("read")));

        results.get(true).forEach(System.out::println);
        System.out.println("==================================");
        results.get(false).forEach(System.out::println);
    }
}
/**
 * read-0000000000
 * read-0000000001
 * read-0000000002
 * read-0000000005
 * read-0000000007
 * read-0000000012
 * ==================================
 * write-0000000003
 * write-0000000004
 * write-0000000006
 * write-0000000008
 * write-0000000009
 * write-0000000010
 * write-0000000011
 */
```

