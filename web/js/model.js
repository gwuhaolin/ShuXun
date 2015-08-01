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
    //实例方法

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
}, {
    //类方法

    /**
     * 解析豆瓣获取到到book json
     * @param doubanJson
     * @returns AV.BookInfo instance
     */
    fromDouban: function (doubanJson) {
        var bookInfo = new Model.BookInfo();
        bookInfo.set('isbn13', doubanJson['isbn13']);
        bookInfo.set('title', doubanJson['title']);
        bookInfo.set('image', doubanJson['image']);
        bookInfo.set('author', doubanJson['author']);
        bookInfo.set('translator', doubanJson['translator']);
        bookInfo.set('publisher', doubanJson['publisher']);
        bookInfo.set('pubdate', doubanJson['pubdate']);
        bookInfo.set('rating', doubanJson['rating']);
        //把tags属性里的每一条属性{"count":8039,"name":"余华","title":"余华"} 中的title属性删除掉
        AV._.each(doubanJson.tags, function (tag) {
            delete tag.title;
        });
        bookInfo.set('tags', doubanJson['tags']);
        bookInfo.set('binding', doubanJson['binding']);
        bookInfo.set('price', doubanJson['price']);
        bookInfo.set('pages', doubanJson['pages']);
        bookInfo.set('author_intro', doubanJson['author_intro']);
        bookInfo.set('summary', doubanJson['summary']);
        bookInfo.set('catalog', doubanJson['catalog']);
        bookInfo.set('doubanId', doubanJson['id']);
        return bookInfo;
    }
});

Model.School = AV.Object.extend('School');

Model.Major = AV.Object.extend('Major');

Model.UsedBook = AV.Object.extend('UsedBook');

Model.WechatNews = AV.Object.extend('WechatNews');

if (typeof module != 'undefined') {//Nodejs
    module.exports = Model;
}