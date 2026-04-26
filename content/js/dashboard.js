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

    var data = {"OkPercent": 99.44881889763779, "KoPercent": 0.5511811023622047};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7547361299052774, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/48697378-d1be-4f3c-9386-21ab7b6fbd07"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8dfe0e4c-fd03-42e3-a5c3-ea2882e617d4"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b54eba0c-6764-4303-9c52-6fead54cb50c"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6923076923076923, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/313ee52a-c5da-402b-8764-bb6ef034963c"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8947368421052632, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/81b18b11-f09f-4f5b-bb83-30e4910cf4ee"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/102fa99c-7567-405d-8b7b-59653d86dac8"], "isController": false}, {"data": [0.125, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/084880dd-6e3a-40b8-9103-01c9d44c8767"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5882352941176471, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9347826086956522, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6764705882352942, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9565217391304348, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=084880dd-6e3a-40b8-9103-01c9d44c8767"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6115a705-83fd-4f40-bda5-8270db86df1a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6324e966-6b50-4415-9c5a-29d85c511c6a"], "isController": false}, {"data": [0.8095238095238095, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/2d47b82d-5dcb-4958-b660-da957a920e0f"], "isController": false}, {"data": [0.4411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=19a217ac-d4cd-4af3-b007-a94cf0d9718f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1e7388b0-b7cc-4a04-b89b-378172b920d9"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.125, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0825b2ab-0347-4e1d-9e2d-8ac668a56d98"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9e0104d6-6ff7-42c7-b6e2-982b511b88d9"], "isController": false}, {"data": [0.32608695652173914, 500, 1500, "register"], "isController": true}, {"data": [0.8043478260869565, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0e6b06f5-cdca-4e35-9715-7073b9e2a710"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=48697378-d1be-4f3c-9386-21ab7b6fbd07"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.24545454545454545, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.32608695652173914, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c1df705d-0898-4ff6-b6d1-69ffcbb7bce5"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "addBook"], "isController": true}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=102fa99c-7567-405d-8b7b-59653d86dac8"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9818181818181818, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.37272727272727274, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9822485207100592, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=81b18b11-f09f-4f5b-bb83-30e4910cf4ee"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2d47b82d-5dcb-4958-b660-da957a920e0f"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b00653a6-ec81-4269-9fa6-10f8e3824405"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b54eba0c-6764-4303-9c52-6fead54cb50c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8dfe0e4c-fd03-42e3-a5c3-ea2882e617d4"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/19a217ac-d4cd-4af3-b007-a94cf0d9718f"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0e6b06f5-cdca-4e35-9715-7073b9e2a710"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6115a705-83fd-4f40-bda5-8270db86df1a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9e0104d6-6ff7-42c7-b6e2-982b511b88d9"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0825b2ab-0347-4e1d-9e2d-8ac668a56d98"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6324e966-6b50-4415-9c5a-29d85c511c6a"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1270, 7, 0.5511811023622047, 465.14409448818924, 126, 2579, 170.5, 1292.8000000000002, 1573.5000000000005, 1989.7699999999995, 5.050906776964683, 726.4877664030187, 3.6835367346583676], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 2310.4363636363637, 1626, 3152, 2307.0, 2709.6, 2845.399999999999, 3152.0, 0.24197309259210376, 291.17699768035794, 1.1897798058605884], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/48697378-d1be-4f3c-9386-21ab7b6fbd07", 3, 0, 0.0, 400.3333333333333, 339, 487, 375.0, 487.0, 487.0, 487.0, 0.0181705854562634, 0.025049618947680825, 0.011652361116158496], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8dfe0e4c-fd03-42e3-a5c3-ea2882e617d4", 3, 0, 0.0, 407.3333333333333, 337, 461, 424.0, 461.0, 461.0, 461.0, 0.03464883406673365, 0.022275861745377268, 0.02221946715868011], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b54eba0c-6764-4303-9c52-6fead54cb50c", 3, 0, 0.0, 397.33333333333337, 239, 713, 240.0, 713.0, 713.0, 713.0, 0.09782502364104738, 0.04540966266671014, 0.06273284393647895], "isController": false}, {"data": ["deleteBook", 13, 0, 0.0, 598.0, 433, 941, 550.0, 891.0, 941.0, 941.0, 0.07003631113361851, 0.0126530444919135, 0.04760280522363133], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 0, 0.0, 598.0, 433, 941, 550.0, 891.0, 941.0, 941.0, 0.07075330499572759, 0.012782579515829692, 0.0480901369892836], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 182.73684210526318, 129, 421, 142.0, 408.0, 421.0, 421.0, 0.12859298965164837, 0.054739265023383624, 0.07220136816172938], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 156.3684210526316, 136, 424, 142.0, 151.0, 424.0, 424.0, 0.12862084605438628, 0.09558639047596482, 0.06456163561714312], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/313ee52a-c5da-402b-8764-bb6ef034963c", 1, 0, 0.0, 304.0, 304, 304, 304.0, 304.0, 304.0, 304.0, 3.289473684210526, 1.0504471628289473, 1.9627621299342106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 282.2105263157895, 128, 1133, 143.0, 804.0, 1133.0, 1133.0, 0.1286234582109154, 4.01202587023924, 0.0745785995105539], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 331.3157894736842, 129, 1668, 142.0, 1668.0, 1668.0, 1668.0, 0.12859211933348674, 12.210739112815897, 0.0744348503255411], "isController": false}, {"data": ["goToProfile", 13, 0, 0.0, 332.3076923076923, 231, 782, 254.0, 705.9999999999999, 782.0, 782.0, 0.07011223350609706, 0.15876375952582558, 0.04532646345804322], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/81b18b11-f09f-4f5b-bb83-30e4910cf4ee", 3, 0, 0.0, 403.6666666666667, 251, 581, 379.0, 581.0, 581.0, 581.0, 0.017718663067809323, 0.024426607451879065, 0.01136255411575012], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 23, 0, 0.0, 165.8695652173913, 130, 424, 142.0, 312.00000000000034, 422.4, 424.0, 0.11497585507043522, 0.08544592354355585, 0.05771248975215205], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 23, 0, 0.0, 175.78260869565216, 128, 432, 141.0, 414.0, 429.59999999999997, 432.0, 0.11498045332293509, 0.04578323247547917, 0.06473508878490657], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 996.75, 836, 1145, 1003.0, 1145.0, 1145.0, 1145.0, 0.11993283761093787, 35.264236402614536, 0.06839919644998801], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/102fa99c-7567-405d-8b7b-59653d86dac8", 3, 0, 0.0, 579.0, 241, 898, 598.0, 898.0, 898.0, 898.0, 0.08220754665278272, 0.03719677403885677, 0.05271773011262434], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1446.0, 1071, 1608, 1552.5, 1608.0, 1608.0, 1608.0, 0.11830819284235433, 106.45391988317066, 0.06735710588583259], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 138.0, 134, 142, 138.0, 142.0, 142.0, 142.0, 0.1233882411006231, 0.218339348510087, 0.06832141865630205], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/084880dd-6e3a-40b8-9103-01c9d44c8767", 3, 0, 0.0, 331.0, 253, 486, 254.0, 486.0, 486.0, 486.0, 0.03612325253765849, 0.02976170318125444, 0.023164976399475005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 156.85714285714283, 127, 402, 139.0, 276.5, 402.0, 402.0, 0.07055953712943643, 0.05243731226123157, 0.03541758016067415], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 273.0, 129, 424, 270.5, 423.5, 424.0, 424.0, 0.07046116834683001, 0.03397234902436447, 0.03933950833203315], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 364.7142857142857, 126, 1522, 140.5, 1459.5, 1522.0, 1522.0, 0.07047038985226385, 9.074763499484057, 0.04056373165882264], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 312.57142857142856, 129, 1123, 141.5, 1090.0, 1123.0, 1123.0, 0.07056344914139404, 2.980301614642924, 0.0406862074918222], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 208.25, 140, 410, 141.5, 410.0, 410.0, 410.0, 0.1233616037008481, 0.09167791056283732, 0.06927043176561296], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 942.8235294117646, 128, 1782, 1201.0, 1782.0, 1782.0, 1782.0, 0.08459521191100583, 44.78522418664192, 0.045456319635543925], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 23, 0, 0.0, 277.34782608695656, 129, 1528, 141.0, 998.2000000000014, 1501.3999999999996, 1528.0, 0.11498160294352903, 9.024874379474284, 0.06673736889597665], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 720.0588235294117, 126, 1339, 844.0, 1303.8, 1339.0, 1339.0, 0.0844129082233069, 14.609484783331927, 0.04544079520683646], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 23, 0, 0.0, 244.5217391304348, 127, 861, 138.0, 646.4000000000005, 848.3999999999999, 861.0, 0.1149844770955921, 2.968232101166343, 0.0668513266334045], "isController": false}, {"data": ["deleteBooks", 13, 0, 0.0, 438.61538461538464, 246, 690, 444.0, 647.1999999999999, 690.0, 690.0, 0.07079684572822724, 0.012790445761447305, 0.04881110652746918], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 606.7857142857143, 272, 1656, 548.0, 1598.0, 1656.0, 1656.0, 0.07040943084033656, 12.12698325135664, 0.15577890118539306], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=084880dd-6e3a-40b8-9103-01c9d44c8767", 1, 0, 0.0, 444.0, 444, 444, 444.0, 444.0, 444.0, 444.0, 2.2522522522522523, 0.4069010416666667, 1.5528223536036037], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6115a705-83fd-4f40-bda5-8270db86df1a", 1, 0, 0.0, 433.0, 433, 433, 433.0, 433.0, 433.0, 433.0, 2.3094688221709005, 0.417238019630485, 1.5922704965357968], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6324e966-6b50-4415-9c5a-29d85c511c6a", 1, 0, 0.0, 468.0, 468, 468, 468.0, 468.0, 468.0, 468.0, 2.136752136752137, 0.38603432158119655, 1.473190438034188], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 480.38095238095235, 159, 1222, 385.0, 1018.2, 1204.6999999999998, 1222.0, 0.09565237195108064, 0.058755216755107156, 0.04324907052084994], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 138.29411764705878, 129, 156, 136.0, 146.39999999999998, 156.0, 156.0, 0.08459268621587057, 0.06286624434597414, 0.042461563198200665], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 281.52941176470586, 127, 427, 396.0, 424.6, 427.0, 427.0, 0.08459142342485794, 0.09737149256590667, 0.04406451215628514], "isController": false}, {"data": ["login", 21, 0, 0.0, 2518.9523809523807, 1554, 4562, 2271.0, 4063.6, 4512.799999999999, 4562.0, 0.09695290858725761, 22.22801426881348, 0.17690389110110805], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 23, 0, 0.0, 158.52173913043478, 140, 399, 147.0, 167.6, 352.79999999999933, 399.0, 0.11921916629518665, 0.09651629771358373, 0.04237868801899213], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2d47b82d-5dcb-4958-b660-da957a920e0f", 3, 0, 0.0, 716.3333333333334, 317, 1050, 782.0, 1050.0, 1050.0, 1050.0, 0.018452567674791948, 0.025438354200111944, 0.011833189557076866], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 1109.0588235294117, 270, 1928, 1338.0, 1926.4, 1928.0, 1928.0, 0.0843546866471493, 59.417085274214756, 0.17701982180072445], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=19a217ac-d4cd-4af3-b007-a94cf0d9718f", 1, 0, 0.0, 438.0, 438, 438, 438.0, 438.0, 438.0, 438.0, 2.28310502283105, 0.4124750285388128, 1.574093892694064], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1e7388b0-b7cc-4a04-b89b-378172b920d9", 1, 0, 0.0, 265.0, 265, 265, 265.0, 265.0, 265.0, 265.0, 3.7735849056603774, 1.2050412735849056, 2.2516214622641506], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 547.6315789473684, 280, 1806, 293.0, 1806.0, 1806.0, 1806.0, 0.12847299700455064, 16.356924979799313, 0.2854786739051058], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 0, 0.0, 1654.5, 1213, 2019, 1693.0, 2019.0, 2019.0, 2019.0, 0.11781685370092192, 140.94991679184707, 0.2656631984330358], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0825b2ab-0347-4e1d-9e2d-8ac668a56d98", 1, 0, 0.0, 427.0, 427, 427, 427.0, 427.0, 427.0, 427.0, 2.34192037470726, 0.42310084894613587, 1.6146443208430914], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9e0104d6-6ff7-42c7-b6e2-982b511b88d9", 3, 0, 0.0, 469.0, 373, 592, 442.0, 592.0, 592.0, 592.0, 0.02037392951978648, 0.024081294949982002, 0.013065312875644323], "isController": false}, {"data": ["register", 23, 5, 21.73913043478261, 1132.304347826087, 420, 1744, 1139.0, 1607.8, 1719.7999999999997, 1744.0, 0.0916857014155475, 0.029025500583998054, 0.04136600981834272], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 23, 0, 0.0, 482.30434782608694, 267, 1812, 286.0, 1339.6000000000013, 1786.3999999999996, 1812.0, 0.11489372330594201, 12.114999679983516, 0.25584244729874867], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 162.70588235294116, 137, 433, 145.0, 211.3999999999998, 433.0, 433.0, 0.09026708437317474, 0.07008040241862687, 0.03208712764827696], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0e6b06f5-cdca-4e35-9715-7073b9e2a710", 1, 0, 0.0, 277.0, 277, 277, 277.0, 277.0, 277.0, 277.0, 3.6101083032490977, 0.6522168321299638, 2.4890004512635375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 13, 0, 0.0, 475.46153846153845, 272, 1433, 289.0, 1086.9999999999995, 1433.0, 1433.0, 0.08266249538997622, 7.72541625335419, 0.1842829684261061], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=48697378-d1be-4f3c-9386-21ab7b6fbd07", 1, 0, 0.0, 445.0, 445, 445, 445.0, 445.0, 445.0, 445.0, 2.247191011235955, 0.4059866573033708, 1.5493328651685394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 5, 0, 0.0, 199.2, 141, 422, 145.0, 422.0, 422.0, 422.0, 0.032893005631282564, 0.024444899692779326, 0.01651074696726488], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 5, 0, 0.0, 221.0, 133, 536, 144.0, 536.0, 536.0, 536.0, 0.032951534882494825, 0.008817109919730061, 0.01879267223767283], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 5, 0, 0.0, 198.8, 140, 402, 144.0, 402.0, 402.0, 402.0, 0.032948277793519734, 0.008880590499034616, 0.01936998362470594], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 5, 0, 0.0, 251.6, 133, 419, 145.0, 419.0, 419.0, 419.0, 0.03295327225993541, 0.008881936663810716, 0.019405100754629936], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1577.745454545454, 1069, 2579, 1505.0, 2118.6, 2265.999999999999, 2579.0, 0.2437424661419556, 291.6007280975236, 0.48129615872952564], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, 21.73913043478261, 1132.304347826087, 420, 1744, 1139.0, 1607.8, 1719.7999999999997, 1744.0, 0.09235501266869849, 0.029237388521476556, 0.04166798423138545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 4, 0, 0.0, 139.5, 135, 148, 137.5, 148.0, 148.0, 148.0, 0.028749056671577965, 0.0077487691810112485, 0.01692937614547023], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 4, 0, 0.0, 276.75, 141, 420, 273.0, 420.0, 420.0, 420.0, 0.02874967656613863, 0.007748936261967053, 0.016901665325015094], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 204.47058823529412, 128, 422, 142.0, 420.4, 422.0, 422.0, 0.08992187376026829, 0.024236755036947312, 0.05286422656609522], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 222.11764705882354, 133, 442, 141.0, 431.59999999999997, 442.0, 442.0, 0.08991759317049433, 0.0242356012842348, 0.0529495201970782], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 156.88235294117646, 134, 439, 141.0, 203.79999999999978, 439.0, 439.0, 0.08991854437744631, 0.06682423073362953, 0.04513489434571036], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 4, 0, 0.0, 276.75, 133, 419, 277.5, 419.0, 419.0, 419.0, 0.02875215641173088, 0.0076934481023576765, 0.016397714203565266], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 201.8823529411765, 129, 421, 141.0, 420.2, 421.0, 421.0, 0.0899166419836669, 0.024059726468285872, 0.051280584881310036], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 4, 0, 0.0, 276.0, 135, 420, 274.5, 420.0, 420.0, 420.0, 0.028750296487432526, 0.021366187135679837, 0.014431301166543281], "isController": false}, {"data": ["deleteAccount", 13, 0, 0.0, 639.2307692307692, 442, 1384, 535.0, 1250.3999999999999, 1384.0, 1384.0, 0.06988683708303095, 0.01262603990269602, 0.04756945844421149], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 4, 0, 0.0, 149.75, 143, 156, 150.0, 156.0, 156.0, 156.0, 0.029974896024579416, 0.02359352167559669, 0.010655138821237215], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1448.428571428571, 1026, 2260, 1470.0, 1833.0, 2217.8999999999996, 2260.0, 0.09836848835738678, 0.05091337776310057, 0.045245662125321454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 4, 0, 0.0, 557.75, 283, 841, 553.5, 841.0, 841.0, 841.0, 0.028719745543054488, 0.04450999626643309, 0.06459138084536571], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c1df705d-0898-4ff6-b6d1-69ffcbb7bce5", 1, 0, 0.0, 292.0, 292, 292, 292.0, 292.0, 292.0, 292.0, 3.4246575342465753, 1.0936162243150687, 2.043423587328767], "isController": false}, {"data": ["addBook", 57, 2, 3.508771929824561, 1369.6140350877192, 747, 2488, 1113.0, 2331.0, 2382.7999999999997, 2488.0, 0.2764668506545474, 99.70330211157619, 1.0032533357908164], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 256.99999999999994, 134, 588, 147.0, 535.0, 567.5999999999999, 588.0, 0.24488414753602025, 0.18198909792471815, 0.11837661428743165], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=102fa99c-7567-405d-8b7b-59653d86dac8", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 0.7344067581300813, 2.802654979674797], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 891.4909090909089, 637, 1263, 838.0, 1179.6, 1255.3999999999999, 1263.0, 0.2447925939113406, 71.97715048902884, 0.12311346275814491], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 211.32727272727269, 129, 548, 143.0, 425.0, 446.7999999999996, 548.0, 0.24540753267266652, 0.4342562980496794, 0.11934858522557415], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1319.4, 924, 2043, 1289.0, 1680.4, 1747.3999999999992, 2043.0, 0.24441511463068877, 219.92514978063744, 0.12268493058610745], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 13, 0, 0.0, 146.76923076923075, 137, 176, 144.0, 167.6, 176.0, 176.0, 0.08343174000102685, 0.06232937607498588, 0.029657376328490012], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 2, 1.183431952662722, 197.90532544378704, 129, 590, 147.0, 292.0, 407.0, 590.0, 0.7228802285841386, 1.569976256432137, 0.3478435031139456], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 5, 0, 0.0, 149.0, 145, 154, 149.0, 154.0, 154.0, 154.0, 0.03311082856537402, 0.02564149126205234, 0.011769864841597795], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=81b18b11-f09f-4f5b-bb83-30e4910cf4ee", 1, 0, 0.0, 524.0, 524, 524, 524.0, 524.0, 524.0, 524.0, 1.9083969465648853, 0.34477874522900764, 1.3157502385496183], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 174.10526315789474, 135, 439, 145.0, 404.0, 439.0, 439.0, 0.13032712107389546, 0.10576351329336635, 0.04632721881923628], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2d47b82d-5dcb-4958-b660-da957a920e0f", 1, 0, 0.0, 583.0, 583, 583, 583.0, 583.0, 583.0, 583.0, 1.7152658662092624, 0.3098868996569468, 1.182595411663808], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 5, 0, 0.0, 482.0, 286, 958, 313.0, 958.0, 958.0, 958.0, 0.032856908164941676, 0.050921790290783635, 0.07389595654673894], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 431.9411764705883, 272, 882, 295.0, 633.9999999999998, 882.0, 882.0, 0.08985010887719075, 0.1392501199102556, 0.20207500072672882], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b00653a6-ec81-4269-9fa6-10f8e3824405", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 1.2621973814229248, 2.3584177371541504], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 147.21428571428572, 136, 161, 146.0, 157.0, 161.0, 161.0, 0.07057234169111494, 0.05851163876538729, 0.025086262085513518], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b54eba0c-6764-4303-9c52-6fead54cb50c", 1, 0, 0.0, 249.0, 249, 249, 249.0, 249.0, 249.0, 249.0, 4.016064257028112, 0.725558483935743, 2.7688880522088355], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8dfe0e4c-fd03-42e3-a5c3-ea2882e617d4", 1, 0, 0.0, 690.0, 690, 690, 690.0, 690.0, 690.0, 690.0, 1.4492753623188406, 0.26183197463768115, 0.9992074275362319], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/19a217ac-d4cd-4af3-b007-a94cf0d9718f", 3, 0, 0.0, 620.0, 231, 1384, 245.0, 1384.0, 1384.0, 1384.0, 0.03238586680772511, 0.02651381999395464, 0.020768280472401843], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 169.11764705882354, 137, 516, 143.0, 248.79999999999976, 516.0, 516.0, 0.08397135095085206, 0.06519260156828847, 0.029849191158310695], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0e6b06f5-cdca-4e35-9715-7073b9e2a710", 3, 0, 0.0, 360.0, 228, 570, 282.0, 570.0, 570.0, 570.0, 0.06891798759476223, 0.03118359464736963, 0.04419545428440156], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6115a705-83fd-4f40-bda5-8270db86df1a", 3, 0, 0.0, 343.0, 252, 480, 297.0, 480.0, 480.0, 480.0, 0.023153329062830418, 0.02736645111560457, 0.014847675212817683], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9e0104d6-6ff7-42c7-b6e2-982b511b88d9", 1, 0, 0.0, 478.0, 478, 478, 478.0, 478.0, 478.0, 478.0, 2.092050209205021, 0.377958289748954, 1.4423705543933054], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0825b2ab-0347-4e1d-9e2d-8ac668a56d98", 3, 0, 0.0, 344.0, 237, 523, 272.0, 523.0, 523.0, 523.0, 0.023790076366145135, 0.02811906487157324, 0.01525600600302927], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 13, 0, 0.0, 139.30769230769232, 133, 147, 141.0, 146.6, 147.0, 147.0, 0.08288596166843065, 0.0615978679977302, 0.041604867478098974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 13, 0, 0.0, 221.07692307692307, 127, 420, 140.0, 419.6, 420.0, 420.0, 0.08288279098235234, 0.03175347310772212, 0.046733641009129856], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 13, 0, 0.0, 263.61538461538464, 128, 1291, 136.0, 935.3999999999996, 1291.0, 1291.0, 0.08288437629506838, 5.757506664621123, 0.04817903423762313], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6324e966-6b50-4415-9c5a-29d85c511c6a", 3, 0, 0.0, 392.6666666666667, 238, 535, 405.0, 535.0, 535.0, 535.0, 0.051127358249399256, 0.03286996502036573, 0.03278674991904835], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 13, 0, 0.0, 267.0769230769231, 129, 694, 141.0, 585.5999999999999, 694.0, 694.0, 0.08273298882468244, 1.8918334783812336, 0.048171829655958044], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 71.42857142857143, 0.3937007874015748], "isController": false}, {"data": ["401/Unauthorized", 2, 28.571428571428573, 0.15748031496062992], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1270, 7, "406/Not Acceptable", 5, "401/Unauthorized", 2, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
