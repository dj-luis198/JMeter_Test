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

    var data = {"OkPercent": 98.74509803921569, "KoPercent": 1.2549019607843137};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7562626946513202, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4c2af9b3-5780-4883-ae81-f36c5b0d2921"], "isController": false}, {"data": [0.10344827586206896, 500, 1500, "see books"], "isController": true}, {"data": [0.5833333333333334, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/129187f6-4d0b-4994-a4f1-a00e2ba1fe9e"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/51cdca30-1ff3-46ef-bb5d-d7cb19e5694c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e872c443-9d46-4884-88cc-94ffa128780f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7041fae9-d5db-4a78-b949-f4bf1cbf30e8"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=12524dd2-d85c-4ccc-9b13-458fc77edec3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8c924fe5-c5d4-43c3-bb66-606f45fa48ba"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/07123ea7-59b0-49e3-b4fa-f36203c3ce94"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7041fae9-d5db-4a78-b949-f4bf1cbf30e8"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.02631578947368421, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ebc142ab-f891-4993-9d76-d515cd10292c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8c924fe5-c5d4-43c3-bb66-606f45fa48ba"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/12524dd2-d85c-4ccc-9b13-458fc77edec3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/667e8287-19a4-4ede-8216-7be9f6a48ec6"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4e7aa214-f909-4170-b840-6951e4ac6ce3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ec20f16b-90fc-43a2-ba69-2f2074066965"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "register"], "isController": true}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e872c443-9d46-4884-88cc-94ffa128780f"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4051724137931034, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/4c2af9b3-5780-4883-ae81-f36c5b0d2921"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/e50c6d35-355d-4507-b368-ed467245df27"], "isController": false}, {"data": [0.625, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.13157894736842105, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.23636363636363636, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.49137931034482757, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=51cdca30-1ff3-46ef-bb5d-d7cb19e5694c"], "isController": false}, {"data": [0.8720238095238095, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ba658af9-1338-43af-a46b-8a1b1dac2065"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ebc142ab-f891-4993-9d76-d515cd10292c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/70ece684-b5fc-46b6-b2bb-fe8406ebc499"], "isController": false}, {"data": [0.85, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=129187f6-4d0b-4994-a4f1-a00e2ba1fe9e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e50c6d35-355d-4507-b368-ed467245df27"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4e7aa214-f909-4170-b840-6951e4ac6ce3"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/e42ef711-c043-4fe9-a845-2a88b4e746f1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ec20f16b-90fc-43a2-ba69-2f2074066965"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1275, 16, 1.2549019607843137, 463.79372549019575, 101, 8202, 128.0, 1111.8000000000002, 1408.6000000000004, 3712.6000000000013, 4.980663307160436, 722.9639478714988, 3.640618438464393], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4c2af9b3-5780-4883-ae81-f36c5b0d2921", 1, 0, 0.0, 212.0, 212, 212, 212.0, 212.0, 212.0, 212.0, 4.716981132075471, 0.8521889740566038, 3.252137382075472], "isController": false}, {"data": ["see books", 58, 0, 0.0, 1937.5172413793098, 1256, 4102, 1754.0, 3193.9000000000005, 3561.3999999999996, 4102.0, 0.2529238873529335, 304.3532122287609, 1.243624778146504], "isController": true}, {"data": ["deleteBook", 12, 1, 8.333333333333334, 645.4999999999999, 111, 2483, 510.0, 1924.700000000002, 2483.0, 2483.0, 0.07752388704769658, 0.014743922854041903, 0.05238288038387245], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, 8.333333333333334, 645.4999999999999, 111, 2483, 510.0, 1924.700000000002, 2483.0, 2483.0, 0.07667878617481486, 0.014583196882368352, 0.05181184583410544], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 139.25, 101, 321, 111.0, 309.1, 320.45, 321.0, 0.10580667005248011, 0.0362573833216946, 0.05989856116154562], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 136.55, 102, 331, 109.0, 296.0000000000001, 329.5, 331.0, 0.10580722980801278, 0.07863213074599387, 0.053110269649725164], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 235.4, 107, 805, 115.5, 435.30000000000024, 787.0499999999997, 805.0, 0.10569316218087271, 1.5809281808357158, 0.06178508484518594], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 196.14999999999998, 101, 1197, 110.5, 343.8, 1154.3499999999995, 1197.0, 0.10567305812546562, 4.781298254611308, 0.06167013626540845], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/129187f6-4d0b-4994-a4f1-a00e2ba1fe9e", 3, 0, 0.0, 1109.6666666666667, 260, 1911, 1158.0, 1911.0, 1911.0, 1911.0, 0.02416996318108942, 0.02424077362009652, 0.015499618315998099], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 247.15384615384613, 109, 404, 233.0, 382.4, 404.0, 404.0, 0.07995670037149112, 0.14686758094078284, 0.05168475110401752], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/51cdca30-1ff3-46ef-bb5d-d7cb19e5694c", 3, 0, 0.0, 348.3333333333333, 204, 437, 404.0, 437.0, 437.0, 437.0, 0.02979116394077517, 0.029878442741382908, 0.019104359688583036], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 109.75, 105, 115, 110.0, 114.3, 115.0, 115.0, 0.11446231328335145, 0.08506427774280319, 0.057454715847307276], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 157.8125, 103, 449, 108.5, 371.30000000000007, 449.0, 449.0, 0.11445821917318244, 0.052115375673336246, 0.06407536537209653], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 925.6666666666666, 895, 982, 900.0, 982.0, 982.0, 982.0, 0.11947907124935282, 35.1308140258473, 0.06814040782189652], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 989.0, 898, 1103, 966.0, 1103.0, 1103.0, 1103.0, 0.11946479770627588, 107.49463497282177, 0.06801560260035043], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 112.0, 109, 114, 113.0, 114.0, 114.0, 114.0, 0.12331976815883587, 0.218218183499815, 0.06828350443951164], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 110.91666666666666, 103, 118, 112.0, 117.4, 118.0, 118.0, 0.08048127804269532, 0.059810793545401496, 0.0403978290175248], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 127.08333333333336, 104, 327, 109.0, 262.80000000000024, 327.0, 327.0, 0.0804785792848137, 0.02153430734769429, 0.04589793974837031], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 128.16666666666666, 104, 323, 111.5, 261.2000000000002, 323.0, 323.0, 0.08047696011695984, 0.021691055656524336, 0.047311650381259604], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 109.08333333333333, 103, 117, 109.0, 115.80000000000001, 117.0, 117.0, 0.08048073827663912, 0.021692073988625386, 0.047392465996888074], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e872c443-9d46-4884-88cc-94ffa128780f", 3, 0, 0.0, 379.3333333333333, 239, 549, 350.0, 549.0, 549.0, 549.0, 0.02958988420491981, 0.0246678689611978, 0.018975283816306], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 110.0, 108, 111, 111.0, 111.0, 111.0, 111.0, 0.12332990750256939, 0.09165435508735868, 0.06925263360739979], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7041fae9-d5db-4a78-b949-f4bf1cbf30e8", 3, 0, 0.0, 358.6666666666667, 252, 486, 338.0, 486.0, 486.0, 486.0, 0.04149721968628102, 0.02667871382825684, 0.02661117278059037], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 260.4375, 102, 1149, 110.5, 862.0000000000002, 1149.0, 1149.0, 0.11446395100942897, 12.901353200877079, 0.06606269047516847], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 666.2499999999999, 105, 1407, 643.5, 1386.9000000000003, 1406.6, 1407.0, 0.11718040509266041, 52.735359132308396, 0.06385416605635207], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=12524dd2-d85c-4ccc-9b13-458fc77edec3", 1, 0, 0.0, 841.0, 841, 841, 841.0, 841.0, 841.0, 841.0, 1.1890606420927465, 0.21482052615933414, 0.8198015755053508], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 231.99999999999997, 105, 897, 110.5, 703.1000000000001, 897.0, 897.0, 0.1142800002857, 4.227216094552415, 0.06606812516517031], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 478.40000000000003, 103, 951, 490.5, 937.1000000000001, 950.65, 951.0, 0.11717903198401677, 17.24305476215586, 0.06396785046783729], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8c924fe5-c5d4-43c3-bb66-606f45fa48ba", 3, 0, 0.0, 418.3333333333333, 295, 504, 456.0, 504.0, 504.0, 504.0, 0.049606455453403, 0.03189217106786163, 0.03181143139427211], "isController": false}, {"data": ["deleteBooks", 12, 1, 8.333333333333334, 652.75, 142, 1318, 677.5, 1209.7000000000003, 1318.0, 1318.0, 0.07683294596723075, 0.014612515846795106, 0.05251626897613697], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/07123ea7-59b0-49e3-b4fa-f36203c3ce94", 1, 0, 0.0, 411.0, 411, 411, 411.0, 411.0, 411.0, 411.0, 2.4330900243309004, 0.7769730839416059, 1.451775395377129], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 241.33333333333331, 215, 437, 224.5, 376.4000000000002, 437.0, 437.0, 0.08042086921556145, 0.12463664008310156, 0.1808684197299199], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7041fae9-d5db-4a78-b949-f4bf1cbf30e8", 1, 0, 0.0, 746.0, 746, 746, 746.0, 746.0, 746.0, 746.0, 1.3404825737265416, 0.24217702747989275, 0.924199899463807], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 19, 0, 0.0, 1303.5263157894738, 191, 3996, 1077.0, 3679.0, 3996.0, 3996.0, 0.10987168144151646, 0.06748953869796274, 0.049678309089279414], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 109.45, 101, 118, 110.0, 117.0, 117.95, 118.0, 0.11718040509266041, 0.0870842658940572, 0.05881907052502681], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 148.50000000000003, 101, 453, 109.5, 346.80000000000007, 447.79999999999995, 453.0, 0.11718452461167977, 0.11935884684568557, 0.06191096466300661], "isController": false}, {"data": ["login", 19, 0, 0.0, 5638.684210526317, 1458, 13965, 4262.0, 11906.0, 13965.0, 13965.0, 0.10178716838811984, 19.369868997570503, 0.18022544016253805], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ebc142ab-f891-4993-9d76-d515cd10292c", 1, 0, 0.0, 276.0, 276, 276, 276.0, 276.0, 276.0, 276.0, 3.6231884057971016, 0.6545799365942029, 2.4980185688405796], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8c924fe5-c5d4-43c3-bb66-606f45fa48ba", 1, 0, 0.0, 957.0, 957, 957, 957.0, 957.0, 957.0, 957.0, 1.0449320794148382, 0.18878167450365727, 0.7204316875653083], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/12524dd2-d85c-4ccc-9b13-458fc77edec3", 3, 0, 0.0, 420.6666666666667, 233, 605, 424.0, 605.0, 605.0, 605.0, 0.03156133946324682, 0.026311390092895542, 0.020239530840688878], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 116.56250000000001, 107, 145, 114.0, 131.0, 145.0, 145.0, 0.11939496600974561, 0.09665861994343665, 0.042441179323776765], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/667e8287-19a4-4ede-8216-7be9f6a48ec6", 2, 0, 0.0, 338.0, 267, 409, 338.0, 409.0, 409.0, 409.0, 0.01504664459825459, 0.02127689587721938, 0.009352723912879928], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 779.5, 216, 1520, 767.5, 1494.2000000000003, 1519.3, 1520.0, 0.11710356053375803, 70.1390289150648, 0.24838763035090083], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4e7aa214-f909-4170-b840-6951e4ac6ce3", 1, 0, 0.0, 541.0, 541, 541, 541.0, 541.0, 541.0, 541.0, 1.8484288354898337, 0.3339446626617375, 1.2744050369685767], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ec20f16b-90fc-43a2-ba69-2f2074066965", 1, 0, 0.0, 422.0, 422, 422, 422.0, 422.0, 422.0, 422.0, 2.3696682464454977, 0.4281138921800948, 1.6337751777251186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 406.2, 216, 1311, 387.0, 645.8, 1277.7499999999995, 1311.0, 0.10561558041042214, 6.473146949888047, 0.2361807788885016], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 2, 40.0, 702.6, 106, 1214, 1009.0, 1214.0, 1214.0, 1214.0, 0.05641494319015221, 40.501169199697614, 0.09127761511469157], "isController": false}, {"data": ["register", 21, 4, 19.047619047619047, 1504.5238095238096, 331, 4200, 1185.0, 3178.4000000000005, 4113.899999999999, 4200.0, 0.08693708239151494, 0.027604464219180804, 0.039223566469609276], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 443.875, 212, 1254, 432.0, 1077.6000000000001, 1254.0, 1254.0, 0.1141886539298739, 17.231014909648227, 0.25316092928153927], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 11, 0, 0.0, 113.36363636363636, 104, 117, 114.0, 117.0, 117.0, 117.0, 0.17593244194229415, 0.13658817514074595, 0.06253848522167488], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 450.1875, 213, 1291, 441.5, 1106.9, 1291.0, 1291.0, 0.08975301093303864, 13.54368771631878, 0.19898610651438572], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 174.0, 104, 337, 112.5, 335.6, 337.0, 337.0, 0.05291985288280899, 0.03932813285529066, 0.026563285529066227], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 171.9, 102, 339, 111.5, 336.8, 339.0, 339.0, 0.05285412262156448, 0.01414260702959831, 0.030143366807610997], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 184.1, 103, 424, 111.5, 414.6, 424.0, 424.0, 0.05291985288280899, 0.014263554097319608, 0.031111085386182624], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 173.3, 104, 332, 112.0, 330.8, 332.0, 332.0, 0.05291817262966275, 0.014263101216588789, 0.031161775484068982], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e872c443-9d46-4884-88cc-94ffa128780f", 1, 0, 0.0, 1318.0, 1318, 1318, 1318.0, 1318.0, 1318.0, 1318.0, 0.7587253414264037, 0.13707440250379363, 0.5231055576631259], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 142.0, 142, 142, 142.0, 142.0, 142.0, 142.0, 7.042253521126761, 2.0769146126760565, 4.353268045774648], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 1183.4655172413795, 823, 2020, 1062.0, 1674.4, 1811.3999999999999, 2020.0, 0.26021220754166763, 311.3042646201126, 0.5138174645012226], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 4, 19.047619047619047, 1504.5238095238096, 331, 4200, 1185.0, 3178.4000000000005, 4113.899999999999, 4200.0, 0.08567022674053344, 0.027202209271966253, 0.03865199683020161], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 214.75, 111, 330, 213.5, 330.0, 330.0, 330.0, 0.036601881336700705, 0.009865350829032612, 0.021553646919951683], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 134.5, 102, 313, 110.5, 313.0, 313.0, 313.0, 0.03660204879968156, 0.00986539596553917, 0.02151800134512529], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4c2af9b3-5780-4883-ae81-f36c5b0d2921", 3, 0, 0.0, 1018.6666666666666, 206, 2130, 720.0, 2130.0, 2130.0, 2130.0, 0.08985533291400843, 0.040657198160960854, 0.057622072213735887], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 11, 0, 0.0, 279.2727272727273, 102, 1099, 116.0, 948.0000000000006, 1099.0, 1099.0, 0.1507861441241381, 12.371277574159368, 0.08746774375950982], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 11, 0, 0.0, 259.9090909090909, 106, 892, 113.0, 781.2000000000004, 892.0, 892.0, 0.15079854685036673, 4.06783899684694, 0.08762220251559395], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 159.125, 103, 316, 109.0, 316.0, 316.0, 316.0, 0.0366022162641948, 0.009793952398817748, 0.020874701463173596], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 11, 0, 0.0, 111.36363636363637, 106, 116, 111.0, 115.8, 116.0, 116.0, 0.1507944123815921, 0.1120649881078043, 0.07569172652747885], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 134.875, 108, 307, 110.0, 307.0, 307.0, 307.0, 0.03660204879968156, 0.0272013272817946, 0.018372512776402658], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 11, 0, 0.0, 186.72727272727275, 102, 332, 113.0, 330.6, 332.0, 332.0, 0.15079647958764017, 0.06093977051517561, 0.0848497947111562], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 113.875, 109, 118, 114.5, 118.0, 118.0, 118.0, 0.03873941929610475, 0.03049216011001995, 0.013770652952912235], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e50c6d35-355d-4507-b368-ed467245df27", 3, 0, 0.0, 1789.0, 207, 4543, 617.0, 4543.0, 4543.0, 4543.0, 0.01707446172759404, 0.02353852389855493, 0.0109494432302605], "isController": false}, {"data": ["deleteAccount", 12, 1, 8.333333333333334, 605.0, 106, 1911, 495.0, 1553.7000000000012, 1911.0, 1911.0, 0.07835353113246969, 0.014723169220774135, 0.053326056385159845], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 19, 0, 0.0, 3347.9999999999995, 837, 8202, 2294.0, 7845.0, 8202.0, 8202.0, 0.1045650917696266, 0.05412060413857626, 0.048095857640130975], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 351.375, 224, 621, 324.0, 621.0, 621.0, 621.0, 0.03658346975918931, 0.05669723291780609, 0.08227708091348925], "isController": false}, {"data": ["addBook", 55, 8, 14.545454545454545, 1720.0909090909095, 544, 9390, 1015.0, 2881.7999999999997, 7128.799999999992, 9390.0, 0.28929858243694606, 101.81073071726323, 1.049056656497383], "isController": true}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 180.22413793103448, 105, 466, 112.5, 445.3, 455.2, 466.0, 0.26164311878597596, 0.19444376308215594, 0.12647787480376768], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 697.2413793103448, 517, 1028, 643.0, 935.0, 994.55, 1028.0, 0.26161125469659857, 76.92239519199109, 0.13157206657104323], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 166.0517241379311, 101, 447, 113.0, 327.5, 345.6999999999998, 447.0, 0.26210779861082867, 0.46380794051056795, 0.12747039424628193], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 1000.3965517241378, 710, 1589, 952.5, 1246.7, 1378.35, 1589.0, 0.26079840283460887, 234.66686130527353, 0.13090857329784075], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 215.4375, 106, 1415, 113.0, 719.9000000000008, 1415.0, 1415.0, 0.08748954226565106, 0.0653608396808819, 0.031099798227243153], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=51cdca30-1ff3-46ef-bb5d-d7cb19e5694c", 1, 0, 0.0, 893.0, 893, 893, 893.0, 893.0, 893.0, 893.0, 1.1198208286674132, 0.20231138017917133, 0.7720639697648376], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 8, 4.761904761904762, 370.0297619047618, 102, 5911, 117.0, 841.3999999999999, 1616.2499999999957, 5593.600000000001, 0.7213458252110366, 1.6323241893983633, 0.3430074203621328], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 249.9, 108, 1478, 115.5, 1342.0000000000005, 1478.0, 1478.0, 0.05275847696828688, 0.040856906480323724, 0.018753989859820727], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ba658af9-1338-43af-a46b-8a1b1dac2065", 1, 0, 0.0, 203.0, 203, 203, 203.0, 203.0, 203.0, 203.0, 4.926108374384237, 1.573083435960591, 2.939308805418719], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 221.7, 108, 1615, 114.5, 336.8, 1551.099999999999, 1615.0, 0.1036425162330091, 0.0841083310445611, 0.03684167569220245], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ebc142ab-f891-4993-9d76-d515cd10292c", 3, 0, 0.0, 988.6666666666667, 214, 2322, 430.0, 2322.0, 2322.0, 2322.0, 0.11394712853236098, 0.051558108287754485, 0.07307156354451534], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/70ece684-b5fc-46b6-b2bb-fe8406ebc499", 1, 0, 0.0, 504.0, 504, 504, 504.0, 504.0, 504.0, 504.0, 1.984126984126984, 0.6336030505952381, 1.1838882688492063], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 426.2, 218, 748, 431.5, 740.0, 748.0, 748.0, 0.05282480652914609, 0.0818681327751512, 0.11880422796545258], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 11, 0, 0.0, 453.6363636363636, 221, 1205, 439.0, 1056.0000000000005, 1205.0, 1205.0, 0.15055500047903864, 16.586311855864118, 0.33509982395330057], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=129187f6-4d0b-4994-a4f1-a00e2ba1fe9e", 1, 0, 0.0, 876.0, 876, 876, 876.0, 876.0, 876.0, 876.0, 1.141552511415525, 0.2062375142694064, 0.787046946347032], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e50c6d35-355d-4507-b368-ed467245df27", 1, 0, 0.0, 609.0, 609, 609, 609.0, 609.0, 609.0, 609.0, 1.6420361247947455, 0.29665691707717573, 1.1321069376026274], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 134.49999999999997, 108, 332, 115.5, 274.7000000000002, 332.0, 332.0, 0.07915097388677453, 0.06562419612292146, 0.028135697748814383], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4e7aa214-f909-4170-b840-6951e4ac6ce3", 3, 0, 0.0, 653.6666666666666, 208, 1337, 416.0, 1337.0, 1337.0, 1337.0, 0.024171131611811628, 0.024241945473955608, 0.015500367602626597], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 358.99999999999994, 108, 2309, 115.0, 1378.6000000000013, 2265.7499999999995, 2309.0, 0.11179304870823133, 0.08679245480766007, 0.0397389352830041], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e42ef711-c043-4fe9-a845-2a88b4e746f1", 1, 0, 0.0, 567.0, 567, 567, 567.0, 567.0, 567.0, 567.0, 1.763668430335097, 0.5632027116402117, 1.0523451278659612], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ec20f16b-90fc-43a2-ba69-2f2074066965", 3, 0, 0.0, 300.0, 208, 479, 213.0, 479.0, 479.0, 479.0, 0.049269173920183935, 0.030648890417145674, 0.03159514082772212], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 112.375, 102, 137, 110.5, 122.30000000000001, 137.0, 137.0, 0.08992249804699574, 0.06682716895875367, 0.04513687890249591], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 162.3125, 102, 338, 109.0, 335.2, 338.0, 338.0, 0.08982405712810033, 0.040898893199196075, 0.050284805418636246], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 294.5, 102, 1175, 111.0, 995.8000000000002, 1175.0, 1175.0, 0.0898089314982375, 10.122459828043961, 0.051833084487752305], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 253.68750000000003, 102, 831, 111.0, 712.0000000000001, 831.0, 831.0, 0.08992603583552528, 3.326363187372136, 0.05198848946741305], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 25.0, 0.3137254901960784], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 6.25, 0.0784313725490196], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 6.25, 0.0784313725490196], "isController": false}, {"data": ["401/Unauthorized", 10, 62.5, 0.7843137254901961], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1275, 16, "401/Unauthorized", 10, "406/Not Acceptable", 4, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
