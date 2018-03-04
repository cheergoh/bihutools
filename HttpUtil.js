/**
 * Created by cheergo on 2018/3/4.
 */

let request = require('request');
let headers = {
    'Content-Type': 'application/json'
};

/**
 * get请求
 * @param url 请求的url地址
 * @param callback 回调函数
 */
exports.get = function (url, callback) {

    let options = {
        url: url,
        method: 'GET',
        headers: headers,
        json: true,
        timeout: 10000
    };
    request(options, function (error, response, content) {
        if (!error && response.statusCode == 200) {
            callback(error, response, content);
        } else {
            callback(error);
        }
    });
};

/**
 * get请求
 * @param url 请求的url地址
 * @param callback 回调函数
 */
exports.get2 = function (url, param, callback) {
    console.log("request-get-url: " + url + ' params:' + JSON.stringify(param));
    let options = {
        method: 'GET',
        url: url,
        qs: param,
        headers: headers,
        json: true,
        timeout: 10000,
        Cookie: "p_uin=o845832967;p_skey=-A6IGHfik6Qpwl6NcFfRrDibSXUkP--Te7BmbDE6jPo_"
    };
    request(options, function (error, response, content) {
        if (!error && response.statusCode == 200) {
            callback(error, response, content);
        } else {
            console.log("request-get-url-error: " + error + " url:" + url);
            callback(error);
        }
    });
};

/**
 * post 请求
 * @param url url地址
 * @param params 请求参数
 * @param callback 回调函数
 */
exports.post = function (url, params, callback) {
    let options = {
        url: url,
        method: 'POST',
        json: true,
        body: params,
        headers: headers,
        timeout: 3000
    };
    console.log("request-post-url: " + url + ",request-post-params: " + JSON.stringify(params));

    request(options, function (error, response, content) {
        if (!error && response.statusCode == 200) {
            callback(error, response, content);
        } else {
            console.log("request-post-error: " + error + " url:" + url);
            callback(error);
        }
    });
};

/**
 * POST表单提交
 * @param url
 * @param params
 * @param callback
 */
exports.postForm = function (url, params, callback) {
    console.log("request-postFrom-url: " + url + " request-postFrom-params: " + JSON.stringify(params));

    let options = {
        url: url,
        method: 'POST',
        json: true,
        form: params,
        headers: headers,
        timeout: 20000
    };
    request(options, function (error, response, content) {
        if (!error && response.statusCode == 200) {
            callback(error, response, content);
        } else {
            console.log("request-postFrom-error: " + error + " url:" + url);
            callback(error);
        }
    });
};

/**
 *
 * @param url
 * @param params
 * @param callback
 */
exports.postUrlEncode = function (url, params, callback) {
    let options = {
        method: 'POST',
        url: url,
        qs: params,
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
        }
    };

    request(options, function (error, response, content) {
        if (!error && response.statusCode == 200) {
            callback(error, response, content);
        } else {
            console.error("request-postUrlEncode-error: " + error + " url:" + url);
            callback(error);
        }
    });
}

