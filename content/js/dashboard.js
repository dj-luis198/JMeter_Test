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

    var data = {"OkPercent": 96.83972911963883, "KoPercent": 3.160270880361174};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7387820512820513, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b1bd3b5e-5773-4a15-9bea-1bbbaef65477"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=49353be6-1462-4bc0-b2e1-5a4b26dec9ba"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/490b346a-f27f-416d-b9c3-ca1b1c200867"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4ef624ac-eefb-40f8-8662-0d0dcbc42f1e"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.775, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.775, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.625, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/9460a08d-59e1-4fa8-ba87-87fefbbb2b90"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=986447b0-0cb8-4fdc-9af6-eff7680d7e80"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2edac110-5f61-4152-b52b-3509a2f36844"], "isController": false}, {"data": [0.84, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/7a9bdf26-6f68-4853-b2a1-7f7dcb9a005e"], "isController": false}, {"data": [0.02, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/43007fb9-6715-4418-b39f-d3e559fb0e83"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/4ef624ac-eefb-40f8-8662-0d0dcbc42f1e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=df1b173f-15ca-4caa-abd6-57bf61270f5e"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6bce864a-5286-4529-a1c0-3da11a3018bb"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0a79176a-6d50-4952-83cd-a3c6a7790cfc"], "isController": false}, {"data": [0.2647058823529412, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.24, 500, 1500, "register"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d35cd8b8-a6e7-4060-bb6a-225a5cb67fd4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/707bba51-c2af-467b-9b1d-d8a976b642d8"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b1bd3b5e-5773-4a15-9bea-1bbbaef65477"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.36607142857142855, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.24, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.65625, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.44, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9460a08d-59e1-4fa8-ba87-87fefbbb2b90"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=490b346a-f27f-416d-b9c3-ca1b1c200867"], "isController": false}, {"data": [0.20535714285714285, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=43007fb9-6715-4418-b39f-d3e559fb0e83"], "isController": false}, {"data": [0.9107142857142857, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.48214285714285715, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8869047619047619, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6bce864a-5286-4529-a1c0-3da11a3018bb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2edac110-5f61-4152-b52b-3509a2f36844"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/df1b173f-15ca-4caa-abd6-57bf61270f5e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/986447b0-0cb8-4fdc-9af6-eff7680d7e80"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=707bba51-c2af-467b-9b1d-d8a976b642d8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0a79176a-6d50-4952-83cd-a3c6a7790cfc"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d35cd8b8-a6e7-4060-bb6a-225a5cb67fd4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/49353be6-1462-4bc0-b2e1-5a4b26dec9ba"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/745a6ef8-7b1c-49f5-8129-754ba33ffcf7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7a9bdf26-6f68-4853-b2a1-7f7dcb9a005e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1329, 42, 3.160270880361174, 431.86305492851784, 137, 2684, 156.0, 1131.0, 1343.5, 1827.3000000000013, 5.295158257100054, 766.0613606096405, 3.871169327526854], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 2139.8035714285706, 1690, 2789, 2070.0, 2554.5, 2717.7, 2789.0, 0.2422145328719723, 291.46393983834344, 1.1909669658304498], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/b1bd3b5e-5773-4a15-9bea-1bbbaef65477", 3, 0, 0.0, 316.3333333333333, 234, 469, 246.0, 469.0, 469.0, 469.0, 0.03400550889244058, 0.027640545476700557, 0.021806918137404926], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=49353be6-1462-4bc0-b2e1-5a4b26dec9ba", 1, 0, 0.0, 489.0, 489, 489, 489.0, 489.0, 489.0, 489.0, 2.044989775051125, 0.36945616053169733, 1.409924591002045], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/490b346a-f27f-416d-b9c3-ca1b1c200867", 3, 0, 0.0, 470.66666666666663, 281, 813, 318.0, 813.0, 813.0, 813.0, 0.06967670011148272, 0.0315268923030472, 0.04468199844388703], "isController": false}, {"data": ["deleteBook", 18, 4, 22.22222222222222, 537.7222222222222, 141, 1426, 527.5, 991.3000000000006, 1426.0, 1426.0, 0.09171366992250195, 0.01889803159535929, 0.06136138115691699], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 18, 4, 22.22222222222222, 537.7222222222222, 141, 1426, 527.5, 991.3000000000006, 1426.0, 1426.0, 0.09383014658354011, 0.019334141532350548, 0.06277741795074959], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 221.0666666666667, 139, 449, 149.0, 443.0, 449.0, 449.0, 0.09986883892487866, 0.05672237960811467, 0.05527896279552854], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 145.13333333333335, 139, 155, 143.0, 152.6, 155.0, 155.0, 0.10004869036264315, 0.07435259117770648, 0.050219752779686114], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 428.06666666666666, 138, 1120, 415.0, 1115.8, 1120.0, 1120.0, 0.09983892653186192, 5.892719641478415, 0.05707588632007029], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 346.93333333333334, 138, 1253, 146.0, 1252.4, 1253.0, 1253.0, 0.10004468662669325, 18.025649112853742, 0.057095815297499554], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4ef624ac-eefb-40f8-8662-0d0dcbc42f1e", 1, 0, 0.0, 470.0, 470, 470, 470.0, 470.0, 470.0, 470.0, 2.127659574468085, 0.38439162234042556, 1.4669215425531916], "isController": false}, {"data": ["goToProfile", 19, 5, 26.31578947368421, 234.73684210526315, 138, 364, 244.0, 353.0, 364.0, 364.0, 0.09554316288097836, 0.13178926101134952, 0.061742608290632245], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 182.4, 139, 665, 148.0, 365.60000000000014, 665.0, 665.0, 0.0754557527465894, 0.05607600375015091, 0.03787525089037788], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 166.26666666666665, 138, 443, 147.0, 269.60000000000014, 443.0, 443.0, 0.0754572710626396, 0.03530181965209167, 0.04218926066965813], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 10, 0, 0.0, 995.9, 697, 1074, 1031.0, 1073.6, 1074.0, 1074.0, 0.04798694755026633, 14.109755896396182, 0.027367556024761267], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 10, 0, 0.0, 1106.4999999999998, 973, 1361, 1030.0, 1356.4, 1361.0, 1361.0, 0.04798948070582928, 43.181019095614246, 0.027322135987791478], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 10, 0, 0.0, 294.0, 141, 457, 292.5, 456.8, 457.0, 457.0, 0.0481811611659841, 0.0852580703444953, 0.026678435919055648], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 7, 0, 0.0, 192.2857142857143, 142, 452, 150.0, 452.0, 452.0, 452.0, 0.06186696834178849, 0.04597730752744242, 0.031054318093436797], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 7, 0, 0.0, 271.4285714285714, 141, 444, 153.0, 444.0, 444.0, 444.0, 0.06186696834178849, 0.016554247388330123, 0.03528350538242624], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 7, 0, 0.0, 315.7142857142857, 147, 461, 420.0, 461.0, 461.0, 461.0, 0.0618702492487184, 0.01667596561781863, 0.036372939499734844], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 7, 0, 0.0, 354.2857142857143, 141, 462, 424.0, 462.0, 462.0, 462.0, 0.06187353050365054, 0.016676850018562058, 0.03643529188838015], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 10, 0, 0.0, 147.29999999999998, 140, 157, 146.5, 156.7, 157.0, 157.0, 0.048179071974715625, 0.03580495485620956, 0.02705367811080223], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 673.4000000000001, 138, 1480, 297.5, 1359.0, 1474.05, 1480.0, 0.10163531217286134, 41.168301288037014, 0.05582001910743869], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 337.2666666666667, 141, 1318, 150.0, 1102.0, 1318.0, 1318.0, 0.07545499361147721, 9.07023059989235, 0.043494694885157496], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 541.9999999999999, 138, 1202, 153.0, 1186.5000000000002, 1201.8, 1202.0, 0.10163118044616087, 13.462389714289344, 0.05591699908531938], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 282.26666666666665, 138, 1053, 149.0, 847.8000000000002, 1053.0, 1053.0, 0.07545423449163967, 2.975765671844504, 0.04356794307984064], "isController": false}, {"data": ["deleteBooks", 16, 2, 12.5, 570.6875, 147, 1275, 498.5, 1066.4, 1275.0, 1275.0, 0.08504938179730606, 0.016580061368444553, 0.05787967572265396], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/9460a08d-59e1-4fa8-ba87-87fefbbb2b90", 3, 0, 0.0, 544.6666666666666, 259, 755, 620.0, 755.0, 755.0, 755.0, 0.021181653863533666, 0.02516010903256326, 0.013583287145560325], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 7, 0, 0.0, 598.7142857142857, 309, 876, 608.0, 876.0, 876.0, 876.0, 0.061783422625089374, 0.09575223799415705, 0.13895236553279375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=986447b0-0cb8-4fdc-9af6-eff7680d7e80", 1, 0, 0.0, 882.0, 882, 882, 882.0, 882.0, 882.0, 882.0, 1.1337868480725624, 0.2048345379818594, 0.7816928854875284], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2edac110-5f61-4152-b52b-3509a2f36844", 1, 0, 0.0, 977.0, 977, 977, 977.0, 977.0, 977.0, 977.0, 1.0235414534288638, 0.18491715711361312, 0.7056838536335722], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 25, 0, 0.0, 429.28, 183, 1172, 389.0, 785.2000000000002, 1071.7999999999997, 1172.0, 0.10889924641721478, 0.06689221288713683, 0.049238624112471145], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 147.6, 139, 156, 149.5, 155.9, 156.0, 156.0, 0.10163376273598089, 0.07553056000203268, 0.05101538481083416], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 173.64999999999995, 137, 420, 147.0, 389.8000000000005, 419.8, 420.0, 0.10163737816219293, 0.09589049906493613, 0.05412388897640997], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7a9bdf26-6f68-4853-b2a1-7f7dcb9a005e", 3, 0, 0.0, 1081.3333333333333, 245, 2520, 479.0, 2520.0, 2520.0, 2520.0, 0.05074939946543966, 0.03262697394018338, 0.032544374006157596], "isController": false}, {"data": ["login", 25, 0, 0.0, 2483.68, 1439, 4547, 2311.0, 3796.0000000000014, 4419.799999999999, 4547.0, 0.11001971553302352, 52.7943357449655, 0.2389705578989755], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/43007fb9-6715-4418-b39f-d3e559fb0e83", 3, 0, 0.0, 395.6666666666667, 243, 482, 462.0, 482.0, 482.0, 482.0, 0.021373458439310062, 0.02526270429464025, 0.013706286824687771], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 151.20000000000005, 140, 163, 152.0, 161.8, 163.0, 163.0, 0.07684465596647524, 0.06221115214473434, 0.027315873800582993], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4ef624ac-eefb-40f8-8662-0d0dcbc42f1e", 3, 0, 0.0, 1262.3333333333333, 262, 2684, 841.0, 2684.0, 2684.0, 2684.0, 0.027067750579700994, 0.022565269933142656, 0.017357899948571273], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=df1b173f-15ca-4caa-abd6-57bf61270f5e", 1, 0, 0.0, 459.0, 459, 459, 459.0, 459.0, 459.0, 459.0, 2.1786492374727673, 0.3936036220043573, 1.502076525054466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 824.8500000000001, 289, 1634, 446.0, 1502.4, 1627.4499999999998, 1634.0, 0.10155635108030568, 54.760082046423946, 0.2167097487749765], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6bce864a-5286-4529-a1c0-3da11a3018bb", 1, 0, 0.0, 622.0, 622, 622, 622.0, 622.0, 622.0, 622.0, 1.607717041800643, 0.2904566921221865, 1.108445538585209], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0a79176a-6d50-4952-83cd-a3c6a7790cfc", 1, 0, 0.0, 797.0, 797, 797, 797.0, 797.0, 797.0, 797.0, 1.2547051442910915, 0.22668012860727726, 0.865060382685069], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 17, 7, 41.1764705882353, 804.9411764705883, 138, 1515, 1131.0, 1468.6, 1515.0, 1515.0, 0.08095353743148712, 56.978669263727575, 0.12921966593570383], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 595.8000000000001, 288, 1408, 569.0, 1400.8, 1408.0, 1408.0, 0.09974531695736885, 23.98968384059368, 0.21922540072681085], "isController": false}, {"data": ["register", 25, 10, 40.0, 853.64, 172, 1941, 592.0, 1828.4, 1919.1, 1941.0, 0.10625366575146843, 0.03295523851822888, 0.047938665602713294], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d35cd8b8-a6e7-4060-bb6a-225a5cb67fd4", 3, 0, 0.0, 391.33333333333337, 237, 686, 251.0, 686.0, 686.0, 686.0, 0.05331058748267405, 0.03427357105412802, 0.03418680251981377], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 185.1764705882353, 142, 463, 153.0, 438.2, 463.0, 463.0, 0.07893942559959137, 0.06128597983562026, 0.028060498943604746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 540.8666666666666, 286, 1470, 306.0, 1260.0, 1470.0, 1470.0, 0.07539848097193669, 12.128311996086818, 0.1670007630954595], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/707bba51-c2af-467b-9b1d-d8a976b642d8", 3, 0, 0.0, 946.6666666666666, 251, 2121, 468.0, 2121.0, 2121.0, 2121.0, 0.06461200491051237, 0.029235249617712306, 0.0414341307531606], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 335.47058823529414, 284, 609, 301.0, 602.6, 609.0, 609.0, 0.09605062432905814, 0.14885970782247585, 0.21602010530255947], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 13, 0, 0.0, 169.69230769230768, 142, 420, 150.0, 314.3999999999999, 420.0, 420.0, 0.07043360007801876, 0.05234372037048074, 0.03535436566416176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 13, 0, 0.0, 192.3076923076923, 140, 429, 151.0, 427.8, 429.0, 429.0, 0.07043360007801876, 0.018846490645876113, 0.040169162544495075], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 13, 0, 0.0, 169.92307692307693, 139, 422, 150.0, 321.19999999999993, 422.0, 422.0, 0.0704393246494289, 0.018985599221916383, 0.04141061859273066], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b1bd3b5e-5773-4a15-9bea-1bbbaef65477", 1, 0, 0.0, 485.0, 485, 485, 485.0, 485.0, 485.0, 485.0, 2.061855670103093, 0.3725032216494846, 1.4215528350515465], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 13, 0, 0.0, 171.15384615384616, 140, 456, 149.0, 335.5999999999999, 456.0, 456.0, 0.07043779800606849, 0.018985187743823146, 0.04147850800552666], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 151.5, 147, 156, 151.5, 156.0, 156.0, 156.0, 0.08426374552348852, 0.024851221824310092, 0.05208881925426585], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1405.9285714285713, 1095, 2184, 1242.5, 1888.0000000000002, 2109.5, 2184.0, 0.24698872231851843, 295.4843790659416, 0.48770624660941825], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 10, 40.0, 853.64, 172, 1941, 592.0, 1828.4, 1919.1, 1941.0, 0.10989977140847547, 0.03408610097590997, 0.04958368592843327], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 182.75, 142, 445, 144.0, 445.0, 445.0, 445.0, 0.04478205135381739, 0.012070162278958593, 0.026370680631203014], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 258.625, 142, 455, 154.0, 455.0, 455.0, 455.0, 0.044782803403493054, 0.01207036497984774, 0.026327390282131664], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 180.64705882352945, 138, 453, 146.0, 449.0, 453.0, 453.0, 0.07907160631642597, 0.021312268889974183, 0.046485456057117604], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 246.5294117647059, 140, 457, 151.0, 449.0, 457.0, 457.0, 0.07907123853467041, 0.021312169761297885, 0.046562457848052984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 148.88235294117646, 140, 157, 151.0, 155.4, 157.0, 157.0, 0.07907160631642597, 0.05876317617851578, 0.03969023988929975], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 181.25, 141, 422, 149.5, 422.0, 422.0, 422.0, 0.04478054733023975, 0.011982294891099306, 0.025538905899277355], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 163.11764705882354, 138, 421, 149.0, 208.19999999999982, 421.0, 421.0, 0.07907123853467041, 0.021157733748534857, 0.04509531572680422], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 183.62499999999997, 143, 425, 151.5, 425.0, 425.0, 425.0, 0.04478230203423607, 0.03328059750786489, 0.022478616450778654], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 191.49999999999997, 151, 451, 154.0, 451.0, 451.0, 451.0, 0.04378786966540594, 0.03446584272491913, 0.015565219295124767], "isController": false}, {"data": ["deleteAccount", 16, 2, 12.5, 522.6875000000001, 148, 841, 483.0, 821.4, 841.0, 841.0, 0.0878860118426401, 0.01683266022718534, 0.05981012158480451], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 25, 0, 0.0, 1068.84, 833, 1688, 990.0, 1568.8000000000002, 1668.8, 1688.0, 0.10901511385538491, 0.056423838225931645, 0.05014269397059208], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 448.125, 295, 872, 308.0, 872.0, 872.0, 872.0, 0.04474423079074242, 0.06934481861807443, 0.10063082374128886], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9460a08d-59e1-4fa8-ba87-87fefbbb2b90", 1, 0, 0.0, 479.0, 479, 479, 479.0, 479.0, 479.0, 479.0, 2.08768267223382, 0.37716923277661796, 1.4393593423799582], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=490b346a-f27f-416d-b9c3-ca1b1c200867", 1, 0, 0.0, 242.0, 242, 242, 242.0, 242.0, 242.0, 242.0, 4.132231404958678, 0.7465457128099173, 2.848979855371901], "isController": false}, {"data": ["addBook", 56, 19, 33.92857142857143, 1214.660714285714, 725, 2185, 1044.5, 2052.1, 2140.15, 2185.0, 0.26076347821228013, 79.07918497007041, 0.9458951433966306], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=43007fb9-6715-4418-b39f-d3e559fb0e83", 1, 0, 0.0, 508.0, 508, 508, 508.0, 508.0, 508.0, 508.0, 1.968503937007874, 0.35563791830708663, 1.357191190944882], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 247.3214285714287, 139, 648, 153.0, 567.6, 597.9499999999999, 648.0, 0.24810927441328803, 0.18438589631690644, 0.11993563558064216], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 827.8214285714288, 680, 1192, 749.5, 1054.7, 1116.9, 1192.0, 0.24804004074943528, 72.93200768481198, 0.12474670018160074], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 207.75, 137, 635, 149.5, 435.6, 452.9, 635.0, 0.24870098148065903, 0.4400841586356975, 0.12095028200914865], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1150.892857142857, 950, 1541, 1057.0, 1378.3000000000002, 1425.4999999999998, 1541.0, 0.24773389840255877, 222.91139725236562, 0.12435080447159687], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 153.88235294117646, 146, 157, 154.0, 156.2, 157.0, 157.0, 0.0992955854350899, 0.07418078404086306, 0.035296477635129615], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 19, 11.30952380952381, 181.94642857142864, 138, 452, 153.5, 268.2, 369.2999999999999, 401.63000000000017, 0.7071004671913801, 1.6200480936171555, 0.3358184661601919], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 13, 0, 0.0, 175.53846153846152, 142, 464, 154.0, 341.5999999999999, 464.0, 464.0, 0.07178988756599147, 0.055595098476397695, 0.025519061595723532], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6bce864a-5286-4529-a1c0-3da11a3018bb", 3, 0, 0.0, 343.3333333333333, 230, 474, 326.0, 474.0, 474.0, 474.0, 0.042716787697565144, 0.03561122828563292, 0.02739325252740994], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 170.66666666666666, 143, 436, 155.0, 269.80000000000007, 436.0, 436.0, 0.09915847507486465, 0.08046942655001223, 0.035247739186768295], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 13, 0, 0.0, 388.6923076923077, 285, 876, 306.0, 755.9999999999999, 876.0, 876.0, 0.0703748815807281, 0.10906732135606984, 0.15827475808634456], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2edac110-5f61-4152-b52b-3509a2f36844", 3, 0, 0.0, 359.3333333333333, 239, 475, 364.0, 475.0, 475.0, 475.0, 0.06906872337976287, 0.032016231149994245, 0.04429211753194428], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 449.4117647058824, 283, 612, 565.0, 609.6, 612.0, 612.0, 0.07901904823880486, 0.12246409136228839, 0.17771569149801522], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/df1b173f-15ca-4caa-abd6-57bf61270f5e", 3, 0, 0.0, 616.0, 353, 938, 557.0, 938.0, 938.0, 938.0, 0.04740459824602986, 0.03047658904163704, 0.030399433120012642], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/986447b0-0cb8-4fdc-9af6-eff7680d7e80", 3, 0, 0.0, 391.6666666666667, 243, 560, 372.0, 560.0, 560.0, 560.0, 0.04421974264109783, 0.028429033761773505, 0.028357061524401928], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 7, 0, 0.0, 153.42857142857142, 144, 161, 156.0, 161.0, 161.0, 161.0, 0.06441638752898737, 0.05340772755088894, 0.022898012754444728], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=707bba51-c2af-467b-9b1d-d8a976b642d8", 1, 0, 0.0, 1275.0, 1275, 1275, 1275.0, 1275.0, 1275.0, 1275.0, 0.7843137254901961, 0.14169730392156862, 0.5407475490196079], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 167.60000000000002, 140, 439, 153.0, 199.5000000000001, 427.24999999999983, 439.0, 0.10255042917354609, 0.07961678827438393, 0.036453472870283964], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0a79176a-6d50-4952-83cd-a3c6a7790cfc", 3, 0, 0.0, 340.3333333333333, 230, 518, 273.0, 518.0, 518.0, 518.0, 0.01983484188325212, 0.023792770943940125, 0.012719608889976133], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d35cd8b8-a6e7-4060-bb6a-225a5cb67fd4", 1, 0, 0.0, 573.0, 573, 573, 573.0, 573.0, 573.0, 573.0, 1.7452006980802792, 0.3152950479930192, 1.2032340750436301], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/49353be6-1462-4bc0-b2e1-5a4b26dec9ba", 3, 0, 0.0, 325.3333333333333, 244, 484, 248.0, 484.0, 484.0, 484.0, 0.044653488925934744, 0.028300892883722315, 0.02863521262502977], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/745a6ef8-7b1c-49f5-8129-754ba33ffcf7", 1, 0, 0.0, 423.0, 423, 423, 423.0, 423.0, 423.0, 423.0, 2.3640661938534278, 0.7549312943262412, 1.410590277777778], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 147.41176470588238, 139, 156, 147.0, 155.2, 156.0, 156.0, 0.09613372767011429, 0.0714431315985908, 0.048254625021912835], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7a9bdf26-6f68-4853-b2a1-7f7dcb9a005e", 1, 0, 0.0, 570.0, 570, 570, 570.0, 570.0, 570.0, 570.0, 1.7543859649122808, 0.3169544956140351, 1.2095668859649125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 145.52941176470586, 139, 155, 143.0, 154.2, 155.0, 155.0, 0.09613481494048123, 0.025723573528995954, 0.05482688664574321], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 163.82352941176467, 139, 454, 147.0, 213.99999999999977, 454.0, 454.0, 0.0961315532031599, 0.02591045769928919, 0.056514838894826426], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 180.58823529411765, 138, 461, 149.0, 429.79999999999995, 461.0, 461.0, 0.09612883525779492, 0.025909725128077536, 0.05660711685590853], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 10, 23.80952380952381, 0.7524454477050414], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 5, 11.904761904761905, 0.3762227238525207], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 4.761904761904762, 0.1504890895410083], "isController": false}, {"data": ["401/Unauthorized", 25, 59.523809523809526, 1.8811136192626035], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1329, 42, "401/Unauthorized", 25, "406/Not Acceptable", 10, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 18, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 17, 7, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 10, "406/Not Acceptable", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 19, "401/Unauthorized", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
