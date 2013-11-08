
// signup view model
var inviteViewModel = (function () {
    var dataSource;
    var $description;

    var saveitem = function () {
        $description.val('');

        showAlert("Invitations sent");
        mobileApp.navigate('#welcome');

    }

    var init = function ()
    {
        $description = $('#description');
        $('#send').click(saveitem);
    };

    var show = function () {
        dataSource = kendo.observable({
        });
        kendo.bind($('#single-invite'), dataSource, kendo.mobile.ui);
       
    };
    return {
        init: init,
        saveitem: saveitem,
        show: show,
    };
}());