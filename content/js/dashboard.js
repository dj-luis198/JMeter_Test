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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6795918367346939, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/57eae82a-a173-4c2b-9691-34c8603bf1f9"], "isController": false}, {"data": [0.11764705882352941, 500, 1500, "see books"], "isController": true}, {"data": [0.75, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.625, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.625, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7d231511-479f-4678-bcc1-d3e91676f8e1"], "isController": false}, {"data": [0.23076923076923078, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/a5b3ba61-5e53-4105-b79a-f0d3b53a1f18"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a5b3ba61-5e53-4105-b79a-f0d3b53a1f18"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.20833333333333334, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.875, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/7d231511-479f-4678-bcc1-d3e91676f8e1"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/51fe6213-ade5-4021-83bc-dfa54dd72886"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/de054428-ba47-4124-9dc5-bc0dc9574aaa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/862ce1c2-9490-40ef-a02d-c692e6c0a6a5"], "isController": false}, {"data": [0.14285714285714285, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=51fe6213-ade5-4021-83bc-dfa54dd72886"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.7205882352941176, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.625, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.4934210526315789, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/b93d4230-4f83-4ef0-ad16-63cacaab87f2"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/1ade5cb8-d841-412e-8c70-07c5afa6d26f"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.20833333333333334, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/3068d01b-8c16-42b2-b303-65ceb702e03a"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5333333333333333, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/9e2f270f-3c77-47d6-ba32-389d906a3340"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/e101faf6-88b7-42ad-a278-06183d70d7a3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/d73fdfdb-de03-4464-bfec-c1e188489248"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9e2f270f-3c77-47d6-ba32-389d906a3340"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.23076923076923078, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 640, 0, 0.0, 2967.973437500003, 78, 55109, 238.0, 7260.699999999997, 26996.04999999998, 40557.05000000002, 2.5392593297942407, 419.3935729833718, 1.8435318753917997], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/57eae82a-a173-4c2b-9691-34c8603bf1f9", 1, 0, 0.0, 40206.0, 40206, 40206, 40206.0, 40206.0, 40206.0, 40206.0, 0.0248719096652241, 0.007942494590359648, 0.014840563286574142], "isController": false}, {"data": ["see books", 34, 0, 0.0, 20504.61764705882, 975, 49309, 25591.0, 38712.5, 41851.0, 49309.0, 0.16779931202282072, 201.92033049061558, 0.8250679062840843], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 4, 0, 0.0, 7126.25, 83, 28246, 88.0, 28246.0, 28246.0, 28246.0, 0.023443910444262105, 0.018201082815613643, 0.008333577540733795], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 260.07142857142856, 163, 479, 178.5, 478.5, 479.0, 479.0, 0.08495558036797904, 0.13166455668357688, 0.19106709139399972], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 1, 0, 0.0, 163.0, 163, 163, 163.0, 163.0, 163.0, 163.0, 6.134969325153374, 9.508004217791411, 13.797689800613496], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 4, 0, 0.0, 86.75, 82, 90, 87.5, 90.0, 90.0, 90.0, 0.02329075007860628, 0.01730884844708924, 0.011690864785550419], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 4, 0, 0.0, 82.0, 80, 85, 81.5, 85.0, 85.0, 85.0, 0.023291835047224197, 0.006232385549745536, 0.013283624675370049], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 4, 0, 0.0, 79.5, 78, 80, 80.0, 80.0, 80.0, 80.0, 0.02329210630517318, 0.006277950527566208, 0.013693210933314699], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 4, 0, 0.0, 81.75, 79, 84, 82.0, 84.0, 84.0, 84.0, 0.02329197067540892, 0.00627791397110631, 0.013715877262960526], "isController": false}, {"data": ["https://demoqa.com/books", 34, 0, 0.0, 1009.0882352941178, 625, 1342, 1046.0, 1298.0, 1342.0, 1342.0, 0.16933367200067734, 202.58194162221656, 0.33436785623571247], "isController": false}, {"data": ["deleteBook", 4, 0, 0.0, 1084.25, 432, 2478, 713.5, 2478.0, 2478.0, 2478.0, 0.09053460685346973, 0.016356349870988184, 0.06153524059571771], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 4, 0, 0.0, 1084.25, 432, 2478, 713.5, 2478.0, 2478.0, 2478.0, 0.08282773900979438, 0.01496399581719918, 0.05629697885821962], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7d231511-479f-4678-bcc1-d3e91676f8e1", 1, 0, 0.0, 379.0, 379, 379, 379.0, 379.0, 379.0, 379.0, 2.638522427440633, 0.47668618073878627, 1.8191375329815302], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 13, 0, 0.0, 20906.076923076926, 430, 49981, 24500.0, 49800.6, 49981.0, 49981.0, 0.05988685990160128, 0.01941644285872229, 0.02701926686966777], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a5b3ba61-5e53-4105-b79a-f0d3b53a1f18", 3, 0, 0.0, 3876.0, 441, 10621, 566.0, 10621.0, 10621.0, 10621.0, 0.015960163432073547, 0.013305331559095166, 0.010234870430073205], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 4, 0, 0.0, 120.75, 80, 242, 80.5, 242.0, 242.0, 242.0, 0.03297799543254763, 0.008888600331428853, 0.01941965941975217], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 6, 0, 0.0, 131.16666666666669, 79, 235, 80.0, 235.0, 235.0, 235.0, 0.05082290757854257, 0.01359909831691471, 0.028984939478387556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 4, 0, 0.0, 119.5, 79, 238, 80.5, 238.0, 238.0, 238.0, 0.03297799543254763, 0.008888600331428853, 0.019387454346087574], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 6, 0, 0.0, 81.0, 80, 83, 81.0, 83.0, 83.0, 83.0, 0.050822046603816735, 0.037769118618656776, 0.02551028511168145], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 6, 0, 0.0, 106.0, 78, 237, 80.0, 237.0, 237.0, 237.0, 0.050823768582440386, 0.013698593875735885, 0.02992844966329253], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 6, 0, 0.0, 106.16666666666667, 79, 236, 80.5, 236.0, 236.0, 236.0, 0.05082247708753324, 0.013698245777499195, 0.029878057819038097], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 4, 0, 0.0, 119.0, 80, 236, 80.0, 236.0, 236.0, 236.0, 0.02385567317727747, 0.006429849411063068, 0.014024526613985388], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 4, 0, 0.0, 79.25, 78, 80, 79.5, 80.0, 80.0, 80.0, 0.02385595772724291, 0.00642992610617094, 0.014047990731960423], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a5b3ba61-5e53-4105-b79a-f0d3b53a1f18", 1, 0, 0.0, 933.0, 933, 933, 933.0, 933.0, 933.0, 933.0, 1.0718113612004287, 0.19363779474812431, 0.7389636923901393], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 4, 0, 0.0, 124.0, 80, 235, 90.5, 235.0, 235.0, 235.0, 0.023855530904840286, 0.01772857326033541, 0.01197435828621866], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 4, 0, 0.0, 156.75, 78, 236, 156.5, 236.0, 236.0, 236.0, 0.032978539215605444, 0.008824335688550676, 0.01880807314639998], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 4, 0, 0.0, 118.25, 78, 236, 79.5, 236.0, 236.0, 236.0, 0.02385567317727747, 0.006383256299388698, 0.013605188608916057], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 4, 0, 0.0, 159.0, 79, 239, 159.0, 239.0, 239.0, 239.0, 0.0329774516674224, 0.024507656952059028, 0.016553134918999134], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 4, 0, 0.0, 85.25, 81, 92, 84.0, 92.0, 92.0, 92.0, 0.03339762375906954, 0.026287582763486375, 0.01187181157060675], "isController": false}, {"data": ["deleteAccount", 3, 0, 0.0, 703.0, 566, 773, 770.0, 773.0, 773.0, 773.0, 0.0928131670946385, 0.016768003820808713, 0.06317458736812796], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 12, 0, 0.0, 9187.833333333334, 908, 38816, 2929.0, 37313.90000000001, 38816.0, 38816.0, 0.06152741815571564, 0.03184524572512626, 0.028300208936857488], "isController": false}, {"data": ["goToProfile", 4, 0, 0.0, 449.25, 269, 654, 437.0, 654.0, 654.0, 654.0, 0.09395847035610261, 0.16112409564972283, 0.06074268298412101], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 4, 0, 0.0, 320.0, 160, 481, 319.5, 481.0, 481.0, 481.0, 0.03295544423938835, 0.05107450196084893, 0.07411756648760875], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7d231511-479f-4678-bcc1-d3e91676f8e1", 3, 0, 0.0, 2153.6666666666665, 433, 5258, 770.0, 5258.0, 5258.0, 5258.0, 0.018417789128593005, 0.011840863778961973, 0.011810886908635488], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/51fe6213-ade5-4021-83bc-dfa54dd72886", 2, 0, 0.0, 1319.5, 654, 1985, 1319.5, 1985.0, 1985.0, 1985.0, 0.01730418155547288, 0.020075554382716583, 0.010755968320369617], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/de054428-ba47-4124-9dc5-bc0dc9574aaa", 1, 0, 0.0, 375.0, 375, 375, 375.0, 375.0, 375.0, 375.0, 2.6666666666666665, 0.8515625, 1.5911458333333333], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 116.78571428571429, 79, 240, 82.5, 239.5, 240.0, 240.0, 0.08499890715690799, 0.06316813315078806, 0.04266546706899483], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 129.7857142857143, 79, 239, 82.5, 238.5, 239.0, 239.0, 0.08500561644251496, 0.022745643462157322, 0.04847976562737181], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/862ce1c2-9490-40ef-a02d-c692e6c0a6a5", 1, 0, 0.0, 378.0, 378, 378, 378.0, 378.0, 378.0, 378.0, 2.6455026455026456, 0.8448040674603174, 1.5785176917989419], "isController": false}, {"data": ["addBook", 21, 0, 0.0, 23562.095238095237, 688, 62447, 28663.0, 49137.8, 61140.099999999984, 62447.0, 0.10597443492917376, 60.817103895317445, 0.37908628432183933], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 7, 0, 0.0, 111.14285714285715, 80, 281, 82.0, 281.0, 281.0, 281.0, 0.03620489904005296, 0.02690617985300811, 0.018173162213464086], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 7, 0, 0.0, 103.14285714285714, 78, 234, 80.0, 234.0, 234.0, 234.0, 0.03620602261324726, 0.009687939644560304, 0.02064874727161758], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 7, 0, 0.0, 80.99999999999999, 79, 90, 80.0, 90.0, 90.0, 90.0, 0.03620564808110065, 0.00975855358435916, 0.021284961078928313], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=51fe6213-ade5-4021-83bc-dfa54dd72886", 1, 0, 0.0, 14814.0, 14814, 14814, 14814.0, 14814.0, 14814.0, 14814.0, 0.06750371270419872, 0.012195494970973404, 0.04654064567301201], "isController": false}, {"data": ["https://demoqa.com/books-0", 34, 0, 0.0, 202.00000000000003, 79, 356, 237.0, 329.5, 340.25, 356.0, 0.1699269314194896, 0.1262835886818668, 0.08214241313735093], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 7, 0, 0.0, 103.42857142857143, 79, 234, 81.0, 234.0, 234.0, 234.0, 0.03620583534620537, 0.009758604058156916, 0.021320428431408044], "isController": false}, {"data": ["https://demoqa.com/books-3", 34, 0, 0.0, 552.4705882352939, 382, 718, 613.0, 706.0, 709.75, 718.0, 0.16991249506504152, 49.959915174934906, 0.0854540380454066], "isController": false}, {"data": ["https://demoqa.com/books-1", 34, 0, 0.0, 157.11764705882354, 78, 250, 92.5, 242.0, 248.5, 250.0, 0.17016846678211428, 0.3011184197355382, 0.08275771138427043], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 106.85714285714286, 78, 240, 81.5, 238.0, 240.0, 240.0, 0.08500613258527936, 0.022911809173376083, 0.04997430841439276], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 623.6666666666666, 79, 1018, 840.0, 971.8000000000001, 1018.0, 1018.0, 0.08923153799478888, 53.53514672267433, 0.04734616111051623], "isController": false}, {"data": ["https://demoqa.com/books-2", 34, 0, 0.0, 804.7058823529413, 545, 1079, 780.5, 970.0, 1030.25, 1079.0, 0.16965051992894636, 152.6518360458705, 0.0851566086362094], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 103.85714285714286, 78, 238, 81.0, 236.0, 238.0, 238.0, 0.08500458417578947, 0.022911391828630757, 0.050056410408204154], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 432.46666666666664, 80, 706, 467.0, 662.8000000000001, 706.0, 706.0, 0.08923100718012171, 17.499269421128712, 0.0474330191162561], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 1, 0, 0.0, 9812.0, 9812, 9812, 9812.0, 9812.0, 9812.0, 9812.0, 0.10191602119853241, 0.07613843380554423, 0.03622796066041582], "isController": false}, {"data": ["deleteBooks", 4, 0, 0.0, 4154.75, 379, 14814, 713.0, 14814.0, 14814.0, 14814.0, 0.06382028208564682, 0.011530031431488928, 0.04400109292233072], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 76, 0, 0.0, 9408.894736842107, 80, 55109, 1291.5, 32293.199999999997, 37479.5, 55109.0, 0.3229397717325719, 0.9029234016605904, 0.14648147026829497], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 4, 0, 0.0, 16016.000000000002, 83, 28928, 17526.5, 28928.0, 28928.0, 28928.0, 0.022704181542635614, 0.017582437464169962, 0.008070627032733754], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b93d4230-4f83-4ef0-ad16-63cacaab87f2", 1, 0, 0.0, 14375.0, 14375, 14375, 14375.0, 14375.0, 14375.0, 14375.0, 0.06956521739130433, 0.02221467391304348, 0.04150815217391304], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1ade5cb8-d841-412e-8c70-07c5afa6d26f", 1, 0, 0.0, 33690.0, 33690, 33690, 33690.0, 33690.0, 33690.0, 33690.0, 0.029682398337785694, 0.009478656500445236, 0.01771088416444049], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 7, 0, 0.0, 216.28571428571428, 161, 516, 165.0, 516.0, 516.0, 516.0, 0.036189737624402224, 0.056087025009693675, 0.08139156811425617], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 6, 0, 0.0, 85.5, 80, 104, 81.5, 104.0, 104.0, 104.0, 0.05223204958562574, 0.04238753242739745, 0.0185668613761404], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 12, 0, 0.0, 3186.3333333333335, 507, 10377, 1666.0, 9446.100000000002, 10377.0, 10377.0, 0.06017118702709208, 0.03696062171878996, 0.02720630819681995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 135.66666666666666, 79, 262, 83.0, 250.0, 262.0, 262.0, 0.08922888398460505, 0.06631169991434027, 0.04478871715633495], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 156.4, 80, 247, 89.0, 244.6, 247.0, 247.0, 0.08923047637176985, 0.11322278544829391, 0.04589327886308475], "isController": false}, {"data": ["login", 12, 0, 0.0, 26246.5, 2657, 53515, 18137.0, 52590.4, 53515.0, 53515.0, 0.061143381228981955, 0.08872955518190156, 0.0922524648425558], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 4, 0, 0.0, 170.0, 164, 173, 171.5, 173.0, 173.0, 173.0, 0.023279634975323586, 0.03607888740804544, 0.05235644467594748], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 9500.428571428572, 79, 33375, 234.5, 30814.5, 33375.0, 33375.0, 0.08677112257040856, 0.07024732481530147, 0.030844422476199923], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 4, 0, 0.0, 243.75, 161, 472, 171.0, 472.0, 472.0, 472.0, 0.023844154605498463, 0.03695378257707623, 0.05362606255513961], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3068d01b-8c16-42b2-b303-65ceb702e03a", 1, 0, 0.0, 40996.0, 40996, 40996, 40996.0, 40996.0, 40996.0, 40996.0, 0.02439262367060201, 0.007789441347936384, 0.01455458306907991], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 7, 0, 0.0, 4917.714285714285, 81, 28182, 101.0, 28182.0, 28182.0, 28182.0, 0.037343889206015564, 0.030961876890534392, 0.013274585616200846], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 761.2666666666667, 162, 1259, 931.0, 1210.4, 1259.0, 1259.0, 0.08918538073239035, 71.17722078101124, 0.18536740103395585], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 10063.466666666667, 82, 35502, 241.0, 33670.8, 35502.0, 35502.0, 0.08122992943826796, 0.06306425185881155, 0.028874701480009313], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9e2f270f-3c77-47d6-ba32-389d906a3340", 3, 0, 0.0, 3971.0, 269, 10871, 773.0, 10871.0, 10871.0, 10871.0, 0.01891217187381799, 0.01215870424830421, 0.012127922718561668], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e101faf6-88b7-42ad-a278-06183d70d7a3", 1, 0, 0.0, 3950.0, 3950, 3950, 3950.0, 3950.0, 3950.0, 3950.0, 0.25316455696202533, 0.0808445411392405, 0.15105814873417722], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 6, 0, 0.0, 214.5, 161, 319, 163.5, 319.0, 319.0, 319.0, 0.05078720162519045, 0.07871024314372778, 0.11422160678009141], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d73fdfdb-de03-4464-bfec-c1e188489248", 1, 0, 0.0, 3763.0, 3763, 3763, 3763.0, 3763.0, 3763.0, 3763.0, 0.26574541589157585, 0.08486206152006379, 0.15856489170874302], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9e2f270f-3c77-47d6-ba32-389d906a3340", 1, 0, 0.0, 493.0, 493, 493, 493.0, 493.0, 493.0, 493.0, 2.028397565922921, 0.3664585446247465, 1.3984850405679514], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 1, 0, 0.0, 81.0, 81, 81, 81.0, 81.0, 81.0, 81.0, 12.345679012345679, 9.174864969135802, 6.196952160493827], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 1, 0, 0.0, 81.0, 81, 81, 81.0, 81.0, 81.0, 81.0, 12.345679012345679, 3.3034336419753085, 7.040895061728395], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 1, 0, 0.0, 81.0, 81, 81, 81.0, 81.0, 81.0, 81.0, 12.345679012345679, 3.3275462962962963, 7.257908950617284], "isController": false}, {"data": ["register", 13, 0, 0.0, 20906.076923076926, 430, 49981, 24500.0, 49800.6, 49981.0, 49981.0, 0.05979733303894646, 0.019387416571220922, 0.02697887486718092], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 1, 0, 0.0, 78.0, 78, 78, 78.0, 78.0, 78.0, 78.0, 12.82051282051282, 3.4555288461538463, 7.549579326923077], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 640, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
