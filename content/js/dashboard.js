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

    var data = {"OkPercent": 98.65067466266866, "KoPercent": 1.3493253373313343};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7993548387096774, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/65b98038-f228-4767-b248-1405a1cbd5dc"], "isController": false}, {"data": [0.15789473684210525, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1bfeef37-4aab-4868-ad62-fff1073e6593"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.8076923076923077, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6bf75c37-1f1f-4690-9081-c0381f048394"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=02480b33-a994-438e-b996-9b59c8579d48"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/88011bdb-9c2a-4965-b8d9-13e693db86b8"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d7504153-dae9-4059-b3e2-493627ae0f82"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e886e74a-c1e1-4335-9c52-98171fe9f29b"], "isController": false}, {"data": [0.022727272727272728, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fef9ff0e-6033-450c-88b8-f876f9bcaf97"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c35abe19-8ca3-484d-a053-5a77a6defbf6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a2a2bb44-22bc-469a-8f3d-95c29190e0d4"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/69dd0d15-2726-4b6d-b164-daf3f6531d44"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1bfeef37-4aab-4868-ad62-fff1073e6593"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3242cb46-7e8d-48c7-a76f-a9b46f096059"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9b18dd5f-e87a-4a5c-bdb1-63cfef52490f"], "isController": false}, {"data": [0.32608695652173914, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=082ee3e7-9002-44f7-8b62-f8c912be4bf9"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6bf75c37-1f1f-4690-9081-c0381f048394"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4824561403508772, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3242cb46-7e8d-48c7-a76f-a9b46f096059"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/02480b33-a994-438e-b996-9b59c8579d48"], "isController": false}, {"data": [0.32608695652173914, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.4318181818181818, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=88011bdb-9c2a-4965-b8d9-13e693db86b8"], "isController": false}, {"data": [0.3114754098360656, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/28b6f624-eafb-415d-9d59-f06560d79504"], "isController": false}, {"data": [0.9824561403508771, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9413407821229051, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/448adea1-a9c5-4afb-88da-9a190fb67b15"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5a9cf2de-db07-4d43-8d37-e41231e8a7b3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=69dd0d15-2726-4b6d-b164-daf3f6531d44"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e886e74a-c1e1-4335-9c52-98171fe9f29b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c35abe19-8ca3-484d-a053-5a77a6defbf6"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9b18dd5f-e87a-4a5c-bdb1-63cfef52490f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a2a2bb44-22bc-469a-8f3d-95c29190e0d4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d7504153-dae9-4059-b3e2-493627ae0f82"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/082ee3e7-9002-44f7-8b62-f8c912be4bf9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1334, 18, 1.3493253373313343, 342.7736131934033, 107, 2206, 125.5, 889.5, 1066.0, 1446.65, 5.237369850966597, 736.1155539198318, 3.8263752942094476], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/65b98038-f228-4767-b248-1405a1cbd5dc", 2, 0, 0.0, 236.5, 204, 269, 236.5, 269.0, 269.0, 269.0, 0.023930601256356564, 0.03407306311696081, 0.014874831737959915], "isController": false}, {"data": ["see books", 57, 0, 0.0, 1642.4210526315796, 1314, 2326, 1631.0, 1940.4, 1983.5, 2326.0, 0.23957834211787254, 288.2948789735329, 1.1780048364877815], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1bfeef37-4aab-4868-ad62-fff1073e6593", 1, 0, 0.0, 248.0, 248, 248, 248.0, 248.0, 248.0, 248.0, 4.032258064516129, 0.728484122983871, 2.780052923387097], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 458.0, 121, 812, 447.0, 710.3999999999999, 812.0, 812.0, 0.07584553182303487, 0.014369173021160902, 0.051272080895093955], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 458.0, 121, 812, 447.0, 710.3999999999999, 812.0, 812.0, 0.07820019249278153, 0.014815270843358997, 0.05286384707350818], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 156.37499999999997, 107, 345, 114.5, 345.0, 345.0, 345.0, 0.1472808277182518, 0.05323468394454877, 0.08322301654147797], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 159.87499999999997, 110, 427, 115.0, 354.9000000000001, 427.0, 427.0, 0.14759739121611026, 0.10968907687056631, 0.0740869717627741], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 233.31249999999997, 109, 793, 115.5, 559.9000000000002, 793.0, 793.0, 0.14667595614388912, 2.732537969592241, 0.0855848474570056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 239.9375, 108, 797, 116.0, 478.50000000000034, 797.0, 797.0, 0.14667057788207685, 8.285464272536851, 0.08543847627603403], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6bf75c37-1f1f-4690-9081-c0381f048394", 3, 0, 0.0, 266.3333333333333, 199, 399, 201.0, 399.0, 399.0, 399.0, 0.022864633746675102, 0.022931619978354814, 0.014662541823225895], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=02480b33-a994-438e-b996-9b59c8579d48", 1, 0, 0.0, 644.0, 644, 644, 644.0, 644.0, 644.0, 644.0, 1.5527950310559004, 0.28053425854037267, 1.0705793866459627], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 270.35714285714283, 114, 1193, 204.5, 728.0, 1193.0, 1193.0, 0.07389461572160731, 0.16577836431629006, 0.04776655998131522], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 21, 0, 0.0, 133.8095238095238, 109, 331, 114.0, 287.40000000000015, 330.9, 331.0, 0.11887442897818937, 0.08834320356679894, 0.05966939110819271], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 21, 0, 0.0, 143.76190476190476, 109, 328, 115.0, 322.8, 327.5, 328.0, 0.11887442897818937, 0.04031028348720968, 0.0673201635089467], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 683.8, 540, 796, 760.0, 796.0, 796.0, 796.0, 0.03811208000487834, 11.206216961590645, 0.02173579562778218], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 869.2, 786, 1009, 791.0, 1009.0, 1009.0, 1009.0, 0.03804074925059724, 34.22913304419194, 0.021657965637791203], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 243.6, 113, 338, 326.0, 338.0, 338.0, 338.0, 0.03817085273685014, 0.06754451675700435, 0.02113561865409573], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 18, 0, 0.0, 127.99999999999999, 110, 344, 115.5, 148.7000000000003, 344.0, 344.0, 0.09752555982380383, 0.07247749123624483, 0.048953259520932775], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 18, 0, 0.0, 136.66666666666666, 108, 341, 113.5, 323.0, 341.0, 341.0, 0.09752714505537374, 0.02609613061051993, 0.05562094991439284], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 18, 0, 0.0, 174.94444444444446, 109, 339, 115.0, 339.0, 339.0, 339.0, 0.09752978722251421, 0.026287325462318285, 0.05733684756636089], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 18, 0, 0.0, 175.44444444444446, 109, 341, 115.5, 339.2, 341.0, 341.0, 0.09752714505537374, 0.026286613315706205, 0.05743053561366247], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 160.0, 114, 341, 115.0, 341.0, 341.0, 341.0, 0.03816997854847206, 0.028366556323620347, 0.02143333756383929], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 566.1666666666666, 107, 1137, 779.0, 1037.1000000000001, 1137.0, 1137.0, 0.08495454931611589, 42.47809507417004, 0.045887993326348187], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 21, 0, 0.0, 173.85714285714283, 108, 972, 113.0, 336.40000000000003, 908.799999999999, 972.0, 0.11887981250955285, 5.124242893039304, 0.06940183994814576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 519.777777777778, 112, 923, 756.5, 913.1, 923.0, 923.0, 0.08495495027775549, 13.887719201470665, 0.04597117372343388], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 21, 0, 0.0, 165.28571428571428, 108, 545, 113.0, 341.6, 524.6999999999997, 545.0, 0.11887510189294448, 1.694954194168327, 0.06951517886457295], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 428.07692307692304, 118, 738, 433.0, 710.4, 738.0, 738.0, 0.07834109713693421, 0.01484196566852074, 0.053582909362363734], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/88011bdb-9c2a-4965-b8d9-13e693db86b8", 3, 0, 0.0, 521.0, 208, 937, 418.0, 937.0, 937.0, 937.0, 0.021206508984490974, 0.02506537569097875, 0.013599226139142974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 18, 0, 0.0, 342.66666666666674, 229, 684, 234.0, 486.9000000000003, 684.0, 684.0, 0.09746483143998874, 0.15105145263209194, 0.21920069024052155], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d7504153-dae9-4059-b3e2-493627ae0f82", 3, 0, 0.0, 691.6666666666666, 387, 1193, 495.0, 1193.0, 1193.0, 1193.0, 0.08867082434309698, 0.040121238879200785, 0.05686247524606154], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 439.45454545454544, 134, 1265, 323.0, 1019.0999999999997, 1245.7999999999997, 1265.0, 0.09806412502284448, 0.060236654921258966, 0.044339540903883784], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 138.83333333333331, 110, 334, 115.5, 325.90000000000003, 334.0, 334.0, 0.08495615318538376, 0.06313635993562211, 0.04264400657938209], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 189.50000000000003, 109, 348, 115.0, 347.1, 348.0, 348.0, 0.08495615318538376, 0.09362138582364991, 0.044487673098162116], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e886e74a-c1e1-4335-9c52-98171fe9f29b", 3, 0, 0.0, 290.3333333333333, 214, 415, 242.0, 415.0, 415.0, 415.0, 0.01758973697479977, 0.024248872424569343, 0.011279876901157405], "isController": false}, {"data": ["login", 22, 0, 0.0, 2146.0909090909086, 1299, 3424, 1964.0, 2947.2999999999997, 3359.199999999999, 3424.0, 0.09704155584079892, 26.51910784762932, 0.1829867405946883], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 21, 0, 0.0, 117.61904761904763, 111, 144, 117.0, 121.8, 141.79999999999995, 144.0, 0.11904424477764236, 0.09637468644596242, 0.04231650888580256], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fef9ff0e-6033-450c-88b8-f876f9bcaf97", 1, 0, 0.0, 243.0, 243, 243, 243.0, 243.0, 243.0, 243.0, 4.11522633744856, 1.3141396604938271, 2.455471965020576], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c35abe19-8ca3-484d-a053-5a77a6defbf6", 3, 0, 0.0, 332.0, 263, 393, 340.0, 393.0, 393.0, 393.0, 0.047808003059712195, 0.030735939467100126, 0.030658126962120127], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a2a2bb44-22bc-469a-8f3d-95c29190e0d4", 3, 0, 0.0, 248.33333333333334, 184, 365, 196.0, 365.0, 365.0, 365.0, 0.03410912646527123, 0.028435375285663932, 0.021873365604356872], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 733.0555555555555, 225, 1254, 908.0, 1155.0000000000002, 1254.0, 1254.0, 0.0849096655502618, 56.492641162318975, 0.17889442013774234], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/69dd0d15-2726-4b6d-b164-daf3f6531d44", 3, 0, 0.0, 255.33333333333334, 191, 380, 195.0, 380.0, 380.0, 380.0, 0.08364934195850993, 0.038774955387017626, 0.05364231889917467], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1bfeef37-4aab-4868-ad62-fff1073e6593", 3, 0, 0.0, 276.0, 199, 379, 250.0, 379.0, 379.0, 379.0, 0.0801239250040062, 0.03547152929864858, 0.05138155346936595], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3242cb46-7e8d-48c7-a76f-a9b46f096059", 1, 0, 0.0, 433.0, 433, 433, 433.0, 433.0, 433.0, 433.0, 2.3094688221709005, 0.417238019630485, 1.5922704965357968], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 437.8125, 227, 913, 445.0, 895.5, 913.0, 913.0, 0.14652014652014653, 11.16844987694597, 0.3271842090201465], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, 28.571428571428573, 769.1428571428572, 114, 1312, 904.0, 1312.0, 1312.0, 1312.0, 0.05311883442100471, 45.39591316967673, 0.09561093773713765], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9b18dd5f-e87a-4a5c-bdb1-63cfef52490f", 3, 0, 0.0, 408.6666666666667, 213, 612, 401.0, 612.0, 612.0, 612.0, 0.025642778993435447, 0.02571790432251778, 0.016444099810243435], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 872.0869565217392, 197, 1740, 922.0, 1528.6000000000001, 1710.9999999999995, 1740.0, 0.09370543898961092, 0.02952166938276635, 0.04227725860664087], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=082ee3e7-9002-44f7-8b62-f8c912be4bf9", 1, 0, 0.0, 614.0, 614, 614, 614.0, 614.0, 614.0, 614.0, 1.6286644951140066, 0.2942411441368078, 1.1228878257328991], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 21, 0, 0.0, 343.047619047619, 222, 1302, 230.0, 628.8000000000002, 1238.8999999999992, 1302.0, 0.11879642253059008, 6.943049843584711, 0.26572854911383526], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 138.99999999999997, 113, 342, 119.0, 273.5999999999999, 342.0, 342.0, 0.06986242476354257, 0.05423889422560189, 0.02483390880266552], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6bf75c37-1f1f-4690-9081-c0381f048394", 1, 0, 0.0, 481.0, 481, 481, 481.0, 481.0, 481.0, 481.0, 2.079002079002079, 0.37560096153846156, 1.4333744802494803], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 375.0, 228, 1348, 232.5, 902.0, 1348.0, 1348.0, 0.07182286429582813, 6.240868837021095, 0.16021869420902504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 138.11111111111111, 109, 344, 113.0, 344.0, 344.0, 344.0, 0.04801895147951725, 0.035685959058508424, 0.02410326275436706], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 161.77777777777777, 110, 338, 113.0, 338.0, 338.0, 338.0, 0.04796214188267394, 0.028841817525366645, 0.02645828226253411], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 306.55555555555554, 108, 993, 115.0, 993.0, 993.0, 993.0, 0.047856557943656876, 9.579235754033244, 0.027220494438004485], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 254.33333333333334, 108, 753, 115.0, 753.0, 753.0, 753.0, 0.04785630347277242, 3.1369973094122714, 0.02726708436800434], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 118.0, 118, 118, 118.0, 118.0, 118.0, 118.0, 8.474576271186441, 2.4993379237288136, 5.238678495762712], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1079.0526315789475, 865, 1829, 909.0, 1446.2, 1487.7999999999997, 1829.0, 0.24104843381951815, 288.3777288427138, 0.4759764972490876], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3242cb46-7e8d-48c7-a76f-a9b46f096059", 3, 0, 0.0, 269.6666666666667, 186, 376, 247.0, 376.0, 376.0, 376.0, 0.02319270821253798, 0.03197302059899034, 0.014872928118066347], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/02480b33-a994-438e-b996-9b59c8579d48", 3, 0, 0.0, 302.6666666666667, 205, 389, 314.0, 389.0, 389.0, 389.0, 0.017513237088365958, 0.024143411155348248, 0.011230819356797178], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 872.0869565217392, 197, 1740, 922.0, 1528.6000000000001, 1710.9999999999995, 1740.0, 0.09192535661043233, 0.028960858782668474, 0.041474135501972396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 162.0, 109, 342, 115.0, 342.0, 342.0, 342.0, 0.040373409175530124, 0.010881895441842104, 0.023774575910981116], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 136.0, 109, 324, 112.0, 324.0, 324.0, 324.0, 0.04041202302587268, 0.010892303081192245, 0.02375784947419468], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 179.0769230769231, 107, 760, 113.0, 592.3999999999999, 760.0, 760.0, 0.06746552771016809, 4.6864468647342115, 0.03921636519090149], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 164.23076923076923, 108, 568, 111.0, 477.5999999999999, 568.0, 568.0, 0.06746412724772309, 1.5426844397882664, 0.03928143406678949], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 139.0, 111, 342, 114.0, 342.0, 342.0, 342.0, 0.040412204485754694, 0.010813421903414831, 0.023047585370781973], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 114.3076923076923, 108, 121, 115.0, 120.6, 121.0, 121.0, 0.06746412724772309, 0.050136914878434836, 0.03386382949739225], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 115.11111111111111, 113, 120, 115.0, 120.0, 120.0, 120.0, 0.04041166011099736, 0.030032493500458, 0.020284759079152972], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 130.23076923076923, 109, 341, 114.0, 250.5999999999999, 341.0, 341.0, 0.06746272684341902, 0.025845846371802653, 0.038039004483676614], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 122.88888888888889, 110, 144, 118.0, 144.0, 144.0, 144.0, 0.040635723315875026, 0.03198475878183132, 0.01444472977243995], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 381.5384615384615, 115, 543, 389.0, 492.99999999999994, 543.0, 543.0, 0.07783685395411218, 0.014582715877520717, 0.05297490210518753], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1217.3636363636365, 851, 2206, 1102.0, 1603.3, 2118.699999999999, 2206.0, 0.09824849724457624, 0.05085127298791543, 0.04519047090058145], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 303.0, 228, 458, 235.0, 458.0, 458.0, 458.0, 0.040352772908044995, 0.06253891660651115, 0.09075433203830824], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=88011bdb-9c2a-4965-b8d9-13e693db86b8", 1, 0, 0.0, 375.0, 375, 375, 375.0, 375.0, 375.0, 375.0, 2.6666666666666665, 0.4817708333333333, 1.8385416666666667], "isController": false}, {"data": ["addBook", 61, 8, 13.114754098360656, 1087.7868852459012, 577, 2702, 907.0, 1673.4, 1785.2, 2702.0, 0.2872358960111881, 91.22187898775245, 1.0443294601613229], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/28b6f624-eafb-415d-9d59-f06560d79504", 1, 0, 0.0, 194.0, 194, 194, 194.0, 194.0, 194.0, 194.0, 5.154639175257732, 1.6460615335051545, 3.0756684922680413], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 217.5087719298246, 109, 720, 116.0, 447.40000000000003, 471.99999999999943, 720.0, 0.24181437140990505, 0.1797077506278689, 0.11689268930459278], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 648.1754385964913, 536, 914, 568.0, 805.4000000000001, 871.6999999999997, 914.0, 0.242020745848495, 71.16213512453453, 0.12171941807810052], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 165.0, 108, 447, 115.0, 342.2, 347.6999999999998, 447.0, 0.24247064828994383, 0.4290593893568147, 0.11792029575038285], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 856.3333333333334, 748, 1145, 791.0, 1031.6000000000001, 1089.6999999999996, 1145.0, 0.24181744903803323, 217.58776571415692, 0.12138102422416902], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 148.57142857142856, 114, 512, 117.5, 332.5, 512.0, 512.0, 0.07108691899137817, 0.053106926785551074, 0.025269178235216457], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 8, 4.4692737430167595, 185.2737430167597, 109, 2022, 120.0, 303.0, 343.0, 1325.19999999999, 0.7263814435918142, 1.535107728404355, 0.35005374943695294], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 125.0, 111, 164, 119.0, 164.0, 164.0, 164.0, 0.04780546363332147, 0.03702122330197649, 0.01699334840090724], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 132.25000000000003, 111, 327, 117.5, 191.20000000000013, 327.0, 327.0, 0.14897856570885865, 0.1208995977578726, 0.05295722452932085], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/448adea1-a9c5-4afb-88da-9a190fb67b15", 1, 0, 0.0, 467.0, 467, 467, 467.0, 467.0, 467.0, 467.0, 2.1413276231263385, 0.6838028640256959, 1.2776866970021412], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5a9cf2de-db07-4d43-8d37-e41231e8a7b3", 1, 0, 0.0, 201.0, 201, 201, 201.0, 201.0, 201.0, 201.0, 4.975124378109452, 1.5887360074626864, 2.96855565920398], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 447.77777777777777, 225, 1107, 231.0, 1107.0, 1107.0, 1107.0, 0.047826803203333, 12.772647029224833, 0.10484428223925092], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=69dd0d15-2726-4b6d-b164-daf3f6531d44", 1, 0, 0.0, 188.0, 188, 188, 188.0, 188.0, 188.0, 188.0, 5.319148936170213, 0.9609790558510638, 3.6673038563829787], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e886e74a-c1e1-4335-9c52-98171fe9f29b", 1, 0, 0.0, 738.0, 738, 738, 738.0, 738.0, 738.0, 738.0, 1.3550135501355014, 0.2448022527100271, 0.9342183265582656], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c35abe19-8ca3-484d-a053-5a77a6defbf6", 1, 0, 0.0, 669.0, 669, 669, 669.0, 669.0, 669.0, 669.0, 1.4947683109118086, 0.2700509155455904, 1.030572683109118], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 313.6153846153846, 223, 877, 230.0, 708.5999999999999, 877.0, 877.0, 0.067423888802448, 6.301256742388881, 0.15031090354494062], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 18, 0, 0.0, 142.11111111111111, 115, 343, 118.0, 327.70000000000005, 343.0, 343.0, 0.09697021936818515, 0.08039816039413007, 0.03446988266603457], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 132.5, 113, 351, 119.0, 153.0000000000003, 351.0, 351.0, 0.08557288670625206, 0.06643598137838903, 0.03041848707136303], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9b18dd5f-e87a-4a5c-bdb1-63cfef52490f", 1, 0, 0.0, 398.0, 398, 398, 398.0, 398.0, 398.0, 398.0, 2.512562814070352, 0.4539298052763819, 1.7322942839195978], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a2a2bb44-22bc-469a-8f3d-95c29190e0d4", 1, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 2.277904328018223, 0.4115354498861048, 1.570508257403189], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d7504153-dae9-4059-b3e2-493627ae0f82", 1, 0, 0.0, 220.0, 220, 220, 220.0, 220.0, 220.0, 220.0, 4.545454545454545, 0.8212002840909091, 3.133877840909091], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/082ee3e7-9002-44f7-8b62-f8c912be4bf9", 3, 0, 0.0, 320.3333333333333, 208, 543, 210.0, 543.0, 543.0, 543.0, 0.017718349122351106, 0.024426174652720355, 0.011362352790049376], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 129.85714285714286, 109, 329, 115.0, 224.5, 329.0, 329.0, 0.07186563180156873, 0.053407954883783006, 0.0360731784628968], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 161.35714285714286, 109, 341, 114.0, 339.5, 341.0, 341.0, 0.07186526289853139, 0.02693944774112079, 0.04055454637619412], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 226.71428571428572, 110, 1019, 115.0, 679.0, 1019.0, 1019.0, 0.07186489399928135, 4.636854699771572, 0.041807562496791746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 192.0, 108, 542, 116.0, 440.0, 542.0, 542.0, 0.07186452510381856, 1.5273116475712356, 0.041877528091329545], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 33.333333333333336, 0.4497751124437781], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.555555555555555, 0.07496251874062969], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.555555555555555, 0.07496251874062969], "isController": false}, {"data": ["401/Unauthorized", 10, 55.55555555555556, 0.7496251874062968], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1334, 18, "401/Unauthorized", 10, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
