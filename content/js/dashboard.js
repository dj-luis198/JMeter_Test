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

    var data = {"OkPercent": 96.83397683397683, "KoPercent": 3.166023166023166};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.768324607329843, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.33035714285714285, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e3fa3eb2-bb8e-44e3-8af4-07fd1fda35bc"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d2944df5-9f11-405e-bec1-bf182554efa7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e3333377-2bee-4749-910c-be674d0fa760"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a107afc2-f63d-4ae0-9daf-b1ff389defd4"], "isController": false}, {"data": [0.6578947368421053, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b537e8b5-0525-4eb9-bf44-ea6d7c61f5b6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=43c166d8-e10b-4831-86e0-952b15e440cc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=57a1be42-ad31-4ee6-a75c-ab0e87f559bf"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.72, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=08ca7514-3baf-458a-9cdb-ab56348dd768"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9a45fda7-c920-4abd-82ac-39b2bf7d6d3f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a7de0649-5d06-4a51-86b7-44a4b1a2f51d"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/ec4b1843-1bd7-449e-b0d8-3294a038e6d9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d2944df5-9f11-405e-bec1-bf182554efa7"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b2a3f01e-efde-4a88-aa69-ab87a75c6ba3"], "isController": false}, {"data": [0.21052631578947367, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=253a26e5-0e08-4874-8932-347023a079a5"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/958be8b1-3ff4-401a-afa3-419953fe0c82"], "isController": false}, {"data": [0.2777777777777778, 500, 1500, "register"], "isController": true}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b537e8b5-0525-4eb9-bf44-ea6d7c61f5b6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e3fa3eb2-bb8e-44e3-8af4-07fd1fda35bc"], "isController": false}, {"data": [0.49107142857142855, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2777777777777778, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a107afc2-f63d-4ae0-9daf-b1ff389defd4"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.36, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a7de0649-5d06-4a51-86b7-44a4b1a2f51d"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/08ca7514-3baf-458a-9cdb-ab56348dd768"], "isController": false}, {"data": [0.27884615384615385, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/57a1be42-ad31-4ee6-a75c-ab0e87f559bf"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1e7dd4df-598f-4d27-8634-d0036add9685"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ec4b1843-1bd7-449e-b0d8-3294a038e6d9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9a45fda7-c920-4abd-82ac-39b2bf7d6d3f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/43c166d8-e10b-4831-86e0-952b15e440cc"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e3333377-2bee-4749-910c-be674d0fa760"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/179ea280-d300-4a3d-a2ef-a760ace448d5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2e43c94a-7dd1-4fd7-8633-febab8154cb0"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=958be8b1-3ff4-401a-afa3-419953fe0c82"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/253a26e5-0e08-4874-8932-347023a079a5"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1295, 41, 3.166023166023166, 339.05173745173687, 82, 2689, 100.0, 927.0, 1130.0000000000002, 1811.7199999999993, 5.065261692149432, 761.3257728129901, 3.6840260054251104], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1413.8928571428573, 1032, 2057, 1371.0, 1674.0000000000002, 1828.8999999999999, 2057.0, 0.24544179523141657, 295.3506533929041, 1.20683538963885], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/e3fa3eb2-bb8e-44e3-8af4-07fd1fda35bc", 3, 0, 0.0, 374.3333333333333, 236, 500, 387.0, 500.0, 500.0, 500.0, 0.08245609213094027, 0.036503999120468346, 0.05287711637303136], "isController": false}, {"data": ["deleteBook", 18, 5, 27.77777777777778, 457.8888888888889, 87, 1427, 431.5, 985.1000000000007, 1427.0, 1427.0, 0.09847096474192402, 0.020915463702508276, 0.06562059786919774], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 18, 5, 27.77777777777778, 457.8888888888889, 87, 1427, 431.5, 985.1000000000007, 1427.0, 1427.0, 0.10190967405889247, 0.021645853620907336, 0.06791213793757465], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 105.41176470588233, 84, 256, 86.0, 253.6, 256.0, 256.0, 0.13184529118420338, 0.05857602722993044, 0.07389031829004414], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d2944df5-9f11-405e-bec1-bf182554efa7", 1, 0, 0.0, 207.0, 207, 207, 207.0, 207.0, 207.0, 207.0, 4.830917874396135, 0.8727732487922706, 3.330691425120773], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 97.94117647058823, 85, 253, 88.0, 128.19999999999987, 253.0, 253.0, 0.13183813379244025, 0.09797736310160843, 0.06617656325128349], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 170.47058823529412, 84, 662, 87.0, 478.79999999999984, 662.0, 662.0, 0.13125791408011364, 4.571708321751753, 0.07596642258485439], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 169.47058823529412, 84, 757, 87.0, 687.4, 757.0, 757.0, 0.13116170695388507, 13.915844213646992, 0.07578265444290995], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e3333377-2bee-4749-910c-be674d0fa760", 1, 0, 0.0, 740.0, 740, 740, 740.0, 740.0, 740.0, 740.0, 1.3513513513513513, 0.244140625, 0.9316934121621622], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a107afc2-f63d-4ae0-9daf-b1ff389defd4", 1, 0, 0.0, 213.0, 213, 213, 213.0, 213.0, 213.0, 213.0, 4.694835680751174, 0.8481880868544601, 3.236869131455399], "isController": false}, {"data": ["goToProfile", 19, 6, 31.57894736842105, 217.21052631578945, 84, 684, 190.0, 450.0, 684.0, 684.0, 0.09618402535208416, 0.10936384708258663, 0.062151807500329045], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/b537e8b5-0525-4eb9-bf44-ea6d7c61f5b6", 3, 0, 0.0, 297.0, 190, 461, 240.0, 461.0, 461.0, 461.0, 0.06555657532450504, 0.029662643131856126, 0.042039861129321274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 87.44444444444443, 84, 92, 87.0, 90.2, 92.0, 92.0, 0.10091948867459072, 0.07499973718883157, 0.050656852713612914], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=43c166d8-e10b-4831-86e0-952b15e440cc", 1, 0, 0.0, 1034.0, 1034, 1034, 1034.0, 1034.0, 1034.0, 1034.0, 0.9671179883945842, 0.17472346470019343, 0.6667825193423598], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 115.27777777777776, 84, 262, 87.0, 255.70000000000002, 262.0, 262.0, 0.10091948867459072, 0.04384566326530612, 0.056613905864543616], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 554.7500000000001, 413, 678, 544.0, 678.0, 678.0, 678.0, 0.0455287884220291, 13.386975494129633, 0.025965637146938475], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 875.3749999999999, 590, 1042, 919.0, 1042.0, 1042.0, 1042.0, 0.04552930664557142, 40.9673501516695, 0.025921470482781383], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 173.875, 85, 266, 170.0, 266.0, 266.0, 266.0, 0.045679830071032136, 0.08083188680538109, 0.025293421533471895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 100.43750000000001, 85, 256, 87.5, 155.9000000000001, 256.0, 256.0, 0.07779906446624979, 0.05781746880743759, 0.03905148353091054], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 107.1875, 84, 253, 86.0, 252.3, 253.0, 253.0, 0.07780171261019883, 0.02812144421860336, 0.04396290621003544], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 159.25, 84, 1075, 87.5, 497.50000000000057, 1075.0, 1075.0, 0.07779982106041156, 4.394934874559945, 0.04531991529544482], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 136.0, 85, 699, 86.0, 386.1000000000003, 699.0, 699.0, 0.07780133429288312, 1.4494202432993601, 0.04539677464843522], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 86.37500000000001, 84, 88, 86.5, 88.0, 88.0, 88.0, 0.045680612577014654, 0.03394818962022281, 0.025650734601351005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 658.7142857142857, 84, 1184, 870.5, 1139.0, 1184.0, 1184.0, 0.07260318727992159, 42.00386599817714, 0.03867173117114127], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 216.83333333333334, 84, 931, 87.5, 920.2, 931.0, 931.0, 0.10092062032541294, 10.114017961767905, 0.05836663480191525], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 453.5, 84, 757, 557.5, 753.0, 757.0, 757.0, 0.07260356379778869, 13.730612174450807, 0.038742833639305495], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 177.22222222222223, 84, 663, 86.0, 510.90000000000026, 663.0, 663.0, 0.10092005449682943, 3.3212728611956783, 0.05846486230019231], "isController": false}, {"data": ["deleteBooks", 18, 5, 27.77777777777778, 557.1111111111111, 87, 2611, 288.0, 1921.600000000001, 2611.0, 2611.0, 0.10199398235504105, 0.021663760900606864, 0.06830033225956335], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=57a1be42-ad31-4ee6-a75c-ab0e87f559bf", 1, 0, 0.0, 2611.0, 2611, 2611, 2611.0, 2611.0, 2611.0, 2611.0, 0.38299502106472616, 0.0691934364228265, 0.26405711413251626], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 272.0625, 172, 1163, 180.5, 705.9000000000004, 1163.0, 1163.0, 0.07776465499224784, 5.927585196343603, 0.17365098068520382], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 25, 0, 0.0, 618.52, 115, 1348, 598.0, 1112.2, 1286.7999999999997, 1348.0, 0.11739900163889007, 0.07211325393638852, 0.053081775155084075], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 86.99999999999999, 84, 89, 87.0, 89.0, 89.0, 89.0, 0.07260205774975108, 0.053955240183164624, 0.03644282976891802], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 136.64285714285714, 85, 267, 87.0, 266.5, 267.0, 267.0, 0.07260243425590283, 0.08952747159429761, 0.037486273602273495], "isController": false}, {"data": ["login", 25, 0, 0.0, 2701.5200000000004, 1658, 5237, 2551.0, 4177.400000000001, 4953.499999999999, 5237.0, 0.11326516280734501, 43.51423679384834, 0.2309945658206514], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 132.94444444444443, 87, 259, 94.0, 258.1, 259.0, 259.0, 0.09696760743202841, 0.07850209625112456, 0.03446895420435385], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=08ca7514-3baf-458a-9cdb-ab56348dd768", 1, 0, 0.0, 687.0, 687, 687, 687.0, 687.0, 687.0, 687.0, 1.455604075691412, 0.262975345705968, 1.0035707787481805], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9a45fda7-c920-4abd-82ac-39b2bf7d6d3f", 3, 0, 0.0, 356.0, 187, 442, 439.0, 442.0, 442.0, 442.0, 0.045573312268335664, 0.029299248610013973, 0.02922507329707723], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a7de0649-5d06-4a51-86b7-44a4b1a2f51d", 1, 0, 0.0, 183.0, 183, 183, 183.0, 183.0, 183.0, 183.0, 5.46448087431694, 0.9872353142076503, 3.7675034153005464], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ec4b1843-1bd7-449e-b0d8-3294a038e6d9", 3, 0, 0.0, 1538.0, 206, 2633, 1775.0, 2633.0, 2633.0, 2633.0, 0.02708461232891553, 0.022579326879672096, 0.01736871298436315], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d2944df5-9f11-405e-bec1-bf182554efa7", 3, 0, 0.0, 320.0, 242, 412, 306.0, 412.0, 412.0, 412.0, 0.06360244233378562, 0.02877844884243555, 0.04078672246014247], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 747.7142857142858, 173, 1273, 957.0, 1228.5, 1273.0, 1273.0, 0.07256931665621323, 55.85182345796681, 0.15127381828643108], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b2a3f01e-efde-4a88-aa69-ab87a75c6ba3", 1, 0, 0.0, 328.0, 328, 328, 328.0, 328.0, 328.0, 328.0, 3.048780487804878, 0.973585175304878, 1.8191453887195121], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 19, 11, 57.89473684210526, 467.8421052631579, 84, 1129, 133.0, 1100.0, 1129.0, 1129.0, 0.0992358836955443, 50.00300115100568, 0.1321954992609538], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 288.82352941176475, 171, 843, 178.0, 774.1999999999999, 843.0, 843.0, 0.13106766175291434, 18.62658347323521, 0.29082896200194286], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=253a26e5-0e08-4874-8932-347023a079a5", 1, 0, 0.0, 455.0, 455, 455, 455.0, 455.0, 455.0, 455.0, 2.197802197802198, 0.39706387362637363, 1.5152815934065933], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/958be8b1-3ff4-401a-afa3-419953fe0c82", 3, 0, 0.0, 341.0, 211, 597, 215.0, 597.0, 597.0, 597.0, 0.0636915629909558, 0.028196785699121058, 0.0408438734024033], "isController": false}, {"data": ["register", 27, 8, 29.62962962962963, 1067.9259259259259, 191, 2372, 1036.0, 1895.3999999999999, 2265.1999999999994, 2372.0, 0.11173369308823651, 0.035062265669615886, 0.05041109981129421], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 333.5555555555555, 172, 1022, 259.0, 1004.9, 1022.0, 1022.0, 0.10086972115125975, 13.547320157692997, 0.22399075991325204], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 92.35714285714286, 86, 109, 90.5, 105.5, 109.0, 109.0, 0.07064356285763304, 0.054845344210760025, 0.025111578984549243], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 353.05882352941177, 172, 1144, 339.0, 1036.0, 1144.0, 1144.0, 0.0830625656560721, 11.804374870214742, 0.1843093821000171], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 6, 0, 0.0, 89.5, 85, 105, 87.0, 105.0, 105.0, 105.0, 0.03480561066443911, 0.02586627901917789, 0.017470785040548536], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b537e8b5-0525-4eb9-bf44-ea6d7c61f5b6", 1, 0, 0.0, 322.0, 322, 322, 322.0, 322.0, 322.0, 322.0, 3.105590062111801, 0.5610685170807453, 2.1411587732919255], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 6, 0, 0.0, 86.33333333333334, 84, 89, 86.0, 89.0, 89.0, 89.0, 0.034805408760521385, 0.009313166015998886, 0.019849959683734854], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 6, 0, 0.0, 87.5, 84, 92, 86.0, 92.0, 92.0, 92.0, 0.034805812570699306, 0.009381254169446298, 0.020462010905821275], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 6, 0, 0.0, 88.66666666666667, 85, 93, 88.5, 93.0, 93.0, 93.0, 0.034805408760521385, 0.00938114532998428, 0.020495763166596088], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, 100.0, 97.6, 87, 123, 93.0, 123.0, 123.0, 123.0, 0.04472391924649141, 0.013190062121523833, 0.02764671961233307], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e3fa3eb2-bb8e-44e3-8af4-07fd1fda35bc", 1, 0, 0.0, 254.0, 254, 254, 254.0, 254.0, 254.0, 254.0, 3.937007874015748, 0.7112758366141733, 2.714382381889764], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 982.2321428571429, 668, 1693, 923.5, 1300.5, 1441.15, 1693.0, 0.2585972025324055, 309.37215716244987, 0.5106284604692616], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 27, 8, 29.62962962962963, 1067.9259259259259, 191, 2372, 1036.0, 1895.3999999999999, 2265.1999999999994, 2372.0, 0.11092349975966574, 0.03480802531520761, 0.050045563368130444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 113.33333333333334, 84, 254, 85.0, 254.0, 254.0, 254.0, 0.051600918496349235, 0.013908060063469129, 0.030386087747361904], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 86.0, 85, 87, 86.0, 87.0, 87.0, 87.0, 0.05167513564723107, 0.013928063904917751, 0.030379327792610454], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a107afc2-f63d-4ae0-9daf-b1ff389defd4", 3, 0, 0.0, 425.0, 200, 796, 279.0, 796.0, 796.0, 796.0, 0.07025267545605694, 0.0317875061471091, 0.04505135763295318], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 192.50000000000003, 84, 920, 86.0, 587.0, 920.0, 920.0, 0.06781105901499593, 4.375293835308734, 0.0394492349459449], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 139.42857142857144, 83, 506, 86.5, 379.0, 506.0, 506.0, 0.06775592380362397, 1.4399929793973596, 0.03948332780799907], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 123.14285714285712, 85, 257, 89.0, 255.0, 257.0, 257.0, 0.06780908835524212, 0.050393277576503186, 0.0340369838033149], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 114.16666666666667, 85, 254, 86.5, 254.0, 254.0, 254.0, 0.051600918496349235, 0.013807277019530948, 0.029428648829949174], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 145.64285714285717, 82, 262, 87.5, 257.0, 262.0, 262.0, 0.06775264477288345, 0.02539778969095115, 0.03823373997018884], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 133.33333333333331, 87, 361, 87.5, 361.0, 361.0, 361.0, 0.05167558070433817, 0.03840343448828256, 0.025938719220732244], "isController": false}, {"data": ["deleteAccount", 18, 5, 27.77777777777778, 533.3333333333333, 84, 1775, 430.5, 1260.2000000000007, 1775.0, 1775.0, 0.10325067543150179, 0.021146446384218708, 0.0702510156568177], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 117.83333333333333, 88, 259, 89.5, 259.0, 259.0, 259.0, 0.049702612700674303, 0.039121392418694806, 0.017667725608442816], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 25, 0, 0.0, 1352.96, 761, 2148, 1315.0, 1865.4, 2067.8999999999996, 2148.0, 0.11225914799797035, 0.058102879334886996, 0.05163482295609769], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 248.66666666666666, 173, 616, 175.0, 616.0, 616.0, 616.0, 0.05156233886769104, 0.079911554475611, 0.11596490860575435], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a7de0649-5d06-4a51-86b7-44a4b1a2f51d", 3, 0, 0.0, 523.6666666666666, 197, 690, 684.0, 690.0, 690.0, 690.0, 0.06680324218402066, 0.03022672742050414, 0.04283931871826846], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/08ca7514-3baf-458a-9cdb-ab56348dd768", 3, 0, 0.0, 621.0, 240, 1203, 420.0, 1203.0, 1203.0, 1203.0, 0.02406719561014352, 0.024137704972282615, 0.015433715934890214], "isController": false}, {"data": ["addBook", 52, 12, 23.076923076923077, 1040.2884615384608, 439, 3132, 808.5, 1757.6000000000001, 2302.4999999999936, 3132.0, 0.24863608761553213, 98.32848917566379, 0.8970753433090595], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 162.37500000000006, 84, 402, 89.5, 347.8, 381.15, 402.0, 0.2598113583958504, 0.1930824645891037, 0.12559240469330663], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/57a1be42-ad31-4ee6-a75c-ab0e87f559bf", 3, 0, 0.0, 495.66666666666663, 182, 928, 377.0, 928.0, 928.0, 928.0, 0.0837871805613741, 0.03883884932272029, 0.05373071149280827], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 542.4285714285713, 413, 755, 504.0, 687.3000000000001, 751.0, 755.0, 0.2596740163687371, 76.35278280123345, 0.13059777190419883], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 138.87499999999994, 83, 359, 89.0, 259.0, 347.3, 359.0, 0.2598439080523771, 0.4598019154208079, 0.12636940059578494], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 818.4107142857144, 581, 1348, 826.5, 1011.0, 1060.3, 1348.0, 0.2590601667237216, 233.102793397204, 0.13003606024999306], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 97.94117647058823, 85, 155, 90.0, 139.79999999999998, 155.0, 155.0, 0.08090229857707133, 0.06043970547994099, 0.028758238947318326], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 160, 12, 7.5, 172.62499999999994, 86, 2689, 92.0, 301.30000000000007, 375.4999999999999, 2643.249999999999, 0.6759954032312581, 1.6556441127137835, 0.3187872853714595], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 6, 0, 0.0, 128.66666666666669, 90, 278, 101.5, 278.0, 278.0, 278.0, 0.03694490283490554, 0.02861065229304697, 0.013132758429595331], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 102.05882352941178, 87, 262, 90.0, 157.1999999999999, 262.0, 262.0, 0.13286959240298565, 0.10782678836609481, 0.04723098792449881], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1e7dd4df-598f-4d27-8634-d0036add9685", 1, 0, 0.0, 333.0, 333, 333, 333.0, 333.0, 333.0, 333.0, 3.003003003003003, 0.9589667792792792, 1.7918308933933933], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ec4b1843-1bd7-449e-b0d8-3294a038e6d9", 1, 0, 0.0, 582.0, 582, 582, 582.0, 582.0, 582.0, 582.0, 1.7182130584192439, 0.31041935137457044, 1.1846273625429553], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9a45fda7-c920-4abd-82ac-39b2bf7d6d3f", 1, 0, 0.0, 407.0, 407, 407, 407.0, 407.0, 407.0, 407.0, 2.457002457002457, 0.44389204545454547, 1.6939880221130221], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 6, 0, 0.0, 179.33333333333334, 171, 192, 179.5, 192.0, 192.0, 192.0, 0.03478785208205295, 0.05391437622482229, 0.07823869467282026], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/43c166d8-e10b-4831-86e0-952b15e440cc", 3, 0, 0.0, 825.3333333333334, 243, 1811, 422.0, 1811.0, 1811.0, 1811.0, 0.016316319038424933, 0.022493362997307805, 0.010463264487531612], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 341.7857142857142, 171, 1178, 258.0, 842.0, 1178.0, 1178.0, 0.06772282017172573, 5.884605718647962, 0.15107252993106784], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e3333377-2bee-4749-910c-be674d0fa760", 3, 0, 0.0, 412.0, 386, 450, 400.0, 450.0, 450.0, 450.0, 0.018542669773594003, 0.021916807925755153, 0.01189096987434251], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 105.8125, 88, 260, 90.0, 189.30000000000007, 260.0, 260.0, 0.07868439688409788, 0.0652373564009757, 0.02796984420489417], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 92.85714285714286, 87, 101, 91.5, 99.5, 101.0, 101.0, 0.07379529186037931, 0.05729224319238432, 0.026231920153494206], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/179ea280-d300-4a3d-a2ef-a760ace448d5", 1, 0, 0.0, 196.0, 196, 196, 196.0, 196.0, 196.0, 196.0, 5.1020408163265305, 1.6292649872448979, 3.044284119897959], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2e43c94a-7dd1-4fd7-8633-febab8154cb0", 1, 0, 0.0, 284.0, 284, 284, 284.0, 284.0, 284.0, 284.0, 3.5211267605633805, 1.1244223151408452, 2.1009848151408455], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=958be8b1-3ff4-401a-afa3-419953fe0c82", 1, 0, 0.0, 1845.0, 1845, 1845, 1845.0, 1845.0, 1845.0, 1845.0, 0.5420054200542005, 0.09792090108401084, 0.3736873306233062], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 88.11764705882352, 85, 95, 87.0, 93.4, 95.0, 95.0, 0.08316374452097683, 0.06180430623092126, 0.04174430144900595], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 136.64705882352942, 84, 264, 89.0, 256.0, 264.0, 264.0, 0.0831653718959748, 0.03694858606637575, 0.04660853447938477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 242.23529411764704, 84, 1053, 90.0, 947.3999999999999, 1053.0, 1053.0, 0.08310032653540074, 8.81668304741118, 0.04801373416205541], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 174.23529411764707, 83, 673, 86.0, 664.2, 673.0, 673.0, 0.08316659246902044, 2.8966893581006707, 0.04813323869056647], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/253a26e5-0e08-4874-8932-347023a079a5", 3, 0, 0.0, 787.0, 188, 1672, 501.0, 1672.0, 1672.0, 1672.0, 0.06524434005350035, 0.04135114911593919, 0.04183963213066266], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 19.51219512195122, 0.6177606177606177], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 6, 14.634146341463415, 0.46332046332046334], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 5, 12.195121951219512, 0.3861003861003861], "isController": false}, {"data": ["401/Unauthorized", 22, 53.65853658536585, 1.6988416988416988], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1295, 41, "401/Unauthorized", 22, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 6, "Test failed: code expected to contain /204/", 5, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 18, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 19, 11, "Test failed: code expected to contain /200/", 6, "Test failed: code expected to contain /204/", 5, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 27, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 160, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
