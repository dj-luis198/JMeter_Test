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

    var data = {"OkPercent": 98.75091844232182, "KoPercent": 1.2490815576781777};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7605945604048071, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/668f437e-14c9-4786-8f13-203e356bfe75"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6071428571428571, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ca318338-52bf-4d2a-95fa-3c1a19d44d51"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4fcbcb76-1283-4a08-ae06-ad63ffd0db5a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=52c8d398-710c-468e-9187-2ce71c9a2cc4"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7380952380952381, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.047619047619047616, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/23a7d9ba-bdf2-4082-ae03-ea0a881bfc7f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=128a508b-7df7-43bf-8717-f1fd72feae7c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=035b8b06-57a8-4784-93b3-dbb7a24b19a0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c8e2bf6f-bfcb-4629-91d5-01d69d7402fa"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b9255b07-70a5-4ea6-9ebf-22bdbd73fe60"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cfe71c68-0327-4b44-a14d-c6c6aa8a7086"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4fcbcb76-1283-4a08-ae06-ad63ffd0db5a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9eea0c2a-c6ea-4a3c-b989-c3eaedd2478b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dc6f45d4-deb8-470a-a4ad-bc470cdd59fa"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/44581119-eb7d-4e71-bf0a-015bb5d12cc5"], "isController": false}, {"data": [0.34782608695652173, 500, 1500, "register"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/eb94552c-f3e9-4e8e-aa08-95c502ec2d7e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.2966101694915254, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=668f437e-14c9-4786-8f13-203e356bfe75"], "isController": false}, {"data": [0.34782608695652173, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cfe71c68-0327-4b44-a14d-c6c6aa8a7086"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/dc6f45d4-deb8-470a-a4ad-bc470cdd59fa"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ca318338-52bf-4d2a-95fa-3c1a19d44d51"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.27419354838709675, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=59461957-6ad5-4487-a5ed-692f2ef50bb4"], "isController": false}, {"data": [0.9152542372881356, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3db58afd-3240-4786-901e-cd183d23b77d"], "isController": false}, {"data": [0.9830508474576272, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.423728813559322, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9344262295081968, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/52c8d398-710c-468e-9187-2ce71c9a2cc4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f8880495-23a7-4c69-94f8-fe0773dea0b4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/128a508b-7df7-43bf-8717-f1fd72feae7c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/59461957-6ad5-4487-a5ed-692f2ef50bb4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b9255b07-70a5-4ea6-9ebf-22bdbd73fe60"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.6578947368421053, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/035b8b06-57a8-4784-93b3-dbb7a24b19a0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c8e2bf6f-bfcb-4629-91d5-01d69d7402fa"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=23a7d9ba-bdf2-4082-ae03-ea0a881bfc7f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=44581119-eb7d-4e71-bf0a-015bb5d12cc5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1361, 17, 1.2490815576781777, 430.44746509919133, 125, 2313, 145.0, 1187.0, 1441.8999999999999, 1812.1799999999987, 5.369959005235809, 758.7504002624316, 3.9227182482925422], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 59, 0, 0.0, 2122.8135593220336, 1539, 2879, 2116.0, 2502.0, 2644.0, 2879.0, 0.26224087046189953, 315.5631952577739, 1.2894363113043594], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/668f437e-14c9-4786-8f13-203e356bfe75", 3, 0, 0.0, 418.3333333333333, 328, 494, 433.0, 494.0, 494.0, 494.0, 0.01975711914859988, 0.02335224597284055, 0.012669767162350834], "isController": false}, {"data": ["deleteBook", 14, 0, 0.0, 677.5, 426, 1250, 579.5, 1184.5, 1250.0, 1250.0, 0.08726601798926627, 0.015765833328138926, 0.059313621602079425], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 0, 0.0, 677.5, 426, 1250, 579.5, 1184.5, 1250.0, 1250.0, 0.0877291925154466, 0.015849512319685177, 0.05962843553784262], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 13, 0, 0.0, 193.84615384615387, 125, 398, 134.0, 396.8, 398.0, 398.0, 0.07259811915026694, 0.02781328182589854, 0.04093460654611655], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ca318338-52bf-4d2a-95fa-3c1a19d44d51", 1, 0, 0.0, 586.0, 586, 586, 586.0, 586.0, 586.0, 586.0, 1.7064846416382253, 0.30830044795221845, 1.1765411689419796], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4fcbcb76-1283-4a08-ae06-ad63ffd0db5a", 1, 0, 0.0, 518.0, 518, 518, 518.0, 518.0, 518.0, 518.0, 1.9305019305019306, 0.3487723214285714, 1.3309905888030888], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 13, 0, 0.0, 155.53846153846155, 126, 393, 134.0, 296.19999999999993, 393.0, 393.0, 0.07259690290443455, 0.053951409287377634, 0.0364402422782025], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 13, 0, 0.0, 254.46153846153845, 127, 1047, 134.0, 842.5999999999998, 1047.0, 1047.0, 0.072597308315184, 1.660063540096052, 0.04227026267660691], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 13, 0, 0.0, 254.92307692307696, 132, 1445, 133.0, 1024.5999999999997, 1445.0, 1445.0, 0.072597308315184, 5.0429225041185015, 0.04219936686770537], "isController": false}, {"data": ["goToProfile", 15, 1, 6.666666666666667, 263.79999999999995, 134, 494, 237.0, 390.80000000000007, 494.0, 494.0, 0.09331898294751118, 0.18039847400133135, 0.060323188911838445], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 21, 0, 0.0, 171.1904761904762, 127, 399, 134.0, 398.6, 399.0, 399.0, 0.09699903462865536, 0.0720861966332097, 0.04868896855383677], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 21, 0, 0.0, 168.2857142857143, 127, 395, 132.0, 391.0, 395.0, 395.0, 0.09700037876338374, 0.032892799569503084, 0.05493259917133962], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 902.75, 782, 1049, 890.0, 1049.0, 1049.0, 1049.0, 0.10632359586401212, 31.262667459663483, 0.06063767576619441], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1282.5, 1181, 1451, 1249.0, 1451.0, 1451.0, 1451.0, 0.10484378276368211, 94.33862002647305, 0.05969133335080729], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 329.75, 133, 398, 394.0, 398.0, 398.0, 398.0, 0.10743157951279779, 0.19010353718475548, 0.05948604060913706], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 150.375, 128, 398, 134.0, 219.50000000000017, 398.0, 398.0, 0.08070984306979888, 0.0599806548594892, 0.04051255794714514], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 215.125, 128, 399, 134.0, 396.2, 399.0, 399.0, 0.08071065733785986, 0.03674935935915738, 0.04518299249895328], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 296.6875, 126, 1454, 133.0, 1261.5000000000002, 1454.0, 1454.0, 0.08071025020177564, 9.09693781842716, 0.04658179479418886], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 298.125, 126, 1082, 134.0, 1053.3, 1082.0, 1082.0, 0.08070984306979888, 2.985456306969799, 0.04666037802472747], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 135.25, 134, 137, 135.0, 137.0, 137.0, 137.0, 0.10818120351588911, 0.08039638269100743, 0.06074628127112914], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 21, 0, 0.0, 195.09523809523807, 125, 1187, 133.0, 340.6000000000002, 1107.4999999999989, 1187.0, 0.09700037876338374, 4.181143046978208, 0.05662866234168153], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 978.8666666666667, 132, 1579, 1307.0, 1577.8, 1579.0, 1579.0, 0.06915501788809796, 41.490084250982, 0.03669358045494781], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 21, 0, 0.0, 225.85714285714286, 127, 1046, 133.0, 395.6, 980.9999999999991, 1046.0, 0.09700306714459923, 1.3830966525858246, 0.056724961371992906], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 728.6666666666666, 133, 1186, 921.0, 1182.4, 1186.0, 1186.0, 0.06915438023844431, 13.562002376605534, 0.0367607756931574], "isController": false}, {"data": ["deleteBooks", 13, 0, 0.0, 548.5384615384617, 216, 1310, 518.0, 1169.1999999999998, 1310.0, 1310.0, 0.09660471579635725, 0.017453000412427828, 0.06660442319553538], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=52c8d398-710c-468e-9187-2ce71c9a2cc4", 1, 0, 0.0, 220.0, 220, 220, 220.0, 220.0, 220.0, 220.0, 4.545454545454545, 0.8212002840909091, 3.133877840909091], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 515.0, 262, 1587, 277.0, 1395.2000000000003, 1587.0, 1587.0, 0.080654917933621, 12.170789703013469, 0.17881526117070612], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 602.2380952380953, 143, 1258, 573.0, 1187.4, 1253.3999999999999, 1258.0, 0.11416642202433375, 0.07012761665361908, 0.051620169333268094], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 134.0666666666667, 133, 135, 134.0, 135.0, 135.0, 135.0, 0.06915438023844431, 0.05139305015767198, 0.034712257268125365], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 271.4, 132, 405, 375.0, 402.0, 405.0, 405.0, 0.06915469906180126, 0.08774902895276734, 0.03556784652267121], "isController": false}, {"data": ["login", 21, 0, 0.0, 2387.8571428571427, 1448, 3737, 2221.0, 3600.0, 3727.1, 3737.0, 0.10744710788201284, 24.633978309115097, 0.19605199832433678], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 21, 0, 0.0, 136.95238095238096, 134, 146, 136.0, 144.6, 146.0, 146.0, 0.09434555632429713, 0.07637936151644757, 0.033536896974652494], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/23a7d9ba-bdf2-4082-ae03-ea0a881bfc7f", 3, 0, 0.0, 415.33333333333337, 253, 675, 318.0, 675.0, 675.0, 675.0, 0.020626069977380077, 0.02437931643485256, 0.013227004510233968], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=128a508b-7df7-43bf-8717-f1fd72feae7c", 1, 0, 0.0, 958.0, 958, 958, 958.0, 958.0, 958.0, 958.0, 1.04384133611691, 0.18858461638830898, 0.7196796711899791], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=035b8b06-57a8-4784-93b3-dbb7a24b19a0", 1, 0, 0.0, 399.0, 399, 399, 399.0, 399.0, 399.0, 399.0, 2.506265664160401, 0.45279213659147866, 1.727952694235589], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c8e2bf6f-bfcb-4629-91d5-01d69d7402fa", 3, 0, 0.0, 336.6666666666667, 229, 550, 231.0, 550.0, 550.0, 550.0, 0.07432549612268663, 0.034936854297252434, 0.047663159948467655], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b9255b07-70a5-4ea6-9ebf-22bdbd73fe60", 1, 0, 0.0, 628.0, 628, 628, 628.0, 628.0, 628.0, 628.0, 1.5923566878980893, 0.2876816281847134, 1.0978552945859872], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cfe71c68-0327-4b44-a14d-c6c6aa8a7086", 3, 0, 0.0, 377.6666666666667, 273, 512, 348.0, 512.0, 512.0, 512.0, 0.029985906623886772, 0.030073755959698942, 0.01922924350555239], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4fcbcb76-1283-4a08-ae06-ad63ffd0db5a", 3, 0, 0.0, 369.3333333333333, 240, 615, 253.0, 615.0, 615.0, 615.0, 0.030795130263401017, 0.025672633009300127, 0.019748179237923175], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9eea0c2a-c6ea-4a3c-b989-c3eaedd2478b", 1, 0, 0.0, 233.0, 233, 233, 233.0, 233.0, 233.0, 233.0, 4.291845493562231, 1.3705405042918455, 2.5608570278969958], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 1114.2666666666664, 268, 1714, 1442.0, 1713.4, 1714.0, 1714.0, 0.06911168448212311, 55.15677103730879, 0.1436452166075378], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dc6f45d4-deb8-470a-a4ad-bc470cdd59fa", 1, 0, 0.0, 464.0, 464, 464, 464.0, 464.0, 464.0, 464.0, 2.155172413793103, 0.3893622036637931, 1.4858903556034482], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 13, 0, 0.0, 503.2307692307693, 259, 1579, 286.0, 1319.3999999999996, 1579.0, 1579.0, 0.07254261878853827, 6.779639588739153, 0.16172230301888896], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 1, 20.0, 1161.2, 134, 1586, 1321.0, 1586.0, 1586.0, 1586.0, 0.051001152626049345, 48.81481688673664, 0.09858562647265827], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/44581119-eb7d-4e71-bf0a-015bb5d12cc5", 3, 0, 0.0, 295.0, 221, 421, 243.0, 421.0, 421.0, 421.0, 0.02166299599234574, 0.02560492788027584, 0.013891960320612339], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 1008.2608695652173, 223, 1652, 1042.0, 1319.2, 1586.3999999999992, 1652.0, 0.09485201024401711, 0.029882893852352536, 0.042794559309312405], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 21, 0, 0.0, 417.76190476190476, 261, 1586, 268.0, 792.0, 1506.599999999999, 1586.0, 0.09693903457953848, 5.665596105820496, 0.21683707693035623], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 151.6315789473684, 133, 407, 137.0, 145.0, 407.0, 407.0, 0.10290907712222891, 0.07989523077360546, 0.036580961008292306], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 22, 0, 0.0, 404.3181818181818, 260, 1702, 269.0, 531.4, 1526.4999999999975, 1702.0, 0.13309215421750886, 7.434367749880519, 0.2977795162100194], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eb94552c-f3e9-4e8e-aa08-95c502ec2d7e", 2, 0, 0.0, 271.0, 235, 307, 271.0, 307.0, 307.0, 307.0, 0.01598823266076168, 0.027323639801106386, 0.009937998133373836], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 132.88888888888889, 127, 135, 134.0, 135.0, 135.0, 135.0, 0.06308927131891627, 0.046885679173530544, 0.03166785689250289], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 161.77777777777777, 131, 395, 133.0, 395.0, 395.0, 395.0, 0.06308971357270038, 0.01688142726457022, 0.03598085227193069], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 131.77777777777777, 125, 135, 132.0, 135.0, 135.0, 135.0, 0.06308882907133244, 0.01700441096063257, 0.037089331153263794], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 161.0, 132, 380, 134.0, 380.0, 380.0, 380.0, 0.06308971357270038, 0.0170046493613919, 0.03715146219173665], "isController": false}, {"data": ["https://demoqa.com/books", 59, 0, 0.0, 1462.4745762711866, 1007, 2313, 1439.0, 1915.0, 2106.0, 2313.0, 0.25971739226130214, 310.71229351917066, 0.5128403976097197], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=668f437e-14c9-4786-8f13-203e356bfe75", 1, 0, 0.0, 440.0, 440, 440, 440.0, 440.0, 440.0, 440.0, 2.2727272727272725, 0.41060014204545453, 1.5669389204545454], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 1008.2608695652173, 223, 1652, 1042.0, 1319.2, 1586.3999999999992, 1652.0, 0.09627499487231006, 0.03033120167937078, 0.043436569952155515], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 174.83333333333331, 126, 394, 133.0, 394.0, 394.0, 394.0, 0.030962628107873796, 0.00834539585720036, 0.018232875731492088], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 177.66666666666669, 132, 396, 134.5, 396.0, 396.0, 396.0, 0.03096246832797511, 0.00834535279152454, 0.01820254485687599], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cfe71c68-0327-4b44-a14d-c6c6aa8a7086", 1, 0, 0.0, 1310.0, 1310, 1310, 1310.0, 1310.0, 1310.0, 1310.0, 0.7633587786259541, 0.13791149809160305, 0.5263000954198473], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 328.157894736842, 128, 1562, 134.0, 1391.0, 1562.0, 1562.0, 0.10502633950040628, 9.97300019830631, 0.06079392657553328], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 298.1578947368421, 127, 1056, 134.0, 785.0, 1056.0, 1056.0, 0.10502517840461227, 3.2759477831395896, 0.06089581813232067], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 172.83333333333334, 127, 376, 133.5, 376.0, 376.0, 376.0, 0.030963586821897447, 0.008285178505078027, 0.017658920609363388], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 176.0, 132, 398, 134.0, 398.0, 398.0, 398.0, 0.10502285629003996, 0.07804921253585978, 0.05271655091121146], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 142.83333333333334, 128, 197, 133.5, 197.0, 197.0, 197.0, 0.030961829224870605, 0.023009718789186066, 0.015541386935140128], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 200.94736842105266, 127, 397, 134.0, 396.0, 397.0, 397.0, 0.10502517840461227, 0.0447069555688219, 0.058968701114925186], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 147.33333333333334, 137, 192, 139.0, 192.0, 192.0, 192.0, 0.031948711668201984, 0.02514713047321367, 0.011356768600806174], "isController": false}, {"data": ["deleteAccount", 13, 0, 0.0, 541.8461538461538, 421, 971, 471.0, 852.5999999999999, 971.0, 971.0, 0.09853336870428621, 0.017801438681926705, 0.06706812303406981], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/dc6f45d4-deb8-470a-a4ad-bc470cdd59fa", 3, 0, 0.0, 796.0, 309, 1608, 471.0, 1608.0, 1608.0, 1608.0, 0.02483813813316554, 0.024910906115977547, 0.015928102904406286], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1218.0000000000002, 753, 1823, 1173.0, 1765.2000000000003, 1821.5, 1823.0, 0.11001445904318853, 0.05694107743446282, 0.050602353720060354], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ca318338-52bf-4d2a-95fa-3c1a19d44d51", 3, 0, 0.0, 347.6666666666667, 297, 424, 322.0, 424.0, 424.0, 424.0, 0.04792715073088905, 0.030812539939292276, 0.03073453350906622], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 365.1666666666667, 264, 592, 271.5, 592.0, 592.0, 592.0, 0.030940434506835254, 0.04795163043198004, 0.06958576237230625], "isController": false}, {"data": ["addBook", 62, 10, 16.129032258064516, 1303.3870967741934, 676, 2674, 1053.5, 2258.9, 2377.0499999999997, 2674.0, 0.2949613933595627, 97.90478916801857, 1.0707914405890664], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=59461957-6ad5-4487-a5ed-692f2ef50bb4", 1, 0, 0.0, 273.0, 273, 273, 273.0, 273.0, 273.0, 273.0, 3.663003663003663, 0.6617731227106226, 2.525469322344322], "isController": false}, {"data": ["https://demoqa.com/books-0", 59, 0, 0.0, 237.94915254237281, 131, 539, 135.0, 533.0, 538.0, 539.0, 0.26127119507215957, 0.19416736274405608, 0.12629808746163965], "isController": false}, {"data": ["https://demoqa.com/books-3", 59, 0, 0.0, 840.8813559322031, 625, 1322, 787.0, 1164.0, 1195.0, 1322.0, 0.26102845210127906, 76.75103187809971, 0.13127895784390498], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3db58afd-3240-4786-901e-cd183d23b77d", 1, 0, 0.0, 493.0, 493, 493, 493.0, 493.0, 493.0, 493.0, 2.028397565922921, 0.647740238336714, 1.2103036257606492], "isController": false}, {"data": ["https://demoqa.com/books-1", 59, 0, 0.0, 225.66101694915255, 129, 553, 137.0, 400.0, 406.0, 553.0, 0.261478461265733, 0.4626943084116292, 0.12716432979524908], "isController": false}, {"data": ["https://demoqa.com/books-2", 59, 0, 0.0, 1219.8474576271187, 873, 1824, 1183.0, 1575.0, 1617.0, 1824.0, 0.2603787407377986, 234.2892486128764, 0.13069792259690283], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 22, 0, 0.0, 148.9090909090909, 133, 398, 136.0, 150.9, 361.2499999999995, 398.0, 0.1343806882734525, 0.10039182278241324, 0.04776813528470381], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 183, 10, 5.46448087431694, 199.61748633879782, 128, 1204, 139.0, 371.79999999999995, 443.3999999999997, 635.3199999999977, 0.7540483744694879, 1.6359162215686678, 0.3621236518294944], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 194.77777777777777, 134, 405, 137.0, 405.0, 405.0, 405.0, 0.059560838087170595, 0.04612475058899051, 0.021172016663798924], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/52c8d398-710c-468e-9187-2ce71c9a2cc4", 3, 0, 0.0, 378.33333333333337, 237, 637, 261.0, 637.0, 637.0, 637.0, 0.06891640440146102, 0.03118287829362983, 0.04419443902046817], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 13, 0, 0.0, 139.46153846153842, 134, 161, 136.0, 154.6, 161.0, 161.0, 0.07627720309098697, 0.061900738055283365, 0.02711416203624927], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f8880495-23a7-4c69-94f8-fe0773dea0b4", 1, 0, 0.0, 333.0, 333, 333, 333.0, 333.0, 333.0, 333.0, 3.003003003003003, 0.9589667792792792, 1.7918308933933933], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/128a508b-7df7-43bf-8717-f1fd72feae7c", 3, 0, 0.0, 342.6666666666667, 249, 436, 343.0, 436.0, 436.0, 436.0, 0.03862097376348515, 0.03219671673446793, 0.02476670518035995], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/59461957-6ad5-4487-a5ed-692f2ef50bb4", 3, 0, 0.0, 323.6666666666667, 227, 454, 290.0, 454.0, 454.0, 454.0, 0.07673026753286613, 0.033969128855695946, 0.04920528223950074], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b9255b07-70a5-4ea6-9ebf-22bdbd73fe60", 3, 0, 0.0, 301.0, 224, 445, 234.0, 445.0, 445.0, 445.0, 0.04580082746828293, 0.029743701432039204, 0.029370973343918413], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 296.3333333333333, 261, 530, 268.0, 530.0, 530.0, 530.0, 0.06302962392324393, 0.09768360660760558, 0.1417551014601863], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 575.4736842105262, 266, 1960, 527.0, 1526.0, 1960.0, 1960.0, 0.10494512474661276, 13.361403349337465, 0.23319760372997067], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/035b8b06-57a8-4784-93b3-dbb7a24b19a0", 3, 0, 0.0, 469.66666666666663, 218, 971, 220.0, 971.0, 971.0, 971.0, 0.032282015689059626, 0.026912188209531805, 0.020701683238101388], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c8e2bf6f-bfcb-4629-91d5-01d69d7402fa", 1, 0, 0.0, 216.0, 216, 216, 216.0, 216.0, 216.0, 216.0, 4.62962962962963, 0.8364076967592593, 3.191912615740741], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=23a7d9ba-bdf2-4082-ae03-ea0a881bfc7f", 1, 0, 0.0, 595.0, 595, 595, 595.0, 595.0, 595.0, 595.0, 1.680672268907563, 0.3036370798319328, 1.1587447478991597], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 153.75, 134, 398, 136.0, 225.80000000000018, 398.0, 398.0, 0.08496447422921291, 0.07044417834043142, 0.03020221544866553], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 156.06666666666666, 133, 402, 138.0, 248.4000000000001, 402.0, 402.0, 0.06933594652811803, 0.053830153798685394, 0.02464676224241696], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=44581119-eb7d-4e71-bf0a-015bb5d12cc5", 1, 0, 0.0, 524.0, 524, 524, 524.0, 524.0, 524.0, 524.0, 1.9083969465648853, 0.34477874522900764, 1.3157502385496183], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 22, 0, 0.0, 132.72727272727275, 126, 135, 133.5, 134.7, 135.0, 135.0, 0.13341014523513536, 0.09914562551165823, 0.06696563930748006], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 22, 0, 0.0, 191.8636363636364, 126, 397, 134.0, 396.0, 396.85, 397.0, 0.13341176327901857, 0.04480617014244738, 0.07557710062885455], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 22, 0, 0.0, 221.09090909090912, 127, 1568, 132.0, 397.4, 1392.4999999999975, 1568.0, 0.13341661764616702, 5.491075726438322, 0.07791322007071082], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 22, 0, 0.0, 215.36363636363637, 125, 914, 133.5, 397.1, 836.5999999999989, 914.0, 0.1332025526452816, 1.8145418399813515, 0.07791829007277702], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 35.294117647058826, 0.440852314474651], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.882352941176471, 0.07347538574577517], "isController": false}, {"data": ["401/Unauthorized", 10, 58.8235294117647, 0.7347538574577517], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1361, 17, "401/Unauthorized", 10, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 1, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 1, "Test failed: code expected to contain /200/", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 183, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
