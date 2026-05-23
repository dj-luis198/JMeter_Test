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

    var data = {"OkPercent": 98.93858984078848, "KoPercent": 1.061410159211524};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.782084690553746, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.11016949152542373, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7d8a698e-3cd9-4854-96b8-4904623d31cc"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/54e1357d-15a5-4d3a-8470-e64cb78f7bac"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bf8c0903-d727-4da3-bb48-7d4b17faf4f8"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e62dc4cc-7347-4142-a4e9-914789e11e32"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=92658290-e764-4623-b1ac-55f8d1f38665"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/0e210db7-b4c4-4715-89d9-adc0ae4236fc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=914f9592-8ba7-4b1b-9e60-c3e1550102f9"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3d280a62-97fe-4717-b9b7-e85b7ada7e50"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cd4edd4d-ddad-4122-a424-0db3eab9b1ed"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3d280a62-97fe-4717-b9b7-e85b7ada7e50"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2ebc477c-1538-4a63-9b92-669b1edc95f9"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2431d180-9fdb-4605-bfc2-e5583d6b8f83"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/914f9592-8ba7-4b1b-9e60-c3e1550102f9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5c6d8d06-bd74-4698-bc0c-659c90fdcbf9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8020cb45-71c7-42e0-b5c1-8f1079a82a9a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=35fb6e62-5206-43a9-9b98-6cf85de484cf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b1725691-7836-4cb3-be23-dd82e1fde061"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=54e1357d-15a5-4d3a-8470-e64cb78f7bac"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.2708333333333333, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dce28a69-145b-4a00-a88b-53933542258b"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.3983050847457627, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2708333333333333, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.23809523809523808, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.30357142857142855, 500, 1500, "addBook"], "isController": true}, {"data": [0.9915254237288136, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5084745762711864, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4830508474576271, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cd4edd4d-ddad-4122-a424-0db3eab9b1ed"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/e62dc4cc-7347-4142-a4e9-914789e11e32"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/92658290-e764-4623-b1ac-55f8d1f38665"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bf8c0903-d727-4da3-bb48-7d4b17faf4f8"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0e210db7-b4c4-4715-89d9-adc0ae4236fc"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2431d180-9fdb-4605-bfc2-e5583d6b8f83"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/2ebc477c-1538-4a63-9b92-669b1edc95f9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7d8a698e-3cd9-4854-96b8-4904623d31cc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b1725691-7836-4cb3-be23-dd82e1fde061"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8020cb45-71c7-42e0-b5c1-8f1079a82a9a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/35fb6e62-5206-43a9-9b98-6cf85de484cf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1319, 14, 1.061410159211524, 383.38514025777124, 98, 5091, 127.0, 1073.0, 1269.0, 1796.5999999999995, 5.28352373780263, 770.2175202175398, 3.861784337146096], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 59, 0, 0.0, 1700.949152542373, 1310, 2542, 1641.0, 2141.0, 2218.0, 2542.0, 0.25559603696178623, 307.56865826701556, 1.256763716897064], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7d8a698e-3cd9-4854-96b8-4904623d31cc", 1, 0, 0.0, 888.0, 888, 888, 888.0, 888.0, 888.0, 888.0, 1.1261261261261262, 0.20345052083333334, 0.7764111768018018], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/54e1357d-15a5-4d3a-8470-e64cb78f7bac", 3, 0, 0.0, 429.0, 259, 699, 329.0, 699.0, 699.0, 699.0, 0.03568454859046033, 0.029005311793743313, 0.022883646068752234], "isController": false}, {"data": ["deleteBook", 14, 0, 0.0, 618.5, 427, 1117, 581.0, 967.5, 1117.0, 1117.0, 0.08728451635026029, 0.015769175317185698, 0.05932619470681754], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 0, 0.0, 618.5, 427, 1117, 581.0, 967.5, 1117.0, 1117.0, 0.08745408660453262, 0.015799810568201695, 0.059441449489018264], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 166.75, 99, 309, 103.0, 308.3, 309.0, 309.0, 0.1146583539360063, 0.05220650148697553, 0.06418740370489806], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 130.87499999999997, 101, 310, 105.0, 307.9, 310.0, 310.0, 0.11448688409634071, 0.08508253788800321, 0.05746704924367103], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 230.62499999999997, 101, 810, 104.0, 805.1, 810.0, 810.0, 0.1146583539360063, 4.241211392382386, 0.06628686086925366], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 276.1875, 98, 1168, 104.0, 1050.4, 1168.0, 1168.0, 0.1146583539360063, 12.923264560715182, 0.06617488982048803], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bf8c0903-d727-4da3-bb48-7d4b17faf4f8", 1, 0, 0.0, 394.0, 394, 394, 394.0, 394.0, 394.0, 394.0, 2.5380710659898473, 0.45853822969543145, 1.7498810279187818], "isController": false}, {"data": ["goToProfile", 14, 0, 0.0, 247.78571428571428, 193, 384, 215.5, 353.5, 384.0, 384.0, 0.08682493612165414, 0.17766528328185854, 0.0561309645630225], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e62dc4cc-7347-4142-a4e9-914789e11e32", 1, 0, 0.0, 695.0, 695, 695, 695.0, 695.0, 695.0, 695.0, 1.4388489208633093, 0.2599482913669065, 0.9920188848920864], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=92658290-e764-4623-b1ac-55f8d1f38665", 1, 0, 0.0, 592.0, 592, 592, 592.0, 592.0, 592.0, 592.0, 1.6891891891891893, 0.30517578125, 1.1646167652027029], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 128.3888888888889, 100, 306, 103.5, 305.1, 306.0, 306.0, 0.08234443763323787, 0.06119542679579495, 0.041333047796371356], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0e210db7-b4c4-4715-89d9-adc0ae4236fc", 3, 0, 0.0, 1320.0, 201, 3320, 439.0, 3320.0, 3320.0, 3320.0, 0.01613068001570053, 0.022237444617998613, 0.01034421862986004], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 113.88888888888886, 100, 309, 103.0, 126.3000000000003, 309.0, 309.0, 0.08235008852634518, 0.03577796814881576, 0.04619682700533903], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=914f9592-8ba7-4b1b-9e60-c3e1550102f9", 1, 0, 0.0, 274.0, 274, 274, 274.0, 274.0, 274.0, 274.0, 3.6496350364963503, 0.6593578923357664, 2.5162522810218975], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 599.4, 588, 608, 603.0, 608.0, 608.0, 608.0, 0.09054854307394193, 26.624278158333183, 0.051640965971857515], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1162.4, 1087, 1312, 1105.0, 1312.0, 1312.0, 1312.0, 0.08940865118108828, 80.45006149638789, 0.05090355824079538], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 306.8, 303, 311, 307.0, 311.0, 311.0, 311.0, 0.09105146228648432, 0.16111840787413045, 0.05041619054339513], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 104.5, 102, 111, 104.0, 108.5, 111.0, 111.0, 0.07653493546464905, 0.05687801356308392, 0.03841695002815392], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 117.14285714285714, 101, 296, 104.0, 201.5, 296.0, 296.0, 0.07653619068445222, 0.020479410397988194, 0.04364954624972666], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 103.14285714285715, 100, 107, 103.0, 106.0, 107.0, 107.0, 0.07653619068445222, 0.020628895145418765, 0.0449949089766018], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 131.21428571428572, 101, 303, 103.0, 302.5, 303.0, 303.0, 0.07653619068445222, 0.020628895145418765, 0.04506965135031708], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 183.6, 102, 310, 105.0, 310.0, 310.0, 310.0, 0.09103985724950384, 0.06765755016296135, 0.051121013592250686], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 232.66666666666669, 98, 1152, 103.0, 1017.0000000000002, 1152.0, 1152.0, 0.08234971177600879, 8.252886886380272, 0.047626298151706464], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 688.4999999999999, 100, 1209, 957.5, 1203.6, 1209.0, 1209.0, 0.09616720270977808, 48.08453005291867, 0.05194448080395781], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 202.27777777777777, 101, 812, 104.0, 781.4000000000001, 812.0, 812.0, 0.08235008852634518, 2.71013640949039, 0.04770693605058125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 464.0, 101, 882, 602.0, 819.0000000000001, 882.0, 882.0, 0.09626698042571398, 15.736914542999251, 0.05209238621777731], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3d280a62-97fe-4717-b9b7-e85b7ada7e50", 1, 0, 0.0, 752.0, 752, 752, 752.0, 752.0, 752.0, 752.0, 1.3297872340425532, 0.24024476396276595, 0.9168259640957447], "isController": false}, {"data": ["deleteBooks", 14, 0, 0.0, 542.8571428571429, 187, 904, 475.5, 896.0, 904.0, 904.0, 0.08749125087491251, 0.015806524816268375, 0.06032111632586742], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cd4edd4d-ddad-4122-a424-0db3eab9b1ed", 1, 0, 0.0, 187.0, 187, 187, 187.0, 187.0, 187.0, 187.0, 5.347593582887701, 0.9661179812834224, 3.6869151069518717], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3d280a62-97fe-4717-b9b7-e85b7ada7e50", 3, 0, 0.0, 420.0, 212, 740, 308.0, 740.0, 740.0, 740.0, 0.019910138906402437, 0.02353311014620679, 0.01276789506693125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 237.7857142857143, 205, 406, 210.0, 405.5, 406.0, 406.0, 0.07649102869506305, 0.11854615482330573, 0.17203011629368184], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2ebc477c-1538-4a63-9b92-669b1edc95f9", 1, 0, 0.0, 508.0, 508, 508, 508.0, 508.0, 508.0, 508.0, 1.968503937007874, 0.35563791830708663, 1.357191190944882], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 741.1428571428572, 141, 1658, 717.0, 1426.0, 1637.1999999999998, 1658.0, 0.09630686117595263, 0.05915724187468185, 0.0435449968012364], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 126.77777777777779, 102, 306, 104.0, 302.4, 306.0, 306.0, 0.09626543589524182, 0.07154101241824123, 0.0483207363771038], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 198.72222222222223, 101, 399, 104.0, 331.5000000000001, 399.0, 399.0, 0.09626852500574937, 0.10608758029062398, 0.05041144766468603], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2431d180-9fdb-4605-bfc2-e5583d6b8f83", 1, 0, 0.0, 443.0, 443, 443, 443.0, 443.0, 443.0, 443.0, 2.257336343115124, 0.40781955417607224, 1.5563275959367946], "isController": false}, {"data": ["login", 21, 0, 0.0, 3438.2380952380954, 1671, 8270, 3143.0, 5053.400000000001, 7958.499999999995, 8270.0, 0.09857488875119698, 28.214086872347867, 0.18764709221680842], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/914f9592-8ba7-4b1b-9e60-c3e1550102f9", 3, 0, 0.0, 296.3333333333333, 212, 391, 286.0, 391.0, 391.0, 391.0, 0.08153060115229917, 0.03689047382867703, 0.05228362118165018], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5c6d8d06-bd74-4698-bc0c-659c90fdcbf9", 1, 0, 0.0, 401.0, 401, 401, 401.0, 401.0, 401.0, 401.0, 2.493765586034913, 0.7963489713216957, 1.487979270573566], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 136.88888888888889, 104, 308, 109.5, 308.0, 308.0, 308.0, 0.08259987701796088, 0.06687040824989215, 0.02936167503372828], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8020cb45-71c7-42e0-b5c1-8f1079a82a9a", 3, 0, 0.0, 387.0, 208, 520, 433.0, 520.0, 520.0, 520.0, 0.03321817698644698, 0.02769262736402693, 0.021302021049251486], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=35fb6e62-5206-43a9-9b98-6cf85de484cf", 1, 0, 0.0, 209.0, 209, 209, 209.0, 209.0, 209.0, 209.0, 4.784688995215311, 0.8644213516746412, 3.2988187799043063], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b1725691-7836-4cb3-be23-dd82e1fde061", 1, 0, 0.0, 442.0, 442, 442, 442.0, 442.0, 442.0, 442.0, 2.2624434389140275, 0.40874222285067874, 1.5598486990950227], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 828.1666666666665, 207, 1312, 1063.0, 1309.3, 1312.0, 1312.0, 0.09611225911865058, 63.946022287364976, 0.20249693308450936], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=54e1357d-15a5-4d3a-8470-e64cb78f7bac", 1, 0, 0.0, 904.0, 904, 904, 904.0, 904.0, 904.0, 904.0, 1.1061946902654867, 0.19984962665929204, 0.7626693860619469], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 460.25, 206, 1476, 409.5, 1215.6000000000004, 1476.0, 1476.0, 0.11440256833765919, 17.263294494555154, 0.25363518629743237], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 0, 0.0, 1347.0, 1207, 1416, 1398.0, 1416.0, 1416.0, 1416.0, 0.08891418003343174, 106.3722708903866, 0.20049105634491587], "isController": false}, {"data": ["register", 24, 7, 29.166666666666668, 1241.4583333333337, 274, 5091, 1083.0, 2179.0, 4474.75, 5091.0, 0.09933857068353215, 0.0311888188230035, 0.04481876919510923], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/dce28a69-145b-4a00-a88b-53933542258b", 1, 0, 0.0, 217.0, 217, 217, 217.0, 217.0, 217.0, 217.0, 4.608294930875576, 1.4715941820276497, 2.749675979262673], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 374.3333333333333, 206, 1457, 211.5, 1322.9000000000003, 1457.0, 1457.0, 0.0823045267489712, 11.053919467306814, 0.18276498914037495], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 127.42857142857143, 104, 242, 110.0, 220.0, 242.0, 242.0, 0.0892180041932462, 0.06926593098987376, 0.03171421242806798], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 349.06666666666666, 205, 1004, 223.0, 711.8000000000002, 1004.0, 1004.0, 0.06733674206885405, 5.467945115504959, 0.15029332866839348], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 106.5, 101, 131, 102.5, 131.0, 131.0, 131.0, 0.048871078095982796, 0.03631922893656534, 0.024530990372397615], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 102.37500000000001, 99, 105, 103.0, 105.0, 105.0, 105.0, 0.04887227231630135, 0.013077150990885321, 0.02787246780539061], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 102.0, 100, 104, 103.0, 104.0, 104.0, 104.0, 0.04887346659498558, 0.01317292654317971, 0.028732252822442697], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 103.0, 101, 104, 103.0, 104.0, 104.0, 104.0, 0.04887227231630135, 0.013172604647753097, 0.028779277545634484], "isController": false}, {"data": ["https://demoqa.com/books", 59, 0, 0.0, 1177.9322033898306, 790, 2100, 1105.0, 1721.0, 1738.0, 2100.0, 0.26173945833240914, 313.1313875241222, 0.5168331882305969], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, 29.166666666666668, 1241.4583333333337, 274, 5091, 1083.0, 2179.0, 4474.75, 5091.0, 0.10073325414580299, 0.031626700398316075, 0.04544801114781346], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 12, 0, 0.0, 119.91666666666666, 100, 307, 103.0, 247.00000000000023, 307.0, 307.0, 0.06688627660819692, 0.018027941742053074, 0.03938713358861596], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 12, 0, 0.0, 103.08333333333333, 99, 111, 103.0, 109.2, 111.0, 111.0, 0.06696391203174089, 0.018048866914805162, 0.03936745609678517], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 195.99999999999997, 100, 1213, 102.5, 758.0, 1213.0, 1213.0, 0.09267104427028172, 5.979305655995154, 0.05391158685924592], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 165.85714285714286, 101, 792, 102.5, 547.5, 792.0, 792.0, 0.09279450656521133, 1.9721292320923172, 0.05407403096022429], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 12, 0, 0.0, 143.08333333333334, 101, 376, 103.0, 355.30000000000007, 376.0, 376.0, 0.06688627660819692, 0.01789730448305269, 0.038146079628112305], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 132.78571428571428, 102, 314, 103.0, 310.5, 314.0, 314.0, 0.09279389151068455, 0.06896108539026459, 0.046578183824699075], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 12, 0, 0.0, 103.16666666666667, 100, 107, 103.0, 106.10000000000001, 107.0, 107.0, 0.06696054907650242, 0.04976267367892417, 0.033611056860666254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 131.64285714285717, 101, 304, 103.0, 304.0, 304.0, 304.0, 0.0926704308513103, 0.03473848321672304, 0.05229518593660019], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 12, 0, 0.0, 177.08333333333334, 104, 318, 116.0, 315.3, 318.0, 318.0, 0.06568432115254089, 0.051700744969675735, 0.023348723534692268], "isController": false}, {"data": ["deleteAccount", 14, 0, 0.0, 553.1428571428571, 391, 1414, 452.5, 1077.0, 1414.0, 1414.0, 0.08990438026984157, 0.016242490576094424, 0.06119468071101521], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1739.6666666666665, 967, 4809, 1524.0, 3387.4000000000015, 4703.0999999999985, 4809.0, 0.09852309193611951, 0.05099339719349935, 0.04531677373233622], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 12, 0, 0.0, 248.08333333333331, 206, 479, 208.5, 458.00000000000006, 479.0, 479.0, 0.06684566450160986, 0.10359772418364732, 0.15033746615938234], "isController": false}, {"data": ["addBook", 56, 7, 12.5, 1071.3749999999998, 522, 2373, 874.5, 1860.7000000000003, 1988.6, 2373.0, 0.25897031552758265, 89.56468311108901, 0.9392144860942189], "isController": true}, {"data": ["https://demoqa.com/books-0", 59, 0, 0.0, 176.45762711864407, 101, 545, 104.0, 414.0, 419.0, 545.0, 0.26269039488154444, 0.19522206103989778, 0.12698412643199658], "isController": false}, {"data": ["https://demoqa.com/books-3", 59, 0, 0.0, 659.6440677966101, 496, 921, 606.0, 845.0, 916.0, 921.0, 0.26252208077670935, 77.19020830181586, 0.1320301480468802], "isController": false}, {"data": ["https://demoqa.com/books-1", 59, 0, 0.0, 173.40677966101697, 101, 421, 107.0, 306.0, 308.0, 421.0, 0.263112125901382, 0.46558512903642985, 0.12795882685438303], "isController": false}, {"data": ["https://demoqa.com/books-2", 59, 0, 0.0, 999.440677966102, 687, 1637, 989.0, 1221.0, 1412.0, 1637.0, 0.2622781748995341, 235.99836281045512, 0.13165134951011773], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 133.46666666666667, 103, 315, 106.0, 310.8, 315.0, 315.0, 0.0700244151794259, 0.052313161730723444, 0.024891491333311547], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cd4edd4d-ddad-4122-a424-0db3eab9b1ed", 3, 0, 0.0, 312.3333333333333, 255, 393, 289.0, 393.0, 393.0, 393.0, 0.06829512600450749, 0.0316576365333394, 0.04379602806929679], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 7, 4.093567251461988, 166.80116959064338, 101, 903, 109.0, 288.8, 420.6000000000001, 658.9200000000004, 0.7057599920756773, 1.6269351005192083, 0.3354399404953527], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 105.75000000000001, 104, 108, 105.5, 108.0, 108.0, 108.0, 0.04842878849331986, 0.037503934839065084, 0.017214920909734793], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 108.875, 103, 120, 107.5, 117.2, 120.0, 120.0, 0.11463535210964872, 0.093029275003045, 0.04074928532022669], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e62dc4cc-7347-4142-a4e9-914789e11e32", 3, 0, 0.0, 1043.3333333333333, 214, 2498, 418.0, 2498.0, 2498.0, 2498.0, 0.04809465027173477, 0.0309202260047774, 0.030841946951600748], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 210.75, 205, 235, 206.5, 235.0, 235.0, 235.0, 0.048839750673072814, 0.07569207452945953, 0.10984174394539717], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/92658290-e764-4623-b1ac-55f8d1f38665", 3, 0, 0.0, 298.6666666666667, 207, 476, 213.0, 476.0, 476.0, 476.0, 0.027447894746472943, 0.027528308500613004, 0.017601677295101464], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bf8c0903-d727-4da3-bb48-7d4b17faf4f8", 3, 0, 0.0, 576.3333333333334, 238, 1042, 449.0, 1042.0, 1042.0, 1042.0, 0.027032628382457624, 0.027111825535921858, 0.017335376924948413], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0e210db7-b4c4-4715-89d9-adc0ae4236fc", 1, 0, 0.0, 883.0, 883, 883, 883.0, 883.0, 883.0, 883.0, 1.1325028312570782, 0.20460256228765572, 0.7808076160815401], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 359.0714285714285, 206, 1520, 208.0, 1069.5, 1520.0, 1520.0, 0.09260667958750339, 8.046826681224658, 0.20658214377848483], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2431d180-9fdb-4605-bfc2-e5583d6b8f83", 3, 0, 0.0, 370.6666666666667, 217, 458, 437.0, 458.0, 458.0, 458.0, 0.045414635623240183, 0.02825109657422265, 0.029123317766205453], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2ebc477c-1538-4a63-9b92-669b1edc95f9", 3, 0, 0.0, 1236.6666666666667, 306, 2905, 499.0, 2905.0, 2905.0, 2905.0, 0.03269719131126637, 0.027258303043018604, 0.020967925417706618], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 137.28571428571428, 103, 309, 109.0, 305.0, 309.0, 309.0, 0.07584129666948362, 0.06288013757069492, 0.02695921092548051], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 121.2777777777778, 103, 305, 107.0, 149.30000000000024, 305.0, 305.0, 0.09592786224758981, 0.07447524461604874, 0.034099357283322945], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7d8a698e-3cd9-4854-96b8-4904623d31cc", 3, 0, 0.0, 665.0, 197, 1414, 384.0, 1414.0, 1414.0, 1414.0, 0.029607990209624572, 0.02439382266294264, 0.018986894763333467], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b1725691-7836-4cb3-be23-dd82e1fde061", 3, 0, 0.0, 345.6666666666667, 214, 500, 323.0, 500.0, 500.0, 500.0, 0.01812458842080461, 0.024986208320998547, 0.011622864319331083], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8020cb45-71c7-42e0-b5c1-8f1079a82a9a", 1, 0, 0.0, 429.0, 429, 429, 429.0, 429.0, 429.0, 429.0, 2.331002331002331, 0.4211283508158508, 1.6071168414918415], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/35fb6e62-5206-43a9-9b98-6cf85de484cf", 3, 0, 0.0, 287.6666666666667, 193, 456, 214.0, 456.0, 456.0, 456.0, 0.07443614619259112, 0.033680417710840384, 0.047734117187306156], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 103.2, 99, 111, 103.0, 106.8, 111.0, 111.0, 0.0673681941281882, 0.05006562083159299, 0.033815675568250714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 156.2, 99, 307, 103.0, 305.8, 307.0, 307.0, 0.06737303551457278, 0.024773626600671037, 0.03804646549826851], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 230.99999999999997, 101, 901, 104.0, 609.4000000000002, 901.0, 901.0, 0.06737152250657996, 4.058349107158898, 0.039221103792567574], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 197.20000000000002, 100, 801, 103.0, 570.6000000000001, 801.0, 801.0, 0.06737121991313605, 1.3375731118092766, 0.03928671984127341], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 50.0, 0.530705079605762], "isController": false}, {"data": ["401/Unauthorized", 7, 50.0, 0.530705079605762], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1319, 14, "406/Not Acceptable", 7, "401/Unauthorized", 7, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
