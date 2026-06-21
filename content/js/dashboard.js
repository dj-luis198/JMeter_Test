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

    var data = {"OkPercent": 98.34384858044164, "KoPercent": 1.6561514195583595};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8161268556005398, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5abe93d8-db49-42f7-9ab4-dad96d734b3d"], "isController": false}, {"data": [0.35454545454545455, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4cb14efb-1ac8-4466-a3e1-db2e36097616"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1893dd69-1cb1-4358-b969-99e4b34b189b"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6333333333333333, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c40d4932-9b69-4356-a101-e86cfe013812"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b6bd4750-08e8-46fd-bb17-bab7c4e6dd3c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8a2b52f2-6f1f-4108-9f7c-2da69fea290e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2d1bdbdb-74b6-414c-bd62-d955a3416bfc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.782608695652174, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.8260869565217391, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8a2b52f2-6f1f-4108-9f7c-2da69fea290e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=47091e0e-56cd-4af6-b81f-a8dff9a0d80d"], "isController": false}, {"data": [0.6818181818181818, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/08c3fce0-0418-46dd-bd9a-c82c10ec7bbe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b6bd4750-08e8-46fd-bb17-bab7c4e6dd3c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f499c1e5-b1f1-4750-8259-d6fc303ee5d2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9e19d9cd-8ee1-4d02-b788-085f6693c030"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e1be4483-5738-4622-94dd-3eb744c642fd"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e256d689-4845-47c4-8d38-7d7af92d5953"], "isController": false}, {"data": [0.782608695652174, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=648c7f95-6fdd-4105-923b-59b188c3d95e"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3125, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.34782608695652173, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b7a0c512-6882-46e2-a24b-183520108bf0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6d22428c-3d21-4172-85a5-b688703eec5b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.34782608695652173, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.4318181818181818, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c40d4932-9b69-4356-a101-e86cfe013812"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4cb14efb-1ac8-4466-a3e1-db2e36097616"], "isController": false}, {"data": [0.36363636363636365, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/47091e0e-56cd-4af6-b81f-a8dff9a0d80d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2d1bdbdb-74b6-414c-bd62-d955a3416bfc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8090909090909091, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/da28e302-983c-4156-a074-c09cfa269fbc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9393939393939394, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9e19d9cd-8ee1-4d02-b788-085f6693c030"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f499c1e5-b1f1-4750-8259-d6fc303ee5d2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b7a0c512-6882-46e2-a24b-183520108bf0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e1be4483-5738-4622-94dd-3eb744c642fd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e256d689-4845-47c4-8d38-7d7af92d5953"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6d22428c-3d21-4172-85a5-b688703eec5b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/648c7f95-6fdd-4105-923b-59b188c3d95e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1268, 21, 1.6561514195583595, 306.9148264984226, 76, 2099, 101.5, 871.5000000000007, 1087.1999999999998, 1428.429999999997, 5.00487462157543, 711.5279134066401, 3.650893590168658], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/5abe93d8-db49-42f7-9ab4-dad96d734b3d", 1, 0, 0.0, 197.0, 197, 197, 197.0, 197.0, 197.0, 197.0, 5.076142131979695, 1.6209946065989846, 3.0288309010152283], "isController": false}, {"data": ["see books", 55, 0, 0.0, 1356.0363636363634, 960, 1899, 1355.0, 1664.0, 1690.3999999999999, 1899.0, 0.25239314591995005, 303.71307065229865, 1.241015126666942], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/4cb14efb-1ac8-4466-a3e1-db2e36097616", 3, 0, 0.0, 370.3333333333333, 163, 490, 458.0, 490.0, 490.0, 490.0, 0.07144217946275482, 0.0331629387740522, 0.04581415805391503], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1893dd69-1cb1-4358-b969-99e4b34b189b", 1, 0, 0.0, 401.0, 401, 401, 401.0, 401.0, 401.0, 401.0, 2.493765586034913, 0.7963489713216957, 1.487979270573566], "isController": false}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 542.6666666666665, 83, 1037, 468.0, 985.4000000000001, 1037.0, 1037.0, 0.08403031813878448, 0.016461408026015787, 0.056578225923913344], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 542.6666666666665, 83, 1037, 468.0, 985.4000000000001, 1037.0, 1037.0, 0.08569959435525339, 0.016788416628577957, 0.05770216177226761], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 139.42105263157896, 77, 243, 81.0, 242.0, 243.0, 243.0, 0.1376642007868596, 0.058600684154850494, 0.07729459957831282], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 97.0, 78, 237, 81.0, 236.0, 237.0, 237.0, 0.1376622059281693, 0.10230560421028988, 0.06909997446003811], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 145.6842105263158, 77, 470, 80.0, 464.0, 470.0, 470.0, 0.1376642007868596, 4.294024920843085, 0.0798206131309911], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c40d4932-9b69-4356-a101-e86cfe013812", 1, 0, 0.0, 188.0, 188, 188, 188.0, 188.0, 188.0, 188.0, 5.319148936170213, 0.9609790558510638, 3.6673038563829787], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 197.26315789473688, 79, 1025, 81.0, 858.0, 1025.0, 1025.0, 0.13766619570336558, 13.072387399014602, 0.07968733018150202], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 216.6, 78, 415, 191.0, 398.2, 415.0, 415.0, 0.08418547744390441, 0.14985672684057516, 0.054413634118690296], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b6bd4750-08e8-46fd-bb17-bab7c4e6dd3c", 1, 0, 0.0, 397.0, 397, 397, 397.0, 397.0, 397.0, 397.0, 2.5188916876574305, 0.45507320528967254, 1.7366577455919394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 92.0, 80, 242, 82.0, 132.80000000000013, 242.0, 242.0, 0.0886529734761385, 0.06588370392123183, 0.04449963707688983], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 99.25, 78, 237, 80.0, 233.5, 237.0, 237.0, 0.08865444712870409, 0.0320441672299918, 0.05009539010727188], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 516.2, 390, 633, 474.0, 633.0, 633.0, 633.0, 0.04091251268287893, 12.02963715203908, 0.02333291738945439], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 904.2, 735, 1031, 876.0, 1031.0, 1031.0, 1031.0, 0.04072855234433547, 36.64762299259148, 0.02318822853198006], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 143.2, 79, 239, 84.0, 239.0, 239.0, 239.0, 0.04104315277082324, 0.07262714142649582, 0.02272604259868826], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 7, 0, 0.0, 81.0, 78, 84, 81.0, 84.0, 84.0, 84.0, 0.1456088530182635, 0.1082112667450181, 0.07308881880018306], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 7, 0, 0.0, 101.71428571428571, 78, 235, 79.0, 235.0, 235.0, 235.0, 0.1456209694195964, 0.03896498595797795, 0.08304945912211359], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 7, 0, 0.0, 147.85714285714286, 79, 242, 82.0, 242.0, 242.0, 242.0, 0.1456209694195964, 0.039249401913875596, 0.08560920272519243], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8a2b52f2-6f1f-4108-9f7c-2da69fea290e", 1, 0, 0.0, 886.0, 886, 886, 886.0, 886.0, 886.0, 886.0, 1.128668171557562, 0.20390977708803612, 0.7781637979683973], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 7, 0, 0.0, 192.57142857142858, 80, 322, 233.0, 322.0, 322.0, 322.0, 0.14561794013022403, 0.03924858542572445, 0.08574962685402843], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2d1bdbdb-74b6-414c-bd62-d955a3416bfc", 3, 0, 0.0, 282.0, 173, 401, 272.0, 401.0, 401.0, 401.0, 0.07250580046403712, 0.032806986538089715, 0.04649623271945089], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 113.0, 81, 239, 81.0, 239.0, 239.0, 239.0, 0.04104450044738505, 0.030502797695761745, 0.023047448981685942], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 23, 0, 0.0, 477.30434782608705, 79, 1106, 89.0, 1069.6000000000001, 1105.2, 1106.0, 0.10422425434343252, 40.790298463711835, 0.057378213392363535], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 177.81249999999997, 77, 933, 81.0, 505.3000000000004, 933.0, 933.0, 0.08865493835711317, 5.008143657362516, 0.051643233134783216], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 23, 0, 0.0, 324.73913043478257, 78, 705, 156.0, 700.8, 704.4, 705.0, 0.10422567123598052, 13.340142460632151, 0.057480776311317545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 123.5, 78, 464, 81.0, 303.70000000000016, 464.0, 464.0, 0.08865395590573869, 1.6516019873723522, 0.05172923696648326], "isController": false}, {"data": ["deleteBooks", 15, 2, 13.333333333333334, 427.3333333333333, 81, 1126, 397.0, 982.0000000000001, 1126.0, 1126.0, 0.08588950029488727, 0.01682561890542421, 0.058400386789049664], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 7, 0, 0.0, 275.7142857142857, 162, 404, 318.0, 404.0, 404.0, 404.0, 0.14536392897933753, 0.22528569852559444, 0.3269268832416156], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8a2b52f2-6f1f-4108-9f7c-2da69fea290e", 3, 0, 0.0, 413.0, 300, 549, 390.0, 549.0, 549.0, 549.0, 0.0405137138921525, 0.026046414367513402, 0.025980474077975393], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=47091e0e-56cd-4af6-b81f-a8dff9a0d80d", 1, 0, 0.0, 391.0, 391, 391, 391.0, 391.0, 391.0, 391.0, 2.557544757033248, 0.46205642583120204, 1.7633072250639386], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 661.4090909090909, 97, 1874, 526.5, 1494.6, 1822.3999999999992, 1874.0, 0.09446803759827896, 0.058027730126286585, 0.042713575593753085], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 23, 0, 0.0, 88.82608695652175, 78, 235, 81.0, 92.00000000000001, 207.1999999999996, 235.0, 0.10422425434343252, 0.07745572026889858, 0.052315690168480776], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 23, 0, 0.0, 111.1304347826087, 77, 246, 81.0, 239.6, 244.79999999999998, 246.0, 0.10422472663666807, 0.09594941079043126, 0.055634904181224146], "isController": false}, {"data": ["login", 22, 0, 0.0, 2458.8636363636365, 1567, 4382, 2343.0, 3874.499999999999, 4353.799999999999, 4382.0, 0.09684121562136846, 26.464359715870074, 0.18260896837694124], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 94.8125, 80, 238, 84.0, 137.2000000000001, 238.0, 238.0, 0.08642342074702243, 0.06996583574148595, 0.030720825343668136], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/08c3fce0-0418-46dd-bd9a-c82c10ec7bbe", 1, 0, 0.0, 237.0, 237, 237, 237.0, 237.0, 237.0, 237.0, 4.219409282700422, 1.3474090189873418, 2.517635812236287], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b6bd4750-08e8-46fd-bb17-bab7c4e6dd3c", 3, 0, 0.0, 315.0, 175, 460, 310.0, 460.0, 460.0, 460.0, 0.03786540112081588, 0.024343804431514113, 0.02428217454687737], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f499c1e5-b1f1-4750-8259-d6fc303ee5d2", 1, 0, 0.0, 420.0, 420, 420, 420.0, 420.0, 420.0, 420.0, 2.3809523809523814, 0.43015252976190477, 1.6415550595238095], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9e19d9cd-8ee1-4d02-b788-085f6693c030", 1, 0, 0.0, 1126.0, 1126, 1126, 1126.0, 1126.0, 1126.0, 1126.0, 0.8880994671403197, 0.16044765763765542, 0.6123029529307283], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e1be4483-5738-4622-94dd-3eb744c642fd", 3, 0, 0.0, 341.33333333333337, 171, 601, 252.0, 601.0, 601.0, 601.0, 0.0425435362187305, 0.0273513945416643, 0.027282150504849962], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e256d689-4845-47c4-8d38-7d7af92d5953", 3, 0, 0.0, 358.0, 171, 595, 308.0, 595.0, 595.0, 595.0, 0.018404569241056913, 0.02175357777157476, 0.011802409311485065], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 23, 0, 0.0, 575.7826086956521, 161, 1185, 254.0, 1152.2, 1185.0, 1185.0, 0.10418554085885125, 54.28349349265039, 0.22272578960183004], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=648c7f95-6fdd-4105-923b-59b188c3d95e", 1, 0, 0.0, 445.0, 445, 445, 445.0, 445.0, 445.0, 445.0, 2.247191011235955, 0.4059866573033708, 1.5493328651685394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 328.73684210526307, 158, 1264, 185.0, 938.0, 1264.0, 1264.0, 0.13758245896060073, 17.51672345337403, 0.305720726163839], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 3, 37.5, 665.8749999999999, 78, 1116, 876.5, 1116.0, 1116.0, 1116.0, 0.06312732782021337, 47.20772848640395, 0.10451610683905688], "isController": false}, {"data": ["register", 23, 5, 21.73913043478261, 1027.6086956521742, 155, 2099, 1032.0, 1649.4, 2018.599999999999, 2099.0, 0.09369017067905007, 0.029660067619862316, 0.04227036997433704], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 116.17647058823529, 81, 244, 83.0, 241.6, 244.0, 244.0, 0.07860471998224458, 0.061026125376840275, 0.027941521556188505], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 290.9375, 160, 1015, 167.5, 640.5000000000003, 1015.0, 1015.0, 0.08861369413875797, 6.754549629553221, 0.19787723472659907], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b7a0c512-6882-46e2-a24b-183520108bf0", 3, 0, 0.0, 556.3333333333333, 197, 1085, 387.0, 1085.0, 1085.0, 1085.0, 0.017554227935798337, 0.02419992034769074, 0.011257105805183179], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 312.1764705882353, 161, 975, 315.0, 580.5999999999997, 975.0, 975.0, 0.10252760706596144, 7.364766274749863, 0.22904389425483537], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 3, 0, 0.0, 80.33333333333333, 78, 82, 81.0, 82.0, 82.0, 82.0, 0.017057763272361307, 0.012676716650651322, 0.008562197580071984], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6d22428c-3d21-4172-85a5-b688703eec5b", 3, 0, 0.0, 428.3333333333333, 207, 636, 442.0, 636.0, 636.0, 636.0, 0.020081531015924654, 0.023735689817325007, 0.012877804720498558], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 3, 0, 0.0, 80.66666666666667, 80, 82, 80.0, 82.0, 82.0, 82.0, 0.017057763272361307, 0.004564284313112303, 0.009728255616268559], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 3, 0, 0.0, 80.0, 80, 80, 80.0, 80.0, 80.0, 80.0, 0.017057957252759125, 0.004597652540782733, 0.010028213150547844], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 3, 0, 0.0, 79.66666666666667, 78, 81, 80.0, 81.0, 81.0, 81.0, 0.017057957252759125, 0.004597652540782733, 0.010044871311927491], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 86.0, 81, 91, 86.0, 91.0, 91.0, 91.0, 0.05265236277477952, 0.015528333552718179, 0.03254779847308148], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 944.3090909090909, 622, 1484, 869.0, 1319.8, 1346.0, 1484.0, 0.24286742529618785, 290.5538750325663, 0.4795682948719647], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, 21.73913043478261, 1027.6086956521742, 155, 2099, 1032.0, 1649.4, 2018.599999999999, 2099.0, 0.09416619924748924, 0.029810766881338307, 0.04248514067611331], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 100.25, 79, 235, 80.0, 235.0, 235.0, 235.0, 0.050032521138740176, 0.013485327963176065, 0.02946251000650423], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 81.125, 79, 87, 81.0, 87.0, 87.0, 87.0, 0.05003189533327496, 0.013485159289046767, 0.029413282217413603], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 167.58823529411762, 78, 936, 81.0, 382.3999999999995, 936.0, 936.0, 0.08215378221515593, 4.3692003431732624, 0.04788213892204572], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 155.11764705882354, 79, 475, 81.0, 352.5999999999999, 475.0, 475.0, 0.08215219418845714, 1.4417502434362814, 0.04796144011588292], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 101.64705882352943, 79, 240, 81.0, 240.0, 240.0, 240.0, 0.08216291456023508, 0.0610605253714247, 0.041241931722618], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 118.74999999999999, 77, 239, 79.5, 239.0, 239.0, 239.0, 0.05003220823405067, 0.01338752446887684, 0.028533993758482024], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 80.17647058823528, 78, 83, 80.0, 82.2, 83.0, 83.0, 0.08216768006805417, 0.029245803406575347, 0.04645532555318182], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 101.12499999999999, 80, 240, 82.0, 240.0, 240.0, 240.0, 0.05003158243641299, 0.03718167405674832, 0.025113509152652612], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 84.5, 81, 93, 83.5, 93.0, 93.0, 93.0, 0.05185074762296729, 0.04081220955479652, 0.018431320444101656], "isController": false}, {"data": ["deleteAccount", 14, 1, 7.142857142857143, 499.8571428571428, 81, 1085, 442.5, 963.0, 1085.0, 1085.0, 0.08911804958782903, 0.01665368686145326, 0.060653237292720964], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1324.6818181818182, 880, 2085, 1285.5, 1911.0, 2059.7999999999997, 2085.0, 0.09412892239498206, 0.04871907116146533, 0.043295627390660694], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c40d4932-9b69-4356-a101-e86cfe013812", 3, 0, 0.0, 483.66666666666663, 195, 841, 415.0, 841.0, 841.0, 841.0, 0.07586102260658473, 0.03516474485409397, 0.04864785629393618], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 222.0, 161, 480, 164.0, 480.0, 480.0, 480.0, 0.05000593820516186, 0.07749943743319519, 0.11246452703758572], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4cb14efb-1ac8-4466-a3e1-db2e36097616", 1, 0, 0.0, 205.0, 205, 205, 205.0, 205.0, 205.0, 205.0, 4.878048780487805, 0.8812881097560976, 3.363185975609756], "isController": false}, {"data": ["addBook", 55, 9, 16.363636363636363, 884.6363636363636, 410, 1870, 724.0, 1521.4, 1619.3999999999994, 1870.0, 0.2670927200236984, 88.17241920141706, 0.9698567275192914], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/47091e0e-56cd-4af6-b81f-a8dff9a0d80d", 3, 0, 0.0, 310.6666666666667, 204, 443, 285.0, 443.0, 443.0, 443.0, 0.024974193333555328, 0.02504735991558723, 0.016015351844760415], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2d1bdbdb-74b6-414c-bd62-d955a3416bfc", 1, 0, 0.0, 186.0, 186, 186, 186.0, 186.0, 186.0, 186.0, 5.376344086021506, 0.9713121639784946, 3.7067372311827955], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 152.49090909090907, 79, 335, 82.0, 324.8, 329.0, 335.0, 0.24379756823007398, 0.1811815912334827, 0.1178513635487174], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 517.7636363636365, 386, 806, 471.0, 702.2, 711.4, 806.0, 0.24368738895608752, 71.65218353592617, 0.12255762237537604], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/da28e302-983c-4156-a074-c09cfa269fbc", 1, 0, 0.0, 252.0, 252, 252, 252.0, 252.0, 252.0, 252.0, 3.968253968253968, 1.2672061011904763, 2.3677765376984126], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 128.34545454545454, 79, 325, 83.0, 239.4, 250.3999999999999, 325.0, 0.24394462900457287, 0.43166764429324805, 0.11863713402761453], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 787.0181818181819, 540, 1112, 776.0, 1014.8, 1081.8, 1112.0, 0.24326703200951838, 218.89210301999435, 0.12210864692665278], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 86.23529411764706, 80, 106, 84.0, 102.0, 106.0, 106.0, 0.1018482461132912, 0.07608780105143337, 0.03620386873558398], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 165, 9, 5.454545454545454, 134.0909090909091, 80, 575, 85.0, 246.4, 303.6999999999999, 539.3600000000001, 0.6908506255338391, 1.5146989919337954, 0.3303047776507729], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 3, 0, 0.0, 84.33333333333333, 81, 90, 82.0, 90.0, 90.0, 90.0, 0.01621490149447342, 0.012557047739372483, 0.005763890765613599], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9e19d9cd-8ee1-4d02-b788-085f6693c030", 3, 0, 0.0, 276.0, 187, 389, 252.0, 389.0, 389.0, 389.0, 0.028988588159128022, 0.023562664268666236, 0.01858968706819082], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 102.21052631578948, 80, 239, 83.0, 239.0, 239.0, 239.0, 0.14005911969157508, 0.11366125826533094, 0.04978664020286457], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f499c1e5-b1f1-4750-8259-d6fc303ee5d2", 3, 0, 0.0, 347.6666666666667, 283, 401, 359.0, 401.0, 401.0, 401.0, 0.016375635238183615, 0.022575135167222527, 0.01050130254531957], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 3, 0, 0.0, 162.0, 159, 164, 163.0, 164.0, 164.0, 164.0, 0.01704981387286522, 0.026423881461169047, 0.03834543100508653], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 294.58823529411757, 159, 1017, 172.0, 591.3999999999996, 1017.0, 1017.0, 0.08211528986697324, 5.898508067827229, 0.1834433310912639], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b7a0c512-6882-46e2-a24b-183520108bf0", 1, 0, 0.0, 423.0, 423, 423, 423.0, 423.0, 423.0, 423.0, 2.3640661938534278, 0.4271018026004728, 1.6299128250591017], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e1be4483-5738-4622-94dd-3eb744c642fd", 1, 0, 0.0, 661.0, 661, 661, 661.0, 661.0, 661.0, 661.0, 1.5128593040847202, 0.27331930786686837, 1.0430455748865355], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 7, 0, 0.0, 84.14285714285714, 82, 92, 83.0, 92.0, 92.0, 92.0, 0.19838458268386, 0.1644809674790988, 0.07051951962590336], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e256d689-4845-47c4-8d38-7d7af92d5953", 1, 0, 0.0, 387.0, 387, 387, 387.0, 387.0, 387.0, 387.0, 2.5839793281653747, 0.46683220284237725, 1.781532622739018], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 23, 0, 0.0, 91.56521739130434, 81, 242, 84.0, 96.00000000000003, 213.9999999999996, 242.0, 0.1091936287891376, 0.0847743504759418, 0.03881492273363876], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6d22428c-3d21-4172-85a5-b688703eec5b", 1, 0, 0.0, 523.0, 523, 523, 523.0, 523.0, 523.0, 523.0, 1.9120458891013383, 0.34543797801147225, 1.3182660133843211], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 99.29411764705883, 78, 240, 80.0, 239.2, 240.0, 240.0, 0.10257771770612087, 0.07623207341245897, 0.051489205957955204], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/648c7f95-6fdd-4105-923b-59b188c3d95e", 3, 0, 0.0, 262.3333333333333, 191, 379, 217.0, 379.0, 379.0, 379.0, 0.050074276843985244, 0.03219293514546577, 0.03211143404383168], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 88.29411764705883, 76, 237, 79.0, 112.19999999999989, 237.0, 237.0, 0.10257895562555061, 0.0365107541966861, 0.057995294190410676], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 202.0, 78, 896, 231.0, 373.59999999999957, 896.0, 896.0, 0.10257833666210092, 5.455443336405655, 0.059786293874866496], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 167.23529411764704, 78, 472, 81.0, 284.79999999999984, 472.0, 472.0, 0.10257833666210092, 1.8002238809910274, 0.05988646803176308], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 23.80952380952381, 0.3943217665615142], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 9.523809523809524, 0.15772870662460567], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.761904761904762, 0.07886435331230283], "isController": false}, {"data": ["401/Unauthorized", 13, 61.904761904761905, 1.025236593059937], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1268, 21, "401/Unauthorized", 13, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 3, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 165, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
