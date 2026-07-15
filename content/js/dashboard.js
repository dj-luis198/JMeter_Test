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

    var data = {"OkPercent": 99.13860610806577, "KoPercent": 0.8613938919342208};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7954699121027722, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.10909090909090909, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e55fcc8d-0c9e-46bb-9943-047826672f7b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=28937482-495b-43b9-bb78-e2f59404635a"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.8181818181818182, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0471d3d1-32e7-4a3d-97ba-6763ee8e158f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7f925369-dabf-4a59-945d-ee5684c1ff33"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c3b78cd1-c3bb-4696-b4df-d35adf2d9579"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fbe12a22-62c8-4fba-95cc-3b51aab75c15"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8b41299c-97d9-4750-92ea-14c1e90f0ebb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/96875c94-a47e-4319-93e1-ee6863695671"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5e5a2e17-d076-4692-b424-a82d09f90460"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=92f03735-d5bf-41cb-a351-a0170d47ce9a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.631578947368421, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=68f49ed7-ff6c-47fa-b962-581131f57eab"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/91fe730e-1608-41ea-b27c-7b8f76264e5d"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d5385d60-edef-4e28-9d77-f0791034b6eb"], "isController": false}, {"data": [0.6764705882352942, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2b379576-b9ee-4d79-9479-db7eb5cddd41"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0471d3d1-32e7-4a3d-97ba-6763ee8e158f"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8b41299c-97d9-4750-92ea-14c1e90f0ebb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.4090909090909091, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/7f925369-dabf-4a59-945d-ee5684c1ff33"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5909090909090909, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.39473684210526316, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/68f49ed7-ff6c-47fa-b962-581131f57eab"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bd2dc736-5c68-4dea-875a-553344b839c6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/614f0af2-9f49-4545-8850-e5c4dc9e4673"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/92f03735-d5bf-41cb-a351-a0170d47ce9a"], "isController": false}, {"data": [0.325, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/28937482-495b-43b9-bb78-e2f59404635a"], "isController": false}, {"data": [0.990909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e55fcc8d-0c9e-46bb-9943-047826672f7b"], "isController": false}, {"data": [0.5272727272727272, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c3b78cd1-c3bb-4696-b4df-d35adf2d9579"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9571428571428572, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fbe12a22-62c8-4fba-95cc-3b51aab75c15"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=96875c94-a47e-4319-93e1-ee6863695671"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d5385d60-edef-4e28-9d77-f0791034b6eb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1277, 11, 0.8613938919342208, 359.41973375097865, 97, 2064, 118.0, 1020.0, 1220.1999999999998, 1615.9600000000005, 5.055563693372342, 694.8016346330857, 3.696673725123024], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 1714.3636363636367, 1287, 2467, 1650.0, 2067.0, 2104.0, 2467.0, 0.23758817761228201, 285.8980423071648, 1.168219213161953], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e55fcc8d-0c9e-46bb-9943-047826672f7b", 1, 0, 0.0, 464.0, 464, 464, 464.0, 464.0, 464.0, 464.0, 2.155172413793103, 0.3893622036637931, 1.4858903556034482], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=28937482-495b-43b9-bb78-e2f59404635a", 1, 0, 0.0, 516.0, 516, 516, 516.0, 516.0, 516.0, 516.0, 1.937984496124031, 0.35012415213178294, 1.3361494670542635], "isController": false}, {"data": ["deleteBook", 11, 0, 0.0, 601.4545454545454, 458, 1023, 494.0, 987.0000000000001, 1023.0, 1023.0, 0.06387735547748323, 0.011540342542318748, 0.04341664005110188], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 11, 0, 0.0, 601.4545454545454, 458, 1023, 494.0, 987.0000000000001, 1023.0, 1023.0, 0.06350965924181014, 0.01147391304661609, 0.04316672151591783], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0471d3d1-32e7-4a3d-97ba-6763ee8e158f", 3, 0, 0.0, 349.3333333333333, 205, 508, 335.0, 508.0, 508.0, 508.0, 0.023214603533262657, 0.027438875465259343, 0.01488696906267169], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 12, 0, 0.0, 135.16666666666669, 99, 306, 103.0, 302.7, 306.0, 306.0, 0.08296574897329885, 0.0325840417110303, 0.04673575149684039], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 12, 0, 0.0, 105.0, 101, 122, 103.5, 117.20000000000002, 122.0, 122.0, 0.08296517536763943, 0.061656736772239845, 0.04164462904195963], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 12, 0, 0.0, 195.08333333333331, 99, 807, 103.0, 657.9000000000005, 807.0, 807.0, 0.08296632258688995, 2.0534029803922924, 0.048261985176683696], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 12, 0, 0.0, 278.58333333333326, 100, 1405, 104.5, 1076.800000000001, 1405.0, 1405.0, 0.08296746983786774, 6.241688398814257, 0.04818162961938673], "isController": false}, {"data": ["goToProfile", 14, 1, 7.142857142857143, 271.1428571428571, 104, 754, 212.0, 649.5, 754.0, 754.0, 0.07013184787400313, 0.15720961657916885, 0.045334251830942175], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7f925369-dabf-4a59-945d-ee5684c1ff33", 1, 0, 0.0, 215.0, 215, 215, 215.0, 215.0, 215.0, 215.0, 4.651162790697675, 0.8402979651162791, 3.2067587209302326], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 104.80000000000001, 99, 118, 104.0, 112.60000000000001, 118.0, 118.0, 0.12705942145610097, 0.09442599582821566, 0.06377787366058194], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 121.33333333333333, 98, 307, 105.0, 202.00000000000006, 307.0, 307.0, 0.12704650749150906, 0.04671605952552364, 0.07174488320191079], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 670.0, 600, 805, 605.0, 805.0, 805.0, 805.0, 0.08327319158385611, 24.485083255843, 0.04749174207516793], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 1076.6666666666667, 914, 1210, 1106.0, 1210.0, 1210.0, 1210.0, 0.08302200083022002, 74.7033422841428, 0.04726740867579909], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 308.3333333333333, 308, 309, 308.0, 309.0, 309.0, 309.0, 0.08443806467955754, 0.1494157941399983, 0.04675427995440344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 18, 0, 0.0, 116.44444444444443, 101, 313, 104.0, 133.00000000000028, 313.0, 313.0, 0.09635406908586754, 0.07160688142025898, 0.0483652260841171], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 18, 0, 0.0, 124.05555555555556, 99, 306, 102.5, 296.1, 306.0, 306.0, 0.09635252175961116, 0.04186149057351162, 0.05405192464162215], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c3b78cd1-c3bb-4696-b4df-d35adf2d9579", 1, 0, 0.0, 979.0, 979, 979, 979.0, 979.0, 979.0, 979.0, 1.021450459652707, 0.18453938968335037, 0.7042422114402451], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fbe12a22-62c8-4fba-95cc-3b51aab75c15", 3, 0, 0.0, 540.6666666666666, 217, 914, 491.0, 914.0, 914.0, 914.0, 0.02123984027640112, 0.025104772149613434, 0.01362060069808275], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 18, 0, 0.0, 237.11111111111111, 98, 1112, 103.5, 1111.1, 1112.0, 1112.0, 0.0963499429929504, 9.655955848307721, 0.05572322006862258], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 18, 0, 0.0, 191.22222222222223, 99, 811, 104.0, 624.7000000000003, 811.0, 811.0, 0.09635200599523593, 3.1709386625806277, 0.05581850694537377], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8b41299c-97d9-4750-92ea-14c1e90f0ebb", 1, 0, 0.0, 804.0, 804, 804, 804.0, 804.0, 804.0, 804.0, 1.243781094527363, 0.22470654539800994, 0.8575287624378108], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 103.0, 102, 105, 102.0, 105.0, 105.0, 105.0, 0.08492809421356584, 0.06311550751613634, 0.04768911540312536], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 699.7647058823528, 97, 1312, 907.0, 1237.6, 1312.0, 1312.0, 0.07874234578079983, 41.68668094933162, 0.04231134549825377], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 194.86666666666665, 100, 1013, 106.0, 588.2000000000003, 1013.0, 1013.0, 0.1270454314462852, 7.6530067021758645, 0.07396095364535692], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 521.1764705882351, 100, 910, 602.0, 837.9999999999999, 910.0, 910.0, 0.07874052218861598, 13.627755339302174, 0.04238726065197152], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 186.0666666666667, 99, 941, 103.0, 561.8000000000002, 941.0, 941.0, 0.1270454314462852, 2.522331543051462, 0.07408502144950367], "isController": false}, {"data": ["deleteBooks", 11, 0, 0.0, 565.1818181818182, 215, 979, 516.0, 944.0000000000001, 979.0, 979.0, 0.06362942224484602, 0.011495549917281751, 0.0438695040086536], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/96875c94-a47e-4319-93e1-ee6863695671", 3, 0, 0.0, 313.3333333333333, 203, 532, 205.0, 532.0, 532.0, 532.0, 0.03315320094155091, 0.027638459508890583, 0.02126035346837737], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5e5a2e17-d076-4692-b424-a82d09f90460", 2, 0, 0.0, 202.5, 196, 209, 202.5, 209.0, 209.0, 209.0, 0.05752250568034744, 0.035361735669705775, 0.03575495592338002], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 18, 0, 0.0, 366.22222222222223, 204, 1226, 209.5, 1216.1, 1226.0, 1226.0, 0.0962973662670326, 12.933229479298742, 0.21383741326549718], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=92f03735-d5bf-41cb-a351-a0170d47ce9a", 1, 0, 0.0, 337.0, 337, 337, 337.0, 337.0, 337.0, 337.0, 2.967359050445104, 0.5360951409495549, 2.0458549703264093], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 115.52941176470588, 100, 312, 103.0, 151.19999999999987, 312.0, 312.0, 0.07873869868089521, 0.05851577118765748, 0.039523135861308734], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 19, 0, 0.0, 733.684210526316, 115, 1597, 655.0, 1326.0, 1597.0, 1597.0, 0.08592658251891516, 0.052781074613669564, 0.0388515700256423], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 186.47058823529414, 99, 313, 105.0, 312.2, 313.0, 313.0, 0.07873979277539243, 0.09063579777305339, 0.04101633966493902], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=68f49ed7-ff6c-47fa-b962-581131f57eab", 1, 0, 0.0, 612.0, 612, 612, 612.0, 612.0, 612.0, 612.0, 1.6339869281045751, 0.29520271650326796, 1.1265573937908497], "isController": false}, {"data": ["login", 19, 0, 0.0, 2600.736842105263, 1608, 5268, 2541.0, 3828.0, 5268.0, 5268.0, 0.08091097237954911, 15.397175894332399, 0.14326182604353863], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 121.46666666666667, 105, 298, 107.0, 190.00000000000006, 298.0, 298.0, 0.1327233955953529, 0.10744892084819098, 0.047179019528035604], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/91fe730e-1608-41ea-b27c-7b8f76264e5d", 1, 0, 0.0, 456.0, 456, 456, 456.0, 456.0, 456.0, 456.0, 2.1929824561403506, 0.7002981085526315, 1.308508086622807], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d5385d60-edef-4e28-9d77-f0791034b6eb", 3, 0, 0.0, 358.0, 198, 563, 313.0, 563.0, 563.0, 563.0, 0.019145718060155848, 0.022629590584774047, 0.012277690292482752], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 829.0000000000001, 205, 1416, 1010.0, 1345.6, 1416.0, 1416.0, 0.07870042451934872, 55.434380953166304, 0.16515425138535894], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2b379576-b9ee-4d79-9479-db7eb5cddd41", 2, 0, 0.0, 209.5, 207, 212, 209.5, 212.0, 212.0, 212.0, 0.012127312526907474, 0.023970391166465554, 0.007538119554078718], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 12, 0, 0.0, 418.8333333333333, 204, 1510, 406.0, 1181.5000000000011, 1510.0, 1510.0, 0.0829061364358652, 8.383161126780756, 0.18469015126915478], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 1, 25.0, 911.25, 104, 1313, 1114.0, 1313.0, 1313.0, 1313.0, 0.055928411633109625, 50.186109436171705, 0.103609567253915], "isController": false}, {"data": ["register", 21, 4, 19.047619047619047, 1192.6666666666665, 800, 2048, 1041.0, 1723.6000000000004, 2022.3999999999996, 2048.0, 0.08431601642957806, 0.026772217270329194, 0.03804101522506354], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 20, 0, 0.0, 107.45, 102, 125, 106.0, 113.7, 124.44999999999999, 125.0, 0.09730087376184639, 0.07554120570377722, 0.03458741997003133], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 342.0, 202, 1117, 233.0, 695.8000000000002, 1117.0, 1117.0, 0.12693899311990656, 10.307826397175184, 0.28332353522980186], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0471d3d1-32e7-4a3d-97ba-6763ee8e158f", 1, 0, 0.0, 601.0, 601, 601, 601.0, 601.0, 601.0, 601.0, 1.663893510815308, 0.3006057612312812, 1.1471765806988352], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 20, 0, 0.0, 328.65000000000003, 201, 610, 311.0, 587.5000000000005, 609.85, 610.0, 0.10124685501956596, 0.1569128505039562, 0.22770654991216835], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8b41299c-97d9-4750-92ea-14c1e90f0ebb", 3, 0, 0.0, 449.33333333333337, 213, 910, 225.0, 910.0, 910.0, 910.0, 0.02430074603290321, 0.02437193962479648, 0.015583486225527124], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 4, 0, 0.0, 105.75, 103, 109, 105.5, 109.0, 109.0, 109.0, 0.026927866976337138, 0.0200118230165943, 0.013516526978356728], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 4, 0, 0.0, 101.0, 100, 102, 101.0, 102.0, 102.0, 102.0, 0.026929135978672126, 0.007205647713043126, 0.015358022862836445], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 4, 0, 0.0, 154.25, 99, 307, 105.5, 307.0, 307.0, 307.0, 0.02689202180942969, 0.007248240253322846, 0.01580956750905925], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 4, 0, 0.0, 154.5, 100, 307, 105.5, 307.0, 307.0, 307.0, 0.026929498572736577, 0.007258341412182905, 0.01585789808531265], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1183.327272727273, 785, 2007, 1110.0, 1631.6, 1678.0, 2007.0, 0.2395303463173298, 286.56156841748833, 0.4729788674351961], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 4, 19.047619047619047, 1192.6666666666665, 800, 2048, 1041.0, 1723.6000000000004, 2022.3999999999996, 2048.0, 0.0844258439569187, 0.026807089961767155, 0.03809056631650043], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7f925369-dabf-4a59-945d-ee5684c1ff33", 3, 0, 0.0, 819.3333333333334, 188, 1841, 429.0, 1841.0, 1841.0, 1841.0, 0.07776049766718507, 0.03655148392949715, 0.04986594414204251], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 149.11111111111111, 100, 306, 103.0, 306.0, 306.0, 306.0, 0.0454446761561883, 0.012248760370222628, 0.026760878634942916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 192.0, 99, 307, 108.0, 307.0, 307.0, 307.0, 0.0454446761561883, 0.012248760370222628, 0.026716499068384136], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 20, 0, 0.0, 183.6, 98, 1112, 103.5, 305.6, 1071.6999999999994, 1112.0, 0.09550095023445483, 4.321049610654564, 0.055733757675888874], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 20, 0, 0.0, 182.8, 99, 916, 103.0, 306.6, 885.5499999999996, 916.0, 0.09541210875072155, 1.427147115334157, 0.05577508622869329], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 20, 0, 0.0, 117.55, 101, 294, 104.0, 176.20000000000016, 288.44999999999993, 294.0, 0.09549228661054902, 0.07096643565490997, 0.04793265167756074], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 126.44444444444444, 99, 305, 104.0, 305.0, 305.0, 305.0, 0.045443987760419295, 0.012159817037455944, 0.02591727426961413], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 20, 0, 0.0, 132.95, 98, 306, 103.0, 304.1, 305.95, 306.0, 0.09540619186185183, 0.03269339133234747, 0.05401071232647999], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 126.33333333333333, 101, 309, 104.0, 309.0, 309.0, 309.0, 0.04544352884149297, 0.03377199750817984, 0.022810521313015027], "isController": false}, {"data": ["deleteAccount", 11, 0, 0.0, 655.3636363636364, 429, 1032, 563.0, 1008.4000000000001, 1032.0, 1032.0, 0.06215251096144284, 0.011228725124870045, 0.042304980605591465], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 114.0, 105, 130, 114.0, 130.0, 130.0, 130.0, 0.047979272954083836, 0.03776493554784333, 0.01705513218289699], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 19, 0, 0.0, 1353.9473684210525, 833, 2064, 1308.0, 1830.0, 2064.0, 2064.0, 0.08336331487640292, 0.043147028207513226, 0.03834386846365798], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 344.6666666666667, 207, 615, 408.0, 615.0, 615.0, 615.0, 0.0454194486078939, 0.07039127435617933, 0.10214940443748013], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/68f49ed7-ff6c-47fa-b962-581131f57eab", 3, 0, 0.0, 653.0, 382, 1032, 545.0, 1032.0, 1032.0, 1032.0, 0.02069407942387683, 0.024459701298208583, 0.013270617338879347], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bd2dc736-5c68-4dea-875a-553344b839c6", 1, 0, 0.0, 260.0, 260, 260, 260.0, 260.0, 260.0, 260.0, 3.8461538461538463, 1.2282151442307692, 2.294921875], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/614f0af2-9f49-4545-8850-e5c4dc9e4673", 1, 0, 0.0, 258.0, 258, 258, 258.0, 258.0, 258.0, 258.0, 3.875968992248062, 1.237736191860465, 2.3127119670542635], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/92f03735-d5bf-41cb-a351-a0170d47ce9a", 3, 0, 0.0, 526.0, 326, 754, 498.0, 754.0, 754.0, 754.0, 0.08211978539362749, 0.03715706435453849, 0.0526614509197416], "isController": false}, {"data": ["addBook", 60, 6, 10.0, 1056.1666666666667, 522, 2712, 863.5, 1836.7, 1996.4999999999998, 2712.0, 0.2990460431224394, 90.56412290885824, 1.0887145007426309], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/28937482-495b-43b9-bb78-e2f59404635a", 3, 0, 0.0, 331.6666666666667, 216, 536, 243.0, 536.0, 536.0, 536.0, 0.017207162768288344, 0.023721462995996465, 0.011034541228361993], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 187.56363636363636, 100, 706, 105.0, 413.8, 434.3999999999997, 706.0, 0.24047290089018694, 0.1787108179467112, 0.11624422455140873], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e55fcc8d-0c9e-46bb-9943-047826672f7b", 3, 0, 0.0, 376.0, 215, 601, 312.0, 601.0, 601.0, 601.0, 0.05178842701284353, 0.03329496853853059, 0.033210677478939375], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 646.4545454545457, 490, 975, 606.0, 822.6, 891.9999999999999, 975.0, 0.24040037589876959, 70.68569255796928, 0.12090448592565073], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c3b78cd1-c3bb-4696-b4df-d35adf2d9579", 3, 0, 0.0, 387.0, 195, 686, 280.0, 686.0, 686.0, 686.0, 0.020291247032405122, 0.023983567049043943, 0.013012290577421252], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 150.0909090909091, 101, 429, 105.0, 305.8, 309.0, 429.0, 0.24094696538249236, 0.42636318483698843, 0.11717928589890741], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 994.1636363636364, 681, 1297, 1005.0, 1239.6, 1271.6, 1297.0, 0.24031214362801429, 216.23328926017723, 0.1206254314695306], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 20, 0, 0.0, 118.69999999999999, 102, 306, 106.5, 122.0, 296.79999999999984, 306.0, 0.1033890945183102, 0.07723892315088605, 0.036751592192055586], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 6, 3.4285714285714284, 171.63428571428565, 101, 1086, 109.0, 304.8, 355.59999999999997, 1075.3600000000001, 0.7055455883242284, 1.4676529396052977, 0.3410399489991332], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 4, 0, 0.0, 212.0, 107, 311, 215.0, 311.0, 311.0, 311.0, 0.026846718659811804, 0.020790476462139416, 0.009543169523604978], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fbe12a22-62c8-4fba-95cc-3b51aab75c15", 1, 0, 0.0, 789.0, 789, 789, 789.0, 789.0, 789.0, 789.0, 1.2674271229404308, 0.2289785329531052, 0.8738315906210392], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=96875c94-a47e-4319-93e1-ee6863695671", 1, 0, 0.0, 451.0, 451, 451, 451.0, 451.0, 451.0, 451.0, 2.2172949002217295, 0.4005855044345898, 1.5287208980044344], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 12, 0, 0.0, 123.41666666666666, 102, 313, 107.0, 251.50000000000023, 313.0, 313.0, 0.08169600914995302, 0.06629822617540133, 0.029040378252522366], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 4, 0, 0.0, 313.25, 212, 412, 314.5, 412.0, 412.0, 412.0, 0.026872149032938535, 0.04164658253444673, 0.06043609299107173], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 20, 0, 0.0, 353.3499999999999, 204, 1215, 221.0, 589.0000000000002, 1184.2499999999995, 1215.0, 0.09535297286731158, 5.84415484041488, 0.21323122321177418], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 18, 0, 0.0, 118.88888888888889, 104, 325, 105.0, 140.50000000000028, 325.0, 325.0, 0.09571769660680765, 0.07935969181560518, 0.03402464996570116], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 109.70588235294117, 101, 124, 108.0, 124.0, 124.0, 124.0, 0.08026819018839416, 0.062317589062278675, 0.02853283323103074], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d5385d60-edef-4e28-9d77-f0791034b6eb", 1, 0, 0.0, 449.0, 449, 449, 449.0, 449.0, 449.0, 449.0, 2.2271714922048997, 0.40236984966592426, 1.5355303452115812], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 20, 0, 0.0, 124.19999999999999, 99, 308, 104.0, 285.10000000000036, 307.8, 308.0, 0.10130018791184858, 0.07528265918058279, 0.050847945885439616], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 20, 0, 0.0, 171.40000000000003, 97, 307, 103.5, 303.9, 306.85, 307.0, 0.10130224029904421, 0.02710626351751769, 0.05777393392054865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 20, 0, 0.0, 172.3, 99, 306, 104.0, 304.9, 305.95, 306.0, 0.10130172719444867, 0.02730398115787874, 0.05955433571392392], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 20, 0, 0.0, 151.89999999999998, 99, 308, 103.0, 303.40000000000003, 307.8, 308.0, 0.10130275340883765, 0.027304257754725773, 0.05965386748586827], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 36.36363636363637, 0.31323414252153486], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 9.090909090909092, 0.07830853563038372], "isController": false}, {"data": ["401/Unauthorized", 6, 54.54545454545455, 0.46985121378230227], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1277, 11, "401/Unauthorized", 6, "406/Not Acceptable", 4, "Test failed: code expected to contain /200/", 1, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 1, "Test failed: code expected to contain /200/", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
