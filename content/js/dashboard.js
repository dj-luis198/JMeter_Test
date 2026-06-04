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

    var data = {"OkPercent": 98.79154078549848, "KoPercent": 1.2084592145015105};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.78748370273794, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f19a0f94-73db-41cc-a98e-28b51e203936"], "isController": false}, {"data": [0.09821428571428571, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/76babca1-7e33-4e09-9037-db377e545765"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7083333333333334, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.875, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ceda3684-9a04-4f70-9cd9-65e0b656f1a6"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fe896d4f-5d1c-4ffa-9c3a-2886f669e1da"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3a5f944b-696b-462c-a1d9-659ae8cea82e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/25ef1799-89fb-4d53-b532-d1f8dd6062e1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9fca66b7-7002-435d-824f-af5ef6c220cd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/437709b4-dff0-47cb-9560-9c7a1cc9748f"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.045454545454545456, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fe896d4f-5d1c-4ffa-9c3a-2886f669e1da"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fe4a941e-beba-49a0-bf1a-f667c1b9a7fa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/8577c132-fcb8-4f2b-abc1-69df4c2bf3a2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/b8aad413-21fb-44db-8a51-2c508c6031a0"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/66c31793-1f87-42bb-9a4a-c5447de21913"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/21574179-4f87-4e8b-b370-02469c5c34a2"], "isController": false}, {"data": [0.29545454545454547, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f70afd61-4481-483b-b4a9-4956057dec5f"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=66c31793-1f87-42bb-9a4a-c5447de21913"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3ebddad1-f8b4-4582-8f2d-d2e9946fcdc4"], "isController": false}, {"data": [0.29545454545454547, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/0b9c4411-a94e-49aa-b357-4b1600c778e4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.625, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ceda3684-9a04-4f70-9cd9-65e0b656f1a6"], "isController": false}, {"data": [0.38636363636363635, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fe4a941e-beba-49a0-bf1a-f667c1b9a7fa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9db49929-7722-4cf1-84eb-29e6b336b3d2"], "isController": false}, {"data": [0.3225806451612903, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f19a0f94-73db-41cc-a98e-28b51e203936"], "isController": false}, {"data": [0.5089285714285714, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.49107142857142855, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9555555555555556, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3a5f944b-696b-462c-a1d9-659ae8cea82e"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0b9c4411-a94e-49aa-b357-4b1600c778e4"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3ebddad1-f8b4-4582-8f2d-d2e9946fcdc4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=25ef1799-89fb-4d53-b532-d1f8dd6062e1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=21574179-4f87-4e8b-b370-02469c5c34a2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8577c132-fcb8-4f2b-abc1-69df4c2bf3a2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1324, 16, 1.2084592145015105, 359.96223564954664, 100, 2226, 117.5, 1012.5, 1217.25, 1640.75, 5.209665424583798, 728.3240805250391, 3.8074229186422603], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/f19a0f94-73db-41cc-a98e-28b51e203936", 3, 0, 0.0, 396.3333333333333, 242, 563, 384.0, 563.0, 563.0, 563.0, 0.03135910354775991, 0.031450975921435, 0.020109841793322602], "isController": false}, {"data": ["see books", 56, 0, 0.0, 1718.6250000000002, 1271, 2382, 1649.5, 2059.5, 2223.5499999999997, 2382.0, 0.24945542988743324, 300.17833992562, 1.2265703998859632], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/76babca1-7e33-4e09-9037-db377e545765", 1, 0, 0.0, 192.0, 192, 192, 192.0, 192.0, 192.0, 192.0, 5.208333333333333, 1.6632080078125, 3.1077067057291665], "isController": false}, {"data": ["deleteBook", 12, 1, 8.333333333333334, 555.0833333333334, 105, 1066, 479.0, 1049.8, 1066.0, 1066.0, 0.0901421993194264, 0.017143743474080365, 0.060909072342870886], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, 8.333333333333334, 555.0833333333334, 105, 1066, 479.0, 1049.8, 1066.0, 1066.0, 0.09075096422899494, 0.017259521761324965, 0.06132041471300008], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 138.88235294117646, 101, 307, 103.0, 306.2, 307.0, 307.0, 0.09918030395846095, 0.02653847977013506, 0.05656376710130976], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 116.00000000000001, 102, 309, 104.0, 146.59999999999985, 309.0, 309.0, 0.09917741088617933, 0.07370508758240477, 0.04978241132372674], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 173.64705882352942, 102, 411, 104.0, 385.4, 411.0, 411.0, 0.09918030395846095, 0.02673219130130393, 0.058404026647414016], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 138.76470588235293, 101, 306, 104.0, 306.0, 306.0, 306.0, 0.09918030395846095, 0.02673219130130393, 0.05830717088182959], "isController": false}, {"data": ["goToProfile", 12, 1, 8.333333333333334, 249.41666666666669, 103, 563, 209.0, 517.7000000000002, 563.0, 563.0, 0.09027783002189238, 0.21864161958427059, 0.05835585968944426], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ceda3684-9a04-4f70-9cd9-65e0b656f1a6", 1, 0, 0.0, 397.0, 397, 397, 397.0, 397.0, 397.0, 397.0, 2.5188916876574305, 0.45507320528967254, 1.7366577455919394], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fe896d4f-5d1c-4ffa-9c3a-2886f669e1da", 1, 0, 0.0, 522.0, 522, 522, 522.0, 522.0, 522.0, 522.0, 1.9157088122605364, 0.3460997365900383, 1.3207914272030652], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 104.25000000000001, 101, 114, 103.0, 109.10000000000001, 114.0, 114.0, 0.07070854380173325, 0.05254804866515527, 0.03549237452547938], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 128.81250000000003, 101, 314, 103.0, 308.4, 314.0, 314.0, 0.07071323132949714, 0.025559311275224737, 0.03995746433401395], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 706.8, 506, 813, 803.0, 813.0, 813.0, 813.0, 0.04159387738124948, 12.229980996797272, 0.023721508193993844], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1053.2, 811, 1121, 1114.0, 1121.0, 1121.0, 1121.0, 0.04149377593360996, 37.33617252334025, 0.023623897821576763], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 186.2, 103, 307, 115.0, 307.0, 307.0, 307.0, 0.041771094402673355, 0.07391525689223058, 0.02312911184210526], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 131.60000000000002, 102, 309, 105.0, 305.4, 309.0, 309.0, 0.08026712900532974, 0.05965164567681243, 0.0402903362390034], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 156.66666666666663, 101, 310, 103.0, 308.2, 310.0, 310.0, 0.08026970621287526, 0.037553262294643334, 0.04487996334350083], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 306.6666666666667, 101, 1125, 108.0, 1114.2, 1125.0, 1125.0, 0.08026970621287526, 9.64899353494408, 0.04627005070369776], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 258.7333333333333, 101, 818, 109.0, 690.8000000000001, 818.0, 818.0, 0.08013805114944678, 3.1604861307746144, 0.046272420289351794], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 104.0, 103, 105, 104.0, 105.0, 105.0, 105.0, 0.04184065405310416, 0.031094470443761974, 0.023494507891147355], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 179.25, 102, 1115, 103.5, 549.4000000000005, 1115.0, 1115.0, 0.07064891024055954, 3.9909778098948214, 0.04115437007665407], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 746.0624999999999, 102, 1422, 926.0, 1283.4, 1422.0, 1422.0, 0.07825185359078193, 44.01488137813741, 0.04180055069741965], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 147.9375, 102, 609, 103.5, 402.5000000000002, 609.0, 609.0, 0.07071260628988633, 1.3173589366370853, 0.04126052954903035], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 577.625, 102, 925, 803.5, 917.3, 925.0, 925.0, 0.07824955740094094, 14.38788901645197, 0.04187573970284731], "isController": false}, {"data": ["deleteBooks", 12, 1, 8.333333333333334, 464.16666666666674, 105, 1607, 428.5, 1285.7000000000012, 1607.0, 1607.0, 0.09090427022809397, 0.01728867834660283, 0.06213419316778655], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 500.6, 208, 1230, 411.0, 1220.4, 1230.0, 1230.0, 0.08009183864164242, 12.883267605187282, 0.17739612255386175], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3a5f944b-696b-462c-a1d9-659ae8cea82e", 3, 0, 0.0, 323.6666666666667, 220, 458, 293.0, 458.0, 458.0, 458.0, 0.0737717011754291, 0.03337977364383023, 0.04730802451679536], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/25ef1799-89fb-4d53-b532-d1f8dd6062e1", 3, 0, 0.0, 435.66666666666663, 204, 701, 402.0, 701.0, 701.0, 701.0, 0.08952818645736967, 0.041500044764093226, 0.05741228102897729], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9fca66b7-7002-435d-824f-af5ef6c220cd", 1, 0, 0.0, 194.0, 194, 194, 194.0, 194.0, 194.0, 194.0, 5.154639175257732, 1.6460615335051545, 3.0756684922680413], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/437709b4-dff0-47cb-9560-9c7a1cc9748f", 1, 0, 0.0, 187.0, 187, 187, 187.0, 187.0, 187.0, 187.0, 5.347593582887701, 1.7076788101604279, 3.1908004679144386], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 569.8636363636363, 126, 1350, 491.5, 1214.1, 1329.7499999999998, 1350.0, 0.09120002653091681, 0.05602032879682292, 0.041235949495912576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 116.875, 102, 308, 103.5, 170.80000000000013, 308.0, 308.0, 0.07825261901734273, 0.058154534250193186, 0.03927914665518961], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 179.87499999999997, 101, 312, 106.5, 307.8, 312.0, 312.0, 0.07825185359078193, 0.09439511928516932, 0.04052055211573449], "isController": false}, {"data": ["login", 22, 0, 0.0, 2487.409090909091, 1373, 4318, 2500.0, 3418.2999999999997, 4199.649999999998, 4318.0, 0.09105658753021424, 24.8835609036642, 0.17170116469653324], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/fe896d4f-5d1c-4ffa-9c3a-2886f669e1da", 3, 0, 0.0, 382.6666666666667, 271, 465, 412.0, 465.0, 465.0, 465.0, 0.02101590904314566, 0.02897212721280009, 0.013476998963215154], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fe4a941e-beba-49a0-bf1a-f667c1b9a7fa", 1, 0, 0.0, 1607.0, 1607, 1607, 1607.0, 1607.0, 1607.0, 1607.0, 0.6222775357809583, 0.11242318761667704, 0.429031191661481], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 124.62500000000003, 104, 365, 107.5, 196.30000000000018, 365.0, 365.0, 0.07290090943884525, 0.059018412035940146, 0.025913995152089524], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8577c132-fcb8-4f2b-abc1-69df4c2bf3a2", 3, 0, 0.0, 953.3333333333333, 214, 2226, 420.0, 2226.0, 2226.0, 2226.0, 0.020233358062993187, 0.0278933175119714, 0.012975167768260605], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b8aad413-21fb-44db-8a51-2c508c6031a0", 1, 0, 0.0, 505.0, 505, 505, 505.0, 505.0, 505.0, 505.0, 1.9801980198019802, 0.6323483910891089, 1.1815439356435644], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 891.8749999999999, 207, 1527, 1031.5, 1387.7, 1527.0, 1527.0, 0.07820863130007186, 58.52339851024778, 0.16338653760613156], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/66c31793-1f87-42bb-9a4a-c5447de21913", 3, 0, 0.0, 569.0, 195, 1309, 203.0, 1309.0, 1309.0, 1309.0, 0.020506510817184458, 0.024238001555077073, 0.01315033408523873], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 338.88235294117646, 206, 616, 408.0, 536.8, 616.0, 616.0, 0.09911785112498761, 0.15361331028843295, 0.22291837025473288], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, 28.571428571428573, 856.4285714285714, 103, 1224, 1207.0, 1224.0, 1224.0, 1224.0, 0.05804071141329132, 49.60220088304796, 0.10447004166493926], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/21574179-4f87-4e8b-b370-02469c5c34a2", 3, 0, 0.0, 432.0, 251, 771, 274.0, 771.0, 771.0, 771.0, 0.021814374218318257, 0.025783851818591663, 0.013989035550158518], "isController": false}, {"data": ["register", 22, 5, 22.727272727272727, 1074.3636363636365, 370, 1865, 1072.0, 1775.3, 1854.6499999999999, 1865.0, 0.09071379385702681, 0.028686304484972436, 0.040927512462838274], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f70afd61-4481-483b-b4a9-4956057dec5f", 1, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 2.277904328018223, 0.7274167141230068, 1.359179242596811], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 311.0625, 205, 1219, 208.5, 662.5000000000006, 1219.0, 1219.0, 0.07061243043572282, 5.382409236823059, 0.1576798327588718], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 107.00000000000001, 103, 114, 107.0, 112.8, 114.0, 114.0, 0.10863297930123925, 0.08433908060984883, 0.03861562936098739], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=66c31793-1f87-42bb-9a4a-c5447de21913", 1, 0, 0.0, 536.0, 536, 536, 536.0, 536.0, 536.0, 536.0, 1.8656716417910448, 0.3370598180970149, 1.2862931436567164], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 321.8947368421053, 206, 521, 210.0, 520.0, 521.0, 521.0, 0.1362720276560494, 0.211195027236475, 0.3064789840741033], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 13, 0, 0.0, 120.53846153846155, 103, 306, 105.0, 227.99999999999994, 306.0, 306.0, 0.06248738235548591, 0.046438376926293726, 0.03136573684640601], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 13, 0, 0.0, 171.69230769230768, 102, 377, 105.0, 350.2, 377.0, 377.0, 0.06248918456421004, 0.03116009668999596, 0.034830960747178376], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 13, 0, 0.0, 243.3076923076923, 102, 1183, 104.0, 1045.8, 1183.0, 1183.0, 0.06248828344685372, 8.664569428688852, 0.035910108801715065], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 13, 0, 0.0, 234.6153846153846, 101, 800, 105.0, 721.5999999999999, 800.0, 800.0, 0.06248888418887025, 2.840991025634863, 0.0359714783307777], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 105.0, 105, 105, 105.0, 105.0, 105.0, 105.0, 9.523809523809526, 2.808779761904762, 5.887276785714286], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1160.857142857143, 812, 1959, 1084.5, 1631.3000000000002, 1786.3999999999999, 1959.0, 0.23336542107873168, 279.18617455733494, 0.4608055482628861], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3ebddad1-f8b4-4582-8f2d-d2e9946fcdc4", 1, 0, 0.0, 198.0, 198, 198, 198.0, 198.0, 198.0, 198.0, 5.050505050505051, 0.91244476010101, 3.4820864898989896], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, 22.727272727272727, 1074.3636363636365, 370, 1865, 1072.0, 1775.3, 1854.6499999999999, 1865.0, 0.09123293011142859, 0.02885047026428521, 0.041161732140117195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 204.66666666666666, 102, 415, 104.0, 415.0, 415.0, 415.0, 0.04957912828874884, 0.013363124421576836, 0.02919552183409722], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0b9c4411-a94e-49aa-b357-4b1600c778e4", 3, 0, 0.0, 1328.6666666666667, 181, 2017, 1788.0, 2017.0, 2017.0, 2017.0, 0.01738012061803709, 0.02395989935461819, 0.011145454953624045], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 150.11111111111111, 102, 309, 104.0, 309.0, 309.0, 309.0, 0.0496338127591988, 0.013377863595252802, 0.029179253204138358], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 204.46153846153845, 101, 1212, 104.0, 850.3999999999996, 1212.0, 1212.0, 0.09804513092795947, 6.810638144175364, 0.056991678419512484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 212.46153846153845, 102, 811, 103.0, 650.9999999999999, 811.0, 811.0, 0.09804513092795947, 2.241972201377157, 0.05708742561768432], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 148.88888888888889, 102, 306, 103.0, 306.0, 306.0, 306.0, 0.0496338127591988, 0.01328092255470749, 0.028306783839230566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 126.38461538461539, 101, 309, 104.0, 260.59999999999997, 309.0, 309.0, 0.09789304055783972, 0.07275058971144144, 0.049137717623759396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 148.66666666666666, 103, 308, 104.0, 308.0, 308.0, 308.0, 0.049632991600994866, 0.036885455672223726, 0.024913435237218128], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 151.30769230769232, 101, 307, 103.0, 307.0, 307.0, 307.0, 0.09804587038335935, 0.03756264565468244, 0.05528337613412675], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 130.77777777777777, 105, 312, 106.0, 312.0, 312.0, 312.0, 0.05021648886309869, 0.03952586916372808, 0.017850392525554613], "isController": false}, {"data": ["deleteAccount", 12, 1, 8.333333333333334, 699.3333333333335, 103, 2017, 547.5, 1804.6000000000008, 2017.0, 2017.0, 0.09088705768298594, 0.017078305354005088, 0.061856157503484], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ceda3684-9a04-4f70-9cd9-65e0b656f1a6", 3, 0, 0.0, 280.0, 186, 453, 201.0, 453.0, 453.0, 453.0, 0.01737549013361752, 0.023953515858030662, 0.011142485534904463], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1282.8636363636365, 817, 2072, 1206.5, 1781.6, 2039.5999999999995, 2072.0, 0.08923356479979233, 0.04618534115614251, 0.041043954121779476], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 377.77777777777777, 208, 615, 405.0, 615.0, 615.0, 615.0, 0.04955046715079308, 0.07679354625811388, 0.11144016196120748], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fe4a941e-beba-49a0-bf1a-f667c1b9a7fa", 3, 0, 0.0, 362.0, 199, 630, 257.0, 630.0, 630.0, 630.0, 0.026284662899198317, 0.031067581701493843, 0.016855724580540587], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9db49929-7722-4cf1-84eb-29e6b336b3d2", 1, 0, 0.0, 308.0, 308, 308, 308.0, 308.0, 308.0, 308.0, 3.246753246753247, 1.0368049918831168, 1.9372717126623378], "isController": false}, {"data": ["addBook", 62, 7, 11.290322580645162, 1050.8387096774188, 519, 2656, 860.0, 1819.7000000000003, 2156.9499999999994, 2656.0, 0.29573098020510374, 92.43966413516576, 1.0755556135225375], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 177.2857142857143, 101, 444, 105.0, 419.3, 422.79999999999995, 444.0, 0.23414993121845773, 0.1740118141184046, 0.11318771089173492], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f19a0f94-73db-41cc-a98e-28b51e203936", 1, 0, 0.0, 402.0, 402, 402, 402.0, 402.0, 402.0, 402.0, 2.487562189054726, 0.4494130907960199, 1.7150575248756217], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 640.4821428571429, 500, 925, 608.0, 816.0, 844.0999999999999, 925.0, 0.23402370325794425, 68.81073907610785, 0.11769746794711064], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 148.625, 100, 422, 105.5, 312.6, 318.3, 422.0, 0.23451077283862728, 0.41497414099960217, 0.11404918444691053], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 981.7142857142856, 705, 1513, 928.5, 1226.5, 1363.6999999999998, 1513.0, 0.23382924619296758, 210.39996675240405, 0.11737132084295443], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 121.15789473684211, 104, 312, 106.0, 137.0, 312.0, 312.0, 0.13111857950271555, 0.09795479816364978, 0.04660855755760591], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 7, 3.888888888888889, 167.97777777777776, 103, 1159, 109.0, 299.9, 332.95, 736.9899999999989, 0.7434637148403618, 1.5635608233344347, 0.35945373487257853], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 13, 0, 0.0, 106.53846153846155, 103, 118, 105.0, 118.0, 118.0, 118.0, 0.0630220528706545, 0.04880516399065335, 0.02240237035636547], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 130.64705882352942, 104, 310, 106.0, 307.6, 310.0, 310.0, 0.09915022425447781, 0.0804627308158897, 0.03524480627795891], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 13, 0, 0.0, 404.3076923076923, 207, 1286, 212.0, 1150.0, 1286.0, 1286.0, 0.06245586052165057, 11.577121765206801, 0.13800624528578362], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3a5f944b-696b-462c-a1d9-659ae8cea82e", 1, 0, 0.0, 204.0, 204, 204, 204.0, 204.0, 204.0, 204.0, 4.901960784313726, 0.8856081495098039, 3.379672181372549], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 386.38461538461536, 204, 1401, 209.0, 1128.9999999999998, 1401.0, 1401.0, 0.09781643617101324, 9.141663123955999, 0.21806628427337438], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0b9c4411-a94e-49aa-b357-4b1600c778e4", 1, 0, 0.0, 467.0, 467, 467, 467.0, 467.0, 467.0, 467.0, 2.1413276231263385, 0.3868609475374732, 1.476345021413276], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3ebddad1-f8b4-4582-8f2d-d2e9946fcdc4", 3, 0, 0.0, 379.33333333333337, 223, 681, 234.0, 681.0, 681.0, 681.0, 0.07916193893975777, 0.03581871586141384, 0.050764654853946226], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=25ef1799-89fb-4d53-b532-d1f8dd6062e1", 1, 0, 0.0, 190.0, 190, 190, 190.0, 190.0, 190.0, 190.0, 5.263157894736842, 0.9508634868421052, 3.6287006578947367], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 110.46666666666667, 102, 126, 107.0, 124.8, 126.0, 126.0, 0.08248420427488136, 0.06838778264587331, 0.029320556988336733], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=21574179-4f87-4e8b-b370-02469c5c34a2", 1, 0, 0.0, 487.0, 487, 487, 487.0, 487.0, 487.0, 487.0, 2.053388090349076, 0.37097343429158114, 1.4157148357289528], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 107.0, 103, 115, 106.5, 112.2, 115.0, 115.0, 0.07925107731933231, 0.06152793600475507, 0.02817128139085641], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8577c132-fcb8-4f2b-abc1-69df4c2bf3a2", 1, 0, 0.0, 455.0, 455, 455, 455.0, 455.0, 455.0, 455.0, 2.197802197802198, 0.39706387362637363, 1.5152815934065933], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 103.73684210526315, 102, 106, 103.0, 105.0, 106.0, 106.0, 0.136373750206355, 0.101348070221715, 0.06845323008404929], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 167.3157894736842, 101, 417, 103.0, 410.0, 417.0, 417.0, 0.13637570789758902, 0.03649115621478456, 0.07777677091034374], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 145.63157894736838, 101, 309, 103.0, 307.0, 309.0, 309.0, 0.13637668676428366, 0.03675777885443583, 0.08017457561728396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 195.0, 101, 416, 104.0, 313.0, 416.0, 416.0, 0.13637864453982976, 0.03675830653612598, 0.08030890884523177], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 31.25, 0.3776435045317221], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 6.25, 0.0755287009063444], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 6.25, 0.0755287009063444], "isController": false}, {"data": ["401/Unauthorized", 9, 56.25, 0.6797583081570997], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1324, 16, "401/Unauthorized", 9, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
