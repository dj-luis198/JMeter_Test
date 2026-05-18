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

    var data = {"OkPercent": 98.67909867909867, "KoPercent": 1.320901320901321};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7366131191432396, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d5103b2d-43c0-4d21-bd8b-faf2bc4487e7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2f2b0e18-4063-401b-b86c-878bbff8239d"], "isController": false}, {"data": [0.5384615384615384, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5384615384615384, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0c9261b8-689f-472f-9437-3d76303af7eb"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=55ed6580-bef4-4fd9-8d3a-b0d053591eb5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d9692ab7-96d2-48db-bb06-46ec28c515cf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.40625, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.84375, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/92e4c1bf-5372-45c4-a5fb-da87e43f5a68"], "isController": false}, {"data": [0.7380952380952381, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.023809523809523808, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fced9241-05af-4828-be45-0c78d3235261"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.34375, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1ae194a5-366e-4419-87e4-0f9cd602deff"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.14285714285714285, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2392935a-70e3-4094-b0d5-e6297fc4b67d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=79ee20dc-d5b4-4959-adff-088f64c63046"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0dd7082d-eec3-44c1-b603-37ee71ab199a"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2d9014c0-367e-4239-988d-a594698321a5"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/119c8765-affc-4fe0-acdf-e70f8d3d3e73"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/55ed6580-bef4-4fd9-8d3a-b0d053591eb5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/d5103b2d-43c0-4d21-bd8b-faf2bc4487e7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0c9261b8-689f-472f-9437-3d76303af7eb"], "isController": false}, {"data": [0.24107142857142858, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8181818181818182, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d9692ab7-96d2-48db-bb06-46ec28c515cf"], "isController": false}, {"data": [0.3017241379310345, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=92e4c1bf-5372-45c4-a5fb-da87e43f5a68"], "isController": false}, {"data": [0.9107142857142857, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2f2b0e18-4063-401b-b86c-878bbff8239d"], "isController": false}, {"data": [0.9505813953488372, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e12473ce-ab0b-49e1-9975-e48479c65f85"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e12473ce-ab0b-49e1-9975-e48479c65f85"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0dd7082d-eec3-44c1-b603-37ee71ab199a"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.6944444444444444, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/79ee20dc-d5b4-4959-adff-088f64c63046"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fced9241-05af-4828-be45-0c78d3235261"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2d9014c0-367e-4239-988d-a594698321a5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4a3ce69e-39ca-4ed4-af26-04908b2e9b13"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/764ebbad-7358-4f71-9c78-b14287e78f39"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/02a3fdc3-191b-447b-9608-562c7df74bc8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1287, 17, 1.320901320901321, 486.39549339549325, 136, 2731, 162.0, 1326.2, 1688.9999999999995, 2180.399999999998, 5.151152505333264, 731.1841800306787, 3.761489531593335], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 2439.875, 1849, 3347, 2366.5, 2980.0000000000005, 3171.65, 3347.0, 0.25626593081735105, 308.37530456605253, 1.2600575797513305], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d5103b2d-43c0-4d21-bd8b-faf2bc4487e7", 1, 0, 0.0, 577.0, 577, 577, 577.0, 577.0, 577.0, 577.0, 1.7331022530329288, 0.3131092937608319, 1.1948927642980938], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2f2b0e18-4063-401b-b86c-878bbff8239d", 1, 0, 0.0, 481.0, 481, 481, 481.0, 481.0, 481.0, 481.0, 2.079002079002079, 0.37560096153846156, 1.4333744802494803], "isController": false}, {"data": ["deleteBook", 13, 2, 15.384615384615385, 499.0769230769231, 151, 704, 519.0, 690.4, 704.0, 704.0, 0.08509412719608304, 0.016869245918754747, 0.057210970433063654], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, 15.384615384615385, 499.0769230769231, 151, 704, 519.0, 690.4, 704.0, 704.0, 0.08639653350524029, 0.017127437794495878, 0.058086611694103105], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 163.0, 141, 441, 145.0, 210.5999999999998, 441.0, 441.0, 0.13381190768552628, 0.04762744600295961, 0.0756535383410472], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 180.76470588235296, 137, 456, 146.0, 435.2, 456.0, 456.0, 0.134119113551553, 0.09967250528587095, 0.06732150816943189], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 337.76470588235287, 142, 1112, 426.0, 578.3999999999995, 1112.0, 1112.0, 0.1331088752300043, 2.3360271160396193, 0.07771056404885879], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 264.4117647058824, 136, 1291, 147.0, 621.3999999999994, 1291.0, 1291.0, 0.13292257650867123, 7.069246859215443, 0.077471993408604], "isController": false}, {"data": ["goToProfile", 13, 2, 15.384615384615385, 404.2307692307692, 145, 1497, 253.0, 1385.0, 1497.0, 1497.0, 0.08451107095029449, 0.16551777657873182, 0.05462238990807796], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0c9261b8-689f-472f-9437-3d76303af7eb", 1, 0, 0.0, 463.0, 463, 463, 463.0, 463.0, 463.0, 463.0, 2.1598272138228944, 0.3902031587473002, 1.4890996220302375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=55ed6580-bef4-4fd9-8d3a-b0d053591eb5", 1, 0, 0.0, 514.0, 514, 514, 514.0, 514.0, 514.0, 514.0, 1.9455252918287937, 0.3514865029182879, 1.3413484922178989], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 147.1875, 143, 152, 147.0, 152.0, 152.0, 152.0, 0.08091310438296172, 0.06013171136272839, 0.04061458559847884], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 145.62499999999997, 139, 158, 145.0, 152.4, 158.0, 158.0, 0.08091801487879999, 0.029247832282242037, 0.045723814803950824], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 1177.0, 1171, 1186, 1175.5, 1186.0, 1186.0, 1186.0, 0.05810744065777623, 17.085516902001803, 0.03313939975013801], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1341.75, 996, 1563, 1404.0, 1563.0, 1563.0, 1563.0, 0.058268267101736396, 52.429889162830676, 0.0331742184768675], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 222.0, 143, 452, 146.5, 452.0, 452.0, 452.0, 0.05899617999734517, 0.1043955841359272, 0.032666830135248744], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 166.18750000000003, 138, 436, 150.0, 239.30000000000018, 436.0, 436.0, 0.08125663384237229, 0.06038701011137237, 0.04078702128415952], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 191.62500000000003, 136, 595, 146.5, 483.0000000000001, 595.0, 595.0, 0.08126034799744031, 0.029371568654836516, 0.045917254746112204], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 298.37499999999994, 140, 1574, 149.5, 864.9000000000008, 1574.0, 1574.0, 0.08126117341134406, 4.590467691382761, 0.04733622064440111], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 205.375, 141, 1099, 145.5, 436.8000000000007, 1099.0, 1099.0, 0.08125993529677653, 1.5138531525045835, 0.047414854824046844], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d9692ab7-96d2-48db-bb06-46ec28c515cf", 3, 0, 0.0, 331.0, 254, 472, 267.0, 472.0, 472.0, 472.0, 0.04390072582533364, 0.028223936687836574, 0.02815248368356357], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 147.5, 144, 151, 147.5, 151.0, 151.0, 151.0, 0.05900140128328048, 0.04384772107087543, 0.03313066966590456], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 277.12499999999994, 142, 1628, 149.5, 806.2000000000008, 1628.0, 1628.0, 0.08091351356818481, 4.570828284140446, 0.047133701995529534], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 1160.3749999999998, 143, 2554, 1564.0, 2103.9000000000005, 2554.0, 2554.0, 0.09609032490541108, 54.04861429118372, 0.051329499729745966], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 219.43750000000003, 137, 722, 150.5, 518.3000000000002, 722.0, 722.0, 0.08091678719896427, 1.5074603855432045, 0.04721462924939565], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 795.8125, 139, 1360, 1115.5, 1301.2, 1360.0, 1360.0, 0.09609032490541108, 17.668303517806738, 0.051423337937661406], "isController": false}, {"data": ["deleteBooks", 13, 2, 15.384615384615385, 480.69230769230774, 152, 811, 514.0, 764.1999999999999, 811.0, 811.0, 0.08671349195232092, 0.017190272330391745, 0.058833853614285045], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 469.875, 287, 1718, 302.5, 1126.5000000000007, 1718.0, 1718.0, 0.0811956052878638, 6.189108251820557, 0.18131240326304837], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/92e4c1bf-5372-45c4-a5fb-da87e43f5a68", 3, 0, 0.0, 436.33333333333337, 267, 714, 328.0, 714.0, 714.0, 714.0, 0.019067231056705946, 0.026285717293342996, 0.012227358457588123], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 632.6190476190476, 164, 1704, 406.0, 1335.8000000000002, 1668.8999999999996, 1704.0, 0.09423548100481946, 0.05788488042190571, 0.042608425493390056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 167.125, 140, 445, 150.0, 244.1000000000002, 445.0, 445.0, 0.09609147908809187, 0.07141173397074015, 0.04823341821413986], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 236.5, 139, 444, 150.0, 437.7, 444.0, 444.0, 0.09609205618982987, 0.11591573477391341, 0.0497586062447825], "isController": false}, {"data": ["login", 21, 0, 0.0, 2700.523809523809, 1490, 4440, 2608.0, 4205.0, 4426.3, 4440.0, 0.09724293136501291, 22.29450665708901, 0.1774330774725173], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/fced9241-05af-4828-be45-0c78d3235261", 3, 0, 0.0, 342.0, 234, 551, 241.0, 551.0, 551.0, 551.0, 0.03382644777196464, 0.027495000028188707, 0.02169209053084972], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 194.25, 146, 451, 155.5, 438.40000000000003, 451.0, 451.0, 0.07902990788076363, 0.06398026721987601, 0.028092662566990195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 1346.6875, 291, 2707, 1711.0, 2261.1000000000004, 2707.0, 2707.0, 0.09600268807526612, 71.83866382633714, 0.20056030318848928], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1ae194a5-366e-4419-87e4-0f9cd602deff", 1, 0, 0.0, 260.0, 260, 260, 260.0, 260.0, 260.0, 260.0, 3.8461538461538463, 1.2282151442307692, 2.294921875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 532.4117647058823, 291, 1437, 567.0, 997.7999999999996, 1437.0, 1437.0, 0.1327668613913967, 9.536913336431226, 0.29659756851160535], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 3, 42.857142857142854, 941.2857142857142, 145, 1708, 1338.0, 1708.0, 1708.0, 1708.0, 0.07472245943637916, 51.09087702150939, 0.11731676318317677], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2392935a-70e3-4094-b0d5-e6297fc4b67d", 1, 0, 0.0, 298.0, 298, 298, 298.0, 298.0, 298.0, 298.0, 3.3557046979865772, 1.071597105704698, 2.002280830536913], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=79ee20dc-d5b4-4959-adff-088f64c63046", 1, 0, 0.0, 576.0, 576, 576, 576.0, 576.0, 576.0, 576.0, 1.736111111111111, 0.31365288628472227, 1.196967230902778], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0dd7082d-eec3-44c1-b603-37ee71ab199a", 1, 0, 0.0, 442.0, 442, 442, 442.0, 442.0, 442.0, 442.0, 2.2624434389140275, 0.40874222285067874, 1.5598486990950227], "isController": false}, {"data": ["register", 21, 4, 19.047619047619047, 1173.5238095238094, 238, 2391, 1207.0, 1641.2, 2318.599999999999, 2391.0, 0.09485737516091876, 0.030119333965715835, 0.042796979808930144], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 161.55555555555557, 145, 218, 153.0, 197.30000000000004, 218.0, 218.0, 0.0865938316327267, 0.06722860951954857, 0.03078140108819582], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 462.875, 289, 1776, 302.5, 956.3000000000009, 1776.0, 1776.0, 0.08085136487210325, 6.162868639587355, 0.1805437033209698], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2d9014c0-367e-4239-988d-a594698321a5", 1, 0, 0.0, 622.0, 622, 622, 622.0, 622.0, 622.0, 622.0, 1.607717041800643, 0.2904566921221865, 1.108445538585209], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 510.73333333333335, 293, 868, 581.0, 706.6000000000001, 868.0, 868.0, 0.09560290377886412, 0.14816582841509507, 0.2150131712917227], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/119c8765-affc-4fe0-acdf-e70f8d3d3e73", 1, 0, 0.0, 259.0, 259, 259, 259.0, 259.0, 259.0, 259.0, 3.8610038610038613, 1.2329572876447876, 2.303782577220077], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/55ed6580-bef4-4fd9-8d3a-b0d053591eb5", 3, 0, 0.0, 332.0, 253, 454, 289.0, 454.0, 454.0, 454.0, 0.021907564682084723, 0.025893999791878137, 0.01404879636188376], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 5, 0, 0.0, 148.0, 143, 155, 144.0, 155.0, 155.0, 155.0, 0.023286356989167187, 0.017305583660894755, 0.011688659660578062], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 5, 0, 0.0, 145.2, 140, 153, 145.0, 153.0, 153.0, 153.0, 0.023287007712656956, 0.006231093860613287, 0.01328087158612467], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 5, 0, 0.0, 204.0, 143, 441, 145.0, 441.0, 441.0, 441.0, 0.023286573892956276, 0.006276459369585871, 0.013689958480038749], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d5103b2d-43c0-4d21-bd8b-faf2bc4487e7", 3, 0, 0.0, 1075.3333333333333, 228, 2126, 872.0, 2126.0, 2126.0, 2126.0, 0.037205610606079395, 0.02391962270410378, 0.023859066697257948], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 5, 0, 0.0, 146.4, 142, 150, 148.0, 150.0, 150.0, 150.0, 0.023286682346366112, 0.0062764886011689915, 0.013712763139510514], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 153.0, 152, 154, 153.0, 154.0, 154.0, 154.0, 0.034815304807993594, 0.010267794972669986, 0.021521570257285103], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0c9261b8-689f-472f-9437-3d76303af7eb", 3, 0, 0.0, 773.6666666666666, 378, 1497, 446.0, 1497.0, 1497.0, 1497.0, 0.024387468093062577, 0.024458915753491472, 0.015639099004991303], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1670.4642857142858, 1097, 2731, 1574.5, 2287.6000000000004, 2547.2999999999997, 2731.0, 0.24363609468742795, 291.4734708572075, 0.4810861166581829], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 4, 19.047619047619047, 1173.5238095238094, 238, 2391, 1207.0, 1641.2, 2318.599999999999, 2391.0, 0.0976090432454542, 0.03099305000371844, 0.04403845505800766], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 11, 0, 0.0, 221.8181818181818, 138, 446, 144.0, 444.2, 446.0, 446.0, 0.05953411846207135, 0.01604630536673017, 0.03505768889905178], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 11, 0, 0.0, 174.54545454545453, 141, 446, 148.0, 387.4000000000002, 446.0, 446.0, 0.05953186307671492, 0.016045697469895818, 0.03499822419158436], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 413.61111111111114, 141, 1650, 150.0, 1569.0000000000002, 1650.0, 1650.0, 0.08250257820556892, 12.391191668099003, 0.04732081471295978], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 340.55555555555554, 141, 1326, 152.5, 938.1000000000006, 1326.0, 1326.0, 0.08250522533093763, 4.061744060196729, 0.04740290452770342], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 197.77777777777777, 141, 478, 149.0, 443.80000000000007, 478.0, 478.0, 0.08250144377526607, 0.06131210811814207, 0.041411857520006604], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 11, 0, 0.0, 226.54545454545456, 146, 442, 150.0, 440.0, 442.0, 442.0, 0.05953186307671492, 0.01592942429982411, 0.03395176566093898], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 240.44444444444446, 139, 434, 149.5, 434.0, 434.0, 434.0, 0.08250484715977063, 0.042729561142967144, 0.04589869264194271], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 11, 0, 0.0, 153.0909090909091, 143, 187, 150.0, 180.40000000000003, 187.0, 187.0, 0.059531218712285616, 0.0442414623437982, 0.029881881267690244], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 11, 0, 0.0, 184.72727272727272, 146, 461, 157.0, 403.2000000000002, 461.0, 461.0, 0.06196764162422822, 0.04877531166907026, 0.022027560108612374], "isController": false}, {"data": ["deleteAccount", 12, 1, 8.333333333333334, 621.0, 148, 1048, 521.5, 1000.9000000000002, 1048.0, 1048.0, 0.08043811962489024, 0.015114877784331996, 0.05474479121280575], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1440.4761904761906, 879, 2288, 1417.0, 2172.6, 2279.0, 2288.0, 0.0941885655081473, 0.048749941132146556, 0.043323060892907606], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 11, 0, 0.0, 408.6363636363636, 292, 594, 307.0, 592.8, 594.0, 594.0, 0.05948325276056369, 0.09218742395606892, 0.1337792295972443], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d9692ab7-96d2-48db-bb06-46ec28c515cf", 1, 0, 0.0, 694.0, 694, 694, 694.0, 694.0, 694.0, 694.0, 1.440922190201729, 0.2603228566282421, 0.9934483069164266], "isController": false}, {"data": ["addBook", 58, 6, 10.344827586206897, 1474.3448275862067, 740, 3289, 1173.0, 2598.2, 2675.2999999999993, 3289.0, 0.2661075349724946, 88.86453950779283, 0.9663872203003345], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=92e4c1bf-5372-45c4-a5fb-da87e43f5a68", 1, 0, 0.0, 811.0, 811, 811, 811.0, 811.0, 811.0, 811.0, 1.2330456226880395, 0.22276703144266335, 0.8501271578298396], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 251.91071428571433, 144, 782, 151.5, 581.9, 601.0, 782.0, 0.24544179523141657, 0.18240352165147267, 0.11864618031206171], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 931.3035714285716, 693, 1322, 871.0, 1198.3, 1261.0, 1322.0, 0.2450594269110259, 72.05560825062578, 0.12324766099529136], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 207.23214285714297, 137, 590, 149.0, 442.5, 456.15, 590.0, 0.2461614203513954, 0.4355903258561802, 0.11971522200683098], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1416.4107142857144, 947, 2127, 1425.5, 1825.2, 1972.9499999999998, 2127.0, 0.24450411509157988, 220.0052325517934, 0.1227296046455782], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 156.66666666666666, 146, 179, 154.0, 176.0, 179.0, 179.0, 0.09900794043682302, 0.07396589300211878, 0.03519422882715194], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2f2b0e18-4063-401b-b86c-878bbff8239d", 3, 0, 0.0, 488.66666666666663, 241, 891, 334.0, 891.0, 891.0, 891.0, 0.02600396993941075, 0.026080153445092617, 0.016675722910364316], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 6, 3.488372093023256, 216.60465116279073, 138, 1055, 155.0, 358.3000000000003, 448.44999999999993, 842.570000000003, 0.7275403636855841, 1.5933368591194224, 0.34932908723293554], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 5, 0, 0.0, 157.4, 146, 172, 160.0, 172.0, 172.0, 172.0, 0.023402432916926043, 0.018123173147580423, 0.008318833575938555], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e12473ce-ab0b-49e1-9975-e48479c65f85", 3, 0, 0.0, 465.33333333333337, 248, 889, 259.0, 889.0, 889.0, 889.0, 0.07461387320615813, 0.03376083455617181, 0.047848089263063644], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e12473ce-ab0b-49e1-9975-e48479c65f85", 1, 0, 0.0, 249.0, 249, 249, 249.0, 249.0, 249.0, 249.0, 4.016064257028112, 0.725558483935743, 2.7688880522088355], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 174.9411764705882, 144, 459, 154.0, 258.1999999999998, 459.0, 459.0, 0.1343385014145054, 0.10901884245649802, 0.047753139174687466], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0dd7082d-eec3-44c1-b603-37ee71ab199a", 3, 0, 0.0, 351.6666666666667, 263, 475, 317.0, 475.0, 475.0, 475.0, 0.017235634098978502, 0.023760713023819647, 0.011052799210607958], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 5, 0, 0.0, 354.8, 288, 597, 294.0, 597.0, 597.0, 597.0, 0.023270750528246037, 0.03606511825031881, 0.05233646334624084], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 678.1666666666665, 292, 2079, 444.5, 1748.7000000000005, 2079.0, 2079.0, 0.08244551725401464, 16.54539559677959, 0.18190615753506226], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/79ee20dc-d5b4-4959-adff-088f64c63046", 3, 0, 0.0, 602.6666666666666, 249, 1048, 511.0, 1048.0, 1048.0, 1048.0, 0.02874885004599816, 0.028833075192617293, 0.018435948759966268], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 191.625, 147, 444, 154.5, 439.1, 444.0, 444.0, 0.08573755733699147, 0.07108514275303296, 0.030477022334633685], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fced9241-05af-4828-be45-0c78d3235261", 1, 0, 0.0, 514.0, 514, 514, 514.0, 514.0, 514.0, 514.0, 1.9455252918287937, 0.3514865029182879, 1.3413484922178989], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 153.68750000000003, 147, 162, 152.5, 160.6, 162.0, 162.0, 0.09757823029682078, 0.07575653621677003, 0.03468601155082301], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2d9014c0-367e-4239-988d-a594698321a5", 3, 0, 0.0, 672.6666666666666, 309, 1217, 492.0, 1217.0, 1217.0, 1217.0, 0.04681647940074907, 0.030098485291822723, 0.0300222865948814], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4a3ce69e-39ca-4ed4-af26-04908b2e9b13", 1, 0, 0.0, 335.0, 335, 335, 335.0, 335.0, 335.0, 335.0, 2.985074626865672, 0.9532416044776119, 1.781133395522388], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/764ebbad-7358-4f71-9c78-b14287e78f39", 1, 0, 0.0, 282.0, 282, 282, 282.0, 282.0, 282.0, 282.0, 3.5460992907801416, 1.1323969414893618, 2.115885416666667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 165.79999999999998, 143, 420, 148.0, 259.2000000000001, 420.0, 420.0, 0.09586624741161132, 0.07124434988304318, 0.048120362470281466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 296.66666666666674, 140, 444, 408.0, 440.4, 444.0, 444.0, 0.09570782315746489, 0.025609319868306033, 0.0545833678944917], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/02a3fdc3-191b-447b-9608-562c7df74bc8", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 1.2981135670731707, 2.42552718495935], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 242.5333333333333, 140, 452, 146.0, 449.6, 452.0, 452.0, 0.09586686010468662, 0.02583911463759131, 0.05635922830373177], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 284.3333333333333, 140, 453, 157.0, 451.8, 453.0, 453.0, 0.09569377990430622, 0.025792464114832537, 0.05635092703349282], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 23.529411764705884, 0.3108003108003108], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 11.764705882352942, 0.1554001554001554], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.882352941176471, 0.0777000777000777], "isController": false}, {"data": ["401/Unauthorized", 10, 58.8235294117647, 0.777000777000777], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1287, 17, "401/Unauthorized", 10, "406/Not Acceptable", 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 3, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 172, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
