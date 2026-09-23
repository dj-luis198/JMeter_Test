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

    var data = {"OkPercent": 98.43871975019516, "KoPercent": 1.56128024980484};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7719298245614035, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.027777777777777776, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e5fdc4c4-2b61-449d-b240-6f7e2bc1fcf5"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/34aa7cd1-7806-440a-8679-3f710e0ecb74"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7e7a521f-f668-4fc7-b653-5a6479d78f92"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3c8ab723-ef94-4526-abb9-3c1ea97a0b2e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/cb8e5603-d14f-45eb-b8a0-6b895b26877f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6764705882352942, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1ac9a437-84c7-4396-ad8e-7e1997267de0"], "isController": false}, {"data": [0.5952380952380952, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=345d0c4e-95b0-4493-8927-8885a26a62bf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bea140a6-52cd-4ff5-99c3-e92c142a0340"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7e95351f-e60f-477d-9050-f58e278d07dc"], "isController": false}, {"data": [0.6176470588235294, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9894f410-0adb-430d-9599-3efc236814a9"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=34aa7cd1-7806-440a-8679-3f710e0ecb74"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6afd6589-2dc9-4c1a-b093-982e0987e4f3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fc5fec97-31d0-4059-8304-1dbd4a042349"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fa57850b-5d0d-4684-99ae-f9aaa302b1bd"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9894f410-0adb-430d-9599-3efc236814a9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/68835196-9586-4209-8695-76d5dcb2bcb4"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cb8e5603-d14f-45eb-b8a0-6b895b26877f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.37962962962962965, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6363636363636364, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/7e7a521f-f668-4fc7-b653-5a6479d78f92"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1ac9a437-84c7-4396-ad8e-7e1997267de0"], "isController": false}, {"data": [0.2833333333333333, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3c8ab723-ef94-4526-abb9-3c1ea97a0b2e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9907407407407407, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4722222222222222, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8936781609195402, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3e21d3da-63fd-458a-801c-b32dffda8dda"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fc5fec97-31d0-4059-8304-1dbd4a042349"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/345d0c4e-95b0-4493-8927-8885a26a62bf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6afd6589-2dc9-4c1a-b093-982e0987e4f3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/bea140a6-52cd-4ff5-99c3-e92c142a0340"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1281, 20, 1.56128024980484, 400.7314597970325, 105, 3545, 133.0, 1090.7999999999995, 1367.199999999999, 1881.4800000000055, 5.114364537211893, 691.1023498915544, 3.750753892167157], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 1951.2222222222217, 1368, 4066, 1827.5, 2483.5, 2915.75, 4066.0, 0.2475837658407761, 297.9260041900114, 1.2173674423909255], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/e5fdc4c4-2b61-449d-b240-6f7e2bc1fcf5", 1, 0, 0.0, 310.0, 310, 310, 310.0, 310.0, 310.0, 310.0, 3.225806451612903, 1.0301159274193548, 1.924773185483871], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/34aa7cd1-7806-440a-8679-3f710e0ecb74", 3, 0, 0.0, 569.6666666666666, 244, 1049, 416.0, 1049.0, 1049.0, 1049.0, 0.023245722787007192, 0.02747565736966898, 0.014906925094532605], "isController": false}, {"data": ["deleteBook", 11, 1, 9.090909090909092, 488.8181818181818, 126, 771, 484.0, 746.2, 771.0, 771.0, 0.08669609079445145, 0.016563386664564944, 0.058549108902112235], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 11, 1, 9.090909090909092, 488.8181818181818, 126, 771, 484.0, 746.2, 771.0, 771.0, 0.0866339557851793, 0.016551515700435532, 0.05850714680911389], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7e7a521f-f668-4fc7-b653-5a6479d78f92", 1, 0, 0.0, 483.0, 483, 483, 483.0, 483.0, 483.0, 483.0, 2.070393374741201, 0.37404567805383027, 1.427439182194617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 157.2, 106, 351, 112.0, 348.6, 351.0, 351.0, 0.10925618390000874, 0.040174409288232384, 0.06169844655915858], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 115.86666666666667, 106, 137, 114.0, 134.0, 137.0, 137.0, 0.10924027033325565, 0.08118344308946049, 0.054833495069622464], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 223.0, 105, 873, 114.0, 555.6000000000001, 873.0, 873.0, 0.10925379656943078, 2.169100408791289, 0.0637100427000255], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 197.79999999999995, 105, 947, 112.0, 589.4000000000002, 947.0, 947.0, 0.10926175474378118, 6.581747425519904, 0.06360798248169866], "isController": false}, {"data": ["goToProfile", 12, 1, 8.333333333333334, 248.5, 111, 327, 245.0, 326.4, 327.0, 327.0, 0.07449668179363178, 0.1806035278834872, 0.04815487821344541], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/3c8ab723-ef94-4526-abb9-3c1ea97a0b2e", 3, 0, 0.0, 565.0, 217, 1027, 451.0, 1027.0, 1027.0, 1027.0, 0.014641431346328417, 0.02018439510146512, 0.009389199138107741], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 140.23529411764704, 110, 338, 114.0, 336.4, 338.0, 338.0, 0.10049716538877623, 0.07468588170005734, 0.05044486622053808], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 126.35294117647061, 105, 336, 113.0, 172.79999999999984, 336.0, 336.0, 0.10049894771690038, 0.026891319994561232, 0.05731580611979474], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 843.8333333333334, 660, 992, 874.5, 992.0, 992.0, 992.0, 0.04973433575650069, 14.623546047778119, 0.0283641133611293], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1194.8333333333333, 916, 1406, 1196.5, 1406.0, 1406.0, 1406.0, 0.0497083775185578, 44.72768546920566, 0.028300765716132027], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 185.33333333333331, 111, 334, 113.5, 334.0, 334.0, 334.0, 0.050100200400801605, 0.08865387024048096, 0.02774102893286573], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 147.30769230769232, 111, 336, 114.0, 330.8, 336.0, 336.0, 0.06300433760631982, 0.04682255949063416, 0.03162522415004725], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 197.3846153846154, 109, 343, 115.0, 342.6, 343.0, 343.0, 0.06293662282081944, 0.016840463528227077, 0.03589354270249859], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 129.84615384615384, 109, 338, 112.0, 250.39999999999992, 338.0, 338.0, 0.06300647512698229, 0.01698221399906944, 0.03704091604144857], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 165.6923076923077, 110, 345, 113.0, 344.2, 345.0, 345.0, 0.06293509938904542, 0.01696297600720365, 0.03706041497226014], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cb8e5603-d14f-45eb-b8a0-6b895b26877f", 3, 0, 0.0, 432.6666666666667, 246, 541, 511.0, 541.0, 541.0, 541.0, 0.019113636942837485, 0.026349691553683836, 0.01225711744055659], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 149.66666666666666, 108, 333, 114.0, 333.0, 333.0, 333.0, 0.05009769049646812, 0.037230803191222885, 0.028131027378387855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 798.4705882352941, 107, 1568, 1139.0, 1461.6, 1568.0, 1568.0, 0.0863456976986332, 45.711942102035216, 0.04639692418847742], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 191.76470588235293, 110, 360, 113.0, 343.2, 360.0, 360.0, 0.10049894771690038, 0.027087607001820804, 0.05908238918513088], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 553.3529411764706, 111, 1028, 664.0, 930.3999999999999, 1028.0, 1028.0, 0.08634394348027041, 14.943692320975991, 0.046480301835570656], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 166.52941176470588, 110, 342, 114.0, 339.6, 342.0, 342.0, 0.10049716538877623, 0.0270871266086936, 0.05917948313421101], "isController": false}, {"data": ["deleteBooks", 11, 1, 9.090909090909092, 550.6363636363637, 235, 1384, 483.0, 1233.0000000000005, 1384.0, 1384.0, 0.08649838798458756, 0.01652561531807816, 0.059076003086419755], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 365.0, 223, 680, 237.0, 674.4, 680.0, 680.0, 0.06289947212827622, 0.09748189674567807, 0.14146238702287123], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1ac9a437-84c7-4396-ad8e-7e1997267de0", 1, 0, 0.0, 594.0, 594, 594, 594.0, 594.0, 594.0, 594.0, 1.6835016835016834, 0.3041482533670034, 1.1606954966329968], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 789.2857142857142, 214, 1829, 802.0, 1648.6000000000004, 1822.6999999999998, 1829.0, 0.0888862552220675, 0.054599076694023876, 0.04018978141388403], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 113.6470588235294, 111, 116, 114.0, 116.0, 116.0, 116.0, 0.08634175080754931, 0.06416608629350101, 0.04333951163582066], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 179.35294117647055, 111, 338, 115.0, 337.2, 338.0, 338.0, 0.08633955824618963, 0.0993837355317755, 0.04497513293752571], "isController": false}, {"data": ["login", 21, 0, 0.0, 3119.523809523809, 1726, 5912, 2990.0, 4801.200000000001, 5822.299999999998, 5912.0, 0.09000321440051431, 30.886722516875604, 0.17843689729990359], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 165.82352941176472, 113, 567, 120.0, 474.99999999999994, 567.0, 567.0, 0.09764054494911205, 0.07904688648712294, 0.03470816246237967], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=345d0c4e-95b0-4493-8927-8885a26a62bf", 1, 0, 0.0, 563.0, 563, 563, 563.0, 563.0, 563.0, 563.0, 1.7761989342806395, 0.32089531527531084, 1.2246059058614567], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bea140a6-52cd-4ff5-99c3-e92c142a0340", 1, 0, 0.0, 443.0, 443, 443, 443.0, 443.0, 443.0, 443.0, 2.257336343115124, 0.40781955417607224, 1.5563275959367946], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7e95351f-e60f-477d-9050-f58e278d07dc", 1, 0, 0.0, 216.0, 216, 216, 216.0, 216.0, 216.0, 216.0, 4.62962962962963, 1.4784071180555556, 2.7624059606481484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 928.0588235294118, 226, 1685, 1255.0, 1576.1999999999998, 1685.0, 1685.0, 0.08628828408133432, 60.77905730208259, 0.18107751067183042], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9894f410-0adb-430d-9599-3efc236814a9", 3, 0, 0.0, 470.0, 229, 854, 327.0, 854.0, 854.0, 854.0, 0.017414119367983562, 0.02400676937611015, 0.011167257537411332], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 392.99999999999994, 219, 1056, 447.0, 708.6000000000001, 1056.0, 1056.0, 0.10914806298570888, 8.863149590149023, 0.24361478146738658], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, 25.0, 1036.875, 111, 1521, 1310.0, 1521.0, 1521.0, 1521.0, 0.06621365491098402, 59.415342479784144, 0.12294627744762913], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=34aa7cd1-7806-440a-8679-3f710e0ecb74", 1, 0, 0.0, 434.0, 434, 434, 434.0, 434.0, 434.0, 434.0, 2.304147465437788, 0.4162766417050691, 1.5886016705069124], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6afd6589-2dc9-4c1a-b093-982e0987e4f3", 3, 0, 0.0, 466.6666666666667, 249, 669, 482.0, 669.0, 669.0, 669.0, 0.020359964166463067, 0.024064788375139125, 0.013056357229144609], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fc5fec97-31d0-4059-8304-1dbd4a042349", 1, 0, 0.0, 235.0, 235, 235, 235.0, 235.0, 235.0, 235.0, 4.25531914893617, 0.7687832446808511, 2.9338430851063833], "isController": false}, {"data": ["register", 21, 6, 28.571428571428573, 1080.8571428571431, 228, 1952, 1014.0, 1666.2, 1925.9999999999995, 1952.0, 0.08787088837468147, 0.027606757898965217, 0.039644873465920744], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 135.73333333333332, 114, 341, 119.0, 228.20000000000007, 341.0, 341.0, 0.09845232938211318, 0.07643515806521482, 0.03499672646004805], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 347.6470588235294, 227, 699, 238.0, 683.0, 699.0, 699.0, 0.10042948373337744, 0.15564608465319338, 0.22586826273239088], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fa57850b-5d0d-4684-99ae-f9aaa302b1bd", 1, 0, 0.0, 350.0, 350, 350, 350.0, 350.0, 350.0, 350.0, 2.857142857142857, 0.9123883928571429, 1.7047991071428572], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9894f410-0adb-430d-9599-3efc236814a9", 1, 0, 0.0, 629.0, 629, 629, 629.0, 629.0, 629.0, 629.0, 1.589825119236884, 0.28722426470588236, 1.0961098966613672], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/68835196-9586-4209-8695-76d5dcb2bcb4", 1, 0, 0.0, 226.0, 226, 226, 226.0, 226.0, 226.0, 226.0, 4.424778761061947, 1.4129908738938053, 2.6401756084070795], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 403.4117647058824, 220, 1403, 443.0, 649.3999999999993, 1403.0, 1403.0, 0.09773316546224914, 7.0203717956456995, 0.2183332417084907], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cb8e5603-d14f-45eb-b8a0-6b895b26877f", 1, 0, 0.0, 436.0, 436, 436, 436.0, 436.0, 436.0, 436.0, 2.293577981651376, 0.4143671158256881, 1.581314506880734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 13, 0, 0.0, 147.46153846153845, 107, 328, 115.0, 325.6, 328.0, 328.0, 0.06675738824556449, 0.04961169185046345, 0.03350907964669936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 13, 0, 0.0, 111.69230769230768, 105, 117, 111.0, 116.6, 117.0, 117.0, 0.06675875951954234, 0.017863183699565043, 0.03807335503848899], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 13, 0, 0.0, 182.69230769230765, 109, 347, 113.0, 346.6, 347.0, 347.0, 0.06675841669576649, 0.01799347950003081, 0.0392466473152846], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 13, 0, 0.0, 207.3076923076923, 109, 450, 114.0, 408.4, 450.0, 450.0, 0.06675910234683921, 0.01799366430442151, 0.03931224483900786], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 373.0, 373, 373, 373.0, 373.0, 373.0, 373.0, 2.680965147453083, 0.7906752680965148, 1.6572763069705094], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1267.1296296296293, 859, 2014, 1127.5, 1786.0, 1995.25, 2014.0, 0.2434900236726412, 291.2987191410213, 0.4807976834629692], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 6, 28.571428571428573, 1080.8571428571431, 228, 1952, 1014.0, 1666.2, 1925.9999999999995, 1952.0, 0.09072371604340915, 0.02850304248462017, 0.04093198907427248], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 177.14285714285714, 106, 342, 114.0, 342.0, 342.0, 342.0, 0.031809651048127996, 0.00857369500906575, 0.018731659748067564], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 161.85714285714286, 110, 454, 114.0, 454.0, 454.0, 454.0, 0.03180849468570935, 0.008573383333257599, 0.01869991582109085], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 127.2666666666667, 108, 333, 113.0, 202.80000000000007, 333.0, 333.0, 0.10030962236770834, 0.027036577903796384, 0.058971086587266026], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 158.26666666666668, 109, 344, 114.0, 343.4, 344.0, 344.0, 0.10031230564490781, 0.02703730113085406, 0.059070625296757245], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 112.71428571428572, 109, 116, 113.0, 116.0, 116.0, 116.0, 0.031808639226413894, 0.00851129604300528, 0.018140864558814175], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 128.4, 109, 339, 114.0, 205.20000000000007, 339.0, 339.0, 0.10031163481214975, 0.07454800204301364, 0.050351738567817356], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 146.14285714285714, 109, 336, 117.0, 336.0, 336.0, 336.0, 0.03180892831176385, 0.023639252387941692, 0.015966590968990838], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 112.66666666666667, 108, 115, 113.0, 115.0, 115.0, 115.0, 0.10031029317355018, 0.026840840165578857, 0.05720821407554034], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 119.42857142857143, 115, 133, 118.0, 133.0, 133.0, 133.0, 0.03318951211417192, 0.02612377613674079, 0.01179783438433455], "isController": false}, {"data": ["deleteAccount", 11, 1, 9.090909090909092, 543.3636363636363, 114, 854, 536.0, 836.8000000000001, 854.0, 854.0, 0.08301824137176324, 0.015654362985939727, 0.05650016320631542], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1543.904761904762, 862, 3545, 1422.0, 2509.8, 3443.9999999999986, 3545.0, 0.08923259964306961, 0.04618484161213563, 0.04104351018738846], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 342.0, 227, 791, 232.0, 791.0, 791.0, 791.0, 0.031792458828765816, 0.049272101719972025, 0.07150198504164812], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7e7a521f-f668-4fc7-b653-5a6479d78f92", 3, 0, 0.0, 454.0, 230, 602, 530.0, 602.0, 602.0, 602.0, 0.03208899347523799, 0.02675127353192855, 0.020577902716868116], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1ac9a437-84c7-4396-ad8e-7e1997267de0", 3, 0, 0.0, 427.0, 214, 768, 299.0, 768.0, 768.0, 768.0, 0.020437777187353103, 0.02415676073153617, 0.013106256855171097], "isController": false}, {"data": ["addBook", 60, 10, 16.666666666666668, 1282.9999999999998, 571, 5264, 949.5, 2252.8, 3652.7999999999956, 5264.0, 0.2770390070921986, 67.30814633921811, 1.0119679408152336], "isController": true}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 203.75925925925927, 108, 481, 116.5, 459.0, 466.25, 481.0, 0.24444343850436828, 0.18166157881037526, 0.11816357623013897], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3c8ab723-ef94-4526-abb9-3c1ea97a0b2e", 1, 0, 0.0, 1384.0, 1384, 1384, 1384.0, 1384.0, 1384.0, 1384.0, 0.722543352601156, 0.1305376174132948, 0.49815977239884396], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 715.2037037037036, 525, 1013, 673.0, 899.5, 1002.75, 1013.0, 0.24431735920081077, 71.83741570485559, 0.12287445311368901], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 187.2037037037037, 105, 522, 118.0, 347.5, 447.0, 522.0, 0.2448180186061694, 0.43321313448669824, 0.11906188795495348], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1060.462962962963, 745, 1548, 1006.0, 1351.5, 1531.75, 1548.0, 0.24399611413596006, 219.54813239895623, 0.12247461197840183], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 136.88235294117646, 109, 339, 118.0, 212.59999999999988, 339.0, 339.0, 0.09445074116052181, 0.07056134471464764, 0.03357428689690424], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 10, 5.747126436781609, 251.2988505747127, 107, 3536, 120.0, 350.5, 683.75, 2674.25, 0.737394370375393, 1.485441427472602, 0.35689397519134114], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 13, 0, 0.0, 279.0, 115, 1961, 123.0, 1307.3999999999994, 1961.0, 1961.0, 0.06933851060879212, 0.053696717688254056, 0.024647673692969076], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 132.66666666666666, 111, 350, 117.0, 215.60000000000008, 350.0, 350.0, 0.1115332852500948, 0.09051187504182498, 0.039646597491244634], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 13, 0, 0.0, 356.84615384615387, 224, 780, 231.0, 733.1999999999999, 780.0, 780.0, 0.06671935785184198, 0.10340197354577461, 0.15005339954374222], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3e21d3da-63fd-458a-801c-b32dffda8dda", 2, 0, 0.0, 218.0, 211, 225, 218.0, 225.0, 225.0, 225.0, 0.02063280822836392, 0.028994737344351252, 0.012824982848978159], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 288.5333333333333, 225, 683, 230.0, 548.6000000000001, 683.0, 683.0, 0.10023454884429565, 0.1553439736483371, 0.22542984959805945], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 172.15384615384616, 108, 352, 120.0, 347.2, 352.0, 352.0, 0.06039713438826995, 0.0500753584918371, 0.021469293864580335], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fc5fec97-31d0-4059-8304-1dbd4a042349", 3, 0, 0.0, 311.0, 221, 451, 261.0, 451.0, 451.0, 451.0, 0.07121830785300541, 0.032224429660051276, 0.04567059455417339], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/345d0c4e-95b0-4493-8927-8885a26a62bf", 3, 0, 0.0, 972.3333333333334, 288, 2093, 536.0, 2093.0, 2093.0, 2093.0, 0.04742558135858482, 0.030490079161199553, 0.030412889087373732], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6afd6589-2dc9-4c1a-b093-982e0987e4f3", 1, 0, 0.0, 483.0, 483, 483, 483.0, 483.0, 483.0, 483.0, 2.070393374741201, 0.37404567805383027, 1.427439182194617], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 222.11764705882354, 114, 1468, 120.0, 590.3999999999992, 1468.0, 1468.0, 0.08886612057564337, 0.06899274009534812, 0.03158912879837322], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 127.82352941176471, 108, 329, 115.0, 166.59999999999985, 329.0, 329.0, 0.09792119072167917, 0.0727715099015604, 0.04915184768646787], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 177.76470588235293, 106, 357, 114.0, 341.8, 357.0, 357.0, 0.09791837063831259, 0.034851920064050135, 0.055360328804128695], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bea140a6-52cd-4ff5-99c3-e92c142a0340", 3, 0, 0.0, 544.6666666666666, 325, 762, 547.0, 762.0, 762.0, 762.0, 0.03263210564100333, 0.027204043797724457, 0.02092618753671112], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 247.88235294117646, 108, 1074, 115.0, 488.39999999999947, 1074.0, 1074.0, 0.09779894837366102, 5.2012602131585615, 0.05700069681750716], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 229.52941176470586, 108, 985, 115.0, 469.79999999999956, 985.0, 985.0, 0.0978000736377025, 1.7163665726539488, 0.05709686054572441], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 30.0, 0.468384074941452], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.0, 0.078064012490242], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.0, 0.078064012490242], "isController": false}, {"data": ["401/Unauthorized", 12, 60.0, 0.936768149882904], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1281, 20, "401/Unauthorized", 12, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 11, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
