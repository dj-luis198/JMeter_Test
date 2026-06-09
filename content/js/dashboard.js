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

    var data = {"OkPercent": 98.57707509881423, "KoPercent": 1.4229249011857708};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8160217243720299, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.39622641509433965, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a5868743-49f0-4d92-97f6-224d6c7622e4"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=64b40a89-a2c9-4c77-bc98-615a67b6f3a4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/15ca0a6b-1ceb-4662-b7eb-cf5d848e6ddd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=322befaa-8c89-4fa3-8c31-0fd174ebd20e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ebd9d8d2-627f-4b31-b4ad-c52a8101293a"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a9508ad2-90f3-49b9-b729-083940cbacf3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f7a730de-a12a-4efc-8b28-8eb3ef555fe6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=88402e4f-a11c-493b-ae47-a5ef6640ba0c"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/017cbbec-e0f8-4e08-b57b-67e11eb81b26"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.045454545454545456, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/110fa4b1-0ed2-434c-b009-4f83a9db83ab"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=21e0b233-45dc-4c8b-8c6d-1c7699bc3e63"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0067d220-d93b-4316-a5bc-e9d9abdc39eb"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "register"], "isController": true}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=15ca0a6b-1ceb-4662-b7eb-cf5d848e6ddd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.49056603773584906, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ebd9d8d2-627f-4b31-b4ad-c52a8101293a"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a9508ad2-90f3-49b9-b729-083940cbacf3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a5868743-49f0-4d92-97f6-224d6c7622e4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/21e0b233-45dc-4c8b-8c6d-1c7699bc3e63"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.38636363636363635, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/64b40a89-a2c9-4c77-bc98-615a67b6f3a4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/04e66207-d800-4bef-8293-c864eaaf3a16"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/322befaa-8c89-4fa3-8c31-0fd174ebd20e"], "isController": false}, {"data": [0.39655172413793105, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/80c2c77b-91cb-4b97-9a1b-c5ec5182e4db"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a040924a-f12f-41fd-8a5e-56ac9edacd29"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8207547169811321, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/88402e4f-a11c-493b-ae47-a5ef6640ba0c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9437869822485208, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f7a730de-a12a-4efc-8b28-8eb3ef555fe6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=80c2c77b-91cb-4b97-9a1b-c5ec5182e4db"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/22c6d074-b04e-47cf-a170-d4d0e1c4b27a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0067d220-d93b-4316-a5bc-e9d9abdc39eb"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=017cbbec-e0f8-4e08-b57b-67e11eb81b26"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1265, 18, 1.4229249011857708, 305.456126482214, 77, 3369, 94.0, 846.8000000000002, 1029.4, 1514.1799999999978, 5.094315307914109, 706.6698114436343, 3.723306756813898], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 53, 0, 0.0, 1340.88679245283, 996, 1841, 1352.0, 1615.0, 1671.6, 1841.0, 0.23326746094970666, 280.70006439612337, 1.146974283087669], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a5868743-49f0-4d92-97f6-224d6c7622e4", 1, 0, 0.0, 279.0, 279, 279, 279.0, 279.0, 279.0, 279.0, 3.5842293906810037, 0.6475414426523297, 2.4711581541218637], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 575.6923076923077, 86, 1425, 538.0, 1144.1999999999998, 1425.0, 1425.0, 0.07364229106832304, 0.013951762175053391, 0.04978267558021628], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 575.6923076923077, 86, 1425, 538.0, 1144.1999999999998, 1425.0, 1425.0, 0.07384937000806663, 0.013990993927309498, 0.0499226623123942], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=64b40a89-a2c9-4c77-bc98-615a67b6f3a4", 1, 0, 0.0, 436.0, 436, 436, 436.0, 436.0, 436.0, 436.0, 2.293577981651376, 0.4143671158256881, 1.581314506880734], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/15ca0a6b-1ceb-4662-b7eb-cf5d848e6ddd", 3, 0, 0.0, 1077.0, 409, 1882, 940.0, 1882.0, 1882.0, 1882.0, 0.06044852807834129, 0.02735138477503073, 0.03876419281065506], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 96.7777777777778, 77, 238, 79.0, 237.1, 238.0, 238.0, 0.10368783050495974, 0.03639649866357907, 0.05865067929930068], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 89.33333333333334, 78, 234, 80.0, 101.70000000000022, 234.0, 234.0, 0.10368424690675329, 0.07705440614847583, 0.052044631748116396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 144.77777777777777, 77, 619, 80.0, 275.20000000000056, 619.0, 619.0, 0.10368663594470046, 1.7201338385656681, 0.060562626008064516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 149.38888888888886, 78, 856, 80.0, 298.9000000000009, 856.0, 856.0, 0.10368723322138952, 5.2096140476759665, 0.06046171780943439], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=322befaa-8c89-4fa3-8c31-0fd174ebd20e", 1, 0, 0.0, 473.0, 473, 473, 473.0, 473.0, 473.0, 473.0, 2.1141649048625792, 0.3819536205073996, 1.457617600422833], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ebd9d8d2-627f-4b31-b4ad-c52a8101293a", 1, 0, 0.0, 366.0, 366, 366, 366.0, 366.0, 366.0, 366.0, 2.73224043715847, 0.49361765710382516, 1.8837517076502732], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 357.0769230769231, 79, 1882, 203.0, 1331.1999999999994, 1882.0, 1882.0, 0.07296238508424349, 0.15905164158350826, 0.047163560971297716], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a9508ad2-90f3-49b9-b729-083940cbacf3", 1, 0, 0.0, 203.0, 203, 203, 203.0, 203.0, 203.0, 203.0, 4.926108374384237, 0.889970751231527, 3.3963208128078817], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 104.50000000000001, 79, 240, 81.5, 235.8, 239.8, 240.0, 0.12039199634008331, 0.08947100509258145, 0.060431138787893385], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 111.4, 78, 239, 80.0, 238.9, 239.0, 239.0, 0.12039489525644112, 0.04125641479051288, 0.06815714919937395], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 594.0, 475, 626, 615.0, 626.0, 626.0, 626.0, 0.044908835064818416, 13.204688622720875, 0.025612069997904253], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 852.8333333333333, 774, 941, 856.5, 941.0, 941.0, 941.0, 0.044815918614291794, 40.3254423471217, 0.02551531303919152], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 186.16666666666669, 79, 243, 236.5, 243.0, 243.0, 243.0, 0.045093117287198066, 0.07979368019961221, 0.0249685522478919], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 105.53846153846155, 79, 238, 81.0, 238.0, 238.0, 238.0, 0.06547040485891129, 0.048655252048468246, 0.0328630743139457], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 121.76923076923079, 78, 316, 80.0, 283.59999999999997, 316.0, 316.0, 0.06547139403706688, 0.025082940924657533, 0.03691618717264303], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 157.92307692307693, 78, 935, 81.0, 656.5999999999997, 935.0, 935.0, 0.06547040485891129, 4.547857016727689, 0.03805664008400357], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 157.69230769230768, 78, 621, 81.0, 468.1999999999999, 621.0, 621.0, 0.06547106430769385, 1.4971095941549448, 0.03812095999466159], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f7a730de-a12a-4efc-8b28-8eb3ef555fe6", 1, 0, 0.0, 495.0, 495, 495, 495.0, 495.0, 495.0, 495.0, 2.0202020202020203, 0.36497790404040403, 1.392834595959596], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 87.5, 81, 112, 83.5, 112.0, 112.0, 112.0, 0.04509176173513099, 0.033510576836361994, 0.025320081052441715], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 623.5333333333334, 78, 1100, 778.0, 1007.6, 1100.0, 1100.0, 0.0812598527571468, 48.7524729235399, 0.04311639322726214], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 125.65, 77, 686, 80.0, 237.60000000000002, 663.5999999999997, 686.0, 0.12039634476697286, 5.447470181211549, 0.07026255432885058], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 462.86666666666656, 80, 723, 617.0, 708.6, 723.0, 723.0, 0.0812598527571468, 15.936030550995977, 0.04319574855222029], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 138.95, 79, 630, 81.0, 238.60000000000002, 610.4499999999997, 630.0, 0.12039489525644112, 1.8008325118889958, 0.07037928154346255], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 443.5384615384616, 84, 988, 436.0, 877.9999999999999, 988.0, 988.0, 0.07391109064342447, 0.014002687094555027, 0.050552920696242475], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=88402e4f-a11c-493b-ae47-a5ef6640ba0c", 1, 0, 0.0, 988.0, 988, 988, 988.0, 988.0, 988.0, 988.0, 1.0121457489878543, 0.18285836285425103, 0.6978270495951417], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 306.61538461538464, 160, 1014, 166.0, 799.1999999999998, 1014.0, 1014.0, 0.06544337889199325, 6.116163570691434, 0.1458956697248861], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 563.9545454545454, 93, 2337, 441.0, 1099.8, 2160.1499999999974, 2337.0, 0.09840802651649005, 0.060447899100461173, 0.04449503542688955], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 91.93333333333334, 78, 239, 81.0, 149.60000000000005, 239.0, 239.0, 0.08132681995868597, 0.06043916991070315, 0.040822251424574796], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/017cbbec-e0f8-4e08-b57b-67e11eb81b26", 3, 0, 0.0, 365.0, 175, 505, 415.0, 505.0, 505.0, 505.0, 0.017880557873405648, 0.024649792511026343, 0.011466373375849326], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 122.53333333333333, 79, 237, 81.0, 237.0, 237.0, 237.0, 0.08132373351839, 0.10319007592925919, 0.04182665981740111], "isController": false}, {"data": ["login", 22, 0, 0.0, 2610.9545454545455, 1220, 4567, 2563.0, 4232.9, 4523.95, 4567.0, 0.09710752009463569, 31.816377197057644, 0.19043039873671944], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/110fa4b1-0ed2-434c-b009-4f83a9db83ab", 1, 0, 0.0, 165.0, 165, 165, 165.0, 165.0, 165.0, 165.0, 6.0606060606060606, 1.9353693181818181, 3.6162405303030303], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 94.75, 80, 263, 83.0, 114.50000000000003, 255.6499999999999, 263.0, 0.12092483312373029, 0.09789715494098869, 0.042984999274451], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=21e0b233-45dc-4c8b-8c6d-1c7699bc3e63", 1, 0, 0.0, 421.0, 421, 421, 421.0, 421.0, 421.0, 421.0, 2.375296912114014, 0.42913078978622327, 1.6376558788598576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 716.9333333333333, 160, 1181, 862.0, 1089.2, 1181.0, 1181.0, 0.08122333167276743, 64.8228550864081, 0.16881867601908207], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0067d220-d93b-4316-a5bc-e9d9abdc39eb", 1, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 2.277904328018223, 0.4115354498861048, 1.570508257403189], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 274.55555555555554, 160, 936, 167.0, 515.7000000000006, 936.0, 936.0, 0.10363589256412471, 7.039723268776808, 0.23160642830411377], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, 25.0, 725.2499999999999, 79, 1025, 903.0, 1025.0, 1025.0, 1025.0, 0.05971709028477588, 53.58579549695816, 0.11088338138692942], "isController": false}, {"data": ["register", 23, 7, 30.434782608695652, 1132.0434782608697, 199, 2405, 1076.0, 1762.6000000000004, 2293.7999999999984, 2405.0, 0.09167839220016183, 0.028742919837211063, 0.04136271210593239], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 263.15, 160, 766, 163.5, 478.5, 751.6499999999999, 766.0, 0.12033332330555639, 7.375192956364128, 0.26909304398182965], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 93.66666666666669, 80, 252, 82.0, 152.40000000000006, 252.0, 252.0, 0.10966194876593753, 0.08513793873918003, 0.03898139585039186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 326.68749999999994, 159, 778, 318.5, 568.0000000000002, 778.0, 778.0, 0.09572870485045382, 7.296888976016968, 0.21376528293815325], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 83.22222222222223, 79, 97, 82.0, 97.0, 97.0, 97.0, 0.044636878989421064, 0.03317252432709905, 0.02240562089898674], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 79.33333333333333, 78, 81, 79.0, 81.0, 81.0, 81.0, 0.044640864247131824, 0.01194491875362707, 0.02545924289094237], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=15ca0a6b-1ceb-4662-b7eb-cf5d848e6ddd", 1, 0, 0.0, 209.0, 209, 209, 209.0, 209.0, 209.0, 209.0, 4.784688995215311, 0.8644213516746412, 3.2988187799043063], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 98.11111111111111, 78, 239, 80.0, 239.0, 239.0, 239.0, 0.04464108567120353, 0.012032167622316575, 0.026244075755922382], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 80.22222222222223, 78, 82, 80.0, 82.0, 82.0, 82.0, 0.044640642825256684, 0.012032048261494965, 0.026287409788700956], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 84.0, 84, 84, 84.0, 84.0, 84.0, 84.0, 11.904761904761903, 3.510974702380952, 7.359095982142857], "isController": false}, {"data": ["https://demoqa.com/books", 53, 0, 0.0, 905.1698113207547, 619, 1502, 858.0, 1234.2, 1312.3, 1502.0, 0.22879936454214225, 273.72358352148126, 0.45178937021895665], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ebd9d8d2-627f-4b31-b4ad-c52a8101293a", 3, 0, 0.0, 353.0, 169, 474, 416.0, 474.0, 474.0, 474.0, 0.0353802790324673, 0.02949508287830363, 0.022688525291002792], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, 30.434782608695652, 1132.0434782608697, 199, 2405, 1076.0, 1762.6000000000004, 2293.7999999999984, 2405.0, 0.09469774948739697, 0.029689545780185938, 0.04272496119450918], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a9508ad2-90f3-49b9-b729-083940cbacf3", 3, 0, 0.0, 266.0, 202, 393, 203.0, 393.0, 393.0, 393.0, 0.08423417099536712, 0.038113768777200616, 0.054017355748982164], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 112.4, 80, 242, 80.0, 242.0, 242.0, 242.0, 0.03105898722854445, 0.00837136765144362, 0.01828961845587139], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 112.2, 79, 243, 79.0, 243.0, 243.0, 243.0, 0.0310593730976134, 0.00837147165521611, 0.018259514262464128], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a5868743-49f0-4d92-97f6-224d6c7622e4", 3, 0, 0.0, 312.3333333333333, 200, 408, 329.0, 408.0, 408.0, 408.0, 0.10186411327289395, 0.047881438660826454, 0.0653230153475264], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 121.6, 77, 237, 81.0, 236.4, 237.0, 237.0, 0.10721407792319183, 0.028897544440235297, 0.06303015127906395], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/21e0b233-45dc-4c8b-8c6d-1c7699bc3e63", 3, 0, 0.0, 360.0, 271, 537, 272.0, 537.0, 537.0, 537.0, 0.01988519613431787, 0.02741334818647011, 0.012751899864780664], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 100.8, 79, 237, 79.0, 236.4, 237.0, 237.0, 0.10721561059290233, 0.028897957542618206, 0.0631357550659376], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 93.2, 80, 249, 82.0, 153.00000000000006, 249.0, 249.0, 0.10721254529730039, 0.07967651071410703, 0.053815672151183984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 111.0, 77, 239, 79.0, 239.0, 239.0, 239.0, 0.0310593730976134, 0.008310808817134835, 0.01771354871973264], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 100.99999999999999, 78, 236, 80.0, 235.4, 236.0, 236.0, 0.10721407792319183, 0.028688141944291562, 0.06114552881557034], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 113.2, 80, 237, 83.0, 237.0, 237.0, 237.0, 0.03105879429760537, 0.023081779746560237, 0.015590058856415193], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 488.6153846153846, 79, 1448, 410.0, 1093.5999999999997, 1448.0, 1448.0, 0.07561304732213484, 0.014166086239588664, 0.05146140390163324], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 84.4, 81, 89, 85.0, 89.0, 89.0, 89.0, 0.032110769309811125, 0.025274687562214612, 0.011414375028096922], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1458.909090909091, 912, 3369, 1300.0, 2317.9999999999995, 3248.249999999998, 3369.0, 0.09756660029181283, 0.05049833804166094, 0.04487682493891001], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/64b40a89-a2c9-4c77-bc98-615a67b6f3a4", 3, 0, 0.0, 368.0, 227, 562, 315.0, 562.0, 562.0, 562.0, 0.01919852555323751, 0.022692007253842905, 0.012311554472616504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 258.4, 161, 480, 166.0, 480.0, 480.0, 480.0, 0.031043174847578014, 0.0481108578936585, 0.06981682780661344], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/04e66207-d800-4bef-8293-c864eaaf3a16", 1, 0, 0.0, 163.0, 163, 163, 163.0, 163.0, 163.0, 163.0, 6.134969325153374, 1.9591161809815951, 3.660611579754601], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/322befaa-8c89-4fa3-8c31-0fd174ebd20e", 3, 0, 0.0, 910.0, 176, 2206, 348.0, 2206.0, 2206.0, 2206.0, 0.02274157235231244, 0.026879768623452625, 0.014583625499367026], "isController": false}, {"data": ["addBook", 58, 7, 12.068965517241379, 866.3103448275863, 410, 1852, 692.5, 1532.2, 1665.85, 1852.0, 0.2809437773375249, 82.17937083276821, 1.02332654537242], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/80c2c77b-91cb-4b97-9a1b-c5ec5182e4db", 3, 0, 0.0, 295.0, 185, 410, 290.0, 410.0, 410.0, 410.0, 0.024890894910641687, 0.02942019512387369, 0.015961934561837282], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a040924a-f12f-41fd-8a5e-56ac9edacd29", 1, 0, 0.0, 161.0, 161, 161, 161.0, 161.0, 161.0, 161.0, 6.211180124223602, 1.9834530279503104, 3.7060850155279503], "isController": false}, {"data": ["https://demoqa.com/books-0", 53, 0, 0.0, 139.33962264150944, 79, 365, 81.0, 322.6, 324.3, 365.0, 0.2294898829601597, 0.1705486337233218, 0.11093505084499906], "isController": false}, {"data": ["https://demoqa.com/books-3", 53, 0, 0.0, 512.3207547169809, 384, 798, 468.0, 695.6, 712.9, 798.0, 0.22937368001938857, 67.44347784866963, 0.11535883321287609], "isController": false}, {"data": ["https://demoqa.com/books-1", 53, 0, 0.0, 110.7358490566038, 78, 328, 82.0, 240.8, 250.0, 328.0, 0.22976347367690922, 0.40657364677984326, 0.11174043934677812], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/88402e4f-a11c-493b-ae47-a5ef6640ba0c", 3, 0, 0.0, 563.6666666666666, 204, 956, 531.0, 956.0, 956.0, 956.0, 0.017363623209376358, 0.023937156344957314, 0.011134875560700332], "isController": false}, {"data": ["https://demoqa.com/books-2", 53, 0, 0.0, 762.3962264150942, 540, 1180, 708.0, 989.4, 1007.9, 1180.0, 0.22915351556082078, 206.19273611054064, 0.11502432324049013], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 93.74999999999999, 81, 239, 83.5, 135.4000000000001, 239.0, 239.0, 0.09886857277035921, 0.07386177555598125, 0.03514468797696362], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 7, 4.1420118343195265, 154.63905325443793, 79, 1260, 86.0, 280.0, 465.0, 1130.500000000002, 0.7261664854831156, 1.5011172463466091, 0.3510193521757065], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 89.99999999999999, 82, 109, 85.0, 109.0, 109.0, 109.0, 0.045534115170955305, 0.03526225911188238, 0.01618595500217552], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f7a730de-a12a-4efc-8b28-8eb3ef555fe6", 3, 0, 0.0, 658.0, 173, 1448, 353.0, 1448.0, 1448.0, 1448.0, 0.03273679615888258, 0.0269716246999127, 0.02099332305761676], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 93.33333333333336, 81, 246, 83.0, 116.4000000000002, 246.0, 246.0, 0.10303849060059991, 0.08361815008701028, 0.036626963455682], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=80c2c77b-91cb-4b97-9a1b-c5ec5182e4db", 1, 0, 0.0, 660.0, 660, 660, 660.0, 660.0, 660.0, 660.0, 1.5151515151515151, 0.27373342803030304, 1.044625946969697], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 182.55555555555554, 159, 321, 166.0, 321.0, 321.0, 321.0, 0.04461895413171515, 0.06915066426467964, 0.10034907359896485], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 236.73333333333332, 160, 486, 166.0, 385.80000000000007, 486.0, 486.0, 0.1071497453407719, 0.16606117759355957, 0.24098228859355242], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/22c6d074-b04e-47cf-a170-d4d0e1c4b27a", 1, 0, 0.0, 202.0, 202, 202, 202.0, 202.0, 202.0, 202.0, 4.9504950495049505, 1.580870977722772, 2.953859839108911], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 108.69230769230768, 80, 242, 85.0, 239.2, 242.0, 242.0, 0.06248377824987743, 0.051805398177876896, 0.022211030549761118], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 94.79999999999998, 80, 234, 85.0, 149.40000000000003, 234.0, 234.0, 0.08454514710855597, 0.06563807807744336, 0.030053157761244505], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0067d220-d93b-4316-a5bc-e9d9abdc39eb", 3, 0, 0.0, 285.0, 174, 396, 285.0, 396.0, 396.0, 396.0, 0.04941362498352879, 0.03176819965575174, 0.03168777383383845], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=017cbbec-e0f8-4e08-b57b-67e11eb81b26", 1, 0, 0.0, 713.0, 713, 713, 713.0, 713.0, 713.0, 713.0, 1.402524544179523, 0.2533857819074334, 0.9669749298737729], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 109.75, 79, 240, 81.0, 235.1, 240.0, 240.0, 0.09577512001819727, 0.07117662727914856, 0.04807462079038418], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 147.8125, 78, 238, 81.0, 237.3, 238.0, 238.0, 0.09586808551433228, 0.03465153823339086, 0.05417155369211965], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 186.0625, 78, 696, 156.5, 376.10000000000036, 696.0, 696.0, 0.09586808551433228, 5.415616471110752, 0.05584503223564376], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 171.56250000000003, 77, 623, 80.0, 353.5000000000003, 623.0, 623.0, 0.09586693669187168, 1.7859780936560055, 0.05593798307948568], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 38.888888888888886, 0.5533596837944664], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.555555555555555, 0.07905138339920949], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.555555555555555, 0.07905138339920949], "isController": false}, {"data": ["401/Unauthorized", 9, 50.0, 0.7114624505928854], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1265, 18, "401/Unauthorized", 9, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
