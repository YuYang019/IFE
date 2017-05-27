const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const serve = require('koa-static')
const views = require('koa-views')
const router = require('./router/router')

const app = new Koa()

app.use(bodyParser())

app.use(serve(__dirname + '/static'))

app.use(views(__dirname + '/views'))

app.use(router.routes())


app.listen(8080, () => {
	console.log('open')
})

app.on('error', (err) => {
  console.log(err.stack);
});


