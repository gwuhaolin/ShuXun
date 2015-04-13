/**
 * Created by wuhaolin on 3/29/15.
 * LeanCloud 主执行文件
 */
//配置AVOS超级权限
AV._initialize('kusn9e3cp5znt5lic9fufqfmsvsibsoaejpah089x6v2n7e0', 'nt5l8v4n4m08zxttpt7upqxwgt6oy47lzb3f8c4juf34otfm', '6bc7zdxg90xi909pwtikora9uq2o2zvq402m2gfmb4w7tej2');
AV.Cloud.useMasterKey();

require('cloud/app.js');
require('cloud/cloudCode.js');