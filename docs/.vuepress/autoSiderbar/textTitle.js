/**
 * 本来的想法是使用文件夹的名称来作为sidebar的route
 * 但是发现route不能使用中文
 * 所以将文件夹的名称的作为route,而route的text则在这里维护一份
 * 
 * key: route
 * val: text
 */

const titles = {
    'vuepress': 'Vuepress博客搭建',
    'topicNav': '📗Menu',
    'vue3': 'Vue3 学习',
    'typescript': 'TypeScript',
    'javascript': 'JavaScript',
    'aboutme': 'AboutMe'
};


module.exports = titles;