// add item view model
var addItemViewModel = (function () {
	var $newStatus;
	var validator;
	var init = function () {
		validator = $('#enterStatus').kendoValidator().data("kendoValidator");
		$newStatus = $('#newStatus');
	};
	var show = function () {
		$newStatus.val('');
		validator.hideMessages();
	};
	var saveItem = function () {
		if (validator.validate()) {
			var activities = mainFeedModel.activities;
			var activity = activities.add();
			activity.Text = $newStatus.val();
			activity.UserId = usersModel.currentUser.get('data').Id;
			activities.one('sync', function () {
				mobileApp.navigate('#:back');
			});
			activities.sync();
		}
	};
	return {
		init: init,
		show: show,
		me: usersModel.currentUser,
		saveItem: saveItem
	};
}());
