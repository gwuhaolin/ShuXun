/**
 * Created by wuhaolin on 6/1/15.
 */
var assert = require('assert');
var lbs = require('../../server/util/lbs.js');

describe('util/lbs.js', function () {

    describe('#getLocationByIP', function () {
        it('获得经纬度', function (done) {
            lbs.getLocationByIP('220.249.101.83').done(function (location) {
                assert(location.latitude, 'latitude');
                assert(location.longitude, 'longitude');
                done();
            }).fail(function (err) {
                done(err);
            })
        });
    });

});


