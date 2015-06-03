/**
 * Created by wuhaolin on 5/31/15.
 * 数据模型
 */
"use strict";
/**
 * 所有的模型
 */
var Model = {};
if (typeof require != 'undefined') {//Nodejs
    var AV = require('leanengine');
}

Model.User = AV.Object.extend('_User', {
    /**
     * 替换微信默认的头像的大小
     * @param size 替换后获得的大小 有0、46、64、96、132数值可选，0代表640*640正方形头像
     * @returns {string} 替换后头像的url
     */
    avatarUrlWithSize: function (size) {
        var avatarUrl = this.get('avatarUrl');
        if (avatarUrl) {
            return avatarUrl.substring(0, avatarUrl.length - 1) + size;
        } else {
            return null;
        }
    }
});

Model.Status = AV.Object.extend('_Status');

Model.BookInfo = AV.Object.extend('BookInfo', {
    initialize: function () {
        this.on('change:image', this.genBigImage, this);
        this.attributes.image && this.genBigImage();
    },
    /**
     * 对于豆瓣图书信息的获得我的封面的更大图片的URL
     * 会生成bigImage属性挂载在this.attributes.bigImage上,
     * 如果不是豆瓣的就直接赋值为原来的
     */
    genBigImage: function () {
        this.attributes.bigImage = this.get('image');
        if (this.attributes.bigImage.indexOf('.douban.com/') > 0) {//是来自豆瓣的图片
            this.attributes.bigImage = this.attributes.bigImage.replace('mpic', 'lpic');
        }
    }
});

Model.School = AV.Object.extend('School');

Model.UsedBook = AV.Object.extend('UsedBook');

if (typeof module != 'undefined') {//Nodejs
    module.exports = Model;
}