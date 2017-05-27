const phantom = require('phantom')
const fs = require('fs')
const request = require('request')

const config = require('./config.json')

module.exports = crawl


function downloadPic (link) {
	return new Promise((resolve, reject) => {
		let picName = `${Math.random().toString(36).substr(2)}${Date.now()}.jpg`
		request(link)
			.pipe(fs.createWriteStream(`${process.cwd()}/static/pic/${picName}`))
			.on('error', () => { reject(err) })
			.on('close', () => { resolve(`pic/${picName}`) })
	})
}

/**
 * 按设备名和关键字查询
 * @param  {String} keyword    [关键字]
 * @param  {String} deviceName [设备名]
 * 
 * @return {Object} result
 */
async function crawl (keyword, deviceName) {
	console.log('crawl')
	//console.log(keyword)
	//console.log(deviceName)
	try {
		const instance = await phantom.create()
		const page = await instance.createPage()

		let url = 'https://www.baidu.com/s?wd=' + encodeURI(keyword)
		let startTime = Date.now()
		
		console.log(url)

		//open
		const status = await page.open(url)

		console.log(status)

		if (status !== 'success') throw Error({message: '打开页面失败'})

		console.log('crawl start')

		/**
		 * 设置页面初始状态，放在open后面，打开的还是PC端的页面
		 * 但是还是这样放了，了解一下怎么设置吧
		 * 因为存在bug，放在open前，能有效果，但是取不到元素,所以就放在后面了
		 */
		if (deviceName) {
			let device = config[deviceName]
			console.log(device.UA)
			page.setting('userAgent', device.UA)
			page.property('viewportSize', {
				width: device.width,
				height: device.height
			})
		}

		//打印图片
		//var filename = deviceName + '.png'
 		//page.render(filename, {format: 'png', quality: '100'})

 		
 		/**
 		 * 获取元素
 		 * 用的是PC端的类名，原因是设置初始状态时存在BUG
 		 * 所以只能这样了
 		 */		
 		//await page.includeJs('https://code.jquery.com/jquery-3.1.1.min.js')

		let data = await page.evaluate(function(deviceName){
			//console.log(deviceName)
			var dataList = []
			//if (deviceName === 'ipad') {
				dataList = $('#content_left .result.c-container').map(function() {
					var info = {}
					info.title = $(this).find('.t').text() || ''
					info.link = $(this).find('.t > a').attr('href') || ''
					info.info = $(this).find('.c-abstract').text() || ''
					info.pic = $(this).find('.general_image_pic img').attr('src') || ''
					return info
				}).toArray()
			 // } else {
			 // 	dataList = $('#result .result').map(function() {
			 // 		var info = {}
			 // 		info.title = $(this).find('.c-title').text() || ''
			 // 		info.link = $(this).find('.c-blocka').attr('href') || ''
			 // 		info.info = $(this).find('.c-abstract').text() || ''
			 // 		info.pic = $(this).find('.c-img img').attr('src') || ''
			 // 		return info
			 // 	}).toArray()
			 // }
			 return dataList
		}, deviceName)

		for (let i = 0; i < data.length; i++) {
			data[i].path =  data[i].pic ? await downloadPic(data[i].pic) : '' 
		}

		let result = {
			code: 1,
			msg: '抓取成功',
			word: keyword,
			device: deviceName,
			time: Date.now() - startTime,
			dataList: data
		}

		console.log('crawl end')

		await instance.exit()

		return result

	} catch (err) {
		return { code: 0, msg: '抓取失败', err: err }
	}
}
