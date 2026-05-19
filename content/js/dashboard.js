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

    var data = {"OkPercent": 98.80287310454908, "KoPercent": 1.1971268954509178};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7388622344071282, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=908817d9-85fb-48f7-b2d5-56f5ccf6d406"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ffccf6ce-f0c8-4160-a2fc-1bfd32dc2b28"], "isController": false}, {"data": [0.46153846153846156, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.46153846153846156, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=92c7b335-640c-4ef3-8338-a62d609c1c54"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/021a2880-4c8b-4acb-a49a-253d25441ff0"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a6da3dc0-28c9-4caf-a3d9-aeb38d65deb9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.4642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6eabd2b9-ed90-4d06-99ef-1d1b4f51fd66"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/90ebc4ab-60e0-447e-9b16-adf1dd2456a2"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/1b5cf37c-c2c4-4710-8102-e0fb99e751fd"], "isController": false}, {"data": [0.6904761904761905, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=42d3ba07-9ac9-496d-8f79-15991d0a56f3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b6aa0195-e952-4ff5-a51c-cfd0db7392b2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b2ca1424-95ac-42ef-a700-094cebed3e54"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f012b494-87e9-4887-b089-6e6d93012e31"], "isController": false}, {"data": [0.78125, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.14285714285714285, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/75a4618f-3156-44ae-8acb-fc0d4c3ad1f6"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/92c7b335-640c-4ef3-8338-a62d609c1c54"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/908817d9-85fb-48f7-b2d5-56f5ccf6d406"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.2777777777777778, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3157894736842105, 500, 1500, "addBook"], "isController": true}, {"data": [0.9074074074074074, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1b5cf37c-c2c4-4710-8102-e0fb99e751fd"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=90ebc4ab-60e0-447e-9b16-adf1dd2456a2"], "isController": false}, {"data": [0.9907407407407407, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.39814814814814814, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/efc05c82-dd38-46b6-8d64-1709f89ec1fe"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ffccf6ce-f0c8-4160-a2fc-1bfd32dc2b28"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b6aa0195-e952-4ff5-a51c-cfd0db7392b2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/42d3ba07-9ac9-496d-8f79-15991d0a56f3"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.7105263157894737, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d1654886-a411-45d7-b8dd-cb1ae94c1e61"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/b2ca1424-95ac-42ef-a700-094cebed3e54"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f012b494-87e9-4887-b089-6e6d93012e31"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=021a2880-4c8b-4acb-a49a-253d25441ff0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6413ab67-9f84-413d-bd87-4d7fff2faf5f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/df00eb72-a61c-4023-b88a-03a1ebf11597"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/59c0ad0a-8047-4d76-8083-e55226017978"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=75a4618f-3156-44ae-8acb-fc0d4c3ad1f6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1253, 15, 1.1971268954509178, 472.52673583399866, 127, 3712, 159.0, 1321.6000000000001, 1595.1999999999998, 2146.0, 4.885580713458547, 693.5574412441173, 3.557367526630899], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 2255.6481481481474, 1613, 3052, 2277.5, 2721.5, 2846.75, 3052.0, 0.24764053600418237, 297.99445649924564, 1.2176465808408772], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=908817d9-85fb-48f7-b2d5-56f5ccf6d406", 1, 0, 0.0, 505.0, 505, 505, 505.0, 505.0, 505.0, 505.0, 1.9801980198019802, 0.3577506188118812, 1.3652537128712872], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ffccf6ce-f0c8-4160-a2fc-1bfd32dc2b28", 1, 0, 0.0, 494.0, 494, 494, 494.0, 494.0, 494.0, 494.0, 2.0242914979757085, 0.36571672570850206, 1.3956540991902835], "isController": false}, {"data": ["deleteBook", 13, 2, 15.384615384615385, 739.3076923076924, 142, 2454, 529.0, 2153.9999999999995, 2454.0, 2454.0, 0.08347727812702672, 0.016548718222447682, 0.05612392121671344], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, 15.384615384615385, 739.3076923076924, 142, 2454, 529.0, 2153.9999999999995, 2454.0, 2454.0, 0.08260576715340527, 0.01637594798060671, 0.055537981972879895], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=92c7b335-640c-4ef3-8338-a62d609c1c54", 1, 0, 0.0, 716.0, 716, 716, 716.0, 716.0, 716.0, 716.0, 1.3966480446927374, 0.2523241096368715, 0.9629233589385475], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 185.5625, 131, 409, 134.0, 408.3, 409.0, 409.0, 0.07985028072364317, 0.028861899563318777, 0.045120477230193384], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 136.68750000000003, 130, 147, 135.0, 144.9, 147.0, 147.0, 0.07984749129163299, 0.05933978600872334, 0.04007969777724546], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 193.5625, 132, 795, 137.0, 518.5000000000002, 795.0, 795.0, 0.0798506792298402, 1.4875990491530837, 0.04659255941389601], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 285.3125, 128, 1466, 138.0, 724.7000000000007, 1466.0, 1466.0, 0.07985426596461458, 4.510991074102263, 0.046516669578020114], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/021a2880-4c8b-4acb-a49a-253d25441ff0", 3, 0, 0.0, 393.6666666666667, 248, 481, 452.0, 481.0, 481.0, 481.0, 0.02770850651149903, 0.02778968377666944, 0.017768801376189157], "isController": false}, {"data": ["goToProfile", 13, 2, 15.384615384615385, 272.23076923076917, 142, 452, 245.0, 447.6, 452.0, 452.0, 0.08390723732193915, 0.17201866088890036, 0.05423211162244325], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a6da3dc0-28c9-4caf-a3d9-aeb38d65deb9", 1, 0, 0.0, 259.0, 259, 259, 259.0, 259.0, 259.0, 259.0, 3.8610038610038613, 1.2329572876447876, 2.303782577220077], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 138.14285714285714, 135, 143, 138.0, 142.0, 143.0, 143.0, 0.08704085946631518, 0.06468563872447838, 0.04369043141180274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 174.64285714285714, 132, 413, 136.5, 405.5, 413.0, 413.0, 0.08704085946631518, 0.02329022997438512, 0.049640490164382885], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 983.3333333333334, 823, 1083, 1044.0, 1083.0, 1083.0, 1083.0, 0.09413832057236099, 27.679791934699388, 0.05368826095142463], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 1375.0, 1187, 1609, 1329.0, 1609.0, 1609.0, 1609.0, 0.09383210309020393, 84.4302912998092, 0.0534219883804579], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 320.3333333333333, 143, 413, 405.0, 413.0, 413.0, 413.0, 0.09618467457518436, 0.17020178743186917, 0.05325850633215774], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 180.76923076923077, 134, 458, 138.0, 427.59999999999997, 458.0, 458.0, 0.0881642839703768, 0.06552052744282885, 0.04425433785231804], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 195.53846153846155, 128, 404, 136.0, 402.4, 404.0, 404.0, 0.08831221765565028, 0.04403669627390373, 0.049224508338711316], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 396.46153846153845, 132, 1485, 136.0, 1437.0, 1485.0, 1485.0, 0.08831221765565028, 12.245293022485649, 0.0507503354165959], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 302.61538461538464, 129, 1092, 138.0, 979.9999999999999, 1092.0, 1092.0, 0.08831101781844614, 4.014967019231422, 0.05083588713512265], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 137.33333333333334, 134, 139, 139.0, 139.0, 139.0, 139.0, 0.09701202949165696, 0.0720958539483896, 0.0544745282790066], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 1113.7857142857142, 138, 1814, 1414.0, 1790.0, 1814.0, 1814.0, 0.11021278940697647, 70.84395997012446, 0.05802777165484503], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 184.64285714285714, 128, 542, 138.5, 473.0, 542.0, 542.0, 0.08704140062048084, 0.023460377510988978, 0.05117082341164987], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6eabd2b9-ed90-4d06-99ef-1d1b4f51fd66", 1, 0, 0.0, 430.0, 430, 430, 430.0, 430.0, 430.0, 430.0, 2.3255813953488373, 0.7426417151162791, 1.3876271802325582], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 816.2142857142858, 134, 1224, 1048.5, 1208.5, 1224.0, 1224.0, 0.10989442285803995, 23.088897964990778, 0.05796746830723341], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 173.35714285714286, 133, 401, 137.0, 394.0, 401.0, 401.0, 0.08704031831887843, 0.0234600857968852, 0.05125518744754266], "isController": false}, {"data": ["deleteBooks", 13, 2, 15.384615384615385, 723.8461538461539, 141, 1909, 535.0, 1702.1999999999998, 1909.0, 1909.0, 0.08261626650736556, 0.016378029395503133, 0.056053945244480596], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/90ebc4ab-60e0-447e-9b16-adf1dd2456a2", 3, 0, 0.0, 740.0, 245, 1488, 487.0, 1488.0, 1488.0, 1488.0, 0.022182950184488202, 0.02621949613277235, 0.014225394486797447], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 599.9230769230769, 272, 1943, 287.0, 1767.3999999999999, 1943.0, 1943.0, 0.08808244516867789, 16.327390009163963, 0.1946322960213837], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1b5cf37c-c2c4-4710-8102-e0fb99e751fd", 3, 0, 0.0, 1082.3333333333335, 251, 2671, 325.0, 2671.0, 2671.0, 2671.0, 0.029810405818991217, 0.02485170875730355, 0.019116699044079654], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 674.6666666666666, 143, 1431, 653.0, 1300.6000000000001, 1420.6999999999998, 1431.0, 0.09802594419989824, 0.06021320205247655, 0.04432227750444617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 138.14285714285714, 134, 147, 138.0, 145.5, 147.0, 147.0, 0.11024576931860239, 0.0819306938002504, 0.05533820842750159], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 235.1428571428571, 128, 413, 137.5, 410.5, 413.0, 413.0, 0.11019804162337458, 0.14770965177418846, 0.056236668004785745], "isController": false}, {"data": ["login", 21, 0, 0.0, 2717.142857142857, 1585, 4798, 2615.0, 3973.6000000000004, 4732.299999999999, 4798.0, 0.09188200600295772, 15.83240534102444, 0.16039614133858957], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 141.0, 131, 153, 141.0, 148.5, 153.0, 153.0, 0.08473858147614609, 0.0686018398864503, 0.030121917634098806], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=42d3ba07-9ac9-496d-8f79-15991d0a56f3", 1, 0, 0.0, 535.0, 535, 535, 535.0, 535.0, 535.0, 535.0, 1.8691588785046729, 0.3376898364485981, 1.288697429906542], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b6aa0195-e952-4ff5-a51c-cfd0db7392b2", 1, 0, 0.0, 1909.0, 1909, 1909, 1909.0, 1909.0, 1909.0, 1909.0, 0.5238344683080147, 0.09463806312205343, 0.3611593111576742], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b2ca1424-95ac-42ef-a700-094cebed3e54", 1, 0, 0.0, 1054.0, 1054, 1054, 1054.0, 1054.0, 1054.0, 1054.0, 0.9487666034155597, 0.17140802893738138, 0.6541300996204933], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 1279.2142857142858, 274, 1949, 1557.5, 1927.5, 1949.0, 1949.0, 0.10977378758772101, 93.85404619320187, 0.22682192633394754], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f012b494-87e9-4887-b089-6e6d93012e31", 1, 0, 0.0, 598.0, 598, 598, 598.0, 598.0, 598.0, 598.0, 1.6722408026755853, 0.3021138168896321, 1.1529316471571907], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 441.375, 269, 1604, 274.0, 867.6000000000008, 1604.0, 1604.0, 0.07979214147146682, 6.082129684983119, 0.1781784233322196], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 4, 57.142857142857146, 729.4285714285714, 140, 1749, 143.0, 1749.0, 1749.0, 1749.0, 0.10878518035028828, 55.793017254106644, 0.14631667463129597], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/75a4618f-3156-44ae-8acb-fc0d4c3ad1f6", 3, 0, 0.0, 487.33333333333337, 229, 951, 282.0, 951.0, 951.0, 951.0, 0.030309153364316024, 0.025267494064457465, 0.01943653389573651], "isController": false}, {"data": ["register", 22, 4, 18.181818181818183, 1370.2272727272727, 146, 3712, 1361.0, 2131.8999999999996, 3490.149999999997, 3712.0, 0.09031013320744648, 0.02870297202438374, 0.0407453921307034], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 19, 0, 0.0, 146.10526315789474, 135, 179, 142.0, 161.0, 179.0, 179.0, 0.08938946992044337, 0.06939905135425047, 0.0317751631357826], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 400.0, 272, 680, 285.5, 617.0, 680.0, 680.0, 0.08696678490008138, 0.13478153089495035, 0.19559033752430413], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/92c7b335-640c-4ef3-8338-a62d609c1c54", 3, 0, 0.0, 373.6666666666667, 257, 497, 367.0, 497.0, 497.0, 497.0, 0.03854752910338447, 0.03213548894328374, 0.02471960687944903], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 543.4705882352941, 270, 1638, 538.0, 1347.5999999999997, 1638.0, 1638.0, 0.10892687802752647, 15.480062426714635, 0.2417002824890432], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/908817d9-85fb-48f7-b2d5-56f5ccf6d406", 3, 0, 0.0, 405.6666666666667, 262, 485, 470.0, 485.0, 485.0, 485.0, 0.04830840083090449, 0.031057647018566528, 0.030979020064089147], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 191.29999999999998, 134, 417, 138.5, 415.0, 417.0, 417.0, 0.049211145340196646, 0.03657195469129849, 0.024701688188340898], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 191.20000000000002, 132, 420, 135.0, 419.4, 420.0, 420.0, 0.04914487910359741, 0.013150094603892276, 0.028027938863770398], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 240.4, 136, 404, 139.0, 403.7, 404.0, 404.0, 0.04921211405399553, 0.013264202616115984, 0.02893134048877472], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 245.0, 132, 412, 140.0, 412.0, 412.0, 412.0, 0.049210903167705836, 0.013263876244420714, 0.028978686142701778], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 142.5, 141, 144, 142.5, 144.0, 144.0, 144.0, 0.08177617859917406, 0.024117583922803287, 0.050551094778590995], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1546.7037037037035, 1056, 2476, 1438.5, 2146.0, 2242.75, 2476.0, 0.24750092812848049, 296.0971552862073, 0.48871765300369874], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 4, 18.181818181818183, 1370.2272727272727, 146, 3712, 1361.0, 2131.8999999999996, 3490.149999999997, 3712.0, 0.09078641670139935, 0.028854347637696173, 0.04096027784770166], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 253.25, 133, 538, 137.0, 538.0, 538.0, 538.0, 0.038379981001909404, 0.010344604254420894, 0.022600711468897822], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 198.75, 129, 403, 135.0, 403.0, 403.0, 403.0, 0.03837979687492504, 0.010344554626444638, 0.022563122772172726], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 19, 0, 0.0, 330.15789473684214, 130, 1464, 137.0, 1443.0, 1464.0, 1464.0, 0.08762140175796201, 8.320277192033831, 0.05071917283090914], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 19, 0, 0.0, 234.5789473684211, 129, 1090, 136.0, 796.0, 1090.0, 1090.0, 0.08762018953630474, 2.733050969586571, 0.05080403773432636], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 19, 0, 0.0, 193.36842105263156, 128, 421, 137.0, 404.0, 421.0, 421.0, 0.08761776519361221, 0.06511437432845595, 0.043980011044449874], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 172.25000000000003, 130, 409, 138.0, 409.0, 409.0, 409.0, 0.038380165130660476, 0.01026969262285251, 0.0218886879260798], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 19, 0, 0.0, 220.31578947368422, 129, 413, 137.0, 413.0, 413.0, 413.0, 0.08762018953630474, 0.037298026816389586, 0.049196286518019786], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 239.49999999999997, 130, 415, 140.5, 415.0, 415.0, 415.0, 0.03838108580091731, 0.02852344364697077, 0.01926550595866357], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 141.25, 135, 154, 140.5, 154.0, 154.0, 154.0, 0.040594300560201343, 0.031952154542502234, 0.014430005277259073], "isController": false}, {"data": ["deleteAccount", 13, 2, 15.384615384615385, 898.0769230769229, 140, 2671, 650.0, 2359.3999999999996, 2671.0, 2671.0, 0.08241409915050082, 0.015991257369722327, 0.05608393360910358], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1542.047619047619, 854, 3466, 1382.0, 2455.0, 3371.3999999999987, 3466.0, 0.09406832047732953, 0.04868770493455533, 0.043267752875802944], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 495.375, 268, 949, 279.0, 949.0, 949.0, 949.0, 0.03835569150517323, 0.05944383048702139, 0.08626284915665423], "isController": false}, {"data": ["addBook", 57, 3, 5.2631578947368425, 1388.438596491228, 715, 2691, 1095.0, 2278.6000000000004, 2425.299999999999, 2691.0, 0.27530778927845206, 99.30699773082385, 0.9986274985993112], "isController": true}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 268.8518518518518, 134, 571, 141.0, 545.0, 556.5, 571.0, 0.24870237234429618, 0.1848266653847748, 0.120222338193776], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1b5cf37c-c2c4-4710-8102-e0fb99e751fd", 1, 0, 0.0, 430.0, 430, 430, 430.0, 430.0, 430.0, 430.0, 2.3255813953488373, 0.42014898255813954, 1.6033793604651163], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 856.6296296296297, 633, 1396, 808.5, 1086.5, 1139.5, 1396.0, 0.2484769284570503, 73.06046717688795, 0.12496642397986416], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=90ebc4ab-60e0-447e-9b16-adf1dd2456a2", 1, 0, 0.0, 1001.0, 1001, 1001, 1001.0, 1001.0, 1001.0, 1001.0, 0.999000999000999, 0.18048357892107894, 0.6887643606393608], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 206.83333333333334, 132, 514, 142.5, 410.0, 417.25, 514.0, 0.24923498705362707, 0.4410290981847385, 0.12120998393818971], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1276.2407407407409, 916, 1914, 1214.5, 1610.0, 1804.5, 1914.0, 0.24818685712709923, 223.3189703089237, 0.12457816851887599], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 142.5294117647059, 137, 157, 141.0, 154.6, 157.0, 157.0, 0.11142280365991139, 0.08324066874983614, 0.03960732473848413], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/efc05c82-dd38-46b6-8d64-1709f89ec1fe", 1, 0, 0.0, 320.0, 320, 320, 320.0, 320.0, 320.0, 320.0, 3.125, 0.9979248046875, 1.8646240234375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 3, 1.7857142857142858, 201.5952380952381, 127, 531, 144.0, 353.99999999999994, 436.65, 524.1, 0.6906276078386234, 1.5081665494209826, 0.3325556278956001], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 185.0, 139, 401, 143.5, 391.6, 401.0, 401.0, 0.047345794746510614, 0.03666524925193645, 0.016829950476298695], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ffccf6ce-f0c8-4160-a2fc-1bfd32dc2b28", 3, 0, 0.0, 370.66666666666663, 222, 650, 240.0, 650.0, 650.0, 650.0, 0.029493594974291416, 0.02458759659152354, 0.018913535839633493], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 140.625, 134, 148, 140.0, 147.3, 148.0, 148.0, 0.0777125316314289, 0.06306554080636466, 0.02762437647835949], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b6aa0195-e952-4ff5-a51c-cfd0db7392b2", 3, 0, 0.0, 444.0, 226, 869, 237.0, 869.0, 869.0, 869.0, 0.024522024865333215, 0.028984203218107064, 0.01572538703929246], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/42d3ba07-9ac9-496d-8f79-15991d0a56f3", 3, 0, 0.0, 571.3333333333334, 336, 937, 441.0, 937.0, 937.0, 937.0, 0.02273536789614484, 0.022949992137351934, 0.014579646730275174], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 493.2, 271, 829, 540.0, 826.7, 829.0, 829.0, 0.049110848095235755, 0.07611222258509683, 0.11045144840168744], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 19, 0, 0.0, 568.4736842105264, 265, 1866, 290.0, 1838.0, 1866.0, 1866.0, 0.08756204231550908, 11.148224067521856, 0.19457081493762357], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d1654886-a411-45d7-b8dd-cb1ae94c1e61", 1, 0, 0.0, 316.0, 316, 316, 316.0, 316.0, 316.0, 316.0, 3.1645569620253164, 1.0105567642405062, 1.8882268591772151], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b2ca1424-95ac-42ef-a700-094cebed3e54", 3, 0, 0.0, 936.3333333333333, 337, 1892, 580.0, 1892.0, 1892.0, 1892.0, 0.020071454377584202, 0.02372377957194278, 0.012871342813750283], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f012b494-87e9-4887-b089-6e6d93012e31", 3, 0, 0.0, 318.6666666666667, 229, 473, 254.0, 473.0, 473.0, 473.0, 0.029128475998135776, 0.029213813330161566, 0.018679393787867017], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 141.46153846153848, 136, 160, 140.0, 155.2, 160.0, 160.0, 0.08577630858356922, 0.07111727147211941, 0.030490797191815622], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=021a2880-4c8b-4acb-a49a-253d25441ff0", 1, 0, 0.0, 1392.0, 1392, 1392, 1392.0, 1392.0, 1392.0, 1392.0, 0.7183908045977011, 0.12978740122126436, 0.49529678520114945], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 143.50000000000003, 133, 161, 142.5, 159.0, 161.0, 161.0, 0.10766580534022395, 0.08358819848191214, 0.03827182924203273], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6413ab67-9f84-413d-bd87-4d7fff2faf5f", 1, 0, 0.0, 361.0, 361, 361, 361.0, 361.0, 361.0, 361.0, 2.770083102493075, 0.8845870844875346, 1.6528523199445984], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/df00eb72-a61c-4023-b88a-03a1ebf11597", 1, 0, 0.0, 230.0, 230, 230, 230.0, 230.0, 230.0, 230.0, 4.3478260869565215, 1.3884171195652173, 2.594259510869565], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/59c0ad0a-8047-4d76-8083-e55226017978", 1, 0, 0.0, 330.0, 330, 330, 330.0, 330.0, 330.0, 330.0, 3.0303030303030303, 0.9676846590909091, 1.8081202651515151], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 153.70588235294116, 132, 414, 137.0, 203.5999999999998, 414.0, 414.0, 0.1090288734110645, 0.08102634049396493, 0.05472738372391324], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=75a4618f-3156-44ae-8acb-fc0d4c3ad1f6", 1, 0, 0.0, 491.0, 491, 491, 491.0, 491.0, 491.0, 491.0, 2.0366598778004072, 0.3679512474541752, 1.404181517311609], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 277.6470588235294, 135, 419, 381.0, 410.2, 419.0, 419.0, 0.10922291111182499, 0.04852539031128529, 0.061212012914003015], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 338.64705882352933, 132, 1495, 139.0, 1212.5999999999997, 1495.0, 1495.0, 0.10922150764229314, 11.588058133950543, 0.06310603882503357], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 275.0588235294117, 130, 977, 140.0, 861.8, 977.0, 977.0, 0.10921659578295449, 3.804010015804284, 0.06320985768113893], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 26.666666666666668, 0.3192338387869114], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 13.333333333333334, 0.1596169193934557], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 13.333333333333334, 0.1596169193934557], "isController": false}, {"data": ["401/Unauthorized", 7, 46.666666666666664, 0.5586592178770949], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1253, 15, "401/Unauthorized", 7, "406/Not Acceptable", 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 7, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
