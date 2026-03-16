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

    var data = {"OkPercent": 97.4721189591078, "KoPercent": 2.5278810408921935};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7589514066496164, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.6, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=28af5c71-0bd6-4905-98b3-baa95bc46971"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/86384912-28a0-49fe-8242-93456338d633"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7ff4c5e2-c3c5-4809-98ec-6e092ae1c5b6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/53c03163-d573-4e57-8d60-fe7cfd0cdb24"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/176232e7-3ab4-4f5c-bfca-7c538e97078e"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8409090909090909, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.022727272727272728, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/55e8ce5d-ee94-470e-b625-aae10432dccf"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/28af5c71-0bd6-4905-98b3-baa95bc46971"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f1ff5354-d66c-42d9-b31e-2ebc92626216"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/21458ea3-c6e5-4d6d-82a7-0f74266977a0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2988c430-1a6f-4f9c-b933-6a3c0bb3a933"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=40c84b5a-65ce-47cb-880b-1c0cfc902c0f"], "isController": false}, {"data": [0.23076923076923078, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c0c91fb3-d699-4abb-bb2e-872880ea9502"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5f2e2d6d-3a30-4a16-9ff7-99248927081b"], "isController": false}, {"data": [0.30434782608695654, 500, 1500, "register"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/92ba1099-2097-4ddb-8b58-cc90cf12b9b8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.6842105263157895, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.3706896551724138, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.30434782608695654, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c5b33147-8a06-4edd-b667-67cea07e7539"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.4318181818181818, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=55e8ce5d-ee94-470e-b625-aae10432dccf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6bb930d1-f363-42fe-b6d7-f84fe4841900"], "isController": false}, {"data": [0.26666666666666666, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7ff4c5e2-c3c5-4809-98ec-6e092ae1c5b6"], "isController": false}, {"data": [0.9137931034482759, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/69d91c30-6357-4ac2-ad23-ce03c19f3083"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9913793103448276, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9241573033707865, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=176232e7-3ab4-4f5c-bfca-7c538e97078e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/40c84b5a-65ce-47cb-880b-1c0cfc902c0f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=69d91c30-6357-4ac2-ad23-ce03c19f3083"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=21458ea3-c6e5-4d6d-82a7-0f74266977a0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f1ff5354-d66c-42d9-b31e-2ebc92626216"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c0c91fb3-d699-4abb-bb2e-872880ea9502"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=92ba1099-2097-4ddb-8b58-cc90cf12b9b8"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1345, 34, 2.5278810408921935, 398.5851301115242, 126, 2138, 150.0, 1053.8000000000002, 1211.4, 1618.0599999999968, 5.2707479367667, 734.7927931094279, 3.8568558727202547], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 2009.689655172413, 1561, 2681, 1994.5, 2357.6, 2547.2, 2681.0, 0.2650919594866357, 318.9941013468271, 1.3034550937648544], "isController": true}, {"data": ["deleteBook", 15, 4, 26.666666666666668, 442.5333333333333, 147, 1106, 426.0, 857.6000000000001, 1106.0, 1106.0, 0.08956667641948254, 0.018910464298722778, 0.05973444226830593], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 4, 26.666666666666668, 442.5333333333333, 147, 1106, 426.0, 857.6000000000001, 1106.0, 1106.0, 0.0895779088932948, 0.018912835842510092, 0.05974193350930416], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 201.5625, 130, 406, 139.5, 403.9, 406.0, 406.0, 0.08927674675534823, 0.023888504502895917, 0.050915644633909546], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 153.49999999999997, 131, 395, 137.5, 222.1000000000002, 395.0, 395.0, 0.08940045817734815, 0.0664392076884394, 0.044874839358551716], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 222.81249999999997, 127, 447, 139.0, 421.1, 447.0, 447.0, 0.0892702713258309, 0.024061127818290364, 0.05256833360300395], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 185.4375, 129, 421, 136.0, 411.90000000000003, 421.0, 421.0, 0.08940645291073884, 0.024097833011097577, 0.05256121548072732], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=28af5c71-0bd6-4905-98b3-baa95bc46971", 1, 0, 0.0, 718.0, 718, 718, 718.0, 718.0, 718.0, 718.0, 1.392757660167131, 0.2516212569637883, 0.9602411211699164], "isController": false}, {"data": ["goToProfile", 15, 4, 26.666666666666668, 227.46666666666667, 136, 410, 233.0, 351.20000000000005, 410.0, 410.0, 0.08946784525641484, 0.16486314401937277, 0.05781626510515454], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/86384912-28a0-49fe-8242-93456338d633", 1, 0, 0.0, 233.0, 233, 233, 233.0, 233.0, 233.0, 233.0, 4.291845493562231, 1.3705405042918455, 2.5608570278969958], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7ff4c5e2-c3c5-4809-98ec-6e092ae1c5b6", 1, 0, 0.0, 408.0, 408, 408, 408.0, 408.0, 408.0, 408.0, 2.450980392156863, 0.44280407475490197, 1.6898360906862746], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/53c03163-d573-4e57-8d60-fe7cfd0cdb24", 1, 0, 0.0, 352.0, 352, 352, 352.0, 352.0, 352.0, 352.0, 2.840909090909091, 0.9072043678977273, 1.6951127485795456], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 181.99999999999997, 130, 409, 137.0, 406.3, 409.0, 409.0, 0.11331159429413172, 0.08420910474397875, 0.05687710885467158], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 884.8333333333334, 679, 1066, 923.0, 1066.0, 1066.0, 1066.0, 0.03470113646221914, 10.203286306064024, 0.019790491888609353], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 180.27777777777777, 129, 421, 134.5, 409.3, 421.0, 421.0, 0.11331230760514438, 0.049229869753797534, 0.06356604061616715], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1110.1666666666667, 943, 1309, 1102.0, 1309.0, 1309.0, 1309.0, 0.0347097684858442, 31.231910696827526, 0.019761518581296062], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 226.0, 130, 439, 133.5, 439.0, 439.0, 439.0, 0.0348284409048429, 0.06163001456989778, 0.019284888665083908], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 138.76923076923077, 130, 157, 136.0, 154.2, 157.0, 157.0, 0.07015195993783457, 0.05213441553973838, 0.035212995515670864], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 156.23076923076923, 129, 407, 136.0, 302.9999999999999, 407.0, 407.0, 0.07015423137944805, 0.01877173769332887, 0.04000983508359146], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 133.84615384615384, 126, 145, 131.0, 143.4, 145.0, 145.0, 0.07014893157781135, 0.018907329214331966, 0.04123989922836176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 201.23076923076923, 131, 426, 136.0, 422.8, 426.0, 426.0, 0.07015044572513976, 0.018907737324354076, 0.041309295676034447], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 136.16666666666666, 130, 142, 136.0, 142.0, 142.0, 142.0, 0.03487885411337953, 0.025920710918243967, 0.019585294057805888], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 21, 0, 0.0, 591.1428571428572, 133, 1312, 379.0, 1194.2, 1300.4999999999998, 1312.0, 0.09573784243374714, 36.93406487065134, 0.05275732109560564], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 298.72222222222223, 131, 1210, 139.5, 963.4000000000004, 1210.0, 1210.0, 0.11331159429413172, 11.355811094621476, 0.06553285564102887], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 21, 0, 0.0, 498.28571428571433, 132, 1094, 144.0, 1009.0, 1086.3999999999999, 1094.0, 0.09574133426947083, 12.079516383735827, 0.05285274270428237], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 249.55555555555557, 127, 650, 137.0, 646.4, 650.0, 650.0, 0.11331444759206799, 3.7291715848284546, 0.06564516446333019], "isController": false}, {"data": ["deleteBooks", 13, 3, 23.076923076923077, 371.30769230769226, 139, 718, 408.0, 712.0, 718.0, 718.0, 0.09118263882556761, 0.018877655694355795, 0.061366080321383736], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/176232e7-3ab4-4f5c-bfca-7c538e97078e", 3, 0, 0.0, 314.3333333333333, 240, 444, 259.0, 444.0, 444.0, 444.0, 0.08331944675887352, 0.037699879881130924, 0.053430765011386994], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 344.1538461538462, 267, 557, 293.0, 553.4, 557.0, 557.0, 0.07009673349221926, 0.10863624614467966, 0.15764919651619236], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 479.8181818181818, 156, 1114, 430.5, 944.2999999999998, 1098.8499999999997, 1114.0, 0.09516599978371364, 0.058456458851519406, 0.04302915810533146], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 21, 0, 0.0, 159.0, 132, 558, 138.0, 148.8, 517.0999999999995, 558.0, 0.0958514576268092, 0.07123335864648613, 0.04811293869158196], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 21, 0, 0.0, 200.61904761904765, 128, 448, 138.0, 406.4, 443.8999999999999, 448.0, 0.09585233263498062, 0.08734757767462241, 0.05121574134932698], "isController": false}, {"data": ["login", 22, 0, 0.0, 2322.3636363636365, 1324, 4003, 2108.0, 3138.5, 3874.449999999998, 4003.0, 0.09383463777697212, 30.744047698385614, 0.18401219050564074], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 161.55555555555554, 133, 409, 142.0, 221.8000000000003, 409.0, 409.0, 0.10962574987058071, 0.08874975258077286, 0.03896852827430799], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/55e8ce5d-ee94-470e-b625-aae10432dccf", 3, 0, 0.0, 808.0, 218, 1423, 783.0, 1423.0, 1423.0, 1423.0, 0.08013248570970671, 0.0371447459800203, 0.051387043244831454], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/28af5c71-0bd6-4905-98b3-baa95bc46971", 3, 0, 0.0, 357.0, 230, 538, 303.0, 538.0, 538.0, 538.0, 0.02123322575165619, 0.025096954005294148, 0.013616358961836815], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f1ff5354-d66c-42d9-b31e-2ebc92626216", 3, 0, 0.0, 311.0, 231, 459, 243.0, 459.0, 459.0, 459.0, 0.07787151200519143, 0.03523483127839066, 0.049937134977287474], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 21, 0, 0.0, 771.047619047619, 275, 1446, 585.0, 1332.4, 1434.9999999999998, 1446.0, 0.09567764833452551, 49.14061681329646, 0.20468983499022722], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/21458ea3-c6e5-4d6d-82a7-0f74266977a0", 3, 0, 0.0, 526.6666666666666, 273, 897, 410.0, 897.0, 897.0, 897.0, 0.019348846808730197, 0.022869681888834426, 0.012407951892317217], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2988c430-1a6f-4f9c-b933-6a3c0bb3a933", 1, 0, 0.0, 406.0, 406, 406, 406.0, 406.0, 406.0, 406.0, 2.4630541871921183, 0.7865417179802955, 1.4696544027093594], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=40c84b5a-65ce-47cb-880b-1c0cfc902c0f", 1, 0, 0.0, 497.0, 497, 497, 497.0, 497.0, 497.0, 497.0, 2.012072434607646, 0.3635091800804829, 1.3872296277665996], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 7, 53.84615384615385, 664.923076923077, 136, 1440, 148.0, 1419.6, 1440.0, 1440.0, 0.05993959932683219, 33.10491266973281, 0.08368670320676856], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 428.12500000000006, 267, 817, 405.5, 650.4000000000002, 817.0, 817.0, 0.08919910354900933, 0.13824118880105254, 0.2006108744857114], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c0c91fb3-d699-4abb-bb2e-872880ea9502", 3, 0, 0.0, 515.6666666666666, 248, 858, 441.0, 858.0, 858.0, 858.0, 0.016884096306885334, 0.02327608979806621, 0.010827366446798213], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5f2e2d6d-3a30-4a16-9ff7-99248927081b", 1, 0, 0.0, 250.0, 250, 250, 250.0, 250.0, 250.0, 250.0, 4.0, 1.27734375, 2.38671875], "isController": false}, {"data": ["register", 23, 7, 30.434782608695652, 992.6086956521741, 145, 1549, 1062.0, 1485.0, 1541.3999999999999, 1549.0, 0.09539768391014368, 0.02990898853568703, 0.04304075192039685], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/92ba1099-2097-4ddb-8b58-cc90cf12b9b8", 3, 0, 0.0, 395.6666666666667, 233, 629, 325.0, 629.0, 629.0, 629.0, 0.03171750277528149, 0.02644157702066924, 0.02033967463128403], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 145.64285714285717, 135, 163, 145.0, 157.0, 163.0, 163.0, 0.07536322382339167, 0.058509534120699584, 0.02678927096847126], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 512.8333333333335, 270, 1342, 296.5, 1093.6000000000004, 1342.0, 1342.0, 0.11321324343363189, 15.205118417907821, 0.25140071906133643], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 559.7894736842105, 270, 1314, 545.0, 939.0, 1314.0, 1314.0, 0.0880257220425674, 5.6718407597314755, 0.19678653270155574], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 137.0, 130, 150, 137.0, 148.20000000000002, 150.0, 150.0, 0.04798841297955693, 0.035663263942815264, 0.024087933858879165], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 211.0, 128, 422, 138.0, 418.6, 422.0, 422.0, 0.04798004030323385, 0.0259409131255943, 0.026630966972284984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 324.2727272727273, 131, 1176, 138.0, 1174.6, 1176.0, 1176.0, 0.04777270615008447, 7.8261650975866095, 0.027338677542919434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 253.72727272727275, 128, 906, 135.0, 860.6000000000001, 906.0, 906.0, 0.04782733462612068, 2.567424313242954, 0.027416645923371914], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 145.0, 139, 150, 146.0, 150.0, 150.0, 150.0, 0.03064132288804682, 0.009036796398623183, 0.018941364636849256], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 1288.2068965517242, 1017, 2138, 1114.5, 1780.2, 1952.55, 2138.0, 0.24863038949236535, 297.44838374171593, 0.4909478980015261], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, 30.434782608695652, 992.6086956521741, 145, 1549, 1062.0, 1485.0, 1541.3999999999999, 1549.0, 0.09799493834840182, 0.030723277206377343, 0.04421256007515786], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 223.16666666666666, 132, 402, 139.0, 402.0, 402.0, 402.0, 0.039502791530601496, 0.010647236779732434, 0.023261897747024123], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 181.0, 129, 407, 137.0, 407.0, 407.0, 407.0, 0.039571571782831216, 0.010665775207091227, 0.023263756067641007], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c5b33147-8a06-4edd-b667-67cea07e7539", 2, 0, 0.0, 269.0, 226, 312, 269.0, 312.0, 312.0, 312.0, 0.016994952499107766, 0.024031925018269572, 0.010563757095392668], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 176.78571428571428, 132, 410, 140.0, 393.5, 410.0, 410.0, 0.07513672199949552, 0.020251694601426524, 0.044172174456734666], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 182.5, 131, 528, 137.0, 459.0, 528.0, 528.0, 0.0751439812354744, 0.020253651192373958, 0.044249824887686584], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 159.14285714285714, 131, 406, 140.5, 278.0, 406.0, 406.0, 0.07513914158897816, 0.05584070971602772, 0.03771632693040505], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 136.33333333333334, 130, 140, 136.0, 140.0, 140.0, 140.0, 0.03956974497299365, 0.010587998166601817, 0.02256712017991044], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 173.64285714285714, 131, 401, 136.5, 396.0, 401.0, 401.0, 0.07514196464033836, 0.020106346007278036, 0.04285440170894297], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 135.16666666666669, 131, 140, 135.5, 140.0, 140.0, 140.0, 0.03956844021208684, 0.029405842774802817, 0.019861502215832653], "isController": false}, {"data": ["deleteAccount", 13, 3, 23.076923076923077, 466.6153846153845, 137, 897, 459.0, 851.4, 897.0, 897.0, 0.0902220155598276, 0.018109467065494243, 0.061390551152412744], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 180.66666666666666, 134, 397, 138.0, 397.0, 397.0, 397.0, 0.03939153213364233, 0.031005444238003634, 0.014002458688130675], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1197.4545454545455, 705, 2005, 1122.5, 1544.0, 1936.749999999999, 2005.0, 0.092910898448388, 0.04808864861098207, 0.04273538395428784], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 361.16666666666663, 267, 544, 278.5, 544.0, 544.0, 544.0, 0.039466154483684034, 0.06116483121641266, 0.0887603064218011], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=55e8ce5d-ee94-470e-b625-aae10432dccf", 1, 0, 0.0, 244.0, 244, 244, 244.0, 244.0, 244.0, 244.0, 4.0983606557377055, 0.7404264856557378, 2.82562756147541], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6bb930d1-f363-42fe-b6d7-f84fe4841900", 1, 0, 0.0, 366.0, 366, 366, 366.0, 366.0, 366.0, 366.0, 2.73224043715847, 0.8725025614754098, 1.6302723702185793], "isController": false}, {"data": ["addBook", 60, 13, 21.666666666666668, 1175.2166666666667, 676, 2278, 1048.0, 1852.5, 1884.05, 2278.0, 0.2771657035158469, 78.46018373920786, 1.0086233179506368], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/7ff4c5e2-c3c5-4809-98ec-6e092ae1c5b6", 3, 0, 0.0, 291.6666666666667, 228, 414, 233.0, 414.0, 414.0, 414.0, 0.018348287187391055, 0.025294595129752972, 0.011766316978893354], "isController": false}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 247.36206896551715, 132, 807, 142.5, 551.4, 566.15, 807.0, 0.24967929125519805, 0.18555267641133372, 0.12069457926887016], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/69d91c30-6357-4ac2-ad23-ce03c19f3083", 3, 0, 0.0, 335.0, 217, 565, 223.0, 565.0, 565.0, 565.0, 0.0189642965510266, 0.022415156502857286, 0.012161349025235156], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 760.5517241379312, 641, 1108, 680.0, 994.7, 1087.4, 1108.0, 0.24987829203879147, 73.47251459957003, 0.12567121132810313], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 189.448275862069, 131, 535, 140.0, 404.2, 438.05, 535.0, 0.25042529122734297, 0.44313537861713426, 0.12178886233517267], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 1037.2068965517237, 875, 1419, 960.0, 1266.5, 1394.6, 1419.0, 0.2495289066331667, 224.5265488135546, 0.12525181446235126], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 158.57894736842107, 134, 410, 145.0, 154.0, 410.0, 410.0, 0.08986723298789631, 0.067137141831778, 0.031944992976166264], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 13, 7.303370786516854, 186.11797752808982, 130, 549, 146.0, 296.4, 394.04999999999995, 468.4200000000008, 0.7093498688898275, 1.5423510576984387, 0.33974633270102894], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 139.63636363636363, 132, 151, 139.0, 150.2, 151.0, 151.0, 0.048116038387850266, 0.03726173675934107, 0.017103748020681146], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=176232e7-3ab4-4f5c-bfca-7c538e97078e", 1, 0, 0.0, 230.0, 230, 230, 230.0, 230.0, 230.0, 230.0, 4.3478260869565215, 0.7854959239130435, 2.9976222826086953], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 143.1875, 131, 156, 143.5, 154.6, 156.0, 156.0, 0.08832995655270262, 0.07168182997587488, 0.03139853924334351], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/40c84b5a-65ce-47cb-880b-1c0cfc902c0f", 3, 0, 0.0, 438.6666666666667, 251, 594, 471.0, 594.0, 594.0, 594.0, 0.025265285497726123, 0.029862712123126158, 0.016202022275560047], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=69d91c30-6357-4ac2-ad23-ce03c19f3083", 1, 0, 0.0, 703.0, 703, 703, 703.0, 703.0, 703.0, 703.0, 1.4224751066856332, 0.2569901315789474, 0.9807299075391182], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 512.6363636363636, 262, 1315, 279.0, 1313.2, 1315.0, 1315.0, 0.047744713358102715, 10.445864243061825, 0.105157900719209], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 386.5714285714285, 275, 817, 289.0, 743.5, 817.0, 817.0, 0.07507869856438804, 0.11635731896648809, 0.16885375272830627], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 169.53846153846152, 138, 409, 150.0, 312.5999999999999, 409.0, 409.0, 0.07504950380731906, 0.06222366087149793, 0.026677753306507946], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=21458ea3-c6e5-4d6d-82a7-0f74266977a0", 1, 0, 0.0, 456.0, 456, 456, 456.0, 456.0, 456.0, 456.0, 2.1929824561403506, 0.3961931195175438, 1.5119586074561402], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 21, 0, 0.0, 169.2380952380952, 134, 438, 144.0, 344.60000000000014, 433.49999999999994, 438.0, 0.09987159366528749, 0.07753702828506207, 0.03550123056070766], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f1ff5354-d66c-42d9-b31e-2ebc92626216", 1, 0, 0.0, 239.0, 239, 239, 239.0, 239.0, 239.0, 239.0, 4.184100418410042, 0.755916579497908, 2.884741108786611], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c0c91fb3-d699-4abb-bb2e-872880ea9502", 1, 0, 0.0, 437.0, 437, 437, 437.0, 437.0, 437.0, 437.0, 2.288329519450801, 0.41341890732265446, 1.577695938215103], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=92ba1099-2097-4ddb-8b58-cc90cf12b9b8", 1, 0, 0.0, 460.0, 460, 460, 460.0, 460.0, 460.0, 460.0, 2.1739130434782608, 0.39274796195652173, 1.4988111413043477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 199.0526315789474, 131, 530, 137.0, 408.0, 530.0, 530.0, 0.08818587726382429, 0.06553657480251004, 0.044265176673443055], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 253.1052631578948, 130, 446, 140.0, 426.0, 446.0, 446.0, 0.08818669587657577, 0.030568003546033454, 0.04990416949018807], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 327.6842105263158, 131, 1171, 391.0, 526.0, 1171.0, 1171.0, 0.08807999517877921, 4.193782110083768, 0.05138301527956127], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 233.63157894736844, 130, 905, 142.0, 407.0, 905.0, 905.0, 0.08808081182693511, 1.3855796209975384, 0.05146950810343468], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 20.58823529411765, 0.5204460966542751], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 11.764705882352942, 0.29739776951672864], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 8.823529411764707, 0.22304832713754646], "isController": false}, {"data": ["401/Unauthorized", 20, 58.8235294117647, 1.486988847583643], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1345, 34, "401/Unauthorized", 20, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 7, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
