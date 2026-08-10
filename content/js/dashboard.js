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

    var data = {"OkPercent": 97.51506024096386, "KoPercent": 2.4849397590361444};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7134067357512953, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c6ce912b-b6c3-4297-a5dc-0df17a1877c1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3f68fec0-93c1-4af1-b5b1-e2a572b08b93"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/2cbcbc45-a63d-4372-a187-a3d9e5e108a6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.31896551724137934, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.041666666666666664, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8612ed58-dfe0-4e03-93c6-a0023e71de80"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/71966385-39ff-4c6b-923e-cb89c3a39194"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.39285714285714285, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.025, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.75, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8636363636363636, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/8612ed58-dfe0-4e03-93c6-a0023e71de80"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/dae3e214-50ab-41f4-9e4a-4db045dd9f38"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/9beb9cfe-99f9-48b5-a468-8b78943be838"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3f68fec0-93c1-4af1-b5b1-e2a572b08b93"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.31896551724137934, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/869b00d8-f87b-4d8d-b89f-46945ee17027"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2cbcbc45-a63d-4372-a187-a3d9e5e108a6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c6ce912b-b6c3-4297-a5dc-0df17a1877c1"], "isController": false}, {"data": [0.9137931034482759, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9beb9cfe-99f9-48b5-a468-8b78943be838"], "isController": false}, {"data": [0.49137931034482757, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dae3e214-50ab-41f4-9e4a-4db045dd9f38"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=869b00d8-f87b-4d8d-b89f-46945ee17027"], "isController": false}, {"data": [0.3706896551724138, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.39285714285714285, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9224137931034483, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/629ab39a-2004-4b42-bb93-e7cbc436a309"], "isController": false}, {"data": [0.55, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/5353b5bf-1c2e-496f-8307-7292edd2c776"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d0cb74ef-a3d3-4207-a62f-4bf6facd058a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/02553dee-3586-46e9-8d26-53ae5910b2ab"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5353b5bf-1c2e-496f-8307-7292edd2c776"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.4375, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=629ab39a-2004-4b42-bb93-e7cbc436a309"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/34176c4a-22d5-4b70-9c19-d29ec6ad96ee"], "isController": false}, {"data": [0.7380952380952381, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.07692307692307693, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/d0cb74ef-a3d3-4207-a62f-4bf6facd058a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.041666666666666664, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=34176c4a-22d5-4b70-9c19-d29ec6ad96ee"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1328, 33, 2.4849397590361444, 491.5406626506015, 0, 5222, 156.0, 1374.1000000000001, 1656.7499999999998, 2387.5300000000016, 5.185211215361969, 722.7485973903609, 3.802166152001265], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 1, 1.7241379310344827, 2260.913793103449, 1694, 3266, 2235.5, 2838.2, 2965.849999999999, 3266.0, 0.25241864938614395, 303.7519376803379, 1.2385777501120652], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 344.5, 282, 564, 286.0, 561.5, 564.0, 564.0, 0.0776798149000982, 0.12038854125630455, 0.17470372433098258], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 150.23529411764707, 142, 191, 147.0, 167.79999999999998, 191.0, 191.0, 0.12662470671483372, 0.09830726742020782, 0.04501112621503855], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c6ce912b-b6c3-4297-a5dc-0df17a1877c1", 3, 0, 0.0, 445.6666666666667, 301, 648, 388.0, 648.0, 648.0, 648.0, 0.018422199979121506, 0.025396489880071475, 0.011813715481402788], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3f68fec0-93c1-4af1-b5b1-e2a572b08b93", 3, 0, 0.0, 427.0, 256, 722, 303.0, 722.0, 722.0, 722.0, 0.01780531666755693, 0.02454606643460404, 0.011418122993192434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 534.3333333333333, 282, 1530, 560.0, 951.6000000000004, 1530.0, 1530.0, 0.1381024720342494, 11.214334317313448, 0.3082400422363394], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2cbcbc45-a63d-4372-a187-a3d9e5e108a6", 3, 0, 0.0, 674.0, 481, 998, 543.0, 998.0, 998.0, 998.0, 0.020608217183131487, 0.024358215036442196, 0.013215555941005543], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 171.9, 139, 422, 141.0, 397.0000000000001, 422.0, 422.0, 0.05543237250554324, 0.04119534714523281, 0.027824452605321508], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 177.9, 138, 418, 142.0, 398.80000000000007, 418.0, 418.0, 0.05543083617416369, 0.02315753097197971, 0.031147366342396274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 350.59999999999997, 139, 1672, 142.0, 1547.3000000000004, 1672.0, 1672.0, 0.05543022166545644, 5.001067248291363, 0.03211055419135621], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 252.40000000000003, 138, 694, 142.5, 666.3000000000001, 694.0, 694.0, 0.05543022166545644, 1.6432787218622336, 0.032164685267201384], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 155.33333333333334, 142, 180, 144.0, 180.0, 180.0, 180.0, 0.07988496564946476, 0.02355982385365074, 0.049382014898546094], "isController": false}, {"data": ["https://demoqa.com/books", 58, 1, 1.7241379310344827, 1509.0689655172412, 1110, 2644, 1397.5, 2234.4, 2285.75, 2644.0, 0.2511061659551992, 299.1454281157188, 0.4936591972503875], "isController": false}, {"data": ["deleteBook", 14, 3, 21.428571428571427, 747.6428571428571, 148, 1665, 661.0, 1511.0, 1665.0, 1665.0, 0.09981961170171048, 0.02047778166955431, 0.0668226013882056], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, 21.428571428571427, 747.6428571428571, 148, 1665, 661.0, 1511.0, 1665.0, 1665.0, 0.10158177332752866, 0.020839285390364243, 0.0680022515781454], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 10, 41.666666666666664, 1469.5416666666667, 278, 3226, 1573.5, 2593.0, 3171.0, 3226.0, 0.09370863642220426, 0.029009411861170654, 0.04227870119829919], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 21, 0, 0.0, 236.95238095238096, 138, 427, 142.0, 422.8, 426.6, 427.0, 0.102643811311348, 0.02746523857354429, 0.058539048638503156], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 11, 0, 0.0, 192.1818181818182, 139, 425, 141.0, 424.2, 425.0, 425.0, 0.0625995902572274, 0.016872545811518324, 0.0368628446534259], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8612ed58-dfe0-4e03-93c6-a0023e71de80", 1, 0, 0.0, 1005.0, 1005, 1005, 1005.0, 1005.0, 1005.0, 1005.0, 0.9950248756218905, 0.179765236318408, 0.6860230099502488], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 21, 0, 0.0, 168.71428571428575, 138, 425, 142.0, 368.0000000000002, 424.8, 425.0, 0.10264130286027097, 0.07627932761393184, 0.05152112272478445], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 11, 0, 0.0, 165.54545454545453, 138, 421, 141.0, 365.0000000000002, 421.0, 421.0, 0.06259923401300926, 0.0168724497925689, 0.03680150280842927], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/71966385-39ff-4c6b-923e-cb89c3a39194", 1, 0, 0.0, 516.0, 516, 516, 516.0, 516.0, 516.0, 516.0, 1.937984496124031, 0.6188680959302325, 1.1563559835271318], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 21, 0, 0.0, 171.7142857142857, 139, 423, 142.0, 377.40000000000015, 422.5, 423.0, 0.10264280791620436, 0.02766544432116446, 0.060442981614718005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 21, 0, 0.0, 224.42857142857144, 138, 425, 142.0, 422.0, 424.7, 425.0, 0.102643811311348, 0.027665714767511767, 0.06034333438421045], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 207.58823529411768, 137, 424, 142.0, 422.4, 424.0, 424.0, 0.11471759228018086, 0.030919976044267494, 0.0674413970240907], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 247.64705882352942, 138, 1127, 142.0, 562.1999999999995, 1127.0, 1127.0, 0.1147183664104623, 2.013278334592986, 0.06697396357017053], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 11, 0, 0.0, 190.81818181818184, 138, 418, 141.0, 418.0, 418.0, 418.0, 0.0625995902572274, 0.016750280986797178, 0.035701328818575004], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 141.88235294117646, 138, 146, 142.0, 145.2, 146.0, 146.0, 0.11471372178548533, 0.08525111550659605, 0.05758091113060495], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 11, 0, 0.0, 191.45454545454547, 140, 417, 141.0, 416.8, 417.0, 417.0, 0.06259709663284527, 0.04651991263437036, 0.03142080827078366], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 190.5294117647059, 138, 425, 141.0, 423.4, 425.0, 425.0, 0.11471604405096092, 0.030695503974573525, 0.06542399387281364], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 11, 0, 0.0, 174.45454545454547, 144, 423, 149.0, 370.0000000000002, 423.0, 423.0, 0.0590356790176463, 0.04646753641428019, 0.02098533902580396], "isController": false}, {"data": ["deleteAccount", 14, 3, 21.428571428571427, 575.7142857142857, 141, 1247, 582.5, 1122.5, 1247.0, 1247.0, 0.10337825364592948, 0.020602097563226878, 0.0703442288166882], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 2272.7999999999993, 1379, 5222, 1965.0, 3234.0, 5122.949999999999, 5222.0, 0.08861477385509713, 0.04586506849922019, 0.04075933445874096], "isController": false}, {"data": ["goToProfile", 14, 3, 21.428571428571427, 293.6428571428571, 141, 543, 286.0, 521.5, 543.0, 543.0, 0.09972788534142554, 0.21924691422333348, 0.06445165022937413], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 11, 0, 0.0, 410.54545454545456, 281, 843, 285.0, 841.8, 843.0, 843.0, 0.06254655453775253, 0.09693494340958327, 0.14066866709027742], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8612ed58-dfe0-4e03-93c6-a0023e71de80", 3, 0, 0.0, 551.6666666666666, 500, 631, 524.0, 631.0, 631.0, 631.0, 0.030195364005113082, 0.030283826985596812, 0.019363563505883065], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dae3e214-50ab-41f4-9e4a-4db045dd9f38", 3, 0, 0.0, 749.6666666666666, 275, 1396, 578.0, 1396.0, 1396.0, 1396.0, 0.03777671443322336, 0.023499772552698518, 0.02422530189890951], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9beb9cfe-99f9-48b5-a468-8b78943be838", 3, 0, 0.0, 1694.0, 327, 4246, 509.0, 4246.0, 4246.0, 4246.0, 0.033714683868647594, 0.028106544722528153, 0.021620419017329348], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 141.35714285714286, 138, 144, 142.0, 143.5, 144.0, 144.0, 0.07774106671849404, 0.05777436696559957, 0.03902237138018158], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 181.7142857142857, 140, 421, 142.0, 418.0, 421.0, 421.0, 0.07774149841185225, 0.0208019243797339, 0.04433694831300948], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 1037.1428571428573, 827, 1122, 1119.0, 1122.0, 1122.0, 1122.0, 0.0609973945398618, 17.93525929883495, 0.03478757657351493], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3f68fec0-93c1-4af1-b5b1-e2a572b08b93", 1, 0, 0.0, 712.0, 712, 712, 712.0, 712.0, 712.0, 712.0, 1.4044943820224718, 0.25374166081460675, 0.9683330407303371], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1375.0, 1117, 1546, 1519.0, 1546.0, 1546.0, 1546.0, 0.060994205550472705, 54.88269337069229, 0.034726193199146084], "isController": false}, {"data": ["addBook", 58, 9, 15.517241379310345, 1341.7068965517242, 733, 3651, 1150.0, 2459.2, 2763.1, 3651.0, 0.2665281945472008, 67.00232591084861, 0.9726089146788105], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 299.7142857142857, 140, 422, 412.0, 422.0, 422.0, 422.0, 0.06136582800035066, 0.10858875032874551, 0.03397893015253792], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/869b00d8-f87b-4d8d-b89f-46945ee17027", 3, 0, 0.0, 429.0, 275, 634, 378.0, 634.0, 634.0, 634.0, 0.030565149616407373, 0.025480907606646903, 0.019600698158959155], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 142.66666666666666, 140, 148, 142.0, 147.4, 148.0, 148.0, 0.0649340108115128, 0.04825662326910277, 0.032593829645622636], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2cbcbc45-a63d-4372-a187-a3d9e5e108a6", 1, 0, 0.0, 619.0, 619, 619, 619.0, 619.0, 619.0, 619.0, 1.6155088852988693, 0.29186439822294025, 1.113817649434572], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 165.33333333333331, 138, 439, 141.0, 350.20000000000033, 439.0, 439.0, 0.06493682188370897, 0.017375673043101815, 0.03703428123055278], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 165.08333333333331, 140, 421, 142.0, 337.9000000000003, 421.0, 421.0, 0.06493541631718787, 0.017502123929242042, 0.03817492248334677], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c6ce912b-b6c3-4297-a5dc-0df17a1877c1", 1, 0, 0.0, 989.0, 989, 989, 989.0, 989.0, 989.0, 989.0, 1.0111223458038423, 0.18267347067745196, 0.6971214610717897], "isController": false}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 230.6206896551724, 139, 593, 143.0, 564.2, 570.0, 593.0, 0.2527475400692005, 0.1878328886647086, 0.12217776595142017], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 188.49999999999997, 140, 421, 143.0, 420.1, 421.0, 421.0, 0.06493576770311367, 0.017502218638729857, 0.03823854289548588], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9beb9cfe-99f9-48b5-a468-8b78943be838", 1, 0, 0.0, 548.0, 548, 548, 548.0, 548.0, 548.0, 548.0, 1.8248175182481752, 0.3296789461678832, 1.2581261405109487], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 1, 1.7241379310344827, 915.0689655172414, 0, 1308, 841.5, 1253.4, 1272.25, 1308.0, 0.25216843112106263, 72.87569580688464, 0.12463638698071781], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 225.0, 140, 446, 142.0, 446.0, 446.0, 446.0, 0.061516829246858244, 0.045717096735213986, 0.03454314142279638], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dae3e214-50ab-41f4-9e4a-4db045dd9f38", 1, 0, 0.0, 871.0, 871, 871, 871.0, 871.0, 871.0, 871.0, 1.1481056257175661, 0.20742142652123996, 0.7915650114810563], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 189.01724137931032, 139, 487, 145.0, 424.0, 432.05, 487.0, 0.2532441448207206, 0.4481234281397908, 0.12315975011788952], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 962.9999999999999, 139, 1669, 1248.0, 1650.8, 1669.0, 1669.0, 0.08683099432342375, 48.84045220292946, 0.046383353413000775], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 142.2142857142857, 137, 151, 142.0, 149.5, 151.0, 151.0, 0.07774149841185225, 0.02095376324381955, 0.045703498089780324], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=869b00d8-f87b-4d8d-b89f-46945ee17027", 1, 0, 0.0, 1077.0, 1077, 1077, 1077.0, 1077.0, 1077.0, 1077.0, 0.9285051067780873, 0.16774750464252555, 0.640160747446611], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 1273.5344827586214, 964, 2080, 1257.0, 1653.4, 1696.9999999999998, 2080.0, 0.2517492230498116, 226.52439342815163, 0.12636630922617498], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 767.5625, 139, 1265, 1099.0, 1254.5, 1265.0, 1265.0, 0.08683146555232953, 15.965860140287088, 0.04646840148698885], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 160.5, 138, 420, 140.5, 282.0, 420.0, 420.0, 0.07774149841185225, 0.02095376324381955, 0.04577941752182315], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 167.26666666666665, 141, 423, 147.0, 267.6000000000001, 423.0, 423.0, 0.12916781482502068, 0.09649743978627032, 0.04591512167608156], "isController": false}, {"data": ["deleteBooks", 14, 3, 21.428571428571427, 658.0714285714286, 142, 1077, 723.5, 1041.0, 1077.0, 1077.0, 0.10145368639216197, 0.02081300862718669, 0.068397731513689], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 9, 5.172413793103448, 225.3793103448276, 139, 1644, 152.5, 390.5, 478.25, 928.5, 0.7327827636017537, 1.588136045699955, 0.3506397767328838], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 205.3, 146, 424, 151.5, 423.7, 424.0, 424.0, 0.05500882891704119, 0.04259961067501334, 0.019553919654104485], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 356.83333333333337, 282, 582, 289.0, 576.3000000000001, 582.0, 582.0, 0.06488415474870907, 0.10055776717402472, 0.14592598475222365], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 21, 0, 0.0, 166.71428571428572, 141, 475, 146.0, 217.00000000000006, 450.49999999999966, 475.0, 0.10152235183779629, 0.08238776794649288, 0.03608802350484165], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/629ab39a-2004-4b42-bb93-e7cbc436a309", 3, 0, 0.0, 450.0, 328, 587, 435.0, 587.0, 587.0, 587.0, 0.026133087101579307, 0.02620964888019722, 0.016758522653031002], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 943.15, 162, 2816, 790.0, 1561.3, 2753.349999999999, 2816.0, 0.08646068848646242, 0.05310915337693834, 0.039093065204328224], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 161.12500000000003, 140, 419, 141.5, 247.50000000000017, 419.0, 419.0, 0.08683099432342375, 0.06452967449231004, 0.04358508894749981], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 247.37499999999997, 139, 428, 142.5, 426.6, 428.0, 428.0, 0.08683146555232953, 0.10474469514015142, 0.04496326621984642], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5353b5bf-1c2e-496f-8307-7292edd2c776", 3, 0, 0.0, 1418.0, 269, 2738, 1247.0, 2738.0, 2738.0, 2738.0, 0.018582985418550774, 0.025618145588399265, 0.011916823331557627], "isController": false}, {"data": ["login", 20, 0, 0.0, 4524.15, 2859, 6500, 4811.5, 6423.6, 6496.3, 6500.0, 0.08669868738187303, 36.418744601652044, 0.18112744327738378], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 552.0, 282, 1811, 303.5, 1714.1000000000004, 1811.0, 1811.0, 0.05538662634520269, 6.703420669388919, 0.1231487020144116], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 167.99999999999997, 142, 419, 146.5, 299.0, 419.0, 419.0, 0.07947907145736231, 0.06434389671694664, 0.028252326182109263], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 473.4117647058824, 281, 1273, 557.0, 709.7999999999995, 1273.0, 1273.0, 0.11460313608111206, 2.1579794224170477, 0.25716580335113054], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d0cb74ef-a3d3-4207-a62f-4bf6facd058a", 1, 0, 0.0, 735.0, 735, 735, 735.0, 735.0, 735.0, 735.0, 1.3605442176870748, 0.2458014455782313, 0.938031462585034], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/02553dee-3586-46e9-8d26-53ae5910b2ab", 1, 0, 0.0, 484.0, 484, 484, 484.0, 484.0, 484.0, 484.0, 2.066115702479339, 0.6597849948347108, 1.232809271694215], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5353b5bf-1c2e-496f-8307-7292edd2c776", 1, 0, 0.0, 530.0, 530, 530, 530.0, 530.0, 530.0, 530.0, 1.8867924528301887, 0.3408755896226415, 1.3008549528301887], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 147.24999999999997, 142, 158, 146.0, 156.5, 158.0, 158.0, 0.06512112529304506, 0.053992026732221934, 0.023148525006512113], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 1142.5000000000002, 282, 1812, 1390.0, 1792.4, 1812.0, 1812.0, 0.08676366120959389, 64.92511423317193, 0.18125894750256225], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 149.5, 140, 163, 148.0, 162.3, 163.0, 163.0, 0.0885661146045523, 0.06875982530333893, 0.03148248605083695], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=629ab39a-2004-4b42-bb93-e7cbc436a309", 1, 0, 0.0, 902.0, 902, 902, 902.0, 902.0, 902.0, 902.0, 1.1086474501108647, 0.2002927522172949, 0.7643604490022172], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/34176c4a-22d5-4b70-9c19-d29ec6ad96ee", 3, 0, 0.0, 684.6666666666666, 297, 1188, 569.0, 1188.0, 1188.0, 1188.0, 0.031063939943049443, 0.025896728578824746, 0.019920560445249806], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 21, 0, 0.0, 460.9047619047618, 282, 850, 555.0, 790.6000000000001, 849.7, 850.0, 0.10256961301950288, 0.15896286705268659, 0.23068146365616712], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 6, 46.15384615384615, 927.2307692307693, 141, 1938, 1264.0, 1837.6, 1938.0, 1938.0, 0.11313497001923294, 72.89407140122012, 0.171963114736265], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d0cb74ef-a3d3-4207-a62f-4bf6facd058a", 3, 0, 0.0, 903.3333333333334, 270, 1825, 615.0, 1825.0, 1825.0, 1825.0, 0.01922768787053357, 0.02650691996474924, 0.012330255568017945], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 142.0666666666667, 139, 152, 142.0, 147.2, 152.0, 152.0, 0.1382845342576886, 0.1027680962598643, 0.06941235410981636], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 293.80000000000007, 140, 487, 412.0, 448.0, 487.0, 487.0, 0.13828835888594898, 0.05084978196535416, 0.0780933089177553], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 297.3333333333333, 138, 1388, 142.0, 806.6000000000004, 1388.0, 1388.0, 0.1382845342576886, 8.330031670039274, 0.0805039261284018], "isController": false}, {"data": ["register", 24, 10, 41.666666666666664, 1469.5416666666667, 278, 3226, 1573.5, 2593.0, 3171.0, 3226.0, 0.09704341075240991, 0.030041758992689394, 0.04378325758555994], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=34176c4a-22d5-4b70-9c19-d29ec6ad96ee", 1, 0, 0.0, 759.0, 759, 759, 759.0, 759.0, 759.0, 759.0, 1.3175230566534915, 0.2380290678524374, 0.9083703886693018], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 303.7333333333333, 136, 1188, 144.0, 729.0000000000002, 1188.0, 1188.0, 0.13828708398635567, 2.7455207949202545, 0.08064045646261639], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 10, 30.303030303030305, 0.7530120481927711], "isController": false}, {"data": ["Non HTTP response code: java.lang.NullPointerException/Non HTTP response message: null", 1, 3.0303030303030303, 0.07530120481927711], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 9.090909090909092, 0.22590361445783133], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 9.090909090909092, 0.22590361445783133], "isController": false}, {"data": ["401/Unauthorized", 15, 45.45454545454545, 1.1295180722891567], "isController": false}, {"data": ["Assertion failed", 1, 3.0303030303030303, 0.07530120481927711], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1328, 33, "401/Unauthorized", 15, "406/Not Acceptable", 10, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "Non HTTP response code: java.lang.NullPointerException/Non HTTP response message: null", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/books", 58, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 10, "406/Not Acceptable", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 1, "Non HTTP response code: java.lang.NullPointerException/Non HTTP response message: null", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
