// add item view model
var addItemViewModel = (function () {
    var $description;
    var $qty;
    var $selectType;
    var $startTime;
    var $endTime;
    var init = function () {
        $description = $('#description');
        $qty = $('#qty');
        $selectDistributionType = $('#selectDistributionType option:selected');
        $selectType = $('#selectType option:selected');
        $startTime = $('#startTime');
        $endTime = $('#endTime');
    };
    var show = function () {
        $description.val('');
        $qty.val('');
        $startTime.val('');
        $endTime.val('');
    };
    var saveItem = function () {
        var newItem = new Object();
        newItem.Description = $description.val();
        newItem.Quantity = $qty.val();
        debugger;
        newItem.StartTime = kendo.toString(kendo.parseDate($startTime.val()), 'u')
        newItem.EndTime = kendo.toString(kendo.parseDate($endTime.val()), 'u')
        newItem.AlgorithmName = $selectDistributionType.text();
        newItem.Type = $selectType.text();
        newItem.UserId = usersModel.currentUser.uid;
        
        Everlive.$.data('Item').create(newItem)
        .then(function (x) {
            show();
            mobileApp.navigate('#feed');
        })
    };

    return {
        init: init,
        show: show,
        me: usersModel.currentUser,
        saveItem: saveItem
    };
}());
