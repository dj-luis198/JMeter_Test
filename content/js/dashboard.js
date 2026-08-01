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

    var data = {"OkPercent": 98.60896445131375, "KoPercent": 1.3910355486862442};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7681545636242505, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.03773584905660377, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/bd51111f-844b-481b-82b2-6d62265b2190"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=37a0ad3c-dd2b-45d7-8971-9f5d668b2be3"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5769230769230769, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e5ff34d3-59e7-495b-a518-630fed7a5f12"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/aa096e4e-126b-44d7-a41e-6a3cbd549d34"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ab65adf6-1cf0-4d9b-b94b-1b7f42341cfe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/73213ae1-86de-4c0c-92bc-05deca99d6c1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=20f3bbd0-2593-4b61-81d8-d7d2ef344235"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d62e04dd-af86-4db5-aaa0-d1090b31a6bc"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=df3e7a67-bc71-4d26-ae68-62950cac5f9f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=22a783fc-3ee2-418e-8f48-2434286afe7d"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/597c7425-ffb2-4486-b0eb-2a1c5d8c8519"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.675, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d62e04dd-af86-4db5-aaa0-d1090b31a6bc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c36a4393-ca8c-492a-86d9-93bd1d4d3727"], "isController": false}, {"data": [0.4642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/98615ace-38b3-4b1c-8677-1b00816079be"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.23809523809523808, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/37a0ad3c-dd2b-45d7-8971-9f5d668b2be3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/ab65adf6-1cf0-4d9b-b94b-1b7f42341cfe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/20f3bbd0-2593-4b61-81d8-d7d2ef344235"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.33962264150943394, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.23809523809523808, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=98e94614-4d6a-4010-b7e2-ac95240bb592"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5909090909090909, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3f63a905-6276-4fe5-a9a7-2c367c82671f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fc85e941-7323-4388-aac6-ddbc8d9b952b"], "isController": false}, {"data": [0.2890625, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=73213ae1-86de-4c0c-92bc-05deca99d6c1"], "isController": false}, {"data": [0.9716981132075472, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.46226415094339623, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9116022099447514, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/22a783fc-3ee2-418e-8f48-2434286afe7d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/df3e7a67-bc71-4d26-ae68-62950cac5f9f"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/3f63a905-6276-4fe5-a9a7-2c367c82671f"], "isController": false}, {"data": [0.85, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=aa096e4e-126b-44d7-a41e-6a3cbd549d34"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c36a4393-ca8c-492a-86d9-93bd1d4d3727"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/98e94614-4d6a-4010-b7e2-ac95240bb592"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=98615ace-38b3-4b1c-8677-1b00816079be"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1294, 18, 1.3910355486862442, 420.24806800618245, 114, 3777, 134.0, 1176.0, 1422.75, 2137.0499999999993, 5.086298047631963, 671.0352934398941, 3.7204947299427302], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 53, 0, 0.0, 1984.6792452830186, 1435, 2740, 1924.0, 2502.4, 2712.7999999999997, 2740.0, 0.22633613050626694, 272.3595591650119, 1.112892985448295], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/bd51111f-844b-481b-82b2-6d62265b2190", 1, 0, 0.0, 513.0, 513, 513, 513.0, 513.0, 513.0, 513.0, 1.949317738791423, 0.6224872076023392, 1.1631182992202729], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=37a0ad3c-dd2b-45d7-8971-9f5d668b2be3", 1, 0, 0.0, 477.0, 477, 477, 477.0, 477.0, 477.0, 477.0, 2.0964360587002098, 0.3787506551362684, 1.445394392033543], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 540.7692307692307, 122, 824, 513.0, 816.4, 824.0, 824.0, 0.0652872639614303, 0.012368876180192848, 0.04413462202440739], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 540.7692307692307, 122, 824, 513.0, 816.4, 824.0, 824.0, 0.06599018269128269, 0.012502046330184417, 0.04460979973248595], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 167.14999999999998, 115, 361, 120.0, 356.7, 360.8, 361.0, 0.09326226748550936, 0.031958720371743396, 0.0527970082630369], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 121.0, 117, 128, 120.5, 126.0, 127.9, 128.0, 0.09326052794784871, 0.06930787282061804, 0.0468124134425725], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 226.0, 117, 708, 121.5, 464.90000000000026, 696.4499999999998, 708.0, 0.09316148145387808, 1.3934828740084124, 0.05445943632645646], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 226.1, 116, 1289, 120.5, 364.1, 1242.7999999999993, 1289.0, 0.09326313727867493, 4.21979720659417, 0.05442778402122669], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e5ff34d3-59e7-495b-a518-630fed7a5f12", 1, 0, 0.0, 318.0, 318, 318, 318.0, 318.0, 318.0, 318.0, 3.1446540880503147, 1.0042010613207546, 1.876351218553459], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 378.69230769230774, 119, 1259, 241.0, 972.1999999999998, 1259.0, 1259.0, 0.06468144388884743, 0.15451732249919148, 0.04181068394407542], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/aa096e4e-126b-44d7-a41e-6a3cbd549d34", 3, 0, 0.0, 421.3333333333333, 240, 567, 457.0, 567.0, 567.0, 567.0, 0.038482259678288305, 0.02474038504707663, 0.0246777511608815], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 123.22222222222221, 119, 134, 122.0, 132.2, 134.0, 134.0, 0.09731886526203104, 0.07232388326602111, 0.04884950853973043], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ab65adf6-1cf0-4d9b-b94b-1b7f42341cfe", 1, 0, 0.0, 1089.0, 1089, 1089, 1089.0, 1089.0, 1089.0, 1089.0, 0.9182736455463728, 0.16589904729109275, 0.633106634527089], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 146.8888888888889, 118, 362, 120.5, 354.8, 362.0, 362.0, 0.09719799772124695, 0.03411843778518163, 0.054979726792628074], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/73213ae1-86de-4c0c-92bc-05deca99d6c1", 3, 0, 0.0, 434.3333333333333, 394, 479, 430.0, 479.0, 479.0, 479.0, 0.10278548668927948, 0.046507756021516425, 0.065913870044883], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 818.5, 589, 942, 871.5, 942.0, 942.0, 942.0, 0.03247913215758875, 9.549943263016011, 0.018523255058624833], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=20f3bbd0-2593-4b61-81d8-d7d2ef344235", 1, 0, 0.0, 657.0, 657, 657, 657.0, 657.0, 657.0, 657.0, 1.5220700152207, 0.2749833523592085, 1.0493959284627092], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d62e04dd-af86-4db5-aaa0-d1090b31a6bc", 1, 0, 0.0, 420.0, 420, 420, 420.0, 420.0, 420.0, 420.0, 2.3809523809523814, 0.43015252976190477, 1.6415550595238095], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1314.25, 1182, 1439, 1318.0, 1439.0, 1439.0, 1439.0, 0.032348588388474195, 29.10731669470211, 0.018417213896953572], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 236.5, 116, 358, 236.0, 358.0, 358.0, 358.0, 0.032698171354766985, 0.057860436030115016, 0.01810533511538367], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 139.78571428571428, 118, 360, 122.5, 246.5, 360.0, 360.0, 0.0831586012723266, 0.0618004839533599, 0.04174171977927331], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 171.78571428571428, 116, 356, 122.0, 354.0, 356.0, 356.0, 0.0831595891916294, 0.02225168695166646, 0.047426953210851136], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=df3e7a67-bc71-4d26-ae68-62950cac5f9f", 1, 0, 0.0, 1001.0, 1001, 1001, 1001.0, 1001.0, 1001.0, 1001.0, 0.999000999000999, 0.18048357892107894, 0.6887643606393608], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 203.14285714285714, 115, 357, 120.0, 355.5, 357.0, 357.0, 0.08316008316008316, 0.022414241164241164, 0.048889033264033266], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 169.5, 118, 351, 120.0, 350.0, 351.0, 351.0, 0.08316008316008316, 0.022414241164241164, 0.04897024428274428], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 119.5, 116, 122, 120.0, 122.0, 122.0, 122.0, 0.032697102219315814, 0.024299311317284508, 0.018360189234479095], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=22a783fc-3ee2-418e-8f48-2434286afe7d", 1, 0, 0.0, 757.0, 757, 757, 757.0, 757.0, 757.0, 757.0, 1.321003963011889, 0.2386579425363276, 0.9107703104359313], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 200.61111111111111, 115, 1099, 120.0, 436.60000000000105, 1099.0, 1099.0, 0.09732096996566733, 4.889750420710443, 0.056749445811143245], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 1030.4999999999998, 117, 1652, 1290.0, 1648.0, 1652.0, 1652.0, 0.1516842367574244, 97.50149737396666, 0.0798627663954408], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 206.44444444444443, 115, 941, 121.5, 417.20000000000084, 941.0, 941.0, 0.0973193914294056, 1.6145029378291287, 0.05684356380908098], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 722.0000000000001, 114, 1180, 942.5, 1177.0, 1180.0, 1180.0, 0.15168094995612086, 31.86827762218442, 0.08000916180023618], "isController": false}, {"data": ["deleteBooks", 12, 0, 0.0, 630.25, 230, 1089, 618.5, 1062.6000000000001, 1089.0, 1089.0, 0.06148895504644978, 0.011108844417571493, 0.04239375220975932], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/597c7425-ffb2-4486-b0eb-2a1c5d8c8519", 1, 0, 0.0, 223.0, 223, 223, 223.0, 223.0, 223.0, 223.0, 4.484304932735426, 1.4319997197309418, 2.6756936659192823], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 362.92857142857144, 241, 715, 262.0, 598.0, 715.0, 715.0, 0.08309936903836224, 0.12878779166394613, 0.18689242860873848], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 725.65, 183, 1484, 684.0, 1397.1000000000006, 1480.85, 1484.0, 0.09203696204395685, 0.05653442297426647, 0.0416143685804219], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 121.99999999999999, 116, 131, 121.0, 129.5, 131.0, 131.0, 0.15167273357600972, 0.11271772485482752, 0.0761326025957705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 190.42857142857144, 115, 405, 119.5, 383.5, 405.0, 405.0, 0.15168588021149346, 0.20332002470312904, 0.07740889366819796], "isController": false}, {"data": ["login", 20, 0, 0.0, 3471.95, 1880, 6013, 3198.5, 5472.700000000001, 5988.15, 6013.0, 0.08821765058752955, 21.2301806642348, 0.16235838310279121], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 137.05555555555557, 120, 343, 124.0, 154.9000000000003, 343.0, 343.0, 0.09958616416225906, 0.08062200204151637, 0.035399769292053025], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d62e04dd-af86-4db5-aaa0-d1090b31a6bc", 2, 0, 0.0, 282.5, 233, 332, 282.5, 332.0, 332.0, 332.0, 0.013742021039034212, 0.027007634122125344, 0.008541793350923121], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c36a4393-ca8c-492a-86d9-93bd1d4d3727", 1, 0, 0.0, 230.0, 230, 230, 230.0, 230.0, 230.0, 230.0, 4.3478260869565215, 0.7854959239130435, 2.9976222826086953], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 1154.2142857142856, 239, 1778, 1413.0, 1770.5, 1778.0, 1778.0, 0.1514741682445226, 129.50690593724642, 0.312986035975115], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/98615ace-38b3-4b1c-8677-1b00816079be", 3, 0, 0.0, 612.3333333333334, 512, 776, 549.0, 776.0, 776.0, 776.0, 0.021986236615878462, 0.030295488149418463, 0.014099246788177266], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 402.15, 240, 1410, 253.5, 585.0000000000002, 1369.2999999999993, 1410.0, 0.09310770233467563, 5.706542889190196, 0.20821028083610715], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 1, 20.0, 1171.6, 119, 1559, 1377.0, 1559.0, 1559.0, 1559.0, 0.038174641349244524, 36.53815710487337, 0.0737918799674752], "isController": false}, {"data": ["register", 21, 5, 23.80952380952381, 1297.142857142857, 384, 2759, 1160.0, 2388.8000000000006, 2737.7, 2759.0, 0.08667156429791906, 0.0273750588128472, 0.039103772173475194], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 137.61111111111111, 119, 369, 123.5, 154.80000000000035, 369.0, 369.0, 0.09182642764587648, 0.07129102536960137, 0.03264142545224516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 378.99999999999994, 241, 1223, 248.0, 560.600000000001, 1223.0, 1223.0, 0.09713243467843768, 6.5979598731747195, 0.21707244190940783], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 293.7857142857142, 238, 479, 244.5, 479.0, 479.0, 479.0, 0.10854480186697059, 0.16822324273718975, 0.24411980341761058], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/37a0ad3c-dd2b-45d7-8971-9f5d668b2be3", 3, 0, 0.0, 477.0, 241, 794, 396.0, 794.0, 794.0, 794.0, 0.030246509048747292, 0.030335121868226043, 0.019396361597015677], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ab65adf6-1cf0-4d9b-b94b-1b7f42341cfe", 3, 0, 0.0, 1213.6666666666667, 226, 2914, 501.0, 2914.0, 2914.0, 2914.0, 0.018112332687326798, 0.02496931280300423, 0.01161500501107871], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 170.8, 120, 365, 122.5, 364.2, 365.0, 365.0, 0.053672543810213885, 0.03988750570270778, 0.026941101092236266], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 168.2, 118, 355, 120.0, 354.7, 355.0, 355.0, 0.05367340804671733, 0.02242332418201726, 0.030159842763751124], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/20f3bbd0-2593-4b61-81d8-d7d2ef344235", 3, 0, 0.0, 333.0, 235, 507, 257.0, 507.0, 507.0, 507.0, 0.01884315585174205, 0.025976811533895697, 0.012083664397113229], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 261.09999999999997, 117, 1285, 120.5, 1192.7000000000003, 1285.0, 1285.0, 0.05367340804671733, 4.8425626855087165, 0.031092837552063202], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 226.8, 117, 708, 121.5, 673.4000000000001, 708.0, 708.0, 0.053672831885955966, 1.5911793229440623, 0.031144918658823278], "isController": false}, {"data": ["https://demoqa.com/books", 53, 0, 0.0, 1368.0943396226419, 926, 2237, 1301.0, 1970.4, 2079.6999999999994, 2237.0, 0.2282416777916541, 273.0563962846131, 0.45068815673312945], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 5, 23.80952380952381, 1297.142857142857, 384, 2759, 1160.0, 2388.8000000000006, 2737.7, 2759.0, 0.08533602074071667, 0.026953229765204034, 0.03850121248262802], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 197.88888888888889, 118, 354, 120.0, 354.0, 354.0, 354.0, 0.048444135837356884, 0.013057208487412599, 0.028527162021412308], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 172.44444444444443, 118, 355, 121.0, 355.0, 355.0, 355.0, 0.048444135837356884, 0.013057208487412599, 0.02847985329500864], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=98e94614-4d6a-4010-b7e2-ac95240bb592", 1, 0, 0.0, 840.0, 840, 840, 840.0, 840.0, 840.0, 840.0, 1.1904761904761907, 0.21507626488095238, 0.8207775297619048], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 197.61111111111111, 116, 1062, 120.0, 429.300000000001, 1062.0, 1062.0, 0.08690614136732329, 4.3664725234767285, 0.05067638929123214], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 266.0555555555555, 115, 712, 251.0, 496.9000000000003, 712.0, 712.0, 0.08690656096253845, 1.44175683725298, 0.05076150365248963], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 146.33333333333334, 116, 353, 121.0, 352.1, 353.0, 353.0, 0.08690362388111585, 0.06458365016946206, 0.04362154558095072], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 172.55555555555554, 116, 354, 122.0, 354.0, 354.0, 354.0, 0.04838267470177457, 0.012946145379185774, 0.02759324416585581], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 171.83333333333334, 116, 362, 119.0, 356.6, 362.0, 362.0, 0.08690572177615984, 0.030505643440307838, 0.049157934854505335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 149.33333333333334, 118, 360, 123.0, 360.0, 360.0, 360.0, 0.048442832075613874, 0.036000971884318514, 0.024316030944204623], "isController": false}, {"data": ["deleteAccount", 11, 0, 0.0, 669.7272727272726, 430, 949, 660.0, 930.0000000000001, 949.0, 949.0, 0.06480270521838512, 0.011707519985743405, 0.04410887259493596], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 124.33333333333333, 122, 130, 123.0, 130.0, 130.0, 130.0, 0.05016638517750539, 0.039486432083075534, 0.01783258223106637], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1779.7, 1037, 3777, 1395.5, 3029.700000000001, 3742.6999999999994, 3777.0, 0.09202002355712603, 0.047627551255153125, 0.04232561630410778], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 375.99999999999994, 238, 716, 255.0, 716.0, 716.0, 716.0, 0.04835044401824423, 0.07493374478218125, 0.10874128181056296], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3f63a905-6276-4fe5-a9a7-2c367c82671f", 1, 0, 0.0, 766.0, 766, 766, 766.0, 766.0, 766.0, 766.0, 1.3054830287206267, 0.2358538674934726, 0.9000693537859008], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fc85e941-7323-4388-aac6-ddbc8d9b952b", 1, 0, 0.0, 241.0, 241, 241, 241.0, 241.0, 241.0, 241.0, 4.149377593360996, 1.3250453838174274, 2.4758493257261414], "isController": false}, {"data": ["addBook", 64, 11, 17.1875, 1230.4375000000002, 608, 4753, 963.5, 2213.0, 2713.25, 4753.0, 0.3109180828013719, 82.5030118291578, 1.1341896560833065], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=73213ae1-86de-4c0c-92bc-05deca99d6c1", 1, 0, 0.0, 289.0, 289, 289, 289.0, 289.0, 289.0, 289.0, 3.4602076124567476, 0.6251351643598616, 2.3856509515570936], "isController": false}, {"data": ["https://demoqa.com/books-0", 53, 0, 0.0, 224.77358490566039, 117, 762, 124.0, 486.0, 527.3999999999999, 762.0, 0.2294173664617782, 0.17049474206778634, 0.11089999648298848], "isController": false}, {"data": ["https://demoqa.com/books-3", 53, 0, 0.0, 779.8867924528303, 570, 1096, 711.0, 1059.4, 1073.6, 1096.0, 0.22928834090417477, 67.41838531527146, 0.11531591363833009], "isController": false}, {"data": ["https://demoqa.com/books-1", 53, 0, 0.0, 200.2830188679245, 115, 486, 124.0, 360.0, 361.6, 486.0, 0.2298631230158042, 0.4067499793990597, 0.11178890162292039], "isController": false}, {"data": ["https://demoqa.com/books-2", 53, 0, 0.0, 1137.811320754717, 806, 1844, 1144.0, 1478.4, 1609.1999999999996, 1844.0, 0.22903369388134326, 206.0849203527227, 0.11496417837403362], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 142.07142857142856, 120, 357, 123.0, 246.5, 357.0, 357.0, 0.11726668118539862, 0.08760645615901362, 0.04168464057762217], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 181, 11, 6.077348066298343, 215.15469613259674, 118, 2671, 128.0, 361.2000000000001, 461.9000000000003, 1855.1000000000067, 0.7448529018399102, 1.4493654990102922, 0.3632355486705816], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 149.0, 122, 368, 123.0, 344.6000000000001, 368.0, 368.0, 0.05442443439406556, 0.04214704733837303, 0.01934618566351549], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/22a783fc-3ee2-418e-8f48-2434286afe7d", 3, 0, 0.0, 578.6666666666666, 351, 843, 542.0, 843.0, 843.0, 843.0, 0.019497864983784276, 0.023045816326862208, 0.012503513677752286], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 148.7, 118, 361, 126.0, 330.90000000000043, 360.6, 361.0, 0.0947319559306941, 0.07687720251797539, 0.03367424995973892], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/df3e7a67-bc71-4d26-ae68-62950cac5f9f", 3, 0, 0.0, 1187.3333333333333, 346, 2730, 486.0, 2730.0, 2730.0, 2730.0, 0.02359900569522671, 0.023668143407224444, 0.015133476959504106], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3f63a905-6276-4fe5-a9a7-2c367c82671f", 3, 0, 0.0, 837.3333333333334, 230, 1428, 854.0, 1428.0, 1428.0, 1428.0, 0.046852305914322746, 0.03012151828801674, 0.030045261279692648], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 456.9, 241, 1416, 246.0, 1347.1000000000004, 1416.0, 1416.0, 0.053637421756411015, 6.491715155454657, 0.1192594549365201], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=aa096e4e-126b-44d7-a41e-6a3cbd549d34", 1, 0, 0.0, 457.0, 457, 457, 457.0, 457.0, 457.0, 457.0, 2.1881838074398248, 0.3953261761487965, 1.5086501641137855], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c36a4393-ca8c-492a-86d9-93bd1d4d3727", 3, 0, 0.0, 854.3333333333334, 355, 1259, 949.0, 1259.0, 1259.0, 1259.0, 0.07251456334147108, 0.03281095151192864, 0.04650185214280535], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 457.33333333333337, 236, 1184, 473.0, 760.1000000000007, 1184.0, 1184.0, 0.08685414294261835, 5.899781590480304, 0.19410242274806508], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/98e94614-4d6a-4010-b7e2-ac95240bb592", 3, 0, 0.0, 1018.6666666666666, 239, 2157, 660.0, 2157.0, 2157.0, 2157.0, 0.015897408722378253, 0.021915861308356738, 0.010194627338243866], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 125.92857142857143, 120, 135, 125.0, 134.5, 135.0, 135.0, 0.08170363756266377, 0.06774061356513822, 0.02904308991485314], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 128.7142857142857, 120, 154, 125.0, 146.5, 154.0, 154.0, 0.1479196162542527, 0.11483993644739345, 0.05258080109037889], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 122.42857142857144, 119, 132, 121.5, 128.5, 132.0, 132.0, 0.10864588426109158, 0.08074171672137763, 0.05453514112324323], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 152.57142857142853, 116, 356, 119.5, 354.5, 356.0, 356.0, 0.10865010011330653, 0.02907239006938085, 0.06196451022087013], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 152.5, 117, 354, 119.0, 354.0, 354.0, 354.0, 0.1086517865458045, 0.029285051842423866, 0.06387536669977958], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 153.07142857142858, 117, 357, 119.5, 356.0, 357.0, 357.0, 0.10865094332301149, 0.02928482456753044, 0.06398097541384368], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=98615ace-38b3-4b1c-8677-1b00816079be", 1, 0, 0.0, 580.0, 580, 580, 580.0, 580.0, 580.0, 580.0, 1.7241379310344827, 0.31148976293103453, 1.1887122844827587], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 27.77777777777778, 0.38639876352395675], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.555555555555555, 0.07727975270479134], "isController": false}, {"data": ["401/Unauthorized", 12, 66.66666666666667, 0.9273570324574961], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1294, 18, "401/Unauthorized", 12, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 1, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 1, "Test failed: code expected to contain /200/", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 181, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
