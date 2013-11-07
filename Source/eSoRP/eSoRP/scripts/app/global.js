
// global error handling
var showAlert = function (message, title, callback) {
	navigator.notification.alert(message, callback || function () {
	}, title, 'OK');
};
var showError = function (message) {
	showAlert(message, 'Error occured');
};
//window.addEventListener('error', function (e) {
//    e.preventDefault();
//    var message = e.message + "' from " + e.filename + ":" + e.lineno;
//    showAlert(message, 'Error occured');
//    return true;
//});