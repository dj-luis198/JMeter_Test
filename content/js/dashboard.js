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

    var data = {"OkPercent": 99.60845732184808, "KoPercent": 0.39154267815191857};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7898453261600538, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ad95694d-962d-4e15-8f2c-155cb8068a4f"], "isController": false}, {"data": [0.12727272727272726, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/715739fa-535c-407d-9ccf-37bc90a5a7dc"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6923076923076923, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2faf617e-12f8-4a3c-89e7-04a5fec7d863"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bf03d5c4-752f-499c-849f-ca6e5caab8f5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fdb4843f-1b49-466c-9ed0-7c038e205555"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ccf59b1f-f6e0-4999-839f-3dfd2ea5a183"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=97a8e092-332d-4f8a-b8c7-a63786a0728a"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f8e7e617-d482-4317-a50e-2593e611019f"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6136363636363636, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4208e0a8-cb0e-4961-8791-5f0a6136c296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bf03d5c4-752f-499c-849f-ca6e5caab8f5"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=12cb4f08-a301-49e3-a794-dc4215fa6228"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8956b18c-cc3a-4f47-96d1-968dc6bda98a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ab85729e-1595-473b-95db-121a72948e5c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0ceb1903-2878-44ed-a3f8-2846c7696aab"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b886f1bd-6917-4444-9fb6-a0842786f99a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2faf617e-12f8-4a3c-89e7-04a5fec7d863"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/de639b83-79e4-456a-a0c0-3761c849185b"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.34782608695652173, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c0c63d08-682d-4376-b701-c2c21ce67f80"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/9c06f585-e7e4-4265-8c81-41151739ef02"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fdb4843f-1b49-466c-9ed0-7c038e205555"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.43636363636363634, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.34782608695652173, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ad95694d-962d-4e15-8f2c-155cb8068a4f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/74b45e68-8b14-4a14-a6d2-4518c3f908bf"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/0ceb1903-2878-44ed-a3f8-2846c7696aab"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/97a8e092-332d-4f8a-b8c7-a63786a0728a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ccf59b1f-f6e0-4999-839f-3dfd2ea5a183"], "isController": false}, {"data": [0.33620689655172414, 500, 1500, "addBook"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/4208e0a8-cb0e-4961-8791-5f0a6136c296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5272727272727272, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.97953216374269, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.925, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/12cb4f08-a301-49e3-a794-dc4215fa6228"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8956b18c-cc3a-4f47-96d1-968dc6bda98a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fa45116e-71c8-4c2b-81cd-b88f70e46121"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ab85729e-1595-473b-95db-121a72948e5c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c0c63d08-682d-4376-b701-c2c21ce67f80"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=de639b83-79e4-456a-a0c0-3761c849185b"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1277, 5, 0.39154267815191857, 375.1855912294434, 98, 2310, 149.0, 1011.0, 1214.4999999999995, 1665.88, 5.079615110761067, 736.1523610750626, 3.6938781402025485], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/ad95694d-962d-4e15-8f2c-155cb8068a4f", 3, 0, 0.0, 438.66666666666663, 187, 926, 203.0, 926.0, 926.0, 926.0, 0.01778547164106547, 0.024518708463513107, 0.011405396853157218], "isController": false}, {"data": ["see books", 55, 0, 0.0, 1681.5090909090914, 1240, 2292, 1643.0, 2000.0, 2092.9999999999995, 2292.0, 0.24916642505073933, 299.830688051847, 1.2251493653617898], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/715739fa-535c-407d-9ccf-37bc90a5a7dc", 1, 0, 0.0, 440.0, 440, 440, 440.0, 440.0, 440.0, 440.0, 2.2727272727272725, 0.7257634943181818, 1.3560901988636365], "isController": false}, {"data": ["deleteBook", 13, 0, 0.0, 723.6153846153848, 401, 1412, 548.0, 1360.3999999999999, 1412.0, 1412.0, 0.10237348999102262, 0.018495210594081237, 0.0695819814782732], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 0, 0.0, 723.6153846153848, 401, 1412, 548.0, 1360.3999999999999, 1412.0, 1412.0, 0.10062854135058984, 0.0181799610838468, 0.06839596169922904], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 180.66666666666666, 99, 305, 103.0, 304.4, 305.0, 305.0, 0.09016915733916828, 0.042184607072868696, 0.050414890835206845], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 158.39999999999998, 100, 307, 104.0, 306.4, 307.0, 307.0, 0.09027389098524925, 0.06708831156227996, 0.04531326168595519], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 301.6666666666667, 101, 808, 298.0, 807.4, 808.0, 808.0, 0.09027280441494195, 3.560180741199906, 0.05212431655964324], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 277.19999999999993, 100, 1117, 103.0, 1001.2, 1117.0, 1117.0, 0.09027334769682599, 10.851502881976625, 0.052036472689303205], "isController": false}, {"data": ["goToProfile", 13, 0, 0.0, 255.53846153846152, 195, 576, 204.0, 516.0, 576.0, 576.0, 0.1038197688812222, 0.2137539231893433, 0.06711785839782139], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/2faf617e-12f8-4a3c-89e7-04a5fec7d863", 3, 0, 0.0, 283.3333333333333, 195, 449, 206.0, 449.0, 449.0, 449.0, 0.03436032527774596, 0.028443459368915357, 0.022034453384492038], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bf03d5c4-752f-499c-849f-ca6e5caab8f5", 3, 0, 0.0, 543.6666666666666, 199, 982, 450.0, 982.0, 982.0, 982.0, 0.03348027453825121, 0.033578361280062495, 0.021470097929803023], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 117.50000000000001, 101, 303, 104.0, 203.5, 303.0, 303.0, 0.07129834282280324, 0.05298636610171218, 0.03578842598722741], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 102.57142857142856, 100, 111, 102.0, 108.0, 111.0, 111.0, 0.07129979526773074, 0.026727476267353858, 0.040235445292685655], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 784.0, 658, 880, 814.0, 880.0, 880.0, 880.0, 0.06609530943620702, 19.434215545065985, 0.03769498116283681], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 1027.6666666666667, 682, 1206, 1195.0, 1206.0, 1206.0, 1206.0, 0.06554511688879179, 58.977611392560625, 0.03731719057242735], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 109.0, 101, 117, 109.0, 117.0, 117.0, 117.0, 0.067150147730325, 0.11882428485092666, 0.03718177125302175], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fdb4843f-1b49-466c-9ed0-7c038e205555", 3, 0, 0.0, 331.3333333333333, 201, 571, 222.0, 571.0, 571.0, 571.0, 0.04136390585575027, 0.026593005880568614, 0.026525681815048188], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 133.92307692307693, 100, 301, 104.0, 300.6, 301.0, 301.0, 0.061515748031496065, 0.04571629321481299, 0.030878021961122045], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 149.0, 100, 305, 104.0, 304.6, 305.0, 305.0, 0.06151662131787531, 0.023567816159943217, 0.03468628001892819], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 202.30769230769232, 100, 1004, 102.0, 725.5999999999997, 1004.0, 1004.0, 0.06125574272588055, 4.255088386441277, 0.03560674107668748], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 217.69230769230768, 98, 803, 104.0, 604.5999999999998, 803.0, 803.0, 0.061313524348543806, 1.4020402222615258, 0.03570020486970876], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ccf59b1f-f6e0-4999-839f-3dfd2ea5a183", 1, 0, 0.0, 197.0, 197, 197, 197.0, 197.0, 197.0, 197.0, 5.076142131979695, 0.9170764593908629, 3.4997620558375635], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 102.33333333333333, 101, 103, 103.0, 103.0, 103.0, 103.0, 0.06714714176999866, 0.049901342663055646, 0.03770469386498948], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=97a8e092-332d-4f8a-b8c7-a63786a0728a", 1, 0, 0.0, 471.0, 471, 471, 471.0, 471.0, 471.0, 471.0, 2.1231422505307855, 0.3835755042462845, 1.463807059447983], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 21, 0, 0.0, 600.6666666666666, 99, 1230, 304.0, 1210.6, 1228.4, 1230.0, 0.09375041852865415, 40.183136629516206, 0.05127847947981911], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 187.57142857142856, 99, 1092, 103.0, 694.0, 1092.0, 1092.0, 0.0712994321509511, 4.600370064742431, 0.04147860380433399], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 21, 0, 0.0, 434.4285714285715, 100, 905, 306.0, 849.2, 900.4999999999999, 905.0, 0.09374832592275138, 13.139483558329315, 0.05136888599087516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 152.28571428571428, 100, 803, 103.0, 454.5, 803.0, 803.0, 0.07129979526773074, 1.515309641642136, 0.04154844375464722], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f8e7e617-d482-4317-a50e-2593e611019f", 1, 0, 0.0, 343.0, 343, 343, 343.0, 343.0, 343.0, 343.0, 2.9154518950437316, 0.9310085641399416, 1.7395909256559765], "isController": false}, {"data": ["deleteBooks", 13, 0, 0.0, 572.3076923076924, 193, 1373, 471.0, 1178.6, 1373.0, 1373.0, 0.10066282599269033, 0.018186155086570028, 0.06940229995199157], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 400.30769230769226, 201, 1305, 406.0, 1025.3999999999996, 1305.0, 1305.0, 0.06122487425352749, 5.721913383286552, 0.13649118038025357], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 678.7727272727271, 129, 1552, 698.0, 1379.4999999999995, 1551.55, 1552.0, 0.09568420732158157, 0.05877477188015118, 0.04326346483387917], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 21, 0, 0.0, 124.28571428571429, 101, 334, 104.0, 267.20000000000016, 331.19999999999993, 334.0, 0.09374748890654715, 0.06966976470496326, 0.047056845017544174], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4208e0a8-cb0e-4961-8791-5f0a6136c296", 1, 0, 0.0, 385.0, 385, 385, 385.0, 385.0, 385.0, 385.0, 2.5974025974025974, 0.4692573051948052, 1.7907873376623376], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 21, 0, 0.0, 179.0, 101, 325, 103.0, 306.8, 323.2, 325.0, 0.09374832592275138, 0.09213528274048678, 0.049716606623096016], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bf03d5c4-752f-499c-849f-ca6e5caab8f5", 1, 0, 0.0, 520.0, 520, 520, 520.0, 520.0, 520.0, 520.0, 1.9230769230769231, 0.3474308894230769, 1.3258713942307692], "isController": false}, {"data": ["login", 22, 0, 0.0, 2801.909090909091, 1797, 4280, 2722.5, 3878.1, 4232.449999999999, 4280.0, 0.09781473000911456, 16.095016971689304, 0.16969952537625327], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 123.64285714285714, 103, 309, 106.0, 222.5, 309.0, 309.0, 0.07140634802433937, 0.05780845948454817, 0.02538272527427688], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=12cb4f08-a301-49e3-a794-dc4215fa6228", 1, 0, 0.0, 202.0, 202, 202, 202.0, 202.0, 202.0, 202.0, 4.9504950495049505, 0.8943765470297029, 3.4131342821782176], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8956b18c-cc3a-4f47-96d1-968dc6bda98a", 3, 0, 0.0, 365.66666666666663, 182, 716, 199.0, 716.0, 716.0, 716.0, 0.021598894136620205, 0.025529161656923167, 0.013850853336309182], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ab85729e-1595-473b-95db-121a72948e5c", 1, 0, 0.0, 193.0, 193, 193, 193.0, 193.0, 193.0, 193.0, 5.181347150259067, 0.936083225388601, 3.5722959844559585], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0ceb1903-2878-44ed-a3f8-2846c7696aab", 1, 0, 0.0, 887.0, 887, 887, 887.0, 887.0, 887.0, 887.0, 1.1273957158962795, 0.2036798900789177, 0.7772864994363021], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b886f1bd-6917-4444-9fb6-a0842786f99a", 1, 0, 0.0, 217.0, 217, 217, 217.0, 217.0, 217.0, 217.0, 4.608294930875576, 1.4715941820276497, 2.749675979262673], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2faf617e-12f8-4a3c-89e7-04a5fec7d863", 1, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 2.277904328018223, 0.4115354498861048, 1.570508257403189], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 21, 0, 0.0, 736.3333333333334, 205, 1335, 641.0, 1314.0, 1333.3, 1335.0, 0.0937039846503949, 53.45823218090446, 0.1993257705479452], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/de639b83-79e4-456a-a0c0-3761c849185b", 3, 0, 0.0, 285.0, 199, 393, 263.0, 393.0, 393.0, 393.0, 0.03286878779910597, 0.027401355974449995, 0.021077966134192303], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 542.1333333333333, 208, 1221, 419.0, 1105.2, 1221.0, 1221.0, 0.09011444534558889, 14.495465882295514, 0.199595282884263], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 3, 0, 0.0, 1130.3333333333333, 784, 1309, 1298.0, 1309.0, 1309.0, 1309.0, 0.06539794650447976, 78.23868002419725, 0.14746470554574587], "isController": false}, {"data": ["register", 23, 3, 13.043478260869565, 1188.5652173913043, 650, 2194, 1089.0, 1772.0000000000005, 2134.7999999999993, 2194.0, 0.10095423700543397, 0.03226832099935916, 0.045547712398936034], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c0c63d08-682d-4376-b701-c2c21ce67f80", 1, 0, 0.0, 796.0, 796, 796, 796.0, 796.0, 796.0, 796.0, 1.256281407035176, 0.22696490263819094, 0.8661471419597989], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 306.7142857142857, 204, 1395, 208.0, 898.0, 1395.0, 1395.0, 0.07126132546065357, 6.19207531908531, 0.15896604270589432], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 20, 0, 0.0, 127.74999999999997, 104, 318, 107.0, 287.7000000000004, 317.45, 318.0, 0.10488446975656315, 0.08142886079733173, 0.037283151358778306], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9c06f585-e7e4-4265-8c81-41151739ef02", 1, 0, 0.0, 1913.0, 1913, 1913, 1913.0, 1913.0, 1913.0, 1913.0, 0.5227391531625718, 0.16692939754312597, 0.31190783455305804], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fdb4843f-1b49-466c-9ed0-7c038e205555", 1, 0, 0.0, 722.0, 722, 722, 722.0, 722.0, 722.0, 722.0, 1.3850415512465375, 0.25022723337950137, 0.9549212257617729], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 503.73333333333335, 207, 1393, 404.0, 1339.6000000000001, 1393.0, 1393.0, 0.09674922600619196, 23.269095878482972, 0.2126404375483746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 105.375, 102, 112, 104.0, 112.0, 112.0, 112.0, 0.04069672798307016, 0.030244345698355855, 0.020427849788377014], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 104.375, 101, 114, 103.5, 114.0, 114.0, 114.0, 0.04069714204320002, 0.01088966496077813, 0.023210088821512508], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 105.125, 102, 119, 104.0, 119.0, 119.0, 119.0, 0.0406969350120819, 0.010969095764975201, 0.023925346559837215], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 104.5, 102, 114, 103.0, 114.0, 114.0, 114.0, 0.0406969350120819, 0.010969095764975201, 0.023965089660434948], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1129.6727272727273, 805, 1827, 1022.0, 1554.0, 1649.1999999999996, 1827.0, 0.2467352441108783, 295.1811310063209, 0.4872057261642539], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 3, 13.043478260869565, 1188.5652173913043, 650, 2194, 1089.0, 1772.0000000000005, 2134.7999999999993, 2194.0, 0.10292992262354947, 0.032899815621182084, 0.046439086183671735], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ad95694d-962d-4e15-8f2c-155cb8068a4f", 1, 0, 0.0, 453.0, 453, 453, 453.0, 453.0, 453.0, 453.0, 2.207505518763797, 0.3988169150110375, 1.5219715783664458], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 159.85714285714286, 102, 303, 104.0, 303.0, 303.0, 303.0, 0.036877235682413245, 0.009939567430025446, 0.021715794059077333], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 159.42857142857144, 99, 304, 103.0, 304.0, 304.0, 304.0, 0.03691554777399247, 0.009949893735958906, 0.02170230445306979], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 20, 0, 0.0, 200.95, 99, 905, 102.5, 816.8000000000012, 903.4499999999999, 905.0, 0.10782252412528977, 9.728045059706723, 0.06246125128039247], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 20, 0, 0.0, 202.35, 99, 808, 102.5, 755.900000000001, 807.9, 808.0, 0.10782252412528977, 3.196495599493234, 0.06256654671410858], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 20, 0, 0.0, 125.64999999999998, 101, 330, 104.0, 287.7000000000004, 328.84999999999997, 330.0, 0.10782368670749591, 0.0801306890472699, 0.05412243649184853], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 159.85714285714286, 99, 307, 102.0, 307.0, 307.0, 307.0, 0.03691632650908669, 0.009878001429189213, 0.021053842462213503], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 20, 0, 0.0, 113.69999999999999, 101, 309, 103.0, 108.0, 298.9499999999998, 309.0, 0.10782368670749591, 0.04504587223971362, 0.06058764583153627], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 103.42857142857143, 101, 105, 104.0, 105.0, 105.0, 105.0, 0.036915158418765553, 0.027434019098320887, 0.01852967912816943], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 108.28571428571429, 104, 118, 106.0, 118.0, 118.0, 118.0, 0.03836394227870856, 0.03019661862953037, 0.013637182606884684], "isController": false}, {"data": ["deleteAccount", 13, 0, 0.0, 571.1538461538462, 393, 1035, 469.0, 991.4, 1035.0, 1035.0, 0.1038504553443042, 0.01876204515497683, 0.07068727282712893], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/74b45e68-8b14-4a14-a6d2-4518c3f908bf", 1, 0, 0.0, 204.0, 204, 204, 204.0, 204.0, 204.0, 204.0, 4.901960784313726, 1.5653722426470589, 2.924900428921569], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0ceb1903-2878-44ed-a3f8-2846c7696aab", 3, 0, 0.0, 1053.6666666666667, 301, 1825, 1035.0, 1825.0, 1825.0, 1825.0, 0.02862622734949761, 0.02871009324993559, 0.018357313762535903], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1463.9545454545453, 976, 2310, 1345.5, 2050.6, 2274.1499999999996, 2310.0, 0.09896580731357316, 0.051222536988470485, 0.045520405512395466], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/97a8e092-332d-4f8a-b8c7-a63786a0728a", 3, 0, 0.0, 585.3333333333334, 205, 1082, 469.0, 1082.0, 1082.0, 1082.0, 0.01753811617248153, 0.02072945957756524, 0.011246773717379104], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 321.8571428571429, 206, 411, 401.0, 411.0, 411.0, 411.0, 0.03685684800235884, 0.05712091580053073, 0.08289191498968008], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ccf59b1f-f6e0-4999-839f-3dfd2ea5a183", 3, 0, 0.0, 555.3333333333334, 426, 803, 437.0, 803.0, 803.0, 803.0, 0.06938180808991883, 0.03139346134276926, 0.04449289125557946], "isController": false}, {"data": ["addBook", 58, 2, 3.4482758620689653, 1112.620689655172, 538, 2082, 878.0, 1826.2, 1917.7, 2082.0, 0.258005969724334, 102.12340407460377, 0.9339466836780086], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/4208e0a8-cb0e-4961-8791-5f0a6136c296", 3, 0, 0.0, 639.0, 204, 1092, 621.0, 1092.0, 1092.0, 1092.0, 0.042697332839941926, 0.03559500957131878, 0.027380776593322137], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 171.54545454545442, 101, 423, 104.0, 414.4, 418.2, 423.0, 0.2477443998504525, 0.18411473465448666, 0.11975925578708396], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 640.309090909091, 491, 925, 604.0, 905.2, 915.0, 925.0, 0.247545919768117, 72.7867197099437, 0.12449819207087914], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 163.56363636363636, 100, 433, 105.0, 307.4, 336.1999999999996, 433.0, 0.2481411968526673, 0.43909360224319643, 0.12067804300061359], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 956.1454545454545, 700, 1415, 907.0, 1204.0, 1320.4, 1415.0, 0.24723990362139028, 222.46689987992008, 0.12410284224745569], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 109.60000000000001, 102, 134, 107.0, 123.2, 134.0, 134.0, 0.1018613463353683, 0.07609758783843433, 0.03620852545515045], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 2, 1.1695906432748537, 171.92982456140354, 100, 1221, 109.0, 303.40000000000003, 359.40000000000015, 766.6800000000007, 0.7233349548444407, 1.5923291398764832, 0.3482875322539709], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 157.125, 103, 306, 108.0, 306.0, 306.0, 306.0, 0.0402135338648222, 0.031141926127738292, 0.014294654616011019], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 105.46666666666665, 102, 112, 105.0, 110.8, 112.0, 112.0, 0.08946677800310152, 0.07260438722712632, 0.03180264374328999], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 212.0, 207, 225, 208.5, 225.0, 225.0, 225.0, 0.040675208460443354, 0.06303862873703478, 0.0914794971527354], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 20, 0, 0.0, 348.3, 204, 1204, 210.0, 969.9000000000008, 1194.3, 1204.0, 0.10776268501505983, 13.042473567833916, 0.23960359496317213], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/12cb4f08-a301-49e3-a794-dc4215fa6228", 3, 0, 0.0, 356.3333333333333, 207, 451, 411.0, 451.0, 451.0, 451.0, 0.07442322004465393, 0.03449826345819896, 0.047725827958322996], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8956b18c-cc3a-4f47-96d1-968dc6bda98a", 1, 0, 0.0, 802.0, 802, 802, 802.0, 802.0, 802.0, 802.0, 1.2468827930174564, 0.22526691084788028, 0.8596672381546134], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 124.2307692307692, 103, 301, 107.0, 230.19999999999993, 301.0, 301.0, 0.06214000621400063, 0.05152037624578762, 0.022088830333883033], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 21, 0, 0.0, 132.23809523809524, 103, 366, 107.0, 272.60000000000014, 359.7999999999999, 366.0, 0.09606191876821174, 0.07457932169993, 0.03414701018713776], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fa45116e-71c8-4c2b-81cd-b88f70e46121", 1, 0, 0.0, 202.0, 202, 202, 202.0, 202.0, 202.0, 202.0, 4.9504950495049505, 1.580870977722772, 2.953859839108911], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ab85729e-1595-473b-95db-121a72948e5c", 3, 0, 0.0, 350.3333333333333, 207, 553, 291.0, 553.0, 553.0, 553.0, 0.055743431565647185, 0.02522245113159166, 0.035746927143334946], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c0c63d08-682d-4376-b701-c2c21ce67f80", 3, 0, 0.0, 392.0, 206, 576, 394.0, 576.0, 576.0, 576.0, 0.031781007669816515, 0.026494518438281284, 0.02038039879867791], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 128.99999999999997, 99, 304, 104.0, 302.2, 304.0, 304.0, 0.09681354356932173, 0.07194834634399788, 0.04859586073694469], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 168.6, 100, 305, 103.0, 304.4, 305.0, 305.0, 0.09681479330041631, 0.05498777713234582, 0.053588500822925746], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=de639b83-79e4-456a-a0c0-3761c849185b", 1, 0, 0.0, 1373.0, 1373, 1373, 1373.0, 1373.0, 1373.0, 1373.0, 0.7283321194464676, 0.13158343954843407, 0.5021508557902403], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 345.93333333333334, 98, 1202, 103.0, 1135.4, 1202.0, 1202.0, 0.09681541817806291, 17.4438125165393, 0.05525286170240232], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 295.2, 100, 815, 295.0, 807.8, 815.0, 815.0, 0.09681479330041631, 5.714228446606642, 0.055347050779359086], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 3, 60.0, 0.23492560689115113], "isController": false}, {"data": ["401/Unauthorized", 2, 40.0, 0.15661707126076743], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1277, 5, "406/Not Acceptable", 3, "401/Unauthorized", 2, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 3, "406/Not Acceptable", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
