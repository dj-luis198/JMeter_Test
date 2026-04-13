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

    var data = {"OkPercent": 98.97314375987362, "KoPercent": 1.0268562401263823};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7586323628977657, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fb11f67b-f466-435e-ab97-20edf162acab"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.75, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b0b7ee3c-d5d4-4a17-94a9-b1cc0aa2d8f4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.4, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/65f8111a-69e4-47e0-8b2d-bd327438b0f1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b78bb8b7-20c5-4152-9264-9d81cc87d950"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6578947368421053, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b187e6e9-7b2a-4c02-9f08-54dffadd2b26"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=38feed9a-a6cd-48a7-8c8d-659f4936842e"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=19b06b44-9c91-411b-9cfe-8fea047615f1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=338eb1bc-4d65-4216-91ba-9abd8104f3c8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/1d39a7bb-beb1-4fb6-ab0e-8e02e99224b9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=030e5c44-294b-4e74-82c4-f327c01c705b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/6bde971f-e23e-466c-97b4-4eb08e7e3b4e"], "isController": false}, {"data": [0.5526315789473685, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bd240461-4765-4673-a60e-d01892c9a98d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d144ca41-512b-431f-b394-4c7d07d88d10"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bb24e4ad-94f3-42ed-823d-c520e83adead"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=54855032-1bb9-4d37-9d48-759e941a69a0"], "isController": false}, {"data": [0.375, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=65f8111a-69e4-47e0-8b2d-bd327438b0f1"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.2894736842105263, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/cfcc819c-df2e-48e9-b407-24644d3f09de"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.4090909090909091, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b78bb8b7-20c5-4152-9264-9d81cc87d950"], "isController": false}, {"data": [0.27884615384615385, 500, 1500, "addBook"], "isController": true}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9824561403508771, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.41228070175438597, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9565217391304348, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d144ca41-512b-431f-b394-4c7d07d88d10"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/19b06b44-9c91-411b-9cfe-8fea047615f1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/338eb1bc-4d65-4216-91ba-9abd8104f3c8"], "isController": false}, {"data": [0.85, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bd240461-4765-4673-a60e-d01892c9a98d"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1d39a7bb-beb1-4fb6-ab0e-8e02e99224b9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b187e6e9-7b2a-4c02-9f08-54dffadd2b26"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4964970e-d2bd-4223-b557-d13b06890bcc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bb24e4ad-94f3-42ed-823d-c520e83adead"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cfcc819c-df2e-48e9-b407-24644d3f09de"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/38feed9a-a6cd-48a7-8c8d-659f4936842e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/030e5c44-294b-4e74-82c4-f327c01c705b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fb11f67b-f466-435e-ab97-20edf162acab"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/54855032-1bb9-4d37-9d48-759e941a69a0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1266, 13, 1.0268562401263823, 432.5758293838867, 115, 2481, 144.5, 1159.3, 1434.6499999999999, 1869.9599999999991, 4.938637622588221, 731.2600846365849, 3.6023966082462766], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 2095.8596491228072, 1562, 3039, 2035.0, 2534.8, 2650.1, 3039.0, 0.2537065638784167, 305.294686641793, 1.2474731925076445], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fb11f67b-f466-435e-ab97-20edf162acab", 1, 0, 0.0, 868.0, 868, 868, 868.0, 868.0, 868.0, 868.0, 1.152073732718894, 0.20813832085253456, 0.7943008352534562], "isController": false}, {"data": ["deleteBook", 14, 0, 0.0, 552.7142857142858, 423, 950, 508.5, 867.0, 950.0, 950.0, 0.0909841232704893, 0.016437561333047385, 0.0618407712854107], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 0, 0.0, 552.7142857142858, 423, 950, 508.5, 867.0, 950.0, 950.0, 0.08982823558096412, 0.016228733967264024, 0.06105512887143654], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 190.375, 125, 385, 129.0, 382.2, 385.0, 385.0, 0.10580890911014708, 0.03824465086366522, 0.05978875003306528], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 127.68750000000001, 116, 131, 128.0, 131.0, 131.0, 131.0, 0.10580820939444639, 0.07863285873942744, 0.05311076135619672], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 276.0625, 115, 1034, 132.5, 581.1000000000005, 1034.0, 1034.0, 0.10580611030287, 1.9711425200039678, 0.061737452056606267], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 251.37499999999997, 125, 1116, 129.0, 600.8000000000005, 1116.0, 1116.0, 0.10580890911014708, 5.97717653265858, 0.06163575613691673], "isController": false}, {"data": ["goToProfile", 14, 0, 0.0, 320.7857142857143, 204, 1345, 216.0, 905.0, 1345.0, 1345.0, 0.09077587436618988, 0.17568196388741197, 0.058685184404704785], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/b0b7ee3c-d5d4-4a17-94a9-b1cc0aa2d8f4", 1, 0, 0.0, 231.0, 231, 231, 231.0, 231.0, 231.0, 231.0, 4.329004329004329, 1.3824066558441557, 2.58302895021645], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 128.07142857142858, 125, 132, 128.0, 131.5, 132.0, 132.0, 0.06565341561894757, 0.04879125906837803, 0.032954937136854545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 144.92857142857142, 126, 357, 128.0, 249.0, 357.0, 357.0, 0.06565464717661569, 0.01756774738905537, 0.03744366596791364], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 858.8, 746, 950, 881.0, 950.0, 950.0, 950.0, 0.05144244619120128, 15.12578723018437, 0.029338270093419484], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1383.2, 1146, 1663, 1362.0, 1663.0, 1663.0, 1663.0, 0.05133681054663436, 46.192952370348884, 0.02922789116082796], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 277.4, 126, 381, 375.0, 381.0, 381.0, 381.0, 0.0517464424320828, 0.0915669469598965, 0.028652571151358344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 128.92307692307693, 126, 132, 129.0, 131.6, 132.0, 132.0, 0.06760411032990807, 0.05024094527447269, 0.03393409444294213], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 144.15384615384613, 121, 352, 127.0, 263.19999999999993, 352.0, 352.0, 0.06760868095463458, 0.018090604083564332, 0.03855807585694004], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 128.0769230769231, 125, 133, 127.0, 132.2, 133.0, 133.0, 0.06760446189448503, 0.018221515119997922, 0.039744029355937495], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/65f8111a-69e4-47e0-8b2d-bd327438b0f1", 3, 0, 0.0, 514.3333333333334, 215, 922, 406.0, 922.0, 922.0, 922.0, 0.014482119409901907, 0.01996477073598131, 0.009287036210125898], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 126.0, 120, 129, 127.0, 129.0, 129.0, 129.0, 0.06760657135873607, 0.018222083686534333, 0.039811291532536965], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 180.4, 129, 381, 130.0, 381.0, 381.0, 381.0, 0.05187905953640872, 0.038554652643756876, 0.02913130784515138], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b78bb8b7-20c5-4152-9264-9d81cc87d950", 1, 0, 0.0, 524.0, 524, 524, 524.0, 524.0, 524.0, 524.0, 1.9083969465648853, 0.34477874522900764, 1.3157502385496183], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 165.0, 125, 385, 128.5, 381.0, 385.0, 385.0, 0.06565495507325217, 0.0176960621095875, 0.03859793257236114], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 812.157894736842, 118, 1630, 1142.0, 1543.0, 1630.0, 1630.0, 0.11669256422697317, 55.278148146584286, 0.06332442912769237], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 163.64285714285714, 122, 381, 128.0, 376.5, 381.0, 381.0, 0.06565649459975333, 0.01769647706008976, 0.03866295531606568], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 629.8947368421052, 124, 1137, 997.0, 1123.0, 1137.0, 1137.0, 0.11669399762926931, 18.07379858923099, 0.0634391659603609], "isController": false}, {"data": ["deleteBooks", 14, 0, 0.0, 483.71428571428567, 211, 868, 456.5, 820.5, 868.0, 868.0, 0.08980806733039105, 0.016225090289181975, 0.06191845267114852], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 275.4615384615384, 254, 482, 257.0, 395.19999999999993, 482.0, 482.0, 0.0675573848016671, 0.10470075164086494, 0.1519381417951556], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b187e6e9-7b2a-4c02-9f08-54dffadd2b26", 3, 0, 0.0, 555.3333333333334, 225, 961, 480.0, 961.0, 961.0, 961.0, 0.023226106143305073, 0.02745247116091821, 0.01489434541090853], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=38feed9a-a6cd-48a7-8c8d-659f4936842e", 1, 0, 0.0, 404.0, 404, 404, 404.0, 404.0, 404.0, 404.0, 2.4752475247524752, 0.44718827351485146, 1.7065671410891088], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 563.4090909090908, 141, 1139, 576.0, 966.8, 1115.5999999999997, 1139.0, 0.10005139003215288, 0.06145734797873453, 0.045238079672740995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 141.9473684210526, 125, 378, 128.0, 138.0, 378.0, 378.0, 0.11669256422697317, 0.08672172009445957, 0.058574197277992394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 167.78947368421052, 125, 390, 127.0, 385.0, 390.0, 390.0, 0.11669184753903035, 0.12346928317426392, 0.06139277094004496], "isController": false}, {"data": ["login", 22, 0, 0.0, 2515.5, 1526, 3823, 2327.0, 3510.7, 3787.4499999999994, 3823.0, 0.09928783543492585, 27.132961678562403, 0.18722244536912508], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=19b06b44-9c91-411b-9cfe-8fea047615f1", 1, 0, 0.0, 554.0, 554, 554, 554.0, 554.0, 554.0, 554.0, 1.8050541516245489, 0.3261084160649819, 1.2445002256317688], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=338eb1bc-4d65-4216-91ba-9abd8104f3c8", 1, 0, 0.0, 211.0, 211, 211, 211.0, 211.0, 211.0, 211.0, 4.739336492890995, 0.8562277843601896, 3.267550355450237], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 131.7857142857143, 124, 159, 129.5, 147.0, 159.0, 159.0, 0.0670899724451899, 0.054314049958068766, 0.023848388642626093], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1d39a7bb-beb1-4fb6-ab0e-8e02e99224b9", 3, 0, 0.0, 476.6666666666667, 204, 677, 549.0, 677.0, 677.0, 677.0, 0.033300772577923805, 0.02776148391017672, 0.02135498762321286], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=030e5c44-294b-4e74-82c4-f327c01c705b", 1, 0, 0.0, 453.0, 453, 453, 453.0, 453.0, 453.0, 453.0, 2.207505518763797, 0.3988169150110375, 1.5219715783664458], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6bde971f-e23e-466c-97b4-4eb08e7e3b4e", 1, 0, 0.0, 572.0, 572, 572, 572.0, 572.0, 572.0, 572.0, 1.7482517482517483, 0.558279611013986, 1.0431463068181819], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 969.5263157894738, 255, 1769, 1272.0, 1672.0, 1769.0, 1769.0, 0.11659946855189597, 73.5032298340452, 0.2465333232843002], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bd240461-4765-4673-a60e-d01892c9a98d", 1, 0, 0.0, 228.0, 228, 228, 228.0, 228.0, 228.0, 228.0, 4.385964912280701, 0.7923862390350876, 3.0239172149122804], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d144ca41-512b-431f-b394-4c7d07d88d10", 3, 0, 0.0, 348.6666666666667, 228, 485, 333.0, 485.0, 485.0, 485.0, 0.043604017383468266, 0.027124764719989536, 0.02796221166843505], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bb24e4ad-94f3-42ed-823d-c520e83adead", 3, 0, 0.0, 353.0, 212, 525, 322.0, 525.0, 525.0, 525.0, 0.016389949682854472, 0.022594868784794497, 0.010510482055736757], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 458.99999999999994, 244, 1245, 504.0, 736.1000000000005, 1245.0, 1245.0, 0.1057138326550029, 8.05800205192201, 0.23606239511205665], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 0, 0.0, 1564.0, 1280, 1792, 1514.0, 1792.0, 1792.0, 1792.0, 0.05126890540886952, 61.335434824404, 0.11560537362214816], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=54855032-1bb9-4d37-9d48-759e941a69a0", 1, 0, 0.0, 244.0, 244, 244, 244.0, 244.0, 244.0, 244.0, 4.0983606557377055, 0.7404264856557378, 2.82562756147541], "isController": false}, {"data": ["register", 24, 6, 25.0, 911.0833333333333, 228, 1469, 924.0, 1408.0, 1463.25, 1469.0, 0.09612457745237828, 0.03032054542687323, 0.043368705842772234], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=65f8111a-69e4-47e0-8b2d-bd327438b0f1", 1, 0, 0.0, 773.0, 773, 773, 773.0, 773.0, 773.0, 773.0, 1.29366106080207, 0.23371806274256143, 0.8919186610608021], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 346.5, 254, 515, 261.5, 512.0, 515.0, 515.0, 0.06561403015433358, 0.10168893149895251, 0.14756749164592795], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 134.37500000000003, 129, 145, 132.5, 145.0, 145.0, 145.0, 0.0749477707722431, 0.058186990003841074, 0.026641590391695787], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 795.6666666666667, 253, 1743, 509.0, 1558.2, 1743.0, 1743.0, 0.10186688036074458, 40.72798370214803, 0.2204131359888897], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 129.2, 125, 137, 128.0, 136.6, 137.0, 137.0, 0.05394703480123215, 0.040091497542712566, 0.027078882702962232], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 150.5, 122, 366, 127.0, 342.70000000000005, 366.0, 366.0, 0.05394732583105855, 0.014435124294638713, 0.03076683426302558], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 179.9, 123, 385, 129.0, 384.9, 385.0, 385.0, 0.05394645275099936, 0.014540254843042796, 0.031714613824317985], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 178.3, 122, 386, 129.0, 384.9, 386.0, 386.0, 0.053949072075960294, 0.014540960832973671, 0.03176883834160552], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1448.2105263157898, 991, 2481, 1370.0, 2017.2, 2103.1, 2481.0, 0.24958184095068792, 298.5866504639157, 0.4928266429709872], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, 25.0, 911.0833333333333, 228, 1469, 924.0, 1408.0, 1463.25, 1469.0, 0.09679253729537453, 0.030531239791412083, 0.043670070537561556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 126.33333333333334, 121, 130, 127.0, 130.0, 130.0, 130.0, 0.033056940580149304, 0.008909878515743368, 0.019466147626787143], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 206.16666666666666, 126, 374, 127.5, 374.0, 374.0, 374.0, 0.03305548362927173, 0.008909485821952147, 0.019433008930489826], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 157.37499999999997, 119, 375, 127.0, 369.4, 375.0, 375.0, 0.07585670668107944, 0.020445752972634693, 0.044595446701181464], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cfcc819c-df2e-48e9-b407-24644d3f09de", 3, 0, 0.0, 866.0, 245, 1345, 1008.0, 1345.0, 1345.0, 1345.0, 0.0394918712564997, 0.02538946801158428, 0.025325190877377737], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 206.81249999999997, 120, 518, 127.0, 514.5, 518.0, 518.0, 0.0758556277764345, 0.02044546217411711, 0.044668890184755866], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 144.99999999999997, 120, 387, 129.0, 216.20000000000016, 387.0, 387.0, 0.07585418928464759, 0.05637210746642267, 0.03807524735577037], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 169.0, 120, 378, 128.0, 378.0, 378.0, 378.0, 0.033057122708039496, 0.00884536291211213, 0.018852890294428774], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 190.3125, 119, 388, 129.0, 383.8, 388.0, 388.0, 0.07585598740790608, 0.020297402880631123, 0.04326161781857144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 127.33333333333334, 122, 131, 128.0, 131.0, 131.0, 131.0, 0.03305566574110803, 0.024565782840803914, 0.016592394717704614], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 171.66666666666669, 128, 376, 131.5, 376.0, 376.0, 376.0, 0.03353097983111563, 0.026392548578007033, 0.011919215486841885], "isController": false}, {"data": ["deleteAccount", 14, 0, 0.0, 541.1428571428572, 404, 1008, 482.5, 842.5, 1008.0, 1008.0, 0.08957821457821458, 0.016183564157196968, 0.06097267144630426], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1236.4545454545455, 783, 1908, 1168.0, 1593.6, 1862.9999999999993, 1908.0, 0.09955742200581053, 0.051528743811601156, 0.045792525160875744], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 337.8333333333333, 251, 508, 262.5, 508.0, 508.0, 508.0, 0.03303218986902737, 0.05119344269740863, 0.0742901692073926], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b78bb8b7-20c5-4152-9264-9d81cc87d950", 3, 0, 0.0, 390.33333333333337, 216, 654, 301.0, 654.0, 654.0, 654.0, 0.026976476512481116, 0.022489178498849002, 0.017299368076037696], "isController": false}, {"data": ["addBook", 52, 7, 13.461538461538462, 1265.653846153846, 645, 2347, 1024.5, 2145.2000000000003, 2328.8, 2347.0, 0.2468819287175908, 91.87699757005274, 0.8937786050696254], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 223.438596491228, 121, 799, 130.0, 511.40000000000003, 532.0999999999997, 799.0, 0.25064530171977856, 0.18627058067260885, 0.12116154721805701], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 833.5263157894738, 617, 1143, 760.0, 1051.2000000000003, 1122.1, 1143.0, 0.2504921951905499, 73.65302250969009, 0.12597996144837226], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 176.7543859649123, 118, 517, 129.0, 378.2, 409.4999999999993, 517.0, 0.25142030417445926, 0.4448960851212111, 0.12227276511609443], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 1221.6315789473683, 847, 1650, 1232.0, 1542.2, 1632.8, 1650.0, 0.25056707284907953, 225.46069259953447, 0.1257729252386981], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 131.73333333333335, 123, 140, 131.0, 138.2, 140.0, 140.0, 0.09861673591753012, 0.07367363571963918, 0.03505516784568453], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 161, 7, 4.3478260869565215, 181.09937888198755, 123, 499, 134.0, 325.6, 380.00000000000006, 457.4599999999997, 0.6434903556383345, 1.5131024041459165, 0.30445418478564973], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 161.5, 127, 399, 134.0, 373.80000000000007, 399.0, 399.0, 0.05318158853404951, 0.0411845700268567, 0.018904392799212914], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d144ca41-512b-431f-b394-4c7d07d88d10", 1, 0, 0.0, 731.0, 731, 731, 731.0, 731.0, 731.0, 731.0, 1.3679890560875512, 0.24714646032831739, 0.9431643296853626], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 152.68749999999997, 122, 495, 129.0, 244.40000000000026, 495.0, 495.0, 0.10194589221770545, 0.08273148089151683, 0.03623857887426248], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/19b06b44-9c91-411b-9cfe-8fea047615f1", 3, 0, 0.0, 343.0, 209, 594, 226.0, 594.0, 594.0, 594.0, 0.03281162844111953, 0.027353704569566123, 0.021041311207358554], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/338eb1bc-4d65-4216-91ba-9abd8104f3c8", 3, 0, 0.0, 283.3333333333333, 204, 434, 212.0, 434.0, 434.0, 434.0, 0.0677078631398393, 0.029974835244199693, 0.04341943046402456], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 336.2, 253, 514, 266.5, 513.9, 514.0, 514.0, 0.05390864640779734, 0.08354787289958436, 0.12124180925503641], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bd240461-4765-4673-a60e-d01892c9a98d", 3, 0, 0.0, 380.0, 272, 464, 404.0, 464.0, 464.0, 464.0, 0.07171543316121629, 0.033289781148403134, 0.04598938910403519], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 385.8125, 246, 776, 260.0, 696.2, 776.0, 776.0, 0.07580746798318969, 0.11748676922785356, 0.17049277223172446], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1d39a7bb-beb1-4fb6-ab0e-8e02e99224b9", 1, 0, 0.0, 427.0, 427, 427, 427.0, 427.0, 427.0, 427.0, 2.34192037470726, 0.42310084894613587, 1.6146443208430914], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b187e6e9-7b2a-4c02-9f08-54dffadd2b26", 1, 0, 0.0, 434.0, 434, 434, 434.0, 434.0, 434.0, 434.0, 2.304147465437788, 0.4162766417050691, 1.5886016705069124], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4964970e-d2bd-4223-b557-d13b06890bcc", 1, 0, 0.0, 305.0, 305, 305, 305.0, 305.0, 305.0, 305.0, 3.278688524590164, 1.0470030737704918, 1.9563268442622952], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bb24e4ad-94f3-42ed-823d-c520e83adead", 1, 0, 0.0, 461.0, 461, 461, 461.0, 461.0, 461.0, 461.0, 2.1691973969631237, 0.3918960140997831, 1.495559924078091], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 137.30769230769232, 121, 154, 135.0, 152.4, 154.0, 154.0, 0.06610091066716157, 0.05480436831681658, 0.02349680808871759], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cfcc819c-df2e-48e9-b407-24644d3f09de", 1, 0, 0.0, 460.0, 460, 460, 460.0, 460.0, 460.0, 460.0, 2.1739130434782608, 0.39274796195652173, 1.4988111413043477], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 159.73684210526315, 128, 391, 133.0, 383.0, 391.0, 391.0, 0.11744634556423697, 0.09118148898785976, 0.04174850564978736], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/38feed9a-a6cd-48a7-8c8d-659f4936842e", 3, 0, 0.0, 315.6666666666667, 230, 447, 270.0, 447.0, 447.0, 447.0, 0.05499340079190498, 0.03535545786588943, 0.035265950377621355], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/030e5c44-294b-4e74-82c4-f327c01c705b", 3, 0, 0.0, 533.3333333333334, 216, 959, 425.0, 959.0, 959.0, 959.0, 0.032145038413320906, 0.02679799589079259, 0.020613842992917377], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fb11f67b-f466-435e-ab97-20edf162acab", 3, 0, 0.0, 331.6666666666667, 210, 469, 316.0, 469.0, 469.0, 469.0, 0.037782423616533584, 0.031497651979799, 0.024228963061383845], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/54855032-1bb9-4d37-9d48-759e941a69a0", 3, 0, 0.0, 603.0, 465, 776, 568.0, 776.0, 776.0, 776.0, 0.06593116786075337, 0.029188277438354355, 0.04228007834820447], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 177.73333333333335, 119, 384, 129.0, 381.0, 384.0, 384.0, 0.10212905026791855, 0.07589863989637306, 0.051263995935263804], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 193.86666666666667, 119, 389, 127.0, 387.2, 389.0, 389.0, 0.10213044099924423, 0.07845958358014857, 0.05538714671378284], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 583.6666666666666, 124, 1366, 375.0, 1333.6, 1366.0, 1366.0, 0.10195550661691238, 30.59823482094914, 0.05701808605724462], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 490.9333333333333, 125, 1123, 378.0, 1058.2, 1123.0, 1123.0, 0.10195550661691238, 10.011088192362854, 0.0571176519816752], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 46.15384615384615, 0.47393364928909953], "isController": false}, {"data": ["401/Unauthorized", 7, 53.84615384615385, 0.5529225908372828], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1266, 13, "401/Unauthorized", 7, "406/Not Acceptable", 6, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 161, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
