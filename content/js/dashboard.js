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

    var data = {"OkPercent": 97.63138415988156, "KoPercent": 2.368615840118431};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7700892857142857, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.07017543859649122, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c2f13192-37a8-44d8-9ef5-c98f45e1afa5"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b33ee307-cbd0-4f3c-87bc-5da898a9bc44"], "isController": false}, {"data": [0.5357142857142857, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5357142857142857, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4581965c-d1eb-4297-b58d-c05e004a63e7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3cac6454-ad1d-4a66-82a0-4c13c5c7a562"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=08228179-b2bc-4ead-8e20-2d98d8483b36"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c38ff528-897a-4ec9-8eb4-ccc441c8f423"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.775, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.775, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/240e9ef7-3f64-4752-91ba-481039891c93"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7380952380952381, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2e9d06c1-c091-4d5d-ad2f-40e09f203e54"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c2f13192-37a8-44d8-9ef5-c98f45e1afa5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c3ae80f5-51e8-4aa5-8062-e00eeaf3b44b"], "isController": false}, {"data": [0.2727272727272727, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=927fcbc2-596d-43fa-a90e-67b86e29827f"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/dd0e32f9-6105-43c3-b9ec-ee7fe37b4042"], "isController": false}, {"data": [0.2727272727272727, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/762dda66-8f94-41ff-9fe1-707b8945bced"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2e9d06c1-c091-4d5d-ad2f-40e09f203e54"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.41228070175438597, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b33ee307-cbd0-4f3c-87bc-5da898a9bc44"], "isController": false}, {"data": [0.2727272727272727, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c38ff528-897a-4ec9-8eb4-ccc441c8f423"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.46153846153846156, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3cac6454-ad1d-4a66-82a0-4c13c5c7a562"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/08228179-b2bc-4ead-8e20-2d98d8483b36"], "isController": false}, {"data": [0.2619047619047619, 500, 1500, "addBook"], "isController": true}, {"data": [0.9912280701754386, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5175438596491229, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/634e33a1-7caf-41f3-a423-49ffa6b09c59"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8989071038251366, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=240e9ef7-3f64-4752-91ba-481039891c93"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4581965c-d1eb-4297-b58d-c05e004a63e7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c3ae80f5-51e8-4aa5-8062-e00eeaf3b44b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3a8fa136-7fa6-44a2-8b97-6e41e57f9a36"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/927fcbc2-596d-43fa-a90e-67b86e29827f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dd0e32f9-6105-43c3-b9ec-ee7fe37b4042"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/90f61865-9f8b-4f23-9aaf-f657480152fd"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1351, 32, 2.368615840118431, 371.4122871946702, 99, 2010, 121.0, 1050.3999999999996, 1274.1999999999996, 1672.3200000000002, 5.420065072876005, 752.2506122208727, 3.9683363677439933], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1758.824561403509, 1342, 2334, 1760.0, 2128.0, 2189.0999999999995, 2334.0, 0.2474108669797644, 297.7172558024902, 1.2165173000421032], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c2f13192-37a8-44d8-9ef5-c98f45e1afa5", 1, 0, 0.0, 491.0, 491, 491, 491.0, 491.0, 491.0, 491.0, 2.0366598778004072, 0.3679512474541752, 1.404181517311609], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b33ee307-cbd0-4f3c-87bc-5da898a9bc44", 3, 0, 0.0, 756.3333333333333, 229, 1724, 316.0, 1724.0, 1724.0, 1724.0, 0.027246966504395842, 0.02732679160157669, 0.01747282682736322], "isController": false}, {"data": ["deleteBook", 14, 3, 21.428571428571427, 523.2857142857143, 106, 1257, 488.0, 1057.5, 1257.0, 1257.0, 0.06853942485631198, 0.014060717668974161, 0.045882593495119015], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, 21.428571428571427, 523.2857142857143, 106, 1257, 488.0, 1057.5, 1257.0, 1257.0, 0.0677749484426285, 0.013903886953806531, 0.045370827302169764], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4581965c-d1eb-4297-b58d-c05e004a63e7", 1, 0, 0.0, 878.0, 878, 878, 878.0, 878.0, 878.0, 878.0, 1.1389521640091116, 0.2057677249430524, 0.7852541287015945], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 166.26666666666668, 103, 331, 113.0, 329.8, 331.0, 331.0, 0.09835227160963327, 0.026316916426796403, 0.05609152990236898], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 126.79999999999998, 105, 339, 112.0, 207.60000000000008, 339.0, 339.0, 0.09835420628155532, 0.07309331150416366, 0.04936920119992132], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 137.00000000000003, 104, 331, 110.0, 323.2, 331.0, 331.0, 0.09835485118911015, 0.026509705984564848, 0.05791794459671233], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3cac6454-ad1d-4a66-82a0-4c13c5c7a562", 1, 0, 0.0, 796.0, 796, 796, 796.0, 796.0, 796.0, 796.0, 1.256281407035176, 0.22696490263819094, 0.8661471419597989], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 165.06666666666666, 107, 339, 111.0, 329.4, 339.0, 339.0, 0.09835485118911015, 0.026509705984564848, 0.05782189493734796], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=08228179-b2bc-4ead-8e20-2d98d8483b36", 1, 0, 0.0, 242.0, 242, 242, 242.0, 242.0, 242.0, 242.0, 4.132231404958678, 0.7465457128099173, 2.848979855371901], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c38ff528-897a-4ec9-8eb4-ccc441c8f423", 1, 0, 0.0, 758.0, 758, 758, 758.0, 758.0, 758.0, 758.0, 1.3192612137203166, 0.23834309036939313, 0.9095687664907651], "isController": false}, {"data": ["goToProfile", 14, 3, 21.428571428571427, 212.42857142857144, 99, 331, 224.5, 304.0, 331.0, 331.0, 0.06867424372489098, 0.11515486501832131, 0.04438245452784005], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 126.73333333333332, 108, 324, 113.0, 200.4000000000001, 324.0, 324.0, 0.08054253451247605, 0.05985631715233815, 0.0404285768939577], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 768.3333333333333, 548, 880, 823.0, 880.0, 880.0, 880.0, 0.03371203182415804, 9.912456701109125, 0.019226393149715134], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 125.60000000000002, 107, 325, 111.0, 203.80000000000007, 325.0, 325.0, 0.08054339946841356, 0.037681306548178375, 0.04503298923403227], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1092.5, 988, 1357, 1029.5, 1357.0, 1357.0, 1357.0, 0.033644168063834204, 30.27308156397719, 0.019154833966030606], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 222.66666666666669, 111, 347, 215.5, 347.0, 347.0, 347.0, 0.03377636667623664, 0.05976833634505936, 0.018702343657642746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 146.0, 101, 322, 111.0, 321.7, 322.0, 322.0, 0.056242706024062505, 0.04179755789483552, 0.0282312020472345], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 147.58333333333331, 104, 337, 112.0, 332.5, 337.0, 337.0, 0.056241915224686446, 0.022088499582872463, 0.03168184710166663], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 264.5, 104, 1211, 111.5, 973.7000000000008, 1211.0, 1211.0, 0.05624217882200756, 4.2311300533011815, 0.0326614736388221], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 254.25, 100, 876, 112.0, 743.1000000000005, 876.0, 876.0, 0.0562432332360013, 1.3920108684189558, 0.032717011000239035], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 150.16666666666669, 111, 333, 114.5, 333.0, 333.0, 333.0, 0.033817296419875555, 0.02513179939016142, 0.018989204532644962], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 578.65, 106, 1294, 223.5, 1270.6000000000001, 1293.1, 1294.0, 0.10386157329511227, 42.07006846587368, 0.057042723458174946], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 233.4, 105, 1325, 110.0, 975.2000000000003, 1325.0, 1325.0, 0.08054339946841356, 9.681893424302627, 0.046427816334201406], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 429.04999999999995, 104, 988, 113.0, 904.2, 983.9, 988.0, 0.1038604945836752, 13.757691762175046, 0.05714355727386974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 226.93333333333337, 100, 943, 110.0, 883.0, 943.0, 943.0, 0.08054383195334902, 3.176489322572677, 0.046506721718375804], "isController": false}, {"data": ["deleteBooks", 13, 2, 15.384615384615385, 595.0, 101, 1197, 596.0, 1149.3999999999999, 1197.0, 1197.0, 0.0660122985990159, 0.0130864224761721, 0.044788392498971735], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/240e9ef7-3f64-4752-91ba-481039891c93", 3, 0, 0.0, 358.0, 220, 521, 333.0, 521.0, 521.0, 521.0, 0.022867770925916044, 0.027028931065104546, 0.014664553621111527], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 452.0833333333333, 214, 1337, 337.5, 1133.9000000000008, 1337.0, 1337.0, 0.0562129345962506, 5.6840435266706955, 0.1252256568715628], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 605.9999999999999, 124, 1586, 449.0, 1221.2, 1553.1999999999996, 1586.0, 0.10972761426040975, 0.0674010443064431, 0.049613169338446984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 121.1, 102, 334, 110.0, 120.50000000000001, 323.34999999999985, 334.0, 0.1038626520289569, 0.07718699042386348, 0.052134182756722505], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 215.25, 101, 446, 114.0, 341.6, 440.79999999999995, 446.0, 0.1038621126592336, 0.09798944046883358, 0.05530860354792977], "isController": false}, {"data": ["login", 21, 0, 0.0, 2550.761904761905, 1575, 4340, 2433.0, 3430.4, 4256.499999999999, 4340.0, 0.11389027485519665, 39.084129830845825, 0.22579446093292405], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 117.13333333333333, 107, 131, 117.0, 129.2, 131.0, 131.0, 0.07970244420828905, 0.06452473266471839, 0.02833172821466525], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2e9d06c1-c091-4d5d-ad2f-40e09f203e54", 1, 0, 0.0, 596.0, 596, 596, 596.0, 596.0, 596.0, 596.0, 1.6778523489932886, 0.3031276216442953, 1.1568005453020134], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 711.85, 217, 1402, 545.5, 1384.0, 1401.35, 1402.0, 0.10380443244926559, 55.97226738886438, 0.22150689975086937], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c2f13192-37a8-44d8-9ef5-c98f45e1afa5", 3, 0, 0.0, 340.3333333333333, 240, 536, 245.0, 536.0, 536.0, 536.0, 0.033338889814969165, 0.027793260682335945, 0.021379431294104575], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c3ae80f5-51e8-4aa5-8062-e00eeaf3b44b", 3, 0, 0.0, 319.6666666666667, 229, 437, 293.0, 437.0, 437.0, 437.0, 0.09482567879381737, 0.04290615023548377, 0.060809435945253974], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 5, 45.45454545454545, 727.5454545454545, 99, 1474, 1099.0, 1451.8000000000002, 1474.0, 1474.0, 0.04962197080423682, 32.387014508223714, 0.07589994096113246], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 352.73333333333335, 216, 658, 413.0, 533.8000000000001, 658.0, 658.0, 0.09828009828009827, 0.152314957002457, 0.22103424447174447], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=927fcbc2-596d-43fa-a90e-67b86e29827f", 1, 0, 0.0, 786.0, 786, 786, 786.0, 786.0, 786.0, 786.0, 1.272264631043257, 0.22985249681933842, 0.8771668256997455], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dd0e32f9-6105-43c3-b9ec-ee7fe37b4042", 3, 0, 0.0, 723.3333333333334, 206, 1754, 210.0, 1754.0, 1754.0, 1754.0, 0.02142750005356875, 0.025326579653160198, 0.013740942417164856], "isController": false}, {"data": ["register", 22, 6, 27.272727272727273, 1197.1363636363637, 126, 2010, 1251.5, 1850.1, 1992.8999999999996, 2010.0, 0.0921925483277529, 0.02900660433891657, 0.041594684890060386], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 21, 0, 0.0, 131.6190476190476, 110, 339, 117.0, 175.60000000000002, 323.4999999999998, 339.0, 0.09304139012697935, 0.07223428237397322, 0.03307330664669969], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 397.13333333333327, 220, 1650, 227.0, 1231.2000000000003, 1650.0, 1650.0, 0.08049455856784082, 12.948047596097087, 0.17828811048414792], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/762dda66-8f94-41ff-9fe1-707b8945bced", 1, 0, 0.0, 254.0, 254, 254, 254.0, 254.0, 254.0, 254.0, 3.937007874015748, 1.2572281003937007, 2.349132627952756], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2e9d06c1-c091-4d5d-ad2f-40e09f203e54", 3, 0, 0.0, 694.0, 298, 1453, 331.0, 1453.0, 1453.0, 1453.0, 0.02766915074153324, 0.027750212706596323, 0.01774356346380875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 361.2105263157895, 217, 1519, 230.0, 448.0, 1519.0, 1519.0, 0.10477844872749333, 6.751284311495298, 0.2342382107011884], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 113.0, 108, 116, 113.0, 115.9, 116.0, 116.0, 0.06302269447227947, 0.0468362016537155, 0.0316344384362809], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 174.9, 104, 330, 112.5, 329.9, 330.0, 330.0, 0.0629370189251616, 0.016840569517084254, 0.035893768605756216], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 197.8, 105, 344, 110.5, 343.2, 344.0, 344.0, 0.06294018793940119, 0.016964347530541726, 0.03700194642531202], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 133.0, 104, 341, 111.0, 318.30000000000007, 341.0, 341.0, 0.06302388605281402, 0.01698690678767253, 0.03711269852524107], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 108.5, 101, 116, 108.5, 116.0, 116.0, 116.0, 0.015013887846257788, 0.004427923954658059, 0.00928104590496209], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1209.9999999999995, 850, 1866, 1160.0, 1666.6000000000001, 1732.6999999999994, 1866.0, 0.24361056500555603, 291.44292848213524, 0.48103570550901786], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b33ee307-cbd0-4f3c-87bc-5da898a9bc44", 1, 0, 0.0, 1197.0, 1197, 1197, 1197.0, 1197.0, 1197.0, 1197.0, 0.835421888053467, 0.15093071219715956, 0.575984231411863], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, 27.272727272727273, 1197.1363636363637, 126, 2010, 1251.5, 1850.1, 1992.8999999999996, 2010.0, 0.09480429377265068, 0.029828339588980294, 0.04277303097945764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 190.375, 104, 335, 111.0, 335.0, 335.0, 335.0, 0.04157723230758836, 0.011206363395404676, 0.024483467853003694], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 108.75, 104, 111, 110.0, 111.0, 111.0, 111.0, 0.04157593584833098, 0.011206013959120461, 0.024442102910835206], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 21, 0, 0.0, 225.76190476190476, 106, 1248, 111.0, 1005.4000000000005, 1240.6, 1248.0, 0.0918161229111832, 7.890610312152957, 0.053226366639267574], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c38ff528-897a-4ec9-8eb4-ccc441c8f423", 3, 0, 0.0, 583.6666666666666, 220, 1098, 433.0, 1098.0, 1098.0, 1098.0, 0.029342723004694836, 0.029428688013497652, 0.018816785260172143], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 21, 0, 0.0, 186.00000000000006, 102, 649, 111.0, 583.2000000000002, 645.9, 649.0, 0.0918161229111832, 2.593532209970357, 0.053316030821798026], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 21, 0, 0.0, 121.76190476190477, 105, 333, 111.0, 117.6, 311.49999999999966, 333.0, 0.09181652435105393, 0.0682347412413594, 0.04608759132465011], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 108.375, 103, 112, 109.0, 112.0, 112.0, 112.0, 0.04157615191925911, 0.011124868775270504, 0.023711399141452462], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 21, 0, 0.0, 130.61904761904762, 104, 333, 111.0, 280.40000000000015, 331.79999999999995, 333.0, 0.09181692579443501, 0.03770198357351475, 0.05162994171811329], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 112.25, 106, 119, 112.0, 119.0, 119.0, 119.0, 0.0415768001455188, 0.030898383701894343, 0.020869604760543618], "isController": false}, {"data": ["deleteAccount", 13, 2, 15.384615384615385, 708.1538461538462, 99, 1754, 521.0, 1742.0, 1754.0, 1754.0, 0.0650852616928176, 0.0126288484790075, 0.04429142019795933], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 148.625, 108, 352, 116.5, 352.0, 352.0, 352.0, 0.043101590448687555, 0.03392566591957243, 0.015321268479806905], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1343.761904761905, 934, 1891, 1346.0, 1730.0, 1875.9999999999998, 1891.0, 0.11182465893479025, 0.05787799730023323, 0.05143497495926387], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3cac6454-ad1d-4a66-82a0-4c13c5c7a562", 3, 0, 0.0, 323.3333333333333, 222, 508, 240.0, 508.0, 508.0, 508.0, 0.03804885472947264, 0.03134819378915861, 0.024399818950866244], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 304.75, 217, 446, 229.0, 446.0, 446.0, 446.0, 0.04155282922826008, 0.06439876951684448, 0.09345328682879195], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/08228179-b2bc-4ead-8e20-2d98d8483b36", 3, 0, 0.0, 418.0, 219, 533, 502.0, 533.0, 533.0, 533.0, 0.07366301625497225, 0.03333059654765997, 0.04723832748121593], "isController": false}, {"data": ["addBook", 63, 16, 25.396825396825395, 1084.0476190476197, 558, 2386, 906.0, 2029.8000000000002, 2286.0, 2386.0, 0.2898364034522736, 83.69595381336146, 1.0539995698459725], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 207.00000000000003, 104, 731, 116.0, 446.0, 454.1, 731.0, 0.24474128270194376, 0.1818829259142375, 0.1183075536498654], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 705.8771929824559, 492, 1018, 654.0, 889.4, 976.5999999999997, 1018.0, 0.2448611379599201, 71.99730471518784, 0.123147935595077], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 176.78947368421055, 106, 434, 115.0, 342.4, 348.0, 434.0, 0.24517288990016733, 0.4338410903311554, 0.11923447184597981], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/634e33a1-7caf-41f3-a423-49ffa6b09c59", 1, 0, 0.0, 357.0, 357, 357, 357.0, 357.0, 357.0, 357.0, 2.8011204481792715, 0.8944984243697479, 1.671371673669468], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 1001.7192982456141, 724, 1418, 989.0, 1236.0, 1330.7999999999997, 1418.0, 0.24439918533604887, 219.91081657331975, 0.12267693482688391], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 118.78947368421052, 110, 135, 118.0, 133.0, 135.0, 135.0, 0.1049677362326527, 0.07841827950974542, 0.03731274998895076], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 183, 16, 8.743169398907105, 178.37158469945362, 105, 1007, 117.0, 342.59999999999997, 402.1999999999997, 823.8799999999992, 0.764791186930847, 1.6227039612944614, 0.3682541068346421], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 114.30000000000001, 110, 116, 115.0, 116.0, 116.0, 116.0, 0.06765899864682003, 0.0523960800067659, 0.024050659675236806], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=240e9ef7-3f64-4752-91ba-481039891c93", 1, 0, 0.0, 463.0, 463, 463, 463.0, 463.0, 463.0, 463.0, 2.1598272138228944, 0.3902031587473002, 1.4890996220302375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 129.86666666666667, 102, 341, 116.0, 215.00000000000006, 341.0, 341.0, 0.10007672548954198, 0.08121460828301698, 0.03557414851386063], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 337.3, 226, 457, 331.5, 456.9, 457.0, 457.0, 0.06289229066301052, 0.09747076687714619, 0.1414462357391731], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 21, 0, 0.0, 376.14285714285717, 217, 1357, 228.0, 1182.6000000000004, 1349.6999999999998, 1357.0, 0.09177078280477732, 10.584849087590843, 0.20415841139312418], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 137.25, 112, 327, 122.0, 267.60000000000025, 327.0, 327.0, 0.059465700679395626, 0.04930310534844423, 0.021138198288378915], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4581965c-d1eb-4297-b58d-c05e004a63e7", 3, 0, 0.0, 303.3333333333333, 237, 431, 242.0, 431.0, 431.0, 431.0, 0.04190763557120107, 0.02606949595591317, 0.026874362654709022], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c3ae80f5-51e8-4aa5-8062-e00eeaf3b44b", 1, 0, 0.0, 233.0, 233, 233, 233.0, 233.0, 233.0, 233.0, 4.291845493562231, 0.7753822424892703, 2.9590262875536477], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 137.40000000000003, 108, 355, 114.0, 315.20000000000044, 354.05, 355.0, 0.10299350625943034, 0.07996077878539758, 0.036610972928156876], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3a8fa136-7fa6-44a2-8b97-6e41e57f9a36", 1, 0, 0.0, 212.0, 212, 212, 212.0, 212.0, 212.0, 212.0, 4.716981132075471, 1.5063015919811322, 2.8145268278301887], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/927fcbc2-596d-43fa-a90e-67b86e29827f", 3, 0, 0.0, 413.3333333333333, 277, 654, 309.0, 654.0, 654.0, 654.0, 0.03472302599597213, 0.028947158065001505, 0.022267044665385774], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dd0e32f9-6105-43c3-b9ec-ee7fe37b4042", 1, 0, 0.0, 1078.0, 1078, 1078, 1078.0, 1078.0, 1078.0, 1078.0, 0.9276437847866419, 0.1675918947124304, 0.6395669063079777], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 122.63157894736842, 103, 336, 110.0, 120.0, 336.0, 336.0, 0.10484493985211345, 0.07791699143306478, 0.052627245199205384], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 132.0, 103, 332, 109.0, 330.0, 332.0, 332.0, 0.10484841127065238, 0.03634342545277959, 0.05933290543225137], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/90f61865-9f8b-4f23-9aaf-f657480152fd", 1, 0, 0.0, 275.0, 275, 275, 275.0, 275.0, 275.0, 275.0, 3.6363636363636362, 1.1612215909090908, 2.169744318181818], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 233.1578947368421, 99, 1182, 113.0, 334.0, 1182.0, 1182.0, 0.10484262570079018, 4.991906813184237, 0.06116179079481747], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 193.10526315789474, 99, 826, 111.0, 335.0, 826.0, 826.0, 0.10484493985211345, 1.649292382877166, 0.06126552843229224], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 18.75, 0.44411547002220575], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 9.375, 0.22205773501110287], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 6.25, 0.14803849000740193], "isController": false}, {"data": ["401/Unauthorized", 21, 65.625, 1.5544041450777202], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1351, 32, "401/Unauthorized", 21, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 5, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 183, 16, "401/Unauthorized", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
