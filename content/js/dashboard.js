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

    var data = {"OkPercent": 99.76152623211446, "KoPercent": 0.2384737678855326};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6960246744345442, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/495d13c6-3d87-4daf-a493-ff78f30f0b61"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/31023301-97ce-458a-8eeb-20f233cfe3b9"], "isController": false}, {"data": [0.375, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.375, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f9286078-c654-420e-938c-840ea19f1146"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ae35f515-8075-4d7f-b1d0-b859e978ee4a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=990b0e05-4ce8-4464-8349-256f5b46db2f"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5277777777777778, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/6c8ab033-e1d9-4a11-b13a-b3335f2a1b96"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.2894736842105263, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bd1ae863-8f7b-419f-8f21-cd0315183ce4"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6f4614db-0b3b-4b90-bf80-b01f996c1468"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/1f946f8c-f066-4c91-a6ca-1f7b7fc547dd"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/8bad964c-e85f-4d3e-894b-7bfecb8c12e3"], "isController": false}, {"data": [0.4444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/59e7a480-9163-4256-936e-fc327df00100"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0358fac3-9626-43c0-b199-c4100e1cf376"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/c7c4daeb-29a4-485f-a47b-f3b72c456d50"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6654f008-51f3-4dc1-9b54-00db94a9d92f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a0927519-02e8-4edf-85d9-7920cb91925e"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.11904761904761904, 500, 1500, "register"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/990b0e05-4ce8-4464-8349-256f5b46db2f"], "isController": false}, {"data": [0.7380952380952381, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6654f008-51f3-4dc1-9b54-00db94a9d92f"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.32142857142857145, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1f946f8c-f066-4c91-a6ca-1f7b7fc547dd"], "isController": false}, {"data": [0.11904761904761904, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.36363636363636365, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=59e7a480-9163-4256-936e-fc327df00100"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/eb4b1419-e497-47c3-9945-47827a1c26ee"], "isController": false}, {"data": [0.2719298245614035, 500, 1500, "addBook"], "isController": true}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/ae35f515-8075-4d7f-b1d0-b859e978ee4a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=de930d58-4be0-4a3b-9844-42dcf8ed166e"], "isController": false}, {"data": [0.9107142857142857, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=495d13c6-3d87-4daf-a493-ff78f30f0b61"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.38392857142857145, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8382352941176471, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6c8ab033-e1d9-4a11-b13a-b3335f2a1b96"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/8f85277c-26b8-494a-bfb6-d74d655cf7d2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6f4614db-0b3b-4b90-bf80-b01f996c1468"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f9286078-c654-420e-938c-840ea19f1146"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5384615384615384, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/de930d58-4be0-4a3b-9844-42dcf8ed166e"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bd1ae863-8f7b-419f-8f21-cd0315183ce4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/0358fac3-9626-43c0-b199-c4100e1cf376"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1258, 3, 0.2384737678855326, 630.898251192368, 137, 8928, 276.0, 1527.6000000000008, 2171.1499999999996, 4661.13000000004, 5.0567782132448995, 705.4245372638428, 3.6884326952065116], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 2608.8571428571436, 1858, 4622, 2442.0, 3695.2000000000007, 4376.25, 4622.0, 0.25081851936453337, 301.82008848491057, 1.233272700195728], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/495d13c6-3d87-4daf-a493-ff78f30f0b61", 3, 0, 0.0, 1756.3333333333333, 391, 4050, 828.0, 4050.0, 4050.0, 4050.0, 0.01991978964702133, 0.027461038136437278, 0.012774083855674483], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/31023301-97ce-458a-8eeb-20f233cfe3b9", 1, 0, 0.0, 352.0, 352, 352, 352.0, 352.0, 352.0, 352.0, 2.840909090909091, 0.9072043678977273, 1.6951127485795456], "isController": false}, {"data": ["deleteBook", 12, 0, 0.0, 1631.8333333333333, 484, 4459, 1205.5, 3985.6000000000017, 4459.0, 4459.0, 0.08180851353930899, 0.014779858403097815, 0.05560422404624908], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 0, 0.0, 1631.8333333333333, 484, 4459, 1205.5, 3985.6000000000017, 4459.0, 4459.0, 0.08191182192369914, 0.014798522515512051, 0.05567444146376426], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 217.25, 139, 451, 145.0, 449.6, 451.0, 451.0, 0.09419355598335129, 0.025204135097107668, 0.05371976239675503], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 162.875, 140, 421, 145.5, 235.50000000000017, 421.0, 421.0, 0.09418967445693766, 0.06999838111497027, 0.047278801436392535], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 286.875, 141, 436, 284.5, 435.3, 436.0, 436.0, 0.0941913379290857, 0.02538750905119888, 0.055466188253162775], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 178.375, 140, 421, 143.5, 420.3, 421.0, 421.0, 0.09419244694316074, 0.025387807965148793, 0.05537485650369411], "isController": false}, {"data": ["goToProfile", 13, 0, 0.0, 1001.1538461538461, 252, 5391, 485.0, 4226.5999999999985, 5391.0, 5391.0, 0.08739143295060367, 0.2162399646904999, 0.05649719591142542], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f9286078-c654-420e-938c-840ea19f1146", 3, 0, 0.0, 693.3333333333334, 252, 1187, 641.0, 1187.0, 1187.0, 1187.0, 0.02907173936216604, 0.029156910473578636, 0.01864300994253486], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 21, 0, 0.0, 160.90476190476193, 139, 435, 147.0, 162.6, 407.89999999999964, 435.0, 0.10215796540250238, 0.07592012858525812, 0.05127850997742796], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ae35f515-8075-4d7f-b1d0-b859e978ee4a", 1, 0, 0.0, 507.0, 507, 507, 507.0, 507.0, 507.0, 507.0, 1.9723865877712032, 0.3563393737672584, 1.3598680966469427], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 21, 0, 0.0, 199.19047619047618, 139, 436, 145.0, 434.4, 435.9, 436.0, 0.10215846236920069, 0.03464190418509168, 0.057853690231218655], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 1, 0, 0.0, 1110.0, 1110, 1110, 1110.0, 1110.0, 1110.0, 1110.0, 0.9009009009009009, 264.8947775900901, 0.513795045045045], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=990b0e05-4ce8-4464-8349-256f5b46db2f", 1, 0, 0.0, 328.0, 328, 328, 328.0, 328.0, 328.0, 328.0, 3.048780487804878, 0.550805068597561, 2.1019912347560976], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 1, 0, 0.0, 1577.0, 1577, 1577, 1577.0, 1577.0, 1577.0, 1577.0, 0.6341154090044389, 570.5781596781865, 0.3610246908687381], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 1, 0, 0.0, 144.0, 144, 144, 144.0, 144.0, 144.0, 144.0, 6.944444444444444, 12.288411458333334, 3.8452148437500004], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 145.14285714285714, 139, 156, 146.0, 152.5, 156.0, 156.0, 0.06499837504062399, 0.048304456451088724, 0.03262613747156321], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 206.00000000000003, 141, 436, 147.5, 429.0, 436.0, 436.0, 0.06499837504062399, 0.017392143321416965, 0.037069385765355865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 164.21428571428572, 138, 434, 145.0, 294.0, 434.0, 434.0, 0.06500048750365628, 0.017519662647469854, 0.03821317722382918], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 185.14285714285714, 138, 436, 145.5, 429.0, 436.0, 436.0, 0.06499897858747934, 0.01751925594740654, 0.03827576571118168], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 1, 0, 0.0, 140.0, 140, 140, 140.0, 140.0, 140.0, 140.0, 7.142857142857142, 5.308314732142857, 4.010881696428571], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 21, 0, 0.0, 230.28571428571428, 138, 1526, 145.0, 492.0000000000003, 1431.1999999999987, 1526.0, 0.10194422194713464, 4.394244437061579, 0.059514869899754845], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 907.4444444444445, 138, 1744, 1263.0, 1619.8000000000002, 1744.0, 1744.0, 0.09562057754828839, 47.81121219335012, 0.05164922255158199], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 21, 0, 0.0, 278.6190476190476, 139, 717, 146.0, 578.4, 703.4999999999998, 717.0, 0.10195115083430024, 1.45364780307407, 0.059618476643476824], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 650.0555555555555, 139, 1151, 842.5, 1150.1, 1151.0, 1151.0, 0.09562108551181187, 15.631329086606142, 0.05174287689316469], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6c8ab033-e1d9-4a11-b13a-b3335f2a1b96", 3, 0, 0.0, 1848.0, 431, 3676, 1437.0, 3676.0, 3676.0, 3676.0, 0.01890454465253447, 0.022344531781690317, 0.012123031564288055], "isController": false}, {"data": ["deleteBooks", 12, 0, 0.0, 1235.6666666666665, 263, 3635, 810.5, 3424.4000000000005, 3635.0, 3635.0, 0.08203557609483313, 0.014820880446820438, 0.056559684299757995], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 354.5714285714285, 288, 579, 297.5, 577.5, 579.0, 579.0, 0.06495344230046535, 0.10066514934652199, 0.1460818140800505], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 19, 0, 0.0, 1450.8421052631581, 525, 2880, 1267.0, 2324.0, 2880.0, 2880.0, 0.0825351317304142, 0.05069784947112356, 0.03731813085076345], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 160.66666666666666, 139, 434, 144.0, 184.7000000000004, 434.0, 434.0, 0.0956231174198758, 0.07106366441066941, 0.04799832261114859], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 291.2222222222223, 138, 466, 296.5, 444.40000000000003, 466.0, 466.0, 0.09547349549683347, 0.10521146053231778, 0.049995126873667355], "isController": false}, {"data": ["login", 19, 0, 0.0, 6736.736842105263, 3988, 11326, 5841.0, 10822.0, 11326.0, 11326.0, 0.08176896394419053, 5.265923799663887, 0.1305084106372815], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 21, 0, 0.0, 176.14285714285714, 145, 574, 150.0, 240.80000000000007, 542.3999999999995, 574.0, 0.099846901417826, 0.08083308718298608, 0.03549245323836783], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bd1ae863-8f7b-419f-8f21-cd0315183ce4", 3, 0, 0.0, 529.6666666666666, 431, 674, 484.0, 674.0, 674.0, 674.0, 0.027379507351397724, 0.027459720751841273, 0.017557822097087734], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6f4614db-0b3b-4b90-bf80-b01f996c1468", 3, 0, 0.0, 573.0, 490, 719, 510.0, 719.0, 719.0, 719.0, 0.03020357207579083, 0.030292059103356625, 0.01936882714495701], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1f946f8c-f066-4c91-a6ca-1f7b7fc547dd", 3, 0, 0.0, 2918.0, 406, 7865, 483.0, 7865.0, 7865.0, 7865.0, 0.014961548819533798, 0.020625702881095585, 0.009594482804193222], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8bad964c-e85f-4d3e-894b-7bfecb8c12e3", 1, 0, 0.0, 1480.0, 1480, 1480, 1480.0, 1480.0, 1480.0, 1480.0, 0.6756756756756757, 0.21576752533783783, 0.40316195101351354], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 1102.2222222222224, 283, 1884, 1404.5, 1775.1000000000001, 1884.0, 1884.0, 0.09540214654829733, 63.47356565522724, 0.20100081158076055], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/59e7a480-9163-4256-936e-fc327df00100", 3, 0, 0.0, 3280.3333333333335, 2174, 5391, 2276.0, 5391.0, 5391.0, 5391.0, 0.01952769026479548, 0.02308106879930742, 0.012522639915900748], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0358fac3-9626-43c0-b199-c4100e1cf376", 1, 0, 0.0, 263.0, 263, 263, 263.0, 263.0, 263.0, 263.0, 3.802281368821293, 0.6869355988593155, 2.6214947718631176], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c7c4daeb-29a4-485f-a47b-f3b72c456d50", 1, 0, 0.0, 1050.0, 1050, 1050, 1050.0, 1050.0, 1050.0, 1050.0, 0.9523809523809523, 0.30412946428571425, 0.5682663690476191], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6654f008-51f3-4dc1-9b54-00db94a9d92f", 3, 0, 0.0, 569.3333333333334, 485, 666, 557.0, 666.0, 666.0, 666.0, 0.05786032517502748, 0.03787666468977222, 0.03710444029778781], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a0927519-02e8-4edf-85d9-7920cb91925e", 2, 0, 0.0, 282.0, 255, 309, 282.0, 309.0, 309.0, 309.0, 0.019853284229543675, 0.0228584200260078, 0.012340444738383347], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 470.81250000000006, 283, 872, 561.0, 679.5000000000002, 872.0, 872.0, 0.0941071292032067, 0.1458476699662979, 0.21164913921385256], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 1, 0, 0.0, 1718.0, 1718, 1718, 1718.0, 1718.0, 1718.0, 1718.0, 0.5820721769499417, 696.3606846623982, 1.3125045474388823], "isController": false}, {"data": ["register", 21, 2, 9.523809523809524, 2378.3809523809523, 633, 5240, 2234.0, 5095.2, 5229.099999999999, 5240.0, 0.08296755178558024, 0.026621842788341874, 0.03743262590325984], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/990b0e05-4ce8-4464-8349-256f5b46db2f", 3, 0, 0.0, 626.0, 413, 755, 710.0, 755.0, 755.0, 755.0, 0.07290046656298602, 0.03298556267010109, 0.04674932263316485], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 21, 0, 0.0, 508.8095238095238, 284, 1667, 311.0, 959.8000000000002, 1602.099999999999, 1667.0, 0.1018705371002794, 5.953817477103384, 0.22786805734098495], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 381.6153846153846, 141, 1968, 153.0, 1563.5999999999997, 1968.0, 1968.0, 0.08254177883882766, 0.06408272868834763, 0.029341022946614514], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6654f008-51f3-4dc1-9b54-00db94a9d92f", 1, 0, 0.0, 1619.0, 1619, 1619, 1619.0, 1619.0, 1619.0, 1619.0, 0.6176652254478073, 0.11158990889437925, 0.42585121988882024], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 501.0666666666666, 279, 1667, 296.0, 1026.2000000000003, 1667.0, 1667.0, 0.08665060742075803, 7.036288823082566, 0.1934012222790265], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 218.88888888888889, 141, 506, 148.0, 506.0, 506.0, 506.0, 0.05113055334621065, 0.03799838974264288, 0.025665141035109647], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 205.33333333333334, 138, 434, 145.0, 434.0, 434.0, 434.0, 0.051237382794486856, 0.013710002818056054, 0.02922131987498079], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 208.66666666666669, 140, 438, 145.0, 438.0, 438.0, 438.0, 0.05123621603465845, 0.013809761353091535, 0.030121291067250377], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 213.1111111111111, 139, 480, 146.0, 480.0, 480.0, 480.0, 0.051237382794486856, 0.013810075831326537, 0.03017201350105037], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1560.6785714285713, 1115, 3035, 1436.5, 2229.9, 2345.35, 3035.0, 0.2534682146332632, 303.2361045103764, 0.5005007128793536], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1f946f8c-f066-4c91-a6ca-1f7b7fc547dd", 1, 0, 0.0, 3635.0, 3635, 3635, 3635.0, 3635.0, 3635.0, 3635.0, 0.2751031636863824, 0.04970125515818432, 0.18967073590096287], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 2, 9.523809523809524, 2378.3809523809523, 633, 5240, 2234.0, 5095.2, 5229.099999999999, 5240.0, 0.08574438374286485, 0.027512846346064334, 0.03868545438398785], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 141.57142857142858, 137, 145, 142.0, 145.0, 145.0, 145.0, 0.036096987448561796, 0.009729266148245172, 0.021256331476057384], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 187.42857142857144, 139, 427, 144.0, 427.0, 427.0, 427.0, 0.036097173591307805, 0.00972931631953218, 0.02122118994332744], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 601.4615384615385, 138, 1915, 146.0, 1783.0, 1915.0, 1915.0, 0.08701530800072291, 24.107476037322872, 0.04885459825701645], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 435.46153846153845, 140, 1143, 151.0, 1131.8, 1143.0, 1143.0, 0.08701123114198894, 7.888294939627592, 0.04893728121695246], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 189.57142857142856, 138, 436, 145.0, 436.0, 436.0, 436.0, 0.03609829048810046, 0.009659112884511255, 0.020587306293994793], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 166.76923076923077, 138, 421, 146.0, 315.7999999999999, 421.0, 421.0, 0.08685137058143652, 0.06454481739499335, 0.043595316873885126], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 187.42857142857142, 142, 436, 147.0, 436.0, 436.0, 436.0, 0.03609642903184221, 0.026825568841046796, 0.01811871535387392], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 231.53846153846152, 139, 444, 144.0, 439.6, 444.0, 444.0, 0.0870118135269904, 0.06349404722064188, 0.047375422509286835], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 288.57142857142856, 143, 943, 151.0, 943.0, 943.0, 943.0, 0.035735252826913755, 0.028127552518059068, 0.012702765653316997], "isController": false}, {"data": ["deleteAccount", 11, 0, 0.0, 2202.2727272727275, 484, 7865, 1187.0, 7102.000000000003, 7865.0, 7865.0, 0.08449124747486386, 0.01526453201450177, 0.057510155751933696], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=59e7a480-9163-4256-936e-fc327df00100", 1, 0, 0.0, 2933.0, 2933, 2933, 2933.0, 2933.0, 2933.0, 2933.0, 0.34094783498124787, 0.06159702096829185, 0.23506755028980567], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 19, 0, 0.0, 4361.736842105263, 1784, 8928, 4037.0, 7560.0, 8928.0, 8928.0, 0.08166247609223562, 0.04226671125867664, 0.03756154906195603], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 378.7142857142857, 285, 872, 293.0, 872.0, 872.0, 872.0, 0.03606945947338589, 0.05590061736744474, 0.08112105973360129], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eb4b1419-e497-47c3-9945-47827a1c26ee", 1, 0, 0.0, 481.0, 481, 481, 481.0, 481.0, 481.0, 481.0, 2.079002079002079, 0.663900077962578, 1.2404983108108107], "isController": false}, {"data": ["addBook", 57, 1, 1.7543859649122806, 2089.2982456140353, 845, 8538, 1312.0, 4776.6, 5673.599999999985, 8538.0, 0.27502882977645465, 93.37653791477483, 0.9999386311766891], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ae35f515-8075-4d7f-b1d0-b859e978ee4a", 3, 0, 0.0, 2262.0, 385, 3921, 2480.0, 3921.0, 3921.0, 3921.0, 0.01640034331385337, 0.022609197244195644, 0.010517147242282272], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=de930d58-4be0-4a3b-9844-42dcf8ed166e", 1, 0, 0.0, 604.0, 604, 604, 604.0, 604.0, 604.0, 604.0, 1.6556291390728477, 0.29911268625827814, 1.1414786837748345], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 242.69642857142856, 140, 706, 148.0, 574.0, 598.1999999999999, 706.0, 0.2549638270070434, 0.18947995346910157, 0.12324911559422506], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 946.4642857142854, 683, 1306, 866.0, 1259.0, 1301.15, 1306.0, 0.2546982735095603, 74.88974919042334, 0.12809532310295269], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=495d13c6-3d87-4daf-a493-ff78f30f0b61", 1, 0, 0.0, 708.0, 708, 708, 708.0, 708.0, 708.0, 708.0, 1.4124293785310735, 0.255175229519774, 0.9738038488700566], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 226.3214285714286, 139, 469, 150.5, 440.0, 446.74999999999994, 469.0, 0.25548960476670607, 0.45209683968483527, 0.1242517804431832], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1307.3749999999998, 959, 2328, 1284.5, 1666.9000000000005, 1844.1, 2328.0, 0.25415036624883136, 228.6849462993891, 0.1275715705584954], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 357.3333333333333, 146, 2551, 162.0, 1288.6000000000008, 2551.0, 2551.0, 0.08758612635758496, 0.06543299478862548, 0.03113413085367278], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 1, 0.5882352941176471, 467.7647058823531, 140, 6352, 162.0, 947.7, 2012.5999999999997, 4238.329999999976, 0.7210539263507036, 1.5385686973524597, 0.34694507080113335], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 248.44444444444446, 148, 599, 155.0, 599.0, 599.0, 599.0, 0.04917656572721212, 0.03808302404460861, 0.017480732348344935], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6c8ab033-e1d9-4a11-b13a-b3335f2a1b96", 1, 0, 0.0, 1863.0, 1863, 1863, 1863.0, 1863.0, 1863.0, 1863.0, 0.5367686527106817, 0.0969748054213634, 0.3700768250134192], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 187.0, 140, 734, 149.0, 338.5000000000004, 734.0, 734.0, 0.08977113970072546, 0.07285138387822546, 0.031910834815492256], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8f85277c-26b8-494a-bfb6-d74d655cf7d2", 1, 0, 0.0, 623.0, 623, 623, 623.0, 623.0, 623.0, 623.0, 1.6051364365971108, 0.5125777487961477, 0.9577523073836276], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6f4614db-0b3b-4b90-bf80-b01f996c1468", 1, 0, 0.0, 941.0, 941, 941, 941.0, 941.0, 941.0, 941.0, 1.0626992561105206, 0.19199156482465463, 0.7326813230605739], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f9286078-c654-420e-938c-840ea19f1146", 1, 0, 0.0, 514.0, 514, 514, 514.0, 514.0, 514.0, 514.0, 1.9455252918287937, 0.3514865029182879, 1.3413484922178989], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 498.1111111111111, 281, 942, 294.0, 942.0, 942.0, 942.0, 0.05108875820258396, 0.07917759694091869, 0.1148998145903817], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 857.6923076923077, 286, 2071, 568.0, 1932.1999999999998, 2071.0, 2071.0, 0.08676673763740847, 32.032536640175, 0.18830963169188464], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/de930d58-4be0-4a3b-9844-42dcf8ed166e", 3, 0, 0.0, 666.6666666666666, 539, 910, 551.0, 910.0, 910.0, 910.0, 0.027491912795652614, 0.027572455508921123, 0.017629905015441292], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 285.14285714285717, 145, 729, 176.5, 718.0, 729.0, 729.0, 0.06892884573724324, 0.05714901370206983, 0.02450205063316068], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 232.55555555555554, 144, 621, 162.5, 505.8000000000002, 621.0, 621.0, 0.09102355993142891, 0.07066770522020116, 0.032356031069375124], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bd1ae863-8f7b-419f-8f21-cd0315183ce4", 1, 0, 0.0, 913.0, 913, 913, 913.0, 913.0, 913.0, 913.0, 1.095290251916758, 0.1978795865279299, 0.7551512869660459], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 145.8, 138, 151, 147.0, 150.4, 151.0, 151.0, 0.08741921008001771, 0.06496681530360691, 0.0438803456846964], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 183.13333333333333, 139, 439, 146.0, 428.2, 439.0, 439.0, 0.08741513447361521, 0.03214327340540225, 0.04936451018386317], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0358fac3-9626-43c0-b199-c4100e1cf376", 2, 0, 0.0, 681.5, 505, 858, 681.5, 858.0, 858.0, 858.0, 0.13677084045681462, 0.07846959840661971, 0.08501429682691651], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 311.5333333333333, 137, 1521, 145.0, 873.0000000000005, 1521.0, 1521.0, 0.08672475297899526, 5.224155707428264, 0.05048780866784997], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 324.4666666666667, 140, 1098, 147.0, 707.4000000000002, 1098.0, 1098.0, 0.08693737031842261, 1.7260350799534014, 0.05069648606393953], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 2, 66.66666666666667, 0.1589825119236884], "isController": false}, {"data": ["401/Unauthorized", 1, 33.333333333333336, 0.0794912559618442], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1258, 3, "406/Not Acceptable", 2, "401/Unauthorized", 1, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 2, "406/Not Acceptable", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
