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

    var data = {"OkPercent": 97.94466403162055, "KoPercent": 2.0553359683794468};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.724764468371467, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cf1f0ad5-9193-480a-a6dc-146a4b7209ec"], "isController": false}, {"data": [0.59375, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.59375, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c56ddad4-6c27-4b07-87ab-5d276fc7b8ee"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=19a35d41-d684-48c6-b57f-0ca926a5d91a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e44a312c-86a2-4636-be70-88b66b9d0f22"], "isController": false}, {"data": [0.8125, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9d08a037-e689-4f8d-b05b-5912b9cadd8b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=94f7e154-5602-4c57-a5cd-b82b3585d8d2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.4666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.71875, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a8e84adb-6c99-436e-b58e-3fda0779f45f"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1f915a90-c65e-47a3-963c-a3e3f05c10f6"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.04, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/16b089ba-0039-446f-ba25-0b49f30473f9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/437be09b-c8b4-4077-b682-9b30d4912112"], "isController": false}, {"data": [0.36666666666666664, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/19a35d41-d684-48c6-b57f-0ca926a5d91a"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.03333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ea09e615-bbf0-482d-aa85-0ff5be5ff799"], "isController": false}, {"data": [0.21153846153846154, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/94f7e154-5602-4c57-a5cd-b82b3585d8d2"], "isController": false}, {"data": [0.8421052631578947, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e44a312c-86a2-4636-be70-88b66b9d0f22"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3f6b9fb6-5642-4bc0-96aa-364207068ddd"], "isController": false}, {"data": [0.6944444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.21153846153846154, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=491503bb-b139-4fc3-b7ba-8d97acdbf015"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0e4018c2-615b-4445-9d7c-50b087c2c4a0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.38, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cf1f0ad5-9193-480a-a6dc-146a4b7209ec"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a8e84adb-6c99-436e-b58e-3fda0779f45f"], "isController": false}, {"data": [0.2692307692307692, 500, 1500, "addBook"], "isController": true}, {"data": [0.9074074074074074, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9907407407407407, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.3611111111111111, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9493670886075949, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1f915a90-c65e-47a3-963c-a3e3f05c10f6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9d08a037-e689-4f8d-b05b-5912b9cadd8b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/053c558f-a0aa-43e5-8e93-aca8cb7db055"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/0e4018c2-615b-4445-9d7c-50b087c2c4a0"], "isController": false}, {"data": [0.78125, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=16b089ba-0039-446f-ba25-0b49f30473f9"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c56ddad4-6c27-4b07-87ab-5d276fc7b8ee"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/491503bb-b139-4fc3-b7ba-8d97acdbf015"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3f6b9fb6-5642-4bc0-96aa-364207068ddd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ea09e615-bbf0-482d-aa85-0ff5be5ff799"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/44cdc189-0254-494e-b6a1-143bb8d70aa2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1265, 26, 2.0553359683794468, 474.6252964426872, 125, 2506, 161.0, 1317.2000000000003, 1585.1000000000001, 2127.0, 5.061356443526865, 759.5193480602802, 3.6898638835207835], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 2263.9074074074074, 1618, 3054, 2220.5, 2797.5, 2876.25, 3054.0, 0.23345193267937972, 280.92189398147946, 1.147881329141286], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/cf1f0ad5-9193-480a-a6dc-146a4b7209ec", 3, 0, 0.0, 440.33333333333337, 217, 879, 225.0, 879.0, 879.0, 879.0, 0.05359727011237561, 0.03445788036196023, 0.03437064522180337], "isController": false}, {"data": ["deleteBook", 16, 3, 18.75, 523.6874999999999, 136, 1214, 483.0, 1051.6000000000001, 1214.0, 1214.0, 0.11133842706637162, 0.022500093506882108, 0.07467639007765856], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, 18.75, 523.6874999999999, 136, 1214, 483.0, 1051.6000000000001, 1214.0, 1214.0, 0.11233036359934567, 0.022700551384120696, 0.07534169711872617], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c56ddad4-6c27-4b07-87ab-5d276fc7b8ee", 1, 0, 0.0, 444.0, 444, 444, 444.0, 444.0, 444.0, 444.0, 2.2522522522522523, 0.4069010416666667, 1.5528223536036037], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 206.71428571428572, 132, 398, 134.0, 396.5, 398.0, 398.0, 0.09053577779933392, 0.053364071038251366, 0.05000434490897921], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 154.0, 127, 401, 134.0, 276.5, 401.0, 401.0, 0.09068767165880708, 0.06739581848862518, 0.04552096018811214], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 347.7857142857142, 126, 1057, 134.0, 1056.5, 1057.0, 1057.0, 0.09015042241912219, 5.699209594097724, 0.05142648957474758], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 431.2857142857143, 128, 1429, 134.5, 1305.5, 1429.0, 1429.0, 0.09007791739854974, 17.38741944259463, 0.0512971622238951], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=19a35d41-d684-48c6-b57f-0ca926a5d91a", 1, 0, 0.0, 414.0, 414, 414, 414.0, 414.0, 414.0, 414.0, 2.4154589371980677, 0.4363866243961353, 1.6653457125603865], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e44a312c-86a2-4636-be70-88b66b9d0f22", 1, 0, 0.0, 450.0, 450, 450, 450.0, 450.0, 450.0, 450.0, 2.2222222222222223, 0.4014756944444444, 1.5321180555555556], "isController": false}, {"data": ["goToProfile", 16, 3, 18.75, 244.81250000000003, 133, 442, 227.0, 414.0, 442.0, 442.0, 0.11263877449013356, 0.1940310139425683, 0.07279858295141749], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 161.8421052631579, 127, 407, 134.0, 402.0, 407.0, 407.0, 0.09526483624476044, 0.07079740271705341, 0.047818482255670765], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 202.73684210526315, 127, 409, 134.0, 397.0, 409.0, 409.0, 0.09526388095023214, 0.025490530644886336, 0.05433018210442927], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 9, 0, 0.0, 908.2222222222222, 780, 1143, 834.0, 1143.0, 1143.0, 1143.0, 0.060551014229488345, 17.804008666363913, 0.03453300030275507], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 9, 0, 0.0, 1377.6666666666667, 990, 1533, 1440.0, 1533.0, 1533.0, 1533.0, 0.0604550248201463, 54.397537601765954, 0.03441921823256376], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9d08a037-e689-4f8d-b05b-5912b9cadd8b", 3, 0, 0.0, 327.6666666666667, 214, 439, 330.0, 439.0, 439.0, 439.0, 0.05055441340028985, 0.03250161668801187, 0.03241933411411816], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 9, 0, 0.0, 354.6666666666667, 128, 439, 398.0, 439.0, 439.0, 439.0, 0.06084082013425541, 0.10765973250319415, 0.03368822755480744], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 134.39999999999998, 127, 148, 133.0, 146.8, 148.0, 148.0, 0.08749212570868621, 0.06502100357842795, 0.04391694591236789], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 134.86666666666667, 127, 147, 134.0, 145.2, 147.0, 147.0, 0.08749110507098444, 0.032171208427143244, 0.04940741180896609], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 238.86666666666667, 126, 1432, 135.0, 810.4000000000003, 1432.0, 1432.0, 0.08749365670988854, 5.270473196682824, 0.05093543478514474], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 196.9333333333333, 129, 789, 134.0, 567.6000000000001, 789.0, 789.0, 0.08734743315009783, 1.734176375576493, 0.050935609292019936], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=94f7e154-5602-4c57-a5cd-b82b3585d8d2", 1, 0, 0.0, 481.0, 481, 481, 481.0, 481.0, 481.0, 481.0, 2.079002079002079, 0.37560096153846156, 1.4333744802494803], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 9, 0, 0.0, 169.0, 131, 414, 139.0, 414.0, 414.0, 414.0, 0.06096569663469355, 0.045307514784181435, 0.034233667543895306], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 1057.6666666666667, 132, 1707, 1371.0, 1638.6000000000001, 1707.0, 1707.0, 0.06729112833763998, 40.371829396241566, 0.03570460260102641], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 146.3684210526316, 127, 396, 133.0, 142.0, 396.0, 396.0, 0.09526483624476044, 0.025676850394095587, 0.05600530412045487], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 707.1333333333333, 128, 1192, 790.0, 1185.4, 1192.0, 1192.0, 0.0673766670110363, 13.213371517187788, 0.03581578685840569], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 160.94736842105263, 125, 401, 133.0, 395.0, 401.0, 401.0, 0.09526197041865128, 0.02567607796440211, 0.05609664859613939], "isController": false}, {"data": ["deleteBooks", 16, 3, 18.75, 428.12499999999994, 138, 769, 447.0, 713.7, 769.0, 769.0, 0.11231774690599707, 0.02269800170933571, 0.07593650405747861], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a8e84adb-6c99-436e-b58e-3fda0779f45f", 1, 0, 0.0, 511.0, 511, 511, 511.0, 511.0, 511.0, 511.0, 1.9569471624266144, 0.35355002446183953, 1.349223336594912], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 394.66666666666663, 263, 1567, 272.0, 967.0000000000003, 1567.0, 1567.0, 0.08727780525412387, 7.087219165478718, 0.1948011066098391], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1f915a90-c65e-47a3-963c-a3e3f05c10f6", 1, 0, 0.0, 460.0, 460, 460, 460.0, 460.0, 460.0, 460.0, 2.1739130434782608, 0.39274796195652173, 1.4988111413043477], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 25, 0, 0.0, 547.28, 145, 1640, 534.0, 882.0000000000005, 1455.7999999999995, 1640.0, 0.1088361928229061, 0.0668534817242265, 0.04921011452832571], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 134.9333333333333, 128, 145, 134.0, 144.4, 145.0, 145.0, 0.0673781802501078, 0.050073042158527384, 0.0338206881333549], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 250.2666666666666, 128, 534, 142.0, 455.40000000000003, 534.0, 534.0, 0.0673760617344395, 0.08549215125027512, 0.03465305258477031], "isController": false}, {"data": ["login", 25, 0, 0.0, 2615.9600000000005, 1045, 4640, 2421.0, 3796.600000000001, 4443.5, 4640.0, 0.10671903013745411, 46.104901304906946, 0.22472276396952107], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 153.8947368421053, 130, 399, 140.0, 154.0, 399.0, 399.0, 0.09505988772926943, 0.07695766301519957, 0.03379081946626375], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/16b089ba-0039-446f-ba25-0b49f30473f9", 3, 0, 0.0, 934.3333333333334, 299, 2127, 377.0, 2127.0, 2127.0, 2127.0, 0.02947012711448162, 0.02395407142085306, 0.018898486463388278], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/437be09b-c8b4-4077-b682-9b30d4912112", 1, 0, 0.0, 214.0, 214, 214, 214.0, 214.0, 214.0, 214.0, 4.672897196261682, 1.4922240070093458, 2.788222838785047], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 1211.6666666666665, 272, 1850, 1500.0, 1777.4, 1850.0, 1850.0, 0.06724949562878278, 53.6705921808451, 0.13977474921542254], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/19a35d41-d684-48c6-b57f-0ca926a5d91a", 3, 0, 0.0, 507.0, 226, 1019, 276.0, 1019.0, 1019.0, 1019.0, 0.04653399308194636, 0.02991687380756643, 0.029841134886534615], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 605.6428571428571, 262, 1565, 404.5, 1440.5, 1565.0, 1565.0, 0.08999800718698371, 23.181499111671457, 0.19747330594822543], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 15, 6, 40.0, 990.0000000000001, 133, 1667, 1519.0, 1652.6, 1667.0, 1667.0, 0.10066843843118306, 72.2714448940968, 0.16287838749295322], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ea09e615-bbf0-482d-aa85-0ff5be5ff799", 3, 0, 0.0, 793.0, 223, 1715, 441.0, 1715.0, 1715.0, 1715.0, 0.04421778734192141, 0.02842777669280429, 0.0283558076378858], "isController": false}, {"data": ["register", 26, 9, 34.61538461538461, 1176.1923076923076, 238, 2407, 1187.0, 1990.7, 2312.4999999999995, 2407.0, 0.10668110964766513, 0.033289763332061365, 0.04813151626681766], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/94f7e154-5602-4c57-a5cd-b82b3585d8d2", 3, 0, 0.0, 372.3333333333333, 264, 451, 402.0, 451.0, 451.0, 451.0, 0.01797752808988764, 0.024783473782771535, 0.011528558052434457], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 381.1052631578947, 258, 817, 270.0, 800.0, 817.0, 817.0, 0.09519371921860988, 0.1475316722655604, 0.2140929056254478], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 160.43750000000003, 135, 404, 139.5, 266.10000000000014, 404.0, 404.0, 0.10444545988641557, 0.08108802793916052, 0.03712709706899928], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e44a312c-86a2-4636-be70-88b66b9d0f22", 3, 0, 0.0, 458.66666666666663, 241, 893, 242.0, 893.0, 893.0, 893.0, 0.045703142852790174, 0.028430568356667324, 0.02930833054036349], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3f6b9fb6-5642-4bc0-96aa-364207068ddd", 3, 0, 0.0, 416.66666666666663, 217, 760, 273.0, 760.0, 760.0, 760.0, 0.03654169407293722, 0.023492788344417648, 0.023433312930887476], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 582.3888888888888, 262, 1832, 406.5, 1716.8000000000002, 1832.0, 1832.0, 0.09414816829508127, 12.644581184488567, 0.2090649158158462], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 1, 0, 0.0, 134.0, 134, 134, 134.0, 134.0, 134.0, 134.0, 7.462686567164179, 5.54600046641791, 3.7459188432835817], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 1, 0, 0.0, 133.0, 133, 133, 133.0, 133.0, 133.0, 133.0, 7.518796992481203, 2.0118656015037595, 4.2880639097744355], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 1, 0, 0.0, 129.0, 129, 129, 129.0, 129.0, 129.0, 129.0, 7.751937984496124, 2.089389534883721, 4.557291666666667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 1, 0, 0.0, 133.0, 133, 133, 133.0, 133.0, 133.0, 133.0, 7.518796992481203, 2.0265507518796992, 4.427572838345864], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 140.66666666666666, 138, 145, 139.0, 145.0, 145.0, 145.0, 0.051717896115986, 0.01525273889358181, 0.03197014476701088], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1580.4444444444441, 1007, 2506, 1500.5, 2239.0, 2309.25, 2506.0, 0.23848640627484233, 285.3126531943929, 0.4709174936403625], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 9, 34.61538461538461, 1176.1923076923076, 238, 2407, 1187.0, 1990.7, 2312.4999999999995, 2407.0, 0.11003148593289773, 0.03433524583573146, 0.04964311181738159], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 168.0, 127, 398, 135.0, 398.0, 398.0, 398.0, 0.049769504980061094, 0.01341443688915709, 0.029307628420875816], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 172.12500000000003, 132, 420, 136.5, 420.0, 420.0, 420.0, 0.049769195356534075, 0.013414353435940825, 0.029258843363899917], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=491503bb-b139-4fc3-b7ba-8d97acdbf015", 1, 0, 0.0, 422.0, 422, 422, 422.0, 422.0, 422.0, 422.0, 2.3696682464454977, 0.4281138921800948, 1.6337751777251186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 218.99999999999997, 128, 435, 135.5, 432.2, 435.0, 435.0, 0.10182586504254411, 0.02744525268724822, 0.05986247144102692], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 181.50000000000003, 127, 396, 133.5, 395.3, 396.0, 396.0, 0.10202259800545821, 0.027498278368658657, 0.060077760348917285], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 168.5, 129, 398, 134.0, 387.5, 398.0, 398.0, 0.10202129694573743, 0.07581856149971306, 0.05120990881846585], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 199.125, 127, 398, 133.5, 398.0, 398.0, 398.0, 0.049772911093137556, 0.01331814222609345, 0.028386113357805016], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 199.5, 126, 426, 134.0, 405.70000000000005, 426.0, 426.0, 0.10183169766168965, 0.027247934725881797, 0.05807589007268237], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 178.75000000000003, 134, 457, 139.0, 457.0, 457.0, 457.0, 0.04977198210697243, 0.03698874842129494, 0.024983201956038897], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0e4018c2-615b-4445-9d7c-50b087c2c4a0", 1, 0, 0.0, 424.0, 424, 424, 424.0, 424.0, 424.0, 424.0, 2.3584905660377355, 0.4260944870283019, 1.626068691037736], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 141.875, 134, 149, 143.5, 149.0, 149.0, 149.0, 0.047441424665982716, 0.03734159011795125, 0.016863943924236045], "isController": false}, {"data": ["deleteAccount", 16, 3, 18.75, 798.3125, 133, 2475, 605.5, 2231.4, 2475.0, 2475.0, 0.1119554417341898, 0.022050794096449614, 0.07618354613613783], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 25, 0, 0.0, 1284.9199999999996, 676, 2127, 1208.0, 1812.8000000000002, 2057.3999999999996, 2127.0, 0.10912122495122281, 0.05647875900795712, 0.050191500929712835], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 386.25, 270, 856, 285.0, 856.0, 856.0, 856.0, 0.049727122415743605, 0.07706732741580577, 0.111837463792439], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cf1f0ad5-9193-480a-a6dc-146a4b7209ec", 1, 0, 0.0, 769.0, 769, 769, 769.0, 769.0, 769.0, 769.0, 1.3003901170351106, 0.2349337613784135, 0.8965580299089727], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a8e84adb-6c99-436e-b58e-3fda0779f45f", 3, 0, 0.0, 293.6666666666667, 220, 433, 228.0, 433.0, 433.0, 433.0, 0.01973372625374941, 0.027204534728069253, 0.012654765859337998], "isController": false}, {"data": ["addBook", 52, 5, 9.615384615384615, 1401.865384615385, 664, 3076, 1062.0, 2333.9, 2376.2999999999997, 3076.0, 0.2720917577127548, 101.25921232542959, 0.9854128403763238], "isController": true}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 256.111111111111, 128, 644, 143.0, 533.0, 538.75, 644.0, 0.2395623993505197, 0.1780341659235796, 0.11580408952979225], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 864.4259259259258, 634, 1334, 791.5, 1154.0, 1190.5, 1334.0, 0.2393924750965328, 70.38933625665533, 0.12039758269015077], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 217.9444444444444, 128, 550, 139.0, 402.0, 425.5, 550.0, 0.2399925335656224, 0.4246742879110428, 0.1167151188629687], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1316.8888888888891, 878, 2090, 1304.5, 1716.5, 1879.0, 2090.0, 0.23907028223574986, 215.11586019645821, 0.12000207526286663], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 140.88888888888889, 128, 150, 139.5, 150.0, 150.0, 150.0, 0.09214749742754903, 0.068840659699292, 0.03275555572619907], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 158, 5, 3.1645569620253164, 209.87341772151896, 128, 2272, 141.0, 317.9999999999999, 408.04999999999995, 1663.1199999999965, 0.7014210435191802, 1.618554896462707, 0.333976163892798], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1f915a90-c65e-47a3-963c-a3e3f05c10f6", 3, 0, 0.0, 595.3333333333333, 231, 1247, 308.0, 1247.0, 1247.0, 1247.0, 0.016301601360640326, 0.022473073490335865, 0.010453826393379375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 1, 0, 0.0, 135.0, 135, 135, 135.0, 135.0, 135.0, 135.0, 7.407407407407407, 5.736400462962963, 2.6331018518518516], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 155.71428571428572, 135, 402, 136.0, 271.5, 402.0, 402.0, 0.09037038949637873, 0.07333768913231516, 0.03212384939129088], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9d08a037-e689-4f8d-b05b-5912b9cadd8b", 1, 0, 0.0, 490.0, 490, 490, 490.0, 490.0, 490.0, 490.0, 2.0408163265306123, 0.3687021683673469, 1.407047193877551], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 1, 0, 0.0, 267.0, 267, 267, 267.0, 267.0, 267.0, 267.0, 3.745318352059925, 5.804511938202247, 8.423308754681647], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/053c558f-a0aa-43e5-8e93-aca8cb7db055", 1, 0, 0.0, 227.0, 227, 227, 227.0, 227.0, 227.0, 227.0, 4.405286343612335, 1.406766244493392, 2.6285448788546253], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0e4018c2-615b-4445-9d7c-50b087c2c4a0", 3, 0, 0.0, 1043.3333333333335, 213, 2475, 442.0, 2475.0, 2475.0, 2475.0, 0.02854234256519547, 0.023794576598133332, 0.018303520460102564], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 423.3125, 262, 795, 287.0, 785.2, 795.0, 795.0, 0.10173845586458612, 0.15767473579794744, 0.22881217173451351], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=16b089ba-0039-446f-ba25-0b49f30473f9", 1, 0, 0.0, 460.0, 460, 460, 460.0, 460.0, 460.0, 460.0, 2.1739130434782608, 0.39274796195652173, 1.4988111413043477], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c56ddad4-6c27-4b07-87ab-5d276fc7b8ee", 3, 0, 0.0, 444.33333333333337, 241, 768, 324.0, 768.0, 768.0, 768.0, 0.03814949515501412, 0.024178732769144687, 0.02446435724458913], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 175.20000000000002, 134, 406, 140.0, 402.4, 406.0, 406.0, 0.08473044421347553, 0.07025014368871164, 0.030119025091508878], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/491503bb-b139-4fc3-b7ba-8d97acdbf015", 3, 0, 0.0, 296.0, 212, 437, 239.0, 437.0, 437.0, 437.0, 0.030689909157868893, 0.02558491450302807, 0.019680703463867747], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 140.73333333333332, 131, 162, 138.0, 153.0, 162.0, 162.0, 0.06781377433384268, 0.052648389253325135, 0.024105677595233146], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3f6b9fb6-5642-4bc0-96aa-364207068ddd", 1, 0, 0.0, 690.0, 690, 690, 690.0, 690.0, 690.0, 690.0, 1.4492753623188406, 0.26183197463768115, 0.9992074275362319], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ea09e615-bbf0-482d-aa85-0ff5be5ff799", 1, 0, 0.0, 413.0, 413, 413, 413.0, 413.0, 413.0, 413.0, 2.4213075060532687, 0.4374432506053269, 1.6693780266343827], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 179.1111111111111, 128, 405, 136.5, 385.20000000000005, 405.0, 405.0, 0.09435396365275645, 0.07012047494115982, 0.047361266911637515], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 205.05555555555554, 126, 398, 136.5, 393.5, 398.0, 398.0, 0.09423294383716548, 0.04094061492231017, 0.05286288190518072], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 384.66666666666663, 128, 1569, 141.5, 1461.9, 1569.0, 1569.0, 0.09435247989767998, 9.455774977853377, 0.05456800323943514], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/44cdc189-0254-494e-b6a1-143bb8d70aa2", 1, 0, 0.0, 225.0, 225, 225, 225.0, 225.0, 225.0, 225.0, 4.444444444444445, 1.4192708333333333, 2.6519097222222223], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 262.2777777777778, 127, 1092, 135.5, 820.2000000000004, 1092.0, 1092.0, 0.09421568062977949, 3.1006323246148937, 0.054580893975954066], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 34.61538461538461, 0.7114624505928854], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 11.538461538461538, 0.23715415019762845], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 11.538461538461538, 0.23715415019762845], "isController": false}, {"data": ["401/Unauthorized", 11, 42.30769230769231, 0.8695652173913043], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1265, 26, "401/Unauthorized", 11, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 15, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 158, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
