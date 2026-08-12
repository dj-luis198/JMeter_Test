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

    var data = {"OkPercent": 97.97687861271676, "KoPercent": 2.023121387283237};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.765791119449656, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.03389830508474576, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cad68f53-06cc-4110-aa82-13be847c8c47"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/253b6f5d-f245-4f1c-b06d-b77b01b61049"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4b3912c0-34d8-4246-b247-1bd5c080b7c7"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/15df1954-11ca-491f-8751-72bef0f0dae5"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.875, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2b4de4b1-2e90-48ba-ab80-10a9aa9b4181"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2500742f-ddc8-4cb7-a976-2d338bc99f9e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1af2b2f0-c80e-4ebe-ae70-ad2fb5f0ef16"], "isController": false}, {"data": [0.8235294117647058, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1099151a-60fc-41c2-9a0a-d36c8e581e44"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d0ac35e8-491c-4aae-9e5a-2243e75f4416"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9fd53ae7-db29-4be2-a2ed-5d10143a3a31"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/53b6db83-2f4a-4955-8657-5ca94b9fb04e"], "isController": false}, {"data": [0.6944444444444444, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3888888888888889, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f57c26e0-6537-46b8-88c7-733198c8997c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=65b7fc66-a919-44ef-91e6-d690256c433c"], "isController": false}, {"data": [0.2727272727272727, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2b4de4b1-2e90-48ba-ab80-10a9aa9b4181"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.868421052631579, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/2500742f-ddc8-4cb7-a976-2d338bc99f9e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cad68f53-06cc-4110-aa82-13be847c8c47"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.3983050847457627, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2727272727272727, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/e867b514-fddd-4d34-8023-6632e7e2e3a1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=253b6f5d-f245-4f1c-b06d-b77b01b61049"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5416666666666666, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.2421875, 500, 1500, "addBook"], "isController": true}, {"data": [0.9915254237288136, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/1af2b2f0-c80e-4ebe-ae70-ad2fb5f0ef16"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4830508474576271, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9010695187165776, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=53b6db83-2f4a-4955-8657-5ca94b9fb04e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/175bb39c-c164-4e28-a90d-afe0beaf7cac"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f57c26e0-6537-46b8-88c7-733198c8997c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4b3912c0-34d8-4246-b247-1bd5c080b7c7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1099151a-60fc-41c2-9a0a-d36c8e581e44"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d0ac35e8-491c-4aae-9e5a-2243e75f4416"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/65b7fc66-a919-44ef-91e6-d690256c433c"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1384, 28, 2.023121387283237, 390.13800578034665, 101, 3445, 123.0, 1085.5, 1343.0, 1960.3500000000026, 5.456961371495262, 767.7187714702745, 4.0015609228435345], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 59, 0, 0.0, 1828.271186440678, 1307, 2590, 1780.0, 2211.0, 2465.0, 2590.0, 0.2506020821210281, 301.55866564213596, 1.2322084799603286], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cad68f53-06cc-4110-aa82-13be847c8c47", 1, 0, 0.0, 551.0, 551, 551, 551.0, 551.0, 551.0, 551.0, 1.8148820326678765, 0.32788396098003625, 1.2512760889292196], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/253b6f5d-f245-4f1c-b06d-b77b01b61049", 3, 0, 0.0, 1403.6666666666667, 223, 3445, 543.0, 3445.0, 3445.0, 3445.0, 0.06498007277768152, 0.02940179074250563, 0.041670163858083524], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4b3912c0-34d8-4246-b247-1bd5c080b7c7", 3, 0, 0.0, 418.6666666666667, 270, 590, 396.0, 590.0, 590.0, 590.0, 0.06313795643481006, 0.04059162238240555, 0.04048885878143744], "isController": false}, {"data": ["deleteBook", 12, 1, 8.333333333333334, 737.0, 126, 2083, 656.0, 1734.7000000000012, 2083.0, 2083.0, 0.08958031621851625, 0.017036881429253945, 0.06052940800474776], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, 8.333333333333334, 737.0, 126, 2083, 656.0, 1734.7000000000012, 2083.0, 2083.0, 0.09001575275673243, 0.017119695165403945, 0.060823632416922964], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 138.43749999999997, 107, 344, 112.0, 325.8, 344.0, 344.0, 0.11131673786299692, 0.0402354566421306, 0.06290102289646152], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 126.06250000000001, 103, 345, 110.5, 186.10000000000016, 345.0, 345.0, 0.11131751233189317, 0.08272717469196357, 0.05587617318221981], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/15df1954-11ca-491f-8751-72bef0f0dae5", 1, 0, 0.0, 338.0, 338, 338, 338.0, 338.0, 338.0, 338.0, 2.9585798816568047, 0.9447808801775147, 1.7653245192307692], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 186.8125, 106, 676, 113.0, 441.5000000000002, 676.0, 676.0, 0.11131286568015639, 2.0737320551485676, 0.06495062230848969], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 213.93750000000003, 101, 1339, 112.0, 629.9000000000008, 1339.0, 1339.0, 0.11131518895753326, 6.288227907848417, 0.06484327169254746], "isController": false}, {"data": ["goToProfile", 12, 1, 8.333333333333334, 271.5833333333333, 114, 506, 241.5, 469.40000000000015, 506.0, 506.0, 0.09061117235755169, 0.1774911229367081, 0.0585713331735053], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 125.0, 107, 340, 111.5, 140.20000000000033, 340.0, 340.0, 0.07783043342903594, 0.05784078109325816, 0.03906722927980906], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 122.72222222222221, 104, 323, 113.0, 135.8000000000003, 323.0, 323.0, 0.07783211612551727, 0.027320626699875037, 0.04402547974851578], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 756.2857142857143, 551, 898, 795.0, 898.0, 898.0, 898.0, 0.04721499008485208, 13.882774770164172, 0.0269272990327672], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 993.1428571428572, 788, 1268, 1004.0, 1268.0, 1268.0, 1268.0, 0.04717871296471032, 42.451488856977726, 0.026860536775806753], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2b4de4b1-2e90-48ba-ab80-10a9aa9b4181", 3, 0, 0.0, 366.3333333333333, 214, 560, 325.0, 560.0, 560.0, 560.0, 0.046611354525962524, 0.029966609761971352, 0.029890744927130918], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 302.7142857142857, 112, 345, 340.0, 345.0, 345.0, 345.0, 0.04739336492890995, 0.0838640402843602, 0.02624222452606635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 153.88235294117646, 108, 345, 115.0, 343.4, 345.0, 345.0, 0.09710956243573632, 0.07216833692733919, 0.04874444833200046], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 202.76470588235296, 106, 350, 115.0, 342.0, 350.0, 350.0, 0.097108453005221, 0.043143197124447336, 0.054422683106556534], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 317.58823529411757, 103, 1344, 115.0, 1282.3999999999999, 1344.0, 1344.0, 0.09710900771730997, 10.302960021792403, 0.05610767461056432], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 224.70588235294122, 104, 900, 115.0, 719.1999999999998, 900.0, 900.0, 0.09710956243573632, 3.3823224894321946, 0.05620282867302639], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 114.14285714285714, 101, 123, 114.0, 123.0, 123.0, 123.0, 0.047468890923269925, 0.03527717382090666, 0.02665489480554708], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 197.44444444444449, 107, 1459, 110.5, 438.4000000000016, 1459.0, 1459.0, 0.07783177958040023, 3.9105444292444265, 0.045384980844734246], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 698.5555555555554, 103, 1563, 667.0, 1388.4000000000003, 1563.0, 1563.0, 0.08823702425537756, 39.709806082288374, 0.048082284701660816], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 155.11111111111111, 105, 674, 110.5, 374.30000000000047, 674.0, 674.0, 0.0778294238460707, 1.2911695357258675, 0.0454596124743271], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 497.7777777777777, 101, 979, 476.5, 918.7, 979.0, 979.0, 0.08823442907422477, 12.983816871280673, 0.048167036965323866], "isController": false}, {"data": ["deleteBooks", 12, 1, 8.333333333333334, 589.1666666666667, 217, 1023, 556.5, 994.8000000000001, 1023.0, 1023.0, 0.09004412161959359, 0.017125090513101418, 0.06154627095401747], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2500742f-ddc8-4cb7-a976-2d338bc99f9e", 1, 0, 0.0, 607.0, 607, 607, 607.0, 607.0, 607.0, 607.0, 1.6474464579901154, 0.2976343698517298, 1.1358371087314663], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1af2b2f0-c80e-4ebe-ae70-ad2fb5f0ef16", 1, 0, 0.0, 1023.0, 1023, 1023, 1023.0, 1023.0, 1023.0, 1023.0, 0.9775171065493646, 0.17660221163245357, 0.6739522238514175], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 507.764705882353, 225, 1452, 449.0, 1399.2, 1452.0, 1452.0, 0.09704636532818797, 13.791672182016166, 0.2153383475144713], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 623.2727272727273, 158, 2049, 416.0, 1619.3999999999996, 2009.3999999999994, 2049.0, 0.11150362640203139, 0.06849197363952905, 0.05041619045326224], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 123.1111111111111, 106, 319, 112.0, 139.00000000000028, 319.0, 319.0, 0.08823486159381572, 0.06557297819618531, 0.04428976451095828], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 170.94444444444443, 106, 337, 115.0, 326.20000000000005, 337.0, 337.0, 0.08823788934968675, 0.08987511581222977, 0.04661786927556693], "isController": false}, {"data": ["login", 22, 0, 0.0, 3093.7272727272725, 1840, 4913, 3111.0, 4247.3, 4813.999999999998, 4913.0, 0.10401350284382373, 39.73374445507562, 0.2118130085432909], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 130.16666666666669, 111, 321, 117.0, 158.10000000000025, 321.0, 321.0, 0.07900627660975287, 0.06396113604441908, 0.028084262388623094], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1099151a-60fc-41c2-9a0a-d36c8e581e44", 3, 0, 0.0, 403.6666666666667, 247, 506, 458.0, 506.0, 506.0, 506.0, 0.0357564272177924, 0.029063736576441283, 0.022929740110368173], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d0ac35e8-491c-4aae-9e5a-2243e75f4416", 1, 0, 0.0, 474.0, 474, 474, 474.0, 474.0, 474.0, 474.0, 2.109704641350211, 0.3811478111814346, 1.4545424578059072], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9fd53ae7-db29-4be2-a2ed-5d10143a3a31", 1, 0, 0.0, 212.0, 212, 212, 212.0, 212.0, 212.0, 212.0, 4.716981132075471, 1.5063015919811322, 2.8145268278301887], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/53b6db83-2f4a-4955-8657-5ca94b9fb04e", 3, 0, 0.0, 413.0, 278, 577, 384.0, 577.0, 577.0, 577.0, 0.021313175805282823, 0.02519145226203839, 0.01366762901575754], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 835.8888888888889, 222, 1673, 884.5, 1502.0000000000002, 1673.0, 1673.0, 0.08818514962080386, 52.81838341157724, 0.1870489697035019], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 370.125, 211, 1455, 227.5, 917.4000000000005, 1455.0, 1455.0, 0.11122929223410985, 8.478416140499975, 0.2483785940965053], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 2, 22.22222222222222, 886.3333333333334, 110, 1385, 1088.0, 1385.0, 1385.0, 1385.0, 0.06061667362635883, 56.40697192774493, 0.11523482225844256], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f57c26e0-6537-46b8-88c7-733198c8997c", 3, 0, 0.0, 392.0, 228, 603, 345.0, 603.0, 603.0, 603.0, 0.06324310650139134, 0.04140035389788346, 0.040556288999915674], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=65b7fc66-a919-44ef-91e6-d690256c433c", 1, 0, 0.0, 631.0, 631, 631, 631.0, 631.0, 631.0, 631.0, 1.5847860538827259, 0.28631388668779717, 1.0926356973058637], "isController": false}, {"data": ["register", 22, 7, 31.818181818181817, 1133.0454545454543, 292, 2790, 1022.5, 2423.0999999999995, 2768.85, 2790.0, 0.10607726282088371, 0.0332056488553299, 0.0478590775617659], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2b4de4b1-2e90-48ba-ab80-10a9aa9b4181", 1, 0, 0.0, 562.0, 562, 562, 562.0, 562.0, 562.0, 562.0, 1.779359430604982, 0.3214663033807829, 1.2267849199288254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 338.2222222222222, 217, 1800, 229.0, 590.4000000000019, 1800.0, 1800.0, 0.0777917514812846, 5.2841963288235725, 0.17384970849702014], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 135.0, 112, 343, 118.0, 217.60000000000008, 343.0, 343.0, 0.08720828827571772, 0.06770565349530819, 0.03099982122300903], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 426.8421052631579, 216, 1674, 242.0, 671.0, 1674.0, 1674.0, 0.09679210583962057, 6.236693075416333, 0.21638428471907364], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2500742f-ddc8-4cb7-a976-2d338bc99f9e", 3, 0, 0.0, 967.0, 254, 1887, 760.0, 1887.0, 1887.0, 1887.0, 0.02003954470154438, 0.023686063415139208, 0.012850879903008603], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 111.66666666666667, 107, 117, 110.0, 117.0, 117.0, 117.0, 0.05165378191773275, 0.038387234413471305, 0.025927777251674444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 136.55555555555554, 107, 342, 110.0, 342.0, 342.0, 342.0, 0.05165378191773275, 0.013821422114705832, 0.029458797499956956], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 138.77777777777777, 106, 337, 115.0, 337.0, 337.0, 337.0, 0.051586869422169744, 0.013904273398944188, 0.030327436906392762], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cad68f53-06cc-4110-aa82-13be847c8c47", 3, 0, 0.0, 344.3333333333333, 216, 485, 332.0, 485.0, 485.0, 485.0, 0.025347899926491092, 0.029960359581083708, 0.016255000929423], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 113.66666666666667, 109, 118, 114.0, 118.0, 118.0, 118.0, 0.05165229967516442, 0.013921908896821662, 0.030416344437621243], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 337.0, 337, 337, 337.0, 337.0, 337.0, 337.0, 2.967359050445104, 0.8751390949554896, 1.8343147255192878], "isController": false}, {"data": ["https://demoqa.com/books", 59, 0, 0.0, 1265.8305084745762, 856, 2106, 1186.0, 1734.0, 1985.0, 2106.0, 0.25353444200936787, 303.3153354765588, 0.5006314860770916], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, 31.818181818181817, 1133.0454545454543, 292, 2790, 1022.5, 2423.0999999999995, 2768.85, 2790.0, 0.10496984502633788, 0.03285899090579433, 0.04735944179899229], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 11, 0, 0.0, 132.0, 106, 324, 112.0, 283.60000000000014, 324.0, 324.0, 0.05467060957729678, 0.014735437737630773, 0.03219372810069332], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 11, 0, 0.0, 111.0909090909091, 107, 122, 110.0, 120.80000000000001, 122.0, 122.0, 0.0546697944415729, 0.014735218033080196, 0.03213985962287782], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e867b514-fddd-4d34-8023-6632e7e2e3a1", 1, 0, 0.0, 1041.0, 1041, 1041, 1041.0, 1041.0, 1041.0, 1041.0, 0.9606147934678194, 0.306758825648415, 0.5731793347742555], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 239.06666666666666, 106, 1363, 113.0, 754.6000000000004, 1363.0, 1363.0, 0.08263324610935133, 4.9776900995042, 0.048105891061837214], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 252.7333333333333, 102, 673, 320.0, 476.8000000000001, 673.0, 673.0, 0.08263370132874992, 1.6405909996749741, 0.04818685304698001], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 11, 0, 0.0, 132.81818181818184, 107, 341, 113.0, 296.20000000000016, 341.0, 341.0, 0.054668707631751585, 0.01462815028427728, 0.031178247321233327], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 113.4, 106, 122, 113.0, 120.2, 122.0, 122.0, 0.0827335153470671, 0.061484575370232476, 0.04152834657069579], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 11, 0, 0.0, 132.0909090909091, 109, 320, 113.0, 280.20000000000016, 320.0, 320.0, 0.05466843593604787, 0.04062761694075433, 0.02744099225696153], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=253b6f5d-f245-4f1c-b06d-b77b01b61049", 1, 0, 0.0, 217.0, 217, 217, 217.0, 217.0, 217.0, 217.0, 4.608294930875576, 0.8325532834101382, 3.1772033410138247], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 156.9333333333333, 108, 343, 114.0, 341.8, 343.0, 343.0, 0.0827357970215113, 0.030422642029784886, 0.0467220249586321], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 11, 0, 0.0, 122.0909090909091, 112, 148, 119.0, 144.4, 148.0, 148.0, 0.05373297641610817, 0.04229372948377264, 0.01910039396041345], "isController": false}, {"data": ["deleteAccount", 12, 1, 8.333333333333334, 592.1666666666665, 110, 987, 583.5, 937.2000000000002, 987.0, 987.0, 0.08676287705700321, 0.016303343353240594, 0.059049311590797356], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1559.7727272727273, 1083, 2327, 1409.5, 2102.6, 2295.0499999999997, 2327.0, 0.10687134147822497, 0.05531426853853441, 0.04915664241820699], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 11, 0, 0.0, 269.3636363636364, 223, 662, 231.0, 577.6000000000004, 662.0, 662.0, 0.05463748031808948, 0.08467742311016406, 0.12288097380132819], "isController": false}, {"data": ["addBook", 64, 17, 26.5625, 1130.3906250000002, 575, 2724, 906.0, 2089.0, 2215.5, 2724.0, 0.30236030009259784, 85.98307826850304, 1.0995440087778974], "isController": true}, {"data": ["https://demoqa.com/books-0", 59, 0, 0.0, 204.88135593220338, 102, 748, 115.0, 459.0, 462.0, 748.0, 0.25434542695544216, 0.1890203807745034, 0.12295018197553112], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1af2b2f0-c80e-4ebe-ae70-ad2fb5f0ef16", 3, 0, 0.0, 528.0, 276, 696, 612.0, 696.0, 696.0, 696.0, 0.022001232068995864, 0.026004711472175777, 0.014108863012995396], "isController": false}, {"data": ["https://demoqa.com/books-3", 59, 0, 0.0, 701.6271186440678, 504, 1145, 672.0, 904.0, 969.0, 1145.0, 0.25446719314059957, 74.82180388935852, 0.1279791059252039], "isController": false}, {"data": ["https://demoqa.com/books-1", 59, 0, 0.0, 166.1694915254237, 102, 493, 114.0, 338.0, 343.0, 493.0, 0.255088805492624, 0.4513876128443699, 0.12405686048371756], "isController": false}, {"data": ["https://demoqa.com/books-2", 59, 0, 0.0, 1057.8305084745757, 738, 1584, 1057.0, 1327.0, 1385.0, 1584.0, 0.25439258380942115, 228.90289408618088, 0.12769315241996335], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 134.52631578947367, 112, 429, 118.0, 124.0, 429.0, 429.0, 0.09777334081213625, 0.07304356027469162, 0.03475536724181406], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 187, 17, 9.090909090909092, 179.71657754010704, 107, 2251, 119.0, 342.2000000000001, 389.3999999999999, 714.5200000000079, 0.761478163493841, 1.63912580805253, 0.3657710220910109], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 117.0, 109, 121, 117.0, 121.0, 121.0, 121.0, 0.052275129816572376, 0.040482595648966696, 0.01858217505198471], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 115.56249999999999, 108, 123, 116.0, 121.6, 123.0, 123.0, 0.11425551818447982, 0.09272103087041282, 0.04061426622963931], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=53b6db83-2f4a-4955-8657-5ca94b9fb04e", 1, 0, 0.0, 738.0, 738, 738, 738.0, 738.0, 738.0, 738.0, 1.3550135501355014, 0.2448022527100271, 0.9342183265582656], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 277.44444444444446, 222, 459, 226.0, 459.0, 459.0, 459.0, 0.05155406876167127, 0.07989873742653544, 0.11594630894348527], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 444.8666666666667, 223, 1478, 443.0, 869.6000000000004, 1478.0, 1478.0, 0.08258138395388655, 6.705855691096075, 0.18431885326113884], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 147.99999999999997, 109, 330, 117.0, 326.0, 330.0, 330.0, 0.09875682583943302, 0.0818794386110143, 0.035104965435110956], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/175bb39c-c164-4e28-a90d-afe0beaf7cac", 1, 0, 0.0, 262.0, 262, 262, 262.0, 262.0, 262.0, 262.0, 3.8167938931297707, 1.2188394561068703, 2.27740338740458], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f57c26e0-6537-46b8-88c7-733198c8997c", 1, 0, 0.0, 521.0, 521, 521, 521.0, 521.0, 521.0, 521.0, 1.9193857965451055, 0.3467640355086372, 1.3233265355086372], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 128.1111111111111, 110, 324, 117.0, 151.20000000000027, 324.0, 324.0, 0.08919545697805792, 0.06924842607183207, 0.031706197597669024], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4b3912c0-34d8-4246-b247-1bd5c080b7c7", 1, 0, 0.0, 929.0, 929, 929, 929.0, 929.0, 929.0, 929.0, 1.0764262648008611, 0.19447154198062433, 0.7421454520990312], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1099151a-60fc-41c2-9a0a-d36c8e581e44", 1, 0, 0.0, 480.0, 480, 480, 480.0, 480.0, 480.0, 480.0, 2.0833333333333335, 0.3763834635416667, 1.4363606770833335], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d0ac35e8-491c-4aae-9e5a-2243e75f4416", 3, 0, 0.0, 808.6666666666666, 345, 1094, 987.0, 1094.0, 1094.0, 1094.0, 0.025202883209839204, 0.02527671978174303, 0.016162005183392978], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 148.52631578947367, 107, 348, 115.0, 326.0, 348.0, 348.0, 0.0969585629720351, 0.07205611955245968, 0.048668653679322306], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 209.47368421052627, 107, 446, 115.0, 345.0, 446.0, 446.0, 0.0968532876593619, 0.0335720894312673, 0.05480852678503158], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 210.6315789473684, 102, 1352, 113.0, 339.0, 1352.0, 1352.0, 0.0968700768332662, 4.612307191902171, 0.05651086410657748], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 195.68421052631578, 106, 630, 115.0, 344.0, 630.0, 630.0, 0.0969640059403212, 1.525319167870211, 0.0566603507162578], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/65b7fc66-a919-44ef-91e6-d690256c433c", 3, 0, 0.0, 811.3333333333334, 229, 1384, 821.0, 1384.0, 1384.0, 1384.0, 0.0413149160618622, 0.026561510163469353, 0.026494265833941582], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 25.0, 0.5057803468208093], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 3.5714285714285716, 0.07225433526011561], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 3.5714285714285716, 0.07225433526011561], "isController": false}, {"data": ["401/Unauthorized", 19, 67.85714285714286, 1.3728323699421965], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1384, 28, "401/Unauthorized", 19, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 187, 17, "401/Unauthorized", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
