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

    var data = {"OkPercent": 98.70327993897789, "KoPercent": 1.2967200610221206};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7423352902804957, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=02feae00-eb06-4812-afc2-205401cade25"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/86465a43-59f4-4818-bf85-08515dbd670b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=efe31063-a222-48cb-b7f2-c9f05c5f86e6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ffa70522-53e3-4783-ab4c-ea591adfb2d6"], "isController": false}, {"data": [0.5333333333333333, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5333333333333333, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/414e2005-80eb-495b-8f31-cacf342f6fc8"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8ba5bc9f-e6d4-4464-99ad-a0caf7493240"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.4, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7586e450-5e7c-4493-b0dd-f56e00908394"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d9424833-f7b3-4844-8711-c1288ed48df7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6567d1a0-a121-43af-99c1-6fc8a1adea9d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.4642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=017cfc35-23b9-4a94-85f9-6e5242ac85f5"], "isController": false}, {"data": [0.85, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/90a27a3c-c855-4fcd-882f-fbf56bcbbbc6"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a6cd9865-7f20-47b1-b843-c86808fe7d37"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=15214944-1844-4def-9543-a2db03191a83"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8ba5bc9f-e6d4-4464-99ad-a0caf7493240"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4eb30cec-5833-4cc5-8888-69e27a668fc2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=414e2005-80eb-495b-8f31-cacf342f6fc8"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/efe31063-a222-48cb-b7f2-c9f05c5f86e6"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0869082e-07a3-43f3-b844-04ffd452ee3e"], "isController": false}, {"data": [0.18, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ffa70522-53e3-4783-ab4c-ea591adfb2d6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6567d1a0-a121-43af-99c1-6fc8a1adea9d"], "isController": false}, {"data": [0.8055555555555556, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/02feae00-eb06-4812-afc2-205401cade25"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.2545454545454545, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.18, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8e8077da-f218-4a88-995b-86c14168d3c3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.2727272727272727, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8889da53-80ad-4468-96b8-3862efa9d084"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/017cfc35-23b9-4a94-85f9-6e5242ac85f5"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=86465a43-59f4-4818-bf85-08515dbd670b"], "isController": false}, {"data": [0.25833333333333336, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7586e450-5e7c-4493-b0dd-f56e00908394"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.990909090909091, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4090909090909091, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9342857142857143, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4eb30cec-5833-4cc5-8888-69e27a668fc2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a6cd9865-7f20-47b1-b843-c86808fe7d37"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8095238095238095, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/15214944-1844-4def-9543-a2db03191a83"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8e8077da-f218-4a88-995b-86c14168d3c3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0869082e-07a3-43f3-b844-04ffd452ee3e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=90a27a3c-c855-4fcd-882f-fbf56bcbbbc6"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1311, 17, 1.2967200610221206, 450.9138062547683, 125, 3237, 152.0, 1291.8, 1545.3999999999999, 1943.6399999999996, 5.144081363593559, 726.2514059716566, 3.7488694596164107], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 2187.5090909090904, 1671, 2844, 2187.0, 2569.6, 2660.6, 2844.0, 0.24910774136275524, 299.75918729873223, 1.224860818126438], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=02feae00-eb06-4812-afc2-205401cade25", 1, 0, 0.0, 829.0, 829, 829, 829.0, 829.0, 829.0, 829.0, 1.2062726176115801, 0.21793011158021713, 0.8316684258142341], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/86465a43-59f4-4818-bf85-08515dbd670b", 3, 0, 0.0, 371.0, 240, 612, 261.0, 612.0, 612.0, 612.0, 0.03510208857427017, 0.02853187342771895, 0.0225101284151407], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=efe31063-a222-48cb-b7f2-c9f05c5f86e6", 1, 0, 0.0, 519.0, 519, 519, 519.0, 519.0, 519.0, 519.0, 1.9267822736030829, 0.3481003131021195, 1.3284260597302504], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ffa70522-53e3-4783-ab4c-ea591adfb2d6", 3, 0, 0.0, 401.0, 285, 495, 423.0, 495.0, 495.0, 495.0, 0.06854166190682903, 0.03101331707372798, 0.04395412563686628], "isController": false}, {"data": ["deleteBook", 15, 0, 0.0, 612.2, 484, 985, 559.0, 855.4000000000001, 985.0, 985.0, 0.08896322260377561, 0.016072457208689928, 0.060467190363503724], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 0, 0.0, 612.2, 484, 985, 559.0, 855.4000000000001, 985.0, 985.0, 0.08601953216843772, 0.015540638135899393, 0.05846640077073501], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 183.6, 126, 411, 132.0, 405.6, 411.0, 411.0, 0.09332130525398948, 0.03431502161943571, 0.052699804802936505], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 133.8, 129, 142, 133.0, 140.2, 142.0, 142.0, 0.09332362767605502, 0.06935476627097449, 0.04684408654833231], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 276.2, 128, 1029, 134.0, 647.4000000000002, 1029.0, 1029.0, 0.09332420829963294, 1.8528379308467617, 0.054420894123685684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 283.59999999999997, 130, 1103, 132.0, 690.2000000000003, 1103.0, 1103.0, 0.09332478893043569, 5.621730959021085, 0.05433009522239297], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/414e2005-80eb-495b-8f31-cacf342f6fc8", 3, 0, 0.0, 323.6666666666667, 244, 442, 285.0, 442.0, 442.0, 442.0, 0.0681802686302584, 0.03160439535465103, 0.043722372786982114], "isController": false}, {"data": ["goToProfile", 15, 0, 0.0, 295.8, 232, 736, 264.0, 472.00000000000017, 736.0, 736.0, 0.08903556674106082, 0.1755090423037656, 0.057560102717365495], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8ba5bc9f-e6d4-4464-99ad-a0caf7493240", 1, 0, 0.0, 223.0, 223, 223, 223.0, 223.0, 223.0, 223.0, 4.484304932735426, 0.8101527466367713, 3.0917180493273544], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 146.33333333333331, 126, 389, 132.5, 162.20000000000036, 389.0, 389.0, 0.17313185914761414, 0.1286653757923187, 0.08690407773620476], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 160.22222222222223, 126, 398, 132.5, 382.70000000000005, 398.0, 398.0, 0.17311687312456722, 0.08965785974647995, 0.09630753130530123], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 853.4, 646, 1041, 827.0, 1041.0, 1041.0, 1041.0, 0.08018217389909875, 23.57622142507778, 0.04572889605182976], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1326.6, 1177, 1598, 1286.0, 1598.0, 1598.0, 1598.0, 0.07936759897139592, 71.41510506781961, 0.045186826367503735], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7586e450-5e7c-4493-b0dd-f56e00908394", 3, 0, 0.0, 404.0, 259, 657, 296.0, 657.0, 657.0, 657.0, 0.019661816751867872, 0.02710540167453139, 0.012608652018613185], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 343.6, 131, 414, 380.0, 414.0, 414.0, 414.0, 0.08052696848174452, 0.142494987196212, 0.04458866321205972], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 10, 0, 0.0, 136.8, 131, 146, 137.5, 145.4, 146.0, 146.0, 0.07288045419099051, 0.05416213441342166, 0.036582571732587034], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 10, 0, 0.0, 183.5, 128, 389, 133.5, 388.2, 389.0, 389.0, 0.07288523490911211, 0.03044951513097477, 0.040955238444046006], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 10, 0, 0.0, 261.6, 126, 1160, 132.0, 1083.8000000000002, 1160.0, 1160.0, 0.07288311006807283, 6.575714903593867, 0.04222095790271563], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 10, 0, 0.0, 244.6, 127, 1007, 132.5, 944.7000000000003, 1007.0, 1007.0, 0.07288417247310575, 2.1607167748389258, 0.04229274930031194], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d9424833-f7b3-4844-8711-c1288ed48df7", 1, 0, 0.0, 222.0, 222, 222, 222.0, 222.0, 222.0, 222.0, 4.504504504504505, 1.4384501689189189, 2.68774634009009], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6567d1a0-a121-43af-99c1-6fc8a1adea9d", 3, 0, 0.0, 322.6666666666667, 232, 486, 250.0, 486.0, 486.0, 486.0, 0.06030514402878565, 0.027286507226566427, 0.038672244054917884], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 139.4, 129, 166, 133.0, 166.0, 166.0, 166.0, 0.08085250885334971, 0.060086678942772594, 0.04540057870183212], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 1085.857142857143, 129, 1625, 1375.0, 1604.5, 1625.0, 1625.0, 0.08402756104002113, 54.01229024995199, 0.04424107357213166], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 320.33333333333337, 128, 1372, 131.5, 1273.0000000000002, 1372.0, 1372.0, 0.17312519837262313, 26.001945178823902, 0.09929902328533918], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 733.0, 127, 1177, 906.0, 1129.0, 1177.0, 1177.0, 0.08402503946175961, 17.653721746580484, 0.04432180164689078], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 300.55555555555554, 127, 1033, 131.5, 1030.3, 1033.0, 1033.0, 0.1731301939058172, 8.523224243276777, 0.09947096101685134], "isController": false}, {"data": ["deleteBooks", 15, 0, 0.0, 488.46666666666664, 223, 914, 498.0, 863.0, 914.0, 914.0, 0.08581824839233815, 0.015504273391193903, 0.05916765953612376], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=017cfc35-23b9-4a94-85f9-6e5242ac85f5", 1, 0, 0.0, 528.0, 528, 528, 528.0, 528.0, 528.0, 528.0, 1.893939393939394, 0.3421667850378788, 1.305782433712121], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 10, 0, 0.0, 426.5, 265, 1291, 274.0, 1214.9000000000003, 1291.0, 1291.0, 0.0728098788443616, 8.812149773106215, 0.16188821499301026], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/90a27a3c-c855-4fcd-882f-fbf56bcbbbc6", 3, 0, 0.0, 393.6666666666667, 283, 614, 284.0, 614.0, 614.0, 614.0, 0.037529085040906705, 0.031286454033125674, 0.024066503102404362], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a6cd9865-7f20-47b1-b843-c86808fe7d37", 3, 0, 0.0, 523.3333333333334, 245, 1010, 315.0, 1010.0, 1010.0, 1010.0, 0.040556434278298255, 0.03381023052953184, 0.02600786963810142], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 547.5, 138, 1214, 520.5, 986.4999999999999, 1186.8499999999997, 1214.0, 0.10654836569336348, 0.0654481660362555, 0.0481756770664329], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 132.71428571428572, 127, 146, 132.0, 143.0, 146.0, 146.0, 0.08402856971370266, 0.06244701323449973, 0.0421784031570734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 272.21428571428567, 127, 539, 259.5, 469.5, 539.0, 539.0, 0.08403058713371668, 0.11263474904865371, 0.042882796838049055], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=15214944-1844-4def-9543-a2db03191a83", 1, 0, 0.0, 636.0, 636, 636, 636.0, 636.0, 636.0, 636.0, 1.5723270440251573, 0.28406299135220126, 1.084045794025157], "isController": false}, {"data": ["login", 22, 0, 0.0, 2668.772727272727, 1552, 4161, 2576.5, 3892.4, 4122.15, 4161.0, 0.0994206487649244, 27.169256346257264, 0.18747288527760955], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/8ba5bc9f-e6d4-4464-99ad-a0caf7493240", 3, 0, 0.0, 341.3333333333333, 243, 529, 252.0, 529.0, 529.0, 529.0, 0.08775265451779916, 0.03970579094392605, 0.056273674934916786], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 168.33333333333334, 133, 395, 139.5, 391.4, 395.0, 395.0, 0.1692047377326565, 0.1369831324027073, 0.060146996615905245], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4eb30cec-5833-4cc5-8888-69e27a668fc2", 3, 0, 0.0, 315.3333333333333, 230, 471, 245.0, 471.0, 471.0, 471.0, 0.034407615552242234, 0.028348201485262074, 0.022064779504530337], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=414e2005-80eb-495b-8f31-cacf342f6fc8", 1, 0, 0.0, 239.0, 239, 239, 239.0, 239.0, 239.0, 239.0, 4.184100418410042, 0.755916579497908, 2.884741108786611], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 1221.0714285714287, 264, 1754, 1506.5, 1739.5, 1754.0, 1754.0, 0.08395701400882749, 71.7813026605378, 0.17347758572610822], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/efe31063-a222-48cb-b7f2-c9f05c5f86e6", 3, 0, 0.0, 595.3333333333334, 262, 1022, 502.0, 1022.0, 1022.0, 1022.0, 0.023854961832061067, 0.02819575729564249, 0.015297615497773536], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 505.66666666666663, 261, 1233, 523.0, 822.0000000000002, 1233.0, 1233.0, 0.09324415048362632, 7.571704266075292, 0.2081177871764428], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 0, 0.0, 1466.2, 1315, 1732, 1417.0, 1732.0, 1732.0, 1732.0, 0.07920541131370096, 94.75720818746336, 0.17859892062825733], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0869082e-07a3-43f3-b844-04ffd452ee3e", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 0.7140872035573123, 2.7251111660079053], "isController": false}, {"data": ["register", 25, 8, 32.0, 1306.6400000000003, 143, 3237, 1130.0, 2530.000000000001, 3089.7, 3237.0, 0.09871551373527658, 0.030894870939337345, 0.04453766342353299], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 21, 0, 0.0, 143.85714285714286, 135, 158, 144.0, 155.0, 157.8, 158.0, 0.10320171019976902, 0.08012242149298474, 0.03668498292257414], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 491.16666666666663, 259, 1652, 267.5, 1519.7000000000003, 1652.0, 1652.0, 0.1729056799515864, 34.69919252146912, 0.3814956701535979], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ffa70522-53e3-4783-ab4c-ea591adfb2d6", 1, 0, 0.0, 280.0, 280, 280, 280.0, 280.0, 280.0, 280.0, 3.571428571428571, 0.6452287946428571, 2.462332589285714], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6567d1a0-a121-43af-99c1-6fc8a1adea9d", 1, 0, 0.0, 359.0, 359, 359, 359.0, 359.0, 359.0, 359.0, 2.785515320334262, 0.5032425139275766, 1.920482242339833], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 414.33333333333337, 262, 1556, 272.0, 645.2000000000014, 1556.0, 1556.0, 0.08541898009737764, 5.80229461925676, 0.19089510786518987], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 14, 0, 0.0, 151.0, 126, 382, 133.5, 261.5, 382.0, 382.0, 0.06763056321766897, 0.05026060411000594, 0.033947372552618996], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 14, 0, 0.0, 199.0, 127, 555, 132.5, 479.5, 555.0, 555.0, 0.06763088992589586, 0.018096546718452605, 0.03857074191086249], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 14, 0, 0.0, 179.78571428571428, 125, 532, 134.5, 461.0, 532.0, 532.0, 0.06754702961937249, 0.01820603532709649, 0.0397102654598264], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/02feae00-eb06-4812-afc2-205401cade25", 3, 0, 0.0, 401.6666666666667, 286, 599, 320.0, 599.0, 599.0, 599.0, 0.04035566795356408, 0.02641772404121659, 0.025879123004075924], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 14, 0, 0.0, 167.85714285714286, 125, 389, 132.0, 389.0, 389.0, 389.0, 0.06754735552103135, 0.01820612316777798, 0.03977642126873233], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1549.4545454545453, 1036, 2284, 1472.0, 1944.8, 2088.7999999999997, 2284.0, 0.26113999477720007, 312.41422070484055, 0.5156494818745103], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 8, 32.0, 1306.6400000000003, 143, 3237, 1130.0, 2530.000000000001, 3089.7, 3237.0, 0.10030693923405622, 0.03139293738840853, 0.0452556698497402], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 239.0, 128, 414, 134.0, 414.0, 414.0, 414.0, 0.02474304349332185, 0.006669023441559406, 0.014570366432102614], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8e8077da-f218-4a88-995b-86c14168d3c3", 1, 0, 0.0, 474.0, 474, 474, 474.0, 474.0, 474.0, 474.0, 2.109704641350211, 0.3811478111814346, 1.4545424578059072], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 130.6, 127, 133, 130.0, 133.0, 133.0, 133.0, 0.024774919853134274, 0.006677615116665097, 0.014564943116784017], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 21, 0, 0.0, 218.3809523809524, 126, 1422, 132.0, 397.6, 1319.6999999999985, 1422.0, 0.09914358824251465, 4.273524803896343, 0.05787986452736835], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 21, 0, 0.0, 229.14285714285714, 127, 801, 133.0, 415.0, 762.4999999999994, 801.0, 0.0991351637146418, 1.4134966772017448, 0.0579717579851014], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 21, 0, 0.0, 137.42857142857142, 129, 173, 134.0, 150.0, 170.89999999999998, 173.0, 0.09926590499780197, 0.07377085322590557, 0.04982683121959982], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 233.8, 129, 390, 131.0, 390.0, 390.0, 390.0, 0.024743165937568045, 0.0066207299481383245, 0.014111336823769275], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 21, 0, 0.0, 160.7142857142857, 129, 400, 134.0, 354.20000000000016, 399.9, 400.0, 0.0992663742247769, 0.033661197956058084, 0.056215862412078356], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 188.6, 132, 401, 132.0, 401.0, 401.0, 401.0, 0.02477467433690584, 0.018411647627329438, 0.01243572520426719], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 138.4, 133, 145, 137.0, 145.0, 145.0, 145.0, 0.024001190459046768, 0.018891562021476266, 0.00853167317098928], "isController": false}, {"data": ["deleteAccount", 15, 0, 0.0, 584.3999999999999, 442, 1010, 551.0, 803.6000000000001, 1010.0, 1010.0, 0.08721893697559614, 0.015757327480942662, 0.05936679596874073], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1533.590909090909, 1025, 2620, 1433.0, 2101.7999999999997, 2545.599999999999, 2620.0, 0.10276580140975995, 0.05318933080778591, 0.04726825435937201], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 429.8, 263, 815, 282.0, 815.0, 815.0, 815.0, 0.024726646918317993, 0.03832147330016666, 0.055610808450084315], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8889da53-80ad-4468-96b8-3862efa9d084", 1, 0, 0.0, 234.0, 234, 234, 234.0, 234.0, 234.0, 234.0, 4.273504273504274, 1.3646834935897436, 2.549913194444444], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/017cfc35-23b9-4a94-85f9-6e5242ac85f5", 3, 0, 0.0, 587.3333333333334, 377, 736, 649.0, 736.0, 736.0, 736.0, 0.016037206318659288, 0.022108583580573597, 0.010284276187421485], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=86465a43-59f4-4818-bf85-08515dbd670b", 1, 0, 0.0, 914.0, 914, 914, 914.0, 914.0, 914.0, 914.0, 1.0940919037199124, 0.19766308807439825, 0.7543250820568927], "isController": false}, {"data": ["addBook", 60, 9, 15.0, 1329.4666666666672, 681, 2496, 1079.0, 2231.9, 2283.2999999999997, 2496.0, 0.2907371155001648, 99.71341383823871, 1.0544709614191847], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7586e450-5e7c-4493-b0dd-f56e00908394", 1, 0, 0.0, 520.0, 520, 520, 520.0, 520.0, 520.0, 520.0, 1.9230769230769231, 0.3474308894230769, 1.3258713942307692], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 260.0727272727273, 130, 574, 140.0, 527.0, 530.4, 574.0, 0.26226068712300027, 0.1949027176763703, 0.1267764063729347], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 842.1454545454545, 626, 1170, 778.0, 1089.8, 1145.2, 1170.0, 0.2619783653502651, 77.03033791338996, 0.13175669741736964], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 216.32727272727269, 127, 535, 135.0, 400.8, 409.59999999999997, 535.0, 0.2624909917864182, 0.46448601280956037, 0.12765675186487918], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1287.7636363636364, 899, 1755, 1287.0, 1554.0, 1631.3999999999999, 1755.0, 0.26185363809922824, 235.6163638512838, 0.13143825193652667], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 142.0, 131, 155, 141.0, 152.3, 155.0, 155.0, 0.08523292263691723, 0.06367498614965007, 0.030297640468591666], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 9, 5.142857142857143, 206.34857142857146, 126, 983, 142.0, 373.8, 447.1999999999999, 800.6000000000022, 0.7350038220198745, 1.6041663494775174, 0.35396668437675877], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 14, 0, 0.0, 157.78571428571428, 133, 398, 140.5, 274.0, 398.0, 398.0, 0.06674517170195421, 0.0516883995699704, 0.023725822753429035], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 159.46666666666664, 130, 419, 142.0, 263.0000000000001, 419.0, 419.0, 0.08870333465402742, 0.07198483505614921, 0.03153126349029881], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4eb30cec-5833-4cc5-8888-69e27a668fc2", 1, 0, 0.0, 498.0, 498, 498, 498.0, 498.0, 498.0, 498.0, 2.008032128514056, 0.3627792419678715, 1.3844440261044177], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a6cd9865-7f20-47b1-b843-c86808fe7d37", 1, 0, 0.0, 491.0, 491, 491, 491.0, 491.0, 491.0, 491.0, 2.0366598778004072, 0.3679512474541752, 1.404181517311609], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 14, 0, 0.0, 371.9285714285714, 257, 772, 271.0, 727.5, 772.0, 772.0, 0.0675030617460149, 0.10461656151457584, 0.1518159679697972], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 21, 0, 0.0, 411.3809523809524, 261, 1556, 275.0, 551.4, 1455.6999999999985, 1556.0, 0.09907389497223572, 5.790367894396664, 0.22161241732047576], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/15214944-1844-4def-9543-a2db03191a83", 3, 0, 0.0, 422.0, 264, 666, 336.0, 666.0, 666.0, 666.0, 0.0211599906896041, 0.025010392641260575, 0.013569395071132837], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8e8077da-f218-4a88-995b-86c14168d3c3", 3, 0, 0.0, 391.3333333333333, 278, 551, 345.0, 551.0, 551.0, 551.0, 0.03112743572184524, 0.031218629381186577, 0.01996127876693851], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0869082e-07a3-43f3-b844-04ffd452ee3e", 3, 0, 0.0, 321.3333333333333, 234, 483, 247.0, 483.0, 483.0, 483.0, 0.09285338450586525, 0.04201373843201585, 0.059544650871274266], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 10, 0, 0.0, 162.7, 132, 380, 137.5, 356.80000000000007, 380.0, 380.0, 0.07882518937751748, 0.06535408767725814, 0.028019891536539415], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 141.71428571428572, 131, 176, 135.5, 171.0, 176.0, 176.0, 0.08093187270572592, 0.06283285039165246, 0.028768751625863512], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 147.5, 127, 395, 133.0, 164.60000000000036, 395.0, 395.0, 0.08547576761987977, 0.0635225187096958, 0.04290482866857246], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 161.88888888888886, 125, 414, 132.0, 394.20000000000005, 414.0, 414.0, 0.0854741440714184, 0.03000313108409706, 0.04834816764803647], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 265.00000000000006, 129, 1161, 137.5, 491.40000000000106, 1161.0, 1161.0, 0.08547373819393991, 4.294503511842861, 0.04984113162480828], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=90a27a3c-c855-4fcd-882f-fbf56bcbbbc6", 1, 0, 0.0, 564.0, 564, 564, 564.0, 564.0, 564.0, 564.0, 1.7730496453900708, 0.32032635195035464, 1.2224346187943265], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 241.0, 126, 1036, 134.5, 462.7000000000009, 1036.0, 1036.0, 0.0854753617269822, 1.4180136208550387, 0.0499255503663569], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 47.05882352941177, 0.6102212051868803], "isController": false}, {"data": ["401/Unauthorized", 9, 52.94117647058823, 0.6864988558352403], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1311, 17, "401/Unauthorized", 9, "406/Not Acceptable", 8, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
