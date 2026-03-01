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

    var data = {"OkPercent": 97.67616191904048, "KoPercent": 2.3238380809595203};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7535301668806161, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.7, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/90d4d91c-24bc-45f9-84a5-497f75de1dc0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6d74f6c6-d4ca-4cf8-aa69-6e9c5017d2b5"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6066ddf9-412f-45fa-a447-e5d9bdff4334"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/78afb3b8-5908-4bf9-96e5-61f05da86bea"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bf7e84df-7c65-45db-ab9a-0bbb5f76b738"], "isController": false}, {"data": [0.782608695652174, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7608695652173914, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b127a5ca-42ac-4a7f-85d3-30e8a94369a8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b39b0b5e-0cf9-4203-bf66-448176174e65"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fc2992ac-3322-4df1-bb7a-15117be509db"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=946ddd20-e366-4471-bc23-aa311eb75a3a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fd839f05-11f2-49c1-bd2b-264a45dee057"], "isController": false}, {"data": [0.6956521739130435, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6066ddf9-412f-45fa-a447-e5d9bdff4334"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=74ed28f6-c729-4556-9f3b-4c4ad203b15e"], "isController": false}, {"data": [0.021739130434782608, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=de9c59b6-178c-4c74-8163-96337d62c89f"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/386c82a4-72ff-4378-af1b-ae09185b617e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/956ba7c6-f874-4a10-8018-b93a7d5f382d"], "isController": false}, {"data": [0.6739130434782609, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b0e5730f-3f48-430c-9824-545f415514a9"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2727272727272727, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.22, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.3482142857142857, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.22, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=578c74b1-0045-4642-bf6b-dbcabe5d58fc"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.45652173913043476, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/74ed28f6-c729-4556-9f3b-4c4ad203b15e"], "isController": false}, {"data": [0.25, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=78afb3b8-5908-4bf9-96e5-61f05da86bea"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fc2992ac-3322-4df1-bb7a-15117be509db"], "isController": false}, {"data": [0.9107142857142857, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9147727272727273, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b127a5ca-42ac-4a7f-85d3-30e8a94369a8"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/946ddd20-e366-4471-bc23-aa311eb75a3a"], "isController": false}, {"data": [0.6944444444444444, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=386c82a4-72ff-4378-af1b-ae09185b617e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/578c74b1-0045-4642-bf6b-dbcabe5d58fc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b0e5730f-3f48-430c-9824-545f415514a9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6d74f6c6-d4ca-4cf8-aa69-6e9c5017d2b5"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fd839f05-11f2-49c1-bd2b-264a45dee057"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/de9c59b6-178c-4c74-8163-96337d62c89f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=956ba7c6-f874-4a10-8018-b93a7d5f382d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1334, 31, 2.3238380809595203, 442.5907046476757, 141, 2305, 164.0, 1175.0, 1341.25, 1785.9500000000003, 5.229936880072136, 744.4271463777101, 3.81872806974556], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 2177.2321428571436, 1731, 2977, 2127.5, 2579.5, 2653.5, 2977.0, 0.25154181658109753, 302.69024200933626, 1.2368291469588144], "isController": true}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 500.7333333333333, 153, 907, 476.0, 865.0, 907.0, 907.0, 0.08347663488989432, 0.016352942342688283, 0.05620542695516192], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 500.7333333333333, 153, 907, 476.0, 865.0, 907.0, 907.0, 0.08487619392512788, 0.016627113770879543, 0.057147760258702635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 224.12500000000003, 145, 450, 151.5, 447.9, 450.0, 450.0, 0.11965479591378872, 0.04324924935311626, 0.06761255496642188], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/90d4d91c-24bc-45f9-84a5-497f75de1dc0", 1, 0, 0.0, 252.0, 252, 252, 252.0, 252.0, 252.0, 252.0, 3.968253968253968, 1.2672061011904763, 2.3677765376984126], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 152.375, 144, 165, 153.0, 163.6, 165.0, 165.0, 0.11965390109109401, 0.0889224792288306, 0.06006064957111555], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 222.06249999999997, 142, 1024, 149.5, 623.6000000000004, 1024.0, 1024.0, 0.11965390109109401, 2.229123549196449, 0.06981758388860222], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 273.49999999999994, 143, 1272, 150.0, 696.6000000000006, 1272.0, 1272.0, 0.11965121670330985, 6.7591325777545945, 0.06969917066750422], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6d74f6c6-d4ca-4cf8-aa69-6e9c5017d2b5", 1, 0, 0.0, 570.0, 570, 570, 570.0, 570.0, 570.0, 570.0, 1.7543859649122808, 0.3169544956140351, 1.2095668859649125], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 277.86666666666673, 147, 509, 258.0, 441.80000000000007, 509.0, 509.0, 0.08380918325157283, 0.14872310598229949, 0.0541704147995843], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 149.25, 143, 158, 149.0, 156.6, 158.0, 158.0, 0.08512449457331348, 0.06326146520536284, 0.042728506065120235], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 166.4375, 143, 442, 148.5, 239.0000000000002, 442.0, 442.0, 0.08512449457331348, 0.030768265189402, 0.04810074284422217], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 951.8571428571429, 710, 1141, 1009.0, 1141.0, 1141.0, 1141.0, 0.07210919392222509, 21.202497263713624, 0.041124774658768994], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1134.4285714285713, 989, 1500, 1040.0, 1500.0, 1500.0, 1500.0, 0.07186194294161731, 64.66150257868883, 0.04091358665523719], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 359.7142857142857, 151, 451, 438.0, 451.0, 451.0, 451.0, 0.07231853214042193, 0.12796990257660598, 0.04004356223009691], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6066ddf9-412f-45fa-a447-e5d9bdff4334", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 0.4221122955607477, 1.6108717873831777], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 150.13333333333333, 144, 153, 150.0, 152.4, 153.0, 153.0, 0.10930634195396018, 0.08123254514351921, 0.05486665992610891], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 227.46666666666667, 144, 450, 151.0, 448.8, 450.0, 450.0, 0.10931351114997814, 0.029249904350677744, 0.062342861827721904], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 188.5333333333333, 145, 449, 150.0, 439.4, 449.0, 449.0, 0.10931112131348243, 0.02946276316652456, 0.064262983428434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 275.6, 147, 599, 151.0, 506.00000000000006, 599.0, 599.0, 0.10930793502736343, 0.029461904362844047, 0.06436785627099623], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/78afb3b8-5908-4bf9-96e5-61f05da86bea", 3, 0, 0.0, 684.3333333333334, 281, 982, 790.0, 982.0, 982.0, 982.0, 0.04210053608015942, 0.027066588137472286, 0.026998065129529316], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 149.99999999999997, 143, 155, 150.0, 155.0, 155.0, 155.0, 0.07252908934547678, 0.05390101268740998, 0.04072678356801674], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bf7e84df-7c65-45db-ab9a-0bbb5f76b738", 1, 0, 0.0, 238.0, 238, 238, 238.0, 238.0, 238.0, 238.0, 4.201680672268908, 1.341747636554622, 2.5070575105042017], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 23, 0, 0.0, 623.8695652173911, 144, 1343, 448.0, 1323.8, 1340.6, 1343.0, 0.11523565691839813, 45.099836587696835, 0.06344028225220576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 202.81250000000003, 142, 1021, 149.0, 413.4000000000006, 1021.0, 1021.0, 0.08512721197739873, 4.808861352046245, 0.04958826361769369], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 23, 0, 0.0, 574.6086956521739, 141, 1195, 440.0, 1185.0, 1194.6, 1195.0, 0.11497240662241062, 14.71564793199632, 0.0634076337304047], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 222.93750000000003, 142, 739, 150.0, 553.5000000000002, 739.0, 739.0, 0.08512268306697027, 1.5858152192707113, 0.049668753059096425], "isController": false}, {"data": ["deleteBooks", 15, 2, 13.333333333333334, 403.7333333333333, 153, 672, 428.0, 610.8000000000001, 672.0, 672.0, 0.08503160341260169, 0.016657558246648337, 0.05781706159122474], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b127a5ca-42ac-4a7f-85d3-30e8a94369a8", 1, 0, 0.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 0.7084865196078431, 2.703737745098039], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b39b0b5e-0cf9-4203-bf66-448176174e65", 1, 0, 0.0, 232.0, 232, 232, 232.0, 232.0, 232.0, 232.0, 4.310344827586206, 1.3764480064655171, 2.571895204741379], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fc2992ac-3322-4df1-bb7a-15117be509db", 3, 0, 0.0, 336.6666666666667, 240, 526, 244.0, 526.0, 526.0, 526.0, 0.02362260525839193, 0.027921119691803744, 0.015148610793955762], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 429.2, 300, 752, 304.0, 661.4000000000001, 752.0, 752.0, 0.10918619886446353, 0.16921728281045276, 0.24556232029771438], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=946ddd20-e366-4471-bc23-aa311eb75a3a", 1, 0, 0.0, 483.0, 483, 483, 483.0, 483.0, 483.0, 483.0, 2.070393374741201, 0.37404567805383027, 1.427439182194617], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fd839f05-11f2-49c1-bd2b-264a45dee057", 1, 0, 0.0, 440.0, 440, 440, 440.0, 440.0, 440.0, 440.0, 2.2727272727272725, 0.41060014204545453, 1.5669389204545454], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 632.695652173913, 155, 1796, 615.0, 1178.8000000000006, 1713.5999999999988, 1796.0, 0.10222222222222221, 0.06279079861111111, 0.04621961805555556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 23, 0, 0.0, 163.08695652173913, 144, 451, 149.0, 154.6, 391.79999999999916, 451.0, 0.11523219286863029, 0.08563642458303482, 0.057841159311011685], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 23, 0, 0.0, 265.34782608695645, 146, 452, 152.0, 450.0, 451.6, 452.0, 0.11523334752874571, 0.10608396064530674, 0.06151127909015757], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6066ddf9-412f-45fa-a447-e5d9bdff4334", 3, 0, 0.0, 443.33333333333337, 247, 769, 314.0, 769.0, 769.0, 769.0, 0.047885075818036714, 0.030785489824421388, 0.030707551875498805], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=74ed28f6-c729-4556-9f3b-4c4ad203b15e", 1, 0, 0.0, 262.0, 262, 262, 262.0, 262.0, 262.0, 262.0, 3.8167938931297707, 0.6895574904580153, 2.6315004770992365], "isController": false}, {"data": ["login", 23, 0, 0.0, 2492.9130434782605, 1464, 3728, 2511.0, 3483.2000000000003, 3698.7999999999997, 3728.0, 0.09808185997321939, 35.844976056565514, 0.19748386047002534], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 173.3125, 144, 453, 154.5, 252.8000000000002, 453.0, 453.0, 0.08665370471666946, 0.07015226680675682, 0.030802684098503598], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=de9c59b6-178c-4c74-8163-96337d62c89f", 1, 0, 0.0, 438.0, 438, 438, 438.0, 438.0, 438.0, 438.0, 2.28310502283105, 0.4124750285388128, 1.574093892694064], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/386c82a4-72ff-4378-af1b-ae09185b617e", 3, 0, 0.0, 518.6666666666666, 297, 750, 509.0, 750.0, 750.0, 750.0, 0.02611011505857369, 0.026186609536284357, 0.016743791232223363], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/956ba7c6-f874-4a10-8018-b93a7d5f382d", 3, 0, 0.0, 377.0, 305, 429, 397.0, 429.0, 429.0, 429.0, 0.032802300534677496, 0.026662547016630768, 0.02103532944443837], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 23, 0, 0.0, 855.3913043478262, 298, 1493, 751.0, 1475.8, 1491.4, 1493.0, 0.11488568873970399, 59.8585608491426, 0.24560035421006096], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b0e5730f-3f48-430c-9824-545f415514a9", 3, 0, 0.0, 382.0, 286, 504, 356.0, 504.0, 504.0, 504.0, 0.026761103627913615, 0.02683950529869852, 0.017161254605139918], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 504.0, 297, 1424, 453.5, 859.8000000000006, 1424.0, 1424.0, 0.11951715071112705, 9.11015542131663, 0.2668856491648739], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, 36.36363636363637, 885.8181818181818, 147, 1655, 1175.0, 1618.8000000000002, 1655.0, 1655.0, 0.10948977763621523, 83.36655093514224, 0.18349063675770907], "isController": false}, {"data": ["register", 25, 9, 36.0, 1089.12, 155, 1960, 1134.0, 1867.0, 1933.8999999999999, 1960.0, 0.09829710102189666, 0.03062569053713468, 0.044348887375113534], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 155.4444444444444, 148, 176, 153.5, 163.40000000000003, 176.0, 176.0, 0.09094859383368534, 0.07060950400173813, 0.03232938296431784], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 392.5625, 293, 1172, 301.5, 793.3000000000004, 1172.0, 1172.0, 0.08505525933880168, 6.483309109750523, 0.1899311351421752], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 13, 0, 0.0, 494.53846153846155, 295, 894, 588.0, 830.4, 894.0, 894.0, 0.09402166837834319, 0.14571522237932683, 0.21145693581574648], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 186.99999999999997, 147, 442, 151.5, 442.0, 442.0, 442.0, 0.035793382698373635, 0.026600355696740567, 0.01796660029976958], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 148.125, 145, 153, 147.5, 153.0, 153.0, 153.0, 0.03579370299280099, 0.009577611933620578, 0.020413596238081817], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 184.0, 144, 426, 151.0, 426.0, 426.0, 426.0, 0.03579370299280099, 0.009647521509778392, 0.021042782423502146], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 257.125, 146, 440, 152.0, 440.0, 440.0, 440.0, 0.03574763953867671, 0.009635105969408957, 0.021050611954904354], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 153.5, 153, 154, 153.5, 154.0, 154.0, 154.0, 0.3951007506914263, 0.11652385420782299, 0.24423708514421177], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1412.3392857142858, 1135, 2305, 1202.0, 1947.0, 2029.9499999999998, 2305.0, 0.24633575563493043, 294.70320390442174, 0.4864168924744427], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 9, 36.0, 1089.12, 155, 1960, 1134.0, 1867.0, 1933.8999999999999, 1960.0, 0.09907425020607444, 0.030867821079830066, 0.04469951522969374], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 152.14285714285714, 149, 156, 152.0, 156.0, 156.0, 156.0, 0.04005584929845041, 0.010796303131222961, 0.02358757531930234], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 192.57142857142858, 143, 449, 150.0, 449.0, 449.0, 449.0, 0.04005722460658083, 0.010796673819742489, 0.023549266809728183], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 479.7777777777777, 143, 1462, 157.5, 1357.6000000000001, 1462.0, 1462.0, 0.08834702712253734, 17.684034066368252, 0.05025120618232863], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=578c74b1-0045-4642-bf6b-dbcabe5d58fc", 1, 0, 0.0, 419.0, 419, 419, 419.0, 419.0, 419.0, 419.0, 2.3866348448687353, 0.431179146778043, 1.6454728520286397], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 354.55555555555554, 142, 1142, 152.0, 1064.6000000000001, 1142.0, 1142.0, 0.08822015830617295, 5.782862008969049, 0.05026519653490823], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 191.7142857142857, 146, 445, 150.0, 445.0, 445.0, 445.0, 0.04005584929845041, 0.010718069050561926, 0.0228443515530225], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 201.27777777777774, 145, 474, 150.5, 447.00000000000006, 474.0, 474.0, 0.08834355828220859, 0.06565375766871166, 0.044344325153374234], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 194.2857142857143, 148, 450, 153.0, 450.0, 450.0, 450.0, 0.0400547032804802, 0.029767216012153742, 0.020105583482584788], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 233.11111111111114, 143, 452, 153.5, 449.3, 452.0, 452.0, 0.08821886119252297, 0.05305001396798635, 0.048665873513757237], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 159.57142857142856, 147, 185, 157.0, 185.0, 185.0, 185.0, 0.03939888557437946, 0.03101123220014634, 0.014005072606517703], "isController": false}, {"data": ["deleteAccount", 15, 2, 13.333333333333334, 592.5333333333334, 149, 1292, 504.0, 1262.0, 1292.0, 1292.0, 0.08357896261791598, 0.016068273216842833, 0.05687831355762212], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1227.6086956521738, 761, 1783, 1230.0, 1556.0000000000002, 1747.1999999999994, 1783.0, 0.1011544804837823, 0.05235534634414513, 0.04652710967564596], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 390.42857142857144, 302, 900, 306.0, 900.0, 900.0, 900.0, 0.040020353208203026, 0.06202373099747872, 0.09000671234227693], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/74ed28f6-c729-4556-9f3b-4c4ad203b15e", 3, 0, 0.0, 591.3333333333333, 261, 1242, 271.0, 1242.0, 1242.0, 1242.0, 0.07216916452163873, 0.032654667540715436, 0.04628035615482691], "isController": false}, {"data": ["addBook", 60, 14, 23.333333333333332, 1308.8, 751, 2306, 1158.5, 2055.8, 2153.0, 2306.0, 0.2809093973557062, 90.72822597376071, 1.0194441607714708], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=78afb3b8-5908-4bf9-96e5-61f05da86bea", 1, 0, 0.0, 672.0, 672, 672, 672.0, 672.0, 672.0, 672.0, 1.488095238095238, 0.26884533110119047, 1.025971912202381], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fc2992ac-3322-4df1-bb7a-15117be509db", 1, 0, 0.0, 410.0, 410, 410, 410.0, 410.0, 410.0, 410.0, 2.4390243902439024, 0.4406440548780488, 1.681592987804878], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 279.6071428571429, 144, 790, 153.0, 605.3, 621.6999999999999, 790.0, 0.24779199631851892, 0.18415010663905554, 0.1197822638453778], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 847.892857142857, 711, 1221, 750.5, 1047.3, 1089.7499999999998, 1221.0, 0.24756195680043855, 72.79143512992583, 0.12450625757053306], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 219.28571428571428, 146, 454, 153.0, 445.3, 448.45, 454.0, 0.24852659234538096, 0.4397755716111624, 0.12086547166796847], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1127.5714285714282, 986, 1486, 1046.0, 1351.4, 1376.85, 1486.0, 0.2472264285052072, 222.4547749466918, 0.12409607837077784], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 13, 0, 0.0, 205.3846153846154, 147, 510, 154.0, 487.59999999999997, 510.0, 510.0, 0.09101219563421498, 0.06799250943376413, 0.03235199141684986], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 14, 7.954545454545454, 204.23863636363643, 144, 514, 157.0, 346.1000000000001, 450.45000000000005, 503.9899999999999, 0.7025218939351604, 1.5256299184016828, 0.3372552586857252], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 159.00000000000003, 150, 197, 154.5, 197.0, 197.0, 197.0, 0.03739418613891005, 0.02895858360171452, 0.013292464604065682], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 155.875, 148, 164, 155.5, 161.9, 164.0, 164.0, 0.12141079341953499, 0.09852770442542343, 0.04315774297335034], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b127a5ca-42ac-4a7f-85d3-30e8a94369a8", 3, 0, 0.0, 599.3333333333333, 248, 1292, 258.0, 1292.0, 1292.0, 1292.0, 0.08581235697940504, 0.03977760297482837, 0.05502940860983981], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 445.75, 293, 879, 307.5, 879.0, 879.0, 879.0, 0.035723057000602826, 0.05536376119136395, 0.08034199245350421], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/946ddd20-e366-4471-bc23-aa311eb75a3a", 3, 0, 0.0, 362.6666666666667, 275, 458, 355.0, 458.0, 458.0, 458.0, 0.05100826333866087, 0.03279339846805182, 0.03271037720610739], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 717.6666666666666, 294, 1614, 582.5, 1503.3000000000002, 1614.0, 1614.0, 0.08815232722143865, 23.54199915092168, 0.19324451680281304], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=386c82a4-72ff-4378-af1b-ae09185b617e", 1, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 2.277904328018223, 0.4115354498861048, 1.570508257403189], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/578c74b1-0045-4642-bf6b-dbcabe5d58fc", 3, 0, 0.0, 296.0, 233, 407, 248.0, 407.0, 407.0, 407.0, 0.02055639303823489, 0.02429696065163766, 0.013182322358503494], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 174.0666666666667, 151, 456, 153.0, 280.2000000000001, 456.0, 456.0, 0.11276160692807313, 0.09349082449407625, 0.04008322746271349], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b0e5730f-3f48-430c-9824-545f415514a9", 1, 0, 0.0, 420.0, 420, 420, 420.0, 420.0, 420.0, 420.0, 2.3809523809523814, 0.43015252976190477, 1.6415550595238095], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 23, 0, 0.0, 155.56521739130437, 149, 169, 154.0, 166.0, 168.8, 169.0, 0.11697988454594004, 0.09081934395900618, 0.04158269333468962], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6d74f6c6-d4ca-4cf8-aa69-6e9c5017d2b5", 3, 0, 0.0, 388.0, 307, 441, 416.0, 441.0, 441.0, 441.0, 0.023053337739082323, 0.02312087681448979, 0.014783553172523493], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fd839f05-11f2-49c1-bd2b-264a45dee057", 3, 0, 0.0, 336.6666666666667, 239, 518, 253.0, 518.0, 518.0, 518.0, 0.02720767619237641, 0.02728738618122126, 0.01744763089159555], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/de9c59b6-178c-4c74-8163-96337d62c89f", 3, 0, 0.0, 397.3333333333333, 245, 484, 463.0, 484.0, 484.0, 484.0, 0.041385589537722964, 0.03425896946433252, 0.026539587040792394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 13, 0, 0.0, 173.76923076923077, 144, 449, 150.0, 333.39999999999986, 449.0, 449.0, 0.09412582450602043, 0.0699509301260562, 0.04724675175399854], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 13, 0, 0.0, 272.2307692307692, 144, 582, 151.0, 530.8, 582.0, 582.0, 0.09412582450602043, 0.025186011635399998, 0.053681134288589775], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 13, 0, 0.0, 217.07692307692307, 145, 444, 149.0, 444.0, 444.0, 444.0, 0.09412991376251746, 0.025370953318803537, 0.055338093833042494], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=956ba7c6-f874-4a10-8018-b93a7d5f382d", 1, 0, 0.0, 513.0, 513, 513, 513.0, 513.0, 513.0, 513.0, 1.949317738791423, 0.35217166179337234, 1.3439632066276803], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 13, 0, 0.0, 261.2307692307692, 143, 451, 150.0, 449.8, 451.0, 451.0, 0.0941278690898559, 0.025370402215625223, 0.05542881353631163], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 29.032258064516128, 0.6746626686656672], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 6.451612903225806, 0.14992503748125938], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 6.451612903225806, 0.14992503748125938], "isController": false}, {"data": ["401/Unauthorized", 18, 58.064516129032256, 1.3493253373313343], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1334, 31, "401/Unauthorized", 18, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 14, "401/Unauthorized", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
