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

    var data = {"OkPercent": 98.07121661721068, "KoPercent": 1.9287833827893175};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8077905491698595, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.38596491228070173, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=17798815-e0ed-4851-8159-5076f9540333"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5d8361e8-d09b-4a9b-b11d-bc0f4370726c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f939e8d6-3427-4b94-aff4-f578d5cc847e"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/2ead82d0-a63f-4dfb-bbb7-1690ebf6ec2a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0d72c53a-c461-4725-8b27-f763a8856790"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/428cd00f-245b-470e-90ca-1b93e97c5090"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.045454545454545456, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a074b260-ad81-4f1d-b26e-028943ab3eed"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/dfac7e86-0c55-4a11-9b7b-623e2b5c6c4b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b96025d2-a399-4c5c-a6cd-6118dab74814"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=51f6f138-aff7-463f-a521-fb26cdbf0c0b"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7cd5fb56-a713-4f3b-a79c-2206cf8e3641"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0af5b553-f58d-47a4-93d8-567b4795b941"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/1ae36c9f-b424-4c19-a8e2-b4d316e8ebc2"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "register"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/51f6f138-aff7-463f-a521-fb26cdbf0c0b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5d8361e8-d09b-4a9b-b11d-bc0f4370726c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0af5b553-f58d-47a4-93d8-567b4795b941"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.49122807017543857, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2608695652173913, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5384615384615384, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.2727272727272727, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a074b260-ad81-4f1d-b26e-028943ab3eed"], "isController": false}, {"data": [0.36885245901639346, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a23c51ce-05cf-4c6d-aef3-8c7cb3426d70"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2ead82d0-a63f-4dfb-bbb7-1690ebf6ec2a"], "isController": false}, {"data": [0.9912280701754386, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.7543859649122807, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/17798815-e0ed-4851-8159-5076f9540333"], "isController": false}, {"data": [0.9385474860335196, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=428cd00f-245b-470e-90ca-1b93e97c5090"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1ae36c9f-b424-4c19-a8e2-b4d316e8ebc2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f939e8d6-3427-4b94-aff4-f578d5cc847e"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b96025d2-a399-4c5c-a6cd-6118dab74814"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dfac7e86-0c55-4a11-9b7b-623e2b5c6c4b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/7cd5fb56-a713-4f3b-a79c-2206cf8e3641"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1348, 26, 1.9287833827893175, 311.05044510385767, 81, 3105, 100.0, 824.1000000000001, 1025.7499999999998, 1706.4199999999996, 5.32787371200234, 750.5363530484587, 3.907307583425886], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1375.2280701754385, 1004, 2051, 1363.0, 1671.0, 1798.1999999999998, 2051.0, 0.2523620199587366, 303.6759895455159, 1.2408620805588269], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=17798815-e0ed-4851-8159-5076f9540333", 1, 0, 0.0, 559.0, 559, 559, 559.0, 559.0, 559.0, 559.0, 1.7889087656529516, 0.3231915250447227, 1.2333687388193202], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 522.0, 87, 1980, 439.0, 1315.0, 1980.0, 1980.0, 0.10524812244867275, 0.02073247054932002, 0.07081636363978078], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 522.0, 87, 1980, 439.0, 1315.0, 1980.0, 1980.0, 0.10513036164844407, 0.020709273248828545, 0.07073712810134566], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5d8361e8-d09b-4a9b-b11d-bc0f4370726c", 3, 0, 0.0, 269.0, 178, 420, 209.0, 420.0, 420.0, 420.0, 0.05534034311012728, 0.03557850834716842, 0.03548843617413761], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 138.93333333333334, 81, 254, 85.0, 253.4, 254.0, 254.0, 0.09829104634095197, 0.02630053388420004, 0.05605661236632418], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 107.26666666666667, 82, 253, 85.0, 248.2, 253.0, 253.0, 0.09818167537210855, 0.0729650927325924, 0.04928259877076543], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 155.86666666666665, 83, 342, 86.0, 289.8, 342.0, 342.0, 0.09829104634095197, 0.026492508584084713, 0.05788037201522856], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 106.2, 82, 248, 85.0, 247.4, 248.0, 248.0, 0.09829169042049185, 0.026492682183648194, 0.05778476331360947], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 226.78571428571428, 83, 495, 215.0, 408.5, 495.0, 495.0, 0.10509011477341822, 0.23519191143905901, 0.06792445615865605], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 85.64999999999998, 83, 89, 85.5, 88.0, 88.95, 89.0, 0.09331491918927998, 0.06934829443656451, 0.046839715296181555], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 92.35, 82, 248, 84.0, 89.7, 240.09999999999988, 248.0, 0.09324617923780573, 0.02495063780386599, 0.05317946159656108], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f939e8d6-3427-4b94-aff4-f578d5cc847e", 3, 0, 0.0, 311.6666666666667, 222, 446, 267.0, 446.0, 446.0, 446.0, 0.03062662065867652, 0.025532153485309433, 0.01964011806562264], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 587.0, 488, 677, 612.5, 677.0, 677.0, 677.0, 0.08225798159477662, 24.186577810909466, 0.04691275512827104], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 882.25, 729, 972, 916.0, 972.0, 972.0, 972.0, 0.08219290675214729, 73.95732197530104, 0.04679537562158386], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2ead82d0-a63f-4dfb-bbb7-1690ebf6ec2a", 3, 0, 0.0, 1100.0, 184, 2798, 318.0, 2798.0, 2798.0, 2798.0, 0.01631667400916997, 0.022493852353136338, 0.010463492121765899], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 187.375, 83, 254, 246.0, 254.0, 254.0, 254.0, 0.08260025606079378, 0.1461637343575765, 0.04573666522116218], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 98.76923076923077, 82, 245, 86.0, 187.79999999999995, 245.0, 245.0, 0.07490075649764064, 0.055663550483109885, 0.03759666878885477], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0d72c53a-c461-4725-8b27-f763a8856790", 1, 0, 0.0, 275.0, 275, 275, 275.0, 275.0, 275.0, 275.0, 3.6363636363636362, 1.1612215909090908, 2.169744318181818], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 109.38461538461539, 81, 244, 86.0, 243.6, 244.0, 244.0, 0.07490205116386264, 0.020042150409080434, 0.04271757605439041], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 160.3846153846154, 81, 252, 88.0, 252.0, 252.0, 252.0, 0.07490161960348235, 0.0201883271587511, 0.04403395996220349], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 122.61538461538463, 81, 254, 85.0, 251.6, 254.0, 254.0, 0.07490161960348235, 0.0201883271587511, 0.04410710607509751], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 133.125, 83, 295, 86.0, 295.0, 295.0, 295.0, 0.08256019153964438, 0.061355767345380244, 0.04635948255399953], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 101.35, 82, 254, 84.5, 231.40000000000032, 253.65, 254.0, 0.09331666075661148, 0.025151756219555437, 0.054859990015117294], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 598.3125, 82, 1001, 810.5, 995.4, 1001.0, 1001.0, 0.07491899383791276, 42.140223846832804, 0.04002020471615066], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 110.15, 84, 254, 85.0, 248.9, 253.75, 254.0, 0.09331709615860175, 0.025151873573998125, 0.05495137596058286], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 459.99999999999994, 82, 763, 644.0, 740.6, 763.0, 763.0, 0.07491899383791276, 13.77549221193647, 0.0400933677960705], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 502.9285714285714, 90, 868, 472.5, 839.5, 868.0, 868.0, 0.10512483574244415, 0.02070818471935423, 0.07140803923409048], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 273.84615384615387, 169, 496, 328.0, 438.79999999999995, 496.0, 496.0, 0.07486409287754538, 0.11602472206705519, 0.16837109950877638], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 486.0454545454545, 114, 995, 429.0, 912.0999999999999, 984.9499999999998, 995.0, 0.1008337114597513, 0.06193789502752302, 0.045591805083852396], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/428cd00f-245b-470e-90ca-1b93e97c5090", 3, 0, 0.0, 327.0, 220, 439, 322.0, 439.0, 439.0, 439.0, 0.020114248933944805, 0.023774361288786978, 0.012898785937458095], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 85.625, 83, 89, 86.0, 89.0, 89.0, 89.0, 0.0749175906502847, 0.05567606102037758, 0.03760511874438118], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 136.75, 82, 256, 85.5, 253.9, 256.0, 256.0, 0.07491794144226402, 0.09037342496734045, 0.038794178173594235], "isController": false}, {"data": ["login", 22, 0, 0.0, 2648.090909090909, 1384, 4862, 2437.5, 4084.2, 4756.399999999999, 4862.0, 0.10067175516629144, 43.93019028677722, 0.21259579546702542], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 97.25000000000001, 85, 251, 88.0, 100.4, 243.4999999999999, 251.0, 0.09729472030200281, 0.0787669171194925, 0.03458523260735256], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a074b260-ad81-4f1d-b26e-028943ab3eed", 1, 0, 0.0, 811.0, 811, 811, 811.0, 811.0, 811.0, 811.0, 1.2330456226880395, 0.22276703144266335, 0.8501271578298396], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dfac7e86-0c55-4a11-9b7b-623e2b5c6c4b", 3, 0, 0.0, 333.6666666666667, 211, 542, 248.0, 542.0, 542.0, 542.0, 0.028301619796039658, 0.02838453469778587, 0.018149150715559285], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b96025d2-a399-4c5c-a6cd-6118dab74814", 1, 0, 0.0, 575.0, 575, 575, 575.0, 575.0, 575.0, 575.0, 1.7391304347826089, 0.3141983695652174, 1.1990489130434783], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 695.3125, 169, 1088, 897.0, 1081.7, 1088.0, 1088.0, 0.07488813584707843, 56.03867686998016, 0.15644965294029545], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=51f6f138-aff7-463f-a521-fb26cdbf0c0b", 1, 0, 0.0, 442.0, 442, 442, 442.0, 442.0, 442.0, 442.0, 2.2624434389140275, 0.40874222285067874, 1.5598486990950227], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 308.5333333333333, 167, 502, 333.0, 500.2, 502.0, 502.0, 0.09812772304431447, 0.15207880514778035, 0.22069154899517213], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 4, 33.333333333333336, 719.25, 83, 1263, 896.0, 1232.4, 1263.0, 1263.0, 0.12291555701233252, 98.04412220367108, 0.21192130459499323], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7cd5fb56-a713-4f3b-a79c-2206cf8e3641", 1, 0, 0.0, 442.0, 442, 442, 442.0, 442.0, 442.0, 442.0, 2.2624434389140275, 0.40874222285067874, 1.5598486990950227], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0af5b553-f58d-47a4-93d8-567b4795b941", 3, 0, 0.0, 405.6666666666667, 233, 495, 489.0, 495.0, 495.0, 495.0, 0.03909864588356423, 0.03236583869853641, 0.02507302486673878], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1ae36c9f-b424-4c19-a8e2-b4d316e8ebc2", 3, 0, 0.0, 636.0, 181, 1527, 200.0, 1527.0, 1527.0, 1527.0, 0.020291933280123374, 0.02797406817751383, 0.013012730651641616], "isController": false}, {"data": ["register", 23, 9, 39.130434782608695, 1019.2173913043475, 182, 2886, 1054.0, 1533.0000000000002, 2626.9999999999964, 2886.0, 0.09333771614783071, 0.028977809972526247, 0.042111352402634555], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/51f6f138-aff7-463f-a521-fb26cdbf0c0b", 3, 0, 0.0, 654.0, 221, 1344, 397.0, 1344.0, 1344.0, 1344.0, 0.018613077548285426, 0.025659630018551035, 0.011936120693399183], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5d8361e8-d09b-4a9b-b11d-bc0f4370726c", 1, 0, 0.0, 465.0, 465, 465, 465.0, 465.0, 465.0, 465.0, 2.150537634408602, 0.3885248655913978, 1.4826948924731183], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 213.6, 171, 343, 173.0, 338.40000000000003, 342.8, 343.0, 0.09320706882409963, 0.1444527521717247, 0.20962488232607562], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 110.41176470588235, 85, 249, 88.0, 247.4, 249.0, 249.0, 0.10822786421859482, 0.08402456255252234, 0.03847162360895363], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0af5b553-f58d-47a4-93d8-567b4795b941", 1, 0, 0.0, 480.0, 480, 480, 480.0, 480.0, 480.0, 480.0, 2.0833333333333335, 0.3763834635416667, 1.4363606770833335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 299.4736842105263, 169, 794, 217.0, 510.0, 794.0, 794.0, 0.11351822863766176, 7.314422434936131, 0.25377648820904086], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 99.08333333333333, 83, 246, 86.0, 199.50000000000017, 246.0, 246.0, 0.08024340499515195, 0.05963401484502993, 0.04027842789795714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 130.91666666666669, 83, 296, 84.5, 284.00000000000006, 296.0, 296.0, 0.08024501477845689, 0.04155918571371253, 0.04464151375533295], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 264.0, 82, 940, 164.5, 875.5000000000002, 940.0, 940.0, 0.08015657250495968, 12.03884139101712, 0.045975221599524406], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 181.16666666666666, 82, 509, 84.5, 506.0, 509.0, 509.0, 0.08024447817684545, 3.9504471539958406, 0.046104005202517], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 91.0, 90, 92, 91.0, 92.0, 92.0, 92.0, 0.7889546351084812, 0.2326799802761341, 0.4877034023668639], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 918.894736842105, 650, 1685, 853.0, 1324.0, 1439.6999999999998, 1685.0, 0.253794675654857, 303.62666538841717, 0.501145345873165], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 9, 39.130434782608695, 1019.2173913043475, 182, 2886, 1054.0, 1533.0000000000002, 2626.9999999999964, 2886.0, 0.09170105456212746, 0.028469688814464846, 0.041372936726272354], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 112.5, 84, 245, 85.5, 245.0, 245.0, 245.0, 0.02927300492274366, 0.007889989608083252, 0.017237912078529715], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 84.0, 82, 88, 83.5, 88.0, 88.0, 88.0, 0.02927300492274366, 0.007889989608083252, 0.017209325159659845], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 153.64705882352945, 82, 755, 85.0, 354.99999999999966, 755.0, 755.0, 0.10205000450220608, 5.42734494589849, 0.05947836314794249], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 127.58823529411765, 81, 487, 85.0, 299.79999999999984, 487.0, 487.0, 0.10204939190568235, 1.7909410342105578, 0.059577663714237686], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 111.83333333333333, 82, 252, 83.0, 252.0, 252.0, 252.0, 0.029273290561803233, 0.007832892201107507, 0.01669492352352841], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 105.05882352941177, 82, 255, 86.0, 248.6, 255.0, 255.0, 0.1020438788679132, 0.07583534357273627, 0.051221243884870496], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 112.33333333333333, 84, 247, 86.0, 247.0, 247.0, 247.0, 0.029272433661347217, 0.021754220719028546, 0.014693389552668426], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 113.11764705882354, 82, 251, 84.0, 250.2, 251.0, 251.0, 0.10204939190568235, 0.036322267477459085, 0.05769589356248424], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 107.83333333333333, 83, 130, 111.5, 130.0, 130.0, 130.0, 0.028636610952549137, 0.022540144948979105, 0.01017942029953895], "isController": false}, {"data": ["deleteAccount", 13, 2, 15.384615384615385, 893.0769230769231, 85, 3029, 446.0, 2936.6, 3029.0, 3029.0, 0.11608075648936075, 0.022523782603066318, 0.07899455927262013], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1464.1363636363637, 759, 2145, 1377.5, 2080.4, 2137.2, 2145.0, 0.10085682456872247, 0.05220128615373331, 0.046390199581902616], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 227.16666666666669, 169, 500, 172.0, 500.0, 500.0, 500.0, 0.029260299625468163, 0.045347749517205056, 0.06580709964595037], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a074b260-ad81-4f1d-b26e-028943ab3eed", 3, 0, 0.0, 271.0, 205, 401, 207.0, 401.0, 401.0, 401.0, 0.02807753142343725, 0.028159789816279354, 0.01800544821099329], "isController": false}, {"data": ["addBook", 61, 9, 14.754098360655737, 877.9836065573769, 434, 2187, 724.0, 1537.0000000000002, 1629.3, 2187.0, 0.29088481438210817, 80.98549618064662, 1.0598686994826065], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a23c51ce-05cf-4c6d-aef3-8c7cb3426d70", 1, 0, 0.0, 315.0, 315, 315, 315.0, 315.0, 315.0, 315.0, 3.1746031746031744, 1.013764880952381, 1.8942212301587302], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2ead82d0-a63f-4dfb-bbb7-1690ebf6ec2a", 1, 0, 0.0, 868.0, 868, 868, 868.0, 868.0, 868.0, 868.0, 1.152073732718894, 0.20813832085253456, 0.7943008352534562], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 138.71929824561403, 83, 604, 87.0, 338.4, 345.2, 604.0, 0.25471786644740074, 0.1892971644203828, 0.12313021864400721], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 542.0, 405, 752, 500.0, 674.4, 711.8, 752.0, 0.25498564028236304, 74.97424456310223, 0.12823984838419625], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 120.08771929824559, 81, 347, 88.0, 250.4, 291.59999999999974, 347.0, 0.25536032686121835, 0.45186807839114035, 0.12418890896180347], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 777.4035087719299, 565, 1109, 764.0, 986.6, 1046.4999999999995, 1109.0, 0.2545256445750315, 229.02262239697293, 0.12775994268707636], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 92.21052631578947, 84, 122, 89.0, 119.0, 122.0, 122.0, 0.11467474620668011, 0.08567009848448269, 0.04076328869065582], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/17798815-e0ed-4851-8159-5076f9540333", 3, 0, 0.0, 1152.6666666666665, 186, 3029, 243.0, 3029.0, 3029.0, 3029.0, 0.020352505393413926, 0.024055972357905592, 0.01305157409668797], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 9, 5.027932960893855, 154.87709497206708, 82, 1835, 90.0, 272.0, 333.0, 1390.9999999999936, 0.7374509739296662, 1.5585700609324016, 0.3552434785541841], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 128.41666666666669, 85, 258, 92.5, 254.10000000000002, 258.0, 258.0, 0.08366042234569881, 0.06478780753919838, 0.02973866575569762], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=428cd00f-245b-470e-90ca-1b93e97c5090", 1, 0, 0.0, 405.0, 405, 405, 405.0, 405.0, 405.0, 405.0, 2.4691358024691357, 0.44608410493827155, 1.7023533950617282], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 99.00000000000001, 84, 251, 89.0, 157.40000000000006, 251.0, 251.0, 0.09836517086030179, 0.07982564158682694, 0.0349657443292479], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1ae36c9f-b424-4c19-a8e2-b4d316e8ebc2", 1, 0, 0.0, 770.0, 770, 770, 770.0, 770.0, 770.0, 770.0, 1.2987012987012987, 0.2346286525974026, 0.8953936688311688], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f939e8d6-3427-4b94-aff4-f578d5cc847e", 1, 0, 0.0, 623.0, 623, 623, 623.0, 623.0, 623.0, 623.0, 1.6051364365971108, 0.2899904695024077, 1.1066663322632424], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 391.75, 169, 1023, 332.5, 960.3000000000002, 1023.0, 1023.0, 0.0801100177577206, 16.07670106529634, 0.1767531576698666], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 270.1176470588235, 168, 842, 174.0, 574.7999999999997, 842.0, 842.0, 0.10199245255851067, 7.326325039447081, 0.22784837359535395], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b96025d2-a399-4c5c-a6cd-6118dab74814", 3, 0, 0.0, 393.0, 189, 787, 203.0, 787.0, 787.0, 787.0, 0.03918802413982287, 0.032669443301460405, 0.02513034100112339], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 92.15384615384615, 84, 110, 89.0, 109.6, 110.0, 110.0, 0.07715637222608004, 0.06397046876947457, 0.02742667918973939], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dfac7e86-0c55-4a11-9b7b-623e2b5c6c4b", 1, 0, 0.0, 419.0, 419, 419, 419.0, 419.0, 419.0, 419.0, 2.3866348448687353, 0.431179146778043, 1.6454728520286397], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 91.8125, 86, 99, 90.5, 99.0, 99.0, 99.0, 0.07384331371870313, 0.05732952578746971, 0.02624899042344525], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 104.05263157894736, 81, 255, 86.0, 253.0, 255.0, 255.0, 0.1135759075611666, 0.08440553286528105, 0.05700978172503871], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 139.6315789473684, 82, 271, 85.0, 260.0, 271.0, 271.0, 0.11357862330752906, 0.039369563917864725, 0.06427326493708342], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 171.42105263157896, 81, 707, 86.0, 255.0, 707.0, 707.0, 0.11357794435876284, 5.407824446232799, 0.06625769266406036], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 155.1578947368421, 82, 649, 84.0, 332.0, 649.0, 649.0, 0.11357930226441261, 1.7866906914289473, 0.0663694021095861], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7cd5fb56-a713-4f3b-a79c-2206cf8e3641", 2, 0, 0.0, 1678.5, 252, 3105, 1678.5, 3105.0, 3105.0, 3105.0, 0.03251662412408344, 0.027404147088949227, 0.020211749272440536], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 34.61538461538461, 0.6676557863501483], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 7.6923076923076925, 0.14836795252225518], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 7.6923076923076925, 0.14836795252225518], "isController": false}, {"data": ["401/Unauthorized", 13, 50.0, 0.9643916913946587], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1348, 26, "401/Unauthorized", 13, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
