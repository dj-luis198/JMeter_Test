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

    var data = {"OkPercent": 98.54961832061069, "KoPercent": 1.450381679389313};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7741617357001972, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.16071428571428573, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/94ab0dbb-a257-4ed6-8416-d89dbecdc2aa"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bfacab29-5afa-4499-9f70-030dbf526d87"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e216fc4b-9eef-4b2e-b3a7-f0444e99407e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7380952380952381, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/92249d4c-dd5f-4a93-81e9-594a199a0114"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/aeb157c1-eed1-42de-a8ba-f1008c013a15"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=47c9e37a-2968-40ce-ab18-f2327c5321ef"], "isController": false}, {"data": [0.6, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/c4f81d81-655c-438c-89ed-64ade7814118"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3934c3f2-40b3-4ebb-9ea4-cca817a3c939"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=faf8ccd9-1651-4649-a83a-48bda9be9379"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/85a89a7e-a3b1-4b73-a29a-96bdded343ef"], "isController": false}, {"data": [0.7380952380952381, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9e06e690-47a9-4f74-a264-82bd30aacf7d"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/50446e50-7194-46b8-abba-34f97fb6d168"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/66edef31-ef6f-4bfa-a17c-4ab515cec225"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bfacab29-5afa-4499-9f70-030dbf526d87"], "isController": false}, {"data": [0.8611111111111112, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=83da6e71-73de-4c89-ad0f-b4779301def0"], "isController": false}, {"data": [0.4107142857142857, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=94ab0dbb-a257-4ed6-8416-d89dbecdc2aa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.075, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/faf8ccd9-1651-4649-a83a-48bda9be9379"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c66b8b38-3066-495f-aeee-2b8636cf5718"], "isController": false}, {"data": [0.30327868852459017, 500, 1500, "addBook"], "isController": true}, {"data": [0.9821428571428571, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=aeb157c1-eed1-42de-a8ba-f1008c013a15"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9353932584269663, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e216fc4b-9eef-4b2e-b3a7-f0444e99407e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=92249d4c-dd5f-4a93-81e9-594a199a0114"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c66b8b38-3066-495f-aeee-2b8636cf5718"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/47c9e37a-2968-40ce-ab18-f2327c5321ef"], "isController": false}, {"data": [0.9047619047619048, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=85a89a7e-a3b1-4b73-a29a-96bdded343ef"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/83da6e71-73de-4c89-ad0f-b4779301def0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fe822a7e-3ba0-4d4f-8b5a-5ea0fe35a669"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/9e06e690-47a9-4f74-a264-82bd30aacf7d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=50446e50-7194-46b8-abba-34f97fb6d168"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1310, 19, 1.450381679389313, 381.4183206106872, 93, 3340, 113.0, 1071.0, 1368.8000000000002, 2182.0300000000025, 5.143992523540638, 717.4068037890806, 3.7599569755090982], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1673.821428571429, 1187, 2405, 1635.0, 2043.7000000000003, 2201.15, 2405.0, 0.24489974416723156, 294.6960909654954, 1.2041701287910263], "isController": true}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 743.0, 105, 1940, 536.0, 1857.0, 1940.0, 1940.0, 0.10494752623688156, 0.02067325712143928, 0.0706141070089955], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 743.0, 105, 1940, 536.0, 1857.0, 1940.0, 1940.0, 0.10262349638252176, 0.020215454365530235, 0.06905037989019286], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 125.86666666666667, 95, 296, 102.0, 286.4, 296.0, 296.0, 0.0771124968512397, 0.020633617321523127, 0.04397822086047265], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 102.39999999999999, 96, 110, 103.0, 107.0, 110.0, 110.0, 0.07718908237618871, 0.05736415203933556, 0.03874530111461035], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 184.93333333333337, 95, 398, 102.0, 342.8, 398.0, 398.0, 0.07710892921400297, 0.020783266077211742, 0.04540691827738652], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 154.4666666666667, 98, 307, 102.0, 305.2, 307.0, 307.0, 0.07719146571155093, 0.02080551224256646, 0.045380139021829746], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/94ab0dbb-a257-4ed6-8416-d89dbecdc2aa", 3, 0, 0.0, 972.3333333333334, 463, 1973, 481.0, 1973.0, 1973.0, 1973.0, 0.022583559168925023, 0.026693002390093343, 0.014482295430593194], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 242.71428571428572, 101, 481, 205.0, 456.5, 481.0, 481.0, 0.10405904607585904, 0.2166106342770498, 0.06725803019942174], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 102.92857142857142, 98, 111, 102.5, 108.5, 111.0, 111.0, 0.07313263648378283, 0.05434954723062377, 0.03670915542252381], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bfacab29-5afa-4499-9f70-030dbf526d87", 3, 0, 0.0, 466.3333333333333, 227, 719, 453.0, 719.0, 719.0, 719.0, 0.03448196593181766, 0.028746196208133148, 0.022112458621640883], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 117.07142857142858, 99, 309, 102.5, 209.0, 309.0, 309.0, 0.07313416462500456, 0.01956910264380005, 0.041709328262697916], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 769.0, 596, 880, 800.0, 880.0, 880.0, 880.0, 0.08242494178738487, 24.235669651136433, 0.047007974613117925], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 986.0, 876, 1071, 998.5, 1071.0, 1071.0, 1071.0, 0.0824317362184441, 74.17222114889232, 0.04693134981968058], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e216fc4b-9eef-4b2e-b3a7-f0444e99407e", 3, 0, 0.0, 289.3333333333333, 211, 424, 233.0, 424.0, 424.0, 424.0, 0.052637119696810196, 0.03274398949889462, 0.03375492376390497], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 197.25, 94, 308, 193.5, 308.0, 308.0, 308.0, 0.08340805304752173, 0.14759315636924744, 0.046183951247992995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 102.85714285714288, 97, 118, 102.0, 112.0, 118.0, 118.0, 0.07223010447568683, 0.05367881787695086, 0.036256126660647495], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 115.21428571428574, 95, 310, 100.0, 207.5, 310.0, 310.0, 0.07215267506042787, 0.027047187205269208, 0.040716736972576835], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 183.0, 97, 937, 102.0, 671.5, 937.0, 937.0, 0.07192027124216582, 4.640427740997123, 0.04183977833144971], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 164.92857142857144, 94, 813, 100.5, 556.0, 813.0, 813.0, 0.07196611424106591, 1.529470686016984, 0.0419367270068265], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 148.0, 99, 280, 106.5, 280.0, 280.0, 280.0, 0.08375209380234507, 0.06224154627303183, 0.047028763609715245], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 117.0, 99, 282, 102.5, 204.0, 282.0, 282.0, 0.07313607489134069, 0.01971245768555667, 0.042996012777917085], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 21, 0, 0.0, 605.1904761904763, 95, 1505, 104.0, 1275.2, 1484.3999999999996, 1505.0, 0.10345133353695184, 44.34112546122053, 0.05658456961782122], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 130.21428571428572, 97, 310, 102.5, 302.5, 310.0, 310.0, 0.07313454667028857, 0.019712045782226215, 0.04306653480682032], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/92249d4c-dd5f-4a93-81e9-594a199a0114", 3, 0, 0.0, 365.6666666666667, 217, 454, 426.0, 454.0, 454.0, 454.0, 0.020268626868091777, 0.027941938407021052, 0.01299778480798854], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 21, 0, 0.0, 435.76190476190476, 94, 910, 293.0, 879.6, 908.1999999999999, 910.0, 0.10345235280208087, 14.499570795893435, 0.056686154811519666], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 774.6923076923077, 104, 2891, 523.0, 2408.5999999999995, 2891.0, 2891.0, 0.095047999239616, 0.018007140480942877, 0.06500991835011297], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 301.6428571428571, 200, 1035, 207.5, 780.0, 1035.0, 1035.0, 0.07188223635906205, 6.246027824522625, 0.1603511383065572], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aeb157c1-eed1-42de-a8ba-f1008c013a15", 3, 0, 0.0, 450.0, 388, 530, 432.0, 530.0, 530.0, 530.0, 0.01980237232420444, 0.023405733694396587, 0.012698786939675372], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=47c9e37a-2968-40ce-ab18-f2327c5321ef", 1, 0, 0.0, 431.0, 431, 431, 431.0, 431.0, 431.0, 431.0, 2.320185614849188, 0.41917415893271465, 1.599659222737819], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 788.9499999999998, 119, 2014, 643.5, 1612.3, 1993.9499999999998, 2014.0, 0.10003251056593393, 0.06144575111911371, 0.04522954335158927], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 21, 0, 0.0, 102.66666666666666, 97, 110, 104.0, 109.0, 110.0, 110.0, 0.10344980467691642, 0.0768801771085287, 0.051926952738217805], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 21, 0, 0.0, 149.38095238095244, 96, 307, 104.0, 303.8, 306.7, 307.0, 0.10344929506694647, 0.10166933602794116, 0.05486122400220692], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c4f81d81-655c-438c-89ed-64ade7814118", 1, 0, 0.0, 2413.0, 2413, 2413, 2413.0, 2413.0, 2413.0, 2413.0, 0.41442188147534187, 0.1323398000414422, 0.24727711873186906], "isController": false}, {"data": ["login", 20, 0, 0.0, 3697.85, 2220, 5484, 3517.0, 5316.300000000001, 5478.6, 5484.0, 0.09322140549913072, 22.43436848906746, 0.17156744219107592], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/3934c3f2-40b3-4ebb-9ea4-cca817a3c939", 1, 0, 0.0, 272.0, 272, 272, 272.0, 272.0, 272.0, 272.0, 3.676470588235294, 1.174029181985294, 2.193675321691176], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=faf8ccd9-1651-4649-a83a-48bda9be9379", 1, 0, 0.0, 855.0, 855, 855, 855.0, 855.0, 855.0, 855.0, 1.1695906432748537, 0.2113029970760234, 0.8063779239766082], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 105.85714285714286, 98, 111, 106.5, 110.5, 111.0, 111.0, 0.07596928670266165, 0.06150247917627588, 0.027004707382586753], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/85a89a7e-a3b1-4b73-a29a-96bdded343ef", 3, 0, 0.0, 282.3333333333333, 196, 454, 197.0, 454.0, 454.0, 454.0, 0.036877235682413245, 0.03074303404383474, 0.023648487726026724], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 21, 0, 0.0, 729.8095238095237, 201, 1606, 402.0, 1379.6000000000001, 1585.7999999999997, 1606.0, 0.103397341211226, 58.98830336810685, 0.21994533942639094], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9e06e690-47a9-4f74-a264-82bd30aacf7d", 1, 0, 0.0, 542.0, 542, 542, 542.0, 542.0, 542.0, 542.0, 1.8450184501845017, 0.33332852859778594, 1.2720537361623616], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/50446e50-7194-46b8-abba-34f97fb6d168", 3, 0, 0.0, 1305.3333333333333, 199, 2158, 1559.0, 2158.0, 2158.0, 2158.0, 0.025547569574547808, 0.02562241596978574, 0.016383044290969786], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 329.93333333333334, 200, 500, 387.0, 446.0, 500.0, 500.0, 0.07706772711859182, 0.11943992474336448, 0.17332712456456736], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 3, 42.857142857142854, 693.1428571428572, 101, 1352, 980.0, 1352.0, 1352.0, 1352.0, 0.0862706433325117, 58.98685431815381, 0.1354477985580478], "isController": false}, {"data": ["register", 21, 5, 23.80952380952381, 1237.4285714285713, 116, 3053, 1339.0, 2429.8, 2996.6999999999994, 3053.0, 0.0884270098196089, 0.02792951314614879, 0.03989577982095636], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 264.64285714285717, 206, 411, 211.5, 409.5, 411.0, 411.0, 0.07309292721510727, 0.11327976122106956, 0.16438770642225783], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 21, 0, 0.0, 141.76190476190476, 99, 429, 106.0, 308.8, 417.1999999999998, 429.0, 0.13160203544481486, 0.10217150212756623, 0.04678041103702404], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/66edef31-ef6f-4bfa-a17c-4ab515cec225", 1, 0, 0.0, 225.0, 225, 225, 225.0, 225.0, 225.0, 225.0, 4.444444444444445, 1.4192708333333333, 2.6519097222222223], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bfacab29-5afa-4499-9f70-030dbf526d87", 1, 0, 0.0, 477.0, 477, 477, 477.0, 477.0, 477.0, 477.0, 2.0964360587002098, 0.3787506551362684, 1.445394392033543], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 528.5555555555555, 198, 1472, 305.5, 1451.3, 1472.0, 1472.0, 0.11218168447031548, 29.95928983150934, 0.2459208519264088], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 6, 0, 0.0, 133.0, 96, 293, 101.5, 293.0, 293.0, 293.0, 0.031985840934413035, 0.023770727491297185, 0.01605539281278154], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 6, 0, 0.0, 165.33333333333334, 97, 305, 104.0, 305.0, 305.0, 305.0, 0.03195109352617593, 0.008549413697433795, 0.018222108026647213], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 6, 0, 0.0, 164.66666666666666, 95, 300, 105.0, 300.0, 300.0, 300.0, 0.031951944275809184, 0.008612047480589193, 0.018784248490270633], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 6, 0, 0.0, 100.83333333333334, 98, 105, 100.5, 105.0, 105.0, 105.0, 0.031986352489604436, 0.008621321569463694, 0.018835713428936987], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 104.0, 104, 104, 104.0, 104.0, 104.0, 104.0, 9.615384615384617, 2.8357872596153846, 5.943885216346154], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=83da6e71-73de-4c89-ad0f-b4779301def0", 1, 0, 0.0, 2891.0, 2891, 2891, 2891.0, 2891.0, 2891.0, 2891.0, 0.3459010722933241, 0.06249189294361813, 0.23848257523348323], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1167.1964285714291, 755, 1989, 1058.0, 1590.7, 1777.75, 1989.0, 0.24638561108031293, 294.7628483496564, 0.48651533750428977], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 5, 23.80952380952381, 1237.4285714285713, 116, 3053, 1339.0, 2429.8, 2996.6999999999994, 3053.0, 0.08810092170345231, 0.027826518796960936, 0.039748658034174766], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 126.24999999999999, 98, 307, 101.0, 307.0, 307.0, 307.0, 0.0406863792173975, 0.010966250648439169, 0.023958873699307316], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 100.62500000000001, 95, 103, 101.0, 103.0, 103.0, 103.0, 0.04068679306697046, 0.010966362193831883, 0.02391938420538693], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 21, 0, 0.0, 190.71428571428572, 94, 1215, 103.0, 306.4, 1124.2999999999988, 1215.0, 0.1384411526214821, 5.9674227057499225, 0.08082171828543928], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 21, 0, 0.0, 172.66666666666663, 96, 774, 104.0, 306.8, 727.2999999999993, 774.0, 0.13863490826990235, 1.9766949974253516, 0.08107021816843481], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=94ab0dbb-a257-4ed6-8416-d89dbecdc2aa", 1, 0, 0.0, 573.0, 573, 573, 573.0, 573.0, 573.0, 573.0, 1.7452006980802792, 0.3152950479930192, 1.2032340750436301], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 125.99999999999999, 98, 300, 102.5, 300.0, 300.0, 300.0, 0.04068658614113159, 0.010886840432294978, 0.023204068658614112], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 21, 0, 0.0, 127.95238095238096, 96, 293, 101.0, 291.8, 293.0, 293.0, 0.13862667177164886, 0.10302236056467265, 0.06958409110412844], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 128.0, 97, 309, 103.0, 309.0, 309.0, 309.0, 0.04068617229576813, 0.030236501090897993, 0.020422551328149238], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 21, 0, 0.0, 120.42857142857142, 97, 307, 102.0, 254.40000000000012, 305.4, 307.0, 0.1386303323167109, 0.04700950442956919, 0.07850819321767603], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 181.99999999999997, 106, 316, 110.5, 316.0, 316.0, 316.0, 0.039614942756407714, 0.031181292833656858, 0.014081874182941807], "isController": false}, {"data": ["deleteAccount", 12, 1, 8.333333333333334, 907.0000000000001, 101, 2484, 624.5, 2268.000000000001, 2484.0, 2484.0, 0.10583037155279612, 0.019886257154574077, 0.07202631813932568], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 2067.1, 1346, 3340, 1905.0, 3048.3, 3325.7999999999997, 3340.0, 0.09648877353119964, 0.04994047848782794, 0.04438106673163578], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 257.125, 200, 617, 207.0, 617.0, 617.0, 617.0, 0.04066487063488029, 0.06302260712651858, 0.09145624714075129], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/faf8ccd9-1651-4649-a83a-48bda9be9379", 2, 0, 0.0, 256.0, 198, 314, 256.0, 314.0, 314.0, 314.0, 0.023504800855574753, 0.033030672296066474, 0.014610161859934892], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c66b8b38-3066-495f-aeee-2b8636cf5718", 1, 0, 0.0, 639.0, 639, 639, 639.0, 639.0, 639.0, 639.0, 1.5649452269170578, 0.28272936228482004, 1.0789563771517996], "isController": false}, {"data": ["addBook", 61, 8, 13.114754098360656, 1080.9344262295078, 505, 2450, 864.0, 1960.4000000000005, 2099.5, 2450.0, 0.2935599680452756, 93.25148757603684, 1.067073377058529], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 205.10714285714292, 99, 679, 105.5, 415.3, 471.1499999999999, 679.0, 0.2473705832203233, 0.18383692756900977, 0.11957855341216798], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 641.0178571428572, 485, 915, 598.0, 821.5000000000001, 873.75, 915.0, 0.24751600014143774, 72.77792234627489, 0.12448314460238323], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 154.0357142857143, 95, 309, 105.0, 306.3, 307.15, 309.0, 0.2480521263825584, 0.4389359892628866, 0.12063472552589266], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=aeb157c1-eed1-42de-a8ba-f1008c013a15", 1, 0, 0.0, 411.0, 411, 411, 411.0, 411.0, 411.0, 411.0, 2.4330900243309004, 0.43957192822384433, 1.6775015206812653], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 960.5535714285713, 655, 1359, 915.5, 1215.4000000000003, 1259.95, 1359.0, 0.24716641361533842, 222.40077344329296, 0.12406595370926167], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 121.44444444444446, 99, 306, 105.0, 166.50000000000023, 306.0, 306.0, 0.1136385158809826, 0.08489596157124188, 0.04039494119206803], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 8, 4.49438202247191, 171.8370786516854, 95, 977, 108.0, 323.0, 444.3999999999992, 737.6300000000024, 0.7350390644356717, 1.5613692451190104, 0.35460698896202575], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 6, 0, 0.0, 140.5, 97, 325, 107.0, 325.0, 325.0, 325.0, 0.031326357997619195, 0.024259572160265645, 0.011135541319466199], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e216fc4b-9eef-4b2e-b3a7-f0444e99407e", 1, 0, 0.0, 459.0, 459, 459, 459.0, 459.0, 459.0, 459.0, 2.1786492374727673, 0.3936036220043573, 1.502076525054466], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=92249d4c-dd5f-4a93-81e9-594a199a0114", 1, 0, 0.0, 523.0, 523, 523, 523.0, 523.0, 523.0, 523.0, 1.9120458891013383, 0.34543797801147225, 1.3182660133843211], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 109.86666666666667, 99, 133, 107.0, 131.2, 133.0, 133.0, 0.08194571915563131, 0.06650087169758752, 0.029129142356103317], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c66b8b38-3066-495f-aeee-2b8636cf5718", 3, 0, 0.0, 768.0, 193, 1092, 1019.0, 1092.0, 1092.0, 1092.0, 0.026881720430107527, 0.02696047547043011, 0.01723860327060932], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 6, 0, 0.0, 331.3333333333333, 202, 598, 295.0, 598.0, 598.0, 598.0, 0.03193391807885548, 0.04949133592885123, 0.07182013021055096], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/47c9e37a-2968-40ce-ab18-f2327c5321ef", 3, 0, 0.0, 998.6666666666666, 192, 2484, 320.0, 2484.0, 2484.0, 2484.0, 0.027610326262021995, 0.023017592954765083, 0.017705840734434677], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 21, 0, 0.0, 351.1428571428571, 200, 1509, 211.0, 594.0, 1417.5999999999985, 1509.0, 0.1383444777495965, 8.085534767284825, 0.309454414259363], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=85a89a7e-a3b1-4b73-a29a-96bdded343ef", 1, 0, 0.0, 1685.0, 1685, 1685, 1685.0, 1685.0, 1685.0, 1685.0, 0.5934718100890207, 0.10721902818991097, 0.4091709940652819], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/83da6e71-73de-4c89-ad0f-b4779301def0", 3, 0, 0.0, 903.0, 221, 1575, 913.0, 1575.0, 1575.0, 1575.0, 0.030799556486386596, 0.025676322969282576, 0.019751017668678907], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 105.28571428571429, 101, 108, 105.5, 108.0, 108.0, 108.0, 0.07362414872078041, 0.06104189674213142, 0.026171084115589913], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fe822a7e-3ba0-4d4f-8b5a-5ea0fe35a669", 1, 0, 0.0, 205.0, 205, 205, 205.0, 205.0, 205.0, 205.0, 4.878048780487805, 1.557736280487805, 2.9106326219512195], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 21, 0, 0.0, 119.95238095238096, 101, 367, 106.0, 122.6, 342.5999999999997, 367.0, 0.10256560535685505, 0.07962857056513648, 0.03645886752919456], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9e06e690-47a9-4f74-a264-82bd30aacf7d", 3, 0, 0.0, 745.3333333333333, 215, 1764, 257.0, 1764.0, 1764.0, 1764.0, 0.036877235682413245, 0.03074303404383474, 0.023648487726026724], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 125.11111111111111, 95, 312, 103.5, 307.5, 312.0, 312.0, 0.11225304330472959, 0.08342242769033127, 0.05634576587756934], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=50446e50-7194-46b8-abba-34f97fb6d168", 1, 0, 0.0, 481.0, 481, 481, 481.0, 481.0, 481.0, 481.0, 2.079002079002079, 0.37560096153846156, 1.4333744802494803], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 157.44444444444443, 94, 306, 102.5, 302.4, 306.0, 306.0, 0.11225444340505145, 0.06750370283754288, 0.061925085749922046], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 395.44444444444446, 94, 1367, 196.5, 1199.6000000000004, 1367.0, 1367.0, 0.11225304330472959, 22.46919569914937, 0.06384879047345839], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 259.6666666666667, 93, 797, 103.0, 628.7000000000003, 797.0, 797.0, 0.11225234326766571, 7.358180077703566, 0.06395801372596709], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 26.31578947368421, 0.3816793893129771], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 10.526315789473685, 0.15267175572519084], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.2631578947368425, 0.07633587786259542], "isController": false}, {"data": ["401/Unauthorized", 11, 57.89473684210526, 0.8396946564885496], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1310, 19, "401/Unauthorized", 11, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 3, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
