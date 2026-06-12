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

    var data = {"OkPercent": 99.20174165457185, "KoPercent": 0.7982583454281568};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7823899371069183, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7ec99024-5ed6-4323-9a00-1d4f1df2daaf"], "isController": false}, {"data": [0.03333333333333333, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ec70d634-2e3f-49f2-8ff2-bbaec1c16677"], "isController": false}, {"data": [0.6818181818181818, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6818181818181818, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/aee3546c-3dae-497d-976d-05747e032792"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/02ed7508-b609-4fc6-af62-f87cf83fc214"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8c692051-a57c-4d42-8c4f-62215a928abe"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dce62c92-7479-4a0f-a748-dfdbea870822"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f8b353fd-86c7-4da6-ab1e-3c99a91fd527"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.65625, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=518dee07-bfe8-462a-bf7e-bfd223d856b3"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/fd53f05e-dfed-426a-841b-30912665db54"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9acab7e9-3c9d-4741-aec5-5a352dd9e982"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e046039a-73bc-441f-bcac-e37b152c0f81"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f8b353fd-86c7-4da6-ab1e-3c99a91fd527"], "isController": false}, {"data": [0.6190476190476191, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9ffd5958-c611-43a2-8ae4-27d35937e9f6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fa353e88-439f-4a56-b1c9-b7fcc727db39"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=aee3546c-3dae-497d-976d-05747e032792"], "isController": false}, {"data": [0.65625, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7ec99024-5ed6-4323-9a00-1d4f1df2daaf"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.4, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e0fb9b1e-98d3-4061-8197-12541089de77"], "isController": false}, {"data": [0.23809523809523808, 500, 1500, "register"], "isController": true}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dce62c92-7479-4a0f-a748-dfdbea870822"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.39166666666666666, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.23809523809523808, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/ba2e14c3-c2ff-4fbd-a44e-71126f3590f4"], "isController": false}, {"data": [0.925, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.925, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6363636363636364, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.2619047619047619, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e046039a-73bc-441f-bcac-e37b152c0f81"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ec70d634-2e3f-49f2-8ff2-bbaec1c16677"], "isController": false}, {"data": [0.3125, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fd53f05e-dfed-426a-841b-30912665db54"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/518dee07-bfe8-462a-bf7e-bfd223d856b3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=69d8c584-b71c-48be-8918-f9e02ffe46ad"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9acab7e9-3c9d-4741-aec5-5a352dd9e982"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.48333333333333334, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9521276595744681, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/69d8c584-b71c-48be-8918-f9e02ffe46ad"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1b3bc322-656e-4a9b-bb4b-078208c20526"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9ffd5958-c611-43a2-8ae4-27d35937e9f6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1378, 11, 0.7982583454281568, 401.45936139332343, 112, 3539, 130.5, 1139.0, 1358.1, 1862.250000000001, 5.391531617537737, 761.8260936998701, 3.9456508768085885], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/7ec99024-5ed6-4323-9a00-1d4f1df2daaf", 3, 0, 0.0, 374.0, 263, 433, 426.0, 433.0, 433.0, 433.0, 0.02009336717949405, 0.027700328777720475, 0.012885394968620859], "isController": false}, {"data": ["see books", 60, 0, 0.0, 1874.6833333333336, 1369, 2567, 1852.0, 2194.0, 2395.3499999999995, 2567.0, 0.26805100117048936, 322.55530244669137, 1.3180046786068496], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ec70d634-2e3f-49f2-8ff2-bbaec1c16677", 3, 0, 0.0, 473.66666666666663, 214, 731, 476.0, 731.0, 731.0, 731.0, 0.03350682422320012, 0.027933260688676926, 0.021487123606674558], "isController": false}, {"data": ["deleteBook", 11, 0, 0.0, 630.8181818181819, 414, 1613, 519.0, 1445.8000000000006, 1613.0, 1613.0, 0.11349332452900271, 0.02050416507604053, 0.07713999401580653], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 11, 0, 0.0, 630.8181818181819, 414, 1613, 519.0, 1445.8000000000006, 1613.0, 1613.0, 0.1147159736778984, 0.020725053838292193, 0.07797101335919658], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aee3546c-3dae-497d-976d-05747e032792", 3, 0, 0.0, 670.6666666666667, 229, 1420, 363.0, 1420.0, 1420.0, 1420.0, 0.027096599376778212, 0.027175983945264867, 0.017376399990967798], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 172.31250000000003, 113, 343, 115.5, 342.3, 343.0, 343.0, 0.104469328458098, 0.03776045917534524, 0.05903180193268258], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 131.9375, 114, 346, 116.0, 193.40000000000015, 346.0, 346.0, 0.10446728215307069, 0.07763632980320977, 0.05243767873699056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 222.68749999999997, 113, 911, 115.0, 513.4000000000004, 911.0, 911.0, 0.10392782212753243, 1.936150460692549, 0.060641478243359984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 207.12499999999997, 112, 1123, 114.5, 574.2000000000005, 1123.0, 1123.0, 0.10378490578276522, 5.862839986783642, 0.06045673466740181], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/02ed7508-b609-4fc6-af62-f87cf83fc214", 1, 0, 0.0, 1200.0, 1200, 1200, 1200.0, 1200.0, 1200.0, 1200.0, 0.8333333333333334, 0.26611328125, 0.4972330729166667], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8c692051-a57c-4d42-8c4f-62215a928abe", 2, 0, 0.0, 217.0, 216, 218, 217.0, 218.0, 218.0, 218.0, 0.0247350260336149, 0.03525465868755952, 0.01537484772499598], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 253.69230769230765, 116, 498, 227.0, 469.2, 498.0, 498.0, 0.0803297226152886, 0.1850443918267597, 0.05192587613465733], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 118.89473684210527, 114, 173, 116.0, 117.0, 173.0, 173.0, 0.08800003705264718, 0.06539846503619581, 0.044171893598692044], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 140.73684210526315, 114, 344, 116.0, 343.0, 344.0, 344.0, 0.08799596144850615, 0.030501889597487945, 0.0497962343517708], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 723.0, 678, 843, 685.5, 843.0, 843.0, 843.0, 0.105368526421158, 30.981845332174277, 0.060092987724566664], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1169.75, 1019, 1357, 1151.5, 1357.0, 1357.0, 1357.0, 0.10437323870159691, 93.91522365228056, 0.059423435706084965], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 237.25, 124, 345, 240.0, 345.0, 345.0, 345.0, 0.10696617194812141, 0.1892799839550742, 0.0592283393501805], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 116.5, 112, 132, 115.5, 125.0, 132.0, 132.0, 0.07068208209218962, 0.05252838327359015, 0.03547909198768112], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 164.92857142857142, 113, 342, 116.0, 341.5, 342.0, 342.0, 0.07068243894804335, 0.026496053774189805, 0.03988706271551833], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dce62c92-7479-4a0f-a748-dfdbea870822", 3, 0, 0.0, 315.6666666666667, 208, 413, 326.0, 413.0, 413.0, 413.0, 0.029606529226578766, 0.029693267105172262, 0.018985957869908913], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f8b353fd-86c7-4da6-ab1e-3c99a91fd527", 1, 0, 0.0, 423.0, 423, 423, 423.0, 423.0, 423.0, 423.0, 2.3640661938534278, 0.4271018026004728, 1.6299128250591017], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 229.07142857142856, 112, 1246, 115.5, 794.5, 1246.0, 1246.0, 0.0706838664074925, 4.560652634551789, 0.041120497059046274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 204.2142857142857, 113, 899, 115.0, 620.5, 899.0, 899.0, 0.07068208209218962, 1.5021815993083254, 0.04118848450042914], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 118.5, 115, 126, 116.5, 126.0, 126.0, 126.0, 0.10698333734520848, 0.0795061716012731, 0.06007365134130359], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 850.7500000000001, 114, 1694, 1130.0, 1453.9000000000003, 1694.0, 1694.0, 0.07883210240290102, 44.34125808952864, 0.04211050782654967], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 181.31578947368422, 115, 1119, 116.0, 341.0, 1119.0, 1119.0, 0.08799962947524431, 4.189955631107869, 0.05133613253207355], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=518dee07-bfe8-462a-bf7e-bfd223d856b3", 1, 0, 0.0, 263.0, 263, 263, 263.0, 263.0, 263.0, 263.0, 3.802281368821293, 0.6869355988593155, 2.6214947718631176], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fd53f05e-dfed-426a-841b-30912665db54", 3, 0, 0.0, 1877.3333333333335, 236, 3539, 1857.0, 3539.0, 3539.0, 3539.0, 0.06065998058880621, 0.028118428502102878, 0.03889979223956648], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 631.0624999999999, 114, 1273, 791.0, 1100.1000000000001, 1273.0, 1273.0, 0.07883171399854161, 14.494931213170808, 0.042187284444532035], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 181.78947368421055, 113, 903, 116.0, 342.0, 903.0, 903.0, 0.08799555390885513, 1.3842384476889589, 0.05141968813680993], "isController": false}, {"data": ["deleteBooks", 11, 0, 0.0, 495.5454545454545, 208, 785, 444.0, 784.6, 785.0, 785.0, 0.11470640374568548, 0.020723324895460752, 0.07908468851997455], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 363.2857142857142, 229, 1362, 236.0, 910.5, 1362.0, 1362.0, 0.07063465235137713, 6.137622120691916, 0.15756809306619982], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9acab7e9-3c9d-4741-aec5-5a352dd9e982", 1, 0, 0.0, 444.0, 444, 444, 444.0, 444.0, 444.0, 444.0, 2.2522522522522523, 0.4069010416666667, 1.5528223536036037], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e046039a-73bc-441f-bcac-e37b152c0f81", 3, 0, 0.0, 452.33333333333337, 224, 875, 258.0, 875.0, 875.0, 875.0, 0.017896130856508822, 0.02467126112542802, 0.011476359956810673], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f8b353fd-86c7-4da6-ab1e-3c99a91fd527", 3, 0, 0.0, 401.0, 233, 572, 398.0, 572.0, 572.0, 572.0, 0.02489296027083541, 0.029422636309701614, 0.015963259027846923], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 734.1904761904761, 135, 2175, 728.0, 1142.4, 2072.5999999999985, 2175.0, 0.10231973455337437, 0.06285069632233639, 0.046263708103722975], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 116.93750000000001, 114, 123, 116.0, 120.9, 123.0, 123.0, 0.07883132559800951, 0.05858460818367699, 0.03956963023181337], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 272.9375, 114, 585, 340.5, 417.70000000000016, 585.0, 585.0, 0.07883171399854161, 0.0950946042155259, 0.04082081674582685], "isController": false}, {"data": ["login", 21, 0, 0.0, 3036.476190476191, 1735, 5191, 2912.0, 4350.6, 5110.799999999999, 5191.0, 0.10014306151645207, 22.959408157486887, 0.1827247630543634], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/9ffd5958-c611-43a2-8ae4-27d35937e9f6", 3, 0, 0.0, 621.6666666666666, 227, 1207, 431.0, 1207.0, 1207.0, 1207.0, 0.0230755030459664, 0.02727446339840625, 0.014797767252784443], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 156.00000000000003, 116, 346, 119.0, 345.0, 346.0, 346.0, 0.09014736722241727, 0.07298063225330462, 0.03204457194234364], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fa353e88-439f-4a56-b1c9-b7fcc727db39", 1, 0, 0.0, 221.0, 221, 221, 221.0, 221.0, 221.0, 221.0, 4.524886877828055, 1.4449589932126696, 2.699908088235294], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=aee3546c-3dae-497d-976d-05747e032792", 1, 0, 0.0, 553.0, 553, 553, 553.0, 553.0, 553.0, 553.0, 1.8083182640144664, 0.32669812386980107, 1.246750678119349], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 977.5, 231, 1814, 1290.0, 1571.1000000000004, 1814.0, 1814.0, 0.07878668505022651, 58.95595524239216, 0.16459415624384477], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7ec99024-5ed6-4323-9a00-1d4f1df2daaf", 1, 0, 0.0, 574.0, 574, 574, 574.0, 574.0, 574.0, 574.0, 1.7421602787456445, 0.3147457534843206, 1.2011378484320558], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 411.8125, 229, 1240, 359.0, 854.3000000000004, 1240.0, 1240.0, 0.10370620033445249, 7.904970939983277, 0.23157928744117912], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 1, 20.0, 1054.0, 116, 1475, 1169.0, 1475.0, 1475.0, 1475.0, 0.0845508658008658, 80.92630890024688, 0.16343748414671266], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e0fb9b1e-98d3-4061-8197-12541089de77", 1, 0, 0.0, 411.0, 411, 411, 411.0, 411.0, 411.0, 411.0, 2.4330900243309004, 0.7769730839416059, 1.451775395377129], "isController": false}, {"data": ["register", 21, 4, 19.047619047619047, 1317.0000000000002, 229, 2404, 1247.0, 2293.0000000000005, 2402.4, 2404.0, 0.0991787058595724, 0.03149145292081289, 0.044746642682736766], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 337.7368421052632, 230, 1233, 235.0, 462.0, 1233.0, 1233.0, 0.08794830491214427, 5.666852471925975, 0.19661346228174933], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 20, 0, 0.0, 120.64999999999999, 114, 136, 119.0, 130.60000000000002, 135.75, 136.0, 0.10749682884354912, 0.0834570106744351, 0.03821176337798035], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dce62c92-7479-4a0f-a748-dfdbea870822", 1, 0, 0.0, 400.0, 400, 400, 400.0, 400.0, 400.0, 400.0, 2.5, 0.45166015625, 1.7236328125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 402.0625, 230, 1137, 344.5, 819.9000000000003, 1137.0, 1137.0, 0.08395336390635003, 6.399317493585438, 0.18747056713120863], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 14, 0, 0.0, 148.8571428571429, 114, 345, 116.0, 343.5, 345.0, 345.0, 0.097442143727162, 0.0724154993909866, 0.04891138855054811], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 14, 0, 0.0, 198.85714285714283, 113, 376, 117.5, 359.0, 376.0, 376.0, 0.0974428219441235, 0.02607356759051742, 0.05557285939000793], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 14, 0, 0.0, 130.99999999999997, 113, 339, 114.0, 230.0, 339.0, 339.0, 0.09744417840637007, 0.02626425121109193, 0.0572865189459324], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 14, 0, 0.0, 198.2857142857143, 113, 378, 116.5, 360.0, 378.0, 378.0, 0.09744485665165552, 0.026264434019391526, 0.057382078672801054], "isController": false}, {"data": ["https://demoqa.com/books", 60, 0, 0.0, 1302.75, 900, 2087, 1246.0, 1712.9, 1918.9499999999996, 2087.0, 0.2654491399447866, 317.5694564265237, 0.5241583603206625], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 4, 19.047619047619047, 1317.0000000000002, 229, 2404, 1247.0, 2293.0000000000005, 2402.4, 2404.0, 0.10066486748189231, 0.031963342409149956, 0.04541715700843188], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 140.66666666666666, 113, 342, 115.0, 342.0, 342.0, 342.0, 0.041921299746609034, 0.011299100322328216, 0.024686077878130125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 115.44444444444444, 113, 122, 114.0, 122.0, 122.0, 122.0, 0.04192090921794215, 0.01129899506264847, 0.02464490952070427], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ba2e14c3-c2ff-4fbd-a44e-71126f3590f4", 1, 0, 0.0, 1207.0, 1207, 1207, 1207.0, 1207.0, 1207.0, 1207.0, 0.828500414250207, 0.2645699565037282, 0.4943493682684341], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 20, 0, 0.0, 285.45, 112, 1240, 115.0, 1047.8000000000002, 1230.6499999999999, 1240.0, 0.10336237816159674, 13.974527916563304, 0.05943336744291813], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 20, 0, 0.0, 289.75000000000006, 113, 907, 116.0, 882.6000000000005, 906.9, 907.0, 0.10324072640175096, 4.5770828332610645, 0.05946423870288351], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 140.44444444444446, 114, 342, 115.0, 342.0, 342.0, 342.0, 0.04192090921794215, 0.011217118286832176, 0.023908018538357632], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 20, 0, 0.0, 139.85, 114, 344, 116.0, 321.50000000000045, 343.95, 344.0, 0.10336077561926026, 0.0768140139123604, 0.051882264324511485], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 116.1111111111111, 114, 118, 116.0, 118.0, 118.0, 118.0, 0.041920713956337244, 0.031153968086692036, 0.021042233372614596], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 20, 0, 0.0, 194.79999999999998, 114, 351, 115.0, 348.7, 350.9, 351.0, 0.10324179227751394, 0.0508848950805286, 0.057579480048523646], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 151.66666666666666, 116, 342, 120.0, 342.0, 342.0, 342.0, 0.041789326077468124, 0.03289277033050714, 0.014854799504099996], "isController": false}, {"data": ["deleteAccount", 11, 0, 0.0, 910.8181818181819, 413, 3539, 572.0, 3115.2000000000016, 3539.0, 3539.0, 0.1115596032534837, 0.02015481113466258, 0.07593461276140442], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1590.9523809523812, 899, 3197, 1491.0, 2242.6, 3103.199999999999, 3197.0, 0.10290435285412573, 0.05326104200457679, 0.04733198261161447], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 258.55555555555554, 230, 457, 234.0, 457.0, 457.0, 457.0, 0.04189768585115149, 0.064933229927517, 0.09422887745625183], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e046039a-73bc-441f-bcac-e37b152c0f81", 1, 0, 0.0, 783.0, 783, 783, 783.0, 783.0, 783.0, 783.0, 1.277139208173691, 0.2307331577266922, 0.8805276181353767], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ec70d634-2e3f-49f2-8ff2-bbaec1c16677", 1, 0, 0.0, 432.0, 432, 432, 432.0, 432.0, 432.0, 432.0, 2.314814814814815, 0.41820384837962965, 1.5959563078703705], "isController": false}, {"data": ["addBook", 64, 6, 9.375, 1160.2968750000002, 591, 2589, 967.5, 1908.0, 2010.5, 2589.0, 0.30217043356735807, 97.18932807210543, 1.0985077457731551], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fd53f05e-dfed-426a-841b-30912665db54", 1, 0, 0.0, 208.0, 208, 208, 208.0, 208.0, 208.0, 208.0, 4.807692307692308, 0.8685772235576924, 3.3146784855769234], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/518dee07-bfe8-462a-bf7e-bfd223d856b3", 3, 0, 0.0, 454.3333333333333, 252, 572, 539.0, 572.0, 572.0, 572.0, 0.0666755567408988, 0.03016895308263324, 0.04275743710272481], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=69d8c584-b71c-48be-8918-f9e02ffe46ad", 1, 0, 0.0, 586.0, 586, 586, 586.0, 586.0, 586.0, 586.0, 1.7064846416382253, 0.30830044795221845, 1.1765411689419796], "isController": false}, {"data": ["https://demoqa.com/books-0", 60, 0, 0.0, 193.49999999999997, 113, 474, 116.0, 462.0, 464.0, 474.0, 0.26713801685640887, 0.19852737385520228, 0.1291340999452367], "isController": false}, {"data": ["https://demoqa.com/books-3", 60, 0, 0.0, 727.7666666666664, 561, 1132, 675.5, 1021.9, 1035.8, 1132.0, 0.2670761834813381, 78.52926570741803, 0.13432054149696201], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9acab7e9-3c9d-4741-aec5-5a352dd9e982", 3, 0, 0.0, 335.3333333333333, 217, 471, 318.0, 471.0, 471.0, 471.0, 0.024783966425986813, 0.024856575702625446, 0.015893363886456388], "isController": false}, {"data": ["https://demoqa.com/books-1", 60, 0, 0.0, 176.11666666666665, 113, 456, 117.5, 346.0, 354.65, 456.0, 0.2676110362791362, 0.4735460915408152, 0.13014677350293927], "isController": false}, {"data": ["https://demoqa.com/books-2", 60, 0, 0.0, 1107.6833333333327, 783, 1582, 1064.0, 1357.9, 1471.6999999999998, 1582.0, 0.266050611694698, 239.3928080699802, 0.13354493594831524], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 118.9375, 115, 127, 117.0, 125.6, 127.0, 127.0, 0.08676695480526242, 0.06482101604104078, 0.030842940965933128], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 188, 6, 3.1914893617021276, 184.1436170212765, 115, 815, 121.5, 329.19999999999993, 384.9999999999993, 702.8599999999981, 0.7878107242830085, 1.6867960971416718, 0.37966017674407887], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 14, 0, 0.0, 124.64285714285717, 116, 147, 121.5, 141.5, 147.0, 147.0, 0.10270631130282956, 0.0795372117804139, 0.036508884095927695], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 120.62500000000001, 116, 145, 118.0, 135.9, 145.0, 145.0, 0.10165959285333062, 0.0824991422471853, 0.036136808397082366], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/69d8c584-b71c-48be-8918-f9e02ffe46ad", 3, 0, 0.0, 454.3333333333333, 303, 562, 498.0, 562.0, 562.0, 562.0, 0.02226923505177597, 0.02233447695134172, 0.014280726904947482], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 14, 0, 0.0, 380.4285714285714, 231, 721, 345.5, 704.5, 721.0, 721.0, 0.09736353457448657, 0.15089446227510764, 0.21897287121586193], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 20, 0, 0.0, 494.19999999999993, 230, 1584, 455.5, 1175.4, 1563.8999999999996, 1584.0, 0.10317841094929296, 18.65150794441521, 0.22809078990811962], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1b3bc322-656e-4a9b-bb4b-078208c20526", 1, 0, 0.0, 221.0, 221, 221, 221.0, 221.0, 221.0, 221.0, 4.524886877828055, 1.4449589932126696, 2.699908088235294], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9ffd5958-c611-43a2-8ae4-27d35937e9f6", 1, 0, 0.0, 785.0, 785, 785, 785.0, 785.0, 785.0, 785.0, 1.2738853503184713, 0.23014530254777069, 0.8782842356687898], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 125.71428571428571, 115, 171, 119.0, 161.5, 171.0, 171.0, 0.07295238293747981, 0.060484934681562845, 0.025932292372307274], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 135.875, 117, 346, 120.0, 200.40000000000015, 346.0, 346.0, 0.07702157566888425, 0.05979702407887009, 0.027378763226048694], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 130.0625, 113, 343, 116.0, 186.90000000000015, 343.0, 343.0, 0.08400449424044186, 0.06242912120798463, 0.042166318398034294], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 171.5625, 113, 344, 115.0, 342.6, 344.0, 344.0, 0.08400449424044186, 0.03036344085033549, 0.04746787156237858], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 228.125, 113, 1018, 115.0, 545.5000000000005, 1018.0, 1018.0, 0.08400493528994829, 4.745463610440238, 0.048934515527787256], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 234.25, 113, 897, 115.0, 509.90000000000043, 897.0, 897.0, 0.08400581740285515, 1.5650082791670823, 0.04901706630684175], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 36.36363636363637, 0.29027576197387517], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 9.090909090909092, 0.07256894049346879], "isController": false}, {"data": ["401/Unauthorized", 6, 54.54545454545455, 0.43541364296081275], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1378, 11, "401/Unauthorized", 6, "406/Not Acceptable", 4, "Test failed: code expected to contain /200/", 1, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 1, "Test failed: code expected to contain /200/", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 188, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
