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

    var data = {"OkPercent": 97.42647058823529, "KoPercent": 2.573529411764706};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7165079365079365, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=83079597-74f8-4815-a65b-58601320311d"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a8af678d-cafb-4bd2-a198-9f7b6cfc85e3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d1abe448-13b6-4a9d-81ca-ab4d26f31942"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f4e899f1-9e2b-4b85-be88-44e04923e826"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/ec989938-d8c6-4f1f-b80e-8bb4e8afdfcd"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d1615e65-8fa8-475c-8fe8-c5e932fd2667"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=867e0aed-3e47-402a-bb79-31538b59dd7a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5277777777777778, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2b8385d0-88fa-47a7-b05a-0222d679b665"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6136363636363636, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/176193d3-0ab8-4060-af3e-a380737f3ce2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=98b38f0d-2525-459d-a79a-5ff54cd7559d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4cc8cad2-47c8-4445-b8c4-a8163149e7d2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/83079597-74f8-4815-a65b-58601320311d"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.18181818181818182, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d1abe448-13b6-4a9d-81ca-ab4d26f31942"], "isController": false}, {"data": [0.1590909090909091, 500, 1500, "register"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4cc8cad2-47c8-4445-b8c4-a8163149e7d2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.2711864406779661, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/284d98b2-ee10-480d-a7c3-e890057bc582"], "isController": false}, {"data": [0.1590909090909091, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a8af678d-cafb-4bd2-a198-9f7b6cfc85e3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d1615e65-8fa8-475c-8fe8-c5e932fd2667"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.18181818181818182, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ec989938-d8c6-4f1f-b80e-8bb4e8afdfcd"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f4e899f1-9e2b-4b85-be88-44e04923e826"], "isController": false}, {"data": [0.19166666666666668, 500, 1500, "addBook"], "isController": true}, {"data": [0.9152542372881356, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9830508474576272, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/867e0aed-3e47-402a-bb79-31538b59dd7a"], "isController": false}, {"data": [0.3813559322033898, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8575418994413407, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/2b8385d0-88fa-47a7-b05a-0222d679b665"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/98b38f0d-2525-459d-a79a-5ff54cd7559d"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/9a39058d-cbb0-457d-ac03-ed2b72ff9e08"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=176193d3-0ab8-4060-af3e-a380737f3ce2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f529d1ec-9414-422b-974f-186deeb8f1c7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1360, 35, 2.573529411764706, 473.80220588235255, 126, 3696, 151.0, 1308.9, 1588.8500000000001, 2133.3900000000003, 5.276655841762403, 755.3773739495188, 3.8718576192873413], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=83079597-74f8-4815-a65b-58601320311d", 1, 0, 0.0, 788.0, 788, 788, 788.0, 788.0, 788.0, 788.0, 1.2690355329949237, 0.22926911484771573, 0.8749405139593909], "isController": false}, {"data": ["see books", 59, 0, 0.0, 2200.135593220339, 1618, 2964, 2185.0, 2670.0, 2697.0, 2964.0, 0.25608639226358665, 308.1587981816781, 1.2591747900851162], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a8af678d-cafb-4bd2-a198-9f7b6cfc85e3", 3, 0, 0.0, 630.3333333333333, 234, 1290, 367.0, 1290.0, 1290.0, 1290.0, 0.046016504586311624, 0.029584178567046045, 0.02950928191244593], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d1abe448-13b6-4a9d-81ca-ab4d26f31942", 1, 0, 0.0, 491.0, 491, 491, 491.0, 491.0, 491.0, 491.0, 2.0366598778004072, 0.3679512474541752, 1.404181517311609], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f4e899f1-9e2b-4b85-be88-44e04923e826", 1, 0, 0.0, 630.0, 630, 630, 630.0, 630.0, 630.0, 630.0, 1.5873015873015872, 0.2867683531746032, 1.0943700396825398], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 825.9285714285714, 146, 3696, 590.5, 2492.0, 3696.0, 3696.0, 0.08420495486012956, 0.01658724836251436, 0.05665743544788014], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 825.9285714285714, 146, 3696, 590.5, 2492.0, 3696.0, 3696.0, 0.08145786301114809, 0.016046108059673703, 0.05480905040496195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 21, 0, 0.0, 210.33333333333331, 131, 420, 135.0, 399.8, 418.0, 420.0, 0.11627005658476086, 0.039427141583708906, 0.06584527293011616], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 21, 0, 0.0, 139.9047619047619, 128, 204, 135.0, 152.0, 198.99999999999994, 204.0, 0.11627327541816852, 0.08641011971994751, 0.058363733950135374], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ec989938-d8c6-4f1f-b80e-8bb4e8afdfcd", 3, 0, 0.0, 1137.0, 334, 2309, 768.0, 2309.0, 2309.0, 2309.0, 0.04312327506899724, 0.027724110762132017, 0.027653923139949403], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 21, 0, 0.0, 285.95238095238096, 132, 1053, 140.0, 505.4000000000001, 1000.3999999999992, 1053.0, 0.11626876910129778, 1.6577923778901094, 0.06799106080026132], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 21, 0, 0.0, 237.19047619047618, 131, 1451, 137.0, 416.40000000000003, 1347.9999999999986, 1451.0, 0.11626812537025862, 5.011667688049852, 0.06787714127130891], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d1615e65-8fa8-475c-8fe8-c5e932fd2667", 1, 0, 0.0, 472.0, 472, 472, 472.0, 472.0, 472.0, 472.0, 2.1186440677966103, 0.38276284427966106, 1.4607057733050848], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 524.9285714285716, 143, 2309, 317.5, 1838.5, 2309.0, 2309.0, 0.08438004773499844, 0.13594628644916706, 0.05453861065237831], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 169.50000000000003, 129, 399, 135.5, 398.3, 399.0, 399.0, 0.07957744377356239, 0.05913909639812595, 0.03994414658165143], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 203.62499999999997, 131, 421, 135.5, 416.1, 421.0, 421.0, 0.07947743585922559, 0.028727134714253783, 0.04490979621488712], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 861.5, 659, 1104, 815.0, 1104.0, 1104.0, 1104.0, 0.06695905453814992, 19.68818528407379, 0.03818758579128863], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 1408.625, 1172, 1623, 1416.0, 1623.0, 1623.0, 1623.0, 0.06683207605490256, 60.13561951246, 0.03804990267578925], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 331.25, 135, 403, 395.0, 403.0, 403.0, 403.0, 0.06727720732312402, 0.11904912077099679, 0.03725212553926886], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 137.4, 133, 150, 135.0, 144.6, 150.0, 150.0, 0.06529148294368828, 0.04852228371108083, 0.032773263899468524], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 135.06666666666663, 132, 140, 134.0, 140.0, 140.0, 140.0, 0.06529233555037087, 0.017470800723439078, 0.037237035118570884], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=867e0aed-3e47-402a-bb79-31538b59dd7a", 1, 0, 0.0, 267.0, 267, 267, 267.0, 267.0, 267.0, 267.0, 3.745318352059925, 0.6766444288389513, 2.5822214419475653], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 169.9333333333333, 131, 398, 134.0, 396.8, 398.0, 398.0, 0.0652931881793212, 0.01759855462645767, 0.03838525320698376], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 169.6, 132, 397, 134.0, 394.6, 397.0, 397.0, 0.06529233555037087, 0.017598324816310896, 0.038448514000853154], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 139.25, 133, 146, 139.5, 146.0, 146.0, 146.0, 0.06741667720052248, 0.05010165170859141, 0.037856044326465256], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 906.8888888888889, 131, 1718, 1248.0, 1599.2000000000003, 1718.0, 1718.0, 0.09675442651501306, 48.37814762642578, 0.052261668315075414], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 225.6875, 130, 1057, 134.5, 597.1000000000005, 1057.0, 1057.0, 0.07958219348420792, 4.495621619311116, 0.046358182044267594], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2b8385d0-88fa-47a7-b05a-0222d679b665", 1, 0, 0.0, 841.0, 841, 841, 841.0, 841.0, 841.0, 841.0, 1.1890606420927465, 0.21482052615933414, 0.8198015755053508], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 635.1111111111112, 132, 1179, 787.5, 1120.5, 1179.0, 1179.0, 0.09675234624439644, 15.816258055976608, 0.05235502937508735], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 310.0625, 130, 658, 384.0, 572.6000000000001, 658.0, 658.0, 0.07948098914090987, 1.4807118112475535, 0.04637684669110707], "isController": false}, {"data": ["deleteBooks", 12, 1, 8.333333333333334, 520.5833333333334, 144, 841, 484.5, 825.1, 841.0, 841.0, 0.09221902017291066, 0.017538724783861672, 0.06303284101825168], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 327.59999999999997, 269, 538, 276.0, 538.0, 538.0, 538.0, 0.06525313867597032, 0.10112962019410635, 0.14675583825269495], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 803.8636363636363, 195, 2387, 744.0, 1570.6, 2274.3499999999985, 2387.0, 0.09701459628698682, 0.05959197369581514, 0.043864998125854385], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 134.94444444444446, 129, 140, 134.5, 140.0, 140.0, 140.0, 0.09675078610013706, 0.07190170724824639, 0.04856435942917037], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 209.44444444444446, 126, 416, 136.0, 406.1, 416.0, 416.0, 0.09675390643897248, 0.10662246894468365, 0.05066561984315117], "isController": false}, {"data": ["login", 22, 0, 0.0, 3515.8636363636356, 2210, 6362, 3239.0, 4734.4, 6130.5499999999965, 6362.0, 0.09629568026332491, 42.0206000260436, 0.20335452294244583], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 140.25, 132, 157, 140.0, 149.3, 157.0, 157.0, 0.08033822392271463, 0.06503944104680706, 0.028557728035027468], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/176193d3-0ab8-4060-af3e-a380737f3ce2", 3, 0, 0.0, 882.0, 458, 1662, 526.0, 1662.0, 1662.0, 1662.0, 0.09346085547836382, 0.04228860322751488, 0.05993420745194555], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=98b38f0d-2525-459d-a79a-5ff54cd7559d", 1, 0, 0.0, 628.0, 628, 628, 628.0, 628.0, 628.0, 628.0, 1.5923566878980893, 0.2876816281847134, 1.0978552945859872], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 1043.1666666666663, 267, 1854, 1383.5, 1738.8000000000002, 1854.0, 1854.0, 0.09668167022956525, 64.32486652558305, 0.20369661359022012], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4cc8cad2-47c8-4445-b8c4-a8163149e7d2", 1, 0, 0.0, 478.0, 478, 478, 478.0, 478.0, 478.0, 478.0, 2.092050209205021, 0.377958289748954, 1.4423705543933054], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/83079597-74f8-4815-a65b-58601320311d", 3, 0, 0.0, 913.0, 531, 1212, 996.0, 1212.0, 1212.0, 1212.0, 0.02605229564145094, 0.026128620726338002, 0.01670671302527941], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 21, 0, 0.0, 497.90476190476187, 267, 1586, 530.0, 650.2, 1493.5999999999985, 1586.0, 0.11618128706736303, 6.79020840709923, 0.25987891039933164], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 3, 27.272727272727273, 1167.2727272727275, 143, 1760, 1395.0, 1751.4, 1760.0, 1760.0, 0.09179134991697055, 79.87169225176699, 0.16697485438554036], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d1abe448-13b6-4a9d-81ca-ab4d26f31942", 3, 0, 0.0, 668.3333333333334, 343, 989, 673.0, 989.0, 989.0, 989.0, 0.03361984915894344, 0.021614323596651462, 0.02155960379007766], "isController": false}, {"data": ["register", 22, 8, 36.36363636363637, 1388.1818181818187, 267, 2275, 1416.0, 2054.5, 2253.85, 2275.0, 0.09985792940044391, 0.03109922020035132, 0.045053089241215906], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/4cc8cad2-47c8-4445-b8c4-a8163149e7d2", 3, 0, 0.0, 340.6666666666667, 243, 507, 272.0, 507.0, 507.0, 507.0, 0.03936852879807882, 0.03243546431899007, 0.025246094313872158], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 158.77777777777777, 137, 402, 142.5, 200.40000000000032, 402.0, 402.0, 0.08514261387824607, 0.06610193167305237, 0.03026553852703278], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 525.625, 267, 1192, 536.0, 926.0000000000002, 1192.0, 1192.0, 0.0794210207586693, 6.053841130967745, 0.17734969882059784], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 420.73333333333335, 267, 839, 288.0, 668.6000000000001, 839.0, 839.0, 0.08517258805426062, 0.1320008762129996, 0.19155514676656465], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 202.24999999999997, 132, 395, 142.5, 395.0, 395.0, 395.0, 0.04843582555837425, 0.03599576489250274, 0.024312514000980827], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 199.375, 129, 397, 136.5, 397.0, 397.0, 397.0, 0.04836145350348505, 0.022020046578124907, 0.027073440645383598], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 263.49999999999994, 131, 1163, 133.5, 1163.0, 1163.0, 1163.0, 0.0484393448578608, 5.459649883821259, 0.027956692198238018], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 313.875, 127, 1032, 134.5, 1032.0, 1032.0, 1032.0, 0.04836145350348505, 1.7888896928140927, 0.027958965306702294], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 144.0, 144, 144, 144.0, 144.0, 144.0, 144.0, 6.944444444444444, 2.048068576388889, 4.292805989583334], "isController": false}, {"data": ["https://demoqa.com/books", 59, 0, 0.0, 1506.7966101694917, 1014, 2392, 1391.0, 2072.0, 2135.0, 2392.0, 0.25242261535499605, 301.98520426444475, 0.4984360627419941], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/284d98b2-ee10-480d-a7c3-e890057bc582", 1, 0, 0.0, 261.0, 261, 261, 261.0, 261.0, 261.0, 261.0, 3.8314176245210727, 1.2235093390804597, 2.286129070881226], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 8, 36.36363636363637, 1388.1818181818187, 267, 2275, 1416.0, 2054.5, 2253.85, 2275.0, 0.09693679720822024, 0.03018947839190666, 0.04373515655292749], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 200.75, 132, 409, 134.0, 409.0, 409.0, 409.0, 0.03912879732750314, 0.010546433654678581, 0.02304166483250429], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a8af678d-cafb-4bd2-a198-9f7b6cfc85e3", 1, 0, 0.0, 462.0, 462, 462, 462.0, 462.0, 462.0, 462.0, 2.1645021645021645, 0.3910477543290043, 1.4923227813852813], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 166.625, 132, 395, 134.5, 395.0, 395.0, 395.0, 0.03917900397177153, 0.010559965914266544, 0.023032969131842246], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 274.77777777777777, 130, 1451, 137.0, 619.4000000000013, 1451.0, 1451.0, 0.0838527545629874, 4.213059549722354, 0.048895909616047555], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 266.49999999999994, 128, 795, 138.0, 552.9000000000004, 795.0, 795.0, 0.08411057737238556, 1.395372209748416, 0.04912838953944786], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d1615e65-8fa8-475c-8fe8-c5e932fd2667", 3, 0, 0.0, 333.3333333333333, 250, 484, 266.0, 484.0, 484.0, 484.0, 0.020605669306481857, 0.024355203532498572, 0.013213922048753013], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 196.33333333333334, 132, 418, 137.5, 404.5, 418.0, 418.0, 0.08436880416594407, 0.06269986325222991, 0.042349184903608644], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 165.625, 131, 393, 133.5, 393.0, 393.0, 393.0, 0.03912937148447053, 0.010470163854243092, 0.0223159696747371], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 193.5, 131, 421, 133.5, 400.3, 421.0, 421.0, 0.08426808486732458, 0.029579780224153102, 0.047665964237561094], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 169.0, 133, 398, 135.5, 398.0, 398.0, 398.0, 0.03917862022694216, 0.029116142570999003, 0.019665830856101824], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 176.125, 133, 399, 139.0, 399.0, 399.0, 399.0, 0.03957457333663121, 0.031149517684887457, 0.014067524115755627], "isController": false}, {"data": ["deleteAccount", 12, 1, 8.333333333333334, 704.1666666666666, 164, 1290, 625.5, 1266.6000000000001, 1290.0, 1290.0, 0.09276724697733386, 0.017431605897677727, 0.0631357817766474], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1709.5, 1101, 2610, 1672.5, 2306.3, 2567.5499999999993, 2610.0, 0.09614376114393595, 0.049761907623326225, 0.04422237451054085], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ec989938-d8c6-4f1f-b80e-8bb4e8afdfcd", 1, 0, 0.0, 787.0, 787, 787, 787.0, 787.0, 787.0, 787.0, 1.2706480304955527, 0.22956043519695044, 0.8760522554002541], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 370.875, 266, 808, 272.5, 808.0, 808.0, 808.0, 0.039102786562327393, 0.060601681908607014, 0.08794308345023437], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f4e899f1-9e2b-4b85-be88-44e04923e826", 3, 0, 0.0, 1045.6666666666667, 337, 2323, 477.0, 2323.0, 2323.0, 2323.0, 0.031689694511344915, 0.026418394415219502, 0.020321841857861154], "isController": false}, {"data": ["addBook", 60, 21, 35.0, 1360.1166666666668, 672, 4020, 1093.0, 2451.2, 2559.3999999999996, 4020.0, 0.26860540075925793, 76.0576390116888, 0.9759810462516116], "isController": true}, {"data": ["https://demoqa.com/books-0", 59, 0, 0.0, 249.44067796610173, 129, 563, 140.0, 538.0, 542.0, 563.0, 0.2539939471950889, 0.18875917364791275, 0.12278027720856348], "isController": false}, {"data": ["https://demoqa.com/books-3", 59, 0, 0.0, 870.8644067796613, 646, 1262, 797.0, 1186.0, 1202.0, 1262.0, 0.25346908965932036, 74.52832832570778, 0.12747713005327146], "isController": false}, {"data": ["https://demoqa.com/books-1", 59, 0, 0.0, 194.57627118644072, 131, 530, 137.0, 399.0, 420.0, 530.0, 0.2544737784180357, 0.45029930321628975, 0.12375775551970877], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/867e0aed-3e47-402a-bb79-31538b59dd7a", 3, 0, 0.0, 501.0, 249, 956, 298.0, 956.0, 956.0, 956.0, 0.07628928898382667, 0.03451891656494761, 0.04892249326111281], "isController": false}, {"data": ["https://demoqa.com/books-2", 59, 0, 0.0, 1255.4915254237285, 881, 1835, 1191.0, 1589.0, 1700.0, 1835.0, 0.25304403395078934, 227.6894665528862, 0.12701624360420483], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 146.33333333333334, 134, 205, 140.0, 179.8, 205.0, 205.0, 0.09241916403785488, 0.06904361375874901, 0.03285212471658123], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 21, 11.731843575418994, 216.4022346368715, 128, 3177, 142.0, 391.0, 488.0, 1620.999999999978, 0.7197224042749099, 1.5933501821420386, 0.34280816005379827], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 172.375, 133, 401, 142.0, 401.0, 401.0, 401.0, 0.0493403807843887, 0.03820988472853539, 0.01753896348195067], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2b8385d0-88fa-47a7-b05a-0222d679b665", 3, 0, 0.0, 588.3333333333334, 246, 941, 578.0, 941.0, 941.0, 941.0, 0.017241973861167628, 0.023769452897801073, 0.011056864748209709], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 21, 0, 0.0, 160.4761904761905, 134, 400, 140.0, 223.00000000000003, 382.9999999999998, 400.0, 0.11409571000130395, 0.0925913427842613, 0.04055745941452601], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/98b38f0d-2525-459d-a79a-5ff54cd7559d", 3, 0, 0.0, 598.0, 362, 883, 549.0, 883.0, 883.0, 883.0, 0.030568264028285837, 0.0254835039636849, 0.019602695356680692], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9a39058d-cbb0-457d-ac03-ed2b72ff9e08", 2, 0, 0.0, 807.0, 246, 1368, 807.0, 1368.0, 1368.0, 1368.0, 0.07527286413248024, 0.0442154568121942, 0.04678825978547234], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 535.875, 266, 1556, 284.0, 1556.0, 1556.0, 1556.0, 0.04831939117567119, 7.291373714628696, 0.1071260720864917], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 518.8333333333334, 266, 1585, 286.5, 996.4000000000009, 1585.0, 1585.0, 0.08379888268156424, 5.692245511813314, 0.18727449953445063], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 157.33333333333331, 133, 422, 139.0, 255.8000000000001, 422.0, 422.0, 0.06821871830672045, 0.056560245939849284, 0.024249622523092037], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=176193d3-0ab8-4060-af3e-a380737f3ce2", 1, 0, 0.0, 259.0, 259, 259, 259.0, 259.0, 259.0, 259.0, 3.8610038610038613, 0.6975446428571428, 2.6619811776061777], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 139.00000000000003, 134, 153, 138.0, 145.8, 153.0, 153.0, 0.09763294352476623, 0.07579901377166909, 0.03470546039356924], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f529d1ec-9414-422b-974f-186deeb8f1c7", 1, 0, 0.0, 226.0, 226, 226, 226.0, 226.0, 226.0, 226.0, 4.424778761061947, 1.4129908738938053, 2.6401756084070795], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 153.86666666666665, 128, 417, 135.0, 251.4000000000001, 417.0, 417.0, 0.08523986498005387, 0.06334720434552832, 0.04278641660131611], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 208.66666666666669, 129, 421, 135.0, 419.8, 421.0, 421.0, 0.08524325583774231, 0.022809230565958388, 0.0486152943449624], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 188.86666666666667, 129, 418, 134.0, 406.6, 418.0, 418.0, 0.08523841183791063, 0.02297441569068685, 0.05011086320939668], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 225.60000000000005, 131, 418, 139.0, 414.4, 418.0, 418.0, 0.08523938059383435, 0.022974676800681916, 0.05019467431453332], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 22.857142857142858, 0.5882352941176471], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 5.714285714285714, 0.14705882352941177], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 2.857142857142857, 0.07352941176470588], "isController": false}, {"data": ["401/Unauthorized", 24, 68.57142857142857, 1.7647058823529411], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1360, 35, "401/Unauthorized", 24, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 3, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 21, "401/Unauthorized", 21, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
