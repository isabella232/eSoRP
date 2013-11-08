
// signup view model
var inviteViewModel = (function () {
    var dataSource;
    var $description;

    var saveitem = function () {
        //$description.val('');

        //showAlert("Invitations sent");
        //mobileApp.navigate('#welcome');

        mobileApp.showLoading();
        var newItem = new Object();

        newItem.Recipient = $description.val();

        Everlive.$.data('SendInvite').create(newItem)
        .then(function (x) {
            clear();
            mobileApp.hideLoading();
            showAlert("Invitation sent");
            mobileApp.navigate('#feed');
        })

    }

    var init = function ()
    {
        $description = $('#friends');
        $('#send').click(saveitem);
    };

    var clear = function ()
    {
        $description.val('');
    }

    var show = function () {
        clear();
       
    };
    return {
        init: init,
        saveitem: saveitem,
        show: show,
    };
}());