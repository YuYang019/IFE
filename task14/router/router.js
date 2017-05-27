const Router = require('koa-router')
const db = require('../models/conn')
const crawl = require('../crawl')

const router = new Router()

module.exports = router

router.get('/', async (ctx,next) => {
	await ctx.render('index')
})

router.get('/search', async (ctx, next) => {
	let { keyword , devicename } = ctx.query
	let data = await crawl(keyword, devicename)

	ctx.response.body = data

	let result = new db (data)
	result.save(function(err, result) {
		if (err) {
			console.log('saveerr:' + err)
		} else {
			console.log('save suc')
		}
	})
})