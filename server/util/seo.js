/**
 * Created by wuhaolin on 9/11/15.
 */

var AV = require('leanengine');
var Unirest = require('unirest');

/**
 * 向百度搜索引擎提交链接
 * @param url 要提交的链接的URL
 * @returns {AV.Promise}
 */
exports.baiduLinkCommit = function (url) {
    var rePromise = new AV.Promise();
    Unirest.post('http://data.zz.baidu.com/urls?site=www.ishuxun.cn&token=2dk82PmKgFJHnJSh')
        .set('Content-Type', 'text/plain').send(url).end(function (res) {
        if (res.ok) {
            rePromise.resolve(res.body);
        } else {
            rePromise.reject(res.body);
        }
    });
    return rePromise;
};

/**
 * 向Prerender Server 提交要抓取的链接 先缓存好
 * @param url
 * @returns {AV.Promise} string 渲染出来的html
 */
exports.prerenderLinkCommit = function (url) {
    var rePromise = new AV.Promise();
    var postURL = 'http://prerender.wuhaolin.cn/' + url.replace('#!', '?_escaped_fragment_=');
    Unirest.post(postURL).end(function (res) {
        if (res.ok) {
            rePromise.resolve(res.raw_body);
        } else {
            rePromise.reject(res.error);
        }
    });
    return rePromise;
};

/**
 * 当有网页需要被重新抓取时调用
 * @param url 需要被重新抓取的网页
 */
exports.linkCommit = function (url) {
    exports.prerenderLinkCommit(url);
    exports.baiduLinkCommit(url);
};