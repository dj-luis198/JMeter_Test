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

    var data = {"OkPercent": 98.53281853281854, "KoPercent": 1.4671814671814671};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7544672402382528, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.00909090909090909, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a0aa13c7-725e-421e-b189-315b92459e0d"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=98e7073d-4f17-471d-aef3-1ce575e09c24"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cf8000d9-432d-44d9-94c9-d81aa100a31c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b8d9216c-3612-436c-a9b5-757eed16c378"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/319eade5-fd10-4f56-9f37-955c88fdfa55"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8461538461538461, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6295e005-7f81-4825-bee6-37673df9a33e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/1d870961-4146-4c91-b25c-2f002c7f903a"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.4, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dbfc1739-5e44-4c33-b81d-15ee4ec37929"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/53566ac7-bd30-4a91-be6a-356f393bcc8f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/113d22a2-9588-44e3-a69c-838ee9d0b57d"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7a8c0e46-ea32-44d3-9038-f49155767b7f"], "isController": false}, {"data": [0.3125, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b8d9216c-3612-436c-a9b5-757eed16c378"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8947368421052632, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a0aa13c7-725e-421e-b189-315b92459e0d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a1c156c9-7dca-4b95-97d4-c3ba4d1f71e6"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bc2f6070-7ea0-4ffd-bb87-f47797db8681"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/98e7073d-4f17-471d-aef3-1ce575e09c24"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.3090909090909091, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3125, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8317071b-0d49-4b1b-94e2-131b8bfea7b9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cf8000d9-432d-44d9-94c9-d81aa100a31c"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.3409090909090909, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=319eade5-fd10-4f56-9f37-955c88fdfa55"], "isController": false}, {"data": [0.29310344827586204, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=38b26734-36b3-419e-8236-b5e2a96e15ff"], "isController": false}, {"data": [0.9181818181818182, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9818181818181818, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.43636363636363634, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/38b26734-36b3-419e-8236-b5e2a96e15ff"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f3cd604f-472b-478e-9972-81a994c0331f"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8317071b-0d49-4b1b-94e2-131b8bfea7b9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bc2f6070-7ea0-4ffd-bb87-f47797db8681"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a1c156c9-7dca-4b95-97d4-c3ba4d1f71e6"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=53566ac7-bd30-4a91-be6a-356f393bcc8f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6295e005-7f81-4825-bee6-37673df9a33e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=113d22a2-9588-44e3-a69c-838ee9d0b57d"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7a8c0e46-ea32-44d3-9038-f49155767b7f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1295, 19, 1.4671814671814671, 433.0555984555987, 115, 2719, 140.0, 1237.0, 1495.2, 1909.159999999999, 5.198214543761339, 742.8958257233346, 3.795106647442639], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 2083.418181818182, 1488, 2899, 2027.0, 2497.8, 2539.7999999999997, 2899.0, 0.25882718344258976, 311.45606522533257, 1.2726512388998432], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a0aa13c7-725e-421e-b189-315b92459e0d", 3, 0, 0.0, 432.6666666666667, 209, 665, 424.0, 665.0, 665.0, 665.0, 0.022961058045554737, 0.027139193282359784, 0.014724376415931913], "isController": false}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 573.1428571428573, 133, 1137, 500.5, 1068.0, 1137.0, 1137.0, 0.10069334560833167, 0.019013454698783048, 0.06809584163454069], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 573.1428571428573, 133, 1137, 500.5, 1068.0, 1137.0, 1137.0, 0.10036130068245686, 0.01895075620447898, 0.0678712897681654], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=98e7073d-4f17-471d-aef3-1ce575e09c24", 1, 0, 0.0, 215.0, 215, 215, 215.0, 215.0, 215.0, 215.0, 4.651162790697675, 0.8402979651162791, 3.2067587209302326], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 193.20000000000002, 120, 394, 130.0, 382.6, 394.0, 394.0, 0.07889795338708913, 0.02901143494337757, 0.04455474268747469], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 147.66666666666663, 121, 389, 130.0, 243.2000000000001, 389.0, 389.0, 0.07889089914587454, 0.0586288811035259, 0.039599533360331556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 200.6, 121, 748, 127.0, 529.0000000000001, 748.0, 748.0, 0.07889878338076027, 1.5664387752015865, 0.04600888038681444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 260.73333333333335, 119, 1404, 129.0, 793.8000000000004, 1404.0, 1404.0, 0.07889753839680202, 4.7526572444377235, 0.04593110601199243], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 238.73333333333335, 120, 424, 235.0, 379.6, 424.0, 424.0, 0.08955010029611232, 0.16947473082732353, 0.05788108045181011], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/cf8000d9-432d-44d9-94c9-d81aa100a31c", 3, 0, 0.0, 452.66666666666663, 214, 830, 314.0, 830.0, 830.0, 830.0, 0.021354897033804804, 0.021417460208708525, 0.013694383840037584], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 154.73684210526318, 120, 375, 130.0, 372.0, 375.0, 375.0, 0.11155079083639609, 0.0829005388930639, 0.05599326805655038], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 151.94736842105263, 119, 376, 127.0, 359.0, 376.0, 376.0, 0.1115514457654484, 0.029848726698957877, 0.0636191839131073], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 886.8333333333333, 597, 1038, 976.0, 1038.0, 1038.0, 1038.0, 0.08326394671107411, 24.48236495628643, 0.047486469608659446], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1397.3333333333335, 1231, 1596, 1356.5, 1596.0, 1596.0, 1596.0, 0.08245609213094027, 74.1941366417695, 0.04694521651595525], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 168.33333333333334, 120, 386, 126.0, 386.0, 386.0, 386.0, 0.0838117587897582, 0.14830752629593932, 0.046407487533000884], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 165.69230769230768, 120, 393, 128.0, 382.2, 393.0, 393.0, 0.06070936558712961, 0.045117018761528946, 0.03047325577322717], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 159.92307692307693, 119, 361, 124.0, 360.6, 361.0, 361.0, 0.0607110666934418, 0.023259197726604057, 0.03423206630115491], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 280.07692307692304, 117, 1282, 128.0, 951.9999999999998, 1282.0, 1282.0, 0.06061538605006831, 4.210606446737726, 0.035234514517384956], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 259.2307692307692, 121, 988, 128.0, 785.5999999999998, 988.0, 988.0, 0.060608321056263174, 1.3859145242013688, 0.03528959559097775], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b8d9216c-3612-436c-a9b5-757eed16c378", 1, 0, 0.0, 647.0, 647, 647, 647.0, 647.0, 647.0, 647.0, 1.5455950540958268, 0.27923348145285937, 1.0656153400309119], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 168.0, 121, 372, 128.0, 372.0, 372.0, 372.0, 0.08380590552280917, 0.06228153720982206, 0.04705898015196804], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 1038.2666666666669, 122, 1786, 1424.0, 1713.4, 1786.0, 1786.0, 0.08618708342909676, 51.708602817599406, 0.04573077668926684], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/319eade5-fd10-4f56-9f37-955c88fdfa55", 3, 0, 0.0, 535.3333333333334, 233, 952, 421.0, 952.0, 952.0, 952.0, 0.04974876871797423, 0.03198366478450492, 0.031902693481253006], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 151.99999999999997, 121, 376, 128.0, 359.0, 376.0, 376.0, 0.11155341059874826, 0.030067130200443864, 0.06558120427777973], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 713.2666666666667, 122, 1160, 991.0, 1136.6, 1160.0, 1160.0, 0.08618708342909676, 16.902319509882787, 0.045814943762928065], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 178.3157894736842, 116, 527, 128.0, 451.0, 527.0, 527.0, 0.11155799547896544, 0.030068365968939907, 0.0656928430408361], "isController": false}, {"data": ["deleteBooks", 14, 1, 7.142857142857143, 557.6428571428571, 132, 1092, 494.0, 1081.5, 1092.0, 1092.0, 0.10049529825568874, 0.018976058341109756, 0.06877506774459838], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 467.76923076923083, 248, 1413, 260.0, 1168.1999999999998, 1413.0, 1413.0, 0.060573020776546124, 5.660992896648448, 0.135037976080646], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6295e005-7f81-4825-bee6-37673df9a33e", 3, 0, 0.0, 474.6666666666667, 350, 652, 422.0, 652.0, 652.0, 652.0, 0.08944010494305647, 0.040411089082344524, 0.057355796464134516], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1d870961-4146-4c91-b25c-2f002c7f903a", 1, 0, 0.0, 636.0, 636, 636, 636.0, 636.0, 636.0, 636.0, 1.5723270440251573, 0.5021005306603773, 0.9381756092767295], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 616.5, 159, 1503, 517.5, 1331.8, 1477.9499999999996, 1503.0, 0.09571876087713192, 0.058795996671597635, 0.04327908817003132], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 128.73333333333332, 121, 140, 130.0, 136.4, 140.0, 140.0, 0.08618510261772885, 0.06404967098837075, 0.043260881587414673], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 160.79999999999998, 120, 387, 129.0, 378.6, 387.0, 387.0, 0.08618807386892517, 0.1093623411266505, 0.04432850153414771], "isController": false}, {"data": ["login", 22, 0, 0.0, 2774.4999999999995, 1938, 4427, 2391.0, 4193.3, 4403.15, 4427.0, 0.09457240377257917, 30.985769875787746, 0.18545896901034278], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 133.73684210526315, 122, 155, 132.0, 141.0, 155.0, 155.0, 0.1113807698169838, 0.09017056462722614, 0.03959238302088096], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 1168.2666666666667, 253, 1908, 1551.0, 1840.8, 1908.0, 1908.0, 0.08612225915910227, 68.73259949094569, 0.1790008544045794], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dbfc1739-5e44-4c33-b81d-15ee4ec37929", 1, 0, 0.0, 227.0, 227, 227, 227.0, 227.0, 227.0, 227.0, 4.405286343612335, 1.406766244493392, 2.6285448788546253], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 476.0, 248, 1531, 486.0, 1075.6000000000004, 1531.0, 1531.0, 0.07883658227648516, 6.401766579990224, 0.17596058269431905], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/53566ac7-bd30-4a91-be6a-356f393bcc8f", 3, 0, 0.0, 556.0, 239, 911, 518.0, 911.0, 911.0, 911.0, 0.030790389293155297, 0.025668680657477443, 0.01974513896729034], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/113d22a2-9588-44e3-a69c-838ee9d0b57d", 3, 0, 0.0, 309.0, 237, 435, 255.0, 435.0, 435.0, 435.0, 0.02498001598721023, 0.02505319962779776, 0.01601908577304823], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 3, 33.333333333333336, 1086.6666666666667, 120, 1767, 1425.0, 1767.0, 1767.0, 1767.0, 0.1184678162432539, 94.4963626678294, 0.20402790575227064], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7a8c0e46-ea32-44d3-9038-f49155767b7f", 1, 0, 0.0, 555.0, 555, 555, 555.0, 555.0, 555.0, 555.0, 1.8018018018018018, 0.3255208333333333, 1.2422578828828827], "isController": false}, {"data": ["register", 24, 7, 29.166666666666668, 993.8333333333336, 133, 1786, 1076.5, 1531.5, 1749.5, 1786.0, 0.09975311105015087, 0.03131896992443702, 0.04500579814957979], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/b8d9216c-3612-436c-a9b5-757eed16c378", 3, 0, 0.0, 344.6666666666667, 250, 441, 343.0, 441.0, 441.0, 441.0, 0.025307699445761382, 0.025381843096481387, 0.016229221324267552], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 133.61111111111111, 126, 151, 134.0, 142.9, 151.0, 151.0, 0.0963736728542134, 0.07482135734287076, 0.03425782902239617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 361.1052631578947, 247, 751, 262.0, 748.0, 751.0, 751.0, 0.11146833126041349, 0.17275414229519162, 0.25069488954368385], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a0aa13c7-725e-421e-b189-315b92459e0d", 1, 0, 0.0, 433.0, 433, 433, 433.0, 433.0, 433.0, 433.0, 2.3094688221709005, 0.417238019630485, 1.5922704965357968], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a1c156c9-7dca-4b95-97d4-c3ba4d1f71e6", 1, 0, 0.0, 659.0, 659, 659, 659.0, 659.0, 659.0, 659.0, 1.5174506828528074, 0.27414880500758726, 1.0462111153262519], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 553.1052631578948, 254, 1527, 496.0, 1348.0, 1527.0, 1527.0, 0.12777490097445174, 16.268044789726225, 0.2839274410890456], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bc2f6070-7ea0-4ffd-bb87-f47797db8681", 1, 0, 0.0, 1092.0, 1092, 1092, 1092.0, 1092.0, 1092.0, 1092.0, 0.9157509157509157, 0.16544328067765565, 0.6313673305860805], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 6, 0, 0.0, 168.16666666666669, 122, 373, 128.5, 373.0, 373.0, 373.0, 0.037940585043821376, 0.028196079314793034, 0.019044395227074403], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 6, 0, 0.0, 169.66666666666666, 121, 388, 126.5, 388.0, 388.0, 388.0, 0.03787878787878788, 0.019617562342171716, 0.021072541824494948], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 6, 0, 0.0, 428.3333333333333, 124, 1433, 250.0, 1433.0, 1433.0, 1433.0, 0.03787878787878788, 5.689074583727904, 0.021726049558080808], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/98e7073d-4f17-471d-aef3-1ce575e09c24", 3, 0, 0.0, 315.0, 235, 433, 277.0, 433.0, 433.0, 433.0, 0.08366800535475234, 0.039328320225345825, 0.05365428728804105], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 6, 0, 0.0, 310.83333333333337, 124, 986, 126.5, 986.0, 986.0, 986.0, 0.03794154472675764, 1.867867681234112, 0.02179909714932527], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 132.0, 132, 132, 132.0, 132.0, 132.0, 132.0, 7.575757575757576, 2.234256628787879, 4.683061079545454], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1450.5636363636365, 915, 2357, 1364.0, 1980.4, 2014.5999999999995, 2357.0, 0.24193264595136715, 289.4355539542791, 0.47772247081412533], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, 29.166666666666668, 993.8333333333336, 133, 1786, 1076.5, 1531.5, 1749.5, 1786.0, 0.10223119584941345, 0.03209700143123674, 0.046123840314872086], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8317071b-0d49-4b1b-94e2-131b8bfea7b9", 3, 0, 0.0, 489.3333333333333, 239, 736, 493.0, 736.0, 736.0, 736.0, 0.02266357434785565, 0.02678757762274214, 0.014533607247811076], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 125.375, 121, 129, 125.0, 129.0, 129.0, 129.0, 0.05681253284474555, 0.015312752993310325, 0.033455036431036686], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 156.5, 116, 386, 125.5, 386.0, 386.0, 386.0, 0.056811725940234065, 0.015312535507328712, 0.03339908107033292], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cf8000d9-432d-44d9-94c9-d81aa100a31c", 1, 0, 0.0, 1071.0, 1071, 1071, 1071.0, 1071.0, 1071.0, 1071.0, 0.9337068160597572, 0.168687266573296, 0.6437470821661998], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 198.11111111111114, 121, 1411, 126.0, 264.4000000000018, 1411.0, 1411.0, 0.09758530582150564, 4.903031590870895, 0.05690358436249688], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 176.5, 115, 740, 125.5, 422.3000000000005, 740.0, 740.0, 0.09758477677482312, 1.6189056104469923, 0.056998573500311726], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 127.61111111111113, 116, 134, 127.0, 132.2, 134.0, 134.0, 0.09758160261518695, 0.07251914022476295, 0.04898139037520126], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 152.5, 123, 347, 125.0, 347.0, 347.0, 347.0, 0.056811725940234065, 0.015201575105101693, 0.03240043745028974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 139.22222222222223, 115, 374, 125.5, 156.20000000000033, 374.0, 374.0, 0.09759112571363511, 0.03425643355941944, 0.05520209834474607], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 127.5, 125, 132, 126.5, 132.0, 132.0, 132.0, 0.05681212938962468, 0.04222073287646912, 0.028517025885026453], "isController": false}, {"data": ["deleteAccount", 14, 1, 7.142857142857143, 612.4285714285714, 131, 1391, 511.5, 1151.0, 1391.0, 1391.0, 0.0986881524872939, 0.018442073138494726, 0.06716659485341285], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 162.87499999999997, 127, 390, 129.0, 390.0, 390.0, 390.0, 0.05857458741524989, 0.04610460689130021, 0.02082143537026461], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1382.0454545454545, 800, 2719, 1289.5, 1922.4999999999998, 2609.6499999999987, 2719.0, 0.09648953527131103, 0.04994087274784653, 0.04438141710233154], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 286.375, 251, 517, 253.5, 517.0, 517.0, 517.0, 0.056761339851427194, 0.08796899057052242, 0.12765758366976251], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=319eade5-fd10-4f56-9f37-955c88fdfa55", 1, 0, 0.0, 416.0, 416, 416, 416.0, 416.0, 416.0, 416.0, 2.403846153846154, 0.4342886117788462, 1.6573392427884617], "isController": false}, {"data": ["addBook", 58, 7, 12.068965517241379, 1300.7241379310344, 608, 3383, 977.5, 2241.3, 2445.199999999998, 3383.0, 0.2696808931087233, 90.0579708576085, 0.9792006431656818], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=38b26734-36b3-419e-8236-b5e2a96e15ff", 1, 0, 0.0, 422.0, 422, 422, 422.0, 422.0, 422.0, 422.0, 2.3696682464454977, 0.4281138921800948, 1.6337751777251186], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 243.65454545454543, 119, 807, 131.0, 512.2, 635.9999999999998, 807.0, 0.24278273152644123, 0.1804274010660369, 0.11736079307186369], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 792.0545454545453, 590, 1157, 742.0, 1023.2, 1122.4, 1157.0, 0.24305417456592734, 71.46599748052252, 0.12223916006001229], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 196.7818181818182, 119, 512, 130.0, 377.2, 416.3999999999995, 512.0, 0.2435535795733827, 0.4309756701044623, 0.1184469556909615], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1205.290909090909, 795, 1635, 1233.0, 1540.8, 1605.6, 1635.0, 0.24283418398883844, 218.5026256101209, 0.12189137751002244], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 134.78947368421052, 126, 155, 133.0, 146.0, 155.0, 155.0, 0.12718473247695614, 0.09501593783678851, 0.045210197872668], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 7, 4.093567251461988, 199.2105263157895, 116, 2290, 133.0, 323.00000000000017, 393.4, 1915.6000000000006, 0.7196909116926625, 1.5658612209177531, 0.3460109368818444], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 6, 0, 0.0, 171.83333333333334, 125, 378, 131.0, 378.0, 378.0, 378.0, 0.040162255512269575, 0.031102215450419694, 0.014276426764127072], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 148.13333333333335, 123, 379, 133.0, 235.60000000000008, 379.0, 379.0, 0.08127350158754239, 0.06595535138598412, 0.02889019001744671], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/38b26734-36b3-419e-8236-b5e2a96e15ff", 3, 0, 0.0, 770.3333333333334, 217, 1634, 460.0, 1634.0, 1634.0, 1634.0, 0.04023713082432469, 0.03354404037796078, 0.025803107983046754], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 6, 0, 0.0, 599.1666666666667, 254, 1561, 380.0, 1561.0, 1561.0, 1561.0, 0.03784748724224284, 7.595338953816603, 0.08350594678643293], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f3cd604f-472b-478e-9972-81a994c0331f", 1, 0, 0.0, 228.0, 228, 228, 228.0, 228.0, 228.0, 228.0, 4.385964912280701, 1.400596217105263, 2.617016173245614], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 343.8888888888889, 238, 1540, 259.0, 616.6000000000015, 1540.0, 1540.0, 0.09751446464558909, 6.62391019967441, 0.21792620592887946], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8317071b-0d49-4b1b-94e2-131b8bfea7b9", 1, 0, 0.0, 851.0, 851, 851, 851.0, 851.0, 851.0, 851.0, 1.1750881316098707, 0.21229619565217392, 0.8101681844888367], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 151.46153846153845, 123, 378, 132.0, 284.79999999999995, 378.0, 378.0, 0.062444760404257775, 0.05177304842110825, 0.022197160924951005], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bc2f6070-7ea0-4ffd-bb87-f47797db8681", 3, 0, 0.0, 385.0, 249, 563, 343.0, 563.0, 563.0, 563.0, 0.05108556832694764, 0.03237747445721584, 0.03275995104299702], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 130.73333333333335, 123, 144, 131.0, 138.0, 144.0, 144.0, 0.08512232077495362, 0.06608617677352355, 0.03025832496297179], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a1c156c9-7dca-4b95-97d4-c3ba4d1f71e6", 3, 0, 0.0, 411.0, 209, 735, 289.0, 735.0, 735.0, 735.0, 0.03533152749970557, 0.02945444073136262, 0.02265726210104817], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=53566ac7-bd30-4a91-be6a-356f393bcc8f", 1, 0, 0.0, 619.0, 619, 619, 619.0, 619.0, 619.0, 619.0, 1.6155088852988693, 0.29186439822294025, 1.113817649434572], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6295e005-7f81-4825-bee6-37673df9a33e", 1, 0, 0.0, 304.0, 304, 304, 304.0, 304.0, 304.0, 304.0, 3.289473684210526, 0.5942896792763158, 2.2679379111842106], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=113d22a2-9588-44e3-a69c-838ee9d0b57d", 1, 0, 0.0, 391.0, 391, 391, 391.0, 391.0, 391.0, 391.0, 2.557544757033248, 0.46205642583120204, 1.7633072250639386], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7a8c0e46-ea32-44d3-9038-f49155767b7f", 3, 0, 0.0, 642.6666666666667, 232, 1391, 305.0, 1391.0, 1391.0, 1391.0, 0.02183692186749356, 0.030103959670844796, 0.014003494817370543], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 154.26315789473682, 121, 390, 128.0, 378.0, 390.0, 390.0, 0.12898758324790735, 0.09585893637857178, 0.06474572049748475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 176.94736842105263, 120, 381, 127.0, 373.0, 381.0, 381.0, 0.12898845892735913, 0.05490760777325186, 0.07242341310251188], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 382.2105263157895, 124, 1398, 373.0, 1223.0, 1398.0, 1398.0, 0.12788584505620249, 12.143673331594535, 0.07402602729353167], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 318.15789473684214, 119, 986, 362.0, 911.0, 986.0, 986.0, 0.12830642274940404, 4.00213689282362, 0.07439477564946685], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 36.8421052631579, 0.5405405405405406], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 10.526315789473685, 0.15444015444015444], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.2631578947368425, 0.07722007722007722], "isController": false}, {"data": ["401/Unauthorized", 9, 47.36842105263158, 0.694980694980695], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1295, 19, "401/Unauthorized", 9, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 3, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 171, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
