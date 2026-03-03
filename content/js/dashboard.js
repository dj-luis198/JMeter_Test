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

    var data = {"OkPercent": 97.65684051398337, "KoPercent": 2.3431594860166287};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7511297611362169, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c1b25e44-689f-4bf9-9002-bfa204728ebd"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3960e66a-9add-4285-aa1a-3088c8c9f4a3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=29163709-b1df-4fbe-8eeb-e8f07f9ead54"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ee8c8edc-a09c-4659-af9f-d2fb087122c7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=66e3300b-4788-464b-984c-21bf6682023c"], "isController": false}, {"data": [0.65625, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.65625, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d561638b-1f16-45be-a677-d93c55d998fa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b1628ff3-6b7e-44be-9c8d-1f62e0720d33"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f692c195-4243-4cf3-95bc-439e25e1c257"], "isController": false}, {"data": [0.925, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b700139d-de64-421e-9605-147f1a48e36b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.65625, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/22ea801f-fc0a-4e75-9517-2c8dab4b9988"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/176715c5-0bf9-4317-a0e5-e1302335d7b4"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/907f1b4c-6996-4337-9218-7887c12b6d61"], "isController": false}, {"data": [0.7954545454545454, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1838f381-5de5-4093-8224-cc866dcf287b"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.775, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.15384615384615385, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.6842105263157895, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6ef05611-6dc9-41d1-88cc-ae5be2076040"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b1628ff3-6b7e-44be-9c8d-1f62e0720d33"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ee8c8edc-a09c-4659-af9f-d2fb087122c7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c1b25e44-689f-4bf9-9002-bfa204728ebd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.59375, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3960e66a-9add-4285-aa1a-3088c8c9f4a3"], "isController": false}, {"data": [0.36363636363636365, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=176715c5-0bf9-4317-a0e5-e1302335d7b4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b700139d-de64-421e-9605-147f1a48e36b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/29163709-b1df-4fbe-8eeb-e8f07f9ead54"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8a6bc841-53ca-401c-8779-a3a28409429b"], "isController": false}, {"data": [0.2627118644067797, 500, 1500, "addBook"], "isController": true}, {"data": [0.9107142857142857, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9224137931034483, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/44bb6cd7-69a8-40c2-8d1d-8d4c0b5a282b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8a6bc841-53ca-401c-8779-a3a28409429b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.84375, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1838f381-5de5-4093-8224-cc866dcf287b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f692c195-4243-4cf3-95bc-439e25e1c257"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/66e3300b-4788-464b-984c-21bf6682023c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d561638b-1f16-45be-a677-d93c55d998fa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=907f1b4c-6996-4337-9218-7887c12b6d61"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1323, 31, 2.3431594860166287, 437.9153439153443, 142, 3007, 164.0, 1167.6000000000008, 1338.1999999999996, 1790.56, 5.24512952258617, 733.8069510851035, 3.8301216888385388], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c1b25e44-689f-4bf9-9002-bfa204728ebd", 1, 0, 0.0, 423.0, 423, 423, 423.0, 423.0, 423.0, 423.0, 2.3640661938534278, 0.4271018026004728, 1.6299128250591017], "isController": false}, {"data": ["see books", 56, 0, 0.0, 2183.1428571428564, 1742, 2793, 2186.0, 2560.5, 2620.85, 2793.0, 0.2458566567884974, 295.848939468774, 1.2088752606739106], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/3960e66a-9add-4285-aa1a-3088c8c9f4a3", 3, 0, 0.0, 423.6666666666667, 258, 602, 411.0, 602.0, 602.0, 602.0, 0.04455930843953302, 0.0286473418515878, 0.02857481693550783], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=29163709-b1df-4fbe-8eeb-e8f07f9ead54", 1, 0, 0.0, 323.0, 323, 323, 323.0, 323.0, 323.0, 323.0, 3.0959752321981426, 0.5593314628482972, 2.13452979876161], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ee8c8edc-a09c-4659-af9f-d2fb087122c7", 1, 0, 0.0, 781.0, 781, 781, 781.0, 781.0, 781.0, 781.0, 1.2804097311139564, 0.23132402368758, 0.882782490396927], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=66e3300b-4788-464b-984c-21bf6682023c", 1, 0, 0.0, 469.0, 469, 469, 469.0, 469.0, 469.0, 469.0, 2.1321961620469083, 0.3852112206823028, 1.4700493070362475], "isController": false}, {"data": ["deleteBook", 16, 3, 18.75, 458.1875, 150, 807, 462.5, 794.4, 807.0, 807.0, 0.08262883643105398, 0.016698246913038315, 0.055420427462210216], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, 18.75, 458.1875, 150, 807, 462.5, 794.4, 807.0, 807.0, 0.08497575535480033, 0.017172529661849605, 0.05699454196740118], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d561638b-1f16-45be-a677-d93c55d998fa", 1, 0, 0.0, 413.0, 413, 413, 413.0, 413.0, 413.0, 413.0, 2.4213075060532687, 0.4374432506053269, 1.6693780266343827], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 210.35, 146, 456, 151.5, 452.70000000000005, 455.9, 456.0, 0.10726276158705982, 0.04481153262396894, 0.06027245411835373], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b1628ff3-6b7e-44be-9c8d-1f62e0720d33", 3, 0, 0.0, 346.3333333333333, 262, 501, 276.0, 501.0, 501.0, 501.0, 0.024459047401633866, 0.028909765988063985, 0.015685001100657132], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 152.90000000000003, 144, 180, 151.0, 163.4, 179.2, 180.0, 0.10726276158705982, 0.07971382965600833, 0.05384087837475464], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 261.65, 142, 1199, 149.5, 718.3000000000006, 1176.4499999999998, 1199.0, 0.10726391212940319, 3.1799350449972112, 0.06224239901102673], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f692c195-4243-4cf3-95bc-439e25e1c257", 3, 0, 0.0, 325.3333333333333, 246, 422, 308.0, 422.0, 422.0, 422.0, 0.02176436448055717, 0.0218281272671213, 0.013956965503482298], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 318.25, 145, 1360, 150.5, 1217.0000000000014, 1356.25, 1360.0, 0.10726391212940319, 9.677645547072768, 0.06213764909683786], "isController": false}, {"data": ["goToProfile", 17, 4, 23.529411764705884, 253.47058823529412, 146, 459, 246.0, 419.79999999999995, 459.0, 459.0, 0.08040181991884146, 0.1340153496533263, 0.05196004561620901], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 198.10526315789477, 145, 449, 153.0, 445.0, 449.0, 449.0, 0.10833247807692746, 0.08050880450834161, 0.05437782590970773], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 258.6315789473684, 142, 453, 151.0, 451.0, 453.0, 453.0, 0.10833680201164335, 0.03755260036834513, 0.061306958786399746], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 861.3333333333333, 716, 1210, 742.5, 1210.0, 1210.0, 1210.0, 0.03783650844700051, 11.125189773737679, 0.02157863372367998], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1235.3333333333333, 1041, 1357, 1307.0, 1357.0, 1357.0, 1357.0, 0.03769033619779888, 33.91383076332353, 0.02145846289386401], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 200.66666666666669, 147, 453, 151.0, 453.0, 453.0, 453.0, 0.037975885312826356, 0.06719951580746227, 0.021027663058957563], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 196.61538461538458, 144, 451, 152.0, 450.6, 451.0, 451.0, 0.08503456982319352, 0.0631946363627444, 0.04268336805578268], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 240.6153846153846, 145, 460, 150.0, 454.8, 460.0, 460.0, 0.08503679476696648, 0.0227539860997547, 0.04849754701553557], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 265.15384615384613, 148, 456, 151.0, 455.6, 456.0, 456.0, 0.08486470607435453, 0.02287369030910337, 0.04989116509449359], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 170.76923076923077, 142, 454, 148.0, 334.7999999999999, 454.0, 454.0, 0.08503735102110234, 0.022920223517406493, 0.050075705728246794], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b700139d-de64-421e-9605-147f1a48e36b", 3, 0, 0.0, 308.6666666666667, 233, 431, 262.0, 431.0, 431.0, 431.0, 0.026408915649923415, 0.026658218564587405, 0.016935404892691772], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 204.0, 150, 455, 155.0, 455.0, 455.0, 455.0, 0.037975164242585346, 0.028221777332624466, 0.02132394476512361], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 13, 0, 0.0, 994.0769230769229, 143, 1365, 1291.0, 1360.2, 1365.0, 1365.0, 0.06280193236714976, 43.47259020229468, 0.032769097222222224], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 291.6315789473684, 145, 1355, 152.0, 451.0, 1355.0, 1355.0, 0.1081505683596974, 5.149408987383382, 0.06309153736032923], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 13, 0, 0.0, 825.7692307692307, 151, 1199, 1002.0, 1143.8, 1199.0, 1199.0, 0.06279920196706423, 14.207791086377888, 0.03282899988647837], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 243.0, 145, 735, 152.0, 452.0, 735.0, 735.0, 0.10833556656650378, 1.7042026537937405, 0.06330525577171986], "isController": false}, {"data": ["deleteBooks", 16, 3, 18.75, 438.12500000000006, 152, 833, 440.0, 805.0, 833.0, 833.0, 0.08513491223122642, 0.017204693261571695, 0.05755855851961029], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/22ea801f-fc0a-4e75-9517-2c8dab4b9988", 1, 0, 0.0, 232.0, 232, 232, 232.0, 232.0, 232.0, 232.0, 4.310344827586206, 1.3764480064655171, 2.571895204741379], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 486.2307692307692, 294, 905, 311.0, 901.4, 905.0, 905.0, 0.0847816871555744, 0.13139505616786773, 0.19067600148367952], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/176715c5-0bf9-4317-a0e5-e1302335d7b4", 3, 0, 0.0, 537.0, 224, 835, 552.0, 835.0, 835.0, 835.0, 0.018289560318969934, 0.025213635400663303, 0.011728656845172776], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/907f1b4c-6996-4337-9218-7887c12b6d61", 3, 0, 0.0, 550.6666666666666, 246, 1000, 406.0, 1000.0, 1000.0, 1000.0, 0.08207934336525308, 0.037138765389876885, 0.05263551641586868], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 564.0454545454546, 212, 1198, 473.5, 1125.3, 1189.3, 1198.0, 0.09934791640324417, 0.06102523380628963, 0.04492000517060747], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 13, 0, 0.0, 150.84615384615387, 145, 157, 150.0, 155.8, 157.0, 157.0, 0.06279889860393219, 0.046669884607023815, 0.031522103400801894], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 13, 0, 0.0, 264.2307692307692, 144, 461, 151.0, 458.2, 461.0, 461.0, 0.06280162897763779, 0.08936211358882325, 0.03175935744271767], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1838f381-5de5-4093-8224-cc866dcf287b", 3, 0, 0.0, 344.6666666666667, 256, 504, 274.0, 504.0, 504.0, 504.0, 0.13322083573870952, 0.060278958879168704, 0.08543133021004486], "isController": false}, {"data": ["login", 22, 0, 0.0, 2565.090909090909, 1633, 4057, 2289.0, 3709.9999999999995, 4021.1499999999996, 4057.0, 0.09719933374274871, 31.84645908625999, 0.19061044771338567], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 156.26315789473685, 147, 169, 155.0, 163.0, 169.0, 169.0, 0.11139840172608892, 0.09018483889739035, 0.03959865061357067], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 13, 0, 0.0, 1180.923076923077, 297, 1515, 1442.0, 1510.2, 1515.0, 1515.0, 0.0627528214633958, 57.77182097374277, 0.1287818757180371], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 519.3, 293, 1510, 314.5, 1380.7000000000016, 1507.0, 1510.0, 0.10717539252987514, 12.971393799233695, 0.23829778682814423], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 7, 53.84615384615385, 745.0, 146, 1797, 153.0, 1684.6, 1797.0, 1797.0, 0.07736207235139043, 42.727423571479584, 0.10801167944132682], "isController": false}, {"data": ["register", 24, 7, 29.166666666666668, 943.7499999999998, 334, 1929, 911.0, 1667.0, 1876.0, 1929.0, 0.09964129135113592, 0.031283862470107615, 0.044955348246313274], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 172.62499999999997, 151, 452, 153.5, 249.0000000000002, 452.0, 452.0, 0.09128981091597914, 0.07087441374824553, 0.03245067497403946], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 569.8421052631579, 302, 1501, 592.0, 902.0, 1501.0, 1501.0, 0.10805584781186908, 6.962459923365655, 0.2415650236727614], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6ef05611-6dc9-41d1-88cc-ae5be2076040", 1, 0, 0.0, 251.0, 251, 251, 251.0, 251.0, 251.0, 251.0, 3.9840637450199203, 1.2722547310756973, 2.3772099103585655], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b1628ff3-6b7e-44be-9c8d-1f62e0720d33", 1, 0, 0.0, 457.0, 457, 457, 457.0, 457.0, 457.0, 457.0, 2.1881838074398248, 0.3953261761487965, 1.5086501641137855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 534.2777777777777, 297, 1422, 454.5, 969.3000000000008, 1422.0, 1422.0, 0.10016917460600125, 6.804237912571788, 0.2238589757145401], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 219.22222222222226, 145, 456, 154.0, 456.0, 456.0, 456.0, 0.052656521510189035, 0.03913243444263072, 0.026431105523669104], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 217.55555555555554, 143, 456, 153.0, 456.0, 456.0, 456.0, 0.05275034434252557, 0.01411483823227735, 0.03008418075784661], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ee8c8edc-a09c-4659-af9f-d2fb087122c7", 3, 0, 0.0, 445.6666666666667, 238, 592, 507.0, 592.0, 592.0, 592.0, 0.02124405166553365, 0.02548318046467822, 0.013623301361035576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 184.66666666666666, 150, 449, 152.0, 449.0, 449.0, 449.0, 0.05274941682589176, 0.014217616253853638, 0.03101088762615902], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 250.11111111111111, 149, 449, 152.0, 449.0, 449.0, 449.0, 0.052749725994478865, 0.014217699584449382, 0.03106258278776441], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 152.66666666666666, 152, 154, 152.0, 154.0, 154.0, 154.0, 0.10811200403618149, 0.03188459494035821, 0.06683095562002235], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1387.5178571428569, 1149, 2147, 1201.5, 1933.4, 1981.5499999999997, 2147.0, 0.25226702464558737, 301.7990636839094, 0.49812883186853285], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, 29.166666666666668, 943.7499999999998, 334, 1929, 911.0, 1667.0, 1876.0, 1929.0, 0.10183990766515039, 0.03197415069760337, 0.04594730209111277], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c1b25e44-689f-4bf9-9002-bfa204728ebd", 3, 0, 0.0, 821.3333333333334, 341, 1316, 807.0, 1316.0, 1316.0, 1316.0, 0.03270004251005527, 0.027260679970133962, 0.020969753823179973], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 148.71428571428572, 143, 158, 149.0, 158.0, 158.0, 158.0, 0.03519604195368201, 0.009486433182828354, 0.02072579423639673], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 233.71428571428572, 146, 450, 151.0, 450.0, 450.0, 450.0, 0.03514303214081311, 0.009472145381703533, 0.020660259129657705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 260.31250000000006, 145, 1307, 152.0, 706.4000000000005, 1307.0, 1307.0, 0.09146097474533836, 5.166657481865004, 0.05327780413632258], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 203.1875, 142, 712, 151.0, 525.1000000000001, 712.0, 712.0, 0.09146045192895809, 1.7038863368088306, 0.0533668164331567], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 234.28571428571428, 147, 449, 151.0, 449.0, 449.0, 449.0, 0.035143208574942894, 0.009403553856967142, 0.02004261114039712], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 151.5625, 143, 155, 152.5, 155.0, 155.0, 155.0, 0.09146097474533836, 0.06797050955195555, 0.04590912208896867], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 149.71428571428572, 144, 152, 150.0, 152.0, 152.0, 152.0, 0.03519604195368201, 0.026156433522218758, 0.01766676324628179], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 187.68750000000003, 147, 448, 151.5, 443.1, 448.0, 448.0, 0.09146202039603055, 0.0330589651358211, 0.051681847218411306], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 169.99999999999997, 153, 229, 154.0, 229.0, 229.0, 229.0, 0.03609419553772617, 0.02841007969082743, 0.012830358570051098], "isController": false}, {"data": ["deleteAccount", 16, 3, 18.75, 447.375, 146, 807, 446.0, 663.5000000000001, 807.0, 807.0, 0.0849924569194484, 0.016740152495059814, 0.05783574842498353], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3960e66a-9add-4285-aa1a-3088c8c9f4a3", 1, 0, 0.0, 578.0, 578, 578, 578.0, 578.0, 578.0, 578.0, 1.7301038062283738, 0.3125675821799308, 1.1928254757785468], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1282.909090909091, 772, 3007, 1159.5, 1627.0, 2802.699999999997, 3007.0, 0.09773868230485583, 0.05058740392731796, 0.04495597594295615], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 385.7142857142857, 298, 602, 303.0, 602.0, 602.0, 602.0, 0.03511658706906931, 0.0544238512486455, 0.0789780273633463], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=176715c5-0bf9-4317-a0e5-e1302335d7b4", 1, 0, 0.0, 793.0, 793, 793, 793.0, 793.0, 793.0, 793.0, 1.2610340479192939, 0.22782353404791927, 0.8694238650693569], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b700139d-de64-421e-9605-147f1a48e36b", 1, 0, 0.0, 511.0, 511, 511, 511.0, 511.0, 511.0, 511.0, 1.9569471624266144, 0.35355002446183953, 1.349223336594912], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/29163709-b1df-4fbe-8eeb-e8f07f9ead54", 3, 0, 0.0, 443.0, 280, 590, 459.0, 590.0, 590.0, 590.0, 0.0652613717940351, 0.029529071221910418, 0.04185055417781548], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8a6bc841-53ca-401c-8779-a3a28409429b", 3, 0, 0.0, 309.0, 241, 415, 271.0, 415.0, 415.0, 415.0, 0.024816769518389226, 0.024889474897837632, 0.015914399723706632], "isController": false}, {"data": ["addBook", 59, 11, 18.64406779661017, 1342.6610169491523, 754, 2320, 1170.0, 2081.0, 2262.0, 2320.0, 0.2727516480671616, 84.02939870541205, 0.991311567039119], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 258.2142857142859, 145, 614, 153.0, 600.8000000000001, 607.6, 614.0, 0.2534544483518672, 0.18835823749587005, 0.12251948431071705], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 833.1607142857141, 710, 1213, 749.5, 1052.8000000000002, 1189.1499999999999, 1213.0, 0.25333291111181483, 74.48828731118782, 0.1274086418189303], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 203.30357142857142, 143, 603, 152.0, 451.20000000000005, 457.15, 603.0, 0.2540258562032207, 0.4495066908596054, 0.12353991834883193], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1127.2857142857142, 999, 1498, 1048.0, 1353.5, 1379.0499999999997, 1498.0, 0.25300671371386746, 227.65588573810192, 0.12699751059465614], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 175.16666666666663, 145, 469, 156.0, 212.5000000000004, 469.0, 469.0, 0.09518571791183687, 0.07111042402593282, 0.03383554816397326], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 11, 6.32183908045977, 212.55172413793102, 144, 891, 157.5, 377.0, 452.5, 671.25, 0.7188716194442379, 1.5585113792936054, 0.34509678687109063], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 222.77777777777777, 151, 452, 164.0, 452.0, 452.0, 452.0, 0.05100017000056667, 0.03949524883832946, 0.018128966679888933], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/44bb6cd7-69a8-40c2-8d1d-8d4c0b5a282b", 1, 0, 0.0, 328.0, 328, 328, 328.0, 328.0, 328.0, 328.0, 3.048780487804878, 0.973585175304878, 1.8191453887195121], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 183.2, 149, 451, 153.5, 422.2000000000006, 451.0, 451.0, 0.10682162924348922, 0.0866882557630269, 0.037971751020146556], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8a6bc841-53ca-401c-8779-a3a28409429b", 1, 0, 0.0, 458.0, 458, 458, 458.0, 458.0, 458.0, 458.0, 2.1834061135371177, 0.39446301855895194, 1.5053561681222707], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 472.1111111111111, 303, 910, 308.0, 910.0, 910.0, 910.0, 0.052609427609427606, 0.08153433751578283, 0.11831983572706228], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 449.68749999999994, 295, 1457, 306.5, 859.2000000000006, 1457.0, 1457.0, 0.09138053137778997, 6.96545088617698, 0.2040556714470107], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1838f381-5de5-4093-8224-cc866dcf287b", 1, 0, 0.0, 269.0, 269, 269, 269.0, 269.0, 269.0, 269.0, 3.717472118959108, 0.6716136152416357, 2.5630227695167282], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f692c195-4243-4cf3-95bc-439e25e1c257", 1, 0, 0.0, 833.0, 833, 833, 833.0, 833.0, 833.0, 833.0, 1.2004801920768307, 0.21688362845138057, 0.8276748199279712], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 177.99999999999997, 149, 453, 156.0, 336.9999999999999, 453.0, 453.0, 0.09106638739641199, 0.07550328408159548, 0.032371254894818326], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/66e3300b-4788-464b-984c-21bf6682023c", 3, 0, 0.0, 419.0, 410, 425, 422.0, 425.0, 425.0, 425.0, 0.04285897967055731, 0.02755419428689801, 0.02748443683300713], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 13, 0, 0.0, 160.30769230769226, 150, 192, 157.0, 183.6, 192.0, 192.0, 0.06088137498243807, 0.0472663018662483, 0.02164142626328853], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d561638b-1f16-45be-a677-d93c55d998fa", 3, 0, 0.0, 315.6666666666667, 230, 461, 256.0, 461.0, 461.0, 461.0, 0.02824778961046298, 0.028330546806587385, 0.018114630707230493], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=907f1b4c-6996-4337-9218-7887c12b6d61", 1, 0, 0.0, 244.0, 244, 244, 244.0, 244.0, 244.0, 244.0, 4.0983606557377055, 0.7404264856557378, 2.82562756147541], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 186.3888888888889, 145, 463, 151.5, 458.5, 463.0, 463.0, 0.10026067776218167, 0.07451013259474634, 0.05032616051734509], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 248.61111111111111, 143, 460, 151.5, 451.90000000000003, 460.0, 460.0, 0.10026235315742861, 0.03519408772398888, 0.05671306933698734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 309.94444444444434, 143, 1271, 153.5, 538.4000000000011, 1271.0, 1271.0, 0.10025621031525009, 5.0372272978862656, 0.058461032360476776], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 266.3888888888889, 146, 741, 152.5, 486.3000000000004, 741.0, 741.0, 0.10025676872434401, 1.66323324946112, 0.058559264978639745], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 22.580645161290324, 0.5291005291005291], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 12.903225806451612, 0.30234315948601664], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 9.67741935483871, 0.22675736961451248], "isController": false}, {"data": ["401/Unauthorized", 17, 54.83870967741935, 1.2849584278155706], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1323, 31, "401/Unauthorized", 17, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 7, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
