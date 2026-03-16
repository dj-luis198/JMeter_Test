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

    var data = {"OkPercent": 97.46268656716418, "KoPercent": 2.537313432835821};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8156209987195903, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.48214285714285715, 500, 1500, "see books"], "isController": true}, {"data": [0.5333333333333333, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5333333333333333, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ed02c317-e769-4151-b78b-620948a521df"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/69ad691e-6075-4cc2-a0dc-9182fa43a9d0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8f0068a4-9028-4c62-84cf-68f157efcbbf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2a4e8b57-25f0-47f7-8bdd-4556d5daf5c6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0c110d91-07bb-4874-b9ab-bfa749d05811"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7ca3efb9-85b5-4fff-90fa-c37671f0f3c5"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4654b8a5-705d-416a-95bc-173f9a3dcd0c"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1761eb09-6e61-4706-8f74-cddcf65e142f"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.06818181818181818, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1f1c8783-a8a1-4e6d-8306-383eb03de3e6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=41d911c2-7cdc-441e-a760-d36ab484b73a"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/acdfff22-7c4e-4152-8d11-980dc50f3721"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/74e9ad82-27bb-4054-b9f1-4e801f073742"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.23076923076923078, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7e10690c-bff6-48c2-b6d5-f29f3f697057"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a9ce295c-7ca6-4369-83b0-89c2ff7abe33"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "register"], "isController": true}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.45454545454545453, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0c110d91-07bb-4874-b9ab-bfa749d05811"], "isController": false}, {"data": [0.3951612903225806, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=69ad691e-6075-4cc2-a0dc-9182fa43a9d0"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4654b8a5-705d-416a-95bc-173f9a3dcd0c"], "isController": false}, {"data": [0.925, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7ca3efb9-85b5-4fff-90fa-c37671f0f3c5"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.84375, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f54690d1-1cd4-43f7-8590-1768be0cb167"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/41d911c2-7cdc-441e-a760-d36ab484b73a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ed02c317-e769-4151-b78b-620948a521df"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/164e88a9-c62c-4c11-b67b-613e3a3890fd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=74e9ad82-27bb-4054-b9f1-4e801f073742"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a9ce295c-7ca6-4369-83b0-89c2ff7abe33"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=acdfff22-7c4e-4152-8d11-980dc50f3721"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7e10690c-bff6-48c2-b6d5-f29f3f697057"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1761eb09-6e61-4706-8f74-cddcf65e142f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1340, 34, 2.537313432835821, 273.6962686567168, 81, 2019, 97.0, 678.0, 843.7500000000002, 1215.9599999999964, 5.338879393120814, 747.0366176717406, 3.898810679950117], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1236.2678571428569, 980, 1628, 1199.0, 1443.6, 1489.7499999999998, 1628.0, 0.24604461316075057, 296.07495597421587, 1.2097994406878705], "isController": true}, {"data": ["deleteBook", 15, 4, 26.666666666666668, 509.06666666666666, 87, 1129, 432.0, 1126.6, 1129.0, 1129.0, 0.0781979032535541, 0.016510143245525778, 0.05215229953967501], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 4, 26.666666666666668, 509.06666666666666, 87, 1129, 432.0, 1126.6, 1129.0, 1129.0, 0.07836212706157697, 0.016544816279993102, 0.05226182484497359], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 102.57894736842105, 82, 253, 84.0, 251.0, 253.0, 253.0, 0.10333781130515655, 0.035819808770660766, 0.058478068589112545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 104.89473684210525, 81, 253, 87.0, 251.0, 253.0, 253.0, 0.10333443919312119, 0.07679444162691916, 0.05186904467310966], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 155.2105263157895, 81, 402, 88.0, 264.0, 402.0, 402.0, 0.10324291427577813, 1.6240912755662058, 0.06032939414069292], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 162.10526315789474, 82, 728, 86.0, 253.0, 728.0, 728.0, 0.10324628041689761, 4.915899494161151, 0.06023053467988219], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ed02c317-e769-4151-b78b-620948a521df", 3, 0, 0.0, 283.3333333333333, 165, 494, 191.0, 494.0, 494.0, 494.0, 0.04892846658185733, 0.03145628955051049, 0.031376653374433246], "isController": false}, {"data": ["goToProfile", 15, 4, 26.666666666666668, 197.53333333333333, 83, 388, 186.0, 369.40000000000003, 388.0, 388.0, 0.07894653740486943, 0.12873014165640362, 0.05101714389848527], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/69ad691e-6075-4cc2-a0dc-9182fa43a9d0", 3, 0, 0.0, 364.3333333333333, 188, 517, 388.0, 517.0, 517.0, 517.0, 0.04481089801039612, 0.028809089703949336, 0.02873615529963554], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 104.41176470588235, 82, 247, 86.0, 246.2, 247.0, 247.0, 0.07873031163309822, 0.058509538235144286, 0.03951892595645751], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 123.47058823529412, 81, 253, 86.0, 251.4, 253.0, 253.0, 0.07873140549452586, 0.028022736008966116, 0.04451255129119505], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 505.3333333333333, 407, 675, 467.0, 675.0, 675.0, 675.0, 0.08218164883781452, 24.164133445876537, 0.04686922160281609], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 685.1666666666666, 580, 818, 671.5, 818.0, 818.0, 818.0, 0.08207485226526591, 73.85109634048753, 0.04672816295961917], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8f0068a4-9028-4c62-84cf-68f157efcbbf", 1, 0, 0.0, 183.0, 183, 183, 183.0, 183.0, 183.0, 183.0, 5.46448087431694, 1.7450051229508197, 3.2605447404371586], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 168.5, 83, 253, 169.0, 253.0, 253.0, 253.0, 0.08264690487341249, 0.1462462808892807, 0.04576249517893055], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 91.57142857142858, 83, 168, 85.5, 128.0, 168.0, 168.0, 0.07262239467159115, 0.05397035385261804, 0.03645303795038853], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2a4e8b57-25f0-47f7-8bdd-4556d5daf5c6", 1, 0, 0.0, 179.0, 179, 179, 179.0, 179.0, 179.0, 179.0, 5.58659217877095, 1.783999650837989, 3.3334060754189947], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 124.35714285714286, 82, 296, 85.0, 274.0, 296.0, 296.0, 0.0726250317734514, 0.027224255074674096, 0.04098329429737876], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 143.35714285714283, 82, 578, 84.5, 416.5, 578.0, 578.0, 0.07262465503288859, 4.685875874413815, 0.04224955517398792], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 136.07142857142858, 82, 635, 84.5, 441.5, 635.0, 635.0, 0.07256254632341128, 1.5421464487112373, 0.04228428515525793], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 89.0, 84, 105, 86.0, 105.0, 105.0, 105.0, 0.08264348975909423, 0.061417671588545615, 0.04640625645652264], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 144.7058823529412, 82, 774, 85.0, 355.5999999999996, 774.0, 774.0, 0.07873104087067269, 4.18716803432905, 0.04588724383466481], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 504.33333333333337, 84, 760, 720.0, 757.6, 760.0, 760.0, 0.08676538639518741, 52.05556012479755, 0.046037623640675616], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 114.11764705882354, 81, 419, 85.0, 286.1999999999999, 419.0, 419.0, 0.07866983197049418, 1.3806356667036879, 0.04592839512385871], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 379.06666666666666, 82, 656, 418.0, 654.2, 656.0, 656.0, 0.08676639017110332, 17.015928501602286, 0.04612288904603246], "isController": false}, {"data": ["deleteBooks", 14, 3, 21.428571428571427, 427.7142857142857, 86, 1015, 398.0, 857.5, 1015.0, 1015.0, 0.07570718623427047, 0.015531168716168352, 0.05104003592035604], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0c110d91-07bb-4874-b9ab-bfa749d05811", 1, 0, 0.0, 700.0, 700, 700, 700.0, 700.0, 700.0, 700.0, 1.4285714285714286, 0.25809151785714285, 0.9849330357142858], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7ca3efb9-85b5-4fff-90fa-c37671f0f3c5", 1, 0, 0.0, 1015.0, 1015, 1015, 1015.0, 1015.0, 1015.0, 1015.0, 0.9852216748768472, 0.17799415024630544, 0.6792641625615764], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4654b8a5-705d-416a-95bc-173f9a3dcd0c", 3, 0, 0.0, 402.0, 293, 581, 332.0, 581.0, 581.0, 581.0, 0.03070215836173283, 0.03079210609130822, 0.019688558584835182], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 265.2142857142857, 168, 720, 176.0, 572.0, 720.0, 720.0, 0.07252908934547678, 6.302234503059173, 0.16179410416213358], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1761eb09-6e61-4706-8f74-cddcf65e142f", 3, 0, 0.0, 659.3333333333334, 186, 1420, 372.0, 1420.0, 1420.0, 1420.0, 0.1125703564727955, 0.050935154784240155, 0.07218867260787992], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 510.27272727272737, 125, 1165, 419.5, 1102.3, 1158.6999999999998, 1165.0, 0.10780403187079196, 0.06621946879563295, 0.048743424566578784], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 86.46666666666667, 83, 90, 86.0, 88.8, 90.0, 90.0, 0.08676187336236964, 0.06447830627808916, 0.0435503934650957], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 152.26666666666668, 82, 254, 90.0, 254.0, 254.0, 254.0, 0.08676438264249604, 0.11009360792332341, 0.04462491034347127], "isController": false}, {"data": ["login", 22, 0, 0.0, 2164.0909090909095, 1335, 3688, 1981.5, 3110.2, 3609.249999999999, 3688.0, 0.10724069686954656, 35.13641846843224, 0.21030182467608435], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 101.41176470588236, 86, 255, 90.0, 132.59999999999988, 255.0, 255.0, 0.07930066146081148, 0.06419946128028586, 0.02818890700364783], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1f1c8783-a8a1-4e6d-8306-383eb03de3e6", 1, 0, 0.0, 214.0, 214, 214, 214.0, 214.0, 214.0, 214.0, 4.672897196261682, 1.4922240070093458, 2.788222838785047], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=41d911c2-7cdc-441e-a760-d36ab484b73a", 1, 0, 0.0, 367.0, 367, 367, 367.0, 367.0, 367.0, 367.0, 2.7247956403269753, 0.49227264986376024, 1.8786188692098094], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 592.3333333333334, 171, 849, 811.0, 846.6, 849.0, 849.0, 0.08671873645019744, 69.20863710485162, 0.1802406029409214], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/acdfff22-7c4e-4152-8d11-980dc50f3721", 3, 0, 0.0, 410.0, 192, 578, 460.0, 578.0, 578.0, 578.0, 0.028908418131359852, 0.028993110762604073, 0.018538275950123344], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/74e9ad82-27bb-4054-b9f1-4e801f073742", 3, 0, 0.0, 366.3333333333333, 339, 403, 357.0, 403.0, 403.0, 403.0, 0.02103477047559616, 0.028998129220100824, 0.013489094347957172], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 305.5263157894737, 167, 810, 336.0, 507.0, 810.0, 810.0, 0.10319188803137033, 6.649056014865064, 0.23069136358575518], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 7, 53.84615384615385, 404.30769230769226, 83, 906, 85.0, 894.4, 906.0, 906.0, 0.11315466501867052, 62.495834901903606, 0.1579847208561456], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7e10690c-bff6-48c2-b6d5-f29f3f697057", 3, 0, 0.0, 271.6666666666667, 181, 440, 194.0, 440.0, 440.0, 440.0, 0.02785929200252591, 0.02794091102206456, 0.01786549649901564], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a9ce295c-7ca6-4369-83b0-89c2ff7abe33", 1, 0, 0.0, 396.0, 396, 396, 396.0, 396.0, 396.0, 396.0, 2.5252525252525255, 0.456222380050505, 1.7410432449494948], "isController": false}, {"data": ["register", 24, 7, 29.166666666666668, 885.9583333333334, 485, 1653, 828.5, 1397.0, 1590.5, 1653.0, 0.09336160115145975, 0.02931226051776788, 0.042122128644506256], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 280.4705882352941, 169, 860, 175.0, 570.3999999999997, 860.0, 860.0, 0.07863817189379221, 5.648739620917754, 0.17567554381765196], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 99.0625, 84, 259, 88.5, 142.10000000000014, 259.0, 259.0, 0.11420984631637554, 0.08866877716945173, 0.040598031307774125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 234.3125, 168, 342, 175.0, 339.9, 342.0, 342.0, 0.08419634587858886, 0.13048789151300833, 0.18935955523280287], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 14, 0, 0.0, 116.92857142857143, 83, 361, 86.0, 305.0, 361.0, 361.0, 0.07365242369082817, 0.05473583440304711, 0.03697006423543524], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 14, 0, 0.0, 119.85714285714286, 83, 253, 84.5, 253.0, 253.0, 253.0, 0.07358854541727333, 0.01969068500423134, 0.041968467308288696], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 14, 0, 0.0, 120.57142857142857, 82, 254, 85.0, 251.0, 254.0, 254.0, 0.07365397363187744, 0.019852047580466967, 0.04330048059217795], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 14, 0, 0.0, 130.85714285714286, 81, 251, 84.5, 250.0, 251.0, 251.0, 0.07365358614049948, 0.019851943139431498, 0.04337218011984491], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 88.66666666666667, 86, 93, 87.0, 93.0, 93.0, 93.0, 0.03929839269573874, 0.011589955658313575, 0.024292854078518188], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 793.5357142857142, 644, 1237, 686.0, 1084.9, 1120.3, 1237.0, 0.2557007570568843, 305.90700140635414, 0.5049091120791211], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, 29.166666666666668, 885.9583333333334, 485, 1653, 828.5, 1397.0, 1590.5, 1653.0, 0.09646224708804592, 0.03028575433477223, 0.043521052885426965], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 132.71428571428572, 83, 256, 85.0, 256.0, 256.0, 256.0, 0.06511809631896703, 0.017551361898471587, 0.038345910234704225], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 109.28571428571428, 83, 251, 86.0, 251.0, 251.0, 251.0, 0.06511809631896703, 0.017551361898471587, 0.03828231834376773], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 218.25000000000003, 82, 750, 84.5, 633.1000000000001, 750.0, 750.0, 0.11237849075686913, 18.984303391635528, 0.06425547493959656], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 208.43750000000003, 82, 586, 85.0, 582.5, 586.0, 586.0, 0.1123721766490617, 6.219824668677661, 0.06436160312956513], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 127.43750000000003, 83, 255, 86.5, 252.9, 255.0, 255.0, 0.11225234326766571, 0.08342190744794298, 0.05634541449177752], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 110.57142857142857, 84, 261, 85.0, 261.0, 261.0, 261.0, 0.06511870209124061, 0.01742434020800774, 0.03713800978641066], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 157.25, 81, 253, 89.0, 253.0, 253.0, 253.0, 0.11237849075686913, 0.06171763060487723, 0.06232122601421588], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 134.28571428571428, 85, 254, 87.0, 254.0, 254.0, 254.0, 0.0650176941010375, 0.048318813682509315, 0.03263583473430984], "isController": false}, {"data": ["deleteAccount", 14, 3, 21.428571428571427, 423.35714285714283, 84, 725, 439.0, 718.0, 725.0, 725.0, 0.07688759034291866, 0.015322812891302915, 0.05231852984062301], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 90.85714285714286, 88, 98, 90.0, 98.0, 98.0, 98.0, 0.06772445820433437, 0.053306555969427245, 0.02407392850232198], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1173.2727272727273, 839, 2019, 1094.0, 1544.5, 1951.199999999999, 2019.0, 0.10729666063529376, 0.05553440443037666, 0.04935227261642907], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 270.1428571428571, 171, 513, 176.0, 513.0, 513.0, 513.0, 0.0649658001466371, 0.10068430159444636, 0.14610960716572777], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0c110d91-07bb-4874-b9ab-bfa749d05811", 3, 0, 0.0, 569.3333333333334, 305, 965, 438.0, 965.0, 965.0, 965.0, 0.02647860969646687, 0.026556183748311986, 0.016980098014986893], "isController": false}, {"data": ["addBook", 62, 13, 20.967741935483872, 796.4032258064515, 437, 1380, 715.0, 1232.4, 1251.1999999999998, 1380.0, 0.3026929911926104, 94.65942823826576, 1.099340818882184], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 153.91071428571428, 83, 355, 87.5, 341.0, 343.0, 355.0, 0.25638677776760366, 0.19053743933705705, 0.12393696776851937], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=69ad691e-6075-4cc2-a0dc-9182fa43a9d0", 1, 0, 0.0, 620.0, 620, 620, 620.0, 620.0, 620.0, 620.0, 1.6129032258064515, 0.2913936491935484, 1.1120211693548387], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 472.01785714285717, 406, 688, 421.5, 610.5, 667.2, 688.0, 0.25635156786449986, 75.37587262531473, 0.12892681391622798], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 126.4285714285714, 83, 259, 89.0, 253.0, 255.15, 259.0, 0.25672763948104343, 0.4542875808004401, 0.12485387154449182], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 634.6607142857142, 558, 857, 585.5, 750.6, 788.1999999999999, 857.0, 0.2561451977349446, 230.47989917713355, 0.12857288245679838], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 101.31250000000003, 86, 248, 88.5, 154.2000000000001, 248.0, 248.0, 0.08328084904825604, 0.06221664992374597, 0.029603739310122265], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4654b8a5-705d-416a-95bc-173f9a3dcd0c", 1, 0, 0.0, 585.0, 585, 585, 585.0, 585.0, 585.0, 585.0, 1.7094017094017093, 0.3088274572649573, 1.1785523504273505], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 13, 7.222222222222222, 132.07222222222225, 83, 592, 91.0, 230.60000000000002, 301.79999999999995, 473.73999999999967, 0.7604787636305257, 1.6375007327529754, 0.3663517325184944], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 14, 0, 0.0, 90.64285714285715, 83, 106, 89.0, 101.5, 106.0, 106.0, 0.0734345331137291, 0.05686873511639374, 0.026103681692770896], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 100.0, 86, 255, 90.0, 121.0, 255.0, 255.0, 0.10189853051592836, 0.08269304576048482, 0.0362217432693339], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7ca3efb9-85b5-4fff-90fa-c37671f0f3c5", 3, 0, 0.0, 350.0, 161, 711, 178.0, 711.0, 711.0, 711.0, 0.03237363491172789, 0.026988567385721068, 0.020760436450554667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 14, 0, 0.0, 274.42857142857144, 169, 616, 180.0, 556.5, 616.0, 616.0, 0.07355452228964719, 0.11399514343131846, 0.1654258445635327], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 379.93750000000006, 169, 1000, 337.0, 869.8000000000002, 1000.0, 1000.0, 0.11217285837475549, 25.30332543230368, 0.2468980480169942], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f54690d1-1cd4-43f7-8590-1768be0cb167", 1, 0, 0.0, 326.0, 326, 326, 326.0, 326.0, 326.0, 326.0, 3.067484662576687, 0.9795580904907976, 1.8303057898773005], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/41d911c2-7cdc-441e-a760-d36ab484b73a", 3, 0, 0.0, 406.66666666666663, 187, 725, 308.0, 725.0, 725.0, 725.0, 0.030941232286144517, 0.02579443225417191, 0.019841870964747623], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ed02c317-e769-4151-b78b-620948a521df", 1, 0, 0.0, 412.0, 412, 412, 412.0, 412.0, 412.0, 412.0, 2.4271844660194173, 0.43850500606796117, 1.6734299150485439], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/164e88a9-c62c-4c11-b67b-613e3a3890fd", 1, 0, 0.0, 180.0, 180, 180, 180.0, 180.0, 180.0, 180.0, 5.555555555555555, 1.7740885416666667, 3.3148871527777777], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=74e9ad82-27bb-4054-b9f1-4e801f073742", 1, 0, 0.0, 458.0, 458, 458, 458.0, 458.0, 458.0, 458.0, 2.1834061135371177, 0.39446301855895194, 1.5053561681222707], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 89.35714285714286, 86, 101, 88.0, 99.0, 101.0, 101.0, 0.06938971743515779, 0.05753112314692282, 0.024665876119528748], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a9ce295c-7ca6-4369-83b0-89c2ff7abe33", 3, 0, 0.0, 291.6666666666667, 186, 414, 275.0, 414.0, 414.0, 414.0, 0.033442206293823225, 0.027879391379713958, 0.021445685676703047], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=acdfff22-7c4e-4152-8d11-980dc50f3721", 1, 0, 0.0, 374.0, 374, 374, 374.0, 374.0, 374.0, 374.0, 2.6737967914438503, 0.4830589906417112, 1.8434575534759359], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 111.93333333333334, 84, 256, 90.0, 256.0, 256.0, 256.0, 0.08594166279929184, 0.06672228703655958, 0.03054957544818577], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7e10690c-bff6-48c2-b6d5-f29f3f697057", 1, 0, 0.0, 395.0, 395, 395, 395.0, 395.0, 395.0, 395.0, 2.5316455696202533, 0.4573773734177215, 1.7454509493670884], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1761eb09-6e61-4706-8f74-cddcf65e142f", 1, 0, 0.0, 400.0, 400, 400, 400.0, 400.0, 400.0, 400.0, 2.5, 0.45166015625, 1.7236328125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 85.25, 83, 91, 85.0, 88.9, 91.0, 91.0, 0.08423402317488562, 0.06259969886336715, 0.04228153116395626], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 95.49999999999999, 81, 252, 85.0, 138.6000000000001, 252.0, 252.0, 0.08423446663788656, 0.02253930064334074, 0.048039969254419675], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 115.87500000000001, 81, 253, 85.0, 252.3, 253.0, 253.0, 0.08423535357789663, 0.022704060144042457, 0.049521174662005646], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 125.87500000000001, 82, 251, 85.0, 251.0, 251.0, 251.0, 0.08423579705490594, 0.022704179674955118, 0.04960369689854324], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 20.58823529411765, 0.5223880597014925], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 11.764705882352942, 0.29850746268656714], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 8.823529411764707, 0.22388059701492538], "isController": false}, {"data": ["401/Unauthorized", 20, 58.8235294117647, 1.492537313432836], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1340, 34, "401/Unauthorized", 20, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 7, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
