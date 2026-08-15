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

    var data = {"OkPercent": 97.63779527559055, "KoPercent": 2.3622047244094486};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.736026936026936, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=787be430-af68-4f8f-8340-ac4bdc1f90a8"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/383ddb5e-8759-4ffc-9d2f-bd7d4d6d6f50"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/119e6bdb-266c-4df4-ad66-fd8798ee9b06"], "isController": false}, {"data": [0.4666666666666667, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.4666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2904e894-6fcb-43ab-8da8-9d67c34a4340"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/50b6d189-c102-4df8-be48-27a71ed6dfe8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1309c5a5-5b29-4934-ae54-0ba028732c25"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5ef7056e-ead9-4f5d-a16e-dbe591a07314"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=353cc4fd-fe8a-4aba-8ff0-af91543f71eb"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0d8863c5-317f-49dc-b808-fe6c156d6a4c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.14285714285714285, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.4230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5666666666666667, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.6923076923076923, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8e6e7d12-17a1-4247-a64b-e8687ca2026c"], "isController": false}, {"data": [0.8095238095238095, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.047619047619047616, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3ab3892d-b5e9-4898-b51e-639f6e624fa7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=50b6d189-c102-4df8-be48-27a71ed6dfe8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a4812065-8a31-4773-bba7-728b99fb9d18"], "isController": false}, {"data": [0.2692307692307692, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1309c5a5-5b29-4934-ae54-0ba028732c25"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/98cec616-b63c-4d3a-9588-b0ee1f4b814a"], "isController": false}, {"data": [0.045454545454545456, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.6470588235294118, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/af32c73b-dad2-41be-8754-ff65f1580b18"], "isController": false}, {"data": [0.2826086956521739, 500, 1500, "register"], "isController": true}, {"data": [0.8809523809523809, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2904e894-6fcb-43ab-8da8-9d67c34a4340"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0d8863c5-317f-49dc-b808-fe6c156d6a4c"], "isController": false}, {"data": [0.7941176470588235, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3ab3892d-b5e9-4898-b51e-639f6e624fa7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.2403846153846154, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2826086956521739, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/353cc4fd-fe8a-4aba-8ff0-af91543f71eb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/787be430-af68-4f8f-8340-ac4bdc1f90a8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.4523809523809524, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=119e6bdb-266c-4df4-ad66-fd8798ee9b06"], "isController": false}, {"data": [0.2627118644067797, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=383ddb5e-8759-4ffc-9d2f-bd7d4d6d6f50"], "isController": false}, {"data": [0.9038461538461539, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.33653846153846156, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5ef7056e-ead9-4f5d-a16e-dbe591a07314"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=af32c73b-dad2-41be-8754-ff65f1580b18"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8e6e7d12-17a1-4247-a64b-e8687ca2026c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=98cec616-b63c-4d3a-9588-b0ee1f4b814a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1270, 30, 2.3622047244094486, 454.6566929133859, 137, 2407, 153.0, 1260.7000000000003, 1525.0, 1955.58, 4.915431358129814, 679.205882370728, 3.5943146879958974], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=787be430-af68-4f8f-8340-ac4bdc1f90a8", 1, 0, 0.0, 673.0, 673, 673, 673.0, 673.0, 673.0, 673.0, 1.4858841010401187, 0.2684458580980683, 1.0244474368499257], "isController": false}, {"data": ["see books", 52, 0, 0.0, 2291.6730769230767, 1802, 2996, 2260.0, 2765.5, 2841.0499999999997, 2996.0, 0.24090245766834217, 289.8873945689815, 1.184515502304788], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/383ddb5e-8759-4ffc-9d2f-bd7d4d6d6f50", 3, 0, 0.0, 336.0, 276, 445, 287.0, 445.0, 445.0, 445.0, 0.016800604821773583, 0.023150052151877466, 0.010773825357712877], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/119e6bdb-266c-4df4-ad66-fd8798ee9b06", 3, 0, 0.0, 337.3333333333333, 232, 437, 343.0, 437.0, 437.0, 437.0, 0.08837565545277794, 0.03912463913274024, 0.05667319050845461], "isController": false}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 544.0, 143, 848, 541.0, 818.0, 848.0, 848.0, 0.07726661618581077, 0.015136409381712537, 0.05202417608031607], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 544.0, 143, 848, 541.0, 818.0, 848.0, 848.0, 0.07569717094439792, 0.01482895751117795, 0.05096745715540125], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 223.7058823529412, 137, 427, 142.0, 424.6, 427.0, 427.0, 0.10588271931736788, 0.0376866572202672, 0.059863150478029335], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2904e894-6fcb-43ab-8da8-9d67c34a4340", 3, 0, 0.0, 327.6666666666667, 235, 438, 310.0, 438.0, 438.0, 438.0, 0.09663391850539539, 0.04542297471412465, 0.0619690167498792], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 191.58823529411765, 138, 444, 141.0, 424.0, 444.0, 444.0, 0.10606306384996443, 0.07882225741193645, 0.05323868634656418], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 311.64705882352945, 139, 1110, 149.0, 558.7999999999995, 1110.0, 1110.0, 0.10588337880090187, 1.8582265351532818, 0.06181599142656053], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 254.47058823529406, 138, 1525, 141.0, 636.9999999999992, 1525.0, 1525.0, 0.10606703436571913, 5.640983414937358, 0.0618196306683471], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/50b6d189-c102-4df8-be48-27a71ed6dfe8", 3, 0, 0.0, 1024.3333333333333, 268, 1434, 1371.0, 1434.0, 1434.0, 1434.0, 0.033294859273728133, 0.027756554231776615, 0.021351195562905087], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1309c5a5-5b29-4934-ae54-0ba028732c25", 1, 0, 0.0, 245.0, 245, 245, 245.0, 245.0, 245.0, 245.0, 4.081632653061225, 0.7374043367346939, 2.814094387755102], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5ef7056e-ead9-4f5d-a16e-dbe591a07314", 1, 0, 0.0, 1622.0, 1622, 1622, 1622.0, 1622.0, 1622.0, 1622.0, 0.6165228113440198, 0.11138351572133168, 0.4250635789149198], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=353cc4fd-fe8a-4aba-8ff0-af91543f71eb", 1, 0, 0.0, 540.0, 540, 540, 540.0, 540.0, 540.0, 540.0, 1.8518518518518519, 0.33456307870370366, 1.2767650462962963], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 257.33333333333337, 140, 434, 251.0, 379.40000000000003, 434.0, 434.0, 0.07771819382917541, 0.14732050335483537, 0.05023347840729515], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0d8863c5-317f-49dc-b808-fe6c156d6a4c", 1, 0, 0.0, 488.0, 488, 488, 488.0, 488.0, 488.0, 488.0, 2.0491803278688527, 0.3702132428278689, 1.412813780737705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 21, 0, 0.0, 156.71428571428572, 139, 443, 141.0, 155.6, 414.3999999999996, 443.0, 0.10299115747347977, 0.07653932698956846, 0.05169673334118027], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 1052.857142857143, 696, 1408, 1108.0, 1408.0, 1408.0, 1408.0, 0.03281962801295907, 9.650060350021333, 0.018717444101140717], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 21, 0, 0.0, 166.95238095238093, 138, 419, 140.0, 362.6000000000002, 418.6, 419.0, 0.10285798251414296, 0.034879111258051085, 0.05824983775377758], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1513.4285714285713, 1112, 1802, 1515.0, 1802.0, 1802.0, 1802.0, 0.03281778161172814, 29.529497581739715, 0.018684342460583498], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 279.42857142857144, 138, 557, 143.0, 557.0, 557.0, 557.0, 0.03292459796714125, 0.05826110499654292, 0.018230710007196376], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 161.92307692307693, 138, 416, 139.0, 309.9999999999999, 416.0, 416.0, 0.07507724293263261, 0.05579470885911467, 0.037685256706419104], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 203.61538461538464, 138, 418, 139.0, 418.0, 418.0, 418.0, 0.07507507507507508, 0.037436023764148764, 0.04184623325248325], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 392.1538461538462, 137, 1226, 146.0, 1226.0, 1226.0, 1226.0, 0.07507420796710594, 10.409722452818748, 0.043142855389750635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 394.46153846153845, 138, 1110, 414.0, 1104.4, 1110.0, 1110.0, 0.07507724293263261, 3.4133074413098092, 0.043217917111836215], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 140.85714285714286, 139, 143, 141.0, 143.0, 143.0, 143.0, 0.032967550510997035, 0.024500298768426503, 0.018512052288889934], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 13, 0, 0.0, 1140.4615384615386, 139, 1804, 1380.0, 1748.0, 1804.0, 1804.0, 0.08418162509389489, 52.44705587919613, 0.04448118621623022], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 21, 0, 0.0, 204.9047619047619, 137, 1226, 141.0, 358.20000000000016, 1144.599999999999, 1226.0, 0.10285949393128986, 4.433696686026293, 0.060049204185891596], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 13, 0, 0.0, 833.6153846153846, 140, 1276, 1106.0, 1256.0, 1276.0, 1276.0, 0.08418107997850144, 17.143003924942853, 0.04456310626566254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 21, 0, 0.0, 213.33333333333331, 139, 1107, 141.0, 417.4, 1038.099999999999, 1107.0, 0.10299721907508497, 1.4685629343662483, 0.06023019112114925], "isController": false}, {"data": ["deleteBooks", 15, 2, 13.333333333333334, 514.9333333333334, 143, 1622, 514.0, 1058.6000000000004, 1622.0, 1622.0, 0.07566356950455495, 0.014822375041614962, 0.051447286452185666], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 598.0, 279, 1365, 556.0, 1365.0, 1365.0, 1365.0, 0.0750135601435644, 13.904877982149658, 0.1657544975678296], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8e6e7d12-17a1-4247-a64b-e8687ca2026c", 3, 0, 0.0, 433.66666666666663, 261, 698, 342.0, 698.0, 698.0, 698.0, 0.05901213682947459, 0.03793911791608474, 0.037843069516297186], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 561.1904761904763, 173, 1400, 468.0, 1127.4, 1375.1999999999996, 1400.0, 0.09351079604404804, 0.0574397370231506, 0.0422807603206975], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 13, 0, 0.0, 165.30769230769232, 138, 422, 142.0, 318.3999999999999, 422.0, 422.0, 0.08417998976889354, 0.06255954317785936, 0.042254408926964145], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 13, 0, 0.0, 228.23076923076923, 138, 433, 143.0, 429.4, 433.0, 433.0, 0.08418053487016772, 0.11005694327527034, 0.0431147000259017], "isController": false}, {"data": ["login", 21, 0, 0.0, 2629.666666666667, 1363, 4798, 2391.0, 4243.6, 4749.599999999999, 4798.0, 0.09373702746494904, 37.5067417078998, 0.19324107908057367], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 21, 0, 0.0, 172.99999999999997, 141, 431, 145.0, 366.8000000000002, 429.7, 431.0, 0.10154051466535148, 0.08220418618903944, 0.036094479822449156], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3ab3892d-b5e9-4898-b51e-639f6e624fa7", 1, 0, 0.0, 683.0, 683, 683, 683.0, 683.0, 683.0, 683.0, 1.4641288433382138, 0.26451546486090777, 1.0094482064421668], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=50b6d189-c102-4df8-be48-27a71ed6dfe8", 1, 0, 0.0, 492.0, 492, 492, 492.0, 492.0, 492.0, 492.0, 2.032520325203252, 0.36720337906504064, 1.4013274898373984], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a4812065-8a31-4773-bba7-728b99fb9d18", 1, 0, 0.0, 234.0, 234, 234, 234.0, 234.0, 234.0, 234.0, 4.273504273504274, 1.3646834935897436, 2.549913194444444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 13, 0, 0.0, 1307.3076923076924, 285, 1946, 1534.0, 1890.3999999999999, 1946.0, 1946.0, 0.0841032010972233, 69.69779859871127, 0.17425258334303756], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1309c5a5-5b29-4934-ae54-0ba028732c25", 3, 0, 0.0, 384.3333333333333, 258, 461, 434.0, 461.0, 461.0, 461.0, 0.08949880668257756, 0.04154469346658711, 0.05739344048329355], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/98cec616-b63c-4d3a-9588-b0ee1f4b814a", 3, 0, 0.0, 340.3333333333333, 234, 540, 247.0, 540.0, 540.0, 540.0, 0.030712530712530713, 0.02560377316236691, 0.019695210124897625], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, 36.36363636363637, 1106.4545454545453, 139, 1944, 1551.0, 1927.4, 1944.0, 1944.0, 0.05058122424955856, 38.51302193500772, 0.0847675577200743], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 579.3529411764705, 279, 1664, 558.0, 1023.9999999999994, 1664.0, 1664.0, 0.10578718108276292, 7.598908097386435, 0.23632569422837588], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/af32c73b-dad2-41be-8754-ff65f1580b18", 3, 0, 0.0, 350.6666666666667, 251, 447, 354.0, 447.0, 447.0, 447.0, 0.0210293148649217, 0.02485593824040713, 0.013485595795538983], "isController": false}, {"data": ["register", 23, 8, 34.78260869565217, 1088.1739130434785, 173, 1719, 1136.0, 1604.8000000000002, 1708.8, 1719.0, 0.09420862705262166, 0.02939219563445414, 0.04250428290850704], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 21, 0, 0.0, 404.14285714285705, 281, 1373, 286.0, 798.6000000000003, 1321.4999999999993, 1373.0, 0.10278196519117445, 6.007085837624072, 0.22990677583987548], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 145.6153846153846, 141, 153, 144.0, 151.4, 153.0, 153.0, 0.12177415577724697, 0.09454145883096811, 0.04328690693644326], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2904e894-6fcb-43ab-8da8-9d67c34a4340", 1, 0, 0.0, 246.0, 246, 246, 246.0, 246.0, 246.0, 246.0, 4.065040650406504, 0.7344067581300813, 2.802654979674797], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0d8863c5-317f-49dc-b808-fe6c156d6a4c", 3, 0, 0.0, 364.0, 231, 603, 258.0, 603.0, 603.0, 603.0, 0.01750894415230447, 0.024137492996422337, 0.01122806639975254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 448.0, 279, 1262, 292.0, 813.1999999999996, 1262.0, 1262.0, 0.10804558252458037, 7.761133660330111, 0.24137090181516577], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3ab3892d-b5e9-4898-b51e-639f6e624fa7", 3, 0, 0.0, 356.3333333333333, 237, 483, 349.0, 483.0, 483.0, 483.0, 0.0431238949501919, 0.02772450928601205, 0.02765432065490822], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 143.2, 139, 153, 141.0, 153.0, 153.0, 153.0, 0.04825113752056705, 0.03585851138003079, 0.024219809263253383], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 140.10000000000002, 138, 142, 140.0, 142.0, 142.0, 142.0, 0.04825439718194321, 0.012911821120949647, 0.027520085892826982], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 140.60000000000002, 139, 143, 140.5, 142.9, 143.0, 143.0, 0.048253698646001215, 0.013005879713180015, 0.02836789705555931], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 141.30000000000004, 139, 144, 141.0, 143.9, 144.0, 144.0, 0.048253698646001215, 0.013005879713180015, 0.028415019808143295], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 151.5, 143, 160, 151.5, 160.0, 160.0, 160.0, 0.010542462402943455, 0.0031092027789930894, 0.006516971387757038], "isController": false}, {"data": ["https://demoqa.com/books", 52, 0, 0.0, 1584.384615384616, 1109, 2407, 1521.0, 2178.3, 2261.95, 2407.0, 0.24125452352231605, 288.62428377563333, 0.4763834439083233], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, 34.78260869565217, 1088.1739130434785, 173, 1719, 1136.0, 1604.8000000000002, 1708.8, 1719.0, 0.09004917467973815, 0.028094486054123468, 0.04062765498245999], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 178.42857142857142, 138, 419, 138.0, 419.0, 419.0, 419.0, 0.046797387368716616, 0.012613358314224402, 0.027557445882164182], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 179.14285714285714, 138, 415, 141.0, 415.0, 415.0, 415.0, 0.04679707451431322, 0.012613273990185985, 0.027511561384391172], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/353cc4fd-fe8a-4aba-8ff0-af91543f71eb", 3, 0, 0.0, 525.3333333333334, 294, 825, 457.0, 825.0, 825.0, 825.0, 0.021309088326171115, 0.025186621000106546, 0.013665007813332387], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 161.23076923076923, 139, 411, 140.0, 303.39999999999986, 411.0, 411.0, 0.1178091129880016, 0.031753237485047305, 0.06925887306521188], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 181.92307692307693, 138, 419, 140.0, 415.4, 419.0, 419.0, 0.11810022166503144, 0.031831700370653006, 0.06954534537501363], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 179.85714285714286, 138, 418, 139.0, 418.0, 418.0, 418.0, 0.046797387368716616, 0.012521957167019876, 0.026689134983721198], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 140.84615384615384, 139, 143, 141.0, 142.6, 143.0, 143.0, 0.11809593023255814, 0.08776465127634447, 0.05927862123001454], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/787be430-af68-4f8f-8340-ac4bdc1f90a8", 3, 0, 0.0, 422.6666666666667, 266, 605, 397.0, 605.0, 605.0, 605.0, 0.029338418659234266, 0.024458232482519195, 0.018814024986553227], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 181.14285714285714, 139, 427, 140.0, 427.0, 427.0, 427.0, 0.046707146193367584, 0.034711072512844464, 0.023444797991592714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 225.76923076923077, 139, 423, 141.0, 421.4, 423.0, 423.0, 0.11780484268522545, 0.03152199892163259, 0.06718557434391764], "isController": false}, {"data": ["deleteAccount", 15, 2, 13.333333333333334, 554.4666666666666, 139, 1434, 483.0, 1068.6000000000001, 1434.0, 1434.0, 0.07604408529104607, 0.014619673428675718, 0.0517505744496943], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 182.28571428571428, 142, 414, 143.0, 414.0, 414.0, 414.0, 0.046526466913035386, 0.03662141829287746, 0.016538705035493047], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1261.952380952381, 798, 2056, 1271.0, 1901.6000000000004, 2053.2, 2056.0, 0.09455200360198109, 0.04893804873930662, 0.0434902282192706], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 401.7142857142857, 280, 847, 282.0, 847.0, 847.0, 847.0, 0.04666355576294914, 0.07231939745683622, 0.10494743058796081], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=119e6bdb-266c-4df4-ad66-fd8798ee9b06", 1, 0, 0.0, 265.0, 265, 265, 265.0, 265.0, 265.0, 265.0, 3.7735849056603774, 0.681751179245283, 2.6017099056603774], "isController": false}, {"data": ["addBook", 59, 14, 23.728813559322035, 1286.6440677966102, 709, 2931, 1115.0, 2338.0, 2397.0, 2931.0, 0.28708087408827493, 82.63076701075823, 1.044122680544675], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=383ddb5e-8759-4ffc-9d2f-bd7d4d6d6f50", 1, 0, 0.0, 517.0, 517, 517, 517.0, 517.0, 517.0, 517.0, 1.9342359767891684, 0.34944692940038685, 1.3335650386847195], "isController": false}, {"data": ["https://demoqa.com/books-0", 52, 0, 0.0, 256.3846153846153, 139, 599, 143.0, 566.9, 574.0, 599.0, 0.24265615156676543, 0.18033333138897314, 0.1172996045171376], "isController": false}, {"data": ["https://demoqa.com/books-3", 52, 0, 0.0, 911.5576923076923, 683, 1257, 830.5, 1140.4, 1250.1499999999999, 1257.0, 0.24194036170084074, 71.13849951611928, 0.1216789905038408], "isController": false}, {"data": ["https://demoqa.com/books-1", 52, 0, 0.0, 211.84615384615384, 139, 432, 143.0, 419.7, 426.4, 432.0, 0.2428816979299006, 0.4297867545400194, 0.11812020075106494], "isController": false}, {"data": ["https://demoqa.com/books-2", 52, 0, 0.0, 1323.9423076923076, 969, 1837, 1365.0, 1647.4, 1679.85, 1837.0, 0.24193923603033546, 217.69734986390918, 0.12144215558553947], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 180.1764705882353, 141, 419, 145.0, 417.4, 419.0, 419.0, 0.11309432732159369, 0.08448941445412028, 0.04020149916509776], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 14, 8.235294117647058, 192.89411764705883, 138, 1086, 146.0, 322.00000000000006, 358.69999999999993, 673.4899999999953, 0.7041640950870057, 1.4857021033795734, 0.3399549567974617], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 146.90000000000003, 141, 168, 144.0, 166.4, 168.0, 168.0, 0.0496509537948224, 0.0384503968352482, 0.017649362481753274], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 146.0588235294118, 141, 172, 144.0, 153.6, 172.0, 172.0, 0.10617037222083438, 0.08615974542530602, 0.03774024950037472], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 285.7, 281, 298, 283.0, 297.8, 298.0, 298.0, 0.04821763511786801, 0.07472791692583645, 0.10844259148090822], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 389.0, 280, 564, 285.0, 562.8, 564.0, 564.0, 0.11765238246074483, 0.18233821383320511, 0.26460296563192903], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5ef7056e-ead9-4f5d-a16e-dbe591a07314", 3, 0, 0.0, 367.0, 235, 620, 246.0, 620.0, 620.0, 620.0, 0.021455237223406233, 0.025359364048889336, 0.013758729599645273], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 189.46153846153845, 142, 421, 144.0, 420.6, 421.0, 421.0, 0.07392664202445265, 0.061292694412851866, 0.026278611032129657], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 13, 0, 0.0, 167.07692307692307, 141, 420, 146.0, 315.9999999999999, 420.0, 420.0, 0.07849909726038151, 0.06094412336133134, 0.027903975979276237], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=af32c73b-dad2-41be-8754-ff65f1580b18", 1, 0, 0.0, 615.0, 615, 615, 615.0, 615.0, 615.0, 615.0, 1.6260162601626016, 0.2937627032520325, 1.1210619918699187], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8e6e7d12-17a1-4247-a64b-e8687ca2026c", 1, 0, 0.0, 514.0, 514, 514, 514.0, 514.0, 514.0, 514.0, 1.9455252918287937, 0.3514865029182879, 1.3413484922178989], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=98cec616-b63c-4d3a-9588-b0ee1f4b814a", 1, 0, 0.0, 521.0, 521, 521, 521.0, 521.0, 521.0, 521.0, 1.9193857965451055, 0.3467640355086372, 1.3233265355086372], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 141.8235294117647, 138, 149, 142.0, 147.4, 149.0, 149.0, 0.10814249363867684, 0.0803676149013995, 0.05428246262722647], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 189.35294117647058, 137, 416, 141.0, 414.4, 416.0, 416.0, 0.10814524542609226, 0.03849195431181455, 0.061142319938166365], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 263.1764705882353, 138, 970, 141.0, 641.1999999999997, 970.0, 970.0, 0.10814662137231701, 5.75158248923305, 0.06303168775525785], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 264.05882352941177, 138, 1122, 142.0, 561.1999999999995, 1122.0, 1122.0, 0.10814524542609226, 1.8979217227219523, 0.06313649639621874], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 26.666666666666668, 0.6299212598425197], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 6.666666666666667, 0.15748031496062992], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 6.666666666666667, 0.15748031496062992], "isController": false}, {"data": ["401/Unauthorized", 18, 60.0, 1.4173228346456692], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1270, 30, "401/Unauthorized", 18, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 14, "401/Unauthorized", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
