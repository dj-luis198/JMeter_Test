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

    var data = {"OkPercent": 66.19273301737756, "KoPercent": 33.80726698262243};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4953161592505855, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2c152b93-3e5b-4e07-b33d-5e7905370d11"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ed837bd4-32f6-4902-be0b-8718f8f12f2f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d97ed30a-cb14-42ef-abe4-8ddb1bae6f4a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/46461011-6796-4964-a5a8-00c147f727cd"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=639dccff-45f4-4393-85c4-92a227c0fbcf"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ed837bd4-32f6-4902-be0b-8718f8f12f2f"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6923076923076923, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d97ed30a-cb14-42ef-abe4-8ddb1bae6f4a"], "isController": false}, {"data": [0.2826086956521739, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.43478260869565216, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=674e2cfb-db74-41ee-9713-e02dad30d63a"], "isController": false}, {"data": [0.0, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3d2fa520-71bf-45df-8b2c-4d763cf179eb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1239a545-be50-4fa7-a03e-22cb61e017b6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.945054945054945, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/5c55fa56-e1bc-4bf8-829c-910da2d07afc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0af23fb2-a59f-456b-b640-19b4a682118c"], "isController": false}, {"data": [0.8478260869565217, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f91b9cc8-5e0e-43a1-8a79-7165e43c14c0"], "isController": false}, {"data": [0.043478260869565216, 500, 1500, "login"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2ff74ee8-a4e6-4373-bf11-611024312111"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9791666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6f6ea655-fef2-4536-9185-eada0c2dc870"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0af23fb2-a59f-456b-b640-19b4a682118c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6f6ea655-fef2-4536-9185-eada0c2dc870"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/674e2cfb-db74-41ee-9713-e02dad30d63a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2c152b93-3e5b-4e07-b33d-5e7905370d11"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/639dccff-45f4-4393-85c4-92a227c0fbcf"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/91c34238-71c6-4d06-8a73-0857c3d5d935"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0f2a5685-45a3-4cd8-940a-679c1881ce94"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f91b9cc8-5e0e-43a1-8a79-7165e43c14c0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/2ff74ee8-a4e6-4373-bf11-611024312111"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0dc9e905-5061-47f0-a064-e7e15c536bf1"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0f2a5685-45a3-4cd8-940a-679c1881ce94"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0dc9e905-5061-47f0-a064-e7e15c536bf1"], "isController": false}, {"data": [0.2826086956521739, 500, 1500, "register"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 633, 214, 33.80726698262243, 304.5750394944711, 138, 2098, 151.0, 637.4000000000001, 1034.3, 1584.4199999999987, 2.457450773339959, 2.589723309920259, 1.1697640381390149], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 62, 62, 100.0, 791.2903225806449, 566, 1213, 869.5, 1026.4, 1058.35, 1213.0, 0.2748178223790358, 1.7686202926366552, 0.4613396842476197], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 24, 24, 100.0, 181.58333333333334, 140, 431, 145.0, 427.5, 430.25, 431.0, 0.12336731074683485, 0.06132222770521381, 0.06192460715221984], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 183.29411764705884, 140, 449, 150.0, 437.0, 449.0, 449.0, 0.10205306759514948, 0.07923065306459358, 0.036276676371713286], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 15, 100.0, 143.93333333333334, 139, 149, 145.0, 149.0, 149.0, 149.0, 0.07306131792876035, 0.03631661213451076, 0.036673356850959786], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2c152b93-3e5b-4e07-b33d-5e7905370d11", 3, 0, 0.0, 618.0, 250, 1293, 311.0, 1293.0, 1293.0, 1293.0, 0.029988304561221122, 0.025000015618908626, 0.019230781245314327], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ed837bd4-32f6-4902-be0b-8718f8f12f2f", 1, 0, 0.0, 688.0, 688, 688, 688.0, 688.0, 688.0, 688.0, 1.4534883720930232, 0.26259311409883723, 1.0021121002906979], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d97ed30a-cb14-42ef-abe4-8ddb1bae6f4a", 3, 0, 0.0, 381.3333333333333, 299, 461, 384.0, 461.0, 461.0, 461.0, 0.04484573068643865, 0.028831483758371204, 0.028758492660248745], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/46461011-6796-4964-a5a8-00c147f727cd", 1, 0, 0.0, 234.0, 234, 234, 234.0, 234.0, 234.0, 234.0, 4.273504273504274, 1.3646834935897436, 2.549913194444444], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=639dccff-45f4-4393-85c4-92a227c0fbcf", 1, 0, 0.0, 554.0, 554, 554, 554.0, 554.0, 554.0, 554.0, 1.8050541516245489, 0.3261084160649819, 1.2445002256317688], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ed837bd4-32f6-4902-be0b-8718f8f12f2f", 3, 0, 0.0, 356.6666666666667, 255, 533, 282.0, 533.0, 533.0, 533.0, 0.020979461107575682, 0.024797012786981543, 0.013453625775365916], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 148.5, 147, 150, 148.5, 150.0, 150.0, 150.0, 0.3390405153415833, 0.09999046448550601, 0.2095826623156467], "isController": false}, {"data": ["https://demoqa.com/books", 62, 62, 100.0, 261.1451612903226, 139, 778, 147.5, 580.6, 596.05, 778.0, 0.2846203990194368, 0.14147635068446615, 0.13758505616662228], "isController": false}, {"data": ["deleteBook", 13, 2, 15.384615384615385, 488.0, 145, 1151, 456.0, 944.5999999999998, 1151.0, 1151.0, 0.09664852648169625, 0.019159815308383142, 0.06497929026526303], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, 15.384615384615385, 488.0, 145, 1151, 456.0, 944.5999999999998, 1151.0, 1151.0, 0.0969252333661388, 0.019214670286451345, 0.0651653274208941], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d97ed30a-cb14-42ef-abe4-8ddb1bae6f4a", 1, 0, 0.0, 452.0, 452, 452, 452.0, 452.0, 452.0, 452.0, 2.2123893805309733, 0.3996992533185841, 1.5253387721238938], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, 30.434782608695652, 965.913043478261, 301, 1697, 1035.0, 1582.2, 1676.9999999999998, 1697.0, 0.0984496323120254, 0.03086583241304329, 0.044417705203277084], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 148.5, 142, 154, 149.0, 154.0, 154.0, 154.0, 0.03950071101279823, 0.031091379957339235, 0.014041268367830623], "isController": false}, {"data": ["deleteAccount", 13, 2, 15.384615384615385, 574.3076923076922, 144, 1315, 461.0, 1306.2, 1315.0, 1315.0, 0.0981487633255821, 0.02250962848805605, 0.06552344198275602], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1153.4347826086955, 747, 2098, 1034.0, 1672.2, 2015.3999999999987, 2098.0, 0.09509672991288314, 0.04921998716194146, 0.04374078104391402], "isController": false}, {"data": ["goToProfile", 14, 3, 21.428571428571427, 238.1428571428572, 143, 335, 243.0, 323.0, 335.0, 335.0, 0.08370702541106127, 0.1685935164424514, 0.052591321001494766], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 6, 100.0, 192.16666666666666, 138, 446, 143.0, 446.0, 446.0, 446.0, 0.03634865631133836, 0.018067837951632054, 0.01824532162502726], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=674e2cfb-db74-41ee-9713-e02dad30d63a", 1, 0, 0.0, 543.0, 543, 543, 543.0, 543.0, 543.0, 543.0, 1.8416206261510129, 0.3327146639042357, 1.2697110957642725], "isController": false}, {"data": ["addBook", 60, 60, 100.0, 844.4333333333335, 582, 1936, 762.0, 1065.4, 1171.7999999999997, 1936.0, 0.2721310583176858, 0.8612877128291652, 0.5323076614530892], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/3d2fa520-71bf-45df-8b2c-4d763cf179eb", 1, 0, 0.0, 247.0, 247, 247, 247.0, 247.0, 247.0, 247.0, 4.048582995951417, 1.2928580465587045, 2.4157072368421053], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1239a545-be50-4fa7-a03e-22cb61e017b6", 1, 0, 0.0, 230.0, 230, 230, 230.0, 230.0, 230.0, 230.0, 4.3478260869565215, 1.3884171195652173, 2.594259510869565], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 204.46666666666667, 140, 456, 147.0, 438.6, 456.0, 456.0, 0.07301686202733751, 0.054548729932532423, 0.025955212673780134], "isController": false}, {"data": ["deleteBooks", 13, 2, 15.384615384615385, 556.3846153846154, 147, 1162, 543.0, 1041.6, 1162.0, 1162.0, 0.0967477859641289, 0.01917949272531071, 0.06564197737590236], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 7, 3.8461538461538463, 228.5494505494505, 139, 1515, 152.0, 430.70000000000005, 448.0, 994.5899999999922, 0.7646480518280131, 1.6850173227444982, 0.36496468360586176], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 197.24999999999997, 143, 430, 148.5, 429.1, 430.0, 430.0, 0.055805388010212384, 0.04321647723837737, 0.019837071519255185], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 10, 10, 100.0, 143.2, 138, 151, 143.5, 150.6, 151.0, 151.0, 0.04653651953370407, 0.02313192230728064, 0.023359151406566303], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5c55fa56-e1bc-4bf8-829c-910da2d07afc", 1, 0, 0.0, 1202.0, 1202, 1202, 1202.0, 1202.0, 1202.0, 1202.0, 0.831946755407654, 0.26567049708818635, 0.49640573003327787], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 21, 0, 0.0, 148.8095238095238, 140, 161, 149.0, 158.2, 160.8, 161.0, 0.13603326985114073, 0.11039418676396284, 0.04835557639239769], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0af23fb2-a59f-456b-b640-19b4a682118c", 1, 0, 0.0, 490.0, 490, 490, 490.0, 490.0, 490.0, 490.0, 2.0408163265306123, 0.3687021683673469, 1.407047193877551], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 465.8695652173913, 169, 1382, 349.0, 826.2, 1272.1999999999985, 1382.0, 0.09476876421531463, 0.058212453800227444, 0.04284954866376042], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f91b9cc8-5e0e-43a1-8a79-7165e43c14c0", 1, 0, 0.0, 579.0, 579, 579, 579.0, 579.0, 579.0, 579.0, 1.7271157167530224, 0.31202774179620035, 1.1907653281519863], "isController": false}, {"data": ["login", 23, 7, 30.434782608695652, 2020.7391304347825, 1363, 2852, 1971.0, 2716.2000000000003, 2849.8, 2852.0, 0.0984858865442587, 0.14824735265654973, 0.14754065620503906], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2ff74ee8-a4e6-4373-bf11-611024312111", 1, 0, 0.0, 861.0, 861, 861, 861.0, 861.0, 861.0, 861.0, 1.1614401858304297, 0.20983050232288036, 0.8007585656213705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 12, 100.0, 145.24999999999997, 139, 150, 145.5, 150.0, 150.0, 150.0, 0.05792679983394317, 0.028793692495583084, 0.02907653819789726], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 24, 0, 0.0, 224.04166666666663, 141, 503, 149.0, 449.0, 490.0, 503.0, 0.12248647545166888, 0.09916141420843115, 0.04354011432071042], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6f6ea655-fef2-4536-9185-eada0c2dc870", 1, 0, 0.0, 446.0, 446, 446, 446.0, 446.0, 446.0, 446.0, 2.242152466367713, 0.40507637331838564, 1.5458590246636772], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 17, 100.0, 161.76470588235293, 139, 436, 146.0, 208.79999999999978, 436.0, 436.0, 0.10734762951175772, 0.05335931974754363, 0.05388347809476901], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0af23fb2-a59f-456b-b640-19b4a682118c", 3, 0, 0.0, 607.0, 232, 1315, 274.0, 1315.0, 1315.0, 1315.0, 0.036726898780666956, 0.030617704354585967, 0.023552080272758437], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6f6ea655-fef2-4536-9185-eada0c2dc870", 3, 0, 0.0, 322.6666666666667, 236, 420, 312.0, 420.0, 420.0, 420.0, 0.01905040101094128, 0.026262515716580833, 0.012216565752459089], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/674e2cfb-db74-41ee-9713-e02dad30d63a", 3, 0, 0.0, 435.66666666666663, 215, 757, 335.0, 757.0, 757.0, 757.0, 0.025912106135986733, 0.025988020509432008, 0.016616812854132117], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 10, 0, 0.0, 145.8, 140, 153, 145.0, 152.7, 153.0, 153.0, 0.04749962000303998, 0.0393820091626767, 0.016884630547955616], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2c152b93-3e5b-4e07-b33d-5e7905370d11", 1, 0, 0.0, 1162.0, 1162, 1162, 1162.0, 1162.0, 1162.0, 1162.0, 0.8605851979345955, 0.15547681798623064, 0.5933331540447505], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/639dccff-45f4-4393-85c4-92a227c0fbcf", 3, 0, 0.0, 547.6666666666666, 225, 969, 449.0, 969.0, 969.0, 969.0, 0.020097136158097474, 0.02375413456707419, 0.012887811924300786], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 17, 100.0, 147.11764705882354, 140, 154, 147.0, 152.4, 154.0, 154.0, 0.08362355626389627, 0.04156678724445625, 0.04197510539027605], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/91c34238-71c6-4d06-8a73-0857c3d5d935", 1, 0, 0.0, 332.0, 332, 332, 332.0, 332.0, 332.0, 332.0, 3.0120481927710845, 0.9618552334337349, 1.7972279743975903], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0f2a5685-45a3-4cd8-940a-679c1881ce94", 1, 0, 0.0, 433.0, 433, 433, 433.0, 433.0, 433.0, 433.0, 2.3094688221709005, 0.417238019630485, 1.5922704965357968], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f91b9cc8-5e0e-43a1-8a79-7165e43c14c0", 3, 0, 0.0, 379.3333333333333, 248, 451, 439.0, 451.0, 451.0, 451.0, 0.03167062549485353, 0.02640249736078121, 0.020309613354447083], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 148.94117647058823, 144, 154, 148.0, 153.2, 154.0, 154.0, 0.07979122859717633, 0.061947291733159354, 0.028363288290402522], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2ff74ee8-a4e6-4373-bf11-611024312111", 3, 0, 0.0, 850.3333333333334, 247, 1717, 587.0, 1717.0, 1717.0, 1717.0, 0.032758601862872494, 0.027309498493104316, 0.021007306533157168], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0dc9e905-5061-47f0-a064-e7e15c536bf1", 3, 0, 0.0, 366.0, 239, 500, 359.0, 500.0, 500.0, 500.0, 0.017615661497448663, 0.024284611471905956, 0.011296501676423785], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 21, 21, 100.0, 186.19047619047618, 139, 439, 145.0, 431.0, 438.7, 439.0, 0.13151632054911194, 0.06537285855419725, 0.06601502808812847], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 12, 100.0, 193.25000000000003, 143, 433, 145.5, 432.4, 433.0, 433.0, 0.09742473938882214, 0.04842694565323288, 0.05526126575033287], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0f2a5685-45a3-4cd8-940a-679c1881ce94", 3, 0, 0.0, 291.6666666666667, 219, 422, 234.0, 422.0, 422.0, 422.0, 0.06271558482282846, 0.03974845170899968, 0.04021800198599352], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0dc9e905-5061-47f0-a064-e7e15c536bf1", 1, 0, 0.0, 728.0, 728, 728, 728.0, 728.0, 728.0, 728.0, 1.3736263736263736, 0.24816492101648352, 0.9470509958791209], "isController": false}, {"data": ["register", 23, 7, 30.434782608695652, 965.913043478261, 301, 1697, 1035.0, 1582.2, 1676.9999999999998, 1697.0, 0.09892685864212133, 0.031015451945203124, 0.04463301630142583], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 3.2710280373831777, 1.1058451816745656], "isController": false}, {"data": ["401/Unauthorized", 11, 5.140186915887851, 1.7377567140600316], "isController": false}, {"data": ["404/Not Found", 196, 91.58878504672897, 30.963665086887836], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 633, 214, "404/Not Found", 196, "401/Unauthorized", 11, "406/Not Acceptable", 7, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 24, 24, "404/Not Found", 24, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 15, "404/Not Found", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/books", 62, 62, "404/Not Found", 62, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 6, "404/Not Found", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 182, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 10, 10, "404/Not Found", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 12, "404/Not Found", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 17, "404/Not Found", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 17, "404/Not Found", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 21, 21, "404/Not Found", 21, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 12, "404/Not Found", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
