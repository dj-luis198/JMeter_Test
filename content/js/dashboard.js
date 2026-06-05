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

    var data = {"OkPercent": 98.68827160493827, "KoPercent": 1.3117283950617284};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8252652519893899, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/12dc2f19-3915-4ea3-8269-e4309886d3e8"], "isController": false}, {"data": [0.36363636363636365, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b728c189-ab94-4d2d-8635-7b8c82aee8cc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7f45d2d6-3fff-477c-9ac2-51a7ab9164b2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f800fee0-260e-4a78-b176-ddb274bd33aa"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/1e68713e-ab92-48bf-9772-a73403267d72"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=800e8052-6793-479d-87ed-8f7e563e2390"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b8ee08f0-5d7a-499e-b377-674069610ddb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5e46d16e-a9db-47a0-b94d-177337566326"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=27e2cc91-e0ca-4a4f-8fb8-bcce5ad8c8ad"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/27e2cc91-e0ca-4a4f-8fb8-bcce5ad8c8ad"], "isController": false}, {"data": [0.775, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/dc3cd27f-8e96-41f3-8a4a-ed43285d9e85"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/800e8052-6793-479d-87ed-8f7e563e2390"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e7f5ba91-ece2-422d-8c2f-23957e3f125f"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/66e3dc6a-2113-465c-97ba-b51b0e9f7ede"], "isController": false}, {"data": [0.8611111111111112, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a9a46e89-9c4c-4515-872b-6b81eac931ac"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f800fee0-260e-4a78-b176-ddb274bd33aa"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=12dc2f19-3915-4ea3-8269-e4309886d3e8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/df1274c6-47e5-4ae4-9a39-bcde27a56f58"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.4098360655737705, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/674c78af-48f1-4c14-8acc-9319e49a676f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8545454545454545, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5e46d16e-a9db-47a0-b94d-177337566326"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9519774011299436, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b8ee08f0-5d7a-499e-b377-674069610ddb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dc3cd27f-8e96-41f3-8a4a-ed43285d9e85"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/e7f5ba91-ece2-422d-8c2f-23957e3f125f"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=66e3dc6a-2113-465c-97ba-b51b0e9f7ede"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a9a46e89-9c4c-4515-872b-6b81eac931ac"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1e68713e-ab92-48bf-9772-a73403267d72"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2dc1761f-826d-446e-97d9-44584966e601"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1ceeff59-1575-4270-9def-c13e414bcb0f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b728c189-ab94-4d2d-8635-7b8c82aee8cc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1296, 17, 1.3117283950617284, 300.42901234567864, 81, 2766, 95.0, 830.8999999999999, 1037.2999999999997, 1473.3899999999996, 5.1334254920523, 685.6882014022847, 3.750557321765962], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/12dc2f19-3915-4ea3-8269-e4309886d3e8", 3, 0, 0.0, 1132.0, 175, 2766, 455.0, 2766.0, 2766.0, 2766.0, 0.03382644777196464, 0.028199717690104636, 0.02169209053084972], "isController": false}, {"data": ["see books", 55, 0, 0.0, 1380.2181818181818, 1003, 1823, 1352.0, 1680.2, 1735.5999999999997, 1823.0, 0.24373490505417564, 293.2954508472558, 1.1984426239724357], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/b728c189-ab94-4d2d-8635-7b8c82aee8cc", 3, 0, 0.0, 387.3333333333333, 234, 489, 439.0, 489.0, 489.0, 489.0, 0.05138922196717942, 0.042723982065161537, 0.03295467684744253], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7f45d2d6-3fff-477c-9ac2-51a7ab9164b2", 1, 0, 0.0, 219.0, 219, 219, 219.0, 219.0, 219.0, 219.0, 4.5662100456621, 1.4581549657534247, 2.724564783105023], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f800fee0-260e-4a78-b176-ddb274bd33aa", 1, 0, 0.0, 397.0, 397, 397, 397.0, 397.0, 397.0, 397.0, 2.5188916876574305, 0.45507320528967254, 1.7366577455919394], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1e68713e-ab92-48bf-9772-a73403267d72", 3, 0, 0.0, 563.6666666666666, 185, 963, 543.0, 963.0, 963.0, 963.0, 0.01607424156370222, 0.022159639655689747, 0.01030802600276477], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 483.85714285714283, 88, 1137, 452.0, 1023.5, 1137.0, 1137.0, 0.09015855025051198, 0.017760026918767144, 0.06066332140879174], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 483.85714285714283, 88, 1137, 452.0, 1023.5, 1137.0, 1137.0, 0.09056330374932077, 0.017839757937226693, 0.06093566043289259], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 143.99999999999997, 82, 336, 84.5, 265.8000000000001, 336.0, 336.0, 0.10061599347113998, 0.043713806191237464, 0.0564436508513231], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 113.72222222222223, 82, 256, 85.5, 254.2, 256.0, 256.0, 0.10061486864169927, 0.07477335452766909, 0.050503947736165455], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 184.66666666666669, 82, 656, 86.5, 504.80000000000024, 656.0, 656.0, 0.1006165558952917, 3.3112847406608275, 0.05828903992241346], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 202.61111111111114, 82, 910, 84.0, 897.4, 910.0, 910.0, 0.10061599347113998, 10.083489002811659, 0.058190456293530396], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=800e8052-6793-479d-87ed-8f7e563e2390", 1, 0, 0.0, 387.0, 387, 387, 387.0, 387.0, 387.0, 387.0, 2.5839793281653747, 0.46683220284237725, 1.781532622739018], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 212.57142857142858, 84, 489, 192.0, 436.5, 489.0, 489.0, 0.08950605444525427, 0.19691207109018377, 0.057851778772999865], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 87.0, 82, 114, 84.0, 105.0, 114.0, 114.0, 0.11578630479586874, 0.08604822065396105, 0.0581192975244888], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 94.53333333333333, 81, 248, 84.0, 151.40000000000006, 248.0, 248.0, 0.11578898615163727, 0.030982599810106065, 0.06603590616460563], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 600.0, 492, 659, 649.0, 659.0, 659.0, 659.0, 0.027188689505165852, 7.9943774639749865, 0.0155060494834149], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 937.0, 884, 981, 946.0, 981.0, 981.0, 981.0, 0.027076789775804178, 24.36374303618813, 0.015415789491497887], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 139.66666666666666, 84, 251, 84.0, 251.0, 251.0, 251.0, 0.027289100733167173, 0.048288916531737225, 0.015110273550493934], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b8ee08f0-5d7a-499e-b377-674069610ddb", 1, 0, 0.0, 830.0, 830, 830, 830.0, 830.0, 830.0, 830.0, 1.2048192771084338, 0.2176675451807229, 0.8306664156626506], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5e46d16e-a9db-47a0-b94d-177337566326", 3, 0, 0.0, 329.3333333333333, 196, 485, 307.0, 485.0, 485.0, 485.0, 0.022333725414290604, 0.026397707350029036, 0.014322083029346516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 86.21428571428572, 84, 103, 85.0, 95.5, 103.0, 103.0, 0.08209554748934224, 0.06101046058534126, 0.041208116610861246], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 119.64285714285715, 81, 256, 84.5, 254.0, 256.0, 256.0, 0.08202772537117546, 0.039549081875388165, 0.04579728751889567], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 278.5714285714286, 81, 985, 244.5, 945.0, 985.0, 985.0, 0.08202724476343928, 10.562987494507103, 0.04721601728431229], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 201.57142857142856, 82, 663, 87.5, 574.0, 663.0, 663.0, 0.08210565825279159, 3.4677957049943697, 0.04734133448085765], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 223.33333333333331, 91, 328, 251.0, 328.0, 328.0, 328.0, 0.02722866633992267, 0.020235366293633938, 0.015289534321733921], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 540.9444444444443, 83, 1055, 770.5, 984.8000000000001, 1055.0, 1055.0, 0.08309788931361144, 41.549747142932986, 0.04488512293871069], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 94.60000000000001, 81, 251, 84.0, 151.40000000000006, 251.0, 251.0, 0.11578809235258246, 0.031208509266906992, 0.06807073398071742], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 373.05555555555554, 84, 661, 449.0, 656.5, 661.0, 661.0, 0.08309788931361144, 13.584142527883959, 0.04496627322124352], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 84.33333333333333, 82, 86, 84.0, 86.0, 86.0, 86.0, 0.11578630479586874, 0.031208027464511495, 0.06818275565616098], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 450.8461538461539, 94, 830, 418.0, 774.0, 830.0, 830.0, 0.08880448667591144, 0.016824287514772284, 0.060739547114195734], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 390.4285714285714, 169, 1069, 334.5, 1029.0, 1069.0, 1069.0, 0.08197729229003566, 14.119376321151899, 0.181372471878861], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=27e2cc91-e0ca-4a4f-8fb8-bcce5ad8c8ad", 1, 0, 0.0, 690.0, 690, 690, 690.0, 690.0, 690.0, 690.0, 1.4492753623188406, 0.26183197463768115, 0.9992074275362319], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/27e2cc91-e0ca-4a4f-8fb8-bcce5ad8c8ad", 3, 0, 0.0, 337.3333333333333, 189, 577, 246.0, 577.0, 577.0, 577.0, 0.018800997706278282, 0.02222214279671108, 0.012056629388466215], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 520.0, 116, 1354, 433.0, 962.8, 1334.4499999999998, 1354.0, 0.08547191179298703, 0.052501789568153164, 0.03864599136733691], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 85.72222222222223, 82, 93, 85.0, 88.5, 93.0, 93.0, 0.08309673845301571, 0.06175450972924312, 0.0417106675437989], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 163.16666666666666, 83, 334, 87.0, 262.9000000000001, 334.0, 334.0, 0.08309788931361144, 0.09157358548926191, 0.04351458483371189], "isController": false}, {"data": ["login", 20, 0, 0.0, 2477.9000000000005, 1563, 4200, 2314.5, 3559.6000000000004, 4169.299999999999, 4200.0, 0.0841467519353753, 15.218396156334146, 0.1478895600176708], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/dc3cd27f-8e96-41f3-8a4a-ed43285d9e85", 3, 0, 0.0, 392.0, 198, 763, 215.0, 763.0, 763.0, 763.0, 0.03517947394959954, 0.028594774235725928, 0.02255975380231481], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 99.26666666666667, 85, 254, 87.0, 159.80000000000007, 254.0, 254.0, 0.11279976537648802, 0.09131934130577007, 0.04009679159867347], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/800e8052-6793-479d-87ed-8f7e563e2390", 3, 0, 0.0, 516.6666666666667, 185, 1170, 195.0, 1170.0, 1170.0, 1170.0, 0.04810236182596565, 0.030925183791107477, 0.03084689218657303], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e7f5ba91-ece2-422d-8c2f-23957e3f125f", 1, 0, 0.0, 415.0, 415, 415, 415.0, 415.0, 415.0, 415.0, 2.4096385542168677, 0.4353350903614458, 1.6613328313253013], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 628.0555555555555, 170, 1140, 857.5, 1068.0, 1140.0, 1140.0, 0.08306414397784956, 55.2647669589294, 0.17500612886479003], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/66e3dc6a-2113-465c-97ba-b51b0e9f7ede", 3, 0, 0.0, 387.6666666666667, 238, 541, 384.0, 541.0, 541.0, 541.0, 0.018164974296561373, 0.025041883511047334, 0.01164876281387562], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 377.88888888888886, 167, 1003, 334.5, 983.2, 1003.0, 1003.0, 0.10056652475612618, 13.5065993289978, 0.2233174836300046], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 3, 50.0, 622.5, 84, 1232, 561.5, 1232.0, 1232.0, 1232.0, 0.04918758505353249, 29.429306808586514, 0.07161180799216278], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a9a46e89-9c4c-4515-872b-6b81eac931ac", 3, 0, 0.0, 291.0, 199, 408, 266.0, 408.0, 408.0, 408.0, 0.046215704096251906, 0.029712244658234868, 0.029637023785682375], "isController": false}, {"data": ["register", 22, 4, 18.181818181818183, 1130.181818181818, 122, 2192, 1034.0, 1867.9999999999998, 2161.3999999999996, 2192.0, 0.08568479679071489, 0.027232916593639852, 0.03865857042706082], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 121.6, 85, 261, 90.0, 256.2, 261.0, 261.0, 0.08172605426610004, 0.06344942689604446, 0.029051058352402747], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 194.86666666666665, 166, 348, 170.0, 340.8, 348.0, 348.0, 0.11570949203532996, 0.17932711314459832, 0.2602333595286767], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f800fee0-260e-4a78-b176-ddb274bd33aa", 3, 0, 0.0, 318.0, 180, 497, 277.0, 497.0, 497.0, 497.0, 0.0493932858060161, 0.03175512352437559, 0.031674730806592354], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 260.9333333333333, 170, 502, 191.0, 404.80000000000007, 502.0, 502.0, 0.12051580765677097, 0.18677596362431206, 0.27104287600931987], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 104.1, 83, 253, 87.0, 237.60000000000005, 253.0, 253.0, 0.04974753127876029, 0.03697057744446932, 0.024970928786408976], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 84.9, 81, 94, 84.0, 93.2, 94.0, 94.0, 0.0497482737349014, 0.013311549807971664, 0.028372062364435954], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 117.39999999999998, 83, 252, 84.5, 251.6, 252.0, 252.0, 0.04974802624705865, 0.013408647699402526, 0.02924639824289971], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 116.80000000000001, 83, 248, 84.5, 247.8, 248.0, 248.0, 0.0497482737349014, 0.013408714405110142, 0.02929512603725151], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 94.0, 94, 94, 94.0, 94.0, 94.0, 94.0, 10.638297872340425, 3.137466755319149, 6.576213430851064], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 946.2727272727274, 655, 1471, 906.0, 1319.0, 1383.1999999999998, 1471.0, 0.258762644083745, 309.57008277464126, 0.5109551429075512], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 4, 18.181818181818183, 1130.181818181818, 122, 2192, 1034.0, 1867.9999999999998, 2161.3999999999996, 2192.0, 0.08719259655589244, 0.027712135624120643, 0.039338847274240536], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 11, 0, 0.0, 114.0909090909091, 82, 249, 84.0, 248.8, 249.0, 249.0, 0.0637566582237395, 0.017184411786867287, 0.03754420401261222], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 11, 0, 0.0, 99.0, 81, 252, 84.0, 218.80000000000013, 252.0, 252.0, 0.06375702776328754, 0.017184511389323597, 0.03748215889990147], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=12dc2f19-3915-4ea3-8269-e4309886d3e8", 1, 0, 0.0, 377.0, 377, 377, 377.0, 377.0, 377.0, 377.0, 2.6525198938992043, 0.4792150198938992, 1.8287881299734747], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 95.39999999999999, 84, 247, 84.0, 150.40000000000006, 247.0, 247.0, 0.07803558422640723, 0.021033028561023827, 0.04587638838310269], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 95.0, 82, 246, 84.0, 150.00000000000006, 246.0, 246.0, 0.07796987244128868, 0.02101531718144109, 0.045913899494235424], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 85.39999999999999, 83, 89, 85.0, 88.4, 89.0, 89.0, 0.07803517825835887, 0.05799294009239365, 0.03917000158671529], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 11, 0, 0.0, 99.0, 82, 254, 83.0, 220.20000000000013, 254.0, 254.0, 0.06375702776328754, 0.017059985944473426, 0.03636142989624993], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 84.13333333333333, 82, 87, 84.0, 86.4, 87.0, 87.0, 0.07803517825835887, 0.020880506682412432, 0.04450443760047029], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 11, 0, 0.0, 118.72727272727272, 82, 293, 85.0, 284.0, 293.0, 293.0, 0.0637566582237395, 0.047381657136978284, 0.03200285383496299], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 11, 0, 0.0, 121.45454545454547, 85, 277, 89.0, 274.0, 277.0, 277.0, 0.06784846354070291, 0.05340416173223295, 0.024118008524234236], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 545.9230769230769, 84, 1170, 497.0, 1007.1999999999998, 1170.0, 1170.0, 0.08855344541020681, 0.016590466710716328, 0.06026849574943462], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/df1274c6-47e5-4ae4-9a39-bcde27a56f58", 1, 0, 0.0, 227.0, 227, 227, 227.0, 227.0, 227.0, 227.0, 4.405286343612335, 1.406766244493392, 2.6285448788546253], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1396.6999999999998, 1016, 2348, 1247.5, 1951.7, 2328.45, 2348.0, 0.0845698144961119, 0.04377148601849542, 0.03889881115983272], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 11, 0, 0.0, 234.63636363636363, 167, 547, 171.0, 537.6, 547.0, 547.0, 0.06372489384012003, 0.09876113918385791, 0.14331877979862934], "isController": false}, {"data": ["addBook", 61, 7, 11.475409836065573, 864.5573770491804, 429, 2675, 710.0, 1475.6000000000001, 1554.5, 2675.0, 0.2744323524251272, 76.34459463164205, 1.000937350974235], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/674c78af-48f1-4c14-8acc-9319e49a676f", 1, 0, 0.0, 235.0, 235, 235, 235.0, 235.0, 235.0, 235.0, 4.25531914893617, 1.3588763297872342, 2.5390625], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 141.87272727272725, 84, 348, 87.0, 343.2, 346.2, 348.0, 0.2595747693324209, 0.19290664009958233, 0.12547803790971518], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 513.6727272727273, 402, 766, 493.0, 668.8, 743.8, 766.0, 0.2594437525944375, 76.2850776061125, 0.1304819654161478], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5e46d16e-a9db-47a0-b94d-177337566326", 1, 0, 0.0, 367.0, 367, 367, 367.0, 367.0, 367.0, 367.0, 2.7247956403269753, 0.49227264986376024, 1.8786188692098094], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 158.38181818181812, 82, 382, 88.0, 257.8, 334.2, 382.0, 0.2599428125812321, 0.4599769300753834, 0.12641750064985702], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 801.9272727272726, 568, 1102, 777.0, 1043.0, 1087.2, 1102.0, 0.2592322013527208, 233.2575904587821, 0.13012241356962742], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 89.53333333333336, 85, 109, 87.0, 102.4, 109.0, 109.0, 0.12343139271754781, 0.09221192912980868, 0.04387600288006583], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 7, 3.9548022598870056, 150.316384180791, 83, 2164, 90.0, 257.2000000000003, 326.79999999999995, 992.4399999999982, 0.7594089481542502, 1.5255845665684156, 0.36802306436527144], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 111.5, 86, 260, 90.0, 245.30000000000004, 260.0, 260.0, 0.0515886731909142, 0.03995099398476071, 0.01833816117333278], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 90.2777777777778, 84, 107, 88.0, 106.1, 107.0, 107.0, 0.10005002501250626, 0.08119294022011006, 0.03556465732866433], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b8ee08f0-5d7a-499e-b377-674069610ddb", 3, 0, 0.0, 269.3333333333333, 181, 439, 188.0, 439.0, 439.0, 439.0, 0.015282886224006358, 0.02106869243446189, 0.009800548782972826], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dc3cd27f-8e96-41f3-8a4a-ed43285d9e85", 1, 0, 0.0, 419.0, 419, 419, 419.0, 419.0, 419.0, 419.0, 2.3866348448687353, 0.431179146778043, 1.6454728520286397], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e7f5ba91-ece2-422d-8c2f-23957e3f125f", 3, 0, 0.0, 479.6666666666667, 211, 696, 532.0, 696.0, 696.0, 696.0, 0.021944101059900082, 0.025937184553547262, 0.014072226265626027], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 239.3, 169, 502, 174.0, 486.9000000000001, 502.0, 502.0, 0.04972650422675286, 0.07706636934361015, 0.11183607347091], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 192.73333333333335, 168, 333, 172.0, 331.8, 333.0, 333.0, 0.07793503335619428, 0.12078408001589876, 0.1752777166204252], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=66e3dc6a-2113-465c-97ba-b51b0e9f7ede", 1, 0, 0.0, 418.0, 418, 418, 418.0, 418.0, 418.0, 418.0, 2.3923444976076556, 0.4322106758373206, 1.6494093899521531], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a9a46e89-9c4c-4515-872b-6b81eac931ac", 1, 0, 0.0, 480.0, 480, 480, 480.0, 480.0, 480.0, 480.0, 2.0833333333333335, 0.3763834635416667, 1.4363606770833335], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1e68713e-ab92-48bf-9772-a73403267d72", 1, 0, 0.0, 418.0, 418, 418, 418.0, 418.0, 418.0, 418.0, 2.3923444976076556, 0.4322106758373206, 1.6494093899521531], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 89.85714285714286, 86, 100, 88.5, 99.0, 100.0, 100.0, 0.08191493718879637, 0.06791580241532044, 0.029118200328829964], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 96.33333333333333, 84, 263, 86.5, 108.20000000000024, 263.0, 263.0, 0.08269512604115462, 0.06420178242452922, 0.029395533084941677], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2dc1761f-826d-446e-97d9-44584966e601", 1, 0, 0.0, 197.0, 197, 197, 197.0, 197.0, 197.0, 197.0, 5.076142131979695, 1.6209946065989846, 3.0288309010152283], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1ceeff59-1575-4270-9def-c13e414bcb0f", 1, 0, 0.0, 472.0, 472, 472, 472.0, 472.0, 472.0, 472.0, 2.1186440677966103, 0.6765591896186441, 1.2641518802966103], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b728c189-ab94-4d2d-8635-7b8c82aee8cc", 1, 0, 0.0, 569.0, 569, 569, 569.0, 569.0, 569.0, 569.0, 1.757469244288225, 0.3175115333919157, 1.2116926625659052], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 97.60000000000001, 83, 249, 85.0, 162.00000000000006, 249.0, 249.0, 0.12076030689219325, 0.08974472025874909, 0.06061601342049544], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 117.46666666666667, 82, 252, 85.0, 251.4, 252.0, 252.0, 0.12059913651018259, 0.0322696908240137, 0.0687791950409635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 117.26666666666665, 83, 250, 85.0, 249.4, 250.0, 250.0, 0.12076030689219325, 0.032548676467036464, 0.0709938522940433], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 139.73333333333332, 83, 256, 85.0, 253.6, 256.0, 256.0, 0.12076030689219325, 0.032548676467036464, 0.07111178228124271], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 23.529411764705884, 0.30864197530864196], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 11.764705882352942, 0.15432098765432098], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.882352941176471, 0.07716049382716049], "isController": false}, {"data": ["401/Unauthorized", 10, 58.8235294117647, 0.7716049382716049], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1296, 17, "401/Unauthorized", 10, "406/Not Acceptable", 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 3, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
