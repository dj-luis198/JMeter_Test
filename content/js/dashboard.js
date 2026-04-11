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

    var data = {"OkPercent": 98.86535552193646, "KoPercent": 1.13464447806354};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7910981156595192, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/78602f11-ce6f-43e4-b8db-47c915439d9c"], "isController": false}, {"data": [0.13392857142857142, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=090b965e-b10f-4026-a50b-f75b9a5ef41a"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/addb78a4-f968-421b-9bef-e42f93e958d2"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=81b273dd-3431-492c-bef0-859e3712097f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6c95e491-6452-4d86-9ae8-52aedcdb4e7e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a68079ce-309b-454b-b8ef-2dd339f30c9c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d1686406-b690-4776-bb2c-49198e467bb3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e2ae9016-a318-494e-9d7e-3490f950c5ac"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ee2d967e-e9a3-4a9b-90e3-41ee2f010d24"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ba1f07eb-bf5a-41e2-9e8a-a8266b6f9ab0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/81b273dd-3431-492c-bef0-859e3712097f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d915a830-a75c-4b29-885c-27f765d1a49c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ce6beb7c-9ec7-40b1-a5eb-433cf0ff6922"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ec120d67-edc7-4d57-bd2c-1f5000cb00f0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.30434782608695654, 500, 1500, "register"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4014c9fd-a8ca-47aa-9607-612a447bb24e"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4017857142857143, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/090b965e-b10f-4026-a50b-f75b9a5ef41a"], "isController": false}, {"data": [0.30434782608695654, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=78602f11-ce6f-43e4-b8db-47c915439d9c"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=addb78a4-f968-421b-9bef-e42f93e958d2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a68079ce-309b-454b-b8ef-2dd339f30c9c"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3442622950819672, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ca659812-a878-40d8-a26e-4dda155c757a"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9634831460674157, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ca659812-a878-40d8-a26e-4dda155c757a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d915a830-a75c-4b29-885c-27f765d1a49c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e2ae9016-a318-494e-9d7e-3490f950c5ac"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d1686406-b690-4776-bb2c-49198e467bb3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ec120d67-edc7-4d57-bd2c-1f5000cb00f0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8d927408-65c3-4fd1-8aaf-b527f12c79d9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ba1f07eb-bf5a-41e2-9e8a-a8266b6f9ab0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4014c9fd-a8ca-47aa-9607-612a447bb24e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ce6beb7c-9ec7-40b1-a5eb-433cf0ff6922"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1322, 15, 1.13464447806354, 356.6868381240543, 98, 2512, 117.0, 1007.0, 1209.85, 1629.3899999999999, 5.159286129637796, 713.0238939560836, 3.7722531106456128], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/78602f11-ce6f-43e4-b8db-47c915439d9c", 3, 0, 0.0, 880.6666666666666, 218, 1641, 783.0, 1641.0, 1641.0, 1641.0, 0.020646084814116415, 0.024402973294289292, 0.013239839545510852], "isController": false}, {"data": ["see books", 56, 0, 0.0, 1698.1964285714282, 1233, 2203, 1702.5, 2005.6000000000004, 2153.65, 2203.0, 0.25451074853429073, 306.26079398263875, 1.2514273621778849], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=090b965e-b10f-4026-a50b-f75b9a5ef41a", 1, 0, 0.0, 396.0, 396, 396, 396.0, 396.0, 396.0, 396.0, 2.5252525252525255, 0.456222380050505, 1.7410432449494948], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/addb78a4-f968-421b-9bef-e42f93e958d2", 3, 0, 0.0, 399.0, 194, 600, 403.0, 600.0, 600.0, 600.0, 0.01849180812899885, 0.025480411396501347, 0.011858353520223873], "isController": false}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 528.2857142857142, 106, 938, 520.5, 880.0, 938.0, 938.0, 0.07182470667302829, 0.01356232428598546, 0.04857286071393758], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 528.2857142857142, 106, 938, 520.5, 880.0, 938.0, 938.0, 0.0726382201560684, 0.013715936241802259, 0.04912301509577868], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 166.00000000000003, 99, 307, 103.5, 306.3, 307.0, 307.0, 0.11616425625834931, 0.031083013881628624, 0.06624992739733984], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=81b273dd-3431-492c-bef0-859e3712097f", 1, 0, 0.0, 518.0, 518, 518, 518.0, 518.0, 518.0, 518.0, 1.9305019305019306, 0.3487723214285714, 1.3309905888030888], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 102.5625, 99, 105, 103.0, 104.3, 105.0, 105.0, 0.11618365731630274, 0.0863435187672914, 0.05831874986384728], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 139.875, 98, 304, 101.0, 299.1, 304.0, 304.0, 0.1161558230366036, 0.031307624177834566, 0.06840035282331247], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 115.62500000000001, 98, 298, 102.0, 183.90000000000012, 298.0, 298.0, 0.11615666630367709, 0.031307851464662965, 0.06828741515118515], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 239.0, 101, 438, 218.5, 384.0, 438.0, 438.0, 0.07142674931761944, 0.1652042518048009, 0.04617129505624857], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6c95e491-6452-4d86-9ae8-52aedcdb4e7e", 1, 0, 0.0, 227.0, 227, 227, 227.0, 227.0, 227.0, 227.0, 4.405286343612335, 1.406766244493392, 2.6285448788546253], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a68079ce-309b-454b-b8ef-2dd339f30c9c", 3, 0, 0.0, 536.0, 183, 1232, 193.0, 1232.0, 1232.0, 1232.0, 0.03636451792770734, 0.02996048010254794, 0.023319694113796696], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 114.1875, 100, 298, 102.0, 162.90000000000015, 298.0, 298.0, 0.08208327348094642, 0.061001338983398656, 0.041201955633990685], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 139.0, 98, 306, 102.0, 305.3, 306.0, 306.0, 0.08208537905488947, 0.04508082524022799, 0.045521713506636086], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 719.0, 598, 803, 785.0, 803.0, 803.0, 803.0, 0.08401949252226516, 24.704520511258615, 0.04791736682910435], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1076.2, 906, 1204, 1068.0, 1204.0, 1204.0, 1204.0, 0.0836470096194061, 75.26572629130071, 0.047623248640736096], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 182.8, 101, 305, 104.0, 305.0, 305.0, 305.0, 0.08502244592572439, 0.1504498750170045, 0.04707785824207591], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 139.6923076923077, 100, 374, 103.0, 344.0, 374.0, 374.0, 0.08496954168736437, 0.06314630978914482, 0.04265072697979032], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 163.6923076923077, 99, 308, 103.0, 305.6, 308.0, 308.0, 0.0849689863199932, 0.03255272162199258, 0.04790994676366203], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 222.2307692307692, 99, 1062, 102.0, 759.5999999999997, 1062.0, 1062.0, 0.0849689863199932, 5.902312678108067, 0.04939077645313306], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 195.1538461538462, 99, 586, 108.0, 512.4, 586.0, 586.0, 0.0849678756070301, 1.9429380461637005, 0.049473107258870976], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 146.4, 103, 304, 105.0, 304.0, 304.0, 304.0, 0.08500076500688507, 0.06316951383812454, 0.04772992175679581], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 689.3333333333334, 100, 1403, 908.5, 1291.4, 1403.0, 1403.0, 0.08305762815099878, 41.52961617281985, 0.044863375969582446], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 282.875, 99, 1208, 101.5, 1205.9, 1208.0, 1208.0, 0.08208411569756108, 13.866619364091791, 0.04693383763761915], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 475.55555555555554, 99, 891, 588.5, 826.2, 891.0, 891.0, 0.08298219570889845, 13.565229912545988, 0.04490366861982168], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 221.87499999999994, 99, 815, 103.0, 740.1000000000001, 815.0, 815.0, 0.08208369458709336, 4.543350531363667, 0.047013756714189704], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 557.3571428571429, 105, 1898, 461.0, 1474.0, 1898.0, 1898.0, 0.07270649944171795, 0.0137288291007764, 0.04975749623484199], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 402.61538461538464, 200, 1164, 217.0, 1008.7999999999998, 1164.0, 1164.0, 0.08491182233834095, 7.935632348138472, 0.18929748734487264], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 575.4285714285713, 120, 1178, 599.0, 952.8000000000001, 1157.0999999999997, 1178.0, 0.09415478149365351, 0.05783531011670709, 0.042571937335509354], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 113.6111111111111, 100, 305, 103.0, 128.60000000000028, 305.0, 305.0, 0.08305686165033983, 0.06172487472256701, 0.04169065125808074], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 190.88888888888889, 99, 306, 109.5, 304.2, 306.0, 306.0, 0.0829799004241195, 0.09144356214272543, 0.0434527994191407], "isController": false}, {"data": ["login", 21, 0, 0.0, 2512.1428571428573, 1648, 3732, 2433.0, 3388.2000000000003, 3701.0999999999995, 3732.0, 0.09077077353988727, 25.980394424675385, 0.17279118372652927], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d1686406-b690-4776-bb2c-49198e467bb3", 1, 0, 0.0, 1050.0, 1050, 1050, 1050.0, 1050.0, 1050.0, 1050.0, 0.9523809523809523, 0.1720610119047619, 0.6566220238095238], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e2ae9016-a318-494e-9d7e-3490f950c5ac", 1, 0, 0.0, 1898.0, 1898, 1898, 1898.0, 1898.0, 1898.0, 1898.0, 0.5268703898840885, 0.09518654504741834, 0.36325243677555324], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 117.6875, 101, 301, 104.5, 176.40000000000012, 301.0, 301.0, 0.08411976551615363, 0.0681008648563392, 0.029901947898320232], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ee2d967e-e9a3-4a9b-90e3-41ee2f010d24", 1, 0, 0.0, 267.0, 267, 267, 267.0, 267.0, 267.0, 267.0, 3.745318352059925, 1.1960147471910112, 2.234755383895131], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ba1f07eb-bf5a-41e2-9e8a-a8266b6f9ab0", 3, 0, 0.0, 313.3333333333333, 278, 379, 283.0, 379.0, 379.0, 379.0, 0.06060483626593402, 0.027422110159390722, 0.03886442950647462], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/81b273dd-3431-492c-bef0-859e3712097f", 3, 0, 0.0, 277.0, 204, 382, 245.0, 382.0, 382.0, 382.0, 0.01947621953594661, 0.026849540929275356, 0.012489632970642846], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d915a830-a75c-4b29-885c-27f765d1a49c", 3, 0, 0.0, 405.33333333333337, 210, 780, 226.0, 780.0, 780.0, 780.0, 0.02179044852006537, 0.026138607681133103, 0.013973692573088795], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ce6beb7c-9ec7-40b1-a5eb-433cf0ff6922", 1, 0, 0.0, 652.0, 652, 652, 652.0, 652.0, 652.0, 652.0, 1.5337423312883436, 0.277092120398773, 1.0574434432515336], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 816.1666666666667, 202, 1507, 1011.0, 1396.3000000000002, 1507.0, 1507.0, 0.08294090000092157, 55.18276948880759, 0.17474646867598678], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ec120d67-edc7-4d57-bd2c-1f5000cb00f0", 3, 0, 0.0, 430.66666666666663, 275, 687, 330.0, 687.0, 687.0, 687.0, 0.023198267862666256, 0.02326623153804516, 0.01487649338849366], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 295.5625, 204, 411, 224.5, 408.9, 411.0, 411.0, 0.11606819006166122, 0.1798830250272035, 0.26104007979688065], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, 28.571428571428573, 902.7142857142858, 101, 1373, 1109.0, 1373.0, 1373.0, 1373.0, 0.1168770453482936, 99.88434912008282, 0.21037215947038002], "isController": false}, {"data": ["register", 23, 5, 21.73913043478261, 1108.391304347826, 167, 2512, 1193.0, 1721.0, 2359.399999999998, 2512.0, 0.09173689857488722, 0.02904170838036511, 0.04138910853671669], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/4014c9fd-a8ca-47aa-9607-612a447bb24e", 3, 0, 0.0, 497.66666666666663, 298, 757, 438.0, 757.0, 757.0, 757.0, 0.08351195612838572, 0.03778698535757036, 0.05355421665785151], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 423.5, 202, 1504, 208.0, 1369.6000000000001, 1504.0, 1504.0, 0.08203950202022274, 18.506011596732264, 0.18057302989827104], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 109.1111111111111, 103, 125, 106.0, 120.5, 125.0, 125.0, 0.13744549904169945, 0.10670817552553813, 0.04885757973747909], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 20, 0, 0.0, 298.4, 202, 424, 214.5, 409.0, 423.25, 424.0, 0.1284653528943244, 0.19909620609696566, 0.288921589566044], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 105.74999999999999, 101, 120, 104.5, 117.60000000000001, 120.0, 120.0, 0.051064916274814354, 0.037949610630013404, 0.025632194302006424], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 119.66666666666667, 99, 295, 103.5, 239.80000000000018, 295.0, 295.0, 0.05102431308518509, 0.013652990024746792, 0.029099803556394622], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 119.83333333333333, 98, 303, 103.0, 245.4000000000002, 303.0, 303.0, 0.051066220120941835, 0.013763942141972603, 0.030021352063288067], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 103.41666666666667, 101, 111, 102.5, 109.80000000000001, 111.0, 111.0, 0.05106665475111389, 0.013764059288386166, 0.03007147735832195], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 105.0, 105, 105, 105.0, 105.0, 105.0, 105.0, 9.523809523809526, 2.808779761904762, 5.887276785714286], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1184.0000000000002, 784, 1765, 1106.5, 1580.9, 1705.65, 1765.0, 0.24985722444317535, 298.916104859723, 0.4933704177969732], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/090b965e-b10f-4026-a50b-f75b9a5ef41a", 3, 0, 0.0, 724.6666666666666, 294, 1019, 861.0, 1019.0, 1019.0, 1019.0, 0.021102982554867755, 0.02494301095596511, 0.013532837120146314], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, 21.73913043478261, 1108.391304347826, 167, 2512, 1193.0, 1721.0, 2359.399999999998, 2512.0, 0.08976065127206453, 0.028416075742379122, 0.040497481335638484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 4, 0, 0.0, 200.25, 102, 302, 198.5, 302.0, 302.0, 302.0, 0.056610716408616146, 0.015258357157009822, 0.033336193353901894], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 4, 0, 0.0, 102.0, 101, 103, 102.0, 103.0, 103.0, 103.0, 0.05676657584014532, 0.015300366144414169, 0.03337253774977293], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 206.5, 98, 998, 102.0, 375.20000000000095, 998.0, 998.0, 0.1377283995959967, 6.9199628826745325, 0.08031167745539129], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 184.8888888888889, 99, 800, 102.5, 353.6000000000007, 800.0, 800.0, 0.13751795373284845, 2.2813864435947195, 0.08032325791492223], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 117.33333333333334, 100, 343, 103.5, 133.30000000000032, 343.0, 343.0, 0.13772945344361892, 0.10235558014706445, 0.06913372956056653], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 4, 0, 0.0, 100.5, 98, 103, 100.5, 103.0, 103.0, 103.0, 0.05676899277614567, 0.015190140645179604, 0.032376066192645575], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 168.3333333333333, 98, 305, 103.0, 305.0, 305.0, 305.0, 0.13773156118724605, 0.04834652782560124, 0.07790740326270765], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 4, 0, 0.0, 101.5, 100, 102, 102.0, 102.0, 102.0, 102.0, 0.0567649646638095, 0.04218568174722562, 0.028493351403513754], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=78602f11-ce6f-43e4-b8db-47c915439d9c", 1, 0, 0.0, 527.0, 527, 527, 527.0, 527.0, 527.0, 527.0, 1.8975332068311195, 0.34281605787476277, 1.3082601992409866], "isController": false}, {"data": ["deleteAccount", 14, 1, 7.142857142857143, 600.4285714285716, 101, 1232, 555.0, 1046.5, 1232.0, 1232.0, 0.07276961141027506, 0.013598618092084746, 0.049526583323803976], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 4, 0, 0.0, 106.25, 103, 113, 104.5, 113.0, 113.0, 113.0, 0.05583472920156337, 0.04394803880513679, 0.01984750139586823], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=addb78a4-f968-421b-9bef-e42f93e958d2", 1, 0, 0.0, 408.0, 408, 408, 408.0, 408.0, 408.0, 408.0, 2.450980392156863, 0.44280407475490197, 1.6898360906862746], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a68079ce-309b-454b-b8ef-2dd339f30c9c", 1, 0, 0.0, 528.0, 528, 528, 528.0, 528.0, 528.0, 528.0, 1.893939393939394, 0.3421667850378788, 1.305782433712121], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1343.4761904761906, 880, 2035, 1275.0, 1781.6000000000001, 2011.8999999999996, 2035.0, 0.09348748380663227, 0.048387076579604595, 0.04300059069621465], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 4, 0, 0.0, 303.0, 206, 405, 300.5, 405.0, 405.0, 405.0, 0.05652831361908396, 0.08760784542332642, 0.12713350221167027], "isController": false}, {"data": ["addBook", 61, 6, 9.836065573770492, 1005.8196721311473, 530, 2023, 836.0, 1747.0, 1901.6, 2023.0, 0.29355007916227543, 87.47723746216333, 1.068856141212025], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 186.71428571428564, 99, 419, 104.0, 408.20000000000005, 412.45, 419.0, 0.25119767462724063, 0.1866810843665333, 0.1214285634184415], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ca659812-a878-40d8-a26e-4dda155c757a", 3, 0, 0.0, 303.6666666666667, 187, 409, 315.0, 409.0, 409.0, 409.0, 0.10163978858923974, 0.04598935746713647, 0.0651791613023445], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 652.6071428571429, 494, 1008, 605.0, 807.6, 920.05, 1008.0, 0.2506635870854539, 73.70341741753839, 0.12606615952051636], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 160.83928571428572, 99, 414, 106.0, 308.20000000000005, 407.75, 414.0, 0.2515892804995844, 0.44519509400903023, 0.12235494305546195], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 995.8749999999998, 682, 1344, 995.5, 1210.3, 1261.6999999999998, 1344.0, 0.25036101163731633, 225.275278358973, 0.1256694921695123], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 20, 0, 0.0, 107.49999999999999, 102, 122, 107.0, 113.80000000000001, 121.6, 122.0, 0.1283120549175595, 0.09585812696477834, 0.04561092577147623], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 6, 3.3707865168539324, 161.21910112359552, 100, 896, 110.0, 295.0, 329.7999999999997, 578.4200000000033, 0.754310801476415, 1.5832407329421936, 0.36442160544247953], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 124.58333333333334, 103, 315, 106.0, 255.60000000000022, 315.0, 315.0, 0.05285272587933723, 0.04092989416241643, 0.018787492402420655], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ca659812-a878-40d8-a26e-4dda155c757a", 1, 0, 0.0, 198.0, 198, 198, 198.0, 198.0, 198.0, 198.0, 5.050505050505051, 0.91244476010101, 3.4820864898989896], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 111.375, 104, 135, 107.5, 125.9, 135.0, 135.0, 0.11679769908532803, 0.094784070253816, 0.041517932096737695], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d915a830-a75c-4b29-885c-27f765d1a49c", 1, 0, 0.0, 388.0, 388, 388, 388.0, 388.0, 388.0, 388.0, 2.577319587628866, 0.46562902706185566, 1.7769410438144329], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e2ae9016-a318-494e-9d7e-3490f950c5ac", 3, 0, 0.0, 305.0, 200, 496, 219.0, 496.0, 496.0, 496.0, 0.020359687818120125, 0.024064461740753308, 0.013056180013573126], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d1686406-b690-4776-bb2c-49198e467bb3", 3, 0, 0.0, 307.6666666666667, 202, 510, 211.0, 510.0, 510.0, 510.0, 0.029332394696703037, 0.029418329446791038, 0.01881016196370605], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ec120d67-edc7-4d57-bd2c-1f5000cb00f0", 1, 0, 0.0, 514.0, 514, 514, 514.0, 514.0, 514.0, 514.0, 1.9455252918287937, 0.3514865029182879, 1.3413484922178989], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 244.25, 203, 404, 213.5, 402.2, 404.0, 404.0, 0.051000675758953805, 0.07904108635689423, 0.11470171511022521], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 370.5, 202, 1100, 405.5, 685.1000000000007, 1100.0, 1100.0, 0.13740877584048367, 9.333829551570277, 0.3070823727442059], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8d927408-65c3-4fd1-8aaf-b527f12c79d9", 1, 0, 0.0, 231.0, 231, 231, 231.0, 231.0, 231.0, 231.0, 4.329004329004329, 1.3824066558441557, 2.58302895021645], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ba1f07eb-bf5a-41e2-9e8a-a8266b6f9ab0", 1, 0, 0.0, 319.0, 319, 319, 319.0, 319.0, 319.0, 319.0, 3.134796238244514, 0.5663450235109718, 2.161295062695925], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 106.46153846153847, 99, 112, 107.0, 112.0, 112.0, 112.0, 0.08278461989123374, 0.06863685770279049, 0.029427345351962], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 119.99999999999999, 102, 299, 109.0, 146.00000000000023, 299.0, 299.0, 0.08102450991424906, 0.06290477088069141, 0.028801681258580722], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4014c9fd-a8ca-47aa-9607-612a447bb24e", 1, 0, 0.0, 302.0, 302, 302, 302.0, 302.0, 302.0, 302.0, 3.3112582781456954, 0.5982253725165563, 2.282957367549669], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 20, 0, 0.0, 104.60000000000002, 101, 119, 103.0, 111.7, 118.64999999999999, 119.0, 0.12855040139862836, 0.09553403853941035, 0.06452627570204589], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ce6beb7c-9ec7-40b1-a5eb-433cf0ff6922", 3, 0, 0.0, 341.3333333333333, 238, 429, 357.0, 429.0, 429.0, 429.0, 0.022928417480625487, 0.02710061323963253, 0.014703444803656316], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 20, 0, 0.0, 131.4, 99, 303, 101.5, 300.9, 302.9, 303.0, 0.1285512276642242, 0.034397496464841235, 0.07331437202725286], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 20, 0, 0.0, 171.90000000000003, 98, 307, 103.0, 304.0, 306.85, 307.0, 0.12855370652474338, 0.034649241211747235, 0.07557551887489797], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 20, 0, 0.0, 170.5, 100, 305, 103.5, 302.40000000000003, 304.9, 305.0, 0.12855288022728148, 0.03464901849875946, 0.0757005730244636], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 33.333333333333336, 0.37821482602118], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 6.666666666666667, 0.07564296520423601], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 6.666666666666667, 0.07564296520423601], "isController": false}, {"data": ["401/Unauthorized", 8, 53.333333333333336, 0.6051437216338881], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1322, 15, "401/Unauthorized", 8, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
