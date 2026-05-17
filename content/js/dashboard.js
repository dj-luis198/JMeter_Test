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

    var data = {"OkPercent": 98.31595829991981, "KoPercent": 1.6840417000801924};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7293103448275862, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b32974a6-aaf2-4a23-8037-5a779eee31d8"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=475eac9d-d87a-49f5-9bbe-0889a8e87123"], "isController": false}, {"data": [0.46153846153846156, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.46153846153846156, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1b54c157-358d-45de-9db0-23d49aac62d0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e97b3075-54ef-482b-9823-ddacebb2cacd"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5263157894736842, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=39c0eeb3-4049-4e86-b20a-cef6f04bb136"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.7307692307692307, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6190476190476191, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e97b3075-54ef-482b-9823-ddacebb2cacd"], "isController": false}, {"data": [0.47368421052631576, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c6c38bff-d33b-4fa8-9418-6f77c4bb02a2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9da612e9-1eb0-473a-b68e-28f2a1f36882"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b4603124-c8d1-47c0-8a05-698e8436827c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6201d3cf-655f-4b32-b928-019f1baf97ac"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a0f1cbf4-5946-4301-992a-12f6cf27c8a7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a3c38aac-b78b-41af-9c7a-8c671c86fb11"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.125, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.29545454545454547, 500, 1500, "register"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1d09c458-ad88-479c-9a28-97b1e3b68495"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a2264f1c-c7a3-4255-82aa-e4883dc1f14a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a3c38aac-b78b-41af-9c7a-8c671c86fb11"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6201d3cf-655f-4b32-b928-019f1baf97ac"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9da612e9-1eb0-473a-b68e-28f2a1f36882"], "isController": false}, {"data": [0.6764705882352942, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.17307692307692307, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.29545454545454547, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.2619047619047619, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.25862068965517243, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/39c0eeb3-4049-4e86-b20a-cef6f04bb136"], "isController": false}, {"data": [0.9038461538461539, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/b32974a6-aaf2-4a23-8037-5a779eee31d8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.27884615384615385, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9107142857142857, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a0f1cbf4-5946-4301-992a-12f6cf27c8a7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9027d39f-9c4e-4c08-8bbc-bb2dcfb65274"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a90f7195-c89b-49ce-92de-b1eb4474783a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b4603124-c8d1-47c0-8a05-698e8436827c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/475eac9d-d87a-49f5-9bbe-0889a8e87123"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1d09c458-ad88-479c-9a28-97b1e3b68495"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a2264f1c-c7a3-4255-82aa-e4883dc1f14a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1247, 21, 1.6840417000801924, 493.25020048115476, 136, 3350, 162.0, 1445.2000000000003, 1705.6, 2283.1199999999994, 4.918569473314689, 682.6901728636074, 3.596736283127374], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b32974a6-aaf2-4a23-8037-5a779eee31d8", 1, 0, 0.0, 446.0, 446, 446, 446.0, 446.0, 446.0, 446.0, 2.242152466367713, 0.40507637331838564, 1.5458590246636772], "isController": false}, {"data": ["see books", 52, 0, 0.0, 2456.4038461538466, 1883, 3409, 2393.0, 2904.1, 3044.0499999999997, 3409.0, 0.2320651567555506, 279.2521119812005, 1.141062562758005], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=475eac9d-d87a-49f5-9bbe-0889a8e87123", 1, 0, 0.0, 574.0, 574, 574, 574.0, 574.0, 574.0, 574.0, 1.7421602787456445, 0.3147457534843206, 1.2011378484320558], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 801.7692307692306, 148, 3350, 533.0, 2427.199999999999, 3350.0, 3350.0, 0.07325016622153104, 0.013877472897438499, 0.04951759659161342], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 801.7692307692306, 148, 3350, 533.0, 2427.199999999999, 3350.0, 3350.0, 0.07290142045613858, 0.01381140192235438, 0.049281842148797404], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1b54c157-358d-45de-9db0-23d49aac62d0", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 1.2981135670731707, 2.42552718495935], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 164.13333333333335, 138, 428, 146.0, 261.80000000000007, 428.0, 428.0, 0.09372832532476866, 0.034464686291295135, 0.05292965454863562], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 146.0666666666667, 143, 153, 146.0, 151.8, 153.0, 153.0, 0.09372422583789458, 0.0696524764283572, 0.047045168047536924], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 229.46666666666664, 141, 1103, 146.0, 704.0000000000002, 1103.0, 1103.0, 0.09372773966183032, 1.8608495521376172, 0.05465620860358165], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 280.53333333333336, 138, 1620, 144.0, 907.8000000000004, 1620.0, 1620.0, 0.09373066804971475, 5.646180445986141, 0.054566382402379515], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e97b3075-54ef-482b-9823-ddacebb2cacd", 1, 0, 0.0, 512.0, 512, 512, 512.0, 512.0, 512.0, 512.0, 1.953125, 0.3528594970703125, 1.346588134765625], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 279.46153846153845, 145, 403, 266.0, 387.8, 403.0, 403.0, 0.07330675493551825, 0.15411379534445718, 0.04738616483023848], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 170.42857142857142, 139, 497, 145.0, 330.0, 497.0, 497.0, 0.07949531829357621, 0.05907806369278467, 0.03990292344033025], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 186.35714285714286, 139, 450, 143.0, 446.5, 450.0, 450.0, 0.07949667249642264, 0.029800161690553523, 0.04486105472210235], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 1097.8333333333335, 851, 1297, 1140.5, 1297.0, 1297.0, 1297.0, 0.06713436944043503, 19.739733686348224, 0.0382875700714981], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1498.5, 1317, 1625, 1557.0, 1625.0, 1625.0, 1625.0, 0.06687621213134488, 60.17533323162576, 0.03807503093024811], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 335.33333333333337, 138, 452, 415.5, 452.0, 452.0, 452.0, 0.06799637352674524, 0.12032170784224842, 0.03765033573209429], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 166.3846153846154, 138, 417, 145.0, 310.9999999999999, 417.0, 417.0, 0.0988954142957125, 0.07349551785062228, 0.049640862253902567], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 167.07692307692307, 136, 444, 144.0, 327.19999999999993, 444.0, 444.0, 0.09889616663243338, 0.02646245083719409, 0.056401720032559666], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 274.15384615384613, 142, 443, 149.0, 437.0, 443.0, 443.0, 0.09889240506329114, 0.02665459355221519, 0.058137917820411396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 256.53846153846155, 140, 444, 149.0, 442.8, 444.0, 444.0, 0.09889240506329114, 0.02665459355221519, 0.05823449243473102], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 204.66666666666669, 141, 499, 146.5, 499.0, 499.0, 499.0, 0.06771932596697555, 0.050326569395379286, 0.03802598870215912], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 902.7894736842109, 139, 1854, 1379.0, 1706.0, 1854.0, 1854.0, 0.10302570220149658, 48.80405248549507, 0.055907964835701124], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 340.2857142857143, 143, 1581, 148.5, 1089.5, 1581.0, 1581.0, 0.07949486690287999, 5.129154538376147, 0.04624631626464977], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=39c0eeb3-4049-4e86-b20a-cef6f04bb136", 1, 0, 0.0, 933.0, 933, 933, 933.0, 933.0, 933.0, 933.0, 1.0718113612004287, 0.19363779474812431, 0.7389636923901393], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 627.7368421052632, 141, 1294, 762.0, 1179.0, 1294.0, 1294.0, 0.10302123321838333, 15.95613362667274, 0.05600614636877264], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 214.57142857142856, 138, 838, 147.5, 631.5, 838.0, 838.0, 0.07949441551730992, 1.689467043176824, 0.046323684935240445], "isController": false}, {"data": ["deleteBooks", 12, 1, 8.333333333333334, 472.5, 148, 933, 458.5, 825.3000000000004, 933.0, 933.0, 0.08875739644970414, 0.016880373982988167, 0.06066677838387574], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 468.6153846153845, 291, 861, 558.0, 752.1999999999999, 861.0, 861.0, 0.09878419452887538, 0.1530962077317629, 0.22216796875], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 690.952380952381, 217, 1710, 616.0, 1320.6000000000001, 1673.4999999999995, 1710.0, 0.09342052582410248, 0.057384287835312964, 0.042239944781796344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 146.0526315789474, 141, 152, 146.0, 151.0, 152.0, 152.0, 0.10302123321838333, 0.0765616782023337, 0.051711829955321316], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 250.36842105263156, 137, 444, 148.0, 442.0, 444.0, 444.0, 0.10302570220149658, 0.10900941126233597, 0.054202872519249545], "isController": false}, {"data": ["login", 21, 0, 0.0, 3094.190476190476, 1879, 5712, 2898.0, 4613.8, 5613.799999999998, 5712.0, 0.09248493816721277, 31.73838446979706, 0.18335706700533771], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 171.42857142857142, 143, 442, 150.5, 305.5, 442.0, 442.0, 0.0827976130630977, 0.06703048948174609, 0.02943196401852301], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e97b3075-54ef-482b-9823-ddacebb2cacd", 3, 0, 0.0, 355.3333333333333, 228, 473, 365.0, 473.0, 473.0, 473.0, 0.04854918841940025, 0.03121245023708187, 0.031133431375722168], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 1051.2105263157891, 291, 1997, 1521.0, 1857.0, 1997.0, 1997.0, 0.10293918461330083, 64.89191279798186, 0.21765055702289043], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c6c38bff-d33b-4fa8-9418-6f77c4bb02a2", 2, 0, 0.0, 238.5, 231, 246, 238.5, 246.0, 246.0, 246.0, 0.017431776385172532, 0.02481985348591948, 0.010835278973791324], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9da612e9-1eb0-473a-b68e-28f2a1f36882", 1, 0, 0.0, 456.0, 456, 456, 456.0, 456.0, 456.0, 456.0, 2.1929824561403506, 0.3961931195175438, 1.5119586074561402], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b4603124-c8d1-47c0-8a05-698e8436827c", 1, 0, 0.0, 542.0, 542, 542, 542.0, 542.0, 542.0, 542.0, 1.8450184501845017, 0.33332852859778594, 1.2720537361623616], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6201d3cf-655f-4b32-b928-019f1baf97ac", 1, 0, 0.0, 451.0, 451, 451, 451.0, 451.0, 451.0, 451.0, 2.2172949002217295, 0.4005855044345898, 1.5287208980044344], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a0f1cbf4-5946-4301-992a-12f6cf27c8a7", 1, 0, 0.0, 530.0, 530, 530, 530.0, 530.0, 530.0, 530.0, 1.8867924528301887, 0.3408755896226415, 1.3008549528301887], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a3c38aac-b78b-41af-9c7a-8c671c86fb11", 1, 0, 0.0, 244.0, 244, 244, 244.0, 244.0, 244.0, 244.0, 4.0983606557377055, 0.7404264856557378, 2.82562756147541], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 449.26666666666665, 287, 1763, 297.0, 1060.4000000000005, 1763.0, 1763.0, 0.09363997303168776, 7.603846242383949, 0.20900124970347345], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, 25.0, 1313.875, 145, 2050, 1589.0, 2050.0, 2050.0, 2050.0, 0.08867410051209294, 79.56972105067724, 0.16465109166130926], "isController": false}, {"data": ["register", 22, 7, 31.818181818181817, 1144.7272727272727, 306, 1802, 1252.5, 1625.7999999999997, 1785.6499999999999, 1802.0, 0.09730982563848516, 0.0304611545810812, 0.04390345648923842], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/1d09c458-ad88-479c-9a28-97b1e3b68495", 3, 0, 0.0, 715.6666666666667, 278, 1471, 398.0, 1471.0, 1471.0, 1471.0, 0.045863845530568256, 0.030023500443350507, 0.02941138531745425], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a2264f1c-c7a3-4255-82aa-e4883dc1f14a", 1, 0, 0.0, 373.0, 373, 373, 373.0, 373.0, 373.0, 373.0, 2.680965147453083, 0.4843540549597855, 1.848399798927614], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a3c38aac-b78b-41af-9c7a-8c671c86fb11", 3, 0, 0.0, 380.0, 298, 496, 346.0, 496.0, 496.0, 496.0, 0.09963467286615742, 0.04508209481899701, 0.06389332862836267], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6201d3cf-655f-4b32-b928-019f1baf97ac", 3, 0, 0.0, 337.6666666666667, 245, 513, 255.0, 513.0, 513.0, 513.0, 0.026170474470702153, 0.026247145782628042, 0.01678249827711043], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 553.3571428571428, 287, 2079, 429.5, 1412.5, 2079.0, 2079.0, 0.07942856818658905, 6.901747526012857, 0.1771851011863224], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 151.92857142857142, 144, 160, 152.0, 159.5, 160.0, 160.0, 0.07947952266869529, 0.06170529347813746, 0.02825248657363778], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9da612e9-1eb0-473a-b68e-28f2a1f36882", 3, 0, 0.0, 320.0, 224, 483, 253.0, 483.0, 483.0, 483.0, 0.018045655508436342, 0.024877392929110648, 0.011572246533730337], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 554.4117647058824, 295, 1783, 571.0, 1055.7999999999993, 1783.0, 1783.0, 0.08086304653906161, 5.8085568859640775, 0.1806458534499981], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 217.875, 143, 447, 145.5, 447.0, 447.0, 447.0, 0.04720432391607071, 0.03508055712903302, 0.023694357903183933], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 179.125, 141, 429, 144.0, 429.0, 429.0, 429.0, 0.04720432391607071, 0.01263084448535486, 0.026921215983384077], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 215.75, 141, 430, 145.0, 430.0, 430.0, 430.0, 0.04720460244873875, 0.012723115503761618, 0.027751143236465558], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 256.625, 142, 442, 149.0, 442.0, 442.0, 442.0, 0.04720515952393597, 0.012723265652935864, 0.02779756952434901], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 148.0, 148, 148, 148.0, 148.0, 148.0, 148.0, 6.756756756756757, 1.9927153716216217, 4.176784206081082], "isController": false}, {"data": ["https://demoqa.com/books", 52, 0, 0.0, 1735.5576923076924, 1133, 2823, 1640.5, 2302.5, 2449.35, 2823.0, 0.23081771614747476, 276.1382337340092, 0.45577482622089255], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, 31.818181818181817, 1144.7272727272727, 306, 1802, 1252.5, 1625.7999999999997, 1785.6499999999999, 1802.0, 0.0950956575864722, 0.02976804764292445, 0.04290448613764664], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 10, 0, 0.0, 203.9, 142, 440, 146.5, 439.1, 440.0, 440.0, 0.048931578973121885, 0.013188589645099258, 0.028814201289836423], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 10, 0, 0.0, 199.89999999999998, 142, 424, 146.0, 422.8, 424.0, 424.0, 0.04893301559495207, 0.013188976859576925, 0.02876726112125112], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 246.1428571428571, 139, 1572, 144.5, 862.5, 1572.0, 1572.0, 0.0822523030644858, 5.307069374309668, 0.04785046090665539], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 239.21428571428572, 140, 862, 146.5, 657.0, 862.0, 862.0, 0.08225278631313636, 1.7480897341178683, 0.04793106702427045], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 10, 0, 0.0, 174.00000000000003, 139, 431, 146.5, 403.0000000000001, 431.0, 431.0, 0.04893253671163567, 0.013093276424793137, 0.027906837343354716], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 149.3571428571429, 141, 170, 148.5, 164.0, 170.0, 170.0, 0.08224843727969168, 0.06112408278305212, 0.04128486011890774], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 10, 0, 0.0, 175.8, 141, 443, 146.5, 413.7000000000001, 443.0, 443.0, 0.048932297273492395, 0.03636472482922628, 0.024561719529858486], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 167.0, 139, 432, 147.0, 294.5, 432.0, 432.0, 0.0822498869064055, 0.03083223299630463, 0.046414731101619734], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 180.29999999999998, 147, 429, 151.5, 403.0000000000001, 429.0, 429.0, 0.04891961040422274, 0.03850508397051126, 0.017389392760876053], "isController": false}, {"data": ["deleteAccount", 12, 1, 8.333333333333334, 647.5833333333333, 145, 1471, 490.0, 1402.9000000000003, 1471.0, 1471.0, 0.08633093525179857, 0.016222178507194245, 0.05875533947841727], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1522.4285714285716, 1055, 2814, 1444.0, 2151.8, 2752.899999999999, 2814.0, 0.0927529062577294, 0.048006875309176356, 0.04266271371815484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 0, 0.0, 382.4, 290, 875, 296.0, 846.3000000000002, 875.0, 875.0, 0.04889664715690445, 0.07578025296680406, 0.10996970547104584], "isController": false}, {"data": ["addBook", 58, 10, 17.24137931034483, 1471.8103448275865, 739, 3712, 1177.0, 2605.4, 2692.499999999999, 3712.0, 0.27079014697368664, 79.25124664138514, 0.9853666448984071], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/39c0eeb3-4049-4e86-b20a-cef6f04bb136", 3, 0, 0.0, 393.3333333333333, 253, 524, 403.0, 524.0, 524.0, 524.0, 0.018221131653749906, 0.025119300961468378, 0.011684775181603945], "isController": false}, {"data": ["https://demoqa.com/books-0", 52, 0, 0.0, 275.2692307692307, 141, 609, 151.0, 580.0, 597.4499999999999, 609.0, 0.23243859374650783, 0.17274000961044186, 0.11236045303175915], "isController": false}, {"data": ["https://demoqa.com/books-3", 52, 0, 0.0, 923.5576923076922, 695, 1372, 860.5, 1291.1, 1331.1999999999998, 1372.0, 0.23215840346451772, 68.26227900305824, 0.1167593533049088], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b32974a6-aaf2-4a23-8037-5a779eee31d8", 3, 0, 0.0, 1310.6666666666667, 266, 2422, 1244.0, 2422.0, 2422.0, 2422.0, 0.016122357948591175, 0.022225971976654827, 0.010338881887605669], "isController": false}, {"data": ["https://demoqa.com/books-1", 52, 0, 0.0, 212.28846153846155, 137, 446, 148.0, 433.8, 445.35, 446.0, 0.2326288853497486, 0.41164408227904725, 0.1131339696329832], "isController": false}, {"data": ["https://demoqa.com/books-2", 52, 0, 0.0, 1458.8653846153845, 983, 2267, 1412.0, 1764.7, 1870.1499999999999, 2267.0, 0.23144130070010993, 208.2512892003703, 0.11617268414048487], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 173.17647058823533, 144, 452, 152.0, 244.7999999999998, 452.0, 452.0, 0.08297985541980485, 0.061991786519678425, 0.029496745481258756], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 10, 5.9523809523809526, 243.49404761904765, 140, 2836, 154.0, 369.1999999999997, 456.65, 2289.520000000002, 0.689853406151193, 1.4523244376976143, 0.33320538665667476], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 153.0, 149, 173, 150.0, 173.0, 173.0, 173.0, 0.04621926418931411, 0.035792848146607506, 0.01642950406729525], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 150.8, 144, 166, 150.0, 161.2, 166.0, 166.0, 0.09623959810343831, 0.07810068947652075, 0.034210169638331595], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a0f1cbf4-5946-4301-992a-12f6cf27c8a7", 3, 0, 0.0, 1030.3333333333333, 297, 2325, 469.0, 2325.0, 2325.0, 2325.0, 0.025351327141975882, 0.025425598608212138, 0.016257198720603022], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9027d39f-9c4e-4c08-8bbc-bb2dcfb65274", 1, 0, 0.0, 324.0, 324, 324, 324.0, 324.0, 324.0, 324.0, 3.0864197530864197, 0.9856047453703703, 1.841603973765432], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 475.375, 290, 887, 293.5, 887.0, 887.0, 887.0, 0.04716369338882928, 0.07309451309382037, 0.10607225183054084], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 442.1428571428571, 285, 1719, 298.0, 1165.0, 1719.0, 1719.0, 0.08217602103706138, 7.140480595820175, 0.1833139754998063], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a90f7195-c89b-49ce-92de-b1eb4474783a", 1, 0, 0.0, 321.0, 321, 321, 321.0, 321.0, 321.0, 321.0, 3.115264797507788, 0.9948160046728972, 1.8588152258566977], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 153.6153846153846, 142, 173, 152.0, 168.6, 173.0, 173.0, 0.09606147934678194, 0.07964472262247838, 0.03414685398655139], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b4603124-c8d1-47c0-8a05-698e8436827c", 3, 0, 0.0, 330.3333333333333, 243, 484, 264.0, 484.0, 484.0, 484.0, 0.027063111175260706, 0.022561402252552952, 0.017354924809656117], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 178.52631578947367, 140, 445, 151.0, 416.0, 445.0, 445.0, 0.10088727705239235, 0.07832557153969914, 0.035862274264717595], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/475eac9d-d87a-49f5-9bbe-0889a8e87123", 3, 0, 0.0, 323.6666666666667, 243, 464, 264.0, 464.0, 464.0, 464.0, 0.029244326600639477, 0.024379791804764874, 0.01875368600366529], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1d09c458-ad88-479c-9a28-97b1e3b68495", 1, 0, 0.0, 461.0, 461, 461, 461.0, 461.0, 461.0, 461.0, 2.1691973969631237, 0.3918960140997831, 1.495559924078091], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 163.94117647058823, 139, 430, 145.0, 213.19999999999982, 430.0, 430.0, 0.08103495943485266, 0.060222269658127804, 0.040675751122572525], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a2264f1c-c7a3-4255-82aa-e4883dc1f14a", 3, 0, 0.0, 510.33333333333337, 229, 1005, 297.0, 1005.0, 1005.0, 1005.0, 0.06302256207722363, 0.028516068127389608, 0.04041485914457376], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 246.23529411764707, 139, 443, 149.0, 439.8, 443.0, 443.0, 0.08093079940587271, 0.028805562564268576, 0.045756027559317514], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 335.11764705882354, 139, 1632, 151.0, 682.3999999999992, 1632.0, 1632.0, 0.08092386492378875, 4.303789416170016, 0.047165299489703626], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 292.47058823529414, 139, 1206, 148.0, 596.3999999999994, 1206.0, 1206.0, 0.08104075396503807, 1.4222447484399656, 0.04731256793122024], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 33.333333333333336, 0.5613472333600642], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 4.761904761904762, 0.08019246190858059], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.761904761904762, 0.08019246190858059], "isController": false}, {"data": ["401/Unauthorized", 12, 57.142857142857146, 0.9623095429029671], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1247, 21, "401/Unauthorized", 12, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
