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

    var data = {"OkPercent": 97.87735849056604, "KoPercent": 2.1226415094339623};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7989864864864865, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/701a5c60-ad39-48d7-8a62-e783e190abe9"], "isController": false}, {"data": [0.39622641509433965, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=87edf00c-bb84-4ec8-9884-8d67573e64cf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d7a2884e-461e-4ad2-bcda-d406d8ca68f1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=52f9da1c-e9de-4e94-8326-832070c29ffb"], "isController": false}, {"data": [0.5384615384615384, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5384615384615384, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/59380229-4206-4e83-84e4-c7799cb7aaa2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e4547973-f3ac-42d0-a586-bb72e5500bea"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=977d3e70-3c58-4250-8ed3-196987e135bc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a74be7b3-9a93-4239-bd7a-f1f1dfc5100c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3f98fa3b-b65e-4cb3-846a-53ac5a62881f"], "isController": false}, {"data": [0.5909090909090909, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e4547973-f3ac-42d0-a586-bb72e5500bea"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/56feac6f-1638-42ad-aed6-ce16be195dba"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e39e9916-7407-4843-9920-a67e3975e3eb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f8400791-a8d2-4634-9c4b-dff976b6effc"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/977d3e70-3c58-4250-8ed3-196987e135bc"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/52f9da1c-e9de-4e94-8326-832070c29ffb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/acf86806-03ef-4874-8030-ad18279e378c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8ee1480d-ee7d-4311-a415-7c7a79b4229a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.49056603773584906, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.29545454545454547, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3474576271186441, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=701a5c60-ad39-48d7-8a62-e783e190abe9"], "isController": false}, {"data": [0.8113207547169812, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dd4c1d2a-9390-4dfe-a0f1-cbc0ea518acf"], "isController": false}, {"data": [0.9093567251461988, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a74be7b3-9a93-4239-bd7a-f1f1dfc5100c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f8400791-a8d2-4634-9c4b-dff976b6effc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/69c49b0f-5297-4adf-8735-3ced89ab3d44"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=56feac6f-1638-42ad-aed6-ce16be195dba"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3f98fa3b-b65e-4cb3-846a-53ac5a62881f"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=59380229-4206-4e83-84e4-c7799cb7aaa2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/87edf00c-bb84-4ec8-9884-8d67573e64cf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8ee1480d-ee7d-4311-a415-7c7a79b4229a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1272, 27, 2.1226415094339623, 315.60298742138366, 77, 3472, 98.0, 861.0, 1091.0499999999997, 1698.2499999999986, 5.151486924861999, 720.4024230554858, 3.762687770331566], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/701a5c60-ad39-48d7-8a62-e783e190abe9", 3, 0, 0.0, 735.6666666666667, 222, 1753, 232.0, 1753.0, 1753.0, 1753.0, 0.05782909574570619, 0.026166159858897003, 0.03708441361296914], "isController": false}, {"data": ["see books", 53, 0, 0.0, 1353.1509433962262, 1091, 1982, 1343.0, 1610.8, 1708.5999999999997, 1982.0, 0.2338396918610551, 281.3869680491703, 1.1497879380082152], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=87edf00c-bb84-4ec8-9884-8d67573e64cf", 1, 0, 0.0, 860.0, 860, 860, 860.0, 860.0, 860.0, 860.0, 1.1627906976744187, 0.21007449127906977, 0.8016896802325582], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d7a2884e-461e-4ad2-bcda-d406d8ca68f1", 1, 0, 0.0, 421.0, 421, 421, 421.0, 421.0, 421.0, 421.0, 2.375296912114014, 0.7585176662707839, 1.417291419239905], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=52f9da1c-e9de-4e94-8326-832070c29ffb", 1, 0, 0.0, 406.0, 406, 406, 406.0, 406.0, 406.0, 406.0, 2.4630541871921183, 0.4449853756157635, 1.6981604064039408], "isController": false}, {"data": ["deleteBook", 13, 2, 15.384615384615385, 530.5384615384615, 81, 902, 574.0, 840.0, 902.0, 902.0, 0.06544140225823177, 0.012973246736739306, 0.04399793796658461], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, 15.384615384615385, 530.5384615384615, 81, 902, 574.0, 840.0, 902.0, 902.0, 0.06462131907024835, 0.012810671651621499, 0.04344657494581751], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 133.13333333333333, 78, 243, 82.0, 239.4, 243.0, 243.0, 0.07425044179012866, 0.019867793994624267, 0.042345955083432744], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 113.4, 79, 260, 81.0, 246.20000000000002, 260.0, 260.0, 0.07424970671365849, 0.055179713680755964, 0.03726987231525436], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 111.53333333333335, 79, 236, 80.0, 235.4, 236.0, 236.0, 0.07419388345624786, 0.019997570150316807, 0.04369034348058346], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 168.33333333333334, 78, 320, 234.0, 270.20000000000005, 320.0, 320.0, 0.074194617427821, 0.01999776797859238, 0.043618320011277585], "isController": false}, {"data": ["goToProfile", 13, 2, 15.384615384615385, 204.6153846153846, 79, 387, 184.0, 368.2, 387.0, 387.0, 0.06590721278397137, 0.1262396417942985, 0.042598081339640145], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/59380229-4206-4e83-84e4-c7799cb7aaa2", 3, 0, 0.0, 330.3333333333333, 171, 512, 308.0, 512.0, 512.0, 512.0, 0.042112946923649225, 0.03510783107795107, 0.027006023906116207], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 81.5, 78, 87, 81.0, 86.3, 87.0, 87.0, 0.10847751803438738, 0.08061659299235233, 0.054450629169604595], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 109.625, 78, 237, 80.0, 235.6, 237.0, 237.0, 0.10847972446149987, 0.04939323391618586, 0.060728517624565236], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 582.1666666666666, 461, 628, 614.5, 628.0, 628.0, 628.0, 0.040812994857562644, 12.000375607093298, 0.0232761611297037], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 814.8333333333334, 635, 1006, 776.5, 1006.0, 1006.0, 1006.0, 0.040687620791374224, 36.61079270928695, 0.023164924727901534], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 133.66666666666669, 79, 242, 82.5, 242.0, 242.0, 242.0, 0.04094473143668239, 0.07245298180006689, 0.022671545629491127], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e4547973-f3ac-42d0-a586-bb72e5500bea", 3, 0, 0.0, 306.0, 184, 391, 343.0, 391.0, 391.0, 391.0, 0.03381958379365545, 0.028193995473812367, 0.021687688826009514], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 104.42857142857143, 80, 248, 81.5, 241.5, 248.0, 248.0, 0.08120367040590235, 0.06034764958876141, 0.0407604361217127], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 102.64285714285714, 78, 236, 80.5, 234.5, 236.0, 236.0, 0.08120414141121196, 0.030440224326440647, 0.04582460267973667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 177.2857142857143, 77, 812, 81.5, 525.5, 812.0, 812.0, 0.08120461242198557, 5.239470453484258, 0.04724096453678569], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 141.85714285714286, 78, 621, 80.0, 429.5, 621.0, 621.0, 0.08120414141121196, 1.7258032503407674, 0.04731999144456367], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=977d3e70-3c58-4250-8ed3-196987e135bc", 1, 0, 0.0, 689.0, 689, 689, 689.0, 689.0, 689.0, 689.0, 1.4513788098693758, 0.2622119920174166, 1.000657656023222], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a74be7b3-9a93-4239-bd7a-f1f1dfc5100c", 1, 0, 0.0, 186.0, 186, 186, 186.0, 186.0, 186.0, 186.0, 5.376344086021506, 0.9713121639784946, 3.7067372311827955], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 106.33333333333334, 80, 236, 80.5, 236.0, 236.0, 236.0, 0.04094445202675037, 0.03042844530503617, 0.022991269448614713], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 614.4999999999999, 79, 1101, 847.0, 1040.1000000000001, 1101.0, 1101.0, 0.08206011929489843, 46.15694390485642, 0.043834848881161556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 191.375, 78, 935, 80.0, 876.9000000000001, 935.0, 935.0, 0.10847898897582274, 12.226781788581231, 0.06260847898897583], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 405.12500000000006, 78, 726, 506.5, 679.1, 726.0, 726.0, 0.08212540549418962, 15.100548283322382, 0.043949924033999915], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 149.125, 79, 627, 80.0, 622.1, 627.0, 627.0, 0.10847972446149987, 4.012663948458571, 0.06271484070430461], "isController": false}, {"data": ["deleteBooks", 13, 2, 15.384615384615385, 572.7692307692307, 80, 1840, 431.0, 1617.1999999999998, 1840.0, 1840.0, 0.0647803944627712, 0.012842207105412652, 0.04395256331037782], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 283.8571428571429, 160, 895, 169.0, 691.0, 895.0, 895.0, 0.08116553711294185, 7.052677112985327, 0.18105984074162113], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3f98fa3b-b65e-4cb3-846a-53ac5a62881f", 1, 0, 0.0, 431.0, 431, 431, 431.0, 431.0, 431.0, 431.0, 2.320185614849188, 0.41917415893271465, 1.599659222737819], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 781.409090909091, 246, 1663, 699.5, 1504.3, 1639.5999999999997, 1663.0, 0.10143811583310663, 0.062309155135765695, 0.04586508557688317], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 82.8125, 80, 99, 81.0, 91.30000000000001, 99.0, 99.0, 0.08212414090449476, 0.06103171018390675, 0.04122246916495147], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 150.9375, 79, 252, 85.5, 249.9, 252.0, 252.0, 0.08206138191367142, 0.0989905488367799, 0.042493210702855735], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e4547973-f3ac-42d0-a586-bb72e5500bea", 1, 0, 0.0, 499.0, 499, 499, 499.0, 499.0, 499.0, 499.0, 2.004008016032064, 0.36205222945891785, 1.3816695891783568], "isController": false}, {"data": ["login", 22, 0, 0.0, 2890.1818181818194, 1868, 4605, 2620.0, 4161.299999999999, 4556.849999999999, 4605.0, 0.10447832074844471, 34.23135158438999, 0.20488473251175382], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/56feac6f-1638-42ad-aed6-ce16be195dba", 3, 0, 0.0, 476.3333333333333, 184, 1009, 236.0, 1009.0, 1009.0, 1009.0, 0.021656115326032815, 0.029854703257079746, 0.01388754791415516], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e39e9916-7407-4843-9920-a67e3975e3eb", 1, 0, 0.0, 361.0, 361, 361, 361.0, 361.0, 361.0, 361.0, 2.770083102493075, 0.8845870844875346, 1.6528523199445984], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 86.68750000000001, 79, 114, 82.5, 109.80000000000001, 114.0, 114.0, 0.10167186675901861, 0.08231052494455705, 0.036141171386994894], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 698.8124999999999, 161, 1191, 929.0, 1123.8000000000002, 1191.0, 1191.0, 0.08202478173718235, 61.37901801277024, 0.17135890071412826], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f8400791-a8d2-4634-9c4b-dff976b6effc", 3, 0, 0.0, 499.0, 340, 761, 396.0, 761.0, 761.0, 761.0, 0.022660835278388358, 0.026784340135360723, 0.014531850748185245], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 314.8, 160, 558, 317.0, 522.0, 558.0, 558.0, 0.07416306975778342, 0.11493827315000223, 0.16679448208220235], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, 40.0, 584.8, 78, 1242, 781.5, 1218.8000000000002, 1242.0, 1242.0, 0.06286421957214612, 45.13120548427451, 0.1017123427608708], "isController": false}, {"data": ["register", 22, 6, 27.272727272727273, 1180.0, 123, 2031, 1240.0, 1856.6, 2008.3499999999997, 2031.0, 0.1037437341142407, 0.032640961798727726, 0.04680625503982345], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/977d3e70-3c58-4250-8ed3-196987e135bc", 3, 0, 0.0, 510.0, 264, 851, 415.0, 851.0, 851.0, 851.0, 0.0322618804374711, 0.03235639766531525, 0.020688770983664735], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 284.56250000000006, 159, 1016, 165.5, 957.9000000000001, 1016.0, 1016.0, 0.10841797841127006, 16.36022265071793, 0.2403671049689315], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 12, 0, 0.0, 99.75000000000001, 81, 237, 84.0, 197.70000000000016, 237.0, 237.0, 0.10895817821926017, 0.08459155437921077, 0.03873122741387764], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/52f9da1c-e9de-4e94-8326-832070c29ffb", 3, 0, 0.0, 726.0, 179, 1122, 877.0, 1122.0, 1122.0, 1122.0, 0.021489817408184755, 0.025400236656614207, 0.013780905043660146], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 23, 0, 0.0, 233.99999999999994, 159, 476, 168.0, 341.20000000000005, 451.5999999999997, 476.0, 0.12290395323237398, 0.19047712283181395, 0.2764138713810129], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/acf86806-03ef-4874-8030-ad18279e378c", 1, 0, 0.0, 208.0, 208, 208, 208.0, 208.0, 208.0, 208.0, 4.807692307692308, 1.5352689302884617, 2.86865234375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8ee1480d-ee7d-4311-a415-7c7a79b4229a", 1, 0, 0.0, 1283.0, 1283, 1283, 1283.0, 1283.0, 1283.0, 1283.0, 0.779423226812159, 0.14081376656274358, 0.5373757794232269], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 110.18181818181819, 78, 238, 81.0, 237.4, 238.0, 238.0, 0.051944617593169755, 0.038603373035549005, 0.026073763127821534], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 93.36363636363636, 78, 233, 79.0, 202.6000000000001, 233.0, 233.0, 0.05194510818749351, 0.02099202170361066, 0.02922834656359498], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 215.18181818181816, 79, 1089, 80.0, 921.4000000000005, 1089.0, 1089.0, 0.05194510818749351, 4.261846177843522, 0.03013222096032338], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 158.45454545454547, 78, 620, 79.0, 546.8000000000002, 620.0, 620.0, 0.05194559879108425, 1.4012491293209295, 0.030183233672553836], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 80.5, 80, 81, 80.5, 81.0, 81.0, 81.0, 0.024626295958824835, 0.007262833378481543, 0.015223091154234493], "isController": false}, {"data": ["https://demoqa.com/books", 53, 0, 0.0, 922.320754716981, 619, 1632, 860.0, 1254.4, 1310.7999999999995, 1632.0, 0.24587350040360367, 294.1501859418347, 0.48550411896102214], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, 27.272727272727273, 1180.0, 123, 2031, 1240.0, 1856.6, 2008.3499999999997, 2031.0, 0.10498236773414647, 0.033030673939081594, 0.047365091692554366], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 82.0, 78, 90, 80.0, 90.0, 90.0, 90.0, 0.035962685117921646, 0.009693067473189819, 0.021177245240338628], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 113.2, 79, 235, 81.0, 235.0, 235.0, 235.0, 0.03592263700893755, 0.0096822732563152, 0.02111858152283243], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 12, 0, 0.0, 183.5, 79, 854, 80.5, 668.6000000000006, 854.0, 854.0, 0.10522900462130713, 7.9164359073151696, 0.061109552162894494], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 12, 0, 0.0, 150.58333333333334, 78, 460, 80.0, 393.7000000000003, 460.0, 460.0, 0.10559383332013411, 2.6134301881770106, 0.06142453780699207], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 83.6, 79, 91, 83.0, 91.0, 91.0, 91.0, 0.03596294378272628, 0.009622897066862304, 0.02051011637608608], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 12, 0, 0.0, 81.66666666666666, 78, 93, 81.0, 90.00000000000001, 93.0, 93.0, 0.10594623228711429, 0.07873543239306052, 0.053180042378492914], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 83.2, 80, 93, 81.0, 93.0, 93.0, 93.0, 0.03596242645683789, 0.026725982943021132, 0.01805145234259246], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 12, 0, 0.0, 132.66666666666666, 78, 237, 83.5, 236.7, 237.0, 237.0, 0.1058023787901498, 0.04155291992523299, 0.05959994026574031], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 85.0, 82, 90, 83.0, 90.0, 90.0, 90.0, 0.03667678946055778, 0.028868644829306223, 0.013037452503557648], "isController": false}, {"data": ["deleteAccount", 13, 2, 15.384615384615385, 740.1538461538462, 78, 1753, 761.0, 1647.0, 1753.0, 1753.0, 0.06695301958118312, 0.012991259733939001, 0.04556245525735711], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1597.0000000000002, 1071, 3472, 1405.5, 2362.5999999999995, 3324.399999999998, 3472.0, 0.10104675249516584, 0.052299588693787, 0.04647755900900694], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 198.8, 164, 316, 173.0, 316.0, 316.0, 316.0, 0.03590148632153371, 0.055640291789330075, 0.08074328417821497], "isController": false}, {"data": ["addBook", 59, 13, 22.033898305084747, 886.1016949152541, 400, 2456, 708.0, 1468.0, 1675.0, 2456.0, 0.26734817795419735, 82.36478915461333, 0.9713541312656897], "isController": true}, {"data": ["https://demoqa.com/books-0", 53, 0, 0.0, 142.6603773584906, 79, 366, 82.0, 323.4, 326.3, 366.0, 0.24666306755775635, 0.18331112735493418, 0.11923654144637638], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=701a5c60-ad39-48d7-8a62-e783e190abe9", 1, 0, 0.0, 197.0, 197, 197, 197.0, 197.0, 197.0, 197.0, 5.076142131979695, 0.9170764593908629, 3.4997620558375635], "isController": false}, {"data": ["https://demoqa.com/books-3", 53, 0, 0.0, 517.4716981132076, 386, 716, 468.0, 701.2, 706.2, 716.0, 0.24641191703822177, 72.4532852549201, 0.1239278684323088], "isController": false}, {"data": ["https://demoqa.com/books-1", 53, 0, 0.0, 126.2830188679245, 79, 329, 83.0, 239.0, 249.09999999999997, 329.0, 0.2468537787258619, 0.4368154756359978, 0.1200519353569133], "isController": false}, {"data": ["https://demoqa.com/books-2", 53, 0, 0.0, 777.8490566037738, 538, 1310, 773.0, 935.4, 1040.1999999999998, 1310.0, 0.24633747304231426, 221.65489125856374, 0.12364986439819291], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 23, 0, 0.0, 96.82608695652173, 79, 328, 84.0, 109.00000000000003, 285.7999999999994, 328.0, 0.13274157523850197, 0.09916729009516993, 0.04718548182306125], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dd4c1d2a-9390-4dfe-a0f1-cbc0ea518acf", 1, 0, 0.0, 211.0, 211, 211, 211.0, 211.0, 211.0, 211.0, 4.739336492890995, 1.5134404620853081, 2.827865817535545], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 13, 7.60233918128655, 155.81871345029234, 80, 1411, 88.0, 283.6, 362.6000000000001, 1277.0800000000002, 0.7364626535912244, 1.5647181697934027, 0.35507540128601023], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 83.72727272727273, 80, 90, 83.0, 90.0, 90.0, 90.0, 0.05165798655953113, 0.040004671232136906, 0.018362799909833333], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a74be7b3-9a93-4239-bd7a-f1f1dfc5100c", 3, 0, 0.0, 322.3333333333333, 204, 429, 334.0, 429.0, 429.0, 429.0, 0.06916267060125414, 0.03129430733585393, 0.0443523636342678], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 84.73333333333333, 80, 99, 83.0, 97.8, 99.0, 99.0, 0.07212474696234608, 0.05853092258370077, 0.025638093646771453], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f8400791-a8d2-4634-9c4b-dff976b6effc", 1, 0, 0.0, 424.0, 424, 424, 424.0, 424.0, 424.0, 424.0, 2.3584905660377355, 0.4260944870283019, 1.626068691037736], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/69c49b0f-5297-4adf-8735-3ced89ab3d44", 1, 0, 0.0, 185.0, 185, 185, 185.0, 185.0, 185.0, 185.0, 5.405405405405405, 1.7261402027027026, 3.2252956081081083], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=56feac6f-1638-42ad-aed6-ce16be195dba", 1, 0, 0.0, 470.0, 470, 470, 470.0, 470.0, 470.0, 470.0, 2.127659574468085, 0.38439162234042556, 1.4669215425531916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 326.90909090909093, 159, 1171, 164.0, 1035.4000000000005, 1171.0, 1171.0, 0.05192475630767778, 5.720435710661096, 0.11557222704099696], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3f98fa3b-b65e-4cb3-846a-53ac5a62881f", 3, 0, 0.0, 630.3333333333333, 171, 1488, 232.0, 1488.0, 1488.0, 1488.0, 0.026043023074118443, 0.0261193209932809, 0.01670076675000434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 12, 0, 0.0, 292.4166666666667, 162, 932, 240.5, 752.0000000000007, 932.0, 932.0, 0.1051533925113259, 10.632721175373952, 0.23425040418335247], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=59380229-4206-4e83-84e4-c7799cb7aaa2", 1, 0, 0.0, 1840.0, 1840, 1840, 1840.0, 1840.0, 1840.0, 1840.0, 0.5434782608695652, 0.09818699048913043, 0.3747027853260869], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/87edf00c-bb84-4ec8-9884-8d67573e64cf", 3, 0, 0.0, 577.0, 379, 965, 387.0, 965.0, 965.0, 965.0, 0.022011401906187403, 0.02601673187544481, 0.01411538468593398], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 111.99999999999999, 81, 248, 92.0, 243.5, 248.0, 248.0, 0.08031345192953068, 0.06658800848454252, 0.02854892236557536], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 97.62500000000001, 82, 242, 84.0, 155.2000000000001, 242.0, 242.0, 0.07990172088331353, 0.062033074318588136, 0.02840256484524035], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8ee1480d-ee7d-4311-a415-7c7a79b4229a", 3, 0, 0.0, 322.6666666666667, 185, 427, 356.0, 427.0, 427.0, 427.0, 0.08411136344520145, 0.038058201558863934, 0.05393860220932514], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 23, 0, 0.0, 89.86956521739131, 79, 238, 81.0, 106.00000000000003, 213.59999999999965, 238.0, 0.12295717348187986, 0.09137735255831111, 0.06171873747039673], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 23, 0, 0.0, 107.78260869565219, 78, 239, 79.0, 235.8, 238.6, 239.0, 0.12295914548739935, 0.03290117760112053, 0.07012513766078245], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 23, 0, 0.0, 129.3478260869565, 79, 242, 81.0, 238.0, 241.2, 242.0, 0.12295848814519793, 0.03314115500788538, 0.0722861424447355], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 23, 0, 0.0, 107.34782608695653, 78, 239, 80.0, 237.6, 238.8, 239.0, 0.12295848814519793, 0.03314115500788538, 0.0724062190933148], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 22.22222222222222, 0.4716981132075472], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 7.407407407407407, 0.15723270440251572], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 7.407407407407407, 0.15723270440251572], "isController": false}, {"data": ["401/Unauthorized", 17, 62.96296296296296, 1.3364779874213837], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1272, 27, "401/Unauthorized", 17, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
