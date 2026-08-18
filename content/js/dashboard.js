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

    var data = {"OkPercent": 98.1981981981982, "KoPercent": 1.8018018018018018};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.761204481792717, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.00980392156862745, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9eef38f0-2ced-4f36-9a5c-26d067744f38"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7770e8f3-d0cc-45ea-aede-ce313822cd0b"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/34016bcc-cbe7-4661-90fc-f4a3b94d083b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fba37e4f-6cb8-4e6d-a9cf-404423017d21"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cf766591-f7f2-4a29-ae73-4e3aa0cf0bf8"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7105263157894737, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a4205be1-5b71-47d1-add9-929de45acfdf"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3f492e1f-445d-43c5-bf42-56a6d1aa2cb4"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f3e00b96-4599-473b-9fb7-570bf175639c"], "isController": false}, {"data": [0.6363636363636364, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d20f8661-3562-418d-be13-416b7d5a32ee"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f4f610dc-4293-49cd-b92d-f5e0e44475bb"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fba37e4f-6cb8-4e6d-a9cf-404423017d21"], "isController": false}, {"data": [0.631578947368421, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c2781e67-ad15-488a-8905-94574b2075e9"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f05f0c34-c2d6-4005-a34f-08d64cdc870d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=512e741b-7fd8-4180-a46b-dcad5fb4e385"], "isController": false}, {"data": [0.21739130434782608, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=34016bcc-cbe7-4661-90fc-f4a3b94d083b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cf766591-f7f2-4a29-ae73-4e3aa0cf0bf8"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.21739130434782608, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/3f492e1f-445d-43c5-bf42-56a6d1aa2cb4"], "isController": false}, {"data": [0.3, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7770e8f3-d0cc-45ea-aede-ce313822cd0b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f3e00b96-4599-473b-9fb7-570bf175639c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.47058823529411764, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9409937888198758, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/892c38a1-f29d-4f7e-95ea-3c38b0a50006"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d20f8661-3562-418d-be13-416b7d5a32ee"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a4205be1-5b71-47d1-add9-929de45acfdf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/d1e615b8-4d3b-4711-a1ef-0c7929a2ecdf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f4f610dc-4293-49cd-b92d-f5e0e44475bb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c2781e67-ad15-488a-8905-94574b2075e9"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/f6317d94-f80b-4220-b7c2-2eb6e6ebf80c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9eef38f0-2ced-4f36-9a5c-26d067744f38"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/512e741b-7fd8-4180-a46b-dcad5fb4e385"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1221, 22, 1.8018018018018018, 420.067158067158, 115, 2266, 134.0, 1169.8, 1414.4999999999993, 1889.4599999999998, 4.781709666807651, 668.3665718267325, 3.4887514416600087], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 51, 0, 0.0, 1963.019607843137, 1429, 2560, 1894.0, 2387.2, 2523.2, 2560.0, 0.2470367697278236, 297.2675228085174, 1.2146778667769451], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9eef38f0-2ced-4f36-9a5c-26d067744f38", 1, 0, 0.0, 424.0, 424, 424, 424.0, 424.0, 424.0, 424.0, 2.3584905660377355, 0.4260944870283019, 1.626068691037736], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7770e8f3-d0cc-45ea-aede-ce313822cd0b", 1, 0, 0.0, 626.0, 626, 626, 626.0, 626.0, 626.0, 626.0, 1.5974440894568689, 0.2886007388178914, 1.1013628194888179], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 733.9285714285714, 123, 2266, 522.0, 2016.5, 2266.0, 2266.0, 0.09270663647079079, 0.018261965778007337, 0.062377805203491066], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 733.9285714285714, 123, 2266, 522.0, 2016.5, 2266.0, 2266.0, 0.09351725059283257, 0.018421645903610433, 0.06292322818209144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 168.28571428571425, 117, 355, 119.0, 350.5, 355.0, 355.0, 0.07192581366076703, 0.026962145829587197, 0.0405887159957872], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 153.2142857142857, 118, 353, 120.0, 350.5, 353.0, 353.0, 0.07192174913693901, 0.05344965927071346, 0.03610134673475259], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 209.42857142857144, 116, 934, 118.5, 644.0, 934.0, 934.0, 0.0719261831857134, 1.5286220452467068, 0.04191345803107211], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 227.64285714285714, 116, 1166, 120.0, 762.5, 1166.0, 1166.0, 0.0719261831857134, 4.640809190432276, 0.04184321761780481], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/34016bcc-cbe7-4661-90fc-f4a3b94d083b", 3, 0, 0.0, 530.3333333333334, 244, 1028, 319.0, 1028.0, 1028.0, 1028.0, 0.06340886033141697, 0.029392648799458913, 0.0406625829599256], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fba37e4f-6cb8-4e6d-a9cf-404423017d21", 1, 0, 0.0, 236.0, 236, 236, 236.0, 236.0, 236.0, 236.0, 4.237288135593221, 0.7655256885593221, 2.9214115466101696], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cf766591-f7f2-4a29-ae73-4e3aa0cf0bf8", 3, 0, 0.0, 390.0, 228, 480, 462.0, 480.0, 480.0, 480.0, 0.02066258006749776, 0.024422470125352987, 0.013250417556305532], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 236.3571428571429, 118, 495, 235.0, 384.5, 495.0, 495.0, 0.0930486046032474, 0.18250793197814685, 0.06014148788041925], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 134.00000000000003, 115, 356, 119.5, 195.00000000000017, 356.0, 356.0, 0.09716343497033479, 0.07220837305900857, 0.04877148981909383], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 132.75, 115, 350, 118.0, 193.90000000000015, 350.0, 350.0, 0.09716166486512746, 0.04423986937828679, 0.054392504281185854], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 895.0, 808, 949, 927.5, 949.0, 949.0, 949.0, 0.050119870022470404, 14.736905922915641, 0.028583988372190155], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1168.3333333333333, 1031, 1349, 1154.0, 1349.0, 1349.0, 1349.0, 0.05007929221267006, 45.06143516296636, 0.028511940781236957], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 274.5, 117, 354, 352.5, 354.0, 354.0, 354.0, 0.05036387902596258, 0.08912045780766036, 0.02788703067160233], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 137.6153846153846, 116, 354, 120.0, 261.5999999999999, 354.0, 354.0, 0.07920406012197424, 0.05886161108674063, 0.03975672549091285], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 137.30769230769232, 116, 351, 119.0, 260.5999999999999, 351.0, 351.0, 0.07920212992804791, 0.021192757422153444, 0.045169964724589826], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 191.6153846153846, 117, 357, 120.0, 356.6, 357.0, 357.0, 0.07920261246770971, 0.021347579141687383, 0.04656247334527465], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 190.07692307692307, 116, 353, 119.0, 352.6, 353.0, 353.0, 0.07920212992804791, 0.021347449082169165, 0.04663953549473915], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 118.83333333333334, 117, 121, 119.0, 121.0, 121.0, 121.0, 0.05046299800671158, 0.03750228660459718, 0.028336156107284332], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 771.7368421052632, 116, 1509, 1049.0, 1421.0, 1509.0, 1509.0, 0.09346805852084338, 44.2765245593473, 0.05072141045759994], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 270.5625, 117, 1158, 119.5, 917.9000000000002, 1158.0, 1158.0, 0.09702909053420579, 10.936251603254114, 0.05600018799386291], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 542.9473684210525, 117, 1056, 686.0, 942.0, 1056.0, 1056.0, 0.09346070223420268, 14.475379561128218, 0.05080868870945527], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 250.24999999999997, 117, 944, 119.0, 933.5, 944.0, 944.0, 0.09702438344036336, 3.588930995955296, 0.05609222167646006], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a4205be1-5b71-47d1-add9-929de45acfdf", 3, 0, 0.0, 391.6666666666667, 274, 493, 408.0, 493.0, 493.0, 493.0, 0.058973854924316886, 0.026684133575781404, 0.037818520247690196], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 443.5714285714286, 121, 874, 425.5, 836.0, 874.0, 874.0, 0.09372447681658119, 0.018462466694337702, 0.06366412913224524], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3f492e1f-445d-43c5-bf42-56a6d1aa2cb4", 1, 0, 0.0, 874.0, 874, 874, 874.0, 874.0, 874.0, 874.0, 1.1441647597254005, 0.20670945366132723, 0.7888479691075515], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 366.46153846153845, 236, 704, 247.0, 613.9999999999999, 704.0, 704.0, 0.07914330417206972, 0.12265666379011196, 0.17799514600417635], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f3e00b96-4599-473b-9fb7-570bf175639c", 1, 0, 0.0, 427.0, 427, 427, 427.0, 427.0, 427.0, 427.0, 2.34192037470726, 0.42310084894613587, 1.6146443208430914], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 777.1818181818181, 238, 1429, 749.5, 1348.5, 1418.9499999999998, 1429.0, 0.09336553029499263, 0.05735050640190466, 0.04221507863923983], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 132.68421052631578, 117, 355, 120.0, 131.0, 355.0, 355.0, 0.09346851832720869, 0.06946244379590412, 0.04691681486346218], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 179.89473684210526, 115, 354, 118.0, 352.0, 354.0, 354.0, 0.09346346070599347, 0.09889179698260596, 0.049172079758765884], "isController": false}, {"data": ["login", 22, 0, 0.0, 2906.5, 1847, 4207, 2927.0, 3831.7999999999997, 4162.599999999999, 4207.0, 0.09189525611625585, 30.108627306779784, 0.18020901210511148], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 140.93750000000003, 119, 365, 122.5, 216.60000000000014, 365.0, 365.0, 0.09913811798675266, 0.08025927715919723, 0.03524050287810349], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d20f8661-3562-418d-be13-416b7d5a32ee", 1, 0, 0.0, 609.0, 609, 609, 609.0, 609.0, 609.0, 609.0, 1.6420361247947455, 0.29665691707717573, 1.1321069376026274], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f4f610dc-4293-49cd-b92d-f5e0e44475bb", 3, 0, 0.0, 404.0, 215, 569, 428.0, 569.0, 569.0, 569.0, 0.01968917357975428, 0.02327193661070566, 0.012626195296912737], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fba37e4f-6cb8-4e6d-a9cf-404423017d21", 3, 0, 0.0, 491.33333333333337, 231, 900, 343.0, 900.0, 900.0, 900.0, 0.10307861462341947, 0.04664038877817482, 0.06610184596619022], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 906.7894736842106, 237, 1629, 1168.0, 1543.0, 1629.0, 1629.0, 0.09340510778457832, 58.88171867702726, 0.19749208053732517], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c2781e67-ad15-488a-8905-94574b2075e9", 3, 0, 0.0, 358.6666666666667, 239, 495, 342.0, 495.0, 495.0, 495.0, 0.019045321516769406, 0.026255513223801572, 0.01221330839454288], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 416.0, 236, 1520, 244.0, 1110.0, 1520.0, 1520.0, 0.071877438698813, 6.245610943789275, 0.1603404359366657], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, 40.0, 820.4000000000001, 118, 1467, 1162.5, 1459.1, 1467.0, 1467.0, 0.08184980560671168, 58.761254348270924, 0.1324304276652343], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f05f0c34-c2d6-4005-a34f-08d64cdc870d", 1, 0, 0.0, 261.0, 261, 261, 261.0, 261.0, 261.0, 261.0, 3.8314176245210727, 1.2235093390804597, 2.286129070881226], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=512e741b-7fd8-4180-a46b-dcad5fb4e385", 1, 0, 0.0, 798.0, 798, 798, 798.0, 798.0, 798.0, 798.0, 1.2531328320802004, 0.22639606829573933, 0.8639763471177945], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 1267.7391304347827, 406, 2102, 1353.0, 1865.6000000000001, 2065.5999999999995, 2102.0, 0.09788233691951519, 0.030837590860343184, 0.04416175747735939], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 124.41176470588235, 120, 130, 124.0, 129.2, 130.0, 130.0, 0.0959947598154642, 0.07452718169266996, 0.03412313727815329], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 442.93749999999994, 234, 1275, 247.0, 1128.0000000000002, 1275.0, 1275.0, 0.09695500681714891, 14.630465554461445, 0.21495322678382062], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 20, 0, 0.0, 397.5000000000001, 238, 1535, 246.5, 702.8000000000003, 1493.9999999999995, 1535.0, 0.12445550715619165, 7.627840356642813, 0.2783111971064095], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 3, 0, 0.0, 119.33333333333333, 118, 120, 120.0, 120.0, 120.0, 120.0, 0.03374388392103932, 0.025077241859288005, 0.016937847983802934], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 3, 0, 0.0, 120.66666666666667, 118, 126, 118.0, 126.0, 126.0, 126.0, 0.0337408477950356, 0.00902831278890601, 0.01924282725810624], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 3, 0, 0.0, 121.33333333333333, 116, 131, 117.0, 131.0, 131.0, 131.0, 0.0337389504937133, 0.009093701500258665, 0.019834812692593174], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=34016bcc-cbe7-4661-90fc-f4a3b94d083b", 1, 0, 0.0, 330.0, 330, 330, 330.0, 330.0, 330.0, 330.0, 3.0303030303030303, 0.5474668560606061, 2.089251893939394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 3, 0, 0.0, 120.0, 119, 121, 120.0, 121.0, 121.0, 121.0, 0.033742745309758404, 0.009094724321770819, 0.019869995529086245], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 122.0, 121, 123, 122.0, 123.0, 123.0, 123.0, 0.22535211267605634, 0.0664612676056338, 0.13930457746478872], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cf766591-f7f2-4a29-ae73-4e3aa0cf0bf8", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 0.4221122955607477, 1.6108717873831777], "isController": false}, {"data": ["https://demoqa.com/books", 51, 0, 0.0, 1378.3529411764705, 935, 2065, 1342.0, 1892.6, 2019.8, 2065.0, 0.25360264940179605, 303.39693523062925, 0.5007661690336247], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 1267.7391304347827, 406, 2102, 1353.0, 1865.6000000000001, 2065.5999999999995, 2102.0, 0.09614178823726122, 0.03028923525477574, 0.04337647086485809], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 4, 0, 0.0, 234.5, 116, 353, 234.5, 353.0, 353.0, 353.0, 0.05120917668446186, 0.013802473403233859, 0.030155403848369625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 4, 0, 0.0, 118.5, 117, 119, 119.0, 119.0, 119.0, 119.0, 0.051363046855939495, 0.013843946222889942, 0.030195853718042558], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 160.00000000000003, 115, 357, 119.0, 356.2, 357.0, 357.0, 0.09596062227641175, 0.025864386472939104, 0.05641435020546862], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 200.2941176470588, 116, 357, 119.0, 352.2, 357.0, 357.0, 0.09609025701317567, 0.025899327085582506, 0.056584399393500906], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 119.94117647058823, 117, 132, 119.0, 123.19999999999999, 132.0, 132.0, 0.09608862762830658, 0.07140961486830207, 0.04823198691498983], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 4, 0, 0.0, 117.25, 116, 118, 117.5, 118.0, 118.0, 118.0, 0.05136502555410021, 0.013744157228343223, 0.029294116136322778], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 159.0, 116, 356, 117.0, 353.6, 356.0, 356.0, 0.095961163952471, 0.025677108323219778, 0.054727851316643615], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 4, 0, 0.0, 119.75, 118, 122, 119.5, 122.0, 122.0, 122.0, 0.05136172780852347, 0.03817019029520153, 0.02578117977888776], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 584.2142857142857, 120, 1298, 494.0, 1163.0, 1298.0, 1298.0, 0.09479314780960119, 0.018302694833773444, 0.06450906459475929], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 4, 0, 0.0, 122.75, 120, 126, 122.5, 126.0, 126.0, 126.0, 0.05070479667376534, 0.03991022081938951, 0.01802397069262752], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1451.2727272727277, 759, 2184, 1367.0, 1924.1, 2146.0499999999993, 2184.0, 0.0931193281863741, 0.04819652728396316, 0.04283125349197481], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 4, 0, 0.0, 355.75, 238, 472, 356.5, 472.0, 472.0, 472.0, 0.0511293188296499, 0.07924045799087341, 0.11499103639129267], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3f492e1f-445d-43c5-bf42-56a6d1aa2cb4", 3, 0, 0.0, 431.3333333333333, 205, 552, 537.0, 552.0, 552.0, 552.0, 0.028119112560807583, 0.028201492773388074, 0.018032113198174132], "isController": false}, {"data": ["addBook", 55, 8, 14.545454545454545, 1184.8363636363633, 611, 2398, 988.0, 2022.8, 2176.3999999999996, 2398.0, 0.27645692801061594, 85.25827595804891, 1.0053224634448543], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/7770e8f3-d0cc-45ea-aede-ce313822cd0b", 3, 0, 0.0, 584.6666666666667, 211, 1298, 245.0, 1298.0, 1298.0, 1298.0, 0.02449259507208987, 0.024564350721715134, 0.0157065144179743], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f3e00b96-4599-473b-9fb7-570bf175639c", 3, 0, 0.0, 653.6666666666666, 250, 1233, 478.0, 1233.0, 1233.0, 1233.0, 0.041643531371460304, 0.026772778144086615, 0.026704998958911715], "isController": false}, {"data": ["https://demoqa.com/books-0", 51, 0, 0.0, 228.49019607843138, 116, 484, 121.0, 478.6, 481.4, 484.0, 0.2553255400635811, 0.18974876561365742, 0.12342396712057874], "isController": false}, {"data": ["https://demoqa.com/books-3", 51, 0, 0.0, 797.0392156862747, 577, 1184, 714.0, 1047.8, 1068.0, 1184.0, 0.25509438492242126, 75.00621909794124, 0.12829453929203807], "isController": false}, {"data": ["https://demoqa.com/books-1", 51, 0, 0.0, 187.33333333333331, 115, 491, 121.0, 362.6, 442.5999999999999, 491.0, 0.2554470323065364, 0.4520215063861758, 0.12423107625845228], "isController": false}, {"data": ["https://demoqa.com/books-2", 51, 0, 0.0, 1136.1176470588236, 814, 1540, 1060.0, 1421.0, 1508.4, 1540.0, 0.2542537651991405, 228.77798485663328, 0.12762347198472485], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 20, 0, 0.0, 158.85, 119, 357, 122.5, 354.20000000000005, 356.9, 357.0, 0.12774002350416433, 0.09543077927801338, 0.04540758647999591], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 161, 8, 4.968944099378882, 184.90062111801242, 118, 728, 128.0, 350.0000000000001, 401.0000000000001, 644.9199999999994, 0.7345359648882683, 1.5655492794932158, 0.3539106768908598], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 3, 0, 0.0, 123.0, 122, 125, 122.0, 125.0, 125.0, 125.0, 0.03552986877635132, 0.027514830019186125, 0.012629758041593633], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/892c38a1-f29d-4f7e-95ea-3c38b0a50006", 1, 0, 0.0, 231.0, 231, 231, 231.0, 231.0, 231.0, 231.0, 4.329004329004329, 1.3824066558441557, 2.58302895021645], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 143.14285714285714, 120, 356, 126.0, 250.5, 356.0, 356.0, 0.07310857668045286, 0.05932932345845344, 0.025987814366879726], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d20f8661-3562-418d-be13-416b7d5a32ee", 3, 0, 0.0, 468.6666666666667, 425, 495, 486.0, 495.0, 495.0, 495.0, 0.03332518717646797, 0.027781837356423984, 0.021370644120326143], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a4205be1-5b71-47d1-add9-929de45acfdf", 1, 0, 0.0, 244.0, 244, 244, 244.0, 244.0, 244.0, 244.0, 4.0983606557377055, 0.7404264856557378, 2.82562756147541], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 3, 0, 0.0, 243.0, 237, 251, 241.0, 251.0, 251.0, 251.0, 0.03369423603935487, 0.05221948495552361, 0.07577912656116627], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d1e615b8-4d3b-4711-a1ef-0c7929a2ecdf", 1, 0, 0.0, 875.0, 875, 875, 875.0, 875.0, 875.0, 875.0, 1.142857142857143, 0.36495535714285715, 0.6819196428571429], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 336.4705882352941, 236, 478, 246.0, 477.2, 478.0, 478.0, 0.0958951245790486, 0.148618713581006, 0.21567038272026265], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f4f610dc-4293-49cd-b92d-f5e0e44475bb", 1, 0, 0.0, 549.0, 549, 549, 549.0, 549.0, 549.0, 549.0, 1.8214936247723132, 0.3290784380692167, 1.2558344717668488], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c2781e67-ad15-488a-8905-94574b2075e9", 1, 0, 0.0, 421.0, 421, 421, 421.0, 421.0, 421.0, 421.0, 2.375296912114014, 0.42913078978622327, 1.6376558788598576], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f6317d94-f80b-4220-b7c2-2eb6e6ebf80c", 1, 0, 0.0, 526.0, 526, 526, 526.0, 526.0, 526.0, 526.0, 1.9011406844106464, 0.6071025427756653, 1.1343720294676805], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 129.15384615384613, 120, 192, 123.0, 167.99999999999997, 192.0, 192.0, 0.08066868131527183, 0.06688252972330642, 0.02867519531128803], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9eef38f0-2ced-4f36-9a5c-26d067744f38", 3, 0, 0.0, 303.0, 204, 471, 234.0, 471.0, 471.0, 471.0, 0.016571289688238806, 0.022844860621644314, 0.010626771056585431], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 126.26315789473685, 117, 147, 123.0, 146.0, 147.0, 147.0, 0.09257860654579475, 0.07187499238662776, 0.032908801545575475], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/512e741b-7fd8-4180-a46b-dcad5fb4e385", 3, 0, 0.0, 428.66666666666663, 241, 689, 356.0, 689.0, 689.0, 689.0, 0.026079246135925032, 0.026155650177338872, 0.016723995731696716], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 20, 0, 0.0, 134.85, 117, 358, 120.5, 169.80000000000013, 348.8499999999999, 358.0, 0.12455161418891988, 0.09256228359157036, 0.06251907196592268], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 20, 0, 0.0, 154.0, 116, 356, 118.0, 351.40000000000003, 355.8, 356.0, 0.12455006289778175, 0.042680290108234, 0.07050944478695712], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 20, 0, 0.0, 254.84999999999997, 118, 1417, 122.0, 355.9, 1363.9499999999994, 1417.0, 0.12455006289778175, 5.63540990398747, 0.07268663826925233], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 20, 0, 0.0, 189.50000000000003, 117, 913, 119.0, 462.40000000000026, 891.0999999999997, 913.0, 0.12454851164528583, 1.8629611214036617, 0.07280736237389462], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 27.272727272727273, 0.4914004914004914], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 9.090909090909092, 0.1638001638001638], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 9.090909090909092, 0.1638001638001638], "isController": false}, {"data": ["401/Unauthorized", 12, 54.54545454545455, 0.9828009828009828], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1221, 22, "401/Unauthorized", 12, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 161, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
