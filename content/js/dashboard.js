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

    var data = {"OkPercent": 97.48892171344166, "KoPercent": 2.511078286558346};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7949936628643853, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3474576271186441, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d456fda8-4386-43cd-b0e6-2e01fcdd2eae"], "isController": false}, {"data": [0.7, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8a83448b-5a71-4ba8-9d69-1b479cbbc6a6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b6f00eaa-3904-42d7-97da-b35063428ef2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9f2dadec-346d-4c22-9c37-908d33cccadc"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/60665b1a-1722-4e38-954d-0587d837bc10"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/9670183a-a122-4395-be92-e0c7b0ff22a4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5909090909090909, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a77114fe-6110-4841-81d2-a3f9cc878343"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7745d8ec-79dc-41e1-ab20-bdc4999c370d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/79d2e98d-a418-441f-a78d-4e0e2f493246"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cf29e1b5-212b-42a3-beac-f18ca52ccac1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/329bdbda-b5cb-41cf-9b87-2f4573512e98"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/631f0fb3-d569-4e3c-8bae-c714959067df"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/e354ffd6-7322-4f23-8abe-d0d0948d8611"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9670183a-a122-4395-be92-e0c7b0ff22a4"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4830508474576271, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d456fda8-4386-43cd-b0e6-2e01fcdd2eae"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5333333333333333, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=60665b1a-1722-4e38-954d-0587d837bc10"], "isController": false}, {"data": [0.22727272727272727, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a29040c4-7aaf-4bca-bac5-1827bc63d276"], "isController": false}, {"data": [0.288135593220339, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b63014d5-0225-4436-b355-5f33f2821578"], "isController": false}, {"data": [0.9915254237288136, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8050847457627118, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/9f2dadec-346d-4c22-9c37-908d33cccadc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8870056497175142, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=79d2e98d-a418-441f-a78d-4e0e2f493246"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a29040c4-7aaf-4bca-bac5-1827bc63d276"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/7745d8ec-79dc-41e1-ab20-bdc4999c370d"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a77114fe-6110-4841-81d2-a3f9cc878343"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d09a8b94-0138-44e5-879e-20090a94fffb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b6f00eaa-3904-42d7-97da-b35063428ef2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cf29e1b5-212b-42a3-beac-f18ca52ccac1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=329bdbda-b5cb-41cf-9b87-2f4573512e98"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e354ffd6-7322-4f23-8abe-d0d0948d8611"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=631f0fb3-d569-4e3c-8bae-c714959067df"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1354, 34, 2.511078286558346, 323.8279172821271, 77, 7567, 95.0, 894.0, 1114.0, 1893.3500000000001, 5.337643394961958, 758.0521614573067, 3.9026697456340917], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 59, 0, 0.0, 1368.6271186440677, 954, 2250, 1305.0, 1692.0, 1728.0, 2250.0, 0.25888547608600265, 311.52641132349714, 1.272937863372093], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d456fda8-4386-43cd-b0e6-2e01fcdd2eae", 1, 0, 0.0, 198.0, 198, 198, 198.0, 198.0, 198.0, 198.0, 5.050505050505051, 0.91244476010101, 3.4820864898989896], "isController": false}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 514.4, 88, 905, 479.0, 900.8, 905.0, 905.0, 0.07615643547265222, 0.014918926714662144, 0.05127668331107873], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 514.4, 88, 905, 479.0, 900.8, 905.0, 905.0, 0.07601017522879062, 0.014890274561421288, 0.05117820522240577], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 114.77777777777777, 78, 240, 80.0, 238.2, 240.0, 240.0, 0.09922439597148952, 0.026550277828308717, 0.056588913327490116], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 101.94444444444444, 78, 275, 82.0, 250.70000000000005, 275.0, 275.0, 0.09922111425311307, 0.07373756635412015, 0.04980434836533214], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 124.3333333333333, 79, 246, 81.0, 240.60000000000002, 246.0, 246.0, 0.09922330204124381, 0.026743780628304, 0.05842934680749026], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 141.3888888888889, 78, 242, 82.0, 240.2, 242.0, 242.0, 0.09922330204124381, 0.026743780628304, 0.05833244905159061], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8a83448b-5a71-4ba8-9d69-1b479cbbc6a6", 1, 0, 0.0, 324.0, 324, 324, 324.0, 324.0, 324.0, 324.0, 3.0864197530864197, 0.9856047453703703, 1.841603973765432], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b6f00eaa-3904-42d7-97da-b35063428ef2", 3, 0, 0.0, 361.3333333333333, 184, 471, 429.0, 471.0, 471.0, 471.0, 0.09191739689931981, 0.04320596390710215, 0.05894442444389975], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 306.93333333333334, 82, 1496, 216.0, 822.2000000000004, 1496.0, 1496.0, 0.07646312183633833, 0.1280458606688994, 0.04942225739525827], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9f2dadec-346d-4c22-9c37-908d33cccadc", 1, 0, 0.0, 225.0, 225, 225, 225.0, 225.0, 225.0, 225.0, 4.444444444444445, 0.8029513888888888, 3.064236111111111], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/60665b1a-1722-4e38-954d-0587d837bc10", 3, 0, 0.0, 912.3333333333334, 225, 2211, 301.0, 2211.0, 2211.0, 2211.0, 0.030637880675667393, 0.02554154049817194, 0.019647338844747644], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 83.78947368421052, 80, 115, 82.0, 85.0, 115.0, 115.0, 0.10607177151023872, 0.07882872863212077, 0.05324305718385029], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 89.8421052631579, 77, 237, 81.0, 93.0, 237.0, 237.0, 0.10607354804852585, 0.045153223938008386, 0.059557331357015644], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 480.6666666666667, 390, 620, 468.0, 620.0, 620.0, 620.0, 0.06157698662753107, 18.105678616878254, 0.035118125186013815], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 894.1666666666666, 695, 1014, 914.0, 1014.0, 1014.0, 1014.0, 0.06133150701734659, 55.18619782349815, 0.03491823104600886], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 164.5, 83, 249, 164.0, 249.0, 249.0, 249.0, 0.061713792003949684, 0.1092044835069891, 0.034171601627186986], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 94.15384615384616, 78, 247, 82.0, 181.79999999999995, 247.0, 247.0, 0.07398975526465566, 0.05498652710586227, 0.03713938887307911], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 116.84615384615384, 77, 240, 83.0, 239.6, 240.0, 240.0, 0.07399186089530152, 0.028347242380261248, 0.041720470844360966], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 179.76923076923077, 78, 895, 82.0, 633.7999999999997, 895.0, 895.0, 0.07399228203581226, 5.139823402122441, 0.04301023725909821], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 165.3076923076923, 79, 701, 82.0, 519.3999999999999, 701.0, 701.0, 0.07399059750253274, 1.691923517199968, 0.04308151451638607], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9670183a-a122-4395-be92-e0c7b0ff22a4", 3, 0, 0.0, 724.0, 199, 1515, 458.0, 1515.0, 1515.0, 1515.0, 0.025285302496502203, 0.025359380531159922, 0.016214858697301215], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 112.66666666666666, 80, 257, 85.5, 257.0, 257.0, 257.0, 0.061709348966368406, 0.045860170472076515, 0.034651245757482255], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 595.9411764705883, 79, 1161, 858.0, 1066.6, 1161.0, 1161.0, 0.09607830947388649, 50.864446486501, 0.05162663757001001], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 196.3684210526316, 78, 853, 81.0, 848.0, 853.0, 853.0, 0.10607295586248479, 10.072383888494992, 0.0613997547760744], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 408.64705882352933, 80, 710, 481.0, 706.8, 710.0, 710.0, 0.09607939549105049, 16.62862346484907, 0.051721048664213815], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 127.15789473684212, 79, 626, 81.0, 399.0, 626.0, 626.0, 0.1060741402411791, 3.3086670248995085, 0.061504028374832515], "isController": false}, {"data": ["deleteBooks", 15, 2, 13.333333333333334, 395.3999999999999, 85, 1069, 408.0, 833.8000000000002, 1069.0, 1069.0, 0.07632500203533339, 0.014951948640906132, 0.05189702612350403], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 300.69230769230774, 161, 974, 168.0, 778.7999999999998, 974.0, 974.0, 0.07395524001319817, 6.911659399142119, 0.1648715187704088], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 800.590909090909, 110, 2670, 677.0, 1799.8999999999999, 2553.2999999999984, 2670.0, 0.09695815814757032, 0.059557306127755595, 0.04383947970930181], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 83.58823529411765, 79, 98, 82.0, 92.39999999999999, 98.0, 98.0, 0.09607722348127341, 0.07140113971606354, 0.04822626256774857], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 109.23529411764706, 79, 246, 81.0, 244.4, 246.0, 246.0, 0.09607885247939957, 0.11059444197967651, 0.05004842798042253], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a77114fe-6110-4841-81d2-a3f9cc878343", 3, 0, 0.0, 423.33333333333337, 175, 870, 225.0, 870.0, 870.0, 870.0, 0.04860188575316722, 0.03181588289375628, 0.031167224913326637], "isController": false}, {"data": ["login", 22, 0, 0.0, 3288.5909090909095, 1936, 8397, 2924.0, 4821.199999999999, 7907.249999999993, 8397.0, 0.0979004797123506, 32.076183052203206, 0.1919854133847756], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7745d8ec-79dc-41e1-ab20-bdc4999c370d", 1, 0, 0.0, 1069.0, 1069, 1069, 1069.0, 1069.0, 1069.0, 1069.0, 0.9354536950420954, 0.16900286482694107, 0.6449514733395697], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 93.15789473684208, 80, 146, 85.0, 110.0, 146.0, 146.0, 0.10629311164692785, 0.08605174761260076, 0.037783879530743886], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 690.9411764705883, 165, 1244, 949.0, 1150.3999999999999, 1244.0, 1244.0, 0.09603271891223174, 67.64276503794704, 0.20152638181196794], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/79d2e98d-a418-441f-a78d-4e0e2f493246", 3, 0, 0.0, 383.0, 307, 425, 417.0, 425.0, 425.0, 425.0, 0.1788055787340565, 0.08090486798188104, 0.11466373375849327], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cf29e1b5-212b-42a3-beac-f18ca52ccac1", 3, 0, 0.0, 425.3333333333333, 300, 603, 373.0, 603.0, 603.0, 603.0, 0.031579612202362155, 0.026326623323648917, 0.020251248710499166], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/329bdbda-b5cb-41cf-9b87-2f4573512e98", 3, 0, 0.0, 1679.0, 216, 4351, 470.0, 4351.0, 4351.0, 4351.0, 0.06767578785896367, 0.03062153161587223, 0.04339886135486927], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 271.1111111111111, 161, 511, 317.0, 485.80000000000007, 511.0, 511.0, 0.09917628584809499, 0.15370387269621752, 0.2230497913165652], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, 40.0, 637.7000000000002, 82, 1096, 947.5, 1092.4, 1096.0, 1096.0, 0.07219174126479931, 51.82757904995668, 0.11680398137453074], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/631f0fb3-d569-4e3c-8bae-c714959067df", 3, 0, 0.0, 500.6666666666667, 298, 747, 457.0, 747.0, 747.0, 747.0, 0.026172072653673686, 0.026248748647776245, 0.016783523153560274], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e354ffd6-7322-4f23-8abe-d0d0948d8611", 3, 0, 0.0, 870.3333333333334, 551, 1496, 564.0, 1496.0, 1496.0, 1496.0, 0.01795514804019559, 0.024752621077548286, 0.011514206262755636], "isController": false}, {"data": ["register", 24, 8, 33.333333333333336, 1085.2499999999998, 119, 3596, 1170.5, 1798.5, 3193.5, 3596.0, 0.09681362167656989, 0.030254256773928092, 0.04367958321735868], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 282.05263157894734, 161, 936, 167.0, 931.0, 936.0, 936.0, 0.10602323582915751, 13.498666295701595, 0.2355932645251833], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 91.83333333333331, 81, 120, 86.0, 117.30000000000001, 120.0, 120.0, 0.09375830151628009, 0.07279086885297135, 0.033328146242115185], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9670183a-a122-4395-be92-e0c7b0ff22a4", 1, 0, 0.0, 418.0, 418, 418, 418.0, 418.0, 418.0, 418.0, 2.3923444976076556, 0.4322106758373206, 1.6494093899521531], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 312.0526315789474, 164, 932, 173.0, 827.0, 932.0, 932.0, 0.0951455727262712, 12.113743989241039, 0.21142210863871724], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 117.0, 79, 346, 83.0, 346.0, 346.0, 346.0, 0.061876880477070746, 0.04598467387016684, 0.031059293520717155], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 99.75, 79, 234, 80.0, 234.0, 234.0, 234.0, 0.06187879491046912, 0.01655741191940287, 0.03529025022237692], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 83.37499999999999, 79, 100, 81.5, 100.0, 100.0, 100.0, 0.061878316291013716, 0.01667813993781229, 0.03637768203827174], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 102.875, 78, 245, 80.0, 245.0, 245.0, 245.0, 0.06187927353732867, 0.01667839794560812, 0.03643867377246991], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 100.5, 85, 116, 100.5, 116.0, 116.0, 116.0, 0.15997440409534475, 0.04717995120780675, 0.09889042753159494], "isController": false}, {"data": ["https://demoqa.com/books", 59, 0, 0.0, 960.135593220339, 626, 1895, 932.0, 1281.0, 1371.0, 1895.0, 0.2598935757832047, 310.9230702626687, 0.513188291243789], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, 33.333333333333336, 1085.2499999999998, 119, 3596, 1170.5, 1798.5, 3193.5, 3596.0, 0.09675273628832315, 0.030235230090100984, 0.043652113442583296], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 83.5, 78, 99, 81.0, 99.0, 99.0, 99.0, 0.03480783176214648, 0.009381798404641045, 0.02049718999274837], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 84.0, 80, 91, 83.0, 91.0, 91.0, 91.0, 0.034808437565265825, 0.009381961687513053, 0.0204635541155176], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d456fda8-4386-43cd-b0e6-2e01fcdd2eae", 3, 0, 0.0, 325.3333333333333, 183, 436, 357.0, 436.0, 436.0, 436.0, 0.06596306068601583, 0.030576627088830258, 0.04230053045294635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 98.44444444444446, 79, 236, 81.5, 235.1, 236.0, 236.0, 0.08865204564595328, 0.023894496678010847, 0.05211770652232801], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 98.27777777777777, 79, 236, 81.0, 236.0, 236.0, 236.0, 0.08865248226950355, 0.023894614361702128, 0.05220453789893617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 94.27777777777777, 79, 238, 84.0, 118.30000000000018, 238.0, 238.0, 0.08864767964698524, 0.06587976973765212, 0.044496979822803144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 79.83333333333333, 79, 81, 80.0, 81.0, 81.0, 81.0, 0.03480823562854971, 0.00931392242404553, 0.01985157188190726], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 89.55555555555556, 78, 237, 81.0, 100.20000000000022, 237.0, 237.0, 0.08865248226950355, 0.023721464982269503, 0.050559618794326244], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 82.5, 80, 86, 81.5, 86.0, 86.0, 86.0, 0.034808033694176614, 0.025868079727801176, 0.01747200128789725], "isController": false}, {"data": ["deleteAccount", 15, 2, 13.333333333333334, 904.8, 83, 4351, 564.0, 3067.000000000001, 4351.0, 4351.0, 0.07655053100551674, 0.014717038936151753, 0.05209522790368922], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 85.83333333333333, 83, 89, 85.5, 89.0, 89.0, 89.0, 0.034670457303331834, 0.027289441978989703, 0.012324264119543737], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=60665b1a-1722-4e38-954d-0587d837bc10", 1, 0, 0.0, 394.0, 394, 394, 394.0, 394.0, 394.0, 394.0, 2.5380710659898473, 0.45853822969543145, 1.7498810279187818], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1832.909090909091, 943, 7567, 1553.5, 2291.5, 6783.999999999989, 7567.0, 0.09511991594858336, 0.04923198774682537, 0.043751445714631604], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 169.16666666666666, 165, 182, 167.0, 182.0, 182.0, 182.0, 0.03479107956719897, 0.05391937819643044, 0.07824595336255784], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a29040c4-7aaf-4bca-bac5-1827bc63d276", 1, 0, 0.0, 408.0, 408, 408, 408.0, 408.0, 408.0, 408.0, 2.450980392156863, 0.44280407475490197, 1.6898360906862746], "isController": false}, {"data": ["addBook", 59, 18, 30.508474576271187, 910.5084745762716, 414, 4470, 716.0, 1514.0, 1745.0, 4470.0, 0.28357204652504087, 87.38491150389311, 1.0292065690185523], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/b63014d5-0225-4436-b355-5f33f2821578", 1, 0, 0.0, 221.0, 221, 221, 221.0, 221.0, 221.0, 221.0, 4.524886877828055, 1.4449589932126696, 2.699908088235294], "isController": false}, {"data": ["https://demoqa.com/books-0", 59, 0, 0.0, 160.4406779661017, 79, 571, 85.0, 330.0, 340.0, 571.0, 0.2606041599491159, 0.1936716462121848, 0.12597564372540274], "isController": false}, {"data": ["https://demoqa.com/books-3", 59, 0, 0.0, 528.2881355932203, 387, 824, 483.0, 712.0, 736.0, 824.0, 0.26076887038461194, 76.67470623447542, 0.13114840649226092], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9f2dadec-346d-4c22-9c37-908d33cccadc", 3, 0, 0.0, 599.0, 288, 815, 694.0, 815.0, 815.0, 815.0, 0.08850601840925183, 0.040046668485957046, 0.05675678914916214], "isController": false}, {"data": ["https://demoqa.com/books-1", 59, 0, 0.0, 121.45762711864408, 78, 248, 85.0, 242.0, 246.0, 248.0, 0.26120873234074016, 0.46221701464982534, 0.12703315303289903], "isController": false}, {"data": ["https://demoqa.com/books-2", 59, 0, 0.0, 798.2372881355934, 542, 1288, 779.0, 1012.0, 1160.0, 1288.0, 0.2605903475568551, 234.47965280062851, 0.13080413930099952], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 98.05263157894738, 80, 325, 85.0, 94.0, 325.0, 325.0, 0.09573669385924691, 0.07152204179914441, 0.03403140289527917], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 18, 10.169491525423728, 151.83050847457633, 80, 3172, 89.0, 266.4000000000002, 358.59999999999997, 1122.9399999999969, 0.734567849998755, 1.6424632028714548, 0.34962573223341825], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 86.5, 82, 93, 86.0, 93.0, 93.0, 93.0, 0.06177940120315383, 0.04784283706455175, 0.02196064652143359], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 110.38888888888887, 82, 327, 87.0, 246.0000000000001, 327.0, 327.0, 0.09686376649374691, 0.0786072167542028, 0.03443204199582409], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=79d2e98d-a418-441f-a78d-4e0e2f493246", 1, 0, 0.0, 179.0, 179, 179, 179.0, 179.0, 179.0, 179.0, 5.58659217877095, 1.009296438547486, 3.85169343575419], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a29040c4-7aaf-4bca-bac5-1827bc63d276", 3, 0, 0.0, 316.0, 189, 424, 335.0, 424.0, 424.0, 424.0, 0.021806763004099672, 0.025774855621056608, 0.013984154660832146], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7745d8ec-79dc-41e1-ab20-bdc4999c370d", 3, 0, 0.0, 887.0, 180, 1408, 1073.0, 1408.0, 1408.0, 1408.0, 0.01996725370392556, 0.023600617903305244, 0.012804521418207473], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 222.12500000000003, 160, 591, 166.5, 591.0, 591.0, 591.0, 0.06183813867202597, 0.09583703718018087, 0.13907542320476154], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a77114fe-6110-4841-81d2-a3f9cc878343", 1, 0, 0.0, 677.0, 677, 677, 677.0, 677.0, 677.0, 677.0, 1.4771048744460857, 0.26685976735598227, 1.0183945716395864], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 203.2777777777778, 160, 474, 170.0, 333.60000000000025, 474.0, 474.0, 0.08861102222659809, 0.1373297776109484, 0.19928826580845252], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d09a8b94-0138-44e5-879e-20090a94fffb", 1, 0, 0.0, 446.0, 446, 446, 446.0, 446.0, 446.0, 446.0, 2.242152466367713, 0.7159998598654709, 1.3378468329596411], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b6f00eaa-3904-42d7-97da-b35063428ef2", 1, 0, 0.0, 237.0, 237, 237, 237.0, 237.0, 237.0, 237.0, 4.219409282700422, 0.7622956223628692, 2.9090849156118144], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cf29e1b5-212b-42a3-beac-f18ca52ccac1", 1, 0, 0.0, 415.0, 415, 415, 415.0, 415.0, 415.0, 415.0, 2.4096385542168677, 0.4353350903614458, 1.6613328313253013], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 98.07692307692308, 82, 239, 85.0, 181.79999999999995, 239.0, 239.0, 0.0766129982791542, 0.06351995658105655, 0.027233526732043094], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=329bdbda-b5cb-41cf-9b87-2f4573512e98", 1, 0, 0.0, 616.0, 616, 616, 616.0, 616.0, 616.0, 616.0, 1.6233766233766236, 0.2932858157467533, 1.1192420860389611], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 171.64705882352936, 83, 1147, 89.0, 431.7999999999994, 1147.0, 1147.0, 0.0957465981796882, 0.07433451714145715, 0.03403492357168604], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e354ffd6-7322-4f23-8abe-d0d0948d8611", 1, 0, 0.0, 429.0, 429, 429, 429.0, 429.0, 429.0, 429.0, 2.331002331002331, 0.4211283508158508, 1.6071168414918415], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=631f0fb3-d569-4e3c-8bae-c714959067df", 1, 0, 0.0, 465.0, 465, 465, 465.0, 465.0, 465.0, 465.0, 2.150537634408602, 0.3885248655913978, 1.4826948924731183], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 103.63157894736844, 79, 253, 84.0, 249.0, 253.0, 253.0, 0.09549610225119495, 0.07096927130191344, 0.04793456695030684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 131.89473684210526, 79, 247, 82.0, 246.0, 247.0, 247.0, 0.0954212849731565, 0.040618785061044514, 0.05357638348307779], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 181.73684210526315, 79, 850, 82.0, 733.0, 850.0, 850.0, 0.09518799629267805, 9.03877932353899, 0.055099055008642074], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 172.15789473684208, 79, 651, 82.0, 620.0, 651.0, 651.0, 0.09522807123059729, 2.970356190576431, 0.05521524833225576], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 23.529411764705884, 0.5908419497784343], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 5.882352941176471, 0.14771048744460857], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 5.882352941176471, 0.14771048744460857], "isController": false}, {"data": ["401/Unauthorized", 22, 64.70588235294117, 1.6248153618906942], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1354, 34, "401/Unauthorized", 22, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 18, "401/Unauthorized", 18, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
