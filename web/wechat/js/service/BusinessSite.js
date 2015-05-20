/**
 * Created by wuhaolin on 5/20/15.
 * 获得图书电商购买途径
 */
"use strict";

APP.service('BusinessSite$', function () {
    /**
     * 获得对应的ISBN号码的图书在各大电商平台的价格信息
     * @param doubanId 图书的豆瓣ID
     * @return {AV.Promise}
     */
    this.getBusinessInfoByISBN = function (doubanId) {
        return AV.Cloud.run('getBusinessInfo', {
            id: doubanId
        }, null);
    }
});