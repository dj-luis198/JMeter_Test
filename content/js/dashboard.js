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

    var data = {"OkPercent": 99.16222391469917, "KoPercent": 0.8377760853008378};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8095863427445831, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=75349aa3-cec0-4a1c-987d-d0181f992e10"], "isController": false}, {"data": [0.1388888888888889, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3756dd02-17a7-48be-8b9b-bddd4b29b2e5"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=30126f20-725f-435b-b179-c543afeb5e2c"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/76b6bfb7-1675-41eb-a8fe-475c933fb71a"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c775ee11-b9ad-4a7c-80d2-db69c7ba891a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2827f12d-473f-4558-91c0-0953ea0f501b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d3fdb079-df18-47a6-b550-8dbedbdb24d8"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=38b52fd4-6ade-44af-841c-8cd6d9808101"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d2a6d42f-8b52-4476-95e3-39c718776c40"], "isController": false}, {"data": [0.8863636363636364, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d3fdb079-df18-47a6-b550-8dbedbdb24d8"], "isController": false}, {"data": [0.11363636363636363, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3d78f8ae-5a27-493b-8535-a5af92e9f8e1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0000286c-6c1f-49dd-9d40-eb2394cd4f02"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9efea5dc-8f52-4366-aae8-9e8baf5d3009"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/32d6dfc3-7a0e-48cd-869f-9f8170a877fe"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.3409090909090909, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.868421052631579, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.4722222222222222, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3409090909090909, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2827f12d-473f-4558-91c0-0953ea0f501b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/30126f20-725f-435b-b179-c543afeb5e2c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.4318181818181818, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3492063492063492, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d2a6d42f-8b52-4476-95e3-39c718776c40"], "isController": false}, {"data": [0.9907407407407407, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a2cc46ec-a0fd-46de-baf6-0a5c13de6037"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/75349aa3-cec0-4a1c-987d-d0181f992e10"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3756dd02-17a7-48be-8b9b-bddd4b29b2e5"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a2cc46ec-a0fd-46de-baf6-0a5c13de6037"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/38b52fd4-6ade-44af-841c-8cd6d9808101"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c775ee11-b9ad-4a7c-80d2-db69c7ba891a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9efea5dc-8f52-4366-aae8-9e8baf5d3009"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3d78f8ae-5a27-493b-8535-a5af92e9f8e1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/730af4ea-27ef-4989-832e-7a5b07930cfb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=32d6dfc3-7a0e-48cd-869f-9f8170a877fe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f7f7c3cd-c61b-4e46-9565-62fb85b4d5f2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1313, 11, 0.8377760853008378, 339.07920792079176, 106, 1957, 128.0, 879.2000000000003, 1038.3999999999987, 1410.7599999999984, 5.136872415425484, 714.7397297395765, 3.7563096811754946], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=75349aa3-cec0-4a1c-987d-d0181f992e10", 1, 0, 0.0, 312.0, 312, 312, 312.0, 312.0, 312.0, 312.0, 3.205128205128205, 0.5790514823717948, 2.209785657051282], "isController": false}, {"data": ["see books", 54, 0, 0.0, 1643.1111111111106, 1305, 2429, 1672.5, 1916.0, 2003.25, 2429.0, 0.2518374808790061, 303.0455966843147, 1.2382829260017536], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/3756dd02-17a7-48be-8b9b-bddd4b29b2e5", 3, 0, 0.0, 421.6666666666667, 410, 434, 421.0, 434.0, 434.0, 434.0, 0.07817793297545213, 0.035373478787720854, 0.05013363540417991], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=30126f20-725f-435b-b179-c543afeb5e2c", 1, 0, 0.0, 781.0, 781, 781, 781.0, 781.0, 781.0, 781.0, 1.2804097311139564, 0.23132402368758, 0.882782490396927], "isController": false}, {"data": ["deleteBook", 12, 0, 0.0, 454.66666666666663, 402, 685, 430.5, 625.0000000000002, 685.0, 685.0, 0.06475775204256742, 0.011699398562377904, 0.04401503459143254], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 0, 0.0, 454.66666666666663, 402, 685, 430.5, 625.0000000000002, 685.0, 685.0, 0.06428043410719833, 0.011613164365070013, 0.043690607557236374], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 161.83333333333334, 107, 344, 112.5, 341.3, 344.0, 344.0, 0.0980856942015007, 0.03443003697285751, 0.05548184937851814], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 149.38888888888889, 111, 330, 114.5, 320.1, 330.0, 330.0, 0.09808409076047865, 0.07289257135617604, 0.04923361587000589], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 159.5, 106, 554, 111.0, 354.20000000000033, 554.0, 554.0, 0.09808676319130734, 1.6272334321920756, 0.05729178019301295], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 228.55555555555554, 108, 1094, 112.0, 418.10000000000105, 1094.0, 1094.0, 0.0980856942015007, 4.928172876376605, 0.05719536899293238], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/76b6bfb7-1675-41eb-a8fe-475c933fb71a", 2, 0, 0.0, 513.5, 208, 819, 513.5, 819.0, 819.0, 819.0, 0.011531498287572505, 0.022803988312826488, 0.007167772128945214], "isController": false}, {"data": ["goToProfile", 13, 0, 0.0, 303.76923076923083, 188, 819, 225.0, 667.3999999999999, 819.0, 819.0, 0.06266358811705558, 0.14757858706864554, 0.040511030599112104], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/c775ee11-b9ad-4a7c-80d2-db69c7ba891a", 3, 0, 0.0, 717.3333333333334, 239, 1491, 422.0, 1491.0, 1491.0, 1491.0, 0.034322193874632465, 0.02861300081801229, 0.02201000062924022], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 147.6842105263158, 109, 339, 113.0, 336.0, 339.0, 339.0, 0.10726948352566563, 0.0797188251592105, 0.053844252472843884], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 169.0526315789474, 109, 346, 111.0, 338.0, 346.0, 346.0, 0.10726948352566563, 0.04566230790293806, 0.06022881568844426], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 643.8333333333334, 525, 877, 558.0, 877.0, 877.0, 877.0, 0.07125890736342043, 20.952484783254157, 0.04063984560570071], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2827f12d-473f-4558-91c0-0953ea0f501b", 1, 0, 0.0, 370.0, 370, 370, 370.0, 370.0, 370.0, 370.0, 2.7027027027027026, 0.48828125, 1.8633868243243243], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 906.3333333333334, 757, 1148, 880.0, 1148.0, 1148.0, 1148.0, 0.0710631040363843, 63.94270592755117, 0.0404587789582149], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 189.83333333333331, 112, 341, 116.5, 341.0, 341.0, 341.0, 0.07160929966104931, 0.12671489354084117, 0.03965085244903805], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 120.3076923076923, 110, 196, 114.0, 165.99999999999997, 196.0, 196.0, 0.06279980870212118, 0.04667056095929123, 0.03152256022743192], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 128.15384615384613, 107, 329, 112.0, 242.99999999999991, 329.0, 329.0, 0.06282499855019234, 0.016810595315188186, 0.03582988198565657], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 178.61538461538464, 109, 333, 113.0, 331.8, 333.0, 333.0, 0.06276130427645872, 0.016916132793264264, 0.03689678239690249], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 145.3846153846154, 107, 342, 111.0, 338.4, 342.0, 342.0, 0.06282560578382192, 0.016933464058920752, 0.036995937780902946], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 113.66666666666667, 112, 116, 113.5, 116.0, 116.0, 116.0, 0.07161015431988256, 0.053218093200615844, 0.04021078001360592], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 651.9374999999999, 109, 1119, 869.5, 1035.0, 1119.0, 1119.0, 0.0770412315040856, 43.333934089420794, 0.0411538609694676], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 215.8947368421053, 109, 771, 113.0, 758.0, 771.0, 771.0, 0.1072682723033321, 10.18588771199598, 0.06209165721012161], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 529.6875, 107, 901, 549.5, 831.0000000000001, 901.0, 901.0, 0.07699785368482853, 14.157735968344257, 0.04120588263602152], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 226.89473684210526, 107, 780, 112.0, 770.0, 780.0, 780.0, 0.1072682723033321, 3.3459144196786466, 0.06219641138229283], "isController": false}, {"data": ["deleteBooks", 12, 0, 0.0, 579.25, 189, 1263, 549.0, 1135.2000000000005, 1263.0, 1263.0, 0.06421920154126085, 0.011602101840950443, 0.0442761291876271], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d3fdb079-df18-47a6-b550-8dbedbdb24d8", 3, 0, 0.0, 309.3333333333333, 217, 409, 302.0, 409.0, 409.0, 409.0, 0.03185220576524925, 0.026553873360938576, 0.020426056431491212], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=38b52fd4-6ade-44af-841c-8cd6d9808101", 1, 0, 0.0, 1263.0, 1263, 1263, 1263.0, 1263.0, 1263.0, 1263.0, 0.7917656373713381, 0.14304359659540777, 0.5458852929532859], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 301.46153846153845, 224, 456, 229.0, 454.4, 456.0, 456.0, 0.06270136785445565, 0.0971748738134972, 0.14101684586797986], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d2a6d42f-8b52-4476-95e3-39c718776c40", 3, 0, 0.0, 264.3333333333333, 188, 412, 193.0, 412.0, 412.0, 412.0, 0.017638343406787237, 0.024315880315020813, 0.011311047041461866], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 400.22727272727275, 116, 893, 378.5, 808.4999999999998, 891.35, 893.0, 0.09470389964830415, 0.05817261023318683, 0.04282022025113753], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 127.56250000000001, 109, 337, 112.5, 186.50000000000017, 337.0, 337.0, 0.07712404438488754, 0.05731581814150334, 0.038712655091633005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 214.62499999999997, 106, 336, 163.0, 335.3, 336.0, 336.0, 0.07712367262929061, 0.09303419591340939, 0.03993635489422006], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d3fdb079-df18-47a6-b550-8dbedbdb24d8", 1, 0, 0.0, 837.0, 837, 837, 837.0, 837.0, 837.0, 837.0, 1.194743130227001, 0.21584714755077658, 0.823719384707288], "isController": false}, {"data": ["login", 22, 0, 0.0, 2132.727272727273, 1319, 3734, 2078.0, 3095.1, 3645.049999999999, 3734.0, 0.09104867379329468, 29.8312524702126, 0.178548841922948], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/3d78f8ae-5a27-493b-8535-a5af92e9f8e1", 3, 0, 0.0, 289.3333333333333, 218, 410, 240.0, 410.0, 410.0, 410.0, 0.07325649540925963, 0.04709686797958586, 0.04697763540242235], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 127.84210526315789, 108, 337, 117.0, 126.0, 337.0, 337.0, 0.10780692347410648, 0.08727728472659596, 0.038321992328686286], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0000286c-6c1f-49dd-9d40-eb2394cd4f02", 1, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 2.277904328018223, 0.7274167141230068, 1.359179242596811], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9efea5dc-8f52-4366-aae8-9e8baf5d3009", 3, 0, 0.0, 630.6666666666666, 222, 1222, 448.0, 1222.0, 1222.0, 1222.0, 0.024870466321243522, 0.024943329015544042, 0.015948834196891193], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 814.75, 219, 1240, 987.5, 1150.4, 1240.0, 1240.0, 0.07695600521376936, 57.58606033651418, 0.16076966225933212], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/32d6dfc3-7a0e-48cd-869f-9f8170a877fe", 3, 0, 0.0, 276.6666666666667, 189, 424, 217.0, 424.0, 424.0, 424.0, 0.026827392556292812, 0.02690598843292258, 0.017203764106737254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 393.0555555555555, 222, 1221, 233.0, 726.0000000000008, 1221.0, 1221.0, 0.09802373263482347, 6.65850348222503, 0.2190643226287787], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 0, 0.0, 1023.5, 870, 1265, 994.0, 1265.0, 1265.0, 1265.0, 0.07096812348453486, 84.90254819918387, 0.16002480188065527], "isController": false}, {"data": ["register", 22, 6, 27.272727272727273, 840.7272727272729, 123, 1785, 909.5, 1403.7, 1729.6499999999992, 1785.0, 0.08818837035908701, 0.02774676709451388, 0.03978811240810371], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 22, 0, 0.0, 127.59090909090908, 111, 332, 117.0, 135.1, 303.0499999999996, 332.0, 0.11478181021349416, 0.08911283117160924, 0.040801346599328006], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 412.6842105263158, 223, 891, 230.0, 885.0, 891.0, 891.0, 0.10720109232270914, 13.648628628263287, 0.23821056868768936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 419.2142857142857, 222, 1162, 229.5, 1129.5, 1162.0, 1162.0, 0.09977123880246007, 17.184120471989225, 0.2207410820547174], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 144.2857142857143, 108, 336, 114.0, 336.0, 336.0, 336.0, 0.03440733367740667, 0.025570293875494605, 0.01727086866229202], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 236.7142857142857, 107, 341, 314.0, 341.0, 341.0, 341.0, 0.034372529474444025, 0.009197336988278968, 0.019603083215893855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 143.85714285714286, 110, 335, 112.0, 335.0, 335.0, 335.0, 0.034369154175115754, 0.009263561086261668, 0.020205303528730158], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 170.57142857142858, 108, 324, 110.0, 324.0, 324.0, 324.0, 0.03440716455472213, 0.009273806071389952, 0.020261250221188916], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1057.7037037037035, 847, 1957, 889.0, 1427.5, 1542.75, 1957.0, 0.2403268445085316, 287.51445716174, 0.4745516402307138], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, 27.272727272727273, 840.7272727272729, 123, 1785, 909.5, 1403.7, 1729.6499999999992, 1785.0, 0.09143503125415613, 0.02876826622556191, 0.041252914491621225], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 137.75, 108, 332, 109.5, 332.0, 332.0, 332.0, 0.038183788118159735, 0.01029172414122274, 0.02248517991723664], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2827f12d-473f-4558-91c0-0953ea0f501b", 3, 0, 0.0, 363.3333333333333, 255, 440, 395.0, 440.0, 440.0, 440.0, 0.019379970154845962, 0.02671685338729578, 0.012427910548517754], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 166.5, 106, 336, 112.5, 336.0, 336.0, 336.0, 0.03814446261604261, 0.010281124689480234, 0.022424771967634424], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 22, 0, 0.0, 189.54545454545453, 106, 986, 112.0, 336.09999999999997, 889.0999999999987, 986.0, 0.1171752248965396, 4.822622882523848, 0.06842850047669012], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 22, 0, 0.0, 151.27272727272728, 108, 548, 112.0, 333.5, 516.0499999999995, 548.0, 0.11730455461593423, 1.5979725474017041, 0.06861858224115684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 164.125, 108, 327, 112.0, 327.0, 327.0, 327.0, 0.038183241375360354, 0.010217000133641345, 0.021776379846885203], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 22, 0, 0.0, 123.13636363636363, 108, 332, 113.0, 125.3, 301.3999999999996, 332.0, 0.11730142734509547, 0.08717420528282974, 0.058879818022831126], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/30126f20-725f-435b-b179-c543afeb5e2c", 3, 0, 0.0, 459.3333333333333, 230, 672, 476.0, 672.0, 672.0, 672.0, 0.05214670606640014, 0.033050011950286805, 0.03344043325221623], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 141.375, 110, 329, 115.0, 329.0, 329.0, 329.0, 0.0381814190124376, 0.02837505846529786, 0.019165282590227466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 22, 0, 0.0, 151.5, 106, 337, 112.0, 335.2, 337.0, 337.0, 0.11716586425802053, 0.03935000572515018, 0.06637387960142303], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 142.625, 110, 331, 117.0, 331.0, 331.0, 331.0, 0.03903924420023228, 0.03072815510291721, 0.01387723133680132], "isController": false}, {"data": ["deleteAccount", 12, 0, 0.0, 483.33333333333337, 395, 1066, 421.5, 902.5000000000006, 1066.0, 1066.0, 0.06603783968213786, 0.011930664395698735, 0.04494958423676767], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1119.0909090909092, 660, 1904, 1103.0, 1701.2999999999997, 1885.2499999999998, 1904.0, 0.0922064586433077, 0.04772404597749324, 0.04241136916113079], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 337.37499999999994, 225, 666, 234.0, 666.0, 666.0, 666.0, 0.03812192344164725, 0.059081535646381036, 0.08573709930284532], "isController": false}, {"data": ["addBook", 63, 5, 7.936507936507937, 1035.8095238095239, 567, 1847, 963.0, 1651.6, 1677.0, 1847.0, 0.30062415300337847, 92.46950942641628, 1.0943479676852894], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d2a6d42f-8b52-4476-95e3-39c718776c40", 1, 0, 0.0, 615.0, 615, 615, 615.0, 615.0, 615.0, 615.0, 1.6260162601626016, 0.2937627032520325, 1.1210619918699187], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 209.66666666666663, 109, 783, 114.0, 447.0, 454.5, 783.0, 0.24115971025107405, 0.17922122998151108, 0.11657622712332193], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a2cc46ec-a0fd-46de-baf6-0a5c13de6037", 1, 0, 0.0, 483.0, 483, 483, 483.0, 483.0, 483.0, 483.0, 2.070393374741201, 0.37404567805383027, 1.427439182194617], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/75349aa3-cec0-4a1c-987d-d0181f992e10", 3, 0, 0.0, 277.0, 210, 396, 225.0, 396.0, 396.0, 396.0, 0.10222509966947219, 0.0462541954884656, 0.06555450727501959], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 634.0555555555555, 524, 906, 554.0, 864.0, 894.25, 906.0, 0.24145301056133353, 70.99520209952335, 0.12143388714754569], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 151.96296296296305, 108, 419, 115.0, 331.0, 337.25, 419.0, 0.24192789652654265, 0.4280989731504836, 0.11765634030294748], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 842.2222222222222, 730, 1134, 773.5, 1009.5, 1093.25, 1134.0, 0.24121033988323634, 217.0414878294866, 0.12107628388670261], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 145.64285714285717, 112, 329, 116.0, 328.5, 329.0, 329.0, 0.10252654705236178, 0.07659453954595385, 0.03644498352251922], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3756dd02-17a7-48be-8b9b-bddd4b29b2e5", 1, 0, 0.0, 189.0, 189, 189, 189.0, 189.0, 189.0, 189.0, 5.291005291005291, 0.9558945105820106, 3.647900132275132], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 5, 2.7777777777777777, 172.61666666666673, 109, 474, 118.0, 307.40000000000003, 343.0, 463.46999999999997, 0.7507476195044231, 1.523253560316315, 0.3653337007999633], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 119.71428571428572, 115, 128, 118.0, 128.0, 128.0, 128.0, 0.03586010460904802, 0.027770569291967848, 0.012747146560247537], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a2cc46ec-a0fd-46de-baf6-0a5c13de6037", 3, 0, 0.0, 405.6666666666667, 336, 521, 360.0, 521.0, 521.0, 521.0, 0.024107035236449838, 0.024177661316244124, 0.015459264132749409], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/38b52fd4-6ade-44af-841c-8cd6d9808101", 3, 0, 0.0, 643.0, 192, 1066, 671.0, 1066.0, 1066.0, 1066.0, 0.01894692965005021, 0.026119872092435756, 0.012150212047721001], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 130.50000000000003, 114, 352, 117.0, 146.80000000000032, 352.0, 352.0, 0.09844672938087946, 0.07989182823780354, 0.03499473583460949], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c775ee11-b9ad-4a7c-80d2-db69c7ba891a", 1, 0, 0.0, 392.0, 392, 392, 392.0, 392.0, 392.0, 392.0, 2.5510204081632653, 0.46087771045918363, 1.7588089923469388], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9efea5dc-8f52-4366-aae8-9e8baf5d3009", 1, 0, 0.0, 621.0, 621, 621, 621.0, 621.0, 621.0, 621.0, 1.6103059581320451, 0.29092441626409016, 1.1102304750402576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 386.2857142857143, 221, 677, 450.0, 677.0, 677.0, 677.0, 0.03435060187161708, 0.05323672379907842, 0.07725530870149817], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 22, 0, 0.0, 336.7272727272727, 219, 1102, 228.5, 600.5999999999999, 1036.1499999999992, 1102.0, 0.11709477225066797, 6.5407732230203, 0.2619870783257576], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3d78f8ae-5a27-493b-8535-a5af92e9f8e1", 1, 0, 0.0, 425.0, 425, 425, 425.0, 425.0, 425.0, 425.0, 2.352941176470588, 0.4250919117647059, 1.6222426470588236], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/730af4ea-27ef-4989-832e-7a5b07930cfb", 1, 0, 0.0, 274.0, 274, 274, 274.0, 274.0, 274.0, 274.0, 3.6496350364963503, 1.1654596259124086, 2.1776630930656933], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 138.9230769230769, 114, 365, 120.0, 271.79999999999995, 365.0, 365.0, 0.06313529894564052, 0.05234557500473515, 0.022442625797083147], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=32d6dfc3-7a0e-48cd-869f-9f8170a877fe", 1, 0, 0.0, 663.0, 663, 663, 663.0, 663.0, 663.0, 663.0, 1.5082956259426847, 0.2724948152337858, 1.039899132730015], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 114.81250000000001, 110, 120, 115.5, 118.6, 120.0, 120.0, 0.07539843359754202, 0.0585368698340292, 0.026801786942876264], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f7f7c3cd-c61b-4e46-9565-62fb85b4d5f2", 1, 0, 0.0, 190.0, 190, 190, 190.0, 190.0, 190.0, 190.0, 5.263157894736842, 1.6807154605263157, 3.1404194078947367], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 145.57142857142856, 110, 335, 114.0, 334.5, 335.0, 335.0, 0.09985164897866027, 0.07420615710230515, 0.050120847241241585], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 173.07142857142856, 110, 339, 112.5, 336.0, 339.0, 339.0, 0.09985877116649311, 0.04814619324098774, 0.05575262307593546], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 236.50000000000003, 108, 982, 112.5, 878.0, 982.0, 982.0, 0.09985805890198932, 12.85913516234067, 0.05747968066819306], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 241.92857142857142, 109, 826, 112.5, 694.0, 826.0, 826.0, 0.09985805890198932, 4.217582017346771, 0.05757719830383954], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 54.54545454545455, 0.456968773800457], "isController": false}, {"data": ["401/Unauthorized", 5, 45.45454545454545, 0.38080731150038083], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1313, 11, "406/Not Acceptable", 6, "401/Unauthorized", 5, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
