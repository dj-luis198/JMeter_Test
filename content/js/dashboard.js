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

    var data = {"OkPercent": 97.42836149889787, "KoPercent": 2.571638501102131};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7906171284634761, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3275862068965517, 500, 1500, "see books"], "isController": true}, {"data": [0.6, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/fed0592f-ca34-4b8f-8b8c-d2516324053c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2777a8e6-e278-465a-961e-db637608dbc9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2180c04d-ecc2-4207-bb0d-e8304241dd2a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b29a9770-b513-44e9-a9dc-4a545c34f3e8"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.041666666666666664, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b76b0be9-cda0-4676-955a-2550e7168257"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=22e835ec-77fa-4d71-a911-dbc8157dcfdd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=aeffcf5e-9029-4882-8cb5-4cf38bf422a5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5bc22622-93ba-43d9-80da-61857d22827c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/a67f0b89-15d5-40e3-aa52-db9abefe1a56"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/065ee76c-dbb4-4bb2-9e99-ba4cb5e5b4d9"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2692307692307692, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d3c04cbe-f23e-437a-9b04-dce27ef3f1a7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e4476802-5e3a-4213-b2bb-084bb2cff5f2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/50c94b6c-837a-4ea3-8d1a-5d75ac00d5f0"], "isController": false}, {"data": [0.24, 500, 1500, "register"], "isController": true}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d3c04cbe-f23e-437a-9b04-dce27ef3f1a7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ece719c8-9f13-408f-87a4-01b94999e5c2"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.49137931034482757, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.24, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5cea6954-446d-4cd6-ac6a-92f7d5935a13"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/784d985c-a494-41eb-9d32-ef85ab9862fc"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/2180c04d-ecc2-4207-bb0d-e8304241dd2a"], "isController": false}, {"data": [0.325, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fed0592f-ca34-4b8f-8b8c-d2516324053c"], "isController": false}, {"data": [0.6810344827586207, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/2777a8e6-e278-465a-961e-db637608dbc9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.901685393258427, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/aeffcf5e-9029-4882-8cb5-4cf38bf422a5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b76b0be9-cda0-4676-955a-2550e7168257"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5cea6954-446d-4cd6-ac6a-92f7d5935a13"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5bc22622-93ba-43d9-80da-61857d22827c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=784d985c-a494-41eb-9d32-ef85ab9862fc"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/22e835ec-77fa-4d71-a911-dbc8157dcfdd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b9786cc1-2b03-4a2e-a5e9-e0574f6b54e6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e4476802-5e3a-4213-b2bb-084bb2cff5f2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a67f0b89-15d5-40e3-aa52-db9abefe1a56"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1361, 35, 2.571638501102131, 329.2476120499633, 82, 3944, 100.0, 903.7999999999997, 1102.199999999999, 1736.5799999999952, 5.339013635864363, 754.3545671049483, 3.8998600274207975], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 1425.1551724137933, 1059, 1897, 1388.5, 1742.8, 1804.05, 1897.0, 0.25709333817969054, 309.3708089006933, 1.2641259352878338], "isController": true}, {"data": ["deleteBook", 15, 3, 20.0, 539.1999999999999, 90, 1223, 481.0, 1167.8, 1223.0, 1223.0, 0.09946487895124231, 0.020242657005311426, 0.06665312493783446], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, 20.0, 539.1999999999999, 90, 1223, 481.0, 1167.8, 1223.0, 1223.0, 0.09824405132269241, 0.01999419950746982, 0.06583502736096829], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 116.64705882352942, 84, 257, 87.0, 256.2, 257.0, 257.0, 0.08220025917258186, 0.02925739923215287, 0.04647374487457207], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 98.64705882352942, 84, 264, 88.0, 127.99999999999989, 264.0, 264.0, 0.08219747702097004, 0.061086210950154485, 0.0412592804577916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 150.0, 83, 500, 87.0, 309.59999999999985, 500.0, 500.0, 0.08220025917258186, 1.4425937717588921, 0.047989501032338545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 182.58823529411765, 84, 692, 89.0, 353.5999999999997, 692.0, 692.0, 0.08220025917258186, 4.371672136106706, 0.04790922734174032], "isController": false}, {"data": ["goToProfile", 15, 3, 20.0, 214.0, 88, 347, 212.0, 343.4, 347.0, 347.0, 0.09931801628815468, 0.15504214808316227, 0.06418814763623121], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/fed0592f-ca34-4b8f-8b8c-d2516324053c", 3, 0, 0.0, 910.6666666666666, 186, 2100, 446.0, 2100.0, 2100.0, 2100.0, 0.029238911142949037, 0.02437527716051188, 0.018750213200393752], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2777a8e6-e278-465a-961e-db637608dbc9", 1, 0, 0.0, 468.0, 468, 468, 468.0, 468.0, 468.0, 468.0, 2.136752136752137, 0.38603432158119655, 1.473190438034188], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 97.625, 83, 251, 88.0, 138.30000000000013, 251.0, 251.0, 0.07801795388163701, 0.05798013955461501, 0.03916135575699358], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 127.87500000000001, 82, 255, 87.0, 252.9, 255.0, 255.0, 0.07795599384147649, 0.028177209199781724, 0.04405008489894954], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 510.7142857142857, 416, 595, 500.0, 595.0, 595.0, 595.0, 0.0703694395576778, 20.69095171525509, 0.04013257099773813], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 880.0, 659, 1091, 847.0, 1091.0, 1091.0, 1091.0, 0.0699720111955218, 62.96093867140643, 0.03983758059276289], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 214.57142857142858, 85, 301, 254.0, 301.0, 301.0, 301.0, 0.07056238218602259, 0.1248623403526103, 0.03907116279245587], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 106.0, 84, 254, 86.0, 254.0, 254.0, 254.0, 0.09627200806419643, 0.071545896618021, 0.0483240352978486], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 154.4705882352941, 83, 261, 89.0, 256.2, 261.0, 261.0, 0.09618159084351255, 0.025736089737424257, 0.054853563527940755], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2180c04d-ecc2-4207-bb0d-e8304241dd2a", 1, 0, 0.0, 184.0, 184, 184, 184.0, 184.0, 184.0, 184.0, 5.434782608695652, 0.9818699048913043, 3.7470278532608696], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 125.764705882353, 83, 261, 86.0, 259.4, 261.0, 261.0, 0.09627309846472723, 0.025948608570571016, 0.056598052027115035], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 116.11764705882354, 83, 262, 86.0, 260.4, 262.0, 262.0, 0.09627255326137432, 0.0259484616212298, 0.05669174767246945], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 87.28571428571429, 84, 93, 87.0, 93.0, 93.0, 93.0, 0.07068136839129205, 0.052527852876731694, 0.03968924494628216], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 21, 0, 0.0, 492.9523809523809, 83, 1020, 260.0, 957.2, 1014.3999999999999, 1020.0, 0.118428621378058, 50.76066377479952, 0.06477666688284589], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 193.62500000000003, 83, 1036, 88.5, 551.6000000000005, 1036.0, 1036.0, 0.07801947561159954, 4.407343225044739, 0.045447868361639776], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 21, 0, 0.0, 401.2857142857143, 83, 762, 259.0, 741.6, 760.5, 762.0, 0.11842928925507977, 16.59869318918797, 0.06489268579299688], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 153.1875, 85, 409, 87.5, 364.90000000000003, 409.0, 409.0, 0.07795637366438807, 1.4523085896961163, 0.04548723951608581], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b29a9770-b513-44e9-a9dc-4a545c34f3e8", 1, 0, 0.0, 486.0, 486, 486, 486.0, 486.0, 486.0, 486.0, 2.05761316872428, 0.6570698302469136, 1.227735982510288], "isController": false}, {"data": ["deleteBooks", 15, 3, 20.0, 348.79999999999995, 90, 749, 442.0, 656.6, 749.0, 749.0, 0.09849305623953512, 0.02004487589874914, 0.06650204988673299], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 264.2352941176471, 170, 516, 180.0, 514.4, 516.0, 516.0, 0.09613481494048123, 0.14899018682670284, 0.21620945196086747], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 718.4583333333334, 109, 1700, 563.5, 1534.0, 1689.5, 1700.0, 0.10215852449037795, 0.06275167178168724, 0.04619081722562987], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 21, 0, 0.0, 103.23809523809524, 83, 263, 87.0, 219.6000000000001, 261.9, 263.0, 0.11842728564661298, 0.08801090271198483, 0.059444946115585026], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 21, 0, 0.0, 178.23809523809524, 83, 339, 250.0, 260.6, 331.1999999999999, 339.0, 0.1184279535085691, 0.11639027015671966, 0.06280470525538143], "isController": false}, {"data": ["login", 24, 0, 0.0, 3124.9583333333335, 1448, 5478, 2904.0, 5192.5, 5406.75, 5478.0, 0.10233319688907082, 35.84657852020867, 0.20389189936809252], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/b76b0be9-cda0-4676-955a-2550e7168257", 3, 0, 0.0, 383.6666666666667, 182, 531, 438.0, 531.0, 531.0, 531.0, 0.06680919294494922, 0.030229419984856582, 0.042843134798681626], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 91.18750000000001, 85, 102, 91.0, 97.10000000000001, 102.0, 102.0, 0.08060534614958337, 0.06525569527148889, 0.028652681639109716], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=22e835ec-77fa-4d71-a911-dbc8157dcfdd", 1, 0, 0.0, 442.0, 442, 442, 442.0, 442.0, 442.0, 442.0, 2.2624434389140275, 0.40874222285067874, 1.5598486990950227], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=aeffcf5e-9029-4882-8cb5-4cf38bf422a5", 1, 0, 0.0, 488.0, 488, 488, 488.0, 488.0, 488.0, 488.0, 2.0491803278688527, 0.3702132428278689, 1.412813780737705], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5bc22622-93ba-43d9-80da-61857d22827c", 3, 0, 0.0, 401.6666666666667, 347, 443, 415.0, 443.0, 443.0, 443.0, 0.08244023083264633, 0.037302057570761195, 0.05286694490244573], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a67f0b89-15d5-40e3-aa52-db9abefe1a56", 3, 0, 0.0, 1635.6666666666667, 285, 3248, 1374.0, 3248.0, 3248.0, 3248.0, 0.019982149279976553, 0.027547005924707265, 0.0128140735942558], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 21, 0, 0.0, 613.952380952381, 173, 1108, 523.0, 1046.2, 1102.5, 1108.0, 0.11836787608574344, 67.52901091837971, 0.2517904462328014], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/065ee76c-dbb4-4bb2-9e99-ba4cb5e5b4d9", 1, 0, 0.0, 187.0, 187, 187, 187.0, 187.0, 187.0, 187.0, 5.347593582887701, 1.7076788101604279, 3.1908004679144386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 292.7058823529412, 171, 785, 184.0, 578.5999999999998, 785.0, 785.0, 0.0821633116647737, 5.901957571107513, 0.1835506104854885], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 6, 46.15384615384615, 562.2307692307692, 88, 1184, 746.0, 1148.3999999999999, 1184.0, 1184.0, 0.12402923273608488, 79.91336140687314, 0.18852219765489345], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d3c04cbe-f23e-437a-9b04-dce27ef3f1a7", 1, 0, 0.0, 183.0, 183, 183, 183.0, 183.0, 183.0, 183.0, 5.46448087431694, 0.9872353142076503, 3.7675034153005464], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e4476802-5e3a-4213-b2bb-084bb2cff5f2", 1, 0, 0.0, 486.0, 486, 486, 486.0, 486.0, 486.0, 486.0, 2.05761316872428, 0.37173675411522633, 1.418627829218107], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/50c94b6c-837a-4ea3-8d1a-5d75ac00d5f0", 1, 0, 0.0, 190.0, 190, 190, 190.0, 190.0, 190.0, 190.0, 5.263157894736842, 1.6807154605263157, 3.1404194078947367], "isController": false}, {"data": ["register", 25, 8, 32.0, 1099.68, 100, 2102, 1086.0, 1948.4000000000003, 2081.3, 2102.0, 0.1058398177861697, 0.0331245554727653, 0.04775194904024453], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 333.8125, 174, 1119, 336.0, 687.1000000000005, 1119.0, 1119.0, 0.07792258391288255, 5.939623276267216, 0.17400364105448737], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 89.69230769230771, 85, 97, 89.0, 95.8, 97.0, 97.0, 0.07019590055940733, 0.05449779389133674, 0.024952449026976825], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d3c04cbe-f23e-437a-9b04-dce27ef3f1a7", 3, 0, 0.0, 338.6666666666667, 206, 545, 265.0, 545.0, 545.0, 545.0, 0.07914314356566243, 0.03581021144409856, 0.05075260183084472], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ece719c8-9f13-408f-87a4-01b94999e5c2", 1, 0, 0.0, 375.0, 375, 375, 375.0, 375.0, 375.0, 375.0, 2.6666666666666665, 0.8515625, 1.5911458333333333], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 414.1333333333333, 174, 1216, 198.0, 1141.6000000000001, 1216.0, 1216.0, 0.13636859522164443, 32.79792560638569, 0.29971793008382125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 88.45454545454544, 85, 99, 86.0, 97.60000000000001, 99.0, 99.0, 0.053870075173241265, 0.040034303912926374, 0.02704025257719337], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 100.81818181818183, 82, 256, 86.0, 222.20000000000013, 256.0, 256.0, 0.05387271347062713, 0.01441515965913265, 0.030724281901217034], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 116.18181818181819, 83, 251, 88.0, 250.8, 251.0, 251.0, 0.05382763412867741, 0.014508229511245082, 0.03164476147017949], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 101.90909090909092, 83, 258, 87.0, 224.40000000000012, 258.0, 258.0, 0.05382631715444728, 0.014507874545534618, 0.03169655199622237], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 92.0, 90, 95, 91.0, 95.0, 95.0, 95.0, 0.06939464735953366, 0.020465999514237467, 0.04289727712752423], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 967.3793103448273, 667, 1541, 911.0, 1391.4, 1419.0, 1541.0, 0.25579846609126716, 306.0238953806325, 0.5051020492544357], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 8, 32.0, 1099.68, 100, 2102, 1086.0, 1948.4000000000003, 2081.3, 2102.0, 0.10710537026326501, 0.03352063384958122, 0.04832293072424652], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 139.5, 84, 340, 86.0, 340.0, 340.0, 340.0, 0.0386484632404804, 0.010416968607785734, 0.02275881184961883], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 128.25, 85, 254, 87.5, 254.0, 254.0, 254.0, 0.038650330460325434, 0.010417471881884589, 0.022722166930777256], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 98.61538461538463, 83, 253, 86.0, 187.79999999999995, 253.0, 253.0, 0.0724807368503217, 0.01953582360418827, 0.04261074568739616], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 111.92307692307693, 84, 260, 86.0, 257.2, 260.0, 260.0, 0.07248114096466823, 0.019535932525633234, 0.04268176562665522], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 107.0, 83, 260, 85.5, 260.0, 260.0, 260.0, 0.03868172675228222, 0.010350383916138016, 0.022060672288410955], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 87.38461538461539, 83, 90, 87.0, 89.6, 90.0, 90.0, 0.0724799286351472, 0.05386447821420606, 0.03638152667818911], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 107.375, 85, 258, 86.0, 258.0, 258.0, 258.0, 0.03868097862875931, 0.028746313219224447, 0.01941603810076395], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 111.61538461538461, 83, 255, 87.0, 252.2, 255.0, 255.0, 0.0724807368503217, 0.019394259665027485, 0.041336670234949094], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 110.625, 87, 261, 89.5, 261.0, 261.0, 261.0, 0.03987022242600336, 0.03138222585484249, 0.014172618127993381], "isController": false}, {"data": ["deleteAccount", 15, 3, 20.0, 524.0, 88, 1870, 415.0, 1572.4, 1870.0, 1870.0, 0.10083898031623104, 0.01997084492981607, 0.06861777488706033], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/5cea6954-446d-4cd6-ac6a-92f7d5935a13", 3, 0, 0.0, 395.3333333333333, 198, 554, 434.0, 554.0, 554.0, 554.0, 0.034326513799258544, 0.022068640870291548, 0.022012770893404733], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1485.6249999999998, 979, 3944, 1423.5, 1802.0, 3417.25, 3944.0, 0.10274588374303255, 0.05317902185918676, 0.04725909301071125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 270.375, 170, 519, 175.5, 519.0, 519.0, 519.0, 0.03863203948194435, 0.059872115876802426, 0.0868843622333182], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/784d985c-a494-41eb-9d32-ef85ab9862fc", 3, 0, 0.0, 333.0, 219, 403, 377.0, 403.0, 403.0, 403.0, 0.05602554764972827, 0.03601902884381945, 0.03592784142902497], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2180c04d-ecc2-4207-bb0d-e8304241dd2a", 3, 0, 0.0, 762.3333333333334, 192, 1870, 225.0, 1870.0, 1870.0, 1870.0, 0.10879025239338555, 0.050499641898752536, 0.06976458242674789], "isController": false}, {"data": ["addBook", 60, 15, 25.0, 934.5333333333335, 438, 3715, 719.0, 1504.4, 1622.1499999999999, 3715.0, 0.2809633296027647, 85.17177889444443, 1.020431009454416], "isController": true}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 141.9137931034483, 83, 361, 88.5, 349.2, 357.0, 361.0, 0.25674281894762, 0.19080203634681528, 0.12410907751862492], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fed0592f-ca34-4b8f-8b8c-d2516324053c", 1, 0, 0.0, 491.0, 491, 491, 491.0, 491.0, 491.0, 491.0, 2.0366598778004072, 0.3679512474541752, 1.404181517311609], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 543.706896551724, 406, 783, 508.0, 700.9, 749.1999999999999, 783.0, 0.25669395884045143, 75.47654694069485, 0.1290990125027661], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2777a8e6-e278-465a-961e-db637608dbc9", 3, 0, 0.0, 1472.0, 341, 3629, 446.0, 3629.0, 3629.0, 3629.0, 0.032452079096534116, 0.027053963074942667, 0.020810740826878976], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 114.91379310344828, 84, 270, 89.0, 256.1, 263.05, 270.0, 0.2570808031558885, 0.45491251495944324, 0.12502562497229733], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 823.8793103448274, 581, 1181, 822.5, 1055.5, 1088.3, 1181.0, 0.2562301476857558, 230.55633729219954, 0.12861552335007664], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 93.60000000000001, 87, 107, 92.0, 103.4, 107.0, 107.0, 0.13930034082150056, 0.10406714914887492, 0.04951691802639277], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 15, 8.426966292134832, 167.27528089887645, 85, 2528, 93.0, 303.4, 430.49999999999983, 1826.480000000007, 0.7437025524038723, 1.6545007126279023, 0.35547343404653575], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 93.27272727272727, 86, 112, 90.0, 110.60000000000001, 112.0, 112.0, 0.05283584383645865, 0.04091682047100753, 0.018781491363741163], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aeffcf5e-9029-4882-8cb5-4cf38bf422a5", 3, 0, 0.0, 327.0, 278, 403, 300.0, 403.0, 403.0, 403.0, 0.02151586436399105, 0.025431023276579267, 0.013797608332377073], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 102.88235294117646, 87, 266, 91.0, 136.3999999999999, 266.0, 266.0, 0.0844036879446709, 0.06849557097853663, 0.030002873449082233], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b76b0be9-cda0-4676-955a-2550e7168257", 1, 0, 0.0, 201.0, 201, 201, 201.0, 201.0, 201.0, 201.0, 4.975124378109452, 0.8988261815920398, 3.4301150497512434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 207.81818181818184, 171, 345, 181.0, 344.8, 345.0, 345.0, 0.05380183317518855, 0.08338233325100022, 0.12100158379146408], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 213.92307692307693, 172, 346, 177.0, 344.0, 346.0, 346.0, 0.0724447887119874, 0.11227527313078513, 0.16293002773799506], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5cea6954-446d-4cd6-ac6a-92f7d5935a13", 1, 0, 0.0, 473.0, 473, 473, 473.0, 473.0, 473.0, 473.0, 2.1141649048625792, 0.3819536205073996, 1.457617600422833], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5bc22622-93ba-43d9-80da-61857d22827c", 1, 0, 0.0, 196.0, 196, 196, 196.0, 196.0, 196.0, 196.0, 5.1020408163265305, 0.9217554209183673, 3.5176179846938775], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=784d985c-a494-41eb-9d32-ef85ab9862fc", 1, 0, 0.0, 595.0, 595, 595, 595.0, 595.0, 595.0, 595.0, 1.680672268907563, 0.3036370798319328, 1.1587447478991597], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/22e835ec-77fa-4d71-a911-dbc8157dcfdd", 3, 0, 0.0, 849.6666666666666, 180, 1961, 408.0, 1961.0, 1961.0, 1961.0, 0.01851371866553116, 0.02552265577751447, 0.011872404222362104], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 102.23529411764707, 86, 258, 91.0, 138.7999999999999, 258.0, 258.0, 0.09300289950216095, 0.07710884929427211, 0.03305962443240878], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 21, 0, 0.0, 108.42857142857142, 87, 274, 90.0, 229.00000000000009, 271.9, 274.0, 0.11968744478704184, 0.09292140488837722, 0.04254514638914378], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b9786cc1-2b03-4a2e-a5e9-e0574f6b54e6", 1, 0, 0.0, 211.0, 211, 211, 211.0, 211.0, 211.0, 211.0, 4.739336492890995, 1.5134404620853081, 2.827865817535545], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e4476802-5e3a-4213-b2bb-084bb2cff5f2", 3, 0, 0.0, 328.0, 212, 413, 359.0, 413.0, 413.0, 413.0, 0.03523235739703343, 0.029027700706995972, 0.022593666690154904], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a67f0b89-15d5-40e3-aa52-db9abefe1a56", 1, 0, 0.0, 749.0, 749, 749, 749.0, 749.0, 749.0, 749.0, 1.335113484646195, 0.24120702603471295, 0.9204981642189586], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 110.66666666666667, 85, 262, 87.0, 255.4, 262.0, 262.0, 0.13668546851222424, 0.1015797280642604, 0.06860969806180006], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 108.2, 84, 255, 86.0, 250.2, 255.0, 255.0, 0.13668920519783484, 0.07763519701470775, 0.07565961084583281], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 289.8, 84, 1006, 88.0, 974.8000000000001, 1006.0, 1006.0, 0.13669045080510675, 24.628335460578477, 0.0780096674321332], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 229.13333333333335, 85, 671, 102.0, 666.2, 671.0, 671.0, 0.13647778141718528, 8.055227866715798, 0.0780215754312698], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 22.857142857142858, 0.5878030859662013], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 8.571428571428571, 0.2204261572373255], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 8.571428571428571, 0.2204261572373255], "isController": false}, {"data": ["401/Unauthorized", 21, 60.0, 1.5429831006612784], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1361, 35, "401/Unauthorized", 21, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 15, "401/Unauthorized", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
