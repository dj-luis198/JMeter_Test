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

    var data = {"OkPercent": 98.5202492211838, "KoPercent": 1.4797507788161994};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.801729873586161, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.33636363636363636, 500, 1500, "see books"], "isController": true}, {"data": [0.6333333333333333, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6333333333333333, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/8400a3fc-28a6-45c5-8fe6-1fe26ea54459"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/882fb010-d2aa-4f3f-8dcb-e2de34e4e9c3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f5c03210-0df6-45b5-99af-a5270d3e0ed3"], "isController": false}, {"data": [0.84375, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=302dfb6d-1015-4592-b359-d91de7893890"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=702cce30-3246-4219-869d-4d572afce1a4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2dfc9de6-5fd3-4a10-809e-0615a8823f6d"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/5a394bb2-4305-49d0-b48d-9a617337f4ad"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7b9411cd-40b6-45ac-8815-4b841cebfdec"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fca50425-1c06-44f7-979a-ec3fbaf2552e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=152a7b5d-1c73-4d10-b026-a7f768cd4f6c"], "isController": false}, {"data": [0.7045454545454546, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/daa0b3d7-8a89-4def-90b0-79a1573983c9"], "isController": false}, {"data": [0.022727272727272728, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b5b4d887-d378-4143-aedb-a370637af0fa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8aea7a58-4091-485e-8e9c-0157ca489cbd"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/60feb799-3944-4feb-9350-46f8d33d7654"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/010b0687-aa02-4932-9d96-b97d6f8ef7de"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7ee81db5-5f94-429b-b6a8-346cea80de18"], "isController": false}, {"data": [0.26, 500, 1500, "register"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f5c03210-0df6-45b5-99af-a5270d3e0ed3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fca50425-1c06-44f7-979a-ec3fbaf2552e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=60feb799-3944-4feb-9350-46f8d33d7654"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=882fb010-d2aa-4f3f-8dcb-e2de34e4e9c3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8400a3fc-28a6-45c5-8fe6-1fe26ea54459"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4909090909090909, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.26, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.2727272727272727, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/702cce30-3246-4219-869d-4d572afce1a4"], "isController": false}, {"data": [0.36607142857142855, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b5b4d887-d378-4143-aedb-a370637af0fa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4909090909090909, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9401197604790419, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7b9411cd-40b6-45ac-8815-4b841cebfdec"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5a394bb2-4305-49d0-b48d-9a617337f4ad"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/302dfb6d-1015-4592-b359-d91de7893890"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8aea7a58-4091-485e-8e9c-0157ca489cbd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/152a7b5d-1c73-4d10-b026-a7f768cd4f6c"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=010b0687-aa02-4932-9d96-b97d6f8ef7de"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7ee81db5-5f94-429b-b6a8-346cea80de18"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1284, 19, 1.4797507788161994, 331.680685358255, 77, 3782, 100.0, 919.5, 1135.75, 1854.550000000007, 5.100784185979994, 725.6911874170726, 3.723170232713347], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 1393.5454545454543, 1000, 2351, 1395.0, 1674.8, 1737.8, 2351.0, 0.24947383699833078, 300.20256106155654, 1.226660907506441], "isController": true}, {"data": ["deleteBook", 15, 1, 6.666666666666667, 818.0, 110, 3202, 565.0, 2146.6000000000004, 3202.0, 3202.0, 0.08146462534418804, 0.015338261490585406, 0.05511060689788138], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 1, 6.666666666666667, 818.0, 110, 3202, 565.0, 2146.6000000000004, 3202.0, 3202.0, 0.08359386755387624, 0.015739157875378263, 0.05655103370783386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 105.1, 79, 247, 81.0, 243.8, 246.9, 247.0, 0.15482152948188976, 0.04142685456839628, 0.08829665353264024], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 107.2, 80, 244, 83.0, 242.9, 243.95, 244.0, 0.1548059507407465, 0.11504621925166804, 0.07770533074291376], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 120.14999999999999, 79, 239, 82.0, 237.8, 238.95, 239.0, 0.15500391384882467, 0.04177839865456603, 0.0912767187996497], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 123.74999999999996, 77, 327, 82.0, 236.0, 322.44999999999993, 327.0, 0.15500511516880058, 0.04177872244784078, 0.09112605403478316], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8400a3fc-28a6-45c5-8fe6-1fe26ea54459", 3, 0, 0.0, 1199.3333333333333, 181, 2611, 806.0, 2611.0, 2611.0, 2611.0, 0.05713632727688264, 0.025294728221536587, 0.0366401577914905], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/882fb010-d2aa-4f3f-8dcb-e2de34e4e9c3", 3, 0, 0.0, 636.3333333333333, 174, 1352, 383.0, 1352.0, 1352.0, 1352.0, 0.023363940094857597, 0.02761538622539972, 0.014982735021767404], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f5c03210-0df6-45b5-99af-a5270d3e0ed3", 1, 0, 0.0, 540.0, 540, 540, 540.0, 540.0, 540.0, 540.0, 1.8518518518518519, 0.33456307870370366, 1.2767650462962963], "isController": false}, {"data": ["goToProfile", 16, 1, 6.25, 470.5625, 82, 3782, 203.0, 1817.800000000002, 3782.0, 3782.0, 0.07685102908331132, 0.15385684844736905, 0.04967829889046327], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 91.6111111111111, 79, 238, 82.0, 109.30000000000021, 238.0, 238.0, 0.10897334996185933, 0.0809850774618896, 0.05469951355507392], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 109.16666666666666, 79, 245, 81.0, 239.60000000000002, 245.0, 245.0, 0.10898192716374534, 0.04734848484848485, 0.06113677988677989], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 566.0, 471, 641, 586.0, 641.0, 641.0, 641.0, 0.06115397551802514, 17.98129930539276, 0.03487687666262371], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 877.8333333333333, 770, 963, 895.0, 963.0, 963.0, 963.0, 0.06099172545591315, 54.88046177724806, 0.03472478119218493], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 106.5, 79, 236, 81.0, 236.0, 236.0, 236.0, 0.06145148405333988, 0.1087403213912616, 0.03402635884594113], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 103.39999999999998, 78, 250, 82.0, 242.20000000000002, 250.0, 250.0, 0.07731321128154378, 0.057456400180912914, 0.03880760800655616], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 101.46666666666667, 77, 240, 80.0, 236.4, 240.0, 240.0, 0.07731281279475509, 0.02068721748609658, 0.04409246354700877], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 111.59999999999998, 78, 241, 82.0, 237.4, 241.0, 241.0, 0.07731400826744461, 0.02083854129083468, 0.04545218064160318], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 111.66666666666667, 79, 240, 81.0, 236.4, 240.0, 240.0, 0.07731440676655688, 0.020838648698798534, 0.04552791726585332], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=302dfb6d-1015-4592-b359-d91de7893890", 1, 0, 0.0, 724.0, 724, 724, 724.0, 724.0, 724.0, 724.0, 1.3812154696132597, 0.2495359979281768, 0.9522833218232044], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=702cce30-3246-4219-869d-4d572afce1a4", 1, 0, 0.0, 576.0, 576, 576, 576.0, 576.0, 576.0, 576.0, 1.736111111111111, 0.31365288628472227, 1.196967230902778], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 108.33333333333333, 80, 237, 82.5, 237.0, 237.0, 237.0, 0.06144707870346665, 0.0456652606380255, 0.03450397485790363], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2dfc9de6-5fd3-4a10-809e-0615a8823f6d", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 1.2981135670731707, 2.42552718495935], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 12, 0, 0.0, 771.4166666666666, 77, 1107, 892.5, 1083.9, 1107.0, 1107.0, 0.059970314694226354, 44.970522794341804, 0.03096123668783952], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 190.83333333333334, 77, 1005, 81.5, 960.9000000000001, 1005.0, 1005.0, 0.10897928788089775, 10.921637932208828, 0.06302730082521538], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 12, 0, 0.0, 561.6666666666667, 80, 724, 651.0, 722.8, 724.0, 724.0, 0.05997151353107274, 14.697374215997401, 0.031020421549763862], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 159.94444444444446, 78, 639, 81.0, 486.0000000000002, 639.0, 639.0, 0.10897994768962511, 3.58652345642013, 0.0631341081504892], "isController": false}, {"data": ["deleteBooks", 15, 1, 6.666666666666667, 442.8, 91, 793, 417.0, 751.6, 793.0, 793.0, 0.08371563473194253, 0.015762084351873557, 0.05732013870285414], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/5a394bb2-4305-49d0-b48d-9a617337f4ad", 3, 0, 0.0, 759.0, 184, 1451, 642.0, 1451.0, 1451.0, 1451.0, 0.06757669955399379, 0.029916768031715998, 0.04333531839888273], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 228.2666666666667, 163, 491, 165.0, 482.6, 491.0, 491.0, 0.07728015085085446, 0.11976914003936136, 0.17380487051710725], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7b9411cd-40b6-45ac-8815-4b841cebfdec", 1, 0, 0.0, 676.0, 676, 676, 676.0, 676.0, 676.0, 676.0, 1.4792899408284024, 0.2672545303254438, 1.0199010724852071], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fca50425-1c06-44f7-979a-ec3fbaf2552e", 1, 0, 0.0, 793.0, 793, 793, 793.0, 793.0, 793.0, 793.0, 1.2610340479192939, 0.22782353404791927, 0.8694238650693569], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=152a7b5d-1c73-4d10-b026-a7f768cd4f6c", 1, 0, 0.0, 417.0, 417, 417, 417.0, 417.0, 417.0, 417.0, 2.398081534772182, 0.43324715227817745, 1.6533648081534773], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 633.2272727272727, 87, 1920, 540.0, 1174.3999999999999, 1814.5499999999984, 1920.0, 0.09390953950176721, 0.05768466830723786, 0.04246105155206857], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 12, 0, 0.0, 81.16666666666666, 79, 84, 81.0, 83.4, 84.0, 84.0, 0.05997001499250375, 0.04456755997001499, 0.03010213643178411], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 12, 0, 0.0, 147.33333333333334, 79, 247, 81.5, 245.5, 247.0, 247.0, 0.05997061439894452, 0.0911077009765215, 0.030004828883846913], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/daa0b3d7-8a89-4def-90b0-79a1573983c9", 2, 0, 0.0, 239.5, 228, 251, 239.5, 251.0, 251.0, 251.0, 0.033719420700352366, 0.02980085520880751, 0.020959386011498323], "isController": false}, {"data": ["login", 22, 0, 0.0, 2744.636363636364, 1441, 4691, 2787.5, 3548.5, 4525.249999999997, 4691.0, 0.09620388226393972, 31.52030865321124, 0.18865834120456004], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b5b4d887-d378-4143-aedb-a370637af0fa", 1, 0, 0.0, 572.0, 572, 572, 572.0, 572.0, 572.0, 572.0, 1.7482517482517483, 0.3158462631118881, 1.2053376311188813], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 87.77777777777776, 82, 100, 85.5, 98.2, 100.0, 100.0, 0.10886262745999298, 0.0881319513323576, 0.03869726210491938], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8aea7a58-4091-485e-8e9c-0157ca489cbd", 1, 0, 0.0, 411.0, 411, 411, 411.0, 411.0, 411.0, 411.0, 2.4330900243309004, 0.43957192822384433, 1.6775015206812653], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 12, 0, 0.0, 854.1666666666667, 161, 1190, 975.5, 1166.9, 1190.0, 1190.0, 0.05994544964082685, 59.77848244035428, 0.12203738348103227], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/60feb799-3944-4feb-9350-46f8d33d7654", 3, 0, 0.0, 511.66666666666663, 257, 812, 466.0, 812.0, 812.0, 812.0, 0.03579653250921761, 0.02984209627477418, 0.022955458672903217], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 264.05, 161, 489, 172.5, 481.6, 488.65, 489.0, 0.15452726247228168, 0.239487075726085, 0.3475354350328757], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, 25.0, 760.25, 81, 1152, 927.5, 1152.0, 1152.0, 1152.0, 0.08125044433836748, 72.90826920049562, 0.15086676133189791], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/010b0687-aa02-4932-9d96-b97d6f8ef7de", 3, 0, 0.0, 1555.6666666666665, 435, 3782, 450.0, 3782.0, 3782.0, 3782.0, 0.06972528238739367, 0.03154887451773346, 0.044713153093478356], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7ee81db5-5f94-429b-b6a8-346cea80de18", 3, 0, 0.0, 281.6666666666667, 190, 449, 206.0, 449.0, 449.0, 449.0, 0.07900142202559646, 0.03574608613788382, 0.05066171920261232], "isController": false}, {"data": ["register", 25, 8, 32.0, 1156.4800000000002, 212, 3337, 1115.0, 2062.600000000002, 3137.1999999999994, 3337.0, 0.0991233530654888, 0.0310225119047147, 0.04472166905884359], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f5c03210-0df6-45b5-99af-a5270d3e0ed3", 3, 0, 0.0, 857.6666666666666, 170, 2222, 181.0, 2222.0, 2222.0, 2222.0, 0.017266982076872602, 0.0238039287420428, 0.011072901917786144], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 90.42105263157896, 81, 133, 85.0, 102.0, 133.0, 133.0, 0.09299502721328165, 0.07219828772906144, 0.033056826079721206], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 320.1111111111112, 161, 1087, 177.5, 1042.9, 1087.0, 1087.0, 0.10891730151334539, 14.628151416227468, 0.24186117355366898], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fca50425-1c06-44f7-979a-ec3fbaf2552e", 3, 0, 0.0, 431.6666666666667, 200, 674, 421.0, 674.0, 674.0, 674.0, 0.02362241925069686, 0.023691625557095388, 0.015148491511677348], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=60feb799-3944-4feb-9350-46f8d33d7654", 1, 0, 0.0, 388.0, 388, 388, 388.0, 388.0, 388.0, 388.0, 2.577319587628866, 0.46562902706185566, 1.7769410438144329], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 13, 0, 0.0, 317.53846153846155, 162, 897, 164.0, 887.8, 897.0, 897.0, 0.1173369918405661, 21.75015492149704, 0.25927491098183986], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=882fb010-d2aa-4f3f-8dcb-e2de34e4e9c3", 1, 0, 0.0, 481.0, 481, 481, 481.0, 481.0, 481.0, 481.0, 2.079002079002079, 0.37560096153846156, 1.4333744802494803], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8400a3fc-28a6-45c5-8fe6-1fe26ea54459", 1, 0, 0.0, 181.0, 181, 181, 181.0, 181.0, 181.0, 181.0, 5.524861878453039, 0.9981439917127072, 3.8091332872928176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 6, 0, 0.0, 85.66666666666667, 78, 103, 83.0, 103.0, 103.0, 103.0, 0.05012154474600907, 0.037248530812219634, 0.025158666015086584], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 6, 0, 0.0, 81.33333333333334, 77, 84, 82.0, 84.0, 84.0, 84.0, 0.05012196344438133, 0.013411540999766098, 0.028585182276873726], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 6, 0, 0.0, 81.66666666666666, 80, 84, 82.0, 84.0, 84.0, 84.0, 0.05012196344438133, 0.013509435459618404, 0.029466232415544493], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 6, 0, 0.0, 80.66666666666666, 78, 82, 81.0, 82.0, 82.0, 82.0, 0.050122800862112175, 0.013509661169866172, 0.02951567277329457], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 91.0, 91, 91, 91.0, 91.0, 91.0, 91.0, 10.989010989010989, 3.2408997252747254, 6.793011675824176], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 987.1454545454545, 620, 1843, 963.0, 1313.6, 1363.3999999999996, 1843.0, 0.25401106564569614, 303.88554304679343, 0.501572631577732], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 8, 32.0, 1156.4800000000002, 212, 3337, 1115.0, 2062.600000000002, 3137.1999999999994, 3337.0, 0.10086908806274865, 0.03156887240463836, 0.04550929559081042], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 100.125, 77, 236, 81.0, 236.0, 236.0, 236.0, 0.03917382405076928, 0.010558569763683906, 0.023068179592396362], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 80.625, 78, 83, 80.5, 83.0, 83.0, 83.0, 0.03917305677155253, 0.010558362957957517, 0.023029472828588495], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 138.21052631578945, 78, 816, 82.0, 241.0, 816.0, 816.0, 0.0946799816619825, 4.508029461981004, 0.05523323354561582], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 152.89473684210526, 78, 648, 86.0, 242.0, 648.0, 648.0, 0.09467950985912686, 1.4893822691439478, 0.05532541876996368], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 100.125, 78, 237, 81.0, 237.0, 237.0, 237.0, 0.03917286495644467, 0.010481801755923672, 0.02234077454547235], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 90.84210526315789, 79, 242, 82.0, 94.0, 242.0, 242.0, 0.09467950985912686, 0.07036240918241751, 0.04752467584725704], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 101.125, 79, 241, 82.0, 241.0, 241.0, 241.0, 0.03917228952239186, 0.02911143781888692, 0.019662653139169352], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 115.78947368421052, 79, 242, 83.0, 240.0, 242.0, 242.0, 0.09467950985912686, 0.03281859655067596, 0.053578402731753016], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 126.37500000000001, 83, 238, 87.0, 238.0, 238.0, 238.0, 0.03861879866572051, 0.0303972184810261, 0.013727776088205336], "isController": false}, {"data": ["deleteAccount", 15, 1, 6.666666666666667, 797.4000000000001, 81, 2222, 610.0, 1759.4000000000003, 2222.0, 2222.0, 0.08130610120983478, 0.015160200121417111, 0.05533684778955813], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1483.2727272727273, 919, 2202, 1461.0, 2086.8, 2185.35, 2202.0, 0.09525417711215313, 0.04930147838812613, 0.043813200605297], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 204.5, 163, 479, 165.0, 479.0, 479.0, 479.0, 0.03915656753528986, 0.06068503191260254, 0.0880640381189185], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/702cce30-3246-4219-869d-4d572afce1a4", 3, 0, 0.0, 377.3333333333333, 177, 549, 406.0, 549.0, 549.0, 549.0, 0.0316906987799081, 0.026419231632599165, 0.020322485871230127], "isController": false}, {"data": ["addBook", 56, 7, 12.5, 977.0714285714287, 415, 4638, 691.5, 1662.7000000000003, 1977.7499999999977, 4638.0, 0.24783147459727387, 80.38538606805407, 0.9004073937311913], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/b5b4d887-d378-4143-aedb-a370637af0fa", 3, 0, 0.0, 423.0, 261, 610, 398.0, 610.0, 610.0, 610.0, 0.026402175539264435, 0.026479525662914626, 0.016931082621207988], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 151.99999999999997, 80, 338, 84.0, 330.8, 333.4, 338.0, 0.2548549875121056, 0.1893990678678832, 0.12319650275243386], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 525.8181818181816, 384, 735, 483.0, 659.4, 705.1999999999999, 735.0, 0.25482900973446815, 74.92818998139748, 0.12816107423169054], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 132.9818181818182, 79, 335, 84.0, 244.8, 300.1999999999999, 335.0, 0.2551848930543312, 0.45155764278754695, 0.1241035905674384], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 832.4545454545454, 536, 1760, 847.0, 1011.4, 1110.1999999999998, 1760.0, 0.25443997760928194, 228.94553911060507, 0.12771694188590912], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 13, 0, 0.0, 116.07692307692308, 81, 331, 84.0, 295.4, 331.0, 331.0, 0.12813057491203345, 0.09572254864033747, 0.04554641530076188], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 167, 7, 4.191616766467066, 177.14371257485033, 79, 3593, 90.0, 289.60000000000014, 357.4, 2599.51999999999, 0.6962220573153344, 1.5286041216762691, 0.33362947307038093], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7b9411cd-40b6-45ac-8815-4b841cebfdec", 3, 0, 0.0, 553.6666666666667, 212, 1223, 226.0, 1223.0, 1223.0, 1223.0, 0.03028161905723226, 0.025244539845563744, 0.019418876804279804], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 6, 0, 0.0, 149.33333333333331, 86, 263, 103.0, 263.0, 263.0, 263.0, 0.0470267346986762, 0.036418164664111546, 0.016716534599920053], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5a394bb2-4305-49d0-b48d-9a617337f4ad", 1, 0, 0.0, 337.0, 337, 337, 337.0, 337.0, 337.0, 337.0, 2.967359050445104, 0.5360951409495549, 2.0458549703264093], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 93.65, 81, 243, 84.0, 96.60000000000001, 235.6999999999999, 243.0, 0.1524994662518681, 0.12375689106963127, 0.054208794644218745], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/302dfb6d-1015-4592-b359-d91de7893890", 3, 0, 0.0, 525.0, 188, 976, 411.0, 976.0, 976.0, 976.0, 0.021579473604707203, 0.025885533930125666, 0.01383839941447695], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8aea7a58-4091-485e-8e9c-0157ca489cbd", 3, 0, 0.0, 376.0, 224, 454, 450.0, 454.0, 454.0, 454.0, 0.024618818624956917, 0.02469094407014722, 0.01578745855832198], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 6, 0, 0.0, 168.83333333333331, 161, 185, 167.5, 185.0, 185.0, 185.0, 0.050087235268091924, 0.0776254320024042, 0.11264736603751534], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/152a7b5d-1c73-4d10-b026-a7f768cd4f6c", 3, 0, 0.0, 346.0, 181, 440, 417.0, 440.0, 440.0, 440.0, 0.01716335509265351, 0.0236610705785767, 0.011006448415536269], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 263.1578947368421, 161, 896, 171.0, 485.0, 896.0, 896.0, 0.09464083801971519, 6.0980784952355815, 0.21157500255281209], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 88.20000000000002, 82, 116, 86.0, 102.2, 116.0, 116.0, 0.07907680466447711, 0.06556270230482526, 0.02810933290807585], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=010b0687-aa02-4932-9d96-b97d6f8ef7de", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 0.7314334514170041, 2.791308198380567], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 12, 0, 0.0, 90.08333333333333, 82, 101, 87.5, 100.4, 101.0, 101.0, 0.05876390133540966, 0.04562236480629949, 0.0208887305528214], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7ee81db5-5f94-429b-b6a8-346cea80de18", 1, 0, 0.0, 208.0, 208, 208, 208.0, 208.0, 208.0, 208.0, 4.807692307692308, 0.8685772235576924, 3.3146784855769234], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 13, 0, 0.0, 81.6923076923077, 78, 89, 81.0, 87.8, 89.0, 89.0, 0.11742283964556367, 0.08726443454128316, 0.05894076130646458], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 13, 0, 0.0, 118.38461538461539, 78, 247, 81.0, 244.2, 247.0, 247.0, 0.11742283964556367, 0.058552644949463016, 0.06545053111253625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 13, 0, 0.0, 234.0, 77, 807, 81.0, 801.0, 807.0, 807.0, 0.11742390028001083, 16.281892867627136, 0.0674799306747358], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 13, 0, 0.0, 165.0, 78, 641, 80.0, 571.8, 641.0, 641.0, 0.11742390028001083, 5.338553427874627, 0.06759460245235299], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 42.10526315789474, 0.6230529595015576], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.2631578947368425, 0.0778816199376947], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.2631578947368425, 0.0778816199376947], "isController": false}, {"data": ["401/Unauthorized", 9, 47.36842105263158, 0.7009345794392523], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1284, 19, "401/Unauthorized", 9, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 167, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
