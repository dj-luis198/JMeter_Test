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

    var data = {"OkPercent": 98.89328063241106, "KoPercent": 1.1067193675889329};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7352141400407886, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/71566a3b-5c73-4f68-8334-204da4e95429"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/3cf933ac-3394-4606-80b0-8887e6ef3d57"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=949d2ce6-3d0a-423b-b559-4c80513988d5"], "isController": false}, {"data": [0.5384615384615384, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5384615384615384, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2fe3f964-3ef8-4d38-8a89-ed1523bdd59a"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9d675043-9e14-415a-b4ca-a10641422280"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a94dddff-fc55-4125-a8ec-821e20a89087"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dba3a080-ef15-4dd1-809a-031c8e52bb38"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5294117647058824, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.7333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c39d6216-0f36-4d81-8f0d-67076ede129c"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/dba3a080-ef15-4dd1-809a-031c8e52bb38"], "isController": false}, {"data": [0.6190476190476191, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9d675043-9e14-415a-b4ca-a10641422280"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=db1433bc-73fe-40f4-bf2c-d9544c745fe3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9c7485fe-a3cd-4d10-9550-f1921ba034ba"], "isController": false}, {"data": [0.47058823529411764, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b602ad3a-558a-48cb-a5bf-53f17826fd07"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/949d2ce6-3d0a-423b-b559-4c80513988d5"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a94dddff-fc55-4125-a8ec-821e20a89087"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3cf933ac-3394-4606-80b0-8887e6ef3d57"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/db1433bc-73fe-40f4-bf2c-d9544c745fe3"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5384615384615384, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7b4b8fd1-6ef0-452a-a878-09a5e1d36b32"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2fe3f964-3ef8-4d38-8a89-ed1523bdd59a"], "isController": false}, {"data": [0.3, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/f594a6f6-6783-45ec-8f91-cb5622c5b045"], "isController": false}, {"data": [0.9107142857142857, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=71566a3b-5c73-4f68-8334-204da4e95429"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c39d6216-0f36-4d81-8f0d-67076ede129c"], "isController": false}, {"data": [0.9821428571428571, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.3482142857142857, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9608433734939759, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9f703afd-81a7-4e50-96c3-edffaa8db536"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6e195dc3-734b-46b5-b292-b7db387a78f1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b602ad3a-558a-48cb-a5bf-53f17826fd07"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6c0b5e21-28e0-44e7-b0a0-3b0550660606"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7b4b8fd1-6ef0-452a-a878-09a5e1d36b32"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dbaa4c6b-9c1a-48fd-9edf-06ec69f552d4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9c7485fe-a3cd-4d10-9550-f1921ba034ba"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1265, 14, 1.1067193675889329, 485.46324110671935, 136, 2462, 162.0, 1325.0000000000005, 1642.700000000001, 2043.8599999999976, 5.026723093123522, 725.8740652505414, 3.668585060648507], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/71566a3b-5c73-4f68-8334-204da4e95429", 3, 0, 0.0, 517.6666666666666, 277, 817, 459.0, 817.0, 817.0, 817.0, 0.019141320368279004, 0.026387855390514834, 0.0122748701580435], "isController": false}, {"data": ["see books", 56, 0, 0.0, 2372.7678571428582, 1713, 3024, 2397.0, 2897.4, 2974.5, 3024.0, 0.24355026703547136, 293.07369780793886, 1.1975347602769515], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/3cf933ac-3394-4606-80b0-8887e6ef3d57", 3, 0, 0.0, 509.3333333333333, 331, 620, 577.0, 620.0, 620.0, 620.0, 0.0339735459322341, 0.021841716541719514, 0.021786421056803767], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=949d2ce6-3d0a-423b-b559-4c80513988d5", 1, 0, 0.0, 579.0, 579, 579, 579.0, 579.0, 579.0, 579.0, 1.7271157167530224, 0.31202774179620035, 1.1907653281519863], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 602.0, 154, 821, 583.0, 818.6, 821.0, 821.0, 0.07995522507395858, 0.015147767250339809, 0.05405026070016175], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 602.0, 154, 821, 583.0, 818.6, 821.0, 821.0, 0.07914619519887003, 0.014994494012285926, 0.05350335115644768], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 22, 0, 0.0, 220.54545454545453, 138, 445, 145.0, 438.2, 444.7, 445.0, 0.12569561093780351, 0.042214710243049604, 0.07120593868910904], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 22, 0, 0.0, 174.04545454545456, 141, 443, 148.0, 353.9999999999998, 441.79999999999995, 443.0, 0.12568771174094617, 0.09340659046373052, 0.06308933968246713], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2fe3f964-3ef8-4d38-8a89-ed1523bdd59a", 1, 0, 0.0, 606.0, 606, 606, 606.0, 606.0, 606.0, 606.0, 1.6501650165016502, 0.29812551567656764, 1.1377114273927393], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 22, 0, 0.0, 267.4090909090909, 136, 1106, 148.5, 444.1, 1006.8499999999985, 1106.0, 0.12569345651292071, 1.7122497379005766, 0.07352576215941359], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 22, 0, 0.0, 248.0, 139, 1277, 145.0, 446.09999999999997, 1152.9499999999982, 1277.0, 0.12569561093780351, 5.173299475863586, 0.07340427279375634], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9d675043-9e14-415a-b4ca-a10641422280", 1, 0, 0.0, 1765.0, 1765, 1765, 1765.0, 1765.0, 1765.0, 1765.0, 0.56657223796034, 0.10235924220963173, 0.390625], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 245.84615384615387, 141, 331, 248.0, 311.4, 331.0, 331.0, 0.08074935400516796, 0.17675446411933513, 0.052197129748683166], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 12, 0, 0.0, 145.25, 143, 152, 144.5, 151.4, 152.0, 152.0, 0.10906810394190306, 0.08105549521463694, 0.05474707561146306], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 12, 0, 0.0, 144.08333333333331, 140, 150, 143.0, 149.7, 150.0, 150.0, 0.10907107798582076, 0.04283667174150155, 0.06144124363752045], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 1054.75, 819, 1138, 1131.0, 1138.0, 1138.0, 1138.0, 0.03878110972145468, 11.402933912141396, 0.022117351638017122], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1398.75, 1182, 1607, 1403.0, 1607.0, 1607.0, 1607.0, 0.038764573056683495, 34.88043097725489, 0.02207006454301414], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a94dddff-fc55-4125-a8ec-821e20a89087", 1, 0, 0.0, 235.0, 235, 235, 235.0, 235.0, 235.0, 235.0, 4.25531914893617, 0.7687832446808511, 2.9338430851063833], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 363.5, 149, 444, 430.5, 444.0, 444.0, 444.0, 0.03904762834467341, 0.06909599859428539, 0.02162109889788069], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 204.93333333333334, 138, 445, 147.0, 443.8, 445.0, 445.0, 0.0739531925593228, 0.0549593550172311, 0.037121036108878826], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 220.86666666666665, 137, 434, 148.0, 432.8, 434.0, 434.0, 0.07395647414974707, 0.01978913468460029, 0.04217830166352762], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 203.26666666666665, 139, 444, 147.0, 436.2, 444.0, 444.0, 0.07395574488226246, 0.0199333843627973, 0.04347788908117382], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dba3a080-ef15-4dd1-809a-031c8e52bb38", 1, 0, 0.0, 474.0, 474, 474, 474.0, 474.0, 474.0, 474.0, 2.109704641350211, 0.3811478111814346, 1.4545424578059072], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 219.33333333333331, 136, 442, 147.0, 434.2, 442.0, 442.0, 0.07395683878888282, 0.01993367920481607, 0.04355075565400032], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 145.5, 138, 149, 147.5, 149.0, 149.0, 149.0, 0.03915656753528986, 0.029099753803081625, 0.021987330403116862], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 984.6470588235296, 138, 1857, 1287.0, 1780.1999999999998, 1857.0, 1857.0, 0.09000375898052214, 47.64854218727665, 0.04836254374447403], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 12, 0, 0.0, 298.8333333333333, 141, 1694, 146.5, 1317.5000000000014, 1694.0, 1694.0, 0.10755483055632736, 8.09140907191385, 0.06246022711995053], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 700.5294117647059, 142, 1268, 880.0, 1193.6, 1268.0, 1268.0, 0.09000185297932604, 15.576772904148028, 0.04844941200995315], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 12, 0, 0.0, 322.83333333333337, 140, 1143, 144.0, 934.5000000000007, 1143.0, 1143.0, 0.10808863267879662, 2.6751760662493247, 0.06287577688704737], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 591.6923076923077, 235, 1765, 507.0, 1318.5999999999995, 1765.0, 1765.0, 0.07914571334640252, 0.014994402723830166, 0.05413324218892691], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 503.6, 278, 890, 560.0, 883.4, 890.0, 890.0, 0.0739021830704879, 0.1145339497391253, 0.166207741807943], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c39d6216-0f36-4d81-8f0d-67076ede129c", 1, 0, 0.0, 520.0, 520, 520, 520.0, 520.0, 520.0, 520.0, 1.9230769230769231, 0.3474308894230769, 1.3258713942307692], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dba3a080-ef15-4dd1-809a-031c8e52bb38", 3, 0, 0.0, 436.3333333333333, 252, 530, 527.0, 530.0, 530.0, 530.0, 0.0300519899426007, 0.02475963103669348, 0.019271621154597456], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 696.190476190476, 265, 1390, 709.0, 940.8000000000001, 1346.0999999999995, 1390.0, 0.09473199866472992, 0.058189870273549923, 0.04283292517750972], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 145.35294117647058, 139, 152, 144.0, 151.2, 152.0, 152.0, 0.09000518853439787, 0.06688862155730155, 0.04517838565105518], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 248.05882352941177, 138, 441, 149.0, 439.4, 441.0, 441.0, 0.09000661813368631, 0.10360481469225678, 0.04688534083388485], "isController": false}, {"data": ["login", 21, 0, 0.0, 2740.857142857142, 1654, 3928, 2795.0, 3768.0, 3913.7999999999997, 3928.0, 0.09483081730617259, 21.741490698112866, 0.17303184424489831], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 12, 0, 0.0, 173.41666666666666, 145, 432, 151.0, 350.7000000000003, 432.0, 432.0, 0.11289654912881497, 0.09139769455838632, 0.04013119519813344], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9d675043-9e14-415a-b4ca-a10641422280", 3, 0, 0.0, 373.3333333333333, 247, 626, 247.0, 626.0, 626.0, 626.0, 0.02386824727504177, 0.024093566015593922, 0.015306135134059989], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=db1433bc-73fe-40f4-bf2c-d9544c745fe3", 1, 0, 0.0, 498.0, 498, 498, 498.0, 498.0, 498.0, 498.0, 2.008032128514056, 0.3627792419678715, 1.3844440261044177], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9c7485fe-a3cd-4d10-9550-f1921ba034ba", 1, 0, 0.0, 450.0, 450, 450, 450.0, 450.0, 450.0, 450.0, 2.2222222222222223, 0.4014756944444444, 1.5321180555555556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 1133.4705882352941, 287, 2001, 1439.0, 1929.0, 2001.0, 2001.0, 0.08993471797530497, 63.347503493236374, 0.1887296175526118], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b602ad3a-558a-48cb-a5bf-53f17826fd07", 3, 0, 0.0, 531.0, 222, 908, 463.0, 908.0, 908.0, 908.0, 0.055062036561192275, 0.03539958405219881, 0.03530996485206666], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 22, 0, 0.0, 502.4545454545455, 282, 1422, 433.0, 885.7, 1341.599999999999, 1422.0, 0.1255851124557598, 7.015033420981276, 0.2809833100239753], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, 33.333333333333336, 1078.1666666666667, 141, 1756, 1397.5, 1756.0, 1756.0, 1756.0, 0.05806301772857475, 46.31421558072695, 0.10010767363261594], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/949d2ce6-3d0a-423b-b559-4c80513988d5", 3, 0, 0.0, 599.6666666666666, 248, 1013, 538.0, 1013.0, 1013.0, 1013.0, 0.0162405331225673, 0.022388885994164234, 0.01041466479539635], "isController": false}, {"data": ["register", 22, 5, 22.727272727272727, 1166.409090909091, 340, 2462, 1088.5, 1810.1, 2365.2499999999986, 2462.0, 0.09579670198081452, 0.030293665878521073, 0.04322077765150031], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 152.66666666666666, 146, 160, 153.0, 158.8, 160.0, 160.0, 0.06529603043665633, 0.050693695505021265, 0.023210698319280174], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 12, 0, 0.0, 541.3333333333333, 289, 1837, 436.0, 1463.5000000000014, 1837.0, 1837.0, 0.10741426998576761, 10.861332722974122, 0.2392869650545575], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a94dddff-fc55-4125-a8ec-821e20a89087", 3, 0, 0.0, 460.66666666666663, 232, 902, 248.0, 902.0, 902.0, 902.0, 0.07634947700608251, 0.03454615007762197, 0.04896109039778078], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 663.0625000000001, 289, 1828, 579.0, 1750.3000000000002, 1828.0, 1828.0, 0.10688185546901095, 16.12842241128806, 0.23696145740090047], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 6, 0, 0.0, 146.33333333333334, 140, 152, 145.5, 152.0, 152.0, 152.0, 0.05078548212351029, 0.03774194521092904, 0.025491931456527627], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 6, 0, 0.0, 193.83333333333334, 139, 443, 144.5, 443.0, 443.0, 443.0, 0.05078591198801452, 0.026302208975563512, 0.028252969917811465], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 6, 0, 0.0, 463.1666666666667, 140, 1760, 146.5, 1760.0, 1760.0, 1760.0, 0.05010061874264147, 7.524690537350011, 0.028736097078298918], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 6, 0, 0.0, 316.33333333333337, 138, 1168, 148.0, 1168.0, 1168.0, 1168.0, 0.050349509511861505, 2.478713564787231, 0.02892802222930845], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 462.0, 462, 462, 462.0, 462.0, 462.0, 462.0, 2.1645021645021645, 0.6383590367965367, 1.3380174512987013], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1637.321428571429, 1112, 2392, 1524.5, 2293.9, 2352.6, 2392.0, 0.24755101319093253, 296.157074433285, 0.4888165514375641], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, 22.727272727272727, 1166.409090909091, 340, 2462, 1088.5, 1810.1, 2365.2499999999986, 2462.0, 0.09311381047107124, 0.02944525860244635, 0.04201033245862784], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3cf933ac-3394-4606-80b0-8887e6ef3d57", 1, 0, 0.0, 520.0, 520, 520, 520.0, 520.0, 520.0, 520.0, 1.9230769230769231, 0.3474308894230769, 1.3258713942307692], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 144.875, 138, 149, 147.5, 149.0, 149.0, 149.0, 0.04147785600962286, 0.011179578377593662, 0.02442494841191659], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 144.62499999999997, 137, 150, 144.5, 150.0, 150.0, 150.0, 0.04147871623373257, 0.01117981023487323, 0.024384948410846683], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/db1433bc-73fe-40f4-bf2c-d9544c745fe3", 3, 0, 0.0, 501.0, 248, 948, 307.0, 948.0, 948.0, 948.0, 0.031089693766516397, 0.02591819848178662, 0.01993707575522048], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 256.8, 138, 1554, 145.0, 878.4000000000003, 1554.0, 1554.0, 0.0652307210603906, 3.929390768167843, 0.037974811700651874], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 231.86666666666665, 137, 886, 146.0, 612.4000000000001, 886.0, 886.0, 0.06514940931202223, 1.2934617817277623, 0.03799109760467338], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 148.4, 139, 158, 149.0, 156.8, 158.0, 158.0, 0.06522930274223988, 0.048476073619965386, 0.032742052353038384], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 147.5, 139, 151, 149.0, 151.0, 151.0, 151.0, 0.04147764095917045, 0.01109850939727803, 0.023655217109526897], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 233.53333333333333, 138, 595, 148.0, 519.4000000000001, 595.0, 595.0, 0.06515223906528254, 0.023957021239629936, 0.036792351670069064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 145.625, 139, 150, 147.5, 150.0, 150.0, 150.0, 0.04147979156404739, 0.030826290410390686, 0.020820910999922223], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 234.125, 152, 455, 157.0, 455.0, 455.0, 455.0, 0.0436126542116195, 0.03432792899859895, 0.01550293567678662], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 710.7692307692307, 149, 1397, 626.0, 1257.3999999999999, 1397.0, 1397.0, 0.07713073659853452, 0.01445042496069299, 0.05249432644100982], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/7b4b8fd1-6ef0-452a-a878-09a5e1d36b32", 3, 0, 0.0, 529.0, 257, 1048, 282.0, 1048.0, 1048.0, 1048.0, 0.03583844031107766, 0.023040663936972128, 0.022982333142194986], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1406.095238095238, 1001, 2179, 1310.0, 1830.2, 2145.1999999999994, 2179.0, 0.09515006524575903, 0.04924759236352762, 0.043765313213625485], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 295.75, 289, 302, 298.0, 302.0, 302.0, 302.0, 0.041447555889438645, 0.06423561640287025, 0.09321652462243868], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2fe3f964-3ef8-4d38-8a89-ed1523bdd59a", 3, 0, 0.0, 428.0, 242, 724, 318.0, 724.0, 724.0, 724.0, 0.03058353382538841, 0.025496233765240794, 0.01961248751172369], "isController": false}, {"data": ["addBook", 55, 5, 9.090909090909092, 1442.1818181818182, 744, 2604, 1166.0, 2473.4, 2573.2, 2604.0, 0.2564210153339767, 90.24061979873281, 0.9303274962585842], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f594a6f6-6783-45ec-8f91-cb5622c5b045", 1, 0, 0.0, 531.0, 531, 531, 531.0, 531.0, 531.0, 531.0, 1.8832391713747645, 0.6013859463276836, 1.1236905602636533], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 271.83928571428567, 139, 912, 150.0, 585.2, 601.3, 912.0, 0.24904717220277778, 0.1850829082483534, 0.1203890139066162], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=71566a3b-5c73-4f68-8334-204da4e95429", 1, 0, 0.0, 649.0, 649, 649, 649.0, 649.0, 649.0, 649.0, 1.5408320493066257, 0.2783729776579353, 1.062331471494607], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 944.7321428571424, 681, 1422, 879.5, 1186.0, 1320.45, 1422.0, 0.24933991709447756, 73.31421449021119, 0.1254004465856015], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c39d6216-0f36-4d81-8f0d-67076ede129c", 3, 0, 0.0, 670.6666666666667, 257, 1397, 358.0, 1397.0, 1397.0, 1397.0, 0.019245943917319427, 0.026532087399038985, 0.01234196273343726], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 223.48214285714295, 140, 596, 149.0, 442.6, 467.04999999999984, 596.0, 0.24994867125501014, 0.44229198468171715, 0.12155706863769047], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1354.142857142857, 955, 1770, 1340.5, 1747.2, 1761.5, 1770.0, 0.2485960979291057, 223.68720590193774, 0.12478358821832065], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 168.9375, 144, 430, 152.0, 240.30000000000018, 430.0, 430.0, 0.11171936096525528, 0.08346221790861356, 0.039712741593118085], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 166, 5, 3.0120481927710845, 206.02409638554218, 139, 1328, 152.0, 326.7000000000001, 365.1500000000001, 840.2400000000091, 0.6738735959275302, 1.5053136683689419, 0.3219793603376675], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 6, 0, 0.0, 150.16666666666666, 149, 151, 150.0, 151.0, 151.0, 151.0, 0.05437146585471944, 0.042106027756633316, 0.0193273570030448], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9f703afd-81a7-4e50-96c3-edffaa8db536", 1, 0, 0.0, 313.0, 313, 313, 313.0, 313.0, 313.0, 313.0, 3.1948881789137378, 1.0202426118210863, 1.9063248801916932], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 22, 0, 0.0, 149.77272727272725, 143, 162, 149.5, 154.7, 160.95, 162.0, 0.1261793467351094, 0.10239749720398039, 0.04485281465974592], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6e195dc3-734b-46b5-b292-b7db387a78f1", 1, 0, 0.0, 288.0, 288, 288, 288.0, 288.0, 288.0, 288.0, 3.472222222222222, 1.1088053385416667, 2.071804470486111], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b602ad3a-558a-48cb-a5bf-53f17826fd07", 1, 0, 0.0, 507.0, 507, 507, 507.0, 507.0, 507.0, 507.0, 1.9723865877712032, 0.3563393737672584, 1.3598680966469427], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 6, 0, 0.0, 613.5, 290, 1905, 299.0, 1905.0, 1905.0, 1905.0, 0.05003961469496685, 10.042088984508569, 0.11040641549560068], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6c0b5e21-28e0-44e7-b0a0-3b0550660606", 1, 0, 0.0, 234.0, 234, 234, 234.0, 234.0, 234.0, 234.0, 4.273504273504274, 1.3646834935897436, 2.549913194444444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 468.2, 287, 1706, 301.0, 1053.8000000000004, 1706.0, 1706.0, 0.06510784028612726, 5.2869516156510565, 0.14531849534695968], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7b4b8fd1-6ef0-452a-a878-09a5e1d36b32", 1, 0, 0.0, 427.0, 427, 427, 427.0, 427.0, 427.0, 427.0, 2.34192037470726, 0.42310084894613587, 1.6146443208430914], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dbaa4c6b-9c1a-48fd-9edf-06ec69f552d4", 1, 0, 0.0, 239.0, 239, 239, 239.0, 239.0, 239.0, 239.0, 4.184100418410042, 1.3361336297071131, 2.496567730125523], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 149.53333333333333, 140, 162, 148.0, 158.4, 162.0, 162.0, 0.07293662293710919, 0.060471868040630566, 0.02592669018467553], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 168.64705882352945, 145, 418, 152.0, 229.19999999999982, 418.0, 418.0, 0.08619334688765964, 0.0669176863043842, 0.030639041276472767], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 182.8125, 141, 432, 146.5, 430.6, 432.0, 432.0, 0.10698834495717123, 0.07950989307852276, 0.05370313408983009], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 271.24999999999994, 137, 443, 155.5, 441.6, 443.0, 443.0, 0.10698834495717123, 0.04871417562136825, 0.05989362182294766], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 422.31249999999994, 140, 1687, 150.0, 1607.2, 1687.0, 1687.0, 0.10698548340722018, 12.058447193469874, 0.06174650458365931], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9c7485fe-a3cd-4d10-9550-f1921ba034ba", 3, 0, 0.0, 367.3333333333333, 217, 478, 407.0, 478.0, 478.0, 478.0, 0.018685651288375654, 0.025759678778082978, 0.011982660494173193], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 309.00000000000006, 139, 1173, 147.0, 949.0000000000002, 1173.0, 1173.0, 0.10698834495717123, 3.9574978351577075, 0.06185263692836462], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 35.714285714285715, 0.3952569169960474], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 7.142857142857143, 0.07905138339920949], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 7.142857142857143, 0.07905138339920949], "isController": false}, {"data": ["401/Unauthorized", 7, 50.0, 0.5533596837944664], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1265, 14, "401/Unauthorized", 7, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 166, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
