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

    var data = {"OkPercent": 98.66457187745483, "KoPercent": 1.335428122545169};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7757923128792987, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/916bcd5f-1e80-45f7-9375-5aff9c451dcd"], "isController": false}, {"data": [0.06363636363636363, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=04a2be01-0432-48da-b114-5dabf37e2195"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/45964a8e-1833-49ef-bc4a-5cf82e2e1402"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2a653b82-a311-4d48-b887-690c06aa4a4c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2288b07a-1a02-4257-8eb5-b065b3551719"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/e268bcd8-300b-460e-bf14-bfddfbcb54be"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a4da329b-7e0b-4f77-853f-94515b274119"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.675, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2a653b82-a311-4d48-b887-690c06aa4a4c"], "isController": false}, {"data": [0.6470588235294118, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/faaa1bd2-6286-41ce-8688-60beecf79d38"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/ea965061-60e5-49a7-a811-dfb093f09415"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/15e419b2-972c-4a2e-90c0-57b0af3e0eb6"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f0338494-41e5-4e0a-b6a2-a7f46d861df8"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8e82427c-8050-4006-80cb-aee094533d52"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1f42ae7f-76c0-4d3b-8298-d87cb34ee22c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.225, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/04a2be01-0432-48da-b114-5dabf37e2195"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a4da329b-7e0b-4f77-853f-94515b274119"], "isController": false}, {"data": [0.3275862068965517, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e268bcd8-300b-460e-bf14-bfddfbcb54be"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2288b07a-1a02-4257-8eb5-b065b3551719"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=916bcd5f-1e80-45f7-9375-5aff9c451dcd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4909090909090909, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9532163742690059, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ea965061-60e5-49a7-a811-dfb093f09415"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e001b51d-1ee5-4fdf-b4d1-304cf0086b8f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0b04b41b-7725-4e92-a27b-d0782410927d"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/24249af4-16a0-4cfb-be7b-6de83f16ba9d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bd4b73f3-48ce-45c7-beb9-49345ae0d816"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=45964a8e-1833-49ef-bc4a-5cf82e2e1402"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8e82427c-8050-4006-80cb-aee094533d52"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/1f42ae7f-76c0-4d3b-8298-d87cb34ee22c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f0338494-41e5-4e0a-b6a2-a7f46d861df8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1273, 17, 1.335428122545169, 388.4336213668501, 101, 2822, 123.0, 1086.0000000000007, 1324.8999999999999, 1819.7399999999996, 5.120819974818277, 715.5776420632822, 3.7350678367854284], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/916bcd5f-1e80-45f7-9375-5aff9c451dcd", 3, 0, 0.0, 439.0, 230, 769, 318.0, 769.0, 769.0, 769.0, 0.017815467388786945, 0.024560060023278877, 0.011424632407522879], "isController": false}, {"data": ["see books", 55, 0, 0.0, 1785.1090909090908, 1255, 2623, 1736.0, 2285.6, 2329.7999999999997, 2623.0, 0.25254148567860196, 303.8929180336431, 1.2417445121013289], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=04a2be01-0432-48da-b114-5dabf37e2195", 1, 0, 0.0, 1141.0, 1141, 1141, 1141.0, 1141.0, 1141.0, 1141.0, 0.8764241893076249, 0.15833835451358458, 0.6042533961437335], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/45964a8e-1833-49ef-bc4a-5cf82e2e1402", 3, 0, 0.0, 326.0, 211, 503, 264.0, 503.0, 503.0, 503.0, 0.015940573541836037, 0.021975367496639194, 0.01022230790280501], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 660.4285714285714, 114, 1972, 488.5, 1559.0, 1972.0, 1972.0, 0.0736078907658901, 0.014499768660914736, 0.04952718431415848], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 660.4285714285714, 114, 1972, 488.5, 1559.0, 1972.0, 1972.0, 0.07472923995025169, 0.014720659432164534, 0.050281685864964266], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 124.25000000000004, 105, 347, 109.0, 188.10000000000016, 347.0, 347.0, 0.10172551911803976, 0.04631789383670511, 0.056947415853922156], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 111.31249999999999, 106, 117, 112.0, 116.3, 117.0, 117.0, 0.10172357888981429, 0.07559730813979364, 0.05106046830992632], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 262.875, 101, 845, 112.5, 828.2, 845.0, 845.0, 0.1017300466050776, 3.762993430464334, 0.05881268319356049], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 284.18749999999994, 105, 1305, 109.5, 1286.8, 1305.0, 1305.0, 0.10172616587722924, 11.465663942047875, 0.05871109768890867], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 321.6, 107, 1544, 230.0, 880.4000000000003, 1544.0, 1544.0, 0.07836785872887334, 0.16807762826206213, 0.05065339202215198], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2a653b82-a311-4d48-b887-690c06aa4a4c", 1, 0, 0.0, 426.0, 426, 426, 426.0, 426.0, 426.0, 426.0, 2.347417840375587, 0.42409404342723006, 1.6184345657276995], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2288b07a-1a02-4257-8eb5-b065b3551719", 3, 0, 0.0, 383.33333333333337, 246, 640, 264.0, 640.0, 640.0, 640.0, 0.022749850230152652, 0.0268895527948191, 0.014588933904101799], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 123.05000000000001, 107, 346, 110.0, 117.80000000000001, 334.59999999999985, 346.0, 0.13504480111276915, 0.10036044301447006, 0.06778615993355797], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 141.40000000000003, 102, 343, 110.0, 332.1000000000001, 342.6, 343.0, 0.13503933020492218, 0.04627470797744843, 0.07644755832011074], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 766.3333333333334, 622, 848, 829.0, 848.0, 848.0, 848.0, 0.0283403869407497, 8.333014749990554, 0.016162876927146314], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 1194.6666666666667, 1158, 1223, 1203.0, 1223.0, 1223.0, 1223.0, 0.02823529411764706, 25.406167279411765, 0.016075367647058823], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 256.0, 117, 326, 325.0, 326.0, 326.0, 326.0, 0.02847596628445592, 0.05038911221429113, 0.015767453987584477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 125.74999999999999, 105, 334, 113.0, 184.20000000000016, 334.0, 334.0, 0.07882821853152883, 0.05858229912352874, 0.0395680706300838], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 148.0, 104, 332, 107.0, 331.3, 332.0, 332.0, 0.07874209503186595, 0.03585302910996826, 0.04408096286818081], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 300.25, 104, 1223, 113.0, 1197.8, 1223.0, 1223.0, 0.078412153883852, 8.837916947439352, 0.045255452095074734], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e268bcd8-300b-460e-bf14-bfddfbcb54be", 3, 0, 0.0, 814.6666666666666, 242, 1162, 1040.0, 1162.0, 1162.0, 1162.0, 0.01597912061572878, 0.0220285077498735, 0.010247027217768783], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 217.62500000000003, 102, 906, 112.0, 714.2000000000002, 906.0, 906.0, 0.07862601046708764, 2.9083753593454382, 0.04545566230128504], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 109.0, 105, 111, 111.0, 111.0, 111.0, 111.0, 0.028533655446599266, 0.021205187299669963, 0.016022316290815016], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 744.8823529411765, 101, 1468, 952.0, 1413.6, 1468.0, 1468.0, 0.08023712430146503, 42.47802586880286, 0.043114548524580874], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 163.09999999999997, 104, 751, 112.0, 320.6, 729.4999999999998, 751.0, 0.13504844863094637, 6.110421361710388, 0.07881343056821635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 550.5882352941178, 102, 983, 666.0, 927.0, 983.0, 983.0, 0.08023560950744775, 13.886512630028884, 0.04319208965385414], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 202.4, 104, 894, 110.0, 339.3, 866.2999999999996, 894.0, 0.13504480111276915, 2.019961626175734, 0.07894318158799182], "isController": false}, {"data": ["deleteBooks", 13, 2, 15.384615384615385, 516.0769230769231, 110, 1163, 426.0, 1154.2, 1163.0, 1163.0, 0.07273012089983943, 0.014418178264323638, 0.04934633803841269], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a4da329b-7e0b-4f77-853f-94515b274119", 1, 0, 0.0, 252.0, 252, 252, 252.0, 252.0, 252.0, 252.0, 3.968253968253968, 0.7169208829365079, 2.7359250992063493], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 427.81250000000006, 213, 1331, 228.5, 1310.7, 1331.0, 1331.0, 0.07836990595611286, 11.82598245554957, 0.1737492958953762], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 703.8999999999999, 127, 2351, 435.5, 1903.2000000000005, 2329.8499999999995, 2351.0, 0.09291823659770584, 0.057075752753864235, 0.04201283549290802], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 109.82352941176471, 102, 121, 110.0, 116.19999999999999, 121.0, 121.0, 0.08023788171992259, 0.05962991014537216, 0.04027565547269552], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 196.7058823529412, 101, 346, 114.0, 332.4, 346.0, 346.0, 0.08023636689730688, 0.09235847425828558, 0.04179591998074327], "isController": false}, {"data": ["login", 20, 0, 0.0, 2815.75, 1521, 4728, 2617.0, 4589.000000000001, 4723.7, 4728.0, 0.09490367277213628, 17.16384359133292, 0.16679505848438833], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 147.60000000000002, 107, 336, 115.5, 330.80000000000007, 335.85, 336.0, 0.13371397244155028, 0.10825086245512225, 0.04753113864133232], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2a653b82-a311-4d48-b887-690c06aa4a4c", 3, 0, 0.0, 336.0, 212, 462, 334.0, 462.0, 462.0, 462.0, 0.04503895869927487, 0.02895571075230074, 0.028882405155459475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 882.4117647058822, 219, 1577, 1060.0, 1523.3999999999999, 1577.0, 1577.0, 0.08019548829617609, 56.487462120899416, 0.16829166951675142], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/faaa1bd2-6286-41ce-8688-60beecf79d38", 2, 0, 0.0, 222.5, 216, 229, 222.5, 229.0, 229.0, 229.0, 0.012944397341220786, 0.02558541036975671, 0.008046004792663115], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ea965061-60e5-49a7-a811-dfb093f09415", 3, 0, 0.0, 1017.0, 483, 1544, 1024.0, 1544.0, 1544.0, 1544.0, 0.021056769049357067, 0.024888388156971194, 0.013503201506260878], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 448.5625, 214, 1413, 226.0, 1397.6, 1413.0, 1413.0, 0.10165119662518027, 15.339118418085018, 0.22536487220538623], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 4, 57.142857142857146, 650.5714285714286, 107, 1334, 309.0, 1334.0, 1334.0, 1334.0, 0.05931147846569679, 30.419275224324483, 0.07977426951559469], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/15e419b2-972c-4a2e-90c0-57b0af3e0eb6", 2, 0, 0.0, 385.0, 206, 564, 385.0, 564.0, 564.0, 564.0, 0.0282657546249841, 0.032544262405133056, 0.0175694851746117], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f0338494-41e5-4e0a-b6a2-a7f46d861df8", 3, 0, 0.0, 387.3333333333333, 216, 569, 377.0, 569.0, 569.0, 569.0, 0.028567075493258168, 0.028650768097242322, 0.018319381094309438], "isController": false}, {"data": ["register", 22, 5, 22.727272727272727, 1189.590909090909, 132, 2024, 1171.0, 1943.8999999999999, 2023.1, 2024.0, 0.08711491248911063, 0.02754823493307991, 0.03930379840817296], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 116.92857142857143, 109, 144, 114.0, 138.0, 144.0, 144.0, 0.07063714706654019, 0.05484036320107369, 0.025109298371309208], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 349.25000000000006, 219, 1012, 226.0, 664.8000000000005, 995.8499999999998, 1012.0, 0.13493819830517623, 8.270321323693123, 0.3017529104482647], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 308.53333333333336, 216, 451, 229.0, 443.8, 451.0, 451.0, 0.10676308559552448, 0.16546193050790758, 0.24011268176415324], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8e82427c-8050-4006-80cb-aee094533d52", 1, 0, 0.0, 214.0, 214, 214, 214.0, 214.0, 214.0, 214.0, 4.672897196261682, 0.8442245911214954, 3.2217435747663554], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 13, 0, 0.0, 128.0769230769231, 105, 342, 110.0, 251.5999999999999, 342.0, 342.0, 0.0589098950497562, 0.04377971692662546, 0.029570005913647158], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 13, 0, 0.0, 124.76923076923077, 102, 326, 106.0, 241.19999999999993, 326.0, 326.0, 0.058908560320100056, 0.01576264211690177, 0.03359628830755706], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 13, 0, 0.0, 125.23076923076924, 102, 310, 111.0, 232.39999999999992, 310.0, 310.0, 0.058908560320100056, 0.015877697898776966, 0.03463179034443382], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1f42ae7f-76c0-4d3b-8298-d87cb34ee22c", 1, 0, 0.0, 475.0, 475, 475, 475.0, 475.0, 475.0, 475.0, 2.1052631578947367, 0.38034539473684215, 1.451480263157895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 13, 0, 0.0, 143.23076923076923, 106, 335, 111.0, 332.2, 335.0, 335.0, 0.058848826418596234, 0.015861597745637265, 0.03465414290079446], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 113.0, 110, 116, 113.0, 116.0, 116.0, 116.0, 0.042047724166929465, 0.012400793650793652, 0.025992391989908548], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1239.7636363636366, 822, 2119, 1120.0, 1801.6, 1873.5999999999997, 2119.0, 0.24944894460419254, 298.4276602312619, 0.49256422459929433], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, 22.727272727272727, 1189.590909090909, 132, 2024, 1171.0, 1943.8999999999999, 2023.1, 2024.0, 0.09091622896012497, 0.02875032027307929, 0.04101884548786888], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 2, 0, 0.0, 311.0, 306, 316, 311.0, 316.0, 316.0, 316.0, 0.030388209374762592, 0.00819057205804148, 0.01789461938767758], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 2, 0, 0.0, 213.5, 111, 316, 213.5, 316.0, 316.0, 316.0, 0.03047851264858275, 0.008214911612313318, 0.017918031850045715], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 194.21428571428572, 102, 1107, 108.5, 713.5, 1107.0, 1107.0, 0.06745850097573904, 4.3525461443250535, 0.03924413351964729], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 209.50000000000003, 105, 620, 111.5, 486.0, 620.0, 620.0, 0.06745590070491415, 1.433616693287656, 0.039308495709322884], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 110.42857142857142, 103, 117, 110.5, 116.5, 117.0, 117.0, 0.06745720081526846, 0.05013176740275322, 0.03386035275297655], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 2, 0, 0.0, 215.5, 104, 327, 215.5, 327.0, 327.0, 327.0, 0.03037851631326326, 0.008128626435384896, 0.017325247584907954], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 153.85714285714286, 102, 323, 111.0, 321.5, 323.0, 323.0, 0.06745622572780449, 0.025286673902149927, 0.03806646666698789], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 2, 0, 0.0, 366.5, 333, 400, 366.5, 400.0, 400.0, 400.0, 0.030344409042633896, 0.02255087429828554, 0.015231470945228342], "isController": false}, {"data": ["deleteAccount", 13, 2, 15.384615384615385, 551.076923076923, 109, 1040, 503.0, 951.9999999999999, 1040.0, 1040.0, 0.07199902524396594, 0.013970363747383113, 0.04899633185735332], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 2, 0, 0.0, 111.0, 108, 114, 111.0, 114.0, 114.0, 114.0, 0.030371596482969127, 0.02390576832546203, 0.010796153437305432], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1455.1, 920, 2000, 1513.5, 1931.6000000000004, 1997.35, 2000.0, 0.09350382196872298, 0.04839553285490544, 0.04300810561256691], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/04a2be01-0432-48da-b114-5dabf37e2195", 3, 0, 0.0, 573.3333333333334, 438, 820, 462.0, 820.0, 820.0, 820.0, 0.03787161522438932, 0.030783015369563845, 0.02428615950261945], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 2, 0, 0.0, 688.5, 660, 717, 688.5, 717.0, 717.0, 717.0, 0.03019460422422513, 0.046795739163911415, 0.06790837258631884], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a4da329b-7e0b-4f77-853f-94515b274119", 3, 0, 0.0, 784.3333333333334, 239, 1693, 421.0, 1693.0, 1693.0, 1693.0, 0.0822954956932024, 0.037236568689307074, 0.05277412972513305], "isController": false}, {"data": ["addBook", 58, 4, 6.896551724137931, 1216.1551724137933, 559, 4267, 938.0, 2083.8, 2200.6499999999974, 4267.0, 0.280890714140426, 93.75850352747887, 1.0209151588969714], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e268bcd8-300b-460e-bf14-bfddfbcb54be", 1, 0, 0.0, 411.0, 411, 411, 411.0, 411.0, 411.0, 411.0, 2.4330900243309004, 0.43957192822384433, 1.6775015206812653], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2288b07a-1a02-4257-8eb5-b065b3551719", 1, 0, 0.0, 426.0, 426, 426, 426.0, 426.0, 426.0, 426.0, 2.347417840375587, 0.42409404342723006, 1.6184345657276995], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=916bcd5f-1e80-45f7-9375-5aff9c451dcd", 1, 0, 0.0, 441.0, 441, 441, 441.0, 441.0, 441.0, 441.0, 2.2675736961451247, 0.4096690759637188, 1.5633857709750567], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 208.41818181818184, 104, 500, 115.0, 453.0, 477.9999999999999, 500.0, 0.2505283871437942, 0.18618369396135487, 0.1211050308947052], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 701.0545454545452, 501, 1110, 652.0, 920.8, 1002.0, 1110.0, 0.25015122778770804, 73.5527667720713, 0.12580847881901333], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 167.10909090909095, 101, 352, 114.0, 334.0, 336.0, 352.0, 0.2507545432164057, 0.44371800030090547, 0.12194898683766607], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1029.9636363636362, 705, 1677, 975.0, 1328.4, 1432.3999999999999, 1677.0, 0.2500522836593106, 224.99748438167754, 0.12551452519617737], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 143.06666666666663, 108, 342, 115.0, 331.8, 342.0, 342.0, 0.10830794113824425, 0.08091364743237975, 0.03850008845148526], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 4, 2.3391812865497075, 205.59064327485373, 105, 2822, 117.0, 342.6, 436.80000000000007, 1878.0800000000015, 0.7230046551352357, 1.5350966437362852, 0.3484877152630088], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 13, 0, 0.0, 117.23076923076923, 105, 156, 114.0, 145.2, 156.0, 156.0, 0.061482290735564674, 0.047612750540334745, 0.021855033034907753], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 115.5, 106, 133, 115.0, 126.0, 133.0, 133.0, 0.09520182787509521, 0.07725851461348059, 0.033841274752475246], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ea965061-60e5-49a7-a811-dfb093f09415", 1, 0, 0.0, 734.0, 734, 734, 734.0, 734.0, 734.0, 734.0, 1.3623978201634876, 0.24613632493188012, 0.9393094346049047], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 13, 0, 0.0, 289.46153846153845, 212, 671, 224.0, 583.3999999999999, 671.0, 671.0, 0.05882033554739109, 0.09116003175166959, 0.13228831324769696], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e001b51d-1ee5-4fdf-b4d1-304cf0086b8f", 1, 0, 0.0, 241.0, 241, 241, 241.0, 241.0, 241.0, 241.0, 4.149377593360996, 1.3250453838174274, 2.4758493257261414], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0b04b41b-7725-4e92-a27b-d0782410927d", 1, 0, 0.0, 231.0, 231, 231, 231.0, 231.0, 231.0, 231.0, 4.329004329004329, 1.3824066558441557, 2.58302895021645], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 386.64285714285717, 213, 1221, 324.0, 843.0, 1221.0, 1221.0, 0.06742081665872064, 5.858363875866237, 0.15039883626854675], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/24249af4-16a0-4cfb-be7b-6de83f16ba9d", 1, 0, 0.0, 393.0, 393, 393, 393.0, 393.0, 393.0, 393.0, 2.544529262086514, 0.8125596374045801, 1.5182689249363868], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bd4b73f3-48ce-45c7-beb9-49345ae0d816", 1, 0, 0.0, 203.0, 203, 203, 203.0, 203.0, 203.0, 203.0, 4.926108374384237, 1.573083435960591, 2.939308805418719], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=45964a8e-1833-49ef-bc4a-5cf82e2e1402", 1, 0, 0.0, 1163.0, 1163, 1163, 1163.0, 1163.0, 1163.0, 1163.0, 0.8598452278589854, 0.15534313198624247, 0.5928229793637145], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 115.75, 109, 124, 115.5, 122.6, 124.0, 124.0, 0.07943639875086263, 0.06586084232371325, 0.028237157368470697], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8e82427c-8050-4006-80cb-aee094533d52", 3, 0, 0.0, 353.6666666666667, 215, 453, 393.0, 453.0, 453.0, 453.0, 0.08362835558776796, 0.03783965308170491, 0.053628860842416304], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1f42ae7f-76c0-4d3b-8298-d87cb34ee22c", 3, 0, 0.0, 680.6666666666666, 246, 1210, 586.0, 1210.0, 1210.0, 1210.0, 0.05753739930955121, 0.036991003787878785, 0.036897355677023395], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f0338494-41e5-4e0a-b6a2-a7f46d861df8", 1, 0, 0.0, 800.0, 800, 800, 800.0, 800.0, 800.0, 800.0, 1.25, 0.225830078125, 0.86181640625], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 117.94117647058823, 108, 168, 114.0, 131.99999999999997, 168.0, 168.0, 0.08242903829556145, 0.06399520062985482, 0.029300947206625357], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 110.13333333333333, 104, 117, 111.0, 115.8, 117.0, 117.0, 0.10701673028216745, 0.07953098803196233, 0.053717382192416084], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 122.73333333333333, 103, 315, 109.0, 196.20000000000007, 315.0, 315.0, 0.10702207508668787, 0.028636766185305158, 0.06103602719787669], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 196.33333333333334, 105, 341, 114.0, 335.6, 341.0, 341.0, 0.10684826122262904, 0.028798945407661734, 0.06281509107033464], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 179.33333333333334, 105, 334, 112.0, 329.2, 334.0, 334.0, 0.10686272414456388, 0.02880284361708949, 0.06292795181559768], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 29.41176470588235, 0.3927729772191673], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 11.764705882352942, 0.15710919088766692], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 11.764705882352942, 0.15710919088766692], "isController": false}, {"data": ["401/Unauthorized", 8, 47.05882352941177, 0.6284367635506677], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1273, 17, "401/Unauthorized", 8, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
