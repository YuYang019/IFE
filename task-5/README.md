##vue双向数据绑定,第四部分，实现静态数据绑定
任务描述链接:[here](http://ife.baidu.com/course/detail/id/22)

参考（抄袭）别人的代码后，写出来了，主要就是看看正则以及getVal函数
有一个问题是当初写getVal的时候没有return导致不能正确返回值

另一种方式，获取到innerHTML后直接用replace选择带{{}}的，调用getVal函数直接替换，这样更简洁