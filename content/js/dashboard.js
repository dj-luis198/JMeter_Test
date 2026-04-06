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

    var data = {"OkPercent": 97.5553857906799, "KoPercent": 2.4446142093200915};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8032679738562092, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.39814814814814814, 500, 1500, "see books"], "isController": true}, {"data": [0.5333333333333333, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5333333333333333, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.71875, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7307db5d-43be-4867-82ce-4d27f4cef4a6"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f49e48f4-918f-4f97-9a0f-b9b2f017c7f7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5666666666666667, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6b5bbb6e-0d27-40ee-8999-fcd20ec515e2"], "isController": false}, {"data": [0.7608695652173914, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2dc986c1-7531-479d-a1a5-ad8b373e8c32"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.021739130434782608, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/aacc55c6-c981-4534-93f6-f25575e56663"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6eb11afb-ea3a-401d-9f31-8d592afdb68c"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/7307db5d-43be-4867-82ce-4d27f4cef4a6"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f48bbbc7-b4f8-41d0-8212-d88c531af657"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=72c2a9b3-6d31-4213-89a0-9b8a02e40296"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.23333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=042c7f46-dc4a-450c-8c58-71039ca6867d"], "isController": false}, {"data": [0.2826086956521739, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/72c2a9b3-6d31-4213-89a0-9b8a02e40296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f49e48f4-918f-4f97-9a0f-b9b2f017c7f7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2826086956521739, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/675da757-4757-4dab-8a36-77d94c4a3505"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f48bbbc7-b4f8-41d0-8212-d88c531af657"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.391304347826087, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6130f995-b38c-45a5-92d1-29f9a8ffe557"], "isController": false}, {"data": [0.375, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bcd82702-5f27-447c-8e78-f7152f662921"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/1f791958-cd2b-419f-bb93-2e387243122b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9310344827586207, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bcd82702-5f27-447c-8e78-f7152f662921"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3ca6ca9b-a9b2-476f-af66-438fccf609dd"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6130f995-b38c-45a5-92d1-29f9a8ffe557"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2dc986c1-7531-479d-a1a5-ad8b373e8c32"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6b5bbb6e-0d27-40ee-8999-fcd20ec515e2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=675da757-4757-4dab-8a36-77d94c4a3505"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6eb11afb-ea3a-401d-9f31-8d592afdb68c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/042c7f46-dc4a-450c-8c58-71039ca6867d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c8116336-e0b9-4f63-b131-8e34a9c0f87a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fbe6549d-7109-48a9-9380-568194a091ff"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1309, 32, 2.4446142093200915, 299.8204736440028, 77, 3219, 93.0, 848.0, 1038.5, 1440.4000000000033, 5.201152279725837, 735.4134719255984, 3.7961167986987183], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 1321.4629629629626, 944, 1668, 1332.5, 1572.0, 1619.75, 1668.0, 0.2533605461327328, 304.8776120475286, 1.2457718259553805], "isController": true}, {"data": ["deleteBook", 15, 4, 26.666666666666668, 587.5333333333332, 83, 2285, 434.0, 1599.8000000000004, 2285.0, 2285.0, 0.09129363074769484, 0.019275081023097287, 0.060886194881470436], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 4, 26.666666666666668, 587.5333333333332, 83, 2285, 434.0, 1599.8000000000004, 2285.0, 2285.0, 0.08902816851251737, 0.018796767609771732, 0.05937529676056171], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 113.05263157894736, 79, 239, 81.0, 236.0, 239.0, 239.0, 0.0914353912712888, 0.024466110555012827, 0.0521467465844069], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 106.68421052631581, 79, 255, 82.0, 236.0, 255.0, 255.0, 0.0914353912712888, 0.06795149683344803, 0.04589628038422114], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 112.63157894736841, 77, 244, 81.0, 233.0, 244.0, 244.0, 0.09136416312830895, 0.02462549709317702, 0.05380135777965849], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 133.9473684210526, 77, 327, 80.0, 240.0, 327.0, 327.0, 0.09132771267340248, 0.024615672556503012, 0.05369070608338701], "isController": false}, {"data": ["goToProfile", 16, 4, 25.0, 219.0, 80, 556, 191.0, 407.60000000000014, 556.0, 556.0, 0.08802284192748018, 0.15957900840893213, 0.056883901997568376], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7307db5d-43be-4867-82ce-4d27f4cef4a6", 1, 0, 0.0, 596.0, 596, 596, 596.0, 596.0, 596.0, 596.0, 1.6778523489932886, 0.3031276216442953, 1.1568005453020134], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f49e48f4-918f-4f97-9a0f-b9b2f017c7f7", 1, 0, 0.0, 1039.0, 1039, 1039, 1039.0, 1039.0, 1039.0, 1039.0, 0.9624639076034649, 0.17388263955726663, 0.6635737487969202], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 13, 0, 0.0, 81.38461538461537, 79, 87, 80.0, 87.0, 87.0, 87.0, 0.08394082817312472, 0.06238180687475382, 0.042134361016588], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 13, 0, 0.0, 79.99999999999999, 77, 83, 80.0, 82.6, 83.0, 83.0, 0.08394408032802764, 0.02246159961902302, 0.04787435831207826], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 568.2857142857143, 384, 640, 617.0, 640.0, 640.0, 640.0, 0.05543588443993918, 16.299990669942662, 0.03161577784465281], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 806.5714285714286, 693, 936, 804.0, 936.0, 936.0, 936.0, 0.05534034311012728, 49.7953380084394, 0.03150724612617598], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 173.7142857142857, 81, 245, 239.0, 245.0, 245.0, 245.0, 0.05568283059691995, 0.09853250882970599, 0.030832192332474227], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 94.24999999999999, 78, 235, 82.0, 189.70000000000016, 235.0, 235.0, 0.07382343894186405, 0.05486292679175638, 0.03705590587511535], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 107.16666666666667, 77, 243, 81.0, 241.5, 243.0, 243.0, 0.07382207649197493, 0.038232722558181026, 0.04106833617343267], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 214.83333333333334, 78, 843, 81.0, 820.2, 843.0, 843.0, 0.07382343894186405, 11.087658124423253, 0.042342740695170716], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 169.75, 78, 616, 81.0, 569.8000000000002, 616.0, 616.0, 0.07382253063635022, 3.6342937567670655, 0.042414312035533246], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 105.85714285714285, 81, 241, 84.0, 241.0, 241.0, 241.0, 0.055683273540103884, 0.04138180777736236, 0.03126746316949193], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 489.15, 77, 1150, 467.0, 1030.2, 1144.1999999999998, 1150.0, 0.09813494536336917, 44.16422338764285, 0.05347587843042969], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 13, 0, 0.0, 105.0769230769231, 77, 247, 79.0, 245.0, 247.0, 247.0, 0.08385419690255497, 0.02260132650889177, 0.049297096225916104], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 374.04999999999995, 77, 710, 422.5, 699.5000000000002, 709.9, 710.0, 0.09813494536336917, 14.440691379090389, 0.053571713338011105], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 13, 0, 0.0, 117.07692307692308, 78, 247, 80.0, 245.8, 247.0, 247.0, 0.08385419690255497, 0.02260132650889177, 0.04937898509007876], "isController": false}, {"data": ["deleteBooks", 15, 4, 26.666666666666668, 457.40000000000003, 84, 1039, 405.0, 993.4, 1039.0, 1039.0, 0.08917583691522944, 0.01882794525495372, 0.05978728961933808], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 323.50000000000006, 159, 1078, 166.0, 1009.0000000000002, 1078.0, 1078.0, 0.07378621673471396, 14.807623096161887, 0.16280044825126666], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6b5bbb6e-0d27-40ee-8999-fcd20ec515e2", 1, 0, 0.0, 382.0, 382, 382, 382.0, 382.0, 382.0, 382.0, 2.617801047120419, 0.47294257198952877, 1.804851112565445], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 533.5652173913044, 106, 1444, 499.0, 1030.2, 1369.399999999999, 1444.0, 0.1056985294117647, 0.0649261474609375, 0.047791424919577205], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 88.35, 77, 233, 80.0, 87.50000000000001, 225.7499999999999, 233.0, 0.0982081915452568, 0.07298479859955119, 0.04929590864674022], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2dc986c1-7531-479d-a1a5-ad8b373e8c32", 1, 0, 0.0, 461.0, 461, 461, 461.0, 461.0, 461.0, 461.0, 2.1691973969631237, 0.3918960140997831, 1.495559924078091], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 127.39999999999996, 78, 239, 81.5, 237.9, 238.95, 239.0, 0.09820770930518045, 0.10002992266142892, 0.051885127670022096], "isController": false}, {"data": ["login", 23, 0, 0.0, 2462.0869565217395, 1459, 5173, 2355.0, 3281.4000000000005, 4815.799999999995, 5173.0, 0.10878613591645224, 39.75695850666197, 0.21903648740209247], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/aacc55c6-c981-4534-93f6-f25575e56663", 1, 0, 0.0, 317.0, 317, 317, 317.0, 317.0, 317.0, 317.0, 3.1545741324921135, 1.0073688880126184, 1.882270307570978], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 13, 0, 0.0, 86.15384615384616, 80, 100, 84.0, 98.4, 100.0, 100.0, 0.08339641523716658, 0.06751526194493271, 0.029644819478836557], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6eb11afb-ea3a-401d-9f31-8d592afdb68c", 3, 0, 0.0, 307.3333333333333, 186, 522, 214.0, 522.0, 522.0, 522.0, 0.01902382416913448, 0.026225877394623866, 0.012199522660545222], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7307db5d-43be-4867-82ce-4d27f4cef4a6", 3, 0, 0.0, 645.3333333333334, 176, 946, 814.0, 946.0, 946.0, 946.0, 0.017888234312018508, 0.02466037510136666, 0.011471296092017077], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 586.35, 160, 1229, 625.0, 1111.3000000000002, 1223.3, 1229.0, 0.09809595746559284, 58.75444918813333, 0.2080707222805348], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f48bbbc7-b4f8-41d0-8212-d88c531af657", 3, 0, 0.0, 377.3333333333333, 170, 556, 406.0, 556.0, 556.0, 556.0, 0.02494802494802495, 0.025021114864864864, 0.015998570686070687], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=72c2a9b3-6d31-4213-89a0-9b8a02e40296", 1, 0, 0.0, 275.0, 275, 275, 275.0, 275.0, 275.0, 275.0, 3.6363636363636362, 0.6569602272727272, 2.5071022727272725], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 275.00000000000006, 161, 582, 316.0, 472.0, 582.0, 582.0, 0.09129172993023389, 0.14148435097586054, 0.2053172402630163], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 15, 8, 53.333333333333336, 480.00000000000006, 80, 1020, 236.0, 994.8000000000001, 1020.0, 1020.0, 0.10803958570420202, 60.33344054761665, 0.15186736295178555], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=042c7f46-dc4a-450c-8c58-71039ca6867d", 1, 0, 0.0, 405.0, 405, 405, 405.0, 405.0, 405.0, 405.0, 2.4691358024691357, 0.44608410493827155, 1.7023533950617282], "isController": false}, {"data": ["register", 23, 7, 30.434782608695652, 1015.6086956521738, 235, 1774, 1023.0, 1655.6, 1750.7999999999997, 1774.0, 0.10792751025311347, 0.03383732743329611, 0.04869385716497893], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/72c2a9b3-6d31-4213-89a0-9b8a02e40296", 3, 0, 0.0, 256.6666666666667, 173, 389, 208.0, 389.0, 389.0, 389.0, 0.08888888888888889, 0.040219907407407406, 0.05700231481481482], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 13, 0, 0.0, 200.0769230769231, 160, 332, 161.0, 329.6, 332.0, 332.0, 0.0838066258807754, 0.12988390163358454, 0.18848306582365795], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 100.31578947368422, 82, 344, 86.0, 110.0, 344.0, 344.0, 0.15528331031326364, 0.12055686689359824, 0.05519836421291794], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 282.3125, 161, 801, 241.5, 577.0000000000002, 801.0, 801.0, 0.08406805308897553, 6.408059638730677, 0.18772667177204946], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 81.57142857142857, 80, 86, 81.0, 86.0, 86.0, 86.0, 0.04179678403601689, 0.031061867823641454, 0.020980026361828788], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 79.71428571428571, 77, 82, 80.0, 82.0, 82.0, 82.0, 0.04179678403601689, 0.011183905103387331, 0.02383722839554088], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f49e48f4-918f-4f97-9a0f-b9b2f017c7f7", 3, 0, 0.0, 317.0, 214, 393, 344.0, 393.0, 393.0, 393.0, 0.020303881425332477, 0.023998500473757234, 0.013020392710906568], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 102.71428571428571, 79, 240, 80.0, 240.0, 240.0, 240.0, 0.04175714047102055, 0.011254854267579757, 0.024548631409721064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 79.71428571428571, 78, 81, 80.0, 81.0, 81.0, 81.0, 0.04179678403601689, 0.011265539447207675, 0.02461275466183416], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 84.5, 84, 85, 84.5, 85.0, 85.0, 85.0, 0.03848485140036753, 0.011350024534092768, 0.023789952086360006], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 918.9074074074073, 621, 1337, 879.0, 1243.5, 1271.25, 1337.0, 0.24508024108634083, 293.2011720168288, 0.48393774167634884], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, 30.434782608695652, 1015.6086956521738, 235, 1774, 1023.0, 1655.6, 1750.7999999999997, 1774.0, 0.10986491392322831, 0.03444474033666431, 0.04956795921145652], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 99.25, 79, 234, 80.0, 234.0, 234.0, 234.0, 0.05361103851282979, 0.014449850224161153, 0.03156978146800426], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 99.375, 77, 235, 80.5, 235.0, 235.0, 235.0, 0.053609960730703766, 0.0144495597281975, 0.031516793320198896], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/675da757-4757-4dab-8a36-77d94c4a3505", 3, 0, 0.0, 298.0, 214, 424, 256.0, 424.0, 424.0, 424.0, 0.026575718651725207, 0.026653577202462683, 0.017042371661425342], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 230.73684210526315, 77, 1012, 82.0, 852.0, 1012.0, 1012.0, 0.15394712321441592, 21.90681964233627, 0.08841514981485833], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 166.52631578947367, 77, 641, 81.0, 625.0, 641.0, 641.0, 0.15413945564434348, 7.1911094745061455, 0.08867613728552307], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 100.0, 78, 240, 80.0, 240.0, 240.0, 240.0, 0.05361103851282979, 0.014345141164565783, 0.030575045401848237], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 89.73684210526315, 78, 242, 81.0, 85.0, 242.0, 242.0, 0.15414070612668743, 0.11455183336172768, 0.0773714091299974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 81.875, 79, 85, 81.5, 85.0, 85.0, 85.0, 0.053609601479625, 0.039840729224604125, 0.026909506992702392], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 122.36842105263159, 78, 245, 81.0, 242.0, 245.0, 245.0, 0.15413945564434348, 0.07779859449154261, 0.08586366263740722], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f48bbbc7-b4f8-41d0-8212-d88c531af657", 1, 0, 0.0, 426.0, 426, 426, 426.0, 426.0, 426.0, 426.0, 2.347417840375587, 0.42409404342723006, 1.6184345657276995], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 104.125, 81, 242, 84.5, 242.0, 242.0, 242.0, 0.05608957505135701, 0.04414863036268922, 0.019938091131537067], "isController": false}, {"data": ["deleteAccount", 15, 4, 26.666666666666668, 376.19999999999993, 81, 814, 406.0, 638.8000000000001, 814.0, 814.0, 0.0888672974269955, 0.0181148117346304, 0.06046563316468295], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1350.1304347826087, 800, 3219, 1228.0, 1784.0, 2936.799999999996, 3219.0, 0.10702054794520548, 0.05539149454195205, 0.04922527156464041], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 202.87499999999997, 161, 325, 164.5, 325.0, 325.0, 325.0, 0.053579800415243455, 0.08303822583885875, 0.12050222691045476], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6130f995-b38c-45a5-92d1-29f9a8ffe557", 3, 0, 0.0, 311.0, 255, 396, 282.0, 396.0, 396.0, 396.0, 0.020186251816762663, 0.023859466258680087, 0.012944959661140119], "isController": false}, {"data": ["addBook", 60, 9, 15.0, 883.9499999999998, 413, 2935, 688.0, 1580.8, 1670.85, 2935.0, 0.2776145507039842, 89.68458703534264, 1.0080607264478756], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bcd82702-5f27-447c-8e78-f7152f662921", 1, 0, 0.0, 233.0, 233, 233, 233.0, 233.0, 233.0, 233.0, 4.291845493562231, 0.7753822424892703, 2.9590262875536477], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 158.83333333333331, 77, 327, 83.0, 319.0, 321.5, 327.0, 0.24570359955773355, 0.18259808521819845, 0.11877273611433409], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1f791958-cd2b-419f-bb93-2e387243122b", 1, 0, 0.0, 1735.0, 1735, 1735, 1735.0, 1735.0, 1735.0, 1735.0, 0.5763688760806917, 0.18405529538904897, 0.3439076008645533], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 506.46296296296276, 383, 710, 468.0, 649.5, 700.0, 710.0, 0.24566671216050223, 72.23417027773986, 0.12355308277603384], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 119.07407407407406, 77, 335, 82.0, 239.0, 248.25, 335.0, 0.24602375496034007, 0.43534672264466423, 0.11964827145532163], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 758.574074074074, 536, 1018, 774.5, 935.0, 967.75, 1018.0, 0.24548690509203486, 220.88954872176333, 0.12322291915752531], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 96.43750000000001, 79, 247, 84.0, 145.5000000000001, 247.0, 247.0, 0.08683382177358082, 0.06487097036795832, 0.030866710083577557], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 9, 5.172413793103448, 154.84482758620692, 79, 1807, 86.0, 317.0, 401.25, 1132.0, 0.7234205318388185, 1.5686251359011991, 0.3489857690916499], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 106.14285714285715, 81, 237, 84.0, 237.0, 237.0, 237.0, 0.044682752457551385, 0.03460295185433423, 0.01588332216264522], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 94.73684210526315, 80, 236, 84.0, 119.0, 236.0, 236.0, 0.09315049688436101, 0.07559381143642968, 0.0331120906893627], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bcd82702-5f27-447c-8e78-f7152f662921", 3, 0, 0.0, 327.3333333333333, 178, 442, 362.0, 442.0, 442.0, 442.0, 0.08837305211064306, 0.039986504698500604, 0.05667152104751524], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 186.14285714285714, 162, 322, 162.0, 322.0, 322.0, 322.0, 0.04173672474033795, 0.06468377164347297, 0.09386687214550615], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3ca6ca9b-a9b2-476f-af66-438fccf609dd", 1, 0, 0.0, 271.0, 271, 271, 271.0, 271.0, 271.0, 271.0, 3.6900369003690034, 1.1783613929889298, 2.2017700645756455], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6130f995-b38c-45a5-92d1-29f9a8ffe557", 1, 0, 0.0, 930.0, 930, 930, 930.0, 930.0, 930.0, 930.0, 1.075268817204301, 0.1942624327956989, 0.7413474462365591], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 330.1052631578948, 159, 1090, 166.0, 934.0, 1090.0, 1090.0, 0.15384739957408564, 29.262098023060915, 0.3397911496246933], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2dc986c1-7531-479d-a1a5-ad8b373e8c32", 3, 0, 0.0, 262.3333333333333, 162, 449, 176.0, 449.0, 449.0, 449.0, 0.02224562132020347, 0.026293571293508726, 0.01426558398463569], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6b5bbb6e-0d27-40ee-8999-fcd20ec515e2", 3, 0, 0.0, 558.3333333333334, 196, 1038, 441.0, 1038.0, 1038.0, 1038.0, 0.04317167937832782, 0.02775523006907469, 0.027684963663836524], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=675da757-4757-4dab-8a36-77d94c4a3505", 1, 0, 0.0, 813.0, 813, 813, 813.0, 813.0, 813.0, 813.0, 1.2300123001230012, 0.22221901906519068, 0.8480358241082412], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6eb11afb-ea3a-401d-9f31-8d592afdb68c", 1, 0, 0.0, 963.0, 963, 963, 963.0, 963.0, 963.0, 963.0, 1.0384215991692627, 0.18760546469366562, 0.7159430166147456], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/042c7f46-dc4a-450c-8c58-71039ca6867d", 3, 0, 0.0, 340.6666666666667, 205, 485, 332.0, 485.0, 485.0, 485.0, 0.024348870618217826, 0.024420205200107136, 0.015614347369104529], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 86.49999999999999, 81, 99, 85.5, 96.30000000000001, 99.0, 99.0, 0.07521247524256022, 0.06235878074309925, 0.02673568455887883], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c8116336-e0b9-4f63-b131-8e34a9c0f87a", 1, 0, 0.0, 277.0, 277, 277, 277.0, 277.0, 277.0, 277.0, 3.6101083032490977, 1.1528373194945847, 2.1540782942238264], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 84.94999999999999, 80, 94, 84.0, 91.80000000000001, 93.9, 94.0, 0.0966748679179617, 0.07505519530740191, 0.03436489445521295], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 91.43750000000001, 80, 237, 82.0, 130.6000000000001, 237.0, 237.0, 0.08438685041903346, 0.06271327457898873, 0.0423582432767414], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 138.25, 78, 240, 81.5, 237.2, 240.0, 240.0, 0.08431969813548068, 0.030477371359760533, 0.047645981771135264], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fbe6549d-7109-48a9-9380-568194a091ff", 2, 0, 0.0, 323.0, 317, 329, 323.0, 329.0, 329.0, 329.0, 0.06775526797208484, 0.03986577046209093, 0.04211545709397656], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 160.25, 78, 719, 81.0, 387.20000000000033, 719.0, 719.0, 0.08410473141679677, 4.751101123126698, 0.0489926487208196], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 164.81250000000003, 79, 633, 83.0, 360.0000000000003, 633.0, 633.0, 0.08414232674569035, 1.5675514155631751, 0.04909671897514646], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 21.875, 0.5347593582887701], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 12.5, 0.30557677616501144], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 4, 12.5, 0.30557677616501144], "isController": false}, {"data": ["401/Unauthorized", 17, 53.125, 1.2987012987012987], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1309, 32, "401/Unauthorized", 17, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 15, 8, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 9, "401/Unauthorized", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
