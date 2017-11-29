// Copyright (c) 2017 Rainer800@163.com. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// This extension download the specify images and audios from dasiyinyug.com

//监听图片和音频变化

//popup中操作开始和停止

//限定特定domain或者url才能开始

// Set up event handlers
var downloadSourc = function (obj) {
    chrome.downloads.download(obj, function (id) {
    });
}

chrome.extension.onRequest.addListener(downloadSourc);
