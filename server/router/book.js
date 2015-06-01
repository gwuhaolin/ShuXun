/**
 * Created by wuhaolin on 6/1/15.
 */
var _ = require('underscore');
var express = require('express');

var router = express.Router();

router.get('/bookRecommend.html', function (req, res) {
    var re = {};
    re.meta = {
        title: '图书推荐',
        keywords: '',
        description: ''
    };
    res.render('book/bookRecommend.html', re);
});


module.exports = router;