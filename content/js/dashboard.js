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

    var data = {"OkPercent": 99.31506849315069, "KoPercent": 0.684931506849315};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7817225509533202, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.008620689655172414, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/20c76f48-a900-4d7a-9c4d-8d9cb7055e61"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6bbf61d3-faa0-4949-ae57-53158add3262"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=184c8a92-affc-4db5-b613-e207a7679c33"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8ad35598-cacc-4040-b915-e18adce7e64e"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7083333333333334, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/843c3356-d600-4db9-a6bb-e6fa6b9c9f73"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/192a6b17-8e07-4859-8344-0c3d8057d10d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7105263157894737, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f89139f4-efca-4aea-9265-c98ed17907cb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/de89544d-4671-4a27-8966-9cb5c758389e"], "isController": false}, {"data": [0.65, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/2790cc53-4843-4562-a665-dc207039f736"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a5f6ff55-9b7d-410f-9db1-2a44418f0db5"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b9db8faa-ddc4-4fe0-a71d-ec6f1f4fd234"], "isController": false}, {"data": [0.7105263157894737, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a0310f70-31d8-4223-b48d-87733e5aadf1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8ad35598-cacc-4040-b915-e18adce7e64e"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1543e26c-c81d-43d7-bddf-7dd2049ae93e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/fb1c230c-8445-4f28-b05f-722a3fdc678a"], "isController": false}, {"data": [0.2727272727272727, 500, 1500, "register"], "isController": true}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.3879310344827586, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2727272727272727, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=20c76f48-a900-4d7a-9c4d-8d9cb7055e61"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/fc7e73a8-7038-4a0d-876a-5f6f3938ddd3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/184c8a92-affc-4db5-b613-e207a7679c33"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c6b31d0b-fbcc-4026-99a5-141afc58c7b8"], "isController": false}, {"data": [0.3305084745762712, 500, 1500, "addBook"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f89139f4-efca-4aea-9265-c98ed17907cb"], "isController": false}, {"data": [0.9827586206896551, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.47413793103448276, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6bbf61d3-faa0-4949-ae57-53158add3262"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9602272727272727, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2790cc53-4843-4562-a665-dc207039f736"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c6b31d0b-fbcc-4026-99a5-141afc58c7b8"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a0310f70-31d8-4223-b48d-87733e5aadf1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1543e26c-c81d-43d7-bddf-7dd2049ae93e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fb1c230c-8445-4f28-b05f-722a3fdc678a"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b9db8faa-ddc4-4fe0-a71d-ec6f1f4fd234"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a5f6ff55-9b7d-410f-9db1-2a44418f0db5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1314, 9, 0.684931506849315, 400.4954337899542, 107, 3103, 127.0, 1127.5, 1355.0, 1922.6499999999974, 5.064247338765002, 713.3363496445584, 3.7077804750911487], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 1893.3275862068963, 1459, 2568, 1827.5, 2380.5, 2487.25, 2568.0, 0.250101334161255, 300.95632346052923, 1.2297463061542175], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/20c76f48-a900-4d7a-9c4d-8d9cb7055e61", 3, 0, 0.0, 367.3333333333333, 228, 479, 395.0, 479.0, 479.0, 479.0, 0.028471912458359828, 0.02855532626439018, 0.01825835531997684], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6bbf61d3-faa0-4949-ae57-53158add3262", 1, 0, 0.0, 696.0, 696, 696, 696.0, 696.0, 696.0, 696.0, 1.4367816091954022, 0.25957480244252873, 0.9905935704022989], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=184c8a92-affc-4db5-b613-e207a7679c33", 1, 0, 0.0, 512.0, 512, 512, 512.0, 512.0, 512.0, 512.0, 1.953125, 0.3528594970703125, 1.346588134765625], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8ad35598-cacc-4040-b915-e18adce7e64e", 1, 0, 0.0, 650.0, 650, 650, 650.0, 650.0, 650.0, 650.0, 1.5384615384615385, 0.2779447115384615, 1.0606971153846154], "isController": false}, {"data": ["deleteBook", 12, 0, 0.0, 630.9166666666667, 461, 1075, 557.5, 1029.4, 1075.0, 1075.0, 0.07649646203863071, 0.013820161598776056, 0.05199368904188181], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 0, 0.0, 630.9166666666667, 461, 1075, 557.5, 1029.4, 1075.0, 1075.0, 0.07698130637276915, 0.013907755545861614, 0.05232323167524153], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 211.73333333333335, 107, 457, 115.0, 393.40000000000003, 457.0, 457.0, 0.06767395590365033, 0.03166048483877808, 0.03783749565758783], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 114.46666666666667, 109, 120, 115.0, 119.4, 120.0, 120.0, 0.06774333405592889, 0.05034441134429872, 0.03400397822729243], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 234.86666666666667, 108, 918, 115.0, 771.6000000000001, 918.0, 918.0, 0.06774272217354782, 2.671638888387091, 0.03911524758835909], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 269.3333333333334, 108, 1343, 114.0, 1140.2, 1343.0, 1343.0, 0.06774302811335667, 8.143197118098678, 0.03904926893982161], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/843c3356-d600-4db9-a6bb-e6fa6b9c9f73", 1, 0, 0.0, 522.0, 522, 522, 522.0, 522.0, 522.0, 522.0, 1.9157088122605364, 0.6117546695402298, 1.143064535440613], "isController": false}, {"data": ["goToProfile", 12, 0, 0.0, 266.6666666666667, 204, 439, 225.0, 437.8, 439.0, 439.0, 0.07704160246533129, 0.19782663432524397, 0.04980619221879815], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 126.15789473684211, 108, 341, 114.0, 128.0, 341.0, 341.0, 0.09851654818755476, 0.07321395817454021, 0.0494506892269562], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 114.84210526315789, 107, 142, 114.0, 116.0, 142.0, 142.0, 0.09852472192693613, 0.02636306035935596, 0.05618988047395577], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 825.25, 601, 912, 894.0, 912.0, 912.0, 912.0, 0.05950078838544611, 17.495207397435518, 0.03393404337607473], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1224.25, 1116, 1358, 1211.5, 1358.0, 1358.0, 1358.0, 0.059092923622396216, 53.17191654971192, 0.033643725070172846], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 227.5, 110, 340, 230.0, 340.0, 340.0, 340.0, 0.060202883718130096, 0.10653088407934741, 0.033334995183769305], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/192a6b17-8e07-4859-8344-0c3d8057d10d", 1, 0, 0.0, 640.0, 640, 640, 640.0, 640.0, 640.0, 640.0, 1.5625, 0.49896240234375, 0.93231201171875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 116.46153846153847, 110, 127, 115.0, 126.2, 127.0, 127.0, 0.08410048066659334, 0.06250045487038822, 0.042214499084598615], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 180.3846153846154, 109, 339, 114.0, 336.2, 339.0, 339.0, 0.08398421096833794, 0.022472337700512303, 0.04789724531788024], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 149.3076923076923, 109, 343, 115.0, 342.2, 343.0, 343.0, 0.08410211290385187, 0.022668147618616324, 0.04944284371886604], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 167.23076923076923, 110, 357, 115.0, 350.2, 357.0, 357.0, 0.08398149822992843, 0.022635638194785396, 0.04945394866469418], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 113.75, 110, 117, 114.0, 117.0, 117.0, 117.0, 0.06019654170867884, 0.044735906484672454, 0.03380176902586946], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 756.6315789473684, 109, 1581, 1117.0, 1346.0, 1581.0, 1581.0, 0.0996031600413091, 47.18276844034557, 0.054050686868633915], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 167.31578947368422, 108, 439, 115.0, 338.0, 439.0, 439.0, 0.09840990314393742, 0.026524544206764387, 0.05785425946547884], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 508.3157894736843, 113, 940, 674.0, 907.0, 940.0, 940.0, 0.09960472650639042, 15.426978267821383, 0.05414880716787066], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 158.8421052631579, 108, 339, 114.0, 338.0, 339.0, 339.0, 0.09852625465406914, 0.02655590457472957, 0.05801887847305047], "isController": false}, {"data": ["deleteBooks", 12, 0, 0.0, 568.9166666666667, 240, 795, 619.0, 765.3000000000001, 795.0, 795.0, 0.077090105484961, 0.013927411635466588, 0.053150014133186006], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f89139f4-efca-4aea-9265-c98ed17907cb", 1, 0, 0.0, 795.0, 795, 795, 795.0, 795.0, 795.0, 795.0, 1.2578616352201257, 0.22725039308176098, 0.8672366352201257], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 320.99999999999994, 224, 474, 239.0, 469.6, 474.0, 474.0, 0.08391698673466094, 0.13005493940225285, 0.18873126997062906], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/de89544d-4671-4a27-8966-9cb5c758389e", 1, 0, 0.0, 232.0, 232, 232, 232.0, 232.0, 232.0, 232.0, 4.310344827586206, 1.3764480064655171, 2.571895204741379], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 669.1, 168, 1550, 641.5, 1437.0000000000007, 1545.95, 1550.0, 0.08889402498811043, 0.05460384933351705, 0.040193294501460086], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 115.26315789473684, 114, 117, 115.0, 117.0, 117.0, 117.0, 0.09960159362549802, 0.07402032495019921, 0.04999533117529881], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 174.21052631578945, 112, 342, 116.0, 341.0, 342.0, 342.0, 0.09960368219086162, 0.10538864111744847, 0.05240251289605569], "isController": false}, {"data": ["login", 20, 0, 0.0, 3046.3499999999995, 1800, 4726, 2908.0, 4304.700000000001, 4706.299999999999, 4726.0, 0.08960332607546391, 21.563652942797237, 0.16490862140802667], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 128.78947368421052, 109, 349, 117.0, 126.0, 349.0, 349.0, 0.10029666698339298, 0.0811972040324539, 0.035652330841752976], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2790cc53-4843-4562-a665-dc207039f736", 3, 0, 0.0, 742.3333333333334, 439, 1127, 661.0, 1127.0, 1127.0, 1127.0, 0.018573896246215568, 0.025605615430573873, 0.011910994663100478], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a5f6ff55-9b7d-410f-9db1-2a44418f0db5", 1, 0, 0.0, 653.0, 653, 653, 653.0, 653.0, 653.0, 653.0, 1.5313935681470139, 0.2766677833078101, 1.055824081163859], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b9db8faa-ddc4-4fe0-a71d-ec6f1f4fd234", 1, 0, 0.0, 691.0, 691, 691, 691.0, 691.0, 691.0, 691.0, 1.447178002894356, 0.2614530571635311, 0.9977613965267729], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 873.3157894736843, 228, 1699, 1232.0, 1464.0, 1699.0, 1699.0, 0.09954158480681075, 62.750097208578914, 0.21046680582842175], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a0310f70-31d8-4223-b48d-87733e5aadf1", 1, 0, 0.0, 588.0, 588, 588, 588.0, 588.0, 588.0, 588.0, 1.7006802721088434, 0.30725180697278914, 1.1725393282312926], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8ad35598-cacc-4040-b915-e18adce7e64e", 3, 0, 0.0, 370.3333333333333, 224, 452, 435.0, 452.0, 452.0, 452.0, 0.020733123237684524, 0.0245058497643335, 0.013295655201249517], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 483.59999999999997, 224, 1458, 453.0, 1255.8000000000002, 1458.0, 1458.0, 0.0676394725924857, 10.880227509593531, 0.14981526673626017], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 0, 0.0, 1338.0, 1230, 1468, 1327.0, 1468.0, 1468.0, 1468.0, 0.058990959635435866, 70.57369629979206, 0.1330177009748256], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1543e26c-c81d-43d7-bddf-7dd2049ae93e", 1, 0, 0.0, 240.0, 240, 240, 240.0, 240.0, 240.0, 240.0, 4.166666666666667, 0.7527669270833334, 2.872721354166667], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fb1c230c-8445-4f28-b05f-722a3fdc678a", 3, 0, 0.0, 1195.0, 222, 2742, 621.0, 2742.0, 2742.0, 2742.0, 0.018089070583553416, 0.02493724411502237, 0.011600087581250074], "isController": false}, {"data": ["register", 22, 6, 27.272727272727273, 1173.2272727272727, 178, 2463, 1228.5, 1781.3, 2361.1499999999987, 2463.0, 0.08869215356643244, 0.027905272748529525, 0.040015405222355256], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 329.47368421052636, 224, 681, 232.0, 556.0, 681.0, 681.0, 0.09834419432812799, 0.15241429335814366, 0.2211783979860144], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 119.49999999999999, 111, 126, 118.5, 125.5, 126.0, 126.0, 0.11267696319487482, 0.08747869701164597, 0.040053139260678154], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 352.12500000000006, 229, 568, 345.5, 499.4000000000001, 568.0, 568.0, 0.08735484082310098, 0.13538294178345828, 0.1964630843902359], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 137.6, 109, 339, 116.5, 317.1000000000001, 339.0, 339.0, 0.04841348993483544, 0.03597916585977517, 0.024301302564946697], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 179.8, 107, 342, 115.5, 342.0, 342.0, 342.0, 0.04841278678524572, 0.027496949994432533, 0.026797233935427028], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 360.2, 109, 1239, 118.5, 1215.5, 1239.0, 1239.0, 0.0483598748446439, 8.713287676573994, 0.027599131698447167], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 299.40000000000003, 109, 850, 115.5, 832.4000000000001, 850.0, 850.0, 0.04836127809185741, 2.8543922015021015, 0.027647160346653644], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 1308.5172413793105, 884, 2098, 1232.5, 1902.9, 2010.6999999999998, 2098.0, 0.2599917519857991, 311.040523132542, 0.5133821508938337], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, 27.272727272727273, 1173.2272727272727, 178, 2463, 1228.5, 1781.3, 2361.1499999999987, 2463.0, 0.08525942116603884, 0.026825229812894324, 0.038466652908896434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 11, 0, 0.0, 132.54545454545453, 107, 323, 115.0, 281.60000000000014, 323.0, 323.0, 0.074761273660244, 0.02015049954123764, 0.044024460954225714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 11, 0, 0.0, 154.5454545454546, 108, 338, 115.0, 338.0, 338.0, 338.0, 0.07464813583246244, 0.02012000536109339, 0.043884939229631235], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 184.64285714285714, 108, 1119, 113.0, 618.5, 1119.0, 1119.0, 0.11173630232650944, 7.209431055209705, 0.06500284328983598], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 217.8571428571429, 110, 907, 115.0, 623.0, 907.0, 907.0, 0.11154756308413076, 2.3706813912769804, 0.06500197698136359], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 11, 0, 0.0, 114.0, 109, 122, 114.0, 120.80000000000001, 122.0, 122.0, 0.07476178177715552, 0.020004617389590442, 0.04263757866978401], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 115.2142857142857, 113, 119, 115.0, 117.5, 119.0, 119.0, 0.11173362703315297, 0.08303641618381778, 0.056085043256875605], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 11, 0, 0.0, 134.72727272727272, 109, 339, 115.0, 294.60000000000014, 339.0, 339.0, 0.07476330616933209, 0.05556140233873215, 0.03752767516702802], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 162.42857142857142, 112, 352, 114.5, 346.5, 352.0, 352.0, 0.11152357130339191, 0.04180578070482897, 0.0629342697994169], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 11, 0, 0.0, 163.72727272727272, 116, 347, 121.0, 346.2, 347.0, 347.0, 0.07461724743757589, 0.058731934994810706, 0.026524099675075803], "isController": false}, {"data": ["deleteAccount", 12, 0, 0.0, 527.9166666666666, 430, 661, 515.5, 649.0, 661.0, 661.0, 0.07716198229132507, 0.013940397191303844, 0.05252138833696638], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1608.95, 887, 3103, 1497.0, 2567.8000000000006, 3077.5999999999995, 3103.0, 0.09203399735862428, 0.047634783789131704, 0.04233204370694534], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=20c76f48-a900-4d7a-9c4d-8d9cb7055e61", 1, 0, 0.0, 461.0, 461, 461, 461.0, 461.0, 461.0, 461.0, 2.1691973969631237, 0.3918960140997831, 1.495559924078091], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 11, 0, 0.0, 291.72727272727275, 225, 677, 232.0, 632.4000000000001, 677.0, 677.0, 0.07459194813825279, 0.11560295087442107, 0.167759039611715], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fc7e73a8-7038-4a0d-876a-5f6f3938ddd3", 1, 0, 0.0, 684.0, 684, 684, 684.0, 684.0, 684.0, 684.0, 1.461988304093567, 0.46686540570175433, 0.8723387244152047], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/184c8a92-affc-4db5-b613-e207a7679c33", 3, 0, 0.0, 353.3333333333333, 275, 487, 298.0, 487.0, 487.0, 487.0, 0.01991555803393611, 0.02745520451618471, 0.012771370223585331], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c6b31d0b-fbcc-4026-99a5-141afc58c7b8", 1, 0, 0.0, 650.0, 650, 650, 650.0, 650.0, 650.0, 650.0, 1.5384615384615385, 0.2779447115384615, 1.0606971153846154], "isController": false}, {"data": ["addBook", 59, 3, 5.084745762711864, 1227.627118644068, 670, 2897, 1036.0, 2081.0, 2212.0, 2897.0, 0.2707179531887363, 83.32022521210064, 0.9861605842116372], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f89139f4-efca-4aea-9265-c98ed17907cb", 3, 0, 0.0, 518.0, 285, 720, 549.0, 720.0, 720.0, 720.0, 0.04714905387565223, 0.03031229863424907, 0.03023555863770667], "isController": false}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 200.62068965517238, 108, 611, 117.0, 458.2, 468.5499999999998, 611.0, 0.2609180717254782, 0.19390493416317275, 0.1261273881876091], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 718.155172413793, 532, 1031, 673.5, 911.5, 1012.5999999999999, 1031.0, 0.26083358817074703, 76.69373541243186, 0.13118095498821752], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 168.29310344827584, 109, 477, 116.0, 341.0, 345.29999999999995, 477.0, 0.2613672209454283, 0.46249746518859, 0.1271102304988509], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 1104.0172413793107, 766, 1927, 1093.5, 1369.1000000000001, 1516.3999999999996, 1927.0, 0.2605746119459982, 234.4654938703192, 0.1307962407619561], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6bbf61d3-faa0-4949-ae57-53158add3262", 3, 0, 0.0, 647.0, 204, 1225, 512.0, 1225.0, 1225.0, 1225.0, 0.05418879375745096, 0.034838173069975796, 0.034749975163469525], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 146.50000000000003, 115, 345, 118.0, 342.9, 345.0, 345.0, 0.08689748811948404, 0.06491853360488799, 0.030889341479972843], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 3, 1.7045454545454546, 208.3409090909091, 108, 1421, 122.0, 426.7000000000002, 499.6, 1410.9899999999998, 0.7362168493265289, 1.5416051736488747, 0.35427658067012463], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 122.2, 115, 166, 118.0, 161.3, 166.0, 166.0, 0.04953167798465509, 0.03835802797053856, 0.017606963658607862], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 133.8, 116, 324, 119.0, 207.60000000000008, 324.0, 324.0, 0.06549417538466913, 0.053150058344394575, 0.023281132656269105], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2790cc53-4843-4562-a665-dc207039f736", 1, 0, 0.0, 438.0, 438, 438, 438.0, 438.0, 438.0, 438.0, 2.28310502283105, 0.4124750285388128, 1.574093892694064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 533.5, 225, 1354, 346.0, 1330.5, 1354.0, 1354.0, 0.04833392945179657, 11.624763163745685, 0.10623080236739586], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c6b31d0b-fbcc-4026-99a5-141afc58c7b8", 3, 0, 0.0, 293.6666666666667, 205, 430, 246.0, 430.0, 430.0, 430.0, 0.02001000500250125, 0.02758540728697682, 0.0128319368017342], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 382.92857142857144, 229, 1235, 235.5, 851.0, 1235.0, 1235.0, 0.11142061281337047, 9.681616531536012, 0.24855128332670115], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 153.53846153846155, 116, 347, 119.0, 344.2, 347.0, 347.0, 0.08721320273715283, 0.07230860266000268, 0.031001568160472292], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a0310f70-31d8-4223-b48d-87733e5aadf1", 3, 0, 0.0, 351.6666666666667, 228, 571, 256.0, 571.0, 571.0, 571.0, 0.019437983114872003, 0.02297503798505867, 0.012465112869888622], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 124.8421052631579, 112, 233, 118.0, 129.0, 233.0, 233.0, 0.09716185118895422, 0.07543327313986192, 0.03453800178982357], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1543e26c-c81d-43d7-bddf-7dd2049ae93e", 3, 0, 0.0, 365.0, 214, 568, 313.0, 568.0, 568.0, 568.0, 0.1020026520689538, 0.046087135765529905, 0.06541185695828092], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fb1c230c-8445-4f28-b05f-722a3fdc678a", 1, 0, 0.0, 453.0, 453, 453, 453.0, 453.0, 453.0, 453.0, 2.207505518763797, 0.3988169150110375, 1.5219715783664458], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b9db8faa-ddc4-4fe0-a71d-ec6f1f4fd234", 3, 0, 0.0, 316.3333333333333, 213, 519, 217.0, 519.0, 519.0, 519.0, 0.025886169882304213, 0.026130538022469195, 0.01660018055603493], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a5f6ff55-9b7d-410f-9db1-2a44418f0db5", 3, 0, 0.0, 303.6666666666667, 205, 486, 220.0, 486.0, 486.0, 486.0, 0.04273808675831612, 0.027476471792862743, 0.027406911104779545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 115.50000000000001, 110, 129, 115.0, 122.7, 129.0, 129.0, 0.08740972214634572, 0.0649597642122745, 0.043875583186739946], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 182.31250000000003, 109, 344, 115.0, 341.2, 344.0, 344.0, 0.08741115475598629, 0.023389312893691644, 0.049851674196773436], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 182.68750000000003, 108, 341, 115.0, 339.6, 341.0, 341.0, 0.08741163230296871, 0.023560166519159535, 0.05138847914686247], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 192.31250000000003, 108, 453, 114.5, 376.70000000000005, 453.0, 453.0, 0.08741258741258741, 0.023560423951048952, 0.051474404501748255], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 66.66666666666667, 0.45662100456621], "isController": false}, {"data": ["401/Unauthorized", 3, 33.333333333333336, 0.228310502283105], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1314, 9, "406/Not Acceptable", 6, "401/Unauthorized", 3, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
