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

    var data = {"OkPercent": 96.94767441860465, "KoPercent": 3.052325581395349};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8000625782227785, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c83b867f-7f89-4118-9c39-979e6a7ff63d"], "isController": false}, {"data": [0.4152542372881356, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a84dd7eb-b624-4f96-b081-458bd69147e6"], "isController": false}, {"data": [0.5357142857142857, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5357142857142857, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/14c68971-5c91-4f96-bd26-c97f05027e65"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4aecfcf8-31c1-4e05-ba9d-4096b2b98693"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2494a7bf-73e5-4804-a922-db9485c095b5"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/490fc35a-465f-4898-8af4-64455be2ad20"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e552a16d-1e6f-4061-8560-a142daf74192"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=85399594-a296-4182-869d-ed0a7adf9c1d"], "isController": false}, {"data": [0.717391304347826, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8a964aa2-dd4f-4ca1-b632-268ae257a4d7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/323fd3e5-a05a-4c5d-922b-51368b954764"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=342441cd-dd03-44d6-b60e-2e60a2bee829"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7eff1870-b532-4548-8f0b-81f89a2c1ab1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.32608695652173914, 500, 1500, "register"], "isController": true}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=490fc35a-465f-4898-8af4-64455be2ad20"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a84dd7eb-b624-4f96-b081-458bd69147e6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4915254237288136, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.32608695652173914, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/342441cd-dd03-44d6-b60e-2e60a2bee829"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.391304347826087, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4aecfcf8-31c1-4e05-ba9d-4096b2b98693"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a3c18df2-f58d-41d5-ab21-144210fcb5fe"], "isController": false}, {"data": [0.28688524590163933, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8050847457627118, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8701657458563536, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8a964aa2-dd4f-4ca1-b632-268ae257a4d7"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e552a16d-1e6f-4061-8560-a142daf74192"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1778ac3b-6569-4eb3-8711-54bc266b2dd3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a3c18df2-f58d-41d5-ab21-144210fcb5fe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/eaa97b96-58f6-463d-a31a-4e27aa4e7f63"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/85399594-a296-4182-869d-ed0a7adf9c1d"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=323fd3e5-a05a-4c5d-922b-51368b954764"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c83b867f-7f89-4118-9c39-979e6a7ff63d"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7eff1870-b532-4548-8f0b-81f89a2c1ab1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1376, 42, 3.052325581395349, 290.13590116279056, 77, 2295, 88.5, 806.5999999999999, 1005.2999999999997, 1451.3700000000003, 5.409591803839395, 765.4422978921856, 3.9641036198759254], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c83b867f-7f89-4118-9c39-979e6a7ff63d", 1, 0, 0.0, 441.0, 441, 441, 441.0, 441.0, 441.0, 441.0, 2.2675736961451247, 0.4096690759637188, 1.5633857709750567], "isController": false}, {"data": ["see books", 59, 0, 0.0, 1311.6101694915255, 948, 1870, 1270.0, 1586.0, 1710.0, 1870.0, 0.2579291350630615, 310.3762172397211, 1.2682355420337057], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a84dd7eb-b624-4f96-b081-458bd69147e6", 3, 0, 0.0, 276.0, 171, 359, 298.0, 359.0, 359.0, 359.0, 0.023262305759746905, 0.023330457046152414, 0.014917559357650196], "isController": false}, {"data": ["deleteBook", 14, 3, 21.428571428571427, 554.642857142857, 81, 1954, 482.0, 1356.0, 1954.0, 1954.0, 0.08183545228700861, 0.016788369501680552, 0.054783400920648845], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, 21.428571428571427, 554.642857142857, 81, 1954, 482.0, 1356.0, 1954.0, 1954.0, 0.08307767168890973, 0.017043208177809955, 0.05561498431908947], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 24, 0, 0.0, 98.95833333333336, 77, 240, 79.0, 234.5, 238.75, 240.0, 0.11818177341599492, 0.03162285733982677, 0.0674005426513096], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 24, 0, 0.0, 80.58333333333333, 78, 88, 80.0, 84.0, 87.75, 88.0, 0.11818002757533977, 0.08782714939925153, 0.05932083415402797], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 24, 0, 0.0, 93.20833333333333, 77, 241, 79.0, 163.5, 241.0, 241.0, 0.11818060951649358, 0.03185336740874241, 0.06959268314301331], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 24, 0, 0.0, 99.70833333333334, 78, 236, 80.0, 234.0, 235.75, 236.0, 0.11818177341599492, 0.03185368111602988, 0.06947795663713764], "isController": false}, {"data": ["goToProfile", 14, 3, 21.428571428571427, 221.92857142857142, 79, 350, 237.5, 335.5, 350.0, 350.0, 0.0817122212300024, 0.12154806903807205, 0.05280857489508735], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/14c68971-5c91-4f96-bd26-c97f05027e65", 1, 0, 0.0, 159.0, 159, 159, 159.0, 159.0, 159.0, 159.0, 6.289308176100629, 2.008402122641509, 3.752702437106918], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 81.75, 78, 96, 80.0, 89.0, 96.0, 96.0, 0.07336218912772356, 0.05452014250605238, 0.03682438008950187], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 99.6875, 78, 238, 80.5, 235.2, 238.0, 238.0, 0.07336420743729653, 0.026517507107157594, 0.04145543410977119], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 564.1249999999999, 386, 704, 616.5, 704.0, 704.0, 704.0, 0.06432005660164981, 18.912232267764395, 0.036682532280628406], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 774.625, 541, 925, 808.5, 925.0, 925.0, 925.0, 0.06420133538777607, 57.76847443583076, 0.03655212747175141], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 160.125, 79, 240, 160.0, 240.0, 240.0, 240.0, 0.06460522171704529, 0.11432095874149029, 0.0357726178843405], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4aecfcf8-31c1-4e05-ba9d-4096b2b98693", 1, 0, 0.0, 1184.0, 1184, 1184, 1184.0, 1184.0, 1184.0, 1184.0, 0.8445945945945946, 0.152587890625, 0.5823083826013514], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2494a7bf-73e5-4804-a922-db9485c095b5", 1, 0, 0.0, 279.0, 279, 279, 279.0, 279.0, 279.0, 279.0, 3.5842293906810037, 1.144573252688172, 2.1386368727598564], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/490fc35a-465f-4898-8af4-64455be2ad20", 3, 0, 0.0, 950.3333333333334, 265, 2137, 449.0, 2137.0, 2137.0, 2137.0, 0.0452932739488186, 0.029119210953423416, 0.029045491432022345], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 80.83333333333334, 79, 84, 80.0, 84.0, 84.0, 84.0, 0.059856344772545894, 0.04448308434756584, 0.030045079309656827], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 113.25, 77, 324, 80.0, 297.30000000000007, 324.0, 324.0, 0.059856344772545894, 0.01601624850359138, 0.03413682162809258], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 92.08333333333333, 77, 231, 79.0, 186.90000000000015, 231.0, 231.0, 0.059856344772545894, 0.01613315542697526, 0.03518898393854749], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 125.91666666666667, 78, 318, 79.5, 296.70000000000005, 318.0, 318.0, 0.05985783763561541, 0.016133557800224466, 0.0352483164983165], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 104.25000000000001, 79, 240, 81.0, 240.0, 240.0, 240.0, 0.06460469999192442, 0.048011891302592265, 0.03627705321812162], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 137.5, 78, 843, 80.0, 416.00000000000045, 843.0, 843.0, 0.07331243928813622, 4.14144135262596, 0.04270592776891919], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 548.8235294117648, 77, 1075, 709.0, 1038.2, 1075.0, 1075.0, 0.08671080416619911, 45.90523170593306, 0.046593110189029556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 114.625, 79, 469, 81.0, 303.10000000000014, 469.0, 469.0, 0.07331277520928506, 1.365799461494756, 0.042777717956589675], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 419.99999999999994, 79, 706, 467.0, 702.0, 706.0, 706.0, 0.0867094773458739, 15.006955885278261, 0.046677074460488535], "isController": false}, {"data": ["deleteBooks", 14, 3, 21.428571428571427, 488.7142857142857, 81, 1663, 426.5, 1423.5, 1663.0, 1663.0, 0.08340929537018832, 0.017111240072804398, 0.05623261996044016], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/e552a16d-1e6f-4061-8560-a142daf74192", 3, 0, 0.0, 300.6666666666667, 267, 341, 294.0, 341.0, 341.0, 341.0, 0.058496636443404505, 0.037607700838451795, 0.03751249146924052], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 215.08333333333331, 160, 405, 163.0, 403.5, 405.0, 405.0, 0.05983097748859472, 0.09272632936953108, 0.13456127066038442], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=85399594-a296-4182-869d-ed0a7adf9c1d", 1, 0, 0.0, 559.0, 559, 559, 559.0, 559.0, 559.0, 559.0, 1.7889087656529516, 0.3231915250447227, 1.2333687388193202], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 573.304347826087, 99, 1503, 556.0, 1047.8000000000002, 1418.199999999999, 1503.0, 0.1172392700581099, 0.07201513756499134, 0.05300955277041492], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 92.11764705882354, 79, 240, 82.0, 126.39999999999989, 240.0, 240.0, 0.08670682382703519, 0.06443739544177127, 0.04352276117880478], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 152.35294117647055, 78, 237, 80.0, 236.2, 237.0, 237.0, 0.08670991961480393, 0.09981005108234381, 0.04516805785081813], "isController": false}, {"data": ["login", 23, 0, 0.0, 2506.3913043478265, 1565, 4042, 2305.0, 3739.4000000000005, 4018.5999999999995, 4042.0, 0.11312050284522655, 47.22340077426066, 0.23591907180938704], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/8a964aa2-dd4f-4ca1-b632-268ae257a4d7", 3, 0, 0.0, 320.3333333333333, 222, 409, 330.0, 409.0, 409.0, 409.0, 0.01759654638449627, 0.02425825974555394, 0.011284243612453662], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 100.06249999999999, 79, 303, 85.0, 161.60000000000014, 303.0, 303.0, 0.07405418915291265, 0.0599520730544576, 0.026323950050449418], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/323fd3e5-a05a-4c5d-922b-51368b954764", 3, 0, 0.0, 1000.6666666666666, 253, 1427, 1322.0, 1427.0, 1427.0, 1427.0, 0.026426362939668616, 0.026503783924843424, 0.016946593421597385], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=342441cd-dd03-44d6-b60e-2e60a2bee829", 1, 0, 0.0, 196.0, 196, 196, 196.0, 196.0, 196.0, 196.0, 5.1020408163265305, 0.9217554209183673, 3.5176179846938775], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 669.9411764705883, 160, 1156, 808.0, 1121.6, 1156.0, 1156.0, 0.08667101721184436, 61.04864382959713, 0.18188068300585283], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7eff1870-b532-4548-8f0b-81f89a2c1ab1", 1, 0, 0.0, 174.0, 174, 174, 174.0, 174.0, 174.0, 174.0, 5.747126436781609, 1.038299209770115, 3.9623742816091956], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 24, 0, 0.0, 201.49999999999997, 158, 323, 163.0, 320.0, 322.25, 323.0, 0.1181323278959648, 0.18308203551845326, 0.2656823741644599], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 6, 42.857142857142854, 543.0, 79, 1007, 736.5, 975.5, 1007.0, 1007.0, 0.09459075983406079, 64.67566665371675, 0.1487415945130603], "isController": false}, {"data": ["register", 23, 8, 34.78260869565217, 850.6086956521739, 86, 1447, 770.0, 1394.2000000000003, 1445.8, 1447.0, 0.11523103823165447, 0.03595098798090171, 0.05198900357717223], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 230.375, 159, 923, 164.5, 498.1000000000004, 923.0, 923.0, 0.07328356158109284, 5.58601532800119, 0.16364455468785782], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 94.1875, 79, 244, 83.5, 141.8000000000001, 244.0, 244.0, 0.08429837409510964, 0.06544649160704313, 0.029965437666621006], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=490fc35a-465f-4898-8af4-64455be2ad20", 1, 0, 0.0, 416.0, 416, 416, 416.0, 416.0, 416.0, 416.0, 2.403846153846154, 0.4342886117788462, 1.6573392427884617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 341.6470588235294, 161, 1257, 167.0, 1053.7999999999997, 1257.0, 1257.0, 0.12193022722056461, 17.328023746360024, 0.270553704437543], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a84dd7eb-b624-4f96-b081-458bd69147e6", 1, 0, 0.0, 404.0, 404, 404, 404.0, 404.0, 404.0, 404.0, 2.4752475247524752, 0.44718827351485146, 1.7065671410891088], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 82.89999999999999, 78, 101, 80.0, 99.4, 101.0, 101.0, 0.05625784093658054, 0.041808805617908, 0.02823879906386953], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 79.89999999999999, 77, 81, 80.0, 81.0, 81.0, 81.0, 0.056257207954769205, 0.015053198222272229, 0.032084188911704316], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 80.30000000000001, 79, 82, 80.0, 81.9, 82.0, 82.0, 0.056257207954769205, 0.015163075581558888, 0.03307308514528424], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 79.80000000000001, 78, 81, 80.0, 81.0, 81.0, 81.0, 0.056257207954769205, 0.015163075581558888, 0.03312802382492757], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 91.0, 81, 104, 88.0, 104.0, 104.0, 104.0, 0.03706540809014307, 0.010931399651585164, 0.022912503243223206], "isController": false}, {"data": ["https://demoqa.com/books", 59, 0, 0.0, 916.576271186441, 622, 1506, 851.0, 1244.0, 1372.0, 1506.0, 0.25868910392725136, 309.4821031807798, 0.5108099298250999], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, 34.78260869565217, 850.6086956521739, 86, 1447, 770.0, 1394.2000000000003, 1445.8, 1447.0, 0.11355781574010072, 0.03542895847733781, 0.05123409264836576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 109.375, 79, 312, 79.5, 312.0, 312.0, 312.0, 0.04741949059612227, 0.012781034574736082, 0.027923782060021222], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 79.625, 78, 81, 80.0, 81.0, 81.0, 81.0, 0.04741949059612227, 0.012781034574736082, 0.027877473963735945], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/342441cd-dd03-44d6-b60e-2e60a2bee829", 3, 0, 0.0, 267.6666666666667, 169, 460, 174.0, 460.0, 460.0, 460.0, 0.0687836753410524, 0.031122821850280865, 0.04410932305399518], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 167.4375, 78, 1167, 79.0, 518.8000000000006, 1167.0, 1167.0, 0.08119313309076885, 4.586624073573665, 0.04729658582875353], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 123.0, 77, 469, 79.0, 304.50000000000017, 469.0, 469.0, 0.08119313309076885, 1.5126086433896102, 0.04737587599778748], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 80.625, 79, 86, 80.0, 86.0, 86.0, 86.0, 0.04741977167379939, 0.012688493592403354, 0.027044088532713718], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 100.5, 79, 237, 81.0, 234.9, 237.0, 237.0, 0.08119230905852444, 0.06033920624368857, 0.040754733257892146], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 80.875, 80, 82, 81.0, 82.0, 82.0, 82.0, 0.047418928450764335, 0.03524004350686685, 0.023802079320012565], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 147.75, 77, 239, 83.5, 237.6, 239.0, 239.0, 0.08119395713973987, 0.029347571666353732, 0.04587973969724803], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 83.125, 81, 90, 82.5, 90.0, 90.0, 90.0, 0.044542685812597786, 0.035059965590775205, 0.015833532847446867], "isController": false}, {"data": ["deleteAccount", 14, 3, 21.428571428571427, 546.5714285714286, 79, 2137, 405.0, 1782.0, 2137.0, 2137.0, 0.0820965103119081, 0.016360890761796976, 0.0558629644316869], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1307.5217391304345, 751, 2295, 1192.0, 2097.0, 2257.3999999999996, 2295.0, 0.11404996380153323, 0.05902976642071544, 0.052458528271994286], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 191.87499999999997, 160, 393, 163.0, 393.0, 393.0, 393.0, 0.047396172759049705, 0.07345481071153505, 0.10659510338290183], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4aecfcf8-31c1-4e05-ba9d-4096b2b98693", 3, 0, 0.0, 339.3333333333333, 173, 545, 300.0, 545.0, 545.0, 545.0, 0.03494874184529357, 0.029135328081314072, 0.022411790831780055], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a3c18df2-f58d-41d5-ab21-144210fcb5fe", 3, 0, 0.0, 822.6666666666666, 321, 1694, 453.0, 1694.0, 1694.0, 1694.0, 0.04515080368430558, 0.028086974557522123, 0.02895412866474023], "isController": false}, {"data": ["addBook", 61, 22, 36.0655737704918, 798.7213114754097, 403, 1933, 649.0, 1478.4, 1605.2, 1933.0, 0.2902384713472775, 80.87001732509563, 1.054600331811564], "isController": true}, {"data": ["https://demoqa.com/books-0", 59, 0, 0.0, 145.91525423728808, 78, 327, 81.0, 321.0, 321.0, 327.0, 0.2597779998855215, 0.19305767374304875, 0.1255762792415363], "isController": false}, {"data": ["https://demoqa.com/books-3", 59, 0, 0.0, 503.3559322033898, 382, 725, 466.0, 631.0, 695.0, 725.0, 0.2593634605240021, 76.26146907145683, 0.13044158415025497], "isController": false}, {"data": ["https://demoqa.com/books-1", 59, 0, 0.0, 123.84745762711866, 78, 318, 83.0, 240.0, 246.0, 318.0, 0.2601021010959556, 0.46025879607995274, 0.12649496713455655], "isController": false}, {"data": ["https://demoqa.com/books-2", 59, 0, 0.0, 769.2033898305086, 541, 1178, 765.0, 943.0, 1042.0, 1178.0, 0.25910035088335653, 233.13895117467973, 0.13005623081449733], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 93.29411764705884, 80, 233, 85.0, 120.9999999999999, 233.0, 233.0, 0.12359052278791141, 0.09233081048120334, 0.04393256864726538], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 181, 22, 12.154696132596685, 136.18784530386728, 79, 1023, 86.0, 246.60000000000008, 327.8, 976.2600000000004, 0.7457090828190276, 1.653013143637577, 0.35551377965326586], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 98.2, 80, 239, 83.0, 223.60000000000005, 239.0, 239.0, 0.06110639233970266, 0.04732164953650801, 0.02172141290200368], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8a964aa2-dd4f-4ca1-b632-268ae257a4d7", 1, 0, 0.0, 437.0, 437, 437, 437.0, 437.0, 437.0, 437.0, 2.288329519450801, 0.41341890732265446, 1.577695938215103], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e552a16d-1e6f-4061-8560-a142daf74192", 1, 0, 0.0, 655.0, 655, 655, 655.0, 655.0, 655.0, 655.0, 1.5267175572519083, 0.2758229961832061, 1.0526001908396947], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1778ac3b-6569-4eb3-8711-54bc266b2dd3", 1, 0, 0.0, 222.0, 222, 222, 222.0, 222.0, 222.0, 222.0, 4.504504504504505, 1.4384501689189189, 2.68774634009009], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 24, 0, 0.0, 83.91666666666666, 81, 93, 83.0, 89.5, 92.25, 93.0, 0.12085809245644072, 0.09807917463994359, 0.04296127505287541], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a3c18df2-f58d-41d5-ab21-144210fcb5fe", 1, 0, 0.0, 1663.0, 1663, 1663, 1663.0, 1663.0, 1663.0, 1663.0, 0.6013229104028863, 0.10863743986770896, 0.41458395971136497], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 164.20000000000002, 159, 182, 161.5, 180.5, 182.0, 182.0, 0.05623221656151242, 0.08714895281554708, 0.1264675729894171], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eaa97b96-58f6-463d-a31a-4e27aa4e7f63", 1, 0, 0.0, 161.0, 161, 161, 161.0, 161.0, 161.0, 161.0, 6.211180124223602, 1.9834530279503104, 3.7060850155279503], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/85399594-a296-4182-869d-ed0a7adf9c1d", 3, 0, 0.0, 324.0, 217, 510, 245.0, 510.0, 510.0, 510.0, 0.0469579100599496, 0.030189411578255356, 0.030112982688183826], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 307.9375, 159, 1247, 167.0, 708.7000000000005, 1247.0, 1247.0, 0.08115936147872357, 6.186345579414435, 0.18123146966922488], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=323fd3e5-a05a-4c5d-922b-51368b954764", 1, 0, 0.0, 440.0, 440, 440, 440.0, 440.0, 440.0, 440.0, 2.2727272727272725, 0.41060014204545453, 1.5669389204545454], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 84.08333333333333, 81, 90, 82.5, 89.7, 90.0, 90.0, 0.0582730773526541, 0.048314299484768876, 0.020714257965201262], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 94.76470588235294, 81, 252, 85.0, 123.99999999999989, 252.0, 252.0, 0.08629441624365482, 0.0669961532360406, 0.030674968274111675], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c83b867f-7f89-4118-9c39-979e6a7ff63d", 3, 0, 0.0, 501.6666666666667, 350, 800, 355.0, 800.0, 800.0, 800.0, 0.03821558686402894, 0.03185876235637309, 0.024506740274133146], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7eff1870-b532-4548-8f0b-81f89a2c1ab1", 3, 0, 0.0, 471.3333333333333, 175, 838, 401.0, 838.0, 838.0, 838.0, 0.07843342309602866, 0.03548908141389317, 0.05029747509738816], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 99.94117647058823, 79, 243, 81.0, 238.2, 243.0, 243.0, 0.12200198073804022, 0.09066748763832871, 0.06123927548764909], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 107.70588235294117, 77, 239, 80.0, 238.2, 239.0, 239.0, 0.12200198073804022, 0.054202856102252006, 0.06837381227483458], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 221.70588235294122, 78, 1019, 82.0, 940.5999999999999, 1019.0, 1019.0, 0.12200198073804022, 12.944026096761922, 0.07049034479912732], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 195.47058823529412, 79, 710, 87.0, 517.1999999999998, 710.0, 710.0, 0.12200373187885748, 4.249385495909286, 0.07061050084326109], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 19.047619047619047, 0.5813953488372093], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 7.142857142857143, 0.2180232558139535], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 7.142857142857143, 0.2180232558139535], "isController": false}, {"data": ["401/Unauthorized", 28, 66.66666666666667, 2.0348837209302326], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1376, 42, "401/Unauthorized", 28, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 181, 22, "401/Unauthorized", 22, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
