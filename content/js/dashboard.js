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

    var data = {"OkPercent": 97.22430607651913, "KoPercent": 2.7756939234808704};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7956298200514139, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.24528301886792453, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ba2704bf-fb35-4550-8fad-9e3777854041"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f3a861f0-f58d-42a3-a130-6e7d48b5f561"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3008223e-c378-4fc2-ac71-4a77a78f1120"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7f66f1e1-be5c-42a7-83fd-a7b051c202f2"], "isController": false}, {"data": [0.6875, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/513e4b34-c468-4be7-ae82-aa519f0c2e08"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c9ff3522-fa6c-4d3c-b8dc-8e249509a4b2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/de349900-650f-47c4-bebb-7be175d93efe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/def54b21-2865-4c3f-99fe-4ada568723b9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=def54b21-2865-4c3f-99fe-4ada568723b9"], "isController": false}, {"data": [0.782608695652174, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a7e56c1b-721f-40d8-acdf-bc46099bf59d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/491584dc-974a-4c07-8621-7b1dac88f1a4"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f3eb9300-9844-4886-89fa-a9c339c8ca4a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fa3eb105-4fa9-4ab5-8a48-73d5da1fc85b"], "isController": false}, {"data": [0.65625, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.29411764705882354, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4716981132075472, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7f66f1e1-be5c-42a7-83fd-a7b051c202f2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.43478260869565216, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c9ff3522-fa6c-4d3c-b8dc-8e249509a4b2"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ba2704bf-fb35-4550-8fad-9e3777854041"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c569ce0b-53ae-453f-8cfa-ccc572bf8836"], "isController": false}, {"data": [0.9905660377358491, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.7169811320754716, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4811320754716981, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=513e4b34-c468-4be7-ae82-aa519f0c2e08"], "isController": false}, {"data": [0.9189944134078212, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=de349900-650f-47c4-bebb-7be175d93efe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/fa3eb105-4fa9-4ab5-8a48-73d5da1fc85b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c569ce0b-53ae-453f-8cfa-ccc572bf8836"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=491584dc-974a-4c07-8621-7b1dac88f1a4"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a7e56c1b-721f-40d8-acdf-bc46099bf59d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3008223e-c378-4fc2-ac71-4a77a78f1120"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f3eb9300-9844-4886-89fa-a9c339c8ca4a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1333, 37, 2.7756939234808704, 322.1432858214557, 97, 4005, 111.0, 818.4000000000005, 988.0, 1578.1600000000103, 5.272713608189517, 722.6806320976935, 3.8653620874388377], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 53, 0, 0.0, 1567.358490566038, 1184, 4808, 1527.0, 1782.6000000000001, 2334.2999999999984, 4808.0, 0.2516726735710453, 302.8471157510292, 1.2374725697560673], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ba2704bf-fb35-4550-8fad-9e3777854041", 3, 0, 0.0, 326.6666666666667, 219, 487, 274.0, 487.0, 487.0, 487.0, 0.07017708016561791, 0.0325300007017708, 0.045002880184331795], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f3a861f0-f58d-42a3-a130-6e7d48b5f561", 1, 0, 0.0, 179.0, 179, 179, 179.0, 179.0, 179.0, 179.0, 5.58659217877095, 1.783999650837989, 3.3334060754189947], "isController": false}, {"data": ["deleteBook", 15, 3, 20.0, 469.26666666666665, 102, 1495, 455.0, 1039.0000000000002, 1495.0, 1495.0, 0.07110959410643684, 0.01447191348806781, 0.04765176120687203], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, 20.0, 469.26666666666665, 102, 1495, 455.0, 1039.0000000000002, 1495.0, 1495.0, 0.07223589353392439, 0.01470113301999008, 0.04840651381150284], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3008223e-c378-4fc2-ac71-4a77a78f1120", 1, 0, 0.0, 687.0, 687, 687, 687.0, 687.0, 687.0, 687.0, 1.455604075691412, 0.262975345705968, 1.0035707787481805], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 143.88888888888889, 98, 296, 101.0, 295.1, 296.0, 296.0, 0.08381136854652463, 0.03641283850480519, 0.04701657719027043], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 104.83333333333334, 100, 145, 102.0, 115.30000000000004, 145.0, 145.0, 0.08381214903662591, 0.06228617716491437, 0.042069770121900114], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 177.22222222222223, 99, 491, 100.5, 491.0, 491.0, 491.0, 0.08381331979903428, 2.7582912617629667, 0.04855461310840321], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 221.2222222222222, 99, 880, 103.5, 706.3000000000003, 880.0, 880.0, 0.08381253928712779, 8.399487885013853, 0.04847231276045911], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7f66f1e1-be5c-42a7-83fd-a7b051c202f2", 1, 0, 0.0, 464.0, 464, 464, 464.0, 464.0, 464.0, 464.0, 2.155172413793103, 0.3893622036637931, 1.4858903556034482], "isController": false}, {"data": ["goToProfile", 16, 4, 25.0, 306.375, 100, 1627, 212.5, 784.9000000000008, 1627.0, 1627.0, 0.07297672042618404, 0.1356064607772933, 0.04716049291213603], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/513e4b34-c468-4be7-ae82-aa519f0c2e08", 3, 0, 0.0, 388.0, 206, 743, 215.0, 743.0, 743.0, 743.0, 0.03444712366517396, 0.03477230810081525, 0.022090115110804914], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 113.00000000000001, 99, 292, 101.0, 161.10000000000014, 292.0, 292.0, 0.082423243354626, 0.06125399237584999, 0.041372604574490005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 156.1875, 98, 398, 100.0, 328.70000000000005, 398.0, 398.0, 0.0823392583291306, 0.029761541004950647, 0.04652690756903632], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 10, 0, 0.0, 601.4, 487, 848, 494.0, 842.1, 848.0, 848.0, 0.06311896030448585, 18.559070076247703, 0.035997532048652095], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 10, 0, 0.0, 860.7, 695, 1017, 886.0, 1004.4000000000001, 1017.0, 1017.0, 0.06305170239596469, 56.73403264895965, 0.035897600094577556], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 10, 0, 0.0, 202.7, 98, 332, 198.5, 328.90000000000003, 332.0, 332.0, 0.0634179751908881, 0.11222008891200122, 0.035115226497298396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 102.66666666666667, 99, 107, 103.0, 106.4, 107.0, 107.0, 0.08434832484226863, 0.06268464375485003, 0.04233890524309187], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c9ff3522-fa6c-4d3c-b8dc-8e249509a4b2", 3, 0, 0.0, 293.0, 189, 492, 198.0, 492.0, 492.0, 492.0, 0.03050578593073153, 0.025431418544467267, 0.019562629649590206], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 141.53333333333333, 98, 310, 101.0, 304.6, 310.0, 310.0, 0.08434832484226863, 0.02256976660818516, 0.04810490401160633], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 167.73333333333335, 99, 307, 102.0, 304.6, 307.0, 307.0, 0.08425404278981986, 0.022709097470693638, 0.04953216187448395], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 153.6, 97, 304, 101.0, 301.6, 304.0, 304.0, 0.08425404278981986, 0.022709097470693638, 0.04961444121314588], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/de349900-650f-47c4-bebb-7be175d93efe", 3, 0, 0.0, 848.6666666666666, 285, 1621, 640.0, 1621.0, 1621.0, 1621.0, 0.0196174595389897, 0.027044251675658, 0.012580206800719305], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 10, 0, 0.0, 101.0, 100, 104, 100.5, 103.8, 104.0, 104.0, 0.06341717083317479, 0.047129362308638685, 0.035610227762769044], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 584.2499999999999, 99, 910, 740.0, 908.6, 910.0, 910.0, 0.11507314336675249, 64.72601635207347, 0.06146973576329454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 187.125, 99, 686, 102.5, 414.40000000000026, 686.0, 686.0, 0.08233968206590261, 4.651392963881183, 0.047964473000303626], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 443.12499999999994, 98, 703, 566.5, 698.1, 703.0, 703.0, 0.11507314336675249, 21.158709014182765, 0.061582111879863635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 169.6875, 97, 796, 101.0, 452.30000000000035, 796.0, 796.0, 0.08242494178738487, 1.5355569446877124, 0.048094631560510206], "isController": false}, {"data": ["deleteBooks", 15, 3, 20.0, 394.8666666666667, 103, 1102, 377.0, 853.0000000000001, 1102.0, 1102.0, 0.07226651892178354, 0.014707365764941104, 0.0487940148266808], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/def54b21-2865-4c3f-99fe-4ada568723b9", 3, 0, 0.0, 285.6666666666667, 185, 432, 240.0, 432.0, 432.0, 432.0, 0.04242201419723409, 0.02727326759099522, 0.02720422134392941], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 312.4, 202, 416, 398.0, 412.4, 416.0, 416.0, 0.08420579897268925, 0.1305025419625565, 0.18938081546299157], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=def54b21-2865-4c3f-99fe-4ada568723b9", 1, 0, 0.0, 377.0, 377, 377, 377.0, 377.0, 377.0, 377.0, 2.6525198938992043, 0.4792150198938992, 1.8287881299734747], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 511.9999999999999, 193, 1148, 415.0, 961.2000000000002, 1121.5999999999997, 1148.0, 0.09665896196679975, 0.059373522536247114, 0.043704198623660435], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a7e56c1b-721f-40d8-acdf-bc46099bf59d", 3, 0, 0.0, 546.3333333333334, 270, 902, 467.0, 902.0, 902.0, 902.0, 0.0779808167190871, 0.03528428881495153, 0.05000722947155], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 102.12499999999999, 100, 105, 102.0, 105.0, 105.0, 105.0, 0.11507231575843443, 0.0855176096603209, 0.05776090849593291], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 182.56250000000003, 99, 401, 103.5, 341.50000000000006, 401.0, 401.0, 0.11507231575843443, 0.13881159964902942, 0.05958700725674791], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/491584dc-974a-4c07-8621-7b1dac88f1a4", 3, 0, 0.0, 293.3333333333333, 190, 444, 246.0, 444.0, 444.0, 444.0, 0.02356545304583481, 0.02785356771140175, 0.015111960449314637], "isController": false}, {"data": ["login", 23, 0, 0.0, 2452.1304347826085, 1527, 3736, 2383.0, 3484.6000000000004, 3706.5999999999995, 3736.0, 0.09581217481139581, 49.962550587786865, 0.2136369038816428], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f3eb9300-9844-4886-89fa-a9c339c8ca4a", 1, 0, 0.0, 396.0, 396, 396, 396.0, 396.0, 396.0, 396.0, 2.5252525252525255, 0.456222380050505, 1.7410432449494948], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 105.0, 102, 115, 104.0, 111.5, 115.0, 115.0, 0.08062078000604656, 0.06526819006348886, 0.028658167892774363], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fa3eb105-4fa9-4ab5-8a48-73d5da1fc85b", 1, 0, 0.0, 368.0, 368, 368, 368.0, 368.0, 368.0, 368.0, 2.717391304347826, 0.49093495244565216, 1.8735139266304348], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 687.6874999999999, 201, 1016, 844.5, 1012.5, 1016.0, 1016.0, 0.11498878859311218, 86.04593364158713, 0.2402243808572414], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 359.7222222222222, 200, 985, 303.0, 808.6000000000003, 985.0, 985.0, 0.08377119294832713, 11.250900249451997, 0.18602186020914874], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 17, 7, 41.1764705882353, 609.5882352941176, 100, 1118, 830.0, 1017.9999999999999, 1118.0, 1118.0, 0.106551006593627, 74.99529677197458, 0.17029308969714443], "isController": false}, {"data": ["register", 24, 10, 41.666666666666664, 768.0, 155, 1984, 808.5, 1531.5, 1928.25, 1984.0, 0.09543009149360022, 0.02954232324557741, 0.04305537331058916], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 333.06249999999994, 201, 897, 206.5, 683.5000000000002, 897.0, 897.0, 0.08229606007612386, 6.27299005535696, 0.18376975426910813], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 137.375, 100, 479, 106.0, 306.1000000000002, 479.0, 479.0, 0.08818244948799066, 0.06846196029585211, 0.03134610509143418], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 339.3125, 199, 597, 396.0, 467.5000000000001, 597.0, 597.0, 0.1149029070435482, 0.17807706394346778, 0.25841933097782377], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 141.0, 100, 300, 102.0, 299.5, 300.0, 300.0, 0.04396667326166766, 0.03267445151575106, 0.022069209039548024], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 178.3, 98, 298, 100.5, 297.9, 298.0, 298.0, 0.04392920369532462, 0.011754493957538031, 0.02505337398248982], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 179.1, 99, 298, 101.5, 297.9, 298.0, 298.0, 0.043929396673666084, 0.011840345197199061, 0.025825680466354476], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 141.10000000000002, 99, 309, 101.0, 307.5, 309.0, 309.0, 0.04396667326166766, 0.01185039240255886, 0.025890531227329684], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 106.0, 103, 110, 105.0, 110.0, 110.0, 110.0, 0.035790553679865424, 0.010555417198554061, 0.022124434061869938], "isController": false}, {"data": ["https://demoqa.com/books", 53, 0, 0.0, 1051.1132075471698, 780, 4005, 881.0, 1297.6, 1913.4999999999982, 4005.0, 0.2455044885631966, 293.70871949143515, 0.4847754647214682], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 10, 41.666666666666664, 768.0, 155, 1984, 808.5, 1531.5, 1928.25, 1984.0, 0.09512711360555542, 0.029448530286094794, 0.04291867820875645], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 100.0, 99, 102, 99.0, 102.0, 102.0, 102.0, 0.044692515493405374, 0.012046029566581917, 0.026317955900901795], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7f66f1e1-be5c-42a7-83fd-a7b051c202f2", 3, 0, 0.0, 372.3333333333333, 209, 559, 349.0, 559.0, 559.0, 559.0, 0.01827630112033726, 0.025195356524944108, 0.011720154038757943], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 145.33333333333334, 99, 301, 103.0, 301.0, 301.0, 301.0, 0.04469229355884734, 0.012045969748283071, 0.026274180392994232], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 113.0625, 98, 297, 101.0, 163.30000000000013, 297.0, 297.0, 0.08703172850452293, 0.023457770573484697, 0.0511651372653543], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 126.06249999999999, 98, 308, 100.0, 303.8, 308.0, 308.0, 0.08693526039827217, 0.023431769404221797, 0.05119332228531066], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 122.0, 99, 297, 100.0, 297.0, 297.0, 297.0, 0.04469184969634371, 0.01195856134452947, 0.025488320529946023], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 114.62499999999999, 99, 297, 101.0, 172.40000000000012, 297.0, 297.0, 0.0870298349152819, 0.06467744567434523, 0.043684897603959855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 102.0, 100, 110, 101.0, 110.0, 110.0, 110.0, 0.04469162776839805, 0.033213211652100505, 0.02243310221968418], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 125.0625, 98, 298, 100.0, 295.9, 298.0, 298.0, 0.08693856703506884, 0.02326285875743053, 0.0495821515121877], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 106.55555555555556, 101, 123, 104.0, 123.0, 123.0, 123.0, 0.04540753260513106, 0.03574069460911682, 0.016140958855730178], "isController": false}, {"data": ["deleteAccount", 14, 3, 21.428571428571427, 416.14285714285717, 100, 743, 446.0, 691.5, 743.0, 743.0, 0.07154282093342941, 0.014257661788979338, 0.048681655845815], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1211.4347826086955, 820, 2292, 1092.0, 1820.8000000000002, 2211.999999999999, 2292.0, 0.09815511068055632, 0.050802938145209815, 0.04514751672904495], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 248.33333333333334, 201, 402, 205.0, 402.0, 402.0, 402.0, 0.04466922439336712, 0.0692285733518297, 0.10046213259562936], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c9ff3522-fa6c-4d3c-b8dc-8e249509a4b2", 1, 0, 0.0, 417.0, 417, 417, 417.0, 417.0, 417.0, 417.0, 2.398081534772182, 0.43324715227817745, 1.6533648081534773], "isController": false}, {"data": ["addBook", 63, 14, 22.22222222222222, 902.5396825396824, 515, 2087, 811.0, 1435.4, 1558.6, 2087.0, 0.29292788394476216, 73.47825253841772, 1.0679480808573953], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ba2704bf-fb35-4550-8fad-9e3777854041", 1, 0, 0.0, 267.0, 267, 267, 267.0, 267.0, 267.0, 267.0, 3.745318352059925, 0.6766444288389513, 2.5822214419475653], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c569ce0b-53ae-453f-8cfa-ccc572bf8836", 3, 0, 0.0, 976.3333333333333, 379, 2126, 424.0, 2126.0, 2126.0, 2126.0, 0.0972226723271867, 0.04399072738762679, 0.06234657047023366], "isController": false}, {"data": ["https://demoqa.com/books-0", 53, 0, 0.0, 179.18867924528308, 98, 692, 103.0, 403.6, 408.3, 692.0, 0.2465104813465984, 0.18319773076636853, 0.11916278151031856], "isController": false}, {"data": ["https://demoqa.com/books-3", 53, 0, 0.0, 575.5283018867924, 486, 805, 503.0, 787.0, 799.1, 805.0, 0.24676298182800152, 72.55650995956346, 0.12410442933732499], "isController": false}, {"data": ["https://demoqa.com/books-1", 53, 0, 0.0, 150.49056603773587, 98, 306, 103.0, 297.6, 305.3, 306.0, 0.24722570774189634, 0.4374736156526526, 0.12023281489791444], "isController": false}, {"data": ["https://demoqa.com/books-2", 53, 0, 0.0, 866.377358490566, 680, 3905, 703.0, 913.2, 1376.3999999999965, 3905.0, 0.24633060355645617, 221.64871008311334, 0.1236464162382993], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 118.375, 101, 307, 104.0, 176.10000000000014, 307.0, 307.0, 0.1120715016180323, 0.08372529173612765, 0.03983791659078492], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=513e4b34-c468-4be7-ae82-aa519f0c2e08", 1, 0, 0.0, 1102.0, 1102, 1102, 1102.0, 1102.0, 1102.0, 1102.0, 0.9074410163339383, 0.16394198049001812, 0.6256380444646098], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 14, 7.82122905027933, 155.14525139664812, 100, 893, 107.0, 287.0, 314.0, 544.999999999995, 0.7412775649653173, 1.5307897750802362, 0.3596022815508852], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 107.0, 102, 127, 104.0, 125.80000000000001, 127.0, 127.0, 0.04450853673734622, 0.03446803675069879, 0.015821393918353542], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=de349900-650f-47c4-bebb-7be175d93efe", 1, 0, 0.0, 580.0, 580, 580, 580.0, 580.0, 580.0, 580.0, 1.7241379310344827, 0.31148976293103453, 1.1887122844827587], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 104.16666666666664, 101, 108, 103.5, 108.0, 108.0, 108.0, 0.08084982145664428, 0.06561152502975723, 0.028739584970916523], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fa3eb105-4fa9-4ab5-8a48-73d5da1fc85b", 2, 0, 0.0, 920.5, 214, 1627, 920.5, 1627.0, 1627.0, 1627.0, 0.012163230554035152, 0.02405326354679803, 0.007560445554339232], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c569ce0b-53ae-453f-8cfa-ccc572bf8836", 1, 0, 0.0, 213.0, 213, 213, 213.0, 213.0, 213.0, 213.0, 4.694835680751174, 0.8481880868544601, 3.236869131455399], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 361.6, 201, 604, 398.5, 603.4, 604.0, 604.0, 0.04390933600302096, 0.0680508947624944, 0.09875312579585672], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=491584dc-974a-4c07-8621-7b1dac88f1a4", 1, 0, 0.0, 516.0, 516, 516, 516.0, 516.0, 516.0, 516.0, 1.937984496124031, 0.35012415213178294, 1.3361494670542635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 254.68749999999997, 200, 605, 205.5, 462.20000000000016, 605.0, 605.0, 0.08688710649644034, 0.13465804493149494, 0.19541113892705286], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a7e56c1b-721f-40d8-acdf-bc46099bf59d", 1, 0, 0.0, 218.0, 218, 218, 218.0, 218.0, 218.0, 218.0, 4.587155963302752, 0.8287342316513762, 3.162629013761468], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3008223e-c378-4fc2-ac71-4a77a78f1120", 3, 0, 0.0, 347.0, 262, 448, 331.0, 448.0, 448.0, 448.0, 0.019761804384485666, 0.02724324269801328, 0.012672771691873946], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 133.93333333333337, 101, 307, 107.0, 303.4, 307.0, 307.0, 0.08762603544765221, 0.07265088290532884, 0.031148317288032624], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 119.81250000000001, 102, 298, 108.0, 176.20000000000013, 298.0, 298.0, 0.10945559523320883, 0.08497773262734475, 0.0389080436180547], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f3eb9300-9844-4886-89fa-a9c339c8ca4a", 3, 0, 0.0, 357.6666666666667, 282, 429, 362.0, 429.0, 429.0, 429.0, 0.020613598103548975, 0.020673989504242967, 0.013219006596351394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 113.3125, 98, 298, 101.0, 162.20000000000013, 298.0, 298.0, 0.1149854830827608, 0.08545307873630954, 0.05771732256302642], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 175.0625, 99, 306, 102.0, 304.6, 306.0, 306.0, 0.11498796219770743, 0.03076826332243343, 0.06557907219088001], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 199.125, 98, 310, 198.0, 301.6, 310.0, 310.0, 0.11498713581418078, 0.03099262644991592, 0.06759985914075864], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 137.06249999999997, 98, 298, 101.0, 297.3, 298.0, 298.0, 0.11498713581418078, 0.03099262644991592, 0.06771215126557717], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 10, 27.027027027027028, 0.7501875468867217], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 10.81081081081081, 0.30007501875468867], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 8.108108108108109, 0.2250562640660165], "isController": false}, {"data": ["401/Unauthorized", 20, 54.054054054054056, 1.5003750937734435], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1333, 37, "401/Unauthorized", 20, "406/Not Acceptable", 10, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 17, 7, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 10, "406/Not Acceptable", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 14, "401/Unauthorized", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
