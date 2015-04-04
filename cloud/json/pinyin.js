/**
 * Created by wuhaolin on 4/4/15.
 * 汉字转拼音
 */
"use strict";

//在我MacBook上安装的pinyin
var py = require('/usr/local/lib/node_modules/pinyin/');
var fs = require('fs');

/**
 * 读取filePath里的json ,json里是一个数组,数组里的每个对象有个name属性,读取name属性生成拼音的第一个字母变成正则表达式,再写到pinyin属性
 * @param filePath
 */
function genPinyinReg(filePath) {
    var array = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    for (var i = 0; i < array.length; i++) {
        var oneMajor = array[i];
        var name = oneMajor.name;
        var pinyin = py(name, {
            style: py.STYLE_FIRST_LETTER
        });
        var pinyinReg = '^';
        for (var j = 0; j < pinyin.length; j++) {
            pinyinReg += pinyin[j] + '[a-zA-Z]*';
        }
        pinyinReg += '$';
        oneMajor['pinyin'] = pinyinReg;
    }
    fs.writeFile(filePath, JSON.stringify(array, null, 4));
}

genPinyinReg('major.json');
genPinyinReg('school.json');