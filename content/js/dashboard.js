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

    var data = {"OkPercent": 97.72899318697957, "KoPercent": 2.2710068130204393};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7110032362459547, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c6743d48-a787-483f-ad66-f1177f3f8d32"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=61be6843-982a-4d6f-915c-d7e8297aed2a"], "isController": false}, {"data": [0.40625, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.40625, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8c0b58cf-b0ae-4f18-a5fd-880587b76693"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4408f56f-8c58-4ecf-ad1d-430b5ce0b71b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.925, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.925, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/f8538366-8a47-4b05-904e-7d009b77a4a1"], "isController": false}, {"data": [0.75, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/554877d4-3d1e-4f1c-a251-007a8f46c925"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=531fee58-c075-43b3-bde7-d54b731029cd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d512128c-8ced-440b-829f-843c4c23015b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.46875, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.7916666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3bf4d55a-64b3-4855-aa37-04f21ee818e6"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8cddb47c-23f0-4c52-a55f-17571fe50dc5"], "isController": false}, {"data": [0.5652173913043478, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/93ae79f8-af2d-4637-8957-3351678dd8b9"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8cd47cf3-d43d-49be-b306-d6a237015b81"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/aa2a290b-83b4-4a63-a050-7e1b683c8545"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/df1020bb-a118-4ab0-9bb2-7d550179499c"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.19230769230769232, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.125, 500, 1500, "register"], "isController": true}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8c0b58cf-b0ae-4f18-a5fd-880587b76693"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/3bf4d55a-64b3-4855-aa37-04f21ee818e6"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c6743d48-a787-483f-ad66-f1177f3f8d32"], "isController": false}, {"data": [0.2413793103448276, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.125, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=554877d4-3d1e-4f1c-a251-007a8f46c925"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/61be6843-982a-4d6f-915c-d7e8297aed2a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4408f56f-8c58-4ecf-ad1d-430b5ce0b71b"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.13043478260869565, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/bc5b0c0b-fdf7-4809-b211-5fb8be9fb41e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d512128c-8ced-440b-829f-843c4c23015b"], "isController": false}, {"data": [0.22727272727272727, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/8cddb47c-23f0-4c52-a55f-17571fe50dc5"], "isController": false}, {"data": [0.896551724137931, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/531fee58-c075-43b3-bde7-d54b731029cd"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9913793103448276, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4051724137931034, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8cd47cf3-d43d-49be-b306-d6a237015b81"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=93ae79f8-af2d-4637-8957-3351678dd8b9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6fc15a76-431a-45d4-85c3-36de5b193141"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=aa2a290b-83b4-4a63-a050-7e1b683c8545"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=df1020bb-a118-4ab0-9bb2-7d550179499c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1321, 30, 2.2710068130204393, 483.2043906131714, 125, 3876, 152.0, 1390.0, 1584.0, 2063.4799999999996, 5.22167409796667, 769.4558260416172, 3.8132468048868704], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 2212.655172413792, 1535, 3893, 2149.5, 2627.0, 2843.7499999999995, 3893.0, 0.24987183298222035, 300.68095543799734, 1.2286178506498822], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/c6743d48-a787-483f-ad66-f1177f3f8d32", 3, 0, 0.0, 507.6666666666667, 397, 591, 535.0, 591.0, 591.0, 591.0, 0.04542288707870272, 0.02825622955970081, 0.02912860922690246], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=61be6843-982a-4d6f-915c-d7e8297aed2a", 1, 0, 0.0, 573.0, 573, 573, 573.0, 573.0, 573.0, 573.0, 1.7452006980802792, 0.3152950479930192, 1.2032340750436301], "isController": false}, {"data": ["deleteBook", 16, 3, 18.75, 671.0625000000002, 134, 1245, 695.5, 1125.3000000000002, 1245.0, 1245.0, 0.0857977853446658, 0.01733865156715017, 0.057545890084993424], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, 18.75, 671.0625000000002, 134, 1245, 695.5, 1125.3000000000002, 1245.0, 1245.0, 0.08498613663646118, 0.017174627588093443, 0.05700150485217724], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8c0b58cf-b0ae-4f18-a5fd-880587b76693", 3, 0, 0.0, 372.3333333333333, 250, 615, 252.0, 615.0, 615.0, 615.0, 0.07626213839036046, 0.034506631628450864, 0.0489050822360059], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4408f56f-8c58-4ecf-ad1d-430b5ce0b71b", 1, 0, 0.0, 1111.0, 1111, 1111, 1111.0, 1111.0, 1111.0, 1111.0, 0.9000900090009001, 0.16261391764176417, 0.6205698694869487], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 164.64999999999995, 127, 420, 140.0, 391.40000000000055, 419.9, 420.0, 0.12361550632911393, 0.060926509808890424, 0.0689422027974189], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 134.94999999999996, 128, 152, 132.5, 150.10000000000002, 151.95, 152.0, 0.12360557461141497, 0.091859220975866, 0.0620442044436204], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 298.5, 125, 1151, 132.0, 988.3000000000005, 1144.1499999999999, 1151.0, 0.12342174444293595, 5.471789742573097, 0.07108803210199573], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 359.59999999999997, 128, 1498, 133.0, 1468.6000000000001, 1496.7, 1498.0, 0.12341260536351183, 16.685305907067224, 0.07096224808401931], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f8538366-8a47-4b05-904e-7d009b77a4a1", 1, 0, 0.0, 599.0, 599, 599, 599.0, 599.0, 599.0, 599.0, 1.669449081803005, 0.5331150876460768, 0.996126356427379], "isController": false}, {"data": ["goToProfile", 16, 3, 18.75, 357.375, 131, 1699, 263.0, 847.1000000000008, 1699.0, 1699.0, 0.0856613592316176, 0.12976775733207696, 0.05536304522116692], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/554877d4-3d1e-4f1c-a251-007a8f46c925", 3, 0, 0.0, 724.3333333333334, 312, 1292, 569.0, 1292.0, 1292.0, 1292.0, 0.027694182375422337, 0.027775317675350332, 0.0177596156509056], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=531fee58-c075-43b3-bde7-d54b731029cd", 1, 0, 0.0, 524.0, 524, 524, 524.0, 524.0, 524.0, 524.0, 1.9083969465648853, 0.34477874522900764, 1.3157502385496183], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 150.16666666666669, 128, 379, 135.5, 172.00000000000034, 379.0, 379.0, 0.10611330542946412, 0.07885959514826386, 0.05326390526439899], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 193.05555555555554, 126, 408, 140.0, 396.3, 408.0, 408.0, 0.10611393099057355, 0.037248108371799635, 0.06002299503622612], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 963.1428571428571, 766, 1120, 1017.0, 1120.0, 1120.0, 1120.0, 0.042039769622062476, 12.3610881206121, 0.023975806112582505], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1293.5714285714287, 982, 1662, 1271.0, 1662.0, 1662.0, 1662.0, 0.041965420493513345, 37.760559127404015, 0.02389242201925613], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 208.0, 132, 385, 141.0, 385.0, 385.0, 385.0, 0.04220096097616852, 0.0746759192273607, 0.023367133665515186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 183.0, 129, 437, 133.0, 432.8, 437.0, 437.0, 0.058791827935916904, 0.043691973690657, 0.02951074175689579], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 182.66666666666666, 129, 430, 135.5, 425.20000000000005, 430.0, 430.0, 0.05879153989740876, 0.015731330011611328, 0.03352955009774094], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 197.66666666666663, 129, 404, 134.0, 399.8, 404.0, 404.0, 0.05874807844826742, 0.015834443019259577, 0.034537444556500964], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 220.58333333333334, 128, 536, 135.0, 529.7, 536.0, 536.0, 0.058675402782192014, 0.015814854656137693, 0.034552019411779086], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d512128c-8ced-440b-829f-843c4c23015b", 3, 0, 0.0, 646.6666666666666, 274, 1116, 550.0, 1116.0, 1116.0, 1116.0, 0.03610629693818602, 0.030100334133689583, 0.02315410317976122], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 138.85714285714286, 134, 148, 135.0, 148.0, 148.0, 148.0, 0.04226389576515764, 0.0314090084739111, 0.023732168032193014], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 273.8888888888889, 127, 1396, 139.5, 492.40000000000146, 1396.0, 1396.0, 0.10611330542946412, 5.331508513013618, 0.061876400106113304], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 899.5624999999999, 129, 1820, 1269.5, 1817.2, 1820.0, 1820.0, 0.09839553776236248, 49.81337157883327, 0.053089389271196545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 199.44444444444446, 127, 1014, 134.5, 456.9000000000009, 1014.0, 1014.0, 0.10611267987573027, 1.7603812650694743, 0.06197966099946354], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 637.7499999999999, 130, 1281, 759.5, 1187.9, 1281.0, 1281.0, 0.09839795824236647, 16.286003178715294, 0.05318678699916977], "isController": false}, {"data": ["deleteBooks", 16, 3, 18.75, 550.625, 138, 1111, 538.0, 1057.1000000000001, 1111.0, 1111.0, 0.08489144506462361, 0.017155491614316943, 0.057393953673146716], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 453.4166666666667, 261, 939, 283.5, 917.7, 939.0, 939.0, 0.05863755637756723, 0.09087675973749922, 0.1318772386108763], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3bf4d55a-64b3-4855-aa37-04f21ee818e6", 1, 0, 0.0, 694.0, 694, 694, 694.0, 694.0, 694.0, 694.0, 1.440922190201729, 0.2603228566282421, 0.9934483069164266], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8cddb47c-23f0-4c52-a55f-17571fe50dc5", 1, 0, 0.0, 514.0, 514, 514, 514.0, 514.0, 514.0, 514.0, 1.9455252918287937, 0.3514865029182879, 1.3413484922178989], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 845.4782608695651, 191, 1867, 752.0, 1512.8000000000002, 1810.3999999999992, 1867.0, 0.1024644938254005, 0.06293961583611027, 0.046329160782383236], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 136.5625, 129, 145, 137.0, 143.6, 145.0, 145.0, 0.09839856338097464, 0.07312627610636883, 0.04939146638459078], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 204.375, 128, 447, 140.5, 427.40000000000003, 447.0, 447.0, 0.09839069715958355, 0.1094524442401471, 0.05146534879502143], "isController": false}, {"data": ["login", 23, 0, 0.0, 3708.304347826087, 2275, 5670, 3741.0, 4814.0, 5502.399999999998, 5670.0, 0.10451884974733705, 38.197436994730886, 0.21044447918938813], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 140.3888888888889, 130, 153, 140.0, 151.2, 153.0, 153.0, 0.10413111264093856, 0.08430145740169734, 0.03701535644658363], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/93ae79f8-af2d-4637-8957-3351678dd8b9", 3, 0, 0.0, 613.0, 270, 992, 577.0, 992.0, 992.0, 992.0, 0.036327968903258616, 0.030285132930092877, 0.023296256100071445], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8cd47cf3-d43d-49be-b306-d6a237015b81", 1, 0, 0.0, 605.0, 605, 605, 605.0, 605.0, 605.0, 605.0, 1.6528925619834711, 0.29861828512396693, 1.1395919421487604], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aa2a290b-83b4-4a63-a050-7e1b683c8545", 3, 0, 0.0, 431.0, 226, 661, 406.0, 661.0, 661.0, 661.0, 0.02201786382685152, 0.03017422093458493, 0.014119528560839029], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 1039.3125, 263, 1965, 1408.0, 1953.1, 1965.0, 1965.0, 0.09831089591948337, 66.22453925408144, 0.20695451661761363], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/df1020bb-a118-4ab0-9bb2-7d550179499c", 3, 0, 0.0, 501.66666666666663, 300, 817, 388.0, 817.0, 817.0, 817.0, 0.08048937540244687, 0.036419346292122776, 0.0516159080543035], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 527.1499999999999, 257, 1631, 283.5, 1597.5, 1629.5, 1631.0, 0.12330304188604334, 22.289427062782828, 0.27257919523187135], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 6, 46.15384615384615, 845.4615384615385, 131, 1796, 1263.0, 1762.3999999999999, 1796.0, 1796.0, 0.07787322239394266, 50.17455020726258, 0.11836589407444681], "isController": false}, {"data": ["register", 24, 7, 29.166666666666668, 1368.083333333333, 214, 2126, 1451.5, 1892.0, 2079.25, 2126.0, 0.097007324052966, 0.030456889338895086, 0.04376697628170927], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 458.3333333333333, 260, 1538, 293.5, 851.3000000000011, 1538.0, 1538.0, 0.1060307960556544, 7.202402987344047, 0.23695858024764083], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 179.0, 131, 474, 140.0, 425.70000000000005, 474.0, 474.0, 0.07836069427575129, 0.06083667182541237, 0.027854778043333465], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8c0b58cf-b0ae-4f18-a5fd-880587b76693", 1, 0, 0.0, 371.0, 371, 371, 371.0, 371.0, 371.0, 371.0, 2.6954177897574128, 0.48696512803234504, 1.858364218328841], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3bf4d55a-64b3-4855-aa37-04f21ee818e6", 3, 0, 0.0, 513.6666666666666, 348, 622, 571.0, 622.0, 622.0, 622.0, 0.03689719212367939, 0.030759670907793916, 0.02366128531368763], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 12, 0, 0.0, 689.1666666666666, 259, 1652, 526.5, 1631.6000000000001, 1652.0, 1652.0, 0.07729020539872085, 23.20632756192878, 0.16888362751917765], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 13, 0, 0.0, 157.0769230769231, 129, 382, 142.0, 289.5999999999999, 382.0, 382.0, 0.08880509331365959, 0.06599675391767085, 0.044575994104708035], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 13, 0, 0.0, 132.61538461538458, 128, 145, 130.0, 144.2, 145.0, 145.0, 0.08881358711246533, 0.023764573114077637, 0.05065149890007788], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 13, 0, 0.0, 155.6153846153846, 127, 394, 139.0, 295.19999999999993, 394.0, 394.0, 0.08865369140331973, 0.023894940261051024, 0.052118674047654766], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 13, 0, 0.0, 160.61538461538464, 128, 432, 140.0, 319.19999999999993, 432.0, 432.0, 0.08863072349941367, 0.023888749693201344, 0.05219172487318989], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 230.33333333333331, 138, 401, 152.0, 401.0, 401.0, 401.0, 0.03999466737768297, 0.011795302293027596, 0.02472326606452473], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c6743d48-a787-483f-ad66-f1177f3f8d32", 1, 0, 0.0, 596.0, 596, 596, 596.0, 596.0, 596.0, 596.0, 1.6778523489932886, 0.3031276216442953, 1.1568005453020134], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 1560.362068965517, 1012, 3306, 1523.0, 2045.6, 2253.7, 3306.0, 0.25585037164472085, 306.0859924678533, 0.5052045424469], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, 29.166666666666668, 1368.083333333333, 214, 2126, 1451.5, 1892.0, 2079.25, 2126.0, 0.09879307789834192, 0.031017553265934503, 0.04457265819241599], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 134.16666666666666, 128, 143, 133.0, 143.0, 143.0, 143.0, 0.03933832930115458, 0.01060290906945182, 0.023165051336519738], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 171.5, 127, 384, 129.0, 384.0, 384.0, 384.0, 0.03927524088814412, 0.010585904770632593, 0.0230895459127566], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=554877d4-3d1e-4f1c-a251-007a8f46c925", 1, 0, 0.0, 537.0, 537, 537, 537.0, 537.0, 537.0, 537.0, 1.86219739292365, 0.33643214618249534, 1.2838978119180633], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 148.31249999999997, 127, 401, 130.0, 219.7000000000002, 401.0, 401.0, 0.08039554608674679, 0.021669112031193472, 0.04726378783615388], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 181.49999999999997, 127, 398, 133.0, 392.4, 398.0, 398.0, 0.08039796995125872, 0.021669765338425205, 0.047343726445907244], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 135.125, 129, 148, 133.5, 146.6, 148.0, 148.0, 0.0803886792642426, 0.059741977461024054, 0.04035134877130928], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 135.16666666666669, 129, 144, 133.5, 144.0, 144.0, 144.0, 0.039339618930224626, 0.010526421471564013, 0.022435876421143735], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 168.5, 128, 422, 132.5, 417.1, 422.0, 422.0, 0.08039595005401602, 0.02151219757304726, 0.04585081526518102], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 137.0, 129, 151, 134.0, 151.0, 151.0, 151.0, 0.039335234536335924, 0.02923253269741371, 0.019744443898121744], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/61be6843-982a-4d6f-915c-d7e8297aed2a", 3, 0, 0.0, 1214.0, 482, 2676, 484.0, 2676.0, 2676.0, 2676.0, 0.04734325437530575, 0.030437150843498982, 0.030360094765414177], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4408f56f-8c58-4ecf-ad1d-430b5ce0b71b", 3, 0, 0.0, 364.3333333333333, 255, 488, 350.0, 488.0, 488.0, 488.0, 0.03105782967886204, 0.025891634702983623, 0.019916642079218172], "isController": false}, {"data": ["deleteAccount", 16, 3, 18.75, 512.375, 133, 992, 525.0, 869.5000000000001, 992.0, 992.0, 0.08545639053570474, 0.016831529068525343, 0.05815144641617263], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 138.66666666666666, 131, 145, 138.0, 145.0, 145.0, 145.0, 0.0399536537616365, 0.03144789544128811, 0.014202275360581725], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1954.3478260869563, 1290, 3876, 1840.0, 2692.8, 3651.5999999999967, 3876.0, 0.10269507599435623, 0.05315272487989141, 0.04723572343099784], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 315.5, 262, 528, 272.5, 528.0, 528.0, 528.0, 0.03923645851725423, 0.06080884733093991, 0.08824371480980125], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bc5b0c0b-fdf7-4809-b211-5fb8be9fb41e", 1, 0, 0.0, 613.0, 613, 613, 613.0, 613.0, 613.0, 613.0, 1.6313213703099512, 0.5209395391517129, 0.9733763254486134], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d512128c-8ced-440b-829f-843c4c23015b", 1, 0, 0.0, 561.0, 561, 561, 561.0, 561.0, 561.0, 561.0, 1.7825311942959001, 0.32203932709447414, 1.2289717023172904], "isController": false}, {"data": ["addBook", 55, 11, 20.0, 1397.5818181818179, 666, 2565, 1078.0, 2345.2, 2506.2, 2565.0, 0.2517600314928912, 88.64146621466205, 0.9119774691937271], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/8cddb47c-23f0-4c52-a55f-17571fe50dc5", 3, 0, 0.0, 875.3333333333334, 412, 1699, 515.0, 1699.0, 1699.0, 1699.0, 0.044416807319889846, 0.028150886670516122, 0.028483434381569986], "isController": false}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 278.5862068965518, 126, 1921, 144.0, 529.3, 568.05, 1921.0, 0.2574288187124121, 0.19131184671889218, 0.12444068873305075], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/531fee58-c075-43b3-bde7-d54b731029cd", 3, 0, 0.0, 338.6666666666667, 245, 515, 256.0, 515.0, 515.0, 515.0, 0.03228479493774415, 0.026599223954241684, 0.02070346550369661], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 873.5172413793102, 627, 1258, 835.0, 1151.9, 1182.3999999999999, 1258.0, 0.2571845387750034, 75.62079373024002, 0.1293457397159441], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 216.08620689655174, 125, 567, 141.5, 394.3, 421.15, 567.0, 0.2576140497372781, 0.4558561114491679, 0.12528495778238719], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 1277.9137931034481, 884, 1825, 1276.5, 1532.9, 1683.8999999999996, 1825.0, 0.25647942194844764, 230.78063471194707, 0.12874064734521687], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 12, 0, 0.0, 139.74999999999997, 131, 152, 137.5, 150.5, 152.0, 152.0, 0.07659900421294523, 0.057224842014553814, 0.027228552278820376], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 11, 6.5476190476190474, 213.72619047619048, 128, 1296, 146.5, 384.9, 462.49999999999983, 1097.9700000000007, 0.691477539327785, 1.6017026991290675, 0.32794457401073435], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 13, 0, 0.0, 187.30769230769232, 132, 427, 145.0, 424.2, 427.0, 427.0, 0.09253130049183944, 0.07165754032229364, 0.03289198572170855], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 156.00000000000003, 135, 386, 140.5, 189.00000000000009, 376.34999999999985, 386.0, 0.1194208090759815, 0.0969127854903717, 0.0424503657262278], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 13, 0, 0.0, 320.69230769230774, 264, 814, 285.0, 609.1999999999998, 814.0, 814.0, 0.0885437951232802, 0.1372255887310993, 0.1991370704774554], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 338.5, 260, 558, 272.0, 557.3, 558.0, 558.0, 0.08033499693722825, 0.12450355482361447, 0.18067529096331703], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8cd47cf3-d43d-49be-b306-d6a237015b81", 3, 0, 0.0, 350.0, 240, 470, 340.0, 470.0, 470.0, 470.0, 0.041812429441525314, 0.026881363329105634, 0.02681330924472815], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=93ae79f8-af2d-4637-8957-3351678dd8b9", 1, 0, 0.0, 539.0, 539, 539, 539.0, 539.0, 539.0, 539.0, 1.8552875695732838, 0.3351837894248608, 1.2791338126159555], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 177.16666666666669, 130, 423, 145.5, 375.00000000000017, 423.0, 423.0, 0.05974607916355489, 0.04953556758775206, 0.021237864077669904], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6fc15a76-431a-45d4-85c3-36de5b193141", 1, 0, 0.0, 250.0, 250, 250, 250.0, 250.0, 250.0, 250.0, 4.0, 1.27734375, 2.38671875], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 162.62499999999997, 130, 386, 143.5, 269.10000000000014, 386.0, 386.0, 0.09301189970991913, 0.07221138698182199, 0.03306282372501032], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=aa2a290b-83b4-4a63-a050-7e1b683c8545", 1, 0, 0.0, 1034.0, 1034, 1034, 1034.0, 1034.0, 1034.0, 1034.0, 0.9671179883945842, 0.17472346470019343, 0.6667825193423598], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=df1020bb-a118-4ab0-9bb2-7d550179499c", 1, 0, 0.0, 460.0, 460, 460, 460.0, 460.0, 460.0, 460.0, 2.1739130434782608, 0.39274796195652173, 1.4988111413043477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 12, 0, 0.0, 174.41666666666666, 129, 385, 131.5, 384.7, 385.0, 385.0, 0.07748934521503292, 0.05758729659046881, 0.03889601898488958], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 12, 0, 0.0, 196.0, 126, 416, 130.5, 407.00000000000006, 416.0, 416.0, 0.07748884483504562, 0.04983047297253666, 0.042565893769251135], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 12, 0, 0.0, 464.9999999999999, 128, 1455, 143.5, 1398.6000000000001, 1455.0, 1455.0, 0.07748984560148264, 17.44703927241878, 0.043890732860214776], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 12, 0, 0.0, 417.5, 128, 1062, 261.5, 1053.0, 1062.0, 1062.0, 0.07735497553648898, 5.7018699961000205, 0.04388988358076182], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 23.333333333333332, 0.5299015897047691], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 10.0, 0.22710068130204392], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 10.0, 0.22710068130204392], "isController": false}, {"data": ["401/Unauthorized", 17, 56.666666666666664, 1.2869038607115821], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1321, 30, "401/Unauthorized", 17, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
