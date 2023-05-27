---
sidebarDepth: 3
sidebar: auto
prev:
  text: Back To 目录
  link: /javahelper/
typora-root-url: ..\.vuepress\public
---



## @JsonCreator

该注解用在对象的反序列时指定特定的构造函数.在反序列化时，Jackson默认会调用对象的无参构造函数

如果默认构造函数无法满足需求，或者说我们需要在构造对象时做一些特殊逻辑，可以使用该注解。该注解需要搭配@JsonProperty使用

[Deserialize Immutable Objects with Jackson | Baeldung](https://www.baeldung.com/jackson-deserialize-immutable-objects#:~:text=%40JsonCreator (mode %3D JsonCreator.Mode.PROPERTIES) public Employee(%40JsonProperty ("id") long,deserializer to use the designated constructor for deserialization.)

```java
public class Money implements ValueObject<Money> {
    public final String currency; // 货币
    public final Integer amount; // 金额
    public final Integer scale; // 精度
    @JsonIgnore
    public final BigDecimal amountAsBigDecimal; // 金额

    @JsonCreator
    public Money(
            @JsonProperty("currency")
            String currency,
            @JsonProperty("amount")
            Integer amount,
            @JsonProperty("scale")
            Integer scale) {
        this.currency = currency;
        this.amount = amount;
        this.scale = scale;
        this.amountAsBigDecimal = new BigDecimal(amount).movePointLeft(2).setScale(scale);
    }
    @Override
    public boolean sameValueAs(Money other) {
        return false;
    }
}
```

