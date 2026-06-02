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

    var data = {"OkPercent": 97.16692189892802, "KoPercent": 2.8330781010719757};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7937704918032787, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/280a468c-ff37-424b-97ae-3c104f560fb1"], "isController": false}, {"data": [0.38181818181818183, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d0d36801-4d7b-496c-8906-0095adee88cd"], "isController": false}, {"data": [0.4666666666666667, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b15a90e9-d717-4580-9970-e7a0d842ea1a"], "isController": false}, {"data": [0.65625, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f1619df8-8b73-4367-b1f5-56ff6c770558"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5229cb9d-d93c-45cc-9464-0c9535954755"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a9781efa-1ca0-4ca5-9eef-b2055262243b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f7a25e82-d4d0-4061-be7b-ca98a438cd3c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2c9de93a-443a-40cb-9cdb-9e2a4166b30b"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.4666666666666667, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9981eb8c-e484-46ca-9ac9-fc9bb345ebb9"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=efb10303-0ff2-4051-8b2d-a9b4a4ff874b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/5fdfafd5-4dda-4a32-99aa-d59bf4a57629"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.022727272727272728, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1b2144fc-8b0b-4d90-9e77-4457f1d12abc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/966e5508-aac1-4df4-936d-216b5f43d237"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9cc9ee49-78c1-458f-a696-cd9e33eae6f0"], "isController": false}, {"data": [0.21739130434782608, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a9781efa-1ca0-4ca5-9eef-b2055262243b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d0d36801-4d7b-496c-8906-0095adee88cd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f1619df8-8b73-4367-b1f5-56ff6c770558"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.21739130434782608, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5666666666666667, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1b2144fc-8b0b-4d90-9e77-4457f1d12abc"], "isController": false}, {"data": [0.38636363636363635, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/9981eb8c-e484-46ca-9ac9-fc9bb345ebb9"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5229cb9d-d93c-45cc-9464-0c9535954755"], "isController": false}, {"data": [0.3448275862068966, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8454545454545455, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9181286549707602, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2c9de93a-443a-40cb-9cdb-9e2a4166b30b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5fdfafd5-4dda-4a32-99aa-d59bf4a57629"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9cc9ee49-78c1-458f-a696-cd9e33eae6f0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=966e5508-aac1-4df4-936d-216b5f43d237"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/efb10303-0ff2-4051-8b2d-a9b4a4ff874b"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1306, 37, 2.8330781010719757, 311.5168453292495, 80, 2773, 98.0, 830.3, 1062.0, 1617.94000000001, 5.149273739492485, 729.7479408511186, 3.769130503138455], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/280a468c-ff37-424b-97ae-3c104f560fb1", 2, 0, 0.0, 292.5, 256, 329, 292.5, 329.0, 329.0, 329.0, 0.01712167518470007, 0.02437832267509053, 0.010642525639708588], "isController": false}, {"data": ["see books", 55, 0, 0.0, 1385.109090909091, 1021, 1833, 1395.0, 1699.0, 1761.2, 1833.0, 0.2378481231620827, 286.2104256535418, 1.1694973633994983], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d0d36801-4d7b-496c-8906-0095adee88cd", 1, 0, 0.0, 481.0, 481, 481, 481.0, 481.0, 481.0, 481.0, 2.079002079002079, 0.37560096153846156, 1.4333744802494803], "isController": false}, {"data": ["deleteBook", 15, 4, 26.666666666666668, 519.0666666666667, 86, 1162, 510.0, 980.2, 1162.0, 1162.0, 0.09518491255679366, 0.020096658295682412, 0.06348139610884078], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 4, 26.666666666666668, 519.0666666666667, 86, 1162, 510.0, 980.2, 1162.0, 1162.0, 0.09336254543643878, 0.019711896800154362, 0.06226601012049993], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 119.4736842105263, 82, 257, 84.0, 252.0, 257.0, 257.0, 0.09477018230790334, 0.03285002618649774, 0.05362971356959373], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 93.42105263157893, 83, 253, 85.0, 87.0, 253.0, 253.0, 0.09476970960565825, 0.07042944239248626, 0.047569951891902676], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 148.1578947368421, 82, 491, 85.0, 250.0, 491.0, 491.0, 0.09477018230790334, 1.4908086172282216, 0.055378402685986476], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 148.73684210526315, 82, 975, 84.0, 248.0, 975.0, 975.0, 0.09477112772654041, 4.512369229872358, 0.05528640520642648], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b15a90e9-d717-4580-9970-e7a0d842ea1a", 1, 0, 0.0, 299.0, 299, 299, 299.0, 299.0, 299.0, 299.0, 3.3444816053511706, 1.068013168896321, 1.9955842391304348], "isController": false}, {"data": ["goToProfile", 16, 4, 25.0, 364.0625, 83, 1397, 277.5, 1030.2000000000003, 1397.0, 1397.0, 0.09463703738754459, 0.1694733079193456, 0.06115826122188245], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f1619df8-8b73-4367-b1f5-56ff6c770558", 1, 0, 0.0, 905.0, 905, 905, 905.0, 905.0, 905.0, 905.0, 1.1049723756906078, 0.19962879834254144, 0.7618266574585635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 85.14285714285714, 83, 98, 84.0, 92.5, 98.0, 98.0, 0.11440151663724914, 0.0850190958602994, 0.05742419878080669], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5229cb9d-d93c-45cc-9464-0c9535954755", 3, 0, 0.0, 562.0, 266, 990, 430.0, 990.0, 990.0, 990.0, 0.027491408934707903, 0.027571950171821305, 0.017629581901489118], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 96.71428571428571, 83, 251, 84.0, 172.0, 251.0, 251.0, 0.11440245148110316, 0.03061159346271706, 0.06524514811031665], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 596.0, 489, 736, 578.5, 736.0, 736.0, 736.0, 0.07653964275121747, 22.505196324183657, 0.043651515006553704], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a9781efa-1ca0-4ca5-9eef-b2055262243b", 1, 0, 0.0, 1139.0, 1139, 1139, 1139.0, 1139.0, 1139.0, 1139.0, 0.8779631255487269, 0.15861638498683056, 0.6053144205443372], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 792.875, 654, 976, 737.5, 976.0, 976.0, 976.0, 0.07642192545041172, 68.7645828556963, 0.043509748571865264], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 185.5, 82, 252, 246.0, 252.0, 252.0, 252.0, 0.07672094673648273, 0.1357601127797917, 0.04248122734334542], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 85.18181818181817, 83, 89, 84.0, 88.6, 89.0, 89.0, 0.049676201486673226, 0.03691756770640462, 0.024935124574365274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 113.72727272727272, 83, 248, 84.0, 248.0, 248.0, 248.0, 0.04967709885742673, 0.020075475319514067, 0.027952188614912162], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 185.63636363636363, 83, 721, 84.0, 626.2000000000003, 721.0, 721.0, 0.04964100527548501, 4.072805620772053, 0.028795661263318454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 147.36363636363637, 83, 612, 84.0, 540.0000000000002, 612.0, 612.0, 0.04963921317334464, 1.3390336401563185, 0.02884309749818366], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f7a25e82-d4d0-4061-be7b-ca98a438cd3c", 1, 0, 0.0, 317.0, 317, 317, 317.0, 317.0, 317.0, 317.0, 3.1545741324921135, 1.0073688880126184, 1.882270307570978], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 85.25, 83, 92, 84.5, 92.0, 92.0, 92.0, 0.0768410638645292, 0.05710551718838547, 0.04314805832236747], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2c9de93a-443a-40cb-9cdb-9e2a4166b30b", 1, 0, 0.0, 710.0, 710, 710, 710.0, 710.0, 710.0, 710.0, 1.4084507042253522, 0.25445642605633806, 0.9710607394366197], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 738.0714285714287, 83, 1240, 974.5, 1154.0, 1240.0, 1240.0, 0.08233937939633473, 52.927139665966784, 0.043352234631942974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 84.21428571428572, 81, 92, 84.0, 89.0, 92.0, 92.0, 0.11440432121464703, 0.03083553970238533, 0.06725722790157959], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 438.1428571428571, 82, 657, 492.5, 657.0, 657.0, 657.0, 0.08234034794678462, 17.29976683713079, 0.04343315507628245], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 107.92857142857142, 81, 249, 84.0, 247.0, 249.0, 249.0, 0.11425120575826077, 0.03079427030203122, 0.06727878620335082], "isController": false}, {"data": ["deleteBooks", 15, 4, 26.666666666666668, 507.33333333333337, 87, 1139, 546.0, 998.6000000000001, 1139.0, 1139.0, 0.0935698779848791, 0.01975567150422936, 0.06273324241460189], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 273.3636363636364, 169, 805, 172.0, 711.6000000000004, 805.0, 805.0, 0.04961950858643042, 5.466471661058158, 0.11044129081768439], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9981eb8c-e484-46ca-9ac9-fc9bb345ebb9", 1, 0, 0.0, 546.0, 546, 546, 546.0, 546.0, 546.0, 546.0, 1.8315018315018314, 0.3308865613553113, 1.262734661172161], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=efb10303-0ff2-4051-8b2d-a9b4a4ff874b", 1, 0, 0.0, 549.0, 549, 549, 549.0, 549.0, 549.0, 549.0, 1.8214936247723132, 0.3290784380692167, 1.2558344717668488], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5fdfafd5-4dda-4a32-99aa-d59bf4a57629", 3, 0, 0.0, 806.6666666666666, 623, 1171, 626.0, 1171.0, 1171.0, 1171.0, 0.048903741136196915, 0.03144039347135056, 0.031360797538511696], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 618.5454545454545, 161, 1860, 476.0, 1560.8999999999999, 1825.7999999999995, 1860.0, 0.10285516590070735, 0.0631795892104931, 0.04650580255080811], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 85.92857142857143, 82, 92, 85.5, 91.5, 92.0, 92.0, 0.08233598964918987, 0.0611891485576499, 0.04132880730437851], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 144.14285714285714, 82, 257, 84.5, 254.0, 257.0, 257.0, 0.08233937939633473, 0.11036785117745312, 0.04201973351447997], "isController": false}, {"data": ["login", 22, 0, 0.0, 2614.636363636363, 1380, 3911, 2524.5, 3464.0, 3845.749999999999, 3911.0, 0.1038818768622007, 45.330992892354764, 0.2193748406357571], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 90.42857142857143, 84, 115, 87.0, 107.0, 115.0, 115.0, 0.113376848447547, 0.09178653062794577, 0.040301926596588974], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1b2144fc-8b0b-4d90-9e77-4457f1d12abc", 3, 0, 0.0, 473.0, 187, 828, 404.0, 828.0, 828.0, 828.0, 0.02021863079432261, 0.027873014783188887, 0.012965723523702975], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/966e5508-aac1-4df4-936d-216b5f43d237", 3, 0, 0.0, 271.3333333333333, 199, 414, 201.0, 414.0, 414.0, 414.0, 0.042503152317130186, 0.027602144815323804, 0.02725625327628466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 825.6428571428572, 171, 1325, 1061.0, 1243.0, 1325.0, 1325.0, 0.08229436695058223, 70.35977793012032, 0.17004211340751582], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 295.15789473684214, 169, 1058, 179.0, 502.0, 1058.0, 1058.0, 0.094729547142907, 6.103794370198084, 0.21177331686784232], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 16, 8, 50.0, 481.81250000000006, 83, 1062, 413.5, 1000.4000000000001, 1062.0, 1062.0, 0.1250605762166049, 74.82469536025262, 0.1824308942612828], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9cc9ee49-78c1-458f-a696-cd9e33eae6f0", 3, 0, 0.0, 703.0, 305, 1397, 407.0, 1397.0, 1397.0, 1397.0, 0.02140976142389187, 0.02530561319340865, 0.013729567058941074], "isController": false}, {"data": ["register", 23, 9, 39.130434782608695, 977.4782608695652, 276, 2773, 866.0, 1782.6000000000004, 2590.9999999999973, 2773.0, 0.09167437262842383, 0.028461405089123433, 0.04136089858821466], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a9781efa-1ca0-4ca5-9eef-b2055262243b", 3, 0, 0.0, 344.6666666666667, 289, 400, 345.0, 400.0, 400.0, 400.0, 0.052145799655837724, 0.03352472471363265, 0.033439851992838644], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 88.52631578947367, 84, 100, 88.0, 96.0, 100.0, 100.0, 0.09910699382406944, 0.07694341805677267, 0.03522943921089969], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 206.92857142857142, 168, 337, 173.0, 336.0, 337.0, 337.0, 0.11417200828562574, 0.1769443136223516, 0.2567755225408165], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 323.7894736842106, 169, 1155, 330.0, 498.0, 1155.0, 1155.0, 0.09505227875331432, 6.1245892271999605, 0.2124948018285057], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 104.55555555555554, 83, 247, 84.0, 247.0, 247.0, 247.0, 0.052176937793495276, 0.038776025059423735, 0.026190376978375556], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d0d36801-4d7b-496c-8906-0095adee88cd", 3, 0, 0.0, 798.3333333333333, 286, 1786, 323.0, 1786.0, 1786.0, 1786.0, 0.0331619963521804, 0.02764579188083789, 0.021265993754490686], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 102.11111111111111, 83, 248, 84.0, 248.0, 248.0, 248.0, 0.05217754278558508, 0.013961569065674135, 0.029757504869903993], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f1619df8-8b73-4367-b1f5-56ff6c770558", 3, 0, 0.0, 354.0, 173, 575, 314.0, 575.0, 575.0, 575.0, 0.028201584929073015, 0.028284206759919907, 0.018085000752042266], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 100.88888888888889, 82, 245, 83.0, 245.0, 245.0, 245.0, 0.052177845286891185, 0.01406355986248239, 0.030674866076863764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 156.11111111111111, 84, 248, 85.0, 248.0, 248.0, 248.0, 0.05212888577402707, 0.014050363743780735, 0.03069699035326008], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 102.0, 87, 137, 92.0, 137.0, 137.0, 137.0, 0.06201935003721161, 0.01829086299925577, 0.03833813337261226], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 941.9818181818181, 650, 1471, 893.0, 1333.0, 1414.8, 1471.0, 0.2405328458534324, 287.7609063878964, 0.4749584124176175], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 9, 39.130434782608695, 977.4782608695652, 276, 2773, 866.0, 1782.6000000000004, 2590.9999999999973, 2773.0, 0.0908050061194678, 0.02819149986181847, 0.040968664870306766], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 105.125, 83, 247, 85.0, 247.0, 247.0, 247.0, 0.047620464894788536, 0.012835203428673472, 0.028042129230036607], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 104.24999999999999, 83, 245, 84.0, 245.0, 245.0, 245.0, 0.047621031828707146, 0.012835356235081224, 0.027995958164923538], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 152.1578947368421, 80, 900, 84.0, 247.0, 900.0, 900.0, 0.0999479218722876, 4.758853651584174, 0.058306379176113504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 150.26315789473682, 81, 531, 84.0, 251.0, 531.0, 531.0, 0.09994634459395482, 1.5722336725810353, 0.058403062895182586], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 128.42105263157893, 83, 256, 85.0, 256.0, 256.0, 256.0, 0.10003211557394742, 0.07434027339040429, 0.05021143301270408], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 145.24999999999997, 82, 250, 85.0, 250.0, 250.0, 250.0, 0.04757571973143507, 0.012730221881262898, 0.02713302765933406], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 135.21052631578945, 81, 252, 84.0, 250.0, 252.0, 252.0, 0.10003264223062262, 0.03467414366793375, 0.05660769895966052], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 141.625, 83, 359, 89.0, 359.0, 359.0, 359.0, 0.04762188225489612, 0.035390871480445264, 0.023903952616227155], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 131.875, 85, 266, 88.5, 266.0, 266.0, 266.0, 0.04710204658392407, 0.037074462447893364, 0.016743305621629262], "isController": false}, {"data": ["deleteAccount", 15, 4, 26.666666666666668, 450.0666666666668, 83, 1786, 407.0, 1090.0000000000005, 1786.0, 1786.0, 0.09470653601373877, 0.01930508881894636, 0.06443867238799374], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1b2144fc-8b0b-4d90-9e77-4457f1d12abc", 1, 0, 0.0, 680.0, 680, 680, 680.0, 680.0, 680.0, 680.0, 1.4705882352941175, 0.2656824448529412, 1.0139016544117647], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1317.9999999999998, 686, 2535, 1154.0, 2260.9, 2495.5499999999993, 2535.0, 0.10301265182660162, 0.05331709518369029, 0.04738179590852477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 288.375, 169, 609, 180.5, 609.0, 609.0, 609.0, 0.0475519653821692, 0.07369625884912356, 0.10694548464368718], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9981eb8c-e484-46ca-9ac9-fc9bb345ebb9", 3, 0, 0.0, 955.6666666666666, 441, 1850, 576.0, 1850.0, 1850.0, 1850.0, 0.02754795640076767, 0.022965597767697268, 0.017665844436690205], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5229cb9d-d93c-45cc-9464-0c9535954755", 1, 0, 0.0, 692.0, 692, 692, 692.0, 692.0, 692.0, 692.0, 1.445086705202312, 0.2610752348265896, 0.9963195447976879], "isController": false}, {"data": ["addBook", 58, 12, 20.689655172413794, 887.7586206896553, 422, 2205, 718.5, 1682.7, 1863.6999999999996, 2205.0, 0.28114805353446726, 82.32632953793559, 1.0222149755570853], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 151.07272727272732, 83, 372, 86.0, 337.4, 342.2, 372.0, 0.2413889961728872, 0.17939162703863978, 0.11668706357966714], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 522.7818181818182, 401, 822, 489.0, 734.2, 744.0, 822.0, 0.2413572174584646, 70.96703574664953, 0.12138570995225516], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 122.29090909090911, 83, 259, 87.0, 252.0, 252.6, 259.0, 0.24170299535930248, 0.4277010035068907, 0.11754696453997328], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 789.2727272727274, 564, 1090, 744.0, 1057.0, 1073.0, 1090.0, 0.24093429940686356, 216.79310612361903, 0.12093772450696082], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 107.05263157894737, 85, 258, 88.0, 254.0, 258.0, 258.0, 0.09553451561486517, 0.07137100043493345, 0.033959534847471606], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 12, 7.017543859649122, 147.22222222222217, 83, 1036, 88.0, 299.8000000000001, 342.0, 805.6000000000004, 0.6979506373391346, 1.5371264267682438, 0.3346299905001163], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 86.11111111111111, 84, 88, 86.0, 88.0, 88.0, 88.0, 0.05569341394439322, 0.043129762947171704, 0.019797268238046027], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 89.05263157894736, 84, 105, 87.0, 96.0, 105.0, 105.0, 0.09758352379240388, 0.07919131667137463, 0.03468789322308107], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2c9de93a-443a-40cb-9cdb-9e2a4166b30b", 3, 0, 0.0, 527.6666666666666, 295, 873, 415.0, 873.0, 873.0, 873.0, 0.040624534510542064, 0.03386700289111271, 0.026051540685471313], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 261.55555555555554, 168, 496, 181.0, 496.0, 496.0, 496.0, 0.05210323387404912, 0.0807498360919101, 0.11718139415228038], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 316.7894736842105, 167, 1157, 173.0, 504.0, 1157.0, 1157.0, 0.09990167571916062, 6.43705479672638, 0.2233359059110244], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5fdfafd5-4dda-4a32-99aa-d59bf4a57629", 1, 0, 0.0, 378.0, 378, 378, 378.0, 378.0, 378.0, 378.0, 2.6455026455026456, 0.4779472552910053, 1.823950066137566], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 93.72727272727273, 85, 129, 88.0, 126.4, 129.0, 129.0, 0.04828839585948955, 0.040035984457721316, 0.017165015715677925], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 89.21428571428572, 85, 105, 86.5, 103.0, 105.0, 105.0, 0.08358957518583754, 0.06489620339134847, 0.029713481804340684], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9cc9ee49-78c1-458f-a696-cd9e33eae6f0", 1, 0, 0.0, 473.0, 473, 473, 473.0, 473.0, 473.0, 473.0, 2.1141649048625792, 0.3819536205073996, 1.457617600422833], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=966e5508-aac1-4df4-936d-216b5f43d237", 1, 0, 0.0, 649.0, 649, 649, 649.0, 649.0, 649.0, 649.0, 1.5408320493066257, 0.2783729776579353, 1.062331471494607], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 103.5263157894737, 81, 248, 85.0, 247.0, 248.0, 248.0, 0.09509366726225332, 0.07067019608063943, 0.047732563449998246], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 127.05263157894737, 82, 252, 85.0, 250.0, 252.0, 252.0, 0.0950950950950951, 0.032962650150150145, 0.0538135792042042], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 187.89473684210523, 81, 906, 86.0, 251.0, 906.0, 906.0, 0.09509461914605032, 4.527771734438266, 0.05547511961902093], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 179.42105263157893, 81, 490, 87.0, 343.0, 490.0, 490.0, 0.0950950950950951, 1.4959197478728727, 0.055568263576076075], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/efb10303-0ff2-4051-8b2d-a9b4a4ff874b", 3, 0, 0.0, 398.3333333333333, 376, 432, 387.0, 432.0, 432.0, 432.0, 0.02211427181388629, 0.026138320623769896, 0.014181352693149737], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 24.324324324324323, 0.6891271056661562], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 10.81081081081081, 0.30627871362940273], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 4, 10.81081081081081, 0.30627871362940273], "isController": false}, {"data": ["401/Unauthorized", 20, 54.054054054054056, 1.5313935681470139], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1306, 37, "401/Unauthorized", 20, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 16, 8, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
