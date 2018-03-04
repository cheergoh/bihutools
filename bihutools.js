/**
 * Created by cheergo on 2018/3/4.
 */

const util = require('./util');
const logger = require('./Log4jsUtil');
const http = require('./HttpUtil');

let subuserid = 0;
let userid = 0;
let accesstoken = '';
let loginName = '';
let password = '';
let follwUrl = 'https://be.bihu.com:8102/bihube-pc/api/content/follow?userId=' + userid + '&accessToken=' + accesstoken + '&subjectUserId=';
let loginUrl = 'https://be.bihu.com:8102/bihube-pc/api/user/loginViaPassword?phone=' + loginName + '&password=';


function getlogininfo(password) {
    let cryptopwd = util.cryptopwd(password);
    http.post(loginUrl + cryptopwd, {}, function (error, res, content) {
        if (content.res == '1') {
            logger.info('accesstoken:' + content.data.accessToken + '\nuserId:' + content.data.userId);
        }
    });
}

function doloop(id) {
    setTimeout(function () {
        http.post(follwUrl + id, {}, function (error, res, content) {
            id = parseInt(id) + 1;
            if (error) {
                logger.error(id + '/' + error);
            } else {
                logger.info(id + '/' + content);
            }
            doloop(id);
        });
    }, 1000);
}

getlogininfo(password);

doloop(subuserid);

