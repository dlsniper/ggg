// Copyright 2016 Florin Pățan
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//  http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
"use strict";

function save_options() {
    chrome.storage.sync.set({
        fetchUpdate: document.getElementById('update').checked,
        fetchVerbose: document.getElementById('verbose').checked,
        fetchTest: document.getElementById('test').checked,
        fetchSubPackages: document.getElementById('subpackages').checked,
        newWindow: document.getElementById('newWindow').checked
    }, function () {
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function () {
            status.textContent = '';
        }, 750);
    });
}

function restore_options() {
    chrome.storage.sync.get({
        fetchUpdate: true,
        fetchVerbose: false,
        fetchTest: false,
        fetchSubPackages: false
    }, function (items) {
        document.getElementById('update').checked = items.fetchUpdate;
        document.getElementById('verbose').checked = items.fetchVerbose;
        document.getElementById('test').checked = items.fetchTest;
        document.getElementById('subpackages').checked = items.fetchSubPackages;
        document.getElementById('newWindow').checked = items.newWindow;
    });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);