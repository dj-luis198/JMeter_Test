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

    var data = {"OkPercent": 96.52241112828439, "KoPercent": 3.4775888717156107};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7634194831013916, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/19c48eb9-0080-4289-8121-714687a7820e"], "isController": false}, {"data": [0.1509433962264151, 500, 1500, "see books"], "isController": true}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/10ca0539-84ea-4b5c-925e-cfb124a37c00"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cc00d34d-4eb0-472a-8fc0-fac27a958bc3"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.44339622641509435, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.43333333333333335, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.43333333333333335, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cc00d34d-4eb0-472a-8fc0-fac27a958bc3"], "isController": false}, {"data": [0.15217391304347827, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=19c48eb9-0080-4289-8121-714687a7820e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f4f8ea77-69c8-49fa-8a93-63a88d8b20c9"], "isController": false}, {"data": [0.2727272727272727, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.25, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d73aa3a4-4fcb-460c-a62f-1f946ec695ae"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bf221601-1ae3-4cc3-ad82-1b75e9bc85fb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6226415094339622, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/140e98b5-ef33-42be-9c25-5c56d5c32f5f"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bf221601-1ae3-4cc3-ad82-1b75e9bc85fb"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8872832369942196, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ad79eaac-4b6b-4e0e-b84b-94e4ab3bdd7a"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=140e98b5-ef33-42be-9c25-5c56d5c32f5f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/00d0b977-128e-4d4c-b46c-e8d5481886ee"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d6ddb122-40e1-4557-8d49-c3e9090b7e32"], "isController": false}, {"data": [0.6590909090909091, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6bac6bb6-494f-440e-a079-80d3aeb2b816"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/805af989-133b-4269-966d-8fe4fd58082f"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6bac6bb6-494f-440e-a079-80d3aeb2b816"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f4f8ea77-69c8-49fa-8a93-63a88d8b20c9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=00d0b977-128e-4d4c-b46c-e8d5481886ee"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ef48cf01-2613-4dab-a109-0d24a3b4a7a5"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=805af989-133b-4269-966d-8fe4fd58082f"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/30c0360b-c62e-4aea-ba52-7607d842a113"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d6ddb122-40e1-4557-8d49-c3e9090b7e32"], "isController": false}, {"data": [0.98, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.15217391304347827, 500, 1500, "register"], "isController": true}, {"data": [0.98, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=10ca0539-84ea-4b5c-925e-cfb124a37c00"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1294, 45, 3.4775888717156107, 350.78593508500813, 91, 2401, 112.0, 1015.5, 1225.25, 1638.049999999999, 5.158605183321839, 690.1061417774265, 3.7803269562535133], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/19c48eb9-0080-4289-8121-714687a7820e", 3, 0, 0.0, 309.3333333333333, 194, 475, 259.0, 475.0, 475.0, 475.0, 0.021432245527804768, 0.025332188643053095, 0.01374398557609876], "isController": false}, {"data": ["see books", 53, 0, 0.0, 1631.1698113207551, 1105, 2110, 1596.0, 2017.4, 2047.3999999999999, 2110.0, 0.23271028447734587, 280.02751205675276, 1.1442346507260122], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 13, 0, 0.0, 347.3846153846154, 189, 1160, 225.0, 854.3999999999997, 1160.0, 1160.0, 0.0663712296036106, 6.202878022443687, 0.1479641662369555], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 119.53846153846155, 96, 311, 103.0, 236.19999999999993, 311.0, 311.0, 0.10743801652892562, 0.0834113507231405, 0.03819085743801653], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/10ca0539-84ea-4b5c-925e-cfb124a37c00", 3, 0, 0.0, 423.0, 353, 476, 440.0, 476.0, 476.0, 476.0, 0.02302750251383569, 0.023094965900106696, 0.014766985661541769], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cc00d34d-4eb0-472a-8fc0-fac27a958bc3", 3, 0, 0.0, 329.0, 234, 451, 302.0, 451.0, 451.0, 451.0, 0.0455276656448235, 0.0298034295611133, 0.029195801211035904], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 25, 0, 0.0, 367.08000000000004, 189, 1086, 376.0, 638.2000000000003, 976.4999999999998, 1086.0, 0.11680769248739645, 5.763492310549604, 0.2615077843566466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 5, 0, 0.0, 136.4, 94, 286, 100.0, 286.0, 286.0, 286.0, 0.030864769100662357, 0.022937587192972706, 0.015492667302480908], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 5, 0, 0.0, 133.4, 95, 280, 97.0, 280.0, 280.0, 280.0, 0.030865721764037728, 0.00825899195639291, 0.017603106943552767], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 5, 0, 0.0, 176.6, 95, 293, 102.0, 293.0, 293.0, 293.0, 0.030865340691630556, 0.008319173858291048, 0.018145444430040618], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 5, 0, 0.0, 171.0, 92, 291, 100.0, 291.0, 291.0, 291.0, 0.03086553122665794, 0.00831922521343515, 0.01817569856413549], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 100.5, 96, 103, 101.5, 103.0, 103.0, 103.0, 0.04009783872649264, 0.011825729780664823, 0.024787042884638517], "isController": false}, {"data": ["https://demoqa.com/books", 53, 0, 0.0, 1116.3773584905662, 727, 1703, 1094.0, 1556.6000000000001, 1643.3, 1703.0, 0.23282784796780825, 278.54305022601875, 0.45974405135830887], "isController": false}, {"data": ["deleteBook", 15, 5, 33.333333333333336, 472.8666666666667, 101, 1054, 489.0, 982.6, 1054.0, 1054.0, 0.08548518541736717, 0.01869988431004907, 0.05673967873242567], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 5, 33.333333333333336, 472.8666666666667, 101, 1054, 489.0, 982.6, 1054.0, 1054.0, 0.08515131388477325, 0.018626849912294144, 0.056518075849952026], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cc00d34d-4eb0-472a-8fc0-fac27a958bc3", 1, 0, 0.0, 879.0, 879, 879, 879.0, 879.0, 879.0, 879.0, 1.1376564277588168, 0.2055336319681456, 0.784360779294653], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 9, 39.130434782608695, 1256.913043478261, 475, 2401, 1133.0, 2067.6000000000004, 2347.1999999999994, 2401.0, 0.09566750964994011, 0.029701122221482763, 0.04316248970534407], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 130.43750000000003, 91, 286, 95.5, 283.9, 286.0, 286.0, 0.09927652234342231, 0.02656422570517355, 0.05661864164898304], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 106.25, 93, 161, 101.0, 161.0, 161.0, 161.0, 0.04126391367589259, 0.011121914232955424, 0.024298964791565656], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 99.6875, 91, 130, 97.5, 113.20000000000002, 130.0, 130.0, 0.09925250457492013, 0.07376089451319748, 0.04982010483545796], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 106.50000000000001, 92, 170, 97.0, 170.0, 170.0, 170.0, 0.041265190748344234, 0.011122258443889657, 0.02425941877978831], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=19c48eb9-0080-4289-8121-714687a7820e", 1, 0, 0.0, 848.0, 848, 848, 848.0, 848.0, 848.0, 848.0, 1.1792452830188678, 0.21304724351415094, 0.813034345518868], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 132.50000000000003, 93, 287, 98.0, 284.9, 287.0, 287.0, 0.09927282654555382, 0.026757129029856302, 0.058458510163055616], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 131.06250000000003, 92, 283, 96.5, 282.3, 283.0, 283.0, 0.09927529038022435, 0.026757793110294848, 0.058363012508686585], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 220.46153846153845, 93, 936, 100.0, 676.7999999999997, 936.0, 936.0, 0.1033107109366308, 7.176408067871163, 0.06005245502010585], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 176.0, 94, 746, 98.0, 562.7999999999998, 746.0, 746.0, 0.10331153195107802, 2.362397607344655, 0.06015382242734418], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 104.75, 93, 161, 96.5, 161.0, 161.0, 161.0, 0.04126306233817143, 0.011041092852206027, 0.023532840239738395], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 111.53846153846155, 92, 292, 97.0, 214.79999999999993, 292.0, 292.0, 0.10346776183313038, 0.07689352222169162, 0.05193596638889552], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 99.0, 96, 103, 99.0, 103.0, 103.0, 103.0, 0.04126455220223757, 0.03066633225185819, 0.02071287092963878], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 112.99999999999999, 93, 294, 99.0, 217.59999999999994, 294.0, 294.0, 0.10346858534566467, 0.03964015814775314, 0.05834098569745786], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 126.0, 100, 274, 106.0, 274.0, 274.0, 274.0, 0.04309648224963637, 0.03392164520820988, 0.01531945267467543], "isController": false}, {"data": ["deleteAccount", 13, 3, 23.076923076923077, 422.6153846153846, 93, 916, 475.0, 770.3999999999999, 916.0, 916.0, 0.08769740348226152, 0.01760272401627124, 0.059672707387494354], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f4f8ea77-69c8-49fa-8a93-63a88d8b20c9", 1, 0, 0.0, 198.0, 198, 198, 198.0, 198.0, 198.0, 198.0, 5.050505050505051, 0.91244476010101, 3.4820864898989896], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1537.909090909091, 1154, 2339, 1463.0, 2196.9, 2319.35, 2339.0, 0.09586516129313387, 0.04961771043492281, 0.04409422946197857], "isController": false}, {"data": ["goToProfile", 15, 5, 33.333333333333336, 214.26666666666668, 95, 447, 227.0, 390.6, 447.0, 447.0, 0.08512618538213144, 0.138258004344273, 0.0550050384060973], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 209.625, 193, 269, 202.0, 269.0, 269.0, 269.0, 0.041242215531818366, 0.06391737895409741, 0.09275470934548603], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 13, 0, 0.0, 116.07692307692308, 94, 295, 99.0, 223.39999999999992, 295.0, 295.0, 0.06640581101927812, 0.04935041229069399, 0.03333260435928609], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 700.125, 562, 959, 664.0, 959.0, 959.0, 959.0, 0.037553572518295636, 11.041997216341437, 0.021417271826840476], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 13, 0, 0.0, 171.46153846153845, 94, 300, 100.0, 295.6, 300.0, 300.0, 0.0664041150119272, 0.025440278437562254, 0.03744210391222398], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 1029.375, 842, 1325, 994.5, 1325.0, 1325.0, 1325.0, 0.037487406574353926, 33.73123433143553, 0.021342927766453457], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 263.87500000000006, 93, 382, 291.5, 382.0, 382.0, 382.0, 0.03760352721085238, 0.06654061650982862, 0.02082148430522783], "isController": false}, {"data": ["addBook", 60, 19, 31.666666666666668, 920.7000000000002, 499, 2197, 817.0, 1705.3999999999999, 1765.05, 2197.0, 0.27538220755556986, 61.48415161052694, 1.0049254330958928], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d73aa3a4-4fcb-460c-a62f-1f946ec695ae", 1, 0, 0.0, 309.0, 309, 309, 309.0, 309.0, 309.0, 309.0, 3.236245954692557, 1.0334496359223302, 1.931002224919094], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bf221601-1ae3-4cc3-ad82-1b75e9bc85fb", 1, 0, 0.0, 945.0, 945, 945, 945.0, 945.0, 945.0, 945.0, 1.0582010582010584, 0.19117890211640212, 0.7295800264550265], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 111.06249999999999, 94, 276, 98.5, 163.30000000000013, 276.0, 276.0, 0.07966818202187888, 0.05920652980336897, 0.039989692928950916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 133.125, 92, 305, 96.5, 300.8, 305.0, 305.0, 0.07966818202187888, 0.02131746276757306, 0.0454357600593528], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 120.12500000000001, 91, 307, 97.0, 286.70000000000005, 307.0, 307.0, 0.07966818202187888, 0.02147306468558454, 0.04683617732145613], "isController": false}, {"data": ["https://demoqa.com/books-0", 53, 0, 0.0, 161.43396226415092, 92, 409, 100.0, 392.6, 405.2, 409.0, 0.2337118289053026, 0.1736862322235696, 0.11297593291809062], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 121.4375, 92, 307, 97.5, 290.20000000000005, 307.0, 307.0, 0.07966699197355057, 0.021472743930371047, 0.04691327750004979], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 121.625, 93, 285, 99.0, 285.0, 285.0, 285.0, 0.037636255004445784, 0.027969912166389884, 0.021133639284722974], "isController": false}, {"data": ["https://demoqa.com/books-3", 53, 0, 0.0, 620.0377358490567, 446, 960, 576.0, 810.0, 866.3999999999996, 960.0, 0.23357381152796935, 68.67845596968388, 0.11747120403994553], "isController": false}, {"data": ["https://demoqa.com/books-1", 53, 0, 0.0, 149.62264150943395, 91, 403, 99.0, 295.4, 324.7999999999997, 403.0, 0.23405862064397034, 0.41417404356140064, 0.1138292901178684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 595.5882352941178, 95, 1353, 292.0, 1283.3999999999999, 1353.0, 1353.0, 0.10482115660897393, 44.40002123399165, 0.057384284379797874], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/140e98b5-ef33-42be-9c25-5c56d5c32f5f", 3, 0, 0.0, 354.3333333333333, 210, 447, 406.0, 447.0, 447.0, 447.0, 0.031247070587132452, 0.031338614739243195, 0.020037997739795227], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 13, 0, 0.0, 184.23076923076923, 93, 864, 98.0, 634.3999999999999, 864.0, 864.0, 0.0664034366332436, 4.612669432518785, 0.038598992838644756], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bf221601-1ae3-4cc3-ad82-1b75e9bc85fb", 3, 0, 0.0, 313.3333333333333, 193, 482, 265.0, 482.0, 482.0, 482.0, 0.019636720667648502, 0.027070804696449024, 0.012592558501063656], "isController": false}, {"data": ["https://demoqa.com/books-2", 53, 0, 0.0, 951.9999999999998, 629, 1334, 944.0, 1209.0, 1280.8, 1334.0, 0.2332756746288496, 209.90186208593568, 0.11709345386643427], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 416.4117647058823, 94, 881, 292.0, 871.4, 881.0, 881.0, 0.10482115660897393, 14.518910391784488, 0.05748664879054883], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 25, 0, 0.0, 111.80000000000001, 95, 285, 102.0, 115.4, 234.2999999999999, 285.0, 0.11854296471213027, 0.08855992969216762, 0.04213831948751506], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 13, 0, 0.0, 147.0, 93, 751, 98.0, 490.5999999999998, 751.0, 751.0, 0.0664041150119272, 1.5184454190099659, 0.03866423493520491], "isController": false}, {"data": ["deleteBooks", 14, 4, 28.571428571428573, 588.4285714285713, 96, 1381, 634.0, 1255.5, 1381.0, 1381.0, 0.08001920460910618, 0.01706882866173596, 0.053539635226740136], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 19, 10.982658959537572, 154.1040462427746, 92, 1026, 105.0, 277.19999999999993, 365.3999999999995, 630.8399999999951, 0.7281114136725013, 1.512662641360937, 0.3510308182099402], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 5, 0, 0.0, 142.8, 101, 291, 108.0, 291.0, 291.0, 291.0, 0.03308563223334635, 0.025621978868206694, 0.011760908332947335], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ad79eaac-4b6b-4e0e-b84b-94e4ab3bdd7a", 1, 0, 0.0, 197.0, 197, 197, 197.0, 197.0, 197.0, 197.0, 5.076142131979695, 1.6209946065989846, 3.0288309010152283], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 271.62499999999994, 195, 560, 202.0, 454.3000000000001, 560.0, 560.0, 0.07962853289404925, 0.12340867353794549, 0.1790864367724565], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=140e98b5-ef33-42be-9c25-5c56d5c32f5f", 1, 0, 0.0, 749.0, 749, 749, 749.0, 749.0, 749.0, 749.0, 1.335113484646195, 0.24120702603471295, 0.9204981642189586], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 116.81250000000001, 97, 301, 101.0, 182.7000000000001, 301.0, 301.0, 0.0914071560377283, 0.07417904947983615, 0.03249238749778623], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/00d0b977-128e-4d4c-b46c-e8d5481886ee", 3, 0, 0.0, 715.0, 261, 1381, 503.0, 1381.0, 1381.0, 1381.0, 0.03556778033338866, 0.02965139499798449, 0.022808765383064995], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d6ddb122-40e1-4557-8d49-c3e9090b7e32", 3, 0, 0.0, 464.0, 246, 642, 504.0, 642.0, 642.0, 642.0, 0.024890894910641687, 0.02496381745432521, 0.015961934561837282], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 710.8636363636364, 107, 1519, 750.0, 1380.9999999999998, 1509.55, 1519.0, 0.09519853221172153, 0.058476442149582857, 0.04304386759182331], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 128.41176470588235, 95, 297, 98.0, 289.8, 297.0, 297.0, 0.10482244926901757, 0.07790027723996325, 0.05261595598073733], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 169.94117647058823, 93, 386, 101.0, 314.79999999999995, 386.0, 386.0, 0.10482115660897393, 0.10213559618574308, 0.05563806796110518], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6bac6bb6-494f-440e-a079-80d3aeb2b816", 1, 0, 0.0, 1130.0, 1130, 1130, 1130.0, 1130.0, 1130.0, 1130.0, 0.8849557522123894, 0.15987970132743365, 0.6101355088495576], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/805af989-133b-4269-966d-8fe4fd58082f", 3, 0, 0.0, 332.0, 217, 552, 227.0, 552.0, 552.0, 552.0, 0.04973392350922564, 0.032297909310190484, 0.031893173604549], "isController": false}, {"data": ["login", 22, 0, 0.0, 2958.454545454545, 1887, 4944, 2773.5, 3845.7999999999997, 4787.999999999998, 4944.0, 0.09758477677482312, 42.583123794051765, 0.20607680088269867], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6bac6bb6-494f-440e-a079-80d3aeb2b816", 3, 0, 0.0, 338.6666666666667, 231, 443, 342.0, 443.0, 443.0, 443.0, 0.01838573267144696, 0.02173131358399216, 0.011790329870687014], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 5, 0, 0.0, 351.8, 194, 579, 388.0, 579.0, 579.0, 579.0, 0.030845347596222063, 0.04780426429219181, 0.0693719096817377], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f4f8ea77-69c8-49fa-8a93-63a88d8b20c9", 3, 0, 0.0, 780.0, 344, 1080, 916.0, 1080.0, 1080.0, 1080.0, 0.05993167788720859, 0.02711752352318357, 0.03843274916595082], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 13, 0, 0.0, 105.61538461538463, 97, 123, 105.0, 119.8, 123.0, 123.0, 0.06693957416132437, 0.054192291972400296, 0.023794926752658273], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=00d0b977-128e-4d4c-b46c-e8d5481886ee", 1, 0, 0.0, 570.0, 570, 570, 570.0, 570.0, 570.0, 570.0, 1.7543859649122808, 0.3169544956140351, 1.2095668859649125], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ef48cf01-2613-4dab-a109-0d24a3b4a7a5", 1, 0, 0.0, 189.0, 189, 189, 189.0, 189.0, 189.0, 189.0, 5.291005291005291, 1.6896081349206349, 3.1570353835978837], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 348.15384615384613, 188, 1229, 207.0, 892.1999999999997, 1229.0, 1229.0, 0.10323031477305211, 9.64762977241686, 0.23013567093749007], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 105.5, 93, 129, 103.5, 125.5, 129.0, 129.0, 0.08093561571769659, 0.0671038454534418, 0.028770082149649955], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=805af989-133b-4269-966d-8fe4fd58082f", 1, 0, 0.0, 1381.0, 1381, 1381, 1381.0, 1381.0, 1381.0, 1381.0, 0.724112961622013, 0.13082118935553946, 0.4992419442433019], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 727.4117647058823, 194, 1453, 589.0, 1383.3999999999999, 1453.0, 1453.0, 0.10475850084423027, 59.06364074112018, 0.22299093800453543], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 118.52941176470588, 97, 292, 101.0, 179.9999999999999, 292.0, 292.0, 0.10786322942508898, 0.08374147206342358, 0.0383420073346996], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/30c0360b-c62e-4aea-ba52-7607d842a113", 1, 0, 0.0, 450.0, 450, 450, 450.0, 450.0, 450.0, 450.0, 2.2222222222222223, 0.7096354166666666, 1.3259548611111112], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 16, 8, 50.0, 631.25, 93, 1430, 555.0, 1357.2, 1430.0, 1430.0, 0.07135721421435708, 42.693564805729984, 0.1039392039322285], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 280.1875, 193, 394, 216.0, 389.8, 394.0, 394.0, 0.09919220349280546, 0.1537285419366038, 0.22308559047258886], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 25, 0, 0.0, 132.6, 93, 412, 97.0, 290.0, 375.3999999999999, 412.0, 0.11685956285174728, 0.0868458274708786, 0.05865802275956846], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 25, 0, 0.0, 179.48, 92, 298, 98.0, 293.4, 296.8, 298.0, 0.11686174787779065, 0.03829048207808235, 0.06625513315227553], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d6ddb122-40e1-4557-8d49-c3e9090b7e32", 1, 0, 0.0, 698.0, 698, 698, 698.0, 698.0, 698.0, 698.0, 1.4326647564469914, 0.25883103510028654, 0.9877551934097422], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 25, 0, 0.0, 200.39999999999998, 92, 988, 99.0, 297.20000000000005, 782.1999999999996, 988.0, 0.11686229414706886, 4.236354026431914, 0.06830053300892361], "isController": false}, {"data": ["register", 23, 9, 39.130434782608695, 1256.913043478261, 475, 2401, 1133.0, 2067.6000000000004, 2347.1999999999994, 2401.0, 0.09673132244334909, 0.030031395622697375, 0.04364245211799539], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 25, 0, 0.0, 166.79999999999995, 91, 730, 96.0, 298.40000000000003, 603.3999999999996, 730.0, 0.11686393298554626, 1.4047136044810307, 0.0684156157677493], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=10ca0539-84ea-4b5c-925e-cfb124a37c00", 1, 0, 0.0, 438.0, 438, 438, 438.0, 438.0, 438.0, 438.0, 2.28310502283105, 0.4124750285388128, 1.574093892694064], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 20.0, 0.6955177743431221], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 5, 11.11111111111111, 0.38639876352395675], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 6.666666666666667, 0.23183925811437403], "isController": false}, {"data": ["401/Unauthorized", 28, 62.22222222222222, 2.1638330757341575], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1294, 45, "401/Unauthorized", 28, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 19, "401/Unauthorized", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 16, 8, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
