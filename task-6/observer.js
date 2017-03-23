/**
 *	观察者
 *	@param options {object} 数据对象
 *	@param $p {string} 当前路径的上一层
 *	@param vm {object} vue实例
 */
function Observer (options,$p,vm) {
	this.vm = vm
	this.data = options
	this.$p = Array.prototype.slice.call(arguments,1)[0] || ''
	
	this._parseData(this.data)
}

Observer.prototype = {
	constructor: Observer,
	convert: function(key,val,$p){
		var that = this
		Object.defineProperty(this.data,key,{
			configurable: true,
			enmerable: true,
			get: function(){
				console.log('你获取了'+ key)
				return val
			},
			set: function(newVal){
				if (newVal === val) return
				console.log('你设置了'+ key)
				val = newVal				
				
				//当前路径
				var allKey
				$p === '' ? (allKey = key) : (allKey =  $p + '.' + key)

				//一旦改变，通过vm获取指令数组，调用对应update
				that.vm._directives.forEach(function(item){
					if (item.exp === allKey) {
						item.update()
					}
				})

				if(typeof newVal === 'object'){
				 	new Observer(newVal)
				}
			}
		})
	},
	_parseData: function(obj){
		var value
		for(var key in obj){
			if(obj.hasOwnProperty(key)){
				value = obj[key]
				if(typeof value === 'object'){
					//当前路径
					var $p

					this.$p === '' ? ($p = key) : ($p =  this.$p + '.' + key)
					new Observer(value, $p, this.vm) 
				}
				this.convert(key,value,this.$p)
			}
		}
	},
}

/**
 *	Vue构造函数
 */
function Vue(options){
	this._init(options)
}

Vue.prototype = {
	constructor: Vue,
	_init: function(options){
		this.$options = options
		this.$el = document.querySelector(options.el)
		this.$data = options.data
		
		this.$observer = new Observer(this.$data,'',this)
		//指令数组，用于存放Directive
		this._directives = []
		//编译函数
		this._complie()
	},
	_complie: function(){
		this._complieElement(this.$el)
	},
	_complieElement: function(node){
		var that = this
		//children无法解决<div>{{name}}<a>{{age}}</a><div>这样的情况，name无法被获取
		if(node.hasChildNodes()){
			var child = node.childNodes
			child.forEach(function(item){
				that._complieNode(item)
			})
		}
	},
	_complieNode: function(node){
		switch(node.nodeType){
			//node
			case 1:
				this._complieElement(node)
				break
			//text
			case 3:
				this._complieText(node)
				break
			default:
				return
		}		
	},
	_complieText: function(node){
		var that = this
		var str = node.nodeValue //节点里的模板 {{user.name}}
		var expression = str.match(/{{(.*)}}/g) //一个数组,['{{user.name}}'],

		if(!expression) return

		expression.forEach(function(exp){
			var el = document.createTextNode('') //副本，用于替换原node
			node.parentNode.insertBefore(el, node) //插入原node前
			var property = exp.replace(/[{}]/g,'') //去掉花括号 user.name
			that._bindDirective('text', property, el) //绑定指令
		})

		node.parentNode.removeChild(node) //去掉原node完成替换
	},	
	//绑定指令
	_bindDirective: function(name, expression, node){
		var dirs = this._directives
		dirs.push(
			new Directive(name, node, this, expression)//把node和相应值加入directive数组，以形成一一对应关系
		)
	},
}

//指令，用于建立node与数据的关系
function Directive(name, el, vm, expression){
	this.name = name 			// 'text'
	this.el = el  				//node节点
	this.vm = vm                //vue实例
	this.exp = expression       //路径 例如：user.name
	this.attr = 'nodeValue'     //节点属性

	this.update()
}

Directive.prototype.update = function(){
	this.el[this.attr] = this.getVal(this.vm,this.exp)
	console.log('更新了DOM'+ this.exp)
}

Directive.prototype.getVal = function(vm,exp){
	var data = vm.$data
	var arr = exp.split('.') //['user','name']
	var value = data
	arr.forEach(function(key){
		value = value[key]
	})
	return value
}