var page = require('webpage').create(),
	system = require('system'),
	fs = require('fs'),
	t = Date.now(),
	data = {}

var config = fs.read('config.json')
config = JSON.parse(config)

if (system.args.length < 3) {
	console.log('params error')
	phantom.exit()
} else {
	var key = system.args[1], //搜索关键字
		deviceKey = system.args[2], //设备名
		device = config[deviceKey],
		ua = device.UA,
		sizeX = device.width,
		sizeY = device.height,
		url = 'https://www.baidu.com/s?wd=' + encodeURI(key)

	page.settings.userAgent = ua
	//设置视口
	page.viewportSize = { width: sizeX, height: sizeY }
	//设置截屏区,render的时候只截这一部分
	page.clipRect = {
		top: 0,
		left: 0,
		width: sizeX,
		height: sizeY
	}

	page.open(url, function(status) {
		
		if (status != 'success') {
			data = {
				code: 0,
				msg: '失败',
				word: key,
				time: Date.now() - t,
				device: deviceKey
			}
			data = JSON.stringify(data)
			fs.write('task.json', data, 'w')
			
			phantom.exit()
		} else {
			var filename = deviceKey + '.png'
			page.render(filename, {format: 'png', quality: '100'})
			

			page.includeJs('https://code.jquery.com/jquery-3.1.1.min.js', function() {
				data = page.evaluate(function(data, deviceKey, t, key){
					var dataList = []
					var items

					if (deviceKey === 'ipad') {
						items = $('.result.c-container')

						for (var i = 0; i < items.length; i++) {
							//注意ipad和iphone的DOM类名不一样
							var title = $(items[i]).find('.t a').text().trim(),
								info = $(items[i]).find('.c-abstract').text().trim(),
								link = $(items[i]).find('.t a').attr('href'),
								pic = $(items[i]).find('img')

							pic = (pic && pic.length) ? pic.attr('src') : ''
							dataList.push({title: title, info: info, link: link, pic: pic})
						}

					} else {
						items = $('#results .result')
					
						for (var i = 0; i < items.length; i++) {
							//注意ipad和iphone的DOM类名不一样
							var title = $(items[i]).find('.c-title').text().trim(),
								info = $(items[i]).find('.c-abstract').text().trim(),
								link = $(items[i]).find('.c-container a:first').attr('href'),
								pic = $(items[i]).find('.c-img img')

							pic = (pic && pic.length) ? pic.attr('src') : ''
							dataList.push({title: title, info: info, link: link, pic: pic})
						}
					
					}				
					

					data = {
						code: 1,
						msg: '抓取成功',
						word: key,
						time: Date.now() - t,
						device: deviceKey,
						dataLists: dataList
					}

					return JSON.stringify(data)
				
				}, data, deviceKey, t, key)

				fs.write('task.json', data, 'w')
				console.log(data)
				phantom.exit()
			})
		}
	})
}
