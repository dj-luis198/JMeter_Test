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

    var data = {"OkPercent": 96.69992325402916, "KoPercent": 3.3000767459708364};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7496744791666666, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.14814814814814814, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1259db06-4c6b-4485-97e9-a97642ca593b"], "isController": false}, {"data": [0.42105263157894735, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.42105263157894735, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/81bdd1b3-69be-4782-a6fa-622c4c7f830f"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f987f838-6164-4822-9cd6-ad302200a247"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=860384a1-80fb-497f-8c10-8c500cc741db"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d82e1daa-5539-4d57-95db-d2894f49d0fa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b5c1411a-9a7d-4332-82b7-56828fe12df4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9aa50b45-dfda-43bc-861b-76eafa20bb69"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.65625, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b5c1411a-9a7d-4332-82b7-56828fe12df4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a5be76ba-455c-4329-a030-9f613ec3a69d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6458333333333334, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.020833333333333332, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/90783924-5149-49f1-a0c4-a4832f248c6c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e579ad01-f0ee-4289-8419-314546a1eff7"], "isController": false}, {"data": [0.65625, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2647058823529412, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/880d41f8-05a5-4986-9eb3-64b26de810f5"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/e7daf21a-200c-4723-b60a-7f48b03cd081"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/481aef21-0536-4427-883b-976920a8392a"], "isController": false}, {"data": [0.2692307692307692, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f74efe83-7494-421a-bf84-1d47c16dded3"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2692307692307692, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5588235294117647, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.2708333333333333, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1259db06-4c6b-4485-97e9-a97642ca593b"], "isController": false}, {"data": [0.24107142857142858, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/860384a1-80fb-497f-8c10-8c500cc741db"], "isController": false}, {"data": [0.9907407407407407, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f987f838-6164-4822-9cd6-ad302200a247"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.48148148148148145, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9006024096385542, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a5be76ba-455c-4329-a030-9f613ec3a69d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=69ea77f2-34a4-467c-a0e4-4ab75bb08c5d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f74efe83-7494-421a-bf84-1d47c16dded3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/69ea77f2-34a4-467c-a0e4-4ab75bb08c5d"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d82e1daa-5539-4d57-95db-d2894f49d0fa"], "isController": false}, {"data": [0.85, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=90783924-5149-49f1-a0c4-a4832f248c6c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=481aef21-0536-4427-883b-976920a8392a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e7daf21a-200c-4723-b60a-7f48b03cd081"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=81bdd1b3-69be-4782-a6fa-622c4c7f830f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=880d41f8-05a5-4986-9eb3-64b26de810f5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/e579ad01-f0ee-4289-8419-314546a1eff7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1303, 43, 3.3000767459708364, 371.95241749808093, 100, 2874, 122.0, 1004.6000000000001, 1199.8, 1768.6800000000003, 5.200870137904883, 748.2893249071986, 3.793432834983136], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 1695.6111111111113, 1240, 2351, 1654.5, 2066.5, 2227.5, 2351.0, 0.2330901713644408, 280.4838829881944, 1.1461025515819916], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1259db06-4c6b-4485-97e9-a97642ca593b", 1, 0, 0.0, 424.0, 424, 424, 424.0, 424.0, 424.0, 424.0, 2.3584905660377355, 0.4260944870283019, 1.626068691037736], "isController": false}, {"data": ["deleteBook", 19, 5, 26.31578947368421, 548.6842105263158, 103, 2154, 534.0, 1092.0, 2154.0, 2154.0, 0.1004690317429262, 0.021172030743523713, 0.06702238707809617], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 19, 5, 26.31578947368421, 548.6842105263158, 103, 2154, 534.0, 1092.0, 2154.0, 2154.0, 0.09986439466408771, 0.02104461441831618, 0.0666190367159331], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 154.43749999999997, 100, 315, 104.0, 308.0, 315.0, 315.0, 0.07001146437729178, 0.01873353636658003, 0.03992841327767422], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 126.37499999999999, 102, 461, 103.0, 216.00000000000026, 461.0, 461.0, 0.07000901366050878, 0.052028183003561705, 0.035141243185060074], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 142.0, 101, 306, 103.5, 306.0, 306.0, 306.0, 0.07001115802831076, 0.018870194937318136, 0.041227273721749405], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 140.43749999999997, 100, 304, 103.0, 304.0, 304.0, 304.0, 0.07001115802831076, 0.018870194937318136, 0.04115890345023738], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/81bdd1b3-69be-4782-a6fa-622c4c7f830f", 3, 0, 0.0, 516.3333333333334, 193, 1013, 343.0, 1013.0, 1013.0, 1013.0, 0.05975500448162534, 0.027037583408027088, 0.03831945274375062], "isController": false}, {"data": ["goToProfile", 19, 5, 26.31578947368421, 194.10526315789477, 101, 343, 198.0, 280.0, 343.0, 343.0, 0.10059563203176705, 0.13849995863666445, 0.06500765221707479], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f987f838-6164-4822-9cd6-ad302200a247", 3, 0, 0.0, 350.0, 220, 507, 323.0, 507.0, 507.0, 507.0, 0.04954746647288102, 0.03243488120994913, 0.03177360317434102], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=860384a1-80fb-497f-8c10-8c500cc741db", 1, 0, 0.0, 469.0, 469, 469, 469.0, 469.0, 469.0, 469.0, 2.1321961620469083, 0.3852112206823028, 1.4700493070362475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 13, 0, 0.0, 105.07692307692308, 102, 114, 103.0, 113.6, 114.0, 114.0, 0.08376666473358979, 0.06225237486549006, 0.042046939133852684], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 9, 0, 0.0, 719.3333333333333, 509, 912, 805.0, 912.0, 912.0, 912.0, 0.04771346473974956, 14.029342869620306, 0.02721158535938842], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 13, 0, 0.0, 158.46153846153845, 100, 410, 103.0, 369.59999999999997, 410.0, 410.0, 0.08376774426352045, 0.041770604448711585, 0.046691456012268755], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 9, 0, 0.0, 946.5555555555555, 698, 1110, 996.0, 1110.0, 1110.0, 1110.0, 0.04768641414061134, 42.90831926749694, 0.027149589300758212], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 9, 0, 0.0, 243.0, 103, 317, 305.0, 317.0, 317.0, 317.0, 0.04789170090036398, 0.0847458613588472, 0.02651815860401013], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 7, 0, 0.0, 103.28571428571429, 102, 106, 103.0, 106.0, 106.0, 106.0, 0.03756957079448908, 0.02792035485801386, 0.018858163465202527], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d82e1daa-5539-4d57-95db-d2894f49d0fa", 1, 0, 0.0, 980.0, 980, 980, 980.0, 980.0, 980.0, 980.0, 1.0204081632653061, 0.18435108418367346, 0.7035235969387755], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 7, 0, 0.0, 131.28571428571428, 102, 304, 103.0, 304.0, 304.0, 304.0, 0.03752988987658027, 0.010042177564631832, 0.02140376532023719], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 7, 0, 0.0, 131.57142857142858, 101, 305, 102.0, 305.0, 305.0, 305.0, 0.0375705790162949, 0.010126445125485734, 0.02208739117950149], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b5c1411a-9a7d-4332-82b7-56828fe12df4", 3, 0, 0.0, 619.6666666666667, 189, 1477, 193.0, 1477.0, 1477.0, 1477.0, 0.03049648273899077, 0.025423662856300572, 0.019556663735615827], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 7, 0, 0.0, 159.7142857142857, 100, 305, 103.0, 305.0, 305.0, 305.0, 0.037530091090892524, 0.010115532364342124, 0.022100239187312683], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9aa50b45-dfda-43bc-861b-76eafa20bb69", 1, 0, 0.0, 195.0, 195, 195, 195.0, 195.0, 195.0, 195.0, 5.128205128205129, 1.6376201923076923, 3.059895833333333], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 9, 0, 0.0, 126.11111111111111, 101, 302, 104.0, 302.0, 302.0, 302.0, 0.04789093637423042, 0.0355908228328021, 0.02689188321795165], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 696.6875000000001, 100, 1508, 902.0, 1508.0, 1508.0, 1508.0, 0.10073346554600687, 50.99696250236094, 0.054350820033367955], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 13, 0, 0.0, 257.5384615384615, 102, 1003, 104.0, 1000.2, 1003.0, 1003.0, 0.08376774426352045, 11.61516041120297, 0.04813876529566792], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 505.9374999999999, 102, 1014, 606.5, 876.8000000000002, 1014.0, 1014.0, 0.1007328313480571, 16.67245175448261, 0.05444884975698204], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 13, 0, 0.0, 219.53846153846155, 100, 808, 103.0, 767.1999999999999, 808.0, 808.0, 0.08376774426352045, 3.808411892442216, 0.04822056973342526], "isController": false}, {"data": ["deleteBooks", 18, 4, 22.22222222222222, 389.0555555555556, 105, 980, 354.5, 944.0, 980.0, 980.0, 0.09745216722791895, 0.020080475864346584, 0.06564486264658431], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b5c1411a-9a7d-4332-82b7-56828fe12df4", 1, 0, 0.0, 716.0, 716, 716, 716.0, 716.0, 716.0, 716.0, 1.3966480446927374, 0.2523241096368715, 0.9629233589385475], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a5be76ba-455c-4329-a030-9f613ec3a69d", 1, 0, 0.0, 420.0, 420, 420, 420.0, 420.0, 420.0, 420.0, 2.3809523809523814, 0.43015252976190477, 1.6415550595238095], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 7, 0, 0.0, 265.0, 205, 409, 210.0, 409.0, 409.0, 409.0, 0.03750837240455459, 0.05813065137307435, 0.08435720864032151], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 642.7500000000001, 129, 1134, 622.0, 1075.5, 1123.25, 1134.0, 0.11219776726443144, 0.06891835508723376, 0.05073004515960133], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 104.12499999999999, 102, 115, 103.0, 108.7, 115.0, 115.0, 0.10086300912179838, 0.07495776361493024, 0.050628502625590203], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 204.87499999999997, 101, 313, 207.5, 309.5, 313.0, 313.0, 0.10086555252258443, 0.11220553956766502, 0.052759874579989534], "isController": false}, {"data": ["login", 24, 0, 0.0, 2869.7916666666665, 1252, 4405, 3067.0, 3799.5, 4254.0, 4405.0, 0.10994800375655679, 49.47240079626406, 0.23425689179283965], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 13, 0, 0.0, 123.53846153846155, 103, 306, 106.0, 235.59999999999994, 306.0, 306.0, 0.07816022846836014, 0.06327620058620172, 0.027783518713362394], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/90783924-5149-49f1-a0c4-a4832f248c6c", 3, 0, 0.0, 314.0, 202, 472, 268.0, 472.0, 472.0, 472.0, 0.0646426339718589, 0.029249108470339805, 0.041453772436380876], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e579ad01-f0ee-4289-8419-314546a1eff7", 1, 0, 0.0, 256.0, 256, 256, 256.0, 256.0, 256.0, 256.0, 3.90625, 0.705718994140625, 2.69317626953125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 815.5625000000002, 206, 1613, 1006.0, 1611.6, 1613.0, 1613.0, 0.10066628497366947, 67.81118489919216, 0.2119128520960608], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 332.4375, 205, 765, 313.5, 522.8000000000002, 765.0, 765.0, 0.06997686389937327, 0.10845047168779823, 0.15737960699243814], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 17, 8, 47.05882352941177, 616.4117647058824, 101, 1299, 800.0, 1231.8, 1299.0, 1299.0, 0.08236952908855694, 52.17997999510628, 0.12384765937292562], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/880d41f8-05a5-4986-9eb3-64b26de810f5", 3, 0, 0.0, 300.6666666666667, 190, 465, 247.0, 465.0, 465.0, 465.0, 0.061340912343836256, 0.028434068742715767, 0.039336457460077294], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e7daf21a-200c-4723-b60a-7f48b03cd081", 3, 0, 0.0, 908.0, 266, 1886, 572.0, 1886.0, 1886.0, 1886.0, 0.02544140843637104, 0.025515943812649468, 0.01631496569650096], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/481aef21-0536-4427-883b-976920a8392a", 3, 0, 0.0, 526.6666666666666, 211, 967, 402.0, 967.0, 967.0, 967.0, 0.02586206896551724, 0.025937836745689655, 0.01658472521551724], "isController": false}, {"data": ["register", 26, 10, 38.46153846153846, 978.8846153846149, 120, 1850, 1015.5, 1577.2000000000003, 1838.8, 1850.0, 0.10279239494419559, 0.03193730059263769, 0.04637703756271324], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f74efe83-7494-421a-bf84-1d47c16dded3", 1, 0, 0.0, 415.0, 415, 415, 415.0, 415.0, 415.0, 415.0, 2.4096385542168677, 0.4353350903614458, 1.6613328313253013], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 13, 0, 0.0, 403.0, 206, 1105, 225.0, 1103.0, 1105.0, 1105.0, 0.08371110653204203, 15.517097440130462, 0.18497312189303008], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 20, 0, 0.0, 106.84999999999998, 102, 115, 105.5, 111.9, 114.85, 115.0, 0.12375318664455609, 0.09607791345939658, 0.043990390565057054], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 20, 0, 0.0, 340.74999999999994, 207, 619, 408.0, 590.9000000000004, 618.55, 619.0, 0.121056581846355, 0.18761405799820838, 0.27225908983608943], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 143.8, 103, 306, 104.0, 305.7, 306.0, 306.0, 0.054007344998919855, 0.04013631791423634, 0.02710915559516094], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 122.4, 100, 303, 103.0, 283.1000000000001, 303.0, 303.0, 0.05400792836388382, 0.01445134020674235, 0.03080139664502749], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 123.1, 101, 306, 103.0, 285.9000000000001, 306.0, 306.0, 0.054007636679826526, 0.014556745823859494, 0.031750583282476146], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 143.5, 101, 306, 103.0, 305.8, 306.0, 306.0, 0.054007636679826526, 0.014556745823859494, 0.03180332511517129], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 108.0, 105, 113, 107.0, 113.0, 113.0, 113.0, 0.040507559723333364, 0.011946565465279958, 0.02504031768053713], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1158.1296296296293, 807, 1927, 1020.0, 1635.0, 1808.25, 1927.0, 0.23679329261073376, 283.2871006305718, 0.4675742555262731], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 10, 38.46153846153846, 978.8846153846149, 120, 1850, 1015.5, 1577.2000000000003, 1838.8, 1850.0, 0.10456422857740366, 0.032487804191416884, 0.047176439065195794], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 154.625, 102, 309, 104.0, 309.0, 309.0, 309.0, 0.04027224034473038, 0.01085462728041561, 0.023715000906125407], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 128.125, 101, 308, 102.0, 308.0, 308.0, 308.0, 0.04027264581214824, 0.010854736566555582, 0.023675910916907465], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 20, 0, 0.0, 325.8, 100, 1113, 104.0, 1091.8000000000004, 1112.75, 1113.0, 0.12156502817269528, 21.9030976668632, 0.06937754146887024], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 20, 0, 0.0, 274.04999999999995, 101, 807, 104.0, 803.5, 806.85, 807.0, 0.12156428927438276, 7.174999772066958, 0.06949583490353874], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 128.375, 102, 308, 102.0, 308.0, 308.0, 308.0, 0.04027264581214824, 0.01077607905520373, 0.0229679933147408], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 20, 0, 0.0, 124.2, 102, 308, 103.0, 286.7000000000004, 307.9, 308.0, 0.12156428927438276, 0.09034221107207548, 0.06101957488968041], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 154.75, 102, 308, 104.5, 308.0, 308.0, 308.0, 0.040272443077418736, 0.029929032404214514, 0.020214878654094954], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 20, 0, 0.0, 153.25, 101, 308, 103.0, 304.0, 307.8, 308.0, 0.12156428927438276, 0.06904471742380959, 0.06728773355539078], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 107.75, 103, 120, 106.5, 120.0, 120.0, 120.0, 0.041096875610031745, 0.03234773607586483, 0.014608655002003472], "isController": false}, {"data": ["deleteAccount", 17, 3, 17.647058823529413, 591.1176470588235, 102, 1477, 507.0, 1333.8, 1477.0, 1477.0, 0.09430403621274991, 0.018483764450706725, 0.06417311655424146], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1537.375, 810, 2874, 1428.5, 2455.5, 2795.5, 2874.0, 0.10936780849696731, 0.056606385257219415, 0.05030491972858555], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 310.50000000000006, 206, 618, 209.0, 618.0, 618.0, 618.0, 0.04025116728385123, 0.06238144773385928, 0.09052581860811464], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1259db06-4c6b-4485-97e9-a97642ca593b", 3, 0, 0.0, 418.33333333333337, 244, 711, 300.0, 711.0, 711.0, 711.0, 0.029937430769691346, 0.030025138086399426, 0.019198157101657534], "isController": false}, {"data": ["addBook", 56, 16, 28.571428571428573, 1018.375, 520, 2115, 845.0, 1873.2, 2074.55, 2115.0, 0.2656130681629536, 86.25903429046923, 0.9622822773237586], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/860384a1-80fb-497f-8c10-8c500cc741db", 3, 0, 0.0, 584.6666666666667, 226, 1298, 230.0, 1298.0, 1298.0, 1298.0, 0.027197563098346388, 0.027277243458986074, 0.017441145606686973], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 194.85185185185188, 102, 549, 105.0, 416.0, 423.0, 549.0, 0.2379535990481856, 0.17683856335514575, 0.1150263979773944], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 639.5185185185187, 501, 924, 606.0, 817.5, 914.25, 924.0, 0.2377995613919201, 69.92096673778636, 0.11959645909847544], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f987f838-6164-4822-9cd6-ad302200a247", 1, 0, 0.0, 940.0, 940, 940, 940.0, 940.0, 940.0, 940.0, 1.0638297872340425, 0.19219581117021278, 0.7334607712765958], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 158.05555555555557, 100, 316, 107.5, 307.0, 309.25, 316.0, 0.2381172859920892, 0.42135597872818914, 0.11580313322662152], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 959.592592592593, 701, 1620, 909.5, 1209.5, 1310.5, 1620.0, 0.23726981532499375, 213.49579690527662, 0.1190983252705535], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 20, 0, 0.0, 107.7, 103, 117, 106.5, 116.50000000000001, 117.0, 117.0, 0.12371720720776451, 0.09242545265033188, 0.04397760099963503], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 166, 16, 9.63855421686747, 159.6746987951807, 102, 811, 108.0, 310.0, 373.95000000000016, 589.9000000000042, 0.6894346220776902, 1.596864655884906, 0.3285749106019263], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 106.4, 104, 110, 106.0, 109.8, 110.0, 110.0, 0.055118283837114444, 0.04268437410432789, 0.019592827457724275], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a5be76ba-455c-4329-a030-9f613ec3a69d", 3, 0, 0.0, 391.66666666666663, 191, 688, 296.0, 688.0, 688.0, 688.0, 0.03168132808127316, 0.02622578688498622, 0.020316476666701867], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=69ea77f2-34a4-467c-a0e4-4ab75bb08c5d", 1, 0, 0.0, 257.0, 257, 257, 257.0, 257.0, 257.0, 257.0, 3.8910505836575875, 0.7029730058365758, 2.6826969844357977], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 134.8125, 103, 308, 107.5, 306.6, 308.0, 308.0, 0.07416643875938089, 0.06018780332914602, 0.02636385127774868], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f74efe83-7494-421a-bf84-1d47c16dded3", 3, 0, 0.0, 442.6666666666667, 217, 583, 528.0, 583.0, 583.0, 583.0, 0.03392705682782019, 0.03402645250212044, 0.021756608707944585], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/69ea77f2-34a4-467c-a0e4-4ab75bb08c5d", 3, 0, 0.0, 398.3333333333333, 198, 531, 466.0, 531.0, 531.0, 531.0, 0.08284546559151662, 0.03748541574616149, 0.05312681224455981], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 288.3, 206, 610, 208.0, 610.0, 610.0, 610.0, 0.053977318730669376, 0.08365430158747295, 0.12139625491868317], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d82e1daa-5539-4d57-95db-d2894f49d0fa", 3, 0, 0.0, 299.0, 214, 403, 280.0, 403.0, 403.0, 403.0, 0.031425458811698656, 0.03151752558556105, 0.02015239383432498], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 20, 0, 0.0, 471.4000000000001, 206, 1216, 312.0, 1195.8000000000004, 1215.8, 1216.0, 0.12148749286260979, 29.218880978703243, 0.2670114760122945], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=90783924-5149-49f1-a0c4-a4832f248c6c", 1, 0, 0.0, 321.0, 321, 321, 321.0, 321.0, 321.0, 321.0, 3.115264797507788, 0.5628163940809968, 2.1478290498442365], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=481aef21-0536-4427-883b-976920a8392a", 1, 0, 0.0, 532.0, 532, 532, 532.0, 532.0, 532.0, 532.0, 1.8796992481203008, 0.339594102443609, 1.2959645206766917], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e7daf21a-200c-4723-b60a-7f48b03cd081", 1, 0, 0.0, 388.0, 388, 388, 388.0, 388.0, 388.0, 388.0, 2.577319587628866, 0.46562902706185566, 1.7769410438144329], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 7, 0, 0.0, 108.42857142857143, 104, 122, 107.0, 122.0, 122.0, 122.0, 0.038937777431664204, 0.03228337210887003, 0.013841163071411883], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=81bdd1b3-69be-4782-a6fa-622c4c7f830f", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 0.7140872035573123, 2.7251111660079053], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=880d41f8-05a5-4986-9eb3-64b26de810f5", 1, 0, 0.0, 200.0, 200, 200, 200.0, 200.0, 200.0, 200.0, 5.0, 0.9033203125, 3.447265625], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 108.49999999999999, 103, 120, 107.0, 117.2, 120.0, 120.0, 0.10134086633773111, 0.07867772337743772, 0.036023511080990354], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e579ad01-f0ee-4289-8419-314546a1eff7", 3, 0, 0.0, 468.3333333333333, 195, 684, 526.0, 684.0, 684.0, 684.0, 0.05910864168341412, 0.026745121074201048, 0.03790495576703314], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 20, 0, 0.0, 124.35, 102, 307, 104.0, 286.2000000000004, 306.95, 307.0, 0.12113283426605616, 0.0900215692153015, 0.06080300469995397], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 20, 0, 0.0, 194.1, 101, 313, 104.5, 309.7, 312.85, 313.0, 0.12128268568379177, 0.032452593630233346, 0.0691690316790375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 20, 0, 0.0, 154.8, 101, 314, 104.0, 308.8, 313.75, 314.0, 0.12128268568379177, 0.0326894738757095, 0.0713009538883229], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 20, 0, 0.0, 173.7, 101, 311, 103.5, 306.9, 310.8, 311.0, 0.12128489214740966, 0.03269006858660651, 0.07142069332508595], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 10, 23.25581395348837, 0.7674597083653109], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 5, 11.627906976744185, 0.3837298541826554], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 6.976744186046512, 0.23023791250959325], "isController": false}, {"data": ["401/Unauthorized", 25, 58.13953488372093, 1.918649270913277], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1303, 43, "401/Unauthorized", 25, "406/Not Acceptable", 10, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 19, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 17, 8, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 10, "406/Not Acceptable", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 166, 16, "401/Unauthorized", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
