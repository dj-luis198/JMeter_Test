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

    var data = {"OkPercent": 97.73413897280967, "KoPercent": 2.2658610271903323};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7167741935483871, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f2f9525f-756d-4fb3-aca1-a2dd179c8ed7"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1d760ea5-2b3c-4732-b5e7-169d5e9d0339"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2dce7d67-6d9c-4a80-b72b-a6f761f919e6"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=984bead0-babb-4a3a-beb3-a4c9c99fdffa"], "isController": false}, {"data": [0.46875, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.46875, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9552a4a8-2ebf-4c56-bcd8-db8e0c0d2196"], "isController": false}, {"data": [0.78125, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ccb2f11d-c174-4497-a9d5-f27cf704a121"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7e8fb90e-1442-4a26-9c4d-918176a7171f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=300e0b17-7ebe-4960-b13e-56d5d18110d5"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.625, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4b25ed30-bf95-4c24-aaed-3d26edbcbe6e"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/aaeab5a0-8171-43c2-8424-7eb04f10fe6c"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e43549e6-9d9f-433d-9d00-2d3bb7e67ab4"], "isController": false}, {"data": [0.6458333333333334, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/1f289e6c-fde1-43e6-9794-52f42cd7969b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.4117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ae533931-a1bc-4a80-934c-0afa8cf5b6c0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e1fbc11b-e617-4926-bd72-86e9d522e18d"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.07692307692307693, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.22, 500, 1500, "register"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cfd0ea3c-1449-4b09-9046-ea6cf28327f4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/7e8fb90e-1442-4a26-9c4d-918176a7171f"], "isController": false}, {"data": [0.8157894736842105, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/300e0b17-7ebe-4960-b13e-56d5d18110d5"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f2f9525f-756d-4fb3-aca1-a2dd179c8ed7"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.23214285714285715, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.22, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/984bead0-babb-4a3a-beb3-a4c9c99fdffa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.4666666666666667, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1d760ea5-2b3c-4732-b5e7-169d5e9d0339"], "isController": false}, {"data": [0.1875, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4b25ed30-bf95-4c24-aaed-3d26edbcbe6e"], "isController": false}, {"data": [0.22413793103448276, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=aaeab5a0-8171-43c2-8424-7eb04f10fe6c"], "isController": false}, {"data": [0.9107142857142857, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/80962f90-b7d5-424c-8ee7-0ad60c2d8799"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2dce7d67-6d9c-4a80-b72b-a6f761f919e6"], "isController": false}, {"data": [0.9821428571428571, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.3482142857142857, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9156976744186046, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/76b41760-1299-4050-9f65-151407d30fee"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e1fbc11b-e617-4926-bd72-86e9d522e18d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ae533931-a1bc-4a80-934c-0afa8cf5b6c0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ccb2f11d-c174-4497-a9d5-f27cf704a121"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1f289e6c-fde1-43e6-9794-52f42cd7969b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cfd0ea3c-1449-4b09-9046-ea6cf28327f4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1324, 30, 2.2658610271903323, 504.7726586102722, 136, 3562, 166.0, 1371.5, 1731.5, 2284.5, 5.205548391155286, 746.523136634096, 3.7964585180405277], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 2384.3928571428573, 1741, 3433, 2373.5, 2895.1, 3106.4, 3433.0, 0.2510715374544933, 302.1234827124917, 1.234516788167357], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/f2f9525f-756d-4fb3-aca1-a2dd179c8ed7", 3, 0, 0.0, 606.3333333333334, 349, 1014, 456.0, 1014.0, 1014.0, 1014.0, 0.030866420421223752, 0.025732064680583994, 0.019793895908141533], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1d760ea5-2b3c-4732-b5e7-169d5e9d0339", 3, 0, 0.0, 492.33333333333337, 240, 841, 396.0, 841.0, 841.0, 841.0, 0.016797782692684567, 0.023157099512864304, 0.0107720155939416], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2dce7d67-6d9c-4a80-b72b-a6f761f919e6", 1, 0, 0.0, 1054.0, 1054, 1054, 1054.0, 1054.0, 1054.0, 1054.0, 0.9487666034155597, 0.17140802893738138, 0.6541300996204933], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=984bead0-babb-4a3a-beb3-a4c9c99fdffa", 1, 0, 0.0, 1043.0, 1043, 1043, 1043.0, 1043.0, 1043.0, 1043.0, 0.9587727708533077, 0.17321578379674019, 0.661028883029722], "isController": false}, {"data": ["deleteBook", 16, 3, 18.75, 723.9374999999999, 148, 1148, 866.5, 1094.1000000000001, 1148.0, 1148.0, 0.08708430849616285, 0.01759864168889131, 0.05840878088771567], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, 18.75, 723.9374999999999, 148, 1148, 866.5, 1094.1000000000001, 1148.0, 1148.0, 0.0899558654035364, 0.01817894716498468, 0.06033477813229134], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 226.8888888888889, 136, 448, 147.0, 446.2, 448.0, 448.0, 0.08028366896367164, 0.034880187774581295, 0.04503760509355277], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 161.6111111111111, 137, 439, 145.5, 186.1000000000004, 439.0, 439.0, 0.08028366896367164, 0.05966393757944738, 0.04029863852278049], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 303.11111111111114, 140, 1123, 149.0, 893.5000000000003, 1123.0, 1123.0, 0.08028617561262813, 2.642213160911337, 0.04651127295961605], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 315.1666666666667, 137, 1519, 145.5, 1296.7000000000003, 1519.0, 1519.0, 0.08028617561262813, 8.046084334494509, 0.046432868491244346], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9552a4a8-2ebf-4c56-bcd8-db8e0c0d2196", 1, 0, 0.0, 337.0, 337, 337, 337.0, 337.0, 337.0, 337.0, 2.967359050445104, 0.947584384272997, 1.7705628709198813], "isController": false}, {"data": ["goToProfile", 16, 3, 18.75, 326.25, 137, 559, 344.5, 496.00000000000006, 559.0, 559.0, 0.088036887455844, 0.14260320777530786, 0.05689835212829176], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ccb2f11d-c174-4497-a9d5-f27cf704a121", 3, 0, 0.0, 423.6666666666667, 340, 469, 462.0, 469.0, 469.0, 469.0, 0.07041592338747535, 0.031861371584827713, 0.045156044620223455], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 161.45000000000002, 139, 428, 147.0, 157.70000000000002, 414.49999999999983, 428.0, 0.10749162908938466, 0.07988391575881028, 0.05395575913275753], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 189.6, 140, 462, 146.0, 430.0, 460.45, 462.0, 0.1074956732991497, 0.04490883695056274, 0.06040333048469799], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 1003.4285714285714, 687, 1287, 1141.0, 1287.0, 1287.0, 1287.0, 0.060064182869695046, 17.66086408226219, 0.03425535429287296], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1529.857142857143, 1251, 1815, 1604.0, 1815.0, 1815.0, 1815.0, 0.05986641237695314, 53.86790309071044, 0.03408410001539422], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 309.7142857142857, 141, 448, 424.0, 448.0, 448.0, 448.0, 0.0606249566964595, 0.10727775540428186, 0.03356870160829349], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 172.0, 145, 425, 147.0, 344.60000000000025, 425.0, 425.0, 0.08019353372806372, 0.059596952311578605, 0.040253394859594484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 144.75, 139, 150, 145.0, 150.0, 150.0, 150.0, 0.08019406964854948, 0.021458178792678282, 0.04573568034643838], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 192.41666666666666, 140, 439, 144.5, 433.90000000000003, 439.0, 439.0, 0.0801913901177477, 0.021614085617674184, 0.04714376645594152], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 221.41666666666669, 137, 469, 147.0, 463.6, 469.0, 469.0, 0.08003041155639143, 0.021570696864808624, 0.04712728336767971], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7e8fb90e-1442-4a26-9c4d-918176a7171f", 1, 0, 0.0, 429.0, 429, 429, 429.0, 429.0, 429.0, 429.0, 2.331002331002331, 0.4211283508158508, 1.6071168414918415], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 226.42857142857144, 139, 439, 149.0, 439.0, 439.0, 439.0, 0.0606260068247562, 0.04505506952503854, 0.034042923754135555], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=300e0b17-7ebe-4960-b13e-56d5d18110d5", 1, 0, 0.0, 657.0, 657, 657, 657.0, 657.0, 657.0, 657.0, 1.5220700152207, 0.2749833523592085, 1.0493959284627092], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 1035.235294117647, 136, 1939, 1300.0, 1821.3999999999999, 1939.0, 1939.0, 0.12579640222289643, 66.59738711160361, 0.0675953323984934], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 317.3, 137, 1287, 147.5, 1203.0000000000018, 1287.0, 1287.0, 0.10750087344459675, 9.699024849498779, 0.06227492004622538], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 729.1176470588234, 138, 1316, 838.0, 1289.6, 1316.0, 1316.0, 0.12604917400717738, 21.81554371681941, 0.06785425147180947], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 265.40000000000003, 139, 1134, 149.0, 667.7000000000005, 1111.9499999999998, 1134.0, 0.10732607809045441, 3.1817780107648055, 0.062278472266941415], "isController": false}, {"data": ["deleteBooks", 16, 3, 18.75, 476.625, 142, 1054, 427.0, 1046.3, 1054.0, 1054.0, 0.09012916636154188, 0.018213969105411693, 0.06093510594401852], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4b25ed30-bf95-4c24-aaed-3d26edbcbe6e", 1, 0, 0.0, 396.0, 396, 396, 396.0, 396.0, 396.0, 396.0, 2.5252525252525255, 0.456222380050505, 1.7410432449494948], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aaeab5a0-8171-43c2-8424-7eb04f10fe6c", 3, 0, 0.0, 801.0, 308, 1603, 492.0, 1603.0, 1603.0, 1603.0, 0.023838470523731198, 0.023908309792843693, 0.015287040016845853], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 396.5833333333333, 290, 865, 302.0, 790.3000000000003, 865.0, 865.0, 0.07995202878273036, 0.12391002898261043, 0.1798139866080352], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e43549e6-9d9f-433d-9d00-2d3bb7e67ab4", 1, 0, 0.0, 248.0, 248, 248, 248.0, 248.0, 248.0, 248.0, 4.032258064516129, 1.2876449092741935, 2.4059664818548385], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 672.2916666666667, 287, 1396, 630.5, 1038.5, 1311.5, 1396.0, 0.10505857015286023, 0.06453304748647372, 0.04750206834059989], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 161.52941176470586, 139, 431, 145.0, 206.9999999999998, 431.0, 431.0, 0.12605291256376794, 0.09367799459084707, 0.06327265337673509], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 250.35294117647058, 144, 466, 148.0, 450.8, 466.0, 466.0, 0.12605291256376794, 0.14509698195960374, 0.06566221341499584], "isController": false}, {"data": ["login", 24, 0, 0.0, 3403.2500000000005, 2221, 4892, 3353.5, 4479.0, 4824.25, 4892.0, 0.09951321452561221, 34.858759100017, 0.19827327728113311], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/1f289e6c-fde1-43e6-9794-52f42cd7969b", 3, 0, 0.0, 472.0, 319, 559, 538.0, 559.0, 559.0, 559.0, 0.09154435323914437, 0.042494221262701776, 0.05870520048213359], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 152.75, 143, 166, 152.5, 161.8, 165.8, 166.0, 0.10828487585138984, 0.08766422078203337, 0.03849188946279873], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 1203.7058823529412, 290, 2086, 1449.0, 1968.3999999999999, 2086.0, 2086.0, 0.12565971349585323, 88.51119254994974, 0.26369916094422186], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ae533931-a1bc-4a80-934c-0afa8cf5b6c0", 3, 0, 0.0, 379.3333333333333, 281, 508, 349.0, 508.0, 508.0, 508.0, 0.027389756231169543, 0.027469999657628048, 0.017564394458139322], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e1fbc11b-e617-4926-bd72-86e9d522e18d", 3, 0, 0.0, 405.3333333333333, 274, 473, 469.0, 473.0, 473.0, 473.0, 0.09595087315294569, 0.0434152713810529, 0.061530996129981454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 544.6666666666666, 284, 1666, 304.0, 1440.1000000000004, 1666.0, 1666.0, 0.08022999264558402, 10.775298912437878, 0.17815828987542065], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 6, 46.15384615384615, 1011.0, 137, 2254, 1392.0, 2163.2, 2254.0, 2254.0, 0.11104751979635594, 71.54910489292457, 0.16879022803181085], "isController": false}, {"data": ["register", 25, 7, 28.0, 1305.12, 288, 3562, 1134.0, 2702.800000000002, 3459.3999999999996, 3562.0, 0.10470502500355997, 0.03291664223549417, 0.047239962452778034], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/cfd0ea3c-1449-4b09-9046-ea6cf28327f4", 3, 0, 0.0, 519.3333333333334, 249, 957, 352.0, 957.0, 957.0, 957.0, 0.07127414411631941, 0.03303853555391889, 0.04570640101209285], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 153.83333333333331, 144, 182, 151.0, 177.5, 182.0, 182.0, 0.08984995058252718, 0.06975655343077061, 0.031938849621132706], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 510.1500000000001, 289, 1431, 302.5, 1371.1000000000013, 1430.9, 1431.0, 0.1072380308952767, 12.97897489490673, 0.23843705931871678], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7e8fb90e-1442-4a26-9c4d-918176a7171f", 3, 0, 0.0, 1123.0, 383, 2127, 859.0, 2127.0, 2127.0, 2127.0, 0.05796205417519997, 0.03726401594922524, 0.037169676668341124], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 402.578947368421, 286, 605, 299.0, 601.0, 605.0, 605.0, 0.11259059098208625, 0.1744934256724325, 0.25321887796068815], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 3, 0, 0.0, 241.33333333333334, 143, 430, 151.0, 430.0, 430.0, 430.0, 0.021653145480266766, 0.016091839561018565, 0.010868864039899529], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 3, 0, 0.0, 143.0, 143, 143, 143.0, 143.0, 143.0, 143.0, 0.021698249674526254, 0.005805976963691596, 0.012374783017503256], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 3, 0, 0.0, 244.0, 147, 436, 149.0, 436.0, 436.0, 436.0, 0.021697621940635306, 0.0058481871636868596, 0.012755828523693802], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 3, 0, 0.0, 239.0, 140, 436, 141.0, 436.0, 436.0, 436.0, 0.021698720498781254, 0.005848483259437135, 0.012777664512465915], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/300e0b17-7ebe-4960-b13e-56d5d18110d5", 2, 0, 0.0, 307.0, 300, 314, 307.0, 314.0, 314.0, 314.0, 0.013070272319123768, 0.025687424845934163, 0.0081242464171116], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f2f9525f-756d-4fb3-aca1-a2dd179c8ed7", 1, 0, 0.0, 634.0, 634, 634, 634.0, 634.0, 634.0, 634.0, 1.5772870662460567, 0.28495908911671924, 1.0874654968454258], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 146.33333333333334, 142, 149, 148.0, 149.0, 149.0, 149.0, 0.06977068700869808, 0.02057690183264338, 0.04312973132471278], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1655.3571428571424, 1127, 2807, 1614.5, 2283.6, 2474.5, 2807.0, 0.2444155413367784, 292.4059600293299, 0.48262521931930275], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 7, 28.0, 1305.12, 288, 3562, 1134.0, 2702.800000000002, 3459.3999999999996, 3562.0, 0.10225367090678555, 0.032145997791320706, 0.046133980428647386], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/984bead0-babb-4a3a-beb3-a4c9c99fdffa", 3, 0, 0.0, 431.6666666666667, 242, 640, 413.0, 640.0, 640.0, 640.0, 0.017285785898255863, 0.023829851327836455, 0.011084960357931007], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 226.57142857142858, 144, 427, 151.0, 427.0, 427.0, 427.0, 0.04249455159142096, 0.01145360960862518, 0.025023647079713707], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 228.57142857142856, 139, 446, 150.0, 446.0, 446.0, 446.0, 0.042492745881238844, 0.011453122913302657, 0.02498108693408768], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 369.27777777777777, 137, 1947, 148.5, 1536.6000000000006, 1947.0, 1947.0, 0.09035645621978707, 9.055303249444057, 0.052256934858014865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 257.3888888888889, 140, 1160, 148.0, 843.2000000000005, 1160.0, 1160.0, 0.09035827054270182, 2.973685193040405, 0.05234622465576009], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 164.33333333333334, 137, 436, 148.5, 193.0000000000004, 436.0, 436.0, 0.09035690979368505, 0.06715000815722103, 0.04535493323628332], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 191.42857142857144, 138, 469, 146.0, 469.0, 469.0, 469.0, 0.04249351973823992, 0.01137033633620873, 0.024234585475714953], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 212.99999999999997, 140, 455, 147.5, 446.90000000000003, 455.0, 455.0, 0.09035690979368505, 0.03925662617338487, 0.05068850082827167], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 189.85714285714286, 143, 437, 148.0, 437.0, 437.0, 437.0, 0.04249326178277445, 0.03157946505536265, 0.021329625543306703], "isController": false}, {"data": ["deleteAccount", 15, 3, 20.0, 630.5333333333332, 138, 1603, 538.0, 1226.2000000000003, 1603.0, 1603.0, 0.09476217851930938, 0.01876735332394135, 0.0644827011643113], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 236.85714285714286, 150, 450, 155.0, 450.0, 450.0, 450.0, 0.0404584520596242, 0.031845226914118265, 0.01438171538056954], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1d760ea5-2b3c-4732-b5e7-169d5e9d0339", 1, 0, 0.0, 440.0, 440, 440, 440.0, 440.0, 440.0, 440.0, 2.2727272727272725, 0.41060014204545453, 1.5669389204545454], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1875.8333333333335, 1096, 3121, 1761.5, 2850.5, 3091.75, 3121.0, 0.10222684136098001, 0.05291037687628849, 0.04702035379006014], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 468.2857142857143, 294, 906, 313.0, 906.0, 906.0, 906.0, 0.04245460389854563, 0.06579634412792179, 0.09548139919760798], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4b25ed30-bf95-4c24-aaed-3d26edbcbe6e", 3, 0, 0.0, 593.0, 349, 975, 455.0, 975.0, 975.0, 975.0, 0.06825783258628929, 0.030884891697572296, 0.0437721126936816], "isController": false}, {"data": ["addBook", 58, 11, 18.96551724137931, 1425.2068965517242, 725, 3203, 1141.5, 2430.0, 2632.3999999999996, 3203.0, 0.2819338719242473, 94.17206058874355, 1.0227555648520819], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=aaeab5a0-8171-43c2-8424-7eb04f10fe6c", 1, 0, 0.0, 543.0, 543, 543, 543.0, 543.0, 543.0, 543.0, 1.8416206261510129, 0.3327146639042357, 1.2697110957642725], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 266.4464285714284, 141, 768, 151.0, 599.5, 607.3, 768.0, 0.2460986767801504, 0.182891692411811, 0.11896371582634223], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/80962f90-b7d5-424c-8ee7-0ad60c2d8799", 1, 0, 0.0, 412.0, 412, 412, 412.0, 412.0, 412.0, 412.0, 2.4271844660194173, 0.7750872269417476, 1.4482516686893205], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 942.8392857142857, 685, 1341, 865.5, 1200.9, 1299.6, 1341.0, 0.24565605520242495, 72.23103677822083, 0.12354772307543833], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2dce7d67-6d9c-4a80-b72b-a6f761f919e6", 3, 0, 0.0, 482.6666666666667, 228, 723, 497.0, 723.0, 723.0, 723.0, 0.05499138468306632, 0.03535416170216666, 0.03526465749532573], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 243.4642857142857, 138, 620, 151.0, 449.0, 481.34999999999985, 620.0, 0.24680367208606396, 0.4367268103710429, 0.12002756708873032], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1383.9642857142858, 976, 2013, 1329.5, 1824.7, 1896.1, 2013.0, 0.2452654999036457, 220.69032794406195, 0.12311178413132215], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 154.57894736842104, 144, 175, 154.0, 163.0, 175.0, 175.0, 0.11356843992827258, 0.08484360990735205, 0.04037003138075314], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 11, 6.395348837209302, 211.72093023255815, 138, 1073, 153.0, 376.70000000000016, 442.8999999999999, 871.5200000000028, 0.7066063586355924, 1.5661781017759646, 0.3383428373429136], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 3, 0, 0.0, 153.0, 150, 156, 153.0, 156.0, 156.0, 156.0, 0.023327605110300693, 0.01806522544186372, 0.008292234629052198], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 167.44444444444446, 142, 434, 150.5, 203.60000000000036, 434.0, 434.0, 0.08127144663175005, 0.06595368374119559, 0.0288894595448799], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/76b41760-1299-4050-9f65-151407d30fee", 1, 0, 0.0, 258.0, 258, 258, 258.0, 258.0, 258.0, 258.0, 3.875968992248062, 1.237736191860465, 2.3127119670542635], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e1fbc11b-e617-4926-bd72-86e9d522e18d", 1, 0, 0.0, 273.0, 273, 273, 273.0, 273.0, 273.0, 273.0, 3.663003663003663, 0.6617731227106226, 2.525469322344322], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ae533931-a1bc-4a80-934c-0afa8cf5b6c0", 1, 0, 0.0, 793.0, 793, 793, 793.0, 793.0, 793.0, 793.0, 1.2610340479192939, 0.22782353404791927, 0.8694238650693569], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 3, 0, 0.0, 485.6666666666667, 292, 867, 298.0, 867.0, 867.0, 867.0, 0.021630195753271568, 0.03352257876996287, 0.04864681720682072], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 570.9444444444445, 286, 2093, 302.0, 1674.5000000000007, 2093.0, 2093.0, 0.09028983035544097, 12.126386638609938, 0.20049711135244133], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ccb2f11d-c174-4497-a9d5-f27cf704a121", 1, 0, 0.0, 425.0, 425, 425, 425.0, 425.0, 425.0, 425.0, 2.352941176470588, 0.4250919117647059, 1.6222426470588236], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1f289e6c-fde1-43e6-9794-52f42cd7969b", 1, 0, 0.0, 260.0, 260, 260, 260.0, 260.0, 260.0, 260.0, 3.8461538461538463, 0.6948617788461539, 2.6517427884615383], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 177.91666666666666, 145, 458, 153.0, 369.50000000000034, 458.0, 458.0, 0.08457136413610351, 0.07011825014799988, 0.030062477095255547], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 185.58823529411762, 143, 439, 153.0, 431.8, 439.0, 439.0, 0.12247044499996397, 0.09508203493649547, 0.04353441599608095], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cfd0ea3c-1449-4b09-9046-ea6cf28327f4", 1, 0, 0.0, 240.0, 240, 240, 240.0, 240.0, 240.0, 240.0, 4.166666666666667, 0.7527669270833334, 2.872721354166667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 147.10526315789474, 140, 153, 149.0, 153.0, 153.0, 153.0, 0.11288693482264868, 0.08389351308597232, 0.05666394970589983], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 188.73684210526315, 137, 432, 146.0, 426.0, 432.0, 432.0, 0.11288827625543646, 0.03020643329491171, 0.06438159505192861], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 221.31578947368422, 137, 457, 145.0, 447.0, 457.0, 457.0, 0.11270011685222642, 0.030376203370326652, 0.06625534213382843], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 206.36842105263156, 139, 445, 146.0, 442.0, 445.0, 445.0, 0.1126914271479579, 0.03037386122347303, 0.06636028375997913], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 23.333333333333332, 0.5287009063444109], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 10.0, 0.22658610271903323], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 10.0, 0.22658610271903323], "isController": false}, {"data": ["401/Unauthorized", 17, 56.666666666666664, 1.283987915407855], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1324, 30, "401/Unauthorized", 17, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
