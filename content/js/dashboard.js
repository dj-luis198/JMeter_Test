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

    var data = {"OkPercent": 98.77955758962624, "KoPercent": 1.2204424103737606};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7900065316786414, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.12280701754385964, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2f0c1206-29e0-45bf-bdfe-de8a164a87c3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ffcf0244-61be-4081-aa84-841715bf5244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5cfc8ebe-381d-4737-9496-8f3c7874dcb1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=91594f7c-bba1-4b03-a4d4-a81fe7d21d1e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3025f81b-08c7-47b1-bd14-0f83720872d7"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1a963389-05b3-4203-943b-a21a1fe4f43a"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f56b8679-07c1-4804-b78c-2006d0b7f5a5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.022727272727272728, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f56b8679-07c1-4804-b78c-2006d0b7f5a5"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/87b1c068-61c5-4a54-a356-043f0a0b5f2e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fc5318fa-b56b-47b6-b69c-263b53d2daa5"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/101ae2b5-f4c0-4d66-a257-a97e96d9fa75"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b6b0152f-0435-4c93-8818-8e1d03a57df7"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e82bde2a-788f-4e40-8ff5-8d8d41de61ee"], "isController": false}, {"data": [0.6944444444444444, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a21527fe-ccbe-4c03-9440-3d75dcdc993b"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3888888888888889, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/13cf0116-eaa9-40f1-90cf-d003b1eb4af1"], "isController": false}, {"data": [0.32, 500, 1500, "register"], "isController": true}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.42105263157894735, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.32, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2f0c1206-29e0-45bf-bdfe-de8a164a87c3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1a963389-05b3-4203-943b-a21a1fe4f43a"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ffcf0244-61be-4081-aa84-841715bf5244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.6, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.3409090909090909, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.32142857142857145, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a652541f-bb21-4761-baee-808b87961f43"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5877192982456141, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3025f81b-08c7-47b1-bd14-0f83720872d7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9733727810650887, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fc5318fa-b56b-47b6-b69c-263b53d2daa5"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a652541f-bb21-4761-baee-808b87961f43"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b6b0152f-0435-4c93-8818-8e1d03a57df7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=101ae2b5-f4c0-4d66-a257-a97e96d9fa75"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=87b1c068-61c5-4a54-a356-043f0a0b5f2e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/91594f7c-bba1-4b03-a4d4-a81fe7d21d1e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e82bde2a-788f-4e40-8ff5-8d8d41de61ee"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a21527fe-ccbe-4c03-9440-3d75dcdc993b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5cfc8ebe-381d-4737-9496-8f3c7874dcb1"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1311, 16, 1.2204424103737606, 361.2234935163998, 97, 2671, 115.0, 1009.8, 1196.3999999999992, 1592.8399999999979, 5.2213809776050155, 756.1694263886344, 3.819356889703803], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1666.0526315789475, 1195, 2227, 1639.0, 2003.2, 2074.8999999999996, 2227.0, 0.2460980506443883, 296.13954764641755, 1.2100621923774366], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2f0c1206-29e0-45bf-bdfe-de8a164a87c3", 1, 0, 0.0, 1052.0, 1052, 1052, 1052.0, 1052.0, 1052.0, 1052.0, 0.9505703422053232, 0.17173389971482889, 0.6553736929657794], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ffcf0244-61be-4081-aa84-841715bf5244", 3, 0, 0.0, 610.6666666666666, 183, 1148, 501.0, 1148.0, 1148.0, 1148.0, 0.04287551807917679, 0.027564826890095755, 0.027495042518222094], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5cfc8ebe-381d-4737-9496-8f3c7874dcb1", 1, 0, 0.0, 1186.0, 1186, 1186, 1186.0, 1186.0, 1186.0, 1186.0, 0.8431703204047217, 0.15233057546374368, 0.5813264123102867], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=91594f7c-bba1-4b03-a4d4-a81fe7d21d1e", 1, 0, 0.0, 418.0, 418, 418, 418.0, 418.0, 418.0, 418.0, 2.3923444976076556, 0.4322106758373206, 1.6494093899521531], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3025f81b-08c7-47b1-bd14-0f83720872d7", 1, 0, 0.0, 404.0, 404, 404, 404.0, 404.0, 404.0, 404.0, 2.4752475247524752, 0.44718827351485146, 1.7065671410891088], "isController": false}, {"data": ["deleteBook", 15, 1, 6.666666666666667, 580.0666666666667, 104, 1366, 501.0, 1075.0000000000002, 1366.0, 1366.0, 0.0915147521780511, 0.017230511933523686, 0.061909491528784444], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 1, 6.666666666666667, 580.0666666666667, 104, 1366, 501.0, 1075.0000000000002, 1366.0, 1366.0, 0.08957255974489735, 0.016864833514468956, 0.060595603405548724], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 122.31578947368419, 98, 303, 102.0, 296.0, 303.0, 303.0, 0.10382059800664452, 0.044194191647359674, 0.05829236290216821], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 102.26315789473685, 98, 104, 103.0, 104.0, 104.0, 104.0, 0.10381662705242739, 0.07715278631532935, 0.052111080375925475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 206.15789473684208, 98, 800, 103.0, 790.0, 800.0, 800.0, 0.1038194634172996, 3.238339093492159, 0.06019671910004918], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 265.84210526315786, 99, 1211, 104.0, 1104.0, 1211.0, 1211.0, 0.10381719431300337, 9.858183236664955, 0.06009401944659971], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1a963389-05b3-4203-943b-a21a1fe4f43a", 1, 0, 0.0, 315.0, 315, 315, 315.0, 315.0, 315.0, 315.0, 3.1746031746031744, 0.5735367063492064, 2.1887400793650795], "isController": false}, {"data": ["goToProfile", 15, 1, 6.666666666666667, 224.40000000000003, 101, 411, 207.0, 341.40000000000003, 411.0, 411.0, 0.09185660571470564, 0.1977189517017967, 0.05937788008732501], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f56b8679-07c1-4804-b78c-2006d0b7f5a5", 1, 0, 0.0, 741.0, 741, 741, 741.0, 741.0, 741.0, 741.0, 1.3495276653171389, 0.24381115047233468, 0.9304360661268556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 114.1111111111111, 98, 309, 102.0, 130.8000000000003, 309.0, 309.0, 0.1338498947791105, 0.09947243156924128, 0.06718637296529568], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 134.8888888888889, 97, 310, 101.5, 306.4, 310.0, 310.0, 0.1338548715736871, 0.035816635557803, 0.07633910644436843], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 669.5714285714286, 498, 809, 678.0, 809.0, 809.0, 809.0, 0.04493112700103983, 13.211243192131917, 0.02562478336778053], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1030.857142857143, 784, 1204, 1066.0, 1204.0, 1204.0, 1204.0, 0.044847646139258346, 40.353990829857636, 0.025533376659362908], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 184.57142857142856, 100, 295, 104.0, 295.0, 295.0, 295.0, 0.045136246985543506, 0.07986999954863752, 0.02499243363359684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 102.33333333333333, 99, 108, 102.0, 105.6, 108.0, 108.0, 0.0835812911637859, 0.06211461189027448, 0.04195389029119722], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 167.0, 98, 305, 103.0, 302.0, 305.0, 305.0, 0.08358222261846386, 0.030733879775330986, 0.04720001295524451], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 202.26666666666665, 98, 1212, 102.0, 667.8000000000003, 1212.0, 1212.0, 0.08348639171814995, 5.029082180177548, 0.04860255955362609], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 194.46666666666667, 99, 600, 102.0, 479.4000000000001, 600.0, 600.0, 0.08344273603168599, 1.6566533934770031, 0.04865863194243564], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 103.85714285714286, 99, 112, 103.0, 112.0, 112.0, 112.0, 0.045135955947306995, 0.033543420386621704, 0.025344897138380396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 688.8333333333333, 100, 1213, 946.0, 1204.9, 1213.0, 1213.0, 0.08075587498990552, 40.37871736397121, 0.04362008959415686], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 134.11111111111111, 98, 306, 101.0, 301.5, 306.0, 306.0, 0.1338498947791105, 0.03607672945218212, 0.0786890982978755], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 466.2222222222223, 99, 907, 590.0, 905.2, 907.0, 907.0, 0.08082876426290903, 13.213205090640477, 0.043738394897908775], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 134.27777777777777, 99, 302, 102.5, 297.5, 302.0, 302.0, 0.1338488994646044, 0.03607646118381916, 0.07881922497769185], "isController": false}, {"data": ["deleteBooks", 15, 1, 6.666666666666667, 561.1999999999999, 103, 1186, 428.0, 1105.6000000000001, 1186.0, 1186.0, 0.08940971704804879, 0.016834173287952937, 0.061218879830359965], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 366.33333333333337, 202, 1314, 216.0, 825.6000000000004, 1314.0, 1314.0, 0.08339588024351598, 6.771995229060684, 0.18613678140549855], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 576.7727272727273, 133, 1844, 413.0, 1198.9999999999998, 1766.599999999999, 1844.0, 0.09389631286251446, 0.05767654374074375, 0.04245507114779706], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 113.44444444444443, 99, 297, 102.0, 127.80000000000027, 297.0, 297.0, 0.08082912722504625, 0.06006930255689472, 0.040572433001634545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 184.0, 98, 399, 102.5, 316.20000000000016, 399.0, 399.0, 0.08082912722504625, 0.08907341754530922, 0.04232653732509475], "isController": false}, {"data": ["login", 22, 0, 0.0, 2538.363636363636, 1466, 5238, 2356.5, 3569.2, 5012.249999999996, 5238.0, 0.09346906174056387, 35.705708510092535, 0.1903403176673521], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f56b8679-07c1-4804-b78c-2006d0b7f5a5", 3, 0, 0.0, 361.3333333333333, 197, 592, 295.0, 592.0, 592.0, 592.0, 0.016340047277203455, 0.022526074290024945, 0.010478480838571225], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/87b1c068-61c5-4a54-a356-043f0a0b5f2e", 3, 0, 0.0, 625.6666666666667, 179, 1400, 298.0, 1400.0, 1400.0, 1400.0, 0.01801704412374106, 0.024837949825534958, 0.011553898738206345], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 108.72222222222224, 101, 119, 106.5, 118.1, 119.0, 119.0, 0.13670124701915337, 0.11066927126843568, 0.04859302140133967], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fc5318fa-b56b-47b6-b69c-263b53d2daa5", 3, 0, 0.0, 435.0, 214, 823, 268.0, 823.0, 823.0, 823.0, 0.08098477486232589, 0.036643501646690425, 0.05193359585897852], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/101ae2b5-f4c0-4d66-a257-a97e96d9fa75", 3, 0, 0.0, 430.0, 184, 897, 209.0, 897.0, 897.0, 897.0, 0.024064685875633707, 0.024291859017037797, 0.015432106502278123], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b6b0152f-0435-4c93-8818-8e1d03a57df7", 3, 0, 0.0, 278.3333333333333, 202, 426, 207.0, 426.0, 426.0, 426.0, 0.04285102128267391, 0.02715850860591344, 0.027479333309527208], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e82bde2a-788f-4e40-8ff5-8d8d41de61ee", 1, 0, 0.0, 515.0, 515, 515, 515.0, 515.0, 515.0, 515.0, 1.941747572815534, 0.3508040048543689, 1.338743932038835], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 803.8888888888888, 201, 1324, 1049.0, 1308.7, 1324.0, 1324.0, 0.08071929863898294, 53.70467947711832, 0.1700658226641853], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a21527fe-ccbe-4c03-9440-3d75dcdc993b", 3, 0, 0.0, 299.3333333333333, 175, 514, 209.0, 514.0, 514.0, 514.0, 0.03224142378127418, 0.032335881077508385, 0.02067565262015304], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 401.42105263157885, 205, 1315, 397.0, 1207.0, 1315.0, 1315.0, 0.10375766578017573, 13.2102184491369, 0.23055896200012013], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 2, 22.22222222222222, 908.3333333333334, 101, 1316, 1116.0, 1316.0, 1316.0, 1316.0, 0.057623602627636286, 53.62176347431908, 0.10954486957857938], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/13cf0116-eaa9-40f1-90cf-d003b1eb4af1", 1, 0, 0.0, 195.0, 195, 195, 195.0, 195.0, 195.0, 195.0, 5.128205128205129, 1.6376201923076923, 3.059895833333333], "isController": false}, {"data": ["register", 25, 8, 32.0, 923.5600000000002, 133, 2671, 919.0, 1558.4000000000005, 2392.2999999999993, 2671.0, 0.10497497396620646, 0.03285388638348618, 0.047361755832409556], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 295.66666666666674, 198, 607, 208.5, 432.40000000000026, 607.0, 607.0, 0.133746461291545, 0.20728089264617375, 0.3007989261273712], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 106.86666666666666, 102, 117, 105.0, 112.8, 117.0, 117.0, 0.09555905230902523, 0.0741889126813233, 0.033968256875473814], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 409.74999999999994, 202, 1282, 398.0, 806.7000000000005, 1282.0, 1282.0, 0.07331378299120235, 5.588318945026118, 0.1637120400705645], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 6, 0, 0.0, 103.16666666666666, 100, 109, 102.0, 109.0, 109.0, 109.0, 0.043984400199395944, 0.0326876255388089, 0.02207810713133742], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 6, 0, 0.0, 135.66666666666669, 101, 302, 103.0, 302.0, 302.0, 302.0, 0.04391936404760859, 0.011751861083051518, 0.025047762308401774], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 6, 0, 0.0, 136.0, 99, 305, 103.0, 305.0, 305.0, 305.0, 0.04391839961351809, 0.011837381145831046, 0.025819215397790907], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 6, 0, 0.0, 101.16666666666667, 99, 104, 101.0, 104.0, 104.0, 104.0, 0.04398407776384949, 0.011855083459787556, 0.025900780167579334], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 103.0, 103, 103, 103.0, 103.0, 103.0, 103.0, 9.70873786407767, 2.8633191747572817, 6.001592839805825], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1139.7719298245615, 785, 1812, 1076.0, 1560.2, 1615.6, 1812.0, 0.25105155365676407, 300.34493781519086, 0.4957287514589619], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 8, 32.0, 923.5600000000002, 133, 2671, 919.0, 1558.4000000000005, 2392.2999999999993, 2671.0, 0.1042205139321983, 0.03261776396971769, 0.04702136468425353], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2f0c1206-29e0-45bf-bdfe-de8a164a87c3", 3, 0, 0.0, 588.6666666666667, 286, 1142, 338.0, 1142.0, 1142.0, 1142.0, 0.01786448005430802, 0.02462762793945132, 0.011456063055659764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 134.16666666666666, 98, 300, 102.5, 300.0, 300.0, 300.0, 0.044123486932093954, 0.011892658587165948, 0.02598287365239517], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 202.5, 102, 304, 202.5, 304.0, 304.0, 304.0, 0.04412381141483001, 0.011892746045403402, 0.025939975070046552], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1a963389-05b3-4203-943b-a21a1fe4f43a", 3, 0, 0.0, 286.6666666666667, 183, 411, 266.0, 411.0, 411.0, 411.0, 0.1281613123718387, 0.06024249188311688, 0.0821867790926179], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 226.66666666666666, 97, 876, 102.0, 600.0000000000002, 876.0, 876.0, 0.09129974314338929, 5.499745549517937, 0.05315119161381426], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 207.86666666666667, 97, 900, 103.0, 543.0000000000002, 900.0, 900.0, 0.09141269173812093, 1.8148871091345655, 0.053306216139215434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 115.53333333333332, 99, 306, 101.0, 186.60000000000008, 306.0, 306.0, 0.09129696468024759, 0.06784862316569182, 0.04582679672426491], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 100.16666666666666, 97, 103, 100.5, 103.0, 103.0, 103.0, 0.044125433900100014, 0.0118070008678002, 0.02516528652115079], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ffcf0244-61be-4081-aa84-841715bf5244", 1, 0, 0.0, 898.0, 898, 898, 898.0, 898.0, 898.0, 898.0, 1.1135857461024499, 0.20118492483296213, 0.7677651726057906], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 140.53333333333333, 98, 304, 100.0, 303.4, 304.0, 304.0, 0.09141157758100589, 0.03361279883968238, 0.05162135572510711], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 102.33333333333333, 100, 108, 101.0, 108.0, 108.0, 108.0, 0.04412186458999757, 0.03278978413377749, 0.022147107811776128], "isController": false}, {"data": ["deleteAccount", 15, 1, 6.666666666666667, 650.7333333333333, 102, 1400, 514.0, 1245.2, 1400.0, 1400.0, 0.09259430730198706, 0.017264980215683005, 0.06301958909732895], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 106.5, 102, 114, 105.5, 114.0, 114.0, 114.0, 0.042385153893429596, 0.03336175199033618, 0.015066597673055052], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1385.8636363636363, 905, 2137, 1302.0, 2104.6, 2133.85, 2137.0, 0.09319072328709097, 0.048233479826326385, 0.04286409244943345], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 305.66666666666663, 204, 404, 307.5, 404.0, 404.0, 404.0, 0.044088146901705476, 0.06832801673145175, 0.09915527569787862], "isController": false}, {"data": ["addBook", 56, 4, 7.142857142857143, 1051.9107142857144, 524, 1954, 833.0, 1723.1000000000001, 1829.6, 1954.0, 0.2797887594865876, 90.70601890884882, 1.0175569398229336], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a652541f-bb21-4761-baee-808b87961f43", 3, 0, 0.0, 501.33333333333337, 185, 908, 411.0, 908.0, 908.0, 908.0, 0.02012990498684846, 0.02379286621329647, 0.012908825789092275], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 164.45614035087715, 98, 417, 104.0, 410.2, 412.0, 417.0, 0.2520451028078709, 0.18731086253592746, 0.12183820887685165], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 655.4912280701757, 488, 927, 603.0, 813.6, 901.1999999999999, 927.0, 0.2519860479303988, 74.09226481578493, 0.1267312643399955], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3025f81b-08c7-47b1-bd14-0f83720872d7", 3, 0, 0.0, 326.0, 237, 434, 307.0, 434.0, 434.0, 434.0, 0.04197506681031467, 0.034992886100656206, 0.02691760469281247], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 137.21052631578948, 98, 421, 104.0, 301.4, 306.29999999999995, 421.0, 0.2524145443917474, 0.44665542425570925, 0.12275629209676778], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 966.0526315789474, 677, 1373, 972.0, 1200.6, 1223.6999999999991, 1373.0, 0.25153791161752115, 226.3342550299308, 0.12626024079238857], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 106.24999999999999, 100, 125, 104.0, 120.80000000000001, 125.0, 125.0, 0.0781597291765384, 0.058390813300831915, 0.027783341230722635], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 4, 2.366863905325444, 162.55029585798817, 100, 1007, 108.0, 301.0, 335.5, 639.5000000000059, 0.7247246903838896, 1.5737224784190709, 0.3469721637641943], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 6, 0, 0.0, 173.83333333333331, 104, 310, 110.5, 310.0, 310.0, 310.0, 0.04462293618920125, 0.034556629294957605, 0.015862059348505132], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 116.15789473684211, 102, 309, 105.0, 113.0, 309.0, 309.0, 0.10049613354349367, 0.08155496774867503, 0.03572323497053876], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fc5318fa-b56b-47b6-b69c-263b53d2daa5", 1, 0, 0.0, 267.0, 267, 267, 267.0, 267.0, 267.0, 267.0, 3.745318352059925, 0.6766444288389513, 2.5822214419475653], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a652541f-bb21-4761-baee-808b87961f43", 1, 0, 0.0, 821.0, 821, 821, 821.0, 821.0, 821.0, 821.0, 1.2180267965895248, 0.22005366930572473, 0.8397723812423874], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 6, 0, 0.0, 240.83333333333334, 204, 411, 206.0, 411.0, 411.0, 411.0, 0.043885955031524745, 0.06801465882327126, 0.0987005414429702], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 399.0666666666667, 202, 1005, 403.0, 768.0000000000001, 1005.0, 1005.0, 0.09112945850875755, 7.399984944654042, 0.20339786627967024], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b6b0152f-0435-4c93-8818-8e1d03a57df7", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 0.4221122955607477, 1.6108717873831777], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=101ae2b5-f4c0-4d66-a257-a97e96d9fa75", 1, 0, 0.0, 403.0, 403, 403, 403.0, 403.0, 403.0, 403.0, 2.4813895781637716, 0.44829792183622824, 1.710801799007444], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=87b1c068-61c5-4a54-a356-043f0a0b5f2e", 1, 0, 0.0, 467.0, 467, 467, 467.0, 467.0, 467.0, 467.0, 2.1413276231263385, 0.3868609475374732, 1.476345021413276], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 106.33333333333334, 101, 126, 105.0, 115.2, 126.0, 126.0, 0.07961825699711782, 0.06601162127983694, 0.028301802291944223], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/91594f7c-bba1-4b03-a4d4-a81fe7d21d1e", 3, 0, 0.0, 300.6666666666667, 191, 483, 228.0, 483.0, 483.0, 483.0, 0.04897079708134049, 0.03148350398295816, 0.031403798909583586], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 108.6111111111111, 102, 121, 107.5, 120.1, 121.0, 121.0, 0.08284279658871774, 0.06431642899221739, 0.029448025349895757], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e82bde2a-788f-4e40-8ff5-8d8d41de61ee", 3, 0, 0.0, 313.0, 202, 507, 230.0, 507.0, 507.0, 507.0, 0.046985857256965656, 0.02922850690692102, 0.03013090455606196], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a21527fe-ccbe-4c03-9440-3d75dcdc993b", 1, 0, 0.0, 400.0, 400, 400, 400.0, 400.0, 400.0, 400.0, 2.5, 0.45166015625, 1.7236328125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 141.125, 99, 306, 102.5, 305.3, 306.0, 306.0, 0.07341335388907243, 0.05455816631795324, 0.03685006240135081], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 175.4375, 100, 305, 103.0, 302.9, 305.0, 305.0, 0.07334806406953397, 0.026511672083726814, 0.04144631208225985], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 228.62499999999994, 97, 1180, 103.0, 561.2000000000006, 1180.0, 1180.0, 0.07341436443808187, 4.147199134456114, 0.042765301159488116], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 194.43750000000003, 98, 800, 102.5, 451.4000000000003, 800.0, 800.0, 0.0734130170455849, 1.3676669429213792, 0.04283620867650095], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5cfc8ebe-381d-4737-9496-8f3c7874dcb1", 3, 0, 0.0, 451.0, 284, 621, 448.0, 621.0, 621.0, 621.0, 0.01796740712347801, 0.024769521213518678, 0.01152206771915745], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 50.0, 0.6102212051868803], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 6.25, 0.07627765064836003], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 6.25, 0.07627765064836003], "isController": false}, {"data": ["401/Unauthorized", 6, 37.5, 0.4576659038901602], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1311, 16, "406/Not Acceptable", 8, "401/Unauthorized", 6, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
