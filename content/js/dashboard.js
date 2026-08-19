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

    var data = {"OkPercent": 99.55621301775147, "KoPercent": 0.4437869822485207};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8198083067092652, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.23728813559322035, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=325b9afe-2b92-4cea-95b0-c891eaa3056a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ac383729-8203-4fc4-9d24-3a7fd60a5a79"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/58e5faf6-9885-4832-af50-12572227a8df"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7bc2c8d7-7239-4e5b-8cbb-206d3b7ba78e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=db364525-acad-4242-9f0d-539908242398"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b0982e85-f8fe-4ad9-8c13-a810b62ca0ab"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5b69c748-86e2-4d21-b329-5b7596839f5d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/34197ba6-12ce-4551-80b5-33a4c2cc00a6"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.045454545454545456, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0782e523-b41b-4720-8883-082afdff6845"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/16680c77-c8b6-401f-8870-db451be2cc00"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/16a3ed40-7bc5-49c4-be9e-264f2e84c7c5"], "isController": false}, {"data": [0.65625, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/325b9afe-2b92-4cea-95b0-c891eaa3056a"], "isController": false}, {"data": [0.8611111111111112, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.36363636363636365, 500, 1500, "register"], "isController": true}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c3d9a782-7c7a-46ca-9876-4821925b15a3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f6e21c21-a983-48b0-b961-6ae20b8c5bde"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.4745762711864407, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.36363636363636365, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/db364525-acad-4242-9f0d-539908242398"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1bf83f1f-47d7-430d-b89c-d8cc89567f22"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=58e5faf6-9885-4832-af50-12572227a8df"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/74453d32-d21b-4242-9e19-ebbaf4a06d54"], "isController": false}, {"data": [0.3409090909090909, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0782e523-b41b-4720-8883-082afdff6845"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5b69c748-86e2-4d21-b329-5b7596839f5d"], "isController": false}, {"data": [0.3709677419354839, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ac383729-8203-4fc4-9d24-3a7fd60a5a79"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b0982e85-f8fe-4ad9-8c13-a810b62ca0ab"], "isController": false}, {"data": [0.6610169491525424, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9754098360655737, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=34197ba6-12ce-4551-80b5-33a4c2cc00a6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=16680c77-c8b6-401f-8870-db451be2cc00"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7bc2c8d7-7239-4e5b-8cbb-206d3b7ba78e"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/259b4509-f617-4678-8a14-1b92cc83d0c8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=74453d32-d21b-4242-9e19-ebbaf4a06d54"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/91c63df5-b2f5-4e15-9ca6-bf37af5e3f26"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/09e7eb43-c434-4906-9d8f-7f5fbc703725"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ab2ee8a4-3082-4de0-955b-929d0ca4359f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c3d9a782-7c7a-46ca-9876-4821925b15a3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1352, 6, 0.4437869822485207, 332.6804733727811, 89, 2453, 109.5, 928.8000000000002, 1134.0, 1522.330000000001, 5.382894181537311, 765.6039769577192, 3.9275374341570912], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 59, 0, 0.0, 1551.1525423728813, 1154, 2054, 1513.0, 1889.0, 1991.0, 2054.0, 0.25106810328686446, 302.1195872748898, 1.2344999023919556], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=325b9afe-2b92-4cea-95b0-c891eaa3056a", 1, 0, 0.0, 220.0, 220, 220, 220.0, 220.0, 220.0, 220.0, 4.545454545454545, 0.8212002840909091, 3.133877840909091], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ac383729-8203-4fc4-9d24-3a7fd60a5a79", 3, 0, 0.0, 270.3333333333333, 194, 406, 211.0, 406.0, 406.0, 406.0, 0.039824771007566706, 0.02560349047524227, 0.025538671512013805], "isController": false}, {"data": ["deleteBook", 12, 0, 0.0, 521.5833333333334, 428, 993, 466.0, 886.5000000000003, 993.0, 993.0, 0.07867562694640222, 0.014213858383871496, 0.053474840190132766], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 0, 0.0, 521.5833333333334, 428, 993, 466.0, 886.5000000000003, 993.0, 993.0, 0.079482831708351, 0.014359691275434506, 0.054023487176769816], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 146.66666666666666, 91, 294, 95.5, 286.8, 294.0, 294.0, 0.084975404341299, 0.04400907171452041, 0.047273100917734366], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 119.1111111111111, 94, 293, 97.0, 284.90000000000003, 293.0, 293.0, 0.08497500318656262, 0.06315036857907633, 0.04265346839638007], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 201.5, 92, 724, 96.5, 721.3, 724.0, 724.0, 0.0849762066621346, 4.183390825048153, 0.048822592694878764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 279.88888888888886, 92, 1216, 96.0, 1050.4000000000003, 1216.0, 1216.0, 0.0849762066621346, 12.762709807139418, 0.048739608118060274], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/58e5faf6-9885-4832-af50-12572227a8df", 3, 0, 0.0, 1065.3333333333333, 237, 2453, 506.0, 2453.0, 2453.0, 2453.0, 0.022437959043245425, 0.026520907970710984, 0.014388925558331215], "isController": false}, {"data": ["goToProfile", 12, 0, 0.0, 225.75, 194, 330, 218.0, 303.0000000000001, 330.0, 330.0, 0.07955449482895784, 0.174362113829223, 0.05143073786793954], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/7bc2c8d7-7239-4e5b-8cbb-206d3b7ba78e", 3, 0, 0.0, 377.0, 184, 617, 330.0, 617.0, 617.0, 617.0, 0.02258781011180966, 0.026698026860670857, 0.014485021458419607], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=db364525-acad-4242-9f0d-539908242398", 1, 0, 0.0, 413.0, 413, 413, 413.0, 413.0, 413.0, 413.0, 2.4213075060532687, 0.4374432506053269, 1.6693780266343827], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 106.26315789473685, 92, 279, 96.0, 106.0, 279.0, 279.0, 0.09584342211460856, 0.07122738694259483, 0.04810890524112187], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 135.10526315789474, 91, 286, 96.0, 285.0, 286.0, 286.0, 0.09584535604027522, 0.04079930297725943, 0.053814487530014735], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 734.3333333333334, 727, 742, 734.0, 742.0, 742.0, 742.0, 0.0666637038353851, 19.601342370894624, 0.03801914359361806], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 852.3333333333334, 818, 891, 848.0, 891.0, 891.0, 891.0, 0.0665513110608279, 59.88298667725941, 0.03789005307467057], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b0982e85-f8fe-4ad9-8c13-a810b62ca0ab", 3, 0, 0.0, 346.0, 204, 543, 291.0, 543.0, 543.0, 543.0, 0.07911183776799136, 0.03579604638590755, 0.050732526172833], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 218.66666666666666, 94, 282, 280.0, 282.0, 282.0, 282.0, 0.06763764260269647, 0.11968692226180278, 0.03745170249582901], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5b69c748-86e2-4d21-b329-5b7596839f5d", 1, 0, 0.0, 444.0, 444, 444, 444.0, 444.0, 444.0, 444.0, 2.2522522522522523, 0.4069010416666667, 1.5528223536036037], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 129.625, 91, 282, 96.0, 281.3, 282.0, 282.0, 0.0918758756919402, 0.06827884902496727, 0.04611738291568092], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 162.68750000000003, 90, 284, 96.5, 283.3, 284.0, 284.0, 0.0918748205569911, 0.04183265144989951, 0.05143285242606948], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 269.125, 90, 1036, 98.5, 1035.3, 1036.0, 1036.0, 0.09187534812143625, 10.355367835158399, 0.053025713613055483], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 235.00000000000003, 91, 758, 183.0, 618.7000000000002, 758.0, 758.0, 0.09177837816133491, 3.3948813119145544, 0.053059374874521746], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 159.0, 92, 287, 98.0, 287.0, 287.0, 287.0, 0.06763154335181928, 0.05026133251048289, 0.03797669670634384], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 206.63157894736838, 91, 1107, 95.0, 830.0, 1107.0, 1107.0, 0.09584535604027522, 9.101200321208056, 0.05547956413063218], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 688.7500000000002, 96, 1122, 941.5, 1108.7, 1122.0, 1122.0, 0.08843541174974989, 49.74290038096317, 0.047240400612415225], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/34197ba6-12ce-4551-80b5-33a4c2cc00a6", 3, 0, 0.0, 312.0, 240, 444, 252.0, 444.0, 444.0, 444.0, 0.054967202902268315, 0.035338615147128875, 0.035249150298655135], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 168.2631578947368, 90, 744, 96.0, 635.0, 744.0, 744.0, 0.09584245518104136, 2.989520068905681, 0.05557148113164718], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 499.3125000000001, 94, 937, 630.0, 875.4000000000001, 937.0, 937.0, 0.08843590055382983, 16.26087053398702, 0.0473270249057605], "isController": false}, {"data": ["deleteBooks", 12, 0, 0.0, 499.91666666666663, 220, 957, 469.5, 865.5000000000003, 957.0, 957.0, 0.07945809578673448, 0.014355222383345584, 0.054782632446713414], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 448.12499999999994, 191, 1318, 377.0, 1186.4, 1318.0, 1318.0, 0.091726288754357, 13.841454424216888, 0.20336094437947166], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 430.5454545454545, 108, 1322, 306.5, 1112.6999999999996, 1312.2499999999998, 1322.0, 0.10071415491668192, 0.06186445648690716, 0.045537747779710674], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 109.25000000000001, 91, 283, 97.5, 162.60000000000014, 283.0, 283.0, 0.08843296781039972, 0.06572020361690839, 0.044389204545454544], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 175.99999999999994, 91, 292, 98.0, 289.9, 292.0, 292.0, 0.08843541174974989, 0.10667953355847515, 0.04579382527373523], "isController": false}, {"data": ["login", 22, 0, 0.0, 2308.3636363636365, 1263, 3700, 2105.0, 3470.1, 3683.6499999999996, 3700.0, 0.10048047938323254, 16.533655215793246, 0.17432435441291996], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0782e523-b41b-4720-8883-082afdff6845", 1, 0, 0.0, 404.0, 404, 404, 404.0, 404.0, 404.0, 404.0, 2.4752475247524752, 0.44718827351485146, 1.7065671410891088], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 112.1578947368421, 97, 282, 100.0, 135.0, 282.0, 282.0, 0.09365418929976241, 0.07581965129834281, 0.03329113760264992], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/16680c77-c8b6-401f-8870-db451be2cc00", 3, 0, 0.0, 289.6666666666667, 194, 441, 234.0, 441.0, 441.0, 441.0, 0.026669037247755354, 0.026747169192817142, 0.01710221464130145], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/16a3ed40-7bc5-49c4-be9e-264f2e84c7c5", 1, 0, 0.0, 194.0, 194, 194, 194.0, 194.0, 194.0, 194.0, 5.154639175257732, 1.6460615335051545, 3.0756684922680413], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 799.1250000000001, 194, 1223, 1039.0, 1204.1, 1223.0, 1223.0, 0.08838607035531201, 66.13916050150809, 0.18464834082773554], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/325b9afe-2b92-4cea-95b0-c891eaa3056a", 3, 0, 0.0, 323.6666666666667, 222, 434, 315.0, 434.0, 434.0, 434.0, 0.10148163182463973, 0.045917795649820715, 0.065077739158379], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 431.4444444444444, 187, 1316, 198.5, 1147.7000000000003, 1316.0, 1316.0, 0.08493650995880579, 17.045294937607053, 0.18740223453801616], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 3, 0, 0.0, 1012.0, 911, 1135, 990.0, 1135.0, 1135.0, 1135.0, 0.06640547181087722, 79.4440305631184, 0.1497365570423003], "isController": false}, {"data": ["register", 22, 3, 13.636363636363637, 1051.9545454545455, 232, 2245, 917.0, 1998.3, 2211.0999999999995, 2245.0, 0.09861358267628298, 0.03149961563114934, 0.044491674996526114], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 336.15789473684214, 189, 1387, 197.0, 926.0, 1387.0, 1387.0, 0.09579558231109363, 12.196501909294188, 0.21286648900367552], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 132.11111111111114, 96, 314, 98.5, 294.20000000000005, 314.0, 314.0, 0.10346908860977784, 0.0803300053171615, 0.03678002759175696], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c3d9a782-7c7a-46ca-9876-4821925b15a3", 1, 0, 0.0, 451.0, 451, 451, 451.0, 451.0, 451.0, 451.0, 2.2172949002217295, 0.4005855044345898, 1.5287208980044344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 281.16666666666674, 186, 463, 199.0, 399.1000000000001, 463.0, 463.0, 0.10212302420315675, 0.15827074161172824, 0.22967707494127926], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f6e21c21-a983-48b0-b961-6ae20b8c5bde", 1, 0, 0.0, 204.0, 204, 204, 204.0, 204.0, 204.0, 204.0, 4.901960784313726, 1.5653722426470589, 2.924900428921569], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 96.6, 93, 104, 96.0, 103.5, 104.0, 104.0, 0.046819548097721764, 0.03479460556871705, 0.023501218478739243], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 113.7, 93, 282, 96.0, 263.4000000000001, 282.0, 282.0, 0.04678056174098539, 0.012517454997099605, 0.026679539117905725], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 94.3, 90, 97, 94.5, 96.9, 97.0, 97.0, 0.04682217872962065, 0.012620040360718064, 0.027526319917218385], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 93.80000000000001, 90, 98, 94.0, 98.0, 98.0, 98.0, 0.04682217872962065, 0.012620040360718064, 0.027572044701134033], "isController": false}, {"data": ["https://demoqa.com/books", 59, 0, 0.0, 1078.2372881355934, 739, 1659, 960.0, 1486.0, 1548.0, 1659.0, 0.2587707948649348, 309.5798339426143, 0.5109712375165021], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 3, 13.636363636363637, 1051.9545454545455, 232, 2245, 917.0, 1998.3, 2211.0999999999995, 2245.0, 0.10095864825548044, 0.03224868753757268, 0.045549702630890594], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/db364525-acad-4242-9f0d-539908242398", 3, 0, 0.0, 335.0, 217, 486, 302.0, 486.0, 486.0, 486.0, 0.056255625562556255, 0.03616694677280228, 0.03607538488223822], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 93.5, 91, 97, 93.0, 97.0, 97.0, 97.0, 0.037830544381533646, 0.01019651391533524, 0.022277166271547647], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1bf83f1f-47d7-430d-b89c-d8cc89567f22", 1, 0, 0.0, 183.0, 183, 183, 183.0, 183.0, 183.0, 183.0, 5.46448087431694, 1.7450051229508197, 3.2605447404371586], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 123.5, 92, 274, 93.5, 274.0, 274.0, 274.0, 0.03778789653673928, 0.01018501898841801, 0.02221515011241899], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=58e5faf6-9885-4832-af50-12572227a8df", 1, 0, 0.0, 462.0, 462, 462, 462.0, 462.0, 462.0, 462.0, 2.1645021645021645, 0.3910477543290043, 1.4923227813852813], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 156.88888888888889, 92, 826, 96.0, 338.2000000000008, 826.0, 826.0, 0.10100726691170281, 5.074963042914059, 0.05889898571869476], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 150.88888888888889, 92, 736, 95.0, 328.30000000000064, 736.0, 736.0, 0.10100613331687307, 1.6756650096516972, 0.058996963503117165], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 93.83333333333334, 92, 95, 94.5, 95.0, 95.0, 95.0, 0.03783125997011331, 0.010122817609190475, 0.021575640451705246], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 96.44444444444444, 92, 107, 95.5, 100.70000000000002, 107.0, 107.0, 0.10100613331687307, 0.07506412837318399, 0.05070034426257106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 95.83333333333333, 93, 97, 96.5, 97.0, 97.0, 97.0, 0.037829828820024586, 0.02811376926956906, 0.018988800794426407], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 126.61111111111111, 92, 290, 95.5, 280.1, 290.0, 290.0, 0.10100840053197757, 0.03545596524749864, 0.0571350685734808], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 133.16666666666666, 96, 301, 99.0, 301.0, 301.0, 301.0, 0.03832445483462998, 0.03016553769210133, 0.013623146054497376], "isController": false}, {"data": ["deleteAccount", 12, 0, 0.0, 490.24999999999994, 406, 633, 472.0, 628.2, 633.0, 633.0, 0.08003521549481772, 0.014459487174356717, 0.05447709492176558], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/74453d32-d21b-4242-9e19-ebbaf4a06d54", 3, 0, 0.0, 382.3333333333333, 220, 519, 408.0, 519.0, 519.0, 519.0, 0.026792412388811488, 0.032138684782802844, 0.017181332163397994], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1396.9545454545453, 744, 2140, 1367.0, 1960.5, 2113.7499999999995, 2140.0, 0.10127514615844957, 0.05241780025779128, 0.04658261117248999], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 221.83333333333331, 190, 371, 192.5, 371.0, 371.0, 371.0, 0.037764588145695784, 0.05852773572970626, 0.08493344384720448], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0782e523-b41b-4720-8883-082afdff6845", 3, 0, 0.0, 373.0, 213, 633, 273.0, 633.0, 633.0, 633.0, 0.02525784045464113, 0.02985391233424542, 0.01619724794780046], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5b69c748-86e2-4d21-b329-5b7596839f5d", 3, 0, 0.0, 309.3333333333333, 202, 507, 219.0, 507.0, 507.0, 507.0, 0.02447041934141945, 0.024542110023083763, 0.015692293653188905], "isController": false}, {"data": ["addBook", 62, 3, 4.838709677419355, 1005.2903225806452, 485, 2059, 820.5, 1751.0, 1830.9499999999998, 2059.0, 0.31093279839518556, 109.1750691527708, 1.1289826510782346], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ac383729-8203-4fc4-9d24-3a7fd60a5a79", 1, 0, 0.0, 497.0, 497, 497, 497.0, 497.0, 497.0, 497.0, 2.012072434607646, 0.3635091800804829, 1.3872296277665996], "isController": false}, {"data": ["https://demoqa.com/books-0", 59, 0, 0.0, 169.03389830508473, 92, 415, 98.0, 383.0, 397.0, 415.0, 0.2597242520821961, 0.19301773030717898, 0.12555029763738973], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b0982e85-f8fe-4ad9-8c13-a810b62ca0ab", 1, 0, 0.0, 957.0, 957, 957, 957.0, 957.0, 957.0, 957.0, 1.0449320794148382, 0.18878167450365727, 0.7204316875653083], "isController": false}, {"data": ["https://demoqa.com/books-3", 59, 0, 0.0, 613.4406779661016, 451, 916, 563.0, 836.0, 868.0, 916.0, 0.2592813950217972, 76.23733908897746, 0.13040031097287652], "isController": false}, {"data": ["https://demoqa.com/books-1", 59, 0, 0.0, 144.57627118644064, 92, 291, 98.0, 285.0, 288.0, 291.0, 0.25991074929185337, 0.45992019308284987, 0.12640190737045212], "isController": false}, {"data": ["https://demoqa.com/books-2", 59, 0, 0.0, 904.5932203389831, 644, 1320, 855.0, 1170.0, 1215.0, 1320.0, 0.25937144188541056, 233.38287933485512, 0.1301923057901377], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 112.2777777777778, 95, 299, 100.5, 137.00000000000026, 299.0, 299.0, 0.10756543564001435, 0.08035894361778415, 0.03823615095016135], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 183, 3, 1.639344262295082, 158.93989071038246, 93, 709, 104.0, 287.79999999999995, 328.59999999999997, 627.5199999999996, 0.7741182243504598, 1.6600752822041642, 0.37302194022369056], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 100.7, 96, 109, 99.0, 108.9, 109.0, 109.0, 0.04600598997989538, 0.035627685599665074, 0.016353691750665936], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=34197ba6-12ce-4551-80b5-33a4c2cc00a6", 1, 0, 0.0, 477.0, 477, 477, 477.0, 477.0, 477.0, 477.0, 2.0964360587002098, 0.3787506551362684, 1.445394392033543], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 100.66666666666667, 93, 117, 98.0, 114.30000000000001, 117.0, 117.0, 0.08508908354329853, 0.0690517855707823, 0.030246510165781896], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=16680c77-c8b6-401f-8870-db451be2cc00", 1, 0, 0.0, 503.0, 503, 503, 503.0, 503.0, 503.0, 503.0, 1.9880715705765406, 0.3591730864811133, 1.3706821570576542], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 212.0, 189, 378, 193.0, 360.50000000000006, 378.0, 378.0, 0.04675759460230328, 0.07246513929087432, 0.10515892614170357], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7bc2c8d7-7239-4e5b-8cbb-206d3b7ba78e", 1, 0, 0.0, 519.0, 519, 519, 519.0, 519.0, 519.0, 519.0, 1.9267822736030829, 0.3481003131021195, 1.3284260597302504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 286.27777777777777, 187, 922, 195.5, 443.2000000000007, 922.0, 922.0, 0.10095061832253723, 6.857319401797482, 0.22560535318695493], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/259b4509-f617-4678-8a14-1b92cc83d0c8", 1, 0, 0.0, 298.0, 298, 298, 298.0, 298.0, 298.0, 298.0, 3.3557046979865772, 1.071597105704698, 2.002280830536913], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 99.68750000000001, 93, 115, 98.5, 108.0, 115.0, 115.0, 0.09300919628428261, 0.0771140699661679, 0.033061862741678584], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=74453d32-d21b-4242-9e19-ebbaf4a06d54", 1, 0, 0.0, 652.0, 652, 652, 652.0, 652.0, 652.0, 652.0, 1.5337423312883436, 0.277092120398773, 1.0574434432515336], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/91c63df5-b2f5-4e15-9ca6-bf37af5e3f26", 1, 0, 0.0, 335.0, 335, 335, 335.0, 335.0, 335.0, 335.0, 2.985074626865672, 0.9532416044776119, 1.781133395522388], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/09e7eb43-c434-4906-9d8f-7f5fbc703725", 1, 0, 0.0, 413.0, 413, 413, 413.0, 413.0, 413.0, 413.0, 2.4213075060532687, 0.7732105024213075, 1.444745006053269], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 101.6875, 95, 113, 101.0, 111.6, 113.0, 113.0, 0.08748810708544308, 0.06792289563762426, 0.031099288065528592], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ab2ee8a4-3082-4de0-955b-929d0ca4359f", 1, 0, 0.0, 309.0, 309, 309, 309.0, 309.0, 309.0, 309.0, 3.236245954692557, 1.0334496359223302, 1.931002224919094], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c3d9a782-7c7a-46ca-9876-4821925b15a3", 3, 0, 0.0, 349.3333333333333, 202, 458, 388.0, 458.0, 458.0, 458.0, 0.021785068514040475, 0.025749213468255525, 0.013970242504121008], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 95.50000000000001, 91, 101, 96.0, 98.30000000000001, 101.0, 101.0, 0.10228783797606464, 0.07601664521463398, 0.051343699921579326], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 136.7777777777778, 89, 293, 96.0, 284.0, 293.0, 293.0, 0.10228667545574396, 0.02736967683093149, 0.05833536959585398], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 146.55555555555557, 90, 287, 95.5, 286.1, 287.0, 287.0, 0.10218099660532023, 0.027540971741277717, 0.06007124995742459], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 162.72222222222223, 91, 369, 96.5, 300.60000000000014, 369.0, 369.0, 0.10217751640516792, 0.027540033718580416, 0.06016898671124634], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 3, 50.0, 0.22189349112426035], "isController": false}, {"data": ["401/Unauthorized", 3, 50.0, 0.22189349112426035], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1352, 6, "406/Not Acceptable", 3, "401/Unauthorized", 3, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 3, "406/Not Acceptable", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 183, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
