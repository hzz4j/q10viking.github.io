---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /MySQL/
typora-root-url: ..\.vuepress\public
---



MySQL的Binlog有三种录入格式，分别是**Statement格式**、**Row格式**和**Mixed格式**。

### **Statement格式：**

- 将SQL语句本身记录到Binlog中。
- 记录的是在主库上执行的SQL语句，从库通过解析并执行相同的SQL来达到复制的目的。
- 简单、易读，节省存储空间。
- 但是，在某些情况下，由于执行计划或函数等因素的影响，相同的SQL语句在主从库上执行结果可能不一致，导致复制错误。

### **Row格式：**

- 记录被修改的每一行数据的变化。
- 不记录具体的SQL语句，而是记录每行数据的变动情况，如插入、删除、更新操作前后的值。
- 保证了复制的准确性，不受SQL语句执行结果的差异影响，适用于任何情况。
- 但是，相比Statement格式，Row格式会占用更多的存储空间。

### Mixed格式：
● Statement格式和Row格式的结合，MySQL自动选择适合的格式。
● 大多数情况下使用Statement格式进行记录，但对于无法保证安全复制的情况，如使用非确定性函数、触发器等，会自动切换到Row格式进行记录。
● 结合了两种格式的优势，既减少了存储空间的占用，又保证了复制的准确性。