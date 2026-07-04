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

    var data = {"OkPercent": 98.4771573604061, "KoPercent": 1.5228426395939085};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8023839397741531, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.19827586206896552, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bec1c460-f564-45ea-9655-105141122aac"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7916666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/98702493-545c-445f-a501-0efa6bf8995c"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ad4bc9ae-7ebf-4c2b-9492-82c3cdd2406d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/63b884ef-5dd9-44b2-8900-50c61f44539a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.625, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8726d9e9-8111-4adb-abdb-c3da8c99f875"], "isController": false}, {"data": [0.675, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/35c99d0d-95fa-4cb6-8529-d0fdf7615c81"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/42fddc70-617d-4402-b7bb-d3bb873c99b4"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c0111ae5-3134-423b-a34d-93926e20936d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4798c9c4-1b83-4230-90f2-d3350030684a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/84dff999-e7df-45d5-b6d2-17bd89b3b91c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/34fd0b1b-bb10-49f4-9784-c91317b35b80"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8236ef4e-60b8-45c5-8368-f21d9fb8fa18"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4396551724137931, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=35c99d0d-95fa-4cb6-8529-d0fdf7615c81"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.325, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bec1c460-f564-45ea-9655-105141122aac"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=63b884ef-5dd9-44b2-8900-50c61f44539a"], "isController": false}, {"data": [0.36363636363636365, 500, 1500, "addBook"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6b49d19f-0f0a-416e-9c68-8520cdee3287"], "isController": false}, {"data": [0.9913793103448276, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.6206896551724138, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d0b1586b-8b84-41f0-a3e4-d328a7f3523b"], "isController": false}, {"data": [0.49137931034482757, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9368421052631579, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=84dff999-e7df-45d5-b6d2-17bd89b3b91c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=34fd0b1b-bb10-49f4-9784-c91317b35b80"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8726d9e9-8111-4adb-abdb-c3da8c99f875"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6b49d19f-0f0a-416e-9c68-8520cdee3287"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=98702493-545c-445f-a501-0efa6bf8995c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4798c9c4-1b83-4230-90f2-d3350030684a"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c0111ae5-3134-423b-a34d-93926e20936d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8236ef4e-60b8-45c5-8368-f21d9fb8fa18"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1379, 21, 1.5228426395939085, 337.13850616388606, 92, 3805, 108.0, 935.0, 1180.0, 1670.4000000000074, 5.414064002952412, 736.256336017954, 3.974220256019662], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 1575.0862068965516, 1143, 2441, 1535.0, 1940.1, 2030.9999999999995, 2441.0, 0.25196795662675725, 303.2024027642623, 1.2389244742341043], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bec1c460-f564-45ea-9655-105141122aac", 1, 0, 0.0, 786.0, 786, 786, 786.0, 786.0, 786.0, 786.0, 1.272264631043257, 0.22985249681933842, 0.8771668256997455], "isController": false}, {"data": ["deleteBook", 12, 1, 8.333333333333334, 535.0, 97, 1316, 480.0, 1156.4000000000005, 1316.0, 1316.0, 0.08680806736306028, 0.01650963976460546, 0.05865619981408606], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, 8.333333333333334, 535.0, 97, 1316, 480.0, 1156.4000000000005, 1316.0, 1316.0, 0.08511060832807303, 0.0161868075897385, 0.05750922696516848], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 129.11764705882354, 94, 285, 95.0, 284.2, 285.0, 285.0, 0.09259662730402196, 0.032957760959083184, 0.05235156284042877], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 97.88235294117646, 94, 112, 97.0, 103.19999999999999, 112.0, 112.0, 0.09259360123748624, 0.0688122368571553, 0.04647764749616008], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 156.8235294117647, 93, 575, 96.0, 341.3999999999998, 575.0, 575.0, 0.09250240778326141, 1.623393875932506, 0.054004019433667616], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 216.8235294117647, 93, 1395, 99.0, 507.7999999999992, 1395.0, 1395.0, 0.09250240778326141, 4.91957327993133, 0.05391368505106677], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/98702493-545c-445f-a501-0efa6bf8995c", 3, 0, 0.0, 390.6666666666667, 197, 646, 329.0, 646.0, 646.0, 646.0, 0.022473593527605064, 0.02253943413364297, 0.014411777099408194], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 200.6923076923077, 94, 290, 197.0, 268.4, 290.0, 290.0, 0.08140976666708416, 0.18803992679383288, 0.05262402660533797], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ad4bc9ae-7ebf-4c2b-9492-82c3cdd2406d", 2, 0, 0.0, 247.5, 217, 278, 247.5, 278.0, 278.0, 278.0, 0.04062893592816804, 0.0359074091943282, 0.025254216521756797], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 117.55555555555556, 93, 293, 97.0, 281.3, 293.0, 293.0, 0.09010858083991209, 0.06696545900309873, 0.045230283741909], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 149.1111111111111, 92, 301, 97.0, 292.90000000000003, 301.0, 301.0, 0.09010858083991209, 0.024111085107554605, 0.05139005001026237], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 663.0, 554, 785, 654.5, 785.0, 785.0, 785.0, 0.1511639625113373, 44.447224094275924, 0.08621069736974706], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1060.5, 831, 1253, 1067.5, 1253.0, 1253.0, 1253.0, 0.14977159831257333, 134.76474743204113, 0.08527035333616236], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 158.83333333333334, 94, 286, 97.5, 286.0, 286.0, 286.0, 0.1536806516059628, 0.27194271553711385, 0.08509465767634855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 120.81249999999999, 93, 288, 96.0, 285.2, 288.0, 288.0, 0.08929717541872004, 0.06636245165395112, 0.04482299625509971], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 130.18750000000003, 93, 284, 95.0, 282.6, 284.0, 284.0, 0.08929916895960886, 0.023894504194270343, 0.050928432297276935], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 106.9375, 93, 287, 95.0, 155.40000000000015, 287.0, 287.0, 0.08929966735873908, 0.024069050967785145, 0.05249843725582122], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 142.25, 93, 288, 95.0, 286.6, 288.0, 288.0, 0.08929867056604196, 0.024068782301003493, 0.05258505698371415], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/63b884ef-5dd9-44b2-8900-50c61f44539a", 3, 0, 0.0, 809.6666666666666, 198, 1339, 892.0, 1339.0, 1339.0, 1339.0, 0.03564638783269962, 0.029716926835788974, 0.02285917448906844], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 96.0, 95, 100, 95.0, 100.0, 100.0, 100.0, 0.15367671541633585, 0.11420701214046051, 0.08629307750429015], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 613.6666666666666, 94, 1394, 838.5, 1241.0000000000002, 1394.0, 1394.0, 0.08598205841047835, 42.991859544127905, 0.04644299986625013], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 117.05555555555557, 94, 288, 95.5, 282.6, 288.0, 288.0, 0.09002160518524446, 0.02426363577258542, 0.05292285773585661], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 470.94444444444446, 95, 867, 658.0, 851.7, 867.0, 867.0, 0.08598246912990518, 14.055689322649215, 0.046527188970359935], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 117.3888888888889, 94, 290, 96.0, 281.90000000000003, 290.0, 290.0, 0.09010903192863365, 0.024287200012014537, 0.0530622522001622], "isController": false}, {"data": ["deleteBooks", 12, 1, 8.333333333333334, 730.7499999999999, 115, 2693, 491.5, 2331.800000000001, 2693.0, 2693.0, 0.08536793580331228, 0.016235747556342835, 0.058350040105144836], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 276.24999999999994, 188, 577, 194.5, 572.1, 577.0, 577.0, 0.08924985496898567, 0.13831984358962918, 0.20072501561872463], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8726d9e9-8111-4adb-abdb-c3da8c99f875", 3, 0, 0.0, 303.3333333333333, 194, 417, 299.0, 417.0, 417.0, 417.0, 0.026102845210127904, 0.026179318389454448, 0.016739129252588532], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 590.2999999999998, 151, 1502, 546.0, 1148.5, 1484.5999999999997, 1502.0, 0.09037219789703896, 0.055511828591052255, 0.04086164807258695], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 97.49999999999999, 94, 102, 97.0, 100.2, 102.0, 102.0, 0.0859804155720086, 0.06389755493193218, 0.04315813828516838], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 159.72222222222223, 94, 297, 98.5, 286.20000000000005, 297.0, 297.0, 0.08598205841047835, 0.09475192981953322, 0.045024893000105086], "isController": false}, {"data": ["login", 20, 0, 0.0, 2763.15, 1701, 5237, 2519.0, 4797.500000000002, 5219.549999999999, 5237.0, 0.09302888081604935, 33.51455371429435, 0.186639192137199], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 101.88888888888889, 96, 121, 100.5, 110.20000000000002, 121.0, 121.0, 0.09175106915481974, 0.07427894172787652, 0.03261463786362733], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/35c99d0d-95fa-4cb6-8529-d0fdf7615c81", 3, 0, 0.0, 392.3333333333333, 236, 478, 463.0, 478.0, 478.0, 478.0, 0.0170382907186751, 0.02348865924270477, 0.010926247628837874], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/42fddc70-617d-4402-b7bb-d3bb873c99b4", 1, 0, 0.0, 192.0, 192, 192, 192.0, 192.0, 192.0, 192.0, 5.208333333333333, 1.6632080078125, 3.1077067057291665], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c0111ae5-3134-423b-a34d-93926e20936d", 3, 0, 0.0, 580.6666666666667, 212, 1240, 290.0, 1240.0, 1240.0, 1240.0, 0.020356924747234852, 0.028063664161633983, 0.013054408122412974], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4798c9c4-1b83-4230-90f2-d3350030684a", 3, 0, 0.0, 286.0, 188, 401, 269.0, 401.0, 401.0, 401.0, 0.048243921265920496, 0.03101619287115657, 0.03093767086388782], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/84dff999-e7df-45d5-b6d2-17bd89b3b91c", 3, 0, 0.0, 335.0, 218, 421, 366.0, 421.0, 421.0, 421.0, 0.018243736317197765, 0.02515046331488689, 0.011699271010702993], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/34fd0b1b-bb10-49f4-9784-c91317b35b80", 3, 0, 0.0, 294.6666666666667, 221, 385, 278.0, 385.0, 385.0, 385.0, 0.029554611997202166, 0.029641197774537716, 0.01895266459455998], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 713.0555555555557, 191, 1495, 936.5, 1343.8000000000002, 1495.0, 1495.0, 0.08594100627369346, 57.17881936155381, 0.18106733060072763], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 349.0, 190, 1494, 210.0, 607.5999999999992, 1494.0, 1494.0, 0.09245109608931863, 6.640950023384689, 0.20653324194723763], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, 25.0, 891.375, 94, 1353, 1116.0, 1353.0, 1353.0, 1353.0, 0.15645779550966127, 140.3939038909098, 0.290512637633967], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8236ef4e-60b8-45c5-8368-f21d9fb8fa18", 1, 0, 0.0, 519.0, 519, 519, 519.0, 519.0, 519.0, 519.0, 1.9267822736030829, 0.3481003131021195, 1.3284260597302504], "isController": false}, {"data": ["register", 22, 7, 31.818181818181817, 1048.409090909091, 192, 2339, 993.5, 1737.1999999999998, 2261.1499999999987, 2339.0, 0.08802781679010567, 0.027555582564090252, 0.03971567515334846], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 289.72222222222223, 191, 585, 198.0, 564.3000000000001, 585.0, 585.0, 0.08997840518275613, 0.13944895412600974, 0.20236354212489002], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 100.75, 96, 118, 100.0, 111.0, 118.0, 118.0, 0.08628220753027967, 0.06698667479157455, 0.0306706284580291], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 375.77777777777777, 192, 1149, 379.5, 626.1000000000008, 1149.0, 1149.0, 0.10714030618318611, 7.27776919559951, 0.23943812349705962], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 114.5, 94, 285, 97.0, 233.40000000000018, 285.0, 285.0, 0.06287693412069227, 0.04672787779867854, 0.03156127357230062], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 143.33333333333331, 94, 287, 96.5, 285.5, 287.0, 287.0, 0.06287726358148894, 0.016824580294265593, 0.03585968938631791], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 127.41666666666664, 94, 287, 96.0, 285.5, 287.0, 287.0, 0.06287759304573821, 0.016947476250609127, 0.036965147474154685], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 142.83333333333334, 93, 288, 97.0, 286.8, 288.0, 288.0, 0.06281670086687047, 0.01693106390552368, 0.036990693967502826], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 115.0, 115, 115, 115.0, 115.0, 115.0, 115.0, 8.695652173913043, 2.5645380434782608, 5.375339673913043], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 1097.4827586206898, 744, 2035, 1031.5, 1531.0, 1622.3499999999995, 2035.0, 0.24299402150916047, 290.70532811524623, 0.47981827294093987], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, 31.818181818181817, 1048.409090909091, 192, 2339, 993.5, 1737.1999999999998, 2261.1499999999987, 2339.0, 0.08880922970103584, 0.02780019033432638, 0.040068226681522025], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 158.22222222222223, 95, 284, 96.0, 284.0, 284.0, 284.0, 0.05582468567600593, 0.015046497311110974, 0.03287332564710115], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 139.55555555555554, 95, 300, 96.0, 300.0, 300.0, 300.0, 0.05582468567600593, 0.015046497311110974, 0.032818809352495676], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 194.875, 94, 925, 96.0, 867.6, 925.0, 925.0, 0.08137234459153626, 9.171563178632638, 0.046963921536716725], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 206.6875, 93, 829, 97.0, 768.1, 829.0, 829.0, 0.08137110308701623, 3.0099163085490517, 0.047042668972181255], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 97.81249999999999, 94, 114, 96.5, 104.20000000000002, 114.0, 114.0, 0.08137110308701623, 0.06047207954025327, 0.04084447947922494], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 95.77777777777777, 94, 98, 96.0, 98.0, 98.0, 98.0, 0.05582468567600593, 0.014937464721900025, 0.031837516049597135], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=35c99d0d-95fa-4cb6-8529-d0fdf7615c81", 1, 0, 0.0, 448.0, 448, 448, 448.0, 448.0, 448.0, 448.0, 2.232142857142857, 0.4032679966517857, 1.5389578683035714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 144.4375, 95, 299, 97.5, 292.7, 299.0, 299.0, 0.08137193075248693, 0.03705045186850296, 0.04555318291392885], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 97.11111111111111, 94, 102, 97.0, 102.0, 102.0, 102.0, 0.055823300645689515, 0.041485870890009484, 0.028020680206918367], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 103.22222222222223, 97, 111, 103.0, 111.0, 111.0, 111.0, 0.060517220511303274, 0.0476336716133891, 0.021511980728627336], "isController": false}, {"data": ["deleteAccount", 12, 1, 8.333333333333334, 755.7500000000001, 94, 3272, 432.0, 2662.4000000000024, 3272.0, 3272.0, 0.08641984199572222, 0.016238884697926646, 0.05881584786867065], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1574.1, 891, 3805, 1258.0, 2551.4000000000005, 3743.149999999999, 3805.0, 0.09169306662876686, 0.04745832550121722, 0.04217522888881757], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 279.1111111111111, 193, 397, 198.0, 397.0, 397.0, 397.0, 0.05579008052368289, 0.0864637283116062, 0.1254731986777751], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bec1c460-f564-45ea-9655-105141122aac", 3, 0, 0.0, 312.3333333333333, 181, 395, 361.0, 395.0, 395.0, 395.0, 0.020993554978621563, 0.024813671265421514, 0.013462663837201978], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=63b884ef-5dd9-44b2-8900-50c61f44539a", 1, 0, 0.0, 396.0, 396, 396, 396.0, 396.0, 396.0, 396.0, 2.5252525252525255, 0.456222380050505, 1.7410432449494948], "isController": false}, {"data": ["addBook", 66, 10, 15.151515151515152, 963.681818181818, 483, 2665, 809.5, 1690.0000000000002, 1920.8, 2665.0, 0.2946007713183831, 75.8890043819075, 1.0748063474191187], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6b49d19f-0f0a-416e-9c68-8520cdee3287", 3, 0, 0.0, 1219.0, 183, 3272, 202.0, 3272.0, 3272.0, 3272.0, 0.04891251182052369, 0.031000215011249877, 0.03136642196823947], "isController": false}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 179.89655172413788, 93, 695, 99.5, 386.2, 395.15, 695.0, 0.24367495441597836, 0.1810904690532808, 0.11779209222256766], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 612.155172413793, 463, 965, 561.5, 794.3000000000001, 842.4499999999999, 965.0, 0.24394142041200867, 71.72687721860515, 0.12268538233611763], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 159.448275862069, 93, 403, 99.0, 291.7, 301.59999999999997, 403.0, 0.244327803661547, 0.4323456838229719, 0.1188234826400883], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d0b1586b-8b84-41f0-a3e4-d328a7f3523b", 1, 0, 0.0, 195.0, 195, 195, 195.0, 195.0, 195.0, 195.0, 5.128205128205129, 1.6376201923076923, 3.059895833333333], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 915.5172413793102, 648, 1638, 896.0, 1216.5, 1263.1499999999996, 1638.0, 0.24374151632437793, 219.31904484055943, 0.12234681581126002], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 115.3888888888889, 96, 294, 101.0, 145.50000000000023, 294.0, 294.0, 0.09941291152803168, 0.07426843488178149, 0.035338183394730015], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 190, 10, 5.2631578947368425, 162.08947368421056, 95, 1361, 103.0, 273.9000000000001, 353.5999999999999, 1179.9100000000008, 0.7797814970163097, 1.5996021447069253, 0.3778830112288536], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 120.33333333333333, 98, 287, 105.5, 235.7000000000002, 287.0, 287.0, 0.06550790462049087, 0.050730242543016855, 0.023286012970565116], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 113.29411764705884, 96, 301, 98.0, 166.59999999999988, 301.0, 301.0, 0.09604736830210853, 0.07794469048735564, 0.03414183795114014], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=84dff999-e7df-45d5-b6d2-17bd89b3b91c", 1, 0, 0.0, 1489.0, 1489, 1489, 1489.0, 1489.0, 1489.0, 1489.0, 0.671591672263264, 0.12133247985224982, 0.4630309771658831], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=34fd0b1b-bb10-49f4-9784-c91317b35b80", 1, 0, 0.0, 445.0, 445, 445, 445.0, 445.0, 445.0, 445.0, 2.247191011235955, 0.4059866573033708, 1.5493328651685394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 291.1666666666667, 191, 574, 211.0, 517.3000000000002, 574.0, 574.0, 0.06278416374109903, 0.09730319126672282, 0.14120305575756942], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8726d9e9-8111-4adb-abdb-c3da8c99f875", 1, 0, 0.0, 506.0, 506, 506, 506.0, 506.0, 506.0, 506.0, 1.976284584980237, 0.35704360177865613, 1.3625555830039526], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 341.99999999999994, 191, 1019, 200.0, 965.1, 1019.0, 1019.0, 0.08133056809401813, 12.272744998805457, 0.18031320528852018], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6b49d19f-0f0a-416e-9c68-8520cdee3287", 1, 0, 0.0, 509.0, 509, 509, 509.0, 509.0, 509.0, 509.0, 1.9646365422396854, 0.35493921905697445, 1.3545248035363457], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=98702493-545c-445f-a501-0efa6bf8995c", 1, 0, 0.0, 386.0, 386, 386, 386.0, 386.0, 386.0, 386.0, 2.5906735751295336, 0.4680416126943005, 1.7861479922279793], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4798c9c4-1b83-4230-90f2-d3350030684a", 1, 0, 0.0, 477.0, 477, 477, 477.0, 477.0, 477.0, 477.0, 2.0964360587002098, 0.3787506551362684, 1.445394392033543], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c0111ae5-3134-423b-a34d-93926e20936d", 1, 0, 0.0, 2693.0, 2693, 2693, 2693.0, 2693.0, 2693.0, 2693.0, 0.37133308577794283, 0.06708654381730413, 0.2560167564054957], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 123.93750000000003, 96, 291, 99.0, 284.7, 291.0, 291.0, 0.0899199712256092, 0.07455278864310763, 0.03196373977160327], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 114.27777777777777, 97, 285, 103.5, 135.60000000000025, 285.0, 285.0, 0.08508546362123734, 0.06605756208875359, 0.03024522339661171], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 108.55555555555556, 93, 284, 97.5, 123.80000000000025, 284.0, 284.0, 0.10720156276055935, 0.07966834888748602, 0.0538101594325464], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 148.61111111111111, 93, 289, 97.5, 287.2, 289.0, 289.0, 0.10720475512647183, 0.037631009422106815, 0.06064001611049237], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 191.05555555555554, 93, 1054, 97.0, 365.5000000000011, 1054.0, 1054.0, 0.10720539362247024, 5.386378894012579, 0.06251321455372777], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 227.5, 94, 747, 189.0, 434.7000000000005, 747.0, 747.0, 0.10720475512647183, 1.7784985043447705, 0.06261753437996939], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8236ef4e-60b8-45c5-8368-f21d9fb8fa18", 3, 0, 0.0, 289.6666666666667, 192, 443, 234.0, 443.0, 443.0, 443.0, 0.03474675407405692, 0.028966939187389244, 0.02228226091337634], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 33.333333333333336, 0.5076142131979695], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 4.761904761904762, 0.0725163161711385], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.761904761904762, 0.0725163161711385], "isController": false}, {"data": ["401/Unauthorized", 12, 57.142857142857146, 0.8701957940536621], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1379, 21, "401/Unauthorized", 12, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 190, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
