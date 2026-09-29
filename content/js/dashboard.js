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

    var data = {"OkPercent": 98.37962962962963, "KoPercent": 1.6203703703703705};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7226277372262774, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f3f66ce9-29a4-4518-9be6-600f656a5dcd"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3de566b2-a391-41bb-9631-03a6d8d5b444"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cac035b3-888a-458e-aab3-78f216306ece"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f56422fd-eff2-4462-ac95-19d1f6f5c8ed"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=aeeef0cf-c8de-42c2-87c7-b8a107f5542f"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/e2c49454-20c3-473f-90a5-cc3a8a32e5b2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6521739130434783, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=640caf9e-b9b6-4098-9671-b03678a708a9"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e2c49454-20c3-473f-90a5-cc3a8a32e5b2"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/fed5a0a5-5404-4ec5-aeaf-560fdc123644"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=41702061-be22-4ad2-b359-96640e925f5d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=53fbae35-53f3-4dca-adb5-5a81d8c1b256"], "isController": false}, {"data": [0.3611111111111111, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0625, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/69fd5dc7-33c0-4ca4-8d8e-79ef10b0cb7e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5f6730df-d861-4b0a-88a7-2afb0223b1b4"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "register"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/aeeef0cf-c8de-42c2-87c7-b8a107f5542f"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cb0e3ae8-8dd5-451a-8f44-bab2a121561e"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cac035b3-888a-458e-aab3-78f216306ece"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/53fbae35-53f3-4dca-adb5-5a81d8c1b256"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.4230769230769231, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f56422fd-eff2-4462-ac95-19d1f6f5c8ed"], "isController": false}, {"data": [0.32608695652173914, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3de566b2-a391-41bb-9631-03a6d8d5b444"], "isController": false}, {"data": [0.2631578947368421, 500, 1500, "addBook"], "isController": true}, {"data": [0.9107142857142857, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.3392857142857143, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/568e274b-068a-4a3e-b503-003b5495bf86"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fed5a0a5-5404-4ec5-aeaf-560fdc123644"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=69fd5dc7-33c0-4ca4-8d8e-79ef10b0cb7e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/da7d07b1-7a23-440a-aef6-f816780b0681"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/640caf9e-b9b6-4098-9671-b03678a708a9"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/753d4f31-3b32-4374-b58a-6c8a60f44993"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/41702061-be22-4ad2-b359-96640e925f5d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/2cb2f991-e534-4861-8707-17dcd4082c8b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/5f6730df-d861-4b0a-88a7-2afb0223b1b4"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f3f66ce9-29a4-4518-9be6-600f656a5dcd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1296, 21, 1.6203703703703705, 479.0802469135799, 132, 2494, 152.5, 1379.0, 1635.4499999999996, 2099.139999999999, 5.042507246658755, 720.1083723530242, 3.6834699579791064], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 2330.2499999999995, 1687, 3128, 2290.0, 2777.9, 2886.9, 3128.0, 0.2533260351308927, 304.8354163580198, 1.2456021356289497], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f3f66ce9-29a4-4518-9be6-600f656a5dcd", 1, 0, 0.0, 426.0, 426, 426, 426.0, 426.0, 426.0, 426.0, 2.347417840375587, 0.42409404342723006, 1.6184345657276995], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3de566b2-a391-41bb-9631-03a6d8d5b444", 1, 0, 0.0, 577.0, 577, 577, 577.0, 577.0, 577.0, 577.0, 1.7331022530329288, 0.3131092937608319, 1.1948927642980938], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cac035b3-888a-458e-aab3-78f216306ece", 3, 0, 0.0, 437.0, 242, 809, 260.0, 809.0, 809.0, 809.0, 0.024582104228121928, 0.02905521499098656, 0.015763914495247458], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f56422fd-eff2-4462-ac95-19d1f6f5c8ed", 1, 0, 0.0, 227.0, 227, 227, 227.0, 227.0, 227.0, 227.0, 4.405286343612335, 0.7958769273127753, 3.037238436123348], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 669.076923076923, 143, 1818, 532.0, 1519.5999999999997, 1818.0, 1818.0, 0.07928714755338159, 0.015021197876324246, 0.05359863587987387], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 669.076923076923, 143, 1818, 532.0, 1519.5999999999997, 1818.0, 1818.0, 0.07757951900698215, 0.014697682311869667, 0.05244426769409799], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 178.5, 136, 415, 140.0, 410.5, 415.0, 415.0, 0.07226365912199655, 0.02708879074508994, 0.04077936678968694], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 140.35714285714286, 133, 150, 140.0, 147.5, 150.0, 150.0, 0.07226104819811915, 0.053701814139422537, 0.03627165895882153], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=aeeef0cf-c8de-42c2-87c7-b8a107f5542f", 1, 0, 0.0, 1386.0, 1386, 1386, 1386.0, 1386.0, 1386.0, 1386.0, 0.7215007215007215, 0.13034925144300144, 0.4974409271284272], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 310.1428571428571, 132, 1137, 147.0, 784.0, 1137.0, 1137.0, 0.07226776238359728, 1.5358815086153497, 0.04211250606533006], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 283.57142857142856, 136, 1850, 142.0, 1137.0, 1850.0, 1850.0, 0.07226365912199655, 4.662583756484373, 0.042039544997032025], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 282.30769230769226, 141, 512, 260.0, 455.99999999999994, 512.0, 512.0, 0.07948493760432397, 0.1597759499214322, 0.05137979928524698], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 141.2857142857143, 136, 147, 142.5, 147.0, 147.0, 147.0, 0.07119754266767021, 0.05291145504892288, 0.0357378290343579], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 159.92857142857144, 135, 417, 141.0, 283.0, 417.0, 417.0, 0.07119862891783169, 0.019051195628404183, 0.04060546805470089], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 959.3333333333334, 685, 1109, 1080.5, 1109.0, 1109.0, 1109.0, 0.038584464608399836, 11.345113719671005, 0.022005202471978035], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1449.0, 962, 1831, 1540.0, 1831.0, 1831.0, 1831.0, 0.03846079883079172, 34.607094394819335, 0.021897114959327706], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 185.66666666666669, 137, 409, 142.0, 409.0, 409.0, 409.0, 0.038826155887015885, 0.06870409615944609, 0.021498467175720713], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e2c49454-20c3-473f-90a5-cc3a8a32e5b2", 3, 0, 0.0, 490.6666666666667, 291, 649, 532.0, 649.0, 649.0, 649.0, 0.01803784339544364, 0.024866623300684836, 0.011567236812833323], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 209.35714285714286, 137, 550, 141.5, 483.5, 550.0, 550.0, 0.0745489786789921, 0.05540212185030565, 0.03742009281347846], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 203.92857142857142, 137, 431, 141.5, 428.5, 431.0, 431.0, 0.0745489786789921, 0.03594325757737119, 0.04162179306268504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 391.8571428571429, 134, 1682, 143.0, 1464.5, 1682.0, 1682.0, 0.07411250277921885, 9.543773441387598, 0.04266018226381934], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 391.78571428571433, 136, 1242, 294.0, 1185.0, 1242.0, 1242.0, 0.07415921984500723, 3.13217175937452, 0.042759494366547836], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 186.83333333333334, 139, 418, 140.0, 418.0, 418.0, 418.0, 0.03882565340339207, 0.028853830312481798, 0.02180151436225629], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 963.5555555555555, 136, 2325, 1420.0, 1762.500000000001, 2325.0, 2325.0, 0.08354529083044018, 41.77345222195663, 0.045126785780591504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 161.35714285714283, 138, 417, 142.0, 283.0, 417.0, 417.0, 0.07119971520113919, 0.01919054823780705, 0.041857645069419726], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 714.3333333333334, 132, 1393, 967.5, 1263.4, 1393.0, 1393.0, 0.08343917747513048, 13.639933439872802, 0.04515095248138843], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 178.92857142857144, 135, 416, 140.5, 409.5, 416.0, 416.0, 0.07119790474737459, 0.019190060263940805, 0.041926109924479364], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 507.0, 144, 1386, 470.0, 1070.3999999999996, 1386.0, 1386.0, 0.07743395776871072, 0.014670105280400275, 0.052962453837448256], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 686.4999999999999, 283, 1823, 571.5, 1605.0, 1823.0, 1823.0, 0.07405722507577642, 12.755261865025417, 0.16384954415133066], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 696.1739130434781, 169, 2162, 555.0, 1357.2000000000007, 2040.7999999999984, 2162.0, 0.09951368096779219, 0.06112705598509891, 0.04499495535946072], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 140.33333333333337, 134, 146, 141.0, 145.1, 146.0, 146.0, 0.08354373978909847, 0.062086705058109315, 0.04193504126132482], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 231.5, 133, 427, 142.0, 423.4, 427.0, 427.0, 0.08354567859977442, 0.09206704772778962, 0.043749071714682224], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=640caf9e-b9b6-4098-9671-b03678a708a9", 1, 0, 0.0, 470.0, 470, 470, 470.0, 470.0, 470.0, 470.0, 2.127659574468085, 0.38439162234042556, 1.4669215425531916], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e2c49454-20c3-473f-90a5-cc3a8a32e5b2", 1, 0, 0.0, 534.0, 534, 534, 534.0, 534.0, 534.0, 534.0, 1.8726591760299625, 0.33832221441947563, 1.2911107209737827], "isController": false}, {"data": ["login", 23, 0, 0.0, 2992.695652173913, 1542, 5132, 2882.0, 4511.000000000001, 5036.199999999999, 5132.0, 0.0951588946673783, 29.82837007294136, 0.18473803247607581], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 143.71428571428572, 136, 153, 143.5, 152.0, 153.0, 153.0, 0.06900324808146327, 0.055862981112825234, 0.024528498341457643], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fed5a0a5-5404-4ec5-aeaf-560fdc123644", 3, 0, 0.0, 487.0, 234, 650, 577.0, 650.0, 650.0, 650.0, 0.09452093638740981, 0.041845206213176216, 0.06061401194114496], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=41702061-be22-4ad2-b359-96640e925f5d", 1, 0, 0.0, 504.0, 504, 504, 504.0, 504.0, 504.0, 504.0, 1.984126984126984, 0.35846044146825395, 1.3679625496031746], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=53fbae35-53f3-4dca-adb5-5a81d8c1b256", 1, 0, 0.0, 526.0, 526, 526, 526.0, 526.0, 526.0, 526.0, 1.9011406844106464, 0.34346779942965777, 1.3107473859315588], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 1151.1111111111113, 274, 2470, 1561.5, 1908.400000000001, 2470.0, 2470.0, 0.08338235907223228, 55.47648385856499, 0.17567656967290954], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 543.2857142857143, 277, 1993, 549.5, 1282.0, 1993.0, 1993.0, 0.07220737959419453, 6.274280335802998, 0.16107645085256286], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, 25.0, 1276.5, 141, 1971, 1656.0, 1971.0, 1971.0, 1971.0, 0.051235085786746765, 45.974658446103895, 0.09513389769314026], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/69fd5dc7-33c0-4ca4-8d8e-79ef10b0cb7e", 3, 0, 0.0, 388.6666666666667, 271, 616, 279.0, 616.0, 616.0, 616.0, 0.02467389337588209, 0.024746180172881747, 0.015822776676591054], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5f6730df-d861-4b0a-88a7-2afb0223b1b4", 1, 0, 0.0, 452.0, 452, 452, 452.0, 452.0, 452.0, 452.0, 2.2123893805309733, 0.3996992533185841, 1.5253387721238938], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 1113.4347826086953, 159, 1772, 1196.0, 1732.8, 1766.0, 1772.0, 0.09694088292070235, 0.03054098808048622, 0.04373699991148876], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/aeeef0cf-c8de-42c2-87c7-b8a107f5542f", 3, 0, 0.0, 759.3333333333333, 300, 1659, 319.0, 1659.0, 1659.0, 1659.0, 0.021130183057819225, 0.025098970695957797, 0.013550280151010374], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 342.7142857142857, 277, 560, 287.0, 557.0, 560.0, 560.0, 0.07114580315989004, 0.11026209923314988, 0.16000857878635424], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 145.6153846153846, 140, 159, 143.0, 159.0, 159.0, 159.0, 0.11250735625021636, 0.08734701974504103, 0.039992849292069095], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cb0e3ae8-8dd5-451a-8f44-bab2a121561e", 1, 0, 0.0, 338.0, 338, 338, 338.0, 338.0, 338.0, 338.0, 2.9585798816568047, 0.9447808801775147, 1.7653245192307692], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 22, 0, 0.0, 512.0454545454545, 275, 1385, 419.5, 1150.9999999999995, 1370.1499999999999, 1385.0, 0.10740089826205819, 11.83211973369459, 0.23904899860867018], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cac035b3-888a-458e-aab3-78f216306ece", 1, 0, 0.0, 451.0, 451, 451, 451.0, 451.0, 451.0, 451.0, 2.2172949002217295, 0.4005855044345898, 1.5287208980044344], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/53fbae35-53f3-4dca-adb5-5a81d8c1b256", 3, 0, 0.0, 539.3333333333334, 241, 869, 508.0, 869.0, 869.0, 869.0, 0.018124040936167127, 0.024985453569227795, 0.011622513230549882], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 142.5, 135, 165, 140.5, 162.9, 165.0, 165.0, 0.04760839240741358, 0.03538084631058763, 0.02389718134512752], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 181.50000000000003, 135, 561, 140.5, 519.2000000000002, 561.0, 561.0, 0.04751428992269425, 0.012713784608220922, 0.027097993471536564], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 167.6, 136, 415, 140.5, 388.0000000000001, 415.0, 415.0, 0.04760952571390484, 0.012832254977575914, 0.027989193827901087], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 167.89999999999998, 134, 415, 141.5, 387.9000000000001, 415.0, 415.0, 0.04761020572369894, 0.012832438261465729, 0.028036087940810993], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 144.0, 144, 144, 144.0, 144.0, 144.0, 144.0, 6.944444444444444, 2.048068576388889, 4.292805989583334], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1606.8035714285713, 1095, 2494, 1549.0, 2203.6000000000004, 2318.85, 2494.0, 0.2577972148693751, 308.41509379675455, 0.5090487973299574], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 1113.4347826086953, 159, 1772, 1196.0, 1732.8, 1766.0, 1772.0, 0.09517307015910455, 0.029984042993399955, 0.04293941251318975], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 140.5, 136, 144, 140.5, 144.0, 144.0, 144.0, 0.04954357977135638, 0.0133535429852484, 0.029174588478640524], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 139.75, 135, 144, 140.0, 144.0, 144.0, 144.0, 0.04954327295246942, 0.013353460287970274, 0.029126025700572846], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 203.84615384615384, 134, 417, 141.0, 416.6, 417.0, 417.0, 0.11380548017158365, 0.030674133327497154, 0.06690517486649741], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 225.6923076923077, 135, 422, 142.0, 421.2, 422.0, 422.0, 0.11380249139915787, 0.030673327759929266, 0.06701455304071503], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 140.125, 138, 145, 139.5, 145.0, 145.0, 145.0, 0.04954327295246942, 0.013256696082984982, 0.02825514785570522], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 163.15384615384613, 136, 403, 143.0, 305.79999999999995, 403.0, 403.0, 0.11380846910100065, 0.08457836424400536, 0.05712651671671321], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 142.25, 139, 146, 141.5, 146.0, 146.0, 146.0, 0.04954388659404359, 0.03681923603326872, 0.024868708700525783], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 202.76923076923077, 134, 416, 142.0, 416.0, 416.0, 416.0, 0.11380647646394523, 0.030452123585079097, 0.06490525610834377], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 747.7692307692308, 141, 1659, 616.0, 1440.1999999999998, 1659.0, 1659.0, 0.07524846464190413, 0.014097781762087508, 0.05121327296091132], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 215.37499999999997, 142, 430, 148.5, 430.0, 430.0, 430.0, 0.05178194622444885, 0.04075805532900954, 0.018406863696972052], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f56422fd-eff2-4462-ac95-19d1f6f5c8ed", 3, 0, 0.0, 517.3333333333334, 259, 855, 438.0, 855.0, 855.0, 855.0, 0.08097165991902834, 0.03663756747638327, 0.05192518556005399], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1464.0, 792, 2463, 1351.0, 2221.6000000000004, 2431.1999999999994, 2463.0, 0.0991815367101053, 0.051334193805034976, 0.045619632607870705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 285.25, 280, 291, 286.5, 291.0, 291.0, 291.0, 0.049500355783807196, 0.07671588342666212, 0.11132746032237106], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3de566b2-a391-41bb-9631-03a6d8d5b444", 3, 0, 0.0, 521.3333333333334, 242, 982, 340.0, 982.0, 982.0, 982.0, 0.029472443265546714, 0.024569963282247764, 0.0188999717555752], "isController": false}, {"data": ["addBook", 57, 11, 19.29824561403509, 1397.824561403509, 700, 4745, 1101.0, 2432.6000000000004, 2661.199999999996, 4745.0, 0.2670289515600112, 85.12650844274103, 0.9696772448585215], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 234.58928571428572, 136, 580, 144.0, 565.5, 580.0, 580.0, 0.25897390837873085, 0.1924601018322404, 0.12518758266354665], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 908.839285714286, 661, 1290, 837.5, 1230.3000000000002, 1255.9, 1290.0, 0.25889129801624544, 76.1226376169056, 0.1302041196077797], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 204.48214285714283, 135, 567, 144.5, 420.3, 425.0, 567.0, 0.25951877803729656, 0.4592265876988099, 0.12621128072516963], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1370.5357142857147, 942, 1913, 1393.0, 1727.0000000000002, 1784.4999999999998, 1913.0, 0.25851125216387766, 232.60887911136757, 0.12976053087132142], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 22, 0, 0.0, 171.63636363636365, 137, 432, 147.0, 340.6999999999998, 429.59999999999997, 432.0, 0.11055165274720857, 0.08258985776524859, 0.039297657812484295], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/568e274b-068a-4a3e-b503-003b5495bf86", 1, 0, 0.0, 333.0, 333, 333, 333.0, 333.0, 333.0, 333.0, 3.003003003003003, 0.9589667792792792, 1.7918308933933933], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 11, 6.470588235294118, 213.21764705882356, 136, 1976, 147.0, 323.80000000000007, 441.2499999999995, 1352.619999999993, 0.7093027137087353, 1.5700860511970527, 0.3391761057820688], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 175.1, 141, 412, 149.0, 387.4000000000001, 412.0, 412.0, 0.046787784645184835, 0.03623311838245271, 0.016631595323093048], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 168.2857142857143, 141, 436, 147.0, 305.0, 436.0, 436.0, 0.07543428596060175, 0.061216691048105516, 0.02681453133755765], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fed5a0a5-5404-4ec5-aeaf-560fdc123644", 1, 0, 0.0, 297.0, 297, 297, 297.0, 297.0, 297.0, 297.0, 3.3670033670033668, 0.6082965067340068, 2.3213909932659935], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=69fd5dc7-33c0-4ca4-8d8e-79ef10b0cb7e", 1, 0, 0.0, 597.0, 597, 597, 597.0, 597.0, 597.0, 597.0, 1.6750418760469012, 0.3026198701842546, 1.1548628559463987], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/da7d07b1-7a23-440a-aef6-f816780b0681", 1, 0, 0.0, 341.0, 341, 341, 341.0, 341.0, 341.0, 341.0, 2.932551319648094, 0.9364690249266862, 1.7497938049853372], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/640caf9e-b9b6-4098-9671-b03678a708a9", 3, 0, 0.0, 481.6666666666667, 407, 526, 512.0, 526.0, 526.0, 526.0, 0.031356153645152866, 0.026140335118892084, 0.02010795009145545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 355.50000000000006, 281, 705, 285.5, 689.9000000000001, 705.0, 705.0, 0.04748135169912017, 0.07358682143213252, 0.10678667281550171], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/753d4f31-3b32-4374-b58a-6c8a60f44993", 1, 0, 0.0, 1237.0, 1237, 1237, 1237.0, 1237.0, 1237.0, 1237.0, 0.8084074373484236, 0.25815354688763137, 0.4823602970897332], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 432.92307692307685, 275, 819, 297.0, 720.5999999999999, 819.0, 819.0, 0.113656233607274, 0.1761449636081483, 0.2556155332007344], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 147.57142857142853, 141, 170, 146.0, 159.5, 170.0, 170.0, 0.07585403516376345, 0.06289069907620622, 0.026963739062119036], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/41702061-be22-4ad2-b359-96640e925f5d", 3, 0, 0.0, 404.0, 241, 512, 459.0, 512.0, 512.0, 512.0, 0.03386501405398083, 0.028231868812579722, 0.021716822163522862], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 161.11111111111111, 138, 407, 144.5, 199.10000000000034, 407.0, 407.0, 0.08156163340764505, 0.06332177593659942, 0.028992611875373824], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2cb2f991-e534-4861-8707-17dcd4082c8b", 1, 0, 0.0, 618.0, 618, 618, 618.0, 618.0, 618.0, 618.0, 1.6181229773462784, 0.5167248179611651, 0.965501112459547], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5f6730df-d861-4b0a-88a7-2afb0223b1b4", 3, 0, 0.0, 775.3333333333334, 287, 1508, 531.0, 1508.0, 1508.0, 1508.0, 0.05300072434323269, 0.0340743589120718, 0.0339880947122944], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f3f66ce9-29a4-4518-9be6-600f656a5dcd", 3, 0, 0.0, 685.0, 372, 1112, 571.0, 1112.0, 1112.0, 1112.0, 0.09061254077564335, 0.04099981499939592, 0.058107651473964], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 22, 0, 0.0, 153.77272727272725, 135, 410, 141.5, 147.8, 370.84999999999945, 410.0, 0.10761682540148414, 0.07997695715872014, 0.05401860181285434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 22, 0, 0.0, 248.49999999999997, 138, 575, 144.5, 430.6, 553.6999999999997, 575.0, 0.10761840470390263, 0.04349067633275611, 0.060554461027462265], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 22, 0, 0.0, 298.5909090909091, 137, 1241, 142.0, 927.9999999999995, 1226.4499999999998, 1241.0, 0.10747960330255509, 8.818184281718697, 0.06234656675948996], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 22, 0, 0.0, 291.5454545454545, 133, 1132, 142.0, 896.5999999999995, 1126.75, 1132.0, 0.10747592783479973, 2.899197502894522, 0.062449391661822104], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 28.571428571428573, 0.46296296296296297], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 4.761904761904762, 0.07716049382716049], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.761904761904762, 0.07716049382716049], "isController": false}, {"data": ["401/Unauthorized", 13, 61.904761904761905, 1.0030864197530864], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1296, 21, "401/Unauthorized", 13, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
