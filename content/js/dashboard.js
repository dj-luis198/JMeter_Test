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

    var data = {"OkPercent": 97.7726574500768, "KoPercent": 2.227342549923195};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.730844793713163, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3a8e4835-f7b1-4374-b165-278d3559d8c0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a367f1dd-b13d-4055-946d-93587c4479c4"], "isController": false}, {"data": [0.4411764705882353, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4411764705882353, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/fec8463f-052d-4e2a-8692-b918755ade08"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fec2dce0-7114-4605-a620-4a6e802a3d89"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/7bd7b2ae-c210-4106-bd86-3d09f65ded11"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/64c2cc00-536f-4753-b25a-4c376aeba5ab"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a84cc67d-c0fb-479e-a1bd-ecc664efb53f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/269b9900-052c-402f-925c-863875486273"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6b189a51-bb42-4e8f-9758-ce22219581d6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.53125, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c6d484e6-dedc-4419-a04b-a4502846260a"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/016d83e7-bce5-419e-a3a8-9a6d79f28cb9"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6b189a51-bb42-4e8f-9758-ce22219581d6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=64c2cc00-536f-4753-b25a-4c376aeba5ab"], "isController": false}, {"data": [0.5526315789473685, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0ce61b54-0a59-4dac-bf8f-e9626265fc3f"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.09090909090909091, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4b0fe92a-5419-49ce-9a64-2158efe3fd8b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/98118d46-71a9-4751-9371-f888c3d96898"], "isController": false}, {"data": [0.22, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fec8463f-052d-4e2a-8692-b918755ade08"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=98118d46-71a9-4751-9371-f888c3d96898"], "isController": false}, {"data": [0.6578947368421053, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.2767857142857143, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0ce61b54-0a59-4dac-bf8f-e9626265fc3f"], "isController": false}, {"data": [0.22, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3a8e4835-f7b1-4374-b165-278d3559d8c0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5625, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.23809523809523808, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a367f1dd-b13d-4055-946d-93587c4479c4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c7d27bad-8955-4963-b428-95cecdd1932a"], "isController": false}, {"data": [0.2543859649122807, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c6d484e6-dedc-4419-a04b-a4502846260a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=016d83e7-bce5-419e-a3a8-9a6d79f28cb9"], "isController": false}, {"data": [0.9107142857142857, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a84cc67d-c0fb-479e-a1bd-ecc664efb53f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fec2dce0-7114-4605-a620-4a6e802a3d89"], "isController": false}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4375, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9264705882352942, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8529411764705882, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=269b9900-052c-402f-925c-863875486273"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/31fbbba5-d005-4715-b34b-90448878e181"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4b0fe92a-5419-49ce-9a64-2158efe3fd8b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1302, 29, 2.227342549923195, 448.3248847926269, 127, 2246, 144.0, 1281.7, 1463.2499999999995, 1985.4900000000005, 5.060732679039938, 719.401699604023, 3.689779752939462], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 2132.964285714286, 1569, 2783, 2103.0, 2553.6000000000004, 2634.0, 2783.0, 0.2564983396312836, 308.6528111759991, 1.2612003320737433], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3a8e4835-f7b1-4374-b165-278d3559d8c0", 1, 0, 0.0, 536.0, 536, 536, 536.0, 536.0, 536.0, 536.0, 1.8656716417910448, 0.3370598180970149, 1.2862931436567164], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a367f1dd-b13d-4055-946d-93587c4479c4", 1, 0, 0.0, 466.0, 466, 466, 466.0, 466.0, 466.0, 466.0, 2.1459227467811157, 0.3876911212446352, 1.4795131437768239], "isController": false}, {"data": ["deleteBook", 17, 3, 17.647058823529413, 650.4705882352941, 134, 2013, 548.0, 1256.9999999999993, 2013.0, 2013.0, 0.09591568447125068, 0.019262478912654663, 0.06438274201784032], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 3, 17.647058823529413, 650.4705882352941, 134, 2013, 548.0, 1256.9999999999993, 2013.0, 2013.0, 0.09503418435513715, 0.019085449707350613, 0.06379104114141645], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 247.83333333333331, 129, 402, 136.0, 398.4, 402.0, 402.0, 0.10410039905152971, 0.03654131846047077, 0.05888404733676479], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 148.77777777777774, 130, 406, 133.0, 169.30000000000038, 406.0, 406.0, 0.10410340938665742, 0.07736591263988896, 0.052255031664787024], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 240.22222222222223, 128, 1047, 132.5, 574.5000000000008, 1047.0, 1047.0, 0.10394650220020096, 1.7244449509430257, 0.060714412038159915], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 260.4444444444445, 130, 1142, 133.0, 474.20000000000107, 1142.0, 1142.0, 0.1039459019328163, 5.222610480417747, 0.060612551756397], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fec8463f-052d-4e2a-8692-b918755ade08", 3, 0, 0.0, 473.0, 227, 623, 569.0, 623.0, 623.0, 623.0, 0.02819628372980441, 0.023083871608222034, 0.01808160121995921], "isController": false}, {"data": ["goToProfile", 17, 3, 17.647058823529413, 277.70588235294116, 132, 596, 241.0, 542.4, 596.0, 596.0, 0.09627746031386453, 0.1674679169521954, 0.06222528182394817], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/fec2dce0-7114-4605-a620-4a6e802a3d89", 3, 0, 0.0, 429.0, 277, 529, 481.0, 529.0, 529.0, 529.0, 0.02335702774036328, 0.027607216056399434, 0.014978302294438691], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7bd7b2ae-c210-4106-bd86-3d09f65ded11", 2, 0, 0.0, 423.5, 251, 596, 423.5, 596.0, 596.0, 596.0, 0.04326382279138184, 0.03823609338496149, 0.02689201485030717], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/64c2cc00-536f-4753-b25a-4c376aeba5ab", 3, 0, 0.0, 385.0, 232, 553, 370.0, 553.0, 553.0, 553.0, 0.04926431949553337, 0.031672210613176564, 0.031592027801497634], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 132.55555555555554, 130, 136, 132.5, 135.1, 136.0, 136.0, 0.0901559698278021, 0.06700067679585683, 0.04525407079247098], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a84cc67d-c0fb-479e-a1bd-ecc664efb53f", 3, 0, 0.0, 411.0, 287, 547, 399.0, 547.0, 547.0, 547.0, 0.04297255486162837, 0.03582445084655933, 0.027557269881968716], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 174.66666666666669, 129, 392, 131.0, 389.3, 392.0, 392.0, 0.09004186946930322, 0.0240932346040909, 0.05135200368171199], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/269b9900-052c-402f-925c-863875486273", 3, 0, 0.0, 535.0, 368, 743, 494.0, 743.0, 743.0, 743.0, 0.042010334542297405, 0.02662569054487404, 0.026940221044376916], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 1020.0, 785, 1155, 1059.0, 1155.0, 1155.0, 1155.0, 0.061061244428161444, 17.95403328601087, 0.03482399096293582], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1295.0, 1032, 1445, 1417.0, 1445.0, 1445.0, 1445.0, 0.061061244428161444, 54.943015070678385, 0.034764360841423946], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 236.8, 131, 393, 139.0, 393.0, 393.0, 393.0, 0.061634801474304446, 0.10906470729632779, 0.034127863706963496], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 10, 0, 0.0, 156.6, 128, 385, 131.5, 359.9000000000001, 385.0, 385.0, 0.04665506510714336, 0.03467236772122666, 0.023418655727609067], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 10, 0, 0.0, 246.8, 128, 523, 132.0, 509.70000000000005, 523.0, 523.0, 0.046656153480082486, 0.012484166067912696, 0.026608587531609544], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 10, 0, 0.0, 209.60000000000002, 127, 402, 131.5, 401.1, 402.0, 402.0, 0.04665550045022558, 0.012575115355724864, 0.027428331319370898], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 10, 0, 0.0, 209.79999999999995, 128, 400, 131.0, 399.7, 400.0, 400.0, 0.04665571812481338, 0.012575174025828605, 0.027474021512951627], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6b189a51-bb42-4e8f-9758-ce22219581d6", 1, 0, 0.0, 851.0, 851, 851, 851.0, 851.0, 851.0, 851.0, 1.1750881316098707, 0.21229619565217392, 0.8101681844888367], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 134.8, 132, 138, 134.0, 138.0, 138.0, 138.0, 0.06182991826084806, 0.04594977323877478, 0.034718948242175425], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 131.83333333333331, 128, 138, 131.5, 136.2, 138.0, 138.0, 0.09015687295894857, 0.02430009466471661, 0.053002380391881876], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 755.2105263157893, 129, 1464, 1150.0, 1459.0, 1464.0, 1464.0, 0.092554704701779, 43.843861963791625, 0.050225769543656595], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 132.22222222222223, 129, 136, 132.0, 136.0, 136.0, 136.0, 0.09015642139111359, 0.024299972953073585, 0.053090158299649894], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 636.263157894737, 130, 1169, 783.0, 1057.0, 1169.0, 1169.0, 0.09243223257895658, 14.316088134133762, 0.0502495746292981], "isController": false}, {"data": ["deleteBooks", 16, 3, 18.75, 504.8125, 134, 851, 523.5, 830.7, 851.0, 851.0, 0.09246577321613297, 0.018686167914954605, 0.06251485412079497], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c6d484e6-dedc-4419-a04b-a4502846260a", 1, 0, 0.0, 647.0, 647, 647, 647.0, 647.0, 647.0, 647.0, 1.5455950540958268, 0.27923348145285937, 1.0656153400309119], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 10, 0, 0.0, 459.6, 261, 775, 524.0, 763.0, 775.0, 775.0, 0.046626567818342894, 0.07226207336690446, 0.1048642438336364], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/016d83e7-bce5-419e-a3a8-9a6d79f28cb9", 3, 0, 0.0, 363.3333333333333, 247, 508, 335.0, 508.0, 508.0, 508.0, 0.034096333507603487, 0.02842471032323324, 0.021865161787102492], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 633.8095238095239, 139, 1406, 485.0, 1227.0, 1389.6999999999998, 1406.0, 0.09891895711156645, 0.060761742210132134, 0.04472605189712429], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 149.1578947368421, 129, 393, 134.0, 152.0, 393.0, 393.0, 0.0925438852845481, 0.06877528974759874, 0.046452692418220434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 227.73684210526318, 128, 397, 133.0, 397.0, 397.0, 397.0, 0.09243403129135207, 0.09780257854460185, 0.04863048644625204], "isController": false}, {"data": ["login", 21, 0, 0.0, 2892.333333333334, 1882, 4210, 2806.0, 4018.8, 4191.599999999999, 4210.0, 0.09660013524018933, 27.648873278735092, 0.18388795275563385], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6b189a51-bb42-4e8f-9758-ce22219581d6", 3, 0, 0.0, 726.0, 228, 1010, 940.0, 1010.0, 1010.0, 1010.0, 0.0282866760326994, 0.02358143792960389, 0.01813956763815684], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 136.44444444444446, 132, 147, 135.0, 144.3, 147.0, 147.0, 0.08819076642675512, 0.07139662633572265, 0.031349061503260604], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=64c2cc00-536f-4753-b25a-4c376aeba5ab", 1, 0, 0.0, 536.0, 536, 536, 536.0, 536.0, 536.0, 536.0, 1.8656716417910448, 0.3370598180970149, 1.2862931436567164], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 947.5263157894736, 261, 1604, 1282.0, 1603.0, 1604.0, 1604.0, 0.09236348433952817, 58.22508886187527, 0.19528971295616623], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0ce61b54-0a59-4dac-bf8f-e9626265fc3f", 3, 0, 0.0, 476.66666666666663, 245, 897, 288.0, 897.0, 897.0, 897.0, 0.023088289619504987, 0.02315593109299963, 0.014805966976049747], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 511.55555555555554, 264, 1272, 523.5, 843.6000000000007, 1272.0, 1272.0, 0.10386732680123256, 7.055444009379797, 0.23212363962653926], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 6, 54.54545454545455, 723.1818181818182, 131, 1579, 136.0, 1575.4, 1579.0, 1579.0, 0.10204649609440228, 55.5072058741674, 0.14147355140360318], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4b0fe92a-5419-49ce-9a64-2158efe3fd8b", 1, 0, 0.0, 511.0, 511, 511, 511.0, 511.0, 511.0, 511.0, 1.9569471624266144, 0.35355002446183953, 1.349223336594912], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/98118d46-71a9-4751-9371-f888c3d96898", 3, 0, 0.0, 325.0, 241, 438, 296.0, 438.0, 438.0, 438.0, 0.04132914531327492, 0.03383554702567918, 0.026503390711963414], "isController": false}, {"data": ["register", 25, 6, 24.0, 1316.3600000000001, 229, 2155, 1315.0, 2135.8, 2150.5, 2155.0, 0.09754080131719098, 0.030801556165944214, 0.044007666219279526], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fec8463f-052d-4e2a-8692-b918755ade08", 1, 0, 0.0, 822.0, 822, 822, 822.0, 822.0, 822.0, 822.0, 1.2165450121654502, 0.21978596411192217, 0.8387507603406327], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 153.05882352941177, 132, 395, 135.0, 201.39999999999984, 395.0, 395.0, 0.07711009507221134, 0.05986574763907032, 0.027410229107700124], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 309.2777777777777, 261, 525, 268.0, 523.2, 525.0, 525.0, 0.08998110396816668, 0.1394531367162896, 0.20236961175653112], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=98118d46-71a9-4751-9371-f888c3d96898", 1, 0, 0.0, 654.0, 654, 654, 654.0, 654.0, 654.0, 654.0, 1.529051987767584, 0.27624474388379205, 1.0542096712538225], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 559.1578947368422, 262, 1568, 522.0, 1306.0, 1568.0, 1568.0, 0.10246233161124713, 13.045299093949868, 0.22768061176752916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 133.625, 130, 145, 132.5, 145.0, 145.0, 145.0, 0.047573739295908656, 0.03535509336346337, 0.02387978710751665], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 131.125, 129, 133, 131.5, 133.0, 133.0, 133.0, 0.04757430511780587, 0.0127298433616004, 0.027132220887498663], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 130.75, 129, 132, 131.0, 132.0, 132.0, 132.0, 0.04757430511780587, 0.012822761926283616, 0.027968487969647595], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 130.875, 128, 134, 130.5, 134.0, 134.0, 134.0, 0.04757345639000719, 0.012822533167619127, 0.028014447464037442], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 136.33333333333334, 134, 138, 137.0, 138.0, 138.0, 138.0, 0.10888501742160278, 0.03211257349738676, 0.06730880471472125], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1470.6964285714282, 1028, 2246, 1420.5, 1944.9, 2066.9, 2246.0, 0.24473064333567865, 292.7829315671938, 0.4832474226804124], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0ce61b54-0a59-4dac-bf8f-e9626265fc3f", 1, 0, 0.0, 623.0, 623, 623, 623.0, 623.0, 623.0, 623.0, 1.6051364365971108, 0.2899904695024077, 1.1066663322632424], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 6, 24.0, 1316.3600000000001, 229, 2155, 1315.0, 2135.8, 2150.5, 2155.0, 0.0980153844947503, 0.030951420634982865, 0.044221784801342416], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 4, 0, 0.0, 197.0, 130, 392, 133.0, 392.0, 392.0, 392.0, 0.03134378648612646, 0.008448129951338772, 0.018457327393685795], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 4, 0, 0.0, 228.5, 130, 521, 131.5, 521.0, 521.0, 521.0, 0.03131213501792619, 0.00843959889155042, 0.01840811062577302], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 363.29411764705884, 128, 1550, 132.0, 1366.7999999999997, 1550.0, 1550.0, 0.07867747787774446, 12.510546072316172, 0.04506057298030286], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 289.2941176470589, 129, 1037, 132.0, 1027.4, 1037.0, 1037.0, 0.07896362563809577, 4.114808684489222, 0.04530156992461296], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 132.41176470588235, 129, 136, 132.0, 134.4, 136.0, 136.0, 0.07919611286843663, 0.05885570497351589, 0.039752736342164474], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 4, 0, 0.0, 131.0, 129, 132, 131.5, 132.0, 132.0, 132.0, 0.031408514848375396, 0.008404231512162947, 0.01791266862446409], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 161.1764705882353, 128, 390, 131.0, 389.2, 390.0, 390.0, 0.07910214413341274, 0.04213207033576533, 0.04394058672852144], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3a8e4835-f7b1-4374-b165-278d3559d8c0", 3, 0, 0.0, 438.33333333333337, 229, 825, 261.0, 825.0, 825.0, 825.0, 0.02173991811297511, 0.021803609279321713, 0.013941288633646146], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 4, 0, 0.0, 198.0, 133, 393, 133.0, 393.0, 393.0, 393.0, 0.031407528384553775, 0.023340946387349047, 0.01576510702115297], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 4, 0, 0.0, 264.75, 138, 394, 263.5, 394.0, 394.0, 394.0, 0.03112065477857654, 0.02449535913235614, 0.011062420253322129], "isController": false}, {"data": ["deleteAccount", 16, 3, 18.75, 521.375, 131, 940, 495.5, 909.9, 940.0, 940.0, 0.09338812103100486, 0.01839376626996171, 0.06354883797452839], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1636.5714285714282, 952, 2230, 1602.0, 2163.0, 2224.7999999999997, 2230.0, 0.09633469425202991, 0.049860730423413914, 0.04431019628193954], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 4, 0, 0.0, 428.25, 265, 915, 266.5, 915.0, 915.0, 915.0, 0.03127932436659368, 0.04847684352517986, 0.07034793360963404], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a367f1dd-b13d-4055-946d-93587c4479c4", 3, 0, 0.0, 362.0, 253, 461, 372.0, 461.0, 461.0, 461.0, 0.0403985995152168, 0.033678650181793696, 0.025906653985995152], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c7d27bad-8955-4963-b428-95cecdd1932a", 1, 0, 0.0, 432.0, 432, 432, 432.0, 432.0, 432.0, 432.0, 2.314814814814815, 0.7392035590277778, 1.3812029803240742], "isController": false}, {"data": ["addBook", 57, 11, 19.29824561403509, 1290.280701754386, 666, 2791, 1057.0, 2144.8, 2433.8999999999996, 2791.0, 0.26622948982022504, 90.4734998756428, 0.9653373291110271], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/c6d484e6-dedc-4419-a04b-a4502846260a", 3, 0, 0.0, 310.3333333333333, 234, 444, 253.0, 444.0, 444.0, 444.0, 0.03105268605734396, 0.031143660723527585, 0.019913343597971225], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=016d83e7-bce5-419e-a3a8-9a6d79f28cb9", 1, 0, 0.0, 452.0, 452, 452, 452.0, 452.0, 452.0, 452.0, 2.2123893805309733, 0.3996992533185841, 1.5253387721238938], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 237.32142857142856, 130, 529, 134.0, 525.0, 528.15, 529.0, 0.2461235540241201, 0.18291018028550332, 0.1189757414472065], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 858.1785714285716, 637, 1195, 783.5, 1084.7000000000003, 1172.75, 1195.0, 0.2460175902577034, 72.33734008856634, 0.12372954978780983], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a84cc67d-c0fb-479e-a1bd-ecc664efb53f", 1, 0, 0.0, 653.0, 653, 653, 653.0, 653.0, 653.0, 653.0, 1.5313935681470139, 0.2766677833078101, 1.055824081163859], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fec2dce0-7114-4605-a620-4a6e802a3d89", 1, 0, 0.0, 465.0, 465, 465, 465.0, 465.0, 465.0, 465.0, 2.150537634408602, 0.3885248655913978, 1.4826948924731183], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 178.125, 129, 524, 133.0, 398.3, 405.3, 524.0, 0.2465830632661688, 0.4363364361702127, 0.11992027881499225], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1228.857142857143, 895, 1684, 1194.0, 1538.3, 1553.9, 1684.0, 0.24533319314293728, 220.7512384397685, 0.12314576296432593], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 143.73684210526318, 131, 186, 136.0, 176.0, 186.0, 186.0, 0.1052345900558851, 0.07861763807885948, 0.03740760818392791], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 11, 6.470588235294118, 196.65882352941165, 130, 880, 138.0, 358.9000000000001, 442.84999999999985, 696.8199999999979, 0.7114637739386634, 1.593559513421555, 0.3399928762073959], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 135.375, 132, 140, 134.5, 140.0, 140.0, 140.0, 0.04516737334786217, 0.03497824908677217, 0.01605558974474788], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 138.5, 131, 162, 136.5, 153.9, 162.0, 162.0, 0.1002679382126683, 0.08136978188938218, 0.03564211866153443], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 266.5, 263, 278, 265.0, 278.0, 278.0, 278.0, 0.04753557740871684, 0.07367086069104846, 0.10690862770729968], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 497.0, 260, 1682, 267.0, 1498.7999999999997, 1682.0, 1682.0, 0.07862835153348412, 16.700385437913667, 0.17328680529538823], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=269b9900-052c-402f-925c-863875486273", 1, 0, 0.0, 452.0, 452, 452, 452.0, 452.0, 452.0, 452.0, 2.2123893805309733, 0.3996992533185841, 1.5253387721238938], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 10, 0, 0.0, 161.8, 132, 395, 135.5, 369.80000000000007, 395.0, 395.0, 0.047432254881964835, 0.0393261566355353, 0.016860684352573437], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 150.89473684210526, 130, 388, 135.0, 170.0, 388.0, 388.0, 0.09121459433509362, 0.07081601806289006, 0.032423937830052804], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/31fbbba5-d005-4715-b34b-90448878e181", 1, 0, 0.0, 241.0, 241, 241, 241.0, 241.0, 241.0, 241.0, 4.149377593360996, 1.3250453838174274, 2.4758493257261414], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 159.94736842105263, 129, 394, 133.0, 393.0, 394.0, 394.0, 0.10267883681090341, 0.07630722149716553, 0.051539963008598], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4b0fe92a-5419-49ce-9a64-2158efe3fd8b", 3, 0, 0.0, 315.0, 230, 483, 232.0, 483.0, 483.0, 483.0, 0.0381927204674789, 0.03183969958242625, 0.02449207660186635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 213.10526315789474, 128, 397, 131.0, 391.0, 397.0, 397.0, 0.1026749527154823, 0.04370651513104566, 0.057649115104025934], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 350.0526315789474, 129, 1434, 135.0, 1171.0, 1434.0, 1434.0, 0.1025364274150027, 9.736565282649757, 0.05935265447922288], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 315.5263157894737, 128, 1057, 134.0, 1031.0, 1057.0, 1057.0, 0.10267883681090341, 3.2027606421210204, 0.05953535968666742], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 20.689655172413794, 0.4608294930875576], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 10.344827586206897, 0.2304147465437788], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 10.344827586206897, 0.2304147465437788], "isController": false}, {"data": ["401/Unauthorized", 17, 58.62068965517241, 1.30568356374808], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1302, 29, "401/Unauthorized", 17, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
