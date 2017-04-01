## 网页抓取分析服务系列之一（基础分析）
任务描述：[here](http://ife.baidu.com/course/detail/id/85)

没有使用includejs，引入jquery可以更方便

对爬虫有了初步的了解，phantomjs可以看成一个无界面的浏览器，open之后，evaluate插入js，在js里运用dom操作获取标题简介之类的，注意这段js跟你本地的js没关系，它是运行在你打开的网页上，所以dom操作才可以获取相应节点，之后就是一些基本的操作了，最后return数据就行