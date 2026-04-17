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

    var data = {"OkPercent": 98.71698113207547, "KoPercent": 1.2830188679245282};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7465931213497728, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/12019f26-c021-4d4a-b68a-fde105e5e68b"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a4f361ae-7fd5-4f66-8a84-876a2bd558eb"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0907248c-faca-4c6f-a112-991921639380"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c796160b-e41c-4034-bf9c-630db161d889"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/613704d5-17f8-42f5-9ae7-4e35fc791f3a"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9851a8c3-6511-4d34-9833-0aacc21dd285"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/208052d4-f6ef-4ecd-a5d6-c3cb0d7fb758"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=070f0ecc-0fa0-46dc-8ff4-15f862b137f3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=be444f61-3da8-4fb9-8f37-67fb2d550d67"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.375, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9772727272727273, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5555555555555556, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.7954545454545454, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3ca936d9-c5d3-405b-8760-4cf699147e65"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7bee4528-d52f-490a-b6fc-c415a34be119"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.023809523809523808, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/be444f61-3da8-4fb9-8f37-67fb2d550d67"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/9851a8c3-6511-4d34-9833-0aacc21dd285"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/86501623-7762-45b3-a22e-aa243ea75de3"], "isController": false}, {"data": [0.4444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=461eba98-0713-47b0-be0f-55f5ad0293e8"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.08333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ca14b8c3-37cf-4987-ad7d-39a6e52cb934"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/409a8c34-a46c-4964-bd0b-ccf51d0fc093"], "isController": false}, {"data": [0.30434782608695654, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3ca936d9-c5d3-405b-8760-4cf699147e65"], "isController": false}, {"data": [0.6764705882352942, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8421052631578947, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=12019f26-c021-4d4a-b68a-fde105e5e68b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/070f0ecc-0fa0-46dc-8ff4-15f862b137f3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c796160b-e41c-4034-bf9c-630db161d889"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=208052d4-f6ef-4ecd-a5d6-c3cb0d7fb758"], "isController": false}, {"data": [0.30434782608695654, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/0907248c-faca-4c6f-a112-991921639380"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.38095238095238093, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.288135593220339, 500, 1500, "addBook"], "isController": true}, {"data": [0.9137931034482759, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9827586206896551, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.3620689655172414, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a4f361ae-7fd5-4f66-8a84-876a2bd558eb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9460227272727273, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/51fc43a9-0c77-438b-a4b5-71cd300ab306"], "isController": false}, {"data": [0.85, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/461eba98-0713-47b0-be0f-55f5ad0293e8"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f4a3c617-c8ce-4285-ae4a-db171fcffa80"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7bee4528-d52f-490a-b6fc-c415a34be119"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ca14b8c3-37cf-4987-ad7d-39a6e52cb934"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1325, 17, 1.2830188679245282, 473.2747169811324, 138, 2418, 159.0, 1320.4, 1614.2000000000003, 1990.22, 5.3507464796126465, 766.830104997042, 3.905410002210969], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 2369.758620689656, 1691, 3034, 2329.0, 2841.4, 2964.3999999999996, 3034.0, 0.258320825557728, 310.84750699526114, 1.270161481135899], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/12019f26-c021-4d4a-b68a-fde105e5e68b", 3, 0, 0.0, 476.0, 338, 660, 430.0, 660.0, 660.0, 660.0, 0.02817456963344885, 0.028257112317921843, 0.018067676490199944], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a4f361ae-7fd5-4f66-8a84-876a2bd558eb", 1, 0, 0.0, 830.0, 830, 830, 830.0, 830.0, 830.0, 830.0, 1.2048192771084338, 0.2176675451807229, 0.8306664156626506], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0907248c-faca-4c6f-a112-991921639380", 1, 0, 0.0, 519.0, 519, 519, 519.0, 519.0, 519.0, 519.0, 1.9267822736030829, 0.3481003131021195, 1.3284260597302504], "isController": false}, {"data": ["deleteBook", 14, 1, 7.142857142857143, 511.3571428571429, 191, 703, 507.5, 669.0, 703.0, 703.0, 0.07618798841942576, 0.014386222422669192, 0.051523615215285486], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, 7.142857142857143, 511.3571428571429, 191, 703, 507.5, 669.0, 703.0, 703.0, 0.0769933015827623, 0.014538285950372317, 0.05206822397076454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 165.28571428571428, 139, 431, 144.5, 292.0, 431.0, 431.0, 0.08210999219955074, 0.03958874623906911, 0.04584321830114427], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 145.85714285714286, 139, 152, 145.5, 151.5, 152.0, 152.0, 0.08210662131253299, 0.0610186902527711, 0.04121367515101754], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 330.7142857142857, 138, 1176, 146.0, 1173.0, 1176.0, 1176.0, 0.08211047377743369, 3.467999092386013, 0.04734411106614585], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c796160b-e41c-4034-bf9c-630db161d889", 3, 0, 0.0, 378.66666666666663, 228, 659, 249.0, 659.0, 659.0, 659.0, 0.06929366655887652, 0.03216561475031182, 0.04443636820344621], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/613704d5-17f8-42f5-9ae7-4e35fc791f3a", 1, 0, 0.0, 725.0, 725, 725, 725.0, 725.0, 725.0, 725.0, 1.379310344827586, 0.4404633620689655, 0.8230064655172414], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 410.0, 139, 1710, 149.0, 1706.5, 1710.0, 1710.0, 0.08210854749979474, 10.57345718405804, 0.04726281626453028], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9851a8c3-6511-4d34-9833-0aacc21dd285", 1, 0, 0.0, 437.0, 437, 437, 437.0, 437.0, 437.0, 437.0, 2.288329519450801, 0.41341890732265446, 1.577695938215103], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/208052d4-f6ef-4ecd-a5d6-c3cb0d7fb758", 3, 0, 0.0, 345.0, 255, 442, 338.0, 442.0, 442.0, 442.0, 0.10572687224669604, 0.0478386563876652, 0.06780011013215859], "isController": false}, {"data": ["goToProfile", 15, 1, 6.666666666666667, 285.0, 139, 455, 255.0, 408.8, 455.0, 455.0, 0.08022934896557626, 0.1551936469052866, 0.051861797257760855], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=070f0ecc-0fa0-46dc-8ff4-15f862b137f3", 1, 0, 0.0, 461.0, 461, 461, 461.0, 461.0, 461.0, 461.0, 2.1691973969631237, 0.3918960140997831, 1.495559924078091], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=be444f61-3da8-4fb9-8f37-67fb2d550d67", 1, 0, 0.0, 597.0, 597, 597, 597.0, 597.0, 597.0, 597.0, 1.6750418760469012, 0.3026198701842546, 1.1548628559463987], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 164.47058823529412, 141, 430, 148.0, 213.19999999999982, 430.0, 430.0, 0.09193015471304272, 0.06831918724279835, 0.046144628439945275], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 246.8235294117647, 139, 447, 148.0, 443.0, 447.0, 447.0, 0.0919281662493849, 0.04084170713308495, 0.05151948471559048], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 1129.25, 1103, 1168, 1123.0, 1168.0, 1168.0, 1168.0, 0.5678591709256104, 166.96945095116413, 0.3238571834185122], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1341.25, 1184, 1520, 1330.5, 1520.0, 1520.0, 1520.0, 0.5492242207881367, 494.192919298366, 0.3126930866401208], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 221.25, 139, 459, 143.5, 459.0, 459.0, 459.0, 0.661485033901108, 1.17051843889532, 0.3662714982636018], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 22, 0, 0.0, 201.18181818181816, 141, 454, 147.5, 444.8, 452.79999999999995, 454.0, 0.11137661496091693, 0.08277109764185331, 0.05590583993155401], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 22, 0, 0.0, 224.68181818181813, 141, 450, 145.0, 442.7, 448.95, 450.0, 0.11137887041574694, 0.037406451241368134, 0.06309557636034102], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 22, 0, 0.0, 246.72727272727275, 141, 1777, 147.0, 431.5, 1575.3999999999971, 1777.0, 0.11046505789373262, 4.546450125340183, 0.06450986779341027], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 22, 0, 0.0, 258.81818181818187, 139, 1181, 147.0, 446.1, 1070.8999999999983, 1181.0, 0.11079662775354801, 1.5093187990400982, 0.06481169924255396], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 214.5, 140, 431, 143.5, 431.0, 431.0, 431.0, 0.6316121901152693, 0.4693914811305858, 0.3546650481604295], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 948.9444444444442, 138, 1754, 1345.0, 1723.4, 1754.0, 1754.0, 0.08608938948274625, 43.04552611677069, 0.04650097448406151], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 316.0, 141, 1317, 149.0, 1284.2, 1317.0, 1317.0, 0.09192617787174677, 9.753078090612174, 0.05311313746748787], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 722.2777777777777, 143, 1334, 977.5, 1299.8, 1334.0, 1334.0, 0.08608691909264388, 14.072763922167859, 0.04658370936577853], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 337.7647058823529, 139, 1343, 150.0, 1207.8, 1343.0, 1343.0, 0.09192717204981371, 3.2018200228195686, 0.05320348451297525], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 472.2307692307692, 141, 830, 438.0, 808.0, 830.0, 830.0, 0.08068470280100049, 0.015285969085345795, 0.055185863807324924], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 22, 0, 0.0, 516.9090909090909, 289, 1922, 299.0, 894.7, 1767.9499999999978, 1922.0, 0.11038302911101522, 6.165863319154967, 0.24697026808023842], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3ca936d9-c5d3-405b-8760-4cf699147e65", 3, 0, 0.0, 386.0, 244, 487, 427.0, 487.0, 487.0, 487.0, 0.021900527802720046, 0.025885682438696773, 0.014044283779739092], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7bee4528-d52f-490a-b6fc-c415a34be119", 1, 0, 0.0, 765.0, 765, 765, 765.0, 765.0, 765.0, 765.0, 1.3071895424836601, 0.23616217320261437, 0.9012459150326797], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 490.4285714285714, 174, 1063, 394.0, 920.8000000000001, 1049.9999999999998, 1063.0, 0.10237959428429351, 0.06288746562970764, 0.04629077358752724], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 162.72222222222223, 140, 417, 149.0, 183.00000000000037, 417.0, 417.0, 0.08620235523990595, 0.06406249251715666, 0.043269541595030915], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 251.38888888888883, 139, 584, 148.0, 466.1000000000002, 584.0, 584.0, 0.08620772229619057, 0.09500061063803293, 0.045143062912480006], "isController": false}, {"data": ["login", 21, 0, 0.0, 2528.3809523809527, 1391, 3897, 2367.0, 3675.8, 3881.2, 3897.0, 0.10075421728366629, 23.09952545063523, 0.18383990064914504], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 151.64705882352942, 142, 165, 151.0, 162.6, 165.0, 165.0, 0.09231604670105892, 0.07473633077654086, 0.03281546972576704], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/be444f61-3da8-4fb9-8f37-67fb2d550d67", 3, 0, 0.0, 445.6666666666667, 284, 690, 363.0, 690.0, 690.0, 690.0, 0.03392974281254948, 0.028285830515279692, 0.021758331165599762], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9851a8c3-6511-4d34-9833-0aacc21dd285", 3, 0, 0.0, 734.3333333333334, 249, 1520, 434.0, 1520.0, 1520.0, 1520.0, 0.051300466834248194, 0.03298125716069016, 0.032897760307118794], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/86501623-7762-45b3-a22e-aa243ea75de3", 2, 0, 0.0, 262.5, 250, 275, 262.5, 275.0, 275.0, 275.0, 0.016141268380869368, 0.02298239189385502, 0.01003312238713218], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 1115.4444444444443, 288, 1912, 1506.5, 1868.8000000000002, 1912.0, 1912.0, 0.08602397201353444, 57.23401865764371, 0.18124212940394946], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=461eba98-0713-47b0-be0f-55f5ad0293e8", 1, 0, 0.0, 241.0, 241, 241, 241.0, 241.0, 241.0, 241.0, 4.149377593360996, 0.7496434128630706, 2.8608013485477177], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 597.2142857142858, 289, 1856, 303.0, 1850.5, 1856.0, 1856.0, 0.08203733870873228, 14.12971842880917, 0.18150532290482496], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, 33.333333333333336, 1084.3333333333333, 139, 1712, 1426.5, 1712.0, 1712.0, 1712.0, 0.11764244539429826, 93.83800206364455, 0.20282982162464216], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ca14b8c3-37cf-4987-ad7d-39a6e52cb934", 3, 0, 0.0, 558.3333333333334, 455, 737, 483.0, 737.0, 737.0, 737.0, 0.028932673668373692, 0.02383743393706179, 0.01855383044488808], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/409a8c34-a46c-4964-bd0b-ccf51d0fc093", 2, 0, 0.0, 345.0, 312, 378, 345.0, 378.0, 378.0, 378.0, 0.05963384817222256, 0.0366596752191544, 0.0370673284781442], "isController": false}, {"data": ["register", 23, 5, 21.73913043478261, 1014.9130434782609, 184, 1804, 1066.0, 1623.4, 1770.1999999999996, 1804.0, 0.09482072698639116, 0.030017974711724377, 0.042780445183313205], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3ca936d9-c5d3-405b-8760-4cf699147e65", 1, 0, 0.0, 438.0, 438, 438, 438.0, 438.0, 438.0, 438.0, 2.28310502283105, 0.4124750285388128, 1.574093892694064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 594.0, 291, 1707, 568.0, 1531.7999999999997, 1707.0, 1707.0, 0.09185415721109166, 13.053785379046987, 0.2038172409577687], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 171.26666666666665, 145, 452, 153.0, 276.2000000000001, 452.0, 452.0, 0.10692595021527758, 0.08301379923940008, 0.038008833865586955], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 401.2631578947369, 281, 854, 302.0, 589.0, 854.0, 854.0, 0.10824545511516746, 0.16775931373805741, 0.24344656555686592], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=12019f26-c021-4d4a-b68a-fde105e5e68b", 1, 0, 0.0, 438.0, 438, 438, 438.0, 438.0, 438.0, 438.0, 2.28310502283105, 0.4124750285388128, 1.574093892694064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 174.50000000000003, 141, 420, 148.0, 393.2000000000001, 420.0, 420.0, 0.054928153974601227, 0.040820630053390164, 0.02757135853803225], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/070f0ecc-0fa0-46dc-8ff4-15f862b137f3", 3, 0, 0.0, 723.3333333333334, 233, 1436, 501.0, 1436.0, 1436.0, 1436.0, 0.016565616406586492, 0.0228370395448873, 0.010623132916984173], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 174.2, 138, 432, 146.5, 404.0000000000001, 432.0, 432.0, 0.05492755056081029, 0.02294727161124477, 0.030864563078799066], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 306.7, 144, 1465, 149.0, 1360.4000000000003, 1465.0, 1465.0, 0.054533060668029994, 4.9201229124062715, 0.03159083162917519], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 258.70000000000005, 139, 1297, 144.0, 1182.2000000000005, 1297.0, 1297.0, 0.05458306724088054, 1.6181640678303777, 0.03167310405715939], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c796160b-e41c-4034-bf9c-630db161d889", 1, 0, 0.0, 236.0, 236, 236, 236.0, 236.0, 236.0, 236.0, 4.237288135593221, 0.7655256885593221, 2.9214115466101696], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 141.0, 141, 141, 141.0, 141.0, 141.0, 141.0, 7.092198581560283, 2.0916445035460995, 4.3841422872340425], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 1637.103448275862, 1108, 2418, 1506.0, 2233.1000000000004, 2354.25, 2418.0, 0.25919818382513954, 310.09113972346233, 0.5118151637640939], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=208052d4-f6ef-4ecd-a5d6-c3cb0d7fb758", 1, 0, 0.0, 261.0, 261, 261, 261.0, 261.0, 261.0, 261.0, 3.8314176245210727, 0.6921994731800766, 2.6415828544061304], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, 21.73913043478261, 1014.9130434782609, 184, 1804, 1066.0, 1623.4, 1770.1999999999996, 1804.0, 0.09759823474497158, 0.03089726724942714, 0.04403357856657897], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 2, 0, 0.0, 142.0, 141, 143, 142.0, 143.0, 143.0, 143.0, 0.05651952749675013, 0.015233778895608431, 0.03328249519584016], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 2, 0, 0.0, 142.0, 140, 144, 142.0, 144.0, 144.0, 144.0, 0.05652431958850296, 0.015235070514088685, 0.03323011757058474], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0907248c-faca-4c6f-a112-991921639380", 3, 0, 0.0, 790.6666666666666, 308, 1632, 432.0, 1632.0, 1632.0, 1632.0, 0.041260934147549104, 0.026526804993948397, 0.026459648525609288], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 320.2, 140, 1639, 145.0, 920.8000000000004, 1639.0, 1639.0, 0.10170318941201996, 6.126431949124674, 0.05920767706525277], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 242.73333333333332, 139, 1066, 145.0, 685.0000000000002, 1066.0, 1066.0, 0.10169836265636123, 2.0190965159835925, 0.05930418192142106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 165.6, 140, 436, 146.0, 265.0000000000001, 436.0, 436.0, 0.10170181029222321, 0.0755811305003729, 0.051049541494338595], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 2, 0, 0.0, 140.0, 140, 140, 140.0, 140.0, 140.0, 140.0, 0.05652431958850296, 0.01512467145239239, 0.03223652601531809], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 202.0, 138, 449, 144.0, 438.8, 449.0, 449.0, 0.10170249984744625, 0.037396856714738046, 0.057432778885204996], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 2, 0, 0.0, 146.0, 146, 146, 146.0, 146.0, 146.0, 146.0, 0.056514736217468706, 0.041999720958489924, 0.028367748452909094], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 532.6153846153846, 141, 737, 510.0, 718.1999999999999, 737.0, 737.0, 0.08010647999802815, 0.01500792977126519, 0.05451958449385029], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 2, 0, 0.0, 296.5, 149, 444, 296.5, 444.0, 444.0, 444.0, 0.0416311067629733, 0.032768234424762184, 0.014798557482150664], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1249.3333333333333, 814, 1950, 1156.0, 1899.2, 1947.8, 1950.0, 0.1018542320433414, 0.052717522444307566, 0.04684896805899785], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 2, 0, 0.0, 290.5, 290, 291, 290.5, 291.0, 291.0, 291.0, 0.05628570624489911, 0.08723185137759265, 0.1265878725410182], "isController": false}, {"data": ["addBook", 59, 8, 13.559322033898304, 1430.5593220338985, 707, 2858, 1131.0, 2463.0, 2486.0, 2858.0, 0.2840211619835268, 99.02634559538538, 1.0300656257371312], "isController": true}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 267.68965517241384, 142, 767, 152.0, 574.4, 597.8499999999999, 767.0, 0.26073626526768173, 0.193769822137408, 0.12603950322998286], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 947.7068965517242, 689, 1419, 876.5, 1232.4, 1327.1, 1419.0, 0.2602752635287043, 76.52956942954842, 0.1309001569504714], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 226.24137931034483, 141, 596, 150.0, 438.6, 451.04999999999967, 596.0, 0.26130952112777583, 0.4623953635581346, 0.12708216945471912], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 1365.5862068965519, 962, 1954, 1322.5, 1658.5, 1771.1999999999996, 1954.0, 0.2599404825929511, 233.894903163767, 0.13047793755153994], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a4f361ae-7fd5-4f66-8a84-876a2bd558eb", 3, 0, 0.0, 671.6666666666666, 325, 1180, 510.0, 1180.0, 1180.0, 1180.0, 0.023455641472701544, 0.027723774149537535, 0.01504154091836655], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 194.21052631578948, 142, 436, 153.0, 423.0, 436.0, 436.0, 0.10811364451095645, 0.08076849419031415, 0.03843102207225405], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 8, 4.545454545454546, 207.93749999999997, 141, 624, 154.0, 352.6, 459.6500000000001, 554.6999999999991, 0.7344901553279748, 1.6315206541448615, 0.35163210833103803], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 151.3, 145, 164, 149.0, 163.2, 164.0, 164.0, 0.052688149381441125, 0.04080244380808869, 0.01872899060043415], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 149.35714285714283, 144, 155, 148.5, 154.5, 155.0, 155.0, 0.08533931521295207, 0.06925485443551091, 0.030335459704604058], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/51fc43a9-0c77-438b-a4b5-71cd300ab306", 1, 0, 0.0, 320.0, 320, 320, 320.0, 320.0, 320.0, 320.0, 3.125, 0.9979248046875, 1.8646240234375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 484.0, 286, 1616, 298.5, 1539.7000000000003, 1616.0, 1616.0, 0.05448938001983414, 6.594827314640752, 0.12115373088784996], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/461eba98-0713-47b0-be0f-55f5ad0293e8", 3, 0, 0.0, 400.66666666666663, 240, 679, 283.0, 679.0, 679.0, 679.0, 0.06296964862936065, 0.02849212617018597, 0.040380927018177235], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 508.59999999999997, 288, 1786, 297.0, 1246.0000000000005, 1786.0, 1786.0, 0.10159848279599025, 8.250101069324032, 0.2267643740686806], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 22, 0, 0.0, 165.0454545454545, 147, 444, 151.0, 159.5, 401.5499999999994, 444.0, 0.1152604887044721, 0.09556265127939141, 0.04097150184416782], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f4a3c617-c8ce-4285-ae4a-db171fcffa80", 1, 0, 0.0, 229.0, 229, 229, 229.0, 229.0, 229.0, 229.0, 4.366812227074235, 1.394480076419214, 2.605588155021834], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 169.55555555555557, 145, 436, 154.0, 193.0000000000004, 436.0, 436.0, 0.08337270377678349, 0.06472783154545202, 0.029636390795653503], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7bee4528-d52f-490a-b6fc-c415a34be119", 3, 0, 0.0, 344.6666666666667, 237, 552, 245.0, 552.0, 552.0, 552.0, 0.017138939670932357, 0.02362741194869744, 0.010990791390539306], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ca14b8c3-37cf-4987-ad7d-39a6e52cb934", 1, 0, 0.0, 775.0, 775, 775, 775.0, 775.0, 775.0, 775.0, 1.2903225806451613, 0.2331149193548387, 0.889616935483871], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 162.3157894736842, 139, 438, 147.0, 153.0, 438.0, 438.0, 0.10833803748496097, 0.08051293606060088, 0.0543806164719433], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 221.78947368421052, 139, 442, 150.0, 433.0, 442.0, 442.0, 0.10833803748496097, 0.028988888936405572, 0.0617865370031418], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 203.1578947368421, 140, 426, 148.0, 417.0, 426.0, 426.0, 0.10833433114954129, 0.0291994876926498, 0.0636887376484608], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 189.68421052631578, 139, 443, 144.0, 430.0, 443.0, 443.0, 0.1083392729864576, 0.02920081967213115, 0.06379744297933], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 29.41176470588235, 0.37735849056603776], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.882352941176471, 0.07547169811320754], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.882352941176471, 0.07547169811320754], "isController": false}, {"data": ["401/Unauthorized", 10, 58.8235294117647, 0.7547169811320755], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1325, 17, "401/Unauthorized", 10, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 176, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
