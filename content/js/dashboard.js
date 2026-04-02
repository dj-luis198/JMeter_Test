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

    var data = {"OkPercent": 98.38087895142637, "KoPercent": 1.6191210485736314};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7894039735099337, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.1388888888888889, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2f6a32fc-0158-4cff-855d-475600519eb0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=128c20cc-e985-42e5-91b0-61dc06c0c2a9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3458a2d3-1bd2-4d57-9d90-064cc5143101"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1b44051b-056a-489b-ab62-1cec0bb9c98e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/13702dab-af88-4751-b039-1d4939188f58"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.75, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fc35246c-6c76-4309-8832-44afb075aabb"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/69b8118b-16e0-469d-b32d-37677c026f6e"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/92467651-57e7-49ab-bf24-06062eaa37ff"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4d2a8b63-cd0b-4622-b9a3-b3892fac860b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8636363636363636, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/994ed83a-e3ea-4a82-85a1-b2a7dfc90284"], "isController": false}, {"data": [0.85, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c33d21ad-6706-48b8-b85d-e0fab9b2ffdd"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3814e2c8-0a64-4b22-ae29-1716e0c765fa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=99f7aea9-d4f7-4108-ac6c-4c2bde766041"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b7d8c79e-c65a-4d23-8a12-ad7d86232a44"], "isController": false}, {"data": [0.3409090909090909, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=69b8118b-16e0-469d-b32d-37677c026f6e"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=13702dab-af88-4751-b039-1d4939188f58"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1b44051b-056a-489b-ab62-1cec0bb9c98e"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3409090909090909, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/7afa0595-614b-424d-aa7d-ef46d34037d9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.35, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=994ed83a-e3ea-4a82-85a1-b2a7dfc90284"], "isController": false}, {"data": [0.27419354838709675, 500, 1500, "addBook"], "isController": true}, {"data": [0.9814814814814815, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3458a2d3-1bd2-4d57-9d90-064cc5143101"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9269662921348315, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2f6a32fc-0158-4cff-855d-475600519eb0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=92467651-57e7-49ab-bf24-06062eaa37ff"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3814e2c8-0a64-4b22-ae29-1716e0c765fa"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/31b92e53-399a-4479-8b7c-d4a823a9d8c8"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/99f7aea9-d4f7-4108-ac6c-4c2bde766041"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fc35246c-6c76-4309-8832-44afb075aabb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c33d21ad-6706-48b8-b85d-e0fab9b2ffdd"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b7d8c79e-c65a-4d23-8a12-ad7d86232a44"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/128c20cc-e985-42e5-91b0-61dc06c0c2a9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1297, 21, 1.6191210485736314, 351.16499614494944, 98, 2367, 116.0, 1002.0, 1209.1, 1588.5999999999995, 5.110262684050228, 691.4952400336088, 3.733483591358258], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 1691.0185185185182, 1234, 2485, 1723.0, 2073.5, 2166.5, 2485.0, 0.24611345830427828, 296.15793907467037, 1.2101379517207433], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/2f6a32fc-0158-4cff-855d-475600519eb0", 3, 0, 0.0, 309.0, 192, 406, 329.0, 406.0, 406.0, 406.0, 0.04130865829477858, 0.03361707217999559, 0.026490252877836528], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=128c20cc-e985-42e5-91b0-61dc06c0c2a9", 1, 0, 0.0, 481.0, 481, 481, 481.0, 481.0, 481.0, 481.0, 2.079002079002079, 0.37560096153846156, 1.4333744802494803], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3458a2d3-1bd2-4d57-9d90-064cc5143101", 2, 0, 0.0, 474.5, 464, 485, 474.5, 485.0, 485.0, 485.0, 0.012286672646180687, 0.024297375105972553, 0.007637174940716805], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1b44051b-056a-489b-ab62-1cec0bb9c98e", 1, 0, 0.0, 366.0, 366, 366, 366.0, 366.0, 366.0, 366.0, 2.73224043715847, 0.49361765710382516, 1.8837517076502732], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/13702dab-af88-4751-b039-1d4939188f58", 3, 0, 0.0, 415.0, 192, 765, 288.0, 765.0, 765.0, 765.0, 0.030926240915416733, 0.025781934565228596, 0.01983225735786815], "isController": false}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 514.4285714285713, 119, 966, 437.0, 855.0, 966.0, 966.0, 0.07925500297206262, 0.014965352472473038, 0.05359774370913414], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 514.4285714285713, 119, 966, 437.0, 855.0, 966.0, 966.0, 0.07847005806784298, 0.014817134988117391, 0.053066909386700445], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 26, 0, 0.0, 125.34615384615385, 100, 304, 102.0, 302.3, 303.65, 304.0, 0.14323727254196578, 0.0548760584408072, 0.08076464601111742], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 26, 0, 0.0, 111.57692307692307, 101, 302, 103.5, 110.3, 235.14999999999972, 302.0, 0.14323490524460114, 0.10644703407338034, 0.07189720829660642], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 26, 0, 0.0, 184.5, 100, 921, 102.5, 456.10000000000036, 882.4999999999999, 921.0, 0.14322780382197886, 3.2751524894094057, 0.08339533559376187], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 26, 0, 0.0, 229.19230769230774, 100, 1406, 103.0, 542.7000000000005, 1297.1499999999996, 1406.0, 0.1432356943350283, 9.949769807155173, 0.0832600512893967], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fc35246c-6c76-4309-8832-44afb075aabb", 3, 0, 0.0, 380.3333333333333, 329, 427, 385.0, 427.0, 427.0, 427.0, 0.02997212592289171, 0.02498652815381695, 0.019220406272166885], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/69b8118b-16e0-469d-b32d-37677c026f6e", 3, 0, 0.0, 609.3333333333334, 178, 917, 733.0, 917.0, 917.0, 917.0, 0.022857491161770084, 0.031510896832713645, 0.014657961454650738], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 294.2142857142858, 101, 1057, 211.0, 771.0, 1057.0, 1057.0, 0.07933404733975939, 0.16568508491576425, 0.05128268810669296], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/92467651-57e7-49ab-bf24-06062eaa37ff", 3, 0, 0.0, 663.0, 269, 1057, 663.0, 1057.0, 1057.0, 1057.0, 0.033812722600423784, 0.028188275579324646, 0.021683288907172804], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 115.5625, 101, 310, 102.5, 169.30000000000013, 310.0, 310.0, 0.09569950355882528, 0.0711204318440098, 0.048036664872300974], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 779.75, 602, 905, 806.0, 905.0, 905.0, 905.0, 0.01815466869998956, 5.33807538953111, 0.010353834492962797], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 140.1875, 100, 305, 102.0, 305.0, 305.0, 305.0, 0.09569950355882528, 0.0256070937257013, 0.054578623123392546], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1056.25, 900, 1223, 1051.0, 1223.0, 1223.0, 1223.0, 0.01813803954999524, 16.320639870358363, 0.010326637751608617], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 257.25, 107, 311, 305.5, 311.0, 311.0, 311.0, 0.01819620972951334, 0.032198761747927906, 0.010075440348275455], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 123.0, 102, 305, 104.0, 266.40000000000015, 305.0, 305.0, 0.06383991271342843, 0.047443528881756875, 0.03204464368623263], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 159.45454545454547, 101, 311, 103.0, 309.6, 311.0, 311.0, 0.06376552835537108, 0.025768881842475957, 0.0358794317042207], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 250.27272727272725, 101, 1098, 111.0, 938.8000000000005, 1098.0, 1098.0, 0.06347337868794756, 5.207685300791686, 0.036819518496719585], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 251.27272727272728, 102, 601, 300.0, 562.8000000000002, 601.0, 601.0, 0.06365593389041921, 1.717139161275202, 0.03698757877421819], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4d2a8b63-cd0b-4622-b9a3-b3892fac860b", 1, 0, 0.0, 204.0, 204, 204, 204.0, 204.0, 204.0, 204.0, 4.901960784313726, 1.5653722426470589, 2.924900428921569], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 204.0, 102, 307, 203.5, 307.0, 307.0, 307.0, 0.01821286283437678, 0.013535145133750712, 0.010226949345475241], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 788.7857142857144, 101, 1412, 1106.0, 1358.0, 1412.0, 1412.0, 0.07103642138805168, 41.097428870026185, 0.037837201012776406], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 127.56249999999997, 99, 306, 102.0, 303.9, 306.0, 306.0, 0.09570007596193529, 0.025794161099115375, 0.05626117746980962], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 504.92857142857144, 101, 904, 602.5, 859.0, 904.0, 904.0, 0.07103678183082084, 13.434306119691904, 0.03790676485810403], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 102.25000000000001, 101, 105, 102.0, 105.0, 105.0, 105.0, 0.09570007596193529, 0.025794161099115375, 0.056354634575241196], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 612.5, 106, 2258, 464.0, 1604.5, 2258.0, 2258.0, 0.07827569819127225, 0.014780434919348075, 0.05356883893377317], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 421.18181818181813, 207, 1202, 405.0, 1083.6000000000004, 1202.0, 1202.0, 0.06343531040050748, 6.9885280304777835, 0.14119199814019204], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/994ed83a-e3ea-4a82-85a1-b2a7dfc90284", 3, 0, 0.0, 300.6666666666667, 209, 409, 284.0, 409.0, 409.0, 409.0, 0.022901112994091515, 0.027068340260920015, 0.014685935090612072], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 430.1, 144, 1003, 381.0, 852.3000000000001, 995.55, 1003.0, 0.08680970011589095, 0.053323536496968166, 0.03925087026724366], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 102.85714285714286, 99, 107, 103.0, 106.0, 107.0, 107.0, 0.07103570051348664, 0.052791179776136066, 0.03565659185930872], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 175.50000000000003, 99, 321, 103.0, 313.5, 321.0, 321.0, 0.0710360609489403, 0.08759594625107188, 0.036677519750561945], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c33d21ad-6706-48b8-b85d-e0fab9b2ffdd", 3, 0, 0.0, 455.0, 249, 608, 508.0, 608.0, 608.0, 608.0, 0.041111095884779306, 0.02643047342852836, 0.02636356083757006], "isController": false}, {"data": ["login", 20, 0, 0.0, 2353.85, 1515, 4612, 2153.5, 3684.000000000002, 4569.449999999999, 4612.0, 0.09192739574284231, 22.122956195446836, 0.1691859082196881], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3814e2c8-0a64-4b22-ae29-1716e0c765fa", 1, 0, 0.0, 421.0, 421, 421, 421.0, 421.0, 421.0, 421.0, 2.375296912114014, 0.42913078978622327, 1.6376558788598576], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 118.87500000000001, 103, 309, 105.0, 173.20000000000013, 309.0, 309.0, 0.09421352317358253, 0.0762724713973632, 0.03348996331560941], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 893.7857142857143, 205, 1514, 1208.0, 1463.0, 1514.0, 1514.0, 0.07099859524207985, 54.64294263662158, 0.14799958288325293], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=99f7aea9-d4f7-4108-ac6c-4c2bde766041", 1, 0, 0.0, 625.0, 625, 625, 625.0, 625.0, 625.0, 625.0, 1.6, 0.2890625, 1.103125], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, 33.333333333333336, 874.5, 101, 1398, 1160.0, 1398.0, 1398.0, 1398.0, 0.027194234822217687, 21.691598256169694, 0.0468861538853763], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 26, 0, 0.0, 365.6923076923077, 204, 1509, 209.0, 782.6000000000004, 1399.7999999999995, 1509.0, 0.14314579399118002, 13.378023954898064, 0.319120923097675], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b7d8c79e-c65a-4d23-8a12-ad7d86232a44", 1, 0, 0.0, 404.0, 404, 404, 404.0, 404.0, 404.0, 404.0, 2.4752475247524752, 0.44718827351485146, 1.7065671410891088], "isController": false}, {"data": ["register", 22, 5, 22.727272727272727, 1052.772727272727, 194, 2367, 1033.0, 1500.1, 2242.499999999998, 2367.0, 0.08631987004935927, 0.02729681970133325, 0.03894509761992576], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=69b8118b-16e0-469d-b32d-37677c026f6e", 1, 0, 0.0, 476.0, 476, 476, 476.0, 476.0, 476.0, 476.0, 2.100840336134454, 0.37954634978991597, 1.4484309348739497], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 270.25, 204, 615, 206.5, 474.3000000000001, 615.0, 615.0, 0.09564058269025004, 0.14822422336858088, 0.21509791204652914], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 123.42857142857142, 104, 304, 105.5, 218.5, 304.0, 304.0, 0.11391653172982254, 0.08844105734883682, 0.04049376713833535], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=13702dab-af88-4751-b039-1d4939188f58", 1, 0, 0.0, 452.0, 452, 452, 452.0, 452.0, 452.0, 452.0, 2.2123893805309733, 0.3996992533185841, 1.5253387721238938], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1b44051b-056a-489b-ab62-1cec0bb9c98e", 3, 0, 0.0, 558.0, 184, 1213, 277.0, 1213.0, 1213.0, 1213.0, 0.037484069270560014, 0.031248926237599017, 0.02403763556738386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 401.1875, 203, 1305, 209.5, 1232.9, 1305.0, 1305.0, 0.11318699198494613, 17.079864586796738, 0.2509402036658437], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 133.8181818181818, 102, 427, 104.0, 364.0000000000002, 427.0, 427.0, 0.04960988589726244, 0.03686828434357101, 0.02490183725702431], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 139.8181818181818, 101, 303, 102.0, 302.6, 303.0, 303.0, 0.04960988589726244, 0.020048313263879493, 0.027914369390700404], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 259.54545454545456, 101, 1201, 103.0, 1022.6000000000006, 1201.0, 1201.0, 0.0496101096383423, 4.070270782407804, 0.028777739380054027], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 167.36363636363637, 101, 599, 103.0, 540.8000000000002, 599.0, 599.0, 0.0496101096383423, 1.338248562998074, 0.028826186752747722], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 106.0, 106, 106, 106.0, 106.0, 106.0, 106.0, 9.433962264150942, 2.7822818396226414, 5.831736438679245], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1165.2037037037042, 803, 2062, 1107.5, 1618.5, 1739.75, 2062.0, 0.24363063790622025, 291.466942649799, 0.4810753416468529], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, 22.727272727272727, 1052.772727272727, 194, 2367, 1033.0, 1500.1, 2242.499999999998, 2367.0, 0.08693349982415724, 0.027490867043115062, 0.03922195011597719], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 127.24999999999997, 101, 304, 102.0, 304.0, 304.0, 304.0, 0.03865331838738356, 0.010418277221599475, 0.02276167088632059], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 153.125, 102, 304, 103.5, 304.0, 304.0, 304.0, 0.03861581607286804, 0.010408169175890214, 0.02270187624596344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 131.2857142857143, 101, 304, 102.0, 304.0, 304.0, 304.0, 0.11664042257158805, 0.03143823889624835, 0.06857181092587501], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 159.9285714285714, 99, 307, 102.5, 306.5, 307.0, 307.0, 0.11664333799906684, 0.03143902469506099, 0.06868743438812237], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7afa0595-614b-424d-aa7d-ef46d34037d9", 1, 0, 0.0, 1024.0, 1024, 1024, 1024.0, 1024.0, 1024.0, 1024.0, 0.9765625, 0.31185150146484375, 0.5826950073242188], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 127.625, 101, 304, 102.5, 304.0, 304.0, 304.0, 0.03861544328115422, 0.010332647909215092, 0.022022869996283265], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 118.07142857142856, 101, 305, 103.0, 208.5, 305.0, 305.0, 0.11663945079481454, 0.08668224810044323, 0.05854753682474089], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 128.125, 101, 304, 103.0, 304.0, 304.0, 304.0, 0.03865257136230988, 0.028725201959685368, 0.01940177898459695], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 115.92857142857144, 100, 293, 102.0, 199.0, 293.0, 293.0, 0.11663945079481454, 0.031210165544706233, 0.06652093678141767], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 105.875, 103, 113, 104.5, 113.0, 113.0, 113.0, 0.0379477838494232, 0.029869056428354582, 0.01348925129022465], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 574.6153846153845, 101, 1213, 574.0, 1056.6, 1213.0, 1213.0, 0.071813682163691, 0.013454276090463143, 0.04887559798700725], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1346.3000000000002, 964, 2211, 1201.5, 1920.4, 2196.5, 2211.0, 0.09032974874780385, 0.04675270198860942, 0.041548155918179314], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 282.625, 204, 609, 208.0, 609.0, 609.0, 609.0, 0.03859588181940987, 0.05981607856191744, 0.08680304280283294], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=994ed83a-e3ea-4a82-85a1-b2a7dfc90284", 1, 0, 0.0, 397.0, 397, 397, 397.0, 397.0, 397.0, 397.0, 2.5188916876574305, 0.45507320528967254, 1.7366577455919394], "isController": false}, {"data": ["addBook", 62, 12, 19.35483870967742, 1025.8064516129027, 521, 2087, 823.5, 1843.5, 1991.6, 2087.0, 0.2834467120181406, 83.09694320436509, 1.0317178156544877], "isController": true}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 196.42592592592595, 102, 710, 105.0, 411.5, 461.5, 710.0, 0.2446294769459369, 0.18179983589439255, 0.11825350692210816], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 648.8888888888889, 503, 923, 603.0, 857.5, 915.5, 923.0, 0.24488796375658137, 72.00519239010653, 0.1231614270846088], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3458a2d3-1bd2-4d57-9d90-064cc5143101", 1, 0, 0.0, 2258.0, 2258, 2258, 2258.0, 2258.0, 2258.0, 2258.0, 0.4428697962798937, 0.08001065655447298, 0.3053379650132861], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 172.3888888888889, 101, 312, 107.0, 307.5, 309.0, 312.0, 0.2453263067033142, 0.4341125661585989, 0.1193090827521977], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 965.574074074074, 699, 1414, 973.5, 1264.5, 1310.0, 1414.0, 0.24445007786187667, 219.95660975751912, 0.1227024804892623], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 117.87499999999999, 103, 308, 105.0, 171.50000000000014, 308.0, 308.0, 0.11145631609011243, 0.08326570489153907, 0.039619237360157156], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 12, 6.741573033707865, 165.3651685393259, 101, 1469, 109.0, 310.0, 367.0, 737.4600000000073, 0.739777152522931, 1.4978587893214415, 0.3585811941790344], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 126.72727272727273, 103, 334, 106.0, 289.40000000000015, 334.0, 334.0, 0.048437238548996474, 0.03751047868100996, 0.017217924640463587], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2f6a32fc-0158-4cff-855d-475600519eb0", 1, 0, 0.0, 951.0, 951, 951, 951.0, 951.0, 951.0, 951.0, 1.0515247108307044, 0.18997272607781285, 0.7249769978969506], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=92467651-57e7-49ab-bf24-06062eaa37ff", 1, 0, 0.0, 515.0, 515, 515, 515.0, 515.0, 515.0, 515.0, 1.941747572815534, 0.3508040048543689, 1.338743932038835], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 26, 0, 0.0, 130.23076923076917, 103, 313, 105.5, 305.2, 311.25, 313.0, 0.13542089856974696, 0.1098972331166599, 0.048137897538464744], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3814e2c8-0a64-4b22-ae29-1716e0c765fa", 3, 0, 0.0, 393.3333333333333, 257, 511, 412.0, 511.0, 511.0, 511.0, 0.024581902803156315, 0.02481395852623299, 0.01576378532624282], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 394.3636363636364, 206, 1303, 216.0, 1188.4000000000005, 1303.0, 1303.0, 0.04958662783883445, 5.462849261722729, 0.11036810605001939], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 307.92857142857144, 204, 611, 208.0, 515.0, 611.0, 611.0, 0.11653944443981985, 0.18061337727147864, 0.26209994193838393], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/31b92e53-399a-4479-8b7c-d4a823a9d8c8", 1, 0, 0.0, 272.0, 272, 272, 272.0, 272.0, 272.0, 272.0, 3.676470588235294, 1.174029181985294, 2.193675321691176], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/99f7aea9-d4f7-4108-ac6c-4c2bde766041", 3, 0, 0.0, 342.3333333333333, 186, 574, 267.0, 574.0, 574.0, 574.0, 0.03732828986661358, 0.03056010710108501, 0.0239377379678479], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fc35246c-6c76-4309-8832-44afb075aabb", 1, 0, 0.0, 738.0, 738, 738, 738.0, 738.0, 738.0, 738.0, 1.3550135501355014, 0.2448022527100271, 0.9342183265582656], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 124.54545454545455, 103, 309, 105.0, 269.60000000000014, 309.0, 309.0, 0.06489905247383389, 0.05380790581082516, 0.023069585059058137], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 124.21428571428572, 104, 315, 107.0, 224.5, 315.0, 315.0, 0.07298927578997857, 0.056666478762727505, 0.025945406628468948], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c33d21ad-6706-48b8-b85d-e0fab9b2ffdd", 1, 0, 0.0, 385.0, 385, 385, 385.0, 385.0, 385.0, 385.0, 2.5974025974025974, 0.4692573051948052, 1.7907873376623376], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b7d8c79e-c65a-4d23-8a12-ad7d86232a44", 3, 0, 0.0, 412.0, 201, 822, 213.0, 822.0, 822.0, 822.0, 0.04777070063694267, 0.02971673467356688, 0.03063420581210191], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/128c20cc-e985-42e5-91b0-61dc06c0c2a9", 3, 0, 0.0, 309.3333333333333, 191, 379, 358.0, 379.0, 379.0, 379.0, 0.049577762720827624, 0.031873724405479996, 0.03179303143230156], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 116.12500000000001, 100, 303, 103.0, 173.5000000000001, 303.0, 303.0, 0.1132703267140986, 0.08417843616155181, 0.05685639446391278], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 155.25, 100, 340, 102.0, 319.0, 340.0, 340.0, 0.11326952483434331, 0.0515741366738404, 0.0634099171008665], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 259.18749999999994, 101, 1203, 103.0, 990.2000000000003, 1203.0, 1203.0, 0.11326872296594151, 12.766637781667457, 0.06537286647741351], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 218.8125, 98, 844, 103.0, 673.2000000000002, 844.0, 844.0, 0.11326952483434331, 4.189838617474656, 0.06548394404485473], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 23.80952380952381, 0.3855050115651503], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 4.761904761904762, 0.07710100231303008], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.761904761904762, 0.07710100231303008], "isController": false}, {"data": ["401/Unauthorized", 14, 66.66666666666667, 1.079414032382421], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1297, 21, "401/Unauthorized", 14, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
