/**
 * Created by cheergo on 2018/3/4.
 */

//加载log4js
log4js = require("log4js");
let logconfig = require('../Test/logconfig.json');
log4js.configure(logconfig.config);
let logger = log4js.getLogger('service');

/**
 * 正常日志记录
 * @param message 日志内容
 */
exports.info = function (message) {
    console.log(message);
    logger.info(message);
};


/**
 * 调试日志记录
 * @param message 日志内容
 */
exports.debug = function (message) {
    console.log(message);
    logger.debug(message);
};


/**
 *
 * @param message 日志内容
 */
exports.trace = function (message) {
    console.log(message);
    logger.trace(message);
};


/**
 * 告警日志记录
 * @param message 日志内容
 */
exports.warn = function (message) {
    console.log(message);
    logger.warn(message);
};


/**
 * 错误日志记录
 * @param message 日志内容
 */
exports.error = function (message) {
    console.log(message);
    logger.error(message);
};

/**
 *
 * @param message
 */
exports.fatal = function (message) {
    console.log(message);
    logger.fatal(message);
};