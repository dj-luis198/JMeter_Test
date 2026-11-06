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

    var data = {"OkPercent": 98.48942598187311, "KoPercent": 1.5105740181268883};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7784645413142486, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4a2c38f2-9a7a-4aa0-845e-a1f5a063c660"], "isController": false}, {"data": [0.1694915254237288, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=27829959-04a8-46d5-8554-2cafe1c5208d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8e7b0379-65db-4f95-a9e2-85c51b7c569b"], "isController": false}, {"data": [0.5384615384615384, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5384615384615384, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d9ee5a97-aed8-462d-9ddf-d0c06545b077"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b28f32f4-8ba4-41e3-9d97-85387410ba56"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ff2312f4-53f3-40da-a597-d0a4fb29b384"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=91633637-2feb-4b08-b507-567e53719e45"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/877f67d3-6eb9-4bbd-aaf8-c5d02ce75bb4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f6c6071d-fd94-4548-be22-cc5aaa9ea052"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4aa64745-8d5b-4fe9-82ee-9eb561c2aa47"], "isController": false}, {"data": [0.7391304347826086, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/91633637-2feb-4b08-b507-567e53719e45"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/27829959-04a8-46d5-8554-2cafe1c5208d"], "isController": false}, {"data": [0.6176470588235294, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=742d1b8e-8b5b-4764-9157-edd841363008"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0de9da2d-fe8e-4b3c-8798-c42941958a1b"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.2391304347826087, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/742d1b8e-8b5b-4764-9157-edd841363008"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4830508474576271, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4a2c38f2-9a7a-4aa0-845e-a1f5a063c660"], "isController": false}, {"data": [0.2391304347826087, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=877f67d3-6eb9-4bbd-aaf8-c5d02ce75bb4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.3695652173913043, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fe524491-790e-4ed6-a744-60354ebd2fbe"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f6c6071d-fd94-4548-be22-cc5aaa9ea052"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ff2312f4-53f3-40da-a597-d0a4fb29b384"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d9ee5a97-aed8-462d-9ddf-d0c06545b077"], "isController": false}, {"data": [0.3392857142857143, 500, 1500, "addBook"], "isController": true}, {"data": [0.9915254237288136, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5169491525423728, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9239766081871345, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6989fd81-48f1-4734-88d0-47371fd5b2fb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a39f2dde-51f9-4a73-bbc5-9849146f5648"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6989fd81-48f1-4734-88d0-47371fd5b2fb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0de9da2d-fe8e-4b3c-8798-c42941958a1b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4aa64745-8d5b-4fe9-82ee-9eb561c2aa47"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8e7b0379-65db-4f95-a9e2-85c51b7c569b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/eb47368d-9d4d-4003-bddd-ff67e11a6834"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/41edad11-d2c4-4dec-aaa3-8c8bf669e975"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1324, 20, 1.5105740181268883, 355.5551359516616, 99, 4021, 122.0, 880.0, 1060.75, 1648.0, 5.196864610686544, 754.7048748081595, 3.800271643135546], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4a2c38f2-9a7a-4aa0-845e-a1f5a063c660", 1, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 2.277904328018223, 0.4115354498861048, 1.570508257403189], "isController": false}, {"data": ["see books", 59, 0, 0.0, 1604.1016949152543, 1264, 2053, 1557.0, 1919.0, 1983.0, 2053.0, 0.25758567998253656, 309.9620033835407, 1.2665467760860074], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=27829959-04a8-46d5-8554-2cafe1c5208d", 1, 0, 0.0, 809.0, 809, 809, 809.0, 809.0, 809.0, 809.0, 1.2360939431396785, 0.22331775339925833, 0.8522288318912237], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8e7b0379-65db-4f95-a9e2-85c51b7c569b", 1, 0, 0.0, 351.0, 351, 351, 351.0, 351.0, 351.0, 351.0, 2.849002849002849, 0.5147124287749288, 1.9642539173789175], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 572.6923076923077, 115, 1038, 540.0, 952.3999999999999, 1038.0, 1038.0, 0.07269555103227682, 0.01377239931666182, 0.0491426730573512], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 572.6923076923077, 115, 1038, 540.0, 952.3999999999999, 1038.0, 1038.0, 0.07029116764443483, 0.013316881370137068, 0.04751729399280868], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 146.05555555555557, 99, 330, 110.5, 329.1, 330.0, 330.0, 0.11331230760514438, 0.03977488228110265, 0.06409473302361303], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 137.94444444444446, 100, 306, 114.0, 303.3, 306.0, 306.0, 0.11331587429492346, 0.08421228548675462, 0.05687925721444399], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 227.22222222222217, 108, 899, 115.0, 394.1000000000008, 899.0, 899.0, 0.11331302092513786, 1.8798330167388513, 0.06618532895399491], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 214.94444444444446, 101, 1079, 112.0, 448.100000000001, 1079.0, 1079.0, 0.11331658765982361, 5.693426939523566, 0.06607675152820008], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d9ee5a97-aed8-462d-9ddf-d0c06545b077", 1, 0, 0.0, 504.0, 504, 504, 504.0, 504.0, 504.0, 504.0, 1.984126984126984, 0.35846044146825395, 1.3679625496031746], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b28f32f4-8ba4-41e3-9d97-85387410ba56", 1, 0, 0.0, 359.0, 359, 359, 359.0, 359.0, 359.0, 359.0, 2.785515320334262, 0.8895151462395543, 1.6620604108635098], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ff2312f4-53f3-40da-a597-d0a4fb29b384", 1, 0, 0.0, 219.0, 219, 219, 219.0, 219.0, 219.0, 219.0, 4.5662100456621, 0.8249500570776256, 3.148187785388128], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 269.15384615384613, 132, 542, 232.0, 520.8, 542.0, 542.0, 0.07305546033369487, 0.13134287351009008, 0.04722372567393662], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=91633637-2feb-4b08-b507-567e53719e45", 1, 0, 0.0, 910.0, 910, 910, 910.0, 910.0, 910.0, 910.0, 1.098901098901099, 0.19853193681318682, 0.7576407967032966], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/877f67d3-6eb9-4bbd-aaf8-c5d02ce75bb4", 3, 0, 0.0, 422.6666666666667, 284, 542, 442.0, 542.0, 542.0, 542.0, 0.029675351652917088, 0.029762291159712743, 0.019030092043049045], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 126.39999999999999, 105, 328, 111.0, 210.40000000000006, 328.0, 328.0, 0.0897735910034892, 0.06671650659536649, 0.045062134546673294], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 124.73333333333333, 101, 339, 111.0, 204.60000000000008, 339.0, 339.0, 0.08977681483831196, 0.0509904253026975, 0.049692869775737517], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 675.8333333333334, 516, 850, 688.5, 850.0, 850.0, 850.0, 0.07053263897868739, 20.73893776376268, 0.04022564566753265], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 868.3333333333333, 728, 1148, 809.0, 1148.0, 1148.0, 1148.0, 0.07040766035344645, 63.35293654949658, 0.040085611314511015], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 278.0, 113, 448, 326.5, 448.0, 448.0, 448.0, 0.07093707881109457, 0.12552537773994468, 0.039278636412002556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 110.45454545454545, 106, 116, 110.0, 115.6, 116.0, 116.0, 0.09690178563563166, 0.07201392467648017, 0.04864015411788543], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 171.1818181818182, 106, 348, 113.0, 346.0, 348.0, 348.0, 0.09690263927552063, 0.025929026524895166, 0.055264786461820356], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 167.81818181818178, 105, 329, 110.0, 329.0, 329.0, 329.0, 0.09690520028542987, 0.026118979764432268, 0.056969658761551537], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 191.45454545454544, 105, 351, 112.0, 348.6, 351.0, 351.0, 0.09690349293044971, 0.026118519578910277, 0.05706328734088006], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f6c6071d-fd94-4548-be22-cc5aaa9ea052", 1, 0, 0.0, 511.0, 511, 511, 511.0, 511.0, 511.0, 511.0, 1.9569471624266144, 0.35355002446183953, 1.349223336594912], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 143.5, 105, 316, 110.5, 316.0, 316.0, 316.0, 0.07094546658468524, 0.05272412116303268, 0.03983754227167384], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 573.1764705882352, 100, 1093, 749.0, 1011.4, 1093.0, 1093.0, 0.07776192044498116, 41.16763776153163, 0.04178452457734109], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 263.8, 100, 944, 110.0, 830.0000000000001, 944.0, 944.0, 0.08977627751642905, 16.175528473668617, 0.0512356021294933], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 517.6470588235294, 106, 866, 720.0, 855.6, 866.0, 866.0, 0.077760141980871, 13.458079278751812, 0.041859506577593186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 212.33333333333334, 107, 775, 113.0, 635.8000000000001, 775.0, 775.0, 0.08977305372019535, 5.298609022640765, 0.05132143129668199], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 521.2307692307693, 114, 972, 504.0, 947.1999999999999, 972.0, 972.0, 0.07032691194529647, 0.013323653239636248, 0.0481014523183537], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 344.0, 217, 463, 427.0, 459.8, 463.0, 463.0, 0.09680456917566509, 0.15002817507986377, 0.21771574493316084], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4aa64745-8d5b-4fe9-82ee-9eb561c2aa47", 1, 0, 0.0, 696.0, 696, 696, 696.0, 696.0, 696.0, 696.0, 1.4367816091954022, 0.25957480244252873, 0.9905935704022989], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 495.00000000000006, 162, 948, 522.0, 866.0000000000001, 935.9999999999998, 948.0, 0.09521562198570109, 0.05848693967676367, 0.0430515947064254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 149.52941176470588, 100, 333, 112.0, 330.6, 333.0, 333.0, 0.0777665448324131, 0.057793301384244496, 0.039035160199082354], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 229.1176470588235, 101, 356, 313.0, 344.0, 356.0, 356.0, 0.07776298756249629, 0.08951141686450485, 0.0405075121333132], "isController": false}, {"data": ["login", 23, 0, 0.0, 2573.304347826087, 1576, 4663, 2385.0, 3969.8000000000006, 4556.5999999999985, 4663.0, 0.0959236614478634, 30.068092766521808, 0.1862227230120864], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 114.13333333333333, 107, 122, 114.0, 120.2, 122.0, 122.0, 0.08817460923952339, 0.07138354595660634, 0.03134331812811183], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/91633637-2feb-4b08-b507-567e53719e45", 3, 0, 0.0, 1015.0, 214, 2086, 745.0, 2086.0, 2086.0, 2086.0, 0.04011231448054552, 0.02578835322235593, 0.025723066252172747], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/27829959-04a8-46d5-8554-2cafe1c5208d", 3, 0, 0.0, 969.6666666666667, 233, 2236, 440.0, 2236.0, 2236.0, 2236.0, 0.02147889340741165, 0.02538732485752334, 0.013773899743685206], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 762.1176470588236, 223, 1196, 890.0, 1123.2, 1196.0, 1196.0, 0.07772352371024671, 54.74627930776916, 0.16310420752866628], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=742d1b8e-8b5b-4764-9157-edd841363008", 1, 0, 0.0, 972.0, 972, 972, 972.0, 972.0, 972.0, 972.0, 1.02880658436214, 0.18586837705761317, 0.7093139146090535], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0de9da2d-fe8e-4b3c-8798-c42941958a1b", 3, 0, 0.0, 334.3333333333333, 206, 479, 318.0, 479.0, 479.0, 479.0, 0.071147369918892, 0.032192332092206996, 0.04562510375658114], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 416.9444444444444, 215, 1183, 428.0, 698.8000000000008, 1183.0, 1183.0, 0.11323318487204649, 7.691642987956393, 0.2530545437960796], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, 25.0, 798.6250000000001, 111, 1465, 892.5, 1465.0, 1465.0, 1465.0, 0.09376025502789367, 84.13366806232713, 0.17409512197623178], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 1139.8260869565217, 150, 4021, 876.0, 2790.6000000000004, 3794.999999999997, 4021.0, 0.09513921348825857, 0.029973376532051572, 0.042924137335522916], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 118.33333333333334, 113, 167, 115.0, 137.00000000000003, 167.0, 167.0, 0.0807654410062297, 0.06270363828120372, 0.028709590357683213], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 396.0666666666667, 216, 1272, 228.0, 1039.2, 1272.0, 1272.0, 0.08971291866028708, 21.576797996411486, 0.19717567845394737], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 341.6111111111111, 214, 1034, 228.0, 696.5000000000006, 1034.0, 1034.0, 0.08761682242990654, 5.951588473216024, 0.19580686575155765], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 112.0, 106, 116, 113.0, 116.0, 116.0, 116.0, 0.037218007135223656, 0.0276590853807668, 0.01868169498779781], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/742d1b8e-8b5b-4764-9157-edd841363008", 3, 0, 0.0, 741.3333333333334, 301, 1374, 549.0, 1374.0, 1374.0, 1374.0, 0.027492920572952467, 0.02291971666254273, 0.017630551278879022], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 139.42857142857142, 106, 326, 108.0, 326.0, 326.0, 326.0, 0.037176695522863665, 0.009947670481703755, 0.021202334165383186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 109.85714285714285, 106, 113, 111.0, 113.0, 113.0, 113.0, 0.03722018397405221, 0.010032002711756262, 0.02188139721912054], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 110.14285714285714, 106, 115, 110.0, 115.0, 115.0, 115.0, 0.037219986069090924, 0.010031949370184664, 0.021917628515294756], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 114.0, 114, 114, 114.0, 114.0, 114.0, 114.0, 8.771929824561402, 2.58703399122807, 5.422491776315789], "isController": false}, {"data": ["https://demoqa.com/books", 59, 0, 0.0, 1042.033898305085, 803, 1587, 898.0, 1427.0, 1462.0, 1587.0, 0.26243216795658747, 313.9601090594698, 0.5182010191486522], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4a2c38f2-9a7a-4aa0-845e-a1f5a063c660", 3, 0, 0.0, 364.66666666666663, 216, 651, 227.0, 651.0, 651.0, 651.0, 0.020908400298293175, 0.024713021316114102, 0.0134080561808716], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 1139.8260869565217, 150, 4021, 876.0, 2790.6000000000004, 3794.999999999997, 4021.0, 0.0956643263567697, 0.030138812057032574, 0.043161053492995705], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=877f67d3-6eb9-4bbd-aaf8-c5d02ce75bb4", 1, 0, 0.0, 599.0, 599, 599, 599.0, 599.0, 599.0, 599.0, 1.669449081803005, 0.3016094532554257, 1.1510068864774625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 14, 0, 0.0, 178.7142857142857, 103, 442, 112.5, 382.0, 442.0, 442.0, 0.06906826905050864, 0.018616056892519904, 0.040672037341266315], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 14, 0, 0.0, 125.0, 102, 319, 112.5, 221.0, 319.0, 319.0, 0.06906622464282895, 0.01861550586076249, 0.04060338597166311], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 139.86666666666667, 102, 338, 111.0, 329.6, 338.0, 338.0, 0.07734151434685091, 0.02084595503879966, 0.04546835120781665], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 124.13333333333334, 103, 338, 110.0, 204.20000000000007, 338.0, 338.0, 0.07742574870699, 0.020868658831180897, 0.045593482881166957], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 14, 0, 0.0, 156.5, 106, 327, 112.5, 323.5, 327.0, 327.0, 0.06906622464282895, 0.018480610890756966, 0.03938933124161339], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 111.99999999999999, 105, 116, 113.0, 115.4, 116.0, 116.0, 0.07742734733908016, 0.057541221997109385, 0.038864898957311725], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 14, 0, 0.0, 143.0, 105, 339, 112.0, 336.0, 339.0, 339.0, 0.06906520248437399, 0.051326776455672476, 0.034667494215789296], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 137.4, 100, 337, 109.0, 331.0, 337.0, 337.0, 0.07733633054578826, 0.02069351032182225, 0.04410587601439487], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 634.8461538461539, 111, 1288, 563.0, 1260.8, 1288.0, 1288.0, 0.06943813863057308, 0.013009218580577618, 0.04725882932639664], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 14, 0, 0.0, 129.14285714285714, 108, 329, 113.0, 225.0, 329.0, 329.0, 0.06997026263837869, 0.0550742496938801, 0.024872241797236173], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1372.1304347826087, 852, 3229, 1221.0, 2380.2000000000003, 3078.199999999998, 3229.0, 0.09451562795361337, 0.048919221499428796, 0.043473496841945215], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 14, 0, 0.0, 324.85714285714283, 214, 782, 227.5, 717.0, 782.0, 782.0, 0.06902774422262434, 0.10697952156377423, 0.15524501459443735], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fe524491-790e-4ed6-a744-60354ebd2fbe", 1, 0, 0.0, 202.0, 202, 202, 202.0, 202.0, 202.0, 202.0, 4.9504950495049505, 1.580870977722772, 2.953859839108911], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f6c6071d-fd94-4548-be22-cc5aaa9ea052", 3, 0, 0.0, 627.3333333333333, 232, 1220, 430.0, 1220.0, 1220.0, 1220.0, 0.032776855170002624, 0.027324715524211167, 0.0210190119417009], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ff2312f4-53f3-40da-a597-d0a4fb29b384", 3, 0, 0.0, 477.6666666666667, 432, 512, 489.0, 512.0, 512.0, 512.0, 0.08087125296527928, 0.03659213594457624, 0.05186079698619798], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d9ee5a97-aed8-462d-9ddf-d0c06545b077", 3, 0, 0.0, 381.0, 209, 675, 259.0, 675.0, 675.0, 675.0, 0.029869470414289556, 0.024609254433127236, 0.019154575753955218], "isController": false}, {"data": ["addBook", 56, 10, 17.857142857142858, 1050.7321428571427, 547, 3032, 900.0, 1618.0000000000002, 1911.449999999999, 3032.0, 0.25872145401457153, 83.93797171186976, 0.9392458644992584], "isController": true}, {"data": ["https://demoqa.com/books-0", 59, 0, 0.0, 203.38983050847455, 106, 506, 115.0, 439.0, 448.0, 506.0, 0.26335523496643337, 0.19571614629829667, 0.12730550909021926], "isController": false}, {"data": ["https://demoqa.com/books-3", 59, 0, 0.0, 620.2203389830507, 491, 865, 553.0, 789.0, 842.0, 865.0, 0.26328942201278066, 77.4158321033478, 0.1324160667349434], "isController": false}, {"data": ["https://demoqa.com/books-1", 59, 0, 0.0, 161.28813559322035, 102, 461, 113.0, 328.0, 336.0, 461.0, 0.2637555209842104, 0.4667236367415911, 0.12827172797864922], "isController": false}, {"data": ["https://demoqa.com/books-2", 59, 0, 0.0, 834.6271186440677, 689, 1136, 772.0, 1013.0, 1060.0, 1136.0, 0.2629866367129345, 236.6358379954958, 0.1320069641312972], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 137.7777777777778, 105, 381, 115.0, 219.00000000000026, 381.0, 381.0, 0.08256161160265849, 0.0616793289805017, 0.029348072874382507], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 10, 5.847953216374269, 179.88304093567245, 104, 1813, 115.0, 311.6, 343.40000000000003, 1301.8000000000009, 0.7156877927100292, 1.6313385192796246, 0.3399337177888177], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 143.28571428571428, 112, 312, 115.0, 312.0, 312.0, 312.0, 0.03639823832526506, 0.028187307609311707, 0.012938436279684063], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6989fd81-48f1-4734-88d0-47371fd5b2fb", 3, 0, 0.0, 445.6666666666667, 210, 564, 563.0, 564.0, 564.0, 564.0, 0.028356995670831994, 0.028624688663818364, 0.018184661937349945], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 127.38888888888891, 107, 236, 115.0, 223.40000000000003, 236.0, 236.0, 0.12147634248230156, 0.09858089902616465, 0.04318104361675564], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a39f2dde-51f9-4a73-bbc5-9849146f5648", 1, 0, 0.0, 241.0, 241, 241, 241.0, 241.0, 241.0, 241.0, 4.149377593360996, 1.3250453838174274, 2.4758493257261414], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6989fd81-48f1-4734-88d0-47371fd5b2fb", 1, 0, 0.0, 446.0, 446, 446, 446.0, 446.0, 446.0, 446.0, 2.242152466367713, 0.40507637331838564, 1.5458590246636772], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0de9da2d-fe8e-4b3c-8798-c42941958a1b", 1, 0, 0.0, 206.0, 206, 206, 206.0, 206.0, 206.0, 206.0, 4.854368932038835, 0.8770100121359223, 3.3468598300970878], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 255.71428571428572, 218, 435, 227.0, 435.0, 435.0, 435.0, 0.03715360894234291, 0.05758083729638495, 0.08355933729903878], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4aa64745-8d5b-4fe9-82ee-9eb561c2aa47", 3, 0, 0.0, 351.6666666666667, 225, 578, 252.0, 578.0, 578.0, 578.0, 0.03243173120581177, 0.027036999875678366, 0.020797692212060282], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 270.0666666666666, 222, 453, 227.0, 453.0, 453.0, 453.0, 0.07729289369135402, 0.11978888895329963, 0.17383352946405106], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8e7b0379-65db-4f95-a9e2-85c51b7c569b", 3, 0, 0.0, 652.6666666666667, 213, 1288, 457.0, 1288.0, 1288.0, 1288.0, 0.13089005235602097, 0.05922434009598603, 0.08393665466841187], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 115.45454545454545, 110, 119, 116.0, 118.8, 119.0, 119.0, 0.09900990099009901, 0.08208926361386139, 0.03519492574257426], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 128.11764705882354, 105, 333, 115.0, 172.99999999999986, 333.0, 333.0, 0.07687889764705351, 0.059686253544343294, 0.02732804564797605], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eb47368d-9d4d-4003-bddd-ff67e11a6834", 1, 0, 0.0, 227.0, 227, 227, 227.0, 227.0, 227.0, 227.0, 4.405286343612335, 1.406766244493392, 2.6285448788546253], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/41edad11-d2c4-4dec-aaa3-8c8bf669e975", 1, 0, 0.0, 225.0, 225, 225, 225.0, 225.0, 225.0, 225.0, 4.444444444444445, 1.4192708333333333, 2.6519097222222223], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 123.44444444444441, 102, 329, 110.0, 149.00000000000028, 329.0, 329.0, 0.08766333383658581, 0.06514823930629082, 0.044002884367192484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 120.33333333333333, 100, 337, 108.5, 137.20000000000033, 337.0, 337.0, 0.08766845737608307, 0.03077337886410902, 0.049589373730633796], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 179.94444444444446, 105, 925, 112.0, 389.50000000000085, 925.0, 925.0, 0.08766674946304116, 4.404688169676558, 0.051119912284546785], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 203.72222222222223, 100, 757, 109.5, 377.2000000000006, 757.0, 757.0, 0.08766760341124387, 1.4543823299857297, 0.051206023129636034], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 30.0, 0.45317220543806647], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.0, 0.0755287009063444], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.0, 0.0755287009063444], "isController": false}, {"data": ["401/Unauthorized", 12, 60.0, 0.9063444108761329], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1324, 20, "401/Unauthorized", 12, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
