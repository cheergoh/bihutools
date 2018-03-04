# bihutools

### 1.自动关注脚本
_将本段代码拷贝到支持jQuery的网页中执行或直接提取接口地址自行实现本段代码_
> userid 你的用户ID
> accesstoken 登录后可获得
> subuserid 你将关注的用户ID
```javascript 
var subuserid = 8559;
var userid = 0;
var accesstoken = "";
var followUrl = "https://be.bihu.com:8102/bihube-pc/api/content/follow?userId=" + userid + "&accessToken=" + accesstoken + "&subjectUserId=";

function loop(id) {
    setTimeout(function () {
        console.log('----------------')
        $.ajax({
            url: followUrl + id,
            timeout: 3000,
            success: function (data) {
                console.log(id, '====', data);
                id = parseInt(id) + 1;
                loop(id);
            },
            error: function (e) {
                console.error(e);
            }
        })
    }, 1000)
}
```
