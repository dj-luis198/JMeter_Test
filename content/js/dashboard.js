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

    var data = {"OkPercent": 98.75872769588828, "KoPercent": 1.2412723041117144};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7726662189388852, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5454545454545454, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5454545454545454, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/15fa26ef-b5b3-4a4d-9773-4e7caaa08b64"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=309f9ad6-ce1f-4061-9ac1-1685f37588bd"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/5681170e-f518-49b7-a1d4-43060d034aee"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/29c5ae11-ce16-48e5-890d-437109697b6b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/401a13e5-899b-477e-a2f1-26c3ecaca07b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bc13f860-65bb-49d1-80b6-150dc230c85f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=16d2afee-b773-4edf-931d-0c6888327b1a"], "isController": false}, {"data": [0.65625, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/16d2afee-b773-4edf-931d-0c6888327b1a"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/73ecd379-43c6-42da-a692-f490a41d8e15"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/147d9245-091a-4024-83f4-34465ad836ff"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/dbb2828e-aa73-4e77-a2e3-7aaebaf19445"], "isController": false}, {"data": [0.5625, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fa853588-1c91-4f43-84cb-0e6c97a48859"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/309f9ad6-ce1f-4061-9ac1-1685f37588bd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=15fa26ef-b5b3-4a4d-9773-4e7caaa08b64"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=25a8af32-22e2-419f-84d4-ca9dcee96939"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a380776c-ddc8-40b4-b9d6-13f94a75f822"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.23809523809523808, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a380776c-ddc8-40b4-b9d6-13f94a75f822"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.33035714285714285, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.23809523809523808, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/45ae41fe-1e1a-45df-b185-17f56e18f6f1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5681170e-f518-49b7-a1d4-43060d034aee"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=401a13e5-899b-477e-a2f1-26c3ecaca07b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6818181818181818, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.275, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.2966101694915254, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=29c5ae11-ce16-48e5-890d-437109697b6b"], "isController": false}, {"data": [0.9821428571428571, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.45535714285714285, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9339080459770115, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c4d77a05-70e3-4d16-8f4d-58bab8be0699"], "isController": false}, {"data": [0.85, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=147d9245-091a-4024-83f4-34465ad836ff"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=73ecd379-43c6-42da-a692-f490a41d8e15"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/25a8af32-22e2-419f-84d4-ca9dcee96939"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dbb2828e-aa73-4e77-a2e3-7aaebaf19445"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1289, 16, 1.2412723041117144, 408.32273079906855, 111, 2134, 132.0, 1193.0, 1408.5, 1831.399999999997, 5.0225410394984475, 693.1743767120086, 3.6831432366653294], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 2019.071428571429, 1523, 2603, 1996.5, 2381.3, 2488.05, 2603.0, 0.2411994504098237, 290.2436092576979, 1.185975813294397], "isController": true}, {"data": ["deleteBook", 11, 0, 0.0, 624.4545454545455, 474, 911, 610.0, 902.6, 911.0, 911.0, 0.07307319276708253, 0.013201699865146745, 0.049666935708876404], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 11, 0, 0.0, 624.4545454545455, 474, 911, 610.0, 902.6, 911.0, 911.0, 0.07185972980741592, 0.012982470717160103, 0.04884216010347801], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 13, 0, 0.0, 136.0, 111, 354, 120.0, 261.5999999999999, 354.0, 354.0, 0.10570738569372504, 0.052710759182312716, 0.05892043283108773], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 13, 0, 0.0, 121.84615384615385, 114, 138, 122.0, 132.4, 138.0, 138.0, 0.10570222869083724, 0.07855409768918667, 0.053057564010830414], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/15fa26ef-b5b3-4a4d-9773-4e7caaa08b64", 3, 0, 0.0, 680.6666666666666, 212, 1373, 457.0, 1373.0, 1373.0, 1373.0, 0.016248537631613158, 0.022399920856081286, 0.010419797895272758], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 13, 0, 0.0, 311.69230769230774, 114, 1076, 121.0, 1030.8, 1076.0, 1076.0, 0.10570566663685226, 4.805796329574006, 0.060849047734239686], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 13, 0, 0.0, 363.1538461538462, 116, 1527, 121.0, 1383.0, 1527.0, 1527.0, 0.10570652615829959, 14.657172264030509, 0.06074631348490023], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=309f9ad6-ce1f-4061-9ac1-1685f37588bd", 1, 0, 0.0, 459.0, 459, 459, 459.0, 459.0, 459.0, 459.0, 2.1786492374727673, 0.3936036220043573, 1.502076525054466], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5681170e-f518-49b7-a1d4-43060d034aee", 3, 0, 0.0, 828.6666666666666, 226, 1564, 696.0, 1564.0, 1564.0, 1564.0, 0.03953923610195851, 0.025419919043414084, 0.02535556481798772], "isController": false}, {"data": ["goToProfile", 11, 0, 0.0, 236.0, 212, 325, 226.0, 309.80000000000007, 325.0, 325.0, 0.07353137784432738, 0.1893315475514051, 0.04753688684857884], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/29c5ae11-ce16-48e5-890d-437109697b6b", 3, 0, 0.0, 387.6666666666667, 222, 520, 421.0, 520.0, 520.0, 520.0, 0.05371819435242717, 0.034535622996759004, 0.03444819103980518], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/401a13e5-899b-477e-a2f1-26c3ecaca07b", 3, 0, 0.0, 399.33333333333337, 225, 732, 241.0, 732.0, 732.0, 732.0, 0.037345018174575514, 0.02400924833814669, 0.02394846543096151], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 121.5625, 115, 130, 122.0, 126.5, 130.0, 130.0, 0.09399931850494084, 0.06985691541236326, 0.04718325167142538], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 150.43750000000003, 113, 366, 120.0, 359.0, 366.0, 366.0, 0.0938691698445292, 0.025117336462305663, 0.05353476092695805], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 776.0, 672, 917, 707.0, 917.0, 917.0, 917.0, 0.04335648569669537, 12.748246365642586, 0.024726745748896578], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1233.4, 1028, 1356, 1246.0, 1356.0, 1356.0, 1356.0, 0.04331216812051178, 38.97236500950702, 0.024659173842049183], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 312.4, 113, 367, 361.0, 367.0, 367.0, 367.0, 0.04356425291662673, 0.07708830691887465, 0.0241220033239525], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bc13f860-65bb-49d1-80b6-150dc230c85f", 1, 0, 0.0, 289.0, 289, 289, 289.0, 289.0, 289.0, 289.0, 3.4602076124567476, 1.1049686418685123, 2.064635596885813], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 165.93333333333334, 117, 356, 121.0, 352.4, 356.0, 356.0, 0.07390436774813391, 0.05492307017219718, 0.03709652834232503], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 166.66666666666666, 115, 361, 120.0, 360.4, 361.0, 361.0, 0.07381780780795559, 0.02714342307938367, 0.04168591568529992], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 284.0, 112, 1517, 120.0, 895.4000000000003, 1517.0, 1517.0, 0.07390400362622311, 4.451854967396017, 0.043024062527714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 267.53333333333336, 115, 917, 122.0, 587.6000000000001, 917.0, 917.0, 0.07381490175236577, 1.4655045279290981, 0.04304427571588152], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 116.4, 113, 119, 117.0, 119.0, 119.0, 119.0, 0.043657446214026265, 0.032444645086791, 0.024514679270571386], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=16d2afee-b773-4edf-931d-0c6888327b1a", 1, 0, 0.0, 509.0, 509, 509, 509.0, 509.0, 509.0, 509.0, 1.9646365422396854, 0.35493921905697445, 1.3545248035363457], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 863.1875000000002, 114, 1549, 1192.0, 1475.5, 1549.0, 1549.0, 0.0755055331398504, 42.470138815153014, 0.04033352209716618], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 120.75, 114, 132, 120.5, 126.4, 132.0, 132.0, 0.09400815520746424, 0.025338135583261846, 0.055266513120013155], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 671.125, 114, 1172, 932.5, 1087.3000000000002, 1172.0, 1172.0, 0.0755062457822683, 13.883471299368107, 0.040407639344417025], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 164.9375, 115, 361, 121.0, 360.3, 361.0, 361.0, 0.09400539355945547, 0.02533739123282198, 0.05535669171518716], "isController": false}, {"data": ["deleteBooks", 11, 0, 0.0, 485.90909090909093, 437, 665, 472.0, 636.6000000000001, 665.0, 665.0, 0.07189683457845579, 0.012989174215834296, 0.049569497277724396], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 499.59999999999997, 239, 1635, 455.0, 1087.8000000000002, 1635.0, 1635.0, 0.07377097554738063, 5.990424143150119, 0.16465431996685226], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/16d2afee-b773-4edf-931d-0c6888327b1a", 3, 0, 0.0, 1028.6666666666667, 229, 1549, 1308.0, 1549.0, 1549.0, 1549.0, 0.01625963383304608, 0.02241521786554367, 0.0104269136234052], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/73ecd379-43c6-42da-a692-f490a41d8e15", 3, 0, 0.0, 360.6666666666667, 249, 514, 319.0, 514.0, 514.0, 514.0, 0.041917004331423785, 0.02656653887802152, 0.026880370616179965], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 584.2, 162, 1447, 493.0, 1180.3000000000004, 1434.6499999999999, 1447.0, 0.0838423261214959, 0.05150080383830169, 0.03790917675219981], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 134.0625, 115, 343, 121.0, 190.40000000000015, 343.0, 343.0, 0.07550339529330709, 0.05611140997871748, 0.03789916521558579], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 216.62499999999997, 113, 472, 122.0, 397.1000000000001, 472.0, 472.0, 0.07550303899731964, 0.09107922746234286, 0.039097154715164784], "isController": false}, {"data": ["login", 20, 0, 0.0, 2763.15, 1577, 4326, 2725.0, 3866.3000000000006, 4304.45, 4326.0, 0.0824589251479107, 24.77546450787483, 0.1585965362097755], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/147d9245-091a-4024-83f4-34465ad836ff", 3, 0, 0.0, 386.3333333333333, 216, 481, 462.0, 481.0, 481.0, 481.0, 0.018191410016190353, 0.025078327284689502, 0.011665715407517903], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 125.375, 118, 137, 124.5, 132.1, 137.0, 137.0, 0.09336523312131645, 0.07558572095465951, 0.03318842271109296], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dbb2828e-aa73-4e77-a2e3-7aaebaf19445", 3, 0, 0.0, 360.3333333333333, 232, 511, 338.0, 511.0, 511.0, 511.0, 0.022682594888855285, 0.02681005925827915, 0.014545804665053683], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 1029.625, 235, 1670, 1315.5, 1595.1000000000001, 1670.0, 1670.0, 0.07545959610251186, 56.46629970016601, 0.15764349703349465], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fa853588-1c91-4f43-84cb-0e6c97a48859", 1, 0, 0.0, 235.0, 235, 235, 235.0, 235.0, 235.0, 235.0, 4.25531914893617, 1.3588763297872342, 2.5390625], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/309f9ad6-ce1f-4061-9ac1-1685f37588bd", 3, 0, 0.0, 402.3333333333333, 325, 540, 342.0, 540.0, 540.0, 540.0, 0.019482417118550508, 0.023027557473130497, 0.012493607331882975], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=15fa26ef-b5b3-4a4d-9773-4e7caaa08b64", 1, 0, 0.0, 472.0, 472, 472, 472.0, 472.0, 472.0, 472.0, 2.1186440677966103, 0.38276284427966106, 1.4607057733050848], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=25a8af32-22e2-419f-84d4-ca9dcee96939", 1, 0, 0.0, 442.0, 442, 442, 442.0, 442.0, 442.0, 442.0, 2.2624434389140275, 0.40874222285067874, 1.5598486990950227], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a380776c-ddc8-40b4-b9d6-13f94a75f822", 3, 0, 0.0, 335.0, 242, 493, 270.0, 493.0, 493.0, 493.0, 0.017283296270264665, 0.023826419174664992, 0.011083363819147587], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 13, 0, 0.0, 503.6923076923076, 235, 1650, 256.0, 1504.3999999999999, 1650.0, 1650.0, 0.1056009097924536, 19.574697730088136, 0.23334215456317778], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 0, 0.0, 1350.0, 1145, 1471, 1359.0, 1471.0, 1471.0, 1471.0, 0.0432690643497525, 51.76484372295683, 0.09756666951521341], "isController": false}, {"data": ["register", 21, 6, 28.571428571428573, 1226.3333333333333, 233, 2134, 1243.0, 2013.0, 2123.0, 2134.0, 0.08586568970593046, 0.02697677639756632, 0.038740184222792844], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 136.2777777777778, 121, 337, 125.0, 149.8000000000003, 337.0, 337.0, 0.10088328924359952, 0.07832247553580235, 0.03586085672331076], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 319.0, 239, 487, 248.5, 482.8, 487.0, 487.0, 0.09379708173829442, 0.14536715695182933, 0.2109518351985274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 429.22222222222223, 236, 704, 473.5, 701.3, 704.0, 704.0, 0.08341172490813124, 0.12927188225508232, 0.18759492428068972], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 191.0, 115, 366, 119.0, 365.5, 366.0, 366.0, 0.06048765144595731, 0.04495224877966163, 0.03036196566720904], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 117.30000000000001, 114, 122, 117.0, 121.6, 122.0, 122.0, 0.06048801732376816, 0.016185270260461404, 0.03449707237996153], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 212.3, 116, 359, 119.0, 358.9, 359.0, 359.0, 0.060404346696788305, 0.016280859070618724, 0.035511149132291565], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a380776c-ddc8-40b4-b9d6-13f94a75f822", 1, 0, 0.0, 474.0, 474, 474, 474.0, 474.0, 474.0, 474.0, 2.109704641350211, 0.3811478111814346, 1.4545424578059072], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 188.7, 113, 364, 120.5, 362.9, 364.0, 364.0, 0.06048691970361409, 0.016303115076364737, 0.035618762286405564], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1384.607142857143, 915, 2096, 1308.5, 1887.8000000000002, 2005.05, 2096.0, 0.2526585545223626, 302.2674695343413, 0.4989019504338057], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 6, 28.571428571428573, 1226.3333333333333, 233, 2134, 1243.0, 2013.0, 2123.0, 2134.0, 0.08479264161380586, 0.026639652471301727, 0.038256055103103814], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 171.77777777777777, 114, 365, 122.0, 365.0, 365.0, 365.0, 0.0587559408784666, 0.015836562189899202, 0.03459944565401891], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 199.77777777777777, 119, 359, 127.0, 359.0, 359.0, 359.0, 0.05875670805750323, 0.015836768968623918, 0.03454251782286811], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/45ae41fe-1e1a-45df-b185-17f56e18f6f1", 1, 0, 0.0, 268.0, 268, 268, 268.0, 268.0, 268.0, 268.0, 3.7313432835820897, 1.1915520055970148, 2.226416744402985], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 144.5555555555556, 113, 361, 118.0, 360.1, 361.0, 361.0, 0.09619135667220659, 0.025926576603055678, 0.056549996793621445], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5681170e-f518-49b7-a1d4-43060d034aee", 1, 0, 0.0, 665.0, 665, 665, 665.0, 665.0, 665.0, 665.0, 1.5037593984962407, 0.2716752819548872, 1.0367716165413534], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 145.0, 115, 362, 118.0, 358.4, 362.0, 362.0, 0.0961939269567448, 0.025927269375060118, 0.05664544722159874], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 172.88888888888889, 118, 359, 120.0, 359.0, 359.0, 359.0, 0.05875363946155554, 0.01572118868404904, 0.03350793500541839], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 132.94444444444446, 114, 348, 120.0, 152.7000000000003, 348.0, 348.0, 0.09618416060617395, 0.0714806115442367, 0.048279939991770916], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=401a13e5-899b-477e-a2f1-26c3ecaca07b", 1, 0, 0.0, 444.0, 444, 444, 444.0, 444.0, 444.0, 444.0, 2.2522522522522523, 0.4069010416666667, 1.5528223536036037], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 174.33333333333331, 116, 367, 121.0, 367.0, 367.0, 367.0, 0.0587559408784666, 0.043665303719251064, 0.029492728136261557], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 158.88888888888889, 114, 363, 120.5, 358.5, 363.0, 363.0, 0.09619289882644663, 0.02573911550629529, 0.054860012611957845], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 127.22222222222223, 119, 134, 127.0, 134.0, 134.0, 134.0, 0.05815343460646279, 0.045773113567196294, 0.02067172870776607], "isController": false}, {"data": ["deleteAccount", 11, 0, 0.0, 612.0, 457, 1308, 514.0, 1192.8000000000004, 1308.0, 1308.0, 0.07435798638572867, 0.013433815899765436, 0.050612809092629774], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1427.3499999999997, 953, 1933, 1387.0, 1795.9, 1926.3999999999999, 1933.0, 0.08413294688266398, 0.043545372898253824, 0.03869786912278783], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 403.1111111111111, 245, 728, 251.0, 728.0, 728.0, 728.0, 0.05870726600262226, 0.09098479604117336, 0.1320340171914444], "isController": false}, {"data": ["addBook", 59, 10, 16.949152542372882, 1161.4915254237287, 591, 2347, 983.0, 2097.0, 2319.0, 2347.0, 0.28873870126310947, 77.19486719549079, 1.0528524875573195], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=29c5ae11-ce16-48e5-890d-437109697b6b", 1, 0, 0.0, 474.0, 474, 474, 474.0, 474.0, 474.0, 474.0, 2.109704641350211, 0.3811478111814346, 1.4545424578059072], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 208.5178571428572, 113, 578, 123.5, 475.0, 498.2, 578.0, 0.2542761529834312, 0.18896889884803822, 0.1229166950457016], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 731.2678571428572, 564, 1079, 692.0, 966.1, 1013.3, 1079.0, 0.2538289646044574, 74.63414350855086, 0.12765812184696831], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 172.57142857142858, 111, 496, 123.0, 358.5, 380.84999999999985, 496.0, 0.25474114205912723, 0.450772411534315, 0.123887781977974], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1173.8392857142858, 795, 1618, 1158.5, 1470.7000000000003, 1549.15, 1618.0, 0.2532492786917866, 227.87414613161727, 0.12711926684333819], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 125.5, 120, 146, 124.0, 138.8, 146.0, 146.0, 0.08180591093154209, 0.061114767443974316, 0.029079444901446604], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 10, 5.747126436781609, 182.20114942528747, 115, 1127, 126.0, 332.5, 399.75, 685.25, 0.7615379565398166, 1.5923031394292841, 0.3664123533820601], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 164.7, 119, 544, 123.0, 502.20000000000016, 544.0, 544.0, 0.05905697817254087, 0.0457345543855712, 0.020992910209770385], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 13, 0, 0.0, 144.0769230769231, 117, 344, 126.0, 262.3999999999999, 344.0, 344.0, 0.09719698838869824, 0.07887763413184398, 0.034550491966295074], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c4d77a05-70e3-4d16-8f4d-58bab8be0699", 1, 0, 0.0, 289.0, 289, 289, 289.0, 289.0, 289.0, 289.0, 3.4602076124567476, 1.1049686418685123, 2.064635596885813], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 405.4, 232, 731, 240.5, 729.5, 731.0, 731.0, 0.060360594189689205, 0.09354713181546559, 0.13575239103403736], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=147d9245-091a-4024-83f4-34465ad836ff", 1, 0, 0.0, 446.0, 446, 446, 446.0, 446.0, 446.0, 446.0, 2.242152466367713, 0.40507637331838564, 1.5458590246636772], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=73ecd379-43c6-42da-a692-f490a41d8e15", 1, 0, 0.0, 437.0, 437, 437, 437.0, 437.0, 437.0, 437.0, 2.288329519450801, 0.41341890732265446, 1.577695938215103], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 334.0, 236, 712, 244.0, 507.70000000000033, 712.0, 712.0, 0.0961225241774849, 0.14897113854459818, 0.21618180974682397], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/25a8af32-22e2-419f-84d4-ca9dcee96939", 3, 0, 0.0, 340.0, 218, 480, 322.0, 480.0, 480.0, 480.0, 0.03434930957887747, 0.028635606064943097, 0.022027389280725458], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 124.4, 116, 131, 124.0, 130.4, 131.0, 131.0, 0.07563419270583846, 0.06270842735083676, 0.02688559193840351], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dbb2828e-aa73-4e77-a2e3-7aaebaf19445", 1, 0, 0.0, 523.0, 523, 523, 523.0, 523.0, 523.0, 523.0, 1.9120458891013383, 0.34543797801147225, 1.3182660133843211], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 129.125, 116, 177, 125.5, 153.90000000000003, 177.0, 177.0, 0.07669152750349906, 0.05954078551297046, 0.02726144141725943], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 145.66666666666669, 115, 349, 121.0, 345.4, 349.0, 349.0, 0.08345813415431409, 0.06202308602679006, 0.04189207124542719], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 171.16666666666669, 115, 356, 121.0, 353.3, 356.0, 356.0, 0.08346084295451384, 0.022332295868688276, 0.04759876199749618], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 228.44444444444443, 114, 470, 122.0, 368.3000000000002, 470.0, 470.0, 0.0834592950471545, 0.02249488811817836, 0.049064937127331065], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 202.44444444444446, 115, 459, 121.0, 369.0000000000001, 459.0, 459.0, 0.08346084295451384, 0.02249530532758381, 0.04914735185700376], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 37.5, 0.46547711404189296], "isController": false}, {"data": ["401/Unauthorized", 10, 62.5, 0.7757951900698216], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1289, 16, "401/Unauthorized", 10, "406/Not Acceptable", 6, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
