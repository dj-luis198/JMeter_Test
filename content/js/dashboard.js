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

    var data = {"OkPercent": 97.55911517925247, "KoPercent": 2.440884820747521};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7668852459016393, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.14545454545454545, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/75ab58fa-9d4a-4a5c-8cbe-c8c103b2be00"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/9a53fca7-a4a6-4bd5-9466-9be8d7e720c7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=acd95f5e-2f71-4a64-aa72-9525ccde8d17"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7ece134a-56e9-45f3-98a5-d35f820b6c92"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5714285714285714, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=af6ac8ac-5b78-48bd-9e21-f922f3afbcb1"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.75, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9dc59430-452f-4d8a-9480-e61ddb847d76"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/315d6fe6-82c4-4666-9d41-938ec9bb1143"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8cd89873-5991-42ef-b46b-0d5c2586e76d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/50ab82d9-e06b-4089-9d60-4b81005c9212"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a180d6f1-6e2d-47b2-9ac3-33547ef548a2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d7a1bb25-9c16-491f-a305-c31643224438"], "isController": false}, {"data": [0.7045454545454546, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3932d62b-aa06-4e37-a541-75379f67dd5e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.23076923076923078, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6fb99958-2588-4c44-96fd-764872f53d39"], "isController": false}, {"data": [0.13636363636363635, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/af6ac8ac-5b78-48bd-9e21-f922f3afbcb1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.41818181818181815, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.13636363636363635, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6f925715-47e4-44b4-8278-acba572c334d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.46153846153846156, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=75ab58fa-9d4a-4a5c-8cbe-c8c103b2be00"], "isController": false}, {"data": [0.22727272727272727, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/acd95f5e-2f71-4a64-aa72-9525ccde8d17"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/8cd89873-5991-42ef-b46b-0d5c2586e76d"], "isController": false}, {"data": [0.275, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5454545454545454, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9114285714285715, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/9dc59430-452f-4d8a-9480-e61ddb847d76"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6fb99958-2588-4c44-96fd-764872f53d39"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/43a98b81-434f-410b-b2ba-183b741ec76f"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d7a1bb25-9c16-491f-a305-c31643224438"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a180d6f1-6e2d-47b2-9ac3-33547ef548a2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3932d62b-aa06-4e37-a541-75379f67dd5e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6f925715-47e4-44b4-8278-acba572c334d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9a53fca7-a4a6-4bd5-9466-9be8d7e720c7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1311, 32, 2.440884820747521, 369.381388253242, 92, 3464, 117.0, 1013.9999999999998, 1296.9999999999993, 1845.7599999999939, 5.2972265321955, 738.1676357477434, 3.8777803431378493], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 1664.0363636363636, 1206, 2183, 1646.0, 2074.0, 2162.4, 2183.0, 0.25393249089305747, 305.5673679652043, 1.2485840738735787], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/75ab58fa-9d4a-4a5c-8cbe-c8c103b2be00", 3, 0, 0.0, 356.0, 201, 662, 205.0, 662.0, 662.0, 662.0, 0.026259125045953468, 0.031037396823521173, 0.01683934776709907], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9a53fca7-a4a6-4bd5-9466-9be8d7e720c7", 3, 0, 0.0, 839.0, 204, 1886, 427.0, 1886.0, 1886.0, 1886.0, 0.050931191959662496, 0.03274384899750437, 0.03266095317725753], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=acd95f5e-2f71-4a64-aa72-9525ccde8d17", 1, 0, 0.0, 453.0, 453, 453, 453.0, 453.0, 453.0, 453.0, 2.207505518763797, 0.3988169150110375, 1.5219715783664458], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7ece134a-56e9-45f3-98a5-d35f820b6c92", 1, 0, 0.0, 233.0, 233, 233, 233.0, 233.0, 233.0, 233.0, 4.291845493562231, 1.3705405042918455, 2.5608570278969958], "isController": false}, {"data": ["deleteBook", 14, 3, 21.428571428571427, 463.9285714285715, 108, 967, 474.5, 809.5, 967.0, 967.0, 0.07952331453174968, 0.016314039344159863, 0.053235578233900786], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, 21.428571428571427, 463.9285714285715, 108, 967, 474.5, 809.5, 967.0, 967.0, 0.0795843423491024, 0.01632655907147811, 0.05327643230498994], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 169.8333333333333, 99, 316, 104.0, 308.8, 316.0, 316.0, 0.08641963454096771, 0.037546030458120085, 0.04847976460251769], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 103.83333333333333, 94, 108, 105.0, 107.1, 108.0, 108.0, 0.08649895480429612, 0.06428291465436459, 0.0434184206732502], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=af6ac8ac-5b78-48bd-9e21-f922f3afbcb1", 1, 0, 0.0, 443.0, 443, 443, 443.0, 443.0, 443.0, 443.0, 2.257336343115124, 0.40781955417607224, 1.5563275959367946], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 218.05555555555557, 92, 893, 103.0, 819.2000000000002, 893.0, 893.0, 0.08641838983335653, 2.844023958298326, 0.05006377857208014], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 216.72222222222223, 99, 1100, 102.5, 975.8000000000002, 1100.0, 1100.0, 0.08650144889926907, 8.668963835786611, 0.05002742216071008], "isController": false}, {"data": ["goToProfile", 14, 3, 21.428571428571427, 250.28571428571425, 102, 680, 213.0, 565.0, 680.0, 680.0, 0.0794817788022096, 0.14324018116168297, 0.05136709546613225], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 103.94117647058823, 99, 114, 103.0, 108.39999999999999, 114.0, 114.0, 0.10116879716251279, 0.07518501429753148, 0.05078199388821443], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 139.94117647058826, 98, 310, 104.0, 309.2, 310.0, 310.0, 0.10105092966855295, 0.02703901829021827, 0.057630608326596604], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 803.8571428571429, 594, 913, 810.0, 913.0, 913.0, 913.0, 0.03622119767977356, 10.65023477480764, 0.02065740180174586], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1145.2857142857142, 907, 1300, 1186.0, 1300.0, 1300.0, 1300.0, 0.036169915930781116, 32.54575393444719, 0.02059283299574745], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 171.0, 98, 383, 103.0, 383.0, 383.0, 383.0, 0.03637365092726829, 0.0643643119923927, 0.020140488355235468], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9dc59430-452f-4d8a-9480-e61ddb847d76", 1, 0, 0.0, 444.0, 444, 444, 444.0, 444.0, 444.0, 444.0, 2.2522522522522523, 0.4069010416666667, 1.5528223536036037], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/315d6fe6-82c4-4666-9d41-938ec9bb1143", 1, 0, 0.0, 607.0, 607, 607, 607.0, 607.0, 607.0, 607.0, 1.6474464579901154, 0.5260888591433278, 0.9829978377265239], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 154.00000000000003, 95, 307, 104.0, 299.8, 307.0, 307.0, 0.11431097156705101, 0.08495180601809162, 0.057378749399867396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 183.93333333333337, 96, 311, 103.0, 309.8, 311.0, 311.0, 0.11430922932717588, 0.05347826314746652, 0.06391195712641838], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 314.9333333333333, 93, 1283, 104.0, 1182.2, 1283.0, 1283.0, 0.11329048435458411, 13.618327544504279, 0.06530429352053957], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 216.73333333333335, 95, 920, 103.0, 732.2000000000002, 920.0, 920.0, 0.11360107845290478, 4.480201698714794, 0.06559426854158935], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8cd89873-5991-42ef-b46b-0d5c2586e76d", 1, 0, 0.0, 421.0, 421, 421, 421.0, 421.0, 421.0, 421.0, 2.375296912114014, 0.42913078978622327, 1.6376558788598576], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 192.0, 103, 306, 114.0, 306.0, 306.0, 306.0, 0.03637194995219687, 0.027030326087521307, 0.020423702365735544], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 789.2142857142857, 101, 1295, 1094.0, 1258.0, 1295.0, 1295.0, 0.07549367470854049, 43.67612931291319, 0.04021133510563722], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 114.23529411764706, 97, 301, 102.0, 150.59999999999985, 301.0, 301.0, 0.10105213101111572, 0.02723670718658979, 0.05940760045770672], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 575.8571428571429, 96, 926, 804.0, 919.5, 926.0, 926.0, 0.07549204637368563, 14.276875084254517, 0.04028419048260987], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 115.8235294117647, 100, 297, 103.0, 152.19999999999987, 297.0, 297.0, 0.10117240968874606, 0.027269126048919835, 0.05957711234600964], "isController": false}, {"data": ["deleteBooks", 14, 3, 21.428571428571427, 510.0714285714286, 105, 1354, 456.5, 1331.0, 1354.0, 1354.0, 0.07918104179627848, 0.016243822818279508, 0.05338202908489339], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 498.8666666666667, 200, 1423, 412.0, 1401.4, 1423.0, 1423.0, 0.11320327534810007, 18.20944699020792, 0.250734936889174], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/50ab82d9-e06b-4089-9d60-4b81005c9212", 1, 0, 0.0, 241.0, 241, 241, 241.0, 241.0, 241.0, 241.0, 4.149377593360996, 1.3250453838174274, 2.4758493257261414], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a180d6f1-6e2d-47b2-9ac3-33547ef548a2", 2, 0, 0.0, 250.0, 238, 262, 250.0, 262.0, 262.0, 262.0, 0.04762018143289126, 0.04203969142122431, 0.029599849103550083], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d7a1bb25-9c16-491f-a305-c31643224438", 1, 0, 0.0, 487.0, 487, 487, 487.0, 487.0, 487.0, 487.0, 2.053388090349076, 0.37097343429158114, 1.4157148357289528], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 592.2727272727275, 134, 1351, 561.0, 1051.3, 1312.7499999999995, 1351.0, 0.09369756130801794, 0.057554459045647745, 0.04236520594298077], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 104.0, 97, 110, 104.0, 109.5, 110.0, 110.0, 0.07549448890231014, 0.056104791069001965, 0.03789469462479239], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3932d62b-aa06-4e37-a541-75379f67dd5e", 1, 0, 0.0, 508.0, 508, 508, 508.0, 508.0, 508.0, 508.0, 1.968503937007874, 0.35563791830708663, 1.357191190944882], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 132.07142857142858, 96, 313, 103.0, 303.5, 313.0, 313.0, 0.07549163930094742, 0.09309020644267219, 0.038978035303125894], "isController": false}, {"data": ["login", 22, 0, 0.0, 3129.0454545454545, 2073, 5053, 2970.0, 4497.3, 4983.549999999999, 5053.0, 0.09656788942098772, 36.889478153435405, 0.1966507677147209], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 134.41176470588235, 104, 312, 109.0, 304.8, 312.0, 312.0, 0.10260000482823552, 0.08306191797129614, 0.036471095466286844], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 894.7857142857142, 203, 1400, 1202.0, 1364.0, 1400.0, 1400.0, 0.0754517674576527, 58.07025599538397, 0.15728240922882902], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 389.5555555555555, 205, 1205, 307.0, 1078.1000000000001, 1205.0, 1205.0, 0.08637360422654836, 11.600417412438759, 0.1918007606875339], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 6, 46.15384615384615, 769.1538461538462, 102, 1530, 1021.0, 1514.4, 1530.0, 1530.0, 0.06713419609382261, 43.25528068549178, 0.10204276771051735], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6fb99958-2588-4c44-96fd-764872f53d39", 3, 0, 0.0, 347.0, 205, 577, 259.0, 577.0, 577.0, 577.0, 0.07118788856722509, 0.03221066572540458, 0.04565108739499786], "isController": false}, {"data": ["register", 22, 7, 31.818181818181817, 1246.6818181818182, 170, 2277, 1212.0, 2145.6, 2263.0499999999997, 2277.0, 0.09211495946941783, 0.028834991751524083, 0.04155967897936625], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/af6ac8ac-5b78-48bd-9e21-f922f3afbcb1", 3, 0, 0.0, 802.3333333333334, 227, 1662, 518.0, 1662.0, 1662.0, 1662.0, 0.047846126856031006, 0.030760449394746495, 0.030682574839316756], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 121.61538461538461, 102, 303, 106.0, 226.99999999999994, 303.0, 303.0, 0.07957202492440657, 0.06177710919424143, 0.02828536823484765], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 257.6470588235294, 204, 414, 209.0, 413.2, 414.0, 414.0, 0.10098609956041345, 0.15650873047107045, 0.22712010477307829], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 13, 0, 0.0, 382.30769230769226, 205, 1451, 210.0, 1114.5999999999997, 1451.0, 1451.0, 0.08412497087981777, 7.86209531035643, 0.18754332638223797], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 16, 0, 0.0, 118.125, 100, 307, 104.0, 175.40000000000015, 307.0, 307.0, 0.08570035940588226, 0.06368942725378554, 0.04301756321740574], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 16, 0, 0.0, 138.375, 98, 307, 103.0, 302.8, 307.0, 307.0, 0.08561460585175831, 0.022908595706427518, 0.048827079899830914], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 16, 0, 0.0, 125.74999999999999, 93, 305, 102.5, 293.1, 305.0, 305.0, 0.08570954107897598, 0.023101399743942746, 0.05038783567338237], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 16, 0, 0.0, 127.50000000000001, 99, 306, 103.0, 305.3, 306.0, 306.0, 0.08570954107897598, 0.023101399743942746, 0.05047153639709231], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 108.0, 105, 114, 105.0, 114.0, 114.0, 114.0, 0.305935141749949, 0.09022696563328575, 0.18911811008566184], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1132.1454545454546, 745, 1732, 1017.0, 1604.8, 1679.7999999999997, 1732.0, 0.2648215824774781, 316.818679521347, 0.522919179462364], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, 31.818181818181817, 1246.6818181818182, 170, 2277, 1212.0, 2145.6, 2263.0499999999997, 2277.0, 0.09667100221464478, 0.030261181978767534, 0.04361523732731044], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 145.88888888888889, 96, 305, 102.0, 305.0, 305.0, 305.0, 0.05090843269905197, 0.01372141350091635, 0.029978305583523768], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 101.33333333333333, 95, 104, 102.0, 104.0, 104.0, 104.0, 0.05090728087243766, 0.013721103047649215, 0.029927913169147925], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6f925715-47e4-44b4-8278-acba572c334d", 1, 0, 0.0, 460.0, 460, 460, 460.0, 460.0, 460.0, 460.0, 2.1739130434782608, 0.39274796195652173, 1.4988111413043477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 149.61538461538464, 95, 307, 103.0, 306.6, 307.0, 307.0, 0.07595853832400407, 0.020473199782641723, 0.04465531256938521], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 134.6923076923077, 100, 304, 104.0, 301.6, 304.0, 304.0, 0.07586722069190906, 0.020448586827116113, 0.04467571687228629], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 104.61538461538461, 97, 111, 104.0, 111.0, 111.0, 111.0, 0.07595498790562885, 0.0564470173790855, 0.03812584353856761], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 166.0, 101, 467, 103.0, 467.0, 467.0, 467.0, 0.05080296915130818, 0.013593763229939883, 0.028973568344105444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 147.07692307692307, 99, 299, 105.0, 298.2, 299.0, 299.0, 0.07588094862859777, 0.020304081957261515, 0.04327585351474717], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 125.33333333333333, 98, 306, 103.0, 306.0, 306.0, 306.0, 0.050908720663849716, 0.037833531665224254, 0.02555379142697144], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 131.55555555555554, 104, 315, 108.0, 315.0, 315.0, 315.0, 0.0507119392809047, 0.039915842832430846, 0.018026509666259093], "isController": false}, {"data": ["deleteAccount", 13, 3, 23.076923076923077, 538.5384615384614, 103, 1307, 574.0, 1139.7999999999997, 1307.0, 1307.0, 0.07643596723836851, 0.01534231553943214, 0.0520099903279103], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=75ab58fa-9d4a-4a5c-8cbe-c8c103b2be00", 1, 0, 0.0, 1308.0, 1308, 1308, 1308.0, 1308.0, 1308.0, 1308.0, 0.764525993883792, 0.13812237194189603, 0.5271048356269112], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1718.7727272727273, 1072, 3464, 1580.0, 2827.7999999999993, 3427.2499999999995, 3464.0, 0.09517629245078954, 0.0492611669911313, 0.04377737670343933], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 315.8888888888889, 203, 613, 210.0, 613.0, 613.0, 613.0, 0.05077430820005077, 0.07869026085300838, 0.11419260916476263], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/acd95f5e-2f71-4a64-aa72-9525ccde8d17", 3, 0, 0.0, 804.6666666666666, 283, 1307, 824.0, 1307.0, 1307.0, 1307.0, 0.0375037503750375, 0.03126533356460646, 0.024050256588158816], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8cd89873-5991-42ef-b46b-0d5c2586e76d", 3, 0, 0.0, 431.3333333333333, 217, 574, 503.0, 574.0, 574.0, 574.0, 0.020940508016724486, 0.02475097155231986, 0.013428646091454178], "isController": false}, {"data": ["addBook", 60, 13, 21.666666666666668, 1057.8833333333332, 518, 2499, 864.5, 1894.6, 1952.5, 2499.0, 0.2893253415244552, 81.88067273566755, 1.0531225814209733], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 179.20000000000007, 96, 431, 105.0, 413.6, 424.4, 431.0, 0.26583532709828656, 0.19755926164237897, 0.12850438175161313], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 652.4909090909091, 475, 921, 606.0, 820.8, 900.4, 921.0, 0.2656247736152498, 78.10250301544487, 0.1335905843865758], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 171.50909090909087, 95, 353, 107.0, 308.4, 311.0, 353.0, 0.26625099239006256, 0.47113945137772784, 0.12948534590844837], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 948.4545454545454, 639, 1327, 907.0, 1221.4, 1285.3999999999999, 1327.0, 0.2653735736170418, 238.7836080175991, 0.1332050945694917], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 13, 0, 0.0, 136.15384615384613, 103, 312, 108.0, 292.4, 312.0, 312.0, 0.08527665715503951, 0.06370765890977075, 0.030313186723080456], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 13, 7.428571428571429, 175.28000000000006, 96, 944, 110.0, 335.0, 412.2, 770.7200000000021, 0.7253344828157899, 1.5278086116890761, 0.3493707917647595], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 16, 0, 0.0, 150.5625, 104, 364, 109.5, 324.1, 364.0, 364.0, 0.08854258898530193, 0.06856862604037542, 0.03147412342836904], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 109.38888888888889, 102, 131, 106.5, 123.80000000000001, 131.0, 131.0, 0.08636490130411001, 0.07008714158565958, 0.030700023510445353], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9dc59430-452f-4d8a-9480-e61ddb847d76", 3, 0, 0.0, 451.6666666666667, 209, 645, 501.0, 645.0, 645.0, 645.0, 0.04368338284116722, 0.02808420609091968, 0.0280131068349933], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6fb99958-2588-4c44-96fd-764872f53d39", 1, 0, 0.0, 464.0, 464, 464, 464.0, 464.0, 464.0, 464.0, 2.155172413793103, 0.3893622036637931, 1.4858903556034482], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/43a98b81-434f-410b-b2ba-183b741ec76f", 1, 0, 0.0, 362.0, 362, 362, 362.0, 362.0, 362.0, 362.0, 2.7624309392265194, 0.8821434737569062, 1.648286429558011], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 16, 0, 0.0, 283.9375, 204, 612, 210.5, 472.0000000000001, 612.0, 612.0, 0.08555920964680089, 0.13260006416940723, 0.1924246677896313], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d7a1bb25-9c16-491f-a305-c31643224438", 3, 0, 0.0, 608.0, 479, 680, 665.0, 680.0, 680.0, 680.0, 0.018423444447173844, 0.025398205479746493, 0.01181451352894937], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a180d6f1-6e2d-47b2-9ac3-33547ef548a2", 1, 0, 0.0, 1354.0, 1354, 1354, 1354.0, 1354.0, 1354.0, 1354.0, 0.7385524372230429, 0.13342988367799113, 0.5091972858197932], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 302.38461538461536, 208, 418, 220.0, 415.6, 418.0, 418.0, 0.07581987530546662, 0.11750599815407765, 0.17052067659032188], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3932d62b-aa06-4e37-a541-75379f67dd5e", 3, 0, 0.0, 563.3333333333334, 351, 889, 450.0, 889.0, 889.0, 889.0, 0.022813688212927757, 0.02709868108365019, 0.014629871673003803], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6f925715-47e4-44b4-8278-acba572c334d", 3, 0, 0.0, 316.3333333333333, 239, 426, 284.0, 426.0, 426.0, 426.0, 0.020899369535685674, 0.024702347260440977, 0.013402264969173431], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9a53fca7-a4a6-4bd5-9466-9be8d7e720c7", 1, 0, 0.0, 475.0, 475, 475, 475.0, 475.0, 475.0, 475.0, 2.1052631578947367, 0.38034539473684215, 1.451480263157895], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 108.06666666666666, 101, 118, 106.0, 116.2, 118.0, 118.0, 0.1131639897096212, 0.09382444068698087, 0.04022626196709191], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 110.35714285714286, 103, 134, 107.5, 127.5, 134.0, 134.0, 0.07206910397512586, 0.055952087558813535, 0.025618314303658022], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 13, 0, 0.0, 135.46153846153848, 101, 310, 104.0, 305.6, 310.0, 310.0, 0.08418107997850144, 0.06256035338246055, 0.04225495616108373], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 13, 0, 0.0, 146.84615384615384, 98, 305, 101.0, 303.8, 305.0, 305.0, 0.08418380562606849, 0.03225190870590064, 0.047467220930684347], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 13, 0, 0.0, 213.07692307692312, 99, 1151, 102.0, 813.3999999999996, 1151.0, 1151.0, 0.08418271534586144, 5.847694901198633, 0.04893373282348828], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 13, 0, 0.0, 203.92307692307693, 99, 814, 104.0, 611.9999999999998, 814.0, 814.0, 0.08418271534586144, 1.9249839931423467, 0.04901594250644322], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 21.875, 0.5339435545385202], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 9.375, 0.2288329519450801], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 9.375, 0.2288329519450801], "isController": false}, {"data": ["401/Unauthorized", 19, 59.375, 1.4492753623188406], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1311, 32, "401/Unauthorized", 19, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
