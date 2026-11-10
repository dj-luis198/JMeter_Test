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

    var data = {"OkPercent": 99.09502262443439, "KoPercent": 0.9049773755656109};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8284505208333334, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1c06a146-a30c-47c5-bd37-7f3760eef083"], "isController": false}, {"data": [0.4473684210526316, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6b80603d-ea51-47ee-8b4d-cdc774041bf5"], "isController": false}, {"data": [0.625, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.625, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c0771167-e747-47d7-9295-0338421f5fdc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/46714932-eddd-49ff-b15e-71417e5485f9"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=41bc4507-db94-4711-b2c1-2abbaaabc147"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7fb75355-98c2-4bee-9799-00c26add5b31"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.775, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7aff606e-3264-4346-bfd9-1f3d22ea9166"], "isController": false}, {"data": [0.05, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9167b438-de82-432f-92d2-e090ce292941"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1b3aeb2a-f640-44d3-a946-a20eb12d5969"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/92fc2c9d-1d72-48a0-9e74-85747685b635"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/f0524e0d-3332-463b-98d6-d9b1b0dd2948"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=16ed4f1f-7379-4b3e-a783-aa54ea8b8c5c"], "isController": false}, {"data": [0.38095238095238093, 500, 1500, "register"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/41bc4507-db94-4711-b2c1-2abbaaabc147"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9da7e42a-168e-493b-bdca-a88f48376516"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/4e8e0650-317e-400f-a2cb-c53debc32b14"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.49122807017543857, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.38095238095238093, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1c06a146-a30c-47c5-bd37-7f3760eef083"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=92fc2c9d-1d72-48a0-9e74-85747685b635"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.625, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.35, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2fa2b29f-42ab-4fbb-abfe-64543d0cc054"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7fb75355-98c2-4bee-9799-00c26add5b31"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/47892590-bd33-425f-b047-087a0b0b2598"], "isController": false}, {"data": [0.4365079365079365, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=46714932-eddd-49ff-b15e-71417e5485f9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6b80603d-ea51-47ee-8b4d-cdc774041bf5"], "isController": false}, {"data": [0.9912280701754386, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8245614035087719, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9508196721311475, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f60001fb-d6c5-4096-adf4-02e41b5273a7"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/1b3aeb2a-f640-44d3-a946-a20eb12d5969"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/9167b438-de82-432f-92d2-e090ce292941"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/5a3dde46-b616-4d2d-983a-f381fb7185e8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9da7e42a-168e-493b-bdca-a88f48376516"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7aff606e-3264-4346-bfd9-1f3d22ea9166"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/16ed4f1f-7379-4b3e-a783-aa54ea8b8c5c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1326, 12, 0.9049773755656109, 306.91101055806917, 79, 9084, 91.5, 674.1999999999994, 850.4499999999982, 1774.0600000000004, 5.199306759098787, 707.0365801716634, 3.79682831504819], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/1c06a146-a30c-47c5-bd37-7f3760eef083", 3, 0, 0.0, 329.66666666666663, 185, 616, 188.0, 616.0, 616.0, 616.0, 0.016440608302507195, 0.02266470578161392, 0.010542968214823948], "isController": false}, {"data": ["see books", 57, 0, 0.0, 1211.1052631578948, 963, 1919, 1150.0, 1519.6, 1621.1999999999994, 1919.0, 0.2507379172916786, 301.7231581897822, 1.2328763804332048], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6b80603d-ea51-47ee-8b4d-cdc774041bf5", 3, 0, 0.0, 289.6666666666667, 182, 488, 199.0, 488.0, 488.0, 488.0, 0.07660291601766973, 0.034660824630390934, 0.04912361476393535], "isController": false}, {"data": ["deleteBook", 12, 1, 8.333333333333334, 589.9166666666667, 85, 1176, 503.0, 1114.8000000000002, 1176.0, 1176.0, 0.07255533856134856, 0.013798976742990852, 0.04902563281859352], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, 8.333333333333334, 589.9166666666667, 85, 1176, 503.0, 1114.8000000000002, 1176.0, 1176.0, 0.07495689978262499, 0.014255718977213101, 0.05064836742310671], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c0771167-e747-47d7-9295-0338421f5fdc", 1, 0, 0.0, 333.0, 333, 333, 333.0, 333.0, 333.0, 333.0, 3.003003003003003, 0.9589667792792792, 1.7918308933933933], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 89.44444444444444, 80, 238, 80.5, 97.60000000000022, 238.0, 238.0, 0.09482717746906263, 0.025373678346214026, 0.05408112465032479], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 81.88888888888889, 80, 87, 82.0, 83.4, 87.0, 87.0, 0.09482617834696899, 0.07047140793168301, 0.047598296553068416], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 116.55555555555556, 80, 243, 81.0, 241.2, 243.0, 243.0, 0.09474681545425835, 0.025537227602905572, 0.055793290741130645], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 116.6111111111111, 80, 242, 82.0, 241.1, 242.0, 242.0, 0.09474631673693686, 0.025537093183002513, 0.05570047136292577], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/46714932-eddd-49ff-b15e-71417e5485f9", 3, 0, 0.0, 378.0, 206, 478, 450.0, 478.0, 478.0, 478.0, 0.09872318020271159, 0.046405036527576674, 0.06330881022113992], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 292.3076923076923, 80, 982, 227.0, 771.1999999999998, 982.0, 982.0, 0.073264614881734, 0.18135083570973687, 0.047358925109474245], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 22, 0, 0.0, 97.68181818181817, 80, 242, 82.0, 198.1999999999999, 242.0, 242.0, 0.09879115549727875, 0.07341803645842689, 0.049588529224219996], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 22, 0, 0.0, 124.54545454545456, 80, 244, 81.0, 241.7, 243.7, 244.0, 0.09872244185472544, 0.026415965886908956, 0.0563026426202731], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 2, 0, 0.0, 481.5, 399, 564, 481.5, 564.0, 564.0, 564.0, 0.02060984532311085, 6.059978836265084, 0.011754052410836657], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 2, 0, 0.0, 552.5, 552, 553, 552.5, 553.0, 553.0, 553.0, 0.020612394232652095, 18.54706856326459, 0.011735376794566573], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 2, 0, 0.0, 245.0, 242, 248, 245.0, 248.0, 248.0, 248.0, 0.020677177565262342, 0.03658891186353063, 0.011449179374515379], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 82.29411764705883, 80, 89, 82.0, 84.19999999999999, 89.0, 89.0, 0.0742562364318568, 0.0551845663326592, 0.037273149927709366], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 104.94117647058822, 79, 332, 81.0, 257.5999999999999, 332.0, 332.0, 0.07425818259650288, 0.03299131343068435, 0.041616660696891204], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 145.64705882352942, 79, 714, 81.0, 583.5999999999999, 714.0, 714.0, 0.07425720950142836, 7.878456168044065, 0.04290435507613548], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 156.99999999999997, 80, 562, 81.0, 554.0, 562.0, 562.0, 0.07425818259650288, 2.5864097697559525, 0.04297743506777151], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 2, 0, 0.0, 81.5, 81, 82, 81.5, 82.0, 82.0, 82.0, 0.020712939373226453, 0.015393112170923175, 0.011630800917583213], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 22, 0, 0.0, 102.72727272727273, 80, 247, 81.0, 240.1, 246.1, 247.0, 0.09879248638235387, 0.026627662345243816, 0.058079176564626], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 421.7777777777778, 80, 799, 557.5, 734.2, 799.0, 799.0, 0.09323622952687793, 46.61901515671457, 0.05036132276310746], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=41bc4507-db94-4711-b2c1-2abbaaabc147", 1, 0, 0.0, 420.0, 420, 420, 420.0, 420.0, 420.0, 420.0, 2.3809523809523814, 0.43015252976190477, 1.6415550595238095], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 22, 0, 0.0, 124.22727272727273, 79, 240, 82.0, 239.7, 240.0, 240.0, 0.09872244185472544, 0.026608783156156467, 0.05813440667812445], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 355.8333333333333, 80, 650, 477.5, 639.2, 650.0, 650.0, 0.09323622952687793, 15.241472931709643, 0.0504523737685048], "isController": false}, {"data": ["deleteBooks", 12, 1, 8.333333333333334, 490.16666666666663, 81, 885, 449.0, 876.0, 885.0, 885.0, 0.07484423044538555, 0.014234290897694174, 0.05115695731695908], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/7fb75355-98c2-4bee-9799-00c26add5b31", 3, 0, 0.0, 334.6666666666667, 260, 455, 289.0, 455.0, 455.0, 455.0, 0.020620115610114856, 0.024372278574325206, 0.013223186117163497], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 259.5882352941176, 162, 795, 165.0, 674.9999999999999, 795.0, 795.0, 0.07422932494978604, 10.549045423161733, 0.16470910701030478], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 839.85, 132, 7433, 437.0, 1678.6000000000022, 7150.349999999996, 7433.0, 0.09354668213305145, 0.05746178033368102, 0.04229698615976838], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 91.27777777777779, 81, 241, 82.0, 101.50000000000023, 241.0, 241.0, 0.09323478071697547, 0.06928873840392415, 0.04679948953957557], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 117.38888888888887, 81, 243, 82.0, 243.0, 243.0, 243.0, 0.09323574658524078, 0.10274546900170414, 0.04882331955516189], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7aff606e-3264-4346-bfd9-1f3d22ea9166", 1, 0, 0.0, 478.0, 478, 478, 478.0, 478.0, 478.0, 478.0, 2.092050209205021, 0.377958289748954, 1.4423705543933054], "isController": false}, {"data": ["login", 20, 0, 0.0, 3138.25, 1315, 9977, 2193.0, 7916.800000000005, 9884.3, 9977.0, 0.0924410919141777, 11.190364301676881, 0.15480271915471863], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 22, 0, 0.0, 83.81818181818183, 82, 88, 83.0, 86.0, 87.69999999999999, 88.0, 0.10417505196914524, 0.08433702937736466, 0.0370309755046571], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9167b438-de82-432f-92d2-e090ce292941", 1, 0, 0.0, 855.0, 855, 855, 855.0, 855.0, 855.0, 855.0, 1.1695906432748537, 0.2113029970760234, 0.8063779239766082], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1b3aeb2a-f640-44d3-a946-a20eb12d5969", 1, 0, 0.0, 713.0, 713, 713, 713.0, 713.0, 713.0, 713.0, 1.402524544179523, 0.2533857819074334, 0.9669749298737729], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/92fc2c9d-1d72-48a0-9e74-85747685b635", 3, 0, 0.0, 428.0, 211, 794, 279.0, 794.0, 794.0, 794.0, 0.02835538752362949, 0.028438459948015124, 0.018183630671077505], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 523.2222222222223, 163, 882, 641.0, 816.3000000000001, 882.0, 882.0, 0.09319519734083037, 62.00522410856205, 0.196351035890506], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f0524e0d-3332-463b-98d6-d9b1b0dd2948", 2, 0, 0.0, 625.0, 268, 982, 625.0, 982.0, 982.0, 982.0, 0.05750761975961815, 0.033780110630283515, 0.03574570310253609], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 226.27777777777777, 163, 325, 166.0, 324.1, 325.0, 325.0, 0.0947049414933917, 0.1467741622558717, 0.21299363306570418], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 2, 50.0, 360.25, 80, 646, 357.5, 646.0, 646.0, 646.0, 0.030210111324260228, 18.07493972138725, 0.044068704873646204], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=16ed4f1f-7379-4b3e-a783-aa54ea8b8c5c", 1, 0, 0.0, 571.0, 571, 571, 571.0, 571.0, 571.0, 571.0, 1.7513134851138354, 0.3163994089316988, 1.207448555166375], "isController": false}, {"data": ["register", 21, 2, 9.523809523809524, 2245.0, 391, 9084, 858.0, 8140.4000000000015, 9026.4, 9084.0, 0.08401747563493207, 0.0269587324163426, 0.037906322014979114], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/41bc4507-db94-4711-b2c1-2abbaaabc147", 3, 0, 0.0, 584.6666666666666, 227, 994, 533.0, 994.0, 994.0, 994.0, 0.025056795402913272, 0.029616283889315784, 0.016068322572831754], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 22, 0, 0.0, 252.90909090909093, 163, 486, 167.5, 439.39999999999986, 485.4, 486.0, 0.09868524341612428, 0.1529428528333879, 0.22194542537825604], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 10, 0, 0.0, 83.5, 82, 86, 83.5, 85.8, 86.0, 86.0, 0.11374493835024341, 0.08830783787933938, 0.04043277105418809], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9da7e42a-168e-493b-bdca-a88f48376516", 3, 0, 0.0, 329.0, 174, 603, 210.0, 603.0, 603.0, 603.0, 0.02761185100645197, 0.027692745101197434, 0.017706818516507284], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4e8e0650-317e-400f-a2cb-c53debc32b14", 1, 0, 0.0, 927.0, 927, 927, 927.0, 927.0, 927.0, 927.0, 1.0787486515641855, 0.34448321197411, 0.6436674083063646], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 305.375, 163, 503, 323.0, 486.90000000000003, 503.0, 503.0, 0.12982271086048117, 0.20119984583553085, 0.2919743194450079], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 111.36363636363637, 81, 242, 83.0, 241.8, 242.0, 242.0, 0.05880843419870835, 0.04370431486837603, 0.02951907732239853], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 95.54545454545455, 79, 239, 81.0, 208.6000000000001, 239.0, 239.0, 0.05880937742254538, 0.03179590807025048, 0.03264171055093694], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 233.00000000000003, 80, 712, 86.0, 711.4, 712.0, 712.0, 0.0586119621686426, 9.601861179565738, 0.03354161116291461], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 168.0, 79, 556, 82.0, 554.8, 556.0, 556.0, 0.058661973708769966, 3.149039743487188, 0.033627518131882785], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 81.0, 81, 81, 81.0, 81.0, 81.0, 81.0, 12.345679012345679, 3.6410108024691357, 7.631655092592593], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 792.0877192982457, 632, 1531, 705.0, 1086.8000000000002, 1182.199999999999, 1531.0, 0.25189250818650655, 301.351011795861, 0.49738930815734], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 2, 9.523809523809524, 2245.0, 391, 9084, 858.0, 8140.4000000000015, 9026.4, 9084.0, 0.08522000965826776, 0.02734459015262498, 0.038448871545038774], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1c06a146-a30c-47c5-bd37-7f3760eef083", 1, 0, 0.0, 695.0, 695, 695, 695.0, 695.0, 695.0, 695.0, 1.4388489208633093, 0.2599482913669065, 0.9920188848920864], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 101.625, 80, 240, 81.0, 240.0, 240.0, 240.0, 0.04389791539774255, 0.011831860009547796, 0.025850041977381596], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 121.625, 79, 247, 82.0, 247.0, 247.0, 247.0, 0.043897674520692265, 0.011831795085655338, 0.025807031310016354], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 10, 0, 0.0, 206.3, 79, 712, 80.5, 695.8000000000001, 712.0, 712.0, 0.11421131377274234, 20.578134993489954, 0.06518075368045959], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=92fc2c9d-1d72-48a0-9e74-85747685b635", 1, 0, 0.0, 412.0, 412, 412, 412.0, 412.0, 412.0, 412.0, 2.4271844660194173, 0.43850500606796117, 1.6734299150485439], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 10, 0, 0.0, 215.79999999999998, 81, 554, 164.0, 545.6, 554.0, 554.0, 0.11452785890167783, 6.75969370955735, 0.06547325058695527], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 101.75, 80, 244, 81.0, 244.0, 244.0, 244.0, 0.04389815627743635, 0.011746186347673397, 0.025035667251975417], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 10, 0, 0.0, 129.3, 81, 240, 83.0, 239.9, 240.0, 240.0, 0.1150377323762194, 0.08549190853349899, 0.05774354925915701], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 84.0, 81, 97, 82.5, 97.0, 97.0, 97.0, 0.043897433646285455, 0.03262299512189769, 0.02203445399823313], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 10, 0, 0.0, 145.2, 80, 246, 82.0, 245.5, 246.0, 246.0, 0.11482242711646438, 0.06521555040130439, 0.06355600750938674], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 124.62499999999999, 82, 253, 84.0, 253.0, 253.0, 253.0, 0.04322782142586969, 0.0340250235051279, 0.015366139647477116], "isController": false}, {"data": ["deleteAccount", 12, 1, 8.333333333333334, 580.0833333333334, 80, 1308, 530.0, 1153.8000000000006, 1308.0, 1308.0, 0.07385297104348093, 0.013877482921500445, 0.05026305312798104], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1676.65, 812, 7674, 1315.0, 2693.500000000001, 7427.249999999996, 7674.0, 0.09330490643850506, 0.04829257852774188, 0.04291661223880458], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 207.75, 162, 344, 166.0, 344.0, 344.0, 344.0, 0.04387745028136415, 0.06800147812160635, 0.09868141406052895], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2fa2b29f-42ab-4fbb-abfe-64543d0cc054", 1, 0, 0.0, 192.0, 192, 192, 192.0, 192.0, 192.0, 192.0, 5.208333333333333, 1.6632080078125, 3.1077067057291665], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7fb75355-98c2-4bee-9799-00c26add5b31", 1, 0, 0.0, 885.0, 885, 885, 885.0, 885.0, 885.0, 885.0, 1.1299435028248588, 0.2041401836158192, 0.7790430790960452], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/47892590-bd33-425f-b047-087a0b0b2598", 1, 0, 0.0, 177.0, 177, 177, 177.0, 177.0, 177.0, 177.0, 5.649717514124294, 1.804157838983051, 3.3710716807909606], "isController": false}, {"data": ["addBook", 63, 6, 9.523809523809524, 846.5873015873018, 417, 1909, 712.0, 1315.2, 1474.3999999999999, 1909.0, 0.31720936321479104, 97.54879257465748, 1.154805918535097], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=46714932-eddd-49ff-b15e-71417e5485f9", 1, 0, 0.0, 184.0, 184, 184, 184.0, 184.0, 184.0, 184.0, 5.434782608695652, 0.9818699048913043, 3.7470278532608696], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6b80603d-ea51-47ee-8b4d-cdc774041bf5", 1, 0, 0.0, 184.0, 184, 184, 184.0, 184.0, 184.0, 184.0, 5.434782608695652, 0.9818699048913043, 3.7470278532608696], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 154.64912280701756, 81, 640, 83.0, 334.20000000000005, 364.39999999999964, 640.0, 0.25277834443488517, 0.18785578136225353, 0.12219265673366032], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 471.4385964912281, 394, 726, 403.0, 594.2000000000002, 648.8, 726.0, 0.2530959855424469, 74.41862332712434, 0.12728948491636732], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 125.35087719298245, 80, 341, 83.0, 242.4, 246.2, 341.0, 0.253447102921756, 0.44848256884201354, 0.1232584543506196], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 629.017543859649, 548, 1196, 559.0, 793.0, 810.1999999999996, 1196.0, 0.25265285497726125, 227.33748302488632, 0.12681989009600808], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 95.93749999999999, 82, 243, 83.5, 159.00000000000009, 243.0, 243.0, 0.12598524397829905, 0.09411983558925661, 0.04478381719541099], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 183, 6, 3.278688524590164, 156.33333333333343, 81, 1061, 88.0, 268.6, 327.7999999999999, 997.1599999999997, 0.7331495785391494, 1.5012289269574692, 0.355048904181757], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 84.0, 80, 94, 83.0, 92.2, 94.0, 94.0, 0.05866510226393963, 0.04543108017119544, 0.02085361057038479], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 87.11111111111111, 82, 111, 84.0, 99.30000000000001, 111.0, 111.0, 0.09379103357719001, 0.07611362197523917, 0.03333978146689177], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f60001fb-d6c5-4096-adf4-02e41b5273a7", 1, 0, 0.0, 286.0, 286, 286, 286.0, 286.0, 286.0, 286.0, 3.4965034965034967, 1.116559222027972, 2.0862926136363638], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1b3aeb2a-f640-44d3-a946-a20eb12d5969", 3, 0, 0.0, 822.6666666666666, 455, 1308, 705.0, 1308.0, 1308.0, 1308.0, 0.02029138427823546, 0.027973311334090877, 0.013012378589884068], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9167b438-de82-432f-92d2-e090ce292941", 3, 0, 0.0, 1667.0, 232, 4124, 645.0, 4124.0, 4124.0, 4124.0, 0.01788556813507181, 0.024656699561207394, 0.011469586336618315], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 345.18181818181813, 162, 952, 170.0, 920.2000000000002, 952.0, 952.0, 0.05858605225875862, 12.81779500573877, 0.12903598814697642], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 10, 0, 0.0, 401.20000000000005, 164, 951, 323.5, 935.2, 951.0, 951.0, 0.11410314924691921, 27.44287711090826, 0.2507817848585121], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5a3dde46-b616-4d2d-983a-f381fb7185e8", 1, 0, 0.0, 1021.0, 1021, 1021, 1021.0, 1021.0, 1021.0, 1021.0, 0.9794319294809011, 0.31276781341821747, 0.5844071376101861], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 85.11764705882354, 80, 113, 83.0, 92.19999999999999, 113.0, 113.0, 0.07434456519362385, 0.06163919516541666, 0.026427169658670983], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 90.83333333333331, 82, 152, 84.0, 140.3, 152.0, 152.0, 0.09640877319836105, 0.07484860809833695, 0.034270306097854905], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9da7e42a-168e-493b-bdca-a88f48376516", 1, 0, 0.0, 404.0, 404, 404, 404.0, 404.0, 404.0, 404.0, 2.4752475247524752, 0.44718827351485146, 1.7065671410891088], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7aff606e-3264-4346-bfd9-1f3d22ea9166", 3, 0, 0.0, 359.3333333333333, 182, 527, 369.0, 527.0, 527.0, 527.0, 0.01648242972990792, 0.022722359995494802, 0.010569787294244336], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/16ed4f1f-7379-4b3e-a783-aa54ea8b8c5c", 3, 0, 0.0, 333.6666666666667, 240, 434, 327.0, 434.0, 434.0, 434.0, 0.019242610837438424, 0.026527492479346264, 0.012339825309164614], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 102.0625, 81, 241, 82.0, 240.3, 241.0, 241.0, 0.1300791857042975, 0.09667017609469765, 0.06529365376172745], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 120.6875, 79, 245, 81.0, 241.5, 245.0, 245.0, 0.1300855312367882, 0.034808042537968716, 0.07418940453348076], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 172.18749999999997, 80, 261, 238.5, 249.10000000000002, 261.0, 261.0, 0.12991441887656507, 0.035015995712824176, 0.07637546890985564], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 191.81250000000003, 80, 259, 239.5, 247.10000000000002, 259.0, 259.0, 0.1299154737448947, 0.03501628003280366, 0.07650295963688625], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 2, 16.666666666666668, 0.15082956259426847], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 8.333333333333334, 0.07541478129713423], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 8.333333333333334, 0.07541478129713423], "isController": false}, {"data": ["401/Unauthorized", 8, 66.66666666666667, 0.6033182503770739], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1326, 12, "401/Unauthorized", 8, "406/Not Acceptable", 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 2, "406/Not Acceptable", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 183, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
