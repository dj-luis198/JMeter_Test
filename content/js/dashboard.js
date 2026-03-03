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

    var data = {"OkPercent": 99.54921111945906, "KoPercent": 0.4507888805409467};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8467011642949547, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bc66ee14-770d-4020-b634-2c248fc8e428"], "isController": false}, {"data": [0.49074074074074076, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/70346880-6a4a-4fa2-b4fe-50d3a54e72ee"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/283051c2-dbd8-4d1f-af01-4d5e85c0fe9c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5425266e-3235-48ec-bcbe-5788a3f64076"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7f0144a1-476c-4fc0-b28f-d8f0053864fc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c493a664-01e3-4ed6-9a8e-729bd9b7bc2c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/758144b4-2177-42c4-a262-9cc701eeb689"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ad2a1f05-1fa6-4b1d-9382-7cac61be6069"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.8095238095238095, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ad2a1f05-1fa6-4b1d-9382-7cac61be6069"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cea81f85-1cde-4b48-b422-bf16f56c9bb8"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.022727272727272728, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/fbbc2273-cfba-4ed1-af13-03f9d5b390c4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/02546268-7215-46d1-a769-ade336f24513"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f2d1000f-7026-4b1b-a7c9-c4cf7cd2103f"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9d846262-1947-48ee-96d8-b961f3976dc9"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=efc2dc39-df06-4b0a-aa90-9363bc25ebf6"], "isController": false}, {"data": [0.4090909090909091, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9bb882cf-f3dd-4180-9bdf-e884b419beec"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/339f0c34-4d4d-4334-be11-2f78319294fb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/9d846262-1947-48ee-96d8-b961f3976dc9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.4090909090909091, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c493a664-01e3-4ed6-9a8e-729bd9b7bc2c"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=283051c2-dbd8-4d1f-af01-4d5e85c0fe9c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=02546268-7215-46d1-a769-ade336f24513"], "isController": false}, {"data": [0.4090909090909091, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.4696969696969697, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=70346880-6a4a-4fa2-b4fe-50d3a54e72ee"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.978494623655914, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/9592996b-a2eb-422f-99d2-3be949e93bd4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e28a57fe-b060-4786-8e34-569076520b0b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f2d1000f-7026-4b1b-a7c9-c4cf7cd2103f"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7f0144a1-476c-4fc0-b28f-d8f0053864fc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=758144b4-2177-42c4-a262-9cc701eeb689"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fbbc2273-cfba-4ed1-af13-03f9d5b390c4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cea81f85-1cde-4b48-b422-bf16f56c9bb8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/efc2dc39-df06-4b0a-aa90-9363bc25ebf6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9bb882cf-f3dd-4180-9bdf-e884b419beec"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1331, 6, 0.4507888805409467, 274.14124718257045, 80, 2193, 97.0, 691.9999999999998, 832.7999999999997, 1309.8800000000042, 5.134258348473802, 704.7716578319139, 3.7440941925211875], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/bc66ee14-770d-4020-b634-2c248fc8e428", 1, 0, 0.0, 258.0, 258, 258, 258.0, 258.0, 258.0, 258.0, 3.875968992248062, 1.237736191860465, 2.3127119670542635], "isController": false}, {"data": ["see books", 54, 0, 0.0, 1213.5740740740741, 985, 1550, 1183.5, 1416.0, 1448.0, 1550.0, 0.24194849185440076, 291.14471582673576, 1.189658844225496], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/70346880-6a4a-4fa2-b4fe-50d3a54e72ee", 3, 0, 0.0, 446.3333333333333, 171, 776, 392.0, 776.0, 776.0, 776.0, 0.03280839895013123, 0.032904517306430445, 0.02103924021216098], "isController": false}, {"data": ["deleteBook", 13, 0, 0.0, 432.76923076923083, 362, 567, 403.0, 560.6, 567.0, 567.0, 0.0631659758900329, 0.011411821816070396, 0.042933124237756734], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 0, 0.0, 432.76923076923083, 362, 567, 403.0, 560.6, 567.0, 567.0, 0.06427815630469824, 0.011612752848016772, 0.04368905936334958], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 146.66666666666666, 82, 249, 84.5, 249.0, 249.0, 249.0, 0.10008173341562275, 0.03513068658849171, 0.05661090237582914], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/283051c2-dbd8-4d1f-af01-4d5e85c0fe9c", 3, 0, 0.0, 360.3333333333333, 192, 445, 444.0, 445.0, 445.0, 445.0, 0.09615076439857696, 0.043505716964199866, 0.061659181596743697], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 102.16666666666664, 82, 248, 84.0, 247.1, 248.0, 248.0, 0.10017140440308973, 0.07444378784253054, 0.05028134947576965], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5425266e-3235-48ec-bcbe-5788a3f64076", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 1.2621973814229248, 2.3584177371541504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 146.83333333333334, 81, 415, 84.0, 264.7000000000002, 415.0, 415.0, 0.1000806204998471, 1.6603109970531817, 0.05845637805454394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 129.11111111111111, 81, 749, 83.0, 296.3000000000007, 749.0, 749.0, 0.10017251933886137, 5.0330223666453335, 0.058412230786354276], "isController": false}, {"data": ["goToProfile", 13, 0, 0.0, 198.0769230769231, 166, 324, 186.0, 300.0, 324.0, 324.0, 0.06325910931174089, 0.16175456894999612, 0.04089602574645749], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7f0144a1-476c-4fc0-b28f-d8f0053864fc", 1, 0, 0.0, 441.0, 441, 441, 441.0, 441.0, 441.0, 441.0, 2.2675736961451247, 0.4096690759637188, 1.5633857709750567], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 12, 0, 0.0, 84.25, 82, 87, 84.0, 86.7, 87.0, 87.0, 0.058270247697111255, 0.04330435400146646, 0.029248932926089044], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 12, 0, 0.0, 83.5, 81, 86, 84.0, 85.7, 86.0, 86.0, 0.0582713795263508, 0.022885553189629638, 0.03282507235362958], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 409.75, 406, 412, 410.5, 412.0, 412.0, 412.0, 0.08350556355817206, 24.553408331767603, 0.04762426671677], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c493a664-01e3-4ed6-9a8e-729bd9b7bc2c", 3, 0, 0.0, 349.3333333333333, 264, 454, 330.0, 454.0, 454.0, 454.0, 0.018898352063700045, 0.02605290396802399, 0.012119060405432647], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/758144b4-2177-42c4-a262-9cc701eeb689", 3, 0, 0.0, 617.3333333333333, 173, 1495, 184.0, 1495.0, 1495.0, 1495.0, 0.026532002016432153, 0.03135992816460454, 0.017014337230589628], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 726.25, 566, 871, 734.0, 871.0, 871.0, 871.0, 0.0832275649695179, 74.88830925802625, 0.04738444372776263], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 206.5, 87, 249, 245.0, 249.0, 249.0, 249.0, 0.08406540288344333, 0.14875635744609306, 0.0465479330419066], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 96.92857142857143, 82, 247, 84.5, 172.0, 247.0, 247.0, 0.06868131868131869, 0.051041487809065936, 0.03447480254120879], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 117.78571428571428, 81, 247, 84.0, 245.0, 247.0, 247.0, 0.0686823295083817, 0.03311469458439832, 0.03834635640241958], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 235.64285714285717, 83, 747, 164.0, 740.0, 747.0, 747.0, 0.06862677816884148, 8.837353999593141, 0.039502523259575886], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 182.64285714285717, 82, 566, 85.0, 486.0, 566.0, 566.0, 0.06862711457296777, 2.8985190329949364, 0.03956973556502174], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ad2a1f05-1fa6-4b1d-9382-7cac61be6069", 1, 0, 0.0, 429.0, 429, 429, 429.0, 429.0, 429.0, 429.0, 2.331002331002331, 0.4211283508158508, 1.6071168414918415], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 83.25, 81, 85, 83.5, 85.0, 85.0, 85.0, 0.0840742375517582, 0.06248095193055468, 0.04720965487525485], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 21, 0, 0.0, 406.47619047619054, 82, 829, 252.0, 749.0, 820.9999999999999, 829.0, 0.10726763786445458, 45.97686299304804, 0.058671965985942834], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 12, 0, 0.0, 151.08333333333331, 82, 732, 83.5, 585.3000000000005, 732.0, 732.0, 0.05822614062583397, 4.380384591240363, 0.033813618123856706], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 21, 0, 0.0, 324.2380952380951, 82, 669, 245.0, 633.0, 666.6999999999999, 669.0, 0.10726763786445458, 15.034309681670516, 0.05877671953854484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 12, 0, 0.0, 124.91666666666666, 82, 414, 83.5, 365.1000000000002, 414.0, 414.0, 0.0582713795263508, 1.442207159003171, 0.03389679531692347], "isController": false}, {"data": ["deleteBooks", 13, 0, 0.0, 407.4615384615385, 163, 688, 397.0, 624.8, 688.0, 688.0, 0.06429913938074983, 0.011616543735779998, 0.044331242580868534], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/ad2a1f05-1fa6-4b1d-9382-7cac61be6069", 3, 0, 0.0, 413.33333333333337, 181, 842, 217.0, 842.0, 842.0, 842.0, 0.02216950805861618, 0.02620360799506359, 0.014216774373526652], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 352.21428571428567, 169, 981, 330.0, 906.5, 981.0, 981.0, 0.06859819586744868, 11.815024811722452, 0.15177159434456874], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cea81f85-1cde-4b48-b422-bf16f56c9bb8", 3, 0, 0.0, 264.3333333333333, 170, 432, 191.0, 432.0, 432.0, 432.0, 0.026385456336467338, 0.031186716132068006, 0.016920360997018442], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 551.3181818181819, 95, 1331, 413.0, 1080.3999999999999, 1302.9499999999996, 1331.0, 0.09676752481867085, 0.05944020811615622, 0.0437532851475045], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 21, 0, 0.0, 99.99999999999999, 81, 248, 84.0, 215.80000000000013, 247.9, 248.0, 0.10726161106939826, 0.07971297463262898, 0.05384030086881905], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 21, 0, 0.0, 114.61904761904762, 81, 252, 84.0, 249.8, 251.9, 252.0, 0.10726708994600889, 0.10542144154198996, 0.05688587675522161], "isController": false}, {"data": ["login", 22, 0, 0.0, 2261.4090909090905, 1488, 4566, 2085.0, 3185.2, 4374.449999999997, 4566.0, 0.09075945032776539, 19.86822991225211, 0.16430006672882314], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 12, 0, 0.0, 87.08333333333334, 84, 93, 86.5, 91.80000000000001, 93.0, 93.0, 0.05979490348105996, 0.04840817869706905, 0.021255219596783035], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fbbc2273-cfba-4ed1-af13-03f9d5b390c4", 3, 0, 0.0, 923.6666666666667, 187, 2193, 391.0, 2193.0, 2193.0, 2193.0, 0.0668851581833991, 0.030263792276993735, 0.04289184948609903], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/02546268-7215-46d1-a769-ade336f24513", 2, 0, 0.0, 200.5, 198, 203, 200.5, 203.0, 203.0, 203.0, 0.02001060562097912, 0.02849166308143316, 0.012438232888430868], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f2d1000f-7026-4b1b-a7c9-c4cf7cd2103f", 1, 0, 0.0, 688.0, 688, 688, 688.0, 688.0, 688.0, 688.0, 1.4534883720930232, 0.26259311409883723, 1.0021121002906979], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 21, 0, 0.0, 515.7619047619049, 166, 918, 495.0, 834.0, 909.5999999999999, 918.0, 0.10721561059290233, 61.16663048937545, 0.22806750722428995], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9d846262-1947-48ee-96d8-b961f3976dc9", 1, 0, 0.0, 507.0, 507, 507, 507.0, 507.0, 507.0, 507.0, 1.9723865877712032, 0.3563393737672584, 1.3598680966469427], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 305.3888888888889, 168, 834, 326.5, 529.8000000000005, 834.0, 834.0, 0.1000339003773501, 6.7950490773956735, 0.22355666364712487], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 0, 0.0, 810.0, 648, 956, 818.0, 956.0, 956.0, 956.0, 0.08308408109006314, 99.397445683782, 0.18734486644233966], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=efc2dc39-df06-4b0a-aa90-9363bc25ebf6", 1, 0, 0.0, 373.0, 373, 373, 373.0, 373.0, 373.0, 373.0, 2.680965147453083, 0.4843540549597855, 1.848399798927614], "isController": false}, {"data": ["register", 22, 4, 18.181818181818183, 920.409090909091, 200, 1859, 916.5, 1423.1999999999998, 1803.7999999999993, 1859.0, 0.09529873989075299, 0.030288484446812473, 0.04299611116164832], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9bb882cf-f3dd-4180-9bdf-e884b419beec", 1, 0, 0.0, 372.0, 372, 372, 372.0, 372.0, 372.0, 372.0, 2.688172043010753, 0.4856560819892473, 1.8533686155913978], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 93.27777777777779, 84, 159, 87.0, 130.20000000000005, 159.0, 159.0, 0.10235065333833715, 0.07946168887107229, 0.036382458803862025], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 12, 0, 0.0, 250.83333333333334, 167, 817, 170.5, 672.4000000000005, 817.0, 817.0, 0.05820128915855486, 5.885098567823902, 0.12965511795461268], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 279.59999999999997, 166, 505, 332.0, 408.4000000000001, 505.0, 505.0, 0.10069073846587591, 0.15605097846225105, 0.22645583074893771], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/339f0c34-4d4d-4334-be11-2f78319294fb", 1, 0, 0.0, 377.0, 377, 377, 377.0, 377.0, 377.0, 377.0, 2.6525198938992043, 0.8470449270557029, 1.5827047413793103], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 16, 0, 0.0, 114.8125, 82, 249, 84.0, 247.6, 249.0, 249.0, 0.1132126203768565, 0.08413555088553497, 0.05682742858760181], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9d846262-1947-48ee-96d8-b961f3976dc9", 3, 0, 0.0, 602.6666666666666, 166, 1007, 635.0, 1007.0, 1007.0, 1007.0, 0.03790606876160873, 0.024369949806047283, 0.024308253730588935], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 16, 0, 0.0, 103.625, 81, 246, 83.0, 243.9, 246.0, 246.0, 0.11321502363363618, 0.040921592404687096, 0.06397367485352806], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 16, 0, 0.0, 143.43750000000006, 80, 722, 83.0, 388.10000000000036, 722.0, 722.0, 0.11334816305133255, 6.4030712149683335, 0.06602751880871081], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 16, 0, 0.0, 154.99999999999997, 81, 573, 84.5, 345.5000000000002, 573.0, 573.0, 0.11334575413889106, 2.111604280750349, 0.06613680478319083], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 784.9444444444446, 645, 1204, 666.0, 1070.5, 1075.5, 1204.0, 0.2426617295490087, 290.3077914075279, 0.479162126121187], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 4, 18.181818181818183, 920.409090909091, 200, 1859, 916.5, 1423.1999999999998, 1803.7999999999993, 1859.0, 0.0911765924820755, 0.028978355920261926, 0.04113631418624891], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 111.16666666666667, 83, 248, 84.0, 248.0, 248.0, 248.0, 0.04104332122555357, 0.011062457674074985, 0.024169065135750782], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 83.66666666666666, 83, 84, 84.0, 84.0, 84.0, 84.0, 0.04104360198651034, 0.011062533347926614, 0.0241291488241008], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c493a664-01e3-4ed6-9a8e-729bd9b7bc2c", 1, 0, 0.0, 513.0, 513, 513, 513.0, 513.0, 513.0, 513.0, 1.949317738791423, 0.35217166179337234, 1.3439632066276803], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 209.38888888888889, 81, 739, 84.0, 733.6, 739.0, 739.0, 0.10418535732683526, 15.647762284828296, 0.05975735664384235], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 165.16666666666666, 82, 574, 83.0, 435.4000000000002, 574.0, 574.0, 0.1041859603630302, 5.129089751140257, 0.05985944662784775], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=283051c2-dbd8-4d1f-af01-4d5e85c0fe9c", 1, 0, 0.0, 165.0, 165, 165, 165.0, 165.0, 165.0, 165.0, 6.0606060606060606, 1.0949337121212122, 4.178503787878788], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 83.83333333333331, 82, 88, 83.5, 86.2, 88.0, 88.0, 0.10418113626892624, 0.07742367646548132, 0.05229404691623837], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 82.33333333333333, 81, 84, 82.0, 84.0, 84.0, 84.0, 0.04104360198651034, 0.01098237006279671, 0.023407679257931673], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 110.6111111111111, 82, 247, 83.0, 247.0, 247.0, 247.0, 0.10408956328645448, 0.053908364319254255, 0.05790659624236676], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 84.5, 82, 86, 84.5, 86.0, 86.0, 86.0, 0.04104360198651034, 0.03050212999192809, 0.02060196427838507], "isController": false}, {"data": ["deleteAccount", 12, 0, 0.0, 589.4166666666666, 350, 1495, 438.5, 1299.1000000000008, 1495.0, 1495.0, 0.07137419109250095, 0.012894751320422537, 0.048581846866673016], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 117.66666666666667, 84, 253, 86.0, 253.0, 253.0, 253.0, 0.039384809279061066, 0.031000152616135958, 0.014000068923416239], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=02546268-7215-46d1-a769-ade336f24513", 1, 0, 0.0, 397.0, 397, 397, 397.0, 397.0, 397.0, 397.0, 2.5188916876574305, 0.45507320528967254, 1.7366577455919394], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1149.2727272727273, 650, 1825, 1064.5, 1747.1, 1815.2499999999998, 1825.0, 0.09464848842061788, 0.04898798717082762, 0.043534607466905295], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 196.66666666666666, 166, 333, 170.5, 333.0, 333.0, 333.0, 0.041019470575366444, 0.06357216777647123, 0.09225375071784074], "isController": false}, {"data": ["addBook", 66, 2, 3.0303030303030303, 847.9393939393939, 444, 1807, 710.0, 1333.1000000000001, 1462.0, 1807.0, 0.3201459089233396, 105.6513190026606, 1.1644037919100099], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=70346880-6a4a-4fa2-b4fe-50d3a54e72ee", 1, 0, 0.0, 360.0, 360, 360, 360.0, 360.0, 360.0, 360.0, 2.7777777777777777, 0.5018446180555556, 1.9151475694444444], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 152.96296296296293, 83, 340, 85.0, 335.0, 337.0, 340.0, 0.24327611839437763, 0.18079406845519666, 0.11759929551290715], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 471.24074074074065, 404, 676, 414.0, 580.5, 653.0, 676.0, 0.2432322868339264, 71.51836840119815, 0.12232873800729697], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 136.25925925925924, 81, 333, 86.5, 250.0, 258.25, 333.0, 0.2435877773066409, 0.43103618406214195, 0.11846358701045623], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 627.4999999999998, 561, 834, 574.5, 738.5, 745.25, 834.0, 0.24306587085100062, 218.71109785595647, 0.12200767345450617], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 92.73333333333333, 85, 126, 86.0, 118.2, 126.0, 126.0, 0.10328231187126893, 0.07715914900539134, 0.03671363429799013], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 186, 2, 1.075268817204301, 147.758064516129, 83, 1234, 90.0, 245.20000000000005, 308.60000000000014, 855.549999999998, 0.7888007260359371, 1.5734517002684467, 0.3859352006564858], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 16, 0, 0.0, 96.5625, 84, 254, 86.0, 138.5000000000001, 254.0, 254.0, 0.11296483263554015, 0.08748155496092123, 0.040155467850914665], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9592996b-a2eb-422f-99d2-3be949e93bd4", 1, 0, 0.0, 1041.0, 1041, 1041, 1041.0, 1041.0, 1041.0, 1041.0, 0.9606147934678194, 0.306758825648415, 0.5731793347742555], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 86.83333333333333, 83, 93, 86.5, 89.4, 93.0, 93.0, 0.09796771419552179, 0.07950309618796739, 0.034824460905439385], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e28a57fe-b060-4786-8e34-569076520b0b", 1, 0, 0.0, 337.0, 337, 337, 337.0, 337.0, 337.0, 337.0, 2.967359050445104, 0.947584384272997, 1.7705628709198813], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f2d1000f-7026-4b1b-a7c9-c4cf7cd2103f", 3, 0, 0.0, 432.33333333333337, 175, 798, 324.0, 798.0, 798.0, 798.0, 0.021398918641311326, 0.029500136863917146, 0.013722613842247173], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 16, 0, 0.0, 300.375, 167, 969, 174.0, 637.2000000000003, 969.0, 969.0, 0.11301510164295704, 8.614538874104708, 0.2523663640569596], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7f0144a1-476c-4fc0-b28f-d8f0053864fc", 3, 0, 0.0, 417.6666666666667, 171, 673, 409.0, 673.0, 673.0, 673.0, 0.03013924330406478, 0.030227541868432156, 0.01932757464485925], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=758144b4-2177-42c4-a262-9cc701eeb689", 1, 0, 0.0, 359.0, 359, 359, 359.0, 359.0, 359.0, 359.0, 2.785515320334262, 0.5032425139275766, 1.920482242339833], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 321.88888888888886, 166, 823, 172.5, 816.7, 823.0, 823.0, 0.10403541828017894, 20.878116953510617, 0.22954168785906667], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fbbc2273-cfba-4ed1-af13-03f9d5b390c4", 1, 0, 0.0, 163.0, 163, 163, 163.0, 163.0, 163.0, 163.0, 6.134969325153374, 1.108368481595092, 4.229773773006134], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 112.07142857142857, 84, 269, 88.0, 260.0, 269.0, 269.0, 0.07084339056467243, 0.05873636580996767, 0.0251826114897859], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 21, 0, 0.0, 89.80952380952382, 84, 109, 87.0, 104.6, 108.6, 109.0, 0.10713028573177637, 0.08317243862965061, 0.03808146875621738], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cea81f85-1cde-4b48-b422-bf16f56c9bb8", 1, 0, 0.0, 530.0, 530, 530, 530.0, 530.0, 530.0, 530.0, 1.8867924528301887, 0.3408755896226415, 1.3008549528301887], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/efc2dc39-df06-4b0a-aa90-9363bc25ebf6", 3, 0, 0.0, 295.3333333333333, 187, 430, 269.0, 430.0, 430.0, 430.0, 0.019764668678270723, 0.027234323735390614, 0.012674608494854599], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9bb882cf-f3dd-4180-9bdf-e884b419beec", 3, 0, 0.0, 237.0, 175, 350, 186.0, 350.0, 350.0, 350.0, 0.031261723146179816, 0.03135331022570964, 0.02004739407486141], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 95.93333333333334, 82, 251, 84.0, 155.00000000000006, 251.0, 251.0, 0.1007475467972355, 0.07487195616474239, 0.05057054595095609], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 160.06666666666663, 81, 253, 84.0, 252.4, 253.0, 253.0, 0.10086339062373921, 0.026988836944242717, 0.057523652465101265], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 127.13333333333333, 81, 253, 83.0, 250.0, 253.0, 253.0, 0.10086203418550546, 0.02718547015156202, 0.05929584431608817], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 149.79999999999995, 82, 252, 84.0, 250.8, 252.0, 252.0, 0.1008613559800698, 0.027185287354003187, 0.05939394302342001], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 66.66666666666667, 0.3005259203606311], "isController": false}, {"data": ["401/Unauthorized", 2, 33.333333333333336, 0.15026296018031554], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1331, 6, "406/Not Acceptable", 4, "401/Unauthorized", 2, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 186, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
