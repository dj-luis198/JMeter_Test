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

    var data = {"OkPercent": 98.01375095492743, "KoPercent": 1.9862490450725745};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7859960552268245, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.15454545454545454, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=13c8ca9e-5acf-4945-b607-ae3f1614c23b"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3a1a9350-bcba-451c-9c47-4208871bdd04"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6923076923076923, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=01ba2220-5674-452a-8bad-5fd253a4356d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/280ed99a-4d1c-484f-96ea-6e67ad27e7c0"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/62e1c23b-b28d-43fc-ba6d-6215d0eb23e6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=19f3f429-f3c7-4302-bc14-063eae1629c2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=099afac7-22e2-4686-842c-eed035b9cf06"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1374c2cd-2834-43e1-b8f3-0310c4679d00"], "isController": false}, {"data": [0.8863636363636364, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.045454545454545456, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cdee7754-6ab1-4a00-918b-b4a3a443071d"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/2a62e133-0343-407d-abd9-db78e1337588"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c1dd4eb8-27fd-487a-9a39-ae331a7f66e8"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/f2d678e3-6a80-4fa9-b296-12cc12a53894"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.30434782608695654, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a8f1fb13-86f3-488f-be3c-9af0a14867c3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3a1a9350-bcba-451c-9c47-4208871bdd04"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.44545454545454544, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.30434782608695654, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=280ed99a-4d1c-484f-96ea-6e67ad27e7c0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/01ba2220-5674-452a-8bad-5fd253a4356d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5384615384615384, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.38636363636363635, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.2916666666666667, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.6181818181818182, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/19f3f429-f3c7-4302-bc14-063eae1629c2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9314285714285714, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/099afac7-22e2-4686-842c-eed035b9cf06"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2a62e133-0343-407d-abd9-db78e1337588"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/cdee7754-6ab1-4a00-918b-b4a3a443071d"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8947368421052632, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c1dd4eb8-27fd-487a-9a39-ae331a7f66e8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1374c2cd-2834-43e1-b8f3-0310c4679d00"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/13c8ca9e-5acf-4945-b607-ae3f1614c23b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/793cd1f5-464c-4450-a7c0-8b31f2a9ad4a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1ee27bc8-9302-48f3-87f0-6d5e634d942b"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a8f1fb13-86f3-488f-be3c-9af0a14867c3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1309, 26, 1.9862490450725745, 340.79220779220753, 91, 3404, 108.0, 920.0, 1155.0, 1599.800000000001, 5.142711218496474, 727.1401426559707, 3.762812886734634], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 1638.472727272727, 1226, 2166, 1618.0, 1995.3999999999999, 2057.2, 2166.0, 0.25833482071563446, 310.8618535831627, 1.2702302952179878], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=13c8ca9e-5acf-4945-b607-ae3f1614c23b", 1, 0, 0.0, 590.0, 590, 590, 590.0, 590.0, 590.0, 590.0, 1.694915254237288, 0.3062102754237288, 1.168564618644068], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3a1a9350-bcba-451c-9c47-4208871bdd04", 3, 0, 0.0, 365.3333333333333, 195, 599, 302.0, 599.0, 599.0, 599.0, 0.05175626250776344, 0.03327428986094817, 0.03319005115243945], "isController": false}, {"data": ["deleteBook", 13, 2, 15.384615384615385, 451.61538461538464, 94, 644, 478.0, 628.8, 644.0, 644.0, 0.07836848863355497, 0.015535940617784823, 0.05268915063629184], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, 15.384615384615385, 451.61538461538464, 94, 644, 478.0, 628.8, 644.0, 644.0, 0.08150112534246146, 0.016156961371601247, 0.0547953028707204], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 13, 0, 0.0, 112.92307692307693, 93, 275, 101.0, 206.19999999999993, 275.0, 275.0, 0.06970621511337984, 0.03475885335957146, 0.03885367458993978], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 13, 0, 0.0, 99.6923076923077, 96, 105, 99.0, 104.2, 105.0, 105.0, 0.06970509383378017, 0.05180232071045576, 0.03498868967828418], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 13, 0, 0.0, 217.23076923076923, 92, 809, 96.0, 790.6, 809.0, 809.0, 0.06970845778080444, 3.1692213029046976, 0.04012739723364666], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 13, 0, 0.0, 272.7692307692308, 93, 1142, 98.0, 1142.0, 1142.0, 1142.0, 0.06970845778080444, 9.665712336654314, 0.04005932256784509], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=01ba2220-5674-452a-8bad-5fd253a4356d", 1, 0, 0.0, 934.0, 934, 934, 934.0, 934.0, 934.0, 934.0, 1.0706638115631693, 0.1934304737687366, 0.738172510706638], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/280ed99a-4d1c-484f-96ea-6e67ad27e7c0", 3, 0, 0.0, 291.0, 195, 436, 242.0, 436.0, 436.0, 436.0, 0.019806817506585764, 0.027305296920700106, 0.012701637528637358], "isController": false}, {"data": ["goToProfile", 13, 2, 15.384615384615385, 225.92307692307693, 93, 539, 196.0, 448.9999999999999, 539.0, 539.0, 0.07766201491110686, 0.16204478111259799, 0.050195611200057354], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 109.76470588235297, 93, 286, 99.0, 140.39999999999986, 286.0, 286.0, 0.09083040360756992, 0.06750189174351631, 0.04559260493583099], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 124.23529411764706, 91, 354, 97.0, 313.2, 354.0, 354.0, 0.09073247795734506, 0.02427802632843022, 0.05174586633504835], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 653.4285714285714, 561, 788, 593.0, 788.0, 788.0, 788.0, 0.05470288518645869, 16.084464551553562, 0.031197739207902222], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1058.4285714285716, 818, 1274, 1050.0, 1274.0, 1274.0, 1274.0, 0.05450524807674339, 49.04391802946009, 0.03103179651244277], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/62e1c23b-b28d-43fc-ba6d-6215d0eb23e6", 1, 0, 0.0, 191.0, 191, 191, 191.0, 191.0, 191.0, 191.0, 5.235602094240838, 1.6719159031413613, 3.1239774214659684], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 226.14285714285714, 99, 348, 292.0, 348.0, 348.0, 348.0, 0.054905836490418934, 0.09715759347718662, 0.030401962197331576], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 130.41666666666666, 96, 290, 98.5, 288.5, 290.0, 290.0, 0.06841973225078113, 0.05084708617465277, 0.03434349841494287], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 114.83333333333333, 93, 299, 97.5, 240.8000000000002, 299.0, 299.0, 0.06842168283128923, 0.02687199229685887, 0.038542878300633465], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 255.24999999999994, 96, 1209, 103.0, 936.000000000001, 1209.0, 1209.0, 0.0684212927062902, 5.147371490914223, 0.03973424029557999], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 197.91666666666669, 92, 721, 101.0, 594.7000000000005, 721.0, 721.0, 0.06842207296073713, 1.6934351693731398, 0.03980151184272046], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 98.57142857142857, 94, 104, 98.0, 104.0, 104.0, 104.0, 0.054904113886819095, 0.04080276432409114, 0.03082994676261814], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 12, 0, 0.0, 875.5833333333333, 96, 1238, 960.0, 1226.0, 1238.0, 1238.0, 0.07834278887271257, 58.74766858796916, 0.040446504932331415], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 157.2941176470588, 95, 299, 103.0, 293.4, 299.0, 299.0, 0.0907397424058842, 0.024457196195335977, 0.05334504387533427], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 12, 0, 0.0, 668.4166666666666, 102, 852, 769.5, 851.7, 852.0, 852.0, 0.0783397201966327, 19.198918218228346, 0.040521424281396275], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 131.41176470588232, 94, 289, 100.0, 288.2, 289.0, 289.0, 0.09083283019069552, 0.0244822862623359, 0.05348847324705995], "isController": false}, {"data": ["deleteBooks", 13, 2, 15.384615384615385, 490.23076923076917, 94, 934, 530.0, 872.4, 934.0, 934.0, 0.08176100628930817, 0.01620848073899371, 0.05547366352201258], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=19f3f429-f3c7-4302-bc14-063eae1629c2", 1, 0, 0.0, 450.0, 450, 450, 450.0, 450.0, 450.0, 450.0, 2.2222222222222223, 0.4014756944444444, 1.5321180555555556], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=099afac7-22e2-4686-842c-eed035b9cf06", 1, 0, 0.0, 464.0, 464, 464, 464.0, 464.0, 464.0, 464.0, 2.155172413793103, 0.3893622036637931, 1.4858903556034482], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 389.25, 195, 1307, 204.0, 1091.9000000000008, 1307.0, 1307.0, 0.06838191298401572, 6.914525502535828, 0.1523345122090207], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1374c2cd-2834-43e1-b8f3-0310c4679d00", 3, 0, 0.0, 374.3333333333333, 200, 469, 454.0, 469.0, 469.0, 469.0, 0.0615637184485943, 0.027855979376154322, 0.03947933767699569], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 373.72727272727275, 124, 1798, 313.0, 624.1999999999999, 1627.5999999999976, 1798.0, 0.0938790837401427, 0.057665960617724374, 0.042447281027037174], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 12, 0, 0.0, 102.66666666666666, 97, 119, 102.0, 115.4, 119.0, 119.0, 0.07834176595397421, 0.05822078504977966, 0.03932389423861596], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 12, 0, 0.0, 203.25, 97, 310, 222.0, 309.7, 310.0, 310.0, 0.07834227741000431, 0.11901803667724287, 0.039196640748429885], "isController": false}, {"data": ["login", 22, 0, 0.0, 2434.9545454545455, 1268, 3910, 2384.5, 3783.5, 3895.2999999999997, 3910.0, 0.09004805291551037, 34.398863853227816, 0.1833737782116457], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cdee7754-6ab1-4a00-918b-b4a3a443071d", 1, 0, 0.0, 564.0, 564, 564, 564.0, 564.0, 564.0, 564.0, 1.7730496453900708, 0.32032635195035464, 1.2224346187943265], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2a62e133-0343-407d-abd9-db78e1337588", 3, 0, 0.0, 639.6666666666667, 194, 1510, 215.0, 1510.0, 1510.0, 1510.0, 0.018713158469263635, 0.02579759964756885, 0.012000300190250444], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 105.47058823529413, 98, 140, 104.0, 123.19999999999999, 140.0, 140.0, 0.08753230972020555, 0.0708635593340336, 0.031115000720854314], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c1dd4eb8-27fd-487a-9a39-ae331a7f66e8", 3, 0, 0.0, 299.3333333333333, 199, 444, 255.0, 444.0, 444.0, 444.0, 0.019069049026525047, 0.026288223511501813, 0.012228524278077585], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f2d678e3-6a80-4fa9-b296-12cc12a53894", 1, 0, 0.0, 549.0, 549, 549, 549.0, 549.0, 549.0, 549.0, 1.8214936247723132, 0.5816683743169399, 1.0868482468123861], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 12, 0, 0.0, 980.3333333333336, 201, 1337, 1063.0, 1331.3, 1337.0, 1337.0, 0.0782891217265361, 78.07106154748236, 0.15938156486906147], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 13, 0, 0.0, 389.2307692307692, 191, 1246, 204.0, 1244.8, 1246.0, 1246.0, 0.06966661843593082, 12.913742887641142, 0.15393957191202712], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, 36.36363636363637, 770.8181818181819, 91, 1376, 1027.0, 1352.4, 1376.0, 1376.0, 0.08558180064108549, 65.16279141575639, 0.14342397467167708], "isController": false}, {"data": ["register", 23, 7, 30.434782608695652, 794.9565217391304, 236, 2586, 667.0, 1823.4, 2440.599999999998, 2586.0, 0.09410647943568845, 0.02950417137199064, 0.0424581967766485], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a8f1fb13-86f3-488f-be3c-9af0a14867c3", 1, 0, 0.0, 409.0, 409, 409, 409.0, 409.0, 409.0, 409.0, 2.444987775061125, 0.441721424205379, 1.6857044621026895], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 111.8421052631579, 97, 304, 102.0, 105.0, 304.0, 304.0, 0.09705861318566802, 0.07535312254160749, 0.034501303905842926], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 306.1764705882353, 197, 589, 211.0, 483.3999999999999, 589.0, 589.0, 0.09068359427093058, 0.14054185948043635, 0.20394952891206358], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 21, 0, 0.0, 299.76190476190476, 191, 647, 204.0, 569.0000000000001, 641.1999999999999, 647.0, 0.10387092306626966, 0.16097964346305657, 0.2336081404507998], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 14, 0, 0.0, 128.85714285714283, 93, 316, 99.0, 311.0, 316.0, 316.0, 0.08289468230613006, 0.06160434886227048, 0.04160924482944419], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 14, 0, 0.0, 154.2857142857143, 94, 306, 100.0, 298.0, 306.0, 306.0, 0.08289615480264795, 0.03107449329725377, 0.04677942887509918], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 14, 0, 0.0, 211.5714285714286, 91, 1094, 101.5, 698.5, 1094.0, 1094.0, 0.08289615480264795, 5.348611868730979, 0.04822502309250027], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3a1a9350-bcba-451c-9c47-4208871bdd04", 1, 0, 0.0, 780.0, 780, 780, 780.0, 780.0, 780.0, 780.0, 1.2820512820512822, 0.23162059294871795, 0.8839142628205128], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 14, 0, 0.0, 159.07142857142858, 93, 570, 99.5, 438.0, 570.0, 570.0, 0.08289713649605647, 1.76178388346439, 0.04830654842969139], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 96.5, 94, 99, 96.5, 99.0, 99.0, 99.0, 0.04866535270214371, 0.014352477066452539, 0.030083172129352506], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1125.472727272727, 734, 1718, 1053.0, 1548.1999999999998, 1646.2, 1718.0, 0.24885864376563854, 297.72145520657534, 0.4913986110294151], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, 30.434782608695652, 794.9565217391304, 236, 2586, 667.0, 1823.4, 2440.599999999998, 2586.0, 0.0943694275878764, 0.029586610619432716, 0.04257683158749892], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 100.71428571428571, 97, 104, 99.0, 104.0, 104.0, 104.0, 0.033171582379255445, 0.008940778063158693, 0.01953365642059671], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 98.0, 94, 102, 98.0, 102.0, 102.0, 102.0, 0.03317299718029524, 0.008941159396251452, 0.01950209404544701], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 210.73684210526315, 92, 1099, 101.0, 302.0, 1099.0, 1099.0, 0.09172850294255382, 4.367499723909275, 0.05351143649249516], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 152.21052631578948, 93, 567, 98.0, 289.0, 567.0, 567.0, 0.091726288754357, 1.4429258061051087, 0.053599721260705425], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 98.00000000000001, 92, 102, 100.0, 102.0, 102.0, 102.0, 0.033171582379255445, 0.008875989816324209, 0.01891816807566912], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 129.26315789473685, 92, 303, 100.0, 291.0, 303.0, 303.0, 0.09172274627557375, 0.06816504874581214, 0.04604051912660636], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=280ed99a-4d1c-484f-96ea-6e67ad27e7c0", 1, 0, 0.0, 530.0, 530, 530, 530.0, 530.0, 530.0, 530.0, 1.8867924528301887, 0.3408755896226415, 1.3008549528301887], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 102.0, 94, 110, 102.0, 110.0, 110.0, 110.0, 0.03317142518658926, 0.024651811100580498, 0.01665050053311219], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 148.3157894736842, 91, 301, 101.0, 289.0, 301.0, 301.0, 0.09172673158344478, 0.03179508006778123, 0.051907448331297644], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/01ba2220-5674-452a-8bad-5fd253a4356d", 3, 0, 0.0, 410.0, 290, 483, 457.0, 483.0, 483.0, 483.0, 0.02359139700389258, 0.02788423259151496, 0.015128597688043094], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 105.0, 99, 115, 104.0, 115.0, 115.0, 115.0, 0.03301061527071063, 0.025982964754094496, 0.011734242147010417], "isController": false}, {"data": ["deleteAccount", 13, 2, 15.384615384615385, 581.0000000000001, 91, 1510, 516.0, 1372.8, 1510.0, 1510.0, 0.08276090374906894, 0.016058549758401822, 0.056319938932002364], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1342.681818181818, 785, 3404, 994.5, 3053.3999999999996, 3388.85, 3404.0, 0.0916685764286756, 0.04744564990937311, 0.04216396435342403], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 204.2857142857143, 197, 211, 205.0, 211.0, 211.0, 211.0, 0.033154928243262445, 0.05138366320513428, 0.07456621068772794], "isController": false}, {"data": ["addBook", 60, 11, 18.333333333333332, 980.8666666666666, 480, 1876, 814.5, 1718.7, 1801.45, 1876.0, 0.27551751372995614, 83.4800577697087, 1.001773428746579], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 186.14545454545458, 97, 445, 103.0, 394.2, 410.0, 445.0, 0.24961083401787212, 0.18550180145273507, 0.12066148714731124], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 625.2363636363639, 457, 905, 595.0, 815.6, 880.3999999999999, 905.0, 0.24957458876914349, 73.38321575439592, 0.12551846993760635], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/19f3f429-f3c7-4302-bc14-063eae1629c2", 3, 0, 0.0, 310.6666666666667, 196, 516, 220.0, 516.0, 516.0, 516.0, 0.031033733668497657, 0.02522501073249956, 0.01990118988507174], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 140.05454545454555, 93, 393, 100.0, 291.4, 304.59999999999997, 393.0, 0.24998068331083506, 0.44234863101487615, 0.12157263700077721], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 937.1636363636366, 632, 1290, 915.0, 1208.0, 1257.3999999999999, 1290.0, 0.24934151173491825, 224.35793055470555, 0.12515775100756638], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 21, 0, 0.0, 118.66666666666666, 97, 307, 104.0, 182.60000000000008, 296.29999999999984, 307.0, 0.10210432144385236, 0.07627910732865922, 0.03629489551324439], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 11, 6.285714285714286, 161.0857142857143, 94, 1258, 104.0, 284.00000000000006, 323.3999999999999, 1239.0000000000002, 0.7356681337991164, 1.5682088175606086, 0.3544261867377953], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 14, 0, 0.0, 102.71428571428572, 97, 109, 103.0, 107.0, 109.0, 109.0, 0.08623769572877012, 0.06678368428995576, 0.030654805903586255], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 13, 0, 0.0, 102.46153846153845, 97, 106, 103.0, 105.6, 106.0, 106.0, 0.0712336573551491, 0.057807782482547754, 0.025321339137963157], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/099afac7-22e2-4686-842c-eed035b9cf06", 3, 0, 0.0, 1034.6666666666667, 189, 1748, 1167.0, 1748.0, 1748.0, 1748.0, 0.021622089126251378, 0.025556577349420163, 0.013865727727446358], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2a62e133-0343-407d-abd9-db78e1337588", 1, 0, 0.0, 605.0, 605, 605, 605.0, 605.0, 605.0, 605.0, 1.6528925619834711, 0.29861828512396693, 1.1395919421487604], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cdee7754-6ab1-4a00-918b-b4a3a443071d", 3, 0, 0.0, 638.0, 237, 1067, 610.0, 1067.0, 1067.0, 1067.0, 0.026128307408246093, 0.02620485518385619, 0.016755457550209896], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 14, 0, 0.0, 357.2857142857143, 191, 1191, 203.0, 901.5, 1191.0, 1191.0, 0.0828446485315786, 7.198579315984283, 0.1848055147907285], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 372.4736842105264, 190, 1197, 380.0, 592.0, 1197.0, 1197.0, 0.09167937310609717, 5.90725975480593, 0.20495447847706086], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c1dd4eb8-27fd-487a-9a39-ae331a7f66e8", 1, 0, 0.0, 647.0, 647, 647, 647.0, 647.0, 647.0, 647.0, 1.5455950540958268, 0.27923348145285937, 1.0656153400309119], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 103.74999999999999, 99, 106, 105.0, 106.0, 106.0, 106.0, 0.07102987398116524, 0.0588909795019622, 0.02524890051674233], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 12, 0, 0.0, 101.08333333333333, 95, 105, 101.5, 104.7, 105.0, 105.0, 0.07505723113874328, 0.058271971440723554, 0.026680500131350156], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1374c2cd-2834-43e1-b8f3-0310c4679d00", 1, 0, 0.0, 207.0, 207, 207, 207.0, 207.0, 207.0, 207.0, 4.830917874396135, 0.8727732487922706, 3.330691425120773], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/13c8ca9e-5acf-4945-b607-ae3f1614c23b", 3, 0, 0.0, 630.3333333333334, 314, 1001, 576.0, 1001.0, 1001.0, 1001.0, 0.042468254979402896, 0.027302995958437732, 0.027233874449682192], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/793cd1f5-464c-4450-a7c0-8b31f2a9ad4a", 1, 0, 0.0, 450.0, 450, 450, 450.0, 450.0, 450.0, 450.0, 2.2222222222222223, 0.7096354166666666, 1.3259548611111112], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1ee27bc8-9302-48f3-87f0-6d5e634d942b", 1, 0, 0.0, 206.0, 206, 206, 206.0, 206.0, 206.0, 206.0, 4.854368932038835, 1.5501744538834952, 2.896503337378641], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a8f1fb13-86f3-488f-be3c-9af0a14867c3", 3, 0, 0.0, 481.0, 322, 582, 539.0, 582.0, 582.0, 582.0, 0.05088972197248562, 0.0327171877915557, 0.032634359468032774], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 21, 0, 0.0, 119.19047619047619, 93, 346, 99.0, 250.40000000000012, 340.0999999999999, 346.0, 0.10392078267195178, 0.0772301910286673, 0.052163361614632045], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 21, 0, 0.0, 159.66666666666663, 96, 386, 100.0, 302.0, 377.5999999999999, 386.0, 0.1039228397658272, 0.02780747860921548, 0.05926849455394832], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 21, 0, 0.0, 124.47619047619047, 92, 301, 98.0, 275.4, 298.49999999999994, 301.0, 0.10392489694114386, 0.028011007378667685, 0.06109647261578966], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 21, 0, 0.0, 153.76190476190476, 92, 304, 98.0, 302.0, 303.8, 304.0, 0.10392438263967932, 0.028010868758351067, 0.06119765891770179], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 26.923076923076923, 0.5347593582887701], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 7.6923076923076925, 0.15278838808250572], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 7.6923076923076925, 0.15278838808250572], "isController": false}, {"data": ["401/Unauthorized", 15, 57.69230769230769, 1.145912910618793], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1309, 26, "401/Unauthorized", 15, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
