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

    var data = {"OkPercent": 98.37157660991858, "KoPercent": 1.6284233900814211};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7442602040816326, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5a05a5ec-60ab-4da3-8e3e-33569d4606d4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f4cec5ab-2b17-478d-8003-f89d7a4884e6"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6071428571428571, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/efbf7148-ba43-4ecc-a66c-1a1175e480e4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=72bccbf7-42f5-49d7-b377-9567585f9659"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/3ce06a0e-9a5f-4950-8805-2ce33a895a35"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/27aa0b3b-34d0-43e5-b48f-f1c2bbf408ff"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=df9a595d-9da7-4cc8-825e-bb7c4cdaa62f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a052582a-0222-4c4c-865e-721ca4f61b61"], "isController": false}, {"data": [0.85, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7045454545454546, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4765ab8c-2ae4-43fb-9470-7f7d26ca2f66"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/1d637ab3-68df-48d7-bb8c-45563c72b5bd"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/72bccbf7-42f5-49d7-b377-9567585f9659"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7f8a2b88-f3ac-4775-8643-070968e7038d"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.15, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2819faec-91b2-4b50-865f-39d8629cc510"], "isController": false}, {"data": [0.18181818181818182, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.7941176470588235, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.7380952380952381, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c5ed30b5-53fc-4724-b959-99bc36ec5faf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/df9a595d-9da7-4cc8-825e-bb7c4cdaa62f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.31666666666666665, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.18181818181818182, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1ed025a2-8f46-4d2d-b5db-40a85252c3ad"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.29545454545454547, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.85, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a052582a-0222-4c4c-865e-721ca4f61b61"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=27aa0b3b-34d0-43e5-b48f-f1c2bbf408ff"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=efbf7148-ba43-4ecc-a66c-1a1175e480e4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f4cec5ab-2b17-478d-8003-f89d7a4884e6"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5a05a5ec-60ab-4da3-8e3e-33569d4606d4"], "isController": false}, {"data": [0.28448275862068967, 500, 1500, "addBook"], "isController": true}, {"data": [0.9083333333333333, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9916666666666667, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.44166666666666665, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9346590909090909, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/c584a878-b5eb-4f85-a369-fde0fe06cd8e"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.775, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ba48da00-5099-459d-b83d-a09da2412cf3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1d637ab3-68df-48d7-bb8c-45563c72b5bd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2819faec-91b2-4b50-865f-39d8629cc510"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4765ab8c-2ae4-43fb-9470-7f7d26ca2f66"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7f8a2b88-f3ac-4775-8643-070968e7038d"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1351, 22, 1.6284233900814211, 445.66025166543244, 128, 3041, 150.0, 1195.0, 1479.5999999999967, 1994.3600000000001, 5.290363002701962, 762.3681791677272, 3.873951582507734], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 60, 0, 0.0, 2175.7333333333345, 1581, 5018, 2115.0, 2703.2, 2831.85, 5018.0, 0.2600780234070221, 312.95997067349373, 1.2788016092327699], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/5a05a5ec-60ab-4da3-8e3e-33569d4606d4", 3, 0, 0.0, 376.66666666666663, 226, 670, 234.0, 670.0, 670.0, 670.0, 0.020278354208772414, 0.023968328167985886, 0.013004022718516165], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f4cec5ab-2b17-478d-8003-f89d7a4884e6", 1, 0, 0.0, 632.0, 632, 632, 632.0, 632.0, 632.0, 632.0, 1.5822784810126582, 0.28586085838607594, 1.0909068433544304], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 537.7142857142858, 133, 1583, 500.0, 1115.5, 1583.0, 1583.0, 0.07530728060030661, 0.014834525698609505, 0.05067062141954224], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 537.7142857142858, 133, 1583, 500.0, 1115.5, 1583.0, 1583.0, 0.07542250068688348, 0.01485722251253899, 0.050748147434826876], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/efbf7148-ba43-4ecc-a66c-1a1175e480e4", 3, 0, 0.0, 332.3333333333333, 228, 517, 252.0, 517.0, 517.0, 517.0, 0.025370837068484347, 0.025445165692708424, 0.01626970996904758], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 200.76470588235293, 129, 401, 134.0, 392.2, 401.0, 401.0, 0.11041327037611955, 0.03929920859664733, 0.062424598290542775], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 164.76470588235296, 129, 402, 133.0, 394.0, 402.0, 402.0, 0.11041111904916542, 0.08205357577774891, 0.05542120624147561], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=72bccbf7-42f5-49d7-b377-9567585f9659", 1, 0, 0.0, 226.0, 226, 226, 226.0, 226.0, 226.0, 226.0, 4.424778761061947, 0.7993985066371682, 3.0506775442477876], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 254.64705882352945, 130, 1053, 135.0, 529.7999999999995, 1053.0, 1053.0, 0.11022498865331, 1.9344206906892305, 0.06435067553329443], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 251.23529411764707, 130, 1362, 134.0, 696.3999999999994, 1362.0, 1362.0, 0.11041470464066509, 5.8722063963400775, 0.06435360715097586], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3ce06a0e-9a5f-4950-8805-2ce33a895a35", 2, 0, 0.0, 387.0, 232, 542, 387.0, 542.0, 542.0, 542.0, 0.026089565478286957, 0.029681976349808892, 0.016216805104423485], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/27aa0b3b-34d0-43e5-b48f-f1c2bbf408ff", 3, 0, 0.0, 416.6666666666667, 258, 511, 481.0, 511.0, 511.0, 511.0, 0.03085245328424365, 0.025720420853173175, 0.01978493911782552], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 231.4, 130, 269, 244.0, 262.4, 269.0, 269.0, 0.07913187062466699, 0.15804736504059466, 0.05114721429438111], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=df9a595d-9da7-4cc8-825e-bb7c4cdaa62f", 1, 0, 0.0, 479.0, 479, 479, 479.0, 479.0, 479.0, 479.0, 2.08768267223382, 0.37716923277661796, 1.4393593423799582], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 134.29411764705878, 131, 142, 134.0, 137.2, 142.0, 142.0, 0.08887262461771701, 0.06604694075594009, 0.04460989165381499], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 187.88235294117644, 130, 524, 132.0, 423.9999999999999, 524.0, 524.0, 0.08887355384430398, 0.03163261371894, 0.05024664044896829], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 937.3333333333333, 780, 1041, 977.0, 1041.0, 1041.0, 1041.0, 0.06522873543224908, 19.179414014937382, 0.03720076317620456], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1295.3333333333335, 1161, 1685, 1167.5, 1685.0, 1685.0, 1685.0, 0.0647920176234288, 58.29997134977971, 0.036888424096151354], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 308.6666666666667, 130, 409, 391.5, 409.0, 409.0, 409.0, 0.06552578985879191, 0.1159499328360654, 0.03628234653313967], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 10, 0, 0.0, 133.20000000000002, 131, 135, 133.0, 135.0, 135.0, 135.0, 0.059006101230867275, 0.04385121390301758, 0.029618296906900175], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 10, 0, 0.0, 132.5, 130, 135, 132.5, 135.0, 135.0, 135.0, 0.059007493951731875, 0.015789114592553253, 0.033652711394347085], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 10, 0, 0.0, 186.1, 130, 402, 132.5, 401.8, 402.0, 402.0, 0.0589139796982426, 0.01587915859054195, 0.03463497634603715], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 10, 0, 0.0, 209.4, 130, 391, 133.0, 391.0, 391.0, 391.0, 0.05891710363518529, 0.015880000589171037, 0.03469434911329759], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 221.33333333333334, 131, 404, 136.0, 404.0, 404.0, 404.0, 0.06571381632988335, 0.04883614670609495, 0.036899848036799736], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 941.3125, 130, 1470, 1239.5, 1461.6, 1470.0, 1470.0, 0.09550756300514547, 53.7208240250767, 0.051018200159975165], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 227.6470588235294, 130, 1195, 134.0, 558.1999999999994, 1195.0, 1195.0, 0.0888740184648843, 4.726603955481958, 0.051798931028533786], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 711.0, 131, 1060, 844.5, 1060.0, 1060.0, 1060.0, 0.09551326440459419, 17.56219834970988, 0.05111452040402111], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 249.35294117647058, 130, 1061, 135.0, 532.9999999999995, 1061.0, 1061.0, 0.08887448309032261, 1.559724714556072, 0.051885993316116076], "isController": false}, {"data": ["deleteBooks", 13, 2, 15.384615384615385, 553.7692307692308, 134, 1203, 500.0, 1091.8, 1203.0, 1203.0, 0.07224108517223943, 0.014321230751918556, 0.049014534350636], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a052582a-0222-4c4c-865e-721ca4f61b61", 1, 0, 0.0, 480.0, 480, 480, 480.0, 480.0, 480.0, 480.0, 2.0833333333333335, 0.3763834635416667, 1.4363606770833335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 10, 0, 0.0, 346.2, 263, 537, 269.0, 536.7, 537.0, 537.0, 0.05886681383370125, 0.09123206401766004, 0.13239284400294335], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 610.9999999999999, 191, 1831, 536.5, 1223.4999999999998, 1754.949999999999, 1831.0, 0.0995822073754204, 0.0611691488663471, 0.04502593946759731], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 167.5, 131, 403, 134.5, 394.6, 403.0, 403.0, 0.09565430534049943, 0.071086842152461, 0.04801397748536788], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4765ab8c-2ae4-43fb-9470-7f7d26ca2f66", 1, 0, 0.0, 496.0, 496, 496, 496.0, 496.0, 496.0, 496.0, 2.0161290322580645, 0.3642420614919355, 1.3900264616935485], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 249.56250000000003, 130, 404, 137.5, 403.3, 404.0, 404.0, 0.09566116814243948, 0.11539595502729333, 0.04953548281985208], "isController": false}, {"data": ["login", 22, 0, 0.0, 2881.9090909090905, 1747, 4713, 2840.0, 3928.4, 4597.649999999999, 4713.0, 0.09782995375311276, 32.05307587657862, 0.1918471101254002], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 139.41176470588235, 132, 174, 136.0, 149.99999999999997, 174.0, 174.0, 0.09144553880249377, 0.07403159342506577, 0.03250603137119896], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1d637ab3-68df-48d7-bb8c-45563c72b5bd", 3, 0, 0.0, 805.3333333333333, 254, 1706, 456.0, 1706.0, 1706.0, 1706.0, 0.0378826144054955, 0.024354870914991417, 0.024293213013940804], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/72bccbf7-42f5-49d7-b377-9567585f9659", 3, 0, 0.0, 358.0, 256, 504, 314.0, 504.0, 504.0, 504.0, 0.07937767899666615, 0.035916332618934226, 0.05090300378366937], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 1127.375, 268, 1607, 1373.5, 1595.8, 1607.0, 1607.0, 0.09542553825967674, 71.40678350703764, 0.1993545729707163], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7f8a2b88-f3ac-4775-8643-070968e7038d", 3, 0, 0.0, 469.33333333333337, 246, 783, 379.0, 783.0, 783.0, 783.0, 0.0275707419286653, 0.027651515586659434, 0.01768045624982768], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 494.99999999999994, 264, 1494, 385.0, 1036.3999999999996, 1494.0, 1494.0, 0.11012502429228477, 7.910504186370408, 0.24601631834229448], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, 40.0, 963.8, 130, 1835, 1293.0, 1833.2, 1835.0, 1835.0, 0.09591222113521704, 68.85688218142755, 0.1551829765398707], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2819faec-91b2-4b50-865f-39d8629cc510", 1, 0, 0.0, 500.0, 500, 500, 500.0, 500.0, 500.0, 500.0, 2.0, 0.361328125, 1.37890625], "isController": false}, {"data": ["register", 22, 6, 27.272727272727273, 1184.4545454545455, 187, 2176, 1212.5, 1983.0, 2149.2999999999997, 2176.0, 0.09723155252271681, 0.03059202966446275, 0.04386814186083513], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 20, 0, 0.0, 140.8, 133, 186, 137.0, 167.10000000000005, 185.2, 186.0, 0.0953961803369393, 0.07406246422643238, 0.033910360979146396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 431.94117647058823, 263, 1330, 278.0, 793.1999999999996, 1330.0, 1330.0, 0.08881087463039003, 6.379465521790009, 0.1984010859088487], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 21, 0, 0.0, 526.0476190476189, 263, 1572, 273.0, 1307.4, 1549.0999999999997, 1572.0, 0.0987612517283219, 11.391130306359756, 0.21970979917369754], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c5ed30b5-53fc-4724-b959-99bc36ec5faf", 1, 0, 0.0, 304.0, 304, 304, 304.0, 304.0, 304.0, 304.0, 3.289473684210526, 1.0504471628289473, 1.9627621299342106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 133.42857142857142, 131, 136, 133.0, 136.0, 136.0, 136.0, 0.04207919304130373, 0.03127174404729701, 0.02112178244456066], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/df9a595d-9da7-4cc8-825e-bb7c4cdaa62f", 3, 0, 0.0, 315.3333333333333, 241, 462, 243.0, 462.0, 462.0, 462.0, 0.03136598881279733, 0.02584222580898113, 0.020114257148831617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 131.14285714285717, 130, 133, 131.0, 133.0, 133.0, 133.0, 0.04207995190862639, 0.011259674631800422, 0.02399872257288849], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 173.85714285714286, 130, 398, 134.0, 398.0, 398.0, 398.0, 0.04207919304130373, 0.011341657499413897, 0.024737963096547702], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 172.14285714285714, 130, 388, 134.0, 388.0, 388.0, 388.0, 0.04207944599403674, 0.011341725678080216, 0.024779205014066556], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 139.0, 134, 144, 139.0, 144.0, 144.0, 144.0, 0.027867573291717757, 0.008218756966893323, 0.017226732318024747], "isController": false}, {"data": ["https://demoqa.com/books", 60, 0, 0.0, 1438.716666666667, 1037, 2269, 1301.5, 2084.1, 2218.4999999999995, 2269.0, 0.26436376454000704, 316.27097010486426, 0.5220151678709904], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, 27.272727272727273, 1184.4545454545455, 187, 2176, 1212.5, 1983.0, 2149.2999999999997, 2176.0, 0.09849041061547553, 0.030988105044499756, 0.04443610322690399], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 10, 0, 0.0, 168.90000000000003, 131, 399, 134.5, 380.50000000000006, 399.0, 399.0, 0.052039154259664974, 0.014026178296550324, 0.030644150408767556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 10, 0, 0.0, 167.9, 132, 391, 133.5, 373.20000000000005, 391.0, 391.0, 0.052039425068431844, 0.01402625128797577, 0.030593490128121063], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1ed025a2-8f46-4d2d-b5db-40a85252c3ad", 2, 0, 0.0, 260.5, 252, 269, 260.5, 269.0, 269.0, 269.0, 0.01556371786092262, 0.026324569663201146, 0.009674127361794186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 20, 0, 0.0, 251.90000000000006, 129, 1460, 134.0, 397.8, 1406.8999999999992, 1460.0, 0.0957267575432685, 4.331266520344329, 0.05586553741001685], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 20, 0, 0.0, 263.54999999999995, 131, 1037, 134.0, 513.5000000000002, 1011.4499999999996, 1037.0, 0.095727215726067, 1.431860395616651, 0.0559592884117419], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 20, 0, 0.0, 159.45, 131, 530, 133.0, 244.20000000000024, 516.2999999999997, 530.0, 0.09572538302118881, 0.0711396645303952, 0.04804965514930766], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 10, 0, 0.0, 220.2, 132, 399, 139.0, 398.4, 399.0, 399.0, 0.052039425068431844, 0.01392461178588899, 0.029678734609340035], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 20, 0, 0.0, 175.55, 129, 397, 133.0, 395.9, 396.95, 397.0, 0.0957267575432685, 0.03280324142766886, 0.054192188816242916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 10, 0, 0.0, 138.9, 131, 165, 136.0, 163.0, 165.0, 165.0, 0.052039154259664974, 0.0386736292886768, 0.026121216102995892], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 138.6, 135, 144, 138.0, 144.0, 144.0, 144.0, 0.0527646012842904, 0.041531512339002014, 0.018756166862775103], "isController": false}, {"data": ["deleteAccount", 13, 2, 15.384615384615385, 599.6923076923077, 132, 1706, 493.0, 1413.1999999999998, 1706.0, 1706.0, 0.07232387744997135, 0.014033396593545371, 0.049217398273684675], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1569.9545454545457, 1139, 2858, 1381.0, 2393.2, 2807.4499999999994, 2858.0, 0.10064412238325282, 0.05209119615539452, 0.0462923648852657], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 0, 0.0, 361.7, 267, 539, 278.5, 538.5, 539.0, 539.0, 0.05200289136075966, 0.08059432479445858, 0.11695572148811474], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a052582a-0222-4c4c-865e-721ca4f61b61", 3, 0, 0.0, 306.0, 219, 455, 244.0, 455.0, 455.0, 455.0, 0.05384546351969846, 0.03461744480839989, 0.034529805707619134], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=27aa0b3b-34d0-43e5-b48f-f1c2bbf408ff", 1, 0, 0.0, 925.0, 925, 925, 925.0, 925.0, 925.0, 925.0, 1.0810810810810811, 0.1953125, 0.7453547297297297], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=efbf7148-ba43-4ecc-a66c-1a1175e480e4", 1, 0, 0.0, 894.0, 894, 894, 894.0, 894.0, 894.0, 894.0, 1.1185682326621924, 0.20208508109619686, 0.7712003635346756], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f4cec5ab-2b17-478d-8003-f89d7a4884e6", 3, 0, 0.0, 360.0, 255, 476, 349.0, 476.0, 476.0, 476.0, 0.02455453972515285, 0.024626476853253886, 0.015746238039892942], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5a05a5ec-60ab-4da3-8e3e-33569d4606d4", 1, 0, 0.0, 1203.0, 1203, 1203, 1203.0, 1203.0, 1203.0, 1203.0, 0.8312551953449709, 0.15017794056525352, 0.5731114921030757], "isController": false}, {"data": ["addBook", 58, 8, 13.793103448275861, 1321.9655172413793, 666, 2561, 1079.5, 2244.5, 2368.15, 2561.0, 0.2721037372040872, 85.24105884126031, 0.9892761292891524], "isController": true}, {"data": ["https://demoqa.com/books-0", 60, 0, 0.0, 230.6666666666668, 130, 617, 135.0, 534.5, 538.0, 617.0, 0.26604943198446274, 0.19771837669939074, 0.1286078797190518], "isController": false}, {"data": ["https://demoqa.com/books-3", 60, 0, 0.0, 850.1500000000002, 646, 1226, 786.0, 1064.0, 1171.7, 1226.0, 0.2654949489585961, 78.06433025580438, 0.13352529171257518], "isController": false}, {"data": ["https://demoqa.com/books-1", 60, 0, 0.0, 159.33333333333337, 130, 536, 134.5, 161.89999999999998, 396.84999999999997, 536.0, 0.266550569085465, 0.4716695617020142, 0.12963103848101715], "isController": false}, {"data": ["https://demoqa.com/books-2", 60, 0, 0.0, 1199.7, 902, 1730, 1168.0, 1555.6, 1684.1999999999996, 1730.0, 0.2650235208374743, 238.4686299112171, 0.13302938448287285], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 21, 0, 0.0, 150.047619047619, 134, 393, 138.0, 146.8, 368.49999999999966, 393.0, 0.10293562602016557, 0.07690015029826823, 0.03659039831185573], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 8, 4.545454545454546, 229.31818181818176, 131, 3041, 140.0, 393.20000000000005, 429.7000000000001, 1939.1299999999853, 0.7326312284061108, 1.6270011746555386, 0.3493274999479665], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 174.42857142857142, 134, 398, 137.0, 398.0, 398.0, 398.0, 0.043034021467828996, 0.033326151390613665, 0.015297249818642337], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 140.8235294117647, 133, 167, 138.0, 156.6, 167.0, 167.0, 0.11080621296954134, 0.08992183884539927, 0.03938814601651665], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c584a878-b5eb-4f85-a369-fde0fe06cd8e", 1, 0, 0.0, 1184.0, 1184, 1184, 1184.0, 1184.0, 1184.0, 1184.0, 0.8445945945945946, 0.2697094066722973, 0.5039524387668919], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 308.7142857142857, 263, 531, 270.0, 531.0, 531.0, 531.0, 0.042045072317524385, 0.06516165016397578, 0.0945603530734948], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 20, 0, 0.0, 459.04999999999995, 265, 1991, 274.0, 651.2000000000003, 1924.649999999999, 1991.0, 0.09566357035577282, 5.863191266454134, 0.21392579077898846], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ba48da00-5099-459d-b83d-a09da2412cf3", 1, 0, 0.0, 231.0, 231, 231, 231.0, 231.0, 231.0, 231.0, 4.329004329004329, 1.3824066558441557, 2.58302895021645], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 10, 0, 0.0, 166.8, 133, 402, 135.5, 379.70000000000005, 402.0, 402.0, 0.05748084450856752, 0.04765745799587288, 0.02043264394640486], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1d637ab3-68df-48d7-bb8c-45563c72b5bd", 1, 0, 0.0, 520.0, 520, 520, 520.0, 520.0, 520.0, 520.0, 1.9230769230769231, 0.3474308894230769, 1.3258713942307692], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 141.5625, 133, 195, 137.0, 164.90000000000003, 195.0, 195.0, 0.09654198671340908, 0.07495203070035178, 0.03431765933953213], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2819faec-91b2-4b50-865f-39d8629cc510", 3, 0, 0.0, 487.0, 234, 974, 253.0, 974.0, 974.0, 974.0, 0.027216315273796133, 0.027296050572449833, 0.017453170927532024], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4765ab8c-2ae4-43fb-9470-7f7d26ca2f66", 3, 0, 0.0, 452.0, 244, 619, 493.0, 619.0, 619.0, 619.0, 0.01859139218541815, 0.02562973499519722, 0.011922214389737552], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7f8a2b88-f3ac-4775-8643-070968e7038d", 1, 0, 0.0, 566.0, 566, 566, 566.0, 566.0, 566.0, 566.0, 1.7667844522968197, 0.31919445671378094, 1.2181150618374559], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 21, 0, 0.0, 186.23809523809527, 130, 946, 133.0, 377.8000000000002, 895.1999999999992, 946.0, 0.09882445952432493, 0.07344278681446414, 0.04960524628467092], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 21, 0, 0.0, 182.66666666666669, 129, 401, 132.0, 400.4, 401.0, 401.0, 0.0988253896543935, 0.04057980797285596, 0.055570898981627884], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 21, 0, 0.0, 312.4285714285715, 128, 1438, 134.0, 908.0000000000005, 1397.6999999999994, 1438.0, 0.09882445952432493, 8.49290162436823, 0.05728914213310243], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 21, 0, 0.0, 275.04761904761904, 129, 1031, 133.0, 599.8000000000002, 992.7999999999995, 1031.0, 0.09882585472599356, 2.791536271441681, 0.05738646056377797], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 27.272727272727273, 0.44411547002220575], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 9.090909090909092, 0.14803849000740193], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 9.090909090909092, 0.14803849000740193], "isController": false}, {"data": ["401/Unauthorized", 12, 54.54545454545455, 0.8882309400444115], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1351, 22, "401/Unauthorized", 12, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
