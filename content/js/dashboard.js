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

    var data = {"OkPercent": 99.02182091798345, "KoPercent": 0.9781790820165538};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8033052495139339, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.20175438596491227, 500, 1500, "see books"], "isController": true}, {"data": [0.7307692307692307, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7307692307692307, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e15287b0-0b91-487c-98d9-92ac8c517c06"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/21e547a5-7507-46bc-b6e7-35f580d2e825"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/471e3e46-b367-4156-906d-f345d6d04fde"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0ee4348d-1104-4934-9af2-72a6b1019963"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=906e4aff-17ab-4a0b-a380-9c5de75eb796"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/03b1f544-9385-4bf2-ad9b-ac837700caed"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/728ef4d5-8b34-40ac-8b24-71e4c088b3b5"], "isController": false}, {"data": [0.9047619047619048, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7029d050-8466-4472-8ab9-7843e0685161"], "isController": false}, {"data": [0.07142857142857142, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ba8cdf9e-7455-4ae1-80d0-ac273ca6e450"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0fba25c3-11ab-4e0c-bf65-ec3864c0c345"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ae65d30e-d128-4229-b1ea-65be8789f9c2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/64b3066f-52fa-4d67-8824-0c2509f6eabd"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bf75493c-569d-49e4-9440-d49f95ae1c93"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "register"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/71a0fcfe-81b5-495e-b591-4e1ec1dd3d4d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/906e4aff-17ab-4a0b-a380-9c5de75eb796"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0ee4348d-1104-4934-9af2-72a6b1019963"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4298245614035088, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/fc7897c7-322b-4930-90dd-036257076ec6"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=21e547a5-7507-46bc-b6e7-35f580d2e825"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.75, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.38095238095238093, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3064516129032258, 500, 1500, "addBook"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/7029d050-8466-4472-8ab9-7843e0685161"], "isController": false}, {"data": [0.9912280701754386, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5964912280701754, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=728ef4d5-8b34-40ac-8b24-71e4c088b3b5"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b76c2cdd-9020-4c40-b74b-1c1ce5521258"], "isController": false}, {"data": [0.9475138121546961, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b76c2cdd-9020-4c40-b74b-1c1ce5521258"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=03b1f544-9385-4bf2-ad9b-ac837700caed"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1a05da9d-c4f3-428a-aec8-b0029fd80476"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7808e7ac-0265-4d32-a057-be5128d4f14c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ba8cdf9e-7455-4ae1-80d0-ac273ca6e450"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fc7897c7-322b-4930-90dd-036257076ec6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=64b3066f-52fa-4d67-8824-0c2509f6eabd"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bf75493c-569d-49e4-9440-d49f95ae1c93"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=71a0fcfe-81b5-495e-b591-4e1ec1dd3d4d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1329, 13, 0.9781790820165538, 342.88638073739617, 93, 3934, 113.0, 966.0, 1177.5, 1551.9000000000003, 5.181852209987835, 721.707932846958, 3.7815752365267947], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1600.1929824561407, 1168, 2485, 1590.0, 1981.0, 2005.2999999999997, 2485.0, 0.2589108483645465, 311.556471167211, 1.2730626186674723], "isController": true}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 465.7692307692308, 108, 639, 489.0, 621.0, 639.0, 639.0, 0.07916499202260464, 0.014998055129282522, 0.053516057933550125], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 465.7692307692308, 108, 639, 489.0, 621.0, 639.0, 639.0, 0.08049386079515551, 0.015249813470957198, 0.05441438200838375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 121.72222222222223, 96, 300, 101.5, 288.3, 300.0, 300.0, 0.09932788133629109, 0.051442271876965866, 0.05525760065225309], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 101.33333333333334, 98, 106, 101.0, 105.1, 106.0, 106.0, 0.0993262370255103, 0.07381568982071614, 0.049857115069445596], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 214.11111111111111, 94, 806, 100.0, 772.7, 806.0, 806.0, 0.0993306219752446, 4.890060746883502, 0.05706983977418839], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 309.72222222222223, 96, 1264, 102.5, 1156.0000000000002, 1264.0, 1264.0, 0.0993262370255103, 14.917963382761931, 0.05697032214809542], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e15287b0-0b91-487c-98d9-92ac8c517c06", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 1.2621973814229248, 2.3584177371541504], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/21e547a5-7507-46bc-b6e7-35f580d2e825", 3, 0, 0.0, 553.0, 262, 929, 468.0, 929.0, 929.0, 929.0, 0.01889323433278543, 0.02604584876280804, 0.012115778527209405], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/471e3e46-b367-4156-906d-f345d6d04fde", 1, 0, 0.0, 203.0, 203, 203, 203.0, 203.0, 203.0, 203.0, 4.926108374384237, 1.573083435960591, 2.939308805418719], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 261.20000000000005, 100, 929, 208.0, 572.0000000000002, 929.0, 929.0, 0.08876212342669136, 0.16769453513796592, 0.0573717683190229], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/0ee4348d-1104-4934-9af2-72a6b1019963", 3, 0, 0.0, 317.6666666666667, 188, 549, 216.0, 549.0, 549.0, 549.0, 0.0195726635132931, 0.023134225656499755, 0.012551480182678192], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 13, 0, 0.0, 116.6923076923077, 97, 298, 102.0, 222.39999999999992, 298.0, 298.0, 0.10089172765442254, 0.07497910619630425, 0.05064291798278632], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 13, 0, 0.0, 160.53846153846158, 95, 300, 101.0, 299.6, 300.0, 300.0, 0.10089407674158699, 0.0386538304824289, 0.0568893434511983], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 794.0, 778, 813, 791.0, 813.0, 813.0, 813.0, 0.03364020677513765, 9.891337751881048, 0.019185430426445688], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 1028.6666666666667, 864, 1124, 1098.0, 1124.0, 1124.0, 1124.0, 0.0336126921525568, 30.24475948368104, 0.019136913598574824], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 238.33333333333334, 104, 310, 301.0, 310.0, 310.0, 310.0, 0.033826066366742215, 0.05985628150052431, 0.01872986291986605], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=906e4aff-17ab-4a0b-a380-9c5de75eb796", 1, 0, 0.0, 420.0, 420, 420, 420.0, 420.0, 420.0, 420.0, 2.3809523809523814, 0.43015252976190477, 1.6415550595238095], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 116.92307692307693, 94, 298, 101.0, 230.39999999999992, 298.0, 298.0, 0.08753972956957388, 0.06505638105707591, 0.04394084081910252], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 156.84615384615384, 93, 298, 99.0, 294.4, 298.0, 298.0, 0.08742845998130376, 0.03349497790750069, 0.049296726308568656], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 216.53846153846155, 97, 1021, 102.0, 733.7999999999997, 1021.0, 1021.0, 0.08741905331889799, 6.07250491101749, 0.05081495151604812], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 173.76923076923075, 96, 869, 99.0, 642.1999999999998, 869.0, 869.0, 0.08753914009629304, 2.0017344744284706, 0.05097024300528602], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 160.66666666666669, 93, 291, 98.0, 291.0, 291.0, 291.0, 0.033903285228338624, 0.025195703182388375, 0.019037489263959678], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 829.5714285714284, 94, 1238, 1084.5, 1225.0, 1238.0, 1238.0, 0.1033851243575353, 66.45518774092426, 0.054432960285342946], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 13, 0, 0.0, 189.15384615384616, 96, 881, 101.0, 647.7999999999997, 881.0, 881.0, 0.10075566750629723, 6.998923718756055, 0.05856725925208293], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 630.3571428571428, 97, 941, 787.0, 924.5, 941.0, 941.0, 0.10337901701323252, 21.72000647041883, 0.05453070079897211], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 13, 0, 0.0, 180.3846153846154, 93, 764, 101.0, 575.5999999999999, 764.0, 764.0, 0.10074395536267824, 2.30368550933819, 0.05865883398558587], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 477.2307692307693, 104, 792, 444.0, 777.6, 792.0, 792.0, 0.08069872682239451, 0.015288625980023963, 0.055195455808135674], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/03b1f544-9385-4bf2-ad9b-ac837700caed", 3, 0, 0.0, 316.6666666666667, 203, 526, 221.0, 526.0, 526.0, 526.0, 0.03347205641157241, 0.027206941686099058, 0.021464827842056524], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 350.7692307692308, 196, 1122, 205.0, 913.1999999999998, 1122.0, 1122.0, 0.0873614816507288, 8.164570971123672, 0.1947586156061207], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/728ef4d5-8b34-40ac-8b24-71e4c088b3b5", 3, 0, 0.0, 283.3333333333333, 205, 438, 207.0, 438.0, 438.0, 438.0, 0.07450084434290255, 0.03298214463097248, 0.047775606561041024], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 393.52380952380946, 126, 952, 390.0, 858.4000000000001, 945.9999999999999, 952.0, 0.09473755441770239, 0.058193282938217586, 0.04283543720253536], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 101.21428571428572, 95, 111, 101.0, 109.0, 111.0, 111.0, 0.10337443697851288, 0.07682416654360186, 0.0518891216864801], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 143.71428571428572, 94, 315, 100.0, 311.5, 315.0, 315.0, 0.10338207059518534, 0.1385735120366268, 0.052758316718357706], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7029d050-8466-4472-8ab9-7843e0685161", 1, 0, 0.0, 715.0, 715, 715, 715.0, 715.0, 715.0, 715.0, 1.3986013986013985, 0.2526770104895105, 0.9642701048951049], "isController": false}, {"data": ["login", 21, 0, 0.0, 2289.857142857143, 1156, 5139, 2024.0, 3287.4, 4959.199999999997, 5139.0, 0.09377218716928559, 16.15810691955016, 0.1636957837680344], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 13, 0, 0.0, 106.84615384615385, 102, 119, 105.0, 116.6, 119.0, 119.0, 0.09604018912529551, 0.07775128592272458, 0.034139285978132386], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ba8cdf9e-7455-4ae1-80d0-ac273ca6e450", 3, 0, 0.0, 302.6666666666667, 195, 495, 218.0, 495.0, 495.0, 495.0, 0.0447127207690588, 0.028745971197555707, 0.028673196586928983], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0fba25c3-11ab-4e0c-bf65-ec3864c0c345", 2, 0, 0.0, 231.0, 214, 248, 231.0, 248.0, 248.0, 248.0, 0.021208682834752548, 0.030197519114325406, 0.013182936156562497], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ae65d30e-d128-4229-b1ea-65be8789f9c2", 1, 0, 0.0, 345.0, 345, 345, 345.0, 345.0, 345.0, 345.0, 2.898550724637681, 0.9256114130434784, 1.7295063405797102], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/64b3066f-52fa-4d67-8824-0c2509f6eabd", 3, 0, 0.0, 689.0, 332, 1344, 391.0, 1344.0, 1344.0, 1344.0, 0.015851126222518108, 0.021852057145951887, 0.010164947479935117], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 932.9285714285714, 202, 1334, 1186.5, 1325.5, 1334.0, 1334.0, 0.10329587628105333, 88.31558204459431, 0.21343683364936955], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bf75493c-569d-49e4-9440-d49f95ae1c93", 3, 0, 0.0, 341.66666666666663, 198, 617, 210.0, 617.0, 617.0, 617.0, 0.044539461963299484, 0.028634582479660314, 0.028562089865787756], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 423.55555555555554, 197, 1366, 207.5, 1261.6000000000001, 1366.0, 1366.0, 0.09927036283317615, 19.921852379800136, 0.2190281638291888], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 2, 40.0, 754.6, 100, 1223, 1155.0, 1223.0, 1223.0, 1223.0, 0.04995953277844946, 35.866729199348526, 0.08049144255652921], "isController": false}, {"data": ["register", 21, 3, 14.285714285714286, 1024.952380952381, 199, 1798, 1051.0, 1747.6000000000001, 1797.4, 1798.0, 0.09487537441888834, 0.03028388067388623, 0.04280510056789689], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/71a0fcfe-81b5-495e-b591-4e1ec1dd3d4d", 3, 0, 0.0, 347.0, 179, 631, 231.0, 631.0, 631.0, 631.0, 0.020855492293895595, 0.024650485846072562, 0.013374127545239037], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 20, 0, 0.0, 109.45, 101, 140, 105.0, 128.5, 139.45, 140.0, 0.10086084733197843, 0.07830505237199498, 0.03585287932503921], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 13, 0, 0.0, 369.3076923076923, 199, 1179, 395.0, 868.5999999999997, 1179.0, 1179.0, 0.10066204653683844, 9.407606275891439, 0.22441012282705483], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/906e4aff-17ab-4a0b-a380-9c5de75eb796", 3, 0, 0.0, 266.0, 196, 397, 205.0, 397.0, 397.0, 397.0, 0.08234745134638083, 0.03726007726935852, 0.05280744764074552], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 13, 0, 0.0, 434.3846153846154, 200, 1284, 394.0, 1004.3999999999997, 1284.0, 1284.0, 0.15143749126322165, 14.152943857462375, 0.33760595163901963], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0ee4348d-1104-4934-9af2-72a6b1019963", 1, 0, 0.0, 431.0, 431, 431, 431.0, 431.0, 431.0, 431.0, 2.320185614849188, 0.41917415893271465, 1.599659222737819], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 20, 0, 0.0, 101.55000000000001, 95, 114, 100.5, 110.7, 113.85, 114.0, 0.0926582255023234, 0.06886026328834777, 0.046510085847845925], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 20, 0, 0.0, 128.85000000000002, 94, 302, 99.0, 299.6, 301.9, 302.0, 0.09265908406495402, 0.024793543978317775, 0.052844633880794085], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 20, 0, 0.0, 128.55, 93, 300, 99.5, 291.20000000000005, 299.6, 300.0, 0.09258101996509696, 0.02495347803746754, 0.05442751369041833], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 20, 0, 0.0, 136.89999999999998, 93, 305, 99.0, 292.7, 304.4, 305.0, 0.0926608012379483, 0.02497498158366575, 0.05456490541648713], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 104.0, 104, 104, 104.0, 104.0, 104.0, 104.0, 9.615384615384617, 2.8357872596153846, 5.943885216346154], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1097.7719298245615, 761, 2067, 1054.0, 1558.2, 1587.6999999999998, 2067.0, 0.25069931915342797, 299.9235428926743, 0.49503322590647597], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 3, 14.285714285714286, 1024.952380952381, 199, 1798, 1051.0, 1747.6000000000001, 1797.4, 1798.0, 0.09541681244235235, 0.030456705757268717, 0.04304938217613944], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 122.37499999999999, 93, 293, 98.5, 293.0, 293.0, 293.0, 0.04024063902134766, 0.01084610973622261, 0.02369639192370375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 125.125, 97, 304, 99.5, 304.0, 304.0, 304.0, 0.040240234198163034, 0.01084600062372363, 0.02365685643290444], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fc7897c7-322b-4930-90dd-036257076ec6", 3, 0, 0.0, 664.6666666666666, 334, 958, 702.0, 958.0, 958.0, 958.0, 0.03202767190852897, 0.026700152264890198, 0.020538578665300154], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 20, 0, 0.0, 174.54999999999998, 96, 1010, 100.0, 301.8, 974.6499999999995, 1010.0, 0.10087865306822423, 4.56436991981408, 0.05887215143903398], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=21e547a5-7507-46bc-b6e7-35f580d2e825", 1, 0, 0.0, 435.0, 435, 435, 435.0, 435.0, 435.0, 435.0, 2.2988505747126435, 0.41531968390804597, 1.5849497126436782], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 20, 0, 0.0, 191.95, 95, 777, 102.0, 304.3, 753.3999999999996, 777.0, 0.10087763542822556, 1.5088989048471704, 0.05897007086653889], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 98.99999999999999, 96, 101, 99.5, 101.0, 101.0, 101.0, 0.040240234198163034, 0.010767406416305343, 0.022949508566139854], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 20, 0, 0.0, 129.04999999999998, 95, 299, 100.0, 289.9, 298.55, 299.0, 0.10087865306822423, 0.07496938963370961, 0.05063635515338599], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 124.0, 96, 292, 101.0, 292.0, 292.0, 292.0, 0.040239019777478215, 0.029904193408848558, 0.020198101724241996], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 20, 0, 0.0, 138.35000000000002, 95, 305, 98.5, 301.8, 304.9, 305.0, 0.10087916189592297, 0.034568845614530636, 0.05710903335065092], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 131.875, 102, 286, 107.5, 286.0, 286.0, 286.0, 0.0380926985819993, 0.02998312017294085, 0.013540763949070061], "isController": false}, {"data": ["deleteAccount", 12, 0, 0.0, 520.0, 391, 702, 510.5, 680.7, 702.0, 702.0, 0.07530734811449227, 0.013605331446465889, 0.05125900550371202], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1428.095238095238, 770, 3934, 1351.0, 2016.0000000000002, 3748.7999999999975, 3934.0, 0.09327695259754104, 0.048278110231149175, 0.04290375456390804], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 251.12499999999997, 197, 597, 202.5, 597.0, 597.0, 597.0, 0.040218588025920876, 0.06233095624720355, 0.0904525470934529], "isController": false}, {"data": ["addBook", 62, 6, 9.67741935483871, 1107.145161290323, 518, 2602, 860.0, 1852.5000000000002, 2357.5999999999976, 2602.0, 0.2916192393441389, 96.75286790765547, 1.05980682136205], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/7029d050-8466-4472-8ab9-7843e0685161", 3, 0, 0.0, 432.0, 208, 557, 531.0, 557.0, 557.0, 557.0, 0.04422626155411083, 0.028433224794716435, 0.028361241947134876], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 179.01754385964918, 96, 721, 104.0, 396.0, 411.89999999999986, 721.0, 0.2516834087647643, 0.18704206452147037, 0.12166336654156089], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 625.2280701754387, 460, 889, 579.0, 811.4, 860.3, 889.0, 0.2518891687657431, 74.06377912468514, 0.12668254093198994], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 150.12280701754386, 94, 397, 102.0, 299.0, 308.2999999999997, 397.0, 0.2524156621704204, 0.4466574022000018, 0.12275683570397398], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=728ef4d5-8b34-40ac-8b24-71e4c088b3b5", 1, 0, 0.0, 233.0, 233, 233, 233.0, 233.0, 233.0, 233.0, 4.291845493562231, 0.7753822424892703, 2.9590262875536477], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 915.4736842105264, 662, 1309, 909.0, 1177.2, 1243.4999999999998, 1309.0, 0.25153791161752115, 226.3342550299308, 0.12626024079238857], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 13, 0, 0.0, 119.07692307692308, 101, 289, 104.0, 217.79999999999995, 289.0, 289.0, 0.14915783193354445, 0.11143138811441552, 0.053020948070127125], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b76c2cdd-9020-4c40-b74b-1c1ce5521258", 1, 0, 0.0, 501.0, 501, 501, 501.0, 501.0, 501.0, 501.0, 1.996007984031936, 0.3606069111776447, 1.3761539421157685], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 181, 6, 3.314917127071823, 185.58011049723754, 97, 1340, 107.0, 306.40000000000003, 416.50000000000034, 1278.5000000000005, 0.7256224918918702, 1.5182815963995493, 0.350592518621638], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 20, 0, 0.0, 136.15, 99, 317, 105.5, 306.6, 316.55, 317.0, 0.09430359155228427, 0.07303002744234514, 0.03352197980960105], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b76c2cdd-9020-4c40-b74b-1c1ce5521258", 3, 0, 0.0, 311.3333333333333, 199, 495, 240.0, 495.0, 495.0, 495.0, 0.030647896532701308, 0.025549890306070328, 0.01965376177390025], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=03b1f544-9385-4bf2-ad9b-ac837700caed", 1, 0, 0.0, 448.0, 448, 448, 448.0, 448.0, 448.0, 448.0, 2.232142857142857, 0.4032679966517857, 1.5389578683035714], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1a05da9d-c4f3-428a-aec8-b0029fd80476", 1, 0, 0.0, 284.0, 284, 284, 284.0, 284.0, 284.0, 284.0, 3.5211267605633805, 1.1244223151408452, 2.1009848151408455], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 125.55555555555556, 98, 293, 105.0, 291.2, 293.0, 293.0, 0.10205990916668084, 0.0828240083178826, 0.036279108336593584], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7808e7ac-0265-4d32-a057-be5128d4f14c", 1, 0, 0.0, 196.0, 196, 196, 196.0, 196.0, 196.0, 196.0, 5.1020408163265305, 1.6292649872448979, 3.044284119897959], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 20, 0, 0.0, 252.75, 195, 414, 202.0, 407.0, 413.65, 414.0, 0.09253647093660788, 0.14341345642226241, 0.20811669195996874], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ba8cdf9e-7455-4ae1-80d0-ac273ca6e450", 1, 0, 0.0, 792.0, 792, 792, 792.0, 792.0, 792.0, 792.0, 1.2626262626262628, 0.2281111900252525, 0.8705216224747474], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 20, 0, 0.0, 345.00000000000006, 197, 1116, 207.0, 602.1, 1090.3499999999997, 1116.0, 0.10082677959265982, 6.179642797502016, 0.22547191659104657], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fc7897c7-322b-4930-90dd-036257076ec6", 1, 0, 0.0, 756.0, 756, 756, 756.0, 756.0, 756.0, 756.0, 1.3227513227513228, 0.23897362764550265, 0.911975033068783], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=64b3066f-52fa-4d67-8824-0c2509f6eabd", 1, 0, 0.0, 413.0, 413, 413, 413.0, 413.0, 413.0, 413.0, 2.4213075060532687, 0.4374432506053269, 1.6693780266343827], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bf75493c-569d-49e4-9440-d49f95ae1c93", 1, 0, 0.0, 512.0, 512, 512, 512.0, 512.0, 512.0, 512.0, 1.953125, 0.3528594970703125, 1.346588134765625], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 105.61538461538461, 99, 127, 105.0, 119.39999999999999, 127.0, 127.0, 0.0950174320442635, 0.07877910137263644, 0.03377572779698429], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 106.92857142857143, 98, 123, 106.0, 120.0, 123.0, 123.0, 0.1051643192488263, 0.08164612676056338, 0.03738262910798122], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=71a0fcfe-81b5-495e-b591-4e1ec1dd3d4d", 1, 0, 0.0, 444.0, 444, 444, 444.0, 444.0, 444.0, 444.0, 2.2522522522522523, 0.4069010416666667, 1.5528223536036037], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 13, 0, 0.0, 115.61538461538461, 97, 289, 100.0, 217.39999999999992, 289.0, 289.0, 0.15196147192219572, 0.11293230481717866, 0.0762775357109459], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 13, 0, 0.0, 188.1538461538462, 96, 301, 103.0, 301.0, 301.0, 301.0, 0.15196324827287924, 0.05821909301319743, 0.08568480630530585], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 13, 0, 0.0, 213.6923076923077, 97, 1183, 101.0, 828.1999999999997, 1183.0, 1183.0, 0.15161057075548715, 10.531524885271617, 0.08812819985771932], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 13, 0, 0.0, 240.69230769230768, 97, 596, 287.0, 477.19999999999993, 596.0, 596.0, 0.15161587534842494, 3.466960313086783, 0.08827934569002718], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 3, 23.076923076923077, 0.22573363431151242], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 15.384615384615385, 0.1504890895410083], "isController": false}, {"data": ["401/Unauthorized", 8, 61.53846153846154, 0.6019563581640331], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1329, 13, "401/Unauthorized", 8, "406/Not Acceptable", 3, "Test failed: code expected to contain /200/", 2, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 2, "Test failed: code expected to contain /200/", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 3, "406/Not Acceptable", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 181, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
