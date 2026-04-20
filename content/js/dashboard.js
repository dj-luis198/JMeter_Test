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

    var data = {"OkPercent": 98.34710743801652, "KoPercent": 1.6528925619834711};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7372333548804137, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e1be1b4b-d67b-4bf3-b02e-c91ad38fda28"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5714285714285714, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e0d494c0-1f5b-480e-a9e6-e13b9febd8eb"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=444254a7-1d2f-4d6c-80db-025ff48a821d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.55, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9565217391304348, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.725, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9565217391304348, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d1055c6b-052b-4124-b7ab-de32719ae075"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7045454545454546, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6c1ef008-c83b-43ba-b6b3-01c1cdffd715"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4b3497c1-a60f-4578-ba3b-7dfe970b0c92"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5841434c-5182-4822-a935-105c24e46455"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dfc479a5-1aae-422c-a1cd-5e3ddffccf2e"], "isController": false}, {"data": [0.45, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9ea7ad51-8509-4be8-bc08-b45a1330f8fb"], "isController": false}, {"data": [0.8157894736842105, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/c19d92fe-481b-4707-93a1-7f40bd012244"], "isController": false}, {"data": [0.8043478260869565, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ffa6792c-12ef-4784-98bd-1fe5def1b7b0"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e1be1b4b-d67b-4bf3-b02e-c91ad38fda28"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e0d494c0-1f5b-480e-a9e6-e13b9febd8eb"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=be89862d-9259-453d-9a9d-f5616fd56121"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.2672413793103448, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d1055c6b-052b-4124-b7ab-de32719ae075"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6c1ef008-c83b-43ba-b6b3-01c1cdffd715"], "isController": false}, {"data": [0.2711864406779661, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a9dcc17c-66fe-4f41-9dc8-54e9dc0e8d89"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0f2a6c31-c4e4-4a8e-bbb6-382b2c18a13a"], "isController": false}, {"data": [0.9137931034482759, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/444254a7-1d2f-4d6c-80db-025ff48a821d"], "isController": false}, {"data": [0.9913793103448276, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.3793103448275862, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/e8baf748-dd7e-41e6-89a1-cec78598bb31"], "isController": false}, {"data": [0.9204545454545454, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3b20d40d-de84-4247-9083-27c2290d3857"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/a9dcc17c-66fe-4f41-9dc8-54e9dc0e8d89"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/9ea7ad51-8509-4be8-bc08-b45a1330f8fb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5841434c-5182-4822-a935-105c24e46455"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fe06524e-cdb2-4370-8a52-021d25d5ec17"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/be89862d-9259-453d-9a9d-f5616fd56121"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ffa6792c-12ef-4784-98bd-1fe5def1b7b0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dfc479a5-1aae-422c-a1cd-5e3ddffccf2e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1331, 22, 1.6528925619834711, 487.162283996994, 138, 3431, 158.0, 1320.8, 1641.7999999999997, 2189.800000000002, 5.2585208977808335, 750.2109166348133, 3.842041709137816], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 2350.7586206896553, 1698, 3569, 2320.5, 2839.5, 3032.7999999999997, 3569.0, 0.26319849704582376, 316.7175662449062, 1.2941449537360572], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e1be1b4b-d67b-4bf3-b02e-c91ad38fda28", 1, 0, 0.0, 592.0, 592, 592, 592.0, 592.0, 592.0, 592.0, 1.6891891891891893, 0.30517578125, 1.1646167652027029], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 632.2142857142858, 148, 1344, 561.0, 1148.5, 1344.0, 1344.0, 0.07515043506734016, 0.01480362922922493, 0.05056508765761462], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 632.2142857142858, 148, 1344, 561.0, 1148.5, 1344.0, 1344.0, 0.07678638029003312, 0.015125888528114783, 0.05166583595686799], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 185.21052631578948, 142, 597, 148.0, 433.0, 597.0, 597.0, 0.09160246458841567, 0.03175200561185625, 0.05183712659942724], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 161.31578947368422, 141, 430, 146.0, 152.0, 430.0, 430.0, 0.09160246458841567, 0.06807565971853938, 0.04598014335785708], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 227.6315789473684, 143, 841, 148.0, 442.0, 841.0, 841.0, 0.09160423115122412, 1.4410057451522078, 0.05352839761298659], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e0d494c0-1f5b-480e-a9e6-e13b9febd8eb", 3, 0, 0.0, 345.3333333333333, 251, 521, 264.0, 521.0, 521.0, 521.0, 0.050551857780773445, 0.03249997367090741, 0.03241769525655068], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 288.9473684210526, 139, 1763, 145.0, 442.0, 1763.0, 1763.0, 0.09160555611804581, 4.361645815855957, 0.05343971329871607], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 259.93333333333334, 143, 386, 256.0, 361.40000000000003, 386.0, 386.0, 0.07995735607675906, 0.1486186533848614, 0.05168077025586354], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=444254a7-1d2f-4d6c-80db-025ff48a821d", 1, 0, 0.0, 933.0, 933, 933, 933.0, 933.0, 933.0, 933.0, 1.0718113612004287, 0.19363779474812431, 0.7389636923901393], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 23, 0, 0.0, 160.99999999999997, 139, 451, 147.0, 170.80000000000004, 397.5999999999992, 451.0, 0.11487191781164002, 0.0853686811080645, 0.057660318120295866], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 23, 0, 0.0, 195.47826086956522, 138, 442, 147.0, 431.0, 440.2, 442.0, 0.11487478648273382, 0.04574115776303829, 0.06467559734888971], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 1008.4, 689, 1205, 1106.0, 1205.0, 1205.0, 1205.0, 0.059297209473322184, 17.435348437815016, 0.03381793977775406], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1608.2, 1514, 1769, 1573.0, 1769.0, 1769.0, 1769.0, 0.05884222047003166, 52.946333412525156, 0.03350099075588717], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 202.4, 145, 420, 148.0, 420.0, 420.0, 420.0, 0.05960967584258277, 0.10548118420582028, 0.033006529494867605], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 167.07692307692307, 143, 428, 145.0, 316.7999999999999, 428.0, 428.0, 0.0632837448399408, 0.04703020490546382, 0.031765473484110913], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 166.53846153846152, 141, 430, 144.0, 317.9999999999999, 430.0, 430.0, 0.06319791155209209, 0.01691037867702464, 0.03604255893205252], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 252.23076923076923, 138, 433, 146.0, 430.6, 433.0, 433.0, 0.0632877499257586, 0.017058026347177124, 0.03720627485869793], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 256.53846153846155, 140, 442, 150.0, 438.0, 442.0, 442.0, 0.0631985260159163, 0.017033977715227442, 0.03721553826913822], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 145.8, 140, 150, 145.0, 150.0, 150.0, 150.0, 0.05980217440706144, 0.04444282687868531, 0.03358032254302767], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 912.5500000000001, 145, 1845, 850.0, 1795.7000000000003, 1842.95, 1845.0, 0.08905909070668389, 40.07976528754954, 0.04853024669368126], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 23, 0, 0.0, 273.9565217391305, 140, 1491, 148.0, 865.200000000001, 1421.999999999999, 1491.0, 0.11487536023414595, 9.016535418445985, 0.06667570373644595], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 675.25, 141, 1237, 731.0, 1193.2, 1234.8999999999999, 1237.0, 0.08905472858345095, 13.104525065566545, 0.04861483718569247], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 23, 0, 0.0, 248.52173913043475, 140, 1187, 147.0, 881.8000000000011, 1186.2, 1187.0, 0.11487536023414595, 2.965415336859507, 0.06678788670542461], "isController": false}, {"data": ["deleteBooks", 13, 2, 15.384615384615385, 461.0769230769231, 159, 933, 459.0, 834.9999999999999, 933.0, 933.0, 0.0761752969371671, 0.015101157498286057, 0.051683840289700515], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d1055c6b-052b-4124-b7ab-de32719ae075", 1, 0, 0.0, 341.0, 341, 341, 341.0, 341.0, 341.0, 341.0, 2.932551319648094, 0.5298066348973607, 2.021856671554252], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 447.76923076923083, 289, 857, 309.0, 748.9999999999999, 857.0, 857.0, 0.06315124723713295, 0.09787209898958005, 0.1420286351436691], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 696.636363636364, 202, 1484, 615.5, 1256.1, 1449.9499999999996, 1484.0, 0.09318322363126552, 0.057238523109439464, 0.04213264896608978], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 176.29999999999998, 143, 442, 147.0, 403.50000000000057, 441.45, 442.0, 0.08917027063177137, 0.06626814057693166, 0.044759296000713364], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 233.1, 143, 446, 147.0, 441.40000000000003, 445.8, 446.0, 0.08917146334829928, 0.09082601198464467, 0.04711109538225577], "isController": false}, {"data": ["login", 22, 0, 0.0, 3271.4090909090914, 1701, 5046, 3050.5, 4750.0, 5007.9, 5046.0, 0.09578252143133917, 26.175044224586067, 0.18061263806832775], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6c1ef008-c83b-43ba-b6b3-01c1cdffd715", 1, 0, 0.0, 487.0, 487, 487, 487.0, 487.0, 487.0, 487.0, 2.053388090349076, 0.37097343429158114, 1.4157148357289528], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 23, 0, 0.0, 166.60869565217388, 142, 445, 153.0, 168.4, 390.39999999999924, 445.0, 0.12259278408212652, 0.09924747851961219, 0.04357790371669341], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4b3497c1-a60f-4578-ba3b-7dfe970b0c92", 2, 0, 0.0, 297.0, 235, 359, 297.0, 359.0, 359.0, 359.0, 0.013737962110700499, 0.027153940734431455, 0.008539270394004754], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5841434c-5182-4822-a935-105c24e46455", 3, 0, 0.0, 354.3333333333333, 243, 485, 335.0, 485.0, 485.0, 485.0, 0.03721022536993166, 0.031020633845180653, 0.02386202603475435], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dfc479a5-1aae-422c-a1cd-5e3ddffccf2e", 1, 0, 0.0, 629.0, 629, 629, 629.0, 629.0, 629.0, 629.0, 1.589825119236884, 0.28722426470588236, 1.0961098966613672], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 1113.15, 292, 1991, 1227.0, 1947.1000000000001, 1989.25, 1991.0, 0.08899449569044154, 53.30314021249661, 0.1887656685933975], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9ea7ad51-8509-4be8-bc08-b45a1330f8fb", 1, 0, 0.0, 459.0, 459, 459, 459.0, 459.0, 459.0, 459.0, 2.1786492374727673, 0.3936036220043573, 1.502076525054466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 478.89473684210526, 289, 1907, 298.0, 854.0, 1907.0, 1907.0, 0.0915358266407797, 5.898010495907386, 0.2046335721495021], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, 44.44444444444444, 1040.111111111111, 143, 1918, 1660.0, 1918.0, 1918.0, 1918.0, 0.09438711301283666, 62.74444787471683, 0.14603579041341555], "isController": false}, {"data": ["register", 22, 5, 22.727272727272727, 1171.9545454545455, 354, 2166, 1091.5, 2068.7, 2158.2, 2166.0, 0.09868391541891322, 0.031206685610988005, 0.044523407151892486], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/c19d92fe-481b-4707-93a1-7f40bd012244", 1, 0, 0.0, 685.0, 685, 685, 685.0, 685.0, 685.0, 685.0, 1.4598540145985401, 0.46618385036496346, 0.8710652372262773], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 23, 0, 0.0, 487.52173913043475, 283, 1943, 301.0, 1035.800000000001, 1820.5999999999983, 1943.0, 0.11478764286070768, 12.10381399878974, 0.25560623003693167], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 152.3125, 141, 177, 150.0, 167.9, 177.0, 177.0, 0.09171840157755651, 0.07120715747476311, 0.03260302556077204], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ffa6792c-12ef-4784-98bd-1fe5def1b7b0", 1, 0, 0.0, 257.0, 257, 257, 257.0, 257.0, 257.0, 257.0, 3.8910505836575875, 0.7029730058365758, 2.6826969844357977], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 13, 0, 0.0, 563.4615384615386, 293, 1790, 300.0, 1418.7999999999997, 1790.0, 1790.0, 0.07448746891580624, 6.961400092249865, 0.16605803898846017], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e1be1b4b-d67b-4bf3-b02e-c91ad38fda28", 3, 0, 0.0, 498.0, 236, 765, 493.0, 765.0, 765.0, 765.0, 0.017132479755119757, 0.023618506433246148, 0.0109866488012975], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 146.85714285714286, 141, 153, 147.0, 153.0, 153.0, 153.0, 0.052412078737917145, 0.03895077335894038, 0.02630840671024357], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 187.28571428571428, 139, 443, 146.0, 443.0, 443.0, 443.0, 0.052411293885099464, 0.025269730980315815, 0.029261997506719876], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e0d494c0-1f5b-480e-a9e6-e13b9febd8eb", 1, 0, 0.0, 688.0, 688, 688, 688.0, 688.0, 688.0, 688.0, 1.4534883720930232, 0.26259311409883723, 1.0021121002906979], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 305.7142857142857, 140, 1278, 145.0, 1278.0, 1278.0, 1278.0, 0.052411293885099464, 6.749219036624264, 0.030168666095133988], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 324.85714285714283, 144, 1110, 149.0, 1110.0, 1110.0, 1110.0, 0.05241011664994535, 2.2135816371797365, 0.030219170216828135], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=be89862d-9259-453d-9a9d-f5616fd56121", 1, 0, 0.0, 417.0, 417, 417, 417.0, 417.0, 417.0, 417.0, 2.398081534772182, 0.43324715227817745, 1.6533648081534773], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 163.5, 159, 168, 163.5, 168.0, 168.0, 168.0, 0.05929263881889064, 0.01748669621416501, 0.036652578488630634], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 1624.5344827586205, 1114, 2948, 1469.0, 2215.9, 2451.7999999999997, 2948.0, 0.266289576140454, 318.57491029943805, 0.5258178935117167], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, 22.727272727272727, 1171.9545454545455, 354, 2166, 1091.5, 2068.7, 2158.2, 2166.0, 0.09632477210434601, 0.030460656803593788, 0.043459028039265477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 193.5, 143, 427, 146.5, 427.0, 427.0, 427.0, 0.03349634889797012, 0.00902831278890601, 0.01972490076706639], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 146.83333333333331, 140, 155, 145.0, 155.0, 155.0, 155.0, 0.033497844971973466, 0.009028716027602223, 0.01969306901672659], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 254.43750000000003, 141, 1319, 145.5, 700.9000000000005, 1319.0, 1319.0, 0.09026951090850621, 5.099351337751838, 0.0525837531805898], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 259.6875, 140, 1096, 146.0, 641.0000000000005, 1096.0, 1096.0, 0.09026849234692438, 1.6816804149811848, 0.05267131267313215], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 164.93750000000003, 142, 445, 145.0, 239.9000000000002, 445.0, 445.0, 0.09026594604353075, 0.06708240716711612, 0.04530927369763165], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 194.16666666666666, 146, 430, 147.0, 430.0, 430.0, 430.0, 0.03349653589991235, 0.008962940270093735, 0.019103493130418765], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 197.99999999999997, 138, 433, 148.0, 426.0, 433.0, 433.0, 0.0901327204308344, 0.03257848940377205, 0.050930708358683165], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 148.16666666666666, 144, 150, 149.5, 150.0, 150.0, 150.0, 0.03349597490034947, 0.024893004784341748, 0.01681340927615198], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 210.0, 147, 454, 153.0, 454.0, 454.0, 454.0, 0.032674755483913125, 0.025718606367220686, 0.011614854488422246], "isController": false}, {"data": ["deleteAccount", 13, 2, 15.384615384615385, 516.2307692307693, 144, 995, 485.0, 902.9999999999999, 995.0, 995.0, 0.07667083441458869, 0.014876860373563896, 0.052175562572247515], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1554.0454545454547, 999, 3431, 1377.0, 2837.899999999999, 3403.5499999999997, 3431.0, 0.09423698030447111, 0.04877499957165009, 0.04334532980801357], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 344.6666666666667, 293, 580, 298.5, 580.0, 580.0, 580.0, 0.03346813554594896, 0.05186907335099707, 0.07527062125226607], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d1055c6b-052b-4124-b7ab-de32719ae075", 3, 0, 0.0, 348.0, 241, 458, 345.0, 458.0, 458.0, 458.0, 0.10532228619575902, 0.047655591735711274, 0.06754065879090015], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6c1ef008-c83b-43ba-b6b3-01c1cdffd715", 3, 0, 0.0, 995.0, 244, 2265, 476.0, 2265.0, 2265.0, 2265.0, 0.017043905099536405, 0.023496399119966368, 0.010929847996773021], "isController": false}, {"data": ["addBook", 59, 9, 15.254237288135593, 1448.28813559322, 726, 2941, 1173.0, 2467.0, 2531.0, 2941.0, 0.2682757146819568, 88.08353253894545, 0.9742001675018075], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a9dcc17c-66fe-4f41-9dc8-54e9dc0e8d89", 1, 0, 0.0, 378.0, 378, 378, 378.0, 378.0, 378.0, 378.0, 2.6455026455026456, 0.4779472552910053, 1.823950066137566], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0f2a6c31-c4e4-4a8e-bbb6-382b2c18a13a", 1, 0, 0.0, 233.0, 233, 233, 233.0, 233.0, 233.0, 233.0, 4.291845493562231, 1.3705405042918455, 2.5608570278969958], "isController": false}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 273.91379310344826, 140, 638, 150.0, 584.3, 599.05, 638.0, 0.2676536008638751, 0.1989105373607509, 0.12938333244884587], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 956.4137931034481, 682, 1332, 872.0, 1197.0, 1299.6, 1332.0, 0.26757704373500646, 78.67653525212216, 0.13457243898782065], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/444254a7-1d2f-4d6c-80db-025ff48a821d", 3, 0, 0.0, 349.3333333333333, 257, 500, 291.0, 500.0, 500.0, 500.0, 0.0337488187913423, 0.028135001603068893, 0.02164230892543761], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 235.10344827586206, 140, 580, 149.0, 443.1, 445.1, 580.0, 0.26825150891473765, 0.47467942788428186, 0.13045825335892514], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 1348.758620689655, 963, 2361, 1310.0, 1770.8, 1874.75, 2361.0, 0.26705958191362006, 240.30068124654665, 0.13405139170273506], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 13, 0, 0.0, 153.9230769230769, 144, 174, 152.0, 172.8, 174.0, 174.0, 0.074487895716946, 0.05564769553072626, 0.026478119180633145], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e8baf748-dd7e-41e6-89a1-cec78598bb31", 1, 0, 0.0, 724.0, 724, 724, 724.0, 724.0, 724.0, 724.0, 1.3812154696132597, 0.4410717368784531, 0.8241432147790055], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 9, 5.113636363636363, 221.69886363636365, 139, 1596, 152.0, 366.80000000000007, 521.0500000000001, 1112.4399999999937, 0.7417615995077401, 1.628921214961247, 0.3551832303928386], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 192.28571428571428, 146, 438, 152.0, 438.0, 438.0, 438.0, 0.05711488250652741, 0.04423056819109008, 0.020302555890992165], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 168.10526315789474, 144, 461, 152.0, 158.0, 461.0, 461.0, 0.08830719750137109, 0.07166336047230408, 0.0313904491118155], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3b20d40d-de84-4247-9083-27c2290d3857", 2, 0, 0.0, 305.5, 225, 386, 305.5, 386.0, 386.0, 386.0, 0.02028726771078471, 0.028885582346019636, 0.012610201072182099], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 498.5714285714285, 286, 1423, 300.0, 1423.0, 1423.0, 1423.0, 0.052354846188941165, 9.017348035384396, 0.11583363639933285], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a9dcc17c-66fe-4f41-9dc8-54e9dc0e8d89", 3, 0, 0.0, 1269.6666666666667, 312, 2902, 595.0, 2902.0, 2902.0, 2902.0, 0.08274720728175425, 0.03744095641980416, 0.053063801544614535], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 475.4375, 288, 1468, 299.5, 1061.3000000000004, 1468.0, 1468.0, 0.09005510246582127, 6.864420504210075, 0.20109594597256694], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9ea7ad51-8509-4be8-bc08-b45a1330f8fb", 3, 0, 0.0, 526.6666666666666, 315, 689, 576.0, 689.0, 689.0, 689.0, 0.03984539984858748, 0.02561675283234384, 0.02555190029352778], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5841434c-5182-4822-a935-105c24e46455", 1, 0, 0.0, 486.0, 486, 486, 486.0, 486.0, 486.0, 486.0, 2.05761316872428, 0.37173675411522633, 1.418627829218107], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 174.46153846153845, 145, 444, 150.0, 333.5999999999999, 444.0, 444.0, 0.061574604738402657, 0.051051600998929546, 0.02188784777810407], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fe06524e-cdb2-4370-8a52-021d25d5ec17", 1, 0, 0.0, 300.0, 300, 300, 300.0, 300.0, 300.0, 300.0, 3.3333333333333335, 1.064453125, 1.9889322916666667], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/be89862d-9259-453d-9a9d-f5616fd56121", 3, 0, 0.0, 1484.6666666666667, 253, 3206, 995.0, 3206.0, 3206.0, 3206.0, 0.0283259371164196, 0.02361416827967142, 0.01816474483051648], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ffa6792c-12ef-4784-98bd-1fe5def1b7b0", 3, 0, 0.0, 339.6666666666667, 256, 483, 280.0, 483.0, 483.0, 483.0, 0.0858000858000858, 0.037984412984412984, 0.05502153939653939], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 166.34999999999997, 142, 439, 149.5, 181.50000000000003, 426.1999999999998, 439.0, 0.0904649900488511, 0.07023404989144201, 0.03215747693142754], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dfc479a5-1aae-422c-a1cd-5e3ddffccf2e", 3, 0, 0.0, 342.0, 260, 449, 317.0, 449.0, 449.0, 449.0, 0.02734855736359907, 0.02742868009025024, 0.01753797461142258], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 13, 0, 0.0, 190.23076923076923, 142, 429, 149.0, 424.2, 429.0, 429.0, 0.07455068873367053, 0.05540339270148758, 0.03742095118076822], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 13, 0, 0.0, 233.46153846153842, 139, 433, 149.0, 431.8, 433.0, 433.0, 0.07455111625959845, 0.028561500369888228, 0.04203580819144726], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 13, 0, 0.0, 304.3076923076923, 139, 1641, 146.0, 1161.7999999999997, 1641.0, 1641.0, 0.07455197132616487, 5.178701836917563, 0.043335573476702506], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 13, 0, 0.0, 269.84615384615387, 141, 878, 149.0, 702.7999999999998, 878.0, 878.0, 0.07455068873367053, 1.7047309759545357, 0.043407631338242214], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 22.727272727272727, 0.3756574004507889], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 9.090909090909092, 0.15026296018031554], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 9.090909090909092, 0.15026296018031554], "isController": false}, {"data": ["401/Unauthorized", 13, 59.09090909090909, 0.976709241172051], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1331, 22, "401/Unauthorized", 13, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
