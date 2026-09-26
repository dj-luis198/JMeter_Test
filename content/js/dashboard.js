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

    var data = {"OkPercent": 98.65871833084948, "KoPercent": 1.3412816691505216};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.829118028534371, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.375, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c81a7f89-fac0-49be-a5fa-258db5f1b387"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c81a7f89-fac0-49be-a5fa-258db5f1b387"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/7c0b0807-6cc7-4887-b54f-56159db0a823"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.49107142857142855, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.75, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.175, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d7bc81c2-2ed3-4752-bd6b-e915b72ebad1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/880e5ac8-4159-4409-b144-a306245440db"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=880e5ac8-4159-4409-b144-a306245440db"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.8, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.2777777777777778, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/928352b0-ae97-448a-a923-5f2ae451aa8f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7fd57ccd-892c-4a80-910c-0af68020543a"], "isController": false}, {"data": [0.4015151515151515, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d7bc81c2-2ed3-4752-bd6b-e915b72ebad1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/86eb9397-6cf1-4be5-81b0-56c7df040b37"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.8303571428571429, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9468085106382979, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=928352b0-ae97-448a-a923-5f2ae451aa8f"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f2fd1821-9054-4aec-8e65-9e6e4e13f3c3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=86eb9397-6cf1-4be5-81b0-56c7df040b37"], "isController": false}, {"data": [0.6388888888888888, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7fd57ccd-892c-4a80-910c-0af68020543a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d3c752b8-1492-4a07-a40c-dbe4c2889e9d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f2fd1821-9054-4aec-8e65-9e6e4e13f3c3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a6b0bd56-4591-48a6-a4ad-482df43a1001"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a6b0bd56-4591-48a6-a4ad-482df43a1001"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/67b2c739-b226-4095-ac86-2153ff4f4c84"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=67b2c739-b226-4095-ac86-2153ff4f4c84"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7c0b0807-6cc7-4887-b54f-56159db0a823"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.175, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1342, 18, 1.3412816691505216, 293.50819672131223, 77, 2557, 89.0, 819.7, 1058.349999999999, 1620.1399999999999, 5.219677640176738, 692.0578208988386, 3.8497956140802945], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1363.696428571428, 966, 1973, 1378.0, 1581.1000000000001, 1631.65, 1973.0, 0.24256915386681221, 291.892214017465, 1.192710634491601], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 189.1578947368421, 160, 332, 164.0, 326.0, 332.0, 332.0, 0.09618499919002106, 0.14906796261187835, 0.21632231751427589], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 103.3529411764706, 83, 342, 86.0, 157.99999999999983, 342.0, 342.0, 0.1015010209808581, 0.0788020621872873, 0.036080441051789404], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c81a7f89-fac0-49be-a5fa-258db5f1b387", 1, 0, 0.0, 386.0, 386, 386, 386.0, 386.0, 386.0, 386.0, 2.5906735751295336, 0.4680416126943005, 1.7861479922279793], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 293.29411764705884, 162, 486, 323.0, 425.19999999999993, 486.0, 486.0, 0.08706161914126516, 0.13492850544647247, 0.19580362195540396], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c81a7f89-fac0-49be-a5fa-258db5f1b387", 3, 0, 0.0, 288.6666666666667, 204, 384, 278.0, 384.0, 384.0, 384.0, 0.025767661584711186, 0.025843152780760145, 0.01652418402404982], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 96.0, 80, 241, 81.0, 209.80000000000013, 241.0, 241.0, 0.04937739592591595, 0.036695506151974644, 0.02478513818937578], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7c0b0807-6cc7-4887-b54f-56159db0a823", 3, 0, 0.0, 934.0, 171, 2209, 422.0, 2209.0, 2209.0, 2209.0, 0.01725814152826596, 0.02379174133209842, 0.011067232685769512], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 108.90909090909092, 77, 243, 81.0, 242.0, 243.0, 243.0, 0.04937739592591595, 0.01321231101923923, 0.02816054611399894], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 81.00000000000001, 78, 83, 81.0, 83.0, 83.0, 83.0, 0.04937739592591595, 0.013308751245657034, 0.029028508151759183], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 137.27272727272728, 77, 238, 84.0, 237.6, 238.0, 238.0, 0.049377174278981036, 0.013308691504881606, 0.029076597744360902], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 955.2499999999998, 622, 1619, 937.0, 1240.7, 1257.45, 1619.0, 0.24363397475777995, 291.4709346843417, 0.4810819306252257], "isController": false}, {"data": ["deleteBook", 10, 0, 0.0, 706.5, 426, 2453, 460.0, 2277.6000000000004, 2453.0, 2453.0, 0.1176512112192195, 0.021255345776909775, 0.07996605762556326], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 10, 0, 0.0, 706.5, 426, 2453, 460.0, 2277.6000000000004, 2453.0, 2453.0, 0.11306589480349148, 0.02042694388539641, 0.0768494753742481], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 20, 8, 40.0, 1188.8500000000004, 151, 2217, 1054.0, 2079.7, 2210.2, 2217.0, 0.07995075033779192, 0.024797224909455774, 0.036071529937558466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 11, 0, 0.0, 95.63636363636364, 79, 240, 81.0, 208.6000000000001, 240.0, 240.0, 0.05742775849017202, 0.015478575530554178, 0.03381732262653685], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 100.5625, 77, 245, 80.5, 242.2, 245.0, 245.0, 0.12537809331264596, 0.03354843512467284, 0.07150469384236839], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 11, 0, 0.0, 109.27272727272727, 79, 237, 81.0, 236.8, 237.0, 237.0, 0.05742865794447171, 0.01547881796159589, 0.03376176961188669], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 81.99999999999999, 79, 85, 82.0, 85.0, 85.0, 85.0, 0.12537809331264596, 0.09317649317473005, 0.06293392574482423], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 111.68749999999999, 77, 243, 82.0, 241.6, 243.0, 243.0, 0.12537711084120204, 0.033793049406417745, 0.07383046663793441], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 110.5, 78, 237, 81.5, 235.6, 237.0, 237.0, 0.12537809331264596, 0.0337933142131741, 0.07370860563887975], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 99.11764705882351, 79, 242, 81.0, 234.79999999999998, 242.0, 242.0, 0.10690680870598741, 0.02881472578403567, 0.06284951058691839], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d7bc81c2-2ed3-4752-bd6b-e915b72ebad1", 1, 0, 0.0, 643.0, 643, 643, 643.0, 643.0, 643.0, 643.0, 1.5552099533437014, 0.2809705482115085, 1.072244362363919], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 99.47058823529412, 79, 241, 81.0, 238.6, 241.0, 241.0, 0.10700842219228784, 0.02884211379401508, 0.06301374861518512], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/880e5ac8-4159-4409-b144-a306245440db", 3, 0, 0.0, 353.0, 253, 409, 397.0, 409.0, 409.0, 409.0, 0.017747698715066613, 0.024466635435646845, 0.011381173980690504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 11, 0, 0.0, 94.45454545454545, 78, 241, 80.0, 209.0000000000001, 241.0, 241.0, 0.057428957768832785, 0.01536673284048846, 0.03275245247753745], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 102.88235294117646, 81, 244, 83.0, 243.2, 244.0, 244.0, 0.10700707505602135, 0.07952381261487525, 0.05371253572147947], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 11, 0, 0.0, 97.54545454545455, 79, 256, 82.0, 222.20000000000013, 256.0, 256.0, 0.057428058305141375, 0.04267846911153573, 0.028826193328947917], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 109.0, 79, 242, 81.0, 242.0, 242.0, 242.0, 0.10690075836655641, 0.028604304484801224, 0.0609668387559267], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=880e5ac8-4159-4409-b144-a306245440db", 1, 0, 0.0, 1353.0, 1353, 1353, 1353.0, 1353.0, 1353.0, 1353.0, 0.7390983000739099, 0.13352850147819662, 0.5095736326681448], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 11, 0, 0.0, 113.63636363636364, 82, 247, 84.0, 246.6, 247.0, 247.0, 0.05950964056177101, 0.04684059598905023, 0.02115381754344204], "isController": false}, {"data": ["deleteAccount", 10, 0, 0.0, 576.5, 384, 1283, 460.0, 1236.5000000000002, 1283.0, 1283.0, 0.11076650420912716, 0.020011526639344263, 0.07539477874390785], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 18, 0, 0.0, 1471.7777777777778, 749, 2377, 1407.0, 2362.6, 2377.0, 2377.0, 0.07794907327212888, 0.04034473518967608, 0.03585352881950459], "isController": false}, {"data": ["goToProfile", 10, 0, 0.0, 228.20000000000002, 171, 343, 195.5, 339.5, 343.0, 343.0, 0.11796208698524295, 0.3883763477168438, 0.07626064607835042], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 11, 0, 0.0, 223.0909090909091, 161, 497, 165.0, 462.8000000000001, 497.0, 497.0, 0.05740348386962103, 0.08896418837996932, 0.1291017806169309], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/928352b0-ae97-448a-a923-5f2ae451aa8f", 3, 0, 0.0, 310.6666666666667, 199, 510, 223.0, 510.0, 510.0, 510.0, 0.01785586743804014, 0.024615754752636717, 0.011450539991191106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 80.94736842105263, 79, 84, 80.0, 84.0, 84.0, 84.0, 0.09630786074897102, 0.07157254104488961, 0.04834203166501085], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 80.63157894736842, 78, 83, 81.0, 83.0, 83.0, 83.0, 0.09630981346309814, 0.025770399305555556, 0.054926690490673155], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 590.0, 466, 688, 621.0, 688.0, 688.0, 688.0, 0.10890195712374375, 32.020791279675784, 0.06210814742213509], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 850.5714285714286, 710, 962, 889.0, 962.0, 962.0, 962.0, 0.10836752070593698, 97.5092856209846, 0.0616975239956653], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7fd57ccd-892c-4a80-910c-0af68020543a", 1, 0, 0.0, 458.0, 458, 458, 458.0, 458.0, 458.0, 458.0, 2.1834061135371177, 0.39446301855895194, 1.5053561681222707], "isController": false}, {"data": ["addBook", 66, 10, 15.151515151515152, 765.6969696969697, 413, 1710, 678.5, 1413.0, 1622.1, 1710.0, 0.29237693588971186, 59.35868704205355, 1.071010494560017], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 153.57142857142856, 81, 261, 83.0, 261.0, 261.0, 261.0, 0.10982114841543772, 0.194331954032005, 0.060809171046438654], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d7bc81c2-2ed3-4752-bd6b-e915b72ebad1", 3, 0, 0.0, 274.0, 187, 438, 197.0, 438.0, 438.0, 438.0, 0.02643032086409529, 0.02650775344475182, 0.01694913154370694], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 82.60000000000002, 79, 93, 82.0, 88.8, 93.0, 93.0, 0.0757395971663292, 0.0562869467222427, 0.03801772748388009], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 134.20000000000002, 79, 246, 82.0, 245.4, 246.0, 246.0, 0.07567731194187982, 0.027827178245295393, 0.04273600285051208], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 132.8, 78, 697, 81.0, 424.60000000000014, 697.0, 697.0, 0.07574036203893054, 4.5624741614910755, 0.04409311961927845], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/86eb9397-6cf1-4be5-81b0-56c7df040b37", 3, 0, 0.0, 420.3333333333333, 343, 482, 436.0, 482.0, 482.0, 482.0, 0.017441252049347118, 0.024044173967768565, 0.011184657075915956], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 152.73214285714286, 79, 388, 84.0, 327.20000000000005, 334.0, 388.0, 0.2442897276169537, 0.18154734640283376, 0.11808927262733603], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 160.26666666666665, 78, 621, 82.0, 402.60000000000014, 621.0, 621.0, 0.07567960283344433, 1.5025258855774857, 0.04413165381374745], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 512.3035714285714, 386, 783, 476.5, 714.9000000000001, 726.6, 783.0, 0.244265219686032, 71.82208495631579, 0.1228482306038149], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 105.0, 81, 239, 82.0, 239.0, 239.0, 239.0, 0.1098228713974176, 0.08161641126311991, 0.06166811626319836], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 124.89285714285714, 79, 332, 83.5, 245.3, 247.15, 332.0, 0.24459809475555475, 0.4328239723604153, 0.11895493280104129], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 640.75, 80, 1180, 813.0, 1138.7, 1180.0, 1180.0, 0.08232951358694254, 46.30847204462774, 0.043978753839899964], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 88.6842105263158, 78, 234, 81.0, 84.0, 234.0, 234.0, 0.09630737258281168, 0.025957846516460957, 0.05661820145981702], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 800.9999999999999, 538, 1228, 804.0, 1008.9, 1091.25, 1228.0, 0.24402572728381935, 219.57477836145438, 0.12248947639051089], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 462.125, 78, 777, 631.5, 770.7, 777.0, 777.0, 0.08232951358694254, 15.138078011073318, 0.04405915375551222], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 86.05882352941177, 82, 92, 85.0, 90.4, 92.0, 92.0, 0.09091103553017177, 0.06791693572322402, 0.03231603216111575], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 98.21052631578945, 78, 252, 81.0, 242.0, 252.0, 252.0, 0.09622543086202792, 0.025935760662030963, 0.056663998837698085], "isController": false}, {"data": ["deleteBooks", 10, 0, 0.0, 607.3000000000001, 386, 1353, 499.0, 1304.5000000000002, 1353.0, 1353.0, 0.11286044805597878, 0.020389827041363353, 0.07781198860109474], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 188, 10, 5.319148936170213, 130.38297872340434, 78, 459, 86.0, 236.1, 298.49999999999983, 409.1599999999992, 0.7873652998060904, 1.5185755258176246, 0.38365408173521914], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 87.72727272727273, 81, 106, 85.0, 104.4, 106.0, 106.0, 0.04988571635888691, 0.038632200266208325, 0.017732813236948083], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=928352b0-ae97-448a-a923-5f2ae451aa8f", 1, 0, 0.0, 868.0, 868, 868, 868.0, 868.0, 868.0, 868.0, 1.152073732718894, 0.20813832085253456, 0.7943008352534562], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 280.8, 161, 778, 315.0, 516.4000000000001, 778.0, 778.0, 0.07564525401676299, 6.142621167937507, 0.16883764605837795], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f2fd1821-9054-4aec-8e65-9e6e4e13f3c3", 3, 0, 0.0, 414.66666666666663, 192, 818, 234.0, 818.0, 818.0, 818.0, 0.02344372724004814, 0.027709691929887627, 0.015033900606411079], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 104.9375, 81, 245, 85.0, 238.0, 245.0, 245.0, 0.12195029001303344, 0.09896551855549882, 0.043349517153070484], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=86eb9397-6cf1-4be5-81b0-56c7df040b37", 1, 0, 0.0, 540.0, 540, 540, 540.0, 540.0, 540.0, 540.0, 1.8518518518518519, 0.33456307870370366, 1.2767650462962963], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 18, 0, 0.0, 685.7777777777777, 114, 1503, 570.5, 1451.7, 1503.0, 1503.0, 0.07692767943381228, 0.04725342808971477, 0.03478273005649911], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 91.68750000000001, 78, 238, 82.0, 130.9000000000001, 238.0, 238.0, 0.08232781908461757, 0.06118307648768942, 0.041324706063958425], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 112.31249999999997, 79, 247, 82.0, 244.9, 247.0, 247.0, 0.08232993722342287, 0.09931450679221981, 0.04263227462179685], "isController": false}, {"data": ["login", 18, 0, 0.0, 2982.4444444444443, 1815, 5269, 2761.0, 4299.700000000002, 5269.0, 5269.0, 0.0767954127540115, 35.83068888018422, 0.16539012069679038], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 235.36363636363632, 161, 479, 167.0, 448.0000000000001, 479.0, 479.0, 0.04935900599936282, 0.07649681886815313, 0.11100956134427009], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7fd57ccd-892c-4a80-910c-0af68020543a", 3, 0, 0.0, 642.3333333333333, 308, 1283, 336.0, 1283.0, 1283.0, 1283.0, 0.016512731315844516, 0.022764133177930183, 0.01058921897532998], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 94.15789473684211, 81, 245, 86.0, 92.0, 245.0, 245.0, 0.09683304962948618, 0.07839316224887113, 0.034421123110481414], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d3c752b8-1492-4a07-a40c-dbe4c2889e9d", 1, 0, 0.0, 376.0, 376, 376, 376.0, 376.0, 376.0, 376.0, 2.6595744680851063, 0.8492977061170213, 1.5869140625], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f2fd1821-9054-4aec-8e65-9e6e4e13f3c3", 1, 0, 0.0, 582.0, 582, 582, 582.0, 582.0, 582.0, 582.0, 1.7182130584192439, 0.31041935137457044, 1.1846273625429553], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 222.76470588235293, 162, 487, 168.0, 485.4, 487.0, 487.0, 0.10684365003048187, 0.16558678964685034, 0.24029387306660133], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a6b0bd56-4591-48a6-a4ad-482df43a1001", 1, 0, 0.0, 390.0, 390, 390, 390.0, 390.0, 390.0, 390.0, 2.5641025641025643, 0.4632411858974359, 1.7678285256410255], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a6b0bd56-4591-48a6-a4ad-482df43a1001", 3, 0, 0.0, 581.6666666666666, 175, 986, 584.0, 986.0, 986.0, 986.0, 0.020719376761147025, 0.02448960189444168, 0.013286839915188683], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 86.26666666666667, 81, 94, 84.0, 93.4, 94.0, 94.0, 0.07433691472069143, 0.06163285214635452, 0.026424450154620784], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 735.9375, 161, 1266, 895.0, 1223.3, 1266.0, 1266.0, 0.08229352041393641, 61.58011475124212, 0.1719203257280405], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/67b2c739-b226-4095-ac86-2153ff4f4c84", 3, 0, 0.0, 1056.0, 176, 2557, 435.0, 2557.0, 2557.0, 2557.0, 0.017585612624125117, 0.024243186674208942, 0.011277232053882317], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 87.12499999999999, 81, 108, 85.0, 98.9, 108.0, 108.0, 0.08340805304752173, 0.06475527555935526, 0.029648956356736242], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=67b2c739-b226-4095-ac86-2153ff4f4c84", 1, 0, 0.0, 456.0, 456, 456, 456.0, 456.0, 456.0, 456.0, 2.1929824561403506, 0.3961931195175438, 1.5119586074561402], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 244.31249999999994, 162, 329, 244.5, 328.3, 329.0, 329.0, 0.1252975817566721, 0.1941867795389049, 0.281797198032828], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 0, 0.0, 956.1428571428571, 792, 1178, 972.0, 1178.0, 1178.0, 1178.0, 0.10822845480688952, 129.47885824778132, 0.24404248256748817], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7c0b0807-6cc7-4887-b54f-56159db0a823", 1, 0, 0.0, 397.0, 397, 397, 397.0, 397.0, 397.0, 397.0, 2.5188916876574305, 0.45507320528967254, 1.7366577455919394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 91.1764705882353, 79, 241, 82.0, 116.19999999999989, 241.0, 241.0, 0.08710176560402513, 0.06473090197721007, 0.04372100343795792], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 136.35294117647058, 77, 238, 82.0, 237.2, 238.0, 238.0, 0.08709864177353328, 0.02330569125580871, 0.049673444136468195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 171.0588235294118, 79, 329, 235.0, 260.99999999999994, 329.0, 329.0, 0.08709864177353328, 0.023475805790522643, 0.05120447494889359], "isController": false}, {"data": ["register", 20, 8, 40.0, 1188.8500000000004, 151, 2217, 1054.0, 2079.7, 2210.2, 2217.0, 0.0799740883953599, 0.024804463353873346, 0.03608205941275027], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 171.94117647058823, 79, 329, 234.0, 262.59999999999997, 329.0, 329.0, 0.08709819553032555, 0.02347568551403306, 0.05128926943826788], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 44.44444444444444, 0.5961251862891207], "isController": false}, {"data": ["401/Unauthorized", 10, 55.55555555555556, 0.7451564828614009], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1342, 18, "401/Unauthorized", 10, "406/Not Acceptable", 8, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 20, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 188, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
