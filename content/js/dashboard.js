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

    var data = {"OkPercent": 98.08429118773947, "KoPercent": 1.9157088122605364};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7240473061760841, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7fdb04d2-b98e-4c9c-9b9f-8510fd5ca20b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8e1c50de-7aef-4e05-ba1c-92171fa7d93e"], "isController": false}, {"data": [0.4642857142857143, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4642857142857143, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=336a8650-113b-4a62-bc96-c699d21e7015"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/371d0a03-430d-44c3-b999-ad562768c0d0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7acdf598-82b3-4815-8841-578b0c8b2d44"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/44ffecf6-6e81-4411-949c-3f961cc0fa04"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/72b840c8-0831-40cd-a4d0-c65d3cc10246"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/0c5954b0-ef5f-4cf4-b591-304e613f4bf8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b0a7fcc1-70ec-4fe7-a9e1-00ae3b6142f2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.47058823529411764, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.8611111111111112, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/83a86992-1a9b-4ead-b8fa-9452ae40638c"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6086956521739131, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bafc0d27-dbce-4d63-8049-1ccb97b397bd"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=44ffecf6-6e81-4411-949c-3f961cc0fa04"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=371d0a03-430d-44c3-b999-ad562768c0d0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cba4af91-ac6c-4c94-9a84-fb78f652e0fa"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e2037708-de71-4469-b0ce-3055f340575a"], "isController": false}, {"data": [0.47058823529411764, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7e3f7088-c153-4c85-8b5d-314c4f0bc454"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.05, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f0f5ec94-6ce9-49fe-aa5c-10851fddf71d"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e2037708-de71-4469-b0ce-3055f340575a"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.18181818181818182, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7fdb04d2-b98e-4c9c-9b9f-8510fd5ca20b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/336a8650-113b-4a62-bc96-c699d21e7015"], "isController": false}, {"data": [0.2391304347826087, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7acdf598-82b3-4815-8841-578b0c8b2d44"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b0a7fcc1-70ec-4fe7-a9e1-00ae3b6142f2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/c42bde4f-cf8b-4bab-bf66-2c7605750a7d"], "isController": false}, {"data": [0.2796610169491525, 500, 1500, "addBook"], "isController": true}, {"data": [0.9, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.990909090909091, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.32727272727272727, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9277456647398844, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/647a735a-c5c6-4764-89a2-c3208db48573"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=647a735a-c5c6-4764-89a2-c3208db48573"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cba4af91-ac6c-4c94-9a84-fb78f652e0fa"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8529411764705882, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bafc0d27-dbce-4d63-8049-1ccb97b397bd"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7e3f7088-c153-4c85-8b5d-314c4f0bc454"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f0f5ec94-6ce9-49fe-aa5c-10851fddf71d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1305, 25, 1.9157088122605364, 482.5555555555553, 137, 2774, 162.0, 1385.0000000000005, 1633.3000000000009, 2093.76, 5.038143183643214, 705.2708406122599, 3.677748007906603], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 2393.8181818181815, 1671, 3340, 2394.0, 2868.6, 2992.0, 3340.0, 0.23576009053187474, 283.699920739065, 1.1592305232695208], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/7fdb04d2-b98e-4c9c-9b9f-8510fd5ca20b", 3, 0, 0.0, 439.6666666666667, 359, 557, 403.0, 557.0, 557.0, 557.0, 0.060835885060734486, 0.027526653722142233, 0.039012595563036115], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8e1c50de-7aef-4e05-ba1c-92171fa7d93e", 1, 0, 0.0, 291.0, 291, 291, 291.0, 291.0, 291.0, 291.0, 3.4364261168384878, 1.0973743556701032, 2.0504456615120277], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 594.857142857143, 153, 1056, 554.5, 943.5, 1056.0, 1056.0, 0.08346996571769265, 0.016442465345058877, 0.05616289685497094], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 594.857142857143, 153, 1056, 554.5, 943.5, 1056.0, 1056.0, 0.08597977018835712, 0.01693686321232704, 0.057851622714627], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 160.66666666666666, 139, 416, 142.0, 254.60000000000008, 416.0, 416.0, 0.08216206741671506, 0.021984771945488205, 0.0468580540735953], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 161.86666666666667, 139, 422, 143.0, 260.0000000000001, 422.0, 422.0, 0.08215846725163495, 0.06105722029149824, 0.04123969938216832], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 224.13333333333333, 138, 568, 141.0, 481.00000000000006, 568.0, 568.0, 0.08216206741671506, 0.02214524473341148, 0.04838254555886638], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 160.4, 138, 419, 141.0, 257.0000000000001, 419.0, 419.0, 0.08216161737882531, 0.022145123434136507, 0.04830204459184847], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=336a8650-113b-4a62-bc96-c699d21e7015", 1, 0, 0.0, 470.0, 470, 470, 470.0, 470.0, 470.0, 470.0, 2.127659574468085, 0.38439162234042556, 1.4669215425531916], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/371d0a03-430d-44c3-b999-ad562768c0d0", 3, 0, 0.0, 757.6666666666666, 256, 1448, 569.0, 1448.0, 1448.0, 1448.0, 0.07706931100035964, 0.03487185621435544, 0.04942270269228793], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7acdf598-82b3-4815-8841-578b0c8b2d44", 1, 0, 0.0, 541.0, 541, 541, 541.0, 541.0, 541.0, 541.0, 1.8484288354898337, 0.3339446626617375, 1.2744050369685767], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 295.71428571428567, 139, 483, 272.0, 460.5, 483.0, 483.0, 0.0836405130748045, 0.14833122240609858, 0.054060616221480076], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/44ffecf6-6e81-4411-949c-3f961cc0fa04", 3, 0, 0.0, 649.3333333333334, 317, 1022, 609.0, 1022.0, 1022.0, 1022.0, 0.019114732999037893, 0.026351202555639802, 0.01225782031513823], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 171.94444444444443, 138, 420, 140.5, 418.2, 420.0, 420.0, 0.12800455127293414, 0.09512838234248329, 0.06425228452567203], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 160.11111111111111, 137, 427, 141.5, 195.70000000000036, 427.0, 427.0, 0.12800546156636017, 0.06629449523179656, 0.0712113716851919], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 1024.6666666666667, 827, 1288, 980.0, 1288.0, 1288.0, 1288.0, 0.050926436762097155, 14.974063324902179, 0.029043983465883532], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/72b840c8-0831-40cd-a4d0-c65d3cc10246", 1, 0, 0.0, 258.0, 258, 258, 258.0, 258.0, 258.0, 258.0, 3.875968992248062, 1.237736191860465, 2.3127119670542635], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1522.6666666666667, 1242, 1911, 1437.5, 1911.0, 1911.0, 1911.0, 0.050773878531957924, 45.686425154014096, 0.02890739373450339], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 289.16666666666663, 138, 468, 278.0, 468.0, 468.0, 468.0, 0.05134612422338987, 0.09085857137967036, 0.028430910580724666], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0c5954b0-ef5f-4cf4-b591-304e613f4bf8", 1, 0, 0.0, 504.0, 504, 504, 504.0, 504.0, 504.0, 504.0, 1.984126984126984, 0.6336030505952381, 1.1838882688492063], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 161.11764705882354, 140, 425, 142.0, 214.5999999999998, 425.0, 425.0, 0.07995597717962345, 0.05942040882196626, 0.040134152607740683], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 191.05882352941177, 138, 420, 142.0, 419.2, 420.0, 420.0, 0.07995484902643213, 0.021394168587150784, 0.04559924983538707], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 221.64705882352942, 137, 418, 142.0, 416.4, 418.0, 418.0, 0.07985232017962075, 0.021522695673413406, 0.04694443041809735], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 241.05882352941177, 138, 437, 145.0, 433.8, 437.0, 437.0, 0.07985307035055499, 0.02152289786792302, 0.04702285295057095], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b0a7fcc1-70ec-4fe7-a9e1-00ae3b6142f2", 1, 0, 0.0, 278.0, 278, 278, 278.0, 278.0, 278.0, 278.0, 3.5971223021582737, 0.6498707284172661, 2.4800472122302155], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 143.16666666666666, 138, 154, 142.0, 154.0, 154.0, 154.0, 0.05134744246946967, 0.03815957394459611, 0.028832792402290097], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 933.7647058823529, 141, 1776, 1149.0, 1680.0, 1776.0, 1776.0, 0.07503067430508355, 39.72169929857353, 0.040316919086038114], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 389.7222222222222, 137, 1527, 144.5, 1518.0, 1527.0, 1527.0, 0.12800273072492213, 19.224930965193924, 0.07341823292230233], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 630.7058823529413, 140, 1181, 826.0, 1154.6, 1181.0, 1181.0, 0.07503034315348119, 12.985628379123911, 0.04039001296480194], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 374.55555555555554, 137, 1239, 145.5, 1139.1000000000001, 1239.0, 1239.0, 0.12800546156636017, 6.3017272070275, 0.07354480457832868], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 506.35714285714283, 151, 1068, 459.0, 1004.0, 1068.0, 1068.0, 0.08604106617172567, 0.0169489377001223, 0.058445026672730514], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/83a86992-1a9b-4ead-b8fa-9452ae40638c", 1, 0, 0.0, 642.0, 642, 642, 642.0, 642.0, 642.0, 642.0, 1.557632398753894, 0.4974080023364486, 0.9294076129283488], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 436.0588235294117, 280, 863, 299.0, 648.5999999999998, 863.0, 863.0, 0.07979909404557936, 0.12367301001009225, 0.1794700327997747], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 754.8695652173913, 204, 1362, 818.0, 1207.2000000000003, 1346.3999999999999, 1362.0, 0.09665002605348529, 0.05936803358168188, 0.043700158264417664], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 144.7058823529412, 140, 160, 144.0, 151.2, 160.0, 160.0, 0.07502835630525066, 0.05575837807450757, 0.03766071791103402], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 274.8235294117647, 138, 437, 149.0, 430.6, 437.0, 437.0, 0.07502802517410916, 0.08636325645903029, 0.03908284307667864], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bafc0d27-dbce-4d63-8049-1ccb97b397bd", 1, 0, 0.0, 1068.0, 1068, 1068, 1068.0, 1068.0, 1068.0, 1068.0, 0.9363295880149812, 0.16916110720973782, 0.6455553604868913], "isController": false}, {"data": ["login", 23, 0, 0.0, 3196.086956521739, 2203, 4593, 3168.0, 4123.4, 4499.399999999999, 4593.0, 0.09438143229978825, 29.58466783891141, 0.1832286951869573], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=44ffecf6-6e81-4411-949c-3f961cc0fa04", 1, 0, 0.0, 719.0, 719, 719, 719.0, 719.0, 719.0, 719.0, 1.3908205841446453, 0.25127129694019473, 0.9589055980528512], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 165.61111111111114, 142, 438, 147.0, 196.80000000000038, 438.0, 438.0, 0.1256667318271943, 0.10173605535619537, 0.04467059607919797], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=371d0a03-430d-44c3-b999-ad562768c0d0", 1, 0, 0.0, 285.0, 285, 285, 285.0, 285.0, 285.0, 285.0, 3.5087719298245617, 0.6339089912280702, 2.419133771929825], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cba4af91-ac6c-4c94-9a84-fb78f652e0fa", 1, 0, 0.0, 449.0, 449, 449, 449.0, 449.0, 449.0, 449.0, 2.2271714922048997, 0.40236984966592426, 1.5355303452115812], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e2037708-de71-4469-b0ce-3055f340575a", 1, 0, 0.0, 940.0, 940, 940, 940.0, 940.0, 940.0, 940.0, 1.0638297872340425, 0.19219581117021278, 0.7334607712765958], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 1080.5882352941176, 281, 1918, 1291.0, 1826.8, 1918.0, 1918.0, 0.07497871927526452, 52.81291572529782, 0.15734418622729138], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7e3f7088-c153-4c85-8b5d-314c4f0bc454", 1, 0, 0.0, 469.0, 469, 469, 469.0, 469.0, 469.0, 469.0, 2.1321961620469083, 0.3852112206823028, 1.4700493070362475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 407.33333333333337, 280, 845, 289.0, 768.2, 845.0, 845.0, 0.08209461678232885, 0.12723062190776943, 0.18463271723603844], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, 40.0, 1057.6, 139, 2052, 1458.5, 2033.4, 2052.0, 2052.0, 0.08452228007302724, 60.679865525052406, 0.13675440783690582], "isController": false}, {"data": ["register", 24, 7, 29.166666666666668, 1207.916666666667, 501, 2090, 1165.5, 1838.5, 2048.0, 2090.0, 0.10093321165273929, 0.031689480025737966, 0.04553822635113823], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 163.47058823529412, 139, 415, 145.0, 213.3999999999998, 415.0, 415.0, 0.08074245058087069, 0.06268578926932832, 0.02870141797991888], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 596.7777777777777, 282, 1666, 294.5, 1664.2, 1666.0, 1666.0, 0.1278745124784212, 25.66221264865412, 0.2821397934826623], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f0f5ec94-6ce9-49fe-aa5c-10851fddf71d", 1, 0, 0.0, 738.0, 738, 738, 738.0, 738.0, 738.0, 738.0, 1.3550135501355014, 0.2448022527100271, 0.9342183265582656], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 13, 0, 0.0, 625.6923076923077, 283, 1952, 558.0, 1814.8, 1952.0, 1952.0, 0.07180416243206222, 13.30996842860733, 0.15866281835480092], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 142.625, 139, 148, 142.0, 148.0, 148.0, 148.0, 0.04086052260608413, 0.03036607197581057, 0.02051006701125707], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 143.99999999999997, 139, 169, 140.5, 169.0, 169.0, 169.0, 0.04086198354283613, 0.010933772940172948, 0.023304099989273727], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 180.125, 137, 416, 143.5, 416.0, 416.0, 416.0, 0.040861566121675526, 0.011013468993732858, 0.024022131645750653], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 177.49999999999997, 139, 422, 141.0, 422.0, 422.0, 422.0, 0.040861566121675526, 0.011013468993732858, 0.024062035518916353], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e2037708-de71-4469-b0ce-3055f340575a", 3, 0, 0.0, 446.0, 248, 815, 275.0, 815.0, 815.0, 815.0, 0.02391581632653061, 0.03295431331712372, 0.015336640027104591], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 151.0, 151, 151, 151.0, 151.0, 151.0, 151.0, 0.05478101290092854, 0.016156119039141034, 0.03386365348270289], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1658.0727272727272, 1100, 2768, 1547.0, 2278.3999999999996, 2378.6, 2768.0, 0.24169237394644097, 289.1481051043232, 0.47724802746064804], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, 29.166666666666668, 1207.916666666667, 501, 2090, 1165.5, 1838.5, 2048.0, 2090.0, 0.0962394437360152, 0.03021580191516493, 0.043420530279334985], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 204.44444444444446, 141, 425, 145.0, 425.0, 425.0, 425.0, 0.05587459258109577, 0.01505994878162347, 0.03290271418593823], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 172.0, 138, 418, 141.0, 418.0, 418.0, 418.0, 0.05587424569768308, 0.015059855285703643, 0.03284794522461447], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7fdb04d2-b98e-4c9c-9b9f-8510fd5ca20b", 1, 0, 0.0, 421.0, 421, 421, 421.0, 421.0, 421.0, 421.0, 2.375296912114014, 0.42913078978622327, 1.6376558788598576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 192.05882352941177, 137, 449, 141.0, 427.4, 449.0, 449.0, 0.08247782801917367, 0.022230352083292902, 0.04848794186283452], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 190.8235294117647, 139, 422, 142.0, 418.8, 422.0, 422.0, 0.0824754271741978, 0.022229704980545502, 0.04856707283793093], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 192.94117647058823, 138, 422, 145.0, 420.4, 422.0, 422.0, 0.08246662527165477, 0.06128623225754812, 0.04139438026331108], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 171.0, 138, 418, 140.0, 418.0, 418.0, 418.0, 0.055876327062767746, 0.01495128282734215, 0.03186696777798473], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 190.64705882352945, 138, 423, 141.0, 422.2, 423.0, 423.0, 0.08247622744032602, 0.022068834295555985, 0.047037223462060934], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 212.22222222222223, 140, 502, 141.0, 502.0, 502.0, 502.0, 0.0558752863608426, 0.04152450480527463, 0.02804677459909482], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 576.6428571428572, 144, 1022, 563.0, 932.0, 1022.0, 1022.0, 0.0847411460634711, 0.016361850746630026, 0.057668430593974904], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 151.22222222222223, 143, 165, 150.0, 165.0, 165.0, 165.0, 0.0559576214280385, 0.04404476842870999, 0.01989118574199806], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/336a8650-113b-4a62-bc96-c699d21e7015", 3, 0, 0.0, 745.0, 342, 1057, 836.0, 1057.0, 1057.0, 1057.0, 0.03925725277745064, 0.03272715636818069, 0.0251747356678313], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1562.2608695652175, 784, 2774, 1515.0, 2283.8, 2699.799999999999, 2774.0, 0.0948277639200973, 0.04908077624770661, 0.043617067193716635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 418.77777777777777, 281, 921, 289.0, 921.0, 921.0, 921.0, 0.055823300645689515, 0.08651521301241137, 0.12554791151076458], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7acdf598-82b3-4815-8841-578b0c8b2d44", 3, 0, 0.0, 520.0, 253, 842, 465.0, 842.0, 842.0, 842.0, 0.018581604211830288, 0.025616241483431404, 0.01191593759677919], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b0a7fcc1-70ec-4fe7-a9e1-00ae3b6142f2", 3, 0, 0.0, 594.0, 438, 677, 667.0, 677.0, 677.0, 677.0, 0.0658197854274995, 0.02978173884903135, 0.04220865146229623], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c42bde4f-cf8b-4bab-bf66-2c7605750a7d", 1, 0, 0.0, 754.0, 754, 754, 754.0, 754.0, 754.0, 754.0, 1.3262599469496021, 0.42352246352785144, 0.7913523706896551], "isController": false}, {"data": ["addBook", 59, 10, 16.949152542372882, 1337.8983050847455, 728, 2636, 1138.0, 2348.0, 2479.0, 2636.0, 0.27210382375051306, 83.80938741617818, 0.9893579012724313], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 265.4545454545455, 140, 600, 146.0, 567.8, 586.9999999999999, 600.0, 0.24314980680642623, 0.18070019822235386, 0.1175382366886533], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 889.6909090909091, 684, 1293, 832.0, 1147.2, 1251.2, 1293.0, 0.24289423943189245, 71.41897124077002, 0.12215872393303184], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 232.3636363636363, 139, 559, 147.0, 431.4, 442.79999999999995, 559.0, 0.24363881210574811, 0.4311264917339996, 0.11848840666861578], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1387.3454545454551, 958, 2185, 1373.0, 1766.2, 1802.2, 2185.0, 0.24232811226400544, 218.04726138253696, 0.12163735322626837], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 13, 0, 0.0, 149.69230769230768, 141, 156, 150.0, 155.6, 156.0, 156.0, 0.06894722885176345, 0.05150842780429594, 0.02450858525590029], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 10, 5.780346820809249, 208.97687861271686, 139, 618, 149.0, 368.4, 447.5999999999998, 601.7199999999998, 0.721019596729155, 1.5341406230463703, 0.34708266432370033], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 217.24999999999997, 141, 428, 152.0, 428.0, 428.0, 428.0, 0.041230737514817296, 0.031929662938720814, 0.014656238725970211], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/647a735a-c5c6-4764-89a2-c3208db48573", 3, 0, 0.0, 819.0, 461, 1513, 483.0, 1513.0, 1513.0, 1513.0, 0.06181233774261343, 0.027968473132237194, 0.03963877127374624], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 183.26666666666665, 142, 422, 148.0, 420.2, 422.0, 422.0, 0.08282808203293245, 0.06721692985289732, 0.029442794785143955], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=647a735a-c5c6-4764-89a2-c3208db48573", 1, 0, 0.0, 409.0, 409, 409, 409.0, 409.0, 409.0, 409.0, 2.444987775061125, 0.441721424205379, 1.6857044621026895], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cba4af91-ac6c-4c94-9a84-fb78f652e0fa", 3, 0, 0.0, 359.6666666666667, 243, 444, 392.0, 444.0, 444.0, 444.0, 0.048503662026483, 0.031183181153093726, 0.031104236390680832], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 324.875, 284, 562, 288.0, 562.0, 562.0, 562.0, 0.0408311173945664, 0.06328025713396179, 0.09183013999969376], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 420.11764705882354, 282, 872, 291.0, 844.8, 872.0, 872.0, 0.08240945866680886, 0.12771856533615789, 0.18534080401334063], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bafc0d27-dbce-4d63-8049-1ccb97b397bd", 3, 0, 0.0, 351.6666666666667, 229, 453, 373.0, 453.0, 453.0, 453.0, 0.047469105523821574, 0.030518061005712117, 0.030440800091773607], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7e3f7088-c153-4c85-8b5d-314c4f0bc454", 3, 0, 0.0, 372.0, 224, 623, 269.0, 623.0, 623.0, 623.0, 0.01915134027463022, 0.02640166864031868, 0.012281295683926281], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 165.1764705882353, 141, 422, 148.0, 227.59999999999982, 422.0, 422.0, 0.08094351571018413, 0.06711039534955696, 0.028772890350104514], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 153.41176470588232, 142, 179, 150.0, 175.8, 179.0, 179.0, 0.0754100978556917, 0.058545925581323134, 0.026805933222140404], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f0f5ec94-6ce9-49fe-aa5c-10851fddf71d", 3, 0, 0.0, 414.0, 240, 510, 492.0, 510.0, 510.0, 510.0, 0.04794246903715541, 0.031384213943268076, 0.03074435677187375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 13, 0, 0.0, 164.15384615384613, 138, 423, 142.0, 313.7999999999999, 423.0, 423.0, 0.07238791010535225, 0.05379609334977838, 0.03633533768960064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 13, 0, 0.0, 226.76923076923075, 138, 431, 142.0, 426.2, 431.0, 431.0, 0.07228004625922961, 0.036042288692064765, 0.0402883070345165], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 13, 0, 0.0, 437.2307692307692, 139, 1529, 148.0, 1501.4, 1529.0, 1529.0, 0.07186409945991365, 9.964611681647568, 0.04129810403157598], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 13, 0, 0.0, 369.6923076923076, 139, 1252, 145.0, 1200.8, 1252.0, 1252.0, 0.07194682576139111, 3.2709863356374766, 0.041415904883529156], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 28.0, 0.5363984674329502], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 8.0, 0.1532567049808429], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 8.0, 0.1532567049808429], "isController": false}, {"data": ["401/Unauthorized", 14, 56.0, 1.0727969348659003], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1305, 25, "401/Unauthorized", 14, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
