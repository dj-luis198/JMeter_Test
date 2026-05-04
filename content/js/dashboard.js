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

    var data = {"OkPercent": 97.10144927536231, "KoPercent": 2.898550724637681};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8073079325421612, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/503c1ae0-85e4-4a46-90bb-74c96cb4617d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6f99cf8e-fab7-4f36-8c04-b5072ba301d6"], "isController": false}, {"data": [0.3879310344827586, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1dca9868-9728-4637-8c32-21118893570a"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=406e40b8-6fef-4d43-8e91-4fc70c9a0701"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=03ed9da5-252b-4e66-a02f-e4a932e867d3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.2391304347826087, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=503c1ae0-85e4-4a46-90bb-74c96cb4617d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cbab01fe-a308-44a9-bfe6-477c6e8f19c8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cbab01fe-a308-44a9-bfe6-477c6e8f19c8"], "isController": false}, {"data": [0.3409090909090909, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/03ed9da5-252b-4e66-a02f-e4a932e867d3"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d9462cb5-6a1f-4605-abab-634c6c7ef7a7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6db7c00c-8919-4dd6-9194-4c93d5922ec1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.3253968253968254, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6f99cf8e-fab7-4f36-8c04-b5072ba301d6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=da3a7c59-0fa6-4774-9290-ad66deb4e874"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=455ee80d-7931-4614-95e6-c0ea89147551"], "isController": false}, {"data": [0.8620689655172413, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/da3a7c59-0fa6-4774-9290-ad66deb4e874"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d9462cb5-6a1f-4605-abab-634c6c7ef7a7"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8831521739130435, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1dca9868-9728-4637-8c32-21118893570a"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/455ee80d-7931-4614-95e6-c0ea89147551"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e11ed3b6-f6df-4889-b932-4c8d7839bf1a"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.022727272727272728, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e39b2157-c6b8-409b-823c-54d84bfaeee0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8609a6c9-4a2a-447c-8818-eb1354789b9a"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/406e40b8-6fef-4d43-8e91-4fc70c9a0701"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e11ed3b6-f6df-4889-b932-4c8d7839bf1a"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.32142857142857145, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8609a6c9-4a2a-447c-8818-eb1354789b9a"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.2391304347826087, 500, 1500, "register"], "isController": true}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1380, 40, 2.898550724637681, 286.03840579710163, 77, 2387, 88.0, 815.6000000000004, 1010.5000000000005, 1391.5700000000002, 5.524596464258263, 769.8888600315462, 4.0571059809261305], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/503c1ae0-85e4-4a46-90bb-74c96cb4617d", 3, 0, 0.0, 297.0, 165, 422, 304.0, 422.0, 422.0, 422.0, 0.020755500207555004, 0.02861313261035008, 0.01331000501591255], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6f99cf8e-fab7-4f36-8c04-b5072ba301d6", 1, 0, 0.0, 1030.0, 1030, 1030, 1030.0, 1030.0, 1030.0, 1030.0, 0.970873786407767, 0.17540200242718446, 0.6693719660194175], "isController": false}, {"data": ["see books", 58, 0, 0.0, 1325.034482758621, 952, 1884, 1318.5, 1588.0, 1641.7999999999997, 1884.0, 0.2651004410722856, 319.0034058836301, 1.3034967976552323], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 198.2142857142857, 160, 336, 163.5, 332.0, 336.0, 336.0, 0.09006806572395423, 0.1395879104530424, 0.20256519078346352], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 101.89473684210526, 80, 269, 83.0, 235.0, 269.0, 269.0, 0.10911200059724463, 0.08471097702618113, 0.0387859064623018], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1dca9868-9728-4637-8c32-21118893570a", 3, 0, 0.0, 267.3333333333333, 199, 403, 200.0, 403.0, 403.0, 403.0, 0.037486879592142745, 0.03125126908706952, 0.02403943775928425], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 21, 0, 0.0, 304.61904761904765, 157, 1150, 165.0, 826.4000000000003, 1126.4999999999995, 1150.0, 0.14725888111299665, 16.984850578254072, 0.327600335452225], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 93.33333333333333, 79, 234, 80.0, 189.00000000000017, 234.0, 234.0, 0.05776701599664951, 0.04293037028657254, 0.028996334201443215], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 105.75, 78, 237, 80.0, 235.5, 237.0, 237.0, 0.05776785026573211, 0.015457413059385349, 0.032945727104675346], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=406e40b8-6fef-4d43-8e91-4fc70c9a0701", 1, 0, 0.0, 502.0, 502, 502, 502.0, 502.0, 502.0, 502.0, 1.9920318725099602, 0.3598885707171315, 1.3734125996015936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 105.41666666666666, 77, 237, 79.5, 236.4, 237.0, 237.0, 0.05776868455891202, 0.015570465760019256, 0.03396166807076664], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 92.25000000000003, 78, 234, 79.0, 188.40000000000015, 234.0, 234.0, 0.057768406458507844, 0.015570390803269692, 0.03401791903757835], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 84.66666666666667, 83, 87, 84.0, 87.0, 87.0, 87.0, 0.04358881220486742, 0.012855294224482382, 0.026945037232110423], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=03ed9da5-252b-4e66-a02f-e4a932e867d3", 1, 0, 0.0, 899.0, 899, 899, 899.0, 899.0, 899.0, 899.0, 1.1123470522803114, 0.20096113737486096, 0.7669111512791991], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 907.7758620689652, 619, 1344, 859.5, 1203.5, 1255.45, 1344.0, 0.2639891491356631, 315.8227998438823, 0.5212754487815535], "isController": false}, {"data": ["deleteBook", 14, 3, 21.428571428571427, 428.07142857142856, 83, 1159, 430.0, 883.0, 1159.0, 1159.0, 0.07934438865148544, 0.016277333079242375, 0.05311579923886062], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, 21.428571428571427, 428.07142857142856, 83, 1159, 430.0, 883.0, 1159.0, 1159.0, 0.07771905671270596, 0.015943899678576186, 0.05202774743804681], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 9, 39.130434782608695, 948.3478260869566, 177, 2371, 930.0, 1604.2000000000003, 2231.399999999998, 2371.0, 0.09762018955294198, 0.030307355044629405, 0.044043483958456246], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 96.63157894736841, 78, 237, 80.0, 236.0, 237.0, 237.0, 0.09179808286951144, 0.03181981244202226, 0.051947825472518555], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 114.33333333333334, 78, 237, 80.0, 237.0, 237.0, 237.0, 0.052980132450331126, 0.014279801324503311, 0.031198261589403975], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=503c1ae0-85e4-4a46-90bb-74c96cb4617d", 1, 0, 0.0, 411.0, 411, 411, 411.0, 411.0, 411.0, 411.0, 2.4330900243309004, 0.43957192822384433, 1.6775015206812653], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 98.84210526315789, 79, 237, 81.0, 236.0, 237.0, 237.0, 0.09179409135927726, 0.06821806984805662, 0.046076331014324706], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 125.0, 79, 323, 80.0, 323.0, 323.0, 323.0, 0.052980132450331126, 0.014279801324503311, 0.031146523178807946], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 169.78947368421055, 79, 467, 82.0, 320.0, 467.0, 467.0, 0.09179808286951144, 1.4440551833304345, 0.05364167373270331], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 169.26315789473685, 77, 1016, 80.0, 236.0, 1016.0, 1016.0, 0.09179808286951144, 4.370812656117135, 0.05355202716740105], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 96.0, 78, 237, 80.0, 233.0, 237.0, 237.0, 0.10397627152035199, 0.02802485443321987, 0.06112667524926943], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 120.78947368421052, 77, 238, 80.0, 237.0, 238.0, 238.0, 0.10388985488227638, 0.028001562448738557, 0.06117732665430924], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cbab01fe-a308-44a9-bfe6-477c6e8f19c8", 3, 0, 0.0, 294.6666666666667, 205, 393, 286.0, 393.0, 393.0, 393.0, 0.043041606886657105, 0.03523751345050215, 0.027601551291248205], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 96.33333333333333, 77, 237, 79.0, 237.0, 237.0, 237.0, 0.052980132450331126, 0.014176324503311258, 0.030215231788079472], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 88.26315789473684, 78, 235, 80.0, 83.0, 235.0, 235.0, 0.10397456453810668, 0.0772701597788078, 0.05219035759041683], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 84.33333333333333, 79, 110, 81.0, 110.0, 110.0, 110.0, 0.052980132450331126, 0.03937293046357616, 0.026593543046357616], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 103.78947368421053, 78, 235, 80.0, 231.0, 235.0, 235.0, 0.10389042294337972, 0.02779880457664653, 0.05925000683489625], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 99.66666666666667, 79, 239, 82.0, 239.0, 239.0, 239.0, 0.054900142740371125, 0.043212417039784304, 0.0195152851147413], "isController": false}, {"data": ["deleteAccount", 13, 2, 15.384615384615385, 529.0769230769231, 79, 1189, 429.0, 1117.8, 1189.0, 1189.0, 0.07958030571080517, 0.015441400965370325, 0.0541554980043708], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cbab01fe-a308-44a9-bfe6-477c6e8f19c8", 1, 0, 0.0, 543.0, 543, 543, 543.0, 543.0, 543.0, 543.0, 1.8416206261510129, 0.3327146639042357, 1.2697110957642725], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1409.0454545454545, 949, 2387, 1293.0, 2019.6, 2338.0999999999995, 2387.0, 0.1097777001571817, 0.05681853621416631, 0.050493453880891194], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/03ed9da5-252b-4e66-a02f-e4a932e867d3", 3, 0, 0.0, 279.3333333333333, 193, 375, 270.0, 375.0, 375.0, 375.0, 0.05544569094571867, 0.035646236854750775, 0.03555599321714381], "isController": false}, {"data": ["goToProfile", 14, 3, 21.428571428571427, 180.64285714285714, 79, 294, 186.5, 289.5, 294.0, 294.0, 0.07952647663625727, 0.14038065135024597, 0.05139598256382], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 227.33333333333334, 160, 405, 165.0, 405.0, 405.0, 405.0, 0.05295519402194698, 0.0820702079226854, 0.11909747249271865], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d9462cb5-6a1f-4605-abab-634c6c7ef7a7", 1, 0, 0.0, 392.0, 392, 392, 392.0, 392.0, 392.0, 392.0, 2.5510204081632653, 0.46087771045918363, 1.7588089923469388], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 81.57142857142857, 78, 88, 80.5, 87.5, 88.0, 88.0, 0.09020444192444733, 0.0670366995161176, 0.04527840151285736], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6db7c00c-8919-4dd6-9194-4c93d5922ec1", 1, 0, 0.0, 193.0, 193, 193, 193.0, 193.0, 193.0, 193.0, 5.181347150259067, 1.6545903497409327, 3.091604598445596], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 79.92857142857142, 78, 87, 79.5, 85.0, 87.0, 87.0, 0.09020618556701031, 0.024137201997422683, 0.05144571520618557], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 9, 0, 0.0, 576.5555555555555, 458, 666, 623.0, 666.0, 666.0, 666.0, 0.07822821778735832, 23.001693450777065, 0.04461453045685279], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 9, 0, 0.0, 845.4444444444445, 693, 940, 861.0, 940.0, 940.0, 940.0, 0.07803017166637767, 70.21168562781776, 0.04442538093896307], "isController": false}, {"data": ["addBook", 63, 20, 31.746031746031747, 775.2539682539683, 401, 2384, 656.0, 1403.8, 1616.1999999999994, 2384.0, 0.29229049035209403, 73.3390513143793, 1.064405506370077], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-1", 9, 0, 0.0, 150.66666666666666, 78, 250, 80.0, 250.0, 250.0, 250.0, 0.07861154541563671, 0.1391055862237634, 0.04352807251041603], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6f99cf8e-fab7-4f36-8c04-b5072ba301d6", 3, 0, 0.0, 541.6666666666667, 190, 1189, 246.0, 1189.0, 1189.0, 1189.0, 0.02245979696343545, 0.026546719653071003, 0.014402929693348904], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=da3a7c59-0fa6-4774-9290-ad66deb4e874", 1, 0, 0.0, 199.0, 199, 199, 199.0, 199.0, 199.0, 199.0, 5.025125628140704, 0.9078596105527638, 3.4645885678391957], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 10, 0, 0.0, 80.3, 79, 83, 80.0, 82.9, 83.0, 83.0, 0.08366800535475234, 0.06217905476070951, 0.04199741675033467], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 10, 0, 0.0, 111.8, 79, 239, 81.0, 238.5, 239.0, 239.0, 0.08366800535475234, 0.02238772799531459, 0.0477169093038822], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 10, 0, 0.0, 112.1, 79, 238, 81.0, 237.7, 238.0, 238.0, 0.08366800535475234, 0.022551142068273092, 0.0491876359605087], "isController": false}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 134.1206896551724, 78, 342, 82.0, 324.0, 326.4, 342.0, 0.2646432107609405, 0.19667332362214424, 0.12792811457682182], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 10, 0, 0.0, 95.7, 77, 234, 80.0, 219.20000000000005, 234.0, 234.0, 0.08366800535475234, 0.022551142068273092, 0.04926934299698795], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=455ee80d-7931-4614-95e6-c0ea89147551", 1, 0, 0.0, 1244.0, 1244, 1244, 1244.0, 1244.0, 1244.0, 1244.0, 0.8038585209003215, 0.14522834606109325, 0.5542227692926045], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 495.60344827586204, 387, 769, 462.0, 691.3, 729.1, 769.0, 0.26454423133936916, 77.78478770895573, 0.13304714759743666], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 9, 0, 0.0, 80.22222222222223, 78, 87, 79.0, 87.0, 87.0, 87.0, 0.07861085877995946, 0.05842076516752848, 0.0441418396469499], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 123.79310344827584, 78, 336, 83.0, 242.1, 251.6499999999998, 336.0, 0.2648111622470597, 0.46859162694499235, 0.12878511601468332], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 92.07142857142857, 78, 246, 80.0, 166.0, 246.0, 246.0, 0.09020618556701031, 0.024313385953608248, 0.053031370811855674], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 536.7647058823532, 79, 1093, 768.0, 974.5999999999999, 1093.0, 1093.0, 0.08065702261717805, 42.70032261326381, 0.04334017633048503], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 768.7931034482759, 538, 1072, 775.5, 968.5, 999.4499999999999, 1072.0, 0.26444412022176833, 237.9472842187272, 0.1327385525331923], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 114.57142857142857, 78, 247, 80.0, 243.5, 247.0, 247.0, 0.09011618551060474, 0.024289128125905186, 0.05306646470985807], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/da3a7c59-0fa6-4774-9290-ad66deb4e874", 3, 0, 0.0, 388.6666666666667, 176, 604, 386.0, 604.0, 604.0, 604.0, 0.06784413939709175, 0.030697706302720548, 0.04350682116284855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 403.5294117647059, 78, 711, 535.0, 695.0, 711.0, 711.0, 0.08065740529871707, 13.959513540954983, 0.04341914895762165], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 21, 0, 0.0, 91.95238095238096, 80, 239, 83.0, 107.00000000000001, 226.19999999999982, 239.0, 0.1478810754475163, 0.11047756124741208, 0.05256710103798431], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d9462cb5-6a1f-4605-abab-634c6c7ef7a7", 3, 0, 0.0, 378.3333333333333, 274, 576, 285.0, 576.0, 576.0, 576.0, 0.04183166936248536, 0.02689373274443639, 0.026825647345083387], "isController": false}, {"data": ["deleteBooks", 14, 3, 21.428571428571427, 479.1428571428571, 83, 1244, 407.0, 1137.0, 1244.0, 1244.0, 0.07785520044933572, 0.01597182927744813, 0.05248817747927105], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 184, 20, 10.869565217391305, 134.60326086956528, 79, 1304, 85.0, 236.0, 316.75, 771.0500000000036, 0.7577910391209624, 1.6369309617356709, 0.36349967155524254], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 88.50000000000001, 80, 118, 84.0, 113.50000000000001, 118.0, 118.0, 0.05870841487279844, 0.045464622064579255, 0.02086900684931507], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1dca9868-9728-4637-8c32-21118893570a", 1, 0, 0.0, 351.0, 351, 351, 351.0, 351.0, 351.0, 351.0, 2.849002849002849, 0.5147124287749288, 1.9642539173789175], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/455ee80d-7931-4614-95e6-c0ea89147551", 3, 0, 0.0, 413.33333333333337, 183, 676, 381.0, 676.0, 676.0, 676.0, 0.026879793563185435, 0.031771005998673926, 0.0172373676170167], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 10, 0, 0.0, 208.7, 159, 319, 164.0, 319.0, 319.0, 319.0, 0.08361204013377926, 0.12958233173076925, 0.18804543791806022], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 94.63157894736844, 80, 244, 84.0, 105.0, 244.0, 244.0, 0.09382901390644754, 0.0761444439025956, 0.03335328228705752], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e11ed3b6-f6df-4889-b932-4c8d7839bf1a", 1, 0, 0.0, 480.0, 480, 480, 480.0, 480.0, 480.0, 480.0, 2.0833333333333335, 0.3763834635416667, 1.4363606770833335], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 534.3181818181819, 97, 1301, 490.5, 1026.7, 1262.5999999999995, 1301.0, 0.1074696276177403, 0.06601405837066275, 0.048592224206068124], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 81.41176470588235, 78, 89, 81.0, 88.2, 89.0, 89.0, 0.0806531960014992, 0.0599385567940829, 0.04048412377419003], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 135.7058823529412, 78, 240, 81.0, 239.2, 240.0, 240.0, 0.0806566399392703, 0.0928422421359776, 0.04201484438013], "isController": false}, {"data": ["login", 22, 0, 0.0, 2503.0454545454545, 1334, 4428, 2358.5, 3583.9999999999995, 4318.949999999999, 4428.0, 0.11021767991783774, 54.08772658030861, 0.24106203501916285], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 213.5, 158, 468, 164.0, 422.70000000000016, 468.0, 468.0, 0.057743944103862105, 0.08949183524690349, 0.12986748366327583], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 97.64285714285714, 81, 240, 83.0, 174.5, 240.0, 240.0, 0.09493070058857034, 0.07685307694133282, 0.03374489747484336], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 218.4736842105263, 159, 469, 162.0, 319.0, 469.0, 469.0, 0.10384329500240479, 0.1609368253601723, 0.233546004287635], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e39b2157-c6b8-409b-823c-54d84bfaeee0", 1, 0, 0.0, 215.0, 215, 215, 215.0, 215.0, 215.0, 215.0, 4.651162790697675, 1.4852834302325582, 2.7752543604651163], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 10, 0, 0.0, 84.4, 80, 91, 83.5, 90.7, 91.0, 91.0, 0.08792445530799937, 0.07289830327782369, 0.0312543962227654], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8609a6c9-4a2a-447c-8818-eb1354789b9a", 1, 0, 0.0, 403.0, 403, 403, 403.0, 403.0, 403.0, 403.0, 2.4813895781637716, 0.44829792183622824, 1.710801799007444], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/406e40b8-6fef-4d43-8e91-4fc70c9a0701", 3, 0, 0.0, 489.6666666666667, 179, 861, 429.0, 861.0, 861.0, 861.0, 0.04123541297266092, 0.034376267129877805, 0.02644328240759831], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 628.7058823529412, 159, 1174, 850.0, 1055.6, 1174.0, 1174.0, 0.08062221379114104, 56.788035641243, 0.16918716061604855], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 102.82352941176471, 81, 345, 82.0, 190.59999999999985, 345.0, 345.0, 0.08326109209166557, 0.06464117989538488, 0.029596716329459243], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e11ed3b6-f6df-4889-b932-4c8d7839bf1a", 3, 0, 0.0, 497.6666666666667, 188, 1011, 294.0, 1011.0, 1011.0, 1011.0, 0.025719944101988152, 0.025795295500724444, 0.01649358394561089], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 315.0526315789474, 159, 1099, 315.0, 558.0, 1099.0, 1099.0, 0.09175862651824306, 5.912366361408253, 0.2051316540096105], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 5, 35.714285714285715, 625.4285714285713, 79, 1019, 830.0, 1015.5, 1019.0, 1019.0, 0.09940569594637773, 76.46049544420146, 0.16749748823107566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 21, 0, 0.0, 102.47619047619048, 77, 238, 80.0, 234.2, 237.7, 238.0, 0.14734050390452333, 0.1094981674524827, 0.0739580263739502], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 21, 0, 0.0, 109.28571428571429, 77, 241, 80.0, 235.8, 240.5, 241.0, 0.14734670680110298, 0.060503693315371074, 0.08285511433402798], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8609a6c9-4a2a-447c-8818-eb1354789b9a", 3, 0, 0.0, 337.66666666666663, 174, 641, 198.0, 641.0, 641.0, 641.0, 0.028618308085625977, 0.023857905926851605, 0.01835223532834739], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 21, 0, 0.0, 185.14285714285714, 78, 912, 80.0, 716.6000000000004, 904.4999999999999, 912.0, 0.14734463911088033, 12.662690298232567, 0.0854165862702862], "isController": false}, {"data": ["register", 23, 9, 39.130434782608695, 948.3478260869566, 177, 2371, 930.0, 1604.2000000000003, 2231.399999999998, 2371.0, 0.09415733280932731, 0.029232269764852298, 0.04248114038858322], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 21, 0, 0.0, 154.95238095238096, 77, 635, 80.0, 424.00000000000017, 618.2999999999997, 635.0, 0.14734463911088033, 4.162047529170731, 0.08556047751941792], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 22.5, 0.6521739130434783], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 7.5, 0.21739130434782608], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 5.0, 0.14492753623188406], "isController": false}, {"data": ["401/Unauthorized", 26, 65.0, 1.8840579710144927], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1380, 40, "401/Unauthorized", 26, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 184, 20, "401/Unauthorized", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 5, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
