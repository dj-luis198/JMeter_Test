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

    var data = {"OkPercent": 98.72468117029257, "KoPercent": 1.275318829707427};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8154492566257272, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3135593220338983, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b5032571-53f1-4a91-a499-d838afe89177"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/eddc8907-154f-4564-b2b5-1f90720c77a1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dddd6739-027a-4f68-89dc-dae786a50c8d"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.8076923076923077, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.8409090909090909, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7bbd4bc4-7c04-4ef0-bdc5-2b4e66865927"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ba6fa041-b818-4bd5-92c7-875254ab2c3e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/58ae3151-0cf2-4407-a7de-b63cdc3af2db"], "isController": false}, {"data": [0.6818181818181818, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/49ac93d8-3d33-4658-af06-711f46badb84"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a931d7ce-2115-4f31-b8d7-2c809842511c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=60e4a779-c736-43ba-b3f9-c6fdb05c2373"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e3d452da-618a-401a-b112-e561cb2ad47c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4364a3ee-d93c-4ba9-b21c-49d61759f675"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "register"], "isController": true}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4915254237288136, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2a316921-c27d-4183-bcee-fc8ca3d0135a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/81a1b51d-3bfe-44ab-be5a-d267f77f27b7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.2727272727272727, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3879310344827586, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/19442ce7-5923-4120-baf9-efb860b79d3a"], "isController": false}, {"data": [0.9915254237288136, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.788135593220339, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.94, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7bbd4bc4-7c04-4ef0-bdc5-2b4e66865927"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/26abcabd-91b5-4db1-a21a-00b2b450bdf0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=49ac93d8-3d33-4658-af06-711f46badb84"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4364a3ee-d93c-4ba9-b21c-49d61759f675"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ba6fa041-b818-4bd5-92c7-875254ab2c3e"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/60e4a779-c736-43ba-b3f9-c6fdb05c2373"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2a316921-c27d-4183-bcee-fc8ca3d0135a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a931d7ce-2115-4f31-b8d7-2c809842511c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a6073cb3-85e2-425e-ba53-285159d53fc7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dddd6739-027a-4f68-89dc-dae786a50c8d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=81a1b51d-3bfe-44ab-be5a-d267f77f27b7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e3d452da-618a-401a-b112-e561cb2ad47c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=58ae3151-0cf2-4407-a7de-b63cdc3af2db"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b5032571-53f1-4a91-a499-d838afe89177"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8202ab49-c2b7-41f5-abd1-92e3ba8c2cb7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1333, 17, 1.275318829707427, 317.7929482370591, 81, 2396, 101.0, 896.2000000000003, 1083.0999999999997, 1544.6200000000006, 5.196192317587532, 749.5579936833421, 3.798393164989826], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 59, 0, 0.0, 1397.0508474576277, 1008, 2113, 1362.0, 1734.0, 1775.0, 2113.0, 0.258652813397339, 311.2461229477653, 1.271793862749611], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b5032571-53f1-4a91-a499-d838afe89177", 1, 0, 0.0, 188.0, 188, 188, 188.0, 188.0, 188.0, 188.0, 5.319148936170213, 0.9609790558510638, 3.6673038563829787], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eddc8907-154f-4564-b2b5-1f90720c77a1", 2, 0, 0.0, 355.5, 330, 381, 355.5, 381.0, 381.0, 381.0, 0.0603974149906384, 0.03712907493809265, 0.03754194789213022], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dddd6739-027a-4f68-89dc-dae786a50c8d", 1, 0, 0.0, 574.0, 574, 574, 574.0, 574.0, 574.0, 574.0, 1.7421602787456445, 0.3147457534843206, 1.2011378484320558], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 536.8461538461537, 91, 1089, 459.0, 1013.8, 1089.0, 1089.0, 0.06947858990529533, 0.013162935978151656, 0.04696798606954272], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 536.8461538461537, 91, 1089, 459.0, 1013.8, 1089.0, 1089.0, 0.06882859033752482, 0.013039791528788881, 0.04652858206485771], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 118.1875, 83, 258, 88.5, 250.3, 258.0, 258.0, 0.0838811823052646, 0.030318869727281303, 0.04739819249158567], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 87.0625, 82, 95, 85.5, 95.0, 95.0, 95.0, 0.08387854386847844, 0.0623355194178829, 0.042103097215232345], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 132.06250000000003, 82, 493, 86.0, 322.20000000000016, 493.0, 493.0, 0.08388250158590355, 1.5627109350015467, 0.0489451120093529], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 175.68750000000003, 83, 1029, 86.0, 484.40000000000055, 1029.0, 1029.0, 0.08388294135533864, 4.7385721370358915, 0.048863451678183095], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 224.07142857142858, 93, 345, 196.0, 344.5, 345.0, 345.0, 0.0697648923129055, 0.1317337914976529, 0.045097046391161785], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 86.125, 83, 96, 85.0, 91.80000000000001, 96.0, 96.0, 0.09163278162762728, 0.06809819025256285, 0.0459953610904301], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 116.25, 82, 258, 84.5, 255.9, 258.0, 258.0, 0.0915436548804211, 0.041681864343746426, 0.05124746109394668], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 565.2, 488, 662, 511.0, 662.0, 662.0, 662.0, 0.0541981919483166, 15.936067982147115, 0.03090990634552431], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 887.6, 737, 969, 911.0, 969.0, 969.0, 969.0, 0.054016096796845464, 48.6037788479717, 0.030753305109922757], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 122.2, 83, 251, 90.0, 251.0, 251.0, 251.0, 0.05453633210444798, 0.09650374391919897, 0.03019736357736524], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 96.26666666666667, 84, 251, 85.0, 152.60000000000005, 251.0, 251.0, 0.0661209484388844, 0.04913871265819437, 0.0331896166968619], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 139.4, 82, 253, 85.0, 250.6, 253.0, 253.0, 0.06607347370275747, 0.024295766892784777, 0.03731258534490353], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 149.8, 82, 898, 85.0, 508.0000000000002, 898.0, 898.0, 0.0661209484388844, 3.983016593327515, 0.038493067769564085], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 179.46666666666667, 82, 574, 86.0, 440.20000000000005, 574.0, 574.0, 0.0660752200304827, 1.3118426203890508, 0.0385309730347027], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 87.6, 85, 92, 88.0, 92.0, 92.0, 92.0, 0.05453454763592736, 0.04052811596771555, 0.03062242665103343], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 22, 0, 0.0, 480.2272727272729, 82, 1232, 175.0, 1044.8999999999999, 1207.8499999999997, 1232.0, 0.10545186122535062, 43.14539871887972, 0.05787494727406939], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 181.37499999999997, 83, 646, 85.5, 598.4000000000001, 646.0, 646.0, 0.09154627378057503, 10.318277517522528, 0.052835788871406095], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 22, 0, 0.0, 330.72727272727275, 82, 731, 169.5, 667.5, 721.6999999999998, 731.0, 0.10545388309957722, 14.109568531842278, 0.05797903924322458], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 193.43749999999997, 83, 742, 84.0, 688.1, 742.0, 742.0, 0.09163383121048291, 3.38953452161413, 0.05297580866856043], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 511.3846153846154, 89, 1039, 474.0, 1011.4, 1039.0, 1039.0, 0.06901677638564452, 0.013075443963686557, 0.047205359749946905], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/7bbd4bc4-7c04-4ef0-bdc5-2b4e66865927", 3, 0, 0.0, 616.3333333333334, 177, 1304, 368.0, 1304.0, 1304.0, 1304.0, 0.02009161777706341, 0.023747612027512122, 0.012884273118754855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 298.5333333333333, 168, 982, 174.0, 693.4000000000002, 982.0, 982.0, 0.06604816231996372, 5.3633085808671686, 0.1474172622926638], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ba6fa041-b818-4bd5-92c7-875254ab2c3e", 1, 0, 0.0, 474.0, 474, 474, 474.0, 474.0, 474.0, 474.0, 2.109704641350211, 0.3811478111814346, 1.4545424578059072], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/58ae3151-0cf2-4407-a7de-b63cdc3af2db", 3, 0, 0.0, 415.0, 184, 582, 479.0, 582.0, 582.0, 582.0, 0.04171823504053622, 0.026820805405292653, 0.0267529046321147], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 662.6818181818181, 201, 2271, 637.5, 1210.4999999999998, 2126.549999999998, 2271.0, 0.09747841074743788, 0.059876875351697674, 0.04407471110943724], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 22, 0, 0.0, 86.40909090909089, 83, 95, 85.0, 94.4, 95.0, 95.0, 0.1055353279510316, 0.07843006305735845, 0.05297378766292016], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 22, 0, 0.0, 133.90909090909088, 81, 338, 84.0, 254.2, 325.6999999999998, 338.0, 0.10553684675090426, 0.1002899864720951, 0.05616014376996805], "isController": false}, {"data": ["login", 22, 0, 0.0, 2728.8636363636365, 1808, 5000, 2647.0, 3921.2999999999997, 4859.749999999998, 5000.0, 0.09644850307539203, 26.357040884575255, 0.18186844862582804], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 91.81249999999999, 84, 108, 90.0, 107.3, 108.0, 108.0, 0.08954956568460644, 0.07249666987552611, 0.031832072176949944], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/49ac93d8-3d33-4658-af06-711f46badb84", 3, 0, 0.0, 305.6666666666667, 207, 449, 261.0, 449.0, 449.0, 449.0, 0.01901152732273335, 0.022470981676056247, 0.012191636987560123], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a931d7ce-2115-4f31-b8d7-2c809842511c", 3, 0, 0.0, 450.33333333333337, 197, 945, 209.0, 945.0, 945.0, 945.0, 0.02752748160246646, 0.03302043284670863, 0.017652714439081684], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=60e4a779-c736-43ba-b3f9-c6fdb05c2373", 1, 0, 0.0, 469.0, 469, 469, 469.0, 469.0, 469.0, 469.0, 2.1321961620469083, 0.3852112206823028, 1.4700493070362475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 22, 0, 0.0, 568.1363636363636, 168, 1318, 266.5, 1129.8999999999999, 1293.6999999999996, 1318.0, 0.10540840967457549, 57.40960854550769, 0.22480701576813983], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 286.5, 168, 1114, 188.5, 575.0000000000006, 1114.0, 1114.0, 0.08383854791635009, 6.390565682589878, 0.1872141793254141], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, 28.571428571428573, 722.2857142857143, 85, 1061, 998.0, 1061.0, 1061.0, 1061.0, 0.07554989530943079, 64.56573313078766, 0.1359855956029961], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e3d452da-618a-401a-b112-e561cb2ad47c", 1, 0, 0.0, 209.0, 209, 209, 209.0, 209.0, 209.0, 209.0, 4.784688995215311, 0.8644213516746412, 3.2988187799043063], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4364a3ee-d93c-4ba9-b21c-49d61759f675", 3, 0, 0.0, 368.6666666666667, 195, 482, 429.0, 482.0, 482.0, 482.0, 0.0345311816570363, 0.0287872253332259, 0.02214401948709685], "isController": false}, {"data": ["register", 22, 5, 22.727272727272727, 1192.454545454545, 245, 2153, 1193.0, 1750.2, 2093.749999999999, 2153.0, 0.10088133603573034, 0.03190157306101486, 0.04551482153174552], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 323.0, 169, 827, 335.0, 772.4000000000001, 827.0, 827.0, 0.09149863323916599, 13.807101312576487, 0.20285622276485993], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 12, 0, 0.0, 104.91666666666666, 84, 265, 89.0, 216.40000000000018, 265.0, 265.0, 0.1355978168751483, 0.10527369571849893, 0.04820078646733788], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 314.842105263158, 169, 1025, 183.0, 825.0, 1025.0, 1025.0, 0.12386888152919395, 15.770738207600985, 0.27524791093501444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 116.36363636363637, 85, 252, 86.0, 250.8, 252.0, 252.0, 0.0630668852985357, 0.046869042687681314, 0.03165662015961655], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 84.63636363636364, 83, 87, 84.0, 86.8, 87.0, 87.0, 0.06306797007138147, 0.016875609179256373, 0.03596845168133475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 129.45454545454544, 82, 250, 85.0, 250.0, 250.0, 250.0, 0.06300872384421953, 0.016982820098637292, 0.037042238041230614], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 114.45454545454545, 84, 250, 85.0, 249.6, 250.0, 250.0, 0.06300836292817047, 0.016982722820483444, 0.037103557466491], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 89.0, 89, 89, 89.0, 89.0, 89.0, 89.0, 11.235955056179774, 3.31372893258427, 6.945663623595506], "isController": false}, {"data": ["https://demoqa.com/books", 59, 0, 0.0, 973.4067796610169, 657, 1756, 904.0, 1374.0, 1411.0, 1756.0, 0.2518354106197712, 301.28270325571964, 0.4972765627667748], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, 22.727272727272727, 1192.454545454545, 245, 2153, 1193.0, 1750.2, 2093.749999999999, 2153.0, 0.09692910957395251, 0.03065176565184826, 0.0437316881085606], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 84.0, 83, 88, 83.0, 88.0, 88.0, 88.0, 0.025925989940715904, 0.006987864476208584, 0.015266964779542666], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2a316921-c27d-4183-bcee-fc8ca3d0135a", 3, 0, 0.0, 339.0, 268, 404, 345.0, 404.0, 404.0, 404.0, 0.035607040698847514, 0.02289189628262495, 0.022833942114820836], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 115.0, 83, 272, 84.0, 272.0, 272.0, 272.0, 0.025925989940715904, 0.006987864476208584, 0.015241646429991186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 12, 0, 0.0, 113.0, 82, 253, 85.0, 253.0, 253.0, 253.0, 0.12988418660028142, 0.0350078471696071, 0.07635769563805607], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 12, 0, 0.0, 112.91666666666666, 82, 261, 84.0, 258.3, 261.0, 261.0, 0.13012361743656475, 0.03507238126219909, 0.07662552862719584], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/81a1b51d-3bfe-44ab-be5a-d267f77f27b7", 3, 0, 0.0, 684.3333333333334, 182, 1379, 492.0, 1379.0, 1379.0, 1379.0, 0.024480003916800625, 0.024551722678275628, 0.0156984400117504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 85.0, 83, 90, 84.0, 90.0, 90.0, 90.0, 0.025926101967359037, 0.006937257752984743, 0.014785980028259451], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 12, 0, 0.0, 88.08333333333333, 83, 96, 87.5, 95.10000000000001, 96.0, 96.0, 0.130117973629424, 0.09669900188671061, 0.06531312348195698], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 85.5, 84, 87, 85.5, 87.0, 87.0, 87.0, 0.025925541843824534, 0.019266930999170383, 0.013013406745825988], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 12, 0, 0.0, 125.83333333333333, 82, 255, 84.0, 253.8, 255.0, 255.0, 0.13012502846484997, 0.03481861113219619, 0.07421193029635975], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 91.33333333333333, 84, 111, 87.0, 111.0, 111.0, 111.0, 0.026406939743764662, 0.020785149837377264, 0.009386841862041344], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 533.2307692307692, 85, 1547, 449.0, 1306.1999999999998, 1547.0, 1547.0, 0.06691683267188618, 0.012536852515300793, 0.04554285637073985], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1510.909090909091, 1096, 2396, 1411.5, 2056.5, 2348.4499999999994, 2396.0, 0.09772478922539778, 0.05058021317330159, 0.04494958566910386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 203.0, 168, 360, 171.0, 360.0, 360.0, 360.0, 0.025916135385891256, 0.04016494810293889, 0.058285995892292546], "isController": false}, {"data": ["addBook", 58, 8, 13.793103448275861, 914.4137931034484, 434, 1847, 769.0, 1478.7, 1611.35, 1847.0, 0.2821080279189669, 94.2296719962183, 1.0239003334833046], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/19442ce7-5923-4120-baf9-efb860b79d3a", 1, 0, 0.0, 372.0, 372, 372, 372.0, 372.0, 372.0, 372.0, 2.688172043010753, 0.858429939516129, 1.6039776545698925], "isController": false}, {"data": ["https://demoqa.com/books-0", 59, 0, 0.0, 167.20338983050846, 83, 658, 90.0, 340.0, 343.0, 658.0, 0.2528033318622179, 0.18787435112026155, 0.12220473561699009], "isController": false}, {"data": ["https://demoqa.com/books-3", 59, 0, 0.0, 540.9999999999998, 404, 757, 494.0, 668.0, 742.0, 757.0, 0.2528379994086162, 74.34276683783227, 0.12715973603070052], "isController": false}, {"data": ["https://demoqa.com/books-1", 59, 0, 0.0, 139.3728813559322, 83, 337, 89.0, 254.0, 257.0, 337.0, 0.2534658229261985, 0.44851569447487466, 0.12326755841528013], "isController": false}, {"data": ["https://demoqa.com/books-2", 59, 0, 0.0, 803.7288135593219, 572, 1125, 810.0, 1066.0, 1081.0, 1125.0, 0.2525814682261075, 227.27324910071366, 0.12678405729318287], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 99.26315789473684, 84, 255, 89.0, 120.0, 255.0, 255.0, 0.12145231398619279, 0.09073341816351317, 0.04317250223727947], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 8, 4.571428571428571, 151.63999999999996, 84, 725, 93.0, 278.4, 355.1999999999998, 659.6400000000008, 0.7109746039871456, 1.6053227304167124, 0.3391452015816138], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 89.9090909090909, 85, 100, 88.0, 99.4, 100.0, 100.0, 0.06442657420477108, 0.04989284506287448, 0.02290163379935222], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7bbd4bc4-7c04-4ef0-bdc5-2b4e66865927", 1, 0, 0.0, 531.0, 531, 531, 531.0, 531.0, 531.0, 531.0, 1.8832391713747645, 0.34023363935969864, 1.298405131826742], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/26abcabd-91b5-4db1-a21a-00b2b450bdf0", 1, 0, 0.0, 200.0, 200, 200, 200.0, 200.0, 200.0, 200.0, 5.0, 1.5966796875, 2.9833984375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 102.125, 85, 269, 88.5, 157.0000000000001, 269.0, 269.0, 0.08167265599477294, 0.06627927454263313, 0.029032076935641946], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=49ac93d8-3d33-4658-af06-711f46badb84", 1, 0, 0.0, 429.0, 429, 429, 429.0, 429.0, 429.0, 429.0, 2.331002331002331, 0.4211283508158508, 1.6071168414918415], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4364a3ee-d93c-4ba9-b21c-49d61759f675", 1, 0, 0.0, 417.0, 417, 417, 417.0, 417.0, 417.0, 417.0, 2.398081534772182, 0.43324715227817745, 1.6533648081534773], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 247.45454545454544, 170, 502, 173.0, 501.0, 502.0, 502.0, 0.06297661849909543, 0.09760145855279731, 0.14163589101896168], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ba6fa041-b818-4bd5-92c7-875254ab2c3e", 3, 0, 0.0, 303.0, 228, 378, 303.0, 378.0, 378.0, 378.0, 0.03224904865306474, 0.026884704948079034, 0.0206805422677531], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/60e4a779-c736-43ba-b3f9-c6fdb05c2373", 3, 0, 0.0, 692.3333333333333, 186, 1547, 344.0, 1547.0, 1547.0, 1547.0, 0.021859197621719298, 0.02583683156395273, 0.014017779724865566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 12, 0, 0.0, 272.1666666666667, 168, 358, 336.5, 355.3, 358.0, 358.0, 0.1297605917082982, 0.20110357328229417, 0.29183461201583083], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2a316921-c27d-4183-bcee-fc8ca3d0135a", 1, 0, 0.0, 1039.0, 1039, 1039, 1039.0, 1039.0, 1039.0, 1039.0, 0.9624639076034649, 0.17388263955726663, 0.6635737487969202], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a931d7ce-2115-4f31-b8d7-2c809842511c", 1, 0, 0.0, 970.0, 970, 970, 970.0, 970.0, 970.0, 970.0, 1.0309278350515465, 0.1862516108247423, 0.7107764175257733], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a6073cb3-85e2-425e-ba53-285159d53fc7", 1, 0, 0.0, 379.0, 379, 379, 379.0, 379.0, 379.0, 379.0, 2.638522427440633, 0.8425750329815304, 1.5743527374670185], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dddd6739-027a-4f68-89dc-dae786a50c8d", 3, 0, 0.0, 364.3333333333333, 200, 487, 406.0, 487.0, 487.0, 487.0, 0.03287022833851952, 0.026717760469167726, 0.021078889917605294], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=81a1b51d-3bfe-44ab-be5a-d267f77f27b7", 1, 0, 0.0, 666.0, 666, 666, 666.0, 666.0, 666.0, 666.0, 1.5015015015015014, 0.2712673611111111, 1.0352149024024024], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 100.99999999999999, 85, 251, 87.0, 163.40000000000003, 251.0, 251.0, 0.06922043941134938, 0.057390774472886354, 0.0246057030720031], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e3d452da-618a-401a-b112-e561cb2ad47c", 3, 0, 0.0, 325.6666666666667, 192, 480, 305.0, 480.0, 480.0, 480.0, 0.0872093023255814, 0.039459938226744186, 0.05592523619186047], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=58ae3151-0cf2-4407-a7de-b63cdc3af2db", 1, 0, 0.0, 593.0, 593, 593, 593.0, 593.0, 593.0, 593.0, 1.6863406408094435, 0.30466115092748736, 1.1626528246205734], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b5032571-53f1-4a91-a499-d838afe89177", 3, 0, 0.0, 259.3333333333333, 188, 389, 201.0, 389.0, 389.0, 389.0, 0.08295313148071339, 0.03753413175722384, 0.053195855799806444], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 22, 0, 0.0, 103.50000000000001, 84, 254, 88.0, 206.69999999999987, 253.7, 254.0, 0.1031445007571744, 0.08007800595893912, 0.03666464675352684], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8202ab49-c2b7-41f5-abd1-92e3ba8c2cb7", 1, 0, 0.0, 195.0, 195, 195, 195.0, 195.0, 195.0, 195.0, 5.128205128205129, 1.6376201923076923, 3.059895833333333], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 86.63157894736842, 83, 93, 86.0, 90.0, 93.0, 93.0, 0.12394241244120889, 0.09210954674585935, 0.06221328124490368], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 129.21052631578948, 82, 258, 87.0, 256.0, 258.0, 258.0, 0.12394160393481977, 0.05275927034273115, 0.06958974513692286], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 216.5263157894737, 83, 939, 89.0, 737.0, 939.0, 939.0, 0.12393998695368558, 11.768985954827135, 0.07174198874755382], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 170.63157894736844, 82, 655, 85.0, 654.0, 655.0, 655.0, 0.12393917847894012, 3.865913708977763, 0.07186255512031886], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 29.41176470588235, 0.37509377344336087], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.882352941176471, 0.07501875468867217], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.882352941176471, 0.07501875468867217], "isController": false}, {"data": ["401/Unauthorized", 10, 58.8235294117647, 0.7501875468867217], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1333, 17, "401/Unauthorized", 10, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
