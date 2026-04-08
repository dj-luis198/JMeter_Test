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

    var data = {"OkPercent": 99.29221435793731, "KoPercent": 0.7077856420626896};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6510507880910683, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/b85c445e-3263-44e5-b3f7-47eaf77d4bff"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b85c445e-3263-44e5-b3f7-47eaf77d4bff"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=41357ca8-b731-4a48-b5a5-91f2a2056c90"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.1702127659574468, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.375, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.375, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.027777777777777776, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c8b72aa2-7148-4512-ba84-961771dac588"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/aa421f5d-df5b-433f-90b2-0156614f0380"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/9878ba38-d29e-4968-b716-bd52b74b4c9e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5625, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.029411764705882353, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9375, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/32c3b33c-ec4a-41fe-94ff-98d9b9071740"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.21794871794871795, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/c8b72aa2-7148-4512-ba84-961771dac588"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.8617021276595744, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9893617021276596, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.26595744680851063, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.625, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.748, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/08cc3273-4028-4586-8bf3-fb08f5e89f68"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.23529411764705882, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/f2cd43a5-d7f8-40cb-8bb1-7d702d1f6bb7"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/339282a8-995f-453a-87b0-5c05bae1961c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f462195b-9493-4303-bd1d-9a667528a6df"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/e445e7b4-cc25-40dc-b3c5-8f7d25938029"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/e4325fee-9908-4df2-ba9b-8ce5f0f465cc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e4325fee-9908-4df2-ba9b-8ce5f0f465cc"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/f462195b-9493-4303-bd1d-9a667528a6df"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.47368421052631576, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f2cd43a5-d7f8-40cb-8bb1-7d702d1f6bb7"], "isController": false}, {"data": [0.7894736842105263, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/fdc6e1cc-7888-435d-bd8d-719f48d7c2ef"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9878ba38-d29e-4968-b716-bd52b74b4c9e"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/41357ca8-b731-4a48-b5a5-91f2a2056c90"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/c6242b88-9ade-4002-b950-158c08987058"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c6242b88-9ade-4002-b950-158c08987058"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.027777777777777776, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 989, 7, 0.7077856420626896, 1555.42871587462, 136, 48413, 299.0, 2002.0, 6141.0, 27010.700000000004, 3.8155864197530867, 593.2714580017844, 2.783662772472994], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 47, 0, 0.0, 9572.531914893616, 1765, 46371, 2690.0, 33169.80000000001, 42242.19999999998, 46371.0, 0.20036491993929367, 241.10543034894403, 0.98519274599057], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 694.0714285714287, 280, 2259, 308.0, 2036.5, 2259.0, 2259.0, 0.07305707322927918, 18.81788865221441, 0.1603015691615657], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 8, 0, 0.0, 1832.0, 144, 6942, 154.5, 6942.0, 6942.0, 6942.0, 0.04833194378994937, 0.037523335266611085, 0.017180495644083568], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 456.3333333333333, 289, 1165, 321.0, 823.0000000000002, 1165.0, 1165.0, 0.07222650231124808, 0.11193697184370184, 0.16243909650664484], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b85c445e-3263-44e5-b3f7-47eaf77d4bff", 3, 0, 0.0, 2584.6666666666665, 254, 6235, 1265.0, 6235.0, 6235.0, 6235.0, 0.05040322580645161, 0.022806147093413977, 0.03232238113239247], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b85c445e-3263-44e5-b3f7-47eaf77d4bff", 1, 0, 0.0, 291.0, 291, 291, 291.0, 291.0, 291.0, 291.0, 3.4364261168384878, 0.6208387027491409, 2.3692547250859106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 6, 0, 0.0, 317.5, 144, 581, 298.0, 581.0, 581.0, 581.0, 0.06606401603153456, 0.04909640253906035, 0.03316103929707887], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 6, 0, 0.0, 142.83333333333331, 137, 153, 141.5, 153.0, 153.0, 153.0, 0.06607638430025109, 0.01768059501784062, 0.03768418792123695], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=41357ca8-b731-4a48-b5a5-91f2a2056c90", 1, 0, 0.0, 1764.0, 1764, 1764, 1764.0, 1764.0, 1764.0, 1764.0, 0.5668934240362812, 0.1024172689909297, 0.3908464427437642], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 6, 0, 0.0, 337.0, 142, 449, 419.5, 449.0, 449.0, 449.0, 0.06607420132809146, 0.017809062076712148, 0.03884440351514751], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 6, 0, 0.0, 350.66666666666663, 141, 515, 428.0, 515.0, 515.0, 515.0, 0.06607420132809146, 0.017809062076712148, 0.03890892910238197], "isController": false}, {"data": ["https://demoqa.com/books", 47, 0, 0.0, 1776.9999999999998, 1118, 2502, 1771.0, 2407.0, 2460.2, 2502.0, 0.19742092661822155, 236.1840628544126, 0.3898292125215273], "isController": false}, {"data": ["deleteBook", 8, 0, 0.0, 1165.5, 515, 2569, 913.5, 2569.0, 2569.0, 2569.0, 0.07942811755361398, 0.014349806393963464, 0.053986298649722], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 8, 0, 0.0, 1165.5, 515, 2569, 913.5, 2569.0, 2569.0, 2569.0, 0.07878435736584502, 0.014233502063165357, 0.05354874289709778], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 18, 4, 22.22222222222222, 22101.611111111113, 516, 48413, 24682.0, 47702.9, 48413.0, 48413.0, 0.07234028871813009, 0.022888919477220847, 0.0326379036990001], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 188.7857142857143, 138, 429, 149.0, 424.0, 429.0, 429.0, 0.08933072147319121, 0.033486558119205465, 0.050410542460806146], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 147.2, 141, 155, 148.0, 155.0, 155.0, 155.0, 0.030822530036555523, 0.008307635048915355, 0.01815037657426072], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 184.57142857142858, 142, 639, 149.5, 399.5, 639.0, 639.0, 0.08933414159461443, 0.06638992358740388, 0.044841551542609194], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 204.2, 148, 418, 150.0, 418.0, 418.0, 418.0, 0.03082234003205523, 0.008307583836764887, 0.018120164745407473], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c8b72aa2-7148-4512-ba84-961771dac588", 1, 0, 0.0, 811.0, 811, 811, 811.0, 811.0, 811.0, 811.0, 1.2330456226880395, 0.22276703144266335, 0.8501271578298396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 287.2857142857142, 140, 1193, 153.0, 824.5, 1193.0, 1193.0, 0.08933585175353514, 1.8986236495928839, 0.05205857321073051], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 371.8571428571429, 138, 1505, 187.5, 1054.0, 1505.0, 1505.0, 0.08933528169328646, 5.764076139583187, 0.05197099953418032], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 8, 0, 0.0, 149.62499999999997, 140, 164, 148.0, 164.0, 164.0, 164.0, 0.04580248822017256, 0.012345201903093385, 0.026926853426312382], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aa421f5d-df5b-433f-90b2-0156614f0380", 1, 0, 0.0, 3995.0, 3995, 3995, 3995.0, 3995.0, 3995.0, 3995.0, 0.2503128911138924, 0.07993390175219024, 0.14935661764705882], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 8, 0, 0.0, 183.25, 142, 416, 150.5, 416.0, 416.0, 416.0, 0.04580091487327459, 0.012344777836937292, 0.026970655926352127], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9878ba38-d29e-4968-b716-bd52b74b4c9e", 3, 0, 0.0, 2200.3333333333335, 355, 5756, 490.0, 5756.0, 5756.0, 5756.0, 0.05788600316443484, 0.02619190898390769, 0.03712090697719291], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 8, 0, 0.0, 151.87500000000003, 140, 179, 149.0, 179.0, 179.0, 179.0, 0.04580091487327459, 0.034037593963439416, 0.02298991234849916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 230.0, 136, 584, 144.0, 584.0, 584.0, 584.0, 0.030823290077982922, 0.008247638165397775, 0.017578907622599636], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 8, 0, 0.0, 148.375, 138, 168, 145.0, 168.0, 168.0, 168.0, 0.04580091487327459, 0.012255322925075427, 0.026120834263664416], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 153.4, 144, 166, 151.0, 166.0, 166.0, 166.0, 0.030821960030082234, 0.02290577303016853, 0.01547117915572487], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 1279.8, 153, 5448, 157.0, 5448.0, 5448.0, 5448.0, 0.03200020480131073, 0.025187661201031688, 0.011375072800465923], "isController": false}, {"data": ["deleteAccount", 8, 0, 0.0, 721.25, 490, 1265, 558.5, 1265.0, 1265.0, 1265.0, 0.07900610322147386, 0.014273563570285806, 0.05377661518102274], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 17, 0, 0.0, 10803.35294117647, 1132, 27206, 11568.0, 27032.4, 27206.0, 27206.0, 0.08203524620225067, 0.042459648913274264, 0.03773300875123053], "isController": false}, {"data": ["goToProfile", 8, 0, 0.0, 370.0, 247, 680, 331.5, 680.0, 680.0, 680.0, 0.079701914838504, 0.10791670402693926, 0.051526042600673484], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 391.2, 294, 741, 307.0, 741.0, 741.0, 741.0, 0.030793486561722466, 0.04772388981782573, 0.0692552729996551], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/32c3b33c-ec4a-41fe-94ff-98d9b9071740", 1, 0, 0.0, 3967.0, 3967, 3967, 3967.0, 3967.0, 3967.0, 3967.0, 0.25207965717166625, 0.08049809364759264, 0.15041081106629695], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 181.42857142857142, 140, 594, 151.0, 375.0, 594.0, 594.0, 0.07314639205421193, 0.05435976987622586, 0.03671606007408685], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 190.92857142857144, 138, 427, 148.0, 416.5, 427.0, 427.0, 0.07311354010538795, 0.04309496469660492, 0.04038176691925654], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 780.3333333333334, 679, 853, 809.0, 853.0, 853.0, 853.0, 0.07005908316013171, 20.599696629574275, 0.03995557086476262], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 1509.0, 1192, 1818, 1517.0, 1818.0, 1818.0, 1818.0, 0.06922970415839756, 62.29300949456546, 0.039414958519868926], "isController": false}, {"data": ["addBook", 39, 3, 7.6923076923076925, 2209.5641025641025, 775, 7874, 1434.0, 3770.0, 7789.0, 7874.0, 0.26948031757218965, 116.8295627142023, 0.9722439051671122], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 476.0, 433, 512, 483.0, 512.0, 512.0, 512.0, 0.07033338022225348, 0.12445711422140947, 0.03894436190040793], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c8b72aa2-7148-4512-ba84-961771dac588", 3, 0, 0.0, 2213.0, 308, 5247, 1084.0, 5247.0, 5247.0, 5247.0, 0.04450510325183954, 0.02861249313879658, 0.028540056447305957], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 5, 0, 0.0, 149.0, 141, 152, 150.0, 152.0, 152.0, 152.0, 0.055388160226869904, 0.04116249016860156, 0.027802260113878055], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 5, 0, 0.0, 148.8, 142, 153, 149.0, 153.0, 153.0, 153.0, 0.055393069219179296, 0.01482197359966321, 0.031591359789063196], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 5, 0, 0.0, 145.8, 142, 153, 145.0, 153.0, 153.0, 153.0, 0.05539184188952651, 0.014929832384286442, 0.03256434454833492], "isController": false}, {"data": ["https://demoqa.com/books-0", 47, 0, 0.0, 320.6170212765957, 141, 722, 155.0, 591.2, 628.1999999999997, 722.0, 0.19847721523798262, 0.14750113358994607, 0.095943575725392], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 5, 0, 0.0, 147.8, 140, 153, 149.0, 153.0, 153.0, 153.0, 0.05539000099702002, 0.014929336206228052, 0.032617354102737375], "isController": false}, {"data": ["https://demoqa.com/books-3", 47, 0, 0.0, 991.8936170212764, 691, 1479, 884.0, 1323.2, 1349.6, 1479.0, 0.19829048290061008, 58.303985836469415, 0.09972617059942791], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 141.0, 137, 145, 141.0, 145.0, 145.0, 145.0, 0.07094378887128433, 0.05272287434672594, 0.03983660019627782], "isController": false}, {"data": ["https://demoqa.com/books-1", 47, 0, 0.0, 219.3829787234042, 137, 569, 150.0, 430.6, 436.59999999999997, 569.0, 0.19887697977801944, 0.3519190306228235, 0.0967194686811071], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 462.2857142857143, 138, 1664, 149.0, 1662.5, 1664.0, 1664.0, 0.07315021396437585, 14.119925163085789, 0.04165725075370846], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 957.2105263157895, 140, 1921, 1282.0, 1920.0, 1921.0, 1921.0, 0.121314280606316, 57.46749006739328, 0.06583245141043814], "isController": false}, {"data": ["https://demoqa.com/books-2", 47, 0, 0.0, 1454.7446808510635, 969, 1927, 1427.0, 1824.0, 1895.3999999999996, 1927.0, 0.19793724126022852, 178.10427762251052, 0.09935521680445064], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 1932.933333333333, 144, 26381, 153.0, 10913.60000000001, 26381.0, 26381.0, 0.07129785868764409, 0.05326451357035911, 0.025344160705373483], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 338.7857142857143, 138, 1126, 156.5, 1005.0, 1126.0, 1126.0, 0.07312308704781206, 4.622760360627396, 0.04171321190548319], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 630.1578947368423, 139, 1429, 811.0, 1191.0, 1429.0, 1429.0, 0.121314280606316, 18.789397211687035, 0.06595092238759274], "isController": false}, {"data": ["deleteBooks", 8, 0, 0.0, 771.375, 291, 1833, 431.0, 1833.0, 1833.0, 1833.0, 0.07782782539327374, 0.014060691111089492, 0.05365863742934693], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 125, 3, 2.4, 2145.2719999999977, 141, 26331, 250.0, 5673.4000000000015, 18149.099999999995, 25741.059999999987, 0.5227369671219357, 1.288542540073016, 0.24503295333840736], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 6, 0, 0.0, 154.66666666666666, 150, 163, 153.0, 163.0, 163.0, 163.0, 0.06895600606812854, 0.05340050079299407, 0.024511705282030064], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/08cc3273-4028-4586-8bf3-fb08f5e89f68", 1, 0, 0.0, 392.0, 392, 392, 392.0, 392.0, 392.0, 392.0, 2.5510204081632653, 0.8146324936224489, 1.5221420599489794], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 5, 0, 0.0, 300.8, 294, 304, 302.0, 304.0, 304.0, 304.0, 0.055297500552975005, 0.08570032556403451, 0.12436537477880999], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 612.2857142857143, 147, 6020, 162.5, 3316.0, 6020.0, 6020.0, 0.09190814437456508, 0.07458561325709334, 0.03267047319564618], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 163.84210526315792, 137, 461, 146.0, 165.0, 461.0, 461.0, 0.12131892830689857, 0.090159867618701, 0.0608964151852987], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 17, 0, 0.0, 5325.352941176468, 213, 19903, 6448.0, 10403.799999999992, 19903.0, 19903.0, 0.09323446823446822, 0.05727000050730519, 0.04215581913335819], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 253.57894736842107, 137, 488, 154.0, 448.0, 488.0, 488.0, 0.12132047761956453, 0.12836674302407253, 0.0638279404252602], "isController": false}, {"data": ["login", 17, 0, 0.0, 19464.41176470588, 2202, 53344, 22075.0, 43217.59999999999, 53344.0, 53344.0, 0.07824113919098662, 16.627415155826434, 0.14094461649185142], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f2cd43a5-d7f8-40cb-8bb1-7d702d1f6bb7", 3, 0, 0.0, 2072.6666666666665, 680, 4781, 757.0, 4781.0, 4781.0, 4781.0, 0.05867970660146699, 0.0265510391198044, 0.03762988997555012], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 6, 0, 0.0, 669.1666666666667, 286, 1004, 726.5, 1004.0, 1004.0, 1004.0, 0.06596088519507931, 0.10222648906698328, 0.14834757676198015], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 1979.9999999999993, 145, 25701, 153.5, 12936.5, 25701.0, 25701.0, 0.07074172700767548, 0.05727040204039353, 0.025146473272259644], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/339282a8-995f-453a-87b0-5c05bae1961c", 1, 0, 0.0, 321.0, 321, 321, 321.0, 321.0, 321.0, 321.0, 3.115264797507788, 0.9948160046728972, 1.8588152258566977], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f462195b-9493-4303-bd1d-9a667528a6df", 1, 0, 0.0, 541.0, 541, 541, 541.0, 541.0, 541.0, 541.0, 1.8484288354898337, 0.3339446626617375, 1.2744050369685767], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 8, 0, 0.0, 339.24999999999994, 289, 556, 309.5, 556.0, 556.0, 556.0, 0.045762139837658804, 0.0709223788304341, 0.1029201250450471], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e445e7b4-cc25-40dc-b3c5-8f7d25938029", 1, 0, 0.0, 2103.0, 2103, 2103, 2103.0, 2103.0, 2103.0, 2103.0, 0.47551117451260105, 0.15184780670470754, 0.2837278590109367], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e4325fee-9908-4df2-ba9b-8ce5f0f465cc", 3, 0, 0.0, 458.6666666666667, 247, 601, 528.0, 601.0, 601.0, 601.0, 0.07539203860072376, 0.034996434584841175, 0.04834710808705267], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e4325fee-9908-4df2-ba9b-8ce5f0f465cc", 1, 0, 0.0, 306.0, 306, 306, 306.0, 306.0, 306.0, 306.0, 3.2679738562091503, 0.5904054330065359, 2.2531147875816995], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f462195b-9493-4303-bd1d-9a667528a6df", 3, 0, 0.0, 2490.6666666666665, 486, 6405, 581.0, 6405.0, 6405.0, 6405.0, 0.03695582546995492, 0.03080855111606593, 0.02369888547389687], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 5, 0, 0.0, 162.0, 149, 183, 157.0, 183.0, 183.0, 183.0, 0.05118335926623536, 0.04243620314163459, 0.0181940847391696], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 1138.7368421052633, 283, 2071, 1428.0, 2064.0, 2071.0, 2071.0, 0.12120129621596795, 76.4041795609164, 0.2562632464245617], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f2cd43a5-d7f8-40cb-8bb1-7d702d1f6bb7", 1, 0, 0.0, 304.0, 304, 304, 304.0, 304.0, 304.0, 304.0, 3.289473684210526, 0.5942896792763158, 2.2679379111842106], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 2082.5789473684213, 144, 19637, 154.0, 6824.0, 19637.0, 19637.0, 0.1255301999233605, 0.09745752826081211, 0.044622063254007055], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fdc6e1cc-7888-435d-bd8d-719f48d7c2ef", 1, 0, 0.0, 2104.0, 2104, 2104, 2104.0, 2104.0, 2104.0, 2104.0, 0.4752851711026616, 0.15177563569391633, 0.2835930073669201], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9878ba38-d29e-4968-b716-bd52b74b4c9e", 1, 0, 0.0, 321.0, 321, 321, 321.0, 321.0, 321.0, 321.0, 3.115264797507788, 0.5628163940809968, 2.1478290498442365], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 597.7857142857142, 287, 1649, 570.0, 1439.0, 1649.0, 1649.0, 0.08924701022515745, 7.754896583034781, 0.1990875688476936], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 3, 0, 0.0, 1651.0, 1334, 1956, 1663.0, 1956.0, 1956.0, 1956.0, 0.06899724011039558, 82.54468649379025, 0.15558069083486661], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/41357ca8-b731-4a48-b5a5-91f2a2056c90", 3, 0, 0.0, 1519.6666666666667, 362, 3661, 536.0, 3661.0, 3661.0, 3661.0, 0.02306042600293636, 0.02312798584474184, 0.014788098706310102], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c6242b88-9ade-4002-b950-158c08987058", 3, 0, 0.0, 2327.6666666666665, 268, 6186, 529.0, 6186.0, 6186.0, 6186.0, 0.037273563104142336, 0.023963309612851924, 0.02390264300623711], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c6242b88-9ade-4002-b950-158c08987058", 1, 0, 0.0, 1833.0, 1833, 1833, 1833.0, 1833.0, 1833.0, 1833.0, 0.5455537370430987, 0.09856195444626296, 0.3761337288597927], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 178.0, 140, 590, 149.0, 333.20000000000016, 590.0, 590.0, 0.07227905497544922, 0.05371519612921568, 0.036280697516973534], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 235.06666666666666, 137, 574, 150.0, 497.80000000000007, 574.0, 574.0, 0.07228009984291124, 0.019340573590778985, 0.04122224444166032], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 259.8, 140, 444, 160.0, 439.2, 444.0, 444.0, 0.07227626880989896, 0.019480713077668077, 0.042490540843319505], "isController": false}, {"data": ["register", 18, 4, 22.22222222222222, 22101.611111111113, 516, 48413, 24682.0, 47702.9, 48413.0, 48413.0, 0.07306410563446028, 0.023117939673403448, 0.032964469534297505], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 169.73333333333335, 138, 427, 147.0, 278.80000000000007, 427.0, 427.0, 0.07227870669300825, 0.019481370163349877, 0.042562558726449186], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 57.142857142857146, 0.4044489383215369], "isController": false}, {"data": ["401/Unauthorized", 3, 42.857142857142854, 0.3033367037411527], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 989, 7, "406/Not Acceptable", 4, "401/Unauthorized", 3, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 18, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 125, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
