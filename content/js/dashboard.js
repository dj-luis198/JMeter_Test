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

    var data = {"OkPercent": 99.09638554216868, "KoPercent": 0.9036144578313253};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8081168831168831, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3879310344827586, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2bc81772-8d66-4416-874b-438bea4ac377"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=326ff16f-2acf-4bdf-ab6f-eb50e167c6eb"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/afb3a4a8-dfcb-44dd-a4ae-918d20f8632d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/af454240-b221-457a-87eb-0c080da908c9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/57907f41-c9b6-45fa-b96b-6a8e9e4cebb9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=852daaf0-d090-4bb6-bf0e-848c34ce8fda"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=840c97bd-c96c-406e-9b90-b7c539958aa3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/840c97bd-c96c-406e-9b90-b7c539958aa3"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5ddd42e1-1b14-4c18-b6a9-308fe3c34e01"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5703a7fb-8726-4e8f-ab3d-b98834b52f18"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=15a96d79-351f-45d9-86da-23b98b2a20cf"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=09f1cd79-9847-4b3e-b356-cc2fa240f12e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c61e20a6-5521-4076-93f6-a83c22c07283"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b3beb376-e5d9-4b49-94cb-9252bb4ecf63"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b37c3d55-4053-4e80-8ae2-1a53b3989fbe"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.4, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.1590909090909091, 500, 1500, "register"], "isController": true}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b37c3d55-4053-4e80-8ae2-1a53b3989fbe"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/326ff16f-2acf-4bdf-ab6f-eb50e167c6eb"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=57907f41-c9b6-45fa-b96b-6a8e9e4cebb9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.1590909090909091, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5416666666666666, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.07142857142857142, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c61e20a6-5521-4076-93f6-a83c22c07283"], "isController": false}, {"data": [0.4083333333333333, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8103448275862069, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8c5aede3-2a75-4890-a93a-c1dd3de702c2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=afb3a4a8-dfcb-44dd-a4ae-918d20f8632d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9606741573033708, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/852daaf0-d090-4bb6-bf0e-848c34ce8fda"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/abe8aa6f-bbbf-474b-8003-5174ea826153"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5ddd42e1-1b14-4c18-b6a9-308fe3c34e01"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2bc81772-8d66-4416-874b-438bea4ac377"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/09f1cd79-9847-4b3e-b356-cc2fa240f12e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/15a96d79-351f-45d9-86da-23b98b2a20cf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/622b02f3-62d7-4f11-babe-75e808e06301"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b3beb376-e5d9-4b49-94cb-9252bb4ecf63"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1328, 12, 0.9036144578313253, 330.2688253012046, 78, 4220, 100.0, 897.2000000000003, 1090.1, 1906.71, 5.1580627745561465, 737.5600394331568, 3.7679591824101513], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 1341.5862068965514, 974, 1791, 1303.5, 1644.7, 1739.6499999999999, 1791.0, 0.25036907855545676, 301.27816888203733, 1.2310628032487547], "isController": true}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 865.4615384615383, 84, 1797, 917.0, 1665.0, 1797.0, 1797.0, 0.06697751101264846, 0.012689098766068163, 0.045277240204539014], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 865.4615384615383, 84, 1797, 917.0, 1665.0, 1797.0, 1797.0, 0.06812096186798158, 0.012905729103894948, 0.04605022054161405], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 124.73684210526316, 80, 249, 81.0, 248.0, 249.0, 249.0, 0.11539839778435076, 0.0400003492319933, 0.06530306124618122], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 112.89473684210527, 80, 256, 84.0, 246.0, 256.0, 256.0, 0.11538718473488276, 0.08575160896801345, 0.057918957962626694], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 162.8421052631579, 80, 483, 84.0, 249.0, 483.0, 483.0, 0.1152835672376237, 1.8135001039068994, 0.06736527939579276], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 186.6315789473684, 80, 959, 84.0, 243.0, 959.0, 959.0, 0.11539629517157607, 5.494402188354084, 0.06731845961129669], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2bc81772-8d66-4416-874b-438bea4ac377", 3, 0, 0.0, 402.0, 216, 547, 443.0, 547.0, 547.0, 547.0, 0.03178538507994025, 0.026498167704989247, 0.020383205926914807], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=326ff16f-2acf-4bdf-ab6f-eb50e167c6eb", 1, 0, 0.0, 916.0, 916, 916, 916.0, 916.0, 916.0, 916.0, 1.0917030567685588, 0.19723150927947597, 0.7526780840611353], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 403.38461538461536, 83, 1329, 361.0, 992.1999999999997, 1329.0, 1329.0, 0.06684526349888677, 0.15039682144344632, 0.04320939696573923], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/afb3a4a8-dfcb-44dd-a4ae-918d20f8632d", 3, 0, 0.0, 313.0, 202, 486, 251.0, 486.0, 486.0, 486.0, 0.020604961674771285, 0.02435436713577296, 0.0132134682614907], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/af454240-b221-457a-87eb-0c080da908c9", 1, 0, 0.0, 272.0, 272, 272, 272.0, 272.0, 272.0, 272.0, 3.676470588235294, 1.174029181985294, 2.193675321691176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 91.00000000000003, 80, 236, 83.0, 87.0, 236.0, 236.0, 0.09290635528368221, 0.06904466442468962, 0.04663463536700455], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 98.36842105263158, 79, 247, 81.0, 239.0, 247.0, 247.0, 0.09290862681049575, 0.03220475838867101, 0.052576273703924654], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 592.75, 469, 636, 633.0, 636.0, 636.0, 636.0, 0.14305128388527288, 42.06182721193048, 0.08158393534081969], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 874.75, 796, 944, 879.5, 944.0, 944.0, 944.0, 0.14095426034251884, 126.83089122735922, 0.08025032595672704], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 164.25, 80, 253, 162.0, 253.0, 253.0, 253.0, 0.14421170277968057, 0.2551871146843567, 0.0798515971446083], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/57907f41-c9b6-45fa-b96b-6a8e9e4cebb9", 3, 0, 0.0, 688.3333333333333, 207, 1629, 229.0, 1629.0, 1629.0, 1629.0, 0.025045081146062912, 0.02511845540723302, 0.016060810500567686], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 82.72727272727273, 81, 85, 83.0, 85.0, 85.0, 85.0, 0.05134452644009727, 0.038157406856361355, 0.02577254549825195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 112.54545454545455, 81, 248, 82.0, 246.20000000000002, 248.0, 248.0, 0.051344766101251875, 0.034770763123255444, 0.028106518801519806], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 312.99999999999994, 80, 962, 83.0, 957.2, 962.0, 962.0, 0.051344766101251875, 12.610094957185467, 0.028981713678245688], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 242.36363636363637, 78, 730, 83.0, 712.0, 730.0, 730.0, 0.051345005764643833, 4.127465654275405, 0.02903199056418826], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=852daaf0-d090-4bb6-bf0e-848c34ce8fda", 1, 0, 0.0, 434.0, 434, 434, 434.0, 434.0, 434.0, 434.0, 2.304147465437788, 0.4162766417050691, 1.5886016705069124], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 81.75, 80, 85, 81.0, 85.0, 85.0, 85.0, 0.14504315033722534, 0.10779085684241062, 0.08144512836318805], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 127.1052631578947, 80, 626, 82.0, 240.0, 626.0, 626.0, 0.09290862681049575, 4.423689354199469, 0.05419988251948636], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 622.0, 81, 963, 866.0, 961.8, 963.0, 963.0, 0.06553022690933238, 39.315363056570064, 0.03477027013743873], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 131.8421052631579, 79, 702, 82.0, 244.0, 702.0, 702.0, 0.09290908112918764, 1.4615320493542818, 0.05429087907883091], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 418.6666666666667, 82, 636, 482.0, 636.0, 636.0, 636.0, 0.06548416811095638, 12.842229812322374, 0.034809780769919196], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 572.2307692307693, 92, 1109, 532.0, 1031.8, 1109.0, 1109.0, 0.06842357350007632, 0.012963059823256646, 0.04679962715731632], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=840c97bd-c96c-406e-9b90-b7c539958aa3", 1, 0, 0.0, 771.0, 771, 771, 771.0, 771.0, 771.0, 771.0, 1.297016861219196, 0.23432433527885863, 0.8942323281452659], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/840c97bd-c96c-406e-9b90-b7c539958aa3", 3, 0, 0.0, 815.6666666666666, 487, 1183, 777.0, 1183.0, 1183.0, 1183.0, 0.0257935825566599, 0.025869149693056367, 0.01654080652233724], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 425.0, 162, 1046, 168.0, 1040.6, 1046.0, 1046.0, 0.05132464236056028, 16.803881105299503, 0.11184889879480407], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5ddd42e1-1b14-4c18-b6a9-308fe3c34e01", 1, 0, 0.0, 425.0, 425, 425, 425.0, 425.0, 425.0, 425.0, 2.352941176470588, 0.4250919117647059, 1.6222426470588236], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 780.1428571428571, 123, 1447, 907.0, 1171.2, 1420.8999999999996, 1447.0, 0.09599824460352725, 0.05896767173400258, 0.04340545630022766], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 82.8, 81, 85, 82.0, 84.4, 85.0, 85.0, 0.06552936807846049, 0.04869907139424652, 0.03289267108625849], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 168.4, 80, 246, 239.0, 244.2, 246.0, 246.0, 0.06548445399062262, 0.08309192762221582, 0.03368015537278116], "isController": false}, {"data": ["login", 21, 0, 0.0, 3133.0952380952376, 1922, 5592, 2999.0, 4462.0, 5482.799999999998, 5592.0, 0.09551793462934494, 21.899023400188305, 0.17428558412628378], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/5703a7fb-8726-4e8f-ab3d-b98834b52f18", 1, 0, 0.0, 403.0, 403, 403, 403.0, 403.0, 403.0, 403.0, 2.4813895781637716, 0.7923968672456575, 1.480594758064516], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 113.94736842105263, 83, 246, 87.0, 246.0, 246.0, 246.0, 0.09307930846972717, 0.07535424484512093, 0.03308678543259833], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=15a96d79-351f-45d9-86da-23b98b2a20cf", 1, 0, 0.0, 449.0, 449, 449, 449.0, 449.0, 449.0, 449.0, 2.2271714922048997, 0.40236984966592426, 1.5355303452115812], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=09f1cd79-9847-4b3e-b356-cc2fa240f12e", 1, 0, 0.0, 534.0, 534, 534, 534.0, 534.0, 534.0, 534.0, 1.8726591760299625, 0.33832221441947563, 1.2911107209737827], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c61e20a6-5521-4076-93f6-a83c22c07283", 1, 0, 0.0, 473.0, 473, 473, 473.0, 473.0, 473.0, 473.0, 2.1141649048625792, 0.3819536205073996, 1.457617600422833], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b3beb376-e5d9-4b49-94cb-9252bb4ecf63", 3, 0, 0.0, 424.33333333333337, 262, 720, 291.0, 720.0, 720.0, 720.0, 0.08155276463872126, 0.0369005022291089, 0.05229783409449247], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 716.8666666666667, 164, 1048, 951.0, 1046.8, 1048.0, 1048.0, 0.0654598774591094, 52.24233065938826, 0.1360551163985721], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b37c3d55-4053-4e80-8ae2-1a53b3989fbe", 3, 0, 0.0, 902.0, 316, 1905, 485.0, 1905.0, 1905.0, 1905.0, 0.020801120487023567, 0.024586220211062035, 0.013339260208149878], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 344.0526315789474, 165, 1060, 326.0, 506.0, 1060.0, 1060.0, 0.11521505800168579, 7.423755772122807, 0.257569847233929], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 1, 20.0, 782.4, 83, 1026, 955.0, 1026.0, 1026.0, 1026.0, 0.12755427434373326, 122.08623187134876, 0.24656340882420472], "isController": false}, {"data": ["register", 22, 5, 22.727272727272727, 1477.4545454545455, 602, 3400, 1463.0, 2230.0, 3234.399999999998, 3400.0, 0.09293366226217431, 0.029388290569767835, 0.041929054653441926], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 249.5789473684211, 163, 783, 167.0, 481.0, 783.0, 783.0, 0.09286911808552757, 5.983919666379913, 0.2076142213779822], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 21, 0, 0.0, 101.14285714285712, 82, 246, 85.0, 183.40000000000006, 241.69999999999993, 246.0, 0.1084380276671882, 0.08418772655802209, 0.038546330147320805], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b37c3d55-4053-4e80-8ae2-1a53b3989fbe", 1, 0, 0.0, 786.0, 786, 786, 786.0, 786.0, 786.0, 786.0, 1.272264631043257, 0.22985249681933842, 0.8771668256997455], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 288.4117647058824, 164, 794, 322.0, 427.5999999999997, 794.0, 794.0, 0.09893902446121881, 7.106991096942783, 0.22102709801656353], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/326ff16f-2acf-4bdf-ab6f-eb50e167c6eb", 3, 0, 0.0, 961.3333333333334, 370, 2122, 392.0, 2122.0, 2122.0, 2122.0, 0.05016051364365971, 0.03179118491673355, 0.03216673563737293], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=57907f41-c9b6-45fa-b96b-6a8e9e4cebb9", 1, 0, 0.0, 624.0, 624, 624, 624.0, 624.0, 624.0, 624.0, 1.6025641025641024, 0.2895257411858974, 1.104892828525641], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 4, 0, 0.0, 82.0, 81, 84, 81.5, 84.0, 84.0, 84.0, 0.20560267283474687, 0.15279651760472887, 0.1032029041377538], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 4, 0, 0.0, 82.5, 81, 84, 82.5, 84.0, 84.0, 84.0, 0.20559210526315788, 0.055011950041118425, 0.11725174753289475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 4, 0, 0.0, 81.25, 79, 83, 81.5, 83.0, 83.0, 83.0, 0.20559210526315788, 0.05541349712171053, 0.12086567125822369], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 4, 0, 0.0, 119.75, 79, 237, 81.5, 237.0, 237.0, 237.0, 0.20561324149275215, 0.055419193996093345, 0.12107889123059525], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 92.0, 92, 92, 92.0, 92.0, 92.0, 92.0, 10.869565217391305, 3.205672554347826, 6.719174592391305], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 923.3620689655174, 637, 1440, 862.0, 1294.2, 1377.15, 1440.0, 0.25173829633937794, 301.16652081398274, 0.4970847999982639], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, 22.727272727272727, 1477.4545454545455, 602, 3400, 1463.0, 2230.0, 3234.399999999998, 3400.0, 0.09246494737903904, 0.0292400694747991, 0.04171758368077738], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 12, 0, 0.0, 109.41666666666667, 80, 244, 82.5, 244.0, 244.0, 244.0, 0.0664510698622248, 0.017910639923802773, 0.03913085461613432], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 12, 0, 0.0, 108.24999999999999, 80, 244, 82.0, 241.9, 244.0, 244.0, 0.06645070188553867, 0.017910540742586592, 0.039065744663178005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 21, 0, 0.0, 127.7142857142857, 79, 872, 82.0, 210.0000000000001, 808.6999999999991, 872.0, 0.10851086917206207, 4.677295820329253, 0.06334846780069137], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 21, 0, 0.0, 124.66666666666667, 80, 474, 84.0, 244.4, 451.0999999999997, 474.0, 0.10851086917206207, 1.5471780876509464, 0.06345443544636721], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 12, 0, 0.0, 97.5, 80, 240, 82.5, 201.00000000000014, 240.0, 240.0, 0.06645033391292791, 0.017780655754045162, 0.0378974560597167], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 21, 0, 0.0, 83.09523809523809, 81, 90, 82.0, 87.8, 89.8, 90.0, 0.10851142987061305, 0.08064179505032863, 0.054467651321772566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 12, 0, 0.0, 111.41666666666666, 81, 246, 83.5, 244.5, 246.0, 246.0, 0.0664510698622248, 0.04938404703628228, 0.03335532217693705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 21, 0, 0.0, 97.14285714285714, 80, 247, 81.0, 211.2000000000001, 246.39999999999998, 247.0, 0.10851255128509865, 0.03679657384537478, 0.06145209493814784], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 12, 0, 0.0, 86.91666666666667, 83, 99, 85.0, 97.2, 99.0, 99.0, 0.06777631556652527, 0.05334737338537048, 0.024092362174038283], "isController": false}, {"data": ["deleteAccount", 12, 0, 0.0, 938.3333333333333, 449, 2122, 647.5, 2056.9, 2122.0, 2122.0, 0.07225346515576643, 0.013053604544742959, 0.04918033712262618], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1910.1428571428569, 1247, 4220, 1778.0, 2379.0, 4036.3999999999974, 4220.0, 0.09789981585510828, 0.050670803128132214, 0.04503009108179297], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 12, 0, 0.0, 235.16666666666666, 163, 490, 168.5, 488.8, 490.0, 490.0, 0.06641980638626438, 0.10293772728027498, 0.14937970127692077], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c61e20a6-5521-4076-93f6-a83c22c07283", 3, 0, 0.0, 337.0, 193, 464, 354.0, 464.0, 464.0, 464.0, 0.023504156318308954, 0.027781117054615823, 0.015072652326519739], "isController": false}, {"data": ["addBook", 60, 4, 6.666666666666667, 966.3999999999997, 423, 2037, 799.5, 1585.1999999999998, 1817.7499999999995, 2037.0, 0.2718129926610492, 93.2027020618148, 0.9868660882146416], "isController": true}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 141.39655172413785, 80, 424, 83.5, 324.6, 337.1, 424.0, 0.2524549063305244, 0.18761541378664948, 0.12203630725938436], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 516.551724137931, 395, 803, 479.0, 647.0, 725.3499999999999, 803.0, 0.2524274379920703, 74.22204814944574, 0.12695325250577755], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8c5aede3-2a75-4890-a93a-c1dd3de702c2", 1, 0, 0.0, 231.0, 231, 231, 231.0, 231.0, 231.0, 231.0, 4.329004329004329, 1.3824066558441557, 2.58302895021645], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 117.93103448275865, 79, 361, 83.0, 244.1, 252.79999999999973, 361.0, 0.25277838308999784, 0.4472992482022227, 0.12293323708869035], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=afb3a4a8-dfcb-44dd-a4ae-918d20f8632d", 1, 0, 0.0, 532.0, 532, 532, 532.0, 532.0, 532.0, 532.0, 1.8796992481203008, 0.339594102443609, 1.2959645206766917], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 778.5344827586207, 553, 1114, 728.0, 962.7, 1039.35, 1114.0, 0.2521497943674953, 226.88482820393267, 0.12656737725087167], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 88.88235294117646, 83, 110, 86.0, 103.6, 110.0, 110.0, 0.09873617693522907, 0.07376286655805687, 0.03509762539494471], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 4, 2.247191011235955, 169.5898876404494, 81, 1205, 89.0, 374.69999999999993, 456.0, 876.3600000000033, 0.7396695588577508, 1.6262122542572555, 0.3553678180890762], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 4, 0, 0.0, 132.75, 83, 246, 101.0, 246.0, 246.0, 246.0, 0.16303904785196052, 0.12625973139316868, 0.057955286541126604], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/852daaf0-d090-4bb6-bf0e-848c34ce8fda", 3, 0, 0.0, 695.3333333333334, 262, 1329, 495.0, 1329.0, 1329.0, 1329.0, 0.02305705853418593, 0.027252662609905314, 0.01478593922927939], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 108.10526315789474, 84, 243, 88.0, 243.0, 243.0, 243.0, 0.10887253890760733, 0.08835261702365399, 0.038700785314813545], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/abe8aa6f-bbbf-474b-8003-5174ea826153", 1, 0, 0.0, 209.0, 209, 209, 209.0, 209.0, 209.0, 209.0, 4.784688995215311, 1.5279231459330145, 2.854926734449761], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 4, 0, 0.0, 203.75, 163, 318, 167.0, 318.0, 318.0, 318.0, 0.20473972462507037, 0.31730658494139324, 0.4604644392690792], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5ddd42e1-1b14-4c18-b6a9-308fe3c34e01", 3, 0, 0.0, 325.6666666666667, 195, 575, 207.0, 575.0, 575.0, 575.0, 0.04367893073977549, 0.028081343818703315, 0.028010251809035713], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2bc81772-8d66-4416-874b-438bea4ac377", 1, 0, 0.0, 1109.0, 1109, 1109, 1109.0, 1109.0, 1109.0, 1109.0, 0.9017132551848511, 0.1629071798917944, 0.6216890216411182], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 21, 0, 0.0, 235.33333333333331, 162, 953, 172.0, 325.6, 890.2999999999992, 953.0, 0.1084637911710474, 6.339159818813819, 0.2426161095200219], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/09f1cd79-9847-4b3e-b356-cc2fa240f12e", 3, 0, 0.0, 555.6666666666667, 215, 1091, 361.0, 1091.0, 1091.0, 1091.0, 0.018671114541064005, 0.02206862529251413, 0.011973338426398467], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/15a96d79-351f-45d9-86da-23b98b2a20cf", 3, 0, 0.0, 440.3333333333333, 373, 499, 449.0, 499.0, 499.0, 499.0, 0.020454917362133857, 0.02417701983786069, 0.013117248438607976], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/622b02f3-62d7-4f11-babe-75e808e06301", 1, 0, 0.0, 194.0, 194, 194, 194.0, 194.0, 194.0, 194.0, 5.154639175257732, 1.6460615335051545, 3.0756684922680413], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b3beb376-e5d9-4b49-94cb-9252bb4ecf63", 1, 0, 0.0, 294.0, 294, 294, 294.0, 294.0, 294.0, 294.0, 3.401360544217687, 0.6145036139455783, 2.345078656462585], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 101.81818181818183, 83, 245, 86.0, 217.0000000000001, 245.0, 245.0, 0.05333023048355975, 0.044216177422404516, 0.018957230367202878], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 87.80000000000001, 81, 118, 86.0, 101.20000000000002, 118.0, 118.0, 0.06856296594248938, 0.05323003703542877, 0.024371991799869274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 83.41176470588235, 80, 98, 83.0, 88.39999999999999, 98.0, 98.0, 0.09898684057295913, 0.07356346257424012, 0.04968675395947362], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 127.82352941176474, 80, 240, 82.0, 239.2, 240.0, 240.0, 0.09899663993757388, 0.03523570663219254, 0.055969952336029534], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 175.0, 79, 708, 84.0, 342.3999999999997, 708.0, 708.0, 0.09899721643120858, 5.264987932894446, 0.05769908995352954], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 162.23529411764707, 80, 477, 84.0, 297.79999999999984, 477.0, 477.0, 0.09899779293155758, 1.7373862435287473, 0.05779610349054571], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 41.666666666666664, 0.37650602409638556], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 8.333333333333334, 0.07530120481927711], "isController": false}, {"data": ["401/Unauthorized", 6, 50.0, 0.45180722891566266], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1328, 12, "401/Unauthorized", 6, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 1, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 1, "Test failed: code expected to contain /200/", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
