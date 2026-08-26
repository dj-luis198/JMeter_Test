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

    var data = {"OkPercent": 98.27067669172932, "KoPercent": 1.7293233082706767};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8112046632124352, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3983050847457627, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=88eb2b32-b288-44d8-84b2-e1c27655d86a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b66c3c5f-40a7-4799-8fe9-82b645c65325"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0e7dceee-9671-494b-90d9-255849986617"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ca3f7e6f-b69a-4838-a222-4c4089bf6145"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e72cb6ae-3b6a-4078-bdad-ee3973ec2806"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6538461538461539, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4d3cfe0e-c80e-432c-9863-5b7e3e6320b7"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2d1e4184-e7b3-41fe-9745-c9e21585891a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=203ae3e4-2e0f-4d54-bf8d-cf5e714224f5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6818181818181818, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7e3753e7-0db6-4795-b8d3-04b3276a5e31"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/203fd23b-fa14-4821-81e4-e1822c6711f0"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/9518b70e-4597-41d8-bf4b-379303f88115"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/98ce4be3-83b4-445a-99b7-7726672706e7"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.2391304347826087, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e72cb6ae-3b6a-4078-bdad-ee3973ec2806"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b641533f-e366-4bea-aeb6-caba2ef2775d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2d1e4184-e7b3-41fe-9745-c9e21585891a"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/e1f449a9-049b-4e5f-98bb-9b8c189969a0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/203ae3e4-2e0f-4d54-bf8d-cf5e714224f5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c08ef831-335f-4991-b273-5bc17e822ed7"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2391304347826087, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0e7dceee-9671-494b-90d9-255849986617"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4d3cfe0e-c80e-432c-9863-5b7e3e6320b7"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ca3f7e6f-b69a-4838-a222-4c4089bf6145"], "isController": false}, {"data": [0.34210526315789475, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b66c3c5f-40a7-4799-8fe9-82b645c65325"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8050847457627118, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9248554913294798, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7e3753e7-0db6-4795-b8d3-04b3276a5e31"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/98fbea66-1da1-48ab-9e89-e377dfb71434"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9518b70e-4597-41d8-bf4b-379303f88115"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=98ce4be3-83b4-445a-99b7-7726672706e7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b641533f-e366-4bea-aeb6-caba2ef2775d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/88eb2b32-b288-44d8-84b2-e1c27655d86a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1330, 23, 1.7293233082706767, 308.34887218045117, 77, 3617, 92.5, 853.8000000000002, 1032.1000000000008, 1583.640000000003, 5.215993097633194, 763.4955778648743, 3.814405596162519], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 59, 0, 0.0, 1310.7118644067798, 949, 1815, 1269.0, 1609.0, 1694.0, 1815.0, 0.26097418567207487, 314.0399878663591, 1.2832080320887667], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=88eb2b32-b288-44d8-84b2-e1c27655d86a", 1, 0, 0.0, 460.0, 460, 460, 460.0, 460.0, 460.0, 460.0, 2.1739130434782608, 0.39274796195652173, 1.4988111413043477], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b66c3c5f-40a7-4799-8fe9-82b645c65325", 1, 0, 0.0, 515.0, 515, 515, 515.0, 515.0, 515.0, 515.0, 1.941747572815534, 0.3508040048543689, 1.338743932038835], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0e7dceee-9671-494b-90d9-255849986617", 1, 0, 0.0, 380.0, 380, 380, 380.0, 380.0, 380.0, 380.0, 2.631578947368421, 0.4754317434210526, 1.8143503289473684], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ca3f7e6f-b69a-4838-a222-4c4089bf6145", 3, 0, 0.0, 250.66666666666669, 171, 404, 177.0, 404.0, 404.0, 404.0, 0.030017410097856755, 0.030105351729002822, 0.01924944592863861], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e72cb6ae-3b6a-4078-bdad-ee3973ec2806", 3, 0, 0.0, 286.0, 196, 457, 205.0, 457.0, 457.0, 457.0, 0.07181844297615628, 0.03249597517475821, 0.04605544683041272], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 614.076923076923, 93, 1187, 554.0, 1098.6, 1187.0, 1187.0, 0.07727148444465579, 0.014639324201428928, 0.05223603429367919], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 614.076923076923, 93, 1187, 554.0, 1098.6, 1187.0, 1187.0, 0.07780796993021223, 0.01474096305318474, 0.05259870202839392], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 21, 0, 0.0, 117.61904761904762, 78, 237, 80.0, 236.6, 237.0, 237.0, 0.09633822976209044, 0.03266826504023268, 0.05455761542237433], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 21, 0, 0.0, 101.6190476190476, 79, 316, 81.0, 209.8000000000001, 307.9999999999999, 316.0, 0.09640633894632462, 0.07164572650210257, 0.04839146310391685], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4d3cfe0e-c80e-432c-9863-5b7e3e6320b7", 3, 0, 0.0, 503.66666666666663, 179, 925, 407.0, 925.0, 925.0, 925.0, 0.02288731051214172, 0.02295436317965776, 0.01467708388962213], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 21, 0, 0.0, 172.9047619047619, 79, 689, 87.0, 300.20000000000005, 651.6999999999995, 689.0, 0.09640810929925078, 1.3746135785083369, 0.05637704494224695], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 21, 0, 0.0, 158.42857142857142, 77, 936, 81.0, 243.0, 866.799999999999, 936.0, 0.09633955564526858, 4.152658663506576, 0.0562428748870304], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 205.21428571428575, 80, 323, 194.0, 297.0, 323.0, 323.0, 0.06989585517578807, 0.13184944276777602, 0.04518170270047629], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/2d1e4184-e7b3-41fe-9745-c9e21585891a", 3, 0, 0.0, 351.0, 192, 532, 329.0, 532.0, 532.0, 532.0, 0.020479772811053617, 0.024206398137023334, 0.013133187642505087], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 81.0, 79, 84, 81.0, 84.0, 84.0, 84.0, 0.10558299409908378, 0.07846548682558863, 0.05299771383489166], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 98.27777777777779, 78, 238, 81.0, 237.1, 238.0, 238.0, 0.10558547143912997, 0.0370626085184012, 0.05972407363413461], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 559.8333333333334, 386, 630, 623.5, 630.0, 630.0, 630.0, 0.06067040800849386, 17.839114401638103, 0.03460109206734415], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 795.8333333333334, 540, 1015, 816.5, 1015.0, 1015.0, 1015.0, 0.06063055780113177, 54.55548248661076, 0.0345191554668553], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=203ae3e4-2e0f-4d54-bf8d-cf5e714224f5", 1, 0, 0.0, 409.0, 409, 409, 409.0, 409.0, 409.0, 409.0, 2.444987775061125, 0.441721424205379, 1.6857044621026895], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 160.66666666666666, 80, 249, 157.5, 249.0, 249.0, 249.0, 0.06090319437254484, 0.10777010566704225, 0.033722764852766526], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 10, 0, 0.0, 82.8, 78, 97, 81.0, 96.0, 97.0, 97.0, 0.05585250470557353, 0.041507574297794385, 0.028035339276039833], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 10, 0, 0.0, 112.60000000000001, 78, 244, 80.0, 243.6, 244.0, 244.0, 0.055854064500273685, 0.023334344524626054, 0.03138518429048582], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 10, 0, 0.0, 175.2, 78, 865, 80.5, 802.2000000000003, 865.0, 865.0, 0.055854064500273685, 5.039307516072006, 0.03235608502105698], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 10, 0, 0.0, 151.3, 77, 465, 81.5, 443.20000000000005, 465.0, 465.0, 0.055854064500273685, 1.6558439234966877, 0.03241063000592053], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 106.33333333333333, 78, 238, 80.5, 238.0, 238.0, 238.0, 0.061007229356678766, 0.04533838041057865, 0.03425698914071317], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 602.6875, 78, 1238, 740.0, 1134.4, 1238.0, 1238.0, 0.08353128507661385, 46.984441074551675, 0.044620715758699005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 133.66666666666666, 79, 881, 80.0, 301.4000000000009, 881.0, 881.0, 0.10558671015274877, 5.305050500143715, 0.06156933380651822], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 415.625, 78, 642, 539.5, 633.6, 642.0, 642.0, 0.08349292658362599, 15.351996883365599, 0.04468176149201859], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 123.83333333333334, 78, 396, 80.5, 254.70000000000022, 396.0, 396.0, 0.10558547143912997, 1.7516350166883703, 0.06167172230434425], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 498.61538461538464, 90, 1216, 432.0, 1118.8, 1216.0, 1216.0, 0.077848506805756, 0.01474864289093424, 0.05324599267325784], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 10, 0, 0.0, 275.7, 158, 944, 168.0, 883.1000000000003, 944.0, 944.0, 0.055827559833187254, 6.756786668588066, 0.12412909006660229], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 670.5454545454545, 126, 1428, 654.0, 1348.2, 1418.9999999999998, 1428.0, 0.1121259072005219, 0.06887421448157058, 0.050697553743985976], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 81.12499999999999, 79, 84, 81.0, 83.3, 84.0, 84.0, 0.08359675017633689, 0.062126100472844115, 0.0419616499908566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 139.9375, 78, 243, 81.5, 241.6, 243.0, 243.0, 0.08359762373754526, 0.10084371554863553, 0.04328871092464197], "isController": false}, {"data": ["login", 22, 0, 0.0, 2844.0454545454545, 1716, 3980, 2801.5, 3845.7999999999997, 3968.6, 3980.0, 0.11123583007210106, 36.44538676255701, 0.21813638587203835], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 100.72222222222223, 80, 237, 83.0, 237.0, 237.0, 237.0, 0.10623417553426936, 0.08600403468545831, 0.03776292958444731], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7e3753e7-0db6-4795-b8d3-04b3276a5e31", 3, 0, 0.0, 322.3333333333333, 235, 451, 281.0, 451.0, 451.0, 451.0, 0.08439768187700444, 0.03818775319304563, 0.05412221135992798], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/203fd23b-fa14-4821-81e4-e1822c6711f0", 1, 0, 0.0, 580.0, 580, 580, 580.0, 580.0, 580.0, 580.0, 1.7241379310344827, 0.550579202586207, 1.0287580818965518], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 691.125, 161, 1319, 823.5, 1216.1000000000001, 1319.0, 1319.0, 0.08345677982015064, 62.45057997571929, 0.17435050413111058], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9518b70e-4597-41d8-bf4b-379303f88115", 3, 0, 0.0, 647.3333333333334, 271, 1064, 607.0, 1064.0, 1064.0, 1064.0, 0.02133378845415369, 0.0252158157151797, 0.013680847413633712], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/98ce4be3-83b4-445a-99b7-7726672706e7", 3, 0, 0.0, 511.3333333333333, 172, 1188, 174.0, 1188.0, 1188.0, 1188.0, 0.03718762395874653, 0.02434385149122372, 0.02384753229125347], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 21, 0, 0.0, 318.0, 162, 1017, 317.0, 537.8000000000001, 970.6999999999994, 1017.0, 0.09630156146103226, 5.6283390273542295, 0.21541115177813955], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, 25.0, 707.0, 80, 1095, 814.5, 1095.0, 1095.0, 1095.0, 0.08077462868912874, 72.48130666845044, 0.14998326135135953], "isController": false}, {"data": ["register", 23, 7, 30.434782608695652, 1188.304347826087, 297, 2026, 1111.0, 1796.8, 1982.3999999999994, 2026.0, 0.09857621655909, 0.030905518982350572, 0.044474816455370686], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e72cb6ae-3b6a-4078-bdad-ee3973ec2806", 1, 0, 0.0, 490.0, 490, 490, 490.0, 490.0, 490.0, 490.0, 2.0408163265306123, 0.3687021683673469, 1.407047193877551], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 86.99999999999999, 80, 101, 84.0, 99.8, 101.0, 101.0, 0.06614362324592199, 0.051351738750496076, 0.023511991075698832], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 233.7222222222222, 160, 964, 163.0, 383.5000000000009, 964.0, 964.0, 0.10553285296342114, 7.168578976316669, 0.23584577252979838], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b641533f-e366-4bea-aeb6-caba2ef2775d", 3, 0, 0.0, 466.33333333333337, 186, 749, 464.0, 749.0, 749.0, 749.0, 0.058732551537813975, 0.037759371512754755, 0.03766377816715284], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2d1e4184-e7b3-41fe-9745-c9e21585891a", 1, 0, 0.0, 466.0, 466, 466, 466.0, 466.0, 466.0, 466.0, 2.1459227467811157, 0.3876911212446352, 1.4795131437768239], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 263.42105263157896, 160, 1018, 171.0, 400.0, 1018.0, 1018.0, 0.11226461360292596, 7.233647126469042, 0.2509739601490165], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e1f449a9-049b-4e5f-98bb-9b8c189969a0", 1, 0, 0.0, 1006.0, 1006, 1006, 1006.0, 1006.0, 1006.0, 1006.0, 0.9940357852882703, 0.31743134940357853, 0.5931209617296223], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 82.0, 80, 88, 81.5, 87.5, 88.0, 88.0, 0.059347533219781715, 0.04410495388696669, 0.029789679760710747], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 80.19999999999999, 79, 84, 80.0, 83.7, 84.0, 84.0, 0.05934858987750451, 0.015880384400816634, 0.03384724266451429], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 127.3, 78, 239, 80.0, 238.9, 239.0, 239.0, 0.05929263881889064, 0.015981219056654117, 0.034857586493136875], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/203ae3e4-2e0f-4d54-bf8d-cf5e714224f5", 3, 0, 0.0, 286.6666666666667, 192, 468, 200.0, 468.0, 468.0, 468.0, 0.026685880500627118, 0.0316981699045535, 0.017113015815831845], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 111.3, 78, 239, 80.0, 238.8, 239.0, 239.0, 0.05929228725927332, 0.01598112430035101, 0.034915282438810355], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 90.0, 90, 90, 90.0, 90.0, 90.0, 90.0, 11.11111111111111, 3.2769097222222223, 6.868489583333334], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c08ef831-335f-4991-b273-5bc17e822ed7", 1, 0, 0.0, 322.0, 322, 322, 322.0, 322.0, 322.0, 322.0, 3.105590062111801, 0.9917265139751552, 1.8530425077639752], "isController": false}, {"data": ["https://demoqa.com/books", 59, 0, 0.0, 889.7796610169491, 623, 1476, 792.0, 1276.0, 1344.0, 1476.0, 0.2694396112762761, 322.3434474512839, 0.5320379824224905], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, 30.434782608695652, 1188.304347826087, 297, 2026, 1111.0, 1796.8, 1982.3999999999994, 2026.0, 0.09911571544309034, 0.03107466214469171, 0.044718223178425526], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 96.77777777777777, 78, 236, 79.0, 236.0, 236.0, 236.0, 0.04941579548449442, 0.013319101126680138, 0.029099340505029433], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 113.88888888888887, 79, 235, 80.0, 235.0, 235.0, 235.0, 0.049415524161446005, 0.013319027996639745, 0.029050923383975098], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0e7dceee-9671-494b-90d9-255849986617", 3, 0, 0.0, 642.3333333333333, 259, 1389, 279.0, 1389.0, 1389.0, 1389.0, 0.06824385805277525, 0.030878568585077343, 0.043763151160145584], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 193.07692307692307, 78, 777, 80.0, 747.4, 777.0, 777.0, 0.06429945741150168, 8.91570518884256, 0.03695093518614693], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 188.07692307692307, 78, 630, 81.0, 626.4, 630.0, 630.0, 0.06429945741150168, 2.923306822172431, 0.03701372762502535], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 82.99999999999999, 80, 91, 81.0, 89.8, 91.0, 91.0, 0.06429786728920192, 0.04778386426472916, 0.03227451541665018], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 114.11111111111111, 78, 235, 80.0, 235.0, 235.0, 235.0, 0.04937350507998507, 0.013211269913980382, 0.028158327115928992], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 134.46153846153845, 78, 321, 79.0, 289.79999999999995, 321.0, 321.0, 0.06429913938074983, 0.032062626743495894, 0.03583981476901771], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 98.22222222222223, 80, 235, 81.0, 235.0, 235.0, 235.0, 0.049414981524287464, 0.03672343841795191, 0.024804004397933354], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 621.0, 80, 1389, 468.0, 1308.6, 1389.0, 1389.0, 0.07832127386539585, 0.014673471831452619, 0.05330459294024087], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 119.55555555555556, 82, 243, 84.0, 243.0, 243.0, 243.0, 0.05040633103517802, 0.039675295717142074, 0.017917875485160936], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1630.0454545454547, 933, 3617, 1430.0, 2481.3999999999996, 3458.449999999998, 3617.0, 0.1103763834676246, 0.057128401599454134, 0.05076882481762811], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 231.33333333333334, 161, 471, 163.0, 471.0, 471.0, 471.0, 0.0493513045194828, 0.07648488307853438, 0.11099224053551648], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4d3cfe0e-c80e-432c-9863-5b7e3e6320b7", 1, 0, 0.0, 392.0, 392, 392, 392.0, 392.0, 392.0, 392.0, 2.5510204081632653, 0.46087771045918363, 1.7588089923469388], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ca3f7e6f-b69a-4838-a222-4c4089bf6145", 1, 0, 0.0, 973.0, 973, 973, 973.0, 973.0, 973.0, 973.0, 1.027749229188078, 0.18567735097636176, 0.7085849177800617], "isController": false}, {"data": ["addBook", 57, 12, 21.05263157894737, 855.9473684210526, 410, 2379, 660.0, 1584.2000000000003, 1822.9999999999993, 2379.0, 0.26292725679228746, 89.37127105291988, 0.9529626525093409], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/b66c3c5f-40a7-4799-8fe9-82b645c65325", 3, 0, 0.0, 396.6666666666667, 323, 451, 416.0, 451.0, 451.0, 451.0, 0.025256564602082827, 0.025330558443690487, 0.016196429774122122], "isController": false}, {"data": ["https://demoqa.com/books-0", 59, 0, 0.0, 131.6440677966102, 79, 342, 82.0, 323.0, 330.0, 342.0, 0.27020714354411013, 0.20080823851276156, 0.13061771099056108], "isController": false}, {"data": ["https://demoqa.com/books-3", 59, 0, 0.0, 517.4745762711866, 386, 799, 469.0, 699.0, 725.0, 799.0, 0.2701094172045964, 79.42113713489447, 0.13584604478551482], "isController": false}, {"data": ["https://demoqa.com/books-1", 59, 0, 0.0, 113.66101694915255, 78, 321, 83.0, 239.0, 244.0, 321.0, 0.2705776603745896, 0.47879562558472294, 0.13158952623686093], "isController": false}, {"data": ["https://demoqa.com/books-2", 59, 0, 0.0, 753.4915254237287, 539, 1114, 706.0, 963.0, 1092.0, 1114.0, 0.2699129416393322, 242.8681393434139, 0.13548364453380546], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 86.47368421052633, 81, 101, 83.0, 99.0, 101.0, 101.0, 0.10768167031273024, 0.08044577909105335, 0.038277468743978325], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 12, 6.936416184971098, 144.1791907514451, 79, 895, 86.0, 282.5999999999999, 326.19999999999993, 891.3, 0.7414582297577618, 1.7109473441437657, 0.35215415313041093], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 86.8, 81, 108, 83.5, 106.60000000000001, 108.0, 108.0, 0.05733747692166554, 0.044402948436407005, 0.020381681249498296], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 21, 0, 0.0, 92.4285714285714, 81, 241, 84.0, 98.60000000000001, 226.8999999999998, 241.0, 0.09231093840662528, 0.07491249005459533, 0.03281365388673008], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7e3753e7-0db6-4795-b8d3-04b3276a5e31", 1, 0, 0.0, 249.0, 249, 249, 249.0, 249.0, 249.0, 249.0, 4.016064257028112, 0.725558483935743, 2.7688880522088355], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 210.70000000000002, 161, 321, 164.5, 321.0, 321.0, 321.0, 0.05926347355071175, 0.09184680910642534, 0.1332849410032121], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/98fbea66-1da1-48ab-9e89-e377dfb71434", 2, 0, 0.0, 216.5, 203, 230, 216.5, 230.0, 230.0, 230.0, 0.02504821781930216, 0.0289742324286752, 0.01556952211131428], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 301.9230769230769, 161, 858, 170.0, 828.4, 858.0, 858.0, 0.06427243602420599, 11.913851026690365, 0.14202026034044615], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9518b70e-4597-41d8-bf4b-379303f88115", 1, 0, 0.0, 410.0, 410, 410, 410.0, 410.0, 410.0, 410.0, 2.4390243902439024, 0.4406440548780488, 1.681592987804878], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 10, 0, 0.0, 87.30000000000001, 82, 106, 84.5, 104.5, 106.0, 106.0, 0.05322687957418497, 0.044130489021956085, 0.01892049234863606], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 94.81249999999999, 81, 250, 83.0, 140.1000000000001, 250.0, 250.0, 0.07986662274002417, 0.0620058252717961, 0.028390088552117963], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=98ce4be3-83b4-445a-99b7-7726672706e7", 1, 0, 0.0, 1216.0, 1216, 1216, 1216.0, 1216.0, 1216.0, 1216.0, 0.8223684210526315, 0.14857241981907895, 0.5669844777960527], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b641533f-e366-4bea-aeb6-caba2ef2775d", 1, 0, 0.0, 432.0, 432, 432, 432.0, 432.0, 432.0, 432.0, 2.314814814814815, 0.41820384837962965, 1.5959563078703705], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/88eb2b32-b288-44d8-84b2-e1c27655d86a", 3, 0, 0.0, 304.0, 206, 407, 299.0, 407.0, 407.0, 407.0, 0.034515687379914166, 0.028774308391914125, 0.02213408337839548], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 82.21052631578947, 79, 89, 81.0, 89.0, 89.0, 89.0, 0.11242204418778032, 0.08354802307314534, 0.05643059639894442], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 97.6842105263158, 79, 239, 81.0, 236.0, 239.0, 239.0, 0.11242936181543833, 0.03897119737270333, 0.06362290674280303], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 171.68421052631578, 78, 937, 81.0, 318.0, 937.0, 937.0, 0.11232434541509757, 5.3481364227208505, 0.0655263836585813], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 143.4736842105263, 79, 658, 81.0, 237.0, 658.0, 658.0, 0.11232434541509757, 1.7669492449143676, 0.06563607540215072], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 30.434782608695652, 0.5263157894736842], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 4.3478260869565215, 0.07518796992481203], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.3478260869565215, 0.07518796992481203], "isController": false}, {"data": ["401/Unauthorized", 14, 60.869565217391305, 1.0526315789473684], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1330, 23, "401/Unauthorized", 14, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
