/**
 * Created by wuhaolin on 9/4/15.
 */

APP.service('SEO$', function () {
    var that = this;

    that.title = '';
    that.setTitle = function (meta) {
        that.title = _tran(meta) + ' 书循 ';
    };

    that.keywords = '';
    that.setKeywords = function (meta) {
        that.keywords = _tran(meta) + ' 书,便宜,循环,二手,旧书,教材,课本,图书,大学,学生,简介,作者,书评,比价,书循,ishuxun';
    };

    that.description = '';
    that.setDescription = function (meta) {
        that.description = '便宜 转让 二手 旧书 ' + _tran(meta);
    };

    that.setSEO = function (meta) {
        that.setTitle(meta);
        that.setKeywords(meta);
        that.setDescription(meta);
    };
    that.setSEO();

    function _tran(meta) {
        var re = '';
        if (typeof meta === 'array') {
            AV._.each(meta, function (oneMeta) {
                if (oneMeta) {
                    re += _tran(oneMeta) + ' ';
                }
            })
        } else if (meta instanceof Model.BookInfo) {
            AV._.each(['title', 'author', 'publisher'], function (key) {
                var value = meta.attributes[key];
                if (value) {
                    re += _tran(value) + ',';
                }
            });
        } else if (meta instanceof Model.UsedBook) {
            AV._.each(['price', 'des'], function (key) {
                var value = meta.attributes[key];
                if (value) {
                    re += _tran(value) + ',';
                }
            });
        } else if (meta instanceof Model.User) {
            AV._.each(['major', 'school', 'nickName'], function (key) {
                var value = meta.attributes[key];
                if (value) {
                    re += _tran(value) + ',';
                }
            });
        } else if (meta instanceof AV.Object) {
            for (var key in meta.attributes) {
                var value = meta.attributes[key];
                if (value) {
                    re += _tran(value) + ',';
                }
            }
        } else if (typeof meta === 'object') {
            for (key in meta) {
                value = meta[key];
                if (value) {
                    re += _tran(value) + ',';
                }
            }
        } else if (typeof  meta === 'string') {
            re = meta.trim();
        }
        return re;
    }
});

