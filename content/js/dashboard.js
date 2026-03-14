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

    var data = {"OkPercent": 98.49284099472494, "KoPercent": 1.5071590052750565};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7977124183006536, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.15789473684210525, 500, 1500, "see books"], "isController": true}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4824561403508772, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.6818181818181818, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6818181818181818, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.2619047619047619, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=67af0d24-753f-4cfb-a48c-8545dde57786"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.7631578947368421, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b93f8235-ec38-4304-9b5a-bc44e5aba484"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.7631578947368421, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.5454545454545454, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9371584699453552, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6deeb89a-ebe9-4b97-9e2e-79e6ec93437b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ffe52673-6993-44b0-bc4c-b260ce839814"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/67af0d24-753f-4cfb-a48c-8545dde57786"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b93f8235-ec38-4304-9b5a-bc44e5aba484"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/5cec0f85-0cfe-4f08-b292-9cb9993d9149"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6deeb89a-ebe9-4b97-9e2e-79e6ec93437b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7f0a39dc-67cb-4eeb-bdab-b89b20914b4f"], "isController": false}, {"data": [0.027777777777777776, 500, 1500, "login"], "isController": true}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ff10a1a4-19a5-4b19-a736-b39759871d36"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ff10a1a4-19a5-4b19-a736-b39759871d36"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7f0a39dc-67cb-4eeb-bdab-b89b20914b4f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3d2dd014-2563-4e5c-b54f-12f28ae325c1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5ff59897-99c6-4666-90b7-d4ad075f23b7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.6842105263157895, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1b03129b-1829-454a-8a8d-4dd6bc4c964d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5cec0f85-0cfe-4f08-b292-9cb9993d9149"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b35b412f-9aa9-4b16-b111-12813ce15b3b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5ff59897-99c6-4666-90b7-d4ad075f23b7"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b35b412f-9aa9-4b16-b111-12813ce15b3b"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=234f6c3e-3dce-49b1-bf1a-0797ba53044e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/812fcd11-0090-4ef0-aa88-1ef5733b008d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/234f6c3e-3dce-49b1-bf1a-0797ba53044e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1b03129b-1829-454a-8a8d-4dd6bc4c964d"], "isController": false}, {"data": [0.2619047619047619, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1327, 20, 1.5071590052750565, 345.48982667671487, 106, 2227, 123.0, 909.0, 1107.0, 1568.920000000001, 5.212957361387189, 708.33684866882, 3.8307399799358106], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1644.070175438597, 1317, 2088, 1608.0, 1950.2, 1971.9999999999995, 2088.0, 0.24368867702699815, 293.23960565587527, 1.1982153211239606], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 308.52941176470586, 223, 678, 234.0, 501.99999999999983, 678.0, 678.0, 0.07696939787292804, 0.11928753361751643, 0.17310597978647785], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 120.29411764705883, 113, 138, 118.0, 133.2, 138.0, 138.0, 0.09311088959239339, 0.07228823947846948, 0.033098011534796086], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 354.2105263157895, 226, 666, 239.0, 564.0, 666.0, 666.0, 0.11713716762328687, 0.18153973146304322, 0.26344423538713835], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 118.0, 110, 129, 116.0, 129.0, 129.0, 129.0, 0.07198848184290514, 0.05349925261958087, 0.03613484342505199], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 161.88888888888889, 106, 341, 114.0, 341.0, 341.0, 341.0, 0.07199769607372565, 0.01926500851972737, 0.04106118604204665], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 190.22222222222223, 113, 342, 115.0, 342.0, 342.0, 342.0, 0.0719930886634883, 0.01940438717883083, 0.04232406189005855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 148.33333333333334, 106, 449, 112.0, 449.0, 449.0, 449.0, 0.07199654416588003, 0.019405318544709855, 0.04239640247268131], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 114.0, 114, 114, 114.0, 114.0, 114.0, 114.0, 8.771929824561402, 2.58703399122807, 5.422491776315789], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1060.3859649122808, 859, 1615, 914.0, 1474.4, 1493.4999999999993, 1615.0, 0.23924449108079748, 286.2195861752361, 0.4724144150052466], "isController": false}, {"data": ["deleteBook", 11, 1, 9.090909090909092, 579.6363636363636, 115, 1393, 466.0, 1285.4000000000003, 1393.0, 1393.0, 0.06424783309581104, 0.012274621521855945, 0.04338896185722964], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 11, 1, 9.090909090909092, 579.6363636363636, 115, 1393, 466.0, 1285.4000000000003, 1393.0, 1393.0, 0.06636781040526599, 0.012679645595892436, 0.04482066173232052], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 6, 28.571428571428573, 1103.6190476190475, 340, 2099, 1027.0, 1723.4, 2061.9999999999995, 2099.0, 0.08439429012345678, 0.026514500747492283, 0.03807633011429398], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 147.26315789473682, 110, 336, 114.0, 325.0, 336.0, 336.0, 0.09043527927842167, 0.038496349865537016, 0.05077688069682763], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 3, 0, 0.0, 183.33333333333334, 106, 332, 112.0, 332.0, 332.0, 332.0, 0.10138217701328106, 0.02732566489811091, 0.05970063744043797], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 127.31578947368422, 111, 349, 114.0, 125.0, 349.0, 349.0, 0.09043570972993041, 0.06720856943796587, 0.04539448711053148], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 3, 0, 0.0, 190.66666666666666, 114, 343, 115.0, 343.0, 343.0, 343.0, 0.10135135135135134, 0.027317356418918918, 0.059583509290540536], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 243.3157894736842, 109, 779, 116.0, 759.0, 779.0, 779.0, 0.09043743157694321, 2.8209264481888714, 0.05243753421152839], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 218.47368421052633, 108, 1017, 114.0, 757.0, 1017.0, 1017.0, 0.09043786204894115, 8.587720189419722, 0.052349465583633605], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 256.6470588235294, 106, 1016, 113.0, 1014.4, 1016.0, 1016.0, 0.09125116076844213, 9.681460900890503, 0.052723125862189274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 232.58823529411765, 110, 803, 116.0, 610.9999999999998, 803.0, 803.0, 0.09125018115844788, 3.178240454962668, 0.05281167136784022], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 126.29411764705884, 110, 322, 114.0, 157.19999999999985, 322.0, 322.0, 0.09125067096081589, 0.06781421933709071, 0.045803559447128286], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 3, 0, 0.0, 113.66666666666667, 112, 115, 114.0, 115.0, 115.0, 115.0, 0.10135135135135134, 0.02711940456081081, 0.057801942567567564], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 150.99999999999997, 107, 342, 114.0, 335.6, 342.0, 342.0, 0.09125214039946966, 0.040541363387494166, 0.051140618206412344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 3, 0, 0.0, 187.33333333333334, 109, 335, 118.0, 335.0, 335.0, 335.0, 0.10133765707336846, 0.07531050491487637, 0.050866753648155655], "isController": false}, {"data": ["deleteAccount", 11, 1, 9.090909090909092, 515.9090909090909, 114, 1134, 480.0, 1063.0000000000002, 1134.0, 1134.0, 0.06536918734214826, 0.012326363096122419, 0.04448865324617442], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 3, 0, 0.0, 196.33333333333331, 120, 345, 124.0, 345.0, 345.0, 345.0, 0.08828722778104768, 0.06949170467922308, 0.031383350500294296], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 18, 0, 0.0, 1443.833333333333, 929, 2227, 1418.5, 1967.8000000000004, 2227.0, 2227.0, 0.07812025310962008, 0.04043333412900258, 0.03593226485803814], "isController": false}, {"data": ["goToProfile", 11, 1, 9.090909090909092, 233.09090909090912, 113, 378, 212.0, 364.20000000000005, 378.0, 378.0, 0.06475501998575389, 0.1562076884812593, 0.04185735977594763], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 3, 0, 0.0, 378.6666666666667, 224, 679, 233.0, 679.0, 679.0, 679.0, 0.10094552306605202, 0.15644584482990678, 0.22702884728624784], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 127.76470588235294, 110, 337, 116.0, 163.39999999999986, 337.0, 337.0, 0.07700844827976716, 0.0572299112704129, 0.03865463126543], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 139.47058823529412, 110, 340, 114.0, 334.4, 340.0, 340.0, 0.07700949481771399, 0.020606056230521128, 0.043919477513227514], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 656.8, 555, 752, 677.0, 752.0, 752.0, 752.0, 0.025565901223584032, 7.517223827547769, 0.014580553041575269], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 920.6, 798, 1017, 976.0, 1017.0, 1017.0, 1017.0, 0.02552192333214231, 22.964671477017507, 0.014530548147108366], "isController": false}, {"data": ["addBook", 63, 10, 15.873015873015873, 1017.5555555555555, 563, 1946, 898.0, 1622.4, 1828.3999999999999, 1946.0, 0.27761987229485874, 69.55931322407008, 1.013670575378202], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 328.0, 316, 334, 332.0, 334.0, 334.0, 334.0, 0.025611080377814656, 0.04531960707480484, 0.014181135326387607], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 127.3529411764706, 109, 335, 116.0, 160.59999999999985, 335.0, 335.0, 0.09239080222390096, 0.06866152391834827, 0.046375851897544035], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 139.17647058823533, 107, 341, 113.0, 340.2, 341.0, 341.0, 0.09239331289810648, 0.024722429427813646, 0.05269306126220135], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 144.05882352941177, 106, 436, 114.0, 343.99999999999994, 436.0, 436.0, 0.09239381504932198, 0.024903020462512568, 0.05431745767548031], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 198.7719298245614, 110, 472, 116.0, 458.2, 470.0, 472.0, 0.24001010568866057, 0.17836688518463933, 0.11602051007410838], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 137.23529411764707, 106, 335, 113.0, 327.0, 335.0, 335.0, 0.09239431720599584, 0.02490315580942857, 0.05440798171407763], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=67af0d24-753f-4cfb-a48c-8545dde57786", 1, 0, 0.0, 1771.0, 1771, 1771, 1771.0, 1771.0, 1771.0, 1771.0, 0.564652738565782, 0.10201245765104461, 0.3893015951439865], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 637.122807017544, 537, 924, 569.0, 805.4000000000001, 917.1, 924.0, 0.2397516677462502, 70.4949508219907, 0.12057823133722544], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 115.8, 113, 118, 116.0, 118.0, 118.0, 118.0, 0.025639053406148245, 0.019054023087967595, 0.014396929402866448], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 172.28070175438594, 111, 447, 117.0, 343.2, 349.2, 447.0, 0.2401840568351326, 0.4250131943215432, 0.11680826201552347], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 549.6842105263158, 107, 1032, 340.0, 1031.0, 1032.0, 1032.0, 0.09331702741064894, 39.78699717009975, 0.05106152723138203], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 139.8235294117647, 111, 341, 114.0, 336.2, 341.0, 341.0, 0.07700879712258894, 0.020756277349447804, 0.045272749870897015], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b93f8235-ec38-4304-9b5a-bc44e5aba484", 1, 0, 0.0, 1019.0, 1019, 1019, 1019.0, 1019.0, 1019.0, 1019.0, 0.9813542688910696, 0.17729544896957802, 0.6765977674190383], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 857.4385964912282, 743, 1135, 794.0, 1022.2, 1113.0, 1135.0, 0.2397526761866706, 215.7298794730173, 0.12034460503901238], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 433.15789473684214, 110, 808, 342.0, 798.0, 808.0, 808.0, 0.09342026334680552, 13.024722643228014, 0.051209246946632446], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 139.99999999999997, 107, 342, 114.0, 334.8, 342.0, 342.0, 0.07700879712258894, 0.020756277349447804, 0.04534795377433705], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 136.5263157894737, 115, 367, 118.0, 156.0, 367.0, 367.0, 0.11534795621634421, 0.08617303369678059, 0.041002593811278604], "isController": false}, {"data": ["deleteBooks", 11, 1, 9.090909090909092, 857.1818181818181, 114, 1771, 758.0, 1687.2000000000003, 1771.0, 1771.0, 0.06599868002639947, 0.01260912281754365, 0.045075270369592614], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 183, 10, 5.46448087431694, 173.03278688524594, 110, 600, 121.0, 322.99999999999994, 415.1999999999998, 570.5999999999999, 0.7468442768466032, 1.5113162658500352, 0.3613182809011921], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 147.88888888888889, 116, 330, 122.0, 330.0, 330.0, 330.0, 0.07239731647280273, 0.05606549996380134, 0.025734983589941602], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6deeb89a-ebe9-4b97-9e2e-79e6ec93437b", 3, 0, 0.0, 310.3333333333333, 204, 482, 245.0, 482.0, 482.0, 482.0, 0.02131378149111215, 0.02519216816218367, 0.013668017427568667], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ffe52673-6993-44b0-bc4c-b260ce839814", 1, 0, 0.0, 216.0, 216, 216, 216.0, 216.0, 216.0, 216.0, 4.62962962962963, 1.4784071180555556, 2.7624059606481484], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/67af0d24-753f-4cfb-a48c-8545dde57786", 3, 0, 0.0, 339.0, 238, 480, 299.0, 480.0, 480.0, 480.0, 0.042896975763208695, 0.027578622113391005, 0.027508802816901406], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 300.0588235294118, 222, 675, 232.0, 571.8, 675.0, 675.0, 0.09233459886048241, 0.1431005941324078, 0.20766267692938575], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b93f8235-ec38-4304-9b5a-bc44e5aba484", 3, 0, 0.0, 765.3333333333334, 212, 1134, 950.0, 1134.0, 1134.0, 1134.0, 0.015986443495915464, 0.022038602931380855, 0.010251723205388497], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 129.57894736842107, 113, 336, 118.0, 127.0, 336.0, 336.0, 0.09027243269952584, 0.07325819489580661, 0.032089028811159576], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5cec0f85-0cfe-4f08-b292-9cb9993d9149", 3, 0, 0.0, 798.6666666666666, 231, 1749, 416.0, 1749.0, 1749.0, 1749.0, 0.027588236376009267, 0.027669061287267108, 0.01769167501977157], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6deeb89a-ebe9-4b97-9e2e-79e6ec93437b", 1, 0, 0.0, 1336.0, 1336, 1336, 1336.0, 1336.0, 1336.0, 1336.0, 0.7485029940119761, 0.13522759169161677, 0.5160577282934131], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 18, 0, 0.0, 487.3333333333333, 152, 1109, 422.0, 1013.6000000000001, 1109.0, 1109.0, 0.07708779443254818, 0.04735177997858672, 0.034855125802997856], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 152.57894736842104, 109, 388, 116.0, 342.0, 388.0, 388.0, 0.09341934468788106, 0.06942589971433348, 0.04689213200153405], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 197.1578947368421, 112, 344, 118.0, 344.0, 344.0, 344.0, 0.0933156524728648, 0.09135878640538284, 0.04950679301114876], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7f0a39dc-67cb-4eeb-bdab-b89b20914b4f", 1, 0, 0.0, 443.0, 443, 443, 443.0, 443.0, 443.0, 443.0, 2.257336343115124, 0.40781955417607224, 1.5563275959367946], "isController": false}, {"data": ["login", 18, 0, 0.0, 2550.7222222222217, 1487, 3946, 2468.5, 3226.000000000001, 3946.0, 3946.0, 0.07829593252630526, 26.125885484858436, 0.15419609107556864], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 345.22222222222223, 223, 565, 247.0, 565.0, 565.0, 565.0, 0.07192059965797759, 0.11146288247774457, 0.1617511142698461], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ff10a1a4-19a5-4b19-a736-b39759871d36", 3, 0, 0.0, 412.0, 309, 533, 394.0, 533.0, 533.0, 533.0, 0.0462620281273131, 0.029742026546693806, 0.029666730276955343], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 119.47058823529413, 112, 135, 118.0, 127.8, 135.0, 135.0, 0.08119015211213793, 0.06572913681734605, 0.02886056188361153], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 425.2352941176471, 227, 1337, 232.0, 1171.3999999999999, 1337.0, 1337.0, 0.09119291055584762, 12.95981280140598, 0.20234998598579534], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ff10a1a4-19a5-4b19-a736-b39759871d36", 1, 0, 0.0, 472.0, 472, 472, 472.0, 472.0, 472.0, 472.0, 2.1186440677966103, 0.38276284427966106, 1.4607057733050848], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7f0a39dc-67cb-4eeb-bdab-b89b20914b4f", 3, 0, 0.0, 413.6666666666667, 216, 542, 483.0, 542.0, 542.0, 542.0, 0.019158433861893236, 0.022644620231944773, 0.012285844631487524], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3d2dd014-2563-4e5c-b54f-12f28ae325c1", 1, 0, 0.0, 215.0, 215, 215, 215.0, 215.0, 215.0, 215.0, 4.651162790697675, 1.4852834302325582, 2.7752543604651163], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5ff59897-99c6-4666-90b7-d4ad075f23b7", 3, 0, 0.0, 300.0, 202, 487, 211.0, 487.0, 487.0, 487.0, 0.03912363067292644, 0.03238652109415754, 0.025089047013562855], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 118.94117647058822, 112, 142, 117.0, 131.6, 142.0, 142.0, 0.0966062782715432, 0.08009641626224626, 0.03434051297933762], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 728.2631578947368, 228, 1151, 730.0, 1148.0, 1151.0, 1151.0, 0.09326251926607305, 52.927102839720995, 0.19844649645847853], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1b03129b-1829-454a-8a8d-4dd6bc4c964d", 3, 0, 0.0, 344.6666666666667, 190, 466, 378.0, 466.0, 466.0, 466.0, 0.017166890789963092, 0.023665944822751854, 0.011008715773511488], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 132.10526315789477, 115, 349, 118.0, 138.0, 349.0, 349.0, 0.0893898904738605, 0.06939937785812413, 0.031775312629380104], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5cec0f85-0cfe-4f08-b292-9cb9993d9149", 1, 0, 0.0, 422.0, 422, 422, 422.0, 422.0, 422.0, 422.0, 2.3696682464454977, 0.4281138921800948, 1.6337751777251186], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b35b412f-9aa9-4b16-b111-12813ce15b3b", 1, 0, 0.0, 721.0, 721, 721, 721.0, 721.0, 721.0, 721.0, 1.3869625520110958, 0.2505742891816921, 0.956245665742025], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5ff59897-99c6-4666-90b7-d4ad075f23b7", 1, 0, 0.0, 758.0, 758, 758, 758.0, 758.0, 758.0, 758.0, 1.3192612137203166, 0.23834309036939313, 0.9095687664907651], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b35b412f-9aa9-4b16-b111-12813ce15b3b", 3, 0, 0.0, 428.0, 199, 779, 306.0, 779.0, 779.0, 779.0, 0.026012086949735978, 0.02608829423572153, 0.016680928154615846], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 407.4736842105263, 226, 1131, 238.0, 871.0, 1131.0, 1131.0, 0.0903862346521795, 11.507794586280797, 0.2008464269488937], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, 28.571428571428573, 772.8571428571429, 113, 1136, 914.0, 1136.0, 1136.0, 1136.0, 0.03570900223946457, 30.517287939539557, 0.06427421134117911], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=234f6c3e-3dce-49b1-bf1a-0797ba53044e", 1, 0, 0.0, 1021.0, 1021, 1021, 1021.0, 1021.0, 1021.0, 1021.0, 0.9794319294809011, 0.17694815132223313, 0.675272404505387], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/812fcd11-0090-4ef0-aa88-1ef5733b008d", 1, 0, 0.0, 203.0, 203, 203, 203.0, 203.0, 203.0, 203.0, 4.926108374384237, 1.573083435960591, 2.939308805418719], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 125.73684210526315, 107, 324, 116.0, 120.0, 324.0, 324.0, 0.11746159315013446, 0.0872932347531761, 0.05896021374918859], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 160.94736842105266, 107, 344, 114.0, 343.0, 344.0, 344.0, 0.11746522411128285, 0.03143112442040186, 0.066991885625966], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 213.42105263157896, 109, 448, 115.0, 344.0, 448.0, 448.0, 0.11722244501341889, 0.03159511213252306, 0.06891397646296696], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/234f6c3e-3dce-49b1-bf1a-0797ba53044e", 3, 0, 0.0, 337.3333333333333, 201, 440, 371.0, 440.0, 440.0, 440.0, 0.02492377478877101, 0.02945905802670167, 0.015983019639934534], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1b03129b-1829-454a-8a8d-4dd6bc4c964d", 1, 0, 0.0, 1352.0, 1352, 1352, 1352.0, 1352.0, 1352.0, 1352.0, 0.7396449704142012, 0.1336272651627219, 0.5099505362426036], "isController": false}, {"data": ["register", 21, 6, 28.571428571428573, 1103.6190476190475, 340, 2099, 1027.0, 1723.4, 2061.9999999999995, 2099.0, 0.08435327150104639, 0.026501613758420264, 0.03805782366551116], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 158.99999999999997, 106, 341, 114.0, 340.0, 341.0, 341.0, 0.1174644979010949, 0.031660352949904484, 0.0691709885101174], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 30.0, 0.45214770158251694], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.0, 0.07535795026375283], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.0, 0.07535795026375283], "isController": false}, {"data": ["401/Unauthorized", 12, 60.0, 0.9042954031650339], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1327, 20, "401/Unauthorized", 12, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 11, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 183, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
