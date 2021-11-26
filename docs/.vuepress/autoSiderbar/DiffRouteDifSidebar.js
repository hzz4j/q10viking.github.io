/**
 * 不同子路径下的页面会使用不同的侧边栏
 */

const autoGetSidebarOptionBySrcDir = require('./AllPageSameSildeBar');
const titles = require('./textTitle');

function autoGenSidebar(){
    // 专题导航
    let topicNav = [];
    let result = {'/topicNav/': []};
    const contents = autoGetSidebarOptionBySrcDir();

    contents.forEach(element => {
   
        if(!(element.link in result)){
            result[element.link] = []
            // 添加进去导航
            topicNav.push({
                text: element.text,
                link: element.link
            });
        }
   
        result[element.link].push({
            text: element.text,
            children: element.children
        })
    });
    
    result['/topicNav/'].push({
        text: titles['topicNav'],
        children: topicNav
    })

    return result;
}

// 测试
//console.log(JSON.stringify(autoGenSidebar()));
/**
{
    "/vuepress/":[
        {
            "text":"Vuepress博客搭建",
            "children":[
                {
                    "text":"01 搭建vuepress2",
                    "link":"/vuepress/01 搭建vuepress2.md"
                },
                {
                    "text":"02 图片存放路径",
                    "link":"/vuepress/02 图片存放路径.md"
                },
                {
                    "text":"03 侧边栏配置",
                    "link":"/vuepress/03 侧边栏配置.md"
                }
            ]
        }
    ]
}
*/
 
 module.exports = autoGenSidebar;