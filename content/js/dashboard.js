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

    var data = {"OkPercent": 63.970588235294116, "KoPercent": 36.029411764705884};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4502724795640327, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fe4cb209-6e30-4e2e-95cc-ae581ca937e7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d5aa0ffd-394e-4139-840b-7f0ffdb31146"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1e7e7999-b46b-49ee-b0f9-9ca5082a469f"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/eb1bd8b1-c26b-47d9-9e07-e4e76c1a2b5b"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7727272727272727, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/fe4cb209-6e30-4e2e-95cc-ae581ca937e7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c5738af9-7067-4cfd-b7f8-08a1dca23549"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c5738af9-7067-4cfd-b7f8-08a1dca23549"], "isController": false}, {"data": [0.6363636363636364, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.8, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=92389c1a-a8f5-4dce-b37f-600d69437aa7"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7fbb836d-02c6-4d8e-b97d-3f1db5a6ccd0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b77244ff-ed80-42c7-b781-0afbb6762544"], "isController": false}, {"data": [0.0, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eb1bd8b1-c26b-47d9-9e07-e4e76c1a2b5b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d5aa0ffd-394e-4139-840b-7f0ffdb31146"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.7732919254658385, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6d91d49b-1955-415a-b901-7c87b27c4059"], "isController": false}, {"data": [0.84375, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b77244ff-ed80-42c7-b781-0afbb6762544"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b42a2a72-c000-4f9a-97eb-9c9a86746eab"], "isController": false}, {"data": [0.027777777777777776, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/7fbb836d-02c6-4d8e-b97d-3f1db5a6ccd0"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6d91d49b-1955-415a-b901-7c87b27c4059"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/67de1f71-34bb-4a3e-8b7c-126a91dd4662"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cda39f20-6a0f-44b3-827e-834f6de50f89"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/92389c1a-a8f5-4dce-b37f-600d69437aa7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1e7e7999-b46b-49ee-b0f9-9ca5082a469f"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN="], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/e3a5921f-7b20-4e03-bddc-89bd95ad6e25"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=67de1f71-34bb-4a3e-8b7c-126a91dd4662"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2cc797f2-e345-4d7b-b914-fea5e918206b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cda39f20-6a0f-44b3-827e-834f6de50f89"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.3, 500, 1500, "register"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 544, 196, 36.029411764705884, 1007.319852941176, 1, 38248, 141.5, 1085.0, 3530.75, 25072.299999999886, 2.1416563980016456, 2.2463255792609713, 0.9982537220629978], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fe4cb209-6e30-4e2e-95cc-ae581ca937e7", 1, 0, 0.0, 372.0, 372, 372, 372.0, 372.0, 372.0, 372.0, 2.688172043010753, 0.4856560819892473, 1.8533686155913978], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d5aa0ffd-394e-4139-840b-7f0ffdb31146", 3, 0, 0.0, 295.3333333333333, 224, 426, 236.0, 426.0, 426.0, 426.0, 0.014528196808639433, 0.017266421402455264, 0.009316584541998595], "isController": false}, {"data": ["see books", 51, 51, 100.0, 3078.882352941176, 479, 27021, 880.0, 7883.000000000002, 20608.399999999987, 27021.0, 0.23772234030652198, 1.4922602951835588, 0.39153357420199875], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 207.39999999999998, 120, 513, 131.0, 438.6, 513.0, 513.0, 0.06553165834414605, 0.05087662928085558, 0.02329445667702067], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 16, 100.0, 214.1875, 123, 1275, 127.5, 646.4000000000007, 1275.0, 1275.0, 0.08561689649452318, 0.0425576174958128, 0.04297566874822747], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 13, 13, 100.0, 161.84615384615384, 118, 371, 126.0, 370.2, 371.0, 371.0, 0.11176258188758403, 0.05766955941900652, 0.05609957723654121], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1e7e7999-b46b-49ee-b0f9-9ca5082a469f", 1, 0, 0.0, 460.0, 460, 460, 460.0, 460.0, 460.0, 460.0, 2.1739130434782608, 0.39274796195652173, 1.4988111413043477], "isController": false}, {"data": ["https://demoqa.com/books", 51, 51, 100.0, 271.9215686274508, 119, 774, 130.0, 510.0, 616.1999999999999, 774.0, 0.23151720944590215, 0.1289516809965227, 0.10972064441226406], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eb1bd8b1-c26b-47d9-9e07-e4e76c1a2b5b", 3, 0, 0.0, 390.6666666666667, 322, 526, 324.0, 526.0, 526.0, 526.0, 0.029091755396520626, 0.01870319560811466, 0.018655845745815636], "isController": false}, {"data": ["deleteBook", 11, 0, 0.0, 583.7272727272727, 417, 1578, 441.0, 1416.2000000000007, 1578.0, 1578.0, 0.061884321325899716, 0.011180272895792428, 0.04206199965119746], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 11, 0, 0.0, 583.7272727272727, 417, 1578, 441.0, 1416.2000000000007, 1578.0, 1578.0, 0.06181060107999977, 0.011166954296679648, 0.04201189292156235], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 20, 6, 30.0, 3092.85, 310, 34346, 999.5, 8639.400000000012, 33086.79999999998, 34346.0, 0.08162232533842657, 0.02560262783076427, 0.03682569756479792], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fe4cb209-6e30-4e2e-95cc-ae581ca937e7", 3, 0, 0.0, 545.6666666666666, 282, 702, 653.0, 702.0, 702.0, 702.0, 0.04777070063694267, 0.030276547571656053, 0.03063420581210191], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c5738af9-7067-4cfd-b7f8-08a1dca23549", 1, 0, 0.0, 408.0, 408, 408, 408.0, 408.0, 408.0, 408.0, 2.450980392156863, 0.44280407475490197, 1.6898360906862746], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c5738af9-7067-4cfd-b7f8-08a1dca23549", 3, 0, 0.0, 292.6666666666667, 222, 422, 234.0, 422.0, 422.0, 422.0, 0.01837019619369535, 0.025324798463639258, 0.01178036669973302], "isController": false}, {"data": ["deleteAccount", 11, 0, 0.0, 913.8181818181819, 398, 2708, 526.0, 2633.4, 2708.0, 2708.0, 0.06206308995198574, 0.011212569962028672, 0.04224411493802154], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 2876.6000000000004, 129, 13861, 131.0, 13861.0, 13861.0, 13861.0, 0.045240680419833514, 0.0356093636898299, 0.016081648117987696], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 18, 1, 5.555555555555555, 1182.611111111111, 1, 3805, 1002.0, 2505.400000000002, 3805.0, 3805.0, 0.07798791187365958, 0.04686806097138277, 0.03387853788912718], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 249.76923076923077, 191, 379, 219.0, 369.8, 379.0, 379.0, 0.06513776637588499, 0.12344957240814322, 0.040828539861807726], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=92389c1a-a8f5-4dce-b37f-600d69437aa7", 1, 0, 0.0, 448.0, 448, 448, 448.0, 448.0, 448.0, 448.0, 2.232142857142857, 0.4032679966517857, 1.5389578683035714], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 5, 100.0, 182.6, 117, 380, 131.0, 380.0, 380.0, 380.0, 0.04090146836271422, 0.02234402480674056, 0.020530619861753037], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7fbb836d-02c6-4d8e-b97d-3f1db5a6ccd0", 1, 0, 0.0, 274.0, 274, 274, 274.0, 274.0, 274.0, 274.0, 3.6496350364963503, 0.6593578923357664, 2.5162522810218975], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b77244ff-ed80-42c7-b781-0afbb6762544", 1, 0, 0.0, 360.0, 360, 360, 360.0, 360.0, 360.0, 360.0, 2.7777777777777777, 0.5018446180555556, 1.9151475694444444], "isController": false}, {"data": ["addBook", 55, 55, 100.0, 4408.854545454545, 495, 40622, 773.0, 14983.599999999991, 36807.0, 40622.0, 0.2593752357956689, 0.8631871527908775, 0.49004511213263036], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eb1bd8b1-c26b-47d9-9e07-e4e76c1a2b5b", 1, 0, 0.0, 403.0, 403, 403, 403.0, 403.0, 403.0, 403.0, 2.4813895781637716, 0.44829792183622824, 1.710801799007444], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d5aa0ffd-394e-4139-840b-7f0ffdb31146", 1, 0, 0.0, 463.0, 463, 463, 463.0, 463.0, 463.0, 463.0, 2.1598272138228944, 0.3902031587473002, 1.4890996220302375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 13, 2, 15.384615384615385, 187.3076923076923, 122, 369, 131.0, 368.2, 369.0, 369.0, 0.12360939431396788, 0.09227062434629647, 0.04393927688504326], "isController": false}, {"data": ["deleteBooks", 11, 0, 0.0, 407.81818181818176, 203, 598, 408.0, 577.8000000000001, 598.0, 598.0, 0.06179462836148734, 0.011164068600464023, 0.04260449963204108], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 161, 16, 9.937888198757763, 1783.5527950310543, 1, 38248, 138.0, 2095.2000000000003, 11355.400000000005, 35514.419999999984, 0.6465941356723174, 1.3408325451712269, 0.2972825413057185], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 938.4285714285714, 119, 5552, 131.0, 5552.0, 5552.0, 5552.0, 0.03577524966013513, 0.027704856426256988, 0.01271698327762616], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 9, 9, 100.0, 155.11111111111111, 119, 369, 129.0, 369.0, 369.0, 369.0, 0.0459464978558301, 0.02283864004747805, 0.02306298818153972], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6d91d49b-1955-415a-b901-7c87b27c4059", 1, 0, 0.0, 203.0, 203, 203, 203.0, 203.0, 203.0, 203.0, 4.926108374384237, 0.889970751231527, 3.3963208128078817], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 2, 12.5, 241.99999999999994, 119, 1222, 130.5, 637.5000000000006, 1222.0, 1222.0, 0.10094764602707922, 0.10748484405165996, 0.031398266855102275], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b77244ff-ed80-42c7-b781-0afbb6762544", 3, 0, 0.0, 476.6666666666667, 191, 1024, 215.0, 1024.0, 1024.0, 1024.0, 0.049814027630180654, 0.0315715858710813, 0.03194454245815622], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 18, 1, 5.555555555555555, 1033.0, 245, 9397, 493.0, 2034.1000000000117, 9397.0, 9397.0, 0.0795151343805771, 0.05856217172397646, 0.03395527466957044], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b42a2a72-c000-4f9a-97eb-9c9a86746eab", 1, 0, 0.0, 454.0, 454, 454, 454.0, 454.0, 454.0, 454.0, 2.2026431718061676, 0.703383122246696, 1.3142724394273126], "isController": false}, {"data": ["login", 18, 4, 22.22222222222222, 3467.1666666666665, 614, 28334, 1917.5, 6669.200000000034, 28334.0, 28334.0, 0.07891863926728428, 0.13386882461647734, 0.11370672216912264], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/7fbb836d-02c6-4d8e-b97d-3f1db5a6ccd0", 3, 0, 0.0, 1131.0, 198, 2335, 860.0, 2335.0, 2335.0, 2335.0, 0.07239032865209208, 0.03275473855026302, 0.0464221834129627], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 7, 100.0, 285.2857142857143, 119, 1251, 127.0, 1251.0, 1251.0, 1251.0, 0.03751319660666341, 0.018646696360148124, 0.018829866265454097], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 1, 6.25, 1138.8749999999998, 120, 5982, 199.5, 5339.400000000001, 5982.0, 5982.0, 0.081799172805865, 0.07647204161788539, 0.027259734101563897], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6d91d49b-1955-415a-b901-7c87b27c4059", 3, 0, 0.0, 634.3333333333334, 215, 994, 694.0, 994.0, 994.0, 994.0, 0.0727837352612936, 0.03293274479596293, 0.046674465646076954], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 15, 100.0, 144.0, 120, 382, 128.0, 234.4000000000001, 382.0, 382.0, 0.06543788853746318, 0.032527231704656996, 0.03284675264478133], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/67de1f71-34bb-4a3e-8b7c-126a91dd4662", 3, 0, 0.0, 1084.3333333333335, 210, 2708, 335.0, 2708.0, 2708.0, 2708.0, 0.04398633491195402, 0.03666959756169083, 0.028207382739762178], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cda39f20-6a0f-44b3-827e-834f6de50f89", 1, 0, 0.0, 598.0, 598, 598, 598.0, 598.0, 598.0, 598.0, 1.6722408026755853, 0.3021138168896321, 1.1529316471571907], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 9, 0, 0.0, 598.2222222222222, 121, 4114, 131.0, 4114.0, 4114.0, 4114.0, 0.045061960195268494, 0.037360941607209916, 0.01601811866316185], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/92389c1a-a8f5-4dce-b37f-600d69437aa7", 3, 0, 0.0, 280.0, 217, 402, 221.0, 402.0, 402.0, 402.0, 0.02145201541684841, 0.02151486311826496, 0.013756663532288858], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1e7e7999-b46b-49ee-b0f9-9ca5082a469f", 3, 0, 0.0, 290.6666666666667, 219, 398, 255.0, 398.0, 398.0, 398.0, 0.01752438810678194, 0.020713233468660552, 0.011237970237747532], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 21, 21, 100.0, 153.33333333333331, 118, 369, 127.0, 338.2000000000001, 368.9, 369.0, 0.09652731493185632, 0.04798086259796373, 0.04845218737790444], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=", 4, 4, 100.0, 5064.75, 2228, 6867, 5582.0, 6867.0, 6867.0, 6867.0, 0.37896731406916156, 0.12286830885836098, 0.12989992894362862], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e3a5921f-7b20-4e03-bddc-89bd95ad6e25", 1, 0, 0.0, 16576.0, 16576, 16576, 16576.0, 16576.0, 16576.0, 16576.0, 0.06032818532818533, 0.019264957619449807, 0.035996602769063704], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 21, 1, 4.761904761904762, 249.80952380952382, 120, 1414, 131.0, 381.6, 1310.7999999999986, 1414.0, 0.09915482317389866, 0.07682377738561783, 0.0352464410500968], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=67de1f71-34bb-4a3e-8b7c-126a91dd4662", 1, 0, 0.0, 497.0, 497, 497, 497.0, 497.0, 497.0, 497.0, 2.012072434607646, 0.3635091800804829, 1.3872296277665996], "isController": false}, {"data": ["https://demoqa.com/books?book=", 4, 4, 100.0, 364.5, 352, 377, 364.5, 377.0, 377.0, 377.0, 0.4416961130742049, 0.2195540249558304, 0.21610327407243818], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2cc797f2-e345-4d7b-b914-fea5e918206b", 2, 0, 0.0, 208.0, 204, 212, 208.0, 212.0, 212.0, 212.0, 0.019808256081134616, 0.028010112114729417, 0.01231245605043182], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cda39f20-6a0f-44b3-827e-834f6de50f89", 3, 0, 0.0, 328.6666666666667, 215, 415, 356.0, 415.0, 415.0, 415.0, 0.026823794493969117, 0.01724511527525684, 0.017201456755572643], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 16, 100.0, 145.87500000000003, 118, 374, 126.0, 250.10000000000014, 374.0, 374.0, 0.09817938601066474, 0.04880205808537925, 0.04928144961863444], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 5, 100.0, 226.2, 127, 379, 130.0, 379.0, 379.0, 379.0, 0.034942798638628564, 0.017369027838927676, 0.01723253253174553], "isController": false}, {"data": ["register", 20, 6, 30.0, 3092.85, 310, 34346, 999.5, 8639.400000000012, 33086.79999999998, 34346.0, 0.08296620786353717, 0.026024165982195452, 0.03743201956343181], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 4, 2.0408163265306123, 0.7352941176470589], "isController": false}, {"data": ["406/Not Acceptable", 6, 3.061224489795918, 1.1029411764705883], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, 0.5102040816326531, 0.18382352941176472], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: demoqa.com:443 failed to respond", 3, 1.530612244897959, 0.5514705882352942], "isController": false}, {"data": ["500/Internal Server Error", 11, 5.612244897959184, 2.0220588235294117], "isController": false}, {"data": ["401/Unauthorized", 8, 4.081632653061225, 1.4705882352941178], "isController": false}, {"data": ["404/Not Found", 156, 79.59183673469387, 28.676470588235293], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 7, 3.5714285714285716, 1.286764705882353], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 544, 196, "404/Not Found", 156, "500/Internal Server Error", 11, "401/Unauthorized", 8, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 7, "406/Not Acceptable", 6], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 16, "404/Not Found", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 13, 13, "404/Not Found", 12, "500/Internal Server Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books", 51, 51, "404/Not Found", 47, "500/Internal Server Error", 3, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 1, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 20, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 18, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: demoqa.com:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 5, "404/Not Found", 4, "500/Internal Server Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 13, 2, "500/Internal Server Error", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 161, 16, "401/Unauthorized", 8, "500/Internal Server Error", 3, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 3, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: demoqa.com:443 failed to respond", 2, "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 9, 9, "404/Not Found", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 18, 1, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 7, "404/Not Found", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 1, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 15, "404/Not Found", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 21, 21, "404/Not Found", 21, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=", 4, 4, "400/Bad Request", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 21, 1, "500/Internal Server Error", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=", 4, 4, "404/Not Found", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 16, "404/Not Found", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 5, "404/Not Found", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
