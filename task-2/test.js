 function Observer (options) {
 	this._init(options)
}

Observer.prototype._init = function(options){
	this.$options = options
	//数据初始化
	this._parseData(this.$options)
}

//添加get和set
Observer.prototype.convert = function(key,val){
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
			console.log('你设置了'+ key + ',' + '新的值为' + newVal)
			val = newVal
		}
	})
}

//遍历并改造数据
Observer.prototype._parseData = function(obj){
	var value
	for(var key in obj){
		//排除原型链上的属性，仅仅遍历对象本身拥有的属性
		if(obj.hasOwnProperty(key)){
			value = obj[key]
			//如果value为对象，则递归遍历
			if(typeof value == 'Object'){
				this._parseData(value)
			}
			this.convert(key,value)
		}
	}
}