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

    var data = {"OkPercent": 97.78924097273398, "KoPercent": 2.210759027266028};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7998102466793169, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4067796610169492, 500, 1500, "see books"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/88f8ec14-f127-4c58-8782-82f82fa1fa97"], "isController": false}, {"data": [0.6, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5cb0a508-e433-4ccc-92c8-ed5428e8f4d3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=74e18d6c-0292-4d20-b6bb-ccedcc42e070"], "isController": false}, {"data": [0.78125, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5625, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/2d1a2d8b-0d05-4462-a028-0b627e2994e9"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c8a495d8-674c-42c2-b917-0e94d7695b19"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.5666666666666667, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2d1a2d8b-0d05-4462-a028-0b627e2994e9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9bf793be-d94c-4728-804c-3d52c3582979"], "isController": false}, {"data": [0.6956521739130435, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cb8157b3-ae3c-4d8a-89c2-71d59c60ba0f"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/26f5fb82-32b9-43d6-b978-f1cc180647aa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cc48e225-5e54-43f6-8adc-30b967e99649"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/9f316881-7899-41d9-8d64-3930bc5fe1bf"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ef7b1f26-36b2-47a8-82f1-d55a6d5c6370"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f5a67a85-8de3-45aa-a8ff-a502da02c3dd"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1a409b97-72e7-4b3f-a416-71416fc4df59"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4915254237288136, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/61b739b2-12a4-4203-90d2-7a52d2d692e3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/74e18d6c-0292-4d20-b6bb-ccedcc42e070"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.4642857142857143, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.2391304347826087, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c8a495d8-674c-42c2-b917-0e94d7695b19"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=88f8ec14-f127-4c58-8782-82f82fa1fa97"], "isController": false}, {"data": [0.3793103448275862, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9bf793be-d94c-4728-804c-3d52c3582979"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.864406779661017, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.94, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cb8157b3-ae3c-4d8a-89c2-71d59c60ba0f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f5a67a85-8de3-45aa-a8ff-a502da02c3dd"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=61b739b2-12a4-4203-90d2-7a52d2d692e3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5cb0a508-e433-4ccc-92c8-ed5428e8f4d3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/422f7dca-04a3-42ca-b38a-5915f9e696af"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9f316881-7899-41d9-8d64-3930bc5fe1bf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ef7b1f26-36b2-47a8-82f1-d55a6d5c6370"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=26f5fb82-32b9-43d6-b978-f1cc180647aa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1357, 30, 2.210759027266028, 312.82461311717077, 77, 3366, 103.0, 849.2, 1086.2999999999988, 1683.6800000000003, 5.318064961123652, 762.9617691518431, 3.895977968436481], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 59, 0, 0.0, 1332.0, 962, 1904, 1312.0, 1731.0, 1761.0, 1904.0, 0.2608541869307631, 313.8947599119064, 1.2826179992152267], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/88f8ec14-f127-4c58-8782-82f82fa1fa97", 3, 0, 0.0, 816.3333333333334, 187, 1256, 1006.0, 1256.0, 1256.0, 1256.0, 0.01610193598943713, 0.022197818657313233, 0.010325785774476286], "isController": false}, {"data": ["deleteBook", 15, 3, 20.0, 505.5333333333333, 81, 1068, 460.0, 982.2, 1068.0, 1068.0, 0.07988198767687205, 0.016257232648300913, 0.05353029291393515], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, 20.0, 505.5333333333333, 81, 1068, 460.0, 982.2, 1068.0, 1068.0, 0.0811108948153916, 0.016507334452663683, 0.054353804709298556], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5cb0a508-e433-4ccc-92c8-ed5428e8f4d3", 3, 0, 0.0, 278.0, 194, 417, 223.0, 417.0, 417.0, 417.0, 0.03197510205386739, 0.02665632694008932, 0.020504866876991785], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 13, 0, 0.0, 116.15384615384613, 79, 239, 80.0, 237.8, 239.0, 239.0, 0.08800790717196745, 0.04388495250957932, 0.0490548881622595], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 13, 0, 0.0, 95.07692307692307, 79, 235, 81.0, 184.99999999999994, 235.0, 235.0, 0.08808304198173293, 0.0654601513165027, 0.04421355818223704], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 13, 0, 0.0, 173.07692307692307, 77, 614, 79.0, 613.6, 614.0, 614.0, 0.08778504818048606, 3.9910543659556077, 0.050533114799208585], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 13, 0, 0.0, 289.30769230769226, 78, 2049, 80.0, 1503.3999999999996, 2049.0, 2049.0, 0.08774120394430458, 12.166116772574798, 0.050422191269075274], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=74e18d6c-0292-4d20-b6bb-ccedcc42e070", 1, 0, 0.0, 429.0, 429, 429, 429.0, 429.0, 429.0, 429.0, 2.331002331002331, 0.4211283508158508, 1.6071168414918415], "isController": false}, {"data": ["goToProfile", 16, 3, 18.75, 217.99999999999997, 79, 533, 184.0, 496.6, 533.0, 533.0, 0.08096346523631211, 0.1534322895582431, 0.05232679036787775], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 95.99999999999999, 78, 234, 80.5, 217.5000000000003, 233.9, 234.0, 0.09582444960831756, 0.07121328725774381, 0.048099381932300025], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 126.6, 77, 241, 81.0, 235.9, 240.75, 241.0, 0.09575609008732956, 0.032813292980121034, 0.05420879435900873], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 602.25, 467, 630, 622.5, 630.0, 630.0, 630.0, 0.04226654338924844, 12.427767137762514, 0.024105138026680756], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 877.25, 765, 993, 885.5, 993.0, 993.0, 993.0, 0.0421840807825147, 37.957310039811226, 0.024016913179888737], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 137.625, 78, 236, 80.5, 236.0, 236.0, 236.0, 0.04235291626299043, 0.07494480885599479, 0.02345127296983943], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 116.42857142857144, 79, 239, 81.5, 239.0, 239.0, 239.0, 0.0737972368206042, 0.05484345431687479, 0.03704275363846734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 101.57142857142857, 78, 234, 80.0, 234.0, 234.0, 234.0, 0.07379918188335513, 0.01974704671488213, 0.04208859591785097], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 134.92857142857142, 78, 236, 80.5, 235.5, 236.0, 236.0, 0.07379918188335513, 0.01989118574199806, 0.043385847161894316], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 112.35714285714285, 78, 235, 80.0, 234.5, 235.0, 235.0, 0.07379918188335513, 0.01989118574199806, 0.043457916675452284], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2d1a2d8b-0d05-4462-a028-0b627e2994e9", 3, 0, 0.0, 950.6666666666666, 205, 2138, 509.0, 2138.0, 2138.0, 2138.0, 0.019591580844658354, 0.027008575806356815, 0.012563611414055], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c8a495d8-674c-42c2-b917-0e94d7695b19", 3, 0, 0.0, 315.3333333333333, 190, 540, 216.0, 540.0, 540.0, 540.0, 0.07160588122971166, 0.03319230952835593, 0.045919136075042964], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 119.0, 78, 235, 80.5, 235.0, 235.0, 235.0, 0.042387699089724167, 0.03150101465554696, 0.02380168650057753], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 134.95000000000002, 77, 732, 79.0, 234.8, 707.1499999999996, 732.0, 0.0957542562766915, 4.3325107319575045, 0.05588158549897543], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 13, 0, 0.0, 612.0000000000001, 79, 998, 784.0, 970.8, 998.0, 998.0, 0.07328691828508611, 45.65940719515461, 0.038724472897933876], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 161.55, 77, 618, 80.0, 323.3, 603.2999999999997, 618.0, 0.09582720438505288, 1.4333559974653705, 0.05601773881337173], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 13, 0, 0.0, 462.1538461538462, 79, 740, 612.0, 730.4, 740.0, 740.0, 0.07328650513569278, 14.924384974716157, 0.03879582344435299], "isController": false}, {"data": ["deleteBooks", 15, 3, 20.0, 464.46666666666664, 83, 1063, 469.0, 976.0, 1063.0, 1063.0, 0.08111835167509396, 0.016508852040126545, 0.054770730808749966], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2d1a2d8b-0d05-4462-a028-0b627e2994e9", 1, 0, 0.0, 417.0, 417, 417, 417.0, 417.0, 417.0, 417.0, 2.398081534772182, 0.43324715227817745, 1.6533648081534773], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 263.5714285714286, 159, 475, 178.0, 474.5, 475.0, 475.0, 0.07376651843109154, 0.1143236960450608, 0.16590262885430057], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9bf793be-d94c-4728-804c-3d52c3582979", 1, 0, 0.0, 759.0, 759, 759, 759.0, 759.0, 759.0, 759.0, 1.3175230566534915, 0.2380290678524374, 0.9083703886693018], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 701.4347826086957, 158, 1741, 611.0, 1461.4000000000003, 1705.7999999999995, 1741.0, 0.1000974862474758, 0.06148566293912332, 0.04525892200447392], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 13, 0, 0.0, 80.76923076923076, 79, 85, 80.0, 84.2, 85.0, 85.0, 0.07328567885088055, 0.05446328281789072, 0.0367859755169459], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 13, 0, 0.0, 139.3846153846154, 77, 237, 81.0, 236.6, 237.0, 237.0, 0.0732873314391377, 0.09581525814053128, 0.0375355337854598], "isController": false}, {"data": ["login", 23, 0, 0.0, 3103.478260869565, 1649, 5289, 3021.0, 4240.8, 5085.999999999997, 5289.0, 0.09848841690575087, 41.115075217852095, 0.20540304645013488], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 101.64999999999999, 79, 251, 83.5, 224.70000000000027, 250.35, 251.0, 0.09568279240661359, 0.0774619481494948, 0.034012242613288425], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cb8157b3-ae3c-4d8a-89c2-71d59c60ba0f", 1, 0, 0.0, 918.0, 918, 918, 918.0, 918.0, 918.0, 918.0, 1.0893246187363836, 0.19680181100217864, 0.751038262527233], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/26f5fb82-32b9-43d6-b978-f1cc180647aa", 3, 0, 0.0, 490.3333333333333, 385, 568, 518.0, 568.0, 568.0, 568.0, 0.06564407781011355, 0.029702235727883417, 0.042095974376928295], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cc48e225-5e54-43f6-8adc-30b967e99649", 1, 0, 0.0, 364.0, 364, 364, 364.0, 364.0, 364.0, 364.0, 2.7472527472527473, 0.8772965315934066, 1.6392299107142858], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 13, 0, 0.0, 694.3076923076924, 160, 1083, 867.0, 1054.6, 1083.0, 1083.0, 0.0732522299669238, 60.705408409356004, 0.15177056450704068], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9f316881-7899-41d9-8d64-3930bc5fe1bf", 3, 0, 0.0, 980.0, 181, 2195, 564.0, 2195.0, 2195.0, 2195.0, 0.05926277112717791, 0.038100251619849076, 0.03800379528663427], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ef7b1f26-36b2-47a8-82f1-d55a6d5c6370", 1, 0, 0.0, 561.0, 561, 561, 561.0, 561.0, 561.0, 561.0, 1.7825311942959001, 0.32203932709447414, 1.2289717023172904], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 13, 0, 0.0, 410.23076923076917, 160, 2132, 167.0, 1585.1999999999994, 2132.0, 2132.0, 0.08767551964606067, 16.251960317132472, 0.19373312878522195], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 6, 42.857142857142854, 604.2857142857143, 79, 1228, 848.5, 1156.5, 1228.0, 1228.0, 0.07379023544355838, 50.453476409525265, 0.1160332922435921], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f5a67a85-8de3-45aa-a8ff-a502da02c3dd", 3, 0, 0.0, 515.6666666666666, 182, 884, 481.0, 884.0, 884.0, 884.0, 0.01713453465459634, 0.023621339278064937, 0.010987966559099865], "isController": false}, {"data": ["register", 24, 9, 37.5, 1087.0833333333335, 218, 1627, 1160.5, 1588.5, 1618.5, 1627.0, 0.10291021512522887, 0.03200869484119667, 0.04643019471470287], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 20, 0, 0.0, 92.9, 80, 239, 83.0, 103.70000000000003, 232.2999999999999, 239.0, 0.08564393533882882, 0.06649114120543839, 0.030443742639974306], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 288.70000000000005, 160, 813, 241.0, 469.9, 795.8499999999997, 813.0, 0.0957166786312515, 5.866446256580522, 0.21404455312275666], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1a409b97-72e7-4b3f-a416-71416fc4df59", 1, 0, 0.0, 371.0, 371, 371, 371.0, 371.0, 371.0, 371.0, 2.6954177897574128, 0.8607437668463612, 1.6083010444743935], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 21, 0, 0.0, 270.14285714285705, 159, 474, 226.0, 472.6, 473.9, 474.0, 0.09924620146978899, 0.15381222825444835, 0.22320703318840238], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 116.5, 80, 281, 80.5, 276.90000000000003, 281.0, 281.0, 0.04889377826671556, 0.03633609888766654, 0.02454238479403496], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 94.7, 78, 235, 79.0, 219.60000000000005, 235.0, 235.0, 0.04889449545770137, 0.01308309741739275, 0.027885141940720316], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 118.60000000000001, 77, 315, 79.5, 307.1, 315.0, 315.0, 0.04885746810828769, 0.013168614451061917, 0.02872284746209882], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 94.6, 78, 233, 79.5, 217.70000000000005, 233.0, 233.0, 0.04885770681467295, 0.013168678789892318, 0.028770700399656044], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 96.0, 83, 120, 85.0, 120.0, 120.0, 120.0, 0.08348174532502227, 0.02462059285952805, 0.05160541483470615], "isController": false}, {"data": ["https://demoqa.com/books", 59, 0, 0.0, 891.1864406779658, 619, 1559, 792.0, 1328.0, 1418.0, 1559.0, 0.25278600165382026, 302.41994061135654, 0.499153608734399], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 9, 37.5, 1087.0833333333335, 218, 1627, 1160.5, 1588.5, 1618.5, 1627.0, 0.10143488091967626, 0.03154981403605165, 0.04576456541493206], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/61b739b2-12a4-4203-90d2-7a52d2d692e3", 3, 0, 0.0, 628.6666666666666, 167, 1255, 464.0, 1255.0, 1255.0, 1255.0, 0.02387223579403035, 0.023942173984833174, 0.015308692875729099], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 82.33333333333333, 77, 100, 79.5, 100.0, 100.0, 100.0, 0.04320525375885708, 0.011645166052191945, 0.025442156266201967], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 106.16666666666667, 79, 237, 80.0, 237.0, 237.0, 237.0, 0.04320525375885708, 0.011645166052191945, 0.025399963635578084], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/74e18d6c-0292-4d20-b6bb-ccedcc42e070", 2, 0, 0.0, 395.0, 257, 533, 395.0, 533.0, 533.0, 533.0, 0.029538606959295798, 0.033346318012642526, 0.01836066731405447], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 20, 0, 0.0, 184.95000000000002, 78, 891, 81.0, 785.1000000000013, 888.75, 891.0, 0.08423535357789663, 7.599945576064524, 0.04879727709219559], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 20, 0, 0.0, 135.45, 78, 471, 80.5, 440.90000000000043, 470.6, 471.0, 0.08423393448284576, 2.4971906666694745, 0.048878714716510695], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 20, 0, 0.0, 89.70000000000002, 79, 246, 81.0, 84.9, 237.94999999999987, 246.0, 0.08428860418071477, 0.06264026150539447, 0.04230892827039784], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 109.16666666666667, 78, 234, 80.0, 234.0, 234.0, 234.0, 0.04320587599913588, 0.01156094728883128, 0.024640851155757183], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 20, 0, 0.0, 104.10000000000001, 77, 243, 79.5, 233.8, 242.54999999999998, 243.0, 0.08429180135794093, 0.035214875606374145, 0.0473647485364836], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 108.33333333333334, 78, 238, 82.0, 238.0, 238.0, 238.0, 0.04320463153650071, 0.03210812949148149, 0.021686699814220084], "isController": false}, {"data": ["deleteAccount", 14, 3, 21.428571428571427, 519.5, 79, 1256, 552.0, 1070.0, 1256.0, 1256.0, 0.08814899699034139, 0.017567081780231957, 0.05998140803855889], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 110.66666666666666, 80, 241, 83.0, 241.0, 241.0, 241.0, 0.042453831458289105, 0.03341580874548928, 0.015091010401188706], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1617.2608695652175, 1022, 3366, 1573.0, 2180.0, 3138.399999999997, 3366.0, 0.10015196972797853, 0.05183646870686389, 0.04606599388855263], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 219.16666666666666, 158, 475, 163.0, 475.0, 475.0, 475.0, 0.04317944658342629, 0.06691970871864991, 0.09711158738440502], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c8a495d8-674c-42c2-b917-0e94d7695b19", 1, 0, 0.0, 221.0, 221, 221, 221.0, 221.0, 221.0, 221.0, 4.524886877828055, 0.8174844457013575, 3.1196973981900453], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=88f8ec14-f127-4c58-8782-82f82fa1fa97", 1, 0, 0.0, 566.0, 566, 566, 566.0, 566.0, 566.0, 566.0, 1.7667844522968197, 0.31919445671378094, 1.2181150618374559], "isController": false}, {"data": ["addBook", 58, 9, 15.517241379310345, 877.1724137931036, 409, 2539, 733.5, 1472.0, 1707.75, 2539.0, 0.2750183740724057, 80.4885688079376, 1.0009192592877971], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/9bf793be-d94c-4728-804c-3d52c3582979", 3, 0, 0.0, 431.0, 175, 624, 494.0, 624.0, 624.0, 624.0, 0.05259374835644536, 0.03381271256639961, 0.03372711076243404], "isController": false}, {"data": ["https://demoqa.com/books-0", 59, 0, 0.0, 134.32203389830508, 79, 333, 82.0, 321.0, 322.0, 333.0, 0.2537230634264655, 0.18855786256595725, 0.1226493324180668], "isController": false}, {"data": ["https://demoqa.com/books-3", 59, 0, 0.0, 481.6779661016949, 385, 768, 461.0, 628.0, 695.0, 768.0, 0.25370233406147336, 74.5969099243838, 0.1275944355875574], "isController": false}, {"data": ["https://demoqa.com/books-1", 59, 0, 0.0, 129.10169491525423, 78, 386, 86.0, 242.0, 307.0, 386.0, 0.25402894207709564, 0.4495121514098606, 0.12354141909608753], "isController": false}, {"data": ["https://demoqa.com/books-2", 59, 0, 0.0, 753.7966101694913, 538, 1191, 703.0, 1016.0, 1099.0, 1191.0, 0.2531851985358171, 227.81648669463505, 0.12708710160879882], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 21, 0, 0.0, 91.47619047619048, 81, 210, 85.0, 98.4, 198.99999999999983, 210.0, 0.09724113021976495, 0.072645961541133, 0.034566183007807075], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 9, 5.142857142857143, 152.12571428571414, 79, 1377, 88.0, 298.20000000000005, 341.9999999999999, 1253.1200000000015, 0.699448834318557, 1.5436664033741412, 0.33392046442403384], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 83.9, 81, 88, 84.0, 88.0, 88.0, 88.0, 0.050634193270715715, 0.03921183131218512, 0.017998873389199727], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 13, 0, 0.0, 99.46153846153845, 80, 236, 84.0, 187.19999999999996, 236.0, 236.0, 0.08676094689562658, 0.07040854186549385, 0.030840805341804764], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cb8157b3-ae3c-4d8a-89c2-71d59c60ba0f", 3, 0, 0.0, 358.0, 179, 589, 306.0, 589.0, 589.0, 589.0, 0.017107078909252647, 0.02358348931662922, 0.010970359847404855], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f5a67a85-8de3-45aa-a8ff-a502da02c3dd", 1, 0, 0.0, 1063.0, 1063, 1063, 1063.0, 1063.0, 1063.0, 1063.0, 0.9407337723424272, 0.16995678504233303, 0.648591839134525], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 236.5, 160, 597, 162.5, 584.9000000000001, 597.0, 597.0, 0.04883742509559926, 0.07568847033858987, 0.10983651366715341], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 20, 0, 0.0, 284.2, 160, 976, 168.0, 884.0000000000009, 973.5999999999999, 976.0, 0.08420272648428356, 10.191021450118305, 0.18721949966739923], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=61b739b2-12a4-4203-90d2-7a52d2d692e3", 1, 0, 0.0, 469.0, 469, 469, 469.0, 469.0, 469.0, 469.0, 2.1321961620469083, 0.3852112206823028, 1.4700493070362475], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5cb0a508-e433-4ccc-92c8-ed5428e8f4d3", 1, 0, 0.0, 521.0, 521, 521, 521.0, 521.0, 521.0, 521.0, 1.9193857965451055, 0.3467640355086372, 1.3233265355086372], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/422f7dca-04a3-42ca-b38a-5915f9e696af", 2, 0, 0.0, 275.0, 173, 377, 275.0, 377.0, 377.0, 377.0, 0.025361078353051573, 0.02919991345532012, 0.0157639905973802], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 106.28571428571429, 80, 310, 83.5, 229.0, 310.0, 310.0, 0.07637418988805726, 0.06332196017085998, 0.027148637811770356], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9f316881-7899-41d9-8d64-3930bc5fe1bf", 1, 0, 0.0, 560.0, 560, 560, 560.0, 560.0, 560.0, 560.0, 1.7857142857142856, 0.32261439732142855, 1.231166294642857], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 13, 0, 0.0, 100.46153846153845, 81, 244, 91.0, 185.99999999999994, 244.0, 244.0, 0.07305833426997864, 0.056720093500618185, 0.025969954760031472], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ef7b1f26-36b2-47a8-82f1-d55a6d5c6370", 3, 0, 0.0, 328.0, 170, 620, 194.0, 620.0, 620.0, 620.0, 0.03219540464257735, 0.026169246547042852, 0.020646141649048627], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 21, 0, 0.0, 111.57142857142856, 78, 238, 81.0, 237.6, 238.0, 238.0, 0.09935654806964421, 0.07383821589941332, 0.04987232979277063], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 21, 0, 0.0, 119.52380952380953, 78, 244, 80.0, 234.8, 243.1, 244.0, 0.09936265951255518, 0.026587274127382928, 0.05666776675325413], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=26f5fb82-32b9-43d6-b978-f1cc180647aa", 1, 0, 0.0, 195.0, 195, 195, 195.0, 195.0, 195.0, 195.0, 5.128205128205129, 0.9264823717948718, 3.535657051282051], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 21, 0, 0.0, 133.28571428571428, 78, 238, 80.0, 236.6, 237.9, 238.0, 0.09929031068411023, 0.026761841551576588, 0.058371842804525745], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 21, 0, 0.0, 135.1904761904762, 78, 242, 81.0, 239.0, 241.8, 242.0, 0.09928937178196054, 0.026761588488106555, 0.05846825310988497], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 30.0, 0.6632277081798084], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 10.0, 0.2210759027266028], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 10.0, 0.2210759027266028], "isController": false}, {"data": ["401/Unauthorized", 15, 50.0, 1.105379513633014], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1357, 30, "401/Unauthorized", 15, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
