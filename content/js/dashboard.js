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

    var data = {"OkPercent": 97.45318352059925, "KoPercent": 2.546816479400749};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7726106478511866, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.16666666666666666, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3e0fb1c6-8047-40e3-8077-954e471a211e"], "isController": false}, {"data": [0.6875, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6875, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/063512b2-936e-4599-8381-ef619aa79eaf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9f4ec737-0c83-448d-8e70-7a943477f61b"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=56e696b3-9e3d-4df4-8d94-b7a1e40aa2f4"], "isController": false}, {"data": [0.6764705882352942, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2c9eced2-00a8-4dbf-95b2-9b21d523ceb9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a7f60de1-4afb-4606-9f21-db7098efe664"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.782608695652174, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.021739130434782608, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/56e696b3-9e3d-4df4-8d94-b7a1e40aa2f4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4c686824-dcc1-449a-85cd-e1f3ca796237"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2571df0d-4eeb-4c25-89de-4ab425bea1e7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/63c23d9b-4558-4748-b715-485fe886363e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ca718b09-f47d-4be8-b473-25691ebc084f"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7b8f9faf-72ae-453f-a41c-bc607c576eda"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ca61616a-2ca3-4544-b622-a78d9318e85d"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=063512b2-936e-4599-8381-ef619aa79eaf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.42105263157894735, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/090fbeee-97ec-4d86-9cd4-198a0193d506"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.34782608695652173, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2c9eced2-00a8-4dbf-95b2-9b21d523ceb9"], "isController": false}, {"data": [0.25, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e2a27d71-b1e1-415e-a5b8-3945967c4a7c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5526315789473685, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9912280701754386, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8901734104046243, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a7f60de1-4afb-4606-9f21-db7098efe664"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4c686824-dcc1-449a-85cd-e1f3ca796237"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e2a27d71-b1e1-415e-a5b8-3945967c4a7c"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2571df0d-4eeb-4c25-89de-4ab425bea1e7"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9f4ec737-0c83-448d-8e70-7a943477f61b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/49827e82-1cb9-4e93-8c30-7fef6500afe2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3e0fb1c6-8047-40e3-8077-954e471a211e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=090fbeee-97ec-4d86-9cd4-198a0193d506"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ca61616a-2ca3-4544-b622-a78d9318e85d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7b8f9faf-72ae-453f-a41c-bc607c576eda"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ca718b09-f47d-4be8-b473-25691ebc084f"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1335, 34, 2.546816479400749, 356.4344569288389, 94, 2241, 114.0, 1009.4000000000001, 1208.2, 1624.5600000000004, 5.398738272403753, 767.9054006023031, 3.9507063412427206], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1642.5964912280704, 1180, 2189, 1613.0, 1979.2000000000003, 2066.7999999999997, 2189.0, 0.25982550665973797, 312.6575298970271, 1.277559986359161], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/3e0fb1c6-8047-40e3-8077-954e471a211e", 3, 0, 0.0, 377.3333333333333, 283, 489, 360.0, 489.0, 489.0, 489.0, 0.06413682522715126, 0.02902024318546232, 0.04112940940673437], "isController": false}, {"data": ["deleteBook", 16, 3, 18.75, 491.6875, 104, 1158, 464.5, 1094.3, 1158.0, 1158.0, 0.07761602382811932, 0.015685220635675234, 0.052058257192822456], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, 18.75, 491.6875, 104, 1158, 464.5, 1094.3, 1158.0, 1158.0, 0.07825261901734273, 0.015813868503809923, 0.05248523134653194], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/063512b2-936e-4599-8381-ef619aa79eaf", 3, 0, 0.0, 557.0, 229, 903, 539.0, 903.0, 903.0, 903.0, 0.023262846907204503, 0.03206971245182652, 0.01491790638254976], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 127.43750000000001, 98, 304, 102.0, 302.6, 304.0, 304.0, 0.14083143357597414, 0.050903549172175225, 0.07957869946572074], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 103.4375, 96, 116, 103.5, 111.10000000000001, 116.0, 116.0, 0.1408277148942912, 0.1046580967134332, 0.07068891157779851], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9f4ec737-0c83-448d-8e70-7a943477f61b", 1, 0, 0.0, 494.0, 494, 494, 494.0, 494.0, 494.0, 494.0, 2.0242914979757085, 0.36571672570850206, 1.3956540991902835], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 143.5625, 96, 572, 102.5, 388.6000000000002, 572.0, 572.0, 0.14083639212372479, 2.6237482890578927, 0.08217748466203667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 177.4375, 94, 1120, 102.5, 552.3000000000006, 1120.0, 1120.0, 0.1408326731801778, 7.9556793113502335, 0.08203778276560161], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=56e696b3-9e3d-4df4-8d94-b7a1e40aa2f4", 1, 0, 0.0, 812.0, 812, 812, 812.0, 812.0, 812.0, 812.0, 1.2315270935960592, 0.22249268780788176, 0.8490802032019704], "isController": false}, {"data": ["goToProfile", 17, 4, 23.529411764705884, 351.4117647058824, 97, 2075, 244.0, 818.9999999999989, 2075.0, 2075.0, 0.08154650549239699, 0.13334689943397132, 0.05269980392862282], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 111.73684210526315, 96, 282, 103.0, 113.0, 282.0, 282.0, 0.0930455776416374, 0.06914812947781843, 0.04670451846465003], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 132.84210526315786, 94, 307, 103.0, 305.0, 307.0, 307.0, 0.09304694463217074, 0.03960807953554883, 0.052243257769419876], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 658.125, 558, 782, 635.0, 782.0, 782.0, 782.0, 0.05285272587933723, 15.540456284189107, 0.030142570228059513], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 936.7499999999999, 667, 1149, 975.0, 1149.0, 1149.0, 1149.0, 0.052758616141498606, 47.47229554387539, 0.030037376182122745], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 253.0, 106, 306, 303.0, 306.0, 306.0, 306.0, 0.053006108954056955, 0.09379596623510861, 0.029350062282178024], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 10, 0, 0.0, 125.70000000000002, 101, 307, 104.0, 288.1000000000001, 307.0, 307.0, 0.06452487111156996, 0.04795256534756322, 0.03238846069467476], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 10, 0, 0.0, 139.0, 99, 290, 102.0, 289.7, 290.0, 290.0, 0.06452695290822977, 0.01726600107114742, 0.03680052783047479], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 10, 0, 0.0, 120.7, 97, 301, 101.5, 281.30000000000007, 301.0, 301.0, 0.06452653653815131, 0.017391918051298597, 0.037934545894499114], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2c9eced2-00a8-4dbf-95b2-9b21d523ceb9", 3, 0, 0.0, 349.6666666666667, 254, 502, 293.0, 502.0, 502.0, 502.0, 0.0929195316855603, 0.04204366830824506, 0.05958706947283652], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 10, 0, 0.0, 121.39999999999999, 97, 305, 101.5, 284.80000000000007, 305.0, 305.0, 0.06452695290822977, 0.017392030276046307, 0.03799780527701421], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 125.375, 101, 281, 103.5, 281.0, 281.0, 281.0, 0.05301453923738585, 0.039398500351221326, 0.029768906310055535], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a7f60de1-4afb-4606-9f21-db7098efe664", 3, 0, 0.0, 383.3333333333333, 244, 505, 401.0, 505.0, 505.0, 505.0, 0.030748731614820887, 0.02499335378978117, 0.01971842489622303], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 21, 0, 0.0, 597.7142857142858, 94, 1308, 133.0, 1270.0, 1305.8, 1308.0, 0.10265735906611133, 44.00081354429421, 0.0561502909847285], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 224.73684210526315, 94, 1105, 103.0, 842.0, 1105.0, 1105.0, 0.09304648896419669, 8.835427925087782, 0.05385945511486344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 21, 0, 0.0, 419.8095238095238, 95, 816, 105.0, 813.8, 815.8, 816.0, 0.10265735906611133, 14.388146863573258, 0.056250542311941494], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 211.57894736842104, 95, 816, 104.0, 598.0, 816.0, 816.0, 0.09296181226606649, 2.899666988771192, 0.05390122348753578], "isController": false}, {"data": ["deleteBooks", 15, 2, 13.333333333333334, 495.40000000000003, 115, 1021, 425.0, 940.0, 1021.0, 1021.0, 0.0759839927055367, 0.014885145446026038, 0.051665157540144876], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 10, 0, 0.0, 287.79999999999995, 202, 608, 211.5, 588.1000000000001, 608.0, 608.0, 0.06448284756254836, 0.09993581941578539, 0.145023435484911], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 519.0, 122, 1281, 376.0, 1090.2000000000003, 1257.7999999999997, 1281.0, 0.10047792543664212, 0.06171935068324989, 0.04543093698941924], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 21, 0, 0.0, 102.9047619047619, 95, 126, 103.0, 106.8, 124.09999999999997, 126.0, 0.10265384634185686, 0.07628864947866511, 0.05152741896456487], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 21, 0, 0.0, 139.14285714285714, 95, 306, 103.0, 303.0, 305.7, 306.0, 0.10265384634185686, 0.10088757387410728, 0.05443938168166553], "isController": false}, {"data": ["login", 23, 0, 0.0, 2517.434782608695, 1477, 4095, 2497.0, 3805.000000000001, 4085.3999999999996, 4095.0, 0.10063663611105034, 42.011873003675426, 0.20988327654291278], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/56e696b3-9e3d-4df4-8d94-b7a1e40aa2f4", 3, 0, 0.0, 346.6666666666667, 208, 531, 301.0, 531.0, 531.0, 531.0, 0.03060662327327634, 0.030696291114897262, 0.019627294221469527], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 119.42105263157895, 101, 296, 106.0, 136.0, 296.0, 296.0, 0.09263141472546974, 0.07499164336661564, 0.03292757320319432], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 21, 0, 0.0, 703.2857142857144, 199, 1412, 234.0, 1374.4, 1409.8, 1412.0, 0.10260168559912056, 58.53438091639184, 0.21825283223402955], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4c686824-dcc1-449a-85cd-e1f3ca796237", 3, 0, 0.0, 361.0, 296, 490, 297.0, 490.0, 490.0, 490.0, 0.0281780098810888, 0.02321567155242049, 0.018069882638588847], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2571df0d-4eeb-4c25-89de-4ab425bea1e7", 3, 0, 0.0, 407.6666666666667, 298, 468, 457.0, 468.0, 468.0, 468.0, 0.02137163129661687, 0.02143424349768118, 0.013705115121853918], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/63c23d9b-4558-4748-b715-485fe886363e", 1, 0, 0.0, 282.0, 282, 282, 282.0, 282.0, 282.0, 282.0, 3.5460992907801416, 1.1323969414893618, 2.115885416666667], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ca718b09-f47d-4be8-b473-25691ebc084f", 1, 0, 0.0, 886.0, 886, 886, 886.0, 886.0, 886.0, 886.0, 1.128668171557562, 0.20390977708803612, 0.7781637979683973], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 309.06249999999994, 200, 1218, 207.5, 658.7000000000005, 1218.0, 1218.0, 0.14070139646135987, 10.724917571515883, 0.3141907526205635], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 6, 42.857142857142854, 651.2142857142857, 97, 1254, 776.0, 1232.5, 1254.0, 1254.0, 0.09156311314584696, 62.605537728907784, 0.1437571533682145], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7b8f9faf-72ae-453f-a41c-bc607c576eda", 1, 0, 0.0, 1021.0, 1021, 1021, 1021.0, 1021.0, 1021.0, 1021.0, 0.9794319294809011, 0.17694815132223313, 0.675272404505387], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ca61616a-2ca3-4544-b622-a78d9318e85d", 3, 0, 0.0, 645.0, 393, 1104, 438.0, 1104.0, 1104.0, 1104.0, 0.09134644662322636, 0.04133188828329578, 0.05857828771085805], "isController": false}, {"data": ["register", 24, 8, 33.333333333333336, 1027.2916666666665, 157, 2241, 1018.0, 1965.5, 2223.25, 2241.0, 0.09857355846438826, 0.030804237020121326, 0.044473617197800165], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 375.42105263157896, 198, 1209, 214.0, 946.0, 1209.0, 1209.0, 0.09291407892806494, 11.82963466275857, 0.20646352663944445], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 133.4375, 103, 310, 107.5, 309.3, 310.0, 310.0, 0.09970338243724917, 0.07740643460704405, 0.03544143672574092], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 13, 0, 0.0, 409.3846153846154, 206, 634, 409.0, 626.8, 634.0, 634.0, 0.06104547418246022, 0.0946085620386371, 0.1372927021896542], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=063512b2-936e-4599-8381-ef619aa79eaf", 1, 0, 0.0, 422.0, 422, 422, 422.0, 422.0, 422.0, 422.0, 2.3696682464454977, 0.4281138921800948, 1.6337751777251186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 123.50000000000003, 99, 306, 103.0, 286.9000000000001, 306.0, 306.0, 0.05421787997245731, 0.040292779940468766, 0.027214834283049865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 159.79999999999998, 97, 302, 102.5, 301.5, 302.0, 302.0, 0.05422317173020719, 0.014508934623121845, 0.030924152627383787], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 140.70000000000002, 98, 301, 102.5, 300.4, 301.0, 301.0, 0.05422317173020719, 0.014614839255407406, 0.03187729431795384], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 147.3, 94, 380, 101.5, 370.70000000000005, 380.0, 380.0, 0.05422199569477354, 0.014614522277106932, 0.0319295541054184], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 117.5, 115, 120, 117.5, 120.0, 120.0, 120.0, 0.028911343365569483, 0.00852658759414256, 0.01787195346719285], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1129.9298245614038, 753, 1769, 1064.0, 1562.4, 1624.8999999999996, 1769.0, 0.2623162060792931, 313.82137833935434, 0.5179720397386043], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, 33.333333333333336, 1027.2916666666665, 157, 2241, 1018.0, 1965.5, 2223.25, 2241.0, 0.10040244647294572, 0.031375764522795536, 0.045298760029786056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 10, 0, 0.0, 140.4, 96, 291, 105.0, 290.7, 291.0, 291.0, 0.05712620893339655, 0.01539729850157954, 0.033639749987146604], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 10, 0, 0.0, 161.1, 98, 304, 103.5, 303.9, 304.0, 304.0, 0.0571222931173349, 0.015396243066781674, 0.03358166060218322], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 197.125, 98, 1197, 103.0, 577.5000000000007, 1197.0, 1197.0, 0.09846032664213364, 5.562052938194607, 0.05735506332229757], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 131.0625, 96, 578, 102.0, 246.90000000000035, 578.0, 578.0, 0.098465780064372, 1.834393923892106, 0.05745439803560769], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 10, 0, 0.0, 102.9, 95, 109, 103.0, 108.8, 109.0, 109.0, 0.057187626885047145, 0.015302157975100508, 0.032614818457878454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 115.56250000000001, 97, 304, 103.0, 168.90000000000015, 304.0, 304.0, 0.09846456814055816, 0.07317532847164528, 0.049424597679928614], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/090fbeee-97ec-4d86-9cd4-198a0193d506", 3, 0, 0.0, 1430.0, 301, 2075, 1914.0, 2075.0, 2075.0, 2075.0, 0.01703006942591636, 0.023477325526938733, 0.010920975510760166], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 10, 0, 0.0, 123.9, 100, 306, 103.5, 286.4000000000001, 306.0, 306.0, 0.05718729984445055, 0.042499546075807484, 0.028705343867233963], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 139.31250000000003, 94, 305, 103.0, 302.9, 305.0, 305.0, 0.09845972074361704, 0.03558828529319459, 0.055635992104761146], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 523.4285714285714, 103, 1914, 475.0, 1226.5, 1914.0, 1914.0, 0.07842478223118506, 0.015142284962048008, 0.053369989916813715], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 126.19999999999999, 101, 302, 106.0, 283.20000000000005, 302.0, 302.0, 0.05638853959321308, 0.044383948156376696, 0.020044363683524958], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1348.0869565217392, 839, 2086, 1237.0, 1696.2, 2012.599999999999, 2086.0, 0.10117272383365444, 0.05236478870296568, 0.04653550090395629], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 0, 0.0, 287.5, 203, 610, 213.0, 589.9000000000001, 610.0, 610.0, 0.05708805261234928, 0.08847533153886554, 0.12839236832640666], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2c9eced2-00a8-4dbf-95b2-9b21d523ceb9", 1, 0, 0.0, 212.0, 212, 212, 212.0, 212.0, 212.0, 212.0, 4.716981132075471, 0.8521889740566038, 3.252137382075472], "isController": false}, {"data": ["addBook", 58, 15, 25.862068965517242, 1055.5517241379314, 515, 2590, 852.0, 1982.7, 2113.0, 2590.0, 0.2814782460993424, 82.42309774696076, 1.0229036619470528], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e2a27d71-b1e1-415e-a5b8-3945967c4a7c", 1, 0, 0.0, 447.0, 447, 447, 447.0, 447.0, 447.0, 447.0, 2.237136465324385, 0.4041701621923937, 1.5424007270693512], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 169.9473684210526, 98, 417, 104.0, 412.0, 414.2, 417.0, 0.26378996765101975, 0.19603922400627544, 0.1275156581906785], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 657.9298245614036, 465, 928, 605.0, 877.6000000000001, 917.2, 928.0, 0.26360209956760006, 77.50776968633662, 0.13257332155987697], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 157.70175438596496, 96, 682, 103.0, 307.0, 321.09999999999945, 682.0, 0.2639634341179685, 0.46709154552906146, 0.12837284198315266], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 956.5789473684209, 649, 1322, 952.0, 1209.8, 1219.6999999999998, 1322.0, 0.2628569320445658, 236.51912950690112, 0.13194185846768242], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 13, 0, 0.0, 107.6923076923077, 103, 123, 106.0, 117.8, 123.0, 123.0, 0.06122170262264356, 0.04573691651008039, 0.021762402104142826], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 15, 8.670520231213873, 174.0751445086706, 96, 966, 108.0, 338.79999999999995, 491.09999999999934, 950.4599999999998, 0.730935470650617, 1.6306670604775164, 0.3488026772624143], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 123.7, 98, 304, 104.5, 284.4000000000001, 304.0, 304.0, 0.05369588796889935, 0.04158285074154021, 0.019087210176444686], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a7f60de1-4afb-4606-9f21-db7098efe664", 1, 0, 0.0, 425.0, 425, 425, 425.0, 425.0, 425.0, 425.0, 2.352941176470588, 0.4250919117647059, 1.6222426470588236], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 135.5625, 103, 331, 108.5, 314.90000000000003, 331.0, 331.0, 0.13983691519765074, 0.11348093411059353, 0.04970765344916491], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4c686824-dcc1-449a-85cd-e1f3ca796237", 1, 0, 0.0, 817.0, 817, 817, 817.0, 817.0, 817.0, 817.0, 1.2239902080783354, 0.2211310434516524, 0.8438838739290087], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 313.6, 203, 604, 214.0, 591.7, 604.0, 604.0, 0.05418791284416098, 0.08398068133172214, 0.12186988601572533], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e2a27d71-b1e1-415e-a5b8-3945967c4a7c", 2, 0, 0.0, 332.0, 285, 379, 332.0, 379.0, 379.0, 379.0, 0.01176795937700423, 0.02327159935393903, 0.007314752093225774], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 326.81250000000006, 201, 1297, 208.0, 816.1000000000005, 1297.0, 1297.0, 0.09839553776236248, 7.500167435766163, 0.21972040677330282], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2571df0d-4eeb-4c25-89de-4ab425bea1e7", 1, 0, 0.0, 658.0, 658, 658, 658.0, 658.0, 658.0, 658.0, 1.5197568389057752, 0.2745654445288754, 1.0478011018237081], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9f4ec737-0c83-448d-8e70-7a943477f61b", 3, 0, 0.0, 431.6666666666667, 225, 604, 466.0, 604.0, 604.0, 604.0, 0.03441116757091568, 0.02252632095869513, 0.022067057329005175], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/49827e82-1cb9-4e93-8c30-7fef6500afe2", 1, 0, 0.0, 506.0, 506, 506, 506.0, 506.0, 506.0, 506.0, 1.976284584980237, 0.6310986907114624, 1.1792088685770752], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3e0fb1c6-8047-40e3-8077-954e471a211e", 1, 0, 0.0, 248.0, 248, 248, 248.0, 248.0, 248.0, 248.0, 4.032258064516129, 0.728484122983871, 2.780052923387097], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=090fbeee-97ec-4d86-9cd4-198a0193d506", 1, 0, 0.0, 406.0, 406, 406, 406.0, 406.0, 406.0, 406.0, 2.4630541871921183, 0.4449853756157635, 1.6981604064039408], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 10, 0, 0.0, 108.7, 103, 131, 105.5, 129.5, 131.0, 131.0, 0.06299768168531399, 0.05223147631917146, 0.022393707161576456], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ca61616a-2ca3-4544-b622-a78d9318e85d", 1, 0, 0.0, 348.0, 348, 348, 348.0, 348.0, 348.0, 348.0, 2.8735632183908044, 0.5191496048850575, 1.9811871408045978], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 21, 0, 0.0, 118.23809523809521, 100, 311, 107.0, 132.60000000000002, 293.39999999999975, 311.0, 0.10013207898036934, 0.07773926053651721, 0.035593824950053164], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7b8f9faf-72ae-453f-a41c-bc607c576eda", 3, 0, 0.0, 324.3333333333333, 194, 484, 295.0, 484.0, 484.0, 484.0, 0.04353062379383897, 0.02798599674245832, 0.027915146117793867], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 13, 0, 0.0, 165.23076923076923, 102, 332, 104.0, 320.8, 332.0, 332.0, 0.061074727277852424, 0.04538854243988837, 0.030656650215640766], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 13, 0, 0.0, 210.15384615384613, 97, 310, 294.0, 309.2, 310.0, 310.0, 0.061076735871306624, 0.016342798465564468, 0.034832825926604555], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 13, 0, 0.0, 193.6153846153846, 96, 311, 106.0, 309.4, 311.0, 311.0, 0.06107558808744145, 0.016461779601693205, 0.03590576565296851], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 13, 0, 0.0, 179.76923076923077, 100, 305, 104.0, 305.0, 305.0, 305.0, 0.06107530114821567, 0.016461702262605002, 0.03596524081286528], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ca718b09-f47d-4be8-b473-25691ebc084f", 3, 0, 0.0, 283.3333333333333, 197, 409, 244.0, 409.0, 409.0, 409.0, 0.06694336591243807, 0.043038134009461326, 0.042929176708171556], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 23.529411764705884, 0.599250936329588], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 11.764705882352942, 0.299625468164794], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 5.882352941176471, 0.149812734082397], "isController": false}, {"data": ["401/Unauthorized", 20, 58.8235294117647, 1.4981273408239701], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1335, 34, "401/Unauthorized", 20, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 6, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 15, "401/Unauthorized", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
