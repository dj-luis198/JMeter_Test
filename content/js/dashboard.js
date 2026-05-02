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

    var data = {"OkPercent": 98.18319454958365, "KoPercent": 1.8168054504163513};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7576348278102664, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.02631578947368421, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=beb88270-d0de-483e-ad28-7f7b7131316a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c55118e1-d9b8-49db-abc4-d34388257fda"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b740ad37-885d-4f57-86b6-93aa21d38659"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e004850d-47e0-4571-b4f8-6328af8fd3d2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ead0de51-bcdd-4b47-888d-92a34f9f8bdd"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/84b92f89-5f36-47e0-8649-c1355755496f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1152c531-1a49-43d8-95b6-65dad65a4f5a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/e56c577b-4fc9-4066-95de-1aac7cce0c61"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3fbc0519-2714-4f81-bb3f-bffb68ddf7bd"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5869565217391305, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d31a186a-7172-4ecf-bf14-f80f020814dd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/87666251-313c-49d0-babf-0473205d2c61"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=97ef5562-0076-46cd-a158-4c9597ba685a"], "isController": false}, {"data": [0.6842105263157895, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/92732275-bc72-4d03-abd3-477dcc1fec49"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/03a6f260-aa25-4dcd-b89c-0efdec7fc908"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.15, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/93e496fe-aa85-4e25-9631-7135c8898f46"], "isController": false}, {"data": [0.20833333333333334, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1152c531-1a49-43d8-95b6-65dad65a4f5a"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/865c8b96-47b1-4fe3-a43c-a75001712d5f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=84b92f89-5f36-47e0-8649-c1355755496f"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.37719298245614036, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.20833333333333334, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.1956521739130435, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.2672413793103448, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/beb88270-d0de-483e-ad28-7f7b7131316a"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c55118e1-d9b8-49db-abc4-d34388257fda"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3fbc0519-2714-4f81-bb3f-bffb68ddf7bd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.49122807017543857, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.930635838150289, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ead0de51-bcdd-4b47-888d-92a34f9f8bdd"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/97ef5562-0076-46cd-a158-4c9597ba685a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e004850d-47e0-4571-b4f8-6328af8fd3d2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e9916adb-32fb-40af-9094-f537df89c50c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=03a6f260-aa25-4dcd-b89c-0efdec7fc908"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=92732275-bc72-4d03-abd3-477dcc1fec49"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d31a186a-7172-4ecf-bf14-f80f020814dd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=93e496fe-aa85-4e25-9631-7135c8898f46"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1321, 24, 1.8168054504163513, 408.49735049205157, 105, 5797, 136.0, 1130.8, 1355.8999999999999, 1835.5999999999995, 5.111516971319785, 734.7227650172578, 3.731498381127243], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1872.842105263158, 1370, 2529, 1846.0, 2300.6, 2377.7999999999997, 2529.0, 0.265158211065936, 319.0750723006778, 1.3037808522626833], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=beb88270-d0de-483e-ad28-7f7b7131316a", 1, 0, 0.0, 208.0, 208, 208, 208.0, 208.0, 208.0, 208.0, 4.807692307692308, 0.8685772235576924, 3.3146784855769234], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c55118e1-d9b8-49db-abc4-d34388257fda", 1, 0, 0.0, 215.0, 215, 215, 215.0, 215.0, 215.0, 215.0, 4.651162790697675, 0.8402979651162791, 3.2067587209302326], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 611.1428571428572, 123, 1663, 558.0, 1316.5, 1663.0, 1663.0, 0.10334391378164907, 0.020357366944711006, 0.06953511386284786], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 611.1428571428572, 123, 1663, 558.0, 1316.5, 1663.0, 1663.0, 0.10364151879242825, 0.020415991146053112, 0.06973535785935847], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 21, 0, 0.0, 131.76190476190476, 106, 324, 112.0, 280.0000000000001, 323.7, 324.0, 0.10344216105451894, 0.0276788595009162, 0.058994357476405336], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b740ad37-885d-4f57-86b6-93aa21d38659", 1, 0, 0.0, 276.0, 276, 276, 276.0, 276.0, 276.0, 276.0, 3.6231884057971016, 1.1570142663043477, 2.1618829257246377], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 21, 0, 0.0, 123.85714285714285, 108, 318, 115.0, 128.20000000000002, 299.2999999999997, 318.0, 0.1034416515198534, 0.07687411797520356, 0.05192286023555142], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 21, 0, 0.0, 156.28571428571428, 107, 340, 115.0, 338.8, 340.0, 340.0, 0.10332865894161931, 0.027850302605358326, 0.06084685677909808], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e004850d-47e0-4571-b4f8-6328af8fd3d2", 3, 0, 0.0, 345.6666666666667, 241, 550, 246.0, 550.0, 550.0, 550.0, 0.019818462880019025, 0.02342475218663707, 0.012709105427616368], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 21, 0, 0.0, 144.7142857142857, 108, 339, 115.0, 324.8, 337.59999999999997, 339.0, 0.1034401229459747, 0.027880345637782245, 0.06081147852878591], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ead0de51-bcdd-4b47-888d-92a34f9f8bdd", 1, 0, 0.0, 657.0, 657, 657, 657.0, 657.0, 657.0, 657.0, 1.5220700152207, 0.2749833523592085, 1.0493959284627092], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 241.42857142857144, 108, 368, 245.0, 345.5, 368.0, 368.0, 0.10316343298429705, 0.18563085360371978, 0.06667915527570428], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 129.53333333333333, 110, 344, 115.0, 208.4000000000001, 344.0, 344.0, 0.08907204741008176, 0.06619514460846897, 0.0447099925476387], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/84b92f89-5f36-47e0-8649-c1355755496f", 3, 0, 0.0, 319.0, 244, 407, 306.0, 407.0, 407.0, 407.0, 0.028474344615501433, 0.02855776554699216, 0.018259915004081324], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 190.66666666666666, 109, 368, 115.0, 353.0, 368.0, 368.0, 0.0890731052665958, 0.041671831669645665, 0.04980207213733885], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 757.8333333333333, 633, 890, 760.0, 890.0, 890.0, 890.0, 0.05224250973016744, 15.361032475250111, 0.029794556330486114], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1279.6666666666665, 1125, 1527, 1260.0, 1527.0, 1527.0, 1527.0, 0.05211681114604868, 46.89479828079669, 0.029671973533346073], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 184.33333333333331, 110, 338, 111.5, 338.0, 338.0, 338.0, 0.05258038225937903, 0.0930426295449168, 0.029114332754949127], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 10, 0, 0.0, 114.9, 108, 129, 113.5, 128.1, 129.0, 129.0, 0.06367601642841224, 0.047321727052755586, 0.031962375433792864], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 10, 0, 0.0, 155.89999999999998, 105, 330, 114.0, 329.3, 330.0, 330.0, 0.06367723284216961, 0.026602656454961092, 0.03578113259510195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 10, 0, 0.0, 197.1, 108, 967, 111.5, 882.0000000000003, 967.0, 967.0, 0.06367885479947528, 5.745281645604885, 0.03688896158891478], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1152c531-1a49-43d8-95b6-65dad65a4f5a", 1, 0, 0.0, 672.0, 672, 672, 672.0, 672.0, 672.0, 672.0, 1.488095238095238, 0.26884533110119047, 1.025971912202381], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e56c577b-4fc9-4066-95de-1aac7cce0c61", 1, 0, 0.0, 507.0, 507, 507, 507.0, 507.0, 507.0, 507.0, 1.9723865877712032, 0.6298539201183432, 1.1768830128205128], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 10, 0, 0.0, 191.7, 107, 903, 115.0, 824.4000000000003, 903.0, 903.0, 0.06367763832374985, 1.8877807984857458, 0.03695044208200406], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 183.66666666666669, 113, 328, 114.5, 328.0, 328.0, 328.0, 0.05248471382709786, 0.039004753146895964, 0.02947139692439577], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 724.4736842105264, 112, 1478, 966.0, 1342.0, 1478.0, 1478.0, 0.0879874039084931, 41.68029711667593, 0.04774727644253033], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 297.2666666666666, 108, 1281, 115.0, 1156.2, 1281.0, 1281.0, 0.08907204741008176, 10.707097984448021, 0.05134400441203542], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 490.21052631578954, 106, 914, 584.0, 910.0, 914.0, 914.0, 0.08798292205176174, 13.626970064968443, 0.04783076513885094], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 204.6, 108, 918, 115.0, 764.4000000000001, 918.0, 918.0, 0.0890731052665958, 3.512866981193698, 0.05143159964905196], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3fbc0519-2714-4f81-bb3f-bffb68ddf7bd", 3, 0, 0.0, 446.33333333333337, 253, 791, 295.0, 791.0, 791.0, 791.0, 0.028215908129003132, 0.02352244164009669, 0.018094185876997453], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 397.64285714285717, 111, 786, 432.5, 729.0, 786.0, 786.0, 0.10362387494078636, 0.020412515543581238, 0.0703884831315135], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 10, 0, 0.0, 336.8, 223, 1078, 236.5, 1013.3000000000002, 1078.0, 1078.0, 0.06363023199582586, 7.701140880117462, 0.14147784395321905], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 694.8260869565216, 137, 1411, 718.0, 1117.2000000000003, 1364.7999999999993, 1411.0, 0.10007875763100527, 0.06147415874013898, 0.045250453889800236], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 127.36842105263159, 108, 343, 116.0, 123.0, 343.0, 343.0, 0.08807305428081398, 0.06545272881611273, 0.04420854482454921], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 228.05263157894737, 106, 346, 317.0, 343.0, 346.0, 346.0, 0.08808081182693511, 0.09319652509607762, 0.04634021329463958], "isController": false}, {"data": ["login", 23, 0, 0.0, 3200.782608695652, 1683, 6882, 2823.0, 5405.800000000002, 6708.999999999997, 6882.0, 0.10033459405931955, 31.450737350206992, 0.19478594786745362], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 119.46666666666665, 110, 141, 118.0, 131.4, 141.0, 141.0, 0.08897113776290971, 0.07202839180219937, 0.03162645912665931], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d31a186a-7172-4ecf-bf14-f80f020814dd", 1, 0, 0.0, 575.0, 575, 575, 575.0, 575.0, 575.0, 575.0, 1.7391304347826089, 0.3141983695652174, 1.1990489130434783], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/87666251-313c-49d0-babf-0473205d2c61", 1, 0, 0.0, 275.0, 275, 275, 275.0, 275.0, 275.0, 275.0, 3.6363636363636362, 1.1612215909090908, 2.169744318181818], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=97ef5562-0076-46cd-a158-4c9597ba685a", 1, 0, 0.0, 786.0, 786, 786, 786.0, 786.0, 786.0, 786.0, 1.272264631043257, 0.22985249681933842, 0.8771668256997455], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 865.3684210526316, 224, 1592, 1079.0, 1458.0, 1592.0, 1592.0, 0.08793161696987649, 55.43128053743573, 0.18591914716744495], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/92732275-bc72-4d03-abd3-477dcc1fec49", 3, 0, 0.0, 299.3333333333333, 200, 480, 218.0, 480.0, 480.0, 480.0, 0.06976581939954885, 0.03156721646008233, 0.04473914850817423], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/03a6f260-aa25-4dcd-b89c-0efdec7fc908", 3, 0, 0.0, 470.33333333333337, 253, 791, 367.0, 791.0, 791.0, 791.0, 0.0742647786909595, 0.03360287837904743, 0.04762422331418952], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 21, 0, 0.0, 311.95238095238096, 223, 643, 231.0, 469.2, 625.8999999999997, 643.0, 0.10327123945158055, 0.16005025098599443, 0.23225943794627926], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, 40.0, 923.0, 108, 1642, 1269.5, 1639.4, 1642.0, 1642.0, 0.0866213348347698, 62.18680973623804, 0.14015061284594396], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/93e496fe-aa85-4e25-9631-7135c8898f46", 3, 0, 0.0, 367.3333333333333, 211, 570, 321.0, 570.0, 570.0, 570.0, 0.026665718552229253, 0.026743840774550238, 0.01710008644137097], "isController": false}, {"data": ["register", 24, 7, 29.166666666666668, 1107.2499999999998, 296, 1928, 1118.5, 1678.0, 1870.5, 1928.0, 0.10584343991179714, 0.0332311190738699, 0.047753583241455344], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/1152c531-1a49-43d8-95b6-65dad65a4f5a", 3, 0, 0.0, 301.6666666666667, 223, 451, 231.0, 451.0, 451.0, 451.0, 0.030625057421982668, 0.02553085027919844, 0.019639115599383417], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 460.40000000000003, 227, 1395, 237.0, 1268.4, 1395.0, 1395.0, 0.08901073469460417, 14.317927197749215, 0.19715066439095888], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 133.43749999999997, 113, 346, 118.5, 197.60000000000014, 346.0, 346.0, 0.11676190059183687, 0.09065010836963898, 0.04150520685100451], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/865c8b96-47b1-4fe3-a43c-a75001712d5f", 1, 0, 0.0, 575.0, 575, 575, 575.0, 575.0, 575.0, 575.0, 1.7391304347826089, 0.555366847826087, 1.0377038043478262], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=84b92f89-5f36-47e0-8649-c1355755496f", 1, 0, 0.0, 438.0, 438, 438, 438.0, 438.0, 438.0, 438.0, 2.28310502283105, 0.4124750285388128, 1.574093892694064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 13, 0, 0.0, 486.84615384615387, 220, 1470, 453.0, 1150.7999999999997, 1470.0, 1470.0, 0.07688258845933207, 7.185241573964007, 0.17139757945519815], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 140.1, 110, 354, 116.0, 331.0000000000001, 354.0, 354.0, 0.05927717413855447, 0.04405266554632807, 0.029754362800016594], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 137.0, 108, 341, 114.5, 319.0000000000001, 341.0, 341.0, 0.0592796338889811, 0.024765456423541127, 0.03331005990207005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 231.5, 112, 1077, 115.5, 1001.4000000000003, 1077.0, 1077.0, 0.059277876903560824, 5.348213299954948, 0.03433948884686746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 192.0, 107, 906, 113.0, 827.4000000000003, 906.0, 906.0, 0.059279985298563646, 1.757408423537711, 0.03439860084414699], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 113.5, 111, 116, 113.5, 116.0, 116.0, 116.0, 0.19364833462432224, 0.05711112993803254, 0.11970644122773044], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1298.3508771929824, 875, 2033, 1231.0, 1813.6, 1898.1999999999996, 2033.0, 0.25046467788924187, 299.6428303662057, 0.4945699010664522], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, 29.166666666666668, 1107.2499999999998, 296, 1928, 1118.5, 1678.0, 1870.5, 1928.0, 0.1011911036154738, 0.03177044903552229, 0.04565457995151259], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 11, 0, 0.0, 134.0909090909091, 106, 341, 115.0, 296.20000000000016, 341.0, 341.0, 0.04827462115393899, 0.013011518982897619, 0.028427340386548056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 11, 0, 0.0, 132.8181818181818, 107, 324, 114.0, 282.60000000000014, 324.0, 324.0, 0.04827546860119635, 0.013011747396416204, 0.028380695408125198], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 180.125, 106, 981, 113.0, 534.4000000000004, 981.0, 981.0, 0.12090984659563213, 6.830232952183933, 0.07043234716239703], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 236.0, 107, 901, 113.5, 565.0000000000003, 901.0, 901.0, 0.12090893290309905, 2.2525044915779375, 0.07054989004843915], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 11, 0, 0.0, 153.90909090909088, 108, 335, 116.0, 333.4, 335.0, 335.0, 0.04827398558802103, 0.01291706254991969, 0.027531257405668242], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 127.18749999999997, 106, 343, 114.0, 185.50000000000017, 343.0, 343.0, 0.12070006035003017, 0.0896999471937236, 0.06058577248038624], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 11, 0, 0.0, 156.36363636363637, 107, 343, 117.0, 342.4, 343.0, 343.0, 0.04827250266595867, 0.03587438918827593, 0.024230533564748788], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 193.99999999999997, 108, 342, 114.0, 341.3, 342.0, 342.0, 0.12090984659563213, 0.04370288766719564, 0.06832173826796645], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 11, 0, 0.0, 123.18181818181819, 110, 153, 117.0, 150.20000000000002, 153.0, 153.0, 0.04820480908704474, 0.0379424571524981, 0.017135303230160433], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 539.6428571428571, 109, 927, 540.5, 884.5, 927.0, 927.0, 0.10387529029433805, 0.020056278148348757, 0.07068968555465696], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1878.391304347826, 1013, 5797, 1655.0, 3305.2000000000025, 5446.399999999995, 5797.0, 0.10131042836691995, 0.052436061557097235, 0.04659883961017509], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 11, 0, 0.0, 313.27272727272725, 221, 684, 235.0, 682.4, 684.0, 684.0, 0.04824836503835745, 0.0747755423006575, 0.1085117037923215], "isController": false}, {"data": ["addBook", 58, 9, 15.517241379310345, 1212.5862068965514, 562, 3638, 934.0, 2107.7000000000003, 2334.749999999999, 3638.0, 0.2536639128095902, 84.7287012517002, 0.9205097455597882], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/beb88270-d0de-483e-ad28-7f7b7131316a", 3, 0, 0.0, 335.3333333333333, 226, 531, 249.0, 531.0, 531.0, 531.0, 0.08534607834769993, 0.037783420101846314, 0.05473039529458621], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c55118e1-d9b8-49db-abc4-d34388257fda", 3, 0, 0.0, 436.0, 230, 842, 236.0, 842.0, 842.0, 842.0, 0.06727513286838742, 0.030440245666360187, 0.04314193090843854], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 200.6140350877193, 109, 482, 116.0, 459.4, 463.29999999999995, 482.0, 0.2515767684302051, 0.18696281325721298, 0.12161181677046047], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 719.2631578947368, 532, 1034, 677.0, 1013.0, 1019.5999999999999, 1034.0, 0.2511289789624408, 73.8402580818372, 0.12630021891177443], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3fbc0519-2714-4f81-bb3f-bffb68ddf7bd", 1, 0, 0.0, 516.0, 516, 516, 516.0, 516.0, 516.0, 516.0, 1.937984496124031, 0.35012415213178294, 1.3361494670542635], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 193.78947368421055, 106, 467, 119.0, 343.4, 357.39999999999935, 467.0, 0.25175010489587707, 0.4454796778040324, 0.12243315648256521], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 1091.1578947368425, 745, 1573, 1074.0, 1355.4, 1463.6, 1573.0, 0.2509896477778609, 225.84092626325952, 0.12598503804474662], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 13, 0, 0.0, 128.00000000000003, 114, 189, 117.0, 172.6, 189.0, 189.0, 0.07648858554954106, 0.05714235150917863, 0.027189301894563426], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 9, 5.202312138728324, 200.514450867052, 107, 3152, 121.0, 327.59999999999997, 409.6999999999998, 1675.6999999999819, 0.7022585935343498, 1.5662865641287933, 0.33597431910346337], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 167.99999999999997, 110, 343, 126.5, 342.9, 343.0, 343.0, 0.05742341152487869, 0.044469497401590626, 0.020412228315484223], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 21, 0, 0.0, 119.52380952380952, 108, 131, 118.0, 126.0, 130.5, 131.0, 0.10318446926331203, 0.08373661519317606, 0.03667885430844295], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 373.2, 226, 1432, 232.0, 1332.8000000000004, 1432.0, 1432.0, 0.059237144058810635, 7.169447248952984, 0.1317100874932618], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ead0de51-bcdd-4b47-888d-92a34f9f8bdd", 3, 0, 0.0, 544.6666666666666, 287, 952, 395.0, 952.0, 952.0, 952.0, 0.019091985184619496, 0.026319842857051946, 0.012243232686751437], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 397.37499999999994, 216, 1088, 336.5, 802.4000000000003, 1088.0, 1088.0, 0.12059634894553567, 9.19241695104165, 0.2692955336011577], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/97ef5562-0076-46cd-a158-4c9597ba685a", 3, 0, 0.0, 396.6666666666667, 226, 596, 368.0, 596.0, 596.0, 596.0, 0.022383215572749183, 0.026456203041878998, 0.014353819882264286], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e004850d-47e0-4571-b4f8-6328af8fd3d2", 1, 0, 0.0, 427.0, 427, 427, 427.0, 427.0, 427.0, 427.0, 2.34192037470726, 0.42310084894613587, 1.6146443208430914], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e9916adb-32fb-40af-9094-f537df89c50c", 1, 0, 0.0, 229.0, 229, 229, 229.0, 229.0, 229.0, 229.0, 4.366812227074235, 1.394480076419214, 2.605588155021834], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=03a6f260-aa25-4dcd-b89c-0efdec7fc908", 1, 0, 0.0, 191.0, 191, 191, 191.0, 191.0, 191.0, 191.0, 5.235602094240838, 0.9458851439790575, 3.60970222513089], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 10, 0, 0.0, 159.9, 111, 341, 118.0, 339.8, 341.0, 341.0, 0.06746636801554425, 0.05593647113788776, 0.023982185505525493], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 132.6315789473684, 112, 346, 119.0, 158.0, 346.0, 346.0, 0.08777765458106959, 0.06814769081245149, 0.031202213151864583], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=92732275-bc72-4d03-abd3-477dcc1fec49", 1, 0, 0.0, 211.0, 211, 211, 211.0, 211.0, 211.0, 211.0, 4.739336492890995, 0.8562277843601896, 3.267550355450237], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d31a186a-7172-4ecf-bf14-f80f020814dd", 3, 0, 0.0, 496.66666666666663, 240, 927, 323.0, 927.0, 927.0, 927.0, 0.025478139756089275, 0.025552782743655942, 0.016338520611815063], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 13, 0, 0.0, 146.23076923076923, 107, 334, 114.0, 332.4, 334.0, 334.0, 0.07693491306354824, 0.057175262540390834, 0.03861772003385137], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 13, 0, 0.0, 213.6153846153846, 108, 342, 118.0, 341.6, 342.0, 342.0, 0.07703292861417761, 0.029512314898760956, 0.043435183456882305], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 13, 0, 0.0, 330.76923076923083, 110, 1356, 324.0, 950.7999999999996, 1356.0, 1356.0, 0.07703292861417761, 5.351039842689872, 0.04477770444835535], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 13, 0, 0.0, 200.53846153846155, 107, 677, 114.0, 588.9999999999999, 677.0, 677.0, 0.0770342980397734, 1.7615230162186826, 0.04485372927481097], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=93e496fe-aa85-4e25-9631-7135c8898f46", 1, 0, 0.0, 444.0, 444, 444, 444.0, 444.0, 444.0, 444.0, 2.2522522522522523, 0.4069010416666667, 1.5528223536036037], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 29.166666666666668, 0.5299015897047691], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 8.333333333333334, 0.1514004542013626], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 8.333333333333334, 0.1514004542013626], "isController": false}, {"data": ["401/Unauthorized", 13, 54.166666666666664, 0.9841029523088569], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1321, 24, "401/Unauthorized", 13, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
