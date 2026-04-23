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

    var data = {"OkPercent": 99.28571428571429, "KoPercent": 0.7142857142857143};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7440354464894342, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=65e7bb57-70c6-4d45-b53e-44382375fa67"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/16d9cfa5-dbdc-401a-93e7-fbc7fb20a0fd"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.8214285714285714, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0a5c68ca-cf2c-4d2c-bc8f-1ee80f85be94"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ff4d97bf-e550-46e6-92b2-e444c5fade0f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3bcefd21-1b71-40b0-8eed-5385fb325ae0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.2, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1690a7ca-2bb2-4ad9-a525-252c7420bd52"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.7307692307692307, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a39b7cd5-40d2-435b-adc0-ce6e5bd2780f"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bbaf39c1-5a9d-4556-a8d1-c785065bf3ce"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fadfe71b-033a-497d-8643-c90a14f7a809"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8fa21d0a-76b9-4fdc-8d9b-5fc82388346f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=34ed7dc4-5869-4184-9312-881f568c1ebb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d09e0137-af49-413a-b4b0-103629c2e549"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b83c08a8-eb71-487b-a4fc-18c5a3c12825"], "isController": false}, {"data": [0.34375, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/30fc2703-03ee-4760-8143-8a6630583459"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0a5c68ca-cf2c-4d2c-bc8f-1ee80f85be94"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/510e6726-e741-4ebb-a803-35e367f308ea"], "isController": false}, {"data": [0.6944444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=510e6726-e741-4ebb-a803-35e367f308ea"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a14cb554-5658-405b-91fb-f15e39123aa2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/65e7bb57-70c6-4d45-b53e-44382375fa67"], "isController": false}, {"data": [0.16037735849056603, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=30fc2703-03ee-4760-8143-8a6630583459"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.4090909090909091, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bbaf39c1-5a9d-4556-a8d1-c785065bf3ce"], "isController": false}, {"data": [0.31896551724137934, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=16d9cfa5-dbdc-401a-93e7-fbc7fb20a0fd"], "isController": false}, {"data": [0.9056603773584906, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3bcefd21-1b71-40b0-8eed-5385fb325ae0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9811320754716981, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.25471698113207547, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9644970414201184, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/34ed7dc4-5869-4184-9312-881f568c1ebb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c671a454-b374-4568-8ef5-07905188bc05"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b83c08a8-eb71-487b-a4fc-18c5a3c12825"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1690a7ca-2bb2-4ad9-a525-252c7420bd52"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ff4d97bf-e550-46e6-92b2-e444c5fade0f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8fa21d0a-76b9-4fdc-8d9b-5fc82388346f"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1260, 9, 0.7142857142857143, 499.9158730158732, 138, 2590, 232.0, 1434.2000000000007, 1709.0, 2230.5300000000025, 4.922471080482402, 694.8934848739008, 3.591449764180428], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 53, 0, 0.0, 2559.11320754717, 1919, 3232, 2582.0, 2958.2, 3056.0999999999995, 3232.0, 0.2535351409272689, 305.0875120414243, 1.2466303071960927], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=65e7bb57-70c6-4d45-b53e-44382375fa67", 1, 0, 0.0, 373.0, 373, 373, 373.0, 373.0, 373.0, 373.0, 2.680965147453083, 0.4843540549597855, 1.848399798927614], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/16d9cfa5-dbdc-401a-93e7-fbc7fb20a0fd", 3, 0, 0.0, 569.3333333333334, 269, 1021, 418.0, 1021.0, 1021.0, 1021.0, 0.026819957624466952, 0.026898531719069883, 0.017198996263085905], "isController": false}, {"data": ["deleteBook", 14, 0, 0.0, 518.5, 444, 910, 471.0, 751.0, 910.0, 910.0, 0.09070236020498734, 0.016386656872971344, 0.06164926045182733], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 0, 0.0, 518.5, 444, 910, 471.0, 751.0, 910.0, 910.0, 0.0912676423612243, 0.01648878304377587, 0.06203347566739463], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 214.44444444444443, 144, 465, 150.0, 433.50000000000006, 465.0, 465.0, 0.09201748332183114, 0.02462186565447435, 0.05247872095698183], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 186.66666666666666, 140, 468, 156.0, 446.40000000000003, 468.0, 468.0, 0.09214372373263986, 0.0684779040630263, 0.046251830076735244], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0a5c68ca-cf2c-4d2c-bc8f-1ee80f85be94", 3, 0, 0.0, 371.3333333333333, 327, 432, 355.0, 432.0, 432.0, 432.0, 0.02852307516781076, 0.028606638864591454, 0.018291164739774476], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 194.83333333333334, 140, 429, 150.0, 429.0, 429.0, 429.0, 0.09214561054145785, 0.02483612159125231, 0.05426152652001864], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 336.50000000000006, 138, 581, 430.5, 481.10000000000014, 581.0, 581.0, 0.09201607214060056, 0.024801206944146247, 0.05409538616078275], "isController": false}, {"data": ["goToProfile", 14, 0, 0.0, 265.0, 233, 418, 245.5, 372.5, 418.0, 418.0, 0.09121828535685896, 0.20812989076610328, 0.05897119619750062], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ff4d97bf-e550-46e6-92b2-e444c5fade0f", 1, 0, 0.0, 503.0, 503, 503, 503.0, 503.0, 503.0, 503.0, 1.9880715705765406, 0.3591730864811133, 1.3706821570576542], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3bcefd21-1b71-40b0-8eed-5385fb325ae0", 3, 0, 0.0, 336.0, 236, 441, 331.0, 441.0, 441.0, 441.0, 0.017144130706852508, 0.023634568210781373, 0.01099412027750633], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 148.42857142857142, 140, 160, 149.0, 158.5, 160.0, 160.0, 0.1217698376112237, 0.0904949672091223, 0.06112275051969627], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 148.64285714285717, 140, 157, 147.5, 156.5, 157.0, 157.0, 0.12178572671282925, 0.04565265732106197, 0.06872534382720345], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 947.0, 698, 1183, 889.0, 1183.0, 1183.0, 1183.0, 0.06263858787567493, 18.41782463231149, 0.035723569647845864], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1539.0, 1044, 1989, 1624.0, 1989.0, 1989.0, 1989.0, 0.06236824707804762, 56.11905835251157, 0.03550848442041188], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1690a7ca-2bb2-4ad9-a525-252c7420bd52", 1, 0, 0.0, 266.0, 266, 266, 266.0, 266.0, 266.0, 266.0, 3.7593984962406015, 0.679188204887218, 2.5919290413533833], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 271.2, 140, 465, 161.0, 465.0, 465.0, 465.0, 0.06306283580960069, 0.11159165867870746, 0.03491858193754257], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 221.53846153846155, 143, 466, 149.0, 459.2, 466.0, 466.0, 0.07272890022713795, 0.05404950495395701, 0.0365064987468251], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 237.00000000000003, 140, 446, 150.0, 444.8, 446.0, 446.0, 0.07273256236817223, 0.027864788767854445, 0.04101041264539519], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 408.6153846153845, 145, 2090, 159.0, 1432.3999999999994, 2090.0, 2090.0, 0.07273256236817223, 5.052317834653709, 0.042277987350128964], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 263.38461538461536, 142, 1079, 147.0, 824.9999999999998, 1079.0, 1079.0, 0.07273378316380767, 1.663184274536462, 0.04234972605939553], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 205.6, 139, 446, 149.0, 446.0, 446.0, 446.0, 0.06308033911990311, 0.04687904108422487, 0.03542108886127372], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 285.2857142857143, 140, 1150, 152.5, 808.5, 1150.0, 1150.0, 0.12073024551357785, 7.789736756862221, 0.07023508981467907], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 1110.0624999999998, 144, 2043, 1455.5, 1905.1000000000001, 2043.0, 2043.0, 0.08103153139465395, 45.57838669069758, 0.04328539811804268], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 236.35714285714283, 143, 1101, 148.5, 766.5, 1101.0, 1101.0, 0.1207812823521292, 2.5669224012613014, 0.07038273108047484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 779.9375, 143, 1404, 1026.0, 1394.9, 1404.0, 1404.0, 0.08103194177854983, 14.89949111307501, 0.04336475009242706], "isController": false}, {"data": ["deleteBooks", 12, 0, 0.0, 587.4166666666666, 254, 1682, 534.0, 1409.000000000001, 1682.0, 1682.0, 0.09700183495137783, 0.01752474557227041, 0.06687821823796167], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 636.0769230769231, 290, 2247, 351.0, 1706.1999999999994, 2247.0, 2247.0, 0.07266954363526597, 6.791501646244662, 0.16200526190383024], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a39b7cd5-40d2-435b-adc0-ce6e5bd2780f", 2, 0, 0.0, 251.5, 240, 263, 251.5, 263.0, 263.0, 263.0, 0.024297793760326564, 0.027975682464282243, 0.01510307200043736], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 552.3636363636365, 172, 1681, 451.0, 1095.8999999999999, 1602.099999999999, 1681.0, 0.09382263257777683, 0.057631285050216426, 0.04242175672217839], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 169.43750000000003, 145, 433, 151.5, 242.6000000000002, 433.0, 433.0, 0.08102865882376772, 0.06021758727039769, 0.040672588511149035], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 277.125, 144, 452, 153.5, 452.0, 452.0, 452.0, 0.08102947953752425, 0.09774576620969416, 0.04195886867653538], "isController": false}, {"data": ["login", 22, 0, 0.0, 2520.363636363637, 1628, 4305, 2212.5, 4060.2999999999997, 4286.7, 4305.0, 0.0904635020888845, 24.721485011071497, 0.17058281111220763], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bbaf39c1-5a9d-4556-a8d1-c785065bf3ce", 1, 0, 0.0, 770.0, 770, 770, 770.0, 770.0, 770.0, 770.0, 1.2987012987012987, 0.2346286525974026, 0.8953936688311688], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 154.92857142857142, 148, 161, 153.0, 160.5, 161.0, 161.0, 0.12703713113861564, 0.10284548995499257, 0.045157730209429786], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fadfe71b-033a-497d-8643-c90a14f7a809", 2, 0, 0.0, 291.5, 233, 350, 291.5, 350.0, 350.0, 350.0, 0.010901974892751822, 0.021559081208810976, 0.006776471698473179], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8fa21d0a-76b9-4fdc-8d9b-5fc82388346f", 3, 0, 0.0, 515.3333333333334, 236, 846, 464.0, 846.0, 846.0, 846.0, 0.054986345057644014, 0.02487988920251471, 0.035261425704283436], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=34ed7dc4-5869-4184-9312-881f568c1ebb", 1, 0, 0.0, 589.0, 589, 589, 589.0, 589.0, 589.0, 589.0, 1.697792869269949, 0.30673015704584045, 1.1705485993208828], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d09e0137-af49-413a-b4b0-103629c2e549", 1, 0, 0.0, 252.0, 252, 252, 252.0, 252.0, 252.0, 252.0, 3.968253968253968, 1.2672061011904763, 2.3677765376984126], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b83c08a8-eb71-487b-a4fc-18c5a3c12825", 3, 0, 0.0, 327.0, 233, 490, 258.0, 490.0, 490.0, 490.0, 0.015889746346682485, 0.021905298104882922, 0.010189713640287923], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 1282.8749999999998, 295, 2195, 1605.5, 2052.9, 2195.0, 2195.0, 0.08096715263826407, 60.58759578477413, 0.16914939578262345], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/30fc2703-03ee-4760-8143-8a6630583459", 3, 0, 0.0, 367.3333333333333, 260, 452, 390.0, 452.0, 452.0, 452.0, 0.021472436548949998, 0.02537969306941323, 0.013769759115049315], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0a5c68ca-cf2c-4d2c-bc8f-1ee80f85be94", 1, 0, 0.0, 565.0, 565, 565, 565.0, 565.0, 565.0, 565.0, 1.7699115044247788, 0.3197594026548673, 1.2202710176991152], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/510e6726-e741-4ebb-a803-35e367f308ea", 3, 0, 0.0, 358.0, 235, 497, 342.0, 497.0, 497.0, 497.0, 0.10324179227751394, 0.04785687246197261, 0.06620648788629638], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 527.0555555555555, 291, 920, 587.0, 915.5, 920.0, 920.0, 0.09194087180377775, 0.14249039409433134, 0.20677717555087907], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 0, 0.0, 1745.0, 1185, 2435, 1763.0, 2435.0, 2435.0, 2435.0, 0.06226029785326492, 74.4849614141804, 0.14038967553045772], "isController": false}, {"data": ["register", 22, 5, 22.727272727272727, 1096.8636363636367, 266, 1952, 1083.0, 1661.0, 1908.3499999999995, 1952.0, 0.09378623559102381, 0.029657898719391583, 0.042313711760793946], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=510e6726-e741-4ebb-a803-35e367f308ea", 1, 0, 0.0, 262.0, 262, 262, 262.0, 262.0, 262.0, 262.0, 3.8167938931297707, 0.6895574904580153, 2.6315004770992365], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 457.07142857142856, 296, 1296, 313.5, 957.0, 1296.0, 1296.0, 0.12056285630629855, 10.476009000770741, 0.26894532259175696], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 177.0, 142, 488, 152.5, 285.0000000000002, 488.0, 488.0, 0.08770295010798425, 0.06808969271078856, 0.03117565804619753], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 20, 0, 0.0, 445.04999999999995, 293, 920, 310.5, 720.5000000000002, 910.5999999999999, 920.0, 0.09752339342399759, 0.15114221226941812, 0.21933239751510392], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a14cb554-5658-405b-91fb-f15e39123aa2", 1, 0, 0.0, 294.0, 294, 294, 294.0, 294.0, 294.0, 294.0, 3.401360544217687, 1.0861766581632655, 2.0295227465986394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 149.33333333333334, 146, 153, 150.0, 153.0, 153.0, 153.0, 0.04666476550955331, 0.03467957671168952, 0.0234235248749125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 182.66666666666666, 144, 466, 148.0, 466.0, 466.0, 466.0, 0.046666459260181065, 0.012486923669228137, 0.026614465046822012], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 178.55555555555554, 139, 443, 145.0, 443.0, 443.0, 443.0, 0.04666815313376649, 0.012578525649335497, 0.027435769713405687], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 226.33333333333334, 143, 586, 147.0, 586.0, 586.0, 586.0, 0.04659856372871352, 0.012559769130004814, 0.027440365164467042], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/65e7bb57-70c6-4d45-b53e-44382375fa67", 3, 0, 0.0, 594.0, 234, 1302, 246.0, 1302.0, 1302.0, 1302.0, 0.07122168937847206, 0.03222595971226438, 0.045672763045439435], "isController": false}, {"data": ["https://demoqa.com/books", 53, 0, 0.0, 1787.1509433962262, 1156, 2590, 1706.0, 2330.2, 2426.3999999999996, 2590.0, 0.2500224076686118, 299.1137214243258, 0.49369659014251277], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=30fc2703-03ee-4760-8143-8a6630583459", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 0.4221122955607477, 1.6108717873831777], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, 22.727272727272727, 1096.8636363636367, 266, 1952, 1083.0, 1661.0, 1908.3499999999995, 1952.0, 0.0908422730388392, 0.028726933288738037, 0.04098547865619503], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 275.2, 150, 467, 158.0, 467.0, 467.0, 467.0, 0.02421530310294894, 0.006526780914466707, 0.014259597432693566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 212.2, 143, 466, 147.0, 466.0, 466.0, 466.0, 0.02421448219751269, 0.006526559654798342, 0.014235467073147108], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 526.8125, 142, 1765, 147.5, 1713.9, 1765.0, 1765.0, 0.08845643520566121, 19.91619530213401, 0.050102277753206546], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 382.62500000000006, 140, 1108, 153.0, 1004.4000000000001, 1108.0, 1108.0, 0.08845545714885948, 6.520091482292323, 0.05018810605809312], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 207.2, 148, 430, 151.0, 430.0, 430.0, 430.0, 0.02421518582733604, 0.006479454020205151, 0.013810223167152585], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 203.0, 141, 458, 149.0, 439.8, 458.0, 458.0, 0.08845790233141859, 0.06573873405684526, 0.044401720506200344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 206.8, 149, 430, 152.0, 430.0, 430.0, 430.0, 0.024214951279518025, 0.017995681566126187, 0.012154770466476821], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 274.75000000000006, 139, 466, 153.0, 456.90000000000003, 466.0, 466.0, 0.08845399010420986, 0.0568817895347873, 0.04858922796251763], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 163.8, 153, 186, 160.0, 186.0, 186.0, 186.0, 0.023425896860461305, 0.018438743036652157, 0.008327174274617105], "isController": false}, {"data": ["deleteAccount", 12, 0, 0.0, 670.6666666666666, 432, 1302, 494.5, 1225.5000000000002, 1302.0, 1302.0, 0.0982181589006114, 0.01774449159825499, 0.0668535710485607], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1291.9545454545455, 773, 2209, 1180.0, 2048.3999999999996, 2203.45, 2209.0, 0.09345278298139864, 0.04836911619154422, 0.042984629672108164], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 488.6, 308, 897, 310.0, 897.0, 897.0, 897.0, 0.02419643634885454, 0.03749975047425015, 0.05441835245255079], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bbaf39c1-5a9d-4556-a8d1-c785065bf3ce", 3, 0, 0.0, 517.3333333333333, 235, 1047, 270.0, 1047.0, 1047.0, 1047.0, 0.024161203550086174, 0.024231988326111818, 0.015494000974501878], "isController": false}, {"data": ["addBook", 58, 4, 6.896551724137931, 1500.637931034483, 749, 3504, 1182.0, 2570.8, 2895.85, 3504.0, 0.27523762972946036, 91.8709303832684, 1.0003686641958554], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=16d9cfa5-dbdc-401a-93e7-fbc7fb20a0fd", 1, 0, 0.0, 772.0, 772, 772, 772.0, 772.0, 772.0, 772.0, 1.2953367875647668, 0.23402080634715025, 0.8930739961139896], "isController": false}, {"data": ["https://demoqa.com/books-0", 53, 0, 0.0, 289.7358490566038, 143, 804, 158.0, 600.2, 609.0, 804.0, 0.25178864955770713, 0.18712027569669445, 0.12171423977643069], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3bcefd21-1b71-40b0-8eed-5385fb325ae0", 1, 0, 0.0, 585.0, 585, 585, 585.0, 585.0, 585.0, 585.0, 1.7094017094017093, 0.3088274572649573, 1.1785523504273505], "isController": false}, {"data": ["https://demoqa.com/books-3", 53, 0, 0.0, 925.2452830188678, 710, 1323, 857.0, 1266.0, 1316.3, 1323.0, 0.2514613224018826, 73.93797808787387, 0.12646736429391559], "isController": false}, {"data": ["https://demoqa.com/books-1", 53, 0, 0.0, 239.50943396226413, 139, 605, 154.0, 457.8, 508.5999999999996, 605.0, 0.25238816347133725, 0.4466087423926398, 0.12274346231320894], "isController": false}, {"data": ["https://demoqa.com/books-2", 53, 0, 0.0, 1495.6981132075473, 996, 1940, 1499.0, 1868.6000000000001, 1926.5, 1940.0, 0.25079497274379164, 225.66575732540173, 0.12588732030303604], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 20, 0, 0.0, 160.54999999999995, 146, 193, 160.5, 167.70000000000002, 191.74999999999997, 193.0, 0.0962806774308464, 0.07192843577597412, 0.034224772055496185], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 4, 2.366863905325444, 217.94674556213016, 142, 962, 160.0, 362.0, 436.5, 824.1000000000022, 0.7037649341834037, 1.4731987625813598, 0.34041440406934376], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 152.33333333333334, 146, 161, 151.0, 161.0, 161.0, 161.0, 0.046402755292492034, 0.03593494623725213, 0.016494729420378027], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/34ed7dc4-5869-4184-9312-881f568c1ebb", 3, 0, 0.0, 560.6666666666666, 252, 938, 492.0, 938.0, 938.0, 938.0, 0.023705108450871162, 0.023774557010785822, 0.015201518114653707], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 170.5, 146, 446, 154.5, 191.3000000000004, 446.0, 446.0, 0.09062759610301337, 0.07354641832187901, 0.03221527830224303], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c671a454-b374-4568-8ef5-07905188bc05", 1, 0, 0.0, 343.0, 343, 343, 343.0, 343.0, 343.0, 343.0, 2.9154518950437316, 0.9310085641399416, 1.7395909256559765], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b83c08a8-eb71-487b-a4fc-18c5a3c12825", 1, 0, 0.0, 1682.0, 1682, 1682, 1682.0, 1682.0, 1682.0, 1682.0, 0.5945303210463733, 0.10741026307966707, 0.4099007877526754], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1690a7ca-2bb2-4ad9-a525-252c7420bd52", 3, 0, 0.0, 363.3333333333333, 251, 481, 358.0, 481.0, 481.0, 481.0, 0.08406422506795191, 0.03803687267072043, 0.05390837349735198], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ff4d97bf-e550-46e6-92b2-e444c5fade0f", 3, 0, 0.0, 430.6666666666667, 285, 547, 460.0, 547.0, 547.0, 547.0, 0.029760428550171122, 0.0298476173056892, 0.01908464981895739], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 414.3333333333333, 296, 733, 301.0, 733.0, 733.0, 733.0, 0.046561196933169166, 0.07216076126263618, 0.10471722318075057], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 807.0, 291, 2003, 440.0, 1947.0, 2003.0, 2003.0, 0.08838460561131764, 26.537413099979563, 0.19312554204621413], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8fa21d0a-76b9-4fdc-8d9b-5fc82388346f", 1, 0, 0.0, 254.0, 254, 254, 254.0, 254.0, 254.0, 254.0, 3.937007874015748, 0.7112758366141733, 2.714382381889764], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 192.0, 145, 568, 159.0, 416.39999999999986, 568.0, 568.0, 0.07431586529391924, 0.061615400033727966, 0.026416967741197856], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 155.31249999999997, 148, 169, 152.5, 166.2, 169.0, 169.0, 0.08198653371183783, 0.06365165459073348, 0.029143650655379855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 20, 0, 0.0, 165.65, 144, 475, 150.0, 156.9, 459.0999999999998, 475.0, 0.09759811050058072, 0.07253140829193547, 0.0489896765598618], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 20, 0, 0.0, 178.50000000000003, 143, 471, 148.0, 391.1000000000006, 468.29999999999995, 471.0, 0.09759382426280065, 0.026113972507819702, 0.05565897789987849], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 20, 0, 0.0, 235.75, 140, 446, 150.5, 444.0, 445.9, 446.0, 0.09759620545953174, 0.026305227252764414, 0.057375894225232524], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 20, 0, 0.0, 257.25, 143, 580, 152.5, 449.7, 573.4999999999999, 580.0, 0.09759715797075989, 0.026305483984306377, 0.05747176392223458], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 55.55555555555556, 0.3968253968253968], "isController": false}, {"data": ["401/Unauthorized", 4, 44.44444444444444, 0.31746031746031744], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1260, 9, "406/Not Acceptable", 5, "401/Unauthorized", 4, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
