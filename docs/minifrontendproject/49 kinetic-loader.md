---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /minifrontendproject/
typora-root-url: ..\.vuepress\public
---

## Kinetic loader

[项目预览（Project view）](https://q10viking.github.io/Mini-FrontEnd-project/52%20kinetic-loader/dist/)

[Source Code](https://github.com/Q10Viking/Mini-FrontEnd-project/tree/main/52%20kinetic-loader)

<common-progresson-snippet src="https://q10viking.github.io/Mini-FrontEnd-project/52%20kinetic-loader/dist/"/>

## 动画控制

```scss
&::before{
    transform: rotate(90deg);
    animation: rotateBefore 2s infinite;
  }

  &::after{
    animation: rotateAfter 2s 0.5s infinite;
  }

  @keyframes rotateAfter {
    0%,
    25% {
      transform: rotate(0deg);
    }

    50%,
    75% {
      transform: rotate(180deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }



  @keyframes rotateBefore {
    0%,
    25% {
      transform: rotate(90deg);
    }

    50%,
    75% {
      transform: rotate(270deg);
    }

    100% {
      transform: rotate(450deg);
    }
  }
```

