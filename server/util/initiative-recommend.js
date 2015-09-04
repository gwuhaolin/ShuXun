/**
 * Created by wuhaolin on 6/12/15.
 * 使用微信模板消息主动给用户推送图书
 */
var _ = require('underscore');
var AV = require('leanengine');
var Model = require('../../web/js/model.js');
var WechatAPI = require('../wechat/wechatAPI.js');

/**
 * 把[[],[],[]] 装换为[,,,]
 * @param arrayList
 * @returns {Array}
 */
function arrayListToArray(arrayList) {
    var re = [];
    _.each(arrayList, function (array) {
        re = re.concat(array);
    });
    return re;
}

/**
 * 获得所有对应专业的用户的数量
 * @param major 筛选专业
 * @returns {AV.Promise} 数量
 */
exports.getAllUserCountEqualMajor = function (major) {
    var query = new AV.Query(Model.User);
    query.equalTo('major', major);
    return query.count();
};

/**
 * 获得所有对应专业的用户
 * @param major 专业筛选
 * @returns {AV.Promise} AV.User list
 */
exports.getAllUserEqualMajor = function (major) {
    var rePromise = new AV.Promise(null);
    var countQuery = new AV.Query(Model.User);
    countQuery.equalTo('major', major);
    countQuery.count().done(function (sumCount) {
        var userQueryList = [];
        for (var i = 0; i < sumCount; i += 1000) {
            var userQuery = new AV.Query(Model.User);
            userQuery.equalTo('major', major);
            userQuery.limit(1000);
            userQueryList.push(userQuery.find());
        }
        AV.Promise.all(userQueryList).then(function (usersList) {
            var re = arrayListToArray(usersList);
            rePromise.resolve(re);
        }, function (err) {
            rePromise.reject(err);
        })
    });
    return rePromise;
};

/**
 * 对UsedBook表做查询
 * @param major 筛选UsedBook.owner的major
 * @param role 筛选UsedBook的role属性
 * @returns {AV.Query|t.Query}
 * @private
 */
function _makeAllUsedBookEqualMajorQuery(major, role) {
    var query = new AV.Query(Model.UsedBook);
    query.equalTo('role', role);
    var innerMajorQuery = new AV.Query(Model.User);
    innerMajorQuery.equalTo('major', major);
    query.matchesQuery('owner', innerMajorQuery);
    return query;
}

/**
 * 获得所有的对应专业的UsedBook的数量
 * @param major 筛选专业
 * @param role 筛选UsedBook的role属性
 * @returns {AV.Promise} 数量
 */
exports.getAllUsedBookCountEqualMajor = function (major, role) {
    var query = _makeAllUsedBookEqualMajorQuery(major, role);
    return query.count();
};

/**
 * 获得所有的对应专业的UsedBook
 * @param major 专业
 * @param role sell | need
 * @returns {AV.Promise|t.Promise} [UsedBook]
 */
exports.getAllUsedBookEqualMajor = function (major, role) {
    var rePromise = new AV.Promise(null);

    _makeAllUsedBookEqualMajorQuery(major, role).count().done(function (sumCount) {
        var queryList = [];
        for (var i = 0; i < sumCount; i += 1000) {
            var query = _makeAllUsedBookEqualMajorQuery(major, role);
            query.limit(1000);
            queryList.push(query.find());
        }
        AV.Promise.all(queryList).then(function (usedBooksList) {
            var re = arrayListToArray(usedBooksList);
            rePromise.resolve(re);
        }, function (err) {
            rePromise.reject(err);
        });
    }).fail(function (err) {
        rePromise.reject(err);
    });
    return rePromise;
};

exports.initiativeRecommendToOneUser = function (user) {
    var openId = user.get('openId');
    var sex = user.get('sex');
    var startSchoolYear = user.get('startSchoolYear');
    var major = user.get('major');

    var title = '';
    var senderName = '';
    var msg = '';
    var url = '';

    if (startSchoolYear == '2011') {//当前的毕业生
        if (sex == 1) {
            senderName = '小学妹';
        } else if (sex == 2) {
            senderName = '小学弟';
        } else {
            senderName = '学弟学妹';
        }
        title = '有' + senderName + '找你买书';
        msg = '和你同是' + major + '专业的' + senderName + '正需要你可能有的书,把你带不走的书留给' + senderName + '吧';
        url = 'http://www.ishuxun.cn/wechat/#/book/used-book-list?cmd=nearNeed&majorFilter=' + major;
    } else if (startSchoolYear >= 2012) {//小鲜肉
        if (sex == 1) {
            senderName = '学姐';
        } else if (sex == 2) {
            senderName = '学长';
        } else {
            senderName = '学长学姐';
        }
        title = '有' + senderName + '有书要处理给你';
        msg = '和你同是' + major + '专业的即将毕业的' + senderName + '有很多带不走的书要处理,快来抢购你下学期的课本吧';
        url = 'http://www.ishuxun.cn/wechat/#/book/used-book-list?cmd=nearUsed&majorFilter=' + major;
    } else {
        return AV.Promise.as('不会发生给' + startSchoolYear + '年级的同学');
    }
    return WechatAPI.sendTemplateMsg(title, senderName, msg, url, openId);
};
