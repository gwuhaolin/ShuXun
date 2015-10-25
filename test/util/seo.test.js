/**
 * Created by wuhaolin on 9/11/15.
 */
var assert = require('assert');
var Unirest = require('unirest');
var SEO = require('../../server/util/seo.js');

describe('util/seo.js', function () {

    describe('#baiduLinkCommit', function () {
        it('', function (done) {
            SEO.baiduLinkCommit('http://www.ishuxun.cn/desktop/#!/book/recommend').done(function (res) {
                done();
            }).fail(function (err) {
                done(err);
            });
        });
    });

    describe('#prerenderLinkCommit', function () {
        it('向prerender server提交了链接后会重新抓取这个链接,然后返回渲染出的html', function (done) {
            this.timeout(100000);
            SEO.prerenderLinkCommit('http://www.ishuxun.cn/desktop/#!/book/one-book/?isbn13=9787515512594').done(function (res) {
                assert(res.indexOf('9787515512594') > 0);
                done();
            }).fail(function (err) {
                done(err);
            });
        });
    });

    describe('prerender server 中以后缓存了9787515512594这本书的数据', function () {
        it('', function (done) {
            this.timeout(5000);
            Unirest.get('http://www.ishuxun.cn/desktop/?_escaped_fragment_=/book/one-book/?isbn13=9787515512594')
                .header('user-agent','baiduspider')
                .end(function (res) {
                    if (res.ok) {
                        assert(res.raw_body.indexOf('9787515512594') > 0);
                        done();
                    } else {
                        done(res.error);
                    }
                });
        });
    });

});
