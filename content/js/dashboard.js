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

    var data = {"OkPercent": 99.3050193050193, "KoPercent": 0.694980694980695};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7465069860279441, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=63af2c63-e57d-4294-8e57-96e6919d395c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=344122b6-4b78-4d20-affd-5cc50b680c84"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a15f6b42-58d5-422a-a7d4-4802c8c56504"], "isController": false}, {"data": [0.46153846153846156, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.46153846153846156, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=03594e72-7e0f-4514-b224-0c7f3bf0ca5c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6f535508-3dc1-46f3-8c92-b5fb2cea33c6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9791666666666666, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=31742bbc-1764-47de-8823-7d86a250b96c"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/dee06f3c-085e-4199-bc19-c8861f1ade43"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=12d9a35d-35e7-48cf-9177-1d433e23cef3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c73a3313-b192-4b0b-9f52-8afee2be3d28"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.65, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/10e226bd-4ea8-4b06-82b4-a95a72a7dbb6"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6904761904761905, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dee06f3c-085e-4199-bc19-c8861f1ade43"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dc8bdd69-4bda-4b22-83c1-a33341c0d6d8"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bd0342e4-a5f4-4792-8e0e-239dfad00277"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/930a67ca-ed2a-40c1-8304-54781436206d"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6f535508-3dc1-46f3-8c92-b5fb2cea33c6"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/63af2c63-e57d-4294-8e57-96e6919d395c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cc667ac2-2497-4419-a590-80e0767df7e6"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0acae7f5-b6db-4651-af15-b674a714fcc0"], "isController": false}, {"data": [0.19047619047619047, 500, 1500, "register"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/31742bbc-1764-47de-8823-7d86a250b96c"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/03594e72-7e0f-4514-b224-0c7f3bf0ca5c"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/344122b6-4b78-4d20-affd-5cc50b680c84"], "isController": false}, {"data": [0.19047619047619047, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a15f6b42-58d5-422a-a7d4-4802c8c56504"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.23809523809523808, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3275862068965517, 500, 1500, "addBook"], "isController": true}, {"data": [0.9122807017543859, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/12d9a35d-35e7-48cf-9177-1d433e23cef3"], "isController": false}, {"data": [0.9912280701754386, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4298245614035088, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9566473988439307, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.9791666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/43ab4697-4e44-4d0d-8805-692c45a89639"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2adccb59-fb5a-4a1c-a2b2-5f5326405cc4"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/bd0342e4-a5f4-4792-8e0e-239dfad00277"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=930a67ca-ed2a-40c1-8304-54781436206d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cc667ac2-2497-4419-a590-80e0767df7e6"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/1b10bc13-8586-47ee-9fca-40aaa5a7ef54"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0acae7f5-b6db-4651-af15-b674a714fcc0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1295, 9, 0.694980694980695, 456.86023166023114, 125, 4189, 148.0, 1258.8000000000002, 1512.0, 2263.9199999999983, 5.038067560680508, 710.7501339452446, 3.677578842596375], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=63af2c63-e57d-4294-8e57-96e6919d395c", 1, 0, 0.0, 510.0, 510, 510, 510.0, 510.0, 510.0, 510.0, 1.9607843137254901, 0.3542432598039216, 1.3518688725490196], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=344122b6-4b78-4d20-affd-5cc50b680c84", 1, 0, 0.0, 478.0, 478, 478, 478.0, 478.0, 478.0, 478.0, 2.092050209205021, 0.377958289748954, 1.4423705543933054], "isController": false}, {"data": ["see books", 57, 0, 0.0, 2122.8070175438593, 1565, 3041, 2073.0, 2692.6, 2872.3999999999996, 3041.0, 0.2575305083290788, 309.8968496069836, 1.266275497496984], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a15f6b42-58d5-422a-a7d4-4802c8c56504", 1, 0, 0.0, 468.0, 468, 468, 468.0, 468.0, 468.0, 468.0, 2.136752136752137, 0.38603432158119655, 1.473190438034188], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 741.0, 131, 1892, 598.0, 1589.1999999999998, 1892.0, 1892.0, 0.07824349375255797, 0.014823474402340083, 0.052893119011363364], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 741.0, 131, 1892, 598.0, 1589.1999999999998, 1892.0, 1892.0, 0.07771308329646943, 0.014722986483901435, 0.05253455803672839], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=03594e72-7e0f-4514-b224-0c7f3bf0ca5c", 1, 0, 0.0, 661.0, 661, 661, 661.0, 661.0, 661.0, 661.0, 1.5128593040847202, 0.27331930786686837, 1.0430455748865355], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 24, 0, 0.0, 173.66666666666666, 126, 399, 132.0, 384.0, 395.5, 399.0, 0.13202482066628526, 0.035326953967345864, 0.07529540553624081], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6f535508-3dc1-46f3-8c92-b5fb2cea33c6", 1, 0, 0.0, 493.0, 493, 493, 493.0, 493.0, 493.0, 493.0, 2.028397565922921, 0.3664585446247465, 1.3984850405679514], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 24, 0, 0.0, 135.66666666666663, 127, 161, 133.5, 151.5, 160.0, 161.0, 0.13202046317179164, 0.0981128637438803, 0.06626808405302823], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 24, 0, 0.0, 153.375, 127, 385, 132.0, 267.0, 383.75, 385.0, 0.13202046317179164, 0.03558364046427196, 0.07774251884042027], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 24, 0, 0.0, 212.45833333333334, 127, 511, 134.0, 403.0, 484.5, 511.0, 0.1320175583352586, 0.035582857520050165, 0.07761188488068912], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=31742bbc-1764-47de-8823-7d86a250b96c", 1, 0, 0.0, 1095.0, 1095, 1095, 1095.0, 1095.0, 1095.0, 1095.0, 0.91324200913242, 0.1649900114155251, 0.6296375570776256], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 273.5, 128, 391, 261.0, 389.5, 391.0, 391.0, 0.0819427454331552, 0.1804443729477732, 0.052968988694827655], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/dee06f3c-085e-4199-bc19-c8861f1ade43", 3, 0, 0.0, 498.66666666666663, 222, 923, 351.0, 923.0, 923.0, 923.0, 0.02040913512888369, 0.024122906788078345, 0.013087889389290647], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 161.35714285714286, 126, 542, 133.0, 339.5, 542.0, 542.0, 0.08220304151253596, 0.06109034628031237, 0.04126207357172215], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=12d9a35d-35e7-48cf-9177-1d433e23cef3", 1, 0, 0.0, 725.0, 725, 725, 725.0, 725.0, 725.0, 725.0, 1.379310344827586, 0.2491918103448276, 0.950969827586207], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 151.14285714285717, 126, 392, 132.5, 269.0, 392.0, 392.0, 0.08220400685816286, 0.03081503437889001, 0.046388840365690395], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 1016.0, 886, 1133, 1029.0, 1133.0, 1133.0, 1133.0, 0.06672597864768684, 19.619653233429716, 0.038054659697508895], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c73a3313-b192-4b0b-9f52-8afee2be3d28", 1, 0, 0.0, 242.0, 242, 242, 242.0, 242.0, 242.0, 242.0, 4.132231404958678, 1.3195699896694215, 2.46561854338843], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 1360.6666666666667, 1261, 1435, 1386.0, 1435.0, 1435.0, 1435.0, 0.06635406529240025, 59.70550458810713, 0.0377777539701849], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 129.33333333333334, 127, 132, 129.0, 132.0, 132.0, 132.0, 0.06825162097599818, 0.12077337618018429, 0.03779166903651462], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 189.42857142857144, 128, 406, 134.5, 399.5, 406.0, 406.0, 0.07024586051179127, 0.052204199071751126, 0.035260129202207724], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 166.78571428571425, 125, 381, 134.0, 380.5, 381.0, 381.0, 0.0702529104777198, 0.02633504052087515, 0.03964467395122441], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 257.50000000000006, 127, 1395, 130.0, 893.5, 1395.0, 1395.0, 0.07025326301316244, 4.5328693141901555, 0.04086999257322648], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 235.9285714285714, 127, 1043, 131.0, 737.5, 1043.0, 1043.0, 0.07025326301316244, 1.4930680572212827, 0.040938599275387774], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 220.66666666666666, 128, 393, 141.0, 393.0, 393.0, 393.0, 0.06825162097599818, 0.05072215191673302, 0.03832488482538961], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 241.14285714285714, 126, 1377, 133.0, 888.0, 1377.0, 1377.0, 0.08220400685816286, 5.30395321454365, 0.047822364480822985], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 815.2, 129, 1768, 783.5, 1565.4, 1757.8999999999999, 1768.0, 0.10369947891011848, 46.66846182886993, 0.056508114484224714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 270.1428571428571, 126, 1022, 137.0, 708.5, 1022.0, 1022.0, 0.08220400685816286, 1.747053041401461, 0.04790264183127041], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 588.6999999999999, 128, 1127, 582.0, 1069.4, 1124.2, 1127.0, 0.10369625293590017, 15.25904539173852, 0.056607622452312684], "isController": false}, {"data": ["deleteBooks", 12, 0, 0.0, 613.4166666666667, 248, 1095, 517.0, 1093.2, 1095.0, 1095.0, 0.07869832962795364, 0.01421795994255022, 0.05425880929427273], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/10e226bd-4ea8-4b06-82b4-a95a72a7dbb6", 1, 0, 0.0, 279.0, 279, 279, 279.0, 279.0, 279.0, 279.0, 3.5842293906810037, 1.144573252688172, 2.1386368727598564], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 489.4285714285715, 258, 1802, 272.5, 1293.5, 1802.0, 1802.0, 0.0702000702000702, 6.099860187471794, 0.15659864990222133], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 668.7142857142856, 146, 1752, 625.0, 1343.2000000000003, 1718.2999999999995, 1752.0, 0.09073155557091751, 0.05573256684971398, 0.041024131083334775], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 145.99999999999997, 127, 394, 133.0, 139.0, 381.24999999999983, 394.0, 0.10370001659200266, 0.0770661256118301, 0.05205254739090758], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 211.7, 128, 408, 133.5, 395.40000000000003, 407.4, 408.0, 0.10370001659200266, 0.10562413799361207, 0.05478682517214203], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dee06f3c-085e-4199-bc19-c8861f1ade43", 1, 0, 0.0, 507.0, 507, 507, 507.0, 507.0, 507.0, 507.0, 1.9723865877712032, 0.3563393737672584, 1.3598680966469427], "isController": false}, {"data": ["login", 21, 0, 0.0, 3185.333333333334, 1522, 6702, 2997.0, 5050.800000000001, 6560.299999999997, 6702.0, 0.09415604795681376, 16.224250877949103, 0.16436588003398586], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/dc8bdd69-4bda-4b22-83c1-a33341c0d6d8", 1, 0, 0.0, 376.0, 376, 376, 376.0, 376.0, 376.0, 376.0, 2.6595744680851063, 0.8492977061170213, 1.5869140625], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bd0342e4-a5f4-4792-8e0e-239dfad00277", 1, 0, 0.0, 1089.0, 1089, 1089, 1089.0, 1089.0, 1089.0, 1089.0, 0.9182736455463728, 0.16589904729109275, 0.633106634527089], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 158.78571428571428, 133, 390, 139.5, 275.0, 390.0, 390.0, 0.08210228772160287, 0.06646757472774295, 0.02918479758853852], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/930a67ca-ed2a-40c1-8304-54781436206d", 3, 0, 0.0, 1483.3333333333333, 242, 3606, 602.0, 3606.0, 3606.0, 3606.0, 0.07047547453486186, 0.03188831692820898, 0.04519423334429619], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6f535508-3dc1-46f3-8c92-b5fb2cea33c6", 3, 0, 0.0, 486.6666666666667, 280, 620, 560.0, 620.0, 620.0, 620.0, 0.02361777001015564, 0.02791540459208175, 0.01514551006510632], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 965.3, 263, 1905, 1037.0, 1696.1, 1894.6, 1905.0, 0.10362694300518135, 62.06722595531088, 0.21980246113989638], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/63af2c63-e57d-4294-8e57-96e6919d395c", 3, 0, 0.0, 396.3333333333333, 256, 545, 388.0, 545.0, 545.0, 545.0, 0.017447744006699933, 0.02405312365506973, 0.01118882021262984], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cc667ac2-2497-4419-a590-80e0767df7e6", 3, 0, 0.0, 434.0, 235, 783, 284.0, 783.0, 783.0, 783.0, 0.03567860710717854, 0.029395362821702107, 0.022879835937871653], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 24, 0, 0.0, 382.0833333333333, 262, 647, 278.0, 551.0, 625.75, 647.0, 0.1319203201266435, 0.20445073050877272, 0.2966918918473242], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 1, 25.0, 1218.25, 128, 1654, 1545.5, 1654.0, 1654.0, 1654.0, 0.060809680901199474, 54.56620725269463, 0.11265230924763223], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0acae7f5-b6db-4651-af15-b674a714fcc0", 3, 0, 0.0, 375.3333333333333, 266, 568, 292.0, 568.0, 568.0, 568.0, 0.03474353480723129, 0.028964255417096137, 0.022280196474689335], "isController": false}, {"data": ["register", 21, 3, 14.285714285714286, 1628.6666666666667, 183, 4189, 1491.0, 3766.0000000000014, 4183.0, 4189.0, 0.09233244957988736, 0.029472188147151544, 0.041657804400300744], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/31742bbc-1764-47de-8823-7d86a250b96c", 3, 0, 0.0, 697.3333333333334, 275, 1271, 546.0, 1271.0, 1271.0, 1271.0, 0.019170064028013852, 0.026427480845911025, 0.01229330277838128], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 479.35714285714283, 258, 1919, 278.5, 1226.0, 1919.0, 1919.0, 0.08213696926317272, 7.13708728923067, 0.18322686084237327], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 142.5625, 129, 245, 137.0, 172.20000000000007, 245.0, 245.0, 0.08664478885748016, 0.0672681710368132, 0.030799514789182397], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/03594e72-7e0f-4514-b224-0c7f3bf0ca5c", 3, 0, 0.0, 498.0, 391, 616, 487.0, 616.0, 616.0, 616.0, 0.03093836047315066, 0.02579203814184207, 0.019840029339878516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 630.8571428571428, 258, 1503, 523.5, 1468.0, 1503.0, 1503.0, 0.07911481820544988, 20.378229977240363, 0.17359345155347597], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 136.49999999999997, 127, 179, 129.5, 179.0, 179.0, 179.0, 0.04261757122461591, 0.031671847365168655, 0.021392023056106033], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 131.25, 126, 135, 131.5, 135.0, 135.0, 135.0, 0.04261938755940077, 0.0194055561030963, 0.02385894913908837], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 286.0, 126, 1383, 129.5, 1383.0, 1383.0, 1383.0, 0.042336554439516935, 4.771797909434172, 0.024434476243900893], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 308.125, 128, 1009, 134.0, 1009.0, 1009.0, 1009.0, 0.04242051456084162, 1.5691344193426942, 0.024524359980486563], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1444.40350877193, 1019, 2492, 1312.0, 2039.6000000000004, 2318.0999999999995, 2492.0, 0.24837900020916126, 297.1476347619483, 0.49045150236613677], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/344122b6-4b78-4d20-affd-5cc50b680c84", 3, 0, 0.0, 508.33333333333337, 239, 850, 436.0, 850.0, 850.0, 850.0, 0.03297500494625074, 0.02748990483963156, 0.02114608064587043], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 3, 14.285714285714286, 1628.6666666666667, 183, 4189, 1491.0, 3766.0000000000014, 4183.0, 4189.0, 0.0930331463810106, 0.029695848063581512, 0.04197393908987002], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 131.6, 127, 135, 133.0, 135.0, 135.0, 135.0, 0.039444930931925935, 0.010631641540245663, 0.023227825539014983], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 131.0, 127, 136, 130.0, 136.0, 136.0, 136.0, 0.039445242114896105, 0.01063172541378059, 0.023189488040202592], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 195.3125, 126, 393, 134.5, 384.6, 393.0, 393.0, 0.08557064926730132, 0.02306396406032731, 0.050306182479409566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 180.93749999999997, 125, 403, 132.5, 396.7, 403.0, 403.0, 0.08568337849561408, 0.023094348110145983, 0.050456130110210246], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a15f6b42-58d5-422a-a7d4-4802c8c56504", 3, 0, 0.0, 570.3333333333334, 388, 844, 479.0, 844.0, 844.0, 844.0, 0.02399136310928066, 0.02406165030588988, 0.015385086368907194], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 147.87499999999997, 127, 392, 132.5, 213.50000000000017, 392.0, 392.0, 0.08568521394526857, 0.06367817169174744, 0.04300996090612114], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 131.0, 127, 136, 129.0, 136.0, 136.0, 136.0, 0.03944430858071488, 0.0105544341319491, 0.02249558223743896], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 134.375, 125, 190, 128.5, 162.00000000000003, 190.0, 190.0, 0.08568383735065574, 0.022927120541093433, 0.048866563489045854], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 132.2, 127, 136, 132.0, 136.0, 136.0, 136.0, 0.0394436862491421, 0.029313130112887827, 0.019798881574276405], "isController": false}, {"data": ["deleteAccount", 12, 0, 0.0, 653.4166666666666, 479, 939, 564.0, 934.2, 939.0, 939.0, 0.08080699249841752, 0.014598919543171135, 0.0550024157923799], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 145.6, 135, 168, 142.0, 168.0, 168.0, 168.0, 0.0364513847881081, 0.028691226698452272, 0.0129573281863978], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1728.2857142857142, 952, 3084, 1523.0, 2561.6, 3031.7999999999993, 3084.0, 0.09119412188745776, 0.047200082617531856, 0.041945733797844345], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 266.6, 261, 272, 266.0, 272.0, 272.0, 272.0, 0.039403276776496736, 0.06106738305107453, 0.0886188929846406], "isController": false}, {"data": ["addBook", 58, 4, 6.896551724137931, 1362.5000000000002, 650, 4389, 1096.5, 2342.7, 2463.2499999999995, 4389.0, 0.2706271551020218, 90.35309425553035, 0.9833700998404232], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 219.96491228070178, 128, 761, 136.0, 521.6, 527.5, 761.0, 0.24937764963752737, 0.18532850720132651, 0.1205487661822032], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 859.438596491228, 625, 1264, 786.0, 1103.8000000000002, 1184.8999999999999, 1264.0, 0.24913240731837374, 73.25319972606361, 0.1252960837587524], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/12d9a35d-35e7-48cf-9177-1d433e23cef3", 3, 0, 0.0, 584.3333333333334, 251, 939, 563.0, 939.0, 939.0, 939.0, 0.03251644790323105, 0.026620724764526725, 0.020852019000444394], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 195.68421052631584, 127, 527, 134.0, 401.4, 406.4, 527.0, 0.24984439515740195, 0.44210746486837144, 0.12150635623865838], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 1221.8947368421052, 882, 1829, 1175.0, 1557.2, 1736.9999999999995, 1829.0, 0.2489887561919572, 224.04052049707113, 0.12498068426041603], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 155.2857142857143, 128, 405, 135.5, 275.0, 405.0, 405.0, 0.0779705382751803, 0.05824947439503216, 0.0277160897775055], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 4, 2.3121387283236996, 217.88439306358376, 129, 2816, 142.0, 388.2, 458.1999999999996, 1133.9799999999793, 0.7374599832046687, 1.606370776389771, 0.3540059356470252], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 143.25, 135, 164, 138.0, 164.0, 164.0, 164.0, 0.04467052694470347, 0.034593484245263526, 0.01587897637487506], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 24, 0, 0.0, 167.16666666666669, 129, 582, 137.5, 275.5, 533.0, 582.0, 0.13221756400156456, 0.10729765203642594, 0.046999212203681154], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 493.75, 260, 1512, 292.0, 1512.0, 1512.0, 1512.0, 0.04230565838180857, 6.383904225608144, 0.09379337982548916], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/43ab4697-4e44-4d0d-8805-692c45a89639", 1, 0, 0.0, 265.0, 265, 265, 265.0, 265.0, 265.0, 265.0, 3.7735849056603774, 1.2050412735849056, 2.2516214622641506], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 378.1875, 260, 787, 271.5, 608.5000000000002, 787.0, 787.0, 0.08551165363504695, 0.13252636163947218, 0.19231771320460267], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2adccb59-fb5a-4a1c-a2b2-5f5326405cc4", 2, 0, 0.0, 280.0, 227, 333, 280.0, 333.0, 333.0, 333.0, 0.08780787636651008, 0.05157855237739825, 0.0545797981516442], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bd0342e4-a5f4-4792-8e0e-239dfad00277", 3, 0, 0.0, 503.6666666666667, 380, 572, 559.0, 572.0, 572.0, 572.0, 0.018671230745293293, 0.02206876264197915, 0.011973412945386648], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 177.42857142857144, 131, 407, 137.0, 396.0, 407.0, 407.0, 0.06810067225092178, 0.05646237377053965, 0.024207660839194855], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=930a67ca-ed2a-40c1-8304-54781436206d", 1, 0, 0.0, 248.0, 248, 248, 248.0, 248.0, 248.0, 248.0, 4.032258064516129, 0.728484122983871, 2.780052923387097], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cc667ac2-2497-4419-a590-80e0767df7e6", 1, 0, 0.0, 524.0, 524, 524, 524.0, 524.0, 524.0, 524.0, 1.9083969465648853, 0.34477874522900764, 1.3157502385496183], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1b10bc13-8586-47ee-9fca-40aaa5a7ef54", 1, 0, 0.0, 521.0, 521, 521, 521.0, 521.0, 521.0, 521.0, 1.9193857965451055, 0.6129288627639156, 1.145258517274472], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0acae7f5-b6db-4651-af15-b674a714fcc0", 1, 0, 0.0, 563.0, 563, 563, 563.0, 563.0, 563.0, 563.0, 1.7761989342806395, 0.32089531527531084, 1.2246059058614567], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 137.35000000000002, 130, 160, 136.5, 148.4, 159.45, 160.0, 0.09884792740608211, 0.07674228739046414, 0.03513734919513075], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 132.8571428571429, 127, 139, 133.5, 138.5, 139.0, 139.0, 0.07917387714476377, 0.058839180182778554, 0.039741575051180256], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 206.85714285714283, 129, 412, 134.0, 400.5, 412.0, 412.0, 0.0791729816544891, 0.04666655238423779, 0.043728492518153236], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 456.64285714285717, 126, 1365, 260.0, 1331.0, 1365.0, 1365.0, 0.07917387714476377, 15.282651404134574, 0.045087579032495224], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 376.42857142857144, 128, 1018, 258.0, 1015.0, 1018.0, 1018.0, 0.07917477265529566, 5.0053412043896754, 0.04516540811767633], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 3, 33.333333333333336, 0.23166023166023167], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 11.11111111111111, 0.07722007722007722], "isController": false}, {"data": ["401/Unauthorized", 5, 55.55555555555556, 0.3861003861003861], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1295, 9, "401/Unauthorized", 5, "406/Not Acceptable", 3, "Test failed: code expected to contain /200/", 1, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 1, "Test failed: code expected to contain /200/", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 3, "406/Not Acceptable", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
