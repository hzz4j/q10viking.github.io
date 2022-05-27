

> builder模式的泛型
>
> D:\learncode\mico servie\LearnNacos\mall-order\src\test\java\org\hzz\jdk

```java
public class RestResult<T> {
    private int code;
    private T data;

    public void setCode(int code) {
        this.code = code;
    }

    public void setData(T data) {
        this.data = data;
    }

    public static <T>  RestResultBuilder<T> builder(){ return new RestResultBuilder<T>();}

    public static final class RestResultBuilder<T>{
        private int code;
        private T data;

        public RestResultBuilder<T> withCode(int code){
            this.code = code;
            return this;
        }

        public RestResultBuilder<T> withData(T data){
            this.data = data;
            return this;
        }

        public RestResult<T> build(){
            RestResult<T> restResult = new RestResult<>();
            restResult.setCode(this.code);
            restResult.setData(this.data);
            return restResult;
        }
    }
}

```

