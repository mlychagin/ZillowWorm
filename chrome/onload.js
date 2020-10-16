var links = [];
var data = [];

//Find Divs with Keyword + $ + /mo
function divsKeyword(keyword) {
    var divTags = document.getElementsByTagName("div");
    for (var i = 0; i < divTags.length; i++) {
        var text = divTags[i].textContent;
        if(text.includes(keyword) && text.length < 30){
            if(text.includes("$") && text.includes("/mo")){
                return text.substring(text.indexOf("$"));
            }
            if(text.includes("N/A")){
                return "$0";
            }
        }
    }
    return null;
}

//Save Important Information on Page
function saveImportantInfo(){
    //URL
    data.push(window.location.href);

    //Price
    var price = ([].slice.apply(document.getElementsByClassName("ds-value")))[0].innerText;
    data.push(price);

    //Address
    var address = ([].slice.apply(document.getElementsByClassName("ds-address-container")))[0].innerText;
    data.push(address);

    //Home Value
    var spanTags = document.getElementsByTagName("span");
    var zestimate;
    for (var i = 0; i < spanTags.length; i++) {
        var text = spanTags[i].textContent;
        if(text.includes("Zestimate") && text.includes("$")){
            zestimate = text.substring(text.indexOf("$"));
            break;
        }
    }
    data.push(zestimate);

    //Property Tax
    data.push(divsKeyword("Property taxes"));

    //Home Insurance
    data.push(divsKeyword("Home insurance"));

    //HOA
    data.push(divsKeyword("HOA fees"));

    //Rent Zestimate
    data.push(divsKeyword("Rent Zestimate"));
}

var links = [];
//Save Links on Page
function saveLinks(){
    var l = document.links;
    for(var i=0; i<l.length; i++) {
        var href = l[i].href;
        if(href.endsWith("_zpid/")){
            links.push(href);
        }
    }
}

function serializeLinks(){
    var result = "";
    if(links.length != 0){
        result += links[0];
    }
    for(var i=1; i<links.length; i++) {
        result += "@";
        result += links[i];
    }
    return result;
}

function processPage(){
    if(window.location.href.endsWith("_zpid/")){
        saveImportantInfo();
        chrome.runtime.sendMessage({
            message: "Data Page",
            url: data[0],
            price: data[1],
            address: data[2],
            zestimate: data[3],
            tax: data[4],
            insurance: data[5],
            hoa: data[6],
            rent: data[7]
        }, (response) => {
            console.log(response.message);
        });
        chrome.runtime.sendMessage({
            message: "Count"
        }, (response) => {
            console.log("Count : " + response.message);
        });
        return;
    }
    if(window.location.href.includes("searchQueryState")){
        console.log("SEARCH PAGE");
        saveLinks();
        var serialized = serializeLinks();
        var deserialized = serialized.split("@");
        chrome.runtime.sendMessage({
            message: "Search Page",
            urls: serialized
        }, (response) => {
            console.log("SENT : " + response.sent);
            console.log("TOTAL : " + response.total);
        });
    }
}

chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    if (request.message === "Next"){
        var element = document.querySelector('[title="Next page"]');
        if(element){
            element.click();
            sendResponse({message: "Clicked"});
        } else {
            sendResponse({message: "Done"});
        }
    }
    if (request.message === "Fetch Page"){
        chrome.runtime.sendMessage({
            message: "Get Page"
        }, (response) => {
            window.location.href = response.message;
            sendResponse({message: "Page Loaded"});
        });
    }
    if (request.message === "Scan"){
        processPage();
        sendResponse({message: links.length});
    }
});
