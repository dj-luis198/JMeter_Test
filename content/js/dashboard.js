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

    var data = {"OkPercent": 97.77448071216617, "KoPercent": 2.2255192878338277};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8070790816326531, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7ba0f174-3f95-496e-9129-25425851be34"], "isController": false}, {"data": [0.3706896551724138, 500, 1500, "see books"], "isController": true}, {"data": [0.5666666666666667, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.98, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.98, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4e51b7d2-bbd9-4e99-b9d5-aa29cca1595f"], "isController": false}, {"data": [0.8, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4152c555-7461-4a21-84a1-0f839b4ac13c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c942e8ef-445d-42ac-a158-7e68cccb38a0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fde2d141-1e36-4042-aec0-d632e60a350e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/66e9dd9f-def4-46ce-a48f-80c401bbbf8b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d1954d1a-61ae-467e-b100-28e0a9d8b6df"], "isController": false}, {"data": [0.6904761904761905, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e16ee00f-e158-41e6-99f6-6361b961da9c"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6ccf8fc2-d615-4892-bc3c-cfd1dfc0bee6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3b75ab23-dade-4529-9f46-f3d3d56cf068"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/763f04ba-8efb-47ca-bc84-43fe00e4bd0b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c43600a4-e6ab-40c0-8617-c4c7d46b7c53"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f2ea041d-8559-48a4-8783-626c90740041"], "isController": false}, {"data": [0.96, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.2391304347826087, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4e51b7d2-bbd9-4e99-b9d5-aa29cca1595f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.49137931034482757, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2391304347826087, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7ba0f174-3f95-496e-9129-25425851be34"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5357142857142857, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.40476190476190477, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6ccf8fc2-d615-4892-bc3c-cfd1dfc0bee6"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/fde2d141-1e36-4042-aec0-d632e60a350e"], "isController": false}, {"data": [0.3416666666666667, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8706896551724138, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9157303370786517, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c942e8ef-445d-42ac-a158-7e68cccb38a0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f2ea041d-8559-48a4-8783-626c90740041"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8b5d0b48-bcf7-4efd-9db4-3bd25a5c7fec"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4152c555-7461-4a21-84a1-0f839b4ac13c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3b75ab23-dade-4529-9f46-f3d3d56cf068"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c43600a4-e6ab-40c0-8617-c4c7d46b7c53"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=763f04ba-8efb-47ca-bc84-43fe00e4bd0b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d1954d1a-61ae-467e-b100-28e0a9d8b6df"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e16ee00f-e158-41e6-99f6-6361b961da9c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1348, 30, 2.2255192878338277, 298.513353115727, 77, 2052, 91.0, 852.0, 1035.7499999999998, 1437.04, 5.4800757779024485, 771.982922816761, 4.017153535370475], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7ba0f174-3f95-496e-9129-25425851be34", 1, 0, 0.0, 491.0, 491, 491, 491.0, 491.0, 491.0, 491.0, 2.0366598778004072, 0.3679512474541752, 1.404181517311609], "isController": false}, {"data": ["see books", 58, 0, 0.0, 1334.0, 947, 2003, 1295.0, 1588.6000000000001, 1747.0, 2003.0, 0.24438854407631666, 294.0821391410901, 1.2016565619377484], "isController": true}, {"data": ["deleteBook", 15, 3, 20.0, 458.8666666666666, 81, 858, 486.0, 757.8000000000001, 858.0, 858.0, 0.08429570934839417, 0.017155493972856782, 0.05648800366686336], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, 20.0, 458.8666666666666, 81, 858, 486.0, 757.8000000000001, 858.0, 858.0, 0.08632099902169534, 0.017567672066524716, 0.057845185086608734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 25, 0, 0.0, 95.52, 78, 242, 82.0, 157.00000000000028, 240.8, 242.0, 0.1128337056845621, 0.0369706688782073, 0.06397142204319274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 25, 0, 0.0, 95.6, 79, 262, 82.0, 152.80000000000035, 258.4, 262.0, 0.11282810412680074, 0.08384979222704625, 0.05663441945427303], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 25, 0, 0.0, 134.6, 78, 629, 81.0, 240.20000000000002, 512.8999999999997, 629.0, 0.1128342149446661, 1.356276078807929, 0.06605649919436371], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 25, 0, 0.0, 140.43999999999997, 78, 928, 81.0, 240.20000000000002, 722.1999999999996, 928.0, 0.1128337056845621, 4.09031438996457, 0.06594601189267257], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4e51b7d2-bbd9-4e99-b9d5-aa29cca1595f", 3, 0, 0.0, 291.6666666666667, 181, 428, 266.0, 428.0, 428.0, 428.0, 0.04853819146698594, 0.030194167934052777, 0.03112637929360752], "isController": false}, {"data": ["goToProfile", 15, 3, 20.0, 176.0, 78, 292, 181.0, 283.6, 292.0, 292.0, 0.08454991263175694, 0.16312188222197171, 0.054643683769235105], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4152c555-7461-4a21-84a1-0f839b4ac13c", 1, 0, 0.0, 809.0, 809, 809, 809.0, 809.0, 809.0, 809.0, 1.2360939431396785, 0.22331775339925833, 0.8522288318912237], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c942e8ef-445d-42ac-a158-7e68cccb38a0", 1, 0, 0.0, 470.0, 470, 470, 470.0, 470.0, 470.0, 470.0, 2.127659574468085, 0.38439162234042556, 1.4669215425531916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 91.1875, 79, 236, 81.0, 131.0000000000001, 236.0, 236.0, 0.09143118374810709, 0.06794836995342723, 0.045894168404811565], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 80.125, 78, 84, 80.0, 82.6, 84.0, 84.0, 0.09143327371121944, 0.024465543942259884, 0.05214553891342983], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 551.1428571428571, 389, 642, 611.0, 642.0, 642.0, 642.0, 0.054577066716565696, 16.04746974383864, 0.031125983361791378], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 891.7142857142858, 707, 1049, 893.0, 1049.0, 1049.0, 1049.0, 0.05448658073354505, 49.02712112123653, 0.03102116852310231], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 158.57142857142858, 78, 323, 80.0, 323.0, 323.0, 323.0, 0.054814687203902805, 0.09699630196628113, 0.030351491840442276], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fde2d141-1e36-4042-aec0-d632e60a350e", 1, 0, 0.0, 656.0, 656, 656, 656.0, 656.0, 656.0, 656.0, 1.524390243902439, 0.2754025342987805, 1.0509956173780488], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 94.23076923076924, 78, 244, 81.0, 181.99999999999994, 244.0, 244.0, 0.07541171898112967, 0.056043279438124684, 0.03785314800419985], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 91.69230769230771, 77, 235, 80.0, 174.19999999999993, 235.0, 235.0, 0.07541346884553582, 0.020178994593434387, 0.04300924395096964], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 135.07692307692307, 78, 313, 80.0, 288.2, 313.0, 313.0, 0.07531211076673522, 0.020298967355096603, 0.044275283868725195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 92.6923076923077, 77, 246, 79.0, 181.59999999999994, 246.0, 246.0, 0.07534135428982079, 0.020306849398428264, 0.04436605140308784], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 104.0, 78, 235, 83.0, 235.0, 235.0, 235.0, 0.05481425797155923, 0.04073598663706697, 0.030779490560201718], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 692.7142857142858, 79, 1248, 854.0, 1195.0, 1248.0, 1248.0, 0.066904016630427, 43.005403470048506, 0.03522541277388832], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 100.56249999999999, 78, 241, 81.5, 238.2, 241.0, 241.0, 0.09135079275359836, 0.02462189335936831, 0.053704274646158415], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 434.7142857142857, 80, 727, 479.5, 715.0, 727.0, 727.0, 0.06690145892967224, 14.056045054548582, 0.035289399583299484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 119.0625, 78, 241, 80.5, 237.5, 241.0, 241.0, 0.09134870655940806, 0.024621331064840456, 0.05379225591340143], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 485.78571428571445, 81, 820, 484.5, 814.5, 820.0, 820.0, 0.08766491963005404, 0.017268815083375598, 0.05954805994401968], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 231.0769230769231, 160, 479, 166.0, 444.59999999999997, 479.0, 479.0, 0.07527504342790967, 0.11666161515634048, 0.1692953369281992], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/66e9dd9f-def4-46ce-a48f-80c401bbbf8b", 1, 0, 0.0, 189.0, 189, 189, 189.0, 189.0, 189.0, 189.0, 5.291005291005291, 1.6896081349206349, 3.1570353835978837], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d1954d1a-61ae-467e-b100-28e0a9d8b6df", 3, 0, 0.0, 594.0, 170, 1439, 173.0, 1439.0, 1439.0, 1439.0, 0.04463023847424091, 0.02869294302950059, 0.02862030266740059], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 658.7142857142858, 166, 1300, 599.0, 1214.2000000000003, 1297.8999999999999, 1300.0, 0.09562275457281673, 0.058737024049122774, 0.04323567906954506], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 81.42857142857144, 79, 89, 81.0, 86.0, 89.0, 89.0, 0.06690433635677216, 0.04972089840576525, 0.0335828407103329], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 167.78571428571428, 78, 328, 162.5, 288.0, 328.0, 328.0, 0.06690113923082804, 0.08967440649132197, 0.03414123427823228], "isController": false}, {"data": ["login", 21, 0, 0.0, 2580.6190476190477, 1548, 4640, 2389.0, 3200.0, 4496.299999999997, 4640.0, 0.09163663021565153, 36.6663154724632, 0.18891106092308632], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/e16ee00f-e158-41e6-99f6-6361b961da9c", 3, 0, 0.0, 363.0, 199, 689, 201.0, 689.0, 689.0, 689.0, 0.020643243466413445, 0.028458377630293272, 0.013238017457302891], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6ccf8fc2-d615-4892-bc3c-cfd1dfc0bee6", 3, 0, 0.0, 921.3333333333334, 216, 1414, 1134.0, 1414.0, 1414.0, 1414.0, 0.016676579966980375, 0.022990011770886026, 0.010694291189762803], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 84.6875, 81, 90, 84.0, 89.3, 90.0, 90.0, 0.09162228712134227, 0.07417468361678979, 0.032568859875164634], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3b75ab23-dade-4529-9f46-f3d3d56cf068", 1, 0, 0.0, 505.0, 505, 505, 505.0, 505.0, 505.0, 505.0, 1.9801980198019802, 0.3577506188118812, 1.3652537128712872], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 776.2142857142858, 161, 1330, 936.0, 1275.5, 1330.0, 1330.0, 0.06687493431926093, 57.17652012099586, 0.13818145259522513], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/763f04ba-8efb-47ca-bc84-43fe00e4bd0b", 3, 0, 0.0, 244.66666666666669, 165, 388, 181.0, 388.0, 388.0, 388.0, 0.0779058896852602, 0.05008598051054326, 0.04995918055988366], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c43600a4-e6ab-40c0-8617-c4c7d46b7c53", 1, 0, 0.0, 381.0, 381, 381, 381.0, 381.0, 381.0, 381.0, 2.6246719160104988, 0.47418389107611547, 1.8095882545931758], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f2ea041d-8559-48a4-8783-626c90740041", 1, 0, 0.0, 402.0, 402, 402, 402.0, 402.0, 402.0, 402.0, 2.487562189054726, 0.4494130907960199, 1.7150575248756217], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 25, 0, 0.0, 263.68, 161, 1011, 170.0, 493.20000000000005, 858.8999999999996, 1011.0, 0.11278738224997292, 5.565123293526907, 0.25250715776924604], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 5, 41.666666666666664, 627.0, 78, 1132, 860.5, 1117.0, 1132.0, 1132.0, 0.08681811604688179, 60.59739172605267, 0.1380413697366517], "isController": false}, {"data": ["register", 23, 7, 30.434782608695652, 1080.1739130434785, 132, 2052, 1103.0, 1929.6000000000004, 2047.1999999999998, 2052.0, 0.09529215331264528, 0.029875902685995784, 0.042993139482853625], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4e51b7d2-bbd9-4e99-b9d5-aa29cca1595f", 1, 0, 0.0, 410.0, 410, 410, 410.0, 410.0, 410.0, 410.0, 2.4390243902439024, 0.4406440548780488, 1.681592987804878], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 93.33333333333333, 80, 237, 84.5, 109.2000000000002, 237.0, 237.0, 0.10095005215752695, 0.0783743080715175, 0.03588458885287091], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 212.5625, 160, 477, 165.5, 368.5000000000001, 477.0, 477.0, 0.09130543952155949, 0.1415055981647607, 0.2053480734552261], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 20, 0, 0.0, 276.7, 159, 1006, 177.5, 454.2000000000003, 979.0999999999997, 1006.0, 0.09637811060351972, 5.906985221922647, 0.21552366745214827], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 81.0, 79, 85, 80.0, 85.0, 85.0, 85.0, 0.049438563315350056, 0.03674096355759902, 0.02481584135165032], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 99.375, 77, 241, 79.0, 241.0, 241.0, 241.0, 0.049438563315350056, 0.03179227924136525, 0.027157413930551176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 287.375, 78, 930, 80.0, 930.0, 930.0, 930.0, 0.04943703575533611, 11.130876537955285, 0.028001446033295845], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 198.5, 78, 638, 79.0, 638.0, 638.0, 638.0, 0.049438563315350056, 3.6441387107040666, 0.02805059109982264], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 81.0, 81, 81, 81.0, 81.0, 81.0, 81.0, 0.1386001386001386, 0.040876212751212754, 0.08567762474012475], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 933.0862068965517, 622, 1661, 871.0, 1255.0, 1394.75, 1661.0, 0.2626478526273842, 314.2181429098665, 0.5186269121216512], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, 30.434782608695652, 1080.1739130434785, 132, 2052, 1103.0, 1929.6000000000004, 2047.1999999999998, 2052.0, 0.09687800111199096, 0.0303730961366738, 0.04370862940794905], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 4, 0, 0.0, 79.25, 77, 82, 79.0, 82.0, 82.0, 82.0, 0.022319311226055565, 0.006015751853897788, 0.013143110028624515], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 4, 0, 0.0, 122.0, 79, 248, 80.5, 248.0, 248.0, 248.0, 0.022298284147034886, 0.006010084399005497, 0.01310895220362793], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 113.72222222222223, 78, 238, 79.0, 235.3, 238.0, 238.0, 0.10133423408208074, 0.027312742779935822, 0.05957344620841074], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 106.55555555555556, 78, 244, 80.0, 239.5, 244.0, 244.0, 0.10133423408208074, 0.027312742779935822, 0.059672405421381525], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 99.55555555555556, 79, 234, 81.5, 234.0, 234.0, 234.0, 0.10133537505348257, 0.07530880899970727, 0.050865608181142614], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 4, 0, 0.0, 80.0, 78, 81, 80.5, 81.0, 81.0, 81.0, 0.02231943576466387, 0.005972192772966699, 0.012729053209534862], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7ba0f174-3f95-496e-9129-25425851be34", 3, 0, 0.0, 394.6666666666667, 168, 519, 497.0, 519.0, 519.0, 519.0, 0.030755036137167464, 0.02499847826644113, 0.01972246783535804], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 114.33333333333336, 78, 239, 80.0, 237.2, 239.0, 239.0, 0.10133651605057818, 0.027115434958846114, 0.057793481810095367], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 4, 0, 0.0, 82.5, 80, 88, 81.0, 88.0, 88.0, 88.0, 0.022318937618569356, 0.01658663235130008, 0.011203060484320947], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 4, 0, 0.0, 86.75, 84, 91, 86.0, 91.0, 91.0, 91.0, 0.023970899328215545, 0.01886771958841966, 0.00852090562057662], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 614.5714285714287, 79, 1439, 550.5, 1286.5, 1439.0, 1439.0, 0.0886103990632615, 0.017108927497705623, 0.06030155226431216], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1301.190476190476, 826, 1867, 1332.0, 1730.4, 1857.9999999999998, 1867.0, 0.09273611276711313, 0.04799818336579097, 0.04265498936846707], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 4, 0, 0.0, 206.0, 162, 336, 163.0, 336.0, 336.0, 336.0, 0.022288095927964872, 0.034542195544609626, 0.050126450119241314], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6ccf8fc2-d615-4892-bc3c-cfd1dfc0bee6", 1, 0, 0.0, 820.0, 820, 820, 820.0, 820.0, 820.0, 820.0, 1.2195121951219512, 0.2203220274390244, 0.840796493902439], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fde2d141-1e36-4042-aec0-d632e60a350e", 3, 0, 0.0, 973.3333333333334, 278, 1926, 716.0, 1926.0, 1926.0, 1926.0, 0.032574704656011116, 0.02715619095834781, 0.020889377660267546], "isController": false}, {"data": ["addBook", 60, 13, 21.666666666666668, 870.1333333333333, 408, 2910, 685.0, 1533.5, 1634.2499999999998, 2910.0, 0.2879327389121901, 81.48635697451076, 1.0480536121761956], "isController": true}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 153.22413793103448, 79, 348, 83.0, 325.4, 340.4, 348.0, 0.2636435539151068, 0.19593041457948854, 0.12744488201950963], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 492.50000000000006, 384, 732, 468.5, 628.5, 646.1499999999997, 732.0, 0.26335624835402344, 77.43548126651652, 0.13244967568586138], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 123.89655172413798, 78, 250, 84.5, 236.5, 244.05, 250.0, 0.26399756029840826, 0.46715193287179274, 0.12838943850449933], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 778.4999999999999, 540, 1288, 771.5, 1005.5, 1060.4499999999998, 1288.0, 0.2630922410469257, 236.73086096085368, 0.1320599725567576], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 20, 0, 0.0, 105.25000000000001, 81, 264, 85.0, 237.8000000000002, 263.2, 264.0, 0.09484651462770372, 0.07085701532245445, 0.033714971996566555], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 13, 7.303370786516854, 151.3932584269663, 79, 1400, 87.0, 276.1, 347.14999999999895, 1166.9500000000023, 0.7720634480006593, 1.6593400158750125, 0.37000778162966114], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 87.0, 80, 101, 84.0, 101.0, 101.0, 101.0, 0.04930905684101527, 0.03818562702629406, 0.017527828798954648], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c942e8ef-445d-42ac-a158-7e68cccb38a0", 3, 0, 0.0, 296.0, 181, 481, 226.0, 481.0, 481.0, 481.0, 0.047058823529411764, 0.030254289215686275, 0.030177696078431373], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f2ea041d-8559-48a4-8783-626c90740041", 3, 0, 0.0, 404.6666666666667, 262, 660, 292.0, 660.0, 660.0, 660.0, 0.018474726574046706, 0.0254689020316041, 0.01184739952827865], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 25, 0, 0.0, 91.51999999999998, 79, 245, 85.0, 94.00000000000001, 200.5999999999999, 245.0, 0.11579595825787296, 0.09397113409403558, 0.041161844536978284], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8b5d0b48-bcf7-4efd-9db4-3bd25a5c7fec", 1, 0, 0.0, 183.0, 183, 183, 183.0, 183.0, 183.0, 183.0, 5.46448087431694, 1.7450051229508197, 3.2605447404371586], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 369.87499999999994, 158, 1013, 164.0, 1013.0, 1013.0, 1013.0, 0.04941260762683598, 14.83609924908278, 0.10796944293461477], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4152c555-7461-4a21-84a1-0f839b4ac13c", 3, 0, 0.0, 365.33333333333337, 165, 750, 181.0, 750.0, 750.0, 750.0, 0.01863411907202087, 0.025688637457685022, 0.011949614118450884], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3b75ab23-dade-4529-9f46-f3d3d56cf068", 3, 0, 0.0, 288.6666666666667, 174, 504, 188.0, 504.0, 504.0, 504.0, 0.03159125132946516, 0.026336326385013112, 0.02025871260385624], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 241.83333333333334, 160, 472, 166.0, 467.5, 472.0, 472.0, 0.10128861628495864, 0.15697757230881773, 0.22780047197681616], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c43600a4-e6ab-40c0-8617-c4c7d46b7c53", 3, 0, 0.0, 323.66666666666663, 193, 582, 196.0, 582.0, 582.0, 582.0, 0.0348375409341106, 0.029042624457114984, 0.02234048035162691], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=763f04ba-8efb-47ca-bc84-43fe00e4bd0b", 1, 0, 0.0, 478.0, 478, 478, 478.0, 478.0, 478.0, 478.0, 2.092050209205021, 0.377958289748954, 1.4423705543933054], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 99.76923076923077, 81, 252, 87.0, 189.59999999999994, 252.0, 252.0, 0.07698958863870563, 0.06383218823658308, 0.02736739283641489], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 86.49999999999999, 81, 94, 85.0, 94.0, 94.0, 94.0, 0.06965763273510694, 0.054079900414462916, 0.024761111636307547], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d1954d1a-61ae-467e-b100-28e0a9d8b6df", 1, 0, 0.0, 500.0, 500, 500, 500.0, 500.0, 500.0, 500.0, 2.0, 0.361328125, 1.37890625], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e16ee00f-e158-41e6-99f6-6361b961da9c", 1, 0, 0.0, 717.0, 717, 717, 717.0, 717.0, 717.0, 717.0, 1.3947001394700138, 0.2519721931659693, 0.9615803695955369], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 20, 0, 0.0, 89.49999999999999, 78, 234, 80.5, 102.20000000000005, 227.49999999999991, 234.0, 0.09641574469110806, 0.07165271651360668, 0.04839618434690385], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 20, 0, 0.0, 118.55, 78, 235, 81.0, 234.0, 234.95, 235.0, 0.09641713911064831, 0.03303981847063134, 0.05458302299066682], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 20, 0, 0.0, 170.4, 77, 926, 80.0, 248.9, 892.1499999999995, 926.0, 0.09641853357052292, 4.362566717105612, 0.056269253575922364], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 20, 0, 0.0, 119.65, 78, 547, 80.0, 233.8, 531.3499999999998, 547.0, 0.09641760392612483, 1.4421870254446056, 0.05636286885759602], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 23.333333333333332, 0.5192878338278932], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 10.0, 0.22255192878338279], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 6.666666666666667, 0.14836795252225518], "isController": false}, {"data": ["401/Unauthorized", 18, 60.0, 1.3353115727002967], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1348, 30, "401/Unauthorized", 18, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 5, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
