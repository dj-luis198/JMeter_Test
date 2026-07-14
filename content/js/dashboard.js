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

    var data = {"OkPercent": 98.77112135176651, "KoPercent": 1.228878648233487};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7457010582010583, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ed7d0781-147a-4d86-bac2-f2e66d431a01"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=14a77823-70da-4379-9d8a-a8b0b6afa7f5"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6538461538461539, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/eb4d5111-b11b-4d64-bc30-24b6702836c1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/41ba6663-ed52-47b4-a20b-2679d01c9c4f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b1c94d7c-5df4-4c27-87c0-91c94511b789"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3d459458-b193-45bb-a8b2-d8b8cb26dc7e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/5c169f3d-2b7b-4449-990b-6de43782bfd5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5555555555555556, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/e33377eb-0726-4c68-9d79-0e030a3c86f5"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bd911d0c-b760-467a-b96a-14249ce8d17f"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7c6d42a3-3825-4da6-909e-bf824db9b206"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eb4d5111-b11b-4d64-bc30-24b6702836c1"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/750549d0-2148-42b0-a023-fee97d939bcc"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.22727272727272727, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8421052631578947, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.3125, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.22727272727272727, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=742ec536-aa3b-4d9a-8fa5-ac92a4d4cba6"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b1c94d7c-5df4-4c27-87c0-91c94511b789"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.46153846153846156, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/07ad35d3-6c49-4706-b698-41468c0d4268"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/bd911d0c-b760-467a-b96a-14249ce8d17f"], "isController": false}, {"data": [0.325, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7c6d42a3-3825-4da6-909e-bf824db9b206"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ed7d0781-147a-4d86-bac2-f2e66d431a01"], "isController": false}, {"data": [0.9107142857142857, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/2e578136-7419-4eb9-a90c-a918d4ddb9a2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9821428571428571, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4107142857142857, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/14a77823-70da-4379-9d8a-a8b0b6afa7f5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e33377eb-0726-4c68-9d79-0e030a3c86f5"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2e578136-7419-4eb9-a90c-a918d4ddb9a2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c12481fa-77fb-473c-9457-745514eeed76"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/59704518-a556-4da2-96fb-c1eb1971e8a0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c12481fa-77fb-473c-9457-745514eeed76"], "isController": false}, {"data": [0.5625, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=750549d0-2148-42b0-a023-fee97d939bcc"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/3d459458-b193-45bb-a8b2-d8b8cb26dc7e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/742ec536-aa3b-4d9a-8fa5-ac92a4d4cba6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1302, 16, 1.228878648233487, 456.25576036866346, 125, 2650, 152.5, 1270.7, 1557.3999999999996, 2058.7000000000003, 5.07234519997195, 693.0682202367387, 3.711600244316013], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 2189.803571428571, 1598, 3025, 2151.0, 2680.5000000000005, 2796.6, 3025.0, 0.2538450729124643, 305.4605490830413, 1.2481542403459547], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ed7d0781-147a-4d86-bac2-f2e66d431a01", 1, 0, 0.0, 541.0, 541, 541, 541.0, 541.0, 541.0, 541.0, 1.8484288354898337, 0.3339446626617375, 1.2744050369685767], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=14a77823-70da-4379-9d8a-a8b0b6afa7f5", 1, 0, 0.0, 425.0, 425, 425, 425.0, 425.0, 425.0, 425.0, 2.352941176470588, 0.4250919117647059, 1.6222426470588236], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 590.8461538461538, 149, 1319, 511.0, 1179.8, 1319.0, 1319.0, 0.0664533344238496, 0.012589791873268379, 0.044922893365401326], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 590.8461538461538, 149, 1319, 511.0, 1179.8, 1319.0, 1319.0, 0.06673956680887329, 0.01264401949308732, 0.04511638834983854], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 13, 0, 0.0, 154.46153846153845, 129, 398, 134.0, 295.19999999999993, 398.0, 398.0, 0.06262072553335998, 0.01675593632435609, 0.03571338253074437], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 13, 0, 0.0, 137.6153846153846, 132, 144, 139.0, 143.2, 144.0, 144.0, 0.06261620121957094, 0.04653411047665379, 0.03143039787779244], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eb4d5111-b11b-4d64-bc30-24b6702836c1", 3, 0, 0.0, 384.33333333333337, 244, 648, 261.0, 648.0, 648.0, 648.0, 0.022081229482857605, 0.02609926570711457, 0.014160163437900223], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 13, 0, 0.0, 199.07692307692307, 130, 422, 137.0, 421.6, 422.0, 422.0, 0.06262012225374637, 0.016878079826205077, 0.03687493527246979], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 13, 0, 0.0, 193.4615384615385, 131, 399, 134.0, 396.6, 399.0, 399.0, 0.0626204238921002, 0.01687816112716763, 0.036813960139691716], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/41ba6663-ed52-47b4-a20b-2679d01c9c4f", 1, 0, 0.0, 413.0, 413, 413, 413.0, 413.0, 413.0, 413.0, 2.4213075060532687, 0.7732105024213075, 1.444745006053269], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b1c94d7c-5df4-4c27-87c0-91c94511b789", 1, 0, 0.0, 484.0, 484, 484, 484.0, 484.0, 484.0, 484.0, 2.066115702479339, 0.37327285640495866, 1.4244899276859504], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 417.76923076923083, 141, 1940, 260.0, 1366.3999999999996, 1940.0, 1940.0, 0.0667536175325809, 0.1646876733026609, 0.043150156164953324], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3d459458-b193-45bb-a8b2-d8b8cb26dc7e", 1, 0, 0.0, 491.0, 491, 491, 491.0, 491.0, 491.0, 491.0, 2.0366598778004072, 0.3679512474541752, 1.404181517311609], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 165.1052631578947, 132, 395, 136.0, 393.0, 395.0, 395.0, 0.0966183574879227, 0.07180329106280194, 0.04849788647342995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 179.4736842105263, 131, 420, 138.0, 416.0, 420.0, 420.0, 0.09649127261831607, 0.025818953806072856, 0.05503017891513339], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 1015.25, 771, 1197, 1046.5, 1197.0, 1197.0, 1197.0, 0.026353412437493, 7.748778272270282, 0.015029680530757728], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1369.25, 1111, 1659, 1353.5, 1659.0, 1659.0, 1659.0, 0.026368352703085757, 23.72629011285655, 0.015012450806541988], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 337.25, 133, 419, 398.5, 419.0, 419.0, 419.0, 0.026493048886298456, 0.04688027791208282, 0.014669490936065649], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 157.71428571428575, 132, 435, 135.5, 289.0, 435.0, 435.0, 0.07274163211439141, 0.05405896683501159, 0.03651288955741913], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 192.35714285714286, 130, 422, 135.5, 409.0, 422.0, 422.0, 0.07264387378645815, 0.027231318200922578, 0.040993927101872656], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 263.57142857142856, 127, 1426, 133.0, 913.0, 1426.0, 1426.0, 0.07274427788314151, 4.693594159998441, 0.04231914603413785], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 260.07142857142856, 129, 826, 136.5, 623.5, 826.0, 826.0, 0.07264387378645815, 1.5438748728732208, 0.0423316770097706], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5c169f3d-2b7b-4449-990b-6de43782bfd5", 1, 0, 0.0, 1322.0, 1322, 1322, 1322.0, 1322.0, 1322.0, 1322.0, 0.7564296520423601, 0.24155517208774582, 0.45134620839636913], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 201.25, 132, 399, 137.0, 399.0, 399.0, 399.0, 0.026492697950127497, 0.019688421035202172, 0.014876270821604793], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 906.5, 130, 1854, 1303.5, 1732.5000000000002, 1854.0, 1854.0, 0.1011753199669494, 50.58863704548393, 0.05464960316791169], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 161.6842105263158, 127, 396, 135.0, 392.0, 396.0, 396.0, 0.09662130550639735, 0.026042461249771158, 0.05680275968247188], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 692.3333333333333, 128, 1271, 928.0, 1201.7, 1271.0, 1271.0, 0.10117133928370692, 16.53863779114863, 0.05474625314755278], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 177.3157894736842, 130, 423, 135.0, 403.0, 423.0, 423.0, 0.0964932327772276, 0.026007941646987127, 0.05682169859830883], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 700.3846153846154, 143, 1455, 535.0, 1449.8, 1455.0, 1455.0, 0.06673477035538831, 0.012643110789985678, 0.04564453756654227], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/e33377eb-0726-4c68-9d79-0e030a3c86f5", 3, 0, 0.0, 971.6666666666666, 338, 1881, 696.0, 1881.0, 1881.0, 1881.0, 0.06698372295532186, 0.030308390269497845, 0.04295505671288544], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 483.92857142857144, 266, 1566, 280.5, 1201.0, 1566.0, 1566.0, 0.07259264636492324, 6.307757131903431, 0.16193588384139543], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 748.7999999999998, 151, 1782, 679.0, 1657.1000000000001, 1775.8999999999999, 1782.0, 0.0872630807358023, 0.05360202908478481, 0.039455865606129355], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 150.1111111111111, 128, 397, 135.0, 168.40000000000038, 397.0, 397.0, 0.10117020200317, 0.07518605832462145, 0.05078269905237244], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 195.55555555555554, 125, 420, 136.0, 403.8, 420.0, 420.0, 0.10117190793356377, 0.1114910912514403, 0.052979126268161765], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bd911d0c-b760-467a-b96a-14249ce8d17f", 1, 0, 0.0, 503.0, 503, 503, 503.0, 503.0, 503.0, 503.0, 1.9880715705765406, 0.3591730864811133, 1.3706821570576542], "isController": false}, {"data": ["login", 20, 0, 0.0, 3124.8, 1915, 4673, 2974.0, 4488.400000000001, 4665.349999999999, 4673.0, 0.08912735407623953, 21.44910702746905, 0.1640326284102354], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 170.63157894736844, 133, 443, 142.0, 402.0, 443.0, 443.0, 0.0933587531201478, 0.07558047493808841, 0.03318611927317754], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7c6d42a3-3825-4da6-909e-bf824db9b206", 1, 0, 0.0, 601.0, 601, 601, 601.0, 601.0, 601.0, 601.0, 1.663893510815308, 0.3006057612312812, 1.1471765806988352], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eb4d5111-b11b-4d64-bc30-24b6702836c1", 1, 0, 0.0, 1006.0, 1006, 1006, 1006.0, 1006.0, 1006.0, 1006.0, 0.9940357852882703, 0.17958654324055665, 0.6853410785288271], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 1095.7777777777778, 268, 1993, 1493.0, 1869.7000000000003, 1993.0, 1993.0, 0.10109349463362031, 67.26016972474488, 0.21299179528005707], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/750549d0-2148-42b0-a023-fee97d939bcc", 3, 0, 0.0, 518.3333333333333, 217, 1104, 234.0, 1104.0, 1104.0, 1104.0, 0.02094109270621741, 0.024751662635506322, 0.013429021038817808], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 13, 0, 0.0, 396.76923076923066, 265, 564, 280.0, 560.4, 564.0, 564.0, 0.06257611421584909, 0.09698075513725829, 0.14073514749912153], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, 33.333333333333336, 1109.0, 141, 2059, 1377.5, 2059.0, 2059.0, 2059.0, 0.03942621712017769, 31.448491495436418, 0.06797557258366572], "isController": false}, {"data": ["register", 22, 6, 27.272727272727273, 1224.0000000000002, 197, 2077, 1289.5, 1827.8, 2040.2499999999995, 2077.0, 0.09112145661790289, 0.02866960602395666, 0.0411114384350304], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 20, 0, 0.0, 154.25000000000003, 132, 401, 137.0, 166.00000000000003, 389.29999999999984, 401.0, 0.09503670792843737, 0.07378338164365987, 0.03378257977143672], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 388.2631578947369, 265, 819, 283.0, 789.0, 819.0, 819.0, 0.09642418521563492, 0.14943865423555922, 0.21686025249180396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 499.9999999999999, 265, 1671, 527.0, 971.7999999999994, 1671.0, 1671.0, 0.11884787472035793, 8.537084250908837, 0.2655029296875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 203.75, 132, 405, 139.5, 405.0, 405.0, 405.0, 0.04966537950558115, 0.03690952519897193, 0.02492969244713741], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 231.125, 131, 397, 135.0, 397.0, 397.0, 397.0, 0.04966938813522491, 0.0226155783379381, 0.027805641355974298], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 398.625, 132, 1441, 266.5, 1441.0, 1441.0, 1441.0, 0.04926897163338958, 5.55315799673901, 0.028435509995442622], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 354.125, 131, 1092, 264.5, 1092.0, 1092.0, 1092.0, 0.049375096435735226, 1.8263843349791697, 0.028544977626909426], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 143.0, 143, 143, 143.0, 143.0, 143.0, 143.0, 6.993006993006993, 2.0623907342657346, 4.3228256118881125], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1481.7321428571424, 1035, 2476, 1325.0, 2115.6000000000004, 2222.3, 2476.0, 0.24180455283429478, 289.28231005388784, 0.4774695369442813], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, 27.272727272727273, 1224.0000000000002, 197, 2077, 1289.5, 1827.8, 2040.2499999999995, 2077.0, 0.08883182117346836, 0.02794921646295915, 0.04007841931849842], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 250.42857142857144, 131, 414, 147.0, 414.0, 414.0, 414.0, 0.04071377056045414, 0.010973633471372405, 0.023975003562454925], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 209.0, 132, 391, 141.0, 391.0, 391.0, 391.0, 0.04071495460282561, 0.010973952607792842, 0.02393594010830178], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 20, 0, 0.0, 179.85000000000002, 125, 1043, 134.0, 145.5, 998.1499999999994, 1043.0, 0.09167583425009168, 4.147977867448203, 0.05350144389438944], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 20, 0, 0.0, 220.3, 128, 786, 136.5, 421.50000000000006, 767.8999999999997, 786.0, 0.09167709493621566, 1.3712798437593108, 0.053591708035955754], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 20, 0, 0.0, 150.20000000000002, 127, 396, 137.0, 147.70000000000002, 383.5999999999998, 396.0, 0.09167415338919345, 0.06812893625896116, 0.046016127775435], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 172.85714285714286, 132, 389, 135.0, 389.0, 389.0, 389.0, 0.04071661237785017, 0.010894874796416938, 0.023221192996742673], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=742ec536-aa3b-4d9a-8fa5-ac92a4d4cba6", 1, 0, 0.0, 1455.0, 1455, 1455, 1455.0, 1455.0, 1455.0, 1455.0, 0.6872852233676976, 0.12416774054982817, 0.4738509450171821], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b1c94d7c-5df4-4c27-87c0-91c94511b789", 3, 0, 0.0, 361.0, 228, 510, 345.0, 510.0, 510.0, 510.0, 0.07404847706965494, 0.033456798884336274, 0.047485514266673245], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 20, 0, 0.0, 161.10000000000005, 129, 394, 134.0, 368.40000000000055, 393.95, 394.0, 0.09167625447494718, 0.031415232124276334, 0.05189914523352234], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 139.14285714285714, 134, 143, 141.0, 143.0, 143.0, 143.0, 0.040716375544581525, 0.030258947059986857, 0.020437711943276274], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 184.14285714285714, 135, 392, 150.0, 392.0, 392.0, 392.0, 0.038620476576680954, 0.030398539180473486, 0.013728372533117058], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 867.8461538461537, 141, 2117, 728.0, 2055.4, 2117.0, 2117.0, 0.06643499591169257, 0.01244658051410466, 0.0452149235997547], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1583.2999999999997, 1078, 2650, 1458.0, 2407.3, 2638.3999999999996, 2650.0, 0.0882110360827243, 0.04565610266000379, 0.0405736308544562], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 393.2857142857143, 276, 550, 291.0, 550.0, 550.0, 550.0, 0.04068135457287484, 0.06304815401089098, 0.09149331990364332], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/07ad35d3-6c49-4706-b698-41468c0d4268", 1, 0, 0.0, 272.0, 272, 272, 272.0, 272.0, 272.0, 272.0, 3.676470588235294, 1.174029181985294, 2.193675321691176], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bd911d0c-b760-467a-b96a-14249ce8d17f", 3, 0, 0.0, 886.3333333333334, 265, 1963, 431.0, 1963.0, 1963.0, 1963.0, 0.01840999048817158, 0.025379658111134976, 0.011805885827375654], "isController": false}, {"data": ["addBook", 60, 6, 10.0, 1321.1333333333334, 676, 3145, 1081.0, 2266.6, 2471.6499999999996, 3145.0, 0.28548046362027296, 80.7285223531203, 1.0410372218944484], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/7c6d42a3-3825-4da6-909e-bf824db9b206", 3, 0, 0.0, 404.0, 233, 728, 251.0, 728.0, 728.0, 728.0, 0.02576500596889305, 0.02584048938481754, 0.016522481041249776], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ed7d0781-147a-4d86-bac2-f2e66d431a01", 3, 0, 0.0, 663.3333333333334, 252, 1242, 496.0, 1242.0, 1242.0, 1242.0, 0.041726938911761435, 0.034786032081061534, 0.02675848621620118], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 229.67857142857144, 131, 570, 140.5, 539.2, 563.0, 570.0, 0.2427657960333803, 0.18041481521621328, 0.11735260648097973], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2e578136-7419-4eb9-a90c-a918d4ddb9a2", 3, 0, 0.0, 1036.3333333333333, 398, 1940, 771.0, 1940.0, 1940.0, 1940.0, 0.022455930236910067, 0.0265421493132228, 0.014400450054268498], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 851.0, 626, 1265, 805.5, 1133.3000000000002, 1211.3999999999999, 1265.0, 0.24243053932136766, 71.282628011983, 0.12192551538135189], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 223.64285714285705, 130, 532, 141.0, 414.90000000000003, 488.04999999999995, 532.0, 0.24296802801074266, 0.42993951831588445, 0.11816218549741195], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1249.2857142857144, 901, 1960, 1184.0, 1629.2, 1677.0, 1960.0, 0.24241374832258344, 218.12431685857757, 0.12168033851348427], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/14a77823-70da-4379-9d8a-a8b0b6afa7f5", 3, 0, 0.0, 797.0, 506, 1085, 800.0, 1085.0, 1085.0, 1085.0, 0.017948487839899486, 0.024743439453767686, 0.011509935235873044], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 171.05882352941177, 133, 399, 142.0, 398.2, 399.0, 399.0, 0.10940355754627128, 0.08173214992470461, 0.03888954584652611], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 6, 3.409090909090909, 209.77272727272725, 128, 1523, 146.5, 340.4000000000001, 426.55000000000007, 1013.2599999999932, 0.7419398354242547, 1.516542083480878, 0.3584549524484014], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 142.75, 133, 156, 143.5, 156.0, 156.0, 156.0, 0.04718956638687186, 0.03654426381327089, 0.01677441617658336], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e33377eb-0726-4c68-9d79-0e030a3c86f5", 1, 0, 0.0, 1442.0, 1442, 1442, 1442.0, 1442.0, 1442.0, 1442.0, 0.6934812760055479, 0.12528714459084606, 0.4781228328710125], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2e578136-7419-4eb9-a90c-a918d4ddb9a2", 1, 0, 0.0, 518.0, 518, 518, 518.0, 518.0, 518.0, 518.0, 1.9305019305019306, 0.3487723214285714, 1.3309905888030888], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c12481fa-77fb-473c-9457-745514eeed76", 3, 0, 0.0, 398.6666666666667, 260, 494, 442.0, 494.0, 494.0, 494.0, 0.024145452204077364, 0.02407471357457323, 0.015483900013682423], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 13, 0, 0.0, 141.15384615384616, 129, 151, 142.0, 151.0, 151.0, 151.0, 0.06254600739967381, 0.050757550926883714, 0.022233151067852796], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/59704518-a556-4da2-96fb-c1eb1971e8a0", 1, 0, 0.0, 274.0, 274, 274, 274.0, 274.0, 274.0, 274.0, 3.6496350364963503, 1.1654596259124086, 2.1776630930656933], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c12481fa-77fb-473c-9457-745514eeed76", 1, 0, 0.0, 961.0, 961, 961, 961.0, 961.0, 961.0, 961.0, 1.040582726326743, 0.18799590270551508, 0.7174330124869928], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 671.875, 269, 1574, 549.0, 1574.0, 1574.0, 1574.0, 0.04922471080482402, 7.427986026719788, 0.10913320283657395], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=750549d0-2148-42b0-a023-fee97d939bcc", 1, 0, 0.0, 535.0, 535, 535, 535.0, 535.0, 535.0, 535.0, 1.8691588785046729, 0.3376898364485981, 1.288697429906542], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 20, 0, 0.0, 386.0, 266, 1176, 279.0, 791.4000000000005, 1158.1999999999998, 1176.0, 0.09161788014548919, 5.615232138235348, 0.20487869506362863], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3d459458-b193-45bb-a8b2-d8b8cb26dc7e", 3, 0, 0.0, 941.0, 264, 2117, 442.0, 2117.0, 2117.0, 2117.0, 0.021651270207852194, 0.02559106839997113, 0.013884440855946882], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 143.07142857142858, 133, 161, 140.0, 160.5, 161.0, 161.0, 0.07092378226398845, 0.05880301869348261, 0.025211188226652144], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/742ec536-aa3b-4d9a-8fa5-ac92a4d4cba6", 3, 0, 0.0, 515.3333333333334, 360, 814, 372.0, 814.0, 814.0, 814.0, 0.01896777375239468, 0.02614860737024462, 0.012163578871164557], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 173.0, 135, 408, 145.5, 401.7, 408.0, 408.0, 0.10279253040945692, 0.07980474772999828, 0.03653953229398663], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 152.64705882352942, 127, 392, 136.0, 208.79999999999984, 392.0, 392.0, 0.11896514321303858, 0.08841061912609606, 0.05971492540185726], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 199.1764705882353, 129, 423, 134.0, 422.2, 423.0, 423.0, 0.11896347821218886, 0.042342469611829164, 0.06725864846991973], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 323.4117647058824, 127, 1528, 141.0, 639.9999999999992, 1528.0, 1528.0, 0.11896847335456104, 6.327123117061478, 0.0693390470275377], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 282.4117647058824, 126, 1057, 134.0, 545.7999999999995, 1057.0, 1057.0, 0.11896847335456104, 2.0878666372161376, 0.06945522717729802], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 37.5, 0.4608294930875576], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 6.25, 0.07680491551459294], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 6.25, 0.07680491551459294], "isController": false}, {"data": ["401/Unauthorized", 8, 50.0, 0.6144393241167435], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1302, 16, "401/Unauthorized", 8, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
