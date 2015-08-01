/**
 * Created by wuhaolin on 8/1/15.
 */
var assert = require('assert');
var wechatNews = require('../../server/wechat/wechatNews.js');
var Util = require('../util.js');

describe('wechat/wechatNews.js', function () {

    before(function () {
        Util.initAVOS();
    });

    describe('#spiderWechatNews', function () {
        it('', function (done) {
            this.timeout(100000);
            wechatNews.spiderWechatNews().done(function (result) {
                console.log(JSON.stringify(result));
                done();
            }).fail(function (err) {
                done(err);
            })
        })
    });

    describe('#downNewsThumbImage', function () {
        it('', function (done) {
            this.timeout(10000);
            var thumbMediaID = 'nH9OD0bmKXpZwyfqniqKpe3v_9gChdmirKt20HGr9f4';
            wechatNews.downloadNewsThumbImage(thumbMediaID).done(function (file) {
                assert.equal(thumbMediaID + '.jpeg', file._name);
                file.destroy().always(function () {
                    done();
                });
            }).fail(function (err) {
                done(err);
            })
        })
    });
});
