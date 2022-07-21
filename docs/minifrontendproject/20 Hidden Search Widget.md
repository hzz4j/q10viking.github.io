---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /minifrontendproject/
typora-root-url: ..\.vuepress\public
---



## Hidden Search Widget

[项目预览（Project view）](https://q10viking.github.io/Mini-FrontEnd-project/25%20Hidden%20Search%20Widget/dist/)

[Source Code](https://github.com/Q10Viking/Mini-FrontEnd-project/tree/main/25%20Hidden%20Search%20Widget)

<common-progresson-snippet src="https://q10viking.github.io/Mini-FrontEnd-project/25%20Hidden%20Search%20Widget/dist/"/>





## scss继承属性

```scss
.share-section{
    height: $size;
    width: $size;
    &:focus{
        outline: none;
    }
}

body{
    .search{
        height: $size;
        position: relative;

        .input{
            @extend .share-section;
            transition: width $second ease;
        }

        .btn{
            @extend .share-section;
            transition: transform $second ease;
        }
    }
}
```

