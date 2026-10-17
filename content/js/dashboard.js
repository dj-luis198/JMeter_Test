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

    var data = {"OkPercent": 96.81576952236543, "KoPercent": 3.184230477634572};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7940026075619296, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/2bbed500-46ba-4c26-a9e2-df69303a0e4a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7523a741-4fc6-4755-9165-cc586743ec0e"], "isController": false}, {"data": [0.38596491228070173, 500, 1500, "see books"], "isController": true}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/755e77d9-c6d3-48a3-976b-d820a65a81d2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f3290027-c900-4e24-8ce1-13cbe4ef26a7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2a038613-9a69-44da-8d16-f203ebb92ab9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d3fce758-3f40-48bc-bb67-5036e3f2f12d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/f3290027-c900-4e24-8ce1-13cbe4ef26a7"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.42857142857142855, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7523a741-4fc6-4755-9165-cc586743ec0e"], "isController": false}, {"data": [0.20833333333333334, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7535fd25-0049-4585-9431-8a546573fe2c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d3fce758-3f40-48bc-bb67-5036e3f2f12d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2bbed500-46ba-4c26-a9e2-df69303a0e4a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=755e77d9-c6d3-48a3-976b-d820a65a81d2"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.2619047619047619, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6edcce93-6b95-49bb-98b5-2ab157e11049"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7535fd25-0049-4585-9431-8a546573fe2c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/32c51a67-16b7-4c1b-a9a7-89c4b6b19764"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.8508771929824561, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9005847953216374, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6a16ddea-124e-4cb4-8926-e77ec04ad2aa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6edcce93-6b95-49bb-98b5-2ab157e11049"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/ff1685cf-53cb-483a-979d-c878c9e4715b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ff1685cf-53cb-483a-979d-c878c9e4715b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2a038613-9a69-44da-8d16-f203ebb92ab9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a2f4b69a-c274-4aa5-a9a5-42ab583f395c"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2647058823529412, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/a2f4b69a-c274-4aa5-a9a5-42ab583f395c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.20833333333333334, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1319, 42, 3.184230477634572, 302.17361637604216, 78, 2987, 91.0, 869.0, 1040.0, 1635.0, 5.100896427438879, 715.7791777004006, 3.748629544979929], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/2bbed500-46ba-4c26-a9e2-df69303a0e4a", 3, 0, 0.0, 562.6666666666666, 178, 957, 553.0, 957.0, 957.0, 957.0, 0.039588804286147875, 0.025451786609746764, 0.02538735170693728], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7523a741-4fc6-4755-9165-cc586743ec0e", 3, 0, 0.0, 316.3333333333333, 211, 460, 278.0, 460.0, 460.0, 460.0, 0.020735416090682884, 0.028585445033867844, 0.013297125552944428], "isController": false}, {"data": ["see books", 57, 0, 0.0, 1334.8070175438595, 968, 1777, 1292.0, 1608.2, 1657.1, 1777.0, 0.25022388452826216, 301.10491027333666, 1.230348885351367], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 234.38888888888889, 161, 949, 165.5, 386.5000000000009, 949.0, 949.0, 0.09811296072211138, 6.664564519832445, 0.21926373036378108], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 86.0, 82, 103, 83.5, 99.5, 103.0, 103.0, 0.0700147030876484, 0.05435711811980516, 0.02488803898818752], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/755e77d9-c6d3-48a3-976b-d820a65a81d2", 3, 0, 0.0, 442.0, 178, 927, 221.0, 927.0, 927.0, 927.0, 0.019307379924186355, 0.026616781894182685, 0.012381360172736692], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f3290027-c900-4e24-8ce1-13cbe4ef26a7", 1, 0, 0.0, 433.0, 433, 433, 433.0, 433.0, 433.0, 433.0, 2.3094688221709005, 0.417238019630485, 1.5922704965357968], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 259.5333333333333, 162, 331, 320.0, 329.8, 331.0, 331.0, 0.10729997496333918, 0.1662940041668157, 0.24132015853571304], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2a038613-9a69-44da-8d16-f203ebb92ab9", 1, 0, 0.0, 211.0, 211, 211, 211.0, 211.0, 211.0, 211.0, 4.739336492890995, 0.8562277843601896, 3.267550355450237], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 107.14285714285715, 82, 242, 83.0, 242.0, 242.0, 242.0, 0.03651291253070997, 0.027135084410029577, 0.018327770547641526], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d3fce758-3f40-48bc-bb67-5036e3f2f12d", 1, 0, 0.0, 441.0, 441, 441, 441.0, 441.0, 441.0, 441.0, 2.2675736961451247, 0.4096690759637188, 1.5633857709750567], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 103.71428571428571, 80, 238, 82.0, 238.0, 238.0, 238.0, 0.03651329344690706, 0.017604623626187334, 0.020385909650463458], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 228.71428571428572, 79, 957, 81.0, 957.0, 957.0, 957.0, 0.03651367437105196, 4.70201683443396, 0.021017776291149606], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 159.0, 79, 629, 81.0, 629.0, 629.0, 629.0, 0.03651367437105196, 1.5421831558507946, 0.021053434176277586], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 89.25, 82, 97, 89.0, 97.0, 97.0, 97.0, 0.10102795948778824, 0.029795355239562546, 0.06245185386305659], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f3290027-c900-4e24-8ce1-13cbe4ef26a7", 3, 0, 0.0, 887.6666666666666, 524, 1365, 774.0, 1365.0, 1365.0, 1365.0, 0.019917541378692213, 0.02354185961784877, 0.012772642095059785], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 918.4561403508774, 627, 1436, 873.0, 1273.0, 1311.7999999999997, 1436.0, 0.24343161706925415, 291.2288445379497, 0.4806823532363593], "isController": false}, {"data": ["deleteBook", 14, 4, 28.571428571428573, 564.357142857143, 84, 1546, 541.5, 1291.0, 1546.0, 1546.0, 0.08814455707360071, 0.01880204070389725, 0.05870565226972234], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 4, 28.571428571428573, 564.357142857143, 84, 1546, 541.5, 1291.0, 1546.0, 1546.0, 0.08828685660953245, 0.01883239449720635, 0.05880042598408314], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7523a741-4fc6-4755-9165-cc586743ec0e", 1, 0, 0.0, 441.0, 441, 441, 441.0, 441.0, 441.0, 441.0, 2.2675736961451247, 0.4096690759637188, 1.5633857709750567], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 10, 41.666666666666664, 1129.1250000000002, 143, 2259, 1145.0, 1851.0, 2176.0, 2259.0, 0.09517540033152765, 0.029463478422943615, 0.04294046382145095], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 122.25, 79, 241, 81.0, 240.3, 241.0, 241.0, 0.07647635207800588, 0.020463398895872665, 0.04361541954448773], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 120.0, 78, 240, 81.0, 240.0, 240.0, 240.0, 0.08069234027959897, 0.021749107340985657, 0.047517071473240406], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 81.81250000000001, 80, 85, 82.0, 83.6, 85.0, 85.0, 0.0764756210059412, 0.056833933188985594, 0.03838717695024783], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 100.5, 80, 238, 81.0, 238.0, 238.0, 238.0, 0.0806939681258826, 0.021749546096429293, 0.047439227355255194], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 80.68750000000001, 79, 83, 81.0, 82.3, 83.0, 83.0, 0.0764756210059412, 0.02061256972425759, 0.04503398385408451], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7535fd25-0049-4585-9431-8a546573fe2c", 3, 0, 0.0, 260.0, 183, 405, 192.0, 405.0, 405.0, 405.0, 0.09175153683824204, 0.04151518105636602, 0.0588380623604612], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 113.0625, 80, 241, 81.0, 240.3, 241.0, 241.0, 0.07647525547515033, 0.02061247120228661, 0.044959085738320796], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d3fce758-3f40-48bc-bb67-5036e3f2f12d", 3, 0, 0.0, 305.3333333333333, 175, 516, 225.0, 516.0, 516.0, 516.0, 0.019928655413619243, 0.02355499603087613, 0.012779769259384736], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2bbed500-46ba-4c26-a9e2-df69303a0e4a", 1, 0, 0.0, 403.0, 403, 403, 403.0, 403.0, 403.0, 403.0, 2.4813895781637716, 0.44829792183622824, 1.710801799007444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 93.35714285714286, 79, 237, 81.5, 163.0, 237.0, 237.0, 0.070792522287003, 0.019080797022668777, 0.04161826017263262], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 141.92857142857144, 79, 278, 84.5, 262.0, 278.0, 278.0, 0.07079395419631163, 0.01908118296697462, 0.04168823669958585], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 95.28571428571429, 81, 241, 83.0, 170.0, 241.0, 241.0, 0.07079323823441663, 0.0526109905238194, 0.035534887160634916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 120.62500000000001, 80, 240, 81.0, 240.0, 240.0, 240.0, 0.08082114281095935, 0.021625969853713733, 0.04609330800937526], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 104.5, 80, 245, 81.0, 243.5, 245.0, 245.0, 0.07079359621355394, 0.01894281773682986, 0.04037447284054248], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 134.125, 80, 338, 81.5, 338.0, 338.0, 338.0, 0.08082032631206748, 0.06006276203465172, 0.040568015355862], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=755e77d9-c6d3-48a3-976b-d820a65a81d2", 1, 0, 0.0, 893.0, 893, 893, 893.0, 893.0, 893.0, 893.0, 1.1198208286674132, 0.20231138017917133, 0.7720639697648376], "isController": false}, {"data": ["deleteAccount", 14, 4, 28.571428571428573, 423.3571428571429, 81, 927, 452.5, 850.5, 927.0, 927.0, 0.08944772419433156, 0.018381207831787167, 0.06085889381916226], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 104.375, 82, 242, 85.0, 242.0, 242.0, 242.0, 0.0784821551199796, 0.06177404006514019, 0.027897953577805248], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1564.809523809524, 1031, 2987, 1444.0, 2095.2000000000003, 2901.8999999999987, 2987.0, 0.08814122742954997, 0.04561997122818505, 0.040541521600896524], "isController": false}, {"data": ["goToProfile", 14, 4, 28.571428571428573, 187.1428571428571, 81, 524, 183.5, 374.5, 524.0, 524.0, 0.08836487117664138, 0.15512546825492005, 0.057101853137584105], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 275.625, 162, 578, 164.5, 578.0, 578.0, 578.0, 0.08062402999213916, 0.12495149960695785, 0.1813253330780239], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6edcce93-6b95-49bb-98b5-2ab157e11049", 1, 0, 0.0, 295.0, 295, 295, 295.0, 295.0, 295.0, 295.0, 3.389830508474576, 0.6124205508474576, 2.337129237288136], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 81.94444444444444, 80, 84, 82.0, 84.0, 84.0, 84.0, 0.09815683280619479, 0.07294663063038499, 0.04927012896717199], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 89.66666666666667, 79, 243, 81.0, 99.00000000000023, 243.0, 243.0, 0.09815843862643624, 0.03445557171837253, 0.05552299702252736], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 9, 0, 0.0, 580.3333333333335, 469, 641, 631.0, 641.0, 641.0, 641.0, 0.05263434917627243, 15.476246282699089, 0.03001802726459287], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 9, 0, 0.0, 857.7777777777778, 712, 1018, 872.0, 1018.0, 1018.0, 1018.0, 0.052563645814473696, 47.29686090089709, 0.02992637256820133], "isController": false}, {"data": ["addBook", 57, 16, 28.07017543859649, 792.5263157894735, 415, 1617, 675.0, 1418.4, 1542.6999999999998, 1617.0, 0.2681393948517236, 62.95692757384418, 0.9781841626641766], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-1", 9, 0, 0.0, 169.33333333333334, 80, 244, 237.0, 244.0, 244.0, 244.0, 0.05280760429501848, 0.09344470603766943, 0.02924014808132371], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 18, 0, 0.0, 83.11111111111111, 80, 95, 82.0, 90.5, 95.0, 95.0, 0.10251561939367705, 0.07618592417830883, 0.05145803551596681], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 18, 0, 0.0, 136.0, 78, 281, 81.5, 247.70000000000005, 281.0, 281.0, 0.10240014563576268, 0.027400038968944312, 0.0584000830578959], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7535fd25-0049-4585-9431-8a546573fe2c", 1, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 2.277904328018223, 0.4115354498861048, 1.570508257403189], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/32c51a67-16b7-4c1b-a9a7-89c4b6b19764", 1, 0, 0.0, 392.0, 392, 392, 392.0, 392.0, 392.0, 392.0, 2.5510204081632653, 0.8146324936224489, 1.5221420599489794], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 18, 0, 0.0, 98.33333333333334, 79, 239, 81.0, 239.0, 239.0, 239.0, 0.10251678712389155, 0.027631477779486394, 0.06026865805525655], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 142.45614035087715, 80, 336, 82.0, 325.2, 328.69999999999993, 336.0, 0.24408939667096322, 0.181398467643167, 0.11799243296106132], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 18, 0, 0.0, 89.22222222222223, 79, 239, 80.0, 97.70000000000022, 239.0, 239.0, 0.10251795488070896, 0.027631792526441087, 0.060369459758854986], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 508.1754385964913, 393, 737, 475.0, 650.8000000000001, 710.6999999999999, 737.0, 0.24389722085535182, 71.71388108138464, 0.12266315306690058], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 9, 0, 0.0, 99.55555555555556, 80, 239, 82.0, 239.0, 239.0, 239.0, 0.05280760429501848, 0.03924471373877838, 0.02965270748987854], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 128.2105263157894, 80, 335, 83.0, 246.2, 321.59999999999997, 335.0, 0.2443803243827253, 0.4324386208803694, 0.11884902494394259], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 489.5, 79, 1044, 474.5, 963.0000000000001, 1044.0, 1044.0, 0.08250598168367207, 37.13063264469486, 0.04495931423778224], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 142.05555555555554, 78, 865, 81.5, 301.6000000000009, 865.0, 865.0, 0.09815843862643624, 4.931827814079737, 0.05723778745426089], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 773.9122807017543, 545, 1107, 788.0, 955.4000000000001, 1037.4999999999995, 1107.0, 0.243821061006596, 219.3906192854439, 0.12238674351307652], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 358.4444444444444, 78, 720, 282.5, 708.3000000000001, 720.0, 720.0, 0.08250560350557141, 12.140812356474628, 0.04503968003868596], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 120.22222222222223, 78, 476, 81.0, 264.50000000000034, 476.0, 476.0, 0.09815897391152605, 1.6284313889222144, 0.05733395796069278], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 104.4, 82, 253, 87.0, 212.8, 253.0, 253.0, 0.10230667448744356, 0.07643027928017024, 0.03636682569670845], "isController": false}, {"data": ["deleteBooks", 14, 4, 28.571428571428573, 344.57142857142856, 82, 893, 394.0, 709.5, 893.0, 893.0, 0.08850005057145748, 0.018877870720390412, 0.059214040533023156], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 16, 9.35672514619883, 137.9415204678363, 80, 555, 87.0, 278.20000000000005, 363.8000000000002, 521.8800000000001, 0.7014003396254276, 1.5262939887734928, 0.33452547036891195], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 112.42857142857143, 83, 250, 88.0, 250.0, 250.0, 250.0, 0.0381512971441029, 0.029544901011009376, 0.013561593906692829], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 18, 0, 0.0, 220.4444444444445, 163, 362, 167.0, 328.70000000000005, 362.0, 362.0, 0.10235181731337853, 0.15862532624641767, 0.23019163600850656], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 97.8125, 82, 246, 84.0, 166.9000000000001, 246.0, 246.0, 0.07689535023429052, 0.06240237894989788, 0.02733389402859546], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 682.2380952380952, 93, 1693, 487.0, 1598.6000000000001, 1687.1999999999998, 1693.0, 0.09133254178463786, 0.0561017273266965, 0.041295866060827476], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 82.2222222222222, 80, 87, 82.0, 85.2, 87.0, 87.0, 0.08250295635593609, 0.061313232213737655, 0.04141261676460073], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 117.05555555555556, 79, 245, 81.5, 242.3, 245.0, 245.0, 0.08250635986523962, 0.08403723958930168, 0.04358978582724085], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6a16ddea-124e-4cb4-8926-e77ec04ad2aa", 1, 0, 0.0, 285.0, 285, 285, 285.0, 285.0, 285.0, 285.0, 3.5087719298245617, 1.1204769736842106, 2.0936129385964914], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6edcce93-6b95-49bb-98b5-2ab157e11049", 3, 0, 0.0, 287.3333333333333, 184, 445, 233.0, 445.0, 445.0, 445.0, 0.0675021938212992, 0.030499038093738048, 0.04328753965753887], "isController": false}, {"data": ["login", 21, 0, 0.0, 3019.0, 1795, 4604, 2938.0, 4287.0, 4579.099999999999, 4604.0, 0.08952971320648537, 46.0213826465303, 0.19870650214871313], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 337.00000000000006, 163, 1040, 168.0, 1040.0, 1040.0, 1040.0, 0.03649730180661644, 6.286120516045778, 0.08074926190724473], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 94.33333333333337, 82, 244, 84.5, 107.20000000000022, 244.0, 244.0, 0.09632725579702776, 0.07798368657786721, 0.03424132920909972], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 249.5, 163, 488, 170.5, 427.0, 488.0, 488.0, 0.07076246556647882, 0.1096680008339862, 0.15914644355429755], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ff1685cf-53cb-483a-979d-c878c9e4715b", 3, 0, 0.0, 851.3333333333334, 182, 1823, 549.0, 1823.0, 1823.0, 1823.0, 0.03163489117597435, 0.03172757152121647, 0.0202866977918846], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ff1685cf-53cb-483a-979d-c878c9e4715b", 1, 0, 0.0, 526.0, 526, 526, 526.0, 526.0, 526.0, 526.0, 1.9011406844106464, 0.34346779942965777, 1.3107473859315588], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2a038613-9a69-44da-8d16-f203ebb92ab9", 3, 0, 0.0, 274.3333333333333, 186, 438, 199.0, 438.0, 438.0, 438.0, 0.07436787307882996, 0.03364952590480912, 0.04769033527516112], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 18, 0, 0.0, 102.33333333333333, 81, 245, 84.5, 192.80000000000007, 245.0, 245.0, 0.09688879319625363, 0.08033064982775326, 0.03444093820648078], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a2f4b69a-c274-4aa5-a9a5-42ab583f395c", 1, 0, 0.0, 385.0, 385, 385, 385.0, 385.0, 385.0, 385.0, 2.5974025974025974, 0.4692573051948052, 1.7907873376623376], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 573.6111111111112, 163, 1127, 557.0, 1046.0000000000002, 1127.0, 1127.0, 0.08247158166748374, 49.39624913948923, 0.17492995642751435], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 97.0, 82, 244, 85.5, 123.40000000000019, 244.0, 244.0, 0.08798428014194798, 0.06830810811801626, 0.03127566208170807], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 225.81249999999997, 162, 323, 167.5, 323.0, 323.0, 323.0, 0.07644492859565888, 0.11847470867315493, 0.1719264360896508], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 17, 8, 47.05882352941177, 545.6470588235293, 81, 1101, 799.0, 1051.3999999999999, 1101.0, 1101.0, 0.09904508882013995, 62.743721014746065, 0.14911952739470632], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a2f4b69a-c274-4aa5-a9a5-42ab583f395c", 3, 0, 0.0, 748.0, 184, 1528, 532.0, 1528.0, 1528.0, 1528.0, 0.018012825131493625, 0.024832133604126137, 0.011551193199558085], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 82.33333333333334, 79, 88, 81.0, 87.4, 88.0, 88.0, 0.10736218274474998, 0.0797877158874558, 0.053890783135548334], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 133.8666666666667, 79, 242, 81.0, 241.4, 242.0, 242.0, 0.10736371965185525, 0.028728182797469082, 0.0612308713639487], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 112.26666666666668, 78, 243, 81.0, 241.2, 243.0, 243.0, 0.10736371965185525, 0.028937877562414113, 0.06311812424845396], "isController": false}, {"data": ["register", 24, 10, 41.666666666666664, 1129.1250000000002, 143, 2259, 1145.0, 1851.0, 2176.0, 2259.0, 0.09708070237888171, 0.030053303373149903, 0.04380008251859702], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 154.26666666666668, 79, 242, 82.0, 240.8, 242.0, 242.0, 0.1073644881219088, 0.028938084689108228, 0.06322342415772558], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 10, 23.80952380952381, 0.7581501137225171], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 9.523809523809524, 0.3032600454890068], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 4, 9.523809523809524, 0.3032600454890068], "isController": false}, {"data": ["401/Unauthorized", 24, 57.142857142857146, 1.819560272934041], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1319, 42, "401/Unauthorized", 24, "406/Not Acceptable", 10, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 10, "406/Not Acceptable", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 16, "401/Unauthorized", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 17, 8, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
