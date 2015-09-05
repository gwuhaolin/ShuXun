/**
 * Created by wuhaolin on 9/4/15.
 */

APP.service('SEO$', function () {
    var that = this;

    that.title = null;
    that.setTitle = function (meta) {
        that.title = _tran(meta) + ' 书循 ';
    };

    that.keywords = null;
    that.setKeywords = function (meta) {
        that.keywords = _tran(meta) + ' 书,便宜,循环,二手,转让,旧书,教材,课本,图书,大学,学生,简介,作者,书评,比价,书循,ishuxun';
    };

    that.description = null;
    that.setDescription = function (meta) {
        that.description = '便宜转让二手旧书 ' + _tran(meta);
    };

    that.setSEO = function (meta) {
        that.setTitle(meta);
        that.setKeywords(meta);
        that.setDescription(meta);
    };

    function _tran(meta) {
        var re = '';
        if (typeof meta === 'array') {
            AV._.each(meta, function (oneMeta) {
                var value = _tran(oneMeta);
                if (value) {
                    re += value + ' ';
                }
            })
        } else if (meta instanceof Model.BookInfo) {
            AV._.each(['title', 'author', 'publisher'], function (key) {
                var value = _tran(meta.attributes[key]);
                if (value) {
                    re += value + ',';
                }
            });
        } else if (meta instanceof Model.UsedBook) {
            AV._.each(['bookInfo', 'des'], function (key) {
                var value = _tran(meta.attributes[key]);
                if (value) {
                    re += value + ',';
                }
            });
        } else if (meta instanceof Model.User) {
            AV._.each(['major', 'school', 'nickName'], function (key) {
                var value = _tran(meta.attributes[key]);
                if (value) {
                    re += value + ',';
                }
            });
        } else if (meta instanceof AV.Object) {
            for (var key in meta.attributes) {
                var value = _tran(meta.attributes[key]);
                if (value) {
                    re += value + ',';
                }
            }
        } else if (typeof meta === 'object') {
            for (key in meta) {
                value = _tran(meta[key]);
                if (value) {
                    re += value + ',';
                }
            }
        } else if (typeof  meta === 'string') {
            value = meta.trim();
            re = value.length > 0 ? value : null;
        } else {
            re = null;
        }
        return re;
    }
});

