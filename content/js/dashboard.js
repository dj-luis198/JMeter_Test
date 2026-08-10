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

    var data = {"OkPercent": 98.34586466165413, "KoPercent": 1.6541353383458646};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7967741935483871, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1fada633-189d-469b-9db7-8baca5c3b509"], "isController": false}, {"data": [0.4, 500, 1500, "see books"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/36513436-3f00-4795-8122-6097999575bd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c890f4ff-98c2-4268-aef2-6e868b2bc423"], "isController": false}, {"data": [0.6, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a0cb15e7-0f61-4dce-8d41-600fd0fe97e3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7916a7fa-d7db-4d04-908a-2eeedf6ddaa7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a62b0997-7737-4c41-9da9-b98e068652aa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f65d296c-ec40-4b2f-a833-e8eb522be6ce"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9660973a-56d3-4c81-b6eb-b490c077fe10"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9dde56a4-a3f7-4d2f-9351-b1c998755479"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9660973a-56d3-4c81-b6eb-b490c077fe10"], "isController": false}, {"data": [0.6363636363636364, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a99dfa74-1030-49fb-bedd-e8abd4ffc07f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c2432b3b-106c-442a-8dad-8fe47e931578"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a19ed159-0521-48e1-89bd-712eb72aa3c3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2a613c6b-2a5b-4ca1-89c1-f13c4866fe5a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a6a28322-a1ac-40d1-ac53-b0198b5a4d59"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2777777777777778, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.21739130434782608, 500, 1500, "register"], "isController": true}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4818181818181818, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=36513436-3f00-4795-8122-6097999575bd"], "isController": false}, {"data": [0.21739130434782608, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.13636363636363635, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c890f4ff-98c2-4268-aef2-6e868b2bc423"], "isController": false}, {"data": [0.38095238095238093, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=555beacf-be5b-41d1-9b6e-b2e31bf85ace"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7916a7fa-d7db-4d04-908a-2eeedf6ddaa7"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9dde56a4-a3f7-4d2f-9351-b1c998755479"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1fada633-189d-469b-9db7-8baca5c3b509"], "isController": false}, {"data": [0.7818181818181819, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5d0c39bb-1cd8-4616-890a-54a03f25a45a"], "isController": false}, {"data": [0.9818181818181818, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4818181818181818, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a0cb15e7-0f61-4dce-8d41-600fd0fe97e3"], "isController": false}, {"data": [0.925414364640884, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/555beacf-be5b-41d1-9b6e-b2e31bf85ace"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2a613c6b-2a5b-4ca1-89c1-f13c4866fe5a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a19ed159-0521-48e1-89bd-712eb72aa3c3"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a99dfa74-1030-49fb-bedd-e8abd4ffc07f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1636b3e9-913c-46c3-9eb1-181427221835"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c2432b3b-106c-442a-8dad-8fe47e931578"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1330, 22, 1.6541353383458646, 334.0323308270675, 77, 3492, 98.0, 879.6000000000004, 1163.9500000000005, 2197.420000000001, 5.265825190440745, 732.8708110335865, 3.841200479467241], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/1fada633-189d-469b-9db7-8baca5c3b509", 2, 0, 0.0, 254.0, 229, 279, 254.0, 279.0, 279.0, 279.0, 0.0233029618064456, 0.03317941241581805, 0.014484702333791627], "isController": false}, {"data": ["see books", 55, 0, 0.0, 1401.327272727273, 970, 3825, 1316.0, 1661.6, 2020.3999999999965, 3825.0, 0.2486842343238502, 299.25256169488483, 1.2227784373247907], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/36513436-3f00-4795-8122-6097999575bd", 3, 0, 0.0, 749.6666666666667, 267, 1698, 284.0, 1698.0, 1698.0, 1698.0, 0.0336726791105923, 0.033771329537674116, 0.021593482372352486], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c890f4ff-98c2-4268-aef2-6e868b2bc423", 3, 0, 0.0, 349.6666666666667, 272, 435, 342.0, 435.0, 435.0, 435.0, 0.025387583779026474, 0.03000726455131677, 0.01628044923329497], "isController": false}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 631.5999999999999, 86, 1482, 517.0, 1332.0, 1482.0, 1482.0, 0.0916371900372047, 0.01795158234517897, 0.06169998823989395], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 631.5999999999999, 86, 1482, 517.0, 1332.0, 1482.0, 1482.0, 0.09486705962710922, 0.018584308751170026, 0.06387468298590908], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 101.70588235294117, 78, 246, 81.0, 246.0, 246.0, 246.0, 0.1602866302093155, 0.07121190246087121, 0.08982975438431076], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 94.17647058823529, 80, 243, 82.0, 142.99999999999991, 243.0, 243.0, 0.16029872138196358, 0.11912824899577565, 0.08046244413118092], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 171.0, 77, 723, 83.0, 520.5999999999998, 723.0, 723.0, 0.1603017444601603, 5.583303866100896, 0.09277573962753419], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 204.64705882352942, 80, 893, 82.0, 861.0, 893.0, 893.0, 0.16029872138196358, 17.007189721787423, 0.09261744828008901], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 235.6, 81, 397, 209.0, 364.0, 397.0, 397.0, 0.09196360693528215, 0.18056838682038895, 0.05944106052431518], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a0cb15e7-0f61-4dce-8d41-600fd0fe97e3", 3, 0, 0.0, 750.6666666666666, 180, 1601, 471.0, 1601.0, 1601.0, 1601.0, 0.01821261405649553, 0.02510755876603469, 0.011679313050552146], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7916a7fa-d7db-4d04-908a-2eeedf6ddaa7", 3, 0, 0.0, 351.66666666666663, 180, 681, 194.0, 681.0, 681.0, 681.0, 0.03359612972585558, 0.02800771101169145, 0.0215443930859165], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a62b0997-7737-4c41-9da9-b98e068652aa", 1, 0, 0.0, 189.0, 189, 189, 189.0, 189.0, 189.0, 189.0, 5.291005291005291, 1.6896081349206349, 3.1570353835978837], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 21, 0, 0.0, 97.76190476190476, 80, 246, 82.0, 212.6000000000001, 245.8, 246.0, 0.1220440637186245, 0.09069876219714185, 0.0612603991712627], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 21, 0, 0.0, 96.42857142857142, 77, 245, 81.0, 204.6000000000001, 243.89999999999998, 245.0, 0.12203980822315852, 0.041383662647101555, 0.0691127596978062], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 579.0, 470, 648, 643.0, 648.0, 648.0, 648.0, 0.06858710562414266, 20.16688635973937, 0.039116083676268856], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 845.4, 701, 1119, 798.0, 1119.0, 1119.0, 1119.0, 0.067981889624604, 61.170223783634036, 0.03870453286244544], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 149.4, 85, 245, 91.0, 245.0, 245.0, 245.0, 0.06879944960440317, 0.12174277605779155, 0.03809500773993808], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 82.58823529411767, 79, 89, 83.0, 85.0, 89.0, 89.0, 0.0784364388011221, 0.05829114250747453, 0.03937141557009449], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 127.41176470588235, 79, 245, 82.0, 241.8, 245.0, 245.0, 0.07838038461715792, 0.020972876352637962, 0.04470131310197288], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 109.05882352941177, 77, 245, 82.0, 238.6, 245.0, 245.0, 0.07838146877651138, 0.021126255256169083, 0.04607973066744126], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 127.82352941176471, 79, 242, 82.0, 242.0, 242.0, 242.0, 0.07843788642194045, 0.02114146157466364, 0.04618949757073252], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 82.2, 81, 84, 82.0, 84.0, 84.0, 84.0, 0.0689541041482789, 0.051244212164883056, 0.03871934559107458], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 623.5, 79, 1124, 798.0, 1097.4, 1124.0, 1124.0, 0.07612522599676468, 42.818701901346465, 0.04066454943381863], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 21, 0, 0.0, 148.95238095238096, 79, 841, 83.0, 244.8, 781.3999999999992, 841.0, 0.1220348438535117, 5.2602386235196015, 0.07124374208226311], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 451.0625, 79, 736, 629.5, 732.5, 736.0, 736.0, 0.07618430888928039, 14.008148001114195, 0.04077050905402896], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 21, 0, 0.0, 131.66666666666669, 79, 635, 82.0, 247.6, 596.2999999999995, 635.0, 0.12192572981258273, 1.7384508936865697, 0.07129910957929818], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 664.7857142857142, 86, 1973, 568.5, 1815.5, 1973.0, 1973.0, 0.08825179497847287, 0.01738442166707641, 0.05994670615934492], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f65d296c-ec40-4b2f-a833-e8eb522be6ce", 1, 0, 0.0, 285.0, 285, 285, 285.0, 285.0, 285.0, 285.0, 3.5087719298245617, 1.1204769736842106, 2.0936129385964914], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9660973a-56d3-4c81-b6eb-b490c077fe10", 3, 0, 0.0, 606.0, 197, 1183, 438.0, 1183.0, 1183.0, 1183.0, 0.017345151162992387, 0.0239116911377841, 0.011123029879913737], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9dde56a4-a3f7-4d2f-9351-b1c998755479", 1, 0, 0.0, 589.0, 589, 589, 589.0, 589.0, 589.0, 589.0, 1.697792869269949, 0.30673015704584045, 1.1705485993208828], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 231.47058823529412, 161, 328, 168.0, 328.0, 328.0, 328.0, 0.07834931813049309, 0.12142614050106693, 0.17620945278762265], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9660973a-56d3-4c81-b6eb-b490c077fe10", 1, 0, 0.0, 549.0, 549, 549, 549.0, 549.0, 549.0, 549.0, 1.8214936247723132, 0.3290784380692167, 1.2558344717668488], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 792.8181818181818, 151, 3036, 746.5, 1371.6, 2797.4999999999964, 3036.0, 0.10378778229097377, 0.06375245611427978, 0.04692748359445396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 82.0, 78, 85, 82.0, 85.0, 85.0, 85.0, 0.07618249516717297, 0.05661609259982288, 0.038240041519459866], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 132.37500000000003, 78, 251, 82.5, 248.9, 251.0, 251.0, 0.07612341508670932, 0.0918275864119704, 0.03941839926731213], "isController": false}, {"data": ["login", 22, 0, 0.0, 3244.6363636363635, 1828, 6505, 3221.5, 4012.6, 6131.4999999999945, 6505.0, 0.1045473338053804, 28.570255251424456, 0.19714003640148076], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 21, 0, 0.0, 98.09523809523809, 84, 246, 88.0, 111.0, 232.5999999999998, 246.0, 0.11679124399359317, 0.09455072389715698, 0.041515637513347574], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a99dfa74-1030-49fb-bedd-e8abd4ffc07f", 1, 0, 0.0, 649.0, 649, 649, 649.0, 649.0, 649.0, 649.0, 1.5408320493066257, 0.2783729776579353, 1.062331471494607], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c2432b3b-106c-442a-8dad-8fe47e931578", 3, 0, 0.0, 308.6666666666667, 258, 396, 272.0, 396.0, 396.0, 396.0, 0.019483049746720355, 0.023028305218210157, 0.012494013021171582], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 707.125, 165, 1203, 880.0, 1179.9, 1203.0, 1203.0, 0.07609336656077006, 56.940549159287194, 0.1589675140772728], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a19ed159-0521-48e1-89bd-712eb72aa3c3", 3, 0, 0.0, 748.3333333333334, 209, 1478, 558.0, 1478.0, 1478.0, 1478.0, 0.07729369025841858, 0.03497338198541725, 0.04956659173472805], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2a613c6b-2a5b-4ca1-89c1-f13c4866fe5a", 3, 0, 0.0, 386.0, 186, 632, 340.0, 632.0, 632.0, 632.0, 0.038729666924864445, 0.024899444067906017, 0.024836407500645495], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a6a28322-a1ac-40d1-ac53-b0198b5a4d59", 1, 0, 0.0, 390.0, 390, 390, 390.0, 390.0, 390.0, 390.0, 2.5641025641025643, 0.8188100961538461, 1.5299479166666665], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 329.4117647058824, 164, 974, 177.0, 945.1999999999999, 974.0, 974.0, 0.1601628007763185, 22.761417561497804, 0.35538881580806847], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, 44.44444444444444, 552.0, 81, 1202, 783.0, 1202.0, 1202.0, 1202.0, 0.12223112547704092, 81.25393643641944, 0.18911606100012224], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 1219.4347826086957, 85, 2240, 1232.0, 2087.0, 2221.7999999999997, 2240.0, 0.09638190702079336, 0.030364884090280514, 0.043484805706647], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 21, 0, 0.0, 263.6190476190476, 162, 924, 166.0, 490.8, 880.6999999999994, 924.0, 0.12186841692926408, 7.122592373358403, 0.27260010801313855], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 111.19999999999999, 83, 248, 88.0, 245.0, 248.0, 248.0, 0.09666817039376169, 0.07504999556937553, 0.034362513694657475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 13, 0, 0.0, 328.1538461538462, 163, 1034, 326.0, 781.9999999999998, 1034.0, 1034.0, 0.08203445447087777, 7.6667212248375085, 0.18288285046065503], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 113.63636363636364, 81, 248, 83.0, 247.8, 248.0, 248.0, 0.05363002111072649, 0.03985590436060826, 0.02691975669034513], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 125.45454545454545, 80, 247, 83.0, 246.0, 247.0, 247.0, 0.053588218386604894, 0.02897303355596802, 0.029743744793417418], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 241.90909090909093, 80, 807, 82.0, 805.6, 807.0, 807.0, 0.053441641727233855, 8.754854915052082, 0.030582814504061567], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 195.45454545454544, 81, 623, 82.0, 591.8000000000001, 623.0, 623.0, 0.0535300644307321, 2.8735531675199035, 0.030685691231288812], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 90.0, 86, 94, 90.0, 94.0, 94.0, 94.0, 1.092896174863388, 0.32231898907103823, 0.6755891393442622], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 990.6545454545454, 625, 3492, 888.0, 1315.6, 1662.5999999999965, 3492.0, 0.25771505149615304, 308.31679783777076, 0.5088865567629115], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=36513436-3f00-4795-8122-6097999575bd", 1, 0, 0.0, 461.0, 461, 461, 461.0, 461.0, 461.0, 461.0, 2.1691973969631237, 0.3918960140997831, 1.495559924078091], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 1219.4347826086957, 85, 2240, 1232.0, 2087.0, 2221.7999999999997, 2240.0, 0.0947804801661543, 0.02986035847625955, 0.042762286949964146], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 81.5, 81, 82, 81.5, 82.0, 82.0, 82.0, 0.037759894272296035, 0.010177471503079792, 0.022235562740424326], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 80.75, 79, 83, 80.5, 83.0, 83.0, 83.0, 0.03775971604693533, 0.010177423465775536, 0.02219858306665534], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 135.26666666666665, 79, 727, 82.0, 431.8000000000002, 727.0, 727.0, 0.09419862093218956, 5.6743691537980885, 0.05483880653487233], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 144.46666666666667, 78, 720, 82.0, 430.8000000000002, 720.0, 720.0, 0.09419980406440755, 1.870221813063629, 0.05493148730500641], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 81.0, 79, 84, 80.5, 84.0, 84.0, 84.0, 0.037759894272296035, 0.010103721709579213, 0.021534939702168833], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 83.66666666666667, 80, 89, 83.0, 88.4, 89.0, 89.0, 0.09419448020346007, 0.07000195257307922, 0.04728121369587742], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 82.75, 80, 84, 83.0, 84.0, 84.0, 84.0, 0.03775953782325704, 0.028061531526854113, 0.01895351800893957], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 113.86666666666667, 79, 249, 83.0, 241.20000000000002, 249.0, 249.0, 0.09419802937722543, 0.03463740038558393, 0.05319490278763368], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 109.0, 85, 244, 86.5, 244.0, 244.0, 244.0, 0.038748988893571056, 0.03049969242990066, 0.013774054645761587], "isController": false}, {"data": ["deleteAccount", 13, 2, 15.384615384615385, 540.6923076923077, 81, 1698, 471.0, 1291.1999999999996, 1698.0, 1698.0, 0.09935647574937712, 0.019278679151189984, 0.06761345506412314], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1868.9545454545455, 1239, 3184, 1682.5, 3014.8999999999996, 3182.8, 3184.0, 0.1007842849813091, 0.05216374125009162, 0.0463568342052701], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 165.75, 162, 168, 166.5, 168.0, 168.0, 168.0, 0.0377447511205473, 0.05849699221514509, 0.08488882991271526], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c890f4ff-98c2-4268-aef2-6e868b2bc423", 1, 0, 0.0, 441.0, 441, 441, 441.0, 441.0, 441.0, 441.0, 2.2675736961451247, 0.4096690759637188, 1.5633857709750567], "isController": false}, {"data": ["addBook", 63, 8, 12.698412698412698, 990.5396825396828, 428, 3279, 730.0, 1654.6000000000001, 2609.399999999998, 3279.0, 0.29554847698709436, 96.57618231118909, 1.0734477181194673], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=555beacf-be5b-41d1-9b6e-b2e31bf85ace", 1, 0, 0.0, 604.0, 604, 604, 604.0, 604.0, 604.0, 604.0, 1.6556291390728477, 0.29911268625827814, 1.1414786837748345], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7916a7fa-d7db-4d04-908a-2eeedf6ddaa7", 1, 0, 0.0, 1973.0, 1973, 1973, 1973.0, 1973.0, 1973.0, 1973.0, 0.5068423720223011, 0.09156820197668525, 0.349444057273188], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9dde56a4-a3f7-4d2f-9351-b1c998755479", 3, 0, 0.0, 428.6666666666667, 337, 552, 397.0, 552.0, 552.0, 552.0, 0.02601501933783104, 0.026091235214797344, 0.016682808624846078], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 143.69090909090914, 82, 336, 85.0, 333.2, 336.0, 336.0, 0.25876020926643833, 0.19230128833179647, 0.1250842808465693], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1fada633-189d-469b-9db7-8baca5c3b509", 1, 0, 0.0, 1010.0, 1010, 1010, 1010.0, 1010.0, 1010.0, 1010.0, 0.9900990099009901, 0.1788753094059406, 0.6826268564356436], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 577.1090909090912, 390, 3171, 486.0, 676.8, 722.0, 3171.0, 0.2587249095638839, 76.07371388729473, 0.13012043791542988], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5d0c39bb-1cd8-4616-890a-54a03f25a45a", 2, 0, 0.0, 246.5, 179, 314, 246.5, 314.0, 314.0, 314.0, 0.058460729005290694, 0.03354070145567215, 0.03633813868346438], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 157.47272727272727, 78, 1620, 88.0, 245.4, 272.39999999999975, 1620.0, 0.2591149575287029, 0.4585120146894625, 0.1260148914543887], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 840.9272727272728, 541, 3407, 753.0, 1075.1999999999998, 1353.5999999999954, 3407.0, 0.2581638448576109, 232.29628140651184, 0.12958614868829296], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 13, 0, 0.0, 90.15384615384617, 82, 111, 87.0, 110.6, 111.0, 111.0, 0.08254492348720553, 0.061666861784875224, 0.02934214077084259], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a0cb15e7-0f61-4dce-8d41-600fd0fe97e3", 1, 0, 0.0, 402.0, 402, 402, 402.0, 402.0, 402.0, 402.0, 2.487562189054726, 0.4494130907960199, 1.7150575248756217], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 181, 8, 4.419889502762431, 184.29281767955806, 81, 2185, 90.0, 325.2000000000001, 469.9000000000001, 2095.620000000001, 0.7645163061613256, 1.6190616011125614, 0.37030433609572927], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 105.09090909090908, 84, 248, 89.0, 219.4000000000001, 248.0, 248.0, 0.055098902530041426, 0.04266936494758091, 0.019585938008725663], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 99.17647058823529, 84, 269, 87.0, 132.19999999999987, 269.0, 269.0, 0.14978501444984846, 0.12155404981232819, 0.05324389185521957], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/555beacf-be5b-41d1-9b6e-b2e31bf85ace", 3, 0, 0.0, 400.0, 193, 563, 444.0, 563.0, 563.0, 563.0, 0.061666221299512845, 0.039645438498221955, 0.03954507029949228], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2a613c6b-2a5b-4ca1-89c1-f13c4866fe5a", 1, 0, 0.0, 1658.0, 1658, 1658, 1658.0, 1658.0, 1658.0, 1658.0, 0.6031363088057901, 0.10896505579010857, 0.41583421290711703], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a19ed159-0521-48e1-89bd-712eb72aa3c3", 1, 0, 0.0, 203.0, 203, 203, 203.0, 203.0, 203.0, 203.0, 4.926108374384237, 0.889970751231527, 3.3963208128078817], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 372.4545454545455, 166, 891, 168.0, 889.4, 891.0, 891.0, 0.05341958167611222, 11.687444721356178, 0.11765681834185618], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 251.13333333333335, 163, 810, 172.0, 517.2000000000002, 810.0, 810.0, 0.09414481983819643, 7.644841314983461, 0.21012805068443283], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a99dfa74-1030-49fb-bedd-e8abd4ffc07f", 3, 0, 0.0, 321.6666666666667, 200, 560, 205.0, 560.0, 560.0, 560.0, 0.04925946602738826, 0.032246349668319595, 0.031588915388657185], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1636b3e9-913c-46c3-9eb1-181427221835", 1, 0, 0.0, 350.0, 350, 350, 350.0, 350.0, 350.0, 350.0, 2.857142857142857, 0.9123883928571429, 1.7047991071428572], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 91.11764705882354, 82, 125, 87.0, 108.99999999999999, 125.0, 125.0, 0.07716749886518384, 0.06397969388334089, 0.027430634362233315], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 101.875, 81, 249, 86.5, 176.90000000000006, 249.0, 249.0, 0.07854726827328558, 0.060981521755138705, 0.02792109926901948], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 13, 0, 0.0, 84.23076923076924, 80, 94, 83.0, 92.4, 94.0, 94.0, 0.08253025051105271, 0.061333516248936626, 0.041426317151055755], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 13, 0, 0.0, 148.84615384615384, 79, 323, 87.0, 291.4, 323.0, 323.0, 0.08253077445609046, 0.03161861100706591, 0.04653515572922288], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c2432b3b-106c-442a-8dad-8fe47e931578", 1, 0, 0.0, 588.0, 588, 588, 588.0, 588.0, 588.0, 588.0, 1.7006802721088434, 0.30725180697278914, 1.1725393282312926], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 13, 0, 0.0, 198.46153846153845, 78, 952, 88.0, 670.3999999999997, 952.0, 952.0, 0.08207692501957219, 5.701417612524307, 0.047709678921382934], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 13, 0, 0.0, 188.61538461538458, 82, 570, 89.0, 469.9999999999999, 570.0, 570.0, 0.08227587734565361, 1.8813808305116928, 0.04790567347552293], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 27.272727272727273, 0.45112781954887216], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 9.090909090909092, 0.15037593984962405], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 9.090909090909092, 0.15037593984962405], "isController": false}, {"data": ["401/Unauthorized", 12, 54.54545454545455, 0.9022556390977443], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1330, 22, "401/Unauthorized", 12, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 181, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
