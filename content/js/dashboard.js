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

    var data = {"OkPercent": 98.56386999244143, "KoPercent": 1.436130007558579};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7439739413680782, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/ec15769e-21e2-4699-9310-1a5cfd42d141"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/73f5862a-43ad-4a42-9c13-4da6e8bdc7f8"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7285d530-36eb-40c6-8015-a231308be8f3"], "isController": false}, {"data": [0.5384615384615384, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5384615384615384, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/973012df-cf21-416c-869a-0532c2a71e38"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=df55651f-55ce-4995-bfaf-33786bb41901"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/977d434f-62f1-4ec3-acb5-d72313ec6102"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a8a09f1a-99c8-40e2-b199-86f14c269403"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8d6bf421-060a-4151-98bc-6626698a40e3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5681818181818182, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/df55651f-55ce-4995-bfaf-33786bb41901"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=977d434f-62f1-4ec3-acb5-d72313ec6102"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ca32057c-9c69-4194-a63d-c52d7bede2d1"], "isController": false}, {"data": [0.4230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=72628c83-c614-4bb4-9a9d-48d56a203e5d"], "isController": false}, {"data": [0.825, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.125, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/a4f37fa6-e229-4e9c-af6b-a3a0a7437e2b"], "isController": false}, {"data": [0.20454545454545456, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/81fd1a52-c2b8-4f3b-9190-b9ea7c53e656"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8157894736842105, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.7894736842105263, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.3125, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.20454545454545456, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=973012df-cf21-416c-869a-0532c2a71e38"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.22727272727272727, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ca32057c-9c69-4194-a63d-c52d7bede2d1"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cab4e5bc-1b65-473b-bf93-b6f67c69d036"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/8d6bf421-060a-4151-98bc-6626698a40e3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a8a09f1a-99c8-40e2-b199-86f14c269403"], "isController": false}, {"data": [0.28688524590163933, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/170a67ae-4d5c-4e99-a415-b6232066106e"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=73f5862a-43ad-4a42-9c13-4da6e8bdc7f8"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.44642857142857145, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9241573033707865, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/cab4e5bc-1b65-473b-bf93-b6f67c69d036"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/d7c7906a-a7e1-45ea-b876-25014c549808"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a4f37fa6-e229-4e9c-af6b-a3a0a7437e2b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7285d530-36eb-40c6-8015-a231308be8f3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ec15769e-21e2-4699-9310-1a5cfd42d141"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/999cc040-f23a-4848-a487-4dd612ba7f96"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/72628c83-c614-4bb4-9a9d-48d56a203e5d"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1323, 19, 1.436130007558579, 440.3560090702947, 119, 3238, 139.0, 1228.8000000000004, 1498.3999999999999, 2051.7199999999993, 5.111818617374774, 724.4387901196138, 3.7378951106401557], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/ec15769e-21e2-4699-9310-1a5cfd42d141", 2, 0, 0.0, 442.5, 350, 535, 442.5, 535.0, 535.0, 535.0, 0.03716228771043145, 0.03131938895908432, 0.023099410280946895], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/73f5862a-43ad-4a42-9c13-4da6e8bdc7f8", 3, 0, 0.0, 541.6666666666666, 235, 1037, 353.0, 1037.0, 1037.0, 1037.0, 0.03213402028727814, 0.026475001740592766, 0.020606777332662092], "isController": false}, {"data": ["see books", 56, 0, 0.0, 2046.6964285714282, 1528, 2929, 2013.0, 2570.7, 2648.75, 2929.0, 0.2511526110901818, 302.221260545046, 1.2349154266006495], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/7285d530-36eb-40c6-8015-a231308be8f3", 3, 0, 0.0, 373.0, 231, 483, 405.0, 483.0, 483.0, 483.0, 0.05247507433968865, 0.033736416608361026, 0.03365100795871961], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 793.2307692307693, 391, 1262, 872.0, 1240.0, 1262.0, 1262.0, 0.06947339169098236, 0.01316195116020564, 0.046964472042303945], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 793.2307692307693, 391, 1262, 872.0, 1240.0, 1262.0, 1262.0, 0.06994210945402114, 0.013250751205156348, 0.047281328348613], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 152.50000000000003, 122, 387, 127.0, 356.5000000000005, 386.7, 387.0, 0.11583794271813733, 0.03099569951637659, 0.06606382670643769], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 129.1, 123, 143, 128.0, 138.70000000000002, 142.8, 143.0, 0.11583995551745709, 0.0860880919421727, 0.05814622767184858], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 164.40000000000003, 124, 386, 126.5, 374.9, 385.45, 386.0, 0.11567179285495335, 0.031177162917936648, 0.06811532333157898], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 165.05, 125, 378, 127.5, 376.9, 377.95, 378.0, 0.11583727180057456, 0.031221764664998607, 0.06809964611713465], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/973012df-cf21-416c-869a-0532c2a71e38", 3, 0, 0.0, 371.0, 316, 479, 318.0, 479.0, 479.0, 479.0, 0.020115327879844443, 0.023775636566313534, 0.012899477839613788], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 481.3076923076923, 137, 2501, 271.0, 1770.9999999999993, 2501.0, 2501.0, 0.06985266461049079, 0.1432997609561218, 0.045153408877199014], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=df55651f-55ce-4995-bfaf-33786bb41901", 1, 0, 0.0, 1106.0, 1106, 1106, 1106.0, 1106.0, 1106.0, 1106.0, 0.9041591320072332, 0.16334906193490054, 0.6233753390596745], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/977d434f-62f1-4ec3-acb5-d72313ec6102", 3, 0, 0.0, 324.0, 260, 441, 271.0, 441.0, 441.0, 441.0, 0.04121785007693999, 0.03436162566635524, 0.026432019743350185], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 141.4736842105263, 126, 382, 128.0, 133.0, 382.0, 382.0, 0.12057444202590448, 0.08960659216964188, 0.06052271797003408], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 126.26315789473685, 120, 129, 127.0, 129.0, 129.0, 129.0, 0.12057444202590448, 0.041794512593683164, 0.06823214467029236], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 941.8333333333333, 754, 1027, 999.5, 1027.0, 1027.0, 1027.0, 0.05147254368732145, 15.134636893374626, 0.02935543507167552], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1385.3333333333333, 1245, 1633, 1375.5, 1633.0, 1633.0, 1633.0, 0.051318456682946025, 46.17643753153947, 0.029217441646638212], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 208.16666666666666, 125, 379, 127.5, 379.0, 379.0, 379.0, 0.051873497829958676, 0.09179177545691906, 0.028722923114830635], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a8a09f1a-99c8-40e2-b199-86f14c269403", 1, 0, 0.0, 813.0, 813, 813, 813.0, 813.0, 813.0, 813.0, 1.2300123001230012, 0.22221901906519068, 0.8480358241082412], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 147.83333333333331, 123, 381, 127.0, 305.10000000000025, 381.0, 381.0, 0.0642370776412145, 0.047738687582972894, 0.03224400186287525], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8d6bf421-060a-4151-98bc-6626698a40e3", 1, 0, 0.0, 447.0, 447, 447, 447.0, 447.0, 447.0, 447.0, 2.237136465324385, 0.4041701621923937, 1.5424007270693512], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 185.91666666666669, 121, 378, 126.0, 375.6, 378.0, 378.0, 0.0642370776412145, 0.03326861670806389, 0.0357360565393345], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 350.6666666666667, 126, 1314, 128.0, 1253.7000000000003, 1314.0, 1314.0, 0.0642374215099006, 9.64791912575546, 0.03684451064467606], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 292.0833333333333, 126, 998, 128.0, 921.2000000000003, 998.0, 998.0, 0.0642370776412145, 3.16240053290009, 0.036907044933835814], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 129.16666666666669, 126, 135, 128.5, 135.0, 135.0, 135.0, 0.05186946185433326, 0.03854751999135509, 0.029125918521720338], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 13, 0, 0.0, 1112.076923076923, 126, 1763, 1234.0, 1762.2, 1763.0, 1763.0, 0.09129918743723181, 63.19888595239098, 0.047638533348783964], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 224.78947368421055, 121, 1247, 127.0, 377.0, 1247.0, 1247.0, 0.12057520719897448, 5.740987449469469, 0.07033966908451687], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 13, 0, 0.0, 765.8461538461538, 124, 1135, 977.0, 1131.0, 1135.0, 1135.0, 0.09130046984626405, 20.655963149725746, 0.047728363105480134], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 219.2105263157895, 124, 999, 126.0, 510.0, 999.0, 999.0, 0.12057520719897448, 1.896741712834279, 0.07045741831029712], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 641.076923076923, 135, 1269, 575.0, 1203.8, 1269.0, 1269.0, 0.0701129897796834, 0.013283125016854084, 0.04795513611358305], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 540.3333333333334, 254, 1442, 383.0, 1381.1000000000001, 1442.0, 1442.0, 0.06419309282321223, 12.882448321216886, 0.14163436951683997], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 771.6818181818182, 180, 1546, 711.5, 1264.6, 1506.8499999999995, 1546.0, 0.09935688994869571, 0.061030745876689066, 0.04492406254516222], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 13, 0, 0.0, 128.00000000000003, 122, 139, 127.0, 136.6, 139.0, 139.0, 0.09129854624622515, 0.06784979852868882, 0.04582759059624974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 13, 0, 0.0, 275.46153846153845, 126, 507, 376.0, 456.19999999999993, 507.0, 507.0, 0.09129854624622515, 0.1299111375447714, 0.0461705088138212], "isController": false}, {"data": ["login", 22, 0, 0.0, 3224.863636363636, 1924, 4879, 3291.5, 4298.1, 4795.149999999999, 4879.0, 0.09650138611081868, 31.617783025954488, 0.1892417540662175], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/df55651f-55ce-4995-bfaf-33786bb41901", 3, 0, 0.0, 550.0, 250, 893, 507.0, 893.0, 893.0, 893.0, 0.03218366142788178, 0.02683019430885587, 0.020638611006812208], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 136.578947368421, 127, 207, 130.0, 148.0, 207.0, 207.0, 0.11984735231967705, 0.09702485846973855, 0.0426019885198852], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=977d434f-62f1-4ec3-acb5-d72313ec6102", 1, 0, 0.0, 448.0, 448, 448, 448.0, 448.0, 448.0, 448.0, 2.232142857142857, 0.4032679966517857, 1.5389578683035714], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ca32057c-9c69-4194-a63d-c52d7bede2d1", 3, 0, 0.0, 383.0, 212, 540, 397.0, 540.0, 540.0, 540.0, 0.02320490706434721, 0.02742741456726716, 0.014880750949467449], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 13, 0, 0.0, 1241.2307692307693, 254, 1891, 1374.0, 1889.4, 1891.0, 1891.0, 0.09121654808515416, 83.97624143309967, 0.18719537839079975], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=72628c83-c614-4bb4-9a9d-48d56a203e5d", 1, 0, 0.0, 239.0, 239, 239, 239.0, 239.0, 239.0, 239.0, 4.184100418410042, 0.755916579497908, 2.884741108786611], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 345.65, 252, 517, 257.0, 513.0, 516.8, 517.0, 0.11558889653059927, 0.17914021366607524, 0.25996213741208024], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, 25.0, 1169.0, 125, 1762, 1470.5, 1762.0, 1762.0, 1762.0, 0.06834569251272939, 61.32847874235382, 0.12690506943495197], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a4f37fa6-e229-4e9c-af6b-a3a0a7437e2b", 3, 0, 0.0, 1202.0, 676, 1574, 1356.0, 1574.0, 1574.0, 1574.0, 0.017881303904680727, 0.024650820975365525, 0.011466851787832369], "isController": false}, {"data": ["register", 22, 6, 27.272727272727273, 1229.1818181818182, 354, 2204, 1110.5, 2042.8999999999999, 2185.9999999999995, 2204.0, 0.10263156667086523, 0.032291039797722514, 0.04630447636908177], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/81fd1a52-c2b8-4f3b-9190-b9ea7c53e656", 1, 0, 0.0, 228.0, 228, 228, 228.0, 228.0, 228.0, 228.0, 4.385964912280701, 1.400596217105263, 2.617016173245614], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 136.85714285714286, 127, 174, 133.0, 157.0, 174.0, 174.0, 0.06745590070491415, 0.052370547910553476, 0.023978464703699954], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 401.4736842105263, 254, 1629, 258.0, 638.0, 1629.0, 1629.0, 0.12047581606513304, 7.762726942355492, 0.2693305725613159], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 539.9473684210526, 250, 1500, 282.0, 1496.0, 1500.0, 1500.0, 0.103550134615175, 19.69545275252608, 0.22870337348626055], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 150.2727272727273, 123, 377, 128.0, 328.00000000000017, 377.0, 377.0, 0.04898948062243362, 0.036407221439132796, 0.0245904228905575], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 182.36363636363637, 121, 382, 128.0, 381.8, 382.0, 382.0, 0.04896723646723646, 0.01310256132033476, 0.0279266270477208], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 179.18181818181816, 121, 379, 127.0, 377.0, 379.0, 379.0, 0.04897028839048018, 0.013199023042746609, 0.028789173448309634], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 135.63636363636363, 124, 226, 127.0, 206.60000000000008, 226.0, 226.0, 0.04896854438775965, 0.013198552979513343, 0.028835969009588933], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 135.0, 135, 135, 135.0, 135.0, 135.0, 135.0, 7.407407407407407, 2.1846064814814814, 4.578993055555555], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1423.285714285714, 980, 2406, 1350.5, 2030.1000000000001, 2126.85, 2406.0, 0.24958106036296215, 298.58571660961957, 0.492825101615146], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, 27.272727272727273, 1229.1818181818182, 354, 2204, 1110.5, 2042.8999999999999, 2185.9999999999995, 2204.0, 0.09755621676991366, 0.03069417899792028, 0.04401462123798839], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 126.55555555555556, 123, 129, 127.0, 129.0, 129.0, 129.0, 0.07465038735256548, 0.020120612216121166, 0.04395916364609081], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 125.33333333333333, 120, 131, 126.0, 131.0, 131.0, 131.0, 0.07464729154743835, 0.020119777799895495, 0.043884442882380754], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=973012df-cf21-416c-869a-0532c2a71e38", 1, 0, 0.0, 533.0, 533, 533, 533.0, 533.0, 533.0, 533.0, 1.876172607879925, 0.3389569652908067, 1.2935330675422139], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 163.92857142857144, 121, 382, 127.5, 381.0, 382.0, 382.0, 0.06632147915847518, 0.017875711179432763, 0.03898977583340044], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 145.99999999999997, 121, 375, 127.0, 256.5, 375.0, 375.0, 0.0664016922945579, 0.01789733112626756, 0.039101777786736736], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 126.42857142857143, 119, 132, 127.0, 130.5, 132.0, 132.0, 0.0664016922945579, 0.0493473514024986, 0.03333053695254176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 154.22222222222223, 125, 376, 127.0, 376.0, 376.0, 376.0, 0.07465100654440492, 0.019974976360514592, 0.04257440216985592], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 146.1428571428571, 121, 375, 126.5, 264.0, 375.0, 375.0, 0.06632336430002796, 0.017746681463093418, 0.037825043702359694], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 128.66666666666666, 124, 138, 128.0, 138.0, 138.0, 138.0, 0.0746429578516098, 0.055471963794018614, 0.037467265952858826], "isController": false}, {"data": ["deleteAccount", 12, 1, 8.333333333333334, 682.8333333333334, 125, 1356, 596.0, 1260.3000000000004, 1356.0, 1356.0, 0.08205633167169263, 0.015418950995274922, 0.0558461183081352], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 194.8888888888889, 129, 390, 132.0, 390.0, 390.0, 390.0, 0.08025252795463056, 0.0631675171205393, 0.028527265796372585], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1696.2272727272725, 932, 3238, 1520.0, 2704.4, 3163.8999999999987, 3238.0, 0.09999727280165087, 0.05175640096179195, 0.045994839345290583], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ca32057c-9c69-4194-a63d-c52d7bede2d1", 1, 0, 0.0, 1269.0, 1269, 1269, 1269.0, 1269.0, 1269.0, 1269.0, 0.7880220646178093, 0.14236726753349094, 0.5433042750197006], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 284.22222222222223, 252, 506, 255.0, 506.0, 506.0, 506.0, 0.07456133083690951, 0.11555550003728066, 0.167690180583401], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cab4e5bc-1b65-473b-bf93-b6f67c69d036", 1, 0, 0.0, 575.0, 575, 575, 575.0, 575.0, 575.0, 575.0, 1.7391304347826089, 0.3141983695652174, 1.1990489130434783], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8d6bf421-060a-4151-98bc-6626698a40e3", 3, 0, 0.0, 577.3333333333334, 274, 940, 518.0, 940.0, 940.0, 940.0, 0.03315686512892495, 0.027641514191138274, 0.02126270322395252], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a8a09f1a-99c8-40e2-b199-86f14c269403", 3, 0, 0.0, 439.66666666666663, 249, 708, 362.0, 708.0, 708.0, 708.0, 0.02160589408790718, 0.025537435362366852, 0.013855342237362353], "isController": false}, {"data": ["addBook", 61, 9, 14.754098360655737, 1279.72131147541, 641, 2688, 1017.0, 2299.2, 2526.3999999999996, 2688.0, 0.28349545245409463, 90.09605659568436, 1.0298449764954385], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/170a67ae-4d5c-4e99-a415-b6232066106e", 1, 0, 0.0, 594.0, 594, 594, 594.0, 594.0, 594.0, 594.0, 1.6835016835016834, 0.5376025883838385, 1.0045112584175084], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 228.99999999999994, 123, 647, 129.0, 506.3, 512.05, 647.0, 0.25055592094960694, 0.18620415609633875, 0.12111834069341351], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=73f5862a-43ad-4a42-9c13-4da6e8bdc7f8", 1, 0, 0.0, 776.0, 776, 776, 776.0, 776.0, 776.0, 776.0, 1.288659793814433, 0.23281451353092783, 0.8884705219072164], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 788.2678571428571, 596, 1127, 746.5, 1003.3, 1026.7, 1127.0, 0.2503162477594461, 73.60128812294103, 0.12589147226183078], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 223.2678571428571, 122, 495, 132.0, 382.6, 449.44999999999993, 495.0, 0.25100739127121796, 0.44416542283539745, 0.1220719539580728], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1192.8214285714287, 849, 1877, 1121.5, 1564.1000000000001, 1625.65, 1877.0, 0.25017087564273816, 225.1041936568281, 0.12557405281285877], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 139.0, 127, 229, 134.0, 145.0, 229.0, 229.0, 0.10618618350090259, 0.07932854529120163, 0.03774586991633646], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 9, 5.056179775280899, 211.36516853932577, 123, 1914, 133.0, 383.19999999999993, 493.5999999999998, 977.0600000000095, 0.7349146384261267, 1.5980498505914411, 0.3539744224933424], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 154.27272727272725, 123, 380, 130.0, 332.60000000000014, 380.0, 380.0, 0.05141340113670356, 0.03981526084121672, 0.018275857435312595], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 131.24999999999997, 127, 139, 130.5, 135.9, 138.85, 139.0, 0.11500598031097617, 0.0933300484750207, 0.04088103206366731], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 334.18181818181824, 252, 760, 256.0, 710.4000000000002, 760.0, 760.0, 0.048938915335676465, 0.07584576038839702, 0.11006476759576456], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cab4e5bc-1b65-473b-bf93-b6f67c69d036", 3, 0, 0.0, 1147.3333333333333, 324, 2501, 617.0, 2501.0, 2501.0, 2501.0, 0.027005860271678957, 0.022513674529872983, 0.01731821117682537], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 312.64285714285717, 247, 510, 259.5, 509.5, 510.0, 510.0, 0.06628222973420826, 0.10272451034002784, 0.14907028816199377], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d7c7906a-a7e1-45ea-b876-25014c549808", 1, 0, 0.0, 792.0, 792, 792, 792.0, 792.0, 792.0, 792.0, 1.2626262626262628, 0.4032019412878788, 0.7533834438131313], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 153.00000000000003, 123, 363, 131.0, 303.9000000000002, 363.0, 363.0, 0.06236649671796311, 0.05170815987651434, 0.02216934063021345], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a4f37fa6-e229-4e9c-af6b-a3a0a7437e2b", 1, 0, 0.0, 822.0, 822, 822, 822.0, 822.0, 822.0, 822.0, 1.2165450121654502, 0.21978596411192217, 0.8387507603406327], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7285d530-36eb-40c6-8015-a231308be8f3", 1, 0, 0.0, 449.0, 449, 449, 449.0, 449.0, 449.0, 449.0, 2.2271714922048997, 0.40236984966592426, 1.5355303452115812], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 13, 0, 0.0, 173.53846153846155, 128, 387, 133.0, 385.8, 387.0, 387.0, 0.08984725965858041, 0.06975446428571429, 0.03193789308176101], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ec15769e-21e2-4699-9310-1a5cfd42d141", 1, 0, 0.0, 722.0, 722, 722, 722.0, 722.0, 722.0, 722.0, 1.3850415512465375, 0.25022723337950137, 0.9549212257617729], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 156.1052631578947, 122, 377, 128.0, 375.0, 377.0, 377.0, 0.10362185657644293, 0.07700803989714167, 0.05201331472684733], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 245.05263157894737, 122, 386, 130.0, 380.0, 386.0, 386.0, 0.10362976901469907, 0.05230491014208187, 0.05772715031770705], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/999cc040-f23a-4848-a487-4dd612ba7f96", 1, 0, 0.0, 240.0, 240, 240, 240.0, 240.0, 240.0, 240.0, 4.166666666666667, 1.33056640625, 2.4861653645833335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 329.31578947368416, 121, 1373, 128.0, 1368.0, 1373.0, 1373.0, 0.10363033423509906, 14.746693502037155, 0.05951713377585304], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/72628c83-c614-4bb4-9a9d-48d56a203e5d", 3, 0, 0.0, 428.6666666666667, 343, 575, 368.0, 575.0, 575.0, 575.0, 0.07722802862585594, 0.03494367180662102, 0.04952448450290892], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 288.57894736842104, 120, 985, 128.0, 749.0, 985.0, 985.0, 0.10362976901469907, 4.834667481387548, 0.059618010103902476], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 31.57894736842105, 0.45351473922902497], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.2631578947368425, 0.07558578987150416], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.2631578947368425, 0.07558578987150416], "isController": false}, {"data": ["401/Unauthorized", 11, 57.89473684210526, 0.8314436885865457], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1323, 19, "401/Unauthorized", 11, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
