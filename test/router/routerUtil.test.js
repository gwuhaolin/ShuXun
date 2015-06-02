/**
 * Created by wuhaolin on 6/1/15.
 */
var assert = require('assert');
var _ = require('underscore');
var Model = require('../../web/js/Model.js');
var routerUtil = require('../../server/router/routerUtil.js');

describe('router/routerUtil.js', function () {

    describe('#genDataWithDefaultMeta', function () {
        it('要生成好meta属性', function () {
            var data = routerUtil.genDataWithDefaultMeta();
            assert(data.meta.title, '必须具有meta.title属性');
            assert(data.meta.keywords, '必须具有meta.keywords属性');
            assert(data.meta.description, '必须具有meta.description属性');
        });
    });

    describe('#avosArrayToJsonArray', function () {
        it('要转换为json格式', function () {
            var json = {
                a: 1,
                b: 'b',
                c: [1, 3, '12']
            };
            var avosBookInfo = new Model.BookInfo(json);
            assert.deepEqual(json, routerUtil.avosArrayToJsonArray([avosBookInfo])[0], '获得准确的json');
        });
    });

});