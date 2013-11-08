var itemViewModel = (function (e) {
    var item;
    return {
        show: function (e) {
            item = mainFeedViewModel.items.getByUid(e.view.params.uid);
            kendo.bind(e.view.element, item, kendo.mobile.ui);
        },
        subscribe: function (e) {
            var participant = new Object();
            participant.UserId = item.User().Id;
            participant.ItemId = item.Id;
            Everlive.$.data('Participant').create(participant)
            mobileApp.navigate('views/mainFeedView.html');
        }
    };
}());
var currentUserViewModel = (function (e) {
    return {
        show: function (e) {
            var user = el.Users.currentUser();
            kendo.bind(e.view.element, user, kendo.mobile.ui);
        }
    };
}());

var app = (function () {
    'use strict';
    var onBackKeyDown = function(e) {
        e.preventDefault();
        navigator.notification.confirm('Do you really want to exit?', function (confirmed) {
            var exit = function () {
                navigator.app.exitApp();
            };
            if (confirmed === true || confirmed === 1) {
                AppHelper.logout().then(exit, exit);
            }
        }, 'Exit', 'Ok,Cancel');
    };
    var onDeviceReady = function() {
        //Handle document events
        document.addEventListener("backbutton", onBackKeyDown, false);
       // registerPushNotifications();
    };

    document.addEventListener("deviceready", onDeviceReady, false);



    var facebook = new IdentityProvider({
        name: "Facebook",
        loginMethodName: "loginWithFacebook",
        endpoint: "https://www.facebook.com/dialog/oauth",
        response_type:"token",
        client_id: "622842524411586",
        redirect_uri:"https://www.facebook.com/connect/login_success.html",
        access_type:"online",
        scope:"email",
        display: "touch"
    });
    
    // login view model
    var loginViewModel = (function () {
        var login = function () {

            mobileApp.showLoading();

            var username = $('#loginEmail').val();
            var password = $('#loginPassword').val();

            el.Users.login(username, password)
            .then(function () {
                return usersModel.load();
            })
            .then(function () {
                mobileApp.hideLoading();
                mobileApp.navigate('views/mainFeedView.html');
            })
            .then(null,
                  function (err) {
                      mobileApp.hideLoading();
                      showError(err.message);
                  }
            );
        };
        var loginWithFacebook = function() {
            mobileApp.showLoading();
            facebook.getAccessToken(function(token) {
                el.Users.loginWithFacebook(token)
                .then(function () {
                    return usersModel.load();
                })
                .then(function () {
                    mobileApp.hideLoading();
                    mobileApp.navigate('views/mainFeedView.html');
                })
                .then(null, function (err) {
                    mobileApp.hideLoading();
                    if (err.code = 214) {
                        showError("The specified identity provider is not enabled in the backend portal.");
                    }
                    else {
                        showError(err.message);
                    }
                });
            })
        } 
        return {
            login: login,
            loginWithFacebook: loginWithFacebook
        };
    }());

    return {
        viewModels: {
            login: loginViewModel,
            signup: singupViewModel,
            mainFeed: mainFeedViewModel,
            item: itemViewModel,
            addItem: addItemViewModel,
            currentUser: currentUserViewModel,
            inviteUsers: inviteViewModel,
            leaderBoard: leaderBoardViewModel
        }
    };
}());

