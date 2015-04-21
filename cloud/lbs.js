/**
 * Created by wuhaolin on 4/5/15.
 * LBS服务
 */
"use strict";

//百度地图
var BaiDu = {
    AppID: 'D9748868fb527b49a546fa88932b8cd9'
};
var request = require('request');

/**
 * 通过用户的IP地址获取用户的经纬度
 * @param request express请求
 * @param onSuccess
 * @param onError
 */
exports.getLocationByIP = function (request, onSuccess, onError) {
    var ip = request.headers['x-real-ip'];
    request.get({
        url: 'http://api.map.baidu.com/location/ip',
        qs: {
            ak: BaiDu.AppID,
            ip: ip,
            coor: 'bd09ll'
        }
    }, function (err, res, body) {
        if (err) {
            onError(err);
        } else {
            var json = JSON.parse(body);
            if (json.status == 0) {
                var point = json['point'];
                onSuccess({
                    lng: point.x,
                    lat: point.y
                });
            } else {
                onError(json);
            }
        }
    })
};

/**
 * 获得学校的地理经纬度
 * @param schoolName 学校的名称
 * @param onSuccess 返回
 *          {
				lat : 30.522385,
				lng : 114.369487
			}
 * @param onError 返回错误原因
 */
exports.getSchoolLocation = function (schoolName, onSuccess, onError) {
    request.get({
        url: 'http://api.map.baidu.com/place/v2/search',
        qs: {
            ak: BaiDu.AppID,
            query: schoolName,
            scope: 1,
            page_size: 1,
            page_num: 0,
            region: '全国',
            output: 'json'
        }
    }, function (err, res, body) {
        if (err) {
            onError(err);
        } else {
            var json = JSON.parse(body);
            if (json.status == 0) {
                var location = json.results[0].location;
                onSuccess(location);
            } else {
                onError(json);
            }
        }
    })
};
