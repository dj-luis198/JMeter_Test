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

    var data = {"OkPercent": 99.13357400722022, "KoPercent": 0.8664259927797834};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8326059850374065, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7eda6705-9d00-401b-8cdb-d0678d271899"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6538461538461539, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=44c647db-433f-4e26-8bc4-c3de7984a6e1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b5e62ce0-1115-4634-acdf-564aaff7cf23"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5c3df0d7-22d5-45f9-9ed0-19ca4908e4ed"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4130ef57-fbfb-4d83-bcad-e039354497a3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/887bfa2f-b923-431f-94f6-dd421c866ab1"], "isController": false}, {"data": [0.8095238095238095, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8ab7732b-008c-409e-af60-e665b5d65be8"], "isController": false}, {"data": [0.023809523809523808, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1d104510-13a6-4e98-8cff-c176dcf213e3"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8d9c4ff9-4f3d-4d52-bd36-e84436324393"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d3e202c4-38f5-4c77-b42b-6be78fc4fc1e"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8c89609f-dcd4-4a2b-81e8-1f954b210a96"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b3552783-b53d-4f2e-9e68-19d3c75e7382"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/50b2fc4b-26e7-453e-b717-a3f5735bd446"], "isController": false}, {"data": [0.3409090909090909, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.48333333333333334, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3409090909090909, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7eda6705-9d00-401b-8cdb-d0678d271899"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9534dc5f-61c4-4d12-9e34-4e693c91c546"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.30952380952380953, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4359ddb7-8e93-4ed0-bf3d-42a42f863d83"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=14212fc2-b4f1-4483-a45e-f87b777a7f05"], "isController": false}, {"data": [0.453125, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9833333333333333, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9707446808510638, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/44c647db-433f-4e26-8bc4-c3de7984a6e1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5c3df0d7-22d5-45f9-9ed0-19ca4908e4ed"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1d104510-13a6-4e98-8cff-c176dcf213e3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/14212fc2-b4f1-4483-a45e-f87b777a7f05"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=50b2fc4b-26e7-453e-b717-a3f5735bd446"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d3e202c4-38f5-4c77-b42b-6be78fc4fc1e"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9534dc5f-61c4-4d12-9e34-4e693c91c546"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4130ef57-fbfb-4d83-bcad-e039354497a3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8d9c4ff9-4f3d-4d52-bd36-e84436324393"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8ab7732b-008c-409e-af60-e665b5d65be8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b3552783-b53d-4f2e-9e68-19d3c75e7382"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/336032c8-8e74-4692-95ac-f176d81aec82"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1385, 12, 0.8664259927797834, 298.0288808664258, 77, 4640, 92.0, 779.4000000000001, 1000.4000000000001, 1592.540000000001, 5.439008490351159, 764.633204717309, 3.9781570179899624], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 60, 0, 0.0, 1379.0666666666668, 955, 4962, 1262.0, 1665.5, 1819.6999999999998, 4962.0, 0.26864388566516223, 323.268623387577, 1.320919887035246], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/7eda6705-9d00-401b-8cdb-d0678d271899", 3, 0, 0.0, 650.0, 193, 1348, 409.0, 1348.0, 1348.0, 1348.0, 0.02790827480347923, 0.027990037327317547, 0.01789690799572073], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 522.1538461538461, 82, 890, 567.0, 814.8, 890.0, 890.0, 0.07973894695519898, 0.015106792684871681, 0.05390405526215712], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 522.1538461538461, 82, 890, 567.0, 814.8, 890.0, 890.0, 0.08126168136669645, 0.015395279477674915, 0.05493343379048238], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 99.37500000000001, 78, 243, 80.0, 236.0, 243.0, 243.0, 0.10139031469018922, 0.03664754904756473, 0.05729196370860423], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 90.6875, 78, 234, 80.5, 131.1000000000001, 234.0, 234.0, 0.10139031469018922, 0.07534963816331444, 0.05089318530347388], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 181.5, 77, 617, 159.0, 352.40000000000026, 617.0, 617.0, 0.10139159970596437, 1.8889012437897645, 0.059161602367493855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 137.62499999999997, 78, 855, 79.5, 420.3000000000004, 855.0, 855.0, 0.10139095719400526, 5.727605123807864, 0.05906221285764076], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 188.69230769230768, 80, 348, 180.0, 293.19999999999993, 348.0, 348.0, 0.07957689576650914, 0.1736978560913053, 0.05143924189233858], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=44c647db-433f-4e26-8bc4-c3de7984a6e1", 1, 0, 0.0, 386.0, 386, 386, 386.0, 386.0, 386.0, 386.0, 2.5906735751295336, 0.4680416126943005, 1.7861479922279793], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 92.14285714285714, 78, 237, 80.5, 162.0, 237.0, 237.0, 0.09679404301803826, 0.07193385423508507, 0.04858607237428874], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 101.99999999999999, 78, 240, 79.5, 237.0, 240.0, 240.0, 0.09679671997400317, 0.036285265983558385, 0.054623707072383204], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 519.0, 399, 739, 469.0, 739.0, 739.0, 739.0, 0.07421012597168883, 21.82024104376542, 0.04232296246822879], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 829.0, 694, 932, 845.0, 932.0, 932.0, 932.0, 0.0738061849582995, 66.41093496291239, 0.04202051350653185], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b5e62ce0-1115-4634-acdf-564aaff7cf23", 1, 0, 0.0, 311.0, 311, 311, 311.0, 311.0, 311.0, 311.0, 3.215434083601286, 1.02680365755627, 1.9185842041800643], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 170.25, 79, 281, 160.5, 281.0, 281.0, 281.0, 0.07437294312329175, 0.13160524701113735, 0.04118111206143205], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 19, 0, 0.0, 97.73684210526315, 79, 237, 80.0, 235.0, 237.0, 237.0, 0.08992337581818441, 0.06682782128675618, 0.04513731950248709], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 19, 0, 0.0, 120.42105263157895, 77, 239, 80.0, 236.0, 239.0, 239.0, 0.08992337581818441, 0.024061528295100124, 0.05128442527130829], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 19, 0, 0.0, 121.10526315789474, 77, 238, 80.0, 238.0, 238.0, 238.0, 0.08992507821115356, 0.024237618736599978, 0.052866110432728944], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 19, 0, 0.0, 112.84210526315792, 78, 237, 80.0, 236.0, 237.0, 237.0, 0.08992507821115356, 0.024237618736599978, 0.05295392789191952], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 82.75, 79, 90, 81.0, 90.0, 90.0, 90.0, 0.07463661299050249, 0.0554672485212621, 0.041910207489784114], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 470.35, 77, 930, 463.5, 927.2, 929.9, 930.0, 0.0890242056815248, 40.064065782767585, 0.04851123708036215], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 145.5, 78, 847, 80.0, 541.5, 847.0, 847.0, 0.09679605072113058, 6.2454586339484495, 0.05631131856963094], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5c3df0d7-22d5-45f9-9ed0-19ca4908e4ed", 1, 0, 0.0, 865.0, 865, 865, 865.0, 865.0, 865.0, 865.0, 1.1560693641618498, 0.20886018786127167, 0.7970556358381503], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 359.6000000000001, 77, 711, 350.0, 694.2000000000002, 710.5, 711.0, 0.0889616397409437, 13.0908269151217, 0.048564020132019076], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 152.42857142857144, 78, 627, 80.0, 432.5, 627.0, 627.0, 0.09679738923613032, 2.057201099168925, 0.056406625954145695], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 432.92307692307696, 86, 865, 424.0, 796.1999999999999, 865.0, 865.0, 0.08124644546801077, 0.015392392989056728, 0.055570078574687355], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 19, 0, 0.0, 245.15789473684208, 159, 473, 166.0, 471.0, 473.0, 473.0, 0.08988891622353007, 0.1393102637175217, 0.20216227935819311], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4130ef57-fbfb-4d83-bcad-e039354497a3", 1, 0, 0.0, 175.0, 175, 175, 175.0, 175.0, 175.0, 175.0, 5.714285714285714, 1.0323660714285714, 3.9397321428571432], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/887bfa2f-b923-431f-94f6-dd421c866ab1", 1, 0, 0.0, 184.0, 184, 184, 184.0, 184.0, 184.0, 184.0, 5.434782608695652, 1.7355213994565217, 3.2428243885869565], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 432.19047619047615, 144, 969, 398.0, 754.0, 947.8999999999996, 969.0, 0.09311688829964128, 0.0571977761137445, 0.042102655549544836], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 89.19999999999999, 79, 244, 80.5, 86.7, 236.1499999999999, 244.0, 0.08902301690101976, 0.066158706896168, 0.04468538153039468], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 127.69999999999999, 78, 250, 80.0, 247.10000000000002, 249.9, 250.0, 0.08896005693443644, 0.09061068299083712, 0.04699940507961925], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8ab7732b-008c-409e-af60-e665b5d65be8", 3, 0, 0.0, 570.0, 198, 1094, 418.0, 1094.0, 1094.0, 1094.0, 0.031003586081456758, 0.025846414047724853, 0.01988185695978835], "isController": false}, {"data": ["login", 21, 0, 0.0, 2355.0, 1304, 3501, 2388.0, 2912.8, 3445.899999999999, 3501.0, 0.09627860276823906, 22.07341881020278, 0.17567352756777327], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 84.35714285714286, 80, 93, 83.0, 92.0, 93.0, 93.0, 0.09656304532255505, 0.07817457477773256, 0.03432514501700199], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1d104510-13a6-4e98-8cff-c176dcf213e3", 3, 0, 0.0, 253.66666666666669, 164, 389, 208.0, 389.0, 389.0, 389.0, 0.015969338869370808, 0.0220150228228468, 0.010240754418183753], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 569.8, 158, 1010, 632.0, 1008.2, 1009.95, 1010.0, 0.08892801721646414, 53.26332301490433, 0.18862466151773447], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8d9c4ff9-4f3d-4d52-bd36-e84436324393", 1, 0, 0.0, 424.0, 424, 424, 424.0, 424.0, 424.0, 424.0, 2.3584905660377355, 0.4260944870283019, 1.626068691037736], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d3e202c4-38f5-4c77-b42b-6be78fc4fc1e", 3, 0, 0.0, 343.33333333333337, 162, 657, 211.0, 657.0, 657.0, 657.0, 0.03838476892369108, 0.031999802478376575, 0.02461523267567429], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 298.5, 160, 937, 314.5, 610.8000000000003, 937.0, 937.0, 0.10133894075472176, 7.724527358743018, 0.22629312051100162], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8c89609f-dcd4-4a2b-81e8-1f954b210a96", 1, 0, 0.0, 171.0, 171, 171, 171.0, 171.0, 171.0, 171.0, 5.847953216374268, 1.8674616228070173, 3.4893548976608186], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b3552783-b53d-4f2e-9e68-19d3c75e7382", 1, 0, 0.0, 412.0, 412, 412, 412.0, 412.0, 412.0, 412.0, 2.4271844660194173, 0.43850500606796117, 1.6734299150485439], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, 33.333333333333336, 634.8333333333334, 80, 1018, 808.0, 1018.0, 1018.0, 1018.0, 0.11052369812293919, 88.15970271427783, 0.19055623929301674], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/50b2fc4b-26e7-453e-b717-a3f5735bd446", 3, 0, 0.0, 329.3333333333333, 180, 467, 341.0, 467.0, 467.0, 467.0, 0.023391265701387103, 0.023459794800121638, 0.015000258278558788], "isController": false}, {"data": ["register", 22, 4, 18.181818181818183, 1091.409090909091, 200, 1993, 1114.5, 1627.1999999999998, 1942.8999999999992, 1993.0, 0.08552158448171976, 0.027181043363330677, 0.038584933623588405], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 103.06250000000001, 79, 242, 84.0, 237.1, 242.0, 242.0, 0.08072735345462617, 0.06267406835588654, 0.02869605142332415], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 261.64285714285717, 158, 927, 164.0, 700.0, 927.0, 927.0, 0.09673986649898422, 8.405969659527495, 0.2158022412554071], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 310.1578947368421, 159, 1002, 211.0, 819.0, 1002.0, 1002.0, 0.10046956301027962, 12.791583782031283, 0.2232524988498879], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 13, 0, 0.0, 95.15384615384616, 79, 239, 81.0, 181.39999999999995, 239.0, 239.0, 0.06539663056437292, 0.048600425644031046, 0.0328260430762575], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 13, 0, 0.0, 103.84615384615385, 78, 238, 80.0, 237.2, 238.0, 238.0, 0.06539893349431532, 0.017499324001408592, 0.03729782925847671], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 13, 0, 0.0, 104.46153846153847, 78, 237, 80.0, 237.0, 237.0, 237.0, 0.06534699253033609, 0.017613056580442148, 0.03841688428052961], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 13, 0, 0.0, 146.23076923076923, 79, 320, 82.0, 286.4, 320.0, 320.0, 0.0653473210111744, 0.017613145116293097, 0.03848089313450992], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 86.0, 86, 86, 86.0, 86.0, 86.0, 86.0, 11.627906976744185, 3.429324127906977, 7.18795421511628], "isController": false}, {"data": ["https://demoqa.com/books", 60, 0, 0.0, 964.6833333333336, 621, 4640, 787.5, 1326.1, 1452.05, 4640.0, 0.2604245788717539, 311.5583345631161, 0.5142368149205923], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 4, 18.181818181818183, 1091.409090909091, 200, 1993, 1114.5, 1627.1999999999998, 1942.8999999999992, 1993.0, 0.08639580273481987, 0.027458893269766967, 0.03897935631199881], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 101.71428571428572, 78, 234, 80.0, 234.0, 234.0, 234.0, 0.03220123008698932, 0.008679237796883841, 0.01896224779536578], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 102.57142857142857, 78, 241, 80.0, 241.0, 241.0, 241.0, 0.03222420682416632, 0.008685430745576076, 0.018944309089988398], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7eda6705-9d00-401b-8cdb-d0678d271899", 1, 0, 0.0, 693.0, 693, 693, 693.0, 693.0, 693.0, 693.0, 1.443001443001443, 0.2606985028860029, 0.9948818542568544], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 224.0, 77, 860, 79.0, 854.4, 860.0, 860.0, 0.08150208339700683, 13.768295586089122, 0.046601044754831546], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 180.75000000000003, 78, 620, 80.0, 512.2000000000002, 620.0, 620.0, 0.08156773180529782, 4.514791878020555, 0.04671823701543669], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 102.14285714285715, 78, 238, 80.0, 238.0, 238.0, 238.0, 0.03222405848206271, 0.008622453148520686, 0.01837778335305139], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 90.50000000000001, 78, 244, 80.5, 130.6000000000001, 244.0, 244.0, 0.08156648433158815, 0.06061727985970565, 0.04094255170550421], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 80.71428571428572, 78, 84, 80.0, 84.0, 84.0, 84.0, 0.032223316792030714, 0.023947211014390013, 0.016174594561624792], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 137.875, 78, 242, 80.0, 237.8, 242.0, 242.0, 0.08150332890158983, 0.044761166592804276, 0.045198928613271794], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9534dc5f-61c4-4d12-9e34-4e693c91c546", 3, 0, 0.0, 275.0, 180, 421, 224.0, 421.0, 421.0, 421.0, 0.06194763360039647, 0.04022966439869497, 0.03972553326587924], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 84.57142857142858, 81, 92, 83.0, 92.0, 92.0, 92.0, 0.03223815708272311, 0.025374955672534012, 0.01145965740049923], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 443.30769230769226, 81, 694, 418.0, 679.2, 694.0, 694.0, 0.0781372089388967, 0.01463898731171938, 0.053179320386598866], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1400.0, 854, 2027, 1391.0, 1938.6000000000001, 2023.3999999999999, 2027.0, 0.09390049230686681, 0.04860084074476505, 0.043190558473177994], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 207.2857142857143, 158, 325, 163.0, 325.0, 325.0, 325.0, 0.03218849583158979, 0.04988588172337207, 0.0723926815431165], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4359ddb7-8e93-4ed0-bf3d-42a42f863d83", 1, 0, 0.0, 469.0, 469, 469, 469.0, 469.0, 469.0, 469.0, 2.1321961620469083, 0.6808868603411514, 1.2722381396588487], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=14212fc2-b4f1-4483-a45e-f87b777a7f05", 1, 0, 0.0, 434.0, 434, 434, 434.0, 434.0, 434.0, 434.0, 2.304147465437788, 0.4162766417050691, 1.5886016705069124], "isController": false}, {"data": ["addBook", 64, 4, 6.25, 870.03125, 418, 2417, 708.0, 1395.0, 1692.0, 2417.0, 0.29273602985907504, 94.13436791029928, 1.0647683468876212], "isController": true}, {"data": ["https://demoqa.com/books-0", 60, 0, 0.0, 132.79999999999995, 79, 376, 81.0, 321.9, 326.9, 376.0, 0.2611409247000144, 0.19407055048506927, 0.1262351149672921], "isController": false}, {"data": ["https://demoqa.com/books-3", 60, 0, 0.0, 601.6000000000003, 386, 4560, 468.0, 687.5, 737.6999999999999, 4560.0, 0.2611125133820163, 76.77574868573369, 0.13132123475755703], "isController": false}, {"data": ["https://demoqa.com/books-1", 60, 0, 0.0, 187.45000000000005, 77, 4182, 82.0, 240.8, 346.34999999999985, 4182.0, 0.26129217691222323, 0.4623646724267076, 0.12707373447488984], "isController": false}, {"data": ["https://demoqa.com/books-2", 60, 0, 0.0, 740.3166666666666, 539, 1108, 701.5, 946.7, 1083.4999999999998, 1108.0, 0.2608389449934138, 234.70334121103176, 0.1309289235611472], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 92.52631578947368, 80, 244, 83.0, 100.0, 244.0, 244.0, 0.10079896442327077, 0.07530391385136928, 0.035830881884834534], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 188, 4, 2.127659574468085, 149.09574468085114, 78, 1226, 86.0, 264.3999999999999, 314.0999999999996, 1080.0399999999977, 0.7701824676974003, 1.6306206933280893, 0.37166488971642536], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 13, 0, 0.0, 84.53846153846153, 81, 96, 83.0, 92.8, 96.0, 96.0, 0.06846104829663646, 0.05301719853440694, 0.02433576326169499], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/44c647db-433f-4e26-8bc4-c3de7984a6e1", 3, 0, 0.0, 500.6666666666667, 168, 694, 640.0, 694.0, 694.0, 694.0, 0.018508921300066632, 0.025516042221934303, 0.011869327786826584], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5c3df0d7-22d5-45f9-9ed0-19ca4908e4ed", 3, 0, 0.0, 277.3333333333333, 195, 395, 242.0, 395.0, 395.0, 395.0, 0.01670936838587501, 0.023035213253314025, 0.010715317617244069], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1d104510-13a6-4e98-8cff-c176dcf213e3", 1, 0, 0.0, 446.0, 446, 446, 446.0, 446.0, 446.0, 446.0, 2.242152466367713, 0.40507637331838564, 1.5458590246636772], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 113.625, 81, 240, 83.0, 238.6, 240.0, 240.0, 0.09856100926473488, 0.07998456904198699, 0.03503535876207372], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/14212fc2-b4f1-4483-a45e-f87b777a7f05", 3, 0, 0.0, 311.6666666666667, 164, 387, 384.0, 387.0, 387.0, 387.0, 0.048926870637354035, 0.03976900910855242, 0.03137562993345946], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=50b2fc4b-26e7-453e-b717-a3f5735bd446", 1, 0, 0.0, 484.0, 484, 484, 484.0, 484.0, 484.0, 484.0, 2.066115702479339, 0.37327285640495866, 1.4244899276859504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 13, 0, 0.0, 242.84615384615387, 161, 477, 177.0, 446.59999999999997, 477.0, 477.0, 0.06531842733324959, 0.10123080486119834, 0.14690267397311896], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d3e202c4-38f5-4c77-b42b-6be78fc4fc1e", 1, 0, 0.0, 375.0, 375, 375, 375.0, 375.0, 375.0, 375.0, 2.6666666666666665, 0.4817708333333333, 1.8385416666666667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 355.0625, 160, 941, 239.5, 934.7, 941.0, 941.0, 0.08146846915654675, 18.37720120006874, 0.17931615812520685], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9534dc5f-61c4-4d12-9e34-4e693c91c546", 1, 0, 0.0, 412.0, 412, 412, 412.0, 412.0, 412.0, 412.0, 2.4271844660194173, 0.43850500606796117, 1.6734299150485439], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4130ef57-fbfb-4d83-bcad-e039354497a3", 3, 0, 0.0, 375.0, 189, 588, 348.0, 588.0, 588.0, 588.0, 0.07689350249903884, 0.03479230744585416, 0.049309960912469565], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 19, 0, 0.0, 92.26315789473682, 80, 237, 84.0, 93.0, 237.0, 237.0, 0.09349059435415222, 0.07751319785808128, 0.03323298471182754], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 99.50000000000001, 80, 237, 83.0, 221.10000000000028, 236.85, 237.0, 0.08874965054825097, 0.06890231658775343, 0.03154772734332358], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8d9c4ff9-4f3d-4d52-bd36-e84436324393", 3, 0, 0.0, 553.0, 196, 1012, 451.0, 1012.0, 1012.0, 1012.0, 0.04826487764853516, 0.03102966580594302, 0.030951109689978603], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8ab7732b-008c-409e-af60-e665b5d65be8", 1, 0, 0.0, 436.0, 436, 436, 436.0, 436.0, 436.0, 436.0, 2.293577981651376, 0.4143671158256881, 1.581314506880734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 91.73684210526316, 79, 234, 81.0, 127.0, 234.0, 234.0, 0.10051208261035167, 0.07469696764304457, 0.050452353966524185], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 95.84210526315793, 78, 236, 79.0, 234.0, 236.0, 236.0, 0.10053814364254986, 0.04279692154849907, 0.05644935655588069], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b3552783-b53d-4f2e-9e68-19d3c75e7382", 3, 0, 0.0, 256.6666666666667, 176, 406, 188.0, 406.0, 406.0, 406.0, 0.025276354812617956, 0.02535040663335805, 0.016209120761997844], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/336032c8-8e74-4692-95ac-f176d81aec82", 1, 0, 0.0, 164.0, 164, 164, 164.0, 164.0, 164.0, 164.0, 6.097560975609756, 1.947170350609756, 3.6382907774390243], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 209.0526315789474, 78, 920, 87.0, 734.0, 920.0, 920.0, 0.10053814364254986, 9.546813982606901, 0.05819595876348666], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 175.1052631578947, 79, 550, 87.0, 470.0, 550.0, 550.0, 0.10053814364254986, 3.1359880915214595, 0.05829414054438759], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 33.333333333333336, 0.2888086642599278], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 8.333333333333334, 0.07220216606498195], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 8.333333333333334, 0.07220216606498195], "isController": false}, {"data": ["401/Unauthorized", 6, 50.0, 0.4332129963898917], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1385, 12, "401/Unauthorized", 6, "406/Not Acceptable", 4, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 188, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
