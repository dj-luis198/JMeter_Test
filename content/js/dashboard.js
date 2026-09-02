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

    var data = {"OkPercent": 98.22294022617125, "KoPercent": 1.7770597738287561};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7365853658536585, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/76595450-a077-41a9-ae3b-4c325727e3bc"], "isController": false}, {"data": [0.5416666666666666, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5416666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cffead1d-f7af-434a-8dd2-a9172c376143"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9394a8c3-0a0e-4cd4-b3c6-bda97aa0b593"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a9ea0fcf-429b-4d23-a9e6-e7568eab4511"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ac085db0-8ce2-4b0d-a3e1-231deee54922"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a8e7e80b-bf82-4608-a1a1-f57ed57173af"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7105263157894737, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.5909090909090909, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.7333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=54ce7a47-57cc-4cbc-a277-fa3c935bb591"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c12141bf-46b1-438e-b44e-6e9cc5adc289"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bc8e7949-559b-436f-ab01-856afd683796"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/59912be3-bfc1-4ef0-9e40-e899609ec981"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/50d0bb07-f638-4cef-a912-4440d1c50ae8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=75782007-2a58-46c6-bce2-b9092aa74d35"], "isController": false}, {"data": [0.5789473684210527, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8611111111111112, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.125, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "register"], "isController": true}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ac085db0-8ce2-4b0d-a3e1-231deee54922"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/873dd216-7ab7-46fb-be9f-7c0052569ae6"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.2962962962962963, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.19047619047619047, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/696f7f9f-a2f1-433e-a1ae-890d80ef82aa"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3b5ccf6f-b52b-4bc3-a872-e84e73242c0b"], "isController": false}, {"data": [0.2545454545454545, 500, 1500, "addBook"], "isController": true}, {"data": [0.9074074074074074, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9907407407407407, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4351851851851852, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9237804878048781, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a9ea0fcf-429b-4d23-a9e6-e7568eab4511"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3b5ccf6f-b52b-4bc3-a872-e84e73242c0b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a8e7e80b-bf82-4608-a1a1-f57ed57173af"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c12141bf-46b1-438e-b44e-6e9cc5adc289"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/51817f62-047f-4bcf-b261-d7e5745b0b82"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/54ce7a47-57cc-4cbc-a277-fa3c935bb591"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bc8e7949-559b-436f-ab01-856afd683796"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=59912be3-bfc1-4ef0-9e40-e899609ec981"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/75782007-2a58-46c6-bce2-b9092aa74d35"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=873dd216-7ab7-46fb-be9f-7c0052569ae6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1238, 22, 1.7770597738287561, 448.9515347334408, 125, 2855, 151.5, 1253.4000000000005, 1507.05, 2086.2499999999973, 4.832313265051211, 684.9080108863665, 3.533082457444026], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 2153.518518518519, 1562, 2920, 2142.5, 2551.5, 2675.25, 2920.0, 0.25241547587328744, 303.7420557779772, 1.241124922873049], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/76595450-a077-41a9-ae3b-4c325727e3bc", 1, 0, 0.0, 304.0, 304, 304, 304.0, 304.0, 304.0, 304.0, 3.289473684210526, 1.0504471628289473, 1.9627621299342106], "isController": false}, {"data": ["deleteBook", 12, 2, 16.666666666666668, 520.6666666666666, 135, 1059, 517.5, 928.2000000000005, 1059.0, 1059.0, 0.0680750641040187, 0.013595068954367014, 0.04572685376908938], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 2, 16.666666666666668, 520.6666666666666, 135, 1059, 517.5, 928.2000000000005, 1059.0, 1059.0, 0.06847282769954123, 0.013674505141168145, 0.04599403644466254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 190.6111111111111, 125, 428, 131.0, 399.20000000000005, 428.0, 428.0, 0.10965246261155615, 0.0293406003472328, 0.06253617008315311], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 147.05555555555557, 127, 394, 132.0, 168.10000000000036, 394.0, 394.0, 0.10982038266302226, 0.08161456172515619, 0.05512468426639985], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 165.33333333333334, 127, 508, 130.0, 391.9000000000002, 508.0, 508.0, 0.10982373290868157, 0.02960092801054308, 0.06467159271868651], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 175.11111111111111, 128, 392, 133.0, 390.2, 392.0, 392.0, 0.10965313059687855, 0.02955494535618992, 0.06446404747980555], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cffead1d-f7af-434a-8dd2-a9172c376143", 1, 0, 0.0, 288.0, 288, 288, 288.0, 288.0, 288.0, 288.0, 3.472222222222222, 1.1088053385416667, 2.071804470486111], "isController": false}, {"data": ["goToProfile", 12, 2, 16.666666666666668, 226.08333333333334, 129, 285, 238.0, 276.90000000000003, 285.0, 285.0, 0.06857103673693293, 0.12161202828840978, 0.044318943177467554], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/9394a8c3-0a0e-4cd4-b3c6-bda97aa0b593", 1, 0, 0.0, 316.0, 316, 316, 316.0, 316.0, 316.0, 316.0, 3.1645569620253164, 1.0105567642405062, 1.8882268591772151], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a9ea0fcf-429b-4d23-a9e6-e7568eab4511", 1, 0, 0.0, 622.0, 622, 622, 622.0, 622.0, 622.0, 622.0, 1.607717041800643, 0.2904566921221865, 1.108445538585209], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 147.875, 126, 379, 133.0, 211.70000000000016, 379.0, 379.0, 0.10791560999298548, 0.08019900312955268, 0.05416857767226029], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 162.25, 126, 392, 130.0, 385.0, 392.0, 392.0, 0.10792288909574109, 0.049139694375868445, 0.06041679313880233], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 1023.0, 1012, 1040, 1020.0, 1040.0, 1040.0, 1040.0, 0.04098091928398138, 12.049750964076127, 0.02337193052914563], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1372.0, 1125, 1558, 1398.0, 1558.0, 1558.0, 1558.0, 0.0408249914267518, 36.73439904847151, 0.023243134767379197], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 236.0, 128, 395, 132.0, 395.0, 395.0, 395.0, 0.04128819157720892, 0.07306074525185798, 0.022861723265895955], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 148.0, 127, 385, 131.0, 235.00000000000009, 385.0, 385.0, 0.0718955501447497, 0.053430189121244656, 0.03608819606875132], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ac085db0-8ce2-4b0d-a3e1-231deee54922", 1, 0, 0.0, 583.0, 583, 583, 583.0, 583.0, 583.0, 583.0, 1.7152658662092624, 0.3098868996569468, 1.182595411663808], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 232.86666666666665, 126, 395, 132.0, 392.0, 395.0, 395.0, 0.07181087886940953, 0.01921502032247872, 0.04095464185521012], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 197.73333333333332, 128, 392, 131.0, 387.8, 392.0, 392.0, 0.07180950374845609, 0.01935490530720106, 0.0422161340396197], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 221.6, 129, 439, 133.0, 412.0, 439.0, 439.0, 0.07189761779226382, 0.019378654795571108, 0.04233814797728035], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a8e7e80b-bf82-4608-a1a1-f57ed57173af", 3, 0, 0.0, 475.66666666666663, 249, 915, 263.0, 915.0, 915.0, 915.0, 0.02733584823137062, 0.027415933724235963, 0.017529824549414104], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 131.0, 127, 139, 130.0, 139.0, 139.0, 139.0, 0.04128955539406752, 0.030684913725474, 0.023185053077723457], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 282.4375, 127, 1127, 132.0, 1074.5, 1127.0, 1127.0, 0.10792216114127685, 12.164021133351321, 0.06228710667431116], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 760.684210526316, 128, 1533, 1045.0, 1485.0, 1533.0, 1533.0, 0.09286639458442289, 43.99151181297197, 0.05039491128815465], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 300.25, 129, 1044, 132.5, 1023.7, 1044.0, 1044.0, 0.10791852151625522, 3.9919050569944696, 0.06239039525158506], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 586.2631578947368, 129, 1053, 757.0, 1045.0, 1053.0, 1053.0, 0.09286503289377218, 14.383121108221976, 0.05048486086129874], "isController": false}, {"data": ["deleteBooks", 11, 1, 9.090909090909092, 563.0, 161, 1474, 540.0, 1327.0000000000005, 1474.0, 1474.0, 0.08593481453704571, 0.016417943970500923, 0.05869109803209275], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 422.20000000000005, 261, 776, 516.0, 651.2, 776.0, 776.0, 0.07176312427937863, 0.11121882639782606, 0.16139694845254784], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 760.5238095238094, 357, 1328, 732.0, 1229.2, 1319.6, 1328.0, 0.09038166887599636, 0.05551764621386885, 0.040865930360924126], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 132.73684210526315, 128, 146, 131.0, 142.0, 146.0, 146.0, 0.09286684849018055, 0.06901530439553458, 0.04661480480854766], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=54ce7a47-57cc-4cbc-a277-fa3c935bb591", 1, 0, 0.0, 1474.0, 1474, 1474, 1474.0, 1474.0, 1474.0, 1474.0, 0.6784260515603798, 0.1225672065807327, 0.46774296132971505], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 218.4736842105263, 126, 509, 132.0, 396.0, 509.0, 509.0, 0.09286503289377218, 0.09825861262084673, 0.048857240784367394], "isController": false}, {"data": ["login", 21, 0, 0.0, 3129.428571428571, 2039, 5359, 3018.0, 4494.6, 5285.299999999999, 5359.0, 0.08836896145430062, 25.29294820290145, 0.16821909584876285], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 188.62499999999997, 132, 426, 142.0, 401.5, 426.0, 426.0, 0.10739047849170073, 0.08694014323205068, 0.03817395915134674], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c12141bf-46b1-438e-b44e-6e9cc5adc289", 3, 0, 0.0, 354.0, 224, 604, 234.0, 604.0, 604.0, 604.0, 0.07595705894267775, 0.03436859112315171, 0.04870944209540206], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bc8e7949-559b-436f-ab01-856afd683796", 1, 0, 0.0, 488.0, 488, 488, 488.0, 488.0, 488.0, 488.0, 2.0491803278688527, 0.3702132428278689, 1.412813780737705], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/59912be3-bfc1-4ef0-9e40-e899609ec981", 3, 0, 0.0, 403.3333333333333, 258, 523, 429.0, 523.0, 523.0, 523.0, 0.0779848709350386, 0.03528612324209103, 0.05000982934310744], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/50d0bb07-f638-4cef-a912-4440d1c50ae8", 1, 0, 0.0, 419.0, 419, 419, 419.0, 419.0, 419.0, 419.0, 2.3866348448687353, 0.7621382756563246, 1.4240565334128878], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=75782007-2a58-46c6-bce2-b9092aa74d35", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 0.7140872035573123, 2.7251111660079053], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 908.4210526315787, 262, 1665, 1179.0, 1615.0, 1665.0, 1665.0, 0.09280606463209722, 58.50408739736382, 0.19622548729289593], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 361.00000000000006, 256, 791, 267.5, 657.8000000000002, 791.0, 791.0, 0.10956369302687963, 0.1698023250328691, 0.24641131351650758], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 3, 37.5, 1021.875, 129, 1686, 1332.5, 1686.0, 1686.0, 1686.0, 0.06406509013157367, 47.909003672731494, 0.1060687033025554], "isController": false}, {"data": ["register", 21, 5, 23.80952380952381, 1512.7619047619046, 447, 2855, 1465.0, 2459.2, 2816.1999999999994, 2855.0, 0.09288377585817974, 0.02933717474092061, 0.04190654731101469], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 489.56250000000006, 259, 1507, 276.0, 1283.7000000000003, 1507.0, 1507.0, 0.10781816466529198, 16.269711034683755, 0.23903729329236242], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 154.07142857142858, 131, 396, 135.0, 270.5, 396.0, 396.0, 0.0684104824404951, 0.053111653847845317, 0.024317788680019742], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ac085db0-8ce2-4b0d-a3e1-231deee54922", 3, 0, 0.0, 388.3333333333333, 240, 616, 309.0, 616.0, 616.0, 616.0, 0.018758675887598015, 0.02217211983980091, 0.012029489420106801], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/873dd216-7ab7-46fb-be9f-7c0052569ae6", 3, 0, 0.0, 351.6666666666667, 254, 516, 285.0, 516.0, 516.0, 516.0, 0.017150893561554557, 0.02364389135194777, 0.010998457134200024], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 434.5000000000001, 262, 784, 418.5, 782.5, 784.0, 784.0, 0.10945623705093624, 0.16963578925765216, 0.2461696425081115], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 130.85714285714286, 127, 136, 131.0, 136.0, 136.0, 136.0, 0.048200403506235064, 0.035820807683832896, 0.02419434316621565], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 131.57142857142858, 127, 139, 130.0, 139.0, 139.0, 139.0, 0.048201731130743754, 0.012897728837718543, 0.027490049785502294], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 168.57142857142858, 129, 392, 131.0, 392.0, 392.0, 392.0, 0.04820106730934756, 0.012991693923222586, 0.02833695558615941], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 166.28571428571428, 127, 386, 129.0, 386.0, 386.0, 386.0, 0.048201731130743754, 0.012991872843833276, 0.028384417843592268], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 161.0, 161, 161, 161.0, 161.0, 161.0, 161.0, 6.211180124223602, 1.8318128881987576, 3.8395283385093166], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1449.7592592592587, 1020, 2352, 1304.0, 2003.0, 2097.25, 2352.0, 0.2469339040250226, 295.41879732899827, 0.48759800189315994], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 5, 23.80952380952381, 1512.7619047619046, 447, 2855, 1465.0, 2459.2, 2816.1999999999994, 2855.0, 0.08900454770855672, 0.028111927457055305, 0.04015634867319649], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 131.66666666666669, 129, 133, 132.0, 133.0, 133.0, 133.0, 0.04231580283656931, 0.011405431233294074, 0.024918387803175096], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 130.83333333333334, 127, 134, 131.0, 134.0, 134.0, 134.0, 0.04231520596926506, 0.011405270358903472, 0.024876712884274964], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 366.0714285714286, 127, 1545, 131.0, 1406.5, 1545.0, 1545.0, 0.06734622211746143, 8.672451501700492, 0.038765417474420465], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 347.5, 127, 1025, 257.5, 1013.0, 1025.0, 1025.0, 0.06726274268637786, 2.840893735676639, 0.03878305183074772], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 173.92857142857142, 128, 461, 131.0, 431.0, 461.0, 461.0, 0.06734330655635191, 0.05004712528260138, 0.033803183173793834], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 130.66666666666666, 128, 135, 129.5, 135.0, 135.0, 135.0, 0.042316399720711766, 0.011322942894018579, 0.02413357171571843], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 184.7857142857143, 127, 390, 130.5, 388.0, 390.0, 390.0, 0.06726338901781038, 0.03243056256215858, 0.037554141022499606], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 134.0, 130, 140, 134.0, 140.0, 140.0, 140.0, 0.0423143106998787, 0.03144647504160907, 0.02123980048802505], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 140.66666666666666, 132, 158, 138.5, 158.0, 158.0, 158.0, 0.03922824957012377, 0.030876923001484136, 0.013944416839379933], "isController": false}, {"data": ["deleteAccount", 11, 1, 9.090909090909092, 603.9999999999999, 397, 915, 567.0, 888.6000000000001, 915.0, 915.0, 0.08370365861082364, 0.015783608921288123, 0.05696664123850977], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1756.809523809524, 1228, 2778, 1638.0, 2622.8, 2765.1, 2778.0, 0.09083123556432149, 0.04701226059481483, 0.04177882026444865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 267.3333333333333, 261, 273, 268.0, 273.0, 273.0, 273.0, 0.04227465845598855, 0.06551746383755258, 0.09507669767982582], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/696f7f9f-a2f1-433e-a1ae-890d80ef82aa", 1, 0, 0.0, 492.0, 492, 492, 492.0, 492.0, 492.0, 492.0, 2.032520325203252, 0.6490567835365854, 1.212763592479675], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3b5ccf6f-b52b-4bc3-a872-e84e73242c0b", 1, 0, 0.0, 557.0, 557, 557, 557.0, 557.0, 557.0, 557.0, 1.7953321364452424, 0.32435199730700176, 1.2377973518850987], "isController": false}, {"data": ["addBook", 55, 11, 20.0, 1249.8545454545447, 655, 2549, 1043.0, 2052.4, 2190.3999999999996, 2549.0, 0.2705108720778678, 83.42452028124524, 0.9831811786527576], "isController": true}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 231.83333333333334, 129, 598, 134.0, 526.5, 538.0, 598.0, 0.2487264285648485, 0.18484454310336887, 0.12023396693320314], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 817.5185185185185, 625, 1148, 767.0, 1048.5, 1051.5, 1148.0, 0.2482073910645339, 72.98121423400441, 0.12483086562327633], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 197.85185185185188, 127, 525, 135.0, 389.5, 394.0, 525.0, 0.24921888340709905, 0.44100060227896826, 0.1212021522819681], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1216.4444444444446, 891, 1812, 1160.0, 1526.5, 1569.0, 1812.0, 0.24757241493136742, 222.76609414113003, 0.12426974733859654], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 137.14285714285714, 131, 169, 135.0, 154.0, 169.0, 169.0, 0.1048712705154423, 0.0783462128362435, 0.037278459441036124], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 164, 11, 6.7073170731707314, 203.84756097560975, 128, 1135, 142.0, 376.0, 406.5, 850.2999999999975, 0.6809189083707354, 1.4828564587130633, 0.3258465555467903], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 140.42857142857144, 130, 156, 142.0, 156.0, 156.0, 156.0, 0.0488884853648827, 0.03785993056089061, 0.01737832878204815], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a9ea0fcf-429b-4d23-a9e6-e7568eab4511", 3, 0, 0.0, 359.3333333333333, 252, 567, 259.0, 567.0, 567.0, 567.0, 0.02378234398782344, 0.023852018823725264, 0.015251047414066464], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 154.16666666666663, 130, 399, 136.0, 187.50000000000034, 399.0, 399.0, 0.10515492826097116, 0.08533568885240922, 0.03737929090526709], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3b5ccf6f-b52b-4bc3-a872-e84e73242c0b", 3, 0, 0.0, 359.0, 238, 475, 364.0, 475.0, 475.0, 475.0, 0.04440563063396439, 0.02854854183010406, 0.028476267040660756], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a8e7e80b-bf82-4608-a1a1-f57ed57173af", 1, 0, 0.0, 537.0, 537, 537, 537.0, 537.0, 537.0, 537.0, 1.86219739292365, 0.33643214618249534, 1.2838978119180633], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c12141bf-46b1-438e-b44e-6e9cc5adc289", 1, 0, 0.0, 540.0, 540, 540, 540.0, 540.0, 540.0, 540.0, 1.8518518518518519, 0.33456307870370366, 1.2767650462962963], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 301.57142857142856, 260, 521, 265.0, 521.0, 521.0, 521.0, 0.048156632888228454, 0.07463337538439312, 0.1083053960367091], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/51817f62-047f-4bcf-b261-d7e5745b0b82", 1, 0, 0.0, 361.0, 361, 361, 361.0, 361.0, 361.0, 361.0, 2.770083102493075, 0.8845870844875346, 1.6528523199445984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 614.7142857142857, 259, 1676, 517.0, 1536.5, 1676.0, 1676.0, 0.0672181757947349, 11.577336761860408, 0.14871833843871385], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/54ce7a47-57cc-4cbc-a277-fa3c935bb591", 3, 0, 0.0, 483.3333333333333, 231, 734, 485.0, 734.0, 734.0, 734.0, 0.029553156277090393, 0.02463725039896761, 0.01895173107612893], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bc8e7949-559b-436f-ab01-856afd683796", 3, 0, 0.0, 422.33333333333337, 228, 783, 256.0, 783.0, 783.0, 783.0, 0.024018446166655993, 0.02838899024450778, 0.015402454084737078], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=59912be3-bfc1-4ef0-9e40-e899609ec981", 1, 0, 0.0, 239.0, 239, 239, 239.0, 239.0, 239.0, 239.0, 4.184100418410042, 0.755916579497908, 2.884741108786611], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 175.26666666666668, 132, 388, 137.0, 385.0, 388.0, 388.0, 0.0739980661838704, 0.06135191229502536, 0.02630400008879768], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 140.0, 128, 173, 139.0, 159.0, 173.0, 173.0, 0.0939111007863819, 0.07290949719255235, 0.033382461607659196], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/75782007-2a58-46c6-bce2-b9092aa74d35", 3, 0, 0.0, 355.0, 238, 514, 313.0, 514.0, 514.0, 514.0, 0.07766588137831051, 0.03514178877469128, 0.04980526898283584], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=873dd216-7ab7-46fb-be9f-7c0052569ae6", 1, 0, 0.0, 739.0, 739, 739, 739.0, 739.0, 739.0, 739.0, 1.3531799729364007, 0.2444709912043302, 0.9329541610284168], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 168.57142857142856, 127, 396, 132.0, 392.5, 396.0, 396.0, 0.10957017186864101, 0.08142861405472247, 0.054999090176251444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 185.85714285714286, 129, 393, 132.0, 388.5, 393.0, 393.0, 0.10979703234306867, 0.029379284044922672, 0.06261862000815635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 223.5, 128, 395, 136.0, 392.5, 395.0, 395.0, 0.10979875456841247, 0.029594195567267424, 0.0645496584474456], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 245.21428571428575, 128, 397, 165.5, 396.0, 397.0, 397.0, 0.10979961570134505, 0.029594427669503157, 0.0646573908866319], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 22.727272727272727, 0.40387722132471726], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 9.090909090909092, 0.16155088852988692], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.545454545454546, 0.08077544426494346], "isController": false}, {"data": ["401/Unauthorized", 14, 63.63636363636363, 1.1308562197092085], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1238, 22, "401/Unauthorized", 14, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 3, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 164, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
