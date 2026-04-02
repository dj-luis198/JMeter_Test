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

    var data = {"OkPercent": 97.93577981651376, "KoPercent": 2.0642201834862384};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8028909329829172, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.26785714285714285, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/aaa7fe60-5b81-470c-9275-7b97a3b92198"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=55c00b18-2dab-4e81-8c60-0209e978d342"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6d9bd3a8-ec8b-437a-94b6-c0d49497a748"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/99cfda51-e982-423a-9fdb-be5c1259fd40"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b7db7a72-3afc-4529-aab3-e928724188b4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5d66af41-02f0-4272-a2a9-ee5a7873d3dc"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4a330f54-c2df-4b5a-9826-ffd5ac2a96eb"], "isController": false}, {"data": [0.84375, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/07a15cf0-ea83-4f7e-9da2-ad1697348206"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b3aa70f0-f8e4-47d8-bdde-44770c192773"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.045454545454545456, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2711f157-c4fd-4509-a169-3abeb2dd9ee4"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/411d1a45-c3b5-4d5c-83c3-404522fceb12"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7eb04abd-bdad-41f1-bea2-96dbd871f55e"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.35, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.32608695652173914, 500, 1500, "register"], "isController": true}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/38380b73-2d68-42d7-8171-fda52fdd2b51"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.49107142857142855, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.32608695652173914, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=99cfda51-e982-423a-9fdb-be5c1259fd40"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6d9bd3a8-ec8b-437a-94b6-c0d49497a748"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.38636363636363635, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5d66af41-02f0-4272-a2a9-ee5a7873d3dc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b7db7a72-3afc-4529-aab3-e928724188b4"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4a330f54-c2df-4b5a-9826-ffd5ac2a96eb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2f008a11-3f7b-4b58-8702-0f12d3f0783f"], "isController": false}, {"data": [0.33620689655172414, 500, 1500, "addBook"], "isController": true}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.7410714285714286, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=07a15cf0-ea83-4f7e-9da2-ad1697348206"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/55c00b18-2dab-4e81-8c60-0209e978d342"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9186046511627907, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b3aa70f0-f8e4-47d8-bdde-44770c192773"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=411d1a45-c3b5-4d5c-83c3-404522fceb12"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=aaa7fe60-5b81-470c-9275-7b97a3b92198"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7eb04abd-bdad-41f1-bea2-96dbd871f55e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/6a7a280b-84d9-45b5-8583-9839b776100d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=38380b73-2d68-42d7-8171-fda52fdd2b51"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1308, 27, 2.0642201834862384, 309.19571865443385, 81, 3910, 99.5, 852.3000000000004, 1047.1999999999998, 1397.9300000000019, 5.141004225213717, 736.8745624324457, 3.7608624226196326], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1429.5714285714282, 1015, 1911, 1418.5, 1710.3, 1750.0, 1911.0, 0.25547328707442024, 307.4218491604167, 1.2561601566598692], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/aaa7fe60-5b81-470c-9275-7b97a3b92198", 3, 0, 0.0, 245.0, 167, 352, 216.0, 352.0, 352.0, 352.0, 0.017419680755317357, 0.024014436197515955, 0.011170823921866926], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 453.5714285714286, 91, 785, 440.0, 772.0, 785.0, 785.0, 0.06990248603198537, 0.013769853554291764, 0.04703399694925579], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 453.5714285714286, 91, 785, 440.0, 772.0, 785.0, 785.0, 0.0708835636205299, 0.013963112699803045, 0.047694116537641704], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 101.25, 82, 257, 85.0, 235.50000000000034, 256.75, 257.0, 0.093465805535045, 0.03904753086708228, 0.052519750493032126], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 94.60000000000001, 82, 252, 85.0, 96.0, 244.19999999999987, 252.0, 0.09346449517489544, 0.06945945393368694, 0.04691479542958618], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 167.45000000000002, 81, 662, 86.5, 472.60000000000053, 653.7499999999999, 662.0, 0.09346624232992648, 2.7708907274477643, 0.054235977726994455], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 182.8, 81, 908, 85.0, 833.7000000000014, 907.55, 908.0, 0.093465805535045, 8.432742371437785, 0.05414444906580927], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 262.8571428571429, 85, 949, 203.5, 669.0, 949.0, 949.0, 0.06962645407389356, 0.12836406118673316, 0.045002701133419205], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 103.3157894736842, 82, 254, 86.0, 250.0, 254.0, 254.0, 0.10403776023129237, 0.07731712454688817, 0.05222207886609793], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 111.2105263157895, 82, 253, 86.0, 252.0, 253.0, 253.0, 0.10394327979342642, 0.03602968127707996, 0.058820698526193704], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=55c00b18-2dab-4e81-8c60-0209e978d342", 1, 0, 0.0, 161.0, 161, 161, 161.0, 161.0, 161.0, 161.0, 6.211180124223602, 1.1221370341614907, 4.282317546583851], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 552.0, 483, 768, 487.0, 768.0, 768.0, 768.0, 0.0489308606938396, 14.38729770147282, 0.0279058814894554], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6d9bd3a8-ec8b-437a-94b6-c0d49497a748", 1, 0, 0.0, 365.0, 365, 365, 365.0, 365.0, 365.0, 365.0, 2.73972602739726, 0.4949700342465754, 1.8889126712328768], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 818.8571428571429, 566, 1006, 905.0, 1006.0, 1006.0, 1006.0, 0.04878796749327423, 43.89949891054726, 0.027776743211502808], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 257.7142857142857, 84, 355, 255.0, 355.0, 355.0, 355.0, 0.04901171379959811, 0.08672775918444507, 0.027138321996457153], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 119.1875, 83, 254, 88.5, 252.6, 254.0, 254.0, 0.07113545524468373, 0.0528653139074261, 0.035706664058366644], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/99cfda51-e982-423a-9fdb-be5c1259fd40", 3, 0, 0.0, 323.0, 235, 420, 314.0, 420.0, 420.0, 420.0, 0.021894454134767663, 0.025878503568796025, 0.014040388881996192], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 146.75000000000003, 81, 261, 85.5, 257.5, 261.0, 261.0, 0.07113988324166662, 0.03239157281389362, 0.039825134832309955], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 204.31249999999997, 81, 976, 86.5, 826.9000000000001, 976.0, 976.0, 0.0711392506369186, 8.018180316325124, 0.04105790735001845], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 180.25, 83, 691, 85.5, 675.6, 691.0, 691.0, 0.07113988324166662, 2.6314635863838265, 0.04112774499908852], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b7db7a72-3afc-4529-aab3-e928724188b4", 3, 0, 0.0, 675.3333333333333, 384, 1238, 404.0, 1238.0, 1238.0, 1238.0, 0.017386063331633363, 0.023968091865060968, 0.011149265873475821], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 84.28571428571429, 83, 86, 84.0, 86.0, 86.0, 86.0, 0.049068401351483965, 0.03646587248874932, 0.027553057399514927], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 559.5789473684209, 83, 1085, 766.0, 1049.0, 1085.0, 1085.0, 0.14421690222094027, 68.31663473179451, 0.07826079634296297], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 171.05263157894737, 81, 975, 87.0, 336.0, 975.0, 975.0, 0.10394896652843279, 4.949356721736823, 0.060640458989397204], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 402.0526315789474, 82, 841, 509.0, 755.0, 841.0, 841.0, 0.14422894447185636, 22.338465954378105, 0.07840817977378828], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 132.26315789473685, 82, 661, 85.0, 249.0, 661.0, 661.0, 0.10403889959698616, 1.6366127432593744, 0.06079452351552918], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 381.42857142857144, 90, 661, 401.0, 629.0, 661.0, 661.0, 0.07112194874139552, 0.014010071375955701, 0.04831093309456679], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/5d66af41-02f0-4272-a2a9-ee5a7873d3dc", 3, 0, 0.0, 556.0, 295, 949, 424.0, 949.0, 949.0, 949.0, 0.04844570044408559, 0.03070435506661284, 0.031067067016552284], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4a330f54-c2df-4b5a-9826-ffd5ac2a96eb", 1, 0, 0.0, 661.0, 661, 661, 661.0, 661.0, 661.0, 661.0, 1.5128593040847202, 0.27331930786686837, 1.0430455748865355], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 356.625, 168, 1061, 184.5, 914.0000000000001, 1061.0, 1061.0, 0.07110795075774409, 10.730156784698458, 0.15764924336696148], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/07a15cf0-ea83-4f7e-9da2-ad1697348206", 3, 0, 0.0, 367.0, 171, 657, 273.0, 657.0, 657.0, 657.0, 0.05379814934366258, 0.03458702635212682, 0.03449946426009612], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b3aa70f0-f8e4-47d8-bdde-44770c192773", 1, 0, 0.0, 492.0, 492, 492, 492.0, 492.0, 492.0, 492.0, 2.032520325203252, 0.36720337906504064, 1.4013274898373984], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 419.1363636363636, 95, 677, 453.0, 666.4, 676.85, 677.0, 0.10257414478806783, 0.06300696979657681, 0.046378739293823634], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 94.26315789473684, 83, 243, 86.0, 89.0, 243.0, 243.0, 0.14440103968748574, 0.10731366328337563, 0.0724825531243825], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 121.3157894736842, 82, 261, 86.0, 253.0, 261.0, 261.0, 0.14440323463245577, 0.15279014124916399, 0.07597201427311973], "isController": false}, {"data": ["login", 22, 0, 0.0, 2381.2727272727275, 1377, 5069, 2115.5, 4082.999999999999, 4993.0999999999985, 5069.0, 0.10139557177884703, 38.73368002985408, 0.20648185595376362], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 107.0, 85, 255, 89.0, 249.0, 255.0, 255.0, 0.10613991475288952, 0.08592772395522014, 0.0377294228223162], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2711f157-c4fd-4509-a169-3abeb2dd9ee4", 1, 0, 0.0, 368.0, 368, 368, 368.0, 368.0, 368.0, 368.0, 2.717391304347826, 0.8677606997282609, 1.6214121942934783], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/411d1a45-c3b5-4d5c-83c3-404522fceb12", 3, 0, 0.0, 393.0, 195, 640, 344.0, 640.0, 640.0, 640.0, 0.047060299930978225, 0.03080672628945222, 0.030178642859383827], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 656.2631578947369, 172, 1174, 855.0, 1135.0, 1174.0, 1174.0, 0.14412282298683174, 90.85369868231916, 0.30472761971676077], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7eb04abd-bdad-41f1-bea2-96dbd871f55e", 1, 0, 0.0, 426.0, 426, 426, 426.0, 426.0, 426.0, 426.0, 2.347417840375587, 0.42409404342723006, 1.6184345657276995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 304.94999999999993, 171, 992, 176.0, 936.400000000001, 991.65, 992.0, 0.09342607428307166, 11.307319451191884, 0.20772703703876713], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 3, 30.0, 658.0999999999999, 85, 1091, 792.0, 1083.8, 1091.0, 1091.0, 0.06494307739266533, 54.39136210392841, 0.1153056728589891], "isController": false}, {"data": ["register", 23, 7, 30.434782608695652, 950.6956521739132, 119, 1918, 983.0, 1454.2, 1826.1999999999987, 1918.0, 0.09505192728114294, 0.029800587255602896, 0.04288475625379691], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 293.63157894736844, 170, 1064, 175.0, 588.0, 1064.0, 1064.0, 0.10389383144046063, 6.694284967792912, 0.232260598196075], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 92.6923076923077, 87, 100, 92.0, 99.6, 100.0, 100.0, 0.10332466995716, 0.08021788341400606, 0.03672869127383422], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/38380b73-2d68-42d7-8171-fda52fdd2b51", 3, 0, 0.0, 260.3333333333333, 175, 411, 195.0, 411.0, 411.0, 411.0, 0.04558993374262963, 0.02930993461643669, 0.029235732250319127], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 251.5333333333333, 169, 515, 174.0, 413.00000000000006, 515.0, 515.0, 0.10771141956470225, 0.16693166293865477, 0.2422455070874114], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 158.28571428571428, 85, 255, 91.0, 255.0, 255.0, 255.0, 0.0380430647492962, 0.028272238549037508, 0.01909583523548657], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 132.57142857142858, 84, 254, 85.0, 254.0, 254.0, 254.0, 0.038043685020027286, 0.010179657905749488, 0.02169678911298431], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 133.57142857142858, 84, 254, 87.0, 254.0, 254.0, 254.0, 0.0380430647492962, 0.010253794795708742, 0.02236516111237921], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 133.42857142857144, 84, 253, 85.0, 253.0, 253.0, 253.0, 0.03804285799688049, 0.010253739069471694, 0.0224021907930849], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 94.0, 90, 98, 94.0, 98.0, 98.0, 98.0, 0.01965292926910756, 0.005796078749287581, 0.012148734597016684], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 984.3392857142856, 654, 1516, 919.0, 1334.4, 1384.1999999999998, 1516.0, 0.24347296797895698, 291.2783146018565, 0.48076400513032325], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, 30.434782608695652, 950.6956521739132, 119, 1918, 983.0, 1454.2, 1826.1999999999987, 1918.0, 0.09605826978173891, 0.030116094771924257, 0.043338789686682984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 132.6, 83, 248, 86.0, 248.0, 248.0, 248.0, 0.042326250740709385, 0.011408247269956828, 0.02492454023110133], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 133.6, 83, 253, 88.0, 253.0, 253.0, 253.0, 0.042324459305032376, 0.011407764422059508, 0.02488215283362255], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=99cfda51-e982-423a-9fdb-be5c1259fd40", 1, 0, 0.0, 395.0, 395, 395, 395.0, 395.0, 395.0, 395.0, 2.5316455696202533, 0.4573773734177215, 1.7454509493670884], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 123.38461538461537, 81, 262, 84.0, 257.6, 262.0, 262.0, 0.09431019348098925, 0.025419544336672883, 0.055444078589409695], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 85.0, 82, 89, 84.0, 88.2, 89.0, 89.0, 0.09430882512967463, 0.025419175523232616, 0.055535372610540826], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6d9bd3a8-ec8b-437a-94b6-c0d49497a748", 3, 0, 0.0, 293.3333333333333, 207, 384, 289.0, 384.0, 384.0, 384.0, 0.02296140952439267, 0.027139608718447197, 0.014724601810889831], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 84.2, 83, 85, 84.0, 85.0, 85.0, 85.0, 0.042384734713945424, 0.011341227843379929, 0.024172544016547], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 99.84615384615385, 82, 248, 86.0, 187.99999999999994, 248.0, 248.0, 0.09419812038519786, 0.07000465782532769, 0.04728304089647627], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 119.0, 83, 256, 86.0, 256.0, 256.0, 256.0, 0.042384375423843754, 0.03149854462650888, 0.02127496969517157], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 98.23076923076924, 82, 260, 85.0, 190.79999999999995, 260.0, 260.0, 0.09431019348098925, 0.025235344740030325, 0.05378628221962668], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 523.8461538461538, 85, 1238, 424.0, 1035.9999999999998, 1238.0, 1238.0, 0.07429123306302754, 0.013918444655888724, 0.05056179173310017], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 90.0, 86, 95, 89.0, 95.0, 95.0, 95.0, 0.039559465788973985, 0.031137626392493196, 0.014062153854674348], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1381.318181818182, 801, 3910, 1137.0, 2185.2999999999997, 3657.0999999999967, 3910.0, 0.10216069877917965, 0.05287614292281759, 0.04698993078612657], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 254.2, 169, 510, 175.0, 510.0, 510.0, 510.0, 0.042293312581414624, 0.06554637408857912, 0.09511865124511512], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5d66af41-02f0-4272-a2a9-ee5a7873d3dc", 1, 0, 0.0, 385.0, 385, 385, 385.0, 385.0, 385.0, 385.0, 2.5974025974025974, 0.4692573051948052, 1.7907873376623376], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b7db7a72-3afc-4529-aab3-e928724188b4", 1, 0, 0.0, 474.0, 474, 474, 474.0, 474.0, 474.0, 474.0, 2.109704641350211, 0.3811478111814346, 1.4545424578059072], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4a330f54-c2df-4b5a-9826-ffd5ac2a96eb", 3, 0, 0.0, 288.0, 172, 514, 178.0, 514.0, 514.0, 514.0, 0.05538427455831041, 0.035606752035372086, 0.03551660835933317], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2f008a11-3f7b-4b58-8702-0f12d3f0783f", 1, 0, 0.0, 204.0, 204, 204, 204.0, 204.0, 204.0, 204.0, 4.901960784313726, 1.5653722426470589, 2.924900428921569], "isController": false}, {"data": ["addBook", 58, 13, 22.413793103448278, 869.6724137931038, 428, 1760, 716.5, 1532.0, 1562.35, 1760.0, 0.2748163942193793, 86.13356672737503, 0.9978150541933191], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 162.62500000000006, 82, 630, 88.0, 344.20000000000005, 358.6, 630.0, 0.24452440004191847, 0.1817217465155273, 0.11820271291088832], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 545.3392857142858, 405, 847, 502.0, 746.9, 764.3, 847.0, 0.2447081854888046, 71.95233161017987, 0.12307101125657653], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=07a15cf0-ea83-4f7e-9da2-ad1697348206", 1, 0, 0.0, 373.0, 373, 373, 373.0, 373.0, 373.0, 373.0, 2.680965147453083, 0.4843540549597855, 1.848399798927614], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 135.99999999999997, 82, 356, 89.0, 258.8, 280.2999999999999, 356.0, 0.24497473698024894, 0.4334904525470811, 0.11913810450797262], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/55c00b18-2dab-4e81-8c60-0209e978d342", 3, 0, 0.0, 430.66666666666663, 217, 733, 342.0, 733.0, 733.0, 733.0, 0.08027614995584811, 0.03632286733028284, 0.05147917168392604], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 819.732142857143, 564, 1097, 828.0, 1014.1, 1091.05, 1097.0, 0.24418320717200961, 219.7164790416681, 0.12256852391251263], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 101.73333333333333, 83, 260, 90.0, 167.00000000000006, 260.0, 260.0, 0.10785780027611597, 0.08057736055784054, 0.0383400774419006], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 13, 7.558139534883721, 138.92441860465118, 83, 937, 91.0, 252.10000000000005, 339.4, 642.0800000000041, 0.7006595161375737, 1.553132307023297, 0.3352088981212548], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 112.57142857142857, 87, 248, 90.0, 248.0, 248.0, 248.0, 0.03818105456072697, 0.029567945572906724, 0.013572171738383414], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 102.1, 84, 254, 95.5, 109.9, 246.7999999999999, 254.0, 0.09858918870956611, 0.08000743732192328, 0.03504537567410358], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 317.42857142857144, 172, 510, 180.0, 510.0, 510.0, 510.0, 0.038024672580408606, 0.05893081580576997, 0.08551837983660254], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b3aa70f0-f8e4-47d8-bdde-44770c192773", 3, 0, 0.0, 617.3333333333334, 389, 889, 574.0, 889.0, 889.0, 889.0, 0.07009345794392523, 0.03171546436915888, 0.04494925525700935], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 225.92307692307693, 165, 508, 176.0, 444.79999999999995, 508.0, 508.0, 0.09413945674291962, 0.14589777133888032, 0.21172184460834367], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=411d1a45-c3b5-4d5c-83c3-404522fceb12", 1, 0, 0.0, 416.0, 416, 416, 416.0, 416.0, 416.0, 416.0, 2.403846153846154, 0.4342886117788462, 1.6573392427884617], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=aaa7fe60-5b81-470c-9275-7b97a3b92198", 1, 0, 0.0, 407.0, 407, 407, 407.0, 407.0, 407.0, 407.0, 2.457002457002457, 0.44389204545454547, 1.6939880221130221], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 100.62500000000001, 86, 257, 89.5, 147.1000000000001, 257.0, 257.0, 0.0707685911300417, 0.05867434948184122, 0.025156022628257012], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7eb04abd-bdad-41f1-bea2-96dbd871f55e", 3, 0, 0.0, 259.0, 199, 378, 200.0, 378.0, 378.0, 378.0, 0.024898951754131152, 0.02942971804012051, 0.01596710122253853], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 93.10526315789474, 87, 109, 90.0, 103.0, 109.0, 109.0, 0.1467895578544002, 0.11396259618578922, 0.05217910064355632], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6a7a280b-84d9-45b5-8583-9839b776100d", 1, 0, 0.0, 1991.0, 1991, 1991, 1991.0, 1991.0, 1991.0, 1991.0, 0.5022601707684581, 0.16038972250125563, 0.29968844173782017], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=38380b73-2d68-42d7-8171-fda52fdd2b51", 1, 0, 0.0, 597.0, 597, 597, 597.0, 597.0, 597.0, 597.0, 1.6750418760469012, 0.3026198701842546, 1.1548628559463987], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 97.39999999999998, 82, 255, 86.0, 159.00000000000006, 255.0, 255.0, 0.10777720296602862, 0.08009614400112089, 0.054099103832557345], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 129.93333333333334, 82, 263, 86.0, 258.2, 263.0, 263.0, 0.10778030063518523, 0.028839650755899175, 0.06146845270600408], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 118.33333333333331, 82, 260, 84.0, 253.4, 260.0, 260.0, 0.10777952620120282, 0.029049950421417947, 0.063362573020629], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 138.86666666666665, 82, 253, 85.0, 252.4, 253.0, 253.0, 0.1077787517783494, 0.029049741690258236, 0.06346737043197724], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 25.925925925925927, 0.5351681957186545], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 7.407407407407407, 0.1529051987767584], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 3.7037037037037037, 0.0764525993883792], "isController": false}, {"data": ["401/Unauthorized", 17, 62.96296296296296, 1.2996941896024465], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1308, 27, "401/Unauthorized", 17, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 3, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
