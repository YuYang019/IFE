const { db, mongoose } = require('./conn')

const schema = new mongoose.Schema({
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