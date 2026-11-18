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

    var data = {"OkPercent": 97.81818181818181, "KoPercent": 2.1818181818181817};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8154613466334164, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.45689655172413796, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6064bb0d-26c9-4a55-b22e-d7ed3e8d27d7"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=13ec1f9f-0cd1-4bdc-b406-209ec82dc11f"], "isController": false}, {"data": [0.8125, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/aac30181-4abb-47a5-b6a4-bb452dfabb69"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ca405078-9f7b-4f8b-8bc7-cf823a5c86ed"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f26657c4-c164-4602-acba-ebad89bf8408"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5856c32e-1f10-4182-a4be-c13244224f1d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cee74c0a-6a6a-459a-871a-6b078019fb00"], "isController": false}, {"data": [0.8260869565217391, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f26657c4-c164-4602-acba-ebad89bf8408"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fe35cb49-9fcf-477f-bba1-bb33e11c38d1"], "isController": false}, {"data": [0.06521739130434782, 500, 1500, "login"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/56e08a31-0e8b-43f0-882a-494fcc3ac67b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a61ffee9-1619-4ecb-a8c2-bee3f45777f0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=aac30181-4abb-47a5-b6a4-bb452dfabb69"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=54af0efa-b79f-4850-aa6f-1f7503227b75"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6bded60e-6948-4e23-aa11-83bc85bf89a5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8a630f52-05f6-417d-b7f8-af3c853adf25"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.35, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.32, 500, 1500, "register"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a47b59e8-dc93-48f4-bfa4-eb6668ee50f5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e515cc09-808c-4397-89da-6e6e2253c00d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ca405078-9f7b-4f8b-8bc7-cf823a5c86ed"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.925, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/821d494e-d01a-425a-9247-2f5c49735a00"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.32, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/54af0efa-b79f-4850-aa6f-1f7503227b75"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6064bb0d-26c9-4a55-b22e-d7ed3e8d27d7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/13ec1f9f-0cd1-4bdc-b406-209ec82dc11f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.43478260869565216, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3387096774193548, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5856c32e-1f10-4182-a4be-c13244224f1d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8017241379310345, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8956043956043956, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8a630f52-05f6-417d-b7f8-af3c853adf25"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=56e08a31-0e8b-43f0-882a-494fcc3ac67b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a61ffee9-1619-4ecb-a8c2-bee3f45777f0"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fe35cb49-9fcf-477f-bba1-bb33e11c38d1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cee74c0a-6a6a-459a-871a-6b078019fb00"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6bded60e-6948-4e23-aa11-83bc85bf89a5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a47b59e8-dc93-48f4-bfa4-eb6668ee50f5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1375, 30, 2.1818181818181817, 276.0392727272728, 79, 2183, 95.0, 705.4000000000001, 809.6000000000001, 1274.1600000000005, 5.385968279584634, 762.638002431275, 3.936178846462692], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 1239.758620689655, 969, 1624, 1222.0, 1464.9, 1536.4999999999998, 1624.0, 0.25395602182270366, 305.59379186990446, 1.2486997752708136], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6064bb0d-26c9-4a55-b22e-d7ed3e8d27d7", 3, 0, 0.0, 262.6666666666667, 184, 417, 187.0, 417.0, 417.0, 417.0, 0.019472806226105244, 0.026844835406105372, 0.012487444096818791], "isController": false}, {"data": ["deleteBook", 15, 1, 6.666666666666667, 662.4666666666667, 91, 1602, 498.0, 1432.2, 1602.0, 1602.0, 0.07743374252764385, 0.014579321835282943, 0.0523837251695799], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 1, 6.666666666666667, 662.4666666666667, 91, 1602, 498.0, 1432.2, 1602.0, 1602.0, 0.07748334108166745, 0.014588660313032699, 0.05241727846221396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 122.14285714285714, 81, 264, 88.5, 264.0, 264.0, 264.0, 0.06336533282641066, 0.023753159780212817, 0.0357579201008414], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 102.57142857142857, 81, 270, 90.0, 192.0, 270.0, 270.0, 0.06336418565706398, 0.0470899856299079, 0.03180585100364344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 154.14285714285714, 81, 398, 90.0, 331.0, 398.0, 398.0, 0.06336475923654518, 1.34666909282032, 0.03692446977274681], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 157.07142857142858, 81, 711, 89.0, 489.5, 711.0, 711.0, 0.06336504603017987, 4.0884289273316075, 0.03686275696789203], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=13ec1f9f-0cd1-4bdc-b406-209ec82dc11f", 1, 0, 0.0, 418.0, 418, 418, 418.0, 418.0, 418.0, 418.0, 2.3923444976076556, 0.4322106758373206, 1.6494093899521531], "isController": false}, {"data": ["goToProfile", 16, 2, 12.5, 307.0, 88, 1935, 190.0, 900.400000000001, 1935.0, 1935.0, 0.07677911608042612, 0.12755905393732905, 0.04962712642161332], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 90.8125, 81, 170, 85.5, 115.40000000000006, 170.0, 170.0, 0.09275738725629447, 0.06893395674027351, 0.04655986040013218], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 115.9375, 80, 264, 88.5, 247.9, 264.0, 264.0, 0.09275792500521764, 0.05094212702618093, 0.05144033853743942], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 553.1428571428571, 396, 619, 613.0, 619.0, 619.0, 619.0, 0.06694400612059485, 19.683760549658107, 0.03817900349065175], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aac30181-4abb-47a5-b6a4-bb452dfabb69", 3, 0, 0.0, 340.0, 179, 645, 196.0, 645.0, 645.0, 645.0, 0.04451699065143196, 0.029141819075530494, 0.028547679551862295], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 645.8571428571429, 558, 791, 617.0, 791.0, 791.0, 791.0, 0.06694464634099691, 60.23691045376516, 0.03811399298515742], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 116.42857142857143, 85, 286, 89.0, 286.0, 286.0, 286.0, 0.06728310809511909, 0.1190595623714412, 0.03725539286126223], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 87.37500000000001, 81, 91, 89.0, 91.0, 91.0, 91.0, 0.08092087960996136, 0.060137489632012306, 0.04061848839796889], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 105.0, 80, 240, 87.5, 239.3, 240.0, 240.0, 0.08086076282022125, 0.021636571301504516, 0.04611590379590743], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 94.6875, 80, 264, 81.5, 142.20000000000013, 264.0, 264.0, 0.08092333525526255, 0.021811367705519984, 0.047574070140300836], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 102.37500000000001, 80, 358, 85.0, 173.2000000000002, 358.0, 358.0, 0.08092251669026906, 0.021811147076674083, 0.047652614808820555], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ca405078-9f7b-4f8b-8bc7-cf823a5c86ed", 1, 0, 0.0, 184.0, 184, 184, 184.0, 184.0, 184.0, 184.0, 5.434782608695652, 0.9818699048913043, 3.7470278532608696], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 86.57142857142857, 81, 91, 88.0, 91.0, 91.0, 91.0, 0.06729022273063724, 0.050007675291030215, 0.037785037177848056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 491.5999999999999, 79, 800, 612.0, 797.6, 800.0, 800.0, 0.07723081200475743, 46.33521897187769, 0.04097858840096178], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 208.56250000000003, 80, 780, 86.0, 738.7, 780.0, 780.0, 0.09275738725629447, 15.669674593679165, 0.05303657249859415], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 406.8, 80, 623, 557.0, 615.8, 623.0, 623.0, 0.0772335955842979, 15.146433288194586, 0.04105548879855418], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 176.0, 81, 558, 89.5, 532.8000000000001, 558.0, 558.0, 0.09275308548935948, 5.133903662152683, 0.05312469203077083], "isController": false}, {"data": ["deleteBooks", 15, 1, 6.666666666666667, 388.3333333333334, 90, 659, 418.0, 609.8000000000001, 659.0, 659.0, 0.0779054850655185, 0.014668142109992158, 0.053341926200134], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f26657c4-c164-4602-acba-ebad89bf8408", 3, 0, 0.0, 265.0, 178, 428, 189.0, 428.0, 428.0, 428.0, 0.025901591221087348, 0.030766571082600176, 0.01661006989112698], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 213.37500000000003, 164, 450, 179.5, 377.20000000000005, 450.0, 450.0, 0.08082277585823684, 0.1252595168818573, 0.18177231718898385], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5856c32e-1f10-4182-a4be-c13244224f1d", 1, 0, 0.0, 178.0, 178, 178, 178.0, 178.0, 178.0, 178.0, 5.617977528089887, 1.014966643258427, 3.8733321629213484], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cee74c0a-6a6a-459a-871a-6b078019fb00", 3, 0, 0.0, 296.3333333333333, 213, 459, 217.0, 459.0, 459.0, 459.0, 0.05189772687956267, 0.033365237821333424, 0.03328076886482372], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 469.8695652173913, 111, 1245, 367.0, 990.8000000000002, 1202.3999999999994, 1245.0, 0.0980421410698529, 0.06022315110638425, 0.044329600893888564], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 103.53333333333335, 80, 336, 89.0, 193.2000000000001, 336.0, 336.0, 0.07723081200475743, 0.05739516399962929, 0.0387662474320755], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f26657c4-c164-4602-acba-ebad89bf8408", 1, 0, 0.0, 430.0, 430, 430, 430.0, 430.0, 430.0, 430.0, 2.3255813953488373, 0.42014898255813954, 1.6033793604651163], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 167.39999999999998, 81, 268, 91.0, 267.4, 268.0, 268.0, 0.07723120964669296, 0.0979971533863311, 0.039721781003181925], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fe35cb49-9fcf-477f-bba1-bb33e11c38d1", 1, 0, 0.0, 302.0, 302, 302, 302.0, 302.0, 302.0, 302.0, 3.3112582781456954, 0.5982253725165563, 2.282957367549669], "isController": false}, {"data": ["login", 23, 0, 0.0, 2005.782608695652, 1316, 3450, 1881.0, 2689.4, 3299.799999999998, 3450.0, 0.09591566094230881, 35.05331741124674, 0.19312230628164173], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/56e08a31-0e8b-43f0-882a-494fcc3ac67b", 3, 0, 0.0, 845.3333333333334, 193, 1935, 408.0, 1935.0, 1935.0, 1935.0, 0.02868343053829238, 0.028767464026197533, 0.018393996797016924], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 103.1875, 83, 268, 91.5, 153.90000000000012, 268.0, 268.0, 0.09300054637820997, 0.0752904813940782, 0.033058787970379325], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a61ffee9-1619-4ecb-a8c2-bee3f45777f0", 3, 0, 0.0, 317.3333333333333, 207, 428, 317.0, 428.0, 428.0, 428.0, 0.042873067139223134, 0.03574151202589533, 0.027493470789150255], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=aac30181-4abb-47a5-b6a4-bb452dfabb69", 1, 0, 0.0, 423.0, 423, 423, 423.0, 423.0, 423.0, 423.0, 2.3640661938534278, 0.4271018026004728, 1.6299128250591017], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=54af0efa-b79f-4850-aa6f-1f7503227b75", 1, 0, 0.0, 577.0, 577, 577, 577.0, 577.0, 577.0, 577.0, 1.7331022530329288, 0.3131092937608319, 1.1948927642980938], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 608.1999999999999, 161, 895, 702.0, 887.8, 895.0, 895.0, 0.07719504099056677, 61.60794998758447, 0.16044607315259402], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6bded60e-6948-4e23-aa11-83bc85bf89a5", 1, 0, 0.0, 323.0, 323, 323, 323.0, 323.0, 323.0, 323.0, 3.0959752321981426, 0.5593314628482972, 2.13452979876161], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8a630f52-05f6-417d-b7f8-af3c853adf25", 1, 0, 0.0, 399.0, 399, 399, 399.0, 399.0, 399.0, 399.0, 2.506265664160401, 0.45279213659147866, 1.727952694235589], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 307.3571428571429, 175, 793, 253.0, 664.0, 793.0, 793.0, 0.06333809877124089, 5.503606277653867, 0.14129132245426085], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 3, 30.0, 545.5, 88, 882, 677.0, 874.3000000000001, 882.0, 882.0, 0.09553379508000956, 80.01181111177455, 0.16961913362789588], "isController": false}, {"data": ["register", 25, 8, 32.0, 717.36, 112, 1645, 724.0, 1451.0000000000002, 1610.1999999999998, 1645.0, 0.09876153040867522, 0.030909272720090072, 0.044558424852351515], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a47b59e8-dc93-48f4-bfa4-eb6668ee50f5", 3, 0, 0.0, 437.33333333333337, 184, 927, 201.0, 927.0, 927.0, 927.0, 0.029359953024075163, 0.029445968511450378, 0.0188278344587982], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e515cc09-808c-4397-89da-6e6e2253c00d", 1, 0, 0.0, 211.0, 211, 211, 211.0, 211.0, 211.0, 211.0, 4.739336492890995, 1.5134404620853081, 2.827865817535545], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ca405078-9f7b-4f8b-8bc7-cf823a5c86ed", 3, 0, 0.0, 302.3333333333333, 196, 437, 274.0, 437.0, 437.0, 437.0, 0.07234145165179648, 0.03273262298046781, 0.04639083976368459], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 99.22222222222223, 83, 255, 91.0, 108.30000000000024, 255.0, 255.0, 0.0872481920235764, 0.06773663345580394, 0.031014005758380675], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 314.3125, 165, 870, 180.0, 822.4000000000001, 870.0, 870.0, 0.09270847819033051, 20.912659514714573, 0.2040559778137023], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 20, 0, 0.0, 308.55000000000007, 164, 806, 197.5, 756.4000000000005, 804.75, 806.0, 0.14083118565775207, 17.044740637366736, 0.31312933936090803], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/821d494e-d01a-425a-9247-2f5c49735a00", 1, 0, 0.0, 1173.0, 1173, 1173, 1173.0, 1173.0, 1173.0, 1173.0, 0.8525149190110827, 0.27223865089514065, 0.5086783354646206], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 99.58333333333333, 81, 241, 89.5, 196.90000000000015, 241.0, 241.0, 0.06448908522232612, 0.0479259705607326, 0.032370497855737916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 100.08333333333334, 79, 239, 89.0, 197.90000000000015, 239.0, 239.0, 0.06448735241800702, 0.017255404846224533, 0.036777943175894626], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 144.83333333333334, 80, 268, 90.0, 266.8, 268.0, 268.0, 0.06442607108343176, 0.01736483947170622, 0.037875483195533126], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 157.91666666666669, 81, 266, 90.0, 265.4, 266.0, 266.0, 0.06442607108343176, 0.01736483947170622, 0.03793839928057554], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 90.0, 90, 90, 90.0, 90.0, 90.0, 90.0, 11.11111111111111, 3.2769097222222223, 6.868489583333334], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 801.0344827586207, 636, 1260, 719.0, 1064.6, 1154.1999999999998, 1260.0, 0.25789239662072033, 308.52896426189415, 0.5092367441084926], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 8, 32.0, 717.36, 112, 1645, 724.0, 1451.0000000000002, 1610.1999999999998, 1645.0, 0.09918430824896056, 0.03104158897229187, 0.0447491703232615], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 133.0, 80, 348, 81.0, 348.0, 348.0, 348.0, 0.04239483725093033, 0.011426733477789816, 0.024964928576475576], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/54af0efa-b79f-4850-aa6f-1f7503227b75", 3, 0, 0.0, 420.6666666666667, 212, 593, 457.0, 593.0, 593.0, 593.0, 0.03585385966799326, 0.029889887568271725, 0.022992221206362864], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 116.66666666666669, 80, 264, 89.0, 264.0, 264.0, 264.0, 0.042430814200179155, 0.011436430389892036, 0.024944677879402195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 94.16666666666667, 79, 239, 88.0, 104.9000000000002, 239.0, 239.0, 0.08619121041189821, 0.02323122468133194, 0.05067100455855735], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6064bb0d-26c9-4a55-b22e-d7ed3e8d27d7", 1, 0, 0.0, 418.0, 418, 418, 418.0, 418.0, 418.0, 418.0, 2.3923444976076556, 0.4322106758373206, 1.6494093899521531], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 132.5, 80, 264, 89.0, 263.1, 264.0, 264.0, 0.08611574913525435, 0.023210885509111528, 0.05071073899273279], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/13ec1f9f-0cd1-4bdc-b406-209ec82dc11f", 3, 0, 0.0, 333.0, 181, 471, 347.0, 471.0, 471.0, 471.0, 0.0324833522819555, 0.026762814005738725, 0.020830795571436304], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 88.11111111111111, 80, 95, 90.0, 94.1, 95.0, 95.0, 0.08618625807996169, 0.06405052968637778, 0.04326146157529327], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 116.44444444444446, 80, 357, 88.0, 357.0, 357.0, 357.0, 0.042430814200179155, 0.011353557705907312, 0.02419882372353967], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 123.66666666666664, 80, 266, 89.0, 262.4, 266.0, 266.0, 0.08619079769583267, 0.023062772039705227, 0.049155689310904575], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 88.55555555555556, 80, 110, 89.0, 110.0, 110.0, 110.0, 0.0424322145372767, 0.031534096936394106, 0.021298982687656468], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 106.88888888888889, 83, 245, 91.0, 245.0, 245.0, 245.0, 0.04418132013784572, 0.03477553128037466, 0.015705078642749847], "isController": false}, {"data": ["deleteAccount", 15, 1, 6.666666666666667, 520.8666666666667, 89, 927, 437.0, 905.4, 927.0, 927.0, 0.07923930269413629, 0.014774828314844161, 0.05393018687268885], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1057.913043478261, 782, 2183, 891.0, 1578.0, 2063.5999999999985, 2183.0, 0.09522547736945829, 0.04928662402911415, 0.04379999984474107], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 247.0, 164, 468, 182.0, 468.0, 468.0, 468.0, 0.0423782684239522, 0.06567803905157435, 0.09530971892613468], "isController": false}, {"data": ["addBook", 62, 17, 27.419354838709676, 832.8548387096773, 414, 2079, 724.0, 1336.2, 1508.4499999999994, 2079.0, 0.2980640260757948, 93.21247255226938, 1.081852978717267], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/5856c32e-1f10-4182-a4be-c13244224f1d", 3, 0, 0.0, 693.3333333333334, 183, 1463, 434.0, 1463.0, 1463.0, 1463.0, 0.0804095526548554, 0.037273178053552763, 0.05156471963869308], "isController": false}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 151.7068965517241, 81, 367, 90.0, 358.0, 359.1, 367.0, 0.2588026362171979, 0.19233281851688241, 0.12510478996827437], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 493.8448275862068, 393, 713, 441.5, 621.2, 705.0, 713.0, 0.25851540840977366, 76.01211359189331, 0.13001507356546235], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 147.62068965517247, 80, 361, 90.5, 266.0, 355.1, 361.0, 0.2591263866612459, 0.4585322388966577, 0.1260204497629887], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 643.2586206896556, 551, 891, 616.0, 789.1, 803.7999999999997, 891.0, 0.25831622359496015, 232.43339206223195, 0.12966263567168898], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 20, 0, 0.0, 114.0, 82, 266, 91.0, 253.00000000000003, 265.4, 266.0, 0.1427134100655768, 0.10661695185563112, 0.05073015748424801], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 17, 9.340659340659341, 145.23076923076937, 82, 1717, 92.0, 268.0, 306.8999999999999, 1007.3499999999893, 0.7668097764033251, 1.67245488014384, 0.3675970072299207], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 119.75, 83, 267, 92.0, 266.4, 267.0, 267.0, 0.061294853786234206, 0.04746759673094113, 0.021788405056825437], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 89.28571428571429, 82, 95, 91.0, 93.5, 95.0, 95.0, 0.06562387208969846, 0.053255310260292406, 0.023327235781885], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8a630f52-05f6-417d-b7f8-af3c853adf25", 3, 0, 0.0, 427.0, 191, 891, 199.0, 891.0, 891.0, 891.0, 0.033017829627999117, 0.027525606014747964, 0.021173543088267664], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=56e08a31-0e8b-43f0-882a-494fcc3ac67b", 1, 0, 0.0, 450.0, 450, 450, 450.0, 450.0, 450.0, 450.0, 2.2222222222222223, 0.4014756944444444, 1.5321180555555556], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a61ffee9-1619-4ecb-a8c2-bee3f45777f0", 1, 0, 0.0, 576.0, 576, 576, 576.0, 576.0, 576.0, 576.0, 1.736111111111111, 0.31365288628472227, 1.196967230902778], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 261.25, 164, 504, 184.0, 460.50000000000017, 504.0, 504.0, 0.06439737473369003, 0.09980335322496686, 0.1448312050895392], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fe35cb49-9fcf-477f-bba1-bb33e11c38d1", 3, 0, 0.0, 422.66666666666663, 238, 758, 272.0, 758.0, 758.0, 758.0, 0.08307717869901138, 0.03759025989310737, 0.05327540430893634], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 243.83333333333331, 170, 361, 182.0, 356.5, 361.0, 361.0, 0.08607745057719714, 0.1334032363925897, 0.19359020378836425], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cee74c0a-6a6a-459a-871a-6b078019fb00", 1, 0, 0.0, 659.0, 659, 659, 659.0, 659.0, 659.0, 659.0, 1.5174506828528074, 0.27414880500758726, 1.0462111153262519], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 124.125, 82, 270, 92.0, 269.3, 270.0, 270.0, 0.08134876248195073, 0.06744638608122674, 0.028916942913505928], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6bded60e-6948-4e23-aa11-83bc85bf89a5", 3, 0, 0.0, 263.6666666666667, 181, 428, 182.0, 428.0, 428.0, 428.0, 0.0861153371415449, 0.03896494746964434, 0.05522370252892039], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 100.79999999999998, 83, 244, 91.0, 159.40000000000003, 244.0, 244.0, 0.0759759105712882, 0.05898520400798253, 0.0270070619608876], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a47b59e8-dc93-48f4-bfa4-eb6668ee50f5", 1, 0, 0.0, 398.0, 398, 398, 398.0, 398.0, 398.0, 398.0, 2.512562814070352, 0.4539298052763819, 1.7322942839195978], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 20, 0, 0.0, 95.70000000000002, 80, 269, 89.0, 93.9, 260.2499999999999, 269.0, 0.14092049265804235, 0.10472704581325216, 0.0707354816662439], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 20, 0, 0.0, 119.25, 79, 262, 88.5, 241.9, 261.0, 262.0, 0.14092446448703494, 0.05887449795659527, 0.0791874383455468], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 20, 0, 0.0, 182.35, 79, 716, 89.0, 527.9000000000005, 708.05, 716.0, 0.14092446448703494, 12.714593278783823, 0.08163710188838783], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 20, 0, 0.0, 181.79999999999998, 81, 699, 89.5, 584.1000000000007, 694.9, 699.0, 0.14092545747926635, 4.1778617996885545, 0.08177529964275396], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 26.666666666666668, 0.5818181818181818], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 6.666666666666667, 0.14545454545454545], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 3.3333333333333335, 0.07272727272727272], "isController": false}, {"data": ["401/Unauthorized", 19, 63.333333333333336, 1.3818181818181818], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1375, 30, "401/Unauthorized", 19, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 3, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 17, "401/Unauthorized", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
