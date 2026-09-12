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

    var data = {"OkPercent": 97.49019607843137, "KoPercent": 2.5098039215686274};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.706081081081081, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1998a2f9-bfe9-44c4-a348-250466464e8a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/222eab86-c472-4e6c-bbdc-37d037f31aef"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=687f9211-9a61-4bf2-95f8-2d61fae408a5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b6c0c344-5b72-4d60-8ab7-9d4156ce57be"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/687f9211-9a61-4bf2-95f8-2d61fae408a5"], "isController": false}, {"data": [0.28703703703703703, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2692307692307692, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.2692307692307692, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b6c0c344-5b72-4d60-8ab7-9d4156ce57be"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=95a44af6-f2d3-4434-a705-2d74aab5be6a"], "isController": false}, {"data": [0.1590909090909091, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=51759945-4842-41c4-afa5-189a3aa12aa5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/95a44af6-f2d3-4434-a705-2d74aab5be6a"], "isController": false}, {"data": [0.11904761904761904, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9e09a490-8006-4ed3-8406-b969e7df0387"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/01319665-a08c-4e00-85b8-26c83e15ba1d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=df464bb7-953f-4c81-a1e4-b0e16c34c5b6"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/51759945-4842-41c4-afa5-189a3aa12aa5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.22413793103448276, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c8a947c7-df15-411c-b700-7fdfe51c31a5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.8981481481481481, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/430aa211-303f-49de-ad39-6783b63c5751"], "isController": false}, {"data": [0.9814814814814815, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.675, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.37037037037037035, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.775, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d51a7e33-548a-4389-b1e0-e0916955fe01"], "isController": false}, {"data": [0.888235294117647, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/df464bb7-953f-4c81-a1e4-b0e16c34c5b6"], "isController": false}, {"data": [0.6363636363636364, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=222eab86-c472-4e6c-bbdc-37d037f31aef"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d51a7e33-548a-4389-b1e0-e0916955fe01"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ec9f9fe5-a19f-4d68-8b7f-f3b70cc844bc"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c8a947c7-df15-411c-b700-7fdfe51c31a5"], "isController": false}, {"data": [0.5952380952380952, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0943369a-6616-42ff-89d9-6d34259ee794"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0943369a-6616-42ff-89d9-6d34259ee794"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.475, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1998a2f9-bfe9-44c4-a348-250466464e8a"], "isController": false}, {"data": [0.125, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.65625, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.1590909090909091, 500, 1500, "register"], "isController": true}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1275, 32, 2.5098039215686274, 484.50352941176453, 124, 5617, 157.0, 1325.4000000000005, 1642.4, 2532.2400000000007, 5.050745133458512, 714.1476941862953, 3.698626308737195], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/1998a2f9-bfe9-44c4-a348-250466464e8a", 3, 0, 0.0, 371.0, 279, 501, 333.0, 501.0, 501.0, 501.0, 0.03610890445583881, 0.030102507913868228, 0.023155775318360175], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/222eab86-c472-4e6c-bbdc-37d037f31aef", 3, 0, 0.0, 723.0, 516, 899, 754.0, 899.0, 899.0, 899.0, 0.02357471219205532, 0.027864511708773722, 0.015117898117952144], "isController": false}, {"data": ["see books", 54, 0, 0.0, 2240.3148148148152, 1543, 3260, 2153.0, 2740.5, 2946.25, 3260.0, 0.24274572385426266, 292.10424053460247, 1.1935788277404418], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 331.6, 270, 554, 287.0, 535.4, 554.0, 554.0, 0.09512093040952731, 0.14741886382804673, 0.2139292018878334], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 159.7222222222222, 130, 378, 146.0, 203.40000000000026, 378.0, 378.0, 0.15000875051044643, 0.1164618717341845, 0.05332342303301026], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 584.625, 260, 1827, 410.0, 1536.5000000000002, 1827.0, 1827.0, 0.1147109642173486, 17.309831289745556, 0.2543189126117536], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 137.25, 125, 150, 137.5, 150.0, 150.0, 150.0, 0.045062044802938045, 0.03348849228030845, 0.022619034207724764], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=687f9211-9a61-4bf2-95f8-2d61fae408a5", 1, 0, 0.0, 469.0, 469, 469, 469.0, 469.0, 469.0, 469.0, 2.1321961620469083, 0.3852112206823028, 1.4700493070362475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 205.25, 127, 437, 140.0, 437.0, 437.0, 437.0, 0.04506509089065519, 0.012058432523476097, 0.02570118464857679], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b6c0c344-5b72-4d60-8ab7-9d4156ce57be", 1, 0, 0.0, 577.0, 577, 577, 577.0, 577.0, 577.0, 577.0, 1.7331022530329288, 0.3131092937608319, 1.1948927642980938], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 214.24999999999997, 125, 512, 127.0, 512.0, 512.0, 512.0, 0.04506813739021683, 0.012147271405956882, 0.026495135457920444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 168.0, 127, 377, 144.0, 377.0, 377.0, 377.0, 0.0450663602154172, 0.012146792401811669, 0.026538100790914624], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 145.0, 140, 150, 145.0, 150.0, 150.0, 150.0, 0.059497248252268334, 0.01754704001189945, 0.036779060687193214], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/687f9211-9a61-4bf2-95f8-2d61fae408a5", 3, 0, 0.0, 369.0, 235, 543, 329.0, 543.0, 543.0, 543.0, 0.0468376762267568, 0.03011211280854319, 0.030035879611559537], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1507.407407407407, 1011, 2697, 1405.5, 2124.5, 2362.5, 2697.0, 0.2450702307744673, 293.1891962036806, 0.48391797522067664], "isController": false}, {"data": ["deleteBook", 13, 3, 23.076923076923077, 896.0000000000001, 133, 2743, 601.0, 2594.2, 2743.0, 2743.0, 0.07382420752552614, 0.015283917964269084, 0.049362174818562816], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 3, 23.076923076923077, 896.0000000000001, 133, 2743, 601.0, 2594.2, 2743.0, 2743.0, 0.07337585369983632, 0.015191094711294238, 0.049062385350228596], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b6c0c344-5b72-4d60-8ab7-9d4156ce57be", 3, 0, 0.0, 517.3333333333334, 280, 902, 370.0, 902.0, 902.0, 902.0, 0.036360551225956585, 0.030312295471899352, 0.0233171503629995], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=95a44af6-f2d3-4434-a705-2d74aab5be6a", 1, 0, 0.0, 883.0, 883, 883, 883.0, 883.0, 883.0, 883.0, 1.1325028312570782, 0.20460256228765572, 0.7808076160815401], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, 31.818181818181817, 1522.6818181818182, 171, 3141, 1420.5, 2967.7999999999997, 3137.7, 3141.0, 0.09160483340411889, 0.028675305627035085, 0.04132952444599895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 236.8125, 126, 432, 143.5, 429.2, 432.0, 432.0, 0.0769963715459909, 0.020602544730079594, 0.043911993147322935], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 171.625, 128, 415, 140.5, 415.0, 415.0, 415.0, 0.04469548408002726, 0.012046829693444849, 0.026319704004156678], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 138.875, 127, 147, 142.5, 147.0, 147.0, 147.0, 0.07709617265687867, 0.05729510487488737, 0.0386986647906598], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 135.25, 125, 158, 130.0, 158.0, 158.0, 158.0, 0.044691239399796655, 0.012045685619476443, 0.02627356066277108], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 224.8125, 126, 382, 138.0, 381.3, 382.0, 382.0, 0.0770086008981128, 0.020756224460819466, 0.04534783822418166], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 197.74999999999997, 125, 430, 136.0, 398.50000000000006, 430.0, 430.0, 0.07710248848281578, 0.020781530098883942, 0.045327830143217875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 344.5555555555555, 126, 1865, 142.0, 1412.3000000000006, 1865.0, 1865.0, 0.15033700545389247, 15.066407326632202, 0.08694620649622906], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 275.77777777777777, 125, 754, 139.0, 750.4, 754.0, 754.0, 0.15004501350405122, 4.937972277099797, 0.08692386361741856], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 201.375, 127, 416, 142.0, 416.0, 416.0, 416.0, 0.04469198840242901, 0.011958598459243701, 0.025488399635760297], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 190.44444444444443, 127, 547, 143.0, 445.3000000000002, 547.0, 547.0, 0.15035709810800651, 0.11173999185565718, 0.07547221526124545], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=51759945-4842-41c4-afa5-189a3aa12aa5", 1, 0, 0.0, 1851.0, 1851, 1851, 1851.0, 1851.0, 1851.0, 1851.0, 0.5402485143165856, 0.09760349135602377, 0.3724760264721772], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 177.625, 127, 436, 146.5, 436.0, 436.0, 436.0, 0.0446907400786557, 0.033212551952985336, 0.022432656641043974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 196.6111111111111, 125, 436, 141.0, 428.8, 436.0, 436.0, 0.15035835407721737, 0.06532496199274938, 0.08434816521041816], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 177.62500000000003, 129, 389, 149.0, 389.0, 389.0, 389.0, 0.0451699236063667, 0.035553670338605035, 0.01605649628195066], "isController": false}, {"data": ["deleteAccount", 12, 2, 16.666666666666668, 718.4166666666667, 127, 1621, 570.0, 1557.7000000000003, 1621.0, 1621.0, 0.07354293068578784, 0.01435188377152663, 0.05004606009070295], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/95a44af6-f2d3-4434-a705-2d74aab5be6a", 3, 0, 0.0, 746.0, 534, 1004, 700.0, 1004.0, 1004.0, 1004.0, 0.017431320596848418, 0.024030482658741224, 0.011178288273369589], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 2116.3809523809523, 1010, 5617, 1798.0, 4584.800000000001, 5556.199999999999, 5617.0, 0.08856163257043813, 0.0458375637327463, 0.040734891543629255], "isController": false}, {"data": ["goToProfile", 13, 3, 23.076923076923077, 373.92307692307696, 129, 899, 333.0, 764.1999999999998, 899.0, 899.0, 0.07393210757690362, 0.13546814663580475, 0.04777929097687063], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 383.25, 257, 853, 292.5, 853.0, 853.0, 853.0, 0.044654568999681836, 0.0692058603539991, 0.10042917227174539], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9e09a490-8006-4ed3-8406-b969e7df0387", 1, 0, 0.0, 232.0, 232, 232, 232.0, 232.0, 232.0, 232.0, 4.310344827586206, 1.3764480064655171, 2.571895204741379], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 138.46666666666664, 128, 150, 142.0, 148.2, 150.0, 150.0, 0.09520484910031418, 0.07075282242708895, 0.04778837152105614], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 935.4285714285714, 629, 1113, 996.0, 1113.0, 1113.0, 1113.0, 0.030392365437802025, 8.936364560222472, 0.01733314591374647], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 134.8, 127, 148, 137.0, 144.4, 148.0, 148.0, 0.09519941103297708, 0.02547327990530832, 0.05429341410474474], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/01319665-a08c-4e00-85b8-26c83e15ba1d", 1, 0, 0.0, 3061.0, 3061, 3061, 3061.0, 3061.0, 3061.0, 3061.0, 0.32669062397909177, 0.10432405668082326, 0.1949296594250245], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=df464bb7-953f-4c81-a1e4-b0e16c34c5b6", 1, 0, 0.0, 606.0, 606, 606, 606.0, 606.0, 606.0, 606.0, 1.6501650165016502, 0.29812551567656764, 1.1377114273927393], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1243.9999999999998, 892, 1535, 1368.0, 1535.0, 1535.0, 1535.0, 0.03035770044755924, 27.315912225859122, 0.01728372984465531], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/51759945-4842-41c4-afa5-189a3aa12aa5", 3, 0, 0.0, 700.6666666666667, 344, 1410, 348.0, 1410.0, 1410.0, 1410.0, 0.027584177715662298, 0.027664990736313653, 0.017689072298129792], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 248.85714285714286, 128, 388, 161.0, 388.0, 388.0, 388.0, 0.030454114350848802, 0.05388950703490041, 0.016862776207940692], "isController": false}, {"data": ["addBook", 58, 15, 25.862068965517242, 1356.7413793103444, 690, 2720, 1133.5, 2354.6, 2543.2999999999997, 2720.0, 0.2824349790852029, 82.68138971857546, 1.0266325076573966], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 142.36363636363635, 128, 158, 143.0, 156.6, 158.0, 158.0, 0.05487789667988725, 0.040783280638080274, 0.02754613173189653], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c8a947c7-df15-411c-b700-7fdfe51c31a5", 1, 0, 0.0, 516.0, 516, 516, 516.0, 516.0, 516.0, 516.0, 1.937984496124031, 0.35012415213178294, 1.3361494670542635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 257.45454545454544, 127, 426, 146.0, 423.6, 426.0, 426.0, 0.054815545688757336, 0.022152020949504917, 0.030843477323805393], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 340.99999999999994, 128, 1548, 145.0, 1325.000000000001, 1548.0, 1548.0, 0.05488638518267187, 4.503163802491343, 0.03183839140479208], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 240.53703703703698, 127, 789, 145.0, 515.5, 572.5, 789.0, 0.24633800311115772, 0.1830695511402256, 0.11907940580080378], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 245.72727272727272, 127, 843, 143.0, 751.0000000000003, 843.0, 843.0, 0.05488364666906159, 1.4805039098361472, 0.031890400164152], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 142.0, 125, 178, 139.0, 178.0, 178.0, 178.0, 0.03045610188001166, 0.022633880401063355, 0.01710181502051436], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 860.2777777777779, 627, 1298, 814.5, 1139.0, 1261.5, 1298.0, 0.2459856508370345, 72.32794883840108, 0.12371348650495387], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/430aa211-303f-49de-ad39-6783b63c5751", 1, 0, 0.0, 304.0, 304, 304, 304.0, 304.0, 304.0, 304.0, 3.289473684210526, 1.0504471628289473, 1.9627621299342106], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 203.87037037037035, 126, 509, 142.5, 424.0, 477.75, 509.0, 0.24669023928953213, 0.43652608749280486, 0.11997240152947948], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 752.8499999999999, 126, 1712, 262.0, 1631.1000000000001, 1708.3999999999999, 1712.0, 0.10037338900710643, 40.657147910539706, 0.05512694724374674], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 168.73333333333332, 127, 380, 139.0, 377.0, 380.0, 380.0, 0.09520122365306134, 0.02565970481273919, 0.05596790687416302], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1260.796296296296, 868, 2115, 1235.5, 1669.5, 1903.0, 2115.0, 0.24599013306244047, 221.34235413411474, 0.12347551600985783], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 554.1500000000001, 127, 1152, 408.0, 1134.8, 1151.15, 1152.0, 0.10022500513653151, 13.276123256084912, 0.05514332802140806], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 154.53333333333333, 127, 421, 136.0, 258.4000000000001, 421.0, 421.0, 0.09520182787509521, 0.025659867669459255, 0.05606123262566641], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 144.18750000000003, 129, 160, 145.5, 157.9, 160.0, 160.0, 0.12509773260359655, 0.09345680218921032, 0.044468334636434716], "isController": false}, {"data": ["deleteBooks", 12, 2, 16.666666666666668, 829.5833333333333, 140, 3405, 546.5, 2938.8000000000015, 3405.0, 3405.0, 0.07546078240254554, 0.015070048829414614, 0.05113008417021437], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d51a7e33-548a-4389-b1e0-e0916955fe01", 3, 0, 0.0, 371.6666666666667, 239, 519, 357.0, 519.0, 519.0, 519.0, 0.06336198703191331, 0.028669649080195155, 0.04063252423596004], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 15, 8.823529411764707, 213.83529411764698, 127, 1226, 147.5, 399.20000000000005, 509.4499999999991, 1091.0999999999985, 0.74100550087613, 1.6020285229907854, 0.3556553975712455], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 180.625, 130, 434, 147.0, 434.0, 434.0, 434.0, 0.047215746451441554, 0.03656453802343081, 0.016783722371410865], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/df464bb7-953f-4c81-a1e4-b0e16c34c5b6", 3, 0, 0.0, 1132.3333333333333, 562, 1621, 1214.0, 1621.0, 1621.0, 1621.0, 0.01987426216801701, 0.023490705056012293, 0.012744888174151533], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 560.2727272727274, 274, 1689, 545.0, 1465.000000000001, 1689.0, 1689.0, 0.05477214786488209, 6.034126549180409, 0.1219098472230521], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=222eab86-c472-4e6c-bbdc-37d037f31aef", 1, 0, 0.0, 3405.0, 3405, 3405, 3405.0, 3405.0, 3405.0, 3405.0, 0.2936857562408223, 0.05305846182085169, 0.2024825624082232], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d51a7e33-548a-4389-b1e0-e0916955fe01", 1, 0, 0.0, 506.0, 506, 506, 506.0, 506.0, 506.0, 506.0, 1.976284584980237, 0.35704360177865613, 1.3625555830039526], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 159.9375, 128, 409, 145.5, 235.40000000000018, 409.0, 409.0, 0.07591753457806458, 0.06160885862731608, 0.026986311119546393], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ec9f9fe5-a19f-4d68-8b7f-f3b70cc844bc", 1, 0, 0.0, 387.0, 387, 387, 387.0, 387.0, 387.0, 387.0, 2.5839793281653747, 0.8251574612403101, 1.5418079780361758], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c8a947c7-df15-411c-b700-7fdfe51c31a5", 3, 0, 0.0, 461.6666666666667, 251, 597, 537.0, 597.0, 597.0, 597.0, 0.01683785149014986, 0.023212337584890837, 0.010797710753774486], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 852.5714285714286, 138, 2507, 763.0, 1851.6000000000004, 2448.2999999999993, 2507.0, 0.09076959650753172, 0.05575593379222407, 0.04104133123338592], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 163.15000000000003, 128, 416, 139.5, 354.2000000000005, 414.04999999999995, 416.0, 0.10037389275049559, 0.07459426990539761, 0.05038298913452611], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 200.45000000000002, 126, 430, 140.5, 411.80000000000007, 429.25, 430.0, 0.10025062656641605, 0.09458215852130326, 0.053385416666666664], "isController": false}, {"data": ["login", 21, 0, 0.0, 3846.238095238095, 1551, 8642, 3305.0, 8002.200000000002, 8625.9, 8642.0, 0.09037583436261366, 36.1618366588592, 0.18631190072214596], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 389.5, 257, 659, 291.0, 659.0, 659.0, 659.0, 0.045026790940609664, 0.0697827316628394, 0.10126630814084381], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 165.53333333333327, 134, 392, 150.0, 256.4000000000001, 392.0, 392.0, 0.09705094527620699, 0.07856956409567929, 0.03449857820365171], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 613.5555555555555, 256, 1993, 508.0, 1765.3000000000004, 1993.0, 1993.0, 0.14988508809912401, 20.13033497235453, 0.3328340199596976], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0943369a-6616-42ff-89d9-6d34259ee794", 3, 0, 0.0, 370.0, 255, 499, 356.0, 499.0, 499.0, 499.0, 0.1345653539068808, 0.060887318336772224, 0.08629353749887862], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0943369a-6616-42ff-89d9-6d34259ee794", 1, 0, 0.0, 229.0, 229, 229, 229.0, 229.0, 229.0, 229.0, 4.366812227074235, 0.7889260371179039, 3.0107123362445414], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 151.27272727272728, 129, 171, 155.0, 168.60000000000002, 171.0, 171.0, 0.057228476890100514, 0.04744821960907748, 0.020342935144527917], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 948.5000000000001, 265, 1862, 820.5, 1763.3000000000002, 1857.4499999999998, 1862.0, 0.10015624374023477, 54.00513179466218, 0.2137220783171748], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 157.6, 129, 428, 145.5, 162.70000000000002, 414.7499999999998, 428.0, 0.10114444944547556, 0.0785252317472198, 0.03595369101382139], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1998a2f9-bfe9-44c4-a348-250466464e8a", 1, 0, 0.0, 623.0, 623, 623, 623.0, 623.0, 623.0, 623.0, 1.6051364365971108, 0.2899904695024077, 1.1066663322632424], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 5, 41.666666666666664, 886.0833333333333, 127, 1713, 1124.0, 1696.8, 1713.0, 1713.0, 0.05200861609406625, 36.30102363520724, 0.08269403818732637], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 457.68749999999994, 258, 577, 522.5, 566.5, 577.0, 577.0, 0.07694231250120223, 0.11924555658145305, 0.17304506415065304], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 189.1875, 126, 441, 140.0, 432.6, 441.0, 441.0, 0.11586226872804953, 0.086104674318404, 0.05815742785763424], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 231.99999999999997, 126, 439, 138.0, 429.90000000000003, 439.0, 439.0, 0.11565289674364812, 0.05265933897141205, 0.06474416314286748], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 300.1875, 124, 1386, 141.0, 1314.6000000000001, 1386.0, 1386.0, 0.11482209751266631, 12.941720272738364, 0.066269394169908], "isController": false}, {"data": ["register", 22, 7, 31.818181818181817, 1522.6818181818182, 171, 3141, 1420.5, 2967.7999999999997, 3137.7, 3141.0, 0.08988617142110036, 0.028137308276882093, 0.04055411249662927], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 327.93749999999994, 128, 1102, 146.5, 929.8000000000002, 1102.0, 1102.0, 0.1152604887044721, 4.263484351587713, 0.06663497003227294], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 21.875, 0.5490196078431373], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 9.375, 0.23529411764705882], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 6.25, 0.1568627450980392], "isController": false}, {"data": ["401/Unauthorized", 20, 62.5, 1.5686274509803921], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1275, 32, "401/Unauthorized", 20, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 15, "401/Unauthorized", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 5, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
