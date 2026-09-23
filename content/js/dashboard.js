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

    var data = {"OkPercent": 98.77769289533995, "KoPercent": 1.2223071046600458};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7404353562005277, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e08de6dd-94ee-43b9-add5-783a93068378"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4fa35a1f-dfdc-4fec-bdfc-7de3b17a0d82"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=593106f1-4bbc-4e81-b296-ab60fbc5891f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.1, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=88beb928-1398-4001-83b1-8a3b54467497"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3b9b3b9b-2903-4a41-bc9a-7123db2b17f8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/7047b6cf-d7e0-47e6-8731-6fd149b4ae36"], "isController": false}, {"data": [0.6052631578947368, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7631578947368421, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9bc632b9-0468-4bfb-afec-61764f6e56f4"], "isController": false}, {"data": [0.5416666666666666, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/48a2008b-3d2d-463d-84a0-a89172a5eb21"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4c595dd3-f14b-45dc-9548-672d67034fe2"], "isController": false}, {"data": [0.6904761904761905, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a3bc70eb-af4d-48b9-ab2c-a1490d3a0f95"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1804728c-70ef-4c40-b62a-dbc8aa2ee704"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/6cf65b26-452a-44e6-8dbd-485faef4979d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9cb57ecc-6ba4-4055-bb57-64db048ff705"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e948a5cc-0372-45d5-89f8-aee4c32f4152"], "isController": false}, {"data": [0.5526315789473685, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.7045454545454546, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.07142857142857142, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9bc632b9-0468-4bfb-afec-61764f6e56f4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.30701754385964913, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5416666666666666, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4fa35a1f-dfdc-4fec-bdfc-7de3b17a0d82"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7047b6cf-d7e0-47e6-8731-6fd149b4ae36"], "isController": false}, {"data": [0.3050847457627119, 500, 1500, "addBook"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=48a2008b-3d2d-463d-84a0-a89172a5eb21"], "isController": false}, {"data": [0.9122807017543859, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9912280701754386, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.3684210526315789, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9457142857142857, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/75be114c-a992-4e1f-b69c-c1824e61e235"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6b6e48cf-c10e-44ba-9857-017dfd0b2672"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3b9b3b9b-2903-4a41-bc9a-7123db2b17f8"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/88beb928-1398-4001-83b1-8a3b54467497"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/593106f1-4bbc-4e81-b296-ab60fbc5891f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4c595dd3-f14b-45dc-9548-672d67034fe2"], "isController": false}, {"data": [0.8157894736842105, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e948a5cc-0372-45d5-89f8-aee4c32f4152"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a3bc70eb-af4d-48b9-ab2c-a1490d3a0f95"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e08de6dd-94ee-43b9-add5-783a93068378"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1309, 16, 1.2223071046600458, 468.70664629488164, 131, 3895, 153.0, 1286.0, 1585.0, 2119.9000000000037, 5.242500700869078, 731.7101682648985, 3.8384354411970842], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 2285.754385964912, 1717, 3010, 2138.0, 2777.6, 2894.9999999999995, 3010.0, 0.2500943338276719, 300.9468440878467, 1.2297118855686795], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e08de6dd-94ee-43b9-add5-783a93068378", 1, 0, 0.0, 528.0, 528, 528, 528.0, 528.0, 528.0, 528.0, 1.893939393939394, 0.3421667850378788, 1.305782433712121], "isController": false}, {"data": ["deleteBook", 12, 1, 8.333333333333334, 608.0833333333333, 151, 1167, 529.5, 1111.2000000000003, 1167.0, 1167.0, 0.09320460741442652, 0.017726169232382388, 0.06297834109391141], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, 8.333333333333334, 608.0833333333333, 151, 1167, 529.5, 1111.2000000000003, 1167.0, 1167.0, 0.09403946522890774, 0.017884947122392365, 0.06354245441045092], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 22, 0, 0.0, 239.95454545454547, 133, 433, 144.5, 429.9, 432.85, 433.0, 0.1152550541960698, 0.038708262608640985, 0.06529141520109387], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 22, 0, 0.0, 166.3181818181818, 133, 429, 143.0, 327.29999999999984, 425.4, 429.0, 0.11525565800502934, 0.08565386302912825, 0.05785293770955574], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4fa35a1f-dfdc-4fec-bdfc-7de3b17a0d82", 3, 0, 0.0, 319.0, 234, 456, 267.0, 456.0, 456.0, 456.0, 0.037234702742956434, 0.031041039623929505, 0.02387772278763808], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 22, 0, 0.0, 222.0, 132, 1139, 139.5, 428.5, 1032.6499999999985, 1139.0, 0.11525565800502934, 1.5700616061137889, 0.06742005775880135], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 22, 0, 0.0, 260.4545454545455, 133, 1419, 142.5, 425.5, 1270.199999999998, 1419.0, 0.1152604887044721, 4.743817396278658, 0.0673103244582757], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=593106f1-4bbc-4e81-b296-ab60fbc5891f", 1, 0, 0.0, 441.0, 441, 441, 441.0, 441.0, 441.0, 441.0, 2.2675736961451247, 0.4096690759637188, 1.5633857709750567], "isController": false}, {"data": ["goToProfile", 12, 1, 8.333333333333334, 426.75, 136, 1928, 282.0, 1486.4000000000015, 1928.0, 1928.0, 0.09430033083699402, 0.22380980212647247, 0.06095601626287789], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 11, 0, 0.0, 139.27272727272728, 134, 145, 137.0, 144.8, 145.0, 145.0, 0.19214309420251882, 0.1427938424688641, 0.0964468265821237], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 11, 0, 0.0, 190.72727272727272, 133, 432, 142.0, 426.6, 432.0, 432.0, 0.19211960318569232, 0.05140700319617158, 0.10956821119184015], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 953.2, 655, 1122, 1066.0, 1122.0, 1122.0, 1122.0, 0.030119756150454206, 8.85620837826197, 0.017177673429555916], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1514.8, 1259, 1602, 1568.0, 1602.0, 1602.0, 1602.0, 0.030086046091822614, 27.071477159049884, 0.017129067257356037], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=88beb928-1398-4001-83b1-8a3b54467497", 1, 0, 0.0, 630.0, 630, 630, 630.0, 630.0, 630.0, 630.0, 1.5873015873015872, 0.2867683531746032, 1.0943700396825398], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 255.0, 135, 428, 148.0, 428.0, 428.0, 428.0, 0.03023724139599296, 0.053505743564003165, 0.01674269128078907], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 8, 0, 0.0, 143.875, 139, 146, 145.0, 146.0, 146.0, 146.0, 0.08267879288962382, 0.061443907606448946, 0.04150087846217445], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 8, 0, 0.0, 176.99999999999997, 135, 431, 142.5, 431.0, 431.0, 431.0, 0.08267793842560535, 0.022122807742788936, 0.047152261758353055], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 8, 0, 0.0, 140.99999999999997, 135, 146, 141.5, 146.0, 146.0, 146.0, 0.08268477463231115, 0.022286130662615113, 0.04860960383657354], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 8, 0, 0.0, 206.25, 135, 428, 137.0, 428.0, 428.0, 428.0, 0.08268477463231115, 0.022286130662615113, 0.04869035068680041], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3b9b3b9b-2903-4a41-bc9a-7123db2b17f8", 1, 0, 0.0, 694.0, 694, 694, 694.0, 694.0, 694.0, 694.0, 1.440922190201729, 0.2603228566282421, 0.9934483069164266], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 192.0, 133, 404, 142.0, 404.0, 404.0, 404.0, 0.03028852852270731, 0.022509345904082288, 0.017007718652887405], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7047b6cf-d7e0-47e6-8731-6fd149b4ae36", 3, 0, 0.0, 916.3333333333334, 456, 1155, 1138.0, 1155.0, 1155.0, 1155.0, 0.020805015395711394, 0.02459082386127216, 0.01334175791977586], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 809.6315789473684, 133, 1848, 144.0, 1691.0, 1848.0, 1848.0, 0.08710721522817506, 37.13935839948515, 0.04766362116155179], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 11, 0, 0.0, 137.0909090909091, 132, 146, 136.0, 145.6, 146.0, 146.0, 0.19212967006095752, 0.051784950133617454, 0.11295123181318009], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 607.5263157894738, 133, 1265, 402.0, 1196.0, 1265.0, 1265.0, 0.08710801393728224, 12.144664132702182, 0.047749124621767836], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 11, 0, 0.0, 164.45454545454544, 134, 408, 142.0, 355.6000000000002, 408.0, 408.0, 0.19122785668341358, 0.051541883246701316, 0.11260781013681484], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9bc632b9-0468-4bfb-afec-61764f6e56f4", 1, 0, 0.0, 464.0, 464, 464, 464.0, 464.0, 464.0, 464.0, 2.155172413793103, 0.3893622036637931, 1.4858903556034482], "isController": false}, {"data": ["deleteBooks", 12, 1, 8.333333333333334, 631.1666666666666, 140, 1720, 530.5, 1454.500000000001, 1720.0, 1720.0, 0.09403209628886659, 0.017883545656500754, 0.06427210097088139], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 8, 0, 0.0, 359.0, 277, 579, 288.0, 579.0, 579.0, 579.0, 0.0825559316436886, 0.12794556984231817, 0.18567022517130358], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/48a2008b-3d2d-463d-84a0-a89172a5eb21", 3, 0, 0.0, 1025.0, 316, 1928, 831.0, 1928.0, 1928.0, 1928.0, 0.02528913915770307, 0.025363228432579155, 0.016217319056209326], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4c595dd3-f14b-45dc-9548-672d67034fe2", 3, 0, 0.0, 440.33333333333337, 228, 831, 262.0, 831.0, 831.0, 831.0, 0.06508298080052066, 0.028812777958563837, 0.04173615630762556], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 747.9047619047619, 228, 2379, 533.0, 1435.6000000000004, 2291.4999999999986, 2379.0, 0.09422026004791773, 0.05787553083021509, 0.042601543361509675], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 142.4736842105263, 135, 168, 142.0, 148.0, 168.0, 168.0, 0.0870952363489677, 0.06472604966949651, 0.043717726057977926], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 214.21052631578945, 131, 429, 145.0, 423.0, 429.0, 429.0, 0.08710561785390096, 0.08527897866370814, 0.04621218068914297], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a3bc70eb-af4d-48b9-ab2c-a1490d3a0f95", 3, 0, 0.0, 377.0, 236, 637, 258.0, 637.0, 637.0, 637.0, 0.03442854355784569, 0.028701660173060813, 0.022078200133123702], "isController": false}, {"data": ["login", 21, 0, 0.0, 3043.6190476190477, 1686, 5451, 2648.0, 5225.8, 5437.7, 5451.0, 0.09584358327209992, 27.432333110934383, 0.1824477809357985], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 11, 0, 0.0, 146.8181818181818, 141, 151, 148.0, 150.8, 151.0, 151.0, 0.16857462492145955, 0.1364730117772363, 0.05992301120255007], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1804728c-70ef-4c40-b62a-dbc8aa2ee704", 1, 0, 0.0, 405.0, 405, 405, 405.0, 405.0, 405.0, 405.0, 2.4691358024691357, 0.7884837962962963, 1.4732831790123455], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6cf65b26-452a-44e6-8dbd-485faef4979d", 1, 0, 0.0, 890.0, 890, 890, 890.0, 890.0, 890.0, 890.0, 1.1235955056179776, 0.35880442415730335, 0.6704266151685393], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9cb57ecc-6ba4-4055-bb57-64db048ff705", 1, 0, 0.0, 241.0, 241, 241, 241.0, 241.0, 241.0, 241.0, 4.149377593360996, 1.3250453838174274, 2.4758493257261414], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e948a5cc-0372-45d5-89f8-aee4c32f4152", 1, 0, 0.0, 835.0, 835, 835, 835.0, 835.0, 835.0, 835.0, 1.1976047904191616, 0.21636414670658682, 0.8256923652694611], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 968.8947368421052, 269, 2017, 561.0, 1828.0, 2017.0, 2017.0, 0.08703818227627752, 49.3947500085893, 0.18520218483016104], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 22, 0, 0.0, 507.090909090909, 278, 1849, 544.5, 756.0999999999998, 1696.449999999998, 1849.0, 0.11516817170527417, 6.433155632443397, 0.25767651485407667], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, 28.571428571428573, 1258.7142857142858, 136, 1973, 1703.0, 1973.0, 1973.0, 1973.0, 0.04208298765164905, 35.96456274272866, 0.07574702939196094], "isController": false}, {"data": ["register", 22, 5, 22.727272727272727, 1238.6363636363637, 350, 1914, 1252.5, 1874.3, 1912.95, 1914.0, 0.08964443756264924, 0.028348143341455665, 0.040445048978460886], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 174.57894736842107, 135, 433, 147.0, 408.0, 433.0, 433.0, 0.09524907633461502, 0.07394825750587787, 0.03385807010332018], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 11, 0, 0.0, 357.54545454545456, 276, 577, 287.0, 572.0, 577.0, 577.0, 0.19078011724305388, 0.29567191998508446, 0.429068955088626], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 616.5625, 276, 1848, 564.5, 1481.9000000000003, 1848.0, 1848.0, 0.1568627450980392, 23.670515471813726, 0.34777113970588236], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 165.58333333333334, 133, 420, 144.0, 339.60000000000025, 420.0, 420.0, 0.0629201229039734, 0.04675997415031618, 0.03158295231703353], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9bc632b9-0468-4bfb-afec-61764f6e56f4", 3, 0, 0.0, 504.66666666666663, 259, 944, 311.0, 944.0, 944.0, 944.0, 0.030867373186541824, 0.030957804943924274, 0.019794506893713346], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 160.66666666666666, 131, 414, 138.5, 332.7000000000003, 414.0, 414.0, 0.06291880328436154, 0.024710786511257223, 0.035443030300647015], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 303.16666666666663, 133, 1253, 145.0, 1004.6000000000009, 1253.0, 1253.0, 0.06291979299388105, 4.733490641008499, 0.036539358952175714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 232.5, 134, 966, 142.0, 803.4000000000005, 966.0, 966.0, 0.06291748372010109, 1.557197481596636, 0.03659946074473328], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 140.0, 140, 140, 140.0, 140.0, 140.0, 140.0, 7.142857142857142, 2.106584821428571, 4.4154575892857135], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1567.6666666666665, 1054, 2425, 1427.0, 2186.6, 2323.7999999999993, 2425.0, 0.24952284228405328, 298.51606754736554, 0.49271014365073806], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, 22.727272727272727, 1238.6363636363637, 350, 1914, 1252.5, 1874.3, 1912.95, 1914.0, 0.09113806588453637, 0.02882047147378538, 0.0411189320689998], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 265.77777777777777, 135, 438, 143.0, 438.0, 438.0, 438.0, 0.05454578512597046, 0.014701793647234226, 0.03212022307710956], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 200.22222222222223, 134, 421, 143.0, 421.0, 421.0, 421.0, 0.05463751047218951, 0.014726516494457328, 0.03212088017993953], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 239.26315789473682, 132, 1722, 144.0, 414.0, 1722.0, 1722.0, 0.09144991432586974, 4.354235191431143, 0.05334891692015941], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 235.84210526315786, 134, 826, 142.0, 430.0, 826.0, 826.0, 0.091329468654765, 1.4366835175544852, 0.053367841752468295], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 157.47368421052633, 135, 418, 145.0, 148.0, 418.0, 418.0, 0.09144859385754235, 0.06796130852108372, 0.04590290746364919], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 174.0, 136, 434, 142.0, 434.0, 434.0, 434.0, 0.054538182787749516, 0.014593224691253287, 0.031103807371138395], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 197.42105263157893, 134, 431, 143.0, 405.0, 431.0, 431.0, 0.0913233230154, 0.03165524724588084, 0.051679162541095496], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 173.33333333333337, 134, 424, 143.0, 424.0, 424.0, 424.0, 0.05454148789178969, 0.040533273716456986, 0.027377270289433497], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 178.88888888888889, 143, 423, 149.0, 423.0, 423.0, 423.0, 0.057356258842423236, 0.04514564904979798, 0.020388357635392637], "isController": false}, {"data": ["deleteAccount", 12, 1, 8.333333333333334, 637.0, 137, 1155, 591.5, 1091.7000000000003, 1155.0, 1155.0, 0.09861365634784323, 0.018530186564711105, 0.0671147467478038], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1516.8095238095234, 869, 3895, 1346.0, 2501.2000000000003, 3764.099999999998, 3895.0, 0.09580860178751477, 0.04958843647205354, 0.044068214298749464], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 445.3333333333333, 282, 856, 298.0, 856.0, 856.0, 856.0, 0.0543980851874014, 0.08430640741445901, 0.12234256854158733], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4fa35a1f-dfdc-4fec-bdfc-7de3b17a0d82", 1, 0, 0.0, 525.0, 525, 525, 525.0, 525.0, 525.0, 525.0, 1.9047619047619047, 0.3441220238095238, 1.3132440476190477], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7047b6cf-d7e0-47e6-8731-6fd149b4ae36", 1, 0, 0.0, 533.0, 533, 533, 533.0, 533.0, 533.0, 533.0, 1.876172607879925, 0.3389569652908067, 1.2935330675422139], "isController": false}, {"data": ["addBook", 59, 7, 11.864406779661017, 1349.7457627118652, 714, 3048, 1090.0, 2399.0, 2774.0, 3048.0, 0.27372855406370916, 78.76579919748819, 0.996941721335053], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=48a2008b-3d2d-463d-84a0-a89172a5eb21", 1, 0, 0.0, 1720.0, 1720, 1720, 1720.0, 1720.0, 1720.0, 1720.0, 0.5813953488372093, 0.10503724563953488, 0.4008448401162791], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 244.9473684210526, 134, 870, 145.0, 579.4, 591.8999999999995, 870.0, 0.25141143260409315, 0.18683994161300282, 0.12153189369045518], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 892.4736842105261, 661, 1284, 837.0, 1188.6000000000001, 1263.8999999999999, 1284.0, 0.2515268118755957, 73.95723416760069, 0.12650030089446462], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 219.14035087719301, 134, 557, 145.0, 425.8, 438.6999999999997, 557.0, 0.25225703664365373, 0.4463767093733404, 0.12267969164896442], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 1318.7017543859654, 920, 2283, 1282.0, 1656.6000000000001, 1737.9999999999995, 2283.0, 0.2505153143967196, 225.41412025311934, 0.12574694492179087], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 146.625, 137, 159, 146.0, 157.6, 159.0, 159.0, 0.15457145065306438, 0.11547574194296313, 0.05494532034933148], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 7, 4.0, 212.99428571428578, 135, 1070, 149.0, 390.4, 460.99999999999983, 819.960000000003, 0.7363212548597203, 1.5877173594047158, 0.35368484740267936], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 145.91666666666663, 139, 151, 146.5, 151.0, 151.0, 151.0, 0.0632964807156722, 0.04901768477297662, 0.022499920879399105], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/75be114c-a992-4e1f-b69c-c1824e61e235", 1, 0, 0.0, 318.0, 318, 318, 318.0, 318.0, 318.0, 318.0, 3.1446540880503147, 1.0042010613207546, 1.876351218553459], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6b6e48cf-c10e-44ba-9857-017dfd0b2672", 1, 0, 0.0, 449.0, 449, 449, 449.0, 449.0, 449.0, 449.0, 2.2271714922048997, 0.7112158964365256, 1.3289079899777283], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3b9b3b9b-2903-4a41-bc9a-7123db2b17f8", 3, 0, 0.0, 552.3333333333334, 351, 869, 437.0, 869.0, 869.0, 869.0, 0.01645052504592438, 0.022678376812984947, 0.010549327584788748], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/88beb928-1398-4001-83b1-8a3b54467497", 3, 0, 0.0, 727.0, 270, 1321, 590.0, 1321.0, 1321.0, 1321.0, 0.017053593760658497, 0.02350975572148071, 0.010936061103026445], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 22, 0, 0.0, 158.68181818181816, 136, 420, 146.0, 155.1, 380.3999999999994, 420.0, 0.12183235867446393, 0.09886981451023392, 0.043307596247563356], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 493.75000000000006, 273, 1674, 292.0, 1345.2000000000012, 1674.0, 1674.0, 0.06287232203203345, 6.357416093284188, 0.14006078640176461], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/593106f1-4bbc-4e81-b296-ab60fbc5891f", 3, 0, 0.0, 395.0, 253, 526, 406.0, 526.0, 526.0, 526.0, 0.020468873666111734, 0.0241935157166835, 0.013126198281979204], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4c595dd3-f14b-45dc-9548-672d67034fe2", 1, 0, 0.0, 576.0, 576, 576, 576.0, 576.0, 576.0, 576.0, 1.736111111111111, 0.31365288628472227, 1.196967230902778], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 458.8421052631579, 271, 1862, 292.0, 841.0, 1862.0, 1862.0, 0.09125884370241931, 5.880163404363133, 0.20401436095994696], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e948a5cc-0372-45d5-89f8-aee4c32f4152", 3, 0, 0.0, 373.6666666666667, 249, 593, 279.0, 593.0, 593.0, 593.0, 0.01977365753343396, 0.02725958322073334, 0.012680372832312792], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a3bc70eb-af4d-48b9-ab2c-a1490d3a0f95", 1, 0, 0.0, 488.0, 488, 488, 488.0, 488.0, 488.0, 488.0, 2.0491803278688527, 0.3702132428278689, 1.412813780737705], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 8, 0, 0.0, 146.875, 135, 164, 146.5, 164.0, 164.0, 164.0, 0.08680743939755636, 0.07197218364113804, 0.030857331973350114], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e08de6dd-94ee-43b9-add5-783a93068378", 3, 0, 0.0, 372.3333333333333, 294, 507, 316.0, 507.0, 507.0, 507.0, 0.04603768952182186, 0.028638679907617703, 0.0295228673040329], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 163.21052631578945, 136, 425, 144.0, 236.0, 425.0, 425.0, 0.08775535654077622, 0.06813037934562216, 0.031194286895354046], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 146.0, 136, 168, 145.0, 167.3, 168.0, 168.0, 0.15708451146716934, 0.1167395636977694, 0.07884906142004398], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 289.125, 134, 581, 281.0, 477.4000000000001, 581.0, 581.0, 0.15708451146716934, 0.07152407565582784, 0.0879381798814012], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 387.74999999999994, 137, 1701, 144.0, 1336.3000000000004, 1701.0, 1701.0, 0.1570860537037946, 17.705335556673703, 0.09066197044818615], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 350.0625, 136, 1140, 144.0, 1123.2, 1140.0, 1140.0, 0.15709530775952635, 5.810953899891015, 0.09082072479847617], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 31.25, 0.3819709702062643], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 6.25, 0.07639419404125286], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 6.25, 0.07639419404125286], "isController": false}, {"data": ["401/Unauthorized", 9, 56.25, 0.6875477463712758], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1309, 16, "401/Unauthorized", 9, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
