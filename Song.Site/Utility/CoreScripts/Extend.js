﻿//两端去空格函数
String.prototype.trim = function () { return this.replace(/(^\s*)|(\s*$)/g, ""); }
// 记录cookie
jQuery.cookie = function (name, value, options) {
    if (typeof value != 'undefined') { // name and value given, set cookie 
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE 
        }
        var path = options.path ? '; path=' + options.path : '; path=/';
        var domain = options.domain ? '; domain=' + options.domain : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else { // only name given, get cookie 
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want? 
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};
jQuery.fn.cookie = function (name, value, options) {
    return $.cookie(name, value, options);
}
jQuery.storage = function (key, value) {
    var isAndroid = (/android/gi).test(navigator.appVersion);
    var uzStorage = function () {
        var ls = window.localStorage;
        if (isAndroid) {
            ls = window.localStorage;
        }
        return ls;
    };
    //如果只有一个参数，为读取
    if (arguments.length === 1) {
        var ls = uzStorage();
        if (ls) {
            var v = ls.getItem(key);
            if (!v) { return; }
            if (v.indexOf('obj-') === 0) {
                v = v.slice(4);
                return JSON.parse(v);
            } else if (v.indexOf('str-') === 0) {
                return v.slice(4);
            }
        }
    }
    //如果两个参数，为写入，第一个为键，第二个为值
    if (arguments.length === 2) {
        if (value != null) {
            var v = value;
            if (typeof v == 'object') {
                v = JSON.stringify(v);
                v = 'obj-' + v;
            } else {
                v = 'str-' + v;
            }
            var ls = uzStorage();
            if (ls) {
                ls.setItem(key, v);
            }
        } else {
            var ls = uzStorage();
            if (ls && key) {
                ls.removeItem(key);
            }
        }
    }
}
//记录页面级cookie
jQuery.fn.pagecookie = function (name, value, options) {
    //标页面的名称，不含后缀名
    var url = String(window.document.location.href);
    var pos = url.lastIndexOf("/");
    if (pos == -1) {
        pos = url.lastIndexOf("\\")
    }
    var filename = url.substr(pos + 1);
    filename = filename.substr(0, filename.indexOf("."))
    //页面级cookie名称
    name = "(" + filename + ")" + name;
    if (typeof value != 'undefined') {
        $().cookie(name, value, options);
    } else {
        return $().cookie(name);
    }
}
//打开模式窗口
jQuery.fn.ModalWindow = function (page, width, height) {
    //屏幕宽高
    var winWidth = window.screen.width;
    var winHeight = window.screen.height;
    //如果为空，则为浏览器窗口一半宽高
    width = width != null && width != 0 && width != "" ? Number(width) : winWidth / 2;
    height = height != null && height != 0 && height != "" ? Number(height) : winHeight / 2;
    //如果宽高小于100，则默认为浏览器窗口的百分比
    width = width > 100 ? Number(width) : winWidth * Number(width) / 100;
    height = height > 100 ? Number(height) : winHeight * Number(height) / 100;
    //窗口位置，使其显示在屏幕中央
    var left = (winWidth - width) / 2;
    var top = (winHeight - height) / 2;
    var arr = showModalDialog(page, "", "dialogWidth:" + width + "px; dialogHeight:" + height + "px; dialogTop=" + top + "; dialogLeft=" + left + ";status:0;scroll:0;help:0");
    var url = window.location.href;
    if (arr == "refresh") window.location.href = url;
}
//获取当前鼠标坐标
jQuery.fn.Mouse = function (e) {
    var x = 0, y = 0;
    var e = e || window.event;
    if (e.pageX || e.pageY) {
        x = e.pageX;
        y = e.pageY;
    } else if (e.clientX || e.clientY) {
        x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    return { 'x': x, 'y': y };
};
//判断鼠标是否处于某元素之个
//element:页面元素，jquery对象
//return:返回bool值，如果处在元素之前返回true,否则返回false;
jQuery.fn.isMouseArea = function (element, e) {
    if (element.length < 1) return false;
    var mouse = $().Mouse(e);
    var tmp = false;
    element.each(
        function () {
            var offset = $(this).offset();
            var pxx = mouse.x > offset.left && mouse.x < (offset.left + $(this).width());
            var pyy = mouse.y > offset.top && mouse.y < (offset.top + $(this).height());
            tmp = pxx && pyy;
            if (tmp) return false;
        }
    );
    return tmp;
};
//获取文件大小，带单位，如kb,mb；
//参数：size文件字节数
jQuery.fn.getSizeUnit = function (fileSize) {
    var size = Number(fileSize);
    if (size == null) return;
    var name = new Array("B", "Kb", "Mb");
    var tm = 0;
    while (size >= 1024) {
        size /= 1024;
        tm++;
    }
    size = Math.round(size * 100) / 100;
    return size + " " + name[tm];
}
//加入收藏
jQuery.fn.addFav = function (title) {
    var url = window.location.href;
    if (document.all) {
        window.external.addFavorite(url, title);
        return true;
    }
    else if (window.sidebar) {
        window.sidebar.addPanel(title, url, "");
        return true;
    }
    //未成功
    return false;
}
//获取QueryString参数
jQuery.fn.getPara = function (url, key) {
    //将参数转换成数组格式
    function getParas(url) {
        if (url.indexOf("?") > -1) url = url.substring(url.lastIndexOf("?") + 1);
        var tm = url.split('&');
        var paras = new Array();    //要返回的数组
        for (var i = 0; i < tm.length; i++) {
            var arr = tm[i].split('=');
            if (arr.length < 2) continue;
            paras.push({ key: arr[0].toLowerCase(), value: arr[1] });
        }
        return paras;
    }
    if (arguments.length == 0) return getParas(String(window.document.location.href));
    if (arguments.length == 1) {
        key = arguments[0];
        url = String(window.document.location.href);
    }
    var arr = getParas(url);
    var value = "";
    for (var i = 0; i < arr.length; i++) {
        if (key.toLowerCase() == arr[i].key) {
            value = arr[i].value;
            break;
        }
    }
    if (value.indexOf("#") > -1) value = value.substring(0, value.indexOf("#"));
    return value; s
}

//添加链接地址的参数
//url:超链接
//key:参数的名称
//value:参数的值
jQuery.fn.setPara = function (url, key, value) {
    if (isNull(url) || isNull(key)) return url; //如果网址或参数名为空，则返回
    //如果没有参数，直接添加
    if (url.indexOf("?") < 0) return url + "?" + key + "=" + value;
    //如果已经有参数
    var paras = getParas(url);
    paras = setPara(paras, key, value);
    url = url.substring(0, url.lastIndexOf("?"));
    return url + "?" + stringPara(paras);
    function isNull(data) {
        return (data == "" || data == undefined || data == null) ? true : false;
    }
    //将参数转换成数组格式
    function getParas(url) {
        if (url.indexOf("?") > -1) url = url.substring(url.lastIndexOf("?") + 1);
        var tm = url.split('&');
        var paras = new Array();    //要返回的数组
        for (var i = 0; i < tm.length; i++) {
            var arr = tm[i].split('=');
            if (arr.length < 2) continue;
            paras.push({ key: arr[0].toLowerCase(), value: arr[1] });
        }
        return paras;
    }
    //设置参数，如果不存在则添加
    function setPara(paras, key, value) {
        var isexist = false;
        for (var i = 0; i < paras.length; i++) {
            if (paras[i].key == key.toLowerCase()) {
                isexist = true;
                paras[i].value = value;
                break;
            }
        }
        if (!isexist) paras.push({ key: key, value: value });
        return paras;
    }
    //将数组的参数转换为url参数格式
    function stringPara(paras) {
        var str = "";
        for (var i = 0; i < paras.length; i++) {
            if (paras[i].value == null) continue;
            str += paras[i].key + "=" + paras[i].value + "&";
        }
        if (str.length > 0) {
            if (str.charAt(str.length - 1) == "&") {
                str = str.substring(0, str.length - 1)
            }
        }
        return str;
    }
}
//获取文件名
jQuery.fn.getFileName = function () {
    var url = String(window.document.location.href);
    var pos = url.lastIndexOf("/");
    if (pos == -1) {
        pos = url.lastIndexOf("\\")
    }
    var filename = url.substr(pos + 1);
    filename = filename.substr(0, filename.indexOf("."))
    return filename;
};
//获取根路径
jQuery.fn.getHostPath = function () {
    var url = window.location.href;
    var pathName = window.document.location.pathname;
    var localhostPath = url.substring(0, url.indexOf(pathName) + 1);
    return localhostPath;
};
//在线浏览pdf文件
jQuery.fn.PdfViewer = function (file) {
    var viewer = "/Utility/PdfViewer/viewer.html";
    if (file.indexOf("?") > -1) file = file.substring(0, file.indexOf("?"));
    viewer += "?file=" + encodeURIComponent(file);
    //window.location.href = viewer;
    return viewer;
}
//格式化日期
Date.prototype.ToString = function () {
    var year = this.getFullYear();
    var month = this.getMonth() + 1;
    var date = this.getDate();
    //
    var hour = this.getHours();
    var minu = this.getMinutes();
    var sec = this.getSeconds();
    //
    var str = year + "/" + month + "/" + date + " " + hour + ":" + minu + ":" + sec;
    return str;
}
Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
//将时间转换为指定的时区
Date.prototype.toLocal = function (timezone) {
    //本地时间与格林威治时间的时间差，单位为小时
    var gmtHours = -new Date().getTimezoneOffset() / 60;
    if (typeof (timezone) != "number") timezone = Number(timezone);
    var minutes = (timezone - gmtHours) * 60;
    var local = this;
    local.setMinutes(local.getMinutes() - minutes);

    return local;
}
String.prototype.format = function (args) {
    if (arguments.length < 1) return this;
    var primary = this;
    for (var i = 0; i < arguments.length; i++) {
        primary = primary.replace(eval('/\\{' + i + '\\}/g'), arguments[i]);
    }
    return primary;
}
//获取信息
//service:webservice请求页
//sfunc:webservice服务中的方法
//para:参数
//successFunc:调取成功后的方法
jQuery.fn.SoapAjax = function (service, sfunc, para, successFunc, loadfunc, unloadfunc, errfunc) {
    var urlPath = "/manage/soap/" + service + ".asmx/" + sfunc;
    $.ajax({
        type: "POST",
        url: urlPath,
        dataType: "xml",
        data: para,
        //开始，进行预载
        beforeSend: function (XMLHttpRequest, textStatus) {
            if (loadfunc != null) loadfunc(XMLHttpRequest, textStatus);
        },
        //加载出错
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            if (errfunc != null) errfunc(XMLHttpRequest, textStatus, errorThrown);
            if (unloadfunc != null) unloadfunc();
        },
        //加载成功！
        success: function (data) {
            if (successFunc != null) successFunc($(data));
            if (unloadfunc != null) unloadfunc();
        }
    });
}
//网页是否处于微信内置浏览器
jQuery.fn.isWeixin = function () {
    var ua = window.navigator.userAgent.toLowerCase();
    return ua.match(/MicroMessenger/i) == 'micromessenger';
}
//网页是否处于微信小程序内置浏览器
jQuery.fn.isWeixinApp = function () {
    var ua = window.navigator.userAgent.toLowerCase();
    return ua.match(/miniProgram/i) == 'miniprogram';
}
//加载css
jQuery.fn.loadcss = function (url, callback) {
    var head = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = url;
    head.appendChild(link);
}