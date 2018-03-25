/**
 * Created by cheergo on 2018/3/4.
 */

const util = require('./util');
const logger = require('./Log4jsUtil');
const http = require('./HttpUtil');
const _async = require('async');
var zlib = require('zlib');

let config = require('./config.json');
let api = require('./apis.json');
let fanslistArr = [];
let fansPageNum = 1;

function updateJsonConf() {
    let fs = require('fs');
    let file = "config.json";
    fs.writeFileSync(file, JSON.stringify(config));
}

function getlogininfo(callback) {
    if (config.accesstoken) {
        return callback(null)
    } else {
        let cryptopwd = util.cryptopwd(config.password);
        let param = {phone: config.loginName, password: cryptopwd};
        http.postForm(api.loginUrl, param, function (error, res, content) {
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
                callback('登录失败' + JSON.stringify(content));
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
        http.postForm(api.follwUrl, param, function (error, res, content) {
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
        http.postForm(api.hostlistUrl, {pageNum: pageNum}, function (error, res, content) {
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

function fansList(callback) {
    var param = {
        userId: config.userid,
        accessToken: config.accesstoken,
        queryUserId: config.userid,
        pageNum: fansPageNum
    };
    http.postForm(api.fanslistUrl, param, function (error, response, content) {
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
    let result = await http.asyncPostForm(api.unfollowUrl, param);
    logger.info('取关此人：' + subid + ',' + JSON.stringify(result.content))
}

function myfollow(pageNum) {
    let param = {
        userId: config.userid,
        accessToken: config.accesstoken,
        queryUserId: config.userid,
        pageNum: pageNum
    }
    http.postForm(api.myfollowUrl, param, async function (error, res, content) {
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
