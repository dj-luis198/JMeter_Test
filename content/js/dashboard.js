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

    var data = {"OkPercent": 98.63429438543247, "KoPercent": 1.3657056145675266};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.825211176088369, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.375, 500, 1500, "see books"], "isController": true}, {"data": [0.6333333333333333, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6333333333333333, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f49262d0-87a6-4940-ac73-e9d5ce087123"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0f7ab405-809a-4fdd-a80f-f8efd25ee845"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/098bbab5-f8b5-4eeb-863b-4b6eb993aa2d"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7e2263eb-f738-4015-b5f0-c2a25d3c19f5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=01e8dcfb-b8a9-4ed4-82e5-46fc94f681ef"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8fad2b3e-69c1-4f58-82cb-e692cb88ee03"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9187efc3-990e-4322-ad0f-0a026687ff46"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=39cb0418-7783-43bb-b2f3-d143fc797c1c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8180a430-c092-408e-8ba2-834e8d74120c"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/50d97aae-0e66-4271-a713-bb2343bacf6b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8aad9e2a-b2d7-431c-974b-aba4b14df559"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=57bcbd23-b1e0-4769-85d1-3c8946e58317"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/84c0ad9f-9eb3-4503-aa22-ea265c774257"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/875fef31-26a5-4d3c-b51e-126ab991cda5"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.022727272727272728, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/16a16214-5fa8-431f-8aa2-a9e5dc55ecac"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=57105c33-07c4-40bf-bb51-085a47aca43f"], "isController": false}, {"data": [0.3125, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3125, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=098bbab5-f8b5-4eeb-863b-4b6eb993aa2d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0f7ab405-809a-4fdd-a80f-f8efd25ee845"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f49262d0-87a6-4940-ac73-e9d5ce087123"], "isController": false}, {"data": [0.4090909090909091, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8180a430-c092-408e-8ba2-834e8d74120c"], "isController": false}, {"data": [0.4322033898305085, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8fad2b3e-69c1-4f58-82cb-e692cb88ee03"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7e2263eb-f738-4015-b5f0-c2a25d3c19f5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/57bcbd23-b1e0-4769-85d1-3c8946e58317"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9568965517241379, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8aad9e2a-b2d7-431c-974b-aba4b14df559"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/39cb0418-7783-43bb-b2f3-d143fc797c1c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/9187efc3-990e-4322-ad0f-0a026687ff46"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/57105c33-07c4-40bf-bb51-085a47aca43f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=16a16214-5fa8-431f-8aa2-a9e5dc55ecac"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/01e8dcfb-b8a9-4ed4-82e5-46fc94f681ef"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=875fef31-26a5-4d3c-b51e-126ab991cda5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1318, 18, 1.3657056145675266, 299.1775417298935, 78, 2448, 96.0, 873.2000000000003, 1034.05, 1366.4299999999998, 5.243892734940718, 736.4098121568393, 3.8321782744489536], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1357.892857142857, 981, 1827, 1368.5, 1674.2000000000003, 1727.25, 1827.0, 0.24949877478280238, 300.23196024309425, 1.2267835263978615], "isController": true}, {"data": ["deleteBook", 15, 1, 6.666666666666667, 590.1333333333334, 85, 1161, 515.0, 1122.6, 1161.0, 1161.0, 0.08809330843229148, 0.01658631822826738, 0.05959489374478781], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 1, 6.666666666666667, 590.1333333333334, 85, 1161, 515.0, 1122.6, 1161.0, 1161.0, 0.0889152341434499, 0.016741071428571428, 0.06015092434795495], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 13, 0, 0.0, 156.3846153846154, 81, 247, 83.0, 246.2, 247.0, 247.0, 0.10086746015735325, 0.05029734078459366, 0.056222697894197794], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 13, 0, 0.0, 82.84615384615385, 81, 87, 83.0, 86.2, 87.0, 87.0, 0.10086746015735325, 0.07496107146459552, 0.05063073683679645], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 13, 0, 0.0, 238.46153846153848, 80, 728, 242.0, 633.1999999999999, 728.0, 728.0, 0.10086902545003104, 4.585903553693358, 0.05806485441883923], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f49262d0-87a6-4940-ac73-e9d5ce087123", 1, 0, 0.0, 675.0, 675, 675, 675.0, 675.0, 675.0, 675.0, 1.4814814814814814, 0.26765046296296297, 1.021412037037037], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 13, 0, 0.0, 234.6153846153846, 80, 948, 82.0, 922.8, 948.0, 948.0, 0.10086746015735325, 13.986191705397184, 0.05796544998525783], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0f7ab405-809a-4fdd-a80f-f8efd25ee845", 1, 0, 0.0, 780.0, 780, 780, 780.0, 780.0, 780.0, 780.0, 1.2820512820512822, 0.23162059294871795, 0.8839142628205128], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/098bbab5-f8b5-4eeb-863b-4b6eb993aa2d", 3, 0, 0.0, 540.3333333333333, 179, 1221, 221.0, 1221.0, 1221.0, 1221.0, 0.027609309859284552, 0.027869944620325972, 0.01770518893971047], "isController": false}, {"data": ["goToProfile", 15, 1, 6.666666666666667, 236.2, 83, 473, 193.0, 386.00000000000006, 473.0, 473.0, 0.08824982938366319, 0.18922004433083095, 0.05704639036135363], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7e2263eb-f738-4015-b5f0-c2a25d3c19f5", 1, 0, 0.0, 254.0, 254, 254, 254.0, 254.0, 254.0, 254.0, 3.937007874015748, 0.7112758366141733, 2.714382381889764], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=01e8dcfb-b8a9-4ed4-82e5-46fc94f681ef", 1, 0, 0.0, 416.0, 416, 416, 416.0, 416.0, 416.0, 416.0, 2.403846153846154, 0.4342886117788462, 1.6573392427884617], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8fad2b3e-69c1-4f58-82cb-e692cb88ee03", 1, 0, 0.0, 382.0, 382, 382, 382.0, 382.0, 382.0, 382.0, 2.617801047120419, 0.47294257198952877, 1.804851112565445], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 101.64705882352939, 80, 245, 83.0, 240.2, 245.0, 245.0, 0.0846074215639433, 0.06287719512711021, 0.04246895965221373], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9187efc3-990e-4322-ad0f-0a026687ff46", 1, 0, 0.0, 490.0, 490, 490, 490.0, 490.0, 490.0, 490.0, 2.0408163265306123, 0.3687021683673469, 1.407047193877551], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 102.29411764705884, 80, 244, 82.0, 243.2, 244.0, 244.0, 0.08460910593060063, 0.03759000604706257, 0.04741764921064681], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 560.0, 478, 651, 555.5, 651.0, 651.0, 651.0, 0.05066711704104037, 14.897814716686371, 0.028896090187468332], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 892.6666666666666, 720, 1045, 885.0, 1045.0, 1045.0, 1045.0, 0.05050122465469788, 45.44109071598111, 0.02875216208368053], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=39cb0418-7783-43bb-b2f3-d143fc797c1c", 1, 0, 0.0, 413.0, 413, 413, 413.0, 413.0, 413.0, 413.0, 2.4213075060532687, 0.4374432506053269, 1.6693780266343827], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 164.0, 81, 255, 161.0, 255.0, 255.0, 255.0, 0.05076915266284206, 0.08983760217291974, 0.028111435117022895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 20, 0, 0.0, 83.94999999999999, 81, 107, 83.0, 84.9, 105.89999999999998, 107.0, 0.11599784244013062, 0.08620542782904238, 0.05822547950608119], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 20, 0, 0.0, 129.9, 80, 245, 82.0, 244.8, 245.0, 245.0, 0.11588761219369455, 0.03971187804567131, 0.06560551639519994], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8180a430-c092-408e-8ba2-834e8d74120c", 3, 0, 0.0, 287.3333333333333, 166, 368, 328.0, 368.0, 368.0, 368.0, 0.01812842173960335, 0.02499149286042324, 0.011625322534836785], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 20, 0, 0.0, 141.6, 80, 788, 82.5, 244.70000000000002, 760.8499999999996, 788.0, 0.11599784244013062, 5.248454917801029, 0.06769561586154497], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 20, 0, 0.0, 141.85000000000002, 80, 639, 82.0, 243.70000000000002, 619.2499999999998, 639.0, 0.11589164131537014, 1.7334741235694626, 0.06774681297986383], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/50d97aae-0e66-4271-a713-bb2343bacf6b", 1, 0, 0.0, 188.0, 188, 188, 188.0, 188.0, 188.0, 188.0, 5.319148936170213, 1.6985954122340425, 3.173828125], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 82.16666666666667, 80, 84, 82.5, 84.0, 84.0, 84.0, 0.05083625641807737, 0.03777967884195008, 0.028545749453510245], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 551.611111111111, 81, 1035, 870.5, 974.7, 1035.0, 1035.0, 0.10254365226308143, 51.272816407696475, 0.05538870453185974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 214.52941176470594, 79, 892, 86.0, 880.8, 892.0, 892.0, 0.08454136310515453, 8.969572491110723, 0.04884633674814133], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 398.6111111111111, 80, 808, 556.0, 735.1000000000001, 808.0, 808.0, 0.10254365226308143, 16.762971950038455, 0.05548884481727291], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 163.23529411764707, 79, 484, 89.0, 414.3999999999999, 484.0, 484.0, 0.08454094268124086, 2.9445579254647263, 0.04892865334981052], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8aad9e2a-b2d7-431c-974b-aba4b14df559", 3, 0, 0.0, 369.3333333333333, 262, 520, 326.0, 520.0, 520.0, 520.0, 0.028853089685020438, 0.028937620221207022, 0.018502795143063237], "isController": false}, {"data": ["deleteBooks", 15, 1, 6.666666666666667, 417.66666666666663, 90, 780, 413.0, 717.0, 780.0, 780.0, 0.08891365298779512, 0.0167407737266083, 0.06087922450993758], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=57bcbd23-b1e0-4769-85d1-3c8946e58317", 1, 0, 0.0, 360.0, 360, 360, 360.0, 360.0, 360.0, 360.0, 2.7777777777777777, 0.5018446180555556, 1.9151475694444444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 20, 0, 0.0, 267.1, 165, 870, 169.5, 347.1, 843.9499999999996, 870.0, 0.11583257559523466, 7.099343491729553, 0.2590283348198514], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/84c0ad9f-9eb3-4503-aa22-ea265c774257", 1, 0, 0.0, 175.0, 175, 175, 175.0, 175.0, 175.0, 175.0, 5.714285714285714, 1.8247767857142858, 3.4095982142857144], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/875fef31-26a5-4d3c-b51e-126ab991cda5", 3, 0, 0.0, 826.0, 193, 2089, 196.0, 2089.0, 2089.0, 2089.0, 0.017877787445025804, 0.024645973251850348, 0.011464596766504177], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 379.54545454545456, 118, 992, 300.5, 738.3, 957.4999999999995, 992.0, 0.0979266262496773, 0.06015219522563185, 0.044277371048438076], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 83.3888888888889, 81, 93, 83.0, 86.70000000000002, 93.0, 93.0, 0.10254306808859721, 0.07620632306193602, 0.05147181347415915], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 120.38888888888887, 80, 251, 83.0, 245.60000000000002, 251.0, 251.0, 0.10254423644422164, 0.1130033925051557, 0.053697752287306166], "isController": false}, {"data": ["login", 22, 0, 0.0, 2238.045454545454, 1309, 4211, 1999.0, 3120.2999999999997, 4055.899999999998, 4211.0, 0.10011604359598625, 32.80209198445926, 0.19633019238207922], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 87.70588235294119, 83, 101, 87.0, 96.19999999999999, 101.0, 101.0, 0.08530624943547335, 0.0690614070136791, 0.030323705854015916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 636.2777777777778, 166, 1117, 955.0, 1057.6000000000001, 1117.0, 1117.0, 0.10249518842032138, 68.19275359017868, 0.21594499496065325], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/16a16214-5fa8-431f-8aa2-a9e5dc55ecac", 3, 0, 0.0, 290.0, 176, 484, 210.0, 484.0, 484.0, 484.0, 0.06903216899074968, 0.0312352587555801, 0.04426867607805238], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 13, 0, 0.0, 406.4615384615384, 166, 1031, 327.0, 1006.1999999999999, 1031.0, 1031.0, 0.10080254332570852, 18.685249207633852, 0.22273939392470826], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, 25.0, 752.1250000000001, 81, 1130, 952.5, 1130.0, 1130.0, 1130.0, 0.06728682692145946, 60.37832938373677, 0.1249389556033105], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=57105c33-07c4-40bf-bb51-085a47aca43f", 1, 0, 0.0, 402.0, 402, 402, 402.0, 402.0, 402.0, 402.0, 2.487562189054726, 0.4494130907960199, 1.7150575248756217], "isController": false}, {"data": ["register", 24, 7, 29.166666666666668, 923.1666666666667, 129, 1798, 1004.5, 1520.5, 1769.5, 1798.0, 0.09565754598537236, 0.030033106478805874, 0.04315799438011917], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 88.85714285714286, 82, 129, 84.5, 113.5, 129.0, 129.0, 0.07553073831296701, 0.0586395868738367, 0.026848817134687494], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 337.6470588235294, 164, 977, 173.0, 965.0, 977.0, 977.0, 0.08450564199433315, 12.009456592993489, 0.1875114564174579], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 246.83333333333337, 163, 488, 170.0, 349.4000000000002, 488.0, 488.0, 0.12104258008984049, 0.18759235801032897, 0.2722275995575221], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 83.37500000000001, 81, 86, 83.5, 86.0, 86.0, 86.0, 0.038523769165575164, 0.028629480795901073, 0.019337126319439096], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 81.875, 79, 84, 82.0, 84.0, 84.0, 84.0, 0.038524696738402864, 0.010308366119455454, 0.021971116108620382], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 82.375, 81, 88, 81.5, 88.0, 88.0, 88.0, 0.03852432570391166, 0.010383509662382441, 0.022648089915776194], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 81.74999999999999, 80, 84, 82.0, 84.0, 84.0, 84.0, 0.03852432570391166, 0.010383509662382441, 0.02268571132759642], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 90.0, 90, 90, 90.0, 90.0, 90.0, 90.0, 11.11111111111111, 3.2769097222222223, 6.868489583333334], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 958.4107142857142, 641, 1470, 909.0, 1313.8000000000002, 1377.6499999999999, 1470.0, 0.24799939771574842, 296.6934982086472, 0.4897019357238704], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, 29.166666666666668, 923.1666666666667, 129, 1798, 1004.5, 1520.5, 1769.5, 1798.0, 0.09854927258318175, 0.030941006968254817, 0.044462660091240204], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 82.42857142857142, 80, 85, 83.0, 85.0, 85.0, 85.0, 0.031139759690025935, 0.008393138353952303, 0.018337182708091444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 82.42857142857143, 80, 86, 82.0, 86.0, 86.0, 86.0, 0.03114003674524336, 0.008393213028991374, 0.018306935664684085], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=098bbab5-f8b5-4eeb-863b-4b6eb993aa2d", 1, 0, 0.0, 459.0, 459, 459, 459.0, 459.0, 459.0, 459.0, 2.1786492374727673, 0.3936036220043573, 1.502076525054466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 82.21428571428571, 80, 86, 82.0, 86.0, 86.0, 86.0, 0.07501714677640604, 0.02021946534207819, 0.04410187730409808], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0f7ab405-809a-4fdd-a80f-f8efd25ee845", 3, 0, 0.0, 352.6666666666667, 320, 410, 328.0, 410.0, 410.0, 410.0, 0.03533027922697349, 0.028717352613851825, 0.022656461613651622], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 82.07142857142857, 79, 87, 81.5, 87.0, 87.0, 87.0, 0.07501714677640604, 0.02021946534207819, 0.044175136236496916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 82.85714285714285, 79, 87, 83.0, 87.0, 87.0, 87.0, 0.031139759690025935, 0.00833231851080772, 0.017759394198217916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 83.78571428571428, 81, 95, 82.5, 92.5, 95.0, 95.0, 0.07501634284612005, 0.055749450103415386, 0.03765468771768135], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 83.28571428571429, 81, 87, 82.0, 87.0, 87.0, 87.0, 0.031139482639738432, 0.023141744422696234, 0.015630560621899953], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 93.5, 80, 241, 82.0, 163.5, 241.0, 241.0, 0.07501674480910918, 0.020072839919624916, 0.042782987273945076], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 109.42857142857143, 84, 249, 85.0, 249.0, 249.0, 249.0, 0.03137915885923309, 0.02469883011771667, 0.011154310375743014], "isController": false}, {"data": ["deleteAccount", 15, 1, 6.666666666666667, 631.1333333333333, 81, 2089, 484.0, 1568.2000000000003, 2089.0, 2089.0, 0.08798995741286061, 0.01640646080927297, 0.0598858733589873], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f49262d0-87a6-4940-ac73-e9d5ce087123", 3, 0, 0.0, 281.0, 200, 391, 252.0, 391.0, 391.0, 391.0, 0.04556500607533415, 0.0292939085282503, 0.029219746734507897], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1314.363636363636, 738, 2448, 1255.0, 2243.7999999999997, 2443.2, 2448.0, 0.09736667404292984, 0.05039486058862581, 0.04478486667404293], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 167.57142857142856, 163, 171, 170.0, 171.0, 171.0, 171.0, 0.03112771255780861, 0.0482418748332444, 0.07000695509827463], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8180a430-c092-408e-8ba2-834e8d74120c", 1, 0, 0.0, 469.0, 469, 469, 469.0, 469.0, 469.0, 469.0, 2.1321961620469083, 0.3852112206823028, 1.4700493070362475], "isController": false}, {"data": ["addBook", 59, 7, 11.864406779661017, 856.3728813559321, 420, 1642, 717.0, 1402.0, 1461.0, 1642.0, 0.26427534803719566, 81.3976601763366, 0.9613663175469872], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 155.21428571428578, 81, 337, 83.5, 329.3, 333.45, 337.0, 0.24888667656287497, 0.18496363365658972, 0.12031143056506163], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8fad2b3e-69c1-4f58-82cb-e692cb88ee03", 3, 0, 0.0, 305.3333333333333, 175, 396, 345.0, 396.0, 396.0, 396.0, 0.023933560436229028, 0.024003678289069543, 0.015348018899534892], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7e2263eb-f738-4015-b5f0-c2a25d3c19f5", 3, 0, 0.0, 473.66666666666663, 180, 754, 487.0, 754.0, 754.0, 754.0, 0.06891482128089682, 0.03118216197280162, 0.044193423803179276], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/57bcbd23-b1e0-4769-85d1-3c8946e58317", 3, 0, 0.0, 367.3333333333333, 236, 456, 410.0, 456.0, 456.0, 456.0, 0.02160807277598911, 0.025540010497922025, 0.01385673937783156], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 512.3928571428571, 393, 732, 478.5, 656.3000000000001, 727.15, 732.0, 0.24859720150578876, 73.09583144665814, 0.12502691286668086], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 143.85714285714286, 80, 336, 86.0, 249.0, 261.9, 336.0, 0.24903277449192865, 0.44067127673767065, 0.1211116422822075], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 800.2678571428573, 557, 1133, 793.5, 1030.6, 1056.0, 1133.0, 0.24840973411286674, 223.51951541249323, 0.12469004231837257], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 96.77777777777777, 83, 255, 86.0, 116.40000000000022, 255.0, 255.0, 0.12113870381586916, 0.09049912931556632, 0.043061023622047244], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 7, 4.022988505747127, 140.3735632183908, 81, 934, 89.5, 283.5, 347.0, 526.0, 0.7351481069936245, 1.574650144494628, 0.3537231858424839], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 87.25, 85, 90, 87.0, 90.0, 90.0, 90.0, 0.03947887879984208, 0.030572998914330834, 0.014033507698381367], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8aad9e2a-b2d7-431c-974b-aba4b14df559", 1, 0, 0.0, 503.0, 503, 503, 503.0, 503.0, 503.0, 503.0, 1.9880715705765406, 0.3591730864811133, 1.3706821570576542], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 13, 0, 0.0, 88.53846153846153, 83, 103, 85.0, 100.2, 103.0, 103.0, 0.09491822429906542, 0.0770283636645736, 0.03374046254380841], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/39cb0418-7783-43bb-b2f3-d143fc797c1c", 3, 0, 0.0, 372.3333333333333, 185, 530, 402.0, 530.0, 530.0, 530.0, 0.042278530961977506, 0.027181021695932808, 0.027112208982778545], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9187efc3-990e-4322-ad0f-0a026687ff46", 3, 0, 0.0, 864.0, 312, 1599, 681.0, 1599.0, 1599.0, 1599.0, 0.04725004725004725, 0.030377227642852646, 0.03030032326907327], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/57105c33-07c4-40bf-bb51-085a47aca43f", 3, 0, 0.0, 485.3333333333333, 291, 692, 473.0, 692.0, 692.0, 692.0, 0.018781576525533552, 0.022199187618558703, 0.012044175050553744], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=16a16214-5fa8-431f-8aa2-a9e5dc55ecac", 1, 0, 0.0, 162.0, 162, 162, 162.0, 162.0, 162.0, 162.0, 6.172839506172839, 1.115210262345679, 4.255883487654321], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 166.75, 163, 172, 166.5, 172.0, 172.0, 172.0, 0.03850874870634672, 0.05968103925485571, 0.08660707838937158], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 178.71428571428572, 164, 323, 167.0, 251.0, 323.0, 323.0, 0.07498299492793599, 0.11620899702210391, 0.16863851300687166], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/01e8dcfb-b8a9-4ed4-82e5-46fc94f681ef", 3, 0, 0.0, 385.6666666666667, 177, 540, 440.0, 540.0, 540.0, 540.0, 0.02617892422074069, 0.03094260216325177, 0.016787916899368215], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 20, 0, 0.0, 109.95000000000002, 82, 251, 86.0, 245.9, 250.75, 251.0, 0.11617572740527321, 0.0963214771162861, 0.04129684060109322], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 106.11111111111111, 82, 252, 86.5, 252.0, 252.0, 252.0, 0.09838323549667137, 0.07638151583970092, 0.0349721657429574], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=875fef31-26a5-4d3c-b51e-126ab991cda5", 1, 0, 0.0, 410.0, 410, 410, 410.0, 410.0, 410.0, 410.0, 2.4390243902439024, 0.4406440548780488, 1.681592987804878], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 91.94444444444444, 80, 244, 83.0, 102.70000000000022, 244.0, 244.0, 0.12110936175366356, 0.09000412528763473, 0.0607912225990069], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 118.05555555555556, 81, 247, 82.0, 243.4, 247.0, 247.0, 0.1211118063825922, 0.032406870067217056, 0.06907157707757211], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 126.72222222222221, 80, 244, 83.0, 243.1, 244.0, 244.0, 0.12111343619004045, 0.032643855848096835, 0.07120145369766048], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 117.55555555555556, 78, 244, 83.0, 243.1, 244.0, 244.0, 0.1211118063825922, 0.03264341656405805, 0.07131876879756162], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 38.888888888888886, 0.5311077389984825], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.555555555555555, 0.07587253414264036], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.555555555555555, 0.07587253414264036], "isController": false}, {"data": ["401/Unauthorized", 9, 50.0, 0.6828528072837633], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1318, 18, "401/Unauthorized", 9, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
