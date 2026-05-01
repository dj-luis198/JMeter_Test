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

    var data = {"OkPercent": 98.65186360031721, "KoPercent": 1.3481363996827915};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.725718194254446, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.4166666666666667, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4166666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/32086816-be3c-4079-b070-bda9c6fba93e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1ee60ba0-0a75-4ec8-8697-a880f1dad910"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.875, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/78996cf1-9bf5-41ab-abed-b1942e4f85e3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.4666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.375, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8529411764705882, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9321930e-f508-43f1-8957-004b76444eb6"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=efb43dac-a031-46b9-a07c-de3779880e5c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/921ce073-519f-43c8-b6d3-94718f8604d8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6b362e9a-a3ff-43ee-b906-6ad1bd9f5096"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/957c3dc8-8d0e-4ff7-b3af-210f938c38af"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3d786555-2b6b-49a6-bb0e-c5f321d8cedd"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=60120de6-6c5b-47f0-8c0e-a4fb900396c1"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.1111111111111111, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5f66f253-9dfa-4a84-951c-26bbac4a5875"], "isController": false}, {"data": [0.20454545454545456, 500, 1500, "register"], "isController": true}, {"data": [0.78125, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=957c3dc8-8d0e-4ff7-b3af-210f938c38af"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=32086816-be3c-4079-b070-bda9c6fba93e"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.2636363636363636, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.20454545454545456, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5416666666666666, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1ee60ba0-0a75-4ec8-8697-a880f1dad910"], "isController": false}, {"data": [0.6, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3090909090909091, 500, 1500, "addBook"], "isController": true}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9818181818181818, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/de26b4d1-f415-4463-ba9f-01aca6723663"], "isController": false}, {"data": [0.39090909090909093, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3d786555-2b6b-49a6-bb0e-c5f321d8cedd"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/efb43dac-a031-46b9-a07c-de3779880e5c"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=de26b4d1-f415-4463-ba9f-01aca6723663"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9321930e-f508-43f1-8957-004b76444eb6"], "isController": false}, {"data": [0.8421052631578947, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=921ce073-519f-43c8-b6d3-94718f8604d8"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=78996cf1-9bf5-41ab-abed-b1942e4f85e3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bfc645f5-80d6-4f95-98f9-61a4f76a6e8d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5f66f253-9dfa-4a84-951c-26bbac4a5875"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/55ab1793-6ea2-4eb8-97ff-7c0eb1787e85"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/60120de6-6c5b-47f0-8c0e-a4fb900396c1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1261, 17, 1.3481363996827915, 502.56145915939766, 125, 4477, 167.0, 1365.999999999999, 1674.8999999999999, 2552.659999999999, 4.912042880069804, 702.1917428938983, 3.6024655528872374], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 2337.163636363636, 1797, 3296, 2275.0, 2845.0, 3028.1999999999985, 3296.0, 0.24342638122341673, 292.92439124732783, 1.1969256147069367], "isController": true}, {"data": ["deleteBook", 12, 1, 8.333333333333334, 1300.6666666666667, 151, 3144, 1137.5, 3101.4, 3144.0, 3144.0, 0.07259879486000533, 0.013807241502916052, 0.04905499623393752], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, 8.333333333333334, 1300.6666666666667, 151, 3144, 1137.5, 3101.4, 3144.0, 3144.0, 0.07232749891508752, 0.013755644935266887, 0.04887168159928155], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/32086816-be3c-4079-b070-bda9c6fba93e", 3, 0, 0.0, 1174.0, 367, 1748, 1407.0, 1748.0, 1748.0, 1748.0, 0.029908480051043806, 0.024933469209219787, 0.019179591699399836], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 13, 0, 0.0, 201.9230769230769, 127, 422, 142.0, 420.8, 422.0, 422.0, 0.10812339374381409, 0.028931454966606505, 0.061664122994518976], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 13, 0, 0.0, 165.0769230769231, 126, 442, 141.0, 337.9999999999999, 442.0, 442.0, 0.10785338576667164, 0.08015276032073937, 0.05413734402741135], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1ee60ba0-0a75-4ec8-8697-a880f1dad910", 3, 0, 0.0, 619.6666666666666, 386, 1022, 451.0, 1022.0, 1022.0, 1022.0, 0.021549711593026516, 0.02547102955542945, 0.01381931374943432], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 13, 0, 0.0, 250.38461538461536, 127, 508, 142.0, 472.4, 508.0, 508.0, 0.10812519233808253, 0.029143118247373808, 0.06367137791002321], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 13, 0, 0.0, 254.69230769230768, 125, 563, 140.0, 515.0, 563.0, 563.0, 0.10812519233808253, 0.029143118247373808, 0.06356578690188056], "isController": false}, {"data": ["goToProfile", 12, 1, 8.333333333333334, 345.08333333333337, 140, 558, 327.5, 537.3000000000001, 558.0, 558.0, 0.07337923612215197, 0.18082057859527684, 0.04743255798488388], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/78996cf1-9bf5-41ab-abed-b1942e4f85e3", 3, 0, 0.0, 501.6666666666667, 241, 706, 558.0, 706.0, 706.0, 706.0, 0.015175888548274502, 0.02092118750063233, 0.009731933737011969], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 141.5, 127, 155, 143.0, 151.5, 155.0, 155.0, 0.1068911380565855, 0.07943765240338044, 0.05365434078230952], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 173.93750000000003, 130, 420, 142.0, 391.3, 420.0, 420.0, 0.10689756540794783, 0.038638145895133494, 0.06040390994548225], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 934.8571428571428, 749, 1118, 1000.0, 1118.0, 1118.0, 1118.0, 0.07260356379778869, 21.3478584217541, 0.04140671997842637], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1447.7142857142856, 1129, 1800, 1466.0, 1800.0, 1800.0, 1800.0, 0.07241579078043532, 65.15985583761794, 0.041228912133783], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 299.57142857142856, 128, 447, 378.0, 447.0, 447.0, 447.0, 0.07302620597563012, 0.12922215354281422, 0.04043540897283426], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 192.23529411764704, 128, 424, 149.0, 421.6, 424.0, 424.0, 0.08082921262837581, 0.06006936602558007, 0.0405724758701027], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 205.23529411764707, 126, 447, 141.0, 445.4, 447.0, 447.0, 0.08074168360658852, 0.021604708308794195, 0.04604799143188251], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 184.58823529411768, 127, 395, 145.0, 383.8, 395.0, 395.0, 0.08073516491344715, 0.021760649918077555, 0.04746344656044452], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 171.8235294117647, 127, 446, 140.0, 389.99999999999994, 446.0, 446.0, 0.08083805284906585, 0.021788381431974778, 0.04760287682420577], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 177.0, 128, 411, 143.0, 411.0, 411.0, 411.0, 0.0730536422458777, 0.05429084155186809, 0.04102133231580046], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 1076.0666666666666, 134, 1806, 1392.0, 1785.0, 1806.0, 1806.0, 0.07531935406121956, 45.18842509427473, 0.03996437080722263], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 249.31249999999997, 127, 1675, 140.0, 779.700000000001, 1675.0, 1675.0, 0.1069075650465716, 6.039239931061324, 0.062275744678007776], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 775.3999999999999, 131, 1327, 843.0, 1283.2, 1327.0, 1327.0, 0.07532011046949535, 14.771175935224704, 0.0400383269520462], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 245.9375, 125, 795, 141.0, 550.0000000000002, 795.0, 795.0, 0.10689399456176803, 1.99140954346243, 0.06237222827212538], "isController": false}, {"data": ["deleteBooks", 12, 1, 8.333333333333334, 1158.5, 147, 2725, 898.5, 2674.6000000000004, 2725.0, 2725.0, 0.07136273081383247, 0.013572159986322142, 0.04877730925336743], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 418.70588235294116, 278, 870, 298.0, 868.4, 870.0, 870.0, 0.08067730974392072, 0.12503407281601775, 0.18144516048852483], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9321930e-f508-43f1-8957-004b76444eb6", 3, 0, 0.0, 475.6666666666667, 270, 708, 449.0, 708.0, 708.0, 708.0, 0.06862319006336207, 0.031050206441430108, 0.04400640769037217], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 686.3333333333333, 198, 1753, 574.0, 1528.0000000000002, 1736.3999999999996, 1753.0, 0.08846686915750052, 0.05434146552740998, 0.0400001566600808], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 177.73333333333332, 136, 418, 143.0, 409.0, 418.0, 418.0, 0.07531519408725516, 0.055971545605860526, 0.03780469703207925], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 278.53333333333336, 128, 427, 375.0, 423.4, 427.0, 427.0, 0.07531595041197825, 0.09556691884957397, 0.03873671928741069], "isController": false}, {"data": ["login", 21, 0, 0.0, 3481.6190476190473, 1745, 6364, 3011.0, 5817.200000000001, 6317.9, 6364.0, 0.0899434641082748, 35.98883352562318, 0.18542055930914855], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=efb43dac-a031-46b9-a07c-de3779880e5c", 1, 0, 0.0, 863.0, 863, 863, 863.0, 863.0, 863.0, 863.0, 1.1587485515643106, 0.20934422074159909, 0.7989028099652375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 195.125, 130, 423, 145.0, 421.6, 423.0, 423.0, 0.10268653651148164, 0.08313197145314286, 0.03650185477556574], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/921ce073-519f-43c8-b6d3-94718f8604d8", 3, 0, 0.0, 434.6666666666667, 330, 489, 485.0, 489.0, 489.0, 489.0, 0.019962337722829595, 0.023594807380076258, 0.012801368917309344], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6b362e9a-a3ff-43ee-b906-6ad1bd9f5096", 1, 0, 0.0, 434.0, 434, 434, 434.0, 434.0, 434.0, 434.0, 2.304147465437788, 0.7357970910138248, 1.3748379896313365], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/957c3dc8-8d0e-4ff7-b3af-210f938c38af", 3, 0, 0.0, 855.3333333333334, 274, 2004, 288.0, 2004.0, 2004.0, 2004.0, 0.0245188181929631, 0.024590650668137794, 0.015723330677128028], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 1291.8666666666663, 273, 1958, 1536.0, 1932.8, 1958.0, 1958.0, 0.07526153383005946, 60.06485329488723, 0.15642737418780261], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3d786555-2b6b-49a6-bb0e-c5f321d8cedd", 1, 0, 0.0, 432.0, 432, 432, 432.0, 432.0, 432.0, 432.0, 2.314814814814815, 0.41820384837962965, 1.5959563078703705], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=60120de6-6c5b-47f0-8c0e-a4fb900396c1", 1, 0, 0.0, 1131.0, 1131, 1131, 1131.0, 1131.0, 1131.0, 1131.0, 0.8841732979664013, 0.15973833996463307, 0.6095960433244916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 13, 0, 0.0, 508.0769230769231, 264, 866, 546.0, 797.1999999999999, 866.0, 866.0, 0.10772558151097558, 0.16695361118937327, 0.24227735763650074], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 2, 22.22222222222222, 1295.111111111111, 140, 1929, 1535.0, 1929.0, 1929.0, 1929.0, 0.09271182075714653, 86.27317795518928, 0.1762490342518671], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5f66f253-9dfa-4a84-951c-26bbac4a5875", 1, 0, 0.0, 694.0, 694, 694, 694.0, 694.0, 694.0, 694.0, 1.440922190201729, 0.2603228566282421, 0.9934483069164266], "isController": false}, {"data": ["register", 22, 8, 36.36363636363637, 1463.1818181818182, 469, 3166, 1292.5, 2627.7, 3090.249999999999, 3166.0, 0.09103322712790168, 0.02835090205652336, 0.04107163177059627], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 463.99999999999994, 270, 1812, 296.5, 954.5000000000009, 1812.0, 1812.0, 0.10678626728602701, 8.13974802820826, 0.2384571762040152], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 173.6842105263158, 135, 604, 152.0, 205.0, 604.0, 604.0, 0.09840786434216932, 0.07640063686721153, 0.0349809205278805], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 490.22222222222223, 257, 1498, 526.0, 686.2000000000013, 1498.0, 1498.0, 0.1062554972462117, 7.217666369175871, 0.23746074449685073], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=957c3dc8-8d0e-4ff7-b3af-210f938c38af", 1, 0, 0.0, 934.0, 934, 934, 934.0, 934.0, 934.0, 934.0, 1.0706638115631693, 0.1934304737687366, 0.738172510706638], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 181.14285714285714, 129, 406, 145.0, 406.0, 406.0, 406.0, 0.03327881945765033, 0.024731622663351462, 0.016704407423078386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 135.85714285714286, 128, 143, 136.0, 143.0, 143.0, 143.0, 0.03327929409863032, 0.008904811116235065, 0.018979597415625105], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=32086816-be3c-4079-b070-bda9c6fba93e", 1, 0, 0.0, 540.0, 540, 540, 540.0, 540.0, 540.0, 540.0, 1.8518518518518519, 0.33456307870370366, 1.2767650462962963], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 196.14285714285714, 140, 505, 147.0, 505.0, 505.0, 505.0, 0.03322101466470504, 0.008954101608846281, 0.019530323074367615], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 189.42857142857144, 126, 510, 140.0, 510.0, 510.0, 510.0, 0.03322006871808501, 0.008953846646671348, 0.019562208434575446], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 147.0, 147, 147, 147.0, 147.0, 147.0, 147.0, 6.802721088435374, 2.0062712585034013, 4.205197704081633], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1566.4363636363635, 1028, 2709, 1471.0, 2092.2, 2296.599999999998, 2709.0, 0.2371977884540742, 283.77101828471496, 0.4683729768106817], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 8, 36.36363636363637, 1463.1818181818182, 469, 3166, 1292.5, 2627.7, 3090.249999999999, 3166.0, 0.09038471019375195, 0.028148931406221756, 0.04077903916944668], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 188.8, 127, 380, 147.0, 380.0, 380.0, 380.0, 0.031238675979957265, 0.008419799385222857, 0.018395431265541242], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 307.2, 127, 444, 401.0, 444.0, 444.0, 444.0, 0.031185096018910643, 0.008405357911347009, 0.018333425589242388], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 246.2631578947368, 129, 1106, 147.0, 444.0, 1106.0, 1106.0, 0.10048390935293651, 4.784373801795488, 0.05861905690562445], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 211.31578947368422, 125, 1062, 140.0, 422.0, 1062.0, 1062.0, 0.10048178371031631, 1.58065654599157, 0.058715943616498054], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 153.42105263157893, 126, 384, 142.0, 150.0, 384.0, 384.0, 0.10048072092273033, 0.07467366076386502, 0.05043661186941737], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 310.0, 139, 444, 397.0, 444.0, 444.0, 444.0, 0.031189959328293035, 0.008345750835890911, 0.017788023679417123], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 182.0526315789474, 128, 445, 140.0, 405.0, 445.0, 445.0, 0.10048178371031631, 0.034829828810771644, 0.05686186465103734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 193.2, 141, 378, 149.0, 378.0, 378.0, 378.0, 0.03123848081020124, 0.023215316305237443, 0.015680253062933042], "isController": false}, {"data": ["deleteAccount", 12, 1, 8.333333333333334, 943.0, 140, 2004, 864.0, 1910.4000000000003, 2004.0, 2004.0, 0.07268014075720593, 0.0136571000169587, 0.0494648451458751], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 196.8, 144, 380, 155.0, 380.0, 380.0, 380.0, 0.029454907482135598, 0.023184233818946576, 0.010470299144040388], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1843.5714285714284, 991, 4477, 1446.0, 4019.400000000001, 4462.2, 4477.0, 0.09043888699876401, 0.04680918955990715, 0.04159835525040805], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1ee60ba0-0a75-4ec8-8697-a880f1dad910", 1, 0, 0.0, 850.0, 850, 850, 850.0, 850.0, 850.0, 850.0, 1.176470588235294, 0.21254595588235295, 0.8111213235294118], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 569.4, 290, 822, 572.0, 822.0, 822.0, 822.0, 0.0311561421218579, 0.04828593510487157, 0.07007089385413941], "isController": false}, {"data": ["addBook", 55, 5, 9.090909090909092, 1383.9090909090905, 733, 2600, 1196.0, 2336.4, 2390.5999999999995, 2600.0, 0.263190636155694, 75.40606128035067, 0.959304633889862], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 250.34545454545452, 128, 789, 150.0, 539.0, 568.4, 789.0, 0.23890918410341724, 0.177548719826856, 0.11548832629999176], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 876.4, 623, 1259, 833.0, 1140.0, 1188.8, 1259.0, 0.23863241929885456, 70.16585461591028, 0.1200153280653419], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 211.14545454545458, 127, 571, 143.0, 421.8, 467.79999999999956, 571.0, 0.2396242691459791, 0.42402263251222083, 0.11653602151825937], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/de26b4d1-f415-4463-ba9f-01aca6723663", 3, 0, 0.0, 681.0, 251, 1398, 394.0, 1398.0, 1398.0, 1398.0, 0.01620421633709091, 0.0223388203735612, 0.010391375710959992], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1313.7818181818184, 883, 2097, 1257.0, 1671.4, 1784.7999999999995, 2097.0, 0.23804062271426904, 214.18937074908138, 0.11948523444837332], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 161.83333333333331, 127, 448, 145.0, 191.5000000000004, 448.0, 448.0, 0.1059371910165262, 0.07914253039808843, 0.0376573608691558], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 165, 5, 3.0303030303030303, 226.76969696969704, 127, 884, 151.0, 458.40000000000003, 549.8, 785.6600000000005, 0.7102761898202355, 1.5185558645675494, 0.3406433488015704], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 182.0, 134, 382, 153.0, 382.0, 382.0, 382.0, 0.033618934183732276, 0.026034975398144235, 0.011950480510623583], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 13, 0, 0.0, 145.6153846153846, 130, 161, 144.0, 160.2, 161.0, 161.0, 0.10321638123367395, 0.08376251250506157, 0.03669019801665754], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3d786555-2b6b-49a6-bb0e-c5f321d8cedd", 3, 0, 0.0, 444.0, 259, 592, 481.0, 592.0, 592.0, 592.0, 0.028236888671360268, 0.02831961393113964, 0.018107640196152252], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/efb43dac-a031-46b9-a07c-de3779880e5c", 3, 0, 0.0, 825.6666666666667, 336, 1692, 449.0, 1692.0, 1692.0, 1692.0, 0.022639629917516283, 0.026759276116699746, 0.014518252258303084], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 379.57142857142856, 271, 918, 295.0, 918.0, 918.0, 918.0, 0.0331980119133437, 0.05145043447898092, 0.07466310687151421], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=de26b4d1-f415-4463-ba9f-01aca6723663", 1, 0, 0.0, 2557.0, 2557, 2557, 2557.0, 2557.0, 2557.0, 2557.0, 0.39108330074305825, 0.07065469788815018, 0.26963360383261636], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9321930e-f508-43f1-8957-004b76444eb6", 1, 0, 0.0, 1021.0, 1021, 1021, 1021.0, 1021.0, 1021.0, 1021.0, 0.9794319294809011, 0.17694815132223313, 0.675272404505387], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 420.9473684210526, 267, 1243, 295.0, 805.0, 1243.0, 1243.0, 0.10040903469924851, 6.4697459155982795, 0.22447013590891315], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=921ce073-519f-43c8-b6d3-94718f8604d8", 1, 0, 0.0, 2008.0, 2008, 2008, 2008.0, 2008.0, 2008.0, 2008.0, 0.49800796812749004, 0.08997214267928287, 0.3433531499003984], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=78996cf1-9bf5-41ab-abed-b1942e4f85e3", 1, 0, 0.0, 2725.0, 2725, 2725, 2725.0, 2725.0, 2725.0, 2725.0, 0.3669724770642202, 0.06629873853211009, 0.2530103211009174], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bfc645f5-80d6-4f95-98f9-61a4f76a6e8d", 1, 0, 0.0, 419.0, 419, 419, 419.0, 419.0, 419.0, 419.0, 2.3866348448687353, 0.7621382756563246, 1.4240565334128878], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 150.76470588235293, 137, 167, 151.0, 162.2, 167.0, 167.0, 0.08232325922625822, 0.06825434285458323, 0.029263346053083977], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5f66f253-9dfa-4a84-951c-26bbac4a5875", 3, 0, 0.0, 357.3333333333333, 226, 456, 390.0, 456.0, 456.0, 456.0, 0.0340514403759279, 0.028054751169099452, 0.021836372897323555], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 145.8666666666667, 131, 169, 144.0, 167.2, 169.0, 169.0, 0.07453490221020831, 0.05786645239952695, 0.026494828520034982], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/55ab1793-6ea2-4eb8-97ff-7c0eb1787e85", 1, 0, 0.0, 235.0, 235, 235, 235.0, 235.0, 235.0, 235.0, 4.25531914893617, 1.3588763297872342, 2.5390625], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/60120de6-6c5b-47f0-8c0e-a4fb900396c1", 3, 0, 0.0, 1197.3333333333333, 229, 2287, 1076.0, 2287.0, 2287.0, 2287.0, 0.021286408628090964, 0.02515981436477809, 0.013650463866321353], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 139.33333333333334, 127, 152, 142.0, 150.2, 152.0, 152.0, 0.10634401105977716, 0.07903104728172891, 0.0533797086764897], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 246.33333333333334, 127, 445, 141.5, 439.6, 445.0, 445.0, 0.10634526763559021, 0.03732931215290086, 0.060153849846390176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 330.94444444444446, 128, 1370, 264.0, 549.2000000000013, 1370.0, 1370.0, 0.106336472228458, 5.342721203861786, 0.06200653230856481], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 184.61111111111111, 126, 747, 140.0, 413.10000000000053, 747.0, 747.0, 0.10633710042357612, 1.7641043425413385, 0.06211074344402238], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 47.05882352941177, 0.63441712926249], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.882352941176471, 0.07930214115781126], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.882352941176471, 0.07930214115781126], "isController": false}, {"data": ["401/Unauthorized", 7, 41.1764705882353, 0.5551149881046789], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1261, 17, "406/Not Acceptable", 8, "401/Unauthorized", 7, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 165, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
