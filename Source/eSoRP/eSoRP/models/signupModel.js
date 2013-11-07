
// signup view model
var singupViewModel = (function () {
	var dataSource;
	var signup = function () {
		dataSource.Gender = parseInt(dataSource.Gender);
		var birthDate = new Date(dataSource.BirthDate);
		if (birthDate.toJSON() === null)
			birthDate = new Date();
		dataSource.BirthDate = birthDate;
		Everlive.$.Users.register(
			dataSource.Username,
			dataSource.Password,
			dataSource)
		.then(function () {
			showAlert("Registration successful");
			mobileApp.navigate('#welcome');
		},
			  function (err) {
			  	showError(err.message);
			  }
		);
	};
	var show = function () {
		dataSource = kendo.observable({
			Username: '',
			Password: '',
			DisplayName: '',
			Email: '',
			Gender: '1',
			About: '',
			Friends: [],
			BirthDate: new Date()
		});
		kendo.bind($('#signup-form'), dataSource, kendo.mobile.ui);
	};
	return {
		show: show,
		signup: signup
	};
}());