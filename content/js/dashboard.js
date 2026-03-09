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

    var data = {"OkPercent": 97.32078204199856, "KoPercent": 2.6792179580014484};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8023617153511498, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3135593220338983, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fb0fa9f3-e5fb-4a14-ab8b-15b320370dc4"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/897b140a-db1e-48d7-b4b0-a17c261583b3"], "isController": false}, {"data": [0.65625, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.65625, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8125, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5776407b-554d-4e76-9aef-7925c6b130a4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=55eab7fc-bfbd-4a0d-b62f-20e5dadeb962"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=35156394-78b9-4d1b-9aee-70454e5dcc6f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7894736842105263, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/22c8b350-1a1b-45ab-a4b2-7455cdcbde41"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/eadcf48d-b549-4b66-a3ad-01f0de0b6f55"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d4c0f36c-50d6-44e8-9064-928bac685278"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.020833333333333332, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5776407b-554d-4e76-9aef-7925c6b130a4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c4d5eed7-6a1f-487a-b10c-c01ae4d77f69"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e53252ad-9c47-4b86-8059-a3ebc965b8c7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=897b140a-db1e-48d7-b4b0-a17c261583b3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a7212321-7b71-4a97-a07f-1a23326b76f9"], "isController": false}, {"data": [0.7105263157894737, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7e6ad7f8-5c5e-49e1-9bfb-40a0cae3feb6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e970f1cf-1073-47ac-bbfa-5269188c4c5f"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2c304b79-983a-4af8-b892-f2e4d6f87714"], "isController": false}, {"data": [0.34615384615384615, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "register"], "isController": true}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fb0fa9f3-e5fb-4a14-ab8b-15b320370dc4"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/55eab7fc-bfbd-4a0d-b62f-20e5dadeb962"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.4791666666666667, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/35156394-78b9-4d1b-9aee-70454e5dcc6f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2d3747df-c8c2-48ed-919a-37814e828c42"], "isController": false}, {"data": [0.2833333333333333, 500, 1500, "addBook"], "isController": true}, {"data": [0.9915254237288136, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.788135593220339, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eadcf48d-b549-4b66-a3ad-01f0de0b6f55"], "isController": false}, {"data": [0.8910614525139665, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=22c8b350-1a1b-45ab-a4b2-7455cdcbde41"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7e6ad7f8-5c5e-49e1-9bfb-40a0cae3feb6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2c304b79-983a-4af8-b892-f2e4d6f87714"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c4d5eed7-6a1f-487a-b10c-c01ae4d77f69"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2d3747df-c8c2-48ed-919a-37814e828c42"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d4c0f36c-50d6-44e8-9064-928bac685278"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a7212321-7b71-4a97-a07f-1a23326b76f9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1381, 37, 2.6792179580014484, 315.5684286748738, 98, 1592, 110.0, 809.8, 994.5999999999995, 1295.9000000000003, 5.35111613975674, 772.9612045593466, 3.9183285172642273], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 59, 0, 0.0, 1455.7796610169491, 1197, 1896, 1416.0, 1717.0, 1829.0, 1896.0, 0.2652412571536466, 319.1744158651361, 1.3041891892271589], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/fb0fa9f3-e5fb-4a14-ab8b-15b320370dc4", 3, 0, 0.0, 292.0, 186, 374, 316.0, 374.0, 374.0, 374.0, 0.0930376802605055, 0.04209712746162196, 0.05966283532330594], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/897b140a-db1e-48d7-b4b0-a17c261583b3", 3, 0, 0.0, 375.33333333333337, 183, 689, 254.0, 689.0, 689.0, 689.0, 0.05364998748166959, 0.03449177255087807, 0.034404451607711294], "isController": false}, {"data": ["deleteBook", 16, 3, 18.75, 448.9375, 101, 948, 415.0, 794.7000000000002, 948.0, 948.0, 0.08622222701234594, 0.017424425881218102, 0.05783056961905942], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, 18.75, 448.9375, 101, 948, 415.0, 794.7000000000002, 948.0, 948.0, 0.08601919303244536, 0.017383395271632483, 0.05769439161581678], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 127.73333333333333, 99, 304, 101.0, 299.2, 304.0, 304.0, 0.10628799795927045, 0.049725621961934724, 0.05942716969233167], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 115.6, 100, 298, 103.0, 182.80000000000007, 298.0, 298.0, 0.10628573857959739, 0.07898774126862658, 0.05335045862296198], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 218.6, 99, 687, 103.0, 570.6, 687.0, 687.0, 0.10628649169548211, 4.1917288737883345, 0.06137076138328327], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 232.6, 99, 892, 103.0, 890.2, 892.0, 892.0, 0.10628799795927045, 12.776578531773024, 0.06126783424032425], "isController": false}, {"data": ["goToProfile", 16, 3, 18.75, 196.6875, 99, 320, 202.0, 280.80000000000007, 320.0, 320.0, 0.08600301010535369, 0.13307265070683724, 0.05558385461459901], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5776407b-554d-4e76-9aef-7925c6b130a4", 1, 0, 0.0, 365.0, 365, 365, 365.0, 365.0, 365.0, 365.0, 2.73972602739726, 0.4949700342465754, 1.8889126712328768], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=55eab7fc-bfbd-4a0d-b62f-20e5dadeb962", 1, 0, 0.0, 291.0, 291, 291, 291.0, 291.0, 291.0, 291.0, 3.4364261168384878, 0.6208387027491409, 2.3692547250859106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 134.33333333333334, 100, 387, 102.0, 333.0, 387.0, 387.0, 0.1008566087973858, 0.07495300712383847, 0.05062528996275029], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 153.73333333333332, 99, 304, 102.0, 302.2, 304.0, 304.0, 0.10085796508969636, 0.04718524330303112, 0.056391159126973456], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 9, 0, 0.0, 584.4444444444445, 493, 729, 494.0, 729.0, 729.0, 729.0, 0.07745466750432456, 22.774243983278396, 0.044173365061060094], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 9, 0, 0.0, 885.6666666666666, 685, 1028, 895.0, 1028.0, 1028.0, 1028.0, 0.07710034181151536, 69.37502308994613, 0.04389599538682955], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 9, 0, 0.0, 206.66666666666666, 98, 425, 102.0, 425.0, 425.0, 425.0, 0.07750068889501241, 0.13713989089625242, 0.042912979104953154], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 113.8125, 99, 299, 101.0, 163.90000000000015, 299.0, 299.0, 0.07627510523580926, 0.05668491707465903, 0.03828652743281832], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 149.3125, 98, 299, 100.5, 296.9, 299.0, 299.0, 0.07627546885577262, 0.020409646939923535, 0.04350085333180782], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 137.8125, 98, 300, 101.5, 296.5, 300.0, 300.0, 0.07627619610610019, 0.020558818481722314, 0.044842060601437805], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=35156394-78b9-4d1b-9aee-70454e5dcc6f", 1, 0, 0.0, 630.0, 630, 630, 630.0, 630.0, 630.0, 630.0, 1.5873015873015872, 0.2867683531746032, 1.0943700396825398], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 124.74999999999999, 98, 297, 100.0, 296.3, 297.0, 297.0, 0.07627546885577262, 0.020558622465032466, 0.04491612082034267], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 9, 0, 0.0, 145.77777777777774, 99, 307, 102.0, 307.0, 307.0, 307.0, 0.07771618050878193, 0.057755872428889694, 0.04363945682866173], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 531.1052631578948, 99, 1013, 680.0, 1006.0, 1013.0, 1013.0, 0.09372024998643523, 44.395989559440835, 0.050858264769571504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 193.0666666666667, 98, 688, 102.0, 686.2, 688.0, 688.0, 0.1008566087973858, 12.123686657847317, 0.05813700613880559], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 405.157894736842, 99, 807, 490.0, 790.0, 807.0, 807.0, 0.09372071227741331, 14.515650434074878, 0.05095003976964436], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 195.06666666666666, 99, 707, 102.0, 584.0000000000001, 707.0, 707.0, 0.10085796508969636, 3.977638528415051, 0.05823628205602324], "isController": false}, {"data": ["deleteBooks", 15, 2, 13.333333333333334, 396.2666666666667, 106, 711, 392.0, 700.8, 711.0, 711.0, 0.08102239458986463, 0.01587216050266294, 0.05509100840472307], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/22c8b350-1a1b-45ab-a4b2-7455cdcbde41", 3, 0, 0.0, 367.0, 189, 693, 219.0, 693.0, 693.0, 693.0, 0.023968361762473536, 0.02403858157232453, 0.015370336156273718], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eadcf48d-b549-4b66-a3ad-01f0de0b6f55", 3, 0, 0.0, 332.0, 264, 455, 277.0, 455.0, 455.0, 455.0, 0.030814425259611537, 0.02568871845373214, 0.019760552656717032], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 277.375, 201, 600, 206.5, 459.3000000000001, 600.0, 600.0, 0.07623839746888521, 0.11815462576476643, 0.1714619427449635], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d4c0f36c-50d6-44e8-9064-928bac685278", 3, 0, 0.0, 386.0, 215, 724, 219.0, 724.0, 724.0, 724.0, 0.04007587699377488, 0.025764927429266074, 0.025699699764888187], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 559.6666666666666, 158, 1085, 567.0, 921.0, 1047.25, 1085.0, 0.10587565786281161, 0.06503494999580908, 0.04787151327195486], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 112.1578947368421, 99, 297, 102.0, 105.0, 297.0, 297.0, 0.09371840086812835, 0.06964814752016178, 0.04704224418575973], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 153.4736842105263, 98, 307, 101.0, 305.0, 307.0, 307.0, 0.0937225614869331, 0.09916594627724121, 0.04930839532176435], "isController": false}, {"data": ["login", 24, 0, 0.0, 2310.666666666667, 1193, 3249, 2386.5, 3142.5, 3233.25, 3249.0, 0.10463124027256439, 47.0800603714082, 0.2229289145162767], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/5776407b-554d-4e76-9aef-7925c6b130a4", 3, 0, 0.0, 280.0, 187, 451, 202.0, 451.0, 451.0, 451.0, 0.030370520348248633, 0.03045949648208139, 0.019475887072281838], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c4d5eed7-6a1f-487a-b10c-c01ae4d77f69", 1, 0, 0.0, 694.0, 694, 694, 694.0, 694.0, 694.0, 694.0, 1.440922190201729, 0.2603228566282421, 0.9934483069164266], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 106.2, 103, 120, 105.0, 114.60000000000001, 120.0, 120.0, 0.09849240951830646, 0.07973653075261333, 0.0350109736959605], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e53252ad-9c47-4b86-8059-a3ebc965b8c7", 1, 0, 0.0, 394.0, 394, 394, 394.0, 394.0, 394.0, 394.0, 2.5380710659898473, 0.8104973032994923, 1.5144154505076142], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=897b140a-db1e-48d7-b4b0-a17c261583b3", 1, 0, 0.0, 443.0, 443, 443, 443.0, 443.0, 443.0, 443.0, 2.257336343115124, 0.40781955417607224, 1.5563275959367946], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a7212321-7b71-4a97-a07f-1a23326b76f9", 3, 0, 0.0, 324.6666666666667, 251, 405, 318.0, 405.0, 405.0, 405.0, 0.022438966012446146, 0.022504705170685736, 0.014389571303554333], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 650.3157894736844, 202, 1119, 808.0, 1108.0, 1119.0, 1119.0, 0.09367127299259996, 59.04950676990638, 0.19805484976853335], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7e6ad7f8-5c5e-49e1-9bfb-40a0cae3feb6", 3, 0, 0.0, 569.0, 202, 1010, 495.0, 1010.0, 1010.0, 1010.0, 0.02835217177635807, 0.028435234779609117, 0.01818156848939629], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e970f1cf-1073-47ac-bbfa-5269188c4c5f", 1, 0, 0.0, 248.0, 248, 248, 248.0, 248.0, 248.0, 248.0, 4.032258064516129, 1.2876449092741935, 2.4059664818548385], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 388.80000000000007, 202, 998, 209.0, 993.8, 998.0, 998.0, 0.1062082247649258, 17.08424984024513, 0.2352415374171576], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2c304b79-983a-4af8-b892-f2e4d6f87714", 3, 0, 0.0, 306.0, 199, 399, 320.0, 399.0, 399.0, 399.0, 0.05871875672819087, 0.03721530577792566, 0.03765493188624219], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 4, 30.76923076923077, 748.6923076923078, 99, 1210, 988.0, 1209.2, 1210.0, 1210.0, 0.10877113716040396, 90.09763647640085, 0.19168951906423354], "isController": false}, {"data": ["register", 24, 9, 37.5, 910.4166666666667, 299, 1519, 983.5, 1266.0, 1487.25, 1519.0, 0.1076431092712113, 0.03348079131140703, 0.04856554344072229], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 369.1333333333334, 203, 1004, 207.0, 875.6000000000001, 1004.0, 1004.0, 0.10078680902243514, 16.21218158717387, 0.22323359568699647], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 117.99999999999999, 101, 304, 105.0, 171.00000000000014, 304.0, 304.0, 0.09354974507694466, 0.0726289524767295, 0.03325401094532017], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fb0fa9f3-e5fb-4a14-ab8b-15b320370dc4", 1, 0, 0.0, 177.0, 177, 177, 177.0, 177.0, 177.0, 177.0, 5.649717514124294, 1.020700918079096, 3.895215395480226], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 289.89473684210526, 202, 606, 214.0, 408.0, 606.0, 606.0, 0.09203152321858456, 0.14263088608192742, 0.20698105270742212], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 103.36363636363637, 100, 117, 102.0, 114.80000000000001, 117.0, 117.0, 0.05611872681913955, 0.04170542100523945, 0.028168970297888403], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 105.45454545454544, 99, 158, 100.0, 147.20000000000005, 158.0, 158.0, 0.05611929942707297, 0.01501629691700976, 0.032005537954502554], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 141.0909090909091, 98, 312, 100.0, 309.6, 312.0, 312.0, 0.05611929942707297, 0.015125904923703262, 0.03299201001474407], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 124.36363636363636, 99, 299, 100.0, 272.2000000000001, 299.0, 299.0, 0.05611929942707297, 0.015125904923703262, 0.03304681401809082], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 110.0, 106, 114, 110.0, 114.0, 114.0, 114.0, 0.037025380898606, 0.010919594757206065, 0.02288775987189218], "isController": false}, {"data": ["https://demoqa.com/books", 59, 0, 0.0, 953.6101694915254, 779, 1468, 809.0, 1300.0, 1400.0, 1468.0, 0.2709628826776644, 324.16580962216756, 0.5350458484123413], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 9, 37.5, 910.4166666666667, 299, 1519, 983.5, 1266.0, 1487.25, 1519.0, 0.1051018173855923, 0.03269036019268667, 0.047418984015765275], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 102.75, 99, 111, 101.0, 111.0, 111.0, 111.0, 0.037972820953402604, 0.010234861897596795, 0.02236094827627126], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 126.87500000000001, 101, 297, 101.0, 297.0, 297.0, 297.0, 0.03793716656787196, 0.01022525192649674, 0.022302904564315353], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/55eab7fc-bfbd-4a0d-b62f-20e5dadeb962", 3, 0, 0.0, 726.3333333333334, 203, 1592, 384.0, 1592.0, 1592.0, 1592.0, 0.09806485355648535, 0.04437179246208159, 0.06288664111532427], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 199.5625, 98, 882, 102.0, 476.7000000000004, 882.0, 882.0, 0.09593246354566386, 5.419253205118597, 0.055882533696277825], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 163.875, 99, 694, 101.5, 419.60000000000025, 694.0, 694.0, 0.09593016284145142, 1.7871559816953257, 0.055974875290788303], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 127.125, 100, 296, 102.5, 296.0, 296.0, 296.0, 0.037937346472300994, 0.010151204036533665, 0.02163614290998416], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 104.1875, 98, 134, 102.0, 118.60000000000002, 134.0, 134.0, 0.09604475685669521, 0.07137701168744635, 0.048209965844083345], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 102.5, 100, 110, 102.0, 110.0, 110.0, 110.0, 0.037971739532852676, 0.028219232211426647, 0.019060033320201442], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 126.3125, 98, 301, 101.5, 298.2, 301.0, 301.0, 0.09604763962925611, 0.03471643810329923, 0.05427301316452961], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 107.25, 101, 127, 105.0, 127.0, 127.0, 127.0, 0.03847911305644405, 0.030287270628412015, 0.013678122219282846], "isController": false}, {"data": ["deleteAccount", 14, 1, 7.142857142857143, 481.85714285714283, 101, 724, 446.5, 710.5, 724.0, 724.0, 0.0994395868995447, 0.0185824953476479, 0.06767801683725291], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1098.8750000000005, 703, 1535, 1070.0, 1411.0, 1517.25, 1535.0, 0.10597149366820326, 0.05484852699623801, 0.048742747575902086], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 231.25, 201, 399, 207.5, 399.0, 399.0, 399.0, 0.037918286093468576, 0.05876593752962366, 0.08527911413404114], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/35156394-78b9-4d1b-9aee-70454e5dcc6f", 3, 0, 0.0, 422.66666666666663, 207, 697, 364.0, 697.0, 697.0, 697.0, 0.04561558228290784, 0.03802783405811425, 0.02925218004470327], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2d3747df-c8c2-48ed-919a-37814e828c42", 1, 0, 0.0, 390.0, 390, 390, 390.0, 390.0, 390.0, 390.0, 2.5641025641025643, 0.4632411858974359, 1.7678285256410255], "isController": false}, {"data": ["addBook", 60, 19, 31.666666666666668, 902.9166666666664, 511, 2301, 747.5, 1508.8, 1628.8999999999996, 2301.0, 0.26821995824709316, 81.30883726089309, 0.9735197052262659], "isController": true}, {"data": ["https://demoqa.com/books-0", 59, 0, 0.0, 184.93220338983048, 100, 629, 103.0, 404.0, 421.0, 629.0, 0.2720649266808079, 0.20218887617587383, 0.1315157604560546], "isController": false}, {"data": ["https://demoqa.com/books-3", 59, 0, 0.0, 560.1186440677967, 487, 804, 499.0, 707.0, 793.0, 804.0, 0.2717704230866671, 79.90952801480918, 0.13668141395472028], "isController": false}, {"data": ["https://demoqa.com/books-1", 59, 0, 0.0, 162.74576271186442, 98, 415, 105.0, 304.0, 309.0, 415.0, 0.2725059928224693, 0.48220787011163513, 0.13252732854061494], "isController": false}, {"data": ["https://demoqa.com/books-2", 59, 0, 0.0, 765.1525423728812, 678, 1008, 701.0, 897.0, 908.0, 1008.0, 0.27153652856656324, 244.32904571449774, 0.1362986090656382], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 118.73684210526316, 102, 314, 107.0, 125.0, 314.0, 314.0, 0.09224465223766107, 0.06891324117364328, 0.03279009122510608], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eadcf48d-b549-4b66-a3ad-01f0de0b6f55", 1, 0, 0.0, 392.0, 392, 392, 392.0, 392.0, 392.0, 392.0, 2.5510204081632653, 0.46087771045918363, 1.7588089923469388], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 19, 10.614525139664805, 148.80446927374314, 100, 1278, 106.0, 256.0, 303.0, 594.7999999999903, 0.7531070926700382, 1.6859078976847217, 0.35878755543120644], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 142.09090909090904, 102, 314, 105.0, 311.40000000000003, 314.0, 314.0, 0.055894592960330086, 0.04328555880619312, 0.019868781091367332], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=22c8b350-1a1b-45ab-a4b2-7455cdcbde41", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 0.4221122955607477, 1.6108717873831777], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 104.06666666666666, 100, 110, 103.0, 109.4, 110.0, 110.0, 0.10110678224295286, 0.08205052348036507, 0.03594030150042465], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7e6ad7f8-5c5e-49e1-9bfb-40a0cae3feb6", 1, 0, 0.0, 380.0, 380, 380, 380.0, 380.0, 380.0, 380.0, 2.631578947368421, 0.4754317434210526, 1.8143503289473684], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2c304b79-983a-4af8-b892-f2e4d6f87714", 1, 0, 0.0, 429.0, 429, 429, 429.0, 429.0, 429.0, 429.0, 2.331002331002331, 0.4211283508158508, 1.6071168414918415], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c4d5eed7-6a1f-487a-b10c-c01ae4d77f69", 3, 0, 0.0, 343.0, 194, 442, 393.0, 442.0, 442.0, 442.0, 0.03572661990449083, 0.02943492024032106, 0.022910625394481427], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2d3747df-c8c2-48ed-919a-37814e828c42", 3, 0, 0.0, 332.3333333333333, 228, 437, 332.0, 437.0, 437.0, 437.0, 0.030303336397337347, 0.024966713678926052, 0.019432803614177922], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 248.54545454545456, 200, 413, 206.0, 410.6, 413.0, 413.0, 0.05608982530568955, 0.08692827417981377, 0.1261473317177764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 318.1875, 203, 985, 213.5, 579.7000000000004, 985.0, 985.0, 0.09587095769094799, 7.307732151898545, 0.21408293811529683], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 130.8125, 101, 320, 104.0, 303.90000000000003, 320.0, 320.0, 0.07579992609507206, 0.06284583716280877, 0.026944504979107647], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 105.73684210526316, 100, 119, 105.0, 113.0, 119.0, 119.0, 0.09012513163012646, 0.06997019496674857, 0.03203666788414651], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d4c0f36c-50d6-44e8-9064-928bac685278", 1, 0, 0.0, 711.0, 711, 711, 711.0, 711.0, 711.0, 711.0, 1.4064697609001406, 0.25409854078762306, 0.9696949718706048], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 113.57894736842105, 100, 300, 102.0, 113.0, 300.0, 300.0, 0.09216366326307876, 0.0684927224054716, 0.046261838786350075], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 121.36842105263159, 98, 303, 100.0, 296.0, 303.0, 303.0, 0.09207790760224283, 0.02463803387013138, 0.05251318167940411], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a7212321-7b71-4a97-a07f-1a23326b76f9", 1, 0, 0.0, 394.0, 394, 394, 394.0, 394.0, 394.0, 394.0, 2.5380710659898473, 0.45853822969543145, 1.7498810279187818], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 153.10526315789474, 98, 303, 102.0, 301.0, 303.0, 303.0, 0.09216589861751152, 0.02484158986175115, 0.054183467741935484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 143.4736842105263, 99, 306, 101.0, 300.0, 306.0, 306.0, 0.09216545153795033, 0.024841469359838175, 0.054273210231820364], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 24.324324324324323, 0.6517016654598118], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 8.108108108108109, 0.2172338884866039], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 2.7027027027027026, 0.07241129616220131], "isController": false}, {"data": ["401/Unauthorized", 24, 64.86486486486487, 1.7378711078928313], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1381, 37, "401/Unauthorized", 24, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 4, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 19, "401/Unauthorized", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
