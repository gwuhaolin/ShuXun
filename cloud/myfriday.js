/**
 * Created by wuhaolin on 4/2/15.
 * 从超级课程表获取全国大学信息
 */
"use strict";

//百度地图
var BaiDu = {
    AppID: 'D9748868fb527b49a546fa88932b8cd9'
};

var request = require('request');
var School = AV.Object.new('School');

request.post('http://course.myfriday.cn:80/V2/School/getNewSchoolList.action', function (err, res, body) {
    var schools_json = JSON.parse(body).data['updateList'];
    for (var i = 0; i < schools_json.length; i++) {
        var school_json = schools_json[i];
        //TODO object is not a function
        var school = new School();
        school.set('code', school_json['schoolId'], null);
        var name = school_json['name'];
        school.set('name', name, null);
        baiduGeocoding(name, function (location) {
            school.set('location', AV.GeoPoint({latitude: location['lng'], longitude: location['lat']}), null);
            school.save(null, function (data) {
                console.log(data);
            }, function (data, err) {
                console.log(err);
            });
        });
    }
});

function baiduGeocoding(address, callback) {
    request.get({
        url: 'http://api.map.baidu.com/geocoder/v2/',
        formData: {
            output: 'json',
            ak: BaiDu.AppID,
            address: address
        }
    }, function (err, res, body) {
        callback(body['location']);
    })
}