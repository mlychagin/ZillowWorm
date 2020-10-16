
function clickNext(){
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {
            message: "Next"
        }, (response) => {
            console.log(response.message);
        });
    });
}

function scanPage(){
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {
            message: "Scan"
        }, (response) => {
          console.log(response.message);
        });
    });
}

function fetchPage(){
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {
            message: "Fetch Page"
        }, (response) => {
          console.log(response.message);
        });
    });
}

function download(){
    chrome.runtime.sendMessage({
        message: "Download"
    }, (response) => {
        console.log(response.message);
    });
}

function skipPage(){
    chrome.tabs.sendMessage({
        message: "Skip Page"
    }, (response) => {
        console.log(response.message);
    });
}

function clear(){
    chrome.tabs.sendMessage({
        message: "Clear"
    }, (response) => {
        console.log(response.message);
    });
}

function blank(){
    console.log("Blank");
}

window.onload = function() {
  document.getElementById('clickNext').onclick = clickNext;
  document.getElementById('fetchPage').onclick = fetchPage;
  document.getElementById('scanPage').onclick = scanPage;
  document.getElementById('skipPage').onclick = skipPage;
  document.getElementById('download').onclick = download;
  document.getElementById('clear').onclick = clear;
};
