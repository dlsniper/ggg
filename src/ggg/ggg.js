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

var options;

var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        if (mutation.attributeName === "class") {
            var attributeValue = $(mutation.target).prop(mutation.attributeName);
            if (attributeValue === 'pjax-loader-bar') ggg();
        }
    });
});
observer.observe($("div#js-pjax-loader-bar")[0], {
    attributes: true
});

function ggg() {
    if ($("div.btn.btn-sm.ggg-btn").length > 0) return;

    $("span[itemprop='keywords'].language-color").each(function () {
        if ($(this).text() !== 'Go') return;

        $("div.select-menu-modal-holder.dropdown-menu-content.js-menu-content")
            .after("<div class='btn btn-sm ggg-btn'><div class='ggg-gopher'></div></div>");

        $("div.ggg-btn").click(function (event) {
            var pkg = "github.com" + window.location.pathname.replace(/\/$/, "");
            var location = "";

            if (event.ctrlKey) {
                location = "https://godoc.org/" + pkg;
            }


            if (event.altKey) {
                location = "https://goreportcard.com/report/" + pkg;
            }

            if (event.shiftKey) {
                location = "https://sourcegraph.com/" + pkg;

            }

            if (location !== "") {
                if (options.newWindow) {
                    window.open(location);
                } else {
                    window.location = location;
                }
            }

            var fetchOptions = "";
            if (options.fetchUpdate) fetchOptions += "--u";
            if (options.fetchVerbose) fetchOptions += "--v";
            if (options.fetchTest) fetchOptions += "--t";


            if (options.fetchSubPackages) pkg += "/...";
            copyToClipboard("go get" + fetchOptions.replace(/--/g, " -") + " " + pkg);
        });
    });
}


var init = function () {
    embedJS('src/jquery/jquery-2.2.4.min.js');
    embedCSS('src/css/ggg.css');

    chrome.storage.sync.get({
        fetchUpdate: true,
        fetchVerbose: false,
        fetchTest: false,
        fetchSubPackages: false,
        newWindow: false
    }, function (items) {
        options = items;
    });

    chrome.storage.onChanged.addListener(function (changes, namespace) {
        for (var key in changes) {
            var storageChange = changes[key];
            options[key] = storageChange.newValue;
        }
    });

    $(document).ready(function () {
        ggg();
    });
};

onDOMReady(init);

function copyToClipboard(text) {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val(text).select();
    document.execCommand("copy");
    $temp.remove();
}


function onDOMReady(block) {
    chrome.extension.sendMessage({}, function () {
        var readyStateCheckInterval = setInterval(function () {
            if (document.readyState !== "complete") return;
            clearInterval(readyStateCheckInterval);
            if (block != undefined) block();
        });
    });
}

function embedJS(filename, onload) {
    var embeddedScript = document.createElement('script');
    embeddedScript.src = chrome.extension.getURL(filename);
    embeddedScript.onload = function () {
        this.parentNode.removeChild(this);
        if (onload != undefined) onload();
    };

    (document.head || document.documentElement).appendChild(embeddedScript);
}

function embedCSS(filename) {
    var embeddedStylesheet = document.createElement('link');
    embeddedStylesheet.rel = "stylesheet";
    embeddedStylesheet.type = "text/css";
    embeddedStylesheet.href = chrome.extension.getURL(filename);
    embeddedStylesheet.onload = function () {
    };
    (document.head || document.documentElement).appendChild(embeddedStylesheet);
}