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

    var data = {"OkPercent": 97.77954004758128, "KoPercent": 2.2204599524187154};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7591339648173207, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.14655172413793102, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/64866582-2075-4e4b-a1ef-f8c963d4ac36"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b40e4e81-4c53-4653-95a8-b51d841a2e77"], "isController": false}, {"data": [0.53125, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.53125, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8125, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=450472be-4b55-44f5-9d27-52372e4f7b77"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7846f85a-fcb6-4d5e-b81f-55e07469a03d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.925, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.925, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.59375, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cbc2463b-007b-43a3-8239-664e929cf20a"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3c322dd4-dd2a-48e6-9fab-0fbbd6e2c1af"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7153c06a-8fab-418d-b893-f766cb4c26f7"], "isController": false}, {"data": [0.7608695652173914, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/56003b89-4477-4d8d-80ff-5152d12aeb96"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=33f53177-3ff0-4e83-9617-bec84721e421"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2158d174-683b-49e3-8516-b49b96717dea"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/327d4bf2-2606-4fe2-8889-b91a5453f489"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b40e4e81-4c53-4653-95a8-b51d841a2e77"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/414770d2-c176-4019-be53-a4a4de8ad3f3"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2727272727272727, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e8e2f747-e2f1-41a4-90ba-41acf3807cb9"], "isController": false}, {"data": [0.22, 500, 1500, "register"], "isController": true}, {"data": [0.925, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cbc2463b-007b-43a3-8239-664e929cf20a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=64866582-2075-4e4b-a1ef-f8c963d4ac36"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2b201915-da84-4723-9919-c5d41266197a"], "isController": false}, {"data": [0.43103448275862066, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.22, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.2826086956521739, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.22916666666666666, 500, 1500, "addBook"], "isController": true}, {"data": [0.9827586206896551, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/450472be-4b55-44f5-9d27-52372e4f7b77"], "isController": false}, {"data": [0.5775862068965517, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.49137931034482757, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9123376623376623, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2158d174-683b-49e3-8516-b49b96717dea"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7846f85a-fcb6-4d5e-b81f-55e07469a03d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e8e2f747-e2f1-41a4-90ba-41acf3807cb9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/33f53177-3ff0-4e83-9617-bec84721e421"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/7153c06a-8fab-418d-b893-f766cb4c26f7"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/3c322dd4-dd2a-48e6-9fab-0fbbd6e2c1af"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=56003b89-4477-4d8d-80ff-5152d12aeb96"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=327d4bf2-2606-4fe2-8889-b91a5453f489"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=414770d2-c176-4019-be53-a4a4de8ad3f3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/754596af-ea97-41b9-ac28-ab91aa799e9b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/12763928-fa5a-45dd-ab62-9f6b894fe00b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1a950d91-1713-4bcc-afa7-04322d691ef3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1261, 28, 2.2204599524187154, 393.6201427438542, 96, 2924, 123.0, 1077.8, 1319.6999999999996, 2126.9399999999987, 5.051111965647632, 760.4440411474357, 3.6825404857539414], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 1712.6724137931037, 1230, 2563, 1670.0, 2121.7000000000003, 2303.2999999999993, 2563.0, 0.2589193243098461, 311.5684144441828, 1.2731042948242919], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/64866582-2075-4e4b-a1ef-f8c963d4ac36", 3, 0, 0.0, 417.0, 283, 498, 470.0, 498.0, 498.0, 498.0, 0.05510755157148368, 0.02554464630136483, 0.03533915253770275], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b40e4e81-4c53-4653-95a8-b51d841a2e77", 3, 0, 0.0, 391.0, 309, 475, 389.0, 475.0, 475.0, 475.0, 0.0683168993236627, 0.030911617858037487, 0.043809990777218595], "isController": false}, {"data": ["deleteBook", 16, 3, 18.75, 620.5000000000001, 102, 1571, 503.0, 1377.8000000000002, 1571.0, 1571.0, 0.08241814847629447, 0.01665566953155585, 0.05527911582067871], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, 18.75, 620.5000000000001, 102, 1571, 503.0, 1377.8000000000002, 1571.0, 1571.0, 0.08402478731225711, 0.016980351000420123, 0.056356713120995695], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 126.55555555555556, 99, 307, 103.0, 298.0, 307.0, 307.0, 0.09798211282095946, 0.034393677840256494, 0.05542325891228968], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 133.55555555555557, 99, 427, 104.0, 318.1000000000002, 427.0, 427.0, 0.09798317955417653, 0.07281757777414877, 0.049182963174655016], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 192.72222222222223, 99, 794, 104.5, 435.8000000000006, 794.0, 794.0, 0.09798264618466462, 1.6255061586175739, 0.05723096619054359], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 199.83333333333337, 98, 1257, 103.5, 394.8000000000014, 1257.0, 1257.0, 0.09787768551899642, 4.917721783018766, 0.057074075735577996], "isController": false}, {"data": ["goToProfile", 16, 3, 18.75, 259.31249999999994, 98, 432, 237.5, 420.8, 432.0, 432.0, 0.08225629003567866, 0.1249608800651881, 0.053162344676989826], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=450472be-4b55-44f5-9d27-52372e4f7b77", 1, 0, 0.0, 319.0, 319, 319, 319.0, 319.0, 319.0, 319.0, 3.134796238244514, 0.5663450235109718, 2.161295062695925], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 115.14999999999999, 99, 307, 105.0, 112.80000000000001, 297.29999999999984, 307.0, 0.11289867344058707, 0.08390223680496754, 0.05666984194185718], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 173.6, 99, 314, 106.5, 309.7, 313.8, 314.0, 0.112894849736955, 0.05564260806859491, 0.06296313348122558], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 754.1666666666667, 602, 880, 787.5, 880.0, 880.0, 880.0, 0.04241451707537766, 12.4712763146733, 0.024189529269551324], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1008.3333333333333, 874, 1137, 1018.0, 1137.0, 1137.0, 1137.0, 0.042363905952128786, 38.11911704352892, 0.024119294111417073], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 236.33333333333334, 103, 308, 298.0, 308.0, 308.0, 308.0, 0.04256285114352193, 0.0753162951875603, 0.02356751620935248], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7846f85a-fcb6-4d5e-b81f-55e07469a03d", 1, 0, 0.0, 579.0, 579, 579, 579.0, 579.0, 579.0, 579.0, 1.7271157167530224, 0.31202774179620035, 1.1907653281519863], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 133.91666666666666, 100, 296, 102.0, 294.5, 296.0, 296.0, 0.05331319279383344, 0.03962044894151098, 0.026760723726592175], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 150.41666666666666, 97, 306, 101.0, 304.8, 306.0, 306.0, 0.053314140242845906, 0.014265697682167754, 0.030405720607248058], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 134.5, 99, 304, 102.5, 302.5, 304.0, 304.0, 0.05331390337743578, 0.014369763019699488, 0.03134274397775033], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 126.58333333333333, 97, 411, 99.0, 319.50000000000034, 411.0, 411.0, 0.053314850851704745, 0.014370018393623544, 0.03139536627302535], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 139.33333333333334, 101, 316, 104.5, 316.0, 316.0, 316.0, 0.04262302069347655, 0.031675897214585594, 0.023933825096434585], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 737.0, 101, 1317, 943.0, 1243.5, 1317.0, 1317.0, 0.07636320248180409, 42.95255824185658, 0.040791671638229325], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 275.25000000000006, 98, 1210, 104.0, 1084.0, 1203.75, 1210.0, 0.11289803613866138, 15.263742822154546, 0.06491637077973028], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 526.9375000000001, 96, 884, 774.0, 837.8000000000001, 884.0, 884.0, 0.0764339729901448, 14.054054195269693, 0.040904118358007176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 208.04999999999998, 97, 803, 103.5, 612.2, 793.4999999999999, 803.0, 0.11289867344058707, 5.005259049534293, 0.06502698983911939], "isController": false}, {"data": ["deleteBooks", 16, 3, 18.75, 442.0625, 107, 1642, 369.0, 1046.3000000000006, 1642.0, 1642.0, 0.0845496147708177, 0.017086412018199305, 0.057162846851583723], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cbc2463b-007b-43a3-8239-664e929cf20a", 1, 0, 0.0, 216.0, 216, 216, 216.0, 216.0, 216.0, 216.0, 4.62962962962963, 0.8364076967592593, 3.191912615740741], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 297.0, 201, 597, 207.5, 596.7, 597.0, 597.0, 0.05328857093374898, 0.08258687702330043, 0.11984724498088273], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3c322dd4-dd2a-48e6-9fab-0fbbd6e2c1af", 1, 0, 0.0, 572.0, 572, 572, 572.0, 572.0, 572.0, 572.0, 1.7482517482517483, 0.3158462631118881, 1.2053376311188813], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7153c06a-8fab-418d-b893-f766cb4c26f7", 1, 0, 0.0, 419.0, 419, 419, 419.0, 419.0, 419.0, 419.0, 2.3866348448687353, 0.431179146778043, 1.6454728520286397], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 547.6086956521739, 215, 1568, 381.0, 1324.8000000000002, 1533.5999999999995, 1568.0, 0.11019758906839916, 0.06768973000392878, 0.04982566771354376], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 103.8125, 99, 122, 104.0, 111.50000000000001, 122.0, 122.0, 0.07643287760230064, 0.05680216782749099, 0.038365721765217305], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/56003b89-4477-4d8d-80ff-5152d12aeb96", 3, 0, 0.0, 1143.6666666666667, 400, 2606, 425.0, 2606.0, 2606.0, 2606.0, 0.06736426101405667, 0.03048057383123007, 0.04319908665289442], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 176.68749999999997, 98, 316, 105.0, 310.4, 316.0, 316.0, 0.0763573715883765, 0.09210980786576374, 0.039539547153063126], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=33f53177-3ff0-4e83-9617-bec84721e421", 1, 0, 0.0, 791.0, 791, 791, 791.0, 791.0, 791.0, 791.0, 1.2642225031605563, 0.22839957332490518, 0.8716221554993678], "isController": false}, {"data": ["login", 23, 0, 0.0, 2996.8695652173915, 1590, 5669, 2981.0, 4487.6, 5470.399999999997, 5669.0, 0.10644944808275288, 33.367490685673296, 0.20665710405433552], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 125.3, 101, 299, 107.0, 260.3000000000003, 297.79999999999995, 299.0, 0.11490752816670784, 0.09302572348652421, 0.04084603540300943], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2158d174-683b-49e3-8516-b49b96717dea", 1, 0, 0.0, 453.0, 453, 453, 453.0, 453.0, 453.0, 453.0, 2.207505518763797, 0.3988169150110375, 1.5219715783664458], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/327d4bf2-2606-4fe2-8889-b91a5453f489", 3, 0, 0.0, 460.3333333333333, 352, 519, 510.0, 519.0, 519.0, 519.0, 0.021412512044538024, 0.025685256147175334, 0.01373133096606117], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 843.6875, 202, 1418, 1048.0, 1345.2, 1418.0, 1418.0, 0.07632022056543743, 57.11030366205883, 0.15944143734825394], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b40e4e81-4c53-4653-95a8-b51d841a2e77", 1, 0, 0.0, 216.0, 216, 216, 216.0, 216.0, 216.0, 216.0, 4.62962962962963, 0.8364076967592593, 3.191912615740741], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/414770d2-c176-4019-be53-a4a4de8ad3f3", 3, 0, 0.0, 418.6666666666667, 200, 637, 419.0, 637.0, 637.0, 637.0, 0.032332812415799966, 0.021165783127660723, 0.02073425796195506], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 375.77777777777777, 206, 1564, 215.5, 816.1000000000012, 1564.0, 1564.0, 0.09782342871117633, 6.644897344841173, 0.21861668161191272], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 5, 45.45454545454545, 672.5454545454545, 98, 1453, 975.0, 1404.0000000000002, 1453.0, 1453.0, 0.0741065112675582, 48.36745934668373, 0.11335059327314986], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e8e2f747-e2f1-41a4-90ba-41acf3807cb9", 3, 0, 0.0, 315.0, 225, 418, 302.0, 418.0, 418.0, 418.0, 0.033879546917525885, 0.028243984262950456, 0.02172614174073112], "isController": false}, {"data": ["register", 25, 7, 28.0, 1245.3599999999997, 294, 2776, 1152.0, 2308.2000000000003, 2665.8999999999996, 2776.0, 0.1024308898785989, 0.032201711005584534, 0.046213936644445994], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 453.05, 206, 1393, 397.5, 1309.7000000000003, 1389.55, 1393.0, 0.11282670382426113, 20.39562485367787, 0.2494197357880663], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 120.12500000000001, 100, 299, 107.0, 172.30000000000013, 299.0, 299.0, 0.13297651302338723, 0.10323860141952428, 0.047268994863782186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 12, 0, 0.0, 331.83333333333326, 198, 1069, 214.0, 870.4000000000008, 1069.0, 1069.0, 0.05802623753040333, 5.867397996221041, 0.129265155123475], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cbc2463b-007b-43a3-8239-664e929cf20a", 3, 0, 0.0, 738.6666666666666, 432, 1349, 435.0, 1349.0, 1349.0, 1349.0, 0.07116255900562184, 0.03219920475840311, 0.04563484415399578], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 5, 0, 0.0, 108.8, 101, 114, 110.0, 114.0, 114.0, 114.0, 0.035301011726996095, 0.02623444328539456, 0.017719453152027335], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=64866582-2075-4e4b-a1ef-f8c963d4ac36", 1, 0, 0.0, 198.0, 198, 198, 198.0, 198.0, 198.0, 198.0, 5.050505050505051, 0.91244476010101, 3.4820864898989896], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 5, 0, 0.0, 102.8, 100, 105, 103.0, 105.0, 105.0, 105.0, 0.035301759439690474, 0.009445978600073427, 0.020133034680448473], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 5, 0, 0.0, 183.8, 104, 311, 104.0, 311.0, 311.0, 311.0, 0.03524999295000141, 0.009500974662305067, 0.020723140386621923], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 5, 0, 0.0, 139.4, 97, 296, 100.0, 296.0, 296.0, 296.0, 0.035303254960107326, 0.009515330438466427, 0.020788928457953822], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 109.33333333333333, 107, 113, 108.0, 113.0, 113.0, 113.0, 0.03383216988260237, 0.00997784697709562, 0.02091383157781963], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2b201915-da84-4723-9919-c5d41266197a", 1, 0, 0.0, 224.0, 224, 224, 224.0, 224.0, 224.0, 224.0, 4.464285714285714, 1.4256068638392856, 2.6637486049107144], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 1183.7931034482758, 786, 2122, 1080.5, 1604.0, 1868.4999999999993, 2122.0, 0.25725982799075636, 307.77219226401957, 0.5079876681614349], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 7, 28.0, 1245.3599999999997, 294, 2776, 1152.0, 2308.2000000000003, 2665.8999999999996, 2776.0, 0.10212460018219029, 0.03210542118227607, 0.04607574734782413], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 130.85714285714283, 102, 294, 104.0, 294.0, 294.0, 294.0, 0.04921432840018279, 0.013264799451611768, 0.028980703149717013], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 100.71428571428571, 98, 105, 100.0, 105.0, 105.0, 105.0, 0.049215712467746135, 0.0132651725010722, 0.028933455962483565], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 127.18749999999999, 97, 308, 102.0, 306.6, 308.0, 308.0, 0.12340727485885293, 0.033262117051800204, 0.07254997994631784], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 141.31250000000003, 100, 318, 104.0, 313.1, 318.0, 318.0, 0.12340917855765524, 0.033262630158118006, 0.07267161588893174], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 159.85714285714286, 98, 310, 102.0, 310.0, 310.0, 310.0, 0.04921502042423347, 0.013168862886953098, 0.028067941335695654], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 126.75, 99, 299, 104.0, 294.1, 299.0, 299.0, 0.12322004790179363, 0.09157271138014156, 0.06185068810695501], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 143.28571428571428, 101, 354, 106.0, 354.0, 354.0, 354.0, 0.04921536644355701, 0.03657509166362, 0.024703806984363575], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 139.99999999999997, 97, 313, 104.0, 309.5, 313.0, 313.0, 0.12341203421598648, 0.03302236071794951, 0.0703834257638048], "isController": false}, {"data": ["deleteAccount", 15, 2, 13.333333333333334, 504.06666666666666, 101, 1522, 481.0, 991.0000000000003, 1522.0, 1522.0, 0.08725800446760983, 0.016775578593284626, 0.05938202608723474], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 168.85714285714286, 106, 312, 116.0, 312.0, 312.0, 312.0, 0.05061643587982212, 0.03984067121009437, 0.017992561191655522], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1631.434782608696, 1077, 2794, 1320.0, 2437.8, 2724.999999999999, 2794.0, 0.10947636976357863, 0.05666257419403972, 0.050354853670552285], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 305.57142857142856, 207, 659, 210.0, 659.0, 659.0, 659.0, 0.04917906096095885, 0.07621793920414228, 0.11060486073543774], "isController": false}, {"data": ["addBook", 48, 10, 20.833333333333332, 1222.270833333333, 519, 4343, 869.5, 2100.400000000001, 3194.399999999997, 4343.0, 0.242480576295503, 91.66753919944784, 0.8765155825343262], "isController": true}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 188.62068965517236, 99, 691, 106.0, 411.2, 431.6499999999997, 691.0, 0.25804384965831434, 0.19176891561521212, 0.12473799373131407], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/450472be-4b55-44f5-9d27-52372e4f7b77", 3, 0, 0.0, 323.3333333333333, 227, 510, 233.0, 510.0, 510.0, 510.0, 0.07952075491703334, 0.03598107074696496, 0.05099475494354026], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 655.689655172414, 484, 932, 603.5, 896.8000000000001, 929.0, 932.0, 0.258218470634327, 75.92480402664992, 0.12986573474285001], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 157.46551724137927, 98, 410, 105.0, 310.1, 322.0999999999998, 410.0, 0.2585499803858635, 0.4575122699796726, 0.12574012717984379], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 992.206896551724, 685, 1639, 936.0, 1269.7, 1433.1499999999999, 1639.0, 0.2580978190734288, 232.23687128984383, 0.1295530068395922], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 12, 0, 0.0, 123.33333333333331, 102, 316, 105.5, 254.8000000000002, 316.0, 316.0, 0.060240963855421686, 0.04500423569277109, 0.02141378012048193], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 154, 10, 6.4935064935064934, 202.61038961038955, 100, 2924, 109.0, 317.0, 430.25, 2524.6999999999916, 0.6412605349945035, 1.5882600524875914, 0.2995173369366068], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 5, 0, 0.0, 151.2, 104, 313, 112.0, 313.0, 313.0, 313.0, 0.03491449440320654, 0.027038275450920697, 0.012411011682389828], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 107.77777777777779, 99, 122, 109.0, 115.70000000000002, 122.0, 122.0, 0.10160077668149287, 0.08245141154523493, 0.036115901085999415], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2158d174-683b-49e3-8516-b49b96717dea", 3, 0, 0.0, 335.6666666666667, 236, 487, 284.0, 487.0, 487.0, 487.0, 0.02672820092479575, 0.026806506200942614, 0.017140154889924358], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7846f85a-fcb6-4d5e-b81f-55e07469a03d", 3, 0, 0.0, 342.3333333333333, 239, 449, 339.0, 449.0, 449.0, 449.0, 0.04164526562738592, 0.02677389310354401, 0.026706111095686935], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e8e2f747-e2f1-41a4-90ba-41acf3807cb9", 1, 0, 0.0, 555.0, 555, 555, 555.0, 555.0, 555.0, 555.0, 1.8018018018018018, 0.3255208333333333, 1.2422578828828827], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 5, 0, 0.0, 293.8, 206, 426, 218.0, 426.0, 426.0, 426.0, 0.03522342216680403, 0.05458942478390431, 0.07921830200209933], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/33f53177-3ff0-4e83-9617-bec84721e421", 3, 0, 0.0, 911.3333333333334, 202, 2023, 509.0, 2023.0, 2023.0, 2023.0, 0.01790061578118287, 0.02115792184292806, 0.011479236031552818], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7153c06a-8fab-418d-b893-f766cb4c26f7", 3, 0, 0.0, 778.0, 396, 1522, 416.0, 1522.0, 1522.0, 1522.0, 0.018751640768567248, 0.025850650603802833, 0.012024977966822097], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 282.75000000000006, 202, 608, 209.5, 605.9, 608.0, 608.0, 0.12312238364934745, 0.19081564731593204, 0.2769051265082492], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3c322dd4-dd2a-48e6-9fab-0fbbd6e2c1af", 3, 0, 0.0, 847.6666666666666, 244, 1818, 481.0, 1818.0, 1818.0, 1818.0, 0.025171797518060764, 0.020984691876221883, 0.016142070674016833], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=56003b89-4477-4d8d-80ff-5152d12aeb96", 1, 0, 0.0, 198.0, 198, 198, 198.0, 198.0, 198.0, 198.0, 5.050505050505051, 0.91244476010101, 3.4820864898989896], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=327d4bf2-2606-4fe2-8889-b91a5453f489", 1, 0, 0.0, 587.0, 587, 587, 587.0, 587.0, 587.0, 587.0, 1.7035775127768313, 0.307775234241908, 1.174536839863714], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=414770d2-c176-4019-be53-a4a4de8ad3f3", 1, 0, 0.0, 1642.0, 1642, 1642, 1642.0, 1642.0, 1642.0, 1642.0, 0.6090133982947624, 0.11002683465286237, 0.4198861906211937], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 107.16666666666666, 101, 113, 106.0, 112.7, 113.0, 113.0, 0.05303562668222379, 0.04397192095039843, 0.018852507922196737], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/754596af-ea97-41b9-ac28-ab91aa799e9b", 1, 0, 0.0, 219.0, 219, 219, 219.0, 219.0, 219.0, 219.0, 4.5662100456621, 1.4581549657534247, 2.724564783105023], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 129.25000000000003, 102, 310, 108.0, 233.00000000000009, 310.0, 310.0, 0.07577623278458712, 0.05883018072631519, 0.026936082747646202], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/12763928-fa5a-45dd-ab62-9f6b894fe00b", 1, 0, 0.0, 211.0, 211, 211, 211.0, 211.0, 211.0, 211.0, 4.739336492890995, 1.5134404620853081, 2.827865817535545], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1a950d91-1713-4bcc-afa7-04322d691ef3", 1, 0, 0.0, 200.0, 200, 200, 200.0, 200.0, 200.0, 200.0, 5.0, 1.5966796875, 2.9833984375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 12, 0, 0.0, 104.16666666666667, 99, 135, 101.5, 126.00000000000003, 135.0, 135.0, 0.05829968955415312, 0.04332623413155325, 0.029263711358237018], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 12, 0, 0.0, 152.0, 98, 308, 103.0, 304.40000000000003, 308.0, 308.0, 0.0582544067031404, 0.022878887268013962, 0.03281551132805484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 12, 0, 0.0, 207.0, 97, 969, 104.0, 768.9000000000008, 969.0, 969.0, 0.05806498439503544, 4.368260719340479, 0.033720030000241936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 12, 0, 0.0, 176.16666666666666, 98, 778, 104.5, 634.6000000000006, 778.0, 778.0, 0.05811869775371233, 1.4384283099809179, 0.03380797945504035], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 25.0, 0.5551149881046789], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 10.714285714285714, 0.23790642347343377], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 7.142857142857143, 0.1586042823156225], "isController": false}, {"data": ["401/Unauthorized", 16, 57.142857142857146, 1.26883425852498], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1261, 28, "401/Unauthorized", 16, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 5, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 154, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
