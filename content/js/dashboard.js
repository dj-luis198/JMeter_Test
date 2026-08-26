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

    var data = {"OkPercent": 97.66355140186916, "KoPercent": 2.336448598130841};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7546666666666667, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/bc47dfd8-47cc-4bb7-bb3a-1445bb2b2f82"], "isController": false}, {"data": [0.018518518518518517, 500, 1500, "see books"], "isController": true}, {"data": [0.43333333333333335, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.43333333333333335, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a7130879-a7cd-40a8-931c-02c89f17a10f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bd3ad415-3ec9-480c-a4bd-2d2913f8d966"], "isController": false}, {"data": [0.78125, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8c0caf83-74e7-4079-8355-167816fc1e05"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=579af42f-ece9-4adb-aab9-5720abf0d69a"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=05acb6de-8412-46d8-a2b8-94eb7a71f103"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b2ff9cbf-237c-4413-85cb-ceb846969934"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5a1d8991-86d7-41ed-ab8c-3e3bfa9f5bb5"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/594a28eb-a974-4b26-9918-2029e79daad9"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/35948200-9bfc-48bb-98d6-44e1b23b0cf9"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/371810bb-d942-4037-aacb-a1035deddfdb"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=70607348-d528-47c8-947f-f8bdec3dad97"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "register"], "isController": true}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b2ff9cbf-237c-4413-85cb-ceb846969934"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/05acb6de-8412-46d8-a2b8-94eb7a71f103"], "isController": false}, {"data": [0.3425925925925926, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bc47dfd8-47cc-4bb7-bb3a-1445bb2b2f82"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=35948200-9bfc-48bb-98d6-44e1b23b0cf9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b3b15941-295e-4abb-bc3f-1e9c01e66cd4"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1d08bade-6cf1-4791-8f26-f1597c4283fd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bd3ad415-3ec9-480c-a4bd-2d2913f8d966"], "isController": false}, {"data": [0.27586206896551724, 500, 1500, "addBook"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/579af42f-ece9-4adb-aab9-5720abf0d69a"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8c0caf83-74e7-4079-8355-167816fc1e05"], "isController": false}, {"data": [0.9814814814814815, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9235294117647059, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=371810bb-d942-4037-aacb-a1035deddfdb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f5e35bb2-1edc-4f86-8ef4-69c7792ac699"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=594a28eb-a974-4b26-9918-2029e79daad9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/70607348-d528-47c8-947f-f8bdec3dad97"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5a1d8991-86d7-41ed-ab8c-3e3bfa9f5bb5"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/77d55bf1-d601-4f69-b369-44edd3e67f3f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1284, 30, 2.336448598130841, 410.01635514018716, 114, 2889, 130.0, 1171.5, 1407.0, 1844.150000000002, 5.058125105870024, 710.2000260243294, 3.692417170246879], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/bc47dfd8-47cc-4bb7-bb3a-1445bb2b2f82", 3, 0, 0.0, 639.6666666666666, 215, 1184, 520.0, 1184.0, 1184.0, 1184.0, 0.017240586639694726, 0.023767540501011448, 0.011055975156314651], "isController": false}, {"data": ["see books", 54, 0, 0.0, 1942.2592592592594, 1431, 2499, 1896.5, 2351.5, 2444.0, 2499.0, 0.2498484715288413, 300.6533029664301, 1.2285029825661289], "isController": true}, {"data": ["deleteBook", 15, 3, 20.0, 526.5333333333334, 121, 862, 555.0, 835.6, 862.0, 862.0, 0.07625671059053196, 0.015519432116276231, 0.05110093242892874], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, 20.0, 526.5333333333334, 121, 862, 555.0, 835.6, 862.0, 862.0, 0.07727298484934343, 0.01572625980722966, 0.05178195527697214], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 133.29411764705878, 117, 356, 119.0, 171.19999999999982, 356.0, 356.0, 0.12279421855926266, 0.0328570467629277, 0.07003107777207948], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 122.11764705882354, 118, 135, 120.0, 133.4, 135.0, 135.0, 0.12279155771925516, 0.0912542728753449, 0.061635606120798], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a7130879-a7cd-40a8-931c-02c89f17a10f", 2, 0, 0.0, 439.5, 398, 481, 439.5, 481.0, 481.0, 481.0, 0.017352525226233546, 0.024385042773974682, 0.010786017877439115], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 193.41176470588232, 117, 443, 121.0, 374.99999999999994, 443.0, 443.0, 0.12279421855926266, 0.03309687922105126, 0.0723094861242533], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 133.41176470588238, 116, 354, 120.0, 170.79999999999984, 354.0, 354.0, 0.12279244465311136, 0.03309640109790892, 0.07218852703239553], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bd3ad415-3ec9-480c-a4bd-2d2913f8d966", 3, 0, 0.0, 485.33333333333337, 307, 803, 346.0, 803.0, 803.0, 803.0, 0.026463894426703834, 0.02654142536740707, 0.016970661465041195], "isController": false}, {"data": ["goToProfile", 16, 3, 18.75, 278.43750000000006, 117, 509, 246.0, 489.40000000000003, 509.0, 509.0, 0.0812034349052965, 0.14543662071905641, 0.05248188306959135], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8c0caf83-74e7-4079-8355-167816fc1e05", 1, 0, 0.0, 480.0, 480, 480, 480.0, 480.0, 480.0, 480.0, 2.0833333333333335, 0.3763834635416667, 1.4363606770833335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 120.57894736842104, 117, 126, 120.0, 125.0, 126.0, 126.0, 0.08906764922347073, 0.06619187603423948, 0.04470778486412496], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 143.73684210526315, 116, 356, 119.0, 354.0, 356.0, 356.0, 0.08906723169668389, 0.037914001486016445, 0.05000876023101227], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 796.1666666666667, 690, 1043, 705.5, 1043.0, 1043.0, 1043.0, 0.04427227448810182, 13.0175186773658, 0.025249031543995572], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=579af42f-ece9-4adb-aab9-5720abf0d69a", 1, 0, 0.0, 461.0, 461, 461, 461.0, 461.0, 461.0, 461.0, 2.1691973969631237, 0.3918960140997831, 1.495559924078091], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1157.1666666666667, 802, 1512, 1192.0, 1512.0, 1512.0, 1512.0, 0.04422886965752112, 39.79721466389745, 0.025181084971030093], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 195.33333333333334, 115, 354, 120.0, 354.0, 354.0, 354.0, 0.04446189985698089, 0.07867672123129821, 0.024619040252840004], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=05acb6de-8412-46d8-a2b8-94eb7a71f103", 1, 0, 0.0, 227.0, 227, 227, 227.0, 227.0, 227.0, 227.0, 4.405286343612335, 0.7958769273127753, 3.037238436123348], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b2ff9cbf-237c-4413-85cb-ceb846969934", 1, 0, 0.0, 604.0, 604, 604, 604.0, 604.0, 604.0, 604.0, 1.6556291390728477, 0.29911268625827814, 1.1414786837748345], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 20, 0, 0.0, 142.95000000000002, 116, 357, 120.0, 329.9000000000005, 356.8, 357.0, 0.11504434959676955, 0.08549682621400549, 0.057746870793690966], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 20, 0, 0.0, 141.95, 114, 352, 119.0, 328.4000000000005, 351.95, 352.0, 0.11504501136069488, 0.030783528430498433, 0.0656116080416463], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 20, 0, 0.0, 143.6, 117, 355, 118.5, 328.50000000000045, 354.7, 355.0, 0.11504501136069488, 0.03100822571831229, 0.06763388363197101], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 20, 0, 0.0, 153.34999999999997, 115, 354, 118.0, 352.20000000000005, 353.95, 354.0, 0.1150469966981512, 0.03100876082879856, 0.06774740137596208], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 120.0, 116, 125, 119.5, 125.0, 125.0, 125.0, 0.04446222933617892, 0.0330427309812814, 0.02496658385576453], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 257.7368421052632, 115, 1379, 119.0, 1034.0, 1379.0, 1379.0, 0.0889696379403997, 8.448301835935304, 0.05149959202738392], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 1038.8571428571431, 118, 1655, 1287.0, 1592.0, 1655.0, 1655.0, 0.08106683960925784, 52.10916057097112, 0.0426822339125752], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 241.73684210526315, 116, 934, 120.0, 702.0, 934.0, 934.0, 0.08897172104087549, 2.775207971397933, 0.051587684265117], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 787.6428571428571, 117, 1143, 939.0, 1107.0, 1143.0, 1143.0, 0.08106496198632318, 17.031807321613655, 0.04276041033346651], "isController": false}, {"data": ["deleteBooks", 14, 3, 21.428571428571427, 546.3571428571428, 121, 2706, 463.0, 1735.5, 2706.0, 2706.0, 0.07568303943086355, 0.015526215050653578, 0.05102375670335492], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 20, 0, 0.0, 311.54999999999995, 236, 710, 240.5, 684.6000000000005, 709.9, 710.0, 0.11496565401086425, 0.1781743094875406, 0.25856045037794956], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 579.8636363636364, 182, 1122, 501.0, 1066.6999999999998, 1117.8, 1122.0, 0.09314732095603023, 0.057216469610686535, 0.042116415627580076], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 138.0, 117, 352, 119.5, 251.5, 352.0, 352.0, 0.08117542008279893, 0.06032665496387694, 0.04074625578374868], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 152.35714285714283, 116, 360, 118.5, 355.5, 360.0, 360.0, 0.08117730282612981, 0.10881020166761374, 0.041426698345142704], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5a1d8991-86d7-41ed-ab8c-3e3bfa9f5bb5", 3, 0, 0.0, 357.6666666666667, 233, 604, 236.0, 604.0, 604.0, 604.0, 0.03969514131470308, 0.032704558159997885, 0.025455543095691757], "isController": false}, {"data": ["login", 22, 0, 0.0, 2911.636363636364, 1757, 4507, 2615.0, 4285.9, 4474.599999999999, 4507.0, 0.09146011923073726, 29.966058747017154, 0.1793556972379044], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 137.89473684210523, 119, 367, 123.0, 156.0, 367.0, 367.0, 0.08936382364284572, 0.0723462986327335, 0.031766046685542816], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/594a28eb-a974-4b26-9918-2029e79daad9", 3, 0, 0.0, 416.6666666666667, 322, 469, 459.0, 469.0, 469.0, 469.0, 0.06811679760228873, 0.030821077040098087, 0.0436816703374052], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/35948200-9bfc-48bb-98d6-44e1b23b0cf9", 3, 0, 0.0, 429.0, 377, 515, 395.0, 515.0, 515.0, 515.0, 0.07029712250445215, 0.03180761727903271, 0.045079860460211826], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 1194.9285714285716, 241, 1773, 1405.5, 1711.5, 1773.0, 1773.0, 0.0810077362388108, 69.25973846797012, 0.16738359115974147], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/371810bb-d942-4037-aacb-a1035deddfdb", 3, 0, 0.0, 682.3333333333334, 215, 1212, 620.0, 1212.0, 1212.0, 1212.0, 0.02580312217778351, 0.02587871726228874, 0.01654692405281039], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 330.6470588235294, 238, 562, 245.0, 498.79999999999995, 562.0, 562.0, 0.12268521859619243, 0.1901381268673412, 0.2759219320576476], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 6, 50.0, 710.6666666666666, 117, 1635, 539.0, 1605.0, 1635.0, 1635.0, 0.08269018743109151, 49.47416900668412, 0.1206235033937431], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=70607348-d528-47c8-947f-f8bdec3dad97", 1, 0, 0.0, 501.0, 501, 501, 501.0, 501.0, 501.0, 501.0, 1.996007984031936, 0.3606069111776447, 1.3761539421157685], "isController": false}, {"data": ["register", 23, 7, 30.434782608695652, 1126.8260869565217, 270, 2773, 1147.0, 1830.6000000000001, 2586.5999999999976, 2773.0, 0.09821043507222738, 0.03079083952841911, 0.044309786136102584], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 404.8947368421053, 237, 1500, 243.0, 1151.0, 1500.0, 1500.0, 0.08891967277560418, 11.321074861882009, 0.19758759319015706], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 12, 0, 0.0, 184.75, 119, 362, 129.5, 361.1, 362.0, 362.0, 0.0806869145996248, 0.0626426729557634, 0.028681676674085377], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b2ff9cbf-237c-4413-85cb-ceb846969934", 3, 0, 0.0, 653.0, 293, 1213, 453.0, 1213.0, 1213.0, 1213.0, 0.017468876285418145, 0.024082256207274038, 0.011202371836677652], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 442.05263157894734, 237, 1396, 469.0, 702.0, 1396.0, 1396.0, 0.1155781034241534, 7.447148205345792, 0.25838145602557316], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 120.125, 116, 129, 118.5, 129.0, 129.0, 129.0, 0.03712727694628147, 0.027591657964961134, 0.018636152685926444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 177.625, 117, 356, 119.5, 356.0, 356.0, 356.0, 0.0371274492514178, 0.016904954310032767, 0.02078448269860865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 293.25, 116, 1292, 117.0, 1292.0, 1292.0, 1292.0, 0.0371274492514178, 4.184674144270307, 0.021428049323816332], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 190.0, 117, 688, 119.0, 688.0, 688.0, 688.0, 0.037127104642744435, 1.3733312381657354, 0.021464107371586626], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 125.33333333333333, 121, 131, 124.0, 131.0, 131.0, 131.0, 0.03184003566083994, 0.00939032301716178, 0.019682365794249687], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/05acb6de-8412-46d8-a2b8-94eb7a71f103", 3, 0, 0.0, 494.6666666666667, 310, 665, 509.0, 665.0, 665.0, 665.0, 0.10064074608339763, 0.04553731674997484, 0.06453849927874132], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1339.870370370371, 929, 2003, 1290.0, 1864.5, 1950.5, 2003.0, 0.2480762604800735, 296.7854527966004, 0.48985370965889513], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bc47dfd8-47cc-4bb7-bb3a-1445bb2b2f82", 1, 0, 0.0, 495.0, 495, 495, 495.0, 495.0, 495.0, 495.0, 2.0202020202020203, 0.36497790404040403, 1.392834595959596], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, 30.434782608695652, 1126.8260869565217, 270, 2773, 1147.0, 1830.6000000000001, 2586.5999999999976, 2773.0, 0.09609599572163914, 0.03012792257169597, 0.043355810569723915], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=35948200-9bfc-48bb-98d6-44e1b23b0cf9", 1, 0, 0.0, 256.0, 256, 256, 256.0, 256.0, 256.0, 256.0, 3.90625, 0.705718994140625, 2.69317626953125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 3, 0, 0.0, 119.0, 118, 120, 119.0, 120.0, 120.0, 120.0, 0.014444187658886064, 0.0038931599549341346, 0.008505708162410447], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 3, 0, 0.0, 119.33333333333333, 119, 120, 119.0, 120.0, 120.0, 120.0, 0.01444439629645679, 0.0038932161892793688, 0.008491725166471667], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b3b15941-295e-4abb-bc3f-1e9c01e66cd4", 1, 0, 0.0, 219.0, 219, 219, 219.0, 219.0, 219.0, 219.0, 4.5662100456621, 1.4581549657534247, 2.724564783105023], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 12, 0, 0.0, 216.91666666666663, 117, 1053, 119.0, 844.2000000000007, 1053.0, 1053.0, 0.0782707384844176, 5.8883507152804055, 0.04545410073444043], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 12, 0, 0.0, 229.75, 118, 981, 120.0, 792.0000000000007, 981.0, 981.0, 0.07830700260370783, 1.9380855691613974, 0.045551632048445936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 3, 0, 0.0, 119.33333333333333, 118, 121, 119.0, 121.0, 121.0, 121.0, 0.01444439629645679, 0.003865004477762852, 0.008237819762823012], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 12, 0, 0.0, 120.41666666666667, 118, 132, 119.0, 129.3, 132.0, 132.0, 0.07849652979924512, 0.05833579997775932, 0.039401578434386714], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1d08bade-6cf1-4791-8f26-f1597c4283fd", 1, 0, 0.0, 271.0, 271, 271, 271.0, 271.0, 271.0, 271.0, 3.6900369003690034, 1.1783613929889298, 2.2017700645756455], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 3, 0, 0.0, 120.0, 119, 121, 120.0, 121.0, 121.0, 121.0, 0.014444118114368527, 0.010734349497103954, 0.00725027022537639], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 12, 0, 0.0, 157.25, 116, 346, 120.0, 346.0, 346.0, 346.0, 0.07849652979924512, 0.030828796615491292, 0.04421817865156045], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 3, 0, 0.0, 123.0, 120, 126, 123.0, 126.0, 126.0, 126.0, 0.014588601439408676, 0.011482824961097064, 0.005185791917914803], "isController": false}, {"data": ["deleteAccount", 14, 3, 21.428571428571427, 537.7857142857143, 118, 1213, 517.5, 1061.5, 1213.0, 1213.0, 0.0763671075957998, 0.01521908666303014, 0.05196436485749353], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1578.6818181818185, 790, 2616, 1510.5, 2217.2, 2572.1999999999994, 2616.0, 0.09165520976544599, 0.047438731616881225, 0.04215781621047369], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 3, 0, 0.0, 241.33333333333334, 241, 242, 241.0, 242.0, 242.0, 242.0, 0.014435777631281368, 0.02237263584066751, 0.03246640223129003], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bd3ad415-3ec9-480c-a4bd-2d2913f8d966", 1, 0, 0.0, 2706.0, 2706, 2706, 2706.0, 2706.0, 2706.0, 2706.0, 0.36954915003695493, 0.06676425073909831, 0.2547868163340724], "isController": false}, {"data": ["addBook", 58, 11, 18.96551724137931, 1225.2241379310346, 600, 4539, 964.0, 2134.9, 2268.149999999999, 4539.0, 0.26157585925414806, 81.96337205107044, 0.9502912850139582], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/579af42f-ece9-4adb-aab9-5720abf0d69a", 3, 0, 0.0, 562.0, 235, 910, 541.0, 910.0, 910.0, 910.0, 0.038448229459033416, 0.03205270691555487, 0.02465592839658067], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8c0caf83-74e7-4079-8355-167816fc1e05", 3, 0, 0.0, 461.6666666666667, 389, 565, 431.0, 565.0, 565.0, 565.0, 0.046133973057759736, 0.029659699475610504, 0.029584611628836806], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 211.07407407407408, 117, 580, 121.0, 477.0, 503.25, 580.0, 0.2491556392226344, 0.18516351703947734, 0.12044144669453519], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 739.5740740740739, 567, 1059, 700.5, 944.0, 1051.25, 1059.0, 0.24908438425417675, 73.2390793506739, 0.12527193153408303], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 176.7962962962963, 115, 474, 121.0, 358.5, 405.75, 474.0, 0.24962094597093304, 0.44171206455012757, 0.12139768661477016], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1126.8888888888891, 811, 1455, 1160.0, 1399.0, 1427.5, 1455.0, 0.24867946598387267, 223.76222062416244, 0.12482543507393609], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 136.4736842105263, 120, 354, 123.0, 134.0, 354.0, 354.0, 0.12381479912677984, 0.09249836067576814, 0.044012291877097515], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 11, 6.470588235294118, 201.5647058823529, 116, 2889, 126.0, 354.6, 418.9, 1268.069999999982, 0.7124775779115187, 1.540073818701698, 0.34255240901242223], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 153.125, 121, 355, 124.5, 355.0, 355.0, 355.0, 0.03784223571928629, 0.02930555949745511, 0.013451732228340051], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 124.52941176470588, 118, 141, 122.0, 137.0, 141.0, 141.0, 0.11253806434529326, 0.09132727682708858, 0.04000376506024096], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 416.50000000000006, 237, 1410, 240.5, 1410.0, 1410.0, 1410.0, 0.037106611934414065, 5.599370528363367, 0.0822668806094761], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=371810bb-d942-4037-aacb-a1035deddfdb", 1, 0, 0.0, 465.0, 465, 465, 465.0, 465.0, 465.0, 465.0, 2.150537634408602, 0.3885248655913978, 1.4826948924731183], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f5e35bb2-1edc-4f86-8ef4-69c7792ac699", 2, 0, 0.0, 238.5, 233, 244, 238.5, 244.0, 244.0, 244.0, 0.012575689933788993, 0.02149165760169017, 0.007816822893414739], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 12, 0, 0.0, 377.08333333333337, 237, 1172, 242.0, 967.1000000000007, 1172.0, 1172.0, 0.07820952331295541, 7.908257021341424, 0.1742274976537143], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 20, 0, 0.0, 160.1, 120, 366, 122.5, 355.9, 365.5, 366.0, 0.11059744741091375, 0.09169651645690016, 0.03931393638434825], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=594a28eb-a974-4b26-9918-2029e79daad9", 1, 0, 0.0, 313.0, 313, 313, 313.0, 313.0, 313.0, 313.0, 3.1948881789137378, 0.5772014776357828, 2.2027256389776357], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 123.50000000000001, 118, 135, 122.0, 134.5, 135.0, 135.0, 0.08571446064175642, 0.06654589473651987, 0.03046881218124935], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/70607348-d528-47c8-947f-f8bdec3dad97", 3, 0, 0.0, 309.0, 248, 420, 259.0, 420.0, 420.0, 420.0, 0.031463360916213066, 0.02622970940964247, 0.020176699545878824], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5a1d8991-86d7-41ed-ab8c-3e3bfa9f5bb5", 1, 0, 0.0, 765.0, 765, 765, 765.0, 765.0, 765.0, 765.0, 1.3071895424836601, 0.23616217320261437, 0.9012459150326797], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/77d55bf1-d601-4f69-b369-44edd3e67f3f", 1, 0, 0.0, 1705.0, 1705, 1705, 1705.0, 1705.0, 1705.0, 1705.0, 0.5865102639296188, 0.18729380498533724, 0.3499587609970674], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 131.42105263157893, 117, 350, 119.0, 123.0, 350.0, 350.0, 0.11566323735313813, 0.08595676135325987, 0.05805752343702441], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 169.3157894736842, 115, 357, 120.0, 355.0, 357.0, 357.0, 0.1156646455791755, 0.04009263824968953, 0.06545372881510703], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 265.3684210526316, 114, 1276, 122.0, 357.0, 1276.0, 1276.0, 0.11566323735313813, 5.507112195242588, 0.06747418503074207], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 255.4736842105263, 116, 930, 124.0, 475.0, 930.0, 930.0, 0.1156646455791755, 1.8194947623700295, 0.06758796029963231], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 23.333333333333332, 0.5451713395638629], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 10.0, 0.2336448598130841], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 10.0, 0.2336448598130841], "isController": false}, {"data": ["401/Unauthorized", 17, 56.666666666666664, 1.32398753894081], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1284, 30, "401/Unauthorized", 17, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
