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

    var data = {"OkPercent": 98.77300613496932, "KoPercent": 1.2269938650306749};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7343441001977588, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b9fc0532-2310-4854-b8a9-3744e728fa8c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ac3f08a2-5890-4afa-8191-7960ff5fe7f7"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=35f9be98-8899-4a5e-9731-7c981348b02a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0bb9d360-688d-4db9-8b1f-534b68707d93"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.55, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0b6a63a4-23b3-4857-9727-2987c34384ce"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3285d19e-6521-4100-b2ff-409750079972"], "isController": false}, {"data": [0.6944444444444444, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8095238095238095, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0e4f780a-9cf6-47c9-9a31-4c0ee9f7c747"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7d8375b0-cc9c-4726-a1f0-81ba59631b95"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/14be9d91-5b6c-4f9e-a699-c0ce576fb263"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4b98e0ab-effd-4cb6-a077-af5d77f8864c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2a666f0d-e12b-4670-9085-2675d7d21e36"], "isController": false}, {"data": [0.45, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3966bce9-edf1-47cc-8dbd-c6796e8d0444"], "isController": false}, {"data": [0.8055555555555556, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/6cc8c8d3-6960-4f14-93b9-9e89cc17943e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8ae834f5-e0f7-4081-bd45-b3126ac98cef"], "isController": false}, {"data": [0.2391304347826087, 500, 1500, "register"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/35f9be98-8899-4a5e-9731-7c981348b02a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8421052631578947, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.5416666666666666, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=745e1515-a339-429e-999f-29598f66ce99"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2391304347826087, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2a666f0d-e12b-4670-9085-2675d7d21e36"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0bb9d360-688d-4db9-8b1f-534b68707d93"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.2619047619047619, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/b9fc0532-2310-4854-b8a9-3744e728fa8c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ac3f08a2-5890-4afa-8191-7960ff5fe7f7"], "isController": false}, {"data": [0.2542372881355932, 500, 1500, "addBook"], "isController": true}, {"data": [0.9107142857142857, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9732142857142857, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.38392857142857145, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9109195402298851, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3285d19e-6521-4100-b2ff-409750079972"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3966bce9-edf1-47cc-8dbd-c6796e8d0444"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4b98e0ab-effd-4cb6-a077-af5d77f8864c"], "isController": false}, {"data": [0.7941176470588235, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=14be9d91-5b6c-4f9e-a699-c0ce576fb263"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7d8375b0-cc9c-4726-a1f0-81ba59631b95"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/745e1515-a339-429e-999f-29598f66ce99"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6cc8c8d3-6960-4f14-93b9-9e89cc17943e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8ae834f5-e0f7-4081-bd45-b3126ac98cef"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/a1880631-ed3b-4ef5-81cb-57b79c6cc941"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1304, 16, 1.2269938650306749, 485.34125766871176, 126, 2814, 171.0, 1381.5, 1616.0, 2151.7000000000003, 5.161392467691821, 732.5884988385383, 3.770734534871064], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 2337.357142857143, 1828, 3248, 2252.0, 2814.4, 2999.9999999999995, 3248.0, 0.24552142612874092, 295.44691767167865, 1.2072269341388773], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b9fc0532-2310-4854-b8a9-3744e728fa8c", 1, 0, 0.0, 794.0, 794, 794, 794.0, 794.0, 794.0, 794.0, 1.2594458438287153, 0.22753660264483627, 0.8683288727959697], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ac3f08a2-5890-4afa-8191-7960ff5fe7f7", 1, 0, 0.0, 727.0, 727, 727, 727.0, 727.0, 727.0, 727.0, 1.375515818431912, 0.2485062757909216, 0.9483536795048143], "isController": false}, {"data": ["deleteBook", 14, 0, 0.0, 640.5714285714286, 474, 977, 591.5, 962.0, 977.0, 977.0, 0.08972805988707083, 0.01621063581944151, 0.060987040704493456], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 0, 0.0, 640.5714285714286, 474, 977, 591.5, 962.0, 977.0, 977.0, 0.09170946441672781, 0.01656860441122524, 0.062333776595744676], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=35f9be98-8899-4a5e-9731-7c981348b02a", 1, 0, 0.0, 636.0, 636, 636, 636.0, 636.0, 636.0, 636.0, 1.5723270440251573, 0.28406299135220126, 1.084045794025157], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 187.61111111111114, 129, 431, 142.5, 422.0, 431.0, 431.0, 0.08902385344695414, 0.03124914994584382, 0.050356049047197475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 142.6111111111111, 129, 150, 143.0, 150.0, 150.0, 150.0, 0.08902561464768113, 0.06616063744813022, 0.04468668547744932], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 199.0, 130, 882, 144.0, 469.80000000000064, 882.0, 882.0, 0.08902649527417687, 1.476925986215731, 0.05199974219410743], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 250.61111111111111, 129, 1593, 140.0, 561.6000000000016, 1593.0, 1593.0, 0.08902605495875127, 4.472984494937879, 0.05191254550220587], "isController": false}, {"data": ["goToProfile", 14, 0, 0.0, 308.5714285714286, 230, 580, 266.5, 496.0, 580.0, 580.0, 0.09071940488070399, 0.18544448660916785, 0.05864867776467386], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/0bb9d360-688d-4db9-8b1f-534b68707d93", 3, 0, 0.0, 325.0, 238, 478, 259.0, 478.0, 478.0, 478.0, 0.06402731832248426, 0.029721014299434426, 0.04105918525237435], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 170.2105263157895, 135, 422, 144.0, 384.0, 422.0, 422.0, 0.1432859232892415, 0.10648494885069607, 0.07192281696354504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 167.78947368421052, 128, 422, 141.0, 381.0, 422.0, 422.0, 0.14302920806985847, 0.04957796973803071, 0.08093912319331527], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 902.6, 697, 1140, 834.0, 1140.0, 1140.0, 1140.0, 0.057331559877081134, 16.857382190810895, 0.032696905242397836], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1469.2, 1289, 1754, 1454.0, 1754.0, 1754.0, 1754.0, 0.05707567092451172, 51.356789026203444, 0.032495230614248374], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 312.4, 135, 440, 410.0, 440.0, 440.0, 440.0, 0.057993875846710584, 0.1026219756193746, 0.032111843364340725], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 18, 0, 0.0, 169.72222222222223, 131, 406, 142.0, 399.7, 406.0, 406.0, 0.08859401301347614, 0.06583988662427279, 0.04447004168840501], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 18, 0, 0.0, 238.72222222222223, 135, 444, 144.5, 440.4, 444.0, 444.0, 0.08856132133491432, 0.031086791939935743, 0.05009441928373572], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 18, 0, 0.0, 339.3333333333333, 131, 1583, 187.5, 667.7000000000014, 1583.0, 1583.0, 0.08856262853881502, 4.4497003092926795, 0.051642313993879335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 18, 0, 0.0, 255.8888888888889, 128, 1083, 144.0, 495.3000000000009, 1083.0, 1083.0, 0.08857570270057476, 1.469447456770136, 0.05173643746063302], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 202.6, 140, 431, 147.0, 431.0, 431.0, 431.0, 0.05799656660325709, 0.04310096404792836, 0.03256643144225862], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 909.7499999999999, 139, 1829, 866.5, 1737.0, 1824.55, 1829.0, 0.10363338653180508, 46.63871790279706, 0.056472099301510974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 250.63157894736844, 126, 1437, 142.0, 430.0, 1437.0, 1437.0, 0.14302274814446803, 6.809789683637445, 0.08343483714225494], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 588.4000000000001, 133, 1231, 461.0, 1189.6000000000001, 1229.25, 1231.0, 0.10363392352852782, 15.249873534227694, 0.05657359692621783], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 218.94736842105263, 128, 1081, 143.0, 430.0, 1081.0, 1081.0, 0.14301090646334028, 2.2496726979007504, 0.08356758817751417], "isController": false}, {"data": ["deleteBooks", 13, 0, 0.0, 736.3076923076924, 228, 1472, 727.0, 1346.3999999999999, 1472.0, 1472.0, 0.09618799573813189, 0.017377714073783593, 0.06631711424914172], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/0b6a63a4-23b3-4857-9727-2987c34384ce", 1, 0, 0.0, 271.0, 271, 271, 271.0, 271.0, 271.0, 271.0, 3.6900369003690034, 1.1783613929889298, 2.2017700645756455], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3285d19e-6521-4100-b2ff-409750079972", 3, 0, 0.0, 496.0, 252, 952, 284.0, 952.0, 952.0, 952.0, 0.022558426324179627, 0.0266632962184558, 0.014466178339399043], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 18, 0, 0.0, 546.6111111111111, 277, 1727, 542.0, 921.5000000000013, 1727.0, 1727.0, 0.08849383492949991, 6.011161707427091, 0.19776682120312286], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 506.80952380952397, 171, 1127, 395.0, 1050.0, 1122.8, 1127.0, 0.09874221229575644, 0.06065317532620195, 0.04464613700481956], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 169.8, 130, 420, 144.0, 388.50000000000057, 419.75, 420.0, 0.10363338653180508, 0.07701660854560906, 0.05201910222397248], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 258.05, 132, 537, 149.5, 441.90000000000003, 532.3, 537.0, 0.1036307016316654, 0.1055535369158467, 0.054750204670635724], "isController": false}, {"data": ["login", 21, 0, 0.0, 2938.9523809523807, 1722, 5074, 2531.0, 4803.6, 5049.299999999999, 5074.0, 0.09947939118612595, 28.47297339607246, 0.1893689024462456], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/0e4f780a-9cf6-47c9-9a31-4c0ee9f7c747", 1, 0, 0.0, 229.0, 229, 229, 229.0, 229.0, 229.0, 229.0, 4.366812227074235, 1.394480076419214, 2.605588155021834], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7d8375b0-cc9c-4726-a1f0-81ba59631b95", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 0.7314334514170041, 2.791308198380567], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 162.78947368421052, 136, 419, 147.0, 167.0, 419.0, 419.0, 0.14717159433311902, 0.1191457536153864, 0.052314902673100905], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/14be9d91-5b6c-4f9e-a699-c0ce576fb263", 3, 0, 0.0, 331.3333333333333, 230, 429, 335.0, 429.0, 429.0, 429.0, 0.022971079411021524, 0.023038377495233502, 0.014730802877510548], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4b98e0ab-effd-4cb6-a077-af5d77f8864c", 1, 0, 0.0, 317.0, 317, 317, 317.0, 317.0, 317.0, 317.0, 3.1545741324921135, 0.5699181782334385, 2.1749309936908516], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2a666f0d-e12b-4670-9085-2675d7d21e36", 1, 0, 0.0, 667.0, 667, 667, 667.0, 667.0, 667.0, 667.0, 1.4992503748125936, 0.27086066341829085, 1.033662856071964], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 1082.7, 274, 1972, 1151.0, 1876.9, 1967.35, 1972.0, 0.10355182768975874, 62.022235732499745, 0.2196431345138242], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3966bce9-edf1-47cc-8dbd-c6796e8d0444", 3, 0, 0.0, 623.3333333333334, 243, 1131, 496.0, 1131.0, 1131.0, 1131.0, 0.025346186666216068, 0.025420443072464747, 0.016253902256655486], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 445.22222222222223, 265, 1742, 293.0, 711.5000000000016, 1742.0, 1742.0, 0.088960496597261, 6.042860850647682, 0.19880972091115318], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 0, 0.0, 1672.6, 1437, 2185, 1595.0, 2185.0, 2185.0, 2185.0, 0.056983953318745444, 68.17261899674052, 0.12849213692674144], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6cc8c8d3-6960-4f14-93b9-9e89cc17943e", 3, 0, 0.0, 730.6666666666666, 545, 1067, 580.0, 1067.0, 1067.0, 1067.0, 0.02294419970631424, 0.023011419041391333, 0.014713565566874693], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8ae834f5-e0f7-4081-bd45-b3126ac98cef", 1, 0, 0.0, 865.0, 865, 865, 865.0, 865.0, 865.0, 865.0, 1.1560693641618498, 0.20886018786127167, 0.7970556358381503], "isController": false}, {"data": ["register", 23, 5, 21.73913043478261, 1360.5652173913043, 264, 2814, 1350.0, 2104.2000000000003, 2694.999999999998, 2814.0, 0.09008373871015754, 0.02851835749927541, 0.040643249300871855], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/35f9be98-8899-4a5e-9731-7c981348b02a", 3, 0, 0.0, 464.33333333333337, 272, 849, 272.0, 849.0, 849.0, 849.0, 0.0204158018306169, 0.02814483097417401, 0.013092164585389091], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 166.11764705882354, 131, 389, 150.0, 224.19999999999985, 389.0, 389.0, 0.08306378321329802, 0.06448799575641789, 0.02952657918910203], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 441.5263157894737, 280, 1822, 292.0, 853.0, 1822.0, 1822.0, 0.14285606875136278, 9.204773953767264, 0.3193629065758904], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 12, 0, 0.0, 658.2499999999999, 274, 1896, 569.5, 1580.1000000000013, 1896.0, 1896.0, 0.1077731375454668, 10.897620080044007, 0.24008641497148503], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 6, 0, 0.0, 184.33333333333331, 135, 401, 142.5, 401.0, 401.0, 401.0, 0.04218637942429654, 0.03135140111512663, 0.02117558498446135], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 6, 0, 0.0, 227.33333333333334, 131, 419, 147.0, 419.0, 419.0, 419.0, 0.04226244981334085, 0.011308507078960344, 0.024102803409170953], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=745e1515-a339-429e-999f-29598f66ce99", 1, 0, 0.0, 521.0, 521, 521, 521.0, 521.0, 521.0, 521.0, 1.9193857965451055, 0.3467640355086372, 1.3233265355086372], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 6, 0, 0.0, 184.33333333333331, 133, 420, 137.5, 420.0, 420.0, 420.0, 0.04226244981334085, 0.011391050926252025, 0.024845698034796086], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 6, 0, 0.0, 226.5, 133, 422, 144.0, 422.0, 422.0, 422.0, 0.04226215212966029, 0.011390970691197497, 0.024886794662290185], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1585.0892857142858, 1025, 2642, 1536.0, 2088.500000000001, 2321.3999999999996, 2642.0, 0.25118978734093184, 300.5103133592597, 0.49600170898766033], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, 21.73913043478261, 1360.5652173913043, 264, 2814, 1350.0, 2104.2000000000003, 2694.999999999998, 2814.0, 0.09226054377562236, 0.029207481928967403, 0.04162536252376712], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2a666f0d-e12b-4670-9085-2675d7d21e36", 3, 0, 0.0, 520.3333333333334, 285, 949, 327.0, 949.0, 949.0, 949.0, 0.025879024188261275, 0.025954841641937818, 0.01659559819364411], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 266.4, 141, 466, 142.0, 466.0, 466.0, 466.0, 0.052521008403361345, 0.014156053046218487, 0.03092789850315126], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0bb9d360-688d-4db9-8b1f-534b68707d93", 1, 0, 0.0, 228.0, 228, 228, 228.0, 228.0, 228.0, 228.0, 4.385964912280701, 0.7923862390350876, 3.0239172149122804], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 199.4, 136, 423, 143.0, 423.0, 423.0, 423.0, 0.05251438894257026, 0.01415426889467714, 0.03087271693694072], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 362.4117647058824, 133, 1675, 143.0, 1465.3999999999999, 1675.0, 1675.0, 0.08422638069333174, 8.936153848774012, 0.04866434610601624], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 275.35294117647055, 128, 858, 146.0, 840.4, 858.0, 858.0, 0.0842710553710405, 2.9351577603727756, 0.04877245420859565], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 142.8235294117647, 131, 157, 143.0, 151.4, 157.0, 157.0, 0.08440033561545221, 0.06272329629234291, 0.042365012213225035], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 193.8, 133, 413, 141.0, 413.0, 413.0, 413.0, 0.05252156010042122, 0.014053620573745523, 0.02995370224477148], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 160.35294117647058, 129, 415, 144.0, 220.59999999999982, 415.0, 415.0, 0.08440326888895508, 0.03749855707646937, 0.04730229154875034], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 145.0, 135, 156, 145.0, 156.0, 156.0, 156.0, 0.052524318759585686, 0.03903418610941866, 0.02636474593987016], "isController": false}, {"data": ["deleteAccount", 13, 0, 0.0, 762.3846153846154, 427, 1852, 584.0, 1611.6, 1852.0, 1852.0, 0.09511058434479781, 0.017183064554480074, 0.06473835672687898], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 156.6, 146, 174, 156.0, 174.0, 174.0, 174.0, 0.056495260047681996, 0.04446794882659345, 0.02008229947007446], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1578.1428571428573, 1029, 2440, 1478.0, 2345.6000000000004, 2435.4, 2440.0, 0.09846165387446608, 0.05096159819674514, 0.04528851462389993], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 414.2, 277, 609, 310.0, 609.0, 609.0, 609.0, 0.05243948483450099, 0.08127095940659479, 0.11793763044321853], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b9fc0532-2310-4854-b8a9-3744e728fa8c", 3, 0, 0.0, 1021.3333333333333, 310, 1852, 902.0, 1852.0, 1852.0, 1852.0, 0.026187379428940546, 0.02626410026711127, 0.016793339021814086], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ac3f08a2-5890-4afa-8191-7960ff5fe7f7", 3, 0, 0.0, 488.6666666666667, 393, 623, 450.0, 623.0, 623.0, 623.0, 0.039070130884938464, 0.02511832958911246, 0.02505473888129192], "isController": false}, {"data": ["addBook", 59, 11, 18.64406779661017, 1445.5084745762715, 709, 3506, 1127.0, 2543.0, 2655.0, 3506.0, 0.28087748029097004, 92.22099460233223, 1.019626723052424], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 244.92857142857142, 130, 601, 148.0, 567.2, 583.05, 601.0, 0.25293814758940913, 0.18797454132376987, 0.12226990532886477], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 890.9642857142858, 666, 1355, 840.5, 1162.2, 1194.9499999999998, 1355.0, 0.25221476086887984, 74.15951401368265, 0.12684629086667298], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 222.60714285714295, 127, 583, 147.0, 440.1, 558.6, 583.0, 0.25348427718505706, 0.4485483498626206, 0.1232765332403891], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1336.7678571428569, 884, 2018, 1364.5, 1684.8000000000002, 1842.8499999999997, 2018.0, 0.25189483390684386, 226.65541433326587, 0.12643939905089624], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 12, 0, 0.0, 170.24999999999997, 137, 435, 145.5, 352.2000000000003, 435.0, 435.0, 0.10392309690828787, 0.07763786048324241, 0.036941413354117957], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 11, 6.32183908045977, 227.2701149425288, 133, 2639, 151.0, 427.0, 500.0, 1186.25, 0.736910312932776, 1.597619209271941, 0.35375632355868386], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 6, 0, 0.0, 143.16666666666669, 133, 152, 143.5, 152.0, 152.0, 152.0, 0.04322330600659876, 0.0334727359992508, 0.015364534557033153], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3285d19e-6521-4100-b2ff-409750079972", 1, 0, 0.0, 1121.0, 1121, 1121, 1121.0, 1121.0, 1121.0, 1121.0, 0.8920606601248885, 0.16116330285459413, 0.6150340098126673], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 149.38888888888889, 137, 174, 148.5, 161.40000000000003, 174.0, 174.0, 0.09033061003271976, 0.07330540716522473, 0.03210970903506835], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3966bce9-edf1-47cc-8dbd-c6796e8d0444", 1, 0, 0.0, 1158.0, 1158, 1158, 1158.0, 1158.0, 1158.0, 1158.0, 0.8635578583765112, 0.15601387089810018, 0.5953826640759932], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 6, 0, 0.0, 459.33333333333337, 270, 822, 410.0, 822.0, 822.0, 822.0, 0.042142822023838795, 0.0653131431170236, 0.09478019445400462], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4b98e0ab-effd-4cb6-a077-af5d77f8864c", 3, 0, 0.0, 433.0, 231, 584, 484.0, 584.0, 584.0, 584.0, 0.06879787185249737, 0.030457391184699353, 0.04411842693666009], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 511.4117647058823, 265, 1817, 298.0, 1609.7999999999997, 1817.0, 1817.0, 0.08416383232584275, 11.960880565642839, 0.18675300730987637], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=14be9d91-5b6c-4f9e-a699-c0ce576fb263", 1, 0, 0.0, 819.0, 819, 819, 819.0, 819.0, 819.0, 819.0, 1.221001221001221, 0.22059104090354092, 0.8418231074481075], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 18, 0, 0.0, 148.83333333333331, 136, 164, 149.5, 160.4, 164.0, 164.0, 0.08694686097679968, 0.07208777829033489, 0.03090689198784676], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 179.04999999999998, 143, 480, 148.0, 395.50000000000057, 477.09999999999997, 480.0, 0.09860717367188462, 0.07655537409096512, 0.03505176876617774], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7d8375b0-cc9c-4726-a1f0-81ba59631b95", 3, 0, 0.0, 324.6666666666667, 245, 476, 253.0, 476.0, 476.0, 476.0, 0.07367387033398821, 0.03333550773575639, 0.047245287942043225], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/745e1515-a339-429e-999f-29598f66ce99", 3, 0, 0.0, 369.0, 312, 427, 368.0, 427.0, 427.0, 427.0, 0.04300766970109669, 0.027929785499247368, 0.027579788187226725], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6cc8c8d3-6960-4f14-93b9-9e89cc17943e", 1, 0, 0.0, 1472.0, 1472, 1472, 1472.0, 1472.0, 1472.0, 1472.0, 0.6793478260869565, 0.12273373811141304, 0.4683784816576087], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8ae834f5-e0f7-4081-bd45-b3126ac98cef", 3, 0, 0.0, 576.0, 216, 1251, 261.0, 1251.0, 1251.0, 1251.0, 0.0494445726340772, 0.03178809601311929, 0.031707619820681016], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 12, 0, 0.0, 189.91666666666666, 137, 431, 141.5, 428.0, 431.0, 431.0, 0.10921004732435385, 0.08116098243538405, 0.054818324535857305], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a1880631-ed3b-4ef5-81cb-57b79c6cc941", 2, 0, 0.0, 1595.5, 412, 2779, 1595.5, 2779.0, 2779.0, 2779.0, 0.01646727540694754, 0.02328575663013676, 0.010235762496603623], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 12, 0, 0.0, 264.9166666666667, 133, 443, 174.0, 439.7, 443.0, 443.0, 0.10892356288974213, 0.0427787365320553, 0.06135814634788371], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 12, 0, 0.0, 434.33333333333337, 137, 1464, 401.0, 1154.100000000001, 1464.0, 1464.0, 0.10791075780329668, 8.11818567450968, 0.06266692445347698], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 12, 0, 0.0, 330.50000000000006, 129, 1004, 295.0, 832.4000000000005, 1004.0, 1004.0, 0.10835899334495182, 2.6818674487326515, 0.06303304723549119], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 31.25, 0.3834355828220859], "isController": false}, {"data": ["401/Unauthorized", 11, 68.75, 0.843558282208589], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1304, 16, "401/Unauthorized", 11, "406/Not Acceptable", 5, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
