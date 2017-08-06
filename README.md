[![书循](http://ishuxun.cn/img/logo-R.png)](http://ishuxun.cn)

[![Build Status](https://travis-ci.org/gwuhaolin/ShuXun.svg)](https://travis-ci.org/gwuhaolin/ShuXun)

# 书循－便捷的大学生二手书交易平台
- [主页ishuxun.cn](http://ishuxun.cn)
- 微信号 ishuxun

## Features
- 基于[LeanCloud](http://leancloud.cn) Bass服务搭建后端
- 微信端使用[ionic](http://ionicframework.com) 框架开发移动优先的HTML5网页

**依赖Nodejs** 在当前目录下依次执行命令
## Installation
```
npm install
```
## Build
```
gulp
```
## Run
```
npm start
```
## Test
```
npm test
```
## 发布
依赖 `avoscloud` 执行 `npm install -g avoscloud-code` 安装 `avoscloud`
```
 先发布到测试环境: avoscloud deploy
```
```
 再发布到正式环境: avoscloud publish
```
