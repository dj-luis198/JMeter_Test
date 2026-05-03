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

    var data = {"OkPercent": 98.09674861221254, "KoPercent": 1.9032513877874702};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7652645861601085, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d516ac79-3b3d-4e9c-a058-98d78c677d53"], "isController": false}, {"data": [0.5333333333333333, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5333333333333333, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/65081427-434e-4c9d-8bae-7ebb1ae4b1ad"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c14f91af-5e1f-45c9-a4f3-a2c7fa64384c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d11ac095-328e-4547-9c30-adfbc23a40a3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/835e5fca-f4ea-433f-a9a5-170d9dd773df"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e45f03ef-1987-4ed6-99a0-753b3d6eab87"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=510bc9b1-f414-46cc-a5f6-1139cf30cdf1"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.5666666666666667, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e644df3c-9d30-487c-ad37-0342216d2930"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/febc02fe-53d2-459c-9b0b-755d2479af9b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e823cb7b-0d7d-4c6b-997b-8b4c07d2097c"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c9b755f5-bd84-47cb-a8af-67364e6bd292"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9d7f45f4-d77e-4a64-9420-298aa39a1165"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/84e9469f-73ed-4e3c-b0dd-fb41cd9b213e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.18181818181818182, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=04942c34-b7bd-4d95-a871-3d50a706a3c8"], "isController": false}, {"data": [0.30434782608695654, 500, 1500, "register"], "isController": true}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d516ac79-3b3d-4e9c-a058-98d78c677d53"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=65081427-434e-4c9d-8bae-7ebb1ae4b1ad"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.39814814814814814, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b85c443d-113b-4f2e-a6d4-f035afe06ead"], "isController": false}, {"data": [0.30434782608695654, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c14f91af-5e1f-45c9-a4f3-a2c7fa64384c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=30c28a37-2abd-409d-8902-c8c0f479f96d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/510bc9b1-f414-46cc-a5f6-1139cf30cdf1"], "isController": false}, {"data": [0.30357142857142855, 500, 1500, "addBook"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d11ac095-328e-4547-9c30-adfbc23a40a3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=835e5fca-f4ea-433f-a9a5-170d9dd773df"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e644df3c-9d30-487c-ad37-0342216d2930"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.49074074074074076, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9487951807228916, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e823cb7b-0d7d-4c6b-997b-8b4c07d2097c"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/04942c34-b7bd-4d95-a871-3d50a706a3c8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/30c28a37-2abd-409d-8902-c8c0f479f96d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c9b755f5-bd84-47cb-a8af-67364e6bd292"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=84e9469f-73ed-4e3c-b0dd-fb41cd9b213e"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1261, 24, 1.9032513877874702, 407.05392545598687, 107, 4275, 130.0, 1137.8, 1390.8999999999985, 1826.5199999999995, 5.01373708296721, 707.2473829216848, 3.6584488527249523], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 1959.9444444444441, 1555, 4756, 1880.5, 2333.0, 2434.25, 4756.0, 0.2380123325649355, 286.40772156496416, 1.1703047797504398], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d516ac79-3b3d-4e9c-a058-98d78c677d53", 3, 0, 0.0, 317.6666666666667, 229, 491, 233.0, 491.0, 491.0, 491.0, 0.026084461486292617, 0.026160880807053238, 0.016727340210936345], "isController": false}, {"data": ["deleteBook", 15, 3, 20.0, 496.20000000000005, 118, 789, 503.0, 768.0, 789.0, 789.0, 0.08717737107919774, 0.017741957161039854, 0.05841905472123583], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, 20.0, 496.20000000000005, 118, 789, 503.0, 768.0, 789.0, 789.0, 0.09002952968573692, 0.018322416002448803, 0.060330335224953784], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 282.8666666666667, 112, 459, 327.0, 388.80000000000007, 459.0, 459.0, 0.09350338482253058, 0.05310700059842166, 0.05175558448965853], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 160.06666666666666, 114, 341, 116.0, 340.4, 341.0, 341.0, 0.0933701004039813, 0.06938930313225564, 0.046867413679342176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 319.40000000000003, 113, 1019, 115.0, 935.6, 1019.0, 1019.0, 0.09350105344520214, 5.518644012660043, 0.053452653014473966], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 367.4, 109, 1359, 116.0, 1218.0, 1359.0, 1359.0, 0.09350513343182541, 16.84737872968601, 0.05336367185308473], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/65081427-434e-4c9d-8bae-7ebb1ae4b1ad", 3, 0, 0.0, 877.3333333333334, 453, 1600, 579.0, 1600.0, 1600.0, 1600.0, 0.018861874493087124, 0.022294097097786247, 0.012095668213340375], "isController": false}, {"data": ["goToProfile", 15, 3, 20.0, 246.7333333333333, 113, 579, 225.0, 527.4000000000001, 579.0, 579.0, 0.08728745504696064, 0.1580323461849563, 0.05641292749031109], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c14f91af-5e1f-45c9-a4f3-a2c7fa64384c", 1, 0, 0.0, 620.0, 620, 620, 620.0, 620.0, 620.0, 620.0, 1.6129032258064515, 0.2913936491935484, 1.1120211693548387], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 127.61111111111113, 109, 341, 116.0, 143.0000000000003, 341.0, 341.0, 0.1279290420246903, 0.09507226658280207, 0.06421438242254962], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 152.33333333333334, 109, 344, 115.0, 342.2, 344.0, 344.0, 0.12772479564032696, 0.03417636133344687, 0.07284304751362398], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d11ac095-328e-4547-9c30-adfbc23a40a3", 1, 0, 0.0, 721.0, 721, 721, 721.0, 721.0, 721.0, 721.0, 1.3869625520110958, 0.2505742891816921, 0.956245665742025], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 873.8, 673, 996, 903.0, 996.0, 996.0, 996.0, 0.07270083605961468, 21.376459696474008, 0.041462195565248994], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1167.4, 1002, 1337, 1134.0, 1337.0, 1337.0, 1337.0, 0.07200564524258703, 64.79080616170309, 0.0409954015394807], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/835e5fca-f4ea-433f-a9a5-170d9dd773df", 3, 0, 0.0, 1104.3333333333333, 232, 2654, 427.0, 2654.0, 2654.0, 2654.0, 0.025617378829798133, 0.02569242974433856, 0.01642781129384841], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 202.6, 110, 349, 116.0, 349.0, 349.0, 349.0, 0.0732955128487034, 0.1296987004705572, 0.040584527133998856], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e45f03ef-1987-4ed6-99a0-753b3d6eab87", 1, 0, 0.0, 317.0, 317, 317, 317.0, 317.0, 317.0, 317.0, 3.1545741324921135, 1.0073688880126184, 1.882270307570978], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 9, 0, 0.0, 115.22222222222221, 110, 120, 116.0, 120.0, 120.0, 120.0, 0.07119014095647909, 0.05290595436316464, 0.03573411372229517], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 9, 0, 0.0, 187.33333333333331, 108, 341, 116.0, 341.0, 341.0, 341.0, 0.0711974622060138, 0.030932577980998188, 0.03994041662381634], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=510bc9b1-f414-46cc-a5f6-1139cf30cdf1", 1, 0, 0.0, 426.0, 426, 426, 426.0, 426.0, 426.0, 426.0, 2.347417840375587, 0.42409404342723006, 1.6184345657276995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 9, 0, 0.0, 262.22222222222223, 108, 1242, 115.0, 1242.0, 1242.0, 1242.0, 0.07107545053938369, 7.123007974764266, 0.04110591920300728], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 9, 0, 0.0, 250.11111111111111, 109, 674, 120.0, 674.0, 674.0, 674.0, 0.07106703200385342, 2.338811704937579, 0.041170451808655965], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 160.2, 113, 340, 116.0, 340.0, 340.0, 340.0, 0.07329873632978567, 0.05447298666695986, 0.04115895838830739], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 127.72222222222223, 110, 342, 115.0, 149.40000000000032, 342.0, 342.0, 0.12793540683459373, 0.03448259012338659, 0.07521202628361859], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 856.4375, 113, 1466, 1098.5, 1442.9, 1466.0, 1466.0, 0.08447908086760016, 47.51755457150627, 0.045127009018141886], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 152.11111111111111, 109, 343, 115.0, 341.2, 343.0, 343.0, 0.12793267898137156, 0.034481854881697804, 0.07533535686110064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 559.0, 110, 972, 672.5, 969.9, 972.0, 972.0, 0.08448041902287835, 15.53356892150185, 0.045210224242712246], "isController": false}, {"data": ["deleteBooks", 15, 3, 20.0, 485.9333333333334, 120, 934, 471.0, 842.2, 934.0, 934.0, 0.09000522030277755, 0.018317468663182464, 0.06077110284896524], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/e644df3c-9d30-487c-ad37-0342216d2930", 3, 0, 0.0, 313.6666666666667, 222, 478, 241.0, 478.0, 478.0, 478.0, 0.02432557347539468, 0.02455520942291631, 0.015599407469572762], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 9, 0, 0.0, 431.8888888888889, 232, 1358, 236.0, 1358.0, 1358.0, 1358.0, 0.07099919534245279, 9.535555558842555, 0.1576604310637257], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/febc02fe-53d2-459c-9b0b-755d2479af9b", 1, 0, 0.0, 201.0, 201, 201, 201.0, 201.0, 201.0, 201.0, 4.975124378109452, 1.5887360074626864, 2.96855565920398], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e823cb7b-0d7d-4c6b-997b-8b4c07d2097c", 1, 0, 0.0, 464.0, 464, 464, 464.0, 464.0, 464.0, 464.0, 2.155172413793103, 0.3893622036637931, 1.4858903556034482], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 774.7619047619047, 133, 1899, 727.0, 1412.4, 1853.7999999999993, 1899.0, 0.10145956836200774, 0.06232233251924108, 0.045874785304306234], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 116.62499999999999, 109, 130, 115.5, 127.2, 130.0, 130.0, 0.0844768507030058, 0.06278015955565176, 0.0424034192005322], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 233.0625, 108, 454, 219.5, 383.30000000000007, 454.0, 454.0, 0.08448041902287835, 0.10190863046680712, 0.04374584197937622], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c9b755f5-bd84-47cb-a8af-67364e6bd292", 1, 0, 0.0, 471.0, 471, 471, 471.0, 471.0, 471.0, 471.0, 2.1231422505307855, 0.3835755042462845, 1.463807059447983], "isController": false}, {"data": ["login", 21, 0, 0.0, 2997.7142857142862, 1624, 4709, 3028.0, 4108.0, 4649.699999999999, 4709.0, 0.10041696951149534, 28.741326895190987, 0.19115367591857618], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/9d7f45f4-d77e-4a64-9420-298aa39a1165", 1, 0, 0.0, 325.0, 325, 325, 325.0, 325.0, 325.0, 325.0, 3.076923076923077, 0.9825721153846153, 1.8359375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 139.11111111111111, 112, 351, 118.0, 232.2000000000002, 351.0, 351.0, 0.12908315106314316, 0.10450188694467354, 0.04588502635447668], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/84e9469f-73ed-4e3c-b0dd-fb41cd9b213e", 3, 0, 0.0, 500.3333333333333, 296, 712, 493.0, 712.0, 712.0, 712.0, 0.030298133634968086, 0.025258307369516037, 0.019429467207320028], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 995.5625, 226, 1580, 1219.0, 1557.6, 1580.0, 1580.0, 0.08442648036556666, 63.17620540237132, 0.17637631652542818], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 640.6666666666666, 230, 1476, 459.0, 1336.2, 1476.0, 1476.0, 0.09330273003788091, 22.440181287204464, 0.20506555099927223], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 6, 54.54545454545455, 666.5454545454545, 113, 1576, 117.0, 1551.2, 1576.0, 1576.0, 0.1265691700514331, 68.84607750635722, 0.17547089484403225], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=04942c34-b7bd-4d95-a871-3d50a706a3c8", 1, 0, 0.0, 457.0, 457, 457, 457.0, 457.0, 457.0, 457.0, 2.1881838074398248, 0.3953261761487965, 1.5086501641137855], "isController": false}, {"data": ["register", 23, 5, 21.73913043478261, 1141.2173913043475, 136, 1961, 1149.0, 1692.6000000000001, 1918.5999999999995, 1961.0, 0.09691923256823325, 0.03068231139728036, 0.04372723188137086], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 307.55555555555554, 220, 683, 233.0, 487.70000000000033, 683.0, 683.0, 0.12761613067891783, 0.19778007752679938, 0.28701166889994895], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 138.0769230769231, 109, 361, 118.0, 270.5999999999999, 361.0, 361.0, 0.08693268066951539, 0.06749168079322727, 0.030901851331741798], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d516ac79-3b3d-4e9c-a058-98d78c677d53", 1, 0, 0.0, 516.0, 516, 516, 516.0, 516.0, 516.0, 516.0, 1.937984496124031, 0.35012415213178294, 1.3361494670542635], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=65081427-434e-4c9d-8bae-7ebb1ae4b1ad", 1, 0, 0.0, 626.0, 626, 626, 626.0, 626.0, 626.0, 626.0, 1.5974440894568689, 0.2886007388178914, 1.1013628194888179], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 20, 0, 0.0, 357.05, 225, 1842, 232.0, 458.8, 1772.849999999999, 1842.0, 0.12118788363539414, 7.427568700275097, 0.2710040378287979], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 117.0909090909091, 110, 134, 116.0, 131.4, 134.0, 134.0, 0.05454644629902362, 0.04053695862652048, 0.027379759177439587], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 153.54545454545456, 110, 334, 115.0, 333.0, 334.0, 334.0, 0.054487814543293045, 0.014579747250842085, 0.031075081731721816], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 175.45454545454544, 111, 343, 115.0, 343.0, 343.0, 343.0, 0.05448538553363482, 0.014685514069612509, 0.03203144735473453], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 154.18181818181816, 108, 341, 115.0, 338.2, 341.0, 341.0, 0.05454888075614667, 0.014702628016305157, 0.03212204599214496], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 121.0, 120, 123, 120.0, 123.0, 123.0, 123.0, 0.06999206756567589, 0.020642191801595818, 0.043266580829172695], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1371.6851851851852, 885, 4275, 1256.0, 1822.5, 1950.25, 4275.0, 0.240497027189525, 287.7180548132808, 0.474887684548066], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b85c443d-113b-4f2e-a6d4-f035afe06ead", 1, 0, 0.0, 320.0, 320, 320, 320.0, 320.0, 320.0, 320.0, 3.125, 0.9979248046875, 1.8646240234375], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, 21.73913043478261, 1141.2173913043475, 136, 1961, 1149.0, 1692.6000000000001, 1918.5999999999995, 1961.0, 0.0971353517777881, 0.030750729570957376, 0.043824738790369244], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c14f91af-5e1f-45c9-a4f3-a2c7fa64384c", 3, 0, 0.0, 383.0, 247, 505, 397.0, 505.0, 505.0, 505.0, 0.05178485120486087, 0.03329266963854174, 0.03320838439895049], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 114.49999999999999, 108, 123, 115.0, 123.0, 123.0, 123.0, 0.036806823985166846, 0.009920589277252003, 0.021674330920952743], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 141.375, 109, 338, 114.0, 338.0, 338.0, 338.0, 0.036806823985166846, 0.009920589277252003, 0.02163838675690473], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=30c28a37-2abd-409d-8902-c8c0f479f96d", 1, 0, 0.0, 402.0, 402, 402, 402.0, 402.0, 402.0, 402.0, 2.487562189054726, 0.4494130907960199, 1.7150575248756217], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 146.46153846153848, 108, 342, 113.0, 334.8, 342.0, 342.0, 0.08201323567449578, 0.022105129927891442, 0.04821481237895162], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 164.6153846153846, 107, 344, 115.0, 342.4, 344.0, 344.0, 0.0818938907157526, 0.022072962731980197, 0.0482246250992176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 113.5, 111, 117, 113.0, 117.0, 117.0, 117.0, 0.03680750136877895, 0.009848882202192806, 0.020991778124381747], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 131.3846153846154, 109, 327, 115.0, 245.79999999999993, 327.0, 327.0, 0.08201375307551574, 0.06094967391647215, 0.04116705964923349], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 117.75, 109, 133, 115.5, 133.0, 133.0, 133.0, 0.036805977290712014, 0.027352879607648282, 0.018474875319751928], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 184.46153846153848, 110, 344, 116.0, 343.6, 344.0, 344.0, 0.0818938907157526, 0.021913013726675992, 0.04670510954882766], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 146.375, 115, 328, 120.5, 328.0, 328.0, 328.0, 0.03756803336041362, 0.029570151258294316, 0.01335426185858453], "isController": false}, {"data": ["deleteAccount", 14, 3, 21.428571428571427, 414.3571428571429, 114, 712, 459.5, 673.5, 712.0, 712.0, 0.09037213956040409, 0.018010128538230644, 0.06149415606945745], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1476.5714285714284, 944, 2641, 1374.0, 2263.4000000000005, 2614.0999999999995, 2641.0, 0.10013828620475895, 0.0518293864145725, 0.04605970000238424], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 262.625, 225, 462, 232.0, 462.0, 462.0, 462.0, 0.03678651406394416, 0.05701191193308533, 0.08273373231373378], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/510bc9b1-f414-46cc-a5f6-1139cf30cdf1", 3, 0, 0.0, 348.3333333333333, 244, 466, 335.0, 466.0, 466.0, 466.0, 0.03438080176029705, 0.028661859800820557, 0.02204758446216966], "isController": false}, {"data": ["addBook", 56, 7, 12.5, 1172.4821428571424, 582, 2734, 961.0, 2032.8, 2105.0499999999993, 2734.0, 0.2741751489603376, 88.95160498796812, 0.995864346337069], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d11ac095-328e-4547-9c30-adfbc23a40a3", 3, 0, 0.0, 596.0, 225, 928, 635.0, 928.0, 928.0, 928.0, 0.027816153767698026, 0.02789764640568933, 0.017837832982540727], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 245.6296296296297, 110, 3220, 116.0, 460.5, 501.75, 3220.0, 0.24159560474959063, 0.17954517110785007, 0.11678693784281968], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=835e5fca-f4ea-433f-a9a5-170d9dd773df", 1, 0, 0.0, 934.0, 934, 934, 934.0, 934.0, 934.0, 934.0, 1.0706638115631693, 0.1934304737687366, 0.738172510706638], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 700.537037037037, 536, 1030, 671.0, 990.0, 1025.25, 1030.0, 0.24452756369037376, 71.89922280423305, 0.12298017119193602], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e644df3c-9d30-487c-ad37-0342216d2930", 1, 0, 0.0, 781.0, 781, 781, 781.0, 781.0, 781.0, 781.0, 1.2804097311139564, 0.23132402368758, 0.882782490396927], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 183.94444444444446, 108, 449, 117.5, 343.5, 349.0, 449.0, 0.2450301977030688, 0.4335885920292584, 0.11916507661731275], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1124.5740740740744, 769, 1556, 1079.5, 1380.0, 1460.0, 1556.0, 0.2440313987066336, 219.57988151767196, 0.12249232317891569], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 20, 0, 0.0, 141.9, 111, 351, 118.0, 310.5000000000004, 349.9, 351.0, 0.13286211569633033, 0.09925734229266867, 0.047228330188929926], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 166, 7, 4.216867469879518, 182.75903614457832, 110, 982, 122.0, 329.0000000000001, 384.85, 775.6400000000039, 0.693745011095741, 1.5315699363405368, 0.3328167248966696], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 141.81818181818184, 114, 360, 118.0, 313.8000000000002, 360.0, 360.0, 0.05553339829058103, 0.04300584457463941, 0.019740387673604975], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 120.19999999999999, 111, 129, 120.0, 127.8, 129.0, 129.0, 0.09198503710063163, 0.07464801350646962, 0.03269780615686515], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 314.9090909090909, 227, 457, 240.0, 457.0, 457.0, 457.0, 0.05445382810411572, 0.08439279804807778, 0.12246793566775244], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e823cb7b-0d7d-4c6b-997b-8b4c07d2097c", 2, 0, 0.0, 226.5, 213, 240, 226.5, 240.0, 240.0, 240.0, 0.021207558373804423, 0.029802418456938054, 0.013182237211842302], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 350.3076923076923, 225, 668, 235.0, 587.9999999999999, 668.0, 668.0, 0.08183615143465069, 0.12683005110038148, 0.18405142261132862], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 9, 0, 0.0, 117.33333333333333, 114, 121, 116.0, 121.0, 121.0, 121.0, 0.06802258349772125, 0.0563976302632474, 0.0241799027277056], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/04942c34-b7bd-4d95-a871-3d50a706a3c8", 3, 0, 0.0, 303.6666666666667, 210, 486, 215.0, 486.0, 486.0, 486.0, 0.06205270342944608, 0.028077232346005877, 0.03979291202995078], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/30c28a37-2abd-409d-8902-c8c0f479f96d", 3, 0, 0.0, 327.0, 242, 424, 315.0, 424.0, 424.0, 424.0, 0.022590361445783132, 0.026701042451054216, 0.014486657567771084], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c9b755f5-bd84-47cb-a8af-67364e6bd292", 3, 0, 0.0, 338.0, 213, 484, 317.0, 484.0, 484.0, 484.0, 0.0560245013819377, 0.036018356194442366, 0.0359271704825577], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 133.625, 111, 331, 119.5, 202.90000000000015, 331.0, 331.0, 0.0830224316232442, 0.06445589173874916, 0.029511879991075088], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 20, 0, 0.0, 125.80000000000001, 109, 346, 115.0, 124.10000000000002, 334.9499999999998, 346.0, 0.12127386063207936, 0.09012637494239492, 0.06087379332508671], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 20, 0, 0.0, 147.55, 107, 343, 115.0, 340.20000000000005, 342.95, 343.0, 0.12127165456981912, 0.041556858973192896, 0.06865349429113686], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=84e9469f-73ed-4e3c-b0dd-fb41cd9b213e", 1, 0, 0.0, 508.0, 508, 508, 508.0, 508.0, 508.0, 508.0, 1.968503937007874, 0.35563791830708663, 1.357191190944882], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 20, 0, 0.0, 217.00000000000006, 109, 1495, 115.0, 343.8, 1437.4499999999991, 1495.0, 0.12127165456981912, 5.48707457335116, 0.07077337965910538], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 20, 0, 0.0, 176.84999999999997, 109, 904, 115.5, 341.7, 875.8999999999996, 904.0, 0.12127091923356778, 1.8139358287351444, 0.07089137915352899], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 20.833333333333332, 0.3965107057890563], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 12.5, 0.23790642347343377], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 12.5, 0.23790642347343377], "isController": false}, {"data": ["401/Unauthorized", 13, 54.166666666666664, 1.0309278350515463], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1261, 24, "401/Unauthorized", 13, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 166, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
