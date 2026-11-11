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

    var data = {"OkPercent": 98.98989898989899, "KoPercent": 1.0101010101010102};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7362967914438503, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/7351c90c-d4de-455b-b2c5-4b80592c5b43"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8cba606c-7e71-4cce-88bc-7a2dd576346f"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/7c3f8982-a5c7-4a2f-b833-505351fd2387"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b9441d6a-7b87-4a32-b66f-6b954b80a7c9"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/b921818d-9881-4901-881e-f2dbc271b584"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/5801236c-a307-4d27-a790-ed7e21d55e71"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bd63d831-b91a-4673-bcf1-b2fd515d6847"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/18ee53d1-47c1-4185-b301-1e9e48a2e973"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.38461538461538464, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8e1e5e7f-16a2-4ab3-a043-462bfc1bb6fc"], "isController": false}, {"data": [0.65, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/a735718a-da72-4140-a98f-bf51df0ae7da"], "isController": false}, {"data": [0.025, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c5befedb-18b6-426a-9766-bd4e61d1e08a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fc348477-2c34-4f9c-8844-c597a0057843"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/80f3dc6d-105f-4fe1-aaac-e2c939de762c"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/64dee089-3d3b-4733-8cb1-f2e1e310eb86"], "isController": false}, {"data": [0.675, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.7631578947368421, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.21739130434782608, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b9441d6a-7b87-4a32-b66f-6b954b80a7c9"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.775, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7351c90c-d4de-455b-b2c5-4b80592c5b43"], "isController": false}, {"data": [0.38392857142857145, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/8a20ed3f-59ad-4284-8581-d4c6a4d2e89f"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=90168a5f-9428-42a9-8940-a67f0c6f95e3"], "isController": false}, {"data": [0.21739130434782608, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5801236c-a307-4d27-a790-ed7e21d55e71"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7c3f8982-a5c7-4a2f-b833-505351fd2387"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.4230769230769231, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.15, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.2672413793103448, 500, 1500, "addBook"], "isController": true}, {"data": [0.9017857142857143, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=18ee53d1-47c1-4185-b301-1e9e48a2e973"], "isController": false}, {"data": [0.9821428571428571, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.49107142857142855, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8982558139534884, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8cba606c-7e71-4cce-88bc-7a2dd576346f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=64dee089-3d3b-4733-8cb1-f2e1e310eb86"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/fc348477-2c34-4f9c-8844-c597a0057843"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c5befedb-18b6-426a-9766-bd4e61d1e08a"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8a20ed3f-59ad-4284-8581-d4c6a4d2e89f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b921818d-9881-4901-881e-f2dbc271b584"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/90168a5f-9428-42a9-8940-a67f0c6f95e3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1287, 13, 1.0101010101010102, 458.33022533022506, 124, 7095, 153.0, 1119.2000000000003, 1386.9999999999995, 2701.0799999999826, 5.069064527182711, 710.0827438564179, 3.705216432217509], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1965.1428571428569, 1514, 4787, 1938.5, 2280.7000000000003, 2533.6, 4787.0, 0.24556449137454725, 295.49591796994906, 1.20743868561606], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/7351c90c-d4de-455b-b2c5-4b80592c5b43", 3, 0, 0.0, 499.6666666666667, 248, 673, 578.0, 673.0, 673.0, 673.0, 0.023900192794888545, 0.028249218762448017, 0.015326621030576313], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8cba606c-7e71-4cce-88bc-7a2dd576346f", 3, 0, 0.0, 706.0, 411, 1279, 428.0, 1279.0, 1279.0, 1279.0, 0.03492311095072349, 0.029113960659115513, 0.022395354353165777], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7c3f8982-a5c7-4a2f-b833-505351fd2387", 3, 0, 0.0, 789.6666666666667, 387, 1594, 388.0, 1594.0, 1594.0, 1594.0, 0.07260933756081031, 0.03285383437810102, 0.046562628579035266], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 862.3846153846155, 134, 2076, 725.0, 1923.6, 2076.0, 2076.0, 0.07450454477723141, 0.01411511883474892, 0.05036556478743281], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 862.3846153846155, 134, 2076, 725.0, 1923.6, 2076.0, 2076.0, 0.07428741228370934, 0.014073982405312121, 0.05021878178644083], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b9441d6a-7b87-4a32-b66f-6b954b80a7c9", 1, 0, 0.0, 452.0, 452, 452, 452.0, 452.0, 452.0, 452.0, 2.2123893805309733, 0.3996992533185841, 1.5253387721238938], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b921818d-9881-4901-881e-f2dbc271b584", 3, 0, 0.0, 1213.3333333333333, 331, 1905, 1404.0, 1905.0, 1905.0, 1905.0, 0.02061798988343963, 0.028423563527463166, 0.013221822939575545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 186.00000000000003, 125, 432, 129.0, 402.0, 432.0, 432.0, 0.08739409215937002, 0.023384747316081433, 0.04984194318464072], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 158.31578947368422, 126, 403, 131.0, 378.0, 403.0, 403.0, 0.08739328819546659, 0.06494755109057625, 0.04386733411374007], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 185.57894736842107, 126, 426, 131.0, 390.0, 426.0, 426.0, 0.08739369017556932, 0.023555330555133917, 0.051463276538933886], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 185.2105263157895, 126, 414, 130.0, 400.0, 414.0, 414.0, 0.08739409215937002, 0.0235554389023302, 0.05137816746087964], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5801236c-a307-4d27-a790-ed7e21d55e71", 3, 0, 0.0, 1814.3333333333333, 611, 3042, 1790.0, 3042.0, 3042.0, 3042.0, 0.06909894969596461, 0.031265475285608996, 0.044311500944352315], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 316.15384615384613, 137, 611, 249.0, 537.8, 611.0, 611.0, 0.07450625279398448, 0.17516133469355005, 0.04816153134707305], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/bd63d831-b91a-4673-bcf1-b2fd515d6847", 1, 0, 0.0, 356.0, 356, 356, 356.0, 356.0, 356.0, 356.0, 2.8089887640449436, 0.8970110603932585, 1.6760665379213484], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/18ee53d1-47c1-4185-b301-1e9e48a2e973", 3, 0, 0.0, 387.0, 243, 588, 330.0, 588.0, 588.0, 588.0, 0.014648509025922978, 0.020194152254161397, 0.009393737884462326], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 155.26666666666668, 126, 383, 129.0, 285.20000000000005, 383.0, 383.0, 0.07078276298155872, 0.0526032056923498, 0.035529629074727724], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 164.60000000000002, 126, 402, 128.0, 387.6, 402.0, 402.0, 0.07078409905998716, 0.03311552967741326, 0.03957642205255012], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 766.5, 635, 882, 774.5, 882.0, 882.0, 882.0, 0.03796651353506208, 11.16341558620297, 0.02165277725046509], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1088.25, 877, 1203, 1136.5, 1203.0, 1203.0, 1203.0, 0.03778575477045154, 33.99968856272435, 0.021512788116380126], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 324.0, 126, 408, 381.0, 408.0, 408.0, 408.0, 0.03805718091432377, 0.06734337091479949, 0.02107267732267732], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 151.69230769230768, 126, 392, 130.0, 296.3999999999999, 392.0, 392.0, 0.08142965417452254, 0.060515592604308256, 0.04087386938057089], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 148.92307692307688, 126, 380, 129.0, 283.19999999999993, 380.0, 380.0, 0.08143067430862226, 0.021789067148986815, 0.04644093144163613], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 180.9230769230769, 126, 548, 129.0, 481.19999999999993, 548.0, 548.0, 0.08142965417452254, 0.021947836476726778, 0.04787173028619392], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 148.0, 125, 380, 128.0, 282.79999999999995, 380.0, 380.0, 0.08143169446828236, 0.02194838639965423, 0.04795245289489674], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 197.25, 127, 406, 128.0, 406.0, 406.0, 406.0, 0.038150465435678314, 0.02835205487944453, 0.021422380493667022], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 284.06666666666666, 126, 1134, 128.0, 981.0000000000001, 1134.0, 1134.0, 0.07078376503565142, 8.50871547226928, 0.04080204789229542], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 634.0999999999999, 126, 1136, 634.5, 1134.7, 1135.95, 1136.0, 0.10463808303031889, 47.09086713906402, 0.05701958040128705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 268.0, 126, 887, 130.0, 882.2, 887.0, 887.0, 0.07078376503565142, 2.791571600137792, 0.04087117266283805], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 491.09999999999997, 127, 1041, 507.0, 1009.5000000000002, 1039.85, 1041.0, 0.1047751263849962, 15.417803094795296, 0.057196577782434456], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 1209.230769230769, 138, 3532, 712.0, 3400.4, 3532.0, 3532.0, 0.07449600586799307, 0.014113501111709626, 0.050952984782758184], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 335.3076923076923, 255, 941, 264.0, 768.9999999999998, 941.0, 941.0, 0.08136390947326257, 0.12609816829498796, 0.18298933937199577], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8e1e5e7f-16a2-4ab3-a043-462bfc1bb6fc", 1, 0, 0.0, 355.0, 355, 355, 355.0, 355.0, 355.0, 355.0, 2.8169014084507045, 0.8995378521126761, 1.6807878521126762], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 882.8, 228, 2841, 812.0, 2331.100000000002, 2821.2, 2841.0, 0.08696143695078418, 0.05341674203324536, 0.03931947784005183], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 157.75, 126, 392, 129.5, 358.4000000000005, 391.5, 392.0, 0.10476854010277795, 0.07786021388497462, 0.05258889610627721], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 271.04999999999995, 127, 508, 283.0, 403.9, 502.79999999999995, 508.0, 0.1046249457258094, 0.10656622889845627, 0.05527548402115517], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a735718a-da72-4140-a98f-bf51df0ae7da", 1, 0, 0.0, 517.0, 517, 517, 517.0, 517.0, 517.0, 517.0, 1.9342359767891684, 0.6176710589941973, 1.1541193181818181], "isController": false}, {"data": ["login", 20, 0, 0.0, 3964.55, 1500, 8569, 3670.5, 6035.900000000001, 8444.05, 8569.0, 0.08984806691884024, 21.622551499788855, 0.16535904972192023], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 153.93333333333334, 128, 379, 136.0, 262.00000000000006, 379.0, 379.0, 0.0716318694962847, 0.057991034973066416, 0.02546289111000745], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c5befedb-18b6-426a-9766-bd4e61d1e08a", 1, 0, 0.0, 3532.0, 3532, 3532, 3532.0, 3532.0, 3532.0, 3532.0, 0.28312570781426954, 0.05115064057191393, 0.19520190402038504], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fc348477-2c34-4f9c-8844-c597a0057843", 1, 0, 0.0, 712.0, 712, 712, 712.0, 712.0, 712.0, 712.0, 1.4044943820224718, 0.25374166081460675, 0.9683330407303371], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/80f3dc6d-105f-4fe1-aaac-e2c939de762c", 1, 0, 0.0, 219.0, 219, 219, 219.0, 219.0, 219.0, 219.0, 4.5662100456621, 1.4581549657534247, 2.724564783105023], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/64dee089-3d3b-4733-8cb1-f2e1e310eb86", 3, 0, 0.0, 531.0, 230, 711, 652.0, 711.0, 711.0, 711.0, 0.025037138421992622, 0.025110489413463305, 0.01605571702191584], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 804.6999999999999, 257, 1268, 907.0, 1263.9, 1267.8, 1268.0, 0.10454892366883083, 62.61944510332047, 0.22175806856318414], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 417.89473684210526, 257, 836, 277.0, 757.0, 836.0, 836.0, 0.087340660755083, 0.13536096544757492, 0.1964311930849181], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, 33.333333333333336, 902.0, 126, 1540, 1139.0, 1540.0, 1540.0, 1540.0, 0.05661018228478696, 45.15535514633732, 0.09760280939823376], "isController": false}, {"data": ["register", 23, 5, 21.73913043478261, 1256.913043478261, 191, 2529, 1337.0, 2173.6, 2461.599999999999, 2529.0, 0.09407145340395509, 0.02978077261293687, 0.04244239401623755], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/b9441d6a-7b87-4a32-b66f-6b954b80a7c9", 3, 0, 0.0, 370.0, 249, 454, 407.0, 454.0, 454.0, 454.0, 0.023493664541795228, 0.028181690701990697, 0.015065924201606967], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 461.6, 255, 1261, 276.0, 1109.2, 1261.0, 1261.0, 0.07074003508705741, 11.378972163501443, 0.1566827300583841], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 135.85714285714286, 128, 165, 133.5, 156.5, 165.0, 165.0, 0.07804442957883881, 0.0605911342921649, 0.02774235582685286], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 20, 0, 0.0, 416.65000000000003, 255, 1087, 282.5, 638.8000000000002, 1064.9499999999998, 1087.0, 0.17296549338406986, 10.601002726909106, 0.38679070634783363], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 165.7142857142857, 127, 377, 130.0, 377.0, 377.0, 377.0, 0.07690195001373248, 0.05715076558637736, 0.03860117412798682], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 128.28571428571428, 126, 131, 128.0, 131.0, 131.0, 131.0, 0.0768985707851344, 0.037076096628546946, 0.042933604950070856], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 309.7142857142857, 125, 1139, 131.0, 1139.0, 1139.0, 1139.0, 0.07690110517874013, 9.902873303369367, 0.04426534039724914], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 280.8571428571429, 128, 926, 130.0, 926.0, 926.0, 926.0, 0.07690110517874013, 3.2479773979412476, 0.04434043913277525], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 138.0, 138, 138, 138.0, 138.0, 138.0, 138.0, 7.246376811594203, 2.137115036231884, 4.479449728260869], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7351c90c-d4de-455b-b2c5-4b80592c5b43", 1, 0, 0.0, 574.0, 574, 574, 574.0, 574.0, 574.0, 574.0, 1.7421602787456445, 0.3147457534843206, 1.2011378484320558], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1282.7500000000002, 998, 4235, 1048.0, 1706.5000000000007, 2008.05, 4235.0, 0.25306845501708214, 302.75785303049474, 0.49971134379349613], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8a20ed3f-59ad-4284-8581-d4c6a4d2e89f", 3, 0, 0.0, 1226.3333333333333, 365, 2682, 632.0, 2682.0, 2682.0, 2682.0, 0.022003652606332653, 0.02600757246536258, 0.014110415245597434], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=90168a5f-9428-42a9-8940-a67f0c6f95e3", 1, 0, 0.0, 1552.0, 1552, 1552, 1552.0, 1552.0, 1552.0, 1552.0, 0.6443298969072165, 0.11640725676546392, 0.4442352609536082], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, 21.73913043478261, 1256.913043478261, 191, 2529, 1337.0, 2173.6, 2461.599999999999, 2529.0, 0.09194777366455853, 0.02910846639108986, 0.04148424944631449], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5801236c-a307-4d27-a790-ed7e21d55e71", 1, 0, 0.0, 418.0, 418, 418, 418.0, 418.0, 418.0, 418.0, 2.3923444976076556, 0.4322106758373206, 1.6494093899521531], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 129.33333333333334, 126, 136, 126.5, 136.0, 136.0, 136.0, 0.08135703534963186, 0.021928263434080462, 0.04790848858967579], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 255.33333333333334, 127, 392, 252.0, 392.0, 392.0, 392.0, 0.08135813852579053, 0.02192856077452948, 0.04782968690676357], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 316.85714285714283, 126, 1256, 257.0, 820.0, 1256.0, 1256.0, 0.07635128133811074, 4.9263246350817775, 0.044417528345413196], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 285.07142857142856, 126, 1007, 138.5, 709.5, 1007.0, 1007.0, 0.07645426942484546, 1.624855880288997, 0.04455210426724043], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7c3f8982-a5c7-4a2f-b833-505351fd2387", 1, 0, 0.0, 292.0, 292, 292, 292.0, 292.0, 292.0, 292.0, 3.4246575342465753, 0.6187125428082192, 2.361140839041096], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 149.85714285714286, 126, 388, 129.5, 267.0, 388.0, 388.0, 0.07645426942484546, 0.05681806546123768, 0.038376459457393125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 173.5, 125, 402, 128.0, 402.0, 402.0, 402.0, 0.08135372600065083, 0.0217684774650179, 0.04639704685974618], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 166.50000000000003, 124, 388, 129.0, 385.0, 388.0, 388.0, 0.07645510447043917, 0.028659998006706204, 0.04314465647083238], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 130.5, 126, 140, 129.0, 140.0, 140.0, 140.0, 0.08135262294415142, 0.06045834576220628, 0.04083520331376351], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 859.1538461538462, 126, 1790, 652.0, 1711.6, 1790.0, 1790.0, 0.07583933728086807, 0.01420848160896071, 0.05161541434530234], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 131.66666666666669, 129, 137, 131.0, 137.0, 137.0, 137.0, 0.09786491379732176, 0.07703039113343882, 0.03478791857639172], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 2163.4500000000003, 870, 7095, 1947.0, 3777.100000000001, 6931.399999999998, 7095.0, 0.08719308035714286, 0.04512923104422433, 0.04010541098458426], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 390.3333333333333, 255, 532, 381.5, 532.0, 532.0, 532.0, 0.08120838070488874, 0.12585712908072114, 0.18263955152671757], "isController": false}, {"data": ["addBook", 58, 4, 6.896551724137931, 1581.7413793103449, 659, 5047, 1224.0, 2937.2000000000003, 4045.5999999999995, 5047.0, 0.2973215429962835, 93.09511365820839, 1.082210968537742], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 276.4285714285715, 126, 3026, 134.5, 519.7, 601.6499999999996, 3026.0, 0.2540846374076108, 0.18882657135467948, 0.12282411671559308], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 741.75, 624, 1138, 651.0, 960.8000000000002, 1052.25, 1138.0, 0.2539705575560776, 74.67577653765568, 0.1277293331458789], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=18ee53d1-47c1-4185-b301-1e9e48a2e973", 1, 0, 0.0, 565.0, 565, 565, 565.0, 565.0, 565.0, 565.0, 1.7699115044247788, 0.3197594026548673, 1.2202710176991152], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 179.98214285714283, 125, 519, 131.5, 396.70000000000005, 465.94999999999993, 519.0, 0.2545616539234315, 0.45045480166919716, 0.12380049184948133], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1002.1071428571429, 870, 1520, 909.0, 1208.3, 1279.9499999999998, 1520.0, 0.2536921264836459, 228.27262135317568, 0.12734155567636132], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 20, 0, 0.0, 146.85, 127, 376, 134.0, 147.60000000000002, 364.59999999999985, 376.0, 0.16391695966823208, 0.12245749428339603, 0.05826735675706687], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 4, 2.3255813953488373, 327.52906976744185, 127, 3529, 140.0, 593.9000000000004, 1244.2999999999997, 3338.4700000000025, 0.7631758765429908, 1.6117869976683203, 0.36744044760043304], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 171.42857142857144, 130, 378, 133.0, 378.0, 378.0, 378.0, 0.07437709185570844, 0.05759866586091484, 0.026438731870583862], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8cba606c-7e71-4cce-88bc-7a2dd576346f", 1, 0, 0.0, 3203.0, 3203, 3203, 3203.0, 3203.0, 3203.0, 3203.0, 0.3122073056509522, 0.05640464018108024, 0.2152523025288792], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 134.6315789473684, 128, 147, 132.0, 147.0, 147.0, 147.0, 0.08843502585560888, 0.07176709617774508, 0.03143588809711097], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 479.14285714285705, 259, 1270, 263.0, 1270.0, 1270.0, 1270.0, 0.07679059205546473, 13.226043906392269, 0.16989704232807135], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 526.4285714285714, 257, 1383, 512.5, 1080.0, 1383.0, 1383.0, 0.07629677264651706, 6.629617955832344, 0.17019885527592182], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=64dee089-3d3b-4733-8cb1-f2e1e310eb86", 1, 0, 0.0, 1675.0, 1675, 1675, 1675.0, 1675.0, 1675.0, 1675.0, 0.5970149253731344, 0.10785914179104478, 0.41161380597014924], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fc348477-2c34-4f9c-8844-c597a0057843", 3, 0, 0.0, 477.0, 231, 609, 591.0, 609.0, 609.0, 609.0, 0.02258253918070548, 0.027088755495084535, 0.014481641336585218], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c5befedb-18b6-426a-9766-bd4e61d1e08a", 3, 0, 0.0, 459.66666666666663, 226, 831, 322.0, 831.0, 831.0, 831.0, 0.028571700682863646, 0.028655406837207974, 0.018322347117591595], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8a20ed3f-59ad-4284-8581-d4c6a4d2e89f", 1, 0, 0.0, 1589.0, 1589, 1589, 1589.0, 1589.0, 1589.0, 1589.0, 0.6293266205160478, 0.11369670390182506, 0.4338912051604783], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 152.46153846153845, 129, 380, 131.0, 285.5999999999999, 380.0, 380.0, 0.08399289290906153, 0.06963863874979809, 0.02985684865126797], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b921818d-9881-4901-881e-f2dbc271b584", 1, 0, 0.0, 1018.0, 1018, 1018, 1018.0, 1018.0, 1018.0, 1018.0, 0.9823182711198427, 0.17746960952848723, 0.6772624017681729], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 161.3, 128, 396, 134.5, 284.4000000000001, 390.5999999999999, 396.0, 0.10060716423616525, 0.0781081011403822, 0.03576270291207437], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/90168a5f-9428-42a9-8940-a67f0c6f95e3", 3, 0, 0.0, 454.6666666666667, 403, 537, 424.0, 537.0, 537.0, 537.0, 0.038986354775828465, 0.0325013198505523, 0.02500101526965562], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 20, 0, 0.0, 134.3, 127, 144, 134.0, 142.9, 143.95, 144.0, 0.17353428603656368, 0.12896444499396967, 0.087106077170697], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 20, 0, 0.0, 208.10000000000002, 127, 430, 131.0, 388.90000000000003, 428.0, 430.0, 0.17353278034220665, 0.059465481076250305, 0.0982392116839621], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 20, 0, 0.0, 221.64999999999998, 125, 933, 130.5, 391.7, 905.9499999999996, 933.0, 0.1735448266287182, 7.852233969338967, 0.10127967616535351], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 20, 0, 0.0, 228.1, 125, 950, 133.0, 492.5000000000003, 927.7499999999997, 950.0, 0.17316617025697859, 2.5901701952881484, 0.10122780226155019], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 38.46153846153846, 0.3885003885003885], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 7.6923076923076925, 0.0777000777000777], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 7.6923076923076925, 0.0777000777000777], "isController": false}, {"data": ["401/Unauthorized", 6, 46.15384615384615, 0.4662004662004662], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1287, 13, "401/Unauthorized", 6, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
