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

    var data = {"OkPercent": 99.45987654320987, "KoPercent": 0.5401234567901234};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7451827242524917, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.925, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1cffb022-7e07-4efa-86b0-b549f0774f51"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3e298626-3979-4e15-95c8-75e26e61b9b3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/e34abb45-7aa7-4ee6-bb8c-a431c591d44d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5263157894736842, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/34e21cb4-0979-4a00-98e1-b893658b4451"], "isController": false}, {"data": [0.868421052631579, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a64dd096-b03e-4182-9cb4-83c33b4d20ac"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5c5183db-2595-4724-a504-33ac76eec082"], "isController": false}, {"data": [0.6904761904761905, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/450ced3a-9015-4aa3-b8a9-35c3f40a944f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ba6e4e10-d58a-4a94-94cb-7126b0d0a56a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cd0086c3-fa92-402e-a398-d482b2074802"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=947c4838-1b50-4c1d-8e85-1557491d10be"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8c886476-e9d4-443b-b9b6-ba0ffef12054"], "isController": false}, {"data": [0.4473684210526316, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=25c92e30-812e-438d-9114-a4a7bc02aae3"], "isController": false}, {"data": [0.65, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5e9800a8-6b38-47c2-8cbe-208d06ac0eee"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c9e56fa0-b1bf-479c-b1d9-56bb39122af4"], "isController": false}, {"data": [0.2727272727272727, 500, 1500, "register"], "isController": true}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=34e21cb4-0979-4a00-98e1-b893658b4451"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3e298626-3979-4e15-95c8-75e26e61b9b3"], "isController": false}, {"data": [0.24107142857142858, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2727272727272727, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1cffb022-7e07-4efa-86b0-b549f0774f51"], "isController": false}, {"data": [0.84375, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/283e541b-ba39-4d5b-be4b-b500be39700a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=558b57f9-970f-45b4-b356-c24101556631"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/947c4838-1b50-4c1d-8e85-1557491d10be"], "isController": false}, {"data": [0.3474576271186441, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e34abb45-7aa7-4ee6-bb8c-a431c591d44d"], "isController": false}, {"data": [0.9107142857142857, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.38392857142857145, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9655172413793104, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ba6e4e10-d58a-4a94-94cb-7126b0d0a56a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/558b57f9-970f-45b4-b356-c24101556631"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5e9800a8-6b38-47c2-8cbe-208d06ac0eee"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.65625, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/cd0086c3-fa92-402e-a398-d482b2074802"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c9e56fa0-b1bf-479c-b1d9-56bb39122af4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8c886476-e9d4-443b-b9b6-ba0ffef12054"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a64dd096-b03e-4182-9cb4-83c33b4d20ac"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/6c5c91f8-3c70-4149-a8e4-5656cca17462"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/25c92e30-812e-438d-9114-a4a7bc02aae3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1296, 7, 0.5401234567901234, 479.9189814814816, 136, 2645, 166.5, 1343.0999999999997, 1619.0, 2042.12, 5.00285656933743, 695.9684448609738, 3.6566771584469526], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 2364.303571428571, 1723, 3292, 2314.0, 2921.7000000000003, 3041.25, 3292.0, 0.23645353476922557, 284.53451624536063, 1.1626401831670417], "isController": true}, {"data": ["deleteBook", 13, 0, 0.0, 669.6153846153846, 505, 1368, 542.0, 1275.1999999999998, 1368.0, 1368.0, 0.07291123337764092, 0.013172439623890206, 0.04955685393636532], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 0, 0.0, 669.6153846153846, 505, 1368, 542.0, 1275.1999999999998, 1368.0, 1368.0, 0.07098355911565407, 0.01282417816054297, 0.04824663783642112], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 174.7, 138, 442, 145.0, 411.80000000000064, 441.9, 442.0, 0.11259486117053619, 0.03858353201634878, 0.06374144630914046], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 179.35, 138, 455, 148.5, 424.0000000000006, 454.9, 455.0, 0.1125828187360327, 0.08366750493957117, 0.05651129768586016], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 340.20000000000005, 138, 1128, 287.0, 601.1, 1101.6999999999996, 1128.0, 0.11231096660433408, 1.6799154122935585, 0.06565365684507264], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 263.0, 137, 1618, 147.0, 448.1, 1559.5499999999993, 1618.0, 0.11259612894508687, 5.094540503994348, 0.06571039712654679], "isController": false}, {"data": ["goToProfile", 13, 0, 0.0, 313.0769230769231, 244, 544, 293.0, 471.19999999999993, 544.0, 544.0, 0.07245084488831423, 0.17953245345033217, 0.04683833917584378], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1cffb022-7e07-4efa-86b0-b549f0774f51", 1, 0, 0.0, 938.0, 938, 938, 938.0, 938.0, 938.0, 938.0, 1.0660980810234542, 0.1926056103411514, 0.7350246535181237], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3e298626-3979-4e15-95c8-75e26e61b9b3", 1, 0, 0.0, 470.0, 470, 470, 470.0, 470.0, 470.0, 470.0, 2.127659574468085, 0.38439162234042556, 1.4669215425531916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 13, 0, 0.0, 145.23076923076923, 137, 151, 146.0, 150.6, 151.0, 151.0, 0.060585159432177245, 0.04502471321082703, 0.03041091010560459], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 13, 0, 0.0, 145.76923076923077, 136, 151, 148.0, 150.2, 151.0, 151.0, 0.060588547832328185, 0.016212170025447187, 0.034554406185624664], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 1111.25, 999, 1182, 1132.0, 1182.0, 1182.0, 1182.0, 0.07190494166711607, 21.142440318898416, 0.041008287044527136], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1595.75, 1530, 1680, 1586.5, 1680.0, 1680.0, 1680.0, 0.07103534008169064, 63.91772387231397, 0.04044297194104066], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 145.25, 138, 162, 140.5, 162.0, 162.0, 162.0, 0.07303534910896874, 0.12923833260297984, 0.04044047162576687], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e34abb45-7aa7-4ee6-bb8c-a431c591d44d", 3, 0, 0.0, 569.3333333333334, 245, 951, 512.0, 951.0, 951.0, 951.0, 0.018937839697499573, 0.026107340859020407, 0.01214438287893039], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 19, 0, 0.0, 149.42105263157893, 141, 161, 150.0, 158.0, 161.0, 161.0, 0.09621081308264509, 0.07150041870692667, 0.04829331828562458], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 19, 0, 0.0, 176.578947368421, 137, 429, 149.0, 426.0, 429.0, 429.0, 0.09621422350057728, 0.025744821522615407, 0.05487217434017298], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 19, 0, 0.0, 190.63157894736844, 141, 446, 148.0, 417.0, 446.0, 446.0, 0.09621471072287631, 0.025932871249525258, 0.05656372642106596], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 19, 0, 0.0, 174.89473684210526, 139, 431, 147.0, 418.0, 431.0, 431.0, 0.09621617241938098, 0.025933265222411277, 0.056658546844615944], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 143.75, 139, 152, 142.0, 152.0, 152.0, 152.0, 0.07301535147764818, 0.054262385228994396, 0.040999831151999705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 13, 0, 0.0, 145.0769230769231, 138, 153, 146.0, 151.4, 153.0, 153.0, 0.060586853584877524, 0.01633005038029902, 0.03561844322079714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 933.2631578947369, 143, 1753, 1291.0, 1743.0, 1753.0, 1753.0, 0.10349373045874957, 49.02576100233678, 0.056161945219134354], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 13, 0, 0.0, 189.30769230769232, 137, 444, 145.0, 440.0, 444.0, 444.0, 0.060587983072649655, 0.016330354812550102, 0.03567827518828881], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 645.6315789473686, 139, 1180, 854.0, 1179.0, 1180.0, 1180.0, 0.10349542168937212, 16.029576880756935, 0.05626393273069947], "isController": false}, {"data": ["deleteBooks", 13, 0, 0.0, 668.076923076923, 247, 1643, 555.0, 1393.3999999999996, 1643.0, 1643.0, 0.07096573446805723, 0.012820957887295495, 0.04892754739692227], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/34e21cb4-0979-4a00-98e1-b893658b4451", 3, 0, 0.0, 414.66666666666663, 230, 681, 333.0, 681.0, 681.0, 681.0, 0.07356547327121138, 0.03256804806277587, 0.0471757755026974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 19, 0, 0.0, 372.84210526315786, 286, 608, 302.0, 581.0, 608.0, 608.0, 0.09613876365549938, 0.1489963065637476, 0.2162183327134913], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a64dd096-b03e-4182-9cb4-83c33b4d20ac", 3, 0, 0.0, 351.6666666666667, 265, 450, 340.0, 450.0, 450.0, 450.0, 0.020765556863016545, 0.028626996521769227, 0.013316454108119333], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5c5183db-2595-4724-a504-33ac76eec082", 1, 0, 0.0, 244.0, 244, 244, 244.0, 244.0, 244.0, 244.0, 4.0983606557377055, 1.3087538422131149, 2.445408555327869], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 608.6666666666667, 193, 1391, 545.0, 1245.6000000000001, 1382.6, 1391.0, 0.08709681433032919, 0.05349989864626666, 0.03938068851068595], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 177.10526315789474, 137, 431, 147.0, 425.0, 431.0, 431.0, 0.10348809342251465, 0.07690863192825552, 0.05194617189372317], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/450ced3a-9015-4aa3-b8a9-35c3f40a944f", 1, 0, 0.0, 512.0, 512, 512, 512.0, 512.0, 512.0, 512.0, 1.953125, 0.6237030029296875, 1.1653900146484375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 285.0, 141, 451, 158.0, 450.0, 451.0, 451.0, 0.10349260300237488, 0.10950342955421924, 0.0544485137917511], "isController": false}, {"data": ["login", 21, 0, 0.0, 2808.8571428571427, 1783, 4064, 2664.0, 3827.2, 4041.3999999999996, 4064.0, 0.08798391151332327, 20.17172737818418, 0.16053872470462544], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 13, 0, 0.0, 173.92307692307693, 141, 452, 152.0, 333.5999999999999, 452.0, 452.0, 0.057563895924476166, 0.04660202121229565, 0.020462166129403637], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ba6e4e10-d58a-4a94-94cb-7126b0d0a56a", 3, 0, 0.0, 593.3333333333334, 246, 1090, 444.0, 1090.0, 1090.0, 1090.0, 0.04701973261445387, 0.030229157523940883, 0.030152628011222045], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cd0086c3-fa92-402e-a398-d482b2074802", 1, 0, 0.0, 633.0, 633, 633, 633.0, 633.0, 633.0, 633.0, 1.5797788309636651, 0.2854092614533965, 1.0891834518167456], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=947c4838-1b50-4c1d-8e85-1557491d10be", 1, 0, 0.0, 1019.0, 1019, 1019, 1019.0, 1019.0, 1019.0, 1019.0, 0.9813542688910696, 0.17729544896957802, 0.6765977674190383], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8c886476-e9d4-443b-b9b6-ba0ffef12054", 3, 0, 0.0, 415.0, 254, 544, 447.0, 544.0, 544.0, 544.0, 0.022188200315072442, 0.02622570160938413, 0.014228761269756744], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 1129.5263157894735, 290, 1901, 1437.0, 1883.0, 1901.0, 1901.0, 0.10340698813540873, 65.18681182479318, 0.21863966236257754], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=25c92e30-812e-438d-9114-a4a7bc02aae3", 1, 0, 0.0, 366.0, 366, 366, 366.0, 366.0, 366.0, 366.0, 2.73224043715847, 0.49361765710382516, 1.8837517076502732], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 592.4, 293, 1761, 580.5, 898.5, 1717.8999999999994, 1761.0, 0.1122069994726271, 6.87713302876146, 0.2509207110277039], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 0, 0.0, 1740.75, 1683, 1819, 1730.5, 1819.0, 1819.0, 1819.0, 0.07084285284168393, 84.75268095921223, 0.1597423312611799], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5e9800a8-6b38-47c2-8cbe-208d06ac0eee", 1, 0, 0.0, 797.0, 797, 797, 797.0, 797.0, 797.0, 797.0, 1.2547051442910915, 0.22668012860727726, 0.865060382685069], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c9e56fa0-b1bf-479c-b1d9-56bb39122af4", 1, 0, 0.0, 552.0, 552, 552, 552.0, 552.0, 552.0, 552.0, 1.8115942028985508, 0.32728996829710144, 1.2490092844202898], "isController": false}, {"data": ["register", 22, 5, 22.727272727272727, 1147.5, 236, 1740, 1167.0, 1675.0, 1731.1499999999999, 1740.0, 0.09009082793470873, 0.028489304785460978, 0.04064644775960491], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 13, 0, 0.0, 339.9230769230769, 285, 594, 295.0, 589.2, 594.0, 594.0, 0.06054368226675546, 0.09383088257552824, 0.13616416041048615], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 150.3125, 139, 159, 151.0, 156.9, 159.0, 159.0, 0.14019960919358937, 0.10884637627822612, 0.04983657983053372], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 515.1875, 293, 1621, 439.5, 991.7000000000006, 1621.0, 1621.0, 0.08836312827564878, 6.7354503292216865, 0.1973177130793998], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=34e21cb4-0979-4a00-98e1-b893658b4451", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 0.7314334514170041, 2.791308198380567], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 150.28571428571428, 146, 158, 150.0, 158.0, 158.0, 158.0, 0.11729812155436767, 0.0871717485379627, 0.05887815867084471], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 144.14285714285714, 140, 151, 143.0, 151.0, 151.0, 151.0, 0.11730598428099812, 0.031388515325188944, 0.06690106916025673], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 187.14285714285714, 139, 433, 147.0, 433.0, 433.0, 433.0, 0.1167367086918818, 0.03146419101460877, 0.06862841663331332], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 144.2857142857143, 138, 151, 144.0, 151.0, 151.0, 151.0, 0.11730205278592376, 0.03161656891495601, 0.06907532991202346], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3e298626-3979-4e15-95c8-75e26e61b9b3", 3, 0, 0.0, 413.66666666666663, 237, 752, 252.0, 752.0, 752.0, 752.0, 0.02441207584018228, 0.02448359559362031, 0.015654879363658555], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1621.4642857142856, 1109, 2645, 1550.0, 2299.8, 2433.75, 2645.0, 0.2358699177403662, 282.1824232685674, 0.46575095085060586], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, 22.727272727272727, 1147.5, 236, 1740, 1167.0, 1675.0, 1731.1499999999999, 1740.0, 0.08516469691045707, 0.026931520809219466, 0.038423915988897626], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 203.2, 137, 433, 145.0, 433.0, 433.0, 433.0, 0.04494382022471911, 0.01211376404494382, 0.026465941011235956], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 201.2, 138, 433, 145.0, 433.0, 433.0, 433.0, 0.044943012260453746, 0.012113546273325424, 0.026421575567180815], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1cffb022-7e07-4efa-86b0-b549f0774f51", 3, 0, 0.0, 336.3333333333333, 251, 502, 256.0, 502.0, 502.0, 502.0, 0.0240080667104147, 0.024078402843355367, 0.01539579798812401], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 519.0, 142, 1743, 433.0, 1569.4, 1743.0, 1743.0, 0.13174037266057917, 22.255141412483226, 0.07532616034450108], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 353.5625, 138, 1139, 149.0, 961.2000000000002, 1139.0, 1139.0, 0.1317577304730926, 7.292819332358875, 0.07546475480709845], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 146.4, 144, 150, 146.0, 150.0, 150.0, 150.0, 0.044943416238955154, 0.012025875048314172, 0.025631792073779112], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 201.25, 138, 455, 147.5, 446.6, 455.0, 455.0, 0.13206114430981544, 0.0981430965036812, 0.06628850407738783], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 146.8, 140, 150, 148.0, 150.0, 150.0, 150.0, 0.044941800368522765, 0.033399130937935374, 0.022558677138106154], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 217.93750000000003, 138, 445, 146.5, 444.3, 445.0, 445.0, 0.13207313549878247, 0.07253381794543728, 0.0732431951380577], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 150.4, 146, 155, 151.0, 155.0, 155.0, 155.0, 0.041463839385671754, 0.03263657670395648, 0.014739099156625506], "isController": false}, {"data": ["deleteAccount", 12, 0, 0.0, 547.5, 432, 771, 509.0, 765.3000000000001, 771.0, 771.0, 0.07279698135183994, 0.013151798388760145, 0.04955028906468011], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1527.7142857142858, 1180, 2183, 1440.0, 2058.0, 2175.0, 2183.0, 0.087769892419189, 0.04542777634977556, 0.04037072200140432], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 352.8, 285, 583, 297.0, 583.0, 583.0, 583.0, 0.044882900512562725, 0.06955972960296586, 0.10094269519573433], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/283e541b-ba39-4d5b-be4b-b500be39700a", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 1.2928580465587045, 2.4157072368421053], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=558b57f9-970f-45b4-b356-c24101556631", 1, 0, 0.0, 441.0, 441, 441, 441.0, 441.0, 441.0, 441.0, 2.2675736961451247, 0.4096690759637188, 1.5633857709750567], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/947c4838-1b50-4c1d-8e85-1557491d10be", 3, 0, 0.0, 481.3333333333333, 357, 559, 528.0, 559.0, 559.0, 559.0, 0.01882459244757351, 0.025951220382641214, 0.012071760130768168], "isController": false}, {"data": ["addBook", 59, 2, 3.389830508474576, 1446.355932203389, 838, 2803, 1178.0, 2466.0, 2533.0, 2803.0, 0.2771592585285192, 85.32359884837979, 1.009546727171942], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e34abb45-7aa7-4ee6-bb8c-a431c591d44d", 1, 0, 0.0, 463.0, 463, 463, 463.0, 463.0, 463.0, 463.0, 2.1598272138228944, 0.3902031587473002, 1.4890996220302375], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 275.94642857142856, 140, 658, 152.0, 595.9, 611.05, 658.0, 0.23689164322426445, 0.17604935595084498, 0.1145130501914169], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 927.0714285714286, 688, 1354, 878.0, 1179.4, 1324.5, 1354.0, 0.23683954543724386, 69.63869017158179, 0.11911363857439511], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 244.01785714285708, 140, 582, 151.0, 444.3, 449.45, 582.0, 0.23739878757047778, 0.42008457331807203, 0.11545370723642376], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1341.5178571428576, 952, 1985, 1309.0, 1769.4, 1848.75, 1985.0, 0.2365194473892054, 212.82061451764815, 0.11872167574028475], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 168.68750000000003, 146, 433, 152.0, 239.1000000000002, 433.0, 433.0, 0.08922248183486034, 0.06665546738639469, 0.03171580408973551], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 2, 1.1494252873563218, 225.45402298850573, 139, 1642, 155.5, 395.5, 449.0, 912.25, 0.7125277947264753, 1.489283706096617, 0.34398293439625555], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 152.2857142857143, 145, 158, 153.0, 158.0, 158.0, 158.0, 0.14752992749957847, 0.11424925049527904, 0.05244227891586579], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ba6e4e10-d58a-4a94-94cb-7126b0d0a56a", 1, 0, 0.0, 561.0, 561, 561, 561.0, 561.0, 561.0, 561.0, 1.7825311942959001, 0.32203932709447414, 1.2289717023172904], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 154.54999999999998, 147, 166, 153.5, 162.8, 165.85, 166.0, 0.10618754844806898, 0.08617368433627473, 0.03774635511239952], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/558b57f9-970f-45b4-b356-c24101556631", 3, 0, 0.0, 379.0, 293, 506, 338.0, 506.0, 506.0, 506.0, 0.03804788961038961, 0.031718960056057226, 0.02439920004312094], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5e9800a8-6b38-47c2-8cbe-208d06ac0eee", 3, 0, 0.0, 405.0, 312, 545, 358.0, 545.0, 545.0, 545.0, 0.01958608082522687, 0.027000993585558533, 0.01256008438336489], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 338.7142857142857, 291, 591, 297.0, 591.0, 591.0, 591.0, 0.11645316918981867, 0.18047966748461156, 0.2619059068790551], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 722.6875, 292, 1894, 580.5, 1717.6000000000001, 1894.0, 1894.0, 0.13157894736842105, 29.680842349403783, 0.28961181640625], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 19, 0, 0.0, 182.78947368421052, 144, 428, 152.0, 418.0, 428.0, 428.0, 0.09568365974890594, 0.07933147180353627, 0.03401255092636891], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cd0086c3-fa92-402e-a398-d482b2074802", 3, 0, 0.0, 542.6666666666666, 291, 771, 566.0, 771.0, 771.0, 771.0, 0.02722792495983881, 0.02730769427124459, 0.01746061594104247], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 168.6842105263158, 141, 453, 151.0, 176.0, 453.0, 453.0, 0.10513268851951042, 0.08162156970020584, 0.03737138537216972], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c9e56fa0-b1bf-479c-b1d9-56bb39122af4", 2, 0, 0.0, 309.5, 257, 362, 309.5, 362.0, 362.0, 362.0, 0.022014309301045677, 0.025346553384700057, 0.013683699091909743], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8c886476-e9d4-443b-b9b6-ba0ffef12054", 1, 0, 0.0, 555.0, 555, 555, 555.0, 555.0, 555.0, 555.0, 1.8018018018018018, 0.3255208333333333, 1.2422578828828827], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a64dd096-b03e-4182-9cb4-83c33b4d20ac", 1, 0, 0.0, 1643.0, 1643, 1643, 1643.0, 1643.0, 1643.0, 1643.0, 0.6086427267194157, 0.10995986762020694, 0.41963062994522216], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 147.87500000000003, 143, 156, 148.0, 153.9, 156.0, 156.0, 0.08843638936331327, 0.06572274639207168, 0.04439092200463186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 182.125, 140, 435, 147.5, 435.0, 435.0, 435.0, 0.08843687817820031, 0.031965526890338276, 0.04997244983970816], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 353.125, 143, 1469, 281.5, 751.5000000000007, 1469.0, 1469.0, 0.08843394536993024, 4.99565969823298, 0.05151450040347988], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6c5c91f8-3c70-4149-a8e4-5656cca17462", 1, 0, 0.0, 535.0, 535, 535, 535.0, 535.0, 535.0, 535.0, 1.8691588785046729, 0.5968896028037383, 1.1152891355140186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 323.4375, 140, 1126, 151.0, 741.7000000000004, 1126.0, 1126.0, 0.08843736699849104, 1.6475669878509167, 0.05160285818515468], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/25c92e30-812e-438d-9114-a4a7bc02aae3", 3, 0, 0.0, 312.0, 244, 432, 260.0, 432.0, 432.0, 432.0, 0.0731368390258173, 0.03309251505399937, 0.046900902630488316], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 71.42857142857143, 0.38580246913580246], "isController": false}, {"data": ["401/Unauthorized", 2, 28.571428571428573, 0.15432098765432098], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1296, 7, "406/Not Acceptable", 5, "401/Unauthorized", 2, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
