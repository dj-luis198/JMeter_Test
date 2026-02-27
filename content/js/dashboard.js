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

    var data = {"OkPercent": 98.16311535635562, "KoPercent": 1.836884643644379};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8163265306122449, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3a6f38d6-039a-4449-b03a-a6a94cd90985"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "see books"], "isController": true}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6ee69637-5dc1-49a1-8725-1ce32100a23c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=43958224-11d1-456f-9fc1-1b090532aa04"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ddc3e019-b640-4953-b6f6-6699b1fd7c92"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.49166666666666664, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8da1276c-0277-4d90-b5a1-03b9d88aba75"], "isController": false}, {"data": [0.2619047619047619, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ddc3e019-b640-4953-b6f6-6699b1fd7c92"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3a6f38d6-039a-4449-b03a-a6a94cd90985"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=db4d677f-bab9-43cc-9d68-b7b1c26296fb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/db4d677f-bab9-43cc-9d68-b7b1c26296fb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/844e7a22-5123-4e78-93b2-1b99e7f532e7"], "isController": false}, {"data": [0.38095238095238093, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f4f53bbd-f3cf-4e5a-8b17-7974bbf59872"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f4f53bbd-f3cf-4e5a-8b17-7974bbf59872"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9833333333333333, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.8055555555555556, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9055555555555556, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4eeee63f-2891-40d1-bd73-34840169af16"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/124a8b65-2c32-49a7-aaaa-f1790b887542"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f141bc17-fa6a-4c1b-847c-a02055c75645"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.023809523809523808, 500, 1500, "login"], "isController": true}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4eeee63f-2891-40d1-bd73-34840169af16"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f141bc17-fa6a-4c1b-847c-a02055c75645"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/839c0d0c-3490-431f-84c0-6972db50a3ea"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f172d6af-f8ca-4507-907d-7f8a51621366"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.6944444444444444, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6ee69637-5dc1-49a1-8725-1ce32100a23c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=124a8b65-2c32-49a7-aaaa-f1790b887542"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f172d6af-f8ca-4507-907d-7f8a51621366"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/43958224-11d1-456f-9fc1-1b090532aa04"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.4444444444444444, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=839c0d0c-3490-431f-84c0-6972db50a3ea"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.2619047619047619, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1361, 25, 1.836884643644379, 311.61058045554677, 97, 3017, 111.0, 790.0, 973.2999999999963, 1290.7599999999998, 5.34954837391024, 765.2612274555449, 3.9359751723568674], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/3a6f38d6-039a-4449-b03a-a6a94cd90985", 3, 0, 0.0, 288.3333333333333, 184, 497, 184.0, 497.0, 497.0, 497.0, 0.035226979169112986, 0.029367283089875764, 0.022590217761442894], "isController": false}, {"data": ["see books", 60, 0, 0.0, 1459.6333333333332, 1193, 2152, 1423.5, 1701.9, 1733.9499999999998, 2152.0, 0.2618795092377997, 315.12854311382375, 1.2876595009885952], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 286.625, 203, 718, 207.0, 508.0000000000002, 718.0, 718.0, 0.08334592204030816, 0.12916990066207917, 0.1874469320887009], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 120.99999999999999, 101, 301, 105.5, 210.0, 301.0, 301.0, 0.11145077060247102, 0.08652672131734811, 0.039617266112597124], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6ee69637-5dc1-49a1-8725-1ce32100a23c", 1, 0, 0.0, 533.0, 533, 533, 533.0, 533.0, 533.0, 533.0, 1.876172607879925, 0.3389569652908067, 1.2935330675422139], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=43958224-11d1-456f-9fc1-1b090532aa04", 1, 0, 0.0, 403.0, 403, 403, 403.0, 403.0, 403.0, 403.0, 2.4813895781637716, 0.44829792183622824, 1.710801799007444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 340.2105263157894, 201, 603, 398.0, 598.0, 603.0, 603.0, 0.10668163952835485, 0.16533570501122966, 0.23992950765019652], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ddc3e019-b640-4953-b6f6-6699b1fd7c92", 1, 0, 0.0, 366.0, 366, 366, 366.0, 366.0, 366.0, 366.0, 2.73224043715847, 0.49361765710382516, 1.8837517076502732], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 13, 0, 0.0, 116.30769230769229, 99, 297, 101.0, 220.19999999999993, 297.0, 297.0, 0.074758615930486, 0.055557916721777185, 0.037525320886982225], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 13, 0, 0.0, 132.15384615384616, 99, 305, 101.0, 301.0, 305.0, 305.0, 0.0747560365499514, 0.020003080092467467, 0.04263430209489416], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 13, 0, 0.0, 116.92307692307695, 98, 300, 101.0, 222.39999999999992, 300.0, 300.0, 0.07475775611719716, 0.020149551453463296, 0.04394938396733661], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 13, 0, 0.0, 116.23076923076923, 99, 294, 101.0, 217.99999999999994, 294.0, 294.0, 0.07475904584454719, 0.02014989907528811, 0.04402314906666207], "isController": false}, {"data": ["https://demoqa.com/books", 60, 0, 0.0, 935.6166666666666, 784, 1722, 811.0, 1277.3999999999999, 1297.7, 1722.0, 0.25905952756177486, 309.9252586277617, 0.5115413718065516], "isController": false}, {"data": ["deleteBook", 11, 0, 0.0, 432.9090909090909, 372, 525, 426.0, 517.6, 525.0, 525.0, 0.0905618125535138, 0.016361264963281302, 0.06155373196996641], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 11, 0, 0.0, 432.9090909090909, 372, 525, 426.0, 517.6, 525.0, 525.0, 0.09109429087235205, 0.01645746465955579, 0.061915650827301785], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8da1276c-0277-4d90-b5a1-03b9d88aba75", 1, 0, 0.0, 403.0, 403, 403, 403.0, 403.0, 403.0, 403.0, 2.4813895781637716, 0.7923968672456575, 1.480594758064516], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 8, 38.095238095238095, 948.1428571428573, 154, 1992, 1008.0, 1849.0000000000005, 1987.6, 1992.0, 0.09126704738063575, 0.028368161490521265, 0.04117712489243527], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 162.9375, 99, 304, 101.5, 301.2, 304.0, 304.0, 0.08437127579915418, 0.030496014116369083, 0.04767512642508358], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 10, 0, 0.0, 101.30000000000001, 99, 104, 101.0, 103.9, 104.0, 104.0, 0.04445293989517997, 0.011981456456122726, 0.026176877692181175], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ddc3e019-b640-4953-b6f6-6699b1fd7c92", 3, 0, 0.0, 255.33333333333331, 188, 387, 191.0, 387.0, 387.0, 387.0, 0.03456659254052933, 0.028816745929783727, 0.022166727638295174], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3a6f38d6-039a-4449-b03a-a6a94cd90985", 1, 0, 0.0, 608.0, 608, 608, 608.0, 608.0, 608.0, 608.0, 1.644736842105263, 0.2971448396381579, 1.1339689555921053], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 127.125, 99, 299, 102.0, 297.6, 299.0, 299.0, 0.08436771669320735, 0.06269905508157304, 0.042348639043270096], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 10, 0, 0.0, 100.89999999999999, 99, 102, 101.0, 102.0, 102.0, 102.0, 0.04445293989517997, 0.011981456456122726, 0.026133466618064788], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 168.37499999999997, 98, 690, 100.5, 487.0000000000002, 690.0, 690.0, 0.08437216562256111, 1.5718332588485309, 0.04923082906199245], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 173.9375, 99, 881, 101.0, 472.90000000000043, 881.0, 881.0, 0.084370830894489, 4.766133161230021, 0.04914765686383075], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 128.42857142857142, 98, 300, 100.0, 297.0, 300.0, 300.0, 0.11104677448779675, 0.02993057593616397, 0.06528335765786489], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=db4d677f-bab9-43cc-9d68-b7b1c26296fb", 1, 0, 0.0, 200.0, 200, 200, 200.0, 200.0, 200.0, 200.0, 5.0, 0.9033203125, 3.447265625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 142.7857142857143, 99, 299, 100.5, 298.5, 299.0, 299.0, 0.11087264692605586, 0.029883643116788493, 0.06528926376602703], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 10, 0, 0.0, 121.0, 97, 307, 101.0, 286.5000000000001, 307.0, 307.0, 0.04441207297791832, 0.011883699214794551, 0.02532876037021904], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 115.92857142857143, 98, 298, 102.0, 201.5, 298.0, 298.0, 0.11104677448779675, 0.08252597205587239, 0.05574027547531986], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 10, 0, 0.0, 104.8, 99, 114, 104.5, 113.5, 114.0, 114.0, 0.04445116150885022, 0.03303450576976076, 0.022312399429247086], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 142.92857142857142, 99, 304, 101.0, 300.0, 304.0, 304.0, 0.11104677448779675, 0.029713687704742493, 0.06333136357507159], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 125.6, 102, 299, 105.5, 280.9000000000001, 299.0, 299.0, 0.046378747402790146, 0.03650514688149302, 0.01648619536583556], "isController": false}, {"data": ["deleteAccount", 11, 0, 0.0, 445.9090909090909, 372, 702, 409.0, 661.0000000000001, 702.0, 702.0, 0.09120758847136082, 0.01647793346406421, 0.06208172769974462], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/db4d677f-bab9-43cc-9d68-b7b1c26296fb", 3, 0, 0.0, 312.3333333333333, 177, 385, 375.0, 385.0, 385.0, 385.0, 0.06341556217895872, 0.029437041558331746, 0.04066688069418902], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/844e7a22-5123-4e78-93b2-1b99e7f532e7", 1, 0, 0.0, 216.0, 216, 216, 216.0, 216.0, 216.0, 216.0, 4.62962962962963, 1.4784071180555556, 2.7624059606481484], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1340.5238095238092, 842, 3017, 1129.0, 2376.2000000000003, 2959.7999999999993, 3017.0, 0.0922833538407453, 0.047763845249604496, 0.042446737948233434], "isController": false}, {"data": ["goToProfile", 12, 1, 8.333333333333334, 190.16666666666666, 103, 274, 190.5, 254.20000000000007, 274.0, 274.0, 0.07509715694679991, 0.16488617304888198, 0.04854302715075128], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 0, 0.0, 228.2, 202, 422, 207.0, 401.30000000000007, 422.0, 422.0, 0.04439038681783073, 0.06879642957021227, 0.09983502035299235], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f4f53bbd-f3cf-4e5a-8b17-7974bbf59872", 3, 0, 0.0, 279.0, 191, 444, 202.0, 444.0, 444.0, 444.0, 0.018638634160888692, 0.025694861872188675, 0.011952509536767813], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 121.6875, 100, 417, 102.0, 200.00000000000023, 417.0, 417.0, 0.0833897951738156, 0.0619722989524157, 0.04185776828060666], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 125.99999999999999, 98, 310, 101.0, 300.2, 310.0, 310.0, 0.08339022979220198, 0.022313401331116544, 0.047558490428365185], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 646.625, 493, 710, 694.0, 710.0, 710.0, 710.0, 0.06231403156205699, 18.322394299823962, 0.03553847112523562], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 781.375, 681, 912, 746.0, 912.0, 912.0, 912.0, 0.06222388152572957, 55.98915797476821, 0.035426291923340174], "isController": false}, {"data": ["addBook", 60, 16, 26.666666666666668, 925.5666666666668, 508, 1984, 831.0, 1461.5, 1666.85, 1984.0, 0.29357654519121623, 77.23801561674316, 1.069332497149861], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 200.87499999999997, 98, 310, 199.5, 310.0, 310.0, 310.0, 0.06250537155536805, 0.11060520826008485, 0.03460990788270867], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f4f53bbd-f3cf-4e5a-8b17-7974bbf59872", 1, 0, 0.0, 391.0, 391, 391, 391.0, 391.0, 391.0, 391.0, 2.557544757033248, 0.46205642583120204, 1.7633072250639386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 117.35714285714286, 99, 296, 103.0, 204.5, 296.0, 296.0, 0.06778905981416114, 0.05037839308454749, 0.0340269304145301], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 158.64285714285717, 98, 304, 102.0, 303.5, 304.0, 304.0, 0.06778971630003729, 0.032684327501803695, 0.0378479972980956], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 241.64285714285714, 98, 886, 101.5, 883.0, 886.0, 886.0, 0.06778971630003729, 8.72956208145903, 0.03902069886355383], "isController": false}, {"data": ["https://demoqa.com/books-0", 60, 0, 0.0, 180.78333333333327, 99, 661, 104.0, 403.9, 412.65, 661.0, 0.2598358703419007, 0.1931006809865102, 0.1256042537297274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 265.57142857142856, 98, 692, 214.5, 689.5, 692.0, 692.0, 0.06779004454774355, 2.8631647358609333, 0.039087089022854925], "isController": false}, {"data": ["https://demoqa.com/books-3", 60, 0, 0.0, 570.6666666666665, 488, 795, 500.5, 709.9, 784.8, 795.0, 0.2598392461197339, 76.40136583417059, 0.13068087085123337], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 151.625, 100, 308, 102.0, 308.0, 308.0, 308.0, 0.062404929989469164, 0.04637710129100199, 0.03504183080463357], "isController": false}, {"data": ["https://demoqa.com/books-1", 60, 0, 0.0, 158.24999999999997, 98, 420, 104.5, 305.0, 309.0, 420.0, 0.2605037273741659, 0.4609694863300669, 0.12669028928938925], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 522.1111111111112, 99, 994, 685.5, 903.1000000000001, 994.0, 994.0, 0.08334761047031206, 41.67461013286999, 0.045020009214541384], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 125.625, 98, 301, 101.5, 298.2, 301.0, 301.0, 0.08339109904256593, 0.022476507163816602, 0.049024845335571], "isController": false}, {"data": ["https://demoqa.com/books-2", 60, 0, 0.0, 748.3666666666667, 679, 1027, 697.5, 896.9, 910.4499999999999, 1027.0, 0.25985275010827197, 233.81596131983542, 0.13043389995669122], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 394.9444444444444, 99, 693, 492.0, 691.2, 693.0, 693.0, 0.08334722453742291, 13.624901748671075, 0.04510119452779167], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 139.31578947368422, 101, 431, 106.0, 379.0, 431.0, 431.0, 0.10300503640414839, 0.07695200473552102, 0.03661507153428713], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 138.125, 99, 311, 100.5, 301.2, 311.0, 311.0, 0.08339066441511873, 0.02247639001813747, 0.0491060260178873], "isController": false}, {"data": ["deleteBooks", 11, 0, 0.0, 425.09090909090907, 200, 608, 391.0, 593.0, 608.0, 608.0, 0.09107920578932552, 0.016454739327173066, 0.06279484305396857], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 16, 8.88888888888889, 156.90000000000006, 99, 1466, 108.0, 274.70000000000005, 318.4999999999999, 821.2399999999982, 0.7319364191230588, 1.5936414484920076, 0.34919863763251097], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 13, 0, 0.0, 105.07692307692307, 101, 111, 105.0, 110.6, 111.0, 111.0, 0.07379445406295235, 0.05714746296086056, 0.02623162234269009], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 426.92857142857144, 200, 991, 401.0, 985.5, 991.0, 991.0, 0.06775592380362397, 11.669955904202803, 0.1499080909042512], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4eeee63f-2891-40d1-bd73-34840169af16", 3, 0, 0.0, 309.0, 202, 396, 329.0, 396.0, 396.0, 396.0, 0.0578714867184938, 0.03720578980111499, 0.037111597928200776], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 106.4375, 101, 118, 105.5, 114.5, 118.0, 118.0, 0.08463459015699716, 0.06868295353561, 0.030084951969870086], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/124a8b65-2c32-49a7-aaaa-f1790b887542", 3, 0, 0.0, 252.66666666666666, 183, 372, 203.0, 372.0, 372.0, 372.0, 0.02202837254383646, 0.026036790594619205, 0.014126267549270127], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f141bc17-fa6a-4c1b-847c-a02055c75645", 3, 0, 0.0, 254.33333333333331, 172, 409, 182.0, 409.0, 409.0, 409.0, 0.018876116050361477, 0.022310930136348477, 0.012104800982816442], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 515.9047619047619, 168, 1201, 473.0, 894.6000000000001, 1173.4999999999995, 1201.0, 0.091195309955488, 0.056017431603517534, 0.04123381690370209], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 112.66666666666666, 99, 296, 102.0, 124.10000000000028, 296.0, 296.0, 0.08334645268236668, 0.06194008837039163, 0.04183601238157858], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 197.38888888888889, 97, 402, 105.5, 325.5000000000001, 402.0, 402.0, 0.08334645268236668, 0.09184750145856292, 0.04364474616374799], "isController": false}, {"data": ["login", 21, 0, 0.0, 2379.0476190476197, 1464, 4026, 2405.0, 3259.8, 3950.499999999999, 4026.0, 0.09075861234403564, 41.48403803164018, 0.19426749291218456], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 13, 0, 0.0, 250.53846153846158, 202, 602, 206.0, 519.1999999999999, 602.0, 602.0, 0.07471178492201239, 0.11578867448362662, 0.16802855534706496], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 118.8125, 102, 305, 105.0, 181.10000000000014, 305.0, 305.0, 0.08159185713265815, 0.06605434527634142, 0.02900335546512458], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4eeee63f-2891-40d1-bd73-34840169af16", 1, 0, 0.0, 376.0, 376, 376, 376.0, 376.0, 376.0, 376.0, 2.6595744680851063, 0.4804895279255319, 1.8336519281914894], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 302.49999999999994, 201, 596, 207.5, 501.0, 596.0, 596.0, 0.11078403443800842, 0.17169361587218687, 0.2491558899518881], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f141bc17-fa6a-4c1b-847c-a02055c75645", 1, 0, 0.0, 526.0, 526, 526, 526.0, 526.0, 526.0, 526.0, 1.9011406844106464, 0.34346779942965777, 1.3107473859315588], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/839c0d0c-3490-431f-84c0-6972db50a3ea", 3, 0, 0.0, 286.6666666666667, 189, 397, 274.0, 397.0, 397.0, 397.0, 0.02436231636904037, 0.02879543318228697, 0.015622969806969245], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f172d6af-f8ca-4507-907d-7f8a51621366", 1, 0, 0.0, 374.0, 374, 374, 374.0, 374.0, 374.0, 374.0, 2.6737967914438503, 0.4830589906417112, 1.8434575534759359], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 118.92857142857143, 102, 300, 104.5, 206.0, 300.0, 300.0, 0.07046152297548945, 0.05841975879510796, 0.025046869495193518], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 648.0, 202, 1098, 792.0, 1004.4000000000001, 1098.0, 1098.0, 0.08330672146397679, 55.42616016180017, 0.175517210358728], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6ee69637-5dc1-49a1-8725-1ce32100a23c", 3, 0, 0.0, 364.0, 187, 458, 447.0, 458.0, 458.0, 458.0, 0.023817841150878087, 0.0238876199823748, 0.015273810894280542], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 116.50000000000001, 100, 304, 103.5, 136.60000000000025, 304.0, 304.0, 0.08470628097073399, 0.06576317712083352, 0.030110435813815596], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=124a8b65-2c32-49a7-aaaa-f1790b887542", 1, 0, 0.0, 524.0, 524, 524, 524.0, 524.0, 524.0, 524.0, 1.9083969465648853, 0.34477874522900764, 1.3157502385496183], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f172d6af-f8ca-4507-907d-7f8a51621366", 3, 0, 0.0, 329.6666666666667, 208, 458, 323.0, 458.0, 458.0, 458.0, 0.024822929767657376, 0.029339862625769514, 0.015918350143972994], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/43958224-11d1-456f-9fc1-1b090532aa04", 3, 0, 0.0, 392.0, 190, 702, 284.0, 702.0, 702.0, 702.0, 0.037241173841799494, 0.02394248643800586, 0.023881872548289388], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 371.1875, 202, 1180, 303.5, 770.5000000000005, 1180.0, 1180.0, 0.08432280879276088, 6.427478308286823, 0.18829554946850277], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 1, 11.11111111111111, 841.4444444444443, 103, 1184, 890.0, 1184.0, 1184.0, 1184.0, 0.06844783134454357, 72.79083733087683, 0.14210203527725174], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=839c0d0c-3490-431f-84c0-6972db50a3ea", 1, 0, 0.0, 375.0, 375, 375, 375.0, 375.0, 375.0, 375.0, 2.6666666666666665, 0.4817708333333333, 1.8385416666666667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 133.05263157894737, 100, 299, 102.0, 297.0, 299.0, 299.0, 0.10674577090110285, 0.07932962075755788, 0.05358137328434264], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 173.42105263157896, 99, 301, 102.0, 298.0, 301.0, 301.0, 0.1067475700882072, 0.028563314652508567, 0.06087947356593067], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 163.57894736842107, 99, 301, 102.0, 301.0, 301.0, 301.0, 0.10674697035243355, 0.028771644352804354, 0.06275554311734863], "isController": false}, {"data": ["register", 21, 8, 38.095238095238095, 948.1428571428573, 154, 1992, 1008.0, 1849.0000000000005, 1987.6, 1992.0, 0.09204954895721011, 0.028611383241722115, 0.04153016759592878], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 132.57894736842107, 99, 306, 101.0, 306.0, 306.0, 306.0, 0.10675176842732172, 0.028772937583926555, 0.06286261363444823], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 32.0, 0.5878030859662013], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 4.0, 0.07347538574577517], "isController": false}, {"data": ["401/Unauthorized", 16, 64.0, 1.1756061719324027], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1361, 25, "401/Unauthorized", 16, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 1, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 16, "401/Unauthorized", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 1, "Test failed: code expected to contain /200/", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
