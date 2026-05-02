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

    var data = {"OkPercent": 97.42813918305598, "KoPercent": 2.571860816944024};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.762799740764744, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.10344827586206896, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/59dabdc8-59cf-4936-93a5-f5dc89a6a893"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ac06d0ce-9727-4a20-91ca-b342ca7be36a"], "isController": false}, {"data": [0.4666666666666667, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e56e8776-9a5f-4d17-a29a-1d0a8f006a8e"], "isController": false}, {"data": [0.75, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c7719745-d42f-43ca-98e2-e8cf816fb3d8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2e3f7696-75cc-4da7-ac17-d9d772c63f1e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e04cad22-530e-4054-aed6-b855b783d262"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e04cad22-530e-4054-aed6-b855b783d262"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/936ffccb-9e4b-43b8-9c13-fdec530368a1"], "isController": false}, {"data": [0.6956521739130435, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7b1b97c3-7c83-41ce-b13f-34f543d2abf7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5c2db33c-c325-42b8-9eee-d6275438aa66"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dbcc6f7f-b1e7-4b92-a87b-49c0344cf5a1"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f44ade9f-dd97-466a-869a-4abf09a280f7"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.23333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6344b206-baea-4bfb-85bd-5bcca35e8cea"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dbe33887-8a7f-45d4-bf8e-3e2aa8033da4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/41f9ee5d-a809-46e1-b924-e6c90fd8bbc5"], "isController": false}, {"data": [0.20833333333333334, 500, 1500, "register"], "isController": true}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e56e8776-9a5f-4d17-a29a-1d0a8f006a8e"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.3793103448275862, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.20833333333333334, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.30434782608695654, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1722ff1f-303f-434e-938b-d0520b54272a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ac06d0ce-9727-4a20-91ca-b342ca7be36a"], "isController": false}, {"data": [0.2727272727272727, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=59dabdc8-59cf-4936-93a5-f5dc89a6a893"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9196428571428571, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/dbe33887-8a7f-45d4-bf8e-3e2aa8033da4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5c2db33c-c325-42b8-9eee-d6275438aa66"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7b1b97c3-7c83-41ce-b13f-34f543d2abf7"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=936ffccb-9e4b-43b8-9c13-fdec530368a1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/dbcc6f7f-b1e7-4b92-a87b-49c0344cf5a1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=41f9ee5d-a809-46e1-b924-e6c90fd8bbc5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6344b206-baea-4bfb-85bd-5bcca35e8cea"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f44ade9f-dd97-466a-869a-4abf09a280f7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1322, 34, 2.571860816944024, 369.14220877458416, 100, 3890, 116.0, 1040.9000000000003, 1251.9499999999994, 1639.31, 5.179317207713344, 753.2743381629879, 3.7908244338305006], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 1714.5344827586212, 1215, 2319, 1728.5, 2074.5, 2148.5, 2319.0, 0.2528026221734052, 304.207680691219, 1.2430285182061476], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/59dabdc8-59cf-4936-93a5-f5dc89a6a893", 3, 0, 0.0, 430.0, 218, 775, 297.0, 775.0, 775.0, 775.0, 0.029355069131187805, 0.02447211329588931, 0.01882470253529947], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ac06d0ce-9727-4a20-91ca-b342ca7be36a", 3, 0, 0.0, 293.3333333333333, 210, 455, 215.0, 455.0, 455.0, 455.0, 0.05077430820005077, 0.032642987856477956, 0.03256034738089193], "isController": false}, {"data": ["deleteBook", 15, 3, 20.0, 592.5333333333335, 105, 1317, 607.0, 1146.0, 1317.0, 1317.0, 0.07980081716036772, 0.016240713179902964, 0.05347589915570736], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, 20.0, 592.5333333333335, 105, 1317, 607.0, 1146.0, 1317.0, 1317.0, 0.0793873414237855, 0.016156564406950097, 0.05319882195800939], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 113.36842105263156, 100, 306, 103.0, 105.0, 306.0, 306.0, 0.12270889574910553, 0.04253437463671709, 0.06944001553236286], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 104.36842105263156, 102, 115, 103.0, 109.0, 115.0, 115.0, 0.12270651829941683, 0.0911910746346252, 0.061592920318261954], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 140.10526315789474, 100, 605, 103.0, 306.0, 605.0, 605.0, 0.12270493338413749, 1.9302439608183775, 0.07170191137151825], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 187.1578947368421, 101, 1106, 103.0, 304.0, 1106.0, 1106.0, 0.12270968825280779, 5.842617205916545, 0.07158485617132856], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e56e8776-9a5f-4d17-a29a-1d0a8f006a8e", 1, 0, 0.0, 580.0, 580, 580, 580.0, 580.0, 580.0, 580.0, 1.7241379310344827, 0.31148976293103453, 1.1887122844827587], "isController": false}, {"data": ["goToProfile", 16, 4, 25.0, 212.56249999999997, 102, 375, 212.5, 340.70000000000005, 375.0, 375.0, 0.08051732380545001, 0.13275234789774298, 0.05203353420728178], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/c7719745-d42f-43ca-98e2-e8cf816fb3d8", 1, 0, 0.0, 314.0, 314, 314, 314.0, 314.0, 314.0, 314.0, 3.1847133757961785, 1.0169934315286624, 1.9002537818471337], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 115.21052631578948, 102, 317, 104.0, 109.0, 317.0, 317.0, 0.09056762064560414, 0.06730660088994604, 0.04546070020687551], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 157.21052631578948, 101, 310, 104.0, 309.0, 310.0, 310.0, 0.09048265352287069, 0.03136384741767269, 0.05120343417386956], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 736.25, 601, 906, 774.5, 906.0, 906.0, 906.0, 0.0519757273353344, 15.282589593159994, 0.0296424069959329], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 1019.875, 898, 1215, 1008.5, 1215.0, 1215.0, 1215.0, 0.05194164356345646, 46.737182182068445, 0.029572244333491322], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 256.375, 101, 315, 306.0, 315.0, 315.0, 315.0, 0.05224899257411193, 0.092456225140909, 0.028930838661642054], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2e3f7696-75cc-4da7-ac17-d9d772c63f1e", 1, 0, 0.0, 434.0, 434, 434, 434.0, 434.0, 434.0, 434.0, 2.304147465437788, 0.7357970910138248, 1.3748379896313365], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 131.4, 101, 304, 104.0, 304.0, 304.0, 304.0, 0.07367785096444307, 0.05475473103900506, 0.036982827534886464], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 115.86666666666666, 101, 302, 103.0, 183.20000000000007, 302.0, 302.0, 0.07368183202507146, 0.019715646459833577, 0.04202166982679857], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 130.53333333333333, 100, 305, 104.0, 305.0, 305.0, 305.0, 0.0736829178435466, 0.01985984895001842, 0.04331749662286627], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 170.39999999999998, 102, 305, 104.0, 305.0, 305.0, 305.0, 0.07368183202507146, 0.019859556288007545, 0.043388813194451266], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 129.99999999999997, 102, 306, 104.0, 306.0, 306.0, 306.0, 0.05217879062608027, 0.03877740201801473, 0.02929961387694937], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 201.57894736842107, 101, 1153, 105.0, 306.0, 1153.0, 1153.0, 0.0905684840742471, 4.312267359654601, 0.052834719070862686], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 766.625, 101, 1326, 1012.5, 1251.1000000000001, 1326.0, 1326.0, 0.07658287224062339, 43.07611746675825, 0.040909014761348624], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 151.6842105263158, 101, 604, 104.0, 307.0, 604.0, 604.0, 0.09056934751935324, 1.4247262213753193, 0.05292366940519773], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 517.625, 101, 914, 603.0, 909.1, 914.0, 914.0, 0.07658507165490766, 14.081836982691774, 0.04098497975282168], "isController": false}, {"data": ["deleteBooks", 15, 3, 20.0, 431.66666666666663, 104, 1414, 404.0, 1022.2000000000003, 1414.0, 1414.0, 0.07960262370247724, 0.016200377714449467, 0.05374731838661402], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/e04cad22-530e-4054-aed6-b855b783d262", 3, 0, 0.0, 353.3333333333333, 208, 455, 397.0, 455.0, 455.0, 455.0, 0.041804854937153364, 0.034850987465511, 0.02680845189654692], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 303.26666666666665, 206, 609, 214.0, 609.0, 609.0, 609.0, 0.07364059462325472, 0.11412853873740746, 0.16561942325913634], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e04cad22-530e-4054-aed6-b855b783d262", 1, 0, 0.0, 404.0, 404, 404, 404.0, 404.0, 404.0, 404.0, 2.4752475247524752, 0.44718827351485146, 1.7065671410891088], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/936ffccb-9e4b-43b8-9c13-fdec530368a1", 3, 0, 0.0, 408.3333333333333, 198, 623, 404.0, 623.0, 623.0, 623.0, 0.01703741985313744, 0.023487458684256855, 0.010925689163633059], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 663.3913043478261, 202, 1336, 582.0, 1179.0, 1307.3999999999996, 1336.0, 0.0988027681958185, 0.06069037226090804, 0.04467351726041403], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 103.875, 101, 111, 103.0, 106.80000000000001, 111.0, 111.0, 0.07658360536468156, 0.05691418328371354, 0.03844138003656867], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 180.1875, 101, 324, 104.0, 312.8, 324.0, 324.0, 0.07658433850277618, 0.09238359778862723, 0.039657075674899483], "isController": false}, {"data": ["login", 23, 0, 0.0, 2887.956521739131, 1622, 5397, 2713.0, 4579.000000000001, 5276.999999999998, 5397.0, 0.09657494845836989, 40.31627672344294, 0.20141240206040553], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/7b1b97c3-7c83-41ce-b13f-34f543d2abf7", 3, 0, 0.0, 484.3333333333333, 195, 1043, 215.0, 1043.0, 1043.0, 1043.0, 0.036061593201187625, 0.02285544334723708, 0.02312543574425118], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5c2db33c-c325-42b8-9eee-d6275438aa66", 1, 0, 0.0, 205.0, 205, 205, 205.0, 205.0, 205.0, 205.0, 4.878048780487805, 0.8812881097560976, 3.363185975609756], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 119.57894736842105, 103, 307, 108.0, 119.0, 307.0, 307.0, 0.09415589242441512, 0.07622581525375013, 0.03346947738524131], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dbcc6f7f-b1e7-4b92-a87b-49c0344cf5a1", 1, 0, 0.0, 292.0, 292, 292, 292.0, 292.0, 292.0, 292.0, 3.4246575342465753, 0.6187125428082192, 2.361140839041096], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 871.9375, 209, 1432, 1116.5, 1356.4, 1432.0, 1432.0, 0.07654403674113763, 57.277784962086784, 0.15990901425632684], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f44ade9f-dd97-466a-869a-4abf09a280f7", 1, 0, 0.0, 375.0, 375, 375, 375.0, 375.0, 375.0, 375.0, 2.6666666666666665, 0.4817708333333333, 1.8385416666666667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 303.7894736842105, 206, 1211, 209.0, 409.0, 1211.0, 1211.0, 0.12262178279164623, 7.900999952403387, 0.27412800383031727], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 15, 7, 46.666666666666664, 662.8, 101, 1522, 1001.0, 1337.2, 1522.0, 1522.0, 0.09719684304653785, 62.02878514880837, 0.14683304336275158], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6344b206-baea-4bfb-85bd-5bcca35e8cea", 1, 0, 0.0, 220.0, 220, 220, 220.0, 220.0, 220.0, 220.0, 4.545454545454545, 0.8212002840909091, 3.133877840909091], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dbe33887-8a7f-45d4-bf8e-3e2aa8033da4", 1, 0, 0.0, 431.0, 431, 431, 431.0, 431.0, 431.0, 431.0, 2.320185614849188, 0.41917415893271465, 1.599659222737819], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/41f9ee5d-a809-46e1-b924-e6c90fd8bbc5", 3, 0, 0.0, 289.6666666666667, 196, 444, 229.0, 444.0, 444.0, 444.0, 0.021715840982135103, 0.025667388869183776, 0.013925848546486378], "isController": false}, {"data": ["register", 24, 9, 37.5, 1020.1250000000001, 108, 2448, 960.0, 1627.5, 2257.25, 2448.0, 0.09351693825544151, 0.029087055502302856, 0.042192212376966784], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 350.3157894736843, 206, 1257, 214.0, 624.0, 1257.0, 1257.0, 0.09043700110904322, 5.827208879128568, 0.2021770848703657], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 10, 0, 0.0, 107.30000000000001, 103, 118, 105.5, 117.5, 118.0, 118.0, 0.09041509570437879, 0.0701953135595519, 0.032139741051165904], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e56e8776-9a5f-4d17-a29a-1d0a8f006a8e", 3, 0, 0.0, 295.3333333333333, 201, 453, 232.0, 453.0, 453.0, 453.0, 0.01663441438544156, 0.022931883112742517, 0.010667251412539023], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 348.157894736842, 204, 1325, 219.0, 608.0, 1325.0, 1325.0, 0.10482180293501048, 6.7540777922597375, 0.23433513150998567], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 136.99999999999997, 101, 308, 105.0, 308.0, 308.0, 308.0, 0.032105084528101124, 0.023859345044809525, 0.01611524750726951], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 103.28571428571428, 101, 108, 103.0, 108.0, 108.0, 108.0, 0.03210744067003642, 0.008591248773037088, 0.018311274757130146], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 161.14285714285717, 102, 304, 104.0, 304.0, 304.0, 304.0, 0.032107293401033854, 0.008653918924497406, 0.018875576784592167], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 161.0, 101, 305, 104.0, 305.0, 305.0, 305.0, 0.032107587940389974, 0.008653998312058235, 0.01890710500786636], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 109.0, 104, 114, 109.0, 114.0, 114.0, 114.0, 0.039825299685380136, 0.01174535205564922, 0.024618569043794558], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 1191.1034482758619, 800, 1876, 1118.0, 1632.5, 1723.7, 1876.0, 0.25000431041914517, 299.0920708223417, 0.49366085514405417], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 9, 37.5, 1020.1250000000001, 108, 2448, 960.0, 1627.5, 2257.25, 2448.0, 0.0940269387179427, 0.029245683575844478, 0.042422310241884295], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 127.875, 100, 303, 103.0, 303.0, 303.0, 303.0, 0.04876948493327725, 0.013144900235922383, 0.0287187494284826], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 103.5, 102, 107, 103.0, 107.0, 107.0, 107.0, 0.048829317122000046, 0.013161026880539075, 0.02870629776117581], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 10, 0, 0.0, 243.49999999999997, 101, 1102, 103.5, 1022.7000000000003, 1102.0, 1102.0, 0.09974564859607998, 8.999327106503417, 0.057782342526557284], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 10, 0, 0.0, 193.49999999999997, 101, 606, 102.5, 576.2, 606.0, 606.0, 0.09974664352544536, 2.95707886343687, 0.0578803277175973], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 128.75, 101, 303, 104.0, 303.0, 303.0, 303.0, 0.04876948493327725, 0.013049647335662076, 0.02781384687600968], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 10, 0, 0.0, 123.79999999999997, 101, 304, 103.0, 284.80000000000007, 304.0, 304.0, 0.0997476384746591, 0.07412886023360897, 0.05006863884372537], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 128.75, 102, 305, 104.0, 305.0, 305.0, 305.0, 0.0488287210537238, 0.036287750704964664, 0.024509729122669955], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 10, 0, 0.0, 163.60000000000002, 101, 307, 103.0, 306.9, 307.0, 307.0, 0.09974564859607998, 0.041671082489651394, 0.05604848261932074], "isController": false}, {"data": ["deleteAccount", 15, 3, 20.0, 474.93333333333334, 101, 1043, 453.0, 883.4000000000001, 1043.0, 1043.0, 0.07934744659916844, 0.015714513838194687, 0.053993457803027896], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 131.87499999999997, 105, 310, 106.5, 310.0, 310.0, 310.0, 0.05217776966123583, 0.04106961166694929, 0.018547566559267425], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1589.0, 892, 3890, 1367.0, 2710.6000000000004, 3678.5999999999967, 3890.0, 0.09644535951056077, 0.04991800834042696, 0.04436109797800207], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 258.625, 205, 608, 209.0, 608.0, 608.0, 608.0, 0.04873858450965938, 0.075535286735185, 0.10961421887279839], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1722ff1f-303f-434e-938b-d0520b54272a", 1, 0, 0.0, 236.0, 236, 236, 236.0, 236.0, 236.0, 236.0, 4.237288135593221, 1.3531183792372883, 2.5283037605932206], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ac06d0ce-9727-4a20-91ca-b342ca7be36a", 1, 0, 0.0, 495.0, 495, 495, 495.0, 495.0, 495.0, 495.0, 2.0202020202020203, 0.36497790404040403, 1.392834595959596], "isController": false}, {"data": ["addBook", 55, 12, 21.818181818181817, 1013.2181818181823, 520, 2499, 838.0, 1846.0, 1999.7999999999997, 2499.0, 0.25004318927814806, 77.15302813667816, 0.9081602376205891], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=59dabdc8-59cf-4936-93a5-f5dc89a6a893", 1, 0, 0.0, 508.0, 508, 508, 508.0, 508.0, 508.0, 508.0, 1.968503937007874, 0.35563791830708663, 1.357191190944882], "isController": false}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 186.7931034482758, 102, 435, 105.0, 413.4, 419.29999999999995, 435.0, 0.2512497509161952, 0.18671978559299274, 0.12145373701515295], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 647.8793103448277, 501, 916, 608.0, 811.9, 909.05, 916.0, 0.25108333802310834, 73.82683813025164, 0.12627726472841874], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 157.41379310344837, 100, 437, 106.0, 307.1, 310.05, 437.0, 0.2514043969762119, 0.4448679368368125, 0.12226502899819681], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 1002.8793103448278, 696, 1423, 1005.0, 1306.4, 1317.1, 1423.0, 0.25049342886634446, 225.3944276144172, 0.12573595941142682], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 107.1578947368421, 104, 112, 107.0, 110.0, 112.0, 112.0, 0.10538284478216256, 0.07872839478354919, 0.03746030810615935], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 12, 7.142857142857143, 160.29166666666669, 102, 1273, 108.0, 260.1, 330.2999999999999, 929.3800000000011, 0.7125195624790591, 1.6315733773215202, 0.33799450925215135], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 106.42857142857143, 103, 114, 105.0, 114.0, 114.0, 114.0, 0.03334365398813918, 0.025821794543549194, 0.011852627003596352], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 127.99999999999999, 103, 308, 106.0, 307.0, 308.0, 308.0, 0.11731653854465747, 0.09520512063536167, 0.04170236331079621], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dbe33887-8a7f-45d4-bf8e-3e2aa8033da4", 3, 0, 0.0, 440.66666666666663, 195, 701, 426.0, 701.0, 701.0, 701.0, 0.024754109182124232, 0.02482663098636874, 0.015874217151297117], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5c2db33c-c325-42b8-9eee-d6275438aa66", 3, 0, 0.0, 316.0, 194, 452, 302.0, 452.0, 452.0, 452.0, 0.12129543524845349, 0.05488302571463227, 0.07778385658836372], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 299.42857142857144, 203, 612, 210.0, 612.0, 612.0, 612.0, 0.03208963092340205, 0.04973266042523345, 0.07217033204745597], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7b1b97c3-7c83-41ce-b13f-34f543d2abf7", 1, 0, 0.0, 761.0, 761, 761, 761.0, 761.0, 761.0, 761.0, 1.314060446780552, 0.23740349868593955, 0.9059830814717477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 10, 0, 0.0, 408.7, 205, 1206, 308.0, 1146.4, 1206.0, 1206.0, 0.09964426995625617, 12.059905123085585, 0.2215528064808633], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=936ffccb-9e4b-43b8-9c13-fdec530368a1", 1, 0, 0.0, 1414.0, 1414, 1414, 1414.0, 1414.0, 1414.0, 1414.0, 0.7072135785007072, 0.12776807814710042, 0.48759061173974544], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dbcc6f7f-b1e7-4b92-a87b-49c0344cf5a1", 3, 0, 0.0, 449.0, 195, 777, 375.0, 777.0, 777.0, 777.0, 0.061739828363277155, 0.02861898293922743, 0.03959227274598177], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 121.73333333333333, 103, 308, 106.0, 197.60000000000008, 308.0, 308.0, 0.07317751401349394, 0.06067159120845347, 0.026012319434484173], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 120.18750000000001, 103, 311, 106.5, 177.30000000000013, 311.0, 311.0, 0.07693306342650248, 0.059728306078192836, 0.027347299889889553], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=41f9ee5d-a809-46e1-b924-e6c90fd8bbc5", 1, 0, 0.0, 463.0, 463, 463, 463.0, 463.0, 463.0, 463.0, 2.1598272138228944, 0.3902031587473002, 1.4890996220302375], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6344b206-baea-4bfb-85bd-5bcca35e8cea", 3, 0, 0.0, 356.0, 261, 463, 344.0, 463.0, 463.0, 463.0, 0.06892273761113792, 0.03118574390608128, 0.04419850035610081], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 115.0, 101, 302, 104.0, 114.0, 302.0, 302.0, 0.10488140121552024, 0.07794408820801846, 0.05264554709450918], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f44ade9f-dd97-466a-869a-4abf09a280f7", 3, 0, 0.0, 623.0, 326, 1089, 454.0, 1089.0, 1089.0, 1089.0, 0.019533920653214305, 0.02308843290749386, 0.012526635314724017], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 146.78947368421052, 101, 307, 103.0, 306.0, 307.0, 307.0, 0.10488429606076664, 0.03635586413619502, 0.05935321235757817], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 210.0, 101, 1210, 103.0, 411.0, 1210.0, 1210.0, 0.10488429606076664, 4.993890877895359, 0.06118609993265325], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 188.3684210526316, 101, 604, 104.0, 408.0, 604.0, 604.0, 0.10488429606076664, 1.6499114866244922, 0.06128852600302509], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 26.470588235294116, 0.680786686838124], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 11.764705882352942, 0.30257186081694404], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 8.823529411764707, 0.22692889561270801], "isController": false}, {"data": ["401/Unauthorized", 18, 52.94117647058823, 1.361573373676248], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1322, 34, "401/Unauthorized", 18, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 15, 7, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
