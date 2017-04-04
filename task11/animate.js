/* created by mao at 2017/4/4 */

(function(global){
	'use strict'

	global.$ = function(id) {

		var ele = document.querySelectorAll(id)
		var	len = ele.length

		if (len > 1) {
			for (var i = 0; i < len; i++) {
				return new Animate(ele[i])
			}
		} else {
			return new Animate(ele[0])
		}
	
	}

	global.requestAnimationFrame = (function () {
 		return  global.requestAnimationFrame       ||
          		global.webkitRequestAnimationFrame ||
          		global.mozRequestAnimationFrame    ||
          		function( callback ){
            		global.setTimeout(callback, 1000 / 60)
          		}
	})()

	global.cancelAnimationFrame = (function(){
		return global.cancelAnimationFrame 		||
			   global.mozCancelAnimationFrame	||
			   function( id ){
			   		global.clearTimeout(id)
			   }
	})()

	function Animate(el) {
		this.el = el
		this.loopCount = 0  //循环次数
		this.initStyle = {} //元素初始位置，循环动画用
		//默认参数
		this.settings = {
			duration: 500,			
			type: 'linear',
			delay: 0,
			callback: '',
			loopTime: 0
		}
		//动画目标
		this.json = {}
	}

	Animate.prototype = {
		constructor: Animate,
		
		animate: function(json, options) {
			this.extend(this.json, json)
			this.extend(this.settings, options)

			var delay = this.settings.delay
			var that = this

			setTimeout(function(){
				that.move()
			}, delay)
		},

		stop: function() {
			//通过节点的属性可以获取timer
			//不知为何，这里的this和move里的this不是同一个，所以timer如果不挂在this.el上而是this上的话，就不能获取
			cancelAnimationFrame(this.el.timer)
		},

		fadeIn: function(speed, callback) {
			this.json = { opacity: 100 }

			if (speed) this.settings.duration = speed
			if (callback) this.settings.callback = callback

			this.move()
		},

		fadeOut: function(speed, callback) {
			this.json = { opacity: 0 }

			if (speed) this.settings.duration = speed
			if (callback) this.settings.callback = callback

			this.move()
		},

		move: function() {
			var json = this.json
			var	obj = this.el
			var	duration = this.settings.duration
			var type = this.settings.type
			var fn = this.settings.callback
			var delay = this.settings.delay
			var loopTime = this.settings.loopTime
			var that = this

			var startTime = Date.now()

			//如果没有初始位置，则获取并赋值
			if (Object.keys(this.initStyle).length === 0) {
				for (var key in json) {
					if (json.hasOwnProperty(key)) {
						if (key === 'opacity') {
							this.initStyle[key] = Math.round(this.getStyle(obj, key) * 100)
						} else {
							this.initStyle[key] = Math.round(this.getStyle(obj, key))
						}
					}
				}
			}
			
			//把定时器的名称挂在节点的自定义属性上		
			obj.timer = requestAnimationFrame(animation)

			function animation () {
				var curTime = Date.now() //每次该函数调用时的当前时间
				//t: 动画已经持续的时间
				//这个式子的意思是，当动画实际持续的时间(curTime - startTime)超过了规定的持续时间(duration)时，t = duration，否则 t = (curTime - startTime)
				var t = duration - Math.max(0, (duration - curTime + startTime))

				for (var key in json) {
					//Tween缓动类 t,b,c,d四个参数
					var value = Tween[type](t, that.initStyle[key], json[key] - that.initStyle[key], duration)

					if (key === 'opacity') {
						obj.style.opacity = value/100
						obj.style.filter = 'alpha(opacity='+ value +')'
					} else {
						obj.style[key] = value + 'px'
					}
				}

				if (t === duration) {
					if (fn) {
						fn && fn.call(obj)
					}
					
					if (loopTime === 'infinite') {
						that.move()
					} else {
						that.loopCount++
						if (that.loopCount <= loopTime) {
							that.move()
						}
					}
									
					return
				}

				obj.timer = requestAnimationFrame(animation)
			}
		},

		getStyle: function(obj, style) {
			var val = obj.currentStyle ? obj.currentStyle[style] : getComputedStyle( obj )[style]
			return val.replace(/px/g,'')
		},

		extend: function(obj1, obj2) {
			for(var key in obj2) {
				if (obj2.hasOwnProperty(key)) {
					obj1[key] = obj2[key]
				}
			}
		}
	}

})(window)