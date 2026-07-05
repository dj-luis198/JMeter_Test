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

    var data = {"OkPercent": 98.11320754716981, "KoPercent": 1.8867924528301887};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7584688346883469, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.01818181818181818, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dd9ba019-8342-4aeb-9fd2-7d90738bf039"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d0f86062-7522-454e-9578-f7229985686e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c4c220e8-b484-49ef-894d-4cb9ddd9ab5f"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c1ff5e76-03fa-4a34-b254-d0e3e25a3167"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5f69099c-1527-4e91-be9c-d2737d433304"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2f0ff7fe-7405-446b-b2f7-fd8923062fc2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/f5981890-0ecf-40e1-a8ca-a50b7c90ac90"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.725, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a319dfdb-5fc7-4e77-9bc5-677d69e2beb1"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/788b743d-cc17-4332-bb64-bc4c52a185b2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/c6243bf5-03d4-4f5e-9b2b-b1a042f2b431"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/350b5a45-02ba-4173-94d8-d51ed0049ff6"], "isController": false}, {"data": [0.6590909090909091, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.022727272727272728, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9a61eb3f-1de1-4891-89e3-9de96b573a03"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6a1bd7a0-b82c-40b2-a51a-4b2876316dda"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5f1f95c0-c67f-4e95-91b1-9149b8f438fc"], "isController": false}, {"data": [0.675, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2727272727272727, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=788b743d-cc17-4332-bb64-bc4c52a185b2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6fee6999-e4b1-40de-b418-c94613bac0fa"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5f69099c-1527-4e91-be9c-d2737d433304"], "isController": false}, {"data": [0.2818181818181818, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c4c220e8-b484-49ef-894d-4cb9ddd9ab5f"], "isController": false}, {"data": [0.2727272727272727, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6a1bd7a0-b82c-40b2-a51a-4b2876316dda"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dd9ba019-8342-4aeb-9fd2-7d90738bf039"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.75, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c1ff5e76-03fa-4a34-b254-d0e3e25a3167"], "isController": false}, {"data": [0.29545454545454547, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d0f86062-7522-454e-9578-f7229985686e"], "isController": false}, {"data": [0.2631578947368421, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=38bfcc7e-f2ca-4c66-8868-9922cf212dc3"], "isController": false}, {"data": [0.9636363636363636, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4909090909090909, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2f0ff7fe-7405-446b-b2f7-fd8923062fc2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/38bfcc7e-f2ca-4c66-8868-9922cf212dc3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5f1f95c0-c67f-4e95-91b1-9149b8f438fc"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f12687f2-7e2e-45ff-8a0a-4c638e185cd9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1272, 24, 1.8867924528301887, 426.6014150943393, 118, 2425, 134.0, 1219.0, 1473.35, 1952.4799999999996, 4.998860322725165, 717.8586523242539, 3.6486021882786157], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 2048.4000000000005, 1463, 2595, 2071.0, 2477.8, 2524.9999999999995, 2595.0, 0.23292648840026087, 280.2895090968381, 1.1452977237258921], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dd9ba019-8342-4aeb-9fd2-7d90738bf039", 1, 0, 0.0, 220.0, 220, 220, 220.0, 220.0, 220.0, 220.0, 4.545454545454545, 0.8212002840909091, 3.133877840909091], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d0f86062-7522-454e-9578-f7229985686e", 1, 0, 0.0, 438.0, 438, 438, 438.0, 438.0, 438.0, 438.0, 2.28310502283105, 0.4124750285388128, 1.574093892694064], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c4c220e8-b484-49ef-894d-4cb9ddd9ab5f", 1, 0, 0.0, 442.0, 442, 442, 442.0, 442.0, 442.0, 442.0, 2.2624434389140275, 0.40874222285067874, 1.5598486990950227], "isController": false}, {"data": ["deleteBook", 12, 2, 16.666666666666668, 619.0833333333334, 134, 1225, 554.5, 1145.5000000000002, 1225.0, 1225.0, 0.10230353458711999, 0.020430735178775427, 0.06871853633480536], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 2, 16.666666666666668, 619.0833333333334, 134, 1225, 554.5, 1145.5000000000002, 1225.0, 1225.0, 0.10185460255485294, 0.020341080295378348, 0.06841698319399057], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 204.53333333333333, 121, 376, 124.0, 371.8, 376.0, 376.0, 0.10041168792047395, 0.04697645764300298, 0.05614163905345249], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 173.60000000000002, 122, 373, 125.0, 370.0, 373.0, 373.0, 0.10057461630783879, 0.07474344043971222, 0.05048374295139564], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c1ff5e76-03fa-4a34-b254-d0e3e25a3167", 3, 0, 0.0, 428.0, 294, 501, 489.0, 501.0, 501.0, 501.0, 0.026898833487254435, 0.03179351054434273, 0.017249577464157305], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 286.2, 123, 975, 125.0, 822.6000000000001, 975.0, 975.0, 0.10000600036002161, 3.9440387256568723, 0.05774435007767132], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 331.66666666666663, 121, 1298, 125.0, 1176.2, 1298.0, 1298.0, 0.09992605471950756, 12.011827393562099, 0.057600604719174484], "isController": false}, {"data": ["goToProfile", 12, 2, 16.666666666666668, 233.25, 122, 397, 227.0, 366.10000000000014, 397.0, 397.0, 0.1023785960481862, 0.19108505048544516, 0.06616949949663857], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5f69099c-1527-4e91-be9c-d2737d433304", 1, 0, 0.0, 1034.0, 1034, 1034, 1034.0, 1034.0, 1034.0, 1034.0, 0.9671179883945842, 0.17472346470019343, 0.6667825193423598], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2f0ff7fe-7405-446b-b2f7-fd8923062fc2", 1, 0, 0.0, 441.0, 441, 441, 441.0, 441.0, 441.0, 441.0, 2.2675736961451247, 0.4096690759637188, 1.5633857709750567], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 123.76470588235294, 120, 128, 124.0, 127.2, 128.0, 128.0, 0.0875449311484865, 0.06506024668359202, 0.04394345176789264], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 906.8, 608, 1023, 975.0, 1023.0, 1023.0, 1023.0, 0.022354661170400643, 6.5730126287069615, 0.012749142698744114], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 137.11764705882354, 119, 362, 124.0, 173.19999999999982, 362.0, 362.0, 0.08754898880917926, 0.02342619427120617, 0.04993028268023505], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1347.4, 1212, 1478, 1337.0, 1478.0, 1478.0, 1478.0, 0.022281937815567945, 20.049326813916853, 0.012685907955543078], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 172.2, 120, 366, 124.0, 366.0, 366.0, 366.0, 0.022402939265631652, 0.039642701122387256, 0.012404752503528464], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 158.71428571428572, 123, 368, 124.5, 364.0, 368.0, 368.0, 0.06451583172427776, 0.04794584759978065, 0.03238392334597536], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 228.0, 122, 376, 125.0, 372.0, 376.0, 376.0, 0.06444574358879933, 0.031072054944599678, 0.03598100806952775], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f5981890-0ecf-40e1-a8ca-a50b7c90ac90", 1, 0, 0.0, 613.0, 613, 613, 613.0, 613.0, 613.0, 613.0, 1.6313213703099512, 0.5209395391517129, 0.9733763254486134], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 322.7857142857143, 122, 1210, 126.0, 1149.0, 1210.0, 1210.0, 0.06451642634297855, 8.308046998488473, 0.03713654786427587], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 296.21428571428567, 120, 976, 125.5, 969.0, 976.0, 976.0, 0.06451642634297855, 2.724900950004378, 0.037199552186876435], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 124.0, 122, 128, 123.0, 128.0, 128.0, 128.0, 0.022402537759477394, 0.01664876097164287, 0.012579550011425295], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 634.3000000000001, 119, 1585, 128.0, 1565.9, 1584.05, 1585.0, 0.10447355774253536, 37.61909169382979, 0.05782774660983305], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 124.05882352941175, 120, 129, 124.0, 126.6, 129.0, 129.0, 0.08754628366025861, 0.02359645926780408, 0.05146763941745673], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 482.75, 121, 1132, 128.0, 990.0, 1124.9499999999998, 1132.0, 0.10447519497683264, 12.304566088396463, 0.05793067940219294], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 152.64705882352945, 122, 367, 125.0, 360.6, 367.0, 367.0, 0.08754628366025861, 0.02359645926780408, 0.051553133835093704], "isController": false}, {"data": ["deleteBooks", 12, 2, 16.666666666666668, 462.5833333333333, 127, 1034, 444.0, 969.2000000000003, 1034.0, 1034.0, 0.10192381195056696, 0.020354901898330998, 0.06906068182783369], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a319dfdb-5fc7-4e77-9bc5-677d69e2beb1", 1, 0, 0.0, 296.0, 296, 296, 296.0, 296.0, 296.0, 296.0, 3.3783783783783785, 1.0788376266891893, 2.0158097550675675], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 535.3571428571429, 249, 1578, 488.5, 1395.5, 1578.0, 1578.0, 0.0644080896560608, 11.093340979877071, 0.14250110126331866], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/788b743d-cc17-4332-bb64-bc4c52a185b2", 3, 0, 0.0, 708.6666666666666, 214, 1443, 469.0, 1443.0, 1443.0, 1443.0, 0.0499226199390944, 0.03209543436839565, 0.03201418010417186], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c6243bf5-03d4-4f5e-9b2b-b1a042f2b431", 1, 0, 0.0, 745.0, 745, 745, 745.0, 745.0, 745.0, 745.0, 1.3422818791946307, 0.4286388422818792, 0.8009123322147651], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/350b5a45-02ba-4173-94d8-d51ed0049ff6", 1, 0, 0.0, 238.0, 238, 238, 238.0, 238.0, 238.0, 238.0, 4.201680672268908, 1.341747636554622, 2.5070575105042017], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 717.8636363636364, 129, 1978, 618.5, 1402.4999999999998, 1907.649999999999, 1978.0, 0.09924036015228885, 0.060959166538857114, 0.044871373779794665], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 136.75, 121, 370, 125.0, 129.70000000000002, 357.99999999999983, 370.0, 0.10447137484329294, 0.07763937134350188, 0.052439733075637276], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 149.14999999999995, 119, 375, 124.0, 347.8000000000005, 374.85, 375.0, 0.10447355774253536, 0.09072059330533441, 0.0560729173196264], "isController": false}, {"data": ["login", 22, 0, 0.0, 2886.5, 1487, 4849, 2788.0, 3779.8, 4690.599999999998, 4849.0, 0.09920098118788666, 27.10922651557681, 0.18705866836210164], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/9a61eb3f-1de1-4891-89e3-9de96b573a03", 1, 0, 0.0, 266.0, 266, 266, 266.0, 266.0, 266.0, 266.0, 3.7593984962406015, 1.2005110432330826, 2.2431567199248117], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 164.58823529411762, 123, 462, 128.0, 414.79999999999995, 462.0, 462.0, 0.08766411237507864, 0.07097026285052753, 0.031161852445828735], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6a1bd7a0-b82c-40b2-a51a-4b2876316dda", 1, 0, 0.0, 472.0, 472, 472, 472.0, 472.0, 472.0, 472.0, 2.1186440677966103, 0.38276284427966106, 1.4607057733050848], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5f1f95c0-c67f-4e95-91b1-9149b8f438fc", 1, 0, 0.0, 503.0, 503, 503, 503.0, 503.0, 503.0, 503.0, 1.9880715705765406, 0.3591730864811133, 1.3706821570576542], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 773.0, 247, 1711, 254.5, 1693.6, 1710.15, 1711.0, 0.10440320517839898, 50.058094674131496, 0.2241202398663639], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, 44.44444444444444, 873.0, 122, 1608, 1336.0, 1608.0, 1608.0, 1608.0, 0.04008426603481986, 26.64627681192017, 0.06201839728629519], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 572.4666666666666, 248, 1422, 491.0, 1301.4, 1422.0, 1422.0, 0.09984092013391994, 16.060029509231956, 0.2211385380127663], "isController": false}, {"data": ["register", 22, 5, 22.727272727272727, 1197.0454545454543, 157, 2425, 1125.0, 1765.5, 2330.3499999999985, 2425.0, 0.1003516870487025, 0.03173408285400198, 0.04527585880517632], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=788b743d-cc17-4332-bb64-bc4c52a185b2", 1, 0, 0.0, 460.0, 460, 460, 460.0, 460.0, 460.0, 460.0, 2.1739130434782608, 0.39274796195652173, 1.4988111413043477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 292.23529411764713, 246, 493, 251.0, 488.2, 493.0, 493.0, 0.08748816336613283, 0.1355895656855984, 0.1967629299142616], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 12, 0, 0.0, 149.91666666666666, 126, 372, 128.0, 303.60000000000025, 372.0, 372.0, 0.0704870656234581, 0.054723844893212095, 0.02505594910833862], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6fee6999-e4b1-40de-b418-c94613bac0fa", 1, 0, 0.0, 275.0, 275, 275, 275.0, 275.0, 275.0, 275.0, 3.6363636363636362, 1.1612215909090908, 2.169744318181818], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 13, 0, 0.0, 506.53846153846155, 244, 1618, 258.0, 1560.3999999999999, 1618.0, 1618.0, 0.11086569048004843, 20.55060305872044, 0.24497553226191593], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 13, 0, 0.0, 164.38461538461542, 124, 378, 125.0, 377.2, 378.0, 378.0, 0.06988082631389393, 0.05193291877429031, 0.035076899145841285], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 13, 0, 0.0, 179.46153846153848, 121, 368, 124.0, 367.6, 368.0, 368.0, 0.06988120195667365, 0.018698680992313067, 0.039854122990915446], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 13, 0, 0.0, 161.46153846153845, 121, 370, 124.0, 368.8, 370.0, 370.0, 0.0698819532543488, 0.018835370213086202, 0.04108294517491991], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 13, 0, 0.0, 181.0, 121, 377, 124.0, 373.8, 377.0, 377.0, 0.06988157760349192, 0.018835268963441183, 0.04115096806143128], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 138.5, 127, 150, 138.5, 150.0, 150.0, 150.0, 0.12398487384539088, 0.03656585146612113, 0.07664299330481682], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5f69099c-1527-4e91-be9c-d2737d433304", 3, 0, 0.0, 319.0, 227, 490, 240.0, 490.0, 490.0, 490.0, 0.021486123545210387, 0.025395870635631156, 0.013778536257833483], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1428.3454545454545, 953, 2083, 1350.0, 1971.2, 1994.1999999999998, 2083.0, 0.24593535924448656, 294.2241906211433, 0.4856262660081561], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c4c220e8-b484-49ef-894d-4cb9ddd9ab5f", 3, 0, 0.0, 660.0, 271, 1319, 390.0, 1319.0, 1319.0, 1319.0, 0.031001984126984124, 0.025845078564194775, 0.01988082966476521], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, 22.727272727272727, 1197.0454545454543, 157, 2425, 1125.0, 1765.5, 2330.3499999999985, 2425.0, 0.10002136820138849, 0.031629626556582545, 0.04512682823148582], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 153.875, 119, 372, 123.0, 372.0, 372.0, 372.0, 0.04682990792069355, 0.012622123619249434, 0.027576596168142786], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 153.87500000000003, 121, 366, 124.5, 366.0, 366.0, 366.0, 0.04682990792069355, 0.012622123619249434, 0.027530863836188985], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6a1bd7a0-b82c-40b2-a51a-4b2876316dda", 3, 0, 0.0, 629.6666666666666, 221, 1188, 480.0, 1188.0, 1188.0, 1188.0, 0.015616947511439412, 0.02152922288767771, 0.010014774283051968], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 12, 0, 0.0, 336.83333333333337, 121, 1347, 124.0, 1302.6000000000001, 1347.0, 1347.0, 0.06731853447550447, 10.110676316357843, 0.03861173754747359], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 12, 0, 0.0, 287.5, 120, 985, 127.5, 908.5000000000002, 985.0, 985.0, 0.06739944844784687, 3.318084500654336, 0.03872396696303702], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dd9ba019-8342-4aeb-9fd2-7d90738bf039", 3, 0, 0.0, 371.6666666666667, 227, 453, 435.0, 453.0, 453.0, 453.0, 0.08307487815684537, 0.03677794085068675, 0.053273929026362424], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 123.875, 122, 126, 123.5, 126.0, 126.0, 126.0, 0.04682990792069355, 0.01253065895534183, 0.026707681861020544], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 12, 0, 0.0, 125.16666666666666, 122, 127, 125.0, 127.0, 127.0, 127.0, 0.06772505883614487, 0.050330829857720936, 0.033994804923611774], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 126.75, 120, 132, 127.5, 132.0, 132.0, 132.0, 0.046829359667043255, 0.034801897174433515, 0.023506143426621322], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 12, 0, 0.0, 185.75, 122, 378, 123.5, 375.3, 378.0, 378.0, 0.06763459283975111, 0.03502820221616016, 0.03762614556091622], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 188.25, 126, 371, 128.0, 371.0, 371.0, 371.0, 0.0490445508438728, 0.03860342576187645, 0.01743380518278291], "isController": false}, {"data": ["deleteAccount", 12, 2, 16.666666666666668, 492.91666666666663, 123, 1319, 474.0, 1120.1000000000008, 1319.0, 1319.0, 0.09677887639724503, 0.018886372526089972, 0.06585815140248721], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c1ff5e76-03fa-4a34-b254-d0e3e25a3167", 1, 0, 0.0, 818.0, 818, 818, 818.0, 818.0, 818.0, 818.0, 1.2224938875305624, 0.2208607121026895, 0.8428522310513448], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1472.3636363636365, 952, 2321, 1336.5, 2055.9, 2285.5999999999995, 2321.0, 0.09761465284679824, 0.050523208992971747, 0.04489892723715036], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 282.74999999999994, 245, 501, 252.0, 501.0, 501.0, 501.0, 0.04679511926906024, 0.07252329519531113, 0.10524331999672434], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d0f86062-7522-454e-9578-f7229985686e", 3, 0, 0.0, 389.3333333333333, 292, 479, 397.0, 479.0, 479.0, 479.0, 0.021156707734187125, 0.025006512299099427, 0.01356728979047807], "isController": false}, {"data": ["addBook", 57, 11, 19.29824561403509, 1245.6842105263152, 632, 4063, 1000.0, 2098.4, 2348.599999999998, 4063.0, 0.2697433179374574, 91.62506891468539, 0.9785681983275913], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=38bfcc7e-f2ca-4c66-8868-9922cf212dc3", 1, 0, 0.0, 446.0, 446, 446, 446.0, 446.0, 446.0, 446.0, 2.242152466367713, 0.40507637331838564, 1.5458590246636772], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 228.14545454545453, 123, 537, 127.0, 500.0, 512.0, 537.0, 0.24698010687502808, 0.18354673958193005, 0.11938979775697157], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 800.7818181818182, 603, 1117, 736.0, 994.6, 1094.3999999999999, 1117.0, 0.24689917086769345, 72.59655405913459, 0.12417292284849818], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 167.16363636363636, 121, 377, 127.0, 367.4, 370.2, 377.0, 0.24744123270723206, 0.4378549938139692, 0.12033763075019682], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1197.9454545454546, 829, 1582, 1219.0, 1473.4, 1485.2, 1582.0, 0.24652843145164907, 221.82671597095222, 0.12374571656850351], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 13, 0, 0.0, 128.84615384615387, 125, 138, 128.0, 135.2, 138.0, 138.0, 0.11122043033751122, 0.08308948164862899, 0.03953538734653719], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 11, 6.508875739644971, 191.02958579881658, 121, 2312, 130.0, 319.0, 380.0, 1198.3000000000181, 0.7106513603296749, 1.5440454695975778, 0.34062858085236114], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 13, 0, 0.0, 134.61538461538464, 124, 183, 127.0, 169.79999999999998, 183.0, 183.0, 0.07134938145574693, 0.05525396435000714, 0.025362475439347536], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2f0ff7fe-7405-446b-b2f7-fd8923062fc2", 3, 0, 0.0, 295.0, 228, 413, 244.0, 413.0, 413.0, 413.0, 0.0338409475465313, 0.028211805555555552, 0.021701388888888888], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/38bfcc7e-f2ca-4c66-8868-9922cf212dc3", 3, 0, 0.0, 293.3333333333333, 227, 420, 233.0, 420.0, 420.0, 420.0, 0.038910001167300035, 0.02501538160983645, 0.024952051529811545], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 166.4, 125, 409, 129.0, 387.40000000000003, 409.0, 409.0, 0.09944839291397051, 0.080704701671396, 0.035350795918637955], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5f1f95c0-c67f-4e95-91b1-9149b8f438fc", 3, 0, 0.0, 361.0, 209, 656, 218.0, 656.0, 656.0, 656.0, 0.04509921828021648, 0.028583391273301263, 0.028921048180998197], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 13, 0, 0.0, 365.3846153846154, 248, 756, 251.0, 751.6, 756.0, 756.0, 0.06983427788670732, 0.10822949121699658, 0.1570589277080927], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 12, 0, 0.0, 504.66666666666663, 248, 1472, 258.5, 1427.9, 1472.0, 1472.0, 0.06726985301537115, 13.499901109812429, 0.14842287231060733], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 147.5, 125, 372, 128.5, 259.0, 372.0, 372.0, 0.06675981250029803, 0.055350664856204136, 0.023731027099715318], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f12687f2-7e2e-45ff-8a0a-4c638e185cd9", 1, 0, 0.0, 375.0, 375, 375, 375.0, 375.0, 375.0, 375.0, 2.6666666666666665, 0.8515625, 1.5911458333333333], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 128.55, 124, 138, 128.0, 132.8, 137.75, 138.0, 0.0996944365519682, 0.07739948931524876, 0.03543825674308245], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 13, 0, 0.0, 123.92307692307692, 119, 136, 124.0, 132.0, 136.0, 136.0, 0.11099158171541758, 0.08248495477093044, 0.055712571290746714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 13, 0, 0.0, 140.84615384615387, 119, 363, 123.0, 267.79999999999995, 363.0, 363.0, 0.11099347699873638, 0.05534665717530139, 0.06186685692087019], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 13, 0, 0.0, 361.30769230769226, 118, 1496, 124.0, 1438.8, 1496.0, 1496.0, 0.11099252934898612, 15.390124733191035, 0.0637840181430096], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 13, 0, 0.0, 311.2307692307693, 119, 975, 133.0, 974.6, 975.0, 975.0, 0.11098400122936125, 5.045770228968531, 0.06388750010671539], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 20.833333333333332, 0.39308176100628933], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 8.333333333333334, 0.15723270440251572], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 8.333333333333334, 0.15723270440251572], "isController": false}, {"data": ["401/Unauthorized", 15, 62.5, 1.179245283018868], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1272, 24, "401/Unauthorized", 15, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
