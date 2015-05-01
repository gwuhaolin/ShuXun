/**
 * Created by wuhaolin on 5/1/15.
 *
 */
"use strict";
var LBS = require('cloud/lbs.js');
var Info = require('cloud/info.js');

AV.Cloud.afterSave('UsedBook', function (req, res) {
    var user = req.user;
    //设置二手书的地理位置
    var location = user.get('location');
    var point = new AV.GeoPoint(location);
    req.object.set('location', point);
    req.object.save();
    //设置用户的二手书的relations
    user.relation('usedBooks').add(req.object);
    user.save().done(function () {
        res.success();
    }).fail(function (err) {
        res.error(err);
    });
});
AV.Cloud.beforeDelete('UsedBook', function (req, res) {
    //把当前usedBook从主人的usedBooks属性中移除
    var user = req.user;
    user.relation('usedBooks').remove(req.object);
    user.save().done(function () {
        res.success();
    }).fail(function (err) {
        res.err(err);
    });
});


/**
 * 更新学校对象的经纬度
 * @param avosSchool 学校的名称
 */
function updateSchoolLocation(avosSchool) {
    var name = avosSchool.get('name');
    LBS.getSchoolLocation(name, function (location) {
        var point = new AV.GeoPoint(location.lat, location.lng);
        avosSchool.set('location', point);
        avosSchool.save();
    })
}
/**
 * 避免添加重名的学校
 */
AV.Cloud.beforeSave('School', function (req, res) {
    var avosSchool = req.object;
    var query = new AV.Query('School');
    query.equalTo('name', avosSchool.get('name'));
    query.count().done(function (number) {
        if (number > 0) {
            res.error('这个学校已经添加了');
        } else {
            res.success();
        }
    });
});
/**
 * 当添加了一个学校之后,会根据学校的名称自动调用百度API去获得这个学校的经纬度
 */
AV.Cloud.afterSave('School', function (req, res) {
    var avosSchool = req.object;
    updateSchoolLocation(avosSchool);
    res.success();
});
/**
 * 当更新了一个学校之后,会根据学校的名称自动调用百度API去获得这个学校的经纬度
 */
AV.Cloud.afterUpdate('School', function (req, res) {
    var avosSchool = req.object;
    updateSchoolLocation(avosSchool);
    res.success();
});
