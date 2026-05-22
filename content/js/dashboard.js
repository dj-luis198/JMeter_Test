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

    var data = {"OkPercent": 98.13988095238095, "KoPercent": 1.8601190476190477};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8095086151882578, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3793103448275862, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a597e044-7f52-4619-9c1b-0a64a3e5cfe8"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e38bbc33-2a8a-4035-be3e-d798e59fae11"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4399ebec-72e9-441f-887f-ded3ca5bf148"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=557304d2-ba8b-41d0-8457-605b38e56a85"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ffd275ad-722f-46ea-a778-139f8f9f1e0a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a56f1de5-6349-48cb-aaf2-4a9c6bd2f68b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/557304d2-ba8b-41d0-8457-605b38e56a85"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eae76f1c-d760-4d34-ba25-da2e8fe7e0ad"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fdfa957e-6da9-4b4d-80a5-e572b8ee6baf"], "isController": false}, {"data": [0.6521739130434783, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=69157bec-6f6c-42d2-ab14-db2cad2e0d83"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/12e2cabf-7838-4b3c-88e9-d73a90125fc4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c0d59169-5685-421a-b9eb-376145fa763e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8db94d54-65a8-4f3f-81b6-4ff849c52220"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a597e044-7f52-4619-9c1b-0a64a3e5cfe8"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5fffe541-e1e9-4972-9fbc-25354938db61"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=86d12ded-bb2c-45a1-b7b3-d819a7a77c08"], "isController": false}, {"data": [0.3125, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6e1c05ac-204f-4dce-b8cc-2536bd72d8f5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b0b80dba-fc3c-4ac6-85c7-3dc304d3cd26"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3125, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c0d59169-5685-421a-b9eb-376145fa763e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5357142857142857, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.30434782608695654, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3898305084745763, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a56f1de5-6349-48cb-aaf2-4a9c6bd2f68b"], "isController": false}, {"data": [0.8362068965517241, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/eae76f1c-d760-4d34-ba25-da2e8fe7e0ad"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9289772727272727, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=12e2cabf-7838-4b3c-88e9-d73a90125fc4"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ffd275ad-722f-46ea-a778-139f8f9f1e0a"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/69157bec-6f6c-42d2-ab14-db2cad2e0d83"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fdfa957e-6da9-4b4d-80a5-e572b8ee6baf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e38bbc33-2a8a-4035-be3e-d798e59fae11"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f912c124-6aea-479e-83b4-a496c09e5bbb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b0b80dba-fc3c-4ac6-85c7-3dc304d3cd26"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/86d12ded-bb2c-45a1-b7b3-d819a7a77c08"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5fffe541-e1e9-4972-9fbc-25354938db61"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1344, 25, 1.8601190476190477, 307.8764880952378, 77, 2552, 96.5, 869.5, 1081.25, 1558.6499999999962, 5.20538819647242, 726.207638744994, 3.805565655088809], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 1347.0862068965516, 978, 1832, 1308.5, 1658.6, 1732.8999999999999, 1832.0, 0.2587552977916574, 311.3697971851996, 1.2722977777158153], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a597e044-7f52-4619-9c1b-0a64a3e5cfe8", 3, 0, 0.0, 247.66666666666666, 187, 369, 187.0, 369.0, 369.0, 369.0, 0.056913036879647896, 0.03658959890537259, 0.03649696700940962], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e38bbc33-2a8a-4035-be3e-d798e59fae11", 3, 0, 0.0, 363.6666666666667, 187, 504, 400.0, 504.0, 504.0, 504.0, 0.04215555399423874, 0.027101959355020022, 0.02703334679969086], "isController": false}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 447.5333333333333, 85, 675, 476.0, 629.4, 675.0, 675.0, 0.08795023189544476, 0.017229313006080296, 0.059217532438977205], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 447.5333333333333, 85, 675, 476.0, 629.4, 675.0, 675.0, 0.08713837574067619, 0.017070271653886374, 0.05867090377018706], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 125.64285714285714, 79, 241, 82.0, 238.5, 241.0, 241.0, 0.13307478803087336, 0.07843763663929129, 0.0734993144272081], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 107.00000000000001, 80, 245, 83.0, 245.0, 245.0, 245.0, 0.13307478803087336, 0.09889640008935022, 0.06679730571080948], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 221.92857142857142, 79, 634, 84.0, 627.5, 634.0, 634.0, 0.13288027487234003, 8.400543415070521, 0.07580181974790713], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 269.2142857142857, 80, 883, 82.0, 877.5, 883.0, 883.0, 0.13307605296426908, 25.687196345992984, 0.07578354467077934], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4399ebec-72e9-441f-887f-ded3ca5bf148", 1, 0, 0.0, 330.0, 330, 330, 330.0, 330.0, 330.0, 330.0, 3.0303030303030303, 0.9676846590909091, 1.8081202651515151], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 190.33333333333334, 79, 401, 187.0, 291.20000000000005, 401.0, 401.0, 0.08881415342348957, 0.18392509155258982, 0.05740539812424508], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 81.31578947368419, 79, 86, 81.0, 84.0, 86.0, 86.0, 0.10569354434956749, 0.0785476437988485, 0.0530532048785915], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 122.57894736842105, 77, 247, 81.0, 241.0, 247.0, 247.0, 0.1056964842011571, 0.02828206706163774, 0.06028002614597241], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 577.6666666666666, 461, 640, 624.0, 640.0, 640.0, 640.0, 0.048455872851789636, 14.247635504829436, 0.027634989985786278], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 893.8333333333333, 797, 1082, 873.5, 1082.0, 1082.0, 1082.0, 0.04835940711366879, 43.51387952764949, 0.027532748386004786], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 159.16666666666666, 79, 243, 157.5, 243.0, 243.0, 243.0, 0.04867166903265058, 0.08612603934293246, 0.02695003548975867], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 92.06250000000001, 79, 243, 81.0, 135.9000000000001, 243.0, 243.0, 0.09342029205518804, 0.06942660376367002, 0.04689260753551431], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 120.00000000000001, 78, 242, 81.0, 239.2, 242.0, 242.0, 0.09342029205518804, 0.033766782809498505, 0.05278839501018865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 168.4375, 79, 853, 81.5, 426.00000000000045, 853.0, 853.0, 0.09342138298679839, 5.277401522549586, 0.05441978022619653], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=557304d2-ba8b-41d0-8457-605b38e56a85", 1, 0, 0.0, 1162.0, 1162, 1162, 1162.0, 1162.0, 1162.0, 1162.0, 0.8605851979345955, 0.15547681798623064, 0.5933331540447505], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 139.3125, 78, 610, 81.0, 413.3000000000002, 610.0, 610.0, 0.09342083751780834, 1.740407851291543, 0.05451069376649462], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 107.16666666666667, 79, 242, 81.0, 242.0, 242.0, 242.0, 0.048672458689250686, 0.036171622131366966, 0.02733072631476479], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 623.6874999999999, 81, 1230, 823.0, 1085.8000000000002, 1230.0, 1230.0, 0.0821051767313929, 46.18228768435178, 0.04385891764850774], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 89.89473684210526, 77, 236, 81.0, 97.0, 236.0, 236.0, 0.10569530824089629, 0.02848818854930408, 0.06213728082130818], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 456.12500000000006, 80, 806, 622.5, 737.4000000000001, 806.0, 806.0, 0.0821051767313929, 15.096828783765753, 0.043939098485159485], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 90.21052631578948, 78, 238, 80.0, 98.0, 238.0, 238.0, 0.10569178051711095, 0.02848723771750256, 0.06223842153497842], "isController": false}, {"data": ["deleteBooks", 15, 2, 13.333333333333334, 560.1333333333332, 82, 1877, 436.0, 1448.0000000000002, 1877.0, 1877.0, 0.08713989438644801, 0.017070569154220186, 0.05925058964661868], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ffd275ad-722f-46ea-a778-139f8f9f1e0a", 1, 0, 0.0, 372.0, 372, 372, 372.0, 372.0, 372.0, 372.0, 2.688172043010753, 0.4856560819892473, 1.8533686155913978], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a56f1de5-6349-48cb-aaf2-4a9c6bd2f68b", 3, 0, 0.0, 322.0, 188, 468, 310.0, 468.0, 468.0, 468.0, 0.04329004329004329, 0.02783132665945166, 0.027760867604617604], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/557304d2-ba8b-41d0-8457-605b38e56a85", 3, 0, 0.0, 393.0, 217, 677, 285.0, 677.0, 677.0, 677.0, 0.02810383429979297, 0.028369137423065755, 0.01802231561542713], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 296.8125, 161, 934, 241.5, 620.4000000000003, 934.0, 934.0, 0.09337558578590145, 7.117523250885609, 0.20851069223406926], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eae76f1c-d760-4d34-ba25-da2e8fe7e0ad", 1, 0, 0.0, 436.0, 436, 436, 436.0, 436.0, 436.0, 436.0, 2.293577981651376, 0.4143671158256881, 1.581314506880734], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fdfa957e-6da9-4b4d-80a5-e572b8ee6baf", 3, 0, 0.0, 563.0, 218, 1201, 270.0, 1201.0, 1201.0, 1201.0, 0.0216926013767571, 0.025639920442384452, 0.013910945544339678], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 707.6521739130434, 229, 1511, 582.0, 1317.2, 1473.5999999999995, 1511.0, 0.0978540188220078, 0.060107595545940334, 0.04424454171346641], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 92.625, 79, 239, 81.5, 141.7000000000001, 239.0, 239.0, 0.08210433408253538, 0.061016990465634205, 0.041212527068772646], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 134.875, 78, 316, 81.5, 265.6, 316.0, 316.0, 0.08210475540480211, 0.09904287022830253, 0.04251567046230109], "isController": false}, {"data": ["login", 23, 0, 0.0, 2765.434782608696, 1805, 4320, 2579.0, 4178.2, 4299.4, 4320.0, 0.0959280622948495, 30.06947224967989, 0.18623126665707385], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 93.63157894736842, 80, 241, 84.0, 96.0, 241.0, 241.0, 0.10279938969625485, 0.08322333404120633, 0.0365419705560906], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=69157bec-6f6c-42d2-ab14-db2cad2e0d83", 1, 0, 0.0, 376.0, 376, 376, 376.0, 376.0, 376.0, 376.0, 2.6595744680851063, 0.4804895279255319, 1.8336519281914894], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/12e2cabf-7838-4b3c-88e9-d73a90125fc4", 3, 0, 0.0, 1130.6666666666667, 179, 2134, 1079.0, 2134.0, 2134.0, 2134.0, 0.01829513715254485, 0.021624232747685664, 0.011732233134932735], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c0d59169-5685-421a-b9eb-376145fa763e", 1, 0, 0.0, 383.0, 383, 383, 383.0, 383.0, 383.0, 383.0, 2.6109660574412534, 0.4717077349869452, 1.8001387075718016], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8db94d54-65a8-4f3f-81b6-4ff849c52220", 1, 0, 0.0, 280.0, 280, 280, 280.0, 280.0, 280.0, 280.0, 3.571428571428571, 1.1404854910714284, 2.130998883928571], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a597e044-7f52-4619-9c1b-0a64a3e5cfe8", 1, 0, 0.0, 594.0, 594, 594, 594.0, 594.0, 594.0, 594.0, 1.6835016835016834, 0.3041482533670034, 1.1606954966329968], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 717.4374999999998, 161, 1316, 907.0, 1167.6000000000001, 1316.0, 1316.0, 0.08206895844233117, 61.41207537328553, 0.1714511907692939], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5fffe541-e1e9-4972-9fbc-25354938db61", 1, 0, 0.0, 580.0, 580, 580, 580.0, 580.0, 580.0, 580.0, 1.7241379310344827, 0.31148976293103453, 1.1887122844827587], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 422.0, 163, 1118, 320.0, 1041.5, 1118.0, 1118.0, 0.13277693474962066, 34.20040611070277, 0.2913386760242792], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, 40.0, 632.3, 78, 1161, 945.5, 1148.8, 1161.0, 1161.0, 0.08054772452678212, 57.82646999597261, 0.130323701167942], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=86d12ded-bb2c-45a1-b7b3-d819a7a77c08", 1, 0, 0.0, 472.0, 472, 472, 472.0, 472.0, 472.0, 472.0, 2.1186440677966103, 0.38276284427966106, 1.4607057733050848], "isController": false}, {"data": ["register", 24, 7, 29.166666666666668, 1027.5416666666665, 324, 1921, 985.5, 1572.0, 1866.5, 1921.0, 0.10107731572341877, 0.03173472363777259, 0.04560324205490183], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6e1c05ac-204f-4dce-b8cc-2536bd72d8f5", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 1.2621973814229248, 2.3584177371541504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 206.63157894736844, 160, 331, 164.0, 324.0, 331.0, 331.0, 0.10564182971649069, 0.16372420289069406, 0.23759095101277153], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 100.13333333333334, 83, 248, 85.0, 171.20000000000005, 248.0, 248.0, 0.0993904055128545, 0.07716344959249935, 0.035330183209647495], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b0b80dba-fc3c-4ac6-85c7-3dc304d3cd26", 2, 0, 0.0, 383.5, 366, 401, 383.5, 401.0, 401.0, 401.0, 0.019501540621709113, 0.03298502769218768, 0.01212180723214634], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 20, 0, 0.0, 245.25000000000003, 160, 479, 165.5, 466.2000000000003, 478.95, 479.0, 0.1001662760181902, 0.15523816410241, 0.22527630241200391], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 98.6, 80, 243, 82.0, 227.50000000000006, 243.0, 243.0, 0.046349297576395235, 0.03444513228089528, 0.023265174760026514], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 80.89999999999999, 78, 84, 81.0, 83.8, 84.0, 84.0, 0.046349512403129525, 0.01240211562349364, 0.026433706292409802], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 112.2, 78, 239, 82.0, 238.2, 239.0, 239.0, 0.046349727231855244, 0.012492699917960983, 0.027248570110914895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 142.4, 80, 237, 82.0, 236.9, 237.0, 237.0, 0.04634994206257242, 0.012492757821552724, 0.02729396002317497], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 84.0, 82, 86, 84.0, 86.0, 86.0, 86.0, 0.021575904030378873, 0.0063632060714593945, 0.013337448487529128], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 932.1551724137928, 621, 1486, 869.0, 1290.1, 1331.1999999999996, 1486.0, 0.2600034069411944, 311.0544665111129, 0.5134051648780225], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, 29.166666666666668, 1027.5416666666665, 324, 1921, 985.5, 1572.0, 1866.5, 1921.0, 0.09652859056191705, 0.030306583853180014, 0.04355098519492742], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 80.14285714285714, 78, 82, 81.0, 82.0, 82.0, 82.0, 0.03240770747877295, 0.008734889906388023, 0.019083835556347746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 80.71428571428571, 79, 83, 80.0, 83.0, 83.0, 83.0, 0.03240770747877295, 0.008734889906388023, 0.019052187404513005], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c0d59169-5685-421a-b9eb-376145fa763e", 3, 0, 0.0, 379.33333333333337, 213, 668, 257.0, 668.0, 668.0, 668.0, 0.026313481273572494, 0.026390571550741163, 0.016874205113586525], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 102.46666666666667, 79, 241, 82.0, 237.4, 241.0, 241.0, 0.09838194494546361, 0.026517008598581988, 0.05783782310270419], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 91.93333333333332, 77, 240, 81.0, 148.20000000000005, 240.0, 240.0, 0.09838259021683522, 0.026517182519381368, 0.057934279199952775], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 81.14285714285715, 78, 84, 81.0, 84.0, 84.0, 84.0, 0.032407407407407406, 0.008671513310185185, 0.01848234953703704], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 82.86666666666666, 78, 88, 83.0, 88.0, 88.0, 88.0, 0.0983800091821342, 0.07311248729258214, 0.049382153046500954], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 91.57142857142857, 80, 148, 83.0, 148.0, 148.0, 148.0, 0.03240695731077809, 0.024083686048341924, 0.01626677349388666], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 91.53333333333335, 78, 236, 81.0, 144.80000000000007, 236.0, 236.0, 0.09838194494546361, 0.02632485636236038, 0.05610845297670971], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 135.57142857142858, 84, 237, 97.0, 237.0, 237.0, 237.0, 0.031516199326453796, 0.02480669595422047, 0.011203023979325374], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 682.8571428571428, 78, 2134, 486.0, 1865.0, 2134.0, 2134.0, 0.09398748623754666, 0.018147137409704882, 0.06396079211310723], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1521.1304347826087, 988, 2552, 1441.0, 2452.8, 2536.7999999999997, 2552.0, 0.09654819224004399, 0.04997123231174152, 0.044408397016660855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 174.14285714285714, 163, 233, 165.0, 233.0, 233.0, 233.0, 0.03239480942596398, 0.050205627499028155, 0.07285668565233891], "isController": false}, {"data": ["addBook", 59, 10, 16.949152542372882, 872.864406779661, 416, 2210, 688.0, 1459.0, 2089.0, 2210.0, 0.291201279311383, 83.79411764932702, 1.060058258764418], "isController": true}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 141.49999999999994, 79, 337, 82.5, 322.0, 330.05, 337.0, 0.2609215930612851, 0.19390755109339644, 0.12612909039583606], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a56f1de5-6349-48cb-aaf2-4a9c6bd2f68b", 1, 0, 0.0, 373.0, 373, 373, 373.0, 373.0, 373.0, 373.0, 2.680965147453083, 0.4843540549597855, 1.848399798927614], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 497.0344827586207, 385, 707, 468.0, 635.3, 671.8, 707.0, 0.26079488482308666, 76.68235534314762, 0.13116148992567347], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 121.6551724137931, 77, 362, 84.0, 239.1, 250.19999999999976, 362.0, 0.2612542003369278, 0.46229747168995433, 0.12705526539823248], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eae76f1c-d760-4d34-ba25-da2e8fe7e0ad", 3, 0, 0.0, 284.3333333333333, 195, 391, 267.0, 391.0, 391.0, 391.0, 0.04346251358203549, 0.027942208438971383, 0.027871468670771456], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 789.0517241379309, 540, 1163, 772.5, 1019.5, 1107.5, 1163.0, 0.26044590134488876, 234.34967984519187, 0.1307316340735086], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 20, 0, 0.0, 86.5, 82, 110, 84.0, 98.20000000000002, 109.44999999999999, 110.0, 0.09935222350276199, 0.07422309665977825, 0.03531661069824742], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 10, 5.681818181818182, 152.0965909090909, 80, 1316, 87.0, 283.50000000000006, 360.35, 1129.6599999999976, 0.7727703818188205, 1.6774816672850292, 0.370104289698883], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 104.2, 81, 236, 88.0, 223.50000000000006, 236.0, 236.0, 0.046147598478975156, 0.035737349212721974, 0.0164040291468232], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 87.07142857142858, 81, 117, 85.0, 103.5, 117.0, 117.0, 0.1278118609406953, 0.10372232074386503, 0.04543312244376278], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=12e2cabf-7838-4b3c-88e9-d73a90125fc4", 1, 0, 0.0, 1877.0, 1877, 1877, 1877.0, 1877.0, 1877.0, 1877.0, 0.5327650506126798, 0.09625149840170485, 0.3673165290356953], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ffd275ad-722f-46ea-a778-139f8f9f1e0a", 3, 0, 0.0, 501.3333333333333, 167, 938, 399.0, 938.0, 938.0, 938.0, 0.03852525330354047, 0.032116918525510144, 0.024705321942700108], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/69157bec-6f6c-42d2-ab14-db2cad2e0d83", 3, 0, 0.0, 690.6666666666667, 193, 1596, 283.0, 1596.0, 1596.0, 1596.0, 0.01942740948446131, 0.022962540311874682, 0.012458332254032808], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 243.1, 162, 480, 170.0, 464.4000000000001, 480.0, 480.0, 0.04633147389684761, 0.0718047354241183, 0.10420057068792972], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fdfa957e-6da9-4b4d-80a5-e572b8ee6baf", 1, 0, 0.0, 702.0, 702, 702, 702.0, 702.0, 702.0, 702.0, 1.4245014245014245, 0.2573562143874644, 0.9821269586894588], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 197.0, 161, 324, 166.0, 321.0, 324.0, 324.0, 0.09832777235154146, 0.15238884250185186, 0.22114146457578124], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e38bbc33-2a8a-4035-be3e-d798e59fae11", 1, 0, 0.0, 434.0, 434, 434, 434.0, 434.0, 434.0, 434.0, 2.304147465437788, 0.4162766417050691, 1.5886016705069124], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 86.93750000000001, 80, 116, 84.5, 99.20000000000002, 116.0, 116.0, 0.09346995525125892, 0.07749608594562385, 0.03322564815572095], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 100.75, 79, 236, 87.0, 173.70000000000007, 236.0, 236.0, 0.08404067568703252, 0.06524642301874108, 0.029873833935624844], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f912c124-6aea-479e-83b4-a496c09e5bbb", 1, 0, 0.0, 311.0, 311, 311, 311.0, 311.0, 311.0, 311.0, 3.215434083601286, 1.02680365755627, 1.9185842041800643], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b0b80dba-fc3c-4ac6-85c7-3dc304d3cd26", 1, 0, 0.0, 473.0, 473, 473, 473.0, 473.0, 473.0, 473.0, 2.1141649048625792, 0.3819536205073996, 1.457617600422833], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/86d12ded-bb2c-45a1-b7b3-d819a7a77c08", 3, 0, 0.0, 341.3333333333333, 175, 581, 268.0, 581.0, 581.0, 581.0, 0.021333485038115826, 0.02940993135951189, 0.013680652840197975], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5fffe541-e1e9-4972-9fbc-25354938db61", 3, 0, 0.0, 281.0, 177, 415, 251.0, 415.0, 415.0, 415.0, 0.03732132416058122, 0.030335724749014095, 0.023933271027456054], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 20, 0, 0.0, 98.3, 79, 241, 82.0, 222.20000000000033, 240.8, 241.0, 0.10028631743628058, 0.07452918707911087, 0.05033903043188302], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 20, 0, 0.0, 137.35, 78, 275, 81.0, 241.9, 273.34999999999997, 275.0, 0.10020742937881415, 0.026813316064253002, 0.057149549567604936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 20, 0, 0.0, 104.20000000000002, 78, 241, 80.5, 239.5, 240.95, 241.0, 0.10028682030607539, 0.02703043203562188, 0.05895768146900134], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 20, 0, 0.0, 120.45000000000002, 78, 243, 81.0, 239.8, 242.85, 243.0, 0.10020742937881415, 0.0270090336997585, 0.05900886710490715], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 28.0, 0.5208333333333334], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 8.0, 0.1488095238095238], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 8.0, 0.1488095238095238], "isController": false}, {"data": ["401/Unauthorized", 14, 56.0, 1.0416666666666667], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1344, 25, "401/Unauthorized", 14, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
