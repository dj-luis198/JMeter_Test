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

    var data = {"OkPercent": 97.94466403162055, "KoPercent": 2.0553359683794468};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7552329507089804, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.6, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c4ad9d6d-11a8-4a23-9653-4b3f64ff8082"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/95478b18-8190-4afe-95be-7d31c7646a43"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2014a90a-1975-45dd-a17e-53efb468e0bd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d3d486d8-4b4b-493f-9e99-c76a7af90918"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/134c2275-6707-4e5d-a6be-c6f4a5f2a6ae"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9da28014-16c6-44be-b3e4-94a28144233d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=977aaab9-3730-4581-8bb7-07bd4164eb19"], "isController": false}, {"data": [0.717391304347826, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.043478260869565216, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5a06abd8-b879-44c2-a23f-451dec4189e6"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/20c9c1ee-e13b-4090-a3c0-60fb02cbc364"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e7464fe1-9f42-4874-bac0-5662664a4c1c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/60b3ff37-39a9-4273-8055-5a6c963ed5d3"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.18181818181818182, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/66224b57-5512-4096-9e40-67a79c58a4a7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8f66eaad-0811-4755-b717-37936559e8d2"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/73565f80-2340-4852-8abd-9b7aa7ca289f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.35454545454545455, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=20c9c1ee-e13b-4090-a3c0-60fb02cbc364"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/d6a03f55-91bf-43b6-a5d3-43a618136216"], "isController": false}, {"data": [0.4782608695652174, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d3d486d8-4b4b-493f-9e99-c76a7af90918"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c4ad9d6d-11a8-4a23-9653-4b3f64ff8082"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/319fc812-1ca5-4e07-a602-b29f1820ad3e"], "isController": false}, {"data": [0.26851851851851855, 500, 1500, "addBook"], "isController": true}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e76961eb-67b6-4e7f-aa51-1fa48d9b7fbc"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.990909090909091, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4909090909090909, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9355828220858896, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9c4a64aa-e321-474e-87d9-eaca37dc7394"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2014a90a-1975-45dd-a17e-53efb468e0bd"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.7894736842105263, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=60b3ff37-39a9-4273-8055-5a6c963ed5d3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=66224b57-5512-4096-9e40-67a79c58a4a7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5a06abd8-b879-44c2-a23f-451dec4189e6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8f66eaad-0811-4755-b717-37936559e8d2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/977aaab9-3730-4581-8bb7-07bd4164eb19"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e7464fe1-9f42-4874-bac0-5662664a4c1c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9da28014-16c6-44be-b3e4-94a28144233d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=73565f80-2340-4852-8abd-9b7aa7ca289f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1265, 26, 2.0553359683794468, 429.4885375494071, 137, 2364, 158.0, 1142.2000000000003, 1320.0, 1772.1999999999975, 5.001838620520587, 703.3108931222741, 3.6460413313984983], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 2138.836363636364, 1687, 2991, 2095.0, 2507.2, 2544.2, 2991.0, 0.24269916776249018, 292.04910459175795, 1.193349911800916], "isController": true}, {"data": ["deleteBook", 15, 3, 20.0, 477.1333333333333, 146, 827, 472.0, 824.0, 827.0, 827.0, 0.07865180322367524, 0.01600687089044328, 0.052705925168052684], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, 20.0, 477.1333333333333, 146, 827, 472.0, 824.0, 827.0, 827.0, 0.08062218830118299, 0.016407875040982945, 0.054026314074484154], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c4ad9d6d-11a8-4a23-9653-4b3f64ff8082", 1, 0, 0.0, 502.0, 502, 502, 502.0, 502.0, 502.0, 502.0, 1.9920318725099602, 0.3598885707171315, 1.3734125996015936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 214.99999999999997, 138, 429, 146.0, 429.0, 429.0, 429.0, 0.09746826189721972, 0.026080374765466995, 0.055587368113258116], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 147.5, 139, 156, 148.0, 152.5, 156.0, 156.0, 0.0974706369706126, 0.07243667454554316, 0.04892569082313954], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 182.8125, 139, 444, 147.5, 434.90000000000003, 444.0, 444.0, 0.09746766814695687, 0.02627058243023447, 0.05739551161388183], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 161.25, 141, 409, 145.0, 227.7000000000002, 409.0, 409.0, 0.0974706369706126, 0.02627138262098543, 0.057302073687801554], "isController": false}, {"data": ["goToProfile", 15, 3, 20.0, 246.40000000000003, 142, 408, 234.0, 376.8, 408.0, 408.0, 0.07782787586972652, 0.14066273841272642, 0.05029930493221192], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 180.5, 143, 434, 148.5, 431.3, 434.0, 434.0, 0.09067873029626757, 0.06738917358931604, 0.04551647204324368], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/95478b18-8190-4afe-95be-7d31c7646a43", 1, 0, 0.0, 669.0, 669, 669, 669.0, 669.0, 669.0, 669.0, 1.4947683109118086, 0.4773332399103139, 0.8918978886397608], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2014a90a-1975-45dd-a17e-53efb468e0bd", 3, 0, 0.0, 347.6666666666667, 234, 467, 342.0, 467.0, 467.0, 467.0, 0.10466089868825007, 0.04735633111219648, 0.06711652682807703], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 193.61111111111111, 142, 430, 146.5, 429.1, 430.0, 430.0, 0.09068603989178133, 0.039399620630066454, 0.05087313652783306], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 847.4, 705, 1034, 745.0, 1034.0, 1034.0, 1034.0, 0.04713823759557278, 13.860206989893562, 0.0268835261287251], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1232.0, 997, 1341, 1283.0, 1341.0, 1341.0, 1341.0, 0.04702253319790844, 42.310958028274655, 0.026771618021856076], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 261.2, 143, 439, 150.0, 439.0, 439.0, 439.0, 0.04740100300522359, 0.08387755609908705, 0.02624645381246267], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 147.41666666666669, 141, 152, 147.5, 151.4, 152.0, 152.0, 0.0753465943339361, 0.05599488114074744, 0.03782045848402652], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 145.91666666666666, 139, 152, 146.5, 151.1, 152.0, 152.0, 0.07534612124446677, 0.020160973848617085, 0.042970834772234956], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 219.66666666666666, 142, 453, 148.0, 449.40000000000003, 453.0, 453.0, 0.07521436092864664, 0.02027262071904929, 0.044217817655317654], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 221.83333333333331, 139, 473, 148.0, 465.5, 473.0, 473.0, 0.07534754053069785, 0.020308516783664653, 0.044369694277354293], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d3d486d8-4b4b-493f-9e99-c76a7af90918", 1, 0, 0.0, 516.0, 516, 516, 516.0, 516.0, 516.0, 516.0, 1.937984496124031, 0.35012415213178294, 1.3361494670542635], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 207.8, 142, 450, 150.0, 450.0, 450.0, 450.0, 0.04739875625663583, 0.035225052257128776, 0.02661551254645078], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/134c2275-6707-4e5d-a6be-c6f4a5f2a6ae", 1, 0, 0.0, 294.0, 294, 294, 294.0, 294.0, 294.0, 294.0, 3.401360544217687, 1.0861766581632655, 2.0295227465986394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 291.16666666666663, 138, 1320, 147.0, 1295.7, 1320.0, 1320.0, 0.09068558300753699, 9.088287531865907, 0.05244728270726694], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 826.875, 142, 1332, 1130.5, 1323.6, 1332.0, 1332.0, 0.08107053643360577, 45.60032613473416, 0.04330623381756089], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 241.44444444444446, 142, 989, 148.0, 746.9000000000004, 989.0, 989.0, 0.09068512612789625, 2.9844419904881376, 0.05253557816805969], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 690.3124999999999, 144, 1058, 994.5, 1052.4, 1058.0, 1058.0, 0.0810709472126795, 14.906663113479057, 0.04338562409428551], "isController": false}, {"data": ["deleteBooks", 15, 3, 20.0, 390.53333333333336, 147, 720, 421.0, 652.2, 720.0, 720.0, 0.08080503361489398, 0.01644508691928116, 0.05455917992318134], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 394.5833333333333, 289, 619, 299.5, 610.0, 619.0, 619.0, 0.0751451240207651, 0.1164602654501506, 0.16900314513654496], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9da28014-16c6-44be-b3e4-94a28144233d", 1, 0, 0.0, 421.0, 421, 421, 421.0, 421.0, 421.0, 421.0, 2.375296912114014, 0.42913078978622327, 1.6376558788598576], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=977aaab9-3730-4581-8bb7-07bd4164eb19", 1, 0, 0.0, 225.0, 225, 225, 225.0, 225.0, 225.0, 225.0, 4.444444444444445, 0.8029513888888888, 3.064236111111111], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 551.8260869565219, 159, 1559, 533.0, 1025.8000000000006, 1480.9999999999989, 1559.0, 0.09947623599223221, 0.06110405511632232, 0.04497802467226905], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 148.125, 140, 162, 148.5, 155.70000000000002, 162.0, 162.0, 0.08107053643360577, 0.060248709205052715, 0.04069360910827477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 181.75, 139, 441, 145.5, 431.90000000000003, 441.0, 441.0, 0.08107012565869477, 0.09779479757802999, 0.04197991614308877], "isController": false}, {"data": ["login", 23, 0, 0.0, 2196.869565217392, 1133, 4202, 2047.0, 3357.400000000001, 4085.7999999999984, 4202.0, 0.1029607943201454, 26.91985421954599, 0.19246131835701433], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 169.00000000000003, 145, 443, 152.5, 200.0000000000004, 443.0, 443.0, 0.08889064475347662, 0.07196322705139854, 0.031597846377212385], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5a06abd8-b879-44c2-a23f-451dec4189e6", 3, 0, 0.0, 452.66666666666663, 229, 820, 309.0, 820.0, 820.0, 820.0, 0.03399356388523773, 0.028339035517608666, 0.021799258090468204], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 976.875, 292, 1478, 1280.5, 1475.9, 1478.0, 1478.0, 0.08100814638172052, 60.61827133995069, 0.16923503627646055], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/20c9c1ee-e13b-4090-a3c0-60fb02cbc364", 3, 0, 0.0, 324.6666666666667, 240, 444, 290.0, 444.0, 444.0, 444.0, 0.020431791868146837, 0.024149686286862357, 0.013102418613362391], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e7464fe1-9f42-4874-bac0-5662664a4c1c", 1, 0, 0.0, 607.0, 607, 607, 607.0, 607.0, 607.0, 607.0, 1.6474464579901154, 0.2976343698517298, 1.1358371087314663], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/60b3ff37-39a9-4273-8055-5a6c963ed5d3", 3, 0, 0.0, 335.6666666666667, 234, 436, 337.0, 436.0, 436.0, 436.0, 0.023937761819269897, 0.02400789198084979, 0.015350713145820866], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 402.6875, 290, 589, 300.5, 583.4, 589.0, 589.0, 0.09738224356516394, 0.15092345755655778, 0.21901494817438727], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 6, 54.54545454545455, 733.9999999999999, 142, 1792, 148.0, 1721.2000000000003, 1792.0, 1792.0, 0.09528842072436525, 51.83121605350012, 0.1321044014587791], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/66224b57-5512-4096-9e40-67a79c58a4a7", 3, 0, 0.0, 324.6666666666667, 227, 445, 302.0, 445.0, 445.0, 445.0, 0.030662619200932145, 0.030752451093122374, 0.019663203068306094], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8f66eaad-0811-4755-b717-37936559e8d2", 1, 0, 0.0, 231.0, 231, 231, 231.0, 231.0, 231.0, 231.0, 4.329004329004329, 0.7820955086580086, 2.9846455627705626], "isController": false}, {"data": ["register", 24, 6, 25.0, 1010.7499999999999, 155, 1719, 1028.0, 1620.0, 1702.0, 1719.0, 0.09573347799725564, 0.030197181047962474, 0.043192252768293075], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/73565f80-2340-4852-8abd-9b7aa7ca289f", 3, 0, 0.0, 291.3333333333333, 218, 432, 224.0, 432.0, 432.0, 432.0, 0.021911724964028254, 0.025898917104292506, 0.01405146425102072], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 150.10526315789474, 141, 156, 150.0, 155.0, 156.0, 156.0, 0.09830247153108686, 0.07631881334688873, 0.03494345667706603], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 506.6666666666665, 290, 1727, 303.0, 1491.2000000000003, 1727.0, 1727.0, 0.09061254077564335, 12.1697283008135, 0.2012137203747332], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 454.37499999999994, 285, 589, 572.5, 588.3, 589.0, 589.0, 0.0999968750976532, 0.15497562576169496, 0.22489531577138214], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 185.75, 144, 437, 149.5, 437.0, 437.0, 437.0, 0.04781143171332266, 0.035531737826014195, 0.02399909755922641], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 146.87499999999997, 138, 155, 146.5, 155.0, 155.0, 155.0, 0.04781114597340505, 0.012793216793665024, 0.02726729418795757], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 182.0, 144, 413, 149.0, 413.0, 413.0, 413.0, 0.04781143171332266, 0.012886674953981495, 0.028107892472090074], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 206.87500000000003, 144, 607, 149.5, 607.0, 607.0, 607.0, 0.047810574503815886, 0.012886443909231625, 0.028154078540821265], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 148.33333333333334, 147, 151, 147.0, 151.0, 151.0, 151.0, 0.08578781812982555, 0.02530070417500715, 0.053030946168144126], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1411.7090909090914, 1109, 2364, 1190.0, 1899.2, 1940.8, 2364.0, 0.23262305759746907, 278.2980497464409, 0.4593396703731274], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, 25.0, 1010.7499999999999, 155, 1719, 1028.0, 1620.0, 1702.0, 1719.0, 0.10024937030864275, 0.03162162754852696, 0.04522969636971968], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 4, 0, 0.0, 222.5, 147, 440, 151.5, 440.0, 440.0, 440.0, 0.026124325665843752, 0.007041322152121948, 0.015383758180179473], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=20c9c1ee-e13b-4090-a3c0-60fb02cbc364", 1, 0, 0.0, 409.0, 409, 409, 409.0, 409.0, 409.0, 409.0, 2.444987775061125, 0.441721424205379, 1.6857044621026895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 4, 0, 0.0, 218.25, 145, 437, 145.5, 437.0, 437.0, 437.0, 0.02612466691049689, 0.0070414141282198655, 0.015358446757928837], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 281.2105263157895, 139, 1309, 147.0, 996.0, 1309.0, 1309.0, 0.09510889969014522, 9.031268536849694, 0.055053270369573165], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 287.2105263157895, 141, 1013, 145.0, 991.0, 1013.0, 1013.0, 0.09510889969014522, 2.9666389891425684, 0.05514615015442682], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 193.42105263157893, 139, 443, 149.0, 439.0, 443.0, 443.0, 0.09510699536979102, 0.07068010105118258, 0.04773925353522713], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 4, 0, 0.0, 288.75, 143, 442, 285.0, 442.0, 442.0, 442.0, 0.02612500816406505, 0.0069904807001502185, 0.014899418718568348], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 205.10526315789474, 142, 434, 148.0, 431.0, 434.0, 434.0, 0.09510794752043569, 0.04048540405860652, 0.05340045326445516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 4, 0, 0.0, 296.0, 145, 462, 288.5, 462.0, 462.0, 462.0, 0.026124325665843752, 0.019414659991901458, 0.013113186906487976], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 4, 0, 0.0, 157.0, 147, 174, 153.5, 174.0, 174.0, 174.0, 0.026926235577635068, 0.021193892456615102, 0.009571435302987466], "isController": false}, {"data": ["deleteAccount", 15, 3, 20.0, 468.2666666666667, 143, 820, 444.0, 799.6, 820.0, 820.0, 0.07967323351162432, 0.015779034918122475, 0.05421514561611311], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d6a03f55-91bf-43b6-a5d3-43a618136216", 1, 0, 0.0, 621.0, 621, 621, 621.0, 621.0, 621.0, 621.0, 1.6103059581320451, 0.5142285628019324, 0.9608368558776168], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1048.6956521739128, 694, 1623, 1050.0, 1409.0, 1586.5999999999995, 1623.0, 0.10102296735201233, 0.05228727802399076, 0.04646661877226349], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d3d486d8-4b4b-493f-9e99-c76a7af90918", 3, 0, 0.0, 659.3333333333334, 224, 968, 786.0, 968.0, 968.0, 968.0, 0.015652636686649866, 0.02157842329686269, 0.010037660896061274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 4, 0, 0.0, 591.0, 293, 905, 583.0, 905.0, 905.0, 905.0, 0.026099098276154562, 0.040448504847907504, 0.05869748372068745], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c4ad9d6d-11a8-4a23-9653-4b3f64ff8082", 3, 0, 0.0, 385.3333333333333, 242, 476, 438.0, 476.0, 476.0, 476.0, 0.027577077932822238, 0.027657870153328552, 0.017684519377493428], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/319fc812-1ca5-4e07-a602-b29f1820ad3e", 1, 0, 0.0, 237.0, 237, 237, 237.0, 237.0, 237.0, 237.0, 4.219409282700422, 1.3474090189873418, 2.517635812236287], "isController": false}, {"data": ["addBook", 54, 8, 14.814814814814815, 1332.388888888889, 733, 2685, 1135.5, 2214.5, 2321.0, 2685.0, 0.2719786446397542, 85.39339023426679, 0.9888589882016672], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 275.2, 139, 805, 151.0, 588.8, 595.8, 805.0, 0.23393006766958865, 0.1738484194302314, 0.11308142919574843], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e76961eb-67b6-4e7f-aa51-1fa48d9b7fbc", 1, 0, 0.0, 235.0, 235, 235, 235.0, 235.0, 235.0, 235.0, 4.25531914893617, 1.3588763297872342, 2.5390625], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 831.090909090909, 680, 1196, 733.0, 1112.8, 1152.8, 1196.0, 0.2337451497881419, 68.72883510714027, 0.11755737513759089], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 204.18181818181824, 140, 598, 150.0, 444.4, 451.0, 598.0, 0.23462262018010488, 0.41517205836557614, 0.11410357895477755], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1133.072727272727, 954, 1526, 1033.0, 1334.8, 1391.1999999999996, 1526.0, 0.23345048303027216, 210.05915499281608, 0.11718119948980459], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 151.93749999999997, 146, 181, 150.0, 164.20000000000002, 181.0, 181.0, 0.09432849899775969, 0.07047002122391227, 0.03353083362810989], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 163, 8, 4.9079754601226995, 214.0306748466258, 142, 1031, 153.0, 347.0, 440.39999999999986, 974.0399999999987, 0.7000635640536687, 1.532492122942758, 0.3343831938037932], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 194.75, 151, 430, 160.0, 430.0, 430.0, 430.0, 0.046948632327654505, 0.036357681089677754, 0.016688771647720937], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 170.31250000000003, 145, 428, 151.5, 257.9000000000002, 428.0, 428.0, 0.09704910077942559, 0.07875761987080337, 0.03449792254268644], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9c4a64aa-e321-474e-87d9-eaca37dc7394", 1, 0, 0.0, 261.0, 261, 261, 261.0, 261.0, 261.0, 261.0, 3.8314176245210727, 1.2235093390804597, 2.286129070881226], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2014a90a-1975-45dd-a17e-53efb468e0bd", 1, 0, 0.0, 346.0, 346, 346, 346.0, 346.0, 346.0, 346.0, 2.890173410404624, 0.5221504696531792, 1.9926390895953758], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 394.75, 297, 1044, 300.5, 1044.0, 1044.0, 1044.0, 0.04776917932549919, 0.07403289803668672, 0.10743400389318811], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 529.1578947368422, 287, 1752, 300.0, 1146.0, 1752.0, 1752.0, 0.09503753982823215, 12.099989456772926, 0.21118204972214025], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=60b3ff37-39a9-4273-8055-5a6c963ed5d3", 1, 0, 0.0, 720.0, 720, 720, 720.0, 720.0, 720.0, 720.0, 1.3888888888888888, 0.2509223090277778, 0.9575737847222222], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 219.33333333333337, 145, 430, 154.0, 426.7, 430.0, 430.0, 0.07826767545003914, 0.06489185200887033, 0.0278217127576311], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=66224b57-5512-4096-9e40-67a79c58a4a7", 1, 0, 0.0, 465.0, 465, 465, 465.0, 465.0, 465.0, 465.0, 2.150537634408602, 0.3885248655913978, 1.4826948924731183], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 150.74999999999997, 144, 158, 151.0, 155.2, 158.0, 158.0, 0.08319900161198066, 0.0645929748843014, 0.029574645104258748], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5a06abd8-b879-44c2-a23f-451dec4189e6", 1, 0, 0.0, 454.0, 454, 454, 454.0, 454.0, 454.0, 454.0, 2.2026431718061676, 0.39793846365638763, 1.518619218061674], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8f66eaad-0811-4755-b717-37936559e8d2", 3, 0, 0.0, 313.3333333333333, 243, 438, 259.0, 438.0, 438.0, 438.0, 0.08479127215171986, 0.038365842542607616, 0.05437461137333597], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/977aaab9-3730-4581-8bb7-07bd4164eb19", 3, 0, 0.0, 430.0, 217, 641, 432.0, 641.0, 641.0, 641.0, 0.06325244048999558, 0.0286200821227519, 0.040562274663180756], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e7464fe1-9f42-4874-bac0-5662664a4c1c", 3, 0, 0.0, 459.0, 258, 763, 356.0, 763.0, 763.0, 763.0, 0.029539770377518263, 0.024337616805175367, 0.018943147019437168], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9da28014-16c6-44be-b3e4-94a28144233d", 3, 0, 0.0, 358.0, 225, 441, 408.0, 441.0, 441.0, 441.0, 0.02330151382168128, 0.023369779975455737, 0.014942702548408893], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=73565f80-2340-4852-8abd-9b7aa7ca289f", 1, 0, 0.0, 517.0, 517, 517, 517.0, 517.0, 517.0, 517.0, 1.9342359767891684, 0.34944692940038685, 1.3335650386847195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 145.125, 138, 154, 144.5, 151.2, 154.0, 154.0, 0.10008757662955087, 0.07438149005379707, 0.05023927186288001], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 213.0, 137, 429, 144.0, 429.0, 429.0, 429.0, 0.100083820199417, 0.026780240951797128, 0.05707905370748001], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 235.1875, 139, 443, 146.5, 443.0, 443.0, 443.0, 0.10008507231146474, 0.02697605464644948, 0.0588390757143572], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 270.25, 141, 443, 150.0, 439.5, 443.0, 443.0, 0.10008695053828012, 0.02697656088727082, 0.05893792106892864], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 23.076923076923077, 0.4743083003952569], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 11.538461538461538, 0.23715415019762845], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 11.538461538461538, 0.23715415019762845], "isController": false}, {"data": ["401/Unauthorized", 14, 53.84615384615385, 1.1067193675889329], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1265, 26, "401/Unauthorized", 14, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 163, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
