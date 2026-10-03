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

    var data = {"OkPercent": 98.28125, "KoPercent": 1.71875};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7750167897918065, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.05555555555555555, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e27a0b3d-843b-4eb8-b0c7-232cdea11698"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/01934bcd-d1a9-41d9-b37f-e9de3d1ae422"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5769230769230769, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e8ba7dac-6513-46bf-85f7-84941e359e2c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/18a54b12-b589-4070-a13c-8901e1eb499b"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/10b6bf2b-4d02-41e9-9428-d200572a9c52"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f1673936-7e6b-4a56-b58f-0232a7f134ee"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9ad705d0-25f3-4902-8b7e-1d34a51fc6e6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5384615384615384, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3655a405-6675-495d-a7c1-522c717509da"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8a879500-241c-4a2e-a06c-4b90e501ea8f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d42350ce-65c1-4310-8c88-93070c9e2819"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.14285714285714285, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/895a95bc-de33-4a3f-88c7-d27b7416f58e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8cfeda0b-5491-4994-a43d-05ccf47f83e3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/be96e117-4a9d-4358-ae53-310f51058d4e"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/e27a0b3d-843b-4eb8-b0c7-232cdea11698"], "isController": false}, {"data": [0.2826086956521739, 500, 1500, "register"], "isController": true}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8a879500-241c-4a2e-a06c-4b90e501ea8f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c8cf26ec-de46-4c45-a294-989103ebd67a"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4074074074074074, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2826086956521739, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0ef3add0-b347-455d-92c2-cfada0c20a0a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0591706b-bafc-4dc0-91e5-dee9aba80f97"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.21052631578947367, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9ad705d0-25f3-4902-8b7e-1d34a51fc6e6"], "isController": false}, {"data": [0.28688524590163933, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e8ba7dac-6513-46bf-85f7-84941e359e2c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=18a54b12-b589-4070-a13c-8901e1eb499b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5092592592592593, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9204545454545454, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/0591706b-bafc-4dc0-91e5-dee9aba80f97"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=10b6bf2b-4d02-41e9-9428-d200572a9c52"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=be96e117-4a9d-4358-ae53-310f51058d4e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d42350ce-65c1-4310-8c88-93070c9e2819"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f1673936-7e6b-4a56-b58f-0232a7f134ee"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8cfeda0b-5491-4994-a43d-05ccf47f83e3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1280, 22, 1.71875, 376.7382812499999, 99, 2689, 121.0, 1066.7000000000003, 1253.3000000000006, 1768.8000000000065, 4.969407087616858, 672.0432717855604, 3.6281501928071713], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 1748.2592592592596, 1276, 2426, 1711.5, 2109.5, 2171.0, 2426.0, 0.23202553999647663, 279.20423430497607, 1.1408677674631444], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e27a0b3d-843b-4eb8-b0c7-232cdea11698", 1, 0, 0.0, 508.0, 508, 508, 508.0, 508.0, 508.0, 508.0, 1.968503937007874, 0.35563791830708663, 1.357191190944882], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/01934bcd-d1a9-41d9-b37f-e9de3d1ae422", 1, 0, 0.0, 215.0, 215, 215, 215.0, 215.0, 215.0, 215.0, 4.651162790697675, 1.4852834302325582, 2.7752543604651163], "isController": false}, {"data": ["deleteBook", 13, 2, 15.384615384615385, 470.2307692307693, 113, 871, 501.0, 756.1999999999999, 871.0, 871.0, 0.08290816326530613, 0.016435895647321428, 0.05574129065688775], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, 15.384615384615385, 470.2307692307693, 113, 871, 501.0, 756.1999999999999, 871.0, 871.0, 0.08565649111478628, 0.016980730172169545, 0.05758906216025671], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 144.55555555555554, 102, 323, 108.0, 323.0, 323.0, 323.0, 0.10342093469542535, 0.03630281290578353, 0.058499710565023046], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 136.77777777777774, 104, 338, 112.5, 325.40000000000003, 338.0, 338.0, 0.10342271737444196, 0.07686004679877961, 0.05191335618209293], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 232.50000000000003, 105, 842, 120.0, 499.10000000000053, 842.0, 842.0, 0.10328800137717335, 1.7135205966316633, 0.06032978639467493], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 216.72222222222223, 102, 1200, 112.5, 417.00000000000125, 1200.0, 1200.0, 0.10330400647371774, 5.190359377779882, 0.06023825203881935], "isController": false}, {"data": ["goToProfile", 13, 2, 15.384615384615385, 220.9230769230769, 110, 356, 212.0, 332.4, 356.0, 356.0, 0.08217757942779119, 0.16474407017649217, 0.05311417468424846], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 13, 0, 0.0, 127.46153846153845, 101, 344, 111.0, 253.19999999999993, 344.0, 344.0, 0.07136622401308747, 0.053036812962851135, 0.035822499162819293], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e8ba7dac-6513-46bf-85f7-84941e359e2c", 1, 0, 0.0, 449.0, 449, 449, 449.0, 449.0, 449.0, 449.0, 2.2271714922048997, 0.40236984966592426, 1.5355303452115812], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 13, 0, 0.0, 141.76923076923077, 103, 333, 109.0, 328.2, 333.0, 333.0, 0.07136700758137211, 0.03558700393067518, 0.03977938673781408], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 732.6666666666666, 657, 882, 659.0, 882.0, 882.0, 882.0, 0.10589107338251386, 31.135491489004977, 0.06039100278846493], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 1098.6666666666667, 958, 1214, 1124.0, 1214.0, 1214.0, 1214.0, 0.10417390096534482, 93.73585920680256, 0.05930994556913675], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 182.66666666666666, 107, 331, 110.0, 331.0, 331.0, 331.0, 0.1079913606911447, 0.19109408747300216, 0.05979599757019438], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 109.35714285714288, 102, 115, 109.0, 114.5, 115.0, 115.0, 0.06228201295465869, 0.04628575376806179, 0.031262651033881414], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 152.0, 101, 340, 106.5, 328.0, 340.0, 340.0, 0.062228583366299675, 0.030003066980180196, 0.03474313485378505], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 270.3571428571429, 103, 1200, 110.0, 1127.0, 1200.0, 1200.0, 0.06228256710946606, 8.020383707881413, 0.03585070757444991], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 294.7857142857143, 105, 801, 314.0, 760.0, 801.0, 801.0, 0.062283398360167094, 2.6305872935194126, 0.03591200968506845], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 185.66666666666666, 109, 336, 112.0, 336.0, 336.0, 336.0, 0.10710460549803642, 0.07959629373438057, 0.06014174625133881], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 13, 0, 0.0, 946.076923076923, 106, 1453, 1137.0, 1450.6, 1453.0, 1453.0, 0.11164068873717205, 77.2796270503242, 0.05825242067070291], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 13, 0, 0.0, 260.46153846153845, 99, 1002, 110.0, 995.2, 1002.0, 1002.0, 0.07136504869292169, 9.895413749162833, 0.04101131479122978], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 13, 0, 0.0, 675.1538461538462, 108, 1100, 658.0, 1032.3999999999999, 1100.0, 1100.0, 0.1114263429017134, 25.20927260026228, 0.05824939304785333], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 13, 0, 0.0, 277.9230769230769, 104, 880, 113.0, 877.6, 880.0, 880.0, 0.07136583223539746, 3.244572079490558, 0.041081458264712344], "isController": false}, {"data": ["deleteBooks", 13, 2, 15.384615384615385, 492.76923076923083, 113, 1351, 449.0, 1239.8, 1351.0, 1351.0, 0.08587773652710434, 0.017024590346681818, 0.05826680561244039], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/18a54b12-b589-4070-a13c-8901e1eb499b", 3, 0, 0.0, 381.6666666666667, 209, 523, 413.0, 523.0, 523.0, 523.0, 0.07641949206510941, 0.034577830068522816, 0.04900598937769061], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 473.07142857142856, 215, 1314, 420.0, 1238.0, 1314.0, 1314.0, 0.062198172262280804, 10.7127153889385, 0.137611720690222], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/10b6bf2b-4d02-41e9-9428-d200572a9c52", 3, 0, 0.0, 1071.6666666666667, 226, 2507, 482.0, 2507.0, 2507.0, 2507.0, 0.03253690226999121, 0.027124676664533692, 0.020865135895795146], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 19, 0, 0.0, 636.7894736842106, 122, 1537, 489.0, 1534.0, 1537.0, 1537.0, 0.07821279643678965, 0.048042821248770205, 0.03536379370140001], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 13, 0, 0.0, 112.07692307692307, 107, 119, 112.0, 118.2, 119.0, 119.0, 0.11162630946247638, 0.08295666162201615, 0.0560311748669071], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f1673936-7e6b-4a56-b58f-0232a7f134ee", 1, 0, 0.0, 425.0, 425, 425, 425.0, 425.0, 425.0, 425.0, 2.352941176470588, 0.4250919117647059, 1.6222426470588236], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 13, 0, 0.0, 216.53846153846158, 100, 425, 117.0, 389.79999999999995, 425.0, 425.0, 0.11164548265200962, 0.15886333626760563, 0.056460140415664724], "isController": false}, {"data": ["login", 19, 0, 0.0, 3093.894736842106, 1634, 4832, 3033.0, 4488.0, 4832.0, 4832.0, 0.07863424728401448, 14.963920234092084, 0.139230632436627], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9ad705d0-25f3-4902-8b7e-1d34a51fc6e6", 1, 0, 0.0, 1351.0, 1351, 1351, 1351.0, 1351.0, 1351.0, 1351.0, 0.7401924500370096, 0.13372617505551443, 0.5103279977794226], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 13, 0, 0.0, 129.69230769230768, 105, 328, 113.0, 247.19999999999993, 328.0, 328.0, 0.07140267814968197, 0.057805488462974966, 0.02538142074851977], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 13, 0, 0.0, 1093.769230769231, 232, 1568, 1254.0, 1565.6, 1568.0, 1568.0, 0.11131089990581385, 102.47560558748609, 0.22843317867540028], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3655a405-6675-495d-a7c1-522c717509da", 1, 0, 0.0, 230.0, 230, 230, 230.0, 230.0, 230.0, 230.0, 4.3478260869565215, 1.3884171195652173, 2.594259510869565], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8a879500-241c-4a2e-a06c-4b90e501ea8f", 3, 0, 0.0, 296.6666666666667, 204, 446, 240.0, 446.0, 446.0, 446.0, 0.07868439688409788, 0.035602640517218766, 0.05045841857476329], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d42350ce-65c1-4310-8c88-93070c9e2819", 1, 0, 0.0, 407.0, 407, 407, 407.0, 407.0, 407.0, 407.0, 2.457002457002457, 0.44389204545454547, 1.6939880221130221], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 425.00000000000006, 218, 1306, 415.5, 736.3000000000009, 1306.0, 1306.0, 0.10322403055431303, 7.01174652729989, 0.23068599536638798], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 4, 57.142857142857146, 614.7142857142857, 110, 1550, 116.0, 1550.0, 1550.0, 1550.0, 0.06523400369038078, 33.456780433992506, 0.0877400989926006], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/895a95bc-de33-4a3f-88c7-d27b7416f58e", 1, 0, 0.0, 272.0, 272, 272, 272.0, 272.0, 272.0, 272.0, 3.676470588235294, 1.174029181985294, 2.193675321691176], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8cfeda0b-5491-4994-a43d-05ccf47f83e3", 3, 0, 0.0, 354.3333333333333, 231, 592, 240.0, 592.0, 592.0, 592.0, 0.026493341340209826, 0.02657095855116747, 0.016989545065173618], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/be96e117-4a9d-4358-ae53-310f51058d4e", 3, 0, 0.0, 670.0, 267, 1387, 356.0, 1387.0, 1387.0, 1387.0, 0.0461510060919328, 0.029670650075379973, 0.029595534505568885], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e27a0b3d-843b-4eb8-b0c7-232cdea11698", 3, 0, 0.0, 499.6666666666667, 211, 662, 626.0, 662.0, 662.0, 662.0, 0.01774591400330074, 0.024464175066399297, 0.011380029487793769], "isController": false}, {"data": ["register", 23, 3, 13.043478260869565, 1266.5652173913043, 251, 2647, 1179.0, 1858.8000000000002, 2505.999999999998, 2647.0, 0.09304771729676153, 0.029741135182151022, 0.041980513077249836], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 13, 0, 0.0, 425.3846153846154, 206, 1346, 228.0, 1246.3999999999999, 1346.0, 1346.0, 0.07132354554831347, 13.220878947826826, 0.15760081823194416], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 130.16666666666669, 112, 344, 115.5, 159.50000000000028, 344.0, 344.0, 0.10397832629554107, 0.0807253607470265, 0.036961045675368114], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8a879500-241c-4a2e-a06c-4b90e501ea8f", 1, 0, 0.0, 243.0, 243, 243, 243.0, 243.0, 243.0, 243.0, 4.11522633744856, 0.7434735082304527, 2.837255658436214], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c8cf26ec-de46-4c45-a294-989103ebd67a", 1, 0, 0.0, 427.0, 427, 427, 427.0, 427.0, 427.0, 427.0, 2.34192037470726, 0.7478593384074942, 1.3973763173302107], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 310.05263157894734, 215, 681, 230.0, 536.0, 681.0, 681.0, 0.09482883395471174, 0.14696617137317144, 0.21327227011494254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 14, 0, 0.0, 110.14285714285714, 104, 117, 110.5, 115.0, 117.0, 117.0, 0.07728231228678362, 0.05743343715843978, 0.03879209815957693], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 14, 0, 0.0, 121.71428571428571, 103, 295, 109.5, 205.5, 295.0, 295.0, 0.07727761984930864, 0.02067780062374079, 0.04407239257030884], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 14, 0, 0.0, 108.78571428571429, 101, 115, 109.5, 115.0, 115.0, 115.0, 0.07727804641098673, 0.02082884844671127, 0.045431039003334], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 14, 0, 0.0, 132.42857142857142, 107, 418, 109.5, 267.5, 418.0, 418.0, 0.07727975270479134, 0.020829308346213292, 0.045507510625965995], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 113.5, 113, 114, 113.5, 114.0, 114.0, 114.0, 0.19928258270227184, 0.05877279294539658, 0.12318933090872858], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1190.2407407407404, 824, 1934, 1116.0, 1646.5, 1725.0, 1934.0, 0.23577697244902415, 282.07122838711086, 0.4655674202069598], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 3, 13.043478260869565, 1266.5652173913043, 251, 2647, 1179.0, 1858.8000000000002, 2505.999999999998, 2647.0, 0.09120071691693994, 0.02915077262868223, 0.04114719845276001], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 111.16666666666666, 107, 117, 110.0, 117.0, 117.0, 117.0, 0.04869774123643565, 0.013125563067633047, 0.028676501919502634], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 108.83333333333333, 107, 112, 108.0, 112.0, 112.0, 112.0, 0.04869774123643565, 0.013125563067633047, 0.028628945531576425], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0ef3add0-b347-455d-92c2-cfada0c20a0a", 1, 0, 0.0, 333.0, 333, 333, 333.0, 333.0, 333.0, 333.0, 3.003003003003003, 0.9589667792792792, 1.7918308933933933], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 159.11111111111114, 105, 344, 112.0, 328.70000000000005, 344.0, 344.0, 0.1002612362210426, 0.02702353632520289, 0.05894264082526137], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 146.49999999999997, 104, 340, 110.0, 332.8, 340.0, 340.0, 0.1002612362210426, 0.02702353632520289, 0.059040552188758484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 108.33333333333334, 106, 111, 108.0, 111.0, 111.0, 111.0, 0.04869813648464385, 0.013030556051555094, 0.027773155963898448], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 110.94444444444444, 104, 122, 110.5, 115.70000000000002, 122.0, 122.0, 0.10025285999131142, 0.07450432270838671, 0.05032223636282624], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0591706b-bafc-4dc0-91e5-dee9aba80f97", 1, 0, 0.0, 546.0, 546, 546, 546.0, 546.0, 546.0, 546.0, 1.8315018315018314, 0.3308865613553113, 1.262734661172161], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 112.16666666666666, 108, 118, 111.5, 118.0, 118.0, 118.0, 0.048696950759266625, 0.03618982375761905, 0.024443586611585005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 159.16666666666666, 103, 336, 111.0, 332.4, 336.0, 336.0, 0.10013685370005675, 0.026794431556460496, 0.05710929937581361], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 152.16666666666666, 110, 328, 118.0, 328.0, 328.0, 328.0, 0.0472191835803159, 0.03716666207591271, 0.016784944163315416], "isController": false}, {"data": ["deleteAccount", 13, 2, 15.384615384615385, 552.9230769230768, 112, 1387, 522.0, 1147.3999999999999, 1387.0, 1387.0, 0.08748376503206617, 0.016974952304524258, 0.059533911315015585], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 19, 0, 0.0, 1662.2105263157894, 970, 2672, 1641.0, 2535.0, 2672.0, 2672.0, 0.0784731601141578, 0.040615991074710575, 0.036094588294695626], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 224.0, 218, 229, 225.0, 229.0, 229.0, 229.0, 0.04865390853065196, 0.07540405550600066, 0.10942378061141746], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9ad705d0-25f3-4902-8b7e-1d34a51fc6e6", 3, 0, 0.0, 607.3333333333334, 246, 1085, 491.0, 1085.0, 1085.0, 1085.0, 0.02635254433815585, 0.02642974905789654, 0.016899255321017912], "isController": false}, {"data": ["addBook", 61, 11, 18.0327868852459, 1124.786885245902, 571, 3966, 916.0, 1900.8000000000002, 2049.7, 3966.0, 0.27586456406615323, 82.18692728424904, 1.003899872751817], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/e8ba7dac-6513-46bf-85f7-84941e359e2c", 3, 0, 0.0, 367.6666666666667, 284, 522, 297.0, 522.0, 522.0, 522.0, 0.022725551094614046, 0.026860832039239453, 0.014573351450647679], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=18a54b12-b589-4070-a13c-8901e1eb499b", 1, 0, 0.0, 204.0, 204, 204, 204.0, 204.0, 204.0, 204.0, 4.901960784313726, 0.8856081495098039, 3.379672181372549], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 191.5555555555555, 101, 489, 114.0, 435.0, 476.5, 489.0, 0.23685249353041798, 0.1760202613053204, 0.11449412529058292], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 710.3333333333336, 500, 1014, 693.0, 889.5, 937.0, 1014.0, 0.23679848448969926, 69.6266168896519, 0.11909298780487805], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 160.27777777777777, 102, 344, 112.5, 333.0, 341.5, 344.0, 0.23723541661175107, 0.4197954833012626, 0.11537425534438674], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 990.7222222222224, 714, 1452, 978.5, 1231.5, 1343.75, 1452.0, 0.23627421810735602, 212.59995677877293, 0.11859858213591894], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 115.89473684210526, 107, 125, 116.0, 123.0, 125.0, 125.0, 0.09465451103472326, 0.0707135751382454, 0.03364672071937429], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 11, 6.25, 190.56818181818187, 100, 2207, 117.0, 334.20000000000005, 440.6, 1031.2099999999843, 0.7125217602526213, 1.4571264511052184, 0.3449063297032509], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 14, 0, 0.0, 150.07142857142858, 102, 346, 118.5, 335.5, 346.0, 346.0, 0.07992190488151578, 0.06189264704203322, 0.02840973962585131], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 135.0, 105, 472, 116.5, 159.7000000000005, 472.0, 472.0, 0.09917956460171139, 0.08048654119533415, 0.0352552358545146], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 14, 0, 0.0, 257.57142857142856, 216, 527, 222.5, 469.5, 527.0, 527.0, 0.0772328570640481, 0.11969584390687923, 0.1736985056821316], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0591706b-bafc-4dc0-91e5-dee9aba80f97", 3, 0, 0.0, 1136.3333333333333, 251, 2689, 469.0, 2689.0, 2689.0, 2689.0, 0.024155756316730278, 0.02855128619337488, 0.01549050779425737], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=10b6bf2b-4d02-41e9-9428-d200572a9c52", 1, 0, 0.0, 489.0, 489, 489, 489.0, 489.0, 489.0, 489.0, 2.044989775051125, 0.36945616053169733, 1.409924591002045], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 299.3333333333333, 217, 455, 231.0, 454.1, 455.0, 455.0, 0.10006838005970746, 0.15508644448706616, 0.22505613210693973], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=be96e117-4a9d-4358-ae53-310f51058d4e", 1, 0, 0.0, 484.0, 484, 484, 484.0, 484.0, 484.0, 484.0, 2.066115702479339, 0.37327285640495866, 1.4244899276859504], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d42350ce-65c1-4310-8c88-93070c9e2819", 3, 0, 0.0, 406.66666666666663, 212, 788, 220.0, 788.0, 788.0, 788.0, 0.01720341315717038, 0.023716293854367375, 0.011032136692586477], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 129.21428571428572, 107, 313, 115.5, 217.5, 313.0, 313.0, 0.06456045856371426, 0.053527177070891996, 0.0229492255050703], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f1673936-7e6b-4a56-b58f-0232a7f134ee", 3, 0, 0.0, 669.0, 203, 1166, 638.0, 1166.0, 1166.0, 1166.0, 0.031109682370143, 0.025934862158182363, 0.019949893967832588], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 13, 0, 0.0, 113.07692307692308, 103, 126, 114.0, 122.8, 126.0, 126.0, 0.10327377878756583, 0.08017837317979964, 0.03671060105339254], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8cfeda0b-5491-4994-a43d-05ccf47f83e3", 1, 0, 0.0, 1073.0, 1073, 1073, 1073.0, 1073.0, 1073.0, 1073.0, 0.9319664492078285, 0.16837284482758622, 0.6425471808014912], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 123.89473684210526, 100, 342, 112.0, 119.0, 342.0, 342.0, 0.09487997682931092, 0.07051138903037658, 0.047625300869400214], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 173.0, 105, 431, 112.0, 339.0, 431.0, 431.0, 0.09488708436960018, 0.02538970812233442, 0.0541152903045376], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 118.52631578947367, 99, 312, 108.0, 113.0, 312.0, 312.0, 0.09488613663603675, 0.025574779015181782, 0.055782670170795044], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 166.73684210526315, 106, 338, 112.0, 329.0, 338.0, 338.0, 0.09488661050045197, 0.02557490673644994, 0.05587561145680911], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 3, 13.636363636363637, 0.234375], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 9.090909090909092, 0.15625], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 9.090909090909092, 0.15625], "isController": false}, {"data": ["401/Unauthorized", 15, 68.18181818181819, 1.171875], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1280, 22, "401/Unauthorized", 15, "406/Not Acceptable", 3, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 3, "406/Not Acceptable", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
