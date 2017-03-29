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

function $ (id) {
	return document.querySelector(id)
}

// time 输入为整数
function formatTime (time) {
	var second = time % 60
	var min = Math.floor(time/60)
	second = second < 10 ? ('0' + second) : second
	min = min < 10 ? ('0' + min) : min
	if (time) {
		return '-' + min + ':' + second
	}
	return '-00:00'
}

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60)
          }
})()

function randomNumber (len) {
	return Math.floor(Math.random() * len);
}

window.onload = function(){
	'use strict'

	var list = $('.menu .list'),
		listContent = '',
		len = musicList.length, //歌曲数量
		time = $('.time'),	//时间
		name = $('.name'),  //歌曲名称
		author = $('.author'),	//作者
		cover = $('.img'),	//封面图
		player = $('.player'),	//audio标签
		volume = $('.volume'), //音量
		random = $('.random'), //随机播放
		heart = $('.love'), //爱心
		pre = $('.pre'),	//上一首
		go = $('.go'),	//播放
		next = $('.next'),	//下一首
		nowBar = $('.now-bar'), //当前进度条
		bar = $('.bar'), //总进度条
		barWidth = $('.progress-bar').clientWidth, //总进度条长度
		barLeft = bar.getBoundingClientRect().left, //进度条距离左边界的长度
		curIndex = 0, //当前播放
		isMuted = false, //是否静音
		duration = 0,  //持续时间
		isLoop = false, //是否循环
		isPlay = true //是否播放
		//nowDuration = 0 //当前歌曲时长
	

	function init () {
		play(0)

		player.addEventListener('canplay',function(){
			//duration = 
			time.innerHTML = formatTime(Math.round(player.duration))
			console.log(player.duration)
		})

		player.addEventListener('timeupdate',function(){
			var duration = player.duration,
				cur = player.currentTime
			
			time.innerHTML = formatTime(Math.round(duration - cur))
			
			window.requestAnimFrame(function(){
				nowBar.style.width = (cur / duration) * barWidth + 'px'
			})
		})

		player.addEventListener('ended',function(){
			if (!isLoop) {
				var randomIndex = randomNumber(len)
				play(randomIndex)
			}
		})
	}

	init()

	//列表渲染
	for(var i=0; i<len; i++){
		listContent += '<li data-index='+ i +'>'+ (i+1) + '.' + musicList[i].name + '-' + musicList[i].author +'</li>'
	}

	list.innerHTML = listContent

	//委托
	list.addEventListener('click', function(e){
    	if (e.target.nodeName !== 'LI') return
    	var index = e.target.getAttribute('data-index')  	

    	play(index)
	})

	//播放
	function play (index) {
		name.innerHTML = musicList[index].name
		author.innerHTML = musicList[index].author
		
		curIndex = index
		
		cover.src = musicList[index].cover
		player.src = musicList[index].url
		nowBar.style.width = 0
		
		isPlay = true
		go.className = 'go glyphicon glyphicon-pause'		

		if (musicList[index].isLoved) {
			heart.style.color = '#ff2c56'
		} else {
			heart.style.color = '#4a4a4a'
		}
	}

	//爱心
	heart.onclick = function(){
		if (musicList[curIndex].isLoved) {
			this.style.color = '#4a4a4a'
		} else {
			this.style.color = '#ff2c56'
		}
		musicList[curIndex].isLoved = !musicList[curIndex].isLoved
	}

	heart.onmouseover = function(){
		if (musicList[curIndex].isLoved) {
			this.style.color = '#e10e38'
		} else {
			this.style.color = '#2c2c2c'
		}
	}

	heart.onmouseout = function(){
		if (musicList[curIndex].isLoved) {
			this.style.color = '#ff2c56'
		} else {
			this.style.color = '#4a4a4a'
		}
	}

	//音量
	volume.onclick = function(){
		isMuted = !isMuted
		
		if (isMuted) {
			this.className = 'volume glyphicon glyphicon-volume-off'
			player.muted = true
		} else {
			this.className = 'volume glyphicon glyphicon-volume-up'
			player.muted = false
		}
	}

	//循环
	random.onclick = function(){
		isLoop = !isLoop

		if (isLoop) {
			this.className = 'random glyphicon glyphicon-retweet'
			player.loop = true
		} else {
			this.className = 'random glyphicon glyphicon-random'
			player.loop = false
			play(random(len))
		}
	}

	//播放按钮
	go.onclick = function(){
		isPlay = !isPlay

		if (isPlay) {
			this.className = 'go glyphicon glyphicon-pause'
			player.play()
		} else {
			this.className = 'go glyphicon glyphicon-play'
			player.pause()
		}
	}

	//前进
	next.onclick = function(){
		(curIndex + 1) >= len ? curIndex = 0 : curIndex++
		play(curIndex)
	}

	//后退
	pre.onclick = function(){
		curIndex <= 0 ? curIndex = (len - 1) : curIndex--
		play(curIndex)
	}

	//改变进度条
	bar.onclick = function(e){
		var nowTime = (e.pageX - barLeft) / barWidth * player.duration
		player.currentTime = nowTime
	}
}