---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /MySQL/
typora-root-url: ..\.vuepress\public
---





**首先，**获取事务的回滚指针或Undo Log的起始位置。

从Undo Log的末尾开始逆向扫描，按照事务操作的逆序依次处理每个日志记录。

**然后，**针对 INSERT 操作，执行 DELETE 操作来撤销插入的数据。对于 UPDATE 操作，使用Undo Log 中记录的旧值将数据还原到之前的状态。

在回滚过程中，对于已经提交的其他事务所做的修改需要跳过，只处理属于当前回滚事务的 Undo Log 记录。

按照逆序依次处理所有的日志记录，直到达到回滚指针位置或 Undo Log 的起始位置。

**回滚完成后，**清除或标记已回滚的 Undo Log 记录。

总体而言，事务回滚是通过执行 Undo Log 中记录的反向操作，将事务的修改操作撤销，恢复到事务开始前的状态。