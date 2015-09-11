/**
 * Created by wuhaolin on 9/11/15.
 */

var AV = require('leanengine');
var Unirest = require('unirest');

/**
 * 向百度搜索引擎提交链接
 * @param url 要提交的链接的Url string or array
 * @returns {AV.Promise}
 */
exports.baiduLinkCommit = function (url) {
    var rePromise = new AV.Promise();
    var data = '';
    if (typeof url === 'string') {
        data = url;
    } else {
        if (Array.isArray(url)) {
            AV._.each(url, function (url) {
                data += url + '\n';
            });
        }
    }
    Unirest.post('http://data.zz.baidu.com/urls?site=www.ishuxun.cn&token=2dk82PmKgFJHnJSh')
        .set('Content-Type', 'text/html').send(data).end(function (res) {
            if (res.ok) {
                rePromise.resolve(res.body);
            } else {
                rePromise.reject(res.error);
            }
        });
    return rePromise;
};