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

    var data = {"OkPercent": 95.39473684210526, "KoPercent": 4.605263157894737};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7810725552050474, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4083333333333333, 500, 1500, "see books"], "isController": true}, {"data": [0.4230769230769231, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4230769230769231, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0e680489-b892-41de-8576-9206b9b269c8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5625, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/500e4d94-cafc-4661-8230-b1501bbd4555"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7941176470588235, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.4230769230769231, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2327476e-b584-4ac8-9ab8-eaf591edbb43"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1fe40ae5-ebe9-489c-8852-8258b88cf9a2"], "isController": false}, {"data": [0.6, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4f83df4f-9512-404e-a6c3-41d2c2c4277b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/95bf62dc-4093-4838-b70e-a3e5d5a2bb42"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN="], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1f8acbae-872f-4668-853b-6931aecac58a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f1c2647f-978f-4e45-ae06-2cbecbee4391"], "isController": false}, {"data": [0.2222222222222222, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ff0a8278-8a09-449a-9aef-586b96b22d28"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=-3"], "isController": false}, {"data": [0.2391304347826087, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/eadb4cb0-97ab-4e9e-a0fe-95b83e4bd033"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.48333333333333334, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2391304347826087, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.34615384615384615, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.125, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.2786885245901639, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8275862068965517, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8516483516483516, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0e680489-b892-41de-8576-9206b9b269c8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=500e4d94-cafc-4661-8230-b1501bbd4555"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f1c2647f-978f-4e45-ae06-2cbecbee4391"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1f8acbae-872f-4668-853b-6931aecac58a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=95bf62dc-4093-4838-b70e-a3e5d5a2bb42"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2327476e-b584-4ac8-9ab8-eaf591edbb43"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7ea3e295-8d04-4e90-b608-4765219eb2c8"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/4f83df4f-9512-404e-a6c3-41d2c2c4277b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0ca94131-ee71-4c92-8a97-5f94ef62a5e1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1fe40ae5-ebe9-489c-8852-8258b88cf9a2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1368, 63, 4.605263157894737, 298.3742690058479, 0, 5021, 91.0, 797.2000000000003, 1053.8499999999997, 1613.6999999999962, 5.476008438176745, 769.8531536021868, 3.962564659830996], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 60, 2, 3.3333333333333335, 1425.5166666666669, 956, 6675, 1302.0, 1597.3, 1697.35, 6675.0, 0.2521697102149747, 303.44224788282514, 1.2196411309811503], "isController": true}, {"data": ["deleteBook", 13, 5, 38.46153846153846, 437.92307692307696, 82, 1571, 421.0, 1250.9999999999998, 1571.0, 1571.0, 0.09038385327224312, 0.020301060793570233, 0.056204742892700464], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 5, 38.46153846153846, 437.92307692307696, 82, 1571, 421.0, 1250.9999999999998, 1571.0, 1571.0, 0.091811151523712, 0.02062164536177125, 0.05709230110526502], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 80.66666666666667, 78, 88, 80.0, 85.0, 88.0, 88.0, 0.10054562760580751, 0.03697146515088547, 0.05677947746437333], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 83.33333333333333, 80, 90, 82.0, 89.4, 90.0, 90.0, 0.10054158399914204, 0.0747188920149874, 0.05046716228081934], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 176.13333333333335, 79, 615, 82.0, 442.80000000000007, 615.0, 615.0, 0.10054293183189222, 1.9961568511629466, 0.05863040627723038], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 171.6, 79, 963, 81.0, 533.4000000000003, 963.0, 963.0, 0.10054562760580751, 6.056702340115694, 0.05853378919603716], "isController": false}, {"data": ["goToProfile", 14, 4, 28.571428571428573, 198.78571428571428, 78, 512, 186.5, 433.0, 512.0, 512.0, 0.08483768732464353, 0.1363403653928894, 0.05990596461965447], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0e680489-b892-41de-8576-9206b9b269c8", 1, 0, 0.0, 829.0, 829, 829, 829.0, 829.0, 829.0, 829.0, 1.2062726176115801, 0.21793011158021713, 0.8316684258142341], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 91.00000000000001, 79, 235, 84.0, 88.7, 227.6999999999999, 235.0, 0.09582169498996268, 0.07121124012437656, 0.04809799924300861], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 531.875, 89, 704, 621.5, 704.0, 704.0, 704.0, 0.04492716183886873, 11.560331299209281, 0.02322589482270619], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 113.9, 77, 249, 82.0, 245.70000000000002, 248.85, 249.0, 0.09582215408202377, 0.040031950699501724, 0.05384381587773093], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 749.875, 88, 1144, 743.5, 1144.0, 1144.0, 1144.0, 0.04485738156249474, 35.31891824146448, 0.02314601463191715], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 124.62499999999999, 81, 247, 84.5, 247.0, 247.0, 247.0, 0.04502020281601368, 0.07121237647581852, 0.022515597038233408], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/500e4d94-cafc-4661-8230-b1501bbd4555", 3, 0, 0.0, 1462.6666666666667, 185, 4016, 187.0, 4016.0, 4016.0, 4016.0, 0.07201325043808061, 0.032584120478167986, 0.046180372188482685], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 106.00000000000001, 80, 254, 83.5, 244.5, 254.0, 254.0, 0.07157756963474989, 0.05319387743363736, 0.03592858475806781], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 102.78571428571428, 78, 238, 81.0, 237.0, 238.0, 238.0, 0.07157756963474989, 0.026831602902981717, 0.04039219715019019], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 148.85714285714286, 78, 723, 81.0, 481.0, 723.0, 723.0, 0.0715779355900834, 4.61833961717308, 0.041640623801708666], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 160.0, 79, 632, 82.0, 480.0, 632.0, 632.0, 0.07157720368315838, 1.5212053057880395, 0.04171009762619317], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 145.75000000000003, 79, 578, 84.0, 578.0, 578.0, 578.0, 0.044889095877497655, 0.03335996285427316, 0.022329475793555046], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 166.8, 78, 864, 81.5, 791.3000000000013, 863.45, 864.0, 0.09582169498996268, 8.645297205959151, 0.055509208464888535], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 481.8235294117647, 79, 1171, 242.0, 1011.7999999999998, 1171.0, 1171.0, 0.08087150944293801, 34.25545808358308, 0.04427306324627753], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 144.05, 78, 636, 82.0, 443.90000000000043, 627.4999999999999, 636.0, 0.09582261317848399, 2.8407474583051857, 0.05560331713931171], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 347.4117647058824, 77, 705, 236.0, 659.4, 705.0, 705.0, 0.08087150944293801, 11.201614605632463, 0.0443520393297179], "isController": false}, {"data": ["deleteBooks", 13, 5, 38.46153846153846, 396.2307692307693, 83, 852, 391.0, 842.8, 852.0, 852.0, 0.09180661290094771, 0.020620625944548804, 0.05715844408977274], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 274.1428571428571, 162, 806, 166.5, 648.5, 806.0, 806.0, 0.07154757402618642, 6.216948174961926, 0.15960459105450903], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2327476e-b584-4ac8-9ab8-eaf591edbb43", 3, 0, 0.0, 312.3333333333333, 183, 507, 247.0, 507.0, 507.0, 507.0, 0.032063271522471015, 0.026729830198257896, 0.020561407844813768], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1fe40ae5-ebe9-489c-8852-8258b88cf9a2", 1, 0, 0.0, 504.0, 504, 504, 504.0, 504.0, 504.0, 504.0, 1.984126984126984, 0.35846044146825395, 1.3679625496031746], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 2, 10.0, 711.15, 1, 2197, 693.5, 1330.4000000000003, 2154.4499999999994, 2197.0, 0.09674548198599126, 0.07409910304845013, 0.03936898666363531], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 93.6470588235294, 79, 243, 84.0, 126.9999999999999, 243.0, 243.0, 0.08086958590014985, 0.06009936999024808, 0.040592741360036155], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 136.47058823529414, 77, 243, 81.0, 243.0, 243.0, 243.0, 0.0808718941624764, 0.07879992352848832, 0.04292602838127768], "isController": false}, {"data": ["login", 20, 3, 15.0, 2728.8999999999996, 2, 4184, 2958.5, 3784.9, 4164.349999999999, 4184.0, 0.099639802115353, 41.90727473308988, 0.18699977705594276], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 88.45, 83, 95, 88.0, 93.0, 94.9, 95.0, 0.09980687369939169, 0.08080068193046455, 0.03547822463533064], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4f83df4f-9512-404e-a6c3-41d2c2c4277b", 1, 0, 0.0, 764.0, 764, 764, 764.0, 764.0, 764.0, 764.0, 1.3089005235602096, 0.23647128599476439, 0.9024255562827225], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/95bf62dc-4093-4838-b70e-a3e5d5a2bb42", 3, 0, 0.0, 383.3333333333333, 202, 508, 440.0, 508.0, 508.0, 508.0, 0.026579721444519262, 0.02665759172218875, 0.017044938556543928], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=", 1, 1, 100.0, 94.0, 94, 94, 94.0, 94.0, 94.0, 94.0, 10.638297872340425, 3.4491356382978724, 3.646525930851064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 576.5294117647059, 159, 1256, 485.0, 1096.8, 1256.0, 1256.0, 0.08083882165529375, 45.57754341371645, 0.1720750537934806], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1f8acbae-872f-4668-853b-6931aecac58a", 3, 0, 0.0, 353.0, 205, 616, 238.0, 616.0, 616.0, 616.0, 0.03012259897783981, 0.025111971348387937, 0.01931690103722149], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f1c2647f-978f-4e45-ae06-2cbecbee4391", 1, 0, 0.0, 429.0, 429, 429, 429.0, 429.0, 429.0, 429.0, 2.331002331002331, 0.4211283508158508, 1.6071168414918415], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 18, 10, 55.55555555555556, 441.1111111111111, 1, 1761, 85.0, 1095.0000000000011, 1761.0, 1761.0, 0.07884638971142222, 36.71059158884236, 0.09360869933024372], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 294.73333333333335, 161, 1046, 175.0, 666.8000000000002, 1046.0, 1046.0, 0.10048702712479819, 8.159847540245055, 0.22428364263798545], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ff0a8278-8a09-449a-9aef-586b96b22d28", 1, 0, 0.0, 381.0, 381, 381, 381.0, 381.0, 381.0, 381.0, 2.6246719160104988, 0.8381520669291338, 1.5660884186351707], "isController": false}, {"data": ["https://demoqa.com/books?book=-1", 1, 0, 0.0, 86.0, 86, 86, 86.0, 86.0, 86.0, 86.0, 11.627906976744185, 20.57594476744186, 5.654978197674419], "isController": false}, {"data": ["https://demoqa.com/books?book=-0", 1, 0, 0.0, 351.0, 351, 351, 351.0, 351.0, 351.0, 351.0, 2.849002849002849, 2.1172765313390314, 1.3938969017094018], "isController": false}, {"data": ["https://demoqa.com/books?book=-3", 1, 0, 0.0, 736.0, 736, 736, 736.0, 736.0, 736.0, 736.0, 1.358695652173913, 399.5016346807065, 0.6833283797554348], "isController": false}, {"data": ["register", 23, 10, 43.47826086956522, 1059.2173913043478, 0, 3377, 1131.0, 1485.2000000000003, 3011.599999999995, 3377.0, 0.09221985212747189, 0.053835374783483825, 0.036180003127455854], "isController": true}, {"data": ["https://demoqa.com/books?book=-2", 1, 0, 0.0, 1133.0, 1133, 1133, 1133.0, 1133.0, 1133.0, 1133.0, 0.88261253309797, 794.1763087488968, 0.44303011915269197], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 276.05, 161, 947, 168.5, 893.0000000000009, 946.6, 947.0, 0.09578360567805215, 11.592650508970134, 0.21296886074979407], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 97.33333333333334, 82, 239, 87.5, 131.00000000000017, 239.0, 239.0, 0.094434155784879, 0.07331557993064336, 0.033568391314156204], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 13, 0, 0.0, 339.9230769230769, 162, 1170, 318.0, 897.5999999999997, 1170.0, 1170.0, 0.07190225717778109, 6.719793101254972, 0.16029471801870565], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eadb4cb0-97ab-4e9e-a0fe-95b83e4bd033", 1, 0, 0.0, 290.0, 290, 290, 290.0, 290.0, 290.0, 290.0, 3.4482758620689653, 1.101158405172414, 2.0575161637931036], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 14, 0, 0.0, 117.14285714285715, 80, 249, 82.5, 248.0, 249.0, 249.0, 0.06862139615131999, 0.05099695553823682, 0.034444724240018036], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 14, 0, 0.0, 149.64285714285714, 78, 249, 84.5, 247.0, 249.0, 249.0, 0.0686224052153028, 0.018361854520500945, 0.03913621547435238], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 14, 0, 0.0, 126.00000000000001, 79, 241, 81.5, 240.5, 241.0, 241.0, 0.06856862985184278, 0.018481388514754497, 0.040310854658993506], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 14, 0, 0.0, 102.57142857142856, 78, 239, 80.0, 239.0, 239.0, 239.0, 0.06856862985184278, 0.018481388514754497, 0.0403778162115832], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, 100.0, 128.4, 83, 264, 95.0, 264.0, 264.0, 264.0, 0.03535192844769682, 0.010426057022660586, 0.018228338105843674], "isController": false}, {"data": ["https://demoqa.com/books", 60, 2, 3.3333333333333335, 968.0666666666667, 621, 5021, 797.0, 1259.2, 1346.85, 5021.0, 0.2587567600203555, 299.2659646856321, 0.4939120733747919], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 10, 43.47826086956522, 1059.2173913043478, 0, 3377, 1131.0, 1485.2000000000003, 3011.599999999995, 3377.0, 0.09605024680737331, 0.056071452248410994, 0.037682756475039464], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 98.44444444444444, 77, 242, 81.0, 242.0, 242.0, 242.0, 0.05442604709667276, 0.014669520506525079, 0.03204971328056023], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 97.55555555555556, 78, 235, 81.0, 235.0, 235.0, 235.0, 0.05442637623139676, 0.01466960921861866, 0.03199675633916099], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 142.38888888888886, 78, 887, 80.0, 307.4000000000009, 887.0, 887.0, 0.09217109002555186, 4.631002202184967, 0.05374646677488236], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 124.66666666666669, 77, 557, 81.0, 270.80000000000047, 557.0, 557.0, 0.09224950415891514, 1.5303948502995548, 0.05388227874212676], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 90.00000000000001, 79, 236, 81.0, 100.10000000000022, 236.0, 236.0, 0.09224808585221857, 0.06855546223978352, 0.0463042149687894], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 114.1111111111111, 77, 236, 80.0, 236.0, 236.0, 236.0, 0.05442637623139676, 0.014563307702541713, 0.03104004269446847], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 106.88888888888889, 78, 242, 81.0, 233.9, 242.0, 242.0, 0.09217580999493033, 0.03235554962387149, 0.05213894287148132], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 101.33333333333333, 80, 245, 82.0, 245.0, 245.0, 245.0, 0.05442637623139676, 0.04044772686727826, 0.02731948963177533], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 88.0, 82, 105, 85.0, 105.0, 105.0, 105.0, 0.052662067512770555, 0.04145080704618463, 0.018719719311180157], "isController": false}, {"data": ["deleteAccount", 13, 5, 38.46153846153846, 674.9230769230768, 79, 4016, 497.0, 2867.999999999999, 4016.0, 4016.0, 0.09203018590097552, 0.01970297699953277, 0.05897757781860142], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 3, 15.0, 1462.3000000000002, 0, 3422, 1544.5, 2277.9000000000005, 3366.149999999999, 3422.0, 0.09865386797152849, 0.07807047061594542, 0.03857038676015764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 218.88888888888889, 161, 487, 165.0, 487.0, 487.0, 487.0, 0.05439940039772006, 0.0843084457335759, 0.12234552648041923], "isController": false}, {"data": ["addBook", 61, 24, 39.34426229508197, 818.2131147540979, 419, 1781, 706.0, 1464.8, 1568.8999999999999, 1781.0, 0.2804597701149425, 72.6111709770115, 1.0101831896551725], "isController": true}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 138.41379310344826, 79, 333, 84.0, 322.1, 330.1, 333.0, 0.27115981598533867, 0.20151623043441674, 0.13107823136010024], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 510.68965517241355, 382, 735, 470.0, 688.9, 706.65, 735.0, 0.27109771202879246, 79.71172862768469, 0.13634308759260558], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 115.7586206896552, 78, 253, 82.5, 241.1, 245.0, 253.0, 0.2712726898558045, 0.48002550197140414, 0.13192753862127996], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 731.0689655172414, 537, 1066, 701.0, 977.3, 1004.8, 1066.0, 0.2704895861509332, 243.38700508858534, 0.13577309304841764], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 13, 0, 0.0, 87.3076923076923, 83, 99, 84.0, 98.2, 99.0, 99.0, 0.07680264673736448, 0.05737697729891, 0.027300940832422536], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 25, 13.736263736263735, 141.85164835164832, 0, 684, 88.0, 316.3000000000002, 372.19999999999993, 634.1999999999992, 0.757493777729683, 1.6426252244907729, 0.3500392858852272], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 14, 0, 0.0, 103.28571428571429, 82, 243, 87.5, 182.5, 243.0, 243.0, 0.06786496810346498, 0.05255558565043724, 0.02412387538052857], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0e680489-b892-41de-8576-9206b9b269c8", 3, 0, 0.0, 569.0, 207, 1146, 354.0, 1146.0, 1146.0, 1146.0, 0.026977204262398274, 0.027056239040510768, 0.017299834764623892], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 85.46666666666665, 82, 97, 85.0, 90.4, 97.0, 97.0, 0.09764798552205868, 0.0792436288758113, 0.034710807353544294], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=500e4d94-cafc-4661-8230-b1501bbd4555", 1, 0, 0.0, 186.0, 186, 186, 186.0, 186.0, 186.0, 186.0, 5.376344086021506, 0.9713121639784946, 3.7067372311827955], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f1c2647f-978f-4e45-ae06-2cbecbee4391", 3, 0, 0.0, 269.3333333333333, 186, 400, 222.0, 400.0, 400.0, 400.0, 0.019927066935017834, 0.023553118502945884, 0.012778750606114952], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1f8acbae-872f-4668-853b-6931aecac58a", 1, 0, 0.0, 391.0, 391, 391, 391.0, 391.0, 391.0, 391.0, 2.557544757033248, 0.46205642583120204, 1.7633072250639386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 14, 0, 0.0, 279.7857142857143, 160, 491, 243.5, 490.0, 491.0, 491.0, 0.0685407670690989, 0.10622480208853509, 0.15414979156263156], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=95bf62dc-4093-4838-b70e-a3e5d5a2bb42", 1, 0, 0.0, 852.0, 852, 852, 852.0, 852.0, 852.0, 852.0, 1.1737089201877935, 0.21204702171361503, 0.8092172828638498], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2327476e-b584-4ac8-9ab8-eaf591edbb43", 1, 0, 0.0, 554.0, 554, 554, 554.0, 554.0, 554.0, 554.0, 1.8050541516245489, 0.3261084160649819, 1.2445002256317688], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 252.1111111111111, 160, 968, 166.0, 519.8000000000008, 968.0, 968.0, 0.09213287608128168, 6.258352541011926, 0.20589938322157955], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7ea3e295-8d04-4e90-b608-4765219eb2c8", 1, 0, 0.0, 309.0, 309, 309, 309.0, 309.0, 309.0, 309.0, 3.236245954692557, 1.0334496359223302, 1.931002224919094], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4f83df4f-9512-404e-a6c3-41d2c2c4277b", 3, 0, 0.0, 739.6666666666666, 512, 1034, 673.0, 1034.0, 1034.0, 1034.0, 0.02056061956000274, 0.024301956257281886, 0.0131850327256528], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 112.78571428571428, 81, 289, 86.5, 263.0, 289.0, 289.0, 0.06886611934498482, 0.057097007152238394, 0.024479753360912574], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0ca94131-ee71-4c92-8a97-5f94ef62a5e1", 2, 0, 0.0, 297.0, 214, 380, 297.0, 380.0, 380.0, 380.0, 0.02070779234225839, 0.02928211260897476, 0.012871591626804168], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 104.76470588235294, 81, 241, 86.0, 237.0, 241.0, 241.0, 0.07909699152266361, 0.061408308848161695, 0.028116508705321834], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1fe40ae5-ebe9-489c-8852-8258b88cf9a2", 3, 0, 0.0, 294.6666666666667, 187, 497, 200.0, 497.0, 497.0, 497.0, 0.04591016910245619, 0.029097363034662177, 0.02944109151427041], "isController": false}, {"data": ["https://demoqa.com/books?book=", 1, 0, 0.0, 1486.0, 1486, 1486, 1486.0, 1486.0, 1486.0, 1486.0, 0.6729475100942126, 805.0791764804845, 1.3327515141318977], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 13, 0, 0.0, 119.84615384615384, 80, 244, 83.0, 243.2, 244.0, 244.0, 0.07193408624343602, 0.05345882776489727, 0.036107539383912216], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 13, 0, 0.0, 153.30769230769232, 78, 244, 82.0, 243.6, 244.0, 244.0, 0.0719344842850819, 0.027559034694555114, 0.04056041459163347], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 13, 0, 0.0, 182.30769230769232, 79, 930, 81.0, 653.9999999999998, 930.0, 930.0, 0.0719344842850819, 4.996879884973993, 0.04181408048362107], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 13, 0, 0.0, 134.53846153846152, 78, 468, 81.0, 377.9999999999999, 468.0, 468.0, 0.07193488233113286, 1.6449160194832864, 0.04188456076837521], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: demoqa.com", 11, 17.46031746031746, 0.804093567251462], "isController": false}, {"data": ["400/Bad Request", 1, 1.5873015873015872, 0.07309941520467836], "isController": false}, {"data": ["406/Not Acceptable", 7, 11.11111111111111, 0.5116959064327485], "isController": false}, {"data": ["Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: demoqa.com: Try again", 1, 1.5873015873015872, 0.07309941520467836], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 6.349206349206349, 0.29239766081871343], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 5, 7.936507936507937, 0.3654970760233918], "isController": false}, {"data": ["401/Unauthorized", 34, 53.96825396825397, 2.4853801169590644], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1368, 63, "401/Unauthorized", 34, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: demoqa.com", 11, "406/Not Acceptable", 7, "Test failed: code expected to contain /204/", 5, "Test failed: code expected to contain /200/", 4], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 2, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: demoqa.com", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=", 1, 1, "400/Bad Request", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 18, 10, "Test failed: code expected to contain /204/", 5, "Test failed: code expected to contain /200/", 4, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: demoqa.com", 1, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/books", 60, 2, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: demoqa.com", 1, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: demoqa.com: Try again", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 10, "406/Not Acceptable", 7, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: demoqa.com", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 3, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: demoqa.com", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 25, "401/Unauthorized", 24, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: demoqa.com", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
