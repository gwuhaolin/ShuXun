/**
 * Created by wuhaolin on 7/3/15.
 */
"use strict";
var AV = require('leanengine');
var Model = require('../../web/js/model.js');

/**
 * 获得User表里对于unionID的用户
 * @param unionID
 * @return {AV.Promise} query.first()
 */
exports.getUserByUnionID = function (unionID) {
    var query = new AV.Query(Model.User);
    query.equalTo('username', unionID);
    return query.first();
};