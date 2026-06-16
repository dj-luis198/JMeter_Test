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

    var data = {"OkPercent": 96.47779479326186, "KoPercent": 3.5222052067381315};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6973856209150326, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3c427590-80d4-44d8-a631-e548180eeaf9"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/73267461-0bfc-4458-b7db-bc567dc25807"], "isController": false}, {"data": [0.3125, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.3125, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8055555555555556, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=443b51ee-1f66-4123-973f-fe8b98a1e3a4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6ddb37fd-d59c-4a7a-875b-80340c304087"], "isController": false}, {"data": [0.6875, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1db74260-5b30-4de8-8dde-8fe51f914bf0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2c03584b-63e1-40a9-9d6c-f8ee842fc8b7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.43333333333333335, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.4375, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7391304347826086, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/443b51ee-1f66-4123-973f-fe8b98a1e3a4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=117193eb-ced4-4e02-85ca-c874a1659431"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/19c398b2-9603-4846-a5e7-5b8e0d98d88d"], "isController": false}, {"data": [0.43333333333333335, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=87e50444-8481-40d6-b7df-4e92a53d4552"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.18, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.6578947368421053, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.22727272727272727, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.18, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.4375, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6ddb37fd-d59c-4a7a-875b-80340c304087"], "isController": false}, {"data": [0.1956521739130435, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2ea61244-d756-456c-9266-fc4d3a0b5218"], "isController": false}, {"data": [0.21052631578947367, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6f46f897-1629-4a3d-b9e2-7af26f2a9c7d"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ff71b10a-2ff3-4c95-bc25-ef2dbfb0f3ca"], "isController": false}, {"data": [0.9818181818181818, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.2909090909090909, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/2c03584b-63e1-40a9-9d6c-f8ee842fc8b7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8875739644970414, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/3c427590-80d4-44d8-a631-e548180eeaf9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6f46f897-1629-4a3d-b9e2-7af26f2a9c7d"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1db74260-5b30-4de8-8dde-8fe51f914bf0"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2ea61244-d756-456c-9266-fc4d3a0b5218"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fc6ea447-e6e0-4752-aff8-943e43d7c4a6"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/117193eb-ced4-4e02-85ca-c874a1659431"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=19c398b2-9603-4846-a5e7-5b8e0d98d88d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=73267461-0bfc-4458-b7db-bc567dc25807"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/87e50444-8481-40d6-b7df-4e92a53d4552"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/860001a3-eab6-49be-859d-f37ca6ae30bb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d0c01b7d-1640-49ab-9b4e-4bae2395aef1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1306, 46, 3.5222052067381315, 505.1784073506895, 140, 3198, 159.0, 1451.8999999999994, 1765.2999999999997, 2326.8100000000013, 5.049470114946972, 724.8247170728441, 3.687041564127497], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 2440.8727272727283, 1711, 3142, 2374.0, 3004.2, 3040.6, 3142.0, 0.23921259911012915, 287.8526117734461, 1.1762064809760744], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3c427590-80d4-44d8-a631-e548180eeaf9", 1, 0, 0.0, 629.0, 629, 629, 629.0, 629.0, 629.0, 629.0, 1.589825119236884, 0.28722426470588236, 1.0961098966613672], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/73267461-0bfc-4458-b7db-bc567dc25807", 3, 0, 0.0, 476.0, 267, 839, 322.0, 839.0, 839.0, 839.0, 0.0631805067076638, 0.028587533959522356, 0.04051614525198492], "isController": false}, {"data": ["deleteBook", 16, 5, 31.25, 774.0625, 151, 3198, 607.5, 2059.800000000001, 3198.0, 3198.0, 0.08759539686189491, 0.0189529835129039, 0.058227628614678804], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 5, 31.25, 774.0625, 151, 3198, 607.5, 2059.800000000001, 3198.0, 3198.0, 0.08862351070959737, 0.019175436124604657, 0.05891105072865143], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 238.05555555555557, 141, 573, 150.5, 500.10000000000014, 573.0, 573.0, 0.08110628979277343, 0.042005243183692226, 0.0451206540546386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 149.33333333333334, 141, 161, 149.0, 157.4, 161.0, 161.0, 0.0811070207138319, 0.060275823010962966, 0.040711922506747655], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 268.1666666666667, 141, 887, 149.0, 883.4, 887.0, 887.0, 0.0811106755167426, 3.9930901731037, 0.04660167392156597], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 431.2777777777778, 141, 1641, 150.0, 1623.0, 1641.0, 1641.0, 0.0811070207138319, 12.181590698770778, 0.04652036800057676], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=443b51ee-1f66-4123-973f-fe8b98a1e3a4", 1, 0, 0.0, 526.0, 526, 526, 526.0, 526.0, 526.0, 526.0, 1.9011406844106464, 0.34346779942965777, 1.3107473859315588], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6ddb37fd-d59c-4a7a-875b-80340c304087", 1, 0, 0.0, 277.0, 277, 277, 277.0, 277.0, 277.0, 277.0, 3.6101083032490977, 0.6522168321299638, 2.4890004512635375], "isController": false}, {"data": ["goToProfile", 16, 5, 31.25, 226.0, 148, 318, 251.5, 292.1, 318.0, 318.0, 0.088065476681913, 0.11451092011910856, 0.056906079201136044], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/1db74260-5b30-4de8-8dde-8fe51f914bf0", 3, 0, 0.0, 414.0, 258, 526, 458.0, 526.0, 526.0, 526.0, 0.044382637512205225, 0.028533759468296005, 0.028461522102553483], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 147.21428571428572, 141, 151, 149.5, 151.0, 151.0, 151.0, 0.08863508303207956, 0.06587040838614508, 0.044490656912586815], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 1217.25, 1026, 1481, 1182.0, 1481.0, 1481.0, 1481.0, 0.04072283023670145, 11.97386421481293, 0.023224739119368797], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 165.49999999999997, 140, 433, 146.0, 291.0, 433.0, 433.0, 0.08863788889873754, 0.03322684256011548, 0.05001956760538412], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 1504.75, 1267, 1824, 1506.5, 1824.0, 1824.0, 1824.0, 0.04062790426034361, 36.55705966969514, 0.023130925960722973], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 290.625, 140, 445, 287.0, 445.0, 445.0, 445.0, 0.04093327875562833, 0.07243271592304544, 0.022665204154727794], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 219.58333333333334, 143, 445, 151.5, 439.0, 445.0, 445.0, 0.07150731460238954, 0.05314166641837738, 0.03589332002502756], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2c03584b-63e1-40a9-9d6c-f8ee842fc8b7", 1, 0, 0.0, 562.0, 562, 562, 562.0, 562.0, 562.0, 562.0, 1.779359430604982, 0.3214663033807829, 1.2267849199288254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 266.83333333333337, 142, 447, 148.5, 446.1, 447.0, 447.0, 0.0715009235535959, 0.019132083060239526, 0.04077787046416016], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 207.41666666666669, 143, 586, 148.5, 540.1000000000001, 586.0, 586.0, 0.07162340414102648, 0.019304745647386042, 0.04210672782509565], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 243.24999999999997, 142, 445, 148.0, 445.0, 445.0, 445.0, 0.07149666348903719, 0.01927058508102955, 0.04210203914442326], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 251.25000000000003, 142, 428, 150.5, 428.0, 428.0, 428.0, 0.040931603290900904, 0.030418896586304284, 0.02298405458229299], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 1081.1999999999998, 147, 2195, 1543.0, 1971.8000000000002, 2195.0, 2195.0, 0.07003193456216035, 37.816465011170095, 0.03756009615384616], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 260.42857142857144, 140, 1738, 148.0, 944.0, 1738.0, 1738.0, 0.08863788889873754, 5.719079078055159, 0.05156528971927114], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 767.8000000000002, 145, 1356, 1125.0, 1338.6, 1356.0, 1356.0, 0.0700316075988963, 12.362521024072198, 0.03762831103604761], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 220.99999999999997, 141, 1183, 148.0, 666.5, 1183.0, 1183.0, 0.08863676653075696, 1.8837662355648694, 0.05165119612150834], "isController": false}, {"data": ["deleteBooks", 16, 5, 31.25, 465.18749999999994, 150, 1650, 475.5, 1004.6000000000006, 1650.0, 1650.0, 0.08895906770897041, 0.019248040468035896, 0.0593512920609592], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 525.8333333333334, 293, 1031, 443.0, 981.5000000000002, 1031.0, 1031.0, 0.07131777417226809, 0.11052862071424752, 0.1603953456237631], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 714.2608695652174, 183, 2645, 472.0, 1871.4, 2492.199999999998, 2645.0, 0.09734337239765191, 0.059793926990354546, 0.044013653730578944], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 148.86666666666667, 142, 160, 149.0, 155.2, 160.0, 160.0, 0.07003062672742212, 0.05204424505817211, 0.03515209193153806], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 236.93333333333334, 140, 596, 149.0, 509.00000000000006, 596.0, 596.0, 0.07003193456216035, 0.08184982351952491, 0.036411134727435714], "isController": false}, {"data": ["login", 23, 0, 0.0, 3373.478260869565, 1855, 6099, 2985.0, 4884.0, 5859.599999999997, 6099.0, 0.09404837357649609, 39.261530190039046, 0.19614309025577067], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 178.64285714285714, 147, 466, 153.5, 320.0, 466.0, 466.0, 0.08661919110049683, 0.07012432560772643, 0.030790415586504728], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/443b51ee-1f66-4123-973f-fe8b98a1e3a4", 3, 0, 0.0, 432.3333333333333, 237, 548, 512.0, 548.0, 548.0, 548.0, 0.02215902795730694, 0.026191220870111165, 0.014210053735642797], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=117193eb-ced4-4e02-85ca-c874a1659431", 1, 0, 0.0, 497.0, 497, 497, 497.0, 497.0, 497.0, 497.0, 2.012072434607646, 0.3635091800804829, 1.3872296277665996], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/19c398b2-9603-4846-a5e7-5b8e0d98d88d", 3, 0, 0.0, 333.0, 233, 487, 279.0, 487.0, 487.0, 487.0, 0.06993170003962797, 0.03164227312990979, 0.044845523788433296], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 1231.5333333333333, 292, 2347, 1688.0, 2122.0, 2347.0, 2347.0, 0.06998194465827816, 50.27702462139768, 0.14664771176536454], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=87e50444-8481-40d6-b7df-4e92a53d4552", 1, 0, 0.0, 590.0, 590, 590, 590.0, 590.0, 590.0, 590.0, 1.694915254237288, 0.3062102754237288, 1.168564618644068], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 622.7222222222222, 289, 1798, 304.0, 1774.6000000000001, 1798.0, 1798.0, 0.08105004840489002, 16.265349028806536, 0.17882722268500797], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 18, 10, 55.55555555555556, 868.4444444444443, 148, 2048, 150.5, 1984.1000000000001, 2048.0, 2048.0, 0.09134320178220735, 48.581678742153365, 0.1251657577806647], "isController": false}, {"data": ["register", 25, 10, 40.0, 1118.2799999999997, 185, 1987, 1210.0, 1770.4000000000003, 1940.1999999999998, 1987.0, 0.10137751771065234, 0.03144287072744451, 0.04573868474836072], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 171.4375, 149, 454, 152.0, 246.8000000000002, 454.0, 454.0, 0.08922895033293553, 0.06927442921355834, 0.031718103438660675], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 430.5, 288, 1889, 299.0, 1237.0, 1889.0, 1889.0, 0.08855154965211892, 7.694466269370651, 0.19753617172675522], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 675.8421052631579, 286, 2438, 592.0, 1464.0, 2438.0, 2438.0, 0.10407765288459432, 13.250958567165691, 0.23127000242391374], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 150.4, 148, 160, 150.0, 159.1, 160.0, 160.0, 0.046571629494744395, 0.03461036137255906, 0.023376774961229117], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 145.8, 142, 152, 145.0, 151.8, 152.0, 152.0, 0.04657249707757581, 0.012461781444585715, 0.026560877239554952], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 175.70000000000002, 146, 426, 148.5, 398.30000000000007, 426.0, 426.0, 0.04657184638742188, 0.012552567971609802, 0.027379151880105437], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 147.5, 144, 151, 147.5, 150.8, 151.0, 151.0, 0.04657184638742188, 0.012552567971609802, 0.027424632198843155], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, 100.0, 152.0, 150, 158, 151.0, 158.0, 158.0, 158.0, 0.04301519296615565, 0.012686121363065435, 0.0265904464331802], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1706.9272727272728, 1127, 2532, 1566.0, 2377.7999999999997, 2441.2, 2532.0, 0.23755533959615593, 284.198773755534, 0.46907900064787816], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 10, 40.0, 1118.2799999999997, 185, 1987, 1210.0, 1770.4000000000003, 1940.1999999999998, 1987.0, 0.0983574309039048, 0.030506171928789218, 0.044376106521097664], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 184.87500000000003, 143, 435, 150.0, 435.0, 435.0, 435.0, 0.03791900500530866, 0.0102203568178371, 0.022329257830274535], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 148.375, 143, 153, 149.0, 153.0, 153.0, 153.0, 0.03791936447145146, 0.0102204537051959, 0.022292438878724393], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 165.0625, 141, 444, 147.0, 238.9000000000002, 444.0, 444.0, 0.08534107092376375, 0.0230020855224207, 0.0501712155235408], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 183.75000000000003, 142, 455, 147.0, 450.1, 455.0, 455.0, 0.08534334695270912, 0.023002698983347378, 0.050255896691878514], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 182.74999999999997, 141, 438, 147.5, 438.0, 438.0, 438.0, 0.03792026316662638, 0.010146632917632448, 0.021626400087216606], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 147.99999999999997, 142, 151, 148.5, 151.0, 151.0, 151.0, 0.08533925018801304, 0.06342106386042766, 0.042836303317029985], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 184.125, 143, 445, 148.0, 445.0, 445.0, 445.0, 0.03791954420707863, 0.028180442521080894, 0.019033833713318765], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 183.625, 140, 450, 148.0, 445.1, 450.0, 450.0, 0.08534425739828032, 0.022836256374149225, 0.04867289679745674], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 189.25, 149, 446, 152.0, 446.0, 446.0, 446.0, 0.03780718336483932, 0.029758388468809075, 0.013439272211720227], "isController": false}, {"data": ["deleteAccount", 16, 5, 31.25, 468.12500000000006, 148, 1098, 495.5, 916.7000000000002, 1098.0, 1098.0, 0.0878184792034864, 0.018250849712394483, 0.05974808274421771], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6ddb37fd-d59c-4a7a-875b-80340c304087", 3, 0, 0.0, 331.3333333333333, 267, 446, 281.0, 446.0, 446.0, 446.0, 0.06776904310111141, 0.031457895658263305, 0.04345866370741845], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1673.0434782608693, 1163, 2489, 1627.0, 2264.2000000000003, 2453.3999999999996, 2489.0, 0.09744936869756801, 0.05043766153292094, 0.04482290298491653], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 371.375, 293, 884, 299.0, 884.0, 884.0, 884.0, 0.03789260289025829, 0.05872613358089834, 0.08522135200807113], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2ea61244-d756-456c-9266-fc4d3a0b5218", 3, 0, 0.0, 452.3333333333333, 256, 654, 447.0, 654.0, 654.0, 654.0, 0.02390057361376673, 0.023970594825525812, 0.015326865240599109], "isController": false}, {"data": ["addBook", 57, 16, 28.07017543859649, 1455.9649122807014, 742, 3831, 1158.0, 2603.2000000000003, 3242.4999999999977, 3831.0, 0.26081704370744563, 83.18768724776245, 0.9458416054089793], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6f46f897-1629-4a3d-b9e2-7af26f2a9c7d", 1, 0, 0.0, 505.0, 505, 505, 505.0, 505.0, 505.0, 505.0, 1.9801980198019802, 0.3577506188118812, 1.3652537128712872], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 275.70909090909095, 142, 608, 152.0, 593.4, 602.2, 608.0, 0.23888220501305166, 0.17752866993645733, 0.11547528464986384], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 941.7636363636364, 706, 1395, 875.0, 1225.3999999999999, 1337.0, 1395.0, 0.2386106784786183, 70.15946209289764, 0.12000439396141448], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ff71b10a-2ff3-4c95-bc25-ef2dbfb0f3ca", 1, 0, 0.0, 340.0, 340, 340, 340.0, 340.0, 340.0, 340.0, 2.941176470588235, 0.9392233455882353, 1.7549402573529411], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 234.09090909090907, 142, 621, 151.0, 447.4, 471.1999999999997, 621.0, 0.23937188816545385, 0.42357603648027575, 0.11641328154921486], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1427.1454545454546, 980, 1930, 1345.0, 1821.2, 1917.0, 1930.0, 0.23819525948125403, 214.32851318383695, 0.11956285485680135], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2c03584b-63e1-40a9-9d6c-f8ee842fc8b7", 3, 0, 0.0, 453.6666666666667, 259, 598, 504.0, 598.0, 598.0, 598.0, 0.04432493129635649, 0.028496659931739606, 0.02842451648887444], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 169.21052631578948, 143, 480, 151.0, 178.0, 480.0, 480.0, 0.10904812465922462, 0.08146661656670588, 0.038763200562458744], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 16, 9.467455621301776, 218.2899408284023, 143, 3009, 153.0, 308.0, 407.5, 1729.4000000000208, 0.7078622977461496, 1.594449027108194, 0.33790509671325714], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 252.29999999999998, 150, 516, 167.5, 509.20000000000005, 516.0, 516.0, 0.047864066052411156, 0.03706660583941605, 0.017014179729568025], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3c427590-80d4-44d8-a631-e548180eeaf9", 3, 0, 0.0, 622.3333333333334, 248, 1057, 562.0, 1057.0, 1057.0, 1057.0, 0.034422222987160515, 0.028696390973345722, 0.022074146902573633], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 171.22222222222217, 144, 449, 154.0, 204.2000000000004, 449.0, 449.0, 0.08462822351254143, 0.06867778685441595, 0.030082688826723714], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6f46f897-1629-4a3d-b9e2-7af26f2a9c7d", 3, 0, 0.0, 487.33333333333337, 255, 769, 438.0, 769.0, 769.0, 769.0, 0.04017408771342484, 0.025828067458988954, 0.025762679946434552], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 328.3, 298, 576, 300.0, 549.6000000000001, 576.0, 576.0, 0.04653911845601821, 0.07212654393525478, 0.10466756816817377], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1db74260-5b30-4de8-8dde-8fe51f914bf0", 1, 0, 0.0, 454.0, 454, 454, 454.0, 454.0, 454.0, 454.0, 2.2026431718061676, 0.39793846365638763, 1.518619218061674], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2ea61244-d756-456c-9266-fc4d3a0b5218", 1, 0, 0.0, 1650.0, 1650, 1650, 1650.0, 1650.0, 1650.0, 1650.0, 0.6060606060606061, 0.10949337121212122, 0.4178503787878788], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 353.56249999999994, 290, 606, 298.0, 597.6, 606.0, 606.0, 0.08527193753830575, 0.13215484850907347, 0.1917785860846857], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fc6ea447-e6e0-4752-aff8-943e43d7c4a6", 1, 0, 0.0, 357.0, 357, 357, 357.0, 357.0, 357.0, 357.0, 2.8011204481792715, 0.8944984243697479, 1.671371673669468], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/117193eb-ced4-4e02-85ca-c874a1659431", 3, 0, 0.0, 560.6666666666667, 258, 1098, 326.0, 1098.0, 1098.0, 1098.0, 0.03358146303240611, 0.027667540017910115, 0.02153498768679689], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=19c398b2-9603-4846-a5e7-5b8e0d98d88d", 1, 0, 0.0, 728.0, 728, 728, 728.0, 728.0, 728.0, 728.0, 1.3736263736263736, 0.24816492101648352, 0.9470509958791209], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=73267461-0bfc-4458-b7db-bc567dc25807", 1, 0, 0.0, 265.0, 265, 265, 265.0, 265.0, 265.0, 265.0, 3.7735849056603774, 0.681751179245283, 2.6017099056603774], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/87e50444-8481-40d6-b7df-4e92a53d4552", 3, 0, 0.0, 383.3333333333333, 313, 519, 318.0, 519.0, 519.0, 519.0, 0.023583978617192723, 0.027875464309579025, 0.015123840454384654], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 151.75, 145, 159, 152.5, 157.5, 159.0, 159.0, 0.07775193245948801, 0.06446424868955597, 0.027638382241458627], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 153.06666666666666, 145, 171, 151.0, 170.4, 171.0, 171.0, 0.06878399075543164, 0.05340163344782046, 0.02445055921384484], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/860001a3-eab6-49be-859d-f37ca6ae30bb", 1, 0, 0.0, 2277.0, 2277, 2277, 2277.0, 2277.0, 2277.0, 2277.0, 0.4391743522178305, 0.1402441534914361, 0.26204641523935], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d0c01b7d-1640-49ab-9b4e-4bae2395aef1", 1, 0, 0.0, 343.0, 343, 343, 343.0, 343.0, 343.0, 343.0, 2.9154518950437316, 0.9310085641399416, 1.7395909256559765], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 210.8947368421053, 142, 449, 150.0, 444.0, 449.0, 449.0, 0.10483221328389666, 0.07790753350492712, 0.05262085705851845], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 269.5263157894737, 141, 449, 149.0, 446.0, 449.0, 449.0, 0.10466012999889832, 0.04455156232786163, 0.05876373664206236], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 395.8947368421053, 142, 2013, 151.0, 1314.0, 2013.0, 2013.0, 0.10416209815358976, 9.890934316888515, 0.060293665162712166], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 359.1578947368421, 140, 1127, 428.0, 843.0, 1127.0, 1127.0, 0.1042689920481174, 3.2523608008956155, 0.0604573653009258], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 10, 21.73913043478261, 0.7656967840735069], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 5, 10.869565217391305, 0.38284839203675347], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 5, 10.869565217391305, 0.38284839203675347], "isController": false}, {"data": ["401/Unauthorized", 26, 56.52173913043478, 1.9908116385911179], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1306, 46, "401/Unauthorized", 26, "406/Not Acceptable", 10, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 5, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 18, 10, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 5, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 10, "406/Not Acceptable", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 16, "401/Unauthorized", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
