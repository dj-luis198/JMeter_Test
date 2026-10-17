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

    var data = {"OkPercent": 97.65151515151516, "KoPercent": 2.3484848484848486};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.783289817232376, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.05555555555555555, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bbaea037-4608-4d26-9f2e-48795068dec8"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/86df6ab0-2265-49e7-93c1-65a8c0021bee"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ac0ce0f8-46b7-43cf-a2d9-5ca41c1e7a66"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6538461538461539, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f23a12d3-c124-4843-8689-d9ef6b95211c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=78cda073-e641-4d09-9b77-e16a2eefa705"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6051c573-5fdd-4d19-a1ed-35628cf08ccb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6efe3eed-45ab-4071-a698-28623e3bcf93"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/86d9ea89-d820-42ba-b31f-23c7a03b5388"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ba2f11fe-db1f-48cc-ac23-5feaa7fc6a7c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/78cda073-e641-4d09-9b77-e16a2eefa705"], "isController": false}, {"data": [0.09523809523809523, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d33e36ee-06e0-45f3-a88a-220b6cbf7d16"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.65625, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6d309690-c846-422a-816d-0132f5230a3e"], "isController": false}, {"data": [0.4318181818181818, 500, 1500, "register"], "isController": true}, {"data": [0.925, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.35185185185185186, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ac0ce0f8-46b7-43cf-a2d9-5ca41c1e7a66"], "isController": false}, {"data": [0.4318181818181818, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/5d9db531-d311-4e85-b4c6-758d62be626a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7580c85f-153d-45c3-a4b6-59c789ceb694"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.47619047619047616, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f23a12d3-c124-4843-8689-d9ef6b95211c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/627b73ea-a91a-4687-a44f-cc1f643bb8c6"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.2578125, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f73ddd99-0f98-482b-be4d-d0c2c688cde8"], "isController": false}, {"data": [0.9907407407407407, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6efe3eed-45ab-4071-a698-28623e3bcf93"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.46296296296296297, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9010989010989011, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=86df6ab0-2265-49e7-93c1-65a8c0021bee"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bbaea037-4608-4d26-9f2e-48795068dec8"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f73ddd99-0f98-482b-be4d-d0c2c688cde8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6051c573-5fdd-4d19-a1ed-35628cf08ccb"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ba2f11fe-db1f-48cc-ac23-5feaa7fc6a7c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5d9db531-d311-4e85-b4c6-758d62be626a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6d309690-c846-422a-816d-0132f5230a3e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1320, 31, 2.3484848484848486, 360.69469696969696, 108, 2103, 118.0, 983.8000000000002, 1232.95, 1735.2499999999973, 5.111563751268211, 688.9540849913645, 3.7417638960958497], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 1875.1111111111109, 1331, 2565, 1826.5, 2296.0, 2512.25, 2565.0, 0.24799537075307926, 298.42124414024823, 1.2193913005290566], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bbaea037-4608-4d26-9f2e-48795068dec8", 1, 0, 0.0, 458.0, 458, 458, 458.0, 458.0, 458.0, 458.0, 2.1834061135371177, 0.39446301855895194, 1.5053561681222707], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/86df6ab0-2265-49e7-93c1-65a8c0021bee", 3, 0, 0.0, 566.6666666666666, 207, 959, 534.0, 959.0, 959.0, 959.0, 0.07627765064836003, 0.034513650521230614, 0.04891502987541317], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ac0ce0f8-46b7-43cf-a2d9-5ca41c1e7a66", 1, 0, 0.0, 484.0, 484, 484, 484.0, 484.0, 484.0, 484.0, 2.066115702479339, 0.37327285640495866, 1.4244899276859504], "isController": false}, {"data": ["deleteBook", 13, 2, 15.384615384615385, 503.00000000000006, 116, 1095, 470.0, 918.1999999999998, 1095.0, 1095.0, 0.07148355878148026, 0.01417105706312548, 0.048060235208402066], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, 15.384615384615385, 503.00000000000006, 116, 1095, 470.0, 918.1999999999998, 1095.0, 1095.0, 0.07080340074180179, 0.014036221045493909, 0.04760294746387665], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f23a12d3-c124-4843-8689-d9ef6b95211c", 3, 0, 0.0, 376.3333333333333, 245, 587, 297.0, 587.0, 587.0, 587.0, 0.03741254816865577, 0.03118930203773679, 0.02399177079825907], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 142.0, 108, 346, 113.0, 338.2, 346.0, 346.0, 0.1006981740064447, 0.037027557733619765, 0.05686562248254565], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 128.33333333333334, 110, 342, 114.0, 206.4000000000001, 342.0, 342.0, 0.10069885001913277, 0.07483576646929692, 0.05054610245101001], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 236.9333333333333, 110, 877, 113.0, 557.2000000000002, 877.0, 877.0, 0.10069952604089744, 1.9992658375179582, 0.05872172231434364], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 266.6666666666667, 110, 1319, 114.0, 731.6000000000004, 1319.0, 1319.0, 0.10070020207173883, 6.066013650331975, 0.058623776492544834], "isController": false}, {"data": ["goToProfile", 13, 2, 15.384615384615385, 207.15384615384613, 113, 297, 211.0, 273.79999999999995, 297.0, 297.0, 0.0713791550904319, 0.14357869860700834, 0.04613478443495163], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=78cda073-e641-4d09-9b77-e16a2eefa705", 1, 0, 0.0, 515.0, 515, 515, 515.0, 515.0, 515.0, 515.0, 1.941747572815534, 0.3508040048543689, 1.338743932038835], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 123.49999999999999, 110, 330, 112.5, 116.0, 319.29999999999984, 330.0, 0.09188305125236598, 0.06828418164360402, 0.04612098471066027], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 838.8333333333333, 656, 1015, 892.0, 1015.0, 1015.0, 1015.0, 0.03175392822553757, 9.336709227956158, 0.018109662191126894], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 122.49999999999997, 109, 334, 111.0, 115.0, 323.04999999999984, 334.0, 0.09188389550963404, 0.031486385678057206, 0.052016693580991064], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1120.6666666666667, 944, 1244, 1151.5, 1244.0, 1244.0, 1244.0, 0.03165508618097213, 28.483302189344897, 0.01802237816748706], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6051c573-5fdd-4d19-a1ed-35628cf08ccb", 1, 0, 0.0, 530.0, 530, 530, 530.0, 530.0, 530.0, 530.0, 1.8867924528301887, 0.3408755896226415, 1.3008549528301887], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 354.3333333333333, 330, 453, 334.5, 453.0, 453.0, 453.0, 0.03180897649316637, 0.0562869779351733, 0.017612978194946612], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 128.64285714285717, 110, 328, 113.5, 222.0, 328.0, 328.0, 0.07666863814593328, 0.056977376590874235, 0.03848406250684541], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 177.57142857142858, 108, 355, 114.0, 347.5, 355.0, 355.0, 0.07666863814593328, 0.028740043345162208, 0.04326515643140347], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 199.0, 108, 1102, 112.0, 723.0, 1102.0, 1102.0, 0.07666821828537006, 4.946773987911065, 0.04460190712192985], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 160.07142857142858, 109, 563, 112.5, 448.5, 563.0, 563.0, 0.07666863814593328, 1.6294117838327746, 0.044677023093689074], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 150.83333333333334, 110, 345, 112.5, 345.0, 345.0, 345.0, 0.03184493638973956, 0.023666012297452934, 0.017881678148535397], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 188.79999999999995, 108, 847, 114.0, 439.8000000000002, 827.1499999999996, 847.0, 0.09188473978241694, 4.157430036949151, 0.05362335985739489], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 746.3750000000001, 109, 1362, 977.0, 1357.1, 1362.0, 1362.0, 0.08072165156499102, 40.86585342493139, 0.043553430165681195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 194.60000000000002, 109, 866, 112.5, 343.20000000000005, 839.8999999999996, 866.0, 0.09179069884848569, 1.3729790986841803, 0.053658117510452664], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 525.9375, 108, 902, 650.5, 895.7, 902.0, 902.0, 0.08072083707508047, 13.360234629617484, 0.043631819649469765], "isController": false}, {"data": ["deleteBooks", 13, 2, 15.384615384615385, 386.69230769230774, 115, 559, 442.0, 547.4, 559.0, 559.0, 0.0708037863686372, 0.014036297493001318, 0.048039347842663095], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 378.5714285714286, 225, 1217, 231.5, 950.5, 1217.0, 1217.0, 0.0766216423301736, 6.657846697538803, 0.17092355759758313], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6efe3eed-45ab-4071-a698-28623e3bcf93", 1, 0, 0.0, 442.0, 442, 442, 442.0, 442.0, 442.0, 442.0, 2.2624434389140275, 0.40874222285067874, 1.5598486990950227], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/86d9ea89-d820-42ba-b31f-23c7a03b5388", 1, 0, 0.0, 434.0, 434, 434, 434.0, 434.0, 434.0, 434.0, 2.304147465437788, 0.7357970910138248, 1.3748379896313365], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 388.71428571428567, 243, 612, 376.0, 561.6, 608.5, 612.0, 0.09170706144373117, 0.0563317789532294, 0.04146520453949954], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 140.12500000000003, 110, 337, 113.0, 331.4, 337.0, 337.0, 0.08072165156499102, 0.059989430508748214, 0.040518485258208385], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 265.0625, 109, 347, 330.0, 344.9, 347.0, 347.0, 0.08063174975936463, 0.08969691596155882, 0.04217615328599578], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ba2f11fe-db1f-48cc-ac23-5feaa7fc6a7c", 3, 0, 0.0, 803.6666666666666, 220, 1970, 221.0, 1970.0, 1970.0, 1970.0, 0.07986795165326659, 0.03707412078696555, 0.05121740389223151], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/78cda073-e641-4d09-9b77-e16a2eefa705", 3, 0, 0.0, 385.66666666666663, 217, 687, 253.0, 687.0, 687.0, 687.0, 0.01836075205640423, 0.02531177895796612, 0.011774310400754015], "isController": false}, {"data": ["login", 21, 0, 0.0, 2119.7619047619046, 1319, 3415, 2098.0, 3024.2000000000003, 3378.9999999999995, 3415.0, 0.09446523679286023, 32.4179705774525, 0.1872831305891932], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d33e36ee-06e0-45f3-a88a-220b6cbf7d16", 1, 0, 0.0, 422.0, 422, 422, 422.0, 422.0, 422.0, 422.0, 2.3696682464454977, 0.7567202310426541, 1.4139329087677726], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 115.89999999999999, 114, 119, 116.0, 118.0, 118.95, 119.0, 0.09091859603504002, 0.07360499620414862, 0.032318719684330637], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 942.6250000000001, 231, 1474, 1089.5, 1472.6, 1474.0, 1474.0, 0.08058585919635752, 54.28453627402466, 0.16964149680678534], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 3, 33.333333333333336, 886.1111111111112, 113, 1363, 1205.0, 1363.0, 1363.0, 1363.0, 0.04011893034016396, 32.00103717186058, 0.0690937133636157], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 441.0666666666666, 224, 1434, 443.0, 987.0000000000002, 1434.0, 1434.0, 0.1006218429896762, 8.170794992218577, 0.22458454708431438], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6d309690-c846-422a-816d-0132f5230a3e", 3, 0, 0.0, 402.66666666666663, 230, 742, 236.0, 742.0, 742.0, 742.0, 0.030026423252462166, 0.030114391289334613, 0.019255225848746896], "isController": false}, {"data": ["register", 22, 7, 31.818181818181817, 711.1363636363636, 214, 1311, 704.0, 1216.4, 1296.8999999999999, 1311.0, 0.09081414884438996, 0.028427795527815963, 0.0409727898106525], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 349.15, 225, 978, 229.5, 667.5000000000002, 963.0499999999997, 978.0, 0.09174227759378355, 5.622856420181924, 0.2051568764277392], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 126.94736842105264, 112, 333, 116.0, 119.0, 333.0, 333.0, 0.09059914646067282, 0.07033820452757314, 0.03220516534344229], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 21, 0, 0.0, 375.7142857142856, 224, 992, 231.0, 645.2, 959.1999999999996, 992.0, 0.1190665184949992, 6.958835586147461, 0.2663327104784206], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 112.875, 110, 116, 113.0, 116.0, 116.0, 116.0, 0.04065391827546079, 0.030212531062134434, 0.020406361321862153], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 140.5, 108, 340, 112.5, 340.0, 340.0, 340.0, 0.040607281900826867, 0.018489399595957547, 0.022732543310204103], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 265.625, 111, 1108, 115.0, 1108.0, 1108.0, 1108.0, 0.040449597273697145, 4.559116967910829, 0.023345421864018567], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 221.75, 110, 761, 112.5, 761.0, 761.0, 761.0, 0.040520896119617685, 1.498867551752782, 0.023426143069153974], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 133.0, 115, 151, 133.0, 151.0, 151.0, 151.0, 0.010766116876964818, 0.003175163375823608, 0.006655226546014383], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1296.537037037037, 869, 2103, 1108.5, 1834.5, 2047.0, 2103.0, 0.24480802970337426, 292.87551256681223, 0.4834002305275613], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ac0ce0f8-46b7-43cf-a2d9-5ca41c1e7a66", 3, 0, 0.0, 303.3333333333333, 209, 461, 240.0, 461.0, 461.0, 461.0, 0.018069785511645977, 0.02491065808653018, 0.011587720526674016], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, 31.818181818181817, 711.1363636363636, 214, 1311, 704.0, 1216.4, 1296.8999999999999, 1311.0, 0.08593145794436328, 0.026899353756376507, 0.03876985700224203], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 199.6, 111, 332, 112.0, 332.0, 332.0, 332.0, 0.03173998603440614, 0.008554918110836031, 0.018690636307370025], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 111.0, 109, 113, 110.0, 113.0, 113.0, 113.0, 0.031784778905077936, 0.008566991189259288, 0.018685973535993085], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5d9db531-d311-4e85-b4c6-758d62be626a", 3, 0, 0.0, 907.3333333333334, 211, 1651, 860.0, 1651.0, 1651.0, 1651.0, 0.01785778063502268, 0.024618392249127947, 0.011451766878578996], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 122.89473684210527, 109, 335, 111.0, 114.0, 335.0, 335.0, 0.09300913937174773, 0.02506886959629138, 0.05467920107596889], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 157.78947368421052, 108, 347, 111.0, 332.0, 347.0, 347.0, 0.09300913937174773, 0.02506886959629138, 0.05477003031363661], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7580c85f-153d-45c3-a4b6-59c789ceb694", 1, 0, 0.0, 221.0, 221, 221, 221.0, 221.0, 221.0, 221.0, 4.524886877828055, 1.4449589932126696, 2.699908088235294], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 124.26315789473685, 110, 336, 112.0, 116.0, 336.0, 336.0, 0.09300777349180553, 0.06912003479225001, 0.04668554255350395], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 154.8, 110, 327, 112.0, 327.0, 327.0, 327.0, 0.03174099349309634, 0.008493195524519917, 0.0181022853515315], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 135.6315789473684, 109, 338, 111.0, 334.0, 338.0, 338.0, 0.09300686292746443, 0.024886601994262944, 0.05304297651331956], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 156.2, 110, 330, 114.0, 330.0, 330.0, 330.0, 0.03178457685192837, 0.02362115525812255, 0.015954367677628107], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 114.2, 112, 118, 114.0, 118.0, 118.0, 118.0, 0.03060200259504982, 0.02408712313633804, 0.010878055609959116], "isController": false}, {"data": ["deleteAccount", 12, 1, 8.333333333333334, 672.3333333333333, 114, 1970, 560.5, 1637.0000000000011, 1970.0, 1970.0, 0.07343896304184186, 0.013799687960905992, 0.0499812864517353], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 980.2380952380952, 766, 2060, 831.0, 1430.2, 2000.8999999999992, 2060.0, 0.09135399673735727, 0.047282830342577485, 0.04201926998368679], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f23a12d3-c124-4843-8689-d9ef6b95211c", 1, 0, 0.0, 498.0, 498, 498, 498.0, 498.0, 498.0, 498.0, 2.008032128514056, 0.3627792419678715, 1.3844440261044177], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/627b73ea-a91a-4687-a44f-cc1f643bb8c6", 1, 0, 0.0, 217.0, 217, 217, 217.0, 217.0, 217.0, 217.0, 4.608294930875576, 1.4715941820276497, 2.749675979262673], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 357.0, 223, 662, 230.0, 662.0, 662.0, 662.0, 0.03171763690917972, 0.04915614235826974, 0.07133370879086025], "isController": false}, {"data": ["addBook", 64, 17, 26.5625, 1013.2187499999997, 565, 2046, 885.5, 1806.0, 1921.25, 2046.0, 0.28559571249436616, 75.8439428259138, 1.0401826752732126], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f73ddd99-0f98-482b-be4d-d0c2c688cde8", 1, 0, 0.0, 427.0, 427, 427, 427.0, 427.0, 427.0, 427.0, 2.34192037470726, 0.42310084894613587, 1.6146443208430914], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 203.42592592592595, 111, 552, 115.0, 456.0, 464.5, 552.0, 0.2459184370517112, 0.1827577447230002, 0.1188765882232393], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6efe3eed-45ab-4071-a698-28623e3bcf93", 3, 0, 0.0, 775.0, 215, 1669, 441.0, 1669.0, 1669.0, 1669.0, 0.021277501170262565, 0.02133983759947232, 0.013644751727023846], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 724.888888888889, 538, 1099, 666.0, 985.0, 1024.75, 1099.0, 0.2458534986318708, 72.28909170221678, 0.12364702323770846], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 177.38888888888894, 109, 440, 114.0, 339.5, 346.25, 440.0, 0.2463447457859082, 0.4359147259414703, 0.11980437832166237], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1088.1666666666665, 753, 1775, 995.0, 1452.5, 1593.75, 1775.0, 0.2453530585076173, 220.7691133298272, 0.12315573444620634], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 21, 0, 0.0, 135.9047619047619, 111, 334, 115.0, 290.60000000000014, 333.9, 334.0, 0.1197331660870061, 0.08944909380523405, 0.042561398882490456], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 17, 9.340659340659341, 161.80219780219784, 110, 1170, 116.0, 244.10000000000005, 331.7, 932.6199999999965, 0.7571912365515349, 1.5407790189901067, 0.36710578731247034], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 114.75, 110, 118, 115.0, 118.0, 118.0, 118.0, 0.041981528127623846, 0.0325110857472712, 0.014923121326616289], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=86df6ab0-2265-49e7-93c1-65a8c0021bee", 1, 0, 0.0, 211.0, 211, 211, 211.0, 211.0, 211.0, 211.0, 4.739336492890995, 0.8562277843601896, 3.267550355450237], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bbaea037-4608-4d26-9f2e-48795068dec8", 3, 0, 0.0, 412.66666666666663, 204, 814, 220.0, 814.0, 814.0, 814.0, 0.04059045583081898, 0.026571421443937815, 0.026029686844633262], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f73ddd99-0f98-482b-be4d-d0c2c688cde8", 3, 0, 0.0, 516.0, 209, 914, 425.0, 914.0, 914.0, 914.0, 0.024166458566606788, 0.028563935890413165, 0.015497370890695108], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 116.0, 110, 140, 115.0, 126.2, 140.0, 140.0, 0.09907464283591258, 0.08040139472328452, 0.03521793944557829], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6051c573-5fdd-4d19-a1ed-35628cf08ccb", 3, 0, 0.0, 303.6666666666667, 239, 433, 239.0, 433.0, 433.0, 433.0, 0.04300088868503282, 0.02764542810968093, 0.0275754396840868], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 380.375, 224, 1222, 230.0, 1222.0, 1222.0, 1222.0, 0.04042629528376733, 6.100309205888595, 0.08962675475387967], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 285.4736842105263, 222, 672, 227.0, 461.0, 672.0, 672.0, 0.09295544498749994, 0.14406278437027578, 0.20905897442012925], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 133.2142857142857, 113, 336, 117.0, 232.0, 336.0, 336.0, 0.07721624409157847, 0.0640201086267091, 0.027447961766928285], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ba2f11fe-db1f-48cc-ac23-5feaa7fc6a7c", 1, 0, 0.0, 207.0, 207, 207, 207.0, 207.0, 207.0, 207.0, 4.830917874396135, 0.8727732487922706, 3.330691425120773], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5d9db531-d311-4e85-b4c6-758d62be626a", 1, 0, 0.0, 559.0, 559, 559, 559.0, 559.0, 559.0, 559.0, 1.7889087656529516, 0.3231915250447227, 1.2333687388193202], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 115.00000000000001, 111, 125, 114.5, 119.4, 125.0, 125.0, 0.08150457444424068, 0.06327747722965951, 0.02897232919697618], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6d309690-c846-422a-816d-0132f5230a3e", 1, 0, 0.0, 430.0, 430, 430, 430.0, 430.0, 430.0, 430.0, 2.3255813953488373, 0.42014898255813954, 1.6033793604651163], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 21, 0, 0.0, 123.14285714285712, 110, 326, 113.0, 115.0, 304.8999999999997, 326.0, 0.1193019133754488, 0.08866089460812161, 0.059883968237285826], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 21, 0, 0.0, 133.28571428571428, 108, 342, 112.0, 292.40000000000015, 341.5, 342.0, 0.11930462447449154, 0.04045616265197136, 0.06756378891603226], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 21, 0, 0.0, 200.66666666666669, 109, 866, 112.0, 342.4, 813.6999999999992, 866.0, 0.11930394668817926, 5.142524941981355, 0.06964944878736061], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 21, 0, 0.0, 238.85714285714286, 110, 878, 115.0, 437.4000000000001, 836.1999999999994, 878.0, 0.11914488017429194, 1.6988007677752814, 0.06967293843897512], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 22.580645161290324, 0.5303030303030303], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 6.451612903225806, 0.15151515151515152], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 3.225806451612903, 0.07575757575757576], "isController": false}, {"data": ["401/Unauthorized", 21, 67.74193548387096, 1.5909090909090908], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1320, 31, "401/Unauthorized", 21, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 3, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 17, "401/Unauthorized", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
