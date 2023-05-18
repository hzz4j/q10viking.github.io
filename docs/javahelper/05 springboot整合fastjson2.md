---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /javahelper/
typora-root-url: ..\.vuepress\public
---



## 依赖

[alibaba/fastjson2: 🚄 FASTJSON2 is a Java JSON library with excellent performance. (github.com)](https://github.com/alibaba/fastjson2)

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
    <!--排除掉Jackson-->
    <exclusions>
        <exclusion>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-json</artifactId>
        </exclusion>
    </exclusions>
</dependency>
<dependency>
    <groupId>com.alibaba.fastjson2</groupId>
    <artifactId>fastjson2-extension-spring5</artifactId>
    <version>2.0.32</version>
</dependency>
<dependency>
    <groupId>com.alibaba.fastjson2</groupId>
    <artifactId>fastjson2</artifactId>
    <version>2.0.32</version>
</dependency>
```



### 配置

```java
import com.alibaba.fastjson2.JSONReader;
import com.alibaba.fastjson2.JSONWriter;
import com.alibaba.fastjson2.support.config.FastJsonConfig;
import com.alibaba.fastjson2.support.spring.http.converter.FastJsonHttpMessageConverter;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;
import java.util.ArrayList;
import java.nio.charset.StandardCharsets;
@Configuration
public class JsonMessageConverterConfigurer implements WebMvcConfigurer {

    /**
     * 与org.springframework.web.servlet.config.annotation.WebMvcConfigurer.configureMessageConverters()方法的区别是：
     *  使用configureMessageConverters方法会导致springboot不会注入默认的消息转换器
     *
     * @param converters
     */
    @Override
    public void extendMessageConverters(List<HttpMessageConverter<?>> converters) {
        FastJsonHttpMessageConverter converter = new FastJsonHttpMessageConverter();
        FastJsonConfig config = new FastJsonConfig();
        config.setDateFormat("yyyy-MM-dd HH:mm:ss");
        config.setReaderFeatures(JSONReader.Feature.FieldBased, JSONReader.Feature.SupportArrayToBean);
        config.setWriterFeatures(JSONWriter.Feature.WriteMapNullValue, JSONWriter.Feature.PrettyFormat);
        converter.setFastJsonConfig(config);
        converter.setDefaultCharset(StandardCharsets.UTF_8);
        List<MediaType> supportedMediaTypes = new ArrayList<>();
        supportedMediaTypes.add(MediaType.APPLICATION_JSON);
        supportedMediaTypes.add(MediaType.APPLICATION_JSON_UTF8);
        converter.setSupportedMediaTypes(supportedMediaTypes);
        converters.add(0, converter);
    }
}
```



## 错误页面定义

```java
@Component
public class JsonViewResolver implements ErrorViewResolver {
    @Override
    public ModelAndView resolveErrorView(HttpServletRequest request, HttpStatus status, Map<String, Object> model) {
        FastJsonJsonView fastJsonJsonView = new FastJsonJsonView();
        Properties properties = new Properties();
        properties.setProperty("code", "404");
        properties.setProperty("message", "Not Found");
        fastJsonJsonView.setAttributes(properties);
        Map<String, Object> map = new HashMap<>();
        map.put("author", "Q10Viking");
        fastJsonJsonView.setRenderedAttributes(CollUtil.set(false, "code", "message", "author"));
        fastJsonJsonView.setAttributesMap(map);
        return new ModelAndView(fastJsonJsonView);
    }
}

```





