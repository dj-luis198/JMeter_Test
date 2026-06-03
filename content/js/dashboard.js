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

    var data = {"OkPercent": 96.53875094055681, "KoPercent": 3.4612490594431904};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.789980732177264, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4051724137931034, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e7e1ddf0-7a33-49cb-9384-ea48db960f3e"], "isController": false}, {"data": [0.47058823529411764, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.47058823529411764, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0f46aca1-5c1e-403c-ae10-2d29b081f0e1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9782608695652174, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9782608695652174, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cb0f08ed-d9e9-4242-b2ae-524dec6993af"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=68ba1f1e-3c77-4a2d-b78b-000378b75adc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d087f61f-e871-41c0-92e2-080351258167"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.5882352941176471, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/a847d478-1669-460b-8f85-6303e0dd2b9d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5abfbfa6-afc8-4827-8b4a-c44ed0c1cbac"], "isController": false}, {"data": [0.717391304347826, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d930bbbb-0a85-48dd-9f51-ed1cfc6bb30b"], "isController": false}, {"data": [0.043478260869565216, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=072d982f-ab0b-474c-861f-44a05652d169"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/18f0e5c7-91c0-4449-b167-851a6f357d45"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a11007af-8fdf-424a-bd23-bda62c2b579d"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/68ba1f1e-3c77-4a2d-b78b-000378b75adc"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=120ee6e6-61cb-41fb-a8e2-d423357d549e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6d5aecbe-ffc6-481d-9ac0-065f8ea41d34"], "isController": false}, {"data": [0.9782608695652174, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2222222222222222, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=08adb26b-31a5-4dd0-94bf-390582b3e03c"], "isController": false}, {"data": [0.32, 500, 1500, "register"], "isController": true}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.32, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9a439ea4-82c7-4772-9021-b41fa4e8430d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e7e1ddf0-7a33-49cb-9384-ea48db960f3e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6d5aecbe-ffc6-481d-9ac0-065f8ea41d34"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.625, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.3695652173913043, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d087f61f-e871-41c0-92e2-080351258167"], "isController": false}, {"data": [0.24545454545454545, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8275862068965517, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a847d478-1669-460b-8f85-6303e0dd2b9d"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=18f0e5c7-91c0-4449-b167-851a6f357d45"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/120ee6e6-61cb-41fb-a8e2-d423357d549e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/072d982f-ab0b-474c-861f-44a05652d169"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d930bbbb-0a85-48dd-9f51-ed1cfc6bb30b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a11007af-8fdf-424a-bd23-bda62c2b579d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5abfbfa6-afc8-4827-8b4a-c44ed0c1cbac"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/08adb26b-31a5-4dd0-94bf-390582b3e03c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1329, 46, 3.4612490594431904, 307.920240782543, 77, 1991, 92.0, 886.0, 1086.5, 1406.7, 5.1639525802277735, 747.0782126990395, 3.7754641401086415], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 1354.6551724137933, 955, 1746, 1352.5, 1602.3, 1681.6499999999999, 1746.0, 0.2454029262183409, 295.3036147216369, 1.2066442710052212], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/e7e1ddf0-7a33-49cb-9384-ea48db960f3e", 3, 0, 0.0, 282.0, 201, 442, 203.0, 442.0, 442.0, 442.0, 0.0472329371014721, 0.030366227465952925, 0.030289350940722663], "isController": false}, {"data": ["deleteBook", 17, 5, 29.41176470588235, 497.47058823529414, 84, 1241, 449.0, 951.3999999999997, 1241.0, 1241.0, 0.09553943249577097, 0.020471167463765264, 0.06359233710526759], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 5, 29.41176470588235, 497.47058823529414, 84, 1241, 449.0, 951.3999999999997, 1241.0, 1241.0, 0.09620608475190148, 0.02061401057701014, 0.0640360698541063], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0f46aca1-5c1e-403c-ae10-2d29b081f0e1", 1, 0, 0.0, 345.0, 345, 345, 345.0, 345.0, 345.0, 345.0, 2.898550724637681, 0.9256114130434784, 1.7295063405797102], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 23, 0, 0.0, 104.39130434782608, 77, 330, 80.0, 237.8, 311.7999999999997, 330.0, 0.11150920435758578, 0.037119232428815915, 0.0631879178565022], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 23, 0, 0.0, 88.1304347826087, 78, 235, 81.0, 89.20000000000002, 206.39999999999958, 235.0, 0.11150704191210337, 0.0828680262647565, 0.055971308147286264], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 23, 0, 0.0, 159.56521739130437, 78, 700, 81.0, 304.2000000000001, 626.1999999999989, 700.0, 0.11150920435758578, 1.4542879682780554, 0.06524746710478471], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 23, 0, 0.0, 150.13043478260866, 78, 824, 80.0, 295.40000000000015, 725.7999999999986, 824.0, 0.11150866373835219, 4.391169703156665, 0.0651382555924019], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cb0f08ed-d9e9-4242-b2ae-524dec6993af", 1, 0, 0.0, 494.0, 494, 494, 494.0, 494.0, 494.0, 494.0, 2.0242914979757085, 0.6464290232793523, 1.2078536184210527], "isController": false}, {"data": ["goToProfile", 17, 5, 29.41176470588235, 197.58823529411765, 78, 430, 188.0, 356.3999999999999, 430.0, 430.0, 0.09532086685917743, 0.1280764634556618, 0.061596072570018784], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=68ba1f1e-3c77-4a2d-b78b-000378b75adc", 1, 0, 0.0, 399.0, 399, 399, 399.0, 399.0, 399.0, 399.0, 2.506265664160401, 0.45279213659147866, 1.727952694235589], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 82.95000000000002, 79, 98, 81.0, 92.9, 97.75, 98.0, 0.10279446760175368, 0.0763931541454439, 0.05159800424541151], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 102.95, 79, 236, 80.0, 234.8, 235.95, 236.0, 0.10279605263157894, 0.04294546026932566, 0.05776254754317434], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 533.625, 389, 628, 543.0, 628.0, 628.0, 628.0, 0.05206570692213573, 15.309046579283056, 0.02969372347903054], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 946.875, 770, 1402, 873.0, 1402.0, 1402.0, 1402.0, 0.051933213886941394, 46.7295971443224, 0.029567445015709796], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 139.5, 79, 238, 83.0, 238.0, 238.0, 238.0, 0.052248651331687504, 0.09245562130177515, 0.028930649711979308], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 81.45454545454545, 80, 88, 81.0, 87.0, 88.0, 88.0, 0.05952155491945651, 0.044234280560260165, 0.029877030496680324], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 96.63636363636364, 78, 251, 79.0, 220.6000000000001, 251.0, 251.0, 0.05952187699533565, 0.015926752242892545, 0.033946070473902364], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 81.36363636363637, 78, 96, 80.0, 93.4, 96.0, 96.0, 0.05952155491945651, 0.016042919099384764, 0.03499216412257112], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 110.36363636363636, 78, 251, 80.0, 247.8, 251.0, 251.0, 0.05952219907470036, 0.01604309271935283, 0.0350506699629339], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 80.5, 79, 84, 80.0, 84.0, 84.0, 84.0, 0.05224899257411193, 0.03882957358290935, 0.029339033916127306], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 184.1, 78, 1160, 80.0, 990.0000000000022, 1156.55, 1160.0, 0.10279763771028541, 9.274685969278927, 0.0595503502829505], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 628.8125000000001, 78, 1107, 855.0, 1045.4, 1107.0, 1107.0, 0.07200655259628626, 40.50204213114643, 0.03846443776383651], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d087f61f-e871-41c0-92e2-080351258167", 1, 0, 0.0, 489.0, 489, 489, 489.0, 489.0, 489.0, 489.0, 2.044989775051125, 0.36945616053169733, 1.409924591002045], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 150.04999999999998, 79, 464, 80.0, 386.70000000000016, 460.49999999999994, 464.0, 0.10279763771028541, 3.047528327174042, 0.05965073860102695], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 433.25, 78, 703, 542.5, 699.5, 703.0, 703.0, 0.07200655259628626, 13.239976322220322, 0.03853475666285632], "isController": false}, {"data": ["deleteBooks", 17, 5, 29.41176470588235, 355.3529411764706, 80, 783, 399.0, 718.1999999999999, 783.0, 783.0, 0.09617179677202192, 0.02060666371551251, 0.06428947604756544], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 193.8181818181818, 161, 332, 163.0, 328.6, 332.0, 332.0, 0.05949547834364588, 0.09220637122203712, 0.13380672522013326], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a847d478-1669-460b-8f85-6303e0dd2b9d", 2, 0, 0.0, 850.0, 176, 1524, 850.0, 1524.0, 1524.0, 1524.0, 0.014143871460496168, 0.02417165532799638, 0.008791576352154112], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5abfbfa6-afc8-4827-8b4a-c44ed0c1cbac", 1, 0, 0.0, 702.0, 702, 702, 702.0, 702.0, 702.0, 702.0, 1.4245014245014245, 0.2573562143874644, 0.9821269586894588], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 578.1304347826085, 100, 1493, 637.0, 1120.0, 1421.599999999999, 1493.0, 0.0969649956365752, 0.05956150610879472, 0.04384257126927179], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 109.81249999999999, 79, 240, 81.0, 235.8, 240.0, 240.0, 0.0720059044841677, 0.05351220050044103, 0.03614358877427949], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 138.31250000000003, 78, 240, 81.0, 238.6, 240.0, 240.0, 0.0720062285387686, 0.0868610291040175, 0.03728642840105669], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d930bbbb-0a85-48dd-9f51-ed1cfc6bb30b", 1, 0, 0.0, 479.0, 479, 479, 479.0, 479.0, 479.0, 479.0, 2.08768267223382, 0.37716923277661796, 1.4393593423799582], "isController": false}, {"data": ["login", 23, 0, 0.0, 2584.565217391305, 1376, 4225, 2584.0, 3746.4000000000005, 4161.199999999999, 4225.0, 0.09963222712682317, 41.59257140219364, 0.2077885259953476], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 96.2, 81, 237, 83.0, 173.9000000000002, 234.29999999999995, 237.0, 0.10502105672187273, 0.08502192970940674, 0.037331703756603205], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=072d982f-ab0b-474c-861f-44a05652d169", 1, 0, 0.0, 172.0, 172, 172, 172.0, 172.0, 172.0, 172.0, 5.813953488372093, 1.050372456395349, 4.008448401162791], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/18f0e5c7-91c0-4449-b167-851a6f357d45", 3, 0, 0.0, 280.6666666666667, 182, 473, 187.0, 473.0, 473.0, 473.0, 0.0807471805776115, 0.03748225244260221, 0.05178123233655425], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a11007af-8fdf-424a-bd23-bda62c2b579d", 1, 0, 0.0, 183.0, 183, 183, 183.0, 183.0, 183.0, 183.0, 5.46448087431694, 0.9872353142076503, 3.7675034153005464], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/68ba1f1e-3c77-4a2d-b78b-000378b75adc", 3, 0, 0.0, 642.6666666666666, 424, 1074, 430.0, 1074.0, 1074.0, 1074.0, 0.0518295843267337, 0.033321428725683284, 0.0332370706782765], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 749.6875, 162, 1190, 937.5, 1127.0, 1190.0, 1190.0, 0.07197998956290151, 53.86251547850948, 0.15037421159417683], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=120ee6e6-61cb-41fb-a8e2-d423357d549e", 1, 0, 0.0, 455.0, 455, 455, 455.0, 455.0, 455.0, 455.0, 2.197802197802198, 0.39706387362637363, 1.5152815934065933], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6d5aecbe-ffc6-481d-9ac0-065f8ea41d34", 3, 0, 0.0, 339.3333333333333, 291, 434, 293.0, 434.0, 434.0, 434.0, 0.01734595347815277, 0.023912797194002928, 0.01112354438540396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 23, 0, 0.0, 268.304347826087, 160, 906, 168.0, 448.80000000000007, 819.1999999999988, 906.0, 0.11146327042927898, 5.963010474518527, 0.24944355445465383], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 18, 10, 55.55555555555556, 501.4444444444444, 78, 1486, 81.5, 1136.8000000000006, 1486.0, 1486.0, 0.11322107673243972, 60.21761739610394, 0.15514457112799643], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=08adb26b-31a5-4dd0-94bf-390582b3e03c", 1, 0, 0.0, 783.0, 783, 783, 783.0, 783.0, 783.0, 783.0, 1.277139208173691, 0.2307331577266922, 0.8805276181353767], "isController": false}, {"data": ["register", 25, 8, 32.0, 981.72, 105, 1559, 990.0, 1379.0, 1505.8999999999999, 1559.0, 0.10722112856671084, 0.03355686258111278, 0.04837515761505899], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 304.15000000000003, 160, 1240, 166.0, 1094.2000000000016, 1236.55, 1240.0, 0.10275169026530487, 12.435994928561888, 0.22846196132426377], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 95.76470588235296, 80, 238, 85.0, 131.5999999999999, 238.0, 238.0, 0.09205560158335635, 0.07146894849489091, 0.0327228896253337], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 13, 0, 0.0, 317.9230769230769, 160, 946, 315.0, 756.7999999999998, 946.0, 946.0, 0.08931025006870019, 8.346697667628469, 0.199103086785518], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 98.89999999999999, 78, 238, 81.5, 224.00000000000006, 238.0, 238.0, 0.0585576089757103, 0.04351791057667533, 0.029393174817885837], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 110.6, 77, 237, 80.0, 236.7, 237.0, 237.0, 0.058558980605265626, 0.01566910223226834, 0.03339691862644055], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 95.10000000000001, 77, 238, 79.0, 222.30000000000007, 238.0, 238.0, 0.0585606952325738, 0.015783937386904656, 0.03442728372071233], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 126.4, 78, 237, 80.0, 236.7, 237.0, 237.0, 0.05850621921110214, 0.015769254396742375, 0.034452392758100185], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, 100.0, 82.8, 80, 86, 83.0, 86.0, 86.0, 86.0, 0.04465840783844375, 0.013170741374228526, 0.02760622281419423], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 947.2931034482759, 623, 1407, 895.0, 1253.1, 1329.9999999999998, 1407.0, 0.24112814713805833, 288.47309368452125, 0.4761338999151894], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 8, 32.0, 981.72, 105, 1559, 990.0, 1379.0, 1505.8999999999999, 1559.0, 0.10326396748424192, 0.03231839482358383, 0.04658979782980446], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9a439ea4-82c7-4772-9021-b41fa4e8430d", 1, 0, 0.0, 271.0, 271, 271, 271.0, 271.0, 271.0, 271.0, 3.6900369003690034, 1.1783613929889298, 2.2017700645756455], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 3, 0, 0.0, 79.33333333333333, 79, 80, 79.0, 80.0, 80.0, 80.0, 0.019875710556652403, 0.005357125110972718, 0.011704153775059959], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 3, 0, 0.0, 186.0, 80, 242, 236.0, 242.0, 242.0, 242.0, 0.019855058076044874, 0.00535155862205897, 0.011672602501737317], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e7e1ddf0-7a33-49cb-9384-ea48db960f3e", 1, 0, 0.0, 527.0, 527, 527, 527.0, 527.0, 527.0, 527.0, 1.8975332068311195, 0.34281605787476277, 1.3082601992409866], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 88.88235294117646, 78, 234, 80.0, 113.99999999999989, 234.0, 234.0, 0.09380500698019612, 0.025283380787630982, 0.05514708418171685], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 121.88235294117646, 78, 318, 80.0, 253.19999999999993, 318.0, 318.0, 0.09372484590532687, 0.025261774872920136, 0.05519148640714073], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 90.41176470588235, 79, 237, 81.0, 116.99999999999989, 237.0, 237.0, 0.09380293658369705, 0.06971097142597017, 0.04708467715236356], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 3, 0, 0.0, 131.66666666666666, 79, 236, 80.0, 236.0, 236.0, 236.0, 0.01987557887623477, 0.005318270128992507, 0.011335291077852644], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6d5aecbe-ffc6-481d-9ac0-065f8ea41d34", 1, 0, 0.0, 605.0, 605, 605, 605.0, 605.0, 605.0, 605.0, 1.6528925619834711, 0.29861828512396693, 1.1395919421487604], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 107.47058823529412, 78, 236, 80.0, 234.4, 236.0, 236.0, 0.09372432918189687, 0.025078580269374748, 0.05345215648655056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 3, 0, 0.0, 82.33333333333333, 80, 87, 80.0, 87.0, 87.0, 87.0, 0.01987557887623477, 0.014770815942201818, 0.009976608928110031], "isController": false}, {"data": ["deleteAccount", 16, 5, 31.25, 370.06249999999994, 79, 1239, 401.5, 737.1000000000005, 1239.0, 1239.0, 0.09108349510141578, 0.01892940068483403, 0.06196946532565196], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 3, 0, 0.0, 81.66666666666667, 80, 83, 82.0, 83.0, 83.0, 83.0, 0.020947818982913563, 0.01648822470725423, 0.007446295029082555], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1357.3043478260872, 948, 1991, 1236.0, 1942.8, 1982.8, 1991.0, 0.09921918812820844, 0.051353681355420386, 0.04563695078943963], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 3, 0, 0.0, 269.6666666666667, 161, 324, 324.0, 324.0, 324.0, 324.0, 0.019844419749166536, 0.030754974747975873, 0.04463056511946341], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d087f61f-e871-41c0-92e2-080351258167", 3, 0, 0.0, 696.6666666666667, 338, 1239, 513.0, 1239.0, 1239.0, 1239.0, 0.025598580132088673, 0.025673575972319403, 0.016415756139392803], "isController": false}, {"data": ["addBook", 55, 18, 32.72727272727273, 928.7454545454544, 405, 2355, 730.0, 1672.4, 1736.6, 2355.0, 0.2613273528964573, 80.63538052380692, 0.9481422223634446], "isController": true}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 144.15517241379308, 78, 325, 81.5, 319.1, 322.15, 325.0, 0.24167371548336827, 0.1796032201980891, 0.11682469644947978], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 500.6034482758621, 387, 717, 466.0, 626.5, 706.4499999999999, 717.0, 0.2415760756383023, 71.0313873182973, 0.12149578022824774], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 123.51724137931029, 78, 326, 84.0, 239.1, 247.94999999999976, 326.0, 0.24196408084937734, 0.42816300244049976, 0.1176739377568261], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 801.0689655172415, 542, 1171, 775.0, 1008.0, 1082.25, 1171.0, 0.24149661280181872, 217.29907670484116, 0.12121997947278791], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 13, 0, 0.0, 81.9230769230769, 79, 87, 81.0, 86.2, 87.0, 87.0, 0.08857335577191679, 0.06617052457569957, 0.03148506005954855], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a847d478-1669-460b-8f85-6303e0dd2b9d", 1, 0, 0.0, 492.0, 492, 492, 492.0, 492.0, 492.0, 492.0, 2.032520325203252, 0.36720337906504064, 1.4013274898373984], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 18, 10.714285714285714, 158.7261904761905, 79, 1270, 85.0, 294.59999999999997, 460.8499999999999, 1254.8200000000002, 0.6745470898111268, 1.5450215011884876, 0.3191347402792946], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 103.0, 82, 245, 85.5, 230.60000000000005, 245.0, 245.0, 0.05916214569269999, 0.04581599759210067, 0.021030293976701947], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 23, 0, 0.0, 86.04347826086956, 81, 97, 84.0, 95.2, 96.8, 97.0, 0.11178832152265414, 0.09071884295441952, 0.03973725491625597], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=18f0e5c7-91c0-4449-b167-851a6f357d45", 1, 0, 0.0, 341.0, 341, 341, 341.0, 341.0, 341.0, 341.0, 2.932551319648094, 0.5298066348973607, 2.021856671554252], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/120ee6e6-61cb-41fb-a8e2-d423357d549e", 3, 0, 0.0, 387.0, 220, 522, 419.0, 522.0, 522.0, 522.0, 0.02022776462973077, 0.020287025658919433, 0.012971580833518754], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 242.1, 159, 473, 171.5, 458.50000000000006, 473.0, 473.0, 0.05847748032232787, 0.09062867311673274, 0.13151722381086045], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 222.7058823529412, 160, 475, 164.0, 414.99999999999994, 475.0, 475.0, 0.0936814609899375, 0.14518796737405354, 0.2106918014256114], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/072d982f-ab0b-474c-861f-44a05652d169", 3, 0, 0.0, 309.3333333333333, 255, 389, 284.0, 389.0, 389.0, 389.0, 0.07372275329909321, 0.033357626004472514, 0.04727663541641069], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d930bbbb-0a85-48dd-9f51-ed1cfc6bb30b", 3, 0, 0.0, 277.0, 232, 366, 233.0, 366.0, 366.0, 366.0, 0.07641754546843955, 0.03457694928422232, 0.049004741071883434], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 102.45454545454547, 81, 248, 90.0, 218.2000000000001, 248.0, 248.0, 0.06128236126509079, 0.05080930147857624, 0.021783964355950237], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 94.625, 81, 243, 84.0, 136.6000000000001, 243.0, 243.0, 0.07293314309938509, 0.05662289918360463, 0.02592545321110954], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a11007af-8fdf-424a-bd23-bda62c2b579d", 3, 0, 0.0, 290.3333333333333, 188, 432, 251.0, 432.0, 432.0, 432.0, 0.0812633745970691, 0.0367695607714603, 0.05211225519408402], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5abfbfa6-afc8-4827-8b4a-c44ed0c1cbac", 3, 0, 0.0, 301.3333333333333, 182, 414, 308.0, 414.0, 414.0, 414.0, 0.04842536843634485, 0.03113284591854853, 0.031054028587109168], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/08adb26b-31a5-4dd0-94bf-390582b3e03c", 3, 0, 0.0, 318.3333333333333, 259, 382, 314.0, 382.0, 382.0, 382.0, 0.03947732027949943, 0.03291061758977801, 0.025315859684444622], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 13, 0, 0.0, 104.76923076923077, 79, 239, 81.0, 238.2, 239.0, 239.0, 0.08974615644826135, 0.06669611821985047, 0.04504836368594368], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 13, 0, 0.0, 116.38461538461539, 79, 237, 80.0, 237.0, 237.0, 237.0, 0.0896483715028515, 0.034345454827564806, 0.050548428222686556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 13, 0, 0.0, 151.30769230769232, 78, 706, 79.0, 517.5999999999999, 706.0, 706.0, 0.08935936211163045, 6.207287137836817, 0.05194281430437174], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 13, 0, 0.0, 204.84615384615387, 77, 621, 233.0, 466.9999999999999, 621.0, 621.0, 0.08941160287492693, 2.0445515879156777, 0.05206049683620482], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 17.391304347826086, 0.6019563581640331], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 5, 10.869565217391305, 0.3762227238525207], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 5, 10.869565217391305, 0.3762227238525207], "isController": false}, {"data": ["401/Unauthorized", 28, 60.869565217391305, 2.106847253574116], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1329, 46, "401/Unauthorized", 28, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 5, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 17, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 18, 10, "Test failed: code expected to contain /200/", 5, "Test failed: code expected to contain /204/", 5, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 5, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 18, "401/Unauthorized", 18, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
