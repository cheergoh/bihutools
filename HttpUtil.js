/**
 * Created by cheergo on 2018/3/4.
 */

let request = require('request');
var zlib = require('zlib');
let headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.186 Safari/537.36',
    'Content-Type': 'text/plain;charset:utf-8',
    // 'Accept-Encoding': 'gzip',
    'from': 'ios',
    'token': 'e50cd7aeba99f0d66e19438ebcef8cd9422522a9'
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
        rejectUnauthorized: false,
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
        rejectUnauthorized: false,
        url: url,
        method: 'POST',
        json: true,
        form: params,
        headers: headers,
        timeout: 20000,
        encoding: null
    };
    request(options, function (error, response, body) {

        if(response.headers['content-encoding'] == 'gzip'){
            zlib.gunzip(body, function(err, dezipped) {
                console.log(err,dezipped.toString("utf-8"))
                callback(dezipped.toString("utf-8"));
            });
        } else {
            callback(body);
        }
        // console.log(error,content)
        // if (!error && response.statusCode == 200) {
        //     callback(error, response, content);
        // } else {
        //     console.log("request-postFrom-error: " + error + " url:" + url);
        //     callback(error);
        // }
    })
        // .pipe(zlib.createGunzip()) // unzip
        // .pipe(process.stdout); // do whatever you want with the stream;
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
};

exports.asyncPostForm = function (url, params) {
    headers.RequestStartTime = new Date().getTime();
    headers.cookie = this.cookie;
    let options = {
        rejectUnauthorized: false,
        url: url,
        method: 'POST',
        json: true,
        form: params,
        headers: headers,
        timeout: 3000
    };
    return new Promise(function (resolve, reject) {
        request(options, function (error, response, content) {
            console.log(error, content)
            if (!error && response != undefined && response.statusCode == 200) {
                resolve(content);
            } else {
                reject(error);
            }
        });
    }).then(function (content) {
        return {status: 200, content: content};
    }).catch(function (error) {
        return {status: 100, error: error, content: ''}
    })
};

/**
 * get请求
 * @param url 请求的url地址
 * @param callback 回调函数
 */
exports.asyncGet2 = function (url, param, callback) {
    console.log("request-get-url: " + url + ' params:' + JSON.stringify(param));
    let options = {
        method: 'GET',
        url: url,
        qs: param,
        headers: headers,
        json: true,
        timeout: 3000,
    };
    return new Promise(function (resolve, reject) {
        request(options, function (error, response, content) {
            if (!error && response.statusCode == 200) {
                resolve()
            } else {
                console.log("request-get-url-error: " + error + " url:" + url);
                callback(error);
            }
        });
    }).then(function (content) {
        return {status: 200, content: content};
    }).catch(function (error) {
        return {status: 100, error: error, content: ''}
    })
};
