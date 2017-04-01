var page = require('webpage').create(),
	keyword = require('system'),
	fs = require('fs'),
	res = {},
	wd

if (keyword.args.length === 1) {
	console.log(keyword.args)
	phantom.exit()
} else {
	wd = keyword.args[1]
	var t = Date.now()
	page.open('https://www.baidu.com/s?wd=' + encodeURI(wd),function (status){
		if (status !== 'success') {
			res.code = 0
			res.msg = '抓取失败'
			res.word = wd
			res.time = Date.now() - t
			res = JSON.stringify(res)
			//这个'w'参数不是很懂
			fs.write('task.json', res, 'w')
			phantom.exit()
		} else {
			//要把本地js的相关变量当做参数传递进evaluate
			res = page.evaluate(function(res,t,wd) {
				res.code = 1
				res.msg = '抓取成功'
				res.word = wd				

				var c = document.getElementById('content_left')
				var items = c.querySelectorAll('.result.c-container')
				var dataList = []
				for (var i = 0; i < items.length; i++) {
					
					var h1 = items[i].children[0].firstChild.innerHTML
					h1 = h1.replace(/<em>|<\/em>/g,'')

					var info1 = items[i].querySelector('.c-abstract').innerHTML
					info1 = info1.replace(/<em>|<\/em>|<span.*>|<\/span>/g,'')
					
					var link1 = items[i].children[0].firstChild.href
					
					var pic1 = items[i].querySelector('img') ? items[i].querySelector('img').src : ''

					dataList.push({title: h1, info: info1, link: link1, pic: pic1})
				}
				
				res.time = Date.now() - t
				res.dataLists = dataList

				return JSON.stringify(res)	

			}, res, t, wd)

			fs.write('task.json', res, 'w')
			phantom.exit()
		}
		
	})
}

