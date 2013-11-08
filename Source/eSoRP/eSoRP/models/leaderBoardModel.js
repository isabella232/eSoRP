// leader board view model
var leaderBoardViewModel = (function () {
	var topUsersModel = []

	var compareUsersByPoints = function (user, otherUser) {
		if (user.Points === undefined) {
			user.Points = 0;
		}
		if (otherUser === undefined) {
			otherUser.Points = 0;
		}

		if (user.Points < otherUser.Points)
			return -1;
		if (user.Points > otherUser.Points)
			return 1;
		return 0;
	};

	var getTopUsers = function (users, number) {
		users.sort(compareUsersByPoints);

		var topUsers = [];
		for (var index in users) {
			topUsers.push(users[index]);
			if (topUsers.length === number) {
				return topUsers;
			}
		}
		return topUsers;
	};

	var requestTopUsers = function () {
		Everlive.$.data('Users').get().
			then(function (data) {
				topUsersModel = getTopUsers(data.result, data.count);
			},
			function (error) {
			});
	};

	var itemSelected = function () {
	};

	var itemsDataSource = new kendo.data.DataSource({
		data: topUsersModel
	});

	var show = function () {
		topUsersModel.push(
			{
				Email: "coco@telerik.com",
				Points: 88
			});
	}

	return {
		init: requestTopUsers,
		show: show,
		items: itemsDataSource,
		itemSelected: itemSelected,
	};
}());
