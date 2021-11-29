/**
 * vuepress 配置文件
 */

const autoGenSidebar = require('./autoSiderbar/DiffRouteDifSidebar')
const navbar = require('./config/navBar');
const sidebar = autoGenSidebar();
const { path } = require('@vuepress/utils')

module.exports = {
  lang: 'zh-CN',
  title: '静默的Vlog',
  description: '静默的Vuepress Blog',
  head: [['link', { rel: 'icon', href: '/images/favicon-32x32.png' }]], // icon设置
  plugins: [
    [
      '@vuepress/plugin-register-components',
      {
        componentsDir: path.resolve(__dirname, './components'),
      },
    ],
    [
      '@vuepress/docsearch',  // alogolia docsearch
      {
        appId: '20P1NJDB7B',  // Add your own Application ID
        apiKey: '25cd701e07d0762388df4474cbf8c05d', // Set it to your own *search* API key
        indexName: 'docs'
      }
    ],
    [
      '@vuepress/plugin-google-analytics',
      {
        id: 'G-9Q8QRJLSGZ',
      }
    ]
   ],
  themeConfig: {
    logo: 'https://gitee.com/q10viking/PictureRepos/raw/master/images/202111270249540.png',
    lastUpdated: false,   // 禁用显示更新时间
    contributors: false,   // 禁用显示贡献者
    sidebar,
    navbar
  }
}