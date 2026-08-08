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

    var data = {"OkPercent": 97.78794813119755, "KoPercent": 2.212051868802441};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.749835418038183, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.044642857142857144, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.3125, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.5384615384615384, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5384615384615384, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6535d26d-9b1a-4c05-a396-cd06eca10d37"], "isController": false}, {"data": [0.09523809523809523, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b0e90572-dc34-4491-8ac4-5cd61b8ec54d"], "isController": false}, {"data": [0.19047619047619047, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=135ed7de-b59f-4ec1-9f95-7ace9e76f67f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.2796610169491525, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ab0e5696-03ae-4c93-877f-4780bb030756"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ecc10ee4-9053-474c-9a6c-01b5d1bc5448"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/135ed7de-b59f-4ec1-9f95-7ace9e76f67f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ab0e5696-03ae-4c93-877f-4780bb030756"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a55bafd0-6e45-46ac-9b97-926e10d6f75c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.78, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.49107142857142855, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.82, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bde40b87-8593-4648-9934-f85db0941fc6"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9051724137931034, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a55bafd0-6e45-46ac-9b97-926e10d6f75c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bde40b87-8593-4648-9934-f85db0941fc6"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/087b064f-47f4-410d-b954-5075a82d7273"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [0.98, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ecc10ee4-9053-474c-9a6c-01b5d1bc5448"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=087b064f-47f4-410d-b954-5075a82d7273"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/8196396a-c1d3-4d9c-a913-12f4edcad012"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/6e7c9647-42cc-4cdf-8aac-796412feae14"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6535d26d-9b1a-4c05-a396-cd06eca10d37"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b0e90572-dc34-4491-8ac4-5cd61b8ec54d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/aaa917d3-e70a-4f6b-b878-d34573363ca0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6e7c9647-42cc-4cdf-8aac-796412feae14"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.125, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7163cdcf-0dba-4bff-8960-5062dfd52f2c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2807f009-5d1e-423a-9625-6cce38a635e4"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2807f009-5d1e-423a-9625-6cce38a635e4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7163cdcf-0dba-4bff-8960-5062dfd52f2c"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.09523809523809523, 500, 1500, "register"], "isController": true}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1311, 29, 2.212051868802441, 434.0495804729209, 113, 4299, 133.0, 1175.3999999999999, 1472.799999999999, 2199.3199999999924, 5.144525455786904, 726.3012698953044, 3.7779955529874347], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1963.0892857142856, 1429, 2995, 1971.5, 2293.4000000000005, 2381.25, 2995.0, 0.2539037704709915, 305.5311287510315, 1.2484428557826583], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 131.35294117647058, 120, 174, 128.0, 151.59999999999997, 174.0, 174.0, 0.08057444842050383, 0.06255535790459037, 0.028641698461975968], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 13, 0, 0.0, 375.84615384615387, 238, 1536, 241.0, 1111.9999999999995, 1536.0, 1536.0, 0.08025880377339853, 7.50077364856522, 0.17892431787733987], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 428.93333333333334, 237, 1189, 472.0, 896.8000000000002, 1189.0, 1189.0, 0.10364914074862319, 8.416620636371174, 0.23134137319564121], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 168.0, 115, 361, 121.0, 360.7, 361.0, 361.0, 0.04719474439326436, 0.035073437971947445, 0.023689549431775276], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 142.40000000000003, 116, 352, 119.5, 329.1000000000001, 352.0, 352.0, 0.04719474439326436, 0.012628281214603942, 0.026915752661783584], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 140.9, 113, 349, 118.0, 326.1000000000001, 349.0, 349.0, 0.047195189866248835, 0.012720578518637381, 0.027745609667462694], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 163.60000000000002, 116, 352, 118.5, 350.7, 352.0, 352.0, 0.047195189866248835, 0.012720578518637381, 0.02779169872006645], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 125.5, 124, 127, 125.5, 127.0, 127.0, 127.0, 0.05605695386512697, 0.016532421940691745, 0.034652394332641966], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1353.8392857142856, 933, 2493, 1288.0, 1794.9000000000003, 1878.95, 2493.0, 0.24828417897742386, 297.0341956035966, 0.4902642674729991], "isController": false}, {"data": ["deleteBook", 13, 2, 15.384615384615385, 764.923076923077, 123, 2995, 534.0, 2215.7999999999993, 2995.0, 2995.0, 0.07108447569731136, 0.014091941959525593, 0.04779192138603792], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, 15.384615384615385, 764.923076923077, 123, 2995, 534.0, 2215.7999999999993, 2995.0, 2995.0, 0.07142700160436034, 0.014159845044614405, 0.0480222103635085], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6535d26d-9b1a-4c05-a396-cd06eca10d37", 1, 0, 0.0, 501.0, 501, 501, 501.0, 501.0, 501.0, 501.0, 1.996007984031936, 0.3606069111776447, 1.3761539421157685], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 8, 38.095238095238095, 1490.9047619047622, 251, 3343, 1477.0, 2323.0, 3243.8999999999987, 3343.0, 0.08884639304798128, 0.027615759446275433, 0.04008499373844468], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 21, 0, 0.0, 151.38095238095238, 116, 358, 118.0, 350.4, 357.3, 358.0, 0.14791753245381098, 0.05015879123201217, 0.08376765765543667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 3, 0, 0.0, 118.0, 117, 120, 117.0, 120.0, 120.0, 120.0, 0.02886474940586724, 0.007779951988300155, 0.016997503800525338], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 21, 0, 0.0, 120.80952380952381, 117, 138, 120.0, 123.8, 136.59999999999997, 138.0, 0.1479144068632285, 0.10992467150675476, 0.07424609875751899], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 3, 0, 0.0, 197.0, 117, 355, 119.0, 355.0, 355.0, 355.0, 0.028798801969838056, 0.007762177093432913, 0.016930545689299324], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 21, 0, 0.0, 201.38095238095235, 115, 942, 118.0, 353.6, 883.1999999999991, 942.0, 0.14791649057560644, 2.109034373855408, 0.086497854770659], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 21, 0, 0.0, 208.85714285714286, 116, 1303, 119.0, 350.8, 1207.7999999999986, 1303.0, 0.14791544871207907, 6.375806546403188, 0.08635279683460939], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 228.82352941176467, 116, 1018, 121.0, 491.59999999999957, 1018.0, 1018.0, 0.07785166053012402, 4.140399781156693, 0.04537470977358905], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 236.94117647058823, 115, 712, 122.0, 428.7999999999997, 712.0, 712.0, 0.07785094749182565, 1.366264451082128, 0.04545032050548162], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 120.94117647058823, 117, 131, 120.0, 128.6, 131.0, 131.0, 0.07785094749182565, 0.05785602640749933, 0.0390775263777328], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 3, 0, 0.0, 117.0, 114, 119, 118.0, 119.0, 119.0, 119.0, 0.02886558260367555, 0.0077237984701241215, 0.016462402578658712], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 173.05882352941177, 114, 357, 119.0, 353.0, 357.0, 357.0, 0.07785059097757445, 0.027709229187560393, 0.044014563212390154], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 3, 0, 0.0, 120.33333333333333, 118, 122, 121.0, 122.0, 122.0, 122.0, 0.02886419396738346, 0.021450831649588685, 0.014488472362534276], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 3, 0, 0.0, 127.0, 122, 131, 128.0, 131.0, 131.0, 131.0, 0.028770079117717572, 0.02264519899304723, 0.010226864061376168], "isController": false}, {"data": ["deleteAccount", 12, 2, 16.666666666666668, 514.0000000000001, 118, 947, 529.5, 881.9000000000002, 947.0, 947.0, 0.06806541085983629, 0.013282947203929644, 0.04631860071695566], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/b0e90572-dc34-4491-8ac4-5cd61b8ec54d", 3, 0, 0.0, 425.3333333333333, 230, 604, 442.0, 604.0, 604.0, 604.0, 0.04681209624566988, 0.030095667345442063, 0.03001947578254221], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1955.9999999999998, 1059, 3917, 1732.0, 3554.4000000000005, 3895.2999999999997, 3917.0, 0.08945496368554451, 0.046299932376307217, 0.04114578896083151], "isController": false}, {"data": ["goToProfile", 13, 2, 15.384615384615385, 675.9230769230769, 118, 3443, 362.0, 2642.999999999999, 3443.0, 3443.0, 0.07103087657565609, 0.14867821100541473, 0.04590968014249887], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 3, 0, 0.0, 318.6666666666667, 237, 477, 242.0, 477.0, 477.0, 477.0, 0.028765941125707163, 0.04458159039696998, 0.06469527579346054], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=135ed7de-b59f-4ec1-9f95-7ace9e76f67f", 1, 0, 0.0, 534.0, 534, 534, 534.0, 534.0, 534.0, 534.0, 1.8726591760299625, 0.33832221441947563, 1.2911107209737827], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 13, 0, 0.0, 119.23076923076923, 117, 122, 119.0, 121.6, 122.0, 122.0, 0.08031781140142225, 0.05968931101218977, 0.040315776426104524], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 866.2499999999999, 689, 1093, 926.5, 1093.0, 1093.0, 1093.0, 0.04322034813990427, 12.708217403753686, 0.02464910479853915], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 13, 0, 0.0, 136.92307692307693, 116, 350, 119.0, 258.79999999999995, 350.0, 350.0, 0.08031880386765933, 0.030771176361558187, 0.0452879313274227], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 1302.625, 1042, 1452, 1390.5, 1452.0, 1452.0, 1452.0, 0.04313668397526112, 38.81446406714225, 0.02455926441169651], "isController": false}, {"data": ["addBook", 59, 13, 22.033898305084747, 1225.457627118644, 614, 6225, 971.0, 1993.0, 2443.0, 6225.0, 0.27216281794613945, 72.80470252805814, 0.9914464041064295], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 174.375, 115, 350, 118.5, 350.0, 350.0, 350.0, 0.04344968797692822, 0.07688558067792375, 0.0240585674637874], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ab0e5696-03ae-4c93-877f-4780bb030756", 3, 0, 0.0, 727.6666666666666, 232, 1443, 508.0, 1443.0, 1443.0, 1443.0, 0.01640832667884529, 0.02262020295732741, 0.01052226678298347], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 142.0909090909091, 118, 352, 121.0, 307.40000000000015, 352.0, 352.0, 0.07373692007588199, 0.05479862907983027, 0.0370124774599642], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 140.36363636363637, 114, 359, 119.0, 311.4000000000002, 359.0, 359.0, 0.073619467664322, 0.01969895912111741, 0.04198610265230864], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 245.0909090909091, 116, 360, 341.0, 359.2, 360.0, 360.0, 0.07362488788937527, 0.019844208063933173, 0.04328338135683975], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ecc10ee4-9053-474c-9a6c-01b5d1bc5448", 1, 0, 0.0, 1134.0, 1134, 1134, 1134.0, 1134.0, 1134.0, 1134.0, 0.8818342151675485, 0.15931575176366844, 0.6079833553791888], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 224.0714285714286, 116, 489, 122.0, 470.3, 474.2, 489.0, 0.2498315867428653, 0.1856658569446489, 0.12076819866964679], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/135ed7de-b59f-4ec1-9f95-7ace9e76f67f", 3, 0, 0.0, 1436.0, 230, 3527, 551.0, 3527.0, 3527.0, 3527.0, 0.029485188606923122, 0.029571570995419967, 0.018908145037642758], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 225.0, 117, 362, 121.0, 360.4, 362.0, 362.0, 0.07373889726830903, 0.019874937154348918, 0.04342241704374057], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ab0e5696-03ae-4c93-877f-4780bb030756", 1, 0, 0.0, 513.0, 513, 513, 513.0, 513.0, 513.0, 513.0, 1.949317738791423, 0.35217166179337234, 1.3439632066276803], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a55bafd0-6e45-46ac-9b97-926e10d6f75c", 1, 0, 0.0, 815.0, 815, 815, 815.0, 815.0, 815.0, 815.0, 1.2269938650306749, 0.22167369631901843, 0.845954754601227], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 777.4285714285716, 566, 1173, 709.5, 954.4000000000001, 1062.0, 1173.0, 0.24937655860349126, 73.32498831047381, 0.1254188746882793], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 177.375, 116, 360, 119.5, 360.0, 360.0, 360.0, 0.04344850808685357, 0.0322893697793902, 0.02439735561517656], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 159.9821428571429, 114, 373, 121.0, 354.3, 367.45, 373.0, 0.25027709249526264, 0.44287313632950764, 0.12171678912367263], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 25, 0, 0.0, 571.96, 115, 1518, 120.0, 1452.2000000000003, 1514.1, 1518.0, 0.12020848960436982, 38.95970765445589, 0.06695049393668379], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 13, 0, 0.0, 236.3846153846154, 116, 1413, 118.0, 990.9999999999997, 1413.0, 1413.0, 0.08031930010997566, 5.579325397039924, 0.04668800662943146], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1126.6607142857144, 807, 1976, 1153.5, 1398.9, 1435.3, 1976.0, 0.24885460225480047, 223.91980854859997, 0.12491334527242913], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 25, 0, 0.0, 419.00000000000006, 116, 1041, 123.0, 956.0, 1016.4, 1041.0, 0.12020848960436982, 12.745039371285557, 0.06706788503981305], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 142.79999999999998, 120, 367, 128.0, 227.80000000000007, 367.0, 367.0, 0.09830199684122917, 0.07343850349955108, 0.034943287939655676], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 13, 0, 0.0, 181.3846153846154, 116, 928, 119.0, 605.9999999999998, 928.0, 928.0, 0.08031880386765933, 1.8366289464335364, 0.04676615450557598], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bde40b87-8593-4648-9934-f85db0941fc6", 1, 0, 0.0, 513.0, 513, 513, 513.0, 513.0, 513.0, 513.0, 1.949317738791423, 0.35217166179337234, 1.3439632066276803], "isController": false}, {"data": ["deleteBooks", 13, 2, 15.384615384615385, 534.2307692307693, 124, 1134, 513.0, 1006.3999999999999, 1134.0, 1134.0, 0.07142150776296849, 0.014158755933479107, 0.0484584628992737], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 13, 7.471264367816092, 211.88505747126436, 116, 4299, 127.0, 358.5, 466.0, 1743.75, 0.7182543941482906, 1.5388758415753714, 0.3447238938779133], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 126.29999999999998, 122, 138, 125.0, 137.1, 138.0, 138.0, 0.04666399126450084, 0.0361372510476066, 0.01658759064480303], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a55bafd0-6e45-46ac-9b97-926e10d6f75c", 3, 0, 0.0, 506.6666666666667, 259, 676, 585.0, 676.0, 676.0, 676.0, 0.017856186275735226, 0.0246161942961389, 0.011450744454166146], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bde40b87-8593-4648-9934-f85db0941fc6", 2, 0, 0.0, 314.0, 244, 384, 314.0, 384.0, 384.0, 384.0, 0.012482602372942712, 0.024684833794149402, 0.0077589613382597995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 411.27272727272725, 239, 711, 473.0, 665.6000000000001, 711.0, 711.0, 0.07355989781861466, 0.11400347445131002, 0.1654379342541695], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 21, 0, 0.0, 147.80952380952382, 119, 356, 122.0, 310.0000000000001, 355.4, 356.0, 0.142397016443465, 0.11555851627394474, 0.05061768943888795], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/087b064f-47f4-410d-b954-5075a82d7273", 3, 0, 0.0, 630.3333333333334, 242, 919, 730.0, 919.0, 919.0, 919.0, 0.04654771140418929, 0.030471174359968968, 0.029849932117920867], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 737.2857142857142, 237, 1610, 778.0, 1217.8000000000002, 1575.2999999999995, 1610.0, 0.09033967718622019, 0.05549185249036377, 0.04084694388400386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 25, 0, 0.0, 154.47999999999996, 115, 521, 120.0, 350.40000000000003, 470.89999999999986, 521.0, 0.12020733360900883, 0.08933377038716378, 0.060338446752959504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 25, 0, 0.0, 193.0, 115, 359, 119.0, 355.4, 358.1, 359.0, 0.12020617763588107, 0.09716039951725199, 0.06492072703100357], "isController": false}, {"data": ["login", 21, 0, 0.0, 3686.380952380952, 1731, 6070, 3413.0, 5651.8, 6033.4, 6070.0, 0.08770134767737597, 40.08662041551646, 0.1877234622508342], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 335.1, 233, 711, 243.5, 710.9, 711.0, 711.0, 0.0471680313950417, 0.07310123615618279, 0.10608200810818459], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ecc10ee4-9053-474c-9a6c-01b5d1bc5448", 3, 0, 0.0, 497.66666666666663, 232, 947, 314.0, 947.0, 947.0, 947.0, 0.05215214519157221, 0.03352880428169112, 0.03344392123287671], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 13, 0, 0.0, 126.0769230769231, 122, 143, 125.0, 137.4, 143.0, 143.0, 0.07928424622027602, 0.0641861719888758, 0.028183071898613743], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=087b064f-47f4-410d-b954-5075a82d7273", 1, 0, 0.0, 534.0, 534, 534, 534.0, 534.0, 534.0, 534.0, 1.8726591760299625, 0.33832221441947563, 1.2911107209737827], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 405.3529411764706, 235, 1139, 464.0, 613.3999999999995, 1139.0, 1139.0, 0.07780676461165272, 5.589017947045631, 0.1738182024921049], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8196396a-c1d3-4d9c-a913-12f4edcad012", 1, 0, 0.0, 1055.0, 1055, 1055, 1055.0, 1055.0, 1055.0, 1055.0, 0.9478672985781991, 0.3026880924170616, 0.5655731635071091], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6e7c9647-42cc-4cdf-8aac-796412feae14", 3, 0, 0.0, 1416.3333333333333, 223, 3443, 583.0, 3443.0, 3443.0, 3443.0, 0.02383638703936182, 0.0239062202045162, 0.015285703928236584], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6535d26d-9b1a-4c05-a396-cd06eca10d37", 3, 0, 0.0, 358.6666666666667, 257, 442, 377.0, 442.0, 442.0, 442.0, 0.020541895195250712, 0.024400187359202425, 0.013173025239141895], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 124.27272727272727, 117, 133, 124.0, 132.0, 133.0, 133.0, 0.07392224723631599, 0.061289050687140884, 0.026277048822284196], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 25, 0, 0.0, 747.7199999999999, 237, 1641, 478.0, 1571.8000000000002, 1635.9, 1641.0, 0.12013916921361706, 51.8613199029756, 0.25912986353391765], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b0e90572-dc34-4491-8ac4-5cd61b8ec54d", 1, 0, 0.0, 433.0, 433, 433, 433.0, 433.0, 433.0, 433.0, 2.3094688221709005, 0.417238019630485, 1.5922704965357968], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aaa917d3-e70a-4f6b-b878-d34573363ca0", 1, 0, 0.0, 733.0, 733, 733, 733.0, 733.0, 733.0, 733.0, 1.364256480218281, 0.435656122100955, 0.8140241302864939], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 25, 0, 0.0, 142.48000000000002, 121, 364, 127.0, 188.20000000000013, 322.5999999999999, 364.0, 0.1192970065995104, 0.09261828149083083, 0.04240635781466971], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6e7c9647-42cc-4cdf-8aac-796412feae14", 1, 0, 0.0, 795.0, 795, 795, 795.0, 795.0, 795.0, 795.0, 1.2578616352201257, 0.22725039308176098, 0.8672366352201257], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 21, 0, 0.0, 386.95238095238096, 236, 1422, 243.0, 479.6, 1327.7999999999988, 1422.0, 0.14779053155327848, 8.637608819575913, 0.33058372201656666], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 4, 33.333333333333336, 1027.6666666666665, 118, 1769, 1280.5, 1767.5, 1769.0, 1769.0, 0.06466283718975309, 51.5785899325351, 0.11148656158057528], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7163cdcf-0dba-4bff-8960-5062dfd52f2c", 3, 0, 0.0, 351.3333333333333, 250, 505, 299.0, 505.0, 505.0, 505.0, 0.0595580790534236, 0.02694847978003216, 0.0381931691846499], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2807f009-5d1e-423a-9625-6cce38a635e4", 1, 0, 0.0, 563.0, 563, 563, 563.0, 563.0, 563.0, 563.0, 1.7761989342806395, 0.32089531527531084, 1.2246059058614567], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2807f009-5d1e-423a-9625-6cce38a635e4", 3, 0, 0.0, 670.6666666666666, 362, 1183, 467.0, 1183.0, 1183.0, 1183.0, 0.02410180602866508, 0.024172416788514686, 0.015455910767080147], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 135.33333333333331, 118, 351, 119.0, 214.20000000000007, 351.0, 351.0, 0.10373515722791997, 0.07709224086957725, 0.05207018634292077], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 227.73333333333335, 116, 366, 120.0, 360.0, 366.0, 366.0, 0.1037380269027283, 0.038145336975690725, 0.05858226857775165], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7163cdcf-0dba-4bff-8960-5062dfd52f2c", 1, 0, 0.0, 359.0, 359, 359, 359.0, 359.0, 359.0, 359.0, 2.785515320334262, 0.5032425139275766, 1.920482242339833], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 212.20000000000002, 114, 1068, 119.0, 642.0000000000002, 1068.0, 1068.0, 0.10373874434623843, 6.24905041227506, 0.06039269869427501], "isController": false}, {"data": ["register", 21, 8, 38.095238095238095, 1490.9047619047622, 251, 3343, 1477.0, 2323.0, 3243.8999999999987, 3343.0, 0.08860946433469061, 0.02754211586742336, 0.039978098166627986], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 250.26666666666665, 114, 924, 119.0, 583.8000000000002, 924.0, 924.0, 0.10374089673631139, 2.0596485301643948, 0.06049526120228783], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 27.586206896551722, 0.6102212051868803], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 6.896551724137931, 0.15255530129672007], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 6.896551724137931, 0.15255530129672007], "isController": false}, {"data": ["401/Unauthorized", 17, 58.62068965517241, 1.2967200610221206], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1311, 29, "401/Unauthorized", 17, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
