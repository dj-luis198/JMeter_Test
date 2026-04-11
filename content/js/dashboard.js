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

    var data = {"OkPercent": 99.30981595092024, "KoPercent": 0.6901840490797546};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7898742554599603, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/966b0486-a1fd-450c-83c0-5c6258a5864a"], "isController": false}, {"data": [0.12280701754385964, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c9e10a4f-a744-49dc-b598-8dd8a834737b"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ce699a86-45b5-45ce-8d5d-9381fdf81ee8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/43d9e024-6ae4-436f-8bec-f1c97789bb31"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/87a2ebdd-b006-4517-85f2-e123c10a4a00"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b5810cb0-811c-4c51-9342-e3239a98f36f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/726a4132-8c20-4fe4-a167-3e5ae3527033"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.7916666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1b71a017-a37e-4286-b3f8-22d3564ec925"], "isController": false}, {"data": [0.023809523809523808, 500, 1500, "login"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/3caa82ff-d7d4-4820-8d82-13c70ada431c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=37f3dac3-9fdc-48d3-98c0-76c3a811b230"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/06f811f3-af42-4d21-89fe-e4eb3a1a8152"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e784b246-e3be-4121-abc2-61a98ded9334"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3ba77609-8ed8-4568-9701-365637dae3fe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7302776a-f83b-42bf-a601-65d733b560e6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=40f80c13-33a9-4572-acc6-a3c29f618dda"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9828a577-52a0-4a1a-ac65-9ce69a0042b4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=966b0486-a1fd-450c-83c0-5c6258a5864a"], "isController": false}, {"data": [0.38095238095238093, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a76b0f50-2c06-4128-8b7f-e22170559a30"], "isController": false}, {"data": [0.9791666666666666, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c47f4bd5-a12e-485d-9e21-1fede4c00228"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0709a8a3-dbac-48ad-8b93-2c61b398d7ef"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=87a2ebdd-b006-4517-85f2-e123c10a4a00"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4298245614035088, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.38095238095238093, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6818181818181818, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.30952380952380953, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c9e10a4f-a744-49dc-b598-8dd8a834737b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5526315789473685, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9548022598870056, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/37f3dac3-9fdc-48d3-98c0-76c3a811b230"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1b71a017-a37e-4286-b3f8-22d3564ec925"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=726a4132-8c20-4fe4-a167-3e5ae3527033"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e784b246-e3be-4121-abc2-61a98ded9334"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/40f80c13-33a9-4572-acc6-a3c29f618dda"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3caa82ff-d7d4-4820-8d82-13c70ada431c"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c47f4bd5-a12e-485d-9e21-1fede4c00228"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9828a577-52a0-4a1a-ac65-9ce69a0042b4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1304, 9, 0.6901840490797546, 374.51917177914095, 98, 5738, 117.0, 1081.0, 1223.5, 1695.2000000000007, 5.131110901249724, 728.2916161585234, 3.7391819426901343], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/966b0486-a1fd-450c-83c0-5c6258a5864a", 3, 0, 0.0, 406.6666666666667, 276, 534, 410.0, 534.0, 534.0, 534.0, 0.01841134629901254, 0.021761588024646655, 0.011806755276384993], "isController": false}, {"data": ["see books", 57, 0, 0.0, 1694.649122807017, 1203, 2132, 1720.0, 1979.0, 2018.6, 2132.0, 0.2539801360798834, 305.62443902276686, 1.2488183448849737], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/c9e10a4f-a744-49dc-b598-8dd8a834737b", 3, 0, 0.0, 701.3333333333333, 362, 1321, 421.0, 1321.0, 1321.0, 1321.0, 0.016107814974898656, 0.022205923313377538, 0.010329555827002066], "isController": false}, {"data": ["deleteBook", 12, 1, 8.333333333333334, 649.3333333333334, 105, 1267, 526.5, 1222.9, 1267.0, 1267.0, 0.06968964876417022, 0.013253963961740382, 0.047089286595776804], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, 8.333333333333334, 649.3333333333334, 105, 1267, 526.5, 1222.9, 1267.0, 1267.0, 0.0691387614943191, 0.01314919316505727, 0.046717052139268515], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ce699a86-45b5-45ce-8d5d-9381fdf81ee8", 1, 0, 0.0, 202.0, 202, 202, 202.0, 202.0, 202.0, 202.0, 4.9504950495049505, 1.580870977722772, 2.953859839108911], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 148.47058823529412, 99, 301, 103.0, 300.2, 301.0, 301.0, 0.08356148896742577, 0.02974189945095186, 0.047243346416440964], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 115.52941176470587, 100, 303, 103.0, 152.59999999999985, 303.0, 303.0, 0.08363466410842987, 0.062154276744643695, 0.04198068100755172], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/43d9e024-6ae4-436f-8bec-f1c97789bb31", 1, 0, 0.0, 182.0, 182, 182, 182.0, 182.0, 182.0, 182.0, 5.4945054945054945, 1.7545930631868132, 3.2784598214285716], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 200.47058823529412, 98, 810, 102.0, 401.99999999999966, 810.0, 810.0, 0.08364124792741909, 1.467882760185782, 0.04883076761755285], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 194.3529411764706, 99, 1081, 103.0, 452.99999999999943, 1081.0, 1081.0, 0.08356148896742577, 4.444066681146562, 0.04870260035980594], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 329.38461538461536, 101, 928, 282.0, 777.1999999999998, 928.0, 928.0, 0.07054099517065494, 0.14799725466655814, 0.04559835212165609], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/87a2ebdd-b006-4517-85f2-e123c10a4a00", 3, 0, 0.0, 1235.0, 181, 3087, 437.0, 3087.0, 3087.0, 3087.0, 0.033123550844650546, 0.0276137414430827, 0.021241339571602076], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 24, 0, 0.0, 110.95833333333333, 99, 295, 103.0, 110.0, 249.75, 295.0, 0.1129454285337801, 0.08393698350996744, 0.05669331080699509], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b5810cb0-811c-4c51-9342-e3239a98f36f", 2, 0, 0.0, 205.5, 185, 226, 205.5, 226.0, 226.0, 226.0, 0.018853873056872708, 0.026494847000820144, 0.011719228711620585], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 24, 0, 0.0, 118.625, 99, 304, 102.5, 201.5, 302.0, 304.0, 0.11294968091715141, 0.030222863839159654, 0.06441661489806291], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/726a4132-8c20-4fe4-a167-3e5ae3527033", 3, 0, 0.0, 763.6666666666666, 199, 1170, 922.0, 1170.0, 1170.0, 1170.0, 0.02582577929289016, 0.0259014407556623, 0.01656145351790157], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 2, 0, 0.0, 600.0, 600, 600, 600.0, 600.0, 600.0, 600.0, 0.014038141630810914, 4.127679749629745, 0.008006127648821849], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 2, 0, 0.0, 1102.0, 1099, 1105, 1102.0, 1105.0, 1105.0, 1105.0, 0.013988557360079455, 12.586928501860479, 0.007964188418873362], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 2, 0, 0.0, 303.0, 295, 311, 303.0, 311.0, 311.0, 311.0, 0.014066676044450697, 0.024891422844281894, 0.0077888723800815865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 134.99999999999997, 100, 296, 103.0, 296.0, 296.0, 296.0, 0.1056505432198764, 0.07851568690461518, 0.05303162032716452], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 119.33333333333334, 99, 303, 102.0, 246.3000000000002, 303.0, 303.0, 0.1056533338029037, 0.05471824677096999, 0.05877654540011798], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 328.58333333333337, 98, 1201, 110.0, 1175.5, 1201.0, 1201.0, 0.1047184382990235, 15.727826552450848, 0.060063114675416474], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 303.5, 100, 909, 204.5, 878.7, 909.0, 909.0, 0.10500065625410158, 5.169197346545916, 0.06032752548453428], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 2, 0, 0.0, 102.0, 102, 102, 102.0, 102.0, 102.0, 102.0, 0.014087384043220094, 0.01046923755555712, 0.007910396313331595], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 24, 0, 0.0, 134.91666666666669, 98, 308, 102.0, 300.5, 307.25, 308.0, 0.1128450590320715, 0.030415269817238022, 0.06634055228252642], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 638.95, 100, 1298, 674.5, 1209.4, 1293.6, 1298.0, 0.09722472035739807, 43.75458969041218, 0.052979876913504025], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 24, 0, 0.0, 143.83333333333331, 100, 308, 103.0, 302.5, 307.0, 308.0, 0.1128450590320715, 0.030415269817238022, 0.06645075253548742], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 438.05, 99, 904, 445.5, 815.5, 899.5999999999999, 904.0, 0.09722566563121333, 14.306889623347772, 0.05307533895297681], "isController": false}, {"data": ["deleteBooks", 12, 1, 8.333333333333334, 529.75, 105, 1297, 484.0, 1156.9000000000005, 1297.0, 1297.0, 0.06921013928540531, 0.013162768189289731, 0.047305986316578716], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 507.08333333333337, 201, 1303, 402.5, 1277.5, 1303.0, 1303.0, 0.10462257406406389, 20.995949008483148, 0.2308371767598389], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 592.4285714285716, 128, 1710, 433.0, 1599.4000000000003, 1707.0, 1710.0, 0.09047239514895633, 0.05557337553583353, 0.040906952103483184], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 103.54999999999998, 100, 110, 102.5, 107.9, 109.9, 110.0, 0.0973221802114811, 0.0723263468173214, 0.0488511724889661], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 141.7, 98, 303, 103.0, 295.0, 302.6, 303.0, 0.09732123306002287, 0.09912699812656627, 0.051416784263156615], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1b71a017-a37e-4286-b3f8-22d3564ec925", 1, 0, 0.0, 641.0, 641, 641, 641.0, 641.0, 641.0, 641.0, 1.5600624024960998, 0.28184721138845553, 1.0755898985959438], "isController": false}, {"data": ["login", 21, 0, 0.0, 2911.6666666666665, 1378, 7809, 2624.0, 4730.8, 7507.299999999996, 7809.0, 0.08866670607409159, 10.228469823764366, 0.14778196672254076], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/3caa82ff-d7d4-4820-8d82-13c70ada431c", 3, 0, 0.0, 1022.6666666666667, 282, 2335, 451.0, 2335.0, 2335.0, 2335.0, 0.056701128352454215, 0.0364533621406566, 0.036361075147895446], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 24, 0, 0.0, 130.41666666666669, 102, 458, 105.0, 225.5, 420.25, 458.0, 0.11481495656167476, 0.09295078026330897, 0.040813129090282826], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=37f3dac3-9fdc-48d3-98c0-76c3a811b230", 1, 0, 0.0, 424.0, 424, 424, 424.0, 424.0, 424.0, 424.0, 2.3584905660377355, 0.4260944870283019, 1.626068691037736], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/06f811f3-af42-4d21-89fe-e4eb3a1a8152", 1, 0, 0.0, 189.0, 189, 189, 189.0, 189.0, 189.0, 189.0, 5.291005291005291, 1.6896081349206349, 3.1570353835978837], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e784b246-e3be-4121-abc2-61a98ded9334", 2, 0, 0.0, 276.5, 192, 361, 276.5, 361.0, 361.0, 361.0, 0.08536793580331228, 0.05247960506658699, 0.053063174940242444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 744.25, 205, 1404, 781.0, 1311.8, 1399.3999999999999, 1404.0, 0.09717700791992614, 58.204045524391425, 0.20612154414265585], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3ba77609-8ed8-4568-9701-365637dae3fe", 1, 0, 0.0, 326.0, 326, 326, 326.0, 326.0, 326.0, 326.0, 3.067484662576687, 0.9795580904907976, 1.8303057898773005], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7302776a-f83b-42bf-a601-65d733b560e6", 1, 0, 0.0, 196.0, 196, 196, 196.0, 196.0, 196.0, 196.0, 5.1020408163265305, 1.6292649872448979, 3.044284119897959], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=40f80c13-33a9-4572-acc6-a3c29f618dda", 1, 0, 0.0, 396.0, 396, 396, 396.0, 396.0, 396.0, 396.0, 2.5252525252525255, 0.456222380050505, 1.7410432449494948], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 357.76470588235287, 205, 1182, 232.0, 718.7999999999996, 1182.0, 1182.0, 0.08351346040479465, 5.998941497592847, 0.1865668061628021], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 2, 50.0, 653.75, 101, 1208, 653.0, 1208.0, 1208.0, 1208.0, 0.027956974216680527, 16.7268706273545, 0.040781963121256384], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9828a577-52a0-4a1a-ac65-9ce69a0042b4", 1, 0, 0.0, 498.0, 498, 498, 498.0, 498.0, 498.0, 498.0, 2.008032128514056, 0.3627792419678715, 1.3844440261044177], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=966b0486-a1fd-450c-83c0-5c6258a5864a", 1, 0, 0.0, 1297.0, 1297, 1297, 1297.0, 1297.0, 1297.0, 1297.0, 0.7710100231303006, 0.1392938030069391, 0.5315752698535081], "isController": false}, {"data": ["register", 21, 2, 9.523809523809524, 1117.809523809524, 337, 2683, 1018.0, 1635.4, 2578.8999999999987, 2683.0, 0.09167223248078157, 0.029414918346232926, 0.04135993301379012], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a76b0f50-2c06-4128-8b7f-e22170559a30", 1, 0, 0.0, 302.0, 302, 302, 302.0, 302.0, 302.0, 302.0, 3.3112582781456954, 1.0574037665562914, 1.9757605546357617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 24, 0, 0.0, 281.5833333333334, 203, 600, 208.0, 411.5, 553.25, 600.0, 0.11278778508287553, 0.17479903801418306, 0.25366237211509995], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 108.26666666666667, 101, 129, 105.0, 123.60000000000001, 129.0, 129.0, 0.14943215780035862, 0.11601422407352063, 0.05311846234309624], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c47f4bd5-a12e-485d-9e21-1fede4c00228", 1, 0, 0.0, 529.0, 529, 529, 529.0, 529.0, 529.0, 529.0, 1.890359168241966, 0.34151996691871456, 1.303314035916824], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 453.4, 201, 1310, 208.0, 1206.2, 1310.0, 1310.0, 0.14099997180000565, 33.911815092636985, 0.30989700833309836], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0709a8a3-dbac-48ad-8b93-2c61b398d7ef", 1, 0, 0.0, 310.0, 310, 310, 310.0, 310.0, 310.0, 310.0, 3.225806451612903, 1.0301159274193548, 1.924773185483871], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=87a2ebdd-b006-4517-85f2-e123c10a4a00", 1, 0, 0.0, 506.0, 506, 506, 506.0, 506.0, 506.0, 506.0, 1.976284584980237, 0.35704360177865613, 1.3625555830039526], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 130.57142857142858, 100, 295, 104.0, 295.0, 295.0, 295.0, 0.038290703017307394, 0.02845627441032317, 0.019220138037984377], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 159.71428571428572, 100, 304, 106.0, 304.0, 304.0, 304.0, 0.03828965577599457, 0.010245474299436048, 0.021837069309746906], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 130.0, 98, 295, 103.0, 295.0, 295.0, 295.0, 0.03829028411390813, 0.0103204281400768, 0.02251049905915302], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 131.57142857142856, 101, 301, 104.0, 301.0, 301.0, 301.0, 0.038290074665645595, 0.010320371687224791, 0.022547768577523726], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 105.0, 105, 105, 105.0, 105.0, 105.0, 105.0, 9.523809523809526, 2.808779761904762, 5.887276785714286], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1163.6842105263163, 789, 1663, 1117.0, 1540.4, 1597.3999999999999, 1663.0, 0.2548989795096996, 304.94779671694585, 0.5033259146177858], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 2, 9.523809523809524, 1117.809523809524, 337, 2683, 1018.0, 1635.4, 2578.8999999999987, 2683.0, 0.08919810900008919, 0.02862104501955987, 0.04024367808402462], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 130.0, 98, 297, 102.0, 297.0, 297.0, 297.0, 0.03737239994874642, 0.01007302967368556, 0.02200738004794345], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 157.7142857142857, 98, 302, 103.0, 302.0, 302.0, 302.0, 0.03733213870489478, 0.01006217801030367, 0.02194721435580728], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 281.8, 99, 1180, 103.0, 1139.8, 1180.0, 1180.0, 0.13230313293818796, 15.9037840625441, 0.07626379811423935], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 209.06666666666666, 98, 803, 102.0, 683.0000000000001, 803.0, 803.0, 0.13230313293818796, 5.2177737131315265, 0.07639300039249929], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 159.85714285714286, 102, 302, 104.0, 302.0, 302.0, 302.0, 0.03733213870489478, 0.009989263676895673, 0.0212909853551353], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 116.46666666666668, 98, 304, 103.0, 187.60000000000008, 304.0, 304.0, 0.1325299075824778, 0.09849146452174373, 0.06652380126698591], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 131.0, 101, 303, 103.0, 303.0, 303.0, 303.0, 0.037371601853631455, 0.02777323145567728, 0.0187587923366861], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 142.79999999999998, 100, 303, 103.0, 300.6, 303.0, 303.0, 0.13254161806807338, 0.062008077307107765, 0.07410595156045666], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 144.71428571428572, 104, 364, 106.0, 364.0, 364.0, 364.0, 0.037070184450646346, 0.029178289714082966, 0.013177292128940693], "isController": false}, {"data": ["deleteAccount", 11, 1, 9.090909090909092, 621.8181818181819, 104, 1321, 451.0, 1290.8000000000002, 1321.0, 1321.0, 0.07798321234119782, 0.014704931020303992, 0.053073446893432394], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1652.2857142857142, 842, 5738, 1268.0, 2368.4, 5403.199999999995, 5738.0, 0.09019572472264814, 0.046683334084964376, 0.04148651010192117], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 320.4285714285714, 204, 606, 212.0, 606.0, 606.0, 606.0, 0.037311245076248195, 0.05782514251563075, 0.08391386465878867], "isController": false}, {"data": ["addBook", 60, 3, 5.0, 1228.4, 543, 3446, 1011.5, 1963.1, 2196.6999999999994, 3446.0, 0.2855130669813655, 103.54302384509964, 1.0360490359770258], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c9e10a4f-a744-49dc-b598-8dd8a834737b", 1, 0, 0.0, 830.0, 830, 830, 830.0, 830.0, 830.0, 830.0, 1.2048192771084338, 0.2176675451807229, 0.8306664156626506], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 171.64912280701753, 99, 423, 104.0, 410.2, 419.2, 423.0, 0.2559393648213588, 0.1902049381143106, 0.12372068904938731], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 641.438596491228, 487, 1004, 600.0, 812.4, 896.5999999999999, 1004.0, 0.25588306592804744, 75.23811750026935, 0.1286911903837348], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 154.59649122807022, 98, 308, 106.0, 305.0, 306.0, 308.0, 0.2563445270443476, 0.4536096513714432, 0.12466755319148937], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 990.6315789473686, 687, 1296, 1010.0, 1209.6, 1230.8999999999999, 1296.0, 0.25541868499706494, 229.82618173851623, 0.12820820711766734], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 120.39999999999999, 103, 304, 106.0, 191.80000000000007, 304.0, 304.0, 0.14734195120034577, 0.11007479752760206, 0.052375459215747905], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 3, 1.694915254237288, 213.65536723163834, 99, 3027, 111.0, 350.8000000000002, 475.49999999999966, 2934.18, 0.7385647642017242, 1.576214433099385, 0.35601048151710385], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 105.99999999999999, 103, 112, 105.0, 112.0, 112.0, 112.0, 0.04010771787085315, 0.031059980733971235, 0.01425704033690483], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 134.05882352941177, 103, 317, 108.0, 309.8, 317.0, 317.0, 0.07968090142535071, 0.06466291902779926, 0.028324070428542635], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/37f3dac3-9fdc-48d3-98c0-76c3a811b230", 3, 0, 0.0, 642.6666666666666, 439, 928, 561.0, 928.0, 928.0, 928.0, 0.03139224611520954, 0.026170423926123582, 0.020131095327787372], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1b71a017-a37e-4286-b3f8-22d3564ec925", 3, 0, 0.0, 421.66666666666663, 194, 704, 367.0, 704.0, 704.0, 704.0, 0.023617398149970478, 0.023686589746112967, 0.015145271600078725], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 292.14285714285717, 205, 597, 210.0, 597.0, 597.0, 597.0, 0.03826851376026416, 0.05930872200931565, 0.08606678436512535], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=726a4132-8c20-4fe4-a167-3e5ae3527033", 1, 0, 0.0, 470.0, 470, 470, 470.0, 470.0, 470.0, 470.0, 2.127659574468085, 0.38439162234042556, 1.4669215425531916], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e784b246-e3be-4121-abc2-61a98ded9334", 1, 0, 0.0, 220.0, 220, 220, 220.0, 220.0, 220.0, 220.0, 4.545454545454545, 0.8212002840909091, 3.133877840909091], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 439.8666666666667, 204, 1282, 397.0, 1243.6, 1282.0, 1282.0, 0.13217372914959422, 21.260961814458927, 0.2927527629816631], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/40f80c13-33a9-4572-acc6-a3c29f618dda", 3, 0, 0.0, 386.0, 195, 551, 412.0, 551.0, 551.0, 551.0, 0.01955684196116011, 0.023115525117504025, 0.012541334200353327], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 123.58333333333333, 103, 306, 105.0, 252.30000000000018, 306.0, 306.0, 0.10819583446037329, 0.08970533540708683, 0.038460238030835814], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 128.9, 103, 306, 106.0, 284.10000000000036, 305.7, 306.0, 0.10047676223681369, 0.07800686130690125, 0.035716349076367365], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3caa82ff-d7d4-4820-8d82-13c70ada431c", 1, 0, 0.0, 441.0, 441, 441, 441.0, 441.0, 441.0, 441.0, 2.2675736961451247, 0.4096690759637188, 1.5633857709750567], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c47f4bd5-a12e-485d-9e21-1fede4c00228", 3, 0, 0.0, 761.6666666666666, 337, 1058, 890.0, 1058.0, 1058.0, 1058.0, 0.035472313859033024, 0.029571808526361845, 0.022747545020278342], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9828a577-52a0-4a1a-ac65-9ce69a0042b4", 3, 0, 0.0, 272.6666666666667, 187, 378, 253.0, 378.0, 378.0, 378.0, 0.06634526073687469, 0.042653610011499844, 0.04254562618868592], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 118.2, 99, 306, 104.0, 193.20000000000007, 306.0, 306.0, 0.14236361565620137, 0.1057995229632512, 0.07145986176492919], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 154.60000000000002, 98, 306, 102.0, 304.2, 306.0, 306.0, 0.14208447395591592, 0.08069954106714912, 0.07864597640450503], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 319.8, 99, 1203, 101.0, 1092.0, 1203.0, 1203.0, 0.14113263645173735, 25.42871059753206, 0.08054483666249541], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 254.0, 98, 807, 102.0, 804.0, 807.0, 807.0, 0.1414440494488397, 8.34834825764505, 0.08086068998764721], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 2, 22.22222222222222, 0.15337423312883436], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 11.11111111111111, 0.07668711656441718], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 11.11111111111111, 0.07668711656441718], "isController": false}, {"data": ["401/Unauthorized", 5, 55.55555555555556, 0.3834355828220859], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1304, 9, "401/Unauthorized", 5, "406/Not Acceptable", 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 2, "406/Not Acceptable", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
