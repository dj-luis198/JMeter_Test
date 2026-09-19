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

    var data = {"OkPercent": 97.9457079970653, "KoPercent": 2.054292002934703};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7706885660138977, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bf7df577-c8b3-4b15-84a8-e6b994972cdb"], "isController": false}, {"data": [0.06896551724137931, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3166f1ee-cc90-4727-bf52-c38cdaf2f2de"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0128ad2b-249a-4aeb-999a-f73ff7dba55a"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6071428571428571, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/c66f4ed0-eb84-4ddf-848f-4cfbf8d8049a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0f9ea4fb-a3e7-41b7-a70f-5107cfbe1f7b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0c4101b0-02f4-4703-9920-53f7ee8fd1f7"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.022727272727272728, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2d237056-1348-48b8-ace5-8cc1cb882ab0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=53d0fe02-41d4-49ea-91fb-c8c5262ccd97"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f3b97b97-5631-4af7-a794-e8e805c9e6cc"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/589260d4-d46d-4d5f-9684-f2f50aa5c1ee"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0c7d6395-1c21-4d3a-a075-271eceeaf3a7"], "isController": false}, {"data": [0.725, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/060a6541-2e6c-4612-bdb6-c63af527a8ed"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=995db996-3a25-4bdf-b275-10802399de0b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6089102f-1ce4-4a5b-a5fd-5157e636edda"], "isController": false}, {"data": [0.2391304347826087, 500, 1500, "register"], "isController": true}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=060a6541-2e6c-4612-bdb6-c63af527a8ed"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.3706896551724138, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bf7df577-c8b3-4b15-84a8-e6b994972cdb"], "isController": false}, {"data": [0.2391304347826087, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/787f42ad-4ccb-4250-9c9a-d3e053d01c4e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0c7d6395-1c21-4d3a-a075-271eceeaf3a7"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/0128ad2b-249a-4aeb-999a-f73ff7dba55a"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.29545454545454547, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.29365079365079366, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5086206896551724, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.47413793103448276, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0bdc4c0b-6394-4d97-8c18-3d51654b038a"], "isController": false}, {"data": [0.9103260869565217, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8fb9a0af-21a3-4ef0-934f-cd8e52689ce0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f3b97b97-5631-4af7-a794-e8e805c9e6cc"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/995db996-3a25-4bdf-b275-10802399de0b"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/0c4101b0-02f4-4703-9920-53f7ee8fd1f7"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/53d0fe02-41d4-49ea-91fb-c8c5262ccd97"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=589260d4-d46d-4d5f-9684-f2f50aa5c1ee"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3166f1ee-cc90-4727-bf52-c38cdaf2f2de"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6089102f-1ce4-4a5b-a5fd-5157e636edda"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1363, 28, 2.054292002934703, 370.1217901687452, 100, 2397, 118.0, 1036.0, 1267.8, 1834.039999999996, 5.354799676276234, 736.682190196061, 3.9150281588603666], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bf7df577-c8b3-4b15-84a8-e6b994972cdb", 1, 0, 0.0, 457.0, 457, 457, 457.0, 457.0, 457.0, 457.0, 2.1881838074398248, 0.3953261761487965, 1.5086501641137855], "isController": false}, {"data": ["see books", 58, 0, 0.0, 1775.2931034482758, 1284, 3048, 1704.0, 2148.2, 2432.349999999999, 3048.0, 0.2614885914330928, 314.6595571051072, 1.2857373611968965], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/3166f1ee-cc90-4727-bf52-c38cdaf2f2de", 3, 0, 0.0, 370.0, 233, 445, 432.0, 445.0, 445.0, 445.0, 0.051860047019775965, 0.03334101330210206, 0.03325660567348915], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0128ad2b-249a-4aeb-999a-f73ff7dba55a", 1, 0, 0.0, 882.0, 882, 882, 882.0, 882.0, 882.0, 882.0, 1.1337868480725624, 0.2048345379818594, 0.7816928854875284], "isController": false}, {"data": ["deleteBook", 14, 3, 21.428571428571427, 477.6428571428571, 114, 1239, 438.5, 945.5, 1239.0, 1239.0, 0.07340065221722399, 0.015057988153659023, 0.049136862397370154], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, 21.428571428571427, 477.6428571428571, 114, 1239, 438.5, 945.5, 1239.0, 1239.0, 0.07168862557542924, 0.014706769518508469, 0.047990774249957756], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 165.16666666666666, 101, 339, 107.0, 330.0, 339.0, 339.0, 0.0853412226552499, 0.04419853035302819, 0.04747661117116604], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 118.61111111111109, 102, 322, 106.5, 134.8000000000003, 322.0, 322.0, 0.08542019618171723, 0.06348122001395196, 0.04287693441152603], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 223.55555555555554, 100, 796, 106.0, 661.0000000000002, 796.0, 796.0, 0.08533758124848882, 4.201181347693752, 0.04903021839309335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 315.27777777777777, 101, 1238, 106.5, 1155.2, 1238.0, 1238.0, 0.08541979081642338, 12.829332407260209, 0.04899403366488867], "isController": false}, {"data": ["goToProfile", 14, 3, 21.428571428571427, 399.57142857142856, 105, 2329, 232.0, 1380.5, 2329.0, 2329.0, 0.07287757088645154, 0.1316076613197087, 0.04709896025829893], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/c66f4ed0-eb84-4ddf-848f-4cfbf8d8049a", 1, 0, 0.0, 586.0, 586, 586, 586.0, 586.0, 586.0, 586.0, 1.7064846416382253, 0.5449418728668942, 1.0182247226962458], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 108.66666666666667, 101, 121, 108.0, 112.9, 121.0, 121.0, 0.08239268352970255, 0.06123128141221059, 0.04135726497487023], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 128.94444444444443, 101, 318, 107.0, 307.20000000000005, 318.0, 318.0, 0.08239871824216068, 0.02204809452964065, 0.04699301899748226], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 761.6, 635, 865, 819.0, 865.0, 865.0, 865.0, 0.04106978577999738, 12.075880664550203, 0.02342261220265475], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 970.2, 828, 1214, 927.0, 1214.0, 1214.0, 1214.0, 0.04100478115748296, 36.89617416422005, 0.0233454955222779], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 155.8, 104, 331, 114.0, 331.0, 331.0, 331.0, 0.04124629814474151, 0.07298661351393712, 0.022838526414129333], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 133.3125, 103, 324, 108.0, 317.7, 324.0, 324.0, 0.0832089532833733, 0.061837903758444404, 0.041766994128568234], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 198.06249999999994, 102, 331, 109.0, 328.9, 331.0, 331.0, 0.0831216329244788, 0.030044330455246793, 0.04696899887785796], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 235.5, 101, 1018, 108.0, 600.1000000000004, 1018.0, 1018.0, 0.08312336026183859, 4.6956631766761046, 0.04842098085565109], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 176.43750000000003, 101, 613, 106.5, 410.0000000000002, 613.0, 613.0, 0.0832076551042696, 1.550138706510999, 0.04855134172343856], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 197.4, 105, 333, 115.0, 333.0, 333.0, 333.0, 0.04117361265512159, 0.03059874924858157, 0.023119948512397376], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 105.77777777777776, 101, 112, 106.0, 109.30000000000001, 112.0, 112.0, 0.08239645512139744, 0.022208419544439157, 0.0484401034991028], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 607.0000000000001, 101, 1341, 570.0, 1276.4, 1337.8, 1341.0, 0.10381628669905735, 46.72102949745131, 0.05657176560358789], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 147.27777777777774, 101, 428, 107.5, 327.20000000000016, 428.0, 428.0, 0.0823998498491625, 0.02220933452965708, 0.048522567831098616], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 460.30000000000007, 101, 879, 468.5, 859.4, 878.05, 879.0, 0.10381520892810796, 15.276549928627043, 0.05667256034259019], "isController": false}, {"data": ["deleteBooks", 13, 2, 15.384615384615385, 490.46153846153834, 107, 882, 482.0, 856.4, 882.0, 882.0, 0.0775748896049648, 0.015378615810359231, 0.052633443728368534], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 411.4375, 209, 1123, 416.5, 794.0000000000003, 1123.0, 1123.0, 0.08307545328044197, 6.332399045476023, 0.18551016441151424], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0f9ea4fb-a3e7-41b7-a70f-5107cfbe1f7b", 1, 0, 0.0, 358.0, 358, 358, 358.0, 358.0, 358.0, 358.0, 2.793296089385475, 0.8919998254189945, 1.6667030377094973], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0c4101b0-02f4-4703-9920-53f7ee8fd1f7", 1, 0, 0.0, 482.0, 482, 482, 482.0, 482.0, 482.0, 482.0, 2.074688796680498, 0.3748217064315353, 1.4304006742738589], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 511.86363636363654, 109, 1820, 481.0, 1091.5, 1714.9999999999986, 1820.0, 0.09544799819516513, 0.05862967857886608, 0.043156663246446736], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 117.85000000000001, 103, 314, 107.5, 114.7, 304.04999999999984, 314.0, 0.10381359231364162, 0.07715053100652469, 0.052109557079308394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 169.8, 103, 338, 109.0, 330.00000000000006, 337.7, 338.0, 0.10381359231364162, 0.10573982107727366, 0.054846829532890745], "isController": false}, {"data": ["login", 22, 0, 0.0, 2510.045454545454, 1499, 3870, 2404.5, 3389.5, 3805.7999999999993, 3870.0, 0.09190907685687667, 25.116525597983433, 0.1733086641015679], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/2d237056-1348-48b8-ace5-8cc1cb882ab0", 1, 0, 0.0, 233.0, 233, 233, 233.0, 233.0, 233.0, 233.0, 4.291845493562231, 1.3705405042918455, 2.5608570278969958], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=53d0fe02-41d4-49ea-91fb-c8c5262ccd97", 1, 0, 0.0, 448.0, 448, 448, 448.0, 448.0, 448.0, 448.0, 2.232142857142857, 0.4032679966517857, 1.5389578683035714], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 113.5, 106, 132, 111.0, 129.3, 132.0, 132.0, 0.08513455990162229, 0.06892241226410632, 0.030262675590029795], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f3b97b97-5631-4af7-a794-e8e805c9e6cc", 1, 0, 0.0, 493.0, 493, 493, 493.0, 493.0, 493.0, 493.0, 2.028397565922921, 0.3664585446247465, 1.3984850405679514], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/589260d4-d46d-4d5f-9684-f2f50aa5c1ee", 3, 0, 0.0, 703.6666666666667, 206, 1534, 371.0, 1534.0, 1534.0, 1534.0, 0.029491275497665274, 0.024585662939297127, 0.018912048414843945], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0c7d6395-1c21-4d3a-a075-271eceeaf3a7", 3, 0, 0.0, 339.6666666666667, 225, 481, 313.0, 481.0, 481.0, 481.0, 0.02609399055397542, 0.026170437791926522, 0.016733450973740748], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 729.45, 211, 1453, 799.0, 1384.9, 1449.6, 1453.0, 0.10375435119810336, 62.14353693071284, 0.22007270586160207], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/060a6541-2e6c-4612-bdb6-c63af527a8ed", 3, 0, 0.0, 544.6666666666667, 203, 1089, 342.0, 1089.0, 1089.0, 1089.0, 0.01863435056182567, 0.025688956585068916, 0.011949762567316592], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 448.8888888888889, 207, 1346, 216.0, 1266.8000000000002, 1346.0, 1346.0, 0.08529471694000464, 17.117180910390793, 0.18819257533182016], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 5, 50.0, 639.4000000000001, 105, 1542, 527.5, 1525.0, 1542.0, 1542.0, 0.07239766589925141, 43.31607497411783, 0.10548566164226865], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=995db996-3a25-4bdf-b275-10802399de0b", 1, 0, 0.0, 448.0, 448, 448, 448.0, 448.0, 448.0, 448.0, 2.232142857142857, 0.4032679966517857, 1.5389578683035714], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6089102f-1ce4-4a5b-a5fd-5157e636edda", 1, 0, 0.0, 495.0, 495, 495, 495.0, 495.0, 495.0, 495.0, 2.0202020202020203, 0.36497790404040403, 1.392834595959596], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 1216.3043478260872, 295, 2397, 1211.0, 1917.2, 2302.3999999999987, 2397.0, 0.09677039330853768, 0.03048727574513203, 0.043660079793500395], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 281.5555555555555, 209, 536, 219.5, 437.00000000000017, 536.0, 536.0, 0.08235008852634518, 0.1276265532141697, 0.18520727917595012], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 152.9375, 107, 340, 112.0, 327.40000000000003, 340.0, 340.0, 0.15788902375243002, 0.12257985730779478, 0.05612461391199661], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=060a6541-2e6c-4612-bdb6-c63af527a8ed", 1, 0, 0.0, 664.0, 664, 664, 664.0, 664.0, 664.0, 664.0, 1.5060240963855422, 0.2720844314759036, 1.0383330195783131], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 352.6875, 212, 652, 326.5, 645.7, 652.0, 652.0, 0.11602694725850078, 0.17981910673753979, 0.26094732376594465], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 130.0, 102, 327, 112.0, 286.40000000000015, 327.0, 327.0, 0.05556257103169592, 0.04129210601085996, 0.027889806162394244], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 142.90909090909093, 100, 315, 107.0, 313.4, 315.0, 315.0, 0.05550845747042913, 0.01485284897157967, 0.031657167151104115], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 147.6363636363636, 102, 326, 108.0, 325.6, 326.0, 326.0, 0.055565377718283536, 0.014976605713131108, 0.03266636463516278], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 126.81818181818181, 102, 322, 108.0, 279.8000000000002, 322.0, 322.0, 0.05556369367230554, 0.014976151810113603, 0.03271963601992211], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 113.5, 107, 120, 113.5, 120.0, 120.0, 120.0, 0.07093959493491292, 0.02092163834994502, 0.04385230819707019], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 1221.4482758620686, 809, 2391, 1119.0, 1692.6000000000001, 1984.349999999999, 2391.0, 0.25589778207215436, 306.1427118215951, 0.5052981595213829], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bf7df577-c8b3-4b15-84a8-e6b994972cdb", 3, 0, 0.0, 290.6666666666667, 206, 441, 225.0, 441.0, 441.0, 441.0, 0.05314249273719266, 0.0341655023294126, 0.03407900738680649], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 1216.3043478260872, 295, 2397, 1211.0, 1917.2, 2302.3999999999987, 2397.0, 0.09616108235569566, 0.03029531381960181, 0.043385175828448634], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/787f42ad-4ccb-4250-9c9a-d3e053d01c4e", 1, 0, 0.0, 830.0, 830, 830, 830.0, 830.0, 830.0, 830.0, 1.2048192771084338, 0.384742093373494, 0.7188911897590362], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 106.16666666666667, 104, 109, 105.5, 109.0, 109.0, 109.0, 0.037180941049617965, 0.010021425517279843, 0.02189463618449183], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 106.16666666666666, 100, 110, 107.0, 110.0, 110.0, 110.0, 0.03717978906666336, 0.01002111502187411, 0.02185764943176889], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0c7d6395-1c21-4d3a-a075-271eceeaf3a7", 1, 0, 0.0, 506.0, 506, 506, 506.0, 506.0, 506.0, 506.0, 1.976284584980237, 0.35704360177865613, 1.3625555830039526], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 222.6875, 102, 1137, 107.0, 565.1000000000006, 1137.0, 1137.0, 0.165231220439102, 9.333960453585517, 0.0962504130780511], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0128ad2b-249a-4aeb-999a-f73ff7dba55a", 3, 0, 0.0, 1297.3333333333333, 351, 2329, 1212.0, 2329.0, 2329.0, 2329.0, 0.03258390355164549, 0.027163859699141958, 0.02089527669164766], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 177.9375, 102, 846, 106.0, 477.8000000000004, 846.0, 846.0, 0.16522951412196005, 3.078186315640006, 0.09641077606237415], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 105.66666666666666, 101, 111, 105.0, 111.0, 111.0, 111.0, 0.037180480247869865, 0.009948683191324555, 0.021204492641363284], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 108.3125, 101, 113, 109.0, 112.3, 113.0, 113.0, 0.16521927695913918, 0.12278502906826655, 0.08293233237988043], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 106.5, 103, 112, 106.5, 112.0, 112.0, 112.0, 0.0371811714547753, 0.027631710426839845, 0.018663205202885256], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 160.5625, 104, 328, 108.0, 327.3, 328.0, 328.0, 0.165231220439102, 0.05972285689943615, 0.09336612785798376], "isController": false}, {"data": ["deleteAccount", 13, 2, 15.384615384615385, 645.8461538461539, 106, 1534, 481.0, 1405.1999999999998, 1534.0, 1534.0, 0.07735931019298173, 0.01501044908567246, 0.05264407985563563], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 239.83333333333334, 113, 446, 218.5, 446.0, 446.0, 446.0, 0.03767897513187641, 0.029657474566691783, 0.013393698191409193], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1428.636363636364, 1074, 2216, 1439.0, 1856.3999999999996, 2176.9999999999995, 2216.0, 0.09443843472587098, 0.048879267973351195, 0.04343799097254417], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 215.83333333333334, 209, 224, 216.5, 224.0, 224.0, 224.0, 0.03715584399499635, 0.057584301191464064, 0.08356436398484042], "isController": false}, {"data": ["addBook", 63, 12, 19.047619047619047, 1107.6825396825398, 550, 2804, 923.0, 1837.4, 1973.1999999999998, 2804.0, 0.2966422917735913, 85.63994725476392, 1.0796552607509287], "isController": true}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 186.25862068965523, 103, 446, 111.0, 426.5, 441.15, 446.0, 0.2568110269341634, 0.19085272607118978, 0.124142049152745], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 656.0862068965517, 500, 999, 620.5, 834.5, 957.2499999999999, 999.0, 0.2567564576462516, 75.49492366475575, 0.1291304450076363], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 173.55172413793105, 100, 414, 112.0, 327.1, 333.0999999999999, 414.0, 0.2569805669522991, 0.4547351438648105, 0.12497687728734858], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 1030.4999999999995, 699, 2279, 994.0, 1307.1, 1562.599999999999, 2279.0, 0.25643179577418085, 230.73778059662394, 0.12871674123821186], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 114.18750000000001, 109, 125, 112.5, 120.80000000000001, 125.0, 125.0, 0.12155283749905037, 0.09080851629567728, 0.04320823520474056], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0bdc4c0b-6394-4d97-8c18-3d51654b038a", 1, 0, 0.0, 333.0, 333, 333, 333.0, 333.0, 333.0, 333.0, 3.003003003003003, 0.9589667792792792, 1.7918308933933933], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 184, 12, 6.521739130434782, 194.086956521739, 103, 2355, 114.0, 334.5, 439.25, 2005.6500000000024, 0.750851849584787, 1.5849519113056252, 0.3617411780008569], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 122.99999999999999, 102, 240, 112.0, 215.60000000000008, 240.0, 240.0, 0.057432256043439676, 0.04447634672114029, 0.020415372265441444], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 124.33333333333334, 106, 316, 112.0, 165.70000000000024, 316.0, 316.0, 0.08688516677125066, 0.07050934920596612, 0.03088496162571801], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8fb9a0af-21a3-4ef0-934f-cd8e52689ce0", 1, 0, 0.0, 215.0, 215, 215, 215.0, 215.0, 215.0, 215.0, 4.651162790697675, 1.4852834302325582, 2.7752543604651163], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f3b97b97-5631-4af7-a794-e8e805c9e6cc", 3, 0, 0.0, 350.3333333333333, 239, 454, 358.0, 454.0, 454.0, 454.0, 0.02282462320351195, 0.026977931917953085, 0.014636884020481293], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/995db996-3a25-4bdf-b275-10802399de0b", 3, 0, 0.0, 359.66666666666663, 201, 676, 202.0, 676.0, 676.0, 676.0, 0.029730051135687954, 0.02981715089487454, 0.01906516951084156], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 317.2727272727273, 215, 653, 229.0, 608.2000000000002, 653.0, 653.0, 0.05547626372407115, 0.08597737356455168, 0.12476741734036706], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0c4101b0-02f4-4703-9920-53f7ee8fd1f7", 3, 0, 0.0, 721.0, 328, 1300, 535.0, 1300.0, 1300.0, 1300.0, 0.06762849413886385, 0.04347860544409378, 0.04336853302524797], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 373.7500000000001, 213, 1246, 318.5, 682.5000000000006, 1246.0, 1246.0, 0.16503692701241904, 12.579885367026653, 0.3685327765915749], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/53d0fe02-41d4-49ea-91fb-c8c5262ccd97", 3, 0, 0.0, 491.33333333333337, 261, 847, 366.0, 847.0, 847.0, 847.0, 0.021556989494560454, 0.025605942273974967, 0.013823980893321645], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 115.125, 105, 146, 112.0, 132.0, 146.0, 146.0, 0.0825823500872276, 0.06846915549224242, 0.029355444757569186], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=589260d4-d46d-4d5f-9684-f2f50aa5c1ee", 1, 0, 0.0, 818.0, 818, 818, 818.0, 818.0, 818.0, 818.0, 1.2224938875305624, 0.2208607121026895, 0.8428522310513448], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 113.9, 106, 148, 111.0, 127.20000000000002, 147.0, 148.0, 0.1047981848954376, 0.08136187206237588, 0.03725247978705009], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3166f1ee-cc90-4727-bf52-c38cdaf2f2de", 1, 0, 0.0, 456.0, 456, 456, 456.0, 456.0, 456.0, 456.0, 2.1929824561403506, 0.3961931195175438, 1.5119586074561402], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6089102f-1ce4-4a5b-a5fd-5157e636edda", 3, 0, 0.0, 388.6666666666667, 197, 502, 467.0, 502.0, 502.0, 502.0, 0.04405027604839657, 0.028320083071478916, 0.028248386658639726], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 133.375, 102, 328, 108.0, 314.7, 328.0, 328.0, 0.11630527226337328, 0.08643389862541707, 0.05837979486657605], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 146.49999999999997, 100, 333, 106.0, 327.4, 333.0, 333.0, 0.11612547357419692, 0.031072636483720658, 0.06622780914778417], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 174.25, 101, 334, 108.5, 328.4, 334.0, 334.0, 0.11630949957837806, 0.031349044808234715, 0.06837726440056992], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 198.93750000000003, 100, 329, 111.0, 329.0, 329.0, 329.0, 0.11612041687229657, 0.03129808111011118, 0.06837950329491682], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 21.428571428571427, 0.4402054292002935], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 10.714285714285714, 0.22010271460014674], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 7.142857142857143, 0.1467351430667645], "isController": false}, {"data": ["401/Unauthorized", 17, 60.714285714285715, 1.247248716067498], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1363, 28, "401/Unauthorized", 17, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 5, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 184, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
