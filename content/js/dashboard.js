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

    var data = {"OkPercent": 99.51612903225806, "KoPercent": 0.4838709677419355};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7503481894150418, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5909090909090909, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5909090909090909, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1bdf99fa-a1d4-4092-8fe9-50b25f0bb6a1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.59375, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1f5aeaa6-efe0-4bba-8a32-875175a4be0b"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/71c91d08-83c0-48a1-9e41-7541e98e7d8b"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=deaf0d4a-9a25-4bf0-9e26-375e35dac122"], "isController": false}, {"data": [0.6904761904761905, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6b8c6464-47a1-46d3-b6e4-725952f439fe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2b834518-3418-4899-b425-35b31f40db37"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c8404839-9cf0-4c5f-b751-8e71a19c6b9b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8a1231eb-c284-4a97-aa70-3d7704ce4440"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/0f20096d-5014-4cfe-a28f-3e8a36975440"], "isController": false}, {"data": [0.40625, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.125, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c5661b7c-17d2-40f9-af93-aff80bfeff0c"], "isController": false}, {"data": [0.30952380952380953, 500, 1500, "register"], "isController": true}, {"data": [0.7631578947368421, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f3e799ff-f7ad-4cfc-9bec-00652d447899"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7afeb04a-cac2-424b-8171-cdd193b2a9a8"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7659aeba-3457-496c-ac15-9ff8f0fbd4b7"], "isController": false}, {"data": [0.2777777777777778, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c033d290-9676-4cd2-a9a7-d9ef09247d7b"], "isController": false}, {"data": [0.30952380952380953, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5909090909090909, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6b8c6464-47a1-46d3-b6e4-725952f439fe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1bdf99fa-a1d4-4092-8fe9-50b25f0bb6a1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/9295446a-b52e-48f7-8838-8e6b432d3c31"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/deaf0d4a-9a25-4bf0-9e26-375e35dac122"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/95a3bcdb-bd37-41b3-aadc-e3385ffdfa8f"], "isController": false}, {"data": [0.33035714285714285, 500, 1500, "addBook"], "isController": true}, {"data": [0.9074074074074074, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1f5aeaa6-efe0-4bba-8a32-875175a4be0b"], "isController": false}, {"data": [0.9907407407407407, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4074074074074074, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=71c91d08-83c0-48a1-9e41-7541e98e7d8b"], "isController": false}, {"data": [0.9668674698795181, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0f20096d-5014-4cfe-a28f-3e8a36975440"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c033d290-9676-4cd2-a9a7-d9ef09247d7b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2b834518-3418-4899-b425-35b31f40db37"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7659aeba-3457-496c-ac15-9ff8f0fbd4b7"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c5661b7c-17d2-40f9-af93-aff80bfeff0c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/19999b3b-571b-480b-afae-60f0da56644b"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f3e799ff-f7ad-4cfc-9bec-00652d447899"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1240, 6, 0.4838709677419355, 462.4677419354838, 129, 2927, 159.5, 1302.0, 1555.9, 2107.5999999999967, 4.837344297980409, 703.2002063490631, 3.5296239489016497], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 2217.6111111111113, 1586, 3526, 2253.5, 2560.5, 2699.75, 3526.0, 0.24454971152191435, 294.27575269089596, 1.2024490210086318], "isController": true}, {"data": ["deleteBook", 11, 0, 0.0, 645.9090909090909, 473, 1189, 527.0, 1138.0000000000002, 1189.0, 1189.0, 0.1377048359434659, 0.024878315087442572, 0.09359625568032448], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 11, 0, 0.0, 645.9090909090909, 473, 1189, 527.0, 1138.0000000000002, 1189.0, 1189.0, 0.13639689015090456, 0.024642016287028654, 0.09270726127444294], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 203.53333333333333, 130, 400, 135.0, 399.4, 400.0, 400.0, 0.10045741610131464, 0.046997851048440564, 0.056167206346229834], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 169.99999999999997, 131, 409, 134.0, 402.4, 409.0, 409.0, 0.10063331902103907, 0.07478706618653391, 0.050513208961732496], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 326.33333333333337, 130, 1221, 132.0, 1188.6, 1221.0, 1221.0, 0.10063601964415103, 3.9688854393097714, 0.05810812879062341], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 338.0, 130, 1432, 134.0, 1302.4, 1432.0, 1432.0, 0.10045943448035684, 12.075943460593113, 0.05790806203704944], "isController": false}, {"data": ["goToProfile", 11, 0, 0.0, 329.27272727272725, 219, 714, 265.0, 658.8000000000002, 714.0, 714.0, 0.14120123743629898, 0.34129482337008843, 0.09128439373323234], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 134.7894736842105, 131, 142, 134.0, 139.0, 142.0, 142.0, 0.1471761543645476, 0.10937602878068428, 0.07387553060876705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 182.94736842105263, 130, 530, 134.0, 399.0, 530.0, 530.0, 0.14717273431448488, 0.039380204298993034, 0.08393445003872967], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 959.75, 795, 1045, 999.5, 1045.0, 1045.0, 1045.0, 0.1650709805216243, 48.536349145757676, 0.09414204357873886], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1377.0, 1170, 1687, 1325.5, 1687.0, 1687.0, 1687.0, 0.15964877270005987, 143.65224630812213, 0.090893783675913], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 335.5, 132, 410, 400.0, 410.0, 410.0, 410.0, 0.1695418132496927, 0.3000095367269953, 0.09387715635993726], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 136.28571428571428, 132, 164, 134.0, 151.5, 164.0, 164.0, 0.10258213898414373, 0.07623535914739588, 0.05149142523227527], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 209.71428571428572, 132, 413, 132.5, 407.5, 413.0, 413.0, 0.10258289063931122, 0.049459607986810775, 0.05727353910972706], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 362.92857142857144, 130, 1556, 134.0, 1443.5, 1556.0, 1556.0, 0.10258063570685386, 13.20973263547971, 0.05904683355559137], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 263.5, 131, 1036, 135.5, 910.5, 1036.0, 1036.0, 0.10257988408473098, 4.332540399988276, 0.05914657657954703], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1bdf99fa-a1d4-4092-8fe9-50b25f0bb6a1", 3, 0, 0.0, 477.0, 265, 880, 286.0, 880.0, 880.0, 880.0, 0.0236537096901364, 0.027957884077111094, 0.015168557320823148], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 203.0, 131, 417, 132.0, 417.0, 417.0, 417.0, 0.1681732184149674, 0.124980292200967, 0.0944332036998108], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 951.4374999999999, 131, 1683, 1240.5, 1589.2, 1683.0, 1683.0, 0.07196574430571048, 40.47908839923446, 0.03844263880392933], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 176.94736842105263, 130, 400, 135.0, 395.0, 400.0, 400.0, 0.14718185480122703, 0.03967010930189322, 0.0865268326077526], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 671.3125, 131, 1061, 782.5, 1051.9, 1061.0, 1061.0, 0.07188426633120676, 13.217491323344415, 0.038469314403809865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 191.4736842105263, 131, 414, 138.0, 390.0, 414.0, 414.0, 0.14717957457356654, 0.03966949470928161, 0.08666922213658265], "isController": false}, {"data": ["deleteBooks", 11, 0, 0.0, 492.6363636363636, 229, 793, 472.0, 756.8000000000002, 793.0, 793.0, 0.13689253935660506, 0.024731562286105405, 0.09438098904859685], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1f5aeaa6-efe0-4bba-8a32-875175a4be0b", 1, 0, 0.0, 793.0, 793, 793, 793.0, 793.0, 793.0, 793.0, 1.2610340479192939, 0.22782353404791927, 0.8694238650693569], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/71c91d08-83c0-48a1-9e41-7541e98e7d8b", 3, 0, 0.0, 1375.3333333333333, 224, 2284, 1618.0, 2284.0, 2284.0, 2284.0, 0.02222403306936121, 0.0222891425412441, 0.014251739956589056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 538.2142857142857, 265, 1690, 275.5, 1576.5, 1690.0, 1690.0, 0.10248001639680263, 17.650667355356777, 0.2267341769024683], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=deaf0d4a-9a25-4bf0-9e26-375e35dac122", 1, 0, 0.0, 522.0, 522, 522, 522.0, 522.0, 522.0, 522.0, 1.9157088122605364, 0.3460997365900383, 1.3207914272030652], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 512.047619047619, 154, 1585, 528.0, 848.6000000000001, 1513.699999999999, 1585.0, 0.09018759018759019, 0.05539843186327561, 0.04077817798520923], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 152.00000000000003, 131, 407, 134.0, 222.2000000000002, 407.0, 407.0, 0.0719654206153943, 0.053482114344057675, 0.03612326776983659], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 283.75, 130, 417, 389.0, 415.6, 417.0, 417.0, 0.07188265157130984, 0.08671195835298874, 0.03722243749578812], "isController": false}, {"data": ["login", 21, 0, 0.0, 2865.0476190476193, 1612, 3982, 3018.0, 3652.4, 3949.5999999999995, 3982.0, 0.08808577037298031, 20.19508016067264, 0.16072458017692656], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6b8c6464-47a1-46d3-b6e4-725952f439fe", 1, 0, 0.0, 229.0, 229, 229, 229.0, 229.0, 229.0, 229.0, 4.366812227074235, 0.7889260371179039, 3.0107123362445414], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 179.36842105263156, 133, 418, 138.0, 405.0, 418.0, 418.0, 0.1456284634664173, 0.1178964806774023, 0.05176636787282803], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2b834518-3418-4899-b425-35b31f40db37", 1, 0, 0.0, 612.0, 612, 612, 612.0, 612.0, 612.0, 612.0, 1.6339869281045751, 0.29520271650326796, 1.1265573937908497], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c8404839-9cf0-4c5f-b751-8e71a19c6b9b", 1, 0, 0.0, 277.0, 277, 277, 277.0, 277.0, 277.0, 277.0, 3.6101083032490977, 1.1528373194945847, 2.1540782942238264], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8a1231eb-c284-4a97-aa70-3d7704ce4440", 1, 0, 0.0, 213.0, 213, 213, 213.0, 213.0, 213.0, 213.0, 4.694835680751174, 1.4992297535211268, 2.80131308685446], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0f20096d-5014-4cfe-a28f-3e8a36975440", 3, 0, 0.0, 1060.3333333333333, 230, 2187, 764.0, 2187.0, 2187.0, 2187.0, 0.02799656575460077, 0.023339584927582216, 0.017953526867370936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 1120.5624999999998, 264, 1817, 1376.5, 1730.2, 1817.0, 1817.0, 0.07183843535887788, 53.75659068536112, 0.15007848910300733], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 562.4666666666666, 267, 1625, 277.0, 1587.8, 1625.0, 1625.0, 0.10036600135159549, 16.144492070667702, 0.22230154505095248], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 0, 0.0, 1580.5, 1302, 1819, 1600.5, 1819.0, 1819.0, 1819.0, 0.157035175879397, 187.8686646121231, 0.3540959190483668], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c5661b7c-17d2-40f9-af93-aff80bfeff0c", 1, 0, 0.0, 449.0, 449, 449, 449.0, 449.0, 449.0, 449.0, 2.2271714922048997, 0.40236984966592426, 1.5355303452115812], "isController": false}, {"data": ["register", 21, 4, 19.047619047619047, 1098.6190476190477, 164, 2180, 1123.0, 1904.4, 2155.0999999999995, 2180.0, 0.09217358480628185, 0.029267170622083914, 0.0415861290825217], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 402.99999999999994, 268, 661, 281.0, 548.0, 661.0, 661.0, 0.14701672121760798, 0.22784720368392952, 0.33064405172280387], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 163.30769230769232, 132, 398, 141.0, 306.3999999999999, 398.0, 398.0, 0.08186037139420807, 0.06355370630702677, 0.0290988038940349], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f3e799ff-f7ad-4cfc-9bec-00652d447899", 1, 0, 0.0, 465.0, 465, 465, 465.0, 465.0, 465.0, 465.0, 2.150537634408602, 0.3885248655913978, 1.4826948924731183], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7afeb04a-cac2-424b-8171-cdd193b2a9a8", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 1.2621973814229248, 2.3584177371541504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 502.31249999999994, 266, 1590, 527.5, 1026.5000000000005, 1590.0, 1590.0, 0.09005712999183858, 6.864575051712493, 0.2011004735035038], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 165.0, 132, 412, 137.0, 385.6000000000001, 412.0, 412.0, 0.05056378621631188, 0.03757718877989584, 0.025380650503109673], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 158.3, 129, 389, 133.5, 363.5000000000001, 389.0, 389.0, 0.05056787726164831, 0.01353085778290199, 0.028839492500783805], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 160.00000000000003, 130, 389, 135.0, 364.0000000000001, 389.0, 389.0, 0.050568900126422255, 0.013629898862199747, 0.029728982300884957], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 134.40000000000003, 132, 140, 133.5, 139.7, 140.0, 140.0, 0.05056838868886281, 0.013629761013795056, 0.02977806482361746], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7659aeba-3457-496c-ac15-9ff8f0fbd4b7", 1, 0, 0.0, 445.0, 445, 445, 445.0, 445.0, 445.0, 445.0, 2.247191011235955, 0.4059866573033708, 1.5493328651685394], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1527.8518518518524, 1042, 2927, 1462.5, 2001.0, 2143.25, 2927.0, 0.24125560137426338, 288.6255732612843, 0.47638557224488337], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c033d290-9676-4cd2-a9a7-d9ef09247d7b", 3, 0, 0.0, 316.6666666666667, 219, 426, 305.0, 426.0, 426.0, 426.0, 0.0248519239531127, 0.02492473232406909, 0.015936943420453133], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 4, 19.047619047619047, 1098.6190476190477, 164, 2180, 1123.0, 1904.4, 2155.0999999999995, 2180.0, 0.08866932674646906, 0.028154490468047372, 0.040005106403192096], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 169.2857142857143, 130, 391, 132.0, 391.0, 391.0, 391.0, 0.04058229800161169, 0.010938197508246903, 0.02389758368649595], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 134.42857142857142, 131, 140, 134.0, 140.0, 140.0, 140.0, 0.0405820627282741, 0.010938134094730129, 0.023857814221114267], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 380.46153846153845, 130, 1223, 138.0, 1207.4, 1223.0, 1223.0, 0.07835526276136001, 10.864670572626288, 0.045028377413191406], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 301.3076923076923, 131, 1095, 138.0, 1081.4, 1095.0, 1095.0, 0.0783571518983527, 3.5624250333017895, 0.045105983698698664], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 132.42857142857142, 130, 138, 131.0, 138.0, 138.0, 138.0, 0.04058065114553381, 0.01085849454480104, 0.02314365260643725], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 138.0769230769231, 130, 165, 135.0, 157.79999999999998, 165.0, 165.0, 0.07835667960556453, 0.05823186833968224, 0.039331380192636885], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 133.42857142857142, 132, 137, 132.0, 137.0, 137.0, 137.0, 0.04058018063977553, 0.030157731901239437, 0.02036934848519983], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 174.38461538461542, 129, 403, 135.0, 398.6, 403.0, 403.0, 0.07835620731846976, 0.03907215325871412, 0.043675109548005235], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 150.42857142857142, 136, 184, 142.0, 184.0, 184.0, 184.0, 0.038851116969612874, 0.030580078396003883, 0.013810357985292076], "isController": false}, {"data": ["deleteAccount", 11, 0, 0.0, 737.7272727272727, 426, 1618, 710.0, 1470.4000000000005, 1618.0, 1618.0, 0.13264358668258389, 0.023963929234646505, 0.09028572257593845], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1518.809523809524, 815, 2845, 1399.0, 2658.0000000000005, 2837.6, 2845.0, 0.0903929510715869, 0.0467854141288487, 0.04157722651827875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 306.99999999999994, 267, 524, 270.0, 524.0, 524.0, 524.0, 0.04054774207002016, 0.06284108072765819, 0.09119282225318011], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6b8c6464-47a1-46d3-b6e4-725952f439fe", 3, 0, 0.0, 411.0, 286, 520, 427.0, 520.0, 520.0, 520.0, 0.05396071659831642, 0.025048171181379957, 0.034603714745665155], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1bdf99fa-a1d4-4092-8fe9-50b25f0bb6a1", 1, 0, 0.0, 472.0, 472, 472, 472.0, 472.0, 472.0, 472.0, 2.1186440677966103, 0.38276284427966106, 1.4607057733050848], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9295446a-b52e-48f7-8838-8e6b432d3c31", 1, 0, 0.0, 683.0, 683, 683, 683.0, 683.0, 683.0, 683.0, 1.4641288433382138, 0.4675489568081991, 0.8736159407027818], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/deaf0d4a-9a25-4bf0-9e26-375e35dac122", 3, 0, 0.0, 1057.3333333333333, 438, 2124, 610.0, 2124.0, 2124.0, 2124.0, 0.018740044351438296, 0.022150097994815255, 0.012017541462348126], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/95a3bcdb-bd37-41b3-aadc-e3385ffdfa8f", 1, 0, 0.0, 285.0, 285, 285, 285.0, 285.0, 285.0, 285.0, 3.5087719298245617, 1.1204769736842106, 2.0936129385964914], "isController": false}, {"data": ["addBook", 56, 2, 3.5714285714285716, 1402.9107142857144, 680, 4292, 1106.5, 2310.1, 2481.25, 4292.0, 0.2657958687727825, 97.55382329261752, 0.9640801430907314], "isController": true}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 237.57407407407405, 131, 641, 138.5, 534.0, 548.5, 641.0, 0.24237092626088988, 0.18012136219193084, 0.11716172704994188], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 924.037037037037, 646, 1315, 1031.0, 1169.0, 1181.75, 1315.0, 0.24209926966720316, 71.1852237344709, 0.12175891003770471], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1f5aeaa6-efe0-4bba-8a32-875175a4be0b", 3, 0, 0.0, 456.6666666666667, 302, 710, 358.0, 710.0, 710.0, 710.0, 0.01953913689119306, 0.023094598324193357, 0.012529980363167423], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 201.4074074074074, 130, 535, 137.0, 399.5, 407.0, 535.0, 0.24284943335132217, 0.4297296613599568, 0.11810450957906098], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1282.8703703703704, 908, 2386, 1267.5, 1578.0, 1641.75, 2386.0, 0.24187263166381498, 217.63741913783605, 0.12140872331562587], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 156.0625, 134, 410, 139.0, 228.7000000000002, 410.0, 410.0, 0.09222380411664005, 0.06889766616135706, 0.03278268036958689], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=71c91d08-83c0-48a1-9e41-7541e98e7d8b", 1, 0, 0.0, 422.0, 422, 422, 422.0, 422.0, 422.0, 422.0, 2.3696682464454977, 0.4281138921800948, 1.6337751777251186], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 166, 2, 1.2048192771084338, 216.04216867469881, 131, 2316, 143.5, 361.90000000000003, 429.60000000000014, 1200.4500000000207, 0.6968465594250597, 1.5193217828042616, 0.33525983902214795], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 167.89999999999998, 134, 402, 142.0, 377.5000000000001, 402.0, 402.0, 0.05027500427337536, 0.038933670301549476, 0.0178711929253014], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 156.4, 133, 399, 140.0, 249.00000000000009, 399.0, 399.0, 0.10262515137209828, 0.08328271561544302, 0.036480034276800556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 326.6, 266, 802, 273.0, 750.5000000000002, 802.0, 802.0, 0.05052954968065325, 0.07831093295234053, 0.1136421415181098], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 540.6923076923077, 269, 1388, 526.0, 1360.4, 1388.0, 1388.0, 0.078292500782925, 14.51267835069319, 0.17299984303859217], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0f20096d-5014-4cfe-a28f-3e8a36975440", 1, 0, 0.0, 482.0, 482, 482, 482.0, 482.0, 482.0, 482.0, 2.074688796680498, 0.3748217064315353, 1.4304006742738589], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c033d290-9676-4cd2-a9a7-d9ef09247d7b", 1, 0, 0.0, 528.0, 528, 528, 528.0, 528.0, 528.0, 528.0, 1.893939393939394, 0.3421667850378788, 1.305782433712121], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2b834518-3418-4899-b425-35b31f40db37", 3, 0, 0.0, 514.0, 364, 714, 464.0, 714.0, 714.0, 714.0, 0.021174178794765745, 0.025027162501235163, 0.013578493563049647], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7659aeba-3457-496c-ac15-9ff8f0fbd4b7", 3, 0, 0.0, 360.6666666666667, 259, 484, 339.0, 484.0, 484.0, 484.0, 0.03968673933749603, 0.02551474941131337, 0.025450155109006244], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c5661b7c-17d2-40f9-af93-aff80bfeff0c", 3, 0, 0.0, 424.66666666666663, 237, 799, 238.0, 799.0, 799.0, 799.0, 0.043696744592527856, 0.02809279640958415, 0.028021675406015585], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 158.35714285714283, 133, 403, 138.0, 278.5, 403.0, 403.0, 0.10231898674969121, 0.08483283178758579, 0.0363712023211793], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/19999b3b-571b-480b-afae-60f0da56644b", 1, 0, 0.0, 327.0, 327, 327, 327.0, 327.0, 327.0, 327.0, 3.058103975535168, 0.9765625, 1.8247085244648318], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 161.56249999999997, 133, 502, 139.5, 253.50000000000026, 502.0, 502.0, 0.07447749383233254, 0.05782188241865661, 0.026474421635711957], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f3e799ff-f7ad-4cfc-9bec-00652d447899", 3, 0, 0.0, 511.33333333333337, 307, 840, 387.0, 840.0, 840.0, 840.0, 0.017810390581865457, 0.02455306123509122, 0.011421376772875962], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 152.62499999999997, 130, 393, 135.0, 227.10000000000016, 393.0, 393.0, 0.09012662791221666, 0.06697887093866883, 0.04523934252624938], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 214.0625, 130, 393, 133.5, 393.0, 393.0, 393.0, 0.09012865866023749, 0.03257702127599649, 0.05092841320046867], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 281.875, 130, 1455, 137.0, 715.1000000000008, 1455.0, 1455.0, 0.09012612023951017, 5.091251156501191, 0.0525002253153006], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 290.49999999999994, 131, 1059, 137.5, 604.0000000000005, 1059.0, 1059.0, 0.09012713559064256, 1.6790469724323625, 0.05258883155801653], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 66.66666666666667, 0.3225806451612903], "isController": false}, {"data": ["401/Unauthorized", 2, 33.333333333333336, 0.16129032258064516], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1240, 6, "406/Not Acceptable", 4, "401/Unauthorized", 2, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 166, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
