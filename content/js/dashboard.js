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

    var data = {"OkPercent": 97.96533534287867, "KoPercent": 2.0346646571213265};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8236824983734548, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.47413793103448276, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/33aa942d-eb66-4a36-89c5-c6c1c4471e26"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.8461538461538461, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/02fa6d73-c908-401a-89da-0abe0c9dfd78"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=acc0eedd-7931-465f-a835-b2193c0b10bc"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/e727a257-72bb-4194-b5e2-f92e27abe508"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.78125, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/95118d7f-d90b-43d4-94b4-8967c4049161"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1f00bfa7-5a77-43ae-82f4-a9046ea43bec"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b1a08e31-a674-4173-b33a-9c816263db15"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.07142857142857142, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c247e28f-2247-4eb9-a904-abbe133d1155"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0497311a-01c1-4ffa-88c2-17d041f204a5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=31855dda-df97-4549-86fa-eb31c5aef04f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/30e6f45b-27c9-4f49-9157-00602419bed0"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=980e03c5-1352-4cdc-98be-c58725790799"], "isController": false}, {"data": [0.925, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.36363636363636365, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=02fa6d73-c908-401a-89da-0abe0c9dfd78"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=95118d7f-d90b-43d4-94b4-8967c4049161"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/09b26031-b58e-4a57-a1ea-e1730f8dcca2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.36363636363636365, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8e1f6b1e-a206-4e43-a410-3c6526e2c398"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.625, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.47619047619047616, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=30e6f45b-27c9-4f49-9157-00602419bed0"], "isController": false}, {"data": [0.3474576271186441, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.7931034482758621, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8977272727272727, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e727a257-72bb-4194-b5e2-f92e27abe508"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c247e28f-2247-4eb9-a904-abbe133d1155"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4fe7492c-fcb7-4fea-bb1a-0c300a757f2b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0497311a-01c1-4ffa-88c2-17d041f204a5"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/1f00bfa7-5a77-43ae-82f4-a9046ea43bec"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/acc0eedd-7931-465f-a835-b2193c0b10bc"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8e1f6b1e-a206-4e43-a410-3c6526e2c398"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/31855dda-df97-4549-86fa-eb31c5aef04f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/980e03c5-1352-4cdc-98be-c58725790799"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1327, 27, 2.0346646571213265, 273.360964581763, 82, 1589, 95.0, 695.0, 849.5999999999999, 1233.6400000000003, 5.177122347066168, 731.4663319105513, 3.7938797816206304], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 1249.3103448275863, 1017, 1596, 1208.5, 1440.3, 1529.6499999999999, 1596.0, 0.2524373259052925, 303.7675437820987, 1.2412323593097145], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/33aa942d-eb66-4a36-89c5-c6c1c4471e26", 2, 0, 0.0, 179.0, 168, 190, 179.0, 190.0, 190.0, 190.0, 0.03533756206159337, 0.03123095084545117, 0.021965193605668145], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 398.38461538461536, 93, 594, 389.0, 560.4, 594.0, 594.0, 0.07627541291401413, 0.014450615337225334, 0.051562683354357965], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 398.38461538461536, 93, 594, 389.0, 560.4, 594.0, 594.0, 0.07393799446033796, 0.014007784106743713, 0.04998257302798837], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 120.1, 83, 260, 88.0, 255.5, 259.8, 260.0, 0.11146594436734716, 0.04656751074253039, 0.06263428162985504], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/02fa6d73-c908-401a-89da-0abe0c9dfd78", 3, 0, 0.0, 793.6666666666666, 258, 1451, 672.0, 1451.0, 1451.0, 1451.0, 0.029808628604360007, 0.035232789864072654, 0.019115559358915762], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 98.55, 82, 268, 89.0, 121.90000000000006, 260.8499999999999, 268.0, 0.11146283828971422, 0.08283517572116457, 0.05594912000089171], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 159.4, 82, 594, 87.0, 562.5000000000005, 593.55, 594.0, 0.11146594436734716, 3.3045080659543995, 0.0646807267022243], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 170.89999999999995, 82, 759, 86.5, 557.4000000000007, 750.4999999999999, 759.0, 0.11146718684687196, 10.056876567507315, 0.06457259300543403], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 280.2307692307692, 87, 1212, 190.0, 851.1999999999997, 1212.0, 1212.0, 0.07670928949495784, 0.13501918285429365, 0.04958559465926324], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=acc0eedd-7931-465f-a835-b2193c0b10bc", 1, 0, 0.0, 382.0, 382, 382, 382.0, 382.0, 382.0, 382.0, 2.617801047120419, 0.47294257198952877, 1.804851112565445], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e727a257-72bb-4194-b5e2-f92e27abe508", 3, 0, 0.0, 648.0, 191, 1212, 541.0, 1212.0, 1212.0, 1212.0, 0.04769778682269143, 0.03066508104648944, 0.03058744792991605], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 96.88235294117646, 83, 246, 89.0, 121.19999999999989, 246.0, 246.0, 0.08949535150615412, 0.06650972900017899, 0.04492247136148752], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 86.41176470588233, 82, 96, 86.0, 90.39999999999999, 96.0, 96.0, 0.08949488036640257, 0.02394687228554131, 0.05104004895896396], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 566.8333333333333, 434, 693, 581.0, 693.0, 693.0, 693.0, 0.04155441203969831, 12.21837687600856, 0.023699000616390443], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 705.3333333333333, 581, 786, 748.0, 786.0, 786.0, 786.0, 0.04146137527381783, 37.30701835270501, 0.023605450961558395], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 142.0, 83, 263, 85.5, 263.0, 263.0, 263.0, 0.04160685681000229, 0.07362463333957436, 0.023038171690694626], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 97.625, 84, 259, 87.0, 140.7000000000001, 259.0, 259.0, 0.07265626773834662, 0.053995527098517355, 0.036470040642099764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 138.5, 83, 263, 87.0, 258.1, 263.0, 263.0, 0.07260121062518718, 0.01942649581181766, 0.04140537793467706], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 127.87500000000001, 84, 263, 86.0, 263.0, 263.0, 263.0, 0.07265791744244131, 0.019583579310658007, 0.04271490849643522], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 139.24999999999997, 82, 263, 87.0, 258.8, 263.0, 263.0, 0.07260088119319548, 0.01956820625910347, 0.04275227671825867], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 114.83333333333333, 82, 250, 88.5, 250.0, 250.0, 250.0, 0.04165567419708688, 0.03095700006248351, 0.023390637366528275], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 484.125, 83, 786, 661.5, 781.1, 786.0, 786.0, 0.09574474451113332, 53.854233208017426, 0.05114489770272454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 106.1764705882353, 83, 257, 86.0, 254.6, 257.0, 257.0, 0.08949723611476705, 0.024122301921558308, 0.05261458607528297], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 379.37499999999994, 84, 677, 431.5, 635.0, 677.0, 677.0, 0.09574245280196272, 17.604339638871433, 0.05123717200730036], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 96.88235294117648, 82, 261, 87.0, 128.19999999999987, 261.0, 261.0, 0.08949440923161153, 0.024121539988207798, 0.05270032106119312], "isController": false}, {"data": ["deleteBooks", 12, 1, 8.333333333333334, 460.50000000000006, 88, 1077, 455.5, 937.2000000000005, 1077.0, 1077.0, 0.0756205612305986, 0.014381937792635817, 0.05168758901170228], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/95118d7f-d90b-43d4-94b4-8967c4049161", 3, 0, 0.0, 356.0, 173, 638, 257.0, 638.0, 638.0, 638.0, 0.025838680504715557, 0.025914379764006717, 0.01656972675595366], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 269.8125, 170, 508, 256.5, 400.2000000000001, 508.0, 508.0, 0.07257124455148703, 0.11247125498360343, 0.1632144298848385], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1f00bfa7-5a77-43ae-82f4-a9046ea43bec", 1, 0, 0.0, 373.0, 373, 373, 373.0, 373.0, 373.0, 373.0, 2.680965147453083, 0.4843540549597855, 1.848399798927614], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b1a08e31-a674-4173-b33a-9c816263db15", 1, 0, 0.0, 226.0, 226, 226, 226.0, 226.0, 226.0, 226.0, 4.424778761061947, 1.4129908738938053, 2.6401756084070795], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 413.23809523809524, 99, 1007, 374.0, 839.4000000000001, 991.8999999999997, 1007.0, 0.08878554064052427, 0.05453721197547828, 0.04014424347320579], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 87.25, 84, 94, 87.0, 92.6, 94.0, 94.0, 0.09573786971272656, 0.07114894419080559, 0.048055922883145946], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 150.5, 84, 265, 88.5, 264.3, 265.0, 265.0, 0.09564115438873347, 0.11537181245965139, 0.04952511925256438], "isController": false}, {"data": ["login", 21, 0, 0.0, 2057.6666666666665, 1368, 3037, 1929.0, 2917.2000000000003, 3027.2999999999997, 3037.0, 0.08916743095893202, 30.599903746942832, 0.17677990532329563], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 113.05882352941175, 87, 265, 92.0, 265.0, 265.0, 265.0, 0.08848912624795693, 0.07163816958941045, 0.03145511909595344], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c247e28f-2247-4eb9-a904-abbe133d1155", 1, 0, 0.0, 604.0, 604, 604, 604.0, 604.0, 604.0, 604.0, 1.6556291390728477, 0.29911268625827814, 1.1414786837748345], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0497311a-01c1-4ffa-88c2-17d041f204a5", 3, 0, 0.0, 264.0, 171, 393, 228.0, 393.0, 393.0, 393.0, 0.052675937631689845, 0.03338543312789718, 0.03377981677553027], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=31855dda-df97-4549-86fa-eb31c5aef04f", 1, 0, 0.0, 171.0, 171, 171, 171.0, 171.0, 171.0, 171.0, 5.847953216374268, 1.0565149853801168, 4.0318896198830405], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/30e6f45b-27c9-4f49-9157-00602419bed0", 3, 0, 0.0, 272.0, 188, 436, 192.0, 436.0, 436.0, 436.0, 0.038556446637877856, 0.03214292312487148, 0.024725325480670367], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 586.4375, 171, 874, 764.5, 869.8, 874.0, 874.0, 0.09558630248285421, 71.52708312797213, 0.19969042733051354], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=980e03c5-1352-4cdc-98be-c58725790799", 1, 0, 0.0, 1077.0, 1077, 1077, 1077.0, 1077.0, 1077.0, 1077.0, 0.9285051067780873, 0.16774750464252555, 0.640160747446611], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 302.45, 169, 843, 182.0, 667.0000000000003, 834.8999999999999, 843.0, 0.11141006144264888, 13.483914040870781, 0.24771330848888964], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, 25.0, 651.625, 87, 1037, 801.0, 1037.0, 1037.0, 1037.0, 0.055250145031630706, 49.57748206960137, 0.10258910596632505], "isController": false}, {"data": ["register", 22, 6, 27.272727272727273, 828.0909090909091, 303, 1351, 869.5, 1271.6999999999998, 1347.25, 1351.0, 0.08923175514806388, 0.028075047962068393, 0.04025885827969288], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=02fa6d73-c908-401a-89da-0abe0c9dfd78", 1, 0, 0.0, 461.0, 461, 461, 461.0, 461.0, 461.0, 461.0, 2.1691973969631237, 0.3918960140997831, 1.495559924078091], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=95118d7f-d90b-43d4-94b4-8967c4049161", 1, 0, 0.0, 453.0, 453, 453, 453.0, 453.0, 453.0, 453.0, 2.207505518763797, 0.3988169150110375, 1.5219715783664458], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 95.18749999999997, 85, 123, 92.0, 118.10000000000001, 123.0, 123.0, 0.08251037825851533, 0.06405835030812469, 0.02932986102158162], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 206.1764705882353, 168, 508, 177.0, 376.7999999999999, 508.0, 508.0, 0.08945296878617583, 0.1386346303356065, 0.20118182335406537], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 303.5789473684211, 171, 679, 339.0, 533.0, 679.0, 679.0, 0.08623271941688528, 5.556310604014814, 0.19277817285348606], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 107.75, 84, 248, 88.5, 248.0, 248.0, 248.0, 0.037953544861090024, 0.028205710585243664, 0.01905090044785183], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 87.0, 83, 90, 87.5, 90.0, 90.0, 90.0, 0.0379542651105418, 0.010155731094031692, 0.021645791820855867], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 128.125, 85, 253, 87.0, 253.0, 253.0, 253.0, 0.037923858373350904, 0.010221664952192235, 0.022295080801520744], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/09b26031-b58e-4a57-a1ea-e1730f8dcca2", 1, 0, 0.0, 193.0, 193, 193, 193.0, 193.0, 193.0, 193.0, 5.181347150259067, 1.6545903497409327, 3.091604598445596], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 148.87500000000003, 84, 259, 87.0, 259.0, 259.0, 259.0, 0.037924217931518345, 0.010221761864354553, 0.022332327551470275], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 88.0, 88, 88, 88.0, 88.0, 88.0, 88.0, 11.363636363636363, 3.3513849431818183, 7.0245916193181825], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 816.3620689655171, 656, 1237, 711.0, 1089.8, 1174.6, 1237.0, 0.24287191856253323, 290.5592505412275, 0.47957716731781463], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, 27.272727272727273, 828.0909090909091, 303, 1351, 869.5, 1271.6999999999998, 1347.25, 1351.0, 0.09025159683791224, 0.028395921448291988, 0.040718982167104935], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8e1f6b1e-a206-4e43-a410-3c6526e2c398", 1, 0, 0.0, 463.0, 463, 463, 463.0, 463.0, 463.0, 463.0, 2.1598272138228944, 0.3902031587473002, 1.4890996220302375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 86.6, 85, 88, 87.0, 88.0, 88.0, 88.0, 0.046924123691990054, 0.012647517713856693, 0.027632076744404297], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 86.8, 85, 89, 86.0, 89.0, 89.0, 89.0, 0.046924123691990054, 0.012647517713856693, 0.027586252404861338], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 160.8125, 85, 817, 88.5, 492.9000000000003, 817.0, 817.0, 0.08002320672995168, 4.520534587842974, 0.0466150808734533], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 161.43750000000003, 84, 673, 89.0, 444.10000000000025, 673.0, 673.0, 0.08002520794050126, 1.4908504772753417, 0.046694396234813966], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 88.5625, 85, 94, 88.0, 91.9, 94.0, 94.0, 0.08009250684540645, 0.059521872763041314, 0.04020268410013565], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 86.0, 84, 87, 87.0, 87.0, 87.0, 87.0, 0.046923242959167395, 0.012555633369933462, 0.026760912000150155], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 119.0, 84, 264, 87.0, 259.8, 264.0, 264.0, 0.08009250684540645, 0.028949452242339902, 0.04525735036467119], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 87.4, 86, 89, 87.0, 89.0, 89.0, 89.0, 0.046922802605153996, 0.03487134060793183, 0.02355304740141519], "isController": false}, {"data": ["deleteAccount", 12, 1, 8.333333333333334, 507.5, 87, 895, 533.0, 828.1000000000003, 895.0, 895.0, 0.07554676974603694, 0.01419575938668614, 0.05141582319222875], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 128.6, 89, 257, 92.0, 257.0, 257.0, 257.0, 0.047877586586615346, 0.03768489725469918, 0.017018985856960923], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1144.0952380952378, 793, 1589, 1153.0, 1463.2, 1578.2999999999997, 1589.0, 0.0897186678913977, 0.04643641990472732, 0.04126708259457843], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 176.0, 174, 179, 176.0, 179.0, 179.0, 179.0, 0.04688452341881945, 0.0726618541656899, 0.10544439202494257], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=30e6f45b-27c9-4f49-9157-00602419bed0", 1, 0, 0.0, 458.0, 458, 458, 458.0, 458.0, 458.0, 458.0, 2.1834061135371177, 0.39446301855895194, 1.5053561681222707], "isController": false}, {"data": ["addBook", 59, 17, 28.8135593220339, 801.1016949152544, 451, 1544, 702.0, 1269.0, 1297.0, 1544.0, 0.27141661069657463, 78.10185034105338, 0.9869041485338903], "isController": true}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 158.58620689655172, 85, 463, 90.0, 347.5, 362.0499999999998, 463.0, 0.24346322236167722, 0.18093311739964488, 0.11768974127834982], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 506.5344827586207, 405, 869, 438.0, 641.0, 680.2, 869.0, 0.24327226360646936, 71.53012289967955, 0.12234884351301926], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 143.32758620689657, 82, 341, 90.0, 264.0, 265.1, 341.0, 0.24359922048249447, 0.431056433119414, 0.11846915214871312], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 646.4999999999999, 567, 844, 603.0, 775.4, 788.1499999999999, 844.0, 0.24327940639824838, 218.90323751672545, 0.12211485828974578], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 100.89473684210526, 87, 259, 91.0, 105.0, 259.0, 259.0, 0.08952003128489515, 0.06687775774701639, 0.031821573620802575], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 17, 9.659090909090908, 133.7045454545454, 83, 993, 92.0, 238.1000000000002, 268.6500000000001, 777.3999999999971, 0.7293311287642396, 1.5836680201767799, 0.3482800566785597], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 123.75, 87, 324, 91.0, 324.0, 324.0, 324.0, 0.03833455524728184, 0.029686818663178224, 0.013626736435557217], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e727a257-72bb-4194-b5e2-f92e27abe508", 1, 0, 0.0, 385.0, 385, 385, 385.0, 385.0, 385.0, 385.0, 2.5974025974025974, 0.4692573051948052, 1.7907873376623376], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c247e28f-2247-4eb9-a904-abbe133d1155", 3, 0, 0.0, 257.6666666666667, 175, 401, 197.0, 401.0, 401.0, 401.0, 0.04056191776747205, 0.02607740481469964, 0.026011386068333312], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 110.5, 87, 254, 93.5, 239.30000000000027, 253.9, 254.0, 0.11577357005169289, 0.09395296553999687, 0.04115388622931271], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4fe7492c-fcb7-4fea-bb1a-0c300a757f2b", 1, 0, 0.0, 163.0, 163, 163, 163.0, 163.0, 163.0, 163.0, 6.134969325153374, 1.9591161809815951, 3.660611579754601], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0497311a-01c1-4ffa-88c2-17d041f204a5", 1, 0, 0.0, 611.0, 611, 611, 611.0, 611.0, 611.0, 611.0, 1.6366612111292964, 0.2956858633387889, 1.1284011865793782], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 259.75, 177, 502, 179.0, 502.0, 502.0, 502.0, 0.03790786493427724, 0.05874978676825974, 0.0852556767027739], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1f00bfa7-5a77-43ae-82f4-a9046ea43bec", 3, 0, 0.0, 676.0, 167, 1315, 546.0, 1315.0, 1315.0, 1315.0, 0.016310375573581542, 0.02248516945121023, 0.010459453085923059], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/acc0eedd-7931-465f-a835-b2193c0b10bc", 3, 0, 0.0, 356.3333333333333, 310, 414, 345.0, 414.0, 414.0, 414.0, 0.03772873042822109, 0.03145289017795384, 0.024194530906118342], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 287.75, 172, 904, 183.0, 579.2000000000003, 904.0, 904.0, 0.07998800179973004, 6.0970590739514074, 0.17861578575713644], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8e1f6b1e-a206-4e43-a410-3c6526e2c398", 3, 0, 0.0, 450.33333333333337, 177, 895, 279.0, 895.0, 895.0, 895.0, 0.03678183467791373, 0.023647175614869672, 0.023587309347490253], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/31855dda-df97-4549-86fa-eb31c5aef04f", 3, 0, 0.0, 288.0, 166, 525, 173.0, 525.0, 525.0, 525.0, 0.07102272727272727, 0.032135934540719696, 0.04554517341382575], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 90.625, 86, 102, 90.0, 96.4, 102.0, 102.0, 0.07289692374981775, 0.06043895338241726, 0.025912578364193032], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/980e03c5-1352-4cdc-98be-c58725790799", 3, 0, 0.0, 333.66666666666663, 179, 611, 211.0, 611.0, 611.0, 611.0, 0.0514853524172373, 0.03310012077605588, 0.03301632300193928], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 100.3125, 85, 256, 90.0, 142.6000000000001, 256.0, 256.0, 0.0898038907535669, 0.069720794090904, 0.03192247679130698], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 98.3157894736842, 85, 266, 88.0, 94.0, 266.0, 266.0, 0.08626599893756612, 0.06410979022606232, 0.043301487747957994], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 122.47368421052632, 84, 267, 87.0, 259.0, 267.0, 267.0, 0.08627030757634922, 0.02990372914755855, 0.048819700165275745], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 167.68421052631584, 84, 586, 89.0, 265.0, 586.0, 586.0, 0.08627030757634922, 4.107616852280261, 0.0503273021685631], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 158.5263157894737, 84, 591, 89.0, 267.0, 591.0, 591.0, 0.08626991586412942, 1.3570928201862522, 0.050411321621057124], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 22.22222222222222, 0.45214770158251694], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 3.7037037037037037, 0.07535795026375283], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 3.7037037037037037, 0.07535795026375283], "isController": false}, {"data": ["401/Unauthorized", 19, 70.37037037037037, 1.4318010550113036], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1327, 27, "401/Unauthorized", 19, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 17, "401/Unauthorized", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
