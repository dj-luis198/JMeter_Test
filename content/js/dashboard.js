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

    var data = {"OkPercent": 95.33639143730886, "KoPercent": 4.663608562691132};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7703145478374837, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e017ba64-46c0-4f3d-adba-73d01154105d"], "isController": false}, {"data": [0.35964912280701755, 500, 1500, "see books"], "isController": true}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fc7712ea-9e70-4e93-90cf-097dada0561f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a36380dd-233d-4759-aed0-883e816a56cb"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.46875, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.46875, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c348e77c-ad25-498b-8fc2-d001050f9974"], "isController": false}, {"data": [0.125, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5666666666666667, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.29545454545454547, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.625, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fc7712ea-9e70-4e93-90cf-097dada0561f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c348e77c-ad25-498b-8fc2-d001050f9974"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f4088ed8-01e5-4963-b7fa-935bf1c564a3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a36380dd-233d-4759-aed0-883e816a56cb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.20754716981132076, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.8508771929824561, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a054dcb0-daa1-401f-a6f6-597b4aab27df"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8282208588957055, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a054dcb0-daa1-401f-a6f6-597b4aab27df"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6b43024c-fd75-4ec3-beef-e978d76ef73f"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1b9b9858-b1af-4046-97a9-626b22fed9a9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e44445ae-edd4-4097-b89e-96952022b235"], "isController": false}, {"data": [0.6136363636363636, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6b43024c-fd75-4ec3-beef-e978d76ef73f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f4088ed8-01e5-4963-b7fa-935bf1c564a3"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1b9b9858-b1af-4046-97a9-626b22fed9a9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e44445ae-edd4-4097-b89e-96952022b235"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e017ba64-46c0-4f3d-adba-73d01154105d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bb332b3d-6c39-416f-86ce-aa0c0dba45c8"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bb332b3d-6c39-416f-86ce-aa0c0dba45c8"], "isController": false}, {"data": [0.125, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1308, 61, 4.663608562691132, 319.01070336391405, 80, 2729, 96.0, 898.0, 1134.6499999999999, 1590.4600000000005, 5.110912266580182, 741.8827551707448, 3.761404339635359], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e017ba64-46c0-4f3d-adba-73d01154105d", 1, 0, 0.0, 203.0, 203, 203, 203.0, 203.0, 203.0, 203.0, 4.926108374384237, 0.889970751231527, 3.3963208128078817], "isController": false}, {"data": ["see books", 57, 0, 0.0, 1375.2631578947362, 991, 1798, 1353.0, 1665.4, 1703.2999999999997, 1798.0, 0.2621665999751632, 315.4759646121084, 1.2890711239013148], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 278.2, 167, 964, 170.0, 686.2000000000002, 964.0, 964.0, 0.12089559456453407, 9.817084335759304, 0.2698348742484324], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 12, 0, 0.0, 88.16666666666667, 85, 95, 87.5, 93.80000000000001, 95.0, 95.0, 0.06895125146521408, 0.05353148917465352, 0.024510015169275323], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 295.9375, 171, 496, 331.5, 495.3, 496.0, 496.0, 0.08829193729065155, 0.1368352582815078, 0.19857063630895555], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 105.625, 83, 249, 84.0, 249.0, 249.0, 249.0, 0.04373831366931648, 0.03250474287338852, 0.02195458322854362], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fc7712ea-9e70-4e93-90cf-097dada0561f", 3, 0, 0.0, 316.3333333333333, 173, 555, 221.0, 555.0, 555.0, 555.0, 0.02370848052348325, 0.02377793896251689, 0.015203680544030599], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 105.0, 83, 247, 84.0, 247.0, 247.0, 247.0, 0.043740465945313486, 0.011703991864273336, 0.024945734484436596], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 85.0, 83, 87, 85.0, 87.0, 87.0, 87.0, 0.043740226793075924, 0.011789358002821245, 0.02571446926702315], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 125.0, 82, 249, 85.0, 249.0, 249.0, 249.0, 0.04374070510016621, 0.011789486921529176, 0.025757465991601787], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, 100.0, 90.0, 85, 102, 87.0, 102.0, 102.0, 102.0, 0.03208665965038376, 0.009463057826578022, 0.019834819881536053], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a36380dd-233d-4759-aed0-883e816a56cb", 3, 0, 0.0, 315.0, 216, 407, 322.0, 407.0, 407.0, 407.0, 0.08475294516484448, 0.03928652145662062, 0.05435003319490352], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 946.5263157894738, 647, 1418, 908.0, 1234.0, 1337.8999999999996, 1418.0, 0.26394509941932076, 315.7701010689776, 0.5211884677986979], "isController": false}, {"data": ["deleteBook", 16, 6, 37.5, 429.18750000000006, 84, 1459, 468.0, 924.9000000000005, 1459.0, 1459.0, 0.09244013057168443, 0.020661362191986596, 0.06117162449085709], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 6, 37.5, 429.18750000000006, 84, 1459, 468.0, 924.9000000000005, 1459.0, 1459.0, 0.09524036286578252, 0.021287244190337864, 0.06302465906926355], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c348e77c-ad25-498b-8fc2-d001050f9974", 3, 0, 0.0, 438.0, 175, 907, 232.0, 907.0, 907.0, 907.0, 0.06792094002580996, 0.03073245658719917, 0.043556071566030474], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 14, 58.333333333333336, 1148.2916666666667, 336, 2058, 1196.0, 1979.0, 2054.25, 2058.0, 0.09608416973268583, 0.02918181326842314, 0.043350475016114116], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 95.23529411764707, 82, 254, 84.0, 136.3999999999999, 254.0, 254.0, 0.08799946165035226, 0.031321499562590914, 0.049752452984993506], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 10, 0, 0.0, 116.6, 82, 249, 84.0, 248.6, 249.0, 249.0, 0.0494486475794887, 0.013327955792909064, 0.029118686025812194], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 96.11764705882354, 82, 249, 86.0, 132.1999999999999, 249.0, 249.0, 0.08799126298518123, 0.06539194446457317, 0.04416748942810855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 10, 0, 0.0, 116.4, 82, 249, 83.5, 248.9, 249.0, 249.0, 0.0494486475794887, 0.013327955792909064, 0.02907039633091035], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 147.0, 81, 649, 85.0, 327.39999999999975, 649.0, 649.0, 0.08799991717654855, 1.5443763038223024, 0.05137541120549534], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 168.5294117647059, 82, 846, 86.0, 369.1999999999996, 846.0, 846.0, 0.08792481910761481, 4.676122504163499, 0.05124570396747816], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 12, 0, 0.0, 97.91666666666667, 82, 250, 83.0, 203.50000000000017, 250.0, 250.0, 0.06640069499394094, 0.017897062322585644, 0.03903634608042231], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 12, 0, 0.0, 139.08333333333337, 83, 251, 85.0, 249.20000000000002, 251.0, 251.0, 0.06640069499394094, 0.017897062322585644, 0.03910119050912733], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 10, 0, 0.0, 82.89999999999999, 80, 86, 83.0, 85.8, 86.0, 86.0, 0.04944815855057557, 0.01323124554966573, 0.028200902923375133], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 12, 0, 0.0, 98.83333333333333, 84, 247, 85.0, 199.30000000000018, 247.0, 247.0, 0.0664032670407384, 0.04934852169726751, 0.03333132740130815], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 10, 0, 0.0, 121.10000000000001, 84, 285, 85.5, 281.0, 285.0, 285.0, 0.04944815855057557, 0.03674809439158986, 0.02482065770995688], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 12, 0, 0.0, 111.91666666666666, 82, 253, 84.0, 251.8, 253.0, 253.0, 0.06640216471056958, 0.01776776672919537, 0.0378699845614967], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 93.89999999999999, 84, 116, 90.5, 114.80000000000001, 116.0, 116.0, 0.04822693667320946, 0.037959873983014474, 0.017143168895554922], "isController": false}, {"data": ["deleteAccount", 15, 5, 33.333333333333336, 407.53333333333336, 83, 1116, 444.0, 990.6000000000001, 1116.0, 1116.0, 0.09540164090822362, 0.01999956274247917, 0.06490541324810788], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1619.2272727272727, 1159, 2729, 1481.0, 2346.9999999999995, 2688.7999999999993, 2729.0, 0.09718130055084129, 0.050298915324165895, 0.044699602108834224], "isController": false}, {"data": ["goToProfile", 16, 6, 37.5, 183.0625, 82, 470, 193.0, 331.40000000000015, 470.0, 470.0, 0.09264728022327995, 0.1171549286905465, 0.0598610906032496], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 0, 0.0, 239.1, 168, 535, 170.5, 531.0, 535.0, 535.0, 0.04942738375915024, 0.07660279104079241, 0.11116334452863576], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fc7712ea-9e70-4e93-90cf-097dada0561f", 1, 0, 0.0, 424.0, 424, 424, 424.0, 424.0, 424.0, 424.0, 2.3584905660377355, 0.4260944870283019, 1.626068691037736], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c348e77c-ad25-498b-8fc2-d001050f9974", 1, 0, 0.0, 210.0, 210, 210, 210.0, 210.0, 210.0, 210.0, 4.761904761904763, 0.8603050595238095, 3.283110119047619], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f4088ed8-01e5-4963-b7fa-935bf1c564a3", 3, 0, 0.0, 771.0, 466, 1377, 470.0, 1377.0, 1377.0, 1377.0, 0.017435068897580595, 0.024035649993897724, 0.011180691968826097], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a36380dd-233d-4759-aed0-883e816a56cb", 1, 0, 0.0, 180.0, 180, 180, 180.0, 180.0, 180.0, 180.0, 5.555555555555555, 1.0036892361111112, 3.830295138888889], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 94.99999999999999, 81, 249, 84.0, 151.20000000000005, 249.0, 249.0, 0.12097847389687795, 0.08990685413625402, 0.06072552303026881], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 12, 0, 0.0, 607.6666666666666, 407, 736, 654.5, 717.4000000000001, 736.0, 736.0, 0.06421610861084504, 18.881668107069657, 0.03662324944212256], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 105.73333333333332, 82, 251, 83.0, 249.2, 251.0, 251.0, 0.12098042536717558, 0.04448551057772186, 0.06831928448143758], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 12, 0, 0.0, 856.3333333333333, 565, 1138, 884.0, 1094.5000000000002, 1138.0, 1138.0, 0.0641618589829276, 57.732953497356, 0.036529652135787884], "isController": false}, {"data": ["addBook", 53, 25, 47.16981132075472, 835.4528301886791, 428, 2464, 681.0, 1603.6000000000001, 1741.0999999999997, 2464.0, 0.24045223166891996, 55.28657925651489, 0.875064118232177], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-1", 12, 0, 0.0, 133.08333333333334, 81, 343, 85.0, 314.2000000000001, 343.0, 343.0, 0.06432591798445457, 0.11382672205842936, 0.035617964352720445], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 98.52941176470588, 84, 281, 85.0, 147.39999999999986, 281.0, 281.0, 0.08117503247001298, 0.06032636690398426, 0.04074606122029949], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 122.47058823529412, 82, 250, 85.0, 250.0, 250.0, 250.0, 0.08117697057096061, 0.02172118157855782, 0.04629624102875097], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 103.4705882352941, 81, 250, 84.0, 249.2, 250.0, 250.0, 0.08117464486092872, 0.021879103497672196, 0.047721812701444426], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 157.75438596491225, 82, 362, 87.0, 337.2, 342.1, 362.0, 0.264748094510425, 0.19675126945550142, 0.12797881521744178], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 118.0, 82, 335, 84.0, 266.99999999999994, 335.0, 335.0, 0.08117697057096061, 0.021879730349204225, 0.04780245434989184], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 525.1578947368422, 403, 779, 490.0, 671.6000000000001, 743.5999999999999, 779.0, 0.2646300981916943, 77.81003541458715, 0.13309033258664313], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 12, 0, 0.0, 126.00000000000003, 82, 249, 86.0, 249.0, 249.0, 249.0, 0.06432660762913567, 0.047805223052511954, 0.03612089783862598], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a054dcb0-daa1-401f-a6f6-597b4aab27df", 3, 0, 0.0, 344.3333333333333, 195, 444, 394.0, 444.0, 444.0, 444.0, 0.10200612036722204, 0.04615511305678341, 0.0654140810948657], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 561.7333333333332, 81, 1066, 808.0, 1061.2, 1066.0, 1066.0, 0.08145223912205346, 39.09870806567222, 0.04415178013868601], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 131.61403508771926, 82, 371, 87.0, 250.0, 251.89999999999995, 371.0, 0.2651298438524762, 0.469155544004577, 0.12894009984231752], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 147.73333333333335, 82, 882, 83.0, 503.4000000000002, 882.0, 882.0, 0.12097944962415719, 7.287601988196438, 0.07042957282156338], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 387.46666666666664, 82, 746, 494.0, 740.6, 746.0, 746.0, 0.08145312372729493, 12.783537475224675, 0.044231803711547335], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 786.5789473684212, 563, 1078, 805.0, 978.4, 997.0999999999997, 1078.0, 0.2644312177289534, 237.93567453301216, 0.13273207608660356], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 91.25, 84, 110, 88.0, 107.2, 110.0, 110.0, 0.0851263061567601, 0.06359533614250144, 0.030259741641660814], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 144.73333333333332, 83, 478, 84.0, 342.4000000000001, 478.0, 478.0, 0.12098042536717558, 2.401918270665473, 0.07054828580818957], "isController": false}, {"data": ["deleteBooks", 15, 5, 33.333333333333336, 424.9333333333334, 85, 1501, 203.0, 1433.8, 1501.0, 1501.0, 0.09517283386630121, 0.020819057408253388, 0.06335561369029491], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 163, 25, 15.337423312883436, 141.4294478527606, 84, 1126, 90.0, 298.6, 433.7999999999994, 849.5199999999936, 0.6877782231692652, 1.6006114646406042, 0.32346739910124683], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 108.875, 84, 252, 89.5, 252.0, 252.0, 252.0, 0.04680771391125258, 0.03624855188635087, 0.016638679554390565], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a054dcb0-daa1-401f-a6f6-597b4aab27df", 1, 0, 0.0, 190.0, 190, 190, 190.0, 190.0, 190.0, 190.0, 5.263157894736842, 0.9508634868421052, 3.6287006578947367], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6b43024c-fd75-4ec3-beef-e978d76ef73f", 3, 0, 0.0, 444.3333333333333, 272, 614, 447.0, 614.0, 614.0, 614.0, 0.04053670598727148, 0.02606119606929074, 0.025995218357722918], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 237.41176470588235, 169, 616, 173.0, 391.9999999999998, 616.0, 616.0, 0.08114054975108943, 0.12575200435056536, 0.18248699812183491], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1b9b9858-b1af-4046-97a9-626b22fed9a9", 3, 0, 0.0, 365.0, 191, 478, 426.0, 478.0, 478.0, 478.0, 0.03795498538733063, 0.03164150962791463, 0.02433962279070356], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 102.11764705882354, 84, 261, 87.0, 163.39999999999992, 261.0, 261.0, 0.08409929653411957, 0.06824855021470055, 0.02989467181486282], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e44445ae-edd4-4097-b89e-96952022b235", 3, 0, 0.0, 304.6666666666667, 234, 417, 263.0, 417.0, 417.0, 417.0, 0.01839666897647066, 0.021744239926290678, 0.011797343061083073], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 836.0454545454544, 144, 2056, 921.5, 1525.6, 1983.999999999999, 2056.0, 0.09998636549561422, 0.061417406149161476, 0.045208678930145886], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 86.33333333333334, 82, 97, 85.0, 93.4, 97.0, 97.0, 0.08144825863623037, 0.06052941877165166, 0.04088320794826407], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 106.06666666666668, 81, 254, 84.0, 251.0, 254.0, 254.0, 0.08145223912205346, 0.08704147480139228, 0.04280484858028747], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6b43024c-fd75-4ec3-beef-e978d76ef73f", 1, 0, 0.0, 1501.0, 1501, 1501, 1501.0, 1501.0, 1501.0, 1501.0, 0.6662225183211192, 0.1203624666888741, 0.45932919720186544], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f4088ed8-01e5-4963-b7fa-935bf1c564a3", 1, 0, 0.0, 626.0, 626, 626, 626.0, 626.0, 626.0, 626.0, 1.5974440894568689, 0.2886007388178914, 1.1013628194888179], "isController": false}, {"data": ["login", 22, 0, 0.0, 3198.4545454545455, 2133, 4549, 3106.0, 4175.9, 4509.099999999999, 4549.0, 0.09992868725500438, 65.33639913788795, 0.24115425298764062], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 232.625, 168, 497, 170.5, 497.0, 497.0, 497.0, 0.043717997059964694, 0.0677543567716445, 0.09832280002841669], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 93.06666666666665, 85, 103, 92.0, 102.4, 103.0, 103.0, 0.11455803510058196, 0.09274278427576411, 0.04072180153965999], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1b9b9858-b1af-4046-97a9-626b22fed9a9", 1, 0, 0.0, 775.0, 775, 775, 775.0, 775.0, 775.0, 775.0, 1.2903225806451613, 0.2331149193548387, 0.889616935483871], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 12, 0, 0.0, 239.83333333333334, 168, 498, 172.5, 450.3000000000002, 498.0, 498.0, 0.0663680106188817, 0.10285745395719263, 0.14926321138211382], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e44445ae-edd4-4097-b89e-96952022b235", 1, 0, 0.0, 426.0, 426, 426, 426.0, 426.0, 426.0, 426.0, 2.347417840375587, 0.42409404342723006, 1.6184345657276995], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 107.70588235294117, 84, 253, 89.0, 249.0, 253.0, 253.0, 0.08073209765734449, 0.0669351083116069, 0.02869773783913417], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 649.7333333333333, 168, 1152, 894.0, 1150.2, 1152.0, 1152.0, 0.08141068433821254, 52.00313638901552, 0.1719853708392356], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 102.39999999999999, 84, 256, 90.0, 166.00000000000006, 256.0, 256.0, 0.07819953393077776, 0.06071155222164876, 0.02779749057695616], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e017ba64-46c0-4f3d-adba-73d01154105d", 3, 0, 0.0, 494.3333333333333, 173, 1116, 194.0, 1116.0, 1116.0, 1116.0, 0.0735456350665588, 0.034139347527640904, 0.04716305373734402], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bb332b3d-6c39-416f-86ce-aa0c0dba45c8", 1, 0, 0.0, 1389.0, 1389, 1389, 1389.0, 1389.0, 1389.0, 1389.0, 0.7199424046076314, 0.1300677195824334, 0.49636654067674585], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 295.11764705882354, 167, 1096, 194.0, 491.99999999999943, 1096.0, 1096.0, 0.08787755038743661, 6.312422945603797, 0.19631606485621683], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 23, 11, 47.82608695652174, 553.0869565217391, 82, 1232, 647.0, 1121.6000000000001, 1215.5999999999997, 1232.0, 0.11248648939448033, 70.22636797937585, 0.16789869430084756], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 108.25, 83, 249, 85.0, 248.3, 249.0, 249.0, 0.08841244405150024, 0.06570495109686689, 0.04437890258053821], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 134.0, 81, 248, 83.5, 247.3, 248.0, 248.0, 0.08834946631400505, 0.023640384541052134, 0.050386805007206006], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 144.75, 82, 249, 84.5, 248.3, 249.0, 249.0, 0.08843052400612382, 0.02383478967352556, 0.051987476027037634], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bb332b3d-6c39-416f-86ce-aa0c0dba45c8", 3, 0, 0.0, 430.6666666666667, 227, 618, 447.0, 618.0, 618.0, 618.0, 0.025632481480532134, 0.025707576641119625, 0.016437496261929783], "isController": false}, {"data": ["register", 24, 14, 58.333333333333336, 1148.2916666666667, 336, 2058, 1196.0, 1979.0, 2054.25, 2058.0, 0.0999425330435, 0.030353640406766108, 0.045091260025485344], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 155.5, 81, 252, 85.0, 249.9, 252.0, 252.0, 0.08835044202830526, 0.023813205077941654, 0.05202667631158992], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 14, 22.950819672131146, 1.070336391437309], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 6, 9.836065573770492, 0.45871559633027525], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 5, 8.19672131147541, 0.382262996941896], "isController": false}, {"data": ["401/Unauthorized", 36, 59.01639344262295, 2.7522935779816513], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1308, 61, "401/Unauthorized", 36, "406/Not Acceptable", 14, "Test failed: code expected to contain /200/", 6, "Test failed: code expected to contain /204/", 5, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 14, "406/Not Acceptable", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 163, 25, "401/Unauthorized", 25, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 23, 11, "Test failed: code expected to contain /200/", 6, "Test failed: code expected to contain /204/", 5, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
