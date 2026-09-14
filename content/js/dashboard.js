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

    var data = {"OkPercent": 97.78117827084927, "KoPercent": 2.218821729150727};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7231731402238315, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=534277ab-4b71-44d8-b6b9-ad83801f926e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a9c7a3f9-5fff-47b8-8b9c-c84e1dd4fac8"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/bf2ef8ec-ad4c-41f3-bb25-dadfbc381931"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.42857142857142855, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.75, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.4411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5357142857142857, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/10de04c6-0120-4641-ac81-b8597d08e714"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/54e127d6-c034-4dbd-ab40-f963ff16fe88"], "isController": false}, {"data": [0.6904761904761905, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/80ff3693-bb95-45f4-978b-3cd4e3a4df27"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fd3b8447-fe2a-43d3-bbca-4bc3e9df9f99"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=84b80e53-de56-4402-9438-b4f89f4c394b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4fd8a331-a751-4ef6-9421-eddcfbc7ae70"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a2f6516f-c0a6-4d8d-8459-ea9311af3d3e"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/801af70e-d5ca-4f6b-976e-c18b2878adb1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bf2ef8ec-ad4c-41f3-bb25-dadfbc381931"], "isController": false}, {"data": [0.35294117647058826, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.19047619047619047, 500, 1500, "register"], "isController": true}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=10de04c6-0120-4641-ac81-b8597d08e714"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/534277ab-4b71-44d8-b6b9-ad83801f926e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.19090909090909092, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.19047619047619047, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.46153846153846156, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.21428571428571427, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/84b80e53-de56-4402-9438-b4f89f4c394b"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a9c7a3f9-5fff-47b8-8b9c-c84e1dd4fac8"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a80ccac6-9718-4c4a-bbc4-40fa5ada572d"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "addBook"], "isController": true}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=54e127d6-c034-4dbd-ab40-f963ff16fe88"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/75dcba86-8f65-4f39-bea7-d6ea4d3daf95"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.990909090909091, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.34545454545454546, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.92, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=75dcba86-8f65-4f39-bea7-d6ea4d3daf95"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/fd3b8447-fe2a-43d3-bbca-4bc3e9df9f99"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a2f6516f-c0a6-4d8d-8459-ea9311af3d3e"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=801af70e-d5ca-4f6b-976e-c18b2878adb1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a80ccac6-9718-4c4a-bbc4-40fa5ada572d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c2eabdb1-a8c8-4fe3-b9c9-e544260265d0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1307, 29, 2.218821729150727, 483.2578423871454, 134, 3056, 158.0, 1418.6000000000004, 1684.9999999999995, 2178.880000000001, 5.103574845272262, 704.0159276220737, 3.742278866241043], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 2417.145454545455, 1725, 3677, 2357.0, 2911.6, 3063.7999999999997, 3677.0, 0.2396200932339999, 288.3442779130179, 1.1782101263995992], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=534277ab-4b71-44d8-b6b9-ad83801f926e", 1, 0, 0.0, 497.0, 497, 497, 497.0, 497.0, 497.0, 497.0, 2.012072434607646, 0.3635091800804829, 1.3872296277665996], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a9c7a3f9-5fff-47b8-8b9c-c84e1dd4fac8", 1, 0, 0.0, 520.0, 520, 520, 520.0, 520.0, 520.0, 520.0, 1.9230769230769231, 0.3474308894230769, 1.3258713942307692], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bf2ef8ec-ad4c-41f3-bb25-dadfbc381931", 3, 0, 0.0, 923.3333333333334, 504, 1215, 1051.0, 1215.0, 1215.0, 1215.0, 0.016644474034620504, 0.022945751151242786, 0.01067370242454505], "isController": false}, {"data": ["deleteBook", 14, 3, 21.428571428571427, 565.5714285714284, 147, 971, 546.0, 930.0, 971.0, 971.0, 0.07373233057363754, 0.01512603126514146, 0.04935889903147317], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, 21.428571428571427, 565.5714285714284, 147, 971, 546.0, 930.0, 971.0, 971.0, 0.07444788913645765, 0.015272826586936523, 0.04983791797172044], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 240.7222222222222, 138, 448, 146.0, 438.1, 448.0, 448.0, 0.09071757602636858, 0.03941332187603947, 0.05089082769708393], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 178.94444444444446, 137, 435, 146.5, 434.1, 435.0, 435.0, 0.09085219357574044, 0.06751808526478367, 0.04560354247844784], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 335.83333333333337, 134, 1131, 148.5, 892.5000000000003, 1131.0, 1131.0, 0.09085081790972457, 2.9898948969600307, 0.05263156649522781], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 390.05555555555554, 139, 1579, 146.5, 1448.5000000000002, 1579.0, 1579.0, 0.09073083689115828, 9.092822765501111, 0.05247345492945677], "isController": false}, {"data": ["goToProfile", 14, 3, 21.428571428571427, 263.35714285714283, 144, 504, 258.5, 424.0, 504.0, 504.0, 0.0736791693199939, 0.1501798972307158, 0.04761701337540063], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 164.9375, 143, 420, 147.5, 235.2000000000002, 420.0, 420.0, 0.08347593806085395, 0.0620363172503026, 0.041901007971952085], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 144.0625, 137, 148, 145.0, 147.3, 148.0, 148.0, 0.08347724462484805, 0.022336684596883167, 0.04760811607510865], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 1181.5714285714284, 1105, 1298, 1140.0, 1298.0, 1298.0, 1298.0, 0.047709273319611244, 14.028110452931394, 0.027209194940090782], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1492.0, 1329, 1699, 1489.0, 1699.0, 1699.0, 1699.0, 0.0476449768581541, 42.87103392790294, 0.027125997566702968], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 272.7142857142857, 144, 448, 152.0, 448.0, 448.0, 448.0, 0.04793568400797102, 0.08482369084222997, 0.026542512531757392], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 181.25, 139, 435, 146.0, 431.5, 435.0, 435.0, 0.09536411210051376, 0.07087118096532323, 0.04786831408170321], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 215.1875, 137, 436, 145.0, 433.2, 436.0, 436.0, 0.09552866158374579, 0.034528853387386635, 0.05397975762587394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 303.1875, 139, 1251, 146.0, 680.5000000000006, 1251.0, 1251.0, 0.09538230419801366, 5.388174541047178, 0.05556205513097182], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 325.5625, 140, 1151, 146.5, 749.2000000000004, 1151.0, 1151.0, 0.09543919926511817, 1.7780094477351087, 0.05568839996182433], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 228.71428571428572, 144, 437, 147.0, 437.0, 437.0, 437.0, 0.0480310692402171, 0.035694964542778526, 0.02697057110656722], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 1111.294117647059, 141, 1991, 1571.0, 1921.3999999999999, 1991.0, 1991.0, 0.08134321573656282, 43.06359746053658, 0.04370889476101841], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 180.125, 140, 432, 146.0, 422.90000000000003, 432.0, 432.0, 0.08347724462484805, 0.022499726090291074, 0.04907548951577981], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 718.7647058823529, 143, 1325, 864.0, 1191.3999999999999, 1325.0, 1325.0, 0.08134321573656282, 14.078207913259421, 0.043788331495136154], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 199.6875, 139, 441, 146.0, 438.9, 441.0, 441.0, 0.08347811569023358, 0.02249996086963327, 0.04915752320430747], "isController": false}, {"data": ["deleteBooks", 14, 3, 21.428571428571427, 527.9999999999999, 148, 1176, 509.0, 1026.0, 1176.0, 1176.0, 0.07469614674591572, 0.015323756109077716, 0.05035841645502759], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 532.5625, 287, 1393, 438.0, 1127.0000000000002, 1393.0, 1393.0, 0.09513503228645158, 7.251636480494346, 0.21243959297071033], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/10de04c6-0120-4641-ac81-b8597d08e714", 3, 0, 0.0, 440.3333333333333, 245, 590, 486.0, 590.0, 590.0, 590.0, 0.023298618391929357, 0.02753817818395036, 0.014940845778678657], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/54e127d6-c034-4dbd-ab40-f963ff16fe88", 3, 0, 0.0, 531.6666666666666, 264, 842, 489.0, 842.0, 842.0, 842.0, 0.016136406422289758, 0.022245338931769897, 0.010347890837210553], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 721.904761904762, 283, 1358, 728.0, 1309.8000000000002, 1355.8, 1358.0, 0.08892540005843669, 0.054623121715582694, 0.04020748069048456], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 164.47058823529414, 140, 438, 148.0, 214.79999999999978, 438.0, 438.0, 0.0813385453797314, 0.06044788382224179, 0.04082813703631049], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 231.1176470588235, 140, 439, 149.0, 438.2, 439.0, 439.0, 0.08134477264136046, 0.09363433790140056, 0.0423732995353778], "isController": false}, {"data": ["login", 21, 0, 0.0, 3315.0, 1998, 4547, 3274.0, 4357.2, 4528.2, 4547.0, 0.08940735694822889, 35.77432242661146, 0.1843153618337023], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 154.0625, 147, 206, 149.0, 173.80000000000004, 206.0, 206.0, 0.08043272807705455, 0.06511594880456857, 0.028591321308640484], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/80ff3693-bb95-45f4-978b-3cd4e3a4df27", 1, 0, 0.0, 534.0, 534, 534, 534.0, 534.0, 534.0, 534.0, 1.8726591760299625, 0.5980073735955056, 1.1173776919475655], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fd3b8447-fe2a-43d3-bbca-4bc3e9df9f99", 1, 0, 0.0, 498.0, 498, 498, 498.0, 498.0, 498.0, 498.0, 2.008032128514056, 0.3627792419678715, 1.3844440261044177], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=84b80e53-de56-4402-9438-b4f89f4c394b", 1, 0, 0.0, 1176.0, 1176, 1176, 1176.0, 1176.0, 1176.0, 1176.0, 0.8503401360544217, 0.15362590348639457, 0.5862696641156463], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4fd8a331-a751-4ef6-9421-eddcfbc7ae70", 1, 0, 0.0, 273.0, 273, 273, 273.0, 273.0, 273.0, 273.0, 3.663003663003663, 1.1697287087912087, 2.185639880952381], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a2f6516f-c0a6-4d8d-8459-ea9311af3d3e", 3, 0, 0.0, 389.3333333333333, 286, 542, 340.0, 542.0, 542.0, 542.0, 0.04193927193423922, 0.02696291083011799, 0.026894650296370858], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/801af70e-d5ca-4f6b-976e-c18b2878adb1", 3, 0, 0.0, 650.0, 313, 1100, 537.0, 1100.0, 1100.0, 1100.0, 0.04953519475587405, 0.031846357305615636, 0.03176573361623433], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bf2ef8ec-ad4c-41f3-bb25-dadfbc381931", 1, 0, 0.0, 632.0, 632, 632, 632.0, 632.0, 632.0, 632.0, 1.5822784810126582, 0.28586085838607594, 1.0909068433544304], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 1278.0, 291, 2143, 1713.0, 2080.6, 2143.0, 2143.0, 0.08128059975520195, 57.25178432581329, 0.1705687953617465], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 653.5555555555555, 284, 1720, 579.5, 1594.9, 1720.0, 1720.0, 0.09065315598890002, 12.175183131965813, 0.20130391029870215], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 5, 41.666666666666664, 1064.3333333333333, 144, 1926, 1595.0, 1903.2, 1926.0, 1926.0, 0.07891154673207557, 55.07875690887032, 0.1254698730510492], "isController": false}, {"data": ["register", 21, 7, 33.333333333333336, 1199.8571428571427, 225, 2414, 1181.0, 2049.6000000000004, 2381.0999999999995, 2414.0, 0.08903398130286393, 0.027823119157144974, 0.04016962828312806], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 384.8125, 290, 862, 298.0, 669.5000000000002, 862.0, 862.0, 0.08341283619282963, 0.129273604529317, 0.18759742358602208], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 148.75000000000003, 145, 154, 148.5, 152.6, 154.0, 154.0, 0.08962731840665035, 0.06958370911453811, 0.03185971083986399], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=10de04c6-0120-4641-ac81-b8597d08e714", 1, 0, 0.0, 876.0, 876, 876, 876.0, 876.0, 876.0, 876.0, 1.141552511415525, 0.2062375142694064, 0.787046946347032], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 14, 0, 0.0, 358.57142857142856, 290, 591, 297.0, 589.5, 591.0, 591.0, 0.10987976014818071, 0.17029216733902613, 0.24712215588013686], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 171.72727272727272, 141, 420, 147.0, 367.20000000000016, 420.0, 420.0, 0.05018454224854123, 0.037295348292128785, 0.025190287808349796], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 168.54545454545456, 140, 418, 144.0, 363.8000000000002, 418.0, 418.0, 0.05018706086321745, 0.013428959645040605, 0.0286223081485537], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/534277ab-4b71-44d8-b6b9-ad83801f926e", 3, 0, 0.0, 402.6666666666667, 251, 522, 435.0, 522.0, 522.0, 522.0, 0.056654013936887425, 0.0364230721111174, 0.03633086180197533], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 171.54545454545456, 139, 443, 146.0, 384.4000000000002, 443.0, 443.0, 0.05011777677542224, 0.013508307021500526, 0.029463771112113468], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 172.63636363636363, 144, 435, 147.0, 377.8000000000002, 435.0, 435.0, 0.05018568704205561, 0.01352661096055405, 0.02955270438121048], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 149.0, 148, 150, 149.0, 150.0, 150.0, 150.0, 0.04389237589430716, 0.012944821796953868, 0.027132689395601983], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1680.3999999999999, 1108, 3056, 1587.0, 2235.7999999999997, 2456.3999999999996, 3056.0, 0.24495613058388632, 293.05269270810135, 0.4836926719146662], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 7, 33.333333333333336, 1199.8571428571427, 225, 2414, 1181.0, 2049.6000000000004, 2381.0999999999995, 2414.0, 0.08961338226508492, 0.028004181957839037, 0.04043103770163011], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 185.71428571428572, 142, 432, 146.0, 432.0, 432.0, 432.0, 0.034214102075329676, 0.009221769699991202, 0.0201475620619373], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 146.14285714285714, 144, 149, 146.0, 149.0, 149.0, 149.0, 0.03426233199220777, 0.009234769169774748, 0.02014250376885652], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 197.62500000000003, 136, 430, 146.5, 427.9, 430.0, 430.0, 0.09133097775519873, 0.024616552598080908, 0.05369262559436488], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 200.06250000000003, 139, 440, 147.0, 439.3, 440.0, 440.0, 0.09133097775519873, 0.024616552598080908, 0.05378181600232894], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 145.28571428571428, 142, 150, 145.0, 150.0, 150.0, 150.0, 0.034262164291972375, 0.009167805679687922, 0.019540140572765496], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 148.0625, 137, 157, 147.5, 156.3, 157.0, 157.0, 0.09132732856148042, 0.06787118851102207, 0.04584203796933685], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 146.7142857142857, 145, 150, 146.0, 150.0, 150.0, 150.0, 0.03426115812503365, 0.025461661458154893, 0.01719749538697978], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 163.50000000000003, 140, 434, 145.5, 238.70000000000022, 434.0, 434.0, 0.09133097775519873, 0.024438171782152785, 0.052087198251011775], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 150.00000000000003, 147, 155, 149.0, 155.0, 155.0, 155.0, 0.03362846313119424, 0.026469278597404843, 0.011953867753666704], "isController": false}, {"data": ["deleteAccount", 13, 2, 15.384615384615385, 575.3076923076923, 144, 1207, 542.0, 1144.6, 1207.0, 1207.0, 0.07109808253940475, 0.013795548918215328, 0.04838322789396541], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1627.7142857142858, 1069, 2555, 1593.0, 2295.4, 2530.9999999999995, 2555.0, 0.08975586404978458, 0.046455671822642416, 0.04128419137446147], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/84b80e53-de56-4402-9438-b4f89f4c394b", 3, 0, 0.0, 414.3333333333333, 284, 577, 382.0, 577.0, 577.0, 577.0, 0.033003663406638135, 0.027513796218880296, 0.021164458629907918], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 335.57142857142856, 292, 580, 294.0, 580.0, 580.0, 580.0, 0.03418870209918631, 0.05298581077286003, 0.07689119231877546], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a9c7a3f9-5fff-47b8-8b9c-c84e1dd4fac8", 3, 0, 0.0, 734.6666666666666, 344, 1334, 526.0, 1334.0, 1334.0, 1334.0, 0.023030330945855694, 0.027221071505339197, 0.014768799467231676], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a80ccac6-9718-4c4a-bbc4-40fa5ada572d", 3, 0, 0.0, 568.3333333333333, 245, 1207, 253.0, 1207.0, 1207.0, 1207.0, 0.021972388032372652, 0.025970618797377963, 0.014090366023363972], "isController": false}, {"data": ["addBook", 60, 11, 18.333333333333332, 1352.6333333333332, 733, 3020, 1148.5, 2394.4, 2671.0499999999997, 3020.0, 0.2693227878499513, 70.83685095312212, 0.982011201583618], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 278.3272727272727, 144, 747, 150.0, 584.4, 593.8, 747.0, 0.24603987635377847, 0.18284799404807173, 0.11893529179210972], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=54e127d6-c034-4dbd-ab40-f963ff16fe88", 1, 0, 0.0, 593.0, 593, 593, 593.0, 593.0, 593.0, 593.0, 1.6863406408094435, 0.30466115092748736, 1.1626528246205734], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/75dcba86-8f65-4f39-bea7-d6ea4d3daf95", 3, 0, 0.0, 366.0, 242, 589, 267.0, 589.0, 589.0, 589.0, 0.02734357198195324, 0.02742368010299412, 0.017534777605614546], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 908.3818181818183, 695, 1325, 860.0, 1163.4, 1274.3999999999999, 1325.0, 0.24593645896214816, 72.31348479386054, 0.12368874645068975], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 229.9818181818182, 138, 608, 149.0, 435.4, 444.0, 608.0, 0.24656711332672832, 0.43630821225393723, 0.1199125219108503], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1400.2181818181818, 961, 2305, 1427.0, 1752.6, 1870.5999999999997, 2305.0, 0.24565196030264322, 221.03806569040484, 0.1233057691362877], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 14, 0, 0.0, 151.2142857142857, 146, 162, 150.0, 161.0, 162.0, 162.0, 0.1101529552464279, 0.0822920026987474, 0.03915593331025367], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 11, 6.285714285714286, 207.73714285714286, 140, 673, 153.0, 344.40000000000003, 458.3999999999998, 637.2800000000004, 0.7317093566811336, 1.5224250298432889, 0.35295176780980575], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 178.54545454545456, 148, 441, 153.0, 384.4000000000002, 441.0, 441.0, 0.04879455275356533, 0.037787187825759086, 0.017344938674118925], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=75dcba86-8f65-4f39-bea7-d6ea4d3daf95", 1, 0, 0.0, 454.0, 454, 454, 454.0, 454.0, 454.0, 454.0, 2.2026431718061676, 0.39793846365638763, 1.518619218061674], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 169.83333333333334, 147, 435, 151.0, 202.80000000000035, 435.0, 435.0, 0.08773597321128285, 0.07119979857282817, 0.031187396727448198], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 372.7272727272727, 290, 856, 297.0, 802.0000000000002, 856.0, 856.0, 0.05008309240330548, 0.07761901137113848, 0.11263804863751224], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fd3b8447-fe2a-43d3-bbca-4bc3e9df9f99", 3, 0, 0.0, 452.3333333333333, 265, 560, 532.0, 560.0, 560.0, 560.0, 0.026806537220876933, 0.027059593724589638, 0.017190390079794126], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a2f6516f-c0a6-4d8d-8459-ea9311af3d3e", 1, 0, 0.0, 466.0, 466, 466, 466.0, 466.0, 466.0, 466.0, 2.1459227467811157, 0.3876911212446352, 1.4795131437768239], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 402.375, 284, 592, 302.5, 587.8, 592.0, 592.0, 0.09125076279934528, 0.14142085992437592, 0.20522510422548063], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=801af70e-d5ca-4f6b-976e-c18b2878adb1", 1, 0, 0.0, 552.0, 552, 552, 552.0, 552.0, 552.0, 552.0, 1.8115942028985508, 0.32728996829710144, 1.2490092844202898], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a80ccac6-9718-4c4a-bbc4-40fa5ada572d", 1, 0, 0.0, 681.0, 681, 681, 681.0, 681.0, 681.0, 681.0, 1.4684287812041115, 0.26529230910425844, 1.012412812041116], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 188.6875, 144, 452, 152.0, 439.40000000000003, 452.0, 452.0, 0.09383173623898942, 0.077796039127834, 0.033354249991203275], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 188.11764705882354, 147, 439, 153.0, 423.8, 439.0, 439.0, 0.07689698066267105, 0.059700292604319805, 0.027334473594933847], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 14, 0, 0.0, 147.7857142857143, 145, 152, 147.0, 152.0, 152.0, 152.0, 0.11000495022276002, 0.08175172570265662, 0.055217328529783845], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 14, 0, 0.0, 165.9285714285714, 141, 438, 146.0, 292.5, 438.0, 438.0, 0.11001186556550029, 0.02943676871576863, 0.06274114208032437], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 14, 0, 0.0, 208.64285714285714, 140, 441, 147.5, 439.0, 441.0, 441.0, 0.11001532356292483, 0.029652567679069586, 0.06467697732898511], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 14, 0, 0.0, 188.35714285714286, 143, 440, 146.0, 438.5, 440.0, 440.0, 0.11001186556550029, 0.029651635640701248, 0.06478237786718424], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c2eabdb1-a8c8-4fe3-b9c9-e544260265d0", 1, 0, 0.0, 241.0, 241, 241, 241.0, 241.0, 241.0, 241.0, 4.149377593360996, 1.3250453838174274, 2.4758493257261414], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 24.137931034482758, 0.5355776587605203], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 10.344827586206897, 0.22953328232593725], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 6.896551724137931, 0.1530221882172915], "isController": false}, {"data": ["401/Unauthorized", 17, 58.62068965517241, 1.3006885998469777], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1307, 29, "401/Unauthorized", 17, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 5, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
