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

    var data = {"OkPercent": 97.72191673212883, "KoPercent": 2.2780832678711707};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7560646900269542, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.046296296296296294, 500, 1500, "see books"], "isController": true}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f28cbe6b-5bbd-4842-98e3-14562dda81c9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.42592592592592593, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.42857142857142855, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.17391304347826086, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=da3504c6-c9d5-4b1f-b3f9-85c3889d3ecf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/f28cbe6b-5bbd-4842-98e3-14562dda81c9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.4642857142857143, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.15789473684210525, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.7, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.29310344827586204, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9814814814814815, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.4642857142857143, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9176470588235294, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b39a8b17-0e1a-454b-ad5c-b96b090911d7"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b39a8b17-0e1a-454b-ad5c-b96b090911d7"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=50e0e001-880b-4ddc-98dc-6ce9c9405717"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=53bbb59e-6067-427a-86ed-0686c4e8cad9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cdc26e6d-67ab-44f2-a54c-6f479dd837eb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.6578947368421053, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=35d71ab1-d4cf-470e-bd64-3cb8a594b107"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/53bbb59e-6067-427a-86ed-0686c4e8cad9"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4af40c3d-2c36-4093-9e5d-4cfb61873e19"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=481b97e0-6e9d-4dd2-913b-7032dbb44b0a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/35d71ab1-d4cf-470e-bd64-3cb8a594b107"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/50e0e001-880b-4ddc-98dc-6ce9c9405717"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/4af40c3d-2c36-4093-9e5d-4cfb61873e19"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/44f1cf9b-b360-404f-981d-9199988d41a2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/481b97e0-6e9d-4dd2-913b-7032dbb44b0a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/da3504c6-c9d5-4b1f-b3f9-85c3889d3ecf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6dd99191-f528-4ebf-bc01-fb311940d4b3"], "isController": false}, {"data": [0.6764705882352942, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/cdc26e6d-67ab-44f2-a54c-6f479dd837eb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9d9313e7-d408-4b68-9d55-234ebf182c51"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6dd99191-f528-4ebf-bc01-fb311940d4b3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7b0dd80e-7b0e-426f-bb0d-2c06d477b58e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7b0dd80e-7b0e-426f-bb0d-2c06d477b58e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.17391304347826086, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1273, 29, 2.2780832678711707, 399.23409269442294, 101, 3239, 129.0, 1095.0000000000007, 1329.6, 2024.04, 4.995055954043916, 688.6231664296827, 3.6594155627579927], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 1793.1666666666672, 1260, 2464, 1775.5, 2182.0, 2277.0, 2464.0, 0.24208298963526165, 291.30817259144237, 1.190320168763225], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 382.7368421052632, 221, 1283, 230.0, 668.0, 1283.0, 1283.0, 0.113210470180958, 7.2945923566546895, 0.2530884765892664], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 117.60000000000001, 110, 126, 117.0, 125.4, 126.0, 126.0, 0.0905999528880245, 0.07033883061130809, 0.032205452003164964], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 360.7142857142858, 218, 544, 429.0, 536.5, 544.0, 544.0, 0.08956216893983981, 0.13880386924563065, 0.20142741705903425], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f28cbe6b-5bbd-4842-98e3-14562dda81c9", 1, 0, 0.0, 662.0, 662, 662, 662.0, 662.0, 662.0, 662.0, 1.5105740181268883, 0.27290643882175225, 1.0414699773413896], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 106.7, 103, 112, 106.5, 111.7, 112.0, 112.0, 0.04583266494030295, 0.034061189472236866, 0.023005849393863007], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 161.7, 102, 438, 108.0, 426.90000000000003, 438.0, 438.0, 0.04576282045415023, 0.012245129691833168, 0.026099108540257553], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 149.20000000000002, 102, 328, 108.5, 326.1, 328.0, 328.0, 0.045832454877948174, 0.012353278853821969, 0.026944470543481248], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 187.0, 103, 451, 108.5, 442.0, 451.0, 451.0, 0.04576009810965035, 0.012333776443616695, 0.026946620273553865], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 119.0, 115, 125, 117.0, 125.0, 125.0, 125.0, 0.23961661341853036, 0.07066818091054314, 0.14812237919329074], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1239.722222222222, 824, 2009, 1166.5, 1698.0, 1803.5, 2009.0, 0.23239200227227735, 278.02162724968366, 0.45888342636186014], "isController": false}, {"data": ["deleteBook", 14, 3, 21.428571428571427, 645.8571428571428, 134, 2315, 524.0, 1713.0, 2315.0, 2315.0, 0.0807042018066212, 0.016556295864486113, 0.05402610384613167], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, 21.428571428571427, 645.8571428571428, 134, 2315, 524.0, 1713.0, 2315.0, 2315.0, 0.08170697544121767, 0.016762012749206277, 0.05469739420405734], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, 34.78260869565217, 1182.6956521739128, 279, 2218, 1172.0, 1903.6000000000004, 2172.7999999999993, 2218.0, 0.09247234875745307, 0.028850493319877935, 0.04172092297455402], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=da3504c6-c9d5-4b1f-b3f9-85c3889d3ecf", 1, 0, 0.0, 435.0, 435, 435, 435.0, 435.0, 435.0, 435.0, 2.2988505747126435, 0.41531968390804597, 1.5849497126436782], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 137.41176470588232, 105, 329, 113.0, 324.2, 329.0, 329.0, 0.11866370705420838, 0.0422357725705351, 0.0670891661780514], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 109.85714285714285, 105, 114, 110.0, 114.0, 114.0, 114.0, 0.03971293223271778, 0.010703876265849717, 0.02338564271125862], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 112.8235294117647, 106, 133, 111.0, 120.19999999999999, 133.0, 133.0, 0.11866536367443808, 0.08818783374633533, 0.059564450125645686], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 110.00000000000001, 105, 114, 110.0, 114.0, 114.0, 114.0, 0.03971293223271778, 0.010703876265849717, 0.023346860550875103], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 155.35294117647058, 105, 644, 112.0, 385.5999999999998, 644.0, 644.0, 0.11866287876143874, 2.0825035293481218, 0.0692768173743395], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 194.52941176470586, 104, 1331, 111.0, 534.9999999999993, 1331.0, 1331.0, 0.11866287876143874, 6.310870621252521, 0.06916093565679902], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 239.06666666666672, 105, 963, 112.0, 589.8000000000002, 963.0, 963.0, 0.09104538308862357, 5.484423320440296, 0.05300311299339011], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 242.2, 105, 842, 114.0, 533.6000000000001, 842.0, 842.0, 0.0910575422962284, 1.8078360516539085, 0.05309911499657017], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f28cbe6b-5bbd-4842-98e3-14562dda81c9", 3, 0, 0.0, 1361.3333333333333, 261, 2944, 879.0, 2944.0, 2944.0, 2944.0, 0.04625774817281895, 0.029739274948345516, 0.029663985644678818], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 127.13333333333334, 103, 330, 111.0, 214.20000000000007, 330.0, 330.0, 0.09116933792826797, 0.06775377555020695, 0.04576273407727513], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 110.57142857142857, 107, 115, 111.0, 115.0, 115.0, 115.0, 0.039712706931569336, 0.010626251659423826, 0.022648653171910636], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 166.53333333333333, 101, 344, 111.0, 332.6, 344.0, 344.0, 0.09117432530999271, 0.03352555920252857, 0.05148737615487478], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 116.42857142857143, 110, 124, 115.0, 124.0, 124.0, 124.0, 0.039710679336264355, 0.029511549780173025, 0.01993289958871082], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 210.14285714285714, 118, 334, 130.0, 334.0, 334.0, 334.0, 0.041146216017634095, 0.03238657237325496, 0.014626193975018369], "isController": false}, {"data": ["deleteAccount", 14, 3, 21.428571428571427, 652.5714285714286, 110, 2142, 546.0, 1610.5, 2142.0, 2142.0, 0.0841604097409663, 0.016772202192378675, 0.057267354703064044], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 19, 0, 0.0, 1855.2105263157894, 971, 3239, 1737.0, 2785.0, 3239.0, 3239.0, 0.0996193492234934, 0.051560795984815916, 0.045821009261977914], "isController": false}, {"data": ["goToProfile", 15, 3, 20.0, 356.6666666666668, 109, 1879, 227.0, 1136.8000000000004, 1879.0, 1879.0, 0.07936172013883011, 0.16149800041532633, 0.051290611706911876], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 228.71428571428572, 218, 239, 227.0, 239.0, 239.0, 239.0, 0.03968456440521342, 0.06150332393659541, 0.08925151545430322], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 123.15789473684211, 106, 329, 112.0, 117.0, 329.0, 329.0, 0.11328809759471481, 0.08419164284138474, 0.05686531461297208], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 144.6315789473684, 103, 339, 112.0, 332.0, 339.0, 339.0, 0.11329012408249906, 0.03926956192497808, 0.06411000545581387], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 748.1666666666667, 603, 893, 754.5, 893.0, 893.0, 893.0, 0.10449866764198756, 30.726077969068392, 0.05959689638957103], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1052.1666666666667, 949, 1149, 1054.0, 1149.0, 1149.0, 1149.0, 0.10393389804084603, 93.5199041534584, 0.059173303279114485], "isController": false}, {"data": ["addBook", 58, 9, 15.517241379310345, 1208.4310344827584, 577, 3631, 940.0, 2258.0, 2514.199999999999, 3631.0, 0.28042895960855985, 76.29523786751908, 1.021847961873749], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 250.5, 106, 334, 310.0, 334.0, 334.0, 334.0, 0.10516168609236702, 0.18608688984313382, 0.05822917579528525], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 135.76923076923077, 106, 426, 113.0, 303.5999999999999, 426.0, 426.0, 0.06011393903521752, 0.04467451914628958, 0.03017437955478692], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 193.0, 105, 340, 112.0, 339.2, 340.0, 340.0, 0.060114772974247756, 0.01608539823724989, 0.034284206461875674], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 208.8461538461538, 104, 337, 115.0, 336.6, 337.0, 337.0, 0.060052291687838946, 0.016185969243987842, 0.03530417929304595], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 205.18518518518525, 105, 717, 115.5, 443.5, 478.0, 717.0, 0.23318176518596245, 0.17329230791652092, 0.11271970094438614], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 125.23076923076925, 105, 322, 108.0, 238.79999999999993, 322.0, 322.0, 0.06011560693641619, 0.016203034682080925, 0.03540010838150289], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 713.2407407407408, 510, 1016, 669.0, 886.5, 961.0, 1016.0, 0.2334105605311387, 68.63045475617241, 0.11738910026712542], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 111.5, 105, 117, 112.0, 117.0, 117.0, 117.0, 0.10551862403714256, 0.078417649308853, 0.05925118048960641], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 176.20370370370367, 102, 464, 116.0, 337.0, 455.5, 464.0, 0.23361655735719108, 0.413391798760967, 0.11361430230847769], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 805.5882352941177, 107, 1461, 1186.0, 1380.1999999999998, 1461.0, 1461.0, 0.07793553356041609, 41.2595496099785, 0.04187781370198369], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 201.78947368421055, 107, 1176, 111.0, 342.0, 1176.0, 1176.0, 0.11329282617899074, 5.3942490194953105, 0.06609136395618549], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1031.9814814814815, 710, 1389, 996.0, 1272.5, 1306.0, 1389.0, 0.2331445150594087, 209.7838444747988, 0.11702761791067974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 550.0588235294117, 106, 1008, 655.0, 1000.0, 1008.0, 1008.0, 0.07793553356041609, 13.488434596041792, 0.041953922621476285], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 194.36842105263162, 105, 866, 111.0, 331.0, 866.0, 866.0, 0.11329079959453818, 1.782152320225389, 0.06620081725895892], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 121.64285714285715, 105, 157, 115.5, 148.0, 157.0, 157.0, 0.09748421103939059, 0.07282756000501348, 0.03465259064290837], "isController": false}, {"data": ["deleteBooks", 14, 3, 21.428571428571427, 688.0714285714287, 115, 2799, 571.0, 2041.5, 2799.0, 2799.0, 0.08276432857438444, 0.016978926502320357, 0.05579779824716975], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 9, 5.294117647058823, 211.18235294117653, 105, 2735, 119.0, 350.30000000000007, 514.0999999999991, 2098.129999999993, 0.6786427145708582, 1.4489770459081837, 0.3267722367764471], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 118.9, 112, 138, 117.5, 136.4, 138.0, 138.0, 0.04610015720153606, 0.03570061002033017, 0.01638716525523352], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b39a8b17-0e1a-454b-ad5c-b96b090911d7", 1, 0, 0.0, 618.0, 618, 618, 618.0, 618.0, 618.0, 618.0, 1.6181229773462784, 0.2923366707119741, 1.1156199433656957], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b39a8b17-0e1a-454b-ad5c-b96b090911d7", 3, 0, 0.0, 421.3333333333333, 216, 548, 500.0, 548.0, 548.0, 548.0, 0.019275745971369093, 0.02657317193644144, 0.012361074076691769], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 364.61538461538464, 215, 743, 429.0, 627.8, 743.0, 743.0, 0.06002040693835904, 0.09301990801872637, 0.13498730193265712], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=50e0e001-880b-4ddc-98dc-6ce9c9405717", 1, 0, 0.0, 949.0, 949, 949, 949.0, 949.0, 949.0, 949.0, 1.053740779768177, 0.1903730900948367, 0.7265048735511065], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=53bbb59e-6067-427a-86ed-0686c4e8cad9", 1, 0, 0.0, 1284.0, 1284, 1284, 1284.0, 1284.0, 1284.0, 1284.0, 0.778816199376947, 0.1407040985202492, 0.5369572624610591], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 116.88235294117648, 110, 124, 117.0, 122.4, 124.0, 124.0, 0.12036335573035777, 0.09767768419133525, 0.04278541160727561], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cdc26e6d-67ab-44f2-a54c-6f479dd837eb", 1, 0, 0.0, 536.0, 536, 536, 536.0, 536.0, 536.0, 536.0, 1.8656716417910448, 0.3370598180970149, 1.2862931436567164], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 111.88235294117648, 108, 124, 111.0, 118.39999999999999, 124.0, 124.0, 0.07793767736552312, 0.057920480932776464, 0.0391210607088661], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 19, 0, 0.0, 674.684210526316, 287, 2027, 540.0, 991.0, 2027.0, 2027.0, 0.09925195369635172, 0.060966287963872295, 0.04487661578262778], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 165.8235294117647, 105, 425, 110.0, 348.19999999999993, 425.0, 425.0, 0.07793874931230516, 0.08971373269301301, 0.04059906817348249], "isController": false}, {"data": ["login", 19, 0, 0.0, 3367.1052631578946, 2147, 5047, 3172.0, 5023.0, 5047.0, 5047.0, 0.0955364370942844, 36.22209801787034, 0.19417132668684664], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 319.3, 215, 559, 221.0, 549.8000000000001, 559.0, 559.0, 0.04573791261314416, 0.0708848313643162, 0.10286563744928809], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 140.00000000000003, 108, 335, 118.0, 312.0, 335.0, 335.0, 0.10921046581137628, 0.08841355093518646, 0.038820907768887664], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=35d71ab1-d4cf-470e-bd64-3cb8a594b107", 1, 0, 0.0, 2799.0, 2799, 2799, 2799.0, 2799.0, 2799.0, 2799.0, 0.3572704537334762, 0.0645459315827081, 0.24632123079671311], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/53bbb59e-6067-427a-86ed-0686c4e8cad9", 3, 0, 0.0, 436.66666666666663, 221, 760, 329.0, 760.0, 760.0, 760.0, 0.02073584605707887, 0.02450906804467884, 0.013297401280092897], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 425.73333333333335, 216, 1073, 438.0, 824.6000000000001, 1073.0, 1073.0, 0.09098408385093167, 7.388180087071768, 0.20307339496494078], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4af40c3d-2c36-4093-9e5d-4cfb61873e19", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 0.4221122955607477, 1.6108717873831777], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=481b97e0-6e9d-4dd2-913b-7032dbb44b0a", 1, 0, 0.0, 276.0, 276, 276, 276.0, 276.0, 276.0, 276.0, 3.6231884057971016, 0.6545799365942029, 2.4980185688405796], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/35d71ab1-d4cf-470e-bd64-3cb8a594b107", 3, 0, 0.0, 373.3333333333333, 305, 497, 318.0, 497.0, 497.0, 497.0, 0.03182449849894449, 0.026530774953058864, 0.020408288425429896], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/50e0e001-880b-4ddc-98dc-6ce9c9405717", 3, 0, 0.0, 942.6666666666666, 217, 2142, 469.0, 2142.0, 2142.0, 2142.0, 0.027383506001551733, 0.02746373111679065, 0.017560386335630503], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4af40c3d-2c36-4093-9e5d-4cfb61873e19", 3, 0, 0.0, 730.0, 197, 1275, 718.0, 1275.0, 1275.0, 1275.0, 0.02751662462737904, 0.027597239738592065, 0.01764575212107315], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/44f1cf9b-b360-404f-981d-9199988d41a2", 2, 0, 0.0, 235.0, 232, 238, 235.0, 238.0, 238.0, 238.0, 0.014787758693353642, 0.029228929292331805, 0.009191805086249602], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/481b97e0-6e9d-4dd2-913b-7032dbb44b0a", 3, 0, 0.0, 516.6666666666666, 362, 642, 546.0, 642.0, 642.0, 642.0, 0.056629417094533376, 0.025623336510872848, 0.03631508843627303], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/da3504c6-c9d5-4b1f-b3f9-85c3889d3ecf", 3, 0, 0.0, 912.6666666666666, 313, 1879, 546.0, 1879.0, 1879.0, 1879.0, 0.026055010812829488, 0.026300972828966224, 0.01670845419963349], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 119.15384615384615, 109, 140, 117.0, 138.8, 140.0, 140.0, 0.06142390051218083, 0.050926651889493676, 0.02183427713518928], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6dd99191-f528-4ebf-bc01-fb311940d4b3", 1, 0, 0.0, 606.0, 606, 606, 606.0, 606.0, 606.0, 606.0, 1.6501650165016502, 0.29812551567656764, 1.1377114273927393], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 920.7058823529412, 220, 1571, 1295.0, 1493.3999999999999, 1571.0, 1571.0, 0.07789625135745673, 54.86794383823469, 0.16346667959209857], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cdc26e6d-67ab-44f2-a54c-6f479dd837eb", 3, 0, 0.0, 653.6666666666666, 300, 1079, 582.0, 1079.0, 1079.0, 1079.0, 0.01683161650844947, 0.023203742159271977, 0.010793712409389799], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 126.11764705882354, 111, 169, 120.0, 153.79999999999998, 169.0, 169.0, 0.07569921584518174, 0.05877038730167918, 0.02690870563246695], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9d9313e7-d408-4b68-9d55-234ebf182c51", 1, 0, 0.0, 210.0, 210, 210, 210.0, 210.0, 210.0, 210.0, 4.761904761904763, 1.5206473214285714, 2.8413318452380953], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 336.05882352941177, 220, 1441, 227.0, 664.1999999999994, 1441.0, 1441.0, 0.11856935609864971, 8.517077692570583, 0.2648807266383495], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 6, 50.0, 638.3333333333333, 109, 1257, 590.5, 1256.1, 1257.0, 1257.0, 0.14082688854725328, 84.25780012263675, 0.20542984840572226], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6dd99191-f528-4ebf-bc01-fb311940d4b3", 3, 0, 0.0, 413.33333333333337, 246, 697, 297.0, 697.0, 697.0, 697.0, 0.026528482747643387, 0.026606202911943124, 0.01701208040783121], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7b0dd80e-7b0e-426f-bb0d-2c06d477b58e", 3, 0, 0.0, 589.3333333333334, 227, 1106, 435.0, 1106.0, 1106.0, 1106.0, 0.04671951162537181, 0.03003614435550434, 0.029960103483718255], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7b0dd80e-7b0e-426f-bb0d-2c06d477b58e", 1, 0, 0.0, 683.0, 683, 683, 683.0, 683.0, 683.0, 683.0, 1.4641288433382138, 0.26451546486090777, 1.0094482064421668], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 111.14285714285714, 105, 121, 110.0, 118.0, 121.0, 121.0, 0.08975279515847778, 0.06670105187070469, 0.045051696007282795], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 140.9285714285714, 103, 341, 109.0, 337.5, 341.0, 341.0, 0.08975394596812453, 0.02401619257350207, 0.05118779730994602], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 202.35714285714286, 106, 333, 113.5, 332.5, 333.0, 333.0, 0.08975452138401471, 0.024191648341785218, 0.05276584167302428], "isController": false}, {"data": ["register", 23, 8, 34.78260869565217, 1182.6956521739128, 279, 2218, 1172.0, 1903.6000000000004, 2172.7999999999993, 2218.0, 0.0933093163266962, 0.02911161924119241, 0.04209853920208364], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 199.6428571428571, 105, 434, 111.0, 423.5, 434.0, 434.0, 0.08962523846715235, 0.024156802555599658, 0.05277736210516882], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 27.586206896551722, 0.6284367635506677], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 10.344827586206897, 0.2356637863315004], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 10.344827586206897, 0.2356637863315004], "isController": false}, {"data": ["401/Unauthorized", 15, 51.724137931034484, 1.178318931657502], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1273, 29, "401/Unauthorized", 15, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
