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

    var data = {"OkPercent": 96.4474678760393, "KoPercent": 3.5525321239606953};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7104922279792746, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.8529411764705882, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a8a46581-047e-41e0-a6b0-f0546450a3c8"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/372e2e2b-9af1-4dfe-a047-ebcad891c903"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=35e70be6-3eb8-4653-8cc6-91d4f128313f"], "isController": false}, {"data": [0.775, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e6895476-bad3-49c3-b2b5-75df7cdbd76a"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.24545454545454545, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.10416666666666667, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5d1211c2-bf86-480e-a62b-99983b6d65e9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.4, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/abb9f91f-3653-4e78-a0f6-3295ee527c86"], "isController": false}, {"data": [0.23809523809523808, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=92d24d5a-d028-442c-8064-e2f174ea19dd"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5d1211c2-bf86-480e-a62b-99983b6d65e9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.23770491803278687, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4257d7bc-0030-4ccc-864e-eb72fb0a1362"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.990909090909091, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5588235294117647, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.4090909090909091, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.43333333333333335, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8728813559322034, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2117820d-20f6-4bc4-8fbf-29dbe11964da"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c1875936-9d57-4b74-b8da-f26e5c565111"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5a6a6db9-77eb-4ff0-9b70-cb1e3e27b565"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/92d24d5a-d028-442c-8064-e2f174ea19dd"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/d66dadb9-2df6-48e5-b7d3-f3bc36d31825"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4257d7bc-0030-4ccc-864e-eb72fb0a1362"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2117820d-20f6-4bc4-8fbf-29dbe11964da"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/e6895476-bad3-49c3-b2b5-75df7cdbd76a"], "isController": false}, {"data": [0.38235294117647056, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b4762b2c-560c-4f72-ab1f-c89f92fb6816"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b4762b2c-560c-4f72-ab1f-c89f92fb6816"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a8a46581-047e-41e0-a6b0-f0546450a3c8"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.14705882352941177, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/5a6a6db9-77eb-4ff0-9b70-cb1e3e27b565"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=59ddb7e2-5b35-4f2a-9c1c-8666736bd81d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.10416666666666667, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/35e70be6-3eb8-4653-8cc6-91d4f128313f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/59ddb7e2-5b35-4f2a-9c1c-8666736bd81d"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1323, 47, 3.5525321239606953, 454.89720332577474, 125, 5669, 141.0, 1270.6000000000001, 1547.0, 2327.5599999999995, 5.09926806424384, 694.9642371610123, 3.732869495787226], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 2162.927272727273, 1552, 2911, 2197.0, 2608.4, 2728.1999999999994, 2911.0, 0.23175361640984155, 278.87676396104854, 1.1395307213120627], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 341.88235294117646, 258, 521, 268.0, 518.6, 521.0, 521.0, 0.09920229682494297, 0.15374418463006298, 0.22310829061312856], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 149.8125, 130, 384, 133.5, 214.60000000000016, 384.0, 384.0, 0.14805629840746945, 0.11494605198626778, 0.05262938732453016], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a8a46581-047e-41e0-a6b0-f0546450a3c8", 1, 0, 0.0, 691.0, 691, 691, 691.0, 691.0, 691.0, 691.0, 1.447178002894356, 0.2614530571635311, 0.9977613965267729], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/372e2e2b-9af1-4dfe-a047-ebcad891c903", 1, 0, 0.0, 519.0, 519, 519, 519.0, 519.0, 519.0, 519.0, 1.9267822736030829, 0.6152908236994219, 1.1496718448940269], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=35e70be6-3eb8-4653-8cc6-91d4f128313f", 1, 0, 0.0, 532.0, 532, 532, 532.0, 532.0, 532.0, 532.0, 1.8796992481203008, 0.339594102443609, 1.2959645206766917], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 20, 0, 0.0, 392.15, 259, 787, 268.5, 527.7, 774.0499999999998, 787.0, 0.09734633880419757, 0.15086781218970854, 0.21893419752545606], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 154.81818181818184, 128, 391, 131.0, 339.8000000000002, 391.0, 391.0, 0.059443072450297486, 0.04417595520964491, 0.02983763597602823], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 154.63636363636368, 126, 405, 130.0, 350.6000000000002, 405.0, 405.0, 0.05944114516068023, 0.024021315054280575, 0.03344619833348644], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e6895476-bad3-49c3-b2b5-75df7cdbd76a", 1, 0, 0.0, 541.0, 541, 541, 541.0, 541.0, 541.0, 541.0, 1.8484288354898337, 0.3339446626617375, 1.2744050369685767], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 255.81818181818184, 128, 1257, 131.0, 1082.2000000000007, 1257.0, 1257.0, 0.05944114516068023, 4.87685994213945, 0.03448050803266021], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 212.3636363636364, 127, 778, 131.0, 699.0000000000002, 778.0, 778.0, 0.059441466366937576, 1.603452552875886, 0.03453874266438267], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, 100.0, 139.0, 133, 148, 136.0, 148.0, 148.0, 148.0, 0.04612418475503445, 0.013603031050801176, 0.028512313427672666], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1495.6545454545453, 1021, 2341, 1513.0, 2059.0, 2090.3999999999996, 2341.0, 0.24273558591957067, 290.39614930334886, 0.47930796360290223], "isController": false}, {"data": ["deleteBook", 15, 5, 33.333333333333336, 513.2666666666668, 133, 960, 573.0, 844.8000000000001, 960.0, 960.0, 0.09038540335992673, 0.019771806984983972, 0.05999213458687845], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 5, 33.333333333333336, 513.2666666666668, 133, 960, 573.0, 844.8000000000001, 960.0, 960.0, 0.09034511835210504, 0.01976299463952298, 0.05996539593748118], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 9, 37.5, 1287.5416666666663, 252, 2830, 1123.5, 2501.5, 2802.0, 2830.0, 0.0937426763534099, 0.029157267986876026, 0.04229405905788611], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 130.5, 129, 132, 130.5, 132.0, 132.0, 132.0, 0.07438723515044818, 0.020049684474144236, 0.043804201948945555], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 197.66666666666666, 127, 392, 131.0, 386.0, 392.0, 392.0, 0.10236601994090068, 0.027390907679498817, 0.05838062074754493], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 130.5, 127, 134, 131.5, 134.0, 134.0, 134.0, 0.0743900019837334, 0.020050430222178138, 0.043733184759968256], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 181.46666666666664, 128, 382, 132.0, 380.2, 382.0, 382.0, 0.10254797536113978, 0.07620996997053454, 0.05147427669494712], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5d1211c2-bf86-480e-a62b-99983b6d65e9", 1, 0, 0.0, 555.0, 555, 555, 555.0, 555.0, 555.0, 555.0, 1.8018018018018018, 0.3255208333333333, 1.2422578828828827], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 214.26666666666665, 126, 393, 130.0, 391.8, 393.0, 393.0, 0.10255218196859169, 0.027641017796221978, 0.0603896149678328], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 198.46666666666667, 126, 395, 131.0, 392.0, 395.0, 395.0, 0.10237510237510238, 0.02759328931203931, 0.06018536291973792], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 305.9375, 126, 1513, 133.0, 821.4000000000008, 1513.0, 1513.0, 0.1430180381500617, 8.079131224077981, 0.08331080054346855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 218.625, 128, 775, 131.0, 507.60000000000025, 775.0, 775.0, 0.1426978818283166, 2.658427396878484, 0.08326365663322186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 129.5, 127, 133, 129.0, 133.0, 133.0, 133.0, 0.0743900019837334, 0.01990513724955366, 0.04242554800634794], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 132.75, 128, 147, 132.0, 139.3, 147.0, 147.0, 0.1430180381500617, 0.10628586624237983, 0.07178835118079269], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 130.83333333333331, 127, 137, 130.0, 137.0, 137.0, 137.0, 0.07438815740534108, 0.05528260525924273, 0.03733936807260284], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 228.74999999999997, 128, 396, 134.5, 393.2, 396.0, 396.0, 0.1426978818283166, 0.05157817725752508, 0.08063336120401338], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 225.66666666666669, 132, 401, 144.0, 401.0, 401.0, 401.0, 0.0760253924810887, 0.05984029915991941, 0.02702465123351199], "isController": false}, {"data": ["deleteAccount", 15, 5, 33.333333333333336, 446.7333333333333, 131, 854, 516.0, 835.4, 854.0, 854.0, 0.09298404393806023, 0.019492748794306895, 0.06326062885108914], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/abb9f91f-3653-4e78-a0f6-3295ee527c86", 1, 0, 0.0, 252.0, 252, 252, 252.0, 252.0, 252.0, 252.0, 3.968253968253968, 1.2672061011904763, 2.3677765376984126], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 2242.571428571429, 1188, 5669, 1515.0, 4892.200000000001, 5599.499999999999, 5669.0, 0.09204309369986938, 0.04763949185637771, 0.04233622766859227], "isController": false}, {"data": ["goToProfile", 15, 5, 33.333333333333336, 214.13333333333333, 129, 321, 240.0, 289.8, 321.0, 321.0, 0.0902608538676776, 0.15638163041189035, 0.05832284991124349], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 262.6666666666667, 257, 269, 262.5, 269.0, 269.0, 269.0, 0.07426845571124424, 0.11510160079467248, 0.16703149756151905], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=92d24d5a-d028-442c-8064-e2f174ea19dd", 1, 0, 0.0, 493.0, 493, 493, 493.0, 493.0, 493.0, 493.0, 2.028397565922921, 0.3664585446247465, 1.3984850405679514], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5d1211c2-bf86-480e-a62b-99983b6d65e9", 3, 0, 0.0, 390.6666666666667, 245, 520, 407.0, 520.0, 520.0, 520.0, 0.025381354856722254, 0.029999902176028156, 0.01627645477465587], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 135.0588235294117, 127, 185, 132.0, 152.99999999999997, 185.0, 185.0, 0.09927876894326511, 0.07378041324787572, 0.04983328831722486], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 159.47058823529412, 127, 385, 130.0, 382.6, 385.0, 385.0, 0.09927702963127344, 0.026564361444305587, 0.05661893096158563], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 924.1428571428572, 757, 1101, 1004.0, 1101.0, 1101.0, 1101.0, 0.07718091205786363, 22.69375079248258, 0.044017238908000356], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1186.7142857142856, 1127, 1472, 1140.0, 1472.0, 1472.0, 1472.0, 0.07686563886326701, 69.16383696454847, 0.04376237056375456], "isController": false}, {"data": ["addBook", 61, 18, 29.508196721311474, 1315.6721311475412, 661, 5559, 1006.0, 2358.8000000000006, 3161.899999999999, 5559.0, 0.2723834444449406, 70.52019324851864, 0.9919555833582645], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 318.42857142857144, 133, 397, 390.0, 397.0, 397.0, 397.0, 0.07749706618249452, 0.13713348039324227, 0.04291097316940859], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 130.7142857142857, 128, 133, 130.5, 133.0, 133.0, 133.0, 0.06881027042436276, 0.05113732011029303, 0.03453953027160397], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 166.35714285714286, 127, 393, 130.0, 387.5, 393.0, 393.0, 0.06881196148496213, 0.025794885673841132, 0.038831526814546845], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4257d7bc-0030-4ccc-864e-eb72fb0a1362", 1, 0, 0.0, 486.0, 486, 486, 486.0, 486.0, 486.0, 486.0, 2.05761316872428, 0.37173675411522633, 1.418627829218107], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 266.0, 128, 1510, 129.0, 955.0, 1510.0, 1510.0, 0.06856325695060017, 4.4238270250035505, 0.039886827773995916], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 230.70909090909092, 129, 533, 133.0, 517.8, 525.4, 533.0, 0.24426097731037574, 0.18152598020819916, 0.11807537477405859], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 193.5, 127, 771, 130.0, 574.5, 771.0, 771.0, 0.06872717276047599, 1.4606345941905903, 0.04004930254192357], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 823.8545454545455, 627, 1285, 770.0, 1084.9999999999998, 1157.3999999999999, 1285.0, 0.24417205694980265, 71.79469201857039, 0.12280137629799645], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 182.2857142857143, 128, 480, 133.0, 480.0, 480.0, 480.0, 0.07772250843844378, 0.05776057511880441, 0.04364301010947771], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 203.8363636363637, 127, 515, 133.0, 390.0, 394.0, 515.0, 0.24443575339543483, 0.4325367042505155, 0.1188759816317642], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 942.294117647059, 127, 1698, 1388.0, 1639.6, 1698.0, 1698.0, 0.11457146900841764, 60.65483860165522, 0.06156373627669684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 145.58823529411765, 128, 379, 131.0, 183.79999999999984, 379.0, 379.0, 0.09927818916582962, 0.026758574423602514, 0.058364716677567804], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1263.5272727272727, 891, 1829, 1263.0, 1533.8, 1650.9999999999998, 1829.0, 0.24332622525814698, 218.94536520916103, 0.12213835916278082], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 20, 0, 0.0, 165.54999999999998, 130, 431, 141.0, 321.2000000000004, 426.3999999999999, 431.0, 0.1011577504539454, 0.075571952243426, 0.0359584191066759], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 650.8823529411765, 126, 1179, 777.0, 1174.2, 1179.0, 1179.0, 0.1145645200420519, 19.827875232498585, 0.06167188173908941], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 160.2941176470588, 126, 391, 130.0, 387.0, 391.0, 391.0, 0.09927876894326511, 0.02675873069173942, 0.05846200944608287], "isController": false}, {"data": ["deleteBooks", 15, 5, 33.333333333333336, 421.66666666666674, 133, 721, 493.0, 703.0, 721.0, 721.0, 0.09067279211751193, 0.019834673275705737, 0.06035998042978903], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 18, 10.169491525423728, 226.18644067796612, 129, 3572, 136.0, 365.8000000000004, 430.3999999999999, 3061.879999999999, 0.7392372074374781, 1.5604297051195308, 0.35576769470756275], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 155.9090909090909, 129, 396, 132.0, 344.4000000000002, 396.0, 396.0, 0.06379400336368381, 0.049402973308009045, 0.02267677463318448], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 416.2142857142857, 260, 1644, 264.0, 1087.5, 1644.0, 1644.0, 0.06851862727824436, 5.953755394312465, 0.15284777485757914], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2117820d-20f6-4bc4-8fbf-29dbe11964da", 3, 0, 0.0, 317.6666666666667, 230, 479, 244.0, 479.0, 479.0, 479.0, 0.023758424341297685, 0.028081653249756477, 0.015235708317824361], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 136.53333333333333, 131, 148, 133.0, 145.6, 148.0, 148.0, 0.10363696661507849, 0.08410382739954124, 0.036839702976453684], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c1875936-9d57-4b74-b8da-f26e5c565111", 1, 0, 0.0, 270.0, 270, 270, 270.0, 270.0, 270.0, 270.0, 3.7037037037037037, 1.1827256944444444, 2.209924768518518], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 789.6190476190476, 280, 1791, 722.0, 1522.2, 1767.8999999999996, 1791.0, 0.09337981573049696, 0.05735928134226815, 0.04222153777658212], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 150.47058823529412, 127, 389, 132.0, 224.99999999999986, 389.0, 389.0, 0.11455679995687273, 0.08513449684294937, 0.057502143728352134], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 244.58823529411765, 127, 518, 133.0, 418.7999999999999, 518.0, 518.0, 0.11456683627051252, 0.13187558968224553, 0.0596790022576406], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5a6a6db9-77eb-4ff0-9b70-cb1e3e27b565", 1, 0, 0.0, 578.0, 578, 578, 578.0, 578.0, 578.0, 578.0, 1.7301038062283738, 0.3125675821799308, 1.1928254757785468], "isController": false}, {"data": ["login", 21, 0, 0.0, 3985.0000000000005, 1913, 7729, 3600.0, 6571.8, 7621.699999999999, 7729.0, 0.09386985168563433, 37.55988830186086, 0.19351489932458407], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/92d24d5a-d028-442c-8064-e2f174ea19dd", 3, 0, 0.0, 1313.0, 240, 2845, 854.0, 2845.0, 2845.0, 2845.0, 0.03815920018316416, 0.024532688919840243, 0.024470580846625456], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 412.0, 258, 1388, 265.0, 1265.2000000000005, 1388.0, 1388.0, 0.0594000594000594, 6.543973340848341, 0.13221048377298378], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 150.58823529411765, 130, 388, 136.0, 193.59999999999982, 388.0, 388.0, 0.10040812951467436, 0.08128744078873539, 0.0356919522884194], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d66dadb9-2df6-48e5-b7d3-f3bc36d31825", 1, 0, 0.0, 574.0, 574, 574, 574.0, 574.0, 574.0, 574.0, 1.7421602787456445, 0.5563343858885018, 1.0395116506968642], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 488.99999999999994, 257, 1648, 515.5, 954.3000000000006, 1648.0, 1648.0, 0.14253008721059712, 10.86430892115859, 0.318274277996027], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4257d7bc-0030-4ccc-864e-eb72fb0a1362", 3, 0, 0.0, 449.3333333333333, 321, 541, 486.0, 541.0, 541.0, 541.0, 0.03912363067292644, 0.03261576111763171, 0.025089047013562855], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2117820d-20f6-4bc4-8fbf-29dbe11964da", 1, 0, 0.0, 721.0, 721, 721, 721.0, 721.0, 721.0, 721.0, 1.3869625520110958, 0.2505742891816921, 0.956245665742025], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 136.7857142857143, 130, 149, 135.5, 147.0, 149.0, 149.0, 0.07136267018722506, 0.059166901356400466, 0.025367199168115157], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e6895476-bad3-49c3-b2b5-75df7cdbd76a", 3, 0, 0.0, 477.3333333333333, 264, 650, 518.0, 650.0, 650.0, 650.0, 0.03030578537442798, 0.025264686309866554, 0.019434374084512734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 1110.1176470588234, 259, 1831, 1519.0, 1770.2, 1831.0, 1831.0, 0.11445422167762959, 80.61835707907777, 0.2401842355299567], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b4762b2c-560c-4f72-ab1f-c89f92fb6816", 1, 0, 0.0, 481.0, 481, 481, 481.0, 481.0, 481.0, 481.0, 2.079002079002079, 0.37560096153846156, 1.4333744802494803], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b4762b2c-560c-4f72-ab1f-c89f92fb6816", 3, 0, 0.0, 512.0, 260, 823, 453.0, 823.0, 823.0, 823.0, 0.025490479305979214, 0.02556515844457095, 0.016346433669524433], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 136.8823529411765, 129, 192, 133.0, 147.99999999999997, 192.0, 192.0, 0.11272611532544692, 0.08751685711301788, 0.04007061130709246], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a8a46581-047e-41e0-a6b0-f0546450a3c8", 3, 0, 0.0, 430.0, 252, 687, 351.0, 687.0, 687.0, 687.0, 0.022076842128501938, 0.022141520376925284, 0.01415734993266563], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 467.2, 260, 777, 512.0, 774.0, 777.0, 777.0, 0.10227319215087341, 0.15850347260101183, 0.23001480617525535], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 17, 10, 58.8235294117647, 641.7647058823529, 129, 1608, 134.0, 1602.4, 1608.0, 1608.0, 0.11913104414856342, 58.70434039943939, 0.1570438419761738], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5a6a6db9-77eb-4ff0-9b70-cb1e3e27b565", 3, 0, 0.0, 1100.3333333333333, 232, 2442, 627.0, 2442.0, 2442.0, 2442.0, 0.018917657741736135, 0.02607951840372804, 0.012131440674225322], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=59ddb7e2-5b35-4f2a-9c1c-8666736bd81d", 1, 0, 0.0, 552.0, 552, 552, 552.0, 552.0, 552.0, 552.0, 1.8115942028985508, 0.32728996829710144, 1.2490092844202898], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 20, 0, 0.0, 144.24999999999997, 128, 397, 130.5, 134.9, 383.8999999999998, 397.0, 0.09740844823471541, 0.07239045811193205, 0.04889447499281613], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 20, 0, 0.0, 180.95, 125, 391, 130.0, 389.20000000000005, 390.95, 391.0, 0.09741129483963665, 0.026065131627012152, 0.05555487908823028], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 20, 0, 0.0, 219.75, 128, 395, 132.0, 392.5, 394.9, 395.0, 0.09741176928996562, 0.026255515941436044, 0.05726746593023369], "isController": false}, {"data": ["register", 24, 9, 37.5, 1287.5416666666663, 252, 2830, 1123.5, 2501.5, 2802.0, 2830.0, 0.0936486692133902, 0.029128028461391387, 0.04225164568026003], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 20, 0, 0.0, 193.35, 127, 389, 129.5, 386.9, 388.9, 389.0, 0.09741129483963665, 0.026255388062245817, 0.0573623152229501], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/35e70be6-3eb8-4653-8cc6-91d4f128313f", 3, 0, 0.0, 414.6666666666667, 241, 528, 475.0, 528.0, 528.0, 528.0, 0.035509261999171454, 0.022829034000118365, 0.022771238977333255], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/59ddb7e2-5b35-4f2a-9c1c-8666736bd81d", 3, 0, 0.0, 394.0, 269, 516, 397.0, 516.0, 516.0, 516.0, 0.020327957717847945, 0.0240269578364277, 0.013035832260468897], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 19.148936170212767, 0.6802721088435374], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 5, 10.638297872340425, 0.3779289493575208], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 5, 10.638297872340425, 0.3779289493575208], "isController": false}, {"data": ["401/Unauthorized", 28, 59.57446808510638, 2.1164021164021163], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1323, 47, "401/Unauthorized", 28, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 5, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 18, "401/Unauthorized", 18, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 17, 10, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 5, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
