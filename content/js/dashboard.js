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

    var data = {"OkPercent": 99.02182091798345, "KoPercent": 0.9781790820165538};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.829118028534371, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.38392857142857145, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/19e1705d-61fb-47da-97bd-0a0553bead16"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7692307692307693, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/40bdcf09-97c5-4df7-9723-636a8a3481c8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5c4c00da-3750-412c-b792-6b6b3d6ab0ac"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a01964af-8873-494c-8cd3-651e49563ae2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a391d165-7454-4db9-8e8e-30cd58925792"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=903198e9-f642-4b82-b2f5-4c7aa63b0bbf"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/517b2cc6-c514-46c5-9218-0b2a4e001e38"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/13696e31-65d1-41c7-9120-fbcdb0b4b4f4"], "isController": false}, {"data": [0.025, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/91ae4377-a18f-47a3-a165-416cbcecad34"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=af3ae47a-cb1e-44e4-b2b1-8a33ac311fbe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/12bada5e-dcbd-4fbf-8fca-9354d8a54ecc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f22bee58-18e3-4cf7-aceb-4eafcfc7acee"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/64bed3c6-cd7f-41e3-bfe6-b22c65fa694c"], "isController": false}, {"data": [0.36363636363636365, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5170e742-3343-449d-b292-59f7fc8041b3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=19e1705d-61fb-47da-97bd-0a0553bead16"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.36363636363636365, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5c4c00da-3750-412c-b792-6b6b3d6ab0ac"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.75, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.325, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=95819993-37a9-408c-ba38-3bb4ebabf7d4"], "isController": false}, {"data": [0.40625, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a01964af-8873-494c-8cd3-651e49563ae2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.7678571428571429, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9510869565217391, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f22bee58-18e3-4cf7-aceb-4eafcfc7acee"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/95819993-37a9-408c-ba38-3bb4ebabf7d4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/72d80ffe-f2bb-4758-9f3e-6d987a4738d1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=40bdcf09-97c5-4df7-9723-636a8a3481c8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ca05e14f-bb19-41fb-b2dd-7aafcdb51c9c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/af3ae47a-cb1e-44e4-b2b1-8a33ac311fbe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/903198e9-f642-4b82-b2f5-4c7aa63b0bbf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=12bada5e-dcbd-4fbf-8fca-9354d8a54ecc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=13696e31-65d1-41c7-9120-fbcdb0b4b4f4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5170e742-3343-449d-b292-59f7fc8041b3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=517b2cc6-c514-46c5-9218-0b2a4e001e38"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1329, 13, 0.9781790820165538, 297.88863807373906, 80, 2047, 96.0, 824.0, 992.5, 1473.4000000000024, 5.1550790523033, 708.6963011083518, 3.7637983337147602], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1364.1964285714284, 1007, 1725, 1384.5, 1618.5000000000002, 1670.1, 1725.0, 0.2458102520432977, 295.7917999853501, 1.2086470889043008], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/19e1705d-61fb-47da-97bd-0a0553bead16", 3, 0, 0.0, 263.6666666666667, 171, 418, 202.0, 418.0, 418.0, 418.0, 0.07566585956416465, 0.03423683098769168, 0.04852270291061339], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 466.38461538461536, 90, 908, 420.0, 795.1999999999999, 908.0, 908.0, 0.06650670950380878, 0.012599903948963775, 0.04495897527229382], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 466.38461538461536, 90, 908, 420.0, 795.1999999999999, 908.0, 908.0, 0.06672038513059232, 0.01264038546419425, 0.045103421408518654], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/40bdcf09-97c5-4df7-9723-636a8a3481c8", 3, 0, 0.0, 633.3333333333334, 319, 1146, 435.0, 1146.0, 1146.0, 1146.0, 0.03131949011870087, 0.0261097702454404, 0.020084438650338772], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 104.86666666666666, 82, 246, 83.0, 246.0, 246.0, 246.0, 0.08860639856339492, 0.032581311138415, 0.05003723314706299], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 117.20000000000002, 83, 346, 85.0, 325.6, 346.0, 346.0, 0.0886037816093991, 0.0658471462937038, 0.0444749450656554], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 163.8, 80, 647, 84.0, 407.0000000000001, 647.0, 647.0, 0.08852168781351431, 1.7574897646798466, 0.05162036183239894], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 186.46666666666673, 82, 979, 84.0, 539.8000000000002, 979.0, 979.0, 0.08852012062341771, 5.332305685426047, 0.05153300251397142], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 239.61538461538467, 84, 385, 202.0, 373.4, 385.0, 385.0, 0.06666119702998728, 0.14787949290058253, 0.04309041469674283], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5c4c00da-3750-412c-b792-6b6b3d6ab0ac", 1, 0, 0.0, 771.0, 771, 771, 771.0, 771.0, 771.0, 771.0, 1.297016861219196, 0.23432433527885863, 0.8942323281452659], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 85.5625, 81, 99, 84.0, 95.5, 99.0, 99.0, 0.11424328106703224, 0.08490150087110503, 0.05734477194185017], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 105.3125, 82, 251, 84.0, 248.2, 251.0, 251.0, 0.114244096793311, 0.041293551099242425, 0.06455516651077108], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 685.0, 641, 741, 673.0, 741.0, 741.0, 741.0, 0.02080011093392498, 6.115923243257297, 0.011862563267004092], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 821.0, 749, 917, 797.0, 917.0, 917.0, 917.0, 0.02079895727894175, 18.714938320258877, 0.01184159384142875], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 193.33333333333334, 83, 250, 247.0, 250.0, 250.0, 250.0, 0.020871162315029324, 0.03693217394026673, 0.011556590852169557], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 97.0625, 82, 248, 84.0, 159.8000000000001, 248.0, 248.0, 0.09771827820393805, 0.0726207126105438, 0.049049995114086094], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 119.37500000000001, 82, 331, 84.0, 272.90000000000003, 331.0, 331.0, 0.09771887501145143, 0.03532050645860689, 0.05521736723974715], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 163.375, 81, 806, 83.0, 474.9000000000003, 806.0, 806.0, 0.09771947182625478, 5.520201830789573, 0.05692350092222751], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a01964af-8873-494c-8cd3-651e49563ae2", 1, 0, 0.0, 957.0, 957, 957, 957.0, 957.0, 957.0, 957.0, 1.0449320794148382, 0.18878167450365727, 0.7204316875653083], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 149.125, 81, 647, 83.5, 369.8000000000003, 647.0, 647.0, 0.0977206654777319, 1.820512617417487, 0.05701962658490704], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 139.0, 85, 244, 88.0, 244.0, 244.0, 244.0, 0.020871888349311925, 0.015511237337721067, 0.01172005449302183], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a391d165-7454-4db9-8e8e-30cd58925792", 1, 0, 0.0, 164.0, 164, 164, 164.0, 164.0, 164.0, 164.0, 6.097560975609756, 1.947170350609756, 3.6382907774390243], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 512.4499999999999, 82, 1086, 491.0, 1046.9, 1084.35, 1086.0, 0.08914483361116807, 40.11835265083305, 0.04857696987796072], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 154.8125, 82, 721, 85.5, 388.50000000000034, 721.0, 721.0, 0.11424328106703224, 6.453636696102162, 0.06654894253562962], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 379.0, 81, 746, 365.0, 734.6000000000001, 745.7, 746.0, 0.08921044297445459, 13.127438651093497, 0.04869984142843761], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 120.5, 81, 488, 84.5, 317.20000000000016, 488.0, 488.0, 0.11424491253123885, 2.128355386469118, 0.06666146019278829], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 414.9230769230769, 87, 957, 395.0, 882.5999999999999, 957.0, 957.0, 0.0667220973321426, 0.012640709846128579, 0.04563586960705817], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 282.625, 166, 890, 172.0, 614.2000000000003, 890.0, 890.0, 0.09766757619597, 7.444678805296634, 0.2180948451358495], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=903198e9-f642-4b82-b2f5-4c7aa63b0bbf", 1, 0, 0.0, 190.0, 190, 190, 190.0, 190.0, 190.0, 190.0, 5.263157894736842, 0.9508634868421052, 3.6287006578947367], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 455.29999999999995, 105, 1404, 435.5, 848.3000000000003, 1376.9499999999996, 1404.0, 0.08544196995005916, 0.05248339755721408, 0.038632453209841204], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 92.6, 82, 246, 84.0, 89.60000000000001, 238.19999999999987, 246.0, 0.08920845339304354, 0.06629651663291614, 0.04477846195705505], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 133.4, 81, 254, 84.5, 252.9, 253.95, 254.0, 0.08914523095300708, 0.09079929285545546, 0.047097236274977375], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/517b2cc6-c514-46c5-9218-0b2a4e001e38", 3, 0, 0.0, 824.3333333333334, 385, 1282, 806.0, 1282.0, 1282.0, 1282.0, 0.019424390559746187, 0.026778090501473017, 0.012456396289941404], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/13696e31-65d1-41c7-9120-fbcdb0b4b4f4", 3, 0, 0.0, 262.0, 182, 402, 202.0, 402.0, 402.0, 402.0, 0.028506813128337673, 0.0285903291824246, 0.01828073628347175], "isController": false}, {"data": ["login", 20, 0, 0.0, 2263.5000000000005, 1433, 3342, 2311.5, 3017.4000000000005, 3327.6499999999996, 3342.0, 0.08824879099156341, 15.96027215237698, 0.15509897377687176], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 98.1875, 84, 251, 88.0, 141.80000000000013, 251.0, 251.0, 0.11212883603260146, 0.09077617682717441, 0.039858297183463794], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/91ae4377-a18f-47a3-a165-416cbcecad34", 1, 0, 0.0, 192.0, 192, 192, 192.0, 192.0, 192.0, 192.0, 5.208333333333333, 1.6632080078125, 3.1077067057291665], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 614.7500000000001, 168, 1170, 657.5, 1133.6000000000001, 1168.5, 1170.0, 0.08911027842506494, 53.37248813440949, 0.1890112546281651], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=af3ae47a-cb1e-44e4-b2b1-8a33ac311fbe", 1, 0, 0.0, 396.0, 396, 396, 396.0, 396.0, 396.0, 396.0, 2.5252525252525255, 0.456222380050505, 1.7410432449494948], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/12bada5e-dcbd-4fbf-8fca-9354d8a54ecc", 2, 0, 0.0, 212.0, 188, 236, 212.0, 236.0, 236.0, 236.0, 0.013126718779740221, 0.025798360883034374, 0.00815933252275845], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f22bee58-18e3-4cf7-aceb-4eafcfc7acee", 3, 0, 0.0, 270.6666666666667, 202, 404, 206.0, 404.0, 404.0, 404.0, 0.02006447384261427, 0.027660496980296687, 0.01286686636391605], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 337.1333333333333, 167, 1063, 328.0, 781.0000000000002, 1063.0, 1063.0, 0.08847469623687625, 7.184410297717353, 0.1974725267635956], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 2, 40.0, 609.6, 83, 1042, 834.0, 1042.0, 1042.0, 1042.0, 0.034606147436030535, 24.84429396538001, 0.05599166510939003], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/64bed3c6-cd7f-41e3-bfe6-b22c65fa694c", 1, 0, 0.0, 183.0, 183, 183, 183.0, 183.0, 183.0, 183.0, 5.46448087431694, 1.7450051229508197, 3.2605447404371586], "isController": false}, {"data": ["register", 22, 3, 13.636363636363637, 1020.1818181818181, 88, 1905, 998.0, 1557.3999999999999, 1855.6499999999992, 1905.0, 0.09324799728733099, 0.02978571504259738, 0.04207087377612003], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5170e742-3343-449d-b292-59f7fc8041b3", 1, 0, 0.0, 391.0, 391, 391, 391.0, 391.0, 391.0, 391.0, 2.557544757033248, 0.46205642583120204, 1.7633072250639386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 253.0625, 165, 803, 176.5, 473.3000000000003, 803.0, 803.0, 0.11416584015355305, 8.702253537803164, 0.2549360002354671], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 12, 0, 0.0, 88.16666666666667, 84, 100, 86.5, 98.80000000000001, 100.0, 100.0, 0.06463288521199587, 0.05017885131204757, 0.022974970915201655], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=19e1705d-61fb-47da-97bd-0a0553bead16", 1, 0, 0.0, 196.0, 196, 196, 196.0, 196.0, 196.0, 196.0, 5.1020408163265305, 0.9217554209183673, 3.5176179846938775], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 20, 0, 0.0, 273.34999999999997, 165, 902, 171.5, 483.5000000000003, 881.6999999999997, 902.0, 0.10612331529236972, 6.504265867093813, 0.23731619110156], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 14, 0, 0.0, 83.85714285714286, 82, 85, 84.0, 85.0, 85.0, 85.0, 0.07999725723689474, 0.05945108667702822, 0.04015487326148818], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 14, 0, 0.0, 95.00000000000001, 81, 246, 83.5, 166.0, 246.0, 246.0, 0.07999817147036639, 0.021405760725469132, 0.04562395716669333], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 14, 0, 0.0, 105.78571428571429, 82, 245, 82.5, 244.5, 245.0, 245.0, 0.07999725723689474, 0.021561760739631786, 0.04702963755528382], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 14, 0, 0.0, 118.42857142857146, 81, 252, 83.0, 251.0, 252.0, 252.0, 0.07999771435101853, 0.021561883946172967, 0.04710802905631268], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 87.0, 87, 87, 87.0, 87.0, 87.0, 87.0, 11.494252873563218, 3.3899066091954024, 7.105334051724139], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 937.1964285714284, 652, 1376, 895.5, 1258.9000000000003, 1326.3999999999999, 1376.0, 0.24336398560675856, 291.14793379630436, 0.4805488075164705], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 3, 13.636363636363637, 1020.1818181818181, 88, 1905, 998.0, 1557.3999999999999, 1855.6499999999992, 1905.0, 0.08911211924821776, 0.028464613374918988, 0.040204881926442], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 130.14285714285717, 81, 249, 85.0, 249.0, 249.0, 249.0, 0.033729413011843845, 0.009091130850848537, 0.01986214457631039], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 153.42857142857142, 81, 251, 83.0, 251.0, 251.0, 251.0, 0.03372957553738441, 0.009091174656560643, 0.019829301243657636], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 12, 0, 0.0, 321.16666666666663, 83, 982, 88.0, 956.2, 982.0, 982.0, 0.06580318268060231, 14.815756871977166, 0.037271333940184906], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 12, 0, 0.0, 239.49999999999997, 82, 651, 166.0, 603.0000000000002, 651.0, 651.0, 0.06592283731891821, 4.859201952552038, 0.03740348484598777], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 129.28571428571428, 81, 249, 84.0, 249.0, 249.0, 249.0, 0.03370375363519057, 0.009018387203166226, 0.019221671995069623], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 12, 0, 0.0, 84.58333333333333, 81, 93, 84.0, 91.2, 93.0, 93.0, 0.06612845452291075, 0.049144290910092855, 0.03319338439919544], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 130.85714285714286, 83, 249, 85.0, 249.0, 249.0, 249.0, 0.03372908796546142, 0.025066246036832163, 0.016930421107663247], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 12, 0, 0.0, 118.25, 81, 340, 83.0, 312.4000000000001, 340.0, 340.0, 0.06612881893929375, 0.04252522194484856, 0.03632564516928977], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5c4c00da-3750-412c-b792-6b6b3d6ab0ac", 3, 0, 0.0, 310.0, 167, 529, 234.0, 529.0, 529.0, 529.0, 0.02160293799956794, 0.02553394136602578, 0.013853446568733347], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 116.14285714285714, 85, 244, 93.0, 244.0, 244.0, 244.0, 0.03408117161330529, 0.026825609687816467, 0.012114791471917115], "isController": false}, {"data": ["deleteAccount", 12, 1, 8.333333333333334, 490.9166666666667, 83, 855, 411.0, 840.3000000000001, 855.0, 855.0, 0.07216786244805418, 0.013560839387415128, 0.04911619740015276], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1293.15, 723, 1906, 1284.0, 1876.7000000000003, 1905.3, 1906.0, 0.0873358631621696, 0.04520313230073231, 0.04017108549744324], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 308.85714285714283, 166, 499, 328.0, 499.0, 499.0, 499.0, 0.033689641397831344, 0.05221236415855308, 0.07576879310469296], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=95819993-37a9-408c-ba38-3bb4ebabf7d4", 1, 0, 0.0, 395.0, 395, 395, 395.0, 395.0, 395.0, 395.0, 2.5316455696202533, 0.4573773734177215, 1.7454509493670884], "isController": false}, {"data": ["addBook", 64, 6, 9.375, 945.9218749999999, 425, 2391, 761.5, 1554.5, 2055.25, 2391.0, 0.3016406423060427, 96.97670245801775, 1.0970696303841676], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a01964af-8873-494c-8cd3-651e49563ae2", 3, 0, 0.0, 448.33333333333337, 239, 786, 320.0, 786.0, 786.0, 786.0, 0.023959556269017898, 0.024029750281524785, 0.015364689404285566], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 147.3928571428571, 82, 378, 85.0, 330.90000000000003, 341.0, 378.0, 0.2441331746467698, 0.18143100186151545, 0.11801359516616314], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 546.2321428571429, 403, 838, 492.0, 668.3, 758.2999999999998, 838.0, 0.24385252147861716, 71.70073798046568, 0.12264067242332798], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 120.33928571428572, 81, 339, 84.5, 252.60000000000002, 268.74999999999994, 339.0, 0.24427267810095443, 0.43224813742082946, 0.11879667352956572], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 786.7678571428569, 566, 1078, 806.5, 978.7, 1006.9, 1078.0, 0.24376335801437332, 219.3386980316109, 0.12235777931580849], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 20, 0, 0.0, 104.49999999999999, 83, 250, 86.0, 232.90000000000032, 249.85, 250.0, 0.11023899814798484, 0.08235628279610195, 0.03918651887291648], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 184, 6, 3.260869565217391, 168.45108695652166, 83, 2047, 90.0, 280.0, 392.25, 1572.7000000000032, 0.7690860833037263, 1.567418630744634, 0.3734771429392464], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 14, 0, 0.0, 87.5, 84, 101, 86.5, 96.0, 101.0, 101.0, 0.08172176075370813, 0.06328648073993218, 0.029049532142919686], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 90.86666666666666, 84, 136, 87.0, 110.80000000000001, 136.0, 136.0, 0.09024130525023914, 0.07323293424116087, 0.03207796397567094], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f22bee58-18e3-4cf7-aceb-4eafcfc7acee", 1, 0, 0.0, 438.0, 438, 438, 438.0, 438.0, 438.0, 438.0, 2.28310502283105, 0.4124750285388128, 1.574093892694064], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/95819993-37a9-408c-ba38-3bb4ebabf7d4", 3, 0, 0.0, 317.0, 199, 396, 356.0, 396.0, 396.0, 396.0, 0.033216705788564595, 0.02736701899441959, 0.021301077605296957], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 14, 0, 0.0, 215.28571428571428, 166, 337, 169.5, 336.0, 337.0, 337.0, 0.07995796495556622, 0.12391922889109724, 0.17982733719987207], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 12, 0, 0.0, 434.0, 166, 1067, 333.5, 1042.1000000000001, 1067.0, 1067.0, 0.06577252571979808, 19.74815267413276, 0.1437168225566877], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/72d80ffe-f2bb-4758-9f3e-6d987a4738d1", 1, 0, 0.0, 382.0, 382, 382, 382.0, 382.0, 382.0, 382.0, 2.617801047120419, 0.8359579515706806, 1.5619887107329842], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=40bdcf09-97c5-4df7-9723-636a8a3481c8", 1, 0, 0.0, 403.0, 403, 403, 403.0, 403.0, 403.0, 403.0, 2.4813895781637716, 0.44829792183622824, 1.710801799007444], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ca05e14f-bb19-41fb-b2dd-7aafcdb51c9c", 1, 0, 0.0, 184.0, 184, 184, 184.0, 184.0, 184.0, 184.0, 5.434782608695652, 1.7355213994565217, 3.2428243885869565], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/af3ae47a-cb1e-44e4-b2b1-8a33ac311fbe", 3, 0, 0.0, 537.6666666666666, 307, 907, 399.0, 907.0, 907.0, 907.0, 0.05435471889551211, 0.03494484694617071, 0.03485637897921838], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 100.43749999999999, 84, 254, 88.0, 153.9000000000001, 254.0, 254.0, 0.09732300898413027, 0.08069065881594394, 0.03459528834982755], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/903198e9-f642-4b82-b2f5-4c7aa63b0bbf", 3, 0, 0.0, 752.3333333333334, 283, 1119, 855.0, 1119.0, 1119.0, 1119.0, 0.07082989021367016, 0.03204868079329477, 0.04542151162790698], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 97.75, 84, 249, 88.0, 106.50000000000001, 241.8999999999999, 249.0, 0.0875227559165383, 0.06794979585317182, 0.031111604642206973], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=12bada5e-dcbd-4fbf-8fca-9354d8a54ecc", 1, 0, 0.0, 426.0, 426, 426, 426.0, 426.0, 426.0, 426.0, 2.347417840375587, 0.42409404342723006, 1.6184345657276995], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=13696e31-65d1-41c7-9120-fbcdb0b4b4f4", 1, 0, 0.0, 354.0, 354, 354, 354.0, 354.0, 354.0, 354.0, 2.824858757062147, 0.510350459039548, 1.947607697740113], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5170e742-3343-449d-b292-59f7fc8041b3", 3, 0, 0.0, 290.6666666666667, 201, 378, 293.0, 378.0, 378.0, 378.0, 0.02620682425703653, 0.02628360206247707, 0.016805808524206368], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=517b2cc6-c514-46c5-9218-0b2a4e001e38", 1, 0, 0.0, 390.0, 390, 390, 390.0, 390.0, 390.0, 390.0, 2.5641025641025643, 0.4632411858974359, 1.7678285256410255], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 20, 0, 0.0, 94.19999999999999, 81, 246, 84.0, 123.00000000000009, 240.0499999999999, 246.0, 0.10617063744850723, 0.07890220224444727, 0.05329268325052024], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 20, 0, 0.0, 116.14999999999999, 81, 252, 84.0, 249.9, 251.9, 252.0, 0.10617232830607358, 0.036382685549415254, 0.060105565155303575], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 20, 0, 0.0, 153.25, 81, 819, 83.0, 255.60000000000002, 790.8499999999996, 819.0, 0.106171201061712, 4.803837300928998, 0.061960849369608495], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 20, 0, 0.0, 144.4, 81, 490, 84.0, 250.8, 478.04999999999984, 490.0, 0.10617176468090077, 1.5880869805546414, 0.06206486165819062], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 3, 23.076923076923077, 0.22573363431151242], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 7.6923076923076925, 0.07524454477050414], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 7.6923076923076925, 0.07524454477050414], "isController": false}, {"data": ["401/Unauthorized", 8, 61.53846153846154, 0.6019563581640331], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1329, 13, "401/Unauthorized", 8, "406/Not Acceptable", 3, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 3, "406/Not Acceptable", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 184, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
