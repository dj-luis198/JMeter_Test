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

    var data = {"OkPercent": 98.17351598173516, "KoPercent": 1.82648401826484};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7229862475442044, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0fec5c3d-2dfc-4887-96ee-022978d9d742"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e784ce75-c25e-4246-a15e-61ceb25fc9ee"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e1d7bbfb-ca10-4e73-91ea-8fc8276e2f28"], "isController": false}, {"data": [0.46153846153846156, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.46153846153846156, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/052c87f0-4aca-4bef-8e81-0d215e5cad54"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.1875, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/e58bdfa5-e879-4f98-897a-f338633f256f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9aef6900-5dff-4843-91d4-41927cecec7d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5555555555555556, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5d4e698f-5246-462d-ab0a-385c399ab18b"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=25da5331-16af-4494-a16d-f9d426e617ca"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9aef6900-5dff-4843-91d4-41927cecec7d"], "isController": false}, {"data": [0.6818181818181818, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=052c87f0-4aca-4bef-8e81-0d215e5cad54"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c4d71315-4ae8-4c26-a374-4a29605feea5"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0931aaed-bbed-4818-b381-e15f8b18fef5"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/6f9b8e27-d972-457f-8023-53e406c2f31e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=436cf13c-ce87-45eb-b8ff-eb3a932e2ea6"], "isController": false}, {"data": [0.4722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c64d3fd6-6ca2-4cd7-8a80-ee20bd0f4327"], "isController": false}, {"data": [0.8611111111111112, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.09090909090909091, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fce5092f-14f9-4258-9652-a5a6c3211d6a"], "isController": false}, {"data": [0.1956521739130435, 500, 1500, "register"], "isController": true}, {"data": [0.78125, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.65, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e784ce75-c25e-4246-a15e-61ceb25fc9ee"], "isController": false}, {"data": [0.18181818181818182, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.1956521739130435, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e1d7bbfb-ca10-4e73-91ea-8fc8276e2f28"], "isController": false}, {"data": [0.20454545454545456, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "addBook"], "isController": true}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9171428571428571, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/0931aaed-bbed-4818-b381-e15f8b18fef5"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/25da5331-16af-4494-a16d-f9d426e617ca"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e58bdfa5-e879-4f98-897a-f338633f256f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c4d71315-4ae8-4c26-a374-4a29605feea5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6f9b8e27-d972-457f-8023-53e406c2f31e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/436cf13c-ce87-45eb-b8ff-eb3a932e2ea6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fce5092f-14f9-4258-9652-a5a6c3211d6a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.925, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c64d3fd6-6ca2-4cd7-8a80-ee20bd0f4327"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1314, 24, 1.82648401826484, 503.2770167427688, 137, 4867, 159.0, 1423.5, 1717.75, 2309.3999999999996, 5.0923127005534115, 717.2898567205739, 3.732014682544296], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/0fec5c3d-2dfc-4887-96ee-022978d9d742", 1, 0, 0.0, 361.0, 361, 361, 361.0, 361.0, 361.0, 361.0, 2.770083102493075, 0.8845870844875346, 1.6528523199445984], "isController": false}, {"data": ["see books", 55, 0, 0.0, 2431.0727272727277, 1719, 3587, 2422.0, 2960.6, 3168.999999999999, 3587.0, 0.24567939285921678, 295.6348556172918, 1.208003655318512], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/e784ce75-c25e-4246-a15e-61ceb25fc9ee", 3, 0, 0.0, 437.66666666666663, 266, 772, 275.0, 772.0, 772.0, 772.0, 0.031076489599734816, 0.025907190711237257, 0.019928608239413274], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e1d7bbfb-ca10-4e73-91ea-8fc8276e2f28", 1, 0, 0.0, 489.0, 489, 489, 489.0, 489.0, 489.0, 489.0, 2.044989775051125, 0.36945616053169733, 1.409924591002045], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 1126.0, 148, 4833, 573.0, 3614.199999999999, 4833.0, 4833.0, 0.07257096603120551, 0.013748796298880733, 0.04905845277304826], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 1126.0, 148, 4833, 573.0, 3614.199999999999, 4833.0, 4833.0, 0.07094133697135062, 0.01344005798090041, 0.04795681275579809], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 193.38888888888886, 137, 430, 146.5, 415.6, 430.0, 430.0, 0.09866581887148229, 0.026400814815220847, 0.056270349825142243], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 150.00000000000003, 138, 200, 145.0, 182.00000000000003, 200.0, 200.0, 0.09866419640752698, 0.07332368502551566, 0.04952480171237194], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 161.55555555555557, 137, 433, 143.5, 211.60000000000036, 433.0, 433.0, 0.09866527804423494, 0.026593375722860198, 0.058100744785814125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 162.22222222222223, 139, 433, 144.0, 204.40000000000038, 433.0, 433.0, 0.09866473722291653, 0.02659322995461422, 0.05800407403144116], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 272.9285714285715, 142, 552, 265.0, 436.0, 552.0, 552.0, 0.07159221076746851, 0.14555651278176648, 0.046273257880256914], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/052c87f0-4aca-4bef-8e81-0d215e5cad54", 3, 0, 0.0, 361.0, 248, 530, 305.0, 530.0, 530.0, 530.0, 0.027969680865941322, 0.028051623290353257, 0.017936286232390755], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 163.6875, 140, 430, 145.5, 234.0000000000002, 430.0, 430.0, 0.08377709010749648, 0.06226012262871564, 0.042052172182864445], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 231.9375, 140, 431, 148.0, 428.9, 431.0, 431.0, 0.0836557565617484, 0.022384450486249086, 0.04770992366412214], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 1095.1250000000002, 712, 1225, 1131.5, 1225.0, 1225.0, 1225.0, 0.06625642894412098, 19.481590030063856, 0.037786869632194], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 1563.5, 1238, 1848, 1579.0, 1848.0, 1848.0, 1848.0, 0.06619776582540339, 59.564866052958216, 0.037688767066611506], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e58bdfa5-e879-4f98-897a-f338633f256f", 3, 0, 0.0, 1403.6666666666667, 225, 2985, 1001.0, 2985.0, 2985.0, 2985.0, 0.023983115886415964, 0.02405337892123945, 0.01537979762247378], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 213.62500000000003, 139, 427, 146.5, 427.0, 427.0, 427.0, 0.06664889362836576, 0.11793730005331912, 0.03690422137430019], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 164.50000000000003, 139, 431, 145.0, 290.0, 431.0, 431.0, 0.0781921964187974, 0.05810963034639143, 0.039248817343029166], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 229.64285714285717, 139, 446, 148.0, 443.5, 446.0, 446.0, 0.07806880091898132, 0.020889503370899298, 0.044523613024106526], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9aef6900-5dff-4843-91d4-41927cecec7d", 3, 0, 0.0, 487.33333333333337, 274, 888, 300.0, 888.0, 888.0, 888.0, 0.02313868556840181, 0.027349143000933263, 0.014838284690674339], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 203.50000000000003, 138, 443, 143.0, 436.5, 443.0, 443.0, 0.07806227138906235, 0.021040221585333214, 0.04589207751583549], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 225.85714285714286, 139, 439, 145.5, 435.0, 439.0, 439.0, 0.0781913229971851, 0.02107500502658505, 0.046044304460256466], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 177.625, 139, 415, 144.5, 415.0, 415.0, 415.0, 0.06680361407552149, 0.04964604522604673, 0.03751179501311021], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 954.7222222222222, 138, 1976, 1280.0, 1872.5000000000002, 1976.0, 1976.0, 0.08121204464857744, 40.606806598591426, 0.043866488526542805], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 213.31250000000003, 139, 447, 144.5, 431.6, 447.0, 447.0, 0.08365313228697208, 0.022547133311722943, 0.04917889222339569], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 660.3888888888889, 140, 1252, 843.0, 1246.6, 1252.0, 1252.0, 0.08121314389615546, 13.276040233217078, 0.04394639199328638], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 162.18749999999997, 138, 420, 144.0, 237.30000000000018, 420.0, 420.0, 0.08377577414051292, 0.022580189123810122, 0.04933280449875908], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 581.9999999999999, 159, 1605, 489.0, 1262.1999999999998, 1605.0, 1605.0, 0.07093011201501535, 0.013437931377844707, 0.04851402267853928], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/5d4e698f-5246-462d-ab0a-385c399ab18b", 1, 0, 0.0, 305.0, 305, 305, 305.0, 305.0, 305.0, 305.0, 3.278688524590164, 1.0470030737704918, 1.9563268442622952], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 436.6428571428571, 285, 873, 300.0, 734.0, 873.0, 873.0, 0.0779987743049752, 0.12088286603710513, 0.175421071508162], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=25da5331-16af-4494-a16d-f9d426e617ca", 1, 0, 0.0, 294.0, 294, 294, 294.0, 294.0, 294.0, 294.0, 3.401360544217687, 0.6145036139455783, 2.345078656462585], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9aef6900-5dff-4843-91d4-41927cecec7d", 1, 0, 0.0, 1605.0, 1605, 1605, 1605.0, 1605.0, 1605.0, 1605.0, 0.6230529595015577, 0.11256327881619937, 0.42956580996884736], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 679.2727272727274, 155, 1279, 637.0, 1250.8999999999999, 1278.7, 1279.0, 0.09885596685629039, 0.06072304995371743, 0.04469757095162349], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 145.44444444444446, 138, 155, 145.0, 151.4, 155.0, 155.0, 0.08120947985328154, 0.060351966961276614, 0.04076335219197921], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 278.61111111111103, 138, 562, 147.5, 456.70000000000016, 562.0, 562.0, 0.08121241106113039, 0.08949579500182728, 0.04252724563596086], "isController": false}, {"data": ["login", 22, 0, 0.0, 3671.499999999999, 1960, 7120, 3453.0, 5734.799999999999, 6942.099999999998, 7120.0, 0.09846616568275098, 42.96773596633352, 0.20793809331459492], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=052c87f0-4aca-4bef-8e81-0d215e5cad54", 1, 0, 0.0, 560.0, 560, 560, 560.0, 560.0, 560.0, 560.0, 1.7857142857142856, 0.32261439732142855, 1.231166294642857], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 151.06250000000003, 141, 177, 149.0, 163.0, 177.0, 177.0, 0.08195335829496038, 0.06634700588527555, 0.029131857831411697], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c4d71315-4ae8-4c26-a374-4a29605feea5", 3, 0, 0.0, 761.0, 264, 1143, 876.0, 1143.0, 1143.0, 1143.0, 0.03775341983061299, 0.03147347271686194, 0.02421036362835534], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0931aaed-bbed-4818-b381-e15f8b18fef5", 1, 0, 0.0, 705.0, 705, 705, 705.0, 705.0, 705.0, 705.0, 1.4184397163120568, 0.2562610815602837, 0.9779476950354611], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6f9b8e27-d972-457f-8023-53e406c2f31e", 3, 0, 0.0, 990.3333333333334, 320, 2066, 585.0, 2066.0, 2066.0, 2066.0, 0.02146936321868693, 0.02537606049708732, 0.013767788261983481], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=436cf13c-ce87-45eb-b8ff-eb3a932e2ea6", 1, 0, 0.0, 448.0, 448, 448, 448.0, 448.0, 448.0, 448.0, 2.232142857142857, 0.4032679966517857, 1.5389578683035714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 1118.611111111111, 287, 2123, 1426.0, 2015.0000000000002, 2123.0, 2123.0, 0.08115638836037044, 53.99548680306951, 0.17098671796802437], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c64d3fd6-6ca2-4cd7-8a80-ee20bd0f4327", 1, 0, 0.0, 748.0, 748, 748, 748.0, 748.0, 748.0, 748.0, 1.3368983957219251, 0.2415294953208556, 0.9217287767379679], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 377.44444444444446, 283, 613, 300.0, 586.0, 613.0, 613.0, 0.09858584088245281, 0.1527887983207545, 0.22172186675028208], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 3, 27.272727272727273, 1305.9090909090908, 142, 2151, 1562.0, 2119.0, 2151.0, 2151.0, 0.07766496745131819, 67.57970532764027, 0.1412779814521937], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fce5092f-14f9-4258-9652-a5a6c3211d6a", 1, 0, 0.0, 479.0, 479, 479, 479.0, 479.0, 479.0, 479.0, 2.08768267223382, 0.37716923277661796, 1.4393593423799582], "isController": false}, {"data": ["register", 23, 9, 39.130434782608695, 1171.0434782608695, 211, 2378, 1204.0, 1950.4, 2293.5999999999985, 2378.0, 0.08973123544305772, 0.02785813491676452, 0.040484209740910805], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 434.50000000000006, 288, 856, 299.5, 671.2000000000002, 856.0, 856.0, 0.0835906357590291, 0.12954915913044843, 0.18799729897758205], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 12, 0, 0.0, 149.91666666666669, 143, 172, 148.0, 167.50000000000003, 172.0, 172.0, 0.15823410736184185, 0.12284776889908619, 0.05624728035127972], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 20, 0, 0.0, 626.3, 284, 1853, 565.0, 1744.8000000000009, 1849.7, 1853.0, 0.11383168846543501, 20.577295407104803, 0.2516413995890676], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 172.90909090909093, 138, 445, 145.0, 387.0000000000002, 445.0, 445.0, 0.06022711096023916, 0.04475862445384961, 0.030231186556213797], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 195.8181818181818, 138, 431, 144.0, 430.6, 431.0, 431.0, 0.060133277208941266, 0.01609034956567374, 0.03429475965822432], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 245.8181818181818, 139, 430, 145.0, 429.6, 430.0, 430.0, 0.060133605939013596, 0.016207885975749757, 0.035351983178990416], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 170.0, 138, 424, 145.0, 368.6000000000002, 424.0, 424.0, 0.0602267812070542, 0.016232999622213827, 0.035465575261575864], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 159.0, 159, 159, 159.0, 159.0, 159.0, 159.0, 6.289308176100629, 1.8548545597484276, 3.88782429245283], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e784ce75-c25e-4246-a15e-61ceb25fc9ee", 1, 0, 0.0, 482.0, 482, 482, 482.0, 482.0, 482.0, 482.0, 2.074688796680498, 0.3748217064315353, 1.4304006742738589], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1690.7272727272725, 1102, 2989, 1564.0, 2286.2, 2573.5999999999995, 2989.0, 0.25375324112094344, 303.57709528088174, 0.5010635288540504], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 9, 39.130434782608695, 1171.0434782608695, 211, 2378, 1204.0, 1950.4, 2293.5999999999985, 2378.0, 0.08961271721343411, 0.02782133951531208, 0.04043073764902984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 142.16666666666669, 139, 145, 142.5, 145.0, 145.0, 145.0, 0.03256462721642994, 0.008777184679428382, 0.019176240440925054], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 141.83333333333334, 138, 150, 139.5, 150.0, 150.0, 150.0, 0.03256462721642994, 0.008777184679428382, 0.01914443904715901], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 12, 0, 0.0, 316.5, 141, 1648, 144.5, 1282.0000000000014, 1648.0, 1648.0, 0.1480585818455502, 11.138528563739218, 0.08598193685301483], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 12, 0, 0.0, 293.5, 139, 1117, 147.5, 910.0000000000007, 1117.0, 1117.0, 0.1485865702504922, 3.6774934296875967, 0.08643365919193671], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 140.16666666666666, 138, 142, 140.0, 142.0, 142.0, 142.0, 0.03256445047489824, 0.00871353459972863, 0.0185719131614654], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 12, 0, 0.0, 145.75, 141, 149, 145.0, 149.0, 149.0, 149.0, 0.1485663348685188, 0.11040916097162383, 0.07457333605704947], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 142.16666666666669, 140, 145, 142.0, 145.0, 145.0, 145.0, 0.03256339006599514, 0.02419994125021709, 0.016345295404220216], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 12, 0, 0.0, 169.75, 138, 412, 146.0, 340.0000000000002, 412.0, 412.0, 0.14857369255150554, 0.0583509635623019, 0.08369361164074882], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 170.83333333333331, 147, 258, 153.0, 258.0, 258.0, 258.0, 0.032955625250600064, 0.02593968159373404, 0.011714694913299243], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 814.0769230769231, 143, 2066, 790.0, 1657.9999999999995, 2066.0, 2066.0, 0.07121024551101568, 0.013341222378641309, 0.04846490567381326], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/e1d7bbfb-ca10-4e73-91ea-8fc8276e2f28", 3, 0, 0.0, 422.3333333333333, 242, 552, 473.0, 552.0, 552.0, 552.0, 0.02155621501605938, 0.025478716381286334, 0.013823484238814122], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1964.9090909090912, 1071, 4867, 1621.5, 4457.9, 4848.7, 4867.0, 0.09803266270079986, 0.05073956174943743, 0.045091195441481186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 286.6666666666667, 281, 295, 285.5, 295.0, 295.0, 295.0, 0.032538666782359706, 0.05042857830430161, 0.0731802242185297], "isController": false}, {"data": ["addBook", 60, 10, 16.666666666666668, 1408.633333333333, 728, 4429, 1147.0, 2538.5, 2927.399999999999, 4429.0, 0.28757255215847166, 81.40559715788451, 1.0469999892160293], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 242.89090909090902, 138, 602, 147.0, 583.0, 594.8, 602.0, 0.2550925754146414, 0.1895756346587325, 0.12331135237328855], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 938.2545454545455, 681, 1375, 859.0, 1218.9999999999998, 1293.6, 1375.0, 0.2549991422756124, 74.97821459742589, 0.12824663893744176], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 200.6909090909091, 138, 454, 147.0, 432.0, 437.59999999999997, 454.0, 0.25565461526304534, 0.45238883091468574, 0.12433202968847323], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1437.745454545455, 952, 2370, 1417.0, 1810.3999999999999, 1989.3999999999992, 2370.0, 0.25448000481198557, 228.98155565795804, 0.1277370336653912], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 20, 0, 0.0, 166.70000000000002, 142, 439, 152.5, 161.9, 425.1499999999998, 439.0, 0.11136105481191118, 0.08319453801866411, 0.03958537495267155], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 10, 5.714285714285714, 235.17142857142855, 140, 2310, 153.0, 432.40000000000003, 498.59999999999985, 1556.080000000009, 0.73308562021138, 1.5626341808501278, 0.353329269071746], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 178.45454545454547, 147, 435, 151.0, 382.8000000000002, 435.0, 435.0, 0.06161809107153861, 0.04771791623020519, 0.02190330581058599], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 188.05555555555557, 140, 440, 153.0, 429.20000000000005, 440.0, 440.0, 0.10158930828968755, 0.08244210467649449, 0.03611182443109987], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0931aaed-bbed-4818-b381-e15f8b18fef5", 3, 0, 0.0, 669.6666666666666, 320, 1046, 643.0, 1046.0, 1046.0, 1046.0, 0.08113809704116406, 0.03592051171093201, 0.052031917698923576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 422.27272727272725, 289, 877, 300.0, 817.2000000000003, 877.0, 877.0, 0.06008499295366901, 0.0931200037280007, 0.13513255739482394], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/25da5331-16af-4494-a16d-f9d426e617ca", 3, 0, 0.0, 537.6666666666666, 256, 990, 367.0, 990.0, 990.0, 990.0, 0.06610259122157588, 0.029909701106116692, 0.042390008042481934], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 12, 0, 0.0, 534.0833333333333, 288, 1798, 437.5, 1432.0000000000014, 1798.0, 1798.0, 0.14778507124471976, 14.943478464174436, 0.32922107261173167], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e58bdfa5-e879-4f98-897a-f338633f256f", 1, 0, 0.0, 571.0, 571, 571, 571.0, 571.0, 571.0, 571.0, 1.7513134851138354, 0.3163994089316988, 1.207448555166375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c4d71315-4ae8-4c26-a374-4a29605feea5", 1, 0, 0.0, 539.0, 539, 539, 539.0, 539.0, 539.0, 539.0, 1.8552875695732838, 0.3351837894248608, 1.2791338126159555], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6f9b8e27-d972-457f-8023-53e406c2f31e", 1, 0, 0.0, 487.0, 487, 487, 487.0, 487.0, 487.0, 487.0, 2.053388090349076, 0.37097343429158114, 1.4157148357289528], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 150.78571428571428, 142, 163, 150.0, 159.5, 163.0, 163.0, 0.08051715015298258, 0.06675689499988498, 0.028621330718443028], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 153.0, 146, 168, 150.5, 161.70000000000002, 168.0, 168.0, 0.08035319694122164, 0.06238358551588984, 0.02856305047519988], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/436cf13c-ce87-45eb-b8ff-eb3a932e2ea6", 3, 0, 0.0, 537.6666666666666, 241, 790, 582.0, 790.0, 790.0, 790.0, 0.02057091135994295, 0.024314120816390904, 0.013191632610380083], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 20, 0, 0.0, 144.1, 137, 168, 142.5, 151.0, 167.14999999999998, 168.0, 0.1139263580021874, 0.08466597503873496, 0.057185691419066716], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fce5092f-14f9-4258-9652-a5a6c3211d6a", 3, 0, 0.0, 349.0, 240, 513, 294.0, 513.0, 513.0, 513.0, 0.023792906541463106, 0.028068194435632257, 0.0152578209266544], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 20, 0, 0.0, 258.4, 138, 443, 150.0, 442.9, 443.0, 443.0, 0.1139263580021874, 0.056151008675492164, 0.0635384209521965], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 20, 0, 0.0, 408.1499999999999, 138, 1708, 146.0, 1604.1000000000008, 1704.8999999999999, 1708.0, 0.1139237622183235, 15.40242033702921, 0.065506163275536], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 20, 0, 0.0, 368.0000000000001, 138, 1280, 146.5, 1117.4, 1271.8999999999999, 1280.0, 0.1139250600954692, 5.050762959687617, 0.06561816449639427], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c64d3fd6-6ca2-4cd7-8a80-ee20bd0f4327", 3, 0, 0.0, 367.3333333333333, 271, 495, 336.0, 495.0, 495.0, 495.0, 0.03692262249080011, 0.030780871158508815, 0.023677593198852934], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 37.5, 0.684931506849315], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 8.333333333333334, 0.15220700152207], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.166666666666667, 0.076103500761035], "isController": false}, {"data": ["401/Unauthorized", 12, 50.0, 0.91324200913242], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1314, 24, "401/Unauthorized", 12, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 3, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
