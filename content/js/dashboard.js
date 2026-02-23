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

    var data = {"OkPercent": 98.27586206896552, "KoPercent": 1.7241379310344827};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7553835800807537, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/889d9358-d0fe-4d33-b4b5-d7a680933e74"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e4c36942-1632-460a-8bf7-03c91b3df72c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f684c581-df36-4ea4-9859-dd2e76078ed9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/99ffba12-b38b-42d6-8e64-81f7236b50d6"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=103ef3bf-2b2e-4d1c-953e-1f86193594df"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/43638368-2a06-421b-ab40-4eda1cc05f84"], "isController": false}, {"data": [0.8214285714285714, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6e28caf0-bdde-40e9-9c1b-59f9ef5df967"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/92bf2d42-91bb-47c0-8402-d98fb3bbf312"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d72853e7-f679-42a3-8b2f-d57134a8073b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b77aa1c1-06c2-443f-aae8-e8bcbc6f187a"], "isController": false}, {"data": [0.78125, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cf3c0931-ac02-4919-b191-7f9290c9dc2c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7f3ecb6e-9a26-4b03-818e-989ea05b27c7"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.023809523809523808, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=de5aaed0-bedf-401d-bc45-98cd38bb9b76"], "isController": false}, {"data": [0.6470588235294118, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c86061ed-1b33-4c62-b45c-7677d9472a57"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9cc4bd83-3f9f-4cf8-9da1-f7083378b273"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.2391304347826087, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d72853e7-f679-42a3-8b2f-d57134a8073b"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6e28caf0-bdde-40e9-9c1b-59f9ef5df967"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=92bf2d42-91bb-47c0-8402-d98fb3bbf312"], "isController": false}, {"data": [0.7045454545454546, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/103ef3bf-2b2e-4d1c-953e-1f86193594df"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.37037037037037035, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e4c36942-1632-460a-8bf7-03c91b3df72c"], "isController": false}, {"data": [0.2391304347826087, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f684c581-df36-4ea4-9859-dd2e76078ed9"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=43638368-2a06-421b-ab40-4eda1cc05f84"], "isController": false}, {"data": [0.4523809523809524, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3017241379310345, 500, 1500, "addBook"], "isController": true}, {"data": [0.9074074074074074, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b77aa1c1-06c2-443f-aae8-e8bcbc6f187a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/7f3ecb6e-9a26-4b03-818e-989ea05b27c7"], "isController": false}, {"data": [0.9814814814814815, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cf3c0931-ac02-4919-b191-7f9290c9dc2c"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/de5aaed0-bedf-401d-bc45-98cd38bb9b76"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c86061ed-1b33-4c62-b45c-7677d9472a57"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9318181818181818, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1276, 22, 1.7241379310344827, 435.3409090909085, 135, 2177, 164.0, 1131.3, 1279.4499999999996, 1730.3000000000002, 4.959326526566988, 700.6617523905139, 3.62549867150486], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/889d9358-d0fe-4d33-b4b5-d7a680933e74", 1, 0, 0.0, 291.0, 291, 291, 291.0, 291.0, 291.0, 291.0, 3.4364261168384878, 1.0973743556701032, 2.0504456615120277], "isController": false}, {"data": ["see books", 54, 0, 0.0, 2131.0185185185173, 1706, 2646, 2091.0, 2484.0, 2579.0, 2646.0, 0.24610784992890217, 296.149726005624, 1.2101103753828344], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e4c36942-1632-460a-8bf7-03c91b3df72c", 1, 0, 0.0, 446.0, 446, 446, 446.0, 446.0, 446.0, 446.0, 2.242152466367713, 0.40507637331838564, 1.5458590246636772], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f684c581-df36-4ea4-9859-dd2e76078ed9", 3, 0, 0.0, 381.66666666666663, 227, 680, 238.0, 680.0, 680.0, 680.0, 0.04490412968312652, 0.028869028686254846, 0.02879594253768205], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/99ffba12-b38b-42d6-8e64-81f7236b50d6", 1, 0, 0.0, 237.0, 237, 237, 237.0, 237.0, 237.0, 237.0, 4.219409282700422, 1.3474090189873418, 2.517635812236287], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 521.2857142857143, 141, 829, 496.0, 778.0, 829.0, 829.0, 0.08654957745259866, 0.017049107612035336, 0.058235018422695774], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 521.2857142857143, 141, 829, 496.0, 778.0, 829.0, 829.0, 0.08728887004557725, 0.01719473835161204, 0.058732452599026104], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 247.85714285714283, 138, 454, 147.0, 449.0, 454.0, 454.0, 0.09652576203641779, 0.036183694558015435, 0.05447080181882115], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 168.78571428571428, 138, 449, 148.0, 302.0, 449.0, 449.0, 0.09672716720672668, 0.07188415453546779, 0.048552503851813984], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 290.6428571428571, 140, 1004, 148.5, 729.5, 1004.0, 1004.0, 0.09652509652509653, 2.0514141573014344, 0.05624795315085494], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=103ef3bf-2b2e-4d1c-953e-1f86193594df", 1, 0, 0.0, 639.0, 639, 639, 639.0, 639.0, 639.0, 639.0, 1.5649452269170578, 0.28272936228482004, 1.0789563771517996], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 201.0714285714286, 137, 954, 144.5, 551.0, 954.0, 954.0, 0.09672984046485597, 6.241186626840458, 0.05627280060525243], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/43638368-2a06-421b-ab40-4eda1cc05f84", 3, 0, 0.0, 410.6666666666667, 221, 571, 440.0, 571.0, 571.0, 571.0, 0.09512334326843808, 0.04211189675946477, 0.06100032104128353], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 293.2857142857143, 139, 737, 241.0, 587.0, 737.0, 737.0, 0.08652711079796538, 0.17318700594564862, 0.05592635384025859], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6e28caf0-bdde-40e9-9c1b-59f9ef5df967", 1, 0, 0.0, 599.0, 599, 599, 599.0, 599.0, 599.0, 599.0, 1.669449081803005, 0.3016094532554257, 1.1510068864774625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 148.79999999999998, 144, 153, 149.0, 152.4, 153.0, 153.0, 0.08876107294384974, 0.06596403956081022, 0.04455389794251833], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 162.79999999999995, 138, 411, 145.0, 256.80000000000007, 411.0, 411.0, 0.08876107294384974, 0.023750521471303545, 0.05062154941328931], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 801.6666666666666, 682, 1032, 701.5, 1032.0, 1032.0, 1032.0, 0.06990481294637135, 20.55433606447554, 0.03986758863347741], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1140.3333333333333, 994, 1327, 1125.0, 1327.0, 1327.0, 1327.0, 0.06965566881051335, 62.67629323730525, 0.03965747550442313], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 282.5, 136, 430, 279.5, 430.0, 430.0, 430.0, 0.07035069823067994, 0.12448775897850785, 0.03895395107108938], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 145.625, 137, 156, 145.5, 152.5, 156.0, 156.0, 0.09823906476410345, 0.07300774246629173, 0.049311405555419116], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/92bf2d42-91bb-47c0-8402-d98fb3bbf312", 3, 0, 0.0, 835.6666666666666, 519, 1251, 737.0, 1251.0, 1251.0, 1251.0, 0.031471612605429904, 0.026236588503419915, 0.02018199115647686], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 196.625, 137, 451, 144.5, 426.5, 451.0, 451.0, 0.09824751003966743, 0.026288884522332884, 0.056031783069497826], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 214.43749999999997, 139, 429, 145.5, 427.6, 429.0, 429.0, 0.09807286814102878, 0.026433702741136662, 0.057656119746972], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d72853e7-f679-42a3-8b2f-d57134a8073b", 3, 0, 0.0, 337.6666666666667, 225, 453, 335.0, 453.0, 453.0, 453.0, 0.020178105410422666, 0.02781714726990234, 0.012939735565928598], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 215.9375, 136, 445, 148.5, 432.40000000000003, 445.0, 445.0, 0.09806204876135374, 0.026430786580208625, 0.057745522854586236], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 144.5, 137, 149, 144.5, 149.0, 149.0, 149.0, 0.07035977297246587, 0.05228885471879544, 0.039508661581218636], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 805.1176470588236, 142, 1489, 996.0, 1444.2, 1489.0, 1489.0, 0.1038497721413823, 54.97870650145389, 0.0558025487483048], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 208.8, 141, 535, 145.0, 478.00000000000006, 535.0, 535.0, 0.0885587941834584, 0.023869362494760273, 0.05206288486175972], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 594.5882352941178, 138, 1191, 707.0, 1119.0, 1191.0, 1191.0, 0.10385040654379739, 17.97356548989902, 0.05590430605020251], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 164.0, 137, 443, 145.0, 267.80000000000007, 443.0, 443.0, 0.08876422446697083, 0.023924732375863234, 0.0522703392124838], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 550.2307692307693, 159, 1224, 567.0, 1016.7999999999998, 1224.0, 1224.0, 0.09345727205411895, 0.017705772244628003, 0.06392190970949166], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b77aa1c1-06c2-443f-aae8-e8bcbc6f187a", 1, 0, 0.0, 262.0, 262, 262, 262.0, 262.0, 262.0, 262.0, 3.8167938931297707, 0.6895574904580153, 2.6315004770992365], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 417.43750000000006, 287, 594, 303.5, 589.1, 594.0, 594.0, 0.09797138011058519, 0.1518365041362292, 0.22033993007292746], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cf3c0931-ac02-4919-b191-7f9290c9dc2c", 3, 0, 0.0, 338.0, 219, 452, 343.0, 452.0, 452.0, 452.0, 0.05004170141784821, 0.0321719922852377, 0.032090544203502915], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7f3ecb6e-9a26-4b03-818e-989ea05b27c7", 1, 0, 0.0, 662.0, 662, 662, 662.0, 662.0, 662.0, 662.0, 1.5105740181268883, 0.27290643882175225, 1.0414699773413896], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 667.5714285714286, 199, 1191, 667.0, 1117.4, 1185.1, 1191.0, 0.09719522354901416, 0.059702925402665925, 0.04394666846014996], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 144.52941176470588, 140, 151, 144.0, 151.0, 151.0, 151.0, 0.10384786898064154, 0.0771760041936213, 0.05212676235942359], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 241.94117647058823, 138, 440, 143.0, 428.8, 440.0, 440.0, 0.10385230979754909, 0.11954231294366319, 0.054097699060442046], "isController": false}, {"data": ["login", 21, 0, 0.0, 2580.0952380952376, 1430, 4010, 2552.0, 3456.6000000000004, 3961.7999999999993, 4010.0, 0.09393157308547326, 32.23483130895883, 0.1862251095309236], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 169.4, 140, 448, 151.0, 274.0000000000001, 448.0, 448.0, 0.08445755726222383, 0.06837433102576518, 0.03002202230805612], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=de5aaed0-bedf-401d-bc45-98cd38bb9b76", 1, 0, 0.0, 489.0, 489, 489, 489.0, 489.0, 489.0, 489.0, 2.044989775051125, 0.36945616053169733, 1.409924591002045], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 958.2941176470588, 288, 1639, 1248.0, 1595.8, 1639.0, 1639.0, 0.10375469947756458, 73.08191247566342, 0.2177310964277867], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c86061ed-1b33-4c62-b45c-7677d9472a57", 1, 0, 0.0, 567.0, 567, 567, 567.0, 567.0, 567.0, 567.0, 1.763668430335097, 0.3186315035273369, 1.2159667107583776], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9cc4bd83-3f9f-4cf8-9da1-f7083378b273", 1, 0, 0.0, 238.0, 238, 238, 238.0, 238.0, 238.0, 238.0, 4.201680672268908, 1.341747636554622, 2.5070575105042017], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 501.4285714285714, 287, 1155, 437.0, 1030.0, 1155.0, 1155.0, 0.09642338129248655, 8.378469466072744, 0.21509624258745255], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 3, 33.333333333333336, 906.111111111111, 139, 1473, 1144.0, 1473.0, 1473.0, 1473.0, 0.08775094332264072, 69.99491699613895, 0.15112662461121457], "isController": false}, {"data": ["register", 23, 8, 34.78260869565217, 1038.0434782608693, 336, 2121, 1017.0, 1822.6000000000001, 2072.5999999999995, 2121.0, 0.09347769540902588, 0.029164151913447782, 0.0421745071083691], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 147.92307692307693, 140, 160, 148.0, 158.0, 160.0, 160.0, 0.0625033054632697, 0.04852551547197208, 0.022217971863896648], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 397.6666666666667, 287, 688, 301.0, 631.0, 688.0, 688.0, 0.08848043697538474, 0.1371273959764996, 0.1989945765178819], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d72853e7-f679-42a3-8b2f-d57134a8073b", 1, 0, 0.0, 706.0, 706, 706, 706.0, 706.0, 706.0, 706.0, 1.41643059490085, 0.2558981055240793, 0.9765625], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6e28caf0-bdde-40e9-9c1b-59f9ef5df967", 3, 0, 0.0, 779.6666666666666, 328, 1595, 416.0, 1595.0, 1595.0, 1595.0, 0.02644826278993908, 0.02652574793483148, 0.016960637270891924], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=92bf2d42-91bb-47c0-8402-d98fb3bbf312", 1, 0, 0.0, 604.0, 604, 604, 604.0, 604.0, 604.0, 604.0, 1.6556291390728477, 0.29911268625827814, 1.1414786837748345], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 22, 0, 0.0, 585.3181818181819, 289, 1424, 566.5, 1299.1999999999998, 1423.55, 1424.0, 0.11468248589926708, 12.634316160065474, 0.2552560905522483], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/103ef3bf-2b2e-4d1c-953e-1f86193594df", 3, 0, 0.0, 353.3333333333333, 237, 517, 306.0, 517.0, 517.0, 517.0, 0.03263104082143207, 0.027203156101460783, 0.020925504693431372], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 240.11111111111114, 138, 446, 149.0, 446.0, 446.0, 446.0, 0.04133597883597884, 0.03071941395916005, 0.020748723751653438], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 174.77777777777777, 137, 427, 147.0, 427.0, 427.0, 427.0, 0.04133483975860453, 0.011060298919782854, 0.02357377579982915], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 240.88888888888889, 142, 439, 147.0, 439.0, 439.0, 439.0, 0.04133559913654526, 0.011141235704771966, 0.024300811211133058], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 290.5555555555555, 142, 606, 148.0, 606.0, 606.0, 606.0, 0.04133559913654526, 0.011141235704771966, 0.02434117800716484], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 159.0, 159, 159, 159.0, 159.0, 159.0, 159.0, 6.289308176100629, 1.8548545597484276, 3.88782429245283], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1359.6296296296298, 1105, 2033, 1185.0, 1854.0, 1988.0, 2033.0, 0.2366044630612236, 283.06119484158455, 0.46720139092753327], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e4c36942-1632-460a-8bf7-03c91b3df72c", 3, 0, 0.0, 395.0, 261, 487, 437.0, 487.0, 487.0, 487.0, 0.024389054192478415, 0.02446050649968294, 0.01564011613254638], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, 34.78260869565217, 1038.0434782608693, 336, 2121, 1017.0, 1822.6000000000001, 2072.5999999999995, 2121.0, 0.08977046083470917, 0.02800752998528545, 0.0405019071344098], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 192.66666666666669, 138, 426, 148.5, 426.0, 426.0, 426.0, 0.04250766909196534, 0.011457145184943783, 0.025031371545366308], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 189.16666666666669, 138, 428, 142.5, 428.0, 428.0, 428.0, 0.042508873727390595, 0.011457469871835746, 0.024990568343641738], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f684c581-df36-4ea4-9859-dd2e76078ed9", 1, 0, 0.0, 1224.0, 1224, 1224, 1224.0, 1224.0, 1224.0, 1224.0, 0.8169934640522876, 0.14760135825163398, 0.5632786968954249], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 378.9230769230769, 140, 1271, 144.0, 1144.6, 1271.0, 1271.0, 0.061352588607296234, 8.5070949991741, 0.03525745964887442], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 294.23076923076917, 138, 709, 148.0, 708.6, 709.0, 709.0, 0.061353746826123476, 2.789383206063638, 0.03531804101026023], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 146.00000000000003, 142, 154, 145.0, 152.0, 154.0, 154.0, 0.06135143043219723, 0.045594178280177824, 0.030795542228661498], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 145.66666666666666, 135, 152, 146.5, 152.0, 152.0, 152.0, 0.04250706679985548, 0.01137396123355508, 0.024242311534292578], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 230.23076923076923, 139, 431, 146.0, 429.4, 431.0, 431.0, 0.061351719971872595, 0.03059290243188779, 0.034196947279995095], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 147.16666666666666, 138, 152, 148.0, 152.0, 152.0, 152.0, 0.0425043566965614, 0.031587710396565646, 0.02133519466995367], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 202.16666666666666, 148, 444, 155.5, 444.0, 444.0, 444.0, 0.043548316857553455, 0.03427728846405086, 0.015480065757958456], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 505.23076923076934, 151, 824, 487.0, 766.4, 824.0, 824.0, 0.09754267492027761, 0.018274596698555617, 0.0663864659538548], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=43638368-2a06-421b-ab40-4eda1cc05f84", 1, 0, 0.0, 236.0, 236, 236, 236.0, 236.0, 236.0, 236.0, 4.237288135593221, 0.7655256885593221, 2.9214115466101696], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1130.9999999999998, 819, 1804, 1065.0, 1555.6000000000001, 1783.2999999999997, 1804.0, 0.09774852562640514, 0.05059249861522922, 0.04496050348636408], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 342.8333333333333, 289, 567, 302.0, 567.0, 567.0, 567.0, 0.0424607415060825, 0.06580585622085247, 0.0954952028208086], "isController": false}, {"data": ["addBook", 58, 8, 13.793103448275861, 1343.2586206896551, 732, 2423, 1170.0, 2148.6000000000004, 2340.15, 2423.0, 0.27920321179970536, 87.46508831606766, 1.0150873909061588], "isController": true}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 260.1481481481481, 139, 712, 150.0, 591.5, 616.0, 712.0, 0.23794311397034523, 0.17683077122210228, 0.11502132950714931], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b77aa1c1-06c2-443f-aae8-e8bcbc6f187a", 3, 0, 0.0, 392.3333333333333, 235, 621, 321.0, 621.0, 621.0, 621.0, 0.07269026677327906, 0.03218058685275375, 0.046614526544062417], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 804.3333333333335, 682, 1038, 733.5, 1004.0, 1035.5, 1038.0, 0.23760807867467496, 69.86466446109168, 0.11950015675532968], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7f3ecb6e-9a26-4b03-818e-989ea05b27c7", 3, 0, 0.0, 953.0, 244, 2177, 438.0, 2177.0, 2177.0, 2177.0, 0.01588579174786071, 0.021899846371155638, 0.010187177650809115], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 245.2222222222222, 138, 602, 149.5, 437.0, 473.75, 602.0, 0.23845797178247333, 0.42195883288070474, 0.11596881830827316], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1095.1481481481478, 947, 1469, 1029.0, 1322.0, 1374.0, 1469.0, 0.23726356027153495, 213.4901685971792, 0.11909518552692282], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 22, 0, 0.0, 151.45454545454547, 139, 172, 151.0, 162.8, 170.79999999999998, 172.0, 0.11282514154426848, 0.08428831375133339, 0.04010581203331419], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cf3c0931-ac02-4919-b191-7f9290c9dc2c", 1, 0, 0.0, 560.0, 560, 560, 560.0, 560.0, 560.0, 560.0, 1.7857142857142856, 0.32261439732142855, 1.231166294642857], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 8, 4.705882352941177, 222.57647058823522, 139, 1024, 155.0, 410.30000000000007, 447.0, 900.4599999999987, 0.7160849529490063, 1.5288504243329881, 0.3449490803047152], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 150.33333333333334, 140, 161, 150.0, 161.0, 161.0, 161.0, 0.04038880960715151, 0.03127766212741323, 0.014356959665042138], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 153.2142857142857, 146, 165, 151.5, 164.5, 165.0, 165.0, 0.10424034846059342, 0.0845934859089386, 0.037054186366851566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 565.5555555555557, 294, 1019, 557.0, 1019.0, 1019.0, 1019.0, 0.04130789990636876, 0.06401917690567112, 0.09290243504332739], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 591.4615384615385, 290, 1415, 569.0, 1289.0, 1415.0, 1415.0, 0.06130889780749949, 11.3645151836791, 0.1354718471309794], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 171.0625, 142, 449, 151.5, 252.30000000000018, 449.0, 449.0, 0.09975248913633049, 0.08270494460619589, 0.035458892622679976], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 165.52941176470588, 143, 415, 151.0, 208.59999999999982, 415.0, 415.0, 0.10215241139780554, 0.07930778033325722, 0.03631198998906368], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/de5aaed0-bedf-401d-bc45-98cd38bb9b76", 3, 0, 0.0, 398.0, 224, 570, 400.0, 570.0, 570.0, 570.0, 0.017482008099997087, 0.024100359473791556, 0.011210792954750736], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c86061ed-1b33-4c62-b45c-7677d9472a57", 3, 0, 0.0, 480.0, 260, 824, 356.0, 824.0, 824.0, 824.0, 0.022256183509651764, 0.026306055443862483, 0.014272357263676424], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 22, 0, 0.0, 186.27272727272728, 138, 446, 148.5, 429.9, 443.9, 446.0, 0.11494853440618633, 0.08542561980772245, 0.05769877605935525], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 22, 0, 0.0, 246.81818181818184, 138, 441, 149.0, 428.7, 439.2, 441.0, 0.11478001366925618, 0.04638482086491958, 0.06458413766297458], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 22, 0, 0.0, 343.49999999999994, 137, 1279, 147.0, 1062.1999999999994, 1278.25, 1279.0, 0.11495213810976884, 9.431269806384025, 0.06668122073945576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 22, 0, 0.0, 284.1363636363636, 138, 959, 147.5, 620.3999999999999, 919.5499999999995, 959.0, 0.1147710317915758, 3.0959852636603613, 0.06668824601170664], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 36.36363636363637, 0.6269592476489029], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 9.090909090909092, 0.15673981191222572], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.545454545454546, 0.07836990595611286], "isController": false}, {"data": ["401/Unauthorized", 11, 50.0, 0.8620689655172413], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1276, 22, "401/Unauthorized", 11, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 3, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
