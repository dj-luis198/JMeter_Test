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

    var data = {"OkPercent": 96.95354150799696, "KoPercent": 3.0464584920030466};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8005215123859192, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/1fd6c62d-67e4-4a38-97ea-cf7e66d043e3"], "isController": false}, {"data": [0.49122807017543857, 500, 1500, "see books"], "isController": true}, {"data": [0.4666666666666667, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/be2e09f7-2ef9-4077-a933-c6e004658640"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a6b7ffbe-243c-4798-9a83-ca0e5e2b4ca3"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/96677759-94d9-47e5-8620-cbe54a21daa6"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/89bcb128-010d-42d0-b536-cf9b603c5328"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/af4ec9fc-527a-4be5-9a87-a3cb09071f8b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7631578947368421, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7894736842105263, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/17d01a3c-15ff-4447-ac75-64fb0ce7563d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=83437841-810d-41f6-b146-901e665c5234"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a3e3d254-7ef4-4813-9e6d-8df76ed69b66"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3f9da0de-3a95-47fa-b7b1-3cddbc0b0130"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3efd7740-0148-4e88-857b-2084c2bc5665"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/df059024-a5c8-4151-813b-2906a742d050"], "isController": false}, {"data": [0.7631578947368421, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9cbb5d6a-5b01-48a8-ac6b-ec8f08bee4a5"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.32, 500, 1500, "register"], "isController": true}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=89bcb128-010d-42d0-b536-cf9b603c5328"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=af4ec9fc-527a-4be5-9a87-a3cb09071f8b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a6b7ffbe-243c-4798-9a83-ca0e5e2b4ca3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.32, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3efd7740-0148-4e88-857b-2084c2bc5665"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/1b446a67-ee81-4c46-8408-856e73f09e9f"], "isController": false}, {"data": [0.3541666666666667, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.35454545454545455, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f5dc3256-7406-405b-b069-503f68017270"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a4a98018-37fc-40eb-862d-3293fd64a014"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1fd6c62d-67e4-4a38-97ea-cf7e66d043e3"], "isController": false}, {"data": [0.8947368421052632, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9101796407185628, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9cbb5d6a-5b01-48a8-ac6b-ec8f08bee4a5"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a4a98018-37fc-40eb-862d-3293fd64a014"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=96677759-94d9-47e5-8620-cbe54a21daa6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a3e3d254-7ef4-4813-9e6d-8df76ed69b66"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3f9da0de-3a95-47fa-b7b1-3cddbc0b0130"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/83437841-810d-41f6-b146-901e665c5234"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1313, 40, 3.0464584920030466, 273.8255902513331, 78, 3204, 89.0, 680.0, 808.4999999999998, 1330.3199999999988, 5.0590868983905715, 731.5748533182677, 3.6971793146247296], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/1fd6c62d-67e4-4a38-97ea-cf7e66d043e3", 3, 0, 0.0, 853.6666666666666, 227, 1919, 415.0, 1919.0, 1919.0, 1919.0, 0.02450780165019198, 0.024579601850339024, 0.015716266032186912], "isController": false}, {"data": ["see books", 57, 0, 0.0, 1193.4736842105267, 962, 1678, 1151.0, 1385.4, 1473.4999999999998, 1678.0, 0.2607144490692037, 313.72728932728813, 1.281930909241641], "isController": true}, {"data": ["deleteBook", 15, 4, 26.666666666666668, 426.26666666666665, 80, 649, 536.0, 638.8, 649.0, 649.0, 0.08471800201064059, 0.017886750033887202, 0.056500729986783994], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 4, 26.666666666666668, 426.26666666666665, 80, 649, 536.0, 638.8, 649.0, 649.0, 0.0849829467553511, 0.017942688562995027, 0.056677428812618266], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 113.94736842105263, 80, 242, 81.0, 241.0, 242.0, 242.0, 0.11129073826761322, 0.038576518239966266, 0.06297856847894848], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/be2e09f7-2ef9-4077-a933-c6e004658640", 1, 0, 0.0, 182.0, 182, 182, 182.0, 182.0, 182.0, 182.0, 5.4945054945054945, 1.7545930631868132, 3.2784598214285716], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 99.10526315789474, 81, 245, 82.0, 241.0, 245.0, 245.0, 0.11128878267643665, 0.08270582384450029, 0.055861752241883236], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a6b7ffbe-243c-4798-9a83-ca0e5e2b4ca3", 1, 0, 0.0, 338.0, 338, 338, 338.0, 338.0, 338.0, 338.0, 2.9585798816568047, 0.5345090606508875, 2.0398021449704142], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 144.31578947368422, 80, 555, 81.0, 325.0, 555.0, 555.0, 0.11129008639625128, 1.7506795467857665, 0.06503171218333578], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 126.84210526315788, 80, 553, 81.0, 324.0, 553.0, 553.0, 0.11128943453252581, 5.298860866607898, 0.06492265018216323], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/96677759-94d9-47e5-8620-cbe54a21daa6", 3, 0, 0.0, 792.3333333333334, 208, 1130, 1039.0, 1130.0, 1130.0, 1130.0, 0.02527827164030705, 0.02535232907675326, 0.01621034997767086], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/89bcb128-010d-42d0-b536-cf9b603c5328", 3, 0, 0.0, 668.3333333333334, 287, 1208, 510.0, 1208.0, 1208.0, 1208.0, 0.015132332245486782, 0.02086114162097543, 0.009704002123570626], "isController": false}, {"data": ["goToProfile", 15, 4, 26.666666666666668, 197.73333333333335, 78, 446, 201.0, 350.6000000000001, 446.0, 446.0, 0.08469695429752347, 0.13129130741041886, 0.054733201064923034], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 91.92857142857143, 79, 234, 81.0, 158.5, 234.0, 234.0, 0.08986917615642372, 0.06678754204593598, 0.04511011381289237], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 103.07142857142856, 78, 239, 81.0, 237.5, 239.0, 239.0, 0.08986859926949667, 0.04332950321922161, 0.05017496292920281], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 485.0, 384, 564, 511.5, 564.0, 564.0, 564.0, 0.04802180189806172, 14.12000423192129, 0.027387433894988322], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/af4ec9fc-527a-4be5-9a87-a3cb09071f8b", 3, 0, 0.0, 376.0, 262, 446, 420.0, 446.0, 446.0, 446.0, 0.06171188776664678, 0.02792302213399708, 0.03957435511077284], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 636.7499999999999, 553, 726, 635.5, 726.0, 726.0, 726.0, 0.047923418377432865, 43.12157609639796, 0.02728452433012047], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 183.25000000000003, 80, 248, 241.5, 248.0, 248.0, 248.0, 0.04806103751764741, 0.08504550779489951, 0.02661192214111922], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 106.0769230769231, 81, 241, 82.0, 238.6, 241.0, 241.0, 0.06738299978748438, 0.05007662386550354, 0.033823107315202126], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 130.3846153846154, 79, 244, 82.0, 242.8, 244.0, 244.0, 0.06732786078670015, 0.033572892120050754, 0.03752799932672139], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 190.76923076923077, 80, 719, 82.0, 652.1999999999999, 719.0, 719.0, 0.06721924331814867, 9.320560088186477, 0.03862884700900221], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 160.6923076923077, 80, 476, 83.0, 445.2, 476.0, 476.0, 0.06727246382811368, 3.058471414377678, 0.03872512697677548], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 81.87500000000001, 79, 84, 82.5, 84.0, 84.0, 84.0, 0.04810988297270967, 0.035753536076398494, 0.027014826864558653], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 209.42857142857144, 78, 1095, 81.0, 824.5, 1095.0, 1095.0, 0.08986917615642372, 11.572825426718106, 0.051729941520843224], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 384.7368421052632, 78, 788, 82.0, 730.0, 788.0, 788.0, 0.09577530106209768, 40.83511592749558, 0.05240665373700102], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 189.42857142857142, 79, 643, 82.0, 599.5, 643.0, 643.0, 0.08986975305075716, 3.7957182278326624, 0.05181803701991899], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 302.6842105263158, 78, 627, 82.0, 571.0, 627.0, 627.0, 0.09577530106209768, 13.353063754215373, 0.052500184304444475], "isController": false}, {"data": ["deleteBooks", 15, 4, 26.666666666666668, 499.6666666666667, 83, 1601, 446.0, 1232.0000000000002, 1601.0, 1601.0, 0.08498246528466294, 0.017942586908734497, 0.056975874186292894], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 310.2307692307692, 163, 801, 166.0, 734.1999999999999, 801.0, 801.0, 0.06719040727723796, 12.454740355915341, 0.14846798603214803], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 374.00000000000006, 85, 746, 369.0, 700.0, 744.75, 746.0, 0.10627980816494627, 0.06528320247631954, 0.0480542491995802], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 81.68421052631578, 79, 84, 82.0, 83.0, 84.0, 84.0, 0.09577481827988427, 0.07117640303807805, 0.04807446933189503], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/17d01a3c-15ff-4447-ac75-64fb0ce7563d", 1, 0, 0.0, 292.0, 292, 292, 292.0, 292.0, 292.0, 292.0, 3.4246575342465753, 1.0936162243150687, 2.043423587328767], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 98.57894736842104, 78, 246, 82.0, 241.0, 246.0, 246.0, 0.09577626664112633, 0.09376780052324087, 0.05081222369807288], "isController": false}, {"data": ["login", 24, 0, 0.0, 2342.7916666666665, 1587, 4747, 2121.5, 3496.0, 4460.25, 4747.0, 0.10430247718383312, 41.73426635158627, 0.21502200130378096], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 84.42857142857143, 82, 90, 84.0, 89.5, 90.0, 90.0, 0.08753501400560224, 0.07086574864320729, 0.03111596200980392], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=83437841-810d-41f6-b146-901e665c5234", 1, 0, 0.0, 211.0, 211, 211, 211.0, 211.0, 211.0, 211.0, 4.739336492890995, 0.8562277843601896, 3.267550355450237], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a3e3d254-7ef4-4813-9e6d-8df76ed69b66", 1, 0, 0.0, 813.0, 813, 813, 813.0, 813.0, 813.0, 813.0, 1.2300123001230012, 0.22221901906519068, 0.8480358241082412], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3f9da0de-3a95-47fa-b7b1-3cddbc0b0130", 1, 0, 0.0, 497.0, 497, 497, 497.0, 497.0, 497.0, 497.0, 2.012072434607646, 0.3635091800804829, 1.3872296277665996], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3efd7740-0148-4e88-857b-2084c2bc5665", 1, 0, 0.0, 986.0, 986, 986, 986.0, 986.0, 986.0, 986.0, 1.0141987829614605, 0.18322927231237324, 0.6992425202839757], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/df059024-a5c8-4151-813b-2906a742d050", 1, 0, 0.0, 470.0, 470, 470, 470.0, 470.0, 470.0, 470.0, 2.127659574468085, 0.6794381648936171, 1.26953125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 476.57894736842104, 163, 873, 324.0, 813.0, 873.0, 873.0, 0.09573524669461464, 54.330392177548575, 0.20370803237614882], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9cbb5d6a-5b01-48a8-ac6b-ec8f08bee4a5", 1, 0, 0.0, 446.0, 446, 446, 446.0, 446.0, 446.0, 446.0, 2.242152466367713, 0.40507637331838564, 1.5458590246636772], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 16, 8, 50.0, 400.18750000000006, 78, 807, 357.0, 802.8, 807.0, 807.0, 0.09580092567644435, 57.3184235658302, 0.13974866477459838], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 269.2631578947368, 163, 797, 165.0, 571.0, 797.0, 797.0, 0.11123535645077251, 7.167328071852186, 0.24867299695859119], "isController": false}, {"data": ["register", 25, 9, 36.0, 715.52, 91, 2111, 735.0, 1252.8000000000002, 1873.6999999999994, 2111.0, 0.10130767952733889, 0.031563673902736525, 0.0457071757242486], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 326.5, 161, 1176, 165.5, 907.0, 1176.0, 1176.0, 0.08982189601190782, 15.470493306664784, 0.19872843873505106], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 96.31250000000001, 80, 245, 85.5, 140.7000000000001, 245.0, 245.0, 0.08692912016864249, 0.0674889165371785, 0.03090058568494714], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=89bcb128-010d-42d0-b536-cf9b603c5328", 1, 0, 0.0, 587.0, 587, 587, 587.0, 587.0, 587.0, 587.0, 1.7035775127768313, 0.307775234241908, 1.174536839863714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 258.64705882352945, 162, 488, 171.0, 480.0, 488.0, 488.0, 0.09852787759360149, 0.15269896654398982, 0.22159150595514085], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 102.25, 81, 241, 82.0, 241.0, 241.0, 241.0, 0.03981624801540889, 0.02959000462863883, 0.01998589011710954], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 101.25, 79, 243, 80.5, 243.0, 243.0, 243.0, 0.039816842524387816, 0.010654116066095959, 0.02270804300218993], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=af4ec9fc-527a-4be5-9a87-a3cb09071f8b", 1, 0, 0.0, 239.0, 239, 239, 239.0, 239.0, 239.0, 239.0, 4.184100418410042, 0.755916579497908, 2.884741108786611], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 101.25, 80, 241, 81.0, 241.0, 241.0, 241.0, 0.039817040697992724, 0.01073193675063085, 0.023408064941593375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 101.625, 80, 244, 81.0, 244.0, 244.0, 244.0, 0.039817040697992724, 0.01073193675063085, 0.02344694877040001], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a6b7ffbe-243c-4798-9a83-ca0e5e2b4ca3", 3, 0, 0.0, 432.66666666666663, 187, 784, 327.0, 784.0, 784.0, 784.0, 0.08997120921305182, 0.04070962916866602, 0.057696380908109406], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 85.0, 83, 88, 84.5, 88.0, 88.0, 88.0, 0.1449380389883325, 0.04274539821726212, 0.08959548699181101], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 766.5438596491226, 633, 1169, 648.0, 1043.2, 1125.7, 1169.0, 0.2527111024411006, 302.3303351137643, 0.49900571204678257], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 9, 36.0, 715.52, 91, 2111, 735.0, 1252.8000000000002, 1873.6999999999994, 2111.0, 0.09632686402114567, 0.030011838571588196, 0.04345997185329033], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 136.16666666666666, 80, 243, 84.5, 243.0, 243.0, 243.0, 0.04523044913835995, 0.01219101949432358, 0.02663472737346782], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 109.0, 80, 239, 82.5, 239.0, 239.0, 239.0, 0.04528609490455955, 0.012206017767244566, 0.02662327063725083], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 110.99999999999999, 79, 243, 81.0, 240.9, 243.0, 243.0, 0.09073535332913683, 0.02445601320199391, 0.053342463578262084], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 110.125, 79, 240, 81.0, 239.3, 240.0, 240.0, 0.09073483877553336, 0.024455874513717973, 0.05343076931801427], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 92.9375, 80, 245, 82.0, 136.5000000000001, 245.0, 245.0, 0.09073432422776584, 0.06743048900129864, 0.04554437759089027], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 109.33333333333333, 80, 242, 81.5, 242.0, 242.0, 242.0, 0.045230790106518516, 0.012102770008970774, 0.02579568498262384], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 111.4375, 79, 242, 82.0, 242.0, 242.0, 242.0, 0.09073432422776584, 0.024278520350007656, 0.051746919286147705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 109.16666666666666, 81, 243, 83.0, 243.0, 243.0, 243.0, 0.045285069512581703, 0.033654236229565114, 0.022730982157682614], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3efd7740-0148-4e88-857b-2084c2bc5665", 3, 0, 0.0, 499.3333333333333, 180, 1133, 185.0, 1133.0, 1133.0, 1133.0, 0.038999532005615935, 0.032512305164838017, 0.02500946551141386], "isController": false}, {"data": ["deleteAccount", 15, 4, 26.666666666666668, 494.8, 79, 1133, 453.0, 1076.6000000000001, 1133.0, 1133.0, 0.08495791751152597, 0.017317919253163266, 0.05780567681724986], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 86.16666666666667, 83, 100, 83.5, 100.0, 100.0, 100.0, 0.04592035879107002, 0.03614434490781488, 0.01632325253901317], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1b446a67-ee81-4c46-8408-856e73f09e9f", 1, 0, 0.0, 1106.0, 1106, 1106, 1106.0, 1106.0, 1106.0, 1106.0, 0.9041591320072332, 0.2887305040687161, 0.5394933883363472], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1328.125, 848, 3204, 1118.5, 2220.0, 2988.5, 3204.0, 0.10717491392514726, 0.055471390996414106, 0.049296273885492535], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 246.66666666666666, 163, 487, 170.0, 487.0, 487.0, 487.0, 0.04520216669052337, 0.07005452982212948, 0.10166073231276886], "isController": false}, {"data": ["addBook", 55, 15, 27.272727272727273, 782.6181818181819, 413, 1748, 683.0, 1231.4, 1446.7999999999997, 1748.0, 0.2594890424854332, 80.06787352415607, 0.9419701042084404], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f5dc3256-7406-405b-b069-503f68017270", 1, 0, 0.0, 275.0, 275, 275, 275.0, 275.0, 275.0, 275.0, 3.6363636363636362, 1.1612215909090908, 2.169744318181818], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a4a98018-37fc-40eb-862d-3293fd64a014", 3, 0, 0.0, 324.0, 205, 543, 224.0, 543.0, 543.0, 543.0, 0.025949761262196388, 0.026025785953394227, 0.0166409601844163], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 141.63157894736847, 80, 400, 83.0, 325.2, 328.2, 400.0, 0.2533322074124115, 0.18826739242270035, 0.12246039323158564], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1fd6c62d-67e4-4a38-97ea-cf7e66d043e3", 1, 0, 0.0, 766.0, 766, 766, 766.0, 766.0, 766.0, 766.0, 1.3054830287206267, 0.2358538674934726, 0.9000693537859008], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 442.7543859649124, 385, 631, 402.0, 560.4, 614.5, 631.0, 0.25328717878075546, 74.47484048740007, 0.127385641671962], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 133.91228070175438, 79, 332, 83.0, 244.0, 280.4999999999998, 332.0, 0.25364447055054196, 0.4488318170288888, 0.12335443977946281], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 621.6491228070175, 550, 812, 561.0, 730.4000000000001, 800.5, 812.0, 0.25311171996074544, 227.75037054362403, 0.12705021880842107], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 98.17647058823528, 82, 324, 84.0, 135.99999999999983, 324.0, 324.0, 0.10177995174432876, 0.07603678035587061, 0.03617959222161687], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 167, 15, 8.982035928143713, 132.2395209580838, 81, 487, 85.0, 247.00000000000009, 304.5999999999999, 472.71999999999986, 0.6813184123241117, 1.5506997984093052, 0.323320264531053], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 109.5, 82, 245, 85.5, 245.0, 245.0, 245.0, 0.03890009968150543, 0.030124784226009577, 0.013827769808660134], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 105.57894736842107, 82, 253, 84.0, 242.0, 253.0, 253.0, 0.11725427515258484, 0.09515459243339648, 0.041680230620645395], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9cbb5d6a-5b01-48a8-ac6b-ec8f08bee4a5", 3, 0, 0.0, 312.6666666666667, 201, 511, 226.0, 511.0, 511.0, 511.0, 0.026405893795495156, 0.031210872516745737, 0.016933467049845524], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a4a98018-37fc-40eb-862d-3293fd64a014", 1, 0, 0.0, 671.0, 671, 671, 671.0, 671.0, 671.0, 671.0, 1.4903129657228018, 0.2692459947839046, 1.0275009314456036], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 225.625, 164, 484, 166.0, 484.0, 484.0, 484.0, 0.03980000497500062, 0.06168223427277929, 0.089511144001393], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 234.75, 161, 487, 166.0, 375.0000000000001, 487.0, 487.0, 0.09069163709741417, 0.14055432429062134, 0.2039676174173289], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=96677759-94d9-47e5-8620-cbe54a21daa6", 1, 0, 0.0, 1601.0, 1601, 1601, 1601.0, 1601.0, 1601.0, 1601.0, 0.6246096189881324, 0.11284451124297315, 0.43063905371642724], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a3e3d254-7ef4-4813-9e6d-8df76ed69b66", 3, 0, 0.0, 342.0, 193, 419, 414.0, 419.0, 419.0, 419.0, 0.03816162721178431, 0.031441106273771516, 0.024472137241931997], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 130.84615384615387, 82, 371, 84.0, 321.4, 371.0, 371.0, 0.06901494438988134, 0.05722039822950123, 0.024532656013590635], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3f9da0de-3a95-47fa-b7b1-3cddbc0b0130", 3, 0, 0.0, 428.0, 178, 880, 226.0, 880.0, 880.0, 880.0, 0.04353378221499884, 0.027988027302937077, 0.027917171537613184], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/83437841-810d-41f6-b146-901e665c5234", 3, 0, 0.0, 649.6666666666666, 266, 1230, 453.0, 1230.0, 1230.0, 1230.0, 0.06744301065599569, 0.030516205993435547, 0.04324958691155973], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 83.68421052631578, 80, 86, 84.0, 86.0, 86.0, 86.0, 0.09429701574760163, 0.07320910890560868, 0.03351964231653026], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 100.3529411764706, 80, 244, 82.0, 236.0, 244.0, 244.0, 0.09857472544039708, 0.0732571934181076, 0.049479891480824316], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 129.05882352941177, 79, 247, 82.0, 243.8, 247.0, 247.0, 0.09857644023078484, 0.026376899046127975, 0.056219376069119475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 147.2941176470588, 78, 246, 85.0, 242.8, 246.0, 246.0, 0.09857586862736002, 0.02656927709096813, 0.05795182901725658], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 100.52941176470588, 79, 243, 81.0, 240.6, 243.0, 243.0, 0.09857644023078484, 0.026569431155953727, 0.05804843111246412], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 22.5, 0.6854531607006854], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 10.0, 0.30464584920030463], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 4, 10.0, 0.30464584920030463], "isController": false}, {"data": ["401/Unauthorized", 23, 57.5, 1.7517136329017517], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1313, 40, "401/Unauthorized", 23, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 16, 8, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 167, 15, "401/Unauthorized", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
