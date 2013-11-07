
var usersModel = (function () {
	var currentUser = kendo.observable({ data: null });
	var usersData;
	var loadUsers = function () {
		return el.Users.currentUser()
		.then(function (data) {
			var currentUserData = data.result;
			currentUserData.PictureUrl = AppHelper.resolveProfilePictureUrl(currentUserData.Picture);
			currentUser.set('data', currentUserData);
			return el.Users.get();
		})
		.then(function (data) {
			usersData = new kendo.data.ObservableArray(data.result);
		})
		.then(null,
			  function (err) {
			  	showError(err.message);
			  }
		);
	};
	return {
		load: loadUsers,
		users: function () {
			return usersData;
		},
		currentUser: currentUser
	};
}());

// activities view model
var mainFeedViewModel = (function () {
	var activitySelected = function (e) {
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
		activities: mainFeedModel.activities,
		activitySelected: activitySelected,
		logout: logout
	};
}());
