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

    var data = {"OkPercent": 98.47272727272727, "KoPercent": 1.5272727272727273};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8129294191130544, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.41379310344827586, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/705f24ac-007f-448b-bc66-1b3c3e05f1e0"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/83703d25-2ef1-4375-8046-ab385f3a0358"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0496f597-6bbd-4520-8e6a-f8ce6f4a654b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/df667a72-bd5f-4df8-a5f5-284e42e0f2fd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6015a618-21b0-4a22-9386-f443257db659"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=986cd39e-0d94-4e64-86d2-5a6e647f37ba"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.78125, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0bfc149e-f4d8-44b0-b42e-bd737080ba06"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/19496124-2602-4ca2-b113-aadb51e9732d"], "isController": false}, {"data": [0.782608695652174, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=28310bad-2784-41ef-b0b8-f90c54f1e10d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c3d0be25-dfcb-4b2b-8bb0-9020935f5e8f"], "isController": false}, {"data": [0.021739130434782608, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/05a57c44-ca48-47b7-afb1-605d352d5cb6"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8c8a0bf5-c807-4f31-aa76-ba09f5a60528"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c487fec4-f9f0-47ae-a4f9-00990c18eb5c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2678ce53-c592-4e97-b88a-f7afaae6f9cc"], "isController": false}, {"data": [0.20833333333333334, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.925, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=83703d25-2ef1-4375-8046-ab385f3a0358"], "isController": false}, {"data": [0.20833333333333334, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5357142857142857, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.30434782608695654, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=705f24ac-007f-448b-bc66-1b3c3e05f1e0"], "isController": false}, {"data": [0.42063492063492064, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8103448275862069, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0496f597-6bbd-4520-8e6a-f8ce6f4a654b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/986cd39e-0d94-4e64-86d2-5a6e647f37ba"], "isController": false}, {"data": [0.9646739130434783, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0bfc149e-f4d8-44b0-b42e-bd737080ba06"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6015a618-21b0-4a22-9386-f443257db659"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/28310bad-2784-41ef-b0b8-f90c54f1e10d"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=19496124-2602-4ca2-b113-aadb51e9732d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/01bb4f80-67b3-457a-849d-28a3b0657ec5"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c487fec4-f9f0-47ae-a4f9-00990c18eb5c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2678ce53-c592-4e97-b88a-f7afaae6f9cc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/393fe61b-31fb-478d-b4d7-b7974b3f0ece"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8c8a0bf5-c807-4f31-aa76-ba09f5a60528"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ded73124-2efb-4713-994b-4e2db52b3c2e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=05a57c44-ca48-47b7-afb1-605d352d5cb6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1375, 21, 1.5272727272727273, 306.62472727272734, 78, 2366, 98.0, 874.4000000000001, 1042.2, 1685.8400000000001, 5.419680337399736, 767.4204500243885, 3.958445216885753], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 1359.4655172413795, 1006, 1735, 1369.0, 1594.4, 1715.6499999999999, 1735.0, 0.2588546129677235, 311.48857894675183, 1.2727861096606328], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/705f24ac-007f-448b-bc66-1b3c3e05f1e0", 3, 0, 0.0, 815.3333333333333, 307, 1590, 549.0, 1590.0, 1590.0, 1590.0, 0.022246446130230697, 0.030668521927580402, 0.014266112915545075], "isController": false}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 630.8, 84, 1602, 538.0, 1518.6000000000001, 1602.0, 1602.0, 0.11224016402029302, 0.02198767275631912, 0.07557212085272594], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 630.8, 84, 1602, 538.0, 1518.6000000000001, 1602.0, 1602.0, 0.11292629677030791, 0.022122085089964615, 0.07603409903636225], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 93.57142857142857, 79, 243, 82.0, 165.5, 243.0, 243.0, 0.08973611173427855, 0.024011420522648753, 0.05117762622345574], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 93.64285714285714, 80, 245, 82.0, 164.5, 245.0, 245.0, 0.08973726211613284, 0.06668950827185263, 0.045043899148136994], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 139.0, 81, 244, 82.5, 243.5, 244.0, 244.0, 0.08973611173427855, 0.024186686365879766, 0.052842651734150356], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 126.64285714285712, 79, 243, 81.0, 242.5, 243.0, 243.0, 0.08973611173427855, 0.024186686365879766, 0.05275501881253485], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 203.8, 80, 415, 195.0, 350.20000000000005, 415.0, 415.0, 0.11242186680257221, 0.24131178050005248, 0.07266434203228757], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/83703d25-2ef1-4375-8046-ab385f3a0358", 3, 0, 0.0, 351.3333333333333, 169, 576, 309.0, 576.0, 576.0, 576.0, 0.030112621203300344, 0.025103653288298233, 0.01931050252946018], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 83.23529411764704, 81, 88, 83.0, 87.2, 88.0, 88.0, 0.09879470460383323, 0.07342067402687215, 0.049590310709345976], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 100.41176470588235, 79, 246, 82.0, 242.0, 246.0, 246.0, 0.09879585289878655, 0.02643560907643312, 0.05634450985633921], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 514.6666666666666, 473, 645, 478.5, 645.0, 645.0, 645.0, 0.08581481163648846, 25.232403941045224, 0.04894125976143482], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 890.1666666666666, 798, 962, 914.5, 962.0, 962.0, 962.0, 0.08523816965237033, 76.69745488592291, 0.04852915322981631], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 190.83333333333334, 81, 246, 243.0, 246.0, 246.0, 246.0, 0.08609433068832417, 0.15234660860082364, 0.047671372558867], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 83.93750000000001, 82, 90, 83.0, 88.6, 90.0, 90.0, 0.08737917099011523, 0.06493705969089618, 0.043860247938397684], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0496f597-6bbd-4520-8e6a-f8ce6f4a654b", 1, 0, 0.0, 348.0, 348, 348, 348.0, 348.0, 348.0, 348.0, 2.8735632183908044, 0.5191496048850575, 1.9811871408045978], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/df667a72-bd5f-4df8-a5f5-284e42e0f2fd", 1, 0, 0.0, 197.0, 197, 197, 197.0, 197.0, 197.0, 197.0, 5.076142131979695, 1.6209946065989846, 3.0288309010152283], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 101.875, 79, 243, 82.0, 242.3, 243.0, 243.0, 0.08738012539047993, 0.023381010114249513, 0.04983397776175809], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 101.87499999999999, 80, 241, 82.5, 240.3, 241.0, 241.0, 0.08738012539047993, 0.023551674421652794, 0.05136995652838762], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 111.8125, 78, 243, 82.5, 242.3, 243.0, 243.0, 0.08730383918632821, 0.023531112905690026, 0.05141036623960538], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 136.16666666666666, 81, 243, 84.5, 243.0, 243.0, 243.0, 0.0860980369647572, 0.06398496692400413, 0.04834606567845253], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6015a618-21b0-4a22-9386-f443257db659", 3, 0, 0.0, 426.0, 196, 630, 452.0, 630.0, 630.0, 630.0, 0.018046198267564966, 0.024878141166385946, 0.011572594592155918], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=986cd39e-0d94-4e64-86d2-5a6e647f37ba", 1, 0, 0.0, 474.0, 474, 474, 474.0, 474.0, 474.0, 474.0, 2.109704641350211, 0.3811478111814346, 1.4545424578059072], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 590.9375000000001, 82, 1022, 760.5, 986.3000000000001, 1022.0, 1022.0, 0.10650265258169087, 59.905310925341645, 0.056891553674008694], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 91.17647058823528, 80, 244, 81.0, 116.79999999999988, 244.0, 244.0, 0.09870292741270598, 0.026603523404205905, 0.05802652568598534], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 429.5625, 82, 766, 479.5, 705.8000000000001, 766.0, 766.0, 0.1065019436604718, 19.582706871705096, 0.05699518078704936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 109.1764705882353, 80, 243, 81.0, 243.0, 243.0, 243.0, 0.09870808535346204, 0.026604913630425317, 0.05812595260560314], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 514.0714285714286, 84, 1007, 467.0, 993.0, 1007.0, 1007.0, 0.1316148198287127, 0.02592635680777656, 0.0894018635248329], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/0bfc149e-f4d8-44b0-b42e-bd737080ba06", 3, 0, 0.0, 442.0, 175, 712, 439.0, 712.0, 712.0, 712.0, 0.019693697360388097, 0.027149351667071484, 0.012629096289050961], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 217.3125, 165, 327, 170.0, 326.3, 327.0, 327.0, 0.08726384222697325, 0.1352419117326236, 0.19625842641476504], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/19496124-2602-4ca2-b113-aadb51e9732d", 3, 0, 0.0, 660.6666666666666, 222, 954, 806.0, 954.0, 954.0, 954.0, 0.020347535913400886, 0.028050720896241135, 0.013048387288216065], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 504.34782608695645, 99, 1630, 334.0, 1067.6000000000004, 1535.5999999999985, 1630.0, 0.10583958400441765, 0.06501279134646358, 0.04785520253324743], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 94.50000000000001, 80, 245, 84.0, 141.4000000000001, 245.0, 245.0, 0.1065019436604718, 0.07914841711486234, 0.05345898343894776], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=28310bad-2784-41ef-b0b8-f90c54f1e10d", 1, 0, 0.0, 205.0, 205, 205, 205.0, 205.0, 205.0, 205.0, 4.878048780487805, 0.8812881097560976, 3.363185975609756], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 152.4375, 78, 247, 85.0, 246.3, 247.0, 247.0, 0.10650052584634637, 0.1284714595231439, 0.05514834358400894], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c3d0be25-dfcb-4b2b-8bb0-9020935f5e8f", 1, 0, 0.0, 208.0, 208, 208, 208.0, 208.0, 208.0, 208.0, 4.807692307692308, 1.5352689302884617, 2.86865234375], "isController": false}, {"data": ["login", 23, 0, 0.0, 2539.0434782608695, 1481, 3929, 2485.0, 3718.6000000000004, 3920.2, 3929.0, 0.1053267878077374, 33.015583212741795, 0.2044776120470948], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 104.88235294117646, 83, 250, 85.0, 246.8, 250.0, 250.0, 0.10307965632029882, 0.08345022957961691, 0.03664159658260622], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/05a57c44-ca48-47b7-afb1-605d352d5cb6", 3, 0, 0.0, 305.0, 195, 458, 262.0, 458.0, 458.0, 458.0, 0.0398416956625674, 0.025614371397646683, 0.025549524887779222], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 690.5000000000001, 168, 1106, 863.0, 1071.0, 1106.0, 1106.0, 0.10644030362096607, 79.64911548523474, 0.22236564406362472], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8c8a0bf5-c807-4f31-aa76-ba09f5a60528", 1, 0, 0.0, 443.0, 443, 443, 443.0, 443.0, 443.0, 443.0, 2.257336343115124, 0.40781955417607224, 1.5563275959367946], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c487fec4-f9f0-47ae-a4f9-00990c18eb5c", 1, 0, 0.0, 840.0, 840, 840, 840.0, 840.0, 840.0, 840.0, 1.1904761904761907, 0.21507626488095238, 0.8207775297619048], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 268.2857142857143, 163, 489, 322.0, 408.5, 489.0, 489.0, 0.08968839688396885, 0.1389994979051353, 0.20171130666384787], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, 40.0, 649.4000000000001, 80, 1206, 885.0, 1204.5, 1206.0, 1206.0, 0.1415748789534785, 101.63881770818585, 0.2290637299317609], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2678ce53-c592-4e97-b88a-f7afaae6f9cc", 1, 0, 0.0, 979.0, 979, 979, 979.0, 979.0, 979.0, 979.0, 1.021450459652707, 0.18453938968335037, 0.7042422114402451], "isController": false}, {"data": ["register", 24, 7, 29.166666666666668, 1141.5, 134, 2294, 1066.5, 2193.5, 2293.75, 2294.0, 0.09954871250331829, 0.031254795966617996, 0.04491357927395806], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 213.82352941176464, 164, 333, 167.0, 329.8, 333.0, 333.0, 0.09865424010120764, 0.1528948037506021, 0.22187569819636838], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 89.88235294117646, 83, 123, 85.0, 109.39999999999999, 123.0, 123.0, 0.08779041845044747, 0.06815760026182201, 0.0312067503085575], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 20, 0, 0.0, 359.65, 164, 1042, 323.5, 787.1000000000005, 1030.4499999999998, 1042.0, 0.12409411297528046, 15.019059595422167, 0.2759155043184751], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 93.44444444444446, 81, 172, 84.0, 172.0, 172.0, 172.0, 0.043466081967371464, 0.03230243005582977, 0.021817935675028252], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 155.8888888888889, 80, 245, 106.0, 245.0, 245.0, 245.0, 0.04343293954134816, 0.040614699757740715, 0.02314915354026716], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 455.3333333333333, 81, 965, 116.0, 965.0, 965.0, 965.0, 0.043299415457891316, 17.322434810324506, 0.02380152329749104], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 260.1111111111111, 80, 480, 104.0, 480.0, 480.0, 480.0, 0.04338394793926247, 5.67597237286093, 0.023890357616293083], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 85.0, 84, 86, 85.0, 86.0, 86.0, 86.0, 0.7291286912139993, 0.2150360007291287, 0.45072115384615385], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 932.8965517241377, 638, 1383, 897.0, 1217.4, 1361.95, 1383.0, 0.24728624662113188, 295.8403215680506, 0.4882937408866491], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=83703d25-2ef1-4375-8046-ab385f3a0358", 1, 0, 0.0, 525.0, 525, 525, 525.0, 525.0, 525.0, 525.0, 1.9047619047619047, 0.3441220238095238, 1.3132440476190477], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, 29.166666666666668, 1141.5, 134, 2294, 1066.5, 2193.5, 2293.75, 2294.0, 0.09839937024403043, 0.030893942903765417, 0.04439502837181842], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 12, 0, 0.0, 82.58333333333331, 80, 85, 82.0, 85.0, 85.0, 85.0, 0.06414299611934873, 0.017288541922793214, 0.0377717057226243], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 12, 0, 0.0, 83.16666666666667, 80, 93, 82.0, 90.9, 93.0, 93.0, 0.06414402471683085, 0.017288819161958315, 0.03770967078079314], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 142.05882352941177, 80, 878, 82.0, 373.19999999999953, 878.0, 878.0, 0.0849762066621346, 4.519305883415144, 0.0495271480235534], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 127.17647058823532, 80, 470, 82.0, 285.99999999999983, 470.0, 470.0, 0.0849749323949435, 1.4912885854922797, 0.04960938866784299], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 12, 0, 0.0, 97.58333333333334, 80, 245, 83.0, 199.40000000000015, 245.0, 245.0, 0.06414402471683085, 0.017163537863683256, 0.0365821390963176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 97.11764705882354, 81, 248, 83.0, 173.59999999999994, 248.0, 248.0, 0.08497365816596854, 0.06314936900810748, 0.04265279325908968], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 12, 0, 0.0, 83.58333333333333, 82, 88, 83.0, 87.10000000000001, 88.0, 88.0, 0.06414333898151069, 0.047669024379814094, 0.0321969494497036], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 122.94117647058822, 79, 245, 83.0, 242.6, 245.0, 245.0, 0.08497663142635775, 0.030245588713103896, 0.048043428682112414], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 12, 0, 0.0, 88.41666666666667, 83, 99, 87.0, 98.10000000000001, 99.0, 99.0, 0.06245803600705776, 0.04916130568524273, 0.022201879986883815], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 586.4999999999999, 81, 1590, 554.0, 1214.5, 1590.0, 1590.0, 0.1334553496530161, 0.025767606573629222, 0.09081964224433768], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1496.9130434782605, 1058, 2366, 1350.0, 1962.4, 2290.799999999999, 2366.0, 0.10442204667211478, 0.054046567125215654, 0.048030062482974666], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 12, 0, 0.0, 182.33333333333334, 165, 328, 169.0, 283.90000000000015, 328.0, 328.0, 0.06411455133171265, 0.09936503219084765, 0.14419512862981862], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=705f24ac-007f-448b-bc66-1b3c3e05f1e0", 1, 0, 0.0, 433.0, 433, 433, 433.0, 433.0, 433.0, 433.0, 2.3094688221709005, 0.417238019630485, 1.5922704965357968], "isController": false}, {"data": ["addBook", 63, 6, 9.523809523809524, 852.888888888889, 420, 1719, 710.0, 1477.2, 1578.3999999999999, 1719.0, 0.29068560275736055, 94.96657007426325, 1.0563487408237937], "isController": true}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 142.62068965517236, 80, 345, 84.0, 335.2, 341.15, 345.0, 0.24821435449289378, 0.18446398805575406, 0.11998643112693595], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 524.9137931034484, 391, 740, 479.0, 722.5, 732.3, 740.0, 0.24784100572170875, 72.87348477807548, 0.1246465995573047], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0496f597-6bbd-4520-8e6a-f8ce6f4a654b", 3, 0, 0.0, 295.6666666666667, 190, 461, 236.0, 461.0, 461.0, 461.0, 0.06658085134715255, 0.030082754449820233, 0.04269670480269874], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 121.15517241379311, 80, 251, 86.0, 245.1, 248.1, 251.0, 0.24834933331049663, 0.4394619062095897, 0.12077926561389386], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 788.9137931034483, 552, 1047, 788.5, 1001.3000000000001, 1039.4, 1047.0, 0.2476854224317584, 222.8677784886278, 0.12432647180656622], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 20, 0, 0.0, 114.19999999999999, 82, 291, 86.0, 251.9, 289.04999999999995, 291.0, 0.13065746838089265, 0.09761031573377234, 0.046444646963520436], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/986cd39e-0d94-4e64-86d2-5a6e647f37ba", 3, 0, 0.0, 444.6666666666667, 190, 596, 548.0, 596.0, 596.0, 596.0, 0.02392001148160551, 0.028272643779202345, 0.0153393302795452], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 184, 6, 3.260869565217391, 140.9184782608695, 81, 532, 89.0, 254.5, 316.0, 453.8000000000005, 0.7714949391609155, 1.6468339422657634, 0.3723539151795822], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 88.33333333333333, 82, 108, 86.0, 108.0, 108.0, 108.0, 0.04450334269551802, 0.03446401441166581, 0.01581954759879742], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0bfc149e-f4d8-44b0-b42e-bd737080ba06", 1, 0, 0.0, 754.0, 754, 754, 754.0, 754.0, 754.0, 754.0, 1.3262599469496021, 0.2396075099469496, 0.9143940649867374], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 88.28571428571429, 84, 108, 86.5, 101.5, 108.0, 108.0, 0.08451044307618014, 0.06858220526982978, 0.030040821562235906], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6015a618-21b0-4a22-9386-f443257db659", 1, 0, 0.0, 559.0, 559, 559, 559.0, 559.0, 559.0, 559.0, 1.7889087656529516, 0.3231915250447227, 1.2333687388193202], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/28310bad-2784-41ef-b0b8-f90c54f1e10d", 3, 0, 0.0, 376.33333333333337, 170, 661, 298.0, 661.0, 661.0, 661.0, 0.0820411846747067, 0.03632031613203161, 0.05261104616183991], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 549.6666666666666, 163, 1054, 288.0, 1054.0, 1054.0, 1054.0, 0.04328171587958064, 23.050589826091663, 0.09241980108444743], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=19496124-2602-4ca2-b113-aadb51e9732d", 1, 0, 0.0, 1007.0, 1007, 1007, 1007.0, 1007.0, 1007.0, 1007.0, 0.9930486593843098, 0.1794082050645482, 0.684660501489573], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/01bb4f80-67b3-457a-849d-28a3b0657ec5", 2, 0, 0.0, 218.5, 209, 228, 218.5, 228.0, 228.0, 228.0, 0.03416525734980099, 0.029444179307811884, 0.02123651006166829], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 259.17647058823536, 163, 961, 171.0, 583.3999999999996, 961.0, 961.0, 0.08493757088539923, 6.101238246139088, 0.18974823036318306], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c487fec4-f9f0-47ae-a4f9-00990c18eb5c", 3, 0, 0.0, 417.33333333333337, 206, 839, 207.0, 839.0, 839.0, 839.0, 0.0238159503358049, 0.028149647027769398, 0.015272598359874887], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2678ce53-c592-4e97-b88a-f7afaae6f9cc", 3, 0, 0.0, 383.3333333333333, 256, 479, 415.0, 479.0, 479.0, 479.0, 0.03133290163557746, 0.03142469724583795, 0.020093039134794145], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 113.00000000000001, 82, 252, 95.5, 247.1, 252.0, 252.0, 0.08658430334810678, 0.07178718119388931, 0.030778014080772333], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/393fe61b-31fb-478d-b4d7-b7974b3f0ece", 1, 0, 0.0, 231.0, 231, 231, 231.0, 231.0, 231.0, 231.0, 4.329004329004329, 1.3824066558441557, 2.58302895021645], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 87.4375, 83, 93, 87.0, 93.0, 93.0, 93.0, 0.11084631158898187, 0.08605743917308652, 0.0394023998226459], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8c8a0bf5-c807-4f31-aa76-ba09f5a60528", 3, 0, 0.0, 332.6666666666667, 180, 560, 258.0, 560.0, 560.0, 560.0, 0.03241175898616018, 0.027020349857928457, 0.020784884506098812], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ded73124-2efb-4713-994b-4e2db52b3c2e", 1, 0, 0.0, 319.0, 319, 319, 319.0, 319.0, 319.0, 319.0, 3.134796238244514, 1.0010530956112853, 1.8704692398119123], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 20, 0, 0.0, 115.85000000000001, 81, 248, 84.0, 245.5, 247.9, 248.0, 0.12434949669541212, 0.09241207713399281, 0.062417618458439295], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=05a57c44-ca48-47b7-afb1-605d352d5cb6", 1, 0, 0.0, 460.0, 460, 460, 460.0, 460.0, 460.0, 460.0, 2.1739130434782608, 0.39274796195652173, 1.4988111413043477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 20, 0, 0.0, 153.9, 80, 250, 83.5, 245.70000000000002, 249.8, 250.0, 0.12422591725311653, 0.05189828847742504, 0.06980428983148754], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 20, 0, 0.0, 199.95, 79, 957, 82.5, 678.000000000001, 945.4499999999998, 957.0, 0.124351816158275, 11.219363307043286, 0.0720366185010632], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 20, 0, 0.0, 165.89999999999998, 78, 486, 82.0, 466.8000000000003, 485.8, 486.0, 0.1241580532017258, 3.6807770354160847, 0.0720456203246733], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 33.333333333333336, 0.509090909090909], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 9.523809523809524, 0.14545454545454545], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 9.523809523809524, 0.14545454545454545], "isController": false}, {"data": ["401/Unauthorized", 10, 47.61904761904762, 0.7272727272727273], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1375, 21, "401/Unauthorized", 10, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 184, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
