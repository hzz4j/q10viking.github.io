---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /minifrontendproject/
typora-root-url: ..\.vuepress\public
---



## Christmas

[项目预览（Project view）](https://q10viking.github.io/Mini-FrontEnd-project/55%20Christmas/dist/)

[Source Code](https://github.com/Q10Viking/Mini-FrontEnd-project/tree/main/55%20Christmas)

<common-progresson-snippet src="https://q10viking.github.io/Mini-FrontEnd-project/55%20Christmas/dist/"/>



## 类封装

```tsx
class Snowflake {
  public static flakes: Snowflake[] = [];
  public static flakesTotal = 250;
  public size: number;
  public x: number;
  public y: number;
  public vx: number;
  public vy: number;
  public div: HTMLDivElement;
  public hit: boolean;
  public melt: boolean;

  constructor(size: number, x: number, y: number, vx: number, vy: number) {
  	// ... ...
  }

  public move() {}
  public draw() {}

  public static init(container: HTMLDivElement) {}

  public static update() {}
}
```



## 动画

```tsx
  public static update() {
    // ...
    requestAnimationFrame(this.update.bind(this));
  }
```



## 参考

- [戒指](https://codepen.io/lenasta92579651/pen/KKXbqWz )
- [顶部闪光](https://codepen.io/tobyj/pen/QjvEex)
- [下雪](https://codepen.io/neave/pen/AzyJVq)
- [合集](https://www.hongkiat.com/blog/christmas-experiment-codepen/)



