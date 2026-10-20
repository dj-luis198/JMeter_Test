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

    var data = {"OkPercent": 98.19624819624819, "KoPercent": 1.8037518037518037};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7671232876712328, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=18d3c3b2-bc4f-48b6-9d19-7b1cf4c29762"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/177106a9-8d23-4b7c-bb7d-c7491d1d23d1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/08b6bd2d-922d-4d2b-9981-e4a59007b059"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=08b6bd2d-922d-4d2b-9981-e4a59007b059"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e5e00647-2770-4a0e-a827-e3eb3571fce4"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2694de09-fc85-4076-a831-3e122bb42fd4"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9c8e8ed6-1dab-444d-91df-c323873f7c62"], "isController": false}, {"data": [0.11904761904761904, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5bccb972-696a-4dbf-b03f-f39547a2a1ee"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4087d5b0-65d1-4b74-b356-3e6d0fcdc5e6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4f238382-da13-4e5e-bf24-fa6fbc11366a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9666e79f-608d-4e88-8dd8-98f65399282b"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/20ef563c-8bb6-4608-8677-9ec3b3aaca3b"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bab2d0e1-70f6-4524-b3f8-b6a6d9bbdb49"], "isController": false}, {"data": [0.34782608695652173, 500, 1500, "register"], "isController": true}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f9349c93-78a5-4501-a695-bd34c18cdc45"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.3559322033898305, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.34782608695652173, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4f238382-da13-4e5e-bf24-fa6fbc11366a"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=391e1dcc-fe04-407a-bbc3-749c3fb8a496"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d9165f39-dbb9-4a08-ba79-acae4bd0b9e8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.4523809523809524, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.2692307692307692, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/18d3c3b2-bc4f-48b6-9d19-7b1cf4c29762"], "isController": false}, {"data": [0.9152542372881356, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9745762711864406, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9047619047619048, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/9c8e8ed6-1dab-444d-91df-c323873f7c62"], "isController": false}, {"data": [0.6363636363636364, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8055555555555556, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=20ef563c-8bb6-4608-8677-9ec3b3aaca3b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4087d5b0-65d1-4b74-b356-3e6d0fcdc5e6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5bccb972-696a-4dbf-b03f-f39547a2a1ee"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d9165f39-dbb9-4a08-ba79-acae4bd0b9e8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/391e1dcc-fe04-407a-bbc3-749c3fb8a496"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2694de09-fc85-4076-a831-3e122bb42fd4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cd853eb6-f182-4ada-9753-bb806f3b4ca3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9666e79f-608d-4e88-8dd8-98f65399282b"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/bab2d0e1-70f6-4524-b3f8-b6a6d9bbdb49"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1386, 25, 1.8037518037518037, 375.34776334776376, 125, 2473, 134.0, 1007.0, 1147.8499999999988, 1548.2599999999998, 5.414612421574066, 751.3018747753679, 3.9626178769621134], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 59, 0, 0.0, 1870.6610169491526, 1522, 2332, 1825.0, 2176.0, 2216.0, 2332.0, 0.2677777172630394, 322.2278357915555, 1.3166609437689487], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=18d3c3b2-bc4f-48b6-9d19-7b1cf4c29762", 1, 0, 0.0, 1104.0, 1104, 1104, 1104.0, 1104.0, 1104.0, 1104.0, 0.9057971014492754, 0.16364498414855072, 0.6245046422101449], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 579.0, 134, 1235, 503.0, 1084.6, 1235.0, 1235.0, 0.09920180699906903, 0.0187940923416205, 0.06706107731254675], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 579.0, 134, 1235, 503.0, 1084.6, 1235.0, 1235.0, 0.09829273087450285, 0.01862186502895855, 0.06644653584282235], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 160.125, 127, 381, 129.0, 379.6, 381.0, 381.0, 0.09555661729574773, 0.025568860487338748, 0.05449713330148113], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 146.3125, 126, 389, 131.0, 209.1000000000002, 389.0, 389.0, 0.09555490525133926, 0.07101297157838786, 0.04796408329998865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 191.5625, 125, 386, 129.0, 385.3, 386.0, 386.0, 0.0955571879908504, 0.025755648325658898, 0.05627049253758085], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 190.9375, 125, 382, 129.5, 380.6, 382.0, 382.0, 0.09555604660746174, 0.02575534068716742, 0.05617650396258981], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 409.5384615384616, 133, 1550, 230.0, 1335.6, 1550.0, 1550.0, 0.09862606307516064, 0.21078061106432694, 0.06375279993703105], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 144.68749999999997, 127, 382, 129.0, 208.40000000000018, 382.0, 382.0, 0.08317434903075892, 0.06181218712149174, 0.04174962441583016], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 143.25000000000003, 126, 378, 127.0, 205.1000000000002, 378.0, 378.0, 0.08317348429320733, 0.022255404976893368, 0.0474348777609698], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 847.8, 645, 913, 895.0, 913.0, 913.0, 913.0, 0.04703624613126876, 13.830218112952842, 0.026825359121739212], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 988.2, 880, 1164, 883.0, 1164.0, 1164.0, 1164.0, 0.04682217872962065, 42.1306787255237, 0.02665754902282113], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 229.4, 128, 382, 129.0, 382.0, 382.0, 382.0, 0.04715379682372025, 0.08344011703572371, 0.02610957304594666], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 22, 0, 0.0, 129.72727272727272, 126, 143, 129.0, 131.7, 141.34999999999997, 143.0, 0.11609192369594469, 0.08627534563731828, 0.05827270388644099], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 22, 0, 0.0, 139.4090909090909, 126, 381, 128.0, 131.4, 343.64999999999947, 381.0, 0.1160955994490736, 0.038990558657301624, 0.0657675799080734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 22, 0, 0.0, 198.1363636363636, 126, 1125, 128.5, 395.8, 1016.2499999999984, 1125.0, 0.11608824817556765, 4.777885790600545, 0.06779372305565376], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 22, 0, 0.0, 214.68181818181822, 125, 1005, 128.5, 382.4, 911.6999999999987, 1005.0, 0.11609069849662546, 1.5814368829383612, 0.06790852382761586], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 128.0, 126, 130, 128.0, 130.0, 130.0, 130.0, 0.04726657402418158, 0.03512681917226775, 0.026541289124906647], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/177106a9-8d23-4b7c-bb7d-c7491d1d23d1", 1, 0, 0.0, 221.0, 221, 221, 221.0, 221.0, 221.0, 221.0, 4.524886877828055, 1.4449589932126696, 2.699908088235294], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/08b6bd2d-922d-4d2b-9981-e4a59007b059", 3, 0, 0.0, 704.6666666666666, 449, 1106, 559.0, 1106.0, 1106.0, 1106.0, 0.02114939935705826, 0.024997874044752125, 0.013562603103321864], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 679.6666666666665, 127, 1416, 879.0, 1236.9000000000003, 1416.0, 1416.0, 0.10566666862345683, 52.834354747221845, 0.057075594228251744], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 178.62500000000003, 126, 439, 128.5, 399.1, 439.0, 439.0, 0.0831752137862917, 0.02241831934083643, 0.048897928417331635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 542.3888888888889, 126, 1012, 636.0, 1003.9, 1012.0, 1012.0, 0.10566666862345683, 17.273496341291597, 0.05717878433432934], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 160.375, 127, 389, 128.0, 382.7, 389.0, 389.0, 0.08317478140627761, 0.022418202800910763, 0.04897889959764199], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 541.9230769230769, 135, 1104, 533.0, 1015.1999999999999, 1104.0, 1104.0, 0.09826746893236174, 0.018617079075076346, 0.06721193694630061], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=08b6bd2d-922d-4d2b-9981-e4a59007b059", 1, 0, 0.0, 545.0, 545, 545, 545.0, 545.0, 545.0, 545.0, 1.834862385321101, 0.33149369266055045, 1.265051605504587], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 22, 0, 0.0, 364.409090909091, 254, 1253, 263.0, 525.9, 1144.6999999999985, 1253.0, 0.11600683385712177, 6.480002292123663, 0.25955293207272573], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e5e00647-2770-4a0e-a827-e3eb3571fce4", 1, 0, 0.0, 214.0, 214, 214, 214.0, 214.0, 214.0, 214.0, 4.672897196261682, 1.4922240070093458, 2.788222838785047], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2694de09-fc85-4076-a831-3e122bb42fd4", 3, 0, 0.0, 347.6666666666667, 219, 567, 257.0, 567.0, 567.0, 567.0, 0.0353852867977495, 0.02949925764617072, 0.022691736650900553], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 332.8571428571428, 148, 718, 274.0, 564.0, 702.9999999999998, 718.0, 0.09511989636460816, 0.05842813946615091, 0.043008312516419504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 142.88888888888889, 126, 380, 129.5, 157.70000000000036, 380.0, 380.0, 0.10566666862345683, 0.07852767072504946, 0.0530397145238836], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 220.83333333333331, 126, 513, 130.0, 408.60000000000014, 513.0, 513.0, 0.10566542803303806, 0.1164429347985606, 0.05533217835150192], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9c8e8ed6-1dab-444d-91df-c323873f7c62", 1, 0, 0.0, 620.0, 620, 620, 620.0, 620.0, 620.0, 620.0, 1.6129032258064515, 0.2913936491935484, 1.1120211693548387], "isController": false}, {"data": ["login", 21, 0, 0.0, 1979.1428571428569, 1346, 3525, 1931.0, 2688.6, 3441.999999999999, 3525.0, 0.09600087772231061, 27.4773539000928, 0.18274720654588844], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 132.00000000000003, 128, 144, 132.0, 136.3, 144.0, 144.0, 0.08137813878024341, 0.06588132524299004, 0.028927385269539654], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5bccb972-696a-4dbf-b03f-f39547a2a1ee", 1, 0, 0.0, 768.0, 768, 768, 768.0, 768.0, 768.0, 768.0, 1.3020833333333333, 0.23523966471354166, 0.8977254231770833], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4087d5b0-65d1-4b74-b356-3e6d0fcdc5e6", 3, 0, 0.0, 531.6666666666666, 227, 891, 477.0, 891.0, 891.0, 891.0, 0.026720344870584462, 0.026798627130947505, 0.017135116990576627], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4f238382-da13-4e5e-bf24-fa6fbc11366a", 1, 0, 0.0, 461.0, 461, 461, 461.0, 461.0, 461.0, 461.0, 2.1691973969631237, 0.3918960140997831, 1.495559924078091], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9666e79f-608d-4e88-8dd8-98f65399282b", 1, 0, 0.0, 507.0, 507, 507, 507.0, 507.0, 507.0, 507.0, 1.9723865877712032, 0.3563393737672584, 1.3598680966469427], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 826.0555555555555, 255, 1545, 1021.0, 1364.1000000000004, 1545.0, 1545.0, 0.1055860907923063, 70.2492125037395, 0.22245715331100382], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/20ef563c-8bb6-4608-8677-9ec3b3aaca3b", 3, 0, 0.0, 345.0, 222, 560, 253.0, 560.0, 560.0, 560.0, 0.053086070215175536, 0.03412922808430068, 0.0340428249752265], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 402.5625, 256, 772, 386.0, 594.2000000000002, 772.0, 772.0, 0.09548077554259934, 0.14797655350205582, 0.21473850202598269], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, 28.571428571428573, 844.0, 133, 1295, 1033.0, 1295.0, 1295.0, 1295.0, 0.06147037128104254, 52.5332241868348, 0.11064323803962205], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bab2d0e1-70f6-4524-b3f8-b6a6d9bbdb49", 1, 0, 0.0, 533.0, 533, 533, 533.0, 533.0, 533.0, 533.0, 1.876172607879925, 0.3389569652908067, 1.2935330675422139], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 833.0, 147, 2473, 867.0, 1756.0000000000014, 2408.399999999999, 2473.0, 0.0920253990101268, 0.0289923768960233, 0.04151927181902205], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 341.99999999999994, 255, 772, 259.5, 629.9000000000001, 772.0, 772.0, 0.08311817846511893, 0.12881694260170287, 0.18693473145036024], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 145.83333333333334, 128, 382, 132.0, 162.40000000000035, 382.0, 382.0, 0.12254818526562321, 0.09514238992790082, 0.043562050231139494], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 451.47058823529414, 254, 1515, 262.0, 918.9999999999994, 1515.0, 1515.0, 0.08983349098230281, 6.452922131537368, 0.20068558311183213], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 153.72727272727275, 127, 389, 131.0, 338.00000000000017, 389.0, 389.0, 0.04645191804192497, 0.034521396122954004, 0.02331668542338812], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 128.8181818181818, 126, 131, 129.0, 130.8, 131.0, 131.0, 0.046453487389989695, 0.025115566246896065, 0.02578366505346374], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f9349c93-78a5-4501-a695-bd34c18cdc45", 1, 0, 0.0, 226.0, 226, 226, 226.0, 226.0, 226.0, 226.0, 4.424778761061947, 1.4129908738938053, 2.6401756084070795], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 384.00000000000006, 126, 1151, 131.0, 1145.8, 1151.0, 1151.0, 0.046395492045282, 7.600548718957198, 0.02655054525247583], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 365.0, 126, 910, 379.0, 909.0, 910.0, 910.0, 0.046401363356421525, 2.4908765955741536, 0.02659921903341742], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 135.0, 135, 135, 135.0, 135.0, 135.0, 135.0, 7.407407407407407, 2.1846064814814814, 4.578993055555555], "isController": false}, {"data": ["https://demoqa.com/books", 59, 0, 0.0, 1241.7796610169494, 999, 1801, 1132.0, 1656.0, 1687.0, 1801.0, 0.2524355754461478, 302.00070903911893, 0.4984616538594832], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 833.0, 147, 2473, 867.0, 1756.0000000000014, 2408.399999999999, 2473.0, 0.09283139800049241, 0.02924630490674481, 0.04188291589475341], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 128.66666666666666, 125, 134, 128.0, 134.0, 134.0, 134.0, 0.027823119157144978, 0.007499200085324232, 0.016384121925545333], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 127.66666666666666, 125, 131, 127.0, 131.0, 131.0, 131.0, 0.027824022333415258, 0.007499443519553332, 0.016357481879605455], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4f238382-da13-4e5e-bf24-fa6fbc11366a", 3, 0, 0.0, 574.6666666666666, 268, 1014, 442.0, 1014.0, 1014.0, 1014.0, 0.025367404576279784, 0.025441723144374356, 0.016267508794033585], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 225.2777777777778, 126, 880, 127.5, 878.2, 880.0, 880.0, 0.12138541217091066, 12.164949393241528, 0.07020228373165731], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 228.16666666666666, 127, 640, 129.0, 630.1, 640.0, 640.0, 0.12138213794405632, 3.9946787840881504, 0.07031892735279044], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=391e1dcc-fe04-407a-bbc3-749c3fb8a496", 1, 0, 0.0, 224.0, 224, 224, 224.0, 224.0, 224.0, 224.0, 4.464285714285714, 0.8065359933035714, 3.077915736607143], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d9165f39-dbb9-4a08-ba79-acae4bd0b9e8", 3, 0, 0.0, 315.0, 237, 464, 244.0, 464.0, 464.0, 464.0, 0.08741513447361521, 0.03955307191351729, 0.05605723141699932], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 171.16666666666669, 125, 396, 126.5, 396.0, 396.0, 396.0, 0.02778935667639294, 0.007435823954425456, 0.01584861747950535], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 144.0555555555556, 127, 382, 129.0, 161.50000000000034, 382.0, 382.0, 0.12117621714778112, 0.09005380981392717, 0.06082478087300732], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 129.16666666666666, 126, 134, 128.5, 134.0, 134.0, 134.0, 0.02782350622550952, 0.020677429919543692, 0.013966095898351457], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 201.27777777777777, 126, 399, 128.5, 397.2, 399.0, 399.0, 0.12138213794405632, 0.05273590281336822, 0.06809306132495346], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 173.5, 129, 385, 131.5, 385.0, 385.0, 385.0, 0.02847677718820302, 0.022414338294620736, 0.010122604391119042], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 460.4615384615385, 135, 571, 469.0, 569.4, 571.0, 571.0, 0.09844755774327907, 0.01844412627792503, 0.06700231919727376], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1012.0476190476192, 766, 2033, 864.0, 1503.0, 1981.7999999999993, 2033.0, 0.09726905547115279, 0.05034433535128025, 0.04473996594425094], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 302.8333333333333, 253, 530, 258.5, 530.0, 530.0, 530.0, 0.027772506144666986, 0.04304196020662745, 0.062461017237468816], "isController": false}, {"data": ["addBook", 65, 15, 23.076923076923077, 1164.846153846154, 643, 2758, 995.0, 2008.2, 2391.2999999999993, 2758.0, 0.29431474471591834, 87.78930838723444, 1.0703089979375329], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/18d3c3b2-bc4f-48b6-9d19-7b1cf4c29762", 3, 0, 0.0, 296.6666666666667, 220, 445, 225.0, 445.0, 445.0, 445.0, 0.019280205655526992, 0.026579319971079693, 0.01236393396529563], "isController": false}, {"data": ["https://demoqa.com/books-0", 59, 0, 0.0, 239.93220338983053, 126, 722, 131.0, 509.0, 526.0, 722.0, 0.2533885348130078, 0.1883092529225576, 0.12248762180902235], "isController": false}, {"data": ["https://demoqa.com/books-3", 59, 0, 0.0, 748.457627118644, 624, 1182, 643.0, 1013.0, 1045.0, 1182.0, 0.2534886918264935, 74.53409201370987, 0.12748698856508214], "isController": false}, {"data": ["https://demoqa.com/books-1", 59, 0, 0.0, 205.4406779661017, 125, 523, 130.0, 391.0, 508.0, 523.0, 0.25406066451935166, 0.449568285262759, 0.12355684661195032], "isController": false}, {"data": ["https://demoqa.com/books-2", 59, 0, 0.0, 986.8644067796608, 871, 1173, 903.0, 1162.0, 1163.0, 1173.0, 0.25325475281906884, 227.8790717609683, 0.12712201459863415], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 151.94117647058823, 127, 485, 132.0, 206.59999999999974, 485.0, 485.0, 0.08839756022733772, 0.06603919294327477, 0.03142257023706146], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 189, 15, 7.936507936507937, 187.010582010582, 127, 1218, 132.0, 255.0, 415.0, 1115.3999999999994, 0.7554228569372999, 1.574902243436015, 0.364190508451543], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 132.36363636363635, 128, 144, 132.0, 142.20000000000002, 144.0, 144.0, 0.04844513148449095, 0.03751659108125129, 0.017220730332377643], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 146.68750000000003, 128, 380, 131.0, 209.90000000000018, 380.0, 380.0, 0.0939364050537786, 0.07623159433563477, 0.03339145648396036], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9c8e8ed6-1dab-444d-91df-c323873f7c62", 3, 0, 0.0, 816.0, 327, 1550, 571.0, 1550.0, 1550.0, 1550.0, 0.020286581778592244, 0.027966690700630913, 0.013009298861922763], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 587.3636363636364, 258, 1514, 512.0, 1467.8000000000002, 1514.0, 1514.0, 0.04636928498562552, 10.14494007692032, 0.10212851484449428], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 430.0, 256, 1007, 264.0, 1005.2, 1007.0, 1007.0, 0.12106944677988903, 16.260246763073816, 0.2688461619303851], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=20ef563c-8bb6-4608-8677-9ec3b3aaca3b", 1, 0, 0.0, 882.0, 882, 882, 882.0, 882.0, 882.0, 882.0, 1.1337868480725624, 0.2048345379818594, 0.7816928854875284], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4087d5b0-65d1-4b74-b356-3e6d0fcdc5e6", 1, 0, 0.0, 488.0, 488, 488, 488.0, 488.0, 488.0, 488.0, 2.0491803278688527, 0.3702132428278689, 1.412813780737705], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5bccb972-696a-4dbf-b03f-f39547a2a1ee", 3, 0, 0.0, 325.3333333333333, 223, 472, 281.0, 472.0, 472.0, 472.0, 0.031442256296311824, 0.026212115356397975, 0.020163165658767673], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d9165f39-dbb9-4a08-ba79-acae4bd0b9e8", 1, 0, 0.0, 224.0, 224, 224, 224.0, 224.0, 224.0, 224.0, 4.464285714285714, 0.8065359933035714, 3.077915736607143], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 22, 0, 0.0, 178.36363636363637, 128, 399, 131.5, 386.8, 397.34999999999997, 399.0, 0.12138198911975989, 0.10063799683855092, 0.04314750394491464], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 160.77777777777783, 128, 383, 131.0, 381.2, 383.0, 383.0, 0.10568155798101254, 0.08204769394033688, 0.03756649131356305], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/391e1dcc-fe04-407a-bbc3-749c3fb8a496", 3, 0, 0.0, 347.0, 226, 490, 325.0, 490.0, 490.0, 490.0, 0.08958967926894822, 0.03966209759302396, 0.05745171489577734], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2694de09-fc85-4076-a831-3e122bb42fd4", 1, 0, 0.0, 554.0, 554, 554, 554.0, 554.0, 554.0, 554.0, 1.8050541516245489, 0.3261084160649819, 1.2445002256317688], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cd853eb6-f182-4ada-9753-bb806f3b4ca3", 1, 0, 0.0, 309.0, 309, 309, 309.0, 309.0, 309.0, 309.0, 3.236245954692557, 1.0334496359223302, 1.931002224919094], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9666e79f-608d-4e88-8dd8-98f65399282b", 3, 0, 0.0, 300.3333333333333, 223, 445, 233.0, 445.0, 445.0, 445.0, 0.017150893561554557, 0.02364389135194777, 0.010998457134200024], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bab2d0e1-70f6-4524-b3f8-b6a6d9bbdb49", 3, 0, 0.0, 1013.0, 230, 2340, 469.0, 2340.0, 2340.0, 2340.0, 0.04547728409659375, 0.029237511748298393, 0.029163492731214092], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 158.23529411764707, 127, 384, 128.0, 383.2, 384.0, 384.0, 0.08989381953551334, 0.06680585611965396, 0.045122483634036974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 202.70588235294122, 126, 390, 129.0, 386.8, 390.0, 390.0, 0.08989524559909894, 0.031996262737363106, 0.05082427660767071], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 231.35294117647058, 126, 1132, 127.0, 535.9999999999994, 1132.0, 1132.0, 0.08989477023954312, 4.7808907927264555, 0.05239386137697636], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 245.99999999999994, 125, 631, 129.0, 434.1999999999998, 631.0, 631.0, 0.08989524559909894, 1.5776388385798665, 0.052481926759170634], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 24.0, 0.4329004329004329], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 4.0, 0.07215007215007214], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.0, 0.07215007215007214], "isController": false}, {"data": ["401/Unauthorized", 17, 68.0, 1.2265512265512266], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1386, 25, "401/Unauthorized", 17, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 189, 15, "401/Unauthorized", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
