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

    var data = {"OkPercent": 97.14285714285714, "KoPercent": 2.857142857142857};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7519280205655527, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.12280701754385964, 500, 1500, "see books"], "isController": true}, {"data": [0.46875, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.46875, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/dbb593d1-2819-4d9d-ac64-3ba38ed877f6"], "isController": false}, {"data": [0.8125, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0295c013-44ce-4d92-bbee-f9fbedf693b5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/085c5353-5460-4917-b870-2f7739b7276f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.4375, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b7a7c0db-5c31-4b14-b290-a81020b48a24"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=40809bf4-babf-4720-b9d9-dcd72c571822"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.65625, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/53dee5f4-90f7-4b34-824c-3c0a0322476b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/57a1c320-1504-464e-ba2f-9fd2fd047350"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/bd3bdf38-3b70-424e-a1ed-0f1a6840ce2d"], "isController": false}, {"data": [0.6956521739130435, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/0aaaabab-173d-4c93-b38d-26a0a8a46642"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/57e80707-25e8-499a-a69f-16e3bf2eb246"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b160d53c-0ae1-44b5-ba3d-551d7aa856fd"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/38398088-bf11-41f3-8ca3-cd6ad635cb59"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.28, 500, 1500, "register"], "isController": true}, {"data": [0.8611111111111112, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9047619047619048, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ba6f8a97-f45a-4cdc-82f6-412737e8c422"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0295c013-44ce-4d92-bbee-f9fbedf693b5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.42105263157894735, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.28, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/01d92816-e094-45eb-b5d7-8d7e2616bbed"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.65625, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.2826086956521739, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=57a1c320-1504-464e-ba2f-9fd2fd047350"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/40809bf4-babf-4720-b9d9-dcd72c571822"], "isController": false}, {"data": [0.19298245614035087, 500, 1500, "addBook"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=53dee5f4-90f7-4b34-824c-3c0a0322476b"], "isController": false}, {"data": [0.9912280701754386, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8016456f-38e0-485e-8a95-4dff8a571c5b"], "isController": false}, {"data": [0.5526315789473685, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8508771929824561, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b7a7c0db-5c31-4b14-b290-a81020b48a24"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=085c5353-5460-4917-b870-2f7739b7276f"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dbb593d1-2819-4d9d-ac64-3ba38ed877f6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bd3bdf38-3b70-424e-a1ed-0f1a6840ce2d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0aaaabab-173d-4c93-b38d-26a0a8a46642"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=01d92816-e094-45eb-b5d7-8d7e2616bbed"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b160d53c-0ae1-44b5-ba3d-551d7aa856fd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ba6f8a97-f45a-4cdc-82f6-412737e8c422"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=57e80707-25e8-499a-a69f-16e3bf2eb246"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=38398088-bf11-41f3-8ca3-cd6ad635cb59"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1330, 38, 2.857142857142857, 385.30150375939843, 93, 7161, 120.0, 1011.9000000000001, 1254.2500000000002, 1788.840000000002, 5.224578301894205, 755.3169536583832, 3.818409015245555], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1749.473684210526, 1184, 3032, 1733.0, 2241.0, 2352.6999999999994, 3032.0, 0.2434388947020009, 292.93934614501694, 1.1969871433833734], "isController": true}, {"data": ["deleteBook", 16, 2, 12.5, 851.5624999999999, 106, 3268, 635.5, 2006.6000000000013, 3268.0, 3268.0, 0.08397363227946425, 0.01637034799198052, 0.05657354450077676], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 2, 12.5, 851.5624999999999, 106, 3268, 635.5, 2006.6000000000013, 3268.0, 3268.0, 0.08532650721275631, 0.016634085939791484, 0.05748498453457057], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 113.33333333333334, 98, 306, 101.5, 133.20000000000027, 306.0, 306.0, 0.11731581417175034, 0.050969240445278695, 0.06581193134417854], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 135.9444444444445, 100, 308, 103.0, 298.1, 308.0, 308.0, 0.11716385364932859, 0.08707196545619048, 0.058810762476323136], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 216.66666666666663, 97, 804, 103.0, 677.1000000000003, 804.0, 804.0, 0.11731352038322417, 3.8607808273861894, 0.06796190161957832], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 255.7222222222222, 97, 1102, 102.0, 1087.6, 1102.0, 1102.0, 0.11731275580698142, 11.75679772429547, 0.06784689544826507], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dbb593d1-2819-4d9d-ac64-3ba38ed877f6", 3, 0, 0.0, 450.3333333333333, 369, 557, 425.0, 557.0, 557.0, 557.0, 0.03648081717030461, 0.030412556241259804, 0.02339427403173831], "isController": false}, {"data": ["goToProfile", 16, 2, 12.5, 368.87499999999994, 102, 1800, 268.5, 885.1000000000009, 1800.0, 1800.0, 0.08451656524678837, 0.1221115803541244, 0.0546283218971856], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/0295c013-44ce-4d92-bbee-f9fbedf693b5", 3, 0, 0.0, 682.3333333333334, 319, 1315, 413.0, 1315.0, 1315.0, 1315.0, 0.03781099543747322, 0.024308826819339064, 0.02424728548561922], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/085c5353-5460-4917-b870-2f7739b7276f", 3, 0, 0.0, 364.6666666666667, 200, 493, 401.0, 493.0, 493.0, 493.0, 0.09116047281898569, 0.0412477399799447, 0.0584590271658209], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 124.61111111111113, 97, 304, 103.0, 298.6, 304.0, 304.0, 0.10189871267959648, 0.07572746127848919, 0.05114837726300058], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 134.94444444444446, 96, 304, 102.0, 301.3, 304.0, 304.0, 0.10189179091804504, 0.044268091453543004, 0.05715934885484949], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 748.125, 568, 846, 790.0, 846.0, 846.0, 846.0, 0.05001187782098248, 14.705152629999626, 0.028522399069779075], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 1061.125, 805, 1516, 1050.5, 1516.0, 1516.0, 1516.0, 0.049945372249102546, 44.940933744342125, 0.028435695333229278], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 176.5, 99, 308, 103.5, 308.0, 308.0, 308.0, 0.05017120925157098, 0.08877952262094396, 0.027780347310196043], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 175.26666666666668, 100, 385, 106.0, 335.8, 385.0, 385.0, 0.08254957101739595, 0.06134787455492023, 0.041436015139591324], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 128.53333333333333, 99, 303, 102.0, 301.2, 303.0, 303.0, 0.08267833717328277, 0.022122914438944805, 0.047152489169137835], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 179.79999999999998, 99, 304, 105.0, 303.4, 304.0, 304.0, 0.08258774948382656, 0.02225997935306263, 0.04855256366139023], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 193.53333333333333, 99, 303, 108.0, 302.4, 303.0, 303.0, 0.08267833717328277, 0.022284395566236372, 0.048686559878407726], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b7a7c0db-5c31-4b14-b290-a81020b48a24", 1, 0, 0.0, 446.0, 446, 446, 446.0, 446.0, 446.0, 446.0, 2.242152466367713, 0.40507637331838564, 1.5458590246636772], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 101.5, 96, 104, 101.5, 104.0, 104.0, 104.0, 0.05023421703693471, 0.037332264809675116, 0.028207690230700643], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=40809bf4-babf-4720-b9d9-dcd72c571822", 1, 0, 0.0, 219.0, 219, 219, 219.0, 219.0, 219.0, 219.0, 4.5662100456621, 0.8249500570776256, 3.148187785388128], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 13, 0, 0.0, 863.1538461538463, 100, 1306, 1078.0, 1290.0, 1306.0, 1306.0, 0.07357768671752961, 50.93175483844038, 0.03839172265173983], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 252.61111111111111, 96, 1264, 102.0, 1098.4000000000003, 1264.0, 1264.0, 0.1017840481777828, 10.2005485912805, 0.0588659914049026], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 13, 0, 0.0, 615.7692307692308, 97, 903, 785.0, 869.0, 903.0, 903.0, 0.07357851960018563, 16.64652100949729, 0.03846401126034345], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 217.8888888888889, 99, 785, 104.0, 621.2000000000003, 785.0, 785.0, 0.10178692603483375, 3.3498015508369146, 0.05896705708550102], "isController": false}, {"data": ["deleteBooks", 16, 2, 12.5, 540.8125, 112, 1510, 374.0, 1148.1000000000004, 1510.0, 1510.0, 0.08556653065153565, 0.016680877618469536, 0.05823161723416885], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/53dee5f4-90f7-4b34-824c-3c0a0322476b", 3, 0, 0.0, 502.66666666666663, 204, 976, 328.0, 976.0, 976.0, 976.0, 0.0412138863321015, 0.02612091038040417, 0.026429477888749983], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/57a1c320-1504-464e-ba2f-9fd2fd047350", 3, 0, 0.0, 328.3333333333333, 235, 487, 263.0, 487.0, 487.0, 487.0, 0.06090381257866742, 0.028271105708717364, 0.039056155852856385], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 384.5333333333333, 202, 689, 402.0, 640.4, 689.0, 689.0, 0.08241260143617694, 0.12772343601485625, 0.1853478721753081], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bd3bdf38-3b70-424e-a1ed-0f1a6840ce2d", 3, 0, 0.0, 961.6666666666666, 215, 1800, 870.0, 1800.0, 1800.0, 1800.0, 0.05919494869771113, 0.026784172750591948, 0.0379603023875296], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 599.8260869565217, 108, 1729, 562.0, 1337.2000000000007, 1692.3999999999994, 1729.0, 0.10778690061110485, 0.06620894578553219, 0.04873567869427886], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 13, 0, 0.0, 105.3846153846154, 99, 128, 104.0, 120.0, 128.0, 128.0, 0.07357727028327249, 0.05467998309137731, 0.03693234074765826], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 13, 0, 0.0, 179.0, 98, 307, 103.0, 307.0, 307.0, 307.0, 0.07357810315650062, 0.10469624624327185, 0.03720911887391543], "isController": false}, {"data": ["login", 23, 0, 0.0, 3077.2608695652175, 1813, 10013, 2614.0, 4439.400000000001, 8920.199999999984, 10013.0, 0.10328769214878816, 43.11858556767814, 0.21541220069023123], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 173.5, 102, 1233, 105.5, 267.30000000000155, 1233.0, 1233.0, 0.10559600143141247, 0.08548738787757904, 0.0375360786338224], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0aaaabab-173d-4c93-b38d-26a0a8a46642", 3, 0, 0.0, 1068.6666666666667, 232, 1563, 1411.0, 1563.0, 1563.0, 1563.0, 0.0782513433147269, 0.0354066950545151, 0.050180711695967446], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/57e80707-25e8-499a-a69f-16e3bf2eb246", 3, 0, 0.0, 790.6666666666666, 236, 1749, 387.0, 1749.0, 1749.0, 1749.0, 0.02673892117366038, 0.02681725785678634, 0.01714702952868195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 13, 0, 0.0, 969.3076923076924, 206, 1411, 1202.0, 1395.0, 1411.0, 1411.0, 0.07353481873667182, 67.69799802339821, 0.15090878253208664], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b160d53c-0ae1-44b5-ba3d-551d7aa856fd", 1, 0, 0.0, 815.0, 815, 815, 815.0, 815.0, 815.0, 815.0, 1.2269938650306749, 0.22167369631901843, 0.845954754601227], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/38398088-bf11-41f3-8ca3-cd6ad635cb59", 3, 0, 0.0, 505.6666666666667, 324, 674, 519.0, 674.0, 674.0, 674.0, 0.0827084252315836, 0.03833880127922364, 0.05303893154499339], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 416.8888888888889, 202, 1395, 221.0, 1224.9000000000003, 1395.0, 1395.0, 0.11708611683893504, 15.725265151268758, 0.2600008009015631], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 4, 33.333333333333336, 809.6666666666666, 102, 1621, 1001.5, 1516.6000000000004, 1621.0, 1621.0, 0.07081233550884564, 56.48376369038487, 0.12208904134850292], "isController": false}, {"data": ["register", 25, 9, 36.0, 952.24, 120, 2118, 998.0, 1543.0000000000005, 1983.2999999999997, 2118.0, 0.10073820959994842, 0.03138624842848393, 0.045450246909351726], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 419.2222222222222, 201, 1563, 210.0, 1222.8000000000006, 1563.0, 1563.0, 0.1017236507487991, 13.662007276066687, 0.22588699138174628], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 11, 0, 0.0, 259.72727272727275, 98, 1175, 108.0, 1075.2000000000003, 1175.0, 1175.0, 0.05772126923823667, 0.04481289945742007, 0.02051810742452944], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 21, 0, 0.0, 335.47619047619054, 202, 618, 208.0, 611.6, 617.5, 618.0, 0.10735482815559293, 0.1663790159012949, 0.2414435246507134], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ba6f8a97-f45a-4cdc-82f6-412737e8c422", 1, 0, 0.0, 993.0, 993, 993, 993.0, 993.0, 993.0, 993.0, 1.0070493454179255, 0.18193762588116819, 0.6943133182275931], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0295c013-44ce-4d92-bbee-f9fbedf693b5", 1, 0, 0.0, 980.0, 980, 980, 980.0, 980.0, 980.0, 980.0, 1.0204081632653061, 0.18435108418367346, 0.7035235969387755], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 122.8, 97, 305, 103.5, 285.4000000000001, 305.0, 305.0, 0.05363023028820886, 0.03985605981379584, 0.026919861687636087], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 120.89999999999999, 98, 301, 101.0, 281.20000000000005, 301.0, 301.0, 0.05363253134821457, 0.014350892177158977, 0.030587303034528623], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 119.5, 93, 296, 100.5, 276.80000000000007, 296.0, 296.0, 0.0535756380858496, 0.014440308702826652, 0.03149661535906393], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 120.7, 98, 302, 100.5, 282.20000000000005, 302.0, 302.0, 0.05363195606470159, 0.014455488158064102, 0.031582099127944394], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 112.5, 112, 113, 112.5, 113.0, 113.0, 113.0, 0.025036302638826297, 0.0073837533173101, 0.015476542549196335], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1140.9649122807016, 780, 2041, 1045.0, 1614.2, 1733.1999999999994, 2041.0, 0.23995655523421022, 287.0714624562711, 0.4738204635581768], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 9, 36.0, 952.24, 120, 2118, 998.0, 1543.0000000000005, 1983.2999999999997, 2118.0, 0.1019592489273887, 0.03176667849393954, 0.0460011455121617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 149.875, 100, 298, 101.5, 298.0, 298.0, 298.0, 0.03511174312248731, 0.00946371201348291, 0.020676153420761574], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 150.375, 100, 296, 103.5, 296.0, 296.0, 296.0, 0.03511143491656645, 0.009463628942355801, 0.020641683417747074], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/01d92816-e094-45eb-b5d7-8d7e2616bbed", 3, 0, 0.0, 368.6666666666667, 192, 597, 317.0, 597.0, 597.0, 597.0, 0.02760651513757247, 0.0326299662970461, 0.017703396751633384], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 11, 0, 0.0, 212.1818181818182, 100, 912, 104.0, 788.8000000000004, 912.0, 912.0, 0.0579575750550597, 4.755140153600745, 0.0336199214674858], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 11, 0, 0.0, 166.63636363636363, 97, 804, 102.0, 665.4000000000005, 804.0, 804.0, 0.05795726968571353, 1.5634158730472352, 0.0336763432255855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 126.62499999999997, 98, 302, 101.5, 302.0, 302.0, 302.0, 0.035111280815635054, 0.009395010686996098, 0.020024402340166867], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 11, 0, 0.0, 102.54545454545455, 99, 104, 103.0, 104.0, 104.0, 104.0, 0.057956353596982056, 0.04307107918681967, 0.029091372801610133], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 128.12499999999997, 100, 306, 103.0, 306.0, 306.0, 306.0, 0.03511097261783023, 0.026093213048992973, 0.017624062427309316], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 11, 0, 0.0, 172.18181818181822, 99, 301, 105.0, 300.2, 301.0, 301.0, 0.0578974793542852, 0.023397489881099628, 0.03257761222900032], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 106.5, 100, 115, 106.0, 115.0, 115.0, 115.0, 0.035862538888440605, 0.028227740570393678, 0.012748011870500372], "isController": false}, {"data": ["deleteAccount", 16, 2, 12.5, 552.5000000000001, 102, 1411, 461.5, 1106.5000000000002, 1411.0, 1411.0, 0.08517796871839099, 0.016313993276264094, 0.057967184522098356], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1706.6956521739128, 715, 7161, 1305.0, 2271.0, 6192.199999999986, 7161.0, 0.10933221782780651, 0.05658796430540767, 0.0502885494110321], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 305.5, 201, 608, 213.0, 608.0, 608.0, 608.0, 0.03509510774198076, 0.054390562486839336, 0.07892971985330245], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=57a1c320-1504-464e-ba2f-9fd2fd047350", 1, 0, 0.0, 291.0, 291, 291, 291.0, 291.0, 291.0, 291.0, 3.4364261168384878, 0.6208387027491409, 2.3692547250859106], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/40809bf4-babf-4720-b9d9-dcd72c571822", 3, 0, 0.0, 379.0, 271, 565, 301.0, 565.0, 565.0, 565.0, 0.06624710168930109, 0.02997508832946892, 0.04248267914320415], "isController": false}, {"data": ["addBook", 57, 21, 36.8421052631579, 1155.0877192982455, 527, 4245, 851.0, 1832.2000000000003, 2163.7999999999906, 4245.0, 0.263441282635522, 84.04551876123669, 0.9543066583628742], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=53dee5f4-90f7-4b34-824c-3c0a0322476b", 1, 0, 0.0, 1510.0, 1510, 1510, 1510.0, 1510.0, 1510.0, 1510.0, 0.6622516556291391, 0.11964507450331126, 0.4565914735099338], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 195.98245614035088, 100, 699, 106.0, 410.4, 413.29999999999995, 699.0, 0.2409495950355929, 0.17906507990438106, 0.11647465775646337], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8016456f-38e0-485e-8a95-4dff8a571c5b", 1, 0, 0.0, 199.0, 199, 199, 199.0, 199.0, 199.0, 199.0, 5.025125628140704, 1.6047032035175879, 2.998390389447236], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 649.6315789473684, 474, 1001, 600.0, 863.6000000000001, 922.0, 1001.0, 0.24086915733826905, 70.82352986619084, 0.12114025002852398], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 142.12280701754386, 97, 318, 103.0, 302.6, 308.29999999999995, 318.0, 0.24139449789944437, 0.4271551076111262, 0.11739693354875323], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 942.9122807017546, 678, 1407, 906.0, 1203.8, 1307.8999999999999, 1407.0, 0.2407003112212796, 216.5825631429232, 0.12082027340599386], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 21, 0, 0.0, 107.33333333333331, 104, 122, 106.0, 110.8, 120.89999999999998, 122.0, 0.10710405924384533, 0.08001426300931805, 0.03807214605933565], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 21, 12.280701754385966, 197.1345029239767, 95, 2815, 107.0, 320.00000000000017, 483.6000000000006, 2550.0400000000004, 0.685538348053031, 1.5816272966536908, 0.32521807060042734], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 195.29999999999998, 101, 979, 105.0, 895.1000000000003, 979.0, 979.0, 0.05577307053062499, 0.043191450127720334, 0.019825583665183104], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b7a7c0db-5c31-4b14-b290-a81020b48a24", 3, 0, 0.0, 401.0, 358, 436, 409.0, 436.0, 436.0, 436.0, 0.05142710208279763, 0.03306267142367361, 0.03297896845804406], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 117.44444444444446, 97, 313, 105.5, 139.30000000000027, 313.0, 313.0, 0.11817304472849743, 0.0959001954779115, 0.042006824493333074], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=085c5353-5460-4917-b870-2f7739b7276f", 1, 0, 0.0, 231.0, 231, 231, 231.0, 231.0, 231.0, 231.0, 4.329004329004329, 0.7820955086580086, 2.9846455627705626], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 264.6, 199, 608, 206.5, 587.0000000000001, 608.0, 608.0, 0.053545229655489995, 0.0829846479133424, 0.12042447646151704], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 11, 0, 0.0, 349.6363636363636, 200, 1016, 211.0, 893.6000000000004, 1016.0, 1016.0, 0.0578658039401352, 6.374947805702412, 0.12879559397932613], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dbb593d1-2819-4d9d-ac64-3ba38ed877f6", 1, 0, 0.0, 427.0, 427, 427, 427.0, 427.0, 427.0, 427.0, 2.34192037470726, 0.42310084894613587, 1.6146443208430914], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bd3bdf38-3b70-424e-a1ed-0f1a6840ce2d", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 0.7314334514170041, 2.791308198380567], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0aaaabab-173d-4c93-b38d-26a0a8a46642", 1, 0, 0.0, 303.0, 303, 303, 303.0, 303.0, 303.0, 303.0, 3.3003300330033003, 0.5962510313531353, 2.2754228547854787], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 171.33333333333331, 102, 881, 108.0, 521.0000000000002, 881.0, 881.0, 0.08414580785585263, 0.06976542077111218, 0.02991120513626011], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=01d92816-e094-45eb-b5d7-8d7e2616bbed", 1, 0, 0.0, 960.0, 960, 960, 960.0, 960.0, 960.0, 960.0, 1.0416666666666667, 0.18819173177083334, 0.7181803385416667], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b160d53c-0ae1-44b5-ba3d-551d7aa856fd", 3, 0, 0.0, 367.0, 215, 563, 323.0, 563.0, 563.0, 563.0, 0.022589851132881037, 0.026700439278480155, 0.014486330316333215], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ba6f8a97-f45a-4cdc-82f6-412737e8c422", 3, 0, 0.0, 347.3333333333333, 244, 430, 368.0, 430.0, 430.0, 430.0, 0.023892769251598826, 0.023962767599015618, 0.01532186049012034], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=57e80707-25e8-499a-a69f-16e3bf2eb246", 1, 0, 0.0, 685.0, 685, 685, 685.0, 685.0, 685.0, 685.0, 1.4598540145985401, 0.26374315693430656, 1.006500912408759], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 13, 0, 0.0, 130.15384615384616, 101, 430, 105.0, 301.5999999999999, 430.0, 430.0, 0.07038821809518653, 0.05464710291569657, 0.025020811901023336], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=38398088-bf11-41f3-8ca3-cd6ad635cb59", 1, 0, 0.0, 321.0, 321, 321, 321.0, 321.0, 321.0, 321.0, 3.115264797507788, 0.5628163940809968, 2.1478290498442365], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 21, 0, 0.0, 130.9047619047619, 99, 308, 102.0, 303.6, 307.7, 308.0, 0.10741193500043476, 0.07982468997590904, 0.05391575643576511], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 21, 0, 0.0, 148.99999999999997, 98, 312, 102.0, 304.6, 311.3, 312.0, 0.10741358321483739, 0.028741525196157663, 0.06125930917721195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 21, 0, 0.0, 168.61904761904765, 98, 306, 103.0, 304.8, 305.9, 306.0, 0.10741083621893398, 0.028950576949634547, 0.06314582363652173], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 21, 0, 0.0, 164.04761904761904, 98, 407, 102.0, 308.0, 397.09999999999985, 407.0, 0.10741358321483739, 0.028951317350874143, 0.0632523346470185], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 23.68421052631579, 0.6766917293233082], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 5.2631578947368425, 0.15037593984962405], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 5.2631578947368425, 0.15037593984962405], "isController": false}, {"data": ["401/Unauthorized", 25, 65.78947368421052, 1.8796992481203008], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1330, 38, "401/Unauthorized", 25, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 21, "401/Unauthorized", 21, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
