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

    var data = {"OkPercent": 98.2496194824962, "KoPercent": 1.7503805175038052};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7740039190071848, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/903a323f-8af3-4692-a88e-1adce0bfc884"], "isController": false}, {"data": [0.17857142857142858, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/ef45a4ee-8fe1-489a-b29e-3a6b05953d1f"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5bba5e26-f407-4660-a638-5f4fb32df201"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=783b7452-b262-4d77-b7bc-06c539955009"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=728658a9-0a5d-42fd-ae67-06eb28d36165"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=860d2248-b52d-4896-87f3-604e8cfe432b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9a78f6b9-ce03-4f25-bbbb-b57c71a01ff7"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e2a37ebf-e53a-4ffc-ac71-d96c64772b0e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d7fcdae3-8734-4bf0-b57e-03d8707b4ee7"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/8df1e0dc-09e4-4d05-b930-2527f6694f46"], "isController": false}, {"data": [0.6363636363636364, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/783b7452-b262-4d77-b7bc-06c539955009"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/239b9b4a-7e40-4f5c-b5d3-a7d87016689a"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/85f21353-9c4f-46b4-806d-f1dfe4cf21c0"], "isController": false}, {"data": [0.6, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=be882a45-9427-42cb-9061-b640ebce18da"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a28933ee-3486-4179-a0a1-98862018daf1"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a0c5908c-87dc-45f3-bfe7-e9a33f775ac7"], "isController": false}, {"data": [0.1956521739130435, 500, 1500, "register"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/728658a9-0a5d-42fd-ae67-06eb28d36165"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ef45a4ee-8fe1-489a-b29e-3a6b05953d1f"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4017857142857143, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.1956521739130435, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2f146eb3-3a7b-4b0d-b2e6-7d28cc19bd33"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.22727272727272727, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5bba5e26-f407-4660-a638-5f4fb32df201"], "isController": false}, {"data": [0.2542372881355932, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8df1e0dc-09e4-4d05-b930-2527f6694f46"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9a78f6b9-ce03-4f25-bbbb-b57c71a01ff7"], "isController": false}, {"data": [0.9224137931034483, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a0c5908c-87dc-45f3-bfe7-e9a33f775ac7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/be882a45-9427-42cb-9061-b640ebce18da"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/860d2248-b52d-4896-87f3-604e8cfe432b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/a28933ee-3486-4179-a0a1-98862018daf1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d7fcdae3-8734-4bf0-b57e-03d8707b4ee7"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=239b9b4a-7e40-4f5c-b5d3-a7d87016689a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=85f21353-9c4f-46b4-806d-f1dfe4cf21c0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1314, 23, 1.7503805175038052, 373.4071537290711, 97, 3103, 119.0, 1028.0, 1265.5, 1909.6999999999944, 5.150032922584893, 734.824183383942, 3.76193428392398], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/903a323f-8af3-4692-a88e-1adce0bfc884", 1, 0, 0.0, 199.0, 199, 199, 199.0, 199.0, 199.0, 199.0, 5.025125628140704, 1.6047032035175879, 2.998390389447236], "isController": false}, {"data": ["see books", 56, 0, 0.0, 1684.267857142857, 1235, 2180, 1644.0, 2056.0, 2156.1, 2180.0, 0.23999520009599806, 288.79522576959175, 1.180054523909522], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ef45a4ee-8fe1-489a-b29e-3a6b05953d1f", 3, 0, 0.0, 1041.6666666666667, 249, 1511, 1365.0, 1511.0, 1511.0, 1511.0, 0.024613365057226073, 0.024685474525167166, 0.015783961315994584], "isController": false}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 687.4285714285713, 108, 1857, 477.5, 1570.0, 1857.0, 1857.0, 0.093905531035778, 0.017731743339414834, 0.06350544945534792], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 687.4285714285713, 108, 1857, 477.5, 1570.0, 1857.0, 1857.0, 0.09134148012344148, 0.017247585567393704, 0.06177145994676097], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 169.83333333333331, 99, 308, 103.0, 307.1, 308.0, 308.0, 0.09011399420266637, 0.03915108862711329, 0.05055222982072321], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 125.27777777777776, 99, 307, 103.0, 304.3, 307.0, 307.0, 0.09011399420266637, 0.06696948201975499, 0.045233000996260264], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5bba5e26-f407-4660-a638-5f4fb32df201", 3, 0, 0.0, 293.0, 219, 440, 220.0, 440.0, 440.0, 440.0, 0.027584177715662298, 0.027844575226649994, 0.017689072298129792], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 191.38888888888889, 99, 603, 103.0, 593.1, 603.0, 603.0, 0.09011354306426098, 2.9656312265955105, 0.0522044494813465], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 246.33333333333331, 100, 1108, 103.0, 1072.0, 1108.0, 1108.0, 0.09011444534558889, 9.031049511003975, 0.05211696980164809], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 197.93333333333334, 101, 249, 203.0, 237.6, 249.0, 249.0, 0.09036580076148248, 0.16058167524639744, 0.05840831184635405], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=783b7452-b262-4d77-b7bc-06c539955009", 1, 0, 0.0, 480.0, 480, 480, 480.0, 480.0, 480.0, 480.0, 2.0833333333333335, 0.3763834635416667, 1.4363606770833335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 127.875, 98, 308, 103.0, 307.3, 308.0, 308.0, 0.08710991093011607, 0.06473695529083821, 0.043725092009843425], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 141.0, 98, 318, 103.0, 308.90000000000003, 318.0, 318.0, 0.0870151623920468, 0.03145164744175422, 0.049169090174900475], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 720.1666666666667, 488, 823, 795.5, 823.0, 823.0, 823.0, 0.07603117278084015, 22.35568927010074, 0.04336152822657289], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1074.8333333333333, 898, 1311, 1043.5, 1311.0, 1311.0, 1311.0, 0.07574227428802263, 68.15303154507929, 0.043122798740153505], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 169.83333333333334, 101, 307, 107.0, 307.0, 307.0, 307.0, 0.07671751332966793, 0.13575403725913898, 0.04247932622843918], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=728658a9-0a5d-42fd-ae67-06eb28d36165", 1, 0, 0.0, 196.0, 196, 196, 196.0, 196.0, 196.0, 196.0, 5.1020408163265305, 0.9217554209183673, 3.5176179846938775], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=860d2248-b52d-4896-87f3-604e8cfe432b", 1, 0, 0.0, 572.0, 572, 572, 572.0, 572.0, 572.0, 572.0, 1.7482517482517483, 0.3158462631118881, 1.2053376311188813], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 128.6470588235294, 99, 309, 104.0, 304.2, 309.0, 309.0, 0.07665634060666729, 0.05696823750163458, 0.03847788971858104], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 185.23529411764704, 100, 313, 104.0, 308.2, 313.0, 313.0, 0.07658520103615271, 0.02725884108570785, 0.04329914686338552], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 238.29411764705878, 98, 1198, 109.0, 484.39999999999935, 1198.0, 1198.0, 0.07658796127352265, 4.073192221422554, 0.04463818101339388], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 191.58823529411768, 101, 599, 104.0, 364.5999999999998, 599.0, 599.0, 0.07665703192990841, 1.3453115347414177, 0.04475329822516425], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 105.0, 100, 111, 103.5, 111.0, 111.0, 111.0, 0.07671751332966793, 0.057013698870973926, 0.043078681801327214], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9a78f6b9-ce03-4f25-bbbb-b57c71a01ff7", 3, 0, 0.0, 361.6666666666667, 220, 448, 417.0, 448.0, 448.0, 448.0, 0.04935428148391873, 0.03173004750349593, 0.031649718269309866], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 190.0, 99, 1108, 103.5, 544.5000000000006, 1108.0, 1108.0, 0.08711180800557515, 4.920971767947755, 0.05074432956574764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 791.0, 99, 1307, 1063.0, 1249.4, 1307.0, 1307.0, 0.07881338566542141, 47.28469619738549, 0.041818300336795865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 172.81250000000003, 97, 608, 103.5, 397.3000000000002, 608.0, 608.0, 0.0870151623920468, 1.6210716563064238, 0.05077300735278122], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 613.2666666666667, 100, 1011, 803.0, 958.8000000000001, 1011.0, 1011.0, 0.07872941225869436, 15.439780856680978, 0.04185062832631767], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 431.7142857142857, 104, 720, 434.5, 677.5, 720.0, 720.0, 0.09153557464726113, 0.01728423553084095, 0.06264338189622481], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 404.1764705882353, 203, 1300, 405.0, 758.3999999999995, 1300.0, 1300.0, 0.07654795729524547, 5.498595260555738, 0.17100606107851568], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e2a37ebf-e53a-4ffc-ac71-d96c64772b0e", 1, 0, 0.0, 182.0, 182, 182, 182.0, 182.0, 182.0, 182.0, 5.4945054945054945, 1.7545930631868132, 3.2784598214285716], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d7fcdae3-8734-4bf0-b57e-03d8707b4ee7", 3, 0, 0.0, 297.3333333333333, 203, 433, 256.0, 433.0, 433.0, 433.0, 0.027048226988720888, 0.02712746984122691, 0.017345379937428435], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8df1e0dc-09e4-4d05-b930-2527f6694f46", 3, 0, 0.0, 996.0, 195, 2369, 424.0, 2369.0, 2369.0, 2369.0, 0.021701388888888888, 0.025650306984230323, 0.013916580765335647], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 672.5, 189, 1797, 569.5, 1116.6, 1700.2499999999986, 1797.0, 0.10343838598503904, 0.06353783670370074, 0.0467695046006573], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 129.13333333333335, 99, 306, 103.0, 300.6, 306.0, 306.0, 0.07881214337505123, 0.058570352644935535, 0.039560001655055015], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 182.53333333333333, 99, 311, 103.0, 308.6, 311.0, 311.0, 0.07881379977091456, 0.10000527067285968, 0.04053574337175944], "isController": false}, {"data": ["login", 22, 0, 0.0, 2975.863636363636, 1674, 4511, 2765.0, 4120.1, 4453.849999999999, 4511.0, 0.10117361392148928, 33.14859508077793, 0.1984041155816563], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/783b7452-b262-4d77-b7bc-06c539955009", 3, 0, 0.0, 283.0, 190, 449, 210.0, 449.0, 449.0, 449.0, 0.04844491812808837, 0.03114541448664535, 0.031066565336046247], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 107.9375, 100, 129, 106.0, 122.0, 129.0, 129.0, 0.09133306313968821, 0.07394053646757962, 0.03246604978793605], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/239b9b4a-7e40-4f5c-b5d3-a7d87016689a", 3, 0, 0.0, 335.3333333333333, 201, 548, 257.0, 548.0, 548.0, 548.0, 0.019591324961307135, 0.02315628285628457, 0.012563447322192401], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/85f21353-9c4f-46b4-806d-f1dfe4cf21c0", 3, 0, 0.0, 436.0, 192, 780, 336.0, 780.0, 780.0, 780.0, 0.028993350858203187, 0.02417056365490181, 0.018592741273001392], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 955.5333333333333, 205, 1407, 1167.0, 1353.0, 1407.0, 1407.0, 0.07868646068299848, 62.79822475967843, 0.1635459151891098], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=be882a45-9427-42cb-9061-b640ebce18da", 1, 0, 0.0, 212.0, 212, 212, 212.0, 212.0, 212.0, 212.0, 4.716981132075471, 0.8521889740566038, 3.252137382075472], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a28933ee-3486-4179-a0a1-98862018daf1", 1, 0, 0.0, 390.0, 390, 390, 390.0, 390.0, 390.0, 390.0, 2.5641025641025643, 0.4632411858974359, 1.7678285256410255], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 406.05555555555554, 201, 1211, 217.0, 1175.0, 1211.0, 1211.0, 0.09006664932049717, 12.096412282589116, 0.20000151674739305], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 3, 33.333333333333336, 820.5555555555555, 101, 1414, 1053.0, 1414.0, 1414.0, 1414.0, 0.08836437541113981, 70.48422373737125, 0.1521830909858519], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a0c5908c-87dc-45f3-bfe7-e9a33f775ac7", 1, 0, 0.0, 402.0, 402, 402, 402.0, 402.0, 402.0, 402.0, 2.487562189054726, 0.4494130907960199, 1.7150575248756217], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 1178.4782608695652, 235, 2612, 1149.0, 1977.2, 2485.199999999998, 2612.0, 0.09450591894679317, 0.029773858635581067, 0.042638412649822696], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/728658a9-0a5d-42fd-ae67-06eb28d36165", 3, 0, 0.0, 350.33333333333337, 200, 635, 216.0, 635.0, 635.0, 635.0, 0.09113554893978978, 0.041236462573667906, 0.05844304407922717], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 122.31249999999999, 102, 314, 105.5, 185.20000000000013, 314.0, 314.0, 0.0739269047729058, 0.057394423139121194, 0.026278704430993855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 358.12500000000006, 203, 1415, 210.0, 852.9000000000005, 1415.0, 1415.0, 0.08696550187247595, 6.628916717283307, 0.19419676828042026], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ef45a4ee-8fe1-489a-b29e-3a6b05953d1f", 1, 0, 0.0, 504.0, 504, 504, 504.0, 504.0, 504.0, 504.0, 1.984126984126984, 0.35846044146825395, 1.3679625496031746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 304.625, 203, 732, 212.0, 507.30000000000024, 732.0, 732.0, 0.15418863051585732, 0.23896226233268122, 0.34677384382619086], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 13, 0, 0.0, 120.23076923076924, 100, 308, 104.0, 229.19999999999993, 308.0, 308.0, 0.07052683546089288, 0.052413009556386204, 0.035401165455955994], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 13, 0, 0.0, 117.3076923076923, 100, 295, 102.0, 218.99999999999994, 295.0, 295.0, 0.07052721808100865, 0.018871540775582393, 0.04022255406182525], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 13, 0, 0.0, 117.38461538461539, 99, 301, 103.0, 222.19999999999993, 301.0, 301.0, 0.07052874860298824, 0.019009701771899177, 0.04146319009667864], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 13, 0, 0.0, 148.07692307692307, 102, 304, 103.0, 300.8, 304.0, 304.0, 0.070527600705276, 0.019009392377593925, 0.0415313898684389], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 104.0, 104, 104, 104.0, 104.0, 104.0, 104.0, 9.615384615384617, 2.8357872596153846, 5.943885216346154], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1144.160714285714, 785, 1750, 1070.5, 1621.6, 1705.45, 1750.0, 0.2383100413638143, 285.10165944643984, 0.47056924183362553], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 1178.4782608695652, 235, 2612, 1149.0, 1977.2, 2485.199999999998, 2612.0, 0.09591646093280844, 0.030218246438580103, 0.04327480952241943], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 4, 0, 0.0, 161.75, 104, 304, 119.5, 304.0, 304.0, 304.0, 0.027236267814221417, 0.007341025309301866, 0.016038544425757337], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 4, 0, 0.0, 105.0, 103, 107, 105.0, 107.0, 107.0, 107.0, 0.02727285124023291, 0.007350885685844027, 0.01603345356115255], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 239.4375, 100, 1170, 103.0, 1054.5, 1170.0, 1170.0, 0.07400418123623985, 8.341089679770032, 0.042711397568962646], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 235.6875, 101, 810, 103.0, 670.7000000000002, 810.0, 810.0, 0.07400383894914549, 2.7374012800351517, 0.04278346939247473], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2f146eb3-3a7b-4b0d-b2e6-7d28cc19bd33", 1, 0, 0.0, 278.0, 278, 278, 278.0, 278.0, 278.0, 278.0, 3.5971223021582737, 1.1486904226618704, 2.146329811151079], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 130.31250000000003, 101, 310, 103.0, 309.3, 310.0, 310.0, 0.07400315438445564, 0.05499648485016674, 0.03714611460313496], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 4, 0, 0.0, 111.0, 101, 133, 105.0, 133.0, 133.0, 133.0, 0.027273966998499932, 0.00729791695077049, 0.015554684303831993], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 152.25, 98, 312, 102.0, 307.1, 312.0, 312.0, 0.07400452352650055, 0.03369590731858485, 0.041428801866764106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 4, 0, 0.0, 121.75, 103, 174, 105.0, 174.0, 174.0, 174.0, 0.027273037193604473, 0.0202683411175127, 0.013689786247570996], "isController": false}, {"data": ["deleteAccount", 14, 1, 7.142857142857143, 715.142857142857, 101, 2895, 470.5, 2203.0, 2895.0, 2895.0, 0.09544651926997048, 0.017836301975742947, 0.06496035773696303], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 4, 0, 0.0, 165.0, 105, 296, 129.5, 296.0, 296.0, 296.0, 0.027667874830534265, 0.021777643665440057, 0.009835064881166478], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1631.2272727272725, 985, 3103, 1538.5, 2407.5, 3011.4999999999986, 3103.0, 0.10085636220270296, 0.05220104684319586, 0.046389986911594815], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 4, 0, 0.0, 284.0, 210, 407, 259.5, 407.0, 407.0, 407.0, 0.0272166239138866, 0.04218045131966605, 0.06121082507195395], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5bba5e26-f407-4660-a638-5f4fb32df201", 1, 0, 0.0, 443.0, 443, 443, 443.0, 443.0, 443.0, 443.0, 2.257336343115124, 0.40781955417607224, 1.5563275959367946], "isController": false}, {"data": ["addBook", 59, 12, 20.338983050847457, 1061.9661016949153, 521, 2940, 832.0, 1840.0, 1908.0, 2940.0, 0.28014928633156383, 92.0249228995926, 1.0163248167752443], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 174.10714285714286, 99, 435, 104.0, 411.3, 416.3, 435.0, 0.23953530151506078, 0.17801402778609499, 0.11579099047847176], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8df1e0dc-09e4-4d05-b930-2527f6694f46", 1, 0, 0.0, 635.0, 635, 635, 635.0, 635.0, 635.0, 635.0, 1.574803149606299, 0.28451033464566927, 1.0857529527559056], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 651.7857142857143, 501, 988, 603.5, 824.4000000000001, 911.6, 988.0, 0.23939194446106887, 70.3891802322102, 0.12039731581782273], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 144.55357142857144, 99, 333, 104.0, 304.20000000000005, 308.45, 333.0, 0.23969524461755767, 0.4241482258271626, 0.11657053888627317], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 968.6785714285716, 681, 1337, 965.0, 1219.4, 1321.45, 1337.0, 0.23878458645494433, 214.8587906306898, 0.11985866937289198], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 121.24999999999999, 103, 322, 107.0, 182.70000000000016, 322.0, 322.0, 0.14709262238565848, 0.10988853137209836, 0.05228683061365203], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9a78f6b9-ce03-4f25-bbbb-b57c71a01ff7", 1, 0, 0.0, 426.0, 426, 426, 426.0, 426.0, 426.0, 426.0, 2.347417840375587, 0.42409404342723006, 1.6184345657276995], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 12, 6.896551724137931, 163.8045977011494, 100, 2218, 107.5, 263.5, 329.5, 1042.75, 0.6992360645065363, 1.5519009475854255, 0.3351134048375884], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 13, 0, 0.0, 122.61538461538461, 102, 311, 106.0, 232.19999999999993, 311.0, 311.0, 0.0720600870264128, 0.05580434473822787, 0.02561510906017017], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a0c5908c-87dc-45f3-bfe7-e9a33f775ac7", 3, 0, 0.0, 306.6666666666667, 223, 394, 303.0, 394.0, 394.0, 394.0, 0.027767236512064863, 0.027848585837783806, 0.017806463518479098], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 128.66666666666669, 101, 308, 106.5, 306.2, 308.0, 308.0, 0.0894743382627066, 0.07261052255498943, 0.03180533117932149], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/be882a45-9427-42cb-9061-b640ebce18da", 3, 0, 0.0, 313.6666666666667, 218, 493, 230.0, 493.0, 493.0, 493.0, 0.06080629142428603, 0.02751326337231692, 0.03899361787299593], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/860d2248-b52d-4896-87f3-604e8cfe432b", 3, 0, 0.0, 329.6666666666667, 203, 492, 294.0, 492.0, 492.0, 492.0, 0.046912383305446524, 0.030160142261802376, 0.030083787471266166], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a28933ee-3486-4179-a0a1-98862018daf1", 3, 0, 0.0, 1230.3333333333335, 221, 2895, 575.0, 2895.0, 2895.0, 2895.0, 0.04129842240026431, 0.03402549059084276, 0.0264836888439195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 13, 0, 0.0, 269.6923076923077, 203, 604, 211.0, 525.9999999999999, 604.0, 604.0, 0.07048744781217807, 0.10924177702922518, 0.15852792217914655], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d7fcdae3-8734-4bf0-b57e-03d8707b4ee7", 1, 0, 0.0, 536.0, 536, 536, 536.0, 536.0, 536.0, 536.0, 1.8656716417910448, 0.3370598180970149, 1.2862931436567164], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 439.31250000000006, 204, 1480, 309.0, 1219.6000000000004, 1480.0, 1480.0, 0.07396791641625446, 11.161724275923444, 0.16398990453515788], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 107.47058823529413, 102, 135, 105.0, 122.19999999999999, 135.0, 135.0, 0.07882010932812812, 0.06534987580037184, 0.02801808573773304], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 106.06666666666668, 101, 116, 105.0, 116.0, 116.0, 116.0, 0.07573424349064177, 0.05879758161626973, 0.026921156865814068], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=239b9b4a-7e40-4f5c-b5d3-a7d87016689a", 1, 0, 0.0, 424.0, 424, 424, 424.0, 424.0, 424.0, 424.0, 2.3584905660377355, 0.4260944870283019, 1.626068691037736], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 124.5, 99, 427, 103.5, 207.9000000000002, 427.0, 427.0, 0.15434182856481393, 0.11470130032990566, 0.07747236316632261], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 138.93750000000003, 99, 306, 102.0, 304.6, 306.0, 306.0, 0.1543522511311126, 0.041301285947192234, 0.08802901822321264], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 139.6875, 98, 307, 102.5, 305.6, 307.0, 307.0, 0.15434778414462388, 0.04160155119523065, 0.09073961528814802], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 166.125, 100, 307, 103.0, 305.6, 307.0, 307.0, 0.15434629520658286, 0.04160114987989929, 0.09088946875934518], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=85f21353-9c4f-46b4-806d-f1dfe4cf21c0", 1, 0, 0.0, 720.0, 720, 720, 720.0, 720.0, 720.0, 720.0, 1.3888888888888888, 0.2509223090277778, 0.9575737847222222], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 26.08695652173913, 0.45662100456621], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 8.695652173913043, 0.15220700152207], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.3478260869565215, 0.076103500761035], "isController": false}, {"data": ["401/Unauthorized", 14, 60.869565217391305, 1.06544901065449], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1314, 23, "401/Unauthorized", 14, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 3, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
