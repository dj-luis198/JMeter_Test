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

    var data = {"OkPercent": 97.51131221719457, "KoPercent": 2.48868778280543};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8029126213592233, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.2631578947368421, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0d17465c-3cba-417f-9b84-ea2eefb12772"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4512e787-6199-4cd9-9d4d-c74c75a9f347"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d32d6b95-c481-4d38-8e18-8c2fe8d93fc1"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/89265892-5c55-48db-9794-40a002caeb41"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/905cf9d4-a184-4599-8a07-6a218bb150a0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/04e5a633-f732-4bfb-a9b6-c02807372d29"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.84375, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7608695652173914, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.10869565217391304, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d6f0c983-5131-4931-b1f6-89317d660e7b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=905cf9d4-a184-4599-8a07-6a218bb150a0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6a129baf-83cc-40b7-85f9-0f1f5643adc8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=13b5d650-54fd-4f0d-a8a7-67fabab3f48d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/60b348b3-13c3-431b-862a-09758408c6f6"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3a1c669e-5ef0-484e-9cf7-d393deb2e27e"], "isController": false}, {"data": [0.3125, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2ecede73-e2aa-46b6-b3d5-057a931f1ce2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8f250ff5-293c-4ecb-af3c-c826aa916ced"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4512e787-6199-4cd9-9d4d-c74c75a9f347"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=60b348b3-13c3-431b-862a-09758408c6f6"], "isController": false}, {"data": [0.3125, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.41304347826086957, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d32d6b95-c481-4d38-8e18-8c2fe8d93fc1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d6f0c983-5131-4931-b1f6-89317d660e7b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dc7a78a7-60de-4e96-be9e-b938d075ace2"], "isController": false}, {"data": [0.35344827586206895, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=89265892-5c55-48db-9794-40a002caeb41"], "isController": false}, {"data": [0.7631578947368421, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9190751445086706, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6a129baf-83cc-40b7-85f9-0f1f5643adc8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/13b5d650-54fd-4f0d-a8a7-67fabab3f48d"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b85138f7-5c64-461a-b13a-da566d4e0e19"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e4db37ef-2ff9-43db-babc-cd70ddf103f3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0d17465c-3cba-417f-9b84-ea2eefb12772"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2ecede73-e2aa-46b6-b3d5-057a931f1ce2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/3a1c669e-5ef0-484e-9cf7-d393deb2e27e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1326, 33, 2.48868778280543, 315.98944193061885, 98, 2163, 114.0, 804.3, 984.6499999999999, 1304.3000000000002, 5.1187819923874525, 742.2218922688925, 3.739434489916849], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1470.6666666666665, 1192, 1842, 1439.0, 1719.0, 1742.3, 1842.0, 0.2507776306353473, 301.7698899383175, 1.2330716506337633], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0d17465c-3cba-417f-9b84-ea2eefb12772", 1, 0, 0.0, 396.0, 396, 396, 396.0, 396.0, 396.0, 396.0, 2.5252525252525255, 0.456222380050505, 1.7410432449494948], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4512e787-6199-4cd9-9d4d-c74c75a9f347", 1, 0, 0.0, 386.0, 386, 386, 386.0, 386.0, 386.0, 386.0, 2.5906735751295336, 0.4680416126943005, 1.7861479922279793], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d32d6b95-c481-4d38-8e18-8c2fe8d93fc1", 3, 0, 0.0, 245.0, 178, 377, 180.0, 377.0, 377.0, 377.0, 0.04841677156967173, 0.0306860202624189, 0.03104851562247829], "isController": false}, {"data": ["deleteBook", 14, 3, 21.428571428571427, 400.64285714285717, 103, 798, 416.5, 726.0, 798.0, 798.0, 0.09297013002536757, 0.019072625028223072, 0.06223732825428658], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, 21.428571428571427, 400.64285714285717, 103, 798, 416.5, 726.0, 798.0, 798.0, 0.09257116408238833, 0.018990778011042417, 0.06197024704929414], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 13, 0, 0.0, 162.53846153846152, 98, 313, 102.0, 307.8, 313.0, 313.0, 0.09329563232908958, 0.035742767794347714, 0.05260494413026941], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 13, 0, 0.0, 130.84615384615384, 100, 297, 101.0, 295.4, 297.0, 297.0, 0.09329295422904138, 0.06933197086748094, 0.04682868991574928], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 13, 0, 0.0, 192.3846153846154, 98, 686, 102.0, 534.7999999999998, 686.0, 686.0, 0.0929035946544701, 2.124402044772386, 0.0540937321339241], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 13, 0, 0.0, 253.0769230769231, 99, 886, 296.0, 653.1999999999998, 886.0, 886.0, 0.09277099835866696, 6.444274122689645, 0.05392593038607008], "isController": false}, {"data": ["goToProfile", 15, 4, 26.666666666666668, 217.73333333333335, 100, 431, 215.0, 377.0, 431.0, 431.0, 0.08148985179712286, 0.1266222846902299, 0.05266069459233343], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/89265892-5c55-48db-9794-40a002caeb41", 3, 0, 0.0, 381.6666666666667, 263, 494, 388.0, 494.0, 494.0, 494.0, 0.05105687736138058, 0.04256401787841656, 0.03274155221416658], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/905cf9d4-a184-4599-8a07-6a218bb150a0", 3, 0, 0.0, 263.0, 184, 367, 238.0, 367.0, 367.0, 367.0, 0.03419543832852697, 0.028507329934686715, 0.021928715334374394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 102.94117647058823, 100, 112, 101.0, 111.2, 112.0, 112.0, 0.09688873184048695, 0.07200422356504939, 0.048633601724619425], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 652.4285714285714, 492, 800, 689.0, 800.0, 800.0, 800.0, 0.030453319411815886, 8.954287052444966, 0.017367908727051247], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 119.05882352941175, 99, 408, 101.0, 164.79999999999978, 408.0, 408.0, 0.09689149292692102, 0.025926044005836285, 0.055258429559884636], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/04e5a633-f732-4bfb-a9b6-c02807372d29", 1, 0, 0.0, 259.0, 259, 259, 259.0, 259.0, 259.0, 259.0, 3.8610038610038613, 1.2329572876447876, 2.303782577220077], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 847.5714285714286, 689, 998, 885.0, 998.0, 998.0, 998.0, 0.03042882914212437, 27.379913950259734, 0.0173242259666587], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 156.85714285714286, 98, 300, 100.0, 300.0, 300.0, 300.0, 0.030506938149361968, 0.053982980397113176, 0.01689202532293773], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 115.19999999999999, 99, 300, 102.0, 184.20000000000007, 300.0, 300.0, 0.06876570150184293, 0.05110419808877194, 0.03451715876166725], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 155.93333333333334, 99, 316, 102.0, 310.0, 316.0, 316.0, 0.0687663320038509, 0.03217154048044744, 0.03844825906569477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 220.06666666666663, 99, 911, 101.0, 779.6000000000001, 911.0, 911.0, 0.06876696251742097, 8.266281366330778, 0.03963949779487274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 207.9333333333333, 99, 684, 102.0, 579.0, 684.0, 684.0, 0.06876664725919066, 2.712020467246446, 0.03970647099881263], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 130.42857142857142, 100, 308, 101.0, 308.0, 308.0, 308.0, 0.03050653929460165, 0.022671363674992045, 0.017130136810933543], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 136.11764705882356, 99, 298, 102.0, 297.2, 298.0, 298.0, 0.09689094069704482, 0.026115136359750362, 0.056961275683223615], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 480.7499999999999, 99, 893, 395.5, 889.5, 893.0, 893.0, 0.0724552362493547, 32.60743894514233, 0.03948244319056633], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 124.29411764705881, 98, 299, 101.0, 299.0, 299.0, 299.0, 0.0968920451630921, 0.02611543404786467, 0.05705654612631303], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 330.18750000000006, 99, 716, 297.0, 701.3000000000001, 716.0, 716.0, 0.07245425193249075, 10.661742230413578, 0.039552662920178054], "isController": false}, {"data": ["deleteBooks", 14, 3, 21.428571428571427, 340.07142857142867, 102, 826, 385.0, 632.5, 826.0, 826.0, 0.09256993989566045, 0.018990526871731125, 0.062408514864087494], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 365.33333333333337, 202, 1015, 209.0, 881.2, 1015.0, 1015.0, 0.0687335612232741, 11.056218432680058, 0.15223857333183646], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 501.47826086956525, 144, 1486, 443.0, 930.4, 1375.9999999999984, 1486.0, 0.09704190944724085, 0.05960875101788525, 0.04387734772858644], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 102.0, 99, 105, 101.5, 105.0, 105.0, 105.0, 0.0724552362493547, 0.0538461277204677, 0.03636913225797687], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 187.50000000000003, 99, 306, 102.5, 301.8, 306.0, 306.0, 0.07245458003514048, 0.07379895212563624, 0.03827922636622168], "isController": false}, {"data": ["login", 23, 0, 0.0, 2160.913043478261, 1407, 3335, 2037.0, 3025.2, 3274.7999999999993, 3335.0, 0.09427002213296172, 34.451902595755804, 0.18980887905770966], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d6f0c983-5131-4931-b1f6-89317d660e7b", 3, 0, 0.0, 540.3333333333334, 178, 1012, 431.0, 1012.0, 1012.0, 1012.0, 0.047693995325988454, 0.029669018576811177, 0.030585016533918378], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 118.88235294117648, 100, 306, 106.0, 156.39999999999986, 306.0, 306.0, 0.09943323058566172, 0.08049819155811873, 0.03534540618474694], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=905cf9d4-a184-4599-8a07-6a218bb150a0", 1, 0, 0.0, 400.0, 400, 400, 400.0, 400.0, 400.0, 400.0, 2.5, 0.45166015625, 1.7236328125], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6a129baf-83cc-40b7-85f9-0f1f5643adc8", 1, 0, 0.0, 202.0, 202, 202, 202.0, 202.0, 202.0, 202.0, 4.9504950495049505, 0.8943765470297029, 3.4131342821782176], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=13b5d650-54fd-4f0d-a8a7-67fabab3f48d", 1, 0, 0.0, 375.0, 375, 375, 375.0, 375.0, 375.0, 375.0, 2.6666666666666665, 0.4817708333333333, 1.8385416666666667], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/60b348b3-13c3-431b-862a-09758408c6f6", 3, 0, 0.0, 255.33333333333334, 176, 383, 207.0, 383.0, 383.0, 383.0, 0.09205277692543726, 0.04326959957042037, 0.05903124041116906], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 584.6875, 202, 995, 503.0, 992.9, 995.0, 995.0, 0.07242112886434617, 43.376543192413884, 0.15361200380210926], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 7, 50.0, 540.1428571428571, 100, 1102, 446.5, 1055.5, 1102.0, 1102.0, 0.06054787174230826, 36.226252867914816, 0.08824970564003425], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 13, 0, 0.0, 418.0769230769231, 203, 1180, 400.0, 948.7999999999997, 1180.0, 1180.0, 0.09270285881354604, 8.663761828528235, 0.20666637177055328], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3a1c669e-5ef0-484e-9cf7-d393deb2e27e", 1, 0, 0.0, 427.0, 427, 427, 427.0, 427.0, 427.0, 427.0, 2.34192037470726, 0.42310084894613587, 1.6146443208430914], "isController": false}, {"data": ["register", 24, 8, 33.333333333333336, 870.5416666666666, 238, 2163, 849.0, 1310.5, 1984.0, 2163.0, 0.1002979685482287, 0.03134311517132147, 0.04525162252859537], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/2ecede73-e2aa-46b6-b3d5-057a931f1ce2", 3, 0, 0.0, 334.3333333333333, 262, 400, 341.0, 400.0, 400.0, 400.0, 0.03222133911885378, 0.026861604649539236, 0.020662772807337873], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 270.6470588235294, 202, 509, 207.0, 428.19999999999993, 509.0, 509.0, 0.09683244000660739, 0.15007136942430266, 0.21777842708517267], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 106.38888888888889, 100, 117, 105.0, 117.0, 117.0, 117.0, 0.09796611460946897, 0.07605767686965609, 0.034823892302584675], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 436.0666666666667, 201, 1196, 210.0, 1134.8, 1196.0, 1196.0, 0.16327596904287628, 39.26940126702152, 0.35885634367958724], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8f250ff5-293c-4ecb-af3c-c826aa916ced", 1, 0, 0.0, 425.0, 425, 425, 425.0, 425.0, 425.0, 425.0, 2.352941176470588, 0.7513786764705882, 1.403952205882353], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 120.90909090909089, 99, 304, 102.0, 265.20000000000016, 304.0, 304.0, 0.053445276895120936, 0.03971860909881546, 0.026827023753996246], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 101.0, 99, 104, 101.0, 103.8, 104.0, 104.0, 0.05344813344541245, 0.014301551332073253, 0.030482138605586788], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 136.0909090909091, 99, 301, 100.0, 299.6, 301.0, 301.0, 0.05344787374640442, 0.014405872220710566, 0.031421503901694785], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 139.36363636363635, 98, 330, 101.0, 323.8, 330.0, 330.0, 0.05344813344541245, 0.014405942217708825, 0.03147385201912471], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 103.0, 102, 104, 103.0, 104.0, 104.0, 104.0, 0.07513336171704775, 0.022158471912644945, 0.04644474410829222], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4512e787-6199-4cd9-9d4d-c74c75a9f347", 3, 0, 0.0, 302.3333333333333, 221, 396, 290.0, 396.0, 396.0, 396.0, 0.02784041871989755, 0.027921982446615996, 0.017853393515038465], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 954.5263157894734, 781, 1418, 811.0, 1295.4, 1328.6999999999998, 1418.0, 0.25111680896619176, 300.4230058516825, 0.4958576052047263], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=60b348b3-13c3-431b-862a-09758408c6f6", 1, 0, 0.0, 197.0, 197, 197, 197.0, 197.0, 197.0, 197.0, 5.076142131979695, 0.9170764593908629, 3.4997620558375635], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, 33.333333333333336, 870.5416666666666, 238, 2163, 849.0, 1310.5, 1984.0, 2163.0, 0.09487290983120529, 0.02964778432225165, 0.042803988615250824], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 10, 0, 0.0, 181.5, 99, 304, 104.0, 303.7, 304.0, 304.0, 0.0603522155298321, 0.01626680809202506, 0.035539439418446055], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 10, 0, 0.0, 160.2, 99, 302, 101.5, 301.6, 302.0, 302.0, 0.060352944016609136, 0.01626700444197668, 0.03548092997851435], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 216.72222222222223, 99, 695, 102.5, 681.5, 695.0, 695.0, 0.09570497346845457, 9.59131857859505, 0.0553502070949287], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 195.0, 98, 687, 103.0, 516.9000000000003, 687.0, 687.0, 0.09570395576350489, 3.1496113688324114, 0.055443079407698846], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 113.05555555555554, 99, 302, 102.5, 124.70000000000027, 302.0, 302.0, 0.09570497346845457, 0.07112449688427142, 0.048039410510532864], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 10, 0, 0.0, 101.30000000000001, 98, 103, 102.0, 103.0, 103.0, 103.0, 0.06035257977102231, 0.016149030134043077, 0.03441983065066116], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 157.27777777777777, 98, 309, 101.0, 306.3, 309.0, 309.0, 0.09570548232904608, 0.041580376654242676, 0.05368894787773093], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 10, 0, 0.0, 134.90000000000003, 100, 428, 103.0, 395.60000000000014, 428.0, 428.0, 0.0603522155298321, 0.04485159767402562, 0.030293983185872755], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 148.79999999999998, 103, 315, 107.5, 314.7, 315.0, 315.0, 0.06094848024964498, 0.047973120196497895, 0.021665280088740985], "isController": false}, {"data": ["deleteAccount", 14, 3, 21.428571428571427, 393.2857142857142, 101, 1012, 385.5, 859.0, 1012.0, 1012.0, 0.09237021984112322, 0.018408322969174738, 0.06285375938547412], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1132.6521739130435, 687, 2048, 1043.0, 1780.4000000000003, 2017.5999999999995, 2048.0, 0.09656805528731095, 0.04998151299050274, 0.04441753324250338], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 0, 0.0, 317.6, 201, 733, 208.0, 700.2, 733.0, 733.0, 0.06031472222054681, 0.09347603922266386, 0.13564922390031184], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d32d6b95-c481-4d38-8e18-8c2fe8d93fc1", 1, 0, 0.0, 420.0, 420, 420, 420.0, 420.0, 420.0, 420.0, 2.3809523809523814, 0.43015252976190477, 1.6415550595238095], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d6f0c983-5131-4931-b1f6-89317d660e7b", 1, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 2.277904328018223, 0.4115354498861048, 1.570508257403189], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dc7a78a7-60de-4e96-be9e-b938d075ace2", 1, 0, 0.0, 178.0, 178, 178, 178.0, 178.0, 178.0, 178.0, 5.617977528089887, 1.794022120786517, 3.352133075842697], "isController": false}, {"data": ["addBook", 58, 12, 20.689655172413794, 981.9655172413792, 512, 1969, 838.0, 1498.6000000000001, 1691.4499999999994, 1969.0, 0.27947497253435616, 93.35075340037922, 1.013666152990864], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 181.38596491228068, 100, 425, 103.0, 404.8, 412.99999999999994, 425.0, 0.2521097606284167, 0.18735891390451673, 0.12186946436627567], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=89265892-5c55-48db-9794-40a002caeb41", 1, 0, 0.0, 384.0, 384, 384, 384.0, 384.0, 384.0, 384.0, 2.6041666666666665, 0.4704793294270833, 1.7954508463541665], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 554.7543859649122, 485, 886, 499.0, 709.6, 754.5999999999997, 886.0, 0.25181238651876, 74.04120259466157, 0.12664392486050918], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 165.0175438596491, 98, 408, 105.0, 302.0, 321.39999999999947, 408.0, 0.252490575899996, 0.4467899643855398, 0.12279326835761524], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 765.4561403508773, 680, 1012, 703.0, 909.8000000000001, 935.8999999999996, 1012.0, 0.2516067518892577, 226.39619762744763, 0.12629479538191254], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 119.66666666666667, 102, 303, 105.0, 199.80000000000007, 303.0, 303.0, 0.15664487562396875, 0.11702473618392198, 0.05568235813195765], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 12, 6.936416184971098, 166.22543352601147, 99, 1035, 107.0, 300.6, 379.6999999999998, 978.7599999999993, 0.7188355694798206, 1.6034660638454794, 0.343466835139425], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 127.9090909090909, 101, 347, 105.0, 300.8000000000002, 347.0, 347.0, 0.05051525560719337, 0.03911972431299252, 0.01795659476661952], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6a129baf-83cc-40b7-85f9-0f1f5643adc8", 3, 0, 0.0, 286.3333333333333, 225, 349, 285.0, 349.0, 349.0, 349.0, 0.0702543206407194, 0.03178825055032551, 0.04505241265046134], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 13, 0, 0.0, 103.76923076923079, 101, 107, 104.0, 106.6, 107.0, 107.0, 0.09674706595917273, 0.07851251153522709, 0.03439055860267468], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/13b5d650-54fd-4f0d-a8a7-67fabab3f48d", 3, 0, 0.0, 324.6666666666667, 244, 422, 308.0, 422.0, 422.0, 422.0, 0.022727789267937906, 0.026863477484336762, 0.014574786737577368], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 279.4545454545455, 202, 606, 205.0, 571.0000000000001, 606.0, 606.0, 0.053419062835386735, 0.08278911398413939, 0.12014072432606995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 354.1666666666667, 202, 797, 209.0, 782.6, 797.0, 797.0, 0.09565208149557343, 12.846564429647895, 0.2124044973748818], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b85138f7-5c64-461a-b13a-da566d4e0e19", 1, 0, 0.0, 234.0, 234, 234, 234.0, 234.0, 234.0, 234.0, 4.273504273504274, 1.3646834935897436, 2.549913194444444], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 123.46666666666668, 102, 333, 105.0, 212.4000000000001, 333.0, 333.0, 0.0698883649849973, 0.05794455260963155, 0.02484312974076076], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e4db37ef-2ff9-43db-babc-cd70ddf103f3", 1, 0, 0.0, 203.0, 203, 203, 203.0, 203.0, 203.0, 203.0, 4.926108374384237, 1.573083435960591, 2.939308805418719], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 109.5625, 102, 137, 107.5, 130.0, 137.0, 137.0, 0.07379733407130666, 0.05729382869793829, 0.026232646095659794], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0d17465c-3cba-417f-9b84-ea2eefb12772", 3, 0, 0.0, 331.3333333333333, 269, 401, 324.0, 401.0, 401.0, 401.0, 0.020323413249510543, 0.02801746585666574, 0.01303291800180201], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2ecede73-e2aa-46b6-b3d5-057a931f1ce2", 1, 0, 0.0, 826.0, 826, 826, 826.0, 826.0, 826.0, 826.0, 1.2106537530266344, 0.21872162530266345, 0.8346890133171914], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3a1c669e-5ef0-484e-9cf7-d393deb2e27e", 3, 0, 0.0, 744.6666666666666, 215, 1313, 706.0, 1313.0, 1313.0, 1313.0, 0.023472892721055967, 0.023541660961449686, 0.015052603730625082], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 116.06666666666666, 99, 310, 103.0, 187.00000000000006, 310.0, 310.0, 0.16382163100815833, 0.1217463488253989, 0.08223077962714197], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 139.60000000000002, 98, 298, 101.0, 297.4, 298.0, 298.0, 0.16383236672236967, 0.0930516645368459, 0.09068377486156165], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 292.06666666666666, 99, 990, 102.0, 927.0, 990.0, 990.0, 0.16383057733895454, 29.518334262844316, 0.09349862245789553], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 222.2, 98, 701, 103.0, 581.6, 701.0, 701.0, 0.16346101454803028, 9.647839419985834, 0.09344734171525092], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 24.242424242424242, 0.6033182503770739], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 12.121212121212121, 0.30165912518853694], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 9.090909090909092, 0.22624434389140272], "isController": false}, {"data": ["401/Unauthorized", 18, 54.54545454545455, 1.3574660633484164], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1326, 33, "401/Unauthorized", 18, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 7, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
