var mainFeedModel = (function () {
	var itemsModel = {
		id: 'Id',
		fields: {
		    Description: {
				field: 'Description',
				defaultValue: ''
			},
			Quantity: {
			    field: 'Quantity',
			    defaultValue: ''
			},
			StartTime: {
				field: 'StartTime',
				defaultValue: new Date()
			},
			EndTime: {
				fields: 'EndTime',
				defaultValue: ''
			},
			UserId: {
				field: 'UserId',
				defaultValue: ''
			},
			//Participated: {
			//	field: 'Likes',
			//	defaultValue: []
			//}
		},

		PictureUrl: function () {
			return AppHelper.resolvePictureUrl(this.get('Picture'));
		},
		//User: function () {
		//    debugger;
		//	var userId = this.get('UserId');
		//	var user = $.grep(usersModel.users(), function (e) {
		//		return e.Id === userId;
		//	})[0];
		//	return user ? {
		//		DisplayName: user.DisplayName,
		//		PictureUrl: AppHelper.resolveProfilePictureUrl(user.Picture)
		//	} : {
		//		DisplayName: 'Anonymous',
		//		PictureUrl: AppHelper.resolveProfilePictureUrl()
		//	};
		//}
	};
	var itemsDataSource = new kendo.data.DataSource({
		type: 'everlive',
		schema: {
			model: itemsModel
		},
		transport: {
			typeName: 'Item'
		},
		change: function (e) {
			if (e.items && e.items.length > 0) {
				$('#no-items-span').hide();
			}
			else {
			    $('#no-items-span').show();
			}
		},
		sort: { field: 'StartTime', dir: 'desc' }
	});
	return {
		items: itemsDataSource
	};
}());

var mainFeedViewModel = (function () {
	var itemSelected = function (e) {
		mobileApp.navigate('views/itemView.html?uid=' + e.data.uid);
	};
	var navigateHome = function () {
		mobileApp.navigate('#welcome');
	};
	var logout = function () {
		AppHelper.logout()
		.then(navigateHome, function (err) {
			showError(err.message);
			navigateHome();
		});
	};
	return {
	    items: mainFeedModel.items,
		itemSelected: itemSelected,
		logout: logout
	};
}());

