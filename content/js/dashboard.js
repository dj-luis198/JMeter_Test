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

    var data = {"OkPercent": 97.96582587469487, "KoPercent": 2.034174125305126};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7306889352818372, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.018518518518518517, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2adbf7c4-8e6f-40fe-9f09-cf3e1dbf7fbc"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0e4f5af4-c109-4f10-8da2-09da2ca7e1fe"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/357a9ce6-7090-491e-a573-4f1cdfd72530"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=70b74b24-77a5-4577-abd8-a8a7faa4821b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/9288948e-e982-4d02-991a-a9e6674cdff8"], "isController": false}, {"data": [0.6956521739130435, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8ca9d6cf-abed-4821-b9b4-8cb1a622c78b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/70b74b24-77a5-4577-abd8-a8a7faa4821b"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5415064e-2d00-493c-81fb-fb6957889390"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4a6daab1-e5fa-462e-a86c-e6ce57a386a9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/099550e7-2787-42f7-b81e-d716116d0d97"], "isController": false}, {"data": [0.5952380952380952, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ab8b4c52-3be4-4926-968a-b17dc10629b1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ebb6eaf5-d4b1-40c0-90ea-95825b713b29"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/e74952af-aa92-4f5a-9eee-f94c4b22fa4c"], "isController": false}, {"data": [0.2708333333333333, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/56774f1f-e2e1-4816-8373-436093fd3990"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/20e67e31-d385-4bde-a58c-3d8c98698603"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/cbbb1c1e-683f-41eb-ac89-080427c61e18"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5b0ec87e-43e8-40e6-b9f0-d1e3be8b549c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.32407407407407407, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2708333333333333, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2adbf7c4-8e6f-40fe-9f09-cf3e1dbf7fbc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.32608695652173914, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1c21742a-8e0f-4204-8303-edaacab2f3cc"], "isController": false}, {"data": [0.23529411764705882, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0e4f5af4-c109-4f10-8da2-09da2ca7e1fe"], "isController": false}, {"data": [0.9351851851851852, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4722222222222222, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8621794871794872, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=357a9ce6-7090-491e-a573-4f1cdfd72530"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/4a6daab1-e5fa-462e-a86c-e6ce57a386a9"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.6818181818181818, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9288948e-e982-4d02-991a-a9e6674cdff8"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ebb6eaf5-d4b1-40c0-90ea-95825b713b29"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=56774f1f-e2e1-4816-8373-436093fd3990"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5b0ec87e-43e8-40e6-b9f0-d1e3be8b549c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5415064e-2d00-493c-81fb-fb6957889390"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ab8b4c52-3be4-4926-968a-b17dc10629b1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8ca9d6cf-abed-4821-b9b4-8cb1a622c78b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1229, 25, 2.034174125305126, 834.009764035801, 116, 31269, 222.0, 1269.0, 1515.0, 25660.800000000043, 4.808256586411687, 705.1969353538411, 3.5040859116419276], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 5779.703703703704, 1468, 33359, 2210.0, 24817.5, 29877.5, 33359.0, 0.22777121646701537, 274.0840586840412, 1.1199492919056857], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2adbf7c4-8e6f-40fe-9f09-cf3e1dbf7fbc", 1, 0, 0.0, 308.0, 308, 308, 308.0, 308.0, 308.0, 308.0, 3.246753246753247, 0.5865716314935066, 2.2384841720779223], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0e4f5af4-c109-4f10-8da2-09da2ca7e1fe", 1, 0, 0.0, 826.0, 826, 826, 826.0, 826.0, 826.0, 826.0, 1.2106537530266344, 0.21872162530266345, 0.8346890133171914], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 1055.7857142857144, 124, 7559, 563.0, 4298.5, 7559.0, 7559.0, 0.07940379096384859, 0.015641483376249193, 0.053426964818448906], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 1055.7857142857144, 124, 7559, 563.0, 4298.5, 7559.0, 7559.0, 0.07994061554273968, 0.01574723062867584, 0.05378816807514418], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 177.07142857142858, 118, 378, 124.0, 377.0, 378.0, 378.0, 0.11682340473468569, 0.03125938759502332, 0.06662584801275044], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 125.5, 121, 134, 126.0, 130.5, 134.0, 134.0, 0.11681853075665032, 0.08681533389239345, 0.05863742657120924], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 202.71428571428572, 121, 486, 126.0, 431.0, 486.0, 486.0, 0.11682437957909846, 0.03148782105842888, 0.06879404383417614], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 186.0, 117, 501, 123.5, 440.0, 501.0, 501.0, 0.11682340473468569, 0.031487558307395754, 0.06867938442410233], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 247.57142857142856, 121, 391, 229.0, 380.0, 391.0, 391.0, 0.07884170275551751, 0.13919938186697153, 0.050958929808358346], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 124.5625, 119, 131, 124.0, 128.9, 131.0, 131.0, 0.10606351878981525, 0.07882259550688418, 0.05323891470504398], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 140.0, 120, 377, 124.0, 206.20000000000016, 377.0, 377.0, 0.10606633123189416, 0.038337696139848464, 0.059934209872123785], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 884.6666666666667, 685, 994, 958.0, 994.0, 994.0, 994.0, 0.03480096746689558, 10.232639936140226, 0.019847426758463887], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1189.3333333333333, 1029, 1322, 1177.0, 1322.0, 1322.0, 1322.0, 0.03468027674860845, 31.20537397982186, 0.01974472787542845], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 246.33333333333334, 122, 379, 244.0, 379.0, 379.0, 379.0, 0.034875002179687635, 0.06171240620077539, 0.019310670152229384], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 7, 0, 0.0, 193.28571428571428, 123, 367, 126.0, 367.0, 367.0, 367.0, 0.031768219073638734, 0.023608998745155346, 0.015946156839697568], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 7, 0, 0.0, 229.99999999999997, 121, 387, 131.0, 387.0, 387.0, 387.0, 0.031733798762381846, 0.008491270371965455, 0.0180981821066709], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/357a9ce6-7090-491e-a573-4f1cdfd72530", 3, 0, 0.0, 362.0, 237, 540, 309.0, 540.0, 540.0, 540.0, 0.05809112561237728, 0.037346996446759484, 0.03725244708866642], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 7, 0, 0.0, 158.57142857142858, 119, 375, 123.0, 375.0, 375.0, 375.0, 0.031768651602274635, 0.008562644377175585, 0.018676492445868487], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 7, 0, 0.0, 192.0, 120, 361, 127.0, 361.0, 361.0, 361.0, 0.031734086488986006, 0.00855332799898451, 0.018687162258650938], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=70b74b24-77a5-4577-abd8-a8a7faa4821b", 1, 0, 0.0, 561.0, 561, 561, 561.0, 561.0, 561.0, 561.0, 1.7825311942959001, 0.32203932709447414, 1.2289717023172904], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 125.83333333333333, 122, 129, 126.0, 129.0, 129.0, 129.0, 0.03492148486153631, 0.025952392558231577, 0.019609232222054084], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 21, 0, 0.0, 736.9523809523811, 120, 1491, 376.0, 1474.6000000000001, 1490.2, 1491.0, 0.09386859290979228, 40.23378832129431, 0.05134311708542488], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 228.3125, 116, 1305, 123.5, 655.4000000000007, 1305.0, 1305.0, 0.10606562810739145, 5.9916786646503155, 0.061785299966854494], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 21, 0, 0.0, 556.9523809523811, 120, 1121, 380.0, 1119.2, 1120.9, 1121.0, 0.09386901249798851, 13.156398625936454, 0.05143501554426147], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 180.1875, 118, 1022, 125.5, 396.90000000000066, 1022.0, 1022.0, 0.10606562810739145, 1.9759772746105404, 0.061888879681803115], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 2263.5, 125, 25021, 485.0, 13094.0, 25021.0, 25021.0, 0.07980027132092249, 0.01571958469658797, 0.054205848362384436], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 7, 0, 0.0, 427.14285714285717, 251, 735, 257.0, 735.0, 735.0, 735.0, 0.03171596989701371, 0.04915355881500075, 0.07132995964142831], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9288948e-e982-4d02-991a-a9e6674cdff8", 3, 0, 0.0, 563.6666666666666, 391, 657, 643.0, 657.0, 657.0, 657.0, 0.09640412609659693, 0.042678909990680934, 0.06182165638355988], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 1773.3043478260868, 226, 27690, 630.0, 1099.2, 22372.799999999923, 27690.0, 0.09452184276496939, 0.05806078037027904, 0.04273790351580158], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 21, 0, 0.0, 149.61904761904762, 120, 402, 126.0, 318.20000000000016, 398.29999999999995, 402.0, 0.09396814032575622, 0.06983374491005907, 0.04716760168695185], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 21, 0, 0.0, 211.3809523809524, 120, 508, 126.0, 378.0, 495.0999999999998, 508.0, 0.09396940177288939, 0.09235255473717653, 0.04983384755478192], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8ca9d6cf-abed-4821-b9b4-8cb1a622c78b", 3, 0, 0.0, 389.0, 326, 498, 343.0, 498.0, 498.0, 498.0, 0.03346458888752552, 0.02789805082713309, 0.021460039097794682], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/70b74b24-77a5-4577-abd8-a8a7faa4821b", 3, 0, 0.0, 929.6666666666667, 217, 1759, 813.0, 1759.0, 1759.0, 1759.0, 0.02120770829504164, 0.025066793235447977, 0.013599995228265634], "isController": false}, {"data": ["login", 23, 0, 0.0, 3955.4782608695655, 1753, 30896, 2752.0, 4238.200000000001, 25623.799999999927, 30896.0, 0.09548996732582422, 29.932147631641225, 0.1853807649472937], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5415064e-2d00-493c-81fb-fb6957889390", 1, 0, 0.0, 25021.0, 25021, 25021, 25021.0, 25021.0, 25021.0, 25021.0, 0.03996642820031174, 0.007220497282282882, 0.027554978817793053], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 132.0, 122, 141, 130.0, 138.9, 141.0, 141.0, 0.11225076821619498, 0.09087488950315004, 0.03990164026435056], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4a6daab1-e5fa-462e-a86c-e6ce57a386a9", 1, 0, 0.0, 454.0, 454, 454, 454.0, 454.0, 454.0, 454.0, 2.2026431718061676, 0.39793846365638763, 1.518619218061674], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/099550e7-2787-42f7-b81e-d716116d0d97", 1, 0, 0.0, 259.0, 259, 259, 259.0, 259.0, 259.0, 259.0, 3.8610038610038613, 1.2329572876447876, 2.303782577220077], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 21, 0, 0.0, 930.1428571428572, 248, 1624, 910.0, 1601.4, 1622.6, 1624.0, 0.09381533568020586, 53.52175807286548, 0.19956263485954504], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ab8b4c52-3be4-4926-968a-b17dc10629b1", 1, 0, 0.0, 475.0, 475, 475, 475.0, 475.0, 475.0, 475.0, 2.1052631578947367, 0.38034539473684215, 1.451480263157895], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ebb6eaf5-d4b1-40c0-90ea-95825b713b29", 3, 0, 0.0, 451.33333333333337, 227, 894, 233.0, 894.0, 894.0, 894.0, 0.05289046384936796, 0.034623282161809564, 0.033917387299236615], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, 40.0, 838.5999999999999, 121, 1447, 1197.0, 1446.8, 1447.0, 1447.0, 0.057757729428140725, 41.46517642098454, 0.09345020128568705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 427.8571428571429, 244, 628, 501.0, 621.0, 628.0, 628.0, 0.11669875882534364, 0.18086028345294955, 0.2624582437253578], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e74952af-aa92-4f5a-9eee-f94c4b22fa4c", 1, 0, 0.0, 562.0, 562, 562, 562.0, 562.0, 562.0, 562.0, 1.779359430604982, 0.5682134119217082, 1.0617076290035585], "isController": false}, {"data": ["register", 24, 7, 29.166666666666668, 2243.1249999999995, 256, 27701, 1195.5, 1863.5, 21308.0, 27701.0, 0.0966206913210464, 0.030335500253629313, 0.04359253846711273], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/56774f1f-e2e1-4816-8373-436093fd3990", 3, 0, 0.0, 360.0, 324, 404, 352.0, 404.0, 404.0, 404.0, 0.02409754686972866, 0.024168145151573568, 0.01545317947049657], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 356.25, 242, 1437, 251.5, 782.5000000000007, 1437.0, 1437.0, 0.10597781089584368, 8.07812370632555, 0.2366518670309654], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 11, 0, 0.0, 2621.090909090909, 126, 27264, 131.0, 21886.800000000017, 27264.0, 27264.0, 0.07141419584369381, 0.05544363837474275, 0.02538551492881303], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 523.0000000000001, 250, 1496, 486.0, 1300.7999999999997, 1496.0, 1496.0, 0.0899161663977997, 12.778369252968556, 0.19951698985798536], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/20e67e31-d385-4bde-a58c-3d8c98698603", 1, 0, 0.0, 302.0, 302, 302, 302.0, 302.0, 302.0, 302.0, 3.3112582781456954, 1.0574037665562914, 1.9757605546357617], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cbbb1c1e-683f-41eb-ac89-080427c61e18", 1, 0, 0.0, 1813.0, 1813, 1813, 1813.0, 1813.0, 1813.0, 1813.0, 0.5515719801434088, 0.1761367553778268, 0.3291117967457253], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 126.30000000000001, 121, 130, 127.0, 129.9, 130.0, 130.0, 0.04550894933488671, 0.033820615667821075, 0.022843359334113054], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 125.10000000000001, 119, 128, 125.5, 128.0, 128.0, 128.0, 0.0455083280240284, 0.012177033084554473, 0.025953968326203693], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 147.9, 120, 363, 124.5, 339.5000000000001, 363.0, 363.0, 0.04550894933488671, 0.012266084000418682, 0.02675428466757988], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5b0ec87e-43e8-40e6-b9f0-d1e3be8b549c", 1, 0, 0.0, 214.0, 214, 214, 214.0, 214.0, 214.0, 214.0, 4.672897196261682, 0.8442245911214954, 3.2217435747663554], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 148.6, 120, 376, 122.5, 351.6000000000001, 376.0, 376.0, 0.04550894933488671, 0.012266084000418682, 0.02679872700091473], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 128.5, 125, 132, 128.5, 132.0, 132.0, 132.0, 0.021953655832537514, 0.00647461334123665, 0.013570961076168208], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1432.8703703703704, 961, 2522, 1344.5, 1986.0, 2116.0, 2522.0, 0.22500093750390626, 269.17934423685097, 0.4442889605790024], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, 29.166666666666668, 2243.1249999999995, 256, 27701, 1195.5, 1863.5, 21308.0, 27701.0, 0.09708266589000535, 0.030480544026988982, 0.04380096839959226], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2adbf7c4-8e6f-40fe-9f09-cf3e1dbf7fbc", 3, 0, 0.0, 327.0, 231, 472, 278.0, 472.0, 472.0, 472.0, 0.07230483719360825, 0.03271605589163915, 0.046367359788869876], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 180.55555555555554, 121, 380, 126.0, 380.0, 380.0, 380.0, 0.04662391081363904, 0.01256660096148865, 0.027455291231078465], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 176.66666666666666, 120, 374, 123.0, 374.0, 374.0, 374.0, 0.04662487696213024, 0.012566861368699165, 0.027410328057814848], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 11, 0, 0.0, 423.0, 121, 1506, 126.0, 1460.2000000000003, 1506.0, 1506.0, 0.07009539345818809, 11.483086598875925, 0.040113184146970925], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 11, 0, 0.0, 328.9090909090909, 119, 1019, 127.0, 1013.2, 1019.0, 1019.0, 0.07009584013050571, 3.7628223612102367, 0.04018189273106138], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 123.77777777777777, 119, 127, 124.0, 127.0, 127.0, 127.0, 0.046624393882879527, 0.012475667894442372, 0.026590474636329728], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 11, 0, 0.0, 192.0, 120, 379, 128.0, 376.2, 379.0, 379.0, 0.07009762687670464, 0.05209403716130101, 0.035185722865845884], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 153.44444444444446, 121, 379, 125.0, 379.0, 379.0, 379.0, 0.046624393882879527, 0.034649573969600896, 0.02340326021074226], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 11, 0, 0.0, 167.81818181818178, 120, 377, 122.0, 374.40000000000003, 377.0, 377.0, 0.07009718018161543, 0.037898777282141145, 0.03890692209654293], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 134.1111111111111, 122, 147, 130.0, 147.0, 147.0, 147.0, 0.0481257686754719, 0.037880243703545265, 0.01710720683385915], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 589.8571428571428, 122, 1759, 517.0, 1326.5, 1759.0, 1759.0, 0.07973028383981047, 0.015394351678891976, 0.054258415816210305], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1432.3478260869567, 909, 2403, 1359.0, 1899.4000000000003, 2318.5999999999985, 2403.0, 0.09623672560817426, 0.04981002399641832, 0.04426513453266609], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 336.1111111111111, 248, 754, 253.0, 754.0, 754.0, 754.0, 0.04659373883691673, 0.07221119485760435, 0.10479041068497974], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1c21742a-8e0f-4204-8303-edaacab2f3cc", 1, 0, 0.0, 222.0, 222, 222, 222.0, 222.0, 222.0, 222.0, 4.504504504504505, 1.4384501689189189, 2.68774634009009], "isController": false}, {"data": ["addBook", 51, 10, 19.607843137254903, 5193.117647058823, 621, 32716, 1112.0, 28860.600000000006, 31570.199999999997, 32716.0, 0.23493642896627973, 83.62964456507969, 0.8507493277248018], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/0e4f5af4-c109-4f10-8da2-09da2ca7e1fe", 3, 0, 0.0, 368.6666666666667, 204, 483, 419.0, 483.0, 483.0, 483.0, 0.015472531099787511, 0.021330133205598994, 0.009922163498236132], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 239.61111111111117, 121, 781, 128.0, 506.0, 516.5, 781.0, 0.22593196937366636, 0.1679045202083595, 0.10921516097652818], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 784.5925925925925, 581, 1230, 743.5, 992.0, 1073.75, 1230.0, 0.2261060353562845, 66.48268182170283, 0.11371543770360011], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 187.31481481481487, 121, 497, 127.5, 374.5, 380.75, 497.0, 0.22658229972642285, 0.4009444600627717, 0.11019334498413923], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1188.3148148148146, 834, 1819, 1139.5, 1491.0, 1522.5, 1819.0, 0.22576666596985598, 203.14524289514392, 0.11332428350440035], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 1975.5882352941176, 123, 31269, 131.0, 6542.599999999978, 31269.0, 31269.0, 0.08764287076800932, 0.06547538685305385, 0.031154301718315815], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 156, 10, 6.410256410256411, 1869.826923076923, 122, 31193, 133.5, 505.7000000000016, 22177.95000000001, 31192.43, 0.6426179265685439, 1.5003107531399713, 0.30456607584951206], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 181.2, 127, 382, 129.5, 381.7, 382.0, 382.0, 0.04524825454858079, 0.03504088462600055, 0.016084340484065828], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 1845.357142857143, 124, 24163, 128.5, 12150.0, 24163.0, 24163.0, 0.09602063071837148, 0.07792299231149093, 0.034132333575671116], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=357a9ce6-7090-491e-a573-4f1cdfd72530", 1, 0, 0.0, 1167.0, 1167, 1167, 1167.0, 1167.0, 1167.0, 1167.0, 0.8568980291345331, 0.15481067909168808, 0.5907910239931448], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4a6daab1-e5fa-462e-a86c-e6ce57a386a9", 3, 0, 0.0, 951.6666666666666, 223, 1943, 689.0, 1943.0, 1943.0, 1943.0, 0.025112167682314335, 0.025185738486071117, 0.01610383148898413], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 278.8, 246, 505, 254.0, 480.6000000000001, 505.0, 505.0, 0.04548286887743731, 0.07048956338720021, 0.10229203811009584], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 11, 0, 0.0, 638.6363636363636, 247, 1871, 499.0, 1824.8000000000002, 1871.0, 1871.0, 0.07004094211434501, 15.323961991248067, 0.1542654237317814], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9288948e-e982-4d02-991a-a9e6674cdff8", 1, 0, 0.0, 425.0, 425, 425, 425.0, 425.0, 425.0, 425.0, 2.352941176470588, 0.4250919117647059, 1.6222426470588236], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ebb6eaf5-d4b1-40c0-90ea-95825b713b29", 1, 0, 0.0, 956.0, 956, 956, 956.0, 956.0, 956.0, 956.0, 1.0460251046025104, 0.188979144874477, 0.7211852771966527], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=56774f1f-e2e1-4816-8373-436093fd3990", 1, 0, 0.0, 530.0, 530, 530, 530.0, 530.0, 530.0, 530.0, 1.8867924528301887, 0.3408755896226415, 1.3008549528301887], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 7, 0, 0.0, 7971.428571428571, 124, 28735, 362.0, 28735.0, 28735.0, 28735.0, 0.032060823963175854, 0.026581679242906543, 0.011396621018160167], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5b0ec87e-43e8-40e6-b9f0-d1e3be8b549c", 3, 0, 0.0, 359.3333333333333, 212, 536, 330.0, 536.0, 536.0, 536.0, 0.07605912329183885, 0.034414772583221356, 0.04877489351722739], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5415064e-2d00-493c-81fb-fb6957889390", 3, 0, 0.0, 435.33333333333337, 242, 695, 369.0, 695.0, 695.0, 695.0, 0.017145796422243814, 0.020265750914442476, 0.010995188460879008], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ab8b4c52-3be4-4926-968a-b17dc10629b1", 3, 0, 0.0, 311.0, 242, 449, 242.0, 449.0, 449.0, 449.0, 0.030791969454366304, 0.025669997972862013, 0.01974615228681693], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 21, 0, 0.0, 131.42857142857144, 121, 153, 129.0, 147.0, 152.39999999999998, 153.0, 0.09543675951299986, 0.07409396856722156, 0.033924785608136665], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8ca9d6cf-abed-4821-b9b4-8cb1a622c78b", 1, 0, 0.0, 495.0, 495, 495, 495.0, 495.0, 495.0, 495.0, 2.0202020202020203, 0.36497790404040403, 1.392834595959596], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 141.41176470588235, 121, 378, 126.0, 184.39999999999984, 378.0, 378.0, 0.0900958195539727, 0.06695597527399728, 0.0452238781745527], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 239.47058823529412, 122, 376, 130.0, 374.4, 376.0, 376.0, 0.09009677453547163, 0.040028059182981246, 0.05049311422151087], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 300.1764705882353, 121, 1372, 125.0, 1172.7999999999997, 1372.0, 1372.0, 0.09009820704567978, 9.559136140378307, 0.052056971878759614], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 303.47058823529414, 118, 995, 129.0, 782.1999999999998, 995.0, 995.0, 0.08997755853834102, 3.133915055891942, 0.052075132253779056], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 28.0, 0.5695687550854354], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 8.0, 0.16273393002441008], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 8.0, 0.16273393002441008], "isController": false}, {"data": ["401/Unauthorized", 14, 56.0, 1.1391375101708707], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1229, 25, "401/Unauthorized", 14, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 156, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
