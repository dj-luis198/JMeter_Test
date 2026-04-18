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

    var data = {"OkPercent": 98.32361516034986, "KoPercent": 1.6763848396501457};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8121477770820288, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3474576271186441, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f5a58471-a265-4417-88ef-263ce4ebe5c1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dbadd81b-425b-4a39-b4fe-6656acc016f3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c1cf8e98-dff7-40f9-8398-a1e8cbcee572"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a38acb90-bfcd-4eae-a476-179bdcf51242"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/525dded6-3ad1-42fc-b6ee-848f02db6b92"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.4, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=89d3de55-a96a-44e2-bdf6-dcba8cf6d1b5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0e486d45-c5ab-47c3-a936-c73dfd7acb46"], "isController": false}, {"data": [0.7631578947368421, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.8157894736842105, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1d520a1e-9cbd-4b33-90e1-84556cd010dc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=89810b06-a85e-4b3f-8c61-0b0d10470f76"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=334bda08-86f7-4ae9-ab30-bc90ef9f8a3d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=113446fa-d85d-4ca2-a243-33bea858938a"], "isController": false}, {"data": [0.7954545454545454, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.045454545454545456, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dfbb63fa-03ec-4b73-9106-40464972739a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=525dded6-3ad1-42fc-b6ee-848f02db6b92"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9fade135-ca8c-48d3-8198-eea8894dc099"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2eef6eae-6d8a-44dc-a85a-4f21bb701c7e"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/acc33491-a3ba-45b7-ab7c-83023003ae00"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2222222222222222, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=acc33491-a3ba-45b7-ab7c-83023003ae00"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a38acb90-bfcd-4eae-a476-179bdcf51242"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4576271186440678, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.4318181818181818, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f5a58471-a265-4417-88ef-263ce4ebe5c1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/334bda08-86f7-4ae9-ab30-bc90ef9f8a3d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/89d3de55-a96a-44e2-bdf6-dcba8cf6d1b5"], "isController": false}, {"data": [0.3548387096774194, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2eef6eae-6d8a-44dc-a85a-4f21bb701c7e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8135593220338984, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4661016949152542, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9234972677595629, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dbadd81b-425b-4a39-b4fe-6656acc016f3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/89810b06-a85e-4b3f-8c61-0b0d10470f76"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9fade135-ca8c-48d3-8198-eea8894dc099"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8611111111111112, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dfbb63fa-03ec-4b73-9106-40464972739a"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/113446fa-d85d-4ca2-a243-33bea858938a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1f1be00a-118e-4339-8e79-77f79e0506a0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b3d6d284-f8c3-46f7-9498-b2d76f8691d0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1372, 23, 1.6763848396501457, 312.2215743440227, 77, 2728, 93.0, 850.7, 1046.0, 2242.9499999999985, 5.40461756028, 766.9405244020255, 3.9468463359785235], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 59, 0, 0.0, 1444.694915254237, 953, 3063, 1349.0, 1848.0, 2828.0, 3063.0, 0.2631473312846496, 316.65426165569846, 1.2938933720880963], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f5a58471-a265-4417-88ef-263ce4ebe5c1", 1, 0, 0.0, 172.0, 172, 172, 172.0, 172.0, 172.0, 172.0, 5.813953488372093, 1.050372456395349, 4.008448401162791], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dbadd81b-425b-4a39-b4fe-6656acc016f3", 3, 0, 0.0, 356.3333333333333, 160, 469, 440.0, 469.0, 469.0, 469.0, 0.02790464054172209, 0.027986392418309164, 0.01789457743072673], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c1cf8e98-dff7-40f9-8398-a1e8cbcee572", 1, 0, 0.0, 194.0, 194, 194, 194.0, 194.0, 194.0, 194.0, 5.154639175257732, 1.6460615335051545, 3.0756684922680413], "isController": false}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 555.7333333333335, 85, 1518, 433.0, 1357.2, 1518.0, 1518.0, 0.0732171621027969, 0.014343127654122125, 0.049297649118953485], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 555.7333333333335, 85, 1518, 433.0, 1357.2, 1518.0, 1518.0, 0.07499100107987042, 0.014690619938107427, 0.050491987836459626], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 117.0, 78, 246, 82.0, 245.5, 246.0, 246.0, 0.06713758889736102, 0.025167229543416443, 0.03788665556498679], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 94.78571428571428, 79, 247, 83.0, 170.0, 247.0, 247.0, 0.06718881978038854, 0.04993231626257391, 0.03372563805382785], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 139.1428571428571, 78, 581, 80.5, 412.5, 581.0, 581.0, 0.06714016468523251, 1.4269064659575386, 0.03912450723914847], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a38acb90-bfcd-4eae-a476-179bdcf51242", 3, 0, 0.0, 272.3333333333333, 156, 397, 264.0, 397.0, 397.0, 397.0, 0.01845699520118125, 0.025444457902670112, 0.011836028823674172], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 146.14285714285717, 80, 652, 82.0, 449.0, 652.0, 652.0, 0.06719043208247145, 4.335249847921656, 0.03908818384262081], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 200.46666666666667, 80, 469, 175.0, 374.20000000000005, 469.0, 469.0, 0.07321215907537924, 0.13833570916957888, 0.04732098406903419], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/525dded6-3ad1-42fc-b6ee-848f02db6b92", 3, 0, 0.0, 273.0, 174, 449, 196.0, 449.0, 449.0, 449.0, 0.09353370331109309, 0.04341766306042277, 0.05998092302176218], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 91.625, 80, 232, 82.5, 129.8000000000001, 232.0, 232.0, 0.21059559065482064, 0.15650707469562358, 0.10570911484040804], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 514.4, 388, 635, 477.0, 635.0, 635.0, 635.0, 0.02480343279509884, 7.293032793238584, 0.014145707765954807], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 100.125, 78, 233, 81.5, 233.0, 233.0, 233.0, 0.21018062397372742, 0.07596982758620689, 0.11876539408866996], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1172.2, 702, 2445, 926.0, 2445.0, 2445.0, 2445.0, 0.024737412367716687, 22.258767132204152, 0.014083897861698075], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 177.4, 82, 244, 236.0, 244.0, 244.0, 244.0, 0.024841140903919433, 0.04395717511513869, 0.013754811418478828], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=89d3de55-a96a-44e2-bdf6-dcba8cf6d1b5", 1, 0, 0.0, 449.0, 449, 449, 449.0, 449.0, 449.0, 449.0, 2.2271714922048997, 0.40236984966592426, 1.5355303452115812], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 92.2857142857143, 78, 236, 81.5, 160.5, 236.0, 236.0, 0.08315069876283639, 0.06179461109230321, 0.04173775308993936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 125.50000000000001, 78, 245, 80.5, 243.0, 245.0, 245.0, 0.08315366202788024, 0.022250100972303892, 0.047423572875275447], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 170.35714285714283, 77, 243, 235.0, 242.0, 243.0, 243.0, 0.08307569976442106, 0.022391497202129112, 0.04883942505681785], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 136.21428571428572, 77, 244, 80.0, 243.0, 244.0, 244.0, 0.08307520679792549, 0.022391364332253357, 0.04892026337807527], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 81.4, 81, 82, 81.0, 82.0, 82.0, 82.0, 0.024841140903919433, 0.01846104319129169, 0.013948882831790698], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0e486d45-c5ab-47c3-a936-c73dfd7acb46", 2, 0, 0.0, 225.0, 214, 236, 225.0, 236.0, 236.0, 236.0, 0.011393479511675467, 0.022531050792131666, 0.007081982137872496], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 490.5263157894737, 79, 1275, 235.0, 1042.0, 1275.0, 1275.0, 0.0884613772970859, 37.71672400894158, 0.04840459615053333], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 133.81250000000003, 78, 760, 82.0, 396.7000000000004, 760.0, 760.0, 0.21059559065482064, 11.896607128167162, 0.12267604475156302], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 433.52631578947364, 78, 2220, 328.0, 713.0, 2220.0, 2220.0, 0.08846096543504171, 12.333293637445061, 0.0484907584480222], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 126.12500000000001, 78, 647, 80.5, 361.4000000000003, 647.0, 647.0, 0.2106011346136127, 3.9234487498848276, 0.12288493938636094], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 329.1428571428571, 81, 648, 369.0, 626.0, 648.0, 648.0, 0.07440397104622612, 0.014656585814351463, 0.050540309015635464], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/1d520a1e-9cbd-4b33-90e1-84556cd010dc", 1, 0, 0.0, 219.0, 219, 219, 219.0, 219.0, 219.0, 219.0, 4.5662100456621, 1.4581549657534247, 2.724564783105023], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=89810b06-a85e-4b3f-8c61-0b0d10470f76", 1, 0, 0.0, 361.0, 361, 361, 361.0, 361.0, 361.0, 361.0, 2.770083102493075, 0.5004544667590027, 1.9098424515235457], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 275.92857142857144, 159, 476, 319.0, 402.5, 476.0, 476.0, 0.08303381848807279, 0.12868620111383938, 0.1867450038847965], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=334bda08-86f7-4ae9-ab30-bc90ef9f8a3d", 1, 0, 0.0, 170.0, 170, 170, 170.0, 170.0, 170.0, 170.0, 5.88235294117647, 1.0627297794117647, 4.055606617647059], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=113446fa-d85d-4ca2-a243-33bea858938a", 1, 0, 0.0, 201.0, 201, 201, 201.0, 201.0, 201.0, 201.0, 4.975124378109452, 0.8988261815920398, 3.4301150497512434], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 484.5454545454546, 123, 2076, 359.5, 1119.9999999999998, 1951.4999999999982, 2076.0, 0.0975717928816942, 0.059934236057212556, 0.04411693369553166], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 91.05263157894737, 80, 246, 83.0, 85.0, 246.0, 246.0, 0.08846014172245863, 0.0657403982917881, 0.044402844575530995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 139.421052631579, 78, 249, 82.0, 247.0, 249.0, 249.0, 0.08846261290622963, 0.08660751699413353, 0.04693210785454884], "isController": false}, {"data": ["login", 22, 0, 0.0, 2279.1818181818176, 1227, 4291, 2168.0, 3508.1, 4174.149999999999, 4291.0, 0.09728572818367545, 26.58583423755627, 0.18344716500543914], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 105.49999999999999, 78, 242, 84.5, 239.2, 242.0, 242.0, 0.21518391500235357, 0.17420650931342882, 0.07649115728599287], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dfbb63fa-03ec-4b73-9106-40464972739a", 1, 0, 0.0, 377.0, 377, 377, 377.0, 377.0, 377.0, 377.0, 2.6525198938992043, 0.4792150198938992, 1.8287881299734747], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=525dded6-3ad1-42fc-b6ee-848f02db6b92", 1, 0, 0.0, 284.0, 284, 284, 284.0, 284.0, 284.0, 284.0, 3.5211267605633805, 0.6361410651408451, 2.4276518485915495], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9fade135-ca8c-48d3-8198-eea8894dc099", 3, 0, 0.0, 334.6666666666667, 206, 576, 222.0, 576.0, 576.0, 576.0, 0.018722267641056684, 0.025810157376261415, 0.012006141683880752], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2eef6eae-6d8a-44dc-a85a-4f21bb701c7e", 3, 0, 0.0, 403.0, 182, 798, 229.0, 798.0, 798.0, 798.0, 0.04181534344335414, 0.026012083763102142, 0.02681517792428635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 658.8947368421052, 162, 2305, 489.0, 1358.0, 2305.0, 2305.0, 0.08842555964071298, 50.182095933006, 0.1881542836947922], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/acc33491-a3ba-45b7-ab7c-83023003ae00", 3, 0, 0.0, 282.6666666666667, 159, 433, 256.0, 433.0, 433.0, 433.0, 0.02690196922414721, 0.026980783587108575, 0.017251588337099607], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 289.0, 163, 732, 250.5, 612.0, 732.0, 732.0, 0.06710991165459487, 5.831348560192797, 0.14970528562457758], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, 44.44444444444444, 732.6666666666666, 80, 2528, 784.0, 2528.0, 2528.0, 2528.0, 0.044185441388012, 29.372559828315012, 0.06836373792878288], "isController": false}, {"data": ["register", 24, 5, 20.833333333333332, 907.1666666666666, 196, 1542, 868.0, 1513.5, 1537.75, 1542.0, 0.09509055394209777, 0.030133676517783915, 0.0429021835168449], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=acc33491-a3ba-45b7-ab7c-83023003ae00", 1, 0, 0.0, 394.0, 394, 394, 394.0, 394.0, 394.0, 394.0, 2.5380710659898473, 0.45853822969543145, 1.7498810279187818], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 86.88888888888889, 82, 105, 84.5, 98.70000000000002, 105.0, 105.0, 0.10241179783911107, 0.07950915945516923, 0.03640419376312151], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 246.12499999999997, 161, 992, 165.5, 523.7000000000005, 992.0, 992.0, 0.2099489561600336, 16.003289986254902, 0.4688227850385125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 348.6666666666667, 162, 1189, 247.5, 1162.0, 1189.0, 1189.0, 0.10792337440417303, 14.494661915040322, 0.23965406436430134], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 102.375, 79, 233, 82.5, 233.0, 233.0, 233.0, 0.046332493556887615, 0.034432644137491676, 0.023256739929922103], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 100.125, 79, 240, 80.0, 240.0, 240.0, 240.0, 0.046337324135374496, 0.021098415408318708, 0.025940303770120535], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a38acb90-bfcd-4eae-a476-179bdcf51242", 1, 0, 0.0, 648.0, 648, 648, 648.0, 648.0, 648.0, 648.0, 1.5432098765432098, 0.27880256558641975, 1.0639708719135803], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 185.75, 79, 921, 81.0, 921.0, 921.0, 921.0, 0.046337324135374496, 5.222728900951074, 0.02674351422266243], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 129.0, 80, 461, 81.0, 461.0, 461.0, 461.0, 0.046336787354690726, 1.713997311742321, 0.026788455189430578], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 82.0, 81, 83, 82.0, 83.0, 83.0, 83.0, 0.013894002653754506, 0.004097645313900255, 0.008588773124830666], "isController": false}, {"data": ["https://demoqa.com/books", 59, 0, 0.0, 1026.6949152542372, 625, 2728, 867.0, 1466.0, 2494.0, 2728.0, 0.2641534776476909, 316.0193938741018, 0.5215999334019834], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 5, 20.833333333333332, 907.1666666666666, 196, 1542, 868.0, 1513.5, 1537.75, 1542.0, 0.09517011658339282, 0.030158889483702118, 0.04293807994289793], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 14, 0, 0.0, 121.14285714285714, 79, 321, 82.0, 280.0, 321.0, 321.0, 0.06769989603230252, 0.01824723760245654, 0.0398662473705844], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 14, 0, 0.0, 103.64285714285714, 78, 244, 81.0, 242.0, 244.0, 244.0, 0.06775067750677506, 0.018260924796747968, 0.03982998814363144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 306.44444444444446, 78, 2381, 81.0, 932.0000000000023, 2381.0, 2381.0, 0.10522746670719872, 15.80427832774556, 0.060355076932970105], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 188.16666666666666, 78, 622, 81.5, 619.3, 622.0, 622.0, 0.10522685155414215, 5.180332973564677, 0.060457484698262], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 14, 0, 0.0, 92.5, 77, 242, 81.0, 164.5, 242.0, 242.0, 0.06775067750677506, 0.01812859925474255, 0.03863905826558266], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 93.8888888888889, 79, 237, 82.0, 132.60000000000016, 237.0, 237.0, 0.10522685155414215, 0.07820081448506071, 0.05281894697151275], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 14, 0, 0.0, 82.35714285714286, 80, 89, 82.0, 87.5, 89.0, 89.0, 0.06775034964019726, 0.0503496250744044, 0.03400749972173964], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 111.72222222222223, 78, 323, 81.0, 250.1000000000001, 323.0, 323.0, 0.1052280818674477, 0.05449800724319964, 0.058539971325347696], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 14, 0, 0.0, 115.42857142857143, 83, 255, 87.5, 246.5, 255.0, 255.0, 0.06655415844643578, 0.05238540205842505, 0.023657923510256473], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 447.2142857142858, 80, 798, 436.5, 724.0, 798.0, 798.0, 0.07399655387477669, 0.014287281049482552, 0.05035647179145657], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1226.090909090909, 870, 2633, 1205.5, 1629.3999999999999, 2485.699999999998, 2633.0, 0.09662514713374677, 0.05001106248133378, 0.044443793261713604], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f5a58471-a265-4417-88ef-263ce4ebe5c1", 3, 0, 0.0, 644.0, 311, 971, 650.0, 971.0, 971.0, 971.0, 0.12023566189731875, 0.054403505871508155, 0.07710424932868422], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/334bda08-86f7-4ae9-ab30-bc90ef9f8a3d", 3, 0, 0.0, 252.66666666666669, 164, 424, 170.0, 424.0, 424.0, 424.0, 0.07325291790789666, 0.03314503772525272, 0.046975341236509253], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 14, 0, 0.0, 216.85714285714283, 162, 402, 168.0, 366.0, 402.0, 402.0, 0.06767208043310131, 0.10487850746809745, 0.15219609495843], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/89d3de55-a96a-44e2-bdf6-dcba8cf6d1b5", 3, 0, 0.0, 495.6666666666667, 184, 922, 381.0, 922.0, 922.0, 922.0, 0.024579284578956855, 0.024651294201746766, 0.015762106321791994], "isController": false}, {"data": ["addBook", 62, 10, 16.129032258064516, 1003.7419354838712, 416, 2909, 744.5, 1833.8000000000002, 2834.6499999999996, 2909.0, 0.29236043325930017, 97.01995345221086, 1.0615932995232638], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2eef6eae-6d8a-44dc-a85a-4f21bb701c7e", 1, 0, 0.0, 403.0, 403, 403, 403.0, 403.0, 403.0, 403.0, 2.4813895781637716, 0.44829792183622824, 1.710801799007444], "isController": false}, {"data": ["https://demoqa.com/books-0", 59, 0, 0.0, 135.37288135593218, 78, 372, 84.0, 326.0, 329.0, 372.0, 0.2652985057848564, 0.19716031533425366, 0.1282448831674843], "isController": false}, {"data": ["https://demoqa.com/books-3", 59, 0, 0.0, 546.0338983050848, 385, 1446, 479.0, 732.0, 854.0, 1446.0, 0.26518284132177916, 77.97256024763134, 0.13336832351632447], "isController": false}, {"data": ["https://demoqa.com/books-1", 59, 0, 0.0, 123.03389830508475, 78, 249, 83.0, 242.0, 247.0, 249.0, 0.2654417355390492, 0.4697074460905831, 0.12909178154145165], "isController": false}, {"data": ["https://demoqa.com/books-2", 59, 0, 0.0, 888.4576271186442, 540, 2647, 782.0, 1101.0, 2410.0, 2647.0, 0.2645858558679761, 238.07481820232968, 0.1328096971837302], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 104.16666666666669, 80, 261, 85.0, 249.3, 261.0, 261.0, 0.1065561639780968, 0.07960494672191801, 0.03787738641408909], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 183, 10, 5.46448087431694, 169.98907103825135, 80, 2465, 86.0, 293.6, 394.79999999999995, 1918.1599999999978, 0.7535143414778763, 1.6163693270252242, 0.3620803043497954], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 88.125, 82, 104, 86.0, 104.0, 104.0, 104.0, 0.04564204088385812, 0.03534583830165966, 0.016224319220433943], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dbadd81b-425b-4a39-b4fe-6656acc016f3", 1, 0, 0.0, 381.0, 381, 381, 381.0, 381.0, 381.0, 381.0, 2.6246719160104988, 0.47418389107611547, 1.8095882545931758], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/89810b06-a85e-4b3f-8c61-0b0d10470f76", 3, 0, 0.0, 693.3333333333334, 252, 1314, 514.0, 1314.0, 1314.0, 1314.0, 0.03341092091635019, 0.027853310047777618, 0.02142562311367509], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 98.5, 81, 248, 85.0, 174.0, 248.0, 248.0, 0.06880080202077785, 0.05583346335865858, 0.024456535093323375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9fade135-ca8c-48d3-8198-eea8894dc099", 1, 0, 0.0, 604.0, 604, 604, 604.0, 604.0, 604.0, 604.0, 1.6556291390728477, 0.29911268625827814, 1.1414786837748345], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 289.75, 160, 1155, 165.5, 1155.0, 1155.0, 1155.0, 0.04631023224581471, 6.9881925640962566, 0.10267168433209069], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 432.9444444444444, 162, 2462, 259.0, 1011.2000000000023, 2462.0, 2462.0, 0.10517643346714113, 21.107099053192982, 0.23205920118498782], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dfbb63fa-03ec-4b73-9106-40464972739a", 3, 0, 0.0, 254.0, 173, 396, 193.0, 396.0, 396.0, 396.0, 0.03101448376391775, 0.031105346509319853, 0.019888845382460277], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/113446fa-d85d-4ca2-a243-33bea858938a", 3, 0, 0.0, 330.66666666666663, 175, 640, 177.0, 640.0, 640.0, 640.0, 0.07068303371580709, 0.03276453125368141, 0.04532733607426431], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1f1be00a-118e-4339-8e79-77f79e0506a0", 1, 0, 0.0, 188.0, 188, 188, 188.0, 188.0, 188.0, 188.0, 5.319148936170213, 1.6985954122340425, 3.173828125], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 94.42857142857143, 80, 237, 83.5, 161.5, 237.0, 237.0, 0.08604159496533753, 0.07133722082575349, 0.030585098210334827], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 97.26315789473684, 82, 250, 85.0, 128.0, 250.0, 250.0, 0.08948335138699194, 0.06947193784439316, 0.031808535063344794], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b3d6d284-f8c3-46f7-9498-b2d76f8691d0", 1, 0, 0.0, 354.0, 354, 354, 354.0, 354.0, 354.0, 354.0, 2.824858757062147, 0.9020789194915255, 1.6855358403954803], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 109.38888888888889, 78, 243, 83.0, 242.1, 243.0, 243.0, 0.10797646113147334, 0.08024422550883907, 0.054199122091384076], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 142.55555555555557, 78, 244, 83.0, 242.2, 244.0, 244.0, 0.10797775658214408, 0.04691221108451659, 0.060573459367370325], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 211.38888888888889, 78, 946, 82.5, 919.0, 946.0, 946.0, 0.10797969981643452, 10.821461658958116, 0.06244919705095442], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 168.05555555555557, 78, 623, 82.0, 490.7000000000002, 623.0, 623.0, 0.10797840431913618, 3.5535627249550092, 0.06255389547090583], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 21.73913043478261, 0.36443148688046645], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 8.695652173913043, 0.1457725947521866], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 8.695652173913043, 0.1457725947521866], "isController": false}, {"data": ["401/Unauthorized", 14, 60.869565217391305, 1.0204081632653061], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1372, 23, "401/Unauthorized", 14, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 183, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
