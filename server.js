/**
 * Created by wuhaolin on 5/25/15.
 *
 */
"use strict";

var AV = require('leanengine');
var APP_ID = process.env['LC_APP_ID'] || 'kusn9e3cp5znt5lic9fufqfmsvsibsoaejpah089x6v2n7e0';
var APP_KEY = process.env['LC_APP_KEY'] || 'nt5l8v4n4m08zxttpt7upqxwgt6oy47lzb3f8c4juf34otfm';
var MASTER_KEY = process.env['LC_APP_MASTER_KEY'] || '6bc7zdxg90xi909pwtikora9uq2o2zvq402m2gfmb4w7tej2';
AV.initialize(APP_ID, APP_KEY, MASTER_KEY);
AV.Cloud.useMasterKey();
var app = require('./server/app.js');//express
app.listen(parseInt(process.env['LC_APP_PORT'] || 3000));
