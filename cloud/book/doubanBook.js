/**
 * Created by wuhaolin on 5/4/15.
 *
 */
"use strict";
var url = require('url');
var SuperAgent = require('superagent');
var Cheerio = require('cheerio');
var BookInfo = require('cloud/book/bookInfo.js');
var DoubanAPIKey = '03cddf77fa33367f0b699e67ee99a37d';

exports.spiderAndSaveLatestBooks = function () {
    /**
     * 抓取豆瓣首页上的所有新书,返回一个数组,里面是图书的豆瓣Id
     * @returns {AV.Promise}
     */
    function spiderLatestBooksId() {
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
    }

    /**
     * 根据bookId调用豆瓣API获取图书信息,并且保存到AVOS LatestBook表
     * @param doubanBookId
     * @param delay 延迟多少毫秒,因为豆瓣有api调用频率限制,没有这个参数时为0
     * @returns {AV.Promise}
     */
    function saveOneLatestBookById(doubanBookId, delay) {
        delay = delay ? delay : 0;
        var rePromise = new AV.Promise(null);
        var query = BookInfo.AVOS.makeQuery();
        query.equalTo('doubanId', doubanBookId);
        query.count().done(function (number) {
                if (number == 0) {//还没有这本书
                    setTimeout(function () {
                        SuperAgent.get('https://api.douban.com/v2/book/' + doubanBookId)
                            .query({
                                fields: BookInfo.AVOS.AttrName.toString(),
                                apikey: DoubanAPIKey
                            })
                            .end(function (err, res) {
                                if (err) {
                                    rePromise.reject(err);
                                } else {
                                    if (res.ok) {
                                        query = BookInfo.AVOS.makeQuery();
                                        query.equalTo('isbn13', res.body.isbn13);
                                        query.first().done(function (avosBook) {
                                            if (avosBook) {//已经有这本书了
                                                res.body.doubanId = res.body.id;
                                                delete  res.body.id;
                                                avosBook.save(res.body);
                                            } else {
                                                avosBook = BookInfo.AVOS.makeObject(res.body);
                                                avosBook.set('doubanId', doubanBookId);
                                                avosBook.save().done(function () {
                                                    rePromise.resolve(avosBook);
                                                }).fail(function (err) {
                                                    rePromise.reject(err);
                                                });
                                            }
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
    }

    var rePromise = new AV.Promise(null);
    spiderLatestBooksId().done(function (bookIds) {
        rePromise.resolve(bookIds.length);
        for (var i = 0; i < bookIds.length; i++) {
            saveOneLatestBookById(bookIds[i], i * 1000).fail(function (err) {
                console.error(err);
            })
        }
    }).fail(function (err) {
        rePromise.reject(err);
    })
};

/**
 * 去豆瓣抓取书评,
 * 每次返回25个
 * @param doubanBookId 豆瓣的图书id
 * @param start 开始
 * @returns {AV.Promise} json格式的{
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

/**
 * 获得对应isbn的图书的信息
 * @param isbn
 * @returns {AV.Promise} json格式图书信息
 */
exports.spiderBookByISBN = function (isbn) {
    var rePromise = new AV.Promise(null);
    SuperAgent.get('https://api.douban.com/v2/book/isbn/' + isbn)
        .end(function (err, res) {
            if (err) {
                rePromise.reject(err);
            } else {
                res.body['doubanId'] = res.body.id;
                delete  res.body.id;
                rePromise.resolve(res.body);
            }
        });
    return rePromise;
};

/**
 * @param doubanId 图书的豆瓣ID
 * @return {AV.Promise}
 * 返回json格式 [{url,name,price}]
 */
exports.spiderBusinessInfo = function (doubanId) {
    var rePromise = new AV.Promise(null);
    SuperAgent
        .get('http://frodo.douban.com/h5/book/' + doubanId + '/buylinks')
        .end(function (err, res) {
            if (err) {
                rePromise.reject(err);
            } else {
                if (res.ok) {
                    var $ = Cheerio.load(res.text);
                    var re = [];
                    $("ck-part[type='item']").each(function () {
                        var one = {};
                        var first = $(this).children().first();
                        one.url = $(first).attr('href');
                        one.url = url.parse(one.url,true).query['url'];
                        one.name = $(first).text().trim().replace(/网|商城/, '');
                        one.price = parseFloat($(first).next().text().trim());
                        re.push(one);
                    });
                    rePromise.resolve(re);
                } else {
                    rePromise.reject(res.text);
                }
            }
        });
    return rePromise;
};
