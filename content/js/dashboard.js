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

    var data = {"OkPercent": 98.79789631855748, "KoPercent": 1.2021036814425243};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7470892626131953, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5384615384615384, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5384615384615384, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e7a885ea-5d4d-40dc-b212-4d5dcbff11c7"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1fa6d0f8-88bd-42b0-9c38-326cff84f7fc"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cd03eab6-79b2-4685-9f4d-860bbcda8c45"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3094df11-ff42-40fa-b9e4-19c3adc19e7c"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4a415132-a77e-4ed3-a9c9-d04fa4778b1f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/598596dd-3b4e-48f6-9bc9-70ecea0da8e1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2d3a57cc-8bb5-4584-9108-b2feab6018e5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.868421052631579, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/20eedeb8-e1c0-4bfe-a09d-3ed3456ad05e"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.868421052631579, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/8b3af40a-c21e-4e96-8381-bec40236914d"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2d3a57cc-8bb5-4584-9108-b2feab6018e5"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4312b11a-86b1-41c2-90c4-c2df1a8ac20c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/affa45bd-5114-43d4-addf-e34e3e510de7"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=48dc37d7-0f47-49f2-876b-5b7b9b9b4caf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9c700a28-6519-4056-bbda-5cc216b54a2f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a6da5d45-d73b-438d-ba69-58c48f8fc6b3"], "isController": false}, {"data": [0.4, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/512ebe5e-a032-4c35-adf3-ffe9927ce04a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1fa6d0f8-88bd-42b0-9c38-326cff84f7fc"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/74128b83-8361-43d4-96e1-ca95193f6b29"], "isController": false}, {"data": [0.1956521739130435, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.6842105263157895, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3094df11-ff42-40fa-b9e4-19c3adc19e7c"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=598596dd-3b4e-48f6-9bc9-70ecea0da8e1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/48dc37d7-0f47-49f2-876b-5b7b9b9b4caf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.288135593220339, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.1956521739130435, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8b619b6e-a6f6-4608-a915-8d82f0314f3e"], "isController": false}, {"data": [0.23809523809523808, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cd03eab6-79b2-4685-9f4d-860bbcda8c45"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/908e97b0-65c5-422c-86df-01fc9abac084"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8b3af40a-c21e-4e96-8381-bec40236914d"], "isController": false}, {"data": [0.288135593220339, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4a415132-a77e-4ed3-a9c9-d04fa4778b1f"], "isController": false}, {"data": [0.9067796610169492, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9830508474576272, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4576271186440678, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9548022598870056, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4312b11a-86b1-41c2-90c4-c2df1a8ac20c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=908e97b0-65c5-422c-86df-01fc9abac084"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=affa45bd-5114-43d4-addf-e34e3e510de7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=74128b83-8361-43d4-96e1-ca95193f6b29"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1331, 16, 1.2021036814425243, 440.73328324567984, 124, 2732, 147.0, 1249.1999999999998, 1505.0, 1918.9200000000012, 5.187769181299086, 749.4437630327598, 3.782735673708417], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 59, 0, 0.0, 2063.6271186440677, 1553, 2783, 2054.0, 2486.0, 2627.0, 2783.0, 0.2547121752419766, 306.50482853607417, 1.2524177757259298], "isController": true}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 571.3846153846155, 145, 872, 589.0, 813.1999999999999, 872.0, 872.0, 0.06897283531409168, 0.013067119190365026, 0.04662609262255943], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 571.3846153846155, 145, 872, 589.0, 813.1999999999999, 872.0, 872.0, 0.06899846080356668, 0.013071974019425722, 0.0466434156228438], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 202.53333333333333, 126, 394, 131.0, 392.2, 394.0, 394.0, 0.1005476495311128, 0.0369722086296696, 0.05678061927297347], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 182.8666666666667, 128, 392, 132.0, 391.4, 392.0, 392.0, 0.10071913462119533, 0.07485084125657192, 0.050556284370404686], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 277.4, 127, 1039, 132.0, 652.6000000000003, 1039.0, 1039.0, 0.10054495364877637, 1.9961969918625615, 0.058631585275526685], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 236.8, 127, 1155, 132.0, 697.2000000000003, 1155.0, 1155.0, 0.10072048721857017, 6.067235594032647, 0.05863558572320667], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e7a885ea-5d4d-40dc-b212-4d5dcbff11c7", 1, 0, 0.0, 492.0, 492, 492, 492.0, 492.0, 492.0, 492.0, 2.032520325203252, 0.6490567835365854, 1.212763592479675], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1fa6d0f8-88bd-42b0-9c38-326cff84f7fc", 3, 0, 0.0, 493.33333333333337, 254, 872, 354.0, 872.0, 872.0, 872.0, 0.04616876221548501, 0.030223105734160267, 0.029606921082195786], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cd03eab6-79b2-4685-9f4d-860bbcda8c45", 3, 0, 0.0, 420.33333333333337, 239, 690, 332.0, 690.0, 690.0, 690.0, 0.022946481157114555, 0.0271219638937119, 0.014715028606613176], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3094df11-ff42-40fa-b9e4-19c3adc19e7c", 3, 0, 0.0, 529.0, 310, 898, 379.0, 898.0, 898.0, 898.0, 0.06206297323017088, 0.02808187916339112, 0.03979949780710828], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 278.92857142857144, 131, 416, 257.0, 399.5, 416.0, 416.0, 0.06994124935054555, 0.11286905717946924, 0.04521104615872667], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/4a415132-a77e-4ed3-a9c9-d04fa4778b1f", 3, 0, 0.0, 420.3333333333333, 300, 484, 477.0, 484.0, 484.0, 484.0, 0.029447563704896148, 0.029533835864187834, 0.018884017089402804], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/598596dd-3b4e-48f6-9bc9-70ecea0da8e1", 3, 0, 0.0, 356.6666666666667, 260, 501, 309.0, 501.0, 501.0, 501.0, 0.07640781397244226, 0.03457254603570792, 0.04899850049665079], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 144.52631578947367, 127, 380, 132.0, 135.0, 380.0, 380.0, 0.10793553408206509, 0.0802138099965347, 0.054178578631036575], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 165.1052631578947, 126, 526, 132.0, 379.0, 526.0, 526.0, 0.1079336946271743, 0.07154157719531455, 0.05917047630003295], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 931.0, 756, 1036, 1001.0, 1036.0, 1036.0, 1036.0, 0.32082130253448826, 94.33211521495026, 0.18296839910170035], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 1202.3333333333333, 1018, 1295, 1294.0, 1295.0, 1295.0, 1295.0, 0.3110419906687403, 279.87612995723174, 0.1770873833592535], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 218.66666666666669, 130, 394, 132.0, 394.0, 394.0, 394.0, 0.34309240622140896, 0.6071127344464776, 0.1899740178979872], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 130.21428571428572, 126, 134, 130.5, 133.5, 134.0, 134.0, 0.09610632105003021, 0.07142276398346971, 0.048240868183315945], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 156.49999999999997, 126, 508, 130.0, 320.0, 508.0, 508.0, 0.09610961988645335, 0.0257168318836799, 0.05481251759149292], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 205.57142857142856, 127, 392, 131.5, 392.0, 392.0, 392.0, 0.09593509305704026, 0.025857505550530385, 0.056399341816736566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 167.64285714285717, 126, 393, 128.0, 390.0, 393.0, 393.0, 0.09593575045740795, 0.025857682740473235, 0.05649341555255565], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2d3a57cc-8bb5-4584-9108-b2feab6018e5", 3, 0, 0.0, 354.0, 267, 522, 273.0, 522.0, 522.0, 522.0, 0.07834125450462213, 0.03631443568183006, 0.050238369587925005], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 134.33333333333334, 131, 140, 132.0, 140.0, 140.0, 140.0, 0.3536901674133459, 0.2628498216812073, 0.1986053186158925], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 1013.0666666666667, 128, 1706, 1383.0, 1656.2, 1706.0, 1706.0, 0.07399770113808464, 44.395489269716684, 0.03926310314292902], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 478.52631578947364, 127, 1430, 132.0, 1429.0, 1430.0, 1430.0, 0.10793430777183824, 25.579193824808417, 0.061012619082785616], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/20eedeb8-e1c0-4bfe-a09d-3ed3456ad05e", 1, 0, 0.0, 344.0, 344, 344, 344.0, 344.0, 344.0, 344.0, 2.9069767441860463, 0.9283021438953489, 1.7345339752906979], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 713.3333333333334, 128, 1052, 1008.0, 1046.0, 1052.0, 1052.0, 0.07399733609590055, 14.51176403482808, 0.03933517247545755], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 373.15789473684214, 126, 1041, 134.0, 1015.0, 1041.0, 1041.0, 0.1079336946271743, 8.373038464870422, 0.06111767648579252], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 508.6923076923077, 133, 955, 481.0, 907.8, 955.0, 955.0, 0.06913827122411968, 0.01309846154050705, 0.04728845849576395], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/8b3af40a-c21e-4e96-8381-bec40236914d", 3, 0, 0.0, 560.3333333333334, 416, 680, 585.0, 680.0, 680.0, 680.0, 0.033463095782534494, 0.027896806086937124, 0.021459081605336248], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 364.57142857142856, 259, 641, 264.0, 582.5, 641.0, 641.0, 0.095847082825572, 0.14854425824627224, 0.21556233569071515], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2d3a57cc-8bb5-4584-9108-b2feab6018e5", 1, 0, 0.0, 474.0, 474, 474, 474.0, 474.0, 474.0, 474.0, 2.109704641350211, 0.3811478111814346, 1.4545424578059072], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 636.3809523809523, 237, 1567, 626.0, 1035.0, 1516.5999999999992, 1567.0, 0.12785076771341947, 0.07853333290209066, 0.05780752485479806], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 132.6, 129, 146, 131.0, 140.6, 146.0, 146.0, 0.07399952640303102, 0.054993788664752546, 0.037144293526521426], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 219.66666666666666, 128, 406, 134.0, 400.0, 406.0, 406.0, 0.07399697105731805, 0.09389329205124536, 0.03805833797869874], "isController": false}, {"data": ["login", 21, 0, 0.0, 2759.0952380952385, 1809, 4048, 2775.0, 3576.6000000000004, 4005.2999999999993, 4048.0, 0.12245254963701567, 21.100087876104258, 0.2137623819207557], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 151.42105263157896, 130, 397, 136.0, 172.0, 397.0, 397.0, 0.10954481247657759, 0.08868422806941682, 0.03893975756003344], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4312b11a-86b1-41c2-90c4-c2df1a8ac20c", 1, 0, 0.0, 481.0, 481, 481, 481.0, 481.0, 481.0, 481.0, 2.079002079002079, 0.37560096153846156, 1.4333744802494803], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/affa45bd-5114-43d4-addf-e34e3e510de7", 3, 0, 0.0, 357.6666666666667, 249, 472, 352.0, 472.0, 472.0, 472.0, 0.041248453183005636, 0.026518780936339886, 0.026451644782070672], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=48dc37d7-0f47-49f2-876b-5b7b9b9b4caf", 1, 0, 0.0, 514.0, 514, 514, 514.0, 514.0, 514.0, 514.0, 1.9455252918287937, 0.3514865029182879, 1.3413484922178989], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9c700a28-6519-4056-bbda-5cc216b54a2f", 1, 0, 0.0, 257.0, 257, 257, 257.0, 257.0, 257.0, 257.0, 3.8910505836575875, 1.2425522859922178, 2.321710846303502], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a6da5d45-d73b-438d-ba69-58c48f8fc6b3", 1, 0, 0.0, 224.0, 224, 224, 224.0, 224.0, 224.0, 224.0, 4.464285714285714, 1.4256068638392856, 2.6637486049107144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 1147.0, 259, 1837, 1513.0, 1788.4, 1837.0, 1837.0, 0.07394845299836326, 59.01690750496687, 0.15369820064926742], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/512ebe5e-a032-4c35-adf3-ffe9927ce04a", 1, 0, 0.0, 263.0, 263, 263, 263.0, 263.0, 263.0, 263.0, 3.802281368821293, 1.2142050855513307, 2.268744058935361], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1fa6d0f8-88bd-42b0-9c38-326cff84f7fc", 1, 0, 0.0, 565.0, 565, 565, 565.0, 565.0, 565.0, 565.0, 1.7699115044247788, 0.3197594026548673, 1.2202710176991152], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 486.8666666666667, 260, 1286, 270.0, 985.4000000000002, 1286.0, 1286.0, 0.10045808888531704, 8.157497668535187, 0.2242190534671435], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 2, 40.0, 855.2, 131, 1436, 1150.0, 1436.0, 1436.0, 1436.0, 0.07033239087929556, 50.49272235585377, 0.11379561055548523], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/74128b83-8361-43d4-96e1-ca95193f6b29", 3, 0, 0.0, 436.3333333333333, 247, 535, 527.0, 535.0, 535.0, 535.0, 0.057498802108289414, 0.026016710589362724, 0.03687260421657882], "isController": false}, {"data": ["register", 23, 5, 21.73913043478261, 1364.8260869565217, 295, 2271, 1474.0, 2123.8, 2243.3999999999996, 2271.0, 0.09077096118554769, 0.028735915701403006, 0.040953304753635775], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 154.46666666666667, 129, 401, 137.0, 246.8000000000001, 401.0, 401.0, 0.07879020270092815, 0.061170128073474495, 0.028007454866345555], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 652.3684210526316, 259, 1793, 267.0, 1564.0, 1793.0, 1793.0, 0.1078540450943439, 34.078674115454916, 0.23530430983345066], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3094df11-ff42-40fa-b9e4-19c3adc19e7c", 1, 0, 0.0, 271.0, 271, 271, 271.0, 271.0, 271.0, 271.0, 3.6900369003690034, 0.6666570571955719, 2.5441074723247232], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 519.25, 261, 1637, 274.5, 1396.2000000000003, 1637.0, 1637.0, 0.0765498961792033, 11.551343824456735, 0.1697142595711292], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=598596dd-3b4e-48f6-9bc9-70ecea0da8e1", 1, 0, 0.0, 242.0, 242, 242, 242.0, 242.0, 242.0, 242.0, 4.132231404958678, 0.7465457128099173, 2.848979855371901], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 14, 0, 0.0, 131.5, 126, 142, 131.0, 138.0, 142.0, 142.0, 0.06941999593397166, 0.05159044619702387, 0.03484558389654437], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 14, 0, 0.0, 149.42857142857142, 129, 379, 131.0, 260.0, 379.0, 379.0, 0.06942137285723496, 0.01857564078406482, 0.039591876707641804], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 14, 0, 0.0, 147.7857142857143, 126, 378, 131.0, 256.0, 378.0, 378.0, 0.06942068438877567, 0.01871104383916219, 0.04081176953324507], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/48dc37d7-0f47-49f2-876b-5b7b9b9b4caf", 3, 0, 0.0, 336.6666666666667, 244, 449, 317.0, 449.0, 449.0, 449.0, 0.01739080026665894, 0.02397462211240254, 0.011152303556418655], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 14, 0, 0.0, 148.99999999999997, 126, 388, 130.5, 266.0, 388.0, 388.0, 0.06942137285723496, 0.018711229402926608, 0.04087996858682878], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 133.0, 133, 133, 133.0, 133.0, 133.0, 133.0, 7.518796992481203, 2.217457706766917, 4.647850093984962], "isController": false}, {"data": ["https://demoqa.com/books", 59, 0, 0.0, 1433.1016949152547, 1007, 2218, 1291.0, 1925.0, 2084.0, 2218.0, 0.25088340725180613, 300.14377625771255, 0.49539672799135936], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, 21.73913043478261, 1364.8260869565217, 295, 2271, 1474.0, 2123.8, 2243.3999999999996, 2271.0, 0.08965708115525098, 0.02838328792007266, 0.04045075341184175], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 10, 0, 0.0, 155.20000000000002, 127, 379, 131.0, 354.6000000000001, 379.0, 379.0, 0.0434529448060695, 0.011711926529760922, 0.025588013396542885], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 10, 0, 0.0, 130.5, 126, 140, 130.5, 139.2, 140.0, 140.0, 0.0434529448060695, 0.011711926529760922, 0.025545578880130707], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 248.99999999999997, 124, 392, 132.0, 391.4, 392.0, 392.0, 0.08048851160644337, 0.02169416914392419, 0.04731844139363175], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 163.93333333333334, 125, 392, 131.0, 384.2, 392.0, 392.0, 0.08048721594720039, 0.021693819923268853, 0.04739628048453304], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 10, 0, 0.0, 154.3, 126, 379, 129.0, 354.80000000000007, 379.0, 379.0, 0.04345218955583172, 0.011626855408494034, 0.024781326856060278], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 148.20000000000002, 127, 380, 133.0, 233.00000000000009, 380.0, 380.0, 0.08048678407005569, 0.05981488542706287, 0.040400592785164675], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 10, 0, 0.0, 158.0, 127, 393, 132.0, 368.2000000000001, 393.0, 393.0, 0.043449168817400526, 0.03228986081058769, 0.021809446066546747], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 199.13333333333335, 127, 392, 131.0, 391.4, 392.0, 392.0, 0.08048678407005569, 0.021536502768745372, 0.045902619039953636], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 163.0, 131, 385, 136.0, 362.0000000000001, 385.0, 385.0, 0.045617940623688485, 0.03590630873309855, 0.016215752331076767], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 552.9230769230769, 132, 898, 503.0, 887.6, 898.0, 898.0, 0.07129186340478971, 0.01335651347142019, 0.04852045390981031], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/8b619b6e-a6f6-4608-a915-8d82f0314f3e", 2, 0, 0.0, 317.5, 252, 383, 317.5, 383.0, 383.0, 383.0, 0.015758826912924604, 0.026654578333188877, 0.009795403642652842], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1591.5714285714284, 1171, 2732, 1524.0, 2183.8, 2685.399999999999, 2732.0, 0.1223106223863385, 0.0633053026023041, 0.05625810853902874], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 0, 0.0, 315.90000000000003, 255, 772, 262.5, 722.8000000000002, 772.0, 772.0, 0.043424640878219935, 0.06729971198606938, 0.09766303510013723], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cd03eab6-79b2-4685-9f4d-860bbcda8c45", 1, 0, 0.0, 955.0, 955, 955, 955.0, 955.0, 955.0, 955.0, 1.0471204188481678, 0.18917702879581152, 0.721940445026178], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/908e97b0-65c5-422c-86df-01fc9abac084", 3, 0, 0.0, 648.6666666666666, 242, 1254, 450.0, 1254.0, 1254.0, 1254.0, 0.06704210244033253, 0.030334805466166088, 0.04299249407794762], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8b3af40a-c21e-4e96-8381-bec40236914d", 1, 0, 0.0, 715.0, 715, 715, 715.0, 715.0, 715.0, 715.0, 1.3986013986013985, 0.2526770104895105, 0.9642701048951049], "isController": false}, {"data": ["addBook", 59, 7, 11.864406779661017, 1344.1525423728815, 662, 2544, 1080.0, 2313.0, 2413.0, 2544.0, 0.27988482028073874, 103.25146331729925, 1.0140172929682498], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4a415132-a77e-4ed3-a9c9-d04fa4778b1f", 1, 0, 0.0, 803.0, 803, 803, 803.0, 803.0, 803.0, 803.0, 1.2453300124533002, 0.22498637920298878, 0.8585966687422166], "isController": false}, {"data": ["https://demoqa.com/books-0", 59, 0, 0.0, 246.69491525423732, 126, 574, 134.0, 523.0, 537.0, 574.0, 0.2521216679343971, 0.1873677629864025, 0.1218752203393814], "isController": false}, {"data": ["https://demoqa.com/books-3", 59, 0, 0.0, 844.4067796610167, 621, 1184, 773.0, 1040.0, 1160.0, 1184.0, 0.25204089043056277, 74.10839033177552, 0.12675884626146466], "isController": false}, {"data": ["https://demoqa.com/books-1", 59, 0, 0.0, 214.59322033898303, 127, 522, 134.0, 392.0, 397.0, 522.0, 0.2525771430528443, 0.4469431476677283, 0.12283536839874652], "isController": false}, {"data": ["https://demoqa.com/books-2", 59, 0, 0.0, 1185.0169491525423, 880, 1678, 1154.0, 1489.0, 1559.0, 1678.0, 0.25147582209151165, 226.27838676528566, 0.1262290747607783], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 152.625, 132, 388, 137.0, 216.50000000000017, 388.0, 388.0, 0.07881191044996674, 0.05887803856857868, 0.02801517129276162], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 7, 3.9548022598870056, 193.95480225988703, 128, 706, 140.0, 320.0, 402.1, 611.6199999999999, 0.7175084216030841, 1.6035787506029908, 0.3430737571801514], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 14, 0, 0.0, 153.07142857142856, 131, 384, 134.5, 265.5, 384.0, 384.0, 0.06762109005197164, 0.05236672305782569, 0.024037184354411795], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 136.13333333333335, 133, 161, 134.0, 146.0, 161.0, 161.0, 0.09715969815720439, 0.07884737223499692, 0.03453723645431875], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4312b11a-86b1-41c2-90c4-c2df1a8ac20c", 3, 0, 0.0, 338.6666666666667, 225, 503, 288.0, 503.0, 503.0, 503.0, 0.0629656837023822, 0.028490332143981528, 0.040378384405499], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=908e97b0-65c5-422c-86df-01fc9abac084", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 0.7314334514170041, 2.791308198380567], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 14, 0, 0.0, 301.5, 258, 522, 263.0, 517.0, 522.0, 522.0, 0.06937424431626726, 0.10751652903312124, 0.15602430142613624], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 417.59999999999997, 259, 772, 512.0, 624.4000000000001, 772.0, 772.0, 0.08042895442359249, 0.12464917057640751, 0.1808866035522788], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=affa45bd-5114-43d4-addf-e34e3e510de7", 1, 0, 0.0, 837.0, 837, 837, 837.0, 837.0, 837.0, 837.0, 1.194743130227001, 0.21584714755077658, 0.823719384707288], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 171.42857142857144, 131, 394, 135.5, 386.5, 394.0, 394.0, 0.09437269123951789, 0.07824454576401434, 0.03354654258904737], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 157.73333333333332, 126, 391, 140.0, 253.00000000000009, 391.0, 391.0, 0.0722411119351949, 0.05608562889499995, 0.025679457758213814], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=74128b83-8361-43d4-96e1-ca95193f6b29", 1, 0, 0.0, 376.0, 376, 376, 376.0, 376.0, 376.0, 376.0, 2.6595744680851063, 0.4804895279255319, 1.8336519281914894], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 147.625, 129, 381, 132.5, 209.50000000000017, 381.0, 381.0, 0.07659753738917294, 0.05692453706363341, 0.0384483732597997], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 209.75000000000003, 126, 389, 131.0, 388.3, 389.0, 389.0, 0.07660010436764221, 0.034877733067786305, 0.04288184553588954], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 328.18750000000006, 126, 1504, 131.5, 1263.9000000000003, 1504.0, 1504.0, 0.07660157128973108, 8.63384426481642, 0.04421047717991315], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 266.3125, 126, 1013, 131.5, 849.2000000000002, 1013.0, 1013.0, 0.07660083782166367, 2.8334642429682826, 0.04428485936564931], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 31.25, 0.3756574004507889], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 6.25, 0.07513148009015777], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 6.25, 0.07513148009015777], "isController": false}, {"data": ["401/Unauthorized", 9, 56.25, 0.67618332081142], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1331, 16, "401/Unauthorized", 9, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
