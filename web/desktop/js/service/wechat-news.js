/**
 * Created by wuhaolin on 8/1/15.
 */
"use strict";

APP.service('WechatNews$', function ($rootScope) {
    var that = this;

    this.newsList = [];
    this.hasMoreFlag = true;

    this.loadMore = function () {
        var query = new AV.Query(Model.WechatNews);
        query.equalTo('shouldPublic', true);
        query.skip(that.newsList.length);
        query.limit(LoadCount);
        query.find().done(function (news) {
            if (news.length > 0) {
                that.newsList.pushUniqueArray(news);
            } else {
                that.hasMoreFlag = false;
            }
        }).always(function () {
            $rootScope.$digest();
        });
    };

    this.hasMore = function () {
        return this.hasMoreFlag;
    };

});
