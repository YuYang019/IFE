var vm = new Vue({
	el: '#app',
	data: {
		keyword: '',
		items: '',
		deviceNames: ['iphone5','iphone6','ipad'],
		status: -1
	},
	methods: {
		search: function() {
			var that = this			
			var keyword = this.keyword
			var devicename = $('.select').val()

			if (keyword === '') return

			this.status = 2

			$.ajax({
				type: 'GET',
				url: '/search',
				data: {
					keyword: keyword,
					devicename: devicename
				},
				dataType: 'json',
				success: function(data) {
					if (data.code === 0) {
						that.status = 0
					} else {
						that.status = 1
						that.items = data.dataList
					}
				},
				error: function(err) {
					that.status = 0
					console.log(err)
				}
			})
		}
	}
})