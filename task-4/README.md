vue双向数据绑定,第三部分，运用了发布订阅模式实现$watch，实现监听子属性
任务描述链接:[here](http://ife.baidu.com/course/detail/id/20)

看了半天别人的代码，终于知道怎么实现了，感觉有局限性，不知道其他更多的解决方案是什么，也没去看更多人的代码了，太费劲了。。

简单来说，初始化的时候，需要多一个东西this.$p ，就是用来记录当前所属对象的名称，这个名称的用处就是在赋值的时候，告诉发布订阅器，是哪个对象的值被改变了，然后发布订阅器再调用对应回调函数。
要注意的是，每一层对象，都属于他们自己的Observer，也就拥有他们自己的this.$p,我们初始化的时候，每一层new一个新的Observer，会把当前层的名称,即this.$p给传入记录下来。比如data.name的this.$p是data

我们在改变firstName的时候，会触发set，而set函数里会把this.$p加上当前key给emit出去
app.data.name.firstName这层对象的this.$p就是data.name，然后加上firstName，会被传给emit，然后在emit里分成一个数组，分别再emit
出去，即emit(data),emit(name),emit(firstName),然后呢，emit函数用if判断你emit的事件是否被注册
，没有注册就不满足条件，不会进一步执行，由于我们刚开始只$watch了name，也就是只注册了name这个主题，所以name这个主题的回调函数会被调用。
也就实现了改变app.data.name.firstName，$watch(name)的回调会被执行的需求

看起来就像实现了冒泡一样

初始化的时候，没有再new一个新的PubSub，而是在最外层创建了一个总的event，因为我们希望每一层对象都能共用一个订阅发布器。这点和task3不一样