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

    var data = {"OkPercent": 98.34384858044164, "KoPercent": 1.6561514195583595};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8107287449392713, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3611111111111111, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f81a9e55-0613-4495-a10b-c51d99a19636"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/045e231a-24a3-4f87-8d4f-1da41a8ae757"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/24befb4f-fea7-4b75-a512-e24866410167"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b577b821-8712-473c-baad-7d9b7d6af746"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0a29e130-99f3-494e-a863-d9d5cf80b958"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.78125, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4a17e35d-8cc6-400d-816f-faf45d1a0c3a"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cddede03-1787-4c61-95f1-b15ca30fac9f"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=805ac65e-4022-4545-ab80-75e7bc9d048a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8a40ec13-2ccf-49e8-ba7f-a547f96409e3"], "isController": false}, {"data": [0.023809523809523808, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3daa60b6-1909-4ffb-bd4c-ba834425f58e"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b577b821-8712-473c-baad-7d9b7d6af746"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fd754f62-0a28-40ab-9edd-7c49d73fdb82"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9c39a23c-f58b-4977-a3c6-8b2ed6da9857"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.1956521739130435, 500, 1500, "register"], "isController": true}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cddd374d-4ad7-4b5e-b6a9-913930c194e8"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.49074074074074076, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.1956521739130435, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.30952380952380953, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0a29e130-99f3-494e-a863-d9d5cf80b958"], "isController": false}, {"data": [0.3793103448275862, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8a40ec13-2ccf-49e8-ba7f-a547f96409e3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ddf38de1-cb4b-46a8-8be4-da8058086f65"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/269b48e6-a0ce-473f-bb37-46adf9524dc1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=93b65119-6f2b-4c42-8227-e44c31f965d1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4a17e35d-8cc6-400d-816f-faf45d1a0c3a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/93b65119-6f2b-4c42-8227-e44c31f965d1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ddf38de1-cb4b-46a8-8be4-da8058086f65"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cddede03-1787-4c61-95f1-b15ca30fac9f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b1a67125-6618-4866-9127-b5e10c49f276"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3daa60b6-1909-4ffb-bd4c-ba834425f58e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/1d9cf959-3c47-48c8-9944-77b38bf34d87"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cddd374d-4ad7-4b5e-b6a9-913930c194e8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/805ac65e-4022-4545-ab80-75e7bc9d048a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9c39a23c-f58b-4977-a3c6-8b2ed6da9857"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fd754f62-0a28-40ab-9edd-7c49d73fdb82"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1268, 21, 1.6561514195583595, 313.403785488959, 77, 2869, 98.0, 858.2000000000003, 1098.1, 1688.1299999999933, 4.98588381475161, 699.444253540351, 3.6277017110467993], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 1357.0740740740741, 960, 1880, 1294.5, 1666.0, 1737.25, 1880.0, 0.23277066055140783, 280.10247970800214, 1.1445315194104868], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f81a9e55-0613-4495-a10b-c51d99a19636", 1, 0, 0.0, 204.0, 204, 204, 204.0, 204.0, 204.0, 204.0, 4.901960784313726, 1.5653722426470589, 2.924900428921569], "isController": false}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 455.2666666666667, 85, 713, 482.0, 699.8, 713.0, 713.0, 0.07779154976325439, 0.015239243049325028, 0.05237761768564953], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 455.2666666666667, 85, 713, 482.0, 699.8, 713.0, 713.0, 0.07878854729676495, 0.0154345533083311, 0.05304890339473587], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/045e231a-24a3-4f87-8d4f-1da41a8ae757", 1, 0, 0.0, 176.0, 176, 176, 176.0, 176.0, 176.0, 176.0, 5.681818181818182, 1.8144087357954546, 3.3902254971590913], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 112.00000000000001, 79, 236, 81.0, 235.4, 236.0, 236.0, 0.0915203358186189, 0.024488839857716386, 0.05219519152155609], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 93.2, 80, 238, 83.0, 149.20000000000005, 238.0, 238.0, 0.0915181022806311, 0.06801296468316434, 0.04593779743383242], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 123.46666666666668, 78, 246, 82.0, 240.6, 246.0, 246.0, 0.09152089422015046, 0.02466774102027493, 0.05389365157690501], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 124.26666666666664, 80, 242, 83.0, 239.6, 242.0, 242.0, 0.09151921903599755, 0.024667289505796216, 0.0538032908785845], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/24befb4f-fea7-4b75-a512-e24866410167", 1, 0, 0.0, 348.0, 348, 348, 348.0, 348.0, 348.0, 348.0, 2.8735632183908044, 0.9176320043103449, 1.7145968031609196], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 206.33333333333334, 80, 363, 182.0, 333.0, 363.0, 363.0, 0.07785938594897615, 0.13573182145545146, 0.05032473852222885], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b577b821-8712-473c-baad-7d9b7d6af746", 1, 0, 0.0, 658.0, 658, 658, 658.0, 658.0, 658.0, 658.0, 1.5197568389057752, 0.2745654445288754, 1.0478011018237081], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 82.25, 79, 89, 81.5, 86.2, 89.0, 89.0, 0.0839595315058142, 0.06239570651945762, 0.04214374921287939], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 81.18750000000001, 79, 85, 81.0, 83.6, 85.0, 85.0, 0.08396085325217117, 0.038229245926586726, 0.047002499147272586], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 552.3333333333334, 408, 626, 623.0, 626.0, 626.0, 626.0, 0.044089118805478805, 12.963664825333609, 0.025144575568749633], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 725.3333333333334, 547, 934, 695.0, 934.0, 934.0, 934.0, 0.044044455537122135, 39.631278514197, 0.025076091384904495], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 190.33333333333334, 79, 250, 242.0, 250.0, 250.0, 250.0, 0.04433934377771209, 0.0784598544191546, 0.024551179611291753], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0a29e130-99f3-494e-a863-d9d5cf80b958", 1, 0, 0.0, 472.0, 472, 472, 472.0, 472.0, 472.0, 472.0, 2.1186440677966103, 0.38276284427966106, 1.4607057733050848], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 91.41176470588233, 79, 235, 82.0, 115.7999999999999, 235.0, 235.0, 0.0722629350653767, 0.053703216391359054, 0.03627260607773791], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 136.1764705882353, 78, 245, 84.0, 238.6, 245.0, 245.0, 0.07221658177678279, 0.025703925820826413, 0.04082925079544441], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 154.17647058823533, 78, 854, 82.0, 361.99999999999955, 854.0, 854.0, 0.07226539252860859, 3.8433042195018787, 0.042118834593018316], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 154.1764705882353, 79, 466, 83.0, 344.39999999999986, 466.0, 466.0, 0.07221780891167762, 1.2674042928177265, 0.04216162637691749], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 82.33333333333333, 81, 84, 82.0, 84.0, 84.0, 84.0, 0.04444312761103375, 0.03302853526562176, 0.024955857789398836], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 596.8125, 79, 1027, 830.5, 1017.9, 1027.0, 1027.0, 0.07535795026375282, 42.38712681624435, 0.04025468632253203], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 201.62499999999997, 77, 1018, 81.0, 952.2, 1018.0, 1018.0, 0.08396173443952919, 9.463416052040532, 0.04845838384156421], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 398.24999999999994, 79, 728, 466.0, 714.0, 728.0, 728.0, 0.07535830519171624, 13.856269192818354, 0.040328468012754394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 167.62499999999997, 78, 627, 81.0, 623.5, 627.0, 627.0, 0.08396041266542825, 3.105694844568286, 0.048539613572200706], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 468.4999999999999, 81, 1311, 427.5, 1097.0, 1311.0, 1311.0, 0.07586924477586057, 0.014945225114887713, 0.051535623997442125], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/4a17e35d-8cc6-400d-816f-faf45d1a0c3a", 3, 0, 0.0, 320.0, 177, 595, 188.0, 595.0, 595.0, 595.0, 0.027629397679130595, 0.027710343180143673, 0.017718070777307054], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 297.7647058823529, 162, 1089, 314.0, 535.3999999999995, 1089.0, 1089.0, 0.0721899019066627, 5.1855472896938295, 0.1612702835046074], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cddede03-1787-4c61-95f1-b15ca30fac9f", 1, 0, 0.0, 883.0, 883, 883, 883.0, 883.0, 883.0, 883.0, 1.1325028312570782, 0.20460256228765572, 0.7808076160815401], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 656.7142857142858, 91, 1356, 557.0, 1290.6000000000001, 1351.0, 1356.0, 0.09691934925579786, 0.05953346746278989, 0.04382193232952578], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 82.1875, 78, 97, 81.0, 90.0, 97.0, 97.0, 0.07536043482970897, 0.05600516689981302, 0.03782740576413126], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=805ac65e-4022-4545-ab80-75e7bc9d048a", 1, 0, 0.0, 196.0, 196, 196, 196.0, 196.0, 196.0, 196.0, 5.1020408163265305, 0.9217554209183673, 3.5176179846938775], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 130.75, 78, 242, 81.5, 242.0, 242.0, 242.0, 0.07535972493700398, 0.09090634787933025, 0.039022943503756215], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8a40ec13-2ccf-49e8-ba7f-a547f96409e3", 3, 0, 0.0, 476.0, 202, 1014, 212.0, 1014.0, 1014.0, 1014.0, 0.08059749610445435, 0.036468268094137876, 0.05168524327010907], "isController": false}, {"data": ["login", 21, 0, 0.0, 2618.9999999999995, 1204, 3904, 2583.0, 3560.6000000000004, 3876.5999999999995, 3904.0, 0.0998649445511784, 17.207964325923513, 0.17433175937066064], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 97.5, 81, 256, 85.0, 146.80000000000013, 256.0, 256.0, 0.0862877913561205, 0.06985603421310928, 0.030672613333620962], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3daa60b6-1909-4ffb-bd4c-ba834425f58e", 1, 0, 0.0, 746.0, 746, 746, 746.0, 746.0, 746.0, 746.0, 1.3404825737265416, 0.24217702747989275, 0.924199899463807], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b577b821-8712-473c-baad-7d9b7d6af746", 3, 0, 0.0, 724.6666666666667, 172, 1649, 353.0, 1649.0, 1649.0, 1649.0, 0.019931303440807353, 0.02355812590936572, 0.012781467375778151], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 680.6250000000001, 164, 1108, 916.0, 1100.3, 1108.0, 1108.0, 0.07532814824579574, 56.367937471163444, 0.15736888782697125], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fd754f62-0a28-40ab-9edd-7c49d73fdb82", 3, 0, 0.0, 536.6666666666667, 171, 1076, 363.0, 1076.0, 1076.0, 1076.0, 0.02390628735357399, 0.02825642232448801, 0.01533052932504582], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9c39a23c-f58b-4977-a3c6-8b2ed6da9857", 3, 0, 0.0, 306.6666666666667, 197, 456, 267.0, 456.0, 456.0, 456.0, 0.02047474099452642, 0.028226083369732875, 0.013129960859120132], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 259.66666666666663, 161, 473, 317.0, 388.40000000000003, 473.0, 473.0, 0.0914717809555752, 0.14176339489892367, 0.20572217923895478], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 4, 57.142857142857146, 392.57142857142856, 79, 1017, 85.0, 1017.0, 1017.0, 1017.0, 0.054507794614629894, 27.955593911090002, 0.07331328792963823], "isController": false}, {"data": ["register", 23, 4, 17.391304347826086, 1347.9999999999998, 333, 2869, 1286.0, 2018.6000000000001, 2706.9999999999977, 2869.0, 0.0911768553499011, 0.029003778884233142, 0.041136432784818655], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 305.375, 160, 1099, 166.5, 1034.6000000000001, 1099.0, 1099.0, 0.08392386007794428, 12.664071556236854, 0.186062639982376], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 97.57142857142857, 82, 248, 85.5, 170.5, 248.0, 248.0, 0.07948358380124562, 0.061708446408193625, 0.02825393017934903], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 402.56250000000006, 162, 1100, 318.5, 1093.7, 1100.0, 1100.0, 0.09066080393467889, 20.450756619301117, 0.1995489447932367], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 81.75, 79, 85, 81.5, 85.0, 85.0, 85.0, 0.044696982394976055, 0.033217191018141384, 0.022435789991228215], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 80.25, 78, 85, 80.0, 85.0, 85.0, 85.0, 0.0446982310675055, 0.01196026885985987, 0.025491959905686732], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 80.62499999999999, 79, 82, 81.0, 82.0, 82.0, 82.0, 0.0446979813274183, 0.012047502779655713, 0.026277524178814272], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 100.375, 79, 236, 81.0, 236.0, 236.0, 236.0, 0.044697731590121796, 0.012047435467650018, 0.02632102748910493], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cddd374d-4ad7-4b5e-b6a9-913930c194e8", 1, 0, 0.0, 302.0, 302, 302, 302.0, 302.0, 302.0, 302.0, 3.3112582781456954, 0.5982253725165563, 2.282957367549669], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 82.0, 81, 83, 82.0, 83.0, 83.0, 83.0, 0.027731558513588463, 0.008178643233499722, 0.017142652870216307], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 942.0370370370373, 626, 1534, 869.0, 1322.0, 1383.75, 1534.0, 0.22852499809562501, 273.3953458662367, 0.4512476036614783], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 4, 17.391304347826086, 1347.9999999999998, 333, 2869, 1286.0, 2018.6000000000001, 2706.9999999999977, 2869.0, 0.09043795563035255, 0.028768731470049307, 0.04080306201291296], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 10, 0, 0.0, 127.1, 78, 241, 80.5, 240.4, 241.0, 241.0, 0.0634505688343496, 0.01710191113113329, 0.0373639580147586], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 10, 0, 0.0, 127.39999999999999, 79, 237, 80.5, 236.9, 237.0, 237.0, 0.06351545330979028, 0.01711939952490441, 0.03734013954345092], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 154.71428571428572, 78, 785, 82.5, 515.0, 785.0, 785.0, 0.07734422045312664, 4.990390886986283, 0.044995172891955655], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 153.85714285714286, 79, 628, 81.5, 432.5, 628.0, 628.0, 0.07734763896332064, 1.6438423510091105, 0.04507269642156673], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 94.85714285714286, 80, 236, 82.5, 170.5, 236.0, 236.0, 0.07741350423285982, 0.057530934298053046, 0.03885795036688471], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 10, 0, 0.0, 110.9, 78, 238, 80.0, 237.6, 238.0, 238.0, 0.06351585673363355, 0.016995453852554288, 0.036223887043400384], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 80.92857142857143, 78, 85, 81.0, 84.0, 85.0, 85.0, 0.07741564459583503, 0.029020066549805906, 0.04368670234237621], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 10, 0, 0.0, 113.5, 79, 246, 81.5, 244.70000000000002, 246.0, 246.0, 0.06351504989107169, 0.047202102506939014, 0.03188157777735434], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 674.0714285714286, 79, 1649, 484.5, 1525.0, 1649.0, 1649.0, 0.07520129775953847, 0.014519893429018032, 0.051176329585802], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 87.2, 82, 108, 84.5, 106.30000000000001, 108.0, 108.0, 0.06809113317263826, 0.05359516927455707, 0.024204269994961256], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1608.4761904761904, 878, 2445, 1420.0, 2296.2000000000003, 2432.1, 2445.0, 0.0980483705294612, 0.05074769177794378, 0.04509842042907834], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 0, 0.0, 288.79999999999995, 159, 485, 317.5, 483.4, 485.0, 485.0, 0.06341757300948092, 0.09828485191996703, 0.14262760804769], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0a29e130-99f3-494e-a863-d9d5cf80b958", 3, 0, 0.0, 588.0, 181, 1401, 182.0, 1401.0, 1401.0, 1401.0, 0.02540478287378904, 0.021178922180915927, 0.01629147860070456], "isController": false}, {"data": ["addBook", 58, 9, 15.517241379310345, 906.7241379310343, 408, 1736, 756.5, 1479.9, 1635.1, 1736.0, 0.26810023250761544, 95.05293498973823, 0.9719536244377985], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8a40ec13-2ccf-49e8-ba7f-a547f96409e3", 1, 0, 0.0, 204.0, 204, 204, 204.0, 204.0, 204.0, 204.0, 4.901960784313726, 0.8856081495098039, 3.379672181372549], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ddf38de1-cb4b-46a8-8be4-da8058086f65", 3, 0, 0.0, 283.3333333333333, 177, 490, 183.0, 490.0, 490.0, 490.0, 0.019996800511918093, 0.020055384888417852, 0.012823469078280808], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 145.77777777777777, 79, 394, 83.0, 325.5, 341.0, 394.0, 0.22905814683475575, 0.1702277829504386, 0.11072635027656651], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 508.1851851851853, 388, 721, 470.0, 669.5, 711.75, 721.0, 0.2289454940134993, 67.31757694582471, 0.11514348575874232], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 129.27777777777777, 78, 333, 85.0, 241.0, 246.0, 333.0, 0.2293198119577542, 0.4057885735033697, 0.11152467417476718], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/269b48e6-a0ce-473f-bb37-46adf9524dc1", 1, 0, 0.0, 192.0, 192, 192, 192.0, 192.0, 192.0, 192.0, 5.208333333333333, 1.6632080078125, 3.1077067057291665], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=93b65119-6f2b-4c42-8227-e44c31f965d1", 1, 0, 0.0, 202.0, 202, 202, 202.0, 202.0, 202.0, 202.0, 4.9504950495049505, 0.8943765470297029, 3.4131342821782176], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 794.7592592592591, 545, 1178, 781.0, 1007.0, 1039.5, 1178.0, 0.22886980698646278, 205.9374546366268, 0.11488191483500182], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 98.6875, 80, 237, 88.0, 150.2000000000001, 237.0, 237.0, 0.09411211105229104, 0.07030836421386978, 0.03345391447561908], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 9, 5.294117647058823, 144.8588235294117, 79, 563, 87.0, 289.70000000000005, 336.1999999999998, 555.8999999999999, 0.697018401285794, 1.5065215104491259, 0.335408073523141], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 111.75, 82, 257, 90.0, 257.0, 257.0, 257.0, 0.044094627069691555, 0.034147499283462314, 0.01567426196617942], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4a17e35d-8cc6-400d-816f-faf45d1a0c3a", 1, 0, 0.0, 449.0, 449, 449, 449.0, 449.0, 449.0, 449.0, 2.2271714922048997, 0.40236984966592426, 1.5355303452115812], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 106.46666666666665, 80, 247, 85.0, 242.2, 247.0, 247.0, 0.08957576915727117, 0.07269283610321518, 0.031841386692623735], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/93b65119-6f2b-4c42-8227-e44c31f965d1", 3, 0, 0.0, 335.0, 170, 437, 398.0, 437.0, 437.0, 437.0, 0.09139932364500503, 0.042962442494592204, 0.058612196478079394], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ddf38de1-cb4b-46a8-8be4-da8058086f65", 1, 0, 0.0, 566.0, 566, 566, 566.0, 566.0, 566.0, 566.0, 1.7667844522968197, 0.31919445671378094, 1.2181150618374559], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cddede03-1787-4c61-95f1-b15ca30fac9f", 3, 0, 0.0, 315.3333333333333, 179, 460, 307.0, 460.0, 460.0, 460.0, 0.0342106463531451, 0.028520008239064, 0.021938467876203075], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 183.25, 160, 317, 165.0, 317.0, 317.0, 317.0, 0.04467701311828798, 0.0692406443542217, 0.10047964962052462], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b1a67125-6618-4866-9127-b5e10c49f276", 2, 0, 0.0, 327.0, 307, 347, 327.0, 347.0, 347.0, 347.0, 0.025712889871692683, 0.02925343427785349, 0.015982670315754288], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 262.2857142857143, 161, 868, 169.0, 671.0, 868.0, 868.0, 0.07730834433136566, 6.717515956925448, 0.17245541655392535], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3daa60b6-1909-4ffb-bd4c-ba834425f58e", 3, 0, 0.0, 296.6666666666667, 192, 473, 225.0, 473.0, 473.0, 473.0, 0.04757675716823141, 0.030587270640383152, 0.030509834512179652], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1d9cf959-3c47-48c8-9944-77b38bf34d87", 1, 0, 0.0, 621.0, 621, 621, 621.0, 621.0, 621.0, 621.0, 1.6103059581320451, 0.5142285628019324, 0.9608368558776168], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 100.58823529411767, 81, 250, 88.0, 145.99999999999991, 250.0, 250.0, 0.07594676578464177, 0.06296758217886804, 0.02699670190000938], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cddd374d-4ad7-4b5e-b6a9-913930c194e8", 3, 0, 0.0, 455.66666666666663, 289, 748, 330.0, 748.0, 748.0, 748.0, 0.09229633275904503, 0.04176168702313562, 0.0591874269320699], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/805ac65e-4022-4545-ab80-75e7bc9d048a", 3, 0, 0.0, 368.3333333333333, 313, 479, 313.0, 479.0, 479.0, 479.0, 0.068686036128855, 0.031078642649449366, 0.044046709366485796], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 99.875, 80, 255, 86.5, 157.0000000000001, 255.0, 255.0, 0.07718133755257979, 0.059921057963184504, 0.027435553583143597], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9c39a23c-f58b-4977-a3c6-8b2ed6da9857", 1, 0, 0.0, 406.0, 406, 406, 406.0, 406.0, 406.0, 406.0, 2.4630541871921183, 0.4449853756157635, 1.6981604064039408], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fd754f62-0a28-40ab-9edd-7c49d73fdb82", 1, 0, 0.0, 1311.0, 1311, 1311, 1311.0, 1311.0, 1311.0, 1311.0, 0.7627765064836003, 0.13780630244088482, 0.525898646071701], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 104.8125, 80, 242, 83.0, 237.1, 242.0, 242.0, 0.09118627646539196, 0.06776636366226883, 0.04577123642891745], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 140.4375, 79, 254, 81.0, 247.70000000000002, 254.0, 254.0, 0.09110631537589896, 0.05003507237257928, 0.0505244129336803], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 286.5, 79, 1017, 157.5, 916.9000000000001, 1017.0, 1017.0, 0.0907127184900868, 15.324264970078977, 0.05186747722260334], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 197.49999999999997, 78, 626, 81.0, 567.9000000000001, 626.0, 626.0, 0.09098560152855811, 5.036073036559152, 0.05211235868798762], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 19.047619047619047, 0.31545741324921134], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 9.523809523809524, 0.15772870662460567], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 9.523809523809524, 0.15772870662460567], "isController": false}, {"data": ["401/Unauthorized", 13, 61.904761904761905, 1.025236593059937], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1268, 21, "401/Unauthorized", 13, "406/Not Acceptable", 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
