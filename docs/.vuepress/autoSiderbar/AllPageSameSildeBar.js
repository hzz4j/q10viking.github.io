/**
 * 所有页面会使用相同的侧边栏
 */

const path = require("path");
const dirTree = require("directory-tree");
const titles = require('./textTitle');
const SRC_PATH = path.resolve(__dirname, "../../");
var fs = require('fs');


/**
 * 默认使用文件夹名称作为route,如果文件有中文则sidebar不会生效
 * 维护了一个份textTitle来将route转换为title
 */
function getTitle(name){
  if(titles[name] === undefined){
    console.log("===================================================================");
    console.warn("[Warn]: 请在 textTitle.js 文件中维护一个 %s 的title",name);
    console.log("===================================================================");
    return name;
  }
  return titles[name];
}

function toSidebarOption(tree = []) {
  if (!Array.isArray(tree)) return [];


  return tree.map((v) => {
    var stat = fs.statSync(v.path);
  
    if (stat.isDirectory()) {
      return {
        text: getTitle(v.name),
        // link: v.path.split("docs")[1]+'/',
        link: `/${v.name}/`,
        children: toSidebarOption(v.children),
      };
    } else {
      return {
        text: path.basename(v.path).replace(/\.md$/, ""),
        link: v.path.split("docs")[1]
      }
    }
  });
}

/**
 如去除.vuepress的节点
 {
            "path":"d:/Github/vlog/docs/.vuepress",
            "name":".vuepress",
            "children":Array[4]
 }
 * @param {*} srcDir 
 * @returns 
 */
function removeDotvuepress(srcDir){
    return srcDir.children.filter(node => {

      if(node.path.endsWith('.vuepress')){
        return false;
      }else if(node.path.endsWith('topicNav')){
        return false;
      }
      return true;
    } );
}

function autoGetSidebarOptionBySrcDir(srcPath = SRC_PATH) {
  const srcDir = dirTree(srcPath, {
    extensions: /\.md$/,
    normalizePath: true,
    exclude: /README.md|readme.md/
  });

  const children = removeDotvuepress(srcDir);
  //console.log(JSON.stringify(children))

  const sideBar = toSidebarOption(children);
  console.log('Generated sidebar finished :)');
  return sideBar;
}

//=================测试===============================
//const result = autoGetSidebarOptionBySrcDir();
//console.log(JSON.stringify(result));

/** 生成的结果
[
    {
        "text":"Vuepress博客搭建",
        "link":"/vuepress/",
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
 */

module.exports = autoGetSidebarOptionBySrcDir;
