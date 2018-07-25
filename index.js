const express = require('express')
const app = express()
const port = 3001
// 引入所需要的第三方包
const superagent= require('superagent');
const cheerio = require('cheerio');

let getDatas = (res) => {
  let target = [];
  // 访问成功，请求https://www.renrenche.com/bj/ershouche/?plog_id=3f14b07dc77a6295b14f91f40bfe99bd页面所返回的数据会包含在res.text中。
  
  /* 使用cheerio模块的cherrio.load()方法，将HTMLdocument作为参数传入函数
     以后就可以使用类似jQuery的$(selectior)的方式来获取页面元素
   */
  let $ = cheerio.load(res.text);

  // 找到目标数据所在的页面元素，获取数据
  $('div.search-list-wrapper ul li a').each((idx, ele) => {
    // cherrio中$('selector').each()用来遍历所有匹配到的DOM元素
    // 参数idx是当前遍历的元素的索引，ele就是当前便利的DOM元素
    let news = {
      title: $(ele).text(),        // 获取标题
      href: $(ele).attr('href')    // 获取网页链接
    };
    target.push(news)              // 存入最终结果数组
  });
  return target
};

let renrencheList = []

/**
 * index.js
 * [description] - 使用superagent.get()方法来访问页面
 */
superagent.get('https://www.renrenche.com/bj/ershouche/?plog_id=3f14b07dc77a6295b14f91f40bfe99bd').end((err, res) => {
  if (err) {
    // 如果访问失败或者出错，会这行这里
    console.log(`数据抓取失败 - ${err}`)
  } else {
   // 访问成功，请求的页面所返回的数据会包含在res
   renrencheList = getDatas(res)
  }
})

app.get('/', function (req, res) {
  res.send('爬虫!')
})

app.get('/rrc', function (req, res) { // 从这里就可以获取到抓取页面的数据
  res.send(renrencheList)
})

app.listen(port, function () {
  console.log('Your App is running at http://localhost:', port)
})