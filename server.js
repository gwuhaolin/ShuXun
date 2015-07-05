/**
 * Created by wuhaolin on 5/25/15.
 *
 */
"use strict";

var AV = require('leanengine');
var AppConfig = require('./config/config.js');
var APP_ID = process.env['LC_APP_ID'] || AppConfig.AV.applicationId;
var APP_KEY = process.env['LC_APP_KEY'] || AppConfig.AV.applicationKey;
var MASTER_KEY = process.env['LC_APP_MASTER_KEY'] || AppConfig.AV.masterKey;
AV.initialize(APP_ID, APP_KEY, MASTER_KEY);
AV.Cloud.useMasterKey();
var app = require('./server/app.js');//express
app.listen(parseInt(process.env['LC_APP_PORT'] || 3000));
