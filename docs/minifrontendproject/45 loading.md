---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /minifrontendproject/
typora-root-url: ..\.vuepress\public
---



## Loading

[项目预览（Project view）](https://q10viking.github.io/Mini-FrontEnd-project/48%20loading/)

[Source Code](https://github.com/Q10Viking/Mini-FrontEnd-project/tree/main/48%20loading)

<common-progresson-snippet src="https://q10viking.github.io/Mini-FrontEnd-project/48%20loading/"/>





## 核心思想

- 基础动画的结合
- 使用了4个点，来进行衔接过渡

```css
/* ---------------animation dots------------------------ */
.animate .loading__dot:nth-child(1) {
  animation: scale-dot 0.8s 0.2s forwards;
}

.animate .loading__dot:nth-child(2),
.animate .loading__dot:nth-child(3) {
  animation: move-right 0.6s forwards;
}

.animate .loading__dot-down {
  animation: move-right-down 0.8s 0.2s forwards linear,
    move-down 2.8s 0.3s forwards ease-in;
}

/* animation dot1 */
@keyframes scale-dot {
  100% {
    transform: scale(1);
  }
}

@keyframes move-right {
  100% {
    transform: translateX(1rem);
  }
}

@keyframes move-right-down {
  50% {
    transform: translate(1.5rem, 0.25rem);
  }

  100% {
    transform: translate(2rem, 0.5rem);
  }
}

@keyframes move-down {
  100% {
    transform: translate(10rem, 80vh);
  }
}
```

