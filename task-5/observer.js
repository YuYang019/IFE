function Vue (options) {
	this._init(options)
}

Vue.prototype = {
	constructor: Vue,
	_init: function(options){
		this.$options = options
		this.$el = document.querySelector(options.el)
		this.$data = options.data

		this._render()
	},
	_render: function(){
		//根节点的innerHTML
		var str = this.$el.innerHTML
		//所有带有双花括号的模板数据名称
		var templateStr = str.match(/{{(.*)}}/g)
		//用于存放去掉双花括号的模板数据名称
		var arr = []
		for(var i = 0; i < templateStr.length; i++){
			arr.push(templateStr[i].replace(/[{}]/g,''))
			//把模板名称分开后的数组
			var newArr = arr[i].split('.')
			str = str.replace(templateStr[i], this.getVal(this.$data,newArr))
		}
		this.$el.innerHTML = str
	},
	getVal: function(data,arr){
		if (arr.length === 1) {
			return data[arr[0]]
		} else {
			//传入三个参数，this，当前对象的下一层，去掉第一位名称的数组
			var next = data[arr[0]]
			//去掉第一位
			arr.splice(0,1)
			//加return很重要，不然返回的是undifined
			return this.getVal.call(this, next, arr)
		}
	}
}
