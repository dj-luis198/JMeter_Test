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

    var data = {"OkPercent": 98.33836858006042, "KoPercent": 1.661631419939577};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7733766233766234, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.11206896551724138, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a3688a6c-c5bd-443e-b801-0412d78df7ce"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5714285714285714, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dadf9fa3-7550-4048-8b5b-b2654ecd2000"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c24ae0aa-e437-404e-8b1f-3bc652de64ce"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/38ebe26b-f6be-4eda-819e-4f442cdcc4bf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d36762b0-f368-4f03-89a5-bde334389717"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5a3b0357-0798-4762-b318-162ce53312fb"], "isController": false}, {"data": [0.717391304347826, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/9011a6ba-b4f4-45bb-a0fd-6f9aa968997d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e55099f8-7f2f-40c9-9bc8-f00369bea915"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3462ab2f-8d45-4ab1-8545-b03fdfcb154f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b84609ee-6939-41c9-a1a9-ecf82ace828b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4991ccd3-3fb2-408c-962c-4928caa3a137"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3df3b027-dd35-40a0-b5d8-be80c254fb7a"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2e95b7fa-6f9f-457a-a4fe-03b3ad2bb908"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.1956521739130435, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dadf9fa3-7550-4048-8b5b-b2654ecd2000"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.47413793103448276, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.1956521739130435, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2f549dba-8402-4d8a-907b-6a1ae41d7d95"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/11d37f5e-a8dd-4fe9-94a1-3c3cb94fd225"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3462ab2f-8d45-4ab1-8545-b03fdfcb154f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e55099f8-7f2f-40c9-9bc8-f00369bea915"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a3688a6c-c5bd-443e-b801-0412d78df7ce"], "isController": false}, {"data": [0.3125, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c24ae0aa-e437-404e-8b1f-3bc652de64ce"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d36762b0-f368-4f03-89a5-bde334389717"], "isController": false}, {"data": [0.9913793103448276, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9382352941176471, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3df3b027-dd35-40a0-b5d8-be80c254fb7a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5a3b0357-0798-4762-b318-162ce53312fb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4991ccd3-3fb2-408c-962c-4928caa3a137"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/2e95b7fa-6f9f-457a-a4fe-03b3ad2bb908"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2f549dba-8402-4d8a-907b-6a1ae41d7d95"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9011a6ba-b4f4-45bb-a0fd-6f9aa968997d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1324, 22, 1.661631419939577, 371.03474320241725, 107, 4211, 131.0, 905.5, 1097.5, 1838.75, 5.169835338401646, 760.1083128275075, 3.785978084574055], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 1630.293103448276, 1310, 2396, 1583.0, 1967.8, 2168.7499999999995, 2396.0, 0.24921261703325268, 299.887236661754, 1.2253764909789329], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a3688a6c-c5bd-443e-b801-0412d78df7ce", 3, 0, 0.0, 440.3333333333333, 250, 634, 437.0, 634.0, 634.0, 634.0, 0.017661291746878367, 0.02434751645443681, 0.011325763262158327], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 538.7857142857142, 115, 956, 523.0, 902.0, 956.0, 956.0, 0.08023750300890636, 0.015805713483339257, 0.0539879292706411], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 538.7857142857142, 115, 956, 523.0, 902.0, 956.0, 956.0, 0.07989180367159904, 0.01573761534379155, 0.05375532493137865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 155.55, 107, 336, 112.5, 333.0, 335.85, 336.0, 0.12530700215528043, 0.033529412686080895, 0.07146414966668337], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 112.9, 108, 116, 113.0, 116.0, 116.0, 116.0, 0.12530150675061869, 0.09311957679416094, 0.06289548288068164], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 171.75000000000003, 107, 442, 112.0, 336.6, 436.74999999999994, 442.0, 0.12530935747626956, 0.03377478775727578, 0.07379056890448295], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 139.2, 108, 456, 112.0, 299.50000000000045, 449.19999999999993, 456.0, 0.12530464692283114, 0.03377351811591933, 0.07366542719486753], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dadf9fa3-7550-4048-8b5b-b2654ecd2000", 1, 0, 0.0, 813.0, 813, 813, 813.0, 813.0, 813.0, 813.0, 1.2300123001230012, 0.22221901906519068, 0.8480358241082412], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 218.92857142857144, 112, 370, 209.5, 355.0, 370.0, 370.0, 0.08079595558530898, 0.16177789516436206, 0.052222051091899625], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 126.33333333333331, 109, 335, 113.5, 151.4000000000003, 335.0, 335.0, 0.10268346111719605, 0.07631065811541621, 0.05154228419359255], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 192.88888888888886, 109, 450, 115.0, 351.00000000000017, 450.0, 450.0, 0.10269693563754828, 0.03604867478162638, 0.05809018288612622], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 580.75, 545, 785, 552.5, 785.0, 785.0, 785.0, 0.10213722135689299, 30.031734353854407, 0.058250134055103035], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c24ae0aa-e437-404e-8b1f-3bc652de64ce", 3, 0, 0.0, 334.3333333333333, 234, 437, 332.0, 437.0, 437.0, 437.0, 0.05778676683039584, 0.025582683232206492, 0.037057269093710876], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 855.125, 741, 1001, 785.0, 1001.0, 1001.0, 1001.0, 0.10219462967221073, 91.95490741805268, 0.05818307529189341], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 325.75, 110, 929, 331.0, 929.0, 929.0, 929.0, 0.1027194987288462, 0.18176536298502863, 0.05687690994067949], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 10, 0, 0.0, 113.20000000000002, 107, 116, 114.0, 115.9, 116.0, 116.0, 0.04722929349699858, 0.0350991136242343, 0.023706891462360612], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 10, 0, 0.0, 154.0, 107, 326, 113.0, 325.8, 326.0, 326.0, 0.047229070437435655, 0.02682463610001228, 0.026142028441346218], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 10, 0, 0.0, 266.90000000000003, 109, 773, 114.0, 772.3, 773.0, 773.0, 0.047229516558668506, 8.509624268532862, 0.02695403269227136], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 10, 0, 0.0, 266.40000000000003, 108, 775, 113.0, 774.8, 775.0, 775.0, 0.04722973962244546, 2.7876062373955635, 0.02700028278806599], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/38ebe26b-f6be-4eda-819e-4f442cdcc4bf", 1, 0, 0.0, 219.0, 219, 219, 219.0, 219.0, 219.0, 219.0, 4.5662100456621, 1.4581549657534247, 2.724564783105023], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d36762b0-f368-4f03-89a5-bde334389717", 3, 0, 0.0, 326.3333333333333, 252, 387, 340.0, 387.0, 387.0, 387.0, 0.03671835795503225, 0.030610584219673696, 0.023546603245902843], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 112.875, 109, 115, 113.0, 115.0, 115.0, 115.0, 0.10302109356890823, 0.07656157441986247, 0.057848758595822496], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 697.4, 109, 1025, 789.0, 1012.4, 1025.0, 1025.0, 0.07159494444232312, 42.95393693141681, 0.037988202943029514], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 173.72222222222223, 107, 755, 113.0, 386.00000000000057, 755.0, 755.0, 0.10269634971530289, 5.159828548800735, 0.05988391746636695], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 569.4666666666666, 107, 901, 757.0, 892.0, 901.0, 901.0, 0.07159494444232312, 14.040626252911528, 0.03805811988096147], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 161.0, 107, 777, 113.0, 368.40000000000066, 777.0, 777.0, 0.10269459198868078, 1.7036760919858283, 0.059983180194777413], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 540.9285714285713, 116, 1739, 421.0, 1327.0, 1739.0, 1739.0, 0.07981118952877193, 0.01572173543730831, 0.054213264762219666], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 10, 0, 0.0, 404.6, 219, 891, 231.0, 890.6, 891.0, 891.0, 0.04720343263362112, 11.35286808056682, 0.10374613816916767], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5a3b0357-0798-4762-b318-162ce53312fb", 3, 0, 0.0, 271.6666666666667, 210, 390, 215.0, 390.0, 390.0, 390.0, 0.023021494401939947, 0.02308894018632063, 0.014763132803327375], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 670.4782608695652, 191, 1928, 544.0, 1318.4000000000003, 1820.3999999999985, 1928.0, 0.09889580681779093, 0.060747521961318836, 0.044715584527966014], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 128.06666666666666, 109, 328, 115.0, 201.4000000000001, 328.0, 328.0, 0.07159357757880067, 0.05320577396237042, 0.03593661999560893], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 186.6, 109, 344, 115.0, 341.6, 344.0, 344.0, 0.07159528616635881, 0.09084584162645398, 0.03682309640066631], "isController": false}, {"data": ["login", 23, 0, 0.0, 3020.7826086956525, 1614, 5068, 2895.0, 4515.6, 5005.199999999999, 5068.0, 0.10040686608343374, 41.915952973025476, 0.2094040784286762], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/9011a6ba-b4f4-45bb-a0fd-6f9aa968997d", 3, 0, 0.0, 1266.0, 227, 2690, 881.0, 2690.0, 2690.0, 2690.0, 0.06353509254945149, 0.028747974818924982, 0.04074353265703757], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e55099f8-7f2f-40c9-9bc8-f00369bea915", 1, 0, 0.0, 433.0, 433, 433, 433.0, 433.0, 433.0, 433.0, 2.3094688221709005, 0.417238019630485, 1.5922704965357968], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 155.0, 111, 358, 118.0, 342.70000000000005, 358.0, 358.0, 0.09874917709019092, 0.0799444021560237, 0.0351022465437788], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3462ab2f-8d45-4ab1-8545-b03fdfcb154f", 3, 0, 0.0, 321.3333333333333, 209, 384, 371.0, 384.0, 384.0, 384.0, 0.029910567403463643, 0.02493520934904635, 0.019180930268497192], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b84609ee-6939-41c9-a1a9-ecf82ace828b", 1, 0, 0.0, 226.0, 226, 226, 226.0, 226.0, 226.0, 226.0, 4.424778761061947, 1.4129908738938053, 2.6401756084070795], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4991ccd3-3fb2-408c-962c-4928caa3a137", 3, 0, 0.0, 473.66666666666663, 214, 922, 285.0, 922.0, 922.0, 922.0, 0.022730200101528226, 0.02686632700802376, 0.014576332747399286], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3df3b027-dd35-40a0-b5d8-be80c254fb7a", 1, 0, 0.0, 768.0, 768, 768, 768.0, 768.0, 768.0, 768.0, 1.3020833333333333, 0.23523966471354166, 0.8977254231770833], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 843.5333333333333, 227, 1140, 1017.0, 1128.6, 1140.0, 1140.0, 0.07155498523582138, 57.106724670429664, 0.14872349633161444], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2e95b7fa-6f9f-457a-a4fe-03b3ad2bb908", 1, 0, 0.0, 399.0, 399, 399, 399.0, 399.0, 399.0, 399.0, 2.506265664160401, 0.45279213659147866, 1.727952694235589], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 320.19999999999993, 223, 566, 230.0, 452.5, 560.3499999999999, 566.0, 0.12521286186517078, 0.19405548025393168, 0.28160666101121906], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 4, 33.333333333333336, 699.1666666666666, 111, 1114, 891.0, 1111.9, 1114.0, 1114.0, 0.1529831718510964, 122.02768437659358, 0.2637615135772565], "isController": false}, {"data": ["register", 23, 8, 34.78260869565217, 1166.695652173913, 318, 2419, 981.0, 2140.4, 2365.999999999999, 2419.0, 0.09925472646692013, 0.03096653065892192, 0.04478094104269248], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 131.73333333333332, 110, 321, 117.0, 208.20000000000007, 321.0, 321.0, 0.07432733759476735, 0.05770530604281254, 0.026421045785639957], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 358.83333333333337, 225, 892, 232.5, 702.1000000000003, 892.0, 892.0, 0.1026167265264238, 6.970493905350322, 0.2293287868422553], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 505.71428571428567, 223, 1125, 448.0, 1007.5, 1125.0, 1125.0, 0.10612411973832823, 18.27831026712957, 0.23479665386860318], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dadf9fa3-7550-4048-8b5b-b2654ecd2000", 3, 0, 0.0, 346.0, 233, 435, 370.0, 435.0, 435.0, 435.0, 0.020795352931798173, 0.024579403156041395, 0.013335561613164845], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 112.5, 110, 115, 112.5, 115.0, 115.0, 115.0, 0.0533829201347029, 0.03967226779541885, 0.026795723583239544], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 129.91666666666669, 109, 325, 112.5, 262.9000000000002, 325.0, 325.0, 0.05338315761377286, 0.014284165220872815, 0.030445082076604832], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 113.5, 109, 132, 111.5, 127.20000000000002, 132.0, 132.0, 0.05338339509495572, 0.014388493209187283, 0.03138359750699545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 152.49999999999997, 108, 342, 112.5, 341.7, 342.0, 342.0, 0.05338339509495572, 0.014388493209187283, 0.03143572972876787], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 123.5, 116, 131, 123.5, 131.0, 131.0, 131.0, 0.09078941395433293, 0.02677578419356303, 0.056122752962004634], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 1043.396551724138, 855, 1928, 906.0, 1464.7, 1542.3, 1928.0, 0.24788973180895393, 296.56229965808313, 0.4894853883961962], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, 34.78260869565217, 1166.695652173913, 318, 2419, 981.0, 2140.4, 2365.999999999999, 2419.0, 0.10099768144453032, 0.03151031603491885, 0.04556731330798145], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 10, 0, 0.0, 136.0, 107, 333, 112.5, 313.1000000000001, 333.0, 333.0, 0.06003013512783417, 0.016179997358674054, 0.03534977683797266], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 10, 0, 0.0, 157.6, 110, 340, 115.0, 338.7, 340.0, 340.0, 0.06010988086221613, 0.016201491326144193, 0.03533803542876378], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2f549dba-8402-4d8a-907b-6a1ae41d7d95", 1, 0, 0.0, 186.0, 186, 186, 186.0, 186.0, 186.0, 186.0, 5.376344086021506, 0.9713121639784946, 3.7067372311827955], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/11d37f5e-a8dd-4fe9-94a1-3c3cb94fd225", 1, 0, 0.0, 210.0, 210, 210, 210.0, 210.0, 210.0, 210.0, 4.761904761904763, 1.5206473214285714, 2.8413318452380953], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 172.66666666666666, 109, 340, 114.0, 340.0, 340.0, 340.0, 0.07609191903819813, 0.020509150053264345, 0.044733725840815704], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 110.4, 107, 115, 110.0, 113.2, 115.0, 115.0, 0.07618080243778567, 0.02053310690705942, 0.044860374873031995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 112.33333333333334, 108, 116, 113.0, 115.4, 116.0, 116.0, 0.07618002864369076, 0.0566142595682116, 0.0382388034402901], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 10, 0, 0.0, 159.60000000000002, 109, 344, 115.5, 342.0, 344.0, 344.0, 0.06010843561785461, 0.016083702499308752, 0.0342805921883077], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 183.86666666666665, 109, 334, 114.0, 332.8, 334.0, 334.0, 0.07609500715293067, 0.020361359335842776, 0.04339793376690577], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 10, 0, 0.0, 134.20000000000002, 109, 332, 112.5, 310.30000000000007, 332.0, 332.0, 0.06009182030142057, 0.044658081298223684, 0.030163276987236497], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 490.0714285714285, 111, 922, 436.0, 901.5, 922.0, 922.0, 0.08265097085372548, 0.015958278970641195, 0.05624601504247669], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 160.6, 109, 332, 118.0, 331.4, 332.0, 332.0, 0.06018694063762045, 0.04737370522843953, 0.021394576554779145], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1587.9565217391307, 792, 4211, 1467.0, 2231.8, 3834.599999999995, 4211.0, 0.09971732306678459, 0.05161150510292562, 0.04586607340278862], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 0, 0.0, 338.8, 222, 678, 238.0, 655.0000000000001, 678.0, 678.0, 0.059971813247773544, 0.09294459728927404, 0.1348780135836157], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3462ab2f-8d45-4ab1-8545-b03fdfcb154f", 1, 0, 0.0, 620.0, 620, 620, 620.0, 620.0, 620.0, 620.0, 1.6129032258064515, 0.2913936491935484, 1.1120211693548387], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e55099f8-7f2f-40c9-9bc8-f00369bea915", 3, 0, 0.0, 301.0, 189, 444, 270.0, 444.0, 444.0, 444.0, 0.019542573496361824, 0.023098660275159437, 0.012532184175726822], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a3688a6c-c5bd-443e-b801-0412d78df7ce", 1, 0, 0.0, 915.0, 915, 915, 915.0, 915.0, 915.0, 915.0, 1.092896174863388, 0.19744706284153005, 0.7535006830601093], "isController": false}, {"data": ["addBook", 56, 6, 10.714285714285714, 1145.0892857142856, 574, 2284, 933.5, 1821.9000000000005, 2124.25, 2284.0, 0.26268634312465405, 85.22399489491374, 0.9542993926551022], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c24ae0aa-e437-404e-8b1f-3bc652de64ce", 1, 0, 0.0, 233.0, 233, 233, 233.0, 233.0, 233.0, 233.0, 4.291845493562231, 0.7753822424892703, 2.9590262875536477], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d36762b0-f368-4f03-89a5-bde334389717", 1, 0, 0.0, 416.0, 416, 416, 416.0, 416.0, 416.0, 416.0, 2.403846153846154, 0.4342886117788462, 1.6573392427884617], "isController": false}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 188.81034482758625, 108, 782, 116.0, 454.4, 463.44999999999993, 782.0, 0.24871141756931758, 0.18483338747094794, 0.12022671064141817], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 634.6551724137933, 529, 917, 564.5, 859.1, 893.35, 917.0, 0.24876262041397532, 73.14447009808967, 0.12511010694648173], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 170.77586206896547, 108, 393, 116.5, 338.4, 343.29999999999995, 393.0, 0.24946343855242387, 0.4414333502509688, 0.12132108632725302], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 849.3620689655173, 737, 1112, 779.0, 1019.7, 1084.6, 1112.0, 0.2487572858006768, 223.83224303211543, 0.12486449697416785], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 117.14285714285715, 110, 130, 115.0, 127.5, 130.0, 130.0, 0.1069624943653686, 0.0799085040913154, 0.03802182416893962], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 6, 3.5294117647058822, 202.7999999999999, 109, 1651, 120.0, 349.0, 478.89999999999975, 1623.3099999999997, 0.6874102828491134, 1.557026937890459, 0.32762555346636746], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 177.08333333333331, 114, 350, 121.0, 350.0, 350.0, 350.0, 0.05511008238957317, 0.04267802278801907, 0.01958991209941859], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 118.14999999999999, 110, 129, 116.5, 126.0, 128.85, 129.0, 0.12361932664552776, 0.10031998090081402, 0.043942807518527444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 267.25, 224, 456, 227.5, 455.7, 456.0, 456.0, 0.05335609860207022, 0.08269153172020062, 0.1199991162896169], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3df3b027-dd35-40a0-b5d8-be80c254fb7a", 3, 0, 0.0, 378.3333333333333, 199, 533, 403.0, 533.0, 533.0, 533.0, 0.018393172454384932, 0.025356473093854227, 0.011795100825240337], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 313.8666666666667, 222, 452, 229.0, 450.8, 452.0, 452.0, 0.07604832617634086, 0.11786005238462202, 0.17103446795323535], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5a3b0357-0798-4762-b318-162ce53312fb", 1, 0, 0.0, 378.0, 378, 378, 378.0, 378.0, 378.0, 378.0, 2.6455026455026456, 0.4779472552910053, 1.823950066137566], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4991ccd3-3fb2-408c-962c-4928caa3a137", 1, 0, 0.0, 426.0, 426, 426, 426.0, 426.0, 426.0, 426.0, 2.347417840375587, 0.42409404342723006, 1.6184345657276995], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 10, 0, 0.0, 120.7, 116, 130, 120.0, 129.7, 130.0, 130.0, 0.048932776152122215, 0.04057024116518727, 0.017394072772824693], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2e95b7fa-6f9f-457a-a4fe-03b3ad2bb908", 3, 0, 0.0, 1279.3333333333333, 197, 3019, 622.0, 3019.0, 3019.0, 3019.0, 0.035351095294769215, 0.029470753596973945, 0.022669810459210727], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 135.79999999999998, 112, 330, 118.0, 235.80000000000007, 330.0, 330.0, 0.07178750897343862, 0.05573346643933956, 0.02551821608040201], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2f549dba-8402-4d8a-907b-6a1ae41d7d95", 3, 0, 0.0, 400.0, 200, 694, 306.0, 694.0, 694.0, 694.0, 0.06284301814068458, 0.029130357367296494, 0.040299721919644725], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9011a6ba-b4f4-45bb-a0fd-6f9aa968997d", 1, 0, 0.0, 1739.0, 1739, 1739, 1739.0, 1739.0, 1739.0, 1739.0, 0.5750431282346176, 0.10388962765957446, 0.3964652817711328], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 112.71428571428572, 107, 120, 113.0, 118.0, 120.0, 120.0, 0.10639591439688716, 0.0790696199765929, 0.05340576171875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 224.78571428571428, 107, 370, 215.5, 357.5, 370.0, 370.0, 0.1062175183035545, 0.051212017753499484, 0.05930280528052805], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 345.2142857142857, 108, 988, 333.0, 881.0, 988.0, 988.0, 0.10621510075260986, 13.67775772809693, 0.061138881934328725], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 284.2857142857143, 108, 1008, 113.5, 892.5, 1008.0, 1008.0, 0.1063983401858931, 4.493815833972991, 0.06134826171711722], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 36.36363636363637, 0.6042296072507553], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 9.090909090909092, 0.1510574018126888], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 9.090909090909092, 0.1510574018126888], "isController": false}, {"data": ["401/Unauthorized", 10, 45.45454545454545, 0.7552870090634441], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1324, 22, "401/Unauthorized", 10, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
