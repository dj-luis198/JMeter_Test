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

    var data = {"OkPercent": 97.31343283582089, "KoPercent": 2.6865671641791047};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7982062780269058, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.30357142857142855, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0b4e76f6-4e53-40f0-9982-f33e19b1bc2e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/409058cd-0568-43ee-861b-2dff0ec31062"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/536f1d64-c91f-4b47-b259-1435133c5c0d"], "isController": false}, {"data": [0.6, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ee37e4ba-0a76-493e-8813-bca5cbbadf62"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f0cfef0a-cb0c-4956-beb0-a17fa95c4bff"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/27481db9-a69c-4453-b3af-aa22aaf00b83"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b691ee8b-c015-4aea-a4c8-2ec6c3cc0f14"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8461538461538461, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b691ee8b-c015-4aea-a4c8-2ec6c3cc0f14"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2423ff09-4ccb-4c76-8b6c-b4249e7a4505"], "isController": false}, {"data": [0.7954545454545454, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ce6cad3b-bd8f-4b3b-b8b3-4663e5a73b7d"], "isController": false}, {"data": [0.022727272727272728, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=012200e4-4a84-4b77-be4d-f976dc0a4d5d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/490c0615-988c-48b9-aed5-aeff049795f5"], "isController": false}, {"data": [0.6944444444444444, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=afca2c00-8fc2-4388-a20f-6f62bee9cad1"], "isController": false}, {"data": [0.9565217391304348, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.26666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.925, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=536f1d64-c91f-4b47-b259-1435133c5c0d"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/afca2c00-8fc2-4388-a20f-6f62bee9cad1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fa1b90f3-5fe3-43d2-897b-7a8442855a7f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=409058cd-0568-43ee-861b-2dff0ec31062"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/f0cfef0a-cb0c-4956-beb0-a17fa95c4bff"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/909ab447-79f0-4171-957b-47f91d77bd15"], "isController": false}, {"data": [0.36363636363636365, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=27481db9-a69c-4453-b3af-aa22aaf00b83"], "isController": false}, {"data": [0.3360655737704918, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.7589285714285714, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9073033707865169, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/0b4e76f6-4e53-40f0-9982-f33e19b1bc2e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/012200e4-4a84-4b77-be4d-f976dc0a4d5d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/2423ff09-4ccb-4c76-8b6c-b4249e7a4505"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ce6cad3b-bd8f-4b3b-b8b3-4663e5a73b7d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=490c0615-988c-48b9-aed5-aeff049795f5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1340, 36, 2.6865671641791047, 313.57089552238887, 97, 2633, 110.0, 789.9000000000001, 946.9000000000001, 1452.2199999999953, 5.236011253516724, 732.613711224455, 3.8353355052360114], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1434.8928571428573, 1189, 1825, 1410.0, 1661.0000000000002, 1736.1499999999999, 1825.0, 0.24480125198354585, 294.57978761988704, 1.2036858434933138], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0b4e76f6-4e53-40f0-9982-f33e19b1bc2e", 1, 0, 0.0, 658.0, 658, 658, 658.0, 658.0, 658.0, 658.0, 1.5197568389057752, 0.2745654445288754, 1.0478011018237081], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/409058cd-0568-43ee-861b-2dff0ec31062", 3, 0, 0.0, 278.6666666666667, 191, 414, 231.0, 414.0, 414.0, 414.0, 0.02072954166983368, 0.02486600294704984, 0.013293358427595166], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/536f1d64-c91f-4b47-b259-1435133c5c0d", 3, 0, 0.0, 344.3333333333333, 276, 383, 374.0, 383.0, 383.0, 383.0, 0.025772531635782584, 0.02584803709955929, 0.016527307071123595], "isController": false}, {"data": ["deleteBook", 15, 4, 26.666666666666668, 450.9333333333333, 102, 1179, 420.0, 1055.4, 1179.0, 1179.0, 0.07691045572008696, 0.01623832082683867, 0.051293665911235076], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 4, 26.666666666666668, 450.9333333333333, 102, 1179, 420.0, 1055.4, 1179.0, 1179.0, 0.075389765085492, 0.015917253136214227, 0.05027947614165234], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ee37e4ba-0a76-493e-8813-bca5cbbadf62", 1, 0, 0.0, 236.0, 236, 236, 236.0, 236.0, 236.0, 236.0, 4.237288135593221, 1.3531183792372883, 2.5283037605932206], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 23, 0, 0.0, 143.04347826086956, 99, 304, 100.0, 296.6, 302.59999999999997, 304.0, 0.146662160524923, 0.03924358592170791, 0.08364326342437015], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 23, 0, 0.0, 119.00000000000001, 98, 301, 102.0, 219.20000000000027, 299.59999999999997, 301.0, 0.14665841978740904, 0.1089912670490413, 0.07361565211985181], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 23, 0, 0.0, 134.82608695652172, 98, 304, 100.0, 297.8, 303.0, 304.0, 0.1466612253226547, 0.03952978338774677, 0.08636398327105545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 23, 0, 0.0, 125.34782608695654, 98, 296, 100.0, 295.6, 296.0, 296.0, 0.14665935495389795, 0.03952927926491781, 0.08621965984594392], "isController": false}, {"data": ["goToProfile", 15, 4, 26.666666666666668, 289.40000000000003, 98, 1570, 207.0, 800.8000000000004, 1570.0, 1570.0, 0.07709505820676894, 0.12554548769048904, 0.04982067368231696], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 101.45, 99, 103, 101.5, 103.0, 103.0, 103.0, 0.09421829436621708, 0.07001965040301876, 0.047293167289292566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 130.35, 98, 300, 101.0, 296.9, 299.85, 300.0, 0.09421829436621708, 0.0393619007127614, 0.052942584549141906], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f0cfef0a-cb0c-4956-beb0-a17fa95c4bff", 1, 0, 0.0, 203.0, 203, 203, 203.0, 203.0, 203.0, 203.0, 4.926108374384237, 0.889970751231527, 3.3963208128078817], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 564.6249999999999, 489, 686, 495.0, 686.0, 686.0, 686.0, 0.05093724531377343, 14.977241397972696, 0.02905014771801141], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 762.0, 681, 901, 692.0, 901.0, 901.0, 901.0, 0.050867287247571086, 45.770474480517834, 0.02896057467317768], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 175.25, 100, 304, 103.0, 304.0, 304.0, 304.0, 0.05112703150064229, 0.0904708799601209, 0.028309596543812668], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 131.84615384615387, 99, 296, 101.0, 296.0, 296.0, 296.0, 0.07122507122507123, 0.05293191328347578, 0.035751647079772075], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 170.38461538461536, 98, 402, 101.0, 367.59999999999997, 402.0, 402.0, 0.07114165946129346, 0.027255293213085684, 0.04011337859949435], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 175.61538461538464, 98, 688, 101.0, 531.1999999999998, 688.0, 688.0, 0.07122585169681894, 4.947655205582463, 0.04140216649864671], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/27481db9-a69c-4453-b3af-aa22aaf00b83", 3, 0, 0.0, 281.6666666666667, 200, 415, 230.0, 415.0, 415.0, 415.0, 0.029263153787627536, 0.03458805709729023, 0.018765759427612713], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b691ee8b-c015-4aea-a4c8-2ec6c3cc0f14", 1, 0, 0.0, 381.0, 381, 381, 381.0, 381.0, 381.0, 381.0, 2.6246719160104988, 0.47418389107611547, 1.8095882545931758], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 259.61538461538464, 99, 779, 295.0, 592.9999999999998, 779.0, 779.0, 0.07114243810607884, 1.6267954059770593, 0.041423154879824], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 125.75000000000003, 98, 299, 101.0, 299.0, 299.0, 299.0, 0.05106241742249682, 0.037947753572773524, 0.02867274415814031], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 170.45, 99, 887, 101.0, 644.8000000000013, 877.8999999999999, 887.0, 0.09421873822265772, 8.500674032020239, 0.05458062061882867], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 528.2777777777779, 99, 904, 686.5, 903.1, 904.0, 904.0, 0.09816272107062808, 49.08230850430007, 0.05302235519635271], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 184.95000000000002, 98, 699, 101.0, 654.0000000000006, 698.15, 699.0, 0.09422006981707173, 2.793238620571068, 0.05467340379424221], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 421.3888888888889, 100, 789, 492.0, 789.0, 789.0, 789.0, 0.09826614840372101, 16.063721673417916, 0.05317418425448749], "isController": false}, {"data": ["deleteBooks", 14, 3, 21.428571428571427, 350.14285714285717, 101, 767, 362.5, 712.5, 767.0, 767.0, 0.07696113462701336, 0.015788413569897203, 0.051885418957176625], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 401.38461538461536, 200, 882, 401.0, 767.9999999999999, 882.0, 882.0, 0.071101971165416, 6.645000505917872, 0.15851060684165044], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b691ee8b-c015-4aea-a4c8-2ec6c3cc0f14", 3, 0, 0.0, 306.3333333333333, 207, 424, 288.0, 424.0, 424.0, 424.0, 0.037073652990608004, 0.030906779071922887, 0.023774445439940683], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2423ff09-4ccb-4c76-8b6c-b4249e7a4505", 1, 0, 0.0, 372.0, 372, 372, 372.0, 372.0, 372.0, 372.0, 2.688172043010753, 0.4856560819892473, 1.8533686155913978], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 465.0454545454545, 114, 1312, 383.0, 996.3, 1269.5499999999993, 1312.0, 0.09508045102708496, 0.05840390985941059, 0.042990477368691736], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 113.77777777777776, 100, 304, 102.0, 129.40000000000026, 304.0, 304.0, 0.0982666848642009, 0.0730282687320868, 0.04932526955097584], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 161.72222222222223, 98, 409, 100.5, 314.50000000000017, 409.0, 409.0, 0.09816165042454914, 0.10817379792878917, 0.05140279133559832], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ce6cad3b-bd8f-4b3b-b8b3-4663e5a73b7d", 1, 0, 0.0, 371.0, 371, 371, 371.0, 371.0, 371.0, 371.0, 2.6954177897574128, 0.48696512803234504, 1.858364218328841], "isController": false}, {"data": ["login", 22, 0, 0.0, 2396.7727272727275, 1186, 3959, 2208.0, 3843.7, 3947.6, 3959.0, 0.09225285669357375, 40.25643083656568, 0.1948170012579935], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=012200e4-4a84-4b77-be4d-f976dc0a4d5d", 1, 0, 0.0, 304.0, 304, 304, 304.0, 304.0, 304.0, 304.0, 3.289473684210526, 0.5942896792763158, 2.2679379111842106], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 124.39999999999999, 101, 312, 104.0, 281.10000000000036, 311.4, 312.0, 0.09577947733139221, 0.07754022139426185, 0.03404661108264333], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/490c0615-988c-48b9-aed5-aeff049795f5", 3, 0, 0.0, 844.6666666666666, 250, 1620, 664.0, 1620.0, 1620.0, 1620.0, 0.07643896348765511, 0.03458664038015644, 0.04901847593446633], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 645.1111111111111, 202, 1014, 802.0, 1005.9, 1014.0, 1014.0, 0.09810654370646522, 65.27287245059246, 0.20669865008121044], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=afca2c00-8fc2-4388-a20f-6f62bee9cad1", 1, 0, 0.0, 187.0, 187, 187, 187.0, 187.0, 187.0, 187.0, 5.347593582887701, 0.9661179812834224, 3.6869151069518717], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 23, 0, 0.0, 281.04347826086956, 201, 598, 206.0, 518.6000000000003, 596.6, 598.0, 0.14656216147326834, 0.22714272486140316, 0.32962173620404], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 15, 7, 46.666666666666664, 520.4666666666666, 98, 1182, 779.0, 1075.2, 1182.0, 1182.0, 0.09519457771685325, 60.75098556136243, 0.14380826701444419], "isController": false}, {"data": ["register", 24, 9, 37.5, 783.7083333333334, 107, 2633, 706.0, 1349.0, 2329.25, 2633.0, 0.09874755188360955, 0.03071396022942348, 0.044552118134987904], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 117.06666666666668, 101, 299, 104.0, 185.00000000000006, 299.0, 299.0, 0.07248863136631405, 0.056277794859589524, 0.025767443180994446], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 318.45, 200, 988, 206.5, 776.6000000000006, 978.9499999999998, 988.0, 0.09417126928745309, 11.39751009692578, 0.20938393155632148], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=536f1d64-c91f-4b47-b259-1435133c5c0d", 1, 0, 0.0, 411.0, 411, 411, 411.0, 411.0, 411.0, 411.0, 2.4330900243309004, 0.43957192822384433, 1.6775015206812653], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 12, 0, 0.0, 401.1666666666667, 200, 784, 402.0, 727.6000000000001, 784.0, 784.0, 0.10158472165786266, 10.271870410169477, 0.22630046961770284], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/afca2c00-8fc2-4388-a20f-6f62bee9cad1", 3, 0, 0.0, 359.6666666666667, 181, 453, 445.0, 453.0, 453.0, 453.0, 0.057008209182122224, 0.02579473006612952, 0.03655799872681666], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fa1b90f3-5fe3-43d2-897b-7a8442855a7f", 1, 0, 0.0, 177.0, 177, 177, 177.0, 177.0, 177.0, 177.0, 5.649717514124294, 1.804157838983051, 3.3710716807909606], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 99.71428571428571, 98, 102, 99.0, 102.0, 102.0, 102.0, 0.04451793436784533, 0.033084128958916305, 0.022345916274484862], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 156.85714285714286, 98, 307, 99.0, 307.0, 307.0, 307.0, 0.04451793436784533, 0.011912025407021113, 0.025389134444161788], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=409058cd-0568-43ee-861b-2dff0ec31062", 1, 0, 0.0, 382.0, 382, 382, 382.0, 382.0, 382.0, 382.0, 2.617801047120419, 0.47294257198952877, 1.804851112565445], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 156.2857142857143, 99, 297, 100.0, 297.0, 297.0, 297.0, 0.04451850061689922, 0.01199912711939862, 0.02617200915173177], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 184.7142857142857, 98, 303, 100.0, 303.0, 303.0, 303.0, 0.04446307659082536, 0.011984188612370899, 0.02618284685963642], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 170.66666666666669, 101, 305, 106.0, 305.0, 305.0, 305.0, 0.04131946835617382, 0.012186015081605949, 0.025542210419392603], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 926.3928571428569, 778, 1400, 808.0, 1236.5000000000002, 1314.5, 1400.0, 0.25099726592263905, 300.2799908117072, 0.49562155439021105], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 9, 37.5, 783.7083333333334, 107, 2633, 706.0, 1349.0, 2329.25, 2633.0, 0.09484516526770048, 0.02950018079859629, 0.0427914710485133], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 100.66666666666667, 99, 103, 101.0, 103.0, 103.0, 103.0, 0.04836343509358325, 0.013035457115067359, 0.028479640001397164], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 100.66666666666667, 99, 103, 100.0, 103.0, 103.0, 103.0, 0.04836343509358325, 0.013035457115067359, 0.028432410084313586], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f0cfef0a-cb0c-4956-beb0-a17fa95c4bff", 3, 0, 0.0, 807.6666666666666, 264, 1570, 589.0, 1570.0, 1570.0, 1570.0, 0.08011750567498999, 0.03625108492455602, 0.05137743690746428], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 114.33333333333333, 98, 294, 101.0, 184.20000000000005, 294.0, 294.0, 0.07290897071975735, 0.019651246014309603, 0.04286250036454486], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 167.33333333333334, 98, 303, 103.0, 301.8, 303.0, 303.0, 0.07283604121548785, 0.01963158923386196, 0.042890754739198414], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 101.53333333333333, 99, 104, 102.0, 104.0, 104.0, 104.0, 0.07290649013575189, 0.05418148339190155, 0.03659564055642233], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 122.88888888888889, 99, 299, 101.0, 299.0, 299.0, 299.0, 0.048311512633460556, 0.012927103966375187, 0.027552659548770474], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 166.00000000000003, 98, 302, 101.0, 299.6, 302.0, 302.0, 0.07283674856754395, 0.019489520612799845, 0.04153970816742741], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 101.22222222222223, 99, 103, 101.0, 103.0, 103.0, 103.0, 0.04836239555065961, 0.03594119434966012, 0.024275655579139688], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 106.11111111111111, 101, 117, 105.0, 117.0, 117.0, 117.0, 0.050138158481148054, 0.03946421458574739, 0.0178225485225956], "isController": false}, {"data": ["deleteAccount", 14, 3, 21.428571428571427, 388.07142857142856, 99, 664, 414.5, 645.5, 664.0, 664.0, 0.0779774867856009, 0.015540016723386006, 0.05306015510557595], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/909ab447-79f0-4171-957b-47f91d77bd15", 1, 0, 0.0, 257.0, 257, 257, 257.0, 257.0, 257.0, 257.0, 3.8910505836575875, 1.2425522859922178, 2.321710846303502], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1262.9090909090905, 778, 2459, 1078.5, 2113.5, 2407.8499999999995, 2459.0, 0.09469207857720849, 0.049010548482344235, 0.043554657236196476], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 225.33333333333334, 200, 398, 205.0, 398.0, 398.0, 398.0, 0.04828481603485091, 0.07483203422588709, 0.10859368293775551], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=27481db9-a69c-4453-b3af-aa22aaf00b83", 1, 0, 0.0, 767.0, 767, 767, 767.0, 767.0, 767.0, 767.0, 1.303780964797914, 0.23554636571056062, 0.8988958604954368], "isController": false}, {"data": ["addBook", 61, 13, 21.311475409836067, 987.0655737704919, 512, 3280, 827.0, 1548.2000000000003, 2069.7999999999993, 3280.0, 0.29651809975646626, 82.57636499342556, 1.0794589896631845], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 175.26785714285714, 99, 479, 103.0, 402.6, 409.45, 479.0, 0.25177025963808025, 0.1871066089693155, 0.12170535011801731], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 564.9107142857144, 485, 811, 499.0, 696.1, 719.8499999999999, 811.0, 0.2517227274157516, 74.01483984141468, 0.12659883263585162], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 183.3214285714285, 97, 514, 104.0, 305.0, 327.14999999999986, 514.0, 0.25194243115448123, 0.4458200051288281, 0.12252669015130042], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 744.5178571428573, 677, 1124, 693.5, 901.1, 923.1999999999998, 1124.0, 0.251504536063954, 226.30422364816312, 0.12624348782897693], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 12, 0, 0.0, 121.75, 102, 305, 104.0, 248.3000000000002, 305.0, 305.0, 0.10577160385008638, 0.07901882514191023, 0.03759849980608539], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 13, 7.303370786516854, 177.3764044943821, 99, 2082, 106.0, 298.69999999999993, 384.5999999999998, 1696.4800000000039, 0.7663396089945883, 1.6282152023158094, 0.36895061253352734], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 132.42857142857142, 101, 304, 103.0, 304.0, 304.0, 304.0, 0.04409837717971979, 0.034150403421404095, 0.01567559501310352], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0b4e76f6-4e53-40f0-9982-f33e19b1bc2e", 3, 0, 0.0, 597.0, 202, 962, 627.0, 962.0, 962.0, 962.0, 0.038454636347322275, 0.03205804807470454, 0.024660036980541956], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 23, 0, 0.0, 136.3913043478261, 100, 416, 104.0, 313.6, 396.39999999999975, 416.0, 0.14100049043648846, 0.114425202688205, 0.05012126808484551], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/012200e4-4a84-4b77-be4d-f976dc0a4d5d", 3, 0, 0.0, 304.6666666666667, 207, 418, 289.0, 418.0, 418.0, 418.0, 0.07741136398823346, 0.035026626283738455, 0.04964205307839191], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 315.2857142857143, 199, 406, 395.0, 406.0, 406.0, 406.0, 0.04443428803575056, 0.06886446788353139, 0.09993375522102885], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2423ff09-4ccb-4c76-8b6c-b4249e7a4505", 3, 0, 0.0, 941.6666666666667, 287, 2154, 384.0, 2154.0, 2154.0, 2154.0, 0.017097719164263486, 0.02357058615255725, 0.010964357667187197], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 295.8666666666666, 201, 404, 216.0, 403.4, 404.0, 404.0, 0.07279892451722181, 0.11282411446174902, 0.1637264874640252], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ce6cad3b-bd8f-4b3b-b8b3-4663e5a73b7d", 3, 0, 0.0, 270.6666666666667, 182, 368, 262.0, 368.0, 368.0, 368.0, 0.017921039898208493, 0.02470560025029719, 0.011492333528473545], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 103.23076923076925, 101, 109, 103.0, 107.4, 109.0, 109.0, 0.07283933323994958, 0.06039120500070038, 0.025892106737638327], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 105.44444444444444, 100, 112, 104.5, 111.1, 112.0, 112.0, 0.09949863742143754, 0.0772474772949637, 0.03536865627090162], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=490c0615-988c-48b9-aed5-aeff049795f5", 1, 0, 0.0, 354.0, 354, 354, 354.0, 354.0, 354.0, 354.0, 2.824858757062147, 0.510350459039548, 1.947607697740113], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 12, 0, 0.0, 118.74999999999999, 98, 296, 101.5, 242.6000000000002, 296.0, 296.0, 0.10183904339191907, 0.07568311720825235, 0.05111842607758438], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 12, 0, 0.0, 199.33333333333334, 98, 302, 198.0, 302.0, 302.0, 302.0, 0.10184077195305141, 0.03999703494835824, 0.05736831245597508], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 12, 0, 0.0, 198.00000000000003, 99, 676, 101.5, 563.2000000000004, 676.0, 676.0, 0.10184336490477645, 7.6617323688978844, 0.05914341243168007], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 12, 0, 0.0, 197.83333333333331, 99, 685, 101.0, 569.5000000000005, 685.0, 685.0, 0.10167509722681171, 2.516442107682401, 0.05914498657041424], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 25.0, 0.6716417910447762], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 11.11111111111111, 0.29850746268656714], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 8.333333333333334, 0.22388059701492538], "isController": false}, {"data": ["401/Unauthorized", 20, 55.55555555555556, 1.492537313432836], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1340, 36, "401/Unauthorized", 20, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 15, 7, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
