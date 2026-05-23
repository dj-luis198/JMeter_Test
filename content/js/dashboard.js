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

    var data = {"OkPercent": 98.45201238390094, "KoPercent": 1.5479876160990713};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8104249667994687, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.36607142857142855, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=07f985e4-e124-49c8-b424-95d7581b682a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=327e1b4d-247f-4e48-bf9e-7c50a4085d6a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e234d978-be84-4656-a1e3-c0dcf967f18b"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cb52424b-1228-4e4f-a496-d2901c7ff8cf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3bd1c734-e9ad-40a1-8b06-5e0428301000"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a4a99b59-69f3-4bcc-b2e1-b7424b01343c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=48a30541-ead0-46dc-b149-1d736a33368f"], "isController": false}, {"data": [0.6521739130434783, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.021739130434782608, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b383fced-09c3-4f8c-8ada-266d945843af"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/327e1b4d-247f-4e48-bf9e-7c50a4085d6a"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=715fc6e3-7f0c-497c-a062-939463b214db"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5e9f0c55-b2fb-4f5f-93ea-074ee9ac1e05"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d4f9056b-8b69-4964-b38a-7b1055792129"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8b0173c7-0cb2-4c5f-962b-7bf6eab8b5e2"], "isController": false}, {"data": [0.391304347826087, 500, 1500, "register"], "isController": true}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3bd1c734-e9ad-40a1-8b06-5e0428301000"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8b0173c7-0cb2-4c5f-962b-7bf6eab8b5e2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cb52424b-1228-4e4f-a496-d2901c7ff8cf"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.49107142857142855, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/07f985e4-e124-49c8-b424-95d7581b682a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5ce685d2-e270-4985-a4f9-41d1ca5ba5eb"], "isController": false}, {"data": [0.391304347826087, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.34782608695652173, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/48a30541-ead0-46dc-b149-1d736a33368f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e234d978-be84-4656-a1e3-c0dcf967f18b"], "isController": false}, {"data": [0.41964285714285715, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.49107142857142855, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/9189a846-6152-4fe2-85df-741b13a88a10"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/57369ac8-2929-4db0-be93-c7249a42c098"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ea818301-5bd0-4694-a455-8fd735213577"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=57369ac8-2929-4db0-be93-c7249a42c098"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5e9f0c55-b2fb-4f5f-93ea-074ee9ac1e05"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b383fced-09c3-4f8c-8ada-266d945843af"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d4f9056b-8b69-4964-b38a-7b1055792129"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/715fc6e3-7f0c-497c-a062-939463b214db"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/80dcba8c-b320-4317-9c56-1162e0bf8083"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1292, 20, 1.5479876160990713, 324.4845201238394, 77, 4566, 94.0, 897.4000000000001, 1094.0, 1905.889999999992, 5.161888324224119, 758.5392371994059, 3.7651826487438873], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1443.5357142857144, 953, 5632, 1318.0, 1662.3000000000002, 2080.899999999997, 5632.0, 0.25940817876929345, 312.15530161122587, 1.2755079883822193], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=07f985e4-e124-49c8-b424-95d7581b682a", 1, 0, 0.0, 436.0, 436, 436, 436.0, 436.0, 436.0, 436.0, 2.293577981651376, 0.4143671158256881, 1.581314506880734], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=327e1b4d-247f-4e48-bf9e-7c50a4085d6a", 1, 0, 0.0, 737.0, 737, 737, 737.0, 737.0, 737.0, 737.0, 1.3568521031207597, 0.2451344131614654, 0.9354859226594301], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e234d978-be84-4656-a1e3-c0dcf967f18b", 1, 0, 0.0, 422.0, 422, 422, 422.0, 422.0, 422.0, 422.0, 2.3696682464454977, 0.4281138921800948, 1.6337751777251186], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 510.5, 82, 976, 467.5, 970.5, 976.0, 976.0, 0.09324381926683717, 0.018367783594416025, 0.06273924948715899], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 510.5, 82, 976, 467.5, 970.5, 976.0, 976.0, 0.09470465676326542, 0.018655549016424494, 0.06372217627918933], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cb52424b-1228-4e4f-a496-d2901c7ff8cf", 1, 0, 0.0, 174.0, 174, 174, 174.0, 174.0, 174.0, 174.0, 5.747126436781609, 1.038299209770115, 3.9623742816091956], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 105.00000000000001, 77, 239, 80.0, 237.0, 239.0, 239.0, 0.11689933736533505, 0.040520617351553226, 0.06615243135240229], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 89.15789473684211, 79, 235, 81.0, 85.0, 235.0, 235.0, 0.11689717970172762, 0.08687378296192844, 0.05867690465496875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 348.2105263157895, 78, 4484, 80.0, 614.0, 4484.0, 4484.0, 0.11689789891408005, 1.8388947957363029, 0.06830860468514474], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 121.00000000000001, 77, 691, 80.0, 236.0, 691.0, 691.0, 0.11689933736533505, 5.56596703630955, 0.0681952857265909], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3bd1c734-e9ad-40a1-8b06-5e0428301000", 1, 0, 0.0, 279.0, 279, 279, 279.0, 279.0, 279.0, 279.0, 3.5842293906810037, 0.6475414426523297, 2.4711581541218637], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 335.7142857142857, 79, 1897, 226.0, 1133.0, 1897.0, 1897.0, 0.09379040524154379, 0.17697574303773722, 0.06062094691463063], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 80.22222222222221, 78, 83, 80.5, 82.1, 83.0, 83.0, 0.08941078294042262, 0.06644688068131016, 0.04488002190564182], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 97.0, 78, 242, 79.5, 235.70000000000002, 242.0, 242.0, 0.08941167120348109, 0.03884595610880407, 0.05015824003059866], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 558.6666666666667, 477, 626, 545.5, 626.0, 626.0, 626.0, 0.07118704395799964, 20.931354555970813, 0.04059886100729667], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 834.5, 694, 1005, 848.5, 1005.0, 1005.0, 1005.0, 0.070876745339854, 63.775020044829546, 0.04035267825501453], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 172.66666666666666, 79, 314, 160.5, 314.0, 314.0, 314.0, 0.07144388083160677, 0.12642217975280418, 0.03955925823390727], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a4a99b59-69f3-4bcc-b2e1-b7424b01343c", 1, 0, 0.0, 364.0, 364, 364, 364.0, 364.0, 364.0, 364.0, 2.7472527472527473, 0.8772965315934066, 1.6392299107142858], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 10, 0, 0.0, 95.7, 79, 234, 81.0, 218.80000000000007, 234.0, 234.0, 0.06563833278634722, 0.04878005004922875, 0.03294736626189695], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 10, 0, 0.0, 158.6, 78, 243, 158.5, 242.4, 243.0, 243.0, 0.0655686109945447, 0.0372409220258078, 0.03629325069502728], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 10, 0, 0.0, 281.6, 79, 867, 156.5, 865.3, 867.0, 867.0, 0.06530143140737645, 11.76574917475316, 0.03726773097116289], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 10, 0, 0.0, 204.20000000000002, 78, 466, 158.5, 465.7, 466.0, 466.0, 0.06547287786034635, 3.8643575883065435, 0.037429514354928466], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 106.83333333333334, 78, 237, 79.5, 237.0, 237.0, 237.0, 0.07157769161944527, 0.05319396808827915, 0.04019255144646585], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 173.83333333333331, 78, 952, 80.0, 901.6000000000001, 952.0, 952.0, 0.08941033881551169, 8.96048567509773, 0.05170975541305093], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 649.7857142857143, 78, 932, 855.5, 930.0, 932.0, 932.0, 0.11451287042868712, 73.60802001623628, 0.060291793107961095], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 157.0, 78, 617, 80.0, 481.1000000000002, 617.0, 617.0, 0.08941078294042262, 2.942503433622428, 0.051797327486861576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 421.42857142857144, 78, 629, 466.0, 628.0, 629.0, 629.0, 0.11451006052674628, 24.058646787583836, 0.060402139906756094], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 529.4285714285714, 84, 2040, 426.5, 1489.5, 2040.0, 2040.0, 0.09492555124623688, 0.018699062271161616, 0.06447998172683138], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 10, 0, 0.0, 426.1, 162, 947, 317.5, 945.3, 947.0, 947.0, 0.06526648305029435, 15.697201046874389, 0.14344604175096923], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=48a30541-ead0-46dc-b149-1d736a33368f", 1, 0, 0.0, 722.0, 722, 722, 722.0, 722.0, 722.0, 722.0, 1.3850415512465375, 0.25022723337950137, 0.9549212257617729], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 730.8260869565217, 114, 1772, 650.0, 1479.4000000000003, 1731.7999999999995, 1772.0, 0.10685001509837169, 0.06563345653991777, 0.048312067373580174], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 81.35714285714286, 79, 89, 81.0, 86.0, 89.0, 89.0, 0.11450912392340976, 0.08509906572823714, 0.05747821259436779], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 169.07142857142856, 79, 238, 234.5, 237.5, 238.0, 238.0, 0.11451099714540443, 0.15349074505762356, 0.05843767125528591], "isController": false}, {"data": ["login", 23, 0, 0.0, 2845.347826086956, 1401, 4429, 2704.0, 4025.2000000000003, 4356.799999999999, 4429.0, 0.1047482853161121, 32.83424665488628, 0.20335452825698852], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 102.22222222222223, 80, 248, 83.0, 241.70000000000002, 248.0, 248.0, 0.09326618168252192, 0.07550553185040104, 0.03315321301995896], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b383fced-09c3-4f8c-8ada-266d945843af", 3, 0, 0.0, 953.6666666666666, 283, 2275, 303.0, 2275.0, 2275.0, 2275.0, 0.050819033421984315, 0.03326727741263361, 0.03258902859417614], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/327e1b4d-247f-4e48-bf9e-7c50a4085d6a", 3, 0, 0.0, 369.6666666666667, 308, 432, 369.0, 432.0, 432.0, 432.0, 0.020223264843876397, 0.023903214403683332, 0.012968695228657715], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=715fc6e3-7f0c-497c-a062-939463b214db", 1, 0, 0.0, 2040.0, 2040, 2040, 2040.0, 2040.0, 2040.0, 2040.0, 0.49019607843137253, 0.0885608149509804, 0.3379672181372549], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 743.6428571428571, 161, 1015, 936.5, 1013.0, 1015.0, 1015.0, 0.11443237455350941, 97.83703016314787, 0.23644780964174492], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5e9f0c55-b2fb-4f5f-93ea-074ee9ac1e05", 3, 0, 0.0, 306.6666666666667, 170, 417, 333.0, 417.0, 417.0, 417.0, 0.021702958836721405, 0.025652162609419087, 0.01391758753526731], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d4f9056b-8b69-4964-b38a-7b1055792129", 1, 0, 0.0, 362.0, 362, 362, 362.0, 362.0, 362.0, 362.0, 2.7624309392265194, 0.4990719958563536, 1.9045666436464088], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 468.36842105263156, 160, 4566, 165.0, 926.0, 4566.0, 4566.0, 0.11683751591142486, 7.5282970663022155, 0.26119694462209214], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, 40.0, 599.2, 79, 1086, 778.0, 1086.0, 1086.0, 1086.0, 0.11243914231422243, 80.72181712897894, 0.18192301854121457], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8b0173c7-0cb2-4c5f-962b-7bf6eab8b5e2", 1, 0, 0.0, 196.0, 196, 196, 196.0, 196.0, 196.0, 196.0, 5.1020408163265305, 0.9217554209183673, 3.5176179846938775], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 956.5652173913043, 155, 1435, 1061.0, 1347.4, 1419.3999999999999, 1435.0, 0.10717314520563265, 0.03376463728879901, 0.04835350887207254], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 289.38888888888886, 160, 1032, 162.0, 983.4000000000001, 1032.0, 1032.0, 0.08937482311232926, 12.003496479625023, 0.19846525119290562], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 96.78571428571429, 79, 252, 82.5, 175.5, 252.0, 252.0, 0.11379245881119392, 0.08834473120595622, 0.04044966309304159], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3bd1c734-e9ad-40a1-8b06-5e0428301000", 3, 0, 0.0, 309.6666666666667, 207, 478, 244.0, 478.0, 478.0, 478.0, 0.06407244457733544, 0.028991112618000085, 0.04108812363846055], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 287.375, 160, 932, 224.5, 609.3000000000003, 932.0, 932.0, 0.07539132811248386, 5.746679137158029, 0.16835126527852384], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 96.80000000000001, 79, 237, 80.0, 222.40000000000006, 237.0, 237.0, 0.057150368334123916, 0.042472099904558885, 0.02868680598021454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 80.6, 78, 89, 79.5, 88.4, 89.0, 89.0, 0.05714971510867018, 0.023875632933094828, 0.03211322858743049], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8b0173c7-0cb2-4c5f-962b-7bf6eab8b5e2", 3, 0, 0.0, 287.3333333333333, 220, 396, 246.0, 396.0, 396.0, 396.0, 0.0591879414433966, 0.026781002150495205, 0.037955808803219825], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cb52424b-1228-4e4f-a496-d2901c7ff8cf", 3, 0, 0.0, 392.3333333333333, 293, 459, 425.0, 459.0, 459.0, 459.0, 0.0649125843863597, 0.030131948351220357, 0.04162688516963822], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 180.9, 78, 928, 80.5, 858.5000000000002, 928.0, 928.0, 0.057149061898148945, 5.156145747609741, 0.03310627296677925], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 151.2, 79, 623, 80.5, 584.1000000000001, 623.0, 623.0, 0.057148735298487845, 1.694225602490542, 0.03316189308043113], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 84.0, 84, 84, 84.0, 84.0, 84.0, 84.0, 0.03989547385849075, 0.011766047954359577, 0.024661948195727194], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 971.2321428571428, 620, 3557, 894.5, 1284.8000000000002, 1342.3, 3557.0, 0.2610917364465415, 312.3564869640626, 0.51555419052237], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/07f985e4-e124-49c8-b424-95d7581b682a", 3, 0, 0.0, 332.3333333333333, 227, 462, 308.0, 462.0, 462.0, 462.0, 0.031715155615696884, 0.03180807111066475, 0.020338169454076453], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5ce685d2-e270-4985-a4f9-41d1ca5ba5eb", 1, 0, 0.0, 193.0, 193, 193, 193.0, 193.0, 193.0, 193.0, 5.181347150259067, 1.6545903497409327, 3.091604598445596], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 956.5652173913043, 155, 1435, 1061.0, 1347.4, 1419.3999999999999, 1435.0, 0.1051895011730916, 0.033139695087650294, 0.047458544474578444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 11, 0, 0.0, 129.63636363636363, 77, 313, 80.0, 298.00000000000006, 313.0, 313.0, 0.05029882072128509, 0.013557104022533871, 0.02961932509270987], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 11, 0, 0.0, 108.0909090909091, 78, 239, 80.0, 238.0, 239.0, 239.0, 0.05026181838120391, 0.013547130735558865, 0.029548451821762453], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 91.21428571428571, 77, 238, 80.0, 160.5, 238.0, 238.0, 0.11591131128810585, 0.03124172062062228, 0.0681431732377341], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 102.21428571428572, 78, 237, 80.0, 235.5, 237.0, 237.0, 0.1157608381084679, 0.031201163396422992, 0.06816775915957632], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 11, 0, 0.0, 93.45454545454545, 78, 232, 79.0, 202.2000000000001, 232.0, 232.0, 0.050298360730698, 0.013458741054893803, 0.028685783854226207], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 82.64285714285714, 79, 90, 82.0, 89.5, 90.0, 90.0, 0.11590651311813358, 0.08613755515908168, 0.058179636467500635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 11, 0, 0.0, 81.27272727272727, 79, 84, 81.0, 83.8, 84.0, 84.0, 0.05029675082989639, 0.03737873767729605, 0.025246611256412838], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 91.21428571428572, 78, 235, 80.0, 159.5, 235.0, 235.0, 0.11590843233845262, 0.031014560996812518, 0.06610402781802377], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 11, 0, 0.0, 86.63636363636364, 82, 93, 85.0, 92.8, 93.0, 93.0, 0.05256442726277913, 0.04137395349003904, 0.01868501125356602], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 568.9285714285714, 80, 2275, 467.0, 1526.0, 2275.0, 2275.0, 0.09614856326575462, 0.0185643989341245, 0.06543145809296193], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1513.304347826087, 975, 3772, 1292.0, 2495.8, 3538.5999999999967, 3772.0, 0.10534415477346427, 0.054523830107359436, 0.04845419618974772], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 11, 0, 0.0, 227.09090909090907, 161, 394, 168.0, 379.20000000000005, 394.0, 394.0, 0.05024161650117382, 0.07786469276109655, 0.11299457304902667], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/48a30541-ead0-46dc-b149-1d736a33368f", 3, 0, 0.0, 425.3333333333333, 225, 530, 521.0, 530.0, 530.0, 530.0, 0.026678523788350377, 0.02675668352601156, 0.017108298132503336], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e234d978-be84-4656-a1e3-c0dcf967f18b", 3, 0, 0.0, 549.3333333333334, 208, 968, 472.0, 968.0, 968.0, 968.0, 0.04319716626589296, 0.02777161568201126, 0.0277013077942087], "isController": false}, {"data": ["addBook", 56, 6, 10.714285714285714, 909.9642857142857, 407, 3572, 700.5, 1458.4, 1556.6499999999996, 3572.0, 0.27710426047800485, 101.74859727565688, 1.003889240251868], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 148.9821428571428, 79, 365, 81.0, 323.0, 327.0, 365.0, 0.2618498758551035, 0.1945974175055994, 0.12657782084792601], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 541.8214285714287, 386, 3151, 466.5, 636.6, 719.0, 3151.0, 0.2618070295187426, 76.9799594900373, 0.13167052754116448], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 127.07142857142854, 77, 571, 82.0, 238.9, 325.29999999999995, 571.0, 0.26199688410848543, 0.4636116738325934, 0.127416453404322], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 819.1428571428573, 538, 3476, 811.5, 1011.3, 1047.2499999999998, 3476.0, 0.2615270376925843, 235.3224882312833, 0.13127431384178548], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 95.375, 80, 243, 84.0, 142.2000000000001, 243.0, 243.0, 0.07478697397880725, 0.055871128021276896, 0.026584432156529135], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9189a846-6152-4fe2-85df-741b13a88a10", 1, 0, 0.0, 1305.0, 1305, 1305, 1305.0, 1305.0, 1305.0, 1305.0, 0.7662835249042146, 0.24470186781609196, 0.45722581417624525], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 6, 3.5714285714285716, 149.8988095238095, 79, 2475, 87.5, 247.59999999999997, 312.64999999999964, 1072.2300000000046, 0.7033232021300646, 1.591794503769896, 0.3361545738510294], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 98.89999999999999, 80, 239, 83.0, 224.40000000000006, 239.0, 239.0, 0.05900227158745612, 0.04569218883677021, 0.02097346372835354], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/57369ac8-2929-4db0-be93-c7249a42c098", 3, 0, 0.0, 325.0, 183, 591, 201.0, 591.0, 591.0, 591.0, 0.03291819827728096, 0.027442547457069182, 0.021109651890053215], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ea818301-5bd0-4694-a455-8fd735213577", 1, 0, 0.0, 178.0, 178, 178, 178.0, 178.0, 178.0, 178.0, 5.617977528089887, 1.794022120786517, 3.352133075842697], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 91.78947368421053, 81, 128, 86.0, 115.0, 128.0, 128.0, 0.12214800480877408, 0.09912596874618287, 0.04341979858436891], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=57369ac8-2929-4db0-be93-c7249a42c098", 1, 0, 0.0, 939.0, 939, 939, 939.0, 939.0, 939.0, 939.0, 1.0649627263045793, 0.19240049254526093, 0.734241879659212], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5e9f0c55-b2fb-4f5f-93ea-074ee9ac1e05", 1, 0, 0.0, 431.0, 431, 431, 431.0, 431.0, 431.0, 431.0, 2.320185614849188, 0.41917415893271465, 1.599659222737819], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 279.4, 160, 1008, 165.0, 954.4000000000002, 1008.0, 1008.0, 0.0571222931173349, 6.913487706925507, 0.12700784860307432], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 208.14285714285714, 159, 325, 164.5, 321.5, 325.0, 325.0, 0.11568144634859778, 0.1792836478078366, 0.2601702841218952], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b383fced-09c3-4f8c-8ada-266d945843af", 1, 0, 0.0, 506.0, 506, 506, 506.0, 506.0, 506.0, 506.0, 1.976284584980237, 0.35704360177865613, 1.3625555830039526], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d4f9056b-8b69-4964-b38a-7b1055792129", 3, 0, 0.0, 393.66666666666663, 179, 777, 225.0, 777.0, 777.0, 777.0, 0.021818499178169866, 0.030078562506363732, 0.013991680788084191], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 10, 0, 0.0, 86.8, 79, 113, 83.0, 111.10000000000001, 113.0, 113.0, 0.07188917564682286, 0.05960342785561778, 0.02555435540570656], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 97.5, 81, 259, 85.0, 175.5, 259.0, 259.0, 0.11674254932372709, 0.09063508468004203, 0.041498328079918614], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/715fc6e3-7f0c-497c-a062-939463b214db", 3, 0, 0.0, 1428.6666666666667, 538, 1897, 1851.0, 1897.0, 1897.0, 1897.0, 0.019622078763024155, 0.027050619648895602, 0.012583168998423691], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/80dcba8c-b320-4317-9c56-1162e0bf8083", 1, 0, 0.0, 240.0, 240, 240, 240.0, 240.0, 240.0, 240.0, 4.166666666666667, 1.33056640625, 2.4861653645833335], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 97.81250000000001, 80, 234, 81.5, 196.90000000000003, 234.0, 234.0, 0.07542011360154612, 0.05604951801833651, 0.037857361710151076], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 110.125, 79, 239, 80.0, 236.9, 239.0, 239.0, 0.0754204691153179, 0.027260743292292028, 0.04261735248227619], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 178.56250000000003, 78, 852, 88.0, 422.20000000000044, 852.0, 852.0, 0.07542082463244133, 4.2605446635641995, 0.04393410341137818], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 153.125, 78, 623, 80.5, 354.2000000000003, 623.0, 623.0, 0.0754204691153179, 1.4050652946819142, 0.04400754911758051], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 30.0, 0.46439628482972134], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 10.0, 0.15479876160990713], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 10.0, 0.15479876160990713], "isController": false}, {"data": ["401/Unauthorized", 10, 50.0, 0.7739938080495357], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1292, 20, "401/Unauthorized", 10, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
