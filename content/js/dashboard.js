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

    var data = {"OkPercent": 66.44736842105263, "KoPercent": 33.55263157894737};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5089605734767025, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d878cfa8-c95d-4f11-99bd-19b7648cd7a3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=014b5374-cc6c-429f-90a8-85be07eca681"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c4e14b8f-d1eb-4164-a754-365b3987a78f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/abed8222-9d52-4525-8641-4428b58a360e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=69180221-45e3-47cb-b0ab-24dbc185b00f"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/014b5374-cc6c-429f-90a8-85be07eca681"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d878cfa8-c95d-4f11-99bd-19b7648cd7a3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fee31772-f278-4774-a238-98e80ccc622a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c4e14b8f-d1eb-4164-a754-365b3987a78f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/eb9b9192-d3e4-4b8a-af09-4bb37cb173cc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d8af3a0e-de32-4d5f-833a-f697eabbd10b"], "isController": false}, {"data": [0.41304347826086957, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8235294117647058, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a266a8e9-b89b-4f53-bde5-d71e4f153b5a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=abed8222-9d52-4525-8641-4428b58a360e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2019844a-65bd-4939-bf8d-187cabbb402a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/69180221-45e3-47cb-b0ab-24dbc185b00f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e3d8b77d-bb6e-4b7b-930f-59446bae6414"], "isController": false}, {"data": [0.0, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e3d8b77d-bb6e-4b7b-930f-59446bae6414"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9ce21738-2e63-4031-948b-3964a8ac28e8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.6764705882352942, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9226190476190477, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/eb5356fb-1ef7-4770-a824-35e07c8ba638"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9ce21738-2e63-4031-948b-3964a8ac28e8"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2019844a-65bd-4939-bf8d-187cabbb402a"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eb5356fb-1ef7-4770-a824-35e07c8ba638"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ee3f30be-0c1b-41df-b7e7-24875dcec731"], "isController": false}, {"data": [0.717391304347826, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [0.043478260869565216, 500, 1500, "login"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eb9b9192-d3e4-4b8a-af09-4bb37cb173cc"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d8af3a0e-de32-4d5f-833a-f697eabbd10b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fee31772-f278-4774-a238-98e80ccc622a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/dbd0a831-f14b-4100-b457-dbb4be49be14"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dbd0a831-f14b-4100-b457-dbb4be49be14"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a3d4b035-20bf-4c52-b451-9a45d3def867"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a3d4b035-20bf-4c52-b451-9a45d3def867"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "register"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 608, 204, 33.55263157894737, 274.7483552631581, 108, 1991, 119.5, 617.3000000000001, 932.6499999999999, 1502.7399999999996, 2.437958370256908, 2.4957832881061313, 1.1765277776385485], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 54, 100.0, 657.611111111111, 441, 1161, 686.0, 828.5, 946.25, 1161.0, 0.2618562700029095, 1.6842838124939385, 0.43958098450683736], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 18, 100.0, 138.2777777777778, 108, 342, 113.5, 334.8, 342.0, 342.0, 0.08562906440732794, 0.042563665804033125, 0.04298177647008453], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 149.69230769230768, 111, 345, 116.0, 339.8, 345.0, 345.0, 0.093420334013625, 0.07252848197346862, 0.033208009356405756], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d878cfa8-c95d-4f11-99bd-19b7648cd7a3", 3, 0, 0.0, 277.0, 183, 418, 230.0, 418.0, 418.0, 418.0, 0.07851553298960978, 0.03644633790468214, 0.050350130204925535], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 17, 100.0, 171.99999999999997, 110, 447, 115.0, 358.19999999999993, 447.0, 447.0, 0.08507742045261188, 0.042289459971073674, 0.04270487706312744], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=014b5374-cc6c-429f-90a8-85be07eca681", 1, 0, 0.0, 205.0, 205, 205, 205.0, 205.0, 205.0, 205.0, 4.878048780487805, 0.8812881097560976, 3.363185975609756], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c4e14b8f-d1eb-4164-a754-365b3987a78f", 1, 0, 0.0, 433.0, 433, 433, 433.0, 433.0, 433.0, 433.0, 2.3094688221709005, 0.417238019630485, 1.5922704965357968], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/abed8222-9d52-4525-8641-4428b58a360e", 3, 0, 0.0, 544.3333333333334, 271, 931, 431.0, 931.0, 931.0, 931.0, 0.019440754301266887, 0.022978313433561222, 0.012466889965330656], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=69180221-45e3-47cb-b0ab-24dbc185b00f", 1, 0, 0.0, 224.0, 224, 224, 224.0, 224.0, 224.0, 224.0, 4.464285714285714, 0.8065359933035714, 3.077915736607143], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 193.33333333333334, 114, 344, 122.0, 344.0, 344.0, 344.0, 0.018943699325604302, 0.005586911324543456, 0.011710314133894067], "isController": false}, {"data": ["https://demoqa.com/books", 54, 54, 100.0, 204.2222222222222, 108, 802, 116.0, 466.0, 518.0, 802.0, 0.2561038074099369, 0.12730159958169712, 0.12380018033976438], "isController": false}, {"data": ["deleteBook", 17, 3, 17.647058823529413, 438.94117647058823, 115, 977, 424.0, 796.1999999999998, 977.0, 977.0, 0.09557273366127898, 0.019193605059732957, 0.06415253865073788], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 3, 17.647058823529413, 438.94117647058823, 115, 977, 424.0, 796.1999999999998, 977.0, 977.0, 0.0978777794410603, 0.01965652096311735, 0.06569978474085418], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 27, 8, 29.62962962962963, 848.1111111111112, 255, 1991, 762.0, 1532.3999999999999, 1905.7999999999995, 1991.0, 0.10857326684896253, 0.034070517331510376, 0.04898520437912176], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/014b5374-cc6c-429f-90a8-85be07eca681", 3, 0, 0.0, 314.6666666666667, 191, 478, 275.0, 478.0, 478.0, 478.0, 0.05802146794313896, 0.026253203268542694, 0.03720777729426555], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d878cfa8-c95d-4f11-99bd-19b7648cd7a3", 1, 0, 0.0, 210.0, 210, 210, 210.0, 210.0, 210.0, 210.0, 4.761904761904763, 0.8603050595238095, 3.283110119047619], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fee31772-f278-4774-a238-98e80ccc622a", 1, 0, 0.0, 473.0, 473, 473, 473.0, 473.0, 473.0, 473.0, 2.1141649048625792, 0.3819536205073996, 1.457617600422833], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c4e14b8f-d1eb-4164-a754-365b3987a78f", 3, 0, 0.0, 314.0, 200, 497, 245.0, 497.0, 497.0, 497.0, 0.04424582983053847, 0.02844580531097444, 0.028373790613984633], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eb9b9192-d3e4-4b8a-af09-4bb37cb173cc", 3, 0, 0.0, 704.3333333333334, 202, 1490, 421.0, 1490.0, 1490.0, 1490.0, 0.04151042603533921, 0.0266872042382145, 0.02661964169583927], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 118.0, 112, 125, 116.0, 125.0, 125.0, 125.0, 0.02472016770161769, 0.019457475749515483, 0.008787247112684412], "isController": false}, {"data": ["deleteAccount", 17, 3, 17.647058823529413, 442.1176470588236, 111, 977, 421.0, 887.3999999999999, 977.0, 977.0, 0.0952226248956752, 0.022520194548224657, 0.06338693573593086], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d8af3a0e-de32-4d5f-833a-f697eabbd10b", 1, 0, 0.0, 400.0, 400, 400, 400.0, 400.0, 400.0, 400.0, 2.5, 0.45166015625, 1.7236328125], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1097.0434782608695, 658, 1669, 1079.0, 1548.8, 1645.1999999999996, 1669.0, 0.10287099529924279, 0.053243776863865895, 0.047316639439397803], "isController": false}, {"data": ["goToProfile", 17, 3, 17.647058823529413, 211.76470588235293, 111, 374, 204.0, 363.59999999999997, 374.0, 374.0, 0.09590594447609968, 0.15462409453505363, 0.060563766522619696], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 5, 100.0, 113.8, 109, 117, 114.0, 117.0, 117.0, 117.0, 0.025136743886743886, 0.012494729139016248, 0.01261746714627574], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a266a8e9-b89b-4f53-bde5-d71e4f153b5a", 1, 0, 0.0, 211.0, 211, 211, 211.0, 211.0, 211.0, 211.0, 4.739336492890995, 1.5134404620853081, 2.827865817535545], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=abed8222-9d52-4525-8641-4428b58a360e", 1, 0, 0.0, 713.0, 713, 713, 713.0, 713.0, 713.0, 713.0, 1.402524544179523, 0.2533857819074334, 0.9669749298737729], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2019844a-65bd-4939-bf8d-187cabbb402a", 3, 0, 0.0, 334.6666666666667, 215, 415, 374.0, 415.0, 415.0, 415.0, 0.017907133605123828, 0.021165625690170775, 0.011483415755889955], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/69180221-45e3-47cb-b0ab-24dbc185b00f", 3, 0, 0.0, 338.3333333333333, 219, 491, 305.0, 491.0, 491.0, 491.0, 0.07398638650488311, 0.03347691316464437, 0.04744569707507152], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e3d8b77d-bb6e-4b7b-930f-59446bae6414", 3, 0, 0.0, 282.0, 204, 437, 205.0, 437.0, 437.0, 437.0, 0.04679238220017781, 0.03063134134262942, 0.03000683363748382], "isController": false}, {"data": ["addBook", 57, 57, 100.0, 674.9298245614033, 458, 2038, 610.0, 826.6, 1027.5999999999997, 2038.0, 0.2689605382985651, 0.9141699957414582, 0.5244979329556876], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e3d8b77d-bb6e-4b7b-930f-59446bae6414", 1, 0, 0.0, 728.0, 728, 728, 728.0, 728.0, 728.0, 728.0, 1.3736263736263736, 0.24816492101648352, 0.9470509958791209], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9ce21738-2e63-4031-948b-3964a8ac28e8", 3, 0, 0.0, 260.6666666666667, 189, 387, 206.0, 387.0, 387.0, 387.0, 0.04702857769904845, 0.030234844061074448, 0.03015830015205907], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 143.64705882352942, 111, 347, 118.0, 331.8, 347.0, 347.0, 0.08727168187931866, 0.06519808265398318, 0.031022355668039056], "isController": false}, {"data": ["deleteBooks", 17, 3, 17.647058823529413, 418.94117647058823, 114, 728, 404.0, 716.0, 728.0, 728.0, 0.09783159154735048, 0.019647245177478016, 0.06621953373175729], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 12, 7.142857142857143, 184.33928571428572, 110, 1478, 121.0, 345.2, 443.1499999999994, 805.2500000000023, 0.6961364427427776, 1.5393205405313013, 0.33368272882377803], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eb5356fb-1ef7-4770-a824-35e07c8ba638", 3, 0, 0.0, 318.0, 199, 546, 209.0, 546.0, 546.0, 546.0, 0.04113477122211406, 0.026445694389217206, 0.026378743264181215], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 6, 0, 0.0, 152.66666666666666, 111, 345, 114.5, 345.0, 345.0, 345.0, 0.037241867307226784, 0.02884062575647543, 0.01323832001936577], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9ce21738-2e63-4031-948b-3964a8ac28e8", 1, 0, 0.0, 455.0, 455, 455, 455.0, 455.0, 455.0, 455.0, 2.197802197802198, 0.39706387362637363, 1.5152815934065933], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2019844a-65bd-4939-bf8d-187cabbb402a", 1, 0, 0.0, 620.0, 620, 620, 620.0, 620.0, 620.0, 620.0, 1.6129032258064515, 0.2913936491935484, 1.1120211693548387], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 13, 100.0, 114.15384615384615, 108, 119, 115.0, 118.6, 119.0, 119.0, 0.07070712564656227, 0.035146413041113475, 0.03549166267805958], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eb5356fb-1ef7-4770-a824-35e07c8ba638", 1, 0, 0.0, 404.0, 404, 404, 404.0, 404.0, 404.0, 404.0, 2.4752475247524752, 0.44718827351485146, 1.7065671410891088], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 160.68749999999997, 110, 351, 117.0, 346.1, 351.0, 351.0, 0.09583076287276669, 0.07776891010475499, 0.034064841489928784], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ee3f30be-0c1b-41df-b7e7-24875dcec731", 1, 0, 0.0, 185.0, 185, 185, 185.0, 185.0, 185.0, 185.0, 5.405405405405405, 1.7261402027027026, 3.2252956081081083], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 555.217391304348, 112, 1375, 529.0, 1168.8000000000006, 1367.6, 1375.0, 0.1023341075131032, 0.0628595250251386, 0.04627020681500663], "isController": false}, {"data": ["login", 23, 7, 30.434782608695652, 1933.3043478260872, 1081, 3628, 1843.0, 2794.400000000001, 3515.1999999999985, 3628.0, 0.10441161783532017, 0.1571671482463388, 0.15641793104974533], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 6, 6, 100.0, 114.33333333333334, 110, 117, 115.0, 117.0, 117.0, 117.0, 0.037287229745266076, 0.018534374941738704, 0.01871644149322926], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 155.16666666666669, 112, 350, 118.0, 332.0, 350.0, 350.0, 0.08675660434650588, 0.07023557129223962, 0.03083926170129701], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eb9b9192-d3e4-4b8a-af09-4bb37cb173cc", 1, 0, 0.0, 599.0, 599, 599, 599.0, 599.0, 599.0, 599.0, 1.669449081803005, 0.3016094532554257, 1.1510068864774625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 13, 100.0, 146.15384615384613, 110, 331, 114.0, 327.8, 331.0, 331.0, 0.09192281312092093, 0.04569210144389527, 0.04614094330483726], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d8af3a0e-de32-4d5f-833a-f697eabbd10b", 3, 0, 0.0, 306.3333333333333, 204, 420, 295.0, 420.0, 420.0, 420.0, 0.02690317547147815, 0.026981993368367246, 0.017252361874613268], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fee31772-f278-4774-a238-98e80ccc622a", 3, 0, 0.0, 493.0, 253, 865, 361.0, 865.0, 865.0, 865.0, 0.026171387694213503, 0.026418448320233098, 0.016783083905468947], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 151.84615384615384, 110, 338, 119.0, 337.6, 338.0, 338.0, 0.07349906430037371, 0.06093818905372782, 0.02612662051302347], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 23, 23, 100.0, 133.43478260869566, 109, 572, 114.0, 117.6, 481.1999999999987, 572.0, 0.13242059082613175, 0.06582234446337995, 0.06646892937952317], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 23, 0, 0.0, 165.0, 111, 348, 118.0, 342.4, 347.2, 348.0, 0.1314586191129401, 0.10206015839334705, 0.04672943101280293], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dbd0a831-f14b-4100-b457-dbb4be49be14", 3, 0, 0.0, 474.66666666666663, 214, 977, 233.0, 977.0, 977.0, 977.0, 0.016275070389679437, 0.022436498405043102, 0.010436812717340004], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dbd0a831-f14b-4100-b457-dbb4be49be14", 1, 0, 0.0, 708.0, 708, 708, 708.0, 708.0, 708.0, 708.0, 1.4124293785310735, 0.255175229519774, 0.9738038488700566], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 13, 100.0, 113.76923076923077, 111, 117, 114.0, 116.6, 117.0, 117.0, 0.06335406148267998, 0.03149142313933995, 0.036074503157956295], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 16, 100.0, 114.81250000000001, 109, 136, 114.5, 122.00000000000001, 136.0, 136.0, 0.10076645484718137, 0.05008801320040559, 0.05058003690571409], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a3d4b035-20bf-4c52-b451-9a45d3def867", 1, 0, 0.0, 370.0, 370, 370, 370.0, 370.0, 370.0, 370.0, 2.7027027027027026, 0.48828125, 1.8633868243243243], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a3d4b035-20bf-4c52-b451-9a45d3def867", 3, 0, 0.0, 273.0, 194, 395, 230.0, 395.0, 395.0, 395.0, 0.06881838827334663, 0.04280987629894707, 0.04413158362581148], "isController": false}, {"data": ["register", 27, 8, 29.62962962962963, 848.1111111111112, 255, 1991, 762.0, 1532.3999999999999, 1905.7999999999995, 1991.0, 0.10449927431059507, 0.03279208998548621, 0.04714713352685051], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 3.9215686274509802, 1.3157894736842106], "isController": false}, {"data": ["401/Unauthorized", 18, 8.823529411764707, 2.960526315789474], "isController": false}, {"data": ["404/Not Found", 178, 87.25490196078431, 29.276315789473685], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 608, 204, "404/Not Found", 178, "401/Unauthorized", 18, "406/Not Acceptable", 8, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 18, "404/Not Found", 18, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 17, "404/Not Found", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/books", 54, 54, "404/Not Found", 54, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 27, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 5, "404/Not Found", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 13, "404/Not Found", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 6, 6, "404/Not Found", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 13, "404/Not Found", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 23, 23, "404/Not Found", 23, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 13, "404/Not Found", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 16, "404/Not Found", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
