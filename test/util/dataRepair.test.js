/**
 * Created by wuhaolin on 6/7/15.
 */
var DataRepair = require('../../server/util/dataRepair.js');

describe('util/dataRepair.js', function () {

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

    describe.only('#updateBookInfoWhereTagsAndRatingIsNull', function () {
        it('对于BookInfo表,tags和rating还为空,需要重新去抓取完善属性', function (done) {
            this.timeout(10000000);
            DataRepair.updateBookInfoWhereTagsAndRatingIsNull();
        });
    });

});