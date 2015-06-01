/**
 * Created by wuhaolin on 5/30/15.
 * Semantic-UI和AngularJS配置
 */

var APP = angular.module('APP', [], null);

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
    //分类菜单
    $('#menu').sidebar('setting', 'transition', 'overlay')
        .sidebar('setting', 'dimPage', false)
        .sidebar('toggle');
}
configSemantic();