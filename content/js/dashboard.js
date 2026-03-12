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

    var data = {"OkPercent": 98.77394636015326, "KoPercent": 1.2260536398467432};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7947957839262187, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.10909090909090909, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2b653c60-1f79-4515-8d1e-c8012a83063c"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6923076923076923, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bf317f9f-acee-4c95-91a7-e3ca9f45e0a8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6a19ad69-6d42-45b0-b686-60f0f3e19d57"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/68ee1f14-2703-49fa-b2bc-4188401c0497"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/09adaeea-3986-4d64-9f7e-0d4bf24e7c97"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/54681a21-2fdf-4d68-9ee5-c9659f1afe39"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d1bc66e4-b573-49e9-910d-739c6dd4819e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=92aed9e8-97b3-4d2a-9481-ddfd2cb7768e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d573720b-5236-4e9e-93e9-25f6b86b26cc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ecc6907d-c0a7-4c22-ae6b-d67d2ea61737"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.022727272727272728, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0d9e8aa1-143c-4623-95d8-981cc66169ef"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/75c88e6f-da64-47c0-94f8-10da8939dbe9"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=124a09b7-1c27-40d8-8a0d-e3f743568d62"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2b653c60-1f79-4515-8d1e-c8012a83063c"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.32608695652173914, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/77dc3470-d5a4-4147-b8a7-2d04bd95641d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d573720b-5236-4e9e-93e9-25f6b86b26cc"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5a424d3e-4eb2-48c1-b402-45d8e2660488"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4727272727272727, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.32608695652173914, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.45454545454545453, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/34366a66-76b0-4dff-afc3-6d869bb98e62"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/797ab835-6604-48a0-880e-3502f59f93cf"], "isController": false}, {"data": [0.3114754098360656, 500, 1500, "addBook"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/92aed9e8-97b3-4d2a-9481-ddfd2cb7768e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=09adaeea-3986-4d64-9f7e-0d4bf24e7c97"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ecc6907d-c0a7-4c22-ae6b-d67d2ea61737"], "isController": false}, {"data": [0.9519774011299436, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=54681a21-2fdf-4d68-9ee5-c9659f1afe39"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/124a09b7-1c27-40d8-8a0d-e3f743568d62"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=75c88e6f-da64-47c0-94f8-10da8939dbe9"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=34366a66-76b0-4dff-afc3-6d869bb98e62"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5a424d3e-4eb2-48c1-b402-45d8e2660488"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/942e14cc-0d05-4f6d-9893-8ea83f00337c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bf317f9f-acee-4c95-91a7-e3ca9f45e0a8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=77dc3470-d5a4-4147-b8a7-2d04bd95641d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1305, 16, 1.2260536398467432, 349.6789272030653, 106, 1963, 126.0, 918.0, 1095.1000000000001, 1429.5200000000004, 5.052890795607663, 716.6151354891044, 3.681166613992055], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 1647.036363636364, 1328, 2093, 1617.0, 1940.6, 2009.2, 2093.0, 0.24390352063645515, 293.4983956760895, 1.199271705473195], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/2b653c60-1f79-4515-8d1e-c8012a83063c", 3, 0, 0.0, 493.6666666666667, 229, 878, 374.0, 878.0, 878.0, 878.0, 0.024873765639380145, 0.02494663799965177, 0.015950949970566043], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 579.6153846153846, 122, 1376, 482.0, 1299.6, 1376.0, 1376.0, 0.0831760452989539, 0.015757961707028378, 0.05622755646373845], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 579.6153846153846, 122, 1376, 482.0, 1299.6, 1376.0, 1376.0, 0.0832197064264818, 0.01576623344407956, 0.05625707167457254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 171.86666666666665, 110, 350, 115.0, 336.8, 350.0, 350.0, 0.12014417300760913, 0.044178013616339606, 0.06784704144973969], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bf317f9f-acee-4c95-91a7-e3ca9f45e0a8", 3, 0, 0.0, 347.0, 205, 426, 410.0, 426.0, 426.0, 426.0, 0.024429569550984513, 0.02450114055552841, 0.015666097661275875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 115.13333333333333, 109, 121, 115.0, 120.4, 121.0, 121.0, 0.12014128615251535, 0.08928468629107832, 0.060305294025774316], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 209.46666666666664, 108, 889, 115.0, 562.0000000000002, 889.0, 889.0, 0.12014802236355189, 2.3853919278551174, 0.07006287996812072], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6a19ad69-6d42-45b0-b686-60f0f3e19d57", 1, 0, 0.0, 241.0, 241, 241, 241.0, 241.0, 241.0, 241.0, 4.149377593360996, 1.3250453838174274, 2.4758493257261414], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 189.66666666666666, 107, 787, 116.0, 521.2000000000002, 787.0, 787.0, 0.12014128615251535, 7.237112406690268, 0.06994162635259064], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/68ee1f14-2703-49fa-b2bc-4188401c0497", 1, 0, 0.0, 199.0, 199, 199, 199.0, 199.0, 199.0, 199.0, 5.025125628140704, 1.6047032035175879, 2.998390389447236], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 240.3076923076923, 117, 521, 219.0, 421.7999999999999, 521.0, 521.0, 0.08375317295674471, 0.17477938286796635, 0.054138826118749116], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/09adaeea-3986-4d64-9f7e-0d4bf24e7c97", 3, 0, 0.0, 536.6666666666666, 217, 936, 457.0, 936.0, 936.0, 936.0, 0.023569341001225607, 0.023638391804940134, 0.015114453701957825], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/54681a21-2fdf-4d68-9ee5-c9659f1afe39", 3, 0, 0.0, 311.0, 219, 487, 227.0, 487.0, 487.0, 487.0, 0.03398855718574747, 0.028135709935988216, 0.021796047414037276], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d1bc66e4-b573-49e9-910d-739c6dd4819e", 1, 0, 0.0, 232.0, 232, 232, 232.0, 232.0, 232.0, 232.0, 4.310344827586206, 1.3764480064655171, 2.571895204741379], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=92aed9e8-97b3-4d2a-9481-ddfd2cb7768e", 1, 0, 0.0, 422.0, 422, 422, 422.0, 422.0, 422.0, 422.0, 2.3696682464454977, 0.4281138921800948, 1.6337751777251186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 130.68750000000003, 114, 332, 117.0, 187.10000000000014, 332.0, 332.0, 0.09250479868643185, 0.06874624199255336, 0.04643307277815037], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 148.4375, 107, 447, 116.5, 359.5000000000001, 447.0, 447.0, 0.0925058683410229, 0.033436264179415136, 0.052271687567211296], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 699.75, 537, 906, 678.0, 906.0, 906.0, 906.0, 0.028629095750010738, 8.417904725947981, 0.016327531169927998], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 874.5, 747, 1019, 866.0, 1019.0, 1019.0, 1019.0, 0.02853983090150191, 25.680190012842925, 0.01624875138239806], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 227.5, 109, 344, 228.5, 344.0, 344.0, 344.0, 0.028669313799974196, 0.050731246685110594, 0.0158745126216654], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 125.76470588235296, 108, 325, 114.0, 160.19999999999985, 325.0, 325.0, 0.07694152896395967, 0.05718017923981769, 0.03862104090573758], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 152.41176470588232, 106, 344, 114.0, 342.4, 344.0, 344.0, 0.07694222544072055, 0.027385916178234403, 0.04350099855167576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 201.58823529411765, 109, 943, 114.0, 463.79999999999956, 943.0, 943.0, 0.076941877200764, 4.092014600004074, 0.04484445577199859], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 179.35294117647058, 108, 779, 116.0, 427.79999999999967, 779.0, 779.0, 0.07694257368382938, 1.350322720349953, 0.04492000093915201], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d573720b-5236-4e9e-93e9-25f6b86b26cc", 3, 0, 0.0, 376.33333333333337, 203, 695, 231.0, 695.0, 695.0, 695.0, 0.021150741333483738, 0.02499946021545555, 0.013563463680652007], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 112.25, 108, 116, 112.5, 116.0, 116.0, 116.0, 0.028716240469797694, 0.02134087792726176, 0.016124842060677415], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 555.5000000000001, 108, 1157, 435.5, 1131.9, 1156.2, 1157.0, 0.09255959681039629, 41.65511780811933, 0.05043774904316517], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 211.75, 110, 775, 116.0, 476.1000000000003, 775.0, 775.0, 0.0925058683410229, 5.225683829757403, 0.05388647506388687], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 410.5999999999999, 109, 953, 325.5, 800.8000000000001, 945.4499999999999, 953.0, 0.09255916844843066, 13.620208182924685, 0.0505279054322976], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 189.31250000000003, 110, 860, 116.0, 501.60000000000036, 860.0, 860.0, 0.09250693802035152, 1.723382122311517, 0.05397743697964847], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 368.69230769230774, 120, 481, 422.0, 473.8, 481.0, 481.0, 0.08317551312893484, 0.015757860885755235, 0.05688950173069049], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 357.6470588235294, 224, 1053, 233.0, 739.3999999999997, 1053.0, 1053.0, 0.07690045914097664, 5.523916184153982, 0.17179354064415445], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ecc6907d-c0a7-4c22-ae6b-d67d2ea61737", 3, 0, 0.0, 329.3333333333333, 194, 522, 272.0, 522.0, 522.0, 522.0, 0.05953798523457966, 0.026939387850281816, 0.03818028350003969], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 457.54545454545445, 124, 977, 461.0, 821.8, 957.0499999999997, 977.0, 0.09331009063802896, 0.057316452159492395, 0.04219001168496817], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 114.35, 110, 119, 114.5, 117.9, 118.95, 119.0, 0.09256002517632685, 0.06878728433514134, 0.04646079388733594], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 179.5, 108, 346, 117.0, 340.20000000000005, 345.75, 346.0, 0.09255874009042989, 0.09427613858820154, 0.04890066248918219], "isController": false}, {"data": ["login", 22, 0, 0.0, 2192.636363636364, 1474, 3340, 2056.5, 3086.7, 3304.7499999999995, 3340.0, 0.0917879031887952, 20.093369419191184, 0.166161854929219], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/0d9e8aa1-143c-4623-95d8-981cc66169ef", 1, 0, 0.0, 470.0, 470, 470, 470.0, 470.0, 470.0, 470.0, 2.127659574468085, 0.6794381648936171, 1.26953125], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 156.43750000000003, 112, 456, 120.0, 365.0000000000001, 456.0, 456.0, 0.0911867961519172, 0.07382212305658141, 0.03241405644462682], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/75c88e6f-da64-47c0-94f8-10da8939dbe9", 3, 0, 0.0, 383.33333333333337, 215, 662, 273.0, 662.0, 662.0, 662.0, 0.022487744179422214, 0.02657975231623765, 0.0144208515733925], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 676.3499999999999, 224, 1275, 569.5, 1248.9, 1274.15, 1275.0, 0.09251036116044997, 55.40896337225706, 0.19622314886767317], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=124a09b7-1c27-40d8-8a0d-e3f743568d62", 1, 0, 0.0, 360.0, 360, 360, 360.0, 360.0, 360.0, 360.0, 2.7777777777777777, 0.5018446180555556, 1.9151475694444444], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2b653c60-1f79-4515-8d1e-c8012a83063c", 1, 0, 0.0, 443.0, 443, 443, 443.0, 443.0, 443.0, 443.0, 2.257336343115124, 0.40781955417607224, 1.5563275959367946], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 372.53333333333336, 224, 1004, 239.0, 681.2000000000002, 1004.0, 1004.0, 0.12002880691365928, 9.746698582659839, 0.26790023355605347], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, 33.333333333333336, 721.0, 113, 1127, 941.5, 1127.0, 1127.0, 1127.0, 0.04277495383869565, 34.11962572806536, 0.0737492001974777], "isController": false}, {"data": ["register", 23, 5, 21.73913043478261, 985.7391304347825, 133, 1963, 961.0, 1789.0000000000005, 1950.9999999999998, 1963.0, 0.09272361509217937, 0.029354079234344826, 0.04183428727791686], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/77dc3470-d5a4-4147-b8a7-2d04bd95641d", 3, 0, 0.0, 309.0, 209, 495, 223.0, 495.0, 495.0, 495.0, 0.024565397181530096, 0.02463736611858536, 0.01575320066654111], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 120.14285714285714, 116, 128, 118.5, 127.0, 128.0, 128.0, 0.06810398505603985, 0.05287369933549969, 0.024208838437889166], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 362.87499999999994, 229, 1193, 239.0, 685.5000000000005, 1193.0, 1193.0, 0.09244386923814696, 7.046503464117334, 0.2064301391569119], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d573720b-5236-4e9e-93e9-25f6b86b26cc", 1, 0, 0.0, 463.0, 463, 463, 463.0, 463.0, 463.0, 463.0, 2.1598272138228944, 0.3902031587473002, 1.4890996220302375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 378.17647058823525, 224, 699, 447.0, 670.1999999999999, 699.0, 699.0, 0.09949957566357438, 0.1542049087676685, 0.2237768776886834], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 112.875, 109, 119, 113.5, 119.0, 119.0, 119.0, 0.04476075377109351, 0.033264583613088046, 0.02246780023275592], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 195.125, 107, 343, 116.0, 343.0, 343.0, 343.0, 0.044708972531925004, 0.020356990667001983, 0.025028729007740242], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 218.875, 108, 968, 112.0, 968.0, 968.0, 968.0, 0.04454913491148644, 5.021180198814436, 0.0257114636061411], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 181.625, 107, 667, 113.0, 667.0, 667.0, 667.0, 0.04462393181463219, 1.6506388020426603, 0.02579821058033423], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5a424d3e-4eb2-48c1-b402-45d8e2660488", 1, 0, 0.0, 207.0, 207, 207, 207.0, 207.0, 207.0, 207.0, 4.830917874396135, 0.8727732487922706, 3.330691425120773], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 120.0, 120, 120, 120.0, 120.0, 120.0, 120.0, 8.333333333333334, 2.457682291666667, 5.1513671875], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1076.4363636363632, 856, 1617, 928.0, 1457.2, 1527.6, 1617.0, 0.25111288665677434, 300.41831340600385, 0.49584986017577903], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, 21.73913043478261, 985.7391304347825, 133, 1963, 961.0, 1789.0000000000005, 1950.9999999999998, 1963.0, 0.09044293444066943, 0.02863207027809236, 0.04080530831209891], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 112.88888888888889, 108, 116, 113.0, 116.0, 116.0, 116.0, 0.04938271604938271, 0.013310185185185185, 0.029079861111111112], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 179.88888888888889, 109, 484, 115.0, 484.0, 484.0, 484.0, 0.049383799918791084, 0.013310477321861658, 0.029032272999133038], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 381.4285714285714, 108, 1023, 116.5, 1021.0, 1023.0, 1023.0, 0.0664903090374578, 17.106542854191503, 0.0374564547842152], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 300.0, 106, 908, 114.5, 849.5, 908.0, 908.0, 0.06644139868635864, 5.594499245415544, 0.03749378594954251], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 163.07142857142856, 110, 344, 116.0, 341.0, 344.0, 344.0, 0.06669143777212488, 0.04956267982869828, 0.03347597560046112], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 136.11111111111111, 108, 328, 114.0, 328.0, 328.0, 328.0, 0.049384070893577325, 0.013214097094570495, 0.02816435293149332], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 191.28571428571428, 106, 343, 116.0, 343.0, 343.0, 343.0, 0.06662795899525038, 0.04642020469060831, 0.036399984294838234], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 141.11111111111111, 110, 338, 116.0, 338.0, 338.0, 338.0, 0.049377839225755484, 0.036695835596484296, 0.024785360705115545], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 197.88888888888889, 115, 349, 120.0, 349.0, 349.0, 349.0, 0.0533731853116994, 0.0420105345324509, 0.018972499466268146], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 476.53846153846155, 113, 695, 487.0, 681.8, 695.0, 695.0, 0.08423453486337806, 0.015781319857967616, 0.05732909298844691], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1210.4545454545455, 802, 1657, 1198.5, 1512.2, 1638.6999999999998, 1657.0, 0.09315678710710067, 0.048215915201917335, 0.04284848313226993], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 323.3333333333333, 224, 683, 231.0, 683.0, 683.0, 683.0, 0.04934697503043063, 0.07647817321610685, 0.11098250341316578], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/34366a66-76b0-4dff-afc3-6d869bb98e62", 3, 0, 0.0, 340.3333333333333, 267, 446, 308.0, 446.0, 446.0, 446.0, 0.02002710334652897, 0.027608978734554097, 0.012842901560111352], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/797ab835-6604-48a0-880e-3502f59f93cf", 1, 0, 0.0, 505.0, 505, 505, 505.0, 505.0, 505.0, 505.0, 1.9801980198019802, 0.6323483910891089, 1.1815439356435644], "isController": false}, {"data": ["addBook", 61, 7, 11.475409836065573, 1099.0000000000002, 584, 1967, 932.0, 1722.2, 1783.8, 1967.0, 0.2681118334014601, 95.67066262493572, 0.9724762668833538], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/92aed9e8-97b3-4d2a-9481-ddfd2cb7768e", 3, 0, 0.0, 720.0, 207, 1399, 554.0, 1399.0, 1399.0, 1399.0, 0.05172592158350288, 0.03325478357012311, 0.03317059424462913], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 193.99999999999997, 111, 486, 118.0, 445.2, 464.4, 486.0, 0.2520276772212803, 0.1872979124662054, 0.12182978537552125], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 639.218181818182, 538, 1035, 573.0, 806.8, 869.1999999999997, 1035.0, 0.2516989680342311, 74.00785379436195, 0.12658688333752832], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=09adaeea-3986-4d64-9f7e-0d4bf24e7c97", 1, 0, 0.0, 433.0, 433, 433, 433.0, 433.0, 433.0, 433.0, 2.3094688221709005, 0.417238019630485, 1.5922704965357968], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 179.16363636363636, 108, 444, 116.0, 347.2, 361.1999999999998, 444.0, 0.25220680958385877, 0.4462878310214376, 0.12265526481715007], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 875.6545454545454, 739, 1150, 802.0, 1036.6, 1056.9999999999998, 1150.0, 0.2516874499485185, 226.46880988302254, 0.12633530202493992], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 120.29411764705883, 114, 130, 119.0, 126.8, 130.0, 130.0, 0.10005473582606955, 0.07474792276068673, 0.03556633187567316], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ecc6907d-c0a7-4c22-ae6b-d67d2ea61737", 1, 0, 0.0, 195.0, 195, 195, 195.0, 195.0, 195.0, 195.0, 5.128205128205129, 0.9264823717948718, 3.535657051282051], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 7, 3.9548022598870056, 173.68361581920905, 108, 1120, 121.0, 272.0000000000001, 348.29999999999995, 1091.1399999999999, 0.740245075488269, 1.5617934410417798, 0.3578700702605495], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 182.37500000000003, 113, 369, 120.5, 369.0, 369.0, 369.0, 0.04581166823189867, 0.03547720010536684, 0.01628461644180773], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=54681a21-2fdf-4d68-9ee5-c9659f1afe39", 1, 0, 0.0, 481.0, 481, 481, 481.0, 481.0, 481.0, 481.0, 2.079002079002079, 0.37560096153846156, 1.4333744802494803], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/124a09b7-1c27-40d8-8a0d-e3f743568d62", 3, 0, 0.0, 390.0, 222, 521, 427.0, 521.0, 521.0, 521.0, 0.03241771303840418, 0.026708734277409177, 0.020788702697153723], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 135.4666666666667, 111, 331, 119.0, 224.20000000000005, 331.0, 331.0, 0.10729690484195166, 0.087073953050451, 0.0381406966430375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=75c88e6f-da64-47c0-94f8-10da8939dbe9", 1, 0, 0.0, 426.0, 426, 426, 426.0, 426.0, 426.0, 426.0, 2.347417840375587, 0.42409404342723006, 1.6184345657276995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 392.0, 224, 1083, 234.0, 1083.0, 1083.0, 1083.0, 0.04451938540988442, 6.717954607269459, 0.09870130344413096], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=34366a66-76b0-4dff-afc3-6d869bb98e62", 1, 0, 0.0, 391.0, 391, 391, 391.0, 391.0, 391.0, 391.0, 2.557544757033248, 0.46205642583120204, 1.7633072250639386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 574.3571428571429, 226, 1368, 347.5, 1300.5, 1368.0, 1368.0, 0.06640389696012446, 22.77126547744402, 0.14448961786928868], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5a424d3e-4eb2-48c1-b402-45d8e2660488", 3, 0, 0.0, 328.6666666666667, 214, 537, 235.0, 537.0, 537.0, 537.0, 0.07292527590062715, 0.03299678824930721, 0.04676523226700374], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 131.47058823529414, 112, 326, 119.0, 168.39999999999986, 326.0, 326.0, 0.07731560228854183, 0.06410248666305861, 0.027483280501005104], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 121.29999999999998, 117, 129, 119.0, 128.0, 128.95, 129.0, 0.09497578117580018, 0.07373608011207142, 0.03376092221483522], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/942e14cc-0d05-4f6d-9893-8ea83f00337c", 1, 0, 0.0, 292.0, 292, 292, 292.0, 292.0, 292.0, 292.0, 3.4246575342465753, 1.0936162243150687, 2.043423587328767], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bf317f9f-acee-4c95-91a7-e3ca9f45e0a8", 1, 0, 0.0, 422.0, 422, 422, 422.0, 422.0, 422.0, 422.0, 2.3696682464454977, 0.4281138921800948, 1.6337751777251186], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=77dc3470-d5a4-4147-b8a7-2d04bd95641d", 1, 0, 0.0, 430.0, 430, 430, 430.0, 430.0, 430.0, 430.0, 2.3255813953488373, 0.42014898255813954, 1.6033793604651163], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 141.64705882352942, 108, 346, 116.0, 331.59999999999997, 346.0, 346.0, 0.09956542619859203, 0.07399344661828959, 0.04997717682234014], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 152.76470588235293, 108, 342, 115.0, 342.0, 342.0, 342.0, 0.09956834195282804, 0.026642310249096565, 0.05678507001997224], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 206.00000000000003, 108, 352, 117.0, 344.0, 352.0, 352.0, 0.0995689251241683, 0.02683693684987349, 0.05853563762182551], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 192.05882352941174, 108, 349, 116.0, 347.4, 349.0, 349.0, 0.09957067467917743, 0.02683740840962204, 0.058633903155804676], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 31.25, 0.3831417624521073], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 6.25, 0.07662835249042145], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 6.25, 0.07662835249042145], "isController": false}, {"data": ["401/Unauthorized", 9, 56.25, 0.6896551724137931], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1305, 16, "401/Unauthorized", 9, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
