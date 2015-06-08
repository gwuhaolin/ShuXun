/**
 * Created by wuhaolin on 6/7/15.
 */
var hbs = require('hbs');
var moment = require('moment');

/**
 * 把时间格式化为好看的字符串
 */
hbs.registerHelper('dateFormat', function (context, block) {
    var f = block.hash.format || "MMM Do, YYYY";
    return moment(context).format(f);
});