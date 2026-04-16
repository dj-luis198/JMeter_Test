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

    var data = {"OkPercent": 97.51693002257336, "KoPercent": 2.4830699774266365};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7933937823834197, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3448275862068966, 500, 1500, "see books"], "isController": true}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9565217391304348, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f631bbeb-6af0-47c5-bbd9-6c715f472e94"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4ee79407-346a-4de4-b329-3f4a234e422b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4ab727ca-ef40-418a-a14e-6f9c37387997"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.49137931034482757, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.2826086956521739, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4ab727ca-ef40-418a-a14e-6f9c37387997"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=908af072-b1bc-4fcf-b2ac-1a4655b10155"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fc73d953-1dcd-4e84-b0b5-6f2cc62c0218"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/908af072-b1bc-4fcf-b2ac-1a4655b10155"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.28448275862068967, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8b48481c-5ff7-40f7-a1a7-81f7d9a3b131"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4ee79407-346a-4de4-b329-3f4a234e422b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fc73d953-1dcd-4e84-b0b5-6f2cc62c0218"], "isController": false}, {"data": [0.7155172413793104, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.7894736842105263, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8994252873563219, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f631bbeb-6af0-47c5-bbd9-6c715f472e94"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bf6bd30c-3d7f-4431-a2e3-02f818e52e3c"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e42113d5-30c1-4148-bf07-29997b3d79e1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/313887e5-71d0-430c-ae7b-633ac7d1f3b8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=583f4cba-1dab-4024-9566-a7e6a639fd66"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/583f4cba-1dab-4024-9566-a7e6a639fd66"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/124ddc3a-c5b4-4c4c-ad45-7d960d6a92cf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/26327873-4cef-4224-9e0a-fb54ad17f147"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e42113d5-30c1-4148-bf07-29997b3d79e1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/49a52303-c20f-470a-8b53-2eb32394e43d"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/e79dad3a-e107-4c16-a309-4c8cb1484ba2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bf6bd30c-3d7f-4431-a2e3-02f818e52e3c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e79dad3a-e107-4c16-a309-4c8cb1484ba2"], "isController": false}, {"data": [0.9782608695652174, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=49a52303-c20f-470a-8b53-2eb32394e43d"], "isController": false}, {"data": [0.2826086956521739, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1329, 33, 2.4830699774266365, 311.46576373212946, 80, 3011, 94.0, 882.0, 1083.0, 1555.0, 5.157079439977649, 736.8447553018676, 3.7794352665752178], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 1392.6724137931035, 989, 1916, 1374.5, 1759.7, 1834.05, 1916.0, 0.2741798241467335, 329.92927700582635, 1.3481400532996124], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 234.8888888888889, 170, 1082, 175.5, 416.90000000000106, 1082.0, 1082.0, 0.10579522745973904, 7.186401410235689, 0.2364321294228283], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 91.35714285714286, 85, 102, 90.0, 101.5, 102.0, 102.0, 0.11296152853085464, 0.08769962420120062, 0.040154293344952234], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 23, 0, 0.0, 278.30434782608694, 167, 1204, 178.0, 442.8000000000002, 1063.999999999998, 1204.0, 0.11130468447541618, 5.954526516526326, 0.24908865508855982], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f631bbeb-6af0-47c5-bbd9-6c715f472e94", 3, 0, 0.0, 273.0, 197, 397, 225.0, 397.0, 397.0, 397.0, 0.01939926929418992, 0.026743458808884863, 0.01244028662420382], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4ee79407-346a-4de4-b329-3f4a234e422b", 3, 0, 0.0, 269.6666666666667, 198, 405, 206.0, 405.0, 405.0, 405.0, 0.07511078841290905, 0.03398567574672642, 0.04816674907989284], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 111.11111111111111, 84, 308, 87.0, 308.0, 308.0, 308.0, 0.05683719931542751, 0.04223936394437532, 0.0285296098126267], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 120.33333333333331, 83, 247, 85.0, 247.0, 247.0, 247.0, 0.05683755825849721, 0.01520848726838695, 0.032415169944299195], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4ab727ca-ef40-418a-a14e-6f9c37387997", 3, 0, 0.0, 249.66666666666669, 173, 396, 180.0, 396.0, 396.0, 396.0, 0.05351504664728233, 0.03440501859647871, 0.034317917283576235], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 84.22222222222223, 82, 87, 84.0, 87.0, 87.0, 87.0, 0.05683827615823776, 0.015319691620775022, 0.033414689694588995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 120.77777777777777, 83, 248, 85.0, 248.0, 248.0, 248.0, 0.05677911033442896, 0.015303744582326556, 0.03343535501138737], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 90.0, 88, 91, 91.0, 91.0, 91.0, 91.0, 0.06001920614596671, 0.017700976812580024, 0.03710171629921575], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 979.2241379310345, 650, 1555, 962.0, 1378.9, 1480.45, 1555.0, 0.257999083658427, 308.65659904940685, 0.5094474093333393], "isController": false}, {"data": ["deleteBook", 14, 3, 21.428571428571427, 502.7857142857143, 89, 1452, 423.0, 1247.0, 1452.0, 1452.0, 0.08648595221033384, 0.01774240969939954, 0.05789660179705453], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, 21.428571428571427, 502.7857142857143, 89, 1452, 423.0, 1247.0, 1452.0, 1452.0, 0.0864539077166288, 0.017735835839467442, 0.057875150136473666], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, 30.434782608695652, 980.826086956522, 88, 3011, 862.0, 1547.4, 2719.7999999999956, 3011.0, 0.08956142161233924, 0.028079209289466407, 0.04040759451650461], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 123.05882352941178, 81, 257, 85.0, 250.6, 257.0, 257.0, 0.09905489972148093, 0.04400796153756511, 0.055513534104019296], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 85.6, 84, 87, 86.0, 87.0, 87.0, 87.0, 0.041655558517728605, 0.011227474756731538, 0.024529591588076514], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 86.52941176470588, 83, 94, 85.0, 93.2, 94.0, 94.0, 0.09905432255583459, 0.07361361275877942, 0.04972062675165916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 84.8, 82, 89, 84.0, 89.0, 89.0, 89.0, 0.04165590555773092, 0.011227568294857162, 0.024489116353275404], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 155.94117647058823, 82, 698, 85.0, 676.4, 698.0, 698.0, 0.09905316824471959, 3.450018208302986, 0.05732770393299345], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 212.41176470588235, 80, 1035, 85.0, 862.9999999999999, 1035.0, 1035.0, 0.09905432255583459, 10.509351802351667, 0.05723163926163743], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4ab727ca-ef40-418a-a14e-6f9c37387997", 1, 0, 0.0, 597.0, 597, 597, 597.0, 597.0, 597.0, 597.0, 1.6750418760469012, 0.3026198701842546, 1.1548628559463987], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 146.5714285714286, 83, 267, 88.0, 262.0, 267.0, 267.0, 0.11145786892554614, 0.03004137873383861, 0.0655250362238074], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 121.7857142857143, 82, 260, 85.5, 256.5, 260.0, 260.0, 0.11145077060247102, 0.030039465513947268, 0.0656297018293848], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 84.2, 82, 86, 84.0, 86.0, 86.0, 86.0, 0.04165590555773092, 0.011146209104314719, 0.023756883638393414], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 98.7857142857143, 83, 257, 87.0, 173.5, 257.0, 257.0, 0.1115955776266809, 0.0829338228260783, 0.05601574892589256], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 87.4, 83, 92, 86.0, 92.0, 92.0, 92.0, 0.0416552114835087, 0.030956656190380977, 0.02090896357668308], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 120.0, 83, 251, 86.5, 247.5, 251.0, 251.0, 0.11159824631327223, 0.029861249501793544, 0.06364587485053806], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 121.8, 86, 253, 89.0, 253.0, 253.0, 253.0, 0.03983079876683847, 0.031351195123116994, 0.014158604249149612], "isController": false}, {"data": ["deleteAccount", 13, 3, 23.076923076923077, 456.46153846153834, 87, 1651, 397.0, 1243.7999999999997, 1651.0, 1651.0, 0.08922259665209364, 0.01790886254915822, 0.06071050784815687], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1312.809523809524, 668, 2915, 1089.0, 2219.0, 2850.199999999999, 2915.0, 0.1057311307692695, 0.054724120417688316, 0.048632190031568295], "isController": false}, {"data": ["goToProfile", 15, 4, 26.666666666666668, 348.4, 86, 2639, 189.0, 1294.4000000000008, 2639.0, 2639.0, 0.0892889031751134, 0.13907211715894616, 0.05770062844506352], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=908af072-b1bc-4fcf-b2ac-1a4655b10155", 1, 0, 0.0, 507.0, 507, 507, 507.0, 507.0, 507.0, 507.0, 1.9723865877712032, 0.3563393737672584, 1.3598680966469427], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 174.4, 170, 180, 172.0, 180.0, 180.0, 180.0, 0.04162538815674456, 0.06451122168432971, 0.09361647355955344], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fc73d953-1dcd-4e84-b0b5-6f2cc62c0218", 1, 0, 0.0, 443.0, 443, 443, 443.0, 443.0, 443.0, 443.0, 2.257336343115124, 0.40781955417607224, 1.5563275959367946], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/908af072-b1bc-4fcf-b2ac-1a4655b10155", 3, 0, 0.0, 407.6666666666667, 169, 584, 470.0, 584.0, 584.0, 584.0, 0.03309176346007479, 0.027587241608480317, 0.0212209550834464], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 97.0, 84, 271, 86.5, 109.00000000000026, 271.0, 271.0, 0.10584873040328367, 0.07866297249697154, 0.053131101003210744], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 95.16666666666667, 82, 258, 85.0, 106.80000000000024, 258.0, 258.0, 0.10585184270416174, 0.03715611015060365, 0.05987474566154461], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 639.8571428571428, 494, 739, 668.0, 739.0, 739.0, 739.0, 0.09087722486920172, 26.72092151940229, 0.0518284173082166], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 882.0, 664, 1062, 889.0, 1062.0, 1062.0, 1062.0, 0.0906043308870164, 81.52593619756274, 0.051584301667119685], "isController": false}, {"data": ["addBook", 58, 13, 22.413793103448278, 974.2068965517244, 427, 3461, 722.0, 1613.2, 2342.949999999999, 3461.0, 0.28474503046280886, 83.37941646292668, 1.035120484275201], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 181.57142857142858, 84, 259, 251.0, 259.0, 259.0, 259.0, 0.09155832265152902, 0.1620153131294635, 0.05069684467130563], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 87.81818181818183, 83, 95, 87.0, 94.2, 95.0, 95.0, 0.05938723174517479, 0.04413445640437306, 0.02980960655958969], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 124.27272727272728, 82, 339, 88.0, 321.6000000000001, 339.0, 339.0, 0.05938819362710693, 0.01589098149787822, 0.03386982917795942], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 101.45454545454545, 82, 256, 87.0, 222.80000000000013, 256.0, 256.0, 0.05938915554019836, 0.01600723332919409, 0.03491432776874943], "isController": false}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 155.82758620689654, 82, 368, 88.5, 339.2, 353.1, 368.0, 0.2586745161002587, 0.1922376042502899, 0.12504285690393363], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 99.36363636363636, 83, 247, 85.0, 215.0000000000001, 247.0, 247.0, 0.05939011748445058, 0.01600749260323082, 0.03497289144836299], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8b48481c-5ff7-40f7-a1a7-81f7d9a3b131", 1, 0, 0.0, 181.0, 181, 181, 181.0, 181.0, 181.0, 181.0, 5.524861878453039, 1.7642869475138123, 3.296572859116022], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4ee79407-346a-4de4-b329-3f4a234e422b", 1, 0, 0.0, 187.0, 187, 187, 187.0, 187.0, 187.0, 187.0, 5.347593582887701, 0.9661179812834224, 3.6869151069518717], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fc73d953-1dcd-4e84-b0b5-6f2cc62c0218", 3, 0, 0.0, 356.6666666666667, 192, 439, 439.0, 439.0, 439.0, 439.0, 0.02257047631228511, 0.02667753889645418, 0.01447390570807346], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 559.8275862068966, 404, 788, 504.0, 736.5, 758.4499999999999, 788.0, 0.2585511329443179, 76.02261779121551, 0.13003304049445674], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 84.71428571428571, 82, 86, 85.0, 86.0, 86.0, 86.0, 0.09155712510627166, 0.06804196504479759, 0.05141147161729122], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 144.63793103448276, 81, 427, 90.0, 256.0, 257.05, 427.0, 0.259025706068347, 0.4583540814412548, 0.12597148595902036], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 126.0, 82, 811, 85.5, 163.00000000000102, 811.0, 811.0, 0.10585246518630034, 5.318402974821815, 0.06172429990355664], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 550.421052631579, 83, 1089, 726.0, 1086.0, 1089.0, 1089.0, 0.09406965115012526, 44.561503526993036, 0.051047870931487584], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 821.8965517241379, 563, 1216, 815.0, 1043.6000000000001, 1123.55, 1216.0, 0.2584474438211009, 232.55146425237393, 0.12972850207426354], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 126.88888888888891, 82, 660, 85.0, 296.40000000000055, 660.0, 660.0, 0.10585246518630034, 1.756064372265478, 0.06182767145159014], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 23, 0, 0.0, 106.34782608695652, 85, 255, 90.0, 191.6000000000002, 252.79999999999995, 255.0, 0.1066676560478242, 0.07968823913729055, 0.03791701836075002], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 383.0, 84, 736, 482.0, 678.0, 736.0, 736.0, 0.09406825394467797, 14.569478379154475, 0.05113897625271684], "isController": false}, {"data": ["deleteBooks", 13, 3, 23.076923076923077, 466.1538461538462, 88, 1672, 443.0, 1241.9999999999995, 1672.0, 1672.0, 0.09308386856557758, 0.019271269663967236, 0.0626456113641083], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 13, 7.471264367816092, 176.2241379310345, 82, 2915, 91.0, 276.5, 343.75, 2318.75, 0.6974283332264478, 1.5654795395970948, 0.33253650350918684], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 87.77777777777777, 83, 92, 87.0, 92.0, 92.0, 92.0, 0.05551683085255347, 0.042993014517651265, 0.019734498467118614], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f631bbeb-6af0-47c5-bbd9-6c715f472e94", 1, 0, 0.0, 531.0, 531, 531, 531.0, 531.0, 531.0, 531.0, 1.8832391713747645, 0.34023363935969864, 1.298405131826742], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 229.0909090909091, 168, 426, 180.0, 409.6, 426.0, 426.0, 0.05935871008126747, 0.09199440712790183, 0.13349913019253806], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 101.11764705882352, 84, 251, 90.0, 130.9999999999999, 251.0, 251.0, 0.09863306180231614, 0.08004304136496554, 0.03506097118754207], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bf6bd30c-3d7f-4431-a2e3-02f818e52e3c", 1, 0, 0.0, 389.0, 389, 389, 389.0, 389.0, 389.0, 389.0, 2.5706940874035986, 0.46443203727506427, 1.7723730719794344], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 489.8571428571428, 87, 1085, 453.0, 943.2, 1071.9999999999998, 1085.0, 0.10592151719963684, 0.06506311945173006, 0.04789224849944518], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 86.5263157894737, 82, 99, 85.0, 96.0, 99.0, 99.0, 0.09406965115012526, 0.06990918410668488, 0.04721855536246522], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 131.57894736842104, 81, 303, 86.0, 260.0, 303.0, 303.0, 0.09407011689449789, 0.09953368762284814, 0.049491247765834724], "isController": false}, {"data": ["login", 21, 0, 0.0, 2455.809523809524, 1614, 4698, 2162.0, 3898.4000000000005, 4635.399999999999, 4698.0, 0.10265836274576902, 41.07641131570135, 0.21163262085577966], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 251.00000000000003, 169, 555, 175.0, 555.0, 555.0, 555.0, 0.05674796337864763, 0.08794825965030643, 0.12762749966897022], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e42113d5-30c1-4148-bf07-29997b3d79e1", 1, 0, 0.0, 567.0, 567, 567, 567.0, 567.0, 567.0, 567.0, 1.763668430335097, 0.3186315035273369, 1.2159667107583776], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/313887e5-71d0-430c-ae7b-633ac7d1f3b8", 1, 0, 0.0, 178.0, 178, 178, 178.0, 178.0, 178.0, 178.0, 5.617977528089887, 1.794022120786517, 3.352133075842697], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 102.27777777777779, 86, 253, 91.5, 128.80000000000018, 253.0, 253.0, 0.11137580051356619, 0.09016654162670544, 0.03959061658880673], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 260.64285714285717, 168, 514, 189.5, 433.5, 514.0, 514.0, 0.11137009076662398, 0.1726018887174143, 0.2504739443706397], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=583f4cba-1dab-4024-9566-a7e6a639fd66", 1, 0, 0.0, 385.0, 385, 385, 385.0, 385.0, 385.0, 385.0, 2.5974025974025974, 0.4692573051948052, 1.7907873376623376], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/583f4cba-1dab-4024-9566-a7e6a639fd66", 3, 0, 0.0, 465.0, 177, 633, 585.0, 633.0, 633.0, 633.0, 0.042383656861914046, 0.027248607520273516, 0.027179623703766496], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/124ddc3a-c5b4-4c4c-ad45-7d960d6a92cf", 1, 0, 0.0, 1024.0, 1024, 1024, 1024.0, 1024.0, 1024.0, 1024.0, 0.9765625, 0.31185150146484375, 0.5826950073242188], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/26327873-4cef-4224-9e0a-fb54ad17f147", 2, 0, 0.0, 189.5, 189, 190, 189.5, 190.0, 190.0, 190.0, 0.01676417830380044, 0.02386930856146586, 0.010420312002313456], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e42113d5-30c1-4148-bf07-29997b3d79e1", 3, 0, 0.0, 649.6666666666666, 398, 1141, 410.0, 1141.0, 1141.0, 1141.0, 0.026886056890896383, 0.022413799380724492, 0.01724138413901884], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 120.63636363636364, 87, 265, 90.0, 262.40000000000003, 265.0, 265.0, 0.06253304302841843, 0.05184624368274145, 0.02222854263900811], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/49a52303-c20f-470a-8b53-2eb32394e43d", 3, 0, 0.0, 1082.0, 224, 1651, 1371.0, 1651.0, 1651.0, 1651.0, 0.03008121929208864, 0.03016934786423343, 0.01929036523613757], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 656.1052631578947, 169, 1175, 812.0, 1171.0, 1175.0, 1175.0, 0.09402821836321616, 59.27452184021884, 0.19880956099956945], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 103.4736842105263, 86, 357, 88.0, 96.0, 357.0, 357.0, 0.0971082194441321, 0.07539163521297366, 0.034518937380531335], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e79dad3a-e107-4c16-a309-4c8cb1484ba2", 3, 0, 0.0, 1070.6666666666667, 189, 2639, 384.0, 2639.0, 2639.0, 2639.0, 0.05778008898133703, 0.03714702986267599, 0.03705298674909959], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 320.52941176470586, 167, 1122, 177.0, 947.5999999999998, 1122.0, 1122.0, 0.09900413487857433, 14.069899148637237, 0.2196824860957428], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 7, 50.0, 532.6428571428571, 86, 1144, 457.0, 1110.5, 1144.0, 1144.0, 0.12089288027287251, 72.33113113099607, 0.17620373418677948], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 23, 0, 0.0, 101.8695652173913, 82, 250, 86.0, 193.4000000000002, 249.8, 250.0, 0.11135156594191321, 0.08275248211112886, 0.055893266498186905], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bf6bd30c-3d7f-4431-a2e3-02f818e52e3c", 3, 0, 0.0, 395.0, 322, 490, 373.0, 490.0, 490.0, 490.0, 0.05868200222991608, 0.03772687317841285, 0.03763136210707509], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 23, 0, 0.0, 99.30434782608695, 82, 249, 86.0, 183.20000000000022, 248.39999999999998, 249.0, 0.1113542614791719, 0.03706765497608304, 0.06310011776923524], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e79dad3a-e107-4c16-a309-4c8cb1484ba2", 1, 0, 0.0, 512.0, 512, 512, 512.0, 512.0, 512.0, 512.0, 1.953125, 0.3528594970703125, 1.346588134765625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 23, 0, 0.0, 150.82608695652172, 82, 954, 85.0, 250.8, 813.599999999998, 954.0, 0.11135480060228423, 4.385110630086615, 0.06504837579340296], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=49a52303-c20f-470a-8b53-2eb32394e43d", 1, 0, 0.0, 1672.0, 1672, 1672, 1672.0, 1672.0, 1672.0, 1672.0, 0.5980861244019139, 0.10805266895933015, 0.4123523474880383], "isController": false}, {"data": ["register", 23, 7, 30.434782608695652, 980.826086956522, 88, 3011, 862.0, 1547.4, 2719.7999999999956, 3011.0, 0.09242998428690266, 0.028978558252992923, 0.041701809316942416], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 23, 0, 0.0, 146.69565217391306, 80, 491, 85.0, 261.0, 444.9999999999993, 491.0, 0.1113580354505885, 1.4523164438295544, 0.06515901352515965], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 21.21212121212121, 0.526711813393529], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 12.121212121212121, 0.3009781790820166], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 9.090909090909092, 0.22573363431151242], "isController": false}, {"data": ["401/Unauthorized", 19, 57.57575757575758, 1.4296463506395787], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1329, 33, "401/Unauthorized", 19, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 7, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
