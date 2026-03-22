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

    var data = {"OkPercent": 98.42105263157895, "KoPercent": 1.5789473684210527};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7687052700065062, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=17870b97-54bf-4e1c-a8db-7bdfb593ff89"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7083333333333334, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/aa84448d-74f2-443b-832e-108a4145385b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.8947368421052632, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/5231ddc4-f167-419d-a5ca-2a4fbf5a3331"], "isController": false}, {"data": [0.875, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f28c2d2b-783c-40f8-bade-6493788afe22"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ec67205f-c49f-4319-9bc6-96912745fe4d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6764705882352942, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=94b3376d-23aa-4285-a5d2-d615ac42eb36"], "isController": false}, {"data": [0.7380952380952381, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=87583d17-43ab-4993-83c5-d4fef1a4348d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/eca9d0f3-b1d2-4534-a5c9-3e5b5a7573a0"], "isController": false}, {"data": [0.7380952380952381, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.023809523809523808, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bac726d5-baec-4fb7-9cc8-f15a0399a1b0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7492d3f6-21cf-42c4-87ec-e6482ebe6c03"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e192fab8-9300-45da-b7f7-6a3e8bfa8636"], "isController": false}, {"data": [0.5882352941176471, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/63a4295a-c6a7-4fca-9f3b-10f1b437f370"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7017a893-40cd-41ff-9588-3486d2f9b7c9"], "isController": false}, {"data": [0.30952380952380953, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7017a893-40cd-41ff-9588-3486d2f9b7c9"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.30952380952380953, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5231ddc4-f167-419d-a5ca-2a4fbf5a3331"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.4523809523809524, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ec67205f-c49f-4319-9bc6-96912745fe4d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7492d3f6-21cf-42c4-87ec-e6482ebe6c03"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/94b3376d-23aa-4285-a5d2-d615ac42eb36"], "isController": false}, {"data": [0.2698412698412698, 500, 1500, "addBook"], "isController": true}, {"data": [0.9017857142857143, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/17870b97-54bf-4e1c-a8db-7bdfb593ff89"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9203296703296703, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f43ebfa6-c7ae-4ab0-bb6e-72124119ec9b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f43ebfa6-c7ae-4ab0-bb6e-72124119ec9b"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f28c2d2b-783c-40f8-bade-6493788afe22"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/87583d17-43ab-4993-83c5-d4fef1a4348d"], "isController": false}, {"data": [0.8421052631578947, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e192fab8-9300-45da-b7f7-6a3e8bfa8636"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bac726d5-baec-4fb7-9cc8-f15a0399a1b0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dcde288f-26f9-489a-850d-6a38693edc26"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1330, 21, 1.5789473684210527, 414.88571428571413, 126, 1982, 157.5, 1083.0, 1261.3500000000001, 1645.0700000000002, 5.165309316586856, 718.8725979673245, 3.784884649516286], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 2074.071428571429, 1649, 2677, 2043.5, 2442.6000000000004, 2580.05, 2677.0, 0.25012394534791793, 300.9840613331271, 1.2298574851823894], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=17870b97-54bf-4e1c-a8db-7bdfb593ff89", 1, 0, 0.0, 459.0, 459, 459, 459.0, 459.0, 459.0, 459.0, 2.1786492374727673, 0.3936036220043573, 1.502076525054466], "isController": false}, {"data": ["deleteBook", 12, 1, 8.333333333333334, 518.0833333333334, 159, 796, 489.0, 765.1000000000001, 796.0, 796.0, 0.06805460247605329, 0.012943001789268924, 0.04598448603179284], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, 8.333333333333334, 518.0833333333334, 159, 796, 489.0, 765.1000000000001, 796.0, 796.0, 0.06781615041622162, 0.012897651653866367, 0.04582336400601303], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aa84448d-74f2-443b-832e-108a4145385b", 1, 0, 0.0, 268.0, 268, 268, 268.0, 268.0, 268.0, 268.0, 3.7313432835820897, 1.1915520055970148, 2.226416744402985], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 231.26315789473682, 133, 453, 150.0, 430.0, 453.0, 453.0, 0.09850377943448463, 0.04971767650321952, 0.054871708548054295], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 147.05263157894737, 134, 202, 144.0, 153.0, 202.0, 202.0, 0.09850275807722617, 0.07320370986012609, 0.04944376723798266], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 295.2631578947369, 134, 978, 149.0, 975.0, 978.0, 978.0, 0.09836965244448587, 4.589265848515913, 0.056591874990292466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 335.0526315789473, 135, 1264, 147.0, 1241.0, 1264.0, 1264.0, 0.09837067104329862, 13.998238509723166, 0.05649639587982211], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5231ddc4-f167-419d-a5ca-2a4fbf5a3331", 3, 0, 0.0, 631.0, 430, 867, 596.0, 867.0, 867.0, 867.0, 0.04337830217325294, 0.02788806861724432, 0.027817465911884207], "isController": false}, {"data": ["goToProfile", 12, 1, 8.333333333333334, 307.50000000000006, 152, 867, 254.5, 706.5000000000006, 867.0, 867.0, 0.06784490654364123, 0.1459316996138494, 0.043855150771170436], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 10, 0, 0.0, 143.5, 134, 152, 142.5, 152.0, 152.0, 152.0, 0.21229168878038424, 0.15776755386901603, 0.10656047659484132], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 10, 0, 0.0, 167.3, 133, 421, 139.5, 394.10000000000014, 421.0, 421.0, 0.21232774911353164, 0.05681426099326921, 0.12109316941631101], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 911.0, 692, 1046, 921.5, 1046.0, 1046.0, 1046.0, 0.05779845678120395, 16.994665383059274, 0.03296318238303037], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1040.1666666666667, 919, 1392, 977.5, 1392.0, 1392.0, 1392.0, 0.05776284501265969, 51.97510947864219, 0.032886463517949806], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 438.5, 417, 454, 440.5, 454.0, 454.0, 454.0, 0.05807706826959375, 0.10276918721142957, 0.03215790791880826], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 21, 0, 0.0, 198.61904761904765, 134, 452, 144.0, 421.8, 448.99999999999994, 452.0, 0.11444328790116459, 0.08505013876248657, 0.05744516599726426], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f28c2d2b-783c-40f8-bade-6493788afe22", 1, 0, 0.0, 1268.0, 1268, 1268, 1268.0, 1268.0, 1268.0, 1268.0, 0.7886435331230284, 0.14247954455835962, 0.5437327484227129], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 21, 0, 0.0, 232.5714285714286, 132, 426, 142.0, 425.0, 426.0, 426.0, 0.11444453527344069, 0.038808107850350146, 0.06481145603422436], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 21, 0, 0.0, 255.80952380952385, 133, 1185, 144.0, 422.2, 1108.7999999999988, 1185.0, 0.11428509232602815, 4.926190240121142, 0.06671944982612339], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 21, 0, 0.0, 250.04761904761904, 128, 698, 152.0, 455.4, 673.7999999999997, 698.0, 0.11424840868287907, 1.6289855183341493, 0.06680960468690496], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ec67205f-c49f-4319-9bc6-96912745fe4d", 1, 0, 0.0, 1154.0, 1154, 1154, 1154.0, 1154.0, 1154.0, 1154.0, 0.8665511265164644, 0.15655464688041595, 0.5974463821490469], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 141.83333333333334, 135, 155, 141.5, 155.0, 155.0, 155.0, 0.05823207422648395, 0.04327598484995535, 0.03269867449241042], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 754.6470588235294, 132, 1506, 982.0, 1385.1999999999998, 1506.0, 1506.0, 0.08124175635119377, 43.00988423945768, 0.04365437666067708], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 10, 0, 0.0, 174.8, 134, 453, 144.0, 422.8000000000001, 453.0, 453.0, 0.21232324090194912, 0.05722774852435348, 0.12482284279587244], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 649.1176470588234, 140, 1205, 697.0, 1130.6, 1205.0, 1205.0, 0.08124059162266134, 14.06044658431101, 0.043733087321688846], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 10, 0, 0.0, 194.29999999999998, 140, 419, 141.0, 416.8, 419.0, 419.0, 0.212300702715326, 0.057221673778740205, 0.12501691771224763], "isController": false}, {"data": ["deleteBooks", 11, 0, 0.0, 623.6363636363636, 404, 1268, 493.0, 1245.2, 1268.0, 1268.0, 0.08834347944809419, 0.015960491892477956, 0.060908687978861814], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=94b3376d-23aa-4285-a5d2-d615ac42eb36", 1, 0, 0.0, 533.0, 533, 533, 533.0, 533.0, 533.0, 533.0, 1.876172607879925, 0.3389569652908067, 1.2935330675422139], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 21, 0, 0.0, 530.1904761904761, 280, 1328, 542.0, 874.2, 1282.6999999999994, 1328.0, 0.11415897452624026, 6.6720144710090565, 0.2553553215070072], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=87583d17-43ab-4993-83c5-d4fef1a4348d", 1, 0, 0.0, 493.0, 493, 493, 493.0, 493.0, 493.0, 493.0, 2.028397565922921, 0.3664585446247465, 1.3984850405679514], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eca9d0f3-b1d2-4534-a5c9-3e5b5a7573a0", 1, 0, 0.0, 220.0, 220, 220, 220.0, 220.0, 220.0, 220.0, 4.545454545454545, 1.4515269886363635, 2.712180397727273], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 605.7142857142857, 199, 1334, 562.0, 1182.8000000000002, 1326.8999999999999, 1334.0, 0.09527525474788352, 0.058523569566815176, 0.04307855756667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 144.35294117647055, 134, 155, 144.0, 154.2, 155.0, 155.0, 0.08123670943540487, 0.060372203008147565, 0.04077702016581846], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 279.7058823529411, 133, 454, 153.0, 454.0, 454.0, 454.0, 0.08124253285543608, 0.09351665173237754, 0.04232004181600956], "isController": false}, {"data": ["login", 21, 0, 0.0, 2357.4761904761904, 1292, 3648, 2531.0, 3181.8, 3609.0999999999995, 3648.0, 0.0958904109589041, 32.90705265410959, 0.1901086258561644], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bac726d5-baec-4fb7-9cc8-f15a0399a1b0", 1, 0, 0.0, 451.0, 451, 451, 451.0, 451.0, 451.0, 451.0, 2.2172949002217295, 0.4005855044345898, 1.5287208980044344], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 10, 0, 0.0, 146.8, 135, 157, 144.5, 156.7, 157.0, 157.0, 0.22025946565053633, 0.1783155244377877, 0.07829535693046408], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7492d3f6-21cf-42c4-87ec-e6482ebe6c03", 1, 0, 0.0, 531.0, 531, 531, 531.0, 531.0, 531.0, 531.0, 1.8832391713747645, 0.34023363935969864, 1.298405131826742], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e192fab8-9300-45da-b7f7-6a3e8bfa8636", 1, 0, 0.0, 475.0, 475, 475, 475.0, 475.0, 475.0, 475.0, 2.1052631578947367, 0.38034539473684215, 1.451480263157895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 952.5882352941178, 284, 1653, 1205.0, 1538.6, 1653.0, 1653.0, 0.08118084705050882, 57.181521306689305, 0.17035946252310075], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 564.0526315789474, 281, 1399, 535.0, 1381.0, 1399.0, 1399.0, 0.09829586019224601, 18.696078738864113, 0.21709865379939366], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 1, 14.285714285714286, 1045.857142857143, 152, 1534, 1122.0, 1534.0, 1534.0, 1534.0, 0.05814291528577242, 59.6243429071873, 0.11773778116252606], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/63a4295a-c6a7-4fca-9f3b-10f1b437f370", 1, 0, 0.0, 232.0, 232, 232, 232.0, 232.0, 232.0, 232.0, 4.310344827586206, 1.3764480064655171, 2.571895204741379], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7017a893-40cd-41ff-9588-3486d2f9b7c9", 3, 0, 0.0, 356.6666666666667, 295, 446, 329.0, 446.0, 446.0, 446.0, 0.0582977069568597, 0.037479808346288376, 0.03738492275553828], "isController": false}, {"data": ["register", 21, 6, 28.571428571428573, 991.9523809523807, 219, 1978, 1031.0, 1573.4, 1942.6999999999994, 1978.0, 0.09767759880554251, 0.030687772392589525, 0.044069385398594375], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 194.94736842105263, 142, 425, 155.0, 423.0, 425.0, 425.0, 0.10525032959971638, 0.08171290237477981, 0.037413203099899185], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 10, 0, 0.0, 400.6, 282, 589, 304.0, 587.5, 589.0, 589.0, 0.21165364996719369, 0.32802181884564097, 0.4760140194086397], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7017a893-40cd-41ff-9588-3486d2f9b7c9", 1, 0, 0.0, 665.0, 665, 665, 665.0, 665.0, 665.0, 665.0, 1.5037593984962407, 0.2716752819548872, 1.0367716165413534], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 428.73333333333335, 276, 721, 308.0, 641.2, 721.0, 721.0, 0.07939742646475019, 0.1230505037105064, 0.17856667299640594], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 142.0909090909091, 134, 154, 141.0, 153.4, 154.0, 154.0, 0.06508567641768437, 0.04836933569712676, 0.032669958670595474], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 165.54545454545453, 132, 421, 141.0, 367.0000000000002, 421.0, 421.0, 0.06508567641768437, 0.0174155032602007, 0.037119174831960616], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 140.63636363636368, 133, 153, 141.0, 152.6, 153.0, 153.0, 0.06508837225815232, 0.017543350335205116, 0.038264843847077824], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 143.81818181818178, 134, 152, 142.0, 152.0, 152.0, 152.0, 0.06508144054810405, 0.01754148202273117, 0.038324324854010494], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1345.803571428571, 1074, 1982, 1205.0, 1835.5000000000002, 1956.25, 1982.0, 0.24862148267197057, 297.437728088012, 0.4909303105104732], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 6, 28.571428571428573, 991.9523809523807, 219, 1978, 1031.0, 1573.4, 1942.6999999999994, 1978.0, 0.09659924652587709, 0.03034898202794018, 0.043582863178667205], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 179.0, 134, 398, 144.0, 398.0, 398.0, 398.0, 0.03779187474692941, 0.010186091240383319, 0.022254394992576598], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 180.7142857142857, 133, 419, 140.0, 419.0, 419.0, 419.0, 0.03779289493575208, 0.010186366213151927, 0.022218088624338623], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5231ddc4-f167-419d-a5ca-2a4fbf5a3331", 1, 0, 0.0, 427.0, 427, 427, 427.0, 427.0, 427.0, 427.0, 2.34192037470726, 0.42310084894613587, 1.6146443208430914], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 250.6315789473684, 132, 1356, 142.0, 430.0, 1356.0, 1356.0, 0.10818074155051471, 5.150845633554819, 0.06310913942220096], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 228.68421052631578, 128, 981, 142.0, 458.0, 981.0, 981.0, 0.10835842686376494, 1.7045622640352678, 0.06331861405294735], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 157.42105263157896, 134, 397, 143.0, 156.0, 397.0, 397.0, 0.10835719092537041, 0.08052717020918641, 0.05439023060121132], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 177.42857142857142, 133, 417, 139.0, 417.0, 417.0, 417.0, 0.03779126266007299, 0.010112115203964843, 0.021552829485822877], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 189.7894736842105, 132, 455, 143.0, 419.0, 455.0, 455.0, 0.10835842686376494, 0.03756009615384615, 0.06131919612304955], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 144.14285714285714, 140, 152, 143.0, 152.0, 152.0, 152.0, 0.03779085461318361, 0.0280848050396804, 0.01896923756950818], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 150.42857142857144, 142, 161, 149.0, 161.0, 161.0, 161.0, 0.03674521393588485, 0.028922502375315615, 0.013061775266271568], "isController": false}, {"data": ["deleteAccount", 11, 0, 0.0, 499.72727272727275, 414, 596, 492.0, 589.2, 596.0, 596.0, 0.08781523674189505, 0.015865057419190025, 0.05977267579013755], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1155.6666666666665, 813, 1843, 1083.0, 1537.4, 1813.8999999999996, 1843.0, 0.094553280773716, 0.04893870977545847, 0.04349081566837913], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 369.7142857142857, 282, 564, 299.0, 564.0, 564.0, 564.0, 0.037761905789439616, 0.058523578601406896, 0.08492741116511662], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ec67205f-c49f-4319-9bc6-96912745fe4d", 3, 0, 0.0, 390.0, 332, 492, 346.0, 492.0, 492.0, 492.0, 0.017738568970512587, 0.02445404934574245, 0.01137531929424147], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7492d3f6-21cf-42c4-87ec-e6482ebe6c03", 3, 0, 0.0, 309.6666666666667, 226, 476, 227.0, 476.0, 476.0, 476.0, 0.03302291790502609, 0.02684187044558924, 0.02117680607841842], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/94b3376d-23aa-4285-a5d2-d615ac42eb36", 3, 0, 0.0, 346.0, 303, 414, 321.0, 414.0, 414.0, 414.0, 0.04824935265451855, 0.031019684730688196, 0.03094115388326873], "isController": false}, {"data": ["addBook", 63, 13, 20.634920634920636, 1251.7142857142853, 720, 2621, 1113.0, 2045.2, 2246.9999999999995, 2621.0, 0.2887841727937806, 83.37184564887053, 1.050893805636792], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 250.5178571428572, 136, 610, 152.5, 565.6, 609.0, 610.0, 0.24969345669379112, 0.1855632036562256, 0.12070142681975253], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 821.1071428571429, 656, 1257, 710.0, 1076.1000000000004, 1146.1, 1257.0, 0.24954102276170614, 73.373346233713, 0.12550158859597527], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 223.35714285714286, 133, 601, 145.0, 434.6, 462.75, 601.0, 0.25018428753322763, 0.44270891504903165, 0.12167165546049545], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1085.625, 920, 1408, 993.5, 1360.0, 1371.7, 1408.0, 0.2492566809692524, 224.28159968264282, 0.12511516993964428], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/17870b97-54bf-4e1c-a8db-7bdfb593ff89", 3, 0, 0.0, 351.3333333333333, 238, 541, 275.0, 541.0, 541.0, 541.0, 0.021780639915200708, 0.030026370456013998, 0.013967402549786912], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 166.86666666666667, 135, 409, 148.0, 262.0000000000001, 409.0, 409.0, 0.07802381286768721, 0.05828927426150461, 0.027735027230310693], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 13, 7.142857142857143, 199.59890109890105, 131, 896, 154.0, 351.5000000000002, 424.79999999999995, 612.1399999999958, 0.7364962203985173, 1.5341629475125043, 0.35584724127535244], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 176.54545454545453, 142, 432, 154.0, 376.8000000000002, 432.0, 432.0, 0.06444053895723492, 0.049903659563561804, 0.0229065978324546], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f43ebfa6-c7ae-4ab0-bb6e-72124119ec9b", 1, 0, 0.0, 404.0, 404, 404, 404.0, 404.0, 404.0, 404.0, 2.4752475247524752, 0.44718827351485146, 1.7065671410891088], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 178.21052631578945, 129, 456, 146.0, 424.0, 456.0, 456.0, 0.09968311263142432, 0.08089518222335312, 0.03543423144320161], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f43ebfa6-c7ae-4ab0-bb6e-72124119ec9b", 3, 0, 0.0, 588.0, 230, 972, 562.0, 972.0, 972.0, 972.0, 0.04178913203972753, 0.026866385344551394, 0.02679836917912215], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 316.3636363636364, 283, 566, 293.0, 514.0000000000002, 566.0, 566.0, 0.06502680877980149, 0.10077885306010251, 0.14624681701160433], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f28c2d2b-783c-40f8-bade-6493788afe22", 3, 0, 0.0, 433.0, 218, 550, 531.0, 550.0, 550.0, 550.0, 0.01883475640381718, 0.02596523221685083, 0.01207827803239578], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/87583d17-43ab-4993-83c5-d4fef1a4348d", 3, 0, 0.0, 392.0, 297, 552, 327.0, 552.0, 552.0, 552.0, 0.02769827347428677, 0.02777942075985597, 0.01776223917459145], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 445.57894736842104, 283, 1496, 304.0, 856.0, 1496.0, 1496.0, 0.1080921172401238, 6.964796904156426, 0.24164610605258965], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e192fab8-9300-45da-b7f7-6a3e8bfa8636", 3, 0, 0.0, 350.3333333333333, 226, 446, 379.0, 446.0, 446.0, 446.0, 0.022945603622345958, 0.027120926677323624, 0.014714465864590345], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 21, 0, 0.0, 151.04761904761904, 143, 163, 153.0, 160.4, 162.8, 163.0, 0.11826521819932757, 0.09805387719846592, 0.042039589281792224], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bac726d5-baec-4fb7-9cc8-f15a0399a1b0", 3, 0, 0.0, 328.0, 234, 441, 309.0, 441.0, 441.0, 441.0, 0.03977672001166784, 0.02557259831479296, 0.025507857559565635], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 180.58823529411765, 135, 434, 148.0, 422.8, 434.0, 434.0, 0.08023826043451378, 0.06229435258343599, 0.02852219413883107], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dcde288f-26f9-489a-850d-6a38693edc26", 1, 0, 0.0, 236.0, 236, 236, 236.0, 236.0, 236.0, 236.0, 4.237288135593221, 1.3531183792372883, 2.5283037605932206], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 141.79999999999998, 129, 157, 142.0, 155.8, 157.0, 157.0, 0.07945841146743794, 0.05905063586593777, 0.03988439794361631], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 243.0666666666666, 132, 579, 142.0, 490.80000000000007, 579.0, 579.0, 0.07946430463435825, 0.02126290963849039, 0.04531948623678243], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 194.26666666666668, 126, 422, 142.0, 422.0, 422.0, 422.0, 0.07946262078318359, 0.02141765950796745, 0.04671532979636379], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 219.99999999999997, 138, 458, 144.0, 438.8, 458.0, 458.0, 0.07946388366487431, 0.021417999894048155, 0.04679367368156173], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 28.571428571428573, 0.45112781954887216], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 4.761904761904762, 0.07518796992481203], "isController": false}, {"data": ["401/Unauthorized", 14, 66.66666666666667, 1.0526315789473684], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1330, 21, "401/Unauthorized", 14, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 1, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 1, "Test failed: code expected to contain /200/", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
