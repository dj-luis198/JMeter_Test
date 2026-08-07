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

    var data = {"OkPercent": 97.06336939721793, "KoPercent": 2.936630602782071};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7699144173798552, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3482142857142857, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/8ea3325f-2bcd-48a6-b6c0-4b7dccd9b770"], "isController": false}, {"data": [0.4411764705882353, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4411764705882353, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=407bb87b-c009-44d4-8f74-23a220701734"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/16093c5c-ec11-45d4-82af-28a20e2b2353"], "isController": false}, {"data": [0.6176470588235294, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f5fd88b4-7cc4-4320-9b9e-21fed36ce9e4"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ccf8c992-d28f-440c-94dd-88c707d34eff"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a91e46e7-5006-4075-95be-35fe1c41cc0c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.5588235294117647, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3e2c8cb2-10c6-4361-97ae-b13efab43331"], "isController": false}, {"data": [0.56, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=09e24b27-c9fe-4b6b-8e14-44b850f266bf"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/98169609-0ae2-4dc0-8434-19d2d3fe961c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dc10c761-5f1c-475a-b59b-5a0161a27b32"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c8298434-7280-47c3-9b20-b8265c88ff2c"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d64842c1-9b3b-4bac-941b-180faeab9509"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fe658520-6b4b-4b0b-894d-4b07d09a8cf2"], "isController": false}, {"data": [0.2, 500, 1500, "register"], "isController": true}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/a91e46e7-5006-4075-95be-35fe1c41cc0c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.49107142857142855, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7fd86843-f667-4cee-ba63-5f375a02b650"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/407bb87b-c009-44d4-8f74-23a220701734"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.4, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.26, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3113207547169811, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c387ad75-66b6-46fa-b0a5-28cd0d772712"], "isController": false}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fc8d44e9-052b-4c10-ae39-91299121dc4e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9074074074074074, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f5fd88b4-7cc4-4320-9b9e-21fed36ce9e4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8ea3325f-2bcd-48a6-b6c0-4b7dccd9b770"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fc8d44e9-052b-4c10-ae39-91299121dc4e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ccf8c992-d28f-440c-94dd-88c707d34eff"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/9ffbb4b1-f365-469b-9609-efc10c26c997"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/7fd86843-f667-4cee-ba63-5f375a02b650"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/3e2c8cb2-10c6-4361-97ae-b13efab43331"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fe658520-6b4b-4b0b-894d-4b07d09a8cf2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c8298434-7280-47c3-9b20-b8265c88ff2c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d64842c1-9b3b-4bac-941b-180faeab9509"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/09e24b27-c9fe-4b6b-8e14-44b850f266bf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1294, 38, 2.936630602782071, 341.19088098918076, 77, 3523, 104.5, 901.0, 1150.0, 2036.3499999999988, 5.083860119199626, 755.3258454704437, 3.7040743870589434], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1376.4642857142858, 1036, 2164, 1341.0, 1642.4, 1796.2999999999997, 2164.0, 0.24921452920705278, 299.8886166118172, 1.2253858931225692], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/8ea3325f-2bcd-48a6-b6c0-4b7dccd9b770", 3, 0, 0.0, 842.3333333333333, 181, 1749, 597.0, 1749.0, 1749.0, 1749.0, 0.023323615160349854, 0.02756772351797862, 0.014956875607385811], "isController": false}, {"data": ["deleteBook", 17, 5, 29.41176470588235, 572.8235294117646, 88, 1594, 487.0, 1324.3999999999999, 1594.0, 1594.0, 0.09240436148586213, 0.019799417988411408, 0.06150559148303565], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 5, 29.41176470588235, 572.8235294117646, 88, 1594, 487.0, 1324.3999999999999, 1594.0, 1594.0, 0.09362213006867459, 0.02006034841200346, 0.06231615470506276], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 142.83333333333334, 78, 246, 84.0, 242.4, 246.0, 246.0, 0.08838607035531201, 0.031025275347160847, 0.049995289145208496], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 90.55555555555556, 80, 239, 81.5, 102.20000000000022, 239.0, 239.0, 0.08838780641106223, 0.06568664128790855, 0.04436653563992772], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 165.77777777777774, 78, 648, 82.0, 286.20000000000056, 648.0, 648.0, 0.08838607035531201, 1.4663015063687075, 0.05162567455757862], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=407bb87b-c009-44d4-8f74-23a220701734", 1, 0, 0.0, 177.0, 177, 177, 177.0, 177.0, 177.0, 177.0, 5.649717514124294, 1.020700918079096, 3.895215395480226], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 142.94444444444443, 79, 729, 81.0, 287.1000000000007, 729.0, 729.0, 0.08838563635203017, 4.4408075945971826, 0.05153910696135093], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/16093c5c-ec11-45d4-82af-28a20e2b2353", 1, 0, 0.0, 191.0, 191, 191, 191.0, 191.0, 191.0, 191.0, 5.235602094240838, 1.6719159031413613, 3.1239774214659684], "isController": false}, {"data": ["goToProfile", 17, 5, 29.41176470588235, 419.52941176470586, 79, 3522, 212.0, 1196.3999999999978, 3522.0, 3522.0, 0.09262790824388384, 0.13273225937176483, 0.059855890385767996], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 100.16666666666667, 79, 238, 82.5, 235.3, 238.0, 238.0, 0.09249647999506685, 0.06874005984008386, 0.04642889718502379], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f5fd88b4-7cc4-4320-9b9e-21fed36ce9e4", 1, 0, 0.0, 195.0, 195, 195, 195.0, 195.0, 195.0, 195.0, 5.128205128205129, 0.9264823717948718, 3.535657051282051], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ccf8c992-d28f-440c-94dd-88c707d34eff", 3, 0, 0.0, 520.3333333333333, 215, 1072, 274.0, 1072.0, 1072.0, 1072.0, 0.03354954148959964, 0.02796887231603668, 0.02151451716618206], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 98.77777777777779, 77, 245, 81.5, 236.9, 245.0, 245.0, 0.09250075799232244, 0.032469612858633146, 0.05232274863432909], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 549.625, 385, 710, 554.0, 710.0, 710.0, 710.0, 0.06590328692643546, 19.377754551445754, 0.03758546832523272], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 878.25, 701, 944, 897.5, 944.0, 944.0, 944.0, 0.0657797365521551, 59.18872257807233, 0.03745076797842425], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 142.125, 80, 245, 84.5, 245.0, 245.0, 245.0, 0.06620160042369025, 0.11714580074973312, 0.03665655023460192], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 9, 0, 0.0, 83.88888888888889, 81, 101, 82.0, 101.0, 101.0, 101.0, 0.04307601001277922, 0.03201254259738768, 0.02162213783844582], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 9, 0, 0.0, 104.55555555555556, 79, 250, 86.0, 250.0, 250.0, 250.0, 0.043076628535873254, 0.011526363494950462, 0.024567139711865218], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 9, 0, 0.0, 117.55555555555556, 77, 246, 83.0, 246.0, 246.0, 246.0, 0.043076216185170296, 0.011610386393659182, 0.02532410365573488], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 9, 0, 0.0, 85.44444444444444, 81, 94, 84.0, 94.0, 94.0, 94.0, 0.04307601001277922, 0.011610330823756898, 0.025366048864947137], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a91e46e7-5006-4075-95be-35fe1c41cc0c", 1, 0, 0.0, 888.0, 888, 888, 888.0, 888.0, 888.0, 888.0, 1.1261261261261262, 0.20345052083333334, 0.7764111768018018], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 104.25, 79, 238, 83.0, 238.0, 238.0, 238.0, 0.06611460967587313, 0.049134001917323686, 0.03712490289416704], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 124.0, 79, 699, 81.0, 290.40000000000066, 699.0, 699.0, 0.09249885661135578, 4.6474703570070455, 0.053937592820033194], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 591.4375000000001, 80, 978, 766.0, 953.5, 978.0, 978.0, 0.09895417803093555, 55.65946630069082, 0.05285931189738452], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 147.05555555555554, 79, 639, 82.0, 278.1000000000006, 639.0, 639.0, 0.09249743062692703, 1.5345078847636178, 0.05402709082733813], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 431.25, 78, 637, 542.5, 634.2, 637.0, 637.0, 0.0988594095621764, 18.177460170470695, 0.05290523089850846], "isController": false}, {"data": ["deleteBooks", 17, 5, 29.41176470588235, 378.9411764705882, 85, 1046, 407.0, 919.5999999999999, 1046.0, 1046.0, 0.09380448937250314, 0.020099422412651467, 0.06270696477641424], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 9, 0, 0.0, 205.77777777777777, 163, 333, 170.0, 333.0, 333.0, 333.0, 0.04305911059014903, 0.06673321143219386, 0.09684094891514963], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3e2c8cb2-10c6-4361-97ae-b13efab43331", 1, 0, 0.0, 426.0, 426, 426, 426.0, 426.0, 426.0, 426.0, 2.347417840375587, 0.42409404342723006, 1.6184345657276995], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 25, 0, 0.0, 860.84, 151, 2193, 806.0, 1914.4000000000005, 2153.7, 2193.0, 0.1084095452436396, 0.06659141011547785, 0.04901720649199721], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 103.8125, 80, 258, 82.5, 244.70000000000002, 258.0, 258.0, 0.09895111814763506, 0.07353691495151396, 0.04966882297644964], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 140.8125, 79, 251, 81.0, 248.2, 251.0, 251.0, 0.09885818792941525, 0.11925251624981463, 0.05119097084919183], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=09e24b27-c9fe-4b6b-8e14-44b850f266bf", 1, 0, 0.0, 468.0, 468, 468, 468.0, 468.0, 468.0, 468.0, 2.136752136752137, 0.38603432158119655, 1.473190438034188], "isController": false}, {"data": ["login", 25, 0, 0.0, 3157.520000000001, 1604, 6129, 3052.0, 4600.4000000000015, 5759.699999999999, 6129.0, 0.10563856399161652, 40.58424827333767, 0.21544077294680886], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 90.11111111111111, 82, 121, 87.0, 105.70000000000002, 121.0, 121.0, 0.08854694463848249, 0.07168497764189648, 0.03147567172696058], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/98169609-0ae2-4dc0-8434-19d2d3fe961c", 1, 0, 0.0, 277.0, 277, 277, 277.0, 277.0, 277.0, 277.0, 3.6101083032490977, 1.1528373194945847, 2.1540782942238264], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dc10c761-5f1c-475a-b59b-5a0161a27b32", 1, 0, 0.0, 382.0, 382, 382, 382.0, 382.0, 382.0, 382.0, 2.617801047120419, 0.8359579515706806, 1.5619887107329842], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 706.5000000000001, 163, 1061, 852.0, 1038.6, 1061.0, 1061.0, 0.09880568626724467, 73.9361430621426, 0.20641607846406562], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c8298434-7280-47c3-9b20-b8265c88ff2c", 1, 0, 0.0, 196.0, 196, 196, 196.0, 196.0, 196.0, 196.0, 5.1020408163265305, 0.9217554209183673, 3.5176179846938775], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 298.38888888888886, 162, 814, 320.5, 511.6000000000005, 814.0, 814.0, 0.08834962893155848, 6.001366159822025, 0.19744454833706365], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 16, 8, 50.0, 532.4375, 79, 1183, 435.5, 1073.8000000000002, 1183.0, 1183.0, 0.12036410140675544, 72.01475870759046, 0.17532283203565785], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d64842c1-9b3b-4bac-941b-180faeab9509", 3, 0, 0.0, 472.33333333333337, 296, 792, 329.0, 792.0, 792.0, 792.0, 0.02455936407619952, 0.02463131533814151, 0.01574933178063576], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fe658520-6b4b-4b0b-894d-4b07d09a8cf2", 3, 0, 0.0, 343.3333333333333, 230, 489, 311.0, 489.0, 489.0, 489.0, 0.02075535661161885, 0.024532128859631522, 0.013309912931279014], "isController": false}, {"data": ["register", 25, 8, 32.0, 1276.84, 230, 3135, 1168.0, 2086.800000000001, 2909.0999999999995, 3135.0, 0.10581876208979357, 0.03311796569779008, 0.04774244930223109], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 253.0, 162, 938, 170.0, 526.7000000000006, 938.0, 938.0, 0.09245609619543163, 6.2803080633914945, 0.20662171845064128], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 100.53846153846153, 82, 241, 87.0, 187.39999999999995, 241.0, 241.0, 0.06733623051781562, 0.05227763990396817, 0.02393592569187977], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 264.05555555555554, 161, 824, 166.0, 801.5, 824.0, 824.0, 0.10853965918547016, 14.577432117488152, 0.2410225830328393], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 5, 0, 0.0, 116.4, 81, 245, 83.0, 245.0, 245.0, 245.0, 0.06954780020307959, 0.05168542573685894, 0.034909735648811425], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 5, 0, 0.0, 112.0, 80, 237, 81.0, 237.0, 237.0, 237.0, 0.06939914222660208, 0.01856969235360251, 0.039579198301109], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a91e46e7-5006-4075-95be-35fe1c41cc0c", 3, 0, 0.0, 1629.6666666666667, 227, 3522, 1140.0, 3522.0, 3522.0, 3522.0, 0.03231017770597738, 0.026262537022078623, 0.020719742864835758], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 5, 0, 0.0, 81.6, 79, 86, 81.0, 86.0, 86.0, 86.0, 0.0695497350155096, 0.018745827015899066, 0.040887637186852316], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 5, 0, 0.0, 112.0, 79, 237, 81.0, 237.0, 237.0, 237.0, 0.06939914222660208, 0.018705237553263844, 0.04086687769789166], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, 100.0, 100.4, 85, 144, 91.0, 144.0, 144.0, 144.0, 0.06883165154664721, 0.020299959733483842, 0.042549253348659846], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 944.3392857142859, 631, 1829, 863.5, 1282.9, 1342.8999999999999, 1829.0, 0.2595921621709322, 310.5624747940646, 0.5125931170992429], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 8, 32.0, 1276.84, 230, 3135, 1168.0, 2086.800000000001, 2909.0999999999995, 3135.0, 0.10649854096998872, 0.033330715244201156, 0.048049146414194124], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 12, 0, 0.0, 131.16666666666669, 79, 283, 85.0, 269.50000000000006, 283.0, 283.0, 0.07526389402843721, 0.020285971437352217, 0.044320437596823865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 12, 0, 0.0, 114.16666666666667, 78, 247, 82.5, 244.0, 247.0, 247.0, 0.07526436608587664, 0.02028609867158394, 0.04424721521845482], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7fd86843-f667-4cee-ba63-5f375a02b650", 1, 0, 0.0, 518.0, 518, 518, 518.0, 518.0, 518.0, 518.0, 1.9305019305019306, 0.3487723214285714, 1.3309905888030888], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 197.76923076923077, 79, 902, 82.0, 849.5999999999999, 902.0, 902.0, 0.06601296900945001, 9.15329917267977, 0.03793563798995587], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 178.61538461538464, 81, 645, 82.0, 573.4, 645.0, 645.0, 0.06615944426066821, 3.0078691569760045, 0.03808442167739637], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/407bb87b-c009-44d4-8f74-23a220701734", 3, 0, 0.0, 394.66666666666663, 169, 800, 215.0, 800.0, 800.0, 800.0, 0.0892803999761919, 0.04039705597881079, 0.0572533814951491], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 83.3076923076923, 79, 92, 82.0, 90.4, 92.0, 92.0, 0.06628865138288324, 0.04926334345934976, 0.03327379571367382], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 12, 0, 0.0, 99.75, 78, 236, 82.5, 206.30000000000013, 236.0, 236.0, 0.07526436608587664, 0.020139097956572462, 0.04292420878335153], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 104.6923076923077, 79, 237, 81.0, 236.2, 237.0, 237.0, 0.06623663803205854, 0.03302875625426717, 0.03691976068193167], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 12, 0, 0.0, 112.25, 80, 248, 83.0, 244.4, 248.0, 248.0, 0.07518561448576172, 0.05587524670279753, 0.03773965414617337], "isController": false}, {"data": ["deleteAccount", 15, 3, 20.0, 850.8666666666667, 79, 2765, 792.0, 2155.4000000000005, 2765.0, 2765.0, 0.09406334852978987, 0.018628952228360727, 0.06400716919488043], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 12, 0, 0.0, 107.58333333333334, 83, 242, 88.0, 217.4000000000001, 242.0, 242.0, 0.07117944337675279, 0.05602600718912378, 0.025302067762830095], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 25, 0, 0.0, 1612.0, 1045, 2612, 1467.0, 2464.8, 2594.3, 2612.0, 0.1074201545990865, 0.05559832220460532, 0.04940907501579076], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 12, 0, 0.0, 258.4166666666667, 161, 496, 189.5, 489.40000000000003, 496.0, 496.0, 0.07514653574470218, 0.11646245334652573, 0.1690063201367667], "isController": false}, {"data": ["addBook", 53, 12, 22.641509433962263, 930.1509433962267, 414, 2179, 776.0, 1545.4, 1813.2999999999993, 2179.0, 0.2466940667749638, 90.15123120848673, 0.8920386908225152], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/c387ad75-66b6-46fa-b0a5-28cd0d772712", 1, 0, 0.0, 456.0, 456, 456, 456.0, 456.0, 456.0, 456.0, 2.1929824561403506, 0.7002981085526315, 1.308508086622807], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 147.87499999999997, 79, 821, 84.0, 328.8, 336.45, 821.0, 0.26025812028572626, 0.19341448197015398, 0.12580836869280712], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 515.2857142857143, 388, 774, 472.5, 652.0, 714.65, 774.0, 0.26012393047258947, 76.48507248632026, 0.13082404706385112], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fc8d44e9-052b-4c10-ae39-91299121dc4e", 1, 0, 0.0, 407.0, 407, 407, 407.0, 407.0, 407.0, 407.0, 2.457002457002457, 0.44389204545454547, 1.6939880221130221], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 121.37500000000003, 79, 267, 83.0, 244.60000000000002, 257.15, 267.0, 0.2605935949817119, 0.4611285098699824, 0.12673399443446537], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 793.6428571428571, 546, 1198, 778.5, 986.7000000000002, 1094.1499999999999, 1198.0, 0.2600236807280663, 233.96976499199033, 0.13051969911545516], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 125.0, 83, 261, 88.0, 243.90000000000003, 261.0, 261.0, 0.1079427903211298, 0.08064085409732842, 0.03837028874696411], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 162, 12, 7.407407407407407, 162.3950617283951, 81, 1815, 90.0, 300.7000000000004, 427.85, 1490.5500000000025, 0.6878163105872762, 1.6468027753069698, 0.32532872285885334], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 5, 0, 0.0, 83.6, 81, 86, 83.0, 86.0, 86.0, 86.0, 0.05915899571688871, 0.04581355820653588, 0.021029174258737782], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f5fd88b4-7cc4-4320-9b9e-21fed36ce9e4", 3, 0, 0.0, 420.6666666666667, 186, 615, 461.0, 615.0, 615.0, 615.0, 0.0708181861101931, 0.03204338499126576, 0.04541400606675794], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8ea3325f-2bcd-48a6-b6c0-4b7dccd9b770", 1, 0, 0.0, 534.0, 534, 534, 534.0, 534.0, 534.0, 534.0, 1.8726591760299625, 0.33832221441947563, 1.2911107209737827], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 92.05555555555556, 83, 142, 86.0, 107.80000000000005, 142.0, 142.0, 0.08757930792884669, 0.07107266102428866, 0.031131707115332218], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fc8d44e9-052b-4c10-ae39-91299121dc4e", 3, 0, 0.0, 332.33333333333337, 171, 621, 205.0, 621.0, 621.0, 621.0, 0.035689218287155454, 0.02975263282337406, 0.022886640633364663], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ccf8c992-d28f-440c-94dd-88c707d34eff", 1, 0, 0.0, 619.0, 619, 619, 619.0, 619.0, 619.0, 619.0, 1.6155088852988693, 0.29186439822294025, 1.113817649434572], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 5, 0, 0.0, 231.0, 163, 483, 168.0, 483.0, 483.0, 483.0, 0.06931832360566192, 0.10742986285369674, 0.15589853443734317], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9ffbb4b1-f365-469b-9609-efc10c26c997", 1, 0, 0.0, 3523.0, 3523, 3523, 3523.0, 3523.0, 3523.0, 3523.0, 0.2838489923360772, 0.09064318407607153, 0.16936692804428044], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 306.2307692307692, 162, 982, 170.0, 929.5999999999999, 982.0, 982.0, 0.06598515841513801, 12.231329570804613, 0.145804795281046], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7fd86843-f667-4cee-ba63-5f375a02b650", 3, 0, 0.0, 643.0, 212, 1051, 666.0, 1051.0, 1051.0, 1051.0, 0.024017484728882627, 0.024087848453674274, 0.015401837537727465], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3e2c8cb2-10c6-4361-97ae-b13efab43331", 3, 0, 0.0, 1152.3333333333335, 208, 2765, 484.0, 2765.0, 2765.0, 2765.0, 0.029302311952413045, 0.024141976416522597, 0.018790870620525292], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fe658520-6b4b-4b0b-894d-4b07d09a8cf2", 1, 0, 0.0, 1046.0, 1046, 1046, 1046.0, 1046.0, 1046.0, 1046.0, 0.9560229445506692, 0.17271898900573612, 0.6591330066921606], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 9, 0, 0.0, 108.77777777777777, 81, 252, 90.0, 252.0, 252.0, 252.0, 0.04509560267767667, 0.03738883464194091, 0.01603007751433038], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 99.62500000000003, 84, 246, 88.0, 146.6000000000001, 246.0, 246.0, 0.09746588693957114, 0.07566931652046784, 0.03464607699805068], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c8298434-7280-47c3-9b20-b8265c88ff2c", 3, 0, 0.0, 734.6666666666666, 358, 1005, 841.0, 1005.0, 1005.0, 1005.0, 0.05959830740806961, 0.02696668206289608, 0.038218966664680054], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d64842c1-9b3b-4bac-941b-180faeab9509", 1, 0, 0.0, 466.0, 466, 466, 466.0, 466.0, 466.0, 466.0, 2.1459227467811157, 0.3876911212446352, 1.4795131437768239], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/09e24b27-c9fe-4b6b-8e14-44b850f266bf", 3, 0, 0.0, 402.33333333333337, 189, 737, 281.0, 737.0, 737.0, 737.0, 0.04948290365678658, 0.031812739167367675, 0.03173220058719712], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 83.22222222222221, 80, 96, 82.5, 89.70000000000002, 96.0, 96.0, 0.10902813531603016, 0.0810257919682607, 0.0547270132348042], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 108.33333333333331, 79, 265, 81.0, 240.70000000000005, 265.0, 265.0, 0.10890675766431307, 0.0473158265720388, 0.06109461123312702], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 179.11111111111111, 78, 742, 81.0, 720.4000000000001, 742.0, 742.0, 0.10859400923049078, 10.883026247322857, 0.06280447799463063], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 155.0, 79, 716, 80.0, 639.5000000000001, 716.0, 716.0, 0.10861104574335209, 3.5743829157842018, 0.06292039640014722], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 21.05263157894737, 0.6182380216383307], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 5, 13.157894736842104, 0.38639876352395675], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 7.894736842105263, 0.23183925811437403], "isController": false}, {"data": ["401/Unauthorized", 22, 57.89473684210526, 1.7001545595054095], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1294, 38, "401/Unauthorized", 22, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 16, 8, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 162, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
