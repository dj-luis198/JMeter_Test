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

    var data = {"OkPercent": 97.109375, "KoPercent": 2.890625};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7653949129852744, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.2777777777777778, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=431cb613-45c2-4eab-83c8-24d94de0753d"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4e07413d-ad33-4dc5-9997-08e9120ed9e3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=432a7b4a-c3ba-4bd1-920a-da775189ab59"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f44e8e2e-346a-4792-98f0-89e4d8e1d7d6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.4666666666666667, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7929e9a4-3b68-4c5e-a598-359f3fd78dbd"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f44e8e2e-346a-4792-98f0-89e4d8e1d7d6"], "isController": false}, {"data": [0.7045454545454546, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/4e07413d-ad33-4dc5-9997-08e9120ed9e3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/431cb613-45c2-4eab-83c8-24d94de0753d"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e36ac567-22ed-4839-b604-4fce9bbdf447"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c081009d-87c1-4faf-8a3e-92dd216d86ac"], "isController": false}, {"data": [0.6764705882352942, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=beed8c51-b43d-4725-af62-2a159c2e1b78"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1e061df2-875e-49a5-b008-cec7ec1a3c5b"], "isController": false}, {"data": [0.32142857142857145, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a53aff41-a210-4805-84f6-735c92db9375"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=89d28b48-2337-4c17-a5de-93df5ec3068d"], "isController": false}, {"data": [0.17391304347826086, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/beed8c51-b43d-4725-af62-2a159c2e1b78"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.49074074074074076, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.17391304347826086, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/68ef00d2-240a-4544-a047-148795940b9a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.22727272727272727, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.24107142857142858, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/432a7b4a-c3ba-4bd1-920a-da775189ab59"], "isController": false}, {"data": [0.6574074074074074, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8734939759036144, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e36ac567-22ed-4839-b604-4fce9bbdf447"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fd0a8ebb-e556-4697-80d0-a73f349da881"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/7929e9a4-3b68-4c5e-a598-359f3fd78dbd"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/89d28b48-2337-4c17-a5de-93df5ec3068d"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1e061df2-875e-49a5-b008-cec7ec1a3c5b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=68ef00d2-240a-4544-a047-148795940b9a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c081009d-87c1-4faf-8a3e-92dd216d86ac"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a53aff41-a210-4805-84f6-735c92db9375"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1280, 37, 2.890625, 349.03750000000025, 85, 4419, 105.0, 967.0, 1191.95, 1869.3700000000013, 4.990311777525663, 712.1670846174613, 3.656833401072917], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 1462.9629629629628, 1055, 2083, 1434.5, 1777.0, 1860.0, 2083.0, 0.2565625371184226, 308.73037363404205, 1.2615159906164628], "isController": true}, {"data": ["deleteBook", 15, 3, 20.0, 687.8000000000001, 89, 2484, 512.0, 1776.0000000000005, 2484.0, 2484.0, 0.06936608645789016, 0.014117082439281552, 0.04648340676504319], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, 20.0, 687.8000000000001, 89, 2484, 512.0, 1776.0000000000005, 2484.0, 2484.0, 0.07019284313771368, 0.01428534034169876, 0.047037430626073365], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 13, 0, 0.0, 87.46153846153845, 85, 90, 87.0, 89.6, 90.0, 90.0, 0.22117118649834971, 0.05918057138725374, 0.1261366922998401], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 13, 0, 0.0, 89.53846153846153, 87, 91, 90.0, 91.0, 91.0, 91.0, 0.22115613623217992, 0.16435529264911028, 0.11101001369466844], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 13, 0, 0.0, 141.69230769230768, 85, 274, 88.0, 270.8, 274.0, 274.0, 0.220492206448549, 0.05942954001933547, 0.1298406254770264], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 13, 0, 0.0, 142.3846153846154, 87, 270, 89.0, 269.2, 270.0, 270.0, 0.22048846675712347, 0.05942853205563094, 0.12962310252713705], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=431cb613-45c2-4eab-83c8-24d94de0753d", 1, 0, 0.0, 631.0, 631, 631, 631.0, 631.0, 631.0, 631.0, 1.5847860538827259, 0.28631388668779717, 1.0926356973058637], "isController": false}, {"data": ["goToProfile", 15, 3, 20.0, 240.86666666666667, 85, 997, 204.0, 553.0000000000002, 997.0, 997.0, 0.06929974913490813, 0.11527399677063169, 0.04478766989988496], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4e07413d-ad33-4dc5-9997-08e9120ed9e3", 1, 0, 0.0, 1054.0, 1054, 1054, 1054.0, 1054.0, 1054.0, 1054.0, 0.9487666034155597, 0.17140802893738138, 0.6541300996204933], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=432a7b4a-c3ba-4bd1-920a-da775189ab59", 1, 0, 0.0, 342.0, 342, 342, 342.0, 342.0, 342.0, 342.0, 2.923976608187134, 0.5282574926900584, 2.0159448099415203], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 91.24999999999999, 85, 110, 89.0, 103.0, 110.0, 110.0, 0.09894132779261898, 0.07352963911150688, 0.04966390867715445], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 133.375, 86, 270, 90.0, 267.2, 270.0, 270.0, 0.09894438707044222, 0.04505158249179071, 0.05539049793762794], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 9, 0, 0.0, 666.6666666666666, 515, 773, 698.0, 773.0, 773.0, 773.0, 0.06111224281931147, 17.96902850631493, 0.034853075982888566], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 9, 0, 0.0, 934.5555555555555, 703, 1053, 967.0, 1053.0, 1053.0, 1053.0, 0.060965283657917015, 54.856669400931416, 0.03470972692633362], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 9, 0, 0.0, 169.77777777777777, 85, 314, 89.0, 314.0, 314.0, 314.0, 0.06136768105170568, 0.10859202936102606, 0.033979956207340935], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 89.78571428571426, 86, 99, 88.5, 95.5, 99.0, 99.0, 0.08263535967040297, 0.06141162959880533, 0.041479077022057734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 89.5, 85, 112, 87.5, 102.5, 112.0, 112.0, 0.08263535967040297, 0.02211141459930704, 0.04712797856202669], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 145.64285714285714, 86, 346, 91.5, 306.0, 346.0, 346.0, 0.08263389642431326, 0.022272417395615682, 0.04857969301507478], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 159.21428571428572, 86, 362, 91.5, 314.0, 362.0, 362.0, 0.08263438416725198, 0.02227254885757964, 0.04866067739536421], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f44e8e2e-346a-4792-98f0-89e4d8e1d7d6", 1, 0, 0.0, 515.0, 515, 515, 515.0, 515.0, 515.0, 515.0, 1.941747572815534, 0.3508040048543689, 1.338743932038835], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 9, 0, 0.0, 147.0, 86, 274, 91.0, 274.0, 274.0, 274.0, 0.061288279637990564, 0.04554724687940509, 0.034414805460785715], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 631.0, 88, 1191, 815.0, 1078.1999999999998, 1191.0, 1191.0, 0.10544532039870737, 55.82339953774632, 0.05665989929971902], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 192.68750000000003, 86, 971, 89.5, 785.5000000000002, 971.0, 971.0, 0.09894255148104632, 11.151919814018923, 0.05710453898954919], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 456.35294117647055, 87, 802, 619.0, 768.4, 802.0, 802.0, 0.10545055299510586, 18.250505542357008, 0.05676569003430244], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 174.375, 85, 678, 89.5, 575.1000000000001, 678.0, 678.0, 0.09894561083454438, 3.659997178504066, 0.05720293126372097], "isController": false}, {"data": ["deleteBooks", 15, 3, 20.0, 528.7333333333333, 92, 1054, 562.0, 1021.6, 1054.0, 1054.0, 0.07059321834482433, 0.01436682295220839, 0.0476642101207144], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 251.0, 175, 455, 185.0, 410.5, 455.0, 455.0, 0.08259099758126365, 0.12799991519674356, 0.18574908928676775], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7929e9a4-3b68-4c5e-a598-359f3fd78dbd", 1, 0, 0.0, 622.0, 622, 622, 622.0, 622.0, 622.0, 622.0, 1.607717041800643, 0.2904566921221865, 1.108445538585209], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f44e8e2e-346a-4792-98f0-89e4d8e1d7d6", 3, 0, 0.0, 493.66666666666663, 189, 808, 484.0, 808.0, 808.0, 808.0, 0.03160855959793912, 0.02635075557627672, 0.020269811981751325], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 661.7727272727273, 144, 1865, 524.5, 1320.3999999999999, 1786.5499999999988, 1865.0, 0.0922052992900192, 0.05663782544279499, 0.04169048200320204], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 103.41176470588235, 87, 269, 90.0, 157.7999999999999, 269.0, 269.0, 0.10544597444485795, 0.07836365874271183, 0.05292893639126659], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 132.35294117647058, 87, 275, 91.0, 270.2, 275.0, 275.0, 0.10544924479732036, 0.12138051282448903, 0.0549295583537512], "isController": false}, {"data": ["login", 22, 0, 0.0, 3180.8636363636365, 1877, 6594, 3003.0, 4692.0, 6312.299999999996, 6594.0, 0.09659332891345676, 47.40177408604051, 0.21126360538990777], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 106.37500000000001, 87, 262, 95.0, 156.30000000000013, 262.0, 262.0, 0.10067135207917802, 0.08150053796253767, 0.03578551968439531], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4e07413d-ad33-4dc5-9997-08e9120ed9e3", 3, 0, 0.0, 1629.0, 361, 3529, 997.0, 3529.0, 3529.0, 3529.0, 0.061807243808974406, 0.027966168259920064, 0.0396355046561457], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/431cb613-45c2-4eab-83c8-24d94de0753d", 3, 0, 0.0, 801.3333333333334, 179, 2036, 189.0, 2036.0, 2036.0, 2036.0, 0.026592444200187918, 0.02667035175155566, 0.017053097354938217], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e36ac567-22ed-4839-b604-4fce9bbdf447", 3, 0, 0.0, 363.66666666666663, 226, 639, 226.0, 639.0, 639.0, 639.0, 0.030517578125, 0.025143225987752277, 0.019570191701253254], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c081009d-87c1-4faf-8a3e-92dd216d86ac", 3, 0, 0.0, 529.0, 195, 1108, 284.0, 1108.0, 1108.0, 1108.0, 0.027911910012002123, 0.02799368318586541, 0.017899239167852923], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 735.9411764705882, 180, 1282, 905.0, 1173.1999999999998, 1282.0, 1282.0, 0.10538256972296782, 74.22853881061822, 0.2211472113137487], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=beed8c51-b43d-4725-af62-2a159c2e1b78", 1, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 2.277904328018223, 0.4115354498861048, 1.570508257403189], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1e061df2-875e-49a5-b008-cec7ec1a3c5b", 1, 0, 0.0, 562.0, 562, 562, 562.0, 562.0, 562.0, 562.0, 1.779359430604982, 0.3214663033807829, 1.2267849199288254], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 5, 35.714285714285715, 732.9285714285713, 85, 1309, 960.5, 1281.5, 1309.0, 1309.0, 0.09280865507000424, 71.38620861314037, 0.15638154798207465], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 13, 0, 0.0, 247.23076923076925, 176, 366, 181.0, 363.6, 366.0, 366.0, 0.2201486850349698, 0.3411874640141572, 0.4951195523784525], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a53aff41-a210-4805-84f6-735c92db9375", 1, 0, 0.0, 602.0, 602, 602, 602.0, 602.0, 602.0, 602.0, 1.6611295681063123, 0.3001064161129568, 1.1452709717607974], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=89d28b48-2337-4c17-a5de-93df5ec3068d", 1, 0, 0.0, 518.0, 518, 518, 518.0, 518.0, 518.0, 518.0, 1.9305019305019306, 0.3487723214285714, 1.3309905888030888], "isController": false}, {"data": ["register", 23, 9, 39.130434782608695, 1200.3043478260868, 148, 4419, 1087.0, 1774.4, 3900.7999999999925, 4419.0, 0.09435200682616258, 0.02929270864100292, 0.04256897182977257], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 120.1111111111111, 91, 340, 95.0, 274.3000000000001, 340.0, 340.0, 0.08506978085079234, 0.06604538650037099, 0.030239648661805084], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 330.25, 177, 1072, 185.0, 877.4000000000002, 1072.0, 1072.0, 0.09888629312369439, 14.92189576225881, 0.2192349677383469], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/beed8c51-b43d-4725-af62-2a159c2e1b78", 3, 0, 0.0, 425.0, 234, 527, 514.0, 527.0, 527.0, 527.0, 0.04148803761582077, 0.03458686990042871, 0.026605284538791314], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 276.7894736842105, 175, 1113, 182.0, 525.0, 1113.0, 1113.0, 0.11133704066145922, 7.17387998233257, 0.24890031782330227], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 114.0, 87, 266, 89.0, 266.0, 266.0, 266.0, 0.10025636986007075, 0.07450693111671274, 0.05032399815241833], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 111.42857142857143, 85, 257, 87.0, 257.0, 257.0, 257.0, 0.1002549339749649, 0.026826027255019907, 0.057176642032597175], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 137.42857142857144, 88, 265, 88.0, 265.0, 265.0, 265.0, 0.10025349813098836, 0.02702145066811796, 0.05893809167466308], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 135.71428571428572, 86, 258, 87.0, 258.0, 258.0, 258.0, 0.1002549339749649, 0.02702183767293976, 0.05903684100283578], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 106.33333333333333, 92, 131, 96.0, 131.0, 131.0, 131.0, 0.06554368486596317, 0.01933026643507898, 0.04051675050796356], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1019.6111111111107, 682, 1590, 993.0, 1371.5, 1441.5, 1590.0, 0.24358557973367975, 291.4130374106853, 0.4809863693569341], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 9, 39.130434782608695, 1200.3043478260868, 148, 4419, 1087.0, 1774.4, 3900.7999999999925, 4419.0, 0.0918464327644179, 0.028514823215583542, 0.041438527282383855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 118.5, 88, 265, 89.5, 265.0, 265.0, 265.0, 0.06440186765416198, 0.017358315891160842, 0.03792414667525358], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 89.0, 87, 91, 89.0, 91.0, 91.0, 91.0, 0.0644039415212211, 0.017358874863141624, 0.03786247343337412], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 126.27777777777777, 86, 258, 90.0, 257.1, 258.0, 258.0, 0.08550175278593211, 0.023045394305583264, 0.05026567888391712], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 107.5, 85, 272, 87.5, 257.6, 272.0, 272.0, 0.08550337738340665, 0.02304583218537132, 0.05035013336151778], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/68ef00d2-240a-4544-a047-148795940b9a", 3, 0, 0.0, 351.0, 204, 489, 360.0, 489.0, 489.0, 489.0, 0.018716077110237695, 0.022121769527107118, 0.012002171844781334], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 100.1111111111111, 86, 260, 89.0, 138.5000000000002, 260.0, 260.0, 0.08550094051034562, 0.06354122629723927, 0.042917464279607076], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 88.5, 86, 92, 88.0, 92.0, 92.0, 92.0, 0.0644039415212211, 0.017233085914857987, 0.0367303728988214], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 118.22222222222224, 86, 269, 90.0, 267.2, 269.0, 269.0, 0.08550418970529555, 0.02287905076098729, 0.04876410819130138], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 92.16666666666667, 88, 101, 91.5, 101.0, 101.0, 101.0, 0.06440048515032147, 0.04786012617128382, 0.03232602477271995], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 102.66666666666667, 90, 123, 94.0, 123.0, 123.0, 123.0, 0.0662778366914104, 0.052167906614528095, 0.023559699761399787], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 948.5714285714284, 91, 3529, 723.5, 2782.5, 3529.0, 3529.0, 0.06902706353941199, 0.01332777008071236, 0.04697461159950498], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1807.4545454545455, 1195, 3475, 1553.5, 2936.3999999999996, 3405.099999999999, 3475.0, 0.09483126500597007, 0.049082588333168094, 0.04361867755645693], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 212.5, 179, 367, 182.5, 367.0, 367.0, 367.0, 0.06433695407413761, 0.0997097130035707, 0.1446953176100966], "isController": false}, {"data": ["addBook", 56, 17, 30.357142857142858, 1006.0892857142861, 443, 5330, 751.0, 1729.1000000000006, 1898.4499999999994, 5330.0, 0.2442630887939946, 68.82488224392723, 0.8879157515888005], "isController": true}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 175.70370370370378, 88, 387, 93.0, 353.5, 361.25, 387.0, 0.24436047695544946, 0.18159992476864945, 0.11812347274701902], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/432a7b4a-c3ba-4bd1-920a-da775189ab59", 3, 0, 0.0, 463.0, 257, 647, 485.0, 647.0, 647.0, 647.0, 0.05272129764687275, 0.023855014234750366, 0.0338089050665167], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 573.5370370370372, 424, 794, 524.0, 714.5, 771.0, 794.0, 0.24413400244134004, 71.78350272955377, 0.12278223755594737], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 134.09259259259255, 85, 297, 93.0, 264.5, 268.5, 297.0, 0.24469931438877285, 0.4330030836645082, 0.11900415875547742], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 841.4629629629628, 590, 1192, 827.5, 1042.5, 1078.25, 1192.0, 0.2440236793348095, 219.57293561333546, 0.12248844841610557], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 96.26315789473684, 87, 152, 93.0, 99.0, 152.0, 152.0, 0.11276298999970326, 0.08424188217751269, 0.04008371910145701], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 166, 17, 10.240963855421686, 184.03012048192767, 87, 3867, 96.5, 326.50000000000006, 435.1500000000003, 2252.30000000003, 0.6770591162339199, 1.495409871858405, 0.3233779386812846], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 130.42857142857142, 88, 298, 100.0, 298.0, 298.0, 298.0, 0.10925720707362375, 0.0846103175872887, 0.038837522826952194], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 13, 0, 0.0, 97.38461538461539, 90, 111, 95.0, 110.6, 111.0, 111.0, 0.2115162460747466, 0.17165039110167424, 0.07518741559688258], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e36ac567-22ed-4839-b604-4fce9bbdf447", 1, 0, 0.0, 1000.0, 1000, 1000, 1000.0, 1000.0, 1000.0, 1000.0, 1.0, 0.1806640625, 0.689453125], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fd0a8ebb-e556-4697-80d0-a73f349da881", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 1.2928580465587045, 2.4157072368421053], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 276.99999999999994, 177, 524, 181.0, 524.0, 524.0, 524.0, 0.10012873694750393, 0.15517998587469606, 0.22519187616220857], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7929e9a4-3b68-4c5e-a598-359f3fd78dbd", 3, 0, 0.0, 649.0, 201, 1197, 549.0, 1197.0, 1197.0, 1197.0, 0.01670155435799225, 0.023024440985057678, 0.010710306668373937], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 249.72222222222223, 177, 520, 182.5, 397.6000000000002, 520.0, 520.0, 0.08546440407570247, 0.1324531340509178, 0.19221144783822539], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/89d28b48-2337-4c17-a5de-93df5ec3068d", 3, 0, 0.0, 649.6666666666666, 207, 1128, 614.0, 1128.0, 1128.0, 1128.0, 0.10434782608695653, 0.04721467391304348, 0.06691576086956522], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1e061df2-875e-49a5-b008-cec7ec1a3c5b", 3, 0, 0.0, 432.33333333333337, 191, 863, 243.0, 863.0, 863.0, 863.0, 0.020089734145851468, 0.023745385639188373, 0.012883065191187303], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=68ef00d2-240a-4544-a047-148795940b9a", 1, 0, 0.0, 614.0, 614, 614, 614.0, 614.0, 614.0, 614.0, 1.6286644951140066, 0.2942411441368078, 1.1228878257328991], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 123.28571428571428, 90, 291, 93.5, 281.5, 291.0, 291.0, 0.08706251088281386, 0.07218366380811422, 0.03094800191537524], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 119.29411764705883, 88, 336, 93.0, 304.0, 336.0, 336.0, 0.09810654370646522, 0.07616670141273423, 0.03487381045815756], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c081009d-87c1-4faf-8a3e-92dd216d86ac", 1, 0, 0.0, 713.0, 713, 713, 713.0, 713.0, 713.0, 713.0, 1.402524544179523, 0.2533857819074334, 0.9669749298737729], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a53aff41-a210-4805-84f6-735c92db9375", 3, 0, 0.0, 560.3333333333334, 217, 946, 518.0, 946.0, 946.0, 946.0, 0.05287275290800141, 0.023923543796263658, 0.033906029696862884], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 100.10526315789473, 87, 259, 90.0, 122.0, 259.0, 259.0, 0.11139513613658217, 0.08278486191400296, 0.05591513669355785], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 89.63157894736842, 85, 103, 88.0, 99.0, 103.0, 103.0, 0.11139840172608892, 0.038613837440416514, 0.063039494397833], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 164.73684210526318, 86, 1020, 90.0, 263.0, 1020.0, 1020.0, 0.11139709546731082, 5.303986962509014, 0.06498545608316086], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 151.3157894736842, 86, 729, 91.0, 266.0, 729.0, 729.0, 0.11139578923916676, 1.7523423346505398, 0.06509347902241401], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 24.324324324324323, 0.703125], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 8.108108108108109, 0.234375], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 5.405405405405405, 0.15625], "isController": false}, {"data": ["401/Unauthorized", 23, 62.16216216216216, 1.796875], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1280, 37, "401/Unauthorized", 23, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 5, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 166, 17, "401/Unauthorized", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
