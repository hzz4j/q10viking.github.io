---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /topicNav/
typora-root-url: ..\.vuepress\public
---

## MySQL实现分布式锁

> 可以利用数据库的唯一索引来实现，唯一索引天然具有排他性

```sql
CREATE TABLE `t_methodlock`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `method_name` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '锁定的方法名',
  `update_time` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '保存数据时间，自动生成',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uidx_method_name`(`method_name`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '锁定中的方法' ROW_FORMAT = Dynamic;

```

![img](/images/lock/46070)