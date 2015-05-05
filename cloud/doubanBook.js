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
    AttrName: ['doubanId', 'isbn13', 'title', 'image', 'pubdate', 'author', 'publisher', 'pubdate', 'price'],
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
exports.spiderLatestBook = function () {
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
 * @returns {AV.Promise}
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
 * TODO not work
 * 去豆瓣抓取单条评论的完整内容
 * @param doubanReviewId
 * @returns {AV.Promise}
 */
exports.spiderDoubanBookOneFullReview = function (doubanReviewId) {
    var rePromise = new AV.Promise(null);
    SuperAgent.get('http://book.douban.com/j/review/' + doubanReviewId + '/fullinfo').end(function (err, res) {
        if (err) {
            rePromise.reject(err);
        } else {
            if (res.ok) {
                var html = res.body.html;
                var $ = Cheerio.load(html);
                $('div').remove();
                rePromise.resolve($.text());
            } else {
                rePromise.reject(res.text);
            }
        }
    });
    return rePromise;
};

/**
 * 调用豆瓣图书接口按照关键字搜索书
 * @param keyword 搜索关键字
 * @returns {AV.Promise} 如果成功返回可以直接回复给用户的json{title,image,url}数组,没有找到书时返回的json数组长度为0
 */
exports.searchBook = function (keyword) {
    var rePromise = new AV.Promise(null);
    SuperAgent.get('https://api.douban.com/v2/book/search')
        .query({
            q: keyword,
            count: 10,
            fields: 'image,title,isbn13'
        })
        .end(function (err, res) {
            if (err) {
                rePromise.reject(err);
            } else {
                if (res.ok) {
                    var re = [];
                    var json = res.body;
                    var total = json.total;
                    if (total > 0) {//找到了对于的书
                        var books = json.books;
                        for (var i = 0; i < books.length && i < 9; i++) {//最多9本书
                            var title = books[i].title;
                            var bookUrl = 'http://www.ishuxun.cn/wechat/#/tab/book/oneBook/' + books[i].isbn13;
                            re.push({
                                title: title,
                                image: books[i].image,
                                url: bookUrl
                            });
                        }
                        if (total > 9) {//因为微信最多可以显示10本,当有的书大于9本时为用户提供显示更多
                            re.push({
                                title: '还有剩下' + (total - json.count) + '本相关的书,点击查看',
                                image: 'http://www.ishuxun.cn/wechat/img/logo-R.png',
                                url: 'http://www.ishuxun.cn/wechat/#/tab/book/searchList/' + keyword
                            });
                        }
                    }
                    rePromise.resolve(re);
                } else {
                    rePromise.reject(res.text);
                }
            }
        });
    return rePromise;
};