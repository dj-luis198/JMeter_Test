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

    var data = {"OkPercent": 98.81831610044313, "KoPercent": 1.1816838995568686};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.832382762991128, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.49166666666666664, 500, 1500, "see books"], "isController": true}, {"data": [0.7333333333333333, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7333333333333333, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eb14620b-e043-47c0-8cf1-14111067afcc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b0e07470-1668-4142-9f08-661ad887e988"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6636b5b0-51d0-4c27-ade0-52d6fe9031a1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ba1d7b1f-5492-48bb-a6c9-d13abba496ef"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.8157894736842105, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9b03cc94-dce7-4afe-8b31-f3052f00568b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.045454545454545456, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/eb14620b-e043-47c0-8cf1-14111067afcc"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2c139c44-347d-43d9-9658-79a79557b944"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2de2aea5-6411-4470-a331-951ef74b2594"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0b2ad557-b492-4068-a6d2-552578439e87"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1c0ba434-f276-4282-81e7-4521e889f9bc"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5e89a2e0-dbb6-4bd5-adb6-1ff3c4ef5396"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=97b9234d-b0b1-43a6-b9de-3bba4619f78c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/69d1ad0f-ac31-4ade-a3d5-1e9b733183af"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=554e76ba-300f-4805-8627-766cf5d0206a"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.3541666666666667, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6636b5b0-51d0-4c27-ade0-52d6fe9031a1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d8929b59-aaec-45f0-ad70-539db386cc81"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/554e76ba-300f-4805-8627-766cf5d0206a"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0b8d1bb6-7bbf-4483-a192-cb59bf38aa53"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/97b9234d-b0b1-43a6-b9de-3bba4619f78c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3541666666666667, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/71711447-c6ff-433f-bbf8-ea8a9e4a893d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.36363636363636365, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.4482758620689655, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.825, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/598d391a-3534-4bb4-b879-a99c809e3e6c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b0e07470-1668-4142-9f08-661ad887e988"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9b03cc94-dce7-4afe-8b31-f3052f00568b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2de2aea5-6411-4470-a331-951ef74b2594"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5e89a2e0-dbb6-4bd5-adb6-1ff3c4ef5396"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1c0ba434-f276-4282-81e7-4521e889f9bc"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2c139c44-347d-43d9-9658-79a79557b944"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0b2ad557-b492-4068-a6d2-552578439e87"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/0b8d1bb6-7bbf-4483-a192-cb59bf38aa53"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=69d1ad0f-ac31-4ade-a3d5-1e9b733183af"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d8929b59-aaec-45f0-ad70-539db386cc81"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1354, 16, 1.1816838995568686, 270.07163958641013, 76, 3825, 94.0, 632.5, 780.25, 1238.3500000000001, 5.463841395256869, 795.271892881571, 3.9902038499098103], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 60, 0, 0.0, 1142.783333333333, 936, 1515, 1109.0, 1360.4, 1436.55, 1515.0, 0.2705334920463154, 325.5425059545549, 1.3302110668488258], "isController": true}, {"data": ["deleteBook", 15, 1, 6.666666666666667, 558.1333333333333, 82, 951, 453.0, 941.4, 951.0, 951.0, 0.08502774738823103, 0.01600913056294037, 0.057521049681712795], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 1, 6.666666666666667, 558.1333333333333, 82, 951, 453.0, 941.4, 951.0, 951.0, 0.08217377013257368, 0.015471780157773639, 0.055590341500493044], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 129.33333333333334, 77, 323, 80.0, 263.6000000000001, 323.0, 323.0, 0.12138213794405632, 0.05273590281336822, 0.06809306132495346], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 88.77777777777779, 79, 238, 80.0, 97.60000000000022, 238.0, 238.0, 0.1213935985109052, 0.09021535983085825, 0.06093389612754421], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 157.2222222222222, 78, 539, 80.5, 402.2000000000002, 539.0, 539.0, 0.12138459359763704, 3.9947595994982774, 0.07032034995852694], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 182.83333333333331, 78, 690, 82.0, 551.4000000000002, 690.0, 690.0, 0.1213837750354036, 12.164785323521478, 0.07020133690741116], "isController": false}, {"data": ["goToProfile", 15, 1, 6.666666666666667, 328.40000000000003, 79, 1822, 203.0, 1048.0000000000005, 1822.0, 1822.0, 0.08590524079238994, 0.16253204444450808, 0.05553080311377863], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eb14620b-e043-47c0-8cf1-14111067afcc", 1, 0, 0.0, 385.0, 385, 385, 385.0, 385.0, 385.0, 385.0, 2.5974025974025974, 0.4692573051948052, 1.7907873376623376], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 81.04999999999998, 78, 91, 80.0, 89.30000000000001, 90.95, 91.0, 0.11670041253595832, 0.08672755267564872, 0.058578136761213456], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 98.79999999999998, 77, 317, 79.5, 216.90000000000032, 312.74999999999994, 317.0, 0.11670177445048052, 0.0399908717330797, 0.06606642446185894], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 477.8, 385, 540, 535.0, 540.0, 540.0, 540.0, 0.06153467478924374, 18.093237531536523, 0.035093994215740575], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 634.6, 541, 700, 695.0, 700.0, 700.0, 700.0, 0.06141676186264755, 55.26291028316198, 0.03496676969328469], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b0e07470-1668-4142-9f08-661ad887e988", 1, 0, 0.0, 386.0, 386, 386, 386.0, 386.0, 386.0, 386.0, 2.5906735751295336, 0.4680416126943005, 1.7861479922279793], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 142.0, 78, 239, 80.0, 239.0, 239.0, 239.0, 0.06188654957731486, 0.10951018343173294, 0.03426725938509524], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 92.0, 78, 232, 80.0, 172.79999999999995, 232.0, 232.0, 0.06693061354778589, 0.049740426669790096, 0.03359603062847846], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6636b5b0-51d0-4c27-ade0-52d6fe9031a1", 3, 0, 0.0, 262.0, 196, 348, 242.0, 348.0, 348.0, 348.0, 0.1048951048951049, 0.04746230332167832, 0.06726671765734266], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 114.76923076923077, 77, 236, 79.0, 234.4, 236.0, 236.0, 0.06693164734229874, 0.01790944469901353, 0.03817195512490475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 103.07692307692308, 77, 233, 79.0, 232.6, 233.0, 233.0, 0.06693199194756651, 0.018040263454617535, 0.03934869057854984], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ba1d7b1f-5492-48bb-a6c9-d13abba496ef", 1, 0, 0.0, 177.0, 177, 177, 177.0, 177.0, 177.0, 177.0, 5.649717514124294, 1.804157838983051, 3.3710716807909606], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 147.53846153846155, 79, 343, 81.0, 300.19999999999993, 343.0, 343.0, 0.06693164734229874, 0.018040170572728956, 0.039413850925201305], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 80.8, 79, 86, 79.0, 86.0, 86.0, 86.0, 0.06188501763723002, 0.04599072111516802, 0.03474988783340553], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 386.52631578947364, 78, 701, 541.0, 697.0, 701.0, 701.0, 0.10379053976543338, 49.16636181040746, 0.05632301186489749], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 125.55000000000003, 77, 691, 80.0, 236.0, 668.2499999999997, 691.0, 0.11670177445048052, 5.280305125906627, 0.06810642618321011], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 311.26315789473676, 77, 622, 384.0, 552.0, 622.0, 622.0, 0.10379053976543338, 16.075285355701105, 0.056424369813887175], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 110.05, 77, 383, 80.0, 233.9, 375.5499999999999, 383.0, 0.11670245541966204, 1.7456020497327513, 0.06822079083418915], "isController": false}, {"data": ["deleteBooks", 15, 1, 6.666666666666667, 485.8, 87, 1064, 404.0, 849.2000000000002, 1064.0, 1064.0, 0.08235332872154692, 0.015505587673353758, 0.05638736706800189], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9b03cc94-dce7-4afe-8b31-f3052f00568b", 1, 0, 0.0, 498.0, 498, 498, 498.0, 498.0, 498.0, 498.0, 2.008032128514056, 0.3627792419678715, 1.3844440261044177], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 252.38461538461536, 159, 466, 166.0, 449.59999999999997, 466.0, 466.0, 0.06690305746972637, 0.10368667207466381, 0.15046654428982403], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 400.9545454545454, 122, 695, 403.5, 631.3, 686.7499999999999, 695.0, 0.09820507898813058, 0.0603232369956388, 0.044403273019047326], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 81.0, 78, 88, 81.0, 83.0, 88.0, 88.0, 0.10378940583296462, 0.07713255648328718, 0.05209741659974981], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 129.63157894736844, 76, 244, 80.0, 243.0, 244.0, 244.0, 0.10379053976543338, 0.1098186704158723, 0.054605261360967106], "isController": false}, {"data": ["login", 22, 0, 0.0, 2309.590909090909, 1428, 4674, 2042.5, 4262.3, 4623.9, 4674.0, 0.09397291871342531, 25.68052361203067, 0.1772003545341933], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/eb14620b-e043-47c0-8cf1-14111067afcc", 3, 0, 0.0, 378.66666666666663, 203, 700, 233.0, 700.0, 700.0, 700.0, 0.03963116594890222, 0.033038872394250844, 0.0254145172263468], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2c139c44-347d-43d9-9658-79a79557b944", 3, 0, 0.0, 393.0, 254, 532, 393.0, 532.0, 532.0, 532.0, 0.030940274955910108, 0.025149045105764174, 0.019841257051804333], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 91.1, 79, 244, 82.5, 89.80000000000001, 236.2999999999999, 244.0, 0.11614941460695037, 0.09403111788004088, 0.041287487223564394], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2de2aea5-6411-4470-a331-951ef74b2594", 1, 0, 0.0, 706.0, 706, 706, 706.0, 706.0, 706.0, 706.0, 1.41643059490085, 0.2558981055240793, 0.9765625], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0b2ad557-b492-4068-a6d2-552578439e87", 1, 0, 0.0, 412.0, 412, 412, 412.0, 412.0, 412.0, 412.0, 2.4271844660194173, 0.43850500606796117, 1.6734299150485439], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1c0ba434-f276-4282-81e7-4521e889f9bc", 3, 0, 0.0, 283.3333333333333, 175, 457, 218.0, 457.0, 457.0, 457.0, 0.050164707456147685, 0.03257766646322091, 0.032169425028844706], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5e89a2e0-dbb6-4bd5-adb6-1ff3c4ef5396", 3, 0, 0.0, 366.3333333333333, 183, 502, 414.0, 502.0, 502.0, 502.0, 0.03359349629911649, 0.028005515632173614, 0.02154270433244124], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 485.7894736842104, 158, 786, 630.0, 783.0, 786.0, 786.0, 0.10374406884238, 65.3993043943121, 0.2193523725313007], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=97b9234d-b0b1-43a6-b9de-3bba4619f78c", 1, 0, 0.0, 689.0, 689, 689, 689.0, 689.0, 689.0, 689.0, 1.4513788098693758, 0.2622119920174166, 1.000657656023222], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/69d1ad0f-ac31-4ade-a3d5-1e9b733183af", 3, 0, 0.0, 290.0, 203, 431, 236.0, 431.0, 431.0, 431.0, 0.027335350074716623, 0.027415434108138643, 0.017529505093486896], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=554e76ba-300f-4805-8627-766cf5d0206a", 1, 0, 0.0, 404.0, 404, 404, 404.0, 404.0, 404.0, 404.0, 2.4752475247524752, 0.44718827351485146, 1.7065671410891088], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 303.44444444444446, 160, 770, 313.5, 633.2000000000003, 770.0, 770.0, 0.1213150551983501, 16.29323323156348, 0.2693915586625689], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, 28.571428571428573, 533.8571428571428, 79, 782, 622.0, 782.0, 782.0, 782.0, 0.08589905633750966, 73.41023471917144, 0.15461350793339143], "isController": false}, {"data": ["register", 24, 6, 25.0, 870.2916666666667, 209, 2105, 867.0, 1331.0, 1934.25, 2105.0, 0.10039824637729661, 0.03166858748033868, 0.045296865064756865], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6636b5b0-51d0-4c27-ade0-52d6fe9031a1", 1, 0, 0.0, 1064.0, 1064, 1064, 1064.0, 1064.0, 1064.0, 1064.0, 0.9398496240601504, 0.1697970512218045, 0.6479822603383458], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 83.25, 80, 96, 82.0, 89.0, 96.0, 96.0, 0.08068827095121385, 0.06264372598263185, 0.028682158814689298], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 235.20000000000005, 158, 771, 163.5, 389.9000000000002, 752.3499999999997, 771.0, 0.11664596200841018, 7.149195698753054, 0.2608472542998618], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d8929b59-aaec-45f0-ad70-539db386cc81", 1, 0, 0.0, 368.0, 368, 368, 368.0, 368.0, 368.0, 368.0, 2.717391304347826, 0.49093495244565216, 1.8735139266304348], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/554e76ba-300f-4805-8627-766cf5d0206a", 3, 0, 0.0, 678.3333333333334, 256, 1306, 473.0, 1306.0, 1306.0, 1306.0, 0.02441903056448659, 0.024490570693093485, 0.015659339261731308], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 20, 0, 0.0, 254.60000000000002, 159, 772, 164.5, 398.5, 753.3499999999997, 772.0, 0.11348934335065937, 6.955727496836484, 0.2537883274791747], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0b8d1bb6-7bbf-4483-a192-cb59bf38aa53", 1, 0, 0.0, 403.0, 403, 403, 403.0, 403.0, 403.0, 403.0, 2.4813895781637716, 0.44829792183622824, 1.710801799007444], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/97b9234d-b0b1-43a6-b9de-3bba4619f78c", 3, 0, 0.0, 299.3333333333333, 170, 404, 324.0, 404.0, 404.0, 404.0, 0.050461724781753044, 0.03244202683722729, 0.03235989512371533], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 79.625, 79, 81, 79.0, 81.0, 81.0, 81.0, 0.047097609796302835, 0.03500125103026021, 0.023640792417284822], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 79.25, 78, 82, 79.0, 82.0, 82.0, 82.0, 0.04709705525662008, 0.012602141738587796, 0.02686003932604114], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 78.875, 77, 81, 79.0, 81.0, 81.0, 81.0, 0.047097609796302835, 0.012694277640409748, 0.027688243259154595], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 98.25, 78, 233, 79.0, 233.0, 233.0, 233.0, 0.04709705525662008, 0.012694128174635881, 0.02773391046849796], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 87.0, 87, 87, 87.0, 87.0, 87.0, 87.0, 11.494252873563218, 3.3899066091954024, 7.105334051724139], "isController": false}, {"data": ["https://demoqa.com/books", 60, 0, 0.0, 731.8166666666665, 612, 1187, 630.0, 1019.0, 1098.75, 1187.0, 0.27494306387385614, 328.9274900676818, 0.5429051515165401], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, 25.0, 870.2916666666667, 209, 2105, 867.0, 1331.0, 1934.25, 2105.0, 0.09844457570387871, 0.031052341750344555, 0.0444154238038984], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/71711447-c6ff-433f-bbf8-ea8a9e4a893d", 1, 0, 0.0, 207.0, 207, 207, 207.0, 207.0, 207.0, 207.0, 4.830917874396135, 1.5426856884057971, 2.8825105676328504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 4, 0, 0.0, 117.0, 79, 231, 79.0, 231.0, 231.0, 231.0, 0.02656924609764198, 0.007161242112255065, 0.01564575722351378], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 4, 0, 0.0, 117.75, 78, 234, 79.5, 234.0, 234.0, 234.0, 0.02656924609764198, 0.007161242112255065, 0.015619810694121553], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 224.625, 78, 699, 83.5, 697.6, 699.0, 699.0, 0.08381922289102978, 14.159734186652313, 0.0479259326198222], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 181.25, 77, 541, 80.5, 436.0000000000001, 541.0, 541.0, 0.08381746651230283, 4.639315188379756, 0.048006781356900015], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 89.4375, 78, 235, 80.0, 128.6000000000001, 235.0, 235.0, 0.08382054022338174, 0.06229241319335303, 0.042073982104314664], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 4, 0, 0.0, 78.5, 78, 80, 78.0, 80.0, 80.0, 80.0, 0.026569422580023778, 0.007109396276295425, 0.01515287381516981], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 118.18750000000001, 77, 238, 80.0, 235.9, 238.0, 238.0, 0.08382054022338174, 0.046033765925902644, 0.04648397390561808], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 4, 0, 0.0, 118.25, 79, 235, 79.5, 235.0, 235.0, 235.0, 0.02656889313991179, 0.019745046561985228, 0.013336338939369786], "isController": false}, {"data": ["deleteAccount", 15, 1, 6.666666666666667, 447.20000000000005, 79, 857, 429.0, 762.8000000000001, 857.0, 857.0, 0.08221745969974184, 0.015330130506514363, 0.055957117428457104], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 4, 0, 0.0, 81.75, 81, 83, 81.5, 83.0, 83.0, 83.0, 0.028736251499673127, 0.022618572957750525, 0.010214839400274432], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1486.0454545454543, 728, 3825, 1133.5, 3312.6999999999994, 3778.7999999999993, 3825.0, 0.09575709037728294, 0.04956177529292965, 0.04404452106220729], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 4, 0, 0.0, 237.0, 158, 470, 160.0, 470.0, 470.0, 470.0, 0.026554958806620153, 0.041154999634869315, 0.05972272473793575], "isController": false}, {"data": ["addBook", 58, 6, 10.344827586206897, 823.4482758620686, 428, 1948, 708.0, 1228.4, 1350.6, 1948.0, 0.2898608667839437, 102.76818591919628, 1.0513703422357268], "isController": true}, {"data": ["https://demoqa.com/books-0", 60, 0, 0.0, 132.76666666666662, 77, 322, 80.0, 315.9, 318.95, 322.0, 0.2756339581036384, 0.20484125206725468, 0.13324102466923923], "isController": false}, {"data": ["https://demoqa.com/books-3", 60, 0, 0.0, 451.1499999999999, 381, 637, 391.5, 567.8, 620.9, 637.0, 0.27539105529852387, 80.97411410139898, 0.13850233738158182], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/598d391a-3534-4bb4-b879-a99c809e3e6c", 1, 0, 0.0, 156.0, 156, 156, 156.0, 156.0, 156.0, 156.0, 6.41025641025641, 2.0470252403846154, 3.8248697916666665], "isController": false}, {"data": ["https://demoqa.com/books-1", 60, 0, 0.0, 127.06666666666668, 78, 334, 81.0, 239.8, 269.8999999999999, 334.0, 0.275787257709403, 0.488014170868592, 0.13412309994070573], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b0e07470-1668-4142-9f08-661ad887e988", 3, 0, 0.0, 392.33333333333337, 159, 857, 161.0, 857.0, 857.0, 857.0, 0.04250797024442083, 0.026442946333687566, 0.02725934289762664], "isController": false}, {"data": ["https://demoqa.com/books-2", 60, 0, 0.0, 593.45, 532, 870, 544.5, 698.9, 778.9, 870.0, 0.2754049600433304, 247.80986715727002, 0.13824038033424982], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 20, 0, 0.0, 92.3, 80, 242, 82.0, 103.30000000000001, 235.0999999999999, 242.0, 0.11911142874158775, 0.08898461229229945, 0.04234039068548627], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 6, 3.409090909090909, 145.7670454545454, 78, 1068, 87.5, 275.20000000000005, 303.15, 1019.4899999999993, 0.755393985175393, 1.6965767320411518, 0.3602606967651111], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 102.5, 80, 236, 82.5, 236.0, 236.0, 236.0, 0.0462620281273131, 0.035825965141561805, 0.01644470531088083], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9b03cc94-dce7-4afe-8b31-f3052f00568b", 3, 0, 0.0, 331.3333333333333, 273, 412, 309.0, 412.0, 412.0, 412.0, 0.02521940885705639, 0.025293293843942296, 0.016172602685026394], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 95.27777777777777, 80, 240, 82.0, 141.00000000000017, 240.0, 240.0, 0.11619650119424181, 0.09429618407462398, 0.04130422503389065], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2de2aea5-6411-4470-a331-951ef74b2594", 3, 0, 0.0, 270.3333333333333, 187, 386, 238.0, 386.0, 386.0, 386.0, 0.027486371340876815, 0.02756689781941454, 0.017626351413257593], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 179.0, 158, 313, 159.0, 313.0, 313.0, 313.0, 0.04707488437231526, 0.07295687646373468, 0.10587251827093949], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5e89a2e0-dbb6-4bd5-adb6-1ff3c4ef5396", 1, 0, 0.0, 539.0, 539, 539, 539.0, 539.0, 539.0, 539.0, 1.8552875695732838, 0.3351837894248608, 1.2791338126159555], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 349.6875, 159, 779, 313.5, 778.3, 779.0, 779.0, 0.083781476962712, 18.898956552431493, 0.18440720350520753], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1c0ba434-f276-4282-81e7-4521e889f9bc", 1, 0, 0.0, 336.0, 336, 336, 336.0, 336.0, 336.0, 336.0, 2.976190476190476, 0.5376906622023809, 2.051943824404762], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2c139c44-347d-43d9-9658-79a79557b944", 1, 0, 0.0, 646.0, 646, 646, 646.0, 646.0, 646.0, 646.0, 1.5479876160990713, 0.2796657314241486, 1.067264899380805], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0b2ad557-b492-4068-a6d2-552578439e87", 3, 0, 0.0, 289.0, 200, 429, 238.0, 429.0, 429.0, 429.0, 0.017275831687330483, 0.023816128644480662, 0.011078576960950862], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0b8d1bb6-7bbf-4483-a192-cb59bf38aa53", 3, 0, 0.0, 1016.0, 446, 1822, 780.0, 1822.0, 1822.0, 1822.0, 0.03234640847044617, 0.026649986926659913, 0.020742976786060855], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 83.46153846153845, 80, 92, 82.0, 91.2, 92.0, 92.0, 0.06713454278794265, 0.05566135432320635, 0.023864232006651484], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 109.05263157894738, 80, 241, 84.0, 239.0, 241.0, 241.0, 0.1037962097994548, 0.08058397147516266, 0.03689630895214995], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=69d1ad0f-ac31-4ade-a3d5-1e9b733183af", 1, 0, 0.0, 364.0, 364, 364, 364.0, 364.0, 364.0, 364.0, 2.7472527472527473, 0.49632984203296704, 1.8941019917582418], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d8929b59-aaec-45f0-ad70-539db386cc81", 3, 0, 0.0, 301.3333333333333, 169, 479, 256.0, 479.0, 479.0, 479.0, 0.044601043664421754, 0.028674173579828433, 0.028601580735322537], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 20, 0, 0.0, 80.45000000000003, 79, 86, 80.0, 82.0, 85.8, 86.0, 0.11354153065337473, 0.08437998518283026, 0.056992526128744746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 20, 0, 0.0, 125.65, 77, 236, 80.0, 235.0, 235.95, 236.0, 0.11354281983593062, 0.03890837449260552, 0.06427809829969627], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 20, 0, 0.0, 149.24999999999997, 77, 688, 79.5, 316.8, 669.4499999999998, 688.0, 0.11354346443818693, 5.137403780784472, 0.06626325619947315], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 20, 0, 0.0, 125.89999999999998, 78, 540, 80.0, 236.8, 524.8499999999998, 540.0, 0.11354217524099328, 1.698331479993869, 0.0663733848625572], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 37.5, 0.4431314623338257], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 6.25, 0.07385524372230429], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 6.25, 0.07385524372230429], "isController": false}, {"data": ["401/Unauthorized", 8, 50.0, 0.5908419497784343], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1354, 16, "401/Unauthorized", 8, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
