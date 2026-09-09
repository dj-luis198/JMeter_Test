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

    var data = {"OkPercent": 99.61685823754789, "KoPercent": 0.3831417624521073};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8162928759894459, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3684210526315789, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6bc10f7f-aff2-499c-abb1-2eeb6a47ff59"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3742e4fc-f97f-4847-90df-943ce34c0f6a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fb6706dd-941b-4ba4-928e-08408d7b3384"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=81255b39-e13c-4ab5-98be-5e1f47f723a9"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b828b6ca-2f3a-4f01-89c2-d82e7f263b4b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5578f4c9-65a5-459e-87fe-9dc957b5e0de"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0b5df65e-7da9-4cd3-92a9-1df7b998edbd"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0d72bd3e-7909-4b96-8b3c-4d9f92df1847"], "isController": false}, {"data": [0.6388888888888888, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ff109062-0b2b-4e37-ad1c-fc31d98c25c8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=443e8ae1-3cd9-42f5-a7bf-d563b5d86738"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/81b0d682-92e9-4cb5-9310-cd616eafc039"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1b78d0ec-e2cc-45e4-b88a-7f3078eea1e7"], "isController": false}, {"data": [0.2391304347826087, 500, 1500, "register"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0b5df65e-7da9-4cd3-92a9-1df7b998edbd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/81255b39-e13c-4ab5-98be-5e1f47f723a9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b828b6ca-2f3a-4f01-89c2-d82e7f263b4b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.49122807017543857, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2391304347826087, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/66913ecb-7216-4535-94b7-0b6daf74d046"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bd597f3a-6ea7-4767-8772-f4d039d76bd1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/5578f4c9-65a5-459e-87fe-9dc957b5e0de"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6bc10f7f-aff2-499c-abb1-2eeb6a47ff59"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.19444444444444445, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.4262295081967213, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fb6706dd-941b-4ba4-928e-08408d7b3384"], "isController": false}, {"data": [0.9824561403508771, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3742e4fc-f97f-4847-90df-943ce34c0f6a"], "isController": false}, {"data": [0.8070175438596491, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a7a50316-640b-4d36-9bb2-0b747d0ed6b7"], "isController": false}, {"data": [0.9748603351955307, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/a7a50316-640b-4d36-9bb2-0b747d0ed6b7"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3315d39c-b6e0-4ddd-b6bf-c5615792a2b4"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ff109062-0b2b-4e37-ad1c-fc31d98c25c8"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/443e8ae1-3cd9-42f5-a7bf-d563b5d86738"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0d72bd3e-7909-4b96-8b3c-4d9f92df1847"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=81b0d682-92e9-4cb5-9310-cd616eafc039"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bd597f3a-6ea7-4767-8772-f4d039d76bd1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/75349d19-60f0-447b-b924-cea1961fcfc4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1305, 5, 0.3831417624521073, 326.7356321839082, 78, 4708, 100.0, 841.4000000000005, 1132.5000000000002, 2036.1000000000035, 5.078987004798767, 692.423639905416, 3.7078938781179342], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1379.7192982456143, 977, 3181, 1319.0, 1636.4, 1878.8999999999974, 3181.0, 0.25765623234263757, 310.04706128517347, 1.2668936814894338], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6bc10f7f-aff2-499c-abb1-2eeb6a47ff59", 1, 0, 0.0, 212.0, 212, 212, 212.0, 212.0, 212.0, 212.0, 4.716981132075471, 0.8521889740566038, 3.252137382075472], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3742e4fc-f97f-4847-90df-943ce34c0f6a", 1, 0, 0.0, 1727.0, 1727, 1727, 1727.0, 1727.0, 1727.0, 1727.0, 0.5790387955993052, 0.10461150115807759, 0.39922010712217715], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fb6706dd-941b-4ba4-928e-08408d7b3384", 3, 0, 0.0, 291.3333333333333, 187, 457, 230.0, 457.0, 457.0, 457.0, 0.01823785814593934, 0.02514235978126729, 0.011695501480306153], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=81255b39-e13c-4ab5-98be-5e1f47f723a9", 1, 0, 0.0, 742.0, 742, 742, 742.0, 742.0, 742.0, 742.0, 1.3477088948787064, 0.24348256401617252, 0.9291821091644205], "isController": false}, {"data": ["deleteBook", 13, 0, 0.0, 867.1538461538462, 415, 2069, 706.0, 1837.3999999999999, 2069.0, 2069.0, 0.08305064172592011, 0.015004266327436738, 0.05644848304808632], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 0, 0.0, 867.1538461538462, 415, 2069, 706.0, 1837.3999999999999, 2069.0, 2069.0, 0.08269667495753844, 0.01494031725307091, 0.05620789626020191], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b828b6ca-2f3a-4f01-89c2-d82e7f263b4b", 3, 0, 0.0, 433.33333333333337, 173, 808, 319.0, 808.0, 808.0, 808.0, 0.030277646013947904, 0.02494554754599679, 0.01941632898680904], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 90.42105263157895, 80, 246, 82.0, 84.0, 246.0, 246.0, 0.09928981652287062, 0.03441665926347859, 0.056187339633881866], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 85.0, 81, 94, 84.0, 94.0, 94.0, 94.0, 0.09928722225705984, 0.073786695446897, 0.04983753148450074], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 137.89473684210526, 80, 651, 83.0, 247.0, 651.0, 651.0, 0.09928981652287062, 1.5619059758098652, 0.058019424550191], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 158.8421052631579, 80, 725, 84.0, 247.0, 725.0, 725.0, 0.09920686720377613, 4.723569569141965, 0.057874071893650236], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5578f4c9-65a5-459e-87fe-9dc957b5e0de", 1, 0, 0.0, 531.0, 531, 531, 531.0, 531.0, 531.0, 531.0, 1.8832391713747645, 0.34023363935969864, 1.298405131826742], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0b5df65e-7da9-4cd3-92a9-1df7b998edbd", 1, 0, 0.0, 435.0, 435, 435, 435.0, 435.0, 435.0, 435.0, 2.2988505747126435, 0.41531968390804597, 1.5849497126436782], "isController": false}, {"data": ["goToProfile", 13, 0, 0.0, 292.9230769230769, 186, 797, 206.0, 689.8, 797.0, 797.0, 0.08312179901149, 0.21665242340006524, 0.05373694428281873], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 95.4375, 82, 248, 84.0, 140.9000000000001, 248.0, 248.0, 0.0835727343954035, 0.06210825280752155, 0.04194959519456778], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 102.49999999999999, 80, 247, 82.5, 244.2, 247.0, 247.0, 0.08357840960733817, 0.03805511081974749, 0.04678840166738927], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 1, 0, 0.0, 651.0, 651, 651, 651.0, 651.0, 651.0, 651.0, 1.5360983102918586, 451.66390649001534, 0.8760560675883257], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 1, 0, 0.0, 1045.0, 1045, 1045, 1045.0, 1045.0, 1045.0, 1045.0, 0.9569377990430622, 861.0543136961724, 0.5448190789473685], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 1, 0, 0.0, 83.0, 83, 83, 83.0, 83.0, 83.0, 83.0, 12.048192771084338, 21.31965361445783, 6.671216114457831], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 106.21428571428574, 81, 247, 83.0, 246.5, 247.0, 247.0, 0.08009886488465763, 0.059526597829320765, 0.04020587553780667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 106.99999999999999, 81, 243, 82.5, 242.0, 243.0, 243.0, 0.08017501059455498, 0.021453079006746156, 0.04572481072970713], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 93.57142857142857, 79, 242, 82.0, 164.5, 242.0, 242.0, 0.08017455145201839, 0.021609547071051834, 0.04713386716222175], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 129.3571428571429, 80, 243, 84.0, 242.5, 243.0, 243.0, 0.08017455145201839, 0.021609547071051834, 0.047212162622624114], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 1, 0, 0.0, 82.0, 82, 82, 82.0, 82.0, 82.0, 82.0, 12.195121951219512, 9.062976371951219, 6.847846798780488], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 206.37500000000003, 81, 883, 83.0, 710.1000000000001, 883.0, 883.0, 0.08355004125283287, 9.417013676750111, 0.04822077576213303], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 669.2142857142857, 81, 1049, 799.0, 1003.0, 1049.0, 1049.0, 0.07438776215044393, 47.81589933808175, 0.03916565490454456], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 176.0, 81, 640, 83.0, 637.2, 640.0, 640.0, 0.08355178644163386, 3.090579764540622, 0.048303376536569576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 515.0714285714286, 80, 823, 638.0, 809.5, 823.0, 823.0, 0.07438815740534108, 15.629005835485277, 0.03923850769386085], "isController": false}, {"data": ["deleteBooks", 13, 0, 0.0, 637.8461538461538, 190, 1727, 529.0, 1499.7999999999997, 1727.0, 1727.0, 0.08253496625589649, 0.014911102302090676, 0.056903990406897385], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 248.28571428571428, 163, 490, 172.0, 489.5, 490.0, 490.0, 0.08006130408427024, 0.12407938435716491, 0.18005974932233823], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0d72bd3e-7909-4b96-8b3c-4d9f92df1847", 1, 0, 0.0, 190.0, 190, 190, 190.0, 190.0, 190.0, 190.0, 5.263157894736842, 0.9508634868421052, 3.6287006578947367], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 18, 0, 0.0, 776.3888888888888, 182, 1781, 749.0, 1464.2000000000005, 1781.0, 1781.0, 0.08124320152376138, 0.04990427124848233, 0.036733986626466326], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 95.35714285714286, 81, 250, 83.5, 169.5, 250.0, 250.0, 0.07438776215044393, 0.05528231152000765, 0.03733916967317205], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 139.64285714285714, 81, 245, 83.0, 244.5, 245.0, 245.0, 0.07438776215044393, 0.09970948922174461, 0.037961835092958134], "isController": false}, {"data": ["login", 18, 0, 0.0, 3276.5, 1845, 5489, 2926.0, 5216.3, 5489.0, 5489.0, 0.07927873964421463, 5.3828036224328, 0.1269182426986483], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ff109062-0b2b-4e37-ad1c-fc31d98c25c8", 1, 0, 0.0, 513.0, 513, 513, 513.0, 513.0, 513.0, 513.0, 1.949317738791423, 0.35217166179337234, 1.3439632066276803], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 102.375, 83, 259, 88.5, 157.5000000000001, 259.0, 259.0, 0.07905880492734002, 0.0640036614109032, 0.028102934564015396], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=443e8ae1-3cd9-42f5-a7bf-d563b5d86738", 1, 0, 0.0, 505.0, 505, 505, 505.0, 505.0, 505.0, 505.0, 1.9801980198019802, 0.3577506188118812, 1.3652537128712872], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 765.8571428571429, 164, 1134, 884.0, 1088.0, 1134.0, 1134.0, 0.07435536553628808, 63.572115576121305, 0.15363801882784078], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/81b0d682-92e9-4cb5-9310-cd616eafc039", 3, 0, 0.0, 353.3333333333333, 193, 548, 319.0, 548.0, 548.0, 548.0, 0.01864141376481992, 0.02569869378060299, 0.011954292030174236], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 253.42105263157896, 165, 814, 171.0, 339.0, 814.0, 814.0, 0.09916182165485422, 6.389383112350344, 0.2216819198642005], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 1, 0, 0.0, 1128.0, 1128, 1128, 1128.0, 1128.0, 1128.0, 1128.0, 0.8865248226950354, 1060.5918938386526, 1.9990095855496455], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1b78d0ec-e2cc-45e4-b88a-7f3078eea1e7", 1, 0, 0.0, 384.0, 384, 384, 384.0, 384.0, 384.0, 384.0, 2.6041666666666665, 0.83160400390625, 1.5538533528645833], "isController": false}, {"data": ["register", 23, 3, 13.043478260869565, 1414.1304347826087, 331, 2707, 1386.0, 2263.2000000000007, 2647.999999999999, 2707.0, 0.09146292967693702, 0.029234584519700322, 0.04126550147533682], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/0b5df65e-7da9-4cd3-92a9-1df7b998edbd", 3, 0, 0.0, 556.6666666666667, 193, 1258, 219.0, 1258.0, 1258.0, 1258.0, 0.022633480953925776, 0.03118734533788015, 0.014514309075271414], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 111.13333333333334, 82, 283, 87.0, 259.6, 283.0, 283.0, 0.07203780544029507, 0.055927788403354085, 0.02560718865260489], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 333.5625, 166, 968, 284.0, 796.5000000000002, 968.0, 968.0, 0.08350774273352157, 12.60127964198665, 0.1851400907624779], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/81255b39-e13c-4ab5-98be-5e1f47f723a9", 3, 0, 0.0, 1898.6666666666667, 459, 4708, 529.0, 4708.0, 4708.0, 4708.0, 0.016343162837826795, 0.022530369341860833, 0.010480478772955335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 257.63157894736844, 164, 488, 175.0, 430.0, 488.0, 488.0, 0.10865462697150961, 0.1683934501990095, 0.24436680265174474], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 109.41666666666669, 79, 243, 83.0, 242.4, 243.0, 243.0, 0.05932107034984602, 0.044085287633039864, 0.02977639664045005], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b828b6ca-2f3a-4f01-89c2-d82e7f263b4b", 1, 0, 0.0, 1159.0, 1159, 1159, 1159.0, 1159.0, 1159.0, 1159.0, 0.8628127696289906, 0.15587926013805004, 0.5948689603106125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 162.58333333333334, 80, 250, 164.0, 248.20000000000002, 250.0, 250.0, 0.059272430910572715, 0.030697408065989973, 0.03297414857622681], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 224.66666666666669, 80, 838, 83.0, 799.9000000000001, 838.0, 838.0, 0.059138062735628216, 8.882038430500456, 0.03391968311854718], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 173.41666666666666, 80, 632, 83.0, 583.7000000000002, 632.0, 632.0, 0.0591608039953263, 2.9124948542425693, 0.0339905009934085], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 938.385964912281, 640, 2828, 845.0, 1243.4, 1311.299999999999, 2828.0, 0.2591227105144722, 310.0008474051361, 0.511666133457288], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 3, 13.043478260869565, 1414.1304347826087, 331, 2707, 1386.0, 2263.2000000000007, 2647.999999999999, 2707.0, 0.08951471349453766, 0.028611870040203786, 0.04038652112741836], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 81.55555555555556, 79, 83, 82.0, 83.0, 83.0, 83.0, 0.04694027632175995, 0.01265187135234936, 0.027641588498067624], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 99.77777777777777, 81, 244, 82.0, 244.0, 244.0, 244.0, 0.04694052114409697, 0.012651937339619886, 0.02759589231322888], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 172.93333333333334, 81, 943, 84.0, 524.2000000000003, 943.0, 943.0, 0.07076306168180209, 4.262649818669654, 0.04119552718480953], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/66913ecb-7216-4535-94b7-0b6daf74d046", 1, 0, 0.0, 196.0, 196, 196, 196.0, 196.0, 196.0, 196.0, 5.1020408163265305, 1.6292649872448979, 3.044284119897959], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 141.06666666666666, 81, 636, 83.0, 399.60000000000014, 636.0, 636.0, 0.07076306168180209, 1.404913978653143, 0.041264631737233166], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bd597f3a-6ea7-4767-8772-f4d039d76bd1", 3, 0, 0.0, 463.33333333333337, 193, 933, 264.0, 933.0, 933.0, 933.0, 0.0187812237845418, 0.0221987706906482, 0.012043948846206819], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 85.46666666666665, 81, 104, 84.0, 96.80000000000001, 104.0, 104.0, 0.07075905597984783, 0.05258558750064862, 0.03551772927113455], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 99.77777777777777, 81, 240, 82.0, 240.0, 240.0, 240.0, 0.046940031501976696, 0.012560125616739857, 0.026770486715971084], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 82.8, 81, 90, 82.0, 86.4, 90.0, 90.0, 0.07076339551077018, 0.02602029022427279, 0.03996104769924613], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 86.66666666666666, 82, 107, 84.0, 107.0, 107.0, 107.0, 0.0469388074413656, 0.03488323482703049, 0.02356108107896672], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5578f4c9-65a5-459e-87fe-9dc957b5e0de", 3, 0, 0.0, 1136.6666666666667, 186, 2798, 426.0, 2798.0, 2798.0, 2798.0, 0.021216257310768663, 0.021278414314608807, 0.013605477507231206], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6bc10f7f-aff2-499c-abb1-2eeb6a47ff59", 3, 0, 0.0, 434.0, 206, 577, 519.0, 577.0, 577.0, 577.0, 0.08919810900008919, 0.04035982145511848, 0.05720061026372907], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 89.22222222222223, 83, 97, 89.0, 97.0, 97.0, 97.0, 0.04747661776575037, 0.037369290936713664, 0.016876453971419077], "isController": false}, {"data": ["deleteAccount", 13, 0, 0.0, 921.3076923076924, 392, 4708, 518.0, 3327.9999999999986, 4708.0, 4708.0, 0.07933214538531014, 0.014332467672150757, 0.05399854036480582], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 18, 0, 0.0, 1793.111111111111, 1226, 3079, 1692.0, 2615.500000000001, 3079.0, 3079.0, 0.08088360848738665, 0.041863586424135665, 0.03720330038824132], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 205.33333333333334, 164, 330, 169.0, 330.0, 330.0, 330.0, 0.046918741952132456, 0.07271488620901778, 0.1055213503083604], "isController": false}, {"data": ["addBook", 61, 2, 3.278688524590164, 925.1147540983608, 464, 1886, 783.0, 1564.0, 1784.5, 1886.0, 0.2994791027409702, 95.06558603856652, 1.0903869969610234], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fb6706dd-941b-4ba4-928e-08408d7b3384", 1, 0, 0.0, 681.0, 681, 681, 681.0, 681.0, 681.0, 681.0, 1.4684287812041115, 0.26529230910425844, 1.012412812041116], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 178.0877192982456, 82, 1953, 86.0, 331.2, 336.69999999999993, 1953.0, 0.25978761223280616, 0.19306481729410693, 0.1255809258351944], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3742e4fc-f97f-4847-90df-943ce34c0f6a", 3, 0, 0.0, 483.3333333333333, 203, 797, 450.0, 797.0, 797.0, 797.0, 0.03525388674101319, 0.022343527827067937, 0.022607472942641926], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 520.859649122807, 395, 801, 481.0, 648.0, 725.0, 801.0, 0.2597651176462546, 76.3795696016707, 0.13064358944123156], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 130.6315789473685, 80, 329, 84.0, 248.2, 250.49999999999997, 329.0, 0.2601385580108984, 0.4603233077302226, 0.12651269715764396], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 758.7894736842105, 556, 1128, 721.0, 956.2, 979.8999999999994, 1128.0, 0.2595711156548706, 233.56254614360432, 0.13029253266269872], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 95.31578947368422, 82, 256, 86.0, 99.0, 256.0, 256.0, 0.11554577132883719, 0.08632081549468792, 0.04107291090204759], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a7a50316-640b-4d36-9bb2-0b747d0ed6b7", 1, 0, 0.0, 485.0, 485, 485, 485.0, 485.0, 485.0, 485.0, 2.061855670103093, 0.3725032216494846, 1.4215528350515465], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 2, 1.1173184357541899, 165.74860335195518, 82, 1361, 93.0, 313.0, 399.0, 884.9999999999932, 0.7478775319205829, 1.542803421800839, 0.36172683851485726], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 85.41666666666666, 83, 89, 85.0, 88.4, 89.0, 89.0, 0.05874807844826742, 0.04549533809519147, 0.02088310601090756], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a7a50316-640b-4d36-9bb2-0b747d0ed6b7", 3, 0, 0.0, 997.0, 216, 2257, 518.0, 2257.0, 2257.0, 2257.0, 0.035336105254478854, 0.02271771089765486, 0.022660197705508898], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 146.57894736842104, 81, 1034, 86.0, 261.0, 1034.0, 1034.0, 0.09675908007577763, 0.07852226127243282, 0.034394829245686584], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3315d39c-b6e0-4ddd-b6bf-c5615792a2b4", 1, 0, 0.0, 384.0, 384, 384, 384.0, 384.0, 384.0, 384.0, 2.6041666666666665, 0.83160400390625, 1.5538533528645833], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ff109062-0b2b-4e37-ad1c-fc31d98c25c8", 3, 0, 0.0, 550.3333333333334, 198, 1061, 392.0, 1061.0, 1061.0, 1061.0, 0.019118143755695614, 0.02635590455904001, 0.012260007551666783], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 361.41666666666663, 166, 918, 248.0, 880.8000000000002, 918.0, 918.0, 0.059113300492610835, 11.863021474753694, 0.13042641625615764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 280.46666666666664, 165, 1027, 174.0, 620.8000000000002, 1027.0, 1027.0, 0.07073169581598442, 5.743625526951134, 0.15787075049865845], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/443e8ae1-3cd9-42f5-a7bf-d563b5d86738", 3, 0, 0.0, 845.3333333333334, 204, 1915, 417.0, 1915.0, 1915.0, 1915.0, 0.019664523233634202, 0.027109132778138294, 0.01261038762052714], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0d72bd3e-7909-4b96-8b3c-4d9f92df1847", 3, 0, 0.0, 294.3333333333333, 190, 485, 208.0, 485.0, 485.0, 485.0, 0.05931315368038118, 0.02683765742699539, 0.03803610441092153], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=81b0d682-92e9-4cb5-9310-cd616eafc039", 1, 0, 0.0, 529.0, 529, 529, 529.0, 529.0, 529.0, 529.0, 1.890359168241966, 0.34151996691871456, 1.303314035916824], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 93.28571428571429, 83, 113, 88.5, 111.0, 113.0, 113.0, 0.08376412023741145, 0.06944896297027571, 0.029775527115642353], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 89.07142857142858, 83, 103, 87.5, 100.5, 103.0, 103.0, 0.07592314408585824, 0.05894423784009502, 0.026988305124269918], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bd597f3a-6ea7-4767-8772-f4d039d76bd1", 1, 0, 0.0, 583.0, 583, 583, 583.0, 583.0, 583.0, 583.0, 1.7152658662092624, 0.3098868996569468, 1.182595411663808], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/75349d19-60f0-447b-b924-cea1961fcfc4", 1, 0, 0.0, 206.0, 206, 206, 206.0, 206.0, 206.0, 206.0, 4.854368932038835, 1.5501744538834952, 2.896503337378641], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 92.73684210526316, 81, 247, 85.0, 92.0, 247.0, 247.0, 0.10870622428954761, 0.08078655926205638, 0.05456542898908933], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 132.21052631578948, 78, 249, 82.0, 242.0, 249.0, 249.0, 0.10870746820306555, 0.029087740515273398, 0.06199722795956082], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 115.57894736842104, 79, 249, 82.0, 242.0, 249.0, 249.0, 0.10870746820306555, 0.029300059789107512, 0.06390810142406783], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 146.15789473684208, 80, 346, 83.0, 242.0, 346.0, 346.0, 0.10870622428954761, 0.029299724515542133, 0.06401352856113009], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 3, 60.0, 0.22988505747126436], "isController": false}, {"data": ["401/Unauthorized", 2, 40.0, 0.1532567049808429], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1305, 5, "406/Not Acceptable", 3, "401/Unauthorized", 2, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 3, "406/Not Acceptable", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
