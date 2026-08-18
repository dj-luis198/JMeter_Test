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

    var data = {"OkPercent": 99.67871485943775, "KoPercent": 0.321285140562249};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.707147814018043, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/7e575a11-6430-4098-9a75-f985fa2e1be0"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.4090909090909091, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4090909090909091, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/f27e7121-428d-4fc7-b24f-958f1de672d9"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/fb166aa8-485b-414b-bd5f-68b6358fff21"], "isController": false}, {"data": [0.5, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/edd1606e-50c7-4666-af42-4709d8ef27fc"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a3775d97-b918-403d-8126-f908f1bebcaa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2a5dbf4c-7d52-45ec-98e4-a068a74a109d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.32142857142857145, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/7b22d14f-e6da-4d07-a8a0-b07334300b13"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.4090909090909091, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/4a023103-7b19-486a-90b3-30723f1c4865"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/30edfb99-ef4f-4602-bd18-716d36d27340"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/f1f53030-5a8c-493f-a473-6a1e99d1193f"], "isController": false}, {"data": [0.45, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a5c58719-a5c0-48f5-805f-f3bc2ca198b8"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/c13e37f8-186d-41d1-9f8f-6abf89edaf35"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/479ebf4e-59c1-4962-b732-34bbeebdd715"], "isController": false}, {"data": [0.32142857142857145, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8bd1f701-2034-4eb3-86b2-8b264373b5e2"], "isController": false}, {"data": [0.7105263157894737, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/a0b87ee1-7728-46ba-94da-4f1b858c9296"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/2a5dbf4c-7d52-45ec-98e4-a068a74a109d"], "isController": false}, {"data": [0.8157894736842105, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fb166aa8-485b-414b-bd5f-68b6358fff21"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/e4146bd8-d1d9-4112-bcd2-bef34deaa156"], "isController": false}, {"data": [0.6842105263157895, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f27e7121-428d-4fc7-b24f-958f1de672d9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.125, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.24107142857142858, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7e575a11-6430-4098-9a75-f985fa2e1be0"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4a023103-7b19-486a-90b3-30723f1c4865"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.990909090909091, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.35454545454545455, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9041916167664671, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=edd1606e-50c7-4666-af42-4709d8ef27fc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c13e37f8-186d-41d1-9f8f-6abf89edaf35"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a3775d97-b918-403d-8126-f908f1bebcaa"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/317a7e5e-b7a2-4ebf-a3ea-a0aa3c2b2932"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/8bd1f701-2034-4eb3-86b2-8b264373b5e2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/a5c58719-a5c0-48f5-805f-f3bc2ca198b8"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a0b87ee1-7728-46ba-94da-4f1b858c9296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1245, 4, 0.321285140562249, 581.8738955823294, 138, 8049, 168.0, 1464.8000000000015, 1831.6000000000004, 4052.399999999998, 4.916129643669446, 702.3364248557738, 3.589956935740855], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/7e575a11-6430-4098-9a75-f985fa2e1be0", 3, 0, 0.0, 582.3333333333334, 502, 711, 534.0, 711.0, 711.0, 711.0, 0.028543700405320546, 0.028627324527601757, 0.018304391210443187], "isController": false}, {"data": ["see books", 55, 0, 0.0, 2331.618181818182, 1717, 3386, 2306.0, 2872.0, 3155.7999999999993, 3386.0, 0.24930534465330695, 299.99830196146644, 1.225832431962305], "isController": true}, {"data": ["deleteBook", 11, 0, 0.0, 1767.6363636363637, 465, 5562, 1239.0, 5480.6, 5562.0, 5562.0, 0.0701222038771204, 0.012668562223893821, 0.04766118544773027], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 11, 0, 0.0, 1767.6363636363637, 465, 5562, 1239.0, 5480.6, 5562.0, 5562.0, 0.07264082414316846, 0.013123586393052895, 0.04937306015980981], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 220.36842105263156, 141, 444, 143.0, 432.0, 444.0, 444.0, 0.13039330739192795, 0.045198009100080296, 0.07378856467851187], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 159.78947368421055, 141, 429, 145.0, 150.0, 429.0, 429.0, 0.13039509714434735, 0.09690495012387533, 0.06545222649628374], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 226.89473684210523, 140, 1139, 144.0, 424.0, 1139.0, 1139.0, 0.13039688694589902, 2.051244368055508, 0.07619665952343369], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 286.7368421052632, 140, 1440, 144.0, 435.0, 1440.0, 1440.0, 0.13039420226199624, 6.2085025276744545, 0.07606775265592403], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f27e7121-428d-4fc7-b24f-958f1de672d9", 3, 0, 0.0, 1645.0, 236, 2365, 2334.0, 2365.0, 2365.0, 2365.0, 0.02740026304252521, 0.027480537250657605, 0.01757113222453602], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fb166aa8-485b-414b-bd5f-68b6358fff21", 3, 0, 0.0, 668.0, 231, 1029, 744.0, 1029.0, 1029.0, 1029.0, 0.042840618618532854, 0.02754238989961015, 0.02747266233024405], "isController": false}, {"data": ["goToProfile", 11, 0, 0.0, 1317.909090909091, 231, 5508, 571.0, 4938.000000000002, 5508.0, 5508.0, 0.06976419701409237, 0.16170751241485595, 0.04510146330403237], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/edd1606e-50c7-4666-af42-4709d8ef27fc", 3, 0, 0.0, 739.6666666666666, 244, 1056, 919.0, 1056.0, 1056.0, 1056.0, 0.022547575384060367, 0.026650470774584375, 0.014459219891471005], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a3775d97-b918-403d-8126-f908f1bebcaa", 3, 0, 0.0, 516.3333333333334, 453, 558, 538.0, 558.0, 558.0, 558.0, 0.018067717806338156, 0.024907807587839222, 0.011586394556798883], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 158.73684210526315, 140, 425, 144.0, 148.0, 425.0, 425.0, 0.10011750633638428, 0.07440373273631684, 0.0502542951727554], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 203.1578947368421, 138, 436, 144.0, 426.0, 436.0, 436.0, 0.09997211304215141, 0.04255597451763456, 0.05613154620027045], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 1148.3333333333333, 1144, 1153, 1148.0, 1153.0, 1153.0, 1153.0, 0.23200061866831645, 68.21588503402675, 0.13231285283427424], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 1519.3333333333333, 1287, 1750, 1521.0, 1750.0, 1750.0, 1750.0, 0.22168033695411216, 199.46835686377744, 0.12621058246508535], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 238.33333333333334, 143, 427, 145.0, 427.0, 427.0, 427.0, 0.25150905432595577, 0.44505313128772633, 0.13926331426056338], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 171.9090909090909, 141, 431, 146.0, 375.4000000000002, 431.0, 431.0, 0.062266500622665005, 0.04627422556039851, 0.03125486457036115], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 199.0, 139, 438, 144.0, 436.6, 438.0, 438.0, 0.06225698551676128, 0.01665860745272714, 0.035505937052527914], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 146.0, 141, 164, 143.0, 162.0, 164.0, 164.0, 0.06225874735400324, 0.016780677997758685, 0.03660133389366206], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 170.72727272727272, 141, 424, 144.0, 370.6000000000002, 424.0, 424.0, 0.06226121409367483, 0.01678134286118579, 0.036663586033677656], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2a5dbf4c-7d52-45ec-98e4-a068a74a109d", 1, 0, 0.0, 1292.0, 1292, 1292, 1292.0, 1292.0, 1292.0, 1292.0, 0.7739938080495357, 0.1398328657120743, 0.5336324496904025], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 146.33333333333334, 144, 149, 146.0, 149.0, 149.0, 149.0, 0.2514247401944351, 0.18684983133590344, 0.14118088438652363], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 1176.2142857142856, 143, 1681, 1563.0, 1680.5, 1681.0, 1681.0, 0.08093748735351759, 52.02601390462673, 0.04261412908372983], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 283.05263157894734, 140, 1393, 144.0, 1270.0, 1393.0, 1393.0, 0.10012119934657744, 9.50722214720451, 0.05795461282078305], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7b22d14f-e6da-4d07-a8a0-b07334300b13", 1, 0, 0.0, 833.0, 833, 833, 833.0, 833.0, 833.0, 833.0, 1.2004801920768307, 0.38335646758703484, 0.7163021458583434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 813.5714285714286, 141, 1161, 1052.0, 1158.0, 1161.0, 1161.0, 0.08093842320388968, 17.005221431627266, 0.04269366324412763], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 277.52631578947376, 140, 1153, 144.0, 847.0, 1153.0, 1153.0, 0.09997316509778954, 3.1183652677439215, 0.05796655404338836], "isController": false}, {"data": ["deleteBooks", 11, 0, 0.0, 1864.2727272727273, 254, 6495, 1229.0, 5934.600000000002, 6495.0, 6495.0, 0.07257229189895298, 0.013111205079400685, 0.05003519343814531], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/4a023103-7b19-486a-90b3-30723f1c4865", 3, 0, 0.0, 878.6666666666666, 241, 1766, 629.0, 1766.0, 1766.0, 1766.0, 0.06069925542246682, 0.027464832368889608, 0.03892497824943347], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/30edfb99-ef4f-4602-bd18-716d36d27340", 1, 0, 0.0, 548.0, 548, 548, 548.0, 548.0, 548.0, 548.0, 1.8248175182481752, 0.5827298129562043, 1.0888315465328466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 372.6363636363636, 285, 869, 293.0, 811.0000000000002, 869.0, 869.0, 0.06220699093474487, 0.0964086861459376, 0.13990498058859124], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f1f53030-5a8c-493f-a473-6a1e99d1193f", 1, 0, 0.0, 574.0, 574, 574, 574.0, 574.0, 574.0, 574.0, 1.7421602787456445, 0.5563343858885018, 1.0395116506968642], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 1069.75, 270, 2618, 779.5, 2034.8, 2588.95, 2618.0, 0.08735455466648032, 0.05365821766134386, 0.0394972254009574], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 145.3571428571429, 141, 151, 146.0, 149.5, 151.0, 151.0, 0.08093608361853669, 0.060148788704791414, 0.040626120097585795], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 224.14285714285714, 140, 431, 145.5, 429.5, 431.0, 431.0, 0.08093842320388968, 0.10849000699539228, 0.04130479242185106], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a5c58719-a5c0-48f5-805f-f3bc2ca198b8", 1, 0, 0.0, 265.0, 265, 265, 265.0, 265.0, 265.0, 265.0, 3.7735849056603774, 0.681751179245283, 2.6017099056603774], "isController": false}, {"data": ["login", 20, 0, 0.0, 5046.349999999999, 1551, 12978, 4131.0, 10068.200000000003, 12837.449999999997, 12978.0, 0.08954475446828325, 16.194654171162558, 0.15737665489899352], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 163.42105263157893, 142, 447, 146.0, 161.0, 447.0, 447.0, 0.1037570991699432, 0.08399866719910441, 0.03688240634556575], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c13e37f8-186d-41d1-9f8f-6abf89edaf35", 3, 0, 0.0, 3970.333333333333, 368, 6035, 5508.0, 6035.0, 6035.0, 6035.0, 0.02515659983396644, 0.025230300810042516, 0.01613232476331832], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/479ebf4e-59c1-4962-b732-34bbeebdd715", 1, 0, 0.0, 406.0, 406, 406, 406.0, 406.0, 406.0, 406.0, 2.4630541871921183, 0.7865417179802955, 1.4696544027093594], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 1322.857142857143, 286, 1826, 1713.0, 1825.0, 1826.0, 1826.0, 0.0808692286808496, 69.14131771353809, 0.16709739759933917], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8bd1f701-2034-4eb3-86b2-8b264373b5e2", 1, 0, 0.0, 1885.0, 1885, 1885, 1885.0, 1885.0, 1885.0, 1885.0, 0.5305039787798408, 0.09584300397877984, 0.36575762599469497], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 510.0526315789473, 284, 1590, 570.0, 864.0, 1590.0, 1590.0, 0.1302654673102238, 8.393512372648367, 0.2912158974433688], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 3, 0, 0.0, 1665.6666666666667, 1436, 1896, 1665.0, 1896.0, 1896.0, 1896.0, 0.2192661891536325, 262.3185914888174, 0.49441956128489983], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a0b87ee1-7728-46ba-94da-4f1b858c9296", 3, 0, 0.0, 839.6666666666667, 278, 1670, 571.0, 1670.0, 1670.0, 1670.0, 0.024428177087998437, 0.02449974401306093, 0.015665204708124], "isController": false}, {"data": ["register", 21, 3, 14.285714285714286, 1588.0, 342, 3643, 1375.0, 3029.6000000000004, 3592.7999999999993, 3643.0, 0.0843444627860181, 0.02692245129107274, 0.038053849421035506], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/2a5dbf4c-7d52-45ec-98e4-a068a74a109d", 3, 0, 0.0, 863.0, 699, 1036, 854.0, 1036.0, 1036.0, 1036.0, 0.017152364453439907, 0.0236459190951556, 0.010999400381925982], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 488.8421052631579, 287, 1539, 293.0, 1413.0, 1539.0, 1539.0, 0.0998932719252588, 12.718211553905563, 0.22197192769041496], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 154.06666666666666, 145, 179, 149.0, 170.0, 179.0, 179.0, 0.08568246080027418, 0.06652105110958786, 0.030457437237597463], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fb166aa8-485b-414b-bd5f-68b6358fff21", 1, 0, 0.0, 505.0, 505, 505, 505.0, 505.0, 505.0, 505.0, 1.9801980198019802, 0.3577506188118812, 1.3652537128712872], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e4146bd8-d1d9-4112-bcd2-bef34deaa156", 1, 0, 0.0, 4020.0, 4020, 4020, 4020.0, 4020.0, 4020.0, 4020.0, 0.24875621890547261, 0.07943680037313433, 0.148427782960199], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 515.6842105263157, 288, 1690, 569.0, 598.0, 1690.0, 1690.0, 0.08534262819361098, 5.498958553240325, 0.19078832305104387], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 201.0, 140, 436, 145.0, 434.5, 436.0, 436.0, 0.05656524518205524, 0.042037257405804725, 0.02839310158552382], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 227.5, 141, 426, 144.0, 425.9, 426.0, 426.0, 0.056566525061798933, 0.015135964713801667, 0.0322605963243072], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 170.49999999999997, 140, 419, 143.0, 391.7000000000001, 419.0, 419.0, 0.05656716502339052, 0.015246618697710726, 0.03325530600007919], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 199.6, 138, 440, 142.5, 438.4, 440.0, 440.0, 0.05656684504078469, 0.015246532452398999, 0.03331035894491521], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1593.9818181818184, 1118, 2767, 1421.0, 2279.2, 2560.5999999999995, 2767.0, 0.24059808308945435, 287.8389528023115, 0.4750872304754655], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 3, 14.285714285714286, 1588.0, 342, 3643, 1375.0, 3029.6000000000004, 3592.7999999999993, 3643.0, 0.08537036510059476, 0.02724991564594877, 0.0385167076918699], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 4, 0, 0.0, 284.5, 141, 431, 283.0, 431.0, 431.0, 431.0, 0.021462451441203616, 0.005784801365011911, 0.012638533417036893], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 4, 0, 0.0, 144.25, 144, 145, 144.0, 145.0, 145.0, 145.0, 0.021494167020424833, 0.0057933497047238805, 0.012636219283491942], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 365.9333333333333, 139, 1554, 145.0, 1506.6000000000001, 1554.0, 1554.0, 0.08172872601261892, 9.82437816358277, 0.047111076830451036], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 343.53333333333336, 141, 1142, 145.0, 1133.6, 1142.0, 1142.0, 0.08173006195138696, 3.2232718859484226, 0.04719166142232102], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 4, 0, 0.0, 212.5, 143, 421, 143.0, 421.0, 421.0, 421.0, 0.021462336282616044, 0.0057428517006218715, 0.012240238661179464], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 162.80000000000004, 141, 429, 143.0, 259.80000000000007, 429.0, 429.0, 0.08173050727401514, 0.060739175815942896, 0.04102488353402713], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f27e7121-428d-4fc7-b24f-958f1de672d9", 1, 0, 0.0, 3466.0, 3466, 3466, 3466.0, 3466.0, 3466.0, 3466.0, 0.28851702250432776, 0.05212465738603577, 0.19891896278130408], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 4, 0, 0.0, 147.25, 144, 151, 147.0, 151.0, 151.0, 151.0, 0.021493820526598602, 0.015973434981192906, 0.010788890381515315], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 181.6, 139, 432, 144.0, 423.0, 432.0, 432.0, 0.08173006195138696, 0.038236472993663194, 0.045696469533757236], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 4, 0, 0.0, 150.0, 143, 160, 148.5, 160.0, 160.0, 160.0, 0.020672368795059307, 0.016271415282048632, 0.007348381095118737], "isController": false}, {"data": ["deleteAccount", 11, 0, 0.0, 1653.3636363636365, 520, 6035, 854.0, 5476.4000000000015, 6035.0, 6035.0, 0.07197728135264943, 0.01300370805687514, 0.04899234873319985], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 2748.2000000000003, 883, 8049, 1971.0, 7459.000000000002, 8022.75, 8049.0, 0.08975975800769241, 0.04645768725007517, 0.04128598244299133], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 4, 0, 0.0, 433.75, 295, 576, 432.0, 576.0, 576.0, 576.0, 0.021445191451946687, 0.03323585823656191, 0.04823073819710276], "isController": false}, {"data": ["addBook", 56, 1, 1.7857142857142858, 1953.839285714286, 756, 6036, 1521.0, 4188.900000000004, 5224.399999999999, 6036.0, 0.2774846020821255, 95.87856587843697, 1.0084318078493457], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7e575a11-6430-4098-9a75-f985fa2e1be0", 1, 0, 0.0, 608.0, 608, 608, 608.0, 608.0, 608.0, 608.0, 1.644736842105263, 0.2971448396381579, 1.1339689555921053], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 251.1818181818182, 141, 586, 147.0, 580.2, 586.0, 586.0, 0.24224166028029565, 0.1800252963606494, 0.11709924007690072], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4a023103-7b19-486a-90b3-30723f1c4865", 1, 0, 0.0, 254.0, 254, 254, 254.0, 254.0, 254.0, 254.0, 3.937007874015748, 0.7112758366141733, 2.714382381889764], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 899.5999999999999, 688, 1405, 843.0, 1161.0, 1290.2, 1405.0, 0.24169874668213537, 71.06745667824623, 0.12155747513798801], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 238.80000000000004, 141, 557, 150.0, 433.2, 470.99999999999983, 557.0, 0.24274308513220672, 0.42954147486285016, 0.11805278944906147], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1340.8909090909087, 971, 2181, 1276.0, 1715.6, 1980.3999999999994, 2181.0, 0.2412449996490982, 217.07267474773448, 0.12109368146448873], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 179.0, 144, 430, 150.0, 421.0, 430.0, 430.0, 0.08605384253052646, 0.0642882710311062, 0.03058945183702308], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 167, 1, 0.5988023952095808, 390.8383233532933, 141, 5373, 154.0, 680.4000000000007, 874.1999999999998, 5228.839999999998, 0.6933171697713714, 1.4847321024531803, 0.333542935066903], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 192.7, 146, 451, 151.0, 428.0000000000001, 451.0, 451.0, 0.05689382474426226, 0.04405937795136716, 0.020223976764561974], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=edd1606e-50c7-4666-af42-4709d8ef27fc", 1, 0, 0.0, 1229.0, 1229, 1229, 1229.0, 1229.0, 1229.0, 1229.0, 0.8136696501220504, 0.14700086452400324, 0.5609870829943042], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 169.3684210526316, 144, 422, 149.0, 210.0, 422.0, 422.0, 0.12693577050012694, 0.10301135281797412, 0.045121699669967], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c13e37f8-186d-41d1-9f8f-6abf89edaf35", 1, 0, 0.0, 3693.0, 3693, 3693, 3693.0, 3693.0, 3693.0, 3693.0, 0.27078256160303277, 0.04892067763336041, 0.18669188329271594], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 458.8, 282, 876, 293.5, 873.2, 876.0, 876.0, 0.05651952749675013, 0.08759422864974849, 0.12711374201661674], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a3775d97-b918-403d-8126-f908f1bebcaa", 1, 0, 0.0, 815.0, 815, 815, 815.0, 815.0, 815.0, 815.0, 1.2269938650306749, 0.22167369631901843, 0.845954754601227], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 578.3333333333334, 285, 1696, 294.0, 1648.6000000000001, 1696.0, 1696.0, 0.08166465227191062, 13.136264405304392, 0.18087976138949685], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/317a7e5e-b7a2-4ebf-a3ea-a0aa3c2b2932", 1, 0, 0.0, 4638.0, 4638, 4638, 4638.0, 4638.0, 4638.0, 4638.0, 0.21561017680034497, 0.06885207794307892, 0.1286502129150496], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8bd1f701-2034-4eb3-86b2-8b264373b5e2", 3, 0, 0.0, 2049.0, 247, 3242, 2658.0, 3242.0, 3242.0, 3242.0, 0.03910731045990197, 0.03260215562754197, 0.025078581251955365], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 152.27272727272728, 146, 168, 150.0, 167.0, 168.0, 168.0, 0.0606782727653847, 0.05030845075958165, 0.021569229772070344], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 148.8571428571429, 140, 158, 148.0, 158.0, 158.0, 158.0, 0.08021405694052128, 0.062275561784877365, 0.028513590553075924], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a5c58719-a5c0-48f5-805f-f3bc2ca198b8", 3, 0, 0.0, 993.3333333333334, 276, 2184, 520.0, 2184.0, 2184.0, 2184.0, 0.06650262685376072, 0.030090706812085748, 0.04264654130921505], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a0b87ee1-7728-46ba-94da-4f1b858c9296", 1, 0, 0.0, 6495.0, 6495, 6495, 6495.0, 6495.0, 6495.0, 6495.0, 0.15396458814472672, 0.027815867975365664, 0.10615136643571978], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 145.89473684210532, 141, 157, 145.0, 153.0, 157.0, 157.0, 0.08550739638978772, 0.06354602407483247, 0.04292070482846766], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 232.6315789473684, 142, 429, 145.0, 429.0, 429.0, 429.0, 0.08540055105829261, 0.029602246933446003, 0.04832751167515428], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 278.0526315789474, 140, 1542, 144.0, 444.0, 1542.0, 1542.0, 0.08551047503319156, 4.071438692646099, 0.049884040482459105], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 316.3157894736841, 140, 1147, 146.0, 436.0, 1147.0, 1147.0, 0.08540055105829261, 1.3434170361738755, 0.04990331337282734], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 3, 75.0, 0.24096385542168675], "isController": false}, {"data": ["401/Unauthorized", 1, 25.0, 0.08032128514056225], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1245, 4, "406/Not Acceptable", 3, "401/Unauthorized", 1, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 3, "406/Not Acceptable", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 167, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
