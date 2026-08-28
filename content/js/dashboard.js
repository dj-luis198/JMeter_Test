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

    var data = {"OkPercent": 98.91975308641975, "KoPercent": 1.0802469135802468};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7364185110663984, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/7c0587f9-a13c-4a08-866c-79a287622c5f"], "isController": false}, {"data": [0.026785714285714284, 500, 1500, "see books"], "isController": true}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/71d711ac-3ce6-4fbe-ad54-8ba1e62ffca4"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d0ec58cb-3875-471f-82b9-c5daa017ff52"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d0ec58cb-3875-471f-82b9-c5daa017ff52"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/43601537-19e5-4331-a713-fb880a586518"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.33035714285714285, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.3, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=71d711ac-3ce6-4fbe-ad54-8ba1e62ffca4"], "isController": false}, {"data": [0.15789473684210525, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5bfab418-8070-4366-a986-332bbbc1389a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.45, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/59836089-a5b0-4e61-937c-f47db9e731b9"], "isController": false}, {"data": [0.15789473684210525, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.65, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.21311475409836064, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7c0587f9-a13c-4a08-866c-79a287622c5f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/481f73e1-cda0-48b4-992a-91d0a68f9f29"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.48214285714285715, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/4e2c6914-b151-4d8d-85ce-50eb2db3f0ee"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f6dfa56f-dae1-4bf8-b095-aef2960d52c9"], "isController": false}, {"data": [0.35, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8595505617977528, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f6dfa56f-dae1-4bf8-b095-aef2960d52c9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4e2c6914-b151-4d8d-85ce-50eb2db3f0ee"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=481f73e1-cda0-48b4-992a-91d0a68f9f29"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c76937d2-abfe-4928-9d54-0c933b0a9528"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6052631578947368, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3b97d463-2938-4578-bade-c8e7feba59d5"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=43601537-19e5-4331-a713-fb880a586518"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/e3357bfe-b51a-4bea-9668-f101de084cdc"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/ffef045b-c77d-4a7e-9fd0-4874c9a86fad"], "isController": false}, {"data": [0.53125, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c76937d2-abfe-4928-9d54-0c933b0a9528"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/3b97d463-2938-4578-bade-c8e7feba59d5"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=29d3b71e-9262-4216-8d69-caf913b04e0c"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/29d3b71e-9262-4216-8d69-caf913b04e0c"], "isController": false}, {"data": [0.15789473684210525, 500, 1500, "register"], "isController": true}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1296, 14, 1.0802469135802468, 494.4899691358024, 113, 8002, 156.0, 1289.6, 1611.5999999999967, 2955.8599999999983, 5.111296912713562, 711.0807745626213, 3.752869188660493], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/7c0587f9-a13c-4a08-866c-79a287622c5f", 3, 0, 0.0, 1086.3333333333333, 238, 1732, 1289.0, 1732.0, 1732.0, 1732.0, 0.029797969764993344, 0.024841341330777332, 0.019108724100597947], "isController": false}, {"data": ["see books", 56, 0, 0.0, 2254.732142857143, 1423, 4040, 2158.5, 3111.6000000000004, 3358.6999999999994, 4040.0, 0.24632817070542232, 296.41493454571145, 1.2111936909197278], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 299.0588235294118, 237, 720, 244.0, 539.1999999999998, 720.0, 720.0, 0.08485616879389435, 0.1315104881600687, 0.1908435124339245], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 454.6923076923077, 120, 937, 341.0, 933.0, 937.0, 937.0, 0.07375970223775588, 0.057264612577164, 0.02621926915482729], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 20, 0, 0.0, 352.15000000000003, 235, 1500, 243.5, 480.9, 1449.0499999999993, 1500.0, 0.09723464664929407, 5.9594820568652525, 0.21743907945529153], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/71d711ac-3ce6-4fbe-ad54-8ba1e62ffca4", 3, 0, 0.0, 408.6666666666667, 220, 553, 453.0, 553.0, 553.0, 553.0, 0.036670781943306974, 0.030570922056252982, 0.02351609388942537], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d0ec58cb-3875-471f-82b9-c5daa017ff52", 3, 0, 0.0, 426.0, 262, 636, 380.0, 636.0, 636.0, 636.0, 0.023548065526417004, 0.02783301625208989, 0.015100810249687988], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 15, 0, 0.0, 152.6, 119, 353, 122.0, 346.4, 353.0, 353.0, 0.07410298338611113, 0.05507067417659235, 0.03719622408248156], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d0ec58cb-3875-471f-82b9-c5daa017ff52", 1, 0, 0.0, 1279.0, 1279, 1279, 1279.0, 1279.0, 1279.0, 1279.0, 0.7818608287724785, 0.14125415363565286, 0.5390563917122753], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 15, 0, 0.0, 150.4, 113, 354, 120.0, 353.4, 354.0, 354.0, 0.0741033494713961, 0.04208838677008201, 0.04101736179725324], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 15, 0, 0.0, 378.73333333333335, 116, 1303, 122.0, 1233.4, 1303.0, 1303.0, 0.07401705352913311, 13.336094901890394, 0.042241763752368544], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/43601537-19e5-4331-a713-fb880a586518", 3, 0, 0.0, 2638.3333333333335, 857, 4229, 2829.0, 4229.0, 4229.0, 4229.0, 0.021077628907265458, 0.02905721302808243, 0.013516578433370103], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 15, 0, 0.0, 329.3999999999999, 118, 934, 122.0, 930.4, 934.0, 934.0, 0.07402143660804168, 4.368912893423936, 0.04231655174838633], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1350.4464285714294, 912, 2573, 1204.5, 1912.0, 1978.1, 2573.0, 0.24266375470161025, 290.3102141940964, 0.47916612500649997], "isController": false}, {"data": ["deleteBook", 10, 0, 0.0, 1674.8, 461, 2869, 1922.5, 2856.8, 2869.0, 2869.0, 0.07409218549719561, 0.01338579523142694, 0.050359532330125134], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 10, 0, 0.0, 1674.8, 461, 2869, 1922.5, 2856.8, 2869.0, 2869.0, 0.0733035720830676, 0.01324332112828858, 0.04982352165021001], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=71d711ac-3ce6-4fbe-ad54-8ba1e62ffca4", 1, 0, 0.0, 432.0, 432, 432, 432.0, 432.0, 432.0, 432.0, 2.314814814814815, 0.41820384837962965, 1.5959563078703705], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 19, 5, 26.31578947368421, 1730.4736842105262, 595, 3989, 1632.0, 2907.0, 3989.0, 3989.0, 0.09128602795274267, 0.028752095975247072, 0.04118568839274132], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 153.42857142857142, 119, 350, 121.0, 350.0, 350.0, 350.0, 0.03270493143644731, 0.00881500105122994, 0.019258860992361064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 13, 0, 0.0, 137.84615384615384, 117, 358, 120.0, 263.19999999999993, 358.0, 358.0, 0.1353884607373464, 0.036226990470735264, 0.07721373151426786], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 152.0, 115, 355, 119.0, 355.0, 355.0, 355.0, 0.032705389848246995, 0.008815124607535321, 0.019227192078754576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 13, 0, 0.0, 138.84615384615384, 118, 348, 120.0, 263.19999999999993, 348.0, 348.0, 0.13538987075474646, 0.1006168863714473, 0.06795936871869108], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5bfab418-8070-4366-a986-332bbbc1389a", 1, 0, 0.0, 485.0, 485, 485, 485.0, 485.0, 485.0, 485.0, 2.061855670103093, 0.6584246134020618, 1.2302673969072164], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 13, 0, 0.0, 191.15384615384616, 118, 361, 121.0, 359.0, 361.0, 361.0, 0.1353884607373464, 0.03649142105811289, 0.07972582209435534], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 13, 0, 0.0, 201.61538461538458, 116, 489, 120.0, 435.4, 489.0, 489.0, 0.13539269087765707, 0.03649256121311851, 0.07959609366049762], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 175.69230769230768, 118, 352, 121.0, 352.0, 352.0, 352.0, 0.07313807343062571, 0.01971299635434834, 0.04299718770042645], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 193.46153846153848, 117, 361, 122.0, 357.4, 361.0, 361.0, 0.07313848490815494, 0.019713107260401135, 0.04306885390587639], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 119.42857142857143, 118, 121, 119.0, 121.0, 121.0, 121.0, 0.03270493143644731, 0.008751124232018128, 0.018652031209848857], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 121.38461538461539, 117, 133, 120.0, 131.0, 133.0, 133.0, 0.07313766195772643, 0.054353281982255676, 0.036711677974874395], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 121.42857142857143, 120, 124, 121.0, 124.0, 124.0, 124.0, 0.032704167445337315, 0.02430456193935713, 0.016415959049710334], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 174.46153846153848, 115, 361, 121.0, 359.8, 361.0, 361.0, 0.07303781111298388, 0.019543320551716387, 0.041654376650373616], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 125.0, 122, 133, 123.0, 133.0, 133.0, 133.0, 0.032724654754892335, 0.025757882551214084, 0.011632592119903135], "isController": false}, {"data": ["deleteAccount", 10, 0, 0.0, 1406.4, 453, 4229, 633.5, 4204.8, 4229.0, 4229.0, 0.0733664949890684, 0.01325468903611099, 0.04993793653064519], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/59836089-a5b0-4e61-937c-f47db9e731b9", 1, 0, 0.0, 315.0, 315, 315, 315.0, 315.0, 315.0, 315.0, 3.1746031746031744, 1.013764880952381, 1.8942212301587302], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 19, 0, 0.0, 2489.1052631578946, 1035, 8002, 1899.0, 5867.0, 8002.0, 8002.0, 0.08973353861848134, 0.04644411666776866, 0.04127392254814913], "isController": false}, {"data": ["goToProfile", 10, 0, 0.0, 903.0999999999999, 213, 2711, 672.5, 2606.0000000000005, 2711.0, 2711.0, 0.07471607890017931, 0.21410826359832635, 0.048302777570233116], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 276.57142857142856, 241, 476, 242.0, 476.0, 476.0, 476.0, 0.0326858423608517, 0.050656671705734034, 0.0735112255439858], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 134.35294117647055, 115, 360, 121.0, 171.19999999999982, 360.0, 360.0, 0.08501445245691767, 0.06317968585909604, 0.042673270080913754], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 120.11764705882354, 118, 129, 120.0, 123.39999999999999, 129.0, 129.0, 0.0850140273145069, 0.022747894027514537, 0.04848456245280471], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 942.6, 921, 952, 945.0, 952.0, 952.0, 952.0, 0.058728872288194324, 17.268238434816826, 0.03349380997686082], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1269.4, 1066, 1426, 1296.0, 1426.0, 1426.0, 1426.0, 0.05865033841245264, 52.773677599822875, 0.03339174540474598], "isController": false}, {"data": ["addBook", 61, 9, 14.754098360655737, 1541.0983606557375, 630, 4957, 1256.0, 2586.8, 4220.499999999999, 4957.0, 0.293732424207404, 81.75701854216024, 1.0704934870252127], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 164.8, 114, 358, 117.0, 358.0, 358.0, 358.0, 0.05914150195758371, 0.10465273588588055, 0.03274729649409176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 167.4375, 117, 359, 122.5, 352.0, 359.0, 359.0, 0.08005643979005199, 0.05949506902366168, 0.040184580128990934], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 165.4375, 114, 391, 120.0, 369.3, 391.0, 391.0, 0.08005844266314409, 0.021421887978224103, 0.04565833058132436], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 151.3125, 114, 360, 120.0, 353.0, 360.0, 360.0, 0.08005764150188135, 0.02157803618605396, 0.04706513689856697], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 216.8928571428571, 119, 748, 122.0, 485.6, 496.3, 748.0, 0.24404806003582277, 0.18136774774146594, 0.11797245089622292], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 227.0625, 117, 395, 127.5, 375.40000000000003, 395.0, 395.0, 0.08005844266314409, 0.021578252124050557, 0.04714378996667567], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7c0587f9-a13c-4a08-866c-79a287622c5f", 1, 0, 0.0, 5055.0, 5055, 5055, 5055.0, 5055.0, 5055.0, 5055.0, 0.19782393669634024, 0.03573967606330366, 0.13639033135509399], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 752.1071428571429, 569, 1049, 712.0, 965.2, 1025.3, 1049.0, 0.24427480916030533, 71.82490458015268, 0.1228530534351145], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 213.6, 114, 358, 121.0, 358.0, 358.0, 358.0, 0.05930916682482445, 0.04407644136102676, 0.03330348723073638], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 172.94642857142864, 115, 494, 122.0, 363.5, 372.34999999999997, 494.0, 0.24475524475524477, 0.43310205419580416, 0.11903135926573426], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/481f73e1-cda0-48b4-992a-91d0a68f9f29", 3, 0, 0.0, 1225.3333333333333, 463, 2711, 502.0, 2711.0, 2711.0, 2711.0, 0.01909806218329047, 0.026328220490310916, 0.012247129720404369], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 133.88235294117644, 117, 360, 120.0, 170.39999999999984, 360.0, 360.0, 0.08501487760358062, 0.02291416622909009, 0.049979449528667515], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 915.6250000000003, 114, 1523, 1241.0, 1520.2, 1523.0, 1523.0, 0.08212793479041977, 46.19508857305279, 0.04387107454136681], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1131.0357142857138, 790, 1791, 1077.5, 1436.0, 1497.6499999999999, 1791.0, 0.24348884734118872, 219.0916928453411, 0.12221998782555762], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 20, 0, 0.0, 238.15000000000006, 119, 1079, 127.0, 903.4000000000012, 1073.1999999999998, 1079.0, 0.09754527319992391, 0.07287317773236504, 0.03467429633278546], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 161.41176470588232, 115, 372, 120.0, 356.8, 372.0, 372.0, 0.08490745087854239, 0.02288521136960713, 0.049999211796641664], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 670.4375, 115, 1168, 873.5, 1091.7, 1168.0, 1168.0, 0.08212540549418962, 15.100548283322382, 0.043949924033999915], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4e2c6914-b151-4d8d-85ce-50eb2db3f0ee", 3, 0, 0.0, 1304.0, 324, 3016, 572.0, 3016.0, 3016.0, 3016.0, 0.014576976152067015, 0.020095538412761658, 0.009347865566266933], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f6dfa56f-dae1-4bf8-b095-aef2960d52c9", 1, 0, 0.0, 818.0, 818, 818, 818.0, 818.0, 818.0, 818.0, 1.2224938875305624, 0.2208607121026895, 0.8428522310513448], "isController": false}, {"data": ["deleteBooks", 10, 0, 0.0, 2046.7, 432, 5055, 1113.5, 4960.5, 5055.0, 5055.0, 0.07306630036094752, 0.013200454655053996, 0.0503757891160439], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 9, 5.056179775280899, 334.53932584269654, 115, 3139, 132.5, 891.6999999999998, 1230.949999999999, 2435.110000000007, 0.7271954766807203, 1.508286689922623, 0.35110225777854037], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f6dfa56f-dae1-4bf8-b095-aef2960d52c9", 3, 0, 0.0, 579.6666666666666, 213, 895, 631.0, 895.0, 895.0, 895.0, 0.044232782389454904, 0.028437417063533022, 0.028365423602612686], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 15, 0, 0.0, 179.26666666666668, 121, 481, 126.0, 406.00000000000006, 481.0, 481.0, 0.07414620643292488, 0.05741986494268499, 0.02635665931795376], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4e2c6914-b151-4d8d-85ce-50eb2db3f0ee", 1, 0, 0.0, 948.0, 948, 948, 948.0, 948.0, 948.0, 948.0, 1.0548523206751055, 0.1905739055907173, 0.7272712289029536], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=481f73e1-cda0-48b4-992a-91d0a68f9f29", 1, 0, 0.0, 922.0, 922, 922, 922.0, 922.0, 922.0, 922.0, 1.0845986984815619, 0.19594800704989154, 0.7477799620390455], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 410.5625, 237, 738, 369.5, 722.6, 738.0, 738.0, 0.08000800080008001, 0.12399677467746775, 0.1799398689868987], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c76937d2-abfe-4928-9d54-0c933b0a9528", 3, 0, 0.0, 1809.0, 812, 2954, 1661.0, 2954.0, 2954.0, 2954.0, 0.017460539181449925, 0.024070762836406388, 0.011197025451645947], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 13, 0, 0.0, 192.84615384615387, 118, 702, 122.0, 540.3999999999999, 702.0, 702.0, 0.1327505922718732, 0.10773021697063148, 0.04718868709664243], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 19, 0, 0.0, 903.7368421052631, 220, 2735, 693.0, 2435.0, 2735.0, 2735.0, 0.09124306672749538, 0.05604676657382284, 0.04125541005354527], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 120.6875, 115, 130, 120.0, 125.80000000000001, 130.0, 130.0, 0.08222585386410122, 0.06110729960017678, 0.04127352430287893], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 179.12499999999997, 116, 358, 121.5, 357.3, 358.0, 358.0, 0.08222712158821685, 0.09919048041195788, 0.0425790343966328], "isController": false}, {"data": ["login", 19, 0, 0.0, 4559.21052631579, 1735, 11367, 4399.0, 7987.0, 11367.0, 11367.0, 0.09062377777141821, 28.654827706014082, 0.1762775940460178], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 15, 0, 0.0, 549.2666666666667, 241, 1423, 252.0, 1354.0, 1423.0, 1423.0, 0.07397252167394884, 17.791084954975393, 0.1625806223431536], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 266.52941176470586, 120, 1962, 124.0, 953.9999999999991, 1962.0, 1962.0, 0.08443890348633332, 0.0683592294825882, 0.030015391473657546], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 354.6153846153846, 238, 482, 269.0, 481.6, 482.0, 482.0, 0.07298901234637216, 0.11311871347040295, 0.16415399944696785], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3b97d463-2938-4578-bade-c8e7feba59d5", 1, 0, 0.0, 2801.0, 2801, 2801, 2801.0, 2801.0, 2801.0, 2801.0, 0.3570153516601214, 0.06449984380578365, 0.2461453498750446], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 269.0, 122, 1075, 133.0, 817.4000000000003, 1075.0, 1075.0, 0.08089346835801427, 0.06706890101167394, 0.028755100080387886], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=43601537-19e5-4331-a713-fb880a586518", 1, 0, 0.0, 3359.0, 3359, 3359, 3359.0, 3359.0, 3359.0, 3359.0, 0.29770765108663294, 0.053785073682643646, 0.20525547037808872], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e3357bfe-b51a-4bea-9668-f101de084cdc", 1, 0, 0.0, 660.0, 660, 660, 660.0, 660.0, 660.0, 660.0, 1.5151515151515151, 0.48384232954545453, 0.9040601325757576], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ffef045b-c77d-4a7e-9fd0-4874c9a86fad", 1, 0, 0.0, 831.0, 831, 831, 831.0, 831.0, 831.0, 831.0, 1.203369434416366, 0.38427910649819497, 0.7180260980746089], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 1038.3125, 237, 1648, 1364.5, 1643.8, 1648.0, 1648.0, 0.08207485226526591, 61.416485711922405, 0.17146350362155285], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 252.49999999999997, 119, 1465, 124.0, 863.7000000000006, 1465.0, 1465.0, 0.08068827095121385, 0.06264372598263185, 0.028682158814689298], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c76937d2-abfe-4928-9d54-0c933b0a9528", 1, 0, 0.0, 4110.0, 4110, 4110, 4110.0, 4110.0, 4110.0, 4110.0, 0.24330900243309003, 0.043957192822384424, 0.16775015206812652], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3b97d463-2938-4578-bade-c8e7feba59d5", 3, 0, 0.0, 1814.3333333333333, 568, 3987, 888.0, 3987.0, 3987.0, 3987.0, 0.025798684267102377, 0.02150730156512018, 0.016544078127015523], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=29d3b71e-9262-4216-8d69-caf913b04e0c", 1, 0, 0.0, 743.0, 743, 743, 743.0, 743.0, 743.0, 743.0, 1.3458950201884252, 0.24315486204576042, 0.927931527590848], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 13, 0, 0.0, 414.2307692307692, 241, 706, 471.0, 668.0, 706.0, 706.0, 0.13521806513350182, 0.20956159117858145, 0.3041085976586472], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 0, 0.0, 1483.8, 1415, 1605, 1427.0, 1605.0, 1605.0, 1605.0, 0.05856858381164343, 70.06838797294131, 0.1320652929893405], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 20, 0, 0.0, 121.15, 115, 130, 122.0, 123.0, 129.65, 130.0, 0.09729140722291407, 0.07230347743812265, 0.048835725891189286], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 20, 0, 0.0, 131.15, 114, 357, 119.5, 124.9, 345.39999999999986, 357.0, 0.09729377368495304, 0.03334021990825197, 0.05507929746598367], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 20, 0, 0.0, 216.54999999999998, 113, 1369, 119.0, 357.0, 1318.3999999999992, 1369.0, 0.09729377368495304, 4.402167956113211, 0.05678003823645306], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/29d3b71e-9262-4216-8d69-caf913b04e0c", 3, 0, 0.0, 557.0, 488, 634, 549.0, 634.0, 634.0, 634.0, 0.018217590905778618, 0.025114419754548326, 0.011682504584760379], "isController": false}, {"data": ["register", 19, 5, 26.31578947368421, 1730.4736842105262, 595, 3989, 1632.0, 2907.0, 3989.0, 3989.0, 0.09177192262177893, 0.028905136812616226, 0.04140491040162291], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 20, 0, 0.0, 195.89999999999998, 114, 938, 120.5, 356.7, 908.9499999999996, 938.0, 0.0972933003833356, 1.4552854433412465, 0.056874775009242866], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 35.714285714285715, 0.38580246913580246], "isController": false}, {"data": ["401/Unauthorized", 9, 64.28571428571429, 0.6944444444444444], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1296, 14, "401/Unauthorized", 9, "406/Not Acceptable", 5, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 19, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
