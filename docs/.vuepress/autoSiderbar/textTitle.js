/**
 * 本来的想法是使用文件夹的名称来作为sidebar的route
 * 但是发现route不能使用中文
 * 所以将文件夹的名称的作为route,而route的text则在这里维护一份
 *
 * key: route
 * val: text
 */

const titles = {
  vuepress: "Vuepress博客搭建",
  topicNav: "📗Menu",
  vue3: "Vue3 学习",
  css: "CSS3",
  typescript: "TypeScript",
  javascript: "JavaScript",
  tomcat: "Tomcat源码分析",
  aboutme: "AboutMe",
  networkDevelopByJava: "NetWork Programming",
  golang: "Golang",
  mybatis: "Mybatis",
  "modern-mall": "Modern Mall",
  java: "Java",
  spring: "Spring Framework",
  springmvc: "Spring MVC",
  springboot: "Spring Boot",
  cloudnative: "Cloud Native",
  minifrontendproject: "Mini FrontEnd Pro😊",
  ddd: "DDD",
  gRPC: "GRPC",
  designpattern: "设计模式",
  kafka: "Kafka",
  MySQL: "MySQL",
  nacos: "Nacos",
  netty: "Netty",
  rabbitmq: "RabbitMQ",
  RocketMQ: "RocketMQ",
  seata: "Seata",
  springsecurity: "Spring Security",
  zk: "Zookeeper",
  sentinel: "Sentinel",
  dubbo: "Dubbo",
  win11: "Win11",
  Linux: "Linux",
  Redis: "Redis",
  Lock: "Lock",
  Nginx: "Nginx",
  ElasticStack: "ElasticStack",
  Algorithm: "Algorithm",
  JVM: "JVM",
  webdev: "Webdev",
  concurrency: "并发编程",
  FileSystem: "FileSystem",
  Docker: "Docker",
  SpringCloud: "微服务",
  gateway: "网关",
  skywalking: "Skywalking",
  Ribbon: "Ribbon",
  Feign: "Feign"
};

module.exports = titles;
