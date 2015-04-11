/**
 * Created by wuhaolin on 4/11/15.
 *
 */
"use strict";
var Request = require('request');

Request({
    method: 'GET',
    url: 'https://leancloud.cn/docs/images/permission.png',
    encoding: null
}, function (error, response, body) {
    if (error) {//去微信下载图片失败
        console.log(error);
    } else {
        console.log(body);
    }
});

