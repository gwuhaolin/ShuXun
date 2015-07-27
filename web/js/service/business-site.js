/**
 * Created by wuhaolin on 5/20/15.
 * 获得图书电商购买途径
 */
"use strict";

APP.service('BusinessSite$', function () {
    /**
     * 获得对应的ISBN号码的图书在各大电商平台的价格信息
     * @param isbn13 图书的豆瓣ID
     * @return {AV.Promise} 返回[{url,name,price,logoUrl}]
     */
    this.getBusinessInfoByISBN = function (isbn13) {
        return AV.Cloud.run('getBusinessInfo', {
            isbn13: isbn13
        }, null);
    }
});