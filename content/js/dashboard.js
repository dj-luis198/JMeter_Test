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

    var data = {"OkPercent": 97.69173492181683, "KoPercent": 2.308265078183172};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8085241730279898, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7d028e5a-1e06-4877-8846-0b39234fec36"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c4800384-ce0f-438b-9519-3f32b948996a"], "isController": false}, {"data": [0.39285714285714285, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4d94b4bd-738a-42ae-a9a5-b91d9ce46697"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d94214db-857d-43f9-81a9-c1c70eb8498c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5f6d6a36-d45b-435b-9252-76c2bb1bcb40"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d5305508-d4fd-426f-b6e5-fb5718776314"], "isController": false}, {"data": [0.625, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.625, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bef3b051-d635-4b79-b84f-2ce454b20e30"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.78125, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eb022999-47fe-42c3-8a72-3bbe8d40666c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dce56626-a0a7-42e8-a788-472df10783cc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.71875, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7391304347826086, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4e610a00-64ae-435e-8963-69a13cb5ccbe"], "isController": false}, {"data": [0.043478260869565216, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4a27ea74-4262-4c45-8d6b-41a3bab43a45"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f26045fd-2feb-4835-b160-e6221dd7df1d"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d5305508-d4fd-426f-b6e5-fb5718776314"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d94214db-857d-43f9-81a9-c1c70eb8498c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8436b74c-4969-49c8-a977-c91ad1b273b7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4d94b4bd-738a-42ae-a9a5-b91d9ce46697"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=70959b44-53e7-426c-b221-2f24f8bb8cd7"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/eb022999-47fe-42c3-8a72-3bbe8d40666c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bef3b051-d635-4b79-b84f-2ce454b20e30"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.49107142857142855, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.6875, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.41304347826086957, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dce56626-a0a7-42e8-a788-472df10783cc"], "isController": false}, {"data": [0.35833333333333334, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c4800384-ce0f-438b-9519-3f32b948996a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bbb476da-1cf2-4c03-8556-d87f993969a8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8303571428571429, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7d028e5a-1e06-4877-8846-0b39234fec36"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9289772727272727, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/5f6d6a36-d45b-435b-9252-76c2bb1bcb40"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4e610a00-64ae-435e-8963-69a13cb5ccbe"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/70959b44-53e7-426c-b221-2f24f8bb8cd7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8436b74c-4969-49c8-a977-c91ad1b273b7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4a27ea74-4262-4c45-8d6b-41a3bab43a45"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1343, 31, 2.308265078183172, 301.4430379746838, 77, 3350, 95.0, 823.8000000000004, 1012.8, 1483.2399999999998, 5.417638184062543, 746.7188754316361, 3.9642345556467684], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/7d028e5a-1e06-4877-8846-0b39234fec36", 3, 0, 0.0, 269.3333333333333, 160, 464, 184.0, 464.0, 464.0, 464.0, 0.036965388074965806, 0.03081652306640216, 0.023705017743386278], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c4800384-ce0f-438b-9519-3f32b948996a", 3, 0, 0.0, 375.3333333333333, 271, 471, 384.0, 471.0, 471.0, 471.0, 0.06553652569031808, 0.029653571194512406, 0.04202700377927298], "isController": false}, {"data": ["see books", 56, 0, 0.0, 1351.8571428571422, 959, 2055, 1307.5, 1613.0, 1818.1, 2055.0, 0.2552985853723028, 307.21058585896577, 1.2553011497554147], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/4d94b4bd-738a-42ae-a9a5-b91d9ce46697", 3, 0, 0.0, 453.3333333333333, 176, 800, 384.0, 800.0, 800.0, 800.0, 0.05883621957677146, 0.02662185716527094, 0.03773025799682285], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d94214db-857d-43f9-81a9-c1c70eb8498c", 1, 0, 0.0, 437.0, 437, 437, 437.0, 437.0, 437.0, 437.0, 2.288329519450801, 0.41341890732265446, 1.577695938215103], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5f6d6a36-d45b-435b-9252-76c2bb1bcb40", 1, 0, 0.0, 424.0, 424, 424, 424.0, 424.0, 424.0, 424.0, 2.3584905660377355, 0.4260944870283019, 1.626068691037736], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d5305508-d4fd-426f-b6e5-fb5718776314", 3, 0, 0.0, 318.66666666666663, 176, 603, 177.0, 603.0, 603.0, 603.0, 0.015341658740142984, 0.02114971509261248, 0.009838238189479714], "isController": false}, {"data": ["deleteBook", 16, 3, 18.75, 466.625, 85, 825, 451.0, 806.1, 825.0, 825.0, 0.08640708538100125, 0.01746178342874116, 0.05795455696117082], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, 18.75, 466.625, 85, 825, 451.0, 806.1, 825.0, 825.0, 0.08704403884340234, 0.01759050369937165, 0.058381771414193616], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bef3b051-d635-4b79-b84f-2ce454b20e30", 1, 0, 0.0, 349.0, 349, 349, 349.0, 349.0, 349.0, 349.0, 2.865329512893983, 0.5176620702005731, 1.9755103868194843], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 102.06666666666668, 79, 254, 80.0, 243.20000000000002, 254.0, 254.0, 0.13431953722442108, 0.035940969921378296, 0.07660411107330264], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 94.13333333333334, 80, 262, 82.0, 155.80000000000007, 262.0, 262.0, 0.13431713170242487, 0.09981966525932161, 0.06742090399906873], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 128.2, 78, 319, 81.0, 274.6, 319.0, 319.0, 0.13431953722442108, 0.036203312767519744, 0.0790963681116464], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 171.4666666666667, 78, 338, 234.0, 282.20000000000005, 338.0, 338.0, 0.13432194283258111, 0.03620396115409413, 0.0789666109230604], "isController": false}, {"data": ["goToProfile", 16, 3, 18.75, 195.0, 81, 502, 174.0, 345.90000000000015, 502.0, 502.0, 0.086547303510575, 0.17576223325850598, 0.05593563213339103], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eb022999-47fe-42c3-8a72-3bbe8d40666c", 1, 0, 0.0, 468.0, 468, 468, 468.0, 468.0, 468.0, 468.0, 2.136752136752137, 0.38603432158119655, 1.473190438034188], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 93.3125, 80, 250, 82.5, 138.0000000000001, 250.0, 250.0, 0.10621701463803232, 0.07893666810502208, 0.05331596242573108], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 111.8125, 77, 241, 82.0, 238.2, 241.0, 241.0, 0.10610853576852422, 0.048313578908275805, 0.0594010919231509], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 571.25, 402, 674, 617.0, 674.0, 674.0, 674.0, 0.07199812804867073, 21.16984020915456, 0.041061432402757524], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 849.25, 695, 1005, 829.5, 1005.0, 1005.0, 1005.0, 0.07172957948534027, 64.54240170806061, 0.04083822738276697], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 167.5, 79, 281, 164.0, 281.0, 281.0, 281.0, 0.07220281771496133, 0.12776514228467764, 0.039979489887092844], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 111.125, 80, 243, 81.5, 239.5, 243.0, 243.0, 0.09467455621301775, 0.07035872781065089, 0.047522189349112426], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 121.37499999999999, 78, 245, 81.0, 243.6, 245.0, 245.0, 0.09467791755920328, 0.02533373965939619, 0.053995999857983125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 149.87499999999997, 77, 263, 86.0, 244.10000000000002, 263.0, 263.0, 0.09467847780677306, 0.0255188084713568, 0.05566058949187245], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 90.125, 78, 235, 79.0, 132.1000000000001, 235.0, 235.0, 0.09467847780677306, 0.0255188084713568, 0.05575304894285562], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dce56626-a0a7-42e8-a788-472df10783cc", 3, 0, 0.0, 245.0, 168, 377, 190.0, 377.0, 377.0, 377.0, 0.03239495934432602, 0.032489866451780106, 0.020774111298281987], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 102.625, 78, 237, 83.0, 237.0, 237.0, 237.0, 0.07220542443251049, 0.05366047655580125, 0.04054503813348978], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 670.2666666666667, 78, 1080, 931.0, 1062.0, 1080.0, 1080.0, 0.0808385653849263, 48.499718328123734, 0.04289285858640295], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 204.0, 78, 929, 82.0, 877.9000000000001, 929.0, 929.0, 0.10610783208435573, 11.959526182936536, 0.06123996949399828], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 440.06666666666666, 78, 780, 626.0, 730.2, 780.0, 780.0, 0.08083769407783052, 15.853240176872875, 0.042971339332388434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 138.37500000000003, 80, 667, 82.0, 482.9000000000002, 667.0, 667.0, 0.10621560439998141, 3.9289141694935505, 0.06140589629373926], "isController": false}, {"data": ["deleteBooks", 16, 3, 18.75, 520.0, 86, 3350, 392.5, 1379.500000000002, 3350.0, 3350.0, 0.08565998340337821, 0.01731080353079744, 0.05791355201167117], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 263.74999999999994, 160, 482, 169.5, 479.2, 482.0, 482.0, 0.09462976105985332, 0.14665764726756564, 0.21282455050863494], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 550.7826086956522, 129, 1120, 573.0, 1036.0, 1109.6, 1120.0, 0.09630119664704355, 0.059153762393545306, 0.04354243559334098], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 82.46666666666665, 79, 89, 82.0, 87.8, 89.0, 89.0, 0.08083464465090211, 0.060073402909508314, 0.040575202490784855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 112.93333333333332, 78, 247, 81.0, 244.0, 247.0, 247.0, 0.08083769407783052, 0.10257335010266388, 0.04157667859471753], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4e610a00-64ae-435e-8963-69a13cb5ccbe", 3, 0, 0.0, 388.0, 167, 502, 495.0, 502.0, 502.0, 502.0, 0.049020408830209646, 0.030494141039886274, 0.03143561373551856], "isController": false}, {"data": ["login", 23, 0, 0.0, 2488.9565217391305, 1189, 3874, 2344.0, 3771.8, 3865.4, 3874.0, 0.10110956760273612, 42.20930346772846, 0.21086960135354937], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/4a27ea74-4262-4c45-8d6b-41a3bab43a45", 3, 0, 0.0, 415.3333333333333, 279, 491, 476.0, 491.0, 491.0, 491.0, 0.0160087941642609, 0.022069415132045873, 0.010266056153513664], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 97.87500000000001, 82, 248, 87.5, 148.6000000000001, 248.0, 248.0, 0.10055620148948874, 0.08140731546365836, 0.0357445872482167], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f26045fd-2feb-4835-b160-e6221dd7df1d", 1, 0, 0.0, 481.0, 481, 481, 481.0, 481.0, 481.0, 481.0, 2.079002079002079, 0.663900077962578, 1.2404983108108107], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d5305508-d4fd-426f-b6e5-fb5718776314", 1, 0, 0.0, 3350.0, 3350, 3350, 3350.0, 3350.0, 3350.0, 3350.0, 0.2985074626865672, 0.05392957089552239, 0.20580690298507462], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 753.8666666666666, 160, 1161, 1013.0, 1147.8, 1161.0, 1161.0, 0.08079981038977828, 64.4848504984675, 0.16793840798786924], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d94214db-857d-43f9-81a9-c1c70eb8498c", 3, 0, 0.0, 1105.6666666666665, 178, 2885, 254.0, 2885.0, 2885.0, 2885.0, 0.023284874921413547, 0.023353092328409875, 0.014932032420307516], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8436b74c-4969-49c8-a977-c91ad1b273b7", 1, 0, 0.0, 535.0, 535, 535, 535.0, 535.0, 535.0, 535.0, 1.8691588785046729, 0.3376898364485981, 1.288697429906542], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4d94b4bd-738a-42ae-a9a5-b91d9ce46697", 1, 0, 0.0, 195.0, 195, 195, 195.0, 195.0, 195.0, 195.0, 5.128205128205129, 0.9264823717948718, 3.535657051282051], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=70959b44-53e7-426c-b221-2f24f8bb8cd7", 1, 0, 0.0, 413.0, 413, 413, 413.0, 413.0, 413.0, 413.0, 2.4213075060532687, 0.4374432506053269, 1.6693780266343827], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 293.6666666666667, 163, 600, 320.0, 481.20000000000005, 600.0, 600.0, 0.13421617752326415, 0.20800886106388689, 0.30185532894148176], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 6, 42.857142857142854, 579.0, 80, 1086, 890.5, 1063.5, 1086.0, 1086.0, 0.1254334172542625, 85.76408410086638, 0.1972408987976311], "isController": false}, {"data": ["register", 26, 9, 34.61538461538461, 841.1538461538461, 207, 1701, 762.5, 1641.0, 1684.8999999999999, 1701.0, 0.1014080112328874, 0.031644296774445184, 0.04575244256796287], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 308.8125, 162, 1010, 169.0, 961.0, 1010.0, 1010.0, 0.10605086464595581, 16.003026281558416, 0.23511911666257929], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 85.70588235294116, 81, 94, 84.0, 92.4, 94.0, 94.0, 0.08921121542409437, 0.06926066041226077, 0.03171179923278355], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 306.99999999999994, 161, 1094, 172.0, 721.4000000000002, 1094.0, 1094.0, 0.07586716165774805, 6.160640732952649, 0.16933293640055838], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eb022999-47fe-42c3-8a72-3bbe8d40666c", 3, 0, 0.0, 287.6666666666667, 171, 422, 270.0, 422.0, 422.0, 422.0, 0.03612325253765849, 0.030114469319317508, 0.023164976399475005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 81.66666666666667, 79, 87, 80.5, 86.10000000000001, 87.0, 87.0, 0.06591306067297234, 0.04898421794153512, 0.033085266783113076], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bef3b051-d635-4b79-b84f-2ce454b20e30", 3, 0, 0.0, 262.0, 190, 394, 202.0, 394.0, 394.0, 394.0, 0.03482177057096097, 0.02902947735424187, 0.022330367195570668], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 94.08333333333333, 77, 247, 80.0, 198.70000000000016, 247.0, 247.0, 0.0659108884787767, 0.01763631195623517, 0.037589803585552334], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 81.91666666666667, 79, 88, 81.0, 87.4, 88.0, 88.0, 0.06591125050120013, 0.0177651417366516, 0.03874860625168211], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 113.66666666666666, 78, 321, 80.0, 294.9000000000001, 321.0, 321.0, 0.06591197455797781, 0.017765336892579957, 0.03881339908052795], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 90.0, 86, 97, 87.0, 97.0, 97.0, 97.0, 0.060122650206421095, 0.017731484728846846, 0.03716566169986773], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 931.625, 618, 1713, 857.5, 1259.5, 1465.7, 1713.0, 0.2564407850751463, 306.7923321915613, 0.506370378341744], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 9, 34.61538461538461, 841.1538461538461, 207, 1701, 762.5, 1641.0, 1684.8999999999999, 1701.0, 0.10488353893196285, 0.03272883268655151, 0.047320502916569175], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 10, 0, 0.0, 129.3, 77, 245, 82.5, 244.7, 245.0, 245.0, 0.0585675547460218, 0.01578578624013869, 0.034488511242042136], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 10, 0, 0.0, 97.3, 78, 245, 80.0, 229.30000000000007, 245.0, 245.0, 0.058623519756126154, 0.015800870559268376, 0.034464217669128855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 98.99999999999999, 78, 246, 80.0, 236.39999999999998, 246.0, 246.0, 0.0859814785779675, 0.0231746953979678, 0.050547705179625424], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 126.82352941176471, 78, 246, 81.0, 243.6, 246.0, 246.0, 0.08591586310065297, 0.02315700997634787, 0.05059303266571654], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 82.6470588235294, 80, 85, 82.0, 85.0, 85.0, 85.0, 0.08597930427570023, 0.063896729056453, 0.043157580466513586], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 10, 0, 0.0, 128.2, 78, 242, 83.0, 241.8, 242.0, 242.0, 0.0585675547460218, 0.015671396484775366, 0.03340180856609056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 98.05882352941175, 77, 234, 80.0, 233.2, 234.0, 234.0, 0.08591586310065297, 0.022989205556229405, 0.04899889067459114], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 10, 0, 0.0, 127.6, 79, 388, 80.5, 373.50000000000006, 388.0, 388.0, 0.05862317608643401, 0.043566637697047154, 0.029426086434010824], "isController": false}, {"data": ["deleteAccount", 16, 3, 18.75, 561.5625, 80, 2885, 399.0, 1612.4000000000015, 2885.0, 2885.0, 0.08547419480637423, 0.016835035805674418, 0.05816356188331704], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 141.6, 81, 327, 88.5, 318.90000000000003, 327.0, 327.0, 0.05748249657979146, 0.045245011956359285, 0.020433231206097743], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1327.086956521739, 752, 2837, 1234.0, 2156.2000000000007, 2748.199999999999, 2837.0, 0.09994741896654369, 0.051730597707293116, 0.04597190852855671], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 0, 0.0, 275.59999999999997, 161, 631, 168.5, 616.8000000000001, 631.0, 631.0, 0.05853978363695968, 0.0907252310857959, 0.1316573454257013], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dce56626-a0a7-42e8-a788-472df10783cc", 1, 0, 0.0, 392.0, 392, 392, 392.0, 392.0, 392.0, 392.0, 2.5510204081632653, 0.46087771045918363, 1.7588089923469388], "isController": false}, {"data": ["addBook", 60, 10, 16.666666666666668, 876.1166666666668, 408, 2452, 691.0, 1532.6, 1572.75, 2452.0, 0.28879615323523894, 76.00129067062078, 1.0526864209252067], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c4800384-ce0f-438b-9519-3f32b948996a", 1, 0, 0.0, 305.0, 305, 305, 305.0, 305.0, 305.0, 305.0, 3.278688524590164, 0.5923411885245902, 2.260502049180328], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bbb476da-1cf2-4c03-8556-d87f993969a8", 1, 0, 0.0, 226.0, 226, 226, 226.0, 226.0, 226.0, 226.0, 4.424778761061947, 1.4129908738938053, 2.6401756084070795], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 142.85714285714283, 79, 346, 84.0, 330.20000000000005, 342.15, 346.0, 0.2574771833835261, 0.19134778960435872, 0.12446406813949745], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 512.375, 384, 732, 475.0, 688.2, 717.75, 732.0, 0.25737778002472667, 75.67761307387201, 0.1294429264772795], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7d028e5a-1e06-4877-8846-0b39234fec36", 1, 0, 0.0, 393.0, 393, 393, 393.0, 393.0, 393.0, 393.0, 2.544529262086514, 0.45970499363867684, 1.754333651399491], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 136.7857142857143, 79, 337, 85.5, 243.60000000000002, 259.4499999999999, 337.0, 0.2576501387169943, 0.4559199720265564, 0.12530250886822578], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 785.0, 535, 1378, 767.5, 1000.0, 1121.8999999999999, 1378.0, 0.25689133955071536, 231.1512788945415, 0.12894741067291768], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 96.86666666666667, 82, 246, 85.0, 159.60000000000005, 246.0, 246.0, 0.07679901697258276, 0.0573742656094002, 0.027299650564472776], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 10, 5.681818181818182, 147.87500000000006, 80, 1117, 87.0, 258.6, 348.6, 1029.9899999999989, 0.7277960186249618, 1.5617747238717095, 0.35018399076195283], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 98.75, 80, 243, 86.0, 197.10000000000016, 243.0, 243.0, 0.06450225757901526, 0.04995145533218663, 0.022928536873790584], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5f6d6a36-d45b-435b-9252-76c2bb1bcb40", 3, 0, 0.0, 662.0, 172, 1067, 747.0, 1067.0, 1067.0, 1067.0, 0.018041965612013544, 0.021324992557689184, 0.011569880291558164], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 96.13333333333334, 80, 271, 84.0, 160.60000000000008, 271.0, 271.0, 0.1317800853934953, 0.10694262789257288, 0.04684370222971905], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 211.58333333333331, 160, 402, 166.5, 380.70000000000005, 402.0, 402.0, 0.06588157786378983, 0.10210357819319772, 0.14816921271514452], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 220.23529411764707, 162, 328, 166.0, 327.2, 328.0, 328.0, 0.08587810360940618, 0.13309428752746835, 0.19314186778560782], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 108.93749999999999, 80, 255, 86.0, 248.70000000000002, 255.0, 255.0, 0.0955041424921806, 0.07918263376548958, 0.03394873815151732], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4e610a00-64ae-435e-8963-69a13cb5ccbe", 1, 0, 0.0, 389.0, 389, 389, 389.0, 389.0, 389.0, 389.0, 2.5706940874035986, 0.46443203727506427, 1.7723730719794344], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/70959b44-53e7-426c-b221-2f24f8bb8cd7", 3, 0, 0.0, 753.6666666666666, 166, 1691, 404.0, 1691.0, 1691.0, 1691.0, 0.01948760588265863, 0.02686523792742816, 0.012496934761991374], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 86.26666666666665, 80, 99, 85.0, 95.4, 99.0, 99.0, 0.08480517424636469, 0.06583995461509758, 0.030145589282887447], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8436b74c-4969-49c8-a977-c91ad1b273b7", 3, 0, 0.0, 246.33333333333331, 168, 386, 185.0, 386.0, 386.0, 386.0, 0.019072928521021545, 0.026293571707853597, 0.012231012104951968], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4a27ea74-4262-4c45-8d6b-41a3bab43a45", 1, 0, 0.0, 400.0, 400, 400, 400.0, 400.0, 400.0, 400.0, 2.5, 0.45166015625, 1.7236328125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 102.73333333333332, 80, 243, 83.0, 236.4, 243.0, 243.0, 0.07589825585808038, 0.056404856160155434, 0.038097366710013], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 101.86666666666666, 77, 241, 81.0, 238.6, 241.0, 241.0, 0.07590094420774594, 0.02790940969305658, 0.042862291019400284], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 173.86666666666665, 78, 850, 81.0, 487.60000000000025, 850.0, 850.0, 0.07590056014613387, 4.572124230558071, 0.04418638078299018], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 167.33333333333331, 78, 479, 84.0, 391.40000000000003, 479.0, 479.0, 0.07589979203456981, 1.506897472663425, 0.04426005450870065], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 29.032258064516128, 0.6701414743112435], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 9.67741935483871, 0.22338049143708116], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 9.67741935483871, 0.22338049143708116], "isController": false}, {"data": ["401/Unauthorized", 16, 51.61290322580645, 1.1913626209977661], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1343, 31, "401/Unauthorized", 16, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
