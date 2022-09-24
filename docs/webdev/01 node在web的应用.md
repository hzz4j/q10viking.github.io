---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /webdev/
typora-root-url: ..\.vuepress\public
---



## 什么是 Node.js

> [什么是 Node.js？ - Training | Microsoft Learn](https://learn.microsoft.com/zh-cn/training/modules/intro-to-nodejs/2-what)

Node.js（简称 Node）是开源服务器端 JavaScript 运行时环境。 可以使用 Node.js 在浏览器以外的多个位置（例如服务器上）运行 JavaScript 应用程序和代码。

Node.js 是名为 [V8](https://nodejs.dev/learn/the-v8-javascript-engine) 的 JavaScript 引擎的包装器，它支持许多浏览器，包括 Google Chrome、Opera 和 Microsoft Edge。 通过在浏览器外使用 V8 引擎，可以使用 Node.js 来运行 JavaScript。 Node.js 还包含在服务器上运行的应用程序可能需要的许多 V8 优化。 例如，Node.js 添加了“缓冲区”类，使 V8 可以处理文件。 这使 Node.js 成为了构建 Web 服务器等的不错选择。

随着单页应用程序的兴起，JavaScript 变得越来越重要，并支持广泛使用的 JavaScript 对象表示法 (JSON) 数据交换格式。 许多 NoSQL 数据库技术（例如 CouchDB 和 MongoDB）也将 JavaScript 和 JSON 用作查询和架构格式。 Node.js 使用许多新式服务和框架所使用的语言和技术。

可以使用 Node.js 生成以下类型的应用程序：

- HTTP Web 服务器
- 微服务或无服务器 API 后端
- 用于数据库访问和查询的驱动程序
- 交互式命令行接口
- 桌面应用程序
- 实时物联网 (IoT) 客户端和服务器库
- 适用于桌面应用程序的插件
- 用于文件处理或网络访问的 Shell 脚本
- 机器学习库和模型



> Node.js 环境还提供了一个 npm 注册表，可用于共享你自己的 Node.js 库



## Node.js工作原理

> Node.js 使用单个事件循环处理并发任务。适合：应用需要非阻止、事件驱动的服务器。

[Node.js 的工作原理 - Training | Microsoft Learn](https://learn.microsoft.com/zh-cn/training/modules/intro-to-nodejs/3-how-works?pivots=windows)

Node通过事件驱动的方式处理请求时无需为每一个请求创建额外的线程。在事件驱动的模型当中，每一个IO工作被添加到事件队列中，线程循环地处理队列上的工作任务，当执行过程中遇到来堵塞(读取文件、查询数据库)时，线程不会停下来等待结果，而是留下一个处理结果的回调函数，转而继续执行队列中的下一个任务。这个传递到队列中的回调函数在堵塞任务运行结束后才被线程调用

[Overview of Blocking vs Non-Blocking | Node.js (nodejs.org)](https://nodejs.org/en/docs/guides/blocking-vs-non-blocking/)

```js
const fs = require('fs');
const data = fs.readFileSync('/file.md'); // blocks here until file is read
console.log(data);
moreWork(); // will run after console.log

// And here is a similar, but not equivalent asynchronous example:
const fs = require('fs');
fs.readFile('/file.md', (err, data) => {
  if (err) throw err;
  console.log(data);
});
moreWork(); // will run before console.log
```

![显示 Node.js 如何使用事件驱动的体系结构的关系图，其中的事件循环处理业务流程，辅助角色池阻止任务。](/images/webdev/event-loop.svg)


## Node.js REPL

Node.js 具有内置的读取–求值–打印循环 (REPL) 模式，**可用于快速代码计算和试验**

![image-20220924121812577](/images/webdev/image-20220924121812577.png)

也可以执行脚本

![image-20220924122207686](/images/webdev/image-20220924122207686.png)



## 创建node项目

[使用 Node.js 构建 JavaScript 应用程序 - Training | Microsoft Learn](https://learn.microsoft.com/zh-cn/training/paths/build-javascript-applications-nodejs/)

[Source Code](https://github.com/Q10Viking/learncode/tree/main/node/01%20package%20config)

ackage.json 文件不是你手动创作的内容， 这是运行 npm `init` 命令的结果。 可以通过两种主要方法运行此命令：

- `npm init`：此命令启动一个向导，该向导将提示你提供有关项目的名称、版本、说明、入口点、测试命令、Git 存储库、关键字、作者和许可证的信息。
- `npm init -y`：此命令使用 `-y` 标志，是 `npm init` 命令的更快版本，因为它不需要交互。 相反，此命令会使用 `npm init` 自动为系统提示你输入的所有值分配默认值。



### 脚本

你应该设置四个脚本，并以特定方式对其命名。 开发人员社区和各种工具期望以下特定名称：

- `start`：使用条目文件作为参数调用 `node`。 示例：`node ./src/index.js`。 此操作调用 `node` 命令并使用条目文件 `index.js`。
- `build`：说明如何生成项目。 生成过程应生成一些可交付的内容。 例如，build 命令可以运行 TypeScript 编译器以生成要交付的项目的 JavaScript 版本。
- `test`：运行项目的测试。 如果使用第三方测试库，则该命令应调用库的可执行文件。
- `lint`：调用类似 ESLint 的 Linter 程序。 Lint 分析可查找代码中不一致的内容。 Linter 通常还提供一种方法来更正不一致。 具有一致的代码可以极大地提高其可读性，进而加速功能的开发和代码的添加。

```cmd
"scripts" : {
  "<action>" : "<command>"
}
```

::: tip

你可以通过输入命令 `npm run <action>` 来调用操作。 例如 `npm run lint`。

`start` 和 `test` 操作特殊在于你可以在命令中省略单词 `run`。 你可以输入 `npm start`，而不是输入命令 `npm run start`。

:::



## Node包

::: tip

Node.js 附带许多核心库，可处理从文件管理到 HTTP 再到压缩文件等各种任务。 但是，还存在巨大的第三方库生态系统。 得益于 npm（节点包管理器），你可以轻松地安装这些库并在应用程序中使用它们

:::

### npm 注册表和工具

运行 `npm install < name of dependency >` 时，Node.js 会转到称为 npm 注册表的全局注册表，并查找要下载的代码。 它位于 `http://npmjs.org`。 在浏览器中，还可以查看包的此页面。 该站点保存包：源代码的压缩版本。 每个包都有可以访问的专用网站。 可在这些网站上详细了解源代码所在的位置，并查找其他信息，例如有关下载的指标和有关维护的信息。

### 生产依赖项与开发依赖项

- **生产依赖项**：生产依赖项是应用程序投入生产时需要运行的依赖项。 必须在应用程序中内置生产依赖项，以便在应用程序运行时该功能可用。 示例包括一个可用于生成 Web 应用程序的 Web 框架。
- **开发依赖项**：开发依赖项是仅在开发应用程序时需要的依赖项。 可将这些依赖项视为修建建筑物时使用的脚手架。 完成修建后，你便不再需要它们了。 这些依赖项的示例包括测试库、Lint 分析工具或捆绑工具。 这些依赖项是确保应用程序正常运行的重要部分，但你不需要随应用程序一起提供。

这种分离不仅是概念上的。 当你下载依赖项时，npm 工具会将条目添加到清单文件中以此来写入。 借助此工具，可通过将标志添加到安装命令来区分这两种类型的依赖项。 此标志将依赖项的名称及其版本放置在一个名为 `dependencies` 或 `devDependencies` 的部分。 这种区别可清楚地分离应用程序中的依赖项及其类型。 无论安装哪种类型的依赖项，它都存储在 node_modules 目录中。 该标志仅影响清单文件。

这种分离不同类型依赖项的方式还会内置于 npm 命令行工具中。 如果在安装依赖项时指定了 `--production` 标志，则只会安装生产 `dependencies`。 例如，持续集成和持续部署 (CI/CD) 管道使用此标志来确保仅安装运行应用所需的依赖项。

运行 `npm install <dependency name>` 命令以安装要用作应用程序一部分的正常依赖项。 开发人员依赖项是指不会交付到生产环境中的内容。 要安装开发人员依赖项，请添加 `--save-dev` 标志。

如果全局安装某些包，则其不会安装在项目的 node_modules 文件夹中。 而是安装在特定于计算机的目录中，因此可用于计算机上的所有 Node.js 项目。 要安装全局包，请将 `-g` 标志添加到 `install command`，因此该命令类似于 `npm install <dependency name> -g`。

```sh
# 生产依赖
npm install <dependency name>
# 开发者依赖
npm install <dependency name> --save-dev
# 全局依赖
npm install <dependency name> -g
# 如 npm install -g @vue/cli
```

### 查看包

在 package.json 文件的 `dependencies` 部分中列出的包不同于在 node_modules 文件夹中列出的包。 如果需要查看文件夹中的包，可以输入 `npm list` 命令。 但是，此命令可能会生成一个较长的列表。 可能很难掌握其中的内容。 为了帮助解决这个问题，可以列出不同深度的包。 执行此操作时，`list` 命令如下所示：

```
npm list --depth=<depth>
```

深度为 `0` 时，该命令将列出与 package.json 的 `dependencies` 部分中相同的内容。 

### 清理依赖项

可以通过两种方法清理不再需要的依赖项：

- **卸载**：要卸载包，请运行 `npm uninstall <name of dependency>`。 此命令不仅将从清单文件中删除包，还会从 node_modules 文件夹中删除包。
- **删除**：还可以运行 `npm prune` 命令。 通过运行此命令，可删除 node_modules 文件夹中未在清单文件中作为依赖项列出的所有依赖项。 如果要删除多个依赖项，并且不想为每个依赖项运行 `uninstall` 命令，则此命令是一个不错的选择。 要使用此命令删除未使用的依赖项，请先从清单文件的 `dependencies` 或 `devDependencies` 部分删除条目，然后运行 `npm prune` 命令。

## 依赖更新

### 语义化版本控制

语义化版本控制是指如何表达你或其他开发人员向库引入的更改类型。 语义化版本控制的工作原理是确保包具有版本号，并且该版本号划分为以下部分：

- 主版本：最左边的数字。 例如，1.0.0 中的 1。 此数字发生更改意味着代码可能出现中断性变更。 可能需要重写部分代码。
- 次要版本：中间的数字。 例如，1.2.0 中的 2。 此数字发生更改意味着添加了新功能。 你的代码仍可正常工作。 接受更新通常是安全的。
- 修补程序版本：最右边的数字。 例如，1.2.3 中的 3。 此数字发生更改意味着应用了一个更改，修复了代码中应正常工作的内容。 接受更新应是安全的。

下表显示了每个版本类型的版本号如何更改：

| 类型         | 发生的更改         |
| :----------- | :----------------- |
| 主版本       | 1.0.0 更改为 2.0.0 |
| 次要版本     | 1.2.9 更改为 1.3.0 |
| 修补程序版本 | 1.0.7 更改为 1.0.8 |

### 为更新配置 package.json

在更新一个或多个依赖项之前，应配置清单文件，以便在运行 `npm update <name of dependency>` 命令时获得可预测的行为。 你可传达要对包采取的方法。 Node.js 包含一组符号，允许你定义包的更新方式。

此过程是向 package.json 文件中的包条目添加不同的前缀

下面是可为主版本/次要版本/修补程序版本配置的一些模式：

| 模式                 | 更新级别                 |
| :------------------- | :----------------------- |
| x.0.0 或 *（星号）   | 更新到最高主版本。       |
| 1.x.1 或 ^（插入符） | 仅更新到次要版本。       |
| 1.1.x 或 ~（波浪号） | 更新到最新修补程序版本。 |

### 查找和更新过时的包

`pm outdated` 命令列出了已过时的包。 此命令可帮助识别何时有更新版本的包可用。 以下是命令的典型输出：

![image-20220924221415007](/images/webdev/image-20220924221415007.png)

输出中的列包括：

- 包：已过时的包。
- 当前版本：当前安装的包版本。
- 所需版本：与在 package.json 文件中指定的语义模式匹配的最新版本。
- 最新版本：包的最新版本。
- 位置：包依赖项的位置。 `outdated` 命令会遍历各 node_modules 文件夹中的所有已安装的包。
- 依赖方：具有依赖项的包。

建议的工作流是按以下顺序运行这些命令：

1. 运行 `npm outdated` 命令以列出所有已过时的包。 此命令提供“所需版本”、“最新版本”和“位置”列中的信息。
2. 运行 `npm update <optional package name>` 命令以更新已安装的包。 如果使用指定的包名称运行此命令，则该命令会尝试仅更新指定的包。 如果未指定包，则该命令会尝试更新 package.json 中的所有包。

#### 案例

package.json 文件，查看 `dependencies` 部分

```json
"dependencies": {
    "lodash": "^1.1.0",
    "node-fetch": "^2.6.1"
}
```

![image-20220924221925846](/images/webdev/image-20220924221925846.png)

你可以比较放心地将已过时的包更新到所需版本。 此更新级别可确保依赖项获得该次要版本中的最新功能和修补程序。 运行以下命令以进行更新：(只要 package.json 文件中的模式允许，就已经升级了依赖项。但是不会改变package.json的内容，还是指定的样子)

![image-20220924222204794](/images/webdev/image-20220924222204794.png)

通过运行 `npm install <name of package>@<known latest version>` 命令或使用 `latest` 关键字 (`npm install <name of package>@latest`) 来安装最新版本。(会改变package.json的内容)

```shell
npm install node-fetch@latest lodash@latest
```

```json
"dependencies": {
    "lodash": "^4.17.21",
    "node-fetch": "^3.2.10"
  }
```

