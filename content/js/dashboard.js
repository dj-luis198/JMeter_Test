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

    var data = {"OkPercent": 99.45482866043614, "KoPercent": 0.5451713395638629};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8106926698049765, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.125, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/40095274-a5f8-47f1-b122-1a2e7b7857eb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6dc9f0e4-3675-40c2-b4e9-afae80957c65"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2b5af093-71e1-4c78-a655-a7168c2ee5ca"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/70c9d903-881c-4b9e-9755-b4770c3ccd36"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.875, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6a3a7d68-3436-4589-b656-8f0e5d15e8ee"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bb48f5d6-4b93-40fb-b9d4-88a47acc7644"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a0be85fe-5fe5-4271-9158-8e45eb98d24c"], "isController": false}, {"data": [0.025, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0d588271-8cc6-40f2-bc26-28bdfc4c3cc6"], "isController": false}, {"data": [0.6, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7af80707-cea0-488e-90a4-cc8b7ec779fa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8648d423-5fff-44eb-9136-6b6653a0fb7e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/76d2e104-066e-4c6f-90c5-b9214dd4ad7b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4b64f218-2323-4cca-8d68-6dd95df591d5"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b5975d0a-3134-4a5f-a8f9-ed4f15008da5"], "isController": false}, {"data": [0.38095238095238093, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0d588271-8cc6-40f2-bc26-28bdfc4c3cc6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.4107142857142857, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=40095274-a5f8-47f1-b122-1a2e7b7857eb"], "isController": false}, {"data": [0.38095238095238093, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6dc9f0e4-3675-40c2-b4e9-afae80957c65"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.4, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3389830508474576, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5625, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a69c58f3-2585-4e0f-8d2d-fe24e599f6eb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/37d37c4b-1ee2-4e6b-abf4-046cecd22c4c"], "isController": false}, {"data": [0.9741379310344828, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a0be85fe-5fe5-4271-9158-8e45eb98d24c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7af80707-cea0-488e-90a4-cc8b7ec779fa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d0935371-b023-4719-a3f2-adcfb2f10d50"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bb48f5d6-4b93-40fb-b9d4-88a47acc7644"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2b5af093-71e1-4c78-a655-a7168c2ee5ca"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=76d2e104-066e-4c6f-90c5-b9214dd4ad7b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e5d3bbe7-b483-4c1e-981b-7e068d3c4bd4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6a3a7d68-3436-4589-b656-8f0e5d15e8ee"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8648d423-5fff-44eb-9136-6b6653a0fb7e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4b64f218-2323-4cca-8d68-6dd95df591d5"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b5975d0a-3134-4a5f-a8f9-ed4f15008da5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1284, 7, 0.5451713395638629, 348.859034267913, 96, 1841, 114.5, 1011.5, 1209.75, 1552.7500000000005, 5.048618510814817, 718.3142797277226, 3.6861455060807544], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1683.535714285715, 1195, 2280, 1688.0, 2048.7, 2106.85, 2280.0, 0.2448601236543624, 294.64985753841245, 1.2039753150387842], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/40095274-a5f8-47f1-b122-1a2e7b7857eb", 3, 0, 0.0, 328.0, 253, 413, 318.0, 413.0, 413.0, 413.0, 0.0172701629152035, 0.023808313784468366, 0.01107494171320016], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6dc9f0e4-3675-40c2-b4e9-afae80957c65", 1, 0, 0.0, 494.0, 494, 494, 494.0, 494.0, 494.0, 494.0, 2.0242914979757085, 0.36571672570850206, 1.3956540991902835], "isController": false}, {"data": ["deleteBook", 12, 0, 0.0, 466.83333333333337, 387, 729, 423.5, 681.3000000000002, 729.0, 729.0, 0.07463568456471846, 0.013483985980930582, 0.05072894185258208], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 0, 0.0, 466.83333333333337, 387, 729, 423.5, 681.3000000000002, 729.0, 729.0, 0.07473841554559044, 0.013502545777279521, 0.050798766816143495], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2b5af093-71e1-4c78-a655-a7168c2ee5ca", 3, 0, 0.0, 294.0, 191, 412, 279.0, 412.0, 412.0, 412.0, 0.02675227394328518, 0.026830649745853398, 0.01715559233993223], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 154.94736842105266, 99, 315, 103.0, 307.0, 315.0, 315.0, 0.09981717696009415, 0.04249002156576376, 0.0560445539222897], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 102.78947368421052, 100, 107, 103.0, 106.0, 107.0, 107.0, 0.09981350634341099, 0.07417781086653884, 0.05010170142628247], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 197.15789473684208, 100, 805, 103.0, 800.0, 805.0, 805.0, 0.09981665256975344, 3.113483325365513, 0.057875804771761345], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 212.73684210526318, 99, 1214, 102.0, 900.0, 1214.0, 1214.0, 0.09981665256975344, 9.478303258094343, 0.0577783275719862], "isController": false}, {"data": ["goToProfile", 12, 0, 0.0, 228.25000000000003, 185, 308, 202.5, 301.70000000000005, 308.0, 308.0, 0.07496532853555231, 0.18148344671839273, 0.048463913564976195], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/70c9d903-881c-4b9e-9755-b4770c3ccd36", 1, 0, 0.0, 264.0, 264, 264, 264.0, 264.0, 264.0, 264.0, 3.787878787878788, 1.2096058238636362, 2.260150331439394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 102.4736842105263, 100, 111, 102.0, 105.0, 111.0, 111.0, 0.10058870865274659, 0.07475391336400407, 0.05049081664796069], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 138.1578947368421, 98, 399, 102.0, 303.0, 399.0, 399.0, 0.10058870865274659, 0.02691533805747321, 0.05736699790351955], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 764.6666666666666, 604, 877, 813.0, 877.0, 877.0, 877.0, 0.0726427429899753, 21.359378405128577, 0.041429064361470286], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 1070.6666666666667, 1006, 1107, 1099.0, 1107.0, 1107.0, 1107.0, 0.07176861797564651, 64.57752861026052, 0.04086045339824406], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 239.66666666666666, 101, 310, 308.0, 310.0, 310.0, 310.0, 0.07316716257743525, 0.1294715806546022, 0.040513458184966586], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 103.61538461538461, 99, 123, 103.0, 115.39999999999999, 123.0, 123.0, 0.058339129849440174, 0.043355544741624966, 0.02928350853770727], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 117.7692307692308, 100, 300, 103.0, 222.79999999999993, 300.0, 300.0, 0.058344628254957044, 0.02909342265297513, 0.03252081893417828], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 265.00000000000006, 98, 1183, 102.0, 1090.1999999999998, 1183.0, 1183.0, 0.058292304518998805, 8.082758747769198, 0.033498807810272], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 193.9230769230769, 98, 808, 102.0, 725.1999999999999, 808.0, 808.0, 0.05834515196668043, 2.652600622946699, 0.03358615531255049], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 102.66666666666667, 102, 104, 102.0, 104.0, 104.0, 104.0, 0.07353481873667182, 0.05464843462754615, 0.04129152419295537], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 820.6666666666666, 99, 1473, 1066.0, 1378.2, 1473.0, 1473.0, 0.0658455001185219, 39.50451364044406, 0.0349375537738251], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 123.63157894736842, 99, 303, 103.0, 298.0, 303.0, 303.0, 0.10059030627101147, 0.02711223098710856, 0.05913609802260635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 566.6, 96, 922, 784.0, 906.4, 922.0, 922.0, 0.06584665630679275, 12.9133180898324, 0.03500247062141684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 121.89473684210526, 98, 302, 101.0, 297.0, 302.0, 302.0, 0.10058924118652951, 0.027111943913556782, 0.0592337035502708], "isController": false}, {"data": ["deleteBooks", 12, 0, 0.0, 507.91666666666663, 379, 827, 447.5, 795.2000000000002, 827.0, 827.0, 0.07459532038690106, 0.013476693624586618, 0.05142997675112515], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 370.9230769230769, 202, 1287, 207.0, 1194.1999999999998, 1287.0, 1287.0, 0.0582596498146895, 10.799291760124854, 0.12873404441850148], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6a3a7d68-3436-4589-b656-8f0e5d15e8ee", 3, 0, 0.0, 461.3333333333333, 308, 564, 512.0, 564.0, 564.0, 564.0, 0.02276245106073022, 0.022829137929072204, 0.014597014514856293], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bb48f5d6-4b93-40fb-b9d4-88a47acc7644", 1, 0, 0.0, 464.0, 464, 464, 464.0, 464.0, 464.0, 464.0, 2.155172413793103, 0.3893622036637931, 1.4858903556034482], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 494.50000000000006, 129, 1638, 429.0, 801.9000000000001, 1596.5499999999993, 1638.0, 0.08631292751871912, 0.05301839004811946, 0.0390262553136396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 117.6, 99, 299, 102.0, 203.00000000000006, 299.0, 299.0, 0.06584607820758195, 0.048934438980439324, 0.03305164472529016], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 182.06666666666666, 100, 306, 104.0, 305.4, 306.0, 306.0, 0.0658455001185219, 0.08355005190820258, 0.03386584967033353], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a0be85fe-5fe5-4271-9158-8e45eb98d24c", 1, 0, 0.0, 434.0, 434, 434, 434.0, 434.0, 434.0, 434.0, 2.304147465437788, 0.4162766417050691, 1.5886016705069124], "isController": false}, {"data": ["login", 20, 0, 0.0, 2221.2, 1473, 3127, 2011.0, 3037.3, 3122.95, 3127.0, 0.0873213732159152, 15.792543621119112, 0.15346901892254158], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 117.21052631578947, 101, 309, 105.0, 125.0, 309.0, 309.0, 0.0946681880010563, 0.0766405545438239, 0.03365158245350048], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0d588271-8cc6-40f2-bc26-28bdfc4c3cc6", 1, 0, 0.0, 401.0, 401, 401, 401.0, 401.0, 401.0, 401.0, 2.493765586034913, 0.45053382169576056, 1.7193344763092269], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 953.333333333333, 201, 1581, 1170.0, 1483.2, 1581.0, 1581.0, 0.06581631981466124, 52.52680078250119, 0.1367959641981159], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7af80707-cea0-488e-90a4-cc8b7ec779fa", 1, 0, 0.0, 721.0, 721, 721, 721.0, 721.0, 721.0, 721.0, 1.3869625520110958, 0.2505742891816921, 0.956245665742025], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8648d423-5fff-44eb-9136-6b6653a0fb7e", 1, 0, 0.0, 430.0, 430, 430, 430.0, 430.0, 430.0, 430.0, 2.3255813953488373, 0.42014898255813954, 1.6033793604651163], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/76d2e104-066e-4c6f-90c5-b9214dd4ad7b", 3, 0, 0.0, 376.0, 185, 530, 413.0, 530.0, 530.0, 530.0, 0.02249600695876482, 0.0265895186416911, 0.014426150295822492], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4b64f218-2323-4cca-8d68-6dd95df591d5", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 0.4221122955607477, 1.6108717873831777], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 370.2631578947368, 201, 1317, 210.0, 1004.0, 1317.0, 1317.0, 0.09976057462090983, 12.701316798565024, 0.2216770622217205], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 3, 0, 0.0, 1174.0, 1111, 1209, 1202.0, 1209.0, 1209.0, 1209.0, 0.07159221076746851, 85.64917355741694, 0.16143204556844215], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b5975d0a-3134-4a5f-a8f9-ed4f15008da5", 3, 0, 0.0, 546.6666666666666, 194, 963, 483.0, 963.0, 963.0, 963.0, 0.024540278777566912, 0.024612174125548066, 0.015737092835874614], "isController": false}, {"data": ["register", 21, 4, 19.047619047619047, 976.1904761904763, 376, 1602, 1019.0, 1473.0, 1590.3999999999999, 1602.0, 0.08663151902180638, 0.027507441028687407, 0.039085704871166554], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 274.47368421052624, 205, 500, 209.0, 404.0, 500.0, 500.0, 0.10053335590924484, 0.15580706623825347, 0.22610187369042076], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 127.43749999999997, 103, 447, 106.0, 212.50000000000023, 447.0, 447.0, 0.10716390719605637, 0.08319854123131329, 0.03809342013609816], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 289.0625, 204, 505, 212.0, 438.50000000000006, 505.0, 505.0, 0.07872349847227211, 0.12200604694872641, 0.17705099314613543], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0d588271-8cc6-40f2-bc26-28bdfc4c3cc6", 3, 0, 0.0, 386.3333333333333, 287, 551, 321.0, 551.0, 551.0, 551.0, 0.02342523835180023, 0.0276878386899045, 0.01502204412534064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 6, 0, 0.0, 135.5, 100, 301, 103.0, 301.0, 301.0, 301.0, 0.04720209577305232, 0.035078901253215646, 0.023693239479832904], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 6, 0, 0.0, 101.33333333333334, 99, 103, 101.0, 103.0, 103.0, 103.0, 0.04720246711561457, 0.012630347646170307, 0.02692015702687394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 6, 0, 0.0, 133.83333333333331, 99, 295, 102.5, 295.0, 295.0, 295.0, 0.04720283846401964, 0.012722640054755293, 0.027750106206386543], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 6, 0, 0.0, 134.0, 100, 293, 103.0, 293.0, 293.0, 293.0, 0.047201724436332734, 0.012722339789480308, 0.027795546713973284], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1182.214285714286, 783, 1841, 1112.5, 1621.4, 1686.55, 1841.0, 0.23935510894931655, 286.3519236029783, 0.4726328420854669], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=40095274-a5f8-47f1-b122-1a2e7b7857eb", 1, 0, 0.0, 827.0, 827, 827, 827.0, 827.0, 827.0, 827.0, 1.2091898428053203, 0.2184571493349456, 0.833679715840387], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 4, 19.047619047619047, 976.1904761904763, 376, 1602, 1019.0, 1473.0, 1590.3999999999999, 1602.0, 0.08540126393870628, 0.027116807578752167, 0.038530648378596], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6dc9f0e4-3675-40c2-b4e9-afae80957c65", 3, 0, 0.0, 322.3333333333333, 187, 444, 336.0, 444.0, 444.0, 444.0, 0.02433820367831385, 0.02440950700940266, 0.015607506916106212], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 11, 0, 0.0, 156.45454545454547, 100, 310, 103.0, 308.4, 310.0, 310.0, 0.05820475374097826, 0.01568800003174805, 0.03427486963457997], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 11, 0, 0.0, 156.54545454545453, 99, 306, 103.0, 305.2, 306.0, 306.0, 0.05820506172382227, 0.015688083042748973, 0.034218210114981454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 306.06249999999994, 99, 1218, 104.0, 1091.3000000000002, 1218.0, 1218.0, 0.10618599804883229, 17.938194305029235, 0.060714747907804005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 299.25000000000006, 101, 1011, 104.5, 879.4000000000001, 1011.0, 1011.0, 0.10604735014183833, 5.86974413177046, 0.060739034041199395], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 11, 0, 0.0, 136.9090909090909, 98, 296, 103.0, 295.6, 296.0, 296.0, 0.05820475374097826, 0.0155743188720977, 0.03319489861790167], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 116.8125, 101, 314, 103.0, 171.90000000000015, 314.0, 314.0, 0.10618529333687285, 0.0789130939739846, 0.053300039819485], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 11, 0, 0.0, 138.8181818181818, 101, 305, 104.0, 303.4, 305.0, 305.0, 0.05820382981200163, 0.04325499461614574, 0.029215594261102377], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 171.74999999999997, 99, 414, 102.5, 339.1000000000001, 414.0, 414.0, 0.10604453870625662, 0.05823906001458112, 0.058808635173647934], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 11, 0, 0.0, 107.09090909090908, 102, 124, 105.0, 122.0, 124.0, 124.0, 0.05746676070318418, 0.045232626100357866, 0.020427637593710003], "isController": false}, {"data": ["deleteAccount", 11, 0, 0.0, 446.27272727272725, 383, 564, 422.0, 561.4, 564.0, 564.0, 0.07532131387760971, 0.013607854557966599, 0.05126851149677145], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1250.5000000000002, 788, 1662, 1236.0, 1556.5, 1656.75, 1662.0, 0.0870102411053781, 0.045034597447119525, 0.04002131207093075], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 11, 0, 0.0, 315.09090909090907, 205, 615, 208.0, 610.8000000000001, 615.0, 615.0, 0.05817243367020461, 0.09015591038536594, 0.13083116674070433], "isController": false}, {"data": ["addBook", 59, 3, 5.084745762711864, 1057.7966101694915, 525, 2624, 856.0, 1781.0, 1945.0, 2624.0, 0.26279570084050086, 91.60546337368436, 0.954100288017407], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 190.14285714285708, 100, 418, 104.0, 410.3, 413.6, 418.0, 0.24056326169416678, 0.1787779708488876, 0.11628790482286382], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 652.6785714285713, 490, 923, 604.0, 841.5000000000005, 919.15, 923.0, 0.24019696150843692, 70.62588197321804, 0.1208021827898877], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a69c58f3-2585-4e0f-8d2d-fe24e599f6eb", 1, 0, 0.0, 479.0, 479, 479, 479.0, 479.0, 479.0, 479.0, 2.08768267223382, 0.6666721033402923, 1.245677844467641], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 158.25000000000003, 98, 433, 104.0, 305.90000000000003, 327.79999999999984, 433.0, 0.24092653461598032, 0.4263270319571839, 0.1171693498425373], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 990.142857142857, 681, 1388, 990.5, 1227.7000000000003, 1298.85, 1388.0, 0.23981945021391038, 215.7899628601039, 0.12037812247065424], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 111.75, 102, 144, 110.0, 128.60000000000002, 144.0, 144.0, 0.08371878858912911, 0.06254382155340212, 0.02975941313129199], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/37d37c4b-1ee2-4e6b-abf4-046cecd22c4c", 1, 0, 0.0, 191.0, 191, 191, 191.0, 191.0, 191.0, 191.0, 5.235602094240838, 1.6719159031413613, 3.1239774214659684], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 3, 1.7241379310344827, 162.04597701149433, 99, 1086, 109.0, 263.0, 308.0, 1019.25, 0.7144264879779267, 1.5483290336868514, 0.3441176704564118], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 6, 0, 0.0, 108.5, 101, 118, 105.5, 118.0, 118.0, 118.0, 0.046738436131927026, 0.036194902199822396, 0.016614053468770935], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 129.89473684210523, 100, 310, 107.0, 307.0, 310.0, 310.0, 0.09675218201631547, 0.07851666333550603, 0.03439237720111214], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a0be85fe-5fe5-4271-9158-8e45eb98d24c", 3, 0, 0.0, 264.3333333333333, 189, 389, 215.0, 389.0, 389.0, 389.0, 0.02175726148602096, 0.025716346502520217, 0.01395241052326214], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7af80707-cea0-488e-90a4-cc8b7ec779fa", 2, 0, 0.0, 191.0, 182, 200, 191.0, 200.0, 200.0, 200.0, 0.03164356686285678, 0.02793533637111575, 0.019669072566609706], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d0935371-b023-4719-a3f2-adcfb2f10d50", 1, 0, 0.0, 202.0, 202, 202, 202.0, 202.0, 202.0, 202.0, 4.9504950495049505, 1.580870977722772, 2.953859839108911], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 6, 0, 0.0, 271.16666666666663, 203, 596, 206.5, 596.0, 596.0, 596.0, 0.047163508021726655, 0.07309422581101582, 0.1060718349355825], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bb48f5d6-4b93-40fb-b9d4-88a47acc7644", 3, 0, 0.0, 295.6666666666667, 238, 383, 266.0, 383.0, 383.0, 383.0, 0.03863788573489259, 0.024840437606254186, 0.024777550422440883], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 481.12500000000006, 204, 1322, 406.5, 1249.2, 1322.0, 1322.0, 0.1059728974314819, 23.90477295099747, 0.23325162519373172], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2b5af093-71e1-4c78-a655-a7168c2ee5ca", 1, 0, 0.0, 398.0, 398, 398, 398.0, 398.0, 398.0, 398.0, 2.512562814070352, 0.4539298052763819, 1.7322942839195978], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 120.92307692307693, 103, 306, 105.0, 228.39999999999992, 306.0, 306.0, 0.06205665295055517, 0.05145126792482553, 0.022059200853517657], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=76d2e104-066e-4c6f-90c5-b9214dd4ad7b", 1, 0, 0.0, 379.0, 379, 379, 379.0, 379.0, 379.0, 379.0, 2.638522427440633, 0.47668618073878627, 1.8191375329815302], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 105.13333333333334, 99, 115, 104.0, 113.8, 115.0, 115.0, 0.06652681252300718, 0.05164923433182687, 0.02364820288903771], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e5d3bbe7-b483-4c1e-981b-7e068d3c4bd4", 1, 0, 0.0, 245.0, 245, 245, 245.0, 245.0, 245.0, 245.0, 4.081632653061225, 1.3034119897959184, 2.4354272959183674], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6a3a7d68-3436-4589-b656-8f0e5d15e8ee", 1, 0, 0.0, 461.0, 461, 461, 461.0, 461.0, 461.0, 461.0, 2.1691973969631237, 0.3918960140997831, 1.495559924078091], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8648d423-5fff-44eb-9136-6b6653a0fb7e", 3, 0, 0.0, 341.0, 186, 422, 415.0, 422.0, 422.0, 422.0, 0.028229183329726272, 0.022945400642684407, 0.018102698945169516], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4b64f218-2323-4cca-8d68-6dd95df591d5", 3, 0, 0.0, 346.6666666666667, 205, 435, 400.0, 435.0, 435.0, 435.0, 0.05135491380933632, 0.03301626131947892, 0.03293267584778403], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b5975d0a-3134-4a5f-a8f9-ed4f15008da5", 1, 0, 0.0, 658.0, 658, 658, 658.0, 658.0, 658.0, 658.0, 1.5197568389057752, 0.2745654445288754, 1.0478011018237081], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 103.5625, 100, 113, 103.0, 108.10000000000001, 113.0, 113.0, 0.07876341439401398, 0.058534139017426406, 0.0395355419907453], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 171.0625, 99, 401, 103.0, 333.80000000000007, 401.0, 401.0, 0.07876806742546572, 0.021076611791579696, 0.04492241345358592], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 152.25000000000003, 98, 306, 102.5, 306.0, 306.0, 306.0, 0.07876845520290263, 0.021230560191407344, 0.046307236359518916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 139.43749999999997, 98, 306, 103.0, 301.8, 306.0, 306.0, 0.07876884298415762, 0.02123066471057373, 0.04638438703071], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 57.142857142857146, 0.3115264797507788], "isController": false}, {"data": ["401/Unauthorized", 3, 42.857142857142854, 0.2336448598130841], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1284, 7, "406/Not Acceptable", 4, "401/Unauthorized", 3, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
