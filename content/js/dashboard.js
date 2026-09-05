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

    var data = {"OkPercent": 97.1875, "KoPercent": 2.8125};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7903871829105474, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.41509433962264153, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.71875, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4fa1791c-8f78-4cf9-a6dc-23731c71fbc7"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/281a69e2-f963-40e7-aa00-906a56af7808"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/62908abd-df8b-4d04-a273-64984f6b1220"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b06cf89e-b26e-4403-abfd-c1cd0d60402a"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.71875, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d2a67790-9053-4667-a7f1-b085a3f958ad"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c2c0c811-5cda-4d73-926b-31aaf04b3631"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e12cf164-5cf3-4f05-83bf-a732c73a00d2"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9355b8cf-0bce-4461-8978-ecfaa53b01dd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/60351912-07b8-4361-97d2-1f585b909a93"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=27312ad6-213e-4be2-b2d4-5698adf0ff04"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5ba3807c-c6c7-4eae-aff7-4596310a2f35"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b879d150-f8ea-4315-a9d7-61674c8ff2ce"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.22727272727272727, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b879d150-f8ea-4315-a9d7-61674c8ff2ce"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4a267d15-9937-4960-b278-ad646fd5eae0"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d2a67790-9053-4667-a7f1-b085a3f958ad"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.22727272727272727, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5333333333333333, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.14285714285714285, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=62908abd-df8b-4d04-a273-64984f6b1220"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b06cf89e-b26e-4403-abfd-c1cd0d60402a"], "isController": false}, {"data": [0.2966101694915254, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4fa1791c-8f78-4cf9-a6dc-23731c71fbc7"], "isController": false}, {"data": [0.8113207547169812, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8801169590643275, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a4d5df5b-a77a-47fe-ab5c-ad4649ff9a24"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=60351912-07b8-4361-97d2-1f585b909a93"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a4d5df5b-a77a-47fe-ab5c-ad4649ff9a24"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=281a69e2-f963-40e7-aa00-906a56af7808"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5ba3807c-c6c7-4eae-aff7-4596310a2f35"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/27312ad6-213e-4be2-b2d4-5698adf0ff04"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/0ef1bc30-96de-4a42-8814-53fb13b49758"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/e12cf164-5cf3-4f05-83bf-a732c73a00d2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c2c0c811-5cda-4d73-926b-31aaf04b3631"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/4a267d15-9937-4960-b278-ad646fd5eae0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1280, 36, 2.8125, 311.0343750000003, 77, 2965, 95.0, 807.8000000000002, 1042.7000000000003, 1748.5200000000004, 5.0003125195324705, 685.5533947251098, 3.653666922297878], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 53, 0, 0.0, 1332.1886792452833, 976, 1868, 1313.0, 1551.0, 1715.8, 1868.0, 0.24102302906828682, 290.03381321454236, 1.1851083509363518], "isController": true}, {"data": ["deleteBook", 16, 3, 18.75, 554.6875, 86, 1649, 530.5, 1043.5000000000007, 1649.0, 1649.0, 0.07661220815536957, 0.015482362133937293, 0.051384982630575934], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, 18.75, 554.6875, 86, 1649, 530.5, 1043.5000000000007, 1649.0, 1649.0, 0.07644785062089988, 0.015449147546740693, 0.05127474551227227], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 90.27777777777777, 78, 244, 81.5, 100.90000000000023, 244.0, 244.0, 0.08883186102748852, 0.03859405073286285, 0.04983297759463061], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 83.05555555555557, 80, 87, 82.5, 87.0, 87.0, 87.0, 0.08883054586370434, 0.06601566933816308, 0.04458877009174221], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 187.16666666666666, 79, 630, 84.5, 491.4000000000002, 630.0, 630.0, 0.08883186102748852, 2.9234511486453143, 0.05146194726842027], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 165.11111111111111, 78, 720, 82.0, 639.9000000000001, 720.0, 720.0, 0.08883142263523351, 8.902468110136159, 0.05137494386347597], "isController": false}, {"data": ["goToProfile", 16, 3, 18.75, 342.3125, 82, 2350, 193.0, 1064.1000000000013, 2350.0, 2350.0, 0.07656638065933224, 0.1317433372294455, 0.04948494902353938], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 21, 0, 0.0, 92.19047619047618, 80, 242, 82.0, 105.4, 228.69999999999982, 242.0, 0.10297853142806704, 0.07652994376636624, 0.05169039565822897], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 21, 0, 0.0, 105.33333333333334, 79, 249, 82.0, 244.0, 248.7, 249.0, 0.10298156139662612, 0.0349210168203217, 0.0583198221116124], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 589.0, 469, 701, 624.0, 701.0, 701.0, 701.0, 0.034858995363753614, 10.249702064524, 0.019880520793390734], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 796.3333333333334, 717, 887, 785.0, 887.0, 887.0, 887.0, 0.03484178924201688, 31.35070320529944, 0.019836682742281092], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 160.66666666666666, 81, 243, 157.5, 243.0, 243.0, 243.0, 0.03494039750525562, 0.06182812527297185, 0.019346880259257748], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4fa1791c-8f78-4cf9-a6dc-23731c71fbc7", 3, 0, 0.0, 716.6666666666666, 269, 1393, 488.0, 1393.0, 1393.0, 1393.0, 0.02987512199008146, 0.029962646761536774, 0.019158199974108225], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/281a69e2-f963-40e7-aa00-906a56af7808", 3, 0, 0.0, 374.6666666666667, 175, 512, 437.0, 512.0, 512.0, 512.0, 0.021078073183070093, 0.024913568921786297, 0.013516863336799505], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 18, 0, 0.0, 83.94444444444443, 78, 99, 82.5, 95.4, 99.0, 99.0, 0.10471021448142266, 0.0778168683792604, 0.052559619378370365], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 18, 0, 0.0, 99.88888888888889, 78, 240, 82.0, 239.1, 240.0, 240.0, 0.10471021448142266, 0.03675537585149765, 0.0592289874231398], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 18, 0, 0.0, 145.05555555555557, 79, 893, 82.5, 312.5000000000009, 893.0, 893.0, 0.10461406129221613, 5.256181174481724, 0.06100216638285259], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/62908abd-df8b-4d04-a273-64984f6b1220", 3, 0, 0.0, 408.66666666666663, 181, 752, 293.0, 752.0, 752.0, 752.0, 0.041378739603591674, 0.03449575264479111, 0.026535194342147003], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 18, 0, 0.0, 140.5, 79, 633, 84.5, 282.00000000000057, 633.0, 633.0, 0.10461527731766429, 1.7355397530788859, 0.0611050388238918], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 84.0, 83, 85, 84.0, 85.0, 85.0, 85.0, 0.034970537322305956, 0.025988846584252767, 0.019636776328443285], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b06cf89e-b26e-4403-abfd-c1cd0d60402a", 2, 0, 0.0, 198.5, 194, 203, 198.5, 203.0, 203.0, 203.0, 0.0168139286585007, 0.028439184020042203, 0.010451235928843453], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 502.5882352941176, 79, 968, 736.0, 954.4, 968.0, 968.0, 0.106311128899117, 50.65645289987055, 0.05766255049778623], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 21, 0, 0.0, 118.42857142857142, 78, 694, 82.0, 209.0000000000001, 648.5999999999993, 694.0, 0.10298055138729513, 4.438914794933847, 0.06011987733054795], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 398.0588235294117, 79, 717, 477.0, 657.8, 717.0, 717.0, 0.10631179373010563, 16.562471174651517, 0.05776673120939045], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 21, 0, 0.0, 123.09523809523812, 79, 637, 82.0, 239.8, 597.2999999999995, 637.0, 0.10298156139662612, 1.4683396828413104, 0.06022103490339349], "isController": false}, {"data": ["deleteBooks", 16, 3, 18.75, 426.74999999999994, 83, 836, 426.5, 821.3000000000001, 836.0, 836.0, 0.07696155770192789, 0.015552961276311233, 0.052032664469253864], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d2a67790-9053-4667-a7f1-b085a3f958ad", 3, 0, 0.0, 682.6666666666666, 195, 1021, 832.0, 1021.0, 1021.0, 1021.0, 0.07159221076746851, 0.03239361099179076, 0.04591036953512791], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 18, 0, 0.0, 248.61111111111111, 164, 973, 168.5, 398.8000000000009, 973.0, 973.0, 0.10456362115438238, 7.102741518365438, 0.23367972453294916], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c2c0c811-5cda-4d73-926b-31aaf04b3631", 1, 0, 0.0, 433.0, 433, 433, 433.0, 433.0, 433.0, 433.0, 2.3094688221709005, 0.417238019630485, 1.5922704965357968], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e12cf164-5cf3-4f05-83bf-a732c73a00d2", 1, 0, 0.0, 444.0, 444, 444, 444.0, 444.0, 444.0, 444.0, 2.2522522522522523, 0.4069010416666667, 1.5528223536036037], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 626.0000000000001, 105, 1418, 562.0, 1092.0, 1385.9999999999995, 1418.0, 0.09191538532242605, 0.05645974352324803, 0.04155939785574537], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 114.47058823529412, 80, 244, 84.0, 240.0, 244.0, 244.0, 0.10630913445604118, 0.07900512824321028, 0.05336220225625504], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9355b8cf-0bce-4461-8978-ecfaa53b01dd", 1, 0, 0.0, 219.0, 219, 219, 219.0, 219.0, 219.0, 219.0, 4.5662100456621, 1.4581549657534247, 2.724564783105023], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 158.17647058823533, 79, 252, 85.0, 248.0, 252.0, 252.0, 0.10620220900594733, 0.11286425014993252, 0.05584645112824229], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/60351912-07b8-4361-97d2-1f585b909a93", 3, 0, 0.0, 1062.3333333333333, 259, 2350, 578.0, 2350.0, 2350.0, 2350.0, 0.09373828271466067, 0.043451599800025, 0.060112114891888516], "isController": false}, {"data": ["login", 21, 0, 0.0, 2886.571428571429, 1714, 4334, 2806.0, 3979.0, 4304.9, 4334.0, 0.09266000397114303, 31.798462423059107, 0.18370414570785626], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 21, 0, 0.0, 96.38095238095238, 82, 235, 87.0, 107.4, 222.2999999999998, 235.0, 0.10035266794735785, 0.08124254075035123, 0.03567223743441236], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=27312ad6-213e-4be2-b2d4-5698adf0ff04", 1, 0, 0.0, 836.0, 836, 836, 836.0, 836.0, 836.0, 836.0, 1.1961722488038278, 0.2161053379186603, 0.8247046949760766], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5ba3807c-c6c7-4eae-aff7-4596310a2f35", 3, 0, 0.0, 361.6666666666667, 191, 468, 426.0, 468.0, 468.0, 468.0, 0.02668896678113268, 0.02676715711349928, 0.01711499497357792], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 637.2941176470588, 165, 1086, 826.0, 1046.8, 1086.0, 1086.0, 0.10614584439019212, 67.30600188408873, 0.22434651037731723], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b879d150-f8ea-4315-a9d7-61674c8ff2ce", 1, 0, 0.0, 815.0, 815, 815, 815.0, 815.0, 815.0, 815.0, 1.2269938650306749, 0.22167369631901843, 0.845954754601227], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 293.94444444444446, 161, 806, 247.0, 722.3000000000002, 806.0, 806.0, 0.0887941751021133, 11.925512478048105, 0.1971758673464354], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 6, 50.0, 481.5833333333333, 81, 971, 442.5, 971.0, 971.0, 971.0, 0.05933837709538644, 35.502603007713994, 0.08655927811155616], "isController": false}, {"data": ["register", 22, 7, 31.818181818181817, 1164.9090909090908, 171, 1992, 1100.0, 1845.8999999999999, 1978.0499999999997, 1992.0, 0.09424788049368753, 0.029502665715619873, 0.04252199295711293], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/b879d150-f8ea-4315-a9d7-61674c8ff2ce", 3, 0, 0.0, 299.6666666666667, 181, 433, 285.0, 433.0, 433.0, 433.0, 0.03526300323244196, 0.028869288128122245, 0.022613319130179253], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4a267d15-9937-4960-b278-ad646fd5eae0", 1, 0, 0.0, 405.0, 405, 405, 405.0, 405.0, 405.0, 405.0, 2.4691358024691357, 0.44608410493827155, 1.7023533950617282], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 21, 0, 0.0, 235.23809523809524, 163, 784, 168.0, 456.6000000000001, 753.7999999999995, 784.0, 0.10293713972001099, 6.016155003725344, 0.23025387637984784], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 89.93333333333334, 83, 106, 90.0, 104.8, 106.0, 106.0, 0.12270340133828511, 0.09526289459368814, 0.043617224694468534], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 317.53333333333336, 166, 966, 321.0, 672.6000000000001, 966.0, 966.0, 0.08142570989648078, 6.612011496631689, 0.1817394278893913], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d2a67790-9053-4667-a7f1-b085a3f958ad", 1, 0, 0.0, 423.0, 423, 423, 423.0, 423.0, 423.0, 423.0, 2.3640661938534278, 0.4271018026004728, 1.6299128250591017], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 2, 0, 0.0, 80.0, 78, 82, 80.0, 82.0, 82.0, 82.0, 0.15824036711765171, 0.11759855407864547, 0.07942924677585253], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 2, 0, 0.0, 160.5, 81, 240, 160.5, 240.0, 240.0, 240.0, 0.1562744178777934, 0.041815615721206435, 0.08912525394592904], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 2, 0, 0.0, 80.5, 79, 82, 80.5, 82.0, 82.0, 82.0, 0.1582654110944053, 0.04265747408403893, 0.09304275144417187], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 2, 0, 0.0, 161.0, 81, 241, 161.0, 241.0, 241.0, 241.0, 0.15626220798499882, 0.04211754824595672, 0.09201768692866631], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 86.0, 83, 90, 85.0, 90.0, 90.0, 90.0, 0.2678332291759664, 0.07898987813588072, 0.16556487701990893], "isController": false}, {"data": ["https://demoqa.com/books", 53, 0, 0.0, 913.2452830188679, 618, 1488, 882.0, 1210.2, 1358.3, 1488.0, 0.24310922943548202, 290.8431568478824, 0.4800457635923288], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, 31.818181818181817, 1164.9090909090908, 171, 1992, 1100.0, 1845.8999999999999, 1978.0499999999997, 1992.0, 0.09239233143649077, 0.028921818239086156, 0.041684821409822985], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 80.83333333333334, 78, 82, 81.5, 82.0, 82.0, 82.0, 0.035664610007489564, 0.009612726916081173, 0.021001718588394735], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 80.66666666666666, 77, 83, 81.0, 83.0, 83.0, 83.0, 0.035664186024394307, 0.009612612639387527, 0.020966640611997434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 112.93333333333332, 79, 243, 82.0, 241.2, 243.0, 243.0, 0.13140834705820514, 0.035418656043031856, 0.07725373528226513], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 123.86666666666667, 78, 244, 82.0, 242.2, 244.0, 244.0, 0.1314071958580452, 0.03541834575861374, 0.07738138584218872], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 81.83333333333334, 80, 83, 82.0, 83.0, 83.0, 83.0, 0.035663974036626904, 0.009542899302769308, 0.02033961019276378], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 111.46666666666668, 82, 309, 83.0, 284.40000000000003, 309.0, 309.0, 0.13157779317725282, 0.09778388731239199, 0.06604588446592574], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 86.33333333333333, 80, 101, 83.5, 101.0, 101.0, 101.0, 0.035662702162942886, 0.02650323861914017, 0.01790100479663344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 113.19999999999999, 80, 243, 82.0, 242.4, 243.0, 243.0, 0.13159164480783234, 0.03521104558334576, 0.07504835992946687], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 90.33333333333334, 85, 106, 85.5, 106.0, 106.0, 106.0, 0.037117458196462706, 0.02921549932260639, 0.013194096468273853], "isController": false}, {"data": ["deleteAccount", 15, 3, 20.0, 476.79999999999995, 81, 832, 506.0, 784.0, 832.0, 832.0, 0.07469040825777154, 0.014792201947925847, 0.050824488744155474], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1673.5714285714287, 1089, 2771, 1654.0, 2273.0, 2723.399999999999, 2771.0, 0.0925485218678936, 0.04790109041990587, 0.04256870488259559], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 169.16666666666666, 160, 185, 167.0, 185.0, 185.0, 185.0, 0.03564575251154031, 0.05524395433185007, 0.08016813284577864], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=62908abd-df8b-4d04-a273-64984f6b1220", 1, 0, 0.0, 800.0, 800, 800, 800.0, 800.0, 800.0, 800.0, 1.25, 0.225830078125, 0.86181640625], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b06cf89e-b26e-4403-abfd-c1cd0d60402a", 1, 0, 0.0, 430.0, 430, 430, 430.0, 430.0, 430.0, 430.0, 2.3255813953488373, 0.42014898255813954, 1.6033793604651163], "isController": false}, {"data": ["addBook", 59, 17, 28.8135593220339, 922.220338983051, 415, 3974, 723.0, 1564.0, 1670.0, 3974.0, 0.2784305952751744, 80.12036703582316, 1.0124078583496146], "isController": true}, {"data": ["https://demoqa.com/books-0", 53, 0, 0.0, 148.28301886792448, 80, 349, 84.0, 329.0, 336.6, 349.0, 0.24380482733558126, 0.1811869859398216, 0.11785487258897726], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4fa1791c-8f78-4cf9-a6dc-23731c71fbc7", 1, 0, 0.0, 483.0, 483, 483, 483.0, 483.0, 483.0, 483.0, 2.070393374741201, 0.37404567805383027, 1.427439182194617], "isController": false}, {"data": ["https://demoqa.com/books-3", 53, 0, 0.0, 512.2641509433963, 387, 801, 478.0, 646.6, 731.8, 801.0, 0.24368376284512286, 71.65111733890434, 0.12255579869652175], "isController": false}, {"data": ["https://demoqa.com/books-1", 53, 0, 0.0, 143.67924528301884, 79, 335, 86.0, 248.0, 333.6, 335.0, 0.24395969601701273, 0.4316943058426046, 0.11864446153952378], "isController": false}, {"data": ["https://demoqa.com/books-2", 53, 0, 0.0, 763.5094339622642, 534, 1119, 768.0, 965.4, 1065.2, 1119.0, 0.24352141150523798, 219.12099413739435, 0.12223633350946518], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 89.93333333333332, 83, 113, 87.0, 108.2, 113.0, 113.0, 0.08624803785713875, 0.06443334859444448, 0.03065848220702979], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 17, 9.941520467836257, 175.1345029239767, 80, 2965, 90.0, 299.6, 436.60000000000025, 2717.3200000000006, 0.7107261459939568, 1.491752095810872, 0.34229753786383155], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a4d5df5b-a77a-47fe-ab5c-ad4649ff9a24", 3, 0, 0.0, 404.3333333333333, 232, 580, 401.0, 580.0, 580.0, 580.0, 0.04096681687832855, 0.026337715929263962, 0.026271038167417722], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 2, 0, 0.0, 88.0, 85, 91, 88.0, 91.0, 91.0, 91.0, 0.1345351809498184, 0.10418593602852146, 0.047823052603255756], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=60351912-07b8-4361-97d2-1f585b909a93", 1, 0, 0.0, 270.0, 270, 270, 270.0, 270.0, 270.0, 270.0, 3.7037037037037037, 0.6691261574074073, 2.5535300925925926], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a4d5df5b-a77a-47fe-ab5c-ad4649ff9a24", 1, 0, 0.0, 395.0, 395, 395, 395.0, 395.0, 395.0, 395.0, 2.5316455696202533, 0.4573773734177215, 1.7454509493670884], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 103.83333333333333, 82, 246, 84.5, 243.3, 246.0, 246.0, 0.08611739714951415, 0.06988628616332643, 0.03061204351799136], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=281a69e2-f963-40e7-aa00-906a56af7808", 1, 0, 0.0, 432.0, 432, 432, 432.0, 432.0, 432.0, 432.0, 2.314814814814815, 0.41820384837962965, 1.5959563078703705], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5ba3807c-c6c7-4eae-aff7-4596310a2f35", 1, 0, 0.0, 404.0, 404, 404, 404.0, 404.0, 404.0, 404.0, 2.4752475247524752, 0.44718827351485146, 1.7065671410891088], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 2, 0, 0.0, 242.0, 164, 320, 242.0, 320.0, 320.0, 320.0, 0.15526744817948918, 0.24063421900473567, 0.34920013003648787], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/27312ad6-213e-4be2-b2d4-5698adf0ff04", 3, 0, 0.0, 421.66666666666663, 172, 727, 366.0, 727.0, 727.0, 727.0, 0.04042854255104104, 0.025991657401792333, 0.025925855737484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 257.06666666666666, 164, 552, 171.0, 526.2, 552.0, 552.0, 0.13130022233504315, 0.20348970004464206, 0.295297277380473], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 18, 0, 0.0, 112.88888888888889, 82, 242, 86.0, 239.3, 242.0, 242.0, 0.10635343610226473, 0.08817780004963159, 0.03780532298947691], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0ef1bc30-96de-4a42-8814-53fb13b49758", 1, 0, 0.0, 704.0, 704, 704, 704.0, 704.0, 704.0, 704.0, 1.4204545454545454, 0.45360218394886365, 0.8475563742897728], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e12cf164-5cf3-4f05-83bf-a732c73a00d2", 3, 0, 0.0, 414.3333333333333, 200, 537, 506.0, 537.0, 537.0, 537.0, 0.039683589512950077, 0.03308257576258631, 0.02544813520198947], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 98.11764705882354, 83, 243, 86.0, 138.99999999999991, 243.0, 243.0, 0.10599693232407627, 0.08229254023207093, 0.037678597037073984], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c2c0c811-5cda-4d73-926b-31aaf04b3631", 3, 0, 0.0, 292.6666666666667, 186, 492, 200.0, 492.0, 492.0, 492.0, 0.04645976584278015, 0.029445691437465154, 0.02979353473641826], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4a267d15-9937-4960-b278-ad646fd5eae0", 3, 0, 0.0, 513.0, 490, 536, 513.0, 536.0, 536.0, 536.0, 0.017824358768693295, 0.024572317508273475, 0.011430334236434178], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 94.53333333333333, 78, 233, 84.0, 156.80000000000004, 233.0, 233.0, 0.08146197083661444, 0.060539609186194915, 0.04089009083009749], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 114.13333333333334, 78, 250, 82.0, 244.0, 250.0, 250.0, 0.08146374048910829, 0.029954896242349198, 0.046003677409018576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 198.40000000000003, 78, 883, 86.0, 499.60000000000025, 883.0, 883.0, 0.08146285565325065, 4.9071877138399955, 0.04742453484709422], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 174.20000000000002, 80, 659, 85.0, 409.40000000000015, 659.0, 659.0, 0.0814624132425299, 1.6173365083308895, 0.04750383043055601], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 19.444444444444443, 0.546875], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 8.333333333333334, 0.234375], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 8.333333333333334, 0.234375], "isController": false}, {"data": ["401/Unauthorized", 23, 63.888888888888886, 1.796875], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1280, 36, "401/Unauthorized", 23, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 17, "401/Unauthorized", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
