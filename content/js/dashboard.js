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

    var data = {"OkPercent": 98.28358208955224, "KoPercent": 1.7164179104477613};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8147551546391752, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3448275862068966, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c09aa1c4-92e9-4698-98aa-1caaae155243"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3ca02265-c2db-4508-bb28-fa9847bb0c81"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/715f8f8a-e519-4aa1-be11-f014e14d813e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=746649a0-0473-46f4-a32d-223b745051bc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/984a2468-ce93-4822-9ce2-588dfe9e31a6"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a2091e60-325c-455a-913e-a5a1238bb281"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d708c5df-7367-4482-9253-bd9e261318f7"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7894736842105263, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c72c8cf9-a936-40ac-a57f-c4e12ea90761"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bba06c6a-429f-4baa-aa31-7e91b08fdd84"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c9771a97-57f4-4cdd-8f02-09a172407358"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5cd96009-4f83-4b61-8f9c-e67757935e2e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.4375, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.2727272727272727, 500, 1500, "register"], "isController": true}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8bfcea87-39da-4237-92d9-23d1fdbfe01b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=984a2468-ce93-4822-9ce2-588dfe9e31a6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.49137931034482757, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2727272727272727, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bd4ed0e9-ea4c-4ec1-a195-164ca98309c5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/746649a0-0473-46f4-a32d-223b745051bc"], "isController": false}, {"data": [0.2619047619047619, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c72c8cf9-a936-40ac-a57f-c4e12ea90761"], "isController": false}, {"data": [0.3416666666666667, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=715f8f8a-e519-4aa1-be11-f014e14d813e"], "isController": false}, {"data": [0.9913793103448276, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8275862068965517, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9129213483146067, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d708c5df-7367-4482-9253-bd9e261318f7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a2091e60-325c-455a-913e-a5a1238bb281"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5cd96009-4f83-4b61-8f9c-e67757935e2e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bba06c6a-429f-4baa-aa31-7e91b08fdd84"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bd4ed0e9-ea4c-4ec1-a195-164ca98309c5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3ca02265-c2db-4508-bb28-fa9847bb0c81"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8bfcea87-39da-4237-92d9-23d1fdbfe01b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c9771a97-57f4-4cdd-8f02-09a172407358"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/be5c024a-1b9e-499b-9876-272f706f1f4f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1340, 23, 1.7164179104477613, 301.42014925373104, 77, 2830, 91.0, 861.0, 1038.6500000000003, 1625.0099999999968, 5.2651018050655, 727.3285443786198, 3.8672536514365086], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 1363.0862068965512, 947, 2019, 1304.5, 1690.5, 1728.0999999999997, 2019.0, 0.2533171443296267, 304.82621195056385, 1.2455584196285847], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/c09aa1c4-92e9-4698-98aa-1caaae155243", 1, 0, 0.0, 275.0, 275, 275, 275.0, 275.0, 275.0, 275.0, 3.6363636363636362, 1.1612215909090908, 2.169744318181818], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 662.8461538461538, 107, 2510, 505.0, 1823.1999999999994, 2510.0, 2510.0, 0.06561779150703878, 0.012431495656606955, 0.04435806083021649], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 662.8461538461538, 107, 2510, 505.0, 1823.1999999999994, 2510.0, 2510.0, 0.06621673245893289, 0.012544966891633771, 0.04476294887304215], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3ca02265-c2db-4508-bb28-fa9847bb0c81", 3, 0, 0.0, 422.0, 294, 508, 464.0, 508.0, 508.0, 508.0, 0.08411372175180845, 0.03805926863118937, 0.053940114534851126], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 116.00000000000001, 78, 244, 80.5, 244.0, 244.0, 244.0, 0.08086834633217121, 0.021638600483413005, 0.0461202287675664], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 92.38888888888889, 78, 237, 83.0, 109.2000000000002, 237.0, 237.0, 0.08092251669026906, 0.06013870625126441, 0.04061931013554521], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 89.44444444444444, 77, 244, 80.0, 103.60000000000022, 244.0, 244.0, 0.08092761025262903, 0.021812519950903917, 0.04765561424056182], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/715f8f8a-e519-4aa1-be11-f014e14d813e", 3, 0, 0.0, 271.6666666666667, 178, 428, 209.0, 428.0, 428.0, 428.0, 0.023331052074908234, 0.027576513699216074, 0.01496164472251602], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 115.55555555555557, 77, 243, 81.5, 238.5, 243.0, 243.0, 0.08086907297086017, 0.021796742324177158, 0.0475421698520096], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=746649a0-0473-46f4-a32d-223b745051bc", 1, 0, 0.0, 998.0, 998, 998, 998.0, 998.0, 998.0, 998.0, 1.002004008016032, 0.18102611472945893, 0.6908347945891784], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/984a2468-ce93-4822-9ce2-588dfe9e31a6", 3, 0, 0.0, 306.0, 222, 412, 284.0, 412.0, 412.0, 412.0, 0.017653497157786958, 0.024336770984123623, 0.011320764778919372], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a2091e60-325c-455a-913e-a5a1238bb281", 3, 0, 0.0, 578.0, 279, 988, 467.0, 988.0, 988.0, 988.0, 0.041384447724545116, 0.03409636627305459, 0.026538854823357383], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 288.92307692307696, 82, 475, 279.0, 455.4, 475.0, 475.0, 0.06600559524353526, 0.15168097687011622, 0.04266662763451179], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 21, 0, 0.0, 89.00000000000001, 79, 235, 82.0, 89.0, 220.4999999999998, 235.0, 0.10805804260574252, 0.0803048539286817, 0.0542400721673356], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 21, 0, 0.0, 103.28571428571429, 77, 242, 80.0, 241.0, 242.0, 242.0, 0.10805748658286209, 0.04437070342850968, 0.06076223622395686], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 564.4285714285713, 460, 657, 619.0, 657.0, 657.0, 657.0, 0.051824212271973466, 15.238039133758292, 0.029555996061359866], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 800.8571428571428, 699, 960, 790.0, 960.0, 960.0, 960.0, 0.0517322927752158, 46.54880797481007, 0.02945305340620196], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 148.57142857142858, 81, 240, 85.0, 240.0, 240.0, 240.0, 0.05196849224555855, 0.09195987104389852, 0.028775522561749704], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 82.6923076923077, 79, 92, 82.0, 92.0, 92.0, 92.0, 0.07263624884061372, 0.05398064977315141, 0.03645999209382369], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 105.23076923076924, 78, 244, 82.0, 240.8, 244.0, 244.0, 0.07263462548469644, 0.019435436897272288, 0.04142443484674094], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 124.61538461538463, 77, 328, 81.0, 295.59999999999997, 328.0, 328.0, 0.07263624884061372, 0.01957773894532167, 0.04270216972856393], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 117.92307692307692, 77, 258, 81.0, 248.79999999999998, 258.0, 258.0, 0.07263503131687311, 0.019577410784625958, 0.042772386605541494], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 108.57142857142857, 82, 245, 84.0, 245.0, 245.0, 245.0, 0.05190644974714144, 0.03857500806403773, 0.029146688090435864], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d708c5df-7367-4482-9253-bd9e261318f7", 3, 0, 0.0, 348.3333333333333, 231, 549, 265.0, 549.0, 549.0, 549.0, 0.018905259443177093, 0.026062426348260084, 0.012123489942401975], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 21, 0, 0.0, 165.42857142857142, 78, 895, 81.0, 750.2000000000005, 893.1, 895.0, 0.10805859863434514, 9.286476771903736, 0.06264222891442274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 519.3157894736842, 78, 1014, 695.0, 995.0, 1014.0, 1014.0, 0.09977471918667849, 47.26403730196031, 0.0541437852165374], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 21, 0, 0.0, 131.76190476190473, 79, 631, 82.0, 390.20000000000016, 610.5999999999997, 631.0, 0.10796748636267821, 3.0497601579410087, 0.06269484757304515], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 373.4736842105263, 78, 728, 482.0, 642.0, 728.0, 728.0, 0.09969357343743442, 15.440739057318558, 0.054197107640200644], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 505.3076923076924, 87, 1101, 430.0, 1059.8, 1101.0, 1101.0, 0.06704417695536921, 0.012701728837247683, 0.04585616219791441], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/c72c8cf9-a936-40ac-a57f-c4e12ea90761", 3, 0, 0.0, 366.3333333333333, 217, 462, 420.0, 462.0, 462.0, 462.0, 0.08693132425383947, 0.03933416038829325, 0.05574697551434367], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 233.53846153846152, 161, 421, 167.0, 387.0, 421.0, 421.0, 0.07260217359738186, 0.11251918896391114, 0.1632839900339555], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 736.5238095238095, 145, 1345, 736.0, 1302.0000000000002, 1344.4, 1345.0, 0.0970254761178721, 0.05959865671693511, 0.043869917424389435], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 91.42105263157895, 79, 250, 83.0, 92.0, 250.0, 250.0, 0.09977262344236555, 0.07414742816371113, 0.050081180126343654], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 140.26315789473682, 80, 252, 82.0, 244.0, 252.0, 252.0, 0.09969409653536779, 0.10548430670626446, 0.05245008080468877], "isController": false}, {"data": ["login", 21, 0, 0.0, 2785.857142857143, 1711, 4026, 2734.0, 3847.4, 4016.0, 4026.0, 0.09230688081863017, 36.93450102224376, 0.19029279825012527], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 21, 0, 0.0, 97.80952380952381, 81, 239, 85.0, 161.60000000000005, 232.5999999999999, 239.0, 0.1067371470685405, 0.08641122550763679, 0.03794172024702026], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bba06c6a-429f-4baa-aa31-7e91b08fdd84", 3, 0, 0.0, 351.6666666666667, 178, 451, 426.0, 451.0, 451.0, 451.0, 0.033980857450303, 0.02799659837458232, 0.021791109758169565], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c9771a97-57f4-4cdd-8f02-09a172407358", 1, 0, 0.0, 229.0, 229, 229, 229.0, 229.0, 229.0, 229.0, 4.366812227074235, 0.7889260371179039, 3.0107123362445414], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 629.1052631578948, 162, 1096, 781.0, 1080.0, 1096.0, 1096.0, 0.09965017543675622, 62.81855174040343, 0.2106964055788364], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5cd96009-4f83-4b61-8f9c-e67757935e2e", 1, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 2.277904328018223, 0.4115354498861048, 1.570508257403189], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 236.94444444444446, 162, 471, 171.5, 352.20000000000016, 471.0, 471.0, 0.08083457204830315, 0.1252777986725167, 0.18179884709691616], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 1, 12.5, 806.625, 82, 1044, 912.0, 1044.0, 1044.0, 1044.0, 0.05315508660956924, 55.64474576503459, 0.10916518275383216], "isController": false}, {"data": ["register", 22, 7, 31.818181818181817, 976.0454545454544, 114, 1850, 1023.5, 1747.5, 1837.1, 1850.0, 0.08853439359976821, 0.027714157655609258, 0.03994422836239542], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 21, 0, 0.0, 279.00000000000006, 159, 1112, 165.0, 846.4000000000004, 1098.3999999999999, 1112.0, 0.10792254244953337, 12.447794276829029, 0.24009051842648932], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 96.5625, 82, 235, 86.0, 139.10000000000008, 235.0, 235.0, 0.0784390626532013, 0.06089751446220218, 0.02788263555250515], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8bfcea87-39da-4237-92d9-23d1fdbfe01b", 3, 0, 0.0, 483.6666666666667, 210, 1024, 217.0, 1024.0, 1024.0, 1024.0, 0.020423029007508867, 0.024139328882247624, 0.013096799200778797], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=984a2468-ce93-4822-9ce2-588dfe9e31a6", 1, 0, 0.0, 430.0, 430, 430, 430.0, 430.0, 430.0, 430.0, 2.3255813953488373, 0.42014898255813954, 1.6033793604651163], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 242.64705882352942, 162, 328, 233.0, 327.2, 328.0, 328.0, 0.09812126634151973, 0.15206879851952326, 0.22067702771925773], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 82.0, 78, 84, 83.0, 84.0, 84.0, 84.0, 0.07882794112678912, 0.05858209296629542, 0.03956793138590781], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 126.85714285714285, 79, 245, 82.0, 245.0, 245.0, 245.0, 0.07882971655086206, 0.021093107748961136, 0.044957572720413515], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 103.0, 78, 237, 80.0, 237.0, 237.0, 237.0, 0.07882705344474224, 0.02124635424877818, 0.04634168571653791], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 127.71428571428571, 81, 246, 83.0, 246.0, 246.0, 246.0, 0.07882882882882883, 0.02124683277027027, 0.04641971072635135], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 87.0, 87, 87, 87.0, 87.0, 87.0, 87.0, 11.494252873563218, 3.3899066091954024, 7.105334051724139], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 960.1896551724137, 618, 1672, 880.5, 1341.1000000000001, 1384.9999999999998, 1672.0, 0.25326294370139424, 302.99052911213874, 0.5000953829728703], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, 31.818181818181817, 976.0454545454544, 114, 1850, 1023.5, 1747.5, 1837.1, 1850.0, 0.08899316370696977, 0.027857767687391285, 0.0401512125318555], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 80.99999999999999, 77, 84, 81.0, 84.0, 84.0, 84.0, 0.03749611647365094, 0.01010637514328873, 0.022080232650011248], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 102.28571428571428, 78, 231, 82.0, 231.0, 231.0, 231.0, 0.0374652108756155, 0.01009804511881824, 0.02202544623742239], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bd4ed0e9-ea4c-4ec1-a195-164ca98309c5", 3, 0, 0.0, 618.3333333333334, 172, 1213, 470.0, 1213.0, 1213.0, 1213.0, 0.025828225084372203, 0.03052808765669123, 0.016563021945381912], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 111.31249999999997, 77, 243, 81.5, 242.3, 243.0, 243.0, 0.07771366400497368, 0.020946261001340564, 0.04568713450292398], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 106.25, 78, 322, 81.5, 268.1000000000001, 322.0, 322.0, 0.07771328654345873, 0.020946159263666612, 0.04576280447822814], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 91.9375, 79, 238, 82.0, 130.9000000000001, 238.0, 238.0, 0.07771177673406544, 0.05775259970178105, 0.03900766918096644], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 80.28571428571429, 79, 85, 80.0, 85.0, 85.0, 85.0, 0.03749571477545423, 0.01003303305515084, 0.021384274832876245], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 109.625, 78, 237, 81.0, 236.3, 237.0, 237.0, 0.07771290908561047, 0.02079427450142312, 0.04432064346288723], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 81.28571428571429, 79, 84, 81.0, 84.0, 84.0, 84.0, 0.037494509732503456, 0.027864572174253057, 0.018820486330573025], "isController": false}, {"data": ["deleteAccount", 12, 0, 0.0, 583.8333333333334, 412, 1024, 482.0, 1013.2, 1024.0, 1024.0, 0.06806386659482147, 0.012296694648478488, 0.046328627945889225], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 108.71428571428571, 81, 245, 89.0, 245.0, 245.0, 245.0, 0.03813487761428206, 0.030016319684679042, 0.013555757276951824], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/746649a0-0473-46f4-a32d-223b745051bc", 3, 0, 0.0, 389.3333333333333, 234, 598, 336.0, 598.0, 598.0, 598.0, 0.02272692837987303, 0.02686245994378873, 0.014574234670686807], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1502.857142857143, 884, 2830, 1481.0, 1968.0, 2746.8999999999987, 2830.0, 0.09409993413004611, 0.04870406746965277, 0.04328229392114426], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 185.42857142857142, 162, 311, 164.0, 311.0, 311.0, 311.0, 0.037448174401497926, 0.05803735622575899, 0.08422182192055637], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c72c8cf9-a936-40ac-a57f-c4e12ea90761", 1, 0, 0.0, 178.0, 178, 178, 178.0, 178.0, 178.0, 178.0, 5.617977528089887, 1.014966643258427, 3.8733321629213484], "isController": false}, {"data": ["addBook", 60, 13, 21.666666666666668, 842.5666666666671, 413, 3001, 701.0, 1541.8999999999999, 1696.4499999999998, 3001.0, 0.2929172606377785, 71.20956864577028, 1.0689477649192525], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=715f8f8a-e519-4aa1-be11-f014e14d813e", 1, 0, 0.0, 408.0, 408, 408, 408.0, 408.0, 408.0, 408.0, 2.450980392156863, 0.44280407475490197, 1.6898360906862746], "isController": false}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 150.53448275862067, 79, 592, 83.5, 331.4, 344.1499999999997, 592.0, 0.2542410029369219, 0.18894277659667733, 0.12289970356814098], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 509.48275862068965, 385, 725, 471.0, 646.4, 658.8999999999999, 725.0, 0.2544975866608161, 74.83074059346204, 0.12799439172882843], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 119.25862068965517, 78, 338, 85.0, 245.3, 291.4499999999999, 338.0, 0.25485319577119453, 0.45097069407949664, 0.12394227684966298], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 806.9310344827585, 537, 1041, 795.5, 1018.9, 1039.05, 1041.0, 0.25396269375602065, 228.516078260465, 0.12747736776425256], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 95.94117647058825, 81, 240, 85.0, 129.5999999999999, 240.0, 240.0, 0.1013721012051354, 0.07573208732610212, 0.03603461410026297], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 13, 7.303370786516854, 150.15168539325836, 80, 1805, 88.0, 281.29999999999995, 406.6999999999991, 838.8300000000097, 0.7236713718857738, 1.5371783308702758, 0.3470265313983933], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 85.14285714285715, 81, 90, 85.0, 90.0, 90.0, 90.0, 0.08156606851549755, 0.0631659104812398, 0.028994188417618274], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d708c5df-7367-4482-9253-bd9e261318f7", 1, 0, 0.0, 1101.0, 1101, 1101, 1101.0, 1101.0, 1101.0, 1101.0, 0.9082652134423251, 0.16409088328792007, 0.6262062897366031], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 85.94444444444444, 81, 95, 85.0, 93.2, 95.0, 95.0, 0.08225375282747276, 0.06675084824182603, 0.029238638700390705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 234.85714285714286, 162, 329, 171.0, 329.0, 329.0, 329.0, 0.07875255945818238, 0.12205108580091353, 0.17711635198456452], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 230.3125, 162, 482, 167.5, 426.00000000000006, 482.0, 482.0, 0.0776808385646523, 0.12039012773642892, 0.1747060265765569], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a2091e60-325c-455a-913e-a5a1238bb281", 1, 0, 0.0, 409.0, 409, 409, 409.0, 409.0, 409.0, 409.0, 2.444987775061125, 0.441721424205379, 1.6857044621026895], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5cd96009-4f83-4b61-8f9c-e67757935e2e", 3, 0, 0.0, 477.0, 290, 666, 475.0, 666.0, 666.0, 666.0, 0.020197395882424227, 0.027843740742860223, 0.01295210608345564], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bba06c6a-429f-4baa-aa31-7e91b08fdd84", 1, 0, 0.0, 443.0, 443, 443, 443.0, 443.0, 443.0, 443.0, 2.257336343115124, 0.40781955417607224, 1.5563275959367946], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bd4ed0e9-ea4c-4ec1-a195-164ca98309c5", 1, 0, 0.0, 657.0, 657, 657, 657.0, 657.0, 657.0, 657.0, 1.5220700152207, 0.2749833523592085, 1.0493959284627092], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3ca02265-c2db-4508-bb28-fa9847bb0c81", 1, 0, 0.0, 375.0, 375, 375, 375.0, 375.0, 375.0, 375.0, 2.6666666666666665, 0.4817708333333333, 1.8385416666666667], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 104.38461538461539, 80, 251, 87.0, 203.79999999999995, 251.0, 251.0, 0.07807010695604653, 0.06472804766180029, 0.027751483332032166], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8bfcea87-39da-4237-92d9-23d1fdbfe01b", 1, 0, 0.0, 815.0, 815, 815, 815.0, 815.0, 815.0, 815.0, 1.2269938650306749, 0.22167369631901843, 0.845954754601227], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 96.78947368421055, 81, 238, 88.0, 107.0, 238.0, 238.0, 0.09663408233223815, 0.07502353071692318, 0.03435039645403778], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c9771a97-57f4-4cdd-8f02-09a172407358", 3, 0, 0.0, 401.3333333333333, 317, 494, 393.0, 494.0, 494.0, 494.0, 0.05839643392443501, 0.026422865610340063, 0.037448233994510735], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/be5c024a-1b9e-499b-9876-272f706f1f4f", 1, 0, 0.0, 469.0, 469, 469, 469.0, 469.0, 469.0, 469.0, 2.1321961620469083, 0.6808868603411514, 1.2722381396588487], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 81.88235294117646, 79, 91, 81.0, 84.6, 91.0, 91.0, 0.0981682951054443, 0.07295514899926085, 0.04927588250409997], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 130.76470588235293, 79, 244, 81.0, 243.2, 244.0, 244.0, 0.0981711296032154, 0.026268446788360367, 0.05598822235183378], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 139.76470588235296, 78, 244, 81.0, 243.2, 244.0, 244.0, 0.09816999578446488, 0.02645988167628155, 0.05771322017797642], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 125.88235294117649, 78, 242, 81.0, 235.6, 242.0, 242.0, 0.0981711296032154, 0.02646018727586665, 0.05780975698314344], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 30.434782608695652, 0.5223880597014925], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 4.3478260869565215, 0.07462686567164178], "isController": false}, {"data": ["401/Unauthorized", 15, 65.21739130434783, 1.1194029850746268], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1340, 23, "401/Unauthorized", 15, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 1, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 1, "Test failed: code expected to contain /200/", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
