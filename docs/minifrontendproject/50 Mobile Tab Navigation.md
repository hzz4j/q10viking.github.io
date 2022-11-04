---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /minifrontendproject/
typora-root-url: ..\.vuepress\public
---

## Mobile Tab Navigation

[项目预览（Project view）](https://q10viking.github.io/Mini-FrontEnd-project/53%20Mobile%20Tab%20Navigation/dist/)

[Source Code](https://github.com/Q10Viking/Mini-FrontEnd-project/tree/main/53%20Mobile%20Tab%20Navigation)

<common-progresson-snippet src="https://q10viking.github.io/Mini-FrontEnd-project/53%20Mobile%20Tab%20Navigation/dist/"/>



## flex的布局

```scss
ul{
    display: flex;
    justify-content: center;
    list-style-type: none;
    background-color: #fff;
    li{
        color: $gray;
        font-size: 1.6rem;
        flex: 1;   // 占位
        text-align: center;
    }
}
```

