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

    var data = {"OkPercent": 97.52198241406875, "KoPercent": 2.478017585931255};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7608098833218943, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/945024db-e679-4306-bc30-5b656a2921ce"], "isController": false}, {"data": [0.09433962264150944, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f13ba1dc-2ef0-4d27-aa33-fb542687edab"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/99975111-3946-4d25-a9de-254d82d6a657"], "isController": false}, {"data": [0.37735849056603776, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/501e1cb4-5779-4f16-a096-1ac8aa3a385c"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=945024db-e679-4306-bc30-5b656a2921ce"], "isController": false}, {"data": [0.2826086956521739, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.46153846153846156, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cd3304cc-1426-447b-8a8c-6ddaab3fecd1"], "isController": false}, {"data": [0.23809523809523808, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f96547e3-ccd0-4910-a2c1-639868c66104"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cd3304cc-1426-447b-8a8c-6ddaab3fecd1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e8c83a5e-89b7-4bb1-be1d-4a43173a3893"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/87df6ad4-b2e5-4fa8-a6ee-df5367ad4515"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/71ee61ac-4d77-4bd2-8dda-c51ae7f709a3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9bac1775-b9e0-44df-88ba-7d448978e2c1"], "isController": false}, {"data": [0.2767857142857143, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9622641509433962, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.4811320754716981, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=25710280-43ae-4776-9fc3-a73fd625f140"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9181818181818182, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ce6dbcd2-94df-4a38-9724-2e65b1e476d8"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/ce6dbcd2-94df-4a38-9724-2e65b1e476d8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6904761904761905, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f96547e3-ccd0-4910-a2c1-639868c66104"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=71ee61ac-4d77-4bd2-8dda-c51ae7f709a3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/25710280-43ae-4776-9fc3-a73fd625f140"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/08751d5a-e768-4a77-8f5e-6f342107e273"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e8c83a5e-89b7-4bb1-be1d-4a43173a3893"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=501e1cb4-5779-4f16-a096-1ac8aa3a385c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d29d534b-5ec8-459b-ab26-080a879c63f4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d29d534b-5ec8-459b-ab26-080a879c63f4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f13ba1dc-2ef0-4d27-aa33-fb542687edab"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.23076923076923078, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.2826086956521739, 500, 1500, "register"], "isController": true}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1251, 31, 2.478017585931255, 394.5955235811354, 101, 5393, 114.0, 1132.6, 1367.3999999999999, 2015.3600000000001, 5.130497547531948, 719.6729956622996, 3.7549852603286635], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/945024db-e679-4306-bc30-5b656a2921ce", 3, 0, 0.0, 361.3333333333333, 238, 501, 345.0, 501.0, 501.0, 501.0, 0.053351354235208336, 0.024140098433248564, 0.03421294526151055], "isController": false}, {"data": ["see books", 53, 0, 0.0, 1895.1698113207542, 1340, 4350, 1793.0, 2368.6, 2834.7999999999965, 4350.0, 0.24403832783095972, 293.66059362323244, 1.1999345513953927], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 109.38461538461539, 106, 112, 109.0, 112.0, 112.0, 112.0, 0.06625149065853982, 0.05143548347025308, 0.023550334570027826], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 345.05263157894746, 212, 1566, 220.0, 441.0, 1566.0, 1566.0, 0.09064453031821001, 5.84058079588283, 0.20264102827870806], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 402.44444444444446, 211, 1480, 217.5, 1282.0000000000002, 1480.0, 1480.0, 0.09886416064327615, 13.277963109936946, 0.21953722304303885], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f13ba1dc-2ef0-4d27-aa33-fb542687edab", 3, 0, 0.0, 344.0, 208, 493, 331.0, 493.0, 493.0, 493.0, 0.03638304065198408, 0.0364896315913942, 0.023331572293101774], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 133.125, 106, 309, 108.0, 309.0, 309.0, 309.0, 0.04695248994923262, 0.03489340317516213, 0.023567949056548406], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 133.75, 104, 322, 108.0, 322.0, 322.0, 322.0, 0.04695331666490592, 0.012563680435726778, 0.026778063410454155], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 106.0, 103, 109, 107.0, 109.0, 109.0, 109.0, 0.04695304108978009, 0.012655311856229787, 0.027603252671921492], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 133.5, 105, 322, 106.5, 322.0, 322.0, 322.0, 0.04695331666490592, 0.012655386132337923, 0.027649267528260028], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 176.66666666666666, 107, 310, 113.0, 310.0, 310.0, 310.0, 0.037959787931318094, 0.0111951718313067, 0.02346537671926206], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/99975111-3946-4d25-a9de-254d82d6a657", 2, 0, 0.0, 511.0, 474, 548, 511.0, 548.0, 548.0, 548.0, 0.0190666857333524, 0.0271476833976834, 0.011851509247342582], "isController": false}, {"data": ["https://demoqa.com/books", 53, 0, 0.0, 1363.0566037735848, 825, 3913, 1261.0, 1831.6000000000001, 2399.3999999999965, 3913.0, 0.24879358581970445, 297.64362328543666, 0.4912701469994555], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/501e1cb4-5779-4f16-a096-1ac8aa3a385c", 3, 0, 0.0, 414.6666666666667, 293, 489, 462.0, 489.0, 489.0, 489.0, 0.03846005922849121, 0.032062568907606115, 0.024663514544312398], "isController": false}, {"data": ["deleteBook", 13, 3, 23.076923076923077, 542.2307692307692, 108, 1484, 532.0, 1194.7999999999997, 1484.0, 1484.0, 0.07568215822228433, 0.015668571819457303, 0.050604483949560755], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 3, 23.076923076923077, 542.2307692307692, 108, 1484, 532.0, 1194.7999999999997, 1484.0, 1484.0, 0.07556382236689142, 0.01564407259939549, 0.050525359291443854], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=945024db-e679-4306-bc30-5b656a2921ce", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 0.7314334514170041, 2.791308198380567], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, 30.434782608695652, 938.6086956521739, 302, 2900, 794.0, 1699.0000000000005, 2685.799999999997, 2900.0, 0.09432569431913253, 0.029572899407798683, 0.04255710036663987], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 157.1764705882353, 102, 330, 107.0, 328.4, 330.0, 330.0, 0.11984490659146986, 0.04265619492421572, 0.0677569836094466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 106.5, 103, 111, 106.5, 111.0, 111.0, 111.0, 0.040029354860230834, 0.010789162052171593, 0.02357197361398359], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 120.70588235294117, 102, 338, 108.0, 156.39999999999984, 338.0, 338.0, 0.11984068238694441, 0.08906128837545381, 0.06015440502625921], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 106.83333333333334, 103, 111, 107.0, 111.0, 111.0, 111.0, 0.04003095727362494, 0.010789593952656723, 0.023533824490939662], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 180.41176470588235, 104, 928, 107.0, 443.1999999999996, 928.0, 928.0, 0.11984237203302009, 2.103203338138777, 0.06996541974790804], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 222.0, 102, 993, 107.0, 544.9999999999995, 993.0, 993.0, 0.11984321687392493, 6.3736447692841836, 0.06984887858472211], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 204.3076923076923, 104, 326, 110.0, 324.0, 326.0, 326.0, 0.06496849028221312, 0.017511038396377757, 0.0381943663573167], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 123.6923076923077, 101, 327, 108.0, 240.5999999999999, 327.0, 327.0, 0.06496849028221312, 0.017511038396377757, 0.03825781214860793], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 124.38461538461539, 104, 318, 108.0, 235.19999999999993, 318.0, 318.0, 0.06496816559885656, 0.048282005879618985, 0.03261097374786354], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 107.5, 102, 110, 108.5, 110.0, 110.0, 110.0, 0.04002962192022096, 0.010711051177871625, 0.022829393751376017], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 122.3076923076923, 103, 307, 107.0, 228.59999999999994, 307.0, 307.0, 0.06496816559885656, 0.017384059935631538, 0.03705215694309788], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 107.5, 105, 110, 107.0, 110.0, 110.0, 110.0, 0.04003015605089167, 0.02974897339328961, 0.020093261923982735], "isController": false}, {"data": ["deleteAccount", 13, 3, 23.076923076923077, 842.0769230769232, 103, 5393, 501.0, 3577.7999999999984, 5393.0, 5393.0, 0.07353232311234041, 0.014759492740097175, 0.05003423848794918], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 109.66666666666667, 108, 111, 110.0, 111.0, 111.0, 111.0, 0.03669657437478211, 0.02888421772077577, 0.013044485422285831], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cd3304cc-1426-447b-8a8c-6ddaab3fecd1", 3, 0, 0.0, 368.0, 206, 675, 223.0, 675.0, 675.0, 675.0, 0.01839215758400618, 0.02535507401310748, 0.011794450013181046], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1656.0952380952383, 903, 4334, 1501.0, 3299.000000000001, 4257.699999999999, 4334.0, 0.09788156330839684, 0.05066135600922884, 0.04502169562329581], "isController": false}, {"data": ["goToProfile", 14, 3, 21.428571428571427, 246.99999999999997, 105, 474, 215.5, 468.0, 474.0, 474.0, 0.07401494044440685, 0.13957825857383782, 0.047834013896305067], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 217.0, 214, 221, 217.0, 221.0, 221.0, 221.0, 0.04000053334044454, 0.06199301407352099, 0.08996213699515994], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f96547e3-ccd0-4910-a2c1-639868c66104", 3, 0, 0.0, 316.3333333333333, 217, 437, 295.0, 437.0, 437.0, 437.0, 0.020799966720053246, 0.024584856497562937, 0.013338520325034147], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cd3304cc-1426-447b-8a8c-6ddaab3fecd1", 1, 0, 0.0, 555.0, 555, 555, 555.0, 555.0, 555.0, 555.0, 1.8018018018018018, 0.3255208333333333, 1.2422578828828827], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e8c83a5e-89b7-4bb1-be1d-4a43173a3893", 3, 0, 0.0, 430.66666666666663, 210, 855, 227.0, 855.0, 855.0, 855.0, 0.03745365110675539, 0.0240790888463027, 0.024018129127704464], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/87df6ad4-b2e5-4fa8-a6ee-df5367ad4515", 1, 0, 0.0, 232.0, 232, 232, 232.0, 232.0, 232.0, 232.0, 4.310344827586206, 1.3764480064655171, 2.571895204741379], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 118.89473684210526, 105, 318, 108.0, 111.0, 318.0, 318.0, 0.09069169120911118, 0.06739880567395859, 0.04552297781394838], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/71ee61ac-4d77-4bd2-8dda-c51ae7f709a3", 3, 0, 0.0, 323.3333333333333, 223, 511, 236.0, 511.0, 511.0, 511.0, 0.017608423869979396, 0.02427463381815194, 0.011291860359329237], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 142.5789473684211, 103, 333, 108.0, 327.0, 333.0, 333.0, 0.09069775212781701, 0.03143840667917341, 0.05132515681163986], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 744.8571428571428, 510, 944, 820.0, 944.0, 944.0, 944.0, 0.045483489493313926, 13.373656105021379, 0.0259398026016556], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1146.7142857142858, 954, 1368, 1164.0, 1368.0, 1368.0, 1368.0, 0.04535882067066257, 40.813946571764134, 0.02582440669042605], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9bac1775-b9e0-44df-88ba-7d448978e2c1", 1, 0, 0.0, 333.0, 333, 333, 333.0, 333.0, 333.0, 333.0, 3.003003003003003, 0.9589667792792792, 1.7918308933933933], "isController": false}, {"data": ["addBook", 56, 12, 21.428571428571427, 1117.8928571428564, 525, 5851, 870.0, 1961.9000000000003, 2192.0, 5851.0, 0.2915558147162798, 82.15018772973036, 1.0607437504230162], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 226.2857142857143, 103, 322, 310.0, 322.0, 322.0, 322.0, 0.04573220527226995, 0.08092456636069643, 0.025322422255251036], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 136.7142857142857, 102, 318, 108.0, 313.0, 318.0, 318.0, 0.06755615605472048, 0.050205307380510045, 0.03391002364465462], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 152.28571428571428, 102, 325, 107.0, 324.0, 325.0, 325.0, 0.06748646655322513, 0.018057902183187192, 0.038488375456136203], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 154.0, 105, 331, 107.0, 330.5, 331.0, 331.0, 0.0675574600325241, 0.01820884664939126, 0.03971639740193311], "isController": false}, {"data": ["https://demoqa.com/books-0", 53, 0, 0.0, 269.37735849056605, 105, 2436, 109.0, 429.4, 946.7999999999952, 2436.0, 0.24972200757647148, 0.18558442164618633, 0.12071522827182948], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 165.50000000000003, 103, 327, 106.5, 322.0, 327.0, 327.0, 0.06755680803732995, 0.018208670916311592, 0.03978198754541989], "isController": false}, {"data": ["https://demoqa.com/books-3", 53, 0, 0.0, 688.2830188679246, 504, 1051, 637.0, 873.6, 944.1999999999999, 1051.0, 0.24964672633066415, 73.40442659267545, 0.12555475005887895], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 136.0, 103, 321, 105.0, 321.0, 321.0, 321.0, 0.04573130896072334, 0.033985865350693804, 0.025679201808999918], "isController": false}, {"data": ["https://demoqa.com/books-1", 53, 0, 0.0, 178.79245283018867, 103, 454, 109.0, 321.6, 428.5, 454.0, 0.24990098262952415, 0.44220759816865013, 0.12153387631787405], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 189.0526315789474, 104, 1247, 107.0, 314.0, 1247.0, 1247.0, 0.09069645329132656, 4.318360400556112, 0.05290937216573583], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 861.4285714285714, 105, 1589, 1106.5, 1577.0, 1589.0, 1589.0, 0.10257762928444777, 59.34528711890579, 0.05463747050893158], "isController": false}, {"data": ["https://demoqa.com/books-2", 53, 0, 0.0, 1090.1698113207551, 718, 1907, 1131.0, 1406.6000000000001, 1505.2999999999997, 1907.0, 0.24934253548426555, 224.35885172616779, 0.12515826488175047], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 158.6315789473684, 105, 851, 109.0, 321.0, 851.0, 851.0, 0.09069688623269001, 1.4267325044513077, 0.05299819590766102], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 135.33333333333331, 106, 336, 111.0, 322.5, 336.0, 336.0, 0.10167538438943931, 0.07595866118937605, 0.03614242179468351], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 546.3571428571429, 104, 947, 670.0, 938.5, 947.0, 947.0, 0.10258063570685386, 19.399804249586012, 0.05473924826711997], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=25710280-43ae-4776-9fc3-a73fd625f140", 1, 0, 0.0, 455.0, 455, 455, 455.0, 455.0, 455.0, 455.0, 2.197802197802198, 0.39706387362637363, 1.5152815934065933], "isController": false}, {"data": ["deleteBooks", 13, 3, 23.076923076923077, 451.7692307692308, 107, 1186, 466.0, 933.5999999999998, 1186.0, 1186.0, 0.07601850173380659, 0.015738205437077147, 0.0511605887194391], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 165, 12, 7.2727272727272725, 188.43030303030298, 103, 4529, 111.0, 303.0, 343.8999999999998, 2271.8000000000116, 0.7204831166789658, 1.5802954553889954, 0.345495875234157], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 110.125, 108, 113, 110.0, 113.0, 113.0, 113.0, 0.04749775869951137, 0.03678293227413331, 0.016883968912716932], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 352.7142857142857, 209, 639, 319.0, 637.0, 639.0, 639.0, 0.06745102573738425, 0.10453591586448126, 0.1516989377667929], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ce6dbcd2-94df-4a38-9724-2e65b1e476d8", 1, 0, 0.0, 497.0, 497, 497, 497.0, 497.0, 497.0, 497.0, 2.012072434607646, 0.3635091800804829, 1.3872296277665996], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ce6dbcd2-94df-4a38-9724-2e65b1e476d8", 3, 0, 0.0, 757.6666666666666, 214, 1536, 523.0, 1536.0, 1536.0, 1536.0, 0.07519173893428242, 0.03402230374956138, 0.04821866070981001], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 124.94117647058822, 105, 326, 110.0, 173.99999999999986, 326.0, 326.0, 0.12292829664767305, 0.09975919386153935, 0.043697167948977524], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 717.2857142857143, 181, 1958, 557.0, 1577.8000000000002, 1928.1999999999996, 1958.0, 0.10097270371242974, 0.06202327210460772, 0.045654650213725556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 121.5, 104, 319, 106.5, 213.5, 319.0, 319.0, 0.10257838087352819, 0.0762325662546435, 0.051489538836907704], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 220.85714285714286, 105, 426, 211.0, 376.0, 426.0, 426.0, 0.10257988408473098, 0.126493247129595, 0.05296430677979762], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f96547e3-ccd0-4910-a2c1-639868c66104", 1, 0, 0.0, 489.0, 489, 489, 489.0, 489.0, 489.0, 489.0, 2.044989775051125, 0.36945616053169733, 1.409924591002045], "isController": false}, {"data": ["login", 21, 0, 0.0, 3050.8095238095243, 1520, 5670, 3053.0, 4913.4, 5594.499999999999, 5670.0, 0.09918385853547948, 39.68616740139471, 0.20446984899257536], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=71ee61ac-4d77-4bd2-8dda-c51ae7f709a3", 1, 0, 0.0, 454.0, 454, 454, 454.0, 454.0, 454.0, 454.0, 2.2026431718061676, 0.39793846365638763, 1.518619218061674], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 268.75, 213, 632, 216.5, 632.0, 632.0, 632.0, 0.046922747561483465, 0.07272109412116627, 0.10553035901767228], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/25710280-43ae-4776-9fc3-a73fd625f140", 3, 0, 0.0, 440.66666666666663, 245, 753, 324.0, 753.0, 753.0, 753.0, 0.018414623666474336, 0.02538604532145795, 0.011808856973617983], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 121.3157894736842, 106, 319, 111.0, 116.0, 319.0, 319.0, 0.09362972891729539, 0.07579984889886511, 0.03328244270106984], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/08751d5a-e768-4a77-8f5e-6f342107e273", 1, 0, 0.0, 222.0, 222, 222, 222.0, 222.0, 222.0, 222.0, 4.504504504504505, 1.4384501689189189, 2.68774634009009], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 330.8461538461539, 214, 646, 221.0, 561.5999999999999, 646.0, 646.0, 0.06493214590752663, 0.10063214409691872, 0.1460339179931971], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e8c83a5e-89b7-4bb1-be1d-4a43173a3893", 1, 0, 0.0, 1186.0, 1186, 1186, 1186.0, 1186.0, 1186.0, 1186.0, 0.8431703204047217, 0.15233057546374368, 0.5813264123102867], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=501e1cb4-5779-4f16-a096-1ac8aa3a385c", 1, 0, 0.0, 473.0, 473, 473, 473.0, 473.0, 473.0, 473.0, 2.1141649048625792, 0.3819536205073996, 1.457617600422833], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d29d534b-5ec8-459b-ab26-080a879c63f4", 1, 0, 0.0, 521.0, 521, 521, 521.0, 521.0, 521.0, 521.0, 1.9193857965451055, 0.3467640355086372, 1.3233265355086372], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 111.57142857142857, 108, 124, 110.0, 120.0, 124.0, 124.0, 0.06604801690829233, 0.054760514018691586, 0.023478006010369538], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 985.2857142857144, 213, 1696, 1215.0, 1684.5, 1696.0, 1696.0, 0.10249727284041907, 78.88540021295638, 0.21365991221840705], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 124.42857142857142, 107, 312, 110.0, 213.0, 312.0, 312.0, 0.10418449585866629, 0.08088542403089814, 0.03703433251226028], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d29d534b-5ec8-459b-ab26-080a879c63f4", 3, 0, 0.0, 1974.6666666666667, 206, 5393, 325.0, 5393.0, 5393.0, 5393.0, 0.03765958248076223, 0.0246528061096396, 0.024150187984082548], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f13ba1dc-2ef0-4d27-aa33-fb542687edab", 1, 0, 0.0, 466.0, 466, 466, 466.0, 466.0, 466.0, 466.0, 2.1459227467811157, 0.3876911212446352, 1.4795131437768239], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 370.4705882352941, 207, 1102, 218.0, 753.9999999999997, 1102.0, 1102.0, 0.1197503557289979, 8.601911294923994, 0.26751904779095814], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 6, 46.15384615384615, 740.6153846153846, 103, 1690, 1059.0, 1524.3999999999999, 1690.0, 1690.0, 0.0841767193094919, 54.23596069918478, 0.1279470957413055], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 130.05555555555554, 102, 319, 107.0, 317.2, 319.0, 319.0, 0.0994953375379326, 0.07394135924449874, 0.049941995600095074], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 164.5, 102, 324, 106.5, 321.3, 324.0, 324.0, 0.09949478757862851, 0.04322668505477741, 0.05581467575754226], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 258.0, 102, 1161, 106.0, 1154.7, 1161.0, 1161.0, 0.09892066562616782, 9.91358738885164, 0.05720997697346728], "isController": false}, {"data": ["register", 23, 7, 30.434782608695652, 938.6086956521739, 302, 2900, 794.0, 1699.0000000000005, 2685.799999999997, 2900.0, 0.09067970351679545, 0.0284298119381801, 0.040912131860116704], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 201.38888888888886, 103, 865, 106.0, 853.3000000000001, 865.0, 865.0, 0.09907802394385579, 3.2606517476262553, 0.057397739782578776], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 22.580645161290324, 0.5595523581135092], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 9.67741935483871, 0.23980815347721823], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 9.67741935483871, 0.23980815347721823], "isController": false}, {"data": ["401/Unauthorized", 18, 58.064516129032256, 1.4388489208633093], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1251, 31, "401/Unauthorized", 18, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 165, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
