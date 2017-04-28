## 封装动画类库（一）

### 任务描述:[here](http://ife.baidu.com/course/detail/id/52)

### 预览页：[here](http://htmlpreview.github.io/?https://github.com/maoyuyang/IFE/blob/master/task11/index.html)

简陋的一匹，很多东西没处理，我只能说用于学习了。。。。

Tween缓动类的参数确定，主要是t的确定，其他好说，因为使用了requestAnimationFrame，每次调用的间隔可能不一样，如果是16m调用一次的话，t每次加16就行，但是并不是，所以使用（curTime - startTime）来确定每次调用时t的值