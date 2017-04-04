## 封装动画类库（一）

### 任务描述:[here](http://ife.baidu.com/course/detail/id/52)

### 预览页：[here](http://htmlpreview.github.io/?https://github.com/maoyuyang/IFE/blob/master/task11/index.html)

开始没想好怎么写，velocity的源码又看不懂。。。然后参考了学习笔记的代码，给了我启发，但是那位仁兄写的比较简略
我按照题目要求加了一些东西，比如设置循环次数，延迟执行，stop()，fadeIn(), fadeOut()，基本达到题目要求
但是自我感觉，优化不好，写的心里没底，也没有参照，bug应该有不少，但是我没测出来

Tween缓动类的参数确定比较重要，主要是t的确定，其他好说，因为使用了requestAnimationFrame，每次调用的间隔可能不一样，如果是16m调用一次的话，t每次加16就行，但是并不是，所以使用（curTime - startTime）来确定每次调用时t的值