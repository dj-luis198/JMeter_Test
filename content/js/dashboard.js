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

    var data = {"OkPercent": 97.59579263711495, "KoPercent": 2.4042073628850487};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7482360487491982, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3a29a63a-bc7b-4089-8be4-5afd8a6fc5be"], "isController": false}, {"data": [0.0625, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a9a934c4-1ac4-42dd-a8f5-705d9e038b5f"], "isController": false}, {"data": [0.46875, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.46875, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c590786b-d350-4576-a273-d6819cb15034"], "isController": false}, {"data": [0.8125, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1e95197f-73ec-40dc-90b8-fc85ca790f76"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=52db40fd-c2e5-4f9d-b337-fe3e63cfdc19"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fc668a8e-a81e-4f68-9928-fc251b9e6bf0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.725, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5625, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/77effd2b-1259-4e54-8e89-0aac328ff7f4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3640e6d6-79b8-416a-9c43-48c9980fb85c"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5869565217391305, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/74bfce1e-d717-4109-a026-52bea46167ac"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a9fbb8f3-ccde-419c-9e77-7993864e0fff"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b423d4c4-e05a-4184-a422-d0493fbbcc79"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=374eef56-cb56-45ad-a158-e3247c8a9eea"], "isController": false}, {"data": [0.9565217391304348, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2692307692307692, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bd2bff4f-d03e-4b74-9ca7-1b487b5bd855"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d4bf9c71-157a-44fc-902c-d76043f61b32"], "isController": false}, {"data": [0.19230769230769232, 500, 1500, "register"], "isController": true}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/1e95197f-73ec-40dc-90b8-fc85ca790f76"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/52db40fd-c2e5-4f9d-b337-fe3e63cfdc19"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.19230769230769232, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/9a914de9-a695-44a3-82fc-8c66a6d6e46d"], "isController": false}, {"data": [0.5625, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3a29a63a-bc7b-4089-8be4-5afd8a6fc5be"], "isController": false}, {"data": [0.17391304347826086, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a9fbb8f3-ccde-419c-9e77-7993864e0fff"], "isController": false}, {"data": [0.2796610169491525, 500, 1500, "addBook"], "isController": true}, {"data": [0.9821428571428571, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3640e6d6-79b8-416a-9c43-48c9980fb85c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fc668a8e-a81e-4f68-9928-fc251b9e6bf0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.49107142857142855, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=77effd2b-1259-4e54-8e89-0aac328ff7f4"], "isController": false}, {"data": [0.9080459770114943, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.9782608695652174, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9983191b-ba70-4771-8357-d8ae04f1b87a"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/374eef56-cb56-45ad-a158-e3247c8a9eea"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b423d4c4-e05a-4184-a422-d0493fbbcc79"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9a914de9-a695-44a3-82fc-8c66a6d6e46d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a9a934c4-1ac4-42dd-a8f5-705d9e038b5f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d4bf9c71-157a-44fc-902c-d76043f61b32"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bd2bff4f-d03e-4b74-9ca7-1b487b5bd855"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1331, 32, 2.4042073628850487, 427.40270473328366, 101, 4664, 138.0, 1136.8, 1365.9999999999986, 2251.880000000001, 5.228527095240901, 745.9165597133837, 3.8150788477402626], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/3a29a63a-bc7b-4089-8be4-5afd8a6fc5be", 3, 0, 0.0, 588.6666666666667, 226, 1303, 237.0, 1303.0, 1303.0, 1303.0, 0.01912899317732577, 0.026370861362621945, 0.01226696502582414], "isController": false}, {"data": ["see books", 56, 0, 0.0, 1904.875, 1351, 5112, 1820.0, 2257.3, 2433.649999999999, 5112.0, 0.23951788471490956, 288.2212510706129, 1.177707567909736], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a9a934c4-1ac4-42dd-a8f5-705d9e038b5f", 1, 0, 0.0, 425.0, 425, 425, 425.0, 425.0, 425.0, 425.0, 2.352941176470588, 0.4250919117647059, 1.6222426470588236], "isController": false}, {"data": ["deleteBook", 16, 3, 18.75, 590.6875000000001, 117, 1211, 593.0, 1033.2000000000003, 1211.0, 1211.0, 0.10794254757905104, 0.021813829042617066, 0.07239872163978223], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, 18.75, 590.6875000000001, 117, 1211, 593.0, 1033.2000000000003, 1211.0, 1211.0, 0.10882502975684408, 0.021992167573541915, 0.07299061596667233], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 23, 0, 0.0, 150.2173913043478, 102, 339, 113.0, 326.6, 336.59999999999997, 339.0, 0.11783269806139597, 0.03152945241095947, 0.06720146061313988], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 23, 0, 0.0, 134.95652173913044, 103, 345, 115.0, 259.0000000000003, 343.0, 345.0, 0.11782907611758317, 0.08756633488816483, 0.05914467297308374], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 23, 0, 0.0, 167.82608695652178, 106, 342, 114.0, 333.6, 341.6, 342.0, 0.1178363202278852, 0.03176057068642218, 0.06938994247794411], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 23, 0, 0.0, 138.60869565217394, 103, 328, 111.0, 319.8, 327.4, 328.0, 0.11783390542548286, 0.031759919821712175, 0.06927344830677801], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c590786b-d350-4576-a273-d6819cb15034", 1, 0, 0.0, 461.0, 461, 461, 461.0, 461.0, 461.0, 461.0, 2.1691973969631237, 0.6927026843817787, 1.29431602494577], "isController": false}, {"data": ["goToProfile", 16, 3, 18.75, 306.18750000000006, 112, 494, 346.5, 478.6, 494.0, 494.0, 0.1078835936025029, 0.19333972627909488, 0.06972530350689107], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1e95197f-73ec-40dc-90b8-fc85ca790f76", 1, 0, 0.0, 1070.0, 1070, 1070, 1070.0, 1070.0, 1070.0, 1070.0, 0.9345794392523364, 0.16884491822429906, 0.644348714953271], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=52db40fd-c2e5-4f9d-b337-fe3e63cfdc19", 1, 0, 0.0, 902.0, 902, 902, 902.0, 902.0, 902.0, 902.0, 1.1086474501108647, 0.2002927522172949, 0.7643604490022172], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fc668a8e-a81e-4f68-9928-fc251b9e6bf0", 3, 0, 0.0, 486.3333333333333, 425, 580, 454.0, 580.0, 580.0, 580.0, 0.02362111727884729, 0.027919360950356287, 0.015147656588323295], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 13, 0, 0.0, 111.99999999999999, 104, 119, 111.0, 117.8, 119.0, 119.0, 0.1213173194471663, 0.09015867197196636, 0.0608956076131284], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 13, 0, 0.0, 111.92307692307693, 104, 116, 113.0, 115.2, 116.0, 116.0, 0.12132411270076808, 0.04648084245597335, 0.0684088634263796], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 753.5714285714286, 509, 900, 859.0, 900.0, 900.0, 900.0, 0.07794319054883142, 22.917885978855125, 0.044451975859880415], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1121.7142857142858, 750, 1352, 1182.0, 1352.0, 1352.0, 1352.0, 0.07770870337477798, 69.92242789395537, 0.04424235748778863], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 142.0, 106, 339, 109.0, 339.0, 339.0, 339.0, 0.07863754830592252, 0.13915159915071448, 0.043542470595173896], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 123.00000000000001, 107, 193, 114.0, 180.80000000000004, 193.0, 193.0, 0.0546967067610102, 0.04064862680188355, 0.027455182885897697], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 131.1818181818182, 104, 333, 113.0, 289.8000000000002, 333.0, 333.0, 0.05463829449047307, 0.022080390316107368, 0.030743742052611708], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 226.36363636363637, 104, 1393, 111.0, 1137.8000000000009, 1393.0, 1393.0, 0.054352391258159036, 4.459352170451569, 0.031528633210299285], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 201.54545454545456, 106, 664, 115.0, 595.8000000000002, 664.0, 664.0, 0.05454888075614667, 1.4714734923433208, 0.03169588286123757], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 112.71428571428571, 109, 119, 113.0, 119.0, 119.0, 119.0, 0.07863578152733154, 0.05843928685771417, 0.04415583435372621], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 646.6999999999999, 101, 1553, 646.5, 1284.5000000000002, 1540.1, 1553.0, 0.09240820400035116, 41.58698564727326, 0.050355251789253846], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 13, 0, 0.0, 195.15384615384613, 102, 1230, 109.0, 783.9999999999997, 1230.0, 1230.0, 0.12007352194112703, 8.34082530053017, 0.0697963426067038], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 514.0, 102, 1000, 494.0, 918.6, 995.9499999999999, 1000.0, 0.09241119284367723, 13.598433370374819, 0.050447125780874576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 13, 0, 0.0, 213.46153846153845, 105, 859, 114.0, 699.7999999999998, 859.0, 859.0, 0.12048639430562764, 2.755130664019055, 0.07015399956902943], "isController": false}, {"data": ["deleteBooks", 16, 3, 18.75, 598.3750000000001, 113, 1785, 474.5, 1284.5000000000005, 1785.0, 1785.0, 0.10915392067238816, 0.022058632284318674, 0.07379748408740501], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/77effd2b-1259-4e54-8e89-0aac328ff7f4", 3, 0, 0.0, 1308.6666666666667, 342, 3103, 481.0, 3103.0, 3103.0, 3103.0, 0.03229383080185581, 0.03238844163428313, 0.020709259986867175], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3640e6d6-79b8-416a-9c43-48c9980fb85c", 1, 0, 0.0, 486.0, 486, 486, 486.0, 486.0, 486.0, 486.0, 2.05761316872428, 0.37173675411522633, 1.418627829218107], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 392.72727272727275, 227, 1506, 242.0, 1292.000000000001, 1506.0, 1506.0, 0.05432018291087046, 5.98433456850022, 0.12090388012770183], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 843.7826086956521, 154, 1967, 823.0, 1692.0000000000002, 1920.3999999999994, 1967.0, 0.104063922395461, 0.06392207733080564, 0.04705233991122895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 125.84999999999998, 103, 345, 114.0, 131.20000000000002, 334.34999999999985, 345.0, 0.09239795800512808, 0.06866684183779538, 0.04637944376429281], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 215.95, 106, 442, 115.5, 341.9, 436.99999999999994, 442.0, 0.0923177762494057, 0.09403070373840836, 0.048773356397391096], "isController": false}, {"data": ["login", 23, 0, 0.0, 3707.0, 2035, 6110, 3139.0, 5837.8, 6083.4, 6110.0, 0.10228905106892058, 37.382535235520535, 0.20595486968152527], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/74bfce1e-d717-4109-a026-52bea46167ac", 1, 0, 0.0, 249.0, 249, 249, 249.0, 249.0, 249.0, 249.0, 4.016064257028112, 1.2824736445783134, 2.3963039658634537], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 13, 0, 0.0, 138.23076923076923, 115, 339, 120.0, 258.19999999999993, 339.0, 339.0, 0.1273249037717554, 0.10307846213553247, 0.045260024387616185], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a9fbb8f3-ccde-419c-9e77-7993864e0fff", 1, 0, 0.0, 503.0, 503, 503, 503.0, 503.0, 503.0, 503.0, 1.9880715705765406, 0.3591730864811133, 1.3706821570576542], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b423d4c4-e05a-4184-a422-d0493fbbcc79", 3, 0, 0.0, 564.0, 351, 913, 428.0, 913.0, 913.0, 913.0, 0.030167732593218293, 0.025149597386468766, 0.019345844143437513], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 809.2999999999997, 221, 1669, 882.0, 1394.6000000000001, 1655.7499999999998, 1669.0, 0.09226071031520872, 55.25943531543937, 0.19569361602014976], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=374eef56-cb56-45ad-a158-e3247c8a9eea", 1, 0, 0.0, 433.0, 433, 433, 433.0, 433.0, 433.0, 433.0, 2.3094688221709005, 0.417238019630485, 1.5922704965357968], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 23, 0, 0.0, 343.26086956521743, 219, 676, 236.0, 592.8000000000003, 675.2, 676.0, 0.11776090440374581, 0.18250640164916465, 0.2648470340252213], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 6, 46.15384615384615, 717.2307692307693, 112, 1471, 859.0, 1416.2, 1471.0, 1471.0, 0.1361427613941019, 87.71823750104726, 0.20693454282213472], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bd2bff4f-d03e-4b74-9ca7-1b487b5bd855", 1, 0, 0.0, 225.0, 225, 225, 225.0, 225.0, 225.0, 225.0, 4.444444444444445, 0.8029513888888888, 3.064236111111111], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d4bf9c71-157a-44fc-902c-d76043f61b32", 1, 0, 0.0, 357.0, 357, 357, 357.0, 357.0, 357.0, 357.0, 2.8011204481792715, 0.506061799719888, 1.9312412464985995], "isController": false}, {"data": ["register", 26, 10, 38.46153846153846, 1266.7692307692305, 147, 2609, 1186.5, 2377.4, 2542.1499999999996, 2609.0, 0.1020127908345431, 0.031695079844626675, 0.04602530211480362], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 12, 0, 0.0, 169.16666666666666, 111, 548, 116.0, 482.30000000000024, 548.0, 548.0, 0.05562534476125138, 0.043185692466010596, 0.019773071770601076], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 13, 0, 0.0, 357.0, 218, 1346, 229.0, 1035.9999999999998, 1346.0, 1346.0, 0.11994058328028269, 11.209326879607334, 0.26738857346822037], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1e95197f-73ec-40dc-90b8-fc85ca790f76", 3, 0, 0.0, 551.3333333333334, 360, 705, 589.0, 705.0, 705.0, 705.0, 0.01809092498899469, 0.024939800562627765, 0.011601276767031097], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 575.9333333333334, 229, 1502, 442.0, 1374.8000000000002, 1502.0, 1502.0, 0.10408932251729618, 25.03445790280833, 0.22877288013420582], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/52db40fd-c2e5-4f9d-b337-fe3e63cfdc19", 3, 0, 0.0, 972.6666666666667, 446, 2000, 472.0, 2000.0, 2000.0, 2000.0, 0.019240389425481973, 0.026524430083631558, 0.01233840077089827], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 113.85714285714286, 109, 123, 113.0, 123.0, 123.0, 123.0, 0.044613551047462445, 0.03315518783898332, 0.0223939113656208], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 111.71428571428571, 108, 118, 110.0, 118.0, 118.0, 118.0, 0.0446149727848666, 0.011937990764700633, 0.025444476666369235], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 110.0, 103, 113, 112.0, 113.0, 113.0, 113.0, 0.04461440407903123, 0.012024976099426385, 0.02622838989802422], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 204.7142857142857, 103, 342, 114.0, 342.0, 342.0, 342.0, 0.044550800641531524, 0.012007832985412796, 0.026234504674651868], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 117.66666666666667, 113, 124, 116.0, 124.0, 124.0, 124.0, 0.08889152271178405, 0.026216054549764434, 0.054949544801327445], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1320.8214285714282, 826, 4664, 1193.5, 1775.1000000000001, 1884.05, 4664.0, 0.23084501642709626, 276.1708943595494, 0.4558287336089733], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 10, 38.46153846153846, 1266.7692307692305, 147, 2609, 1186.5, 2377.4, 2542.1499999999996, 2609.0, 0.10273228362012762, 0.03191862417764783, 0.04634991702392477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 14, 0, 0.0, 138.64285714285714, 102, 313, 111.5, 311.5, 313.0, 313.0, 0.06173683351780887, 0.016640005909096922, 0.03635479551878784], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 14, 0, 0.0, 141.21428571428572, 103, 341, 113.0, 327.5, 341.0, 341.0, 0.06173601679219657, 0.01663978577602173, 0.036294025496974934], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 12, 0, 0.0, 239.1666666666667, 104, 1450, 108.0, 1116.1000000000013, 1450.0, 1450.0, 0.05694544626248055, 4.2840372497366275, 0.03306988155347177], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 12, 0, 0.0, 227.33333333333334, 104, 866, 113.0, 707.0000000000006, 866.0, 866.0, 0.05688821465819664, 1.4079740536408458, 0.033092200388736136], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 14, 0, 0.0, 128.2857142857143, 103, 335, 113.0, 225.5, 335.0, 335.0, 0.06173601679219657, 0.016519207618224473, 0.03520882207679961], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 12, 0, 0.0, 113.99999999999999, 105, 123, 114.5, 122.4, 123.0, 123.0, 0.05694571649575042, 0.04232001001295515, 0.028584080350405976], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 14, 0, 0.0, 128.42857142857144, 104, 312, 116.0, 216.0, 312.0, 312.0, 0.06173438340579774, 0.045878775167785234, 0.03098776667048832], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 12, 0, 0.0, 128.25, 103, 339, 109.0, 271.5000000000002, 339.0, 339.0, 0.056884708916204084, 0.022340950946419344, 0.03204394165999061], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 14, 0, 0.0, 149.6428571428571, 116, 333, 120.0, 307.0, 333.0, 333.0, 0.0621661345541578, 0.04893154731508905, 0.02209811814229828], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9a914de9-a695-44a3-82fc-8c66a6d6e46d", 3, 0, 0.0, 1084.3333333333333, 362, 2427, 464.0, 2427.0, 2427.0, 2427.0, 0.03280875775106902, 0.027351311393387943, 0.02103947030260611], "isController": false}, {"data": ["deleteAccount", 16, 3, 18.75, 554.9374999999999, 112, 1303, 492.0, 1137.8000000000002, 1303.0, 1303.0, 0.11143302874972143, 0.021947899400351013, 0.07582805404850122], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3a29a63a-bc7b-4089-8be4-5afd8a6fc5be", 1, 0, 0.0, 1785.0, 1785, 1785, 1785.0, 1785.0, 1785.0, 1785.0, 0.5602240896358543, 0.10121235994397759, 0.3862482492997199], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1955.3478260869567, 1184, 4548, 1733.0, 3289.600000000001, 4347.599999999997, 4548.0, 0.10230907125604402, 0.05295293727119466, 0.04705817632968431], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 14, 0, 0.0, 288.5, 214, 648, 232.0, 551.0, 648.0, 648.0, 0.061703637429426465, 0.09562858652392559, 0.13877292675778238], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a9fbb8f3-ccde-419c-9e77-7993864e0fff", 3, 0, 0.0, 397.6666666666667, 273, 532, 388.0, 532.0, 532.0, 532.0, 0.059135439869113564, 0.038711383325777136, 0.037922140801482325], "isController": false}, {"data": ["addBook", 59, 10, 16.949152542372882, 1294.033898305085, 581, 4783, 1027.0, 2279.0, 2715.0, 4783.0, 0.2778052443979866, 91.25391417730802, 1.008152178711172], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 215.71428571428572, 107, 704, 117.0, 459.5, 490.4499999999998, 704.0, 0.23181494544069675, 0.17227653660192407, 0.11205898241518057], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3640e6d6-79b8-416a-9c43-48c9980fb85c", 3, 0, 0.0, 483.3333333333333, 391, 615, 444.0, 615.0, 615.0, 615.0, 0.04466346082270095, 0.02871430179844869, 0.028641607363515908], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fc668a8e-a81e-4f68-9928-fc251b9e6bf0", 1, 0, 0.0, 463.0, 463, 463, 463.0, 463.0, 463.0, 463.0, 2.1598272138228944, 0.3902031587473002, 1.4890996220302375], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 707.5357142857141, 517, 1027, 673.0, 899.5, 906.5, 1027.0, 0.23170560148291586, 68.12914018602649, 0.1165316257458024], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 209.46428571428572, 102, 455, 120.0, 341.0, 346.15, 455.0, 0.23220520305515702, 0.4108943632186958, 0.11292792101705879], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1102.3392857142853, 715, 4545, 1015.0, 1341.0, 1369.6499999999999, 4545.0, 0.23155422503762757, 208.35289871776848, 0.1162293668645904], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 119.46666666666668, 111, 145, 117.0, 138.4, 145.0, 145.0, 0.10351252501552688, 0.07733113441101373, 0.03679546787661307], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=77effd2b-1259-4e54-8e89-0aac328ff7f4", 1, 0, 0.0, 836.0, 836, 836, 836.0, 836.0, 836.0, 836.0, 1.1961722488038278, 0.2161053379186603, 0.8247046949760766], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 10, 5.747126436781609, 229.63793103448273, 105, 3376, 122.0, 450.0, 547.5, 1584.25, 0.7098390215644199, 1.5752979462602905, 0.3404817828382138], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 155.57142857142858, 115, 345, 119.0, 345.0, 345.0, 345.0, 0.04525208644441427, 0.03504385210002004, 0.01608570260328789], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 23, 0, 0.0, 150.04347826086956, 108, 602, 117.0, 258.4000000000003, 549.1999999999992, 602.0, 0.11799107371877084, 0.09575252173857282, 0.041942139485969324], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 320.57142857142856, 222, 458, 230.0, 458.0, 458.0, 458.0, 0.04451850061689922, 0.06899498093654206, 0.10012315128976457], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9983191b-ba70-4771-8357-d8ae04f1b87a", 1, 0, 0.0, 355.0, 355, 355, 355.0, 355.0, 355.0, 355.0, 2.8169014084507045, 0.8995378521126761, 1.6807878521126762], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 12, 0, 0.0, 412.25, 215, 1572, 235.0, 1236.300000000001, 1572.0, 1572.0, 0.0568542541195645, 5.748891379059157, 0.12665432554272124], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/374eef56-cb56-45ad-a158-e3247c8a9eea", 3, 0, 0.0, 375.3333333333333, 235, 469, 422.0, 469.0, 469.0, 469.0, 0.034596489609520956, 0.028841669886062227, 0.02218589991235556], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b423d4c4-e05a-4184-a422-d0493fbbcc79", 1, 0, 0.0, 1070.0, 1070, 1070, 1070.0, 1070.0, 1070.0, 1070.0, 0.9345794392523364, 0.16884491822429906, 0.644348714953271], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 137.36363636363637, 110, 344, 116.0, 301.8000000000002, 344.0, 344.0, 0.05358090960900549, 0.044424015876997715, 0.01904633896257617], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9a914de9-a695-44a3-82fc-8c66a6d6e46d", 1, 0, 0.0, 666.0, 666, 666, 666.0, 666.0, 666.0, 666.0, 1.5015015015015014, 0.2712673611111111, 1.0352149024024024], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 121.10000000000001, 109, 143, 119.5, 131.0, 142.39999999999998, 143.0, 0.0890967813787727, 0.06917181757434013, 0.0316711215057356], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a9a934c4-1ac4-42dd-a8f5-705d9e038b5f", 3, 0, 0.0, 373.3333333333333, 232, 503, 385.0, 503.0, 503.0, 503.0, 0.07379529186037931, 0.03339044781442944, 0.04732315265786043], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d4bf9c71-157a-44fc-902c-d76043f61b32", 3, 0, 0.0, 315.0, 234, 460, 251.0, 460.0, 460.0, 460.0, 0.056879585916614524, 0.025181066681834556, 0.03647551570824564], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 129.60000000000002, 106, 314, 115.0, 218.00000000000006, 314.0, 314.0, 0.10494794581887383, 0.07799354176578417, 0.052678949366114405], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bd2bff4f-d03e-4b74-9ca7-1b487b5bd855", 3, 0, 0.0, 589.3333333333334, 207, 1067, 494.0, 1067.0, 1067.0, 1067.0, 0.09615692810667008, 0.04256947338055707, 0.06166313423507164], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 210.79999999999998, 104, 337, 119.0, 335.8, 337.0, 337.0, 0.10495382031905962, 0.059610490134340895, 0.05809357945004199], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 334.26666666666665, 103, 1187, 113.0, 1182.2, 1187.0, 1187.0, 0.10417390096534482, 18.769634338756163, 0.0594523708243628], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 365.1333333333334, 111, 869, 315.0, 862.4, 869.0, 869.0, 0.10439866369710468, 6.161845659625556, 0.059682595437778395], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 10, 31.25, 0.7513148009015778], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 9.375, 0.22539444027047334], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 9.375, 0.22539444027047334], "isController": false}, {"data": ["401/Unauthorized", 16, 50.0, 1.2021036814425243], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1331, 32, "401/Unauthorized", 16, "406/Not Acceptable", 10, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 10, "406/Not Acceptable", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
