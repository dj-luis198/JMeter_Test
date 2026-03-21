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

    var data = {"OkPercent": 97.85661492978566, "KoPercent": 2.1433850702143387};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8289057558507273, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4915254237288136, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/80e733c8-8257-41d4-837b-8900eccd680e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ef1a16a0-b1f4-4464-a3f7-bfe1723e8707"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6d255035-5f2d-4fa8-a1bf-f5b8174f25cd"], "isController": false}, {"data": [0.78125, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.78125, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a66f8333-aabe-4145-8a1d-160a15d704c8"], "isController": false}, {"data": [0.84375, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=731197ef-c9b4-4c94-9ccc-590cb0415f3b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b4271f5c-45a7-43cb-875a-699148aa4f73"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/cb941a86-4cf0-432c-bd04-7ffbbea95679"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ccbe075c-4f42-46f2-929c-37f4a1f61751"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6775403b-8e19-4057-a1d7-2856ca653bb4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.78125, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=431f0a44-95a8-45f0-8e3f-69eb5528f4bd"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.07142857142857142, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/029920b8-144e-451a-b370-1896fab4c093"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/975a09bf-b28f-4eec-9676-a3a1b532fb1b"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4a3afe9e-d851-4679-a263-023e5417e65f"], "isController": false}, {"data": [0.36538461538461536, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6775403b-8e19-4057-a1d7-2856ca653bb4"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6d255035-5f2d-4fa8-a1bf-f5b8174f25cd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=70886741-06ba-4485-aa5e-e034f5a5303a"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a66f8333-aabe-4145-8a1d-160a15d704c8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=80e733c8-8257-41d4-837b-8900eccd680e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.36538461538461536, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ef1a16a0-b1f4-4464-a3f7-bfe1723e8707"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.71875, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.47619047619047616, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=029920b8-144e-451a-b370-1896fab4c093"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/731197ef-c9b4-4c94-9ccc-590cb0415f3b"], "isController": false}, {"data": [0.3706896551724138, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cb941a86-4cf0-432c-bd04-7ffbbea95679"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b4271f5c-45a7-43cb-875a-699148aa4f73"], "isController": false}, {"data": [0.8898305084745762, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ccbe075c-4f42-46f2-929c-37f4a1f61751"], "isController": false}, {"data": [0.9142857142857143, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/431f0a44-95a8-45f0-8e3f-69eb5528f4bd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4a3afe9e-d851-4679-a263-023e5417e65f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/70886741-06ba-4485-aa5e-e034f5a5303a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=975a09bf-b28f-4eec-9676-a3a1b532fb1b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1353, 29, 2.1433850702143387, 268.075388026607, 77, 1808, 102.0, 646.0, 812.3, 1265.9000000000005, 5.309380297607836, 754.5885929259277, 3.88789385016403], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 59, 0, 0.0, 1171.8135593220338, 950, 1594, 1152.0, 1379.0, 1417.0, 1594.0, 0.2626506345906434, 316.0565737363833, 1.2914511183241109], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/80e733c8-8257-41d4-837b-8900eccd680e", 3, 0, 0.0, 277.6666666666667, 173, 387, 273.0, 387.0, 387.0, 387.0, 0.048118564142046, 0.029933130232893852, 0.030857282343694867], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ef1a16a0-b1f4-4464-a3f7-bfe1723e8707", 1, 0, 0.0, 380.0, 380, 380, 380.0, 380.0, 380.0, 380.0, 2.631578947368421, 0.4754317434210526, 1.8143503289473684], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6d255035-5f2d-4fa8-a1bf-f5b8174f25cd", 1, 0, 0.0, 211.0, 211, 211, 211.0, 211.0, 211.0, 211.0, 4.739336492890995, 0.8562277843601896, 3.267550355450237], "isController": false}, {"data": ["deleteBook", 16, 2, 12.5, 419.625, 82, 729, 422.5, 661.8000000000001, 729.0, 729.0, 0.07928013636183455, 0.015455368380108614, 0.05341150788341856], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 2, 12.5, 419.625, 82, 729, 422.5, 661.8000000000001, 729.0, 729.0, 0.0785596095587405, 0.015314904353675362, 0.05292608461360947], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 151.66666666666669, 78, 244, 83.0, 244.0, 244.0, 244.0, 0.09347541596560105, 0.03281173726657111, 0.052874060701896514], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 109.5, 77, 244, 84.0, 243.1, 244.0, 244.0, 0.09347201811279995, 0.06946504471078199, 0.04691857159177654], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 143.05555555555554, 78, 564, 82.0, 276.90000000000043, 564.0, 564.0, 0.09347493054293356, 1.550724349570275, 0.054598041570378834], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 133.7222222222222, 78, 559, 81.5, 276.40000000000043, 559.0, 559.0, 0.09347541596560105, 4.69653615973131, 0.05450704051639974], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a66f8333-aabe-4145-8a1d-160a15d704c8", 1, 0, 0.0, 500.0, 500, 500, 500.0, 500.0, 500.0, 500.0, 2.0, 0.361328125, 1.37890625], "isController": false}, {"data": ["goToProfile", 16, 2, 12.5, 227.125, 82, 853, 185.0, 451.90000000000043, 853.0, 853.0, 0.07888807261647084, 0.146889552692302, 0.05099027642873696], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=731197ef-c9b4-4c94-9ccc-590cb0415f3b", 1, 0, 0.0, 355.0, 355, 355, 355.0, 355.0, 355.0, 355.0, 2.8169014084507045, 0.5089128521126761, 1.9421214788732395], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b4271f5c-45a7-43cb-875a-699148aa4f73", 3, 0, 0.0, 237.33333333333334, 165, 361, 186.0, 361.0, 361.0, 361.0, 0.024756764785977766, 0.024829294370311686, 0.015875920126424546], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cb941a86-4cf0-432c-bd04-7ffbbea95679", 3, 0, 0.0, 1187.3333333333333, 853, 1808, 901.0, 1808.0, 1808.0, 1808.0, 0.10221813349688234, 0.04625104347677945, 0.06555004003543562], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 82.82352941176472, 79, 89, 83.0, 87.4, 89.0, 89.0, 0.08501530275449581, 0.06318031776969854, 0.04267369689044028], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 100.70588235294117, 78, 250, 81.0, 244.4, 250.0, 250.0, 0.08501147654933416, 0.030257991078795635, 0.0480631291474349], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 449.1428571428571, 391, 580, 405.0, 580.0, 580.0, 580.0, 0.06270996640537514, 18.438812290033596, 0.03576427771556551], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 623.8571428571429, 542, 727, 555.0, 727.0, 727.0, 727.0, 0.06252791424743188, 56.262727152188475, 0.03559938867798124], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ccbe075c-4f42-46f2-929c-37f4a1f61751", 3, 0, 0.0, 551.0, 160, 780, 713.0, 780.0, 780.0, 780.0, 0.017429902741142703, 0.02402852803018859, 0.011177379036474977], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 170.85714285714283, 81, 241, 236.0, 241.0, 241.0, 241.0, 0.06288291201782283, 0.11127327790653803, 0.034818956166118686], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6775403b-8e19-4057-a1d7-2856ca653bb4", 3, 0, 0.0, 368.6666666666667, 198, 521, 387.0, 521.0, 521.0, 521.0, 0.04681282671451978, 0.03009613696652883, 0.030019944214714836], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 96.75, 79, 242, 82.5, 197.30000000000015, 242.0, 242.0, 0.07687182903705223, 0.05712838075898119, 0.0385860548096141], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 120.66666666666667, 78, 252, 81.5, 248.70000000000002, 252.0, 252.0, 0.07687232148004843, 0.03019090360210886, 0.04330323968789837], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 174.58333333333334, 80, 724, 81.0, 580.9000000000005, 724.0, 724.0, 0.07687232148004843, 5.783147034730274, 0.04464199919284062], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 133.41666666666666, 78, 400, 81.0, 352.3000000000002, 400.0, 400.0, 0.07687232148004843, 1.9025774448601243, 0.044717069819285984], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 107.00000000000001, 82, 247, 83.0, 247.0, 247.0, 247.0, 0.0628834769172723, 0.04673274016996506, 0.03531054612053865], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 120.00000000000001, 78, 575, 82.0, 302.9999999999998, 575.0, 575.0, 0.08501147654933416, 4.521181648585059, 0.049547704565116285], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 470.31250000000006, 80, 819, 637.5, 797.3000000000001, 819.0, 819.0, 0.07864146862942666, 44.234030943574744, 0.04200867513700818], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 113.47058823529413, 79, 468, 81.0, 282.39999999999986, 468.0, 468.0, 0.08501360217634822, 1.4919672303818612, 0.04963196455182829], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 348.06249999999994, 78, 650, 403.5, 598.2, 650.0, 650.0, 0.07864262823663568, 14.460163668826063, 0.04208609401726206], "isController": false}, {"data": ["deleteBooks", 16, 2, 12.5, 426.87499999999994, 81, 1352, 377.5, 918.0000000000005, 1352.0, 1352.0, 0.07868942758359522, 0.015340211895874216, 0.05355145981183391], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=431f0a44-95a8-45f0-8e3f-69eb5528f4bd", 1, 0, 0.0, 388.0, 388, 388, 388.0, 388.0, 388.0, 388.0, 2.577319587628866, 0.46562902706185566, 1.7769410438144329], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 286.33333333333337, 163, 967, 171.0, 775.9000000000007, 967.0, 967.0, 0.0768314701701817, 7.768913396927381, 0.17115760615548128], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 541.047619047619, 104, 1414, 431.0, 934.6, 1366.8999999999994, 1414.0, 0.0955118525660851, 0.05866890162506595, 0.043185534900485746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 81.87500000000001, 78, 89, 81.0, 86.9, 89.0, 89.0, 0.07864108210128971, 0.0584432260537905, 0.03947413691412394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 141.5, 78, 253, 82.5, 248.1, 253.0, 253.0, 0.07864224169709957, 0.09486604400033423, 0.04072270376942095], "isController": false}, {"data": ["login", 21, 0, 0.0, 2171.0, 1196, 2935, 2083.0, 2925.8, 2934.7, 2935.0, 0.09217034836002616, 36.87987066113571, 0.19001133338673362], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 88.17647058823529, 83, 98, 87.0, 96.4, 98.0, 98.0, 0.08568807524421101, 0.06937052185297943, 0.030459432996965633], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/029920b8-144e-451a-b370-1896fab4c093", 3, 0, 0.0, 277.3333333333333, 215, 337, 280.0, 337.0, 337.0, 337.0, 0.09487966096334481, 0.04459838230178058, 0.060844053417249126], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 554.8125, 161, 899, 727.5, 878.7, 899.0, 899.0, 0.0786093997189714, 58.82329290169403, 0.16422378745000932], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/975a09bf-b28f-4eec-9676-a3a1b532fb1b", 3, 0, 0.0, 360.0, 230, 465, 385.0, 465.0, 465.0, 465.0, 0.027082900759223982, 0.027162245195042022, 0.01736761539572632], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 299.0, 163, 808, 320.5, 521.8000000000004, 808.0, 808.0, 0.09343271806158254, 6.346647509174574, 0.2088042818138405], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, 36.36363636363637, 495.81818181818176, 79, 974, 630.0, 941.2, 974.0, 974.0, 0.09479081390839761, 72.17462110603645, 0.15885708399758713], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4a3afe9e-d851-4679-a263-023e5417e65f", 1, 0, 0.0, 482.0, 482, 482, 482.0, 482.0, 482.0, 482.0, 2.074688796680498, 0.3748217064315353, 1.4304006742738589], "isController": false}, {"data": ["register", 26, 8, 30.76923076923077, 863.5384615384615, 155, 1453, 949.5, 1316.4, 1439.0, 1453.0, 0.10155972297632486, 0.03182896366114989, 0.045820890639709067], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6775403b-8e19-4057-a1d7-2856ca653bb4", 1, 0, 0.0, 359.0, 359, 359, 359.0, 359.0, 359.0, 359.0, 2.785515320334262, 0.5032425139275766, 1.920482242339833], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 222.99999999999997, 162, 659, 167.0, 398.19999999999976, 659.0, 659.0, 0.0849745076477057, 6.103891488803359, 0.1898307460886734], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 97.76470588235293, 83, 238, 87.0, 135.5999999999999, 238.0, 238.0, 0.09871553666411167, 0.07663950356246951, 0.035090288423570946], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6d255035-5f2d-4fa8-a1bf-f5b8174f25cd", 3, 0, 0.0, 282.6666666666667, 160, 426, 262.0, 426.0, 426.0, 426.0, 0.06562397462539649, 0.029693139560319368, 0.04208308268620802], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=70886741-06ba-4485-aa5e-e034f5a5303a", 1, 0, 0.0, 346.0, 346, 346, 346.0, 346.0, 346.0, 346.0, 2.890173410404624, 0.5221504696531792, 1.9926390895953758], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 267.7368421052632, 163, 630, 178.0, 500.0, 630.0, 630.0, 0.0859888033526582, 5.540594140202481, 0.19223288455098003], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a66f8333-aabe-4145-8a1d-160a15d704c8", 3, 0, 0.0, 377.0, 174, 608, 349.0, 608.0, 608.0, 608.0, 0.021080294843057203, 0.025286746906466734, 0.013518288034121972], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 101.0, 81, 235, 82.0, 235.0, 235.0, 235.0, 0.04555601111566671, 0.03385559029201403, 0.02286698214204364], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 140.0, 80, 241, 82.0, 241.0, 241.0, 241.0, 0.045514800844299555, 0.012178765069666092, 0.02595765985651459], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 120.0, 79, 241, 80.5, 241.0, 241.0, 241.0, 0.045556270535912574, 0.012278838542882687, 0.02678210435802673], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 80.125, 78, 83, 80.0, 83.0, 83.0, 83.0, 0.04555678938526807, 0.012278978388998036, 0.026826898436832666], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 83.0, 81, 85, 83.0, 85.0, 85.0, 85.0, 0.07933674481336031, 0.023398141536752747, 0.049043124479352614], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=80e733c8-8257-41d4-837b-8900eccd680e", 1, 0, 0.0, 732.0, 732, 732, 732.0, 732.0, 732.0, 732.0, 1.366120218579235, 0.24680882855191258, 0.9418758538251366], "isController": false}, {"data": ["https://demoqa.com/books", 59, 0, 0.0, 748.5932203389831, 615, 1209, 646.0, 1038.0, 1071.0, 1209.0, 0.24735974911851885, 295.92825610852805, 0.4884388796070753], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 8, 30.76923076923077, 863.5384615384615, 155, 1453, 949.5, 1316.4, 1439.0, 1453.0, 0.10202800276260439, 0.03197572322157343, 0.0460321653089094], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ef1a16a0-b1f4-4464-a3f7-bfe1723e8707", 3, 0, 0.0, 430.6666666666667, 237, 657, 398.0, 657.0, 657.0, 657.0, 0.022682766390188947, 0.026810261967049505, 0.014545914644750075], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 10, 0, 0.0, 112.39999999999999, 80, 236, 82.0, 235.9, 236.0, 236.0, 0.05510734911607812, 0.01485315269144293, 0.032450909684565536], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 10, 0, 0.0, 129.79999999999998, 80, 244, 83.0, 243.8, 244.0, 244.0, 0.05505789337488369, 0.014839822823699118, 0.03236801934734373], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 124.70588235294119, 78, 329, 82.0, 264.99999999999994, 329.0, 329.0, 0.09670409684062027, 0.02606477610157343, 0.05685143193169277], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 147.11764705882354, 79, 248, 84.0, 245.6, 248.0, 248.0, 0.09661506285662325, 0.026040778660574235, 0.056893440334515454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 10, 0, 0.0, 127.5, 79, 240, 82.0, 239.5, 240.0, 240.0, 0.05506062174454074, 0.014733017927738441, 0.031401760838683394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 110.58823529411765, 80, 247, 83.0, 243.8, 247.0, 247.0, 0.09661396469612067, 0.07180002649780061, 0.04849568149785744], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 10, 0, 0.0, 130.29999999999998, 80, 246, 83.0, 245.7, 246.0, 246.0, 0.05510734911607812, 0.0409538014427104, 0.0276613060992814], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 126.7058823529412, 78, 243, 82.0, 238.2, 243.0, 243.0, 0.09670464694271104, 0.025876048107717597, 0.055151868959514884], "isController": false}, {"data": ["deleteAccount", 16, 2, 12.5, 486.2500000000001, 79, 1808, 394.0, 1041.500000000001, 1808.0, 1808.0, 0.07936389835468718, 0.015200434145325218, 0.05401046549406507], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 88.39999999999999, 82, 110, 86.5, 107.9, 110.0, 110.0, 0.0561245966044619, 0.04417619615546513, 0.019950540199242316], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1131.952380952381, 674, 1574, 1087.0, 1484.8, 1565.1, 1574.0, 0.09328689718895483, 0.048283257334127014, 0.042908328687497777], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 0, 0.0, 276.4, 164, 489, 167.0, 488.8, 489.0, 489.0, 0.05503335021022739, 0.08529094412463953, 0.12377129446694697], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=029920b8-144e-451a-b370-1896fab4c093", 1, 0, 0.0, 186.0, 186, 186, 186.0, 186.0, 186.0, 186.0, 5.376344086021506, 0.9713121639784946, 3.7067372311827955], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/731197ef-c9b4-4c94-9ccc-590cb0415f3b", 3, 0, 0.0, 272.6666666666667, 194, 391, 233.0, 391.0, 391.0, 391.0, 0.03327565553041395, 0.027740544861129597, 0.02133888066240738], "isController": false}, {"data": ["addBook", 58, 13, 22.413793103448278, 815.8620689655172, 416, 1842, 705.5, 1333.5, 1457.0499999999988, 1842.0, 0.27373856079591846, 80.13566854006494, 0.9953534501677829], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cb941a86-4cf0-432c-bd04-7ffbbea95679", 1, 0, 0.0, 1352.0, 1352, 1352, 1352.0, 1352.0, 1352.0, 1352.0, 0.7396449704142012, 0.1336272651627219, 0.5099505362426036], "isController": false}, {"data": ["https://demoqa.com/books-0", 59, 0, 0.0, 143.6271186440678, 79, 344, 84.0, 330.0, 334.0, 344.0, 0.24793978845272968, 0.18425994044192115, 0.11985370633213005], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b4271f5c-45a7-43cb-875a-699148aa4f73", 1, 0, 0.0, 487.0, 487, 487, 487.0, 487.0, 487.0, 487.0, 2.053388090349076, 0.37097343429158114, 1.4157148357289528], "isController": false}, {"data": ["https://demoqa.com/books-3", 59, 0, 0.0, 438.1186440677966, 383, 646, 405.0, 565.0, 571.0, 646.0, 0.24791478454524443, 72.89517820188247, 0.12468370511796961], "isController": false}, {"data": ["https://demoqa.com/books-1", 59, 0, 0.0, 129.77966101694918, 78, 335, 86.0, 243.0, 254.0, 335.0, 0.24825903094822327, 0.4393021133575982, 0.1207353490353664], "isController": false}, {"data": ["https://demoqa.com/books-2", 59, 0, 0.0, 601.1864406779662, 536, 821, 561.0, 726.0, 739.0, 821.0, 0.24776278602953833, 222.93739038990094, 0.12436530470623312], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 88.36842105263158, 82, 111, 86.0, 99.0, 111.0, 111.0, 0.08975939757271693, 0.06705658119446138, 0.03190666085592672], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ccbe075c-4f42-46f2-929c-37f4a1f61751", 1, 0, 0.0, 511.0, 511, 511, 511.0, 511.0, 511.0, 511.0, 1.9569471624266144, 0.35355002446183953, 1.349223336594912], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 13, 7.428571428571429, 142.6, 80, 1170, 88.0, 241.4, 320.19999999999993, 1007.360000000002, 0.71474373373958, 1.595932616768705, 0.3404365884464739], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 104.5, 81, 243, 84.0, 243.0, 243.0, 243.0, 0.04649405747827856, 0.0360056519338622, 0.016527184494231833], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/431f0a44-95a8-45f0-8e3f-69eb5528f4bd", 3, 0, 0.0, 289.6666666666667, 160, 476, 233.0, 476.0, 476.0, 476.0, 0.023313646254274168, 0.023381947952284737, 0.014950482786757847], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 111.55555555555557, 83, 248, 89.0, 241.70000000000002, 248.0, 248.0, 0.0906842123824254, 0.07359236375956592, 0.032235403620315274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 243.125, 162, 477, 167.0, 477.0, 477.0, 477.0, 0.04549357687561488, 0.07050615869296954, 0.10231612064896588], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 282.4117647058824, 162, 497, 317.0, 484.2, 497.0, 497.0, 0.09647908106512905, 0.1495237320804295, 0.2169837145439377], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 96.08333333333334, 80, 237, 83.5, 191.40000000000015, 237.0, 237.0, 0.07622822731257385, 0.06320094237146015, 0.027096752677516486], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4a3afe9e-d851-4679-a263-023e5417e65f", 3, 0, 0.0, 314.0, 193, 546, 203.0, 546.0, 546.0, 546.0, 0.02450620006861736, 0.02473754114999428, 0.015715238976294336], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/70886741-06ba-4485-aa5e-e034f5a5303a", 3, 0, 0.0, 246.66666666666669, 167, 397, 176.0, 397.0, 397.0, 397.0, 0.02727024815925825, 0.022734083833287882, 0.017487756794836832], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 95.6875, 82, 239, 85.5, 138.9000000000001, 239.0, 239.0, 0.07979890675497746, 0.0619532528029366, 0.028366017635558394], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=975a09bf-b28f-4eec-9676-a3a1b532fb1b", 1, 0, 0.0, 375.0, 375, 375, 375.0, 375.0, 375.0, 375.0, 2.6666666666666665, 0.4817708333333333, 1.8385416666666667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 101.10526315789473, 79, 254, 83.0, 241.0, 254.0, 254.0, 0.08602111592024485, 0.06392780196807259, 0.04317856795215415], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 114.94736842105263, 80, 243, 82.0, 243.0, 243.0, 243.0, 0.086022673765801, 0.02981789226339237, 0.04867956610616103], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 155.89473684210526, 80, 547, 82.0, 246.0, 547.0, 547.0, 0.08602189483596984, 4.095789093838569, 0.05018238622472541], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 123.47368421052633, 78, 400, 81.0, 246.0, 400.0, 400.0, 0.08602228429912212, 1.353197383224749, 0.0502666195619202], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 27.586206896551722, 0.5912786400591279], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 6.896551724137931, 0.14781966001478197], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 6.896551724137931, 0.14781966001478197], "isController": false}, {"data": ["401/Unauthorized", 17, 58.62068965517241, 1.2564671101256466], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1353, 29, "401/Unauthorized", 17, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 26, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
