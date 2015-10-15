/**
 * Created by wuhaolin on 9/11/15.
 */
var assert = require('assert');
var SEO = require('../../server/util/seo.js');

describe('util/seo.js', function () {

    describe('#baiduLinkCommit', function () {
        it('', function (done) {
            SEO.baiduLinkCommit('http://www.ishuxun.cn/desktop/#!/book/recommend').done(function (res) {
                console.log(res);
                done();
            }).fail(function (err) {
                done(err);
            });
        });
    });

    describe('#prerenderLinkCommit', function () {
        it('', function (done) {
            this.timeout(100000);
            SEO.prerenderLinkCommit('http://www.ishuxun.cn/desktop/#!/book/one-book/?isbn13=9787515512594').done(function (res) {
                assert(res.indexOf('9787515512594')>0);
                done();
            }).fail(function (err) {
                done(err);
            });
        });
    });

});
