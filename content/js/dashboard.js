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

    var data = {"OkPercent": 98.28125, "KoPercent": 1.71875};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8222972972972973, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.35185185185185186, 500, 1500, "see books"], "isController": true}, {"data": [0.7727272727272727, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8801e11e-ce1b-4b93-afd0-15fe83ae545d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9ffc60da-d6b4-4396-a22b-d610faf5080f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/19072b2d-0a1b-4eb7-b150-47faf0f8d93e"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fb97f211-a05e-4fcb-83ff-8e53de478a87"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1778b0ff-2af8-461e-a1f5-52429431b763"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c199f0da-463d-465f-aa2e-f67bb58a3198"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7631578947368421, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.8421052631578947, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2d7c0504-1107-4f82-803e-ce26e686a8a3"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.023809523809523808, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a37475bd-5491-48d1-9fc7-c1954530ff76"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/136bb95a-e4d1-4eb9-90b3-24c192b9a8a6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=18ae5959-3ac7-4aa2-8591-e0b6a88c2f1c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6825878b-6102-41a9-bdfd-ec4b3c61016e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9c9cc0b4-ba5f-4bbc-9e44-991999f47193"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d55468be-e8b7-46a1-8a8f-63996064da66"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fb97f211-a05e-4fcb-83ff-8e53de478a87"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d55468be-e8b7-46a1-8a8f-63996064da66"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.40476190476190477, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d993266f-219c-4c03-ab37-c766b241b087"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1778b0ff-2af8-461e-a1f5-52429431b763"], "isController": false}, {"data": [0.38333333333333336, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8801e11e-ce1b-4b93-afd0-15fe83ae545d"], "isController": false}, {"data": [0.9907407407407407, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8148148148148148, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9310344827586207, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b408c2b7-6dd5-462f-b8dd-db3eab8bf0ad"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a37475bd-5491-48d1-9fc7-c1954530ff76"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9c9cc0b4-ba5f-4bbc-9e44-991999f47193"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6825878b-6102-41a9-bdfd-ec4b3c61016e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=136bb95a-e4d1-4eb9-90b3-24c192b9a8a6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/18ae5959-3ac7-4aa2-8591-e0b6a88c2f1c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2d7c0504-1107-4f82-803e-ce26e686a8a3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1280, 22, 1.71875, 291.0585937499999, 77, 2199, 93.0, 786.8000000000002, 1012.9000000000001, 1386.0, 5.172594945404877, 718.8634267608038, 3.7887624175112546], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 1344.7037037037035, 951, 1769, 1365.5, 1612.5, 1655.0, 1769.0, 0.24266609145815357, 292.0081660018627, 1.1931872758709017], "isController": true}, {"data": ["deleteBook", 11, 1, 9.090909090909092, 477.00000000000006, 85, 781, 485.0, 749.4000000000001, 781.0, 781.0, 0.11037749101928596, 0.02108774508820165, 0.07454204316261615], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 11, 1, 9.090909090909092, 477.00000000000006, 85, 781, 485.0, 749.4000000000001, 781.0, 781.0, 0.112152200732048, 0.02142680539554042, 0.07574057093116913], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 131.4, 77, 241, 80.0, 238.6, 241.0, 241.0, 0.07541857308059731, 0.02773203780984464, 0.04258988951179044], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8801e11e-ce1b-4b93-afd0-15fe83ae545d", 3, 0, 0.0, 556.0, 211, 1004, 453.0, 1004.0, 1004.0, 1004.0, 0.01818336101244954, 0.02506723108324343, 0.011660553774259634], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 91.26666666666667, 79, 241, 80.0, 146.20000000000005, 241.0, 241.0, 0.07547891370747392, 0.056093216143933256, 0.03788687660707187], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 136.66666666666666, 78, 468, 81.0, 329.4000000000001, 468.0, 468.0, 0.07533221506845188, 1.4956289266917104, 0.043929078800008035], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 152.53333333333333, 78, 860, 80.0, 485.0000000000002, 860.0, 860.0, 0.07518420129316827, 4.528971957859255, 0.04376934426845772], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9ffc60da-d6b4-4396-a22b-d610faf5080f", 1, 0, 0.0, 373.0, 373, 373, 373.0, 373.0, 373.0, 373.0, 2.680965147453083, 0.856128518766756, 1.599677446380697], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/19072b2d-0a1b-4eb7-b150-47faf0f8d93e", 1, 0, 0.0, 389.0, 389, 389, 389.0, 389.0, 389.0, 389.0, 2.5706940874035986, 0.8209150064267352, 1.533880944730077], "isController": false}, {"data": ["goToProfile", 11, 1, 9.090909090909092, 269.2727272727273, 79, 1004, 193.0, 860.2000000000005, 1004.0, 1004.0, 0.11151097369354757, 0.24272248340007097, 0.07208020236707385], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 80.9375, 79, 84, 81.0, 83.3, 84.0, 84.0, 0.10395888426127466, 0.07725850676057619, 0.05218248682646013], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 559.1666666666666, 463, 630, 585.5, 630.0, 630.0, 630.0, 0.027595849584222534, 8.11409604620465, 0.015738257966001912], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 110.18749999999999, 78, 241, 80.0, 241.0, 241.0, 241.0, 0.10396023521003216, 0.037576447321399566, 0.058744131932035995], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 773.5, 691, 928, 702.5, 928.0, 928.0, 928.0, 0.027586714238422776, 24.822573964003933, 0.01570610781347703], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 159.5, 78, 241, 160.0, 241.0, 241.0, 241.0, 0.027645565420926773, 0.04891969193624933, 0.015307651946938946], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fb97f211-a05e-4fcb-83ff-8e53de478a87", 1, 0, 0.0, 429.0, 429, 429, 429.0, 429.0, 429.0, 429.0, 2.331002331002331, 0.4211283508158508, 1.6071168414918415], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1778b0ff-2af8-461e-a1f5-52429431b763", 1, 0, 0.0, 516.0, 516, 516, 516.0, 516.0, 516.0, 516.0, 1.937984496124031, 0.35012415213178294, 1.3361494670542635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 94.81818181818181, 79, 233, 81.0, 203.2000000000001, 233.0, 233.0, 0.06338632814525841, 0.04710644113138834, 0.031816965494787915], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 94.45454545454545, 78, 239, 80.0, 207.80000000000013, 239.0, 239.0, 0.06333012844501507, 0.016945757025326292, 0.03611796387879765], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 123.63636363636364, 79, 243, 81.0, 241.8, 243.0, 243.0, 0.06338815448269504, 0.017085088512913897, 0.037265301756428136], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 136.72727272727275, 78, 241, 80.0, 240.2, 241.0, 241.0, 0.06338888504713827, 0.017085285422861488, 0.037327634456469125], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c199f0da-463d-465f-aa2e-f67bb58a3198", 1, 0, 0.0, 366.0, 366, 366, 366.0, 366.0, 366.0, 366.0, 2.73224043715847, 0.8725025614754098, 1.6302723702185793], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 80.16666666666667, 78, 84, 79.5, 84.0, 84.0, 84.0, 0.027665578487246167, 0.020560063699994465, 0.015534870732584518], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 478.2631578947368, 79, 1020, 238.0, 972.0, 1020.0, 1020.0, 0.09959898304196263, 42.46539529165466, 0.054498908997981814], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 148.6875, 79, 858, 80.5, 422.6000000000005, 858.0, 858.0, 0.10395888426127466, 5.872668082429649, 0.06055808052915072], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 338.78947368421046, 78, 773, 237.0, 666.0, 773.0, 773.0, 0.0995995051477218, 13.886237133971818, 0.05459645982732591], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 124.8125, 78, 478, 80.5, 307.9000000000002, 478.0, 478.0, 0.10395888426127466, 1.9367291408123086, 0.06065960287706212], "isController": false}, {"data": ["deleteBooks", 11, 1, 9.090909090909092, 378.3636363636364, 89, 516, 421.0, 512.2, 516.0, 516.0, 0.11238365737287875, 0.021471025449790047, 0.07675492508607566], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 247.63636363636363, 161, 470, 166.0, 441.2000000000001, 470.0, 470.0, 0.063299151791366, 0.09810132216103305, 0.14236127595265224], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2d7c0504-1107-4f82-803e-ce26e686a8a3", 3, 0, 0.0, 412.6666666666667, 199, 589, 450.0, 589.0, 589.0, 589.0, 0.01812798356396157, 0.024990888799927488, 0.011625041543295666], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 535.952380952381, 88, 1380, 534.0, 940.0000000000001, 1338.6999999999994, 1380.0, 0.09380108809262187, 0.05761805118189371, 0.04241201541687884], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 113.63157894736844, 78, 390, 81.0, 237.0, 390.0, 390.0, 0.09959793884686556, 0.07401760885006317, 0.04999349664774306], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 146.05263157894734, 77, 241, 80.0, 238.0, 241.0, 241.0, 0.09959846094167724, 0.09750984190054832, 0.05284001407483514], "isController": false}, {"data": ["login", 21, 0, 0.0, 2305.904761904762, 1359, 3431, 2297.0, 3169.6, 3406.5999999999995, 3431.0, 0.09413072516517701, 32.30317503496284, 0.18661994075367336], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 83.6875, 80, 93, 82.5, 91.6, 93.0, 93.0, 0.11014201435976512, 0.08916770498461454, 0.03915204416694776], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a37475bd-5491-48d1-9fc7-c1954530ff76", 3, 0, 0.0, 274.3333333333333, 198, 415, 210.0, 415.0, 415.0, 415.0, 0.05353892279687333, 0.024224968322804012, 0.03433322848627619], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/136bb95a-e4d1-4eb9-90b3-24c192b9a8a6", 3, 0, 0.0, 284.3333333333333, 166, 419, 268.0, 419.0, 419.0, 419.0, 0.025408010298713507, 0.02548244782888552, 0.0162935482709849], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=18ae5959-3ac7-4aa2-8591-e0b6a88c2f1c", 1, 0, 0.0, 497.0, 497, 497, 497.0, 497.0, 497.0, 497.0, 2.012072434607646, 0.3635091800804829, 1.3872296277665996], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6825878b-6102-41a9-bdfd-ec4b3c61016e", 1, 0, 0.0, 467.0, 467, 467, 467.0, 467.0, 467.0, 467.0, 2.1413276231263385, 0.3868609475374732, 1.476345021413276], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9c9cc0b4-ba5f-4bbc-9e44-991999f47193", 3, 0, 0.0, 507.0, 285, 937, 299.0, 937.0, 937.0, 937.0, 0.02936282666144661, 0.02447858042967603, 0.018829677253596945], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d55468be-e8b7-46a1-8a8f-63996064da66", 3, 0, 0.0, 425.0, 193, 708, 374.0, 708.0, 708.0, 708.0, 0.057925122125465814, 0.026850707651908636, 0.03714599302967697], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 601.6842105263158, 161, 1108, 628.0, 1054.0, 1108.0, 1108.0, 0.0995561889890855, 56.49880246021682, 0.2118383361409925], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, 25.0, 660.25, 79, 1010, 779.5, 1010.0, 1010.0, 1010.0, 0.036768423278088776, 32.993322366002076, 0.06827203204138287], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 286.73333333333335, 160, 940, 168.0, 661.6000000000001, 940.0, 940.0, 0.07515368929460747, 6.1027046403645455, 0.16774049024004087], "isController": false}, {"data": ["register", 21, 6, 28.571428571428573, 1143.3809523809525, 87, 2199, 1109.0, 2017.4000000000003, 2187.7, 2199.0, 0.09262199640097385, 0.029099433021064887, 0.04178843978247063], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 85.00000000000001, 81, 92, 84.0, 91.6, 92.0, 92.0, 0.06441830272638079, 0.05001225651120383, 0.022898693547268166], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 260.18750000000006, 160, 940, 166.0, 508.1000000000005, 940.0, 940.0, 0.10390487508685799, 7.920114857504205, 0.23202293456590492], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 276.86666666666673, 159, 928, 175.0, 565.0000000000002, 928.0, 928.0, 0.0700790491674609, 5.690628664550279, 0.15641406527396234], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 16, 0, 0.0, 100.75, 78, 237, 81.0, 236.3, 237.0, 237.0, 0.08864904397546637, 0.06588078365754875, 0.04449766465174777], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 16, 0, 0.0, 109.49999999999999, 78, 237, 80.0, 235.6, 237.0, 237.0, 0.08865199106831191, 0.023721333547575645, 0.05055933865614663], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 16, 0, 0.0, 101.375, 78, 237, 80.5, 235.6, 237.0, 237.0, 0.08865100868225816, 0.023894217183889895, 0.052117096901093174], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 16, 0, 0.0, 111.5625, 77, 237, 81.0, 235.6, 237.0, 237.0, 0.08865149987256347, 0.023894349575026872, 0.05220395939761306], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 89.0, 89, 89, 89.0, 89.0, 89.0, 89.0, 11.235955056179774, 3.31372893258427, 6.945663623595506], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 954.4444444444446, 624, 1386, 934.5, 1268.0, 1326.75, 1386.0, 0.24292700043636886, 290.62514761189266, 0.4796859325022831], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fb97f211-a05e-4fcb-83ff-8e53de478a87", 3, 0, 0.0, 287.6666666666667, 190, 387, 286.0, 387.0, 387.0, 387.0, 0.01809561724150411, 0.024946269211513637, 0.01160428579614684], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 6, 28.571428571428573, 1143.3809523809525, 87, 2199, 1109.0, 2017.4000000000003, 2187.7, 2199.0, 0.09483809781872375, 0.02979567470532448, 0.042788282414307], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 79.66666666666667, 79, 81, 79.0, 81.0, 81.0, 81.0, 0.042189741330008156, 0.011371453717853761, 0.024844154318354413], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d55468be-e8b7-46a1-8a8f-63996064da66", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 0.7344067581300813, 2.802654979674797], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 79.88888888888889, 79, 81, 80.0, 81.0, 81.0, 81.0, 0.04218934578387804, 0.011371347105810878, 0.02480272086122518], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 211.84615384615384, 77, 699, 87.0, 696.2, 699.0, 699.0, 0.06589652218431764, 9.13715276017721, 0.037868719554539514], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 206.46153846153848, 79, 466, 234.0, 464.4, 466.0, 466.0, 0.06589585413699241, 2.9958853108003303, 0.03793268706819207], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 79.55555555555556, 78, 81, 80.0, 81.0, 81.0, 81.0, 0.04218993910585456, 0.01128910479980874, 0.024061449646307676], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 92.61538461538463, 78, 238, 81.0, 176.39999999999995, 238.0, 238.0, 0.06589618815896188, 0.04897167889547851, 0.033076797571978914], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 80.88888888888889, 80, 82, 81.0, 82.0, 82.0, 82.0, 0.042188950245164676, 0.03135331165680695, 0.021176875416029927], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 117.76923076923076, 77, 238, 80.0, 237.6, 238.0, 238.0, 0.06589585413699241, 0.032858825102265295, 0.0367298105240748], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 86.66666666666667, 81, 98, 85.0, 98.0, 98.0, 98.0, 0.042685789900542115, 0.03359838540999702, 0.015173464378708328], "isController": false}, {"data": ["deleteAccount", 11, 1, 9.090909090909092, 523.5454545454546, 79, 937, 453.0, 931.4, 937.0, 937.0, 0.1134289573816472, 0.021388770017633046, 0.07719694489415016], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1322.6190476190475, 954, 1820, 1291.0, 1731.4, 1812.3, 1820.0, 0.09331674369001067, 0.0482987052301813, 0.04292205691210452], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 162.33333333333334, 160, 164, 163.0, 164.0, 164.0, 164.0, 0.04217293715763776, 0.06535981569254991, 0.09484792409574193], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d993266f-219c-4c03-ab37-c766b241b087", 1, 0, 0.0, 177.0, 177, 177, 177.0, 177.0, 177.0, 177.0, 5.649717514124294, 1.804157838983051, 3.3710716807909606], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1778b0ff-2af8-461e-a1f5-52429431b763", 3, 0, 0.0, 317.6666666666667, 188, 463, 302.0, 463.0, 463.0, 463.0, 0.028726551951969204, 0.023948144384437868, 0.01842164952649067], "isController": false}, {"data": ["addBook", 60, 12, 20.0, 805.6833333333333, 406, 1550, 715.5, 1378.2, 1477.5, 1550.0, 0.29660975055119976, 83.94225390505275, 1.0798110796718507], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8801e11e-ce1b-4b93-afd0-15fe83ae545d", 1, 0, 0.0, 421.0, 421, 421, 421.0, 421.0, 421.0, 421.0, 2.375296912114014, 0.42913078978622327, 1.6376558788598576], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 167.16666666666666, 79, 561, 83.5, 324.5, 329.25, 561.0, 0.24411965479672518, 0.18142095439483188, 0.11800705969177633], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 503.8148148148149, 383, 714, 467.0, 666.0, 707.75, 714.0, 0.24408213815953028, 71.76825290864548, 0.1227561534689044], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 124.96296296296298, 78, 332, 82.5, 242.0, 246.0, 332.0, 0.24451206259508804, 0.43267173576396434, 0.11891309294175179], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 785.5925925925926, 542, 1098, 775.5, 975.5, 1086.5, 1098.0, 0.24357898725269966, 219.1728008961677, 0.12226523383582777], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 86.93333333333334, 80, 112, 83.0, 105.4, 112.0, 112.0, 0.06966310920388999, 0.05204324076267172, 0.024763058349820267], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 12, 6.896551724137931, 131.54022988505747, 79, 491, 85.0, 248.5, 265.75, 428.75, 0.7295138670523867, 1.5258760913883824, 0.3521340704463032], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 16, 0, 0.0, 83.6875, 81, 91, 83.0, 88.9, 91.0, 91.0, 0.08713790117472783, 0.0674808160464445, 0.030974800808204035], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b408c2b7-6dd5-462f-b8dd-db3eab8bf0ad", 1, 0, 0.0, 207.0, 207, 207, 207.0, 207.0, 207.0, 207.0, 4.830917874396135, 1.5426856884057971, 2.8825105676328504], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 96.06666666666666, 79, 236, 83.0, 159.80000000000004, 236.0, 236.0, 0.07573653783040066, 0.06146197552447552, 0.02692197243190023], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a37475bd-5491-48d1-9fc7-c1954530ff76", 1, 0, 0.0, 190.0, 190, 190, 190.0, 190.0, 190.0, 190.0, 5.263157894736842, 0.9508634868421052, 3.6287006578947367], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9c9cc0b4-ba5f-4bbc-9e44-991999f47193", 1, 0, 0.0, 414.0, 414, 414, 414.0, 414.0, 414.0, 414.0, 2.4154589371980677, 0.4363866243961353, 1.6653457125603865], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6825878b-6102-41a9-bdfd-ec4b3c61016e", 3, 0, 0.0, 459.66666666666663, 205, 909, 265.0, 909.0, 909.0, 909.0, 0.027428320655354006, 0.02750867706352399, 0.01758912489942949], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 16, 0, 0.0, 223.5625, 158, 473, 166.5, 472.3, 473.0, 473.0, 0.08860829595170848, 0.1373255524173451, 0.19928213435232875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 347.9230769230769, 159, 779, 319.0, 776.6, 779.0, 779.0, 0.06586880959860561, 12.209762588859558, 0.14554770390196695], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=136bb95a-e4d1-4eb9-90b3-24c192b9a8a6", 1, 0, 0.0, 478.0, 478, 478, 478.0, 478.0, 478.0, 478.0, 2.092050209205021, 0.377958289748954, 1.4423705543933054], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/18ae5959-3ac7-4aa2-8591-e0b6a88c2f1c", 3, 0, 0.0, 249.33333333333331, 165, 400, 183.0, 400.0, 400.0, 400.0, 0.031147149516700064, 0.025966096976650022, 0.019973920751269247], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 113.0909090909091, 80, 238, 87.0, 237.4, 238.0, 238.0, 0.06257288318780398, 0.05187927522113826, 0.022242704570664695], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2d7c0504-1107-4f82-803e-ce26e686a8a3", 1, 0, 0.0, 415.0, 415, 415, 415.0, 415.0, 415.0, 415.0, 2.4096385542168677, 0.4353350903614458, 1.6613328313253013], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 86.36842105263156, 79, 99, 84.0, 97.0, 99.0, 99.0, 0.10395294761318562, 0.08070565757078375, 0.03695202434687457], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 81.60000000000001, 78, 93, 81.0, 87.60000000000001, 93.0, 93.0, 0.07010557900197698, 0.05209994689502391, 0.03518971445997673], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 121.66666666666666, 78, 238, 80.0, 237.4, 238.0, 238.0, 0.07010688963773433, 0.025778887543875226, 0.03959030994255909], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 152.20000000000002, 78, 847, 81.0, 481.60000000000025, 847.0, 847.0, 0.07010688963773433, 4.223123099811179, 0.04081352911071747], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 168.40000000000003, 79, 465, 86.0, 328.80000000000007, 465.0, 465.0, 0.07010656197420079, 1.3918799804870068, 0.04088180179706487], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 27.272727272727273, 0.46875], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 4.545454545454546, 0.078125], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.545454545454546, 0.078125], "isController": false}, {"data": ["401/Unauthorized", 14, 63.63636363636363, 1.09375], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1280, 22, "401/Unauthorized", 14, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 11, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
