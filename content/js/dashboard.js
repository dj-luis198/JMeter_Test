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

    var data = {"OkPercent": 98.95330112721417, "KoPercent": 1.0466988727858293};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.710617626648161, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c2a694f6-8537-4cc2-bb39-12628718c813"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/0775a63b-4a71-4c2d-abbd-68a754885a8f"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/316988ba-2940-4fdb-93d9-332cf2619feb"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4166666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/470d9164-a476-405f-9621-41144c5133a5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b1a74f61-044d-4697-8b30-bcb89f6a3a9b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5cbcb24d-eb0a-49f4-ae52-4438d55a2e17"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fadf2acd-2849-4f64-9cf8-08194de245e2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/7c5e84c3-197f-4168-abb4-e9ea50212a64"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a3ff62d9-d462-4b2c-8af3-c54c59f2987c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.782608695652174, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.8043478260869565, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/be119991-a07e-4ae8-8525-38ab6781a9b3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/808fe225-9886-4731-8617-ef43cd5b522e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/3a7ea43c-b445-4f5a-9a34-e86b4f3355f1"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.90625, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/1da03612-8a39-41aa-b371-317e7d03eebe"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a25da9ef-6f50-4e5a-a640-c58dfb6dcdda"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a45fb943-fa26-48f9-ac11-bb7af497a0c4"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0e1ad459-fd00-4704-93f0-d522c06a2ca2"], "isController": false}, {"data": [0.6956521739130435, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.20454545454545456, 500, 1500, "register"], "isController": true}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/b1a74f61-044d-4697-8b30-bcb89f6a3a9b"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/a3ff62d9-d462-4b2c-8af3-c54c59f2987c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.35964912280701755, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.20454545454545456, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.15, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/fadf2acd-2849-4f64-9cf8-08194de245e2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a25da9ef-6f50-4e5a-a640-c58dfb6dcdda"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c2a694f6-8537-4cc2-bb39-12628718c813"], "isController": false}, {"data": [0.15384615384615385, 500, 1500, "addBook"], "isController": true}, {"data": [0.9122807017543859, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=be119991-a07e-4ae8-8525-38ab6781a9b3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=316988ba-2940-4fdb-93d9-332cf2619feb"], "isController": false}, {"data": [0.9912280701754386, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=470d9164-a476-405f-9621-41144c5133a5"], "isController": false}, {"data": [0.8198757763975155, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/5cbcb24d-eb0a-49f4-ae52-4438d55a2e17"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7c5e84c3-197f-4168-abb4-e9ea50212a64"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8529411764705882, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/50744103-d607-4d75-b66b-73a1add36ed7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/0e1ad459-fd00-4704-93f0-d522c06a2ca2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1242, 13, 1.0466988727858293, 532.6996779388081, 133, 7359, 149.5, 1265.9000000000003, 1663.6999999999998, 3149.909999999996, 4.999416332231744, 725.6200227856853, 3.6503410871415976], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 2101.456140350878, 1628, 3678, 1978.0, 2510.8, 2805.899999999996, 3678.0, 0.2493809227969164, 300.088958167444, 1.2262040491039787], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/c2a694f6-8537-4cc2-bb39-12628718c813", 3, 0, 0.0, 686.0, 418, 1153, 487.0, 1153.0, 1153.0, 1153.0, 0.020262877058370595, 0.023950034700176964, 0.012994097592770206], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0775a63b-4a71-4c2d-abbd-68a754885a8f", 1, 0, 0.0, 518.0, 518, 518, 518.0, 518.0, 518.0, 518.0, 1.9305019305019306, 0.6164786438223938, 1.1518912886100385], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/316988ba-2940-4fdb-93d9-332cf2619feb", 3, 0, 0.0, 1799.3333333333333, 437, 3049, 1912.0, 3049.0, 3049.0, 3049.0, 0.03053652677544456, 0.0251588376525554, 0.01958234301680527], "isController": false}, {"data": ["deleteBook", 12, 1, 8.333333333333334, 1002.7500000000001, 179, 2157, 879.0, 2001.6000000000006, 2157.0, 2157.0, 0.07498031766661252, 0.014260172720285924, 0.05066419088426788], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, 8.333333333333334, 1002.7500000000001, 179, 2157, 879.0, 2001.6000000000006, 2157.0, 2157.0, 0.07693984586384212, 0.014632846662093019, 0.05198824383198902], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 184.33333333333334, 133, 424, 139.0, 418.6, 424.0, 424.0, 0.0947682652669043, 0.033265553183423974, 0.05360535664457162], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 169.83333333333331, 134, 420, 139.0, 412.8, 420.0, 420.0, 0.09476626952580013, 0.07042688584876357, 0.04756822513306764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 214.5, 135, 687, 140.5, 442.2000000000004, 687.0, 687.0, 0.09476976212789706, 1.5722052627491656, 0.05535434348247286], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 245.94444444444446, 135, 1261, 139.5, 496.0000000000012, 1261.0, 1261.0, 0.09476976212789706, 4.761568697876631, 0.05526179488664484], "isController": false}, {"data": ["goToProfile", 12, 1, 8.333333333333334, 855.0833333333334, 138, 2562, 462.0, 2562.0, 2562.0, 2562.0, 0.0743052459503641, 0.1497412764867241, 0.04803113351104671], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/470d9164-a476-405f-9621-41144c5133a5", 3, 0, 0.0, 706.6666666666666, 505, 1106, 509.0, 1106.0, 1106.0, 1106.0, 0.0357577057855968, 0.029809728032849415, 0.02293056002526878], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 161.06250000000003, 138, 419, 141.0, 255.20000000000016, 419.0, 419.0, 0.1104369853463925, 0.08207279868027803, 0.05543418991020093], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 963.3333333333334, 929, 988, 973.0, 988.0, 988.0, 988.0, 0.019758680647030926, 5.809708160170452, 0.011268622556509827], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 210.87500000000003, 135, 425, 141.0, 422.2, 425.0, 425.0, 0.110413360016562, 0.050273661238009804, 0.0618109947553654], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b1a74f61-044d-4697-8b30-bcb89f6a3a9b", 1, 0, 0.0, 3114.0, 3114, 3114, 3114.0, 3114.0, 3114.0, 3114.0, 0.3211303789338471, 0.05801671885035325, 0.22140434328837508], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 1175.3333333333333, 931, 1356, 1239.0, 1356.0, 1356.0, 1356.0, 0.019758420380152006, 17.7786613896591, 0.01124917879065295], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5cbcb24d-eb0a-49f4-ae52-4438d55a2e17", 1, 0, 0.0, 723.0, 723, 723, 723.0, 723.0, 723.0, 723.0, 1.3831258644536653, 0.2498811376210235, 0.953600449515906], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 231.33333333333331, 138, 415, 141.0, 415.0, 415.0, 415.0, 0.019825797327482523, 0.0350823679271468, 0.01097776082488534], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fadf2acd-2849-4f64-9cf8-08194de245e2", 1, 0, 0.0, 440.0, 440, 440, 440.0, 440.0, 440.0, 440.0, 2.2727272727272725, 0.41060014204545453, 1.5669389204545454], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7c5e84c3-197f-4168-abb4-e9ea50212a64", 3, 0, 0.0, 1414.3333333333333, 295, 2852, 1096.0, 2852.0, 2852.0, 2852.0, 0.03544046592399201, 0.02278480475256648, 0.022727121702559982], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 8, 0, 0.0, 177.375, 136, 421, 143.0, 421.0, 421.0, 421.0, 0.04655276756203156, 0.03459634386201759, 0.02336730715516037], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 8, 0, 0.0, 176.625, 139, 422, 142.0, 422.0, 422.0, 422.0, 0.04655195489115571, 0.012456284804860024, 0.02654916177386224], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 8, 0, 0.0, 208.0, 134, 426, 139.5, 426.0, 426.0, 426.0, 0.04655168400716896, 0.012547133580057258, 0.027367298605777062], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 8, 0, 0.0, 173.625, 138, 400, 141.5, 400.0, 400.0, 400.0, 0.04655168400716896, 0.012547133580057258, 0.027412759234690314], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a3ff62d9-d462-4b2c-8af3-c54c59f2987c", 1, 0, 0.0, 989.0, 989, 989, 989.0, 989.0, 989.0, 989.0, 1.0111223458038423, 0.18267347067745196, 0.6971214610717897], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 228.0, 140, 402, 142.0, 402.0, 402.0, 402.0, 0.019861630639875533, 0.014760450114204378, 0.011152771111258236], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 23, 0, 0.0, 594.086956521739, 136, 1521, 142.0, 1395.0, 1497.7999999999997, 1521.0, 0.12010318430094725, 42.307596045015195, 0.06656874014370606], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 279.6875, 136, 1244, 140.5, 1045.2000000000003, 1244.0, 1244.0, 0.11040802666353844, 12.444205670314732, 0.06372182007631955], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 23, 0, 0.0, 482.0869565217391, 134, 1119, 142.0, 1103.6, 1116.0, 1119.0, 0.12010192998579665, 13.83820842188675, 0.0666853319643454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 310.9375, 136, 1107, 140.5, 1073.4, 1107.0, 1107.0, 0.11041031232317099, 4.084076374608388, 0.06383096181183323], "isController": false}, {"data": ["deleteBooks", 12, 1, 8.333333333333334, 1833.6666666666665, 141, 7359, 972.0, 6104.400000000005, 7359.0, 7359.0, 0.0760292459165959, 0.014459663713141654, 0.05196693004992587], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 8, 0, 0.0, 425.75, 279, 848, 292.0, 848.0, 848.0, 848.0, 0.04651433222861794, 0.07208813012384441, 0.10461182336182336], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/be119991-a07e-4ae8-8525-38ab6781a9b3", 3, 0, 0.0, 1230.6666666666667, 512, 2562, 618.0, 2562.0, 2562.0, 2562.0, 0.07221085569864003, 0.03267353171260079, 0.046307091707786734], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/808fe225-9886-4731-8617-ef43cd5b522e", 1, 0, 0.0, 350.0, 350, 350, 350.0, 350.0, 350.0, 350.0, 2.857142857142857, 0.9123883928571429, 1.7047991071428572], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3a7ea43c-b445-4f5a-9a34-e86b4f3355f1", 1, 0, 0.0, 978.0, 978, 978, 978.0, 978.0, 978.0, 978.0, 1.0224948875255624, 0.3265193634969325, 0.6101019299591002], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 744.95, 177, 3734, 518.5, 1622.2000000000007, 3630.0999999999985, 3734.0, 0.08942664109064732, 0.054931012935563635, 0.04043411604000948], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 23, 0, 0.0, 152.95652173913044, 134, 435, 140.0, 147.0, 377.79999999999916, 435.0, 0.12010255714009702, 0.08925590428087289, 0.06028585387696277], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 23, 0, 0.0, 175.34782608695653, 134, 423, 139.0, 414.0, 421.59999999999997, 423.0, 0.12010192998579665, 0.1027230501712758, 0.06454866804348734], "isController": false}, {"data": ["login", 20, 0, 0.0, 4415.850000000001, 1947, 7861, 4147.5, 7640.9000000000015, 7854.4, 7861.0, 0.09058053062074838, 16.381979902161703, 0.15919705171695395], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 312.25, 139, 1865, 142.5, 1145.4000000000008, 1865.0, 1865.0, 0.10826831595401304, 0.08765081438073906, 0.03848600293677807], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1da03612-8a39-41aa-b371-317e7d03eebe", 1, 0, 0.0, 601.0, 601, 601, 601.0, 601.0, 601.0, 601.0, 1.663893510815308, 0.5313409941763727, 0.9928114600665557], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a25da9ef-6f50-4e5a-a640-c58dfb6dcdda", 3, 0, 0.0, 658.3333333333333, 258, 1285, 432.0, 1285.0, 1285.0, 1285.0, 0.01763139799354691, 0.0243063055021716, 0.011306593114351369], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a45fb943-fa26-48f9-ac11-bb7af497a0c4", 1, 0, 0.0, 341.0, 341, 341, 341.0, 341.0, 341.0, 341.0, 2.932551319648094, 0.9364690249266862, 1.7497938049853372], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0e1ad459-fd00-4704-93f0-d522c06a2ca2", 1, 0, 0.0, 7359.0, 7359, 7359, 7359.0, 7359.0, 7359.0, 7359.0, 0.1358880282647099, 0.024550083231417313, 0.09368842573719255], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 23, 0, 0.0, 761.6521739130434, 277, 1662, 290.0, 1536.0, 1638.3999999999996, 1662.0, 0.12001356675102404, 56.29589173667458, 0.25789769984867855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 449.33333333333337, 274, 1402, 283.5, 891.7000000000008, 1402.0, 1402.0, 0.09469796609812814, 6.4325925984990375, 0.2116318695482907], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 2, 40.0, 897.6, 138, 1496, 1334.0, 1496.0, 1496.0, 1496.0, 0.032899715088467334, 23.619219520058955, 0.05323071089704363], "isController": false}, {"data": ["register", 22, 3, 13.636363636363637, 1353.5, 330, 2502, 1369.5, 2199.7999999999997, 2462.2499999999995, 2502.0, 0.08755312883044938, 0.02796663330361833, 0.039501509296550406], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 534.0625, 278, 1664, 433.0, 1337.8000000000004, 1664.0, 1664.0, 0.11030222810500771, 16.64455505546134, 0.24454456382362671], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 160.0, 141, 428, 144.0, 202.3999999999998, 428.0, 428.0, 0.10100950083481382, 0.07842046207390331, 0.035905720999875226], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b1a74f61-044d-4697-8b30-bcb89f6a3a9b", 3, 0, 0.0, 1124.0, 590, 1647, 1135.0, 1647.0, 1647.0, 1647.0, 0.02727099184597344, 0.022734703814302724, 0.017488233703309788], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 539.0, 275, 1655, 284.0, 1652.0, 1655.0, 1655.0, 0.08770852702299718, 14.108459039752429, 0.1942663930891528], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 6, 0, 0.0, 141.16666666666669, 139, 143, 141.0, 143.0, 143.0, 143.0, 0.027152515680577805, 0.020178773860273155, 0.013629290097477532], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a3ff62d9-d462-4b2c-8af3-c54c59f2987c", 3, 0, 0.0, 1541.6666666666667, 293, 2915, 1417.0, 2915.0, 2915.0, 2915.0, 0.0157035175879397, 0.021648566726863484, 0.010070289599036851], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 6, 0, 0.0, 230.33333333333334, 137, 428, 138.5, 428.0, 428.0, 428.0, 0.027153007195546905, 0.014062641421912476, 0.015105628026428928], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 6, 0, 0.0, 327.0, 134, 994, 139.5, 994.0, 994.0, 994.0, 0.02711839892972719, 4.072954884306131, 0.015554237927792742], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 6, 0, 0.0, 277.8333333333333, 139, 962, 141.5, 962.0, 962.0, 962.0, 0.027152515680577805, 1.3367222359870392, 0.015600322322988226], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 141.0, 141, 141, 141.0, 141.0, 141.0, 141.0, 7.092198581560283, 2.0916445035460995, 4.3841422872340425], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1340.736842105263, 1070, 1957, 1132.0, 1827.6000000000001, 1945.8, 1957.0, 0.2550609461418676, 305.14156511773075, 0.5036457354481018], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 3, 13.636363636363637, 1353.5, 330, 2502, 1369.5, 2199.7999999999997, 2462.2499999999995, 2502.0, 0.08996078527587294, 0.02873569827970444, 0.04058777616938798], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 228.66666666666669, 134, 415, 138.0, 415.0, 415.0, 415.0, 0.03872241834410031, 0.010436901819308288, 0.022802361583488757], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 230.16666666666669, 137, 417, 140.0, 417.0, 417.0, 417.0, 0.03872341798702766, 0.010437171254316048, 0.022765134402529932], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 206.11764705882354, 135, 421, 141.0, 421.0, 421.0, 421.0, 0.10127245865700805, 0.0272960923723967, 0.05953712901515512], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 188.1764705882353, 135, 425, 140.0, 417.0, 425.0, 425.0, 0.10127607859023699, 0.027297068057524812, 0.05963815956046182], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 157.41176470588235, 136, 427, 141.0, 201.3999999999998, 427.0, 427.0, 0.10144166507542486, 0.07538779992421711, 0.05091896078981287], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 181.5, 133, 400, 139.5, 400.0, 400.0, 400.0, 0.038790762626393235, 0.010379559530890379, 0.022122856810364893], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 140.41176470588235, 135, 151, 140.0, 145.4, 151.0, 151.0, 0.10144166507542486, 0.02714357053776017, 0.057853449613328244], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 186.0, 136, 415, 142.0, 415.0, 415.0, 415.0, 0.03879001027935273, 0.02882734162362053, 0.019470766878503222], "isController": false}, {"data": ["deleteAccount", 12, 1, 8.333333333333334, 1136.25, 138, 1912, 1144.0, 1787.2000000000005, 1912.0, 1912.0, 0.07424731781564392, 0.013951583401393373, 0.050531438711932775], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 186.0, 142, 404, 142.5, 404.0, 404.0, 404.0, 0.037691520036183854, 0.02966734877848065, 0.013398157512862231], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 2519.8, 981, 5955, 1762.0, 5200.900000000001, 5919.2, 5955.0, 0.09017295172140165, 0.04667154727767859, 0.04147603541091814], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 464.5, 278, 831, 419.0, 831.0, 831.0, 831.0, 0.038686714982075154, 0.05995685222319655, 0.08700732871456941], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fadf2acd-2849-4f64-9cf8-08194de245e2", 3, 0, 0.0, 530.3333333333334, 250, 829, 512.0, 829.0, 829.0, 829.0, 0.07053512649299351, 0.031915307885827145, 0.045232486715884514], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a25da9ef-6f50-4e5a-a640-c58dfb6dcdda", 1, 0, 0.0, 709.0, 709, 709, 709.0, 709.0, 709.0, 709.0, 1.4104372355430184, 0.2548153208744711, 0.9724303596614952], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c2a694f6-8537-4cc2-bb39-12628718c813", 1, 0, 0.0, 1789.0, 1789, 1789, 1789.0, 1789.0, 1789.0, 1789.0, 0.5589714924538849, 0.10098606064840694, 0.38538464225824487], "isController": false}, {"data": ["addBook", 52, 6, 11.538461538461538, 2271.7692307692305, 697, 7222, 1945.0, 4616.3, 5655.899999999989, 7222.0, 0.256492465533825, 89.51601979647076, 0.9305173625668977], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 250.43859649122814, 134, 802, 143.0, 552.6, 577.0999999999997, 802.0, 0.2561694133720434, 0.1903759019298096, 0.12383189415933739], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 823.4912280701752, 663, 1160, 709.0, 1108.4, 1118.6, 1160.0, 0.2563249300727603, 75.36804023008536, 0.1289134169799527], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=be119991-a07e-4ae8-8525-38ab6781a9b3", 1, 0, 0.0, 264.0, 264, 264, 264.0, 264.0, 264.0, 264.0, 3.787878787878788, 0.6843335700757576, 2.611564867424242], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=316988ba-2940-4fdb-93d9-332cf2619feb", 1, 0, 0.0, 2344.0, 2344, 2344, 2344.0, 2344.0, 2344.0, 2344.0, 0.42662116040955633, 0.07707511198805461, 0.2941352922354949], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 200.9649122807018, 133, 576, 141.0, 416.2, 424.9, 576.0, 0.25697553322423144, 0.4547262365256908, 0.12497442924381567], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 1081.8947368421047, 926, 1457, 979.0, 1276.2, 1373.0, 1457.0, 0.2560221346856093, 230.3691668290199, 0.12851111057461248], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 161.93333333333337, 139, 423, 144.0, 260.4000000000001, 423.0, 423.0, 0.08462146000225657, 0.06321818056809207, 0.030080284610177144], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=470d9164-a476-405f-9621-41144c5133a5", 1, 0, 0.0, 3177.0, 3177, 3177, 3177.0, 3177.0, 3177.0, 3177.0, 0.3147623544224111, 0.056866245672017625, 0.2170138888888889], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 161, 6, 3.7267080745341614, 504.90062111801257, 136, 6638, 145.0, 1768.000000000001, 2495.9000000000005, 6446.419999999998, 0.6815622592307237, 1.564743982884744, 0.3230541609164261], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 6, 0, 0.0, 188.16666666666666, 137, 415, 143.5, 415.0, 415.0, 415.0, 0.027152884315136377, 0.02102757545107729, 0.009652001846396134], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5cbcb24d-eb0a-49f4-ae52-4438d55a2e17", 3, 0, 0.0, 1452.3333333333333, 345, 2562, 1450.0, 2562.0, 2562.0, 2562.0, 0.02590740692764061, 0.021344937152948697, 0.01661379936440495], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 263.6111111111111, 136, 1777, 143.5, 552.100000000002, 1777.0, 1777.0, 0.08924808488484517, 0.07242691263604135, 0.03172490517390981], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7c5e84c3-197f-4168-abb4-e9ea50212a64", 1, 0, 0.0, 955.0, 955, 955, 955.0, 955.0, 955.0, 955.0, 1.0471204188481678, 0.18917702879581152, 0.721940445026178], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 6, 0, 0.0, 515.6666666666667, 282, 1138, 413.5, 1138.0, 1138.0, 1138.0, 0.027100883037105627, 5.438680546929696, 0.05979485196142641], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 382.5294117647059, 276, 849, 285.0, 623.3999999999997, 849.0, 849.0, 0.10118686237396284, 0.15681987362058497, 0.2275716250461293], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/50744103-d607-4d75-b66b-73a1add36ed7", 1, 0, 0.0, 1786.0, 1786, 1786, 1786.0, 1786.0, 1786.0, 1786.0, 0.5599104143337066, 0.17879951707726763, 0.3340871710526316], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 8, 0, 0.0, 144.625, 140, 154, 143.0, 154.0, 154.0, 154.0, 0.046928803139536936, 0.038908744009244975, 0.01668172299100727], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 23, 0, 0.0, 168.95652173913047, 138, 425, 144.0, 307.2000000000003, 417.9999999999999, 425.0, 0.11484438585716356, 0.08916141284809084, 0.04082359028516361], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 178.26666666666668, 137, 430, 141.0, 423.4, 430.0, 430.0, 0.08791981712678038, 0.06533884847019518, 0.044131626956215926], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0e1ad459-fd00-4704-93f0-d522c06a2ca2", 3, 0, 0.0, 1475.0, 387, 2542, 1496.0, 2542.0, 2542.0, 2542.0, 0.021623024196164076, 0.021686372899863773, 0.013866327365378654], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 212.2, 135, 426, 141.0, 417.0, 426.0, 426.0, 0.0879187864862964, 0.041131796854851944, 0.049156675673457904], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 321.19999999999993, 135, 1230, 139.0, 1227.0, 1230.0, 1230.0, 0.08792239383370945, 10.568901391371883, 0.05068130696638434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 268.7333333333333, 137, 959, 140.0, 800.6000000000001, 959.0, 959.0, 0.08778038518033017, 3.4618846594998858, 0.05068517162528309], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 3, 23.076923076923077, 0.24154589371980675], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 7.6923076923076925, 0.08051529790660225], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 7.6923076923076925, 0.08051529790660225], "isController": false}, {"data": ["401/Unauthorized", 8, 61.53846153846154, 0.644122383252818], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1242, 13, "401/Unauthorized", 8, "406/Not Acceptable", 3, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 3, "406/Not Acceptable", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 161, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
