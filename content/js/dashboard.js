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

    var data = {"OkPercent": 99.8483699772555, "KoPercent": 0.1516300227445034};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7889397905759162, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.058333333333333334, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8ec3a113-ca6f-4b21-b3e8-403b13d8cf2c"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7692307692307693, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=27a7b25e-5f70-4517-bd76-d3a7da87a561"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fb2cb5d1-7181-4865-bbef-2b8857cfd121"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/da63d0dd-be11-43b8-a14f-8defea5fe519"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.65625, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e98a4185-1d34-422a-be10-e69f159a4160"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=93456a00-69c3-4e72-8b56-0f027e786495"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ad202833-45b4-4dcc-987c-f352f4f94efe"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/431eaf30-cb6c-403b-96bf-07991d78152c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fb2cb5d1-7181-4865-bbef-2b8857cfd121"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0fde393e-9c09-4d1c-a82c-47ccbc4b18a7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9bf4dd5c-387b-4e61-b32c-b7ecdcf2804e"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d659a12b-e738-4771-88bd-393eda34f05f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d3bc75b9-4be4-455d-9646-ebaf6bfed0a4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f0424b8d-39fb-4857-881e-c0d35eead6e2"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f0424b8d-39fb-4857-881e-c0d35eead6e2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/27a7b25e-5f70-4517-bd76-d3a7da87a561"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.925, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/93456a00-69c3-4e72-8b56-0f027e786495"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ad202833-45b4-4dcc-987c-f352f4f94efe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=da63d0dd-be11-43b8-a14f-8defea5fe519"], "isController": false}, {"data": [0.8809523809523809, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.4, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.225, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c38c6f7c-c8c0-47da-bcfa-c5637ad33d38"], "isController": false}, {"data": [0.3275862068965517, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/73226e73-de73-4608-8299-dcfbfa5ccb5f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8ec3a113-ca6f-4b21-b3e8-403b13d8cf2c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9801136363636364, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a8a141a9-40fc-4ab8-9473-e4906775e328"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d659a12b-e738-4771-88bd-393eda34f05f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2a24cf71-c608-43e2-a658-a6bdd4a378bc"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c38c6f7c-c8c0-47da-bcfa-c5637ad33d38"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=431eaf30-cb6c-403b-96bf-07991d78152c"], "isController": false}, {"data": [0.868421052631579, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9bf4dd5c-387b-4e61-b32c-b7ecdcf2804e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4454c0e0-7c61-40cc-ab90-a14f5f201d7a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/396374eb-79b8-4706-adce-5b2621742464"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d3bc75b9-4be4-455d-9646-ebaf6bfed0a4"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1319, 2, 0.1516300227445034, 392.1827141774067, 100, 2519, 130.0, 1084.0, 1328.0, 1798.1999999999994, 5.119367822114583, 727.7117060783274, 3.7354333378452855], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 60, 0, 0.0, 1794.366666666667, 1328, 2376, 1779.0, 2222.7999999999997, 2295.0499999999997, 2376.0, 0.2667959144652298, 321.0448903927347, 1.3118334270824534], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/8ec3a113-ca6f-4b21-b3e8-403b13d8cf2c", 3, 0, 0.0, 314.6666666666667, 230, 479, 235.0, 479.0, 479.0, 479.0, 0.06682258603407952, 0.030235480008909677, 0.04285172346586479], "isController": false}, {"data": ["deleteBook", 13, 0, 0.0, 593.4615384615385, 422, 1183, 490.0, 1132.6, 1183.0, 1183.0, 0.0757072807109496, 0.013677584894068043, 0.05145729235822356], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 0, 0.0, 593.4615384615385, 422, 1183, 490.0, 1132.6, 1183.0, 1183.0, 0.07551466146196385, 0.01364278551803058, 0.051326371462428556], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=27a7b25e-5f70-4517-bd76-d3a7da87a561", 1, 0, 0.0, 450.0, 450, 450, 450.0, 450.0, 450.0, 450.0, 2.2222222222222223, 0.4014756944444444, 1.5321180555555556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 132.99999999999997, 103, 322, 111.0, 322.0, 322.0, 322.0, 0.08205951138119834, 0.02195733019379721, 0.04679956508458968], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 114.0, 105, 121, 115.0, 120.1, 121.0, 121.0, 0.08205726685479055, 0.06098201179345274, 0.041188901526721035], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 145.94444444444443, 104, 332, 112.0, 328.4, 332.0, 332.0, 0.08205876319208588, 0.0221174010166169, 0.04832171309065214], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 132.38888888888889, 100, 322, 111.5, 311.20000000000005, 322.0, 322.0, 0.08205913728493668, 0.022117501846330587, 0.04824179750540222], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fb2cb5d1-7181-4865-bbef-2b8857cfd121", 1, 0, 0.0, 447.0, 447, 447, 447.0, 447.0, 447.0, 447.0, 2.237136465324385, 0.4041701621923937, 1.5424007270693512], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/da63d0dd-be11-43b8-a14f-8defea5fe519", 3, 0, 0.0, 397.3333333333333, 233, 528, 431.0, 528.0, 528.0, 528.0, 0.07587253414264036, 0.03433034585230147, 0.04865523836621143], "isController": false}, {"data": ["goToProfile", 13, 0, 0.0, 307.46153846153845, 202, 900, 230.0, 727.5999999999999, 900.0, 900.0, 0.07663874265299746, 0.17357708015233422, 0.0495457496448089], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 112.1, 106, 117, 112.5, 116.0, 116.95, 117.0, 0.14089964422839832, 0.10471155200958118, 0.07072501673183275], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 142.40000000000003, 104, 330, 112.0, 320.8, 329.6, 330.0, 0.14089765898539594, 0.05886329933003163, 0.07917237595722347], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 1, 0, 0.0, 636.0, 636, 636, 636.0, 636.0, 636.0, 636.0, 1.5723270440251573, 462.31635711477986, 0.8967177672955975], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 1, 0, 0.0, 1385.0, 1385, 1385, 1385.0, 1385.0, 1385.0, 1385.0, 0.7220216606498194, 649.676359431408, 0.41107287906137185], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 1, 0, 0.0, 323.0, 323, 323, 323.0, 323.0, 323.0, 323.0, 3.0959752321981426, 5.478424922600619, 1.7142753482972135], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 127.00000000000001, 106, 321, 110.0, 240.19999999999993, 321.0, 321.0, 0.07893091116629529, 0.05865861659917062, 0.039619617519019316], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 161.92307692307693, 103, 340, 111.0, 339.6, 340.0, 340.0, 0.07892755664570028, 0.03023817149136654, 0.044503473571411226], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 206.07692307692307, 105, 943, 110.0, 701.7999999999997, 943.0, 943.0, 0.07881845079303487, 5.475069922954964, 0.045815592866323904], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 202.15384615384616, 104, 856, 112.0, 650.7999999999998, 856.0, 856.0, 0.0788170172002983, 1.802287986013011, 0.045891729290828735], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 1, 0, 0.0, 369.0, 369, 369, 369.0, 369.0, 369.0, 369.0, 2.710027100271003, 2.0139947493224932, 1.5217437330623307], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 811.375, 103, 1536, 1117.5, 1445.7, 1536.0, 1536.0, 0.1239109390125847, 69.69707466118102, 0.06619070667957405], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 256.74999999999994, 109, 1230, 112.5, 1059.6000000000015, 1225.0, 1230.0, 0.14089765898539594, 12.712174812606113, 0.08162157354505555], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 540.3125, 109, 1025, 656.5, 942.4000000000001, 1025.0, 1025.0, 0.1239109390125847, 22.78373063891578, 0.06631171345595353], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 209.55, 108, 896, 114.0, 595.3000000000006, 882.3999999999999, 896.0, 0.1408986515999042, 4.1770671153114565, 0.08175974490299127], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e98a4185-1d34-422a-be10-e69f159a4160", 1, 0, 0.0, 448.0, 448, 448, 448.0, 448.0, 448.0, 448.0, 2.232142857142857, 0.7128034319196428, 1.3318743024553572], "isController": false}, {"data": ["deleteBooks", 12, 0, 0.0, 579.9166666666667, 199, 1525, 460.5, 1323.7000000000007, 1525.0, 1525.0, 0.07403477166442506, 0.013375422615154916, 0.0510435046826993], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=93456a00-69c3-4e72-8b56-0f027e786495", 1, 0, 0.0, 451.0, 451, 451, 451.0, 451.0, 451.0, 451.0, 2.2172949002217295, 0.4005855044345898, 1.5287208980044344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 356.46153846153845, 218, 1050, 228.0, 894.7999999999998, 1050.0, 1050.0, 0.07876639704323063, 7.361297297706686, 0.17559723295161928], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ad202833-45b4-4dcc-987c-f352f4f94efe", 1, 0, 0.0, 515.0, 515, 515, 515.0, 515.0, 515.0, 515.0, 1.941747572815534, 0.3508040048543689, 1.338743932038835], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/431eaf30-cb6c-403b-96bf-07991d78152c", 3, 0, 0.0, 621.3333333333334, 420, 900, 544.0, 900.0, 900.0, 900.0, 0.07560864962951762, 0.03554000327637482, 0.048486015550178944], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 898.65, 172, 1992, 682.5, 1744.9, 1979.8999999999999, 1992.0, 0.08320125134682026, 0.05110701864956049, 0.03761931579450955], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 112.5625, 100, 119, 114.5, 116.9, 119.0, 119.0, 0.12390422203636589, 0.0920811650094477, 0.06219411145184772], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 211.93749999999997, 105, 346, 129.0, 343.2, 346.0, 346.0, 0.12391189864006691, 0.1494747781202565, 0.0641643400916948], "isController": false}, {"data": ["login", 20, 0, 0.0, 2860.3000000000006, 1560, 4434, 2609.5, 4326.900000000001, 4428.9, 4434.0, 0.08468906410115262, 5.187424342230625, 0.1347995171664733], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 126.7, 108, 327, 116.0, 123.0, 316.79999999999984, 327.0, 0.14246536310859423, 0.1153357285322506, 0.05064198454250811], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fb2cb5d1-7181-4865-bbef-2b8857cfd121", 3, 0, 0.0, 617.3333333333334, 207, 1236, 409.0, 1236.0, 1236.0, 1236.0, 0.023297170946874685, 0.02336542437738311, 0.014939917566843468], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0fde393e-9c09-4d1c-a82c-47ccbc4b18a7", 1, 0, 0.0, 237.0, 237, 237, 237.0, 237.0, 237.0, 237.0, 4.219409282700422, 1.3474090189873418, 2.517635812236287], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9bf4dd5c-387b-4e61-b32c-b7ecdcf2804e", 3, 0, 0.0, 338.3333333333333, 202, 446, 367.0, 446.0, 446.0, 446.0, 0.034403669724770644, 0.02834495054472477, 0.022062249139908258], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 927.4375000000002, 228, 1649, 1233.5, 1561.5, 1649.0, 1649.0, 0.12379589152385005, 92.63627521857711, 0.2586233993578088], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d659a12b-e738-4771-88bd-393eda34f05f", 3, 0, 0.0, 412.0, 203, 824, 209.0, 824.0, 824.0, 824.0, 0.024224219374530658, 0.02863220720993516, 0.015534411512963994], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 286.05555555555554, 214, 444, 230.5, 438.6, 444.0, 444.0, 0.08201464417035352, 0.12710667997885844, 0.1844528569573478], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 1, 0, 0.0, 1754.0, 1754, 1754, 1754.0, 1754.0, 1754.0, 1754.0, 0.5701254275940707, 682.0682190706956, 1.2855660276510832], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d3bc75b9-4be4-455d-9646-ebaf6bfed0a4", 1, 0, 0.0, 470.0, 470, 470, 470.0, 470.0, 470.0, 470.0, 2.127659574468085, 0.38439162234042556, 1.4669215425531916], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f0424b8d-39fb-4857-881e-c0d35eead6e2", 3, 0, 0.0, 424.0, 378, 463, 431.0, 463.0, 463.0, 463.0, 0.019097211170595388, 0.0263270473006092, 0.01224658398635186], "isController": false}, {"data": ["register", 21, 1, 4.761904761904762, 1334.047619047619, 869, 2098, 1128.0, 2048.2, 2093.4, 2098.0, 0.08930469912821604, 0.028804752285775035, 0.04029176855198809], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f0424b8d-39fb-4857-881e-c0d35eead6e2", 1, 0, 0.0, 836.0, 836, 836, 836.0, 836.0, 836.0, 836.0, 1.1961722488038278, 0.2161053379186603, 0.8247046949760766], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/27a7b25e-5f70-4517-bd76-d3a7da87a561", 3, 0, 0.0, 332.6666666666667, 235, 440, 323.0, 440.0, 440.0, 440.0, 0.017361613472612055, 0.023934385760583352, 0.01113358676466333], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 118.42105263157895, 109, 142, 117.0, 130.0, 142.0, 142.0, 0.09272091979152433, 0.07198547972095884, 0.03295938945714341], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 415.09999999999997, 226, 1343, 231.5, 1166.9000000000015, 1337.6999999999998, 1343.0, 0.1407826105319471, 17.038861609813956, 0.31302133560462614], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/93456a00-69c3-4e72-8b56-0f027e786495", 3, 0, 0.0, 318.6666666666667, 222, 418, 316.0, 418.0, 418.0, 418.0, 0.024372608437797042, 0.02444401256407965, 0.015629569864082087], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ad202833-45b4-4dcc-987c-f352f4f94efe", 3, 0, 0.0, 347.3333333333333, 215, 422, 405.0, 422.0, 422.0, 422.0, 0.03688494356603634, 0.030749459789264022, 0.023653430607126172], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=da63d0dd-be11-43b8-a14f-8defea5fe519", 1, 0, 0.0, 208.0, 208, 208, 208.0, 208.0, 208.0, 208.0, 4.807692307692308, 0.8685772235576924, 3.3146784855769234], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 21, 0, 0.0, 440.095238095238, 223, 1296, 436.0, 758.2, 1243.7999999999993, 1296.0, 0.10054389459169602, 5.876281934656044, 0.22490057076614448], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 6, 0, 0.0, 185.66666666666666, 108, 333, 117.0, 333.0, 333.0, 333.0, 0.03562924210663832, 0.026478372307765393, 0.017884209416808686], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 6, 0, 0.0, 182.66666666666666, 106, 338, 115.0, 338.0, 338.0, 338.0, 0.03558085749866572, 0.009520659135385162, 0.020292207792207792], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 6, 0, 0.0, 186.66666666666669, 107, 340, 117.0, 340.0, 340.0, 340.0, 0.035629453681710214, 0.009603251187648456, 0.02094622179334917], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 6, 0, 0.0, 143.5, 104, 316, 108.5, 316.0, 316.0, 316.0, 0.03563030000712606, 0.009603479298795696, 0.020981514554977553], "isController": false}, {"data": ["https://demoqa.com/books", 60, 0, 0.0, 1223.3, 849, 1885, 1158.5, 1772.3999999999999, 1836.1499999999999, 1885.0, 0.2543019411714843, 304.2335313003306, 0.5021469971179113], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 1, 4.761904761904762, 1334.047619047619, 869, 2098, 1128.0, 2048.2, 2093.4, 2098.0, 0.08695868220328455, 0.0280480570945862, 0.039233311697185025], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 109.2, 101, 115, 108.0, 115.0, 115.0, 115.0, 0.024584158951338114, 0.006626199092352851, 0.014476804538727425], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 111.4, 109, 114, 112.0, 114.0, 114.0, 114.0, 0.024584400706063988, 0.0066262642528063095, 0.014452938696338399], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 328.8947368421053, 106, 1283, 113.0, 1156.0, 1283.0, 1283.0, 0.09213997517070142, 13.111604658585021, 0.05291797299328833], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 308.5789473684211, 105, 894, 322.0, 817.0, 894.0, 894.0, 0.09213774107355018, 4.298526811476483, 0.05300666816592552], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 110.6, 108, 115, 110.0, 115.0, 115.0, 115.0, 0.02458452158520995, 0.006578280189792507, 0.01402085996656505], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 135.6315789473684, 106, 332, 115.0, 327.0, 332.0, 332.0, 0.09213506029997236, 0.06847146571120993, 0.046247481439634565], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 113.4, 110, 118, 113.0, 118.0, 118.0, 118.0, 0.02458343371568767, 0.01826952447034992, 0.012339731376819789], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 192.05263157894737, 106, 466, 114.0, 419.0, 466.0, 466.0, 0.09213550708473557, 0.04650342719840169, 0.051324250914081215], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 119.0, 113, 130, 116.0, 130.0, 130.0, 130.0, 0.023569341001225607, 0.018551649264636563, 0.008378164184029415], "isController": false}, {"data": ["deleteAccount", 12, 0, 0.0, 500.41666666666663, 409, 824, 471.0, 742.4000000000003, 824.0, 824.0, 0.07573319196470833, 0.013682266126436565, 0.051548862108790734], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1512.9500000000003, 959, 2519, 1530.0, 2054.8, 2496.2499999999995, 2519.0, 0.0850408834046968, 0.04401530098094659, 0.039115484456652534], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 226.8, 222, 236, 224.0, 236.0, 236.0, 236.0, 0.02456954163063134, 0.03807799078887884, 0.05525747497592185], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c38c6f7c-c8c0-47da-bcfa-c5637ad33d38", 1, 0, 0.0, 1525.0, 1525, 1525, 1525.0, 1525.0, 1525.0, 1525.0, 0.6557377049180327, 0.11846823770491804, 0.4521004098360656], "isController": false}, {"data": ["addBook", 58, 1, 1.7241379310344827, 1220.2241379310344, 577, 3900, 938.0, 1919.3, 2109.0499999999997, 3900.0, 0.2690416550700436, 95.34505208333333, 0.9771513910149364], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/73226e73-de73-4608-8299-dcfbfa5ccb5f", 1, 0, 0.0, 242.0, 242, 242, 242.0, 242.0, 242.0, 242.0, 4.132231404958678, 1.3195699896694215, 2.46561854338843], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8ec3a113-ca6f-4b21-b3e8-403b13d8cf2c", 1, 0, 0.0, 306.0, 306, 306, 306.0, 306.0, 306.0, 306.0, 3.2679738562091503, 0.5904054330065359, 2.2531147875816995], "isController": false}, {"data": ["https://demoqa.com/books-0", 60, 0, 0.0, 200.06666666666666, 108, 464, 115.5, 451.9, 458.75, 464.0, 0.2554506788601791, 0.18984176427011357, 0.12348445901932485], "isController": false}, {"data": ["https://demoqa.com/books-3", 60, 0, 0.0, 693.0000000000001, 523, 1045, 652.5, 908.9, 980.1999999999999, 1045.0, 0.2552528918025534, 75.05282538362383, 0.12837425710772948], "isController": false}, {"data": ["https://demoqa.com/books-1", 60, 0, 0.0, 171.14999999999995, 104, 472, 115.0, 334.6, 342.79999999999995, 472.0, 0.2558689950745218, 0.4527681826904625, 0.12443628862022645], "isController": false}, {"data": ["https://demoqa.com/books-2", 60, 0, 0.0, 1020.8333333333335, 740, 1439, 1009.5, 1345.9, 1393.8, 1439.0, 0.25483658603920234, 229.3024080730107, 0.127916020726709], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 21, 0, 0.0, 118.38095238095238, 111, 136, 117.0, 127.0, 135.2, 136.0, 0.10110493247634868, 0.07553249350039719, 0.03593964396620206], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 1, 0.5681818181818182, 195.00568181818178, 102, 2408, 118.5, 330.50000000000006, 355.50000000000006, 1500.939999999988, 0.740189337067925, 1.6245156635734324, 0.3541839491414224], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 6, 0, 0.0, 117.0, 114, 120, 116.5, 120.0, 120.0, 120.0, 0.03771805752003772, 0.029209394153701086, 0.013407590759075909], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 120.05555555555556, 106, 156, 119.0, 129.90000000000003, 156.0, 156.0, 0.08572326624694016, 0.0695664396984446, 0.030471942298717008], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a8a141a9-40fc-4ab8-9473-e4906775e328", 1, 0, 0.0, 431.0, 431, 431, 431.0, 431.0, 431.0, 431.0, 2.320185614849188, 0.7409186484918794, 1.3844076276102089], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d659a12b-e738-4771-88bd-393eda34f05f", 1, 0, 0.0, 854.0, 854, 854, 854.0, 854.0, 854.0, 854.0, 1.17096018735363, 0.21155042447306793, 0.8073221604215457], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2a24cf71-c608-43e2-a658-a6bdd4a378bc", 2, 0, 0.0, 250.0, 242, 258, 250.0, 258.0, 258.0, 258.0, 0.021691973969631236, 0.024678857104121474, 0.01348334124186551], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c38c6f7c-c8c0-47da-bcfa-c5637ad33d38", 3, 0, 0.0, 553.0, 469, 638, 552.0, 638.0, 638.0, 638.0, 0.026850683349891255, 0.026929347461267888, 0.017218699934663337], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 6, 0, 0.0, 412.5, 226, 673, 343.5, 673.0, 673.0, 673.0, 0.035557873402118065, 0.055107758876134144, 0.07997049066902139], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=431eaf30-cb6c-403b-96bf-07991d78152c", 1, 0, 0.0, 199.0, 199, 199, 199.0, 199.0, 199.0, 199.0, 5.025125628140704, 0.9078596105527638, 3.4645885678391957], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 541.4736842105264, 215, 1488, 449.0, 1398.0, 1488.0, 1488.0, 0.09208370893793559, 17.514514543167873, 0.2033783437896808], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9bf4dd5c-387b-4e61-b32c-b7ecdcf2804e", 1, 0, 0.0, 698.0, 698, 698, 698.0, 698.0, 698.0, 698.0, 1.4326647564469914, 0.25883103510028654, 0.9877551934097422], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 142.46153846153842, 109, 351, 118.0, 292.59999999999997, 351.0, 351.0, 0.07967053170887162, 0.06605496232503126, 0.02832038431838796], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 129.5625, 107, 336, 116.5, 189.70000000000016, 336.0, 336.0, 0.13178486121406804, 0.10231344205584383, 0.04684539988468825], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4454c0e0-7c61-40cc-ab90-a14f5f201d7a", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 1.2621973814229248, 2.3584177371541504], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/396374eb-79b8-4706-adce-5b2621742464", 1, 0, 0.0, 192.0, 192, 192, 192.0, 192.0, 192.0, 192.0, 5.208333333333333, 1.6632080078125, 3.1077067057291665], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 21, 0, 0.0, 152.61904761904762, 107, 330, 113.0, 325.8, 329.7, 330.0, 0.10059928430794879, 0.07476177281088772, 0.05049612513113835], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 21, 0, 0.0, 174.61904761904762, 105, 373, 112.0, 340.4, 369.79999999999995, 373.0, 0.1006016939409037, 0.0341140044743801, 0.05697207165235887], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d3bc75b9-4be4-455d-9646-ebaf6bfed0a4", 3, 0, 0.0, 296.3333333333333, 201, 480, 208.0, 480.0, 480.0, 480.0, 0.019998933390219187, 0.02363806222001493, 0.01282483684203509], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 21, 0, 0.0, 229.9047619047619, 105, 1187, 112.0, 411.80000000000007, 1110.599999999999, 1187.0, 0.10060121200507798, 4.336354800414381, 0.05873082289396153], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 21, 0, 0.0, 235.0, 104, 895, 114.0, 429.20000000000005, 850.6999999999994, 895.0, 0.10059783858358243, 1.4343519014189086, 0.05882709357275619], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 1, 50.0, 0.0758150113722517], "isController": false}, {"data": ["401/Unauthorized", 1, 50.0, 0.0758150113722517], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1319, 2, "406/Not Acceptable", 1, "401/Unauthorized", 1, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 1, "406/Not Acceptable", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
