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

    var data = {"OkPercent": 99.84051036682615, "KoPercent": 0.1594896331738437};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7633561643835617, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/9148a4a9-7ff1-424b-a802-708614bdf811"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3c9731d7-1287-4565-bf7c-d256bf0a23f8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=68802915-5433-470f-b7da-455deb85fded"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7692307692307693, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6377e800-9e26-482b-8587-b7a6fe55025e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f4a3b1aa-9564-48a9-a08d-06d311561eb7"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7882235d-c043-42e1-b41e-5915edfc8af9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/17b19dd5-8fd3-4239-ba4a-64113cbdeee5"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.46875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.631578947368421, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9cc60fe5-d123-4e43-bbb8-12a67282e103"], "isController": false}, {"data": [0.02631578947368421, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/95a42bf4-f452-4621-8e26-583e460e02db"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.40625, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=87e23c26-1242-4338-8b61-a7cced0fd31a"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/98b88ceb-dab6-40e6-951c-0be145828887"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d1900c60-93d5-4b8f-b7dc-028494c9da88"], "isController": false}, {"data": [0.5625, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9f698d2d-8e9e-4f55-96b2-5649764a53b5"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d8f66a11-fc63-48b5-a9fa-d7354915bed8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3258f9a5-1a07-48cb-ad81-e2f4ff35d169"], "isController": false}, {"data": [0.36363636363636365, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.19811320754716982, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.36363636363636365, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e07fed5e-87f1-40ef-aa1f-3dece71d8f6f"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.875, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.3157894736842105, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6377e800-9e26-482b-8587-b7a6fe55025e"], "isController": false}, {"data": [0.85, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f4a3b1aa-9564-48a9-a08d-06d311561eb7"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=17b19dd5-8fd3-4239-ba4a-64113cbdeee5"], "isController": false}, {"data": [0.36065573770491804, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7882235d-c043-42e1-b41e-5915edfc8af9"], "isController": false}, {"data": [0.9056603773584906, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9905660377358491, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.330188679245283, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9914285714285714, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/984b96ae-523b-4485-9c78-d6232b618afb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d1900c60-93d5-4b8f-b7dc-028494c9da88"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=98b88ceb-dab6-40e6-951c-0be145828887"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f7cad022-9f30-4016-b0fb-d556e11c0b0c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d8f66a11-fc63-48b5-a9fa-d7354915bed8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3c9731d7-1287-4565-bf7c-d256bf0a23f8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9cc60fe5-d123-4e43-bbb8-12a67282e103"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/68802915-5433-470f-b7da-455deb85fded"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/87e23c26-1242-4338-8b61-a7cced0fd31a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3258f9a5-1a07-48cb-ad81-e2f4ff35d169"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4248b0b9-2e33-4223-9e7b-b23516dcab24"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1254, 2, 0.1594896331738437, 478.764752791069, 138, 2612, 164.5, 1337.0, 1657.5, 2126.6000000000004, 5.062350884700316, 679.4411900990468, 3.6822222393232433], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/9148a4a9-7ff1-424b-a802-708614bdf811", 1, 0, 0.0, 643.0, 643, 643, 643.0, 643.0, 643.0, 643.0, 1.5552099533437014, 0.4966344284603421, 0.9279621889580093], "isController": false}, {"data": ["see books", 53, 0, 0.0, 2454.4150943396226, 1748, 3234, 2428.0, 3076.0, 3130.0, 3234.0, 0.23066645195827112, 277.57014500841063, 1.1341851421971632], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/3c9731d7-1287-4565-bf7c-d256bf0a23f8", 3, 0, 0.0, 311.3333333333333, 232, 457, 245.0, 457.0, 457.0, 457.0, 0.027619222979193517, 0.027700138671515374, 0.017711545986006258], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=68802915-5433-470f-b7da-455deb85fded", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 0.4221122955607477, 1.6108717873831777], "isController": false}, {"data": ["deleteBook", 13, 0, 0.0, 623.1538461538461, 417, 1520, 482.0, 1270.3999999999996, 1520.0, 1520.0, 0.08470158978368518, 0.015302533310529061, 0.057570611806098515], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 0, 0.0, 623.1538461538461, 417, 1520, 482.0, 1270.3999999999996, 1520.0, 1520.0, 0.0860847338657343, 0.015552417739414888, 0.05851071754936628], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 238.25000000000003, 141, 454, 150.5, 453.3, 454.0, 454.0, 0.119994000299985, 0.0546359400779961, 0.06717437565621719], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 204.875, 144, 450, 150.5, 445.8, 450.0, 450.0, 0.12025102401262636, 0.08936623952500845, 0.060360377287587835], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 347.625, 145, 1180, 152.0, 968.6000000000003, 1180.0, 1180.0, 0.12025283157839357, 4.44815106574072, 0.06952116825625879], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 419.00000000000006, 142, 1978, 149.0, 1654.6000000000004, 1978.0, 1978.0, 0.11999580014699485, 13.52485377855525, 0.06925538856140036], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6377e800-9e26-482b-8587-b7a6fe55025e", 3, 0, 0.0, 406.3333333333333, 336, 445, 438.0, 445.0, 445.0, 445.0, 0.020522222146213992, 0.02425657181409603, 0.013160409384128114], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f4a3b1aa-9564-48a9-a08d-06d311561eb7", 1, 0, 0.0, 471.0, 471, 471, 471.0, 471.0, 471.0, 471.0, 2.1231422505307855, 0.3835755042462845, 1.463807059447983], "isController": false}, {"data": ["goToProfile", 14, 0, 0.0, 325.57142857142856, 234, 526, 276.0, 501.5, 526.0, 526.0, 0.09029287137780471, 0.21683893525356174, 0.05837293051963548], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7882235d-c043-42e1-b41e-5915edfc8af9", 1, 0, 0.0, 456.0, 456, 456, 456.0, 456.0, 456.0, 456.0, 2.1929824561403506, 0.3961931195175438, 1.5119586074561402], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 165.94117647058826, 139, 444, 148.0, 216.79999999999978, 444.0, 444.0, 0.11127475045000819, 0.08269539559810178, 0.05585470872197676], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 183.58823529411765, 143, 460, 148.0, 444.8, 460.0, 460.0, 0.11127475045000819, 0.029774689085256094, 0.06346138111602029], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 165.76470588235293, 140, 430, 149.0, 221.19999999999982, 430.0, 430.0, 0.09180058752376015, 0.06822289756404441, 0.04607959178438742], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 234.6470588235294, 143, 448, 149.0, 446.4, 448.0, 448.0, 0.09179959608177725, 0.04078458617282084, 0.05144742988130852], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 377.70588235294116, 142, 1946, 148.0, 1753.1999999999998, 1946.0, 1946.0, 0.09180157898715857, 9.739858541191909, 0.053041146682722945], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/17b19dd5-8fd3-4239-ba4a-64113cbdeee5", 3, 0, 0.0, 941.3333333333334, 463, 1875, 486.0, 1875.0, 1875.0, 1875.0, 0.015993687824538583, 0.022048589823216436, 0.010256368819772462], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 331.7647058823529, 143, 1171, 151.0, 897.3999999999997, 1171.0, 1171.0, 0.09180058752376015, 3.197411088430966, 0.053130222845926216], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 181.58823529411762, 140, 450, 148.0, 447.6, 450.0, 450.0, 0.11105522057526604, 0.029932852420677176, 0.06528832303350601], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 1069.8125, 143, 1903, 1386.5, 1789.6000000000001, 1903.0, 1903.0, 0.10585020872338032, 59.53832614847476, 0.05654303141766507], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 180.35294117647055, 138, 434, 148.0, 432.4, 434.0, 434.0, 0.11106828085901516, 0.02993637257528143, 0.06540446616990833], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 757.6875, 143, 1326, 957.5, 1320.4, 1326.0, 1326.0, 0.10585230956507932, 19.463257464241767, 0.056647525040686986], "isController": false}, {"data": ["deleteBooks", 12, 0, 0.0, 559.75, 405, 994, 457.0, 983.5, 994.0, 994.0, 0.0905339238157031, 0.016356226470610424, 0.06241889669324843], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 616.1176470588235, 292, 2087, 319.0, 1897.3999999999999, 2087.0, 2087.0, 0.0917272786135152, 13.035754121320117, 0.20353570720382883], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 19, 0, 0.0, 734.1578947368421, 247, 1679, 649.0, 1618.0, 1679.0, 1679.0, 0.0843765681829284, 0.0518289661983027, 0.038150733465523286], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 148.6875, 141, 167, 148.5, 157.20000000000002, 167.0, 167.0, 0.10585160927524727, 0.07866511197115543, 0.05313254606198935], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 304.93750000000006, 142, 603, 288.5, 501.5000000000001, 603.0, 603.0, 0.10584810796507012, 0.12768444859751257, 0.054810507078592224], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9cc60fe5-d123-4e43-bbb8-12a67282e103", 3, 0, 0.0, 407.6666666666667, 254, 491, 478.0, 491.0, 491.0, 491.0, 0.02056033773781457, 0.024301623152996325, 0.013184851999835517], "isController": false}, {"data": ["login", 19, 0, 0.0, 2559.7894736842104, 1463, 4347, 2388.0, 3843.0, 4347.0, 4347.0, 0.08515482491719814, 0.12357428694038715, 0.12848066845417103], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/95a42bf4-f452-4621-8e26-583e460e02db", 1, 0, 0.0, 404.0, 404, 404, 404.0, 404.0, 404.0, 404.0, 2.4752475247524752, 0.790435488861386, 1.4769299195544554], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 170.70588235294116, 148, 442, 153.0, 216.3999999999998, 442.0, 442.0, 0.11489358826193036, 0.0930144381534573, 0.04084108020248305], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 1226.25, 296, 2058, 1556.5, 1938.3000000000002, 2058.0, 2058.0, 0.10574597173938906, 79.12954800619275, 0.22091510746434376], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=87e23c26-1242-4338-8b61-a7cced0fd31a", 1, 0, 0.0, 959.0, 959, 959, 959.0, 959.0, 959.0, 959.0, 1.0427528675703859, 0.18838796923879042, 0.7189292231491137], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/98b88ceb-dab6-40e6-951c-0be145828887", 3, 0, 0.0, 411.0, 250, 506, 477.0, 506.0, 506.0, 506.0, 0.03608111033603541, 0.029539060057008154, 0.02313795161523104], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d1900c60-93d5-4b8f-b7dc-028494c9da88", 1, 0, 0.0, 458.0, 458, 458, 458.0, 458.0, 458.0, 458.0, 2.1834061135371177, 0.39446301855895194, 1.5053561681222707], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 736.3749999999999, 293, 2423, 593.0, 1894.5000000000005, 2423.0, 2423.0, 0.11985557403328988, 18.08615052455541, 0.2657247235830824], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9f698d2d-8e9e-4f55-96b2-5649764a53b5", 1, 0, 0.0, 347.0, 347, 347, 347.0, 347.0, 347.0, 347.0, 2.881844380403458, 0.9202764769452451, 1.7195380043227666], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d8f66a11-fc63-48b5-a9fa-d7354915bed8", 3, 0, 0.0, 538.0, 234, 832, 548.0, 832.0, 832.0, 832.0, 0.030141362992434518, 0.030229667766826413, 0.01932893395022656], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3258f9a5-1a07-48cb-ad81-e2f4ff35d169", 3, 0, 0.0, 380.6666666666667, 276, 468, 398.0, 468.0, 468.0, 468.0, 0.039234662516511254, 0.02522410757490551, 0.02516024907471588], "isController": false}, {"data": ["register", 22, 2, 9.090909090909092, 1152.8636363636363, 207, 2031, 1163.0, 1696.3, 1987.0499999999993, 2031.0, 0.08891547371739429, 0.02854388786950442, 0.04011616099359001], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 190.31249999999994, 145, 447, 154.0, 435.8, 447.0, 447.0, 0.08557019162374788, 0.0664338890047652, 0.030417529053754125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 387.35294117647067, 291, 894, 301.0, 674.7999999999998, 894.0, 894.0, 0.11094795235764399, 0.17194765663240333, 0.24952454519497472], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 521.6875000000001, 292, 2105, 304.5, 1050.800000000001, 2105.0, 2105.0, 0.07843021916344368, 5.978317605929815, 0.1751372069283295], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 6, 0, 0.0, 198.33333333333334, 145, 446, 149.5, 446.0, 446.0, 446.0, 0.033112582781456956, 0.0246080815397351, 0.01662096440397351], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 6, 0, 0.0, 194.66666666666666, 143, 431, 148.5, 431.0, 431.0, 431.0, 0.033114227527857344, 0.008860642912727453, 0.018885457886981143], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 6, 0, 0.0, 146.83333333333334, 143, 151, 147.0, 151.0, 151.0, 151.0, 0.03311294826653716, 0.008924974337465093, 0.019466791852007195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 6, 0, 0.0, 245.16666666666666, 143, 454, 151.5, 454.0, 454.0, 454.0, 0.033114044770188526, 0.008925269879464877, 0.019499774410570003], "isController": false}, {"data": ["https://demoqa.com/books", 53, 0, 0.0, 1680.792452830189, 1138, 2612, 1565.0, 2474.0, 2515.3, 2612.0, 0.24684458106282894, 295.3119360125285, 0.48742162393460947], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 2, 9.090909090909092, 1152.8636363636363, 207, 2031, 1163.0, 1696.3, 1987.0499999999993, 2031.0, 0.0890515203523202, 0.02858756193128461, 0.04017754140895696], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 10, 0, 0.0, 177.2, 141, 443, 149.0, 414.0000000000001, 443.0, 443.0, 0.05786266874200772, 0.015595797434369268, 0.03407342700335025], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 10, 0, 0.0, 231.79999999999998, 143, 441, 150.0, 439.7, 441.0, 441.0, 0.05787237982800329, 0.01559841487551651, 0.03402262954732224], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e07fed5e-87f1-40ef-aa1f-3dece71d8f6f", 1, 0, 0.0, 314.0, 314, 314, 314.0, 314.0, 314.0, 314.0, 3.1847133757961785, 1.0169934315286624, 1.9002537818471337], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 374.8125, 140, 1690, 148.5, 1659.9, 1690.0, 1690.0, 0.08325744763887082, 9.384035140496943, 0.048051905815012355], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 272.1875, 139, 880, 149.0, 859.0, 880.0, 880.0, 0.08362296495675124, 3.0932126571197114, 0.048344526615621816], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 204.0, 141, 457, 149.5, 440.20000000000005, 457.0, 457.0, 0.08392738183286912, 0.062371814037903706, 0.04212761158407688], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 10, 0, 0.0, 205.79999999999998, 145, 450, 150.0, 446.8, 450.0, 450.0, 0.05796026244406835, 0.015508898349291724, 0.03305546217513273], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 219.68749999999997, 139, 456, 147.5, 446.90000000000003, 456.0, 456.0, 0.08380166241547816, 0.03815676279415693, 0.04691338181608678], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 10, 0, 0.0, 181.3, 143, 461, 152.0, 430.4000000000001, 461.0, 461.0, 0.05795992650681319, 0.04307373444500473, 0.029093166234865218], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 153.9, 151, 160, 153.5, 159.6, 160.0, 160.0, 0.05790019164963436, 0.04557378366172392, 0.020581708750455962], "isController": false}, {"data": ["deleteAccount", 12, 0, 0.0, 481.25, 435, 569, 477.0, 562.7, 569.0, 569.0, 0.08901548869503294, 0.016081899813067475, 0.06058964416058395], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 19, 0, 0.0, 1292.5263157894735, 747, 2050, 1238.0, 1937.0, 2050.0, 2050.0, 0.08519873726503085, 0.04409700268600229, 0.03918809106623977], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6377e800-9e26-482b-8587-b7a6fe55025e", 1, 0, 0.0, 994.0, 994, 994, 994.0, 994.0, 994.0, 994.0, 1.006036217303823, 0.18175459004024144, 0.6936148138832998], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 0, 0.0, 420.59999999999997, 293, 903, 303.5, 872.6000000000001, 903.0, 903.0, 0.057811154084068984, 0.08959599758927488, 0.13001864048399497], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f4a3b1aa-9564-48a9-a08d-06d311561eb7", 3, 0, 0.0, 401.6666666666667, 244, 526, 435.0, 526.0, 526.0, 526.0, 0.0350910026669162, 0.02852286251930005, 0.022503019288354464], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=17b19dd5-8fd3-4239-ba4a-64113cbdeee5", 1, 0, 0.0, 502.0, 502, 502, 502.0, 502.0, 502.0, 502.0, 1.9920318725099602, 0.3598885707171315, 1.3734125996015936], "isController": false}, {"data": ["addBook", 61, 0, 0.0, 1452.2786885245898, 837, 3350, 1171.0, 2628.6, 2928.3999999999996, 3350.0, 0.2915270761745912, 98.2514806722925, 1.060547351046391], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/7882235d-c043-42e1-b41e-5915edfc8af9", 3, 0, 0.0, 382.6666666666667, 274, 569, 305.0, 569.0, 569.0, 569.0, 0.04087527590811238, 0.026278863905768862, 0.02621233513638717], "isController": false}, {"data": ["https://demoqa.com/books-0", 53, 0, 0.0, 250.96226415094327, 144, 623, 151.0, 594.2, 613.6999999999999, 623.0, 0.24873520494842263, 0.18485106539623988, 0.12023820942330977], "isController": false}, {"data": ["https://demoqa.com/books-3", 53, 0, 0.0, 942.5471698113206, 706, 1346, 876.0, 1240.0, 1299.1999999999998, 1346.0, 0.24843090105419074, 73.04693359219364, 0.12494327543252758], "isController": false}, {"data": ["https://demoqa.com/books-1", 53, 0, 0.0, 213.13207547169807, 142, 586, 150.0, 446.2, 456.7, 586.0, 0.24895485931701816, 0.44053340340081737, 0.12107374994128424], "isController": false}, {"data": ["https://demoqa.com/books-2", 53, 0, 0.0, 1426.3962264150948, 986, 2001, 1410.0, 1882.6000000000001, 1908.2, 2001.0, 0.24755943761969265, 222.7544171332734, 0.12426323333644729], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 174.56249999999997, 140, 428, 158.0, 251.6000000000002, 428.0, 428.0, 0.08416888486748661, 0.06288007512072974, 0.029919408292739383], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 0, 0.0, 207.97714285714275, 140, 984, 155.0, 304.4, 366.5999999999999, 936.8800000000006, 0.7446586697417523, 1.4919809901939092, 0.3629504586565506], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 6, 0, 0.0, 204.5, 147, 472, 150.5, 472.0, 472.0, 472.0, 0.03289491718704598, 0.02547428645442135, 0.011693115093832751], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/984b96ae-523b-4485-9c78-d6232b618afb", 2, 0, 0.0, 266.5, 219, 314, 266.5, 314.0, 314.0, 314.0, 0.0739781764379508, 0.04547779498797855, 0.04598350517847235], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d1900c60-93d5-4b8f-b7dc-028494c9da88", 3, 0, 0.0, 318.3333333333333, 227, 452, 276.0, 452.0, 452.0, 452.0, 0.03673949250514353, 0.03062820322450279, 0.02356015632654061], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=98b88ceb-dab6-40e6-951c-0be145828887", 1, 0, 0.0, 742.0, 742, 742, 742.0, 742.0, 742.0, 742.0, 1.3477088948787064, 0.24348256401617252, 0.9291821091644205], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 151.75, 140, 163, 152.0, 163.0, 163.0, 163.0, 0.110182972598872, 0.08941606467740491, 0.03916660354100528], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f7cad022-9f30-4016-b0fb-d556e11c0b0c", 1, 0, 0.0, 237.0, 237, 237, 237.0, 237.0, 237.0, 237.0, 4.219409282700422, 1.3474090189873418, 2.517635812236287], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 6, 0, 0.0, 446.1666666666667, 290, 878, 302.5, 878.0, 878.0, 878.0, 0.033085376814870775, 0.05127587207539055, 0.07440978789516348], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 619.125, 294, 2123, 305.5, 1894.8000000000002, 2123.0, 2123.0, 0.0831899173820133, 12.553319943872804, 0.18443545892237861], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d8f66a11-fc63-48b5-a9fa-d7354915bed8", 1, 0, 0.0, 405.0, 405, 405, 405.0, 405.0, 405.0, 405.0, 2.4691358024691357, 0.44608410493827155, 1.7023533950617282], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 172.52941176470588, 149, 460, 153.0, 235.19999999999982, 460.0, 460.0, 0.08891445906012187, 0.07371911693558932, 0.031606311619027695], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3c9731d7-1287-4565-bf7c-d256bf0a23f8", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 0.4221122955607477, 1.6108717873831777], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 170.6875, 142, 445, 152.0, 256.0000000000002, 445.0, 445.0, 0.10756085591551094, 0.08350671919221798, 0.03823452300121678], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9cc60fe5-d123-4e43-bbb8-12a67282e103", 1, 0, 0.0, 419.0, 419, 419, 419.0, 419.0, 419.0, 419.0, 2.3866348448687353, 0.431179146778043, 1.6454728520286397], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/68802915-5433-470f-b7da-455deb85fded", 3, 0, 0.0, 349.6666666666667, 268, 486, 295.0, 486.0, 486.0, 486.0, 0.01934822286572978, 0.022868944409331002, 0.012407551772619685], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/87e23c26-1242-4338-8b61-a7cced0fd31a", 3, 0, 0.0, 942.3333333333334, 257, 2131, 439.0, 2131.0, 2131.0, 2131.0, 0.016766052097712553, 0.023113356326110893, 0.010751667523598218], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3258f9a5-1a07-48cb-ad81-e2f4ff35d169", 1, 0, 0.0, 455.0, 455, 455, 455.0, 455.0, 455.0, 455.0, 2.197802197802198, 0.39706387362637363, 1.5152815934065933], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4248b0b9-2e33-4223-9e7b-b23516dcab24", 2, 0, 0.0, 305.5, 253, 358, 305.5, 358.0, 358.0, 358.0, 0.020105352044714305, 0.028656016903574732, 0.012497125562949858], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 168.0625, 143, 459, 149.0, 246.9000000000002, 459.0, 459.0, 0.07848870007996037, 0.05832998121176742, 0.03939764828232385], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 235.12500000000006, 139, 443, 152.0, 440.9, 443.0, 443.0, 0.07848870007996037, 0.02836975597372591, 0.04435109773805378], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 313.68749999999994, 140, 1645, 150.5, 803.6000000000008, 1645.0, 1645.0, 0.07848985518621718, 4.433915106169793, 0.04572187365095561], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 269.25, 145, 1214, 148.5, 678.5000000000006, 1214.0, 1214.0, 0.0784906252759436, 1.462261569395524, 0.04579897324450811], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 2, 100.0, 0.1594896331738437], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1254, 2, "406/Not Acceptable", 2, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 2, "406/Not Acceptable", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
