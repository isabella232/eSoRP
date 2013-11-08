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
        $selectType = $("#selectType").data("kendoMobileSwitch");
        $startTime = $('#startTime');
        $endTime = $('#endTime');
    };
    var clear = function () {
        $description.val('');
        $qty.val('');
        $startTime.val('');
        $endTime.val('');
    };
    var show = function () {
        clear();
    };
    var saveItem = function () {
        mobileApp.showLoading();
        var items = app.viewModels.mainFeed.items;
        var newItem = items.add();
        newItem.Description = $description.val();
        newItem.Quantity = $qty.val();
        newItem.StartTime = kendo.toString(kendo.parseDate($startTime.val()), 'u')
        newItem.EndTime = kendo.toString(kendo.parseDate($endTime.val()), 'u')
        newItem.AlgorithmName = $selectDistributionType.text();
        newItem.Type = $selectType.check() == true ? "Personal" : "Enterprise";
        newItem.UserId = usersModel.currentUser.uid;

        items.one('sync', function () {
            clear();
            mobileApp.hideLoading();
            app.viewModels.mainFeed.refreshItems();
            mobileApp.navigate('#feed');
        });

        items.sync();
    };

    return {
        init: init,
        show: show,
        me: usersModel.currentUser,
        saveItem: saveItem
    };
}());
