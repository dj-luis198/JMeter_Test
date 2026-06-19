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

    var data = {"OkPercent": 97.18202589489718, "KoPercent": 2.817974105102818};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7154498044328553, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3cc9e344-2c30-467f-814e-ed652db0b544"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d544bd25-04f0-483d-8944-71123aea5665"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=043cb3e4-2141-4a7a-8652-0c833d97403e"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=18be4fb7-fdc4-4888-bda7-d751b6d05ba6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=30c39e54-7c60-4e1a-8f3d-21e8a4342c42"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.1, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/8b983ad2-e64d-4b20-815f-4eb40ea3c69e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/18be4fb7-fdc4-4888-bda7-d751b6d05ba6"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c72bc60a-d901-4427-8e74-e782a28ebd5c"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ee7eafdc-41c6-4d9a-8714-e0a6bc33997c"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=646f7486-7e46-4230-8274-aaecbfec8892"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=147d0ff9-1240-4dca-85e2-64d9d6fe5246"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0625, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3cc9e344-2c30-467f-814e-ed652db0b544"], "isController": false}, {"data": [0.22, 500, 1500, "register"], "isController": true}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d544bd25-04f0-483d-8944-71123aea5665"], "isController": false}, {"data": [0.7941176470588235, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f358d601-c49b-4cdd-aef0-d63991458776"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.22727272727272727, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.22, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a7d45965-2704-4aba-b1e7-ba6de2aa0cc1"], "isController": false}, {"data": [0.24561403508771928, 500, 1500, "addBook"], "isController": true}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9818181818181818, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/30c39e54-7c60-4e1a-8f3d-21e8a4342c42"], "isController": false}, {"data": [0.2909090909090909, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8964497041420119, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5c9a461b-fe77-4a91-ae94-afbd706f0e68"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5c9a461b-fe77-4a91-ae94-afbd706f0e68"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/646f7486-7e46-4230-8274-aaecbfec8892"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8b983ad2-e64d-4b20-815f-4eb40ea3c69e"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/043cb3e4-2141-4a7a-8652-0c833d97403e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/147d0ff9-1240-4dca-85e2-64d9d6fe5246"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/13c82ca7-1237-4723-b2e0-6bc54de11cb8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f358d601-c49b-4cdd-aef0-d63991458776"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c72bc60a-d901-4427-8e74-e782a28ebd5c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ee7eafdc-41c6-4d9a-8714-e0a6bc33997c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1313, 37, 2.817974105102818, 489.8027418126422, 140, 2790, 152.0, 1416.6000000000001, 1712.6, 2278.879999999999, 5.252966545844435, 750.04334391278, 3.8471531886867183], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 2369.0181818181813, 1728, 3178, 2299.0, 2860.4, 2978.999999999999, 3178.0, 0.23625429553264604, 284.2939553801546, 1.1616605253973367], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/3cc9e344-2c30-467f-814e-ed652db0b544", 3, 0, 0.0, 431.3333333333333, 353, 552, 389.0, 552.0, 552.0, 552.0, 0.08565065951007823, 0.038754692942385656, 0.0549257158967624], "isController": false}, {"data": ["deleteBook", 15, 3, 20.0, 612.8666666666666, 145, 1762, 502.0, 1547.2, 1762.0, 1762.0, 0.09036253448836733, 0.018390187682984133, 0.06055348746671647], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, 20.0, 612.8666666666666, 145, 1762, 502.0, 1547.2, 1762.0, 1762.0, 0.08840742858153228, 0.017992293082413405, 0.05924333739516352], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d544bd25-04f0-483d-8944-71123aea5665", 1, 0, 0.0, 437.0, 437, 437, 437.0, 437.0, 437.0, 437.0, 2.288329519450801, 0.41341890732265446, 1.577695938215103], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 144.26666666666668, 141, 148, 144.0, 147.4, 148.0, 148.0, 0.08755902937897299, 0.03219618476122653, 0.049445769585495555], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 164.06666666666666, 143, 425, 146.0, 259.4000000000001, 425.0, 425.0, 0.08755647392568207, 0.0650688248607852, 0.04394924570097713], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 295.66666666666663, 142, 1283, 146.0, 771.8000000000003, 1283.0, 1283.0, 0.08755851827638138, 1.7383672123994538, 0.05105870105478828], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 284.53333333333336, 141, 1552, 145.0, 960.4000000000003, 1552.0, 1552.0, 0.08755902937897299, 5.27441113816523, 0.0509734922335141], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=043cb3e4-2141-4a7a-8652-0c833d97403e", 1, 0, 0.0, 675.0, 675, 675, 675.0, 675.0, 675.0, 675.0, 1.4814814814814814, 0.26765046296296297, 1.021412037037037], "isController": false}, {"data": ["goToProfile", 15, 3, 20.0, 314.4, 140, 905, 267.0, 618.2000000000002, 905.0, 905.0, 0.09039085003555374, 0.15746603940438456, 0.058418617728056114], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=18be4fb7-fdc4-4888-bda7-d751b6d05ba6", 1, 0, 0.0, 470.0, 470, 470, 470.0, 470.0, 470.0, 470.0, 2.127659574468085, 0.38439162234042556, 1.4669215425531916], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=30c39e54-7c60-4e1a-8f3d-21e8a4342c42", 1, 0, 0.0, 411.0, 411, 411, 411.0, 411.0, 411.0, 411.0, 2.4330900243309004, 0.43957192822384433, 1.6775015206812653], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 14, 0, 0.0, 144.85714285714286, 142, 148, 144.0, 147.5, 148.0, 148.0, 0.06776838701557705, 0.050363029803568486, 0.034016553638678323], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 14, 0, 0.0, 143.85714285714286, 141, 152, 143.5, 148.5, 152.0, 152.0, 0.06776937114864244, 0.018133601264382838, 0.03864971948321014], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 10, 0, 0.0, 1049.3999999999999, 709, 1279, 1130.5, 1266.9, 1279.0, 1279.0, 0.0655209241071136, 19.265327186924644, 0.03736740202983823], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 10, 0, 0.0, 1514.8000000000002, 988, 1732, 1548.0, 1729.2, 1732.0, 1732.0, 0.06535349706562799, 58.80519153884612, 0.037208094520762805], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 10, 0, 0.0, 257.20000000000005, 141, 439, 144.0, 438.2, 439.0, 439.0, 0.06595479458379226, 0.11670907010335116, 0.03651989114161154], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 18, 0, 0.0, 162.61111111111111, 142, 433, 145.0, 205.30000000000035, 433.0, 433.0, 0.09675910745098883, 0.07190789137715088, 0.048568536357234626], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 18, 0, 0.0, 191.44444444444446, 141, 432, 144.0, 428.4, 432.0, 432.0, 0.09676066786363197, 0.025891038080698394, 0.0551838183909776], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 18, 0, 0.0, 160.16666666666669, 140, 419, 143.5, 186.80000000000035, 419.0, 419.0, 0.0967596275829445, 0.026079743371965513, 0.056884077934504486], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 18, 0, 0.0, 160.88888888888889, 141, 426, 145.0, 189.30000000000038, 426.0, 426.0, 0.09675910745098883, 0.026079603180149333, 0.056978263469674086], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 10, 0, 0.0, 200.0, 141, 430, 143.5, 429.6, 430.0, 430.0, 0.06595522959015421, 0.04901555636533921, 0.03703540724056511], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 1229.6666666666667, 141, 2580, 1556.0, 2128.2000000000003, 2580.0, 2580.0, 0.1372482638094628, 82.34315025368055, 0.0728237858103595], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 14, 0, 0.0, 225.35714285714286, 142, 432, 145.5, 431.0, 432.0, 432.0, 0.06776937114864244, 0.01826596331740753, 0.03984097796043237], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 768.1333333333334, 142, 1289, 1120.0, 1199.6000000000001, 1289.0, 1289.0, 0.13724324077039207, 26.915043574728944, 0.07295514719337573], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 14, 0, 0.0, 204.7142857142857, 141, 429, 145.0, 427.0, 429.0, 429.0, 0.06767666025349743, 0.018240974833950478, 0.039852564582870065], "isController": false}, {"data": ["deleteBooks", 15, 3, 20.0, 489.8666666666667, 144, 1207, 463.0, 947.8000000000002, 1207.0, 1207.0, 0.08881467929019309, 0.018075174964918204, 0.0599672551379292], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 18, 0, 0.0, 371.3333333333333, 285, 861, 291.0, 608.1000000000004, 861.0, 861.0, 0.09668374746205163, 0.14984092502175383, 0.21744401406748526], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 614.7083333333333, 154, 1815, 510.0, 1523.0, 1786.75, 1815.0, 0.10167165140179789, 0.062452606183330935, 0.0459706783193676], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 146.26666666666668, 142, 156, 145.0, 153.6, 156.0, 156.0, 0.13722817385894773, 0.1019830471744719, 0.06888211070654213], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 201.2, 141, 430, 145.0, 428.8, 430.0, 430.0, 0.13723947373236473, 0.17414045202107997, 0.07058540641182821], "isController": false}, {"data": ["login", 24, 0, 0.0, 3303.2916666666665, 1553, 5923, 3059.0, 5707.0, 5912.0, 5923.0, 0.10191299178326503, 50.93573675927302, 0.2241787246013716], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/8b983ad2-e64d-4b20-815f-4eb40ea3c69e", 3, 0, 0.0, 662.0, 333, 905, 748.0, 905.0, 905.0, 905.0, 0.0315746266300401, 0.031872694394451284, 0.020248051582415036], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 14, 0, 0.0, 148.64285714285717, 146, 155, 148.0, 154.0, 155.0, 155.0, 0.06998180473077, 0.05665519152520345, 0.0248763446503909], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/18be4fb7-fdc4-4888-bda7-d751b6d05ba6", 3, 0, 0.0, 351.3333333333333, 230, 490, 334.0, 490.0, 490.0, 490.0, 0.05371723248818221, 0.03453500461072912, 0.03444757421930956], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c72bc60a-d901-4427-8e74-e782a28ebd5c", 3, 0, 0.0, 472.3333333333333, 404, 546, 467.0, 546.0, 546.0, 546.0, 0.04356665698518734, 0.028009162612547198, 0.02793825334011037], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 1377.7333333333331, 289, 2727, 1704.0, 2273.4, 2727.0, 2727.0, 0.13704262025489927, 109.37120813062445, 0.28483630544516014], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ee7eafdc-41c6-4d9a-8714-e0a6bc33997c", 1, 0, 0.0, 775.0, 775, 775, 775.0, 775.0, 775.0, 775.0, 1.2903225806451613, 0.2331149193548387, 0.889616935483871], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=646f7486-7e46-4230-8274-aaecbfec8892", 1, 0, 0.0, 658.0, 658, 658, 658.0, 658.0, 658.0, 658.0, 1.5197568389057752, 0.2745654445288754, 1.0478011018237081], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=147d0ff9-1240-4dca-85e2-64d9d6fe5246", 1, 0, 0.0, 1207.0, 1207, 1207, 1207.0, 1207.0, 1207.0, 1207.0, 0.828500414250207, 0.1496802506213753, 0.5712121996685998], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 507.0666666666667, 286, 1697, 295.0, 1188.2000000000003, 1697.0, 1697.0, 0.0874834510471769, 7.103918219740931, 0.1952601010579665], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 16, 6, 37.5, 1125.6874999999998, 140, 2131, 1561.0, 2018.3000000000002, 2131.0, 2131.0, 0.10446728215307069, 78.12247503395187, 0.17318334048825398], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3cc9e344-2c30-467f-814e-ed652db0b544", 1, 0, 0.0, 239.0, 239, 239, 239.0, 239.0, 239.0, 239.0, 4.184100418410042, 0.755916579497908, 2.884741108786611], "isController": false}, {"data": ["register", 25, 10, 40.0, 1038.2, 256, 2111, 977.0, 1806.000000000001, 2098.7, 2111.0, 0.1022340177560042, 0.031708519569635676, 0.046125113479759706], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 14, 0, 0.0, 412.5, 291, 577, 295.0, 576.0, 577.0, 577.0, 0.06762892972388074, 0.10481163229667845, 0.15209904800204818], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 11, 0, 0.0, 149.00000000000003, 144, 158, 147.0, 157.8, 158.0, 158.0, 0.13534463666117086, 0.10507713490784261, 0.048110788813150576], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d544bd25-04f0-483d-8944-71123aea5665", 3, 0, 0.0, 461.0, 235, 820, 328.0, 820.0, 820.0, 820.0, 0.01902889220132568, 0.026232864086137453, 0.012202772668167834], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 542.1764705882352, 287, 2116, 292.0, 1894.3999999999999, 2116.0, 2116.0, 0.08261490761709449, 11.740756280251635, 0.18331606367908482], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f358d601-c49b-4cdd-aef0-d63991458776", 3, 0, 0.0, 449.33333333333337, 243, 760, 345.0, 760.0, 760.0, 760.0, 0.02140258257829778, 0.02146528545694514, 0.013724963437254763], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 14, 0, 0.0, 165.1428571428571, 142, 430, 144.0, 293.5, 430.0, 430.0, 0.06923735058332467, 0.05145471073624031, 0.03475390449202039], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 14, 0, 0.0, 165.07142857142856, 141, 433, 145.0, 292.0, 433.0, 433.0, 0.0692380354202007, 0.01852658369642089, 0.03948731707558321], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 14, 0, 0.0, 183.07142857142858, 140, 425, 142.5, 423.5, 425.0, 425.0, 0.06923837784371908, 0.01866190652818991, 0.04070459322453017], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 14, 0, 0.0, 144.71428571428572, 141, 162, 143.5, 154.0, 162.0, 162.0, 0.06923837784371908, 0.01866190652818991, 0.040772208827893175], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 154.33333333333334, 144, 161, 158.0, 161.0, 161.0, 161.0, 0.0321515840013718, 0.009482205437904574, 0.019874953782097998], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1680.7272727272725, 1138, 2594, 1561.0, 2275.2, 2389.5999999999995, 2594.0, 0.24985917028583887, 298.918432764033, 0.49337426007613894], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 10, 40.0, 1038.2, 256, 2111, 977.0, 1806.000000000001, 2098.7, 2111.0, 0.10162064606341942, 0.03151827850560743, 0.04584837742314431], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 179.125, 141, 429, 144.0, 429.0, 429.0, 429.0, 0.05134821147760897, 0.013839947624824293, 0.030237276875974814], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 214.875, 142, 429, 144.0, 429.0, 429.0, 429.0, 0.05134821147760897, 0.013839947624824293, 0.03018713213820371], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 11, 0, 0.0, 169.8181818181818, 142, 432, 144.0, 374.8000000000002, 432.0, 432.0, 0.14059304703476483, 0.03789421970858896, 0.0826533342919223], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 11, 0, 0.0, 194.18181818181822, 141, 427, 143.0, 426.0, 427.0, 427.0, 0.14058765640376775, 0.03789276676507803, 0.08278745782370309], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 179.0, 141, 429, 143.0, 429.0, 429.0, 429.0, 0.051348870645776236, 0.013739834528264345, 0.029284902790169258], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 11, 0, 0.0, 144.3636363636364, 142, 147, 144.0, 147.0, 147.0, 147.0, 0.14059484400362993, 0.10448503543629135, 0.07057202130650954], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 214.625, 143, 431, 145.0, 431.0, 431.0, 431.0, 0.051347881899871634, 0.03815990051347882, 0.0257742297817715], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 11, 0, 0.0, 169.72727272727275, 140, 432, 143.0, 375.0000000000002, 432.0, 432.0, 0.14058765640376775, 0.03761818149866442, 0.0801788977927738], "isController": false}, {"data": ["deleteAccount", 15, 3, 20.0, 708.6666666666666, 142, 2678, 546.0, 1922.0000000000005, 2678.0, 2678.0, 0.08846947803007962, 0.017521103656738424, 0.06020071512828074], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 183.25, 144, 434, 147.0, 434.0, 434.0, 434.0, 0.050276836832810666, 0.03957336961645058, 0.017871844342913164], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1672.625, 733, 2790, 1514.5, 2681.5, 2782.5, 2790.0, 0.10014521055530519, 0.05183297030694507, 0.046062884933153074], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 431.125, 287, 861, 290.5, 861.0, 861.0, 861.0, 0.05130013786912053, 0.07950519413895925, 0.11537521241463337], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a7d45965-2704-4aba-b1e7-ba6de2aa0cc1", 1, 0, 0.0, 335.0, 335, 335, 335.0, 335.0, 335.0, 335.0, 2.985074626865672, 0.9532416044776119, 1.781133395522388], "isController": false}, {"data": ["addBook", 57, 15, 26.31578947368421, 1378.5614035087722, 722, 3480, 1095.0, 2507.0000000000005, 3294.2999999999997, 3480.0, 0.27663188546469303, 76.61286607467848, 1.0060987169376365], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 272.2545454545454, 142, 627, 147.0, 573.6, 591.4, 627.0, 0.2518130539887187, 0.18713841219278807, 0.1217260368402498], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 914.0181818181816, 701, 1302, 856.0, 1194.3999999999999, 1289.3999999999999, 1302.0, 0.25103380284261545, 73.81227314246397, 0.12625235201557322], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 248.60000000000002, 140, 581, 147.0, 433.4, 465.7999999999994, 581.0, 0.2523549303270978, 0.4465499353053724, 0.12272730010048315], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/30c39e54-7c60-4e1a-8f3d-21e8a4342c42", 3, 0, 0.0, 479.33333333333337, 243, 768, 427.0, 768.0, 768.0, 768.0, 0.0675934479417795, 0.029924182682558635, 0.043346058738706256], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1406.8363636363638, 993, 1984, 1401.0, 1721.6, 1860.3999999999996, 1984.0, 0.25055349544903743, 225.44847563111009, 0.1257661100203176], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 164.76470588235293, 143, 439, 147.0, 212.5999999999998, 439.0, 439.0, 0.08373394278508946, 0.0625551428033139, 0.029764799974387263], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 15, 8.875739644970414, 209.34911242603536, 143, 2452, 148.0, 323.0, 409.0, 1586.800000000014, 0.7482511290179757, 1.6655782343044363, 0.3575699202492694], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 14, 0, 0.0, 213.92857142857144, 143, 466, 147.0, 450.0, 466.0, 466.0, 0.06962472274440763, 0.05391836439093287, 0.024749413163051154], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5c9a461b-fe77-4a91-ae94-afbd706f0e68", 1, 0, 0.0, 499.0, 499, 499, 499.0, 499.0, 499.0, 499.0, 2.004008016032064, 0.36205222945891785, 1.3816695891783568], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5c9a461b-fe77-4a91-ae94-afbd706f0e68", 3, 0, 0.0, 367.0, 267, 469, 365.0, 469.0, 469.0, 469.0, 0.030462419528441746, 0.025395265759225037, 0.01953481981478849], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 147.33333333333334, 143, 158, 146.0, 153.8, 158.0, 158.0, 0.08754880846071686, 0.07104790999107002, 0.031120865507520443], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/646f7486-7e46-4230-8274-aaecbfec8892", 3, 0, 0.0, 766.6666666666666, 268, 1581, 451.0, 1581.0, 1581.0, 1581.0, 0.04794706643865173, 0.030825343820422253, 0.030747304975307258], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 14, 0, 0.0, 352.0, 285, 864, 289.0, 715.0, 864.0, 864.0, 0.0691877359795995, 0.1072274775386957, 0.1556048398056813], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8b983ad2-e64d-4b20-815f-4eb40ea3c69e", 1, 0, 0.0, 461.0, 461, 461, 461.0, 461.0, 461.0, 461.0, 2.1691973969631237, 0.3918960140997831, 1.495559924078091], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 11, 0, 0.0, 341.54545454545456, 286, 579, 289.0, 578.8, 579.0, 579.0, 0.1403329718696179, 0.21748869761433948, 0.31561214278879884], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/043cb3e4-2141-4a7a-8652-0c833d97403e", 3, 0, 0.0, 1101.6666666666665, 251, 2678, 376.0, 2678.0, 2678.0, 2678.0, 0.020105217303890362, 0.02376368620782093, 0.012892994169486981], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/147d0ff9-1240-4dca-85e2-64d9d6fe5246", 3, 0, 0.0, 1161.0, 245, 1820, 1418.0, 1820.0, 1820.0, 1820.0, 0.018732555307869544, 0.02582433975547771, 0.012012738918132489], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 18, 0, 0.0, 181.27777777777777, 143, 433, 151.0, 430.3, 433.0, 433.0, 0.09990453566591924, 0.08283100662145061, 0.035512940412494726], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/13c82ca7-1237-4723-b2e0-6bc54de11cb8", 1, 0, 0.0, 260.0, 260, 260, 260.0, 260.0, 260.0, 260.0, 3.8461538461538463, 1.2282151442307692, 2.294921875], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 167.8, 143, 456, 146.0, 275.4000000000001, 456.0, 456.0, 0.1336481489731367, 0.10376003753285518, 0.0475077404552947], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f358d601-c49b-4cdd-aef0-d63991458776", 1, 0, 0.0, 590.0, 590, 590, 590.0, 590.0, 590.0, 590.0, 1.694915254237288, 0.3062102754237288, 1.168564618644068], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c72bc60a-d901-4427-8e74-e782a28ebd5c", 1, 0, 0.0, 463.0, 463, 463, 463.0, 463.0, 463.0, 463.0, 2.1598272138228944, 0.3902031587473002, 1.4890996220302375], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ee7eafdc-41c6-4d9a-8714-e0a6bc33997c", 3, 0, 0.0, 338.0, 246, 495, 273.0, 495.0, 495.0, 495.0, 0.03381539051140142, 0.028190499706933284, 0.021684999774564062], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 161.05882352941174, 142, 435, 143.0, 205.3999999999998, 435.0, 435.0, 0.08267316380471626, 0.0614397242728409, 0.04149805292541422], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 159.23529411764707, 141, 424, 143.0, 201.5999999999998, 424.0, 424.0, 0.08267356585678994, 0.03673008722061198, 0.046332910644464764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 378.2941176470589, 142, 1694, 146.0, 1683.6, 1694.0, 1694.0, 0.08267316380471626, 8.77136242638441, 0.04776692793817993], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 296.3529411764706, 140, 1138, 144.0, 1123.6, 1138.0, 1138.0, 0.08267356585678994, 2.8795172593226606, 0.047847896140117106], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 10, 27.027027027027028, 0.7616146230007617], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 8.108108108108109, 0.2284843869002285], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 8.108108108108109, 0.2284843869002285], "isController": false}, {"data": ["401/Unauthorized", 21, 56.75675675675676, 1.5993907083015995], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1313, 37, "401/Unauthorized", 21, "406/Not Acceptable", 10, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 16, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 10, "406/Not Acceptable", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 169, 15, "401/Unauthorized", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
