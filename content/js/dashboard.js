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

    var data = {"OkPercent": 98.26283987915407, "KoPercent": 1.7371601208459215};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7653394255874674, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0ad16745-57ca-4ebb-a158-c4dac2b66c7f"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7083333333333334, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6eab8bea-7826-45f4-800b-8e8a26a86740"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6a72bf4a-a7d1-4b22-b1c4-e5b23c35334c"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6220d413-b635-402e-8398-c3a4a844fbf1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1d84756d-c79c-48ac-9153-a080cc6d9981"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5a9fe03b-e2ed-466a-8b3b-bbcad06e2b15"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4d5bbf04-9044-4ce8-ab49-077c5ff8c7e6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d0d51ad4-f3c7-44a6-aa9d-551137b9806c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=01ab55a6-faf8-486f-bf66-13971b1e78f7"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8214285714285714, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8409090909090909, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/755ede81-8a1b-49e1-aca9-db5802eca2bb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/8930f102-7ea9-47e8-9b53-7b086a7149f6"], "isController": false}, {"data": [0.6176470588235294, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/db9734ab-ef56-4fa2-a606-0738e94f243c"], "isController": false}, {"data": [0.35, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=66d55954-9a3e-4328-abe5-5dbdcab535fe"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4d5bbf04-9044-4ce8-ab49-077c5ff8c7e6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6220d413-b635-402e-8398-c3a4a844fbf1"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.34210526315789475, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6eab8bea-7826-45f4-800b-8e8a26a86740"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6a72bf4a-a7d1-4b22-b1c4-e5b23c35334c"], "isController": false}, {"data": [0.45454545454545453, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=755ede81-8a1b-49e1-aca9-db5802eca2bb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1d84756d-c79c-48ac-9153-a080cc6d9981"], "isController": false}, {"data": [0.2796610169491525, 500, 1500, "addBook"], "isController": true}, {"data": [0.9122807017543859, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9257142857142857, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/01ab55a6-faf8-486f-bf66-13971b1e78f7"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d0d51ad4-f3c7-44a6-aa9d-551137b9806c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/387b2e7f-b951-4847-8141-e6ee15def1e9"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.7941176470588235, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0ad16745-57ca-4ebb-a158-c4dac2b66c7f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8930f102-7ea9-47e8-9b53-7b086a7149f6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/66d55954-9a3e-4328-abe5-5dbdcab535fe"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1324, 23, 1.7371601208459215, 435.9720543806652, 137, 2396, 161.0, 1152.0, 1343.5, 1816.0, 5.314963790805594, 762.2357313080571, 3.8998129701775937], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 2127.982456140351, 1693, 2764, 2093.0, 2551.8, 2627.6, 2764.0, 0.2513903651334795, 302.50680228699076, 1.236084461374091], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/0ad16745-57ca-4ebb-a158-c4dac2b66c7f", 3, 0, 0.0, 559.0, 221, 1033, 423.0, 1033.0, 1033.0, 1033.0, 0.03998347349762098, 0.02570552088470099, 0.025640443616638454], "isController": false}, {"data": ["deleteBook", 12, 1, 8.333333333333334, 537.6666666666666, 140, 1106, 491.5, 1039.7000000000003, 1106.0, 1106.0, 0.10504845359922264, 0.01997869759614122, 0.07098122641881068], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, 8.333333333333334, 537.6666666666666, 140, 1106, 491.5, 1039.7000000000003, 1106.0, 1106.0, 0.10577440083209196, 0.020116762267626865, 0.0714717488695361], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6eab8bea-7826-45f4-800b-8e8a26a86740", 1, 0, 0.0, 426.0, 426, 426, 426.0, 426.0, 426.0, 426.0, 2.347417840375587, 0.42409404342723006, 1.6184345657276995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 180.05555555555554, 141, 449, 148.5, 437.3, 449.0, 449.0, 0.12570095742229237, 0.054612264921751155, 0.07051583657478858], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 164.38888888888889, 143, 430, 147.5, 187.90000000000038, 430.0, 430.0, 0.12569744624688375, 0.09341382479870951, 0.06309422594814282], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6a72bf4a-a7d1-4b22-b1c4-e5b23c35334c", 3, 0, 0.0, 371.3333333333333, 229, 453, 432.0, 453.0, 453.0, 453.0, 0.03236490349864607, 0.026981288365896024, 0.0207548372045354], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 314.5555555555556, 141, 1078, 150.5, 1051.0, 1078.0, 1078.0, 0.125703590932581, 4.136897539352208, 0.07282242534603406], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 324.16666666666663, 142, 1295, 153.0, 1033.1000000000004, 1295.0, 1295.0, 0.12570622455321911, 12.597970651961367, 0.07270119106647764], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6220d413-b635-402e-8398-c3a4a844fbf1", 1, 0, 0.0, 441.0, 441, 441, 441.0, 441.0, 441.0, 441.0, 2.2675736961451247, 0.4096690759637188, 1.5633857709750567], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1d84756d-c79c-48ac-9153-a080cc6d9981", 1, 0, 0.0, 451.0, 451, 451, 451.0, 451.0, 451.0, 451.0, 2.2172949002217295, 0.4005855044345898, 1.5287208980044344], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5a9fe03b-e2ed-466a-8b3b-bbcad06e2b15", 1, 0, 0.0, 240.0, 240, 240, 240.0, 240.0, 240.0, 240.0, 4.166666666666667, 1.33056640625, 2.4861653645833335], "isController": false}, {"data": ["goToProfile", 12, 1, 8.333333333333334, 264.75, 138, 392, 256.0, 383.00000000000006, 392.0, 392.0, 0.10500249380922798, 0.20587769232956782, 0.0678739264588784], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 149.625, 143, 164, 150.0, 157.70000000000002, 164.0, 164.0, 0.08651080303652918, 0.06429171983476437, 0.04342436793044531], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4d5bbf04-9044-4ce8-ab49-077c5ff8c7e6", 3, 0, 0.0, 471.66666666666663, 217, 836, 362.0, 836.0, 836.0, 836.0, 0.025660106232839805, 0.02573528232531883, 0.016455211353741672], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 165.25, 140, 445, 146.0, 243.4000000000002, 445.0, 445.0, 0.08650846431255509, 0.023147772677382904, 0.04933685855325407], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 888.625, 688, 1136, 891.5, 1136.0, 1136.0, 1136.0, 0.05018946523124796, 14.757369225074658, 0.028623679389696104], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 1168.5, 997, 1341, 1158.5, 1341.0, 1341.0, 1341.0, 0.05009173048144414, 45.07262713907343, 0.02851902233465033], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 294.125, 147, 445, 289.5, 445.0, 445.0, 445.0, 0.050463952967595836, 0.08929754177469107, 0.027942442707643397], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 150.21428571428572, 142, 157, 150.5, 157.0, 157.0, 157.0, 0.0644789867587795, 0.047918465745538284, 0.032365428900403], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 222.7857142857143, 142, 594, 149.5, 523.5, 594.0, 594.0, 0.06447987767246065, 0.017253404767826382, 0.036773680235075205], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 267.5, 143, 602, 151.0, 533.5, 602.0, 602.0, 0.06448136258330761, 0.01737974225878213, 0.03790798854995233], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d0d51ad4-f3c7-44a6-aa9d-551137b9806c", 1, 0, 0.0, 1995.0, 1995, 1995, 1995.0, 1995.0, 1995.0, 1995.0, 0.5012531328320802, 0.09055842731829573, 0.34559053884711777], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 189.07142857142858, 143, 446, 149.0, 437.0, 446.0, 446.0, 0.06448017464915876, 0.01737942207340607, 0.03797025909515892], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 187.87500000000003, 140, 451, 150.0, 451.0, 451.0, 451.0, 0.050463316322990455, 0.03750252316581615, 0.02833633484933546], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 751.7647058823529, 144, 1420, 963.0, 1392.8, 1420.0, 1420.0, 0.08907612340710933, 42.44410248109752, 0.048314381733106974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 189.125, 143, 476, 151.0, 455.0, 476.0, 476.0, 0.08650986753176534, 0.02331711273317113, 0.05085834009191674], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 601.5882352941177, 144, 1150, 744.0, 1072.3999999999999, 1150.0, 1150.0, 0.08921027912322038, 13.898200986167158, 0.04847426644224159], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 165.6875, 140, 427, 149.0, 238.7000000000002, 427.0, 427.0, 0.0865093997869706, 0.02331698666133192, 0.05094254694486648], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=01ab55a6-faf8-486f-bf66-13971b1e78f7", 1, 0, 0.0, 930.0, 930, 930, 930.0, 930.0, 930.0, 930.0, 1.075268817204301, 0.1942624327956989, 0.7413474462365591], "isController": false}, {"data": ["deleteBooks", 12, 1, 8.333333333333334, 668.8333333333334, 143, 1995, 446.0, 1827.9000000000005, 1995.0, 1995.0, 0.10583223826364575, 0.020127762111176766, 0.07233764397594081], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 430.7142857142857, 290, 750, 309.0, 744.5, 750.0, 750.0, 0.06443447244275687, 0.09986084742837417, 0.1449146387067081], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 500.8181818181818, 153, 1280, 428.0, 1114.5, 1258.5499999999997, 1280.0, 0.10487177042616073, 0.06441830429497569, 0.047417607136047285], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 149.35294117647058, 139, 157, 150.0, 153.0, 157.0, 157.0, 0.08921261991225676, 0.06629961304026112, 0.04478055335439451], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 234.17647058823528, 144, 474, 149.0, 453.2, 474.0, 474.0, 0.0892140244446427, 0.09481040051849092, 0.04691321115385221], "isController": false}, {"data": ["login", 22, 0, 0.0, 2468.3181818181824, 1563, 4209, 2158.5, 3860.7999999999997, 4168.65, 4209.0, 0.10063077197524482, 43.912306428705385, 0.21250924831100396], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/755ede81-8a1b-49e1-aca9-db5802eca2bb", 3, 0, 0.0, 313.3333333333333, 233, 447, 260.0, 447.0, 447.0, 447.0, 0.01717652312818839, 0.023679223778606068, 0.011014892761240602], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 173.0625, 145, 449, 153.0, 252.30000000000018, 449.0, 449.0, 0.08824226914995119, 0.0714383214114351, 0.03136736911189671], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8930f102-7ea9-47e8-9b53-7b086a7149f6", 3, 0, 0.0, 849.3333333333334, 246, 2038, 264.0, 2038.0, 2038.0, 2038.0, 0.06319381543192973, 0.02797642870684389, 0.04052467981800181], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 907.8235294117649, 293, 1571, 1154.0, 1540.6, 1571.0, 1571.0, 0.08900523560209424, 56.43731593586387, 0.188118660013089], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/db9734ab-ef56-4fa2-a606-0738e94f243c", 1, 0, 0.0, 258.0, 258, 258, 258.0, 258.0, 258.0, 258.0, 3.875968992248062, 1.237736191860465, 2.3127119670542635], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 2, 20.0, 1122.1000000000001, 138, 1588, 1308.0, 1578.4, 1588.0, 1588.0, 0.06255551802224474, 59.87386559477786, 0.12113411785772372], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 543.4444444444443, 292, 1444, 438.5, 1246.0000000000002, 1444.0, 1444.0, 0.12556591861933294, 16.86414595991657, 0.27883100309729264], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=66d55954-9a3e-4328-abe5-5dbdcab535fe", 1, 0, 0.0, 304.0, 304, 304, 304.0, 304.0, 304.0, 304.0, 3.289473684210526, 0.5942896792763158, 2.2679379111842106], "isController": false}, {"data": ["register", 22, 8, 36.36363636363637, 1028.4545454545455, 205, 1806, 1093.5, 1677.4, 1786.7999999999997, 1806.0, 0.09956778529564843, 0.0310088592699871, 0.04492218438143513], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 376.0, 287, 630, 302.0, 616.7, 630.0, 630.0, 0.0864397622906537, 0.13396474878444084, 0.19440505132360886], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 173.35294117647055, 142, 450, 155.0, 229.19999999999982, 450.0, 450.0, 0.10228455563377316, 0.07941037278207974, 0.036358963135442804], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4d5bbf04-9044-4ce8-ab49-077c5ff8c7e6", 1, 0, 0.0, 741.0, 741, 741, 741.0, 741.0, 741.0, 741.0, 1.3495276653171389, 0.24381115047233468, 0.9304360661268556], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6220d413-b635-402e-8398-c3a4a844fbf1", 3, 0, 0.0, 389.6666666666667, 264, 484, 421.0, 484.0, 484.0, 484.0, 0.04754358161648178, 0.030565941957210775, 0.030488559825673535], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 497.7368421052632, 282, 1187, 567.0, 883.0, 1187.0, 1187.0, 0.09334957943557896, 6.014877665990292, 0.20868832018660088], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 150.85714285714286, 149, 152, 151.0, 152.0, 152.0, 152.0, 0.043270776154093415, 0.03215728579420419, 0.021719901311722672], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 188.42857142857144, 139, 410, 151.0, 410.0, 410.0, 410.0, 0.0432686364198294, 0.011577740604524663, 0.024676644208183954], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 151.28571428571428, 148, 164, 150.0, 164.0, 164.0, 164.0, 0.04327157860900419, 0.011663042671958163, 0.025438955393184106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 149.42857142857144, 142, 160, 150.0, 160.0, 160.0, 160.0, 0.04327104363575672, 0.011662898479950053, 0.025480897765977836], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 143.0, 143, 143, 143.0, 143.0, 143.0, 143.0, 6.993006993006993, 2.0623907342657346, 4.3228256118881125], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1419.5438596491224, 1111, 2139, 1239.0, 1936.2, 2015.3999999999999, 2139.0, 0.2449905872037548, 293.0939148045233, 0.48376071027928924], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 8, 36.36363636363637, 1028.4545454545455, 205, 1806, 1093.5, 1677.4, 1786.7999999999997, 1806.0, 0.10114151997315152, 0.03149897479277482, 0.04563220920663672], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 146.75, 139, 152, 147.0, 152.0, 152.0, 152.0, 0.059132671540184346, 0.015938102876065313, 0.034821289979229654], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 146.125, 143, 149, 146.0, 149.0, 149.0, 149.0, 0.05913529416112889, 0.015938809754366772, 0.03476508504394492], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 302.1764705882353, 139, 1006, 155.0, 995.6, 1006.0, 1006.0, 0.10175010175010174, 10.795365488609974, 0.05878920745648687], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 302.82352941176475, 139, 1249, 150.0, 1136.1999999999998, 1249.0, 1249.0, 0.1017531468657038, 3.544058364407946, 0.05889033517187304], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 146.5, 138, 155, 146.5, 155.0, 155.0, 155.0, 0.05913004915185335, 0.015821907683210762, 0.03372260615691637], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 149.11764705882354, 139, 163, 148.0, 162.2, 163.0, 163.0, 0.10174705681675354, 0.07561475609135689, 0.051072253128722], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6eab8bea-7826-45f4-800b-8e8a26a86740", 3, 0, 0.0, 688.3333333333333, 248, 1439, 378.0, 1439.0, 1439.0, 1439.0, 0.024469820554649264, 0.024541509482055465, 0.01569190966557912], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 149.5, 142, 157, 149.5, 157.0, 157.0, 157.0, 0.05912873804490828, 0.04394235317595234, 0.0296798548389481], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 197.76470588235293, 139, 435, 149.0, 435.0, 435.0, 435.0, 0.1017531468657038, 0.04520673471158968, 0.057025718107870306], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 190.25, 148, 440, 155.5, 440.0, 440.0, 440.0, 0.058759153574392764, 0.0462498806454693, 0.020887042872147425], "isController": false}, {"data": ["deleteAccount", 12, 1, 8.333333333333334, 684.6666666666666, 139, 2038, 465.5, 1858.3000000000006, 2038.0, 2038.0, 0.10203561042803938, 0.019173195351427648, 0.0694436694343826], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6a72bf4a-a7d1-4b22-b1c4-e5b23c35334c", 1, 0, 0.0, 1438.0, 1438, 1438, 1438.0, 1438.0, 1438.0, 1438.0, 0.6954102920723226, 0.12563564847009737, 0.4794527990264256], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1232.9999999999998, 909, 2396, 1135.0, 1491.7, 2261.749999999998, 2396.0, 0.10018032458425165, 0.051851144560208375, 0.046079036014826685], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 299.75000000000006, 290, 312, 298.0, 312.0, 312.0, 312.0, 0.059061076535772555, 0.09153313326393657, 0.1328297453729338], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=755ede81-8a1b-49e1-aca9-db5802eca2bb", 1, 0, 0.0, 441.0, 441, 441, 441.0, 441.0, 441.0, 441.0, 2.2675736961451247, 0.4096690759637188, 1.5633857709750567], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1d84756d-c79c-48ac-9153-a080cc6d9981", 3, 0, 0.0, 326.6666666666667, 244, 425, 311.0, 425.0, 425.0, 425.0, 0.0366743682840063, 0.03678181272233836, 0.023518393723793107], "isController": false}, {"data": ["addBook", 59, 11, 18.64406779661017, 1298.1864406779662, 712, 2197, 1176.0, 2078.0, 2101.0, 2197.0, 0.29492774270303773, 84.88936323881899, 1.0731892170793156], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 273.26315789473676, 138, 673, 154.0, 596.2, 612.8, 673.0, 0.24643959635788218, 0.1831450515901839, 0.11912851581753092], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 881.0, 690, 1235, 776.0, 1089.6000000000001, 1149.3, 1235.0, 0.24595044745721759, 72.31759787587269, 0.1236957816801436], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 217.50877192982458, 137, 466, 150.0, 449.2, 455.79999999999995, 466.0, 0.24696814110979684, 0.43701784344819516, 0.1201075530006629], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 1139.4210526315787, 961, 1494, 1039.0, 1384.6000000000001, 1430.6, 1494.0, 0.24567165337022714, 221.05578554723363, 0.12331565413310232], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 168.78947368421055, 142, 441, 153.0, 166.0, 441.0, 441.0, 0.09078616036658496, 0.06782364519573975, 0.0322716429428095], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 11, 6.285714285714286, 208.61714285714285, 142, 1609, 156.0, 336.80000000000007, 429.79999999999995, 792.7600000000098, 0.748909801303531, 1.63425742784789, 0.35890833558006274], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 274.7142857142857, 142, 449, 163.0, 449.0, 449.0, 449.0, 0.044950169526353646, 0.03481004339296722, 0.01597838057382102], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/01ab55a6-faf8-486f-bf66-13971b1e78f7", 3, 0, 0.0, 312.3333333333333, 227, 424, 286.0, 424.0, 424.0, 424.0, 0.02733809016102135, 0.02741818222203997, 0.017531262245186217], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d0d51ad4-f3c7-44a6-aa9d-551137b9806c", 3, 0, 0.0, 446.0, 337, 609, 392.0, 609.0, 609.0, 609.0, 0.02334212553395112, 0.027589602152922044, 0.014968745866498604], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 155.4444444444444, 141, 175, 154.5, 168.70000000000002, 175.0, 175.0, 0.12150094163229765, 0.09860086181292906, 0.04318978784585581], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/387b2e7f-b951-4847-8141-e6ee15def1e9", 1, 0, 0.0, 303.0, 303, 303, 303.0, 303.0, 303.0, 303.0, 3.3003300330033003, 1.0539139851485149, 1.969239892739274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 342.1428571428571, 301, 561, 303.0, 561.0, 561.0, 561.0, 0.04322828859205464, 0.06699540429256905, 0.09722143420654476], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 507.7647058823529, 283, 1395, 309.0, 1283.0, 1395.0, 1395.0, 0.1016594408730752, 14.44725598931081, 0.2255744038720287], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 159.14285714285714, 147, 190, 156.5, 183.5, 190.0, 190.0, 0.06405241317466635, 0.05310595584501146, 0.02276863124568218], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 172.2941176470588, 146, 440, 155.0, 224.7999999999998, 440.0, 440.0, 0.09526905100817072, 0.07396376518700754, 0.03386517047556069], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0ad16745-57ca-4ebb-a158-c4dac2b66c7f", 1, 0, 0.0, 452.0, 452, 452, 452.0, 452.0, 452.0, 452.0, 2.2123893805309733, 0.3996992533185841, 1.5253387721238938], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8930f102-7ea9-47e8-9b53-7b086a7149f6", 1, 0, 0.0, 264.0, 264, 264, 264.0, 264.0, 264.0, 264.0, 3.787878787878788, 0.6843335700757576, 2.611564867424242], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 164.47368421052633, 140, 436, 149.0, 158.0, 436.0, 436.0, 0.09354813297620923, 0.06952161054188986, 0.046956777685323775], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 223.21052631578948, 139, 445, 149.0, 441.0, 445.0, 445.0, 0.09341888536519409, 0.03238162843867542, 0.05286502507559555], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 284.36842105263156, 140, 1032, 150.0, 447.0, 1032.0, 1032.0, 0.0934184260470239, 4.447962594831995, 0.05449728287591083], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 283.8421052631579, 140, 998, 149.0, 450.0, 998.0, 998.0, 0.09355043599426881, 1.4716210598033472, 0.05466565104948818], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/66d55954-9a3e-4328-abe5-5dbdcab535fe", 3, 0, 0.0, 449.0, 288, 539, 520.0, 539.0, 539.0, 539.0, 0.06482701990189511, 0.029332538301964257, 0.04157201471573352], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 34.78260869565217, 0.6042296072507553], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 4.3478260869565215, 0.0755287009063444], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.3478260869565215, 0.0755287009063444], "isController": false}, {"data": ["401/Unauthorized", 13, 56.52173913043478, 0.9818731117824774], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1324, 23, "401/Unauthorized", 13, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
