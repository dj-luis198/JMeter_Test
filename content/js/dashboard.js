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

    var data = {"OkPercent": 98.45440494590417, "KoPercent": 1.545595054095827};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7846255798542081, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/197c842e-9f51-44cd-bacf-976413e26d47"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2e548b43-42b5-4714-b5e6-92374daff872"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1bf198fa-b688-4ab5-9f16-065e3ec392d6"], "isController": false}, {"data": [0.8, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8d4cd556-e289-4503-a80c-3f3a1eab7758"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fb8d389d-977b-4969-b0ed-022797145c4d"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/0bfdd1fa-220d-4e85-865d-13cd83c27c4a"], "isController": false}, {"data": [0.7045454545454546, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1af8fa9e-9ac5-4e38-a544-248a6a385060"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6cfe6417-04c9-40a6-aea5-ab0e9e31c9e2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=299b47ab-bd97-4bfe-99db-4c7602998617"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=03ac0b59-8973-48d8-9515-18cdb0562522"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d3298d02-ba24-435d-a862-6e3e212bbc53"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ccee9cef-d3eb-4fdd-a0d4-7f5ba1365524"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.35, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/57c4a995-caf3-4024-ba41-318cbf01ed05"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=11d26181-cd24-4f97-8a40-9ff170134658"], "isController": false}, {"data": [0.06521739130434782, 500, 1500, "register"], "isController": true}, {"data": [0.868421052631579, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.06521739130434782, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/99ef8fd8-743b-46cb-aca5-99690b965033"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/299b47ab-bd97-4bfe-99db-4c7602998617"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.11363636363636363, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/2e548b43-42b5-4714-b5e6-92374daff872"], "isController": false}, {"data": [0.3135593220338983, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8240740740740741, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/8d4cd556-e289-4503-a80c-3f3a1eab7758"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9011627906976745, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/1af8fa9e-9ac5-4e38-a544-248a6a385060"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/03ac0b59-8973-48d8-9515-18cdb0562522"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fb8d389d-977b-4969-b0ed-022797145c4d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0bfdd1fa-220d-4e85-865d-13cd83c27c4a"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6cfe6417-04c9-40a6-aea5-ab0e9e31c9e2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=57c4a995-caf3-4024-ba41-318cbf01ed05"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ccee9cef-d3eb-4fdd-a0d4-7f5ba1365524"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d3298d02-ba24-435d-a862-6e3e212bbc53"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/11d26181-cd24-4f97-8a40-9ff170134658"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=197c842e-9f51-44cd-bacf-976413e26d47"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1294, 20, 1.545595054095827, 371.91885625966, 77, 6992, 122.5, 871.0, 1189.25, 3312.4999999999995, 5.000173885490608, 696.6548937233617, 3.658632985932664], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/197c842e-9f51-44cd-bacf-976413e26d47", 3, 0, 0.0, 1744.6666666666665, 451, 3425, 1358.0, 3425.0, 3425.0, 3425.0, 0.026102845210127904, 0.026179318389454448, 0.016739129252588532], "isController": false}, {"data": ["see books", 54, 0, 0.0, 1343.0925925925924, 981, 1757, 1294.5, 1646.0, 1738.75, 1757.0, 0.24501907972648612, 294.84055645704683, 1.204756900803572], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2e548b43-42b5-4714-b5e6-92374daff872", 1, 0, 0.0, 1069.0, 1069, 1069, 1069.0, 1069.0, 1069.0, 1069.0, 0.9354536950420954, 0.16900286482694107, 0.6449514733395697], "isController": false}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 1019.2142857142857, 87, 4811, 569.0, 3351.5, 4811.0, 4811.0, 0.07126023729659019, 0.013455738166983096, 0.048191127273328825], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 1019.2142857142857, 87, 4811, 569.0, 3351.5, 4811.0, 4811.0, 0.07135612311989357, 0.013473843839672985, 0.048255971934107716], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 96.68421052631578, 77, 234, 80.0, 234.0, 234.0, 234.0, 0.09658643214803142, 0.02584441641460997, 0.05508444958442417], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 98.31578947368422, 78, 242, 81.0, 234.0, 242.0, 242.0, 0.09658495918014619, 0.07177847064071412, 0.04848112208847183], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 137.3684210526316, 78, 241, 81.0, 236.0, 241.0, 241.0, 0.09658741415158123, 0.02603332647054338, 0.056877158919339345], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 104.94736842105264, 78, 237, 80.0, 234.0, 237.0, 237.0, 0.09658692314731031, 0.026033194129548482, 0.056782546615899224], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1bf198fa-b688-4ab5-9f16-065e3ec392d6", 1, 0, 0.0, 388.0, 388, 388, 388.0, 388.0, 388.0, 388.0, 2.577319587628866, 0.8230307667525772, 1.5378342461340206], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 356.06666666666666, 81, 1358, 280.0, 863.6000000000004, 1358.0, 1358.0, 0.07051556278470658, 0.14882640067412878, 0.04557802782074004], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8d4cd556-e289-4503-a80c-3f3a1eab7758", 1, 0, 0.0, 514.0, 514, 514, 514.0, 514.0, 514.0, 514.0, 1.9455252918287937, 0.3514865029182879, 1.3413484922178989], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 117.26315789473684, 77, 267, 83.0, 237.0, 267.0, 267.0, 0.10411358243877848, 0.07737347288663127, 0.05226013806008998], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 122.10526315789473, 77, 242, 81.0, 237.0, 242.0, 242.0, 0.1041118709451166, 0.05254824078335963, 0.05799570607027003], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 561.4285714285714, 465, 646, 623.0, 646.0, 646.0, 646.0, 0.087213286321219, 25.643601932085765, 0.0497388273550702], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 757.4285714285714, 695, 942, 722.0, 942.0, 942.0, 942.0, 0.08688097306689835, 78.17565228605561, 0.04946446025195483], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 169.57142857142858, 79, 240, 232.0, 240.0, 240.0, 240.0, 0.08747157173918477, 0.1547836796791043, 0.048433965992302506], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 83.58333333333331, 79, 93, 82.5, 92.4, 93.0, 93.0, 0.09849548151978528, 0.07319830218413731, 0.04944011474723597], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 118.58333333333334, 78, 236, 81.0, 235.4, 236.0, 236.0, 0.0984970984396418, 0.026355668918419776, 0.05617412645385821], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 107.08333333333333, 78, 247, 80.5, 243.4, 247.0, 247.0, 0.09849548151978528, 0.026547610253379626, 0.05790457019034252], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 105.83333333333333, 78, 238, 80.0, 237.1, 238.0, 238.0, 0.0984970984396418, 0.026548046063809703, 0.058001709335062504], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 104.28571428571429, 79, 239, 82.0, 239.0, 239.0, 239.0, 0.08763693270735523, 0.06512861893583724, 0.049210191705790295], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 609.6249999999999, 78, 1083, 807.5, 1062.0, 1083.0, 1083.0, 0.07899518129394106, 44.4329862431126, 0.042197621257603284], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 229.3684210526316, 78, 956, 81.0, 871.0, 956.0, 956.0, 0.10411244143675169, 14.815297807816652, 0.0597940183292693], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 409.0625, 79, 721, 544.0, 673.4000000000001, 721.0, 721.0, 0.07899596133147693, 14.525131670221485, 0.0422751824312982], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 182.15789473684214, 78, 619, 81.0, 458.0, 619.0, 619.0, 0.10411301193463894, 4.8572123432825185, 0.059896018841715346], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 999.7857142857143, 115, 3362, 731.0, 2600.5, 3362.0, 3362.0, 0.07292122424318186, 0.01376937458330729, 0.04990444552524116], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 217.75, 159, 330, 165.5, 329.1, 330.0, 330.0, 0.09842842612946619, 0.1525448361986942, 0.22136783728140688], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fb8d389d-977b-4969-b0ed-022797145c4d", 3, 0, 0.0, 332.6666666666667, 274, 427, 297.0, 427.0, 427.0, 427.0, 0.017628497053102907, 0.024302306321579044, 0.01130473281074633], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0bfdd1fa-220d-4e85-865d-13cd83c27c4a", 3, 0, 0.0, 1231.6666666666665, 205, 2991, 499.0, 2991.0, 2991.0, 2991.0, 0.025983474510211508, 0.026059597970690643, 0.016662579682655165], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 715.7272727272727, 117, 3059, 563.0, 1479.3, 2827.8499999999967, 3059.0, 0.09396168071820893, 0.05771669645679044, 0.04248462712161204], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 84.375, 78, 132, 81.5, 99.10000000000004, 132.0, 132.0, 0.07899479128094991, 0.05870609000469032, 0.039651682342195564], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 121.6875, 79, 244, 83.5, 241.9, 244.0, 244.0, 0.07899635135602173, 0.09529320606691978, 0.04090606963528372], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1af8fa9e-9ac5-4e38-a544-248a6a385060", 1, 0, 0.0, 479.0, 479, 479, 479.0, 479.0, 479.0, 479.0, 2.08768267223382, 0.37716923277661796, 1.4393593423799582], "isController": false}, {"data": ["login", 22, 0, 0.0, 3745.1818181818185, 1710, 7709, 3573.0, 7277.299999999999, 7676.15, 7709.0, 0.09311381047107124, 35.57000052244254, 0.18961688428492826], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 89.78947368421053, 79, 183, 84.0, 97.0, 183.0, 183.0, 0.10029560810810811, 0.08119634679845862, 0.03565195444467906], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6cfe6417-04c9-40a6-aea5-ab0e9e31c9e2", 3, 0, 0.0, 671.6666666666666, 358, 1006, 651.0, 1006.0, 1006.0, 1006.0, 0.06169792694965449, 0.02791670522787101, 0.03956540237331359], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=299b47ab-bd97-4bfe-99db-4c7602998617", 1, 0, 0.0, 1203.0, 1203, 1203, 1203.0, 1203.0, 1203.0, 1203.0, 0.8312551953449709, 0.15017794056525352, 0.5731114921030757], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=03ac0b59-8973-48d8-9515-18cdb0562522", 1, 0, 0.0, 478.0, 478, 478, 478.0, 478.0, 478.0, 478.0, 2.092050209205021, 0.377958289748954, 1.4423705543933054], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d3298d02-ba24-435d-a862-6e3e212bbc53", 1, 0, 0.0, 485.0, 485, 485, 485.0, 485.0, 485.0, 485.0, 2.061855670103093, 0.3725032216494846, 1.4215528350515465], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 695.8125, 159, 1166, 890.0, 1145.0, 1166.0, 1166.0, 0.07896243362220423, 59.08746762848669, 0.16496131457646526], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ccee9cef-d3eb-4fdd-a0d4-7f5ba1365524", 3, 0, 0.0, 1284.6666666666665, 250, 3312, 292.0, 3312.0, 3312.0, 3312.0, 0.031195083654816, 0.02600605769530722, 0.02000465976562094], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 246.3684210526316, 158, 478, 177.0, 469.0, 478.0, 478.0, 0.09654520602238832, 0.14962621284915065, 0.2171324311226175], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 3, 30.0, 628.6, 80, 1182, 781.5, 1150.2, 1182.0, 1182.0, 0.12075398790045042, 101.1343186229819, 0.214397290431454], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/57c4a995-caf3-4024-ba41-318cbf01ed05", 3, 0, 0.0, 536.6666666666666, 358, 629, 623.0, 629.0, 629.0, 629.0, 0.017627357659086903, 0.02430073557494565, 0.011304002144661849], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=11d26181-cd24-4f97-8a40-9ff170134658", 1, 0, 0.0, 241.0, 241, 241, 241.0, 241.0, 241.0, 241.0, 4.149377593360996, 0.7496434128630706, 2.8608013485477177], "isController": false}, {"data": ["register", 23, 8, 34.78260869565217, 1996.391304347826, 192, 5716, 1624.0, 4174.4000000000015, 5467.199999999996, 5716.0, 0.09267168436830145, 0.02891268413460764, 0.041810857595854754], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 384.6842105263158, 162, 1034, 311.0, 1012.0, 1034.0, 1034.0, 0.10406511189738085, 19.79340251152932, 0.22984076497442188], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 94.23076923076923, 82, 143, 86.0, 135.79999999999998, 143.0, 143.0, 0.12434004131915219, 0.09653352817258397, 0.04419899906266738], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 296.11764705882354, 163, 486, 319.0, 484.4, 486.0, 486.0, 0.07939844005417776, 0.12305207457615244, 0.17856895258278455], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 13, 0, 0.0, 85.3076923076923, 78, 108, 83.0, 103.6, 108.0, 108.0, 0.060855440242298275, 0.04522557619569237, 0.030546578402872376], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 13, 0, 0.0, 96.76923076923076, 77, 236, 81.0, 187.99999999999994, 236.0, 236.0, 0.060850597740102416, 0.016282288848425842, 0.03470385652365216], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 13, 0, 0.0, 85.30769230769229, 77, 120, 82.0, 112.0, 120.0, 120.0, 0.060849458439819884, 0.016400830595107704, 0.03577282615309724], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 13, 0, 0.0, 97.53846153846155, 79, 240, 80.0, 192.39999999999998, 240.0, 240.0, 0.06084917362141516, 0.016400753827647056, 0.03583208173214194], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 115.0, 115, 115, 115.0, 115.0, 115.0, 115.0, 8.695652173913043, 2.5645380434782608, 5.375339673913043], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 897.0185185185185, 619, 1414, 815.0, 1267.5, 1342.75, 1414.0, 0.24225458264918845, 289.8207021681785, 0.47835817003579983], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, 34.78260869565217, 1996.391304347826, 192, 5716, 1624.0, 4174.4000000000015, 5467.199999999996, 5716.0, 0.09225129252082673, 0.028781525876487555, 0.041621188617794874], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/99ef8fd8-743b-46cb-aca5-99690b965033", 1, 0, 0.0, 286.0, 286, 286, 286.0, 286.0, 286.0, 286.0, 3.4965034965034967, 1.116559222027972, 2.0862926136363638], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 4, 0, 0.0, 79.5, 78, 81, 79.5, 81.0, 81.0, 81.0, 0.1115324559446799, 0.030061482266339506, 0.06567780364711132], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 4, 0, 0.0, 81.25, 77, 90, 79.0, 90.0, 90.0, 90.0, 0.11152934615920815, 0.030060644081974067, 0.06556705701937822], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/299b47ab-bd97-4bfe-99db-4c7602998617", 3, 0, 0.0, 487.3333333333333, 173, 1078, 211.0, 1078.0, 1078.0, 1078.0, 0.023128517462030682, 0.027337124643435354, 0.014831764127669416], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 190.23076923076923, 78, 862, 81.0, 616.7999999999997, 862.0, 862.0, 0.1265440811439585, 8.790298282042421, 0.07355754957121025], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 179.84615384615387, 78, 466, 105.0, 408.4, 466.0, 466.0, 0.12654654479260968, 2.89370653004507, 0.07368256225116569], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 83.3076923076923, 79, 107, 81.0, 99.0, 107.0, 107.0, 0.1265403858508381, 0.09404026721922636, 0.06351734211653397], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 4, 0, 0.0, 82.0, 78, 89, 80.5, 89.0, 89.0, 89.0, 0.11152623654714772, 0.02984198126359226, 0.06360480678079518], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 140.69230769230768, 78, 238, 81.0, 237.2, 238.0, 238.0, 0.12654161759123164, 0.04847973630673688, 0.07135076484673863], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 4, 0, 0.0, 81.75, 80, 84, 81.5, 84.0, 84.0, 84.0, 0.11152623654714772, 0.08288229102771427, 0.05598094295433001], "isController": false}, {"data": ["deleteAccount", 14, 1, 7.142857142857143, 1218.2142857142858, 80, 3425, 770.5, 3368.5, 3425.0, 3425.0, 0.07322788517867604, 0.013684256723889029, 0.049838481842099755], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 4, 0, 0.0, 165.5, 90, 309, 131.5, 309.0, 309.0, 309.0, 0.08557797222994801, 0.06735922423568173, 0.030420294816114333], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 2396.8636363636365, 1137, 6992, 2092.5, 3550.9, 6480.649999999992, 6992.0, 0.09312208728925836, 0.04819795533526068, 0.04283252257152411], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 4, 0, 0.0, 165.5, 162, 174, 163.0, 174.0, 174.0, 174.0, 0.11127493253957216, 0.17245441205107517, 0.25025993128772916], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2e548b43-42b5-4714-b5e6-92374daff872", 3, 0, 0.0, 1021.3333333333334, 280, 2070, 714.0, 2070.0, 2070.0, 2070.0, 0.033028007750572484, 0.027211551958560863, 0.021180070074423112], "isController": false}, {"data": ["addBook", 59, 7, 11.864406779661017, 1142.6440677966102, 416, 5840, 898.0, 1961.0, 2431.0, 5840.0, 0.2674887790724033, 76.97078166795121, 0.9742159518520198], "isController": true}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 145.87037037037035, 79, 371, 82.0, 323.0, 331.5, 371.0, 0.24321037697608433, 0.18074521179570327, 0.11756751621402513], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 517.4814814814812, 388, 806, 472.0, 700.5, 713.25, 806.0, 0.24313372354795137, 71.48938752251239, 0.12227916760468258], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8d4cd556-e289-4503-a80c-3f3a1eab7758", 3, 0, 0.0, 518.3333333333334, 465, 556, 534.0, 556.0, 556.0, 556.0, 0.019399394738884145, 0.026743631744522902, 0.012440367068880784], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 129.037037037037, 77, 321, 89.0, 242.5, 267.75, 321.0, 0.24355371938101275, 0.43097591749843267, 0.11844702368334407], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 747.6666666666667, 539, 1180, 711.5, 961.5, 1007.0, 1180.0, 0.24268026874592724, 218.36413240399526, 0.12181411927285801], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 90.6470588235294, 80, 123, 86.0, 122.2, 123.0, 123.0, 0.07859817837163068, 0.058718365678024874, 0.027939196218040595], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 7, 4.069767441860465, 245.13953488372076, 79, 3853, 91.0, 555.300000000001, 986.0999999999992, 2087.8600000000247, 0.7023848415550473, 1.483985778748775, 0.3391289547431395], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 13, 0, 0.0, 115.15384615384616, 82, 241, 91.0, 240.6, 241.0, 241.0, 0.06310894059506876, 0.048872451066298374, 0.02243325622715335], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 95.63157894736841, 81, 242, 85.0, 128.0, 242.0, 242.0, 0.09983815709271286, 0.08102100443754336, 0.03548934490405028], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1af8fa9e-9ac5-4e38-a544-248a6a385060", 3, 0, 0.0, 588.6666666666666, 207, 854, 705.0, 854.0, 854.0, 854.0, 0.02162489457863893, 0.025940018399181135, 0.013867526796848531], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 13, 0, 0.0, 184.99999999999997, 160, 319, 169.0, 283.0, 319.0, 319.0, 0.060820989791430795, 0.09426065507714909, 0.1367878315328761], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/03ac0b59-8973-48d8-9515-18cdb0562522", 3, 0, 0.0, 427.3333333333333, 345, 485, 452.0, 485.0, 485.0, 485.0, 0.025868536099542126, 0.025944322826396252, 0.016588872433625647], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fb8d389d-977b-4969-b0ed-022797145c4d", 1, 0, 0.0, 601.0, 601, 601, 601.0, 601.0, 601.0, 601.0, 1.663893510815308, 0.3006057612312812, 1.1471765806988352], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0bfdd1fa-220d-4e85-865d-13cd83c27c4a", 1, 0, 0.0, 861.0, 861, 861, 861.0, 861.0, 861.0, 861.0, 1.1614401858304297, 0.20983050232288036, 0.8007585656213705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 330.4615384615384, 161, 941, 321.0, 726.9999999999998, 941.0, 941.0, 0.1264394646747588, 11.81669499396981, 0.28187680237025364], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6cfe6417-04c9-40a6-aea5-ab0e9e31c9e2", 1, 0, 0.0, 1630.0, 1630, 1630, 1630.0, 1630.0, 1630.0, 1630.0, 0.6134969325153374, 0.11083684815950921, 0.4229773773006135], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 88.33333333333336, 82, 107, 88.0, 103.4, 107.0, 107.0, 0.09479496638728484, 0.07859465474883284, 0.03369664820798016], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=57c4a995-caf3-4024-ba41-318cbf01ed05", 1, 0, 0.0, 1120.0, 1120, 1120, 1120.0, 1120.0, 1120.0, 1120.0, 0.8928571428571428, 0.16130719866071427, 0.6155831473214285], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ccee9cef-d3eb-4fdd-a0d4-7f5ba1365524", 1, 0, 0.0, 3362.0, 3362, 3362, 3362.0, 3362.0, 3362.0, 3362.0, 0.29744199881023203, 0.053737079863176676, 0.20507231558596073], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 106.1875, 80, 248, 85.0, 248.0, 248.0, 248.0, 0.07512160309501005, 0.058321947715364246, 0.026703382350179352], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d3298d02-ba24-435d-a862-6e3e212bbc53", 3, 0, 0.0, 428.33333333333337, 172, 827, 286.0, 827.0, 827.0, 827.0, 0.09530162965786715, 0.043121505606912545, 0.06111465183137965], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/11d26181-cd24-4f97-8a40-9ff170134658", 3, 0, 0.0, 511.0, 217, 671, 645.0, 671.0, 671.0, 671.0, 0.06815703380588876, 0.030839282874409308, 0.04370747285078153], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 110.52941176470588, 77, 244, 81.0, 242.4, 244.0, 244.0, 0.07948642418631617, 0.05907145391190099, 0.039898459015396986], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 155.7058823529412, 77, 243, 94.0, 242.2, 243.0, 243.0, 0.07948716749816478, 0.021269027240719874, 0.0453325252137971], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=197c842e-9f51-44cd-bacf-976413e26d47", 1, 0, 0.0, 1839.0, 1839, 1839, 1839.0, 1839.0, 1839.0, 1839.0, 0.543773790103317, 0.09824038200108755, 0.374906538879826], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 136.64705882352942, 77, 242, 81.0, 241.2, 242.0, 242.0, 0.0794288597753565, 0.021408559861326556, 0.04669548201637169], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 127.52941176470588, 77, 240, 81.0, 238.4, 240.0, 240.0, 0.07948642418631617, 0.021424075268968033, 0.046806947055027984], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 40.0, 0.6182380216383307], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 10.0, 0.1545595054095827], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.0, 0.07727975270479134], "isController": false}, {"data": ["401/Unauthorized", 9, 45.0, 0.6955177743431221], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1294, 20, "401/Unauthorized", 9, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 3, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
