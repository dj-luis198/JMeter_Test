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

    var data = {"OkPercent": 97.5103734439834, "KoPercent": 2.4896265560165975};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6363636363636364, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/e3fa122e-8cf3-4332-b6d0-be058f50f53a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=06542916-d165-4fe1-9333-7d7250136e01"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/059b09df-7d1b-46ff-9187-d83ab2b308f2"], "isController": false}, {"data": [0.058823529411764705, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.058823529411764705, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a2e36fd8-9d82-479c-a63a-020ec1308922"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/d55bd188-c52c-4920-8631-70e9d8949702"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9e2a4c7d-ae9e-4560-95bf-51ff5b6dd215"], "isController": false}, {"data": [0.47058823529411764, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/6b783be5-29cd-4513-826f-25635db40285"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.14285714285714285, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.55, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.8235294117647058, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/34a7d9f8-807f-4c57-8798-5224425aa9c2"], "isController": false}, {"data": [0.4375, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/c705a7a4-1b27-4ff2-8f69-f938db59397e"], "isController": false}, {"data": [0.32608695652173914, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6b783be5-29cd-4513-826f-25635db40285"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3c4e055f-e2a2-4a98-851a-baf4ebf6d2a1"], "isController": false}, {"data": [0.45, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1e26bb55-8eff-4909-9b8c-08b7f4d1a120"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=87bb72dc-aece-402a-b26a-a821bf23433d"], "isController": false}, {"data": [0.8611111111111112, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.03571428571428571, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2b0d3a48-e9bd-4c10-9a79-ee677e619afa"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/5f7da61e-bbac-4f34-99df-0470028e242d"], "isController": false}, {"data": [0.038461538461538464, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=34a7d9f8-807f-4c57-8798-5224425aa9c2"], "isController": false}, {"data": [0.6764705882352942, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/a2e36fd8-9d82-479c-a63a-020ec1308922"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/9e2a4c7d-ae9e-4560-95bf-51ff5b6dd215"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5f7da61e-bbac-4f34-99df-0470028e242d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e3fa122e-8cf3-4332-b6d0-be058f50f53a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3d9dabfd-3927-4fae-be16-a1b392fbffbd"], "isController": false}, {"data": [0.038461538461538464, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.34375, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.08139534883720931, 500, 1500, "addBook"], "isController": true}, {"data": [0.9107142857142857, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c705a7a4-1b27-4ff2-8f69-f938db59397e"], "isController": false}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.33035714285714285, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.7852112676056338, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1e26bb55-8eff-4909-9b8c-08b7f4d1a120"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/3d9dabfd-3927-4fae-be16-a1b392fbffbd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.925, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/87bb72dc-aece-402a-b26a-a821bf23433d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/1af6eae6-2ffd-451e-b7e7-e6ff0e0d2dea"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/3c4e055f-e2a2-4a98-851a-baf4ebf6d2a1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/2b0d3a48-e9bd-4c10-9a79-ee677e619afa"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/06542916-d165-4fe1-9333-7d7250136e01"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1205, 30, 2.4896265560165975, 788.2506224066401, 137, 15541, 258.0, 1711.4, 2445.1000000000004, 7506.1600000000035, 4.6817206974792525, 728.1272598165581, 3.409500129184409], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 2434.767857142856, 1737, 4912, 2252.5, 3116.900000000001, 3813.7999999999997, 4912.0, 0.24638344303262819, 296.48202992321416, 1.211465464520784], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/e3fa122e-8cf3-4332-b6d0-be058f50f53a", 3, 0, 0.0, 2401.3333333333335, 590, 3754, 2860.0, 3754.0, 3754.0, 3754.0, 0.06911486891213196, 0.03203762152697784, 0.04432170955628254], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=06542916-d165-4fe1-9333-7d7250136e01", 1, 0, 0.0, 565.0, 565, 565, 565.0, 565.0, 565.0, 565.0, 1.7699115044247788, 0.3197594026548673, 1.2202710176991152], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/059b09df-7d1b-46ff-9187-d83ab2b308f2", 1, 0, 0.0, 762.0, 762, 762, 762.0, 762.0, 762.0, 762.0, 1.3123359580052494, 0.4190760334645669, 0.7830442093175853], "isController": false}, {"data": ["deleteBook", 17, 4, 23.529411764705884, 1746.647058823529, 143, 4284, 2139.0, 3379.1999999999994, 4284.0, 4284.0, 0.0894016923214464, 0.018555165117037333, 0.05975862200438595], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 4, 23.529411764705884, 1746.647058823529, 143, 4284, 2139.0, 3379.1999999999994, 4284.0, 4284.0, 0.09071359583357791, 0.018827448399972253, 0.060635535450339645], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a2e36fd8-9d82-479c-a63a-020ec1308922", 1, 0, 0.0, 444.0, 444, 444, 444.0, 444.0, 444.0, 444.0, 2.2522522522522523, 0.4069010416666667, 1.5528223536036037], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 173.5, 138, 430, 143.0, 417.40000000000003, 430.0, 430.0, 0.08526522221064299, 0.037044482392731615, 0.04783216133127434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 146.49999999999994, 137, 175, 145.0, 164.20000000000002, 175.0, 175.0, 0.08526279889347835, 0.06336424800579787, 0.042797928350828], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 265.11111111111114, 138, 1097, 144.0, 850.4000000000004, 1097.0, 1097.0, 0.08526360665056132, 2.806020113921652, 0.04939479122258538], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 300.55555555555554, 137, 1506, 143.0, 1371.9000000000003, 1506.0, 1506.0, 0.08526643392088222, 8.545193652506121, 0.049313161110926894], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d55bd188-c52c-4920-8631-70e9d8949702", 1, 0, 0.0, 1008.0, 1008, 1008, 1008.0, 1008.0, 1008.0, 1008.0, 0.992063492063492, 0.31680152529761907, 0.5919441344246031], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9e2a4c7d-ae9e-4560-95bf-51ff5b6dd215", 1, 0, 0.0, 2275.0, 2275, 2275, 2275.0, 2275.0, 2275.0, 2275.0, 0.43956043956043955, 0.07941277472527473, 0.3030563186813187], "isController": false}, {"data": ["goToProfile", 17, 4, 23.529411764705884, 724.1764705882352, 142, 2860, 586.0, 1647.9999999999989, 2860.0, 2860.0, 0.08842606800484783, 0.10723591002127426, 0.057145752817930724], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6b783be5-29cd-4513-826f-25635db40285", 3, 0, 0.0, 1382.3333333333333, 589, 2222, 1336.0, 2222.0, 2222.0, 2222.0, 0.02038597444957869, 0.024095531649225333, 0.013073037000543627], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 144.3529411764706, 137, 160, 143.0, 158.4, 160.0, 160.0, 0.08352125615969264, 0.062069996032740334, 0.04192375553328322], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 195.7058823529412, 138, 436, 145.0, 418.4, 436.0, 436.0, 0.08341838737536311, 0.044431025261050486, 0.04633822414520688], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 1000.8571428571429, 836, 1147, 1096.0, 1147.0, 1147.0, 1147.0, 0.053299221831361265, 15.67174091914508, 0.030397212450698218], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1512.5714285714284, 1227, 1651, 1574.0, 1651.0, 1651.0, 1651.0, 0.05301022340022719, 47.69869219755774, 0.03018062523665278], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 344.8571428571429, 144, 433, 417.0, 433.0, 433.0, 433.0, 0.05347675289156442, 0.09462878539015111, 0.029610662978043975], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 7, 0, 0.0, 143.42857142857142, 140, 147, 144.0, 147.0, 147.0, 147.0, 0.03426702826540303, 0.025466023935519243, 0.01720044192228238], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 7, 0, 0.0, 183.0, 138, 426, 144.0, 426.0, 426.0, 426.0, 0.03426853805521151, 0.009169511159304642, 0.019543775609612814], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 7, 0, 0.0, 223.0, 139, 428, 144.0, 428.0, 428.0, 428.0, 0.03426769926667123, 0.00923621581796998, 0.020145659139195395], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 7, 0, 0.0, 180.0, 139, 412, 141.0, 412.0, 412.0, 412.0, 0.03426853805521151, 0.009236441897693726, 0.020179617624309122], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 225.85714285714283, 138, 433, 145.0, 433.0, 433.0, 433.0, 0.05347185088992437, 0.03973835793675044, 0.03002569752119777], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 872.2000000000002, 137, 1778, 756.5, 1717.4, 1775.0, 1778.0, 0.09057027574120449, 40.759852418566, 0.049353724476164165], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 450.29411764705884, 138, 1658, 145.0, 1581.1999999999998, 1658.0, 1658.0, 0.08341593146154525, 13.26401000469828, 0.047774404680124435], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 647.9499999999999, 138, 1385, 641.5, 1255.3, 1378.6499999999999, 1385.0, 0.09056904531169337, 13.327358842482317, 0.049441500321520115], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 318.70588235294116, 138, 1144, 144.0, 893.5999999999998, 1144.0, 1144.0, 0.08353110550961346, 4.352820879214022, 0.04792194110320022], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/34a7d9f8-807f-4c57-8798-5224425aa9c2", 3, 0, 0.0, 1172.6666666666667, 972, 1345, 1201.0, 1345.0, 1345.0, 1345.0, 0.0451222813825467, 0.029009279209156812, 0.028935837995969074], "isController": false}, {"data": ["deleteBooks", 16, 3, 18.75, 802.9375, 145, 2275, 629.5, 1626.1000000000006, 2275.0, 2275.0, 0.09737987279754115, 0.019679245534219895, 0.06583721014272237], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 7, 0, 0.0, 368.0, 280, 570, 292.0, 570.0, 570.0, 570.0, 0.034242722198578435, 0.05306953137611717, 0.07701268478840444], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c705a7a4-1b27-4ff2-8f69-f938db59397e", 3, 0, 0.0, 886.3333333333334, 831, 937, 891.0, 937.0, 937.0, 937.0, 0.05765461044701541, 0.026725314217626937, 0.03697252037129569], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 2189.086956521739, 208, 8125, 1184.0, 5376.000000000001, 7613.999999999993, 8125.0, 0.0988036170715467, 0.06069089368945594, 0.04467390107824817], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 163.45, 139, 431, 143.0, 205.5, 419.74999999999983, 431.0, 0.09056453402283132, 0.06730430702282679, 0.045459150866929005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 239.05, 137, 434, 144.5, 430.40000000000003, 433.9, 434.0, 0.09057068589180425, 0.09225119666518734, 0.04785033307369737], "isController": false}, {"data": ["login", 23, 0, 0.0, 10373.78260869565, 3567, 20007, 10703.0, 17264.4, 19494.399999999994, 20007.0, 0.09631773125677888, 35.200257944380695, 0.19393185860766438], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 220.82352941176472, 140, 1038, 154.0, 550.7999999999996, 1038.0, 1038.0, 0.08552340322775386, 0.0692372082771562, 0.030400897241115627], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6b783be5-29cd-4513-826f-25635db40285", 1, 0, 0.0, 1330.0, 1330, 1330, 1330.0, 1330.0, 1330.0, 1330.0, 0.7518796992481204, 0.1358376409774436, 0.5183858082706767], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3c4e055f-e2a2-4a98-851a-baf4ebf6d2a1", 1, 0, 0.0, 1317.0, 1317, 1317, 1317.0, 1317.0, 1317.0, 1317.0, 0.7593014426727411, 0.13717848329536828, 0.5235027524677297], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 1065.6499999999999, 281, 1918, 1185.0, 1860.0, 1915.1, 1918.0, 0.09050428990334142, 54.20742953958205, 0.19196808366216558], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1e26bb55-8eff-4909-9b8c-08b7f4d1a120", 3, 0, 0.0, 459.3333333333333, 437, 489, 452.0, 489.0, 489.0, 489.0, 0.02084114876411988, 0.024633532279465912, 0.013364929383240938], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=87bb72dc-aece-402a-b26a-a821bf23433d", 1, 0, 0.0, 635.0, 635, 635, 635.0, 635.0, 635.0, 635.0, 1.574803149606299, 0.28451033464566927, 1.0857529527559056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 466.2222222222223, 282, 1647, 290.5, 1512.0000000000002, 1647.0, 1647.0, 0.08520387393613496, 11.443316643630062, 0.1892032639000653], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 7, 50.0, 943.9285714285713, 140, 2008, 771.0, 1902.5, 2008.0, 2008.0, 0.09924995391966425, 59.3820034356435, 0.14465874631357314], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2b0d3a48-e9bd-4c10-9a79-ee677e619afa", 1, 0, 0.0, 624.0, 624, 624, 624.0, 624.0, 624.0, 624.0, 1.6025641025641024, 0.2895257411858974, 1.104892828525641], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5f7da61e-bbac-4f34-99df-0470028e242d", 3, 0, 0.0, 600.6666666666666, 258, 1011, 533.0, 1011.0, 1011.0, 1011.0, 0.1207778090905431, 0.05606417830830549, 0.07745191533475583], "isController": false}, {"data": ["register", 26, 7, 26.923076923076923, 4613.73076923077, 709, 12152, 4575.0, 9228.9, 11308.499999999996, 12152.0, 0.10761767578933426, 0.033873051499197004, 0.04855406856901604], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=34a7d9f8-807f-4c57-8798-5224425aa9c2", 1, 0, 0.0, 1348.0, 1348, 1348, 1348.0, 1348.0, 1348.0, 1348.0, 0.741839762611276, 0.13402378523738873, 0.5114637425816023], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 630.2352941176472, 280, 1797, 380.0, 1726.6, 1797.0, 1797.0, 0.08334967640713865, 17.70317824267013, 0.18369199996322808], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 175.15384615384616, 144, 493, 149.0, 357.79999999999984, 493.0, 493.0, 0.06936736958934517, 0.05385454963235294, 0.024657932158712544], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a2e36fd8-9d82-479c-a63a-020ec1308922", 3, 0, 0.0, 1102.3333333333333, 586, 1782, 939.0, 1782.0, 1782.0, 1782.0, 0.017105713308244952, 0.023581606725396283, 0.010969484120196146], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9e2a4c7d-ae9e-4560-95bf-51ff5b6dd215", 3, 0, 0.0, 1935.6666666666667, 1240, 3141, 1426.0, 3141.0, 3141.0, 3141.0, 0.041804854937153364, 0.026876493652629525, 0.02680845189654692], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 508.19999999999993, 282, 881, 564.0, 787.4000000000001, 881.0, 881.0, 0.09578054760931753, 0.14844114165623723, 0.2154126964299397], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5f7da61e-bbac-4f34-99df-0470028e242d", 1, 0, 0.0, 365.0, 365, 365, 365.0, 365.0, 365.0, 365.0, 2.73972602739726, 0.4949700342465754, 1.8889126712328768], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e3fa122e-8cf3-4332-b6d0-be058f50f53a", 1, 0, 0.0, 814.0, 814, 814, 814.0, 814.0, 814.0, 814.0, 1.2285012285012284, 0.22194602272727273, 0.8469940110565111], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 2, 0, 0.0, 150.5, 140, 161, 150.5, 161.0, 161.0, 161.0, 0.010537907487710165, 0.007831394138815855, 0.005289535594417017], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 2, 0, 0.0, 143.0, 138, 148, 143.0, 148.0, 148.0, 148.0, 0.010537518835814918, 0.0028196095322395387, 0.006009678711050696], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 2, 0, 0.0, 140.0, 140, 140, 140.0, 140.0, 140.0, 140.0, 0.010538018536374606, 0.002840325308632218, 0.006195202303610852], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 2, 0, 0.0, 146.0, 145, 147, 146.0, 147.0, 147.0, 147.0, 0.010537629876288226, 0.002840220552593311, 0.006205264468165821], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 146.33333333333334, 145, 148, 146.0, 148.0, 148.0, 148.0, 0.043670664958658435, 0.012879434392104344, 0.026995635662920694], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1584.6428571428569, 1096, 2482, 1428.5, 2292.6, 2331.35, 2482.0, 0.2538922590063745, 303.7434090022941, 0.5013380348739153], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3d9dabfd-3927-4fae-be16-a1b392fbffbd", 1, 0, 0.0, 861.0, 861, 861, 861.0, 861.0, 861.0, 861.0, 1.1614401858304297, 0.20983050232288036, 0.8007585656213705], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 7, 26.923076923076923, 4613.73076923077, 709, 12152, 4575.0, 9228.9, 11308.499999999996, 12152.0, 0.10482349336386654, 0.03299357250560402, 0.04729341204502572], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 266.2857142857143, 144, 431, 154.0, 431.0, 431.0, 431.0, 0.059414680518775034, 0.016014113108576086, 0.0349873558133021], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 183.71428571428572, 139, 432, 141.0, 432.0, 432.0, 432.0, 0.0594161934591259, 0.016014520893280027, 0.03493022310780644], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 206.23076923076923, 139, 430, 140.0, 428.4, 430.0, 430.0, 0.06861679105659302, 0.018494369464472336, 0.04033916817975488], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 183.15384615384613, 138, 413, 143.0, 413.0, 413.0, 413.0, 0.06861679105659302, 0.018494369464472336, 0.04040617676477108], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 144.46153846153845, 139, 158, 144.0, 154.0, 158.0, 158.0, 0.06861570455133247, 0.05099272574566797, 0.03444186732361805], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 179.85714285714286, 138, 413, 140.0, 413.0, 413.0, 413.0, 0.05941669778969884, 0.015898608588259262, 0.03388608545818762], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 185.15384615384616, 138, 429, 144.0, 423.8, 429.0, 429.0, 0.06861570455133247, 0.018360061569399507, 0.039132394001931796], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 223.42857142857144, 141, 424, 146.0, 424.0, 424.0, 424.0, 0.05941367193467891, 0.044154105803018213, 0.029822878295336877], "isController": false}, {"data": ["deleteAccount", 16, 3, 18.75, 1182.5, 140, 3754, 966.5, 2968.600000000001, 3754.0, 3754.0, 0.10023115810838747, 0.019741573926743552, 0.06820539439394603], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 155.0, 148, 165, 154.0, 165.0, 165.0, 165.0, 0.0606233815722241, 0.04771723197969983, 0.021549717668251537], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 6814.000000000001, 1506, 15541, 6325.0, 13552.800000000005, 15446.399999999998, 15541.0, 0.09563648157542393, 0.049499350815404956, 0.04398904572463346], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 490.99999999999994, 286, 857, 301.0, 857.0, 857.0, 857.0, 0.05934064070937497, 0.09196640313064267, 0.13345849175165095], "isController": false}, {"data": ["addBook", 43, 9, 20.930232558139537, 2312.953488372093, 717, 7535, 1910.0, 4677.2, 5609.199999999997, 7535.0, 0.20350116658226888, 85.81081091073871, 0.7332040918523812], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 241.51785714285717, 138, 652, 146.0, 569.6, 579.0, 652.0, 0.2558783481224926, 0.19015959269650085, 0.12369119367249398], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 923.4285714285714, 684, 1300, 858.0, 1152.4, 1254.9, 1300.0, 0.2552869470872215, 75.06283876805814, 0.12839138452140536], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c705a7a4-1b27-4ff2-8f69-f938db59397e", 1, 0, 0.0, 1323.0, 1323, 1323, 1323.0, 1323.0, 1323.0, 1323.0, 0.7558578987150416, 0.13655635865457294, 0.5211285903250189], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 205.60714285714286, 138, 566, 148.5, 417.3, 431.3, 566.0, 0.25640673433972977, 0.45371972912459996, 0.12469780634881389], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1339.2142857142856, 953, 1905, 1282.5, 1733.3, 1799.6499999999999, 1905.0, 0.25458595685677265, 229.07689149410132, 0.1277902166253722], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 186.66666666666666, 144, 419, 150.0, 416.0, 419.0, 419.0, 0.09335905894068589, 0.06974578133752413, 0.033186227982821934], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 142, 9, 6.338028169014085, 458.3028169014084, 139, 3232, 156.5, 1191.2000000000007, 1727.5499999999988, 3074.6199999999976, 0.5824398487297069, 1.5167717745855243, 0.2694537344853611], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 2, 0, 0.0, 154.0, 148, 160, 154.0, 160.0, 160.0, 160.0, 0.010359634719279798, 0.008022646808973516, 0.003682526404118991], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 235.1111111111111, 141, 1374, 148.5, 523.5000000000014, 1374.0, 1374.0, 0.08539101971109371, 0.06929681384757704, 0.030353839037927845], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1e26bb55-8eff-4909-9b8c-08b7f4d1a120", 1, 0, 0.0, 507.0, 507, 507, 507.0, 507.0, 507.0, 507.0, 1.9723865877712032, 0.3563393737672584, 1.3598680966469427], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 2, 0, 0.0, 298.0, 287, 309, 298.0, 309.0, 309.0, 309.0, 0.010529696376204992, 0.01631897280179426, 0.023681533939843846], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 396.5384615384615, 282, 577, 293.0, 576.2, 577.0, 577.0, 0.06856395434695471, 0.1062607378404464, 0.15420194029398113], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3d9dabfd-3927-4fae-be16-a1b392fbffbd", 3, 0, 0.0, 672.3333333333334, 418, 1084, 515.0, 1084.0, 1084.0, 1084.0, 0.07056831012420023, 0.03193032261479112, 0.04525376658355288], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 7, 0, 0.0, 187.71428571428572, 142, 428, 148.0, 428.0, 428.0, 428.0, 0.03344929087503345, 0.027732859329007226, 0.011890177615734547], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 320.45, 140, 1999, 157.0, 1031.0000000000014, 1953.8999999999994, 1999.0, 0.08997984451482867, 0.06985739881766484, 0.03198502285488051], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/87bb72dc-aece-402a-b26a-a821bf23433d", 3, 0, 0.0, 1070.3333333333333, 961, 1127, 1123.0, 1127.0, 1127.0, 1127.0, 0.06897185948133162, 0.031207970273128563, 0.04423000103457789], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1af6eae6-2ffd-451e-b7e7-e6ff0e0d2dea", 1, 0, 0.0, 697.0, 697, 697, 697.0, 697.0, 697.0, 697.0, 1.4347202295552368, 0.45815772955523676, 0.8560684182209469], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3c4e055f-e2a2-4a98-851a-baf4ebf6d2a1", 3, 0, 0.0, 1564.3333333333333, 475, 2294, 1924.0, 2294.0, 2294.0, 2294.0, 0.059822924144532184, 0.027068315286751216, 0.038363007996330856], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2b0d3a48-e9bd-4c10-9a79-ee677e619afa", 3, 0, 0.0, 875.6666666666666, 703, 1148, 776.0, 1148.0, 1148.0, 1148.0, 0.059719319199761124, 0.02702143674728775, 0.03829656862745098], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/06542916-d165-4fe1-9333-7d7250136e01", 3, 0, 0.0, 1568.3333333333335, 673, 2632, 1400.0, 2632.0, 2632.0, 2632.0, 0.05550518973524025, 0.025114652907546855, 0.03559414836537216], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 163.8, 138, 451, 144.0, 272.2000000000001, 451.0, 451.0, 0.09613967171506765, 0.07144754899918603, 0.04825760865385232], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 197.46666666666667, 137, 434, 143.0, 423.2, 434.0, 434.0, 0.09614460148062687, 0.025726192193058363, 0.05483246803192001], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 275.1333333333333, 138, 432, 149.0, 432.0, 432.0, 432.0, 0.09596376408268238, 0.025865233287910485, 0.0564161972439207], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 266.4666666666667, 138, 584, 150.0, 492.80000000000007, 584.0, 584.0, 0.09587114917550812, 0.025840270676211172, 0.05645537397737441], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 23.333333333333332, 0.5809128630705395], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 13.333333333333334, 0.33195020746887965], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 10.0, 0.24896265560165975], "isController": false}, {"data": ["401/Unauthorized", 16, 53.333333333333336, 1.3278008298755186], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1205, 30, "401/Unauthorized", 16, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 7, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 142, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
