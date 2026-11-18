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

    var data = {"OkPercent": 99.60967993754879, "KoPercent": 0.39032006245121};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7606951871657754, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/be132f7d-2fc0-4e04-93eb-eb8433fe40c9"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4de32d57-c5af-4625-b6ef-8d4c1f759909"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5357142857142857, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5357142857142857, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9d48b032-9e99-4399-9d1b-9e589ed00682"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9838b0ab-2cea-4f82-bc27-d9dfba4fdbdf"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/ebc37db8-4597-477a-bb03-ba4290957f7e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8076923076923077, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fe37009a-db0d-4ac3-9069-75e5780f0721"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8d64c29e-ba61-4797-b1f4-1ab230dbc382"], "isController": false}, {"data": [0.782608695652174, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=febf9de9-a217-47fb-9a6f-bd1cc7cb1133"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7f765b31-f03d-403c-9fe3-7b5ff2974748"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9d48b032-9e99-4399-9d1b-9e589ed00682"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ba88b617-446a-4fa5-9465-25a5b9ab7a58"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=50f60d92-15ba-4b1c-9d97-69741bf5fed8"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e2ccec38-a553-405d-9b27-a626dd2974b9"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e5838c90-02ee-4846-9d16-507de556db37"], "isController": false}, {"data": [0.4666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/52fcfcbb-678d-4f84-86ac-a41de506a709"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=be132f7d-2fc0-4e04-93eb-eb8433fe40c9"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7a2a0243-26af-48ec-9d5b-c452001a6627"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c55217a2-5d43-47f8-9afa-ccf357897950"], "isController": false}, {"data": [0.6944444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "register"], "isController": true}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.35454545454545455, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/50f60d92-15ba-4b1c-9d97-69741bf5fed8"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e5838c90-02ee-4846-9d16-507de556db37"], "isController": false}, {"data": [0.391304347826087, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/febf9de9-a217-47fb-9a6f-bd1cc7cb1133"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8d64c29e-ba61-4797-b1f4-1ab230dbc382"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=797b5c9a-917c-4d17-af2d-8873c77ecca0"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4de32d57-c5af-4625-b6ef-8d4c1f759909"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fe37009a-db0d-4ac3-9069-75e5780f0721"], "isController": false}, {"data": [0.990909090909091, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4636363636363636, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9792899408284024, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/797b5c9a-917c-4d17-af2d-8873c77ecca0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/7a2a0243-26af-48ec-9d5b-c452001a6627"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/5c8880e1-454e-49f7-a470-9ffcec82e259"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ba88b617-446a-4fa5-9465-25a5b9ab7a58"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/37bf6946-1b58-4230-9060-07aa5f8592bf"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=52fcfcbb-678d-4f84-86ac-a41de506a709"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7f765b31-f03d-403c-9fe3-7b5ff2974748"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e2ccec38-a553-405d-9b27-a626dd2974b9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1281, 5, 0.39032006245121, 443.66744730679164, 137, 5493, 200.0, 1117.0, 1325.599999999998, 1937.9600000000014, 4.9472639429037075, 696.2163589793228, 3.6036272995991214], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/be132f7d-2fc0-4e04-93eb-eb8433fe40c9", 3, 0, 0.0, 366.3333333333333, 251, 541, 307.0, 541.0, 541.0, 541.0, 0.016971877598818758, 0.023397103395506977, 0.010883658486221665], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4de32d57-c5af-4625-b6ef-8d4c1f759909", 1, 0, 0.0, 640.0, 640, 640, 640.0, 640.0, 640.0, 640.0, 1.5625, 0.28228759765625, 1.0772705078125], "isController": false}, {"data": ["see books", 55, 0, 0.0, 2080.909090909092, 1692, 2718, 1988.0, 2540.2, 2685.7999999999997, 2718.0, 0.2435276979548101, 293.04676361375175, 1.197423788283661], "isController": true}, {"data": ["deleteBook", 14, 0, 0.0, 664.1428571428571, 484, 1313, 586.5, 1048.5, 1313.0, 1313.0, 0.10021115922837408, 0.018104555134032425, 0.0681122722880355], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 0, 0.0, 664.1428571428571, 484, 1313, 586.5, 1048.5, 1313.0, 1313.0, 0.10050106961852666, 0.018156931522878353, 0.06830932075634234], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 264.8333333333333, 139, 422, 143.0, 422.0, 422.0, 422.0, 0.15738805774392964, 0.0683790997403097, 0.08829169471963066], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 174.55555555555554, 139, 443, 142.0, 435.8, 443.0, 443.0, 0.15739356260328954, 0.11696923939560872, 0.07900419060360431], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 287.55555555555554, 139, 970, 142.0, 849.4000000000002, 970.0, 970.0, 0.15739218635234864, 5.17976728909447, 0.09118021733237731], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 326.05555555555554, 139, 1252, 142.5, 1002.7000000000004, 1252.0, 1252.0, 0.15739218635234864, 15.773460316402014, 0.09102651402539261], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9d48b032-9e99-4399-9d1b-9e589ed00682", 3, 0, 0.0, 334.6666666666667, 243, 494, 267.0, 494.0, 494.0, 494.0, 0.04123824709957662, 0.02651221940809369, 0.026445099865288393], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9838b0ab-2cea-4f82-bc27-d9dfba4fdbdf", 1, 0, 0.0, 254.0, 254, 254, 254.0, 254.0, 254.0, 254.0, 3.937007874015748, 1.2572281003937007, 2.349132627952756], "isController": false}, {"data": ["goToProfile", 14, 0, 0.0, 264.7142857142857, 234, 448, 241.5, 377.5, 448.0, 448.0, 0.10013661495325767, 0.23548449357695142, 0.06473675693267243], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ebc37db8-4597-477a-bb03-ba4290957f7e", 1, 0, 0.0, 1041.0, 1041, 1041, 1041.0, 1041.0, 1041.0, 1041.0, 0.9606147934678194, 0.306758825648415, 0.5731793347742555], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 157.0, 139, 419, 141.5, 172.40000000000038, 419.0, 419.0, 0.09544109693634079, 0.07092839332866732, 0.047906956860624184], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 203.33333333333337, 137, 424, 142.0, 423.1, 424.0, 424.0, 0.0954426151276545, 0.025538356000954426, 0.054432116439990456], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 941.75, 839, 978, 975.0, 978.0, 978.0, 978.0, 0.1739054823703317, 51.13398602234685, 0.09918047041432981], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1182.0, 976, 1263, 1244.5, 1263.0, 1263.0, 1263.0, 0.17192469698272156, 154.6981445564343, 0.09788290853606121], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 210.5, 139, 420, 141.5, 420.0, 420.0, 420.0, 0.1804891255301868, 0.3193811479108384, 0.09993880290587492], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 162.92307692307696, 139, 419, 142.0, 308.9999999999999, 419.0, 419.0, 0.07559282217079326, 0.05617786882028679, 0.03794405331619896], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 183.46153846153848, 139, 422, 141.0, 419.6, 422.0, 422.0, 0.07559370130021166, 0.03769463560928523, 0.04213531127160235], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 343.07692307692315, 138, 1389, 140.0, 1334.2, 1389.0, 1389.0, 0.07559326173294645, 10.48169398321248, 0.04344113974286661], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 247.6153846153846, 139, 973, 141.0, 861.8, 973.0, 973.0, 0.07559282217079326, 3.436747706048589, 0.04351470825531767], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 142.5, 141, 144, 142.5, 144.0, 144.0, 144.0, 0.18045655508436345, 0.13410882658125056, 0.10133058513037986], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 1140.4666666666667, 138, 5353, 1125.0, 2978.2000000000016, 5353.0, 5353.0, 0.08476108675014693, 50.853065155141046, 0.04497414433682926], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 187.49999999999997, 138, 423, 141.0, 422.1, 423.0, 423.0, 0.09529961138936245, 0.025686223382289097, 0.05602574810194941], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 705.6666666666666, 140, 1129, 962.0, 1124.8, 1129.0, 1129.0, 0.08476060779006492, 16.622570549079217, 0.045056664232153654], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 226.55555555555557, 139, 574, 142.0, 433.60000000000025, 574.0, 574.0, 0.09530213423835064, 0.025686903368930446, 0.056120299751685], "isController": false}, {"data": ["deleteBooks", 14, 0, 0.0, 625.2857142857143, 241, 1113, 617.5, 997.0, 1113.0, 1113.0, 0.10084784221634743, 0.01821958086916433, 0.06952985996556767], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 529.3846153846155, 281, 1809, 284.0, 1643.3999999999999, 1809.0, 1809.0, 0.07553045620395547, 14.000692347384902, 0.1668966623527156], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fe37009a-db0d-4ac3-9069-75e5780f0721", 3, 0, 0.0, 361.6666666666667, 239, 605, 241.0, 605.0, 605.0, 605.0, 0.07119633576191944, 0.03221448786102475, 0.04565650437857465], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8d64c29e-ba61-4797-b1f4-1ab230dbc382", 1, 0, 0.0, 791.0, 791, 791, 791.0, 791.0, 791.0, 791.0, 1.2642225031605563, 0.22839957332490518, 0.8716221554993678], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 511.1739130434781, 219, 1583, 487.0, 785.8000000000002, 1436.999999999998, 1583.0, 0.09778953141807575, 0.060067983654267236, 0.04421538383454011], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 141.6, 140, 146, 141.0, 144.8, 146.0, 146.0, 0.08477737461426293, 0.06300349812642002, 0.042554268116924955], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 289.8666666666667, 138, 422, 418.0, 422.0, 422.0, 422.0, 0.08464485838915191, 0.10740418554717257, 0.04353479044754558], "isController": false}, {"data": ["login", 23, 0, 0.0, 2381.521739130435, 1583, 3795, 2107.0, 3513.6, 3739.999999999999, 3795.0, 0.0939016971711093, 19.668283004915548, 0.16875752106664163], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=febf9de9-a217-47fb-9a6f-bd1cc7cb1133", 1, 0, 0.0, 458.0, 458, 458, 458.0, 458.0, 458.0, 458.0, 2.1834061135371177, 0.39446301855895194, 1.5053561681222707], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 177.33333333333334, 143, 435, 144.5, 426.90000000000003, 435.0, 435.0, 0.09710309111506717, 0.0786117798187409, 0.03451711441980903], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7f765b31-f03d-403c-9fe3-7b5ff2974748", 1, 0, 0.0, 483.0, 483, 483, 483.0, 483.0, 483.0, 483.0, 2.070393374741201, 0.37404567805383027, 1.427439182194617], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9d48b032-9e99-4399-9d1b-9e589ed00682", 1, 0, 0.0, 456.0, 456, 456, 456.0, 456.0, 456.0, 456.0, 2.1929824561403506, 0.3961931195175438, 1.5119586074561402], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ba88b617-446a-4fa5-9465-25a5b9ab7a58", 1, 0, 0.0, 1113.0, 1113, 1113, 1113.0, 1113.0, 1113.0, 1113.0, 0.8984725965858041, 0.162321709344115, 0.619454739442947], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=50f60d92-15ba-4b1c-9d97-69741bf5fed8", 1, 0, 0.0, 468.0, 468, 468, 468.0, 468.0, 468.0, 468.0, 2.136752136752137, 0.38603432158119655, 1.473190438034188], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e2ccec38-a553-405d-9b27-a626dd2974b9", 1, 0, 0.0, 662.0, 662, 662, 662.0, 662.0, 662.0, 662.0, 1.5105740181268883, 0.27290643882175225, 1.0414699773413896], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e5838c90-02ee-4846-9d16-507de556db37", 1, 0, 0.0, 595.0, 595, 595, 595.0, 595.0, 595.0, 595.0, 1.680672268907563, 0.3036370798319328, 1.1587447478991597], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 1328.2, 284, 5493, 1267.0, 3118.800000000001, 5493.0, 5493.0, 0.08457660949287865, 67.49904476886621, 0.17578829805079105], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/52fcfcbb-678d-4f84-86ac-a41de506a709", 3, 0, 0.0, 370.0, 236, 556, 318.0, 556.0, 556.0, 556.0, 0.06136475208640157, 0.03817319050687285, 0.03935174531582392], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=be132f7d-2fc0-4e04-93eb-eb8433fe40c9", 1, 0, 0.0, 527.0, 527, 527, 527.0, 527.0, 527.0, 527.0, 1.8975332068311195, 0.34281605787476277, 1.3082601992409866], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7a2a0243-26af-48ec-9d5b-c452001a6627", 1, 0, 0.0, 881.0, 881, 881, 881.0, 881.0, 881.0, 881.0, 1.1350737797956867, 0.20506704029511919, 0.782580164585698], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c55217a2-5d43-47f8-9afa-ccf357897950", 1, 0, 0.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 1.252297794117647, 2.339920343137255], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 563.9444444444446, 283, 1393, 559.0, 1144.6000000000004, 1393.0, 1393.0, 0.1571956299614871, 21.112178185613107, 0.3490677698743308], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 0, 0.0, 1325.5, 1120, 1405, 1388.5, 1405.0, 1405.0, 1405.0, 0.17086715079026057, 204.41651537804356, 0.38528540153780433], "isController": false}, {"data": ["register", 24, 5, 20.833333333333332, 1032.4583333333335, 242, 2898, 929.5, 2217.0, 2757.75, 2898.0, 0.09852176304694972, 0.031221007918686705, 0.04445024856219802], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 463.2222222222222, 284, 842, 560.0, 728.6000000000001, 842.0, 842.0, 0.09522751440316155, 0.14758404820099355, 0.21416891178757919], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 143.35294117647058, 141, 152, 143.0, 146.4, 152.0, 152.0, 0.091503619775547, 0.0710404079312108, 0.03252667734208897], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 442.0666666666666, 280, 1120, 285.0, 872.8000000000002, 1120.0, 1120.0, 0.14124692787931864, 11.469673548923227, 0.3152583612296016], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 147.1818181818182, 140, 179, 142.0, 176.4, 179.0, 179.0, 0.05138770152154313, 0.03818949302528742, 0.02579421736530583], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 172.9090909090909, 140, 478, 142.0, 413.2000000000002, 478.0, 478.0, 0.05138842172141869, 0.013750417530926486, 0.029307459262996598], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 198.72727272727272, 139, 481, 141.0, 472.20000000000005, 481.0, 481.0, 0.05138842172141869, 0.013850785542101132, 0.03021077136356841], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 171.0, 139, 439, 142.0, 384.6000000000002, 439.0, 439.0, 0.05138866179252996, 0.01385085024876784, 0.030261096739155825], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1366.1999999999996, 1107, 2135, 1135.0, 1942.8, 2007.5999999999995, 2135.0, 0.2263067155489172, 270.74150874058256, 0.44686736214835027], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/50f60d92-15ba-4b1c-9d97-69741bf5fed8", 3, 0, 0.0, 397.3333333333333, 304, 558, 330.0, 558.0, 558.0, 558.0, 0.05065941674124858, 0.03256912371873892, 0.03248667024096996], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 5, 20.833333333333332, 1032.4583333333335, 242, 2898, 929.5, 2217.0, 2757.75, 2898.0, 0.09662574834629058, 0.030620171228878217, 0.04359482005467407], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 141.0, 140, 143, 141.0, 143.0, 143.0, 143.0, 0.023079231000023077, 0.00622057398047497, 0.013590601848646402], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 142.2, 140, 144, 143.0, 144.0, 144.0, 144.0, 0.023079231000023077, 0.00622057398047497, 0.013568063537122942], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 255.8235294117647, 138, 976, 141.0, 536.7999999999996, 976.0, 976.0, 0.0925074414074191, 4.919840984129532, 0.053916618825808484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 279.94117647058823, 139, 977, 141.0, 645.7999999999997, 977.0, 977.0, 0.09236670669223956, 1.6210123560845209, 0.05392479550282805], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 141.6, 141, 143, 141.0, 143.0, 143.0, 143.0, 0.023079550594990814, 0.006175582874050276, 0.013162556198705698], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 157.88235294117646, 139, 417, 142.0, 200.19999999999982, 417.0, 417.0, 0.09250593126265154, 0.06874708368249788, 0.04643364127832314], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 142.2, 140, 144, 142.0, 144.0, 144.0, 144.0, 0.02307933753069552, 0.0171517342391204, 0.011584745596462399], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 238.58823529411765, 138, 425, 142.0, 421.0, 425.0, 425.0, 0.09236670669223956, 0.03287592570456781, 0.05222157210851458], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 143.8, 143, 145, 144.0, 145.0, 145.0, 145.0, 0.022642363862787278, 0.01782201686856108, 0.008048652779350164], "isController": false}, {"data": ["deleteAccount", 14, 0, 0.0, 646.5714285714288, 450, 1746, 556.0, 1257.5, 1746.0, 1746.0, 0.1006412283980792, 0.018182253177387354, 0.06850286737642694], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/e5838c90-02ee-4846-9d16-507de556db37", 3, 0, 0.0, 649.3333333333334, 448, 1040, 460.0, 1040.0, 1040.0, 1040.0, 0.03221061447115539, 0.026181609483878588, 0.020655895347713584], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1282.0, 888, 2952, 1119.0, 2020.6000000000001, 2778.5999999999976, 2952.0, 0.09492482366682213, 0.04913101224942942, 0.04366171088581369], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 285.6, 283, 288, 285.0, 288.0, 288.0, 288.0, 0.02306390084367749, 0.035744541639566585, 0.05187125355760671], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/febf9de9-a217-47fb-9a6f-bd1cc7cb1133", 3, 0, 0.0, 642.6666666666666, 234, 1135, 559.0, 1135.0, 1135.0, 1135.0, 0.02039401231798344, 0.02811479237195959, 0.013078191492977662], "isController": false}, {"data": ["addBook", 57, 0, 0.0, 1450.4561403508774, 813, 6074, 1176.0, 2134.8, 2339.7, 6074.0, 0.28872893418499923, 98.00474989964137, 1.050189169689034], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/8d64c29e-ba61-4797-b1f4-1ab230dbc382", 3, 0, 0.0, 423.0, 239, 769, 261.0, 769.0, 769.0, 769.0, 0.022962288268566923, 0.02714064736431201, 0.014725165328475533], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=797b5c9a-917c-4d17-af2d-8873c77ecca0", 1, 0, 0.0, 649.0, 649, 649, 649.0, 649.0, 649.0, 649.0, 1.5408320493066257, 0.2783729776579353, 1.062331471494607], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 256.1272727272727, 139, 571, 143.0, 564.2, 569.2, 571.0, 0.22722202483743295, 0.1688632430676626, 0.10983877177200128], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4de32d57-c5af-4625-b6ef-8d4c1f759909", 3, 0, 0.0, 416.0, 238, 767, 243.0, 767.0, 767.0, 767.0, 0.018666583704072426, 0.022063269996577792, 0.01197043290918707], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 850.7272727272731, 688, 1243, 826.0, 1120.0, 1122.2, 1243.0, 0.22713006706531436, 66.78378114521045, 0.11423045365101259], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fe37009a-db0d-4ac3-9069-75e5780f0721", 1, 0, 0.0, 241.0, 241, 241, 241.0, 241.0, 241.0, 241.0, 4.149377593360996, 0.7496434128630706, 2.8608013485477177], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 211.72727272727275, 138, 567, 143.0, 420.0, 423.0, 567.0, 0.22765089114976117, 0.4028353659798508, 0.11071303104744244], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1098.181818181818, 963, 1543, 979.0, 1409.2, 1535.3999999999999, 1543.0, 0.22686774023231257, 204.1359914519845, 0.11387697117129753], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 143.66666666666669, 142, 145, 143.0, 145.0, 145.0, 145.0, 0.15757957768673178, 0.11772302434604476, 0.056014615505830444], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 0, 0.0, 226.42011834319524, 140, 1493, 146.0, 366.0, 467.0, 1410.4000000000015, 0.7010819062790389, 1.4669179568233106, 0.33829016908934023], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 145.27272727272725, 142, 151, 144.0, 150.6, 151.0, 151.0, 0.04981004261022736, 0.038573597451084275, 0.017705913584104258], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 144.38888888888889, 141, 153, 144.0, 150.3, 153.0, 153.0, 0.1558832953728642, 0.12650294770981457, 0.05541164015207281], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/797b5c9a-917c-4d17-af2d-8873c77ecca0", 3, 0, 0.0, 345.6666666666667, 247, 508, 282.0, 508.0, 508.0, 508.0, 0.029675645197986013, 0.02473936437240956, 0.019030280286468894], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7a2a0243-26af-48ec-9d5b-c452001a6627", 3, 0, 0.0, 749.0, 238, 1746, 263.0, 1746.0, 1746.0, 1746.0, 0.01982461821089429, 0.023432027579348036, 0.012713052693835205], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 348.45454545454555, 281, 647, 285.0, 634.0, 647.0, 647.0, 0.051353395393133584, 0.07958773289931934, 0.11549498983436196], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 505.6470588235294, 283, 1395, 561.0, 842.9999999999995, 1395.0, 1395.0, 0.09229499652536484, 6.629737074628648, 0.2061845197538438], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5c8880e1-454e-49f7-a470-9ffcec82e259", 1, 0, 0.0, 625.0, 625, 625, 625.0, 625.0, 625.0, 625.0, 1.6, 0.5109375, 0.9546875], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ba88b617-446a-4fa5-9465-25a5b9ab7a58", 3, 0, 0.0, 357.6666666666667, 241, 483, 349.0, 483.0, 483.0, 483.0, 0.025787152840454883, 0.030479541654847554, 0.01653668329938025], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 210.2307692307692, 142, 433, 145.0, 430.6, 433.0, 433.0, 0.07317100627019238, 0.0606661956283138, 0.026010006135107448], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/37bf6946-1b58-4230-9060-07aa5f8592bf", 1, 0, 0.0, 520.0, 520, 520, 520.0, 520.0, 520.0, 520.0, 1.9230769230769231, 0.6141075721153846, 1.1474609375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=52fcfcbb-678d-4f84-86ac-a41de506a709", 1, 0, 0.0, 790.0, 790, 790, 790.0, 790.0, 790.0, 790.0, 1.2658227848101267, 0.22868868670886075, 0.8727254746835442], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7f765b31-f03d-403c-9fe3-7b5ff2974748", 3, 0, 0.0, 355.6666666666667, 242, 556, 269.0, 556.0, 556.0, 556.0, 0.028512502732448177, 0.02317568988376403, 0.018284384890274386], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 167.00000000000003, 142, 423, 145.0, 280.2000000000001, 423.0, 423.0, 0.08095723838668414, 0.06285254347403701, 0.028777768332766636], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e2ccec38-a553-405d-9b27-a626dd2974b9", 3, 0, 0.0, 328.6666666666667, 250, 450, 286.0, 450.0, 450.0, 450.0, 0.028125966830109785, 0.028208367123557374, 0.01803650867686077], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 141.06666666666666, 139, 143, 141.0, 143.0, 143.0, 143.0, 0.14180508418495166, 0.10538444244604317, 0.07117950514752455], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 159.66666666666666, 139, 420, 141.0, 254.4000000000001, 420.0, 420.0, 0.14180910603539557, 0.05214439003176524, 0.0800815225098321], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 251.8, 139, 976, 141.0, 643.6000000000001, 976.0, 976.0, 0.14143738095687103, 8.519953941506214, 0.08233939196069927], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 281.4000000000001, 139, 977, 142.0, 730.4000000000001, 977.0, 977.0, 0.14180642477641853, 2.8153929987804647, 0.08269271788557167], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 100.0, 0.39032006245121], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1281, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
