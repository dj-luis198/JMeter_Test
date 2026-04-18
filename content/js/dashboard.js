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

    var data = {"OkPercent": 99.35897435897436, "KoPercent": 0.6410256410256411};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7691247415575465, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c4408f01-0989-4bad-9cb2-b08842c12b8a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=47913709-64e3-4238-8de2-184b9d787213"], "isController": false}, {"data": [0.009615384615384616, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b4d31130-1995-4745-98f7-cf0d5c26db30"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9cbf7bb2-2964-4eec-8e0b-182ce40d7f5e"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.75, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e158011b-2d6d-475e-a9ef-04270da752d6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0eaa70f7-d223-4666-94df-3ca8a19e97eb"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6590909090909091, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/196215b3-2539-47f2-91ce-9ed5578b401f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.625, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/80b4cd51-6ce5-44ed-947d-b6e5e8948ac4"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/84dad0b7-4f10-479b-a65e-fe0bb90fa63a"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/23d6a56e-48b2-4979-aa36-ddc702901d57"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5372a280-744d-4a57-9d32-d3293fe5a2cb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=285a253a-2ecf-43f1-bccc-a069ba3dd693"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/47913709-64e3-4238-8de2-184b9d787213"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=30cc4d78-32eb-4397-a896-1583667b376a"], "isController": false}, {"data": [0.775, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.125, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6534768f-55ab-4e48-bbf3-33cdf3dd7fef"], "isController": false}, {"data": [0.36363636363636365, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8611111111111112, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f0028a13-2e2c-46aa-8ec3-63e4a0eade2b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=196215b3-2539-47f2-91ce-9ed5578b401f"], "isController": false}, {"data": [0.6176470588235294, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b4d31130-1995-4745-98f7-cf0d5c26db30"], "isController": false}, {"data": [0.3173076923076923, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.36363636363636365, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.36363636363636365, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9cbf7bb2-2964-4eec-8e0b-182ce40d7f5e"], "isController": false}, {"data": [0.3135593220338983, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6ac67a27-76d3-4ee3-a652-bb03ce5bd745"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0eaa70f7-d223-4666-94df-3ca8a19e97eb"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7d1b4cb1-5ad8-40e3-9a81-5b8b5e7459a5"], "isController": false}, {"data": [0.46153846153846156, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9676470588235294, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/c4408f01-0989-4bad-9cb2-b08842c12b8a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/909bdb72-bf84-411f-9d8b-c56cb1116e7b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/285a253a-2ecf-43f1-bccc-a069ba3dd693"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=84dad0b7-4f10-479b-a65e-fe0bb90fa63a"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5372a280-744d-4a57-9d32-d3293fe5a2cb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e158011b-2d6d-475e-a9ef-04270da752d6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6534768f-55ab-4e48-bbf3-33cdf3dd7fef"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/30cc4d78-32eb-4397-a896-1583667b376a"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1248, 8, 0.6410256410256411, 430.9222756410258, 120, 2931, 142.5, 1242.1000000000001, 1490.0, 1911.039999999999, 4.84022975577783, 680.5604595127677, 3.5252664332199553], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c4408f01-0989-4bad-9cb2-b08842c12b8a", 1, 0, 0.0, 463.0, 463, 463, 463.0, 463.0, 463.0, 463.0, 2.1598272138228944, 0.3902031587473002, 1.4890996220302375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=47913709-64e3-4238-8de2-184b9d787213", 1, 0, 0.0, 453.0, 453, 453, 453.0, 453.0, 453.0, 453.0, 2.207505518763797, 0.3988169150110375, 1.5219715783664458], "isController": false}, {"data": ["see books", 52, 0, 0.0, 2087.115384615384, 1497, 2659, 2025.0, 2518.8, 2609.7, 2659.0, 0.24275017272608443, 292.10956446621805, 1.1936007028084328], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b4d31130-1995-4745-98f7-cf0d5c26db30", 1, 0, 0.0, 463.0, 463, 463, 463.0, 463.0, 463.0, 463.0, 2.1598272138228944, 0.3902031587473002, 1.4890996220302375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9cbf7bb2-2964-4eec-8e0b-182ce40d7f5e", 1, 0, 0.0, 795.0, 795, 795, 795.0, 795.0, 795.0, 795.0, 1.2578616352201257, 0.22725039308176098, 0.8672366352201257], "isController": false}, {"data": ["deleteBook", 12, 0, 0.0, 550.2499999999999, 421, 811, 492.5, 788.2, 811.0, 811.0, 0.08705935271371257, 0.015728496339879713, 0.05917315379760152], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 0, 0.0, 550.2499999999999, 421, 811, 492.5, 788.2, 811.0, 811.0, 0.08918551329978967, 0.016112617148887783, 0.0606182785709508], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 177.15, 122, 386, 127.0, 382.20000000000005, 385.85, 386.0, 0.12105438368186908, 0.04148240550192174, 0.06853049435583936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 152.99999999999997, 125, 380, 128.5, 341.3000000000005, 379.2, 380.0, 0.1210536509781135, 0.08996272304135192, 0.06076325840112338], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 207.75, 121, 1000, 128.0, 388.3, 969.4999999999995, 1000.0, 0.12105438368186908, 1.8106969516993008, 0.0707647988984051], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 251.65, 120, 1416, 126.5, 381.6, 1364.2999999999993, 1416.0, 0.12105584911598967, 5.477310209018055, 0.0706474369450346], "isController": false}, {"data": ["goToProfile", 12, 0, 0.0, 292.4166666666667, 222, 395, 299.0, 382.40000000000003, 395.0, 395.0, 0.08714723525396158, 0.19503874647779923, 0.05633932591613531], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e158011b-2d6d-475e-a9ef-04270da752d6", 1, 0, 0.0, 736.0, 736, 736, 736.0, 736.0, 736.0, 736.0, 1.358695652173913, 0.24546747622282608, 0.9367569633152174], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 127.83333333333334, 122, 135, 128.0, 132.3, 135.0, 135.0, 0.09517665845327355, 0.07073187215130973, 0.04777422113767832], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 168.05555555555554, 120, 389, 127.0, 380.0, 389.0, 389.0, 0.09517615520058374, 0.0334087306937813, 0.05383607824008714], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 847.75, 666, 1002, 861.5, 1002.0, 1002.0, 1002.0, 0.0816543164513034, 24.009080215159123, 0.04656847735113397], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0eaa70f7-d223-4666-94df-3ca8a19e97eb", 1, 0, 0.0, 544.0, 544, 544, 544.0, 544.0, 544.0, 544.0, 1.838235294117647, 0.33210305606617646, 1.2673770680147058], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1434.25, 1364, 1500, 1436.5, 1500.0, 1500.0, 1500.0, 0.08076565844203044, 72.67308143702297, 0.045982791866898194], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 253.25, 125, 384, 252.0, 384.0, 384.0, 384.0, 0.08306682726253271, 0.14698934667940358, 0.04599501079868754], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 8, 0, 0.0, 190.5, 122, 381, 129.0, 381.0, 381.0, 381.0, 0.03806695978225699, 0.028289996478806218, 0.019107829421953215], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 8, 0, 0.0, 219.25, 123, 377, 128.0, 377.0, 377.0, 377.0, 0.038068046633357125, 0.024480281941470377, 0.020911402569593146], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 8, 0, 0.0, 482.625, 123, 1368, 249.5, 1368.0, 1368.0, 1368.0, 0.03806877123523646, 8.571282361429674, 0.02156238995745815], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 8, 0, 0.0, 361.625, 126, 917, 247.5, 917.0, 917.0, 917.0, 0.038068046633357125, 2.8060128182250774, 0.02159915536521532], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 130.0, 128, 132, 130.0, 132.0, 132.0, 132.0, 0.08306510227390718, 0.061730998857854845, 0.046643001765133425], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 22, 0, 0.0, 776.5909090909089, 122, 1631, 400.5, 1593.7, 1625.8999999999999, 1631.0, 0.10176186797785292, 41.635646040422586, 0.05584977519878256], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 236.33333333333334, 122, 1376, 126.0, 484.1000000000014, 1376.0, 1376.0, 0.09505000686472272, 4.775649186596365, 0.05542521016612629], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 22, 0, 0.0, 503.90909090909105, 124, 1139, 377.5, 999.0, 1117.9999999999998, 1139.0, 0.10176233868356538, 13.615645525926269, 0.05594941081918683], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 175.22222222222223, 121, 1020, 125.5, 219.90000000000126, 1020.0, 1020.0, 0.09517766497461928, 1.578972262981176, 0.05559259663176819], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/196215b3-2539-47f2-91ce-9ed5578b401f", 3, 0, 0.0, 328.3333333333333, 235, 445, 305.0, 445.0, 445.0, 445.0, 0.08304038530738782, 0.03757361184155894, 0.05325180958839649], "isController": false}, {"data": ["deleteBooks", 12, 0, 0.0, 504.25, 226, 795, 458.0, 777.3000000000001, 795.0, 795.0, 0.08922198429693076, 0.01611920614739472, 0.061514375892219836], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 8, 0, 0.0, 708.125, 255, 1620, 506.0, 1620.0, 1620.0, 1620.0, 0.03804342657143129, 11.422510964234423, 0.08312711616560303], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/80b4cd51-6ce5-44ed-947d-b6e5e8948ac4", 1, 0, 0.0, 556.0, 556, 556, 556.0, 556.0, 556.0, 556.0, 1.7985611510791368, 0.5743452113309352, 1.0731649055755395], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 573.5909090909091, 168, 1084, 524.5, 961.4, 1065.6999999999998, 1084.0, 0.09886440746516152, 0.060728234663658794, 0.044701387359736125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 22, 0, 0.0, 145.86363636363637, 121, 487, 128.0, 154.1, 437.6499999999993, 487.0, 0.10176139727649496, 0.07562541340567644, 0.05107945136730314], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 22, 0, 0.0, 193.68181818181822, 122, 387, 127.0, 381.1, 386.25, 387.0, 0.10176280939363241, 0.09670357881298308, 0.054151835893593105], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/84dad0b7-4f10-479b-a65e-fe0bb90fa63a", 3, 0, 0.0, 363.6666666666667, 239, 427, 425.0, 427.0, 427.0, 427.0, 0.04054218414260038, 0.026064717995324133, 0.02599873136748787], "isController": false}, {"data": ["login", 22, 0, 0.0, 2662.5000000000005, 1739, 4920, 2613.5, 3663.8, 4732.649999999998, 4920.0, 0.09757438938390643, 21.36009412602176, 0.1766370182818924], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/23d6a56e-48b2-4979-aa36-ddc702901d57", 1, 0, 0.0, 957.0, 957, 957, 957.0, 957.0, 957.0, 957.0, 1.0449320794148382, 0.33368436520376177, 0.6234897466039707], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 176.83333333333337, 126, 394, 134.5, 394.0, 394.0, 394.0, 0.09793466669568435, 0.07928499872140853, 0.034812713551981546], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5372a280-744d-4a57-9d32-d3293fe5a2cb", 3, 0, 0.0, 327.6666666666667, 219, 411, 353.0, 411.0, 411.0, 411.0, 0.033324816991213355, 0.027781528748208793, 0.02137040672939138], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=285a253a-2ecf-43f1-bccc-a069ba3dd693", 1, 0, 0.0, 449.0, 449, 449, 449.0, 449.0, 449.0, 449.0, 2.2271714922048997, 0.40236984966592426, 1.5355303452115812], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 22, 0, 0.0, 936.1818181818184, 254, 1755, 713.5, 1724.5, 1751.1, 1755.0, 0.1017016535764311, 55.39076187829086, 0.21690152910747554], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/47913709-64e3-4238-8de2-184b9d787213", 3, 0, 0.0, 424.0, 267, 697, 308.0, 697.0, 697.0, 697.0, 0.022993086745251926, 0.027177050121096925, 0.014744915653693458], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=30cc4d78-32eb-4397-a896-1583667b376a", 1, 0, 0.0, 433.0, 433, 433, 433.0, 433.0, 433.0, 433.0, 2.3094688221709005, 0.417238019630485, 1.5922704965357968], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 447.09999999999997, 253, 1545, 264.5, 762.7, 1505.9499999999994, 1545.0, 0.12095993806851171, 7.413597985487832, 0.2704942990069189], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 0, 0.0, 1564.75, 1494, 1632, 1566.5, 1632.0, 1632.0, 1632.0, 0.08055583526331689, 96.37278471453025, 0.18164396838183466], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6534768f-55ab-4e48-bbf3-33cdf3dd7fef", 1, 0, 0.0, 616.0, 616, 616, 616.0, 616.0, 616.0, 616.0, 1.6233766233766236, 0.2932858157467533, 1.1192420860389611], "isController": false}, {"data": ["register", 22, 4, 18.181818181818183, 1045.318181818182, 196, 1833, 1055.0, 1646.5999999999997, 1820.2499999999998, 1833.0, 0.10280517951186231, 0.032674231414459076, 0.0463828056000785], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 133.60000000000002, 121, 161, 132.0, 149.6, 161.0, 161.0, 0.07213480552456432, 0.05600309608596545, 0.02564166915130997], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 408.88888888888886, 247, 1499, 259.0, 615.2000000000014, 1499.0, 1499.0, 0.0949868073878628, 6.452212854551451, 0.2122773746701847], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f0028a13-2e2c-46aa-8ec3-63e4a0eade2b", 1, 0, 0.0, 225.0, 225, 225, 225.0, 225.0, 225.0, 225.0, 4.444444444444445, 1.4192708333333333, 2.6519097222222223], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=196215b3-2539-47f2-91ce-9ed5578b401f", 1, 0, 0.0, 226.0, 226, 226, 226.0, 226.0, 226.0, 226.0, 4.424778761061947, 0.7993985066371682, 3.0506775442477876], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 612.0588235294117, 253, 1622, 505.0, 1545.1999999999998, 1622.0, 1622.0, 0.0968892840451846, 20.57894330480799, 0.2135315591908035], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 127.39999999999999, 123, 139, 126.0, 138.0, 139.0, 139.0, 0.052426013788041625, 0.03896112938740203, 0.02631540145220058], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 128.0, 122, 143, 127.0, 141.6, 143.0, 143.0, 0.05242683834708664, 0.014028275104591544, 0.02989968124482285], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 177.9, 125, 386, 127.0, 384.2, 386.0, 386.0, 0.05235547271756317, 0.014111436005905696, 0.030779291578098656], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 152.5, 121, 378, 127.0, 354.30000000000007, 378.0, 378.0, 0.052427388067526476, 0.014130819440075494, 0.030872768559295376], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b4d31130-1995-4745-98f7-cf0d5c26db30", 3, 0, 0.0, 400.3333333333333, 322, 446, 433.0, 446.0, 446.0, 446.0, 0.0362568434792067, 0.03022583859057564, 0.02325064506967357], "isController": false}, {"data": ["https://demoqa.com/books", 52, 0, 0.0, 1443.9038461538457, 972, 2133, 1377.0, 1990.1, 2065.5, 2133.0, 0.23710729104919975, 283.66275192649675, 0.46819427978660344], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 4, 18.181818181818183, 1045.318181818182, 196, 1833, 1055.0, 1646.5999999999997, 1820.2499999999998, 1833.0, 0.09771784416668887, 0.031057340386784992, 0.04408754297364283], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 1, 0, 0.0, 121.0, 121, 121, 121.0, 121.0, 121.0, 121.0, 8.264462809917356, 2.227530991735537, 4.86667097107438], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 1, 0, 0.0, 126.0, 126, 126, 126.0, 126.0, 126.0, 126.0, 7.936507936507936, 2.1391369047619047, 4.665798611111111], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 161.13333333333335, 124, 403, 126.0, 386.8, 403.0, 403.0, 0.07148507868124326, 0.019267462613303848, 0.04202540758409028], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 126.80000000000001, 123, 131, 126.0, 130.4, 131.0, 131.0, 0.07157034888159401, 0.019290445596992136, 0.042145430054298036], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 127.8, 125, 132, 127.0, 130.8, 132.0, 132.0, 0.07156898295703952, 0.05318749612334676, 0.035924274648357735], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 1, 0, 0.0, 122.0, 122, 122, 122.0, 122.0, 122.0, 122.0, 8.196721311475411, 2.1932633196721314, 4.67469262295082], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 167.46666666666667, 122, 516, 126.0, 422.40000000000003, 516.0, 516.0, 0.07157205636060865, 0.019151116643365985, 0.04081843839315962], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 1, 0, 0.0, 123.0, 123, 123, 123.0, 123.0, 123.0, 123.0, 8.130081300813009, 6.04198424796748, 4.080919715447155], "isController": false}, {"data": ["deleteAccount", 12, 0, 0.0, 578.25, 411, 1271, 462.0, 1149.2000000000005, 1271.0, 1271.0, 0.09021267638457664, 0.016298188604635427, 0.06140452679692374], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 1, 0, 0.0, 389.0, 389, 389, 389.0, 389.0, 389.0, 389.0, 2.5706940874035986, 2.023417416452442, 0.9138014138817481], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1416.3636363636363, 798, 2931, 1300.5, 2525.5999999999995, 2922.2999999999997, 2931.0, 0.09862021355758972, 0.051043665220236865, 0.04536144588439918], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 1, 0, 0.0, 250.0, 250, 250, 250.0, 250.0, 250.0, 250.0, 4.0, 6.19921875, 8.99609375], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9cbf7bb2-2964-4eec-8e0b-182ce40d7f5e", 3, 0, 0.0, 361.6666666666667, 269, 472, 344.0, 472.0, 472.0, 472.0, 0.024957364502308555, 0.02949875993095129, 0.01600455991847261], "isController": false}, {"data": ["addBook", 59, 4, 6.779661016949152, 1334.0677966101696, 647, 4524, 1031.0, 2196.0, 2297.0, 4524.0, 0.26986479316464496, 94.06938794865023, 0.9796043750686098], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6ac67a27-76d3-4ee3-a652-bb03ce5bd745", 1, 0, 0.0, 232.0, 232, 232, 232.0, 232.0, 232.0, 232.0, 4.310344827586206, 1.3764480064655171, 2.571895204741379], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0eaa70f7-d223-4666-94df-3ca8a19e97eb", 3, 0, 0.0, 628.0, 218, 1271, 395.0, 1271.0, 1271.0, 1271.0, 0.026041440612494686, 0.030780101192697983, 0.016699751955278168], "isController": false}, {"data": ["https://demoqa.com/books-0", 52, 0, 0.0, 229.40384615384613, 121, 597, 130.5, 513.4, 521.15, 597.0, 0.23859230539815093, 0.17731322696093052, 0.11533514762898897], "isController": false}, {"data": ["https://demoqa.com/books-3", 52, 0, 0.0, 810.9615384615381, 613, 1134, 758.0, 1039.4, 1107.35, 1134.0, 0.23839104383186097, 70.09488221419436, 0.11989393317715664], "isController": false}, {"data": ["https://demoqa.com/books-1", 52, 0, 0.0, 194.42307692307696, 122, 495, 130.0, 380.7, 397.1999999999998, 495.0, 0.23879061736558843, 0.4225474596352014, 0.11613059321099906], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7d1b4cb1-5ad8-40e3-9a81-5b8b5e7459a5", 1, 0, 0.0, 300.0, 300, 300, 300.0, 300.0, 300.0, 300.0, 3.3333333333333335, 1.064453125, 1.9889322916666667], "isController": false}, {"data": ["https://demoqa.com/books-2", 52, 0, 0.0, 1212.9807692307695, 842, 1613, 1189.5, 1489.2, 1549.05, 1613.0, 0.23771537241313104, 213.89670995638838, 0.11932197404330991], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 145.70588235294116, 125, 395, 129.0, 186.99999999999983, 395.0, 395.0, 0.09257998638529612, 0.06916375936010892, 0.03290929203539823], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 4, 2.3529411764705883, 200.4529411764707, 121, 2506, 134.0, 298.9, 377.9, 1479.3399999999885, 0.7238046578958572, 1.5264345036616, 0.3509338277557798], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 158.1, 129, 391, 132.0, 365.7000000000001, 391.0, 391.0, 0.05417235476391688, 0.0419518333279161, 0.01925657923248608], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c4408f01-0989-4bad-9cb2-b08842c12b8a", 3, 0, 0.0, 850.0, 333, 1695, 522.0, 1695.0, 1695.0, 1695.0, 0.03634997758418049, 0.030303480661811922, 0.023310369739855324], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/909bdb72-bf84-411f-9d8b-c56cb1116e7b", 1, 0, 0.0, 498.0, 498, 498, 498.0, 498.0, 498.0, 498.0, 2.008032128514056, 0.6412368222891567, 1.1981519829317269], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 146.29999999999998, 127, 379, 133.0, 153.90000000000003, 367.79999999999984, 379.0, 0.11647206126430422, 0.09451980752991876, 0.041402178027545644], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/285a253a-2ecf-43f1-bccc-a069ba3dd693", 3, 0, 0.0, 346.0, 290, 452, 296.0, 452.0, 452.0, 452.0, 0.01926757523988131, 0.022773621645836278, 0.012355834382345764], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=84dad0b7-4f10-479b-a65e-fe0bb90fa63a", 1, 0, 0.0, 444.0, 444, 444, 444.0, 444.0, 444.0, 444.0, 2.2522522522522523, 0.4069010416666667, 1.5528223536036037], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 309.0, 252, 512, 258.0, 511.1, 512.0, 512.0, 0.05231986271268024, 0.0810855684814683, 0.1176685974876002], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 332.6, 253, 647, 256.0, 578.6, 647.0, 647.0, 0.07144081842601589, 0.1107193152754758, 0.1606720750342916], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5372a280-744d-4a57-9d32-d3293fe5a2cb", 1, 0, 0.0, 429.0, 429, 429, 429.0, 429.0, 429.0, 429.0, 2.331002331002331, 0.4211283508158508, 1.6071168414918415], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e158011b-2d6d-475e-a9ef-04270da752d6", 3, 0, 0.0, 314.0, 229, 440, 273.0, 440.0, 440.0, 440.0, 0.029540643001329327, 0.02433833575402491, 0.018943706612180592], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 8, 0, 0.0, 131.0, 127, 134, 131.0, 134.0, 134.0, 134.0, 0.0394685558948755, 0.03272344136205986, 0.014029838228256526], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 22, 0, 0.0, 144.3181818181818, 123, 401, 130.0, 153.1, 363.9499999999995, 401.0, 0.10279317079552569, 0.07980524490472943, 0.03653975993122203], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 144.82352941176472, 125, 404, 128.0, 187.19999999999982, 404.0, 404.0, 0.09695946524003171, 0.07205679008560952, 0.048669106575562796], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6534768f-55ab-4e48-bbf3-33cdf3dd7fef", 3, 0, 0.0, 577.0, 222, 1018, 491.0, 1018.0, 1018.0, 1018.0, 0.019373086907667866, 0.022898332865150396, 0.012423496487013573], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 214.7058823529412, 123, 388, 128.0, 380.0, 388.0, 388.0, 0.09696057126887167, 0.05164398074477126, 0.05386079527630911], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 450.47058823529414, 122, 1490, 371.0, 1418.8, 1490.0, 1490.0, 0.09696112429275416, 15.41783805745517, 0.05553207773430371], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 286.235294117647, 124, 991, 128.0, 792.5999999999998, 991.0, 991.0, 0.09696167732294513, 5.05269038354047, 0.05562708360663218], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/30cc4d78-32eb-4397-a896-1583667b376a", 3, 0, 0.0, 485.0, 239, 865, 351.0, 865.0, 865.0, 865.0, 0.050136203352440796, 0.031188243687016393, 0.032151146030048296], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 50.0, 0.32051282051282054], "isController": false}, {"data": ["401/Unauthorized", 4, 50.0, 0.32051282051282054], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1248, 8, "406/Not Acceptable", 4, "401/Unauthorized", 4, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
