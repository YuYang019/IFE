//发布订阅
function PubSub () {
	//储存订阅者的对象
	this.handler = {}
}

PubSub.prototype = {
	constructor : PubSub,
	//订阅
	on: function(eventType, handler){
		//如果订阅时没有对应主题，则创建一个属于该主题的空数组用于存放订阅者的回调函数
		if(!this.handler[eventType]){
			this.handler[eventType] = []
		}
		//把订阅者的回调函数推入该主题的数组
		this.handler[eventType].push(handler)		
	},
	//发布 eg: emit('A',"我是参数") eventType = 'A' 本例中为this.$p
	emit: function(eventType){		
		//把this.$p拆开emit	
		if (eventType.indexOf('.') !== -1) {
			var arr = eventType.split('.')
			for(var i = 0; i < arr.length; i++){
				this.emit(arr[i])
			}
		}	
		if (this.handler[eventType]) {
			//发布的参数
			var handlerArgs = Array.prototype.slice.call(arguments,1)
			for(var j = 0; j < this.handler[eventType].length; j++){
				//循环调用订阅者的回调函数,传入对应参数
				this.handler[eventType][j].apply(this,handlerArgs)
			}
		}				
	}
}
//事件总线
var eventBus = new PubSub()
//观察者
function Observer (options,$p) {
 	//this._init(options) 原来没加$p这个参数，这样只会把第一个参数传入，而后面没写出来的$p会丢失
 	this._init(options,$p) //还是得加一个$p参数，或者不要_i2nit，把_init里的语句直接放到Observer里
}
//初始化函数
Observer.prototype._init = function(options,$p){
	this.$options = options
	this.$p = Array.prototype.slice.call(arguments,1)[0] || '$options'
 	//数据初始化
	this._parseData(this.$options)
}
//添加get和set
Observer.prototype.convert = function(key,val,$p){
	var that = this
	Object.defineProperty(this.$options,key,{
		//是否可以删除目标属性或是否可以再次修改属性的特性
		configurable: true,
		//此对象是否可枚举
		enmerable: true,
		get: function(){
			console.log('你访问了'+ key)
			return val
		},
		set: function(newVal){
			console.log('你设置了'+ key + ',' + '新的值为' + JSON.stringify(newVal))
			var allKey = $p + '.' + key
			//每当赋值的时候，发布
			eventBus.emit(allKey,newVal)
			val = newVal
			//如果新赋值为对象，则深层遍历			
			if(typeof newVal === 'object'){
				new Observer(newVal)
			}
			
		}
	})
}


//遍历数据函数,添加get和set
Observer.prototype._parseData = function(obj){
	var value
	for(var key in obj){
		//排除原型链上的属性，仅仅遍历对象本身拥有的属性
		if(obj.hasOwnProperty(key)){
			value = obj[key]
			//如果value为对象，则递归遍历
			if(typeof value === 'object'){
				//this._parseData(value) 不能正确console，但是能添加get和set，为啥
				var $p = this.$p + '.' + key
				new Observer(value, $p) 
			}
			this.convert(key,value,this.$p)	
		}
		
	}
}

//watch，订阅
Observer.prototype.$watch = function(key, callback){
	eventBus.on(key,callback)
}

//test
var app = new Observer({
	name: {
		lastName: 'mao',
		firstName: 'du'
	}
});
app.$watch('name', function(newVal) {
	console.log(`我的姓名发生了变化，可能是姓氏变了，也可能是名字变了`);
});
app.$options.name.firstName = 'hahaha';

