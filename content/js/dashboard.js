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

    var data = {"OkPercent": 99.37839937839938, "KoPercent": 0.6216006216006216};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7841894596397598, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=61c6221d-c453-41a7-8da7-7c8ca79ea385"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "see books"], "isController": true}, {"data": [0.4642857142857143, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4642857142857143, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/b97ee45c-a438-43df-9f13-391bfe22fe85"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0d69f438-df38-473a-9257-5a7507439cf2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/ab11102b-030e-41be-8e37-c96528fc4d1e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3d108f8e-bc68-4e9e-bd81-e1e59e785b63"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=23e8e64b-fe82-467e-b0ca-c62634610d52"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d7f81a01-f464-479d-830c-3fdc6b190c9e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7631578947368421, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2b49cdc2-1979-401a-b6c6-9813fc6f5481"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f45bb7aa-456e-455a-8d43-af2be0b4b8d9"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/24ed45d8-f7c2-4314-9d6a-412116ef7039"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d8f09b98-d3d9-4384-9124-7e19870afece"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cc9834cc-766d-4dc2-ba8a-4a6dde99aa95"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=822814d6-02bb-4291-bbdb-dbf5d5db2e31"], "isController": false}, {"data": [0.7105263157894737, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d0af369a-498c-462d-ac3f-81008844cd46"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c73baab1-eaae-4230-ae0a-c47727861214"], "isController": false}, {"data": [0.13043478260869565, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8611111111111112, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.13043478260869565, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/61c6221d-c453-41a7-8da7-7c8ca79ea385"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/3d108f8e-bc68-4e9e-bd81-e1e59e785b63"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.4230769230769231, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b97ee45c-a438-43df-9f13-391bfe22fe85"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3b705126-8dc0-4628-bb87-6e3f7f3b17fe"], "isController": false}, {"data": [0.02631578947368421, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d7f81a01-f464-479d-830c-3fdc6b190c9e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/23e8e64b-fe82-467e-b0ca-c62634610d52"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/822814d6-02bb-4291-bbdb-dbf5d5db2e31"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2b49cdc2-1979-401a-b6c6-9813fc6f5481"], "isController": false}, {"data": [0.3644067796610169, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0d69f438-df38-473a-9257-5a7507439cf2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.7946428571428571, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9051724137931034, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=24ed45d8-f7c2-4314-9d6a-412116ef7039"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/cc9834cc-766d-4dc2-ba8a-4a6dde99aa95"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d8f09b98-d3d9-4384-9124-7e19870afece"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7f4bdaf7-e45b-41f5-b73d-a69a6c0a47e5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d0af369a-498c-462d-ac3f-81008844cd46"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c73baab1-eaae-4230-ae0a-c47727861214"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f45bb7aa-456e-455a-8d43-af2be0b4b8d9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1287, 8, 0.6216006216006216, 373.23076923076945, 77, 4646, 113.0, 950.4000000000001, 1237.7999999999993, 2503.519999999935, 5.110732538330494, 715.9487780727932, 3.726331496974065], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=61c6221d-c453-41a7-8da7-7c8ca79ea385", 1, 0, 0.0, 1033.0, 1033, 1033, 1033.0, 1033.0, 1033.0, 1033.0, 0.968054211035818, 0.17489260648596322, 0.6674280009680542], "isController": false}, {"data": ["see books", 56, 0, 0.0, 1338.482142857143, 1064, 1831, 1367.5, 1557.6000000000001, 1741.05, 1831.0, 0.23260933677262852, 279.90682954382606, 1.143738291650571], "isController": true}, {"data": ["deleteBook", 14, 0, 0.0, 1050.5714285714284, 482, 2254, 1025.0, 2000.0, 2254.0, 2254.0, 0.09225031463946601, 0.016666316609669152, 0.06270138573151204], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 0, 0.0, 1050.5714285714284, 482, 2254, 1025.0, 2000.0, 2254.0, 2254.0, 0.09134386397593743, 0.016502553550340256, 0.06208528254614496], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b97ee45c-a438-43df-9f13-391bfe22fe85", 2, 0, 0.0, 759.5, 755, 764, 759.5, 764.0, 764.0, 764.0, 0.06740815638692282, 0.041438900825749914, 0.041899698769801146], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 93.8125, 77, 241, 83.0, 144.4000000000001, 241.0, 241.0, 0.07258079149353124, 0.026234341261272706, 0.04101275437299269], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 87.87499999999999, 79, 144, 84.5, 106.20000000000005, 144.0, 144.0, 0.07257684073012302, 0.05393649980041369, 0.03643017200711253], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0d69f438-df38-473a-9257-5a7507439cf2", 1, 0, 0.0, 533.0, 533, 533, 533.0, 533.0, 533.0, 533.0, 1.876172607879925, 0.3389569652908067, 1.2935330675422139], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 150.625, 78, 651, 86.5, 365.4000000000003, 651.0, 651.0, 0.07258079149353124, 1.3521627800030847, 0.042350608317758706], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 147.75, 81, 963, 83.0, 457.6000000000005, 963.0, 963.0, 0.07257848682927272, 4.099980161407751, 0.04227838612662224], "isController": false}, {"data": ["goToProfile", 14, 0, 0.0, 392.2857142857143, 194, 840, 319.5, 797.5, 840.0, 840.0, 0.09367305427684401, 0.21095386142075262, 0.06055816594850659], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ab11102b-030e-41be-8e37-c96528fc4d1e", 1, 0, 0.0, 699.0, 699, 699, 699.0, 699.0, 699.0, 699.0, 1.4306151645207439, 0.45684683476394855, 0.8536190092989986], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3d108f8e-bc68-4e9e-bd81-e1e59e785b63", 1, 0, 0.0, 999.0, 999, 999, 999.0, 999.0, 999.0, 999.0, 1.001001001001001, 0.1808449074074074, 0.6901432682682682], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 101.0, 78, 240, 83.0, 236.0, 240.0, 240.0, 0.12313665271117935, 0.0915107350714917, 0.0618088276304162], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 111.23529411764704, 81, 243, 82.0, 241.4, 243.0, 243.0, 0.12299144124264764, 0.03290981923875533, 0.07014355633369748], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 2, 0, 0.0, 566.0, 485, 647, 566.0, 647.0, 647.0, 647.0, 0.311284046692607, 91.5278453307393, 0.17752918287937744], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 2, 0, 0.0, 841.0, 711, 971, 841.0, 971.0, 971.0, 971.0, 0.2893937201562726, 260.39697809651284, 0.16476224497178413], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 2, 0, 0.0, 210.0, 82, 338, 210.0, 338.0, 338.0, 338.0, 0.31857279388340237, 0.5637245141764894, 0.176397240363173], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 98.61538461538461, 78, 241, 83.0, 189.39999999999995, 241.0, 241.0, 0.06370956280537708, 0.047346657514542936, 0.031979214142542796], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 106.53846153846153, 79, 240, 82.0, 240.0, 240.0, 240.0, 0.06370862614798044, 0.02440760166426534, 0.035922246684701106], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=23e8e64b-fe82-467e-b0ca-c62634610d52", 1, 0, 0.0, 1324.0, 1324, 1324, 1324.0, 1324.0, 1324.0, 1324.0, 0.7552870090634441, 0.13645321941087613, 0.5207349886706948], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 179.99999999999997, 78, 879, 83.0, 625.3999999999997, 879.0, 879.0, 0.06370768951812483, 4.4254111979128385, 0.037032008825965294], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 148.46153846153845, 80, 628, 82.0, 473.59999999999985, 628.0, 628.0, 0.06370862614798044, 1.456808384667784, 0.03709476872543542], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d7f81a01-f464-479d-830c-3fdc6b190c9e", 3, 0, 0.0, 1229.3333333333333, 194, 3028, 466.0, 3028.0, 3028.0, 3028.0, 0.044175464946768564, 0.028400567470660127, 0.028328667299848332], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 2, 0, 0.0, 182.5, 82, 283, 182.5, 283.0, 283.0, 283.0, 0.33211557622052473, 0.24681636084357356, 0.18649068000664232], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 500.78947368421063, 79, 1038, 719.0, 1019.0, 1038.0, 1038.0, 0.08988764044943821, 42.58045350384388, 0.048778459491425195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 111.3529411764706, 77, 249, 83.0, 245.0, 249.0, 249.0, 0.12298699231693024, 0.03314883777292261, 0.07230289978007032], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 379.3157894736842, 80, 743, 475.0, 668.0, 743.0, 743.0, 0.08988764044943821, 13.921976641040803, 0.048866240390301595], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 129.82352941176467, 78, 244, 85.0, 242.4, 244.0, 244.0, 0.12313665271117935, 0.03318917592606006, 0.07251113436019645], "isController": false}, {"data": ["deleteBooks", 14, 0, 0.0, 1113.0, 499, 3049, 1025.0, 2376.5, 3049.0, 3049.0, 0.09101724776845212, 0.016443545739417618, 0.06275212590285859], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2b49cdc2-1979-401a-b6c6-9813fc6f5481", 1, 0, 0.0, 1063.0, 1063, 1063, 1063.0, 1063.0, 1063.0, 1063.0, 0.9407337723424272, 0.16995678504233303, 0.648591839134525], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 292.7692307692308, 159, 991, 170.0, 787.3999999999999, 991.0, 991.0, 0.06368178700891546, 5.951529893700402, 0.1419684790462428], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f45bb7aa-456e-455a-8d43-af2be0b4b8d9", 1, 0, 0.0, 1575.0, 1575, 1575, 1575.0, 1575.0, 1575.0, 1575.0, 0.6349206349206349, 0.11470734126984128, 0.43774801587301587], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/24ed45d8-f7c2-4314-9d6a-412116ef7039", 3, 0, 0.0, 594.6666666666666, 534, 669, 581.0, 669.0, 669.0, 669.0, 0.027838351969563403, 0.023207688604834593, 0.01785206815756507], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 19, 0, 0.0, 992.4736842105262, 135, 2105, 950.0, 1885.0, 2105.0, 2105.0, 0.09402542645479604, 0.05775585277350264, 0.042513449656807194], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 100.47368421052633, 80, 245, 83.0, 239.0, 245.0, 245.0, 0.08988253771518588, 0.06679747187622702, 0.045116820689067916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 154.1052631578947, 79, 324, 83.0, 254.0, 324.0, 324.0, 0.08988806570344507, 0.09510874386159131, 0.04729102798830509], "isController": false}, {"data": ["login", 19, 0, 0.0, 4005.473684210526, 2014, 6115, 3974.0, 5863.0, 6115.0, 6115.0, 0.09369575508915891, 11.932050389823655, 0.15772150878520988], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 97.3529411764706, 82, 168, 86.0, 154.39999999999998, 168.0, 168.0, 0.12010654156746102, 0.09723469039006366, 0.04269412219780841], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d8f09b98-d3d9-4384-9124-7e19870afece", 1, 0, 0.0, 520.0, 520, 520, 520.0, 520.0, 520.0, 520.0, 1.9230769230769231, 0.3474308894230769, 1.3258713942307692], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cc9834cc-766d-4dc2-ba8a-4a6dde99aa95", 1, 0, 0.0, 1704.0, 1704, 1704, 1704.0, 1704.0, 1704.0, 1704.0, 0.5868544600938967, 0.10602351085680752, 0.4046086414319249], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=822814d6-02bb-4291-bbdb-dbf5d5db2e31", 1, 0, 0.0, 1018.0, 1018, 1018, 1018.0, 1018.0, 1018.0, 1018.0, 0.9823182711198427, 0.17746960952848723, 0.6772624017681729], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 616.421052631579, 164, 1132, 810.0, 1103.0, 1132.0, 1132.0, 0.08984768453059314, 56.639151860024405, 0.18997040494114978], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 277.5625, 163, 1050, 175.5, 585.2000000000005, 1050.0, 1050.0, 0.07254919742450348, 5.530038662204135, 0.16200469586016142], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 2, 0, 0.0, 1023.5, 793, 1254, 1023.5, 1254.0, 1254.0, 1254.0, 0.28600028600028604, 342.15577184327185, 0.6448971292721293], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d0af369a-498c-462d-ac3f-81008844cd46", 1, 0, 0.0, 3049.0, 3049, 3049, 3049.0, 3049.0, 3049.0, 3049.0, 0.3279763857002296, 0.059253546244670385, 0.22612434404722861], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c73baab1-eaae-4230-ae0a-c47727861214", 1, 0, 0.0, 615.0, 615, 615, 615.0, 615.0, 615.0, 615.0, 1.6260162601626016, 0.2937627032520325, 1.1210619918699187], "isController": false}, {"data": ["register", 23, 4, 17.391304347826086, 1894.1739130434783, 599, 4476, 1644.0, 3913.6000000000017, 4466.4, 4476.0, 0.08967875510291612, 0.02852722627509543, 0.04046053208744848], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 261.2352941176471, 166, 483, 178.0, 477.4, 483.0, 483.0, 0.12291407583075456, 0.19049281088223385, 0.2764366373420193], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 22, 0, 0.0, 99.5, 82, 247, 86.0, 146.79999999999995, 233.94999999999982, 247.0, 0.1477988055169263, 0.11474614295503557, 0.0525378566485949], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 453.44444444444446, 166, 1105, 326.0, 1048.3000000000002, 1105.0, 1105.0, 0.09452887857240387, 25.24492374998687, 0.20722297458748648], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 4, 0, 0.0, 135.75, 82, 237, 112.0, 237.0, 237.0, 237.0, 0.020943175927913588, 0.01556421570424047, 0.010512492604441], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 4, 0, 0.0, 126.75, 83, 234, 95.0, 234.0, 234.0, 234.0, 0.020927069163963585, 0.005599625928638694, 0.011934969132572984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 4, 0, 0.0, 128.75, 80, 239, 98.0, 239.0, 239.0, 239.0, 0.020926521750503545, 0.005640351565565408, 0.012302505950979621], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 4, 0, 0.0, 88.5, 79, 101, 87.0, 101.0, 101.0, 101.0, 0.02094427252687412, 0.00564513595450904, 0.01233339485713388], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 913.1785714285714, 628, 1464, 889.5, 1203.3, 1286.7499999999998, 1464.0, 0.23872045834328, 285.5926608379088, 0.4713796550489377], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 4, 17.391304347826086, 1894.1739130434783, 599, 4476, 1644.0, 3913.6000000000017, 4466.4, 4476.0, 0.0914756615082348, 0.029098830503553632, 0.041271245719535624], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 102.0, 80, 207, 80.5, 207.0, 207.0, 207.0, 0.031059437410057043, 0.008371488989429438, 0.01828988355299258], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/61c6221d-c453-41a7-8da7-7c8ca79ea385", 3, 0, 0.0, 950.6666666666666, 213, 2297, 342.0, 2297.0, 2297.0, 2297.0, 0.0415915707749896, 0.02587288142936365, 0.02667167787328435], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 101.83333333333333, 80, 202, 82.0, 202.0, 202.0, 202.0, 0.0310602413380752, 0.00837170567315308, 0.018260024692891865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 22, 0, 0.0, 129.72727272727275, 80, 811, 82.0, 241.8, 725.7999999999988, 811.0, 0.13961605584642234, 5.7462282345708395, 0.08153359511343805], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 22, 0, 0.0, 130.27272727272725, 78, 631, 83.5, 250.29999999999998, 574.2999999999993, 631.0, 0.1396187139847181, 1.9019455193498844, 0.08167149382504506], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 95.5, 80, 165, 81.0, 165.0, 165.0, 165.0, 0.03106603084856863, 0.008312590285652153, 0.0177173457183243], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 22, 0, 0.0, 105.36363636363635, 80, 251, 82.0, 244.5, 250.25, 251.0, 0.13961694188127483, 0.10375829372231458, 0.07008116028024927], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 83.5, 82, 87, 83.0, 87.0, 87.0, 87.0, 0.031079065141720534, 0.02309684430942317, 0.01560023386996519], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 22, 0, 0.0, 111.86363636363636, 79, 262, 82.0, 244.9, 259.74999999999994, 262.0, 0.13961782792737334, 0.04689046902070786, 0.07909280539813293], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3d108f8e-bc68-4e9e-bd81-e1e59e785b63", 3, 0, 0.0, 625.6666666666666, 213, 1073, 591.0, 1073.0, 1073.0, 1073.0, 0.021181055663814286, 0.02919979516154085, 0.013582903534412155], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 113.33333333333334, 83, 243, 86.5, 243.0, 243.0, 243.0, 0.032654482916263015, 0.025702649639167966, 0.011607648224140371], "isController": false}, {"data": ["deleteAccount", 13, 0, 0.0, 1240.6153846153845, 466, 3323, 1140.0, 2912.5999999999995, 3323.0, 3323.0, 0.08979450872042825, 0.016222640735624246, 0.061119895095838365], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b97ee45c-a438-43df-9f13-391bfe22fe85", 1, 0, 0.0, 1032.0, 1032, 1032, 1032.0, 1032.0, 1032.0, 1032.0, 0.9689922480620154, 0.17506207606589147, 0.6680747335271318], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3b705126-8dc0-4628-bb87-6e3f7f3b17fe", 1, 0, 0.0, 316.0, 316, 316, 316.0, 316.0, 316.0, 316.0, 3.1645569620253164, 1.0105567642405062, 1.8882268591772151], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 19, 0, 0.0, 2348.736842105264, 1186, 4646, 1879.0, 4545.0, 4646.0, 4646.0, 0.09406033723106169, 0.0486835729809206, 0.043264080894365294], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 188.0, 164, 290, 169.0, 290.0, 290.0, 290.0, 0.031045776998183824, 0.04811489071886497, 0.0698226801043138], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d7f81a01-f464-479d-830c-3fdc6b190c9e", 1, 0, 0.0, 499.0, 499, 499, 499.0, 499.0, 499.0, 499.0, 2.004008016032064, 0.36205222945891785, 1.3816695891783568], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/23e8e64b-fe82-467e-b0ca-c62634610d52", 3, 0, 0.0, 1381.0, 312, 3323, 508.0, 3323.0, 3323.0, 3323.0, 0.02212878955521133, 0.02615548010253006, 0.0141906625728406], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/822814d6-02bb-4291-bbdb-dbf5d5db2e31", 3, 0, 0.0, 409.6666666666667, 200, 605, 424.0, 605.0, 605.0, 605.0, 0.032674399607907204, 0.027239302537711705, 0.020953309644393618], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2b49cdc2-1979-401a-b6c6-9813fc6f5481", 3, 0, 0.0, 368.6666666666667, 223, 532, 351.0, 532.0, 532.0, 532.0, 0.021612898577871274, 0.02167621761667363, 0.013859834048960419], "isController": false}, {"data": ["addBook", 59, 4, 6.779661016949152, 1175.5084745762708, 435, 5483, 1004.0, 1805.0, 2372.0, 5483.0, 0.2770733539964309, 96.56149014246971, 1.0060143849206349], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/0d69f438-df38-473a-9257-5a7507439cf2", 3, 0, 0.0, 465.6666666666667, 311, 592, 494.0, 592.0, 592.0, 592.0, 0.03154872700886519, 0.026300875608627528, 0.020231442775867328], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 146.71428571428575, 81, 331, 88.0, 327.3, 330.15, 331.0, 0.2394369810417219, 0.1779409595437015, 0.11574346251528549], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 525.1607142857144, 392, 739, 483.5, 661.4000000000001, 730.6, 739.0, 0.23932748975379184, 70.37022840817303, 0.12036489963203398], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 130.8571428571429, 80, 341, 85.5, 247.3, 260.09999999999997, 341.0, 0.23972089638492328, 0.42419361743113376, 0.11658301406219902], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 762.875, 540, 1131, 754.5, 943.2, 965.7999999999998, 1131.0, 0.23909043168631336, 215.1339907074942, 0.12001218934254401], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 95.8888888888889, 81, 248, 86.0, 115.70000000000022, 248.0, 248.0, 0.09576505639497765, 0.07154323060757607, 0.034041484890402214], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 4, 2.2988505747126435, 236.66666666666669, 79, 4248, 91.0, 598.5, 774.5, 2027.25, 0.7254866806482683, 1.553748198009915, 0.3495142509662732], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 4, 0, 0.0, 99.5, 88, 120, 95.0, 120.0, 120.0, 120.0, 0.019950323694001935, 0.015449811220062046, 0.007091716625602251], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 104.06250000000001, 82, 243, 87.0, 208.00000000000003, 243.0, 243.0, 0.07400623502530088, 0.06005779424416507, 0.02630690385664992], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 4, 0, 0.0, 266.75, 166, 477, 212.0, 477.0, 477.0, 477.0, 0.020916891959023808, 0.03241709720602615, 0.04704258025549984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 22, 0, 0.0, 259.6363636363636, 163, 1057, 169.5, 504.9, 975.3999999999988, 1057.0, 0.13954432435175318, 7.794778217685974, 0.3122155595093114], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=24ed45d8-f7c2-4314-9d6a-412116ef7039", 1, 0, 0.0, 618.0, 618, 618, 618.0, 618.0, 618.0, 618.0, 1.6181229773462784, 0.2923366707119741, 1.1156199433656957], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cc9834cc-766d-4dc2-ba8a-4a6dde99aa95", 3, 0, 0.0, 1158.6666666666667, 465, 2051, 960.0, 2051.0, 2051.0, 2051.0, 0.016665092741241106, 0.022974175702850288, 0.010686924707110995], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d8f09b98-d3d9-4384-9124-7e19870afece", 3, 0, 0.0, 536.6666666666667, 202, 1140, 268.0, 1140.0, 1140.0, 1140.0, 0.04031445273130418, 0.03360850047033528, 0.025852692669488676], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7f4bdaf7-e45b-41f5-b73d-a69a6c0a47e5", 1, 0, 0.0, 283.0, 283, 283, 283.0, 283.0, 283.0, 283.0, 3.5335689045936394, 1.1283955388692581, 2.1084087897526502], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 86.07692307692308, 81, 96, 85.0, 94.8, 96.0, 96.0, 0.06329237180860388, 0.05247580436084442, 0.02249846029133966], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d0af369a-498c-462d-ac3f-81008844cd46", 3, 0, 0.0, 762.0, 293, 1153, 840.0, 1153.0, 1153.0, 1153.0, 0.029906691123694075, 0.024484156307321158, 0.019178444503150174], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 110.05263157894737, 82, 249, 90.0, 244.0, 249.0, 249.0, 0.08964336096550618, 0.06959616403083732, 0.031865413468207274], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c73baab1-eaae-4230-ae0a-c47727861214", 3, 0, 0.0, 615.0, 181, 1337, 327.0, 1337.0, 1337.0, 1337.0, 0.028176157335662564, 0.028258704671606887, 0.0180686946455909], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 102.38888888888889, 82, 245, 84.5, 236.0, 245.0, 245.0, 0.09458103229942252, 0.07028922419908257, 0.04747524472842108], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f45bb7aa-456e-455a-8d43-af2be0b4b8d9", 3, 0, 0.0, 694.6666666666667, 214, 1558, 312.0, 1558.0, 1558.0, 1558.0, 0.028460837887067394, 0.028729511161391923, 0.018251253462735276], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 132.55555555555557, 80, 337, 83.0, 254.20000000000013, 337.0, 337.0, 0.09457059695062364, 0.05686960159509073, 0.05216980413378587], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 309.5, 81, 956, 165.5, 892.1000000000001, 956.0, 956.0, 0.09457705665691121, 18.93107155148407, 0.05379480588059121], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 265.8333333333333, 81, 723, 235.0, 657.3000000000001, 723.0, 723.0, 0.09457308134861214, 6.199298320276994, 0.05388490127621119], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 50.0, 0.3108003108003108], "isController": false}, {"data": ["401/Unauthorized", 4, 50.0, 0.3108003108003108], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1287, 8, "406/Not Acceptable", 4, "401/Unauthorized", 4, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
