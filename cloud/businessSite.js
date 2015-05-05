/**
 * Created by wuhaolin on 4/16/15.
 * 获得图书的电商购买信息
 */
"use strict";
var SuperAgent = require('superagent');
var Cheerio = require('cheerio');

var UnionID = {
    JD: '287386251',//京东
    Amazon: '',//亚马逊
    DangDang: 'shuxun',//当当
    WenXuan: '',//文轩,
    BeiFa: '',//北发图书网
    BooksChina: '354944',//中国图书
    ChinaPub: '',//china-pub
    TaoShu: ''//淘书网
};

/**
 * 从URL里query解析出参数
 * @param qs get URL
 * @returns {{}} 参数
 */
function getQueryParams(qs) {
    qs = qs.split("+").join(" ");
    var params = {}, tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;
    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])]
            = decodeURIComponent(tokens[2]);
    }
    return params;
}

/**
 * 替换URL中的一个query参数
 * @param url
 * @param param
 * @param paramVal
 * @returns {string}
 */
function updateURLParameter(url, param, paramVal) {
    var TheAnchor = null;
    var newAdditionalURL = "";
    var tempArray = url.split("?");
    var baseURL = tempArray[0];
    var additionalURL = tempArray[1];
    var temp = "";
    var tmpAnchor, TheParams;
    if (additionalURL) {
        tmpAnchor = additionalURL.split("#");
        TheParams = tmpAnchor[0];
        TheAnchor = tmpAnchor[1];
        if (TheAnchor) {
            additionalURL = TheParams;
        }

        tempArray = additionalURL.split("&");

        for (var i = 0; i < tempArray.length; i++) {
            if (tempArray[i].split('=')[0] != param) {
                newAdditionalURL += temp + tempArray[i];
                temp = "&";
            }
        }
    }
    else {
        tmpAnchor = baseURL.split("#");
        TheParams = tmpAnchor[0];
        TheAnchor = tmpAnchor[1];
        if (TheParams) {
            baseURL = TheParams;
        }
    }

    if (TheAnchor) {
        paramVal += "#" + TheAnchor;
    }

    var rows_txt = temp + "" + param + "=" + paramVal;
    return baseURL + "?" + newAdditionalURL + rows_txt;
}

/**
 * 更具传入的URL分析出来自哪个商场,然后替换unionID
 * @param url
 * @return string 替换后的URL
 */
function replaceUnionID(url) {
    //if (url.indexOf('dangdang.com') >= 0) {
    //    url = updateURLParameter(url, 'form', UnionID.DangDang);
    //} else if (url.indexOf('jd.com') >= 0) {
    //
    //} else if (url.indexOf('winxuan.com') >= 0) {
    //    url = updateURLParameter(url, 'customerID', UnionID.WenXuan);
    //} else if (url.indexOf('beifabook.com') >= 0) {
    //    url = updateURLParameter(url, 'extra', UnionID.BeiFa)
    //} else if (url.indexOf('amazon.cn') >= 0) {
    //
    //} else if (url.indexOf('bookschina.com') >= 0) {
    //    url = updateURLParameter(url, 'adservice', UnionID.BooksChina);
    //} else if (url.indexOf('china-pub.com') >= 0) {
    //    url = updateURLParameter(url, 'ljid', UnionID.ChinaPub);
    //} else if (url.indexOf('taoshu.com') >= 0) {
    //    url = updateURLParameter(url, 'from', UnionID.TaoShu);
    //}
    return url;
}

/**
 * @param doubanId 图书的豆瓣ID
 * @return {AV.Promise}
 */
exports.spider = function (doubanId) {
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
                        var urlParam = getQueryParams($(first).attr('href').trim());
                        one.url = replaceUnionID(urlParam.url);
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

