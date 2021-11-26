/**
 * vuepress 配置文件
 */

const autoGenSidebar = require('./autoSiderbar/DiffRouteDifSidebar')
const navbar = require('./config/navBar');
const sidebar = autoGenSidebar();

module.exports = {
  lang: 'zh-CN',
  title: '静默的Vlog',
  description: '静默的Vuepress Blog',
  head: [['link', { rel: 'icon', href: '/images/favicon-32x32.png' }]], // icon设置
  themeConfig: {
    logo: 'https://gitee.com/q10viking/PictureRepos/raw/master/images/202111270249540.png',
    lastUpdated: false,   // 禁用显示更新时间
    contributors: false,   // 禁用显示贡献者
    sidebar,
    navbar
  },
  // plugins: [
  //   [
  //     '@vuepress/plugin-search',
  //     {
  //       // 排除首页
  //       isSearchable: (page) => page.path !== '/',
  //     },
  //   ],
  //   [ '@vuepress/docsearch',{
  //     apiKey: '',
  //     indexName: ''
  //   }]
  // ]
}