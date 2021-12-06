::: tip

为了研究tomcat7,新开一个分支

:::

[Creating a new empty branch for a new project](https://stackoverflow.com/questions/13969050/creating-a-new-empty-branch-for-a-new-project)

```sh
git checkout —orphan tomcat.7.0.109
git rm -rf .
git add new_file
git commit -m 'added first file in the new branch'
git push origin tomcat.7.0.109
```

![image (26)](https://gitee.com/q10viking/PictureRepos/raw/master/images//202112070427536.jpg)

```sh
# 查看本地所有分支
$ git branch
* main
  tomcat.7.0.109
  
# swithc between branchs
git checkout main
git checkout tomcat.7.0.109
```

