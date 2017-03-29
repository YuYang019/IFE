//重构
(function (global) {
	'use strict'
	
	global.requestAnimFrame = (function () {
 		return  global.requestAnimationFrame       ||
          		global.webkitRequestAnimationFrame ||
          		global.mozRequestAnimationFrame    ||
          		function( callback ){
            		global.setTimeout(callback, 1000 / 60)
          		}
	})()

	var utils = {
		//随机数
		randomNumber: function (len) {
			return Math.floor(Math.random() * len)
		},
		//时间格式化
		formatTime: function (time) {
			var second = Math.round(time % 60)
			var min = Math.floor(time/60)
			second = second < 10 ? ('0' + second) : second
			min = min < 10 ? ('0' + min) : min
			if (time) {
				return '-' + min + ':' + second
			}
			return '-00:00'
		},
	}

	var Audio = function (options) {
		this.music = options || []
		this.len = this.music.length //歌曲数量
		this.curIndex = 0 //当前歌曲索引
		this.isMuted = false //是否静音
		this.isLoop = false //是否循环
		this.isPlay = true //是否播放
		
		this.initElements() //初始化节点
		
		this.barWidth = this.bar.clientWidth //总进度条长度
		this.barLeft = this.bar.getBoundingClientRect().left //进度条左端距离边界的长度
		//用于所有事件集中绑定的map
		this.eventsMap = {
			'mouseover .love': 'heartMouseover',
			'mouseout .love': 'heartMouseOut',
			'click .love': 'heartClick',
			'click .volume': 'volClick',
			'click .random': 'randomClick',
			'click .go': 'goClick',
			'click .next': 'nextClick',
			'click .pre': 'preClick',
			'click .bar': 'barClick'
		}
		//初始化函数
		this._init() 
	}
	//所有涉及到的节点,集中管理
	Audio.Eles = {
		list: '.menu .list', //歌曲列表
		time: '.time', //歌曲时间
		name: '.name', //歌曲名称
		author: '.author', //演唱者
		cover: '.img', //封面
		player: '.player', //audio元素
		volume: '.volume', //音量键
		random: '.random', //循环或随机播放按钮
		heart: '.love', //爱心
		pre: '.pre', //上一首
		go: '.go', //播放或暂停键
		next: '.next', //下一首
		nowBar: '.now-bar', //当前进度条
		bar: '.bar', //总进度条
	}

	Audio.prototype = {
		constructor: 'Audio',
		_init: function () {
			this.play(0)
			//play要放在前，不然duration不能正确获取
			this.renderList()
			this.bindEvents()
		},
		//播放
		play: function (index) {
			this.name.innerHTML = this.music[index].name //名称更新
			this.author.innerHTML = this.music[index].author //名称更新	
			this.cover.src = this.music[index].cover //封面更新
			this.player.src = this.music[index].url //歌曲更新
			this.nowBar.style.width = 0 //进度条初始化
			this.curIndex = index //当前歌曲索引更新

			this.isPlay = true //表示正在播放
			this.go.className = 'go glyphicon glyphicon-pause'	//图标更新	

			if (this.music[index].isLoved) {
				this.heart.style.color = '#ff2c56'
			} else {
				this.heart.style.color = '#4a4a4a'
			}
		},
		//列表渲染
		renderList: function(){
			var listContent = '',
				that = this
			
			for(var i = 0; i < this.len; i++){
				listContent += '<li data-index='+ i +'>'+ (i+1) + '.' + this.music[i].name + '-' + this.music[i].author +'</li>'
			}

			this.list.innerHTML = listContent

			this.list.addEventListener('click', function(e){
    			if (e.target.nodeName !== 'LI') return
    			var index = e.target.getAttribute('data-index')  	

    			that.play(index)
			})
		},
		//初始时间
		initailTime: function () {
			this.time.innerHTML = utils.formatTime(Math.round(this.player.duration))
		},
		//更新时间
		updateTime: function () {
			var duration = this.player.duration,
				cur = this.player.currentTime,
				that = this

			this.time.innerHTML = utils.formatTime(Math.round(duration - cur))
			
			global.requestAnimFrame(function(){
				that.nowBar.style.width = (cur / duration) * that.barWidth + 'px'
			})
		},
		//歌曲结束后
		end: function () {
			if (!this.isLoop) {
				var randomIndex = utils.randomNumber(this.len)
				this.play(randomIndex)
			}
		},
		heartClick: function () {
			if (this.music[this.curIndex].isLoved) {
				this.heart.style.color = '#4a4a4a'
			} else {
				this.heart.style.color = '#ff2c56'
			}
			this.music[this.curIndex].isLoved = !this.music[this.curIndex].isLoved
		},
		heartMouseover: function () {
			if (this.music[this.curIndex].isLoved) {
				this.heart.style.color = '#e10e38'
			} else {
				this.heart.style.color = '#2c2c2c'
			}
		},
		heartMouseOut: function () {
			if (this.music[this.curIndex].isLoved) {
				this.heart.style.color = '#ff2c56'
			} else {
				this.heart.style.color = '#4a4a4a'
			}
		},
		volClick: function () {
			this.isMuted = !this.isMuted
		
			if (this.isMuted) {
				this.volume.className = 'volume glyphicon glyphicon-volume-off'
				this.player.muted = true
			} else {
				this.volume.className = 'volume glyphicon glyphicon-volume-up'
				this.player.muted = false
			}
		},
		randomClick: function () {
			this.isLoop = !this.isLoop

			if (this.isLoop) {
				this.random.className = 'random glyphicon glyphicon-retweet'
				this.player.loop = true
			} else {
				this.random.className = 'random glyphicon glyphicon-random'
				this.player.loop = false
			}
		},
		goClick: function () {
			this.isPlay = !this.isPlay
			console.log(this.isPlay)

			if (this.isPlay) {
				this.go.className = 'go glyphicon glyphicon-pause'
				this.player.play()
			} else {
				this.go.className = 'go glyphicon glyphicon-play'
				this.player.pause()
			}
		},
		preClick: function () {
			this.curIndex <= 0 ? this.curIndex = (this.len - 1) : this.curIndex--
			console.log(this.curIndex)
			this.play(this.curIndex)
		},
		nextClick: function () {
			(this.curIndex + 1) >= this.len ? this.curIndex = 0 : this.curIndex++
			console.log(this.curIndex)
			this.play(this.curIndex)
		},
		barClick: function (e) {
			var nowTime = (e.pageX - this.barLeft) / this.barWidth * this.player.duration
			this.player.currentTime = nowTime
		},
		//初始化节点
		initElements: function () {
			var eles = Audio.Eles
			for (var name in eles) {
				if (eles.hasOwnProperty(name)) {
					this[name] = document.querySelector(eles[name])
				}
			}
		},
		//绑定dom事件
		initEvents: function (maps) {
			//正则抄自某大神，可以说没有这个就实现不了事件集中绑定
			var regexp = /^(\S+)\s*(.*)$/ //正则获取事件和节点名
			var bind = this._attachEvent //事件委托的封装
			for (var key in maps) {	//例：key: 'click .love' , maps[key]: 'heartClick'
				if (maps.hasOwnProperty(key)) { 
					var matchs = key.match(regexp), //例：'click .heart' 经匹配后为 ['click .love', 'click', '.love']
						ele =  document.querySelector(matchs[2]),
						type = matchs[1]
					//这里要bind(this),不然this会丢失，指向触发事件的dom节点
					bind(ele, type, this[maps[key]].bind(this))
				}
			}
		},
		//初始化audio
		initPlayer: function () {
			//这里必须要用bind绑定this即Audio,不然this会丢失
			this._attachEvent(this.player, 'canplay', this.initailTime.bind(this))
			this._attachEvent(this.player, 'timeupdate', this.updateTime.bind(this))
			this._attachEvent(this.player, 'ended', this.end.bind(this))
		},
		//总的绑定函数
		bindEvents: function () {
			this.initEvents(this.eventsMap) //绑定dom事件
			this.initPlayer() //初始化audio,添加监听事件
		},
		//对addeventlistener进行封装,未做兼容处理
		_attachEvent: function (ele, type, fn) {
			ele.addEventListener(type, fn, false)
		}
	}
	
	global.Audio = Audio

	window.onload = function () {
		var musicList = [
			{
				name: '岁月神偷',
				cover: 'img/syst.jpg',
				url: 'music/suiyueshentou.mp3',
				author: '金玟岐',
				isLoved: false
			},
			{
				name: '浮夸',
				cover: 'img/fk.jpg',
				url: 'music/fukua.mp3',
				author: '陈奕迅',
				isLoved: false
			},
			{
				name: '告白气球',
				cover: 'img/gbqq.jpg',
				url: 'music/gaobaiqiqiu.mp3',
				author: '周二珂',
				isLoved: false
			},
		]

		new Audio(musicList)
	}

})(window)