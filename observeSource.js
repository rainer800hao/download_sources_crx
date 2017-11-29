// Copyright (c) 2017 Rainer800@163.com. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Send back to the eventPage the changed source URLs (image or audio) on this page.
// The eventPage injects this script into all frames in the active tab.

// 创建观察者对象
var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver
var LS_PREFIX_KEY = 'com.rainer800.crx.dsyy_';//本地存储的前缀
var BASE_DIR = 'dasiyingyu/';//本地下载路径的项目目录。根目录为chrome默认下载目录
var sep = 'upload/course/';//截取url，保留课程编号和文件名称，以课程编号为文件夹，根据url情况更改
var EXT_NAMES = ['mp3', 'jpg', 'jpeg'];//允许下载的文件类型列表
// 选择目标节点，用来统一侦听节点变化的父节点，根据页面情况更改
var target = document.querySelector('.mainlearn');
var soundEl = document.querySelector('.sound');//音频节点的父节点，根据页面情况更改

var observeHandler = function (mutations) {
    try {
        mutations.forEach(function (mutation) {
            if (['SPAN', 'EM', 'STRONG'].indexOf(mutation.target.tagName) > -1) return;
            // 处理音频
            if (mutation.target == soundEl) {
                filterSource(document.querySelector('#audio', soundEl).src);//与页面相关
                return;
            }
            // 处理图片
            var imgNode = mutation.target.childNodes[1] || {};//与页面相关
            var imageELS = document.querySelectorAll('.cImg');//与页面相关
            if (imgNode.tagName === 'IMG' && imageELS.indexOf(imgNode) > -1) {
                // console.log("图片地址：", imgNode.src);
                filterSource(imgNode.src);
                return;
            }
        });
    } catch (e) {
        console.log(e);
    }
}

var filterSource = function (src) {
    var filename = getFileName(src);
    var localKey = LS_PREFIX_KEY + "_SOURCES";
    var source_list = JSON.parse(window.sessionStorage.getItem(localKey)) || [];
    // console.log("source_list>>>", source_list, filename);
    var isDownload = source_list.indexOf(filename);
    // console.log(source_list.indexOf(filename));
    if (isDownload < 0) {
        source_list.push(filename);
        // console.log("new source list>>>", source_list);
        window.sessionStorage.setItem(localKey, JSON.stringify(source_list));
        chrome.extension.sendRequest({
            url           : src,
            filename      : BASE_DIR + filename,
            conflictAction: 'overwrite'
        });
    }
}

var getFileName = function (src) {
    var filename = undefined;
    var _filename = src.split(sep);
    var _extname = src.split('.');
    var extname = _extname[_extname.length - 1].toLowerCase();
    if (EXT_NAMES.indexOf(extname) > -1) {
        filename = decodeURIComponent(_filename[_filename.length - 1]);
    }
    return filename;
}

Object.prototype.indexOf = function(item) {
    var _this = this;
    var _index = -1;
    _this.forEach(function(_item, index){
        if (_item == item) {
            _index = index;
            return _index;
        }
    });
    return _index;
};


var observer = new MutationObserver(observeHandler);
// 配置观察选项:
var config = {subtree: true, childList: true}
// 传入目标节点和观察选项
target && observer.observe(target, config);
// 主动下载第一个音频
filterSource(document.querySelector('#audio', soundEl).src);