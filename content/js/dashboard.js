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

    var data = {"OkPercent": 98.02342606149341, "KoPercent": 1.9765739385065886};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8098680075424262, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3620689655172414, 500, 1500, "see books"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eea8e907-e32c-4303-a931-57a1a068458c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d9db06f5-db7f-414f-97b0-afac6dab2177"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/570b7f3f-5671-42d8-8de5-717f26f2f020"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d688493e-3ef8-4d24-b32f-b312fe675688"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5625, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d50cd71b-6210-4abb-b269-90cd29403b7c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=31578967-c778-4fb0-b659-7ccc7866ef1e"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6c100ec4-66cf-416a-8293-e7d826209163"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1a7b420c-206d-47d2-9902-58fbd2373fb7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/19acef1e-d433-41b6-af7a-b231fe6f8305"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=82827f28-8aeb-4d83-8145-991acda2b527"], "isController": false}, {"data": [0.7045454545454546, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d50cd71b-6210-4abb-b269-90cd29403b7c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cae6223b-26ea-4084-b1a2-6193fb616c52"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=570b7f3f-5671-42d8-8de5-717f26f2f020"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ba1b2118-2774-45c2-9954-a99f52a2adcb"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.4, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8c6bdb34-5aad-4c20-b8a1-7de254e5ad34"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/eea8e907-e32c-4303-a931-57a1a068458c"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.49137931034482757, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d9db06f5-db7f-414f-97b0-afac6dab2177"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.8, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/8c794c2a-3e05-47bd-9a76-ee717868dcf2"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1a7b420c-206d-47d2-9902-58fbd2373fb7"], "isController": false}, {"data": [0.3360655737704918, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ba1b2118-2774-45c2-9954-a99f52a2adcb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6c100ec4-66cf-416a-8293-e7d826209163"], "isController": false}, {"data": [0.8017241379310345, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/31578967-c778-4fb0-b659-7ccc7866ef1e"], "isController": false}, {"data": [0.9055555555555556, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d688493e-3ef8-4d24-b32f-b312fe675688"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cae6223b-26ea-4084-b1a2-6193fb616c52"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/82827f28-8aeb-4d83-8145-991acda2b527"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=19acef1e-d433-41b6-af7a-b231fe6f8305"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8c794c2a-3e05-47bd-9a76-ee717868dcf2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8c6bdb34-5aad-4c20-b8a1-7de254e5ad34"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1366, 27, 1.9765739385065886, 306.9948755490483, 81, 2379, 100.0, 823.3, 996.6499999999999, 1531.9699999999993, 5.4638688671471884, 769.191535496898, 4.005341371807076], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 1377.2241379310349, 1034, 1968, 1342.5, 1609.8000000000002, 1727.75, 1968.0, 0.26021570985051057, 313.12738396706703, 1.2794786123997273], "isController": true}, {"data": ["deleteBook", 15, 1, 6.666666666666667, 535.0666666666666, 87, 961, 518.0, 916.0, 961.0, 961.0, 0.0949860053952051, 0.01788408382831596, 0.0642577852904672], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 1, 6.666666666666667, 535.0666666666666, 87, 961, 518.0, 916.0, 961.0, 961.0, 0.09423353583073145, 0.017742407918129904, 0.06374874158965693], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eea8e907-e32c-4303-a931-57a1a068458c", 1, 0, 0.0, 593.0, 593, 593, 593.0, 593.0, 593.0, 593.0, 1.6863406408094435, 0.30466115092748736, 1.1626528246205734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 161.52941176470588, 83, 249, 98.0, 249.0, 249.0, 249.0, 0.11708714727496883, 0.041674630314551174, 0.06619782303999559], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 85.05882352941177, 82, 93, 85.0, 92.2, 93.0, 93.0, 0.11708553442659081, 0.08701376142444883, 0.05877144989772234], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 175.4705882352941, 82, 658, 85.0, 331.5999999999997, 658.0, 658.0, 0.11708714727496883, 2.0548498400382944, 0.06835688636003609], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 155.2941176470588, 82, 812, 84.0, 363.1999999999996, 812.0, 812.0, 0.11708714727496883, 6.227068191640666, 0.06824254344277537], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d9db06f5-db7f-414f-97b0-afac6dab2177", 3, 0, 0.0, 263.6666666666667, 173, 434, 184.0, 434.0, 434.0, 434.0, 0.047889662218249154, 0.030788438437839218, 0.030710493024072538], "isController": false}, {"data": ["goToProfile", 15, 1, 6.666666666666667, 239.26666666666665, 84, 406, 209.0, 399.4, 406.0, 406.0, 0.09515351433646282, 0.19078403522265924, 0.06150906535460544], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/570b7f3f-5671-42d8-8de5-717f26f2f020", 3, 0, 0.0, 307.3333333333333, 209, 388, 325.0, 388.0, 388.0, 388.0, 0.06444960041247745, 0.0291617658116353, 0.0413299846395119], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d688493e-3ef8-4d24-b32f-b312fe675688", 3, 0, 0.0, 376.6666666666667, 273, 462, 395.0, 462.0, 462.0, 462.0, 0.019109253974724825, 0.026343649278307176, 0.012254306748114554], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 86.5, 83, 117, 84.5, 91.80000000000004, 117.0, 117.0, 0.10779604987363907, 0.08011015034554622, 0.05410856409672899], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 84.44444444444444, 82, 92, 84.0, 89.30000000000001, 92.0, 92.0, 0.10779669543241446, 0.03783879228774532, 0.06097484519196795], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 655.5, 495, 748, 654.5, 748.0, 748.0, 748.0, 0.09768844712002248, 28.723647015007387, 0.05571294249813781], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 823.0, 731, 935, 816.0, 935.0, 935.0, 935.0, 0.09719353662981411, 87.45491510752035, 0.05533577329607581], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 125.125, 83, 249, 84.5, 249.0, 249.0, 249.0, 0.09798637989319485, 0.17338996129537992, 0.05425613027289206], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 87.70588235294117, 82, 109, 85.0, 102.6, 109.0, 109.0, 0.08538937555251949, 0.06345831522994856, 0.04286146390038576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 113.4705882352941, 81, 252, 84.0, 248.8, 252.0, 252.0, 0.0853975254811146, 0.022850509747876366, 0.04870327625094817], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 103.52941176470588, 82, 252, 84.0, 248.0, 252.0, 252.0, 0.0853975254811146, 0.02301730178983167, 0.05020440462854588], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 94.11764705882354, 81, 247, 85.0, 119.79999999999988, 247.0, 247.0, 0.0853975254811146, 0.02301730178983167, 0.05028780064952353], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d50cd71b-6210-4abb-b269-90cd29403b7c", 1, 0, 0.0, 572.0, 572, 572, 572.0, 572.0, 572.0, 572.0, 1.7482517482517483, 0.3158462631118881, 1.2053376311188813], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 83.5, 81, 85, 84.0, 85.0, 85.0, 85.0, 0.09817998846385136, 0.0729638390829989, 0.055130364615932154], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 620.8125, 84, 1300, 789.5, 1134.8000000000002, 1300.0, 1300.0, 0.07899245128387418, 44.431450674768335, 0.04219616294167889], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 119.27777777777777, 82, 562, 83.0, 280.30000000000047, 562.0, 562.0, 0.10779734099892202, 5.416120427970416, 0.06285838872918913], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=31578967-c778-4fb0-b659-7ccc7866ef1e", 1, 0, 0.0, 453.0, 453, 453, 453.0, 453.0, 453.0, 453.0, 2.207505518763797, 0.3988169150110375, 1.5219715783664458], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 445.24999999999994, 84, 745, 568.0, 739.4, 745.0, 745.0, 0.07899245128387418, 14.52448627135882, 0.0422733040073858], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 124.77777777777777, 82, 654, 83.0, 290.40000000000055, 654.0, 654.0, 0.10779669543241446, 1.7883186373000521, 0.0629632824992065], "isController": false}, {"data": ["deleteBooks", 15, 1, 6.666666666666667, 463.2666666666667, 87, 1201, 446.0, 836.2000000000003, 1201.0, 1201.0, 0.09424893027464139, 0.017745306403272324, 0.06453229164703148], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6c100ec4-66cf-416a-8293-e7d826209163", 1, 0, 0.0, 510.0, 510, 510, 510.0, 510.0, 510.0, 510.0, 1.9607843137254901, 0.3542432598039216, 1.3518688725490196], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1a7b420c-206d-47d2-9902-58fbd2373fb7", 3, 0, 0.0, 298.3333333333333, 190, 421, 284.0, 421.0, 421.0, 421.0, 0.035641729336707416, 0.02917934546934217, 0.02285618710719844], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 202.94117647058826, 167, 337, 173.0, 334.6, 337.0, 337.0, 0.08535379146562502, 0.13228170610932316, 0.19196267748567813], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/19acef1e-d433-41b6-af7a-b231fe6f8305", 3, 0, 0.0, 290.6666666666667, 214, 421, 237.0, 421.0, 421.0, 421.0, 0.023491089046888212, 0.02355991059683027, 0.015064272598427663], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=82827f28-8aeb-4d83-8145-991acda2b527", 1, 0, 0.0, 358.0, 358, 358, 358.0, 358.0, 358.0, 358.0, 2.793296089385475, 0.504648219273743, 1.925846717877095], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 632.0000000000001, 165, 1406, 662.5, 1205.0, 1376.2999999999995, 1406.0, 0.09438090416906195, 0.057974207736660115, 0.04267417834987859], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 95.49999999999999, 82, 249, 85.0, 141.9000000000001, 249.0, 249.0, 0.07899089136283972, 0.05870319172570413, 0.039649724766112907], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 161.74999999999997, 83, 334, 86.5, 277.30000000000007, 334.0, 334.0, 0.07899323126749576, 0.09528944230778724, 0.04090445398397425], "isController": false}, {"data": ["login", 22, 0, 0.0, 2602.4999999999995, 1542, 3899, 2529.0, 3589.5, 3854.149999999999, 3899.0, 0.09398375789783966, 41.01174516624445, 0.19847226998543252], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d50cd71b-6210-4abb-b269-90cd29403b7c", 3, 0, 0.0, 316.0, 197, 461, 290.0, 461.0, 461.0, 461.0, 0.028644540350609173, 0.0287284599024176, 0.018369057451399762], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cae6223b-26ea-4084-b1a2-6193fb616c52", 1, 0, 0.0, 430.0, 430, 430, 430.0, 430.0, 430.0, 430.0, 2.3255813953488373, 0.42014898255813954, 1.6033793604651163], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 106.0, 83, 375, 88.5, 133.80000000000038, 375.0, 375.0, 0.10027687559539394, 0.0811811815122867, 0.035645295621800195], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=570b7f3f-5671-42d8-8de5-717f26f2f020", 1, 0, 0.0, 193.0, 193, 193, 193.0, 193.0, 193.0, 193.0, 5.181347150259067, 0.936083225388601, 3.5722959844559585], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ba1b2118-2774-45c2-9954-a99f52a2adcb", 3, 0, 0.0, 515.6666666666666, 275, 866, 406.0, 866.0, 866.0, 866.0, 0.020676251257805287, 0.024438629009469724, 0.013259184563110812], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 717.4375, 169, 1385, 877.0, 1220.5000000000002, 1385.0, 1385.0, 0.07895775759968417, 59.083968568027046, 0.16495154584484803], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 318.4705882352941, 169, 897, 330.0, 453.7999999999996, 897.0, 897.0, 0.11701702941945787, 8.405570914040668, 0.2614128709267749], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 2, 20.0, 742.4, 82, 1019, 865.5, 1016.7, 1019.0, 1019.0, 0.12136658777838462, 116.16380127738334, 0.23501738955640514], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8c6bdb34-5aad-4c20-b8a1-7de254e5ad34", 3, 0, 0.0, 653.0, 192, 1287, 480.0, 1287.0, 1287.0, 1287.0, 0.026869682042095836, 0.026948401813703535, 0.017230883340797132], "isController": false}, {"data": ["register", 24, 8, 33.333333333333336, 938.3333333333333, 135, 1635, 913.0, 1560.0, 1621.75, 1635.0, 0.09334235642778801, 0.029169486383683756, 0.042113445966443425], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/eea8e907-e32c-4303-a931-57a1a068458c", 3, 0, 0.0, 284.3333333333333, 165, 476, 212.0, 476.0, 476.0, 476.0, 0.026474403664057466, 0.026551965393542012, 0.01697740078717227], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 221.6111111111111, 167, 738, 171.0, 375.3000000000006, 738.0, 738.0, 0.10774185052613937, 7.318630576763075, 0.24078246022530017], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 101.06666666666665, 86, 251, 89.0, 158.60000000000005, 251.0, 251.0, 0.09260516860314363, 0.07189561429638593, 0.03291824352689871], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 309.8235294117647, 167, 859, 333.0, 574.1999999999997, 859.0, 859.0, 0.09408847637549052, 6.75856637526912, 0.21019110511066463], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 99.0, 83, 249, 84.5, 202.50000000000017, 249.0, 249.0, 0.0558526606811232, 0.041507690213217534, 0.02803541756845442], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 97.66666666666666, 82, 249, 84.0, 200.1000000000002, 249.0, 249.0, 0.055855780375071565, 0.02193684864014448, 0.0314643320114132], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 193.75, 82, 902, 85.0, 707.3000000000006, 902.0, 902.0, 0.05581291510855612, 4.1988363079872935, 0.03241218768022921], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 159.24999999999997, 82, 663, 84.5, 538.8000000000004, 663.0, 663.0, 0.055856300357945796, 1.3824343426644388, 0.032491929928271206], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 87.0, 87, 87, 87.0, 87.0, 87.0, 87.0, 11.494252873563218, 3.3899066091954024, 7.105334051724139], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 949.6034482758621, 653, 1574, 898.5, 1252.8, 1377.75, 1574.0, 0.27506141457446104, 329.06907865096605, 0.5431388479194924], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, 33.333333333333336, 938.3333333333333, 135, 1635, 913.0, 1560.0, 1621.75, 1635.0, 0.09615192003365317, 0.030047475010516616, 0.043381042046433366], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 120.28571428571429, 81, 337, 84.0, 337.0, 337.0, 337.0, 0.04871462969922196, 0.013130115036118419, 0.028686446981084808], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 119.42857142857144, 83, 336, 83.0, 336.0, 336.0, 336.0, 0.04871395167575994, 0.013129932287607171, 0.028638475496882306], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 150.20000000000002, 82, 268, 84.0, 256.0, 268.0, 268.0, 0.09059393383019072, 0.024417896227668594, 0.05325932438063947], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d9db06f5-db7f-414f-97b0-afac6dab2177", 1, 0, 0.0, 446.0, 446, 446, 446.0, 446.0, 446.0, 446.0, 2.242152466367713, 0.40507637331838564, 1.5458590246636772], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 127.6, 82, 248, 84.0, 248.0, 248.0, 248.0, 0.09059393383019072, 0.024417896227668594, 0.053347795019145515], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 107.14285714285715, 83, 250, 83.0, 250.0, 250.0, 250.0, 0.04865740322390052, 0.013019656722020255, 0.027749925276130762], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 96.66666666666667, 81, 251, 84.0, 164.60000000000005, 251.0, 251.0, 0.09059338668277216, 0.06732574928280236, 0.04547363354975087], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 113.14285714285714, 84, 250, 85.0, 250.0, 250.0, 250.0, 0.04871327367117149, 0.036201954359142086, 0.02445177994822475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 139.66666666666669, 82, 270, 84.0, 256.8, 270.0, 270.0, 0.09059393383019072, 0.024240954950656503, 0.051666852887530645], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 112.28571428571428, 85, 249, 91.0, 249.0, 249.0, 249.0, 0.04839434477513913, 0.03809164246949428, 0.01720267724428774], "isController": false}, {"data": ["deleteAccount", 15, 1, 6.666666666666667, 531.8, 82, 1287, 461.0, 1048.8000000000002, 1287.0, 1287.0, 0.09780461246552387, 0.01823648503263414, 0.0665657173642309], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/8c794c2a-3e05-47bd-9a76-ee717868dcf2", 3, 0, 0.0, 478.3333333333333, 264, 659, 512.0, 659.0, 659.0, 659.0, 0.08770391159445712, 0.03962663713968309, 0.05624241726597672], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1439.181818181818, 980, 2328, 1277.5, 2097.0, 2295.1499999999996, 2328.0, 0.09545421018149317, 0.04940501112909314, 0.04390520800340164], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 258.7142857142857, 168, 589, 175.0, 589.0, 589.0, 589.0, 0.04862833364594405, 0.07536441942979805, 0.10936626209629799], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1a7b420c-206d-47d2-9902-58fbd2373fb7", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 0.4221122955607477, 1.6108717873831777], "isController": false}, {"data": ["addBook", 61, 15, 24.59016393442623, 872.2295081967212, 430, 3478, 710.0, 1384.4, 1809.1999999999998, 3478.0, 0.2854081570587052, 79.5034614511835, 1.0384426657121868], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ba1b2118-2774-45c2-9954-a99f52a2adcb", 1, 0, 0.0, 1201.0, 1201, 1201, 1201.0, 1201.0, 1201.0, 1201.0, 0.8326394671107411, 0.15042802872606162, 0.5740658825978351], "isController": false}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 155.12068965517236, 82, 396, 85.0, 338.0, 343.15, 396.0, 0.2758082847102349, 0.2049708053364148, 0.1333252938784827], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6c100ec4-66cf-416a-8293-e7d826209163", 3, 0, 0.0, 249.66666666666669, 177, 385, 187.0, 385.0, 385.0, 385.0, 0.03712549655351641, 0.030949998917173017, 0.023807691474748476], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 539.7413793103449, 404, 826, 492.0, 717.3000000000001, 740.8, 826.0, 0.2757636990372043, 81.08368373350767, 0.13868975098062522], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 129.10344827586204, 82, 343, 87.5, 250.1, 263.9499999999998, 343.0, 0.2761825852594688, 0.48871371532241936, 0.13431535884689008], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 791.1379310344828, 567, 1220, 805.5, 977.3, 1010.3499999999999, 1220.0, 0.2755449138209528, 247.9357978123872, 0.13831063057028295], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 89.70588235294116, 85, 107, 88.0, 101.39999999999999, 107.0, 107.0, 0.09459685048133103, 0.07067049865060375, 0.03362622419453564], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/31578967-c778-4fb0-b659-7ccc7866ef1e", 3, 0, 0.0, 417.3333333333333, 386, 471, 395.0, 471.0, 471.0, 471.0, 0.029955366503909175, 0.024972556515791472, 0.019209658858301133], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 15, 8.333333333333334, 149.71111111111117, 83, 2379, 91.0, 236.70000000000002, 289.24999999999983, 1667.009999999998, 0.7657032984796536, 1.6674900857375, 0.36690365139443076], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 97.16666666666666, 84, 118, 94.5, 115.00000000000001, 118.0, 118.0, 0.05919494869771113, 0.04584140070047356, 0.021041954419889503], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d688493e-3ef8-4d24-b32f-b312fe675688", 1, 0, 0.0, 477.0, 477, 477, 477.0, 477.0, 477.0, 477.0, 2.0964360587002098, 0.3787506551362684, 1.445394392033543], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 103.58823529411765, 84, 259, 88.0, 189.39999999999995, 259.0, 259.0, 0.1128316087796266, 0.09156549501549775, 0.04010811093338289], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cae6223b-26ea-4084-b1a2-6193fb616c52", 3, 0, 0.0, 353.6666666666667, 295, 421, 345.0, 421.0, 421.0, 421.0, 0.023336496725111625, 0.027993160947928496, 0.014965136246246713], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 308.25, 169, 987, 178.0, 840.9000000000005, 987.0, 987.0, 0.05578800557880056, 5.64107627992794, 0.12427904172477917], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/82827f28-8aeb-4d83-8145-991acda2b527", 3, 0, 0.0, 472.33333333333337, 184, 890, 343.0, 890.0, 890.0, 890.0, 0.05669898508816692, 0.026319255447827483, 0.036359700723857045], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=19acef1e-d433-41b6-af7a-b231fe6f8305", 1, 0, 0.0, 445.0, 445, 445, 445.0, 445.0, 445.0, 445.0, 2.247191011235955, 0.4059866573033708, 1.5493328651685394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 281.1333333333333, 168, 500, 330.0, 413.00000000000006, 500.0, 500.0, 0.0905474498819865, 0.140330862268274, 0.20364333699044423], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8c794c2a-3e05-47bd-9a76-ee717868dcf2", 1, 0, 0.0, 180.0, 180, 180, 180.0, 180.0, 180.0, 180.0, 5.555555555555555, 1.0036892361111112, 3.830295138888889], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 99.23529411764706, 84, 249, 88.0, 130.5999999999999, 249.0, 249.0, 0.0888596174854819, 0.07367364770036537, 0.0315868171530424], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 86.5625, 83, 91, 86.0, 90.3, 91.0, 91.0, 0.07676990619677088, 0.05960163615862582, 0.027289302593383396], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8c6bdb34-5aad-4c20-b8a1-7de254e5ad34", 1, 0, 0.0, 576.0, 576, 576, 576.0, 576.0, 576.0, 576.0, 1.736111111111111, 0.31365288628472227, 1.196967230902778], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 106.0, 82, 254, 85.0, 250.8, 254.0, 254.0, 0.09421779829632053, 0.07001928174169914, 0.047292918285457765], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 123.23529411764704, 82, 254, 85.0, 251.6, 254.0, 254.0, 0.09413849433784643, 0.03350655508486308, 0.05322329166320569], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 174.11764705882354, 82, 774, 86.0, 355.5999999999996, 774.0, 774.0, 0.09422406482615661, 5.011136496375145, 0.05491712785651338], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 185.76470588235293, 81, 659, 85.0, 332.5999999999997, 659.0, 659.0, 0.09413849433784643, 1.6521067814325663, 0.05495918646343827], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 29.62962962962963, 0.5856515373352855], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 3.7037037037037037, 0.07320644216691069], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 3.7037037037037037, 0.07320644216691069], "isController": false}, {"data": ["401/Unauthorized", 17, 62.96296296296296, 1.2445095168374818], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1366, 27, "401/Unauthorized", 17, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 15, "401/Unauthorized", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
