/**
 * Created by wuhaolin on 9/11/15.
 */
var assert = require('assert');
var SEO = require('../../server/util/seo.js');

describe('util/seo.js', function () {

    describe('#baiduLinkCommit', function () {
        var urlList = [
            'http://www.ishuxun.cn/desktop/#!/book/recommend',
            'http://www.ishuxun.cn/desktop/#!/book/book-list?cmd=latest',
            'http://www.ishuxun.cn/desktop/#!/book/used-book-list?cmd=nearCircle',
            'http://www.ishuxun.cn/desktop/#!/book/used-book-list?cmd=nearUsed',
            'http://www.ishuxun.cn/desktop/#!/book/used-book-list?cmd=nearNeed',
            'http://www.ishuxun.cn/desktop/#!/common/user-list?cmd=near'
        ];

        it('数组', function (done) {
            SEO.baiduLinkCommit(urlList).done(function (res) {
                console.log(res);
                done();
            }).fail(function (err) {
                done(err);
            });
        });

        it('单个字符串', function (done) {
            SEO.baiduLinkCommit(urlList[0]).done(function (res) {
                console.log(res);
                done();
            }).fail(function (err) {
                done(err);
            });
        });
    });

});
