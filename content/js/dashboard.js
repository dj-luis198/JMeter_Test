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

    var data = {"OkPercent": 97.12773998488284, "KoPercent": 2.872260015117158};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7577821011673151, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.11607142857142858, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2d8ccae5-ea18-4974-9477-b42c44fb66a6"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/9c526c94-9ccd-4e0b-b88f-d193081dc801"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/109831b6-46ee-4e27-ac76-d1d25e9080b2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=16ce03b2-df1f-4e17-9542-1a979308cd28"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3e4cb3de-2d01-4f05-9011-8d347cadf40a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.41964285714285715, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.46875, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.46875, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=109831b6-46ee-4e27-ac76-d1d25e9080b2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.275, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.75, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c10fa98f-5f6f-428f-9ac1-c48dfbef5cbb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.225, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/16ce03b2-df1f-4e17-9542-1a979308cd28"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3e4cb3de-2d01-4f05-9011-8d347cadf40a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.5333333333333333, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=12632811-8ed7-4928-8cf8-e07c9f1f3b54"], "isController": false}, {"data": [0.8465909090909091, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/12632811-8ed7-4928-8cf8-e07c9f1f3b54"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c10fa98f-5f6f-428f-9ac1-c48dfbef5cbb"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9b938785-9d94-4c8a-9ba5-9fbb12f8b3d8"], "isController": false}, {"data": [0.725, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4f541568-1472-46ac-aa05-e59591d9c00e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/4f541568-1472-46ac-aa05-e59591d9c00e"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6248a96c-5bdf-4131-98d4-403b4e8075ca"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6248a96c-5bdf-4131-98d4-403b4e8075ca"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f19d0a8b-6cb9-4d4e-8dcc-ce278fdcc2af"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/68a79043-a0f8-481b-aa32-ff0d545327ef"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c1fb9d4e-cc85-45ad-9c27-245bb9c2c246"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/9b938785-9d94-4c8a-9ba5-9fbb12f8b3d8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f19d0a8b-6cb9-4d4e-8dcc-ce278fdcc2af"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2d8ccae5-ea18-4974-9477-b42c44fb66a6"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c1fb9d4e-cc85-45ad-9c27-245bb9c2c246"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1323, 38, 2.872260015117158, 380.1345427059715, 94, 3803, 120.0, 1067.200000000001, 1282.9999999999993, 2037.4399999999991, 5.238131060177139, 723.3585393748193, 3.8411808894825614], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1744.3392857142858, 1188, 3672, 1728.0, 2088.5, 2206.45, 3672.0, 0.26038155196704316, 313.32689214711326, 1.2802940567910763], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 121.875, 102, 307, 106.5, 178.20000000000013, 307.0, 307.0, 0.08696455650793823, 0.06751642814825283, 0.03091318219618117], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 251.15789473684208, 200, 598, 209.0, 433.0, 598.0, 598.0, 0.11036629994075073, 0.17104620899020645, 0.24821639527690326], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2d8ccae5-ea18-4974-9477-b42c44fb66a6", 1, 0, 0.0, 560.0, 560, 560, 560.0, 560.0, 560.0, 560.0, 1.7857142857142856, 0.32261439732142855, 1.231166294642857], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9c526c94-9ccd-4e0b-b88f-d193081dc801", 1, 0, 0.0, 2060.0, 2060, 2060, 2060.0, 2060.0, 2060.0, 2060.0, 0.4854368932038835, 0.15501744538834952, 0.2896503337378641], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 13, 0, 0.0, 461.8461538461538, 202, 1147, 406.0, 1081.3999999999999, 1147.0, 1147.0, 0.12941504400111498, 35.883218010841, 0.2834162242912038], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/109831b6-46ee-4e27-ac76-d1d25e9080b2", 3, 0, 0.0, 733.3333333333334, 191, 1502, 507.0, 1502.0, 1502.0, 1502.0, 0.02736976553234194, 0.027289580672383906, 0.017551574901925007], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=16ce03b2-df1f-4e17-9542-1a979308cd28", 1, 0, 0.0, 722.0, 722, 722, 722.0, 722.0, 722.0, 722.0, 1.3850415512465375, 0.25022723337950137, 0.9549212257617729], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 133.91666666666666, 100, 301, 102.5, 295.90000000000003, 301.0, 301.0, 0.05900169138181961, 0.0438479366616843, 0.029616083369389923], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 151.58333333333334, 99, 307, 102.5, 305.8, 307.0, 307.0, 0.05900401227283455, 0.015788182971442057, 0.033650725749350956], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3e4cb3de-2d01-4f05-9011-8d347cadf40a", 1, 0, 0.0, 195.0, 195, 195, 195.0, 195.0, 195.0, 195.0, 5.128205128205129, 0.9264823717948718, 3.535657051282051], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 149.08333333333334, 95, 305, 100.0, 302.90000000000003, 305.0, 305.0, 0.058944596990878326, 0.015887410907697675, 0.03465297596534058], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 151.0, 99, 302, 103.5, 299.90000000000003, 302.0, 302.0, 0.05900430239704978, 0.015903503380454823, 0.03474569760295022], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 106.0, 103, 109, 106.0, 109.0, 109.0, 109.0, 0.03457366351181987, 0.010196529668525002, 0.02137219629197459], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1175.2142857142856, 761, 1761, 1165.0, 1538.8, 1599.8999999999999, 1761.0, 0.2639305862558147, 315.75273827983244, 0.5211598099699779], "isController": false}, {"data": ["deleteBook", 16, 4, 25.0, 663.5625, 104, 2240, 540.5, 1611.4000000000005, 2240.0, 2240.0, 0.09101924488158965, 0.01904382149988338, 0.06077578973416692], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 4, 25.0, 663.5625, 104, 2240, 540.5, 1611.4000000000005, 2240.0, 2240.0, 0.09026951090850621, 0.018886955773581498, 0.0602751739098546], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 8, 36.36363636363637, 1114.5454545454545, 142, 2895, 1143.0, 2389.399999999999, 2864.6999999999994, 2895.0, 0.08773154148306184, 0.02732264271329731, 0.039582004067553286], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 129.71428571428572, 98, 301, 101.0, 301.0, 301.0, 301.0, 0.03214976278067891, 0.008665365749479863, 0.01893194038745057], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 151.5, 98, 310, 103.5, 307.2, 310.0, 310.0, 0.09851731441800897, 0.035609102538052315, 0.055668536186641054], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=109831b6-46ee-4e27-ac76-d1d25e9080b2", 1, 0, 0.0, 801.0, 801, 801, 801.0, 801.0, 801.0, 801.0, 1.2484394506866416, 0.2255481429463171, 0.8607404806491885], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 99.85714285714285, 96, 105, 99.0, 105.0, 105.0, 105.0, 0.032149910439535204, 0.008665405548155973, 0.018900630941992378], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 115.6875, 97, 310, 103.5, 168.60000000000014, 310.0, 310.0, 0.09852398751208459, 0.07321948681318005, 0.049454423419151836], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 198.625, 94, 602, 102.5, 461.3000000000001, 602.0, 602.0, 0.0985276277626223, 1.8355461317129644, 0.057490485925944176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 204.5625, 98, 1164, 100.5, 564.8000000000006, 1164.0, 1164.0, 0.09851731441800897, 5.565272194488572, 0.05738825981478746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 114.5, 96, 313, 102.0, 167.40000000000015, 313.0, 313.0, 0.08364963351004319, 0.022546190282003827, 0.04917683532524023], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 111.3125, 94, 296, 99.0, 162.30000000000013, 296.0, 296.0, 0.08364832154414802, 0.022545836666196147, 0.0492577518467981], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 131.14285714285717, 100, 306, 102.0, 306.0, 306.0, 306.0, 0.03214931981224797, 0.008602454715386664, 0.018335158955422672], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 102.0, 97, 106, 103.0, 106.0, 106.0, 106.0, 0.08364832154414802, 0.062164426460055315, 0.041987536400089925], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 134.85714285714286, 103, 286, 109.0, 286.0, 286.0, 286.0, 0.03214858155865508, 0.023891670474742697, 0.016137080977684293], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 127.37500000000001, 94, 308, 102.0, 308.0, 308.0, 308.0, 0.08364788423132823, 0.022382344022835874, 0.04770543397567938], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 107.42857142857143, 104, 114, 107.0, 114.0, 114.0, 114.0, 0.032710127522768584, 0.025746448030616677, 0.011627428142859145], "isController": false}, {"data": ["deleteAccount", 14, 3, 21.428571428571427, 745.0714285714287, 100, 2768, 478.5, 2259.5, 2768.0, 2768.0, 0.08538407586985028, 0.017016064785167567, 0.05810000419296801], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1665.45, 870, 3803, 1316.5, 3223.0000000000014, 3777.2499999999995, 3803.0, 0.09315800995859126, 0.048216548123098994, 0.042849045596187976], "isController": false}, {"data": ["goToProfile", 16, 4, 25.0, 194.68750000000003, 99, 280, 209.5, 276.5, 280.0, 280.0, 0.09252833680314597, 0.15898225154695814, 0.05979553406199399], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 268.42857142857144, 207, 593, 215.0, 593.0, 593.0, 593.0, 0.032133233567293876, 0.049800236007124396, 0.07226839541550567], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c10fa98f-5f6f-428f-9ac1-c48dfbef5cbb", 3, 0, 0.0, 544.0, 200, 987, 445.0, 987.0, 987.0, 987.0, 0.055364854390432955, 0.035594266738640974, 0.03550415467094822], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 114.31578947368419, 99, 295, 104.0, 122.0, 295.0, 295.0, 0.11056089286649481, 0.08216488229629156, 0.05549638567712728], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 713.5714285714287, 581, 877, 746.0, 877.0, 877.0, 877.0, 0.03416700833675003, 10.046234902453191, 0.019485871942052754], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 103.10526315789473, 97, 125, 103.0, 106.0, 125.0, 125.0, 0.11056410972615016, 0.029584537172817522, 0.063056093828195], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1080.142857142857, 878, 1329, 1093.0, 1329.0, 1329.0, 1329.0, 0.03408183535552223, 30.666895362375115, 0.019404013683856896], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 188.42857142857142, 99, 305, 107.0, 305.0, 305.0, 305.0, 0.034214771005425484, 0.06054410650569431, 0.018945092929761962], "isController": false}, {"data": ["addBook", 60, 15, 25.0, 1321.4833333333331, 515, 5602, 896.0, 2220.3, 4695.199999999994, 5602.0, 0.29123386079021457, 76.62152889434277, 1.0609700742039607], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 147.66666666666666, 100, 443, 103.0, 399.8000000000002, 443.0, 443.0, 0.07016518052916242, 0.05214424060809823, 0.03521963163280222], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 184.83333333333334, 99, 313, 104.0, 309.7, 313.0, 313.0, 0.07007913101877537, 0.018751642479633252, 0.03996700440914532], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 150.16666666666669, 99, 298, 102.0, 297.7, 298.0, 298.0, 0.07016477026884801, 0.01891159823652544, 0.041249210646334473], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 194.83928571428578, 99, 432, 106.0, 408.5, 418.6, 432.0, 0.26534122407592553, 0.1971920620329876, 0.12826553312263977], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 184.25, 99, 305, 106.0, 304.1, 305.0, 305.0, 0.07008772647096616, 0.0188908325253776, 0.04127236236522714], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 660.2678571428571, 472, 930, 608.0, 845.7, 915.2, 930.0, 0.2648693390091049, 77.88038015844862, 0.13321065389618067], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 133.42857142857142, 95, 293, 106.0, 293.0, 293.0, 293.0, 0.03424624025205233, 0.025450575031066233, 0.01923006654778329], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/16ce03b2-df1f-4e17-9542-1a979308cd28", 3, 0, 0.0, 442.0, 217, 630, 479.0, 630.0, 630.0, 630.0, 0.03328894806924101, 0.02725315898246782, 0.0213474048490901], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 159.6428571428572, 94, 420, 108.0, 308.3, 398.45, 420.0, 0.26579965351116597, 0.47034079312718036, 0.129265847117735], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 21, 0, 0.0, 530.095238095238, 99, 1328, 104.0, 1270.0000000000002, 1325.8999999999999, 1328.0, 0.10292704922853727, 39.707541098832024, 0.056719007317623076], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3e4cb3de-2d01-4f05-9011-8d347cadf40a", 3, 0, 0.0, 417.6666666666667, 206, 562, 485.0, 562.0, 562.0, 562.0, 0.07998080460689434, 0.03618923125116639, 0.0512897737876243], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 133.57894736842104, 97, 310, 102.0, 295.0, 310.0, 310.0, 0.11043879075336693, 0.02976670532024343, 0.06492592972024111], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 974.9464285714286, 654, 1353, 983.5, 1196.9, 1237.4999999999998, 1353.0, 0.26451402632859256, 238.0101858565295, 0.1327736421219693], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 21, 0, 0.0, 397.90476190476187, 95, 1014, 108.0, 914.0, 1004.4999999999999, 1014.0, 0.10292654475589255, 12.986061800650887, 0.05681924352665552], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 111.05263157894737, 96, 302, 100.0, 107.0, 302.0, 302.0, 0.11043429740537525, 0.029765494222542547, 0.06503113411664187], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 13, 0, 0.0, 361.30769230769226, 101, 2330, 107.0, 1793.5999999999995, 2330.0, 2330.0, 0.12483675193977108, 0.09326183128312976, 0.0443755641660905], "isController": false}, {"data": ["deleteBooks", 15, 4, 26.666666666666668, 473.7333333333333, 103, 1485, 458.0, 1074.6000000000004, 1485.0, 1485.0, 0.08628673657809813, 0.01821796137518048, 0.05785031336466501], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=12632811-8ed7-4928-8cf8-e07c9f1f3b54", 1, 0, 0.0, 533.0, 533, 533, 533.0, 533.0, 533.0, 533.0, 1.876172607879925, 0.3389569652908067, 1.2935330675422139], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 15, 8.522727272727273, 269.715909090909, 97, 3583, 110.0, 531.2, 796.7500000000023, 2961.609999999992, 0.7194509281325752, 1.5259510114212835, 0.3456617121807947], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 107.41666666666667, 101, 121, 106.0, 119.5, 121.0, 121.0, 0.059472479110291715, 0.04605632415474739, 0.021140607808736507], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/12632811-8ed7-4928-8cf8-e07c9f1f3b54", 3, 0, 0.0, 645.6666666666666, 217, 1242, 478.0, 1242.0, 1242.0, 1242.0, 0.04021393815096313, 0.03352470560046112, 0.025788235077277784], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 367.75, 203, 743, 400.5, 700.1000000000001, 743.0, 743.0, 0.07003700288318995, 0.1085436753668188, 0.1575148609765493], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c10fa98f-5f6f-428f-9ac1-c48dfbef5cbb", 1, 0, 0.0, 458.0, 458, 458, 458.0, 458.0, 458.0, 458.0, 2.1834061135371177, 0.39446301855895194, 1.5053561681222707], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 216.375, 100, 1403, 110.5, 669.4000000000008, 1403.0, 1403.0, 0.09615269047247028, 0.0780301618970926, 0.03417927669138592], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9b938785-9d94-4c8a-9ba5-9fbb12f8b3d8", 1, 0, 0.0, 1485.0, 1485, 1485, 1485.0, 1485.0, 1485.0, 1485.0, 0.6734006734006734, 0.12165930134680134, 0.46427819865319864], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 522.2, 187, 1190, 509.0, 960.9000000000002, 1179.1, 1190.0, 0.09202679820363689, 0.05652817975594493, 0.041609773015902234], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 21, 0, 0.0, 111.99999999999999, 97, 302, 103.0, 109.2, 282.7999999999997, 302.0, 0.10292351802386844, 0.07648905978141006, 0.051662781508074594], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4f541568-1472-46ac-aa05-e59591d9c00e", 1, 0, 0.0, 599.0, 599, 599, 599.0, 599.0, 599.0, 599.0, 1.669449081803005, 0.3016094532554257, 1.1510068864774625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 21, 0, 0.0, 185.52380952380952, 95, 312, 109.0, 306.6, 311.6, 312.0, 0.1029290671685684, 0.09379640998117869, 0.054996976458651925], "isController": false}, {"data": ["login", 20, 0, 0.0, 3059.8, 1724, 6496, 3003.0, 4846.000000000001, 6414.8499999999985, 6496.0, 0.09114814764176955, 38.28778970156957, 0.19042307836917735], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/4f541568-1472-46ac-aa05-e59591d9c00e", 3, 0, 0.0, 1083.6666666666665, 203, 2768, 280.0, 2768.0, 2768.0, 2768.0, 0.04086469698827183, 0.03406721646711073, 0.026205551128546715], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 320.58333333333337, 204, 599, 212.5, 595.4, 599.0, 599.0, 0.05891334338133134, 0.09130417572868442, 0.1324974900460997], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 131.8421052631579, 101, 312, 107.0, 296.0, 312.0, 312.0, 0.1099657948501282, 0.08902504290112917, 0.03908940363813151], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 256.75000000000006, 201, 419, 207.0, 414.1, 419.0, 419.0, 0.0836046128845159, 0.12957082094504563, 0.18802873386039073], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6248a96c-5bdf-4131-98d4-403b4e8075ca", 3, 0, 0.0, 303.6666666666667, 220, 457, 234.0, 457.0, 457.0, 457.0, 0.019888491855662587, 0.023507524065075145, 0.01275401333191904], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6248a96c-5bdf-4131-98d4-403b4e8075ca", 1, 0, 0.0, 475.0, 475, 475, 475.0, 475.0, 475.0, 475.0, 2.1052631578947367, 0.38034539473684215, 1.451480263157895], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f19d0a8b-6cb9-4d4e-8dcc-ce278fdcc2af", 3, 0, 0.0, 344.66666666666663, 192, 620, 222.0, 620.0, 620.0, 620.0, 0.017923930837525543, 0.024709585643528865, 0.01149418741859548], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 108.91666666666667, 103, 120, 107.5, 118.2, 120.0, 120.0, 0.07147707372860154, 0.05926175351131125, 0.025407866051963834], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 21, 0, 0.0, 663.7142857142858, 201, 1429, 394.0, 1374.6000000000001, 1427.4, 1429.0, 0.10286957118084471, 52.83443173134387, 0.22007601479607333], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 21, 0, 0.0, 119.80952380952381, 100, 308, 108.0, 129.4, 290.19999999999976, 308.0, 0.10906824555936429, 0.08467700705048302, 0.03877035291368028], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/68a79043-a0f8-481b-aa32-ff0d545327ef", 2, 0, 0.0, 292.5, 275, 310, 292.5, 310.0, 310.0, 310.0, 0.03890218046721519, 0.0327857243586003, 0.02418089635486569], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c1fb9d4e-cc85-45ad-9c27-245bb9c2c246", 1, 0, 0.0, 442.0, 442, 442, 442.0, 442.0, 442.0, 442.0, 2.2624434389140275, 0.40874222285067874, 1.5598486990950227], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9b938785-9d94-4c8a-9ba5-9fbb12f8b3d8", 3, 0, 0.0, 719.6666666666667, 240, 1666, 253.0, 1666.0, 1666.0, 1666.0, 0.02818833566670112, 0.023499455612767436, 0.01807650431751341], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f19d0a8b-6cb9-4d4e-8dcc-ce278fdcc2af", 1, 0, 0.0, 412.0, 412, 412, 412.0, 412.0, 412.0, 412.0, 2.4271844660194173, 0.43850500606796117, 1.6734299150485439], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2d8ccae5-ea18-4974-9477-b42c44fb66a6", 3, 0, 0.0, 349.0, 255, 470, 322.0, 470.0, 470.0, 470.0, 0.03178067099590029, 0.026494237767090055, 0.02038018289776158], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 7, 50.0, 658.1428571428571, 99, 1436, 544.0, 1411.0, 1436.0, 1436.0, 0.06478452205218856, 38.76107301967598, 0.09442470621376116], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 390.68750000000006, 201, 1271, 396.5, 811.8000000000004, 1271.0, 1271.0, 0.09845669136288675, 7.5048288488105195, 0.21985696473404384], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c1fb9d4e-cc85-45ad-9c27-245bb9c2c246", 3, 0, 0.0, 793.3333333333333, 213, 1751, 416.0, 1751.0, 1751.0, 1751.0, 0.015424957581366652, 0.02126454926988534, 0.009891655740655047], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 13, 0, 0.0, 101.61538461538461, 96, 115, 101.0, 111.0, 115.0, 115.0, 0.12954916889225496, 0.09627628664746682, 0.06502761016662016], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 13, 0, 0.0, 162.30769230769232, 94, 308, 103.0, 303.2, 308.0, 308.0, 0.12955045990413266, 0.07956765025361995, 0.07137342795499617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 13, 0, 0.0, 326.3076923076923, 98, 1049, 107.0, 981.8, 1049.0, 1049.0, 0.12955562420896324, 26.928640622041396, 0.07359522462952074], "isController": false}, {"data": ["register", 22, 8, 36.36363636363637, 1114.5454545454545, 142, 2895, 1143.0, 2389.399999999999, 2864.6999999999994, 2895.0, 0.08769552115056524, 0.027311424733325894, 0.039565752706602675], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 13, 0, 0.0, 310.2307692307692, 98, 823, 128.0, 809.0, 823.0, 823.0, 0.1295478779061077, 8.81717727007743, 0.07371733587280391], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 21.05263157894737, 0.6046863189720333], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 10.526315789473685, 0.30234315948601664], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 7.894736842105263, 0.22675736961451248], "isController": false}, {"data": ["401/Unauthorized", 23, 60.526315789473685, 1.7384731670445956], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1323, 38, "401/Unauthorized", 23, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 15, "401/Unauthorized", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 7, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
