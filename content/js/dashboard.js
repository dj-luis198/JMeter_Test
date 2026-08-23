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

    var data = {"OkPercent": 96.22344610542879, "KoPercent": 3.7765538945712036};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7397078353253652, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.13636363636363635, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/402ca3fb-8219-4f43-94ac-9c3441aca3d0"], "isController": false}, {"data": [0.5789473684210527, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5789473684210527, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6cac4f5a-a6ab-40fe-ac1c-0c2b2e3484f8"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7f972a1f-980e-46f3-8d47-52254a6ac4ae"], "isController": false}, {"data": [0.6578947368421053, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ff86e833-a594-4370-9b22-4b2f21db3838"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5555555555555556, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.4444444444444444, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.631578947368421, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1a590b66-1b38-4516-bb8a-2bb9e83bdfac"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1a590b66-1b38-4516-bb8a-2bb9e83bdfac"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4f84af5a-8553-40d7-a47a-e4a319431d6b"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d0f32fa6-62eb-45ef-a0eb-a2d124d6bee3"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ff86e833-a594-4370-9b22-4b2f21db3838"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ea7928b2-f447-4038-a17c-11de260a96a2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8bd1db1b-e53a-489b-be90-62c73a4bbddb"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a87e152c-62f1-4b07-b23b-7dff9c092635"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/69d3a8a9-856c-4be8-bff3-a735a43378d7"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.19047619047619047, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=93feb28e-770b-41c1-b66d-be5d31d922c4"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8ee4dbf4-075f-468d-acf8-0f723f1fe875"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/7acc5630-f892-4f60-a928-be3593f907b6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2c283aff-a6fd-4e23-bbcf-19016a1ae5be"], "isController": false}, {"data": [0.20689655172413793, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/4f84af5a-8553-40d7-a47a-e4a319431d6b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2c283aff-a6fd-4e23-bbcf-19016a1ae5be"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.41818181818181815, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.20689655172413793, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7f972a1f-980e-46f3-8d47-52254a6ac4ae"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5263157894736842, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.3076923076923077, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6cac4f5a-a6ab-40fe-ac1c-0c2b2e3484f8"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.1836734693877551, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.6, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4818181818181818, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0f6d47b2-46e1-4e86-9f08-c08d1e24bb69"], "isController": false}, {"data": [0.869281045751634, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ea7928b2-f447-4038-a17c-11de260a96a2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d0f32fa6-62eb-45ef-a0eb-a2d124d6bee3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bc17ec6b-6bda-4fa8-abba-3d0006ebb033"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=69d3a8a9-856c-4be8-bff3-a735a43378d7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8bd1db1b-e53a-489b-be90-62c73a4bbddb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8ee4dbf4-075f-468d-acf8-0f723f1fe875"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a87e152c-62f1-4b07-b23b-7dff9c092635"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/93feb28e-770b-41c1-b66d-be5d31d922c4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1271, 48, 3.7765538945712036, 388.71518489378485, 92, 2576, 115.0, 1080.1999999999998, 1317.3999999999999, 1792.6799999999992, 4.910540082138538, 733.4388649108878, 3.570228981458944], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 1691.5272727272725, 1300, 2343, 1659.0, 2106.2, 2253.3999999999996, 2343.0, 0.2539395254562831, 305.57507996209375, 1.2486186627660016], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/402ca3fb-8219-4f43-94ac-9c3441aca3d0", 1, 0, 0.0, 336.0, 336, 336, 336.0, 336.0, 336.0, 336.0, 2.976190476190476, 0.9504045758928571, 1.7758324032738093], "isController": false}, {"data": ["deleteBook", 19, 6, 31.57894736842105, 461.3157894736843, 106, 1222, 471.0, 1140.0, 1222.0, 1222.0, 0.1038608920010714, 0.022511378575684523, 0.069023506043064], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 19, 6, 31.57894736842105, 461.3157894736843, 106, 1222, 471.0, 1140.0, 1222.0, 1222.0, 0.1056741454298713, 0.022904393054983926, 0.07022855162460094], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 21, 0, 0.0, 118.80952380952381, 93, 305, 100.0, 255.20000000000013, 303.79999999999995, 305.0, 0.10541057418645625, 0.043283824872879864, 0.05927384035819517], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 21, 0, 0.0, 101.66666666666666, 95, 107, 102.0, 105.8, 106.9, 107.0, 0.10541163242461814, 0.07833813698743594, 0.052911698306888404], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6cac4f5a-a6ab-40fe-ac1c-0c2b2e3484f8", 1, 0, 0.0, 593.0, 593, 593, 593.0, 593.0, 593.0, 593.0, 1.6863406408094435, 0.30466115092748736, 1.1626528246205734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 21, 0, 0.0, 184.1904761904762, 96, 808, 102.0, 492.20000000000016, 780.9999999999995, 808.0, 0.10540422520365603, 2.977355658952081, 0.0612064062554898], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 21, 0, 0.0, 203.2857142857143, 92, 1110, 102.0, 927.8000000000006, 1108.1, 1110.0, 0.10541110330288124, 9.058952963432386, 0.06110745971789981], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7f972a1f-980e-46f3-8d47-52254a6ac4ae", 1, 0, 0.0, 393.0, 393, 393, 393.0, 393.0, 393.0, 393.0, 2.544529262086514, 0.45970499363867684, 1.754333651399491], "isController": false}, {"data": ["goToProfile", 19, 6, 31.57894736842105, 279.36842105263156, 100, 1192, 216.0, 430.0, 1192.0, 1192.0, 0.10454840591193723, 0.1256827028101511, 0.06755666936291503], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ff86e833-a594-4370-9b22-4b2f21db3838", 3, 0, 0.0, 749.3333333333334, 377, 1289, 582.0, 1289.0, 1289.0, 1289.0, 0.07161100899911681, 0.03240211670207433, 0.04592242439070966], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 101.62500000000001, 93, 106, 103.0, 106.0, 106.0, 106.0, 0.0972940103374886, 0.07230541197932502, 0.04883703253268471], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 137.125, 93, 314, 102.0, 310.5, 314.0, 314.0, 0.09729282708632306, 0.04429959045800599, 0.05446593078831513], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 9, 0, 0.0, 687.888888888889, 453, 924, 771.0, 924.0, 924.0, 924.0, 0.07661204511598212, 22.526485023409236, 0.043692806980208554], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 9, 0, 0.0, 1057.333333333333, 842, 1615, 973.0, 1615.0, 1615.0, 1615.0, 0.07657879958477272, 68.90573847754965, 0.04359906265422119], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 9, 0, 0.0, 191.66666666666666, 98, 504, 103.0, 504.0, 504.0, 504.0, 0.07708185236255878, 0.1363987465634341, 0.04268106473590901], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 8, 0, 0.0, 103.625, 97, 118, 103.5, 118.0, 118.0, 118.0, 0.05736329609499362, 0.042630340164345845, 0.028793685735182345], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 8, 0, 0.0, 124.25, 95, 296, 102.0, 296.0, 296.0, 296.0, 0.057283611158847454, 0.026082503616027954, 0.03206819345391533], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 8, 0, 0.0, 235.125, 97, 975, 101.5, 975.0, 975.0, 975.0, 0.05700644885452667, 6.425257252734528, 0.03290118288381373], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 8, 0, 0.0, 227.375, 97, 928, 101.5, 928.0, 928.0, 928.0, 0.057025547445255474, 2.109374443109888, 0.03296789461678832], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 9, 0, 0.0, 125.44444444444443, 98, 311, 103.0, 311.0, 311.0, 311.0, 0.07708053202696107, 0.05728348132081774, 0.04328252530810802], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 702.7222222222223, 97, 1321, 1087.0, 1317.4, 1321.0, 1321.0, 0.08273123379846671, 41.36641584452503, 0.044687074853381865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 229.375, 100, 1213, 103.5, 932.3000000000003, 1213.0, 1213.0, 0.09728986908431991, 10.965644229950687, 0.056150695926594794], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 507.5555555555555, 92, 927, 682.5, 909.0, 927.0, 927.0, 0.08265942937440589, 13.512466792722297, 0.044729011967248496], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 239.81250000000003, 94, 786, 105.0, 763.6, 786.0, 786.0, 0.09728986908431991, 3.598751307332616, 0.05624570556437245], "isController": false}, {"data": ["deleteBooks", 19, 6, 31.57894736842105, 322.47368421052624, 102, 593, 393.0, 521.0, 593.0, 593.0, 0.10628776012530768, 0.023037391264824347, 0.07088764264936227], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/1a590b66-1b38-4516-bb8a-2bb9e83bdfac", 3, 0, 0.0, 266.0, 201, 391, 206.0, 391.0, 391.0, 391.0, 0.03527461286112385, 0.029406993338977273, 0.022620764106905594], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1a590b66-1b38-4516-bb8a-2bb9e83bdfac", 1, 0, 0.0, 521.0, 521, 521, 521.0, 521.0, 521.0, 521.0, 1.9193857965451055, 0.3467640355086372, 1.3233265355086372], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4f84af5a-8553-40d7-a47a-e4a319431d6b", 1, 0, 0.0, 437.0, 437, 437, 437.0, 437.0, 437.0, 437.0, 2.288329519450801, 0.41341890732265446, 1.577695938215103], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 8, 0, 0.0, 340.75, 197, 1076, 209.5, 1076.0, 1076.0, 1076.0, 0.056964639200216466, 8.595937631285693, 0.12629294154715962], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d0f32fa6-62eb-45ef-a0eb-a2d124d6bee3", 3, 0, 0.0, 760.6666666666666, 227, 1612, 443.0, 1612.0, 1612.0, 1612.0, 0.08515228066191706, 0.038529189492208564, 0.054606117481763215], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 26, 0, 0.0, 651.1923076923076, 143, 1674, 520.0, 1355.5, 1571.0999999999995, 1674.0, 0.1104817428919871, 0.06786427371001942, 0.049954147420888696], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 101.05555555555556, 93, 111, 101.0, 109.2, 111.0, 111.0, 0.08273313508022816, 0.06148429276958362, 0.04152815569456765], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 110.99999999999999, 92, 297, 101.5, 126.90000000000026, 297.0, 297.0, 0.08273313508022816, 0.09117162759058128, 0.04332357963294066], "isController": false}, {"data": ["login", 26, 0, 0.0, 2958.2307692307695, 1967, 5090, 2780.0, 4093.9000000000005, 4969.95, 5090.0, 0.11056819293299142, 45.93676924657345, 0.2302894919816797], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 107.0, 99, 118, 106.5, 115.9, 118.0, 118.0, 0.09675390643897248, 0.07832909027139472, 0.0343929901794785], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ff86e833-a594-4370-9b22-4b2f21db3838", 1, 0, 0.0, 292.0, 292, 292, 292.0, 292.0, 292.0, 292.0, 3.4246575342465753, 0.6187125428082192, 2.361140839041096], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ea7928b2-f447-4038-a17c-11de260a96a2", 1, 0, 0.0, 444.0, 444, 444, 444.0, 444.0, 444.0, 444.0, 2.2522522522522523, 0.4069010416666667, 1.5528223536036037], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8bd1db1b-e53a-489b-be90-62c73a4bbddb", 3, 0, 0.0, 628.6666666666666, 295, 1192, 399.0, 1192.0, 1192.0, 1192.0, 0.025430194117148426, 0.02550469663897601, 0.016307774222259895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 816.7777777777777, 204, 1423, 1188.0, 1422.1, 1423.0, 1423.0, 0.08262072954104185, 54.96975163290692, 0.17407190814869897], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a87e152c-62f1-4b07-b23b-7dff9c092635", 3, 0, 0.0, 491.0, 222, 1012, 239.0, 1012.0, 1012.0, 1012.0, 0.026818998578593073, 0.02707217271882068, 0.017198381249944127], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/69d3a8a9-856c-4be8-bff3-a735a43378d7", 3, 0, 0.0, 943.0, 430, 1892, 507.0, 1892.0, 1892.0, 1892.0, 0.08745080891998251, 0.039569213671476464, 0.05608010858475441], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 21, 0, 0.0, 338.6666666666667, 199, 1213, 208.0, 1034.8000000000006, 1210.7, 1213.0, 0.10535028971329671, 12.151110450058946, 0.2343681412571801], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 21, 12, 57.142857142857146, 566.5714285714287, 98, 1716, 107.0, 1296.8, 1675.5999999999995, 1716.0, 0.1731987331749802, 88.82901032388163, 0.23295326263113617], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=93feb28e-770b-41c1-b66d-be5d31d922c4", 1, 0, 0.0, 496.0, 496, 496, 496.0, 496.0, 496.0, 496.0, 2.0161290322580645, 0.3642420614919355, 1.3900264616935485], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8ee4dbf4-075f-468d-acf8-0f723f1fe875", 3, 0, 0.0, 368.0, 221, 538, 345.0, 538.0, 538.0, 538.0, 0.03875618484116424, 0.024916492532975055, 0.02485341280504347], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7acc5630-f892-4f60-a928-be3593f907b6", 1, 0, 0.0, 516.0, 516, 516, 516.0, 516.0, 516.0, 516.0, 1.937984496124031, 0.6188680959302325, 1.1563559835271318], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2c283aff-a6fd-4e23-bbcf-19016a1ae5be", 3, 0, 0.0, 310.3333333333333, 216, 421, 294.0, 421.0, 421.0, 421.0, 0.07628152969894222, 0.034515405690602116, 0.04891751741761594], "isController": false}, {"data": ["register", 29, 9, 31.03448275862069, 1058.1034482758623, 276, 2113, 1011.0, 1895.0, 2028.0, 2113.0, 0.11629865494590108, 0.036437321040431826, 0.05247068221192021], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 166.73333333333332, 95, 384, 113.0, 342.6, 384.0, 384.0, 0.07931933435214611, 0.061580928525347814, 0.028195544632989438], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 389.37499999999994, 195, 1308, 212.0, 1033.6000000000004, 1308.0, 1308.0, 0.09723133766012787, 14.672163750486156, 0.21556586359658717], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4f84af5a-8553-40d7-a47a-e4a319431d6b", 3, 0, 0.0, 693.3333333333334, 335, 916, 829.0, 916.0, 916.0, 916.0, 0.030760397014190793, 0.025343282826470345, 0.019725905637355424], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2c283aff-a6fd-4e23-bbcf-19016a1ae5be", 1, 0, 0.0, 438.0, 438, 438, 438.0, 438.0, 438.0, 438.0, 2.28310502283105, 0.4124750285388128, 1.574093892694064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 349.5625, 197, 689, 306.5, 640.7, 689.0, 689.0, 0.10542198443707955, 0.16338348564613794, 0.23709651382675218], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 6, 0, 0.0, 101.0, 96, 105, 101.5, 105.0, 105.0, 105.0, 0.038006195009786595, 0.028244838283640234, 0.019077328354521788], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 6, 0, 0.0, 100.33333333333334, 95, 106, 100.5, 106.0, 106.0, 106.0, 0.03800860261372491, 0.010170270621250609, 0.021676781178139985], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 6, 0, 0.0, 100.66666666666667, 92, 105, 102.0, 105.0, 105.0, 105.0, 0.03800956574071141, 0.010244765766051123, 0.02234546735928542], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 6, 0, 0.0, 101.33333333333334, 97, 105, 102.0, 105.0, 105.0, 105.0, 0.03800836183960471, 0.010244441277080957, 0.022381877137970352], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 6, 6, 100.0, 106.33333333333334, 102, 118, 104.0, 118.0, 118.0, 118.0, 0.06154161751884712, 0.01814996922919124, 0.038042816298271706], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1182.6363636363637, 766, 1908, 1081.0, 1679.0, 1821.1999999999998, 1908.0, 0.25669866843399813, 307.10085034350953, 0.5068795972397893], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 29, 9, 31.03448275862069, 1058.1034482758623, 276, 2113, 1011.0, 1895.0, 2028.0, 2113.0, 0.11227255129694154, 0.035175909794812235, 0.050654217479674794], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 4, 0, 0.0, 152.25, 99, 309, 100.5, 309.0, 309.0, 309.0, 0.02095414708763548, 0.005647797457214251, 0.012339209661957222], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 4, 0, 0.0, 148.5, 98, 295, 100.5, 295.0, 295.0, 295.0, 0.020955683967330087, 0.005648211694319438, 0.012319650144856167], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 153.73333333333332, 94, 314, 101.0, 308.0, 314.0, 314.0, 0.07661426251110906, 0.020649937942447367, 0.045040806671569976], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 151.53333333333333, 99, 307, 103.0, 293.2, 307.0, 307.0, 0.07662796103212755, 0.020653630121940627, 0.04512369189684855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 115.39999999999999, 97, 281, 104.0, 179.00000000000006, 281.0, 281.0, 0.07669456644561588, 0.056996645571400086, 0.03849707729789704], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 4, 0, 0.0, 97.75, 96, 100, 97.5, 100.0, 100.0, 100.0, 0.020977554017201593, 0.00561313457100902, 0.011963761275435284], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 165.4666666666667, 93, 312, 103.0, 309.6, 312.0, 312.0, 0.07668241212195571, 0.02051853605607018, 0.04373293816330286], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 4, 0, 0.0, 163.5, 100, 351, 101.5, 351.0, 351.0, 351.0, 0.020976783944369568, 0.015589191974282463, 0.010529362253326131], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7f972a1f-980e-46f3-8d47-52254a6ac4ae", 3, 0, 0.0, 457.0, 203, 771, 397.0, 771.0, 771.0, 771.0, 0.02097916768648732, 0.024796665973188626, 0.013453437611451829], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 4, 0, 0.0, 102.75, 100, 106, 102.5, 106.0, 106.0, 106.0, 0.020215599367251737, 0.015911887783207915, 0.007186013837577767], "isController": false}, {"data": ["deleteAccount", 19, 6, 31.57894736842105, 417.2631578947369, 98, 1012, 423.0, 916.0, 1012.0, 1012.0, 0.10507396654223697, 0.021867007120143788, 0.07148766936264345], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 26, 0, 0.0, 1500.846153846154, 976, 2576, 1384.5, 2029.4, 2408.6999999999994, 2576.0, 0.10950549843954666, 0.05667765055953098, 0.050368251723658664], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6cac4f5a-a6ab-40fe-ac1c-0c2b2e3484f8", 3, 0, 0.0, 600.0, 333, 1038, 429.0, 1038.0, 1038.0, 1038.0, 0.03959246159531225, 0.025454137907142477, 0.025389697051681356], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 4, 0, 0.0, 316.5, 200, 660, 203.0, 660.0, 660.0, 660.0, 0.02094284697061719, 0.032457322404657686, 0.04710095368489392], "isController": false}, {"data": ["addBook", 49, 15, 30.612244897959183, 1204.2857142857147, 521, 3109, 876.0, 2227.0, 3021.0, 3109.0, 0.2311495207185448, 85.6556391048381, 0.8347521584765831], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 183.01818181818174, 98, 419, 104.0, 413.8, 416.0, 419.0, 0.2577911516702523, 0.19158111955181836, 0.12461583991872548], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 644.6363636363636, 472, 969, 608.0, 819.0, 892.1999999999998, 969.0, 0.2577138439191247, 75.77642701719654, 0.12961194298666917], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 161.6, 94, 414, 106.0, 305.8, 326.5999999999996, 414.0, 0.25819414321794404, 0.4568826049911275, 0.12556707355716418], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 994.9090909090907, 633, 1605, 965.0, 1307.6, 1474.3999999999999, 1605.0, 0.2572269068698292, 231.45322295814452, 0.1291158497373947], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 104.56249999999999, 98, 112, 105.5, 108.5, 112.0, 112.0, 0.10560498455527101, 0.07889434881326399, 0.03753927185363149], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0f6d47b2-46e1-4e86-9f08-c08d1e24bb69", 1, 0, 0.0, 312.0, 312, 312, 312.0, 312.0, 312.0, 312.0, 3.205128205128205, 1.0235126201923077, 1.9124348958333333], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 153, 15, 9.803921568627452, 196.52287581699346, 92, 1658, 108.0, 346.79999999999995, 592.9999999999993, 1620.2000000000005, 0.6366299390832529, 1.5684822214327918, 0.29857469531223996], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 6, 0, 0.0, 104.66666666666667, 100, 109, 105.0, 109.0, 109.0, 109.0, 0.036610144671088356, 0.02835141086345026, 0.01301376236355094], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 21, 0, 0.0, 136.7142857142857, 101, 317, 106.0, 314.4, 316.8, 317.0, 0.10948733857134665, 0.08885154136014557, 0.03891932738278338], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ea7928b2-f447-4038-a17c-11de260a96a2", 3, 0, 0.0, 388.6666666666667, 357, 423, 386.0, 423.0, 423.0, 423.0, 0.05562766549230484, 0.03576322895419989, 0.03567268913406267], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 6, 0, 0.0, 204.16666666666666, 194, 212, 206.0, 212.0, 212.0, 212.0, 0.03798261662245912, 0.05886563728500256, 0.08542379500148764], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d0f32fa6-62eb-45ef-a0eb-a2d124d6bee3", 1, 0, 0.0, 207.0, 207, 207, 207.0, 207.0, 207.0, 207.0, 4.830917874396135, 0.8727732487922706, 3.330691425120773], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 323.6, 207, 593, 375.0, 486.80000000000007, 593.0, 593.0, 0.07657163276244927, 0.11867107538477245, 0.17221139673039126], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 8, 0, 0.0, 158.875, 101, 324, 105.5, 324.0, 324.0, 324.0, 0.06168746048147063, 0.051145169871844295, 0.02192796446802276], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bc17ec6b-6bda-4fa8-abba-3d0006ebb033", 1, 0, 0.0, 275.0, 275, 275, 275.0, 275.0, 275.0, 275.0, 3.6363636363636362, 1.1612215909090908, 2.169744318181818], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 119.77777777777777, 100, 292, 107.0, 168.7000000000002, 292.0, 292.0, 0.08494252222662665, 0.06594658708024237, 0.030194412197746195], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=69d3a8a9-856c-4be8-bff3-a735a43378d7", 1, 0, 0.0, 304.0, 304, 304, 304.0, 304.0, 304.0, 304.0, 3.289473684210526, 0.5942896792763158, 2.2679379111842106], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8bd1db1b-e53a-489b-be90-62c73a4bbddb", 1, 0, 0.0, 479.0, 479, 479, 479.0, 479.0, 479.0, 479.0, 2.08768267223382, 0.37716923277661796, 1.4393593423799582], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8ee4dbf4-075f-468d-acf8-0f723f1fe875", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 0.4221122955607477, 1.6108717873831777], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a87e152c-62f1-4b07-b23b-7dff9c092635", 1, 0, 0.0, 457.0, 457, 457, 457.0, 457.0, 457.0, 457.0, 2.1881838074398248, 0.3953261761487965, 1.5086501641137855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 139.8125, 94, 311, 102.0, 304.7, 311.0, 311.0, 0.1056370574797639, 0.07850566478720736, 0.053024851117772116], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/93feb28e-770b-41c1-b66d-be5d31d922c4", 3, 0, 0.0, 297.3333333333333, 201, 474, 217.0, 474.0, 474.0, 474.0, 0.05156056647875704, 0.0337527015588478, 0.03306455597758834], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 161.25, 92, 313, 102.0, 310.9, 313.0, 313.0, 0.1056279914177257, 0.028263739891071137, 0.060240963855421686], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 150.4375, 92, 309, 103.0, 309.0, 309.0, 309.0, 0.10576344683073222, 0.028506554028595792, 0.06217733885947343], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 168.31249999999997, 92, 400, 101.5, 336.30000000000007, 400.0, 400.0, 0.10562311033654163, 0.028468728957895987, 0.06219798391888145], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 18.75, 0.7081038552321007], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 6, 12.5, 0.47206923682140045], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 6, 12.5, 0.47206923682140045], "isController": false}, {"data": ["401/Unauthorized", 27, 56.25, 2.1243115656963023], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1271, 48, "401/Unauthorized", 27, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 6, "Test failed: code expected to contain /204/", 6, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 19, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 21, 12, "Test failed: code expected to contain /200/", 6, "Test failed: code expected to contain /204/", 6, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 6, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 29, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 153, 15, "401/Unauthorized", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
