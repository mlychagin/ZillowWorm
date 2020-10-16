var links = new Set();
var seenLinks = new Set();

var url = [];
var price = [];
var address = [];
var zestimate = [];
var tax = [];
var insurance = [];
var hoa = [];
var rent = [];

var saveData = (function () {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    return function (data, fileName) {
        var json = processData(),
            blob = new Blob([json], {type: "octet/stream"}),
            url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
    };
}());

function processData(){
    var result = "";
    result += "\"URL\",";
    result += "\"Address\",";
    result += "\"Asking Price\",";
    result += "\"Downpayment\",";
    result += "\"Loan Amount\",";
    result += "\"Home Value\",";
    result += "\"P&I/month\",";
    result += "\"Taxes/month\",";
    result += "\"Insurance/month\",";
    result += "\"HOA/month\",";
    result += "\"Total Monthly\",";
    result += "\"Rental Value\",";
    result += "\"Rental Value - Property Management\",";
    result += "\"Monthly Cashflow\",";
    result += "\"Annual Cash/Cash ROI\",";
    result += "\"Annual Equity Value\",";
    result += "\"Tax Deduction Value\",";
    result += "\"Total ROI + Equity + Tax Deductions\",";
    result += "\"Annual Average Appreciation\",";
    result += "\"Total Potential ROI\"\n"

    var numSkips = 0;
    for(var i=0; i<url.length; i++) {
        var row  = i + 2 - numSkips;

        var url1;
        var price1;
        var address1;
        var tax1;
        var insurance1;
        var hoa1;
        var rent1;

        try  {
            url1 = url[i];
            price1 = price[i].replace(/\D/g,'');
            address1 = address[i];
            tax1 = tax[i].replace(/\D/g,'');
            insurance1 = insurance[i].replace(/\D/g,'');
            hoa1 = hoa[i].replace(/\D/g,'');
            rent1 = rent[i].replace(/\D/g,'');
        } catch(err) {
            numSkips++;
            continue;
        }

        tax1 = 0.0198 / 12 * price1;
        insurance1 = 0.00411765 / 12 * price1;

        downPayment = price1 * 0.2 + 5000;
        loanAmount = price1 * 0.8;
        pAndI = 0.0044904 * loanAmount;
        console.log(pAndI + " + " + tax1 + " + " + insurance1 + " + " + hoa1);
        totalMonth = (((pAndI + tax1) + insurance1) + hoa1);
        rentalAfterProperty = rent1 * 0.9;
        monthlyCash = rentalAfterProperty - totalMonth;
        annualCashROI = monthlyCash / downPayment * 12;
        annualEquity = loanAmount / 30;
        taxDeductionValue = (price1 / 27.5 + tax1) * 0.24;
        totalROI = (taxDeductionValue + annualEquity + (monthlyCash * 12)) / downPayment;
        appreciation = price1 * 0.08;
        totalPotential = ( monthlyCash * 12 + annualEquity + taxDeductionValue + appreciation ) / downPayment;

        result += "\""+ url1 + "\",";
        result += "\""+ address1 + "\",";
        result += "\""+ price1 + "\",";
        result += "=C" + row + "*0.2+5000,";
        result += "=C" + row + "*0.8,";
        result += "\""+ price1 + "\",";
        result += "=0.0044904*E" + row + ",";
        result += "=0.0198/12*C" + row + ",";
        result += "=0.00411765/12*C" + row + ",";
        result += "\""+ hoa1 + "\",";
        result += "=sum(G" + row + ":J" + row + "),";
        result += "\""+ rent1 + "\",";
        result += "=L" + row + "*0.9,";
        result += "=M" + row + "-K" + row + ",";
        result += "=N" + row + "/D" + row + "*12,";
        result += "=E" + row + "/30,";
        result += "=(F" + row + "/27.5 +H" + row + ")*0.24,";
        result += "=(Q" + row + "+P" + row + "+(N" + row + "*12))/D" + row + ",";
        result += "=F" + row + "*0.08,";
        result += "=(N" + row + "*12+P" + row + "+Q" + row + "+S" + row + ")/D" + row + "\n";
    }
    return result;
}

chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    if (request.message === "Data Page"){
        links.delete(request.url);
        seenLinks.add(request.url);
        url.push(request.url);
        price.push(request.price);
        address.push(request.address);
        zestimate.push(request.zestimate);
        tax.push(request.tax);
        insurance.push(request.insurance);
        hoa.push(request.hoa);
        rent.push(request.rent);
        sendResponse({message: "Data Received"});
    }
    if (request.message === "Search Page"){
        var deserialized = request.urls.split("@");
        for(var i=0; i<deserialized.length; i++) {
            if(!seenLinks.has(deserialized[i])){
                links.add(deserialized[i]);
            }
        }
        console.log(links);
        sendResponse({
            message: "Data Received",
            sent: deserialized.length,
            total: links.size
        });
    }
    if (request.message === "Clear"){
        links = [];
        seenLinks = [];
        url = [];
        price = [];
        address = [];
        zestimate = [];
        tax = [];
        insurance = [];
        hoa = [];
        rent = [];
        sendResponse({message: "Cleared"});
    }
    if (request.message === "Get Page"){
        var nextPage = Array.from(links)[0];
        links.delete(nextPage);
        sendResponse({message: nextPage});
    }
    if (request.message === "Skip Page"){
        var nextPage = Array.from(links)[0];
        links.delete(nextPage);
        sendResponse({message: "Skipped"});
    }
    if (request.message === "Download"){
        saveData(url, "data.csv");
        sendResponse({message: "Downloaded"});
    }
    if (request.message === "Count"){
        sendResponse({message: url.length});
    }
});