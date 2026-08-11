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

    var data = {"OkPercent": 98.72204472843451, "KoPercent": 1.2779552715654952};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7276170798898072, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/70d251ad-d179-43b0-a7fd-32c2b3892e72"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/7d6fee7f-a05f-45cb-87e2-5af1ff60f676"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f545354e-f961-4945-a431-7c8bef0f121e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.125, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e94b7f5a-66b4-4202-b661-c257e0f8a801"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2d80cf57-ac98-4938-96c0-aee115311ab8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/af139a89-3ead-4327-b2bd-3d743cf304dc"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cb5e3a78-4ad2-406c-b157-3f64a3d29cb5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bc74d328-407f-4926-96ff-b8e0e46dfaca"], "isController": false}, {"data": [0.5588235294117647, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/bea0b3e9-d686-463e-bf4b-be8b488a6f4c"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/223c05e0-e365-4320-9e7d-545fd80b3c7e"], "isController": false}, {"data": [0.6, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8a97cc72-0a78-425c-96b0-48692c1c99de"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.38235294117647056, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f571065b-f2ae-4cc0-a950-2209ce2441f4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6614fcfd-64f6-4e90-ab4c-fbcb81b121fc"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.2619047619047619, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.65625, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.20754716981132076, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2619047619047619, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7d6fee7f-a05f-45cb-87e2-5af1ff60f676"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ae07125f-65ea-404e-807b-0977c1f14c53"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.125, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/cb5e3a78-4ad2-406c-b157-3f64a3d29cb5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3050847457627119, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bc74d328-407f-4926-96ff-b8e0e46dfaca"], "isController": false}, {"data": [0.9056603773584906, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=70d251ad-d179-43b0-a7fd-32c2b3892e72"], "isController": false}, {"data": [0.49056603773584906, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9811320754716981, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.33962264150943394, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.935672514619883, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/2d80cf57-ac98-4938-96c0-aee115311ab8"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/46e53ffd-eb9d-4279-b930-fab1521d5e43"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f545354e-f961-4945-a431-7c8bef0f121e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.85, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3d897b1c-5dca-4436-b244-1db6112c0602"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ae07125f-65ea-404e-807b-0977c1f14c53"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=223c05e0-e365-4320-9e7d-545fd80b3c7e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6614fcfd-64f6-4e90-ab4c-fbcb81b121fc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8a97cc72-0a78-425c-96b0-48692c1c99de"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f571065b-f2ae-4cc0-a950-2209ce2441f4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.84375, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1252, 16, 1.2779552715654952, 499.4816293929715, 138, 4420, 164.5, 1407.1000000000001, 1687.0499999999997, 2274.1100000000006, 4.894774085846206, 676.7039872726589, 3.5762965458024967], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 53, 0, 0.0, 2373.169811320755, 1691, 3112, 2325.0, 2848.2, 2996.4999999999995, 3112.0, 0.22740827508677985, 273.6494382103827, 1.1181647119745475], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/70d251ad-d179-43b0-a7fd-32c2b3892e72", 3, 0, 0.0, 493.3333333333333, 387, 570, 523.0, 570.0, 570.0, 570.0, 0.018296252927400468, 0.0252228617016735, 0.011732948654615535], "isController": false}, {"data": ["deleteBook", 12, 1, 8.333333333333334, 631.5833333333333, 149, 1310, 536.0, 1274.3000000000002, 1310.0, 1310.0, 0.08143764590911558, 0.015488263223437755, 0.055027406736929255], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, 8.333333333333334, 631.5833333333333, 149, 1310, 536.0, 1274.3000000000002, 1310.0, 1310.0, 0.07992114447078881, 0.015199846568052854, 0.054002706912512986], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 228.50000000000003, 139, 438, 145.0, 428.8, 437.55, 438.0, 0.12727909122728864, 0.034057100582301846, 0.07258885671556306], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 173.29999999999995, 141, 429, 145.5, 395.00000000000057, 428.65, 429.0, 0.12727666127862133, 0.09458744065725667, 0.06388691786837047], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 185.49999999999997, 140, 426, 143.0, 421.9, 425.8, 426.0, 0.12727342149138995, 0.0343041643863512, 0.07494714175713686], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 242.39999999999998, 141, 438, 146.0, 425.9, 437.4, 438.0, 0.12727342149138995, 0.0343041643863512, 0.07482285130646167], "isController": false}, {"data": ["goToProfile", 12, 1, 8.333333333333334, 389.58333333333337, 141, 1575, 255.5, 1253.400000000001, 1575.0, 1575.0, 0.08138351983723295, 0.17872848847066802, 0.052606550949474404], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 162.74999999999997, 141, 430, 145.0, 236.1000000000002, 430.0, 430.0, 0.08625057949608099, 0.06409833105128675, 0.04329374791111878], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7d6fee7f-a05f-45cb-87e2-5af1ff60f676", 3, 0, 0.0, 513.0, 256, 711, 572.0, 711.0, 711.0, 711.0, 0.03431866019950581, 0.028610054938455205, 0.022007734568042465], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f545354e-f961-4945-a431-7c8bef0f121e", 3, 0, 0.0, 1502.6666666666667, 549, 2384, 1575.0, 2384.0, 2384.0, 2384.0, 0.018128969488944352, 0.02142782819477765, 0.011625673793366006], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 231.24999999999997, 140, 439, 144.5, 429.90000000000003, 439.0, 439.0, 0.08625243932679971, 0.03117596104085131, 0.04873810322799754], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 1048.0, 849, 1119, 1112.0, 1119.0, 1119.0, 1119.0, 0.0732667826724059, 21.542866791830754, 0.04178496199285649], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1665.75, 1410, 1863, 1695.0, 1863.0, 1863.0, 1863.0, 0.07226477814713109, 65.0239744047189, 0.04114293521462639], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 213.0, 140, 423, 144.5, 423.0, 423.0, 423.0, 0.07458651102948033, 0.1319831620951351, 0.04129936694698764], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e94b7f5a-66b4-4202-b661-c257e0f8a801", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 1.2981135670731707, 2.42552718495935], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2d80cf57-ac98-4938-96c0-aee115311ab8", 1, 0, 0.0, 472.0, 472, 472, 472.0, 472.0, 472.0, 472.0, 2.1186440677966103, 0.38276284427966106, 1.4607057733050848], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 226.9285714285714, 139, 442, 145.0, 441.5, 442.0, 442.0, 0.08178286648947045, 0.06077808730320998, 0.041051165405847474], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/af139a89-3ead-4327-b2bd-3d743cf304dc", 1, 0, 0.0, 510.0, 510, 510, 510.0, 510.0, 510.0, 510.0, 1.9607843137254901, 0.6261488970588235, 1.1699601715686274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 213.35714285714286, 140, 576, 143.0, 500.0, 576.0, 576.0, 0.08192596233746474, 0.021921595391079435, 0.04672340039558536], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 224.21428571428575, 138, 432, 145.0, 430.5, 432.0, 432.0, 0.08192644175907773, 0.022081736255376423, 0.04816378704977032], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 246.1428571428571, 140, 453, 144.0, 442.5, 453.0, 453.0, 0.08192644175907773, 0.022081736255376423, 0.048243793340550664], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cb5e3a78-4ad2-406c-b157-3f64a3d29cb5", 1, 0, 0.0, 492.0, 492, 492, 492.0, 492.0, 492.0, 492.0, 2.032520325203252, 0.36720337906504064, 1.4013274898373984], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 217.0, 140, 429, 149.5, 429.0, 429.0, 429.0, 0.07418810393753361, 0.05513393271138973, 0.04165835914461116], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bc74d328-407f-4926-96ff-b8e0e46dfaca", 1, 0, 0.0, 480.0, 480, 480, 480.0, 480.0, 480.0, 480.0, 2.0833333333333335, 0.3763834635416667, 1.4363606770833335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 1030.8235294117646, 139, 2016, 1290.0, 1870.3999999999999, 2016.0, 2016.0, 0.07721832345393019, 40.87985417944176, 0.041492428629828985], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 303.1875, 141, 1702, 145.0, 907.5000000000008, 1702.0, 1702.0, 0.08625104444624133, 4.87234698020269, 0.05024291798064742], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 787.7647058823529, 143, 1306, 1117.0, 1302.0, 1306.0, 1306.0, 0.07722183106588838, 13.364912898317018, 0.041569725351472894], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 229.9375, 140, 970, 144.0, 587.8000000000004, 970.0, 970.0, 0.08625243932679971, 1.6068623080883224, 0.05032796142359651], "isController": false}, {"data": ["deleteBooks", 12, 1, 8.333333333333334, 510.33333333333337, 144, 841, 515.5, 786.7000000000002, 841.0, 841.0, 0.08001653675092853, 0.015217988801018878, 0.054692292657149144], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/bea0b3e9-d686-463e-bf4b-be8b488a6f4c", 1, 0, 0.0, 524.0, 524, 524, 524.0, 524.0, 524.0, 524.0, 1.9083969465648853, 0.6094197280534351, 1.13870169370229], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 504.2142857142856, 282, 1011, 291.5, 942.5, 1011.0, 1011.0, 0.08171460590212924, 0.12664167926433506, 0.1837780638599645], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/223c05e0-e365-4320-9e7d-545fd80b3c7e", 3, 0, 0.0, 1518.6666666666667, 503, 3503, 550.0, 3503.0, 3503.0, 3503.0, 0.02533569799847986, 0.02540992367620978, 0.016247176125327254], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 836.8999999999999, 243, 1550, 774.0, 1377.2, 1541.4499999999998, 1550.0, 0.09337852854114725, 0.05735849067615393, 0.04222095577592889], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 162.35294117647055, 140, 430, 144.0, 211.5999999999998, 430.0, 430.0, 0.07731876708403641, 0.05746052905366377, 0.03881039675897921], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 261.00000000000006, 140, 441, 146.0, 436.2, 441.0, 441.0, 0.07732158045310446, 0.08900332198525432, 0.04027757878841632], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8a97cc72-0a78-425c-96b0-48692c1c99de", 3, 0, 0.0, 403.0, 236, 582, 391.0, 582.0, 582.0, 582.0, 0.034694916038303186, 0.02892372394990054, 0.022249018423000415], "isController": false}, {"data": ["login", 20, 0, 0.0, 3975.2999999999993, 2028, 7284, 3747.0, 6629.300000000003, 7259.299999999999, 7284.0, 0.09233141437877115, 22.220186042029262, 0.16992947611155482], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 156.3125, 144, 226, 150.5, 181.90000000000003, 226.0, 226.0, 0.08388733930331564, 0.06791269949457879, 0.029819327642975485], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 1214.1764705882354, 288, 2162, 1451.0, 2019.6, 2162.0, 2162.0, 0.07716539722023004, 54.353150596499866, 0.16193296908618013], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f571065b-f2ae-4cc0-a950-2209ce2441f4", 3, 0, 0.0, 544.3333333333333, 260, 1067, 306.0, 1067.0, 1067.0, 1067.0, 0.025233833523988964, 0.029825536954949196, 0.016181852878339276], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6614fcfd-64f6-4e90-ab4c-fbcb81b121fc", 1, 0, 0.0, 548.0, 548, 548, 548.0, 548.0, 548.0, 548.0, 1.8248175182481752, 0.3296789461678832, 1.2581261405109487], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 459.95, 286, 851, 438.5, 822.2000000000005, 850.9, 851.0, 0.12715447361226787, 0.19706459924088782, 0.28597339133696575], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, 33.333333333333336, 1303.0, 141, 2232, 1648.5, 2232.0, 2232.0, 2232.0, 0.07644578082994635, 60.977305556971224, 0.1318017832570999], "isController": false}, {"data": ["register", 21, 4, 19.047619047619047, 1360.1428571428573, 457, 3032, 1236.0, 1909.0, 2921.8999999999983, 3032.0, 0.08451486455486826, 0.026835355988683057, 0.03813072990659095], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 169.13333333333333, 143, 427, 148.0, 271.0000000000001, 427.0, 427.0, 0.07755424919731352, 0.06021057432799243, 0.02756811201935754], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 538.375, 287, 1844, 431.0, 1152.4000000000008, 1844.0, 1844.0, 0.08618367896579586, 6.569322523902504, 0.19245093253433881], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 661.5, 283, 2090, 565.0, 1809.3000000000002, 2090.0, 2090.0, 0.10515385323150934, 15.867667675212608, 0.2331304055652677], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 173.3, 141, 419, 145.5, 392.5000000000001, 419.0, 419.0, 0.08326464000532893, 0.06187928812896027, 0.041794946252674874], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 142.6, 139, 146, 142.5, 146.0, 146.0, 146.0, 0.08326394671107411, 0.022279610741049127, 0.04748646960865945], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 200.39999999999998, 139, 439, 143.0, 437.2, 439.0, 439.0, 0.08326325342836445, 0.022442048775613857, 0.04894968609753458], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 228.19999999999996, 139, 437, 143.0, 436.0, 437.0, 437.0, 0.08326394671107411, 0.022442235636969194, 0.04903140611990008], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 144.0, 144, 144, 144.0, 144.0, 144.0, 144.0, 6.944444444444444, 2.048068576388889, 4.292805989583334], "isController": false}, {"data": ["https://demoqa.com/books", 53, 0, 0.0, 1591.962264150943, 1099, 2484, 1560.0, 2105.0, 2409.2999999999997, 2484.0, 0.240128672722742, 287.2773748102757, 0.4741603283646331], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 4, 19.047619047619047, 1360.1428571428573, 457, 3032, 1236.0, 1909.0, 2921.8999999999983, 3032.0, 0.08501714512426674, 0.026994841281086927, 0.03835734477286253], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7d6fee7f-a05f-45cb-87e2-5af1ff60f676", 1, 0, 0.0, 660.0, 660, 660, 660.0, 660.0, 660.0, 660.0, 1.5151515151515151, 0.27373342803030304, 1.044625946969697], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 4, 0, 0.0, 143.25, 142, 144, 143.5, 144.0, 144.0, 144.0, 0.09267840593141798, 0.024979726598702505, 0.05457527224281743], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 4, 0, 0.0, 143.0, 140, 146, 143.0, 146.0, 146.0, 146.0, 0.09268270077390056, 0.02498088419296538, 0.05448729088465638], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 313.0, 141, 1283, 145.0, 1270.4, 1283.0, 1283.0, 0.07811116781403293, 9.389521761120427, 0.04502579946780258], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 293.40000000000003, 140, 1151, 143.0, 1131.2, 1151.0, 1151.0, 0.07811116781403293, 3.080549863565827, 0.04510207990512097], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 4, 0, 0.0, 142.75, 142, 145, 142.0, 145.0, 145.0, 145.0, 0.09267840593141798, 0.024798714087117705, 0.05285565338276182], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 146.93333333333334, 140, 160, 146.0, 155.8, 160.0, 160.0, 0.07810303352182199, 0.05804336768565091, 0.0392040617482583], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ae07125f-65ea-404e-807b-0977c1f14c53", 1, 0, 0.0, 245.0, 245, 245, 245.0, 245.0, 245.0, 245.0, 4.081632653061225, 0.7374043367346939, 2.814094387755102], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 4, 0, 0.0, 147.75, 143, 152, 148.0, 152.0, 152.0, 152.0, 0.0926569376882094, 0.06885930623117906, 0.04650943942552698], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 181.26666666666665, 141, 427, 144.0, 424.0, 427.0, 427.0, 0.07811035430856714, 0.03654303424878669, 0.04367263820325356], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 4, 0, 0.0, 154.75, 146, 173, 150.0, 173.0, 173.0, 173.0, 0.09461856889414548, 0.0744751626256653, 0.033633944411590774], "isController": false}, {"data": ["deleteAccount", 11, 1, 9.090909090909092, 680.8181818181819, 144, 1499, 572.0, 1412.6000000000004, 1499.0, 1499.0, 0.07951021706289257, 0.014992871186220155, 0.054112688565707966], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 2051.1000000000004, 1227, 4420, 1797.5, 3469.8000000000015, 4375.9, 4420.0, 0.09254888895058815, 0.04790128041387863, 0.04256887372629591], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cb5e3a78-4ad2-406c-b157-3f64a3d29cb5", 3, 0, 0.0, 1130.3333333333333, 242, 2281, 868.0, 2281.0, 2281.0, 2281.0, 0.02749594434820864, 0.02757649887266628, 0.01763249035350619], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 4, 0, 0.0, 293.25, 287, 299, 293.5, 299.0, 299.0, 299.0, 0.09234889412199289, 0.1431227489957058, 0.207694827307568], "isController": false}, {"data": ["addBook", 59, 8, 13.559322033898304, 1409.3728813559323, 732, 4034, 1158.0, 2498.0, 2935.0, 4034.0, 0.27209127509350256, 83.80505849097717, 0.9896365362088924], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/bc74d328-407f-4926-96ff-b8e0e46dfaca", 2, 0, 0.0, 359.0, 255, 463, 359.0, 463.0, 463.0, 463.0, 0.021424975093466456, 0.02454247635218374, 0.013317379538077536], "isController": false}, {"data": ["https://demoqa.com/books-0", 53, 0, 0.0, 243.71698113207543, 141, 602, 147.0, 575.4, 584.9, 602.0, 0.24188211669671178, 0.1797580964904274, 0.11692543727038313], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=70d251ad-d179-43b0-a7fd-32c2b3892e72", 1, 0, 0.0, 841.0, 841, 841, 841.0, 841.0, 841.0, 841.0, 1.1890606420927465, 0.21482052615933414, 0.8198015755053508], "isController": false}, {"data": ["https://demoqa.com/books-3", 53, 0, 0.0, 914.3773584905663, 692, 1524, 847.0, 1224.4, 1328.5999999999997, 1524.0, 0.24177067367345448, 71.08860560189493, 0.12159364935725495], "isController": false}, {"data": ["https://demoqa.com/books-1", 53, 0, 0.0, 236.58490566037742, 140, 564, 150.0, 432.8, 476.19999999999965, 564.0, 0.24210199345867822, 0.42840704311242667, 0.11774100853752124], "isController": false}, {"data": ["https://demoqa.com/books-2", 53, 0, 0.0, 1346.2264150943397, 956, 1881, 1382.0, 1681.4, 1831.0, 1881.0, 0.2408105774910264, 216.6817809262688, 0.12087562190467536], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 172.37499999999997, 143, 431, 150.0, 258.8000000000002, 431.0, 431.0, 0.10062576648533066, 0.075174522813748, 0.035769315430332384], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 8, 4.678362573099415, 218.14619883040933, 142, 2017, 151.0, 343.6, 440.6, 1129.9600000000014, 0.7336285008237232, 1.5391811180219488, 0.35468514707964377], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 177.8, 141, 445, 148.0, 416.0000000000001, 445.0, 445.0, 0.08620689655172413, 0.06675983297413793, 0.03064385775862069], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2d80cf57-ac98-4938-96c0-aee115311ab8", 3, 0, 0.0, 777.3333333333333, 242, 1499, 591.0, 1499.0, 1499.0, 1499.0, 0.021321658540745688, 0.02138412433725178, 0.013673068790777673], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/46e53ffd-eb9d-4279-b930-fab1521d5e43", 1, 0, 0.0, 829.0, 829, 829, 829.0, 829.0, 829.0, 829.0, 1.2062726176115801, 0.385206197225573, 0.7197583685162847], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f545354e-f961-4945-a431-7c8bef0f121e", 1, 0, 0.0, 644.0, 644, 644, 644.0, 644.0, 644.0, 644.0, 1.5527950310559004, 0.28053425854037267, 1.0705793866459627], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 165.6, 142, 429, 148.0, 182.50000000000003, 416.74999999999983, 429.0, 0.12700186692744383, 0.10306499161787677, 0.045145194884364796], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 403.90000000000003, 284, 847, 296.0, 820.8000000000001, 847.0, 847.0, 0.08316492436150129, 0.12888938961103766, 0.18703986406693113], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3d897b1c-5dca-4436-b244-1db6112c0602", 1, 0, 0.0, 280.0, 280, 280, 280.0, 280.0, 280.0, 280.0, 3.571428571428571, 1.1404854910714284, 2.130998883928571], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 479.6000000000001, 284, 1434, 296.0, 1416.6, 1434.0, 1434.0, 0.07804492265748164, 12.55400850917288, 0.1728623902168088], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ae07125f-65ea-404e-807b-0977c1f14c53", 3, 0, 0.0, 414.0, 281, 628, 333.0, 628.0, 628.0, 628.0, 0.06860435866358709, 0.031041685723432962, 0.04399433156486542], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=223c05e0-e365-4320-9e7d-545fd80b3c7e", 1, 0, 0.0, 494.0, 494, 494, 494.0, 494.0, 494.0, 494.0, 2.0242914979757085, 0.36571672570850206, 1.3956540991902835], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6614fcfd-64f6-4e90-ab4c-fbcb81b121fc", 3, 0, 0.0, 365.0, 251, 460, 384.0, 460.0, 460.0, 460.0, 0.02982937596945472, 0.024867523391202323, 0.01912886414707871], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 170.64285714285714, 144, 432, 150.0, 296.0, 432.0, 432.0, 0.08529616045426298, 0.07071917990788015, 0.030320119536476297], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 168.05882352941177, 143, 434, 151.0, 216.3999999999998, 434.0, 434.0, 0.07836846084342904, 0.060842701533716875, 0.027857538815437663], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8a97cc72-0a78-425c-96b0-48692c1c99de", 1, 0, 0.0, 537.0, 537, 537, 537.0, 537.0, 537.0, 537.0, 1.86219739292365, 0.33643214618249534, 1.2838978119180633], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f571065b-f2ae-4cc0-a950-2209ce2441f4", 1, 0, 0.0, 567.0, 567, 567, 567.0, 567.0, 567.0, 567.0, 1.763668430335097, 0.3186315035273369, 1.2159667107583776], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 196.68750000000006, 140, 423, 144.5, 422.3, 423.0, 423.0, 0.10546298249314491, 0.07837629851297195, 0.052937473634254384], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 197.62499999999997, 140, 436, 143.0, 423.40000000000003, 436.0, 436.0, 0.10546298249314491, 0.04801964412834845, 0.05903970186933137], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 408.31249999999994, 138, 1666, 152.0, 1581.3000000000002, 1666.0, 1666.0, 0.10525207872855488, 11.863073315473372, 0.060746072781812446], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 358.62500000000006, 140, 1135, 290.0, 932.0000000000002, 1135.0, 1135.0, 0.10525138635810469, 3.8932477535407224, 0.06084845773827927], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 25.0, 0.3194888178913738], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 6.25, 0.07987220447284345], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 6.25, 0.07987220447284345], "isController": false}, {"data": ["401/Unauthorized", 10, 62.5, 0.7987220447284346], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1252, 16, "401/Unauthorized", 10, "406/Not Acceptable", 4, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
