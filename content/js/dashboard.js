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

    var data = {"OkPercent": 96.06656580937972, "KoPercent": 3.933434190620272};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7201034259857789, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c73263b5-846b-41b3-b926-a5f63665403f"], "isController": false}, {"data": [0.10526315789473684, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b49a9f48-4eff-408b-8a00-66c1d3291309"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c15f4fe9-3ff3-4a40-aa10-e603f8fa7aab"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7e0a5cdb-52ac-4f8a-a05a-b5be7412edb0"], "isController": false}, {"data": [0.39473684210526316, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3125, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.3125, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=47093ecf-f054-4c59-85cd-29932bd36a4c"], "isController": false}, {"data": [0.057692307692307696, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/42ce2fec-3946-40f3-80ee-b4431ad54151"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.34375, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/47093ecf-f054-4c59-85cd-29932bd36a4c"], "isController": false}, {"data": [0.041666666666666664, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.65625, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/7e0a5cdb-52ac-4f8a-a05a-b5be7412edb0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/52dcf227-6fbb-4130-a153-e1a1c9fa4360"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b49a9f48-4eff-408b-8a00-66c1d3291309"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.17592592592592593, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9912280701754386, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c8e64687-6466-45cd-ad13-cb37239d1c35"], "isController": false}, {"data": [0.5526315789473685, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.40625, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8424242424242424, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b9ebc3b0-9f7c-417e-808d-3850eae13aad"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=52dcf227-6fbb-4130-a153-e1a1c9fa4360"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/75324060-1b39-48e3-9806-ac91652ccdb4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=90085d5a-6c78-4522-adfe-7a2152fedc20"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/c15f4fe9-3ff3-4a40-aa10-e603f8fa7aab"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b9ebc3b0-9f7c-417e-808d-3850eae13aad"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6fbba99a-9abe-454c-9b6c-3bfafe845325"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/90085d5a-6c78-4522-adfe-7a2152fedc20"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/c73263b5-846b-41b3-b926-a5f63665403f"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6fbba99a-9abe-454c-9b6c-3bfafe845325"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2619047619047619, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7d59cf9f-c621-4a73-87d3-8b850c9c1654"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/7d59cf9f-c621-4a73-87d3-8b850c9c1654"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=75324060-1b39-48e3-9806-ac91652ccdb4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.057692307692307696, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1322, 52, 3.933434190620272, 416.08850226928905, 96, 5119, 139.0, 1096.1000000000001, 1326.6999999999998, 2507.1099999999974, 5.107441720303819, 742.8072054540388, 3.744016527712314], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c73263b5-846b-41b3-b926-a5f63665403f", 1, 0, 0.0, 828.0, 828, 828, 828.0, 828.0, 828.0, 828.0, 1.2077294685990339, 0.21819331219806765, 0.8326728562801933], "isController": false}, {"data": ["see books", 57, 0, 0.0, 1763.4736842105265, 1270, 2436, 1736.0, 2113.6000000000004, 2272.2, 2436.0, 0.24208344658874695, 291.30929966081777, 1.1903224155999423], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 126.33333333333333, 103, 306, 107.0, 210.60000000000005, 306.0, 306.0, 0.07232087325043754, 0.05614755296298618, 0.02570781041324147], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 402.56250000000006, 201, 1228, 305.5, 1098.5000000000002, 1228.0, 1228.0, 0.11241323103729309, 16.96310441871821, 0.24922474390860805], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b49a9f48-4eff-408b-8a00-66c1d3291309", 1, 0, 0.0, 235.0, 235, 235, 235.0, 235.0, 235.0, 235.0, 4.25531914893617, 0.7687832446808511, 2.9338430851063833], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 12, 0, 0.0, 367.75, 202, 799, 243.0, 773.2, 799.0, 799.0, 0.05785112014231375, 0.08965793717368352, 0.13010852508569198], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 6, 0, 0.0, 103.33333333333334, 99, 109, 103.0, 109.0, 109.0, 109.0, 0.03169622339498249, 0.023555494144122727, 0.01591001838380957], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 6, 0, 0.0, 135.66666666666666, 98, 305, 101.0, 305.0, 305.0, 305.0, 0.03169722807740463, 0.008481484856649285, 0.01807732538789483], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 6, 0, 0.0, 103.0, 100, 107, 102.5, 107.0, 107.0, 107.0, 0.031696558282046546, 0.008543212974457858, 0.01863410945878127], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c15f4fe9-3ff3-4a40-aa10-e603f8fa7aab", 1, 0, 0.0, 642.0, 642, 642, 642.0, 642.0, 642.0, 642.0, 1.557632398753894, 0.2814081970404984, 1.0739145249221183], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 6, 0, 0.0, 139.33333333333331, 102, 311, 104.5, 311.0, 311.0, 311.0, 0.031696390837629956, 0.00854316784295495, 0.018664964526455923], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, 100.0, 112.2, 101, 120, 118.0, 120.0, 120.0, 120.0, 0.0444132564687908, 0.013098440872631664, 0.02745467904760213], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7e0a5cdb-52ac-4f8a-a05a-b5be7412edb0", 1, 0, 0.0, 1012.0, 1012, 1012, 1012.0, 1012.0, 1012.0, 1012.0, 0.9881422924901185, 0.17852180088932806, 0.6812777915019763], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1197.4736842105262, 805, 1787, 1116.0, 1645.8000000000002, 1730.8, 1787.0, 0.24596742873417396, 294.2625568799679, 0.4856895907231442], "isController": false}, {"data": ["deleteBook", 16, 5, 31.25, 579.8749999999999, 101, 1640, 601.5, 1311.7000000000003, 1640.0, 1640.0, 0.08619110723251128, 0.01864913788691727, 0.0572941497112598], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 5, 31.25, 579.8749999999999, 101, 1640, 601.5, 1311.7000000000003, 1640.0, 1640.0, 0.08847942576852676, 0.01914426051937423, 0.05881527258575592], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=47093ecf-f054-4c59-85cd-29932bd36a4c", 1, 0, 0.0, 286.0, 286, 286, 286.0, 286.0, 286.0, 286.0, 3.4965034965034967, 0.6316925262237763, 2.4106752622377625], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 11, 42.30769230769231, 1439.3846153846157, 226, 3482, 1261.5, 2926.2, 3298.249999999999, 3482.0, 0.10065230435708342, 0.03113628225228887, 0.045411488879855993], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 141.3157894736842, 98, 342, 103.0, 325.0, 342.0, 342.0, 0.09235181179672881, 0.032011750552895714, 0.052261176391960526], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 171.22222222222223, 100, 304, 109.0, 304.0, 304.0, 304.0, 0.05790835038412539, 0.015608110064471296, 0.034100327423464465], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/42ce2fec-3946-40f3-80ee-b4431ad54151", 1, 0, 0.0, 306.0, 306, 306, 306.0, 306.0, 306.0, 306.0, 3.2679738562091503, 1.0435814950980393, 1.9499336192810457], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 132.0, 100, 334, 105.0, 305.0, 334.0, 334.0, 0.09244572462851415, 0.06870234027568288, 0.046403420370172144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 149.44444444444446, 100, 304, 103.0, 304.0, 304.0, 304.0, 0.05790946819805038, 0.015608411350255768, 0.03404443345236947], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 164.4736842105263, 97, 604, 104.0, 318.0, 604.0, 604.0, 0.09244617443133438, 1.4542501672545918, 0.0540203822527673], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 181.26315789473682, 99, 1117, 104.0, 318.0, 1117.0, 1117.0, 0.09235270957989239, 4.397220282173983, 0.0538755784196021], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 126.13333333333335, 99, 305, 106.0, 250.40000000000003, 305.0, 305.0, 0.07238229432571067, 0.019509290267476706, 0.042552872250076], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 174.4666666666667, 99, 315, 112.0, 310.2, 315.0, 315.0, 0.07238194504762732, 0.0195091961261183, 0.04262335240597585], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 119.6, 100, 296, 104.0, 191.60000000000008, 296.0, 296.0, 0.07231424879958348, 0.0537413509145342, 0.036298363166978424], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 129.22222222222223, 99, 303, 103.0, 303.0, 303.0, 303.0, 0.05790984081228203, 0.015495406623598905, 0.0330267060882546], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 145.13333333333335, 97, 307, 106.0, 306.4, 307.0, 307.0, 0.07238264360716491, 0.019368012058948426, 0.04128072643221124], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 141.33333333333331, 101, 361, 104.0, 361.0, 361.0, 361.0, 0.05790872298397215, 0.043035681826955864, 0.029067464466564146], "isController": false}, {"data": ["deleteAccount", 16, 5, 31.25, 568.0, 99, 1333, 645.0, 1152.4, 1333.0, 1333.0, 0.08977214706921995, 0.01865687016422692, 0.061077278038366364], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 143.11111111111111, 104, 370, 111.0, 370.0, 370.0, 370.0, 0.057851027177126986, 0.04553508584449644, 0.02056423231686936], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/47093ecf-f054-4c59-85cd-29932bd36a4c", 3, 0, 0.0, 664.0, 235, 1333, 424.0, 1333.0, 1333.0, 1333.0, 0.10163634515702814, 0.047112680827997425, 0.0651769531117661], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 2331.625, 1113, 5119, 2194.0, 3569.0, 4828.0, 5119.0, 0.09976223334386379, 0.0516347496799295, 0.04588673037593735], "isController": false}, {"data": ["goToProfile", 16, 5, 31.25, 282.125, 99, 687, 278.5, 511.3000000000002, 687.0, 687.0, 0.08554457139496463, 0.12021873512994755, 0.055277122641509434], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 315.3333333333333, 206, 666, 233.0, 666.0, 666.0, 666.0, 0.057869998263900053, 0.08968719457500918, 0.13015098242359555], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7e0a5cdb-52ac-4f8a-a05a-b5be7412edb0", 3, 0, 0.0, 1032.0, 436, 1978, 682.0, 1978.0, 1978.0, 1978.0, 0.03390366837691838, 0.02826409333114843, 0.021741610254729562], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/52dcf227-6fbb-4130-a153-e1a1c9fa4360", 3, 0, 0.0, 456.33333333333337, 287, 761, 321.0, 761.0, 761.0, 761.0, 0.022889406019913783, 0.027054503013771793, 0.014678427688551482], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 109.1875, 99, 144, 104.0, 134.9, 144.0, 144.0, 0.11249780277728952, 0.08360432413429425, 0.05646862365969415], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 11, 0, 0.0, 741.6363636363636, 505, 844, 796.0, 841.6, 844.0, 844.0, 0.051433354062533604, 15.123113842468989, 0.0293330847387887], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b49a9f48-4eff-408b-8a00-66c1d3291309", 3, 0, 0.0, 423.3333333333333, 227, 611, 432.0, 611.0, 611.0, 611.0, 0.09277298450691158, 0.04197735952623929, 0.05949309227819525], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 145.25, 100, 315, 103.0, 308.7, 315.0, 315.0, 0.11250571318074745, 0.05122635622121436, 0.06298232429771825], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 11, 0, 0.0, 1015.0, 705, 1261, 1074.0, 1245.0, 1261.0, 1261.0, 0.0513524364396889, 46.20701257638675, 0.029236787543299444], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 11, 0, 0.0, 187.1818181818182, 101, 315, 128.0, 315.0, 315.0, 315.0, 0.05159256879400025, 0.09129466274875826, 0.028567369634959126], "isController": false}, {"data": ["addBook", 54, 21, 38.888888888888886, 1112.7777777777778, 524, 2463, 880.0, 1976.5, 2106.0, 2463.0, 0.2613265711050243, 70.57292863909349, 0.94939296771407], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 145.43750000000003, 100, 311, 104.0, 305.4, 311.0, 311.0, 0.08977164338214666, 0.06671505919317736, 0.04506115693205409], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 141.43749999999997, 98, 314, 104.5, 307.7, 314.0, 314.0, 0.08977466558937068, 0.024021736690905827, 0.05119961396893797], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 135.50000000000003, 100, 411, 103.5, 336.1000000000001, 411.0, 411.0, 0.08977214706921995, 0.024196399014750684, 0.052776203648115624], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 197.91228070175436, 101, 514, 108.0, 411.0, 443.4999999999999, 514.0, 0.24710304196850086, 0.1836381005254191, 0.11944922438907024], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 160.99999999999997, 99, 404, 104.0, 342.4000000000001, 404.0, 404.0, 0.08977265076194536, 0.024196534775680588, 0.0528641683686065], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c8e64687-6466-45cd-ad13-cb37239d1c35", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 0.7461120035046729, 1.3941114193925235], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 649.2105263157895, 488, 1097, 597.0, 861.4000000000001, 922.7999999999995, 1097.0, 0.2467297486819437, 72.54673831117816, 0.12408771540156349], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 11, 0, 0.0, 121.45454545454545, 99, 306, 103.0, 266.60000000000014, 306.0, 306.0, 0.051597892929681456, 0.038345699726062096, 0.028973426205631675], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 172.43859649122805, 99, 486, 111.0, 321.6, 399.69999999999993, 486.0, 0.24746887102096107, 0.43790390067380996, 0.12035107203949083], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 603.2777777777776, 99, 1212, 596.0, 1169.7, 1212.0, 1212.0, 0.08649313580863874, 38.924994121169675, 0.047132001739473066], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 228.5, 98, 1122, 104.5, 965.9000000000002, 1122.0, 1122.0, 0.11250413101106056, 12.680459812293888, 0.0649315834253289], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 996.3684210526317, 689, 1426, 982.0, 1271.2, 1331.6999999999998, 1426.0, 0.24643959635788218, 221.74678199742533, 0.12370112551557758], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 448.1111111111111, 99, 935, 501.5, 863.0000000000001, 935.0, 935.0, 0.08649355142522153, 12.727644345123686, 0.047216694576854325], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 12, 0, 0.0, 109.41666666666666, 103, 129, 108.0, 123.90000000000002, 129.0, 129.0, 0.06047564091580279, 0.04517955595760658, 0.021497200481789273], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 260.68749999999994, 101, 856, 127.0, 834.3000000000001, 856.0, 856.0, 0.11250413101106056, 4.161526707425976, 0.06504145074076938], "isController": false}, {"data": ["deleteBooks", 16, 5, 31.25, 473.1875000000001, 101, 1033, 515.5, 1018.3000000000001, 1033.0, 1033.0, 0.0890308436228876, 0.019263570595894567, 0.05939917917735501], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 165, 21, 12.727272727272727, 199.86666666666662, 100, 1325, 115.0, 437.0, 556.9999999999997, 1086.7400000000011, 0.7132883457330227, 1.6608777283279224, 0.33662093290550443], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 6, 0, 0.0, 107.83333333333334, 103, 115, 107.5, 115.0, 115.0, 115.0, 0.031876404554075664, 0.024685535948615236, 0.011331065681331583], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 321.43750000000006, 204, 715, 224.5, 646.4000000000001, 715.0, 715.0, 0.08971929076900648, 0.1390473773929817, 0.20178078773537295], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 119.57894736842105, 101, 276, 108.0, 128.0, 276.0, 276.0, 0.0912816423008739, 0.0740771921406506, 0.03244777128663877], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 878.8333333333335, 201, 2290, 774.0, 1852.5, 2288.5, 2290.0, 0.10173673077493717, 0.06249258169671433, 0.046000103856246], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 124.22222222222224, 100, 296, 105.5, 222.2000000000001, 296.0, 296.0, 0.08649147338224908, 0.06427735473036283, 0.04341466535007424], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 199.00000000000003, 97, 339, 121.0, 330.90000000000003, 339.0, 339.0, 0.08649604520859963, 0.08810095229743106, 0.04569761763462148], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b9ebc3b0-9f7c-417e-808d-3850eae13aad", 1, 0, 0.0, 520.0, 520, 520, 520.0, 520.0, 520.0, 520.0, 1.9230769230769231, 0.3474308894230769, 1.3258713942307692], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=52dcf227-6fbb-4130-a153-e1a1c9fa4360", 1, 0, 0.0, 622.0, 622, 622, 622.0, 622.0, 622.0, 622.0, 1.607717041800643, 0.2904566921221865, 1.108445538585209], "isController": false}, {"data": ["login", 24, 0, 0.0, 4231.291666666665, 2430, 7401, 3725.0, 6609.0, 7223.0, 7401.0, 0.0992001984003968, 54.52348626051419, 0.22506529388058777], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 6, 0, 0.0, 242.83333333333334, 203, 413, 211.0, 413.0, 413.0, 413.0, 0.03167881901362717, 0.04909598220178352, 0.07124640643396814], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 124.75000000000001, 104, 337, 111.5, 187.20000000000016, 337.0, 337.0, 0.11586310773820731, 0.09379933233884166, 0.04118571407881588], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 308.73333333333335, 204, 421, 238.0, 420.4, 421.0, 421.0, 0.07227801013819556, 0.11201679891534799, 0.1625549388166644], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/75324060-1b39-48e3-9806-ac91652ccdb4", 3, 0, 0.0, 369.3333333333333, 231, 568, 309.0, 568.0, 568.0, 568.0, 0.01760594376661561, 0.02427121479544828, 0.011290269928461182], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=90085d5a-6c78-4522-adfe-7a2152fedc20", 1, 0, 0.0, 511.0, 511, 511, 511.0, 511.0, 511.0, 511.0, 1.9569471624266144, 0.35355002446183953, 1.349223336594912], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 154.6875, 105, 400, 120.5, 368.50000000000006, 400.0, 400.0, 0.09359133344252323, 0.07759672079365451, 0.03326879430964693], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 746.6666666666666, 204, 1313, 856.0, 1280.6000000000001, 1313.0, 1313.0, 0.08644827271548433, 51.77808319415561, 0.18336489095510933], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c15f4fe9-3ff3-4a40-aa10-e603f8fa7aab", 3, 0, 0.0, 1181.6666666666667, 276, 2540, 729.0, 2540.0, 2540.0, 2540.0, 0.04076807044722573, 0.026209941124111593, 0.02614358684278473], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 140.05555555555557, 102, 420, 110.5, 239.10000000000028, 420.0, 420.0, 0.08219853686604378, 0.06381624688330548, 0.029219011151601502], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b9ebc3b0-9f7c-417e-808d-3850eae13aad", 3, 0, 0.0, 427.0, 281, 692, 308.0, 692.0, 692.0, 692.0, 0.020183807204273582, 0.02421137029549094, 0.012943391989719716], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6fbba99a-9abe-454c-9b6c-3bfafe845325", 1, 0, 0.0, 1033.0, 1033, 1033, 1033.0, 1033.0, 1033.0, 1033.0, 0.968054211035818, 0.17489260648596322, 0.6674280009680542], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/90085d5a-6c78-4522-adfe-7a2152fedc20", 3, 0, 0.0, 533.3333333333334, 333, 671, 596.0, 671.0, 671.0, 671.0, 0.06911486891213196, 0.031272678316361796, 0.04432170955628254], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c73263b5-846b-41b3-b926-a5f63665403f", 3, 0, 0.0, 1281.3333333333333, 402, 2608, 834.0, 2608.0, 2608.0, 2608.0, 0.02011465352509303, 0.02377483950182708, 0.01289904539206812], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6fbba99a-9abe-454c-9b6c-3bfafe845325", 3, 0, 0.0, 593.3333333333334, 386, 775, 619.0, 775.0, 775.0, 775.0, 0.050203323460013057, 0.03227589968539251, 0.03219418854694848], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 347.57894736842104, 203, 1422, 224.0, 659.0, 1422.0, 1422.0, 0.09230156378280957, 5.94734992798049, 0.20634542129591393], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 21, 10, 47.61904761904762, 649.047619047619, 99, 1367, 812.0, 1298.6, 1360.6, 1367.0, 0.09798798014110269, 61.41746612415543, 0.14665388545671731], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7d59cf9f-c621-4a73-87d3-8b850c9c1654", 1, 0, 0.0, 707.0, 707, 707, 707.0, 707.0, 707.0, 707.0, 1.4144271570014144, 0.25553615629420084, 0.9751812234794909], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7d59cf9f-c621-4a73-87d3-8b850c9c1654", 3, 0, 0.0, 951.0, 687, 1091, 1075.0, 1091.0, 1091.0, 1091.0, 0.07203400004802267, 0.03259350913631234, 0.046193678416212455], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 12, 0, 0.0, 156.66666666666663, 97, 490, 104.0, 436.0000000000002, 490.0, 490.0, 0.05788041905423395, 0.04301464736354691, 0.029053257220582274], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=75324060-1b39-48e3-9806-ac91652ccdb4", 1, 0, 0.0, 614.0, 614, 614, 614.0, 614.0, 614.0, 614.0, 1.6286644951140066, 0.2942411441368078, 1.1228878257328991], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 12, 0, 0.0, 166.58333333333334, 96, 402, 117.5, 372.3000000000001, 402.0, 402.0, 0.057886840873898344, 0.015489252343211081, 0.03301358893589515], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 12, 0, 0.0, 142.91666666666666, 100, 309, 114.0, 305.1, 309.0, 309.0, 0.0578848862561985, 0.015601785748741005, 0.03402998195921045], "isController": false}, {"data": ["register", 26, 11, 42.30769230769231, 1439.3846153846157, 226, 3482, 1261.5, 2926.2, 3298.249999999999, 3482.0, 0.10600562645248093, 0.03279230541851837, 0.04782675724711542], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 12, 0, 0.0, 199.08333333333334, 101, 402, 123.5, 372.3000000000001, 402.0, 402.0, 0.05788432781824321, 0.015601635232260866, 0.03408618132265689], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 11, 21.153846153846153, 0.8320726172465961], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 5, 9.615384615384615, 0.37821482602118], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 5, 9.615384615384615, 0.37821482602118], "isController": false}, {"data": ["401/Unauthorized", 31, 59.61538461538461, 2.344931921331316], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1322, 52, "401/Unauthorized", 31, "406/Not Acceptable", 11, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 5, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 11, "406/Not Acceptable", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 165, 21, "401/Unauthorized", 21, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 21, 10, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 5, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
