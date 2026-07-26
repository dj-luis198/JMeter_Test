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

    var data = {"OkPercent": 98.1089258698941, "KoPercent": 1.8910741301059002};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8125814863102999, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0d4aaddf-20a7-48a2-b25e-2d99ad9dfb40"], "isController": false}, {"data": [0.39285714285714285, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/57644505-608a-48f5-bd17-5a79fe29300e"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d1c273af-e3d7-4a65-ab32-91feefd1a1d2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=50112d7c-2397-47f1-b36a-3cf1fe464e66"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2d2dac07-dc60-4dba-bb7d-76c0681fbe83"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1b67015c-827e-416e-99db-ba5295fdfcb1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f370ca6f-329e-4f50-bc1c-145054447314"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b70856b5-1539-4fca-8eaa-f842da10751a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7647058823529411, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.65, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b39b1505-fe14-4c4c-a241-d40fabe15876"], "isController": false}, {"data": [0.025, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2d2dac07-dc60-4dba-bb7d-76c0681fbe83"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f34dca37-e3ca-4071-94c6-c929a1ab4f5a"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2777777777777778, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fd6dd30b-9ce6-4bb9-ab4b-c74d85c866a4"], "isController": false}, {"data": [0.22727272727272727, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f370ca6f-329e-4f50-bc1c-145054447314"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.22727272727272727, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.275, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/78203d61-7d1f-48bb-9e66-10ba5924ab19"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0291fedd-d18f-47f1-9b11-2dfaeb75cd39"], "isController": false}, {"data": [0.4032258064516129, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0d4aaddf-20a7-48a2-b25e-2d99ad9dfb40"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1b67015c-827e-416e-99db-ba5295fdfcb1"], "isController": false}, {"data": [0.8035714285714286, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b70856b5-1539-4fca-8eaa-f842da10751a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3d6a04cc-f99a-4f41-bf3a-22c6d19c2439"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9361111111111111, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=57644505-608a-48f5-bd17-5a79fe29300e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3d6a04cc-f99a-4f41-bf3a-22c6d19c2439"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=78203d61-7d1f-48bb-9e66-10ba5924ab19"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b39b1505-fe14-4c4c-a241-d40fabe15876"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/50112d7c-2397-47f1-b36a-3cf1fe464e66"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cdbf1a2f-beab-4a2b-a522-2a899e19b79f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fd6dd30b-9ce6-4bb9-ab4b-c74d85c866a4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1322, 25, 1.8910741301059002, 302.2367624810895, 77, 2018, 97.0, 837.400000000001, 1019.0, 1569.6499999999992, 5.117049606738094, 707.1781887272501, 3.745453907120905], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/0d4aaddf-20a7-48a2-b25e-2d99ad9dfb40", 3, 0, 0.0, 308.66666666666663, 171, 573, 182.0, 573.0, 573.0, 573.0, 0.03574747980267391, 0.029801203051643195, 0.02292400234741784], "isController": false}, {"data": ["see books", 56, 0, 0.0, 1350.5714285714284, 1017, 1702, 1351.5, 1584.5, 1644.55, 1702.0, 0.24934435791601547, 300.04425705817073, 1.226024259870252], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/57644505-608a-48f5-bd17-5a79fe29300e", 3, 0, 0.0, 556.3333333333333, 179, 1086, 404.0, 1086.0, 1086.0, 1086.0, 0.03105847275136657, 0.03135166796939705, 0.01991705446620838], "isController": false}, {"data": ["deleteBook", 13, 2, 15.384615384615385, 594.0, 90, 1238, 496.0, 1155.1999999999998, 1238.0, 1238.0, 0.08640744433366568, 0.017129600780990364, 0.05809394732469259], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, 15.384615384615385, 594.0, 90, 1238, 496.0, 1155.1999999999998, 1238.0, 1238.0, 0.08311807882151351, 0.01647750976637426, 0.055882422284596306], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 13, 0, 0.0, 128.3846153846154, 77, 243, 80.0, 241.4, 243.0, 243.0, 0.08944297666226332, 0.04460054680619771, 0.04985478416721709], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 13, 0, 0.0, 94.3846153846154, 80, 240, 82.0, 180.39999999999995, 240.0, 240.0, 0.08944236127833774, 0.06647034856720217, 0.04489587275104063], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d1c273af-e3d7-4a65-ab32-91feefd1a1d2", 1, 0, 0.0, 272.0, 272, 272, 272.0, 272.0, 272.0, 272.0, 3.676470588235294, 1.174029181985294, 2.193675321691176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 13, 0, 0.0, 211.53846153846155, 79, 621, 82.0, 621.0, 621.0, 621.0, 0.08944359205465692, 4.0664583089656885, 0.051487849002015924], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 13, 0, 0.0, 240.53846153846152, 79, 850, 80.0, 818.8, 850.0, 850.0, 0.08944359205465692, 12.402168383582286, 0.05140050174415005], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=50112d7c-2397-47f1-b36a-3cf1fe464e66", 1, 0, 0.0, 526.0, 526, 526, 526.0, 526.0, 526.0, 526.0, 1.9011406844106464, 0.34346779942965777, 1.3107473859315588], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2d2dac07-dc60-4dba-bb7d-76c0681fbe83", 3, 0, 0.0, 592.0, 194, 1149, 433.0, 1149.0, 1149.0, 1149.0, 0.022243642025654334, 0.02629123183435901, 0.014264314710461926], "isController": false}, {"data": ["goToProfile", 13, 2, 15.384615384615385, 225.84615384615384, 80, 429, 183.0, 419.0, 429.0, 429.0, 0.08658816006820483, 0.18459175139540152, 0.05596488350562157], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1b67015c-827e-416e-99db-ba5295fdfcb1", 1, 0, 0.0, 594.0, 594, 594, 594.0, 594.0, 594.0, 594.0, 1.6835016835016834, 0.3041482533670034, 1.1606954966329968], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f370ca6f-329e-4f50-bc1c-145054447314", 3, 0, 0.0, 814.0, 189, 1833, 420.0, 1833.0, 1833.0, 1833.0, 0.02807411566535654, 0.028156364051094892, 0.018003257767172], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 90.11111111111114, 79, 239, 81.0, 100.40000000000022, 239.0, 239.0, 0.08995906862377619, 0.06685434689716178, 0.0451552356177939], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 97.55555555555556, 78, 244, 80.0, 235.0, 244.0, 244.0, 0.0899604174163368, 0.024071439816480748, 0.05130555055775459], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 610.8, 461, 724, 623.0, 724.0, 724.0, 724.0, 0.05353319057815845, 15.740535499197001, 0.030530647751605994], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b70856b5-1539-4fca-8eaa-f842da10751a", 1, 0, 0.0, 446.0, 446, 446, 446.0, 446.0, 446.0, 446.0, 2.242152466367713, 0.40507637331838564, 1.5458590246636772], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 784.2, 691, 929, 742.0, 929.0, 929.0, 929.0, 0.05340282821378221, 48.051958698920195, 0.03040414926624514], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 141.4, 78, 238, 80.0, 238.0, 238.0, 238.0, 0.053846816576204014, 0.09528362464461101, 0.029815571287800467], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 101.75000000000001, 79, 244, 81.5, 240.5, 244.0, 244.0, 0.0815656527036465, 0.060616661823706036, 0.04094213426726006], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 109.93750000000001, 78, 240, 81.0, 239.3, 240.0, 240.0, 0.08156897931716568, 0.037140172467410644, 0.045663493548403544], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 210.3125, 78, 855, 81.0, 791.3000000000001, 855.0, 855.0, 0.08156897931716568, 9.19372608690665, 0.04707740896137199], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 168.74999999999997, 78, 638, 80.5, 628.9, 638.0, 638.0, 0.08156856347563649, 3.017220366395791, 0.047156825759352344], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 80.6, 79, 83, 80.0, 83.0, 83.0, 83.0, 0.05384565680932176, 0.04001615706239635, 0.030235598306015635], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 541.8235294117646, 80, 952, 779.0, 945.6, 952.0, 952.0, 0.07892293407613742, 41.78228550081244, 0.04240838266016713], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 110.88888888888887, 78, 318, 81.0, 243.30000000000013, 318.0, 318.0, 0.0899604174163368, 0.024247143756747032, 0.05288688602015113], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 392.88235294117646, 79, 635, 464.0, 633.4, 635.0, 635.0, 0.0789236668864149, 13.65945250188024, 0.04248585032126575], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 97.61111111111111, 78, 236, 81.0, 234.2, 236.0, 236.0, 0.08996131663384745, 0.024247386123966694, 0.05297526750997071], "isController": false}, {"data": ["deleteBooks", 13, 2, 15.384615384615385, 538.1538461538463, 81, 1535, 456.0, 1308.9999999999998, 1535.0, 1535.0, 0.08329702437399082, 0.016512984324140757, 0.05651582963836276], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 313.875, 160, 936, 167.5, 871.6, 936.0, 936.0, 0.08153240148592802, 12.30320156402077, 0.1807606781967071], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 699.8999999999999, 137, 1525, 731.0, 1182.0, 1507.8999999999996, 1525.0, 0.08560031500915924, 0.052580662246837065, 0.03870404868089915], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 81.88235294117646, 80, 87, 81.0, 86.2, 87.0, 87.0, 0.07892293407613742, 0.05865268831244197, 0.03961561339368616], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 150.00000000000003, 78, 320, 82.0, 255.19999999999993, 320.0, 320.0, 0.07892330047957512, 0.09084702981443739, 0.04111193064963161], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b39b1505-fe14-4c4c-a241-d40fabe15876", 1, 0, 0.0, 398.0, 398, 398, 398.0, 398.0, 398.0, 398.0, 2.512562814070352, 0.4539298052763819, 1.7322942839195978], "isController": false}, {"data": ["login", 20, 0, 0.0, 2724.7999999999997, 1497, 3980, 2572.5, 3866.1, 3974.5499999999997, 3980.0, 0.0852464047328804, 25.612985751329845, 0.16395780675918742], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 88.66666666666667, 81, 111, 83.5, 109.2, 111.0, 111.0, 0.0912441134874007, 0.07386852546978045, 0.03243443096622447], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2d2dac07-dc60-4dba-bb7d-76c0681fbe83", 1, 0, 0.0, 512.0, 512, 512, 512.0, 512.0, 512.0, 512.0, 1.953125, 0.3528594970703125, 1.346588134765625], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f34dca37-e3ca-4071-94c6-c929a1ab4f5a", 1, 0, 0.0, 266.0, 266, 266, 266.0, 266.0, 266.0, 266.0, 3.7593984962406015, 1.2005110432330826, 2.2431567199248117], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 624.8823529411766, 160, 1038, 860.0, 1029.2, 1038.0, 1038.0, 0.07889253444587276, 55.56969781983962, 0.16555739750931628], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 13, 0, 0.0, 384.84615384615387, 164, 931, 319.0, 904.1999999999999, 931.0, 931.0, 0.08939254328662, 16.57023616177644, 0.19752716802703782], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, 44.44444444444444, 518.0, 79, 1011, 772.0, 1011.0, 1011.0, 1011.0, 0.08741004049998544, 58.10639349814983, 0.13524086018764023], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fd6dd30b-9ce6-4bb9-ab4b-c74d85c866a4", 1, 0, 0.0, 414.0, 414, 414, 414.0, 414.0, 414.0, 414.0, 2.4154589371980677, 0.4363866243961353, 1.6653457125603865], "isController": false}, {"data": ["register", 22, 7, 31.818181818181817, 1193.8636363636367, 102, 1975, 1235.5, 1908.1, 1968.25, 1975.0, 0.088476712527096, 0.027696101595395994, 0.03991820428468589], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 219.61111111111114, 160, 474, 164.0, 406.5000000000001, 474.0, 474.0, 0.08992311573604568, 0.13936326628232862, 0.2022391948633918], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 95.5, 82, 244, 84.0, 122.5000000000002, 244.0, 244.0, 0.12775199080185667, 0.09918245379636333, 0.045411840480347486], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 21, 0, 0.0, 307.19047619047615, 158, 960, 314.0, 547.4000000000001, 920.5999999999995, 960.0, 0.09958695126404295, 5.820353438832272, 0.22276004198064217], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 100.25, 80, 237, 80.0, 237.0, 237.0, 237.0, 0.04852631642797785, 0.036063014454776506, 0.024357936175762318], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f370ca6f-329e-4f50-bc1c-145054447314", 1, 0, 0.0, 970.0, 970, 970, 970.0, 970.0, 970.0, 970.0, 1.0309278350515465, 0.1862516108247423, 0.7107764175257733], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 79.125, 78, 80, 79.0, 80.0, 80.0, 80.0, 0.04857257349637527, 0.012996958142584789, 0.02770154582215152], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 137.375, 78, 235, 79.5, 235.0, 235.0, 235.0, 0.048526905135966324, 0.013079517399928423, 0.028528512589698952], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 118.25, 78, 236, 80.0, 236.0, 236.0, 236.0, 0.048573163327261686, 0.013091985428051003, 0.028603142076502733], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 94.5, 81, 108, 94.5, 108.0, 108.0, 108.0, 0.10228086325048584, 0.03016486396645188, 0.06322635394292728], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 923.6607142857144, 632, 1372, 863.0, 1237.0, 1308.8, 1372.0, 0.25792663829473644, 308.56992920834944, 0.5093043580390206], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, 31.818181818181817, 1193.8636363636367, 102, 1975, 1235.5, 1908.1, 1968.25, 1975.0, 0.08765953038398858, 0.027440296886891313, 0.0395495146849636], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 103.28571428571428, 79, 234, 81.0, 234.0, 234.0, 234.0, 0.0323856670290777, 0.0087289493164311, 0.019070856658724468], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 81.42857142857143, 79, 89, 80.0, 89.0, 89.0, 89.0, 0.032408607726212076, 0.0087351325512056, 0.01905271665154265], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 124.00000000000003, 79, 239, 81.0, 238.1, 239.0, 239.0, 0.11902715141576184, 0.03208153690502956, 0.06997494643778186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 132.38888888888889, 79, 240, 81.0, 238.2, 240.0, 240.0, 0.11890449326868452, 0.03204847670132512, 0.07001895453224294], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 103.57142857142857, 79, 236, 80.0, 236.0, 236.0, 236.0, 0.03238536736572795, 0.008665615877157676, 0.018469779825766725], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 107.61111111111111, 79, 241, 81.0, 236.5, 241.0, 241.0, 0.11902636433970123, 0.08845611646729751, 0.0597456555377016], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 104.28571428571428, 81, 240, 82.0, 240.0, 240.0, 240.0, 0.032408307638175135, 0.024084689563136013, 0.016267451294943377], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 105.99999999999999, 77, 238, 80.0, 236.2, 238.0, 238.0, 0.11890370781395533, 0.031816031192406016, 0.06781227086264639], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 140.14285714285714, 82, 303, 93.0, 303.0, 303.0, 303.0, 0.031158055915356916, 0.024524797917751636, 0.011075715188662029], "isController": false}, {"data": ["deleteAccount", 13, 2, 15.384615384615385, 447.7692307692308, 79, 1086, 437.0, 880.7999999999998, 1086.0, 1086.0, 0.08361580467348027, 0.016224430849729535, 0.0569017108276035], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1470.8, 964, 2018, 1454.0, 1968.2, 2015.85, 2018.0, 0.08578683686775102, 0.04440139017569144, 0.03945859391085032], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 209.28571428571428, 162, 476, 164.0, 476.0, 476.0, 476.0, 0.03237293622531564, 0.05017172831013273, 0.07280749231142765], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/78203d61-7d1f-48bb-9e66-10ba5924ab19", 3, 0, 0.0, 380.3333333333333, 174, 528, 439.0, 528.0, 528.0, 528.0, 0.05321035828307911, 0.034209133336289464, 0.034122527935438095], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0291fedd-d18f-47f1-9b11-2dfaeb75cd39", 1, 0, 0.0, 351.0, 351, 351, 351.0, 351.0, 351.0, 351.0, 2.849002849002849, 0.9097889957264957, 1.6999421296296298], "isController": false}, {"data": ["addBook", 62, 10, 16.129032258064516, 850.3225806451615, 404, 2402, 715.5, 1395.1, 1481.1999999999998, 2402.0, 0.2883251563698933, 84.54793696375009, 1.0495611542888368], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0d4aaddf-20a7-48a2-b25e-2d99ad9dfb40", 1, 0, 0.0, 456.0, 456, 456, 456.0, 456.0, 456.0, 456.0, 2.1929824561403506, 0.3961931195175438, 1.5119586074561402], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 152.48214285714295, 79, 363, 82.5, 322.8, 337.5, 363.0, 0.2588649695602531, 0.19237914241733656, 0.12513492180891142], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1b67015c-827e-416e-99db-ba5295fdfcb1", 3, 0, 0.0, 323.6666666666667, 185, 467, 319.0, 467.0, 467.0, 467.0, 0.01643538428667693, 0.02265750405406146, 0.010539618178630713], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 518.1785714285716, 389, 731, 471.0, 692.8000000000001, 707.6, 731.0, 0.2588302720491038, 76.10469395631314, 0.13017342783719577], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b70856b5-1539-4fca-8eaa-f842da10751a", 3, 0, 0.0, 314.3333333333333, 183, 442, 318.0, 442.0, 442.0, 442.0, 0.02223721175014269, 0.026283631466395868, 0.014260191128834993], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 122.03571428571432, 77, 338, 82.0, 242.20000000000002, 318.2, 338.0, 0.2591968600151815, 0.4586569436987392, 0.1260547229370707], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3d6a04cc-f99a-4f41-bf3a-22c6d19c2439", 1, 0, 0.0, 433.0, 433, 433, 433.0, 433.0, 433.0, 433.0, 2.3094688221709005, 0.417238019630485, 1.5922704965357968], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 769.5714285714286, 549, 1054, 773.0, 930.6, 949.5499999999998, 1054.0, 0.25835859249929644, 232.47151567683034, 0.12968390287562342], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 21, 0, 0.0, 86.33333333333334, 80, 141, 82.0, 92.4, 136.19999999999993, 141.0, 0.09839429875320367, 0.07350745951777422, 0.03497609838492787], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 10, 5.555555555555555, 148.54444444444445, 79, 1176, 88.0, 266.9, 357.39999999999986, 1060.1699999999996, 0.7883326763894363, 1.6385831704659921, 0.38091198183550123], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 84.625, 79, 94, 83.5, 94.0, 94.0, 94.0, 0.05083884087442806, 0.03937031329435688, 0.01807161921708185], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=57644505-608a-48f5-bd17-5a79fe29300e", 1, 0, 0.0, 1535.0, 1535, 1535, 1535.0, 1535.0, 1535.0, 1535.0, 0.6514657980456027, 0.11769645765472313, 0.4491551302931596], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3d6a04cc-f99a-4f41-bf3a-22c6d19c2439", 3, 0, 0.0, 321.6666666666667, 180, 530, 255.0, 530.0, 530.0, 530.0, 0.017673465059559575, 0.020889437379967714, 0.011333569715928504], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 13, 0, 0.0, 88.23076923076924, 80, 122, 85.0, 110.79999999999998, 122.0, 122.0, 0.08887855770611279, 0.07212703266970677, 0.031593549809594786], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=78203d61-7d1f-48bb-9e66-10ba5924ab19", 1, 0, 0.0, 523.0, 523, 523, 523.0, 523.0, 523.0, 523.0, 1.9120458891013383, 0.34543797801147225, 1.3182660133843211], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 239.0, 160, 475, 163.0, 475.0, 475.0, 475.0, 0.04845694902934674, 0.07509880674763016, 0.10898081407674369], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 258.83333333333337, 159, 479, 165.5, 477.2, 479.0, 479.0, 0.11884012042465536, 0.18417897569719538, 0.2672742161503724], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b39b1505-fe14-4c4c-a241-d40fabe15876", 3, 0, 0.0, 428.0, 360, 487, 437.0, 487.0, 487.0, 487.0, 0.03786970297529633, 0.03157041319001755, 0.024284933223090423], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/50112d7c-2397-47f1-b36a-3cf1fe464e66", 3, 0, 0.0, 285.3333333333333, 173, 419, 264.0, 419.0, 419.0, 419.0, 0.050210045356407634, 0.032280221217091495, 0.03219849913806089], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cdbf1a2f-beab-4a2b-a522-2a899e19b79f", 1, 0, 0.0, 177.0, 177, 177, 177.0, 177.0, 177.0, 177.0, 5.649717514124294, 1.804157838983051, 3.3710716807909606], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 86.68749999999999, 80, 107, 85.0, 104.2, 107.0, 107.0, 0.08055502411616033, 0.06678829636193372, 0.02863479372879137], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 87.11764705882354, 82, 126, 84.0, 104.39999999999998, 126.0, 126.0, 0.07864290109036069, 0.06105576793636401, 0.027955093746964154], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fd6dd30b-9ce6-4bb9-ab4b-c74d85c866a4", 3, 0, 0.0, 379.3333333333333, 293, 429, 416.0, 429.0, 429.0, 429.0, 0.02652730986550654, 0.02660502659362814, 0.01701132826661715], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 21, 0, 0.0, 104.42857142857144, 78, 235, 81.0, 235.0, 235.0, 235.0, 0.09969947728988335, 0.0740930685718762, 0.050044464186523474], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 21, 0, 0.0, 117.66666666666669, 77, 237, 81.0, 236.0, 236.9, 237.0, 0.0996261646773061, 0.03378320279143025, 0.05641961651042753], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 21, 0, 0.0, 151.9047619047619, 77, 868, 80.0, 304.20000000000005, 813.2999999999993, 868.0, 0.09970042396418381, 4.297526873121715, 0.058204944310191756], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 21, 0, 0.0, 174.6190476190476, 77, 623, 86.0, 327.8, 593.6999999999996, 623.0, 0.09970089730807577, 1.421563063784836, 0.058302584805108484], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 28.0, 0.529500756429652], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 8.0, 0.15128593040847202], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 8.0, 0.15128593040847202], "isController": false}, {"data": ["401/Unauthorized", 14, 56.0, 1.059001512859304], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1322, 25, "401/Unauthorized", 14, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
