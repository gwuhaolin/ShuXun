/**
 * Created by wuhaolin on 5/25/15.
 *
 */
"use strict";

var AV = require('leanengine');
var AVConfig = require('./config/global.json');
var APP_ID = process.env['LC_APP_ID'] || AVConfig.applicationId;
var APP_KEY = process.env['LC_APP_KEY'] || AVConfig.applicationKey;
var MASTER_KEY = process.env['LC_APP_MASTER_KEY'] || AVConfig.masterKey;
AV.initialize(APP_ID, APP_KEY, MASTER_KEY);
AV.Cloud.useMasterKey();
var app = require('./server/app.js');//express
app.listen(parseInt(process.env['LC_APP_PORT'] || 3000));
