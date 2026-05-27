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

    var data = {"OkPercent": 96.97908597986057, "KoPercent": 3.020914020139427};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7862796833773087, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4166666666666667, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2e352f15-0bd0-41a1-bb56-0c07786e7b2f"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e486b87f-86c3-4067-a5be-12cb071a1e4e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e6a1eff2-9550-44ed-9c67-66cea1e9ebc5"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5625, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9830f00f-12d0-4fde-a775-4fd6f75c0800"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9830f00f-12d0-4fde-a775-4fd6f75c0800"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c2147008-2245-4148-92b6-1229f4bfdd4d"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1aa9c7b6-765a-432c-86e2-7acc7587eeaa"], "isController": false}, {"data": [0.041666666666666664, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bc712953-dc54-403a-8f71-3e3fb47d03e9"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9b71e7f8-8cc7-4a18-9ef5-293d4ffde291"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c37e25f2-a52d-4b93-81de-2acd8d8bf9fb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=78d1a535-ec03-4da4-8a71-2c3f52d384e7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0c174169-33e9-4453-be49-84f8b36c72ac"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=edce2736-1f3f-4180-94ac-a67b09555461"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/25e1d630-8d80-496b-87e4-e797e6a0e282"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8947368421052632, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.24, 500, 1500, "register"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/e486b87f-86c3-4067-a5be-12cb071a1e4e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2e352f15-0bd0-41a1-bb56-0c07786e7b2f"], "isController": false}, {"data": [0.24, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.53125, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.2916666666666667, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.29464285714285715, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/01416925-9d21-433e-936d-7671b8dbc29e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.7962962962962963, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8945783132530121, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e6a1eff2-9550-44ed-9c67-66cea1e9ebc5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=25e1d630-8d80-496b-87e4-e797e6a0e282"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/290d13d9-7100-41be-bcd9-61ca2f861612"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=01416925-9d21-433e-936d-7671b8dbc29e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/edce2736-1f3f-4180-94ac-a67b09555461"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9b71e7f8-8cc7-4a18-9ef5-293d4ffde291"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/c2147008-2245-4148-92b6-1229f4bfdd4d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b8a93959-61c3-46ed-b699-0c34719c0be8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bc712953-dc54-403a-8f71-3e3fb47d03e9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/78d1a535-ec03-4da4-8a71-2c3f52d384e7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0c174169-33e9-4453-be49-84f8b36c72ac"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1291, 39, 3.020914020139427, 319.766847405112, 77, 3550, 104.0, 855.1999999999998, 1025.9999999999993, 1865.2399999999998, 5.0122102255300485, 718.4929561897495, 3.6555682098334046], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 1347.5185185185182, 1031, 1805, 1340.0, 1540.0, 1688.0, 1805.0, 0.23599129454335685, 283.97705319254703, 1.1603673515876969], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2e352f15-0bd0-41a1-bb56-0c07786e7b2f", 1, 0, 0.0, 181.0, 181, 181, 181.0, 181.0, 181.0, 181.0, 5.524861878453039, 0.9981439917127072, 3.8091332872928176], "isController": false}, {"data": ["deleteBook", 16, 4, 25.0, 645.25, 81, 2827, 481.0, 1679.0000000000011, 2827.0, 2827.0, 0.08937598802361761, 0.01870000530669929, 0.05967854669057474], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 4, 25.0, 645.25, 81, 2827, 481.0, 1679.0000000000011, 2827.0, 2827.0, 0.08653934565437267, 0.01810649883442319, 0.0577844507726341], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e486b87f-86c3-4067-a5be-12cb071a1e4e", 1, 0, 0.0, 605.0, 605, 605, 605.0, 605.0, 605.0, 605.0, 1.6528925619834711, 0.29861828512396693, 1.1395919421487604], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 107.1578947368421, 78, 237, 85.0, 236.0, 237.0, 237.0, 0.09442776772757093, 0.04766039674572094, 0.05260115885235473], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 91.3157894736842, 79, 244, 81.0, 96.0, 244.0, 244.0, 0.09442729843499177, 0.07017497471584838, 0.04739807753475173], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 175.84210526315786, 78, 585, 81.0, 503.0, 585.0, 585.0, 0.09442729843499177, 4.405342146754932, 0.05432384618538564], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 220.3157894736842, 77, 923, 81.0, 915.0, 923.0, 923.0, 0.09442823702481475, 13.437226460966349, 0.05423217107911595], "isController": false}, {"data": ["goToProfile", 18, 4, 22.22222222222222, 211.61111111111111, 79, 382, 200.5, 366.70000000000005, 382.0, 382.0, 0.09433517286920429, 0.144199950932608, 0.06096574323014114], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 84.06666666666668, 78, 94, 83.0, 90.4, 94.0, 94.0, 0.0715987035861404, 0.05320958342680942, 0.03593919301101188], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 582.75, 461, 783, 617.0, 783.0, 783.0, 783.0, 0.03346790219005585, 9.840674482816324, 0.019087162967766226], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 91.66666666666667, 77, 236, 81.0, 147.80000000000007, 236.0, 236.0, 0.07160007064540304, 0.019158612653164483, 0.04083441528995642], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 755.625, 541, 932, 738.5, 932.0, 932.0, 932.0, 0.03345698477288981, 30.10465370975229, 0.01904826379159644], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 193.125, 78, 325, 235.5, 325.0, 325.0, 325.0, 0.033543117581205796, 0.059355594782368064, 0.018573191082562193], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 105.07692307692308, 78, 237, 81.0, 236.2, 237.0, 237.0, 0.12021787177376847, 0.08934160197249785, 0.06034373641769237], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 142.3076923076923, 78, 257, 81.0, 252.2, 257.0, 257.0, 0.12039378027208994, 0.032214741986867815, 0.0686620778114263], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 142.3076923076923, 78, 253, 81.0, 250.2, 253.0, 253.0, 0.12021787177376847, 0.03240247325152353, 0.0706749597732506], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 141.30769230769232, 78, 255, 80.0, 247.79999999999998, 255.0, 255.0, 0.1202167600658418, 0.03240217361149642, 0.07079170539033457], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 81.0, 79, 86, 80.0, 86.0, 86.0, 86.0, 0.03354241438298729, 0.024927516938919266, 0.018834851826384464], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e6a1eff2-9550-44ed-9c67-66cea1e9ebc5", 3, 0, 0.0, 369.0, 247, 591, 269.0, 591.0, 591.0, 591.0, 0.016888943934335786, 0.02328277264385158, 0.010830475114141112], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 618.0714285714286, 78, 1016, 862.0, 988.5, 1016.0, 1016.0, 0.06672735678641051, 38.60446156534038, 0.03554199891329733], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 115.46666666666665, 79, 252, 86.0, 243.0, 252.0, 252.0, 0.07160007064540304, 0.019298456541143785, 0.04209301028177014], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 395.49999999999994, 79, 689, 466.0, 686.5, 689.0, 689.0, 0.06672608465633682, 12.619077389747062, 0.035606483511507865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 91.39999999999999, 78, 238, 80.0, 148.00000000000006, 238.0, 238.0, 0.07159972887569332, 0.019298364423526716, 0.04216273096879207], "isController": false}, {"data": ["deleteBooks", 16, 4, 25.0, 418.625, 80, 861, 443.0, 847.0, 861.0, 861.0, 0.08636557468193178, 0.01807014099180067, 0.05800578514404159], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9830f00f-12d0-4fde-a775-4fd6f75c0800", 1, 0, 0.0, 841.0, 841, 841, 841.0, 841.0, 841.0, 841.0, 1.1890606420927465, 0.21482052615933414, 0.8198015755053508], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 288.0, 160, 494, 317.0, 485.59999999999997, 494.0, 494.0, 0.11995386389850059, 0.1859050605536332, 0.26977905132641294], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9830f00f-12d0-4fde-a775-4fd6f75c0800", 3, 0, 0.0, 692.0, 178, 1404, 494.0, 1404.0, 1404.0, 1404.0, 0.0474150874808364, 0.030483332608936164, 0.03040615961498949], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c2147008-2245-4148-92b6-1229f4bfdd4d", 1, 0, 0.0, 484.0, 484, 484, 484.0, 484.0, 484.0, 484.0, 2.066115702479339, 0.37327285640495866, 1.4244899276859504], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 648.9583333333334, 89, 1596, 704.0, 1164.5, 1491.0, 1596.0, 0.09679331803461168, 0.05945605180055737, 0.04376494750979024], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 107.14285714285714, 79, 254, 82.0, 245.0, 254.0, 254.0, 0.06672640268430785, 0.04958866449488113, 0.03349352634739672], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 182.57142857142858, 80, 257, 233.5, 248.5, 257.0, 257.0, 0.06672640268430785, 0.08228162295292929, 0.034452346028825805], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1aa9c7b6-765a-432c-86e2-7acc7587eeaa", 2, 0, 0.0, 233.0, 229, 237, 233.0, 237.0, 237.0, 237.0, 0.07644675483525724, 0.04490500296231175, 0.04751792915296996], "isController": false}, {"data": ["login", 24, 0, 0.0, 2869.7083333333335, 1395, 4845, 2860.5, 4149.5, 4714.25, 4845.0, 0.09708777139066097, 38.84746575633396, 0.20014871621648955], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 89.2, 81, 103, 88.0, 101.8, 103.0, 103.0, 0.07308837358878531, 0.05917017744638968, 0.025980632799138533], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bc712953-dc54-403a-8f71-3e3fb47d03e9", 1, 0, 0.0, 410.0, 410, 410, 410.0, 410.0, 410.0, 410.0, 2.4390243902439024, 0.4406440548780488, 1.681592987804878], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9b71e7f8-8cc7-4a18-9ef5-293d4ffde291", 1, 0, 0.0, 861.0, 861, 861, 861.0, 861.0, 861.0, 861.0, 1.1614401858304297, 0.20983050232288036, 0.8007585656213705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 737.5, 162, 1100, 950.5, 1071.5, 1100.0, 1100.0, 0.06670001667500418, 51.33460982723504, 0.13903901355439624], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c37e25f2-a52d-4b93-81de-2acd8d8bf9fb", 2, 0, 0.0, 315.5, 255, 376, 315.5, 376.0, 376.0, 376.0, 0.02610659322011774, 0.029701348731872235, 0.016227389242778265], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=78d1a535-ec03-4da4-8a71-2c3f52d384e7", 1, 0, 0.0, 421.0, 421, 421, 421.0, 421.0, 421.0, 421.0, 2.375296912114014, 0.42913078978622327, 1.6376558788598576], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0c174169-33e9-4453-be49-84f8b36c72ac", 1, 0, 0.0, 465.0, 465, 465, 465.0, 465.0, 465.0, 465.0, 2.150537634408602, 0.3885248655913978, 1.4826948924731183], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=edce2736-1f3f-4180-94ac-a67b09555461", 1, 0, 0.0, 546.0, 546, 546, 546.0, 546.0, 546.0, 546.0, 1.8315018315018314, 0.3308865613553113, 1.262734661172161], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/25e1d630-8d80-496b-87e4-e797e6a0e282", 3, 0, 0.0, 284.0, 211, 423, 218.0, 423.0, 423.0, 423.0, 0.036344252762163215, 0.029541536180703626, 0.02330669854865284], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 16, 8, 50.0, 459.25, 79, 1016, 353.0, 1006.2, 1016.0, 1016.0, 0.06689047103433571, 40.02107833710289, 0.09757582139408102], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 332.7368421052632, 160, 1003, 173.0, 1002.0, 1003.0, 1003.0, 0.09438883231078765, 17.952953842619042, 0.2084694959512159], "isController": false}, {"data": ["register", 25, 8, 32.0, 1159.52, 182, 2792, 1120.0, 2204.2000000000016, 2768.2999999999997, 2792.0, 0.09753927906768056, 0.030526746245713148, 0.044006979423113685], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/e486b87f-86c3-4067-a5be-12cb071a1e4e", 3, 0, 0.0, 444.6666666666667, 321, 510, 503.0, 510.0, 510.0, 510.0, 0.03379253635513703, 0.02817144713720896, 0.0216703439516992], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 211.0666666666667, 160, 339, 175.0, 334.2, 339.0, 339.0, 0.07157103186342338, 0.11092112067114543, 0.1609649281068985], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 88.21428571428571, 81, 104, 85.5, 101.0, 104.0, 104.0, 0.12534582016456114, 0.09731438186604113, 0.044556522011621344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 294.5, 165, 939, 178.0, 850.8000000000002, 939.0, 939.0, 0.1033947957952783, 13.88645061462462, 0.22959792707794818], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 84.33333333333333, 80, 91, 84.0, 91.0, 91.0, 91.0, 0.06269854539374686, 0.04659530570765758, 0.031471730793345594], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 97.44444444444444, 79, 233, 79.0, 233.0, 233.0, 233.0, 0.06263483888927553, 0.02721244519451597, 0.035136948465446446], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 171.55555555555557, 78, 707, 80.0, 707.0, 707.0, 707.0, 0.06242890041896729, 6.256471850201854, 0.03610525599317444], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 83.5, 80, 90, 82.0, 90.0, 90.0, 90.0, 0.022095541119802022, 0.006516458416191613, 0.013658669461752617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 158.44444444444446, 78, 469, 83.0, 469.0, 469.0, 469.0, 0.06253213456915359, 2.057928748975168, 0.03622602717716049], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 918.6666666666669, 622, 1436, 861.0, 1180.0, 1346.5, 1436.0, 0.22941918709134707, 274.46510677551333, 0.4530132776354529], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2e352f15-0bd0-41a1-bb56-0c07786e7b2f", 3, 0, 0.0, 306.0, 180, 383, 355.0, 383.0, 383.0, 383.0, 0.07823705828660843, 0.035400231451297434, 0.05017155104968053], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 8, 32.0, 1159.52, 182, 2792, 1120.0, 2204.2000000000016, 2768.2999999999997, 2792.0, 0.09706061629608922, 0.030376939756416674, 0.04379102024296213], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 82.625, 79, 89, 80.5, 89.0, 89.0, 89.0, 0.038887808671981335, 0.01048147968111997, 0.02289975452070776], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 86.00000000000001, 80, 102, 83.0, 102.0, 102.0, 102.0, 0.03888818674107273, 0.01048158158255476, 0.022862000408325964], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 103.14285714285714, 78, 235, 80.0, 234.5, 235.0, 235.0, 0.12300663357202478, 0.0331541317049598, 0.07231444668980364], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 133.92857142857144, 77, 333, 80.5, 296.0, 333.0, 333.0, 0.12299906872133683, 0.033152092741297816, 0.07243011566305284], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 87.75, 79, 106, 86.5, 106.0, 106.0, 106.0, 0.038887808671981335, 0.010405526929807505, 0.022178203383239354], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 93.28571428571429, 79, 237, 81.5, 163.0, 237.0, 237.0, 0.12300014935732423, 0.09140929068449584, 0.06174030934537564], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 85.25, 80, 94, 84.0, 94.0, 94.0, 94.0, 0.038886863531413296, 0.028899319479888202, 0.01951938267104144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 114.78571428571429, 78, 253, 80.0, 244.0, 253.0, 253.0, 0.12300771434094222, 0.03291417356388494, 0.07015283708506863], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 148.50000000000003, 82, 241, 100.0, 241.0, 241.0, 241.0, 0.038842305096595954, 0.030573142488140956, 0.013807225639805593], "isController": false}, {"data": ["deleteAccount", 16, 4, 25.0, 436.5625, 79, 813, 470.5, 790.6, 813.0, 813.0, 0.08672979873266082, 0.01755346756576558, 0.059012682877911546], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1612.875, 981, 3550, 1402.0, 2374.5, 3293.75, 3550.0, 0.09798037942901934, 0.0507125010716604, 0.045067147178777446], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 175.49999999999997, 162, 192, 175.5, 192.0, 192.0, 192.0, 0.03887042543680641, 0.0602415675470818, 0.08742049783297377], "isController": false}, {"data": ["addBook", 56, 15, 26.785714285714285, 915.2321428571428, 412, 3613, 744.5, 1577.9000000000003, 1680.8999999999996, 3613.0, 0.26123301985370956, 84.75343254648548, 0.9475436953043365], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/01416925-9d21-433e-936d-7671b8dbc29e", 3, 0, 0.0, 362.0, 208, 513, 365.0, 513.0, 513.0, 513.0, 0.08308868332133164, 0.037595465435107736, 0.05328278194759874], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 145.96296296296302, 79, 349, 88.0, 323.5, 332.75, 349.0, 0.23003292878776907, 0.17095220586669166, 0.11119755834955633], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 518.6666666666665, 390, 773, 469.0, 683.0, 751.75, 773.0, 0.2297735454058056, 67.56105154905664, 0.11555993738670887], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 136.79629629629628, 79, 328, 88.0, 243.5, 259.25, 328.0, 0.23030468456788017, 0.4075313363642567, 0.1120036454246136], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 764.5925925925928, 540, 1105, 768.0, 934.0, 1027.5, 1105.0, 0.2297686570021998, 206.7462414607968, 0.11533309540930733], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 101.38888888888887, 81, 293, 88.5, 125.60000000000026, 293.0, 293.0, 0.10383197678778475, 0.0775697873463431, 0.03690902299878286], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 166, 15, 9.036144578313253, 162.4638554216868, 80, 2443, 90.0, 350.4000000000001, 417.60000000000014, 1275.8600000000217, 0.6829448912842244, 1.508273089245675, 0.32647838541130975], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 103.88888888888889, 80, 240, 85.0, 240.0, 240.0, 240.0, 0.06216671732102892, 0.04814278011286713, 0.022098325297709505], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e6a1eff2-9550-44ed-9c67-66cea1e9ebc5", 1, 0, 0.0, 704.0, 704, 704, 704.0, 704.0, 704.0, 704.0, 1.4204545454545454, 0.2566250887784091, 0.9793368252840909], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 109.78947368421052, 82, 249, 91.0, 238.0, 249.0, 249.0, 0.09084476064796221, 0.07372265243989902, 0.032292473511580315], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=25e1d630-8d80-496b-87e4-e797e6a0e282", 1, 0, 0.0, 537.0, 537, 537, 537.0, 537.0, 537.0, 537.0, 1.86219739292365, 0.33643214618249534, 1.2838978119180633], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/290d13d9-7100-41be-bcd9-61ca2f861612", 1, 0, 0.0, 378.0, 378, 378, 378.0, 378.0, 378.0, 378.0, 2.6455026455026456, 0.8448040674603174, 1.5785176917989419], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=01416925-9d21-433e-936d-7671b8dbc29e", 1, 0, 0.0, 309.0, 309, 309, 309.0, 309.0, 309.0, 309.0, 3.236245954692557, 0.5846733414239482, 2.2312398867313914], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/edce2736-1f3f-4180-94ac-a67b09555461", 3, 0, 0.0, 431.66666666666663, 202, 781, 312.0, 781.0, 781.0, 781.0, 0.030585404644903454, 0.030874134050730993, 0.019613687223456966], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 274.6666666666667, 161, 788, 177.0, 788.0, 788.0, 788.0, 0.06239124858753145, 8.379464223818205, 0.13854567082723862], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9b71e7f8-8cc7-4a18-9ef5-293d4ffde291", 3, 0, 0.0, 370.0, 173, 752, 185.0, 752.0, 752.0, 752.0, 0.03071882039729674, 0.025609016613762033, 0.01969924354904772], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 252.4285714285714, 159, 476, 175.0, 446.0, 476.0, 476.0, 0.12290620500754997, 0.19048061264353688, 0.2764189356761597], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c2147008-2245-4148-92b6-1229f4bfdd4d", 3, 0, 0.0, 975.0, 195, 1917, 813.0, 1917.0, 1917.0, 1917.0, 0.026941590631510883, 0.02702052107281414, 0.01727699659637905], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b8a93959-61c3-46ed-b699-0c34719c0be8", 1, 0, 0.0, 183.0, 183, 183, 183.0, 183.0, 183.0, 183.0, 5.46448087431694, 1.7450051229508197, 3.2605447404371586], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 101.53846153846155, 82, 254, 86.0, 200.39999999999995, 254.0, 254.0, 0.1147710317915758, 0.09515684178813268, 0.04079751520716171], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bc712953-dc54-403a-8f71-3e3fb47d03e9", 3, 0, 0.0, 525.6666666666666, 205, 1020, 352.0, 1020.0, 1020.0, 1020.0, 0.04574565416285453, 0.029410047842329978, 0.029335592025007625], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/78d1a535-ec03-4da4-8a71-2c3f52d384e7", 3, 0, 0.0, 349.3333333333333, 219, 447, 382.0, 447.0, 447.0, 447.0, 0.02374544878898211, 0.028066316586195978, 0.015227387406996992], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 89.07142857142856, 80, 115, 85.5, 106.5, 115.0, 115.0, 0.06552405200737614, 0.05087072397057034, 0.023291752861996987], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0c174169-33e9-4453-be49-84f8b36c72ac", 3, 0, 0.0, 349.66666666666663, 196, 606, 247.0, 606.0, 606.0, 606.0, 0.05333902282910177, 0.03380568927352251, 0.03420503742621435], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 86.05555555555554, 79, 119, 86.0, 92.00000000000004, 119.0, 119.0, 0.10390210113137845, 0.07721630757908104, 0.05215398435696144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 134.1666666666667, 78, 244, 86.0, 237.70000000000002, 244.0, 244.0, 0.10381341269291992, 0.04510296271945002, 0.05823734197291623], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 188.33333333333331, 78, 850, 85.5, 763.6000000000001, 850.0, 850.0, 0.10344708681509408, 10.367214259749888, 0.05982779651958023], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 141.5, 78, 613, 84.5, 478.0000000000002, 613.0, 613.0, 0.10367767762002131, 3.412026070616018, 0.06006240460213691], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 20.512820512820515, 0.6196746707978311], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 10.256410256410257, 0.30983733539891556], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 4, 10.256410256410257, 0.30983733539891556], "isController": false}, {"data": ["401/Unauthorized", 23, 58.97435897435897, 1.7815646785437644], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1291, 39, "401/Unauthorized", 23, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 16, 8, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 166, 15, "401/Unauthorized", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
