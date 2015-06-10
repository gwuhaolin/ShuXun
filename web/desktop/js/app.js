/**
 * Created by wuhaolin on 5/30/15.
 * 全局函数 Semantic-UI和AngularJS配置
 */

/**
 * 从URL Query里获得参数
 * @param name 参数名称
 * @returns {string}
 */
function getQueryParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var APP = angular.module('APP', [], null);
APP.run(function (User$) {
    User$.loginWithUnionId(readCookie('unionId'));
});

/**
 * Semantic-UI配置
 */
function configSemantic() {
    //下拉菜单
    $('.ui.dropdown').dropdown();
    //图书搜索框
    $('.ui.search').search({
        type: 'category'
    });
    //图书popup出版信息
    $('.hasPubInfoPopupBook').popup({
        inline: true
    });
    //配置顶部搜索框
    $('#topSearchInputCon').popup({
        inline: true,
        on: 'click'
    });
    //星星
    $('.ui.rating').rating();
}
setInterval(configSemantic, 1000);