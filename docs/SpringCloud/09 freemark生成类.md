---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /SpringCloud/
typora-root-url: ..\.vuepress\public
---



## 核心原理(DatabaseMetaData)

```java
DatabaseMetaData metaData = connection.getMetaData();
// 获取表元数据
ResultSet tableSet = metaData.getTables(ConfigConstants.SCHEMA, "%", tableName, new String[]{"TABLE"});
// 获取主键
ResultSet primaryKeySet = metaData.getPrimaryKeys(ConfigConstants.SCHEMA, "%", tableName);
// 获取字段信息
ResultSet columnSet = metaData.getColumns(ConfigConstants.SCHEMA, "%", tableName, "%");
```



## 使用freemark+jdbc生成pojo

[Source Code](https://github.com/Q10Viking/springcloudalibaba/tree/main/gencode/gencode)

```xml
<dependency>
    <groupId>org.freemarker</groupId>
    <artifactId>freemarker</artifactId>
    <version>2.3.23</version>
</dependency>
```



```java

/**
 * POJO生成
 */
@Slf4j
public class EntityGeneratorTest {
    private static final Map<String,String> jdbcToJavaType= new HashMap<>();
    private static List<String> primaryKeys;

    static{
        //初始化jdbc类型转换。
        jdbcToJavaType.put("VARCHAR", "String");
        jdbcToJavaType.put("CHAR", "String");
        jdbcToJavaType.put("VARCHAR2", "String");
        jdbcToJavaType.put("NVARCHAR", "String");
        jdbcToJavaType.put("LONGNVARCHAR", "String");
        jdbcToJavaType.put("TEXT", "String");
        jdbcToJavaType.put("CLOB", "String");
        jdbcToJavaType.put("TINYLOB", "String");
        jdbcToJavaType.put("INT", "Integer");
        jdbcToJavaType.put("INTEGER", "Integer");
        jdbcToJavaType.put("SMALLINT", "Integer");
        jdbcToJavaType.put("TINYINT", "Integer");
        jdbcToJavaType.put("BIGINT", "Long");

        jdbcToJavaType.put("NUMBERIC", "Long");
        jdbcToJavaType.put("NUMBER", "Long");
        jdbcToJavaType.put("DOUBLE", "Double");
        jdbcToJavaType.put("FLOAT", "Float");

        jdbcToJavaType.put("DATE", "Date");
        jdbcToJavaType.put("DATETIME", "Date");//java.util.Date
        jdbcToJavaType.put("TIMESTAMP", "Timestamp");//java.sql.Timestamp

    }

    public static void main(String[] args) throws Exception {
        Configuration configuration = new Configuration(Configuration.getVersion());
        configuration.setDirectoryForTemplateLoading(new File(ConfigConstants.ftlLocation));

        log.info("==== 开始生成 " + ConfigConstants.TABLENAME + " 表对应的POJO ====");
        Template template = configuration.getTemplate("Pojo.ftl");
        Map<String, Object> paramMap = getCommonParam(ConfigConstants.TABLENAME);


        addTableInfo(paramMap, ConfigConstants.TABLENAME);
        String pojoName = paramMap.get("pojo_name").toString();

        File pojoFile = new File(Utils.getPojoLocation(pojoName));
        Writer writer = new OutputStreamWriter(new FileOutputStream(pojoFile), "UTF-8");
        template.process(paramMap, writer);
        writer.flush();
        writer.close();
        log.info("==== " + ConfigConstants.TABLENAME + " 表对应的POJO类生成成功 生成地址：" + pojoFile.getAbsolutePath() + " ====");
    }

    private static void addTableInfo(Map<String, Object> paramMap, String tableName) throws Exception {
        //获取表结构信息 主要是表名、表注释、字段名，字段类型， 字段注释。
        Class.forName("com.mysql.cj.jdbc.Driver");
        Properties properties = new Properties();
        properties.setProperty("user",ConfigConstants.USERNAME);
        properties.setProperty("password",ConfigConstants.PASSWORD);
        properties.setProperty("useInformationSchema","true");
        Connection connection = DriverManager.getConnection(ConfigConstants.JDBCURL, properties);

        // 获取表结构
        DatabaseMetaData metaData = connection.getMetaData();
        ResultSet tableSet = metaData.getTables(ConfigConstants.SCHEMA, "%", tableName, new String[]{"TABLE"});
        if(tableSet.next()){
            paramMap.put("table_name", tableName);
            paramMap.put("table_name_small", tableName.toLowerCase());
            paramMap.put("table_remark", tableSet.getString("REMARKS"));
            log.info("获取到表信息 TABLE_NAME => " + tableSet.getString("TABLE_NAME") + ";TABLE_REMARK => " + tableSet.getString("REMARKS"));
        }else{
            log.error("数据库中没有查到表 " + tableName);
            throw new RuntimeException("数据库中没有此表");
        }

        //加载主键
        if(primaryKeys == null || primaryKeys.size() == 0){
            primaryKeys = new ArrayList<String>();//主键列名
            ResultSet primaryKeySet = metaData.getPrimaryKeys(ConfigConstants.SCHEMA, "%", tableName);
            while (primaryKeySet.next()) {
                primaryKeys.add(primaryKeySet.getString("COLUMN_NAME"));
            }
        }

        //获取字段信息
        ResultSet columnSet = metaData.getColumns(ConfigConstants.SCHEMA, "%", tableName, "%");
        List<Map<String, Object>> columns = new ArrayList<>();
        while (columnSet.next()) {
            Map<String, Object> columnInfo = new HashMap<>();
            String columnName = columnSet.getString("COLUMN_NAME");
            String columnType = columnSet.getString("TYPE_NAME");
            int datasize = columnSet.getInt("COLUMN_SIZE");
            int digits = columnSet.getInt("DECIMAL_DIGITS");
            int nullable = columnSet.getInt("NULLABLE");
            String remarks = columnSet.getString("REMARKS");
            log.info("获取到字段信息 ： columnName =>" + columnName + ";columnType => " + columnType + ";datasize=>" + datasize + "=>" + digits + ";nullable => " + nullable + ";remarks => " + remarks);
            //只对JDBC几种常见的数据类型做下匹配，其他不常用的就暂时不生成了。 健壮的类型映射还是需要看下别的框架是怎么做的。
            if (StringUtils.isNotBlank(columnType)
                    && jdbcToJavaType.containsKey(columnType.toUpperCase())) {
                columnInfo.put("columnName", columnName);
                columnInfo.put("columnType", columnType);
                columnInfo.put("javaType", jdbcToJavaType.get(columnType.toUpperCase()));
                String javaName = getCamelName(columnName);
                columnInfo.put("javaName", javaName);
                columnInfo.put("getterName", "get" + javaName.substring(0, 1).toUpperCase() + javaName.substring(1));
                columnInfo.put("setterName", "set" + javaName.substring(0, 1).toUpperCase() + javaName.substring(1));
                columnInfo.put("remarks", StringUtils.isNotBlank(remarks) ? remarks : "");
                columnInfo.put("isPK", primaryKeys.contains(columnName) ? "true" : "");
                columns.add(columnInfo);
            } else {
                log.error("字段信息 ： columnName =>" + columnName + " 类型 columnType => " + columnType + " 暂无法处理，待以后进行扩展 ;");
                throw new Exception("字段信息 ： columnName =>" + columnName + " 类型 columnType => " + columnType + " 暂无法处理，待以后进行扩展 ;");
            }
        }
        paramMap.put("COLUMNS", columns);
    }


    private static String getCamelName(String columnName) {
        //防止死循环，加个计数器。
        int count = 5;
        while(columnName.indexOf("_")>-1 && count >0) {
            int index = columnName.indexOf("_");
            columnName = columnName.substring(0,1).toLowerCase()+columnName.substring(1, index)
                    +columnName.substring(index+1,index+2).toUpperCase()+columnName.substring(index+2);
            count --;
        }
        return columnName;
    }


    private static Map<String, Object> getCommonParam(String tableName){
        Map<String, Object> paramMap = new HashMap<>();
        String pojoName = getPOJONameByTableName(tableName);
        paramMap.put("pojo_name", pojoName);
        String genTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy/MM/dd"));
        paramMap.put("gen_time", genTime);
        return paramMap;
    }

    /**
     * 将表名称转换为pojo名称
     * @param tableName
     * @return
     */
    private static String getPOJONameByTableName(String tableName) {
        //防止死循环，加个计数器。
        tableName = tableName.substring(0, 1).toUpperCase() + tableName.substring(1);
        int count = 5;
        while (tableName.indexOf("_") > -1 && count > 0) {
            int index = tableName.indexOf("_");
            tableName = tableName.substring(0, index)
                    + tableName.substring(index + 1, index + 2).toUpperCase() + tableName.substring(index + 2);
            count--;
        }
        return tableName;
    }
}

```

输出

```java
三月 20, 2023 9:58:14 下午 org.hzz.EntityGeneratorTest main
信息: ==== 开始生成 ums_member 表对应的POJO ====
三月 20, 2023 9:58:18 下午 org.hzz.EntityGeneratorTest addTableInfo
信息: 获取到表信息 TABLE_NAME => ums_member;TABLE_REMARK => 会员表
三月 20, 2023 9:58:18 下午 org.hzz.EntityGeneratorTest addTableInfo
信息: 获取到字段信息 ： columnName =>id;columnType => BIGINT;datasize=>19=>0;nullable => 0;remarks => 
三月 20, 2023 9:58:18 下午 org.hzz.EntityGeneratorTest addTableInfo
信息: 获取到字段信息 ： columnName =>member_level_id;columnType => BIGINT;datasize=>19=>0;nullable => 1;remarks => 
三月 20, 2023 9:58:18 下午 org.hzz.EntityGeneratorTest addTableInfo
信息: 获取到字段信息 ： columnName =>username;columnType => VARCHAR;datasize=>64=>0;nullable => 1;remarks => 用户名
三月 20, 2023 9:58:18 下午 org.hzz.EntityGeneratorTest addTableInfo
信息: 获取到字段信息 ： columnName =>password;columnType => VARCHAR;datasize=>64=>0;nullable => 1;remarks => 密码
三月 20, 2023 9:58:18 下午 org.hzz.EntityGeneratorTest addTableInfo
信息: 获取到字段信息 ： columnName =>nickname;columnType => VARCHAR;datasize=>64=>0;nullable => 0;remarks => 昵称
三月 20, 2023 9:58:18 下午 org.hzz.EntityGeneratorTest addTableInfo
信息: 获取到字段信息 ： columnName =>phone;columnType => VARCHAR;datasize=>64=>0;nullable => 1;remarks => 手机号码
三月 20, 2023 9:58:18 下午 org.hzz.EntityGeneratorTest addTableInfo
信息: 获取到字段信息 ： columnName =>status;columnType => INT;datasize=>10=>0;nullable => 1;remarks => 帐号启用状态:0->禁用；1->启用
三月 20, 2023 9:58:18 下午 org.hzz.EntityGeneratorTest addTableInfo
信息: 获取到字段信息 ： columnName =>create_time;columnType => DATETIME;datasize=>19=>0;nullable => 1;remarks => 注册时间
三月 20, 2023 9:58:18 下午 org.hzz.EntityGeneratorTest addTableInfo
信息: 获取到字段信息 ： columnName =>icon;columnType => VARCHAR;datasize=>500=>0;nullable => 1;remarks => 头像
三月 20, 2023 9:58:18 下午 org.hzz.EntityGeneratorTest addTableInfo
信息: 获取到字段信息 ： columnName =>gender;columnType => INT;datasize=>10=>0;nullable => 1;remarks => 性别：0->未知；1->男；2->女
三月 20, 2023 9:58:18 下午 org.hzz.EntityGeneratorTest addTableInfo
信息: 获取到字段信息 ： columnName =>birthday;columnType => DATE;datasize=>10=>0;nullable => 1;remarks => 生日
三月 20, 2023 9:58:18 下午 org.hzz.EntityGeneratorTest addTableInfo
信息: 获取到字段信息 ： columnName =>city;columnType => VARCHAR;datasize=>64=>0;nullable => 1;remarks => 所做城市
三月 20, 2023 9:58:18 下午 org.hzz.EntityGeneratorTest addTableInfo
信息: 获取到字段信息 ： columnName =>job;columnType => VARCHAR;datasize=>100=>0;nullable => 1;remarks => 职业
三月 20, 2023 9:58:18 下午 org.hzz.EntityGeneratorTest addTableInfo
信息: 获取到字段信息 ： columnName =>personalized_signature;columnType => VARCHAR;datasize=>200=>0;nullable => 1;remarks => 个性签名
三月 20, 2023 9:58:18 下午 org.hzz.EntityGeneratorTest addTableInfo
信息: 获取到字段信息 ： columnName =>source_type;columnType => INT;datasize=>10=>0;nullable => 1;remarks => 用户来源
三月 20, 2023 9:58:18 下午 org.hzz.EntityGeneratorTest addTableInfo
信息: 获取到字段信息 ： columnName =>integration;columnType => INT;datasize=>10=>0;nullable => 1;remarks => 积分
三月 20, 2023 9:58:18 下午 org.hzz.EntityGeneratorTest addTableInfo
信息: 获取到字段信息 ： columnName =>growth;columnType => INT;datasize=>10=>0;nullable => 1;remarks => 成长值
三月 20, 2023 9:58:18 下午 org.hzz.EntityGeneratorTest addTableInfo
信息: 获取到字段信息 ： columnName =>luckey_count;columnType => INT;datasize=>10=>0;nullable => 1;remarks => 剩余抽奖次数
三月 20, 2023 9:58:18 下午 org.hzz.EntityGeneratorTest addTableInfo
信息: 获取到字段信息 ： columnName =>history_integration;columnType => INT;datasize=>10=>0;nullable => 1;remarks => 历史积分数量
三月 20, 2023 9:58:18 下午 org.hzz.EntityGeneratorTest addTableInfo
信息: 获取到字段信息 ： columnName =>gmt_create;columnType => DATETIME;datasize=>26=>0;nullable => 1;remarks => 
三月 20, 2023 9:58:18 下午 org.hzz.EntityGeneratorTest addTableInfo
信息: 获取到字段信息 ： columnName =>gmt_modified;columnType => DATETIME;datasize=>26=>0;nullable => 1;remarks => 
三月 20, 2023 9:58:18 下午 org.hzz.EntityGeneratorTest main
信息: ==== ums_member 表对应的POJO类生成成功 生成地址：D:\Github\springcloudalibaba\gencode\gencode\src\main\resources\ftlout\UmsMember.java ====

```



### freemark模板

```java
package org.hzz.model;

import java.io.Serializable;
import java.util.Date;
import java.sql.Timestamp;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.TableField;

/**
* @desc：the module of table ${table_name}
<#if table_remark !="">found table comment  ${table_remark}</#if>
* @date ${gen_time}
*/
@TableName("${table_name_small}")
public class ${pojo_name}{
<#if COLUMNS?exists>
    <#list COLUMNS as model>
        <#if model.remarks != "">//${model.remarks}</#if>
        <#if model.isPK == "true">@TableId</#if>
        @TableField("${model.columnName}")
        private ${model.javaType} ${model.javaName};
    </#list>
</#if>

<#if COLUMNS?exists>
    <#list COLUMNS as model>
        public ${model.javaType} ${model.getterName}() {
        return ${model.javaName};
        }

        public void ${model.setterName}(${model.javaType} ${model.javaName}) {
        <#if model.javaType == "String">
            this.${model.javaName} = ${model.javaName} == null ? null : ${model.javaName}.trim();
        <#else>
            this.${model.javaName} = ${model.javaName};
        </#if>
        }
    </#list>
</#if>

    public String toString(){
        StringBuilder sb = new StringBuilder();
        sb.append("pojo.${pojo_name} ").append("[");
        <#if COLUMNS?exists>
            <#list COLUMNS as model>
                sb.append(", ${model.javaName} = ").append(${model.javaName});
            </#list>
        </#if>
        sb.append("]");
        return sb.toString();
    }
}
```

