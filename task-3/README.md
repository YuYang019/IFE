##vue双向数据绑定,第二部分，运用了发布订阅模式实现$watch
任务描述链接:[here](http://ife.baidu.com/course/detail/id/20)

简单说一下思路以免以后忘了，PubSub是一个发布订阅器，包含一个handler对象，和两个方法，on（订阅）和emit（发布）

handler负责储存订阅主题，每个订阅主题是一个数组，里面包含订阅者的回调函数。on的时候，把回调推入对应主题的数组。

emit的时候触发对应的主题，依次循环调用数组里的函数，并把emit的参数传入。

我们只需要在set的时候,emit发布主题(key)和参数(value)，$watch里调用on注册订阅

不过有局限性，主题都是平行的，不能嵌套。
