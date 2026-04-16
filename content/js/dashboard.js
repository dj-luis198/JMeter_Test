/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 98.75968992248062, "KoPercent": 1.2403100775193798};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.770791749833666, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6209361e-0e6d-45c4-895d-64927ba794e2"], "isController": false}, {"data": [0.026785714285714284, 500, 1500, "see books"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/bd64bcce-a486-492e-9430-0bca9d7b471c"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5714285714285714, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9a1a6552-fcc7-4be5-97b8-94985956cd5e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/eef84af6-5364-4eac-b03b-ca7c0cf73d32"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f97d527e-65f4-4114-a4bb-136b5f0efd2e"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a3640465-922a-447e-add7-d771c33bf3bf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=22910111-c936-43e0-825b-e1c7c36e9773"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ed04a534-d9bc-40e9-95e5-ef55e0524f46"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9c44dc0e-7b84-4585-9546-d17621bbc2ed"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/22910111-c936-43e0-825b-e1c7c36e9773"], "isController": false}, {"data": [0.5952380952380952, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a3640465-922a-447e-add7-d771c33bf3bf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c5c85d9a-dfde-4de5-bc40-f09f822b0f12"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9a1a6552-fcc7-4be5-97b8-94985956cd5e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a16840ce-3fc7-442e-a57b-6e77ef5ca2a6"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/58205113-cb98-49a6-9406-c5a51712f823"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=95607682-f11f-427f-8050-f52ad5a6d592"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.21739130434782608, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4c69fe27-67a7-4282-be13-32cc12f6fecf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8611111111111112, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eef84af6-5364-4eac-b03b-ca7c0cf73d32"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f97d527e-65f4-4114-a4bb-136b5f0efd2e"], "isController": false}, {"data": [0.21739130434782608, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bd64bcce-a486-492e-9430-0bca9d7b471c"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.2619047619047619, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9c44dc0e-7b84-4585-9546-d17621bbc2ed"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b2bae667-3b77-476d-be97-fc5b2555b077"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c5c85d9a-dfde-4de5-bc40-f09f822b0f12"], "isController": false}, {"data": [0.30701754385964913, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ed04a534-d9bc-40e9-95e5-ef55e0524f46"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.48214285714285715, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9529411764705882, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b2bae667-3b77-476d-be97-fc5b2555b077"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=58205113-cb98-49a6-9406-c5a51712f823"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6cd72c99-d372-4603-a6b1-b73066439583"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6209361e-0e6d-45c4-895d-64927ba794e2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/95607682-f11f-427f-8050-f52ad5a6d592"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1290, 16, 1.2403100775193798, 408.6286821705422, 110, 2651, 135.0, 1137.9, 1362.0, 1828.4399999999987, 5.110530068932731, 733.184810100725, 3.73262212408882], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6209361e-0e6d-45c4-895d-64927ba794e2", 1, 0, 0.0, 629.0, 629, 629, 629.0, 629.0, 629.0, 629.0, 1.589825119236884, 0.28722426470588236, 1.0961098966613672], "isController": false}, {"data": ["see books", 56, 0, 0.0, 1904.9285714285713, 1387, 2614, 1861.0, 2287.7, 2438.6, 2614.0, 0.24856740837405847, 299.1098396421184, 1.2222040050423675], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/bd64bcce-a486-492e-9430-0bca9d7b471c", 3, 0, 0.0, 1094.6666666666667, 199, 2651, 434.0, 2651.0, 2651.0, 2651.0, 0.016134236850596968, 0.02224234800204367, 0.01034649954286329], "isController": false}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 577.8571428571429, 121, 921, 606.5, 867.5, 921.0, 921.0, 0.07713031166155218, 0.01456415692437373, 0.05216087971252431], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 577.8571428571429, 121, 921, 606.5, 867.5, 921.0, 921.0, 0.07788725263843067, 0.014707086557772869, 0.05267277583214184], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9a1a6552-fcc7-4be5-97b8-94985956cd5e", 1, 0, 0.0, 492.0, 492, 492, 492.0, 492.0, 492.0, 492.0, 2.032520325203252, 0.36720337906504064, 1.4013274898373984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 151.00000000000003, 113, 348, 115.0, 342.7, 347.75, 348.0, 0.1121667246194744, 0.03843681998923199, 0.0634990725213958], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 117.35, 114, 135, 116.0, 120.80000000000001, 134.29999999999998, 135.0, 0.11231285869919247, 0.08346688034188034, 0.05637579040174309], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eef84af6-5364-4eac-b03b-ca7c0cf73d32", 3, 0, 0.0, 1152.3333333333333, 315, 1812, 1330.0, 1812.0, 1812.0, 1812.0, 0.024224023771841994, 0.02863197601417913, 0.015534286077646071], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 225.04999999999998, 114, 912, 118.0, 344.8, 883.6499999999996, 912.0, 0.11216924095074648, 1.6777955203811512, 0.06557080823546567], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 199.04999999999998, 113, 1119, 115.0, 344.6, 1080.2999999999995, 1119.0, 0.1123147508578039, 5.081809230938783, 0.0655461866334215], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f97d527e-65f4-4114-a4bb-136b5f0efd2e", 1, 0, 0.0, 876.0, 876, 876, 876.0, 876.0, 876.0, 876.0, 1.141552511415525, 0.2062375142694064, 0.787046946347032], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 220.71428571428572, 114, 315, 214.5, 293.5, 315.0, 315.0, 0.07735533171623854, 0.15220157936104495, 0.05000361739776664], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a3640465-922a-447e-add7-d771c33bf3bf", 1, 0, 0.0, 600.0, 600, 600, 600.0, 600.0, 600.0, 600.0, 1.6666666666666667, 0.30110677083333337, 1.1490885416666667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 148.07142857142856, 113, 345, 115.5, 345.0, 345.0, 345.0, 0.09426784187242868, 0.0700564723290217, 0.04731803781487142], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 181.92857142857142, 113, 344, 115.0, 343.5, 344.0, 344.0, 0.09424689995018379, 0.04544046961883861, 0.05261943270098152], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 886.6, 685, 1025, 906.0, 1025.0, 1025.0, 1025.0, 0.05778008898133703, 16.989264640030047, 0.032952706997168776], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=22910111-c936-43e0-825b-e1c7c36e9773", 1, 0, 0.0, 558.0, 558, 558, 558.0, 558.0, 558.0, 558.0, 1.7921146953405018, 0.32377072132616486, 1.2355790770609318], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1163.0, 943, 1469, 1021.0, 1469.0, 1469.0, 1469.0, 0.05769940915805022, 51.91802978515625, 0.032850347206194605], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ed04a534-d9bc-40e9-95e5-ef55e0524f46", 1, 0, 0.0, 449.0, 449, 449, 449.0, 449.0, 449.0, 449.0, 2.2271714922048997, 0.40236984966592426, 1.5355303452115812], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 251.0, 114, 345, 339.0, 345.0, 345.0, 345.0, 0.058308357920024256, 0.10317846147566792, 0.03228597552798218], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 10, 0, 0.0, 146.2, 114, 414, 116.5, 384.8000000000001, 414.0, 414.0, 0.06318995532470158, 0.04696050390829874, 0.031718395543844355], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 10, 0, 0.0, 205.1, 113, 342, 116.0, 342.0, 342.0, 342.0, 0.06318955603017933, 0.026398918036826875, 0.035507100136489445], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 10, 0, 0.0, 340.6, 114, 1239, 339.5, 1149.4000000000003, 1239.0, 1239.0, 0.06319035462427015, 5.701207814514192, 0.0366059749639815], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 10, 0, 0.0, 217.39999999999998, 114, 912, 115.0, 855.2000000000003, 912.0, 912.0, 0.06318995532470158, 1.8733229978262658, 0.03666745259173602], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 161.0, 114, 342, 117.0, 342.0, 342.0, 342.0, 0.058154411593663496, 0.043218268772244064, 0.03265506510386378], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 768.1176470588235, 110, 1342, 1134.0, 1292.3999999999999, 1342.0, 1342.0, 0.09004857325981133, 47.67226714167289, 0.04838662421141286], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 310.7142857142857, 114, 1353, 116.0, 1129.0, 1353.0, 1353.0, 0.09425070688030161, 12.137053255857008, 0.054252011242762896], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 643.7647058823529, 115, 1150, 901.0, 1051.6, 1150.0, 1150.0, 0.08993852437334011, 15.565812515210192, 0.048415321226020804], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 271.0, 113, 683, 242.0, 624.5, 683.0, 683.0, 0.09424880337679999, 3.980670790612819, 0.054342955406851884], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 508.9285714285714, 120, 1262, 478.0, 1069.0, 1262.0, 1262.0, 0.07783918424534911, 0.014698010027354913, 0.053270105791791304], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/9c44dc0e-7b84-4585-9546-d17621bbc2ed", 3, 0, 0.0, 384.6666666666667, 235, 482, 437.0, 482.0, 482.0, 482.0, 0.08424836417759554, 0.038120190822544864, 0.05402645749670027], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 10, 0, 0.0, 511.3, 233, 1354, 458.5, 1294.5000000000002, 1354.0, 1354.0, 0.06314287337959601, 7.6421560666883455, 0.1403942325299455], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/22910111-c936-43e0-825b-e1c7c36e9773", 3, 0, 0.0, 321.3333333333333, 203, 533, 228.0, 533.0, 533.0, 533.0, 0.029586965955264506, 0.029866269995857824, 0.01897341241271845], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 798.0, 221, 1684, 766.0, 1360.6000000000001, 1655.4999999999995, 1684.0, 0.09299606759485599, 0.057123561051918376, 0.042048026656658515], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 117.52941176470588, 114, 132, 116.0, 124.0, 132.0, 132.0, 0.09004332673015604, 0.06691696449379761, 0.04519752923759786], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 170.3529411764706, 113, 346, 116.0, 342.8, 346.0, 346.0, 0.09004761929985328, 0.10365201031310088, 0.046906698748338096], "isController": false}, {"data": ["login", 21, 0, 0.0, 3051.428571428572, 1712, 5156, 3030.0, 4347.000000000001, 5090.899999999999, 5156.0, 0.0942976843182951, 26.989866191305303, 0.1795050087225358], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 121.07142857142857, 115, 155, 118.0, 140.5, 155.0, 155.0, 0.09260300430603971, 0.07496864313447942, 0.03291747418691255], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a3640465-922a-447e-add7-d771c33bf3bf", 3, 0, 0.0, 728.0, 191, 1478, 515.0, 1478.0, 1478.0, 1478.0, 0.03642279581380667, 0.03036418622368453, 0.023357066325911176], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c5c85d9a-dfde-4de5-bc40-f09f822b0f12", 3, 0, 0.0, 289.6666666666667, 199, 441, 229.0, 441.0, 441.0, 441.0, 0.020380434782608696, 0.02408898395040761, 0.013069484544836958], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9a1a6552-fcc7-4be5-97b8-94985956cd5e", 3, 0, 0.0, 351.0, 225, 499, 329.0, 499.0, 499.0, 499.0, 0.03390673387734804, 0.02826664891272407, 0.021743576086710823], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a16840ce-3fc7-442e-a57b-6e77ef5ca2a6", 1, 0, 0.0, 320.0, 320, 320, 320.0, 320.0, 320.0, 320.0, 3.125, 0.9979248046875, 1.8646240234375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 929.1176470588234, 232, 1458, 1253.0, 1414.8, 1458.0, 1458.0, 0.08987956138774042, 63.30865273346216, 0.18861387046504743], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/58205113-cb98-49a6-9406-c5a51712f823", 3, 0, 0.0, 395.0, 198, 753, 234.0, 753.0, 753.0, 753.0, 0.075765228810991, 0.03428179298413982, 0.04858642602788161], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=95607682-f11f-427f-8050-f52ad5a6d592", 1, 0, 0.0, 464.0, 464, 464, 464.0, 464.0, 464.0, 464.0, 2.155172413793103, 0.3893622036637931, 1.4858903556034482], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 365.5, 230, 1235, 246.5, 464.9, 1196.4999999999995, 1235.0, 0.1120931718444371, 6.87015656788923, 0.2506661662173599], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, 28.571428571428573, 979.5714285714286, 114, 1586, 1138.0, 1586.0, 1586.0, 1586.0, 0.08046069495051668, 68.76255402360947, 0.14482476091679217], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 1201.391304347826, 153, 2363, 1143.0, 2203.2000000000003, 2348.0, 2363.0, 0.09301121796167938, 0.02930295674573968, 0.04196404560380456], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/4c69fe27-67a7-4282-be13-32cc12f6fecf", 1, 0, 0.0, 242.0, 242, 242, 242.0, 242.0, 242.0, 242.0, 4.132231404958678, 1.3195699896694215, 2.46561854338843], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 119.11764705882354, 116, 129, 118.0, 127.4, 129.0, 129.0, 0.0831377151799687, 0.06454539410944836, 0.0295528596928795], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 540.9999999999999, 231, 1698, 458.0, 1359.0, 1698.0, 1698.0, 0.09417335970187404, 16.219968578049535, 0.20835593073549394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 416.22222222222223, 231, 1594, 234.5, 776.8000000000013, 1594.0, 1594.0, 0.10304497913339172, 6.999584018510885, 0.23028584963447654], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eef84af6-5364-4eac-b03b-ca7c0cf73d32", 1, 0, 0.0, 1262.0, 1262, 1262, 1262.0, 1262.0, 1262.0, 1262.0, 0.7923930269413629, 0.14315694334389858, 0.5463178486529319], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 144.375, 114, 346, 116.0, 346.0, 346.0, 346.0, 0.05432310021932952, 0.040370975846591564, 0.027267649914780638], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 114.875, 113, 117, 115.0, 117.0, 117.0, 117.0, 0.05432273134693212, 0.014535574598690822, 0.030980932721297226], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 171.125, 113, 341, 115.5, 341.0, 341.0, 341.0, 0.05432310021932952, 0.014641773105991159, 0.03193604133987927], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 171.25000000000003, 114, 341, 115.0, 341.0, 341.0, 341.0, 0.05432346909673652, 0.014641872529979765, 0.0319893084622384], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 120.0, 120, 120, 120.0, 120.0, 120.0, 120.0, 8.333333333333334, 2.457682291666667, 5.1513671875], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1297.2142857142853, 902, 2126, 1205.0, 1785.8000000000002, 1961.9999999999998, 2126.0, 0.2525366403607666, 302.1216178128523, 0.4986612175873732], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f97d527e-65f4-4114-a4bb-136b5f0efd2e", 3, 0, 0.0, 400.0, 272, 566, 362.0, 566.0, 566.0, 566.0, 0.022394911876021766, 0.02246052196940855, 0.014361320441329062], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 1201.391304347826, 153, 2363, 1143.0, 2203.2000000000003, 2348.0, 2363.0, 0.09111797797321924, 0.02870649611758181, 0.041109868968386025], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 141.0, 114, 338, 116.0, 338.0, 338.0, 338.0, 0.05601892194696875, 0.015098850056018923, 0.03298770501369352], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 143.0, 114, 343, 118.0, 343.0, 343.0, 343.0, 0.05601857326918169, 0.015098756076459129, 0.03293279405082752], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 242.11764705882354, 114, 1133, 117.0, 500.99999999999943, 1133.0, 1133.0, 0.07939399034195459, 4.222425803105239, 0.046273634306610245], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 204.47058823529414, 114, 945, 116.0, 463.3999999999996, 945.0, 945.0, 0.07946375985116906, 1.394568900338422, 0.046391899779838645], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 129.35294117647058, 114, 341, 116.0, 162.59999999999985, 341.0, 341.0, 0.07977175892035962, 0.059283504432025076, 0.04004168367682114], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 116.0, 113, 121, 115.0, 121.0, 121.0, 121.0, 0.05601927062909641, 0.014989531398801189, 0.03194849028065655], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 141.94117647058823, 113, 345, 115.0, 341.8, 345.0, 345.0, 0.0796872509773407, 0.028362948475161014, 0.045052959795438136], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 115.8888888888889, 114, 118, 116.0, 118.0, 118.0, 118.0, 0.05601787592662903, 0.04163047224625458, 0.02811834787723371], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bd64bcce-a486-492e-9430-0bca9d7b471c", 1, 0, 0.0, 499.0, 499, 499, 499.0, 499.0, 499.0, 499.0, 2.004008016032064, 0.36205222945891785, 1.3816695891783568], "isController": false}, {"data": ["deleteAccount", 14, 1, 7.142857142857143, 639.5714285714287, 116, 1812, 507.0, 1449.0, 1812.0, 1812.0, 0.07540950051978691, 0.014091940003662748, 0.051323276825583214], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 119.0, 116, 123, 119.0, 123.0, 123.0, 123.0, 0.05422274704486029, 0.04267923253726308, 0.01927449211360268], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1507.4761904761904, 1043, 2104, 1415.0, 2021.6000000000001, 2098.2, 2104.0, 0.09223917178008424, 0.047740977581488916, 0.04242641592619109], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 259.77777777777777, 230, 460, 235.0, 460.0, 460.0, 460.0, 0.05597745974287687, 0.08675412950385311, 0.1258946189334428], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9c44dc0e-7b84-4585-9546-d17621bbc2ed", 1, 0, 0.0, 200.0, 200, 200, 200.0, 200.0, 200.0, 200.0, 5.0, 0.9033203125, 3.447265625], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b2bae667-3b77-476d-be97-fc5b2555b077", 1, 0, 0.0, 383.0, 383, 383, 383.0, 383.0, 383.0, 383.0, 2.6109660574412534, 0.4717077349869452, 1.8001387075718016], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c5c85d9a-dfde-4de5-bc40-f09f822b0f12", 1, 0, 0.0, 400.0, 400, 400, 400.0, 400.0, 400.0, 400.0, 2.5, 0.45166015625, 1.7236328125], "isController": false}, {"data": ["addBook", 57, 6, 10.526315789473685, 1183.9122807017548, 595, 2281, 951.0, 2039.2000000000003, 2180.8999999999996, 2281.0, 0.2638302599422351, 89.61593152187245, 0.9579305727199511], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ed04a534-d9bc-40e9-95e5-ef55e0524f46", 3, 0, 0.0, 451.33333333333337, 209, 929, 216.0, 929.0, 929.0, 929.0, 0.036311260121763764, 0.02258815693121437, 0.023285541158813348], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 197.01785714285703, 114, 475, 116.0, 461.90000000000003, 471.0, 475.0, 0.25343838958006165, 0.18834630319377627, 0.12251172152551808], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 715.5714285714287, 563, 1035, 679.5, 914.2, 941.8499999999999, 1035.0, 0.25324355246437635, 74.46201290185455, 0.12736370070229863], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 165.92857142857144, 113, 476, 118.0, 343.3, 362.0999999999999, 476.0, 0.25388880577052986, 0.44926417583613293, 0.12347326686887097], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1098.3928571428573, 785, 1615, 1089.5, 1359.3, 1498.05, 1615.0, 0.25311992912641984, 227.757757165328, 0.12705433942478495], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 146.72222222222229, 116, 349, 121.5, 343.6, 349.0, 349.0, 0.10526192676109052, 0.07863806051976, 0.037417325528356395], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 6, 3.5294117647058822, 188.03529411764708, 113, 838, 123.0, 351.30000000000007, 442.7499999999994, 697.4199999999985, 0.7170000717000071, 1.5679392824832665, 0.3438165267989321], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 149.375, 115, 350, 119.0, 350.0, 350.0, 350.0, 0.0543759006008537, 0.04210946208640331, 0.019328933416709715], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 132.55, 115, 345, 119.0, 140.90000000000003, 334.84999999999985, 345.0, 0.11333563782463577, 0.09197452639870343, 0.04028727750797599], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b2bae667-3b77-476d-be97-fc5b2555b077", 3, 0, 0.0, 289.6666666666667, 215, 409, 245.0, 409.0, 409.0, 409.0, 0.04363128654120248, 0.028050713189737925, 0.027979698725966434], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=58205113-cb98-49a6-9406-c5a51712f823", 1, 0, 0.0, 193.0, 193, 193, 193.0, 193.0, 193.0, 193.0, 5.181347150259067, 0.936083225388601, 3.5722959844559585], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 317.0, 230, 688, 232.5, 688.0, 688.0, 688.0, 0.054279976116810506, 0.08412336142322098, 0.12207693847364709], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 386.29411764705884, 231, 1247, 237.0, 796.5999999999996, 1247.0, 1247.0, 0.07934989101059087, 5.6998638507568575, 0.17726550502704896], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 10, 0, 0.0, 146.49999999999997, 117, 348, 121.5, 328.70000000000005, 348.0, 348.0, 0.0587340463646562, 0.048696489612883906, 0.020878118043686385], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 122.41176470588235, 117, 155, 118.0, 134.99999999999997, 155.0, 155.0, 0.0926773954380915, 0.07195168884109643, 0.03294391790963409], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6cd72c99-d372-4603-a6b1-b73066439583", 1, 0, 0.0, 323.0, 323, 323, 323.0, 323.0, 323.0, 323.0, 3.0959752321981426, 0.9886561532507739, 1.8473055340557274], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6209361e-0e6d-45c4-895d-64927ba794e2", 3, 0, 0.0, 298.3333333333333, 206, 424, 265.0, 424.0, 424.0, 424.0, 0.039042673642291026, 0.03254827057223545, 0.025037131209411888], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 154.22222222222226, 113, 343, 116.0, 343.0, 343.0, 343.0, 0.10311345344141151, 0.07663021295792398, 0.05175812018445851], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 164.8888888888889, 113, 343, 115.0, 339.4, 343.0, 343.0, 0.10311522553591275, 0.03619550288722631, 0.05832678718736036], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 216.16666666666669, 113, 1251, 115.5, 436.50000000000125, 1251.0, 1251.0, 0.10311463483097792, 5.180844675346437, 0.06012782634349777], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 216.05555555555557, 113, 681, 115.5, 482.1000000000003, 681.0, 681.0, 0.10311581624761544, 1.7106640909195066, 0.060229214286123475], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/95607682-f11f-427f-8050-f52ad5a6d592", 3, 0, 0.0, 499.6666666666667, 200, 1086, 213.0, 1086.0, 1086.0, 1086.0, 0.035471894435642165, 0.029571458870338404, 0.022747276054106463], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 37.5, 0.46511627906976744], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 6.25, 0.07751937984496124], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 6.25, 0.07751937984496124], "isController": false}, {"data": ["401/Unauthorized", 8, 50.0, 0.6201550387596899], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1290, 16, "401/Unauthorized", 8, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
