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

    var data = {"OkPercent": 98.28614008941878, "KoPercent": 1.713859910581222};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8055555555555556, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e81c1e3e-f41c-4002-bdb0-5436d35f2155"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c2f7984c-dded-4853-b809-e99ededa6d97"], "isController": false}, {"data": [0.6, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3c09127c-eeb5-4f27-af23-c51eccd095e0"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f1f223d5-304c-4b5b-84de-61ca1cc55416"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/48355712-0c13-434e-9636-1fbe0c05a209"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.09090909090909091, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a6c10a7e-6ee0-47c6-bf2d-9b7a488af49a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/36265e5c-8381-4ffc-998e-5d6be8954047"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=afcb7547-7f4d-41b6-974d-5c3c754496e3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3c09127c-eeb5-4f27-af23-c51eccd095e0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6f14f34c-57ef-45fb-80a4-acb891aed028"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/514512a6-b378-41c6-92a6-428f08aa98d0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=850040a1-a753-45b0-baa2-13c7d82c595b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/6770206f-a963-43c3-8ff3-531d40764c14"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c2f7984c-dded-4853-b809-e99ededa6d97"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e81c1e3e-f41c-4002-bdb0-5436d35f2155"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2777777777777778, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bfd647fb-8317-4868-821a-e9c1a9a2f800"], "isController": false}, {"data": [0.3541666666666667, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f1f223d5-304c-4b5b-84de-61ca1cc55416"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.49122807017543857, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=580acd27-2461-44f6-9d35-e1c57f234548"], "isController": false}, {"data": [0.3541666666666667, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9cf503a5-286b-4ebb-8845-5b32f7341d45"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/850040a1-a753-45b0-baa2-13c7d82c595b"], "isController": false}, {"data": [0.45454545454545453, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8941d40b-5ed6-4820-b701-2f6e8a171d1b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ecdc68e3-c64b-43e9-94b6-48ed2ebddbf5"], "isController": false}, {"data": [0.36065573770491804, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.7456140350877193, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9357541899441341, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9cf503a5-286b-4ebb-8845-5b32f7341d45"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bfd647fb-8317-4868-821a-e9c1a9a2f800"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/580acd27-2461-44f6-9d35-e1c57f234548"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=36265e5c-8381-4ffc-998e-5d6be8954047"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=514512a6-b378-41c6-92a6-428f08aa98d0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/afcb7547-7f4d-41b6-974d-5c3c754496e3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6770206f-a963-43c3-8ff3-531d40764c14"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6f14f34c-57ef-45fb-80a4-acb891aed028"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1342, 23, 1.713859910581222, 311.0394932935921, 80, 2513, 102.0, 902.4000000000001, 1055.0, 1376.6999999999994, 5.182827923933697, 724.1274751310189, 3.7828879481388933], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e81c1e3e-f41c-4002-bdb0-5436d35f2155", 1, 0, 0.0, 369.0, 369, 369, 369.0, 369.0, 369.0, 369.0, 2.710027100271003, 0.4896045054200542, 1.8684366531165313], "isController": false}, {"data": ["see books", 57, 0, 0.0, 1402.3157894736842, 987, 1868, 1413.0, 1734.0, 1808.0, 1868.0, 0.2663140730634996, 320.46620731382546, 1.3094642166745316], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c2f7984c-dded-4853-b809-e99ededa6d97", 1, 0, 0.0, 555.0, 555, 555, 555.0, 555.0, 555.0, 555.0, 1.8018018018018018, 0.3255208333333333, 1.2422578828828827], "isController": false}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 609.4666666666667, 89, 1159, 589.0, 1109.8, 1159.0, 1159.0, 0.08317899009615491, 0.016294634192664723, 0.05600502054521055], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 609.4666666666667, 89, 1159, 589.0, 1109.8, 1159.0, 1159.0, 0.08327088017320343, 0.016312635315180284, 0.056066890804119134], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 139.6, 82, 255, 87.0, 253.8, 255.0, 255.0, 0.11394453180191884, 0.06471693329687109, 0.06307007873567147], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 100.73333333333333, 83, 314, 85.0, 181.4000000000001, 314.0, 314.0, 0.11394453180191884, 0.08467948115357445, 0.05719481381463504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 223.2, 83, 677, 85.0, 658.4, 677.0, 677.0, 0.11394885975174342, 6.725519867933271, 0.065142248533858], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 272.4, 82, 926, 86.0, 924.8, 926.0, 926.0, 0.11394453180191884, 20.530067291367562, 0.06502850037601696], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3c09127c-eeb5-4f27-af23-c51eccd095e0", 3, 0, 0.0, 337.6666666666667, 268, 438, 307.0, 438.0, 438.0, 438.0, 0.07035812284528248, 0.03183521834470789, 0.04511897851731982], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 383.20000000000005, 84, 2513, 200.0, 1359.8000000000006, 2513.0, 2513.0, 0.08345666373641047, 0.1454786570014577, 0.05394256234212781], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 95.38888888888887, 82, 248, 85.5, 108.50000000000023, 248.0, 248.0, 0.08904939767976848, 0.06617831214287481, 0.04469862344472753], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 95.38888888888889, 82, 252, 85.0, 112.50000000000023, 252.0, 252.0, 0.08905204102330691, 0.03868971053139332, 0.04995649436745841], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 626.2, 489, 666, 658.0, 666.0, 666.0, 666.0, 0.06846407689885117, 20.130711829565524, 0.03904591885637606], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 862.8, 778, 925, 888.0, 925.0, 925.0, 925.0, 0.06809206046574968, 61.26935570015661, 0.03876725708157428], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f1f223d5-304c-4b5b-84de-61ca1cc55416", 1, 0, 0.0, 880.0, 880, 880, 880.0, 880.0, 880.0, 880.0, 1.1363636363636362, 0.20530007102272727, 0.7834694602272727], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 150.2, 82, 252, 84.0, 252.0, 252.0, 252.0, 0.06868886690845148, 0.12154709652159577, 0.03803377689169139], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 19, 0, 0.0, 95.05263157894736, 83, 252, 86.0, 95.0, 252.0, 252.0, 0.11135074311969619, 0.08275187061922734, 0.05589285348000375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 19, 0, 0.0, 118.1578947368421, 81, 251, 84.0, 247.0, 251.0, 251.0, 0.11135661663433417, 0.02979659468535895, 0.06350807042426872], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 19, 0, 0.0, 129.8421052631579, 82, 290, 85.0, 251.0, 290.0, 290.0, 0.11135596399099776, 0.03001391216944861, 0.06546512726814516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 19, 0, 0.0, 122.05263157894736, 82, 294, 85.0, 255.0, 294.0, 294.0, 0.11135596399099776, 0.03001391216944861, 0.06557387332673012], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 151.2, 85, 250, 87.0, 250.0, 250.0, 250.0, 0.06884397202180977, 0.051162365926364486, 0.03865750382084045], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 690.9999999999999, 81, 1126, 893.0, 1090.5, 1126.0, 1126.0, 0.07568099379956429, 48.6471790078492, 0.039846550027839794], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 177.72222222222223, 82, 943, 85.0, 597.4000000000005, 943.0, 943.0, 0.08898028592331877, 8.917386825109247, 0.05146103775730133], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 497.35714285714283, 83, 753, 661.0, 751.5, 753.0, 753.0, 0.07567894827884449, 15.900201934407976, 0.0399193782704117], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 158.44444444444446, 82, 649, 85.5, 519.4000000000002, 649.0, 649.0, 0.08897940621076256, 2.928306851661443, 0.051547422933947616], "isController": false}, {"data": ["deleteBooks", 15, 2, 13.333333333333334, 594.4666666666667, 92, 1537, 483.0, 1231.0000000000002, 1537.0, 1537.0, 0.0832657955214104, 0.016311639239838797, 0.05661640419437568], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 19, 0, 0.0, 243.94736842105263, 168, 546, 173.0, 347.0, 546.0, 546.0, 0.11129530158097904, 0.17248598008692748, 0.2503057417392527], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/48355712-0c13-434e-9636-1fbe0c05a209", 1, 0, 0.0, 308.0, 308, 308, 308.0, 308.0, 308.0, 308.0, 3.246753246753247, 1.0368049918831168, 1.9372717126623378], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 644.0454545454545, 182, 1307, 547.0, 1233.3999999999999, 1297.85, 1307.0, 0.09362498936079666, 0.05750988116009873, 0.04233239265043834], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 85.57142857142856, 83, 94, 85.0, 91.0, 94.0, 94.0, 0.07567894827884449, 0.05624187464863346, 0.03798728458527936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 132.99999999999997, 82, 259, 85.0, 256.5, 259.0, 259.0, 0.07568058468657426, 0.10144239085778536, 0.03862159302225009], "isController": false}, {"data": ["login", 22, 0, 0.0, 2285.6818181818185, 1376, 3800, 2252.5, 3359.6999999999994, 3763.2499999999995, 3800.0, 0.09513842641042718, 25.999028648828933, 0.1793980980963666], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a6c10a7e-6ee0-47c6-bf2d-9b7a488af49a", 1, 0, 0.0, 214.0, 214, 214, 214.0, 214.0, 214.0, 214.0, 4.672897196261682, 1.4922240070093458, 2.788222838785047], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 95.49999999999999, 86, 179, 89.0, 106.10000000000011, 179.0, 179.0, 0.08521879926711833, 0.06899060995355576, 0.030292620051983465], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/36265e5c-8381-4ffc-998e-5d6be8954047", 3, 0, 0.0, 318.3333333333333, 248, 396, 311.0, 396.0, 396.0, 396.0, 0.05146945287971589, 0.033089898905416304, 0.033006127009453226], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=afcb7547-7f4d-41b6-974d-5c3c754496e3", 1, 0, 0.0, 483.0, 483, 483, 483.0, 483.0, 483.0, 483.0, 2.070393374741201, 0.37404567805383027, 1.427439182194617], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3c09127c-eeb5-4f27-af23-c51eccd095e0", 1, 0, 0.0, 398.0, 398, 398, 398.0, 398.0, 398.0, 398.0, 2.512562814070352, 0.4539298052763819, 1.7322942839195978], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6f14f34c-57ef-45fb-80a4-acb891aed028", 3, 0, 0.0, 292.3333333333333, 228, 379, 270.0, 379.0, 379.0, 379.0, 0.0670331143584931, 0.030330738593198375, 0.04298673023640345], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 778.5000000000001, 170, 1215, 978.5, 1182.5, 1215.0, 1215.0, 0.07564337391060034, 64.67333290783935, 0.15629938769390367], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/514512a6-b378-41c6-92a6-428f08aa98d0", 3, 0, 0.0, 299.3333333333333, 171, 528, 199.0, 528.0, 528.0, 528.0, 0.01890287701788212, 0.026046835422101247, 0.012121962150139252], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=850040a1-a753-45b0-baa2-13c7d82c595b", 1, 0, 0.0, 946.0, 946, 946, 946.0, 946.0, 946.0, 946.0, 1.0570824524312896, 0.1909768102536998, 0.7288088002114165], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6770206f-a963-43c3-8ff3-531d40764c14", 3, 0, 0.0, 1098.3333333333333, 255, 2513, 527.0, 2513.0, 2513.0, 2513.0, 0.032968119828126204, 0.026990501747310353, 0.021141665384573117], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c2f7984c-dded-4853-b809-e99ededa6d97", 3, 0, 0.0, 616.0, 166, 965, 717.0, 965.0, 965.0, 965.0, 0.02278319511528297, 0.026928965320179837, 0.014610317180047998], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e81c1e3e-f41c-4002-bdb0-5436d35f2155", 3, 0, 0.0, 326.6666666666667, 200, 579, 201.0, 579.0, 579.0, 579.0, 0.027035795393100463, 0.02729101611784002, 0.01733740785299737], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 425.6, 169, 1241, 332.0, 1102.4, 1241.0, 1241.0, 0.11386841366117315, 27.386421001890216, 0.2502658708846058], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, 44.44444444444444, 601.2222222222222, 84, 1175, 864.0, 1175.0, 1175.0, 1175.0, 0.1161395222794317, 77.20450355193373, 0.17969112936007126], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bfd647fb-8317-4868-821a-e9c1a9a2f800", 3, 0, 0.0, 478.0, 366, 591, 477.0, 591.0, 591.0, 591.0, 0.025349399219238504, 0.025423665037263617, 0.01625596238994136], "isController": false}, {"data": ["register", 24, 5, 20.833333333333332, 1020.4583333333335, 223, 1948, 964.5, 1571.0, 1889.75, 1948.0, 0.09608955546569402, 0.030450254637321983, 0.043352904907373674], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f1f223d5-304c-4b5b-84de-61ca1cc55416", 3, 0, 0.0, 308.6666666666667, 212, 412, 302.0, 412.0, 412.0, 412.0, 0.05181615627752733, 0.03331279578389208, 0.03322845959203413], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 298.8888888888889, 170, 1037, 176.0, 765.2000000000004, 1037.0, 1037.0, 0.08894027660426024, 11.94513465804934, 0.1975002995557927], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 107.2777777777778, 87, 257, 90.0, 148.10000000000016, 257.0, 257.0, 0.10139645450397418, 0.07872088020572214, 0.036043270936959575], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 249.55555555555557, 169, 903, 173.5, 393.6000000000008, 903.0, 903.0, 0.09315468335170551, 6.327761316676758, 0.2081829273341717], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 111.25, 82, 255, 88.0, 255.0, 255.0, 255.0, 0.035070491688293466, 0.02606312907694466, 0.017603742898225434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 83.875, 82, 85, 84.5, 85.0, 85.0, 85.0, 0.03507141416709775, 0.009384343243930454, 0.020001665892172938], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 106.25, 82, 258, 85.0, 258.0, 258.0, 258.0, 0.03507141416709775, 0.009452842099725566, 0.020618155594328953], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 105.25, 83, 252, 85.0, 252.0, 252.0, 252.0, 0.035071567918283246, 0.009452883540474782, 0.020652495561254685], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 95.0, 92, 98, 95.0, 98.0, 98.0, 98.0, 0.04869971754163826, 0.014362612009350347, 0.03010441523814162], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 985.9824561403509, 647, 1515, 933.0, 1358.2, 1419.1999999999998, 1515.0, 0.2624841128036987, 314.0222531555656, 0.518303589930741], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=580acd27-2461-44f6-9d35-e1c57f234548", 1, 0, 0.0, 1027.0, 1027, 1027, 1027.0, 1027.0, 1027.0, 1027.0, 0.9737098344693281, 0.17591437439143137, 0.671327288218111], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 5, 20.833333333333332, 1020.4583333333335, 223, 1948, 964.5, 1571.0, 1889.75, 1948.0, 0.09268842784978296, 0.029372455895756412, 0.04181841178378879], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 83.0, 81, 85, 83.0, 85.0, 85.0, 85.0, 0.042554775975701224, 0.01146984196220072, 0.025059111243503747], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 85.37499999999999, 82, 90, 85.0, 90.0, 90.0, 90.0, 0.042554775975701224, 0.01146984196220072, 0.02501755384508998], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9cf503a5-286b-4ebb-8845-5b32f7341d45", 3, 0, 0.0, 331.6666666666667, 238, 413, 344.0, 413.0, 413.0, 413.0, 0.027133605875330126, 0.027213098861293007, 0.017400131371875113], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 118.55555555555557, 80, 253, 85.0, 253.0, 253.0, 253.0, 0.10335857962343024, 0.027858367164127682, 0.060763539973930664], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 117.77777777777777, 82, 260, 85.0, 251.0, 260.0, 260.0, 0.10335679915477106, 0.027857887272184387, 0.06086342762727241], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 84.87500000000001, 83, 90, 84.0, 90.0, 90.0, 90.0, 0.042554323253278015, 0.01138660602675603, 0.024269262480385117], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 95.16666666666667, 83, 257, 86.0, 105.80000000000024, 257.0, 257.0, 0.10335620567884929, 0.07681061769687922, 0.051879970428641155], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 87.37499999999999, 83, 105, 85.0, 105.0, 105.0, 105.0, 0.042549343942303086, 0.03162114330087173, 0.021357776158538858], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 101.0, 82, 256, 85.0, 178.60000000000014, 256.0, 256.0, 0.10335679915477106, 0.027656018523835226, 0.058945674517955376], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 155.875, 88, 258, 112.0, 258.0, 258.0, 258.0, 0.04320517598008241, 0.03400719906244768, 0.01535808989916992], "isController": false}, {"data": ["deleteAccount", 15, 2, 13.333333333333334, 531.5333333333334, 84, 1507, 438.0, 1213.0000000000002, 1507.0, 1507.0, 0.08255047961828658, 0.015870544681822935, 0.05617839605793943], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/850040a1-a753-45b0-baa2-13c7d82c595b", 3, 0, 0.0, 456.6666666666667, 170, 1017, 183.0, 1017.0, 1017.0, 1017.0, 0.030571067541678557, 0.025485841137447517, 0.019604493182651936], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1157.0909090909092, 872, 2093, 1104.0, 1622.1999999999998, 2036.5999999999992, 2093.0, 0.09701673538685424, 0.050213739995149165, 0.0446239085617269], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 174.125, 168, 194, 171.0, 194.0, 194.0, 194.0, 0.042530342741399565, 0.06591372454160264, 0.09565173763031563], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8941d40b-5ed6-4820-b701-2f6e8a171d1b", 1, 0, 0.0, 497.0, 497, 497, 497.0, 497.0, 497.0, 497.0, 2.012072434607646, 0.64252703722334, 1.2005627515090542], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ecdc68e3-c64b-43e9-94b6-48ed2ebddbf5", 1, 0, 0.0, 499.0, 499, 499, 499.0, 499.0, 499.0, 499.0, 2.004008016032064, 0.6399517785571143, 1.195750876753507], "isController": false}, {"data": ["addBook", 61, 10, 16.39344262295082, 912.6065573770493, 432, 2145, 740.0, 1511.4, 1706.5, 2145.0, 0.2664057927974355, 84.64565112332623, 0.9678364137412981], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 170.2631578947369, 82, 459, 91.0, 341.6, 358.3999999999998, 459.0, 0.26336824887837473, 0.195725817769964, 0.12731179999491746], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 529.1052631578948, 405, 765, 501.0, 667.2, 755.9, 765.0, 0.2630668051228799, 77.35037534614052, 0.13230410609207338], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 149.21052631578942, 83, 344, 90.0, 255.2, 261.29999999999995, 344.0, 0.2637472468489145, 0.46670899540061817, 0.12826770403394472], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 813.7894736842104, 560, 1173, 833.0, 1012.2, 1073.1999999999996, 1173.0, 0.2629648595906052, 236.61624290254386, 0.13199603303669052], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 104.77777777777779, 87, 255, 90.0, 184.80000000000013, 255.0, 255.0, 0.0874185307858926, 0.06530778911250765, 0.031074555865297757], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 10, 5.58659217877095, 154.6759776536313, 83, 876, 93.0, 323.0, 380.0, 754.3999999999983, 0.7431086017934242, 1.6076753401590003, 0.35739317165185985], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 91.5, 85, 110, 88.5, 110.0, 110.0, 110.0, 0.03700174833260872, 0.028654674245858117, 0.013152965227607005], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 103.73333333333333, 85, 250, 92.0, 166.00000000000006, 250.0, 250.0, 0.11512160679063985, 0.0934238820732634, 0.04092213366386026], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 218.25000000000003, 167, 513, 174.5, 513.0, 513.0, 513.0, 0.03505727482274165, 0.054331928851260744, 0.07884463273122463], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 235.5, 167, 511, 175.0, 363.4000000000002, 511.0, 511.0, 0.10330519223374521, 0.1601028711669469, 0.23233579854913594], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9cf503a5-286b-4ebb-8845-5b32f7341d45", 1, 0, 0.0, 836.0, 836, 836, 836.0, 836.0, 836.0, 836.0, 1.1961722488038278, 0.2161053379186603, 0.8247046949760766], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bfd647fb-8317-4868-821a-e9c1a9a2f800", 1, 0, 0.0, 719.0, 719, 719, 719.0, 719.0, 719.0, 719.0, 1.3908205841446453, 0.25127129694019473, 0.9589055980528512], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/580acd27-2461-44f6-9d35-e1c57f234548", 3, 0, 0.0, 323.0, 183, 524, 262.0, 524.0, 524.0, 524.0, 0.040724903278354714, 0.026182188793864112, 0.026115904771601164], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 19, 0, 0.0, 108.15789473684211, 87, 254, 91.0, 248.0, 254.0, 254.0, 0.11064201484932304, 0.09173346738972195, 0.0393297787159703], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 101.35714285714286, 85, 249, 89.5, 175.5, 249.0, 249.0, 0.07382525561994757, 0.05731550607212727, 0.026242571333653243], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=36265e5c-8381-4ffc-998e-5d6be8954047", 1, 0, 0.0, 395.0, 395, 395, 395.0, 395.0, 395.0, 395.0, 2.5316455696202533, 0.4573773734177215, 1.7454509493670884], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=514512a6-b378-41c6-92a6-428f08aa98d0", 1, 0, 0.0, 1537.0, 1537, 1537, 1537.0, 1537.0, 1537.0, 1537.0, 0.6506180871828238, 0.11754330676642812, 0.44857067338972023], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/afcb7547-7f4d-41b6-974d-5c3c754496e3", 3, 0, 0.0, 630.6666666666667, 187, 1507, 198.0, 1507.0, 1507.0, 1507.0, 0.03964059196617336, 0.025485081098044395, 0.025420561905391117], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6770206f-a963-43c3-8ff3-531d40764c14", 1, 0, 0.0, 405.0, 405, 405, 405.0, 405.0, 405.0, 405.0, 2.4691358024691357, 0.44608410493827155, 1.7023533950617282], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 85.77777777777777, 82, 97, 84.5, 91.60000000000001, 97.0, 97.0, 0.09319664492078285, 0.06926039725069898, 0.04678034715750233], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 120.61111111111109, 82, 251, 85.0, 248.3, 251.0, 251.0, 0.09320436610675006, 0.0327165933545287, 0.052720742243325534], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 134.94444444444446, 82, 819, 85.5, 306.0000000000008, 819.0, 819.0, 0.09320243569031937, 4.6828206633036125, 0.054347861262996566], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6f14f34c-57ef-45fb-80a4-acb891aed028", 1, 0, 0.0, 177.0, 177, 177, 177.0, 177.0, 177.0, 177.0, 5.649717514124294, 1.020700918079096, 3.895215395480226], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 143.66666666666669, 82, 646, 85.0, 292.3000000000006, 646.0, 646.0, 0.09320388349514563, 1.5462277508090614, 0.05443972491909385], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 21.73913043478261, 0.37257824143070045], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 8.695652173913043, 0.14903129657228018], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 8.695652173913043, 0.14903129657228018], "isController": false}, {"data": ["401/Unauthorized", 14, 60.869565217391305, 1.0432190760059612], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1342, 23, "401/Unauthorized", 14, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
