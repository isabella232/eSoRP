// add item view model
var addItemViewModel = (function () {
    var $description;
    var $qty;
    var $selectType;
    var $startTime;
    var $endTime;
    var validator;
    var init = function () {
        //validator = $('#enterStatus').kendoValidator().data("kendoValidator");
        $description = $('#description');
        $qty = $('#qty');
        $selectDistributionType = $('#selectDistributionType option:selected');
        $selectType = $('#selectType option:selected');
        $startTime = $('#startTime');
        $endTime = $('#endTime');
    };
    var show = function () {
        //$newStatus.val('');
        //validator.hideMessages();
    };
    var saveItem = function () {
        //if (validator.validate()) {
        //var activities = mainFeedModel.activities;

        var newItem = new Object();
        newItem.Description = $description.val();
        newItem.Quantity = $qty.val();
        newItem.StartDate = $startTime.val();
        newItem.EndDate = $endTime.val();
        newItem.AlgorithmName = $selectDistributionType.text();
        newItem.Type = $selectType.text();
        newItem.UserId = usersModel.currentUser.uid;
        
        Everlive.$.data('Item').create(newItem)
        .on(function () { mobileApp.navigate('#:back'); })
    };

    return {
        init: init,
        show: show,
        me: usersModel.currentUser,
        saveItem: saveItem
    };
}());
