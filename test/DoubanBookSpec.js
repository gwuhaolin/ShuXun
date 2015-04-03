/**
 * Created by wuhaolin on 3/25/15.
 *
 */
"use strict";

describe('DoubanBook', function () {
    var doubanBookService;
    beforeEach(function () {
        angular.mock.module('DoubanBook');
        angular.mock.inject(function (DoubanBookService) {
            doubanBookService = DoubanBookService;
        });
    });

});