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

    var data = {"OkPercent": 97.30134932533733, "KoPercent": 2.6986506746626686};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7163987138263666, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/2a64f118-4e58-4540-a845-439e88d97e8d"], "isController": false}, {"data": [0.5333333333333333, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5333333333333333, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.71875, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=346d8db0-4f58-453e-aa49-3822edeb930d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=63d406e8-4222-4d9e-9b67-10f93b4c51a1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.4666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9130434782608695, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9565217391304348, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8076923076923077, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=be8dc77f-2000-4837-92c4-1b750cb0856a"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=170fb0af-5330-499c-baee-23e6c9870044"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a64e3bc8-ab6f-474e-85b8-f563051bc89d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f34f8ba8-274f-4ed0-8aca-57ce4ed83ead"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/b27ee640-80f2-4c84-ba60-a065cace1df5"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f2d5b1c9-711a-4a96-9aa4-6784fe69736f"], "isController": false}, {"data": [0.36666666666666664, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=02242c86-97d1-4fa5-b44b-7622911db795"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/528e2b13-c821-45f7-97c0-49424d54c257"], "isController": false}, {"data": [0.15384615384615385, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/52d961a8-9344-431a-b147-eeb02614ae2b"], "isController": false}, {"data": [0.20833333333333334, 500, 1500, "register"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/1e3aa05c-d978-48a8-962a-b995cfedb490"], "isController": false}, {"data": [0.8043478260869565, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.6, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/652276e9-d63c-49c9-ab08-e252f5d6acf4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.25892857142857145, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.20833333333333334, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a64e3bc8-ab6f-474e-85b8-f563051bc89d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.39285714285714285, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.23809523809523808, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.20491803278688525, 500, 1500, "addBook"], "isController": true}, {"data": [0.9107142857142857, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9732142857142857, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.3392857142857143, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/346d8db0-4f58-453e-aa49-3822edeb930d"], "isController": false}, {"data": [0.8792134831460674, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/02242c86-97d1-4fa5-b44b-7622911db795"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/63d406e8-4222-4d9e-9b67-10f93b4c51a1"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/170fb0af-5330-499c-baee-23e6c9870044"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f2d5b1c9-711a-4a96-9aa4-6784fe69736f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=528e2b13-c821-45f7-97c0-49424d54c257"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=52d961a8-9344-431a-b147-eeb02614ae2b"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/be8dc77f-2000-4837-92c4-1b750cb0856a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2a64f118-4e58-4540-a845-439e88d97e8d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1e3aa05c-d978-48a8-962a-b995cfedb490"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1334, 36, 2.6986506746626686, 475.41229385307247, 136, 2732, 158.0, 1322.0, 1649.75, 2076.500000000001, 5.1815484051395995, 718.9670041951995, 3.7936076433665304], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 2316.4107142857147, 1686, 3205, 2287.5, 2810.8, 2934.1, 3205.0, 0.25116950802172616, 302.24255686073997, 1.2349985086810462], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/2a64f118-4e58-4540-a845-439e88d97e8d", 3, 0, 0.0, 451.3333333333333, 293, 539, 522.0, 539.0, 539.0, 539.0, 0.02854723139434194, 0.023798652213837795, 0.018306655549105995], "isController": false}, {"data": ["deleteBook", 15, 3, 20.0, 512.1999999999999, 142, 949, 504.0, 839.8000000000001, 949.0, 949.0, 0.08262823902696986, 0.016816137708223163, 0.05537060314483078], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, 20.0, 512.1999999999999, 142, 949, 504.0, 839.8000000000001, 949.0, 949.0, 0.08257092842751923, 0.016804474105756844, 0.05533219832711299], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 146.625, 137, 225, 140.0, 175.30000000000004, 225.0, 225.0, 0.0735716749051615, 0.01968617082423267, 0.041958845844349925], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 192.75000000000003, 139, 419, 141.0, 418.3, 419.0, 419.0, 0.07356998344675372, 0.05467456777634725, 0.03692868309729631], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 257.25, 138, 560, 144.0, 473.2000000000001, 560.0, 560.0, 0.07357201320617636, 0.019829956684477224, 0.04332414449543394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 256.56250000000006, 137, 579, 147.5, 468.4000000000001, 579.0, 579.0, 0.0735716749051615, 0.019829865501781816, 0.04325209794229222], "isController": false}, {"data": ["goToProfile", 16, 3, 18.75, 313.81250000000006, 139, 537, 281.0, 526.5, 537.0, 537.0, 0.08614980373997835, 0.1478175831749433, 0.05567872752701604], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=346d8db0-4f58-453e-aa49-3822edeb930d", 1, 0, 0.0, 491.0, 491, 491, 491.0, 491.0, 491.0, 491.0, 2.0366598778004072, 0.3679512474541752, 1.404181517311609], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=63d406e8-4222-4d9e-9b67-10f93b4c51a1", 1, 0, 0.0, 588.0, 588, 588, 588.0, 588.0, 588.0, 588.0, 1.7006802721088434, 0.30725180697278914, 1.1725393282312926], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 23, 0, 0.0, 167.17391304347825, 139, 438, 141.0, 320.2000000000004, 437.4, 438.0, 0.12076660540824365, 0.08974940108952481, 0.060619174980309797], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 1029.142857142857, 844, 1115, 1090.0, 1115.0, 1115.0, 1115.0, 0.03093061379593749, 9.094627449041814, 0.0176401156804956], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 23, 0, 0.0, 152.99999999999997, 138, 413, 140.0, 149.0, 360.19999999999925, 413.0, 0.12076470310260275, 0.04808642092799798, 0.06799167642410463], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1367.7142857142856, 963, 1734, 1293.0, 1734.0, 1734.0, 1734.0, 0.030906305327805517, 27.80954786144924, 0.0175960703184674], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 262.14285714285717, 139, 424, 158.0, 424.0, 424.0, 424.0, 0.031026718436962576, 0.05490274785915643, 0.01717983335327908], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 142.0, 138, 146, 142.0, 145.6, 146.0, 146.0, 0.15113115859471274, 0.1123152457915785, 0.07586075734148666], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 225.2307692307692, 138, 419, 141.0, 418.6, 419.0, 419.0, 0.1511364296924955, 0.04044080247631227, 0.08619499505900134], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 140.84615384615384, 139, 145, 140.0, 144.6, 145.0, 145.0, 0.15112940164382285, 0.040734096536811634, 0.08884755838826305], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 184.3076923076923, 139, 427, 141.0, 424.2, 427.0, 427.0, 0.15113115859471274, 0.040734570089981166, 0.08899618030528494], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 143.85714285714286, 141, 148, 143.0, 148.0, 148.0, 148.0, 0.0310638939922429, 0.023085569656344576, 0.017443104536659832], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 1051.333333333333, 139, 1942, 1500.0, 1775.2, 1942.0, 1942.0, 0.06731830788701296, 36.35113681688747, 0.03610470184721437], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 23, 0, 0.0, 302.30434782608694, 137, 1638, 143.0, 1080.0000000000016, 1615.1999999999996, 1638.0, 0.1205950052694774, 9.46546878358964, 0.06999548751841696], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 694.2, 140, 1297, 819.0, 1289.2, 1297.0, 1297.0, 0.06731649523399214, 11.883228389722117, 0.036169468435295386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 23, 0, 0.0, 248.6086956521739, 137, 1093, 141.0, 666.8000000000006, 1041.1999999999994, 1093.0, 0.12059310836601582, 3.113014421362807, 0.07011215322927372], "isController": false}, {"data": ["deleteBooks", 14, 3, 21.428571428571427, 488.8571428571429, 144, 1105, 422.0, 967.0, 1105.0, 1105.0, 0.08307471383728036, 0.01704260138082042, 0.05600705282068323], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 390.69230769230774, 281, 566, 288.0, 565.2, 566.0, 566.0, 0.15087507543753773, 0.23382689914001206, 0.3393215807936029], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 704.3809523809524, 153, 1548, 717.0, 1286.8, 1523.3999999999996, 1548.0, 0.087156096568955, 0.05353631322448505, 0.039407492882252114], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 161.93333333333334, 138, 412, 144.0, 259.6000000000001, 412.0, 412.0, 0.06739846421366212, 0.05008811647128601, 0.03383086973224837], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 251.5333333333333, 137, 419, 144.0, 419.0, 419.0, 419.0, 0.06740149271839208, 0.07877549461462073, 0.035043510471945254], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=be8dc77f-2000-4837-92c4-1b750cb0856a", 1, 0, 0.0, 810.0, 810, 810, 810.0, 810.0, 810.0, 810.0, 1.2345679012345678, 0.22304205246913578, 0.8511766975308641], "isController": false}, {"data": ["login", 21, 0, 0.0, 3116.238095238095, 1739, 4171, 3042.0, 4135.2, 4167.5, 4171.0, 0.08718142454447705, 34.883666151448665, 0.17972655001307722], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=170fb0af-5330-499c-baee-23e6c9870044", 1, 0, 0.0, 353.0, 353, 353, 353.0, 353.0, 353.0, 353.0, 2.8328611898017, 0.5117962110481586, 1.953125], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 23, 0, 0.0, 197.21739130434784, 140, 437, 150.0, 419.0, 433.79999999999995, 437.0, 0.11217542285257223, 0.09081389213357655, 0.039874857342125286], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a64e3bc8-ab6f-474e-85b8-f563051bc89d", 3, 0, 0.0, 719.6666666666667, 282, 1360, 517.0, 1360.0, 1360.0, 1360.0, 0.059319017677067265, 0.0268403107327876, 0.03803986485150473], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f34f8ba8-274f-4ed0-8aca-57ce4ed83ead", 2, 0, 0.0, 276.5, 274, 279, 276.5, 279.0, 279.0, 279.0, 0.01749138549264487, 0.02458017941788669, 0.010872330923894983], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b27ee640-80f2-4c84-ba60-a065cace1df5", 2, 0, 0.0, 424.0, 283, 565, 424.0, 565.0, 565.0, 565.0, 0.016696720764041943, 0.02803712046266613, 0.010378381607727243], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f2d5b1c9-711a-4a96-9aa4-6784fe69736f", 1, 0, 0.0, 801.0, 801, 801, 801.0, 801.0, 801.0, 801.0, 1.2484394506866416, 0.2255481429463171, 0.8607404806491885], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 1215.533333333333, 289, 2089, 1640.0, 1919.2, 2089.0, 2089.0, 0.06727241741189555, 48.330422983733534, 0.1409698762523882], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=02242c86-97d1-4fa5-b44b-7622911db795", 1, 0, 0.0, 1105.0, 1105, 1105, 1105.0, 1105.0, 1105.0, 1105.0, 0.9049773755656109, 0.1634968891402715, 0.6239394796380091], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/528e2b13-c821-45f7-97c0-49424d54c257", 3, 0, 0.0, 426.6666666666667, 327, 581, 372.0, 581.0, 581.0, 581.0, 0.0845403821225272, 0.03918798962971313, 0.05421372160852168], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 6, 46.15384615384615, 890.2307692307693, 139, 1879, 1232.0, 1802.1999999999998, 1879.0, 1879.0, 0.05736070174200039, 36.95811372641593, 0.08718723250057361], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 490.43749999999994, 280, 998, 459.5, 898.6000000000001, 998.0, 998.0, 0.07352231632057568, 0.11394523046948593, 0.16535341258426345], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/52d961a8-9344-431a-b147-eeb02614ae2b", 3, 0, 0.0, 407.3333333333333, 268, 551, 403.0, 551.0, 551.0, 551.0, 0.10072522159548751, 0.045575539719312386, 0.06459267140075209], "isController": false}, {"data": ["register", 24, 7, 29.166666666666668, 1338.9583333333335, 446, 2732, 1280.5, 2228.0, 2645.5, 2732.0, 0.09373205909806326, 0.0294285712890892, 0.042289268850884014], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/1e3aa05c-d978-48a8-962a-b995cfedb490", 3, 0, 0.0, 714.0, 262, 1324, 556.0, 1324.0, 1324.0, 1324.0, 0.037469088002398024, 0.03123643697074913, 0.024028028439037792], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 23, 0, 0.0, 496.13043478260875, 279, 1779, 290.0, 1340.6000000000013, 1756.1999999999996, 1779.0, 0.1205033898127482, 12.706512479632307, 0.2683339112911676], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 177.0666666666667, 142, 418, 149.0, 317.80000000000007, 418.0, 418.0, 0.08640503222907701, 0.06708203185753538, 0.030714288800179724], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 694.5333333333332, 278, 1786, 568.0, 1705.6000000000001, 1786.0, 1786.0, 0.07416490319007969, 17.837354513181573, 0.1630034483589779], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/652276e9-d63c-49c9-ab08-e252f5d6acf4", 1, 0, 0.0, 260.0, 260, 260, 260.0, 260.0, 260.0, 260.0, 3.8461538461538463, 1.2282151442307692, 2.294921875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 199.0, 139, 422, 141.5, 421.2, 422.0, 422.0, 0.06424835845444149, 0.04774707107795896, 0.03224966430232708], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 170.70000000000002, 138, 418, 139.0, 393.30000000000007, 418.0, 418.0, 0.06424959683377987, 0.017191786652788754, 0.03664234819426508], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 226.1, 138, 435, 143.5, 433.5, 435.0, 435.0, 0.06413504274600598, 0.017286398240134428, 0.03770439036435118], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 250.7, 138, 419, 143.5, 419.0, 419.0, 419.0, 0.06413751082320496, 0.01728706346406696, 0.03776847561171151], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 146.0, 144, 149, 145.0, 149.0, 149.0, 149.0, 0.037897928246589184, 0.011176928057099546, 0.023427137285245075], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1580.1785714285716, 1106, 2601, 1429.5, 2222.8, 2337.9, 2601.0, 0.24678300722721663, 295.23827229860746, 0.4873000396615548], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, 29.166666666666668, 1338.9583333333335, 446, 2732, 1280.5, 2228.0, 2645.5, 2732.0, 0.09360958562156764, 0.029390118923177732, 0.04223401226285571], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 10, 0, 0.0, 197.20000000000002, 138, 436, 140.0, 433.9, 436.0, 436.0, 0.04753190579176272, 0.012811333982936046, 0.027989979680110275], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 10, 0, 0.0, 168.4, 138, 419, 140.0, 391.7000000000001, 419.0, 419.0, 0.04753167986462978, 0.012811273088513495, 0.027943428982917115], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 249.8666666666667, 138, 416, 144.0, 416.0, 416.0, 416.0, 0.08133828593118782, 0.021923209879890465, 0.04781801575251471], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 195.06666666666666, 137, 431, 139.0, 420.2, 431.0, 431.0, 0.081460643647699, 0.021956189108168874, 0.04796950011676025], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a64e3bc8-ab6f-474e-85b8-f563051bc89d", 1, 0, 0.0, 279.0, 279, 279, 279.0, 279.0, 279.0, 279.0, 3.5842293906810037, 0.6475414426523297, 2.4711581541218637], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 10, 0, 0.0, 141.0, 137, 146, 141.0, 145.8, 146.0, 146.0, 0.04753190579176272, 0.01271849822943651, 0.027108040021864677], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 178.33333333333334, 139, 419, 141.0, 416.0, 419.0, 419.0, 0.08145666234041282, 0.06053566410259195, 0.040887426213840034], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 10, 0, 0.0, 143.10000000000002, 139, 149, 143.0, 148.6, 149.0, 149.0, 0.04752987252488189, 0.03532249315569835, 0.023857768044716104], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 213.53333333333333, 137, 419, 140.0, 419.0, 419.0, 419.0, 0.08133563965058209, 0.021763637953378413, 0.0463867319882226], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 198.89999999999998, 140, 418, 144.5, 417.8, 418.0, 418.0, 0.047639010633027175, 0.03749711188498037, 0.016934179560958877], "isController": false}, {"data": ["deleteAccount", 14, 3, 21.428571428571427, 705.1428571428572, 140, 2147, 553.5, 1753.5, 2147.0, 2147.0, 0.08179959100204498, 0.016301718156587788, 0.055660924262342974], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1551.3333333333333, 1006, 2485, 1633.0, 2014.6000000000001, 2442.2999999999993, 2485.0, 0.08880694216553614, 0.04596453061302164, 0.04084772437496829], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 0, 0.0, 342.8, 281, 579, 286.0, 576.8, 579.0, 579.0, 0.04749758949733301, 0.07361198684791746, 0.10682319200425579], "isController": false}, {"data": ["addBook", 61, 17, 27.868852459016395, 1417.934426229508, 719, 3139, 1133.0, 2443.8000000000006, 2606.8999999999996, 3139.0, 0.27512053436526085, 76.61711801515193, 1.00092800326762], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 239.33928571428572, 139, 722, 143.5, 569.7, 604.6499999999999, 722.0, 0.2487462743582568, 0.18485929178382174, 0.12024356035872767], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 899.4285714285716, 681, 1274, 833.0, 1152.8000000000002, 1249.9, 1274.0, 0.24852769530504554, 73.07539431581657, 0.12499195613486178], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 202.82142857142858, 137, 564, 144.0, 434.9000000000002, 540.9, 564.0, 0.24892429145478465, 0.4404793126133495, 0.12105888393015896], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1338.8392857142858, 962, 2018, 1257.0, 1725.1000000000004, 1810.5499999999997, 2018.0, 0.24746568623118595, 222.6700594690977, 0.12421617453401326], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 188.0, 140, 432, 150.0, 430.8, 432.0, 432.0, 0.0766494971792985, 0.0572625638107064, 0.027246500950453764], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/346d8db0-4f58-453e-aa49-3822edeb930d", 3, 0, 0.0, 956.6666666666666, 298, 2147, 425.0, 2147.0, 2147.0, 2147.0, 0.018596462952746386, 0.02563672545731802, 0.011925466151338016], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 17, 9.55056179775281, 224.66853932584266, 140, 2228, 149.0, 391.59999999999997, 452.19999999999925, 1668.6800000000057, 0.7314417209426558, 1.55434174739578, 0.35157132840911426], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 147.5, 142, 162, 145.0, 161.3, 162.0, 162.0, 0.06571295268010277, 0.05088903464386865, 0.023358901148005283], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 151.8125, 141, 182, 148.0, 174.3, 182.0, 182.0, 0.07352873594911812, 0.059670292552458155, 0.026137167856913078], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/02242c86-97d1-4fa5-b44b-7622911db795", 3, 0, 0.0, 922.0, 243, 1301, 1222.0, 1301.0, 1301.0, 1301.0, 0.024387666344207522, 0.024459114585450317, 0.015639226138700786], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 454.7, 283, 858, 298.0, 855.2, 858.0, 858.0, 0.06407709756378875, 0.09930698616575463, 0.14411089422793505], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/63d406e8-4222-4d9e-9b67-10f93b4c51a1", 3, 0, 0.0, 363.3333333333333, 260, 508, 322.0, 508.0, 508.0, 508.0, 0.01886958600128313, 0.02601324762872203, 0.012100613418791593], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 450.53333333333325, 280, 834, 292.0, 833.4, 834.0, 834.0, 0.08127129985316986, 0.1259546414716607, 0.1827810581658693], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/170fb0af-5330-499c-baee-23e6c9870044", 3, 0, 0.0, 701.6666666666666, 269, 1110, 726.0, 1110.0, 1110.0, 1110.0, 0.06865931249141759, 0.031066550899436992, 0.04402957213805099], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f2d5b1c9-711a-4a96-9aa4-6784fe69736f", 3, 0, 0.0, 367.0, 291, 474, 336.0, 474.0, 474.0, 474.0, 0.028576871785101925, 0.028660593089159837, 0.01832566322156601], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=528e2b13-c821-45f7-97c0-49424d54c257", 1, 0, 0.0, 229.0, 229, 229, 229.0, 229.0, 229.0, 229.0, 4.366812227074235, 0.7889260371179039, 3.0107123362445414], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 146.69230769230768, 141, 155, 146.0, 154.6, 155.0, 155.0, 0.13672840480021875, 0.1133617340579939, 0.04860267514382777], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=52d961a8-9344-431a-b147-eeb02614ae2b", 1, 0, 0.0, 236.0, 236, 236, 236.0, 236.0, 236.0, 236.0, 4.237288135593221, 0.7655256885593221, 2.9214115466101696], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/be8dc77f-2000-4837-92c4-1b750cb0856a", 3, 0, 0.0, 547.0, 324, 780, 537.0, 780.0, 780.0, 780.0, 0.044292864419542013, 0.02755327601098463, 0.028403952769042243], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 146.60000000000002, 140, 168, 144.0, 162.6, 168.0, 168.0, 0.06795878978987142, 0.05276097449506619, 0.024157226058118358], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2a64f118-4e58-4540-a845-439e88d97e8d", 1, 0, 0.0, 829.0, 829, 829, 829.0, 829.0, 829.0, 829.0, 1.2062726176115801, 0.21793011158021713, 0.8316684258142341], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1e3aa05c-d978-48a8-962a-b995cfedb490", 1, 0, 0.0, 685.0, 685, 685, 685.0, 685.0, 685.0, 685.0, 1.4598540145985401, 0.26374315693430656, 1.006500912408759], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 162.66666666666666, 138, 410, 141.0, 278.6000000000001, 410.0, 410.0, 0.07431776293624527, 0.05523029061961196, 0.037304033348857485], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 256.4, 138, 475, 144.0, 446.20000000000005, 475.0, 475.0, 0.07421701053881549, 0.04215294270446786, 0.04108027497402404], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 507.7333333333334, 138, 1646, 412.0, 1566.2, 1646.0, 1646.0, 0.0742162761241292, 13.37199002749713, 0.04235546070990342], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 318.59999999999997, 136, 871, 140.0, 839.8000000000001, 871.0, 871.0, 0.07431923580007134, 4.386489676438821, 0.0424867974974236], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 19.444444444444443, 0.5247376311844077], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 8.333333333333334, 0.22488755622188905], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 8.333333333333334, 0.22488755622188905], "isController": false}, {"data": ["401/Unauthorized", 23, 63.888888888888886, 1.7241379310344827], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1334, 36, "401/Unauthorized", 23, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 17, "401/Unauthorized", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
