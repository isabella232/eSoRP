var applicationSettings = {
	emptyGuid: '00000000-0000-0000-0000-000000000000',
	apiKey: 'cCq6jSNpJClBy6vU',
	scheme: 'http'
};

// initialize Everlive SDK
var el = new Everlive({
	apiKey: applicationSettings.apiKey,
	scheme: applicationSettings.scheme
});

var AppHelper = {
	resolveProfilePictureUrl: function (id) {
		if (id && id !== applicationSettings.emptyGuid) {
			return el.Files.getDownloadUrl(id);
		}
		else {
			return 'styles/images/avatar.png';
		}
	},
	resolvePictureUrl: function (id) {
		if (id && id !== applicationSettings.emptyGuid) {
			return el.Files.getDownloadUrl(id);
		}
		else {
			return '';
		}
	},
	formatDate: function (dateString) {
		var date = new Date(dateString);
		var year = date.getFullYear().toString();
		var month = date.getMonth().toString();
		var day = date.getDate().toString();
		return day + '.' + month + '.' + year;
	},
	logout: function () {
		return el.Users.logout();
	}
};
