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

    var data = {"OkPercent": 98.23348694316437, "KoPercent": 1.7665130568356375};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7450592885375494, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.008928571428571428, 500, 1500, "see books"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/0b94289f-2499-4cdb-a67b-f0e0338330d1"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6071428571428571, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ae72d5ee-69e4-4079-b5c5-f06c1f580513"], "isController": false}, {"data": [0.8, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/75c0d12c-0072-4708-a845-e840bb65c025"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e49ec79d-1246-4c1f-ac42-f863f9a6d407"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d7f6d11e-df2b-4506-879c-5c231c0fd008"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/24bcf5f9-6a7b-474d-adfc-5ee69f8aa5ec"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d1ca5725-0b34-48f6-a169-9fafe7c77657"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/605f6f5b-6b82-4fa2-822b-6751d538c683"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=caa1575e-82c0-4d76-b120-77ba03dfbdbf"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/94a1c682-caa6-47fa-9de7-b06ebd6424c2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/89bf2910-9126-4aa9-b726-df4a8c5bdc96"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/340b693d-8c9b-41ff-bea9-ac134b5eee4a"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8c537b1e-84dd-4025-8709-b92201d8c755"], "isController": false}, {"data": [0.6363636363636364, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dde43776-c61a-472c-9069-589da52f3c69"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e49ec79d-1246-4c1f-ac42-f863f9a6d407"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=75c0d12c-0072-4708-a845-e840bb65c025"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1b0a4816-ed33-49d5-a1d3-6cbd812caac8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0b94289f-2499-4cdb-a67b-f0e0338330d1"], "isController": false}, {"data": [0.4, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.21739130434782608, 500, 1500, "register"], "isController": true}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ae72d5ee-69e4-4079-b5c5-f06c1f580513"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.33035714285714285, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.21739130434782608, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d7f6d11e-df2b-4506-879c-5c231c0fd008"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a4a87edd-5baf-4a97-ab64-e8936f2d56c4"], "isController": false}, {"data": [0.20454545454545456, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/caa1575e-82c0-4d76-b120-77ba03dfbdbf"], "isController": false}, {"data": [0.2413793103448276, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=340b693d-8c9b-41ff-bea9-ac134b5eee4a"], "isController": false}, {"data": [0.9464285714285714, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=24bcf5f9-6a7b-474d-adfc-5ee69f8aa5ec"], "isController": false}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.41964285714285715, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1e501266-0f57-4c6a-bcdc-1e21c23a5313"], "isController": false}, {"data": [0.9098837209302325, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=605f6f5b-6b82-4fa2-822b-6751d538c683"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d1ca5725-0b34-48f6-a169-9fafe7c77657"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=89bf2910-9126-4aa9-b726-df4a8c5bdc96"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/dde43776-c61a-472c-9069-589da52f3c69"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8c537b1e-84dd-4025-8709-b92201d8c755"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1302, 23, 1.7665130568356375, 444.88248847926246, 115, 3221, 145.0, 1236.4, 1518.2499999999995, 1963.94, 5.229671759772497, 753.0259261567436, 3.8134160774750567], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 2053.160714285714, 1472, 2718, 2046.0, 2515.4, 2597.7999999999997, 2718.0, 0.24652010459495868, 296.6477263816681, 1.2121374283550945], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/0b94289f-2499-4cdb-a67b-f0e0338330d1", 3, 0, 0.0, 796.6666666666666, 241, 1898, 251.0, 1898.0, 1898.0, 1898.0, 0.0338810774182619, 0.02824526017844034, 0.021727123214184876], "isController": false}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 616.7142857142857, 127, 977, 549.5, 959.5, 977.0, 977.0, 0.07642547151786445, 0.014431065248246309, 0.05168421779894642], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 616.7142857142857, 127, 977, 549.5, 959.5, 977.0, 977.0, 0.07426858704013156, 0.014023790814567253, 0.0502255825442296], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 151.5, 120, 366, 125.0, 364.2, 366.0, 366.0, 0.12152226895578615, 0.05279678438573868, 0.06817167214642082], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 153.94444444444449, 116, 385, 126.0, 368.8, 385.0, 385.0, 0.12130687944791892, 0.09015091333971319, 0.06089036722288118], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 313.11111111111103, 121, 970, 246.5, 948.4000000000001, 970.0, 970.0, 0.12131750813838284, 3.992551821110594, 0.07028148610577538], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 335.7777777777778, 123, 1467, 129.5, 1308.6000000000004, 1467.0, 1467.0, 0.12131260235750824, 12.15765257165868, 0.07016017475754328], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ae72d5ee-69e4-4079-b5c5-f06c1f580513", 1, 0, 0.0, 456.0, 456, 456, 456.0, 456.0, 456.0, 456.0, 2.1929824561403506, 0.3961931195175438, 1.5119586074561402], "isController": false}, {"data": ["goToProfile", 15, 1, 6.666666666666667, 473.9333333333334, 122, 2094, 251.0, 1809.0000000000002, 2094.0, 2094.0, 0.07424382662581606, 0.11898829948227305, 0.047992640271336436], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/75c0d12c-0072-4708-a845-e840bb65c025", 3, 0, 0.0, 1427.3333333333333, 583, 2094, 1605.0, 2094.0, 2094.0, 2094.0, 0.07378803158127752, 0.03338716272720565, 0.04731849681481664], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 181.61111111111111, 122, 385, 127.0, 381.4, 385.0, 385.0, 0.08718987047460353, 0.06479637835075516, 0.04376522795307247], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 206.55555555555554, 121, 382, 126.0, 376.6, 382.0, 382.0, 0.08719451643374428, 0.05243402887107322, 0.04810079443892751], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 748.0, 607, 958, 724.0, 958.0, 958.0, 958.0, 0.14298787462823154, 42.04318278497483, 0.08154777224891328], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e49ec79d-1246-4c1f-ac42-f863f9a6d407", 3, 0, 0.0, 341.0, 244, 531, 248.0, 531.0, 531.0, 531.0, 0.021065640535909896, 0.024898873953739853, 0.013508890578041177], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1405.6, 1275, 1524, 1359.0, 1524.0, 1524.0, 1524.0, 0.1413667335802539, 127.20203537172382, 0.08048516179422659], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 273.2, 122, 380, 368.0, 380.0, 380.0, 380.0, 0.1464900972694246, 0.2592188049337865, 0.08111316909351929], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d7f6d11e-df2b-4506-879c-5c231c0fd008", 1, 0, 0.0, 329.0, 329, 329, 329.0, 329.0, 329.0, 329.0, 3.0395136778115504, 0.5491308890577508, 2.0956022036474162], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 156.375, 122, 378, 125.5, 375.2, 378.0, 378.0, 0.07646538746445555, 0.05682632798872135, 0.038382040192119285], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/24bcf5f9-6a7b-474d-adfc-5ee69f8aa5ec", 3, 0, 0.0, 344.3333333333333, 251, 477, 305.0, 477.0, 477.0, 477.0, 0.04113251525330774, 0.02644424401864674, 0.026377296565434975], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 169.6875, 119, 388, 125.0, 374.7, 388.0, 388.0, 0.07646502203148448, 0.020460367223268307, 0.04360895787733099], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d1ca5725-0b34-48f6-a169-9fafe7c77657", 3, 0, 0.0, 320.6666666666667, 234, 438, 290.0, 438.0, 438.0, 438.0, 0.05833851897946484, 0.038189701063705665, 0.03741109452784692], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 169.625, 121, 368, 124.5, 366.6, 368.0, 368.0, 0.0764668492312692, 0.020610205456865528, 0.04495414378635162], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 185.0625, 119, 380, 124.0, 373.7, 380.0, 380.0, 0.0764668492312692, 0.020610205456865528, 0.04502881844380403], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/605f6f5b-6b82-4fa2-822b-6751d538c683", 3, 0, 0.0, 818.0, 441, 1260, 753.0, 1260.0, 1260.0, 1260.0, 0.021940570308557554, 0.03024684741430379, 0.014069962079380983], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=caa1575e-82c0-4d76-b120-77ba03dfbdbf", 1, 0, 0.0, 651.0, 651, 651, 651.0, 651.0, 651.0, 651.0, 1.5360983102918586, 0.2775177611367127, 1.0590677803379416], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/94a1c682-caa6-47fa-9de7-b06ebd6424c2", 2, 0, 0.0, 1051.0, 483, 1619, 1051.0, 1619.0, 1619.0, 1619.0, 0.017504244779358993, 0.024752096133312328, 0.010880324025451173], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 122.6, 115, 131, 122.0, 131.0, 131.0, 131.0, 0.14651585301529627, 0.10888531654750044, 0.0822720854333939], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 440.11111111111114, 121, 1473, 126.5, 1365.0000000000002, 1473.0, 1473.0, 0.08719282693677068, 17.453002914904644, 0.04959470473117967], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 990.7333333333333, 123, 1641, 1437.0, 1594.2, 1641.0, 1641.0, 0.1367964104621895, 82.0720573667147, 0.07258403289497684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 309.8333333333333, 118, 1090, 126.0, 1022.5000000000001, 1090.0, 1090.0, 0.08719451643374428, 5.715630828105699, 0.0496808166008671], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 671.3333333333334, 123, 1100, 926.0, 1051.4, 1100.0, 1100.0, 0.1367964104621895, 26.827414798635683, 0.07271762313956882], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 406.5, 125, 651, 453.0, 628.0, 651.0, 651.0, 0.07426819305486297, 0.014023716420166997, 0.050826258514317844], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/89bf2910-9126-4aa9-b726-df4a8c5bdc96", 3, 0, 0.0, 541.3333333333333, 246, 1072, 306.0, 1072.0, 1072.0, 1072.0, 0.09329228472805298, 0.0433055983145194, 0.05982610706844545], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/340b693d-8c9b-41ff-bea9-ac134b5eee4a", 3, 0, 0.0, 429.66666666666663, 241, 758, 290.0, 758.0, 758.0, 758.0, 0.021088889669958876, 0.021150673526413834, 0.013523799690696284], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 375.56249999999994, 246, 758, 257.0, 748.9, 758.0, 758.0, 0.07641900540664463, 0.1184345327933057, 0.17186813422998298], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8c537b1e-84dd-4025-8709-b92201d8c755", 3, 0, 0.0, 420.6666666666667, 245, 575, 442.0, 575.0, 575.0, 575.0, 0.0617817867292722, 0.0279546495942996, 0.03961917964084188], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 767.2727272727273, 195, 1438, 687.5, 1388.6999999999998, 1435.6, 1438.0, 0.11736212617495492, 0.0720906028945768, 0.053065101971683716], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 125.0, 117, 133, 124.0, 130.6, 133.0, 133.0, 0.13679142044210987, 0.10165846773090391, 0.06866288096410593], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 198.13333333333335, 118, 489, 124.0, 423.00000000000006, 489.0, 489.0, 0.13680140084634468, 0.17358459000620166, 0.07036009548737779], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dde43776-c61a-472c-9069-589da52f3c69", 1, 0, 0.0, 234.0, 234, 234, 234.0, 234.0, 234.0, 234.0, 4.273504273504274, 0.7720686431623931, 2.946380876068376], "isController": false}, {"data": ["login", 22, 0, 0.0, 3205.818181818182, 1742, 5553, 3217.0, 4508.299999999999, 5419.649999999998, 5553.0, 0.1141185380377836, 31.18583365050938, 0.21518801029141724], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e49ec79d-1246-4c1f-ac42-f863f9a6d407", 1, 0, 0.0, 472.0, 472, 472, 472.0, 472.0, 472.0, 472.0, 2.1186440677966103, 0.38276284427966106, 1.4607057733050848], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=75c0d12c-0072-4708-a845-e840bb65c025", 1, 0, 0.0, 391.0, 391, 391, 391.0, 391.0, 391.0, 391.0, 2.557544757033248, 0.46205642583120204, 1.7633072250639386], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 130.55555555555557, 119, 176, 128.0, 141.80000000000007, 176.0, 176.0, 0.08968788615617651, 0.07260865002292023, 0.031881240782078366], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1b0a4816-ed33-49d5-a1d3-6cbd812caac8", 1, 0, 0.0, 357.0, 357, 357, 357.0, 357.0, 357.0, 357.0, 2.8011204481792715, 0.8944984243697479, 1.671371673669468], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0b94289f-2499-4cdb-a67b-f0e0338330d1", 1, 0, 0.0, 450.0, 450, 450, 450.0, 450.0, 450.0, 450.0, 2.2222222222222223, 0.4014756944444444, 1.5321180555555556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 1117.2666666666669, 248, 1759, 1559.0, 1716.4, 1759.0, 1759.0, 0.1366356655523269, 109.04642502744099, 0.283990470231643], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 544.8333333333334, 244, 1590, 495.0, 1437.9000000000003, 1590.0, 1590.0, 0.1209978287611839, 16.250628096368047, 0.26868712734349265], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, 28.571428571428573, 1126.7142857142856, 122, 1647, 1473.0, 1647.0, 1647.0, 1647.0, 0.08887308922858159, 75.95187442867301, 0.15996660117566402], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 1267.7826086956522, 404, 2504, 1153.0, 1914.6000000000001, 2387.7999999999984, 2504.0, 0.09350505740397437, 0.029458539654275213, 0.04218685207093375], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 636.9444444444445, 247, 1859, 368.5, 1683.5000000000002, 1859.0, 1859.0, 0.08713668841856592, 23.270762207002885, 0.1910180681554131], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 149.5, 124, 370, 130.5, 233.50000000000014, 370.0, 370.0, 0.10147970088858163, 0.07878550996720937, 0.036072862425238], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ae72d5ee-69e4-4079-b5c5-f06c1f580513", 3, 0, 0.0, 567.0, 238, 1216, 247.0, 1216.0, 1216.0, 1216.0, 0.047405347323178054, 0.03047707062606662, 0.030399913485241136], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 417.99999999999994, 252, 762, 474.0, 748.8, 762.0, 762.0, 0.08290957329206279, 0.12849364532666374, 0.18646557352697327], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 123.22222222222223, 118, 129, 122.0, 129.0, 129.0, 129.0, 0.042682348477662904, 0.03171998749170065, 0.021424538200701886], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 175.66666666666666, 117, 369, 122.0, 369.0, 369.0, 369.0, 0.04268255089894195, 0.018543938129271218, 0.0239440959361469], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 258.22222222222223, 120, 1330, 124.0, 1330.0, 1330.0, 1330.0, 0.042682348477662904, 4.277520666852413, 0.024684995376078912], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 217.22222222222223, 120, 723, 123.0, 723.0, 723.0, 723.0, 0.042682348477662904, 1.4046734948544057, 0.024726677357014133], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 125.0, 125, 125, 125.0, 125.0, 125.0, 125.0, 8.0, 2.359375, 4.9453125], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1403.0, 939, 2192, 1293.0, 1995.5, 2079.55, 2192.0, 0.24852328352512526, 297.3202477688379, 0.49073640555449544], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 1267.7826086956522, 404, 2504, 1153.0, 1914.6000000000001, 2387.7999999999984, 2504.0, 0.09521443947673455, 0.02999707629574433, 0.04295807718579235], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 158.7142857142857, 121, 361, 125.0, 361.0, 361.0, 361.0, 0.05725643521434356, 0.015432398553866036, 0.033716435970946444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 157.85714285714286, 121, 348, 126.0, 348.0, 348.0, 348.0, 0.05725784023426636, 0.015432777250642106, 0.033661347481472995], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d7f6d11e-df2b-4506-879c-5c231c0fd008", 3, 0, 0.0, 422.0, 237, 728, 301.0, 728.0, 728.0, 728.0, 0.09751974774891915, 0.04412514627962162, 0.0625370778207587], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 162.25, 120, 500, 123.0, 405.5000000000001, 500.0, 500.0, 0.09827768359499765, 0.026488906906464216, 0.05777652883221542], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 162.625, 117, 508, 124.5, 402.3000000000001, 508.0, 508.0, 0.09827768359499765, 0.026488906906464216, 0.057872503132601165], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 126.42857142857143, 122, 131, 126.0, 131.0, 131.0, 131.0, 0.05725971370143149, 0.015321446830265848, 0.03265593047034765], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 141.6875, 118, 380, 125.0, 207.1000000000002, 380.0, 380.0, 0.09827707994226222, 0.07303599398052885, 0.049330487392893335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 166.2857142857143, 122, 387, 129.0, 387.0, 387.0, 387.0, 0.057255966889692284, 0.04255057695610921, 0.028739811505177577], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 137.875, 116, 364, 123.0, 198.80000000000018, 364.0, 364.0, 0.09827768359499765, 0.026296958305692734, 0.05604899142527211], "isController": false}, {"data": ["deleteAccount", 14, 1, 7.142857142857143, 733.357142857143, 122, 1898, 655.5, 1557.0, 1898.0, 1898.0, 0.07471926903206523, 0.013962954920263866, 0.05085350920381282], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 167.71428571428572, 124, 380, 135.0, 380.0, 380.0, 380.0, 0.055830721253160416, 0.04394488411137431, 0.019846076695459368], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a4a87edd-5baf-4a97-ab64-e8936f2d56c4", 1, 0, 0.0, 222.0, 222, 222, 222.0, 222.0, 222.0, 222.0, 4.504504504504505, 1.4384501689189189, 2.68774634009009], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1685.5000000000005, 1005, 3221, 1606.5, 2880.7999999999993, 3218.3, 3221.0, 0.11388990987166678, 0.05894692600779628, 0.05238490971636235], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 328.0, 250, 749, 258.0, 749.0, 749.0, 749.0, 0.0571956171815634, 0.0886420356124425, 0.12863428356361378], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/caa1575e-82c0-4d76-b120-77ba03dfbdbf", 3, 0, 0.0, 396.3333333333333, 273, 466, 450.0, 466.0, 466.0, 466.0, 0.03961232735627327, 0.025466909677291576, 0.02540243648823514], "isController": false}, {"data": ["addBook", 58, 13, 22.413793103448278, 1274.7586206896551, 628, 2511, 1008.0, 2296.0, 2460.1, 2511.0, 0.27973511977968446, 99.2218096028726, 1.0129565138493], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=340b693d-8c9b-41ff-bea9-ac134b5eee4a", 1, 0, 0.0, 485.0, 485, 485, 485.0, 485.0, 485.0, 485.0, 2.061855670103093, 0.3725032216494846, 1.4215528350515465], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 222.12500000000003, 122, 529, 128.0, 502.6, 512.8, 529.0, 0.24985276533471348, 0.18568159611300483, 0.12077843636785465], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 818.5892857142857, 576, 1204, 752.5, 1008.2, 1083.95, 1204.0, 0.2493921067398217, 73.32955997880167, 0.12542669430762518], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=24bcf5f9-6a7b-474d-adfc-5ee69f8aa5ec", 1, 0, 0.0, 482.0, 482, 482, 482.0, 482.0, 482.0, 482.0, 2.074688796680498, 0.3748217064315353, 1.4304006742738589], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 199.46428571428572, 122, 1370, 127.0, 374.20000000000005, 396.14999999999986, 1370.0, 0.2500647489081994, 0.4424973877164623, 0.12161352046512043], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1179.482142857143, 809, 1686, 1124.5, 1519.1000000000001, 1589.3, 1686.0, 0.2491380269158047, 224.174834556779, 0.12505561116672229], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 150.79999999999998, 125, 371, 132.0, 247.4000000000001, 371.0, 371.0, 0.08367780697203488, 0.06251320540391278, 0.029744845447090523], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1e501266-0f57-4c6a-bcdc-1e21c23a5313", 1, 0, 0.0, 325.0, 325, 325, 325.0, 325.0, 325.0, 325.0, 3.076923076923077, 0.9825721153846153, 1.8359375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 13, 7.558139534883721, 188.2151162790698, 118, 686, 132.5, 357.1000000000006, 409.35, 631.2500000000008, 0.7146329404237108, 1.602661585726869, 0.3416790056838248], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 159.77777777777777, 125, 367, 132.0, 367.0, 367.0, 367.0, 0.044447078345383424, 0.03442044250770416, 0.015799547380585515], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=605f6f5b-6b82-4fa2-822b-6751d538c683", 1, 0, 0.0, 462.0, 462, 462, 462.0, 462.0, 462.0, 462.0, 2.1645021645021645, 0.3910477543290043, 1.4923227813852813], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 130.16666666666669, 123, 146, 128.5, 140.60000000000002, 146.0, 146.0, 0.12057070131957935, 0.09784594999665082, 0.042859116484694225], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d1ca5725-0b34-48f6-a169-9fafe7c77657", 1, 0, 0.0, 605.0, 605, 605, 605.0, 605.0, 605.0, 605.0, 1.6528925619834711, 0.29861828512396693, 1.1395919421487604], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=89bf2910-9126-4aa9-b726-df4a8c5bdc96", 1, 0, 0.0, 235.0, 235, 235, 235.0, 235.0, 235.0, 235.0, 4.25531914893617, 0.7687832446808511, 2.9338430851063833], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dde43776-c61a-472c-9069-589da52f3c69", 3, 0, 0.0, 858.3333333333334, 255, 1537, 783.0, 1537.0, 1537.0, 1537.0, 0.0638936809149575, 0.028910226716077778, 0.040973486784656996], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 410.99999999999994, 245, 1454, 250.0, 1454.0, 1454.0, 1454.0, 0.042657465293412265, 5.729116060298697, 0.09472493785044292], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8c537b1e-84dd-4025-8709-b92201d8c755", 1, 0, 0.0, 314.0, 314, 314, 314.0, 314.0, 314.0, 314.0, 3.1847133757961785, 0.5753632563694268, 2.1957105891719744], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 321.625, 245, 889, 254.0, 612.5000000000002, 889.0, 889.0, 0.09820288716488265, 0.15219529485416872, 0.220860594863989], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 162.5, 122, 378, 132.0, 368.2, 378.0, 378.0, 0.07559043214105174, 0.06267214539819622, 0.026870036425139486], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 130.8, 124, 148, 130.0, 142.0, 148.0, 148.0, 0.1410875024690313, 0.10953570748328113, 0.05015219814328847], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 160.80000000000004, 117, 379, 127.0, 377.8, 379.0, 379.0, 0.08307947936859596, 0.061741683397950706, 0.04170200429243977], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 191.53333333333333, 120, 370, 130.0, 367.0, 370.0, 370.0, 0.08296919077382599, 0.022200740500027658, 0.04731836661319763], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 190.6, 115, 383, 127.0, 379.4, 383.0, 383.0, 0.08308316070498832, 0.02239350815876638, 0.04884381127383102], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 220.33333333333334, 120, 372, 134.0, 367.8, 372.0, 372.0, 0.08308362089497677, 0.022393632194349207, 0.0489252181637412], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 26.08695652173913, 0.4608294930875576], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 4.3478260869565215, 0.07680491551459294], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.3478260869565215, 0.07680491551459294], "isController": false}, {"data": ["401/Unauthorized", 15, 65.21739130434783, 1.152073732718894], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1302, 23, "401/Unauthorized", 15, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
