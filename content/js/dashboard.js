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

    var data = {"OkPercent": 98.00637958532695, "KoPercent": 1.9936204146730463};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7165300546448088, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f9646450-624e-4710-bb48-b39f9961e048"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=60afc7a7-9c6d-4932-825a-ac5a61a2055d"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.42857142857142855, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5ec641a6-da87-4d50-84c7-a038ada20156"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/18866a43-6ffe-402d-9626-d0c7cd866512"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b61a4b08-2311-4ca5-b395-5b82c2d6df3e"], "isController": false}, {"data": [0.75, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f09b77ab-c923-4886-a70c-f53895982dcc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7c3abbbd-1c58-4c75-b7cd-8a8e8a0d4e84"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/9bf18503-0c4e-4ff3-bf3e-a74d08745694"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=33e18e82-d34e-430d-b076-c155cc633f7e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=39982901-641e-4c9e-89ce-5907175f8e98"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5476190476190477, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5ec641a6-da87-4d50-84c7-a038ada20156"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/38dcf649-261d-443c-9cc7-af4d0ce8bb97"], "isController": false}, {"data": [0.43333333333333335, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bdc68103-779c-446f-b261-0d103dc82be6"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.1111111111111111, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=73a5ba5c-bad4-41a1-8fe4-285bea43ff17"], "isController": false}, {"data": [0.15217391304347827, 500, 1500, "register"], "isController": true}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=18866a43-6ffe-402d-9626-d0c7cd866512"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9bf18503-0c4e-4ff3-bf3e-a74d08745694"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f9646450-624e-4710-bb48-b39f9961e048"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.24545454545454545, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.15217391304347827, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/bf5f0b7e-85db-45f8-9339-31e1829c4ced"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.4642857142857143, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/33e18e82-d34e-430d-b076-c155cc633f7e"], "isController": false}, {"data": [0.24545454545454545, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/60afc7a7-9c6d-4932-825a-ac5a61a2055d"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/6935dd25-acc4-4199-8dd9-faa46e56a683"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9818181818181818, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.37272727272727274, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9151515151515152, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ec0876ec-5de9-402e-abbc-31251a3c4c68"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/39982901-641e-4c9e-89ce-5907175f8e98"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/7c3abbbd-1c58-4c75-b7cd-8a8e8a0d4e84"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b8188ecf-4115-4263-9ebf-ecbc527dfab9"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ec0876ec-5de9-402e-abbc-31251a3c4c68"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.6944444444444444, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f09b77ab-c923-4886-a70c-f53895982dcc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f92303fc-61e6-44c2-8d9d-55002e9e0ee3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/73a5ba5c-bad4-41a1-8fe4-285bea43ff17"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1254, 25, 1.9936204146730463, 496.00398724082805, 136, 3287, 159.0, 1382.5, 1649.5, 2233.000000000002, 4.959717130008662, 703.508835639414, 3.6108792114583705], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 2322.381818181817, 1689, 2935, 2353.0, 2737.2, 2865.3999999999996, 2935.0, 0.25535905805007825, 307.281824702971, 1.2555984934395936], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f9646450-624e-4710-bb48-b39f9961e048", 1, 0, 0.0, 472.0, 472, 472, 472.0, 472.0, 472.0, 472.0, 2.1186440677966103, 0.38276284427966106, 1.4607057733050848], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=60afc7a7-9c6d-4932-825a-ac5a61a2055d", 1, 0, 0.0, 362.0, 362, 362, 362.0, 362.0, 362.0, 362.0, 2.7624309392265194, 0.4990719958563536, 1.9045666436464088], "isController": false}, {"data": ["deleteBook", 14, 3, 21.428571428571427, 708.7857142857142, 142, 1564, 585.5, 1463.5, 1564.0, 1564.0, 0.07577807848443843, 0.015545712110960758, 0.05072839140730717], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, 21.428571428571427, 708.7857142857142, 142, 1564, 585.5, 1463.5, 1564.0, 1564.0, 0.07477633862999065, 0.015340207304045934, 0.0500577930965416], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 160.5, 138, 421, 139.5, 283.0, 421.0, 421.0, 0.10947078693857125, 0.029291987911297383, 0.062432558175903916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 163.71428571428572, 138, 420, 141.0, 296.5, 420.0, 420.0, 0.10947421100372212, 0.08135729938850833, 0.054950922320227705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 258.4285714285714, 136, 433, 142.0, 431.5, 433.0, 433.0, 0.10947934750308888, 0.029508105381691924, 0.0644687954534791], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 219.42857142857142, 137, 420, 144.0, 419.0, 420.0, 420.0, 0.1094784913863887, 0.029507874631487577, 0.06436137872520116], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5ec641a6-da87-4d50-84c7-a038ada20156", 1, 0, 0.0, 460.0, 460, 460, 460.0, 460.0, 460.0, 460.0, 2.1739130434782608, 0.39274796195652173, 1.4988111413043477], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/18866a43-6ffe-402d-9626-d0c7cd866512", 3, 0, 0.0, 412.0, 249, 532, 455.0, 532.0, 532.0, 532.0, 0.018674717544897135, 0.02574460573002583, 0.011975648946434684], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b61a4b08-2311-4ca5-b395-5b82c2d6df3e", 1, 0, 0.0, 278.0, 278, 278, 278.0, 278.0, 278.0, 278.0, 3.5971223021582737, 1.1486904226618704, 2.146329811151079], "isController": false}, {"data": ["goToProfile", 14, 3, 21.428571428571427, 257.50000000000006, 138, 576, 246.5, 461.0, 576.0, 576.0, 0.07576946598762793, 0.13068330189802513, 0.04896792008756786], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f09b77ab-c923-4886-a70c-f53895982dcc", 3, 0, 0.0, 374.33333333333337, 229, 663, 231.0, 663.0, 663.0, 663.0, 0.1173249902229175, 0.053086502737583106, 0.07523770531873289], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 180.49999999999997, 137, 414, 141.5, 412.0, 414.0, 414.0, 0.07001015147196343, 0.0520290285841447, 0.03514181431307539], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 160.71428571428572, 138, 413, 141.0, 280.0, 413.0, 413.0, 0.06991819571101812, 0.026209569179060498, 0.03945578985087447], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 1046.0, 963, 1090, 1085.0, 1090.0, 1090.0, 1090.0, 0.031826861871419476, 9.3581541414704, 0.018151257161043922], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 1295.6666666666667, 1146, 1497, 1244.0, 1497.0, 1497.0, 1497.0, 0.03177494863049971, 28.59115463212553, 0.018090620167559895], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 147.66666666666666, 137, 165, 141.0, 165.0, 165.0, 165.0, 0.032150550310252816, 0.05689140347868954, 0.017802111353431], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 142.58333333333334, 139, 147, 142.0, 146.7, 147.0, 147.0, 0.06466283718975309, 0.048055096778712995, 0.03245771319876278], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 162.91666666666666, 136, 414, 140.0, 333.0000000000003, 414.0, 414.0, 0.06456993731335253, 0.017277502757674406, 0.036825042374021365], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7c3abbbd-1c58-4c75-b7cd-8a8e8a0d4e84", 1, 0, 0.0, 1211.0, 1211, 1211, 1211.0, 1211.0, 1211.0, 1211.0, 0.8257638315441783, 0.1491858484723369, 0.5693254541701073], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 209.91666666666666, 139, 413, 144.5, 412.7, 413.0, 413.0, 0.0645706322002981, 0.017403803210236598, 0.037960469320878376], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 162.50000000000003, 138, 408, 139.5, 328.8000000000003, 408.0, 408.0, 0.06466562483159993, 0.017429406692892172, 0.038079464622514415], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 144.0, 140, 151, 141.0, 151.0, 151.0, 151.0, 0.032147105153180956, 0.023890573263252644, 0.018051352991288135], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 259.35714285714283, 136, 1517, 141.0, 969.0, 1517.0, 1517.0, 0.07001435294235318, 4.517454398464185, 0.04073100610625178], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 1021.7333333333332, 137, 1812, 1224.0, 1715.4, 1812.0, 1812.0, 0.07920332020318292, 47.518640418906365, 0.04202519919635031], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 229.0, 138, 1080, 140.0, 756.0, 1080.0, 1080.0, 0.0699115618742291, 1.4858060022821131, 0.04073948018256905], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 796.5333333333333, 138, 1360, 1097.0, 1299.4, 1360.0, 1360.0, 0.07920122920307723, 15.532309811448274, 0.04210143466426599], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9bf18503-0c4e-4ff3-bf3e-a74d08745694", 3, 0, 0.0, 1396.0, 346, 3280, 562.0, 3280.0, 3280.0, 3280.0, 0.03042812370046555, 0.025366674738571703, 0.019512826721978235], "isController": false}, {"data": ["deleteBooks", 14, 3, 21.428571428571427, 455.92857142857144, 139, 1211, 465.0, 1004.0, 1211.0, 1211.0, 0.07494486199438984, 0.015374779514892615, 0.050526094529560396], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=33e18e82-d34e-430d-b076-c155cc633f7e", 1, 0, 0.0, 526.0, 526, 526, 526.0, 526.0, 526.0, 526.0, 1.9011406844106464, 0.34346779942965777, 1.3107473859315588], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=39982901-641e-4c9e-89ce-5907175f8e98", 1, 0, 0.0, 266.0, 266, 266, 266.0, 266.0, 266.0, 266.0, 3.7593984962406015, 0.679188204887218, 2.5919290413533833], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 354.16666666666663, 281, 559, 288.5, 558.7, 559.0, 559.0, 0.06451855715000027, 0.09999116230180706, 0.14510374718403382], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 935.0476190476189, 260, 2035, 783.0, 1615.0, 1995.7999999999995, 2035.0, 0.09537694330521984, 0.05858603255760086, 0.043124535888981234], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 141.2, 138, 149, 140.0, 148.4, 149.0, 149.0, 0.07920290199432907, 0.05886075040789494, 0.03975614416512221], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 232.66666666666666, 138, 418, 144.0, 417.4, 418.0, 418.0, 0.0792016473942658, 0.1004974028459792, 0.04073522229262369], "isController": false}, {"data": ["login", 21, 0, 0.0, 3361.333333333333, 1877, 5218, 3375.0, 5076.8, 5217.0, 5218.0, 0.09284886857021585, 15.999007712259145, 0.16208396936650543], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 146.57142857142856, 140, 160, 145.5, 155.0, 160.0, 160.0, 0.0698536565894451, 0.05655144659438476, 0.024830791990779318], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5ec641a6-da87-4d50-84c7-a038ada20156", 3, 0, 0.0, 368.0, 250, 595, 259.0, 595.0, 595.0, 595.0, 0.02448739715293196, 0.02455913757427844, 0.01570318111695181], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/38dcf649-261d-443c-9cc7-af4d0ce8bb97", 1, 0, 0.0, 250.0, 250, 250, 250.0, 250.0, 250.0, 250.0, 4.0, 1.27734375, 2.38671875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 1164.466666666667, 280, 1953, 1370.0, 1856.4, 1953.0, 1953.0, 0.07914272599205406, 63.162361755794564, 0.16449424005835456], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bdc68103-779c-446f-b261-0d103dc82be6", 1, 0, 0.0, 405.0, 405, 405, 405.0, 405.0, 405.0, 405.0, 2.4691358024691357, 0.7884837962962963, 1.4732831790123455], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 465.14285714285717, 280, 833, 556.0, 709.5, 833.0, 833.0, 0.10934937124111536, 0.1694701681246583, 0.24592929879715691], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 6, 66.66666666666667, 573.0, 137, 1649, 140.0, 1649.0, 1649.0, 1649.0, 0.06648592345254013, 26.52528635117865, 0.07934160005762114], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=73a5ba5c-bad4-41a1-8fe4-285bea43ff17", 1, 0, 0.0, 496.0, 496, 496, 496.0, 496.0, 496.0, 496.0, 2.0161290322580645, 0.3642420614919355, 1.3900264616935485], "isController": false}, {"data": ["register", 23, 5, 21.73913043478261, 1518.0, 503, 2678, 1488.0, 2436.8000000000006, 2653.9999999999995, 2678.0, 0.09141821448302999, 0.02894082061758966, 0.0412453272374608], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 463.57142857142856, 280, 1928, 286.0, 1387.0, 1928.0, 1928.0, 0.06985923364420693, 6.070244044188461, 0.15583832951602522], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 145.55555555555554, 140, 159, 144.5, 151.8, 159.0, 159.0, 0.10277727023570254, 0.07979290023181984, 0.03653410777909739], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=18866a43-6ffe-402d-9626-d0c7cd866512", 1, 0, 0.0, 600.0, 600, 600, 600.0, 600.0, 600.0, 600.0, 1.6666666666666667, 0.30110677083333337, 1.1490885416666667], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9bf18503-0c4e-4ff3-bf3e-a74d08745694", 1, 0, 0.0, 470.0, 470, 470, 470.0, 470.0, 470.0, 470.0, 2.127659574468085, 0.38439162234042556, 1.4669215425531916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 571.1176470588236, 280, 1670, 291.0, 1652.4, 1670.0, 1670.0, 0.08763473841030585, 12.454145807773202, 0.19445467834184765], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 187.75, 139, 425, 140.5, 422.0, 425.0, 425.0, 0.06192589534523686, 0.04602109995871607, 0.0310838966869646], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 165.75, 137, 414, 140.5, 342.0000000000002, 414.0, 414.0, 0.06183845733661764, 0.016546618467024644, 0.03526724519978975], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 190.66666666666666, 138, 416, 145.0, 415.1, 416.0, 416.0, 0.06192653448791916, 0.016691136248696965, 0.03640602906418686], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 246.0, 138, 547, 145.0, 512.5000000000001, 547.0, 547.0, 0.06179642198716695, 0.01665606686372859, 0.03638988521314616], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f9646450-624e-4710-bb48-b39f9961e048", 3, 0, 0.0, 407.66666666666663, 240, 743, 240.0, 743.0, 743.0, 743.0, 0.0185349940688019, 0.02223354594516113, 0.011886047628756426], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 149.33333333333334, 139, 162, 147.0, 162.0, 162.0, 162.0, 0.04166145898429363, 0.012286875598883473, 0.025753616735408075], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1597.4545454545453, 1100, 2350, 1517.0, 2135.3999999999996, 2279.9999999999995, 2350.0, 0.2422459280661728, 289.8103482780719, 0.4783410806150404], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, 21.73913043478261, 1518.0, 503, 2678, 1488.0, 2436.8000000000006, 2653.9999999999995, 2678.0, 0.09286325683554321, 0.02939828647103474, 0.0418972897050986], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 319.25000000000006, 139, 431, 421.5, 431.0, 431.0, 431.0, 0.05194973862787753, 0.014002077989545114, 0.030591496477158347], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bf5f0b7e-85db-45f8-9339-31e1829c4ced", 1, 0, 0.0, 550.0, 550, 550, 550.0, 550.0, 550.0, 550.0, 1.8181818181818181, 0.5806107954545454, 1.084872159090909], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 208.25, 136, 416, 140.0, 416.0, 416.0, 416.0, 0.051954124508059384, 0.014003260121312882, 0.030543342728370847], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 417.55555555555554, 138, 1560, 144.5, 1498.8000000000002, 1560.0, 1560.0, 0.09949588750331653, 14.943443454207017, 0.057067628183868395], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 304.2222222222222, 137, 862, 140.5, 859.3, 862.0, 862.0, 0.0994876386608964, 4.897790700807509, 0.05716005281135486], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 158.11111111111111, 138, 417, 141.5, 178.50000000000037, 417.0, 417.0, 0.09964625579193861, 0.07405351626725125, 0.05001774948931294], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 208.625, 137, 415, 141.0, 415.0, 415.0, 415.0, 0.05204843106510608, 0.013927021593592838, 0.02968387084181831], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 216.11111111111111, 136, 418, 141.0, 416.2, 418.0, 418.0, 0.09964956569397618, 0.051608873378618525, 0.05543655851920745], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 209.875, 138, 417, 141.5, 417.0, 417.0, 417.0, 0.05204707658076731, 0.03867951687301164, 0.026125192736830463], "isController": false}, {"data": ["deleteAccount", 14, 3, 21.428571428571427, 595.4285714285714, 137, 1230, 547.0, 1218.0, 1230.0, 1230.0, 0.0751161617787507, 0.01496978754198457, 0.05111315277285946], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 151.0, 144, 176, 147.5, 176.0, 176.0, 176.0, 0.050393700787401574, 0.03966535433070866, 0.017913385826771655], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1717.2380952380952, 1011, 3287, 1620.0, 2381.0, 3197.9999999999986, 3287.0, 0.09507467889659044, 0.049208574038274354, 0.043730638437787205], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 530.25, 280, 848, 567.0, 848.0, 848.0, 848.0, 0.05190187949681128, 0.08043777613421826, 0.11672854343862928], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/33e18e82-d34e-430d-b076-c155cc633f7e", 3, 0, 0.0, 451.6666666666667, 300, 533, 522.0, 533.0, 533.0, 533.0, 0.021076592336551028, 0.021138340165662017, 0.013515913705405443], "isController": false}, {"data": ["addBook", 55, 8, 14.545454545454545, 1521.1090909090913, 718, 4562, 1166.0, 2553.3999999999996, 2871.7999999999984, 4562.0, 0.27627362139462924, 97.22748138449502, 1.0018254465586354], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/60afc7a7-9c6d-4932-825a-ac5a61a2055d", 3, 0, 0.0, 332.0, 252, 486, 258.0, 486.0, 486.0, 486.0, 0.06390184676337146, 0.02891392154983279, 0.040978723347604745], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 250.18181818181816, 139, 583, 146.0, 560.4, 570.9999999999999, 583.0, 0.24372086427849762, 0.18112458761321942, 0.1178142849783753], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6935dd25-acc4-4199-8dd9-faa46e56a683", 1, 0, 0.0, 550.0, 550, 550, 550.0, 550.0, 550.0, 550.0, 1.8181818181818181, 0.5806107954545454, 1.084872159090909], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 911.6363636363636, 681, 1298, 828.0, 1234.2, 1256.6, 1298.0, 0.24363233665559245, 71.6359963316722, 0.12252993493909192], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 225.41818181818184, 137, 567, 147.0, 425.8, 455.5999999999995, 567.0, 0.24421217153462926, 0.43214106916088696, 0.11876724748461463], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1345.109090909091, 954, 1784, 1294.0, 1712.2, 1776.6, 1784.0, 0.24288565826429492, 218.54894225365877, 0.12191721518344492], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 178.70588235294116, 140, 438, 147.0, 418.79999999999995, 438.0, 438.0, 0.08794801754821621, 0.06570335295350137, 0.03126277186284248], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 165, 8, 4.848484848484849, 248.29090909090922, 138, 2500, 150.0, 420.6, 563.2999999999995, 2047.2400000000023, 0.6918006943163332, 1.5354364096277693, 0.3306894121476009], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 174.16666666666669, 139, 452, 148.0, 367.1000000000003, 452.0, 452.0, 0.06298088530131106, 0.04877328324603483, 0.022387736571950412], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ec0876ec-5de9-402e-abbc-31251a3c4c68", 3, 0, 0.0, 770.0, 231, 1206, 873.0, 1206.0, 1206.0, 1206.0, 0.03405955881518148, 0.028394052775286383, 0.0218415790579126], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/39982901-641e-4c9e-89ce-5907175f8e98", 3, 0, 0.0, 486.33333333333337, 257, 881, 321.0, 881.0, 881.0, 881.0, 0.07450084434290255, 0.03370969193900864, 0.047775606561041024], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 173.92857142857142, 142, 510, 148.0, 333.0, 510.0, 510.0, 0.11133200795228629, 0.0903485337972167, 0.03957504970178927], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7c3abbbd-1c58-4c75-b7cd-8a8e8a0d4e84", 3, 0, 0.0, 740.0, 498, 1146, 576.0, 1146.0, 1146.0, 1146.0, 0.030564838210123076, 0.030654383634566795, 0.01960049846156981], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b8188ecf-4115-4263-9ebf-ecbc527dfab9", 1, 0, 0.0, 264.0, 264, 264, 264.0, 264.0, 264.0, 264.0, 3.787878787878788, 1.2096058238636362, 2.260150331439394], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ec0876ec-5de9-402e-abbc-31251a3c4c68", 1, 0, 0.0, 797.0, 797, 797, 797.0, 797.0, 797.0, 797.0, 1.2547051442910915, 0.22668012860727726, 0.865060382685069], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 436.0833333333333, 281, 963, 290.5, 926.7000000000002, 963.0, 963.0, 0.061751265900950966, 0.09570240135235272, 0.13888004430653328], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 608.9444444444445, 280, 1702, 426.0, 1646.2, 1702.0, 1702.0, 0.09940851931010489, 19.949578005658, 0.2193329895455374], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f09b77ab-c923-4886-a70c-f53895982dcc", 1, 0, 0.0, 275.0, 275, 275, 275.0, 275.0, 275.0, 275.0, 3.6363636363636362, 0.6569602272727272, 2.5071022727272725], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 146.91666666666666, 139, 153, 147.5, 152.1, 153.0, 153.0, 0.06353475615890042, 0.05267676560440084, 0.022584620353359137], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 166.26666666666668, 140, 422, 146.0, 271.4000000000001, 422.0, 422.0, 0.07950136742351968, 0.061722253029002104, 0.028260251701329266], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f92303fc-61e6-44c2-8d9d-55002e9e0ee3", 1, 0, 0.0, 348.0, 348, 348, 348.0, 348.0, 348.0, 348.0, 2.8735632183908044, 0.9176320043103449, 1.7145968031609196], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/73a5ba5c-bad4-41a1-8fe4-285bea43ff17", 3, 0, 0.0, 605.0, 244, 1230, 341.0, 1230.0, 1230.0, 1230.0, 0.02650457645686822, 0.0265822265832067, 0.016996749876311976], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 160.17647058823533, 138, 434, 141.0, 214.7999999999998, 434.0, 434.0, 0.08782125791037065, 0.06526560280253133, 0.044082154849541526], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 197.94117647058823, 137, 551, 140.0, 447.7999999999999, 551.0, 551.0, 0.08782352637288837, 0.03901810391589606, 0.049219113240688124], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 384.70588235294116, 137, 1520, 144.0, 1507.2, 1520.0, 1520.0, 0.08769938713604755, 9.304628899398486, 0.05067098091764512], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 317.8235294117647, 138, 1113, 140.0, 1108.2, 1113.0, 1113.0, 0.08769983956088175, 3.054582187646704, 0.050756886694386695], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 20.0, 0.39872408293460926], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 12.0, 0.23923444976076555], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 12.0, 0.23923444976076555], "isController": false}, {"data": ["401/Unauthorized", 14, 56.0, 1.1164274322169059], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1254, 25, "401/Unauthorized", 14, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 165, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
