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

    var data = {"OkPercent": 98.02342606149341, "KoPercent": 1.9765739385065886};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8312182741116751, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4745762711864407, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7879b139-1c6e-4f9a-8342-5905ec935356"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7deac890-5735-4212-ad22-316c359b6433"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1ac0b7ed-7923-4544-99b0-53f85a769e96"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7083333333333334, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a89f7ec5-4862-4418-a131-07f934a4c606"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cac1ca7e-e1e6-47a7-bf62-3c2a029bde77"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b27ea9de-61ba-45a5-80b7-039942d49992"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8809523809523809, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.023809523809523808, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7e0a1f94-b475-4689-be2f-18a139e9e3ab"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/79c713b5-1b56-4bae-a72b-5dfd05ce0bad"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7685e01f-92a7-4435-88b7-e8f5b70634ba"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a76e77ea-a27c-4800-bf38-fb185750fba9"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0bc03260-f6e1-4c59-94dc-b173ae3ff00e"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cac1ca7e-e1e6-47a7-bf62-3c2a029bde77"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/75b94eb8-8a49-4170-b273-3ac82b2d0478"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7deac890-5735-4212-ad22-316c359b6433"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a76e77ea-a27c-4800-bf38-fb185750fba9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7685e01f-92a7-4435-88b7-e8f5b70634ba"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.4523809523809524, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1ac0b7ed-7923-4544-99b0-53f85a769e96"], "isController": false}, {"data": [0.38095238095238093, 500, 1500, "addBook"], "isController": true}, {"data": [0.9915254237288136, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8135593220338984, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b27ea9de-61ba-45a5-80b7-039942d49992"], "isController": false}, {"data": [0.918918918918919, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c6885419-8f18-4402-8b6d-cef6c030401a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a89f7ec5-4862-4418-a131-07f934a4c606"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0bc03260-f6e1-4c59-94dc-b173ae3ff00e"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4a4ce010-ca0c-4006-ac52-c5b64ea9ffe6"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7e0a1f94-b475-4689-be2f-18a139e9e3ab"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=79c713b5-1b56-4bae-a72b-5dfd05ce0bad"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7a0c456b-fa86-4af2-9408-736693f54e6d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1366, 27, 1.9765739385065886, 259.08784773060023, 80, 1558, 94.0, 665.3, 814.2499999999993, 1182.3099999999995, 5.5042026964952, 765.2370413500205, 4.038701802968885], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 59, 0, 0.0, 1221.8474576271185, 985, 1842, 1193.0, 1451.0, 1510.0, 1842.0, 0.2596122536983746, 312.40200943734544, 1.2765114232141757], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/7879b139-1c6e-4f9a-8342-5905ec935356", 1, 0, 0.0, 263.0, 263, 263, 263.0, 263.0, 263.0, 263.0, 3.802281368821293, 1.2142050855513307, 2.268744058935361], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7deac890-5735-4212-ad22-316c359b6433", 1, 0, 0.0, 729.0, 729, 729, 729.0, 729.0, 729.0, 729.0, 1.371742112482853, 0.24782450274348422, 0.9457518861454047], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1ac0b7ed-7923-4544-99b0-53f85a769e96", 3, 0, 0.0, 663.0, 161, 1408, 420.0, 1408.0, 1408.0, 1408.0, 0.025271244693038614, 0.02534528154272525, 0.01620584376474156], "isController": false}, {"data": ["deleteBook", 12, 2, 16.666666666666668, 410.5, 87, 742, 418.5, 687.7000000000002, 742.0, 742.0, 0.07111153251278525, 0.014201473045766197, 0.04776648676436601], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 2, 16.666666666666668, 410.5, 87, 742, 418.5, 687.7000000000002, 742.0, 742.0, 0.07187350263536177, 0.014353643836847148, 0.04827831142189746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 111.5263157894737, 81, 265, 85.0, 252.0, 265.0, 265.0, 0.10555145077691423, 0.028243259289916504, 0.0601973117712089], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 111.84210526315789, 82, 261, 86.0, 246.0, 261.0, 261.0, 0.10555145077691423, 0.07844204496214036, 0.05298188056575578], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 146.3684210526316, 81, 261, 88.0, 258.0, 261.0, 261.0, 0.1054506907020241, 0.028422256478279933, 0.06209645165363333], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 130.21052631578948, 82, 266, 87.0, 259.0, 266.0, 266.0, 0.1055508644060264, 0.0284492564219368, 0.06205236364494911], "isController": false}, {"data": ["goToProfile", 12, 2, 16.666666666666668, 174.83333333333334, 84, 278, 179.0, 258.80000000000007, 278.0, 278.0, 0.07110015642034412, 0.1360901431483149, 0.045953567894724365], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a89f7ec5-4862-4418-a131-07f934a4c606", 3, 0, 0.0, 292.0, 162, 436, 278.0, 436.0, 436.0, 436.0, 0.021523273833438557, 0.025439781018624808, 0.013802359847615223], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 85.85, 82, 96, 84.5, 90.0, 95.69999999999999, 96.0, 0.11363830065285203, 0.08445190116876991, 0.05704110013238862], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 112.79999999999998, 82, 256, 86.0, 254.60000000000002, 256.0, 256.0, 0.11363700930118921, 0.04747452400297729, 0.06385423354678152], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 533.1666666666666, 409, 605, 581.5, 605.0, 605.0, 605.0, 0.0389418209195462, 11.450188340494302, 0.022209007243178692], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 661.5, 560, 741, 669.0, 741.0, 741.0, 741.0, 0.03886136209074128, 34.967521920237054, 0.022125170018459147], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 139.33333333333331, 83, 253, 85.5, 253.0, 253.0, 253.0, 0.03898128898128898, 0.06897860901767153, 0.021584366066787944], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 86.0, 82, 96, 85.0, 93.0, 96.0, 96.0, 0.08836055820309968, 0.06566639139898327, 0.044352858316790277], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 108.26666666666665, 81, 258, 85.0, 254.4, 258.0, 258.0, 0.08835899671304533, 0.02364293466735783, 0.05039224031290866], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cac1ca7e-e1e6-47a7-bf62-3c2a029bde77", 1, 0, 0.0, 374.0, 374, 374, 374.0, 374.0, 374.0, 374.0, 2.6737967914438503, 0.4830589906417112, 1.8434575534759359], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 136.33333333333334, 80, 371, 84.0, 305.6, 371.0, 371.0, 0.088359517203598, 0.023815651121282273, 0.05194573179352148], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 113.0, 82, 335, 86.0, 285.8, 335.0, 335.0, 0.08835847622862461, 0.023815370545996476, 0.05203140738853578], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 112.5, 81, 246, 87.0, 246.0, 246.0, 246.0, 0.03902337500162597, 0.029000769898669305, 0.021912539673764588], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 498.66666666666674, 84, 854, 732.0, 822.2, 854.0, 854.0, 0.06790648823859624, 36.668747658640875, 0.03642015951234087], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 141.5, 82, 737, 84.5, 517.000000000001, 728.3499999999999, 737.0, 0.11363442668590876, 10.252410914160555, 0.06582806827156355], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 369.4666666666667, 82, 602, 566.0, 594.8, 602.0, 602.0, 0.06790710308298248, 11.987487055208476, 0.03648680480103219], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 137.0, 81, 569, 84.5, 453.80000000000047, 564.3499999999999, 569.0, 0.11363571797887512, 3.3688329540741244, 0.06593978869438241], "isController": false}, {"data": ["deleteBooks", 11, 1, 9.090909090909092, 424.6363636363637, 91, 735, 460.0, 733.8, 735.0, 735.0, 0.09982575867576594, 0.019071824633367214, 0.06817822811547118], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b27ea9de-61ba-45a5-80b7-039942d49992", 1, 0, 0.0, 178.0, 178, 178, 178.0, 178.0, 178.0, 178.0, 5.617977528089887, 1.014966643258427, 3.8733321629213484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 241.93333333333334, 168, 460, 174.0, 436.0, 460.0, 460.0, 0.08831529738704473, 0.13687146186839844, 0.19862317371324612], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 411.1904761904762, 110, 1331, 357.0, 779.6, 1276.1999999999994, 1331.0, 0.09819783590674011, 0.06031878787630813, 0.04439999807111394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 86.0, 83, 93, 85.0, 91.8, 93.0, 93.0, 0.06790433637092065, 0.050464062478779895, 0.03408479384243478], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 106.93333333333332, 81, 259, 84.0, 257.8, 259.0, 259.0, 0.06790648823859624, 0.07936570812885935, 0.0353060686896764], "isController": false}, {"data": ["login", 21, 0, 0.0, 1985.8095238095239, 1403, 2976, 1888.0, 2621.8, 2941.2999999999993, 2976.0, 0.09841089830405218, 33.7720172418237, 0.19510564673533562], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7e0a1f94-b475-4689-be2f-18a139e9e3ab", 1, 0, 0.0, 466.0, 466, 466, 466.0, 466.0, 466.0, 466.0, 2.1459227467811157, 0.3876911212446352, 1.4795131437768239], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 107.14999999999999, 84, 264, 89.5, 232.6000000000003, 263.15, 264.0, 0.10881215214115111, 0.08809108801270926, 0.03867931970642481], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/79c713b5-1b56-4bae-a72b-5dfd05ce0bad", 3, 0, 0.0, 243.66666666666669, 161, 390, 180.0, 390.0, 390.0, 390.0, 0.07238683524756298, 0.03275315787568767, 0.04641994317633433], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7685e01f-92a7-4435-88b7-e8f5b70634ba", 3, 0, 0.0, 241.0, 165, 379, 179.0, 379.0, 379.0, 379.0, 0.03678589383591039, 0.030666886104741702, 0.023589912388262847], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a76e77ea-a27c-4800-bf38-fb185750fba9", 3, 0, 0.0, 296.6666666666667, 177, 531, 182.0, 531.0, 531.0, 531.0, 0.026319483436271756, 0.02639659129790146, 0.016878054156723752], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 585.5333333333333, 168, 946, 816.0, 910.0, 946.0, 946.0, 0.06787821742750608, 48.765646989714185, 0.1422393349179126], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0bc03260-f6e1-4c59-94dc-b173ae3ff00e", 1, 0, 0.0, 558.0, 558, 558, 558.0, 558.0, 558.0, 558.0, 1.7921146953405018, 0.32377072132616486, 1.2355790770609318], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 288.57894736842104, 167, 517, 335.0, 504.0, 517.0, 517.0, 0.10540038276981112, 0.1633500072809475, 0.23704793117077638], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 3, 33.333333333333336, 551.0, 84, 975, 693.0, 975.0, 975.0, 975.0, 0.046055829900468234, 36.73663061625259, 0.07931837371747308], "isController": false}, {"data": ["register", 21, 6, 28.571428571428573, 804.1428571428571, 123, 1362, 832.0, 1181.6, 1344.4999999999998, 1362.0, 0.09851477252469906, 0.030950790698329, 0.04444709463516696], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/cac1ca7e-e1e6-47a7-bf62-3c2a029bde77", 3, 0, 0.0, 314.0, 173, 430, 339.0, 430.0, 430.0, 430.0, 0.05458713926998799, 0.03573396389060737, 0.03500542459696496], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 101.89473684210526, 84, 249, 91.0, 124.0, 249.0, 249.0, 0.09496201519392243, 0.07372539265543782, 0.03375602883846461], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 254.34999999999997, 168, 820, 174.5, 621.7000000000007, 811.6499999999999, 820.0, 0.11357763883446627, 13.746255043557024, 0.2525327813460086], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/75b94eb8-8a49-4170-b273-3ac82b2d0478", 1, 0, 0.0, 286.0, 286, 286, 286.0, 286.0, 286.0, 286.0, 3.4965034965034967, 1.116559222027972, 2.0862926136363638], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 284.8666666666667, 168, 685, 332.0, 481.60000000000014, 685.0, 685.0, 0.07566318784143014, 6.144077448208548, 0.16887767374790033], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7deac890-5735-4212-ad22-316c359b6433", 3, 0, 0.0, 341.0, 205, 487, 331.0, 487.0, 487.0, 487.0, 0.020213317881374773, 0.023891457430752543, 0.012962316479918069], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 99.33333333333333, 82, 247, 86.0, 199.90000000000015, 247.0, 247.0, 0.07393624231371147, 0.05494675820384222, 0.03711252788012471], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 126.74999999999999, 81, 260, 86.5, 256.1, 260.0, 260.0, 0.07393442016930983, 0.029037069640062595, 0.0416482793304006], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 184.33333333333334, 82, 770, 88.0, 615.5000000000006, 770.0, 770.0, 0.07393396464724257, 5.562092833719434, 0.042935609677955976], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 141.08333333333334, 82, 438, 84.5, 381.0000000000002, 438.0, 438.0, 0.07393442016930983, 1.8298648655933851, 0.04300807579510307], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 91.0, 91, 91, 91.0, 91.0, 91.0, 91.0, 10.989010989010989, 3.2408997252747254, 6.793011675824176], "isController": false}, {"data": ["https://demoqa.com/books", 59, 0, 0.0, 788.9491525423729, 647, 1449, 675.0, 1078.0, 1118.0, 1449.0, 0.2599325056612419, 310.96964393101655, 0.5132651625459288], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 6, 28.571428571428573, 804.1428571428571, 123, 1362, 832.0, 1181.6, 1344.4999999999998, 1362.0, 0.09869441389617348, 0.031007229365817898, 0.04452814376956264], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a76e77ea-a27c-4800-bf38-fb185750fba9", 1, 0, 0.0, 350.0, 350, 350, 350.0, 350.0, 350.0, 350.0, 2.857142857142857, 0.5161830357142857, 1.9698660714285716], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 156.28571428571428, 85, 249, 89.0, 249.0, 249.0, 249.0, 0.03331366240886334, 0.008979073071138946, 0.01961732268803183], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 134.7142857142857, 84, 259, 89.0, 259.0, 259.0, 259.0, 0.03331382095248973, 0.008979115803600748, 0.019584883020897285], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7685e01f-92a7-4435-88b7-e8f5b70634ba", 1, 0, 0.0, 525.0, 525, 525, 525.0, 525.0, 525.0, 525.0, 1.9047619047619047, 0.3441220238095238, 1.3132440476190477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 127.57894736842104, 81, 724, 86.0, 243.0, 724.0, 724.0, 0.09232129755154202, 4.3957246508189876, 0.05385725366005355], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 129.47368421052633, 82, 408, 85.0, 263.0, 408.0, 408.0, 0.09224286088805601, 1.4510518872161104, 0.053901577170862906], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 85.14285714285714, 83, 87, 85.0, 87.0, 87.0, 87.0, 0.03331445514208615, 0.008914219442316022, 0.01899965019822101], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 86.52631578947368, 82, 104, 86.0, 90.0, 104.0, 104.0, 0.09231950322389423, 0.06860853706385109, 0.046340063141681286], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 89.14285714285715, 84, 94, 89.0, 94.0, 94.0, 94.0, 0.033314296592423374, 0.024757987994955263, 0.016722215281743766], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 93.84210526315789, 81, 251, 85.0, 91.0, 251.0, 251.0, 0.09231860608622558, 0.03200024051426323, 0.052242385537075636], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 91.57142857142858, 86, 100, 90.0, 100.0, 100.0, 100.0, 0.03346608212576554, 0.026341466985709983, 0.011896146380643218], "isController": false}, {"data": ["deleteAccount", 11, 1, 9.090909090909092, 392.09090909090907, 91, 531, 413.0, 522.2, 531.0, 531.0, 0.09872288486219183, 0.01861571443956813, 0.06718835541136031], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1118.6190476190475, 622, 1558, 1068.0, 1506.6000000000001, 1553.8, 1558.0, 0.09528779181886245, 0.04931887662499716, 0.0438286620573088], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 247.71428571428572, 170, 353, 179.0, 353.0, 353.0, 353.0, 0.03330019171396086, 0.05160879321294521, 0.07489291163794129], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1ac0b7ed-7923-4544-99b0-53f85a769e96", 1, 0, 0.0, 460.0, 460, 460, 460.0, 460.0, 460.0, 460.0, 2.1739130434782608, 0.39274796195652173, 1.4988111413043477], "isController": false}, {"data": ["addBook", 63, 15, 23.80952380952381, 754.015873015873, 429, 1500, 667.0, 1238.8, 1363.9999999999998, 1500.0, 0.28826223627437075, 77.75395709983025, 1.0498434504417733], "isController": true}, {"data": ["https://demoqa.com/books-0", 59, 0, 0.0, 154.62711864406788, 83, 583, 88.0, 339.0, 378.0, 583.0, 0.2606087644052599, 0.19367506807851834, 0.12597786951230824], "isController": false}, {"data": ["https://demoqa.com/books-3", 59, 0, 0.0, 486.57627118644064, 402, 676, 433.0, 598.0, 664.0, 676.0, 0.2606502118335196, 76.63981668061955, 0.13108872958424084], "isController": false}, {"data": ["https://demoqa.com/books-1", 59, 0, 0.0, 129.81355932203394, 81, 276, 87.0, 253.0, 260.0, 276.0, 0.26103191668215164, 0.46190413381646356, 0.12694716260518701], "isController": false}, {"data": ["https://demoqa.com/books-2", 59, 0, 0.0, 629.3050847457629, 563, 858, 584.0, 762.0, 811.0, 858.0, 0.26064675737762855, 234.53041045651835, 0.13083245438681745], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 100.6, 84, 247, 89.0, 159.40000000000003, 247.0, 247.0, 0.07447827965104444, 0.055640511653368155, 0.0264747009697072], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b27ea9de-61ba-45a5-80b7-039942d49992", 3, 0, 0.0, 234.0, 172, 355, 175.0, 355.0, 355.0, 355.0, 0.07429236522126742, 0.03361536056561254, 0.047641913895148706], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 185, 15, 8.108108108108109, 127.7405405405405, 83, 302, 91.0, 244.60000000000005, 277.49999999999994, 299.41999999999996, 0.7799785822097425, 1.6573515550559477, 0.37472239613636554], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 90.58333333333334, 86, 96, 89.5, 95.4, 96.0, 96.0, 0.07163965254768515, 0.05547875436554133, 0.025465657741559955], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c6885419-8f18-4402-8b6d-cef6c030401a", 1, 0, 0.0, 265.0, 265, 265, 265.0, 265.0, 265.0, 265.0, 3.7735849056603774, 1.2050412735849056, 2.2516214622641506], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a89f7ec5-4862-4418-a131-07f934a4c606", 1, 0, 0.0, 735.0, 735, 735, 735.0, 735.0, 735.0, 735.0, 1.3605442176870748, 0.2458014455782313, 0.938031462585034], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 98.84210526315788, 85, 256, 89.0, 99.0, 256.0, 256.0, 0.09907856930545922, 0.08040458114534826, 0.03521933518279996], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0bc03260-f6e1-4c59-94dc-b173ae3ff00e", 3, 0, 0.0, 266.3333333333333, 204, 381, 214.0, 381.0, 381.0, 381.0, 0.022298532756544618, 0.022363860489229805, 0.014299514821091437], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 298.4166666666667, 168, 860, 179.5, 752.9000000000003, 860.0, 860.0, 0.07389617587289857, 7.472107320724799, 0.16461864569862678], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4a4ce010-ca0c-4006-ac52-c5b64ea9ffe6", 1, 0, 0.0, 170.0, 170, 170, 170.0, 170.0, 170.0, 170.0, 5.88235294117647, 1.8784466911764706, 3.5098805147058822], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 242.78947368421052, 166, 807, 177.0, 350.0, 807.0, 807.0, 0.09220391624002135, 5.941058115764443, 0.20612712463300414], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7e0a1f94-b475-4689-be2f-18a139e9e3ab", 3, 0, 0.0, 346.0, 179, 446, 413.0, 446.0, 446.0, 446.0, 0.020811943280517244, 0.028690943943030775, 0.01334620060632128], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=79c713b5-1b56-4bae-a72b-5dfd05ce0bad", 1, 0, 0.0, 205.0, 205, 205, 205.0, 205.0, 205.0, 205.0, 4.878048780487805, 0.8812881097560976, 3.363185975609756], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7a0c456b-fa86-4af2-9408-736693f54e6d", 1, 0, 0.0, 331.0, 331, 331, 331.0, 331.0, 331.0, 331.0, 3.0211480362537766, 0.9647611404833837, 1.802657666163142], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 112.13333333333334, 85, 265, 88.0, 261.4, 265.0, 265.0, 0.08885782156164661, 0.07367215869710739, 0.031586178758241566], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 90.19999999999997, 85, 103, 88.0, 99.4, 103.0, 103.0, 0.06806734128964922, 0.05284525031764759, 0.024195812724054997], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 86.2, 82, 91, 86.0, 90.4, 91.0, 91.0, 0.07575948887598172, 0.05630172952599813, 0.03802771218970176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 141.33333333333331, 81, 266, 87.0, 260.6, 266.0, 266.0, 0.07576101944027759, 0.027857958190018735, 0.04278327360839634], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 184.73333333333335, 82, 598, 85.0, 394.60000000000014, 598.0, 598.0, 0.07570099117831117, 4.560102525952823, 0.044070199421644425], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 163.00000000000003, 82, 592, 86.0, 389.20000000000016, 592.0, 592.0, 0.07569831697408594, 1.5028974319345967, 0.0441425667406828], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 22.22222222222222, 0.43923865300146414], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 7.407407407407407, 0.14641288433382138], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 3.7037037037037037, 0.07320644216691069], "isController": false}, {"data": ["401/Unauthorized", 18, 66.66666666666667, 1.3177159590043923], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1366, 27, "401/Unauthorized", 18, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 3, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 185, 15, "401/Unauthorized", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
