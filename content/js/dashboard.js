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

    var data = {"OkPercent": 99.09228441754917, "KoPercent": 0.9077155824508321};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8324641460234681, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.41228070175438597, 500, 1500, "see books"], "isController": true}, {"data": [0.6538461538461539, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6538461538461539, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4cd46190-681a-466f-ba2a-63ed2bf5ba32"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/75a0d19f-7633-41e6-b380-7b6d8f21e2b6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/669c4439-5621-4991-ae60-f74dd608323d"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=92c2e2af-5784-497a-b8f6-bbfce7a25c31"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=76e32596-6f93-4c05-a4d3-3e57bc1933e8"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0de3a2c8-0741-489c-b616-f6e2552e9be1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8260229f-e49a-4fec-bb1c-c2a00464dfb9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8254214a-37e6-45c5-ae46-3d58eb6d379a"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b88d864b-24aa-4f33-aff6-313db3743b10"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7a9720a1-39d2-46a1-a6d1-8cd459a5a0f3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f22fde22-5ced-4fe5-9a97-7b73a5198aec"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.05, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0de3a2c8-0741-489c-b616-f6e2552e9be1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/00c7da72-542e-4521-9fcb-342318dbfb80"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=669c4439-5621-4991-ae60-f74dd608323d"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f7b17a7a-4c8b-4336-871d-7e4be2d8aa52"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/37e5b67a-a5e6-4a32-b4a7-d1406388ea99"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c7f33692-446c-468f-95fe-ddb0ed8544a8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.3409090909090909, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ae5d8f34-351a-460a-b159-db16acc38092"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8260229f-e49a-4fec-bb1c-c2a00464dfb9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3409090909090909, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/92c2e2af-5784-497a-b8f6-bbfce7a25c31"], "isController": false}, {"data": [0.4426229508196721, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8596491228070176, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/76e32596-6f93-4c05-a4d3-3e57bc1933e8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9692737430167597, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f22fde22-5ced-4fe5-9a97-7b73a5198aec"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=00c7da72-542e-4521-9fcb-342318dbfb80"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4cd46190-681a-466f-ba2a-63ed2bf5ba32"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=37e5b67a-a5e6-4a32-b4a7-d1406388ea99"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ae5d8f34-351a-460a-b159-db16acc38092"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b88d864b-24aa-4f33-aff6-313db3743b10"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f7b17a7a-4c8b-4336-871d-7e4be2d8aa52"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1322, 12, 0.9077155824508321, 291.5892586989411, 77, 2377, 95.5, 788.0, 947.8499999999999, 1399.85, 5.232286612153786, 732.5940533635351, 3.8262811953321036], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1304.5263157894735, 948, 1686, 1276.0, 1560.6000000000001, 1663.6, 1686.0, 0.2554129624318899, 307.34820047285007, 1.2558635408638334], "isController": true}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 631.6923076923077, 89, 1657, 452.0, 1612.6, 1657.0, 1657.0, 0.07333901240557603, 0.013894305084650145, 0.049577657199352365], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 631.6923076923077, 89, 1657, 452.0, 1612.6, 1657.0, 1657.0, 0.07145251980059251, 0.013536903165346628, 0.048302375727579026], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 113.88888888888889, 78, 238, 80.0, 235.3, 238.0, 238.0, 0.11299009453504577, 0.03023367763926029, 0.06443966328951828], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4cd46190-681a-466f-ba2a-63ed2bf5ba32", 1, 0, 0.0, 394.0, 394, 394, 394.0, 394.0, 394.0, 394.0, 2.5380710659898473, 0.45853822969543145, 1.7498810279187818], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/75a0d19f-7633-41e6-b380-7b6d8f21e2b6", 1, 0, 0.0, 195.0, 195, 195, 195.0, 195.0, 195.0, 195.0, 5.128205128205129, 1.6376201923076923, 3.059895833333333], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 89.61111111111111, 78, 238, 80.5, 105.70000000000022, 238.0, 238.0, 0.11298867602380294, 0.08396912349034574, 0.05671501901976047], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 105.72222222222221, 79, 239, 79.5, 235.4, 239.0, 239.0, 0.11298867602380294, 0.03045397908454064, 0.06653532386948553], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 114.16666666666666, 78, 236, 80.0, 235.1, 236.0, 236.0, 0.11298938527497222, 0.03045417024989486, 0.06642540032766922], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/669c4439-5621-4991-ae60-f74dd608323d", 3, 0, 0.0, 321.0, 165, 510, 288.0, 510.0, 510.0, 510.0, 0.030205092578608754, 0.030293584060772646, 0.01936980220698543], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 229.69230769230774, 78, 344, 206.0, 343.6, 344.0, 344.0, 0.07365146991337454, 0.17830826114545031, 0.0476089917821956], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 21, 0, 0.0, 95.28571428571428, 78, 237, 80.0, 204.6000000000001, 236.7, 237.0, 0.10563964806905815, 0.07850759002007154, 0.053026151472163954], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 21, 0, 0.0, 102.2857142857143, 78, 241, 80.0, 237.0, 240.7, 241.0, 0.10564283666108269, 0.04337919678745165, 0.059404444796587234], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 598.25, 430, 708, 627.5, 708.0, 708.0, 708.0, 0.045096845475658974, 13.259969926041174, 0.025719294685336763], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 792.5, 692, 929, 774.5, 929.0, 929.0, 929.0, 0.044980714518650135, 40.473725991543624, 0.02560913726989553], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=92c2e2af-5784-497a-b8f6-bbfce7a25c31", 1, 0, 0.0, 1259.0, 1259, 1259, 1259.0, 1259.0, 1259.0, 1259.0, 0.7942811755361397, 0.14349806393963463, 0.5476196386020652], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 79.5, 78, 81, 79.5, 81.0, 81.0, 81.0, 0.04537565369301102, 0.08029363719896089, 0.025124995746032466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 115.69230769230771, 80, 374, 81.0, 319.19999999999993, 374.0, 374.0, 0.05905011083251572, 0.04388392025736764, 0.029640387663977617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 116.23076923076923, 79, 238, 80.0, 237.2, 238.0, 238.0, 0.05905198846214995, 0.036268709259806034, 0.03253360001362738], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=76e32596-6f93-4c05-a4d3-3e57bc1933e8", 1, 0, 0.0, 440.0, 440, 440, 440.0, 440.0, 440.0, 440.0, 2.2727272727272725, 0.41060014204545453, 1.5669389204545454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 269.0769230769231, 78, 861, 80.0, 823.4, 861.0, 861.0, 0.05905252494969179, 12.274297097511617, 0.03354531202445683], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 216.84615384615384, 78, 624, 81.0, 623.6, 624.0, 624.0, 0.05905198846214995, 4.019146116763951, 0.033602675225419605], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0de3a2c8-0741-489c-b616-f6e2552e9be1", 1, 0, 0.0, 413.0, 413, 413, 413.0, 413.0, 413.0, 413.0, 2.4213075060532687, 0.4374432506053269, 1.6693780266343827], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8260229f-e49a-4fec-bb1c-c2a00464dfb9", 3, 0, 0.0, 297.6666666666667, 174, 376, 343.0, 376.0, 376.0, 376.0, 0.03234152652005175, 0.03243627708602846, 0.020739846108236308], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 79.0, 79, 79, 79.0, 79.0, 79.0, 79.0, 0.04537668319134213, 0.033722320223253284, 0.025480071127950903], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 580.2499999999999, 78, 1013, 807.0, 960.5, 1013.0, 1013.0, 0.07651182585908434, 43.036155498928835, 0.0408710632274601], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 21, 0, 0.0, 172.6190476190476, 78, 928, 80.0, 738.0000000000005, 921.4999999999999, 928.0, 0.10564230521571152, 9.078822286376168, 0.06124148887737444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 446.75000000000006, 79, 779, 618.0, 723.7, 779.0, 779.0, 0.07645807946861634, 14.058486697488831, 0.04091701909062672], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 21, 0, 0.0, 161.33333333333331, 78, 705, 80.0, 560.0000000000002, 696.5999999999999, 705.0, 0.10564230521571152, 2.984080710721185, 0.06134465519106166], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 477.99999999999994, 97, 1259, 440.0, 1024.1999999999998, 1259.0, 1259.0, 0.07144623670687808, 0.01353571281360776, 0.04886703614904784], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 398.30769230769226, 160, 1236, 169.0, 1080.3999999999999, 1236.0, 1236.0, 0.05902866068509571, 16.3670175797568, 0.12927152531194377], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8254214a-37e6-45c5-ae46-3d58eb6d379a", 1, 0, 0.0, 173.0, 173, 173, 173.0, 173.0, 173.0, 173.0, 5.780346820809248, 1.8458724710982661, 3.449015534682081], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b88d864b-24aa-4f33-aff6-313db3743b10", 3, 0, 0.0, 468.6666666666667, 176, 806, 424.0, 806.0, 806.0, 806.0, 0.09194275031413773, 0.041601700174691225, 0.05896068298139692], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7a9720a1-39d2-46a1-a6d1-8cd459a5a0f3", 1, 0, 0.0, 266.0, 266, 266, 266.0, 266.0, 266.0, 266.0, 3.7593984962406015, 1.2005110432330826, 2.2431567199248117], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f22fde22-5ced-4fe5-9a97-7b73a5198aec", 1, 0, 0.0, 369.0, 369, 369, 369.0, 369.0, 369.0, 369.0, 2.710027100271003, 0.4896045054200542, 1.8684366531165313], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 541.45, 85, 1270, 503.0, 943.1000000000001, 1253.85, 1270.0, 0.087382416036421, 0.05367533172549688, 0.0395098228758427], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 80.37500000000001, 79, 85, 80.0, 82.9, 85.0, 85.0, 0.07651109410864575, 0.05686029552410099, 0.03840498278500382], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 119.875, 77, 239, 80.0, 238.3, 239.0, 239.0, 0.07651109410864575, 0.09229524316182096, 0.03961914809678653], "isController": false}, {"data": ["login", 20, 0, 0.0, 2283.4000000000005, 1182, 3965, 2154.0, 3194.0, 3926.8999999999996, 3965.0, 0.08919651776794633, 21.465751742676968, 0.1641599193217497], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/0de3a2c8-0741-489c-b616-f6e2552e9be1", 3, 0, 0.0, 291.0, 174, 493, 206.0, 493.0, 493.0, 493.0, 0.020473762872878404, 0.024199294593561686, 0.013129333613141426], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/00c7da72-542e-4521-9fcb-342318dbfb80", 3, 0, 0.0, 359.0, 287, 495, 295.0, 495.0, 495.0, 495.0, 0.02207473032037792, 0.026091583917087314, 0.014155995680711101], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 21, 0, 0.0, 102.52380952380952, 79, 292, 84.0, 213.8000000000001, 286.69999999999993, 292.0, 0.11184133442689305, 0.09054342406239682, 0.03975609934705964], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=669c4439-5621-4991-ae60-f74dd608323d", 1, 0, 0.0, 495.0, 495, 495, 495.0, 495.0, 495.0, 495.0, 2.0202020202020203, 0.36497790404040403, 1.392834595959596], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 671.5625, 159, 1094, 888.0, 1041.5, 1094.0, 1094.0, 0.07642630593450266, 57.189687180561926, 0.15966306149451642], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f7b17a7a-4c8b-4336-871d-7e4be2d8aa52", 3, 0, 0.0, 250.33333333333331, 181, 382, 188.0, 382.0, 382.0, 382.0, 0.017438514703574316, 0.020611734013241647, 0.011182901681654102], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/37e5b67a-a5e6-4a32-b4a7-d1406388ea99", 3, 0, 0.0, 298.6666666666667, 186, 366, 344.0, 366.0, 366.0, 366.0, 0.06450780544445878, 0.029188102072850816, 0.04136731013202598], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c7f33692-446c-468f-95fe-ddb0ed8544a8", 1, 0, 0.0, 324.0, 324, 324, 324.0, 324.0, 324.0, 324.0, 3.0864197530864197, 0.9856047453703703, 1.841603973765432], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 230.83333333333334, 158, 471, 163.5, 336.0000000000002, 471.0, 471.0, 0.11293125623474644, 0.1750213902778736, 0.2539850420982627], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, 33.333333333333336, 609.8333333333333, 78, 1008, 780.0, 1008.0, 1008.0, 1008.0, 0.06741042839327244, 53.77021786207826, 0.11622374153156492], "isController": false}, {"data": ["register", 22, 5, 22.727272727272727, 1000.272727272727, 94, 2377, 845.5, 1614.1, 2273.9499999999985, 2377.0, 0.08858608554194551, 0.028013462065022185, 0.03996755031286995], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ae5d8f34-351a-460a-b159-db16acc38092", 1, 0, 0.0, 672.0, 672, 672, 672.0, 672.0, 672.0, 672.0, 1.488095238095238, 0.26884533110119047, 1.025971912202381], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 21, 0, 0.0, 303.0952380952381, 160, 1166, 167.0, 957.8000000000005, 1159.1999999999998, 1166.0, 0.10559715189396034, 12.179583552803605, 0.2349173246584435], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 86.85714285714285, 81, 114, 83.0, 107.0, 114.0, 114.0, 0.0926489663022474, 0.07192961739285808, 0.032933812240252006], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8260229f-e49a-4fec-bb1c-c2a00464dfb9", 1, 0, 0.0, 561.0, 561, 561, 561.0, 561.0, 561.0, 561.0, 1.7825311942959001, 0.32203932709447414, 1.2289717023172904], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 259.18750000000006, 161, 478, 312.5, 369.5000000000001, 478.0, 478.0, 0.12309964916599987, 0.19078041330707207, 0.27685399612236106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 122.63636363636364, 79, 236, 81.0, 235.6, 236.0, 236.0, 0.055538725638695344, 0.04127438497172574, 0.02787783689286075], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 122.36363636363637, 78, 237, 80.0, 236.6, 237.0, 237.0, 0.0554952955124486, 0.014849327119541912, 0.03164966072194334], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 138.81818181818184, 78, 238, 82.0, 237.2, 238.0, 238.0, 0.055539566892359275, 0.014969648888956211, 0.0326511906925784], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 96.18181818181817, 78, 234, 80.0, 208.60000000000008, 234.0, 234.0, 0.055539566892359275, 0.014969648888956211, 0.03270542855087172], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 97.0, 97, 97, 97.0, 97.0, 97.0, 97.0, 10.309278350515465, 3.040431701030928, 6.372825386597938], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 887.7719298245614, 616, 1341, 853.0, 1214.4, 1323.1, 1341.0, 0.2545733885951122, 304.55827678938294, 0.5026829997454266], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, 22.727272727272727, 1000.272727272727, 94, 2377, 845.5, 1614.1, 2273.9499999999985, 2377.0, 0.08841235522476833, 0.02795852355385518, 0.03988916807992477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 114.77777777777777, 78, 237, 80.0, 237.0, 237.0, 237.0, 0.0505905036003575, 0.013635721673533859, 0.029791087569351147], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 113.77777777777777, 78, 234, 80.0, 234.0, 234.0, 234.0, 0.05059078797962877, 0.01363579832263432, 0.02974184996458645], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 183.2857142857143, 77, 768, 79.0, 502.5, 768.0, 768.0, 0.09270909211310509, 5.98176057256142, 0.053933721276736644], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 195.78571428571428, 78, 617, 157.0, 466.5, 617.0, 617.0, 0.09270909211310509, 1.9703139485795644, 0.05402425749950335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 106.11111111111111, 78, 314, 80.0, 314.0, 314.0, 314.0, 0.05059078797962877, 0.013536988189861607, 0.028852558769632036], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 102.71428571428572, 79, 234, 80.0, 233.0, 234.0, 234.0, 0.09261403102570039, 0.06882741954156055, 0.04648790229219727], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 115.66666666666669, 78, 242, 80.0, 242.0, 242.0, 242.0, 0.050590219224283306, 0.037596832841483976, 0.02539391863406408], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 112.35714285714286, 78, 235, 80.0, 233.5, 235.0, 235.0, 0.09270847819033051, 0.03475274566091212, 0.05231665656806458], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 83.77777777777777, 80, 95, 82.0, 95.0, 95.0, 95.0, 0.051616159298937855, 0.04062756288568741, 0.018347931625794314], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 431.23076923076917, 78, 568, 466.0, 551.1999999999999, 568.0, 568.0, 0.07047521982847416, 0.013203515493706021, 0.04796465532196333], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1309.55, 850, 1804, 1337.0, 1762.6000000000001, 1802.35, 1804.0, 0.08905829756158382, 0.04609462666761662, 0.04096333803858005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 257.3333333333333, 160, 477, 162.0, 477.0, 477.0, 477.0, 0.05056747949207776, 0.07836971675188224, 0.11372744655298349], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/92c2e2af-5784-497a-b8f6-bbfce7a25c31", 3, 0, 0.0, 296.3333333333333, 187, 419, 283.0, 419.0, 419.0, 419.0, 0.023926688626049783, 0.023996786346633915, 0.015343612172304061], "isController": false}, {"data": ["addBook", 61, 3, 4.918032786885246, 905.6721311475407, 500, 2103, 707.0, 1480.6000000000004, 1716.0999999999997, 2103.0, 0.2893504793256711, 91.89305494368338, 1.0528514511400884], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 144.8245614035087, 78, 328, 81.0, 320.0, 322.1, 328.0, 0.2556168438046549, 0.1899652520852953, 0.12356478289385174], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 496.63157894736855, 386, 712, 466.0, 628.6, 641.9999999999995, 712.0, 0.2554850854978597, 75.1210980396002, 0.12849103421034938], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/76e32596-6f93-4c05-a4d3-3e57bc1933e8", 3, 0, 0.0, 314.6666666666667, 183, 503, 258.0, 503.0, 503.0, 503.0, 0.01812601203567199, 0.021742953890446382, 0.011623777249438094], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 121.36842105263159, 78, 322, 82.0, 237.0, 239.5999999999999, 322.0, 0.2559290223511346, 0.4528744028322812, 0.1244654815731104], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 740.0175438596492, 537, 1014, 765.0, 932.2, 998.3, 1014.0, 0.2549753747467021, 229.42729039598348, 0.1279856861521532], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 94.37500000000003, 81, 237, 83.5, 139.0000000000001, 237.0, 237.0, 0.11913803630731656, 0.08900449001474334, 0.042349848843616436], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 3, 1.675977653631285, 154.5642458100558, 80, 1617, 85.0, 272.0, 321.0, 1304.9999999999955, 0.7383300541579532, 1.560017094506247, 0.35653701162972956], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 84.54545454545455, 80, 93, 84.0, 91.80000000000001, 93.0, 93.0, 0.055675905492681144, 0.04311620415595327, 0.0197910445306015], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f22fde22-5ced-4fe5-9a97-7b73a5198aec", 3, 0, 0.0, 629.3333333333334, 172, 1190, 526.0, 1190.0, 1190.0, 1190.0, 0.020704648193519446, 0.024472193226129264, 0.01327739483764105], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 84.05555555555554, 81, 95, 83.0, 87.80000000000001, 95.0, 95.0, 0.11314208131144243, 0.09181745075176627, 0.0402184742161768], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 276.81818181818187, 161, 475, 192.0, 473.8, 475.0, 475.0, 0.05547234703500305, 0.08597130346147445, 0.12475860861485549], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 332.0714285714286, 159, 1001, 313.0, 776.0, 1001.0, 1001.0, 0.0925644314560385, 8.043155635107706, 0.2064878988535234], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=00c7da72-542e-4521-9fcb-342318dbfb80", 1, 0, 0.0, 451.0, 451, 451, 451.0, 451.0, 451.0, 451.0, 2.2172949002217295, 0.4005855044345898, 1.5287208980044344], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4cd46190-681a-466f-ba2a-63ed2bf5ba32", 3, 0, 0.0, 354.6666666666667, 187, 568, 309.0, 568.0, 568.0, 568.0, 0.020689227119438908, 0.024453966038633687, 0.013267505672296436], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 98.69230769230766, 80, 257, 84.0, 194.99999999999994, 257.0, 257.0, 0.05824581526219578, 0.04829169644297286, 0.020704567143983655], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=37e5b67a-a5e6-4a32-b4a7-d1406388ea99", 1, 0, 0.0, 205.0, 205, 205, 205.0, 205.0, 205.0, 205.0, 4.878048780487805, 0.8812881097560976, 3.363185975609756], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 85.93749999999999, 81, 97, 83.5, 95.6, 97.0, 97.0, 0.0736855194138317, 0.05720701946679316, 0.026192899479135483], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ae5d8f34-351a-460a-b159-db16acc38092", 3, 0, 0.0, 326.3333333333333, 175, 466, 338.0, 466.0, 466.0, 466.0, 0.01773584236383307, 0.02445029049831805, 0.011373570786702848], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b88d864b-24aa-4f33-aff6-313db3743b10", 1, 0, 0.0, 206.0, 206, 206, 206.0, 206.0, 206.0, 206.0, 4.854368932038835, 0.8770100121359223, 3.3468598300970878], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f7b17a7a-4c8b-4336-871d-7e4be2d8aa52", 1, 0, 0.0, 652.0, 652, 652, 652.0, 652.0, 652.0, 652.0, 1.5337423312883436, 0.277092120398773, 1.0574434432515336], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 90.37500000000001, 78, 240, 80.0, 130.80000000000013, 240.0, 240.0, 0.12317830829990838, 0.09154169200803738, 0.06182973678335245], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 118.9375, 79, 242, 80.0, 237.1, 242.0, 242.0, 0.12317925661318632, 0.032960074523450254, 0.07025066978720784], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 147.49999999999997, 78, 236, 81.0, 236.0, 236.0, 236.0, 0.12317925661318632, 0.03320065900902288, 0.0724159301573615], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 138.43750000000003, 77, 242, 81.5, 239.2, 242.0, 242.0, 0.12317736000123176, 0.033200147812832, 0.07253510554760034], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 41.666666666666664, 0.37821482602118], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 8.333333333333334, 0.07564296520423601], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 8.333333333333334, 0.07564296520423601], "isController": false}, {"data": ["401/Unauthorized", 5, 41.666666666666664, 0.37821482602118], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1322, 12, "406/Not Acceptable", 5, "401/Unauthorized", 5, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
