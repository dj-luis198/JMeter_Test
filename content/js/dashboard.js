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

    var data = {"OkPercent": 98.59703819173811, "KoPercent": 1.4029618082618862};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7865731462925851, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.18518518518518517, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=752c8c05-b7d9-4592-9bb7-859dfdf2a0f8"], "isController": false}, {"data": [0.5666666666666667, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c83d84a0-7bdc-4e6d-a558-37fcc6246940"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5562790c-4ac1-4e47-9cde-a21d8c57f07c"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/632af026-25e8-4742-aa7c-776c4f00153d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=50344523-c92c-4f07-924e-74a350b98f3b"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5dc61215-b351-47d3-9072-cc91328f1949"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=58a02dbe-d7f0-4536-b528-223f7ba5f27f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ccaaac18-613b-4868-b024-486468108962"], "isController": false}, {"data": [0.7380952380952381, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/88b18cc4-ad9a-4c3a-ae14-cf596f133fe2"], "isController": false}, {"data": [0.6470588235294118, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a3bcb6e3-785d-46d2-8ad1-ecad293f3a40"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=02dc8f96-8312-4112-88b0-c6e0fd101773"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c7d5c44d-003c-4693-81eb-837e4049063d"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.21739130434782608, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/30cc4c9c-9db6-4240-9c48-a66630f1f494"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c83d84a0-7bdc-4e6d-a558-37fcc6246940"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/02dc8f96-8312-4112-88b0-c6e0fd101773"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5562790c-4ac1-4e47-9cde-a21d8c57f07c"], "isController": false}, {"data": [0.4444444444444444, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/752c8c05-b7d9-4592-9bb7-859dfdf2a0f8"], "isController": false}, {"data": [0.21739130434782608, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5dc61215-b351-47d3-9072-cc91328f1949"], "isController": false}, {"data": [0.3559322033898305, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ec6ccf45-1fe4-4381-8b6e-d089537d8cae"], "isController": false}, {"data": [0.9907407407407407, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/50781959-1519-4230-9c74-3abd5d3e571d"], "isController": false}, {"data": [0.9907407407407407, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.49074074074074076, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=632af026-25e8-4742-aa7c-776c4f00153d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9476744186046512, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/50344523-c92c-4f07-924e-74a350b98f3b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=50781959-1519-4230-9c74-3abd5d3e571d"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=30cc4c9c-9db6-4240-9c48-a66630f1f494"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ccaaac18-613b-4868-b024-486468108962"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/58a02dbe-d7f0-4536-b528-223f7ba5f27f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f6afc218-a83e-4eab-a699-ec8c47e0531e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a3bcb6e3-785d-46d2-8ad1-ecad293f3a40"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c7d5c44d-003c-4693-81eb-837e4049063d"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1283, 18, 1.4029618082618862, 356.97427903351496, 100, 5677, 119.0, 879.2000000000003, 1064.5999999999997, 1903.7200000000034, 4.951889861941465, 686.5948856624358, 3.616364044474378], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 1618.8518518518517, 1259, 2770, 1588.0, 1965.0, 2052.0, 2770.0, 0.24137314500268192, 290.4531848893148, 1.1868298682504916], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=752c8c05-b7d9-4592-9bb7-859dfdf2a0f8", 1, 0, 0.0, 539.0, 539, 539, 539.0, 539.0, 539.0, 539.0, 1.8552875695732838, 0.3351837894248608, 1.2791338126159555], "isController": false}, {"data": ["deleteBook", 15, 1, 6.666666666666667, 615.4666666666667, 112, 979, 575.0, 934.0, 979.0, 979.0, 0.07453416149068323, 0.014033385093167702, 0.050422166149068325], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 1, 6.666666666666667, 615.4666666666667, 112, 979, 575.0, 934.0, 979.0, 979.0, 0.07414877209633408, 0.013960823496262903, 0.050161451227409344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 148.17647058823528, 100, 340, 110.0, 337.6, 340.0, 340.0, 0.11690598008472246, 0.05193881261346757, 0.06551785051163558], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 123.64705882352945, 100, 321, 111.0, 164.99999999999986, 321.0, 321.0, 0.11689794122096461, 0.08687434889565827, 0.058677286901929505], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 246.76470588235293, 106, 754, 112.0, 725.1999999999999, 754.0, 754.0, 0.11671174944047015, 4.0650659421384345, 0.06754772952738608], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 209.35294117647055, 103, 783, 111.0, 704.5999999999999, 783.0, 783.0, 0.11689874505758982, 12.402588855939486, 0.06754179559910606], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c83d84a0-7bdc-4e6d-a558-37fcc6246940", 3, 0, 0.0, 819.0, 213, 1802, 442.0, 1802.0, 1802.0, 1802.0, 0.017809121832202453, 0.02455131216125566, 0.011420563154114204], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5562790c-4ac1-4e47-9cde-a21d8c57f07c", 3, 0, 0.0, 314.6666666666667, 212, 472, 260.0, 472.0, 472.0, 472.0, 0.03733758152038632, 0.02400446728605566, 0.02394369648279982], "isController": false}, {"data": ["goToProfile", 15, 1, 6.666666666666667, 249.0, 108, 425, 215.0, 398.6, 425.0, 425.0, 0.07416857032663839, 0.1592837649326055, 0.04794399314929639], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 123.1764705882353, 104, 331, 111.0, 158.19999999999985, 331.0, 331.0, 0.09068794810515535, 0.06739602393361642, 0.04552109895122056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 121.94117647058822, 100, 319, 110.0, 154.99999999999986, 319.0, 319.0, 0.09069133470970771, 0.032279613388174914, 0.05127436329348249], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 682.2, 509, 738, 722.0, 738.0, 738.0, 738.0, 0.059623892486197066, 17.531404090497144, 0.03400425118353427], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 946.6, 906, 1014, 947.0, 1014.0, 1014.0, 1014.0, 0.05931409184193981, 53.370924102429505, 0.0337696440857919], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 151.0, 100, 326, 108.0, 326.0, 326.0, 326.0, 0.05975429035804771, 0.1057370841101391, 0.03308660413380181], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/632af026-25e8-4742-aa7c-776c4f00153d", 3, 0, 0.0, 583.3333333333334, 197, 1093, 460.0, 1093.0, 1093.0, 1093.0, 0.04468075599839149, 0.02872542092995547, 0.02865269834532267], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 130.8181818181818, 107, 324, 111.0, 282.40000000000015, 324.0, 324.0, 0.09469533926757459, 0.0703741730299065, 0.047532621468294275], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 209.27272727272728, 107, 333, 115.0, 333.0, 333.0, 333.0, 0.09487256889042218, 0.03833983785415499, 0.0533826652723274], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=50344523-c92c-4f07-924e-74a350b98f3b", 1, 0, 0.0, 447.0, 447, 447, 447.0, 447.0, 447.0, 447.0, 2.237136465324385, 0.4041701621923937, 1.5424007270693512], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 227.0, 104, 763, 115.0, 676.6000000000004, 763.0, 763.0, 0.09487256889042218, 7.7838377706024415, 0.055033501875889436], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 168.9090909090909, 105, 768, 110.0, 637.0000000000005, 768.0, 768.0, 0.09487420542852953, 2.5592620134462623, 0.055127101787085034], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5dc61215-b351-47d3-9072-cc91328f1949", 1, 0, 0.0, 597.0, 597, 597, 597.0, 597.0, 597.0, 597.0, 1.6750418760469012, 0.3026198701842546, 1.1548628559463987], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 198.8, 104, 341, 114.0, 341.0, 341.0, 341.0, 0.059744294419882896, 0.044399812552276256, 0.03354782157366472], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 641.6470588235294, 102, 1037, 946.0, 1037.0, 1037.0, 1037.0, 0.17958252345136483, 95.0720896737408, 0.09649672129848728], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 174.76470588235293, 102, 744, 108.0, 473.5999999999998, 744.0, 744.0, 0.09069472156720479, 4.823434757484982, 0.052860101391363726], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 469.9411764705882, 103, 927, 530.0, 819.8, 927.0, 927.0, 0.17956924506976793, 31.078352927506838, 0.09666494689503649], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 183.3529411764706, 102, 709, 110.0, 416.1999999999997, 709.0, 709.0, 0.09069230235746638, 1.591626983227259, 0.05294725809162056], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 455.2857142857143, 111, 625, 456.5, 611.0, 625.0, 625.0, 0.07113531970245111, 0.013432150560444698, 0.04868224202014146], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 381.72727272727275, 216, 880, 237.0, 835.4000000000001, 880.0, 880.0, 0.09460819306951981, 10.42277565924709, 0.21057546239754363], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=58a02dbe-d7f0-4536-b528-223f7ba5f27f", 1, 0, 0.0, 459.0, 459, 459, 459.0, 459.0, 459.0, 459.0, 2.1786492374727673, 0.3936036220043573, 1.502076525054466], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ccaaac18-613b-4868-b024-486468108962", 1, 0, 0.0, 536.0, 536, 536, 536.0, 536.0, 536.0, 536.0, 1.8656716417910448, 0.3370598180970149, 1.2862931436567164], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 540.8571428571428, 110, 1966, 476.0, 862.8000000000001, 1858.7999999999984, 1966.0, 0.0951155880860932, 0.058425493072414666, 0.04300636453502066], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 137.52941176470588, 102, 343, 112.0, 341.4, 343.0, 343.0, 0.1799474976712677, 0.13373051340608857, 0.09032520879202303], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 176.1764705882353, 101, 366, 113.0, 339.59999999999997, 366.0, 366.0, 0.17995321216483715, 0.20714053684277384, 0.09373941451693149], "isController": false}, {"data": ["login", 21, 0, 0.0, 2708.476190476191, 1507, 4363, 2596.0, 3866.4, 4320.099999999999, 4363.0, 0.09174352006780283, 26.258813760381216, 0.17464290336567656], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 160.64705882352942, 102, 348, 116.0, 342.4, 348.0, 348.0, 0.09574066669294842, 0.0775088014535686, 0.03403281511350901], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/88b18cc4-ad9a-4c3a-ae14-cf596f133fe2", 2, 0, 0.0, 248.0, 214, 282, 248.0, 282.0, 282.0, 282.0, 0.01640083644265858, 0.027740477264340483, 0.010194465230226742], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 783.4705882352941, 217, 1150, 1059.0, 1142.0, 1150.0, 1150.0, 0.17934948885395677, 126.32877077355016, 0.37636811680399207], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a3bcb6e3-785d-46d2-8ad1-ecad293f3a40", 3, 0, 0.0, 394.0, 320, 481, 381.0, 481.0, 481.0, 481.0, 0.023298256513804214, 0.023366513124684504, 0.014940613714907004], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=02dc8f96-8312-4112-88b0-c6e0fd101773", 1, 0, 0.0, 440.0, 440, 440, 440.0, 440.0, 440.0, 440.0, 2.2727272727272725, 0.41060014204545453, 1.5669389204545454], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c7d5c44d-003c-4693-81eb-837e4049063d", 2, 0, 0.0, 226.0, 203, 249, 226.0, 249.0, 249.0, 249.0, 0.03395931673854722, 0.02862001010289673, 0.021108501078208306], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 400.52941176470586, 221, 897, 417.0, 834.5999999999999, 897.0, 897.0, 0.11662207587295054, 16.57365975723743, 0.25877532885710364], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, 28.571428571428573, 849.4285714285714, 108, 1355, 1052.0, 1355.0, 1355.0, 1355.0, 0.08270516789149082, 70.68070414589191, 0.14886468696093952], "isController": false}, {"data": ["register", 23, 7, 30.434782608695652, 1337.0434782608697, 153, 5677, 1018.0, 3152.2000000000016, 5267.799999999994, 5677.0, 0.09520261600231798, 0.029847831036052815, 0.042952742766670805], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 129.76470588235296, 108, 392, 114.0, 175.9999999999998, 392.0, 392.0, 0.08744136285079418, 0.06788660494763805, 0.03108267195086824], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 340.6470588235294, 212, 1075, 225.0, 630.9999999999995, 1075.0, 1075.0, 0.09063524644789805, 6.510513855196865, 0.20247668308319783], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 380.7333333333333, 215, 1030, 414.0, 691.6000000000001, 1030.0, 1030.0, 0.149895073448586, 12.171928868542022, 0.3345607293644449], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/30cc4c9c-9db6-4240-9c48-a66630f1f494", 3, 0, 0.0, 789.3333333333334, 320, 1589, 459.0, 1589.0, 1589.0, 1589.0, 0.06525995214270176, 0.029528428866652166, 0.04184964378942789], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 132.89999999999998, 104, 339, 111.5, 316.5000000000001, 339.0, 339.0, 0.054982817869415807, 0.04086125429553265, 0.027598797250859106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 134.89999999999998, 104, 366, 110.0, 340.80000000000007, 366.0, 366.0, 0.0549825155600519, 0.014712118421342013, 0.0313572159053421], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c83d84a0-7bdc-4e6d-a558-37fcc6246940", 1, 0, 0.0, 431.0, 431, 431, 431.0, 431.0, 431.0, 431.0, 2.320185614849188, 0.41917415893271465, 1.599659222737819], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 110.0, 105, 114, 110.0, 114.0, 114.0, 114.0, 0.0549825155600519, 0.014819506147045238, 0.03232370543667114], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/02dc8f96-8312-4112-88b0-c6e0fd101773", 3, 0, 0.0, 368.6666666666667, 215, 464, 427.0, 464.0, 464.0, 464.0, 0.03348363766239564, 0.03358173425710969, 0.021472254620741996], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 150.9, 102, 326, 110.5, 325.3, 326.0, 326.0, 0.054985236464009414, 0.014820239515690038, 0.03237900155058367], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 111.0, 111, 111, 111.0, 111.0, 111.0, 111.0, 9.00900900900901, 2.656953828828829, 5.569045608108108], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5562790c-4ac1-4e47-9cde-a21d8c57f07c", 1, 0, 0.0, 550.0, 550, 550, 550.0, 550.0, 550.0, 550.0, 1.8181818181818181, 0.3284801136363636, 1.2535511363636362], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1046.7222222222224, 823, 1897, 893.0, 1504.5, 1602.75, 1897.0, 0.24932014091205001, 298.2735662360508, 0.492309887621255], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/752c8c05-b7d9-4592-9bb7-859dfdf2a0f8", 3, 0, 0.0, 295.6666666666667, 219, 433, 235.0, 433.0, 433.0, 433.0, 0.02714637324453453, 0.0320860941571956, 0.01740831877986101], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, 30.434782608695652, 1337.0434782608697, 153, 5677, 1018.0, 3152.2000000000016, 5267.799999999994, 5677.0, 0.09327563762009239, 0.029243686658744997, 0.04208334431687762], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 180.33333333333331, 103, 338, 110.0, 338.0, 338.0, 338.0, 0.042895544582769334, 0.011561689750824547, 0.025259778694736237], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 181.22222222222223, 100, 342, 108.0, 342.0, 342.0, 342.0, 0.042939136160000765, 0.011573439043125206, 0.02524351559406295], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 145.2941176470588, 103, 330, 107.0, 323.6, 330.0, 330.0, 0.08465798175371499, 0.022817971644555995, 0.049769633804430106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 121.0, 102, 325, 108.0, 158.59999999999985, 325.0, 325.0, 0.08465503074969499, 0.022817176256753727, 0.049850569865298906], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 134.58823529411765, 103, 337, 111.0, 313.79999999999995, 337.0, 337.0, 0.08465671701251426, 0.06291382973293295, 0.04249370365667219], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 178.44444444444446, 102, 338, 108.0, 338.0, 338.0, 338.0, 0.04289350020493562, 0.011477362359523787, 0.02446269933562734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 159.8823529411765, 103, 330, 112.0, 324.4, 330.0, 330.0, 0.08465924653270586, 0.022652962451134184, 0.04828222653818381], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 108.44444444444444, 100, 115, 108.0, 115.0, 115.0, 115.0, 0.04293647310268496, 0.03190884378041334, 0.021552096850371162], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 113.88888888888889, 109, 119, 114.0, 119.0, 119.0, 119.0, 0.042977069345889005, 0.03382765419217436, 0.015277005119046482], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 548.3846153846154, 109, 1082, 472.0, 1003.5999999999999, 1082.0, 1082.0, 0.07353814649930139, 0.013777354069205053, 0.050049249345227656], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1383.2380952380954, 802, 2865, 1113.0, 2282.0, 2806.7999999999993, 2865.0, 0.0932719810968785, 0.04827553709115782, 0.042901467867802516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 318.8888888888889, 211, 451, 228.0, 451.0, 451.0, 451.0, 0.04286979965513628, 0.06643981645771609, 0.09641518418533092], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5dc61215-b351-47d3-9072-cc91328f1949", 3, 0, 0.0, 439.0, 203, 680, 434.0, 680.0, 680.0, 680.0, 0.018003420649923486, 0.024819168767065743, 0.011545162330842861], "isController": false}, {"data": ["addBook", 59, 7, 11.864406779661017, 1032.7627118644061, 546, 2777, 944.0, 1569.0, 1649.0, 2777.0, 0.2785475867864579, 85.79355577649862, 1.0132850822423554], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ec6ccf45-1fe4-4381-8b6e-d089537d8cae", 1, 0, 0.0, 338.0, 338, 338, 338.0, 338.0, 338.0, 338.0, 2.9585798816568047, 0.9447808801775147, 1.7653245192307692], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 194.83333333333334, 106, 509, 114.0, 442.5, 457.5, 509.0, 0.2501899590429771, 0.18593218635908745, 0.12094143527956411], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 640.5370370370371, 507, 1129, 563.0, 793.5, 891.75, 1129.0, 0.25014012479212894, 73.5495021227169, 0.1258028947929164], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/50781959-1519-4230-9c74-3abd5d3e571d", 3, 0, 0.0, 337.3333333333333, 208, 571, 233.0, 571.0, 571.0, 571.0, 0.033913633280578795, 0.027565866634637125, 0.021748000508704502], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 161.48148148148152, 101, 613, 111.0, 330.0, 368.5, 613.0, 0.25060679330044505, 0.4434565522074282, 0.12187713189806801], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 845.3148148148148, 688, 1784, 773.5, 996.5, 1106.0, 1784.0, 0.24986118822876177, 224.82553637735978, 0.1254186042476402], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=632af026-25e8-4742-aa7c-776c4f00153d", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 0.4221122955607477, 1.6108717873831777], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 127.4, 107, 332, 115.0, 203.00000000000006, 332.0, 332.0, 0.1418412890536349, 0.10596541613870188, 0.05042014571828429], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 7, 4.069767441860465, 177.72674418604657, 100, 1451, 116.0, 319.40000000000003, 372.7499999999999, 819.5500000000088, 0.7489364666745043, 1.582339196373754, 0.3616052427185523], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 114.3, 109, 121, 114.0, 120.8, 121.0, 121.0, 0.056071412551024984, 0.043422490383752746, 0.019931634930247164], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/50344523-c92c-4f07-924e-74a350b98f3b", 3, 0, 0.0, 654.3333333333334, 425, 1082, 456.0, 1082.0, 1082.0, 1082.0, 0.04774637127578304, 0.030696316168512858, 0.030618603975681183], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 126.29411764705881, 106, 330, 115.0, 161.99999999999986, 330.0, 330.0, 0.11387843142508809, 0.0924150161271955, 0.04048022367063678], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=50781959-1519-4230-9c74-3abd5d3e571d", 1, 0, 0.0, 454.0, 454, 454, 454.0, 454.0, 454.0, 454.0, 2.2026431718061676, 0.39793846365638763, 1.518619218061674], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 291.7, 213, 705, 224.0, 678.1000000000001, 705.0, 705.0, 0.05494807407000384, 0.08515878276278915, 0.12357950642892467], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 309.5882352941176, 216, 661, 226.0, 643.4, 661.0, 661.0, 0.08460910593060063, 0.1311275889764289, 0.19028786226384103], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 117.54545454545455, 107, 144, 116.0, 139.4, 144.0, 144.0, 0.10167392248749874, 0.08429800799988908, 0.03614190213422806], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=30cc4c9c-9db6-4240-9c48-a66630f1f494", 1, 0, 0.0, 260.0, 260, 260, 260.0, 260.0, 260.0, 260.0, 3.8461538461538463, 0.6948617788461539, 2.6517427884615383], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 113.17647058823529, 107, 120, 114.0, 118.4, 120.0, 120.0, 0.17177790127822967, 0.13336272609003183, 0.0610616758449957], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ccaaac18-613b-4868-b024-486468108962", 3, 0, 0.0, 511.0, 302, 886, 345.0, 886.0, 886.0, 886.0, 0.01905233676910473, 0.022854121417366837, 0.01221780710779177], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/58a02dbe-d7f0-4536-b528-223f7ba5f27f", 3, 0, 0.0, 1122.6666666666667, 199, 2542, 627.0, 2542.0, 2542.0, 2542.0, 0.02622950819672131, 0.02186646174863388, 0.016820355191256832], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f6afc218-a83e-4eab-a699-ec8c47e0531e", 1, 0, 0.0, 217.0, 217, 217, 217.0, 217.0, 217.0, 217.0, 4.608294930875576, 1.4715941820276497, 2.749675979262673], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 110.66666666666664, 103, 116, 112.0, 115.4, 116.0, 116.0, 0.15006602905278324, 0.1115236797941094, 0.07532611223938533], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 167.06666666666663, 103, 342, 108.0, 340.2, 342.0, 342.0, 0.15007804058110216, 0.05518494617200945, 0.08475110182294794], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 238.0666666666667, 106, 926, 113.0, 582.2000000000003, 926.0, 926.0, 0.15006602905278324, 9.039729434075992, 0.08736265831966065], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a3bcb6e3-785d-46d2-8ad1-ecad293f3a40", 1, 0, 0.0, 497.0, 497, 497, 497.0, 497.0, 497.0, 497.0, 2.012072434607646, 0.3635091800804829, 1.3872296277665996], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 188.53333333333336, 100, 705, 110.0, 484.8000000000001, 705.0, 705.0, 0.15007203457659676, 2.9794965646010088, 0.08751270922542821], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c7d5c44d-003c-4693-81eb-837e4049063d", 1, 0, 0.0, 625.0, 625, 625, 625.0, 625.0, 625.0, 625.0, 1.6, 0.2890625, 1.103125], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 38.888888888888886, 0.5455962587685113], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.555555555555555, 0.0779423226812159], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.555555555555555, 0.0779423226812159], "isController": false}, {"data": ["401/Unauthorized", 9, 50.0, 0.7014809041309431], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1283, 18, "401/Unauthorized", 9, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
