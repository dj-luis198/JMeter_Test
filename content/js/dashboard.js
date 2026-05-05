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

    var data = {"OkPercent": 99.30981595092024, "KoPercent": 0.6901840490797546};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7906746031746031, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.09821428571428571, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=270c3b01-f923-4077-be52-c5f5b35638c8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d9f6f407-abcb-49bf-842f-5ffd6fef5322"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=64fd0ba3-5494-4da5-b342-9bfbaf85028c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ca39507e-ebe4-4ca1-91e5-9e7a24603033"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/544210e9-3590-4ec4-9534-c84876a76143"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ee97826a-b057-4309-8af5-c550657595c7"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.875, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ad122c66-08c4-4a58-bff4-4731b436ec46"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0b4883b6-9966-4668-9314-04111d676bc7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ee97826a-b057-4309-8af5-c550657595c7"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6363636363636364, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9460cebb-1652-47bf-8197-32f589eeaf0c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f068d268-878f-409e-b735-a5e4f416e88e"], "isController": false}, {"data": [0.6944444444444444, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0042745b-85f3-40cd-8af7-6a266380d63b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cc777153-7d69-413b-ba99-5e4799225e5a"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/be07b823-dc89-4604-bdb3-4b5f8449c510"], "isController": false}, {"data": [0.8947368421052632, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "register"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ca39507e-ebe4-4ca1-91e5-9e7a24603033"], "isController": false}, {"data": [0.8947368421052632, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d9f6f407-abcb-49bf-842f-5ffd6fef5322"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=544210e9-3590-4ec4-9534-c84876a76143"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.4107142857142857, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/64fd0ba3-5494-4da5-b342-9bfbaf85028c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.625, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.29545454545454547, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c1ed0e90-f586-401b-8fcc-be2a5833b99a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0cd88a98-2a96-467d-93e6-8c617295e425"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f068d268-878f-409e-b735-a5e4f416e88e"], "isController": false}, {"data": [0.31666666666666665, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e92b6fa3-7cae-4771-9039-6b1928daee1f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0b4883b6-9966-4668-9314-04111d676bc7"], "isController": false}, {"data": [0.5357142857142857, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=803d31ac-37c4-40b3-a7bb-234c507eb897"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/803d31ac-37c4-40b3-a7bb-234c507eb897"], "isController": false}, {"data": [0.9573863636363636, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7e8c9f2b-e4bb-4555-9046-e914cc0def19"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/0cd88a98-2a96-467d-93e6-8c617295e425"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9460cebb-1652-47bf-8197-32f589eeaf0c"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=be07b823-dc89-4604-bdb3-4b5f8449c510"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/270c3b01-f923-4077-be52-c5f5b35638c8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1304, 9, 0.6901840490797546, 369.9332822085894, 98, 2723, 127.5, 1021.0, 1215.75, 1665.2500000000007, 5.14124627910186, 739.1610552873716, 3.749039743381237], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1688.785714285714, 1330, 2298, 1636.0, 2014.3, 2104.9, 2298.0, 0.2429100625493411, 292.3035049739631, 1.1943868798202466], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=270c3b01-f923-4077-be52-c5f5b35638c8", 1, 0, 0.0, 240.0, 240, 240, 240.0, 240.0, 240.0, 240.0, 4.166666666666667, 0.7527669270833334, 2.872721354166667], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d9f6f407-abcb-49bf-842f-5ffd6fef5322", 1, 0, 0.0, 468.0, 468, 468, 468.0, 468.0, 468.0, 468.0, 2.136752136752137, 0.38603432158119655, 1.473190438034188], "isController": false}, {"data": ["deleteBook", 12, 0, 0.0, 588.9166666666666, 420, 1495, 469.0, 1280.8000000000006, 1495.0, 1495.0, 0.07467609244900245, 0.013491286233462359, 0.05075640658643136], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 0, 0.0, 588.9166666666666, 420, 1495, 469.0, 1280.8000000000006, 1495.0, 1495.0, 0.07535605737107835, 0.013614131458642084, 0.051218570244404814], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 112.78947368421052, 99, 294, 102.0, 111.0, 294.0, 294.0, 0.09753242953281965, 0.041517453813261336, 0.05476173212461565], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 127.84210526315789, 100, 303, 104.0, 300.0, 303.0, 303.0, 0.09753042692661092, 0.07248110829213956, 0.048955702578396494], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 228.42105263157893, 101, 794, 104.0, 786.0, 794.0, 794.0, 0.09743589743589744, 3.0392227564102563, 0.056495392628205125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 275.7894736842105, 101, 1209, 104.0, 1074.0, 1209.0, 1209.0, 0.09743389879181966, 9.252043788204345, 0.05639908348033887], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=64fd0ba3-5494-4da5-b342-9bfbaf85028c", 1, 0, 0.0, 388.0, 388, 388, 388.0, 388.0, 388.0, 388.0, 2.577319587628866, 0.46562902706185566, 1.7769410438144329], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ca39507e-ebe4-4ca1-91e5-9e7a24603033", 1, 0, 0.0, 821.0, 821, 821, 821.0, 821.0, 821.0, 821.0, 1.2180267965895248, 0.22005366930572473, 0.8397723812423874], "isController": false}, {"data": ["goToProfile", 12, 0, 0.0, 273.49999999999994, 189, 443, 228.5, 432.20000000000005, 443.0, 443.0, 0.07543706348657535, 0.1583638093831134, 0.04876888283995398], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 114.21052631578947, 101, 307, 103.0, 109.0, 307.0, 307.0, 0.11232700163760945, 0.08347739086544999, 0.05638288949387818], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 134.89473684210526, 99, 309, 102.0, 309.0, 309.0, 309.0, 0.11233098620693732, 0.056696663474101794, 0.06257417909697711], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 728.5, 605, 810, 749.5, 810.0, 810.0, 810.0, 0.0585600093696015, 17.21858712997394, 0.03339750534360086], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1111.5, 1106, 1120, 1110.0, 1120.0, 1120.0, 1120.0, 0.058131930416079294, 52.307213173422085, 0.03309659710212327], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 102.0, 101, 104, 101.5, 104.0, 104.0, 104.0, 0.05899530987286511, 0.10439404442346832, 0.03266634833780714], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/544210e9-3590-4ec4-9534-c84876a76143", 3, 0, 0.0, 829.3333333333334, 204, 1263, 1021.0, 1263.0, 1263.0, 1263.0, 0.07112206917806596, 0.03218088416585667, 0.04560887899765297], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 147.93333333333334, 101, 307, 105.0, 300.4, 307.0, 307.0, 0.07782262666929535, 0.05783497938997437, 0.039063310652361134], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 180.7333333333333, 98, 306, 103.0, 304.8, 306.0, 306.0, 0.07782545307384597, 0.0364097464706157, 0.04351334576811128], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 282.86666666666673, 99, 1115, 104.0, 1030.4, 1115.0, 1115.0, 0.07774639127167181, 9.34567300839661, 0.04481553048954311], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 269.3333333333333, 101, 845, 112.0, 824.6, 845.0, 845.0, 0.07774195889005214, 3.06598899433002, 0.044888895403377115], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 102.5, 102, 103, 102.5, 103.0, 103.0, 103.0, 0.05899443977405129, 0.043842547527395546, 0.03312676061531201], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 698.5555555555554, 100, 1319, 983.0, 1298.3, 1319.0, 1319.0, 0.14571359184003888, 72.85820309337812, 0.07870684246741683], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 247.21052631578942, 100, 1025, 103.0, 1012.0, 1025.0, 1025.0, 0.11232965798575187, 15.984615409485944, 0.06451334284194034], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ee97826a-b057-4309-8af5-c550657595c7", 3, 0, 0.0, 319.0, 196, 551, 210.0, 551.0, 551.0, 551.0, 0.08680806736306028, 0.03927838985503053, 0.055667933823316654], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 508.16666666666674, 98, 916, 701.0, 915.1, 916.0, 916.0, 0.14571359184003888, 23.82002980045333, 0.07884914089694811], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 224.73684210526315, 100, 910, 103.0, 812.0, 910.0, 910.0, 0.1123289938869379, 5.240514758699585, 0.0646226577187755], "isController": false}, {"data": ["deleteBooks", 12, 0, 0.0, 476.6666666666666, 240, 821, 433.5, 812.3000000000001, 821.0, 821.0, 0.07588021044111695, 0.013708827081647106, 0.05231584821428571], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ad122c66-08c4-4a58-bff4-4731b436ec46", 1, 0, 0.0, 210.0, 210, 210, 210.0, 210.0, 210.0, 210.0, 4.761904761904763, 1.5206473214285714, 2.8413318452380953], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0b4883b6-9966-4668-9314-04111d676bc7", 3, 0, 0.0, 382.0, 192, 541, 413.0, 541.0, 541.0, 541.0, 0.09094767477111503, 0.04115145440489905, 0.05832256487600801], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ee97826a-b057-4309-8af5-c550657595c7", 1, 0, 0.0, 453.0, 453, 453, 453.0, 453.0, 453.0, 453.0, 2.207505518763797, 0.3988169150110375, 1.5219715783664458], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 487.19999999999993, 205, 1270, 409.0, 1238.8, 1270.0, 1270.0, 0.0776996752153576, 12.498473322787762, 0.17209769860036986], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 707.5454545454546, 124, 1726, 692.5, 1316.8, 1666.5999999999992, 1726.0, 0.09954661043791459, 0.06114728316938308, 0.04500984436792427], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 114.61111111111111, 100, 305, 103.5, 126.80000000000028, 305.0, 305.0, 0.1457100531841694, 0.1082864750714384, 0.07313961653971003], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 137.2777777777778, 98, 314, 103.0, 313.1, 314.0, 314.0, 0.14571831031523727, 0.16058107200103622, 0.07630605095283584], "isController": false}, {"data": ["login", 22, 0, 0.0, 2781.863636363636, 1732, 3710, 2910.5, 3501.7, 3679.2499999999995, 3710.0, 0.09750390015600624, 21.344663268064814, 0.17650941300436107], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 129.6315789473684, 103, 319, 106.0, 297.0, 319.0, 319.0, 0.11215460807867352, 0.09079704111056675, 0.039867458340465976], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9460cebb-1652-47bf-8197-32f589eeaf0c", 3, 0, 0.0, 280.0, 208, 392, 240.0, 392.0, 392.0, 392.0, 0.030433371205973055, 0.030522531473178058, 0.019516191821538714], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f068d268-878f-409e-b735-a5e4f416e88e", 1, 0, 0.0, 430.0, 430, 430, 430.0, 430.0, 430.0, 430.0, 2.3255813953488373, 0.42014898255813954, 1.6033793604651163], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 825.3888888888888, 203, 1423, 1086.5, 1403.2, 1423.0, 1423.0, 0.1455886634960691, 96.86397974699926, 0.3067377472985215], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0042745b-85f3-40cd-8af7-6a266380d63b", 1, 0, 0.0, 442.0, 442, 442, 442.0, 442.0, 442.0, 442.0, 2.2624434389140275, 0.7224794966063348, 1.349954044117647], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cc777153-7d69-413b-ba99-5e4799225e5a", 1, 0, 0.0, 244.0, 244, 244, 244.0, 244.0, 244.0, 244.0, 4.0983606557377055, 1.3087538422131149, 2.445408555327869], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/be07b823-dc89-4604-bdb3-4b5f8449c510", 3, 0, 0.0, 658.6666666666666, 390, 1179, 407.0, 1179.0, 1179.0, 1179.0, 0.047152018106374954, 0.0303142043489878, 0.030237459527851125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 437.0, 204, 1312, 405.0, 1177.0, 1312.0, 1312.0, 0.09738146369465274, 12.398413154634076, 0.21639046154969785], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 0, 0.0, 1214.25, 1208, 1223, 1213.0, 1223.0, 1223.0, 1223.0, 0.05804504295333179, 69.44205109414905, 0.13088476970629206], "isController": false}, {"data": ["register", 22, 4, 18.181818181818183, 1093.863636363636, 236, 1858, 1011.0, 1739.5, 1844.9499999999998, 1858.0, 0.10012880204990966, 0.031823607185606936, 0.04517529936236158], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ca39507e-ebe4-4ca1-91e5-9e7a24603033", 3, 0, 0.0, 310.6666666666667, 189, 520, 223.0, 520.0, 520.0, 520.0, 0.027862138140480903, 0.02794376549831434, 0.017867321659097452], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 373.42105263157896, 204, 1127, 209.0, 1116.0, 1127.0, 1127.0, 0.11225864391558149, 21.351829483551153, 0.2479372012590693], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 112.58823529411765, 103, 171, 106.0, 138.19999999999996, 171.0, 171.0, 0.09209250421187776, 0.07149759848480744, 0.03273600735656592], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d9f6f407-abcb-49bf-842f-5ffd6fef5322", 3, 0, 0.0, 382.3333333333333, 325, 456, 366.0, 456.0, 456.0, 456.0, 0.019992136426338975, 0.023630028438814066, 0.012820478111942635], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=544210e9-3590-4ec4-9534-c84876a76143", 1, 0, 0.0, 424.0, 424, 424, 424.0, 424.0, 424.0, 424.0, 2.3584905660377355, 0.4260944870283019, 1.626068691037736], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 291.7333333333333, 201, 414, 212.0, 414.0, 414.0, 414.0, 0.08853579502192736, 0.1372131901365222, 0.19911907806201046], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 125.60000000000001, 100, 320, 104.5, 298.9000000000001, 320.0, 320.0, 0.06949946485412062, 0.05164950464256425, 0.034885473569353516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 173.79999999999998, 102, 409, 103.5, 398.50000000000006, 409.0, 409.0, 0.06950043090267159, 0.018596794987628926, 0.039636964499179896], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 142.79999999999998, 99, 309, 102.5, 308.6, 309.0, 309.0, 0.06950236308034473, 0.018733058798999166, 0.04085978767028079], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 120.7, 98, 297, 102.0, 277.70000000000005, 297.0, 297.0, 0.0695028461415495, 0.018733188999089514, 0.04092794553061948], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1140.5535714285713, 793, 1822, 1099.0, 1587.1000000000001, 1647.9999999999998, 1822.0, 0.24383553293303667, 291.7120683349081, 0.48147992928769545], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 4, 18.181818181818183, 1093.863636363636, 236, 1858, 1011.0, 1739.5, 1844.9499999999998, 1858.0, 0.09804008948386349, 0.03115975855399781, 0.044232930997602476], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 3, 0, 0.0, 101.66666666666667, 100, 103, 102.0, 103.0, 103.0, 103.0, 0.01675837220344664, 0.004516905007960227, 0.0098684555065218], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/64fd0ba3-5494-4da5-b342-9bfbaf85028c", 3, 0, 0.0, 346.6666666666667, 192, 443, 405.0, 443.0, 443.0, 443.0, 0.034848872058174385, 0.03495096836303232, 0.022347746730014172], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 3, 0, 0.0, 168.33333333333334, 104, 296, 105.0, 296.0, 296.0, 296.0, 0.016740324092674435, 0.004512040478103656, 0.00984147959354493], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 197.2941176470588, 101, 1105, 102.0, 467.3999999999994, 1105.0, 1105.0, 0.09424234696705953, 5.012108798978303, 0.054927783336844324], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 179.64705882352942, 98, 603, 105.0, 363.7999999999998, 603.0, 603.0, 0.09424339187511088, 1.6539477066979333, 0.05502042690870588], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 3, 0, 0.0, 168.33333333333331, 100, 301, 104.0, 301.0, 301.0, 301.0, 0.016739857041620867, 0.004479219559964958, 0.009546949719049399], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 103.82352941176472, 100, 111, 103.0, 109.4, 111.0, 111.0, 0.09424130208217842, 0.07003674891068142, 0.04730471608421846], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 3, 0, 0.0, 105.33333333333333, 102, 111, 103.0, 111.0, 111.0, 111.0, 0.016757623322142964, 0.012453663425928511, 0.008411541394122543], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 161.52941176470588, 99, 307, 105.0, 306.2, 307.0, 307.0, 0.09424391433782563, 0.03354407704717185, 0.053282893205013775], "isController": false}, {"data": ["deleteAccount", 12, 0, 0.0, 754.6666666666667, 390, 2109, 545.0, 1856.1000000000008, 2109.0, 2109.0, 0.07575661923460562, 0.013686498592189494, 0.05156480820949231], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 3, 0, 0.0, 108.33333333333333, 105, 114, 106.0, 114.0, 114.0, 114.0, 0.015938286952918303, 0.012545175082082178, 0.0056655629402951775], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1489.8181818181818, 1012, 2723, 1330.5, 2191.1, 2646.949999999999, 2723.0, 0.09940582427761335, 0.0514502801436866, 0.0457227961276913], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 3, 0, 0.0, 276.0, 208, 404, 216.0, 404.0, 404.0, 404.0, 0.01672940192388122, 0.025927305520702635, 0.03762481702216646], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c1ed0e90-f586-401b-8fcc-be2a5833b99a", 1, 0, 0.0, 190.0, 190, 190, 190.0, 190.0, 190.0, 190.0, 5.263157894736842, 1.6807154605263157, 3.1404194078947367], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0cd88a98-2a96-467d-93e6-8c617295e425", 1, 0, 0.0, 792.0, 792, 792, 792.0, 792.0, 792.0, 792.0, 1.2626262626262628, 0.2281111900252525, 0.8705216224747474], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f068d268-878f-409e-b735-a5e4f416e88e", 3, 0, 0.0, 829.3333333333334, 256, 1266, 966.0, 1266.0, 1266.0, 1266.0, 0.022973542137305205, 0.027153949056170308, 0.014732382164873454], "isController": false}, {"data": ["addBook", 60, 5, 8.333333333333334, 1114.1833333333336, 522, 2741, 917.0, 1851.8, 2027.6, 2741.0, 0.2911066906021057, 105.61508038789965, 1.055503394728543], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 184.6785714285714, 98, 426, 104.0, 414.3, 422.15, 426.0, 0.24477450149050187, 0.18190761292409366, 0.11832361156035003], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e92b6fa3-7cae-4771-9039-6b1928daee1f", 1, 0, 0.0, 185.0, 185, 185, 185.0, 185.0, 185.0, 185.0, 5.405405405405405, 1.7261402027027026, 3.2252956081081083], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0b4883b6-9966-4668-9314-04111d676bc7", 1, 0, 0.0, 293.0, 293, 293, 293.0, 293.0, 293.0, 293.0, 3.4129692832764507, 0.6166008959044369, 2.353082337883959], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 647.3214285714284, 491, 919, 600.5, 839.2000000000003, 911.45, 919.0, 0.24469428507758123, 71.94824442774309, 0.12306402032710383], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=803d31ac-37c4-40b3-a7bb-234c507eb897", 1, 0, 0.0, 579.0, 579, 579, 579.0, 579.0, 579.0, 579.0, 1.7271157167530224, 0.31202774179620035, 1.1907653281519863], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 150.55357142857142, 100, 420, 105.5, 304.0, 308.15, 420.0, 0.24515168760670664, 0.43380357221030513, 0.11922416057435538], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 954.4464285714284, 691, 1404, 958.5, 1205.3, 1224.6499999999999, 1404.0, 0.24432063593171235, 219.84013768122264, 0.12263750670791032], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 122.0, 102, 304, 107.0, 194.80000000000007, 304.0, 304.0, 0.09098242826035531, 0.06797027111247249, 0.03234141004567318], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/803d31ac-37c4-40b3-a7bb-234c507eb897", 3, 0, 0.0, 648.6666666666666, 201, 1131, 614.0, 1131.0, 1131.0, 1131.0, 0.021274332517817254, 0.02932838483494664, 0.0136427197461263], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 5, 2.840909090909091, 182.15340909090904, 100, 1179, 111.0, 318.6, 415.3000000000001, 942.6099999999968, 0.7211607409926615, 1.565494699366116, 0.34749956848158786], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 156.60000000000002, 103, 300, 107.5, 299.7, 300.0, 300.0, 0.06999713011766517, 0.05420676189776219, 0.024881792346513793], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 108.10526315789474, 101, 120, 107.0, 114.0, 120.0, 120.0, 0.0996089039875017, 0.08083496016954483, 0.035407852589307245], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7e8c9f2b-e4bb-4555-9046-e914cc0def19", 1, 0, 0.0, 312.0, 312, 312, 312.0, 312.0, 312.0, 312.0, 3.205128205128205, 1.0235126201923077, 1.9124348958333333], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0cd88a98-2a96-467d-93e6-8c617295e425", 3, 0, 0.0, 941.6666666666666, 357, 2109, 359.0, 2109.0, 2109.0, 2109.0, 0.030246509048747292, 0.03575034972526087, 0.019396361597015677], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9460cebb-1652-47bf-8197-32f589eeaf0c", 1, 0, 0.0, 395.0, 395, 395, 395.0, 395.0, 395.0, 395.0, 2.5316455696202533, 0.4573773734177215, 1.7454509493670884], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 299.9, 204, 622, 210.0, 611.0, 622.0, 622.0, 0.06944926731022988, 0.10763280002083478, 0.15619302989790956], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 338.47058823529414, 203, 1216, 212.0, 577.5999999999995, 1216.0, 1216.0, 0.09418647814596688, 6.765606041508535, 0.21041003840869177], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 106.06666666666668, 100, 113, 106.0, 110.6, 113.0, 113.0, 0.0757174225789354, 0.06277743336866813, 0.026915177557355948], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=be07b823-dc89-4604-bdb3-4b5f8449c510", 1, 0, 0.0, 437.0, 437, 437, 437.0, 437.0, 437.0, 437.0, 2.288329519450801, 0.41341890732265446, 1.577695938215103], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 123.88888888888889, 103, 315, 108.0, 171.90000000000023, 315.0, 315.0, 0.13959440071348247, 0.1083765122726744, 0.04962144712862073], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/270c3b01-f923-4077-be52-c5f5b35638c8", 3, 0, 0.0, 324.0, 206, 549, 217.0, 549.0, 549.0, 549.0, 0.054408937574812286, 0.025220809604991113, 0.034891148119264394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 106.86666666666667, 99, 164, 103.0, 131.00000000000003, 164.0, 164.0, 0.08859017594008942, 0.06583703504922661, 0.0444681156574277], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 169.4, 98, 307, 104.0, 307.0, 307.0, 307.0, 0.08859017594008942, 0.02370479317146924, 0.05052408471583225], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 142.60000000000005, 98, 309, 102.0, 307.8, 309.0, 309.0, 0.0885886063240453, 0.023877397798277838, 0.05208041113972195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 143.13333333333333, 100, 308, 103.0, 305.6, 308.0, 308.0, 0.08858965272856131, 0.02387767983699504, 0.052167539643869595], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 44.44444444444444, 0.3067484662576687], "isController": false}, {"data": ["401/Unauthorized", 5, 55.55555555555556, 0.3834355828220859], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1304, 9, "401/Unauthorized", 5, "406/Not Acceptable", 4, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
