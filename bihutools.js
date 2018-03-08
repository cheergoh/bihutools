/**
 * Created by cheergo on 2018/3/4.
 */

const util = require('./util');
const logger = require('./Log4jsUtil');
const http = require('./HttpUtil');
const _async = require('async');

let config = require('./config.json');
let follwUrl = 'https://be02.bihu.com/bihube-pc/api/content/follow';
let loginUrl = 'https://be02.bihu.com/bihube-pc/api/user/loginViaPassword';
let hostlistUrl = 'https://be02.bihu.com/bihube-pc/api/content/show/hotArtList';
let fanslistUrl = 'https://be03.bihu.com/bihube-pc/api/content/show/getUserFansList';
let unfollowUrl = 'https://be03.bihu.com/bihube-pc/api/content/unFollow';
let myfollowUrl = 'https://be02.bihu.com/bihube-pc/api/content/show/getUserFollowList';


function updateJsonConf() {
    let fs = require('fs');
    let file = "config.json";
    // var result = JSON.parse(fs.readFileSync(file));
    // console.log(result);
    // config.subuserid = "---";
    fs.writeFileSync(file, JSON.stringify(config));
}

function getlogininfo(callback) {
    if (config.accesstoken) {
        return callback(null)
    } else {
        let cryptopwd = util.cryptopwd(config.password);
        let param = {phone: config.loginName, password: cryptopwd};
        http.postForm(loginUrl, param, function (error, res, content) {
            if (error) {
                logger.error(error);
                logger.error('=========登录发生异常===========');
                callback('登录失败');
                process.exit(0);
            } else if (content && content.res == '1') {
                config.accesstoken = content.data.accessToken;
                config.userid = content.data.userId;
                updateJsonConf();
                logger.info('accesstoken:' + content.data.accessToken + '\nuserId:' + content.data.userId);
                callback(null)
            } else {
                callback('登录失败');
                logger.info('=========登录失败===========');
            }
        });
    }
}

function doloop(subid) {
    var param = {
        userId: config.userid,
        accessToken: config.accesstoken,
        subjectUserId: config.lastfollowid
    };
    setTimeout(function () {
        http.postForm(follwUrl, param, function (error, res, content) {
            subid = parseInt(id) + 1;
            if (error) {
                logger.error(subid + '/' + error);
            } else {
                logger.info(subid + '/' + content);
            }
            config.lastfollowid = subid;
            updateJsonConf();
            doloop(subid);
        });
    }, 1000);
}

function hotlist(pageNum) {
    setTimeout(function () {
        http.postForm(hostlistUrl, {pageNum: pageNum}, function (error, res, content) {
            pageNum = parseInt(pageNum) + 1;
            if (error) {
                logger.error(pageNum + '/' + error);
            } else {
                // logger.info(pageNum + '/' + JSON.stringify(content));
                let data = content.data.list;
                for (let i = 0; i < data.length; i++) {
                    console.log(data[i].userId, data[i].title);
                }
            }
            hotlist(pageNum);
        });
    }, 1000);
}

let fanslistArr = [];
let fansPageNum = 1;

function fansList(callback) {
    var param = {
        userId: config.userid,
        accessToken: config.accesstoken,
        queryUserId: config.userid,
        pageNum: fansPageNum
    };
    http.postForm(fanslistUrl, param, function (error, response, content) {
        if (content && content.res == '1') {
            for (var i = 0; i < content.data.list.length; i++) {
                logger.info(content.data.list[i]['userName'] + '|' + content.data.list[i]['userId'] + '|' + content.data.list[i]['follows'] + '|' + content.data.list[i]['follow']);
                fanslistArr.push({
                    username: content.data.list[i]['userName'],
                    userid: content.data.list[i]['userId'],
                    follows: content.data.list[i]['follows']
                });
            }
            let isLastPage = content.data.isLastPage;
            if (isLastPage) {
                logger.info('---------------------------------------------END------------------------------------------------------');
                logger.info(JSON.stringify(fanslistArr));
                logger.info('---------------------------------------------END------------------------------------------------------');
                // process.exit(0);
                return callback(null)
            }
            ++fansPageNum
            return fansList(callback);
        }
    })
}

async function unfollow(subid) {
    var param = {
        userId: config.userid,
        accessToken: config.accesstoken,
        subjectUserId: subid
    };
    let result = await http.asyncPostForm(unfollowUrl, param);
    logger.info('取关此人：' + subid + ',' + JSON.stringify(result.content))
}

// getlogininfo(password);

// doloop(subuserid);

// hotlist(1);
// fansList(1);
// unfollow(8193);

function myfollow(pageNum) {
    let param = {
        userId: config.userid,
        accessToken: config.accesstoken,
        queryUserId: config.userid,
        pageNum: pageNum
    }
    http.postForm(myfollowUrl, param, async function (error, res, content) {
        logger.info(JSON.stringify(content));
        for (let i = 0; i < content.data.list.length; i++) {
            let flag = true;
            for (let j = 0; j < fanslistArr.length; j++) {
                if (content.data.list[i].userId == fanslistArr[j].userid) {
                    flag = false;
                }
            }
            if (flag) {
                await unfollow(content.data.list[i]['userId']);
            }
        }
        if (content.data.isLastPage) {
            process.exit(0);
        } else {
            myfollow(++pageNum);
        }
    });
}

_async.series([getlogininfo, fansList], function (error, content) {
    myfollow(1);
});

