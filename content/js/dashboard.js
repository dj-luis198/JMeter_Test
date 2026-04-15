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

    var data = {"OkPercent": 97.24292101341281, "KoPercent": 2.7570789865871834};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7715379706445438, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.13793103448275862, 500, 1500, "see books"], "isController": true}, {"data": [0.6333333333333333, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6333333333333333, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1ef56386-a1fa-4ff7-85ba-b967371718c3"], "isController": false}, {"data": [0.71875, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5de75553-088b-4b3b-b7ad-96e59fc9ed8c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9858aa91-4d2f-4493-9604-bfeefbc4ff41"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/84808bd5-c29d-41ae-bef4-46a246229085"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dba12745-5401-49f8-9c5c-a8826d843f68"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fc9f6994-6ab7-4efd-aed5-8efa54cd740f"], "isController": false}, {"data": [0.6, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/aa30e1dd-2294-41b5-be56-d06bfb418c65"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.020833333333333332, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fc9f6994-6ab7-4efd-aed5-8efa54cd740f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9858aa91-4d2f-4493-9604-bfeefbc4ff41"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bb4cbfd6-ef1d-4fa8-9d07-cf3430d72aee"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=84cb13e8-9cad-4775-a206-a5c5db24e219"], "isController": false}, {"data": [0.6842105263157895, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/85208794-28e0-4400-9057-34dd3b29b79f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/0e195064-2b71-42b1-96a4-6cd2c8289fff"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3a8cea77-88d9-45d8-8c0b-5a86c53a57f9"], "isController": false}, {"data": [0.34, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/fb524a8e-39a9-45b9-a9de-fa090925cf75"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.41379310344827586, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.34, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1ef56386-a1fa-4ff7-85ba-b967371718c3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4d014129-51e7-46b7-be09-edb724288a9a"], "isController": false}, {"data": [0.3125, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/dba12745-5401-49f8-9c5c-a8826d843f68"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.2631578947368421, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ccea04f2-2c35-4333-a1ff-f21a7c751920"], "isController": false}, {"data": [0.9913793103448276, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=84808bd5-c29d-41ae-bef4-46a246229085"], "isController": false}, {"data": [0.5172413793103449, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9244186046511628, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5de75553-088b-4b3b-b7ad-96e59fc9ed8c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/84cb13e8-9cad-4775-a206-a5c5db24e219"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ccea04f2-2c35-4333-a1ff-f21a7c751920"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3a8cea77-88d9-45d8-8c0b-5a86c53a57f9"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bb4cbfd6-ef1d-4fa8-9d07-cf3430d72aee"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c086d067-492c-43e5-8bf7-2760d3e6e48a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=85208794-28e0-4400-9057-34dd3b29b79f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1342, 37, 2.7570789865871834, 355.5588673621464, 99, 2191, 113.0, 1007.0, 1215.85, 1602.239999999998, 5.373373373373374, 789.0782931368869, 3.924580830830831], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 1685.637931034483, 1240, 2450, 1651.0, 2062.4, 2146.0499999999997, 2450.0, 0.24953320082259908, 300.27186901039653, 1.2269527989665885], "isController": true}, {"data": ["deleteBook", 15, 4, 26.666666666666668, 433.13333333333327, 104, 1238, 423.0, 978.8000000000002, 1238.0, 1238.0, 0.09476457321195045, 0.020007910867601255, 0.06320106041557425], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 4, 26.666666666666668, 433.13333333333327, 104, 1238, 423.0, 978.8000000000002, 1238.0, 1238.0, 0.09618467457518436, 0.020307740862455917, 0.06414816447579352], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 128.56250000000003, 100, 306, 103.0, 306.0, 306.0, 306.0, 0.07677727392691763, 0.020543918999976006, 0.04378703903644521], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 103.31250000000001, 101, 107, 103.0, 106.3, 107.0, 107.0, 0.07677432666516318, 0.057055920500184744, 0.038537113189349485], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 115.375, 101, 301, 103.0, 168.00000000000014, 301.0, 301.0, 0.07677616867724259, 0.02069357671378804, 0.045210966515993434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 116.625, 100, 316, 103.0, 173.90000000000015, 316.0, 316.0, 0.07677616867724259, 0.02069357671378804, 0.045135989788769565], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1ef56386-a1fa-4ff7-85ba-b967371718c3", 3, 0, 0.0, 284.6666666666667, 195, 427, 232.0, 427.0, 427.0, 427.0, 0.016584022952287763, 0.022862414454081607, 0.010634936593752246], "isController": false}, {"data": ["goToProfile", 16, 4, 25.0, 216.31250000000003, 102, 535, 199.5, 411.10000000000014, 535.0, 535.0, 0.08931661623999375, 0.14123626059239244, 0.05771999101251549], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5de75553-088b-4b3b-b7ad-96e59fc9ed8c", 1, 0, 0.0, 595.0, 595, 595, 595.0, 595.0, 595.0, 595.0, 1.680672268907563, 0.3036370798319328, 1.1587447478991597], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 13, 0, 0.0, 103.38461538461539, 101, 108, 103.0, 106.8, 108.0, 108.0, 0.07914571334640252, 0.05881824985997297, 0.039727438144580955], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 13, 0, 0.0, 148.6923076923077, 101, 304, 103.0, 302.8, 304.0, 304.0, 0.07914667705720478, 0.02117791944694737, 0.0451383392591871], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 705.375, 598, 813, 703.0, 813.0, 813.0, 813.0, 0.06376127777600663, 18.747932739822105, 0.03636385373162878], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 1002.625, 699, 1203, 1003.0, 1203.0, 1203.0, 1203.0, 0.06355965868463286, 57.19109261039518, 0.03618679786439547], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9858aa91-4d2f-4493-9604-bfeefbc4ff41", 1, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 2.277904328018223, 0.4115354498861048, 1.570508257403189], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 257.625, 101, 320, 306.5, 320.0, 320.0, 320.0, 0.06391409945033875, 0.11309799629298223, 0.0353899359261153], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/84808bd5-c29d-41ae-bef4-46a246229085", 3, 0, 0.0, 273.3333333333333, 194, 393, 233.0, 393.0, 393.0, 393.0, 0.025350256037585978, 0.025424524365821096, 0.016256511847019654], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 106.625, 102, 132, 103.5, 122.9, 132.0, 132.0, 0.07288330926665725, 0.0541642562030529, 0.03658400484674007], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 165.50000000000003, 101, 305, 103.0, 305.0, 305.0, 305.0, 0.07288928573055564, 0.03318811471862458, 0.04080447562992288], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 260.5, 101, 1226, 103.5, 1139.2, 1226.0, 1226.0, 0.07289028190316525, 8.21554090568453, 0.042068512309346356], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 193.5, 101, 800, 103.0, 621.5000000000002, 800.0, 800.0, 0.07288928573055564, 2.6961739673638223, 0.04213911831297748], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 127.87500000000001, 101, 304, 103.0, 304.0, 304.0, 304.0, 0.06401792501900531, 0.04757582122994438, 0.03594756531828912], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 693.8947368421053, 102, 1402, 907.0, 1400.0, 1402.0, 1402.0, 0.1003401001288578, 47.53186252020005, 0.05445059504319905], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 13, 0, 0.0, 133.6923076923077, 101, 302, 103.0, 302.0, 302.0, 302.0, 0.07914667705720478, 0.021332502800574724, 0.046529589441833274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 448.42105263157885, 101, 916, 601.0, 813.0, 916.0, 916.0, 0.1003406300335349, 15.540956470650366, 0.05454887149797999], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 13, 0, 0.0, 118.07692307692308, 101, 304, 102.0, 225.59999999999994, 304.0, 304.0, 0.07914715892140688, 0.021332632678035444, 0.0466071648726644], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dba12745-5401-49f8-9c5c-a8826d843f68", 1, 0, 0.0, 399.0, 399, 399, 399.0, 399.0, 399.0, 399.0, 2.506265664160401, 0.45279213659147866, 1.727952694235589], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fc9f6994-6ab7-4efd-aed5-8efa54cd740f", 1, 0, 0.0, 1876.0, 1876, 1876, 1876.0, 1876.0, 1876.0, 1876.0, 0.5330490405117271, 0.0963028051705757, 0.36751232675906187], "isController": false}, {"data": ["deleteBooks", 15, 4, 26.666666666666668, 447.1333333333334, 104, 1876, 409.0, 1107.4000000000005, 1876.0, 1876.0, 0.09621305418719213, 0.020313732729756773, 0.06450534062628284], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 400.625, 207, 1330, 218.0, 1244.6000000000001, 1330.0, 1330.0, 0.07284912945290303, 10.992899842122277, 0.16150950794966124], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aa30e1dd-2294-41b5-be56-d06bfb418c65", 2, 0, 0.0, 277.0, 200, 354, 277.0, 354.0, 354.0, 354.0, 0.049193231011412826, 0.0302413466032074, 0.030577628455824478], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 516.9166666666669, 115, 1417, 402.5, 1162.5, 1360.25, 1417.0, 0.11165387299371947, 0.06858426378227495, 0.05048412421493371], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 104.42105263157896, 102, 112, 104.0, 106.0, 112.0, 112.0, 0.10033851044840753, 0.07456797505003723, 0.050365228877423306], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 177.57894736842107, 100, 307, 103.0, 306.0, 307.0, 307.0, 0.1003401001288578, 0.10616783003971356, 0.05278994988276051], "isController": false}, {"data": ["login", 24, 0, 0.0, 2532.208333333334, 1267, 4134, 2384.5, 3702.5, 4052.75, 4134.0, 0.11075270305815901, 44.31517767733123, 0.2283192931208727], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/fc9f6994-6ab7-4efd-aed5-8efa54cd740f", 3, 0, 0.0, 519.6666666666666, 324, 877, 358.0, 877.0, 877.0, 877.0, 0.021763417146670922, 0.02572362228501371, 0.01395635800095759], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 13, 0, 0.0, 112.15384615384615, 103, 166, 106.0, 151.2, 166.0, 166.0, 0.08044106454467263, 0.0651226977612633, 0.0285942846623641], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9858aa91-4d2f-4493-9604-bfeefbc4ff41", 3, 0, 0.0, 331.6666666666667, 208, 438, 349.0, 438.0, 438.0, 438.0, 0.03218435196807312, 0.026830769983800545, 0.020639053833692727], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bb4cbfd6-ef1d-4fa8-9d07-cf3430d72aee", 3, 0, 0.0, 445.3333333333333, 177, 751, 408.0, 751.0, 751.0, 751.0, 0.02095894143373132, 0.024772759227173966, 0.013440467000146712], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=84cb13e8-9cad-4775-a206-a5c5db24e219", 1, 0, 0.0, 409.0, 409, 409, 409.0, 409.0, 409.0, 409.0, 2.444987775061125, 0.441721424205379, 1.6857044621026895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 799.3684210526316, 205, 1506, 1013.0, 1504.0, 1506.0, 1506.0, 0.1002839619554317, 63.21808491775396, 0.21203645882815553], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/85208794-28e0-4400-9057-34dd3b29b79f", 3, 0, 0.0, 602.6666666666666, 181, 1200, 427.0, 1200.0, 1200.0, 1200.0, 0.07162297665090961, 0.044554527467411544, 0.0459300989590794], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 259.25, 203, 422, 208.0, 414.3, 422.0, 422.0, 0.07673640087095815, 0.11892643377169003, 0.1725819640681803], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 16, 8, 50.0, 625.4375, 101, 1412, 514.0, 1338.5, 1412.0, 1412.0, 0.1270143685004366, 75.99366416607128, 0.1852809696753195], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0e195064-2b71-42b1-96a4-6cd2c8289fff", 1, 0, 0.0, 596.0, 596, 596, 596.0, 596.0, 596.0, 596.0, 1.6778523489932886, 0.535798552852349, 1.0011404152684564], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3a8cea77-88d9-45d8-8c0b-5a86c53a57f9", 1, 0, 0.0, 455.0, 455, 455, 455.0, 455.0, 455.0, 455.0, 2.197802197802198, 0.39706387362637363, 1.5152815934065933], "isController": false}, {"data": ["register", 25, 8, 32.0, 776.2400000000001, 111, 1397, 841.0, 1351.2, 1390.1, 1397.0, 0.10104807058814019, 0.031624888341882, 0.04559004747238356], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 13, 0, 0.0, 284.6923076923077, 205, 413, 209.0, 411.4, 413.0, 413.0, 0.0790961139470786, 0.12258352815821656, 0.17788901408215044], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 125.0, 103, 373, 105.5, 200.1000000000002, 373.0, 373.0, 0.1086255473709223, 0.08433331070301098, 0.03861298754200754], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fb524a8e-39a9-45b9-a9de-fa090925cf75", 1, 0, 0.0, 572.0, 572, 572, 572.0, 572.0, 572.0, 572.0, 1.7482517482517483, 0.558279611013986, 1.0431463068181819], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 419.4117647058824, 204, 1293, 408.0, 828.9999999999995, 1293.0, 1293.0, 0.08374342983532101, 6.015460668912961, 0.18708055163521362], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 17, 0, 0.0, 115.11764705882354, 102, 304, 103.0, 144.79999999999984, 304.0, 304.0, 0.09137279563130539, 0.06790497800334318, 0.045864860307120094], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 17, 0, 0.0, 114.41176470588233, 100, 308, 103.0, 147.19999999999987, 308.0, 308.0, 0.09137426900584794, 0.0325226890372377, 0.0516604753880719], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 17, 0, 0.0, 202.2941176470588, 101, 1197, 103.0, 483.39999999999935, 1197.0, 1197.0, 0.09127418765972983, 4.854252613730322, 0.053197834788351266], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 17, 0, 0.0, 185.70588235294116, 100, 803, 103.0, 495.7999999999997, 803.0, 803.0, 0.09137377787572092, 1.6035867063246778, 0.05334511170444345], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 117.25, 104, 152, 106.5, 152.0, 152.0, 152.0, 0.16399491615759912, 0.04836568816366693, 0.10137576360132837], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 1154.120689655173, 806, 1993, 1105.0, 1617.2, 1727.8499999999997, 1993.0, 0.2541852923130862, 304.0939787119818, 0.5019166611885354], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 8, 32.0, 776.2400000000001, 111, 1397, 841.0, 1351.2, 1390.1, 1397.0, 0.10254138570326984, 0.03209224930682023, 0.04626378925284245], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 1, 0, 0.0, 105.0, 105, 105, 105.0, 105.0, 105.0, 105.0, 9.523809523809526, 2.5669642857142856, 5.608258928571429], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 1, 0, 0.0, 105.0, 105, 105, 105.0, 105.0, 105.0, 105.0, 9.523809523809526, 2.5669642857142856, 5.598958333333334], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1ef56386-a1fa-4ff7-85ba-b967371718c3", 1, 0, 0.0, 418.0, 418, 418, 418.0, 418.0, 418.0, 418.0, 2.3923444976076556, 0.4322106758373206, 1.6494093899521531], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 214.56249999999997, 101, 948, 103.0, 874.5000000000001, 948.0, 948.0, 0.10256476003051301, 11.56018277761396, 0.05919509099417304], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 215.31249999999997, 101, 801, 103.5, 663.8000000000002, 801.0, 801.0, 0.10256410256410256, 3.79384515224359, 0.05929487179487179], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 141.0625, 101, 308, 103.0, 305.9, 308.0, 308.0, 0.10256476003051301, 0.07622244373361368, 0.051482701812191105], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 1, 0, 0.0, 103.0, 103, 103, 103.0, 103.0, 103.0, 103.0, 9.70873786407767, 2.597845873786408, 5.537014563106797], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 152.5, 99, 306, 103.0, 304.6, 306.0, 306.0, 0.10256541750535263, 0.0467003182733112, 0.05741760311029629], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 1, 0, 0.0, 104.0, 104, 104, 104.0, 104.0, 104.0, 104.0, 9.615384615384617, 7.145808293269231, 4.826472355769231], "isController": false}, {"data": ["deleteAccount", 15, 4, 26.666666666666668, 371.4666666666667, 101, 877, 408.0, 668.8000000000002, 877.0, 877.0, 0.09460976625080418, 0.019285363159587756, 0.06437282988848662], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 1, 0, 0.0, 310.0, 310, 310, 310.0, 310.0, 310.0, 310.0, 3.225806451612903, 2.5390625, 1.1466733870967742], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4d014129-51e7-46b7-be09-edb724288a9a", 1, 0, 0.0, 222.0, 222, 222, 222.0, 222.0, 222.0, 222.0, 4.504504504504505, 1.4384501689189189, 2.68774634009009], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1364.25, 776, 2191, 1317.5, 1972.5, 2155.0, 2191.0, 0.11038999866612084, 0.05713544852836333, 0.05077508727709269], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dba12745-5401-49f8-9c5c-a8826d843f68", 3, 0, 0.0, 341.3333333333333, 199, 530, 295.0, 530.0, 530.0, 530.0, 0.030071570337403018, 0.025069430870471723, 0.019284177592670555], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 1, 0, 0.0, 210.0, 210, 210, 210.0, 210.0, 210.0, 210.0, 4.761904761904763, 7.380022321428572, 10.709635416666668], "isController": false}, {"data": ["addBook", 57, 13, 22.80701754385965, 1023.1228070175436, 517, 2012, 831.0, 1848.4, 1936.6999999999996, 2012.0, 0.26374602645789086, 89.67088356654035, 0.9555280675513727], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ccea04f2-2c35-4333-a1ff-f21a7c751920", 3, 0, 0.0, 285.0, 207, 430, 218.0, 430.0, 430.0, 430.0, 0.09699321047526673, 0.04388690187520207, 0.06219942208212092], "isController": false}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 171.32758620689657, 101, 734, 105.0, 414.0, 418.4499999999998, 734.0, 0.2549797994451991, 0.18949182361112943, 0.12325683664587263], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=84808bd5-c29d-41ae-bef4-46a246229085", 1, 0, 0.0, 553.0, 553, 553, 553.0, 553.0, 553.0, 553.0, 1.8083182640144664, 0.32669812386980107, 1.246750678119349], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 667.448275862069, 499, 1051, 606.0, 828.1000000000001, 924.3999999999999, 1051.0, 0.25505268157112454, 74.9939569279784, 0.12827356543860266], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 146.58620689655163, 101, 422, 105.0, 308.0, 310.25, 422.0, 0.2557262846939, 0.4525156522122528, 0.1243668845484006], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 981.2586206896551, 701, 1385, 930.5, 1262.9, 1314.2999999999997, 1385.0, 0.2550448307249869, 229.48978700733474, 0.12802054979750319], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 108.23529411764707, 102, 126, 106.0, 122.0, 126.0, 126.0, 0.0845586040866676, 0.06317122277959053, 0.03005794129643262], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 13, 7.558139534883721, 149.46511627906975, 102, 500, 109.0, 286.8000000000006, 317.35, 442.33000000000084, 0.705016272759319, 1.6356259043268324, 0.33505165038366], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 17, 0, 0.0, 143.76470588235296, 102, 310, 107.0, 310.0, 310.0, 310.0, 0.09158989278594903, 0.07092850095630623, 0.03255734470125532], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5de75553-088b-4b3b-b7ad-96e59fc9ed8c", 3, 0, 0.0, 305.0, 200, 424, 291.0, 424.0, 424.0, 424.0, 0.03133224714876551, 0.026120405256506662, 0.020092619428082048], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/84cb13e8-9cad-4775-a206-a5c5db24e219", 3, 0, 0.0, 475.6666666666667, 397, 535, 495.0, 535.0, 535.0, 535.0, 0.049086178968208515, 0.031557683418688746, 0.03147779054927435], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 106.8125, 103, 113, 106.0, 113.0, 113.0, 113.0, 0.07833997591045741, 0.06357472654452159, 0.027847413311920408], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ccea04f2-2c35-4333-a1ff-f21a7c751920", 1, 0, 0.0, 260.0, 260, 260, 260.0, 260.0, 260.0, 260.0, 3.8461538461538463, 0.6948617788461539, 2.6517427884615383], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3a8cea77-88d9-45d8-8c0b-5a86c53a57f9", 3, 0, 0.0, 297.6666666666667, 203, 402, 288.0, 402.0, 402.0, 402.0, 0.04646120489391358, 0.029870078016106555, 0.029794457565432867], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 17, 0, 0.0, 349.7647058823529, 205, 1301, 209.0, 839.3999999999996, 1301.0, 1301.0, 0.09122276061537801, 6.552716191235103, 0.20378917380350617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 394.31249999999994, 204, 1148, 209.0, 1080.1000000000001, 1148.0, 1148.0, 0.10249577204940297, 15.466564457829394, 0.2272373305616768], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bb4cbfd6-ef1d-4fa8-9d07-cf3430d72aee", 1, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 2.277904328018223, 0.4115354498861048, 1.570508257403189], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 131.31250000000003, 103, 310, 106.0, 307.2, 310.0, 310.0, 0.07275339781103214, 0.06031995580231083, 0.025861559378140334], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c086d067-492c-43e5-8bf7-2760d3e6e48a", 1, 0, 0.0, 221.0, 221, 221, 221.0, 221.0, 221.0, 221.0, 4.524886877828055, 1.4449589932126696, 2.699908088235294], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 133.36842105263156, 104, 323, 106.0, 312.0, 323.0, 323.0, 0.09501187648456057, 0.07376410332541568, 0.03377375296912114], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 115.11764705882352, 102, 303, 103.0, 145.39999999999986, 303.0, 303.0, 0.08386985372110807, 0.062329061212659416, 0.042098735168603074], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=85208794-28e0-4400-9057-34dd3b29b79f", 1, 0, 0.0, 395.0, 395, 395, 395.0, 395.0, 395.0, 395.0, 2.5316455696202533, 0.4573773734177215, 1.7454509493670884], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 185.1764705882353, 100, 305, 104.0, 304.2, 305.0, 305.0, 0.0837871805613741, 0.029822229478301585, 0.047370946179058133], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 225.35294117647055, 100, 1186, 103.0, 481.19999999999936, 1186.0, 1186.0, 0.0837888324272639, 4.456157531938332, 0.0488351041938775], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 221.70588235294122, 101, 811, 104.0, 489.39999999999975, 811.0, 811.0, 0.08387109506048586, 1.471916519275551, 0.048964955141298123], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 21.62162162162162, 0.5961251862891207], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 10.81081081081081, 0.29806259314456035], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 4, 10.81081081081081, 0.29806259314456035], "isController": false}, {"data": ["401/Unauthorized", 21, 56.75675675675676, 1.5648286140089418], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1342, 37, "401/Unauthorized", 21, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 16, 8, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
