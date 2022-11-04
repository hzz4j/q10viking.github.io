---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /minifrontendproject/
typora-root-url: ..\.vuepress\public
---

## Testimanial box switch

[项目预览（Project view）](https://q10viking.github.io/Mini-FrontEnd-project/51%20Testimonial-box-switcher/dist/)

[Source Code](https://github.com/Q10Viking/Mini-FrontEnd-project/tree/main/51%20Testimonial-box-switcher)

<common-progresson-snippet src="https://q10viking.github.io/Mini-FrontEnd-project/51%20Testimonial-box-switcher/dist/"/>



## 进度条

```scss
.progress-bar{
    width: 100%;
    height: .4rem;
    background-color: #fff;
    animation: grow 10s linear infinite;
    transform-origin: left;
    @keyframes grow {
        0%{
            transform: scaleX(0);
        }
    }
}
```

