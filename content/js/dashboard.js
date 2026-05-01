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

    var data = {"OkPercent": 99.08326967150497, "KoPercent": 0.9167303284950343};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7735352205398288, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.017543859649122806, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/11866775-0633-4506-843c-56972873a2d1"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.75, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/722be64d-79e3-484e-bc23-e234a2170acb"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f79da52c-44e5-47b7-a9a5-98cc97a93a2c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5e743309-9199-4cdc-b3b2-843ba67214b6"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e0ae0daa-0e9f-4a11-acfa-9c3d0adb29c1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.59375, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5e89f79d-6947-4db2-910d-b54ebe702628"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d616ac30-2b27-4ff3-a455-e203d990b3b2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5b4b6b67-ad53-4adb-9912-1f264fcf4039"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0f435a60-4b71-4606-8c89-2a119d887051"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c9d67ca3-3de9-4242-a4cf-5eb4fa49ea96"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9e44d931-0edb-40ce-a2a1-92d14a1f5034"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3713cb2b-9628-4b79-bca0-59ac1b396df3"], "isController": false}, {"data": [0.5625, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a606cd31-f869-4cdf-a3c5-f3d517908772"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ee4fac07-4b9a-4de5-8626-3ddbc1b9c1c1"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0c6f7730-03e5-4dbe-98e1-1010b89926f8"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.38095238095238093, 500, 1500, "register"], "isController": true}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5e743309-9199-4cdc-b3b2-843ba67214b6"], "isController": false}, {"data": [0.8157894736842105, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=722be64d-79e3-484e-bc23-e234a2170acb"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.34210526315789475, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.38095238095238093, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.325, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e0ae0daa-0e9f-4a11-acfa-9c3d0adb29c1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5e89f79d-6947-4db2-910d-b54ebe702628"], "isController": false}, {"data": [0.30833333333333335, 500, 1500, "addBook"], "isController": true}, {"data": [0.9385964912280702, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9912280701754386, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4298245614035088, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/5b4b6b67-ad53-4adb-9912-1f264fcf4039"], "isController": false}, {"data": [0.963276836158192, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d616ac30-2b27-4ff3-a455-e203d990b3b2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ee4fac07-4b9a-4de5-8626-3ddbc1b9c1c1"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/db569bae-3ee0-441b-820b-4b3742559d03"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c9d67ca3-3de9-4242-a4cf-5eb4fa49ea96"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e7acc726-d84a-4eb5-84e0-60390bd019e6"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/0f435a60-4b71-4606-8c89-2a119d887051"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3713cb2b-9628-4b79-bca0-59ac1b396df3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a606cd31-f869-4cdf-a3c5-f3d517908772"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0c6f7730-03e5-4dbe-98e1-1010b89926f8"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9e44d931-0edb-40ce-a2a1-92d14a1f5034"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1309, 12, 0.9167303284950343, 417.20244461420964, 115, 2344, 143.0, 1167.0, 1392.0, 1821.8000000000002, 5.081068072338262, 718.4538315496385, 3.7102233387061716], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 2030.5789473684213, 1467, 2789, 1999.0, 2532.6000000000004, 2590.8999999999996, 2789.0, 0.26982631706012394, 324.69169957886976, 1.3267338929665273], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/11866775-0633-4506-843c-56972873a2d1", 1, 0, 0.0, 219.0, 219, 219, 219.0, 219.0, 219.0, 219.0, 4.5662100456621, 1.4581549657534247, 2.724564783105023], "isController": false}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 522.3571428571428, 131, 856, 482.0, 824.0, 856.0, 856.0, 0.07299422302863459, 0.01378315860341196, 0.04936376899153267], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 522.3571428571428, 131, 856, 482.0, 824.0, 856.0, 856.0, 0.0715307582260372, 0.01350681937206213, 0.04837407233547926], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 139.1111111111111, 117, 364, 126.0, 162.40000000000032, 364.0, 364.0, 0.09659347028140898, 0.03390623658424024, 0.054637777840384656], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 127.33333333333331, 121, 141, 127.0, 134.70000000000002, 141.0, 141.0, 0.09658621392773205, 0.07177940312402743, 0.04848175191294363], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 221.27777777777777, 118, 990, 127.0, 541.8000000000008, 990.0, 990.0, 0.09614871000480743, 1.5950816429410821, 0.05615977712194861], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 225.38888888888889, 119, 1440, 124.5, 486.0000000000015, 1440.0, 1440.0, 0.0959181498454652, 4.819267766505915, 0.05593143850580838], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/722be64d-79e3-484e-bc23-e234a2170acb", 3, 0, 0.0, 311.3333333333333, 228, 466, 240.0, 466.0, 466.0, 466.0, 0.03397431541754434, 0.027814258878621094, 0.021786914509297636], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 235.35714285714286, 126, 393, 224.5, 347.0, 393.0, 393.0, 0.07252608348788296, 0.160082509752168, 0.0468819207367614], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 146.33333333333334, 119, 461, 125.0, 261.20000000000016, 461.0, 461.0, 0.0897897124933406, 0.066728487507258, 0.04507022677888386], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f79da52c-44e5-47b7-a9a5-98cc97a93a2c", 1, 0, 0.0, 394.0, 394, 394, 394.0, 394.0, 394.0, 394.0, 2.5380710659898473, 0.8104973032994923, 1.5144154505076142], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 171.66666666666666, 117, 375, 126.0, 366.6, 375.0, 375.0, 0.089653399955771, 0.032966302275403286, 0.05062848901148161], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 820.6666666666666, 717, 1000, 745.0, 1000.0, 1000.0, 1000.0, 0.03517823639774859, 10.343569528318481, 0.020062587945590994], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 1117.6666666666667, 1078, 1187, 1088.0, 1187.0, 1187.0, 1187.0, 0.03498542274052478, 31.47994487973761, 0.019918458454810495], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 287.3333333333333, 125, 380, 357.0, 380.0, 380.0, 380.0, 0.035327366933584556, 0.06251287976919453, 0.0195611494642016], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 157.12500000000003, 121, 385, 127.0, 372.40000000000003, 385.0, 385.0, 0.08505525933880168, 0.06321001206721492, 0.042693753222796935], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 185.8125, 118, 377, 125.5, 375.6, 377.0, 377.0, 0.08505616364805886, 0.038727965137604924, 0.04761566973754858], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5e743309-9199-4cdc-b3b2-843ba67214b6", 1, 0, 0.0, 2344.0, 2344, 2344, 2344.0, 2344.0, 2344.0, 2344.0, 0.42662116040955633, 0.07707511198805461, 0.2941352922354949], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 381.375, 118, 1510, 240.0, 1409.9, 1510.0, 1510.0, 0.08443449993667412, 9.516701952152024, 0.04873123970954532], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 283.3125, 120, 1096, 127.5, 830.7000000000003, 1096.0, 1096.0, 0.08461937148961826, 3.13006972503993, 0.04892057414243556], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e0ae0daa-0e9f-4a11-acfa-9c3d0adb29c1", 1, 0, 0.0, 803.0, 803, 803, 803.0, 803.0, 803.0, 803.0, 1.2453300124533002, 0.22498637920298878, 0.8585966687422166], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 124.33333333333333, 122, 126, 125.0, 126.0, 126.0, 126.0, 0.035423308537017355, 0.026325329879560752, 0.019891017977329083], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 884.3750000000001, 119, 1769, 1082.5, 1675.9, 1769.0, 1769.0, 0.07621951219512195, 42.87173573563739, 0.040714915205792686], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 279.33333333333337, 120, 1467, 126.0, 813.6000000000004, 1467.0, 1467.0, 0.08965179243817015, 5.400475724162353, 0.05219181822800244], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 603.5625, 121, 1106, 739.0, 1094.8, 1106.0, 1106.0, 0.07622205389851985, 14.015088244891931, 0.04079070853162977], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 208.73333333333335, 120, 909, 127.0, 590.4000000000002, 909.0, 909.0, 0.08978810008380222, 1.7826328302705614, 0.052358854977253684], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5e89f79d-6947-4db2-910d-b54ebe702628", 3, 0, 0.0, 318.0, 221, 464, 269.0, 464.0, 464.0, 464.0, 0.02626579230762496, 0.026342742871026205, 0.016843623322272516], "isController": false}, {"data": ["deleteBooks", 13, 0, 0.0, 671.7692307692307, 269, 2344, 504.0, 1727.5999999999995, 2344.0, 2344.0, 0.06636275926143353, 0.011989365686880082, 0.04575401175641804], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d616ac30-2b27-4ff3-a455-e203d990b3b2", 3, 0, 0.0, 491.0, 393, 599, 481.0, 599.0, 599.0, 599.0, 0.017911624046952335, 0.024692619739206754, 0.011486295368651075], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5b4b6b67-ad53-4adb-9912-1f264fcf4039", 1, 0, 0.0, 325.0, 325, 325, 325.0, 325.0, 325.0, 325.0, 3.076923076923077, 0.555889423076923, 2.121394230769231], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 556.4374999999999, 246, 1734, 484.5, 1666.1000000000001, 1734.0, 1734.0, 0.08437794993223395, 12.732593504611783, 0.1870693758141154], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 670.05, 158, 1700, 534.5, 1178.8000000000002, 1674.5999999999997, 1700.0, 0.09180755300738593, 0.05639350668129467, 0.04151064164298797], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 125.875, 118, 133, 127.0, 131.6, 133.0, 133.0, 0.0762206014758214, 0.056644411838964924, 0.03825916910016816], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 275.3125, 120, 514, 368.5, 424.4000000000001, 514.0, 514.0, 0.07622205389851985, 0.0919465742950651, 0.039469476640322416], "isController": false}, {"data": ["login", 20, 0, 0.0, 2654.35, 1686, 4198, 2576.0, 3657.6, 4171.0, 4198.0, 0.08947024666947007, 16.181179031920745, 0.1572457059873489], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0f435a60-4b71-4606-8c89-2a119d887051", 1, 0, 0.0, 504.0, 504, 504, 504.0, 504.0, 504.0, 504.0, 1.984126984126984, 0.35846044146825395, 1.3679625496031746], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 132.33333333333331, 121, 152, 129.0, 150.8, 152.0, 152.0, 0.08836316080917092, 0.07153619170976826, 0.031410342318884975], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c9d67ca3-3de9-4242-a4cf-5eb4fa49ea96", 1, 0, 0.0, 800.0, 800, 800, 800.0, 800.0, 800.0, 800.0, 1.25, 0.225830078125, 0.86181640625], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9e44d931-0edb-40ce-a2a1-92d14a1f5034", 1, 0, 0.0, 464.0, 464, 464, 464.0, 464.0, 464.0, 464.0, 2.155172413793103, 0.3893622036637931, 1.4858903556034482], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3713cb2b-9628-4b79-bca0-59ac1b396df3", 1, 0, 0.0, 447.0, 447, 447, 447.0, 447.0, 447.0, 447.0, 2.237136465324385, 0.4041701621923937, 1.5424007270693512], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 1021.1249999999998, 249, 1904, 1232.5, 1806.0, 1904.0, 1904.0, 0.07617379050303266, 57.00073027158337, 0.15913552864610608], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a606cd31-f869-4cdf-a3c5-f3d517908772", 1, 0, 0.0, 269.0, 269, 269, 269.0, 269.0, 269.0, 269.0, 3.717472118959108, 0.6716136152416357, 2.5630227695167282], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ee4fac07-4b9a-4de5-8626-3ddbc1b9c1c1", 1, 0, 0.0, 642.0, 642, 642, 642.0, 642.0, 642.0, 642.0, 1.557632398753894, 0.2814081970404984, 1.0739145249221183], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 403.11111111111114, 249, 1570, 259.5, 715.0000000000014, 1570.0, 1570.0, 0.0958451142952988, 6.510515465341342, 0.2141955266955267], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0c6f7730-03e5-4dbe-98e1-1010b89926f8", 3, 0, 0.0, 392.3333333333333, 210, 616, 351.0, 616.0, 616.0, 616.0, 0.03590234561991384, 0.02993030831139301, 0.02302331408568693], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 1, 25.0, 963.5, 126, 1309, 1209.5, 1309.0, 1309.0, 1309.0, 0.04157053480493027, 37.30238975364262, 0.07701103957514914], "isController": false}, {"data": ["register", 21, 4, 19.047619047619047, 1067.8095238095239, 338, 1603, 1122.0, 1413.8, 1584.7999999999997, 1603.0, 0.08585937052815779, 0.027262266646496527, 0.03873733318750869], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 475.53333333333336, 244, 1593, 480.0, 1141.2000000000003, 1593.0, 1593.0, 0.08958646885974342, 7.274689564221553, 0.19995396561969947], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 145.9375, 125, 378, 129.5, 210.70000000000016, 378.0, 378.0, 0.10584110603955811, 0.08217156181782101, 0.03762320566249917], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5e743309-9199-4cdc-b3b2-843ba67214b6", 3, 0, 0.0, 330.6666666666667, 203, 552, 237.0, 552.0, 552.0, 552.0, 0.03887521057405728, 0.024993014610599974, 0.024929741155889595], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 545.3684210526316, 248, 1322, 497.0, 1195.0, 1322.0, 1322.0, 0.09671376796840005, 12.313403470433585, 0.21490678097131166], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 153.88888888888889, 123, 370, 127.0, 370.0, 370.0, 370.0, 0.04526753110885332, 0.033641202318200565, 0.02272217870112364], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 187.22222222222223, 126, 446, 127.0, 446.0, 446.0, 446.0, 0.04526844186023117, 0.019667408985282728, 0.025394731382095827], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=722be64d-79e3-484e-bc23-e234a2170acb", 1, 0, 0.0, 735.0, 735, 735, 735.0, 735.0, 735.0, 735.0, 1.3605442176870748, 0.2458014455782313, 0.938031462585034], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 290.33333333333337, 119, 1372, 124.0, 1372.0, 1372.0, 1372.0, 0.04498695378340282, 4.508482579114557, 0.026017845449819554], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 271.1111111111111, 119, 953, 125.0, 953.0, 953.0, 953.0, 0.0450815976918222, 1.4836326407046754, 0.026116606996163055], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1377.0526315789473, 951, 2257, 1255.0, 2014.4, 2080.7999999999997, 2257.0, 0.24867048543096343, 297.49635242388285, 0.49102707181778127], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 4, 19.047619047619047, 1067.8095238095239, 338, 1603, 1122.0, 1413.8, 1584.7999999999997, 1603.0, 0.081514461053555, 0.02588266090372366, 0.036777032233146885], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 189.375, 121, 376, 126.0, 376.0, 376.0, 376.0, 0.04198285000577264, 0.011315690040618408, 0.024722322806133692], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 154.5, 121, 362, 125.0, 362.0, 362.0, 362.0, 0.04203756056036068, 0.011330436244784714, 0.02471348775130579], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 153.1875, 115, 368, 125.5, 360.3, 368.0, 368.0, 0.10520571003991241, 0.028356226534195145, 0.061849450628932885], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 169.375, 118, 374, 125.0, 373.3, 374.0, 374.0, 0.10536644473859244, 0.028399549558448742, 0.0620468419700891], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 154.5, 120, 358, 124.5, 358.0, 358.0, 358.0, 0.04198637542117583, 0.011234635610744313, 0.02394535473238934], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 156.625, 117, 396, 125.5, 377.1, 396.0, 396.0, 0.10537199607489314, 0.07830868067675165, 0.052891802717280355], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 157.0, 121, 384, 125.0, 384.0, 384.0, 384.0, 0.04203844415718174, 0.031241460941030575, 0.021101328414835367], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 170.24999999999997, 119, 376, 126.0, 371.1, 376.0, 376.0, 0.1052029430523319, 0.028150006246424747, 0.05999855345953303], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 130.99999999999997, 126, 140, 130.0, 140.0, 140.0, 140.0, 0.041033216388666624, 0.03229762930592314, 0.01458602613815884], "isController": false}, {"data": ["deleteAccount", 11, 0, 0.0, 497.90909090909093, 428, 616, 466.0, 605.8000000000001, 616.0, 616.0, 0.06325765417615531, 0.01142838478768431, 0.04305721187576197], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1361.3999999999999, 800, 2117, 1265.0, 1753.1000000000001, 2099.1499999999996, 2117.0, 0.090534197029573, 0.04685851994694696, 0.04164219414153211], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 348.25, 248, 758, 255.5, 758.0, 758.0, 758.0, 0.04195598816841133, 0.06502358713209844, 0.0943600007342298], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e0ae0daa-0e9f-4a11-acfa-9c3d0adb29c1", 3, 0, 0.0, 309.0, 222, 428, 277.0, 428.0, 428.0, 428.0, 0.02813546287525674, 0.02821789098914909, 0.018042598263104094], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5e89f79d-6947-4db2-910d-b54ebe702628", 1, 0, 0.0, 511.0, 511, 511, 511.0, 511.0, 511.0, 511.0, 1.9569471624266144, 0.35355002446183953, 1.349223336594912], "isController": false}, {"data": ["addBook", 60, 6, 10.0, 1253.5666666666666, 636, 2490, 1006.0, 2232.8999999999996, 2370.2999999999997, 2490.0, 0.2891622007171223, 99.10878647208861, 1.050015534938023], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 210.80701754385964, 121, 517, 128.0, 508.2, 513.4, 517.0, 0.24986191841350833, 0.1856883983522264, 0.1207828609518424], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 775.9298245614037, 590, 1032, 744.0, 1000.0, 1007.6999999999999, 1032.0, 0.2493874693734687, 73.32819643911883, 0.12542436203841442], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 182.05263157894737, 116, 512, 129.0, 377.4, 383.99999999999994, 512.0, 0.25031069265799216, 0.44293259286746267, 0.12173312982781259], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 1164.929824561404, 823, 1746, 1128.0, 1562.2, 1608.3, 1746.0, 0.24924243418032033, 224.26878039691857, 0.1251080187194186], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 169.26315789473682, 125, 379, 130.0, 374.0, 379.0, 379.0, 0.10001105385332064, 0.07471528925565457, 0.03555080429942257], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5b4b6b67-ad53-4adb-9912-1f264fcf4039", 3, 0, 0.0, 1001.3333333333333, 237, 2312, 455.0, 2312.0, 2312.0, 2312.0, 0.0656943896991197, 0.02972500054745325, 0.04212823818595892], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 6, 3.389830508474576, 184.16384180790953, 120, 522, 131.0, 348.80000000000007, 370.79999999999995, 490.79999999999995, 0.7210921490583025, 1.5391280017497688, 0.34715847807798383], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 130.0, 121, 141, 130.0, 141.0, 141.0, 141.0, 0.044440933062079045, 0.0344156835138952, 0.01579736292441091], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d616ac30-2b27-4ff3-a455-e203d990b3b2", 1, 0, 0.0, 446.0, 446, 446, 446.0, 446.0, 446.0, 446.0, 2.242152466367713, 0.40507637331838564, 1.5458590246636772], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 132.05555555555554, 124, 148, 130.5, 143.5, 148.0, 148.0, 0.09530919892618303, 0.07734564873794736, 0.033879441805791624], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ee4fac07-4b9a-4de5-8626-3ddbc1b9c1c1", 2, 0, 0.0, 218.0, 209, 227, 218.0, 227.0, 227.0, 227.0, 0.01113226240968952, 0.02201448376916141, 0.006919614281022833], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 510.6666666666667, 249, 1502, 264.0, 1502.0, 1502.0, 1502.0, 0.044957066001968124, 6.037964212926655, 0.0998314188075388], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/db569bae-3ee0-441b-820b-4b3742559d03", 1, 0, 0.0, 462.0, 462, 462, 462.0, 462.0, 462.0, 462.0, 2.1645021645021645, 0.6912033279220778, 1.291514475108225], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 358.93750000000006, 243, 758, 254.0, 744.0, 758.0, 758.0, 0.10512138234617785, 0.16291761111658618, 0.2364204526789527], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c9d67ca3-3de9-4242-a4cf-5eb4fa49ea96", 3, 0, 0.0, 349.0, 222, 455, 370.0, 455.0, 455.0, 455.0, 0.020099425156440524, 0.02770868018799662, 0.012889279804097603], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e7acc726-d84a-4eb5-84e0-60390bd019e6", 1, 0, 0.0, 296.0, 296, 296, 296.0, 296.0, 296.0, 296.0, 3.3783783783783785, 1.0788376266891893, 2.0158097550675675], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0f435a60-4b71-4606-8c89-2a119d887051", 3, 0, 0.0, 750.0, 211, 1605, 434.0, 1605.0, 1605.0, 1605.0, 0.03699456179941549, 0.03084084400009865, 0.02372372615392204], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 145.6875, 123, 363, 129.0, 227.20000000000013, 363.0, 363.0, 0.08484462827447237, 0.07034481387209672, 0.03015961395694135], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 143.0625, 122, 360, 129.0, 203.90000000000015, 360.0, 360.0, 0.07360382739902475, 0.057143596467016285, 0.026163860520747078], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3713cb2b-9628-4b79-bca0-59ac1b396df3", 3, 0, 0.0, 346.6666666666667, 236, 565, 239.0, 565.0, 565.0, 565.0, 0.02534961341839537, 0.025423879863957076, 0.0162560997507288], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a606cd31-f869-4cdf-a3c5-f3d517908772", 2, 0, 0.0, 337.0, 301, 373, 337.0, 373.0, 373.0, 373.0, 0.10157956219208694, 0.06244563906242064, 0.06314003060084311], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 162.31578947368422, 121, 379, 124.0, 363.0, 379.0, 379.0, 0.09689774228260481, 0.07201091980181862, 0.04863812454419812], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 239.78947368421052, 120, 385, 130.0, 377.0, 385.0, 385.0, 0.09678520307063791, 0.04119937560809124, 0.05434218535894575], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0c6f7730-03e5-4dbe-98e1-1010b89926f8", 1, 0, 0.0, 443.0, 443, 443, 443.0, 443.0, 443.0, 443.0, 2.257336343115124, 0.40781955417607224, 1.5563275959367946], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 331.57894736842104, 116, 1200, 356.0, 1065.0, 1200.0, 1200.0, 0.09677731539727089, 9.189696510795764, 0.056019023746097074], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9e44d931-0edb-40ce-a2a1-92d14a1f5034", 3, 0, 0.0, 365.6666666666667, 221, 561, 315.0, 561.0, 561.0, 561.0, 0.019817284635659224, 0.02342335954169226, 0.012708349847737195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 304.6315789473685, 119, 1073, 127.0, 986.0, 1073.0, 1073.0, 0.09690169577967614, 3.022559926048706, 0.056185651217646314], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 33.333333333333336, 0.30557677616501144], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 8.333333333333334, 0.07639419404125286], "isController": false}, {"data": ["401/Unauthorized", 7, 58.333333333333336, 0.5347593582887701], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1309, 12, "401/Unauthorized", 7, "406/Not Acceptable", 4, "Test failed: code expected to contain /200/", 1, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 1, "Test failed: code expected to contain /200/", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
