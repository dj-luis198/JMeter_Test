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

    var data = {"OkPercent": 98.74608150470219, "KoPercent": 1.2539184952978057};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7287735849056604, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/afd20715-14b5-4d98-8abb-882d2d8c37b4"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ad7fcdda-3021-417b-9dce-b1ac9c5d490e"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8326b4e7-8ff6-4719-b96e-5db3d4ee47e8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=96b6ae89-523c-494f-8fbe-91d652a6e60b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f97b962b-5de6-408a-aa72-f373a920410d"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7effabe1-85e1-406e-8867-3134e5f3202c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a7f971ab-68c2-4215-b2b8-c53912c1617f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/316eae12-c85f-49d3-8137-2f2e7f5de711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.2, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/8388fd59-197b-4457-abf3-fecf9750fd81"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.4117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fb1ee74d-7c8c-4a81-9e3a-a6b22ddba8c7"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/77c0d094-9e61-4e8f-a1d2-7bf81aa6cf11"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7ff0240c-0460-4c8a-ad2d-d60a1f78d3c5"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/5dd06896-7103-4b4e-897b-54a4109f6f9a"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3af42d67-bca4-478e-931b-3d36a871836e"], "isController": false}, {"data": [0.35294117647058826, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/667f1767-536a-401a-b98b-f859b5496388"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=30eac900-85b0-455d-bb86-e9c381735af1"], "isController": false}, {"data": [0.8055555555555556, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.07142857142857142, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=afd20715-14b5-4d98-8abb-882d2d8c37b4"], "isController": false}, {"data": [0.22727272727272727, 500, 1500, "register"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/78e01ef2-6f04-4266-95a0-387210c7fcdd"], "isController": false}, {"data": [0.6764705882352942, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f97b962b-5de6-408a-aa72-f373a920410d"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8326b4e7-8ff6-4719-b96e-5db3d4ee47e8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.2, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.22727272727272727, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/96b6ae89-523c-494f-8fbe-91d652a6e60b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.29545454545454547, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8388fd59-197b-4457-abf3-fecf9750fd81"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fb1ee74d-7c8c-4a81-9e3a-a6b22ddba8c7"], "isController": false}, {"data": [0.2719298245614035, 500, 1500, "addBook"], "isController": true}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7effabe1-85e1-406e-8867-3134e5f3202c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.990909090909091, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.2909090909090909, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9378698224852071, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=77c0d094-9e61-4e8f-a1d2-7bf81aa6cf11"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=78e01ef2-6f04-4266-95a0-387210c7fcdd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3af42d67-bca4-478e-931b-3d36a871836e"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=316eae12-c85f-49d3-8137-2f2e7f5de711"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/30eac900-85b0-455d-bb86-e9c381735af1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1276, 16, 1.2539184952978057, 503.38714733542236, 140, 3395, 165.0, 1434.3, 1723.0, 2147.23, 5.004647733200504, 725.8645318450618, 3.6504300991712526], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/afd20715-14b5-4d98-8abb-882d2d8c37b4", 3, 0, 0.0, 386.0, 255, 476, 427.0, 476.0, 476.0, 476.0, 0.026902451710099178, 0.026981267486593612, 0.01725189774378105], "isController": false}, {"data": ["see books", 55, 0, 0.0, 2444.9636363636364, 1737, 3273, 2397.0, 2835.8, 3119.2, 3273.0, 0.24047920947925322, 289.3781375021862, 1.1824343942656639], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ad7fcdda-3021-417b-9dce-b1ac9c5d490e", 1, 0, 0.0, 451.0, 451, 451, 451.0, 451.0, 451.0, 451.0, 2.2172949002217295, 0.7080619456762749, 1.3230148281596452], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 604.4615384615385, 150, 1202, 535.0, 1039.1999999999998, 1202.0, 1202.0, 0.06592526103867785, 0.012489746720218263, 0.04456591226615549], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 604.4615384615385, 150, 1202, 535.0, 1039.1999999999998, 1202.0, 1202.0, 0.06583878613536455, 0.012473363779551485, 0.044507454659866705], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8326b4e7-8ff6-4719-b96e-5db3d4ee47e8", 1, 0, 0.0, 476.0, 476, 476, 476.0, 476.0, 476.0, 476.0, 2.100840336134454, 0.37954634978991597, 1.4484309348739497], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 180.44444444444443, 143, 451, 148.5, 432.1, 451.0, 451.0, 0.0985334931765556, 0.034587223353532696, 0.055735145391643266], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 148.77777777777777, 144, 153, 149.0, 152.1, 153.0, 153.0, 0.0985334931765556, 0.07322655108140509, 0.04945919481713826], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 220.55555555555554, 143, 1173, 148.0, 515.100000000001, 1173.0, 1173.0, 0.09853241442733508, 1.6346266682085164, 0.0575520819078065], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 290.83333333333337, 142, 1282, 150.0, 537.7000000000012, 1282.0, 1282.0, 0.09853295379899277, 4.95064478356963, 0.05745617336325815], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=96b6ae89-523c-494f-8fbe-91d652a6e60b", 1, 0, 0.0, 825.0, 825, 825, 825.0, 825.0, 825.0, 825.0, 1.2121212121212122, 0.21898674242424243, 0.8357007575757576], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f97b962b-5de6-408a-aa72-f373a920410d", 1, 0, 0.0, 437.0, 437, 437, 437.0, 437.0, 437.0, 437.0, 2.288329519450801, 0.41341890732265446, 1.577695938215103], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 335.50000000000006, 146, 649, 299.0, 554.5, 649.0, 649.0, 0.06703728709675875, 0.1320498012224728, 0.04333388250039504], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/7effabe1-85e1-406e-8867-3134e5f3202c", 3, 0, 0.0, 662.6666666666666, 274, 1273, 441.0, 1273.0, 1273.0, 1273.0, 0.08097384544792031, 0.036638556371292076, 0.05192658708737078], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a7f971ab-68c2-4215-b2b8-c53912c1617f", 1, 0, 0.0, 332.0, 332, 332, 332.0, 332.0, 332.0, 332.0, 3.0120481927710845, 0.9618552334337349, 1.7972279743975903], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/316eae12-c85f-49d3-8137-2f2e7f5de711", 3, 0, 0.0, 378.0, 314, 490, 330.0, 490.0, 490.0, 490.0, 0.03988354006301599, 0.0256412733152528, 0.025576358699264817], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 164.94117647058826, 143, 441, 149.0, 210.5999999999998, 441.0, 441.0, 0.09499329459097004, 0.07059560271848457, 0.04768218107398301], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 217.70588235294122, 142, 456, 150.0, 448.0, 456.0, 456.0, 0.09483696410141976, 0.042134023458202004, 0.05314966807062565], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 980.2, 834, 1201, 879.0, 1201.0, 1201.0, 1201.0, 0.05886923964490075, 17.309511098323405, 0.03357386323498246], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1557.4, 1323, 1711, 1569.0, 1711.0, 1711.0, 1711.0, 0.0586792474973301, 52.79969004521236, 0.03340820438568696], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 325.4, 149, 453, 432.0, 453.0, 453.0, 453.0, 0.05960754393075988, 0.10547741172122743, 0.03300534903197348], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 146.46666666666667, 141, 154, 145.0, 153.4, 154.0, 154.0, 0.06977620445358254, 0.05185516756755499, 0.03502438387611467], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 204.13333333333335, 142, 444, 149.0, 436.8, 444.0, 444.0, 0.06968802991939418, 0.018646992380775395, 0.039743954563404495], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 204.33333333333334, 143, 442, 149.0, 434.2, 442.0, 442.0, 0.0697800996459823, 0.018807917482706164, 0.041023066393438806], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 184.73333333333335, 141, 445, 144.0, 443.2, 445.0, 445.0, 0.06978107351203491, 0.01880817997004066, 0.041091784499762744], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8388fd59-197b-4457-abf3-fecf9750fd81", 3, 0, 0.0, 636.3333333333334, 247, 1136, 526.0, 1136.0, 1136.0, 1136.0, 0.06411763448673834, 0.029011559875184337, 0.04111710284468571], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 206.2, 142, 443, 150.0, 443.0, 443.0, 443.0, 0.059613229367861315, 0.04430240971576412, 0.03347422547511744], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 1069.4705882352941, 144, 1857, 1553.0, 1801.8, 1857.0, 1857.0, 0.08407558890004402, 44.51013257669425, 0.0451771058462208], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 325.2941176470589, 142, 1611, 148.0, 1465.3999999999999, 1611.0, 1611.0, 0.0949954178680793, 10.078714792323254, 0.054886483968126246], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 780.529411764706, 143, 1331, 1108.0, 1328.6, 1331.0, 1331.0, 0.08395186101522492, 14.529690563316986, 0.04519260624848763], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 342.94117647058823, 141, 1294, 149.0, 1206.0, 1294.0, 1294.0, 0.09484913408319944, 3.3035918530173185, 0.05489459018199875], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 503.6923076923077, 148, 825, 468.0, 824.6, 825.0, 825.0, 0.06591556722880815, 0.012487910197645292, 0.045084227735749556], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fb1ee74d-7c8c-4a81-9e3a-a6b22ddba8c7", 1, 0, 0.0, 483.0, 483, 483, 483.0, 483.0, 483.0, 483.0, 2.070393374741201, 0.37404567805383027, 1.427439182194617], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/77c0d094-9e61-4e8f-a1d2-7bf81aa6cf11", 3, 0, 0.0, 1432.6666666666667, 420, 2088, 1790.0, 2088.0, 2088.0, 2088.0, 0.02223655244490894, 0.026282852189929803, 0.014259768332184444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 392.33333333333337, 289, 594, 300.0, 592.2, 594.0, 594.0, 0.06963788300835655, 0.10792511751392757, 0.1566172310236769], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7ff0240c-0460-4c8a-ad2d-d60a1f78d3c5", 1, 0, 0.0, 402.0, 402, 402, 402.0, 402.0, 402.0, 402.0, 2.487562189054726, 0.7943680037313432, 1.48427782960199], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5dd06896-7103-4b4e-897b-54a4109f6f9a", 1, 0, 0.0, 850.0, 850, 850, 850.0, 850.0, 850.0, 850.0, 1.176470588235294, 0.3756893382352941, 0.7019761029411765], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 661.1818181818182, 257, 1581, 474.5, 1296.7999999999997, 1548.8999999999996, 1581.0, 0.10765632187282852, 0.06612873677539954, 0.048676637721796485], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 147.6470588235294, 143, 153, 148.0, 151.4, 153.0, 153.0, 0.08407475729595798, 0.06248133818576565, 0.04220158715832266], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 164.94117647058823, 141, 446, 148.0, 211.5999999999998, 446.0, 446.0, 0.08407517309594462, 0.09677724715628092, 0.043795592235410484], "isController": false}, {"data": ["login", 22, 0, 0.0, 2998.6363636363635, 1774, 4583, 2879.0, 4439.5, 4567.099999999999, 4583.0, 0.10238367818017666, 27.978980550882362, 0.19306013179571666], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 160.0, 146, 261, 152.0, 192.19999999999993, 261.0, 261.0, 0.09181843714217815, 0.07433348085045477, 0.03263858507788364], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3af42d67-bca4-478e-931b-3d36a871836e", 3, 0, 0.0, 323.0, 238, 468, 263.0, 468.0, 468.0, 468.0, 0.034008207314031785, 0.02835124314167819, 0.021808648570521685], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 1236.3529411764705, 299, 2008, 1699.0, 1951.2, 2008.0, 2008.0, 0.08389178946121732, 59.09103342501801, 0.17604842375963523], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/667f1767-536a-401a-b98b-f859b5496388", 2, 0, 0.0, 401.5, 343, 460, 401.5, 460.0, 460.0, 460.0, 0.04154031487558676, 0.03671287593984962, 0.025820713299131808], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=30eac900-85b0-455d-bb86-e9c381735af1", 1, 0, 0.0, 824.0, 824, 824, 824.0, 824.0, 824.0, 824.0, 1.2135922330097086, 0.21925250303398058, 0.8367149575242719], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 457.77777777777777, 291, 1428, 302.5, 687.3000000000012, 1428.0, 1428.0, 0.098453190977312, 6.687675497940687, 0.22002408000962653], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, 28.571428571428573, 1301.5714285714287, 144, 2152, 1627.0, 2152.0, 2152.0, 2152.0, 0.08201427048306405, 70.09025597239633, 0.14762111018031424], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=afd20715-14b5-4d98-8abb-882d2d8c37b4", 1, 0, 0.0, 446.0, 446, 446, 446.0, 446.0, 446.0, 446.0, 2.242152466367713, 0.40507637331838564, 1.5458590246636772], "isController": false}, {"data": ["register", 22, 5, 22.727272727272727, 1168.772727272727, 483, 2079, 1115.0, 1732.3, 2030.9999999999993, 2079.0, 0.1038010040388027, 0.03282485585815121, 0.04683209361906919], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/78e01ef2-6f04-4266-95a0-387210c7fcdd", 3, 0, 0.0, 835.0, 241, 1998, 266.0, 1998.0, 1998.0, 1998.0, 0.03704161007531794, 0.02424826753302877, 0.02375389708606001], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 597.1764705882352, 291, 1762, 573.0, 1610.8, 1762.0, 1762.0, 0.09475714301639855, 13.466341052208397, 0.2102587409980714], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 153.625, 144, 172, 152.5, 172.0, 172.0, 172.0, 0.09346722513333684, 0.07256488670019803, 0.03322467768411583], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f97b962b-5de6-408a-aa72-f373a920410d", 3, 0, 0.0, 636.3333333333334, 423, 861, 625.0, 861.0, 861.0, 861.0, 0.020007069164438104, 0.02364767842971183, 0.01283005411912209], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 543.6875000000001, 288, 1904, 581.5, 994.700000000001, 1904.0, 1904.0, 0.07558150520567616, 5.761175323406174, 0.16877593685637624], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8326b4e7-8ff6-4719-b96e-5db3d4ee47e8", 3, 0, 0.0, 372.6666666666667, 311, 483, 324.0, 483.0, 483.0, 483.0, 0.028288543140028287, 0.0235829944601603, 0.01814076496935408], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 148.44444444444446, 141, 165, 146.0, 165.0, 165.0, 165.0, 0.044540784511684535, 0.03310111036464056, 0.02235738597559165], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 212.77777777777777, 143, 446, 149.0, 446.0, 446.0, 446.0, 0.044539902804034325, 0.011917903679985747, 0.025401663317925826], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 146.66666666666666, 140, 151, 148.0, 151.0, 151.0, 151.0, 0.04454034365349592, 0.012005014500356324, 0.026184850468168503], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 244.2222222222222, 143, 453, 146.0, 453.0, 453.0, 453.0, 0.04447233573648659, 0.0119866842414749, 0.026188299266700597], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 148.0, 148, 148, 148.0, 148.0, 148.0, 148.0, 6.756756756756757, 1.9927153716216217, 4.176784206081082], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1675.9636363636364, 1123, 2628, 1656.0, 2170.8, 2508.0, 2628.0, 0.25231209630064594, 301.852985052802, 0.4982178307811582], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, 22.727272727272727, 1168.772727272727, 483, 2079, 1115.0, 1732.3, 2030.9999999999993, 2079.0, 0.1034437360115857, 0.03271187745678873, 0.046670904333352144], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/96b6ae89-523c-494f-8fbe-91d652a6e60b", 3, 0, 0.0, 520.6666666666666, 245, 960, 357.0, 960.0, 960.0, 960.0, 0.027592803796769802, 0.02767364208914315, 0.01769460399727751], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 4, 0, 0.0, 293.5, 149, 443, 291.0, 443.0, 443.0, 443.0, 0.05710696133858717, 0.015392110673291074, 0.033628415710125065], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 4, 0, 0.0, 144.0, 141, 150, 142.5, 150.0, 150.0, 150.0, 0.05734355960146226, 0.015455881298831626, 0.0337117410938284], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 485.25, 143, 1624, 152.0, 1614.2, 1624.0, 1624.0, 0.0904184679720833, 15.274556693439008, 0.051699231443022235], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 388.875, 143, 1184, 150.5, 1160.2, 1184.0, 1184.0, 0.09041897894368028, 5.004710351984131, 0.05178782338912938], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 219.8125, 145, 447, 149.5, 437.2, 447.0, 447.0, 0.09041795700626144, 0.0671953762517236, 0.04538557607540858], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 4, 0, 0.0, 293.25, 143, 444, 293.0, 444.0, 444.0, 444.0, 0.05709636438899753, 0.01527773812752473, 0.032562770315600155], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 237.75, 141, 448, 149.0, 444.5, 448.0, 448.0, 0.09027358538470652, 0.049577741778051104, 0.05006260966830099], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 4, 0, 0.0, 145.25, 143, 149, 144.5, 149.0, 149.0, 149.0, 0.05733862759994839, 0.042612007425352275, 0.02878130330700535], "isController": false}, {"data": ["deleteAccount", 12, 1, 8.333333333333334, 757.0833333333334, 144, 1998, 508.0, 1935.6000000000001, 1998.0, 1998.0, 0.08175779253960143, 0.015362853432123999, 0.055642937744847555], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 4, 0, 0.0, 156.5, 152, 166, 154.0, 166.0, 166.0, 166.0, 0.05173506473349975, 0.040721154467969534, 0.01839019879198624], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1477.681818181818, 967, 3395, 1147.5, 2329.1, 3240.199999999998, 3395.0, 0.10608902798339225, 0.054909360186716695, 0.04879680876970483], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 4, 0, 0.0, 442.5, 297, 588, 442.5, 588.0, 588.0, 588.0, 0.05697518730592827, 0.08830041235791812, 0.12813853160698516], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8388fd59-197b-4457-abf3-fecf9750fd81", 1, 0, 0.0, 249.0, 249, 249, 249.0, 249.0, 249.0, 249.0, 4.016064257028112, 0.725558483935743, 2.7688880522088355], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fb1ee74d-7c8c-4a81-9e3a-a6b22ddba8c7", 2, 0, 0.0, 247.0, 246, 248, 247.0, 248.0, 248.0, 248.0, 0.01268126280014964, 0.025065308503420772, 0.007882445090132075], "isController": false}, {"data": ["addBook", 57, 7, 12.280701754385966, 1536.2807017543862, 736, 3879, 1169.0, 2534.2000000000003, 2692.5999999999967, 3879.0, 0.2699362098114709, 97.39081365196462, 0.9782320273393288], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 245.87272727272727, 143, 598, 151.0, 586.6, 595.4, 598.0, 0.25429527843021216, 0.18898311219276506, 0.122925940256792], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7effabe1-85e1-406e-8867-3134e5f3202c", 1, 0, 0.0, 432.0, 432, 432, 432.0, 432.0, 432.0, 432.0, 2.314814814814815, 0.41820384837962965, 1.5959563078703705], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 951.1818181818182, 707, 1330, 883.0, 1234.6, 1322.6, 1330.0, 0.25400754633328565, 74.68665246629782, 0.1277479359000411], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 230.94545454545457, 143, 582, 152.0, 443.8, 446.4, 582.0, 0.2548632542793857, 0.4509884929240693, 0.12394716858509189], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1425.854545454546, 972, 2045, 1461.0, 1737.3999999999999, 1919.3999999999999, 2045.0, 0.2530457506717214, 227.69101126139856, 0.12701710531764143], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 189.74999999999997, 146, 434, 154.5, 431.9, 434.0, 434.0, 0.07589592770912885, 0.056699594431136306, 0.026978630552854398], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 7, 4.1420118343195265, 231.95857988165676, 143, 2346, 154.0, 366.0, 455.5, 1961.7000000000062, 0.7190510228394432, 1.600014838404983, 0.3448125880199292], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 186.0, 147, 448, 155.0, 448.0, 448.0, 448.0, 0.04541394813727123, 0.03516920007114852, 0.016143239376920634], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=77c0d094-9e61-4e8f-a1d2-7bf81aa6cf11", 1, 0, 0.0, 468.0, 468, 468, 468.0, 468.0, 468.0, 468.0, 2.136752136752137, 0.38603432158119655, 1.473190438034188], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 158.8888888888889, 143, 234, 152.5, 179.10000000000008, 234.0, 234.0, 0.10297188295529304, 0.08356409642172706, 0.036603286519264325], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=78e01ef2-6f04-4266-95a0-387210c7fcdd", 1, 0, 0.0, 444.0, 444, 444, 444.0, 444.0, 444.0, 444.0, 2.2522522522522523, 0.4069010416666667, 1.5528223536036037], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3af42d67-bca4-478e-931b-3d36a871836e", 1, 0, 0.0, 495.0, 495, 495, 495.0, 495.0, 495.0, 495.0, 2.0202020202020203, 0.36497790404040403, 1.392834595959596], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 428.8888888888889, 293, 600, 314.0, 600.0, 600.0, 600.0, 0.044440933062079045, 0.06887476637648383, 0.09994870004098443], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=316eae12-c85f-49d3-8137-2f2e7f5de711", 1, 0, 0.0, 821.0, 821, 821, 821.0, 821.0, 821.0, 821.0, 1.2180267965895248, 0.22005366930572473, 0.8397723812423874], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 761.3750000000001, 290, 2049, 589.0, 1846.7000000000003, 2049.0, 2049.0, 0.09019775858569914, 20.346305441673056, 0.19852975891830338], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 171.8, 145, 435, 152.0, 275.4000000000001, 435.0, 435.0, 0.07323682347484316, 0.06072076477552914, 0.026033402094573152], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 170.88235294117646, 146, 457, 154.0, 218.5999999999998, 457.0, 457.0, 0.07995785750569112, 0.06207665695021918, 0.02842251966022614], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/30eac900-85b0-455d-bb86-e9c381735af1", 3, 0, 0.0, 568.0, 371, 684, 649.0, 684.0, 684.0, 684.0, 0.023813492724977972, 0.023883258816945682, 0.015271022352931839], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 146.3125, 143, 153, 145.5, 150.2, 153.0, 153.0, 0.07574107912102478, 0.0562880480577147, 0.03801847135567064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 182.06250000000003, 142, 446, 146.0, 435.5, 446.0, 446.0, 0.07574179621669727, 0.027376887035844805, 0.04279892269129537], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 338.875, 144, 1760, 151.5, 839.5000000000009, 1760.0, 1760.0, 0.07563438339068941, 4.2726086609050595, 0.04405850555912718], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 311.9375, 143, 1298, 150.0, 708.6000000000006, 1298.0, 1298.0, 0.07574000350297516, 1.4110181438728704, 0.04419399618459732], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 31.25, 0.39184952978056425], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 6.25, 0.07836990595611286], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 6.25, 0.07836990595611286], "isController": false}, {"data": ["401/Unauthorized", 9, 56.25, 0.7053291536050157], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1276, 16, "401/Unauthorized", 9, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
