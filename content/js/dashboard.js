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

    var data = {"OkPercent": 98.54517611026034, "KoPercent": 1.454823889739663};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7666227781435154, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7b434a0b-9c9a-40e8-922e-45f8a9e0e63d"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/ec90984f-7661-441d-b794-7a5b7d5d3468"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=01d8cd75-3538-4576-8929-0e04ab44505e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3282aca9-6d9e-4be9-95fe-91f2a6a38cb3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2ef18ae1-76ea-4d30-97cc-e0677e542730"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=51f6d495-63f4-4e12-92f7-e0b3f35d6eba"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0a1700b3-da6a-42c5-8f1d-c8c0e1504fee"], "isController": false}, {"data": [0.5357142857142857, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5357142857142857, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9cf3568f-4d7d-462a-a678-4d4ef7055161"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9c7967e4-de49-4bd9-9453-81ec11133af0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9912a5c5-4812-40e4-914a-539cd7844756"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/0d333d06-0d40-4e90-b086-19707c9203ec"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f9fd98a1-a808-4b1d-964f-49cd1df07553"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0d333d06-0d40-4e90-b086-19707c9203ec"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8157894736842105, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/892d25e8-d5c8-4762-9f89-d178d3f5dbd6"], "isController": false}, {"data": [0.65625, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8157894736842105, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "register"], "isController": true}, {"data": [0.8235294117647058, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.6944444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2ef18ae1-76ea-4d30-97cc-e0677e542730"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/01d8cd75-3538-4576-8929-0e04ab44505e"], "isController": false}, {"data": [0.36363636363636365, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7b434a0b-9c9a-40e8-922e-45f8a9e0e63d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/0a1700b3-da6a-42c5-8f1d-c8c0e1504fee"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9cf3568f-4d7d-462a-a678-4d4ef7055161"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.75, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/45a976e3-72ae-4e97-8be4-6429e700b68d"], "isController": false}, {"data": [0.2894736842105263, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3282aca9-6d9e-4be9-95fe-91f2a6a38cb3"], "isController": false}, {"data": [0.29838709677419356, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/51f6d495-63f4-4e12-92f7-e0b3f35d6eba"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9912a5c5-4812-40e4-914a-539cd7844756"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b61d1bbc-e177-471b-b6e8-a43265c1fa34"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9818181818181818, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9c7967e4-de49-4bd9-9453-81ec11133af0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9357541899441341, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f9fd98a1-a808-4b1d-964f-49cd1df07553"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b61d1bbc-e177-471b-b6e8-a43265c1fa34"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=892d25e8-d5c8-4762-9f89-d178d3f5dbd6"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1306, 19, 1.454823889739663, 410.20750382848433, 129, 2927, 152.5, 1070.6, 1236.6499999999999, 1758.7200000000003, 5.026286013377772, 684.6837600821582, 3.67748690630364], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7b434a0b-9c9a-40e8-922e-45f8a9e0e63d", 1, 0, 0.0, 465.0, 465, 465, 465.0, 465.0, 465.0, 465.0, 2.150537634408602, 0.3885248655913978, 1.4826948924731183], "isController": false}, {"data": ["see books", 55, 0, 0.0, 1999.8545454545458, 1619, 2514, 1951.0, 2339.8, 2400.9999999999995, 2514.0, 0.24538672948566942, 295.28333244101793, 1.2065646317972125], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ec90984f-7661-441d-b794-7a5b7d5d3468", 1, 0, 0.0, 580.0, 580, 580, 580.0, 580.0, 580.0, 580.0, 1.7241379310344827, 0.550579202586207, 1.0287580818965518], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=01d8cd75-3538-4576-8929-0e04ab44505e", 1, 0, 0.0, 505.0, 505, 505, 505.0, 505.0, 505.0, 505.0, 1.9801980198019802, 0.3577506188118812, 1.3652537128712872], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3282aca9-6d9e-4be9-95fe-91f2a6a38cb3", 1, 0, 0.0, 374.0, 374, 374, 374.0, 374.0, 374.0, 374.0, 2.6737967914438503, 0.4830589906417112, 1.8434575534759359], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2ef18ae1-76ea-4d30-97cc-e0677e542730", 3, 0, 0.0, 352.0, 253, 460, 343.0, 460.0, 460.0, 460.0, 0.016063740923986377, 0.022145163676133565, 0.010301292194092827], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=51f6d495-63f4-4e12-92f7-e0b3f35d6eba", 1, 0, 0.0, 777.0, 777, 777, 777.0, 777.0, 777.0, 777.0, 1.287001287001287, 0.23251488095238096, 0.8873270592020591], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0a1700b3-da6a-42c5-8f1d-c8c0e1504fee", 1, 0, 0.0, 412.0, 412, 412, 412.0, 412.0, 412.0, 412.0, 2.4271844660194173, 0.43850500606796117, 1.6734299150485439], "isController": false}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 623.0, 148, 906, 605.0, 905.0, 906.0, 906.0, 0.07276393819223194, 0.013739674992073929, 0.049208034373164664], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 623.0, 148, 906, 605.0, 905.0, 906.0, 906.0, 0.07316129976274835, 0.01381470692367186, 0.049476757896194566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 180.10526315789474, 132, 411, 139.0, 405.0, 411.0, 411.0, 0.10634308518081123, 0.04526796008776103, 0.0597086689203938], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 138.68421052631575, 131, 148, 140.0, 144.0, 148.0, 148.0, 0.10634070442321361, 0.07902858990826715, 0.053378048899933396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 282.10526315789474, 130, 965, 140.0, 945.0, 965.0, 965.0, 0.10634010925047013, 3.316963136361601, 0.06165824282763947], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 233.89473684210526, 134, 933, 137.0, 901.0, 933.0, 933.0, 0.10634070442321361, 10.097808524466759, 0.06155473957721175], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9cf3568f-4d7d-462a-a678-4d4ef7055161", 1, 0, 0.0, 790.0, 790, 790, 790.0, 790.0, 790.0, 790.0, 1.2658227848101267, 0.22868868670886075, 0.8727254746835442], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 288.35714285714283, 211, 433, 258.0, 424.5, 433.0, 433.0, 0.0731047591198187, 0.15824406284920578, 0.047255985125792405], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9c7967e4-de49-4bd9-9453-81ec11133af0", 1, 0, 0.0, 395.0, 395, 395, 395.0, 395.0, 395.0, 395.0, 2.5316455696202533, 0.4573773734177215, 1.7454509493670884], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9912a5c5-4812-40e4-914a-539cd7844756", 1, 0, 0.0, 530.0, 530, 530, 530.0, 530.0, 530.0, 530.0, 1.8867924528301887, 0.3408755896226415, 1.3008549528301887], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 177.0, 134, 443, 139.0, 415.0, 443.0, 443.0, 0.08628609423456622, 0.06412472432861804, 0.04331157464508499], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 231.1176470588235, 134, 417, 137.0, 411.4, 417.0, 417.0, 0.08628521832698037, 0.030711351835591132, 0.048783267392816], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 736.0, 646, 968, 665.0, 968.0, 968.0, 968.0, 0.04458662624145887, 13.109948530313334, 0.025428310278332016], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1068.25, 944, 1203, 1063.0, 1203.0, 1203.0, 1203.0, 0.04459855723667339, 40.12986019746012, 0.025391561395488857], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 347.5, 135, 421, 417.0, 421.0, 421.0, 421.0, 0.04486316733961418, 0.07938677658142665, 0.024841226446837148], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 173.5333333333333, 132, 408, 140.0, 404.4, 408.0, 408.0, 0.07969947982806165, 0.059229789208159106, 0.040005402960570015], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 217.53333333333333, 130, 544, 138.0, 461.20000000000005, 544.0, 544.0, 0.07952581407925012, 0.029242304552057598, 0.044909304122618204], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 244.73333333333332, 134, 936, 139.0, 622.8000000000002, 936.0, 936.0, 0.07958530749109971, 4.794087317351719, 0.04633149867092536], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0d333d06-0d40-4e90-b086-19707c9203ec", 3, 0, 0.0, 770.6666666666667, 309, 1512, 491.0, 1512.0, 1512.0, 1512.0, 0.038708179038230775, 0.032269416183889656, 0.024822627833761275], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 240.66666666666666, 132, 902, 137.0, 608.6000000000001, 902.0, 902.0, 0.07969990329745066, 1.5823440306100762, 0.04647604386948344], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 202.25, 130, 402, 138.5, 402.0, 402.0, 402.0, 0.0450070323488045, 0.03344760900140647, 0.025272503516174404], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 784.5625, 135, 1336, 1066.0, 1275.1000000000001, 1336.0, 1336.0, 0.08880994671403197, 49.95356774880662, 0.04744046958259325], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 215.23529411764707, 131, 946, 136.0, 520.3999999999996, 946.0, 946.0, 0.08628565627855041, 4.58894659330271, 0.050290341716576994], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 631.1875000000002, 129, 976, 806.0, 975.3, 976.0, 976.0, 0.08881241153451194, 16.330100295578806, 0.04752851711026616], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 186.35294117647055, 133, 960, 138.0, 312.7999999999994, 960.0, 960.0, 0.08628390449894428, 1.5142607150651697, 0.05037358234276027], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 597.6428571428571, 142, 1224, 506.5, 1078.5, 1224.0, 1224.0, 0.07320682496771057, 0.013823303235741663, 0.05009989953670538], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f9fd98a1-a808-4b1d-964f-49cd1df07553", 3, 0, 0.0, 332.0, 212, 428, 356.0, 428.0, 428.0, 428.0, 0.028467859786301265, 0.028384457853333586, 0.018255756438480954], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0d333d06-0d40-4e90-b086-19707c9203ec", 1, 0, 0.0, 817.0, 817, 817, 817.0, 817.0, 817.0, 817.0, 1.2239902080783354, 0.2211310434516524, 0.8438838739290087], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 466.0, 273, 1345, 280.0, 1022.8000000000002, 1345.0, 1345.0, 0.07946977764356215, 6.4531839400850854, 0.1773738533173334], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 19, 0, 0.0, 546.0000000000001, 147, 1454, 437.0, 1389.0, 1454.0, 1454.0, 0.08531656937584194, 0.05240636927480916, 0.038575753536147284], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 136.49999999999997, 131, 145, 135.5, 144.3, 145.0, 145.0, 0.08880846788741306, 0.06599926177961069, 0.04457768798254913], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 202.50000000000003, 130, 417, 138.0, 408.6, 417.0, 417.0, 0.08880945376635342, 0.1071307400047735, 0.04598751255821182], "isController": false}, {"data": ["login", 19, 0, 0.0, 2595.315789473684, 1557, 4130, 2474.0, 3798.0, 4130.0, 4130.0, 0.08528593230990214, 21.598373044595565, 0.1584514080595206], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 146.94117647058823, 134, 171, 143.0, 165.4, 171.0, 171.0, 0.08078388884136896, 0.06540023813427233, 0.02871614798658037], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/892d25e8-d5c8-4762-9f89-d178d3f5dbd6", 3, 0, 0.0, 270.3333333333333, 210, 390, 211.0, 390.0, 390.0, 390.0, 0.03884702043353275, 0.032385162542407996, 0.024911663494159998], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 943.3750000000001, 267, 1475, 1217.0, 1409.9, 1475.0, 1475.0, 0.08874147943138896, 66.40511256648678, 0.18539082995468636], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 436.63157894736844, 268, 1101, 283.0, 1078.0, 1101.0, 1101.0, 0.10625863351397301, 13.528636658040144, 0.23611633957183364], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, 33.333333333333336, 944.0, 140, 1605, 1100.0, 1605.0, 1605.0, 1605.0, 0.058763038049067136, 46.872589797267516, 0.10131459343323049], "isController": false}, {"data": ["register", 21, 6, 28.571428571428573, 1023.9047619047622, 144, 2349, 1060.0, 1628.6, 2277.099999999999, 2349.0, 0.08473618800135578, 0.026621916208015236, 0.03823058482092419], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 445.235294117647, 274, 1100, 285.0, 904.7999999999998, 1100.0, 1100.0, 0.08622394895542222, 6.193641395864294, 0.19262196409279725], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 144.06250000000003, 137, 151, 144.5, 151.0, 151.0, 151.0, 0.09794978848967548, 0.07604500180594922, 0.03481808887718933], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 500.7777777777779, 273, 1606, 528.5, 911.2000000000011, 1606.0, 1606.0, 0.11763091340404258, 7.990369530570968, 0.2628826272211004], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 137.875, 135, 141, 138.0, 141.0, 141.0, 141.0, 0.04310460949917832, 0.03203379670788545, 0.02163649344001724], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 172.0, 132, 407, 138.0, 407.0, 407.0, 407.0, 0.043105306263201, 0.01153403702745808, 0.02458349497823182], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2ef18ae1-76ea-4d30-97cc-e0677e542730", 1, 0, 0.0, 933.0, 933, 933, 933.0, 933.0, 933.0, 933.0, 1.0718113612004287, 0.19363779474812431, 0.7389636923901393], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 172.62500000000003, 131, 398, 141.5, 398.0, 398.0, 398.0, 0.04310646758663053, 0.01161854009170901, 0.025341888171046465], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 170.75, 130, 411, 135.5, 411.0, 411.0, 411.0, 0.04310553852288096, 0.011618289679995258, 0.025383437235641813], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 142.0, 142, 142, 142.0, 142.0, 142.0, 142.0, 7.042253521126761, 2.0769146126760565, 4.353268045774648], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/01d8cd75-3538-4576-8929-0e04ab44505e", 3, 0, 0.0, 374.6666666666667, 256, 442, 426.0, 442.0, 442.0, 442.0, 0.052305814663063374, 0.03362759894516607, 0.033542465783279574], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1313.1454545454544, 1043, 1934, 1116.0, 1767.3999999999999, 1830.3999999999996, 1934.0, 0.2445748843827819, 292.5965897089559, 0.4829398595917823], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 6, 28.571428571428573, 1023.9047619047622, 144, 2349, 1060.0, 1628.6, 2277.099999999999, 2349.0, 0.08256080013209728, 0.025938465666501546, 0.03724911099709858], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7b434a0b-9c9a-40e8-922e-45f8a9e0e63d", 3, 0, 0.0, 405.0, 228, 733, 254.0, 733.0, 733.0, 733.0, 0.021126909344432003, 0.025095082095648563, 0.013548180797047867], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 202.0, 130, 401, 137.5, 401.0, 401.0, 401.0, 0.036767747332040336, 0.009910056898088996, 0.021651319962129222], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 218.875, 131, 537, 137.5, 537.0, 537.0, 537.0, 0.03676859226848426, 0.009910284634864899, 0.02161591068908938], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0a1700b3-da6a-42c5-8f1d-c8c0e1504fee", 3, 0, 0.0, 633.0, 262, 849, 788.0, 849.0, 849.0, 849.0, 0.02950113579372806, 0.02459388306241457, 0.018918371586472745], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 207.25, 132, 416, 138.5, 409.7, 416.0, 416.0, 0.0962817203136377, 0.025950932428285164, 0.056603120731259664], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 214.87500000000003, 131, 542, 138.0, 457.30000000000007, 542.0, 542.0, 0.09628229970272839, 0.025951088591751013, 0.05669748703197776], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 134.625, 130, 140, 134.0, 140.0, 140.0, 140.0, 0.036768085301957895, 0.009838335324937953, 0.020969298648772863], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 189.31249999999997, 131, 419, 139.5, 416.9, 419.0, 419.0, 0.09612092011750782, 0.0714336134857651, 0.04824819623085842], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 204.625, 132, 421, 139.5, 421.0, 421.0, 421.0, 0.036767240388813564, 0.02732409173426477, 0.018455431210791184], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 208.8125, 130, 423, 140.0, 420.9, 423.0, 423.0, 0.09628114093152004, 0.025762727163316883, 0.05491033818750752], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9cf3568f-4d7d-462a-a678-4d4ef7055161", 3, 0, 0.0, 349.3333333333333, 227, 490, 331.0, 490.0, 490.0, 490.0, 0.026956599874202535, 0.027035574287896484, 0.017286621664120764], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 142.875, 136, 154, 142.0, 154.0, 154.0, 154.0, 0.03685515004652963, 0.029009034118655155, 0.013100854118102329], "isController": false}, {"data": ["deleteAccount", 14, 1, 7.142857142857143, 569.6428571428571, 140, 1512, 435.5, 1180.5, 1512.0, 1512.0, 0.0738147460772735, 0.013793924716867726, 0.05023789602929391], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/45a976e3-72ae-4e97-8be4-6429e700b68d", 1, 0, 0.0, 222.0, 222, 222, 222.0, 222.0, 222.0, 222.0, 4.504504504504505, 1.4384501689189189, 2.68774634009009], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 19, 0, 0.0, 1507.421052631579, 870, 2927, 1355.0, 2126.0, 2927.0, 2927.0, 0.08430992327796982, 0.04363697200910547, 0.03877927135148807], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 426.125, 269, 959, 279.0, 959.0, 959.0, 959.0, 0.03674410486767529, 0.05694618596191473, 0.08263835303735957], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3282aca9-6d9e-4be9-95fe-91f2a6a38cb3", 3, 0, 0.0, 392.6666666666667, 319, 433, 426.0, 433.0, 433.0, 433.0, 0.06793016778751444, 0.03073663190906415, 0.04356198910852977], "isController": false}, {"data": ["addBook", 62, 9, 14.516129032258064, 1257.6290322580646, 694, 2976, 1094.5, 1945.9, 2237.249999999999, 2976.0, 0.27004190004965284, 79.16669105301096, 0.9833850051612847], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/51f6d495-63f4-4e12-92f7-e0b3f35d6eba", 3, 0, 0.0, 452.0, 260, 821, 275.0, 821.0, 821.0, 821.0, 0.047512709649831335, 0.030546094257297162, 0.030468762373101473], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9912a5c5-4812-40e4-914a-539cd7844756", 3, 0, 0.0, 297.6666666666667, 221, 430, 242.0, 430.0, 430.0, 430.0, 0.019968582763119358, 0.02752830338600602, 0.012805373712026412], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b61d1bbc-e177-471b-b6e8-a43265c1fa34", 1, 0, 0.0, 508.0, 508, 508, 508.0, 508.0, 508.0, 508.0, 1.968503937007874, 0.35563791830708663, 1.357191190944882], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 269.0, 131, 567, 141.0, 552.2, 559.4, 567.0, 0.2459287611450443, 0.1827654172181433, 0.11888157887382514], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 789.0363636363637, 644, 1111, 693.0, 968.6, 1073.3999999999999, 1111.0, 0.24581335168739693, 72.27728716753744, 0.12362683214747013], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 213.21818181818188, 133, 554, 141.0, 414.8, 438.79999999999956, 554.0, 0.24611254055263454, 0.43550383152477906, 0.11969145038594921], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9c7967e4-de49-4bd9-9453-81ec11133af0", 3, 0, 0.0, 315.6666666666667, 236, 429, 282.0, 429.0, 429.0, 429.0, 0.02085302785964522, 0.024647572968219986, 0.013372547162598008], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1035.2545454545455, 899, 1381, 961.0, 1236.4, 1242.0, 1381.0, 0.24521059131419504, 220.64092109875523, 0.12308422259325805], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 158.33333333333331, 135, 406, 142.5, 190.00000000000034, 406.0, 406.0, 0.11774787563207714, 0.087965942244667, 0.04185569016608992], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 9, 5.027932960893855, 207.3351955307263, 132, 1563, 144.0, 333.0, 424.0, 1188.5999999999947, 0.7384488448844885, 1.5057957211736799, 0.3577667337046205], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 175.12500000000003, 135, 403, 143.5, 403.0, 403.0, 403.0, 0.0442698245808201, 0.03428317469979525, 0.015736539206463392], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f9fd98a1-a808-4b1d-964f-49cd1df07553", 1, 0, 0.0, 495.0, 495, 495, 495.0, 495.0, 495.0, 495.0, 2.0202020202020203, 0.36497790404040403, 1.392834595959596], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b61d1bbc-e177-471b-b6e8-a43265c1fa34", 3, 0, 0.0, 335.6666666666667, 218, 441, 348.0, 441.0, 441.0, 441.0, 0.02829387909082335, 0.02299798700839385, 0.018144186786758464], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 155.57894736842104, 137, 394, 142.0, 155.0, 394.0, 394.0, 0.10493237384643422, 0.08515508072889341, 0.037300179765724674], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 345.5, 272, 552, 281.5, 552.0, 552.0, 552.0, 0.04307304650273783, 0.06675480937484857, 0.09687229110918479], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=892d25e8-d5c8-4762-9f89-d178d3f5dbd6", 1, 0, 0.0, 1224.0, 1224, 1224, 1224.0, 1224.0, 1224.0, 1224.0, 0.8169934640522876, 0.14760135825163398, 0.5632786968954249], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 477.4375, 270, 960, 434.0, 878.1000000000001, 960.0, 960.0, 0.09603956830214049, 0.14884257314013372, 0.215995240038896], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 141.2, 136, 153, 141.0, 150.6, 153.0, 153.0, 0.08129332256648439, 0.06740042076068872, 0.028897235756054997], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 161.43750000000003, 135, 408, 143.5, 234.40000000000018, 408.0, 408.0, 0.08804996835704262, 0.06835910629282117, 0.0312990121894175], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 167.22222222222223, 131, 418, 137.0, 402.70000000000005, 418.0, 418.0, 0.11773940345368916, 0.08749969338697018, 0.05909966149921507], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 226.38888888888889, 132, 415, 138.0, 413.2, 415.0, 415.0, 0.11795389313377282, 0.04140417147219565, 0.0667202305670961], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 284.5, 131, 1204, 140.5, 493.00000000000114, 1204.0, 1204.0, 0.11795389313377282, 5.926421600388593, 0.06878084002830893], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 227.33333333333331, 129, 978, 137.0, 474.9000000000008, 978.0, 978.0, 0.1179569850194629, 1.9568751515419598, 0.06889783532549575], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 31.57894736842105, 0.45941807044410415], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.2631578947368425, 0.07656967840735068], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.2631578947368425, 0.07656967840735068], "isController": false}, {"data": ["401/Unauthorized", 11, 57.89473684210526, 0.8422664624808576], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1306, 19, "401/Unauthorized", 11, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
