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

    var data = {"OkPercent": 99.10786699107867, "KoPercent": 0.8921330089213301};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8128941836019622, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.33962264150943394, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c0e0ec63-79de-4205-ac27-59816dfc168f"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e5164802-1b37-4663-bbba-6ce73f6493ff"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=02c95436-2971-4685-aa8e-daf0476a1b47"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/65aea120-8509-4524-9a69-83f52e741692"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c0e0ec63-79de-4205-ac27-59816dfc168f"], "isController": false}, {"data": [0.4811320754716981, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.6363636363636364, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6363636363636364, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cf442255-165a-4959-839b-2487f541e15b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=41f7083c-5c59-48ff-9578-c9c8afa394be"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6fcf2f7b-a4ee-49e5-9aae-8d445927ded0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5909090909090909, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6fcf2f7b-a4ee-49e5-9aae-8d445927ded0"], "isController": false}, {"data": [0.275, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=266b5480-0002-42ef-b0e0-d7bba1584b55"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.4375, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9d6a9528-a98c-453a-af95-8c6f77808789"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0e7cee65-d62d-41ff-8851-57f2677f2b08"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/02c95436-2971-4685-aa8e-daf0476a1b47"], "isController": false}, {"data": [0.8207547169811321, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6d93a475-5341-402b-bee6-c7ee6df6e04a"], "isController": false}, {"data": [0.6363636363636364, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9575757575757575, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=52cf7e44-97b2-4fa6-94c1-cf3ec6640adc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c3bc43c8-d9b3-4626-92e0-965ee3b454a8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/52cf7e44-97b2-4fa6-94c1-cf3ec6640adc"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6a142093-e179-461f-9ac7-9ae7b30bac49"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9d6a9528-a98c-453a-af95-8c6f77808789"], "isController": false}, {"data": [0.6, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c3bc43c8-d9b3-4626-92e0-965ee3b454a8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/266b5480-0002-42ef-b0e0-d7bba1584b55"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cf442255-165a-4959-839b-2487f541e15b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/41f7083c-5c59-48ff-9578-c9c8afa394be"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=65aea120-8509-4524-9a69-83f52e741692"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6a142093-e179-461f-9ac7-9ae7b30bac49"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "register"], "isController": true}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1233, 11, 0.8921330089213301, 323.11354420113565, 78, 3217, 105.0, 874.2000000000003, 1094.3, 1775.9800000000002, 4.832925036746692, 687.7676001347379, 3.541297923811857], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 53, 0, 0.0, 1391.6603773584905, 979, 1907, 1391.0, 1671.8, 1782.3999999999996, 1907.0, 0.23430799564982893, 281.9503983719463, 1.1520905840789928], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 103.0, 85, 247, 90.0, 161.39999999999992, 247.0, 247.0, 0.08201110526848988, 0.06367073114106393, 0.029152385075908515], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 282.7, 162, 1051, 171.5, 472.7000000000003, 1022.7999999999996, 1051.0, 0.14986549571759347, 9.185210863094122, 0.3351337877380051], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c0e0ec63-79de-4205-ac27-59816dfc168f", 3, 0, 0.0, 357.6666666666667, 198, 467, 408.0, 467.0, 467.0, 467.0, 0.047135719448197846, 0.030856097594507116, 0.03022700758885083], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 21, 0, 0.0, 381.6666666666667, 162, 988, 326.0, 957.2, 986.5, 988.0, 0.09405905116812383, 16.200280623499534, 0.2081030262939838], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e5164802-1b37-4663-bbba-6ce73f6493ff", 1, 0, 0.0, 185.0, 185, 185, 185.0, 185.0, 185.0, 185.0, 5.405405405405405, 1.7261402027027026, 3.2252956081081083], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=02c95436-2971-4685-aa8e-daf0476a1b47", 1, 0, 0.0, 1795.0, 1795, 1795, 1795.0, 1795.0, 1795.0, 1795.0, 0.5571030640668524, 0.10064850278551532, 0.3840964484679666], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 4, 0, 0.0, 121.25, 84, 233, 84.0, 233.0, 233.0, 233.0, 0.03271930111572817, 0.024315808739325328, 0.01642355544285574], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 4, 0, 0.0, 121.25, 82, 236, 83.5, 236.0, 236.0, 236.0, 0.03271930111572817, 0.008754969243856952, 0.01866022641756372], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/65aea120-8509-4524-9a69-83f52e741692", 3, 0, 0.0, 886.3333333333334, 186, 2079, 394.0, 2079.0, 2079.0, 2079.0, 0.018730450092715727, 0.025821437546435906, 0.012011388894091792], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 4, 0, 0.0, 142.0, 80, 323, 82.5, 323.0, 323.0, 323.0, 0.0327195687560838, 0.00881894626628821, 0.019235527725744574], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 4, 0, 0.0, 82.0, 80, 84, 82.0, 84.0, 84.0, 84.0, 0.0327195687560838, 0.00881894626628821, 0.019267480429607936], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c0e0ec63-79de-4205-ac27-59816dfc168f", 1, 0, 0.0, 463.0, 463, 463, 463.0, 463.0, 463.0, 463.0, 2.1598272138228944, 0.3902031587473002, 1.4890996220302375], "isController": false}, {"data": ["https://demoqa.com/books", 53, 0, 0.0, 954.4528301886795, 631, 1539, 877.0, 1315.0, 1433.6999999999996, 1539.0, 0.2335923416971145, 279.45765050729204, 0.4612536278433257], "isController": false}, {"data": ["deleteBook", 11, 0, 0.0, 776.6363636363635, 423, 1854, 562.0, 1719.2000000000005, 1854.0, 1854.0, 0.059713808003821686, 0.010788139141315442, 0.04058672887759755], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 11, 0, 0.0, 776.6363636363635, 423, 1854, 562.0, 1719.2000000000005, 1854.0, 1854.0, 0.05894425481065498, 0.010649108535128097, 0.04006367319161706], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 7, 33.333333333333336, 1088.1904761904764, 326, 1842, 1072.0, 1778.6000000000001, 1837.6, 1842.0, 0.08390032641222228, 0.026218852003819463, 0.03785346758051435], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 82.55555555555556, 80, 86, 82.0, 86.0, 86.0, 86.0, 0.060921952210113046, 0.016420369931632033, 0.03587493865497868], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 12, 0, 0.0, 107.08333333333333, 80, 240, 81.0, 238.20000000000002, 240.0, 240.0, 0.10169577708285664, 0.027211565352248748, 0.05799837286756668], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 99.55555555555554, 79, 244, 82.0, 244.0, 244.0, 244.0, 0.06092153982576439, 0.01642025878116306, 0.03581520212413102], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 12, 0, 0.0, 95.5, 80, 244, 82.0, 196.00000000000017, 244.0, 244.0, 0.10169319164081965, 0.07557472542838257, 0.0510452153353333], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cf442255-165a-4959-839b-2487f541e15b", 3, 0, 0.0, 486.0, 256, 725, 477.0, 725.0, 725.0, 725.0, 0.09022827754218173, 0.04082594589310956, 0.05786123266865169], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 12, 0, 0.0, 133.66666666666669, 79, 241, 81.5, 241.0, 241.0, 241.0, 0.10155807005814199, 0.027373073570358585, 0.059804215083066034], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 12, 0, 0.0, 132.25, 78, 240, 82.0, 238.8, 240.0, 240.0, 0.10156236775733364, 0.027374231934593835, 0.059707563857338726], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=41f7083c-5c59-48ff-9578-c9c8afa394be", 1, 0, 0.0, 752.0, 752, 752, 752.0, 752.0, 752.0, 752.0, 1.3297872340425532, 0.24024476396276595, 0.9168259640957447], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 130.7058823529412, 80, 261, 83.0, 251.39999999999998, 261.0, 261.0, 0.08121536403592584, 0.021890078587808143, 0.04774575112268298], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 120.64705882352939, 78, 262, 83.0, 246.0, 262.0, 262.0, 0.08121381208079341, 0.021889660287401348, 0.04782414910617033], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6fcf2f7b-a4ee-49e5-9aae-8d445927ded0", 3, 0, 0.0, 452.66666666666663, 193, 830, 335.0, 830.0, 830.0, 830.0, 0.01655729652462346, 0.022825569915944127, 0.010617797576011789], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 93.29411764705881, 80, 235, 84.0, 120.5999999999999, 235.0, 235.0, 0.08121070834846082, 0.06035287993474481, 0.0407639688389735], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 82.77777777777777, 81, 86, 82.0, 86.0, 86.0, 86.0, 0.060921952210113046, 0.016301381743721654, 0.034744550869830096], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 110.47058823529412, 78, 247, 82.0, 246.2, 247.0, 247.0, 0.08121575203397685, 0.021731558649716463, 0.046318358581877425], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 84.44444444444444, 82, 89, 84.0, 89.0, 89.0, 89.0, 0.06092030270621522, 0.045273779647880645, 0.030579136319330687], "isController": false}, {"data": ["deleteAccount", 11, 0, 0.0, 839.5454545454545, 408, 2079, 679.0, 1937.4000000000005, 2079.0, 2079.0, 0.05935486655946818, 0.010723291321778919, 0.04040072460151301], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 125.99999999999997, 84, 253, 90.0, 253.0, 253.0, 253.0, 0.059732795295710524, 0.04701624317220965, 0.0212331420777721], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6fcf2f7b-a4ee-49e5-9aae-8d445927ded0", 1, 0, 0.0, 511.0, 511, 511, 511.0, 511.0, 511.0, 511.0, 1.9569471624266144, 0.35355002446183953, 1.349223336594912], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1741.9, 1086, 3217, 1493.5, 3108.2000000000003, 3212.65, 3217.0, 0.08357500438768774, 0.04325659406784619, 0.03844123736972746], "isController": false}, {"data": ["goToProfile", 11, 0, 0.0, 246.1818181818182, 185, 467, 196.0, 440.6000000000001, 467.0, 467.0, 0.05951060641307935, 0.14713342311770655, 0.038472677192830596], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 186.33333333333334, 166, 330, 168.0, 330.0, 330.0, 330.0, 0.06088609564529114, 0.09436155643464554, 0.13693425612412644], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=266b5480-0002-42ef-b0e0-d7bba1584b55", 1, 0, 0.0, 518.0, 518, 518, 518.0, 518.0, 518.0, 518.0, 1.9305019305019306, 0.3487723214285714, 1.3309905888030888], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 99.49999999999999, 80, 246, 83.0, 228.80000000000032, 245.9, 246.0, 0.15014902290523346, 0.11158535784265884, 0.07536777126297851], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 121.2, 79, 244, 82.0, 242.0, 243.9, 244.0, 0.14997000599880023, 0.05139108896970605, 0.08490001218506298], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 587.0, 478, 734, 594.5, 734.0, 734.0, 734.0, 0.14160628731915698, 41.636950243090794, 0.08075983573670671], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 873.6666666666666, 738, 970, 912.5, 970.0, 970.0, 970.0, 0.14126289023873428, 127.10859695048737, 0.08042604004802939], "isController": false}, {"data": ["addBook", 56, 4, 7.142857142857143, 905.9285714285712, 432, 2648, 774.0, 1394.7000000000003, 1780.6999999999998, 2648.0, 0.25745705984037665, 77.9937123440316, 0.9372776703124426], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 165.0, 79, 251, 165.0, 251.0, 251.0, 251.0, 0.1434617315831002, 0.2538600172154078, 0.07943632989025178], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 81.99999999999999, 80, 84, 82.0, 84.0, 84.0, 84.0, 0.05885353317377487, 0.04373783080590105, 0.029541714893867463], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9d6a9528-a98c-453a-af95-8c6f77808789", 3, 0, 0.0, 353.66666666666663, 192, 673, 196.0, 673.0, 673.0, 673.0, 0.020448643232521522, 0.02416960402906434, 0.013113224989605272], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 109.91666666666669, 79, 247, 83.0, 246.4, 247.0, 247.0, 0.058854110469165354, 0.015748072527882136, 0.03356523487694586], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0e7cee65-d62d-41ff-8851-57f2677f2b08", 1, 0, 0.0, 211.0, 211, 211, 211.0, 211.0, 211.0, 211.0, 4.739336492890995, 1.5134404620853081, 2.827865817535545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 110.49999999999999, 80, 250, 83.0, 248.5, 250.0, 250.0, 0.05885353317377487, 0.015862866363244008, 0.034599440400988744], "isController": false}, {"data": ["https://demoqa.com/books-0", 53, 0, 0.0, 147.03773584905667, 82, 358, 86.0, 334.6, 348.0, 358.0, 0.23451119901593792, 0.17428029536243042, 0.11336234718055592], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 110.58333333333333, 78, 260, 83.5, 254.3, 260.0, 260.0, 0.05880219920225017, 0.015849030253731487, 0.0346266856630438], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/02c95436-2971-4685-aa8e-daf0476a1b47", 3, 0, 0.0, 361.66666666666663, 196, 639, 250.0, 639.0, 639.0, 639.0, 0.01640123993373899, 0.022610433307091348, 0.0105177222231334], "isController": false}, {"data": ["https://demoqa.com/books-3", 53, 0, 0.0, 516.6792452830186, 385, 723, 486.0, 645.8, 716.6999999999999, 723.0, 0.23430695980088329, 68.89402590473432, 0.11783992607173328], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 109.16666666666667, 79, 244, 83.0, 244.0, 244.0, 244.0, 0.14346859233399487, 0.106620701920088, 0.08056097714067095], "isController": false}, {"data": ["https://demoqa.com/books-1", 53, 0, 0.0, 114.8679245283019, 78, 333, 86.0, 246.8, 254.09999999999997, 333.0, 0.2347989810610256, 0.4154841344556429, 0.11418934821131908], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 605.7142857142858, 79, 972, 742.0, 941.0, 972.0, 972.0, 0.07587294533354288, 48.77056402389456, 0.03994761379586926], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 142.20000000000002, 79, 804, 82.0, 250.20000000000002, 776.3499999999996, 804.0, 0.14995988573056707, 6.785106370764571, 0.08751565206307313], "isController": false}, {"data": ["https://demoqa.com/books-2", 53, 0, 0.0, 805.6981132075473, 541, 1202, 795.0, 1002.8, 1085.3999999999996, 1202.0, 0.2339645963007107, 210.52175501727143, 0.11743926025250519], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 21, 0, 0.0, 89.80952380952381, 83, 116, 87.0, 110.40000000000002, 115.9, 116.0, 0.09417631600190146, 0.07035632982563927, 0.03347673732880091], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 475.2142857142856, 79, 803, 630.0, 763.5, 803.0, 803.0, 0.07587171177420578, 15.940701684622972, 0.04002105778714733], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 133.60000000000002, 80, 641, 82.0, 241.70000000000002, 621.0499999999997, 641.0, 0.15015015015015015, 2.2459031296921923, 0.08777332019519521], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6d93a475-5341-402b-bee6-c7ee6df6e04a", 1, 0, 0.0, 187.0, 187, 187, 187.0, 187.0, 187.0, 187.0, 5.347593582887701, 1.7076788101604279, 3.1908004679144386], "isController": false}, {"data": ["deleteBooks", 11, 0, 0.0, 702.8181818181819, 215, 1795, 518.0, 1658.2000000000005, 1795.0, 1795.0, 0.059156641408573414, 0.010687479160728595, 0.04078573128364534], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 165, 4, 2.4242424242424243, 162.9757575757576, 82, 1582, 91.0, 313.20000000000005, 359.09999999999985, 1008.460000000003, 0.6807043020511889, 1.4556500519810558, 0.32800793948745033], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 4, 0, 0.0, 95.0, 84, 105, 95.5, 105.0, 105.0, 105.0, 0.03343726750649937, 0.025894290168607424, 0.011885903683950948], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=52cf7e44-97b2-4fa6-94c1-cf3ec6640adc", 1, 0, 0.0, 215.0, 215, 215, 215.0, 215.0, 215.0, 215.0, 4.651162790697675, 0.8402979651162791, 3.2067587209302326], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 235.58333333333334, 166, 342, 171.0, 338.7, 342.0, 342.0, 0.05877829317632998, 0.09109487428792547, 0.13219375896981245], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c3bc43c8-d9b3-4626-92e0-965ee3b454a8", 3, 0, 0.0, 336.6666666666667, 287, 416, 307.0, 416.0, 416.0, 416.0, 0.031543419516965106, 0.026296450971011597, 0.02022803920847046], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 12, 0, 0.0, 85.83333333333333, 82, 94, 85.5, 92.2, 94.0, 94.0, 0.09484516526770048, 0.0769690745482999, 0.03371449234125291], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/52cf7e44-97b2-4fa6-94c1-cf3ec6640adc", 3, 0, 0.0, 598.3333333333333, 187, 1371, 237.0, 1371.0, 1371.0, 1371.0, 0.095047999239616, 0.04207854133003834, 0.060952004720717295], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6a142093-e179-461f-9ac7-9ae7b30bac49", 3, 0, 0.0, 610.0, 222, 976, 632.0, 976.0, 976.0, 976.0, 0.019336500222369754, 0.02285508864173977, 0.012400034322287895], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9d6a9528-a98c-453a-af95-8c6f77808789", 1, 0, 0.0, 807.0, 807, 807, 807.0, 807.0, 807.0, 807.0, 1.2391573729863692, 0.22387120508054523, 0.8543409231722429], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 785.2500000000001, 97, 1777, 659.0, 1767.4, 1776.85, 1777.0, 0.08577874231208021, 0.05269026261161959, 0.03878472430712221], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 86.64285714285714, 80, 126, 83.5, 108.0, 126.0, 126.0, 0.07587171177420578, 0.056385129550947856, 0.03808404282416189], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 173.8571428571429, 80, 253, 235.0, 249.5, 253.0, 253.0, 0.07587253414264036, 0.10169968025146325, 0.03871954937134186], "isController": false}, {"data": ["login", 20, 0, 0.0, 3071.4, 1724, 4601, 2927.0, 4477.6, 4595.2, 4601.0, 0.08361658451337238, 30.123682973468455, 0.16775577267995334], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 4, 0, 0.0, 265.75, 168, 557, 169.0, 557.0, 557.0, 557.0, 0.03269656767780802, 0.05067329385222786, 0.07353534703319518], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 98.10000000000001, 83, 264, 86.5, 106.9, 256.14999999999986, 264.0, 0.1476843100189036, 0.11956083301335066, 0.05249715707703213], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c3bc43c8-d9b3-4626-92e0-965ee3b454a8", 1, 0, 0.0, 459.0, 459, 459, 459.0, 459.0, 459.0, 459.0, 2.1786492374727673, 0.3936036220043573, 1.502076525054466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 253.76470588235296, 165, 482, 179.0, 375.5999999999999, 482.0, 482.0, 0.08117735820225577, 0.12580905026072256, 0.1825697811912061], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/266b5480-0002-42ef-b0e0-d7bba1584b55", 3, 0, 0.0, 721.3333333333334, 191, 1294, 679.0, 1294.0, 1294.0, 1294.0, 0.019431813765496873, 0.02296774602295545, 0.01246115661394168], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cf442255-165a-4959-839b-2487f541e15b", 1, 0, 0.0, 1111.0, 1111, 1111, 1111.0, 1111.0, 1111.0, 1111.0, 0.9000900090009001, 0.16261391764176417, 0.6205698694869487], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/41f7083c-5c59-48ff-9578-c9c8afa394be", 3, 0, 0.0, 283.6666666666667, 185, 439, 227.0, 439.0, 439.0, 439.0, 0.03179077431729312, 0.026502660490425677, 0.02038666191571206], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 95.66666666666666, 83, 143, 88.5, 132.80000000000004, 143.0, 143.0, 0.0605433768068414, 0.050196608309578464, 0.021521278474306904], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 694.2142857142858, 162, 1059, 827.5, 1027.0, 1059.0, 1059.0, 0.07583759919828824, 64.83939103084965, 0.15670070894612823], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=65aea120-8509-4524-9a69-83f52e741692", 1, 0, 0.0, 646.0, 646, 646, 646.0, 646.0, 646.0, 646.0, 1.5479876160990713, 0.2796657314241486, 1.067264899380805], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 87.35714285714286, 82, 103, 85.5, 99.5, 103.0, 103.0, 0.07369778643434316, 0.05721654317900666, 0.026197260021582923], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 12, 0, 0.0, 269.16666666666663, 162, 485, 317.5, 436.70000000000016, 485.0, 485.0, 0.101485923056756, 0.1572833592686248, 0.2282442195309659], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 0, 0.0, 983.5, 823, 1202, 994.5, 1202.0, 1202.0, 1202.0, 0.1409807561267887, 168.6619971686365, 0.3178950838835499], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6a142093-e179-461f-9ac7-9ae7b30bac49", 1, 0, 0.0, 454.0, 454, 454, 454.0, 454.0, 454.0, 454.0, 2.2026431718061676, 0.39793846365638763, 1.518619218061674], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 21, 0, 0.0, 109.28571428571428, 80, 253, 83.0, 242.6, 252.1, 253.0, 0.09409445290796666, 0.06992761588179944, 0.0472310046823192], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 21, 0, 0.0, 154.85714285714286, 78, 325, 87.0, 246.8, 317.1999999999999, 325.0, 0.09409360969970697, 0.04536656181950158, 0.05253384849584644], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 21, 0, 0.0, 240.04761904761907, 80, 902, 87.0, 875.8000000000001, 901.0, 902.0, 0.09409318810124427, 12.116768911330613, 0.0541613412535901], "isController": false}, {"data": ["register", 21, 7, 33.333333333333336, 1088.1904761904764, 326, 1842, 1072.0, 1778.6000000000001, 1837.6, 1842.0, 0.0826846525472779, 0.025838953921024345, 0.0373049897234789], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 21, 0, 0.0, 210.14285714285714, 79, 726, 84.0, 633.4, 717.0999999999999, 726.0, 0.09409318810124427, 3.9740982596120675, 0.054253229132595227], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 63.63636363636363, 0.5677210056772101], "isController": false}, {"data": ["401/Unauthorized", 4, 36.36363636363637, 0.32441200324412], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1233, 11, "406/Not Acceptable", 7, "401/Unauthorized", 4, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 165, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
