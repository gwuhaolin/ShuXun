/**
 * Created by wuhaolin on 6/7/15.
 */
var Util = require('../util.js');
Util.initAVOS();
var DataRepair = require('../../server/util/data-repair.js');

describe.skip('util/data-repair.js', function () {

    describe('#fillUsedBookInfoWhereInfoIsNull', function () {
        it('对与UsedBook表里的没有Info属性的去抓取图书信息填上该属性', function (done) {
            this.timeout(10000000);
            DataRepair.fillUsedBookInfoWhereInfoIsNull();
        });
    });

    describe('#updateBookInfoUsedBooksRelation', function () {
        it('对于BookInfo表里每一本书都去重新计算它的usedBooks属性', function (done) {
            this.timeout(10000000);
            DataRepair.updateBookInfoUsedBooksRelation();
        });
    });

    describe('#updateNoDoubanIdBookInfoFromDouban', function () {
        it('对于doubanId为空的书的信息(也就是不是从豆瓣获取的图书信息),重新去豆瓣抓取一次', function (done) {
            this.timeout(10000000);
            DataRepair.updateNoDoubanIdBookInfoFromDouban();
        });
    });

});