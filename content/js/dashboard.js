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

    var data = {"OkPercent": 98.35943325876212, "KoPercent": 1.6405667412378822};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8063897763578275, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3898305084745763, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0b6d168f-bbb9-4308-a50e-82a6a83e0179"], "isController": false}, {"data": [0.6875, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6875, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.84375, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f6543fd9-2a6b-47f2-a948-b3d7dcdb537b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a6e5ca09-e086-407f-9c98-001ae96e7363"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7fc9193a-1145-4816-a82d-62734197e755"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3a6864fc-0a14-4aaa-9d81-7a7b2df60778"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b9ca954d-134b-42c9-b69c-000e51ffd326"], "isController": false}, {"data": [0.7708333333333334, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=db7d62ba-f4c4-4477-b388-7b0e81ea1bd8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0c806a51-e43d-49c2-8f57-6f5a0a236a64"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f6543fd9-2a6b-47f2-a948-b3d7dcdb537b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fe05ae3c-46a1-4718-a58d-2ce41849eca4"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/60858314-2ef9-44e6-9d14-cc1e66415293"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1afa4932-de9e-4103-bf40-e189d72c3307"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4bddc041-cc33-4ce9-ba47-a301bce6ee4d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=63451b19-1059-4538-bd52-e2466b46b1e9"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/758c85ce-95cc-4aa9-a77c-aedc53354ce6"], "isController": false}, {"data": [0.2708333333333333, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4915254237288136, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2708333333333333, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=60858314-2ef9-44e6-9d14-cc1e66415293"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.3125, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a6e5ca09-e086-407f-9c98-001ae96e7363"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6b2c41d7-7ad4-4fdb-8ace-96e721e75784"], "isController": false}, {"data": [0.36607142857142855, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.7966101694915254, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5f86e71c-3f56-4bca-9d16-9090d7dfb609"], "isController": false}, {"data": [0.9502923976608187, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7fc9193a-1145-4816-a82d-62734197e755"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6b2c41d7-7ad4-4fdb-8ace-96e721e75784"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fe05ae3c-46a1-4718-a58d-2ce41849eca4"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/63451b19-1059-4538-bd52-e2466b46b1e9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b9ca954d-134b-42c9-b69c-000e51ffd326"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0c806a51-e43d-49c2-8f57-6f5a0a236a64"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/db7d62ba-f4c4-4477-b388-7b0e81ea1bd8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1afa4932-de9e-4103-bf40-e189d72c3307"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8389342a-2381-4874-b076-ec76b9688d3e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4bddc041-cc33-4ce9-ba47-a301bce6ee4d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=758c85ce-95cc-4aa9-a77c-aedc53354ce6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1341, 22, 1.6405667412378822, 316.0559284116333, 79, 2705, 98.0, 886.0, 1059.5999999999995, 1516.7399999999998, 5.231047691863595, 768.7333840302375, 3.8211816289681457], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 59, 0, 0.0, 1369.6949152542365, 986, 1868, 1380.0, 1642.0, 1730.0, 1868.0, 0.2508898083457007, 301.9063215261861, 1.2336232275591823], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/0b6d168f-bbb9-4308-a50e-82a6a83e0179", 1, 0, 0.0, 263.0, 263, 263, 263.0, 263.0, 263.0, 263.0, 3.802281368821293, 1.2142050855513307, 2.268744058935361], "isController": false}, {"data": ["deleteBook", 16, 2, 12.5, 496.18750000000006, 93, 1235, 482.5, 862.6000000000004, 1235.0, 1235.0, 0.09056894277740984, 0.017656079298769962, 0.061016845115786734], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 2, 12.5, 496.18750000000006, 93, 1235, 482.5, 862.6000000000004, 1235.0, 1235.0, 0.08930415320127481, 0.017409513264457502, 0.06016474872043893], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 115.2, 80, 253, 82.5, 246.8, 252.7, 253.0, 0.10272266421501908, 0.03520056921196308, 0.058152664497506404], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 93.7, 81, 244, 84.5, 96.7, 236.6499999999999, 244.0, 0.10280979160455242, 0.07640454239361757, 0.05160569617650385], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 135.15, 80, 475, 83.5, 244.9, 463.49999999999983, 475.0, 0.10272741281010839, 1.536567347449792, 0.060051395808721555], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 138.69999999999996, 80, 879, 82.0, 251.3, 847.6499999999995, 879.0, 0.10281349118631347, 4.651913881170738, 0.06000131087201263], "isController": false}, {"data": ["goToProfile", 16, 2, 12.5, 265.62500000000006, 83, 1060, 205.0, 559.5000000000005, 1060.0, 1060.0, 0.09131846744782006, 0.1731060157467282, 0.05902481508010341], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f6543fd9-2a6b-47f2-a948-b3d7dcdb537b", 3, 0, 0.0, 325.3333333333333, 178, 507, 291.0, 507.0, 507.0, 507.0, 0.032467532467532464, 0.027066845914502164, 0.0208206507034632], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 85.64999999999999, 81, 97, 84.0, 94.60000000000001, 96.9, 97.0, 0.11744946736666549, 0.0872842233066723, 0.05895412717428326], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 91.64999999999999, 81, 240, 82.5, 104.80000000000004, 233.3499999999999, 240.0, 0.11734265816323537, 0.031398328453834466, 0.06692198473372017], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 596.1428571428572, 397, 721, 642.0, 721.0, 721.0, 721.0, 0.05599238503563515, 16.46362032263612, 0.031933157090635676], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 860.5714285714286, 562, 1126, 921.0, 1126.0, 1126.0, 1126.0, 0.05591813584911689, 50.31523693063355, 0.03183620429690932], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 152.71428571428572, 82, 248, 83.0, 248.0, 248.0, 248.0, 0.05613292276109828, 0.0993289609795997, 0.03108141328666282], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a6e5ca09-e086-407f-9c98-001ae96e7363", 3, 0, 0.0, 457.0, 209, 952, 210.0, 952.0, 952.0, 952.0, 0.0313876479142908, 0.026166590595214433, 0.02012814661170341], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 106.39999999999999, 82, 244, 85.0, 244.0, 244.0, 244.0, 0.07222267695759566, 0.05367329801243193, 0.036252398394730635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 136.33333333333334, 81, 251, 83.0, 246.8, 251.0, 251.0, 0.07216812285901236, 0.026536820176282665, 0.04075431625514799], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 152.66666666666666, 80, 982, 82.0, 538.0000000000002, 982.0, 982.0, 0.07222372019567813, 4.350637472133681, 0.0420458662753746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 164.13333333333333, 82, 486, 83.0, 349.80000000000007, 486.0, 486.0, 0.07222406794840312, 1.4339204698657113, 0.04211660003996398], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 109.14285714285714, 82, 244, 88.0, 244.0, 244.0, 244.0, 0.05606054538902014, 0.041662182657269856, 0.03147931015496737], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7fc9193a-1145-4816-a82d-62734197e755", 3, 0, 0.0, 342.6666666666667, 193, 523, 312.0, 523.0, 523.0, 523.0, 0.07033502918903711, 0.031137903547229975, 0.04510416910885518], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 730.3571428571428, 80, 1197, 913.5, 1175.5, 1197.0, 1197.0, 0.08241159884388301, 52.97356178883205, 0.04339025865468952], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 107.80000000000001, 80, 246, 82.5, 245.70000000000002, 246.0, 246.0, 0.11745222630694965, 0.03165704537179502, 0.06904906273123407], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 502.3571428571429, 80, 730, 639.0, 696.5, 730.0, 730.0, 0.0824120839661404, 17.314838626838085, 0.043470994625554815], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 98.34999999999998, 81, 242, 82.0, 226.30000000000032, 242.0, 242.0, 0.11734128124944995, 0.03162714221176581, 0.06909843026701008], "isController": false}, {"data": ["deleteBooks", 15, 2, 13.333333333333334, 508.8, 88, 1141, 412.0, 1085.8, 1141.0, 1141.0, 0.08533830950498092, 0.01671764149091716, 0.05802560575976697], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/3a6864fc-0a14-4aaa-9d81-7a7b2df60778", 2, 0, 0.0, 322.5, 200, 445, 322.5, 445.0, 445.0, 445.0, 0.041491193494180865, 0.03496767576706844, 0.025790180331099723], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 326.4, 166, 1068, 325.0, 720.0000000000002, 1068.0, 1068.0, 0.07213862157521894, 5.857872112050517, 0.16101096116297078], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b9ca954d-134b-42c9-b69c-000e51ffd326", 1, 0, 0.0, 286.0, 286, 286, 286.0, 286.0, 286.0, 286.0, 3.4965034965034967, 0.6316925262237763, 2.4106752622377625], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 547.5, 156, 1067, 487.0, 975.0, 1050.0, 1067.0, 0.10450412791305257, 0.06419247700909186, 0.047251378148186855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 96.28571428571429, 82, 242, 83.5, 174.0, 242.0, 242.0, 0.08241062861650214, 0.06124461755581848, 0.04136627256726767], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=db7d62ba-f4c4-4477-b388-7b0e81ea1bd8", 1, 0, 0.0, 412.0, 412, 412, 412.0, 412.0, 412.0, 412.0, 2.4271844660194173, 0.43850500606796117, 1.6734299150485439], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 118.07142857142858, 81, 251, 83.5, 249.0, 251.0, 251.0, 0.0824120839661404, 0.11046530451265027, 0.042056836376693864], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0c806a51-e43d-49c2-8f57-6f5a0a236a64", 2, 0, 0.0, 212.5, 189, 236, 212.5, 236.0, 236.0, 236.0, 0.02591143471614023, 0.02947931781670251, 0.016106082223460213], "isController": false}, {"data": ["login", 24, 0, 0.0, 2620.624999999999, 1779, 4048, 2517.0, 3563.0, 4018.0, 4048.0, 0.10037095431866942, 35.15921914403441, 0.19998226518424345], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 103.45000000000002, 83, 256, 86.0, 226.5000000000003, 255.25, 256.0, 0.11353766328135201, 0.09191672154320392, 0.0403590912445431], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f6543fd9-2a6b-47f2-a948-b3d7dcdb537b", 1, 0, 0.0, 483.0, 483, 483, 483.0, 483.0, 483.0, 483.0, 2.070393374741201, 0.37404567805383027, 1.427439182194617], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fe05ae3c-46a1-4718-a58d-2ce41849eca4", 3, 0, 0.0, 330.3333333333333, 211, 567, 213.0, 567.0, 567.0, 567.0, 0.03378264247829465, 0.02816319901917728, 0.021663999245520985], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/60858314-2ef9-44e6-9d14-cc1e66415293", 3, 0, 0.0, 789.3333333333334, 331, 1423, 614.0, 1423.0, 1423.0, 1423.0, 0.019792182088075212, 0.027285120814778165, 0.012692252185386773], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1afa4932-de9e-4103-bf40-e189d72c3307", 1, 0, 0.0, 1049.0, 1049, 1049, 1049.0, 1049.0, 1049.0, 1049.0, 0.9532888465204957, 0.17222503574833176, 0.6572479742612012], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 828.0714285714286, 165, 1282, 999.0, 1272.0, 1282.0, 1282.0, 0.08237038431667883, 70.4247710176861, 0.17019918556282507], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4bddc041-cc33-4ce9-ba47-a301bce6ee4d", 3, 0, 0.0, 487.6666666666667, 177, 837, 449.0, 837.0, 837.0, 837.0, 0.03388605250079067, 0.028249407700040665, 0.021730313615415896], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=63451b19-1059-4538-bd52-e2466b46b1e9", 1, 0, 0.0, 1141.0, 1141, 1141, 1141.0, 1141.0, 1141.0, 1141.0, 0.8764241893076249, 0.15833835451358458, 0.6042533961437335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 282.75, 166, 967, 176.0, 482.00000000000034, 943.4999999999997, 967.0, 0.10267625662903582, 6.292996685161227, 0.22960777349104405], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, 36.36363636363637, 647.8181818181819, 83, 1371, 820.0, 1307.6000000000001, 1371.0, 1371.0, 0.08769971617182767, 66.77539230674172, 0.14697332583235004], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/758c85ce-95cc-4aa9-a77c-aedc53354ce6", 3, 0, 0.0, 354.6666666666667, 258, 538, 268.0, 538.0, 538.0, 538.0, 0.023052806294952974, 0.02724763660708797, 0.014783212370135858], "isController": false}, {"data": ["register", 24, 7, 29.166666666666668, 1071.0833333333335, 318, 2705, 1018.5, 1626.0, 2438.5, 2705.0, 0.10535465009086838, 0.03307765625411542, 0.047533055021466014], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 104.33333333333334, 84, 246, 90.0, 176.40000000000003, 246.0, 246.0, 0.07402947360108972, 0.05747405421178351, 0.026315164444137357], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 202.74999999999997, 164, 333, 169.5, 330.6, 332.9, 333.0, 0.11728279226871832, 0.18176542122114844, 0.26377174862779135], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 415.1764705882353, 164, 1262, 328.0, 1073.1999999999998, 1262.0, 1262.0, 0.09556413758987245, 20.297486856417695, 0.21061110630948165], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 3, 0, 0.0, 84.66666666666667, 83, 88, 83.0, 88.0, 88.0, 88.0, 0.023001548770950578, 0.017093924428411515, 0.011545699285418553], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 3, 0, 0.0, 81.33333333333333, 81, 82, 81.0, 82.0, 82.0, 82.0, 0.023001901490523217, 0.006154805672268907, 0.01311827194381402], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 3, 0, 0.0, 136.33333333333334, 82, 245, 82.0, 245.0, 245.0, 245.0, 0.02297301436579165, 0.006191945278279781, 0.013505619773639232], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 3, 0, 0.0, 80.66666666666667, 80, 81, 81.0, 81.0, 81.0, 81.0, 0.023001901490523217, 0.006199731261117585, 0.013545065037876464], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 167.5, 88, 247, 167.5, 247.0, 247.0, 247.0, 0.23989444644356483, 0.07075011994722323, 0.14829412558474273], "isController": false}, {"data": ["https://demoqa.com/books", 59, 0, 0.0, 931.6610169491524, 642, 1519, 887.0, 1291.0, 1375.0, 1519.0, 0.2545385518050666, 304.51659987726066, 0.5026142106932077], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, 29.166666666666668, 1071.0833333333335, 318, 2705, 1018.5, 1626.0, 2438.5, 2705.0, 0.10086279717752272, 0.031667372356028865, 0.04550645732032763], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 11, 0, 0.0, 82.63636363636363, 80, 87, 82.0, 86.6, 87.0, 87.0, 0.05639579594975647, 0.015200429377082799, 0.033209633747756984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 11, 0, 0.0, 96.7272727272727, 80, 243, 82.0, 211.2000000000001, 243.0, 243.0, 0.056396085086311644, 0.015200507308419936, 0.03315472970894493], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 128.06666666666663, 82, 751, 83.0, 355.0000000000002, 751.0, 751.0, 0.07182600867658184, 4.326679987897317, 0.04181433395742154], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=60858314-2ef9-44e6-9d14-cc1e66415293", 1, 0, 0.0, 409.0, 409, 409, 409.0, 409.0, 409.0, 409.0, 2.444987775061125, 0.441721424205379, 1.6857044621026895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 142.06666666666663, 82, 635, 84.0, 400.40000000000015, 635.0, 635.0, 0.07182600867658184, 1.426017490231663, 0.04188447654401977], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 84.26666666666667, 82, 88, 84.0, 88.0, 88.0, 88.0, 0.07182566474652723, 0.053378252804792206, 0.03605311687472167], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 11, 0, 0.0, 98.09090909090908, 80, 247, 84.0, 215.0000000000001, 247.0, 247.0, 0.05639637422583159, 0.015090436072146343, 0.03216355717566958], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 104.4, 80, 245, 83.0, 243.2, 245.0, 245.0, 0.07182600867658184, 0.026411021940451453, 0.04056111974353327], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 11, 0, 0.0, 98.81818181818181, 82, 248, 84.0, 215.80000000000013, 248.0, 248.0, 0.05639435031145062, 0.041910254479505776, 0.02830732037117736], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 11, 0, 0.0, 134.27272727272728, 83, 271, 89.0, 266.8, 271.0, 271.0, 0.05361747344716485, 0.04220281601407702, 0.01905933626442188], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 494.8571428571429, 83, 952, 515.0, 813.0, 952.0, 952.0, 0.09662569277170799, 0.01865652326953737, 0.06575615643699659], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1500.5416666666663, 987, 2698, 1402.0, 2031.5, 2568.5, 2698.0, 0.10225994477962981, 0.05292751048164434, 0.047035580069536766], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 11, 0, 0.0, 198.1818181818182, 164, 496, 168.0, 431.60000000000025, 496.0, 496.0, 0.056370363537599034, 0.08736305364665006, 0.12677826877645562], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a6e5ca09-e086-407f-9c98-001ae96e7363", 1, 0, 0.0, 633.0, 633, 633, 633.0, 633.0, 633.0, 633.0, 1.5797788309636651, 0.2854092614533965, 1.0891834518167456], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6b2c41d7-7ad4-4fdb-8ace-96e721e75784", 3, 0, 0.0, 339.3333333333333, 191, 485, 342.0, 485.0, 485.0, 485.0, 0.054775511694571746, 0.03521537617082656, 0.03512622331976118], "isController": false}, {"data": ["addBook", 56, 7, 12.5, 925.0357142857143, 428, 2159, 737.0, 1672.6000000000001, 1784.6, 2159.0, 0.26546197494228574, 91.788648752625, 0.9630033111640981], "isController": true}, {"data": ["https://demoqa.com/books-0", 59, 0, 0.0, 139.47457627118646, 81, 339, 84.0, 328.0, 332.0, 339.0, 0.2556724619091366, 0.19000658546177046, 0.12359166859865489], "isController": false}, {"data": ["https://demoqa.com/books-3", 59, 0, 0.0, 526.9830508474575, 396, 812, 483.0, 656.0, 728.0, 812.0, 0.2555705721315452, 75.1462339483271, 0.12853402797631425], "isController": false}, {"data": ["https://demoqa.com/books-1", 59, 0, 0.0, 121.93220338983052, 79, 330, 86.0, 246.0, 254.0, 330.0, 0.2558276675454419, 0.4526950523362703, 0.12441618988049813], "isController": false}, {"data": ["https://demoqa.com/books-2", 59, 0, 0.0, 788.8305084745764, 556, 1133, 800.0, 1027.0, 1109.0, 1133.0, 0.254963138380163, 229.41628009186235, 0.12797954406973025], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 92.11764705882354, 83, 165, 87.0, 111.39999999999995, 165.0, 165.0, 0.10398634720429648, 0.07768511290164726, 0.03696389685777726], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5f86e71c-3f56-4bca-9d16-9090d7dfb609", 1, 0, 0.0, 200.0, 200, 200, 200.0, 200.0, 200.0, 200.0, 5.0, 1.5966796875, 2.9833984375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 7, 4.093567251461988, 154.4152046783626, 81, 840, 91.0, 320.00000000000006, 407.6, 687.3600000000002, 0.726120816312665, 1.6549080631788806, 0.34533699596174916], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 3, 0, 0.0, 139.0, 84, 246, 87.0, 246.0, 246.0, 246.0, 0.023345031788151616, 0.018078720906254134, 0.00829842926844452], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7fc9193a-1145-4816-a82d-62734197e755", 1, 0, 0.0, 276.0, 276, 276, 276.0, 276.0, 276.0, 276.0, 3.6231884057971016, 0.6545799365942029, 2.4980185688405796], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 95.9, 83, 245, 86.5, 107.4, 238.1499999999999, 245.0, 0.10323326588759962, 0.08377621479745634, 0.036696199983482676], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6b2c41d7-7ad4-4fdb-8ace-96e721e75784", 1, 0, 0.0, 564.0, 564, 564, 564.0, 564.0, 564.0, 564.0, 1.7730496453900708, 0.32032635195035464, 1.2224346187943265], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fe05ae3c-46a1-4718-a58d-2ce41849eca4", 1, 0, 0.0, 399.0, 399, 399, 399.0, 399.0, 399.0, 399.0, 2.506265664160401, 0.45279213659147866, 1.727952694235589], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/63451b19-1059-4538-bd52-e2466b46b1e9", 3, 0, 0.0, 654.6666666666666, 345, 945, 674.0, 945.0, 945.0, 945.0, 0.019128749234850032, 0.02637052506822587, 0.012266808591358907], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 3, 0, 0.0, 221.66666666666666, 165, 334, 166.0, 334.0, 334.0, 334.0, 0.022958246602179502, 0.035580798200838745, 0.05163363469220644], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b9ca954d-134b-42c9-b69c-000e51ffd326", 3, 0, 0.0, 356.3333333333333, 277, 448, 344.0, 448.0, 448.0, 448.0, 0.06424257998201208, 0.029068094458006767, 0.041197227397318945], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 235.0666666666667, 166, 834, 169.0, 534.0000000000002, 834.0, 834.0, 0.07179678637584182, 5.830114070135887, 0.16024799657050684], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0c806a51-e43d-49c2-8f57-6f5a0a236a64", 1, 0, 0.0, 403.0, 403, 403, 403.0, 403.0, 403.0, 403.0, 2.4813895781637716, 0.44829792183622824, 1.710801799007444], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/db7d62ba-f4c4-4477-b388-7b0e81ea1bd8", 3, 0, 0.0, 633.3333333333334, 248, 1060, 592.0, 1060.0, 1060.0, 1060.0, 0.018360639684686614, 0.02531162404448171, 0.011774238339463746], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 90.6, 84, 106, 90.0, 99.4, 106.0, 106.0, 0.07481110196753198, 0.06202600153362759, 0.026593008902521136], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1afa4932-de9e-4103-bf40-e189d72c3307", 3, 0, 0.0, 290.0, 198, 411, 261.0, 411.0, 411.0, 411.0, 0.055406778095853725, 0.03511620994551667, 0.035531039338812444], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 88.7142857142857, 83, 100, 88.0, 97.0, 100.0, 100.0, 0.07815727476748212, 0.0606787435938948, 0.027782468765003406], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8389342a-2381-4874-b076-ec76b9688d3e", 1, 0, 0.0, 179.0, 179, 179, 179.0, 179.0, 179.0, 179.0, 5.58659217877095, 1.783999650837989, 3.3334060754189947], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4bddc041-cc33-4ce9-ba47-a301bce6ee4d", 1, 0, 0.0, 697.0, 697, 697, 697.0, 697.0, 697.0, 697.0, 1.4347202295552368, 0.25920238522238165, 0.9891723457675754], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=758c85ce-95cc-4aa9-a77c-aedc53354ce6", 1, 0, 0.0, 545.0, 545, 545, 545.0, 545.0, 545.0, 545.0, 1.834862385321101, 0.33149369266055045, 1.265051605504587], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 117.6470588235294, 81, 337, 84.0, 264.19999999999993, 337.0, 337.0, 0.0956103596636765, 0.07105418330474396, 0.04799191881555637], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 138.76470588235293, 81, 245, 83.0, 243.4, 245.0, 245.0, 0.09561143512764127, 0.050925392147489076, 0.05311136130998915], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 258.29411764705884, 81, 939, 84.0, 927.0, 939.0, 939.0, 0.09561089739263458, 15.203137786199973, 0.05475876878472925], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 228.52941176470588, 80, 645, 242.0, 639.4, 645.0, 645.0, 0.0956103596636765, 4.9822729781221, 0.05485183030567194], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 31.818181818181817, 0.5219985085756897], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 9.090909090909092, 0.14914243102162567], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 9.090909090909092, 0.14914243102162567], "isController": false}, {"data": ["401/Unauthorized", 11, 50.0, 0.8202833706189411], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1341, 22, "401/Unauthorized", 11, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
