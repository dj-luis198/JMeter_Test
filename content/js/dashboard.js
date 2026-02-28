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

    var data = {"OkPercent": 98.21295606850335, "KoPercent": 1.7870439314966493};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8191693290734824, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1e942206-0c8f-48a1-a7e5-f7371c4baf3c"], "isController": false}, {"data": [0.49107142857142855, 500, 1500, "see books"], "isController": true}, {"data": [0.7333333333333333, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7333333333333333, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/44502669-8fad-4105-b801-544007a230a5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d827feb3-f998-4c80-9b42-c72d5065d7ca"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9ec7331c-c267-4570-88b0-939b0c1a0201"], "isController": false}, {"data": [0.875, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e51d0dd2-a914-4385-a80b-8dfeb1a7eb88"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=62c5083f-f105-4230-9127-046d702ed27b"], "isController": false}, {"data": [0.8043478260869565, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eac136d7-384e-43a0-b0a5-c4264c703223"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f206712b-5c16-43de-aef0-780f409297ef"], "isController": false}, {"data": [0.021739130434782608, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9f2dce78-cf59-45a7-8685-4bb4fcf5e386"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9ec7331c-c267-4570-88b0-939b0c1a0201"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0f9516b3-4eda-46ef-8795-d63d74a5a100"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f387e98a-9138-4599-81ca-4fd927d4e2b5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/52102bd8-21fc-4419-808b-baf882374861"], "isController": false}, {"data": [0.2826086956521739, 500, 1500, "register"], "isController": true}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/55bcdf08-a6d5-46be-be3c-a9cec81b3df4"], "isController": false}, {"data": [0.2826086956521739, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1e942206-0c8f-48a1-a7e5-f7371c4baf3c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/09aa91ee-0668-4b68-8895-d5c1ba563557"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d827feb3-f998-4c80-9b42-c72d5065d7ca"], "isController": false}, {"data": [0.3695652173913043, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=44502669-8fad-4105-b801-544007a230a5"], "isController": false}, {"data": [0.4098360655737705, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.7767857142857143, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e51d0dd2-a914-4385-a80b-8dfeb1a7eb88"], "isController": false}, {"data": [0.9410112359550562, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6359f1c5-14c3-4444-9ee6-4ed4eadff325"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6359f1c5-14c3-4444-9ee6-4ed4eadff325"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/eac136d7-384e-43a0-b0a5-c4264c703223"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0f9516b3-4eda-46ef-8795-d63d74a5a100"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/62c5083f-f105-4230-9127-046d702ed27b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f387e98a-9138-4599-81ca-4fd927d4e2b5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=55bcdf08-a6d5-46be-be3c-a9cec81b3df4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=52102bd8-21fc-4419-808b-baf882374861"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1343, 24, 1.7870439314966493, 275.5658972449738, 80, 2117, 91.0, 720.2000000000003, 822.8, 1438.159999999998, 5.191180790698393, 733.9871804070611, 3.7999487779175745], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/1e942206-0c8f-48a1-a7e5-f7371c4baf3c", 3, 0, 0.0, 381.33333333333337, 160, 745, 239.0, 745.0, 745.0, 745.0, 0.03105107902499612, 0.025582773767013404, 0.019912313046628372], "isController": false}, {"data": ["see books", 56, 0, 0.0, 1188.9821428571427, 978, 1549, 1168.0, 1406.6, 1416.05, 1549.0, 0.2699705924890325, 324.86497704044734, 1.3274432941233187], "isController": true}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 449.5333333333333, 84, 817, 421.0, 793.0, 817.0, 817.0, 0.07664597225415803, 0.015014826205257913, 0.051606291995605624], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 449.5333333333333, 84, 817, 421.0, 793.0, 817.0, 817.0, 0.07483722902686657, 0.014660496233192806, 0.05038845199191758], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 126.46666666666668, 81, 248, 84.0, 247.4, 248.0, 248.0, 0.09891457737098241, 0.026467377148094908, 0.05641221990688842], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/44502669-8fad-4105-b801-544007a230a5", 3, 0, 0.0, 295.6666666666667, 166, 517, 204.0, 517.0, 517.0, 517.0, 0.03603733467872716, 0.030042843135488367, 0.023109879334991052], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 94.53333333333335, 81, 243, 84.0, 150.60000000000005, 243.0, 243.0, 0.09891262059096993, 0.07350830495090636, 0.04964949900757671], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 137.0, 81, 250, 84.0, 247.6, 250.0, 250.0, 0.09891327284237181, 0.02666021807079553, 0.058246780785107616], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 103.8, 81, 242, 83.0, 242.0, 242.0, 242.0, 0.09891457737098241, 0.026660569682022607, 0.05815095271223772], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d827feb3-f998-4c80-9b42-c72d5065d7ca", 1, 0, 0.0, 626.0, 626, 626, 626.0, 626.0, 626.0, 626.0, 1.5974440894568689, 0.2886007388178914, 1.1013628194888179], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9ec7331c-c267-4570-88b0-939b0c1a0201", 3, 0, 0.0, 332.0, 246, 385, 365.0, 385.0, 385.0, 385.0, 0.02052587286274349, 0.028296572777903213, 0.013162750501173395], "isController": false}, {"data": ["goToProfile", 16, 2, 12.5, 192.8125, 82, 397, 174.0, 374.6, 397.0, 397.0, 0.07788199903621026, 0.15836893798159066, 0.05033998839071452], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 93.5, 81, 246, 83.0, 120.20000000000007, 239.89999999999992, 246.0, 0.10128428473038123, 0.07527084050763684, 0.050839963233804644], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 83.8, 81, 89, 83.0, 89.0, 89.0, 89.0, 0.10128479765829548, 0.034707847166304574, 0.05733866914307997], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 485.375, 404, 569, 485.0, 569.0, 569.0, 569.0, 0.05997091410665827, 17.63343996911498, 0.03420216195145354], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 688.625, 558, 737, 727.0, 737.0, 737.0, 737.0, 0.05982739795689436, 53.83279784696152, 0.03406188770397404], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 151.25, 82, 292, 89.5, 292.0, 292.0, 292.0, 0.06004157879331437, 0.10624544997410706, 0.033245678882626216], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 84.14285714285715, 83, 87, 84.0, 86.0, 87.0, 87.0, 0.0629567172568859, 0.046787169758291176, 0.0316013209668353], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 106.85714285714285, 81, 248, 83.0, 247.5, 248.0, 248.0, 0.06291116942876658, 0.016833652757306684, 0.03587902631484344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 107.42857142857143, 82, 244, 84.0, 243.5, 244.0, 244.0, 0.06295756660011152, 0.016969031622686308, 0.037012163177018685], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 118.21428571428571, 81, 250, 83.5, 246.5, 250.0, 250.0, 0.06295756660011152, 0.016969031622686308, 0.03707364517565161], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 83.125, 81, 84, 83.5, 84.0, 84.0, 84.0, 0.06011602392617753, 0.04467606856232529, 0.03375655640385945], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 144.5, 81, 813, 84.0, 247.8, 784.7499999999995, 813.0, 0.10128531059140493, 4.582769604088382, 0.05910947422795272], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 511.1428571428574, 83, 740, 646.5, 737.5, 740.0, 740.0, 0.08124466831864159, 52.22346754057882, 0.042775861918883], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 107.90000000000002, 81, 405, 84.0, 228.50000000000034, 396.9499999999999, 405.0, 0.10128428473038123, 1.514981449150225, 0.059207785976177936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 414.92857142857144, 83, 653, 564.0, 615.5, 653.0, 653.0, 0.08124466831864159, 17.06956375240107, 0.04285520241528793], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 571.4285714285714, 86, 1118, 614.0, 1102.5, 1118.0, 1118.0, 0.07312614259597806, 0.014404870723426484, 0.04967231979629146], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 238.57142857142856, 168, 336, 173.0, 333.5, 336.0, 336.0, 0.06288686652711771, 0.09746236052591388, 0.14143403673042196], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e51d0dd2-a914-4385-a80b-8dfeb1a7eb88", 1, 0, 0.0, 180.0, 180, 180, 180.0, 180.0, 180.0, 180.0, 5.555555555555555, 1.0036892361111112, 3.830295138888889], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=62c5083f-f105-4230-9127-046d702ed27b", 1, 0, 0.0, 351.0, 351, 351, 351.0, 351.0, 351.0, 351.0, 2.849002849002849, 0.5147124287749288, 1.9642539173789175], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 511.1304347826087, 99, 1632, 436.0, 1132.000000000001, 1577.1999999999991, 1632.0, 0.10312976414671329, 0.06334826332840103, 0.04662996171867994], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 83.64285714285714, 82, 85, 83.5, 85.0, 85.0, 85.0, 0.08124372537299573, 0.060377417000829846, 0.04078054183761701], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 141.92857142857142, 81, 251, 84.5, 250.0, 251.0, 251.0, 0.0812451397996727, 0.10890113046808807, 0.04146131715781288], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eac136d7-384e-43a0-b0a5-c4264c703223", 1, 0, 0.0, 351.0, 351, 351, 351.0, 351.0, 351.0, 351.0, 2.849002849002849, 0.5147124287749288, 1.9642539173789175], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f206712b-5c16-43de-aef0-780f409297ef", 2, 0, 0.0, 181.5, 170, 193, 181.5, 193.0, 193.0, 193.0, 0.039386360503357684, 0.03480923462454952, 0.02448185396522184], "isController": false}, {"data": ["login", 23, 0, 0.0, 2300.0, 1349, 3465, 2167.0, 3426.4, 3461.6, 3465.0, 0.09777955387015726, 40.81915253025852, 0.20392467334189257], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 86.85, 84, 94, 86.0, 89.9, 93.8, 94.0, 0.10177443731457969, 0.08239356302127594, 0.036177632014167], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9f2dce78-cf59-45a7-8685-4bb4fcf5e386", 1, 0, 0.0, 303.0, 303, 303, 303.0, 303.0, 303.0, 303.0, 3.3003300330033003, 1.0539139851485149, 1.969239892739274], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9ec7331c-c267-4570-88b0-939b0c1a0201", 1, 0, 0.0, 838.0, 838, 838, 838.0, 838.0, 838.0, 838.0, 1.1933174224343677, 0.2155895733890215, 0.8227364260143198], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0f9516b3-4eda-46ef-8795-d63d74a5a100", 3, 0, 0.0, 307.0, 179, 401, 341.0, 401.0, 401.0, 401.0, 0.048073841420421766, 0.030906847918402664, 0.030828602733799115], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 597.5714285714286, 168, 825, 735.5, 821.5, 825.0, 825.0, 0.08120461242198557, 69.42806304523097, 0.16779038986914457], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f387e98a-9138-4599-81ca-4fd927d4e2b5", 1, 0, 0.0, 1087.0, 1087, 1087, 1087.0, 1087.0, 1087.0, 1087.0, 0.9199632014719411, 0.16620428932842687, 0.6342715041398345], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 276.26666666666665, 164, 489, 329.0, 396.6, 489.0, 489.0, 0.09885721064494445, 0.1532093684507098, 0.22233218370635452], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 4, 33.333333333333336, 541.9166666666667, 81, 822, 732.5, 820.5, 822.0, 822.0, 0.0889448912278101, 70.94727467294223, 0.15335176314716675], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/52102bd8-21fc-4419-808b-baf882374861", 3, 0, 0.0, 642.6666666666666, 165, 1241, 522.0, 1241.0, 1241.0, 1241.0, 0.07501500300060011, 0.03320976695339068, 0.04810532418983797], "isController": false}, {"data": ["register", 23, 8, 34.78260869565217, 969.6086956521739, 264, 1691, 934.0, 1505.0, 1658.1999999999996, 1691.0, 0.10356395073958169, 0.032310967647522344, 0.04672514183758471], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 239.54999999999998, 165, 895, 169.0, 479.10000000000025, 874.7999999999997, 895.0, 0.10124121732439711, 6.205043560615648, 0.22639869487415717], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 113.89473684210527, 84, 266, 87.0, 250.0, 266.0, 266.0, 0.08990252673417243, 0.069797371829753, 0.031957538800037856], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 20, 0, 0.0, 298.25, 165, 988, 248.5, 619.3000000000006, 971.1499999999997, 988.0, 0.10062589305480087, 12.1787105640836, 0.2237353840890338], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 83.22222222222223, 81, 88, 83.0, 88.0, 88.0, 88.0, 0.06732898437967562, 0.05003648155559878, 0.03379599411245437], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 83.0, 80, 88, 83.0, 88.0, 88.0, 88.0, 0.06732898437967562, 0.01801576339846789, 0.038398561404033756], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 83.55555555555556, 81, 86, 83.0, 86.0, 86.0, 86.0, 0.06732948807145903, 0.018147401081760443, 0.039582374823260096], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 83.77777777777777, 82, 86, 84.0, 86.0, 86.0, 86.0, 0.06732898437967562, 0.018147265321084446, 0.039647829668891015], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 89.0, 86, 92, 89.0, 92.0, 92.0, 92.0, 0.026720463867252738, 0.007880449304599928, 0.01651763049606541], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 780.7500000000001, 644, 1202, 662.5, 1057.6, 1073.6, 1202.0, 0.261824166370556, 313.23272778702477, 0.5170004535168596], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/55bcdf08-a6d5-46be-be3c-a9cec81b3df4", 3, 0, 0.0, 445.66666666666663, 191, 936, 210.0, 936.0, 936.0, 936.0, 0.020906506104699782, 0.024710782443413057, 0.013406841479901878], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, 34.78260869565217, 969.6086956521739, 264, 1691, 934.0, 1505.0, 1658.1999999999996, 1691.0, 0.09806638668002644, 0.0305957799475558, 0.044244795552902554], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 83.83333333333333, 82, 86, 83.5, 86.0, 86.0, 86.0, 0.04496133325340207, 0.012118484353456027, 0.026476253859181103], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1e942206-0c8f-48a1-a7e5-f7371c4baf3c", 1, 0, 0.0, 1118.0, 1118, 1118, 1118.0, 1118.0, 1118.0, 1118.0, 0.8944543828264758, 0.16159576252236135, 0.6166843694096601], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 110.5, 82, 247, 83.0, 247.0, 247.0, 247.0, 0.04496133325340207, 0.012118484353456027, 0.02643234630717583], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/09aa91ee-0668-4b68-8895-d5c1ba563557", 2, 0, 0.0, 499.5, 179, 820, 499.5, 820.0, 820.0, 820.0, 0.02692732315480518, 0.030635089331394565, 0.016737540222688963], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 176.8947368421053, 81, 733, 84.0, 733.0, 733.0, 733.0, 0.09063328817569502, 8.606277294333989, 0.05246258693640406], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 164.26315789473685, 82, 575, 83.0, 399.0, 575.0, 575.0, 0.09063242351100469, 2.8270086410860626, 0.0525505946560261], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 118.26315789473686, 82, 249, 85.0, 247.0, 249.0, 249.0, 0.09063199118484634, 0.06735443876139459, 0.04549301120020607], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 83.16666666666667, 83, 84, 83.0, 84.0, 84.0, 84.0, 0.04496133325340207, 0.012030669249445475, 0.02564201037108087], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 116.84210526315789, 81, 245, 83.0, 244.0, 245.0, 245.0, 0.09063285584128757, 0.03858045395135401, 0.05088781441253214], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 85.0, 83, 90, 84.0, 90.0, 90.0, 90.0, 0.04496032251538017, 0.03341289593184015, 0.02256797438760294], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 121.83333333333334, 87, 247, 92.0, 247.0, 247.0, 247.0, 0.04595482640564325, 0.03617147469037936, 0.016335504698881002], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 434.9285714285714, 81, 936, 404.0, 840.5, 936.0, 936.0, 0.0738606987222099, 0.014261050088105263, 0.050264019024405686], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d827feb3-f998-4c80-9b42-c72d5065d7ca", 3, 0, 0.0, 564.0, 242, 1043, 407.0, 1043.0, 1043.0, 1043.0, 0.020427200860666066, 0.02816054545733098, 0.01309947451025786], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1252.5217391304348, 771, 2117, 1159.0, 1853.6, 2064.7999999999993, 2117.0, 0.09968102073365231, 0.05159271580940989, 0.045849375747607654], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 196.66666666666666, 167, 337, 169.0, 337.0, 337.0, 337.0, 0.0449323767729567, 0.06963640814324443, 0.10105396846496024], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=44502669-8fad-4105-b801-544007a230a5", 1, 0, 0.0, 356.0, 356, 356, 356.0, 356.0, 356.0, 356.0, 2.8089887640449436, 0.5074833216292135, 1.9366660814606742], "isController": false}, {"data": ["addBook", 61, 8, 13.114754098360656, 824.4426229508198, 429, 2440, 695.0, 1272.6000000000001, 1565.6999999999998, 2440.0, 0.28756358219368583, 85.71447525391628, 1.0464830252042407], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 153.01785714285714, 82, 341, 84.5, 335.0, 337.0, 341.0, 0.26271468715841223, 0.19524011418706225, 0.1269958692806778], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 490.39285714285734, 400, 700, 415.0, 601.3000000000003, 657.15, 700.0, 0.26248195436563737, 77.17840980463842, 0.13200996728349926], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 123.51785714285717, 81, 369, 85.0, 251.3, 264.6999999999999, 369.0, 0.2630750656513222, 0.4655195497658162, 0.12794080341245942], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 623.4285714285712, 560, 823, 571.5, 730.6, 734.15, 823.0, 0.26228893936910147, 236.0080486990937, 0.13165675276925598], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 20, 0, 0.0, 88.05, 84, 107, 86.5, 93.0, 106.29999999999998, 107.0, 0.10102540789008435, 0.07547308304288529, 0.03591137546092842], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e51d0dd2-a914-4385-a80b-8dfeb1a7eb88", 3, 0, 0.0, 249.33333333333334, 183, 373, 192.0, 373.0, 373.0, 373.0, 0.09583133684714902, 0.04336118431560454, 0.061454340360964706], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 8, 4.49438202247191, 149.0449438202248, 83, 1907, 89.0, 243.49999999999997, 351.7999999999997, 1367.4300000000055, 0.7222648277317233, 1.5342342242956903, 0.34844427757286556], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 106.22222222222223, 84, 253, 87.0, 253.0, 253.0, 253.0, 0.06847074397267257, 0.05302470700227475, 0.02433920977153595], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6359f1c5-14c3-4444-9ee6-4ed4eadff325", 3, 0, 0.0, 336.6666666666667, 156, 457, 397.0, 457.0, 457.0, 457.0, 0.02487685954525101, 0.029403605797137505, 0.015952934018276202], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6359f1c5-14c3-4444-9ee6-4ed4eadff325", 1, 0, 0.0, 788.0, 788, 788, 788.0, 788.0, 788.0, 788.0, 1.2690355329949237, 0.22926911484771573, 0.8749405139593909], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 88.73333333333332, 83, 114, 86.0, 103.2, 114.0, 114.0, 0.098322616168171, 0.0797911074567872, 0.03495061746602954], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eac136d7-384e-43a0-b0a5-c4264c703223", 3, 0, 0.0, 300.3333333333333, 158, 423, 320.0, 423.0, 423.0, 423.0, 0.03291964315106825, 0.027443751988895107, 0.021110578452996236], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0f9516b3-4eda-46ef-8795-d63d74a5a100", 1, 0, 0.0, 602.0, 602, 602, 602.0, 602.0, 602.0, 602.0, 1.6611295681063123, 0.3001064161129568, 1.1452709717607974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 168.22222222222223, 166, 174, 167.0, 174.0, 174.0, 174.0, 0.0672872042166648, 0.10428202450375687, 0.15133049932712797], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 318.05263157894734, 165, 980, 169.0, 820.0, 980.0, 980.0, 0.09059569050604846, 11.534462086597559, 0.20131185688980224], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/62c5083f-f105-4230-9127-046d702ed27b", 3, 0, 0.0, 346.0, 160, 502, 376.0, 502.0, 502.0, 502.0, 0.028229183329726272, 0.02831188601526258, 0.018102698945169516], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 97.57142857142858, 83, 250, 86.0, 169.5, 250.0, 250.0, 0.06393015174278159, 0.053004588700802324, 0.022725171127316895], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f387e98a-9138-4599-81ca-4fd927d4e2b5", 3, 0, 0.0, 246.66666666666669, 178, 384, 178.0, 384.0, 384.0, 384.0, 0.017489346073350318, 0.02411047546244746, 0.011215498621256552], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 88.07142857142857, 84, 110, 85.0, 101.5, 110.0, 110.0, 0.07891858983754044, 0.06126980363363736, 0.028053092481313206], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=55bcdf08-a6d5-46be-be3c-a9cec81b3df4", 1, 0, 0.0, 769.0, 769, 769, 769.0, 769.0, 769.0, 769.0, 1.3003901170351106, 0.2349337613784135, 0.8965580299089727], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=52102bd8-21fc-4419-808b-baf882374861", 1, 0, 0.0, 756.0, 756, 756, 756.0, 756.0, 756.0, 756.0, 1.3227513227513228, 0.23897362764550265, 0.911975033068783], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 20, 0, 0.0, 92.55000000000001, 82, 268, 83.0, 85.0, 258.8499999999999, 268.0, 0.10075211453500381, 0.07487535074329872, 0.05057283874120308], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 20, 0, 0.0, 123.55, 81, 249, 83.0, 249.0, 249.0, 249.0, 0.10066843843118306, 0.04205659957115245, 0.0565670112043972], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 20, 0, 0.0, 187.74999999999997, 82, 719, 84.0, 529.8000000000006, 711.0999999999999, 719.0, 0.10066945185483464, 9.08267518057583, 0.05831749886746867], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 20, 0, 0.0, 164.3, 81, 574, 84.0, 536.3000000000006, 573.7, 574.0, 0.10075262208698982, 2.9869020017027195, 0.058464070355556], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 33.333333333333336, 0.5956813104988831], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 8.333333333333334, 0.14892032762472077], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 8.333333333333334, 0.14892032762472077], "isController": false}, {"data": ["401/Unauthorized", 12, 50.0, 0.8935219657483247], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1343, 24, "401/Unauthorized", 12, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
