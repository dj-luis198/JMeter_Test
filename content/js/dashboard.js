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

    var data = {"OkPercent": 98.14671814671814, "KoPercent": 1.8532818532818534};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7590879048248513, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.017543859649122806, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=15065920-95fc-42e6-8ff6-8ada5aa7ad92"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=702ed760-682f-439d-9da2-71ac2f81ec81"], "isController": false}, {"data": [0.5333333333333333, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5333333333333333, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3103995c-e51b-4706-a8f3-72a3be1acc14"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.8809523809523809, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8809523809523809, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=680a3ac8-54b5-4993-8e88-12ccb87076d7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4c568425-f234-4331-af03-43e68f5699b8"], "isController": false}, {"data": [0.8, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/24ad4d24-acb6-4eb2-9cef-0d0693524f92"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/30d05c46-1b84-49f8-8200-9967092dd77e"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=42951eb3-0468-4fd8-8d38-c8f67ff4927c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=78b1e09d-1e17-44f6-a5c8-4924d371a533"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a3220b16-65ce-4282-8836-1a833860ea60"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/78b1e09d-1e17-44f6-a5c8-4924d371a533"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a3220b16-65ce-4282-8836-1a833860ea60"], "isController": false}, {"data": [0.8863636363636364, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.06818181818181818, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/60c77c55-4824-4da8-971e-48e3821962b0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=24ad4d24-acb6-4eb2-9cef-0d0693524f92"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/680a3ac8-54b5-4993-8e88-12ccb87076d7"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/e2962834-2067-4d24-8f40-fc2955f090b8"], "isController": false}, {"data": [0.6, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=302473ee-1638-4782-b253-59aab0713d5f"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ca401c28-4ceb-4f02-8abe-bb53317f549d"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.34, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/42951eb3-0468-4fd8-8d38-c8f67ff4927c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=30d05c46-1b84-49f8-8200-9967092dd77e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4c568425-f234-4331-af03-43e68f5699b8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.34210526315789475, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.34, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d6eb3f9a-f4e8-4f03-9132-b6c4c0dba9b2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.4318181818181818, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3103995c-e51b-4706-a8f3-72a3be1acc14"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/702ed760-682f-439d-9da2-71ac2f81ec81"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/15065920-95fc-42e6-8ff6-8ada5aa7ad92"], "isController": false}, {"data": [0.23148148148148148, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ca401c28-4ceb-4f02-8abe-bb53317f549d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d6eb3f9a-f4e8-4f03-9132-b6c4c0dba9b2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/302473ee-1638-4782-b253-59aab0713d5f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1295, 24, 1.8532818532818534, 400.7567567567568, 100, 3683, 143.0, 1122.4, 1312.4000000000003, 1713.04, 5.033172297730603, 737.9555899973474, 3.6785867061093773], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1903.7192982456143, 1392, 3088, 1869.0, 2274.4, 2424.6, 3088.0, 0.25593246974833306, 307.9740319396426, 1.2584179542801337], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=15065920-95fc-42e6-8ff6-8ada5aa7ad92", 1, 0, 0.0, 505.0, 505, 505, 505.0, 505.0, 505.0, 505.0, 1.9801980198019802, 0.3577506188118812, 1.3652537128712872], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=702ed760-682f-439d-9da2-71ac2f81ec81", 1, 0, 0.0, 1713.0, 1713, 1713, 1713.0, 1713.0, 1713.0, 1713.0, 0.5837711617046117, 0.10546646964389958, 0.4024828517221249], "isController": false}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 722.0666666666668, 116, 2431, 568.0, 1702.0000000000005, 2431.0, 2431.0, 0.08778192628659043, 0.017196342200283245, 0.059104211045307185], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 722.0666666666668, 116, 2431, 568.0, 1702.0000000000005, 2431.0, 2431.0, 0.08966143840856924, 0.017564535688241203, 0.060369700261811404], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3103995c-e51b-4706-a8f3-72a3be1acc14", 3, 0, 0.0, 324.6666666666667, 222, 516, 236.0, 516.0, 516.0, 516.0, 0.08409014463504877, 0.038979285794371564, 0.05392499509474156], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 21, 0, 0.0, 237.04761904761904, 101, 1583, 111.0, 422.6000000000001, 1468.9999999999984, 1583.0, 0.11171936096525528, 0.05386469189396237, 0.06237456509248767], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 21, 0, 0.0, 121.38095238095237, 101, 338, 111.0, 128.20000000000002, 317.2999999999997, 338.0, 0.11171638932629697, 0.0830236057395625, 0.05607639073605141], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 21, 0, 0.0, 336.4761904761906, 102, 1578, 114.0, 870.0, 1507.999999999999, 1578.0, 0.11171638932629697, 4.718427734790612, 0.06441459780769886], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 21, 0, 0.0, 375.76190476190476, 104, 1582, 114.0, 1156.8, 1540.9999999999995, 1582.0, 0.1117146064188021, 14.385951813433946, 0.06430447350501917], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=680a3ac8-54b5-4993-8e88-12ccb87076d7", 1, 0, 0.0, 853.0, 853, 853, 853.0, 853.0, 853.0, 853.0, 1.1723329425556857, 0.21179843200468934, 0.8082686107854631], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4c568425-f234-4331-af03-43e68f5699b8", 3, 0, 0.0, 354.3333333333333, 228, 457, 378.0, 457.0, 457.0, 457.0, 0.027715418087081844, 0.027977054520846614, 0.017773233604020583], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 336.20000000000005, 113, 1450, 235.0, 952.6000000000004, 1450.0, 1450.0, 0.08762654733878175, 0.16213193199011572, 0.0566377839830355], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/24ad4d24-acb6-4eb2-9cef-0d0693524f92", 3, 0, 0.0, 341.0, 216, 534, 273.0, 534.0, 534.0, 534.0, 0.01545228848392447, 0.021302227125462283, 0.009909182393662503], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 137.94117647058823, 103, 347, 112.0, 335.0, 347.0, 347.0, 0.1014719400241145, 0.07541029917807729, 0.05093415739491686], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 122.76470588235294, 104, 331, 111.0, 158.19999999999985, 331.0, 331.0, 0.1014737570957017, 0.03611738275304272, 0.05737044561901976], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 764.2857142857143, 524, 1018, 823.0, 1018.0, 1018.0, 1018.0, 0.04329164965923287, 12.729182417869557, 0.02468976894628125], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1076.7142857142856, 947, 1347, 1049.0, 1347.0, 1347.0, 1347.0, 0.0433106674173849, 38.97101467419551, 0.02465831943782754], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 262.2857142857143, 104, 336, 325.0, 336.0, 336.0, 336.0, 0.043475020495366806, 0.07693040736094205, 0.024072594356321267], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 152.46153846153845, 105, 340, 113.0, 330.0, 340.0, 340.0, 0.06099277470207375, 0.04532763823074036, 0.030615513864126868], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 145.0769230769231, 104, 339, 113.0, 332.2, 339.0, 339.0, 0.06102312306955698, 0.030429048297454867, 0.034013790052292124], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/30d05c46-1b84-49f8-8200-9967092dd77e", 3, 0, 0.0, 493.6666666666667, 206, 1040, 235.0, 1040.0, 1040.0, 1040.0, 0.02272348547969278, 0.022790058191059066, 0.014572026821287363], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 365.8461538461538, 101, 1456, 128.0, 1352.0, 1456.0, 1456.0, 0.06097046215610314, 8.454109687620182, 0.035037863243253385], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 301.15384615384613, 104, 980, 122.0, 926.8, 980.0, 980.0, 0.061025128270125385, 2.7744429109925033, 0.03512887304191488], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=42951eb3-0468-4fd8-8d38-c8f67ff4927c", 1, 0, 0.0, 335.0, 335, 335, 335.0, 335.0, 335.0, 335.0, 2.985074626865672, 0.5392957089552238, 2.058069029850746], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=78b1e09d-1e17-44f6-a5c8-4924d371a533", 1, 0, 0.0, 581.0, 581, 581, 581.0, 581.0, 581.0, 581.0, 1.721170395869191, 0.3109536359724613, 1.186666308089501], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 138.28571428571428, 105, 312, 110.0, 312.0, 312.0, 312.0, 0.043534774956309745, 0.03235348021655441, 0.02444579648425596], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a3220b16-65ce-4282-8836-1a833860ea60", 3, 0, 0.0, 352.0, 223, 528, 305.0, 528.0, 528.0, 528.0, 0.08104384471999351, 0.03761996177431991, 0.051971475943485425], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 798.8000000000001, 108, 1458, 984.0, 1438.8, 1458.0, 1458.0, 0.07019185774450164, 37.90282174923959, 0.037645867454375294], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 257.0588235294117, 102, 1446, 113.0, 616.3999999999993, 1446.0, 1446.0, 0.10134128166915052, 5.389652803651267, 0.05906529433681073], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 565.4666666666666, 101, 1004, 788.0, 941.0, 1004.0, 1004.0, 0.07026583909122848, 12.403869378732873, 0.03775416471483781], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 181.76470588235293, 102, 647, 112.0, 402.9999999999998, 647.0, 647.0, 0.1014719400241145, 1.7808068996442514, 0.059240540353002975], "isController": false}, {"data": ["deleteBooks", 15, 2, 13.333333333333334, 610.9333333333334, 116, 1713, 481.0, 1577.4, 1713.0, 1713.0, 0.09092011152867015, 0.01781110778579222, 0.06182094041702025], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/78b1e09d-1e17-44f6-a5c8-4924d371a533", 3, 0, 0.0, 329.3333333333333, 212, 551, 225.0, 551.0, 551.0, 551.0, 0.022990267453444707, 0.02305762175262472, 0.014743107709403019], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 537.7692307692307, 220, 1569, 437.0, 1463.8, 1569.0, 1569.0, 0.06090733183719939, 11.29007896430596, 0.13458452268563853], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a3220b16-65ce-4282-8836-1a833860ea60", 1, 0, 0.0, 310.0, 310, 310, 310.0, 310.0, 310.0, 310.0, 3.225806451612903, 0.5827872983870968, 2.2240423387096775], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 396.27272727272725, 148, 1162, 374.5, 641.8999999999999, 1089.699999999999, 1162.0, 0.10142502155281707, 0.06230111187179878, 0.04585916501851007], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 131.0, 106, 340, 113.0, 226.00000000000006, 340.0, 340.0, 0.07025728216729664, 0.052212687235656974, 0.03526586233788132], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 190.33333333333331, 106, 341, 127.0, 341.0, 341.0, 341.0, 0.07026452250572655, 0.08212166067856791, 0.036532062287157045], "isController": false}, {"data": ["login", 22, 0, 0.0, 2490.9545454545455, 1266, 4095, 2515.0, 3850.2999999999997, 4072.6499999999996, 4095.0, 0.10259614891364668, 39.19230726351588, 0.20892671020785047], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/60c77c55-4824-4da8-971e-48e3821962b0", 1, 0, 0.0, 302.0, 302, 302, 302.0, 302.0, 302.0, 302.0, 3.3112582781456954, 1.0574037665562914, 1.9757605546357617], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 125.70588235294117, 105, 326, 114.0, 160.39999999999986, 326.0, 326.0, 0.10118505556249963, 0.08191641705206269, 0.03596812521948229], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=24ad4d24-acb6-4eb2-9cef-0d0693524f92", 1, 0, 0.0, 1487.0, 1487, 1487, 1487.0, 1487.0, 1487.0, 1487.0, 0.6724949562878278, 0.12149567081371888, 0.4636537491593813], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/680a3ac8-54b5-4993-8e88-12ccb87076d7", 3, 0, 0.0, 872.3333333333334, 245, 1931, 441.0, 1931.0, 1931.0, 1931.0, 0.05257715697786501, 0.033802045908620904, 0.033716471108852245], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e2962834-2067-4d24-8f40-fc2955f090b8", 1, 0, 0.0, 522.0, 522, 522, 522.0, 522.0, 522.0, 522.0, 1.9157088122605364, 0.6117546695402298, 1.143064535440613], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 932.3333333333333, 224, 1566, 1097.0, 1551.6, 1566.0, 1566.0, 0.07014852781622956, 50.39670271229283, 0.14699678807428262], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=302473ee-1638-4782-b253-59aab0713d5f", 1, 0, 0.0, 455.0, 455, 455, 455.0, 455.0, 455.0, 455.0, 2.197802197802198, 0.39706387362637363, 1.5152815934065933], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ca401c28-4ceb-4f02-8abe-bb53317f549d", 3, 0, 0.0, 719.6666666666666, 239, 1263, 657.0, 1263.0, 1263.0, 1263.0, 0.019904458598726114, 0.023526396214835456, 0.01276425242170913], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 21, 0, 0.0, 530.1428571428571, 220, 1714, 427.0, 1261.4, 1670.2999999999993, 1714.0, 0.11164808523533822, 19.229731635883695, 0.24701827340223614], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, 36.36363636363637, 821.2727272727273, 113, 1457, 1126.0, 1433.6000000000001, 1457.0, 1457.0, 0.057677081749398326, 43.91587486301693, 0.09665929262991763], "isController": false}, {"data": ["register", 25, 7, 28.0, 850.2799999999999, 172, 1590, 829.0, 1335.2, 1526.6999999999998, 1590.0, 0.09674398445904633, 0.030413890114312694, 0.0436481648633588], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/42951eb3-0468-4fd8-8d38-c8f67ff4927c", 3, 0, 0.0, 329.3333333333333, 248, 455, 285.0, 455.0, 455.0, 455.0, 0.07318679710180283, 0.033115119782391254, 0.046932939547705596], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 130.0666666666667, 108, 343, 115.0, 212.80000000000007, 343.0, 343.0, 0.07689705022915322, 0.05970034661345391, 0.027334498323644305], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 424.8235294117647, 218, 1793, 231.0, 892.9999999999992, 1793.0, 1793.0, 0.10127185535996187, 7.274563078962261, 0.22623857899204716], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=30d05c46-1b84-49f8-8200-9967092dd77e", 1, 0, 0.0, 759.0, 759, 759, 759.0, 759.0, 759.0, 759.0, 1.3175230566534915, 0.2380290678524374, 0.9083703886693018], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 296.06666666666666, 215, 449, 228.0, 446.6, 449.0, 449.0, 0.0860254520637506, 0.13332264885270723, 0.19347325791290784], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 111.50000000000001, 106, 115, 112.0, 115.0, 115.0, 115.0, 0.05525854089822758, 0.04106616174174921, 0.027737197286805643], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 110.375, 105, 117, 110.0, 117.0, 117.0, 117.0, 0.05525625086337892, 0.014785364000552562, 0.03151333057052079], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4c568425-f234-4331-af03-43e68f5699b8", 1, 0, 0.0, 434.0, 434, 434, 434.0, 434.0, 434.0, 434.0, 2.304147465437788, 0.4162766417050691, 1.5886016705069124], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 110.375, 108, 113, 110.0, 113.0, 113.0, 113.0, 0.05525625086337892, 0.014893286365520099, 0.032484631855228624], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 109.5, 107, 112, 109.5, 112.0, 112.0, 112.0, 0.05525663252267248, 0.01489338923462657, 0.032538817784347175], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 229.0, 116, 342, 229.0, 342.0, 342.0, 342.0, 0.015808527119528275, 0.004662280459079628, 0.00977226334634902], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1302.8245614035088, 850, 1928, 1235.0, 1704.4, 1767.8999999999996, 1928.0, 0.26208222025021954, 313.5414499411464, 0.5175100091268984], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 7, 28.0, 850.2799999999999, 172, 1590, 829.0, 1335.2, 1526.6999999999998, 1590.0, 0.09716548837317765, 0.030546400407317726, 0.04383833557461726], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 140.14285714285714, 102, 339, 107.0, 339.0, 339.0, 339.0, 0.033236946189384116, 0.008958395652607438, 0.019572147023631466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 108.0, 101, 114, 110.0, 114.0, 114.0, 114.0, 0.033274548298006856, 0.00896853059594716, 0.019561794995507933], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d6eb3f9a-f4e8-4f03-9132-b6c4c0dba9b2", 3, 0, 0.0, 1023.0, 312, 1450, 1307.0, 1450.0, 1450.0, 1450.0, 0.025516496414932255, 0.030159634922727545, 0.016363117818169445], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 124.93333333333334, 105, 331, 111.0, 202.60000000000008, 331.0, 331.0, 0.07561512907502532, 0.020380640258502922, 0.044453425491372316], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 123.73333333333333, 100, 331, 111.0, 202.60000000000008, 331.0, 331.0, 0.07561551025346319, 0.02038074299800375, 0.04452749285433428], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 120.19999999999999, 102, 251, 112.0, 170.60000000000005, 251.0, 251.0, 0.0756132232404803, 0.05619303016211476, 0.03795429369688171], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 144.14285714285714, 104, 340, 113.0, 340.0, 340.0, 340.0, 0.033236788376620294, 0.008893437514837852, 0.01895535587104126], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 123.8, 103, 314, 111.0, 199.40000000000006, 314.0, 314.0, 0.07561512907502532, 0.020232954459528264, 0.043124253300600386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 137.85714285714286, 105, 302, 109.0, 302.0, 302.0, 302.0, 0.033273757462828464, 0.02472786077071529, 0.016701866538958818], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 114.42857142857142, 107, 117, 116.0, 117.0, 117.0, 117.0, 0.033625878476075184, 0.02646724419112949, 0.011952948989542352], "isController": false}, {"data": ["deleteAccount", 15, 2, 13.333333333333334, 564.0000000000001, 113, 1307, 516.0, 1146.8000000000002, 1307.0, 1307.0, 0.09113665637835079, 0.017521259523780593, 0.06202158002102219], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1338.1363636363637, 820, 3683, 1072.5, 2908.2999999999993, 3600.949999999999, 3683.0, 0.1006961767492528, 0.05211813835654685, 0.04631630786025201], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 283.42857142857144, 212, 643, 222.0, 643.0, 643.0, 643.0, 0.033219911065552374, 0.05148437388772619, 0.07471235857809289], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3103995c-e51b-4706-a8f3-72a3be1acc14", 1, 0, 0.0, 250.0, 250, 250, 250.0, 250.0, 250.0, 250.0, 4.0, 0.72265625, 2.7578125], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/702ed760-682f-439d-9da2-71ac2f81ec81", 3, 0, 0.0, 564.6666666666666, 364, 845, 485.0, 845.0, 845.0, 845.0, 0.030076997112608278, 0.024447350843158487, 0.0192876576535932], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/15065920-95fc-42e6-8ff6-8ada5aa7ad92", 3, 0, 0.0, 628.6666666666666, 220, 1212, 454.0, 1212.0, 1212.0, 1212.0, 0.04135535276115906, 0.026587507064872763, 0.02652019692040473], "isController": false}, {"data": ["addBook", 54, 9, 16.666666666666668, 1241.0740740740737, 569, 3296, 945.5, 2073.5, 2295.5, 3296.0, 0.2530589674256874, 85.157280614863, 0.9174943559649279], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 203.7894736842105, 104, 472, 114.0, 454.0, 460.2, 472.0, 0.2632891746577241, 0.19566705265090628, 0.12727357564020841], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 678.1929824561402, 516, 1000, 654.0, 891.4, 915.4999999999995, 1000.0, 0.2632040708896297, 77.3907360392174, 0.13237314112124934], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 175.14035087719296, 102, 435, 115.0, 331.2, 349.39999999999964, 435.0, 0.2637350434468782, 0.4666874010993587, 0.12826176917631382], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 1097.3508771929826, 737, 1497, 1111.0, 1347.6, 1429.7999999999997, 1497.0, 0.26266796925402297, 236.34910045580958, 0.13184700800446075], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 131.06666666666663, 106, 332, 114.0, 225.20000000000005, 332.0, 332.0, 0.09212797189482672, 0.06882607275345941, 0.03274861500948918], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 165, 9, 5.454545454545454, 213.9030303030302, 102, 1598, 117.0, 333.4, 837.0999999999988, 1549.1600000000003, 0.7056499035611798, 1.6613385978201833, 0.33459900375063617], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 198.5, 116, 342, 124.0, 342.0, 342.0, 342.0, 0.054562443306211246, 0.042253923380688986, 0.01939524351900478], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 21, 0, 0.0, 124.23809523809521, 108, 308, 116.0, 118.8, 289.09999999999974, 308.0, 0.11255406614963259, 0.09134026266635223, 0.04000945320162721], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ca401c28-4ceb-4f02-8abe-bb53317f549d", 1, 0, 0.0, 481.0, 481, 481, 481.0, 481.0, 481.0, 481.0, 2.079002079002079, 0.37560096153846156, 1.4333744802494803], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 224.75000000000003, 218, 228, 225.0, 228.0, 228.0, 228.0, 0.05521506266909613, 0.08557256294517145, 0.1241799700458285], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 276.0, 213, 447, 225.0, 442.8, 447.0, 447.0, 0.0755701769853545, 0.11711901452710702, 0.16995909921608535], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d6eb3f9a-f4e8-4f03-9132-b6c4c0dba9b2", 1, 0, 0.0, 543.0, 543, 543, 543.0, 543.0, 543.0, 543.0, 1.8416206261510129, 0.3327146639042357, 1.2697110957642725], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 116.15384615384615, 109, 129, 115.0, 128.6, 129.0, 129.0, 0.0601941028300489, 0.04990702470967921, 0.021397122490368944], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 114.60000000000001, 108, 122, 114.0, 121.4, 122.0, 122.0, 0.07218791959228263, 0.05604433210533661, 0.025660549542569216], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/302473ee-1638-4782-b253-59aab0713d5f", 3, 0, 0.0, 430.3333333333333, 222, 621, 448.0, 621.0, 621.0, 621.0, 0.022980933485518183, 0.023048260439089033, 0.014737122059398053], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 111.53333333333335, 106, 116, 111.0, 115.4, 116.0, 116.0, 0.08608667206143145, 0.06397652093627865, 0.04321147406208571], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 165.39999999999998, 102, 330, 110.0, 321.6, 330.0, 330.0, 0.08607975576303965, 0.023033059647532092, 0.04909236070860855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 139.06666666666663, 104, 328, 112.0, 319.0, 328.0, 328.0, 0.08608024974749794, 0.023201317314755304, 0.05060577182421265], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 154.93333333333334, 102, 338, 113.0, 333.2, 338.0, 338.0, 0.08608123773342362, 0.023201583607836838, 0.050690416360600045], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 29.166666666666668, 0.5405405405405406], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 8.333333333333334, 0.15444015444015444], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 8.333333333333334, 0.15444015444015444], "isController": false}, {"data": ["401/Unauthorized", 13, 54.166666666666664, 1.0038610038610039], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1295, 24, "401/Unauthorized", 13, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 165, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
