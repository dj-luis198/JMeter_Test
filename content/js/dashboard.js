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

    var data = {"OkPercent": 96.89119170984456, "KoPercent": 3.1088082901554404};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7460417986067132, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.008620689655172414, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ce77a919-3631-4ebe-b2b9-9f8efc8d63ab"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fde35cd8-2d89-438f-ad69-66534a8db9f9"], "isController": false}, {"data": [0.5625, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5625, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0fa2f741-6d9e-434b-bbe1-3535211a89fb"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/dea57641-0a63-40c1-b0b0-5c51d24d2dbb"], "isController": false}, {"data": [0.6875, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.59375, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8ad566c3-27f3-404a-94de-a9d94ab81891"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3f5748b5-bfc6-4913-8cd3-5c84afb9a6f8"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.045454545454545456, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=90c0be3d-de4a-4730-8da9-6024eae03800"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f2cf4dee-f95b-4c65-b2d7-918aec9fcb44"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b02dae08-e09c-44a1-b8ae-689df2d48e99"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.17647058823529413, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/37eeec53-5623-4dc3-bf36-2dfcc200a88a"], "isController": false}, {"data": [0.26, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0fa2f741-6d9e-434b-bbe1-3535211a89fb"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/fde35cd8-2d89-438f-ad69-66534a8db9f9"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ce77a919-3631-4ebe-b2b9-9f8efc8d63ab"], "isController": false}, {"data": [0.33620689655172414, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.26, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5625, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dea57641-0a63-40c1-b0b0-5c51d24d2dbb"], "isController": false}, {"data": [0.4090909090909091, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=86af8738-bb97-43df-ac3f-7438b9c22ba0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=589e4e6f-445e-4c7b-ae80-d41ede8735bf"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3f5748b5-bfc6-4913-8cd3-5c84afb9a6f8"], "isController": false}, {"data": [0.2542372881355932, 500, 1500, "addBook"], "isController": true}, {"data": [0.9396551724137931, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.49137931034482757, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9827586206896551, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.47413793103448276, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9af2d832-4ed0-4a46-a3d9-af3fb8cb0b63"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8ad566c3-27f3-404a-94de-a9d94ab81891"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/589e4e6f-445e-4c7b-ae80-d41ede8735bf"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/90c0be3d-de4a-4730-8da9-6024eae03800"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/86af8738-bb97-43df-ac3f-7438b9c22ba0"], "isController": false}, {"data": [0.8421052631578947, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f2cf4dee-f95b-4c65-b2d7-918aec9fcb44"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/81569917-ce78-4c60-b9e1-c986642486c2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=37eeec53-5623-4dc3-bf36-2dfcc200a88a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6bf72c8f-7ca8-4922-83ce-3f28f5277f2e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1351, 42, 3.1088082901554404, 401.2279792746111, 119, 3615, 154.0, 1035.3999999999999, 1230.3999999999999, 1826.88, 5.355606737519771, 752.7922148590338, 3.917399255328849], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 2045.5517241379312, 1482, 4126, 2014.5, 2463.5000000000005, 3567.7499999999995, 4126.0, 0.2483748576126894, 298.8788019686919, 1.2212572344530186], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ce77a919-3631-4ebe-b2b9-9f8efc8d63ab", 3, 0, 0.0, 285.6666666666667, 201, 445, 211.0, 445.0, 445.0, 445.0, 0.04189183528130368, 0.026932413632999596, 0.026864230307346432], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fde35cd8-2d89-438f-ad69-66534a8db9f9", 1, 0, 0.0, 1038.0, 1038, 1038, 1038.0, 1038.0, 1038.0, 1038.0, 0.9633911368015414, 0.17405015655105974, 0.6642130298651252], "isController": false}, {"data": ["deleteBook", 16, 5, 31.25, 378.62500000000006, 126, 576, 442.5, 576.0, 576.0, 576.0, 0.0947031352656719, 0.02049088223369182, 0.06295238318960159], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 5, 31.25, 378.62500000000006, 126, 576, 442.5, 576.0, 576.0, 576.0, 0.09603438030815033, 0.020778923229516168, 0.06383730688086335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 205.0625, 121, 387, 127.0, 378.6, 387.0, 387.0, 0.10126454095517778, 0.04610800021518715, 0.05668935361577701], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 178.25000000000003, 122, 452, 127.0, 403.00000000000006, 452.0, 452.0, 0.10109754017047573, 0.07513205866184768, 0.050746226218383324], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0fa2f741-6d9e-434b-bbe1-3535211a89fb", 1, 0, 0.0, 442.0, 442, 442, 442.0, 442.0, 442.0, 442.0, 2.2624434389140275, 0.40874222285067874, 1.5598486990950227], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 276.5625, 122, 829, 128.5, 675.0000000000001, 829.0, 829.0, 0.1012606956609792, 3.745632143625639, 0.058541339679003594], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 330.5, 121, 1125, 138.5, 1123.6, 1125.0, 1125.0, 0.10125877312339016, 11.412983609527185, 0.05844134269133162], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dea57641-0a63-40c1-b0b0-5c51d24d2dbb", 3, 0, 0.0, 582.6666666666666, 307, 956, 485.0, 956.0, 956.0, 956.0, 0.033494478993379255, 0.02792296897853004, 0.02147920690656157], "isController": false}, {"data": ["goToProfile", 16, 5, 31.25, 231.5625, 124, 416, 223.5, 366.30000000000007, 416.0, 416.0, 0.09511806529855182, 0.15008497461536632, 0.061463315265854995], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 154.6842105263158, 121, 382, 128.0, 377.0, 382.0, 382.0, 0.10434114061341608, 0.07754258594415003, 0.052374361596968615], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 152.78947368421052, 121, 377, 127.0, 372.0, 377.0, 377.0, 0.10420151476096721, 0.027882045941899428, 0.05942742638711411], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 808.4285714285714, 592, 1057, 852.0, 1057.0, 1057.0, 1057.0, 0.04718920850214711, 13.875194128819798, 0.026912595473880772], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1197.2857142857142, 852, 1676, 1140.0, 1676.0, 1676.0, 1676.0, 0.047113617854715066, 42.392916162579, 0.02682347579033094], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 323.57142857142856, 142, 466, 374.0, 466.0, 466.0, 466.0, 0.047421940099315094, 0.08391460494136617, 0.026258046910460603], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 148.85714285714283, 122, 377, 128.0, 266.0, 377.0, 377.0, 0.061720231010007495, 0.04586825761583564, 0.030980662831195167], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 145.28571428571428, 120, 376, 126.5, 264.5, 376.0, 376.0, 0.06172322424488249, 0.016515784612400195, 0.035201526327159546], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 184.35714285714286, 121, 378, 129.0, 376.5, 378.0, 378.0, 0.06172131942546268, 0.016635824376394243, 0.0362853850528599], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 178.71428571428572, 121, 378, 126.0, 376.5, 378.0, 378.0, 0.06172240787930623, 0.01663611774871926, 0.0363463007336149], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 133.71428571428572, 121, 154, 128.0, 154.0, 154.0, 154.0, 0.04742643820673862, 0.03524562448762508, 0.026631056610229204], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 721.1999999999999, 125, 1248, 875.0, 1218.0, 1248.0, 1248.0, 0.10767276094493615, 58.14209220960656, 0.05774792999117083], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 157.15789473684208, 119, 463, 126.0, 358.0, 463.0, 463.0, 0.10434228663375308, 0.02812350694425376, 0.06134185210304625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 562.3333333333333, 122, 1011, 831.0, 934.8000000000001, 1011.0, 1011.0, 0.10792919844581954, 19.052496874550297, 0.05799086424305656], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 159.1052631578947, 121, 461, 128.0, 380.0, 461.0, 461.0, 0.10419694319072977, 0.02808433234437638, 0.06135816088282231], "isController": false}, {"data": ["deleteBooks", 16, 5, 31.25, 405.68749999999994, 125, 1038, 421.0, 886.8000000000002, 1038.0, 1038.0, 0.09620761603540441, 0.020816406179535438, 0.06418734441424595], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8ad566c3-27f3-404a-94de-a9d94ab81891", 1, 0, 0.0, 400.0, 400, 400, 400.0, 400.0, 400.0, 400.0, 2.5, 0.45166015625, 1.7236328125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 353.7142857142857, 253, 753, 268.0, 629.0, 753.0, 753.0, 0.06168569376577942, 0.09560077734989447, 0.13873257103768555], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3f5748b5-bfc6-4913-8cd3-5c84afb9a6f8", 3, 0, 0.0, 351.6666666666667, 298, 429, 328.0, 429.0, 429.0, 429.0, 0.017459014962375823, 0.024068661577363808, 0.011196048006471476], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 557.1363636363635, 150, 1048, 534.5, 995.9999999999999, 1044.7, 1048.0, 0.099495287541381, 0.06111575767922719, 0.04498663880044863], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 143.13333333333335, 121, 367, 127.0, 226.00000000000009, 367.0, 367.0, 0.10792531568154837, 0.08020621604849443, 0.0541734494729647], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 193.53333333333333, 121, 388, 127.0, 386.2, 388.0, 388.0, 0.10772534346430342, 0.1259039951739046, 0.05600876255897963], "isController": false}, {"data": ["login", 22, 0, 0.0, 2441.9090909090905, 1304, 4061, 2484.5, 3760.0999999999995, 4042.5499999999997, 4061.0, 0.102391778870991, 39.11423675509981, 0.20851053122716548], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 138.15789473684208, 125, 165, 133.0, 163.0, 165.0, 165.0, 0.10104609297304197, 0.08180391706508965, 0.03591872836151101], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=90c0be3d-de4a-4730-8da9-6024eae03800", 1, 0, 0.0, 822.0, 822, 822, 822.0, 822.0, 822.0, 822.0, 1.2165450121654502, 0.21978596411192217, 0.8387507603406327], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f2cf4dee-f95b-4c65-b2d7-918aec9fcb44", 3, 0, 0.0, 377.0, 318, 420, 393.0, 420.0, 420.0, 420.0, 0.07213966238638003, 0.03259435266676285, 0.04626143714230751], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 866.2666666666665, 255, 1375, 1011.0, 1343.8, 1375.0, 1375.0, 0.1075746926949612, 77.28472679165651, 0.2254236089695779], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b02dae08-e09c-44a1-b8ae-689df2d48e99", 1, 0, 0.0, 411.0, 411, 411, 411.0, 411.0, 411.0, 411.0, 2.4330900243309004, 0.7769730839416059, 1.451775395377129], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 587.375, 251, 1250, 503.0, 1246.5, 1250.0, 1250.0, 0.10101392729522582, 15.242954771803225, 0.22395201996287736], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 17, 10, 58.8235294117647, 633.4705882352941, 120, 1830, 131.0, 1559.5999999999997, 1830.0, 1830.0, 0.09382105565244267, 46.23230852226318, 0.12367908921830505], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/37eeec53-5623-4dc3-bf36-2dfcc200a88a", 3, 0, 0.0, 437.0, 232, 840, 239.0, 840.0, 840.0, 840.0, 0.05195165033075884, 0.033399905404703355, 0.0333153486821598], "isController": false}, {"data": ["register", 25, 8, 32.0, 972.0399999999998, 159, 1607, 1030.0, 1565.2, 1597.7, 1607.0, 0.10126254136574815, 0.03169201099306149, 0.04568681065524965], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/0fa2f741-6d9e-434b-bbe1-3535211a89fb", 3, 0, 0.0, 278.6666666666667, 216, 394, 226.0, 394.0, 394.0, 394.0, 0.02523149900335579, 0.029822777630594034, 0.016180355806188446], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 341.05263157894734, 245, 846, 257.0, 757.0, 846.0, 846.0, 0.10412385258254556, 0.16137163481298808, 0.23417698486093985], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 150.26315789473688, 125, 434, 132.0, 161.0, 434.0, 434.0, 0.11544046613645062, 0.08962419001804517, 0.041035478196941436], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 472.9375, 253, 2053, 280.0, 1200.400000000001, 2053.0, 2053.0, 0.07707388977470339, 0.11944947565669363, 0.17334098452259952], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 226.50000000000003, 120, 538, 129.0, 530.5, 538.0, 538.0, 0.04607997640705208, 0.03424498246656898, 0.023129988157446064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 153.4, 120, 374, 126.0, 352.0000000000001, 374.0, 374.0, 0.04608061342512591, 0.0192512562727235, 0.025893344692204542], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 325.90000000000003, 124, 1104, 247.5, 1032.6000000000004, 1104.0, 1104.0, 0.0460294957008451, 4.152907863046139, 0.0266647430173255], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fde35cd8-2d89-438f-ad69-66534a8db9f9", 3, 0, 0.0, 626.6666666666666, 345, 894, 641.0, 894.0, 894.0, 894.0, 0.01877793217410899, 0.022194880118551346, 0.012041838015297755], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 293.8, 124, 620, 251.5, 604.5, 620.0, 620.0, 0.04602610600732736, 1.3644852641668355, 0.026707726747611245], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, 100.0, 136.6, 125, 161, 134.0, 161.0, 161.0, 161.0, 0.06754839842747329, 0.019921500317477473, 0.0417559923872955], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ce77a919-3631-4ebe-b2b9-9f8efc8d63ab", 1, 0, 0.0, 481.0, 481, 481, 481.0, 481.0, 481.0, 481.0, 2.079002079002079, 0.37560096153846156, 1.4333744802494803], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 1346.4482758620697, 969, 3615, 1155.5, 1851.2000000000003, 2436.7, 3615.0, 0.24981048859485908, 298.86019253712703, 0.49327813275273935], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 8, 32.0, 972.0399999999998, 159, 1607, 1030.0, 1565.2, 1597.7, 1607.0, 0.10109587933195842, 0.03163985098467387, 0.045611617432973435], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 199.25, 121, 461, 126.5, 461.0, 461.0, 461.0, 0.04080092210083948, 0.01099712353499189, 0.024026324244927934], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 197.0, 123, 439, 127.5, 439.0, 439.0, 439.0, 0.040799881680343125, 0.010996843109154983, 0.02398586794098297], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 245.5263157894737, 123, 1160, 127.0, 1111.0, 1160.0, 1160.0, 0.1131545095049788, 10.744827926979609, 0.06549887366596789], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 264.6842105263158, 121, 929, 129.0, 601.0, 929.0, 929.0, 0.1131565312163136, 3.5295811272772752, 0.06561054834761687], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 158.78947368421055, 121, 372, 129.0, 370.0, 372.0, 372.0, 0.1131545095049788, 0.08409236497391491, 0.05679825965386631], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 126.125, 121, 129, 127.0, 129.0, 129.0, 129.0, 0.04079967360261118, 0.010917100163198693, 0.023268563851489187], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 176.89473684210526, 119, 504, 127.0, 384.0, 504.0, 504.0, 0.1131612488237186, 0.048170305446034, 0.06353687716644234], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 159.875, 120, 385, 128.5, 385.0, 385.0, 385.0, 0.0407990493821494, 0.03032038728497626, 0.020479210334399207], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 136.0, 128, 167, 131.0, 167.0, 167.0, 167.0, 0.0433841832114057, 0.034148097332415035, 0.01542172137592937], "isController": false}, {"data": ["deleteAccount", 16, 5, 31.25, 460.875, 120, 1303, 418.5, 1066.4000000000003, 1303.0, 1303.0, 0.09629099137593809, 0.02001164707245295, 0.06551243169357798], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dea57641-0a63-40c1-b0b0-5c51d24d2dbb", 1, 0, 0.0, 444.0, 444, 444, 444.0, 444.0, 444.0, 444.0, 2.2522522522522523, 0.4069010416666667, 1.5528223536036037], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1170.1818181818178, 704, 1947, 1172.0, 1733.1, 1924.4999999999998, 1947.0, 0.10113408080613057, 0.05234478791723555, 0.046517726620788576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 361.75, 249, 768, 257.5, 768.0, 768.0, 768.0, 0.04077264155751491, 0.06318963100759391, 0.09169862647163753], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=86af8738-bb97-43df-ac3f-7438b9c22ba0", 1, 0, 0.0, 456.0, 456, 456, 456.0, 456.0, 456.0, 456.0, 2.1929824561403506, 0.3961931195175438, 1.5119586074561402], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=589e4e6f-445e-4c7b-ae80-d41ede8735bf", 1, 0, 0.0, 449.0, 449, 449, 449.0, 449.0, 449.0, 449.0, 2.2271714922048997, 0.40236984966592426, 1.5355303452115812], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3f5748b5-bfc6-4913-8cd3-5c84afb9a6f8", 1, 0, 0.0, 533.0, 533, 533, 533.0, 533.0, 533.0, 533.0, 1.876172607879925, 0.3389569652908067, 1.2935330675422139], "isController": false}, {"data": ["addBook", 59, 14, 23.728813559322035, 1175.1355932203394, 625, 2575, 994.0, 1982.0, 2461.0, 2575.0, 0.2718593335299322, 78.27011373886067, 0.988522942739052], "isController": true}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 236.98275862068968, 122, 742, 131.5, 509.2, 526.0499999999998, 742.0, 0.2510203110055095, 0.1865492740968679, 0.12134282612082734], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 786.3448275862067, 597, 3479, 640.0, 1034.0, 1070.15, 3479.0, 0.2509638309196094, 73.79169907381365, 0.12621716105820197], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 159.00000000000003, 122, 641, 128.0, 180.7000000000003, 386.3499999999996, 641.0, 0.25173174076838944, 0.4454471819065641, 0.12242422549087689], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 1057.258620689655, 835, 2351, 900.0, 1321.3, 2279.2999999999997, 2351.0, 0.2506503945582935, 225.53566561994919, 0.12581474883101842], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 137.4375, 127, 162, 132.5, 160.6, 162.0, 162.0, 0.07811851555290822, 0.058360023826147245, 0.027768691075447837], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9af2d832-4ed0-4a46-a3d9-af3fb8cb0b63", 1, 0, 0.0, 381.0, 381, 381, 381.0, 381.0, 381.0, 381.0, 2.6246719160104988, 0.8381520669291338, 1.5660884186351707], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 14, 7.954545454545454, 192.70454545454558, 123, 1093, 134.0, 307.1000000000001, 375.6, 1061.4299999999996, 0.7139727716747529, 1.5863495365769062, 0.34095384962151326], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 135.70000000000002, 124, 156, 132.0, 155.6, 156.0, 156.0, 0.04454382667106166, 0.03449536577163271, 0.015833938386978948], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 136.24999999999997, 127, 176, 131.0, 157.10000000000002, 176.0, 176.0, 0.09571610602951645, 0.07767586338918767, 0.03402408456517968], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8ad566c3-27f3-404a-94de-a9d94ab81891", 3, 0, 0.0, 276.3333333333333, 198, 410, 221.0, 410.0, 410.0, 410.0, 0.05324624613964715, 0.03423220577011821, 0.03414554195804196], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/589e4e6f-445e-4c7b-ae80-d41ede8735bf", 3, 0, 0.0, 333.0, 210, 417, 372.0, 417.0, 417.0, 417.0, 0.03272072858155641, 0.02727792509679882, 0.020983019305229864], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 597.2, 246, 1230, 556.5, 1199.9, 1230.0, 1230.0, 0.04599879483157541, 5.56721527177238, 0.10227544538333096], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/90c0be3d-de4a-4730-8da9-6024eae03800", 3, 0, 0.0, 533.0, 234, 965, 400.0, 965.0, 965.0, 965.0, 0.021198117607156487, 0.029223316427834545, 0.013593844949901783], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/86af8738-bb97-43df-ac3f-7438b9c22ba0", 3, 0, 0.0, 745.6666666666667, 416, 1303, 518.0, 1303.0, 1303.0, 1303.0, 0.0520047844401685, 0.03296006357584898, 0.03334942231351951], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 472.52631578947376, 251, 1318, 261.0, 1233.0, 1318.0, 1318.0, 0.1130669713524, 14.395460612153508, 0.2512450849341236], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f2cf4dee-f95b-4c65-b2d7-918aec9fcb44", 1, 0, 0.0, 353.0, 353, 353, 353.0, 353.0, 353.0, 353.0, 2.8328611898017, 0.5117962110481586, 1.953125], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/81569917-ce78-4c60-b9e1-c986642486c2", 1, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 2.277904328018223, 0.7274167141230068, 1.359179242596811], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 158.64285714285717, 128, 462, 131.0, 313.0, 462.0, 462.0, 0.06432049986217035, 0.053328226936506476, 0.02286392768538087], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 147.00000000000003, 122, 379, 130.0, 244.60000000000008, 379.0, 379.0, 0.10224112547030918, 0.07937665502821856, 0.03634352506952397], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=37eeec53-5623-4dc3-bf36-2dfcc200a88a", 1, 0, 0.0, 390.0, 390, 390, 390.0, 390.0, 390.0, 390.0, 2.5641025641025643, 0.4632411858974359, 1.7678285256410255], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6bf72c8f-7ca8-4922-83ce-3f28f5277f2e", 1, 0, 0.0, 318.0, 318, 318, 318.0, 318.0, 318.0, 318.0, 3.1446540880503147, 1.0042010613207546, 1.876351218553459], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 145.43749999999997, 124, 386, 128.0, 223.60000000000016, 386.0, 386.0, 0.07712181390506305, 0.05731416052905564, 0.03871153549531485], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 272.8125, 124, 1921, 129.5, 839.5000000000011, 1921.0, 1921.0, 0.07712292912884831, 0.020636408770805113, 0.0439841705187963], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 189.4375, 120, 377, 125.5, 371.4, 377.0, 377.0, 0.07712330087727755, 0.020787139689578713, 0.04534006555480574], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 177.87500000000006, 122, 448, 127.0, 401.1, 448.0, 448.0, 0.07712144217096858, 0.02078663871014388, 0.04541428674716217], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 19.047619047619047, 0.5921539600296077], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 5, 11.904761904761905, 0.3700962250185048], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 5, 11.904761904761905, 0.3700962250185048], "isController": false}, {"data": ["401/Unauthorized", 24, 57.142857142857146, 1.776461880088823], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1351, 42, "401/Unauthorized", 24, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 5, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 17, 10, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 5, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 14, "401/Unauthorized", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
