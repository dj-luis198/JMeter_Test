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

    var data = {"OkPercent": 98.17490494296578, "KoPercent": 1.8250950570342206};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7672750977835724, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.16666666666666666, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c6fc3f9e-10b1-4325-a1b2-5ded337880bc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/337613e1-e471-4302-8aa4-917cf06e1180"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e73dfaa3-b47b-4a0c-a815-34eabf658bb6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=40a78246-37ed-495c-b03f-424636ef76c8"], "isController": false}, {"data": [0.5333333333333333, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5333333333333333, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/de5a6b25-6447-4d73-bfa4-f82832eb83bd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c13f6c69-357f-4d79-a09d-8e2c86295ab8"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d8646efe-80e4-4214-ac4e-df6b11669a3d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/29a28c50-9c82-4982-bab8-e67c6a49797b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a0e6e591-312a-4694-a2d9-68ecc1bfafc9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1faf2872-a9f4-4833-8ed9-b8216b0a719e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.84375, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7894736842105263, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a0e6e591-312a-4694-a2d9-68ecc1bfafc9"], "isController": false}, {"data": [0.6086956521739131, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=326d8305-60e1-4578-b7f3-d2265b9b99e8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c13f6c69-357f-4d79-a09d-8e2c86295ab8"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/761532d1-c2ae-41bd-b0c1-5dbf867fd3bf"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.1, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/849524e8-8d48-4290-b9c3-cbc9dbabfc6f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/40a78246-37ed-495c-b03f-424636ef76c8"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.84375, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d8646efe-80e4-4214-ac4e-df6b11669a3d"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c6fc3f9e-10b1-4325-a1b2-5ded337880bc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=da6e34a2-5140-462c-950f-c886e54a5348"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=de5a6b25-6447-4d73-bfa4-f82832eb83bd"], "isController": false}, {"data": [0.17391304347826086, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.30701754385964913, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1faf2872-a9f4-4833-8ed9-b8216b0a719e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.7017543859649122, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.3684210526315789, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.935672514619883, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e73dfaa3-b47b-4a0c-a815-34eabf658bb6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/45e8b28c-b81a-4622-b025-ad9318ea0656"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/326d8305-60e1-4578-b7f3-d2265b9b99e8"], "isController": false}, {"data": [0.85, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=761532d1-c2ae-41bd-b0c1-5dbf867fd3bf"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/da6e34a2-5140-462c-950f-c886e54a5348"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b1ab1bf7-be21-40c4-a506-8b9feeade5e4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6f9bf78c-9810-4652-9157-d4bd733562ee"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=849524e8-8d48-4290-b9c3-cbc9dbabfc6f"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1315, 24, 1.8250950570342206, 402.96730038022815, 77, 2871, 101.0, 1215.0000000000005, 1653.6000000000006, 2626.319999999998, 5.100338988309946, 736.4692350352078, 3.721967983009859], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1862.7368421052627, 1115, 3220, 1662.0, 2988.2000000000003, 3093.2999999999997, 3220.0, 0.2499287483831364, 300.74763670718875, 1.228897703231535], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/c6fc3f9e-10b1-4325-a1b2-5ded337880bc", 3, 0, 0.0, 374.3333333333333, 182, 630, 311.0, 630.0, 630.0, 630.0, 0.09803601189503611, 0.04435874236136074, 0.06286814564883501], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/337613e1-e471-4302-8aa4-917cf06e1180", 1, 0, 0.0, 260.0, 260, 260, 260.0, 260.0, 260.0, 260.0, 3.8461538461538463, 1.2282151442307692, 2.294921875], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e73dfaa3-b47b-4a0c-a815-34eabf658bb6", 3, 0, 0.0, 441.66666666666663, 191, 942, 192.0, 942.0, 942.0, 942.0, 0.021071411011919398, 0.024905694461028426, 0.01351259104605508], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=40a78246-37ed-495c-b03f-424636ef76c8", 1, 0, 0.0, 458.0, 458, 458, 458.0, 458.0, 458.0, 458.0, 2.1834061135371177, 0.39446301855895194, 1.5053561681222707], "isController": false}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 702.6666666666667, 81, 2813, 515.0, 1838.6000000000006, 2813.0, 2813.0, 0.07577441451635718, 0.014844089406231688, 0.0510194658156358], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 702.6666666666667, 81, 2813, 515.0, 1838.6000000000006, 2813.0, 2813.0, 0.07556560858022297, 0.014803184649602273, 0.05087887525629336], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 105.1, 78, 244, 81.5, 235.9, 243.6, 244.0, 0.09236254144769047, 0.024714195660807802, 0.05267551191938597], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 96.89999999999999, 79, 244, 81.0, 220.0000000000003, 243.54999999999998, 244.0, 0.09242912996459965, 0.06869000771783235, 0.04639509062676193], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 96.45000000000002, 78, 243, 81.0, 218.1000000000003, 242.5, 243.0, 0.09242955712377704, 0.02491265406851803, 0.05442873334534917], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 119.75, 78, 243, 82.0, 238.0, 242.75, 243.0, 0.09236168837166343, 0.02489436131892491, 0.05429857070287245], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/de5a6b25-6447-4d73-bfa4-f82832eb83bd", 3, 0, 0.0, 524.0, 219, 963, 390.0, 963.0, 963.0, 963.0, 0.042492917847025496, 0.02781681568696884, 0.027249690155807367], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c13f6c69-357f-4d79-a09d-8e2c86295ab8", 1, 0, 0.0, 408.0, 408, 408, 408.0, 408.0, 408.0, 408.0, 2.450980392156863, 0.44280407475490197, 1.6898360906862746], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 213.8666666666667, 81, 466, 204.0, 373.00000000000006, 466.0, 466.0, 0.07596629122437404, 0.1379460803925938, 0.049101128859087594], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 102.3125, 80, 246, 81.0, 241.8, 246.0, 246.0, 0.12286993449496617, 0.09131251967838795, 0.06167494758829357], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d8646efe-80e4-4214-ac4e-df6b11669a3d", 1, 0, 0.0, 589.0, 589, 589, 589.0, 589.0, 589.0, 589.0, 1.697792869269949, 0.30673015704584045, 1.1705485993208828], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 100.1875, 78, 244, 80.5, 238.4, 244.0, 244.0, 0.12286993449496617, 0.06747947208164708, 0.0681394180188759], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 1232.3333333333335, 540, 1557, 1318.5, 1557.0, 1557.0, 1557.0, 0.05307855626326964, 15.606857915339702, 0.030271364118895965], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1942.0000000000002, 792, 2590, 2285.5, 2590.0, 2590.0, 2590.0, 0.053115677092093735, 47.79357961486708, 0.03024066381317446], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 188.16666666666666, 79, 244, 241.0, 244.0, 244.0, 244.0, 0.0535480013208507, 0.09475486171228659, 0.029650114012619477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 7, 0, 0.0, 94.42857142857143, 78, 165, 83.0, 165.0, 165.0, 165.0, 0.036201903185767485, 0.026903953441766652, 0.018171658435043442], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/29a28c50-9c82-4982-bab8-e67c6a49797b", 2, 0, 0.0, 299.5, 226, 373, 299.5, 373.0, 373.0, 373.0, 0.017587674557669984, 0.024870071054205214, 0.010932182476520455], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 7, 0, 0.0, 83.71428571428571, 77, 101, 81.0, 101.0, 101.0, 101.0, 0.036203026573021505, 0.009687137969734269, 0.020647038592426326], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a0e6e591-312a-4694-a2d9-68ecc1bfafc9", 3, 0, 0.0, 679.6666666666667, 192, 1423, 424.0, 1423.0, 1423.0, 1423.0, 0.04832240710017235, 0.031066651700143357, 0.030988001949003755], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 7, 0, 0.0, 105.28571428571429, 79, 241, 81.0, 241.0, 241.0, 241.0, 0.03617271956840778, 0.00974967832117241, 0.02126560271502098], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 7, 0, 0.0, 119.14285714285715, 77, 332, 82.0, 332.0, 332.0, 332.0, 0.036202839336970855, 0.009757796540042926, 0.021318664179876393], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1faf2872-a9f4-4833-8ed9-b8216b0a719e", 1, 0, 0.0, 389.0, 389, 389, 389.0, 389.0, 389.0, 389.0, 2.5706940874035986, 0.46443203727506427, 1.7723730719794344], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 81.16666666666667, 79, 83, 81.5, 83.0, 83.0, 83.0, 0.05362361584041612, 0.039851144193902996, 0.03011091709788991], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 524.4736842105265, 78, 1116, 711.0, 1044.0, 1116.0, 1116.0, 0.0949615405760667, 44.98399827757259, 0.051531863970092115], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 489.4375, 78, 2670, 82.0, 2642.7, 2670.0, 2670.0, 0.12271820831415861, 20.73101073544639, 0.07016749117962878], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 348.3684210526316, 80, 663, 459.0, 640.0, 663.0, 663.0, 0.09495964215208537, 14.707538358697553, 0.05162356779618662], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 286.93749999999994, 79, 1427, 81.0, 1296.1000000000001, 1427.0, 1427.0, 0.12271914955629357, 6.792531892597735, 0.0702878722800451], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 418.64285714285717, 96, 1134, 408.5, 897.5, 1134.0, 1134.0, 0.08103117964033732, 0.01596205715013341, 0.05504196619263427], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 7, 0, 0.0, 238.85714285714286, 161, 413, 172.0, 413.0, 413.0, 413.0, 0.0361568380328614, 0.05603603706850688, 0.08131757616179669], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a0e6e591-312a-4694-a2d9-68ecc1bfafc9", 1, 0, 0.0, 1134.0, 1134, 1134, 1134.0, 1134.0, 1134.0, 1134.0, 0.8818342151675485, 0.15931575176366844, 0.6079833553791888], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 753.4347826086957, 108, 1606, 660.0, 1470.4000000000003, 1595.9999999999998, 1606.0, 0.10264099749198954, 0.06304803459224748, 0.04640896663944449], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 86.36842105263159, 79, 132, 82.0, 122.0, 132.0, 132.0, 0.09496201519392243, 0.07057235699470212, 0.04766648028288684], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=326d8305-60e1-4578-b7f3-d2265b9b99e8", 1, 0, 0.0, 283.0, 283, 283, 283.0, 283.0, 283.0, 283.0, 3.5335689045936394, 0.6383889134275619, 2.4362301236749118], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 131.26315789473688, 79, 244, 82.0, 241.0, 244.0, 244.0, 0.0949615405760667, 0.10047688498658044, 0.049960234854883774], "isController": false}, {"data": ["login", 23, 0, 0.0, 3394.521739130435, 1955, 5180, 3348.0, 4977.6, 5144.799999999999, 5180.0, 0.10398723217636234, 32.59568803378229, 0.20187704724863345], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 89.00000000000001, 83, 105, 85.5, 104.3, 105.0, 105.0, 0.11873752328368621, 0.09612637383024987, 0.04220747897974783], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c13f6c69-357f-4d79-a09d-8e2c86295ab8", 3, 0, 0.0, 982.3333333333333, 179, 2316, 452.0, 2316.0, 2316.0, 2316.0, 0.04375218760938047, 0.028128440927254698, 0.028057229684400886], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/761532d1-c2ae-41bd-b0c1-5dbf867fd3bf", 3, 0, 0.0, 448.3333333333333, 372, 507, 466.0, 507.0, 507.0, 507.0, 0.05655895328230459, 0.02559145347083443, 0.03626990168168621], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 612.6842105263157, 163, 1196, 844.0, 1128.0, 1196.0, 1196.0, 0.09492026697574038, 59.83686106014697, 0.20069567344680467], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 234.3, 160, 489, 165.5, 458.9000000000003, 488.25, 489.0, 0.0923271520305049, 0.14308905300040162, 0.20764592883423122], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, 40.0, 1316.5000000000002, 78, 2674, 1401.0, 2669.6, 2674.0, 2674.0, 0.08839857147908489, 63.462715692514415, 0.14302612619780064], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/849524e8-8d48-4290-b9c3-cbc9dbabfc6f", 3, 0, 0.0, 374.0, 208, 493, 421.0, 493.0, 493.0, 493.0, 0.0224936455451335, 0.02698212364382062, 0.01442463597783626], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/40a78246-37ed-495c-b03f-424636ef76c8", 3, 0, 0.0, 317.6666666666667, 200, 521, 232.0, 521.0, 521.0, 521.0, 0.018323072412782176, 0.025259834527386883, 0.011750147348040653], "isController": false}, {"data": ["register", 24, 6, 25.0, 1153.041666666667, 280, 2265, 1155.5, 1901.5, 2197.5, 2265.0, 0.09963880931622866, 0.0314290384854901, 0.04495422842197035], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 20, 0, 0.0, 103.55, 81, 245, 86.0, 229.2000000000003, 244.9, 245.0, 0.1036307016316654, 0.08045547636442772, 0.03683747597063106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 608.1875, 161, 2871, 165.0, 2789.1, 2871.0, 2871.0, 0.12264295569523224, 27.665111372738767, 0.2699432536792887], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d8646efe-80e4-4214-ac4e-df6b11669a3d", 3, 0, 0.0, 316.0, 247, 453, 248.0, 453.0, 453.0, 453.0, 0.022063852789974185, 0.026078727044399827, 0.014149020181070686], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 395.9375, 162, 2455, 317.5, 1070.4000000000015, 2455.0, 2455.0, 0.0995452028544587, 7.587800278493259, 0.22228764597370762], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 123.89999999999999, 79, 339, 82.0, 328.90000000000003, 339.0, 339.0, 0.055858120374249406, 0.041511747660941206, 0.028038158078480657], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 127.29999999999998, 79, 242, 80.0, 241.6, 242.0, 242.0, 0.05585999251476101, 0.023336821091615972, 0.031388515325188944], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 377.7, 78, 2599, 81.5, 2362.7000000000007, 2599.0, 2599.0, 0.05519708117834729, 4.980032671497331, 0.0319754966357379], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 241.9, 78, 1231, 81.0, 1132.0000000000005, 1231.0, 1231.0, 0.055617043286744786, 1.6488172166728774, 0.0322730928915857], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 99.0, 96, 102, 99.0, 102.0, 102.0, 102.0, 0.0962047236519313, 0.028372877483284428, 0.05947030280436769], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1433.9649122807014, 636, 2697, 1283.0, 2527.2000000000003, 2611.7, 2697.0, 0.25734796153325207, 307.87763062102124, 0.5081616974806988], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c6fc3f9e-10b1-4325-a1b2-5ded337880bc", 1, 0, 0.0, 202.0, 202, 202, 202.0, 202.0, 202.0, 202.0, 4.9504950495049505, 0.8943765470297029, 3.4131342821782176], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=da6e34a2-5140-462c-950f-c886e54a5348", 1, 0, 0.0, 448.0, 448, 448, 448.0, 448.0, 448.0, 448.0, 2.232142857142857, 0.4032679966517857, 1.5389578683035714], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, 25.0, 1153.041666666667, 280, 2265, 1155.5, 1901.5, 2197.5, 2265.0, 0.09710073391971388, 0.030628454156315998, 0.04380912018643341], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 106.0, 77, 240, 80.0, 240.0, 240.0, 240.0, 0.029449731762026535, 0.007937623013983715, 0.017341980715333986], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 80.16666666666667, 79, 82, 80.0, 82.0, 82.0, 82.0, 0.029449153582244123, 0.007937467176464236, 0.017312881305186486], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 20, 0, 0.0, 171.85, 77, 1453, 80.5, 236.8, 1392.1999999999991, 1453.0, 0.10000200004000079, 4.524704751907538, 0.05836054221084421], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 20, 0, 0.0, 155.40000000000003, 77, 640, 80.0, 328.90000000000003, 624.4999999999998, 640.0, 0.09999950000249999, 1.4957640055549721, 0.05845673896630517], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 20, 0, 0.0, 89.59999999999998, 77, 235, 82.0, 91.30000000000001, 227.8499999999999, 235.0, 0.10007705933568849, 0.0743736739789638, 0.050233992674359254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 106.66666666666667, 80, 236, 80.5, 236.0, 236.0, 236.0, 0.029449298125061352, 0.007879987974869931, 0.016795302836949053], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 20, 0, 0.0, 120.1, 77, 245, 81.0, 241.8, 244.85, 245.0, 0.10008056485470804, 0.03429518574952837, 0.056656936959252197], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 81.66666666666667, 79, 84, 81.5, 84.0, 84.0, 84.0, 0.029448719962305636, 0.021885230362611904, 0.014781877012329197], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 114.33333333333334, 81, 252, 85.5, 252.0, 252.0, 252.0, 0.030701372863056527, 0.02416533840588238, 0.010913378634914624], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 779.6428571428572, 78, 2651, 564.0, 2037.0, 2651.0, 2651.0, 0.08308556032308413, 0.016042189660595486, 0.05654176384709883], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=de5a6b25-6447-4d73-bfa4-f82832eb83bd", 1, 0, 0.0, 409.0, 409, 409, 409.0, 409.0, 409.0, 409.0, 2.444987775061125, 0.441721424205379, 1.6857044621026895], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1777.6956521739132, 1195, 2835, 1651.0, 2627.8000000000006, 2818.2, 2835.0, 0.1025206712875259, 0.053062456818738994, 0.04715550407853975], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 215.83333333333334, 161, 323, 165.5, 323.0, 323.0, 323.0, 0.029436872626652146, 0.04562140318212593, 0.06620421646404286], "isController": false}, {"data": ["addBook", 57, 10, 17.54385964912281, 1041.315789473684, 413, 3388, 706.0, 1925.2000000000005, 3140.5999999999985, 3388.0, 0.2641469212981199, 89.78588640118357, 0.9577090859010423], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/1faf2872-a9f4-4833-8ed9-b8216b0a719e", 3, 0, 0.0, 340.66666666666663, 204, 607, 211.0, 607.0, 607.0, 607.0, 0.047757012321309175, 0.030703157335477092, 0.03062542782323538], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 140.00000000000003, 79, 364, 83.0, 328.4, 335.1, 364.0, 0.258817973773112, 0.19234421683724437, 0.1251122041188383], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 690.5438596491229, 389, 1429, 625.0, 1377.6000000000001, 1418.1999999999998, 1429.0, 0.2586969841377902, 76.06550288481176, 0.13010639338961127], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 127.85964912280697, 78, 357, 84.0, 243.0, 246.2, 357.0, 0.2591521632385837, 0.458577851355775, 0.1260329856375143], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 1280.9824561403507, 548, 2479, 968.0, 2414.2, 2435.9, 2479.0, 0.25777508445525793, 231.94647411310675, 0.12939100918945565], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 99.625, 81, 237, 85.0, 165.60000000000008, 237.0, 237.0, 0.10273730712675858, 0.07675199214059601, 0.036519902142714965], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 10, 5.847953216374269, 150.7426900584796, 80, 727, 89.0, 319.20000000000005, 396.4, 658.6000000000001, 0.715825606463361, 1.6320451001527931, 0.3414218007618729], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 83.8, 81, 87, 84.0, 87.0, 87.0, 87.0, 0.055727692204810414, 0.04315630851407682, 0.019809453088428703], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e73dfaa3-b47b-4a0c-a815-34eabf658bb6", 1, 0, 0.0, 661.0, 661, 661, 661.0, 661.0, 661.0, 661.0, 1.5128593040847202, 0.27331930786686837, 1.0430455748865355], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 103.2, 82, 264, 86.0, 223.3000000000003, 262.65, 264.0, 0.08930046480891933, 0.072469420172082, 0.03174352460004554], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/45e8b28c-b81a-4622-b025-ad9318ea0656", 1, 0, 0.0, 314.0, 314, 314, 314.0, 314.0, 314.0, 314.0, 3.1847133757961785, 1.0169934315286624, 1.9002537818471337], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/326d8305-60e1-4578-b7f3-d2265b9b99e8", 3, 0, 0.0, 581.6666666666667, 190, 1114, 441.0, 1114.0, 1114.0, 1114.0, 0.052252974065107205, 0.023643110009928067, 0.033508580373782945], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 534.9, 162, 2680, 317.0, 2469.4000000000005, 2680.0, 2680.0, 0.05517058745641523, 6.677273571288675, 0.12266835304762325], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 20, 0, 0.0, 303.65000000000003, 160, 1534, 167.0, 470.90000000000015, 1481.1499999999992, 1534.0, 0.09995701848205271, 6.126335402339493, 0.22352693029497314], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=761532d1-c2ae-41bd-b0c1-5dbf867fd3bf", 1, 0, 0.0, 244.0, 244, 244, 244.0, 244.0, 244.0, 244.0, 4.0983606557377055, 0.7404264856557378, 2.82562756147541], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/da6e34a2-5140-462c-950f-c886e54a5348", 3, 0, 0.0, 1030.0, 174, 2651, 265.0, 2651.0, 2651.0, 2651.0, 0.019460932178651358, 0.02300216300152444, 0.012479829554669001], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b1ab1bf7-be21-40c4-a506-8b9feeade5e4", 1, 0, 0.0, 207.0, 207, 207, 207.0, 207.0, 207.0, 207.0, 4.830917874396135, 1.5426856884057971, 2.8825105676328504], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 7, 0, 0.0, 86.28571428571429, 81, 95, 85.0, 95.0, 95.0, 95.0, 0.036549898443496466, 0.030303577908719237, 0.012992346712336634], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 102.89473684210526, 81, 241, 86.0, 240.0, 241.0, 241.0, 0.09219407337677776, 0.0715764534516976, 0.03277211202065147], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6f9bf78c-9810-4652-9157-d4bd733562ee", 1, 0, 0.0, 205.0, 205, 205, 205.0, 205.0, 205.0, 205.0, 4.878048780487805, 1.557736280487805, 2.9106326219512195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 92.125, 79, 235, 81.5, 134.2000000000001, 235.0, 235.0, 0.09959601366955287, 0.07401617812747045, 0.04999253029897478], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 129.8125, 78, 244, 81.5, 241.9, 244.0, 244.0, 0.09959725360573182, 0.035999446768380364, 0.056278770378531816], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 263.3125, 78, 2374, 81.0, 880.9000000000016, 2374.0, 2374.0, 0.09959601366955287, 5.626208233867002, 0.05801662319715653], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=849524e8-8d48-4290-b9c3-cbc9dbabfc6f", 1, 0, 0.0, 438.0, 438, 438, 438.0, 438.0, 438.0, 438.0, 2.28310502283105, 0.4124750285388128, 1.574093892694064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 173.25, 78, 778, 82.0, 402.8000000000004, 778.0, 778.0, 0.09959539371304078, 1.8554383558979146, 0.058113523187052596], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 25.0, 0.45627376425855515], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 8.333333333333334, 0.1520912547528517], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 8.333333333333334, 0.1520912547528517], "isController": false}, {"data": ["401/Unauthorized", 14, 58.333333333333336, 1.064638783269962], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1315, 24, "401/Unauthorized", 14, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
