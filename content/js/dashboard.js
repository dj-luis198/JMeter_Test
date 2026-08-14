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

    var data = {"OkPercent": 98.24, "KoPercent": 1.76};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7194787379972565, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/42e3d6b6-94a8-4261-8242-ae1753cedaca"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e0d3cea0-db1a-4ed0-a67e-ba67e6175383"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e1853625-8942-42b1-ab1b-45a0a344ae15"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e45c4a44-5c7e-4aba-89ca-07925085eb1c"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9a0da8f0-3cea-4652-b10e-1449e1e60e20"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.42857142857142855, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4021b205-2758-4144-99b1-fca31bd64d02"], "isController": false}, {"data": [0.75, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4163dede-83f8-42a3-bdf5-6ab5c08406e4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6cabdfdc-d5ff-48fd-b48b-519eb18b6a91"], "isController": false}, {"data": [0.5625, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5384615384615384, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f77dd5c2-7b62-47a8-89d5-e942e35b2ccd"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3469abe8-00a2-4c01-85e1-64509c245f14"], "isController": false}, {"data": [0.4782608695652174, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d7903e56-8e25-42d0-9438-4737e8606e1e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=344629cb-404c-42f0-bb5b-e519b74c24a2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e1cc0fcd-e160-481b-a9a3-5a11e7d98960"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/e02ae662-8910-4388-9a03-11a73d9cede3"], "isController": false}, {"data": [0.34375, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e1853625-8942-42b1-ab1b-45a0a344ae15"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.05555555555555555, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f7d2c5f3-15a5-4e60-91a3-86a2f4abb154"], "isController": false}, {"data": [0.1956521739130435, 500, 1500, "register"], "isController": true}, {"data": [0.825, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8055555555555556, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/698c1800-4f3d-4cf2-b6b7-1a75a6e2e3f8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.2777777777777778, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.1956521739130435, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/e0d3cea0-db1a-4ed0-a67e-ba67e6175383"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/e1cc0fcd-e160-481b-a9a3-5a11e7d98960"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e9c63e92-8e00-4a6b-9b98-d404990dfcce"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=42e3d6b6-94a8-4261-8242-ae1753cedaca"], "isController": false}, {"data": [0.2391304347826087, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4163dede-83f8-42a3-bdf5-6ab5c08406e4"], "isController": false}, {"data": [0.2777777777777778, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e02ae662-8910-4388-9a03-11a73d9cede3"], "isController": false}, {"data": [0.9074074074074074, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9814814814814815, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.39814814814814814, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/e45c4a44-5c7e-4aba-89ca-07925085eb1c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6cabdfdc-d5ff-48fd-b48b-519eb18b6a91"], "isController": false}, {"data": [0.9197530864197531, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/344629cb-404c-42f0-bb5b-e519b74c24a2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3469abe8-00a2-4c01-85e1-64509c245f14"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f77dd5c2-7b62-47a8-89d5-e942e35b2ccd"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/f7d2c5f3-15a5-4e60-91a3-86a2f4abb154"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1250, 22, 1.76, 479.85199999999975, 125, 3732, 153.0, 1356.4000000000015, 1617.7500000000007, 2336.84, 4.912904037228022, 699.0869383199637, 3.585963200629245], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/42e3d6b6-94a8-4261-8242-ae1753cedaca", 3, 0, 0.0, 1038.3333333333333, 224, 2322, 569.0, 2322.0, 2322.0, 2322.0, 0.06401092453111998, 0.028963276399172126, 0.04104867230674035], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e0d3cea0-db1a-4ed0-a67e-ba67e6175383", 1, 0, 0.0, 525.0, 525, 525, 525.0, 525.0, 525.0, 525.0, 1.9047619047619047, 0.3441220238095238, 1.3132440476190477], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e1853625-8942-42b1-ab1b-45a0a344ae15", 3, 0, 0.0, 387.3333333333333, 264, 599, 299.0, 599.0, 599.0, 599.0, 0.03576409999642359, 0.022992870277648632, 0.02293466047947737], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e45c4a44-5c7e-4aba-89ca-07925085eb1c", 1, 0, 0.0, 954.0, 954, 954, 954.0, 954.0, 954.0, 954.0, 1.0482180293501049, 0.1893753275681342, 0.7226971960167715], "isController": false}, {"data": ["see books", 54, 0, 0.0, 2192.4259259259256, 1695, 3126, 2105.0, 2664.0, 2931.75, 3126.0, 0.230385255343658, 277.23176133394134, 1.1328025006399591], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/9a0da8f0-3cea-4652-b10e-1449e1e60e20", 1, 0, 0.0, 212.0, 212, 212, 212.0, 212.0, 212.0, 212.0, 4.716981132075471, 1.5063015919811322, 2.8145268278301887], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 754.1428571428571, 133, 1306, 752.5, 1299.0, 1306.0, 1306.0, 0.07756490520460514, 0.015279247509612508, 0.05218966766208295], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 754.1428571428571, 133, 1306, 752.5, 1299.0, 1306.0, 1306.0, 0.07976753461341235, 0.015713136003646516, 0.05367171030140733], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 205.27777777777771, 127, 407, 132.5, 406.1, 407.0, 407.0, 0.0926822235495232, 0.048000461480238094, 0.05156052084835129], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 159.9444444444444, 128, 390, 132.5, 378.3, 390.0, 390.0, 0.09280598907982862, 0.06897007586889607, 0.04658425623733585], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 309.0, 126, 1040, 131.5, 1007.6, 1040.0, 1040.0, 0.0926807919058775, 4.5626886601189405, 0.05324921800581829], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 363.0555555555555, 126, 1432, 133.0, 1425.7, 1432.0, 1432.0, 0.09280694608432026, 13.938820847469207, 0.0532310673829988], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4021b205-2758-4144-99b1-fca31bd64d02", 1, 0, 0.0, 325.0, 325, 325, 325.0, 325.0, 325.0, 325.0, 3.076923076923077, 0.9825721153846153, 1.8359375], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 347.71428571428567, 129, 678, 330.0, 618.0, 678.0, 678.0, 0.0772009153822824, 0.14529022719126528, 0.049898415313353005], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 132.24999999999997, 127, 135, 133.0, 135.0, 135.0, 135.0, 0.11242523721725053, 0.0835503960178981, 0.05643219915006521], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 170.1, 127, 398, 132.0, 396.50000000000006, 398.0, 398.0, 0.11242902917533307, 0.030083548822305923, 0.06411968070155714], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 840.1666666666667, 750, 1006, 767.0, 1006.0, 1006.0, 1006.0, 0.04571080298643913, 13.440493819518514, 0.026069442328203567], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1411.5, 1031, 1561, 1473.0, 1561.0, 1561.0, 1561.0, 0.045613154833854086, 41.042796898875636, 0.02596920826966497], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 218.16666666666666, 129, 397, 134.0, 397.0, 397.0, 397.0, 0.045927388798309876, 0.08126994970950926, 0.02543049750843916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 149.00000000000003, 127, 383, 132.0, 239.00000000000009, 383.0, 383.0, 0.07210810447022176, 0.05358815185726441, 0.036194888376654286], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 180.93333333333334, 126, 398, 130.0, 387.8, 398.0, 398.0, 0.07210879775405131, 0.02651500584081262, 0.040720814565015695], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 222.20000000000002, 127, 1508, 130.0, 686.6000000000005, 1508.0, 1508.0, 0.07211053102195045, 4.343819143483131, 0.041979971900929745], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 191.13333333333333, 126, 781, 130.0, 546.4000000000001, 781.0, 781.0, 0.07211053102195045, 1.4316663331554607, 0.04205039234138087], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4163dede-83f8-42a3-bdf5-6ab5c08406e4", 1, 0, 0.0, 684.0, 684, 684, 684.0, 684.0, 684.0, 684.0, 1.461988304093567, 0.2641287463450292, 1.0079724049707601], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 132.0, 128, 140, 131.0, 140.0, 140.0, 140.0, 0.0459266857007264, 0.03413106232251249, 0.025788910427653987], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6cabdfdc-d5ff-48fd-b48b-519eb18b6a91", 1, 0, 0.0, 259.0, 259, 259, 259.0, 259.0, 259.0, 259.0, 3.8610038610038613, 0.6975446428571428, 2.6619811776061777], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 960.3125, 127, 1828, 1261.0, 1699.9, 1828.0, 1828.0, 0.08406981998549795, 47.287354667582676, 0.04490839016803455], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 168.45000000000002, 126, 393, 129.0, 390.7, 392.9, 393.0, 0.11242776516088412, 0.030302796078519552, 0.0660952291277854], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 631.75, 129, 1039, 775.5, 1036.9, 1039.0, 1039.0, 0.08406672796532248, 15.457502791278078, 0.044988834887692106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 143.45000000000002, 126, 401, 131.0, 132.0, 387.54999999999984, 401.0, 0.11243092525029934, 0.030303647821369746, 0.0662068827401665], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 670.4615384615385, 137, 1370, 557.0, 1271.6, 1370.0, 1370.0, 0.08933050224356992, 0.016923942807863836, 0.06109932564060278], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 408.79999999999995, 257, 1640, 264.0, 1120.4000000000003, 1640.0, 1640.0, 0.0720620309962816, 5.851652727667977, 0.16084001358369285], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f77dd5c2-7b62-47a8-89d5-e942e35b2ccd", 3, 0, 0.0, 445.0, 354, 511, 470.0, 511.0, 511.0, 511.0, 0.05377114998566103, 0.034569668366432466, 0.03448215021866934], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3469abe8-00a2-4c01-85e1-64509c245f14", 3, 0, 0.0, 340.0, 240, 531, 249.0, 531.0, 531.0, 531.0, 0.04371712108185302, 0.028105896528860586, 0.028034742360433088], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 996.0869565217389, 215, 2089, 887.0, 2023.0, 2076.6, 2089.0, 0.10180234410962785, 0.06253288520015227, 0.04602977082300556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 151.87500000000003, 127, 384, 133.0, 244.00000000000014, 384.0, 384.0, 0.08406584457276162, 0.0624747145701871, 0.042197113389061985], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 353.4375, 127, 512, 391.5, 446.20000000000005, 512.0, 512.0, 0.08406672796532248, 0.10140959542887168, 0.04353162353868383], "isController": false}, {"data": ["login", 23, 0, 0.0, 3818.260869565218, 1554, 6427, 3711.0, 6044.0, 6361.999999999999, 6427.0, 0.10089400865056457, 31.626090642300035, 0.19587197509892001], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d7903e56-8e25-42d0-9438-4737e8606e1e", 1, 0, 0.0, 218.0, 218, 218, 218.0, 218.0, 218.0, 218.0, 4.587155963302752, 1.46484375, 2.7370627866972477], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=344629cb-404c-42f0-bb5b-e519b74c24a2", 1, 0, 0.0, 1370.0, 1370, 1370, 1370.0, 1370.0, 1370.0, 1370.0, 0.7299270072992701, 0.13187157846715328, 0.5032504562043795], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 175.99999999999997, 130, 396, 136.0, 385.7, 395.5, 396.0, 0.10919832052983025, 0.08840371847580984, 0.0388165905008381], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e1cc0fcd-e160-481b-a9a3-5a11e7d98960", 1, 0, 0.0, 705.0, 705, 705, 705.0, 705.0, 705.0, 705.0, 1.4184397163120568, 0.2562610815602837, 0.9779476950354611], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e02ae662-8910-4388-9a03-11a73d9cede3", 3, 0, 0.0, 580.6666666666666, 497, 678, 567.0, 678.0, 678.0, 678.0, 0.017533298656364882, 0.02417106764638843, 0.011243684359713155], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 1163.8125, 268, 1961, 1391.0, 1830.1000000000001, 1961.0, 1961.0, 0.0840071406069516, 62.86241410598026, 0.17550026908537225], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e1853625-8942-42b1-ab1b-45a0a344ae15", 1, 0, 0.0, 531.0, 531, 531, 531.0, 531.0, 531.0, 531.0, 1.8832391713747645, 0.34023363935969864, 1.298405131826742], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 577.5555555555555, 263, 1802, 271.0, 1588.7000000000003, 1802.0, 1802.0, 0.09261879647019476, 18.586997551068976, 0.2043522794514909], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 3, 33.333333333333336, 1079.4444444444443, 129, 1701, 1558.0, 1701.0, 1701.0, 1701.0, 0.06068574896328512, 48.406248419641955, 0.10451434543676881], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f7d2c5f3-15a5-4e60-91a3-86a2f4abb154", 1, 0, 0.0, 518.0, 518, 518, 518.0, 518.0, 518.0, 518.0, 1.9305019305019306, 0.3487723214285714, 1.3309905888030888], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 1445.652173913043, 209, 3732, 1342.0, 2968.600000000001, 3625.3999999999987, 3732.0, 0.09681234820455187, 0.030500493532514217, 0.04367900866260055], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 356.49999999999994, 259, 535, 267.5, 531.7, 534.85, 535.0, 0.11234187880558115, 0.17410797037544656, 0.2526595184465365], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 11, 0, 0.0, 136.72727272727272, 130, 155, 135.0, 152.8, 155.0, 155.0, 0.10300397033485655, 0.079968902750206, 0.036614692579968536], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 380.6111111111111, 257, 789, 269.0, 562.2000000000004, 789.0, 789.0, 0.09703870226908831, 0.15039103564554998, 0.21824231574776407], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/698c1800-4f3d-4cf2-b6b7-1a75a6e2e3f8", 1, 0, 0.0, 281.0, 281, 281, 281.0, 281.0, 281.0, 281.0, 3.558718861209964, 1.1364268238434163, 2.123415258007117], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 167.57142857142856, 128, 378, 130.0, 378.0, 378.0, 378.0, 0.043114333052063636, 0.032041022902949634, 0.02164137420777413], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 128.7142857142857, 125, 138, 128.0, 138.0, 138.0, 138.0, 0.04311459860308701, 0.01153652345434164, 0.02458879451582306], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 205.57142857142856, 127, 394, 130.0, 394.0, 394.0, 394.0, 0.04311486415738157, 0.011620803229919253, 0.02534682443627315], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 167.28571428571428, 127, 395, 130.0, 395.0, 395.0, 395.0, 0.04311459860308701, 0.011620731654738294, 0.025388772419591272], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 137.0, 137, 137, 137.0, 137.0, 137.0, 137.0, 7.299270072992701, 2.152714416058394, 4.512146441605839], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1511.574074074074, 1016, 2551, 1431.0, 2105.0, 2333.0, 2551.0, 0.2325020666850372, 278.15330255192544, 0.45910076058314964], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 1445.652173913043, 209, 3732, 1342.0, 2968.600000000001, 3625.3999999999987, 3732.0, 0.10129035099308584, 0.03191127735940459, 0.04569935757695865], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e0d3cea0-db1a-4ed0-a67e-ba67e6175383", 3, 0, 0.0, 552.6666666666666, 356, 744, 558.0, 744.0, 744.0, 744.0, 0.0206456585620987, 0.02440246947883476, 0.013239566200304179], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 3, 0, 0.0, 131.33333333333334, 129, 133, 132.0, 133.0, 133.0, 133.0, 0.016063654909856125, 0.004329656987422158, 0.009459359287737541], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 3, 0, 0.0, 128.33333333333334, 128, 129, 128.0, 129.0, 129.0, 129.0, 0.016063740923986377, 0.004329680170918203, 0.009443722691640429], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e1cc0fcd-e160-481b-a9a3-5a11e7d98960", 3, 0, 0.0, 1450.6666666666667, 306, 3504, 542.0, 3504.0, 3504.0, 3504.0, 0.037511253376012806, 0.024116121555216564, 0.024055068082924878], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 11, 0, 0.0, 155.36363636363637, 126, 393, 131.0, 343.20000000000016, 393.0, 393.0, 0.10456770759066496, 0.028184264936546417, 0.06147437497029327], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 11, 0, 0.0, 198.45454545454547, 127, 384, 130.0, 383.4, 384.0, 384.0, 0.10457068978629552, 0.02818506873146247, 0.06157824798939083], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 3, 0, 0.0, 130.33333333333334, 128, 132, 131.0, 132.0, 132.0, 132.0, 0.016063396872992075, 0.004298213616406083, 0.009161156029128294], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 11, 0, 0.0, 177.27272727272728, 129, 382, 132.0, 382.0, 382.0, 382.0, 0.10431780894667463, 0.07752524668790957, 0.05236265019393629], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 3, 0, 0.0, 129.33333333333334, 128, 132, 128.0, 132.0, 132.0, 132.0, 0.01606331086254625, 0.01193767535781025, 0.008063029085301536], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 11, 0, 0.0, 226.81818181818178, 127, 398, 134.0, 397.8, 398.0, 398.0, 0.10456770759066496, 0.027980031132658397, 0.05963627073530111], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 3, 0, 0.0, 136.33333333333334, 132, 141, 136.0, 141.0, 141.0, 141.0, 0.017023401502598904, 0.013399278917084685, 0.006051287252876954], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 540.3846153846155, 133, 925, 531.0, 852.5999999999999, 925.0, 925.0, 0.09278887675495885, 0.01738397375502309, 0.06315108348857626], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/e9c63e92-8e00-4a6b-9b98-d404990dfcce", 1, 0, 0.0, 249.0, 249, 249, 249.0, 249.0, 249.0, 249.0, 4.016064257028112, 1.2824736445783134, 2.3963039658634537], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=42e3d6b6-94a8-4261-8242-ae1753cedaca", 1, 0, 0.0, 313.0, 313, 313, 313.0, 313.0, 313.0, 313.0, 3.1948881789137378, 0.5772014776357828, 2.2027256389776357], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1819.0869565217392, 772, 3582, 1611.0, 3388.600000000001, 3578.6, 3582.0, 0.09951712559926616, 0.05150788727305768, 0.04577399038794371], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 3, 0, 0.0, 263.0, 261, 267, 261.0, 267.0, 267.0, 267.0, 0.016051879675109956, 0.024877278363671384, 0.036101053605252176], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4163dede-83f8-42a3-bdf5-6ab5c08406e4", 3, 0, 0.0, 352.0, 242, 453, 361.0, 453.0, 453.0, 453.0, 0.021139265480988753, 0.024985896146311904, 0.013556104491389272], "isController": false}, {"data": ["addBook", 54, 10, 18.51851851851852, 1357.8703703703702, 654, 3415, 1086.0, 2417.5, 2596.5, 3415.0, 0.26667588509232415, 83.77341573998855, 0.9687207937434874], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e02ae662-8910-4388-9a03-11a73d9cede3", 1, 0, 0.0, 1039.0, 1039, 1039, 1039.0, 1039.0, 1039.0, 1039.0, 0.9624639076034649, 0.17388263955726663, 0.6635737487969202], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 233.64814814814807, 127, 779, 133.0, 517.0, 535.25, 779.0, 0.2339009039836789, 0.17382674602693327, 0.11306733151554792], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 821.4074074074076, 625, 1263, 763.0, 1096.0, 1180.0, 1263.0, 0.23406007541935764, 68.8214336992328, 0.11771576058688396], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 204.72222222222223, 127, 531, 133.0, 397.5, 460.5, 531.0, 0.23432008123096149, 0.4146367062407248, 0.11395644575490119], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1275.7962962962968, 883, 1949, 1291.0, 1593.0, 1810.75, 1949.0, 0.23331576264009748, 209.93793334892374, 0.11711357616895518], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 167.66666666666669, 132, 387, 137.0, 385.2, 387.0, 387.0, 0.09962309263287229, 0.07442545494545635, 0.03541289620934132], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e45c4a44-5c7e-4aba-89ca-07925085eb1c", 3, 0, 0.0, 421.6666666666667, 227, 532, 506.0, 532.0, 532.0, 532.0, 0.03793962540943179, 0.030838295783642965, 0.02432977280487651], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6cabdfdc-d5ff-48fd-b48b-519eb18b6a91", 3, 0, 0.0, 399.3333333333333, 356, 461, 381.0, 461.0, 461.0, 461.0, 0.06645548590036107, 0.030848151983696254, 0.042616310945218526], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 162, 10, 6.172839506172839, 211.7469135802469, 129, 1359, 138.0, 426.70000000000005, 487.04999999999995, 940.050000000003, 0.6577745295084962, 1.4663247419148548, 0.31404562422599835], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 212.57142857142858, 132, 397, 143.0, 397.0, 397.0, 397.0, 0.04276193210626951, 0.03311544156276535, 0.015200530553400489], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 191.66666666666669, 132, 585, 135.5, 442.80000000000024, 585.0, 585.0, 0.09521240300236444, 0.07726709657711411, 0.03384503387974674], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 376.2857142857143, 256, 773, 263.0, 773.0, 773.0, 773.0, 0.0430803695064836, 0.06676615860038033, 0.09688876071624192], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 11, 0, 0.0, 450.4545454545455, 263, 776, 513.0, 773.6, 776.0, 776.0, 0.10418837257762034, 0.16147162820379246, 0.2343220918420504], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/344629cb-404c-42f0-bb5b-e519b74c24a2", 3, 0, 0.0, 692.6666666666666, 366, 925, 787.0, 925.0, 925.0, 925.0, 0.017572118904671256, 0.024224584492605068, 0.011268578854883585], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3469abe8-00a2-4c01-85e1-64509c245f14", 1, 0, 0.0, 1124.0, 1124, 1124, 1124.0, 1124.0, 1124.0, 1124.0, 0.889679715302491, 0.16073315169039146, 0.6133924599644127], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 154.26666666666665, 128, 380, 137.0, 244.4000000000001, 380.0, 380.0, 0.07536590145154726, 0.062485986652698854, 0.02679022278160469], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 161.06249999999997, 130, 406, 137.5, 282.10000000000014, 406.0, 406.0, 0.08561414773791369, 0.06646801508949354, 0.03043315407871151], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f77dd5c2-7b62-47a8-89d5-e942e35b2ccd", 1, 0, 0.0, 557.0, 557, 557, 557.0, 557.0, 557.0, 557.0, 1.7953321364452424, 0.32435199730700176, 1.2377973518850987], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f7d2c5f3-15a5-4e60-91a3-86a2f4abb154", 3, 0, 0.0, 1327.6666666666667, 278, 3110, 595.0, 3110.0, 3110.0, 3110.0, 0.020247013565499086, 0.023931284588648176, 0.01298392471485456], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 146.16666666666669, 128, 393, 131.0, 163.50000000000037, 393.0, 393.0, 0.0971088536299829, 0.07216781016837596, 0.04874409254473751], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 188.77777777777777, 127, 399, 131.5, 391.8, 399.0, 399.0, 0.09710937752889004, 0.02598434515909753, 0.0553826918719451], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 203.44444444444449, 126, 404, 131.5, 395.90000000000003, 404.0, 404.0, 0.09710623422023694, 0.026173164692173238, 0.05708784472713148], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 188.72222222222226, 126, 395, 131.0, 393.2, 395.0, 395.0, 0.09710623422023694, 0.026173164692173238, 0.05718267503398718], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 27.272727272727273, 0.48], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 9.090909090909092, 0.16], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.545454545454546, 0.08], "isController": false}, {"data": ["401/Unauthorized", 13, 59.09090909090909, 1.04], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1250, 22, "401/Unauthorized", 13, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 3, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 162, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
