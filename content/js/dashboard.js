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

    var data = {"OkPercent": 98.38212634822804, "KoPercent": 1.617873651771957};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8172757475083057, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3392857142857143, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d09f28c0-cdc9-49c3-863f-66ba24330c0d"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.75, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e4d6b877-9d39-4a34-b4a1-b192bf239cef"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.7, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c06cad96-c3b7-4aa5-b85a-8bdc140c7b51"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/b446e771-4bb6-43e1-a4e7-524967ce75c1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a6f051e7-fd76-4052-bf9a-02e6a962af3e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6a2c061d-b7b2-471a-816f-eb807b27f779"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a2f27adf-a801-4415-b12d-30e413d5d803"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ffaf6436-4d2a-496d-902f-ce52a6a651a6"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/17e4e6ff-a5ad-4d3a-8b8a-3177e3fc7dfc"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=35c1b016-0633-4287-9726-fd42250a29d9"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/958cc5e5-7ca4-4e6a-9f00-271071c56384"], "isController": false}, {"data": [0.023809523809523808, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7d1f43e3-e2f7-4624-8d9e-c33485ec1c62"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d964dbbf-8325-4ae3-a7b4-367cc9defcc2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3125, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.3409090909090909, 500, 1500, "register"], "isController": true}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e4d6b877-9d39-4a34-b4a1-b192bf239cef"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c06cad96-c3b7-4aa5-b85a-8bdc140c7b51"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d09f28c0-cdc9-49c3-863f-66ba24330c0d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.48214285714285715, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.3409090909090909, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7d1f43e3-e2f7-4624-8d9e-c33485ec1c62"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ffaf6436-4d2a-496d-902f-ce52a6a651a6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c33c19b8-3080-46b0-a667-7f0405dad14f"], "isController": false}, {"data": [0.3559322033898305, 500, 1500, "addBook"], "isController": true}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8035714285714286, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9281609195402298, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a2f27adf-a801-4415-b12d-30e413d5d803"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6a2c061d-b7b2-471a-816f-eb807b27f779"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c33c19b8-3080-46b0-a667-7f0405dad14f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=958cc5e5-7ca4-4e6a-9f00-271071c56384"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/35c1b016-0633-4287-9726-fd42250a29d9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=17e4e6ff-a5ad-4d3a-8b8a-3177e3fc7dfc"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/85bedf97-17b5-46dc-892f-ec56d10b8c6c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6fe15477-d0b8-4e87-a65d-43bf63fab1f6"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1298, 21, 1.617873651771957, 297.4938366718027, 80, 1841, 94.0, 824.2000000000003, 1020.1999999999998, 1353.12, 5.192623114773772, 730.8390327151758, 3.797334586400368], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1398.6964285714287, 1000, 2130, 1404.5, 1661.1000000000001, 1772.6499999999999, 2130.0, 0.25342692027460617, 304.9583570921071, 1.246098187092424], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d09f28c0-cdc9-49c3-863f-66ba24330c0d", 3, 0, 0.0, 397.3333333333333, 329, 512, 351.0, 512.0, 512.0, 512.0, 0.019303901318456457, 0.022816557840922985, 0.012379129426223707], "isController": false}, {"data": ["deleteBook", 12, 1, 8.333333333333334, 472.08333333333337, 90, 811, 423.0, 796.0, 811.0, 811.0, 0.07986263626562314, 0.01518871915305674, 0.05396317292590078], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, 8.333333333333334, 472.08333333333337, 90, 811, 423.0, 796.0, 811.0, 811.0, 0.0780711227928643, 0.014847999183506174, 0.05275264750562763], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 13, 0, 0.0, 97.84615384615384, 81, 248, 84.0, 190.79999999999995, 248.0, 248.0, 0.10010164166692334, 0.02678500958665722, 0.057089217513167215], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 13, 0, 0.0, 109.23076923076923, 81, 250, 84.0, 249.2, 250.0, 250.0, 0.1001001001001001, 0.07439079704704704, 0.050245558058058054], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 13, 0, 0.0, 122.15384615384616, 82, 252, 84.0, 250.4, 252.0, 252.0, 0.10010241246814047, 0.026980728360553492, 0.05894702609207882], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 13, 0, 0.0, 140.07692307692307, 81, 332, 85.0, 298.0, 332.0, 332.0, 0.10010318328122834, 0.026980936118768575, 0.05884972298369087], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e4d6b877-9d39-4a34-b4a1-b192bf239cef", 1, 0, 0.0, 302.0, 302, 302, 302.0, 302.0, 302.0, 302.0, 3.3112582781456954, 0.5982253725165563, 2.282957367549669], "isController": false}, {"data": ["goToProfile", 13, 2, 15.384615384615385, 178.2307692307692, 83, 329, 178.0, 281.79999999999995, 329.0, 329.0, 0.07331378299120235, 0.12550689607771262, 0.04738520048499888], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 108.3529411764706, 82, 307, 85.0, 260.59999999999997, 307.0, 307.0, 0.09987544943952248, 0.07422384474948887, 0.05013279395694781], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 132.76470588235293, 83, 252, 84.0, 251.2, 252.0, 252.0, 0.09988483865660769, 0.053201529413147194, 0.05548520162048462], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 571.6, 411, 658, 651.0, 658.0, 658.0, 658.0, 0.04340729937146231, 12.763187273196861, 0.024755725422787096], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 818.6, 737, 899, 827.0, 899.0, 899.0, 899.0, 0.04325484021662024, 38.92078126081371, 0.02462653500614219], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 150.0, 83, 250, 85.0, 250.0, 250.0, 250.0, 0.04349717268377556, 0.07696960635058721, 0.024084860265332752], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c06cad96-c3b7-4aa5-b85a-8bdc140c7b51", 1, 0, 0.0, 164.0, 164, 164, 164.0, 164.0, 164.0, 164.0, 6.097560975609756, 1.101610137195122, 4.203982469512195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 20, 0, 0.0, 100.69999999999999, 82, 252, 84.0, 229.40000000000032, 251.65, 252.0, 0.10880090522353146, 0.0808569227295971, 0.05461295437978044], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 20, 0, 0.0, 132.55, 82, 250, 84.0, 248.9, 249.95, 250.0, 0.10880268089805734, 0.029113217349675497, 0.06205152894967332], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b446e771-4bb6-43e1-a4e7-524967ce75c1", 1, 0, 0.0, 783.0, 783, 783, 783.0, 783.0, 783.0, 783.0, 1.277139208173691, 0.40783644636015326, 0.7620430236270753], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 20, 0, 0.0, 116.7, 82, 250, 84.0, 248.70000000000002, 249.95, 250.0, 0.10880268089805734, 0.029325722585804515, 0.0639640760748345], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 20, 0, 0.0, 108.14999999999998, 82, 250, 84.0, 245.60000000000002, 249.8, 250.0, 0.1088020890001088, 0.029325563050810577, 0.06406998014361875], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a6f051e7-fd76-4052-bf9a-02e6a962af3e", 1, 0, 0.0, 236.0, 236, 236, 236.0, 236.0, 236.0, 236.0, 4.237288135593221, 1.3531183792372883, 2.5283037605932206], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 84.8, 82, 88, 84.0, 88.0, 88.0, 88.0, 0.04355893960117435, 0.03237143851220086, 0.0244593654987063], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 599.25, 82, 1054, 810.5, 1005.7, 1054.0, 1054.0, 0.07358148689789648, 41.38790672454311, 0.039305735676903694], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 242.8235294117647, 81, 1024, 84.0, 917.5999999999999, 1024.0, 1024.0, 0.09988425177882101, 15.882646056848827, 0.05720622646110096], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 443.68750000000006, 82, 729, 572.5, 701.7, 729.0, 729.0, 0.07358148689789648, 13.529562368358121, 0.03937759259770242], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 165.52941176470588, 81, 492, 84.0, 491.2, 492.0, 492.0, 0.09988425177882101, 5.204986262243165, 0.057303769675728713], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6a2c061d-b7b2-471a-816f-eb807b27f779", 1, 0, 0.0, 404.0, 404, 404, 404.0, 404.0, 404.0, 404.0, 2.4752475247524752, 0.44718827351485146, 1.7065671410891088], "isController": false}, {"data": ["deleteBooks", 12, 1, 8.333333333333334, 404.83333333333337, 87, 890, 373.5, 862.4000000000001, 890.0, 890.0, 0.07810262685168312, 0.014853990800161412, 0.05338411156634818], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a2f27adf-a801-4415-b12d-30e413d5d803", 3, 0, 0.0, 314.33333333333337, 164, 605, 174.0, 605.0, 605.0, 605.0, 0.07588596868439025, 0.03433642463258543, 0.0486638536159664], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ffaf6436-4d2a-496d-902f-ce52a6a651a6", 3, 0, 0.0, 300.0, 196, 456, 248.0, 456.0, 456.0, 456.0, 0.01642188928362245, 0.022638900102910507, 0.010530964156489657], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 20, 0, 0.0, 251.1, 166, 503, 171.0, 479.20000000000033, 502.6, 503.0, 0.10875120985720965, 0.16854313480799973, 0.24458401982534556], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/17e4e6ff-a5ad-4d3a-8b8a-3177e3fc7dfc", 3, 0, 0.0, 296.0, 163, 430, 295.0, 430.0, 430.0, 430.0, 0.025371480764189, 0.025445811274240338, 0.0162701227556811], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=35c1b016-0633-4287-9726-fd42250a29d9", 1, 0, 0.0, 704.0, 704, 704, 704.0, 704.0, 704.0, 704.0, 1.4204545454545454, 0.2566250887784091, 0.9793368252840909], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 554.8571428571429, 160, 1365, 461.0, 960.2, 1326.9999999999995, 1365.0, 0.09364632014555314, 0.057522983761282155, 0.04234203733143663], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 85.0625, 83, 89, 85.0, 88.3, 89.0, 89.0, 0.07357979498829621, 0.05468185936141936, 0.036933608031234626], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 145.375, 82, 254, 84.0, 252.6, 254.0, 254.0, 0.07358114850975181, 0.08876085321940519, 0.03810195702860927], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/958cc5e5-7ca4-4e6a-9f00-271071c56384", 3, 0, 0.0, 781.0, 167, 1457, 719.0, 1457.0, 1457.0, 1457.0, 0.03462563913158897, 0.028865970643228954, 0.02220459280248381], "isController": false}, {"data": ["login", 21, 0, 0.0, 2224.666666666667, 1302, 3373, 2117.0, 3321.6, 3369.2999999999997, 3373.0, 0.09753741256467659, 27.917140625435437, 0.18567215324288674], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 97.1764705882353, 84, 253, 86.0, 127.39999999999989, 253.0, 253.0, 0.10644626029241414, 0.08617573220938606, 0.03783831908831908], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7d1f43e3-e2f7-4624-8d9e-c33485ec1c62", 1, 0, 0.0, 798.0, 798, 798, 798.0, 798.0, 798.0, 798.0, 1.2531328320802004, 0.22639606829573933, 0.8639763471177945], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d964dbbf-8325-4ae3-a7b4-367cc9defcc2", 1, 0, 0.0, 281.0, 281, 281, 281.0, 281.0, 281.0, 281.0, 3.558718861209964, 1.1364268238434163, 2.123415258007117], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 701.3125000000001, 169, 1140, 898.0, 1090.3, 1140.0, 1140.0, 0.0735513825361436, 55.038386423449104, 0.1536570264555129], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 13, 0, 0.0, 264.00000000000006, 165, 503, 170.0, 499.8, 503.0, 503.0, 0.10003539714052664, 0.15503532740431228, 0.2249819527486649], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 3, 37.5, 596.375, 82, 983, 825.0, 983.0, 983.0, 983.0, 0.05937669316351599, 44.402937777864366, 0.09830640739462493], "isController": false}, {"data": ["register", 22, 5, 22.727272727272727, 888.2272727272727, 206, 1841, 819.5, 1454.3999999999999, 1792.0999999999992, 1841.0, 0.09266044999283987, 0.02930189301087497, 0.041805788961613306], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 372.05882352941177, 167, 1332, 171.0, 1178.3999999999999, 1332.0, 1332.0, 0.09982559880679048, 21.202606237191496, 0.22000282044017216], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 20, 0, 0.0, 122.95, 84, 266, 88.5, 260.0, 265.75, 266.0, 0.10402147003141447, 0.0807588561279048, 0.03697638192522937], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e4d6b877-9d39-4a34-b4a1-b192bf239cef", 3, 0, 0.0, 261.3333333333333, 179, 350, 255.0, 350.0, 350.0, 350.0, 0.07467516304077264, 0.03378856661024543, 0.04788739296559964], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 290.47058823529414, 169, 1062, 172.0, 617.1999999999996, 1062.0, 1062.0, 0.10861370577186011, 7.80194310718256, 0.2426400737455117], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c06cad96-c3b7-4aa5-b85a-8bdc140c7b51", 3, 0, 0.0, 356.66666666666663, 204, 661, 205.0, 661.0, 661.0, 661.0, 0.09697753353806368, 0.044953127525456604, 0.062189368837885894], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 84.5, 82, 87, 85.0, 87.0, 87.0, 87.0, 0.04560665401082018, 0.03389322627171304, 0.02289240250152497], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 124.25, 82, 409, 84.0, 409.0, 409.0, 409.0, 0.045607434011743914, 0.012203551678923666, 0.026010489709822702], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d09f28c0-cdc9-49c3-863f-66ba24330c0d", 1, 0, 0.0, 373.0, 373, 373, 373.0, 373.0, 373.0, 373.0, 2.680965147453083, 0.4843540549597855, 1.848399798927614], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 84.375, 83, 87, 84.0, 87.0, 87.0, 87.0, 0.04560717400847153, 0.012292558619470843, 0.026812030032324085], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 105.0, 82, 250, 84.5, 250.0, 250.0, 250.0, 0.04560717400847153, 0.012292558619470843, 0.02685656828819173], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 87.0, 87, 87, 87.0, 87.0, 87.0, 87.0, 11.494252873563218, 3.3899066091954024, 7.105334051724139], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 966.6250000000002, 654, 1765, 899.0, 1310.9, 1424.9499999999998, 1765.0, 0.2531531124271055, 302.85913272456037, 0.49987850910899145], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, 22.727272727272727, 888.2272727272727, 206, 1841, 819.5, 1454.3999999999999, 1792.0999999999992, 1841.0, 0.09585638969979522, 0.030312540847893338, 0.043247707071587295], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 4, 0, 0.0, 83.0, 82, 84, 83.0, 84.0, 84.0, 84.0, 0.036846662613533775, 0.009931327032554026, 0.021697790581993035], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 4, 0, 0.0, 125.75, 83, 250, 85.0, 250.0, 250.0, 250.0, 0.03684564438426322, 0.009931052587945946, 0.021661208905592245], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 20, 0, 0.0, 149.45, 81, 894, 84.5, 253.60000000000002, 861.9999999999995, 894.0, 0.09863100169645322, 4.462672365381011, 0.0575604361462895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 20, 0, 0.0, 137.35, 81, 670, 84.0, 247.9, 648.8999999999996, 670.0, 0.09863100169645322, 1.47529439812897, 0.057656755483883694], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 20, 0, 0.0, 93.35, 83, 256, 84.0, 95.90000000000002, 248.0499999999999, 256.0, 0.09863051529512716, 0.0732986544331951, 0.049507895372749376], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 4, 0, 0.0, 123.75, 82, 246, 83.5, 246.0, 246.0, 246.0, 0.03684632319752393, 0.009859270074337458, 0.021013918698587864], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 20, 0, 0.0, 116.40000000000002, 80, 249, 84.0, 246.9, 248.9, 249.0, 0.09863148810257674, 0.03379862224140057, 0.055836595364320056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 4, 0, 0.0, 137.5, 84, 296, 85.0, 296.0, 296.0, 296.0, 0.036774507911116014, 0.027329492695663368, 0.018459079166321904], "isController": false}, {"data": ["deleteAccount", 12, 1, 8.333333333333334, 482.41666666666674, 82, 723, 443.0, 721.8, 723.0, 723.0, 0.07852683654638973, 0.014755734504037589, 0.0534440050486212], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 4, 0, 0.0, 89.75, 87, 91, 90.5, 91.0, 91.0, 91.0, 0.035227082581088344, 0.02772756695347383, 0.012522127011246246], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7d1f43e3-e2f7-4624-8d9e-c33485ec1c62", 3, 0, 0.0, 360.33333333333337, 170, 723, 188.0, 723.0, 723.0, 723.0, 0.04057014578205718, 0.03382166124604441, 0.02601666249695724], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1160.5238095238096, 672, 1577, 1156.0, 1552.6, 1574.8999999999999, 1577.0, 0.09530768497633192, 0.049329172888140545, 0.0438378121326683], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 4, 0, 0.0, 264.25, 168, 547, 171.0, 547.0, 547.0, 547.0, 0.036745117492513184, 0.05694775533263517, 0.08264063045435338], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ffaf6436-4d2a-496d-902f-ce52a6a651a6", 1, 0, 0.0, 374.0, 374, 374, 374.0, 374.0, 374.0, 374.0, 2.6737967914438503, 0.4830589906417112, 1.8434575534759359], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c33c19b8-3080-46b0-a667-7f0405dad14f", 3, 0, 0.0, 268.0, 170, 383, 251.0, 383.0, 383.0, 383.0, 0.08641548565502938, 0.03910075685562853, 0.055416180579559854], "isController": false}, {"data": ["addBook", 59, 11, 18.64406779661017, 902.3728813559325, 428, 1821, 767.0, 1503.0, 1709.0, 1821.0, 0.27000681881627175, 83.18420450099079, 0.9813355283781743], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 146.26785714285717, 83, 567, 85.0, 337.3, 342.0, 567.0, 0.25381976077487545, 0.1886297245602346, 0.1226960757651986], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 538.7678571428575, 405, 747, 494.5, 692.2000000000002, 743.15, 747.0, 0.2539613434555069, 74.67306728615094, 0.12772469910115825], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 120.51785714285715, 83, 310, 86.0, 251.60000000000002, 263.74999999999994, 310.0, 0.25442055718102025, 0.4502051265742272, 0.12373187253530085], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 817.9642857142857, 565, 1210, 808.0, 1064.2, 1098.5, 1210.0, 0.253849675661709, 228.4143843805388, 0.1274206379786313], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 114.58823529411765, 86, 252, 90.0, 250.4, 252.0, 252.0, 0.10588865496493217, 0.07910627055485656, 0.037640107819565734], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 11, 6.32183908045977, 149.64942528735625, 83, 1313, 89.0, 287.0, 336.0, 1078.25, 0.7196773859993796, 1.5602582786164823, 0.3454835978699204], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 90.25000000000001, 84, 110, 87.5, 110.0, 110.0, 110.0, 0.04784402846719694, 0.037051088451647625, 0.01700705699419891], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a2f27adf-a801-4415-b12d-30e413d5d803", 1, 0, 0.0, 198.0, 198, 198, 198.0, 198.0, 198.0, 198.0, 5.050505050505051, 0.91244476010101, 3.4820864898989896], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6a2c061d-b7b2-471a-816f-eb807b27f779", 3, 0, 0.0, 448.6666666666667, 211, 652, 483.0, 652.0, 652.0, 652.0, 0.018472565161973608, 0.025465922350572344, 0.011846013466500004], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 13, 0, 0.0, 87.38461538461537, 84, 101, 86.0, 96.6, 101.0, 101.0, 0.09646994219224234, 0.07828761910327478, 0.03429204976364864], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c33c19b8-3080-46b0-a667-7f0405dad14f", 1, 0, 0.0, 177.0, 177, 177, 177.0, 177.0, 177.0, 177.0, 5.649717514124294, 1.020700918079096, 3.895215395480226], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=958cc5e5-7ca4-4e6a-9f00-271071c56384", 1, 0, 0.0, 890.0, 890, 890, 890.0, 890.0, 890.0, 890.0, 1.1235955056179776, 0.2029933286516854, 0.7746664325842697], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 230.875, 166, 496, 170.0, 496.0, 496.0, 496.0, 0.04558482481182014, 0.07064757517222515, 0.10252133939611502], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/35c1b016-0633-4287-9726-fd42250a29d9", 3, 0, 0.0, 339.6666666666667, 178, 464, 377.0, 464.0, 464.0, 464.0, 0.04943072284193702, 0.03177919193125834, 0.03169873828079946], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=17e4e6ff-a5ad-4d3a-8b8a-3177e3fc7dfc", 1, 0, 0.0, 387.0, 387, 387, 387.0, 387.0, 387.0, 387.0, 2.5839793281653747, 0.46683220284237725, 1.781532622739018], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 20, 0, 0.0, 276.54999999999995, 167, 980, 171.0, 489.70000000000033, 956.2499999999997, 980.0, 0.09858967470336832, 6.042531316085892, 0.22046923447582337], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 20, 0, 0.0, 112.20000000000002, 83, 255, 87.0, 248.8, 254.7, 255.0, 0.11142806204314494, 0.09238518034631842, 0.03960919392939918], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/85bedf97-17b5-46dc-892f-ec56d10b8c6c", 1, 0, 0.0, 193.0, 193, 193, 193.0, 193.0, 193.0, 193.0, 5.181347150259067, 1.6545903497409327, 3.091604598445596], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 94.00000000000001, 84, 111, 90.0, 108.2, 111.0, 111.0, 0.07537143987714455, 0.05851591279524406, 0.026792191518828726], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 105.00000000000001, 82, 256, 85.0, 250.4, 256.0, 256.0, 0.10878746768372283, 0.08084693643292293, 0.05460620936468119], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 121.76470588235294, 81, 250, 84.0, 248.4, 250.0, 250.0, 0.10878955620260455, 0.038721282756855345, 0.06150659536684479], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6fe15477-d0b8-4e87-a65d-43bf63fab1f6", 1, 0, 0.0, 167.0, 167, 167, 167.0, 167.0, 167.0, 167.0, 5.9880239520958085, 1.9121912425149699, 3.5729322604790417], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 155.64705882352942, 82, 979, 84.0, 395.7999999999995, 979.0, 979.0, 0.10867411190876489, 5.779636119519148, 0.06333912795417787], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 145.58823529411762, 82, 649, 84.0, 329.7999999999997, 649.0, 649.0, 0.10867411190876489, 1.9072031958179643, 0.06344525501658878], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 23.80952380952381, 0.3852080123266564], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 9.523809523809524, 0.15408320493066255], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.761904761904762, 0.07704160246533127], "isController": false}, {"data": ["401/Unauthorized", 13, 61.904761904761905, 1.0015408320493067], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1298, 21, "401/Unauthorized", 13, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 3, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
