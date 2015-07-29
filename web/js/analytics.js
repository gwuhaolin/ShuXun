/**
 * Created by wuhaolin on 7/16/15.
 */
"use strict";

function _LeanAnalytics(channel) {

    //发送统计数据的客户端
    var _client = AV.analytics({
        appId: AV.applicationId,
        appKey: AV.applicationKey,
        version: AppVersion,
        channel: channel
    });

    function LeanAnalyticsSugue(eventName, attr) {
        var start = Date.now();
        attr.me = AV.User.current() ? AV.User.current().id : null;
        var sendData = {
            event: eventName,
            attr: attr,
            duration: null
        };
        this.send = function () {
            sendData.duration = Date.now() - start;
            _client.send(sendData);
        }
    }

    /**
     * 浏览一本书的信息
     * @param isbn13 书的isbn13号码
     */
    this.browseBookInfo = function (isbn13) {
        return new LeanAnalyticsSugue('browseBookInfo', {
            isbn13: isbn13
        });
    };

    /**
     * 浏览一本旧书
     * @param usedBookId 旧书的id
     */
    this.browseUsedBook = function (usedBookId) {
        return new LeanAnalyticsSugue('browseUsedBook', {
            usedBookId: usedBookId
        });
    };

    /**
     * 浏览一个用户的信息主页
     * @param userId 被浏览的用户的id
     */
    this.browseUser = function (userId) {
        return new LeanAnalyticsSugue('browseUser', {
            userId: userId
        });
    };

    /**
     * 浏览一类书
     * @param tag 这一类书的名称
     */
    this.browseTag = function (tag) {
        return new LeanAnalyticsSugue('browseTag', {
            tag: tag
        });
    };

    /**
     * 搜索书
     * @param keyword 搜索的关键字
     */
    this.searchBook = function (keyword) {
        return new LeanAnalyticsSugue('searchBook', {
            keyword: keyword
        });
    };
}