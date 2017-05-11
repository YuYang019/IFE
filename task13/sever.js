/**
 * 抓取任务三 
 */

var http = require('http'),
	url = require('url'),
	mongoose = require('mongoose')


//连接数据库
mongoose.connect('mongodb://localhost/baidu')

var db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error'))
db.on('open', function(callback) {
	console.log('connection success')
})


//定义schema
var schema = new mongoose.Schema({
	code: Number,
	msg: String,
	word: String,
	time: Number,
	dataLists: [{
		title: String,
		info: String,
		link: String,
		pic: String
	}]
})

//依据定义的schema编译
var Result = mongoose.model('Result', schema)

//衍生一个shell，并在此上运行一个命令，完成时调用回调
var exec = require('child_process').exec

http.createServer(function(req, res) {
	console.log('req recevied')

	if (req.url !== '/favicon.ico') {

		var queryObj = url.parse(req.url, true).query
		var cmdStr = "phantomjs index.js "

		var word = queryObj.word || ' '
		var device = queryObj.device || ' '

		cmdStr += word + ' ' + device
		console.log(cmdStr)

		exec(cmdStr, function(err, stdout, stderr) {
			if (err) {
				console.log(err)
			} else {

				/**
				 * 苍天啊，大地啊，bug终于被我找出来了，原来这个stdout是获取的index.js里
				 * console.log出来的东西，怪不得json.parse使不了，我还以为是获取return出来的东西
				 * 所以index.js里要对应改一下，把结果console出来
				 */
				
				//检查一下数据格式是否正确
				try {
					JSON.parse(stdout)
				} catch (err) {
					console.log('err:' + err)
					res.writeHead(200, {
						'Content-Type': 'application/json;charset=utf-8'
					})
					return res.end(JSON.stringify({
						code: 0,
						msg: '请检查参数是否正确'
					}))
				}

				var std = JSON.parse(stdout)

				//新建一个文档
				var result = new Result(std)

				//保存
				result.save(function(err, result) {
					if (err) {
						console.log('saveerr:' + err)
					} else {
						console.log('save suc')
					}
				})

				res.writeHead(200, {
					'Content-Type': 'application/json;charset=utf-8'
				})

				res.write(JSON.stringify(stdout))

				res.end()
			}
		})
	}

}).listen(8080)

console.log("start")