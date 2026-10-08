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

    var data = {"OkPercent": 97.84615384615384, "KoPercent": 2.1538461538461537};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7150395778364116, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/39c3bb2d-debb-44ce-883b-730391afe701"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6841fe25-2da9-4171-87c8-a4257880a620"], "isController": false}, {"data": [0.4666666666666667, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.868421052631579, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=592218f5-52cf-4a89-86a1-737e4db10161"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e7517d22-dd15-466b-a122-2519c11ec9f4"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/740f2892-9568-419f-81e6-581f7d2f611e"], "isController": false}, {"data": [0.4375, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=740f2892-9568-419f-81e6-581f7d2f611e"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bf8b2859-41d0-4547-82b1-413d85fdb9b2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/3283d59c-fd0e-4ff6-a161-8b80ddeebcbf"], "isController": false}, {"data": [0.6136363636363636, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0c94dcaa-7997-4ea0-8704-0dd69b98f098"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7e75e1e9-99df-4b0a-a398-c75d9ae25b8e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/592218f5-52cf-4a89-86a1-737e4db10161"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7589e3a7-0e08-47d8-bdde-4324627965e9"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f2c43ac6-3f4b-4ee5-9424-8e778df74586"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=39c3bb2d-debb-44ce-883b-730391afe701"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d0d21694-0c92-46b4-80ee-e89efae22a40"], "isController": false}, {"data": [0.6842105263157895, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.05, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ed464875-5594-41a9-bb76-b0ed7a9f735c"], "isController": false}, {"data": [0.1875, 500, 1500, "register"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e7517d22-dd15-466b-a122-2519c11ec9f4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0ecc3156-fd41-4722-9e8b-fa41b616202e"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.25862068965517243, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.1875, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.22727272727272727, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.25925925925925924, 500, 1500, "addBook"], "isController": true}, {"data": [0.9137931034482759, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.33620689655172414, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9186746987951807, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a9eab0b9-c656-4b78-a910-7acb94daf1bd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3dbce4c6-9cc0-4018-9679-349858866bc2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bf8b2859-41d0-4547-82b1-413d85fdb9b2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/0c94dcaa-7997-4ea0-8704-0dd69b98f098"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7e75e1e9-99df-4b0a-a398-c75d9ae25b8e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7589e3a7-0e08-47d8-bdde-4324627965e9"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.7941176470588235, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3283d59c-fd0e-4ff6-a161-8b80ddeebcbf"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6841fe25-2da9-4171-87c8-a4257880a620"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f2c43ac6-3f4b-4ee5-9424-8e778df74586"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/ed464875-5594-41a9-bb76-b0ed7a9f735c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1300, 28, 2.1538461538461537, 497.39769230769224, 1, 2725, 166.5, 1391.8000000000002, 1655.9, 2119.98, 5.230756850279644, 763.9868756412707, 3.817332634641693], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 1, 1.7241379310344827, 2349.586206896552, 1689, 3630, 2292.5, 2798.2000000000003, 3020.35, 3630.0, 0.2536361807638822, 305.2164325633872, 1.2445562514759], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/39c3bb2d-debb-44ce-883b-730391afe701", 3, 0, 0.0, 701.3333333333334, 241, 1367, 496.0, 1367.0, 1367.0, 1367.0, 0.02072009227347759, 0.024490447605793338, 0.013287298756103794], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6841fe25-2da9-4171-87c8-a4257880a620", 3, 0, 0.0, 499.6666666666667, 351, 652, 496.0, 652.0, 652.0, 652.0, 0.029343871043468053, 0.023851447264173087, 0.018817521469932312], "isController": false}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 539.8666666666667, 144, 810, 532.0, 785.4, 810.0, 810.0, 0.08058147593031313, 0.015785785226192204, 0.05425609531714183], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 539.8666666666667, 144, 810, 532.0, 785.4, 810.0, 810.0, 0.08017231703341048, 0.01570563163759975, 0.053980605648406975], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 172.5789473684211, 136, 430, 143.0, 428.0, 430.0, 430.0, 0.12246371206847655, 0.052130163617964784, 0.06875995017660556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 142.421052631579, 138, 155, 142.0, 147.0, 155.0, 155.0, 0.12246450140834177, 0.09101121637866025, 0.06147143918348406], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 334.57894736842104, 140, 1139, 145.0, 1115.0, 1139.0, 1139.0, 0.12223759127609612, 3.812837761765368, 0.07087593889728826], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 402.2631578947369, 138, 1646, 144.0, 1567.0, 1646.0, 1646.0, 0.12246765886955906, 17.427262418784604, 0.07033581518341143], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=592218f5-52cf-4a89-86a1-737e4db10161", 1, 0, 0.0, 729.0, 729, 729, 729.0, 729.0, 729.0, 729.0, 1.371742112482853, 0.24782450274348422, 0.9457518861454047], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e7517d22-dd15-466b-a122-2519c11ec9f4", 1, 0, 0.0, 586.0, 586, 586, 586.0, 586.0, 586.0, 586.0, 1.7064846416382253, 0.30830044795221845, 1.1765411689419796], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 283.66666666666674, 142, 418, 274.0, 416.8, 418.0, 418.0, 0.08070981592781314, 0.1289202691268812, 0.05216712581584172], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 195.33333333333334, 139, 815, 143.0, 450.50000000000057, 815.0, 815.0, 0.09807928075194115, 0.07288899673069064, 0.04923120147118921], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 188.05555555555557, 138, 427, 141.5, 425.2, 427.0, 427.0, 0.09807981517403717, 0.04261193358906737, 0.05502090326060897], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 1105.3333333333333, 824, 1250, 1107.0, 1250.0, 1250.0, 1250.0, 0.10163806684396863, 29.884966353564955, 0.05796545999695086], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1444.3333333333335, 1268, 1555, 1460.0, 1555.0, 1555.0, 1555.0, 0.10047726701833709, 90.40962148329565, 0.05720531901532278], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 285.8333333333333, 142, 429, 286.0, 429.0, 429.0, 429.0, 0.10232272587741738, 0.18106326102527373, 0.05665721247314029], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 9, 0, 0.0, 317.44444444444446, 140, 1443, 141.0, 1443.0, 1443.0, 1443.0, 0.04766015134745839, 0.03541931169474203, 0.0239231619068297], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 9, 0, 0.0, 249.66666666666666, 139, 558, 142.0, 558.0, 558.0, 558.0, 0.04759084563644825, 0.012734269242565252, 0.027141654152036888], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 9, 0, 0.0, 283.0, 139, 570, 145.0, 570.0, 570.0, 570.0, 0.047552876156459534, 0.012816986151545732, 0.02795589008416859], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 9, 0, 0.0, 233.66666666666669, 138, 432, 144.0, 432.0, 432.0, 432.0, 0.04766141331977631, 0.01284624030884596, 0.028066242413891714], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 238.5, 141, 433, 142.5, 433.0, 433.0, 433.0, 0.10282423910063065, 0.07641527925349603, 0.05773822019810804], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/740f2892-9568-419f-81e6-581f7d2f611e", 3, 0, 0.0, 752.6666666666666, 274, 1383, 601.0, 1383.0, 1383.0, 1383.0, 0.07226129684940746, 0.03269635501975142, 0.04633943840928799], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 1126.625, 138, 2097, 1443.5, 2022.8000000000002, 2097.0, 2097.0, 0.0730950738488668, 41.114310487886776, 0.03904590370637709], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 333.5, 137, 1656, 143.0, 1298.7000000000005, 1656.0, 1656.0, 0.09807981517403717, 9.829319411221421, 0.056723677829602664], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 708.7500000000001, 142, 1230, 841.0, 1176.1000000000001, 1230.0, 1230.0, 0.07309473991977852, 13.44006331260793, 0.039117106910193974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 306.49999999999994, 135, 1284, 143.0, 996.9000000000004, 1284.0, 1284.0, 0.09808248737187975, 3.227888699535198, 0.056821006952958546], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 576.2142857142857, 146, 1595, 533.0, 1232.0, 1595.0, 1595.0, 0.08428555947550301, 0.01660312639221683, 0.05725256544171654], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=740f2892-9568-419f-81e6-581f7d2f611e", 1, 0, 0.0, 333.0, 333, 333, 333.0, 333.0, 333.0, 333.0, 3.003003003003003, 0.5425347222222222, 2.070429804804805], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 9, 0, 0.0, 649.3333333333334, 285, 2002, 568.0, 2002.0, 2002.0, 2002.0, 0.04751647237709073, 0.07364125162347948, 0.10686566004339838], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bf8b2859-41d0-4547-82b1-413d85fdb9b2", 1, 0, 0.0, 527.0, 527, 527, 527.0, 527.0, 527.0, 527.0, 1.8975332068311195, 0.34281605787476277, 1.3082601992409866], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3283d59c-fd0e-4ff6-a161-8b80ddeebcbf", 3, 0, 0.0, 681.3333333333334, 416, 1115, 513.0, 1115.0, 1115.0, 1115.0, 0.0365974162224147, 0.02395748828882681, 0.02346904621033755], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 798.2727272727274, 184, 1952, 771.5, 1460.6999999999998, 1894.5499999999993, 1952.0, 0.09388669582844339, 0.05767063640243252, 0.04245072282086845], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 145.125, 139, 163, 143.5, 153.20000000000002, 163.0, 163.0, 0.07308739425167644, 0.05431592482961501, 0.036686445942736026], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 266.18750000000006, 138, 445, 145.0, 440.8, 445.0, 445.0, 0.07309473991977852, 0.08817409910733048, 0.037850083830529846], "isController": false}, {"data": ["login", 22, 0, 0.0, 3422.6818181818176, 2004, 5968, 3174.0, 4867.0, 5805.999999999998, 5968.0, 0.09251394016871178, 30.311333391329764, 0.1814222677900102], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 155.00000000000003, 142, 210, 146.5, 208.2, 210.0, 210.0, 0.09328551586890275, 0.07552118423371132, 0.03316008571902403], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0c94dcaa-7997-4ea0-8704-0dd69b98f098", 1, 0, 0.0, 607.0, 607, 607, 607.0, 607.0, 607.0, 607.0, 1.6474464579901154, 0.2976343698517298, 1.1358371087314663], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7e75e1e9-99df-4b0a-a398-c75d9ae25b8e", 3, 0, 0.0, 412.6666666666667, 338, 482, 418.0, 482.0, 482.0, 482.0, 0.08078196946441554, 0.036551737485526564, 0.05180354161617794], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/592218f5-52cf-4a89-86a1-737e4db10161", 3, 0, 0.0, 325.0, 239, 477, 259.0, 477.0, 477.0, 477.0, 0.028819828041692683, 0.02890426113165858, 0.018481465248090686], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7589e3a7-0e08-47d8-bdde-4324627965e9", 1, 0, 0.0, 481.0, 481, 481, 481.0, 481.0, 481.0, 481.0, 2.079002079002079, 0.37560096153846156, 1.4333744802494803], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f2c43ac6-3f4b-4ee5-9424-8e778df74586", 1, 0, 0.0, 869.0, 869, 869, 869.0, 869.0, 869.0, 869.0, 1.1507479861910241, 0.20789880609896433, 0.7933867951668585], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 1291.1874999999998, 284, 2239, 1589.5, 2166.2000000000003, 2239.0, 2239.0, 0.07303968337297258, 54.655482726685506, 0.1525880299371402], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=39c3bb2d-debb-44ce-883b-730391afe701", 1, 0, 0.0, 539.0, 539, 539, 539.0, 539.0, 539.0, 539.0, 1.8552875695732838, 0.3351837894248608, 1.2791338126159555], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d0d21694-0c92-46b4-80ee-e89efae22a40", 1, 0, 0.0, 270.0, 270, 270, 270.0, 270.0, 270.0, 270.0, 3.7037037037037037, 1.1827256944444444, 2.209924768518518], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 606.5789473684209, 281, 1789, 557.0, 1722.0, 1789.0, 1789.0, 0.12212523621591741, 21.33061370341565, 0.27082099694365525], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, 40.0, 1068.3000000000002, 142, 1967, 1472.0, 1955.0, 1967.0, 1967.0, 0.12486265108380783, 89.64084819198882, 0.20202386749575468], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ed464875-5594-41a9-bb76-b0ed7a9f735c", 1, 0, 0.0, 728.0, 728, 728, 728.0, 728.0, 728.0, 728.0, 1.3736263736263736, 0.24816492101648352, 0.9470509958791209], "isController": false}, {"data": ["register", 24, 8, 33.333333333333336, 1313.0416666666667, 336, 2201, 1312.5, 2073.0, 2180.75, 2201.0, 0.09822981684232068, 0.030696817763225213, 0.044318530645656405], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/e7517d22-dd15-466b-a122-2519c11ec9f4", 3, 0, 0.0, 460.3333333333333, 327, 595, 459.0, 595.0, 595.0, 595.0, 0.046923389745675226, 0.03016721834235305, 0.03009084563768887], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 180.41176470588235, 142, 438, 147.0, 430.0, 438.0, 438.0, 0.09410670593315103, 0.07306135861021003, 0.033451993124674784], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 589.1666666666666, 282, 1798, 300.5, 1461.4000000000005, 1798.0, 1798.0, 0.09800398549541015, 13.162437182167631, 0.2176271227391025], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0ecc3156-fd41-4722-9e8b-fa41b616202e", 2, 0, 0.0, 310.0, 302, 318, 310.0, 318.0, 318.0, 318.0, 0.033855268726195514, 0.0299209162082099, 0.021043826703343208], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 393.25, 284, 577, 295.0, 568.6, 577.0, 577.0, 0.07760736493893271, 0.12027625796688106, 0.17454078267027542], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 180.875, 139, 432, 147.0, 432.0, 432.0, 432.0, 0.05026799122823553, 0.03735736457488988, 0.025232175284485413], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 211.625, 139, 427, 143.0, 427.0, 427.0, 427.0, 0.05027115001539554, 0.01345146006271326, 0.028670265243155267], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 177.25, 138, 426, 142.0, 426.0, 426.0, 426.0, 0.05027083411881511, 0.013549560758586886, 0.029553752089381543], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 187.875, 137, 515, 142.0, 515.0, 515.0, 515.0, 0.05027051822620476, 0.013549475615656751, 0.029602658682032688], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 146.5, 146, 147, 146.5, 147.0, 147.0, 147.0, 0.47744091668656, 0.14080777035091907, 0.295136816662688], "isController": false}, {"data": ["https://demoqa.com/books", 58, 1, 1.7241379310344827, 1549.862068965517, 955, 2489, 1429.0, 2189.8, 2379.45, 2489.0, 0.2555392539134956, 301.75768772497366, 0.5023786766811619], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, 33.333333333333336, 1313.0416666666667, 336, 2201, 1312.5, 2073.0, 2180.75, 2201.0, 0.0975962848347573, 0.03049883901086165, 0.04403269882193151], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 171.55555555555554, 139, 415, 142.0, 415.0, 415.0, 415.0, 0.044808220814912175, 0.012077215766519298, 0.026386090968156292], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 264.8888888888889, 137, 429, 142.0, 429.0, 429.0, 429.0, 0.044808220814912175, 0.012077215766519298, 0.02634233294001673], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 246.23529411764704, 138, 1384, 141.0, 613.5999999999993, 1384.0, 1384.0, 0.09651139686054104, 5.132784114295041, 0.056250266115983986], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 265.0588235294117, 139, 1135, 145.0, 565.3999999999995, 1135.0, 1135.0, 0.09650920527507961, 1.6937121591663875, 0.05634323605300058], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 202.22222222222223, 140, 418, 142.0, 418.0, 418.0, 418.0, 0.044869653656128945, 0.012006137794706379, 0.02558972435076104], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 192.47058823529414, 140, 426, 144.0, 422.0, 426.0, 426.0, 0.09650975316211369, 0.07172258023082863, 0.048443372192701596], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 202.88888888888889, 139, 417, 142.0, 417.0, 417.0, 417.0, 0.04486942995881984, 0.03334534785025576, 0.022522350584798238], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 173.64705882352942, 138, 424, 141.0, 420.8, 424.0, 424.0, 0.09650975316211369, 0.034350553227967394, 0.054563935582578285], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 181.88888888888889, 142, 434, 148.0, 434.0, 434.0, 434.0, 0.04404467108418405, 0.03466797352915268, 0.01565650417445605], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 508.8571428571429, 146, 1115, 496.0, 897.0, 1115.0, 1115.0, 0.08371153006738778, 0.016163052122386255, 0.056967751627890285], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1660.3636363636367, 1173, 2706, 1564.0, 2306.6, 2660.8499999999995, 2706.0, 0.09437118761850019, 0.04884446234160654, 0.04340705992999373], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 470.0, 283, 848, 291.0, 848.0, 848.0, 848.0, 0.04477678771324945, 0.0693952754891864, 0.10070404502306003], "isController": false}, {"data": ["addBook", 54, 10, 18.51851851851852, 1478.4259259259268, 709, 3997, 1177.0, 2596.0, 2967.0, 3997.0, 0.2633593929078291, 88.60206113778573, 0.9549206980365094], "isController": true}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 236.44827586206893, 140, 769, 145.0, 571.0, 583.1, 769.0, 0.2569680429225241, 0.19096941471097742, 0.1242179504361811], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 893.0344827586208, 680, 1291, 834.0, 1157.9, 1257.1, 1291.0, 0.2568883731436493, 75.53371120099743, 0.12919678922751895], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 214.20689655172416, 140, 449, 145.0, 431.0, 443.1, 449.0, 0.25751454069173735, 0.45568002708342586, 0.12523656373484882], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 1, 1.7241379310344827, 1296.7758620689656, 1, 1865, 1268.5, 1631.9, 1815.05, 1865.0, 0.25624373196905637, 226.6015543888366, 0.12640471543691764], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 167.5625, 142, 438, 148.5, 248.30000000000018, 438.0, 438.0, 0.07846329634115841, 0.058617599317369325, 0.027891249871271156], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 166, 10, 6.024096385542169, 220.64457831325302, 138, 1824, 149.0, 414.60000000000014, 474.25, 1280.63000000001, 0.7006318348534792, 1.6404365535139218, 0.33171445216710493], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 155.74999999999997, 143, 183, 148.0, 183.0, 183.0, 183.0, 0.048662392486526596, 0.03768484105646054, 0.017297959829195002], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a9eab0b9-c656-4b78-a910-7acb94daf1bd", 1, 0, 0.0, 435.0, 435, 435, 435.0, 435.0, 435.0, 435.0, 2.2988505747126435, 0.7341056034482759, 1.3716774425287357], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3dbce4c6-9cc0-4018-9679-349858866bc2", 1, 0, 0.0, 249.0, 249, 249, 249.0, 249.0, 249.0, 249.0, 4.016064257028112, 1.2824736445783134, 2.3963039658634537], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bf8b2859-41d0-4547-82b1-413d85fdb9b2", 3, 0, 0.0, 390.3333333333333, 292, 514, 365.0, 514.0, 514.0, 514.0, 0.02925202570277992, 0.02933772499683103, 0.018758623253410298], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0c94dcaa-7997-4ea0-8704-0dd69b98f098", 3, 0, 0.0, 620.3333333333334, 245, 1108, 508.0, 1108.0, 1108.0, 1108.0, 0.02700172811059908, 0.0225102297172019, 0.01731556132092454], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 178.15789473684205, 141, 421, 148.0, 420.0, 421.0, 421.0, 0.12051249524292781, 0.09779871440124319, 0.042838426043384496], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7e75e1e9-99df-4b0a-a398-c75d9ae25b8e", 1, 0, 0.0, 275.0, 275, 275, 275.0, 275.0, 275.0, 275.0, 3.6363636363636362, 0.6569602272727272, 2.5071022727272725], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7589e3a7-0e08-47d8-bdde-4324627965e9", 3, 0, 0.0, 377.3333333333333, 252, 529, 351.0, 529.0, 529.0, 529.0, 0.0482889611434826, 0.031045149172649132, 0.030966553858287997], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 441.0, 284, 860, 294.5, 860.0, 860.0, 860.0, 0.05022317925280465, 0.0778361186271494, 0.1129531072453214], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 491.11764705882365, 281, 1806, 289.0, 1039.5999999999992, 1806.0, 1806.0, 0.09643146842436653, 6.926868253342485, 0.2154252858200362], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 9, 0, 0.0, 149.55555555555557, 143, 172, 147.0, 172.0, 172.0, 172.0, 0.046263692767956735, 0.03835729996093288, 0.01644529703860962], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 150.50000000000003, 141, 164, 150.5, 162.6, 164.0, 164.0, 0.07366007715893083, 0.057187266934912113, 0.026183855552588692], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3283d59c-fd0e-4ff6-a161-8b80ddeebcbf", 1, 0, 0.0, 1595.0, 1595, 1595, 1595.0, 1595.0, 1595.0, 1595.0, 0.6269592476489029, 0.11326900470219436, 0.432259012539185], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6841fe25-2da9-4171-87c8-a4257880a620", 1, 0, 0.0, 505.0, 505, 505, 505.0, 505.0, 505.0, 505.0, 1.9801980198019802, 0.3577506188118812, 1.3652537128712872], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f2c43ac6-3f4b-4ee5-9424-8e778df74586", 3, 0, 0.0, 344.3333333333333, 245, 475, 313.0, 475.0, 475.0, 475.0, 0.05017057997190447, 0.032254848777510205, 0.03217319093250385], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ed464875-5594-41a9-bb76-b0ed7a9f735c", 3, 0, 0.0, 1211.6666666666667, 231, 2725, 679.0, 2725.0, 2725.0, 2725.0, 0.02198333663083383, 0.022047740937369473, 0.014097387097246953], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 144.43749999999997, 139, 153, 143.5, 151.6, 153.0, 153.0, 0.0776619859140573, 0.057715596953708606, 0.03898267652326705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 194.1875, 139, 420, 143.0, 420.0, 420.0, 420.0, 0.07766801776655906, 0.020782262566442562, 0.04429504138249072], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 194.06249999999997, 139, 429, 142.0, 420.6, 429.0, 429.0, 0.07766575571207363, 0.020933348219269846, 0.045658969666668284], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 211.12500000000003, 137, 435, 143.5, 425.90000000000003, 435.0, 435.0, 0.07766914884321512, 0.020934262774147824, 0.04573681323482296], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 28.571428571428573, 0.6153846153846154], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 7.142857142857143, 0.15384615384615385], "isController": false}, {"data": ["Non HTTP response code: java.lang.NullPointerException/Non HTTP response message: null", 1, 3.5714285714285716, 0.07692307692307693], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 7.142857142857143, 0.15384615384615385], "isController": false}, {"data": ["401/Unauthorized", 14, 50.0, 1.0769230769230769], "isController": false}, {"data": ["Assertion failed", 1, 3.5714285714285716, 0.07692307692307693], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1300, 28, "401/Unauthorized", 14, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "Non HTTP response code: java.lang.NullPointerException/Non HTTP response message: null", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/books", 58, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 1, "Non HTTP response code: java.lang.NullPointerException/Non HTTP response message: null", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 166, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
