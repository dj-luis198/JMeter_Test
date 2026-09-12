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

    var data = {"OkPercent": 98.18468823993686, "KoPercent": 1.8153117600631412};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7217332430602573, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=31e6db5d-3e94-4ce7-8baa-78277773c6cb"], "isController": false}, {"data": [0.39285714285714285, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.39285714285714285, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5f35b741-6b1f-497b-a1ba-12d2b26d0c18"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d70fb2a6-b4c6-4060-ab6f-9395d9cbb959"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f71a9aac-d3d9-4da4-bac2-e9ebb18839fc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/71e6775f-aec0-4f61-8646-1d69a199314f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5882352941176471, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.6923076923076923, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=259ba852-119c-4bb2-93ca-a48d44ba1b4b"], "isController": false}, {"data": [0.6818181818181818, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fd60de4d-4d1c-4456-a8ca-cc46b95ba8d4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a03c5c55-cae5-4958-91d8-8dfdf581ed68"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/9aca1f21-3690-4dc6-838a-d9585d0f6dbd"], "isController": false}, {"data": [0.4117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3e0e7274-39d0-41f8-b56c-c84ba64fccfd"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.1111111111111111, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5ebeae56-d78b-4dc2-9db5-016bb9321781"], "isController": false}, {"data": [0.13043478260869565, 500, 1500, "register"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f645241f-965b-4916-93a1-ccd7fdacb4a8"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5ebeae56-d78b-4dc2-9db5-016bb9321781"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3e0e7274-39d0-41f8-b56c-c84ba64fccfd"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.2777777777777778, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4d5c8b92-178d-4c9a-8978-602841e999c1"], "isController": false}, {"data": [0.13043478260869565, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f71a9aac-d3d9-4da4-bac2-e9ebb18839fc"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5384615384615384, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.1590909090909091, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/51fabca2-5606-4464-9518-e171ecc8f710"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/d70fb2a6-b4c6-4060-ab6f-9395d9cbb959"], "isController": false}, {"data": [0.2631578947368421, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b005f718-cfe0-4437-a4cf-17d6d9383ca9"], "isController": false}, {"data": [0.9074074074074074, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9907407407407407, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4444444444444444, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9226190476190477, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/31e6db5d-3e94-4ce7-8baa-78277773c6cb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b005f718-cfe0-4437-a4cf-17d6d9383ca9"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9aca1f21-3690-4dc6-838a-d9585d0f6dbd"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a03c5c55-cae5-4958-91d8-8dfdf581ed68"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/836fdb60-1cac-428c-bdf8-10e8a197d322"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fd60de4d-4d1c-4456-a8ca-cc46b95ba8d4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/259ba852-119c-4bb2-93ca-a48d44ba1b4b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f1c4189f-6e93-4f50-a860-46d71a6ad249"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f645241f-965b-4916-93a1-ccd7fdacb4a8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1267, 23, 1.8153117600631412, 484.7284925019732, 124, 4818, 164.0, 1371.2, 1587.3999999999996, 2240.199999999996, 4.9787998223822, 717.8121693612243, 3.6278203763866563], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 2217.3518518518513, 1663, 2892, 2272.5, 2549.0, 2837.5, 2892.0, 0.2448357786684561, 294.61995692137145, 1.2038556109332776], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=31e6db5d-3e94-4ce7-8baa-78277773c6cb", 1, 0, 0.0, 270.0, 270, 270, 270.0, 270.0, 270.0, 270.0, 3.7037037037037037, 0.6691261574074073, 2.5535300925925926], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 726.2142857142857, 133, 1789, 629.0, 1671.0, 1789.0, 1789.0, 0.0707753438923406, 0.01394179486272111, 0.0476213007244362], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 726.2142857142857, 133, 1789, 629.0, 1671.0, 1789.0, 1789.0, 0.07076496931833115, 0.01393975121058644, 0.04761432017610368], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 180.375, 125, 384, 134.5, 380.5, 384.0, 384.0, 0.10967693288457188, 0.029347148057004585, 0.0625501257857324], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 166.5625, 126, 389, 137.0, 380.6, 389.0, 389.0, 0.10966866355024882, 0.08150180953294858, 0.05504852838362098], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 239.8125, 127, 505, 143.5, 451.80000000000007, 505.0, 505.0, 0.10939198566964987, 0.029484558637522817, 0.06441735093632703], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 209.375, 129, 505, 138.0, 454.6, 505.0, 505.0, 0.10939198566964987, 0.029484558637522817, 0.06431052282532151], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 402.28571428571433, 129, 1421, 298.0, 1122.0, 1421.0, 1421.0, 0.07029241645244216, 0.13788316427588768, 0.04543314249779081], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/5f35b741-6b1f-497b-a1ba-12d2b26d0c18", 1, 0, 0.0, 328.0, 328, 328, 328.0, 328.0, 328.0, 328.0, 3.048780487804878, 0.973585175304878, 1.8191453887195121], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 150.0, 129, 383, 135.0, 176.00000000000034, 383.0, 383.0, 0.09989455574671181, 0.07423804387035907, 0.050142384427548696], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d70fb2a6-b4c6-4060-ab6f-9395d9cbb959", 1, 0, 0.0, 918.0, 918, 918, 918.0, 918.0, 918.0, 918.0, 1.0893246187363836, 0.19680181100217864, 0.751038262527233], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 209.83333333333334, 127, 429, 139.5, 390.30000000000007, 429.0, 429.0, 0.0999000999000999, 0.043402777777777776, 0.056042048229548225], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 786.0, 623, 1018, 765.0, 1018.0, 1018.0, 1018.0, 0.039439330477925805, 11.596472669529962, 0.022492743163192063], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1356.2, 884, 1717, 1493.0, 1717.0, 1717.0, 1717.0, 0.039152428233599046, 35.229423747220174, 0.022290884433777584], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f71a9aac-d3d9-4da4-bac2-e9ebb18839fc", 3, 0, 0.0, 665.3333333333334, 474, 823, 699.0, 823.0, 823.0, 823.0, 0.07311188555552849, 0.033081224258523625, 0.04688490056783564], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 405.8, 377, 428, 413.0, 428.0, 428.0, 428.0, 0.03950164721868902, 0.06989939917994581, 0.021872494114254563], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/71e6775f-aec0-4f61-8646-1d69a199314f", 1, 0, 0.0, 350.0, 350, 350, 350.0, 350.0, 350.0, 350.0, 2.857142857142857, 0.9123883928571429, 1.7047991071428572], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 177.84615384615384, 129, 431, 138.0, 411.0, 431.0, 431.0, 0.05976984013866603, 0.04441879721242661, 0.030001658038353845], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 266.2307692307693, 126, 479, 145.0, 458.2, 479.0, 479.0, 0.05969217206039011, 0.022868845966645852, 0.033657560357969366], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 251.92307692307696, 127, 1389, 137.0, 1002.9999999999997, 1389.0, 1389.0, 0.05977121418324935, 4.1519666238114725, 0.03474381425405525], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 247.3846153846154, 127, 807, 133.0, 650.9999999999999, 807.0, 807.0, 0.05969518719033122, 1.3650341324452526, 0.03475791736119721], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 131.6, 127, 147, 128.0, 147.0, 147.0, 147.0, 0.03959392470819278, 0.02942478193645967, 0.022232916706260594], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 933.2941176470591, 125, 1919, 1279.0, 1784.6, 1919.0, 1919.0, 0.08557377214221355, 45.30327997661823, 0.04598213836272205], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 300.8333333333334, 127, 1600, 140.0, 1401.1000000000004, 1600.0, 1600.0, 0.09989400136521802, 10.011132718199022, 0.0577728979249796], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 694.6470588235294, 127, 1238, 999.0, 1143.6, 1238.0, 1238.0, 0.08557721833768771, 14.81099390388168, 0.046067561640766974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 212.61111111111111, 125, 757, 136.0, 645.4000000000002, 757.0, 757.0, 0.09989233825765563, 3.2874507822125043, 0.05786948719158241], "isController": false}, {"data": ["deleteBooks", 13, 2, 15.384615384615385, 607.9230769230769, 131, 1986, 483.0, 1608.3999999999996, 1986.0, 1986.0, 0.07357310619994907, 0.014585293514247715, 0.04991829140609525], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 540.3076923076923, 261, 1527, 520.0, 1258.1999999999998, 1527.0, 1527.0, 0.05965272934180096, 5.574984914742484, 0.1329863317815976], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=259ba852-119c-4bb2-93ca-a48d44ba1b4b", 1, 0, 0.0, 483.0, 483, 483, 483.0, 483.0, 483.0, 483.0, 2.070393374741201, 0.37404567805383027, 1.427439182194617], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 802.590909090909, 194, 1714, 856.0, 1458.9, 1676.0499999999995, 1714.0, 0.0948202294649553, 0.05824406673189149, 0.042872818595971], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 168.2941176470588, 126, 439, 138.0, 387.79999999999995, 439.0, 439.0, 0.0855729106367128, 0.06359471190872894, 0.04295358990944372], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 210.0, 126, 406, 140.0, 401.2, 406.0, 406.0, 0.08557721833768771, 0.09850622133792429, 0.044578022511842376], "isController": false}, {"data": ["login", 22, 0, 0.0, 3506.545454545454, 2157, 5513, 3484.0, 4949.999999999999, 5479.4, 5513.0, 0.09106714131964568, 24.886444998809917, 0.17172106548555344], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 193.38888888888889, 129, 430, 146.5, 420.1, 430.0, 430.0, 0.09602816826269038, 0.07774155418922885, 0.03413501293712823], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fd60de4d-4d1c-4456-a8ca-cc46b95ba8d4", 3, 0, 0.0, 344.0, 233, 449, 350.0, 449.0, 449.0, 449.0, 0.04334257975034674, 0.028373023397769304, 0.02779455797792418], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a03c5c55-cae5-4958-91d8-8dfdf581ed68", 1, 0, 0.0, 508.0, 508, 508, 508.0, 508.0, 508.0, 508.0, 1.968503937007874, 0.35563791830708663, 1.357191190944882], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9aca1f21-3690-4dc6-838a-d9585d0f6dbd", 3, 0, 0.0, 735.3333333333334, 370, 1081, 755.0, 1081.0, 1081.0, 1081.0, 0.022637067443369602, 0.0227033869768951, 0.014516609005025428], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 1133.9411764705885, 260, 2058, 1422.0, 1916.3999999999999, 2058.0, 2058.0, 0.08551393877201985, 60.233630093423976, 0.17945253316180243], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3e0e7274-39d0-41f8-b56c-c84ba64fccfd", 3, 0, 0.0, 558.6666666666666, 240, 1003, 433.0, 1003.0, 1003.0, 1003.0, 0.02413981782484148, 0.028532447435546688, 0.015480286821268788], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 441.875, 258, 883, 405.0, 841.7, 883.0, 883.0, 0.1092896174863388, 0.16937756147540983, 0.24579491120218577], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, 44.44444444444444, 886.8888888888889, 129, 1864, 1013.0, 1864.0, 1864.0, 1864.0, 0.07040325419486057, 46.80102158055306, 0.10892795155864983], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5ebeae56-d78b-4dc2-9db5-016bb9321781", 3, 0, 0.0, 333.6666666666667, 242, 493, 266.0, 493.0, 493.0, 493.0, 0.07079980176055507, 0.03203506655181366, 0.04540221662379346], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 1578.8695652173915, 216, 4818, 1475.0, 3465.4, 4554.599999999997, 4818.0, 0.0929210332818901, 0.029274544282932427, 0.04192335681272776], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f645241f-965b-4916-93a1-ccd7fdacb4a8", 3, 0, 0.0, 770.0, 292, 1498, 520.0, 1498.0, 1498.0, 1498.0, 0.021864136257297155, 0.030141476904184065, 0.014020946753540167], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 515.3333333333333, 260, 1762, 294.5, 1735.9, 1762.0, 1762.0, 0.09981312764435474, 13.40541423834266, 0.22164449405834633], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 136.86666666666667, 130, 150, 137.0, 145.2, 150.0, 150.0, 0.1118009644696535, 0.0867986003450923, 0.03974174908882214], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5ebeae56-d78b-4dc2-9db5-016bb9321781", 1, 0, 0.0, 270.0, 270, 270, 270.0, 270.0, 270.0, 270.0, 3.7037037037037037, 0.6691261574074073, 2.5535300925925926], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3e0e7274-39d0-41f8-b56c-c84ba64fccfd", 1, 0, 0.0, 893.0, 893, 893, 893.0, 893.0, 893.0, 893.0, 1.1198208286674132, 0.20231138017917133, 0.7720639697648376], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 463.00000000000006, 257, 1593, 319.0, 762.5999999999992, 1593.0, 1593.0, 0.10611934056193312, 7.622767787474173, 0.23706772949867974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 137.62500000000003, 131, 146, 138.0, 146.0, 146.0, 146.0, 0.04219097745947029, 0.03135481820962587, 0.021177892982585673], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 196.625, 127, 402, 135.5, 402.0, 402.0, 402.0, 0.042193647746331796, 0.019211707286842964, 0.023620613838461618], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 310.625, 125, 1295, 132.0, 1295.0, 1295.0, 1295.0, 0.042193202675049044, 4.755640580169722, 0.02435174099702538], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 249.37500000000003, 127, 816, 131.5, 816.0, 816.0, 816.0, 0.042195205569767136, 1.560800241963132, 0.024394103220021626], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 140.0, 131, 149, 140.0, 149.0, 149.0, 149.0, 0.37537537537537535, 0.11070640953453453, 0.2320435670045045], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1514.3888888888882, 1008, 2329, 1402.0, 1962.5, 2236.0, 2329.0, 0.2457751703358472, 294.03254899573534, 0.4853099554873858], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4d5c8b92-178d-4c9a-8978-602841e999c1", 1, 0, 0.0, 414.0, 414, 414, 414.0, 414.0, 414.0, 414.0, 2.4154589371980677, 0.7713428442028986, 1.4412552838164252], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 1578.8695652173915, 216, 4818, 1475.0, 3465.4, 4554.599999999997, 4818.0, 0.09153208796631619, 0.028836960458137998, 0.041296703750427814], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 206.71428571428572, 127, 426, 129.0, 426.0, 426.0, 426.0, 0.035211090487472396, 0.009490489232951545, 0.020734655824165876], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 210.71428571428572, 127, 430, 137.0, 430.0, 430.0, 430.0, 0.035209319403855924, 0.009490011870570542, 0.020699228790157485], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f71a9aac-d3d9-4da4-bac2-e9ebb18839fc", 1, 0, 0.0, 277.0, 277, 277, 277.0, 277.0, 277.0, 277.0, 3.6101083032490977, 0.6522168321299638, 2.4890004512635375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 334.9333333333333, 124, 1411, 131.0, 1400.8, 1411.0, 1411.0, 0.11455103630504178, 13.76985491633956, 0.06603091637010676], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 276.06666666666666, 127, 849, 139.0, 820.8000000000001, 849.0, 849.0, 0.11433362551926521, 4.5090919051793135, 0.06601724770379969], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 168.57142857142858, 126, 381, 132.0, 381.0, 381.0, 381.0, 0.035211090487472396, 0.0094217175718432, 0.020081325043636602], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 150.93333333333334, 127, 377, 136.0, 237.80000000000007, 377.0, 377.0, 0.11455191110771698, 0.08513086362594983, 0.05749968975524075], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 133.85714285714286, 128, 143, 133.0, 143.0, 143.0, 143.0, 0.03520807975133036, 0.02616537958082266, 0.017672805656429497], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 247.0, 125, 558, 136.0, 476.40000000000003, 558.0, 558.0, 0.1143327540473795, 0.053489268918259704, 0.06392511014055306], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 144.0, 129, 189, 134.0, 189.0, 189.0, 189.0, 0.03410109513231225, 0.026841291676409838, 0.012121873660314121], "isController": false}, {"data": ["deleteAccount", 13, 2, 15.384615384615385, 681.3846153846154, 129, 1380, 548.0, 1280.0, 1380.0, 1380.0, 0.07302755385782096, 0.014169934766733141, 0.049696259795522855], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 2018.2727272727277, 1268, 3831, 1725.5, 3490.6999999999994, 3822.2999999999997, 3831.0, 0.09335087198200874, 0.04831636928756312, 0.042937754593287226], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 381.5714285714286, 262, 572, 275.0, 572.0, 572.0, 572.0, 0.03518365869840568, 0.05452779917418927, 0.07912887302971512], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/51fabca2-5606-4464-9518-e171ecc8f710", 1, 0, 0.0, 423.0, 423, 423, 423.0, 423.0, 423.0, 423.0, 2.3640661938534278, 0.7549312943262412, 1.410590277777778], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d70fb2a6-b4c6-4060-ab6f-9395d9cbb959", 3, 0, 0.0, 1032.0, 545, 1421, 1130.0, 1421.0, 1421.0, 1421.0, 0.019788265558523793, 0.023389059974934866, 0.01268974060881897], "isController": false}, {"data": ["addBook", 57, 9, 15.789473684210526, 1416.3684210526317, 672, 2833, 1158.0, 2367.0000000000005, 2552.1999999999994, 2833.0, 0.27837468255518655, 100.43557091228756, 1.008469137648955], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/b005f718-cfe0-4437-a4cf-17d6d9383ca9", 3, 0, 0.0, 635.0, 240, 1380, 285.0, 1380.0, 1380.0, 1380.0, 0.030915723737092688, 0.02577316682639791, 0.019825512943383004], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 246.2407407407407, 127, 615, 145.0, 544.0, 559.0, 615.0, 0.24704913532802633, 0.1835980390474883, 0.11942316600329399], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 840.1111111111114, 622, 1305, 771.0, 1122.5, 1136.5, 1305.0, 0.24699037652310735, 72.62337155013904, 0.1242187928802737], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 188.88888888888897, 126, 521, 140.0, 391.5, 447.5, 521.0, 0.2475644699140401, 0.4380730659025788, 0.12039756446991404], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1266.8518518518515, 878, 1776, 1262.0, 1533.0, 1718.5, 1776.0, 0.24642906037511977, 221.73730170161548, 0.12369583694610506], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 144.1176470588235, 129, 198, 142.0, 162.79999999999995, 198.0, 198.0, 0.1019961241472824, 0.07619827634049905, 0.036256434755479294], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 9, 5.357142857142857, 218.55952380952385, 127, 932, 145.5, 389.99999999999994, 529.3999999999982, 824.3600000000004, 0.7039302773820498, 1.5563458476493757, 0.33786050893530545], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 139.75, 133, 153, 138.5, 153.0, 153.0, 153.0, 0.0415116466113524, 0.032147202893361766, 0.014756093131379171], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/31e6db5d-3e94-4ce7-8baa-78277773c6cb", 3, 0, 0.0, 344.3333333333333, 229, 444, 360.0, 444.0, 444.0, 444.0, 0.07693294012052827, 0.03481015194255674, 0.049335251314271064], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 139.1875, 129, 162, 136.5, 157.1, 162.0, 162.0, 0.10915838882218099, 0.08858459092893789, 0.03880239602663465], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b005f718-cfe0-4437-a4cf-17d6d9383ca9", 1, 0, 0.0, 1986.0, 1986, 1986, 1986.0, 1986.0, 1986.0, 1986.0, 0.5035246727089627, 0.09096881294058409, 0.34715665911379656], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9aca1f21-3690-4dc6-838a-d9585d0f6dbd", 1, 0, 0.0, 1042.0, 1042, 1042, 1042.0, 1042.0, 1042.0, 1042.0, 0.9596928982725528, 0.1733820177543186, 0.6616632677543186], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a03c5c55-cae5-4958-91d8-8dfdf581ed68", 3, 0, 0.0, 533.6666666666666, 350, 843, 408.0, 843.0, 843.0, 843.0, 0.0266318676928813, 0.02670989074276279, 0.0170783786962813], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 451.875, 260, 1435, 276.0, 1435.0, 1435.0, 1435.0, 0.04216051562310607, 6.3620022506469, 0.09347159237632476], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/836fdb60-1cac-428c-bdf8-10e8a197d322", 2, 0, 0.0, 280.0, 256, 304, 280.0, 304.0, 304.0, 304.0, 0.016860421004712488, 0.028814196052975444, 0.010480134735839355], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 567.4666666666667, 256, 1557, 506.0, 1540.2, 1557.0, 1557.0, 0.11422131522037099, 18.373205000133257, 0.25298980241616154], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fd60de4d-4d1c-4456-a8ca-cc46b95ba8d4", 1, 0, 0.0, 505.0, 505, 505, 505.0, 505.0, 505.0, 505.0, 1.9801980198019802, 0.3577506188118812, 1.3652537128712872], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 145.92307692307693, 129, 163, 145.0, 162.2, 163.0, 163.0, 0.06225278461494258, 0.051613880994224856, 0.02212891953109287], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 142.64705882352942, 130, 166, 139.0, 158.0, 166.0, 166.0, 0.08707053737886952, 0.06759870821894655, 0.030950855083895022], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/259ba852-119c-4bb2-93ca-a48d44ba1b4b", 3, 0, 0.0, 461.0, 358, 548, 477.0, 548.0, 548.0, 548.0, 0.022055093623872434, 0.026068374006601825, 0.014143403137704654], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f1c4189f-6e93-4f50-a860-46d71a6ad249", 1, 0, 0.0, 279.0, 279, 279, 279.0, 279.0, 279.0, 279.0, 3.5842293906810037, 1.144573252688172, 2.1386368727598564], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f645241f-965b-4916-93a1-ccd7fdacb4a8", 1, 0, 0.0, 471.0, 471, 471, 471.0, 471.0, 471.0, 471.0, 2.1231422505307855, 0.3835755042462845, 1.463807059447983], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 133.8235294117647, 127, 155, 129.0, 147.0, 155.0, 155.0, 0.10709943237300842, 0.07959244925376896, 0.053758894765357744], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 210.58823529411768, 125, 410, 130.0, 407.6, 410.0, 410.0, 0.10691218736046387, 0.038053074039834225, 0.060445183134288004], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 264.0, 126, 1466, 140.0, 629.9999999999993, 1466.0, 1466.0, 0.10620486293325336, 5.64831357805745, 0.06189996204737986], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 264.4117647058823, 126, 745, 148.0, 480.19999999999976, 745.0, 745.0, 0.10668540982886406, 1.8723019769747782, 0.062284226797492265], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 26.08695652173913, 0.47355958958168903], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 8.695652173913043, 0.15785319652722968], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 8.695652173913043, 0.15785319652722968], "isController": false}, {"data": ["401/Unauthorized", 13, 56.52173913043478, 1.0260457774269929], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1267, 23, "401/Unauthorized", 13, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
