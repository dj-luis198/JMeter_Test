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

    var data = {"OkPercent": 96.77902621722846, "KoPercent": 3.2209737827715355};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7845268542199488, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.36607142857142855, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/494f5d1f-9e22-4ded-ac0c-6eadbbb3424f"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/87febcd5-9b6b-464a-a548-a151cce0a9be"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1a33a977-dbc7-44ac-9171-3d2380e847e0"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fba17484-004f-4cbc-aa03-cdb0f466827b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ba3ffe48-ad1d-4326-add1-4db14553bd6b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=016f15ba-0bac-49e8-9dc4-994c172a54ce"], "isController": false}, {"data": [0.7954545454545454, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/dc535211-ffbe-46a3-9789-a7c95fcdbb86"], "isController": false}, {"data": [0.7954545454545454, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.53125, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5e54f709-34f9-4654-95e9-b352e938cfb3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fe1c2ce2-4d76-43f3-9ba3-f0669c18f6a6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ba3ffe48-ad1d-4326-add1-4db14553bd6b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/58ba2118-e84f-4bb6-a494-b9c8be18a355"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5851da12-fc42-4138-8619-31bfe35c9d21"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0ad510d8-2eba-4bc9-a731-11fbad63cb20"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/114b57ca-3c2b-4784-b487-984ada9c02d2"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/909bcf71-839f-4d3b-86e6-ddd302d82021"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.24, 500, 1500, "register"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fba17484-004f-4cbc-aa03-cdb0f466827b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/0ad510d8-2eba-4bc9-a731-11fbad63cb20"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1a33a977-dbc7-44ac-9171-3d2380e847e0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=114b57ca-3c2b-4784-b487-984ada9c02d2"], "isController": false}, {"data": [0.24, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/722558d1-f53b-42ce-896d-6a3663785b6e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.46875, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=87febcd5-9b6b-464a-a548-a151cce0a9be"], "isController": false}, {"data": [0.3541666666666667, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/016f15ba-0bac-49e8-9dc4-994c172a54ce"], "isController": false}, {"data": [0.3017241379310345, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dc535211-ffbe-46a3-9789-a7c95fcdbb86"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5e54f709-34f9-4654-95e9-b352e938cfb3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8953488372093024, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fe1c2ce2-4d76-43f3-9ba3-f0669c18f6a6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=909bcf71-839f-4d3b-86e6-ddd302d82021"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5851da12-fc42-4138-8619-31bfe35c9d21"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1335, 43, 3.2209737827715355, 312.9280898876409, 78, 3980, 93.0, 886.4000000000001, 1094.8000000000004, 1598.5200000000018, 5.197545668322614, 729.9565462917361, 3.8023021282684195], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1372.4285714285716, 1032, 1762, 1319.0, 1652.7, 1724.35, 1762.0, 0.2568642380764538, 309.09234720878015, 1.2629994518700633], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/494f5d1f-9e22-4ded-ac0c-6eadbbb3424f", 1, 0, 0.0, 341.0, 341, 341, 341.0, 341.0, 341.0, 341.0, 2.932551319648094, 0.9364690249266862, 1.7497938049853372], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/87febcd5-9b6b-464a-a548-a151cce0a9be", 3, 0, 0.0, 687.6666666666667, 175, 1685, 203.0, 1685.0, 1685.0, 1685.0, 0.047486387235659115, 0.030096352847600354, 0.030451882439534], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1a33a977-dbc7-44ac-9171-3d2380e847e0", 1, 0, 0.0, 1754.0, 1754, 1754, 1754.0, 1754.0, 1754.0, 1754.0, 0.5701254275940707, 0.10300117588369441, 0.39307475769669326], "isController": false}, {"data": ["deleteBook", 17, 5, 29.41176470588235, 537.8823529411765, 85, 1201, 480.0, 1129.8, 1201.0, 1201.0, 0.08737978854091173, 0.01872280625330887, 0.05816116784372382], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 5, 29.41176470588235, 537.8823529411765, 85, 1201, 480.0, 1129.8, 1201.0, 1201.0, 0.08828233730084543, 0.018916194745643006, 0.05876191649269853], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 93.28571428571429, 79, 244, 82.0, 164.0, 244.0, 244.0, 0.09176837661741764, 0.044245467297683506, 0.051235636610338364], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fba17484-004f-4cbc-aa03-cdb0f466827b", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 0.4221122955607477, 1.6108717873831777], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 83.5, 81, 88, 83.0, 88.0, 88.0, 88.0, 0.09176536906065036, 0.06819672446792473, 0.04606191376677176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 184.35714285714283, 81, 639, 84.0, 555.5, 639.0, 639.0, 0.09176897815242827, 3.8759334625746447, 0.05291311198437306], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 235.07142857142858, 80, 957, 82.0, 917.5, 957.0, 957.0, 0.09177018124610796, 11.817625712857657, 0.052824186359018054], "isController": false}, {"data": ["goToProfile", 17, 5, 29.41176470588235, 168.52941176470583, 81, 274, 175.0, 257.2, 274.0, 274.0, 0.08716071410260355, 0.1369096143394756, 0.05632300510915598], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ba3ffe48-ad1d-4326-add1-4db14553bd6b", 1, 0, 0.0, 271.0, 271, 271, 271.0, 271.0, 271.0, 271.0, 3.6900369003690034, 0.6666570571955719, 2.5441074723247232], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 92.26315789473685, 81, 239, 83.0, 91.0, 239.0, 239.0, 0.12457300961834765, 0.09257818390582281, 0.06252981146858466], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 9, 0, 0.0, 570.3333333333334, 399, 714, 633.0, 714.0, 714.0, 714.0, 0.046060308296996866, 13.543259985491003, 0.026268769575631026], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 100.21052631578947, 80, 246, 83.0, 243.0, 246.0, 246.0, 0.12457382638342512, 0.033333230887752426, 0.07104601035929714], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 9, 0, 0.0, 792.8888888888889, 558, 951, 786.0, 951.0, 951.0, 951.0, 0.04602756539749917, 41.41568425249955, 0.02620514709642775], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 9, 0, 0.0, 194.55555555555554, 82, 265, 244.0, 265.0, 265.0, 265.0, 0.046150532782261784, 0.08166480996236167, 0.025554054772990657], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 8, 0, 0.0, 83.25, 81, 86, 83.5, 86.0, 86.0, 86.0, 0.05124197742790894, 0.038081196115858106, 0.025721070701118353], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 8, 0, 0.0, 102.625, 80, 246, 82.0, 246.0, 246.0, 246.0, 0.05124099279423539, 0.013710968775020016, 0.02922337870296237], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 8, 0, 0.0, 81.875, 79, 85, 81.5, 85.0, 85.0, 85.0, 0.05124033639280842, 0.013810871918374143, 0.030123713387178386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 8, 0, 0.0, 82.125, 80, 85, 82.0, 85.0, 85.0, 85.0, 0.05124066459141975, 0.013810960378156104, 0.030173946043580185], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 9, 0, 0.0, 120.22222222222223, 81, 253, 85.0, 253.0, 253.0, 253.0, 0.046193643754619367, 0.03432945595436068, 0.025938813631744273], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=016f15ba-0bac-49e8-9dc4-994c172a54ce", 1, 0, 0.0, 988.0, 988, 988, 988.0, 988.0, 988.0, 988.0, 1.0121457489878543, 0.18285836285425103, 0.6978270495951417], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 22, 0, 0.0, 447.13636363636374, 81, 1123, 165.0, 1086.5, 1121.8, 1123.0, 0.09940717177559283, 36.60768384255034, 0.05494576096189994], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 91.68421052631578, 80, 246, 82.0, 98.0, 246.0, 246.0, 0.12458362839982165, 0.03357918109213943, 0.0732415471647389], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dc535211-ffbe-46a3-9789-a7c95fcdbb86", 3, 0, 0.0, 306.66666666666663, 169, 573, 178.0, 573.0, 573.0, 573.0, 0.034533566626761214, 0.028789213584353993, 0.02214554891104153], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 22, 0, 0.0, 332.77272727272725, 78, 755, 87.5, 720.1999999999999, 751.8499999999999, 755.0, 0.09940762094970426, 11.973208445919994, 0.055043086990705384], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 100.26315789473684, 80, 248, 82.0, 242.0, 248.0, 248.0, 0.12457627674292046, 0.03357719959086528, 0.07335888171482524], "isController": false}, {"data": ["deleteBooks", 16, 4, 25.0, 530.0625000000001, 88, 1754, 434.0, 1217.8000000000006, 1754.0, 1754.0, 0.08988915543520397, 0.018807374562492624, 0.06037233071343898], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/5e54f709-34f9-4654-95e9-b352e938cfb3", 3, 0, 0.0, 311.0, 233, 410, 290.0, 410.0, 410.0, 410.0, 0.05721260202914029, 0.03678219043214585, 0.036689070962697384], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 8, 0, 0.0, 187.375, 163, 333, 167.0, 333.0, 333.0, 333.0, 0.05121376626037079, 0.079371335014852, 0.11518096064222064], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 667.6249999999999, 95, 1390, 628.5, 1319.0, 1382.0, 1390.0, 0.09875242766384673, 0.06065945019585898, 0.044650755867540075], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 22, 0, 0.0, 91.63636363636364, 81, 253, 83.0, 90.5, 228.84999999999965, 253.0, 0.09940537511973829, 0.07387450240832114, 0.04989683868314988], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 22, 0, 0.0, 112.31818181818183, 80, 249, 83.0, 245.8, 248.7, 249.0, 0.09940896849639416, 0.08768005167007067, 0.05327875912755074], "isController": false}, {"data": ["login", 24, 0, 0.0, 2627.041666666667, 1555, 4910, 2478.0, 3598.0, 4654.25, 4910.0, 0.10156924483266468, 45.702279416199026, 0.2164049803844396], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 96.89473684210527, 83, 252, 87.0, 112.0, 252.0, 252.0, 0.12457545994571133, 0.10085259403808075, 0.044282683027577076], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fe1c2ce2-4d76-43f3-9ba3-f0669c18f6a6", 1, 0, 0.0, 967.0, 967, 967, 967.0, 967.0, 967.0, 967.0, 1.0341261633919339, 0.18682943381592554, 0.7129815149948294], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ba3ffe48-ad1d-4326-add1-4db14553bd6b", 3, 0, 0.0, 307.3333333333333, 227, 468, 227.0, 468.0, 468.0, 468.0, 0.07551159102922299, 0.03416702849304035, 0.04842377419517229], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/58ba2118-e84f-4bb6-a494-b9c8be18a355", 1, 0, 0.0, 322.0, 322, 322, 322.0, 322.0, 322.0, 322.0, 3.105590062111801, 0.9917265139751552, 1.8530425077639752], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 22, 0, 0.0, 541.0454545454546, 164, 1217, 252.0, 1169.8999999999999, 1214.3, 1217.0, 0.09936810916038465, 48.72323889081477, 0.21308037186256487], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5851da12-fc42-4138-8619-31bfe35c9d21", 1, 0, 0.0, 611.0, 611, 611, 611.0, 611.0, 611.0, 611.0, 1.6366612111292964, 0.2956858633387889, 1.1284011865793782], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0ad510d8-2eba-4bc9-a731-11fbad63cb20", 1, 0, 0.0, 407.0, 407, 407, 407.0, 407.0, 407.0, 407.0, 2.457002457002457, 0.44389204545454547, 1.6939880221130221], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/114b57ca-3c2b-4784-b487-984ada9c02d2", 3, 0, 0.0, 318.0, 193, 560, 201.0, 560.0, 560.0, 560.0, 0.030905850477495393, 0.030996394961316176, 0.019819181458550102], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 18, 9, 50.0, 498.27777777777794, 81, 1158, 362.0, 1050.9, 1158.0, 1158.0, 0.0882854956740107, 52.82188454893469, 0.12870178324439388], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/909bcf71-839f-4d3b-86e6-ddd302d82021", 3, 0, 0.0, 345.3333333333333, 203, 467, 366.0, 467.0, 467.0, 467.0, 0.018384042650978948, 0.025343886922817662, 0.011789246101050954], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 354.78571428571433, 164, 1038, 323.0, 999.5, 1038.0, 1038.0, 0.0917148715664245, 15.796530352709192, 0.20291659433202094], "isController": false}, {"data": ["register", 25, 9, 36.0, 1016.76, 185, 1699, 1008.0, 1569.6000000000001, 1665.3999999999999, 1699.0, 0.10663936698871755, 0.03322482777742231, 0.048112683153112804], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/fba17484-004f-4cbc-aa03-cdb0f466827b", 3, 0, 0.0, 606.3333333333334, 274, 1153, 392.0, 1153.0, 1153.0, 1153.0, 0.034357964176096024, 0.028642821046543587, 0.02203293926657199], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 203.26315789473688, 164, 488, 168.0, 334.0, 488.0, 488.0, 0.12449954459377109, 0.19294997780304174, 0.2800023937494676], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 91.2, 83, 121, 89.0, 109.0, 121.0, 121.0, 0.08690865899939164, 0.06747303115675425, 0.03089331237869], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0ad510d8-2eba-4bc9-a731-11fbad63cb20", 3, 0, 0.0, 1480.6666666666667, 209, 3980, 253.0, 3980.0, 3980.0, 3980.0, 0.03301855642871294, 0.02752621191859825, 0.0211740091681525], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 378.4736842105263, 162, 1198, 324.0, 1105.0, 1198.0, 1198.0, 0.10030143219887135, 12.770177703453536, 0.22287889690860427], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 13, 0, 0.0, 83.76923076923076, 82, 88, 83.0, 87.6, 88.0, 88.0, 0.058978046556362594, 0.04383036467714056, 0.029604214775361695], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 13, 0, 0.0, 95.38461538461539, 79, 253, 81.0, 189.39999999999995, 253.0, 253.0, 0.05897884927728225, 0.01578144990427279, 0.03363637497845003], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 13, 0, 0.0, 94.92307692307692, 80, 242, 82.0, 182.39999999999995, 242.0, 242.0, 0.058978581701214505, 0.01589657084915547, 0.034672955257940556], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1a33a977-dbc7-44ac-9171-3d2380e847e0", 3, 0, 0.0, 276.6666666666667, 172, 406, 252.0, 406.0, 406.0, 406.0, 0.031210986267166042, 0.025551963040990427, 0.02001485772992093], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 13, 0, 0.0, 119.99999999999999, 80, 252, 82.0, 248.8, 252.0, 252.0, 0.058978581701214505, 0.01589657084915547, 0.03473055152913315], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 98.0, 88, 128, 88.0, 128.0, 128.0, 128.0, 0.027172990047892396, 0.008013909174280765, 0.01679736591827723], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 951.0535714285713, 641, 1378, 913.0, 1302.4, 1374.0, 1378.0, 0.24909369926383915, 298.0026633009363, 0.4918627538198074], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=114b57ca-3c2b-4784-b487-984ada9c02d2", 1, 0, 0.0, 380.0, 380, 380, 380.0, 380.0, 380.0, 380.0, 2.631578947368421, 0.4754317434210526, 1.8143503289473684], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 9, 36.0, 1016.76, 185, 1699, 1008.0, 1569.6000000000001, 1665.3999999999999, 1699.0, 0.10226705609961628, 0.0318625796660367, 0.04614001945119407], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 4, 0, 0.0, 122.75, 82, 242, 83.5, 242.0, 242.0, 242.0, 0.064781524309267, 0.01746064522398212, 0.03814771402196093], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 4, 0, 0.0, 124.25, 81, 251, 82.5, 251.0, 251.0, 251.0, 0.0647836227001814, 0.017461210805908265, 0.038085684438973824], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 105.73333333333333, 79, 247, 82.0, 242.2, 247.0, 247.0, 0.08210719915922228, 0.02213045602338413, 0.04827005263071466], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/722558d1-f53b-42ce-896d-6a3663785b6e", 1, 0, 0.0, 272.0, 272, 272, 272.0, 272.0, 272.0, 272.0, 3.676470588235294, 1.174029181985294, 2.193675321691176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 106.4, 80, 241, 83.0, 241.0, 241.0, 241.0, 0.0821058508629325, 0.022130092615399773, 0.0483494414749495], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 82.66666666666667, 80, 86, 82.0, 85.4, 86.0, 86.0, 0.08210719915922228, 0.06101911968766422, 0.041213965202969], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 4, 0, 0.0, 81.0, 79, 84, 80.5, 84.0, 84.0, 84.0, 0.06478781988986071, 0.017335803368966635, 0.03694930353093618], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 84.13333333333333, 80, 115, 82.0, 98.20000000000002, 115.0, 115.0, 0.08210764860115936, 0.02197021066085709, 0.04682701834284869], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 4, 0, 0.0, 83.0, 81, 86, 82.5, 86.0, 86.0, 86.0, 0.06478467194661743, 0.04814563999157799, 0.03251886853570445], "isController": false}, {"data": ["deleteAccount", 16, 4, 25.0, 761.4375, 81, 3980, 445.5, 2580.0000000000014, 3980.0, 3980.0, 0.08935951567142505, 0.01808570275674106, 0.06080199467193888], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 4, 0, 0.0, 125.0, 83, 243, 87.0, 243.0, 243.0, 243.0, 0.06251172094767769, 0.049203561605301, 0.022220963305619804], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=87febcd5-9b6b-464a-a548-a151cce0a9be", 1, 0, 0.0, 759.0, 759, 759, 759.0, 759.0, 759.0, 759.0, 1.3175230566534915, 0.2380290678524374, 0.9083703886693018], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1406.9999999999995, 889, 2723, 1283.0, 1876.5, 2516.5, 2723.0, 0.10083186286866651, 0.05218836652382153, 0.04637871817494328], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 4, 0, 0.0, 208.75, 165, 337, 166.5, 337.0, 337.0, 337.0, 0.06469456080480034, 0.10026393359103333, 0.14549958352876483], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/016f15ba-0bac-49e8-9dc4-994c172a54ce", 3, 0, 0.0, 780.0, 175, 1980, 185.0, 1980.0, 1980.0, 1980.0, 0.07719424645549752, 0.03583300632992821, 0.049502820806422564], "isController": false}, {"data": ["addBook", 58, 16, 27.586206896551722, 866.4827586206895, 420, 2852, 700.0, 1572.8, 1763.1499999999999, 2852.0, 0.2581242378659356, 70.26715267547998, 0.9390164451285725], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dc535211-ffbe-46a3-9789-a7c95fcdbb86", 1, 0, 0.0, 440.0, 440, 440, 440.0, 440.0, 440.0, 440.0, 2.2727272727272725, 0.41060014204545453, 1.5669389204545454], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 154.75000000000003, 80, 352, 85.5, 338.0, 343.45, 352.0, 0.25005469946550807, 0.18583166630200357, 0.1208760510111587], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 533.4285714285712, 393, 739, 487.0, 669.3000000000001, 727.45, 739.0, 0.24993974666821392, 73.49058430110598, 0.125702118685674], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 110.23214285714286, 80, 264, 84.0, 243.0, 245.2, 264.0, 0.25038675811744926, 0.4430671930750177, 0.12177012260008764], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5e54f709-34f9-4654-95e9-b352e938cfb3", 1, 0, 0.0, 631.0, 631, 631, 631.0, 631.0, 631.0, 631.0, 1.5847860538827259, 0.28631388668779717, 1.0926356973058637], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 793.2857142857141, 556, 1112, 800.5, 975.2, 1027.8, 1112.0, 0.24951656166178032, 224.51544078660098, 0.12524561786538582], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 106.42105263157895, 82, 254, 87.0, 245.0, 254.0, 254.0, 0.09962039386757827, 0.07442343877802479, 0.03541193688261572], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 16, 9.30232558139535, 155.12790697674413, 80, 1776, 89.0, 277.70000000000005, 347.09999999999997, 1568.680000000003, 0.7217550396965271, 1.6001031556326268, 0.3448588263402823], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 13, 0, 0.0, 106.76923076923076, 83, 256, 88.0, 208.39999999999998, 256.0, 256.0, 0.05917806223711284, 0.0458283235879204, 0.021035951810848705], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 89.5, 81, 117, 87.0, 106.0, 117.0, 117.0, 0.0867958685166586, 0.07043688157943682, 0.030853218886780987], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 13, 0, 0.0, 205.76923076923075, 165, 338, 167.0, 336.0, 338.0, 338.0, 0.05895584660595726, 0.09137004742544354, 0.1325930807944527], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 190.73333333333332, 165, 329, 168.0, 324.2, 329.0, 329.0, 0.08206856555089892, 0.12719024758718417, 0.18457412740597678], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fe1c2ce2-4d76-43f3-9ba3-f0669c18f6a6", 3, 0, 0.0, 349.0, 191, 432, 424.0, 432.0, 432.0, 432.0, 0.020236224190382398, 0.027897268699957505, 0.012977005747087671], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 8, 0, 0.0, 88.625, 84, 97, 86.5, 97.0, 97.0, 97.0, 0.0501168348712937, 0.041551946099344095, 0.017814968645655183], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 22, 0, 0.0, 104.40909090909089, 83, 248, 90.0, 200.5999999999999, 247.1, 248.0, 0.10087347256929319, 0.07831485419198056, 0.035857367202365945], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=909bcf71-839f-4d3b-86e6-ddd302d82021", 1, 0, 0.0, 453.0, 453, 453, 453.0, 453.0, 453.0, 453.0, 2.207505518763797, 0.3988169150110375, 1.5219715783664458], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5851da12-fc42-4138-8619-31bfe35c9d21", 3, 0, 0.0, 365.3333333333333, 187, 506, 403.0, 506.0, 506.0, 506.0, 0.027484356820243146, 0.03248557930153088, 0.017625059549439777], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 134.0, 80, 252, 84.0, 243.0, 252.0, 252.0, 0.1003459293881539, 0.0745734885394386, 0.05036895283741319], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 146.63157894736844, 80, 324, 84.0, 247.0, 324.0, 324.0, 0.10034963926945463, 0.04271667929839758, 0.0563435166210692], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 220.84210526315792, 80, 955, 94.0, 862.0, 955.0, 955.0, 0.10035069928592555, 9.52901480370875, 0.05808745761503359], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 168.15789473684208, 80, 662, 84.0, 477.0, 662.0, 662.0, 0.10035069928592555, 3.130141322833481, 0.058185456344805], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 20.930232558139537, 0.6741573033707865], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 5, 11.627906976744185, 0.37453183520599254], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 4, 9.30232558139535, 0.299625468164794], "isController": false}, {"data": ["401/Unauthorized", 25, 58.13953488372093, 1.8726591760299625], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1335, 43, "401/Unauthorized", 25, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 4, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 18, 9, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 16, "401/Unauthorized", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
