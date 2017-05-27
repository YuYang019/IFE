const mongoose = require('mongoose')

mongoose.Promise = Promise //解决报错
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost/baidu')

let db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error'))
db.on('open', function(callback) {
	console.log('connection success')
})

//定义schema
let schema = new mongoose.Schema({
	code: Number,
	msg: String,
	word: String,
	time: Number,
	dataLists: [{}]
})

//依据定义的schema编译
let Result = mongoose.model('Result', schema)

module.exports = Result