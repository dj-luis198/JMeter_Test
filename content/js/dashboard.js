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

    var data = {"OkPercent": 97.4006116207951, "KoPercent": 2.599388379204893};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6980263157894737, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b8d8aa1d-3c97-4eb2-b220-81f6e2d397ab"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/b4aba2f3-624c-449a-8aad-c9c16d672ecd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.288135593220339, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.10869565217391304, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/fb0b355d-08d4-4469-b677-10e2f6b2c582"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7b6b0359-b7b9-4ba1-a8c2-03e5edb4ef79"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/9bbf0d0d-72c5-4ca4-b07d-df2243a07403"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fb0b355d-08d4-4469-b677-10e2f6b2c582"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.3076923076923077, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7b6b0359-b7b9-4ba1-a8c2-03e5edb4ef79"], "isController": false}, {"data": [0.13636363636363635, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3a2a3459-2766-4e28-9bdd-dbdc302f12d1"], "isController": false}, {"data": [0.85, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/dfb944ea-85eb-45c9-89a5-c90cad37becf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.125, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.24528301886792453, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b8d8aa1d-3c97-4eb2-b220-81f6e2d397ab"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0ef74d93-c27c-4e49-9dec-360139cb16bb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9152542372881356, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=498d11fd-f5be-44c9-8eff-86fbea4e9671"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9915254237288136, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.3728813559322034, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.32142857142857145, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/498d11fd-f5be-44c9-8eff-86fbea4e9671"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=939e7ba2-5824-4aef-99f1-6801fe206e86"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/0ef74d93-c27c-4e49-9dec-360139cb16bb"], "isController": false}, {"data": [0.5681818181818182, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e83d3b84-efe4-45af-8e8b-88aed60e9ca2"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dfb944ea-85eb-45c9-89a5-c90cad37becf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/939e7ba2-5824-4aef-99f1-6801fe206e86"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9bbf0d0d-72c5-4ca4-b07d-df2243a07403"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e83d3b84-efe4-45af-8e8b-88aed60e9ca2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/9bc74c1a-e206-4dc4-a60a-a003afda8a9a"], "isController": false}, {"data": [0.7941176470588235, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.03333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=19a5a61d-d233-4490-bfff-b2a28df448fa"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/19a5a61d-d233-4490-bfff-b2a28df448fa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/7d042192-0327-478b-b409-3506edb5165b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.10869565217391304, 500, 1500, "register"], "isController": true}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1308, 34, 2.599388379204893, 518.0275229357794, 134, 4479, 159.0, 1403.1000000000001, 1753.2999999999997, 2694.770000000004, 5.169980909015451, 750.4637030432926, 3.794083826665323], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 59, 0, 0.0, 2312.0847457627115, 1696, 3015, 2303.0, 2805.0, 2912.0, 3015.0, 0.2546605030192377, 306.4423374704874, 1.2521637038104116], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 150.69230769230768, 140, 186, 147.0, 176.39999999999998, 186.0, 186.0, 0.06916659572656848, 0.05369867539318549, 0.02458656332467864], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 533.0714285714286, 284, 1649, 555.0, 1180.0, 1649.0, 1649.0, 0.18096973927431134, 15.724914584706763, 0.4036978419358591], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b8d8aa1d-3c97-4eb2-b220-81f6e2d397ab", 1, 0, 0.0, 573.0, 573, 573, 573.0, 573.0, 573.0, 573.0, 1.7452006980802792, 0.3152950479930192, 1.2032340750436301], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 615.7142857142858, 279, 1805, 558.5, 1347.0, 1805.0, 1805.0, 0.10243277848911651, 8.900641062282787, 0.2285016919700018], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 13, 0, 0.0, 184.30769230769232, 136, 421, 143.0, 418.6, 421.0, 421.0, 0.08112628241931055, 0.06029013761825716, 0.04072159098000549], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 13, 0, 0.0, 194.6153846153846, 134, 570, 141.0, 509.19999999999993, 570.0, 570.0, 0.08112628241931055, 0.021707618537979582, 0.04626733294226305], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 13, 0, 0.0, 184.3846153846154, 135, 424, 140.0, 421.6, 424.0, 424.0, 0.08112577615526226, 0.021865931854348028, 0.047693083247527225], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b4aba2f3-624c-449a-8aad-c9c16d672ecd", 1, 0, 0.0, 524.0, 524, 524, 524.0, 524.0, 524.0, 524.0, 1.9083969465648853, 0.6094197280534351, 1.13870169370229], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 13, 0, 0.0, 182.15384615384616, 137, 407, 142.0, 406.2, 407.0, 407.0, 0.08112628241931055, 0.021866068308329798, 0.0477726057605901], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 149.25, 143, 164, 145.0, 164.0, 164.0, 164.0, 0.03977289675950323, 0.01172989728649412, 0.024586175438247607], "isController": false}, {"data": ["https://demoqa.com/books", 59, 0, 0.0, 1540.0169491525423, 1095, 2383, 1406.0, 2115.0, 2287.0, 2383.0, 0.25538803831686296, 305.5328810746642, 0.5042916147233368], "isController": false}, {"data": ["deleteBook", 14, 4, 28.571428571428573, 763.0714285714286, 143, 3722, 535.0, 2655.5, 3722.0, 3722.0, 0.07445659977982119, 0.01588227414388206, 0.04958925883773248], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 4, 28.571428571428573, 763.0714285714286, 143, 3722, 535.0, 2655.5, 3722.0, 3722.0, 0.07336065144258481, 0.015648498333665203, 0.04885934012094027], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, 34.78260869565217, 1600.7391304347825, 323, 3902, 1494.0, 2881.8000000000006, 3744.5999999999976, 3902.0, 0.09976360363486521, 0.03112529549545642, 0.04501053210869895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 221.7058823529412, 136, 430, 142.0, 418.0, 430.0, 430.0, 0.07318564183807892, 0.01958287681995471, 0.04173868636077938], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 10, 0, 0.0, 226.0, 136, 435, 143.0, 433.6, 435.0, 435.0, 0.04616400223433771, 0.012442641227223836, 0.02718446615947816], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 158.47058823529412, 139, 409, 142.0, 204.99999999999983, 409.0, 409.0, 0.07317997107238791, 0.054384724595788275, 0.03673291516719471], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 10, 0, 0.0, 223.4, 139, 423, 143.5, 421.8, 423.0, 423.0, 0.046163789123811284, 0.012442583787277259, 0.027139258840365617], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fb0b355d-08d4-4469-b677-10e2f6b2c582", 3, 0, 0.0, 1506.3333333333333, 236, 3212, 1071.0, 3212.0, 3212.0, 3212.0, 0.018788634128927607, 0.022207529466841194, 0.012048700922521936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 189.70588235294116, 137, 417, 142.0, 414.6, 417.0, 417.0, 0.07318469664943239, 0.019725562768792324, 0.043096066483991925], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 190.23529411764707, 136, 426, 142.0, 424.4, 426.0, 426.0, 0.07318501170960187, 0.019725647687353628, 0.04302478227459016], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7b6b0359-b7b9-4ba1-a8c2-03e5edb4ef79", 1, 0, 0.0, 750.0, 750, 750, 750.0, 750.0, 750.0, 750.0, 1.3333333333333333, 0.24088541666666666, 0.9192708333333334], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 340.69230769230774, 136, 1656, 141.0, 1162.3999999999996, 1656.0, 1656.0, 0.06778176357720865, 4.708413973536436, 0.039400186790898475], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9bbf0d0d-72c5-4ca4-b07d-df2243a07403", 3, 0, 0.0, 497.3333333333333, 302, 632, 558.0, 632.0, 632.0, 632.0, 0.018551040094981326, 0.025574106380939425, 0.011896337560909248], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 289.0, 137, 1114, 141.0, 894.3999999999999, 1114.0, 1114.0, 0.06778247041034466, 1.549963909093279, 0.03946679147765786], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 10, 0, 0.0, 140.1, 137, 151, 139.0, 150.2, 151.0, 151.0, 0.046163789123811284, 0.012352420136644816, 0.02632778598467362], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 184.84615384615387, 138, 423, 142.0, 417.4, 423.0, 423.0, 0.06778317725822262, 0.05037402138037833, 0.034023977647193775], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 10, 0, 0.0, 226.7, 139, 445, 142.5, 442.40000000000003, 445.0, 445.0, 0.046162084310430784, 0.034306002109607256, 0.023171202476134203], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 160.15384615384616, 136, 419, 138.0, 308.5999999999999, 419.0, 419.0, 0.06778353068768998, 0.02596875048882354, 0.03821989042531558], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fb0b355d-08d4-4469-b677-10e2f6b2c582", 1, 0, 0.0, 3763.0, 3763, 3763, 3763.0, 3763.0, 3763.0, 3763.0, 0.26574541589157585, 0.048010646425724154, 0.18321900744087166], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 149.7, 143, 166, 146.5, 165.2, 166.0, 166.0, 0.04638326491801758, 0.036508702660080244, 0.016487801201326563], "isController": false}, {"data": ["deleteAccount", 13, 3, 23.076923076923077, 916.5384615384615, 141, 2766, 654.0, 2682.0, 2766.0, 2766.0, 0.08061015687976686, 0.016180163700626277, 0.05485027050908414], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/7b6b0359-b7b9-4ba1-a8c2-03e5edb4ef79", 3, 0, 0.0, 393.33333333333337, 262, 654, 264.0, 654.0, 654.0, 654.0, 0.026248785993647796, 0.02188253285473047, 0.0168327175805619], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 2248.8181818181815, 1287, 4479, 2105.0, 3394.5, 4318.349999999998, 4479.0, 0.09323416608395313, 0.04825596486767105, 0.042884074439005784], "isController": false}, {"data": ["goToProfile", 14, 4, 28.571428571428573, 259.5, 140, 457, 256.0, 441.5, 457.0, 457.0, 0.07489514679448772, 0.1346294596047676, 0.048397645082598646], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/3a2a3459-2766-4e28-9bdd-dbdc302f12d1", 1, 0, 0.0, 289.0, 289, 289, 289.0, 289.0, 289.0, 289.0, 3.4602076124567476, 1.1049686418685123, 2.064635596885813], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 0, 0.0, 455.7, 282, 881, 289.0, 877.0, 881.0, 881.0, 0.04613248326544169, 0.07149633881079685, 0.10375303609405491], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dfb944ea-85eb-45c9-89a5-c90cad37becf", 3, 0, 0.0, 513.6666666666666, 426, 610, 505.0, 610.0, 610.0, 610.0, 0.0183350547912554, 0.021671414045263137, 0.011757831360277714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 142.57142857142856, 140, 152, 142.0, 148.5, 152.0, 152.0, 0.18196233379690405, 0.13522786720648827, 0.0913365620816491], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 985.4999999999999, 807, 1240, 962.5, 1240.0, 1240.0, 1240.0, 0.03657778265481547, 10.755082597205458, 0.020860766670324445], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 194.85714285714283, 137, 565, 141.5, 496.5, 565.0, 565.0, 0.18196706396142298, 0.06821226295540507, 0.10268649186997154], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 1576.25, 1241, 1835, 1575.5, 1835.0, 1835.0, 1835.0, 0.03643103377612219, 32.780708230681306, 0.020741496769022694], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 314.125, 135, 423, 414.0, 423.0, 423.0, 423.0, 0.03664345914254306, 0.06484174606082814, 0.020289884115060462], "isController": false}, {"data": ["addBook", 53, 11, 20.754716981132077, 1454.2075471698115, 721, 4303, 1149.0, 2520.0, 2734.9999999999995, 4303.0, 0.2477098523088428, 68.06028105428585, 0.9021107917367732], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 166.30769230769232, 139, 414, 143.0, 318.3999999999999, 414.0, 414.0, 0.08872690541029368, 0.06593864747776709, 0.04453674744227632], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b8d8aa1d-3c97-4eb2-b220-81f6e2d397ab", 3, 0, 0.0, 1099.3333333333335, 259, 2766, 273.0, 2766.0, 2766.0, 2766.0, 0.020934370747705943, 0.024743717508112068, 0.013424710407871323], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 183.6153846153846, 138, 426, 141.0, 420.4, 426.0, 426.0, 0.08889192792915997, 0.023785535402919757, 0.05069617764709904], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0ef74d93-c27c-4e49-9dec-360139cb16bb", 1, 0, 0.0, 481.0, 481, 481, 481.0, 481.0, 481.0, 481.0, 2.079002079002079, 0.37560096153846156, 1.4333744802494803], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 183.0, 137, 428, 139.0, 424.4, 428.0, 428.0, 0.08889192792915997, 0.023959152449656396, 0.05225873106772881], "isController": false}, {"data": ["https://demoqa.com/books-0", 59, 0, 0.0, 243.37288135593224, 138, 823, 145.0, 564.0, 585.0, 823.0, 0.25710077478843657, 0.1910680562636721, 0.12428211281276963], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 245.99999999999997, 136, 550, 143.0, 547.6, 550.0, 550.0, 0.08889314360345453, 0.023959480111868603, 0.052346255461799884], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=498d11fd-f5be-44c9-8eff-86fbea4e9671", 1, 0, 0.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 0.7084865196078431, 2.703737745098039], "isController": false}, {"data": ["https://demoqa.com/books-3", 59, 0, 0.0, 861.2711864406782, 674, 1252, 820.0, 1116.0, 1124.0, 1252.0, 0.25712430434801553, 75.60308280873437, 0.12931544603440234], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 175.125, 137, 419, 140.5, 419.0, 419.0, 419.0, 0.036688496321978244, 0.02726557197365766, 0.020601450571423333], "isController": false}, {"data": ["https://demoqa.com/books-1", 59, 0, 0.0, 197.40677966101688, 135, 551, 144.0, 423.0, 428.0, 551.0, 0.2575935523024061, 0.45581984059761704, 0.1252749893033186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 841.2222222222224, 136, 1696, 832.0, 1669.9, 1696.0, 1696.0, 0.08414085178588958, 37.866382464871194, 0.04585019071926405], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 300.2142857142857, 136, 1507, 143.5, 964.5, 1507.0, 1507.0, 0.1813001813001813, 11.697820047429422, 0.10547178515928517], "isController": false}, {"data": ["https://demoqa.com/books-2", 59, 0, 0.0, 1294.9999999999998, 946, 1792, 1257.0, 1677.0, 1750.0, 1792.0, 0.25634564082065364, 230.6602582179959, 0.12867349549005466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 634.5, 138, 1269, 613.0, 1265.4, 1269.0, 1269.0, 0.08413888525325804, 12.381151998649104, 0.04593128599274536], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 268.7142857142857, 136, 1087, 142.0, 757.5, 1087.0, 1087.0, 0.1819646988484234, 3.8672321788323063, 0.10603606962749226], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 148.42857142857144, 140, 159, 147.5, 157.5, 159.0, 159.0, 0.0994833969316478, 0.07432109243428767, 0.03536323875304668], "isController": false}, {"data": ["deleteBooks", 14, 4, 28.571428571428573, 965.5000000000001, 143, 3763, 517.0, 3444.5, 3763.0, 3763.0, 0.07362724628839792, 0.01570536545409604, 0.04926287293515018], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 165, 11, 6.666666666666667, 243.38181818181823, 137, 2590, 150.0, 409.80000000000007, 515.4999999999993, 2265.2800000000016, 0.6957387058416752, 1.5812572736319248, 0.32882465882449674], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 13, 0, 0.0, 180.6153846153846, 142, 428, 149.0, 369.19999999999993, 428.0, 428.0, 0.07852138197632277, 0.06080806240939841, 0.027911897499395988], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/498d11fd-f5be-44c9-8eff-86fbea4e9671", 3, 0, 0.0, 1086.0, 245, 2556, 457.0, 2556.0, 2556.0, 2556.0, 0.0632351081320349, 0.029312107415370346, 0.04055115983727499], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 436.5384615384615, 281, 961, 286.0, 854.5999999999999, 961.0, 961.0, 0.08864039274512478, 0.13737529617823538, 0.1993543207929906], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 153.35294117647058, 141, 206, 148.0, 173.99999999999997, 206.0, 206.0, 0.07411121041044531, 0.06014298422957037, 0.026344219325587986], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=939e7ba2-5824-4aef-99f1-6801fe206e86", 1, 0, 0.0, 2408.0, 2408, 2408, 2408.0, 2408.0, 2408.0, 2408.0, 0.4152823920265781, 0.0750266040282392, 0.28631774294019935], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0ef74d93-c27c-4e49-9dec-360139cb16bb", 3, 0, 0.0, 1043.0, 240, 2110, 779.0, 2110.0, 2110.0, 2110.0, 0.02634745264045388, 0.02642464244311146, 0.01689599013727023], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 860.9090909090909, 244, 2026, 744.5, 1578.3, 1962.3999999999992, 2026.0, 0.09239310747418242, 0.0567531880871687, 0.041775399180221155], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 158.27777777777777, 137, 412, 142.0, 183.40000000000038, 412.0, 412.0, 0.08413927855243046, 0.06252928806484333, 0.04223397380463794], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 232.77777777777777, 134, 433, 141.5, 421.3, 433.0, 433.0, 0.08413967185527976, 0.08570085717290703, 0.04445269772822886], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e83d3b84-efe4-45af-8e8b-88aed60e9ca2", 1, 0, 0.0, 530.0, 530, 530, 530.0, 530.0, 530.0, 530.0, 1.8867924528301887, 0.3408755896226415, 1.3008549528301887], "isController": false}, {"data": ["login", 22, 0, 0.0, 4287.636363636364, 2327, 8028, 3935.5, 6586.7, 7830.299999999997, 8028.0, 0.09615678801361931, 41.959991537109964, 0.20306121417613301], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 13, 0, 0.0, 403.6153846153846, 277, 991, 289.0, 928.1999999999999, 991.0, 991.0, 0.08105142401117263, 0.1256138768610654, 0.1822865522438775], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dfb944ea-85eb-45c9-89a5-c90cad37becf", 1, 0, 0.0, 3126.0, 3126, 3126, 3126.0, 3126.0, 3126.0, 3126.0, 0.3198976327575176, 0.057794005918106205, 0.22055442258477287], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 151.3571428571429, 140, 202, 148.0, 181.5, 202.0, 202.0, 0.17604084147522225, 0.14251743904585865, 0.06257701786814542], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 580.4615384615383, 279, 2066, 548.0, 1635.1999999999996, 2066.0, 2066.0, 0.0677326747633264, 6.3301150543684965, 0.15099929304020715], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/939e7ba2-5824-4aef-99f1-6801fe206e86", 3, 0, 0.0, 912.0, 352, 1225, 1159.0, 1225.0, 1225.0, 1225.0, 0.01570812214635781, 0.021654914482365013, 0.01007324239203284], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 182.84615384615387, 141, 580, 145.0, 423.1999999999999, 580.0, 580.0, 0.09237350159521932, 0.07658701450619257, 0.03283589314517561], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9bbf0d0d-72c5-4ca4-b07d-df2243a07403", 1, 0, 0.0, 510.0, 510, 510, 510.0, 510.0, 510.0, 510.0, 1.9607843137254901, 0.3542432598039216, 1.3518688725490196], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 1018.6666666666667, 280, 1836, 1117.0, 1809.0, 1836.0, 1836.0, 0.08408385963601031, 50.36192098190095, 0.17834974914981874], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 164.11111111111111, 140, 407, 147.5, 212.6000000000003, 407.0, 407.0, 0.0862473766422938, 0.06695963323303084, 0.030658247165815375], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e83d3b84-efe4-45af-8e8b-88aed60e9ca2", 3, 0, 0.0, 439.66666666666663, 253, 787, 279.0, 787.0, 787.0, 787.0, 0.047747891134808214, 0.030697293291421297, 0.030619578624860738], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9bc74c1a-e206-4dc4-a60a-a003afda8a9a", 1, 0, 0.0, 834.0, 834, 834, 834.0, 834.0, 834.0, 834.0, 1.199040767386091, 0.38289680755395683, 0.715443270383693], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 416.70588235294116, 278, 833, 294.0, 623.3999999999999, 833.0, 833.0, 0.07313589509731376, 0.11334635304632515, 0.1644843421964], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 15, 7, 46.666666666666664, 1001.7333333333332, 140, 1975, 1381.0, 1941.4, 1975.0, 1975.0, 0.0682624920360426, 43.56354918028124, 0.10312258237007373], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=19a5a61d-d233-4490-bfff-b2a28df448fa", 1, 0, 0.0, 524.0, 524, 524, 524.0, 524.0, 524.0, 524.0, 1.9083969465648853, 0.34477874522900764, 1.3157502385496183], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/19a5a61d-d233-4490-bfff-b2a28df448fa", 3, 0, 0.0, 406.3333333333333, 262, 585, 372.0, 585.0, 585.0, 585.0, 0.0709085752103621, 0.03208428370520942, 0.04547197043112414], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 185.64285714285714, 138, 467, 142.0, 447.5, 467.0, 467.0, 0.10369525446074764, 0.07706258656702046, 0.05205015702424247], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7d042192-0327-478b-b409-3506edb5165b", 1, 0, 0.0, 1098.0, 1098, 1098, 1098.0, 1098.0, 1098.0, 1098.0, 0.9107468123861566, 0.2908341871584699, 0.5434241234061931], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 258.7857142857143, 136, 430, 142.5, 428.5, 430.0, 430.0, 0.10373905182506632, 0.03888767191042874, 0.0585413594632245], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 366.2857142857143, 137, 1664, 275.0, 1042.5, 1664.0, 1664.0, 0.10258063570685386, 6.618690661223787, 0.0596765137970955], "isController": false}, {"data": ["register", 23, 8, 34.78260869565217, 1600.7391304347825, 323, 3902, 1494.0, 2881.8000000000006, 3744.5999999999976, 3902.0, 0.09820414506887098, 0.03063875925467324, 0.04430694826349453], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 311.0, 136, 1133, 141.0, 781.0, 1133.0, 1133.0, 0.10298130889243602, 2.1886257833935283, 0.060010174001632985], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 23.529411764705884, 0.6116207951070336], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 11.764705882352942, 0.3058103975535168], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 8.823529411764707, 0.22935779816513763], "isController": false}, {"data": ["401/Unauthorized", 19, 55.88235294117647, 1.452599388379205], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1308, 34, "401/Unauthorized", 19, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 165, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 15, 7, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
