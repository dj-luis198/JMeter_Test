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

    var data = {"OkPercent": 65.79804560260587, "KoPercent": 34.20195439739414};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5011904761904762, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fe5a2824-90bc-4322-929d-932554eb3247"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=30cd0b32-0a97-4ff3-a9a2-985135299e98"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/aa1ae656-062e-4f96-b495-78987a9a9fed"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.65625, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.65625, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/30cd0b32-0a97-4ff3-a9a2-985135299e98"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.65625, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.45652173913043476, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8235294117647058, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=aa1ae656-062e-4f96-b495-78987a9a9fed"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3a192594-65f7-4430-8c7f-362d12ccf3c5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5e25c247-203c-4289-96d1-6b7ba0973e6d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=aa9c4555-3a74-4c1b-8493-26357b989156"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/aa9c4555-3a74-4c1b-8493-26357b989156"], "isController": false}, {"data": [0.0, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/678a3691-beb5-4d5c-9db4-b768178b304a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fe5a2824-90bc-4322-929d-932554eb3247"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.84375, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=717e0d5a-5690-406a-beb2-8ef17cbbcae0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=11b138d4-5fd1-4331-9e97-04a928bea723"], "isController": false}, {"data": [0.8830409356725146, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5e25c247-203c-4289-96d1-6b7ba0973e6d"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/717e0d5a-5690-406a-beb2-8ef17cbbcae0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=678a3691-beb5-4d5c-9db4-b768178b304a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0f4933f9-b70a-4869-9ba0-50caddcac7f5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/11b138d4-5fd1-4331-9e97-04a928bea723"], "isController": false}, {"data": [0.782608695652174, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [0.08695652173913043, 500, 1500, "login"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0f4933f9-b70a-4869-9ba0-50caddcac7f5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8625a4b9-6459-41ee-900f-78be17eb9dc9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8625a4b9-6459-41ee-900f-78be17eb9dc9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7f7568ef-f377-4394-9bc2-992970147d97"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/7f7568ef-f377-4394-9bc2-992970147d97"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9020806f-5bfa-4f8c-a220-811fd8e67a1b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3e1a4937-6d26-4e4d-845c-a66bd84b267c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=98f42ee6-11e2-41ff-89b4-ce627411199b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/98f42ee6-11e2-41ff-89b4-ce627411199b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9020806f-5bfa-4f8c-a220-811fd8e67a1b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3e1a4937-6d26-4e4d-845c-a66bd84b267c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/0ba78e8a-ea0d-44f0-bc8d-10d935078f87"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "register"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 614, 210, 34.20195439739414, 270.48208469055373, 99, 1983, 107.0, 658.0, 1008.25, 1601.3000000000018, 2.4452701545617828, 2.549632524980386, 1.1754787181348243], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 57, 100.0, 575.7368421052629, 408, 877, 611.0, 730.2, 801.1999999999999, 877.0, 0.251015069711729, 1.6148773769365592, 0.42138174300240444], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 12, 0, 0.0, 107.58333333333334, 101, 132, 104.5, 126.00000000000003, 132.0, 132.0, 0.061130299232814746, 0.04745955848641379, 0.02172991105541462], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 20, 100.0, 132.25000000000003, 100, 304, 102.5, 300.8, 303.85, 304.0, 0.14540695772292703, 0.07227748191500964, 0.07298747682576612], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fe5a2824-90bc-4322-929d-932554eb3247", 3, 0, 0.0, 405.0, 213, 613, 389.0, 613.0, 613.0, 613.0, 0.02274122757146431, 0.02280785226161508, 0.014583404399669493], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=30cd0b32-0a97-4ff3-a9a2-985135299e98", 1, 0, 0.0, 362.0, 362, 362, 362.0, 362.0, 362.0, 362.0, 2.7624309392265194, 0.4990719958563536, 1.9045666436464088], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aa1ae656-062e-4f96-b495-78987a9a9fed", 3, 0, 0.0, 488.6666666666667, 313, 601, 552.0, 601.0, 601.0, 601.0, 0.031484824314680325, 0.026247602561815204, 0.020190463509088617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 19, 100.0, 102.78947368421053, 99, 109, 103.0, 106.0, 109.0, 109.0, 0.10658110260955415, 0.05297830198072565, 0.05349871752081136], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 105.5, 103, 108, 105.5, 108.0, 108.0, 108.0, 0.03190199706501627, 0.009408596790659095, 0.019720668107573534], "isController": false}, {"data": ["https://demoqa.com/books", 57, 57, 100.0, 192.77192982456145, 99, 556, 104.0, 408.8, 427.29999999999995, 556.0, 0.2631020189618087, 0.13078020278472716, 0.12718310486923368], "isController": false}, {"data": ["deleteBook", 16, 2, 12.5, 538.0625, 105, 1520, 441.0, 1054.5000000000005, 1520.0, 1520.0, 0.07692307692307693, 0.014995868389423076, 0.05182354266826923], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 2, 12.5, 538.0625, 105, 1520, 441.0, 1054.5000000000005, 1520.0, 1520.0, 0.07705941280727441, 0.015022446564113431, 0.05191539297892425], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/30cd0b32-0a97-4ff3-a9a2-985135299e98", 3, 0, 0.0, 326.0, 185, 602, 191.0, 602.0, 602.0, 602.0, 0.03321192529530937, 0.027190101600814802, 0.021298011989505032], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, 29.166666666666668, 965.0416666666665, 226, 1972, 895.5, 1799.0, 1972.0, 1972.0, 0.10076708946857957, 0.03163732350014485, 0.045463276693831794], "isController": false}, {"data": ["deleteAccount", 16, 2, 12.5, 498.9375, 101, 876, 482.5, 764.0000000000001, 876.0, 876.0, 0.07823348784447183, 0.01722817530168789, 0.052419874850867416], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 141.28571428571428, 102, 331, 115.0, 331.0, 331.0, 331.0, 0.03913303554956758, 0.03080197915327292, 0.01391057123051035], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1174.3478260869565, 718, 1983, 1133.0, 1508.6000000000001, 1893.3999999999987, 1983.0, 0.10335824416812342, 0.05349596621982951, 0.04754075488592396], "isController": false}, {"data": ["goToProfile", 17, 2, 11.764705882352942, 289.8823529411765, 100, 1639, 192.0, 638.9999999999991, 1639.0, 1639.0, 0.07642716491183901, 0.12494928270857873, 0.04864504751971371], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=aa1ae656-062e-4f96-b495-78987a9a9fed", 1, 0, 0.0, 447.0, 447, 447, 447.0, 447.0, 447.0, 447.0, 2.237136465324385, 0.4041701621923937, 1.5424007270693512], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 7, 100.0, 187.0, 101, 301, 104.0, 301.0, 301.0, 301.0, 0.03956680006330688, 0.019667481672092972, 0.019860678938027086], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3a192594-65f7-4430-8c7f-362d12ccf3c5", 2, 0, 0.0, 203.5, 203, 204, 203.5, 204.0, 204.0, 204.0, 0.017163846074628404, 0.02443836677422677, 0.010668738307129862], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5e25c247-203c-4289-96d1-6b7ba0973e6d", 1, 0, 0.0, 178.0, 178, 178, 178.0, 178.0, 178.0, 178.0, 5.617977528089887, 1.014966643258427, 3.8733321629213484], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=aa9c4555-3a74-4c1b-8493-26357b989156", 1, 0, 0.0, 374.0, 374, 374, 374.0, 374.0, 374.0, 374.0, 2.6737967914438503, 0.4830589906417112, 1.8434575534759359], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aa9c4555-3a74-4c1b-8493-26357b989156", 3, 0, 0.0, 406.33333333333337, 245, 688, 286.0, 688.0, 688.0, 688.0, 0.03940265573899681, 0.025332111030116764, 0.025267979103458238], "isController": false}, {"data": ["addBook", 57, 57, 100.0, 652.438596491228, 404, 1921, 609.0, 854.4000000000001, 1260.2999999999995, 1921.0, 0.24900724742146443, 0.8465853925577413, 0.48481926087440863], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/678a3691-beb5-4d5c-9db4-b768178b304a", 3, 0, 0.0, 365.0, 180, 716, 199.0, 716.0, 716.0, 716.0, 0.050471912380760105, 0.03244857648177123, 0.032366428186880666], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fe5a2824-90bc-4322-929d-932554eb3247", 1, 0, 0.0, 459.0, 459, 459, 459.0, 459.0, 459.0, 459.0, 2.1786492374727673, 0.3936036220043573, 1.502076525054466], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 128.78947368421052, 103, 309, 107.0, 306.0, 309.0, 309.0, 0.10819429417459142, 0.08082874515972893, 0.03845969050737429], "isController": false}, {"data": ["deleteBooks", 16, 2, 12.5, 334.0625, 103, 531, 380.0, 496.70000000000005, 531.0, 531.0, 0.07712330087727755, 0.015034901306275907, 0.05248564482309843], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=717e0d5a-5690-406a-beb2-8ef17cbbcae0", 1, 0, 0.0, 390.0, 390, 390, 390.0, 390.0, 390.0, 390.0, 2.5641025641025643, 0.4632411858974359, 1.7678285256410255], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=11b138d4-5fd1-4331-9e97-04a928bea723", 1, 0, 0.0, 188.0, 188, 188, 188.0, 188.0, 188.0, 188.0, 5.319148936170213, 0.9609790558510638, 3.6673038563829787], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 17, 9.941520467836257, 176.50877192982458, 100, 1613, 107.0, 304.8, 388.4000000000002, 1195.4000000000005, 0.7232370568058298, 1.630546337396431, 0.34413484749637324], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 128.5, 100, 304, 104.0, 304.0, 304.0, 304.0, 0.05092427560217956, 0.03943647514895351, 0.018101988592962266], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5e25c247-203c-4289-96d1-6b7ba0973e6d", 3, 0, 0.0, 267.0, 190, 417, 194.0, 417.0, 417.0, 417.0, 0.09631437010401953, 0.04470842831000385, 0.061764098015923974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 14, 100.0, 145.71428571428572, 100, 500, 103.0, 405.0, 500.0, 500.0, 0.06902604253976394, 0.03431079653587875, 0.03464783775921744], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/717e0d5a-5690-406a-beb2-8ef17cbbcae0", 3, 0, 0.0, 310.3333333333333, 184, 489, 258.0, 489.0, 489.0, 489.0, 0.03626517092983898, 0.030232780843527873, 0.02325598526425221], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 130.6875, 102, 311, 104.5, 307.5, 311.0, 311.0, 0.098161315852439, 0.07966020847009453, 0.034893280244421676], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=678a3691-beb5-4d5c-9db4-b768178b304a", 1, 0, 0.0, 445.0, 445, 445, 445.0, 445.0, 445.0, 445.0, 2.247191011235955, 0.4059866573033708, 1.5493328651685394], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0f4933f9-b70a-4869-9ba0-50caddcac7f5", 1, 0, 0.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 0.7084865196078431, 2.703737745098039], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/11b138d4-5fd1-4331-9e97-04a928bea723", 3, 0, 0.0, 271.3333333333333, 182, 447, 185.0, 447.0, 447.0, 447.0, 0.09621243706103075, 0.04259404765722716, 0.0616987307976011], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 498.4347826086957, 132, 1268, 434.0, 930.4000000000002, 1211.5999999999992, 1268.0, 0.10032759139625473, 0.06162700682445725, 0.04536296368795502], "isController": false}, {"data": ["login", 23, 7, 30.434782608695652, 2001.9130434782608, 1285, 2791, 1954.0, 2740.2000000000003, 2783.7999999999997, 2791.0, 0.10553799138259358, 0.1588626388627593, 0.15810533924728468], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 8, 100.0, 126.375, 100, 300, 101.5, 300.0, 300.0, 300.0, 0.04855576933581777, 0.02413563143743286, 0.024372720154892905], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0f4933f9-b70a-4869-9ba0-50caddcac7f5", 3, 0, 0.0, 326.33333333333337, 183, 595, 201.0, 595.0, 595.0, 595.0, 0.11039152193111569, 0.0499492888946129, 0.0707914382175449], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8625a4b9-6459-41ee-900f-78be17eb9dc9", 3, 0, 0.0, 356.6666666666667, 192, 476, 402.0, 476.0, 476.0, 476.0, 0.027845586938563354, 0.027927165806547426, 0.017856707769846943], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 135.2, 101, 310, 105.0, 308.3, 309.95, 310.0, 0.14735135931628968, 0.11929128600898845, 0.052378803506962356], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 12, 12, 100.0, 102.58333333333333, 99, 106, 103.0, 106.0, 106.0, 106.0, 0.057980537866122936, 0.02882040407603181, 0.02910351217108124], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8625a4b9-6459-41ee-900f-78be17eb9dc9", 1, 0, 0.0, 448.0, 448, 448, 448.0, 448.0, 448.0, 448.0, 2.232142857142857, 0.4032679966517857, 1.5389578683035714], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 134.42857142857142, 100, 317, 105.0, 305.5, 317.0, 317.0, 0.07194392484943164, 0.05964882050504635, 0.025573817036321403], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 18, 100.0, 124.50000000000001, 99, 298, 102.0, 296.2, 298.0, 298.0, 0.09117386349246549, 0.04531982081803216, 0.045765005698366466], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7f7568ef-f377-4394-9bc2-992970147d97", 1, 0, 0.0, 482.0, 482, 482, 482.0, 482.0, 482.0, 482.0, 2.074688796680498, 0.3748217064315353, 1.4304006742738589], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 104.83333333333334, 101, 112, 103.5, 110.2, 112.0, 112.0, 0.08903089866799883, 0.06912066839947176, 0.03164770226089021], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7f7568ef-f377-4394-9bc2-992970147d97", 3, 0, 0.0, 988.0, 467, 1639, 858.0, 1639.0, 1639.0, 1639.0, 0.08695148107356095, 0.03934328082430004, 0.05575990159990725], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 11, 100.0, 159.0909090909091, 100, 308, 105.0, 308.0, 308.0, 308.0, 0.0670551803174758, 0.03333113943515154, 0.03806976901014362], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 16, 100.0, 130.375, 99, 334, 103.0, 313.70000000000005, 334.0, 334.0, 0.09873130275953991, 0.04907639951621661, 0.04955848595547218], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9020806f-5bfa-4f8c-a220-811fd8e67a1b", 3, 0, 0.0, 256.6666666666667, 180, 386, 204.0, 386.0, 386.0, 386.0, 0.024468223933185436, 0.02935071783651964, 0.015690885790486754], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3e1a4937-6d26-4e4d-845c-a66bd84b267c", 1, 0, 0.0, 189.0, 189, 189, 189.0, 189.0, 189.0, 189.0, 5.291005291005291, 0.9558945105820106, 3.647900132275132], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=98f42ee6-11e2-41ff-89b4-ce627411199b", 1, 0, 0.0, 386.0, 386, 386, 386.0, 386.0, 386.0, 386.0, 2.5906735751295336, 0.4680416126943005, 1.7861479922279793], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/98f42ee6-11e2-41ff-89b4-ce627411199b", 3, 0, 0.0, 495.33333333333337, 193, 876, 417.0, 876.0, 876.0, 876.0, 0.0218488496580655, 0.02582460062123563, 0.01401114382369435], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9020806f-5bfa-4f8c-a220-811fd8e67a1b", 1, 0, 0.0, 531.0, 531, 531, 531.0, 531.0, 531.0, 531.0, 1.8832391713747645, 0.34023363935969864, 1.298405131826742], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3e1a4937-6d26-4e4d-845c-a66bd84b267c", 3, 0, 0.0, 348.6666666666667, 213, 431, 402.0, 431.0, 431.0, 431.0, 0.12635835228708617, 0.05717386382781568, 0.08103058398618482], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0ba78e8a-ea0d-44f0-bc8d-10d935078f87", 1, 0, 0.0, 1490.0, 1490, 1490, 1490.0, 1490.0, 1490.0, 1490.0, 0.6711409395973154, 0.2143194211409396, 0.40045616610738255], "isController": false}, {"data": ["register", 24, 7, 29.166666666666668, 965.0416666666665, 226, 1972, 895.5, 1799.0, 1972.0, 1972.0, 0.10393614855940168, 0.03263229664242934, 0.046893067025823805], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 3.3333333333333335, 1.1400651465798046], "isController": false}, {"data": ["401/Unauthorized", 21, 10.0, 3.420195439739414], "isController": false}, {"data": ["404/Not Found", 182, 86.66666666666667, 29.64169381107492], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 614, 210, "404/Not Found", 182, "401/Unauthorized", 21, "406/Not Acceptable", 7, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 20, "404/Not Found", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 19, "404/Not Found", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/books", 57, 57, "404/Not Found", 57, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 7, "404/Not Found", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 17, "401/Unauthorized", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 14, "404/Not Found", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 8, "404/Not Found", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 12, 12, "404/Not Found", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 18, "404/Not Found", 18, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 11, "404/Not Found", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 16, "404/Not Found", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
