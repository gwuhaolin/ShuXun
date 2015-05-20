/**
 * Created by wuhaolin on 5/4/15.
 *
 */
"use strict";
var SuperAgent = require('superagent');
var Cheerio = require('cheerio');
var DoubanAPIKey = '03cddf77fa33367f0b699e67ee99a37d';
var LatestBook = {
    _Class: AV.Object.extend('LatestBook'),
    AttrName: ['doubanId', 'isbn13', 'title', 'image', 'author', 'publisher', 'pubdate', 'price'],
    makeQuery: function () {
        return new AV.Query('LatestBook');
    },
    makeObject: function () {
        return new LatestBook._Class();
    }
};

/**
 * 抓取豆瓣首页上的所有新书,返回一个数组,里面是图书的豆瓣Id
 * @returns {AV.Promise}
 */
exports.spiderLatestBooksId = function () {
    var rePromise = new AV.Promise(null);
    SuperAgent.get('http://book.douban.com/latest')
        .end(function (err, res) {
            if (err) {
                rePromise.reject(err);
            } else {
                if (res.ok) {
                    var re = [];
                    var $ = Cheerio.load(res.text);
                    $('a[href^="http://book.douban.com/subject/"]').each(function () {
                        var url = $(this).attr('href');
                        var id = url.split('/')[4];
                        re.push(id);
                    });
                    rePromise.resolve(re);
                } else {
                    rePromise.reject(res.text);
                }
            }
        });
    return rePromise;
};

/**
 * 根据bookId调用豆瓣API获取图书信息,并且保存到AVOS LatestBook表
 * @param doubanBookId
 * @param delay 延迟多少毫秒,因为豆瓣有api调用频率限制,没有这个参数时为0
 * @returns {AV.Promise}
 */
exports.saveOneLatestBook_Id = function (doubanBookId, delay) {
    delay = delay ? delay : 0;
    var rePromise = new AV.Promise(null);
    var query = LatestBook.makeQuery();
    query.equalTo('doubanId', doubanBookId);
    query.count().done(function (number) {
            if (number == 0) {//还没有这本书
                setTimeout(function () {
                    SuperAgent.get('https://api.douban.com/v2/book/' + doubanBookId)
                        .query({
                            fields: LatestBook.AttrName.toString(),
                            apikey: DoubanAPIKey
                        })
                        .end(function (err, res) {
                            if (err) {
                                rePromise.reject(err);
                            } else {
                                if (res.ok) {
                                    var avosBook = LatestBook.makeObject();
                                    for (var i = 0; i < LatestBook.AttrName.length; i++) {
                                        var attrName = LatestBook.AttrName[i];
                                        avosBook.set(attrName, res.body[attrName]);
                                    }
                                    avosBook.set('doubanId', doubanBookId);
                                    avosBook.save().done(function () {
                                        rePromise.resolve(avosBook);
                                    }).fail(function (err) {
                                        rePromise.reject(err);
                                    });
                                } else {
                                    rePromise.reject(res.text);
                                }
                            }
                        });
                }, delay);
            } else {//这本书已经存在
                rePromise.resolve('这本书已经存在');
            }
        }
    ).fail(function (err) {
            rePromise.reject(err);
        });
    return rePromise;
};

/**
 * 去豆瓣抓取书评,
 * 每次返回25个
 * @param doubanBookId 豆瓣的图书id
 * @param start 开始
 * @returns {AV.Promise} {
                            reviewId: reviewId,
                            avatarUrl: avatarUrl,
                            title: title,
                            context: context
                        }
 */
exports.spiderDoubanBookReview = function (doubanBookId, start) {
    var rePromise = new AV.Promise(null);
    SuperAgent
        .get('http://book.douban.com/subject/' + doubanBookId + '/reviews')
        .query({
            start: start
        }).end(function (err, res) {
            if (err) {
                rePromise.reject(err);
            } else {
                if (res.ok) {
                    var re = [];
                    var $ = Cheerio.load(res.text);
                    $('.ctsh').each(function () {
                        var avatarUrl = $(this).find('img').first().attr('src');
                        var a = $(this).find('h3').first().children('a').first();
                        var reviewId = $(a).attr('href').split('/')[4];
                        var title = $(a).text();
                        var context = $(this).find('.review-short').first().children('span').first().text();
                        re.push({
                            reviewId: reviewId,
                            avatarUrl: avatarUrl,
                            title: title,
                            context: context
                        })
                    });
                    rePromise.resolve(re);
                } else {
                    rePromise.reject(res.text);
                }
            }
        });
    return rePromise;
};