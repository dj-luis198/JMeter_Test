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

    var data = {"OkPercent": 97.71986970684038, "KoPercent": 2.2801302931596092};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6731707317073171, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eddeafc8-4e19-4788-89e2-87178584ac18"], "isController": false}, {"data": [0.23333333333333334, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.23333333333333334, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.6, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e54726c5-b6d0-48e2-811b-31f83f197985"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/cd0e443c-0265-4f96-835b-30bf4ca51386"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cd0b0458-3d88-4339-a5fd-cbc6a6351679"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d1d855b5-ba31-43af-a849-2ed1d0f91377"], "isController": false}, {"data": [0.32142857142857145, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=29ea3a95-33a0-4f42-a662-549af43ffc7d"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a0cfa512-e8de-4e31-a672-8d973c2ad2f4"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/db0a714e-768a-4f1f-8000-93be4336434e"], "isController": false}, {"data": [0.4444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1b0a3cea-469b-4b7b-ae9b-70c4ba95169e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/8962facb-dfe7-4e1b-928d-477ff57c515c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bd445765-7402-4323-a974-4f3c94eb8096"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/85339558-17bd-4ea7-975c-f233603f84ae"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.125, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=705f672a-20fa-4e96-8a67-426a67b7f467"], "isController": false}, {"data": [0.021739130434782608, 500, 1500, "register"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/bd445765-7402-4323-a974-4f3c94eb8096"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d1d855b5-ba31-43af-a849-2ed1d0f91377"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.021739130434782608, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a552f185-90ff-4d65-ac04-e18d5460f79a"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.17647058823529413, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/cd0b0458-3d88-4339-a5fd-cbc6a6351679"], "isController": false}, {"data": [0.9074074074074074, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9814814814814815, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.37962962962962965, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8493589743589743, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cd0e443c-0265-4f96-835b-30bf4ca51386"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8962facb-dfe7-4e1b-928d-477ff57c515c"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/e54726c5-b6d0-48e2-811b-31f83f197985"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/29ea3a95-33a0-4f42-a662-549af43ffc7d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=85339558-17bd-4ea7-975c-f233603f84ae"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/1b0a3cea-469b-4b7b-ae9b-70c4ba95169e"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/705f672a-20fa-4e96-8a67-426a67b7f467"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/eddeafc8-4e19-4788-89e2-87178584ac18"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a0cfa512-e8de-4e31-a672-8d973c2ad2f4"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1228, 28, 2.2801302931596092, 584.7923452768712, 131, 5628, 271.5, 1535.0000000000027, 2002.2999999999997, 3000.0700000000006, 4.934065139302963, 724.2213428452037, 3.6077392788048153], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 2398.5370370370374, 1775, 3155, 2437.0, 2884.0, 2998.5, 3155.0, 0.2391496899911426, 287.7771828637068, 1.1758971573294952], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eddeafc8-4e19-4788-89e2-87178584ac18", 1, 0, 0.0, 617.0, 617, 617, 617.0, 617.0, 617.0, 617.0, 1.6207455429497568, 0.2928104740680713, 1.1174280794165317], "isController": false}, {"data": ["deleteBook", 15, 3, 20.0, 1218.3333333333335, 148, 2643, 1100.0, 2497.8, 2643.0, 2643.0, 0.09086613600843238, 0.01849267846109112, 0.06089095950096318], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, 20.0, 1218.3333333333335, 148, 2643, 1100.0, 2497.8, 2643.0, 2643.0, 0.09359439931114523, 0.01904792267230729, 0.06271921563213657], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 12, 0, 0.0, 209.33333333333334, 133, 418, 144.5, 412.90000000000003, 418.0, 418.0, 0.05937507731129858, 0.02331902043492244, 0.03344680054921947], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 12, 0, 0.0, 152.41666666666666, 132, 179, 148.0, 176.9, 179.0, 179.0, 0.05937243337918205, 0.044123458790583533, 0.029802178473534738], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 12, 0, 0.0, 237.91666666666666, 132, 1055, 139.5, 857.0000000000007, 1055.0, 1055.0, 0.059378602920437625, 1.4696107577946789, 0.03454087350873113], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 12, 0, 0.0, 319.75000000000006, 132, 1470, 146.5, 1159.5000000000011, 1470.0, 1470.0, 0.05930084306031884, 4.461235046612933, 0.03443772917304974], "isController": false}, {"data": ["goToProfile", 15, 3, 20.0, 485.8, 146, 1423, 419.0, 1000.0000000000002, 1423.0, 1423.0, 0.09080507781995169, 0.15116444269896906, 0.058686328614496124], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 177.88888888888889, 134, 565, 139.0, 417.4000000000002, 565.0, 565.0, 0.0965779222869652, 0.07177324107459035, 0.048477589897949334], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 184.88888888888889, 132, 411, 137.0, 407.4, 411.0, 411.0, 0.0965825861597154, 0.0258433873122676, 0.05508225616921269], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 1051.7142857142858, 790, 1177, 1092.0, 1177.0, 1177.0, 1177.0, 0.059307458336510514, 17.438361943886672, 0.03382378483254116], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1345.7142857142858, 977, 1625, 1439.0, 1625.0, 1625.0, 1625.0, 0.05924371170317208, 53.30759592985121, 0.03372957414350519], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e54726c5-b6d0-48e2-811b-31f83f197985", 1, 0, 0.0, 1062.0, 1062, 1062, 1062.0, 1062.0, 1062.0, 1062.0, 0.9416195856873822, 0.17011681967984932, 0.649202565913371], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 242.2857142857143, 136, 398, 186.0, 398.0, 398.0, 398.0, 0.05963842077461789, 0.10553204926133557, 0.03302244587813315], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 144.66666666666666, 135, 180, 140.0, 176.4, 180.0, 180.0, 0.056399723641354156, 0.041914247745186047, 0.0283100175309141], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 171.83333333333331, 132, 402, 135.5, 361.20000000000016, 402.0, 402.0, 0.05639707299191172, 0.015090623046663879, 0.03216395569069965], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 163.91666666666666, 133, 425, 137.5, 345.8000000000003, 425.0, 425.0, 0.05639866335167856, 0.015201202231507114, 0.03315624544698291], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 186.08333333333331, 131, 412, 138.0, 411.1, 412.0, 412.0, 0.05639627784566219, 0.015200559263088637, 0.03320991752044365], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 177.0, 132, 399, 141.0, 399.0, 399.0, 399.0, 0.05976929053852131, 0.04441838876935031, 0.03356185748012671], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 936.4999999999998, 134, 2006, 1234.0, 1801.7000000000003, 2006.0, 2006.0, 0.10059069089039527, 50.29631686137485, 0.05433381719318442], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 184.49999999999997, 132, 596, 139.0, 417.8000000000003, 596.0, 596.0, 0.09658103148541626, 0.0260316061425536, 0.05677908296310604], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cd0e443c-0265-4f96-835b-30bf4ca51386", 3, 0, 0.0, 1153.0, 718, 2022, 719.0, 2022.0, 2022.0, 2022.0, 0.02588952078497027, 0.025965368990394987, 0.01660232940963263], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 676.9444444444445, 133, 1315, 794.0, 1280.8, 1315.0, 1315.0, 0.10058900450415209, 16.443442609781723, 0.05443113774546511], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 261.05555555555554, 133, 587, 145.0, 468.20000000000016, 587.0, 587.0, 0.0965825861597154, 0.02603202517586079, 0.056874315873348034], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cd0b0458-3d88-4339-a5fd-cbc6a6351679", 1, 0, 0.0, 759.0, 759, 759, 759.0, 759.0, 759.0, 759.0, 1.3175230566534915, 0.2380290678524374, 0.9083703886693018], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d1d855b5-ba31-43af-a849-2ed1d0f91377", 3, 0, 0.0, 732.6666666666666, 414, 1091, 693.0, 1091.0, 1091.0, 1091.0, 0.04714386736858647, 0.030308964209947355, 0.030232232654985466], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 1184.3571428571431, 146, 4222, 826.0, 3199.0, 4222.0, 4222.0, 0.09341678566185792, 0.018401855657720897, 0.06345512407750924], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 334.66666666666663, 273, 606, 281.0, 588.9000000000001, 606.0, 606.0, 0.05635840186358449, 0.08734451538819198, 0.1267513666912452], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=29ea3a95-33a0-4f42-a662-549af43ffc7d", 1, 0, 0.0, 876.0, 876, 876, 876.0, 876.0, 876.0, 876.0, 1.141552511415525, 0.2062375142694064, 0.787046946347032], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a0cfa512-e8de-4e31-a672-8d973c2ad2f4", 3, 0, 0.0, 736.3333333333333, 387, 1428, 394.0, 1428.0, 1428.0, 1428.0, 0.038700688872261926, 0.02513277158208416, 0.024817824569777342], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 1478.6190476190477, 454, 2626, 1619.0, 2450.2000000000003, 2610.1, 2626.0, 0.09440153919462002, 0.057986882962320296, 0.04268350844444244], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 195.05555555555551, 131, 497, 138.0, 418.7000000000001, 497.0, 497.0, 0.10059012875536481, 0.07475496873323498, 0.05049152947290773], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 259.00000000000006, 133, 428, 142.5, 420.8, 428.0, 428.0, 0.10059069089039527, 0.11085059208798331, 0.05267476933995741], "isController": false}, {"data": ["login", 21, 0, 0.0, 5554.238095238096, 3700, 8689, 5459.0, 8018.200000000001, 8648.9, 8689.0, 0.09539774043637653, 38.171238269768914, 0.1966646777941317], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 165.72222222222223, 132, 431, 143.5, 206.90000000000035, 431.0, 431.0, 0.09030296645244797, 0.07310660077058531, 0.03209988260614361], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/db0a714e-768a-4f1f-8000-93be4336434e", 1, 0, 0.0, 618.0, 618, 618, 618.0, 618.0, 618.0, 618.0, 1.6181229773462784, 0.5167248179611651, 0.965501112459547], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 1147.9444444444448, 271, 2346, 1377.5, 1959.9000000000005, 2346.0, 2346.0, 0.1005126143330988, 66.8736947320222, 0.21176795057571393], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1b0a3cea-469b-4b7b-ae9b-70c4ba95169e", 1, 0, 0.0, 2176.0, 2176, 2176, 2176.0, 2176.0, 2176.0, 2176.0, 0.45955882352941174, 0.08302576401654412, 0.31684426700367646], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8962facb-dfe7-4e1b-928d-477ff57c515c", 3, 0, 0.0, 1130.0, 294, 2142, 954.0, 2142.0, 2142.0, 2142.0, 0.01655738790648387, 0.022825695893215887, 0.010617856177009515], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bd445765-7402-4323-a974-4f3c94eb8096", 1, 0, 0.0, 484.0, 484, 484, 484.0, 484.0, 484.0, 484.0, 2.066115702479339, 0.37327285640495866, 1.4244899276859504], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/85339558-17bd-4ea7-975c-f233603f84ae", 3, 0, 0.0, 493.0, 355, 728, 396.0, 728.0, 728.0, 728.0, 0.0332642176810405, 0.027038005061705124, 0.021331545843636], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 12, 0, 0.0, 499.8333333333333, 272, 1620, 320.0, 1315.5000000000011, 1620.0, 1620.0, 0.05925574780753733, 5.991721516811349, 0.1320041374091412], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 5, 41.666666666666664, 971.4166666666665, 146, 2025, 1277.0, 1937.4000000000003, 2025.0, 2025.0, 0.09421444778556792, 65.75989043154142, 0.14980158535436408], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=705f672a-20fa-4e96-8a67-426a67b7f467", 1, 0, 0.0, 1791.0, 1791, 1791, 1791.0, 1791.0, 1791.0, 1791.0, 0.5583472920156337, 0.10087329006141821, 0.3849542853154662], "isController": false}, {"data": ["register", 23, 7, 30.434782608695652, 2154.2173913043475, 208, 5162, 2202.0, 3994.2000000000025, 5062.5999999999985, 5162.0, 0.09249503341885773, 0.02899895239320845, 0.0417311576557737], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/bd445765-7402-4323-a974-4f3c94eb8096", 3, 0, 0.0, 699.6666666666666, 355, 892, 852.0, 892.0, 892.0, 892.0, 0.06955070246209487, 0.03146988164788798, 0.044601199170028284], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 456.16666666666674, 271, 1162, 350.0, 845.2000000000005, 1162.0, 1162.0, 0.09650698335254537, 0.1495669751762593, 0.2170464674422969], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 147.42857142857142, 135, 169, 148.0, 163.0, 169.0, 169.0, 0.09225031463946601, 0.07162011732263229, 0.032792104031997685], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d1d855b5-ba31-43af-a849-2ed1d0f91377", 1, 0, 0.0, 4222.0, 4222, 4222, 4222.0, 4222.0, 4222.0, 4222.0, 0.23685457129322596, 0.042791109071530074, 0.1633001243486499], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 554.1764705882352, 273, 1873, 544.0, 1037.7999999999993, 1873.0, 1873.0, 0.09031360069700849, 6.487409387567536, 0.20175813519680397], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 6, 0, 0.0, 140.66666666666666, 133, 147, 141.0, 147.0, 147.0, 147.0, 0.033401063267180675, 0.024822469869457513, 0.016765768085284048], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 6, 0, 0.0, 135.83333333333334, 133, 141, 135.0, 141.0, 141.0, 141.0, 0.033400691394311864, 0.008937294376993603, 0.019048831810818484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 6, 0, 0.0, 138.5, 134, 146, 138.5, 146.0, 146.0, 146.0, 0.033401063267180675, 0.009002630333732291, 0.019636171959807387], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 6, 0, 0.0, 136.66666666666666, 135, 141, 136.0, 141.0, 141.0, 141.0, 0.03340087732971119, 0.00900258021777372, 0.019668680693179542], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 149.0, 146, 152, 149.0, 152.0, 152.0, 152.0, 0.3968253968253968, 0.11703249007936507, 0.2453031994047619], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1617.648148148148, 1060, 2545, 1498.5, 2237.0, 2425.5, 2545.0, 0.2413763817680373, 288.77006860229665, 0.4766240663427455], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, 30.434782608695652, 2154.2173913043475, 208, 5162, 2202.0, 3994.2000000000025, 5062.5999999999985, 5162.0, 0.09318720499159289, 0.029215961347568018, 0.042043446002066324], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 244.5, 134, 421, 148.0, 421.0, 421.0, 421.0, 0.045149019984084965, 0.012169071792585402, 0.02658677641640941], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 212.5, 134, 434, 144.5, 434.0, 434.0, 434.0, 0.045142905510255904, 0.012167423750811162, 0.026539090934740286], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a552f185-90ff-4d65-ac04-e18d5460f79a", 1, 0, 0.0, 278.0, 278, 278, 278.0, 278.0, 278.0, 278.0, 3.5971223021582737, 1.1486904226618704, 2.146329811151079], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 385.42857142857144, 133, 1460, 139.0, 1457.5, 1460.0, 1460.0, 0.09196852048927252, 11.843166677341584, 0.05293835317225704], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 334.07142857142856, 132, 1108, 139.5, 951.0, 1108.0, 1108.0, 0.09195281506975278, 3.883697956348685, 0.05301911058639623], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 175.125, 134, 421, 140.5, 421.0, 421.0, 421.0, 0.04521587755540358, 0.012098779736504474, 0.025787180168316104], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 180.57142857142858, 134, 433, 138.5, 424.0, 433.0, 433.0, 0.09213435821838474, 0.06847094394940507, 0.04624712902758766], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 212.0, 135, 456, 139.5, 456.0, 456.0, 456.0, 0.045217922123433625, 0.03360433470305956, 0.022697277315864142], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 240.78571428571428, 134, 448, 143.5, 440.5, 448.0, 448.0, 0.0921331455572081, 0.04442133803651105, 0.051439292483251506], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 243.75000000000003, 135, 428, 147.5, 428.0, 428.0, 428.0, 0.04733307694583321, 0.03725630861166169, 0.01682542969558915], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 1166.642857142857, 149, 2396, 1037.5, 2269.0, 2396.0, 2396.0, 0.09464831390789367, 0.018274730252305364, 0.06441050156845778], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 3130.190476190476, 1891, 5628, 2884.0, 4519.0, 5522.999999999998, 5628.0, 0.09524284658191565, 0.04929561395353056, 0.043807989003986594], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 460.75, 279, 867, 290.0, 867.0, 867.0, 867.0, 0.04510701639640046, 0.06990706545028079, 0.10144673707120143], "isController": false}, {"data": ["addBook", 51, 11, 21.568627450980394, 1621.725490196078, 684, 3318, 1378.0, 2653.4, 2930.5999999999995, 3318.0, 0.25426644131680104, 84.53159509814186, 0.9221053510621856], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/cd0b0458-3d88-4339-a5fd-cbc6a6351679", 3, 0, 0.0, 812.6666666666666, 600, 984, 854.0, 984.0, 984.0, 984.0, 0.040290629742542876, 0.02590299275440175, 0.025837415557555164], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 282.3703703703704, 134, 764, 152.0, 547.5, 657.75, 764.0, 0.24239268512741327, 0.18013753259957177, 0.11717224525202106], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 908.9074074074074, 656, 1314, 819.0, 1185.0, 1245.5, 1314.0, 0.24236331158047808, 71.26286082399038, 0.12189170455463497], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 219.11111111111103, 133, 550, 147.0, 430.0, 501.5, 550.0, 0.24310635903207653, 0.4301842993809792, 0.1182294597636466], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1329.8518518518522, 920, 1998, 1309.0, 1732.5, 1839.25, 1998.0, 0.24224480183029404, 217.97229850783933, 0.12159553529372183], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 162.0, 134, 384, 147.0, 238.39999999999986, 384.0, 384.0, 0.08947368421052632, 0.06684313322368421, 0.031805098684210525], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 156, 11, 7.051282051282051, 287.5576923076922, 132, 1889, 149.0, 676.6, 895.4500000000003, 1528.1900000000044, 0.6614962536414096, 1.5255194176712787, 0.3135837765393569], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 6, 0, 0.0, 199.16666666666666, 134, 459, 144.0, 459.0, 459.0, 459.0, 0.03361890727345059, 0.02603495455844367, 0.011950470944859388], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cd0e443c-0265-4f96-835b-30bf4ca51386", 1, 0, 0.0, 1994.0, 1994, 1994, 1994.0, 1994.0, 1994.0, 1994.0, 0.5015045135406219, 0.09060384277833501, 0.34576385406218657], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 12, 0, 0.0, 140.5, 134, 147, 141.0, 146.7, 147.0, 147.0, 0.061551087402544113, 0.04995015003077554, 0.0218794881001231], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8962facb-dfe7-4e1b-928d-477ff57c515c", 1, 0, 0.0, 650.0, 650, 650, 650.0, 650.0, 650.0, 650.0, 1.5384615384615385, 0.2779447115384615, 1.0606971153846154], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e54726c5-b6d0-48e2-811b-31f83f197985", 3, 0, 0.0, 1445.0, 516, 2396, 1423.0, 2396.0, 2396.0, 2396.0, 0.02659102995922709, 0.02666893336731076, 0.017052190436092893], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 6, 0, 0.0, 281.3333333333333, 272, 293, 282.5, 293.0, 293.0, 293.0, 0.03337579476111275, 0.051725963169810485, 0.07506294466293228], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 651.6428571428571, 270, 1889, 562.5, 1742.0, 1889.0, 1889.0, 0.09187075097776727, 15.823378276176602, 0.2032614731803029], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/29ea3a95-33a0-4f42-a662-549af43ffc7d", 3, 0, 0.0, 882.3333333333333, 463, 1672, 512.0, 1672.0, 1672.0, 1672.0, 0.06447176136852058, 0.029171793067136596, 0.0413441959296828], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=85339558-17bd-4ea7-975c-f233603f84ae", 1, 0, 0.0, 865.0, 865, 865, 865.0, 865.0, 865.0, 865.0, 1.1560693641618498, 0.20886018786127167, 0.7970556358381503], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 164.3333333333333, 133, 401, 143.5, 326.3000000000003, 401.0, 401.0, 0.055735146583435514, 0.04621009711849292, 0.01981210288708059], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 144.83333333333334, 134, 170, 142.0, 169.1, 170.0, 170.0, 0.10093137227415203, 0.0783598056229989, 0.03587794873807748], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1b0a3cea-469b-4b7b-ae9b-70c4ba95169e", 3, 0, 0.0, 1046.3333333333333, 643, 1330, 1166.0, 1330.0, 1330.0, 1330.0, 0.026974536037980147, 0.022487560805099987, 0.01729812369623076], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/705f672a-20fa-4e96-8a67-426a67b7f467", 3, 0, 0.0, 542.3333333333334, 419, 629, 579.0, 629.0, 629.0, 629.0, 0.022658439135656072, 0.022724821281561315, 0.014530314159258614], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eddeafc8-4e19-4788-89e2-87178584ac18", 3, 0, 0.0, 633.6666666666666, 430, 870, 601.0, 870.0, 870.0, 870.0, 0.0198303841145403, 0.02343884268225776, 0.01271675022970195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 212.82352941176472, 136, 422, 143.0, 414.8, 422.0, 422.0, 0.0910151941835937, 0.06763922145870586, 0.045685361142936684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 212.47058823529412, 133, 439, 144.0, 433.4, 439.0, 439.0, 0.0909922977696182, 0.03238673466110721, 0.05144451945361801], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a0cfa512-e8de-4e31-a672-8d973c2ad2f4", 1, 0, 0.0, 787.0, 787, 787, 787.0, 787.0, 787.0, 787.0, 1.2706480304955527, 0.22956043519695044, 0.8760522554002541], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 287.11764705882354, 134, 1450, 144.0, 635.5999999999992, 1450.0, 1450.0, 0.0903803417440216, 4.80671503510213, 0.0526768696768637], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 270.70588235294116, 133, 930, 141.0, 538.7999999999996, 930.0, 930.0, 0.0906308976723853, 1.5905493465245715, 0.05291140929713073], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 25.0, 0.5700325732899023], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 10.714285714285714, 0.24429967426710097], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 7.142857142857143, 0.16286644951140064], "isController": false}, {"data": ["401/Unauthorized", 16, 57.142857142857146, 1.3029315960912051], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1228, 28, "401/Unauthorized", 16, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 5, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 156, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
