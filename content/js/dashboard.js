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

    var data = {"OkPercent": 98.2905982905983, "KoPercent": 1.7094017094017093};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7408026755852842, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/5b20d03e-a49a-44ab-96c7-f0c35a674f29"], "isController": false}, {"data": [0.5384615384615384, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5384615384615384, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=811d1acb-f0b2-444c-8bfd-f6ec1352460e"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3451f3c1-2ae6-4131-b48a-22cb886b3b74"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/881a085c-3da4-4dfa-b160-1a1aade0140d"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/02fc25de-e993-4ef4-8938-aa48ecb1dbb8"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d12254fb-b778-4bc3-9773-63ea2616beb6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1e60fb33-d386-45be-baf2-e8a775cb0af3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=16eadec4-d951-4928-b492-d654a1785c73"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5357142857142857, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.5384615384615384, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8076923076923077, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3b700092-6828-4ca4-89fe-030ad7f56ebd"], "isController": false}, {"data": [0.65, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a59d42d9-43d1-4e45-88a0-96894a882aae"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4793a839-c0cb-4021-94bf-f012edc13015"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.39285714285714285, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3274d98a-c57c-41ba-a1c9-9e1c7c6e06dc"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5b20d03e-a49a-44ab-96c7-f0c35a674f29"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d2c792af-f463-48be-854c-077ff50b6b6d"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "register"], "isController": true}, {"data": [0.84375, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.6904761904761905, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.29464285714285715, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/811d1acb-f0b2-444c-8bfd-f6ec1352460e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5384615384615384, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.35, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=02fc25de-e993-4ef4-8938-aa48ecb1dbb8"], "isController": false}, {"data": [0.2719298245614035, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/16eadec4-d951-4928-b492-d654a1785c73"], "isController": false}, {"data": [0.9107142857142857, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=881a085c-3da4-4dfa-b160-1a1aade0140d"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3451f3c1-2ae6-4131-b48a-22cb886b3b74"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d12254fb-b778-4bc3-9773-63ea2616beb6"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9235294117647059, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4793a839-c0cb-4021-94bf-f012edc13015"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1e60fb33-d386-45be-baf2-e8a775cb0af3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cef6ecef-da70-42b5-b21c-32db273a221c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3b700092-6828-4ca4-89fe-030ad7f56ebd"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3274d98a-c57c-41ba-a1c9-9e1c7c6e06dc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d2c792af-f463-48be-854c-077ff50b6b6d"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1287, 22, 1.7094017094017093, 439.2905982905982, 125, 2933, 147.0, 1230.2000000000005, 1505.0, 2022.0, 5.044803499611938, 716.0958441924492, 3.6953187165835666], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 2157.857142857143, 1525, 3456, 2073.0, 2571.6, 2688.95, 3456.0, 0.2480949849370902, 298.54200932017545, 1.2198811026936027], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/5b20d03e-a49a-44ab-96c7-f0c35a674f29", 3, 0, 0.0, 524.6666666666666, 238, 668, 668.0, 668.0, 668.0, 668.0, 0.05882237603184251, 0.02764958040038431, 0.037721380463128173], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 599.6923076923077, 127, 1124, 606.0, 999.9999999999999, 1124.0, 1124.0, 0.08411898306620164, 0.01593660421371398, 0.05686498862776056], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 599.6923076923077, 127, 1124, 606.0, 999.9999999999999, 1124.0, 1124.0, 0.08441065132557189, 0.015991861676914985, 0.05706215829919031], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 22, 0, 0.0, 188.27272727272734, 125, 388, 130.0, 386.8, 388.0, 388.0, 0.10722188106169157, 0.028690229893460442, 0.061149979042995975], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 22, 0, 0.0, 156.86363636363637, 126, 434, 129.5, 307.79999999999984, 425.5999999999999, 434.0, 0.10722292621113169, 0.07968422543620235, 0.05382088288332196], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 22, 0, 0.0, 153.81818181818184, 125, 383, 129.0, 307.49999999999983, 382.25, 383.0, 0.10721979082393536, 0.028899084245513827, 0.06313821666682912], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 22, 0, 0.0, 197.95454545454547, 126, 393, 129.5, 380.4, 391.2, 393.0, 0.10722449397349607, 0.02890035189129386, 0.06303627477738732], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=811d1acb-f0b2-444c-8bfd-f6ec1352460e", 1, 0, 0.0, 614.0, 614, 614, 614.0, 614.0, 614.0, 614.0, 1.6286644951140066, 0.2942411441368078, 1.1228878257328991], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 276.0, 126, 424, 255.0, 418.8, 424.0, 424.0, 0.08432961201891578, 0.17673616629475145, 0.05451144166336916], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3451f3c1-2ae6-4131-b48a-22cb886b3b74", 1, 0, 0.0, 541.0, 541, 541, 541.0, 541.0, 541.0, 541.0, 1.8484288354898337, 0.3339446626617375, 1.2744050369685767], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/881a085c-3da4-4dfa-b160-1a1aade0140d", 3, 0, 0.0, 414.6666666666667, 342, 461, 441.0, 461.0, 461.0, 461.0, 0.02140762254079936, 0.029512135892019953, 0.013728195444457924], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 154.93749999999997, 126, 501, 130.5, 250.40000000000026, 501.0, 501.0, 0.07279146156155883, 0.05409599828940065, 0.03653790160414183], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 164.68749999999997, 126, 429, 129.0, 394.00000000000006, 429.0, 429.0, 0.07279245506203282, 0.026310847099448142, 0.04113235772487182], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 846.5, 707, 1032, 794.5, 1032.0, 1032.0, 1032.0, 0.13172627280511098, 38.73189792860436, 0.07512513995916485], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/02fc25de-e993-4ef4-8938-aa48ecb1dbb8", 3, 0, 0.0, 769.6666666666667, 255, 1727, 327.0, 1727.0, 1727.0, 1727.0, 0.025914120604317293, 0.025990040879525254, 0.0166181046844092], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1277.0, 1102, 1509, 1208.5, 1509.0, 1509.0, 1509.0, 0.13100150651732495, 117.87538584037466, 0.07458386552695356], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 218.0, 126, 380, 142.0, 380.0, 380.0, 380.0, 0.13427324605572338, 0.23760070493454177, 0.07434856495468277], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d12254fb-b778-4bc3-9773-63ea2616beb6", 3, 0, 0.0, 420.3333333333333, 255, 609, 397.0, 609.0, 609.0, 609.0, 0.02143239864261475, 0.025332369619574927, 0.013744083764958028], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 175.84615384615384, 127, 430, 129.0, 425.2, 430.0, 430.0, 0.06488839196581879, 0.048222720982410254, 0.032570931123467636], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1e60fb33-d386-45be-baf2-e8a775cb0af3", 3, 0, 0.0, 343.0, 254, 514, 261.0, 514.0, 514.0, 514.0, 0.023276564379097645, 0.023344757438802034, 0.014926703068627072], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 150.07692307692307, 126, 378, 129.0, 283.9999999999999, 378.0, 378.0, 0.06488774420252963, 0.024859337096822497, 0.03658709495073523], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 264.46153846153845, 126, 1394, 128.0, 991.5999999999997, 1394.0, 1394.0, 0.06480493713921097, 4.501630755488479, 0.037669816975902534], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=16eadec4-d951-4928-b492-d654a1785c73", 1, 0, 0.0, 732.0, 732, 732, 732.0, 732.0, 732.0, 732.0, 1.366120218579235, 0.24680882855191258, 0.9418758538251366], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 236.38461538461533, 126, 1007, 129.0, 758.9999999999998, 1007.0, 1007.0, 0.06480526019311968, 1.4818848267207043, 0.03773329114760146], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 137.33333333333334, 128, 144, 139.5, 144.0, 144.0, 144.0, 0.13427024123886674, 0.09978481795193125, 0.07539588741440272], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 234.0625, 127, 1271, 129.0, 644.5000000000007, 1271.0, 1271.0, 0.07278815008916548, 4.111824100895749, 0.04240051907049532], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 1078.5, 128, 2023, 1255.5, 1824.0, 2023.0, 2023.0, 0.06700391972930415, 43.06962043775096, 0.03527801242444111], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 210.50000000000003, 125, 1103, 130.5, 628.4000000000005, 1103.0, 1103.0, 0.07278815008916548, 1.3560258210275866, 0.042471601248316775], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 705.7142857142857, 126, 1137, 762.0, 1134.5, 1137.0, 1137.0, 0.06700103373023471, 14.07696579238294, 0.03534192362360734], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 613.6153846153844, 128, 1650, 511.0, 1504.8, 1650.0, 1650.0, 0.0848985136229461, 0.016084288713722212, 0.058067981260285784], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 463.6923076923077, 255, 1524, 267.0, 1238.7999999999997, 1524.0, 1524.0, 0.06476296753880796, 6.052574141143415, 0.1443788001539366], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3b700092-6828-4ca4-89fe-030ad7f56ebd", 1, 0, 0.0, 472.0, 472, 472, 472.0, 472.0, 472.0, 472.0, 2.1186440677966103, 0.38276284427966106, 1.4607057733050848], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 726.8500000000001, 147, 1874, 637.5, 1766.2000000000014, 1872.0, 1874.0, 0.09973470568288352, 0.06126282214309935, 0.04509489133903816], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 133.42857142857142, 128, 143, 131.5, 142.5, 143.0, 143.0, 0.06700520247536362, 0.04979585848022629, 0.03363347077376651], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 361.2857142857142, 130, 512, 381.0, 463.0, 512.0, 512.0, 0.06700071307901777, 0.08980787545524592, 0.03419204916895187], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a59d42d9-43d1-4e45-88a0-96894a882aae", 1, 0, 0.0, 381.0, 381, 381, 381.0, 381.0, 381.0, 381.0, 2.6246719160104988, 0.8381520669291338, 1.5660884186351707], "isController": false}, {"data": ["login", 20, 0, 0.0, 2722.7, 1840, 4974, 2655.0, 4096.4000000000015, 4933.4, 4974.0, 0.10166165982992005, 36.624595815479005, 0.20395870503377708], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4793a839-c0cb-4021-94bf-f012edc13015", 1, 0, 0.0, 504.0, 504, 504, 504.0, 504.0, 504.0, 504.0, 1.984126984126984, 0.35846044146825395, 1.3679625496031746], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 154.4375, 130, 380, 137.5, 232.30000000000015, 380.0, 380.0, 0.07601058447388799, 0.06153591262583314, 0.027019387449702368], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 1214.7857142857142, 277, 2152, 1387.0, 1953.0, 2152.0, 2152.0, 0.06695905453814992, 57.24844096004936, 0.1383552674057671], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3274d98a-c57c-41ba-a1c9-9e1c7c6e06dc", 3, 0, 0.0, 366.3333333333333, 227, 488, 384.0, 488.0, 488.0, 488.0, 0.017363321719200363, 0.023936740716410655, 0.01113468222227367], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 22, 0, 0.0, 405.04545454545456, 256, 814, 284.0, 694.9999999999998, 806.9499999999999, 814.0, 0.10715190243332229, 0.16606452066570554, 0.2409871399452551], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, 25.0, 1092.6249999999998, 126, 1649, 1284.0, 1649.0, 1649.0, 1649.0, 0.10818705541881914, 97.07923476252941, 0.20088297118843482], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5b20d03e-a49a-44ab-96c7-f0c35a674f29", 1, 0, 0.0, 239.0, 239, 239, 239.0, 239.0, 239.0, 239.0, 4.184100418410042, 0.755916579497908, 2.884741108786611], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d2c792af-f463-48be-854c-077ff50b6b6d", 1, 0, 0.0, 241.0, 241, 241, 241.0, 241.0, 241.0, 241.0, 4.149377593360996, 0.7496434128630706, 2.8608013485477177], "isController": false}, {"data": ["register", 23, 8, 34.78260869565217, 1065.5217391304345, 379, 2874, 1034.0, 2170.2000000000016, 2810.599999999999, 2874.0, 0.09339342997523044, 0.029137861899541154, 0.04213648891460592], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 410.5625, 257, 1773, 269.0, 919.7000000000008, 1773.0, 1773.0, 0.07274512834968583, 5.544973432399316, 0.1624422159302738], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 152.84615384615387, 128, 387, 131.0, 290.19999999999993, 387.0, 387.0, 0.06771961993665611, 0.05257529086879063, 0.024072208649358228], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 21, 0, 0.0, 474.2380952380953, 257, 1505, 505.0, 751.2000000000002, 1434.699999999999, 1505.0, 0.1307604655072572, 7.642287623210605, 0.29249019491092726], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 5, 0, 0.0, 181.6, 128, 396, 128.0, 396.0, 396.0, 396.0, 0.034011985823804304, 0.02527648555851082, 0.01707242257171427], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 5, 0, 0.0, 229.0, 127, 381, 130.0, 381.0, 381.0, 381.0, 0.03395355154149124, 0.019284556227081355, 0.018793821302458238], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 5, 0, 0.0, 309.6, 128, 1012, 137.0, 1012.0, 1012.0, 1012.0, 0.03380868342225017, 6.091512551896329, 0.01929472128121387], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 5, 0, 0.0, 398.4, 126, 1099, 129.0, 1099.0, 1099.0, 1099.0, 0.033788806444201167, 1.9942919091013527, 0.01931637430901891], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 128.0, 128, 128, 128.0, 128.0, 128.0, 128.0, 7.8125, 2.3040771484375, 4.82940673828125], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1486.0178571428573, 1005, 2933, 1393.0, 2032.8000000000002, 2115.45, 2933.0, 0.24716314091388572, 295.69304434371566, 0.4880506552030048], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, 34.78260869565217, 1065.5217391304345, 379, 2874, 1034.0, 2170.2000000000016, 2810.599999999999, 2874.0, 0.0906836363349617, 0.028292432056271168, 0.0409139062370628], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 128.55555555555554, 126, 133, 128.0, 133.0, 133.0, 133.0, 0.057535560172606685, 0.015507631452772893, 0.03388080350007991], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 158.66666666666666, 127, 376, 128.0, 376.0, 376.0, 376.0, 0.05744631960579059, 0.015483578331248244, 0.03377215273699798], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/811d1acb-f0b2-444c-8bfd-f6ec1352460e", 3, 0, 0.0, 414.3333333333333, 233, 599, 411.0, 599.0, 599.0, 599.0, 0.02155435649468685, 0.025476519671942695, 0.013822292413584993], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 171.46153846153845, 126, 430, 128.0, 409.2, 430.0, 430.0, 0.06902447183005113, 0.01860425217294347, 0.040578839884463654], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 168.6153846153846, 125, 378, 129.0, 378.0, 378.0, 378.0, 0.06902373885664831, 0.01860405461370599, 0.04064581497124896], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 131.76923076923077, 126, 148, 129.0, 145.2, 148.0, 148.0, 0.06902227295654252, 0.05129487277336802, 0.034645945605139505], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 131.22222222222223, 127, 143, 129.0, 143.0, 143.0, 143.0, 0.057535560172606685, 0.01539525731181077, 0.03281324916093974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 170.23076923076923, 126, 381, 130.0, 380.6, 381.0, 381.0, 0.06902447183005113, 0.0184694387514004, 0.039365519090576034], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 131.44444444444446, 127, 145, 129.0, 145.0, 145.0, 145.0, 0.05753666364066436, 0.04275918069389217, 0.028880708116505352], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 143.0, 128, 160, 145.0, 160.0, 160.0, 160.0, 0.05426393980320278, 0.04271165574353656, 0.01928913485191974], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 693.4615384615385, 126, 1727, 599.0, 1468.6, 1727.0, 1727.0, 0.08386122901856559, 0.01571138109767898, 0.05707502515836871], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1310.8000000000002, 876, 2391, 1148.0, 1939.6000000000004, 2369.4999999999995, 2391.0, 0.09873861420354965, 0.051104946804571595, 0.045415905556515514], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 292.6666666666667, 257, 504, 261.0, 504.0, 504.0, 504.0, 0.057398691309838136, 0.08895676084835266, 0.12909100203765353], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=02fc25de-e993-4ef4-8938-aa48ecb1dbb8", 1, 0, 0.0, 555.0, 555, 555, 555.0, 555.0, 555.0, 555.0, 1.8018018018018018, 0.3255208333333333, 1.2422578828828827], "isController": false}, {"data": ["addBook", 57, 10, 17.54385964912281, 1300.9649122807016, 640, 3610, 1023.0, 2327.6000000000004, 2805.1, 3610.0, 0.2637985134722363, 78.5672719834987, 0.959293206551922], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/16eadec4-d951-4928-b492-d654a1785c73", 3, 0, 0.0, 355.3333333333333, 234, 485, 347.0, 485.0, 485.0, 485.0, 0.04366494432719598, 0.028072351903063824, 0.02800128265773961], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 242.1964285714286, 127, 619, 141.5, 514.8000000000001, 566.05, 619.0, 0.24868331068538896, 0.18481249944490333, 0.12021312381764408], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=881a085c-3da4-4dfa-b160-1a1aade0140d", 1, 0, 0.0, 1650.0, 1650, 1650, 1650.0, 1650.0, 1650.0, 1650.0, 0.6060606060606061, 0.10949337121212122, 0.4178503787878788], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3451f3c1-2ae6-4131-b48a-22cb886b3b74", 3, 0, 0.0, 504.33333333333337, 331, 849, 333.0, 849.0, 849.0, 849.0, 0.0268211565282695, 0.026899734135285912, 0.01719976509137074], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d12254fb-b778-4bc3-9773-63ea2616beb6", 1, 0, 0.0, 1287.0, 1287, 1287, 1287.0, 1287.0, 1287.0, 1287.0, 0.777000777000777, 0.14037611693861696, 0.5357056138306139], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 814.857142857143, 627, 1288, 754.0, 1079.0000000000002, 1112.15, 1288.0, 0.2480697075878322, 72.94073072033241, 0.12476162051536482], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 215.39285714285714, 126, 515, 141.5, 394.0, 425.4, 515.0, 0.24913137676227085, 0.44084575653636204, 0.12115959533946374], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1242.7321428571424, 873, 2388, 1252.5, 1547.2, 1599.3, 2388.0, 0.24775910735933038, 222.93408031598133, 0.12436345818622636], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 21, 0, 0.0, 159.4761904761905, 127, 383, 135.0, 336.20000000000016, 383.0, 383.0, 0.12959123222748817, 0.09681376235744964, 0.04606563333086493], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 10, 5.882352941176471, 212.53529411764714, 128, 2022, 135.5, 362.20000000000005, 411.79999999999995, 1867.2199999999982, 0.698918321115967, 1.547031293040007, 0.33435500888037395], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 5, 0, 0.0, 189.4, 130, 382, 146.0, 382.0, 382.0, 382.0, 0.034959167692135584, 0.02707287107408547, 0.012426891640563821], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 22, 0, 0.0, 155.22727272727275, 129, 437, 133.0, 240.99999999999991, 412.99999999999966, 437.0, 0.10833862715261465, 0.08791933512092068, 0.03851099637065599], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4793a839-c0cb-4021-94bf-f012edc13015", 3, 0, 0.0, 511.66666666666663, 255, 821, 459.0, 821.0, 821.0, 821.0, 0.0349454850433324, 0.029132613019522878, 0.022409702322709908], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 5, 0, 0.0, 584.0, 257, 1228, 270.0, 1228.0, 1228.0, 1228.0, 0.03375937666686923, 8.1194465825383, 0.07419809875630456], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 346.0, 253, 556, 280.0, 537.1999999999999, 556.0, 556.0, 0.06897210343693297, 0.10689328921329358, 0.15511987716333656], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1e60fb33-d386-45be-baf2-e8a775cb0af3", 1, 0, 0.0, 503.0, 503, 503, 503.0, 503.0, 503.0, 503.0, 1.9880715705765406, 0.3591730864811133, 1.3706821570576542], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 133.76923076923075, 128, 148, 130.0, 146.4, 148.0, 148.0, 0.06286449316711318, 0.052121049510624094, 0.022346362805497257], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cef6ecef-da70-42b5-b21c-32db273a221c", 1, 0, 0.0, 221.0, 221, 221, 221.0, 221.0, 221.0, 221.0, 4.524886877828055, 1.4449589932126696, 2.699908088235294], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 137.57142857142858, 129, 161, 134.0, 154.0, 161.0, 161.0, 0.06669938112502799, 0.05178321093202857, 0.023709545634287295], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3b700092-6828-4ca4-89fe-030ad7f56ebd", 3, 0, 0.0, 568.6666666666667, 234, 1081, 391.0, 1081.0, 1081.0, 1081.0, 0.06589930586064494, 0.029817719774185045, 0.04225964601089535], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3274d98a-c57c-41ba-a1c9-9e1c7c6e06dc", 1, 0, 0.0, 511.0, 511, 511, 511.0, 511.0, 511.0, 511.0, 1.9569471624266144, 0.35355002446183953, 1.349223336594912], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 21, 0, 0.0, 142.47619047619048, 127, 383, 128.0, 143.0, 358.99999999999966, 383.0, 0.13106896099762202, 0.09740574152264685, 0.0657904745632595], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 21, 0, 0.0, 214.57142857142858, 126, 419, 131.0, 383.0, 415.49999999999994, 419.0, 0.13106896099762202, 0.04444544566567429, 0.07422608849651419], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 21, 0, 0.0, 241.0, 125, 1377, 131.0, 413.6, 1280.6999999999987, 1377.0, 0.1308647668426071, 5.640847148783893, 0.076398636669554], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d2c792af-f463-48be-854c-077ff50b6b6d", 3, 0, 0.0, 460.6666666666667, 371, 587, 424.0, 587.0, 587.0, 587.0, 0.06512678013199028, 0.030188976207016324, 0.04176424376953804], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 21, 0, 0.0, 269.14285714285717, 126, 994, 130.0, 418.8, 936.5999999999992, 994.0, 0.13106896099762202, 1.8688176214416337, 0.07664584191522959], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 36.36363636363637, 0.6216006216006216], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 4.545454545454546, 0.0777000777000777], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.545454545454546, 0.0777000777000777], "isController": false}, {"data": ["401/Unauthorized", 12, 54.54545454545455, 0.9324009324009324], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1287, 22, "401/Unauthorized", 12, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
