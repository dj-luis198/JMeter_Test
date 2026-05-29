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

    var data = {"OkPercent": 97.71048744460856, "KoPercent": 2.2895125553914326};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8094483195941662, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.36607142857142855, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bab40d8f-882f-4c65-8a33-31b69be1dcfd"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ffe554b1-a402-4fe6-83a7-d01a45607397"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f1aead3a-af56-4fd7-9901-b6d756786113"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.85, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a76a016b-e6ec-484e-86ae-e0dd4973e9f3"], "isController": false}, {"data": [0.8043478260869565, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0c40d67c-d1d6-4c38-92ca-e53b37595253"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5ab9e292-4895-4732-9513-613e6535faf2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fdb555c9-1ad6-4512-a2fd-ce9c261b6d81"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=26daf2ca-6bc1-41d2-9a7a-2cae3c4b8540"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3a28cda1-bf72-47f6-9cf8-1e51d0b785b7"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ac8a2bf7-f348-4c17-9405-c3fc0c25e7fd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c0d2a7d4-1eab-4c6d-90c8-425125605daf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/8142b27a-0b18-44aa-8503-a876502f66fc"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.49107142857142855, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fdb555c9-1ad6-4512-a2fd-ce9c261b6d81"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3a28cda1-bf72-47f6-9cf8-1e51d0b785b7"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.2826086956521739, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3a48f91b-2460-4bc3-9518-0628d378ee93"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/70b4c3f7-a7f7-4dbf-b74c-4d99389500e5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b092b651-37a8-4daf-80dc-9875e5c698da"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f1aead3a-af56-4fd7-9901-b6d756786113"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a76a016b-e6ec-484e-86ae-e0dd4973e9f3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ffe554b1-a402-4fe6-83a7-d01a45607397"], "isController": false}, {"data": [0.8392857142857143, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9093406593406593, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8142b27a-0b18-44aa-8503-a876502f66fc"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0c40d67c-d1d6-4c38-92ca-e53b37595253"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5ab9e292-4895-4732-9513-613e6535faf2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=70b4c3f7-a7f7-4dbf-b74c-4d99389500e5"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/26daf2ca-6bc1-41d2-9a7a-2cae3c4b8540"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ac8a2bf7-f348-4c17-9405-c3fc0c25e7fd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c0d2a7d4-1eab-4c6d-90c8-425125605daf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/03f87a0b-c528-4208-8a1a-b306e94cef0c"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1354, 31, 2.2895125553914326, 295.4881831610052, 76, 2672, 91.0, 840.5, 1014.25, 1563.8500000000024, 5.485623533892159, 759.6835046029203, 4.01043956141346], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1338.3928571428567, 964, 1834, 1334.0, 1629.9, 1681.9999999999998, 1834.0, 0.2575245453082247, 309.8891643888965, 1.2662461773700304], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/bab40d8f-882f-4c65-8a33-31b69be1dcfd", 1, 0, 0.0, 309.0, 309, 309, 309.0, 309.0, 309.0, 309.0, 3.236245954692557, 1.0334496359223302, 1.931002224919094], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 491.5714285714286, 84, 1223, 416.0, 1122.0, 1223.0, 1223.0, 0.08682924408940931, 0.017104198193951724, 0.05842319255625295], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 491.5714285714286, 84, 1223, 416.0, 1122.0, 1223.0, 1223.0, 0.08938490416661346, 0.01760762900157062, 0.060142772432418626], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 99.93333333333332, 78, 237, 79.0, 234.6, 237.0, 237.0, 0.09730213610622798, 0.026035923137799285, 0.05549262449808315], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 80.0, 78, 82, 80.0, 82.0, 82.0, 82.0, 0.09729961145021827, 0.07230957452501573, 0.048839844028722844], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 127.73333333333332, 77, 318, 81.0, 271.20000000000005, 318.0, 318.0, 0.09720377150633444, 0.026199454038816707, 0.057240111541327805], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 131.39999999999998, 78, 238, 80.0, 236.8, 238.0, 238.0, 0.09720314160553668, 0.02619928426086731, 0.05714481567044247], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 184.73333333333335, 79, 272, 184.0, 267.2, 272.0, 272.0, 0.08207350503110586, 0.1579754672034274, 0.053048551949792896], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 79.70588235294119, 78, 81, 80.0, 81.0, 81.0, 81.0, 0.1011784311391501, 0.07519217392274728, 0.0507868296928937], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 88.17647058823528, 77, 235, 79.0, 111.7999999999999, 235.0, 235.0, 0.10118023771404083, 0.03601291089592125, 0.05720449790794979], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 555.1428571428571, 465, 626, 614.0, 626.0, 626.0, 626.0, 0.06050548006776613, 17.79062011094112, 0.034507031601147875], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 830.7142857142857, 614, 999, 857.0, 999.0, 999.0, 999.0, 0.060297525217286436, 54.25581918225789, 0.03432954804851367], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ffe554b1-a402-4fe6-83a7-d01a45607397", 3, 0, 0.0, 316.6666666666667, 184, 403, 363.0, 403.0, 403.0, 403.0, 0.02303952815046348, 0.023107026768091787, 0.014774697414196956], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 148.0, 78, 244, 83.0, 244.0, 244.0, 244.0, 0.06062548175606038, 0.10727868451365373, 0.03356899233953734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 90.74999999999999, 78, 238, 80.0, 137.2000000000001, 238.0, 238.0, 0.07557507911766095, 0.05616468282083983, 0.037935147135232154], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 88.93750000000001, 76, 235, 80.0, 127.2000000000001, 235.0, 235.0, 0.07557507911766095, 0.02022223796703037, 0.04310141230929101], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 89.5, 77, 235, 79.0, 131.4000000000001, 235.0, 235.0, 0.07557543609388359, 0.02036994175967956, 0.044430090359880776], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f1aead3a-af56-4fd7-9901-b6d756786113", 3, 0, 0.0, 542.0, 187, 924, 515.0, 924.0, 924.0, 924.0, 0.026916934340624834, 0.026995792546700884, 0.01726118510775746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 109.5, 79, 241, 80.0, 235.4, 241.0, 241.0, 0.07557543609388359, 0.02036994175967956, 0.04450389449669121], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 81.57142857142857, 79, 85, 81.0, 85.0, 85.0, 85.0, 0.060706449626655334, 0.045114851724496786, 0.034088094272780096], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 483.15, 79, 973, 507.0, 926.3000000000001, 970.6999999999999, 973.0, 0.1112452234082199, 50.06431581754115, 0.06061995572440109], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 142.82352941176467, 77, 1006, 79.0, 390.79999999999944, 1006.0, 1006.0, 0.10118023771404083, 5.381087972124845, 0.05897143220626484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 324.1500000000001, 78, 711, 271.5, 628.5, 706.9, 711.0, 0.1112452234082199, 16.36988671759844, 0.06072859363788568], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 115.52941176470587, 78, 540, 80.0, 293.5999999999998, 540.0, 540.0, 0.10108758347158547, 1.7740615392963115, 0.05901614836981406], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 383.6428571428571, 81, 685, 409.5, 610.5, 685.0, 685.0, 0.08931818326815233, 0.017594485878157238, 0.06067107063792323], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 211.25, 159, 473, 162.0, 366.60000000000014, 473.0, 473.0, 0.07554617523879674, 0.11708181650778361, 0.16990511872553601], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a76a016b-e6ec-484e-86ae-e0dd4973e9f3", 3, 0, 0.0, 262.0, 163, 423, 200.0, 423.0, 423.0, 423.0, 0.022689628570780298, 0.03127948469962714, 0.014550315196756897], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 522.4347826086957, 90, 1297, 470.0, 1181.2000000000003, 1285.6, 1297.0, 0.110009422546192, 0.06757414724761207, 0.049740588514537984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 81.20000000000002, 79, 91, 80.0, 85.60000000000001, 90.75, 91.0, 0.11124336711423581, 0.08267207263079439, 0.0558389557585129], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 143.25, 77, 243, 81.0, 240.8, 242.9, 243.0, 0.11124460463667513, 0.11330871351176969, 0.05877278428558715], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0c40d67c-d1d6-4c38-92ca-e53b37595253", 1, 0, 0.0, 411.0, 411, 411, 411.0, 411.0, 411.0, 411.0, 2.4330900243309004, 0.43957192822384433, 1.6775015206812653], "isController": false}, {"data": ["login", 23, 0, 0.0, 2646.130434782609, 1691, 4045, 2466.0, 3868.6000000000004, 4037.7999999999997, 4045.0, 0.11229701094651734, 41.040042161729666, 0.22610549236136201], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 84.94117647058823, 81, 94, 84.0, 90.8, 94.0, 94.0, 0.09864851533984413, 0.07986290939133865, 0.03506646443721022], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5ab9e292-4895-4732-9513-613e6535faf2", 1, 0, 0.0, 487.0, 487, 487, 487.0, 487.0, 487.0, 487.0, 2.053388090349076, 0.37097343429158114, 1.4157148357289528], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fdb555c9-1ad6-4512-a2fd-ce9c261b6d81", 1, 0, 0.0, 408.0, 408, 408, 408.0, 408.0, 408.0, 408.0, 2.450980392156863, 0.44280407475490197, 1.6898360906862746], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=26daf2ca-6bc1-41d2-9a7a-2cae3c4b8540", 1, 0, 0.0, 179.0, 179, 179, 179.0, 179.0, 179.0, 179.0, 5.58659217877095, 1.009296438547486, 3.85169343575419], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3a28cda1-bf72-47f6-9cf8-1e51d0b785b7", 1, 0, 0.0, 395.0, 395, 395, 395.0, 395.0, 395.0, 395.0, 2.5316455696202533, 0.4573773734177215, 1.7454509493670884], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 565.8, 159, 1055, 593.5, 1008.2, 1052.7, 1055.0, 0.1111932705832643, 66.59906825251436, 0.23585135127622078], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ac8a2bf7-f348-4c17-9405-c3fc0c25e7fd", 3, 0, 0.0, 343.6666666666667, 177, 578, 276.0, 578.0, 578.0, 578.0, 0.041281941902547095, 0.034173170005917075, 0.026473120295578703], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c0d2a7d4-1eab-4c6d-90c8-425125605daf", 3, 0, 0.0, 263.3333333333333, 162, 419, 209.0, 419.0, 419.0, 419.0, 0.03765910973864577, 0.0313948502736562, 0.02414988482588938], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 249.93333333333334, 158, 398, 311.0, 350.6, 398.0, 398.0, 0.09715088828295519, 0.1505649020557128, 0.21849462472231038], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, 36.36363636363637, 611.6363636363636, 79, 1084, 793.0, 1070.2, 1084.0, 1084.0, 0.0946855578700914, 72.09447816421918, 0.15868068855768072], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8142b27a-0b18-44aa-8503-a876502f66fc", 3, 0, 0.0, 1027.3333333333333, 252, 2037, 793.0, 2037.0, 2037.0, 2037.0, 0.05678376741368867, 0.025693176010751058, 0.03641406959797092], "isController": false}, {"data": ["register", 24, 8, 33.333333333333336, 1046.791666666667, 100, 2664, 1073.0, 2079.0, 2553.75, 2664.0, 0.09844740242426729, 0.030764813257583526, 0.044416699140636215], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 98.23076923076923, 80, 239, 84.0, 188.99999999999994, 239.0, 239.0, 0.05953007871708101, 0.04621719978523379, 0.02116108266896239], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 242.17647058823528, 159, 1085, 161.0, 471.39999999999947, 1085.0, 1085.0, 0.10103831729597688, 7.257787565452028, 0.22571686128924895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 371.92857142857144, 160, 1169, 315.0, 1013.5, 1169.0, 1169.0, 0.08904889420355305, 15.337355176285007, 0.19701819380219696], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 14, 0, 0.0, 133.71428571428572, 78, 348, 81.0, 297.5, 348.0, 348.0, 0.07809754383224647, 0.05803928794564411, 0.03920130618142059], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 14, 0, 0.0, 78.42857142857143, 77, 80, 78.0, 80.0, 80.0, 80.0, 0.07809928650723255, 0.020897660647443087, 0.044540999336156066], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 14, 0, 0.0, 135.14285714285717, 77, 237, 80.5, 236.5, 237.0, 237.0, 0.07803050992938239, 0.021031660879403846, 0.045873405251453316], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 14, 0, 0.0, 152.14285714285714, 78, 316, 80.5, 276.5, 316.0, 316.0, 0.07803050992938239, 0.021031660879403846, 0.04594960692130623], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 89.5, 81, 98, 89.5, 98.0, 98.0, 98.0, 0.2244165170556553, 0.06618533999102333, 0.1387262258752244], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 922.0, 619, 1505, 861.5, 1254.4, 1346.85, 1505.0, 0.2571012749468581, 307.58250770156053, 0.5076745878345186], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fdb555c9-1ad6-4512-a2fd-ce9c261b6d81", 3, 0, 0.0, 330.0, 272, 444, 274.0, 444.0, 444.0, 444.0, 0.04836213567191127, 0.03109219334375806, 0.03101347893022956], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, 33.333333333333336, 1046.791666666667, 100, 2664, 1073.0, 2079.0, 2553.75, 2664.0, 0.1024778284948142, 0.032024321404629436, 0.046235114027933746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 10, 0, 0.0, 111.60000000000001, 79, 233, 81.0, 233.0, 233.0, 233.0, 0.052928535890840185, 0.01426589443932802, 0.031167878068531867], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 10, 0, 0.0, 95.89999999999999, 78, 234, 79.5, 219.60000000000005, 234.0, 234.0, 0.052971993706927144, 0.014277607678820208, 0.03114173848786147], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3a28cda1-bf72-47f6-9cf8-1e51d0b785b7", 3, 0, 0.0, 330.6666666666667, 202, 583, 207.0, 583.0, 583.0, 583.0, 0.026381511836504976, 0.02645880142196349, 0.016917831483696227], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 215.30769230769232, 77, 869, 80.0, 819.4, 869.0, 869.0, 0.06124823911312549, 8.492625991750334, 0.03519749318024414], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 190.15384615384613, 78, 656, 81.0, 581.1999999999999, 656.0, 656.0, 0.06136359345203255, 2.789830872495893, 0.03532370918140966], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 80.69230769230771, 78, 84, 80.0, 83.6, 84.0, 84.0, 0.061476185071690684, 0.04568689144487951, 0.03085816320981349], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 10, 0, 0.0, 111.2, 78, 234, 80.0, 233.9, 234.0, 234.0, 0.05292797561078884, 0.014162368473980606, 0.03018548609052801], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 151.92307692307693, 78, 238, 85.0, 237.6, 238.0, 238.0, 0.06143144723038683, 0.03063265825685906, 0.03424138660227391], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 10, 0, 0.0, 112.6, 80, 236, 82.0, 235.9, 236.0, 236.0, 0.05297087131786231, 0.03936604792274728, 0.026588894391973854], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 84.9, 82, 94, 82.5, 93.7, 94.0, 94.0, 0.05273844368852675, 0.041510923450148986, 0.018746868654905994], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 448.1428571428571, 79, 793, 433.5, 706.5, 793.0, 793.0, 0.08985763982490597, 0.01734974518940707, 0.06115033022682636], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1547.173913043478, 1128, 2672, 1470.0, 2142.2000000000007, 2600.199999999999, 2672.0, 0.11007839496128113, 0.05697416926706933, 0.050631761744886136], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 0, 0.0, 241.0, 161, 470, 167.0, 469.9, 470.0, 470.0, 0.05290529423279387, 0.08199287299555066, 0.11898524669738701], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3a48f91b-2460-4bc3-9518-0628d378ee93", 1, 0, 0.0, 178.0, 178, 178, 178.0, 178.0, 178.0, 178.0, 5.617977528089887, 1.794022120786517, 3.352133075842697], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/70b4c3f7-a7f7-4dbf-b74c-4d99389500e5", 3, 0, 0.0, 274.3333333333333, 201, 412, 210.0, 412.0, 412.0, 412.0, 0.05128906517130548, 0.033574970722491965, 0.032890448693838475], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b092b651-37a8-4daf-80dc-9875e5c698da", 2, 0, 0.0, 264.0, 264, 264, 264.0, 264.0, 264.0, 264.0, 0.022337134369031796, 0.0313897815986687, 0.01388436135340697], "isController": false}, {"data": ["addBook", 63, 15, 23.80952380952381, 808.2222222222222, 404, 2022, 683.0, 1399.4, 1515.8, 2022.0, 0.29945812339576006, 86.49581356503708, 1.0889103571513452], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f1aead3a-af56-4fd7-9901-b6d756786113", 1, 0, 0.0, 396.0, 396, 396, 396.0, 396.0, 396.0, 396.0, 2.5252525252525255, 0.456222380050505, 1.7410432449494948], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a76a016b-e6ec-484e-86ae-e0dd4973e9f3", 1, 0, 0.0, 685.0, 685, 685, 685.0, 685.0, 685.0, 685.0, 1.4598540145985401, 0.26374315693430656, 1.006500912408759], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 143.91071428571428, 78, 354, 81.0, 320.3, 326.09999999999997, 354.0, 0.25818468503773645, 0.19187357940792718, 0.12480607333367143], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ffe554b1-a402-4fe6-83a7-d01a45607397", 1, 0, 0.0, 464.0, 464, 464, 464.0, 464.0, 464.0, 464.0, 2.155172413793103, 0.3893622036637931, 1.4858903556034482], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 496.17857142857144, 385, 718, 467.0, 632.6, 694.35, 718.0, 0.25787912836854615, 75.82502613328667, 0.12969506944316528], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 120.16071428571425, 78, 264, 83.5, 241.0, 249.5, 264.0, 0.25851841251229113, 0.45745640964089024, 0.1257247748350791], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 776.5178571428571, 539, 1184, 776.5, 967.3000000000002, 1027.8, 1184.0, 0.25752572957958925, 231.7221041576609, 0.12926584473037975], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 85.00000000000003, 80, 93, 83.5, 92.0, 93.0, 93.0, 0.08607598049764213, 0.06430480964911742, 0.03059732119252123], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 15, 8.241758241758241, 136.36263736263734, 78, 989, 85.0, 248.40000000000003, 309.85, 686.0499999999954, 0.7754018669291104, 1.6533998589258554, 0.3739043987014149], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 14, 0, 0.0, 83.28571428571429, 80, 88, 82.5, 87.5, 88.0, 88.0, 0.07932056272273498, 0.06142695921789925, 0.0281959812803472], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 94.46666666666667, 81, 237, 84.0, 148.80000000000007, 237.0, 237.0, 0.09856424746197064, 0.07998719691493905, 0.03503650983999737], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8142b27a-0b18-44aa-8503-a876502f66fc", 1, 0, 0.0, 199.0, 199, 199, 199.0, 199.0, 199.0, 199.0, 5.025125628140704, 0.9078596105527638, 3.4645885678391957], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 14, 0, 0.0, 286.7857142857143, 158, 586, 163.0, 570.0, 586.0, 586.0, 0.07799442896935933, 0.12087613161559889, 0.17541129874651812], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 333.30769230769226, 160, 950, 311.0, 900.4, 950.0, 950.0, 0.06122458590986799, 11.348886720681666, 0.13528554646475113], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0c40d67c-d1d6-4c38-92ca-e53b37595253", 3, 0, 0.0, 339.6666666666667, 197, 430, 392.0, 430.0, 430.0, 430.0, 0.01851966170751281, 0.021889613170566084, 0.011876215352799554], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5ab9e292-4895-4732-9513-613e6535faf2", 3, 0, 0.0, 310.66666666666663, 175, 569, 188.0, 569.0, 569.0, 569.0, 0.024547909336388184, 0.02901479778659684, 0.015741986130431224], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=70b4c3f7-a7f7-4dbf-b74c-4d99389500e5", 1, 0, 0.0, 529.0, 529, 529, 529.0, 529.0, 529.0, 529.0, 1.890359168241966, 0.34151996691871456, 1.303314035916824], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/26daf2ca-6bc1-41d2-9a7a-2cae3c4b8540", 3, 0, 0.0, 401.3333333333333, 174, 620, 410.0, 620.0, 620.0, 620.0, 0.10143359480659994, 0.045896060150121716, 0.06504693416959698], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 95.9375, 80, 241, 82.5, 146.5000000000001, 241.0, 241.0, 0.0733894456803431, 0.06084730408458134, 0.02608765451918446], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ac8a2bf7-f348-4c17-9405-c3fc0c25e7fd", 1, 0, 0.0, 536.0, 536, 536, 536.0, 536.0, 536.0, 536.0, 1.8656716417910448, 0.3370598180970149, 1.2862931436567164], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 100.65000000000002, 80, 238, 82.5, 223.4000000000003, 237.95, 238.0, 0.11502780797257738, 0.08930381575995996, 0.04088879111525211], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c0d2a7d4-1eab-4c6d-90c8-425125605daf", 1, 0, 0.0, 503.0, 503, 503, 503.0, 503.0, 503.0, 503.0, 1.9880715705765406, 0.3591730864811133, 1.3706821570576542], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 102.28571428571428, 78, 236, 80.0, 236.0, 236.0, 236.0, 0.08909593086155765, 0.06621289393129431, 0.04472198092074281], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 146.78571428571428, 77, 237, 84.0, 236.5, 237.0, 237.0, 0.08909422987584083, 0.042956146547280395, 0.04974262108860421], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 245.85714285714283, 77, 933, 158.5, 855.5, 933.0, 933.0, 0.08909422987584083, 11.473032389729982, 0.05128387171703672], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 179.92857142857144, 78, 628, 79.5, 627.5, 628.0, 628.0, 0.08909422987584083, 3.7629634093179836, 0.05137087780089985], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/03f87a0b-c528-4208-8a1a-b306e94cef0c", 1, 0, 0.0, 337.0, 337, 337, 337.0, 337.0, 337.0, 337.0, 2.967359050445104, 0.947584384272997, 1.7705628709198813], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 25.806451612903224, 0.5908419497784343], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 6.451612903225806, 0.14771048744460857], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 6.451612903225806, 0.14771048744460857], "isController": false}, {"data": ["401/Unauthorized", 19, 61.29032258064516, 1.4032496307237814], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1354, 31, "401/Unauthorized", 19, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 15, "401/Unauthorized", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
