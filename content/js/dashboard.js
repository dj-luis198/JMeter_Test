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

    var data = {"OkPercent": 98.09372517871327, "KoPercent": 1.9062748212867355};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.754601226993865, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=619ba2ab-95f0-42e2-a3c3-8d9e6f240075"], "isController": false}, {"data": [0.03773584905660377, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/c8e9bee4-c6db-453b-95ea-032ac0b40a8f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d7858eaf-c1ef-4dbc-903a-9c888bdd5740"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ab9cff23-096f-467d-9810-b4546568e40d"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6071428571428571, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5f55b4e2-c66a-4af3-8c0c-eb76f0f1aead"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e24c314c-5400-4c4f-aa65-2453803b5ba2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f37a93a6-4b7e-47a0-85a8-8ab2ba57a547"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/ce448174-46cc-4d25-87cd-e625f9eaddbe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a0324698-7cfb-4b77-82e2-3a34ed8ad5ea"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ef578787-e977-4dae-92d3-294e8b9751bf"], "isController": false}, {"data": [0.5357142857142857, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ef578787-e977-4dae-92d3-294e8b9751bf"], "isController": false}, {"data": [0.5952380952380952, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b43d4090-ea73-4a5c-aca8-3b19bf77d75e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f39d7ca4-5b8d-4add-aa92-91e3344fc653"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d7858eaf-c1ef-4dbc-903a-9c888bdd5740"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=25ce99dd-5190-486b-978d-f9a261ece5d7"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.1875, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/619ba2ab-95f0-42e2-a3c3-8d9e6f240075"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7931d9bf-3913-4287-9b13-04e632c1ab2c"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5f55b4e2-c66a-4af3-8c0c-eb76f0f1aead"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8b759b64-37d8-447c-9052-71c5b9bb147f"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f39d7ca4-5b8d-4add-aa92-91e3344fc653"], "isController": false}, {"data": [0.3018867924528302, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b43d4090-ea73-4a5c-aca8-3b19bf77d75e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e24c314c-5400-4c4f-aa65-2453803b5ba2"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.25, 500, 1500, "addBook"], "isController": true}, {"data": [0.9905660377358491, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4811320754716981, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8875739644970414, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f37a93a6-4b7e-47a0-85a8-8ab2ba57a547"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ab9cff23-096f-467d-9810-b4546568e40d"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/bf97a5cd-49c2-401e-8fc6-86d899960f60"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c8e9bee4-c6db-453b-95ea-032ac0b40a8f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7931d9bf-3913-4287-9b13-04e632c1ab2c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/25ce99dd-5190-486b-978d-f9a261ece5d7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1259, 24, 1.9062748212867355, 444.7768069896741, 119, 3946, 137.0, 1217.0, 1483.0, 2186.0000000000155, 4.911177512346209, 684.5112130101345, 3.5855493648431467], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=619ba2ab-95f0-42e2-a3c3-8d9e6f240075", 1, 0, 0.0, 299.0, 299, 299, 299.0, 299.0, 299.0, 299.0, 3.3444816053511706, 0.6042276337792643, 2.3058632943143813], "isController": false}, {"data": ["see books", 53, 0, 0.0, 2053.6792452830186, 1461, 2594, 2091.0, 2461.8, 2519.2999999999997, 2594.0, 0.24180266165420394, 290.9690350377189, 1.1889417982704265], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/c8e9bee4-c6db-453b-95ea-032ac0b40a8f", 3, 0, 0.0, 842.6666666666666, 321, 1623, 584.0, 1623.0, 1623.0, 1623.0, 0.023926116153318553, 0.023996212196736477, 0.015343245059257014], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d7858eaf-c1ef-4dbc-903a-9c888bdd5740", 3, 0, 0.0, 438.33333333333337, 224, 856, 235.0, 856.0, 856.0, 856.0, 0.05576622797233995, 0.025232765911963714, 0.035761545932783106], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ab9cff23-096f-467d-9810-b4546568e40d", 1, 0, 0.0, 324.0, 324, 324, 324.0, 324.0, 324.0, 324.0, 3.0864197530864197, 0.5576051311728395, 2.1279417438271606], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 632.2142857142858, 124, 2310, 460.0, 1716.5, 2310.0, 2310.0, 0.06916791004219243, 0.013625151922373843, 0.046539736346748614], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 632.2142857142858, 124, 2310, 460.0, 1716.5, 2310.0, 2310.0, 0.0673154594760934, 0.01326024397045813, 0.04529331208889487], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5f55b4e2-c66a-4af3-8c0c-eb76f0f1aead", 1, 0, 0.0, 515.0, 515, 515, 515.0, 515.0, 515.0, 515.0, 1.941747572815534, 0.3508040048543689, 1.338743932038835], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 174.42857142857144, 120, 365, 123.5, 365.0, 365.0, 365.0, 0.06386424286659216, 0.030791688524964077, 0.03565634764956777], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 124.49999999999999, 121, 129, 124.0, 129.0, 129.0, 129.0, 0.06393248729341815, 0.047512326982706264, 0.032091111785954037], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 289.1428571428571, 120, 982, 124.5, 976.0, 982.0, 982.0, 0.0639351149918711, 2.7003488174287122, 0.0368643736413788], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 303.9285714285714, 120, 1186, 125.0, 1142.0, 1186.0, 1186.0, 0.0638639515363842, 8.224025119630866, 0.036760974335814905], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e24c314c-5400-4c4f-aa65-2453803b5ba2", 3, 0, 0.0, 305.0, 230, 445, 240.0, 445.0, 445.0, 445.0, 0.026273843512988036, 0.026350817663904992, 0.016848786367378396], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f37a93a6-4b7e-47a0-85a8-8ab2ba57a547", 3, 0, 0.0, 335.6666666666667, 247, 444, 316.0, 444.0, 444.0, 444.0, 0.04096737631266301, 0.033912772774447285, 0.0262713969192533], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 396.2857142857143, 120, 2592, 230.0, 1456.5, 2592.0, 2592.0, 0.06898998659623116, 0.11647835069581329, 0.04459132364681069], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ce448174-46cc-4d25-87cd-e625f9eaddbe", 1, 0, 0.0, 514.0, 514, 514, 514.0, 514.0, 514.0, 514.0, 1.9455252918287937, 0.6212761429961089, 1.160855423151751], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a0324698-7cfb-4b77-82e2-3a34ed8ad5ea", 1, 0, 0.0, 224.0, 224, 224, 224.0, 224.0, 224.0, 224.0, 4.464285714285714, 1.4256068638392856, 2.6637486049107144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 124.8, 123, 135, 124.0, 129.6, 135.0, 135.0, 0.10879498672701163, 0.08085252431567953, 0.054609983571957], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 139.5333333333333, 121, 368, 123.0, 222.2000000000001, 368.0, 368.0, 0.10879735404834955, 0.05089959545517186, 0.0608301872765121], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 868.8, 726, 972, 951.0, 972.0, 972.0, 972.0, 0.03772588372882635, 11.09266243350813, 0.02151554306409628], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1266.6, 1107, 1454, 1217.0, 1454.0, 1454.0, 1454.0, 0.03754994142209138, 33.78750329735423, 0.02137853110261648], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 270.8, 124, 375, 365.0, 375.0, 375.0, 375.0, 0.03782949490058409, 0.06694047339829919, 0.020946605086553886], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 140.20000000000002, 121, 367, 124.0, 222.4000000000001, 367.0, 367.0, 0.0795941758288407, 0.05915153106030055, 0.039952545289086046], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 139.53333333333333, 120, 370, 123.0, 224.2000000000001, 370.0, 370.0, 0.0794912559618442, 0.021270121224165342, 0.04533485691573927], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 205.13333333333333, 123, 369, 125.0, 367.2, 369.0, 369.0, 0.07949167722139491, 0.021425491126079096, 0.04673241180398412], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 181.06666666666666, 120, 493, 124.0, 416.20000000000005, 493.0, 493.0, 0.07959586526011929, 0.021453573058391528, 0.0468713933123554], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 173.2, 123, 369, 125.0, 369.0, 369.0, 369.0, 0.03789859850982711, 0.028164876431619558, 0.02128095131167049], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ef578787-e977-4dae-92d3-294e8b9751bf", 1, 0, 0.0, 1079.0, 1079, 1079, 1079.0, 1079.0, 1079.0, 1079.0, 0.9267840593141798, 0.1674365732159407, 0.6389741658943466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 1039.9285714285716, 122, 1695, 1211.0, 1692.5, 1695.0, 1695.0, 0.08132300918369124, 52.273824465010776, 0.042817108908935655], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 261.8, 122, 1347, 124.0, 1123.2, 1347.0, 1347.0, 0.10879735404834955, 13.078221104329408, 0.06271430812135982], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 750.2142857142858, 123, 982, 974.0, 982.0, 982.0, 982.0, 0.08132584361040274, 17.086618740088415, 0.042898021022730576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 285.26666666666665, 122, 978, 124.0, 973.2, 978.0, 978.0, 0.10879656492978995, 4.290721194296158, 0.06282009989337936], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 636.9230769230769, 127, 2626, 456.0, 2007.1999999999994, 2626.0, 2626.0, 0.0683006278403867, 0.01293976738382326, 0.04671553609425486], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 355.46666666666664, 247, 734, 251.0, 664.4000000000001, 734.0, 734.0, 0.07943779226487738, 0.1231130628167582, 0.17865745662696542], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ef578787-e977-4dae-92d3-294e8b9751bf", 3, 0, 0.0, 869.0, 238, 1912, 457.0, 1912.0, 1912.0, 1912.0, 0.02541231480775584, 0.025486764948794188, 0.016296308649504883], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 778.3333333333333, 317, 1257, 767.0, 1086.8, 1240.9999999999998, 1257.0, 0.08780145165066729, 0.05393272762526341, 0.03969928917408101], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 149.71428571428572, 119, 467, 124.0, 309.0, 467.0, 467.0, 0.08143890918398212, 0.06052247059473673, 0.04087851496149103], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 227.92857142857142, 121, 369, 126.0, 369.0, 369.0, 369.0, 0.08143938292216141, 0.10916149429633464, 0.041560444019149885], "isController": false}, {"data": ["login", 21, 0, 0.0, 3465.333333333334, 1881, 5418, 3328.0, 5286.2, 5405.3, 5418.0, 0.08800124039843608, 25.18769914864038, 0.16751910229306088], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 128.93333333333334, 125, 154, 127.0, 140.20000000000002, 154.0, 154.0, 0.10116815496263523, 0.08190273482814903, 0.03596211758437424], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b43d4090-ea73-4a5c-aca8-3b19bf77d75e", 1, 0, 0.0, 2626.0, 2626, 2626, 2626.0, 2626.0, 2626.0, 2626.0, 0.38080731150038083, 0.06879819592536177, 0.262548790936786], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f39d7ca4-5b8d-4add-aa92-91e3344fc653", 3, 0, 0.0, 656.6666666666667, 313, 1254, 403.0, 1254.0, 1254.0, 1254.0, 0.015657538321825044, 0.021585180596656595, 0.010040804197264106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 1208.2142857142858, 247, 1848, 1336.0, 1832.0, 1848.0, 1848.0, 0.08126353182918405, 69.47843777390163, 0.16791213308064246], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d7858eaf-c1ef-4dbc-903a-9c888bdd5740", 1, 0, 0.0, 222.0, 222, 222, 222.0, 222.0, 222.0, 222.0, 4.504504504504505, 0.8138020833333334, 3.1056447072072073], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=25ce99dd-5190-486b-978d-f9a261ece5d7", 1, 0, 0.0, 416.0, 416, 416, 416.0, 416.0, 416.0, 416.0, 2.403846153846154, 0.4342886117788462, 1.6573392427884617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 473.8571428571429, 247, 1309, 255.5, 1268.0, 1309.0, 1309.0, 0.06382581024586613, 10.993051962187765, 0.14121282431489832], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 3, 37.5, 946.25, 120, 1587, 1281.5, 1587.0, 1587.0, 1587.0, 0.06002355924700445, 44.88667563737517, 0.0993773845296779], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/619ba2ab-95f0-42e2-a3c3-8d9e6f240075", 3, 0, 0.0, 1148.3333333333333, 322, 2592, 531.0, 2592.0, 2592.0, 2592.0, 0.06922171716006369, 0.03132102436604444, 0.044390228777775216], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7931d9bf-3913-4287-9b13-04e632c1ab2c", 3, 0, 0.0, 299.3333333333333, 221, 398, 279.0, 398.0, 398.0, 398.0, 0.05856286723797997, 0.037650280857750795, 0.03755496369102231], "isController": false}, {"data": ["register", 22, 6, 27.272727272727273, 1210.5000000000002, 237, 2302, 1126.5, 2005.8, 2261.7999999999993, 2302.0, 0.09250343734363765, 0.029104419561954177, 0.04173494927027402], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 127.3888888888889, 123, 141, 126.0, 132.9, 141.0, 141.0, 0.09277633172692834, 0.07202849972940237, 0.032979086668556555], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5f55b4e2-c66a-4af3-8c0c-eb76f0f1aead", 3, 0, 0.0, 335.6666666666667, 229, 443, 335.0, 443.0, 443.0, 443.0, 0.018954231848163968, 0.026129938762035936, 0.012154894772422856], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 436.33333333333337, 248, 1483, 250.0, 1252.0000000000002, 1483.0, 1483.0, 0.10869722749605067, 17.484621323769186, 0.2407544516043711], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8b759b64-37d8-447c-9052-71c5b9bb147f", 1, 0, 0.0, 275.0, 275, 275, 275.0, 275.0, 275.0, 275.0, 3.6363636363636362, 1.1612215909090908, 2.169744318181818], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 20, 0, 0.0, 391.3, 248, 849, 261.5, 716.7000000000005, 843.5999999999999, 849.0, 0.09599370281309545, 0.14877149059021727, 0.21589208747906136], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 149.5, 122, 370, 124.0, 346.30000000000007, 370.0, 370.0, 0.07126313914127917, 0.052960203990735796, 0.0357707553892749], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 147.9, 121, 359, 123.0, 336.9000000000001, 359.0, 359.0, 0.07126466270435143, 0.01906886482518778, 0.04064312794857542], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 174.0, 122, 366, 125.0, 365.8, 366.0, 366.0, 0.07114197091716229, 0.0191749843487664, 0.04182369774622236], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 172.60000000000002, 121, 368, 123.0, 367.3, 368.0, 368.0, 0.07126517057318578, 0.019208190506053976, 0.041965720562139666], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 127.0, 127, 127, 127.0, 127.0, 127.0, 127.0, 7.874015748031496, 2.3222194881889764, 4.867433562992126], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f39d7ca4-5b8d-4add-aa92-91e3344fc653", 1, 0, 0.0, 456.0, 456, 456, 456.0, 456.0, 456.0, 456.0, 2.1929824561403506, 0.3961931195175438, 1.5119586074561402], "isController": false}, {"data": ["https://demoqa.com/books", 53, 0, 0.0, 1423.3962264150946, 962, 2084, 1341.0, 1953.2, 2004.2999999999997, 2084.0, 0.24151397363396507, 288.9346763086184, 0.4768957565311302], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, 27.272727272727273, 1210.5000000000002, 237, 2302, 1126.5, 2005.8, 2261.7999999999993, 2302.0, 0.08791384443245619, 0.02766039281504126, 0.03966425403104957], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 126.0, 122, 132, 124.0, 132.0, 132.0, 132.0, 0.026283833865142905, 0.0070843145964642985, 0.015477687324883957], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b43d4090-ea73-4a5c-aca8-3b19bf77d75e", 3, 0, 0.0, 509.66666666666663, 256, 953, 320.0, 953.0, 953.0, 953.0, 0.0747477264233213, 0.03382139965117728, 0.04793392612433039], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 124.8, 121, 131, 124.0, 131.0, 131.0, 131.0, 0.026283972033853756, 0.0070843518372496455, 0.015452100746464806], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 236.94444444444446, 119, 1456, 123.0, 476.80000000000155, 1456.0, 1456.0, 0.09018081252912089, 4.531003607545629, 0.052585903486490414], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 170.33333333333334, 120, 735, 123.5, 402.0000000000005, 735.0, 735.0, 0.09017945711966814, 1.4960533179777757, 0.05267317900121241], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 137.2777777777778, 121, 365, 124.0, 152.60000000000034, 365.0, 365.0, 0.09017674642298906, 0.06701611721474089, 0.04526449966935193], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 125.8, 121, 131, 125.0, 131.0, 131.0, 131.0, 0.026283281204825613, 0.007032831103634977, 0.014989683812127105], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 170.61111111111111, 120, 494, 123.5, 383.3000000000002, 494.0, 494.0, 0.09018081252912089, 0.031655265682693806, 0.05101047913566702], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 123.4, 121, 124, 124.0, 124.0, 124.0, 124.0, 0.0262831430433777, 0.019532687359385185, 0.013192905785445448], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 127.2, 126, 131, 126.0, 131.0, 131.0, 131.0, 0.025855025699895545, 0.02035073311925372, 0.009190653666759745], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 696.3076923076923, 124, 2118, 457.0, 1772.3999999999996, 2118.0, 2118.0, 0.07008577420520036, 0.013130552949802412, 0.04769960293713306], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e24c314c-5400-4c4f-aa65-2453803b5ba2", 1, 0, 0.0, 468.0, 468, 468, 468.0, 468.0, 468.0, 468.0, 2.136752136752137, 0.38603432158119655, 1.473190438034188], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1777.8095238095236, 957, 3946, 1477.0, 3693.6000000000004, 3929.3999999999996, 3946.0, 0.08913109911378221, 0.04613230715850056, 0.040996823908780684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 251.8, 249, 259, 250.0, 259.0, 259.0, 259.0, 0.02626588429352651, 0.04070699059944002, 0.059072589382804255], "isController": false}, {"data": ["addBook", 58, 12, 20.689655172413794, 1337.1206896551728, 620, 3762, 984.0, 2463.4000000000005, 3162.0499999999984, 3762.0, 0.2709837176162777, 84.89063193519752, 0.9845471024014764], "isController": true}, {"data": ["https://demoqa.com/books-0", 53, 0, 0.0, 236.58490566037736, 121, 503, 126.0, 496.4, 498.3, 503.0, 0.2424541853081913, 0.18018323732376323, 0.11720197434331511], "isController": false}, {"data": ["https://demoqa.com/books-3", 53, 0, 0.0, 793.4905660377359, 593, 1111, 731.0, 1099.4, 1106.3, 1111.0, 0.24224806201550386, 71.22897362524225, 0.12183374212693798], "isController": false}, {"data": ["https://demoqa.com/books-1", 53, 0, 0.0, 200.71698113207546, 122, 498, 126.0, 378.8, 435.9999999999998, 498.0, 0.2426462172370379, 0.42937006409522716, 0.1180056798672313], "isController": false}, {"data": ["https://demoqa.com/books-2", 53, 0, 0.0, 1185.3018867924532, 836, 1585, 1209.0, 1474.2, 1517.9999999999998, 1585.0, 0.24210862911698872, 217.84977006104108, 0.12152718297473848], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 20, 0, 0.0, 163.45, 126, 369, 127.5, 363.5, 368.75, 369.0, 0.09607578457887582, 0.07177536640902343, 0.03415193904952226], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 12, 7.100591715976331, 231.7218934911242, 122, 2384, 129.0, 379.0, 580.0, 2316.800000000001, 0.7029716149213004, 1.4906665504579715, 0.33864549406633726], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 194.29999999999995, 125, 380, 129.0, 380.0, 380.0, 380.0, 0.07485422140381606, 0.05796816169260366, 0.026608336514637745], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 128.5, 123, 149, 126.0, 140.0, 149.0, 149.0, 0.06615881897056879, 0.053689432191936184, 0.023517392680944372], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 372.59999999999997, 248, 737, 263.0, 712.7, 737.0, 737.0, 0.07107825716113442, 0.11015741612765655, 0.1598566662520435], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 397.1666666666667, 245, 1581, 250.0, 932.100000000001, 1581.0, 1581.0, 0.09012076182083993, 6.121674723817415, 0.20140269210742395], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f37a93a6-4b7e-47a0-85a8-8ab2ba57a547", 1, 0, 0.0, 818.0, 818, 818, 818.0, 818.0, 818.0, 818.0, 1.2224938875305624, 0.2208607121026895, 0.8428522310513448], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 182.9333333333333, 124, 973, 126.0, 468.4000000000003, 973.0, 973.0, 0.07824032297605325, 0.06486917402995039, 0.027811989807893924], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ab9cff23-096f-467d-9810-b4546568e40d", 3, 0, 0.0, 383.0, 230, 474, 445.0, 474.0, 474.0, 474.0, 0.08103508819318765, 0.03756313983955052, 0.05196586059263661], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bf97a5cd-49c2-401e-8fc6-86d899960f60", 1, 0, 0.0, 2436.0, 2436, 2436, 2436.0, 2436.0, 2436.0, 2436.0, 0.41050903119868637, 0.13109028633004927, 0.24494240045155993], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 128.07142857142856, 124, 138, 127.0, 135.5, 138.0, 138.0, 0.07933674481336031, 0.06159444543615376, 0.028201733507874173], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c8e9bee4-c6db-453b-95ea-032ac0b40a8f", 1, 0, 0.0, 448.0, 448, 448, 448.0, 448.0, 448.0, 448.0, 2.232142857142857, 0.4032679966517857, 1.5389578683035714], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7931d9bf-3913-4287-9b13-04e632c1ab2c", 1, 0, 0.0, 482.0, 482, 482, 482.0, 482.0, 482.0, 482.0, 2.074688796680498, 0.3748217064315353, 1.4304006742738589], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 20, 0, 0.0, 149.8, 120, 373, 124.0, 336.80000000000047, 372.3, 373.0, 0.09605179112577501, 0.0713822393034324, 0.04821349671743004], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 20, 0, 0.0, 172.04999999999998, 119, 370, 124.0, 367.8, 369.9, 370.0, 0.09605271372929464, 0.02570160504084642, 0.05478006329873835], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 20, 0, 0.0, 221.35, 119, 373, 125.0, 370.0, 372.85, 373.0, 0.0960513298306615, 0.025888834993420484, 0.05646767632622873], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/25ce99dd-5190-486b-978d-f9a261ece5d7", 3, 0, 0.0, 1434.6666666666667, 203, 2118, 1983.0, 2118.0, 2118.0, 2118.0, 0.03969199015638644, 0.025518125181921623, 0.025453522333359797], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 20, 0, 0.0, 190.9, 120, 489, 124.5, 369.0, 482.9999999999999, 489.0, 0.09605179112577501, 0.02588895932686905, 0.056561748094572595], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 25.0, 0.4765687053216839], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 8.333333333333334, 0.15885623510722796], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.166666666666667, 0.07942811755361398], "isController": false}, {"data": ["401/Unauthorized", 15, 62.5, 1.1914217633042097], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1259, 24, "401/Unauthorized", 15, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 3, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
